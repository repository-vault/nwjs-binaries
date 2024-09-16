"use strict";

const fs = require('fs');
const path = require('path');
//const PassThrough = require('stream').PassThrough;

const promisify = require('nyks/function/promisify');
const request   = promisify(require('nyks/http/request'));
const pipe      = require('nyks/stream/pipe');
const sort      = require('nyks/object/sort');

const move       = require('fs-extra/lib/move').move;
const mkdirpSync = require('nyks/fs/mkdirpSync');
const remove    = require('fs-extra/lib/remove').remove;

const extract   = promisify(require('extract-zip'));
const Progress = require('progress');
 


class release {

  constructor(version) {
    this.version = version;
  }

  async run() {

    var version = this.version;

    if(!version)
       version = process.env.npm_package_version;

//http://dl.nwjs.io/v0.14.6/nwjs-v0.14.6-win-ia32.zip
//http://dl.nwjs.io/v0.22.3/nwjs-v0.22.3-win-ia32.zip


    var splitter = new RegExp('^v?([0-9.]+\)-([a-z0-9-]+)');
    if(!splitter.test(version))
        throw `Invalid version ${version}`;
    var tmp = splitter.exec(version), sver = tmp[1], sext = tmp[2];
    var version = `${sver}-${sext}`;

    var remote_url = `https://dl.nwjs.io/v${sver}/nwjs-v${sver}-${sext}.zip`;

    var dist = path.join('dist', version), tmp = 'tmp';

    await remove(dist); mkdirpSync(dist);
    await remove(tmp);  mkdirpSync(tmp);

    var res = await request(remote_url); //should passthrough here
    console.log("Downloading", remote_url);

    if(res.headers['content-length']){
      var bar = new Progress('[:bar] :percent :etas', {total : parseInt(res.headers['content-length']), width: 20, complete: '=' , incomplete: ' '});
      res.on('data' ,  data => bar.tick(data.length) );
     }

    
    var target = path.join(tmp, 'incoming.zip');
    var dest = fs.createWriteStream(target);
    await pipe(res, dest);

    await extract(target, {dir: path.resolve(tmp) });
    await move(`${tmp}/nwjs-v${sver}-${sext}`, dist);
    await remove(tmp);


    var pack = require('./package.json');
    var packk = Object.assign(sort(pack, ['name', 'description', 'repository', 'keywords', 'author', 'license', 'homepage']),
    {
      version,
      main : 'nwjs.exe',
    });



    fs.writeFileSync(path.join(dist, 'package.json'), JSON.stringify(packk, null, 2));
    fs.writeFileSync(path.join(dist, 'README.md'), `NWJS.io binaries (version ${version}) from ${remote_url}` );



    console.log("%s@%s is now ready", packk.name, packk.version);

    return `cd ${dist} && npm publish`;

  }



}


module.exports = release;
