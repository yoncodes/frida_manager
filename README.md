# Frida Manager

## About

simple tool to help you manage frida. wanted a easier way to scale how to test apps. you can just convert your scripts or helper functions into a plugin format and use anywhere.
useful for when testing new stuff. windows and ios support planned someday.

## Why?
- some apps hate frida and this is suppose to help deal with that
- keeps your projects from getting cluttered with potentially thousands lines of code

## Who's this for?
- for people who just want a drag and drop approach when testing apps.
- you can make your own plugins to suite your needs.

## Features
- added and few test plugins to get you started
- most of them are just scripts from [codeshare](https://codeshare.frida.re/)
- added a dumper for unity based games.

## Build
- npm run build 
- npx frida-compile agent/index.ts -o _agent.js

## How to run
- frida -Uf com.package.name -l _agent.js

## How to dump
- type rpx.exports.start();

## Screenshots

### example output for dumps
![example dump](screenshots/example.png)

### what the classes should look
![dump format](screenshots/dump_format.png)


## Tools needed

needs my modified version of [Il2cpp-frida-bridge](https://github.com/yoncodes/frida-il2cpp-bridge) to work

## Notes

Part of another Project I'm working on for a friend.

## Side Note

Don't expect it to dump every unity game out the gate. more tests are needed. for example if exports are stripped we need to add a patch/plugin to support the app.
