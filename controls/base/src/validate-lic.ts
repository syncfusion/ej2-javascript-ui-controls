import { createElement } from './dom';
import { getValue, containerObject, isNullOrUndefined, productToComponentsMap } from './util';

export const pdfViewerSDKComponents: string[] = ['grid', 'chart', 'maps', 'schedule', 'gantt', 'richtexteditor', 'kanban', 'treegrid', 'filemanager', 'pivotview', 'diagram', 'blockeditor', 'spreadsheet', 'DocumentEditor', 'headless-editor', 'richtexteditor-ui', 'docx', 'xlsx', 'pptx', 'pptxeditor'];
export const pptxEditorSDKComponents: string[] = ['grid', 'maps', 'schedule', 'gantt', 'richtexteditor', 'kanban', 'treegrid', 'filemanager', 'pivotview', 'diagram', 'blockeditor', 'PdfViewer', 'spreadsheet', 'DocumentEditor', 'pdf', 'pdf-extract', 'headless-editor', 'richtexteditor-ui', 'docx', 'xlsx'];
export const spreadsheetEditorSDKComponents: string[] = ['maps', 'schedule', 'gantt', 'richtexteditor', 'kanban', 'treegrid', 'filemanager', 'pivotview', 'diagram', 'blockeditor', 'PdfViewer', 'DocumentEditor', 'pdf', 'pdf-extract', 'headless-editor', 'richtexteditor-ui', 'docx', 'pptx', 'pptxeditor'];
export const wordEditorSDKComponents: string[] = ['grid', 'maps', 'schedule', 'gantt', 'richtexteditor', 'kanban', 'treegrid', 'filemanager', 'pivotview', 'diagram', 'blockeditor', 'PdfViewer', 'spreadsheet', 'pdf', 'pdf-extract', 'headless-editor', 'richtexteditor-ui', 'xlsx', 'pptx', 'pptxeditor'];
export const gridSDKComponents: string[] = ['maps', 'schedule', 'gantt', 'richtexteditor', 'kanban', 'filemanager', 'diagram', 'blockeditor', 'spreadsheet', 'DocumentEditor', 'PdfViewer', 'pdf', 'pdf-extract', 'headless-editor', 'richtexteditor-ui', 'docx', 'xlsx', 'pptx', 'pptxeditor'];
export const fileManagerSDKComponents: string[] = ['chart', 'treegrid', 'pivotview', 'maps', 'schedule', 'gantt', 'richtexteditor', 'kanban', 'diagram', 'blockeditor', 'spreadsheet', 'DocumentEditor', 'PdfViewer', 'pdf', 'pdf-extract', 'headless-editor', 'richtexteditor-ui', 'docx', 'xlsx', 'pptx', 'pptxeditor'];
export const chartsSDKComponents: string[] = ['grid', 'treegrid', 'pivotview', 'schedule', 'gantt', 'richtexteditor', 'kanban', 'filemanager', 'diagram', 'blockeditor', 'spreadsheet', 'DocumentEditor', 'PdfViewer', 'pdf', 'pdf-extract', 'headless-editor', 'richtexteditor-ui', 'docx', 'xlsx', 'pptx', 'pptxeditor'];
export const rteSDKComponents: string[] = ['chart', 'treegrid', 'pivotview', 'maps', 'schedule', 'gantt', 'kanban', 'diagram', 'spreadsheet', 'DocumentEditor', 'PdfViewer', 'pdf', 'pdf-extract', 'docx', 'xlsx', 'pptx', 'pptxeditor'];
export const diagramSDKComponents: string[] = ['grid', 'treegrid', 'pivotview', 'chart', 'maps', 'schedule', 'gantt', 'richtexteditor', 'kanban', 'filemanager', 'blockeditor', 'spreadsheet', 'DocumentEditor', 'PdfViewer', 'pdf', 'pdf-extract', 'headless-editor', 'richtexteditor-ui', 'docx', 'xlsx', 'pptx', 'pptxeditor'];
export const ganttSDKComponents: string[] = ['chart', 'pivotview', 'schedule', 'diagram', 'blockeditor', 'spreadsheet', 'DocumentEditor', 'PdfViewer', 'pdf', 'pdf-extract', 'docx', 'xlsx', 'pptx', 'pptxeditor'];
export const schedulerSDKComponents: string[] = ['grid', 'treegrid', 'pivotview', 'chart', 'maps', 'gantt', 'richtexteditor', 'kanban', 'filemanager', 'diagram', 'blockeditor', 'spreadsheet', 'DocumentEditor', 'PdfViewer', 'pdf', 'pdf-extract', 'headless-editor', 'richtexteditor-ui', 'docx', 'xlsx', 'pptx', 'pptxeditor'];

const bypassKey: number[] = [115, 121, 110, 99, 102, 117, 115, 105,
    111, 110, 46, 105, 115, 76, 105, 99, 86, 97, 108,
    105, 100, 97, 116, 101, 100];
const bypassKey2: number[] = [115, 121, 110, 99, 102, 117, 115, 105,
    111, 110, 46, 105, 115, 69, 83, 85, 73, 76, 105, 99, 86, 97, 108, 105, 100, 97, 116, 101, 100];
const bypassKey3: number[] = [115, 121, 110, 99, 102, 117, 115, 105,
    111, 110, 46, 105, 115, 69, 83, 85, 73, 118, 51, 52, 76, 105, 99, 86, 97, 108, 105, 100, 97, 116, 101, 100];
const esUI: string[] = ['spreadsheet', 'DocumentEditor', 'PdfViewer', 'pdf', 'pdf-extract', 'docx', 'xlsx', 'pptx'];

/**
 * Product map with base64-encoded product names
 */
const productMap: { [key: string]: string } = {
    PDFViewerSDK: 'UERGVmlld2Vy',
    DocumentSDK: 'RG9jdW1lbnQ==',
    DOCXEditorSDK: 'V29yZEVkaXRvcg==',
    SpreadsheetEditorSDK: 'U3ByZWFkc2hlZXRFZGl0b3I=',
    SchedulerSDK: 'U2NoZWR1bGVyU0RL',
    GanttSDK: 'R2FudHRTREs=',
    DiagramSDK: 'RGlhZ3JhbVNESw==',
    RichTextEditorSDK: 'UmljaFRleHRFZGl0b3JTREs=',
    GridSDK: 'R3JpZFNESw==',
    ChartSDK: 'Q2hhcnRTREs=',
    FileManagerSDK: 'RmlsZU1hbmFnZXJTREs=',
    Markdown: 'TWFya2Rvd24=',
    UIComponent: 'VUlDb21wb25lbnQ='
};


/**
 * Build component to product map dynamically from productToComponentsMap
 * This reduces duplication and makes maintenance easier
 */
function buildComponentToProductMap(): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    // eslint-disable-next-line security/detect-object-injection
    for (const product in productToComponentsMap) {
        if (productToComponentsMap.hasOwnProperty(product)) {
            const components: string[] = productToComponentsMap[product];
            for (const component of components) {
                map[component] = product;
            }
        }
    }
    return map;
}

const componentToProductMap: { [key: string]: string } = buildComponentToProductMap();

let accountURL: string;
let banner: boolean = true;
/**
 * License validation module
 *
 */
class LicenseValidator {
    /**
     * @private
     */
    public isLicensed: boolean = true;
    /**
     * @private
     */
    public version: string = '35';
    /**
     * @private
     */
    public platform: RegExp = /JavaScript|ASPNET|ASPNETCORE|ASPNETMVC|FileFormats|essentialstudio/i;
    /**
     * @private
     */
    public prefixRegex: RegExp = /essentialui|pdfviewersdk|pptxeditorsdk|documentsdk|spreadsheeteditorsdk|schedulersdk|ganttsdk|diagramsdk|richtexteditorsdk|gridsdk|chartsdk|filemanagersdk|docxeditorsdk/i;
    /**
     * @private
     */
    public incorrectPlatform: RegExp = /JavaScript|ASPNET|ASPNETCORE|ASPNETMVC|FileFormats/i;
    private errors: IErrorType = {
        noLicense: 'This application was built using a trial version of Syncfusion<sup>®</sup> Essential Studio<sup>®</sup>.' +
            ' To remove the license validation message permanently, a valid license key must be included.',
        trailExpired: 'This application was built using a trial version of Syncfusion<sup>®</sup> Essential Studio<sup>®</sup>, which has now expired.' +
            ' To remove the license validation message permanently, a valid license key must be included.',
        versionMismatched: 'The included Syncfusion<sup>®</sup> key and package versions do not match. Ensure that the license key corresponds to the same package version.',
        platformMismatched: 'The included Syncfusion<sup>®</sup> license key is not compatible with this platform. Please register the appropriate platform license keys.',
        invalidKey: 'The included Syncfusion<sup>®</sup> license key is invalid. Please register a valid license key to use the corresponding UI components.',
        uiSuite: 'The included Syncfusion<sup>®</sup> license key is valid only for the UI Components. To use other Document solutions SDK components, please register the appropriate license keys.',
        documentSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the Document SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        pdfSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the PDF Viewer SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        pptxEditorSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the PPTX Editor SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        spreadSheetSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the Spreadsheet Editor SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        docxEditorSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the DOCX Editor SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        gridSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the Grid SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        filemanagerSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the FileManager SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        ganttSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the Gantt SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        rteSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the RTE SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        diagaramSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the Diagram SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        schedulerSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the Scheduler SDK components. To use other UI or SDK components, please register the appropriate license keys.',
        chartSdk: 'The included Syncfusion<sup>®</sup> license key is valid only for the Chart SDK components. To use other UI or SDK components, please register the appropriate license keys.'
    };
    private validatedPlatforms: string[] = [];
    /**
     * @private
     */
    public minVersion: number | null = null;
    constructor(key?: string) {
        this.manager.setKey(key);
    }

    private allowedComponentsMap: { [key: string]: string[] } = {
        'pdfviewersdk': pdfViewerSDKComponents,
        'pptxeditorsdk': pptxEditorSDKComponents,
        'spreadsheeteditorsdk': spreadsheetEditorSDKComponents,
        'docxeditorsdk': wordEditorSDKComponents,
        'gridsdk': gridSDKComponents,
        'filemanagersdk': fileManagerSDKComponents,
        'chartsdk': chartsSDKComponents,
        'richtexteditorsdk': rteSDKComponents,
        'diagramsdk': diagramSDKComponents,
        'ganttsdk': ganttSDKComponents,
        'schedulersdk': schedulerSDKComponents
    };

    /**
     * To manage licensing operation.
     */
    private manager: { setKey: Function, getKey: Function } = (() => {
        let licKey: string = null;
        /**
         * Sets the license key.
         *
         * @param {string} key - Specifies the license key.
         * @returns {void}
         */
        function set(key: string): void { licKey = key; }
        /**
         * Gets the license key.
         *
         * @returns {string} -Gets the license key.
         */
        function get(): string { return licKey; }
        return {
            setKey: set,
            getKey: get
        };
    })();

    /**
     * To manage npx licensing operation.
     */
    private npxManager: { getKey: Function } = (() => {
        const npxLicKey: string = 'npxKeyReplace';
        /**
         * Gets the license key.
         *
         * @returns {string} - Gets the license key.
         */
        function get(): string { return npxLicKey; }
        return {
            getKey: get
        };
    })();

    /**
     * To validate the provided license key.
     *
     * @param {string} component - The name of the component to validate.
     * @returns {boolean} ?
     */
    public validate(component: string): boolean {
        const contentKey: number[] = [115, 121, 110, 99, 102, 117, 115, 105, 111, 110, 46,
            108, 105, 99, 101, 110, 115, 101, 67, 111, 110, 116, 101, 110, 116];
        const URLKey: number[] = [115, 121, 110, 99, 102, 117, 115, 105, 111, 110, 46,
            99, 108, 97, 105, 109, 65, 99, 99, 111, 117, 110, 116, 85, 82, 76];
        if ((containerObject && !getValue(convertToChar(bypassKey), containerObject) && !getValue('Blazor', containerObject))) {
            let validateMsg: string;
            let validateURL: string;
            if ((this.manager && this.manager.getKey()) || (this.npxManager && this.npxManager.getKey() !== 'npxKeyReplace')) {
                const result: IValidator[] = this.getInfoFromKey();
                if (result && result.length) {
                    let componentRestrictedMsg: string | undefined;
                    for (const res of result) {
                        let hasError: boolean = false;
                        if ((!this.platform.test(res.platform) && !this.prefixRegex.test(res.platform)) || res.invalidPlatform) {
                            validateMsg = this.errors.platformMismatched;
                        }
                        else if (this.incorrectPlatform.test(res.platform) && parseInt(res.version.split('.')[0], 10) > 30) {
                            validateMsg = this.errors.platformMismatched;
                        }
                        else if (this.prefixRegex.test(res.platform) && parseInt(res.version.split('.')[0], 10) > 30) {
                            const restrictionMsg: string | null = this.restrictComponent(component, res.platform);
                            if (restrictionMsg) {
                                componentRestrictedMsg = restrictionMsg;
                                hasError = true;
                            }
                            else {
                                componentRestrictedMsg = null;
                                this.isLicensed = true;
                            }
                            if (((res.minVersion >= res.lastValue) && (res.minVersion !== res.lastValue)) ||
                                (res.lastValue < parseInt(this.version, 10))) {
                                validateMsg = this.errors.versionMismatched;
                                validateMsg = validateMsg.replace('##LicenseVersion', res.version);
                                validateMsg = validateMsg.replace('##Requireversion', this.version + '.x');
                            }
                            else {
                                if (res.lastValue == null || isNaN(res.lastValue)) {
                                    validateMsg = this.errors.versionMismatched;
                                    validateMsg = validateMsg.replace('##LicenseVersion', res.version);
                                    validateMsg = validateMsg.replace('##Requireversion', this.version + '.x');
                                }
                            }
                            if (res.expiryDate) {
                                const expDate: Date = new Date(res.expiryDate);
                                const currDate: Date = new Date();
                                if (expDate < currDate && expDate !== currDate) {
                                    validateMsg = this.errors.trailExpired;
                                    hasError = true;
                                }
                            }
                            if ((res.platform === 'documentsdk') && (component !== 'pdf' && component !== 'pdf-extract' && component !== 'docx' && component !== 'xlsx' && component !== 'pptx')) {
                                this.isLicensed = false;
                            }
                            if (!validateMsg && !componentRestrictedMsg) {
                                break;
                            }
                        }
                        else {
                            if (((res.minVersion >= res.lastValue) && (res.minVersion !== res.lastValue)) ||
                                (res.lastValue < parseInt(this.version, 10))) {
                                validateMsg = this.errors.versionMismatched;
                                validateMsg = validateMsg.replace('##LicenseVersion', res.version);
                                validateMsg = validateMsg.replace('##Requireversion', this.version + '.x');
                            }
                            else {
                                if (res.lastValue == null || isNaN(res.lastValue)) {
                                    validateMsg = this.errors.versionMismatched;
                                    validateMsg = validateMsg.replace('##LicenseVersion', res.version);
                                    validateMsg = validateMsg.replace('##Requireversion', this.version + '.x');
                                }
                            }
                            if (res.expiryDate) {
                                const expDate: Date = new Date(res.expiryDate);
                                const currDate: Date = new Date();
                                if (expDate !== currDate && expDate < currDate) {
                                    validateMsg = this.errors.trailExpired;
                                } else {
                                    break;
                                }
                            }
                        }
                        if (!hasError && this.prefixRegex.test(res.platform)) {
                            this.validatedPlatforms.push(res.platform);
                        }
                    }
                    if (!this.validatedPlatforms.length || componentRestrictedMsg) {
                        validateMsg = validateMsg || componentRestrictedMsg;
                    }
                } else {
                    validateMsg = this.errors.invalidKey;
                }
            } else {
                const licenseContent: string = getValue(convertToChar(contentKey), containerObject);
                validateURL = getValue(convertToChar(URLKey), containerObject);
                if (licenseContent && licenseContent !== '') {
                    validateMsg = licenseContent;
                } else {
                    validateMsg = this.errors.noLicense;
                }
            }
            if (validateMsg && typeof document !== 'undefined' && !isNullOrUndefined(document)) {
                if (component !== 'pdf' && component !== 'pdf-extract' && component !== 'docx' && component !== 'xlsx' && component !== 'pptx') {
                    if (banner) {
                        const plValue: string = this.getProductCode(component);
                        accountURL = (validateURL && validateURL !== '') ?  validateURL : `https://www.syncfusion.com/account/claim-license-key?pl=${plValue}&vs=MzU=&utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information`;
                        const errorDiv: HTMLElement = createElement('div', {
                            className: 'sf-license-validation-banner',
                            innerHTML: `<svg color="#222" class="sf-icon sf-license-validation-icon" width="20" height="20" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                                <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 11V17H11V11H13ZM13 9V7H11V9H13Z"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    fill="currentColor">
                                </path>
                            </svg>` +
                                '<span>' + validateMsg + '<a class="sf-license-validation-link" href=' + accountURL + '>Claim your free account</a>' + '</span>' + ' ' +
                                '<button class="sf-license-validation-close">' +
                                '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                '<path d="M15 5L5 15M5 5L15 15" stroke="#737373" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                                '</svg>' +
                                '</button>'
                        });
                        const closeButton: HTMLElement | null = errorDiv.querySelector('.sf-license-validation-close');
                        if (closeButton) {
                            closeButton.addEventListener('click', function () {
                                errorDiv.remove();
                            });
                        }
                        document.body.appendChild(errorDiv);
                        banner = false;
                    }
                }
                this.isLicensed = false;
            }
        }
        return this.isLicensed;
    }

    /**
     * Get the product code (base64-encoded) for the component
     *
     * @param {string} component - The component name
     * @returns {string} - The base64-encoded product code
     */
    private getProductCode(component: string): string {
        // eslint-disable-next-line security/detect-object-injection
        const productName: string = componentToProductMap[component] || 'UIComponent';
        // eslint-disable-next-line security/detect-object-injection
        return productMap[productName] || productMap.UIComponent;
    }

    private restrictComponent(component: string, platform: string): string | null {
        const ignoreList: string[] = ['DocumentEditor', 'spreadsheet', 'PdfViewer'];
        if (platform === 'essentialui') {
            return ignoreList.indexOf(component) === -1 ? null : this.errors.uiSuite;
        }
        if (platform === 'documentsdk') {
            if (component === 'pdf' || component === 'pdf-extract' || component === 'docx' || component === 'xlsx' || component === 'pptx') {
                this.isLicensed = true;
                return null;
            }
            return this.errors.documentSdk;
        }
        const errorMap: Record<string, string> = {
            gridsdk: this.errors.gridSdk,
            filemanagersdk: this.errors.filemanagerSdk,
            chartsdk: this.errors.chartSdk,
            richtexteditorsdk: this.errors.rteSdk,
            diagramsdk: this.errors.diagaramSdk,
            ganttsdk: this.errors.ganttSdk,
            schedulersdk: this.errors.schedulerSdk,
            pdfviewersdk: this.errors.pdfSdk,
            pptxeditorsdk: this.errors.pptxEditorSdk,
            docxeditorsdk: this.errors.docxEditorSdk,
            spreadsheeteditorsdk: this.errors.spreadSheetSdk
        };
        // eslint-disable-next-line security/detect-object-injection
        const list: string[] = this.allowedComponentsMap[platform] || [];
        return list.indexOf(component) === -1 ? null : errorMap[platform];
    }

    private getDecryptedData(key: string): string {
        try {
            return atob(key);
        }
        catch (error) {
            return '';
        }
    }
    /**
     * Get license information from key.
     *
     * @returns {IValidator} - Get license information from key.
     */
    private getInfoFromKey(): IValidator[] {
        try {
            let licKey: string = '';
            const pkey: number[] = [5439488, 7929856, 5111808, 6488064, 4587520, 7667712, 5439488,
                6881280, 5177344, 7208960, 4194304, 4456448, 6619136, 7733248, 5242880, 7077888,
                6356992, 7602176, 4587520, 7274496, 7471104, 7143424];
            let decryptedStr: string[] = [];
            const resultArray: IValidator[] = [];
            let invalidPlatform: boolean = false;
            let isNpxKey: boolean =  false;
            if (this.manager.getKey()) {
                licKey = this.manager.getKey();
            } else {
                isNpxKey = true;
                licKey = this.npxManager.getKey().split('npxKeyReplace')[1];
            }
            const licKeySplit: string[] = licKey.split(';');
            for (const lKey of licKeySplit) {
                const decodeStr: string = this.getDecryptedData(lKey);
                if (!decodeStr) {
                    continue;
                }
                let k: number = 0;
                let buffr: string = '';
                if (!isNpxKey) {
                    for (let i: number = 0; i < decodeStr.length; i++, k++) {
                        if (k === pkey.length) { k = 0; }
                        const c: number = decodeStr.charCodeAt(i);
                        buffr += String.fromCharCode(c ^ (pkey[parseInt(k.toString(), 10)] >> 16));
                    }
                } else {
                    const charKey: string = decodeStr[decodeStr.length - 1];
                    const decryptedKey: number[] = [];
                    for (let i: number = 0; i < decodeStr.length; i++) {
                        decryptedKey[parseInt(i.toString(), 10)] = decodeStr[parseInt(i.toString(), 10)].charCodeAt(0)
                        - charKey.charCodeAt(0);
                    }
                    for (let i: number = 0; i < decryptedKey.length; i++) {
                        buffr += String.fromCharCode(decryptedKey[parseInt(i.toString(), 10)]);
                    }
                }
                if (this.platform.test(buffr) || this.prefixRegex.test(buffr)) {
                    decryptedStr = buffr.split(';');
                    invalidPlatform = false;
                    // checked the length to verify the key in proper strucutre
                    if (decryptedStr.length > 3) {
                        const minVersion: number = parseInt(decryptedStr[1].split('.')[0], 10);
                        const lastValue: number = parseInt(decryptedStr[4], 10);
                        resultArray.push({
                            platform: decryptedStr[0],
                            version: decryptedStr[1],
                            expiryDate: decryptedStr[2],
                            lastValue: lastValue,
                            minVersion: minVersion
                        });
                    }
                } else if (buffr && buffr.split(';').length > 3) {
                    invalidPlatform = true;
                }
            }
            if (invalidPlatform && !resultArray.length) {
                return [{ invalidPlatform: invalidPlatform }];
            } else {
                return resultArray.length  ? resultArray : null;
            }
        } catch (error) {
            return null;
        }
    }
}

let licenseValidator: LicenseValidator = new LicenseValidator();
/**
 * Converts the given number to characters.
 *
 * @param {number} cArr - Specifies the license key as number.
 * @returns {string} ?
 */
function convertToChar(cArr: number[]): string {
    let ret: string = '';
    for (const arr of cArr) {
        ret += String.fromCharCode(arr);
    }
    return ret;
}
/**
 * To set license key.
 *
 * @param {string} key - license key
 * @returns {void}
 */
export function registerLicense(key: string): void {
    if (typeof window !== 'undefined') {
        key = (window as any).syncfusionLicenseKey ? (window as any).syncfusionLicenseKey : key;
    }
    licenseValidator = new LicenseValidator(key);
}

export const validateLicense: Function = (component: string, key?: string): boolean => {
    if (typeof window !== 'undefined') {
        key = (window as any).syncfusionLicenseKey ? (window as any).syncfusionLicenseKey : key;
    }
    if (key) {
        registerLicense(key);
    }
    if (containerObject) {
        const val2: string = getValue(convertToChar(bypassKey2), containerObject);
        const val3: string = getValue(convertToChar(bypassKey3), containerObject);
        if (val2 && esUI.indexOf(component) === -1) {
            return true;
        }
    }
    return licenseValidator.validate(component);
};

export const getVersion: Function = (): string => {
    return licenseValidator.version;
};

interface IValidator {
    prefixRegex?: string;
    incorrectPlatform?: string;
    version?: string;
    expiryDate?: string;
    platform?: string;
    invalidPlatform?: boolean;
    lastValue?: number;
    minVersion?: number;
}

interface IErrorType {
    noLicense: string;
    trailExpired: string;
    versionMismatched: string;
    platformMismatched: string;
    invalidKey: string;
    uiSuite: string;
    documentSdk: string;
    pdfSdk: string;
    pptxEditorSdk: string;
    spreadSheetSdk: string;
    docxEditorSdk: string;
    gridSdk: string;
    filemanagerSdk: string;
    ganttSdk: string;
    rteSdk: string;
    diagaramSdk: string;
    schedulerSdk: string;
    chartSdk: string;
}
