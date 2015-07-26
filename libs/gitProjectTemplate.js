/**
 * Created by tommyZZM on 2015/7/26.
 */
var path = require("path");
var https = require('https');
var cp = require("child_process");
var iconv = require("iconv-lite");
//var gulp_util = require("gulp-util");

var chalk = require('chalk');
var log = require('./colorlog.js');

function gitProjectTemplate(repotype,repo,name,branch){

    var that = this;

    var constructor = function(){
        that.name = name;
        that.repo = repo;
        that.repotype = repotype;
        that.branch = branch;

        if(!!name && !!repo && !!repotype && !!branch){
            that.valid = true;
        }

        that.url = "https://github.com/"+repo+"/archive/"+branch+".zip";
    };

    this.start = function(){
        if(!that.valid)return;

        //这里要处理以下路径的斜杠,避免在系统环境下运行,单斜杠被转义
        var gulp_js_path = path.normalize(path.join(__dirname,"..\\","node_modules\\gulp\\bin\\gulp.js"));
        gulp_js_path = gulp_js_path.split(path.sep).join("\\\\");
        var cwd_path = path.join(__dirname,"../").split(path.sep).join("\\\\");

        console.log(gulp_js_path,cwd_path);

        //创建一个子进程,来运行gulp
        var gulp_download = cp.spawn("node",[gulp_js_path],{
            encoding: 'utf8',
            timeout: 0,
            maxBuffer: 200*1024,
            killSignal: 'SIGTERM',
            stdio: ['pipe', 'pipe', 'pipe',"ipc"],//建立管道通信
            cwd: path.join(__dirname,"../")
        });

        gulp_download.stderr.on('data',function(data){
            console.log(iconv.decode(data, 'utf8'));
        });

        gulp_download.stdout.on('data', function(data) {
            var str = iconv.decode(data, 'utf8');
            str = str.replace(/\n$/i,"");
            //console.log(str);
        });

        gulp_download.on('message', function(data) {
            if(data){
                switch (data.cmd){
                    case "ready":{
                        gulp_download.send({
                            cmd:"download-archive"
                            ,url:that.url,name:that.name
                            ,cwd:process.cwd()
                            ,dev:global.customNameScape.isDeving});

                        log("green","downloading from",chalk.cyan(that.url));
                        break;
                    }
                    case "finished":{
                        gulp_download.kill();
                        log("green",that.name,"create finish");
                        //console.log("finished");
                        break;
                    }
                }
            }
        });

        gulp_download.on('error', function(err) {
            log("red",err);
        });

        gulp_download.on('exit', function(code) {
            if(code === 1){
                log("red",chalk.red("template create fail"),code);
            }
        });
    };

    constructor.bind(this)();

    return this;
}

module.exports = gitProjectTemplate;