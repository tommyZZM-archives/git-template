/**
 * Created by tommyZZM on 2015/7/26.
 */
var path = require('path');

var gulp = require("gulp");
var download = require("gulp-download");
var unzip = require("gulp-unzip");
var clean = require("gulp-clean");
var through = require("through");
//var git = require("gulp-git");
var rename = require("gulp-rename");

var cwd_path = process.cwd();

gulp.task("default",function(){
    if(ischildprocess()){
        process.stdin.resume();//keep the process on listening;

        process.on("message",function(data){
            if(data){
                switch (data.cmd){
                    case "download-archive":{
                        //if(data.dev){gulp_util.log("devloping...")}
                        download_archive_config.isdeving = data.dev;
                        download_archive_config.url = data.url;
                        download_archive_config.name = data.name;
                        download_archive_config.path = data.dev?"./tmp/unnzip":path.join(cwd_path,data.name);
                        gulp.start("download-archive");
                        break;
                    }
                }
            }
        });

        process.send({ cmd: "ready" });
    }
});

var download_archive_config = {
    isdeving:false,
    url:"",
    name:"",
    path:""
};

gulp.task("check-clear",function(cb){
    var config = download_archive_config;

    if(config.isdeving){
        return gulp.src(config.path)
            .pipe(clean());
    }else{
        cb();
    }
});

//下载zip包并解压
gulp.task("download-archive",["check-clear"],function(){
    var config = download_archive_config;

    return download(config.url)
        .pipe(unzip())
        .pipe(rename(function (path) {
            //console.log(path.dirname.match(/^(\w|-)+\\?/i))
            //console.log(path.dirname,path.dirname.split("\\").join("/").lastIndexOf("/"));
            path.dirname = path.dirname.replace(/^(\w|-)+\\?/i,config.name+"//")
        }))
        .pipe(gulp.dest(config.path))
        .pipe(onfinish("finished"))
});


function onfinish(cmd){
    var config = download_archive_config;

    var onEnd = function() {
        this.emit('end');
        if(ischildprocess()){
            //gulp_util.log(config.name,"create finish...")
            process.send({ cmd: cmd });
        }
    };
    return through(function(){},onEnd);
}

//是否在子进程运行
function ischildprocess(){
    return (typeof process!== "undefined" && typeof process.send === "function")
}