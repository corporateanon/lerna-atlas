#!/usr/bin/env node
const glob = require('glob-promise');
const read = require('fs-readfile-promise');
const write = require('fs-writefile-promise');
const { join } = require('path');
const mustache = require('mustache');
const escape = require('escape-string-regexp');

const START = '<!--- LERNA_PACKAGES --->';
const END = '<!--- /LERNA_PACKAGES --->';
const CONTENT = '[\\s\\S]*';

const loadTemplate = async () => {
    const filename = join(__dirname, 'default-template.mustache');
    const b = await read(filename);
    return b.toString('utf8');
};

const loadDoc = async () => {
    const b = await read('README.md');
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

const saveDoc = async text => {
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
    const packages = await listPackages();
    const template = await loadTemplate();
    const text = mustache.render(template, { packages });
    const docContents = await loadDoc();
    const newText = replaceInDoc(docContents, text);
    await saveDoc(newText);
};

main()
    .then(_ => {
        console.error('Ok');
    })
    .catch(e => {
        console.error('Error');
        console.error(e.stack);
    });
