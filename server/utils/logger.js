const shell = require('shelljs');

class UnhandledRejectionLogger{
    static doLog(msg,route){
        if (shell.exec(`echo ${msg} >> server/logs/${route}/${route}.log`).code !== 0) {
                shell.mkdir(`-p`,`server/logs/${route}`);
                shell.exec(`echo ${msg} >> server/logs/${route}/${route}.log`);
        }
    }
}
class UnhandledExceptionLogger extends UnhandledRejectionLogger{}
class UserLogger extends UnhandledRejectionLogger{}

module.exports.UnhandledRejectionLogger=UnhandledRejectionLogger
module.exports.UnhandledExceptionLogger=UnhandledExceptionLogger
module.exports.UserLogger=UserLogger