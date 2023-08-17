const { execSyncFullLog } = require('../common/shell');
const fs = require('fs');
const PACKAGE_JSON_PATH = './package.json';
const RN_CONFIG_PATH = './react-native.config.js';

function addDependencies() {
    const packageJSON = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf-8' }));
    packageJSON.scripts['start:repack'] =
        'react-native webpack-start --webpackConfig webpack.config.js --port 8181';
    packageJSON.dependencies['momo-core'] =
        'latest';
    packageJSON.dependencies['@momo-platform/momo-cornerstone'] =
        'git+https://oauth2:glpat-x9P49rY2rKesd2_EuzRZ@gitlab.com/momo-platform/momo-cornerstone.git#kits_core_sb';

    packageJSON.dependencies['react-native'] = 'git+https://oauth2:glpat-x9P49rY2rKesd2_EuzRZ@gitlab.com/momo-platform/react-native-v3.1.git#0.64-stable-duplicate-view';
    delete packageJSON.dependencies['webpack'];
    delete packageJSON.dependencies['@callstack/repack'];
    delete packageJSON.dependencies['terser-webpack-plugin'];
    delete packageJSON.dependencies['babel-loader'];
    delete packageJSON.dependencies['react-test-renderer'];
    delete packageJSON.dependencies['@babel/preset-env'];
    delete packageJSON.devDependencies['babel-plugin-module-resolver'];

    packageJSON.devDependencies['@babel/core'] = '^7.12.9';
    packageJSON.devDependencies['@babel/runtime'] = '^7.12.5';
    packageJSON.devDependencies['webpack'] = '5.61.0';
    packageJSON.devDependencies['@callstack/repack'] = '^2.5.0';
    packageJSON.devDependencies['terser-webpack-plugin'] = '^5.2.4';
    packageJSON.devDependencies['babel-loader'] = '^8.2.2';
    packageJSON.devDependencies['react-test-renderer'] = '17.0.1';
    packageJSON.devDependencies['@babel/preset-env'] = '^7.15.6';
    packageJSON.devDependencies['babel-plugin-module-resolver'] = '^4.0.0';

    packageJSON.resolutions['react'] = '17.0.1';
    packageJSON.resolutions['react-native'] = 'git+https://oauth2:glpat-x9P49rY2rKesd2_EuzRZ@gitlab.com/momo-platform/react-native-v3.1.git#0.64-stable-duplicate-view';
    packageJSON.resolutions['@momo-platform/momo-cornerstone'] =
        'git+https://oauth2:glpat-x9P49rY2rKesd2_EuzRZ@gitlab.com/momo-platform/momo-cornerstone.git#kits_core_sb';
    packageJSON.resolutions['@momo-kits/core'] = 'latest';
    packageJSON.resolutions['react-native-fast-image'] = '8.1.5';
    packageJSON.resolutions['react-native-gesture-handler'] = '1.10.3';
    packageJSON.resolutions['react-native-pager-view'] = '5.1.8';
    packageJSON.resolutions['react-refresh'] = '0.4.3';

    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJSON, null, 2));
}

function createMetroConfig() {
    const metroConfig = `module.exports = {
        commands: require('@callstack/repack/commands')
};`;

    fs.writeFileSync(RN_CONFIG_PATH, metroConfig);
}

function installDependencies() {
    execSyncFullLog('yarn install --force');
}

function migration() {
    //package json
    addDependencies();

    //Metro config
    createMetroConfig();

    //Install dependencies
    installDependencies();
}

migration();
