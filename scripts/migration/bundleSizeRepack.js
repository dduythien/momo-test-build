const { execSyncFullLog } = require('../common/shell');
const { getFileSizeInMB } = require('../common/fileUtils');

function migration() {
    execSyncFullLog('mkdir -p bundle/ios && mkdir -p bundle/android');
    execSyncFullLog('yarn bundle-ios');
    execSyncFullLog('yarn bundle-android');

    let iosJSBundleSize = getFileSizeInMB('bundle/ios/main.jsbundle');
    let androidJSBundleSize = getFileSizeInMB('bundle/android/main.jsbundle');

    execSyncFullLog('cd ../../');
    execSyncFullLog('rm bundle/*/*.jsbundle.json');

    execSyncFullLog('zip -r bundle/ios.zip bundle/ios');
    execSyncFullLog('zip -r bundle/android.zip bundle/android');

    let iosZipBundleSize = getFileSizeInMB('bundle/ios.zip');
    let androidZipBundleSize = getFileSizeInMB('bundle/android.zip');

    console.log(
        'Repack bundle info: ' +
            JSON.stringify(
                {
                    iosJSBundleSize,
                    androidJSBundleSize,
                    iosZipBundleSize,
                    androidZipBundleSize,
                },
                null,
                2
            )
    );
}

migration();
