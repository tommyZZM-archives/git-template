/**
 * Created by tommyZZM on 2015/7/26.
 */
var https = require('https');
var fs = require('fs');
var opts = require("green").args;

var log = require('./libs/colorlog.js');

var argv = process.argv.slice(2);
var args = argv.filter(function(ele,i){
    return !(ele.match(/^-{1}(.+)$/) || (argv[i - 1]||"").match(/^-{1}(.+)$/));
});
//console.log(args);

global.customNameScape = {
    isDeving:false
};

log("grey","welcome to use git-template!");

if(fs.existsSync("./package.json")){
    var package_json = fs.readFileSync("./package.json");
    package_json = JSON.parse(package_json);
    if(package_json.name==="git-template"){
        global.customNameScape.isDeving = true;
        log("yellow","now is runing in devlope mode");
    }
}

exports.run = function(){
    if(args.length<2||args.length>3){
        console.log("[usesage] git-template requires two or three param");
        console.log("[example] git-template [username/reponame] [new projct name] [branch name](optional,default 'master')")
    }else{
        var gitProjectTemplate = require("./libs/gitProjectTemplate.js");

        var project = new gitProjectTemplate(opts["repo"]||opts["r"]||"git",args[0],args[1],args[2]||"master");
        project.start();
    }
};