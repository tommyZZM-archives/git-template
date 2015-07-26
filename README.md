# git-template

git-template 是让你能从一个github仓库(目前只支持github)做作为模板,创建新项目的工具。

git-template is a tool for you to create a new project use a github(only support github in this version) repository as template.

# Install && Useage

````console
$ npm install git-template -g
````

````console
$ git-template [username/reponame] [new projct name] [branch name](optional,default 'master')
````

### Example
````console
$ git-template tommyZZM/newProjectWorkflow myproject react-es6
````
this example will download the tommyZZM/newProjectWorkflow of react-es6 branch on github and use its file to create a new project(folder inculd repo file) name myproject.

这个例子表示下载在Githu上的tommyZZM/newProjectWorkflow仓库的react-es6分支,并且使用其文件创建一个新项目（文件夹），并命名为myproject


<!--
### Require
git-template require [gulp](https://github.com/wearefractal/gulp) installed global
可能需要安装[gulp](https://github.com/wearefractal/gulp)
-->