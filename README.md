This repository deploy nwjs.io binaries as a nodejs module.

The "latest" version of this package is irrelevant.

This package allows you to bundle nwjs easily in your app


# Intended usage

```
npm install nwjs-binaries@0.14.6-win-ia32 #save this in you package.json
  OR
npm install nwjs-binaries@0.22.3-win-ia32
```

# Add/publish new version (to your own registry)
As the npm registry is NOT a CDN, this package is more a "factory" for you to use with you own npm private registry
  * https://github.com/npm/npm/issues/4738
```
npm run prepare -- 0.14.6-win-ia32
  cd dist
npm publish --registry=http://your-private-registry.org

#make nwjs-binaries@0.14.6-win-ia32 available
```



# Available versions (on registry.npmjs.org)
* nwjs-binaries@0.14.6-win-ia32


# Credits
* [131](https://github.com/131) 
* [nwjs](https://nwjs.io)
