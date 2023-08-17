const { execSyncFullLog } = require('../common/shell');

let platform = process.argv[2];
console.log('Info process.argv', process.argv);

switch (platform) {
    case 'ios':
        bundleIOS();
        break;
    case 'android':
        bundleAndroid();
        break;
}

function bundleIOS() {
    execSyncFullLog(
        'mkdir -p bundle/ios sourcemap/ios'
    );

    execSyncFullLog(
        'react-native webpack-bundle --platform ios --dev false --entry-file index.js --bundle-output bundle/ios/main.jsbundle --assets-dest bundle/ios --sourcemap-output sourcemap/ios/main.jsbundle.map'
    );

    execSyncFullLog(
        'rm -rf bundle/ios/assets'
    );
}

function bundleAndroid() {
    execSyncFullLog(
        'mkdir -p bundle/android sourcemap/android'
    );
    execSyncFullLog(
        'react-native webpack-bundle --platform android --dev false --entry-file index.js --bundle-output bundle/android/main.jsbundle --assets-dest bundle/android  --sourcemap-output sourcemap/android/main.jsbundle.packager.map'
    );

    execSyncFullLog(
        'node_modules/hermes-engine/osx-bin/hermesc -emit-binary -out bundle/android/main.jsbundle.hbc bundle/android/main.jsbundle -O -output-source-map'
    );
 
    execSyncFullLog('mv bundle/android/main.jsbundle.hbc bundle/android/main.jsbundle');

    execSyncFullLog(
        'mv bundle/android/main.jsbundle.hbc.map sourcemap/android/main.jsbundle.compiler.map'
    );

    execSyncFullLog(
        'node_modules/react-native/scripts/compose-source-maps.js sourcemap/android/main.jsbundle.packager.map sourcemap/android/main.jsbundle.compiler.map -o sourcemap/android/main.jsbundle.map'
    );

    execSyncFullLog(
        'rm -rf bundle/android/drawable*'
    );
}