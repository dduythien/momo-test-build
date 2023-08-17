const { execSyncFullLog }  = require("../common/shell");
const { getFileSizeInMB }  = require("../common/fileUtils");
const path = require('path');
const fs = require('fs');
const PACKAGE_JSON_PATH = `./package.json`;
const APP_JSON_PATH = `./app.json`;
const SOURCE_FILE_EXTENSIONS = ['js', 'jsx'];
const REGEX_IMPORT = /import {[^}]*} from [\'\"]@momo-platform\/component-kits[\'\"][;]?/g;
const REGEX_REQUIRED = /const { [^}]* } = require\([\'\"]@momo-platform\/component-kits[\'\"]\)[;]?/g;
const REGEX_IMPORT_CORE = /import {[^}]*} from [\'\"]@momo-kits\/core[\'\"][;]?/g;
const REGEX_REQUIRED_CORE = /const { [^}]* } = require\([\'\"]@momo-kits\/core[\'\"]\)[;]?/g;
const COMPONENT_REGEX = /{[^}]*}/g;

const CORE_IMPORT = '@momo-kits/core';

const globalDependencies = [];
const defaultExportComponents = [
    'ZoomableImage',
    'Toast',
    'SuggestEmailList',
    'Quantity',
    'Step',
    'Slider',
    'IconText',
    'RatingStar',
    'LottieView',
    'Switch',
    'ScrollableTabView',
    'Avatar',
    'HTMLView',
    'Skeleton',
    'Line',
    'Checkbox',
];
const componentKitMap = {
    AlertMessage: '@momo-kits/alert-message',
    AutoComplete: '@momo-kits/auto-complete',
    Avatar: '@momo-kits/avatar',
    BankFee: '@momo-kits/bank',
    BankList: '@momo-kits/bank',
    BankListHeader: '@momo-kits/bank',
    InforTable: '@momo-kits/bank',
    CalculatorTextInput: '@momo-kits/calculator',
    KeyboardHeaderSticky: '@momo-kits/calculator',
    Calendar: '@momo-kits/calendar',
    CalendarPicker: '@momo-kits/calendar',
    Carousel: '@momo-kits/carousel',
    Pagination: '@momo-kits/carousel',
    PieChart: '@momo-kits/chart',
    BarChart: '@momo-kits/chart',
    Checkbox: '@momo-kits/check-box',
    CircularProgress: '@momo-kits/circle-progress',
    CircularProgressAnimated: '@momo-kits/circle-progress',
    ButtonFooter: '@momo-kits/custom',
    CardView: '@momo-kits/custom',
    ConnectionStatus: '@momo-kits/custom',
    LanguageSelection: '@momo-kits/custom',
    GreetingCard: '@momo-kits/custom',
    ReadMore: '@momo-kits/custom',
    RowItem: '@momo-kits/custom',
    DatePickerInput: '@momo-kits/date-picker',
    DatePicker: '@momo-kits/date-picker',
    DraggableFlatList: '@momo-kits/draggbale-list',
    Effect: '@momo-kits/effect',
    ExpandCollapse: '@momo-kits/expand',
    ExpandableList: '@momo-kits/expand',
    ExpandableView: '@momo-kits/expand',
    CinemaBrand: '@momo-kits/film',
    CinemaBrandGrid: '@momo-kits/film',
    CinemaInfo: '@momo-kits/film',
    FilmInfo: '@momo-kits/film',
    FilmTimeList: '@momo-kits/film',
    //Cái này import kiểu {} thì phải đổi tên cho đúng
    DraggableButton: '@momo-kits/floating-button',
    FloatingButton: '@momo-kits/floating-button',

    HorizontalPageGuide: '@momo-kits/guide',
    HorizontalProgressPageGuide: '@momo-kits/guide',
    VerticalStepGuide: '@momo-kits/guide',
    HTMLView: '@momo-kits/html-view',
    Lottie: '@momo-kits/lottie',
    LottieView: '@momo-kits/lottie',
    MessageInformation: '@momo-kits/message',
    BrandInfo: '@momo-kits/message',
    Balance: '@momo-kits/money',
    MoneySuggestionList: '@momo-kits/money',
    BarCodeView: '@momo-kits/qrcode',
    QRCodeView: '@momo-kits/qrcode',
    //RadioButton -> RadioList
    Ratio: '@momo-kits/radio',
    RadioList: '@momo-kits/radio',

    RatingStar: '@momo-kits/rating-star',
    QRCodeScannerView: '@momo-kits/scanner',
    ScrollableTabString: '@momo-kits/scrollable-tab-string',
    ScrollableTabView: '@momo-kits/scrollable-tab-view',
    BottomSelectionList: '@momo-kits/selection',
    SelectionItem: '@momo-kits/selection',
    SelectionItemList: '@momo-kits/selection',
    //Selection -> SelectionTag
    SelectionTag: '@momo-kits/selection',
    Selection: '@momo-kits/selection',
    //Line -> Separator
    Separator: '@momo-kits/separator',
    Line: '@momo-kits/separator',
    //IconText - > Shortcut
    Shortcut: '@momo-kits/shortcut',
    IconText: '@momo-kits/shortcut',

    SwipeActionList: '@momo-kits/swipe',
    SwipeAction: '@momo-kits/swipe',
    Swiper: '@momo-kits/swipe',

    Skeleton: '@momo-kits/skeleton',
    Slider: '@momo-kits/slider',
    Step: '@momo-kits/step',
    //Quantity -> Stepper
    Stepper: '@momo-kits/stepper',
    Quantity: '@momo-kits/stepper',

    StickerPicker: '@momo-kits/sticker',
    StickerView: '@momo-kits/sticker',

    SuggestEmailList: '@momo-kits/suggest-email',

    Switch: '@momo-kits/switch',
    Toast: '@momo-kits/toast',
    Tooltip: '@momo-kits/tooltip',
    TransactionHistoryList: '@momo-kits/transaction',
    VoucherCard: '@momo-kits/voucher',
    DiscountVoucherCard: '@momo-kits/voucher',
    ZoomableImage: '@momo-kits/zoomable-image',
    DataPicker: '@momo-kits/data-picker',
    DataPickerCard: '@momo-kits/data-picker',
    ListPicker: '@momo-kits/date-picker',
};

function getJsFilesInSource(dir, oldFileList = []) {
    const fileList = oldFileList || [];
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const name = dir + '/' + file;
        if (fs.statSync(name).isDirectory()) {
            getJsFilesInSource(name, fileList);
        } else {
            const pieces = file.split('.');
            const extension = pieces[pieces.length - 1];
            if (SOURCE_FILE_EXTENSIONS.includes(extension)) {
                fileList.push(name);
            }
        }
    });

    return fileList;
}

function readContentFile(fileAbsolutePath = '') {
    const content = fs.readFileSync(path.join(__dirname+"/../../", fileAbsolutePath), { encoding: 'utf8' });
    console.log('fileAbsolutePath', fileAbsolutePath);
    return content;
}

function buildNewImportString(fileContent = '', regex) {
    const matches = fileContent.match(regex);
    if (matches) {
        const builder = matches.map(importStatement => {
            const componentMatches = importStatement.match(COMPONENT_REGEX);
            console.log('COMPONENT MATCHES', componentMatches);
            const componentList = [];
            if (componentMatches) {
                componentMatches.forEach(componentMatch => {
                    const componentPieces = componentMatch
                        .replace('{', '')
                        .replace('}', '')
                        .replace('\n', '')
                        .trim()
                        .split(',');
                    componentPieces.forEach(componentName => {
                        componentList.push(componentName.trim());
                    });
                });
            }

            const coreComponents = [];
            const extensionComponents = [];
            componentList.forEach(componentName => {
                if (componentKitMap[componentName]) {
                    globalDependencies.push(componentKitMap[componentName]);
                    extensionComponents.push(componentName);
                } else {
                    coreComponents.push(componentName);
                }
            });

            console.log('MATCHES', matches);
            console.log('COMPONENT LIST', componentList);
            console.log('CORE COMPONENT:', coreComponents);
            console.log('EXTENSION COMPONENT:', extensionComponents);

            let extensionComponentImport = [];

            if (extensionComponents.length > 0) {
                extensionComponentImport = extensionComponents.map(componentName => {
                    if (defaultExportComponents.includes(componentName)) {
                        return `\nimport ${componentName} from '${
                            componentKitMap[componentName]
                        }';`;
                    }
                    return `\nimport { ${componentName} } from '${
                        componentKitMap[componentName]
                    }';`;
                });
            }

            const extensionComponentString = extensionComponentImport.join('\n');

            if (coreComponents.length > 0) {
                const coreImportString = `import { ${coreComponents.join(
                    ', '
                )} } from '${CORE_IMPORT}';`;
                return `${coreImportString} ${extensionComponentString}`.trim();
            }
            return extensionComponentString.trim();
        });
        return {
            matches,
            builder,
        };
    }
    return {
        matches: [],
        builder: [],
    };
}

function addKitV2DependenciesPackageJSON() {
    const packageJSON = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf-8' }));

    //Core dependencies
    delete packageJSON.dependencies['@momo-platform/component-kits'];
    packageJSON.dependencies['react'] = '17.0.1';
    packageJSON.dependencies['react-native'] = '0.64.2';
    packageJSON.dependencies['@momo-kits/core'] = 'latest';

    //Core lib dependencies
    globalDependencies.forEach(dependency => {
        packageJSON.dependencies[dependency] = 'latest';
    });

    console.log('GLOBAL:' + JSON.stringify(globalDependencies));

    //Dependencies for corner stone and kits
    packageJSON.dependencies['@momo-platform/momo-cornerstone'] =
        'git+https://oauth2:glpat-x9P49rY2rKesd2_EuzRZ@gitlab.com/momo-platform/momo-cornerstone.git#kits_core_sb';
    !packageJSON.dependencies['lottie-react-native'] &&
        (packageJSON.dependencies['lottie-react-native'] = '^3.3.2');

    //Resolution
    packageJSON['resolutions'] = {
        react: '17.0.1',
        'react-native': '0.64.2',
        '@momo-kits/core': 'latest',
    };

    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJSON, null, 2));

    //Resolve dependency
    const resolveDependencies = time => {
        //Install dependency
        execSyncFullLog('yarn install');

        let cloneOriginPackageJSON = JSON.parse(JSON.stringify(packageJSON));

        //resolve sub dependencies
        Object.keys(cloneOriginPackageJSON.dependencies)
            .filter(
                key => key.includes('@momo-kits') || key.includes('@momo-platform/momo-cornerstone')
            )
            .forEach(key => {
                let packgePath = path.join(__dirname, `../../node_modules/${key}/package.json`);
                const dependencyPackageJSON = JSON.parse(
                    fs.readFileSync(packgePath, { encoding: 'utf-8' })
                );
                dependencyPackageJSON.peerDependencies &&
                    Object.keys(dependencyPackageJSON.peerDependencies)
                        .filter(key => key.includes('@momo-kits'))
                        .forEach(key => {
                            packageJSON.dependencies[key] = 'latest';
                        });

                dependencyPackageJSON.devDependencies &&
                    Object.keys(dependencyPackageJSON.devDependencies)
                        .filter(key => key.includes('@momo-kits'))
                        .forEach(key => {
                            packageJSON.dependencies[key] = 'latest';
                        });
            });
        //Rewrite dependencies
        fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJSON, null, 2));
    };

    [1, 2, 3].forEach(resolveDependencies);
}

function updateDeployTarget() {
    const appJSON = JSON.parse(fs.readFileSync(APP_JSON_PATH, { encoding: 'utf-8' }));
    appJSON.client.ios.deploymentTarget = 1064;
    appJSON.client.android.deploymentTarget = 1064;

    fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJSON, null, 2));
}

function migrateComponentFromV1ToV2() {
    const regexToTests = [REGEX_IMPORT, REGEX_REQUIRED, REGEX_IMPORT_CORE,REGEX_REQUIRED_CORE];

    //Get src folder
    let allFilePaths = getJsFilesInSource('./src');

    //Add index
    allFilePaths.push('index.js');

    console.log('FILES LIST:', allFilePaths);
    allFilePaths.forEach((absolutePath, index) => {
        regexToTests.forEach(regex => {
            const content = readContentFile(absolutePath);
            const { matches, builder } = buildNewImportString(content, regex);
            console.log('MATCHES:', matches);
            console.log('builder:', builder);
            let newContent = content;
            matches.forEach((match, index) => {
                newContent = newContent.replace(match, builder[index]);
            });
            fs.writeFileSync(absolutePath, newContent, err => {
                if (err) {
                    throw err;
                }
            });
        });
    });
}

function bundleJS(index) {
    execSyncFullLog('rm -rf node_modules yarn.lock package-lock.json');
    execSyncFullLog('yarn install --force');
    execSyncFullLog('rm -rf bundle');
    execSyncFullLog('mkdir -p bundle/ios && mkdir -p bundle/android');
    execSyncFullLog(
        'npx react-native bundle --dev false --entry-file index.js --bundle-output bundle/ios/main.jsbundle --platform ios --assets-dest bundle/ios'
    );
    execSyncFullLog(
        'npx react-native bundle --dev false --entry-file index.js --bundle-output bundle/android/main.jsbundle --platform android --assets-dest bundle/android'
    );

    let iosJSBundleSize = getFileSizeInMB('bundle/ios/main.jsbundle');
    let androidJSBundleSize = getFileSizeInMB('bundle/android/main.jsbundle');

    execSyncFullLog('zip -r bundle/ios.zip bundle/ios');
    execSyncFullLog('zip -r bundle/android.zip bundle/android');

    let iosZipBundleSize = getFileSizeInMB('bundle/ios.zip');
    let androidZipBundleSize = getFileSizeInMB('bundle/android.zip');

    report[index] = {
        iosJSBundleSize,
        androidJSBundleSize,
        iosZipBundleSize,
        androidZipBundleSize,
    };
}

function isNeedToBundleKitsV1() {
    const packageJSON = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf-8' }));
    return !packageJSON.dependencies['@momo-kits/core'];
}

let report = {};
function main() {
    // //Build and caculate kit v1 bundle size
    //isNeedToBundleKitsV1() && bundleJS('kitv1');
    
    //Migrate component from kits v1 to v2
    //migrateComponentFromV1ToV2();

    //Add kit v2 dependencies into package json
    //addKitV2DependenciesPackageJSON();

    //Update deploy target for engine
    //updateDeployTarget();

    // //Build and caculate kit v2 bundle size
    //bundleJS('kitv2');

    //console.log('Done:' + JSON.stringify(report, null, 2));

    //Only migrate
    //Migrate component from kits v1 to v2
    migrateComponentFromV1ToV2();

    // //Add kit v2 dependencies into package json
    addKitV2DependenciesPackageJSON();

    // //Update deploy target for engine
    updateDeployTarget();
}

main();
