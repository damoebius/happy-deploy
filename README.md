# happy-deploy

Npm scripts collection to manage deployments

## Installation
```
npm i happy-deploy
```
## Methods

* run
* addTask
* git
* getCache
* getConfig
* CompileHaxeTask
* CompassTask
* PackageTask
* SendSSHTask

## Usage

```javascript

var deploy = require("happy-deploy"); //Include happy-deploy module
...

deploy.addTask(new CleanTask(output)); // Add somes tasks
deploy.addTask(new CompassTask('sakuraTest/src'));


deploy.run(); // run deploy
```

### addTask
**addTask(task)**

Add a task to the queue
Exemple :
```javascript
var CompassTask = deploy.CompassTask;
deploy.addTask(new CompassTask('sakuraTest/src'));
```

### run()
Start deployment

The module execute each task in his queue.

### git.getBranchName()
**git.getBranchName()**

Return the current branch name

### git.getCurrentTag()
**git.getCurrentTag()**

Return the current branch tag name or ""

Exemple :
```javascript
var deploy = require("happy-deploy");
var currentTag = deploy.git.getCurrentTag();
```

### getCache()
**getCache(env)**

Return an instance of Cache with 'env' as the target cache

Exemple :
```javascript
var deploy = require("happy-deploy");
var cache = deploy.getCache('local');
```
### Cache.flush()
**flush()**

Save the cache

### Cache.setValue()
**setValue(key,value)**

Save a value to the cache

### Cache.getValue()
**getValue(key)**

Return a data from the cache

If a value is not found, a prompt will ask for it's value and save it.

### getConfig()
**getConfig(target)**

Load a configuration from 'target'.json and return it

Exemple :
```javascript
var config = deploy.getConfig(__dirname+'/local.json');
```
### CompileHaxeTask
**CompileHaxeTask(main, output, minify=false)**

Create a new instance  of CompileHaxeTask.
 * @param main //The main class to compile
 * @param output //The output file
 * @param minify //minify or not

@property dir //the home directory

@property src //src folder list

@property libs //list of haxe libs

@property options //optionnals arguments

@property hxml

Exemple :
```javascript
    var compileDefault = new deploy.CompileHaxeTask('DefaultApplication',this.output+this.config.output.js+'/DefaultApplication.js',this.config.minify);
    compileDefault.hxml = 'compile-default.hxml';
    compileDefault.dir = 'heidi';
    compileDefault.options = '-D this.version='+this.version+' -D tag='+this.currentTag;

    deploy.addTask(compileDefault);
```

### CompassTask
**CompassTask(dir)**

Create a new instance  of CompassTask.
* @param dir //the target directory to compile

### PackageTask
**PackageTask(dir,file)**

Create a new instance  of PackageTask.
 * @param dir
 * @param file

### SendSSHTask
**SendSSHTask(host, port,user,password,file,destination, extractDestination)**

Create a new instance  of SendSSHTask.
 * @param host
 * @param port
 * @param user
 * @param password
 * @param file
 * @param destination
 * @param extractDestination
 
 ## Full Exemple
 ```javascript
var deploy = require("happy-deploy");
var fsx = require('fs-extra');
var fs = require('fs');
var replace = require("replace");

var config = deploy.getConfig(__dirname+'/local.json');
var cache = deploy.getCache('local');

var branchName = deploy.git.getBranchName();
var version = branchName;
var rendererDeployDir = cache.getValue('rendererDeployDir');
var output = process.cwd()+'/build/renderer';

fsx.removeSync(output);
fsx.mkdirsSync(output+config.output.js);

// Compile Renderer
var compileRenderer = new deploy.CompileHaxeTask('SakuraRenderer',output+config.output.js+'/SakuraRenderer.js',false);
compileRenderer.src.push('src');
compileRenderer.libs.push('mconsole-npm');
compileRenderer.libs.push('msignal');
compileRenderer.libs.push('createjs-haxe');
compileRenderer.libs.push('taminahx');
compileRenderer.libs.push('nodehx');
compileRenderer.libs.push('sakurahx-api/src');
compileRenderer.libs.push('exifhx/src');

compileRenderer.dir = 'sakuraEditor';
compileRenderer.options = '-D this.version='+version+' -D tag='+currentTag;

deploy.addTask(compileRenderer);

var deployTask = {
    run: function (executeNextStep) {
        // Copy render ressources
        fsx.copySync('sakuraTest/renderer',output);
        fsx.mkdirsSync(output+'/test_hd');
        fsx.mkdirsSync(output+'/logs');

        replace({regex: "#version#",replacement: currentTag,paths: [output+'/package.json']});

        for(var i=1; i<9; i++){
            var destination = rendererDeployDir+'/'+version+'/'+i;
            replace({regex: "#name#",replacement: 'sakura-renderer-'+i,paths: [output+'/package.json']});
            fsx.removeSync(destination);
            fsx.copySync(output,destination);
            fs.chmodSync(destination+'/run.sh','775');
            replace({regex: 'sakura-renderer-'+i,replacement: '#name#',paths: [output+'/package.json']});
        }
        executeNextStep();
    }
}

deploy.addTask(deployTask);

deploy.run();
```
