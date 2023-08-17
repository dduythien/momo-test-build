const fs = require('fs');
const INDEX_PATH = './index.js';
const WEBPACK_CONFIG_PATH = './webpack.config.js';
const PACKAGE_JSON_PATH = './package.json';

const updatePackages = () => {
    const packageJSON = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf-8' }));
    packageJSON.dependencies = packageJSON.dependencies || {}
    packageJSON.dependencies['@momo-platform/momo-core'] = '0.0.5';

    const shadowPackageJSON = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf-8' }));
    shadowPackageJSON.dependencies &&
                    Object.keys(shadowPackageJSON.dependencies)
                        .filter(key => key.includes('@momo-kits'))
                        .forEach(key => {
                            packageJSON.dependencies[key] = '0.0.8';
                        });
    shadowPackageJSON.devDependencies &&
                        Object.keys(shadowPackageJSON.devDependencies)
                            .filter(key => key.includes('@momo-kits'))
                            .forEach(key => {
                                packageJSON.devDependencies[key] = '0.0.8';
                            });
    delete packageJSON.dependencies['momo-core'];

    packageJSON.resolutions = packageJSON.resolutions || {};
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJSON, null, 2));
}

const updateIndex = () => {
    let index = fs.readFileSync(INDEX_PATH, { encoding: 'utf-8' });
    index = index.replace("const MiniApp", `export const MiniApp`)
    fs.writeFileSync(INDEX_PATH, index);
}

const updateWebpackConfig = () => {
    let webpack = fs.readFileSync(WEBPACK_CONFIG_PATH, { encoding: 'utf-8' });
    webpack = webpack.replace("ReactNative.getPublicPath(devServer),", `ReactNative.getPublicPath(devServer),
        library: {
            name: appId,
            type: 'self',
        },`)
    fs.writeFileSync(WEBPACK_CONFIG_PATH, webpack);
}

function main() {
    updatePackages();
    updateIndex();
    updateWebpackConfig();
}

main();