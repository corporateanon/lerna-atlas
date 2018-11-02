#!/usr/bin/env node
const glob = require('glob-promise');
const read = require('fs-readfile-promise');
const write = require('fs-writefile-promise');
const { join } = require('path');
const mustache = require('mustache');
const escape = require('escape-string-regexp');

const yargs = require('yargs');

const START = '<!--- LERNA_PACKAGES --->';
const END = '<!--- /LERNA_PACKAGES --->';
const CONTENT = '[\\s\\S]*';

const loadTemplate = async () => {
    const filename = join(__dirname, 'default-template.mustache');
    const b = await read(filename);
    return b.toString('utf8');
};

const loadDoc = async source => {
    const b = await read(source);
    return b.toString('utf8');
};

const replaceInDoc = (docContents, text) => {
    const re = new RegExp(
        `(${escape(START)})(${CONTENT})(${escape(END)})`,
        'm'
    );
    return docContents.replace(re, (substr, start, prevText, end) => {
        return `${start}\n${text}\n${end}`;
    });
};

const saveDoc = async (dest, text) => {
    return write('README.md', text);
};

const listPackages = async () => {
    const jsonFilesList = await glob('./packages/*/package.json');
    const packages = [];
    for (const jsonFile of jsonFilesList) {
        packages.push(JSON.parse((await read(jsonFile)).toString('utf8')));
    }
    return packages;
};

const main = async () => {
    const { source, dest } = yargs
        .alias('s', 'source')
        //Source
        .describe('s', 'Source file')
        .default('s', 'README.md')
        //Dest
        .alias('d', 'dest')
        .describe('d', 'Destination file')
        .default('d', 'README.md').argv;

    console.warn(`Patching ${source} to ${dest}`);

    const packages = await listPackages();
    const template = await loadTemplate();
    const text = mustache.render(template, { packages });
    const docContents = await loadDoc(source);
    const newText = replaceInDoc(docContents, text);
    await saveDoc(dest, newText);
};

main()
    .then(_ => {
        console.warn('Ok');
    })
    .catch(e => {
        console.warn('Error');
        console.warn(e.stack);
    });
