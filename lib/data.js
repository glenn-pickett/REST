const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

let lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');

lib.create = function(dir, file, data, callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error: Closing file');
                        }
                    });
                }else{
                    callback("Error: Could not write");
                }
            })
        }else{
            callback('Could not create new file, may exist');
        }
    })
}


lib.read = function(dir, file, callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8', function(err, data){
        if(!err && data){
            console.log('Read data', data);
            let parsedData = helpers.parseJsonToObject(data);
            //parsedData.replace('%3D','=')
            console.log('parsedData', parsedData);
            callback(false, parsedData);
            //callback(false, data);
        }else{
            callback(err, data);
        }
    })
};

lib.update = function(dir, file, data, callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, function(err){
                if(!err){
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if(!err){
                            fs.close(fileDescriptor, function(err){
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error closing file');
                                }
                            })
                        }else{
                            callback('Error truncating file');
                        }
                    })
                }else{
                    callback('Error truncating file');
                }
            })
        }else{
        callback('Could not open for updating');
        }
    })
};

lib.delete = function(dir, file, callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        if(!err){
            callback(false);
        }else{
            callback('Error deleting file');
        }
    })
}


module.exports = lib;