var chalk = require('chalk');
var dateformat = require('dateformat');

module.exports = function (color) {
    var args = [];
    for (var i in arguments) {
        if (i !== "0") {
            args.push(arguments[i]);
        }
    }
    if (typeof chalk[color] === "function") {
        var time = '[' + chalk[color](dateformat(new Date(), 'HH:MM:ss')) + ']';
        process.stdout.write(time + ' ');
        console.log.apply(console, args);
    }
    return this;
};
