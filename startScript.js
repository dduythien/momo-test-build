/* eslint-disable max-len */
const { read } = require('fs');
const qrcode = require('qrcode-terminal');
const appConfig = require('./app.json');

const argv = (() => {
    const argument = {};
    process.argv.slice(2).forEach((element) => {
        const matches = element.match('--([a-zA-Z0-9]+)=(.*)');
        if (matches) {
            argument[matches[1]] = matches[2]
                .replace(/^['"]/, '').replace(/['"]$/, '');
        }
    });
    return argument;
})();

const port = argv.port || 8181;
const host = argv.host || 'localhost';
const debugHost = `http://${host}:${port}`;
const args = {
    config: {
        debugHost,
        development: true,
    },
    appId: appConfig.appId
};

const deeplink = `momo://?refId=dev_tool&args=[${JSON.stringify(args)}]`;
qrcode.generate(deeplink, { small: true });

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

setTimeout(() => {
    readline.close();
    console.log(`\nStart debugHost: ${debugHost}`);
}, 3000)
readline.question('Do you want to start miniApp now? [y/n]:', result => {
    result = result.toLowerCase();
    if (result === "y" || result === "yes") {
        const { exec } = require('child_process');
        const encodeDeeplink = encodeURI(deeplink);
        exec(`xcrun simctl openurl booted ${encodeDeeplink}`);
    }
    console.log(`\nStart debugHost: ${debugHost}`);
    readline.close();
});