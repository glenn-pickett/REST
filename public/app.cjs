//import { env } from 'node:process';
//const helpers = require("../lib/helpers");

const app = {};
//const process = require("process");

app.config = {
    'sessionToken': false
}

app.client = {};

app.client.request = (headers, path, method, queryStringObject, payload, callback) => {

    headers = typeof (headers) == 'object' && headers !== null ? headers : {};
    path = typeof (path) == 'string' ? path : '/';
    let cMethod = typeof (method) == 'string' && ['post', 'get', 'put', 'delete', 'GET', 'POST', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof (queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof (payload) == 'object' && payload !== null ? payload : {};
    callback = typeof (callback) == 'function' ? callback : false;

    let requestUrl = path + '?';
    let counter = 0;
    for (let queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++;
            if (counter > 1) {
                requestUrl += '&';
            }
            requestUrl += queryKey + "=" + queryStringObject[queryKey];
        }
    }

    //console.trace('Payload app req', 'path', path, 'method', cMethod, payload, 'requestUrl', requestUrl, 'queryStringObject', queryStringObject)
    const xhr = new XMLHttpRequest();
    //if( payload.method && payload.method != cMethod ) cMethod = payload.method;
    xhr.open(cMethod, requestUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    for (let headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }

    if (app.config.sessionToken) {
        //console.log('Success on app token', app.config.sessionToken);
        xhr.setRequestHeader("token", app.config.sessionToken.tokenId);
    } else {
        //console.log('Failing miserably on token', app.config.sessionToken);
    }

    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let statusCode = xhr.status;
            let responseReturned = xhr.responseText;

            if (callback) {
                let parsedResponse = typeof (responseReturned) == 'string' ? JSON.parse(responseReturned) : responseReturned;
                try {
                    //console.log('Trying readystate', app.config.sessionToken, parsedResponse)
                    callback(statusCode, parsedResponse);
                } catch (e) {
                    console.log('Failing readystate', app.config, parsedResponse)
                    callback(statusCode, false)
                }
            }
        } else {
            //console.log('Failing miserably on readystate', app.config.sessionToken)
        }
    }

    let payloadString = JSON.stringify(payload);
    //console.log('payload xhr payloadString', payloadString, payloadString.lastName)
    //console.log('payload payload', payload, payload.lastName)
    xhr.send(payloadString);
    //xhr.send(payload);
}

app.bindLogoutButton = () => {
    document.getElementById('logoutButton').addEventListener("click", (e) => {
        e.preventDefault();
        app.logUserOut();
    });
};

app.logUserOut = () => {
    let tokenId = typeof (app.config.sessionToken.tokenId) == 'string' ? app.config.sessionToken.tokenId : false;

    let queryStringObject = {
        'tokenId': tokenId
    }

    app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, (statusCode, responsePayload) => {
        app.setSessionToken(false);

        window.location = '/session/delete';
    });
};


// Bind the forms
app.bindForms = function () {
    if (document.querySelector("form")) {

        var allForms = document.querySelectorAll("form");
        for (var i = 0; i < allForms.length; i++) {
            allForms[i].addEventListener("submit", function (e) {

                // Stop it from submitting
                e.preventDefault();
                var formId = this.id;
                var path = this.action;
                var method = typeof (e.target.attributes.method.value) == 'string' ? e.target.attributes.method.value.toUpperCase() : e.target.attributes.method.value;

                // Hide the error message (if it's currently shown due to a previous error)
                document.querySelector("#" + formId + " .formError").style.display = 'none';

                // Hide the success message (if it's currently shown due to a previous error)
                if (document.querySelector("#" + formId + " .formSuccess")) {
                    document.querySelector("#" + formId + " .formSuccess").style.display = 'none';
                }


                // Turn the inputs into a payload
                var payload = {};
                var elements = this.elements;
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].type !== 'submit') {
                        // Determine class of element and set value accordingly
                        var classOfElement = typeof (elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
                        var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
                        var elementIsChecked = elements[i].checked;
                        // Override the method of the form if the input's name is _method
                        var nameOfElement = elements[i].name;
                        if (nameOfElement == '_method') {
                            method = valueOfElement;
                        } else {
                            // Create an payload field named "method" if the elements name is actually httpmethod
                            if (nameOfElement == 'httpmethod') {
                                nameOfElement = 'method';
                            }
                            // If the element has the class "multiselect" add its value(s) as array elements
                            if (classOfElement.indexOf('multiselect') > -1) {
                                if (elementIsChecked) {
                                    payload[nameOfElement] = typeof (payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                                    payload[nameOfElement].push(valueOfElement);
                                }
                            } else {
                                payload[nameOfElement] = valueOfElement;
                            }

                        }
                    }
                }

                // If the method is DELETE, the payload should be a queryStringObject instead
                var queryStringObject = method == 'DELETE' ? payload : {};

                // Call the API
                app.client.request(undefined, path, method, queryStringObject, payload, function (statusCode, responsePayload) {
                    // Display an error on the form if needed
                    if (statusCode !== 200) {

                        if (statusCode == 403) {
                            // log the user out
                            app.logUserOut();

                        } else {

                            // Try to get the error from the api, or set a default error message
                            var error = typeof (responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

                            // Set the formError field with the error text
                            document.querySelector("#" + formId + " .formError").innerHTML = error;

                            // Show (unhide) the form error field on the form
                            document.querySelector("#" + formId + " .formError").style.display = 'block';
                        }
                    } else {
                        // If successful, send to form response processor
                        app.formResponseProcessor(formId, payload, responsePayload);
                    }

                });
            });
        }
    }
};


app.formResponseProcessor = (formId, requestPayload, responsePayload) => {
    let functionToCall = false;
    //console.log('FormId', formId, requestPayload)
    if (formId == 'accountCreate') {
        //@TODO
        //console.log('Account success');
        let newPayload = {
            'phone': requestPayload.phone,
            'password': requestPayload.password
        }

        app.client.request(undefined, 'api/tokens', 'POST', undefined, newPayload, (newStatusCode, newResponsePayload) => {
            if (newStatusCode !== 200) {
                //console.log('app:152 token post not 200');
                document.querySelector("#" + formId + ' .formError').innerHTML = 'Sorry, an error occurred. Please try again.';
                document.querySelector('#' + formId + ' .formError').style.display = 'block';
            } else {
                //console.log('app:157 token post 200');
                app.setSessionToken(newResponsePayload);
                window.location = '/checks/all';
            }
        });
    }

    if (formId == 'sessionCreate') {
        //console.log('formResponseProcessor', responsePayload)
        app.setSessionToken(responsePayload);
        window.location = '/checks/all';
    }

    let formWithSuccessMsg = ['accountEdit1, accountEdit2'];
    if (formWithSuccessMsg.indexOf(formId) > -1) {
        document.querySelector("#" + formId + " .formSuccess").style.display = "block";
    }

    if (formId == 'accountEdit3') {
        //console.log('accountEdit3', true);
        app.logUserOut(false);
        window.location = '/account/delete';
    }

    if (formId == 'checksCreate') {
        window.location = '/checks/all';
    }

    // If the user just deleted a check, redirect them to the dashboard
    if (formId == 'checksEdit2') {
        window.location = '/checks/all';
    }
};


app.getSessionToken = () => {
    let tokenString = localStorage.getItem('token');
    //console.log("Getting ses token", tokenString, document.cookie)
    if (typeof (tokenString) == 'string') {
        try {
            //console.log('getSes Success', tokenString)
            let token = JSON.parse(tokenString);
            app.config.sessionToken = token;
            if (typeof (token) == 'object') {
                app.setLoggedInClass(true)
            } else {
                app.setLoggedInClass(false)
            }
        } catch (e) {
            //console.log('getSes Error')
            app.config.sessionToken = false;
            app.setLoggedInClass(false)
        }
    } else {
        console.log('getSes tokenString fail', tokenString)
    }
};

app.setLoggedInClass = (add) => {
    let target = document.querySelector('body');
    if (add) {
        target.classList.add('loggedIn');
    } else {
        target.classList.remove('loggedIn');
    }
}

app.setSessionToken = (token) => {
    //console.log("Attempting setSesTok", token);
    app.config.sessionToken = token;
    let tokenString = JSON.stringify(token);
    localStorage.setItem('token', tokenString);
    sessionStorage.setItem('token', tokenString);
    document.cookie = `${tokenString}; SameSite=lax; Secure;`;
    //helpers.generateJwt(tokenString);
    if (typeof (tokenString) == 'string') {
        app.setLoggedInClass(true)
    } else {
        app.setLoggedInClass(false)
    }
    //const cookieRead = JSON.parse(document.cookie);
    //console.log('Cookie read', cookieRead.tokenId);
};

// Load the dashboard page specifically
app.loadCheckListPage = function () {
    //console.log('Checks all loadChecks');
    // Get the phone number from the current token, or log the user out if none is there
    var phone = typeof (app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
    if (phone) {
        // Fetch the user data
        var queryStringObject = {
            'phone': phone
        };
        app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
            if (statusCode == 200) {

                // Determine how many checks the user has
                var allChecks = typeof (responsePayload.checks) == 'object' && responsePayload.checks instanceof Array && responsePayload.checks.length > 0 ? responsePayload.checks : [];
                if (allChecks.length > 0) {
                    // Show each created check as a new row in the table
                    allChecks.forEach(function (checkId) {
                        // Get the data for the check
                        var newQueryStringObject = {
                            'id': checkId
                        };
                        app.client.request(undefined, 'api/checks', 'GET', newQueryStringObject, undefined, function (statusCode, responsePayload) {
                            if (statusCode == 200) {
                                var checkData = responsePayload;
                                //console.log('checks list data', checkData)
                                // Make the check data into a table row
                                var table = document.getElementById("checksListTable");
                                var tr = table.insertRow(-1);
                                tr.classList.add('checkRow');
                                var td0 = tr.insertCell(0);
                                var td1 = tr.insertCell(1);
                                var td2 = tr.insertCell(2);
                                var td3 = tr.insertCell(3);
                                var td4 = tr.insertCell(4);
                                td0.innerHTML = responsePayload.method.toUpperCase();
                                td1.innerHTML = responsePayload.protocol + '://';
                                td2.innerHTML = responsePayload.url;
                                var state = typeof (responsePayload.state) == 'string' ? responsePayload.state : 'unknown';
                                td3.innerHTML = state;
                                td4.innerHTML = '<a href="/checks/edit?id=' + responsePayload.id + '">View / Edit / Delete</a>';
                            } else {
                                console.log("Error trying to load check ID: ", checkId);
                            }
                        });
                    });

                    if (allChecks.length < 5) {
                        // Show the createCheck CTA
                        document.getElementById("createCheckCTA").style.display = 'block';
                    }
                    //console.log('Checks all allChecks', allChecks)

                } else {
                    //console.log('Checks all ', responsePayload)
                    // Show 'you have no checks' message
                    document.getElementById("noChecksMessage").style.display = 'table-row';

                    // Show the createCheck CTA
                    document.getElementById("createCheckCTA").style.display = 'block';

                }
            } else {
                // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
                app.logUserOut();
            }
        });
    } else {
        app.logUserOut();
    }
};




app.renewToken = (callback) => {
    // /app.config = JSON.parse(app.config);
    const cookieRead = document.cookie;
    //console.log('Cookie read', cookieRead, cookieRead.tokenId);
    let tokenString = localStorage.getItem('token');
    let sessionString = sessionStorage.getItem('token');
    let currentToken = typeof (app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
    //console.log("SessionR pre if ", currentToken, app.config, tokenString, 'sessionString', sessionString);
    if (tokenString) {
        let payload = {
            'id': currentToken.tokenId,
            'extend': true,
            //'phone': app.config.sessionToken.phone,
            //'pass': app.config.sessionToken.pass
        };
        //console.log('renewToken payload', payload, app.config, currentToken.tokenId, tokenString, env);
        //console.log('renewToken payload', payload, app.config, currentToken.tokenId, tokenString);

        app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, (statusCode, responsePayload) => {

            if (statusCode == 200) {
                //console.log("SessionR status", statusCode);
                let queryStringObject = { 'id': currentToken.tokenId }
                app.client.request(undefined, 'api/tokens', "GET", queryStringObject, undefined, (statusCode, responsePayload) => {
                    if (statusCode == 200) {
                        //console.log("SessionR GET token 200");
                        app.setSessionToken(responsePayload);
                        callback(false);
                    } else {
                        //console.log("SessionR GET token not 200", currentToken, app.config);
                        app.setSessionToken(false);
                        callback(true);
                    }
                });
            } else {
                //console.log("SessionR status not 200 checking broken code", JSON.stringify(tokenString).tokenId, tokenString, statusCode, payload, responsePayload);
                //console.log("SessionR status not 200", statusCode);
                app.setSessionToken(false);
                callback(true);
            }
        })
    } else {
        //console.log("SessionR no token", currentToken, app.config);
        app.setSessionToken(false);
        callback(true);
    }
};

app.loadDataOnPage = function () {
    // Get the current page from the body class
    var bodyClasses = document.querySelector("body").classList;
    var primaryClass = typeof (bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

    // Logic for account settings page
    if (primaryClass == 'accountEdit') {
        app.loadAccountEditPage();
    }

    // Logic for dashboard page
    if (primaryClass == 'checkList') {
        app.loadCheckListPage();
    }

    // Logic for check details page
    if (primaryClass == 'checkEdit') {
        app.loadChecksEditPage();
    }
};

// Load the account edit page specifically
app.loadAccountEditPage = function () {
    // Get the phone number from the current token, or log the user out if none is there
    var phone = typeof (app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
    //console.log('Loading account info ', app.config.sessionToken);
    if (phone) {
        // Fetch the user data
        let queryStringObject = {
            'phone': phone
        };

        app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
            //console.log('Loading account info responsePayload', responsePayload);
            if (statusCode == 200) {
                // Put the data into the forms as values where needed
                document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.fName;
                document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lName;
                document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;

                // Put the hidden phone field into both forms
                var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
                for (var i = 0; i < hiddenPhoneInputs.length; i++) {
                    hiddenPhoneInputs[i].value = phone;
                }

                //console.log('Is token here? ', app.config.sessionToken.tokenId);
                let value = app.config.sessionToken.tokenId;
                document.querySelector("#token").value = value;

            } else {
                // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
                app.logUserOut();
            }
        });
    } else {
        app.logUserOut();
    }
};

// Load the checks edit page specifically
app.loadChecksEditPage = function () {
    // Get the check id from the query string, if none is found then redirect back to dashboard
    var id = typeof (window.location.href.split('=')[1]) == 'string' && window.location.href.split('=')[1].length > 0 ? window.location.href.split('=')[1] : false;
    if (id) {
        // Fetch the check data
        var queryStringObject = {
            'id': id
        };
        app.client.request(undefined, 'api/checks', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
            //console.log('Loading check edit info ', responsePayload);
            if (statusCode == 200) {

                // Put the hidden id field into both forms
                var hiddenIdInputs = document.querySelectorAll("input.hiddenIdInput");
                for (var i = 0; i < hiddenIdInputs.length; i++) {
                    hiddenIdInputs[i].value = responsePayload.id;
                }

                // Put the data into the top form as values where needed
                document.querySelector("#checksEdit1 .displayIdInput").value = responsePayload.id;
                document.querySelector("#checksEdit1 .displayStateInput").value = responsePayload.state;
                document.querySelector("#checksEdit1 .protocolInput").value = responsePayload.protocol;
                document.querySelector("#checksEdit1 .urlInput").value = responsePayload.url;
                document.querySelector("#checksEdit1 .methodInput").value = responsePayload.method;
                document.querySelector("#checksEdit1 .timeoutInput").value = responsePayload.timeoutSeconds;
                var successCodeCheckboxes = document.querySelectorAll("#checksEdit1 input.successCodesInput");
                for (var i = 0; i < successCodeCheckboxes.length; i++) {
                    if (responsePayload.successCodes.indexOf(parseInt(successCodeCheckboxes[i].value)) > -1) {
                        successCodeCheckboxes[i].checked = true;
                    }
                }
            } else {
                // If the request comes back as something other than 200, redirect back to dashboard
                window.location = '/checks/all';
            }
        });
    } else {
        window.location = '/checks/all';
    }
};


app.tokenRenewalLoop = () => {
    setInterval(() => {
        app.renewToken((err) => {
            if (!err) {
                //console.log('Token renew success @', Date.now());
            } else {
                //console.log("Token renew false error", err);
            }
        });
    }, 1000 * 10);
}

app.init = () => {
    app.bindForms();

    app.bindLogoutButton();

    app.getSessionToken();

    app.tokenRenewalLoop();

    app.loadDataOnPage();
}

window.onload = () => {
    app.init();
}