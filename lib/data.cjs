const fs = require('fs');
const path = require('path');
const helpers = require('./helpers.cjs');

let lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');

lib.create = function(dir, file, data, callback){
    fs.open(lib.baseDir+dir+'/'+file+'.cjson','wx', function(err, fileDescriptor){
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
    fs.readFile(lib.baseDir+dir+'/'+file+'.cjson','utf8', function(err, data){
        if(!err && data){
            //console.log('Read data', data);
            let parsedData = helpers.parseJsonToObject(data);
            //parsedData.replace('%3D','=')
            //console.log('parsedData', parsedData);
            callback(false, parsedData);
            //callback(false, data);
        }else{
            callback(err, data);
        }
    })
};

lib.update = function(dir, file, data, callback){
    fs.open(lib.baseDir+dir+'/'+file+'.cjson','r+', function(err, fileDescriptor){
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
    fs.unlink(lib.baseDir+dir+'/'+file+'.cjson', function(err){
        if(!err){
            callback(false);
        }else{
            callback('Error deleting file');
        }
    })
}

lib.list = (dir, callback)=>{
    fs.readdir(lib.baseDir+dir+'/',(err, data)=>{
        if(!err && data && data.length > 0){
            let trimmedFileNames = [];
            data.forEach((fileName)=>{
                fileName = fileName.replace(".cjson","");
                trimmedFileNames.push(fileName)
            })
            //console.log('List trimmedFileNames', trimmedFileNames);
            callback(false, trimmedFileNames);
        }else{
            //console.log('List read error in list', 'Error:',err, 'data: ',data, 'data.length',data.length)
            callback(err, data);
        }
    })

}


module.exports = lib;