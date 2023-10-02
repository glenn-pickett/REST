let fs = require('fs');
let path = require('path');
let zlib = require('zlib');

let lib = {};

lib.baseDir = path.join(__dirname,'/../.logs/');

lib.append = (file, str, callback)=>{
    fs.open(lib.baseDir+file+'.log', 'a', (err, fileDescriptor)=>{
        if(!err && fileDescriptor){
            fs.appendFile(fileDescriptor, str+'\n', (err)=>{
                if(!err){
                    fs.close(fileDescriptor, (err)=>{
                        if(!err){
                            callback(false)
                        }else{
                            callback('Error closing appended file')
                        }
                    })
                }else{
                    callback("Error Appending file")
                }
            })
        }else{
            callback(400, {"Error": "Could not open append file"})
        }
    })
}

lib.list = (includeCompressed, callback)=>{
    fs.readdir(lib.baseDir, (err, data)=>{
        if(!err && data && data.length > 0){
            let trimmedFileNames = [];
            data.forEach((fileName)=>{
                if(fileName.indexOf('.log')> -1){
                    trimmedFileNames.push(fileName.replace('.log',''));
                }

                if(fileName.indexOf('.gz.b64')> -1 && includeCompressed){
                    trimmedFileNames.push(fileName.replace('.gz.b64',''));
                }
            });
            callback(false, trimmedFileNames);
        }else{
            callback(err, data);
        }
    })
}

lib.compress = (logId, fileId, callback) =>{
    let sourceFile = logId+'.log';
    let destFile = fileId+'.gz.b64';

    fs.readFile(lib.baseDir+sourceFile,'utf8', (err, inputString)=>{
        if(!err && inputString){
            zlib.gzip(inputString, (err, buffer)=>{
                if(!err && buffer){
                    fs.open(lib.baseDir+destFile,'wx', (err, fileDescriptor)=>{
                        if(!err && fileDescriptor){
                            fs.writeFile(fileDescriptor, buffer.toString('base64'), (err)=>{
                                if(!err){
                                    fs.close(fileDescriptor, (err)=>{
                                        if(!err){
                                            callback(false)
                                        }else{
                                            callback(err)
                                        }
                                    })
                                }else{
                                    callback(err)
                                }
                            })
                        }else{
                            callback(err)
                        }
                    })
                }else{
                    callback(err);
                }
            })
        }
    })
}

lib.decompress = (fileId, callback) => {
    let fileName = fileId+'.gz.b64';
    fs.readFile(lib.baseDir+fileName,'utf8', (err, str)=>{
        if(!err && str){
            let inputBuffer = Buffer.from(str, 'base64');
            zlib.unzip(inputBuffer, (err, outputBuffer)=>{
                if(!err && outputBuffer){
                    let newStr = outputBuffer.toString();
                    callback(false, newStr);
                }else{
                    callback(err);
                }
            })
        }else{
            callback(err+" reading error "+str+' '+lib.baseDir+fileName)
        }
    })
}

lib.truncate = (logId, callback) => {
    fs.truncate(lib.baseDir+logId+".log",0,(err)=>{
        if(err){
            callback(false)
        }else{
            callback(err)
        }

    })
}

module.exports = lib;