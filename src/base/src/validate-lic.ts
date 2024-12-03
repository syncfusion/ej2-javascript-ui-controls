import { createElement } from './dom';
import { getValue, containerObject, setValue, isNullOrUndefined } from './util';
export const componentList: string[] = ['grid', 'pivotview', 'treegrid', 'spreadsheet', 'rangeNavigator', 'DocumentEditor', 'listbox', 'inplaceeditor', 'PdfViewer', 'richtexteditor', 'DashboardLayout', 'chart', 'stockChart', 'circulargauge', 'diagram', 'heatmap', 'lineargauge', 'maps', 'slider', 'smithchart', 'barcode', 'sparkline', 'treemap', 'bulletChart', 'kanban', 'daterangepicker', 'schedule', 'gantt', 'signature', 'query-builder', 'drop-down-tree', 'carousel', 'filemanager', 'uploader', 'accordion', 'tab', 'treeview'];

const bypassKey: number[] = [115, 121, 110, 99, 102, 117, 115, 105,
    111, 110, 46, 105, 115, 76, 105, 99, 86, 97, 108,
    105, 100, 97, 116, 101, 100];
let accountURL: string;
/**
 * License validation module
 *
 * @private
 */
class LicenseValidator {
    private isValidated: boolean = false;
    public isLicensed: boolean = true;
    public version: string = '27';
    public platform: RegExp = /JavaScript|ASPNET|ASPNETCORE|ASPNETMVC|FileFormats|essentialstudio/i;
    private errors: IErrorType = {
        noLicense: '<span>This application was built using a trial version of Syncfusion Essential Studio.' +
            ' To remove the license validation message permanently, a valid license key must be included.</span>',
        trailExpired: '<span>This application was built using a trial version of Syncfusion Essential Studio.' +
            ' To remove the license validation message permanently, a valid license key must be included.</span>',
        versionMismatched: '<span>The included Syncfusion license key is invalid.</span>',
        platformMismatched: '<span>The included Syncfusion license key is invalid.</span>',
        invalidKey: '<span>The included Syncfusion license key is invalid.</span>'
    };

    constructor(key?: string) {
        this.manager.setKey(key);
    }

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
     * @returns {boolean} ?
     */
    public validate(): boolean {
        const contentKey: number[] = [115, 121, 110, 99, 102, 117, 115, 105, 111, 110, 46,
            108, 105, 99, 101, 110, 115, 101, 67, 111, 110, 116, 101, 110, 116];
        const URLKey: number[] = [115, 121, 110, 99, 102, 117, 115, 105, 111, 110, 46,
            99, 108, 97, 105, 109, 65, 99, 99, 111, 117, 110, 116, 85, 82, 76];
        if (!this.isValidated && (containerObject && !getValue(convertToChar(bypassKey), containerObject) && !getValue('Blazor', containerObject))) {
            let validateMsg: string;
            let validateURL: string;
            if ((this.manager && this.manager.getKey()) || (this.npxManager && this.npxManager.getKey() !== 'npxKeyReplace')) {
                const result: IValidator[] = this.getInfoFromKey();
                if (result && result.length) {
                    for (const res of result) {
                        if (!this.platform.test(res.platform) || res.invalidPlatform) {
                            validateMsg = this.errors.platformMismatched;
                        } else if (res.version.indexOf(this.version) === -1) {
                            validateMsg = this.errors.versionMismatched;
                            validateMsg = validateMsg.replace('##LicenseVersion', res.version);
                            validateMsg = validateMsg.replace('##Requireversion', this.version + '.x');
                        } else if (res.expiryDate) {
                            const expDate: Date = new Date(res.expiryDate);
                            const currDate: Date = new Date();
                            if (expDate !== currDate && expDate < currDate) {
                                validateMsg = this.errors.trailExpired;
                            } else {
                                break;
                            }
                        }
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
                accountURL = (validateURL && validateURL !== '') ?  validateURL : 'https://www.syncfusion.com/account/claim-license-key?pl=SmF2YVNjcmlwdA==&vs=Mjc=&utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information';
                const errorDiv: HTMLElement = createElement('div', {
                    innerHTML: `<img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzE5OV80KSI+CjxwYXRoIGQ9Ik0xMiAyMUMxNi45NzA2IDIxIDIxIDE2Ljk3MDYgMjEgMTJDMjEgNy4wMjk0NCAxNi45NzA2IDMgMTIgM0M3LjAyOTQ0IDMgMyA3LjAyOTQ0IDMgMTJDMyAxNi45NzA2IDcuMDI5NDQgMjEgMTIgMjFaIiBzdHJva2U9IiM3MzczNzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMS4yNSAxMS4yNUgxMlYxNi41SDEyLjc1IiBmaWxsPSIjNjE2MDYzIi8+CjxwYXRoIGQ9Ik0xMS4yNSAxMS4yNUgxMlYxNi41SDEyLjc1IiBzdHJva2U9IiM3MzczNzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMS44MTI1IDlDMTIuNDMzOCA5IDEyLjkzNzUgOC40OTYzMiAxMi45Mzc1IDcuODc1QzEyLjkzNzUgNy4yNTM2OCAxMi40MzM4IDYuNzUgMTEuODEyNSA2Ljc1QzExLjE5MTIgNi43NSAxMC42ODc1IDcuMjUzNjggMTAuNjg3NSA3Ljg3NUMxMC42ODc1IDguNDk2MzIgMTEuMTkxMiA5IDExLjgxMjUgOVoiIGZpbGw9IiM3MzczNzMiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8xOTlfNCI+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K' style="top: 6px;
                    position: absolute;
                    left: 16px;
                    width: 24px;
                    height: 24px;"/>` + validateMsg + ' ' + '<a style="text-decoration: none;color: #0D6EFD;font-weight: 500;" href=' + accountURL + '>Claim your free account</a>'
                });
                errorDiv.setAttribute('style', `position: fixed;
                top: 10px;
                left: 10px;
                right: 10px;
                font-size: 14px;
                background: #EEF2FF;
                color: #222222;
                z-index: 999999999;
                text-align: left;
                border: 1px solid #EEEEEE;
                padding: 10px 11px 10px 50px;
                border-radius: 8px;
                font-family: Helvetica Neue, Helvetica, Arial;`);
                document.body.appendChild(errorDiv);
                this.isLicensed = false;
            }
            this.isValidated = true;
            setValue(convertToChar(bypassKey), this.isValidated, containerObject);
        }
        return this.isLicensed;
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
                if (this.platform.test(buffr)) {
                    decryptedStr = buffr.split(';');
                    invalidPlatform = false;
                    // checked the length to verify the key in proper strucutre
                    if (decryptedStr.length > 3) {
                        resultArray.push({platform: decryptedStr[0],
                            version: decryptedStr[1],
                            expiryDate: decryptedStr[2]});
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
    licenseValidator = new LicenseValidator(key);
}

export const validateLicense: Function = (key?: string): boolean => {
    if (key) {
        registerLicense(key);
    }
    return licenseValidator.validate();
};

export const getVersion: Function = (): string => {
    return licenseValidator.version;
};

// Method for create overlay over the sample

export const createLicenseOverlay: Function = (): void => {
    const bannerTemplate: string = `
    <div style="
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999;
    ">
        <div style="
    background: #FFFFFF;
    height: 455px;
    width: 840px;
    font-family: Helvetica Neue, Helvetica, Arial;
    color: #000000;
    box-shadow: 0px 4.8px 14.4px rgb(0 0 0 / 18%), 0px 25.6px 57.6px rgb(0 0 0 / 22%);
    display: block;
    margin: 8% auto;
    border-radius: 20px;
    ">
            <div style="
    position: absolute;
width: 838px;
height: 62px;
background-color: #F9F9F9;
border: 1px solid #EEEEEE;
border-top-left-radius: 20px;
border-top-right-radius: 20px;
">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ2IiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTQ2IDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDAuNTk2NSAxNS4wMDc4SDMyLjQyNUMzMS41NTU3IDE1LjAwNzggMzAuOTAzNyAxNS4xODEyIDMwLjUxMjUgMTUuNDg0NkMzMC4xMjEzIDE1LjgzMTQgMjkuOTA0IDE2LjMwODIgMjkuOTA0IDE3LjA0NTFDMjkuOTA0IDE3LjYwODYgMzAuMDc3OCAxOC4wNDIxIDMwLjQyNTYgMTguMzAyMkMzMC43NzMzIDE4LjYwNTYgMzEuMjk0OSAxOC43MzU2IDMxLjk5MDMgMTguNzM1NkgzNi4zMzY5QzM4LjExODkgMTguNzM1NiAzOS40MjI5IDE5LjA4MjQgNDAuMTYxOCAxOS43MzI2QzQwLjk0NDIgMjAuNDI2MiA0MS4yOTE5IDIxLjU1MzIgNDEuMjkxOSAyMy4xMTM3QzQxLjI5MTkgMjQuNzE3NiA0MC44NTcyIDI1Ljg4OCAzOS45ODc5IDI2LjY2ODJDMzkuMTE4NiAyNy40MDUxIDM3LjcyNzcgMjcuNzk1MyAzNS44NTg3IDI3Ljc5NTNIMjcuMDc4N1YyNS4wMjFIMzUuMzM3MkMzNi4yOTM0IDI1LjAyMSAzNi45NDU0IDI0Ljg5MSAzNy4zMzY2IDI0LjYzMDlDMzcuNzI3NyAyNC4zNzA4IDM3LjkwMTYgMjMuODk0IDM3LjkwMTYgMjMuMjg3MUMzNy45MDE2IDIyLjYzNjkgMzcuNzI3NyAyMi4xNjAxIDM3LjM4IDIxLjlDMzcuMDMyMyAyMS42Mzk5IDM2LjQyMzggMjEuNDY2NSAzNS41NTQ1IDIxLjQ2NjVIMzEuNjQyNkMyOS44NjA1IDIxLjQ2NjUgMjguNTEzMSAyMS4xMTk4IDI3LjY4NzMgMjAuMzgyOEMyNi44NjE0IDE5LjY0NTkgMjYuNDI2OCAxOC41MTg5IDI2LjQyNjggMTcuMDAxN0MyNi40MjY4IDE1LjM1NDUgMjYuODYxNCAxNC4xNDA4IDI3LjczMDcgMTMuMzYwNkMyOC42IDEyLjU4MDMgMjkuOTkwOSAxMi4yMzM1IDMxLjkwMzQgMTIuMjMzNUg0MC41OTY1VjE1LjAwNzhaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik00OC4wNzI3IDI1LjI4MTFINTAuNTA2OFYxNi4zOTQ5SDUzLjU0OTNWMjcuNTM1MkM1My41NDkzIDI5LjA1MjQgNTMuMjAxNiAzMC4xNzk0IDUyLjUwNjIgMzAuOTE2M0M1MS44MTA3IDMxLjY1MzIgNTAuNzI0MSAzMiA0OS4yNDYzIDMySDQzLjMzNVYyOS42NTkySDQ4LjcyNDdDNDkuMjg5NyAyOS42NTkyIDQ5Ljc2NzkgMjkuNTI5MiA1MC4wNzIxIDI5LjIyNThDNTAuMzc2NCAyOC45NjU3IDUwLjU1MDIgMjguNTMyMiA1MC41NTAyIDI4LjAxMlYyNy44Mzg2SDQ3Ljg5ODlDNDYuMjAzNyAyNy44Mzg2IDQ0Ljk0MzIgMjcuNDkxOSA0NC4yNDc4IDI2Ljg0MTZDNDMuNTA4OSAyNi4xNDgxIDQzLjE2MTEgMjUuMDY0NCA0My4xNjExIDIzLjQ2MDVWMTYuMzk0OUg0Ni4xNjAyVjIzLjIwMDVDNDYuMTYwMiAyNC4wNjc0IDQ2LjI5MDYgMjQuNjMwOSA0Ni41NTE0IDI0Ljg5MUM0Ni43MjUzIDI1LjE1MTEgNDcuMjQ2OSAyNS4yODExIDQ4LjA3MjcgMjUuMjgxMVoiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTU1Ljg5NjUgMTYuMzk0OUg2MS41OTA0QzYzLjMyOTEgMTYuMzk0OSA2NC41NDYxIDE2LjY5ODMgNjUuMjg1IDE3LjM0ODVDNjYuMDIzOSAxNy45OTg4IDY2LjM3MTYgMTkuMDgyNCA2Ni4zNzE2IDIwLjU1NjNWMjcuNzk1M0g2My4zMjkxVjIwLjk0NjRDNjMuMzI5MSAyMC4wNzk0IDYzLjE5ODcgMTkuNTE1OSA2Mi45Mzc5IDE5LjI5OTJDNjIuNjc3MSAxOS4wMzkxIDYyLjE1NTUgMTguOTA5MSA2MS4zMjk3IDE4LjkwOTFINTguODk1NlYyNy44Mzg2SDU1Ljg1M1YxNi4zOTQ5SDU1Ljg5NjVaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik03NC45MzQyIDI1LjM2NzhINzguMTUwNlYyNy43OTUySDc0LjAyMTRDNzIuOTc4MiAyNy43OTUyIDcyLjEwODkgMjcuNjY1MiA3MS40NTcgMjcuNDkxOEM3MC44MDUgMjcuMjc1IDcwLjE5NjUgMjYuOTI4MyA2OS43MTgzIDI2LjQ1MTRDNjkuMTk2OCAyNS45MzEzIDY4Ljc2MjEgMjUuMjgxMSA2OC40NTc4IDI0LjU0NDJDNjguMTUzNiAyMy44MDcyIDY4LjAyMzIgMjIuOTgzNiA2OC4wMjMyIDIyLjE2QzY4LjAyMzIgMjEuMjkzMSA2OC4xNTM2IDIwLjQ2OTUgNjguNDU3OCAxOS42ODkyQzY4Ljc2MjEgMTguOTA5IDY5LjE1MzMgMTguMzAyMSA2OS43MTgzIDE3Ljc4MTlDNzAuMjM5OSAxNy4zMDUxIDcwLjgwNSAxNi45NTgzIDcxLjUwMDQgMTYuNzQxNkM3Mi4xOTU5IDE2LjUyNDkgNzMuMDIxNyAxNi40MzgyIDc0LjA2NDkgMTYuNDM4Mkg3OC4xOTQxVjE4LjkwOUg3NC45MzQyQzczLjQ5OTggMTguOTA5IDcyLjU0MzYgMTkuMTY5MSA3MS45Nzg1IDE5LjY0NTlDNzEuNDU2OSAyMC4xMjI3IDcxLjE1MjcgMjAuOTg5NyA3MS4xNTI3IDIyLjIwMzRDNzEuMTUyNyAyMi44OTY5IDcxLjI4MzEgMjMuNDYwNSA3MS41MDA0IDIzLjkzNzNDNzEuNzE3NyAyNC40MTQxIDcyLjA2NTUgMjQuNzYwOSA3Mi41MDAxIDI1LjA2NDNDNzIuNzE3NCAyNS4xOTQ0IDcyLjk3ODIgMjUuMjgxMSA3My4yODI1IDI1LjM2NzhDNzMuNjMwMiAyNS4zMjQ0IDc0LjE1MTggMjUuMzY3OCA3NC45MzQyIDI1LjM2NzhaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik04MC44NDU2IDE4LjY0ODlINzguNjcyNFYxNi4zNTE1SDgwLjg0NTZWMTUuMTgxMUM4MC44NDU2IDE0LjAxMDggODEuMDYzIDEzLjIzMDUgODEuNDk3NiAxMi44NDA0QzgxLjkzMjMgMTIuNDUwMyA4Mi43NTgxIDEyLjIzMzUgODMuOTc1MSAxMi4yMzM1SDg2Ljg0MzhWMTQuNDAwOUg4NS40MDk1Qzg0Ljg4NzkgMTQuNDAwOSA4NC41NDAyIDE0LjQ4NzYgODQuMzIyOSAxNC42NjFDODQuMTA1NSAxNC44MzQ0IDgzLjk3NTEgMTUuMDk0NSA4My45NzUxIDE1LjQ0MTJWMTYuMzUxNUg4Ni44NDM4VjE4LjY0ODlIODMuOTc1MVYyNy43OTUzSDgwLjg0NTZWMTguNjQ4OVoiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTk4LjQwNTYgMjcuNzk1M0g5Mi43MTE2QzkxLjAxNjUgMjcuNzk1MyA4OS44NDI5IDI3LjQ0ODUgODkuMDYwNSAyNi43OTgzQzg4LjMyMTYgMjYuMTQ4MSA4Ny45MzA0IDI1LjA2NDQgODcuOTMwNCAyMy41OTA2VjE2LjM5NDlIOTAuOTI5NVYyMy40MTcyQzkwLjkyOTUgMjQuMTk3NCA5MS4wNTk5IDI0LjY3NDMgOTEuMzIwNyAyNC45MzQ0QzkxLjU4MTUgMjUuMTk0NCA5Mi4xMDMxIDI1LjMyNDUgOTIuOTI4OSAyNS4zMjQ1SDk1LjM2M1YxNi4zOTQ5SDk4LjQwNTZWMjcuNzk1M1oiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTEwMC42MjIgMjUuNDExMkgxMDcuMDExQzEwNy41NzcgMjUuNDExMiAxMDguMDExIDI1LjMyNDUgMTA4LjI3MiAyNS4xNTExQzEwOC41MzMgMjQuOTc3NyAxMDguNjYzIDI0LjY3NDMgMTA4LjY2MyAyNC4zMjc1QzEwOC42NjMgMjMuOTM3NCAxMDguNTMzIDIzLjY3NzMgMTA4LjI3MiAyMy40NjA1QzEwOC4wMTEgMjMuMjg3MSAxMDcuNTc3IDIzLjIwMDUgMTA3LjA1NSAyMy4yMDA1SDEwNC40NDdDMTAyLjg4MiAyMy4yMDA1IDEwMS44MzkgMjIuOTgzNyAxMDEuMzE4IDIyLjUwNjlDMTAwLjc1MiAyMi4wMzAxIDEwMC40OTIgMjEuMjA2NSAxMDAuNDkyIDE5Ljk5MjdDMTAwLjQ5MiAxOC43NzkgMTAwLjgzOSAxNy44Njg3IDEwMS40OTEgMTcuMjYxOEMxMDIuMTQzIDE2LjY5ODMgMTAzLjE4NyAxNi4zOTQ5IDEwNC41MzQgMTYuMzk0OUgxMTEuMDU0VjE4Ljc3OUgxMDUuNzA4QzEwNC44MzggMTguNzc5IDEwNC4yNzMgMTguODY1NyAxMDQuMDEyIDE4Ljk5NTdDMTAzLjc1MiAxOS4xNjkxIDEwMy42MjEgMTkuNDI5MiAxMDMuNjIxIDE5LjgxOTRDMTAzLjYyMSAyMC4xNjYxIDEwMy43NTIgMjAuNDI2MiAxMDMuOTY5IDIwLjU5OTZDMTA0LjE4NiAyMC43NzMgMTA0LjU3NyAyMC44NTk3IDEwNS4wNTYgMjAuODU5N0gxMDcuNzk0QzEwOS4wNTQgMjAuODU5NyAxMTAuMDExIDIxLjE2MzEgMTEwLjY2MyAyMS43MjY2QzExMS4zMTUgMjIuMjkwMiAxMTEuNjYyIDIzLjE1NzEgMTExLjY2MiAyNC4yNDA4QzExMS42NjIgMjUuMjgxMSAxMTEuMzU4IDI2LjE0ODEgMTEwLjc5MyAyNi43OTgzQzExMC4yMjggMjcuNDQ4NSAxMDkuNDQ2IDI3Ljc5NTMgMTA4LjUzMyAyNy43OTUzSDEwMC43MDlWMjUuNDExMkgxMDAuNjIyWiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMTE2LjU3NCAxNS4wOTQ0SDExMy40MDFWMTIuMjc2OUgxMTYuNTc0VjE1LjA5NDRaTTExNi41NzQgMjcuNzk1M0gxMTMuNDAxVjE2LjM5NDlIMTE2LjU3NFYyNy43OTUzWiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMTMwLjMwOSAyMi4xMTY3QzEzMC4zMDkgMjMuODkzOSAxMjkuNzQ0IDI1LjMyNDQgMTI4LjY1NyAyNi40MDgxQzEyNy41NzEgMjcuNDkxOCAxMjYuMDkzIDI4LjAxMiAxMjQuMjI0IDI4LjAxMkMxMjIuMzU1IDI4LjAxMiAxMjAuODc3IDI3LjQ5MTggMTE5Ljc5IDI2LjQwODFDMTE4LjcwNCAyNS4zMjQ0IDExOC4xMzkgMjMuODkzOSAxMTguMTM5IDIyLjExNjdDMTE4LjEzOSAyMC4zMzk0IDExOC43MDQgMTguOTA5IDExOS43OSAxNy44MjUzQzEyMC44NzcgMTYuNzQxNiAxMjIuMzk4IDE2LjIyMTQgMTI0LjIyNCAxNi4yMjE0QzEyNi4wNDkgMTYuMjIxNCAxMjcuNTI3IDE2Ljc0MTYgMTI4LjY1NyAxNy44MjUzQzEyOS43NDQgMTguODY1NiAxMzAuMzA5IDIwLjI5NjEgMTMwLjMwOSAyMi4xMTY3Wk0xMjEuMjY4IDIyLjExNjdDMTIxLjI2OCAyMy4yMDA0IDEyMS41MjkgMjQuMDY3MyAxMjIuMDUxIDI0LjY3NDJDMTIyLjU3MiAyNS4yODExIDEyMy4yNjggMjUuNTg0NSAxMjQuMTggMjUuNTg0NUMxMjUuMDkzIDI1LjU4NDUgMTI1Ljc4OSAyNS4yODExIDEyNi4zMSAyNC42NzQyQzEyNi44MzIgMjQuMDY3MyAxMjcuMDkzIDIzLjIwMDQgMTI3LjA5MyAyMi4xMTY3QzEyNy4wOTMgMjEuMDMzIDEyNi44MzIgMjAuMTY2MSAxMjYuMzEgMTkuNjAyNUMxMjUuNzg5IDE4Ljk5NTcgMTI1LjA5MyAxOC42OTIyIDEyNC4xMzcgMTguNjkyMkMxMjMuMjI0IDE4LjY5MjIgMTIyLjUyOSAxOC45OTU3IDEyMi4wMDcgMTkuNjAyNUMxMjEuNTI5IDIwLjE2NjEgMTIxLjI2OCAyMS4wMzMgMTIxLjI2OCAyMi4xMTY3WiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMTMxLjc4NyAxNi4zOTQ5SDEzNy40ODFDMTM5LjIxOSAxNi4zOTQ5IDE0MC40MzYgMTYuNjk4MyAxNDEuMTc1IDE3LjM0ODVDMTQxLjkxNCAxNy45OTg4IDE0Mi4yNjIgMTkuMDgyNCAxNDIuMjYyIDIwLjU1NjNWMjcuNzk1M0gxMzkuMjE5VjIwLjk0NjRDMTM5LjIxOSAyMC4wNzk0IDEzOS4wODkgMTkuNTE1OSAxMzguODI4IDE5LjI5OTJDMTM4LjU2NyAxOS4wMzkxIDEzOC4wNDYgMTguOTA5MSAxMzcuMjIgMTguOTA5MUgxMzQuNzg2VjI3LjgzODZIMTMxLjc0M1YxNi4zOTQ5SDEzMS43ODdaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik03LjEyODMxIDMuNzM3NDNIMFYxMC44NDY0SDcuMTI4MzFWMy43Mzc0M1oiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTIzLjI1MTMgLTIuMTU3MjVlLTA1TDE4LjU1MTMgNS41MTY4NUwyNC4wODMxIDEwLjIwNDFMMjguNzgzMSA0LjY4NzI1TDIzLjI1MTMgLTIuMTU3MjVlLTA1WiIgZmlsbD0iI0ZGODYwMCIvPgo8cGF0aCBkPSJNMTUuNjA0MSAzLjczNzQzSDguNDc1ODNWMTAuODQ2NEgxNS42MDQxVjMuNzM3NDNaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik03LjEyODMxIDEyLjE5MDJIMFYxOS4yOTkySDcuMTI4MzFWMTIuMTkwMloiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTE1LjYwNDEgMTIuMTkwMkg4LjQ3NTgzVjE5LjI5OTJIMTUuNjA0MVYxMi4xOTAyWiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMjQuMDc5NyAxMi4xOTAySDE2Ljk1MTRWMTkuMjk5MkgyNC4wNzk3VjEyLjE5MDJaIiBmaWxsPSIjRkY4NjAwIi8+CjxwYXRoIGQ9Ik03LjEyODMxIDIwLjY4NjNIMFYyNy43OTUzSDcuMTI4MzFWMjAuNjg2M1oiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTE1LjYwNDEgMjAuNjg2M0g4LjQ3NTgzVjI3Ljc5NTNIMTUuNjA0MVYyMC42ODYzWiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMjQuMTIzMiAyMC42ODYzSDE2Ljk5NDlWMjcuNzk1M0gyNC4xMjMyVjIwLjY4NjNaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik0xNDYgMTUuODMxM0MxNDYgMTYuODcxNyAxNDUuMTc0IDE3LjY5NTMgMTQ0LjEzMSAxNy42OTUzQzE0My4wODggMTcuNjk1MyAxNDIuMjYyIDE2Ljg3MTcgMTQyLjI2MiAxNS44MzEzQzE0Mi4yNjIgMTQuNzkxIDE0My4wODggMTQuMDEwNyAxNDQuMTMxIDE0LjAxMDdDMTQ1LjEzMSAxMy45Njc0IDE0NiAxNC43OTEgMTQ2IDE1LjgzMTNaTTE0Mi45NTcgMTQuNzkxQzE0Mi42OTcgMTUuMDUxMSAxNDIuNTY2IDE1LjQ0MTIgMTQyLjU2NiAxNS44MzEzQzE0Mi41NjYgMTYuNjk4MyAxNDMuMjYyIDE3LjM5MTggMTQ0LjEzMSAxNy4zOTE4QzE0NSAxNy4zOTE4IDE0NS42OTYgMTYuNjk4MyAxNDUuNjk2IDE1LjgzMTNDMTQ1LjY5NiAxNS4wMDc3IDE0NSAxNC4yNzA4IDE0NC4xNzQgMTQuMjcwOEMxNDMuNjUzIDE0LjI3MDggMTQzLjI2MiAxNC40NDQyIDE0Mi45NTcgMTQuNzkxWk0xNDQuODcgMTYuOTE1SDE0NC40NzlMMTQzLjkxNCAxNi4wOTE0VjE2LjkxNUgxNDMuNjA5VjE0Ljc0NzZIMTQzLjk1N0MxNDQuNDM1IDE0Ljc0NzYgMTQ0LjY1MyAxNC45NjQ0IDE0NC42NTMgMTUuMzU0NUMxNDQuNjUzIDE1LjY1NzkgMTQ0LjQ3OSAxNS44NzQ3IDE0NC4xNzQgMTUuOTYxNEwxNDQuODcgMTYuOTE1Wk0xNDQuMDQ0IDE1LjY1NzlDMTQ0LjI2MSAxNS42NTc5IDE0NC4zOTIgMTUuNTI3OSAxNDQuMzkyIDE1LjM1NDVDMTQ0LjM5MiAxNS4xMzc4IDE0NC4yNjEgMTUuMDUxMSAxNDQuMDAxIDE1LjA1MTFIMTQzLjkxNFYxNS42NTc5SDE0NC4wNDRaIiBmaWxsPSIjMzU0M0E4Ii8+Cjwvc3ZnPgo=" style="
    text-align: left;
    width: 146px;
    position: absolute;
    top: 14px;
    left: 31px;
">
            </div>
            <div style="
    position: relative;
    top: 80px;
    left: 32px;
    font-size: 20px;
    text-align: left;
    font-weight: 700;
    letter-spacing: 0.02em;
    font-style: normal;
    line-height: 125%;
    ">Claim your FREE account and get a key in less than a minute</div>
            <ul style="
        font-size: 15px;
        font-weight: 400;
        color: #333333;
        letter-spacing: 0.01em;
        position: relative;
        left: 32px;
        top: 88px;
        line-height: 180%;
        ">
                <li><span>Access to a 30-day free trial of any of our products.</span></li>
                <li><span>Access to 24x5 support by developers via the <a href="https://support.syncfusion.com/create?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information" style="text-decoration: none;
                color: #0D6EFD;
                font-weight: 500;">support tickets</a>, <a href="https://www.syncfusion.com/forums?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information" style="text-decoration: none;
                color: #0D6EFD;
                font-weight: 500;">forum</a>, <a href="https://www.syncfusion.com/feedback?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information
                " style="text-decoration: none;
                color: #0D6EFD;
                font-weight: 500;">feature &amp; feedback page</a> and chat.</span></li>
                <li><span>200+ <a href="https://www.syncfusion.com/succinctly-free-ebooks?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information" style="text-decoration: none;
                color: #0D6EFD;
                font-weight: 500;">ebooks </a>on the latest technologies, industry trends, and research topics.</span>
                </li>
                <li><span>Largest collection of over 7,000 flat and wireframe icons for free with Syncfusion <a href="https://www.syncfusion.com/downloads/metrostudio?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information
                " style="text-decoration: none;
                color: #0D6EFD;
                font-weight: 500;">Metro Studio.</a></span></li>
                <li><span>Free and unlimited access to Syncfusion technical <a href="https://www.syncfusion.com/blogs/?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information
                " style="text-decoration: none;
                color: #0D6EFD;
                font-weight: 500;">blogs</a> and <a href="https://www.syncfusion.com/resources/techportal/whitepapers?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information" style="text-decoration: none;
                color: #0D6EFD;
                font-weight: 500;">whitepapers.</a></span></li>
            </ul>
            <div style="
            font-size: 18px;
            font-weight: 700;
            position: relative;
            line-height: 125%;
            letter-spacing: 0.02em;
            top: 90px;
            left: 32px;
    ">Syncfusion is trusted by 29,000+ businesses worldwide</div>
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODIwIiBoZWlnaHQ9IjU2IiB2aWV3Qm94PSIwIDAgODIwIDU2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00MjcuNjE3IDIyLjU2NTlWMjQuNzIyNkM0MjYuNTU4IDI0LjM2MzggNDI1LjM5OCAyNC4xNTQ0IDQyNC40NzQgMjQuMTU0NEM0MjMuMzMzIDI0LjE1NDQgNDIyLjY5OCAyNC40OTEyIDQyMi42OTggMjUuMDk2M0M0MjIuNjk4IDI1LjQ4MjQgNDIyLjk3NiAyNS43MzgzIDQyMy43NzMgMjYuMDg1NEw0MjUuOTE3IDI3LjAxNzRDNDI3LjYzMyAyNy43NjM5IDQyOC40OTcgMjguODUzIDQyOC40OTcgMzAuMjY4MUM0MjguNDk3IDMyLjQ1MjIgNDI2LjU0NiAzMy44MyA0MjMuNDUyIDMzLjgzQzQyMi4zMjQgMzMuODMgNDIxLjAxOCAzMy42NzM2IDQxOS42MzYgMzMuMzcwOVYzMS4xNDE2QzQyMS4wMDYgMzEuNTAyOCA0MjIuMjYyIDMxLjY5NTcgNDIzLjIzOSAzMS42OTU3QzQyNC41MTggMzEuNjk1NyA0MjUuMjAzIDMxLjM1MDYgNDI1LjIwMyAzMC43MDc0QzQyNS4yMDMgMzAuMzIwOCA0MjQuOTM1IDMwLjAzNjcgNDI0LjMyMiAyOS43NzE3TDQyMS45NzUgMjguNzU5M0M0MjAuMjM2IDI4LjAwNzggNDE5LjQzMyAyNi45OTU0IDQxOS40MzMgMjUuNTUyMUM0MTkuNDMzIDIzLjQ4MzcgNDIxLjMxNCAyMi4xNjQ5IDQyNC4yNjUgMjIuMTY0OUM0MjUuMjk4IDIyLjE2NDkgNDI2LjU3IDIyLjMxNzEgNDI3LjYxNyAyMi41NjU5VjIyLjU2NTlaTTQzMC4xNjcgMjIuMzkwOUg0MzMuNjM1VjMzLjYwMzlINDMwLjE2N1YyMi4zOTA5Wk00NDQuOTExIDIyLjM5MDlWMjQuNDQ1MUg0MzkuNjc1VjI2Ljk3NDJINDQ0LjI0OVYyOC44MzIzSDQzOS42NzVWMzEuNDU0M0g0NDQuOTc4VjMzLjYwMzlINDM2LjMwNVYyMi4zOTA5SDQ0NC45MTFaTTQ2MS4yOTQgMjIuMzkwOVYzMy42MDM5SDQ1Ny45MzlWMjYuMjIzNkw0NTQuNjUyIDMzLjY5MTVINDUyLjUzMUw0NDkuMjY2IDI2LjIyMzZWMzMuNjAzOUg0NDYuOTQ5VjIyLjM5MDlINDUxLjE4NEw0NTQuMTc4IDI5LjIxMTRMNDU3LjE1NiAyMi4zOTA5SDQ2MS4yOTRWMjIuMzkwOVpNNDcyLjU3OSAyMi4zOTA5VjI0LjQ0NTFINDY3LjMzNVYyNi45NzQySDQ3MS45MDhWMjguODMyM0g0NjcuMzM1VjMxLjQ1NDNINDcyLjYzOFYzMy42MDM5SDQ2My45NTdWMjIuMzkwOUg0NzIuNTc5Wk00ODQuNzk0IDIyLjM5MDlWMzMuNjAzOUg0ODEuMDkzTDQ3Ni45MjYgMjYuNDEyM1YzMy42MDM5SDQ3NC42MDhWMjIuMzkwOUg0NzguNDA3TDQ4Mi40ODQgMjkuNDg3NlYyMi4zOTA5SDQ4NC43OTRaTTQ5NC44NTggMjIuNTY1OVYyNC43MjI2QzQ5My44MDcgMjQuMzY2MyA0OTIuNjQgMjQuMTU0NCA0OTEuNzMyIDI0LjE1NDRDNDkwLjU3MyAyNC4xNTQ0IDQ4OS45MzkgMjQuNDg1OCA0ODkuOTM5IDI1LjA5M0M0ODkuOTM5IDI1LjQ4ODYgNDkwLjE5OCAyNS43MjUgNDkxLjAyMyAyNi4wODU5TDQ5My4xNTcgMjcuMDE3OEM0OTQuODg1IDI3Ljc3MjIgNDk1LjczOSAyOC44NTE4IDQ5NS43MzkgMzAuMjgzNUM0OTUuNzM5IDMyLjQ1NTkgNDkzLjc4NiAzMy44MzA4IDQ5MC42OTkgMzMuODMwOEM0ODkuNTY5IDMzLjgzMDggNDg4LjI1OSAzMy42NzM2IDQ4Ni44NzggMzMuMzcxN1YzMS4xNDI0QzQ4OC4yNDcgMzEuNTAyOCA0ODkuNDk5IDMxLjY5NjUgNDkwLjQ3IDMxLjY5NjVDNDkxLjc0IDMxLjY5NjUgNDkyLjQ0NCAzMS4zNTE1IDQ5Mi40NDQgMzAuNzI4NUM0OTIuNDQ0IDMwLjMxNjMgNDkyLjE5NyAzMC4wNTA0IDQ5MS41NTUgMjkuNzcyNUw0ODkuMjE4IDI4Ljc2MDFDNDg3LjQ2NyAyOC4wMDI4IDQ4Ni42NzQgMjcuMDAyIDQ4Ni42NzQgMjUuNTUzM0M0ODYuNjc0IDIzLjQ4NjIgNDg4LjU1NiAyMi4xNjY1IDQ5MS41IDIyLjE2NjVDNDkyLjUzNiAyMi4xNjUzIDQ5My44MTMgMjIuMzE3MSA0OTQuODU4IDIyLjU2NTlWMjIuNTY1OVoiIGZpbGw9IiMwMEEwQjAiLz4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzUyLjQxMyAyNi44MTlDMzUwLjk5MiAyNS4yNzU5IDM0OS42MzggMjMuODMxNSAzNDguMzQ5IDIyLjE1NzRMMzQ3LjkyIDIxLjU5OTVDMzQ5LjQwNiAyMS4zNjkzIDM1MC42OTUgMjAuMzg0OCAzNTAuNjk1IDE4Ljc0MzNDMzUwLjY5NSAxNy4yMzMxIDM0OS41MzkgMTYuMjQ4MiAzNDcuODIxIDE2LjI0ODJDMzQ2LjU5OCAxNi4yNDgyIDM0NS43MDYgMTYuMzEzNyAzNDUuMjQzIDE2LjMxMzdDMzQ0LjcxNSAxNi4zMTM3IDM0NC4yODUgMTYuMzEzNyAzNDMuNzkgMTYuMjgwOEMzNDMuODU2IDE4LjE1MjEgMzQzLjg4OSAxOC4yODM0IDM0My44ODkgMTkuNDMyMlYyMy42MzQzQzM0My44ODkgMjQuNDU1MyAzNDMuODU2IDI1LjI3NTkgMzQzLjc5IDI2LjgxODZDMzQ0LjE1MyAyNi43MjAyIDM0NC41MTcgMjYuNzIwMiAzNDQuNzgxIDI2LjcyMDJDMzQ1LjA0NSAyNi43MjAyIDM0NS40MDkgMjYuNzUzMSAzNDUuNzA2IDI2LjgxODZDMzQ1LjY0IDI1Ljc2NzkgMzQ1LjYwNyAyNC4wMjgzIDM0NS42MDcgMjMuNjM0M1YyMS4yMDUxQzM0Ny4xNiAyMy4yMDc3IDM0OS4yMDkgMjUuNjY5NSAzNTAuMDAxIDI2LjgxODZDMzUwLjM5OCAyNi43MjAyIDM1MC43MjggMjYuNzIwMiAzNTEuMTI0IDI2LjcyMDJDMzUxLjQ1NSAyNi43MjA2IDM1MS45MTggMjYuNzIwNiAzNTIuNDEzIDI2LjgxOVYyNi44MTlaTTM0OC44NzggMTkuMDA2QzM0OC44NzggMjAuMDIzNCAzNDguMzE3IDIxLjIwNTQgMzQ2Ljc5NyAyMS4yMDU0QzM0Ni40IDIxLjIwNTQgMzQ2LjAwMyAyMS4yMDU0IDM0NS42MDcgMjEuMTcyNVYxNy4wNjg4QzM0Ni4wMDMgMTYuOTcwNCAzNDYuNDk5IDE2LjkwNDYgMzQ2Ljc2MyAxNi45MDQ2QzM0OC4wODUgMTYuOTA0OSAzNDguODc4IDE3LjY2IDM0OC44NzggMTkuMDA2VjE5LjAwNlpNMzgyLjM4IDI2Ljg4NDVDMzgxLjgxOSAyNi4yOTM2IDM4MC45NiAyNS4zNDE3IDM4MC4xMzQgMjQuNDIyM0MzODAuODI4IDIzLjY2NzIgMzgxLjU1NSAyMi41NTEgMzgxLjk4NCAyMS41OTkxQzM4MS43MTkgMjEuNDY3OCAzODEuMzU2IDIxLjIwNTEgMzgxLjA5MiAyMC45NzUzQzM4MC45OTMgMjEuNzk1OSAzODAuNDMyIDIyLjg3OTIgMzc5LjYzOSAyMy44MzE1QzM3OC41MTUgMjIuNTE4NSAzNzguMjE4IDIyLjE1NzQgMzc3LjE5MyAyMC43Nzg1QzM3OC41ODEgMTkuODkyMSAzNzkuMjQyIDE4Ljg3NDMgMzc5LjI0MiAxOC4wNTM3QzM3OS4yNDIgMTcuMTAxNyAzNzguNTgxIDE2LjExNjkgMzc2Ljk2MiAxNi4xMTY5QzM3NS4yMTEgMTYuMTE2OSAzNzQuMzUyIDE3LjIwMDIgMzc0LjM1MiAxOC40ODAzQzM3NC4zNTIgMTkuMjM1NCAzNzQuNTUgMTkuODkxNyAzNzUuMzc2IDIwLjk3NTNDMzc0LjA1NCAyMS42OTc1IDM3Mi43NjYgMjIuNzQ3OSAzNzIuNzY2IDI0LjQyMjNDMzcyLjc2NiAyNi4wNjM5IDM3NC4wODcgMjYuOTE3NCAzNzUuNzA3IDI2LjkxNzRDMzc3LjE5MyAyNi45MTc0IDM3OC4xNTEgMjYuMzI2NiAzNzguOTEyIDI1LjYzNjlMMzc5LjkwMiAyNi44MTlDMzgwLjIgMjYuNzg2MSAzODAuNTMxIDI2LjcyMDYgMzgwLjg2MSAyNi43MjA2QzM4MS4zMjQgMjYuNzIwNiAzODEuODUyIDI2Ljc4NjEgMzgyLjM4IDI2Ljg4NDVWMjYuODg0NVpNMzgzLjM3MiA0MC4wMTU4QzM4MS45MTggMzguNDczIDM4MC41OTcgMzcuMDYxMiAzNzkuMzA4IDM1LjM4NzFMMzc4Ljg3OCAzNC44Mjg4QzM4MC4zMzIgMzQuNTk5MSAzODEuNjU0IDMzLjYxNSAzODEuNjU0IDMxLjk0MDFDMzgxLjY1NCAzMC40NjMyIDM4MC40OTggMjkuNDQ1NCAzNzguNzc5IDI5LjQ0NTRDMzc3LjU1NyAyOS40NDU0IDM3Ni42MzIgMjkuNTQzNSAzNzYuMTY5IDI5LjU0MzVDMzc1LjY3MyAyOS41NDM1IDM3NS4yNDQgMjkuNTQzNSAzNzQuNzQ4IDI5LjQ3NzZDMzc0LjgxNCAzMS4zODIyIDM3NC44NDggMzEuNDgwMiAzNzQuODQ4IDMyLjYyOTRWMzYuODMxMUMzNzQuODQ4IDM3LjY1MjQgMzc0LjgxNCAzOC41MDUyIDM3NC43NDggNDAuMDE1NEMzNzUuMTEyIDM5Ljk0OTYgMzc1LjQ3NSAzOS45NDk2IDM3NS43MDcgMzkuOTQ5NkMzNzYuMDA0IDM5Ljk0OTYgMzc2LjM2OCAzOS45NDk2IDM3Ni42MzIgNDAuMDE1NEMzNzYuNTY1IDM4Ljk5OCAzNzYuNTMzIDM3LjI1ODEgMzc2LjUzMyAzNi44MzExVjM0LjQzNDhDMzc4LjExOSAzNi40MDQyIDM4MC4xNjcgMzguODk5NiAzODAuOTYgNDAuMDE1NEMzODEuMzU2IDM5Ljk0OTYgMzgxLjY4NyAzOS45NDk2IDM4Mi4wODMgMzkuOTQ5NkMzODIuMzggMzkuOTUgMzgyLjg3NiAzOS45NSAzODMuMzcyIDQwLjAxNThaTTM2Mi4xNiAyNi44MTlDMzYwLjk3MSAyNS41NzE1IDM1OC44ODkgMjIuOTc4IDM1OC4wNjMgMjEuOTkzNUwzNTcuMjM3IDIwLjk3NTdDMzU4LjA5NiAxOS45NTgzIDM1OC42OSAxOS4zMzQxIDM1OS4zMTkgMTguNTc5QzM2MC4wNDUgMTcuNzkxIDM2MC43MDYgMTYuOTcwNCAzNjEuNDk5IDE2LjI0ODJDMzYxLjEzNiAxNi4zMTM3IDM2MC45MzcgMTYuMzEzNyAzNjAuNzM5IDE2LjMxMzdDMzYwLjU0MSAxNi4zMTM3IDM2MC4zNDMgMTYuMzEzNyAzNjAuMTQ0IDE2LjI0ODJDMzU5LjkxMyAxNi42MDkzIDM1OS41NSAxNy4wNjg4IDM1OS4xNTMgMTcuNTI4N0MzNTguNzU2IDE3Ljk1NTYgMzU4LjM2IDE4LjM4MjIgMzU4LjA2MyAxOC43NDMzQzM1Ny4yMzYgMTkuNjk1MiAzNTYuNzc0IDIwLjE1NDcgMzU1LjU4NSAyMS4yNzA5VjE5LjQ2NTVDMzU1LjU4NSAxOC40MTUxIDM1NS41ODUgMTcuNzI1NSAzNTUuNjUxIDE2LjI0ODJDMzU1LjMyMSAxNi4zMTM3IDM1NC45NTcgMTYuMzEzNyAzNTQuNzI2IDE2LjMxMzdDMzU0LjQ2MSAxNi4zMTM3IDM1NC4wMzIgMTYuMzEzNyAzNTMuNzY4IDE2LjI0ODJDMzUzLjgzMyAxNy44MjM5IDM1My44NjcgMTguMjgzNCAzNTMuODY3IDE5LjQzMjVWMjMuNjM0N0MzNTMuODY3IDI0LjY4NSAzNTMuODMzIDI1LjMwODggMzUzLjc2OCAyNi44MTlDMzU0LjE2NCAyNi43MjA2IDM1NC40OTUgMjYuNzIwNiAzNTQuNzI2IDI2LjcyMDZDMzU0Ljk1NyAyNi43MjA2IDM1NS4zNTMgMjYuNzUzNSAzNTUuNjUxIDI2LjgxOUMzNTUuNTg1IDI1LjE0NDkgMzU1LjU4NSAyNC4xNTk3IDM1NS41ODUgMjMuNjM0N1YyMS40MzUyQzM1Ni44MDcgMjIuODc5NiAzNTguNjkgMjUuMjQzMyAzNTkuNzQ4IDI2LjgxOUMzNjAuMTMgMjYuNzU2MyAzNjAuNTE3IDI2LjcyMzQgMzYwLjkwNSAyNi43MjA2QzM2MS4yMDIgMjYuNzIwNiAzNjEuNjY1IDI2LjcyMDYgMzYyLjE2IDI2LjgxOVYyNi44MTlaTTM3Mi42MDEgNDAuMDE1OEMzNzIuNTY4IDM5Ljg1MTkgMzcyLjUzNSAzOS43MjA2IDM3Mi41MzUgMzkuNTIzNEMzNzIuNTM1IDM5LjM5MjggMzcyLjU2OCAzOS4yMjgxIDM3Mi42MDEgMzkuMDk2NEMzNzEuMjggMzkuMTI5NyAzNjguOTAxIDM5LjE5NTIgMzY4LjM3MiAzOS4xOTUyVjM0LjY2NDlDMzY5LjY5NCAzNC42NjQ5IDM3MC45ODIgMzQuNjY0OSAzNzIuMjcgMzQuNzk2M0MzNzIuMjM4IDM0LjYzMjQgMzcyLjIwNCAzNC40Njc3IDM3Mi4yMDQgMzQuMzM2NEMzNzIuMjA0IDM0LjIwNTggMzcyLjIwNCAzNC4wNDE5IDM3Mi4yNyAzMy44NDQ3QzM3MS4zNDYgMzMuOTQyOCAzNjkuMTk4IDMzLjk3NiAzNjguMzcyIDMzLjk3NlYzMC4yNjZDMzY5LjgyNiAzMC4yNjYgMzcwLjY4NSAzMC4yNjYgMzcxLjE4IDMwLjI5OTNMMzcyLjUwMiAzMC4zNjUxQzM3Mi40MzYgMzAuMTY3OSAzNzIuNDM2IDMwLjA2OTIgMzcyLjQzNiAyOS45MDUzQzM3Mi40MzYgMjkuNzQxNCAzNzIuNDM2IDI5LjcwODEgMzcyLjUwMiAyOS40NDU4QzM3MS40MTEgMjkuNDc4MyAzNjkuOTI1IDI5LjU0MzggMzY5LjI2NCAyOS41NDM4QzM2OC44MDIgMjkuNTQzOCAzNjcuMzQ4IDI5LjUxMTMgMzY2LjU4NyAyOS40NDU4QzM2Ni42NTQgMzAuMjY2NCAzNjYuNjg2IDMxLjYxMjMgMzY2LjY4NiAzMi41NjQyVjM2Ljg2NTFDMzY2LjY4NiAzNy40ODg1IDM2Ni42MiAzOC43MzU3IDM2Ni41ODcgNDAuMDE2MkMzNjcuNTEzIDM5Ljk1MDMgMzY4LjgwMiAzOS45NTAzIDM2OS4yNjQgMzkuOTUwM0MzNzAuMDI0IDM5Ljk1IDM3MS42NDMgMzkuOTUgMzcyLjYwMSA0MC4wMTU4Wk0zNjQuNjA1IDM5LjEyOTRDMzY0LjQ0IDM4LjgwMDggMzY0LjM0MSAzOC4zMDg4IDM2NC4yNzUgMzguMDQ2MUMzNjIuOTIgMzkuMTYxOSAzNjEuOTk1IDM5LjM5MjQgMzYwLjkzOCAzOS4zOTI0QzM1OC41OTIgMzkuMzkyNCAzNTcuMzM3IDM3LjI5MTMgMzU3LjMzNyAzNC42NjQ5QzM1Ny4zMzcgMzEuNzQzNiAzNTguNzU3IDMwLjAzNjIgMzYxLjE2OSAzMC4wMzYyQzM2Mi40MjUgMzAuMDM2MiAzNjMuNjE0IDMwLjU5NDUgMzY0LjE3NiAzMS4xNTI4QzM2NC4yMDggMzAuODg5OCAzNjQuMzA4IDMwLjM2NDggMzY0LjQ3MyAzMC4wNjg4QzM2My4zMTYgMjkuNTExMyAzNjIuMjU5IDI5LjM0NjYgMzYxLjEwMiAyOS4zNDY2QzM1Ny4yMzcgMjkuMzQ2NiAzNTUuNDUzIDMxLjc0MzYgMzU1LjQ1MyAzNC44Mjg4QzM1NS40NTMgMzguMzA5MSAzNTcuNzk4IDQwLjE0NzEgMzYwLjczOSA0MC4xNDcxQzM2Mi40MjUgNDAuMTQ3MSAzNjMuODEyIDM5LjYyMjIgMzY0LjYwNSAzOS4xMjk0VjM5LjEyOTRaTTM0Mi4zMDMgMjYuODE5QzM0MC41MTkgMjMuNDA0OSAzMzguOCAxOS4xMzczIDMzNy41NzggMTYuMTE2OUgzMzcuMzhDMzM2LjU4NyAxOC4wMjA3IDMzNS4xMzMgMjEuMjcwOSAzMzQuNzM3IDIyLjE4OTlDMzM0LjI3NCAyMy4zMDYxIDMzMy4yNSAyNS41MDU2IDMzMi41ODkgMjYuODE4NkMzMzIuODAzIDI2Ljc1MzggMzMzLjAyNiAyNi43MjA2IDMzMy4yNSAyNi43MjAyQzMzMy40NDggMjYuNzIwMiAzMzMuNjEzIDI2Ljc1MzEgMzMzLjg0NSAyNi44MTg2QzMzNC4xNzUgMjUuOTMyMiAzMzQuNjM4IDI0LjgxNiAzMzUuMTMzIDIzLjYzNDNDMzM1Ljc5NCAyMy42MDE0IDMzNi4zODkgMjMuNTY4OCAzMzYuOTg0IDIzLjU2ODhDMzM3LjYxMiAyMy41Njg4IDMzOC4yNzIgMjMuNjAxNCAzMzguOTMzIDIzLjYzNDNMMzM5LjU5NCAyNS4yMUwzNDAuMjU1IDI2LjgxODZDMzQwLjcxNyAyNi43MjAyIDM0MS4wOCAyNi43MjAyIDM0MS4zMTIgMjYuNzIwMkMzNDEuNjA5IDI2LjcyMDYgMzQxLjg3MyAyNi43MjA2IDM0Mi4zMDMgMjYuODE5VjI2LjgxOVpNMzUzLjYzNiAyOS40NDU0QzM1My40MzggMjkuNTExMyAzNTMuMjczIDI5LjU0MzUgMzUzLjEwNyAyOS41NDM1QzM1Mi45MDkgMjkuNTQzNSAzNTIuNzQ0IDI5LjUxMDkgMzUyLjU0NiAyOS40NDU0QzM1Mi42NDQgMzAuNzU4NCAzNTIuNjc4IDMyLjA3MTQgMzUyLjY3OCAzMy4zNTE5VjM2LjczMzRDMzUyLjE0OSAzNi4yNzM2IDM1MC44NiAzNS4wOTE5IDM0OS4zNzQgMzMuNzEzQzM0Ny44NiAzMi4zMDc0IDM0Ni4zOTQgMzAuODUxMSAzNDQuOTc5IDI5LjM0NjZIMzQ0Ljc0OEMzNDQuNzgxIDMwLjgyNDMgMzQ0LjgxNCAzMi40IDM0NC44MTQgMzMuODExNFYzNS44Nzk5QzM0NC44MTQgMzcuNjUyOCAzNDQuODE0IDM4LjYwNDcgMzQ0LjcxNSA0MC4wMTYyQzM0NC45OCAzOS45NTAzIDM0NS4xMTIgMzkuOTUwMyAzNDUuMzEgMzkuOTUwM0MzNDUuNDQyIDM5Ljk1MDMgMzQ1LjU3NSAzOS45NTAzIDM0NS44MDYgNDAuMDE2MkMzNDUuNzQgMzguNjcwNiAzNDUuNzA3IDM2LjQ3MDggMzQ1LjcwNyAzNS44Nzk5VjMyLjU5NjhDMzQ4LjE4NSAzNC44NjI1IDM1MS4yMjQgMzcuODgyNiAzNTMuNDcxIDQwLjE0NzVIMzUzLjYwM0MzNTMuNjAzIDM4LjkzMjkgMzUzLjUzNyAzNy43MTc5IDM1My41MzcgMzYuNTA0VjM0LjYzMjdDMzUzLjUzNiAzMi40MzI1IDM1My41MzYgMzEuMzQ5MyAzNTMuNjM2IDI5LjQ0NTRaTTM0Mi41NjcgNDAuMDE1OEMzNDIuNTM0IDM5Ljg1MTkgMzQyLjUwMSAzOS43MjA2IDM0Mi41MDEgMzkuNTIzNEMzNDIuNTAxIDM5LjM5MjggMzQyLjUzNCAzOS4yMjgxIDM0Mi41NjcgMzkuMDk2NEMzNDEuMjQ2IDM5LjEyOTcgMzM4Ljg2NyAzOS4xOTUyIDMzOC4zNzEgMzkuMTk1MlYzNC42NjQ5QzMzOS42NiAzNC42NjQ5IDM0MC45NDggMzQuNjY0OSAzNDIuMjM3IDM0Ljc5NjNDMzQyLjIwNCAzNC42MzI0IDM0Mi4xNzEgMzQuNDY3NyAzNDIuMTcxIDM0LjMzNjRDMzQyLjE3MSAzNC4yMDU4IDM0Mi4xNzEgMzQuMDQxOSAzNDIuMjM3IDMzLjg0NDdDMzQxLjMxMiAzMy45NDI4IDMzOS4xOTcgMzMuOTc2IDMzOC4zNzEgMzMuOTc2VjMwLjI2NkMzMzkuNzkyIDMwLjI2NiAzNDAuNjUxIDMwLjI2NiAzNDEuMTc5IDMwLjI5OTNMMzQyLjQ2OCAzMC4zNjUxQzM0Mi40MzUgMzAuMTY3OSAzNDIuNDM1IDMwLjA2OTIgMzQyLjQzNSAyOS45MDUzQzM0Mi40MzUgMjkuNzQxNCAzNDIuNDM1IDI5LjY3NTUgMzQyLjQ2OCAyOS40NDU4QzM0MS4zNzggMjkuNDc4MyAzMzkuODkxIDI5LjU0MzggMzM5LjIzIDI5LjU0MzhDMzM4Ljc2NyAyOS41NDM4IDMzNy4zMTQgMjkuNTExMyAzMzYuNTU0IDI5LjQ0NThDMzM2LjYyIDMwLjI2NjQgMzM2LjY1MyAzMS42MTIzIDMzNi42NTMgMzIuNTY0MlYzNi44NjUxQzMzNi42NTMgMzcuNDg4NSAzMzYuNTg3IDM4LjczNTcgMzM2LjU1NCA0MC4wMTYyQzMzNy41MTIgMzkuOTUwMyAzMzguNzY3IDM5Ljk1MDMgMzM5LjIzIDM5Ljk1MDNDMzM5Ljk5IDM5Ljk1IDM0MS42NDIgMzkuOTUgMzQyLjU2NyA0MC4wMTU4VjQwLjAxNThaTTMzMS4yMDEgMjYuODE5QzMzMC42NzMgMjMuMjQwNiAzMzAuMjEgMTkuNDk4NCAzMjkuODQ3IDE2LjExNjlDMzI5Ljc0OCAxNi4xNDk4IDMyOS43MTQgMTYuMTQ5OCAzMjkuNjQ5IDE2LjExNjlDMzI4Ljk1NSAxNy4zMzE1IDMyOC4xNjIgMTguNjQ0NSAzMjcuNTY3IDE5LjU2MzlDMzI3LjAwNiAyMC40NTAzIDMyNi4zNDUgMjEuNTAwNyAzMjUuNTg1IDIyLjYxNjlDMzIzLjk5OSAyMC41ODE3IDMyMi4zNDcgMTguMDIxMSAzMjEuMjU2IDE2LjExNjlDMzIxLjE5IDE2LjE0OTggMzIxLjE1NyAxNi4xMTY5IDMyMS4wOTEgMTYuMTE2OUMzMjAuNzI4IDE5LjQ5OCAzMjAuMjMyIDIzLjI3MzIgMzE5LjczNiAyNi44MTlDMzIwLjAwMSAyNi43MjA2IDMyMC4xNjYgMjYuNzIwNiAzMjAuMjk4IDI2LjcyMDZDMzIwLjQ5NiAyNi43MjA2IDMyMC42MjggMjYuNzUzNSAzMjAuODU5IDI2LjgxOUMzMjAuOTkyIDI0LjQ1NTMgMzIxLjI1NiAyMi4xMjQ0IDMyMS41NTMgMTkuNjYyM0MzMjIuODQyIDIxLjUzMzYgMzIzLjk2NSAyMy4xNDIyIDMyNS4yMjEgMjQuODQ5M0MzMjYuMjc4IDIzLjIwNzcgMzI3LjM2OCAyMS40MzQ4IDMyOC41NTggMTkuNjI5NEMzMjguODg4IDIyLjE1NyAzMjkuMTg2IDI0LjQ1NTMgMzI5LjM1MSAyNi44MTlDMzI5Ljc4IDI2LjcyMDYgMzMwLjA3OCAyNi43MjA2IDMzMC4yNzYgMjYuNzIwNkMzMzAuNTQgMjYuNzIwNiAzMzAuODA1IDI2LjcyMDYgMzMxLjIwMSAyNi44MTlWMjYuODE5Wk0zMzQuOTY4IDMyLjIwMjhDMzM0Ljk2OCAzMC4yOTg5IDMzMy40NDggMjkuNDQ1NCAzMzEuNTk4IDI5LjQ0NTRDMzMwLjc3MiAyOS40NDU0IDMyOS44OCAyOS41NDM1IDMyOS4yNTIgMjkuNTQzNUMzMjkuMDIxIDI5LjU0MzUgMzI4LjUyNSAyOS41NDM1IDMyNy45OTcgMjkuNDc3NkMzMjguMDMgMzAuNTI4MyAzMjguMDk2IDMxLjQxNDggMzI4LjA5NiAzMi40MzIyVjM2LjkyOTVDMzI4LjA5NiAzNy45MTQ4IDMyOC4wMyAzOC45OTggMzI3Ljk5NyA0MC4wMTU0QzMyOC40MjYgMzkuOTQ5NiAzMjguNzI0IDM5Ljk0OTYgMzI4LjkyMiAzOS45NDk2QzMyOS4xNTMgMzkuOTQ5NiAzMjkuNDg0IDM5Ljk0OTYgMzI5Ljg4IDQwLjAxNTRDMzI5LjgxNSAzOS4wMzE5IDMyOS43ODIgMzguMDQ2NSAzMjkuNzgxIDM3LjA2MDlWMzUuNDJDMzMwLjE0NSAzNS40NTI2IDMzMC41MDggMzUuNDUyNiAzMzAuOTA1IDM1LjQ1MjZDMzMyLjgyIDM1LjQ1MjYgMzM0Ljk2OCAzNC43MzA0IDMzNC45NjggMzIuMjAyOFYzMi4yMDI4Wk0zMjYuMDE0IDM2Ljg5NzNDMzI2LjAxNCAzNS4yNTU4IDMyNC45MjQgMzQuNTMzNiAzMjMuMDQgMzMuNzQ1NkMzMjEuNjg2IDMzLjE4OCAzMjAuOTkyIDMyLjY5NTYgMzIwLjk5MiAzMS42NDQ1QzMyMC45OTIgMzAuNjYgMzIxLjc1MiAzMC4wMzYyIDMyMy4wMDggMzAuMDM2MkMzMjMuODM0IDMwLjAzNjIgMzI0LjU2MSAzMC4zMzE1IDMyNS4yMjIgMzAuODU2OEMzMjUuMjg3IDMwLjQ5NTcgMzI1LjQ1MyAzMC4xMzQ3IDMyNS42NTEgMjkuODM5NEMzMjQuODU4IDI5LjQ3ODMgMzIzLjk5OSAyOS4zNDcgMzIzLjA3NCAyOS4zNDdDMzIwLjM2NSAyOS4zNDcgMzE5LjUwNSAzMC44OTA1IDMxOS41MDUgMzIuMjAzNUMzMTkuNTA1IDMzLjgxMTggMzIwLjI5OSAzNC41NjcyIDMyMi4zNDcgMzUuMzU1M0MzMjMuNjM2IDM1Ljg0NyAzMjQuMjk2IDM2LjQ3MTEgMzI0LjI5NiAzNy41NTQ0QzMyNC4yOTYgMzguNzAzNSAzMjMuNDM3IDM5LjQyNTcgMzIyLjI0OCAzOS40MjU3QzMyMS41NTQgMzkuNDI1NyAzMjAuMzY1IDM5LjA2NDYgMzE5LjUzOSAzOC4zMDk5QzMxOS41MDUgMzguNzM2MSAzMTkuNTA1IDM5LjEzMDQgMzE5LjM3MyAzOS40OTE1QzMxOS45MDIgMzkuNzU0NiAzMjEuMTI1IDQwLjE0NzkgMzIyLjIxNSA0MC4xNDc5QzMyNC45OSA0MC4xNDcxIDMyNi4wMTQgMzguNDM5NyAzMjYuMDE0IDM2Ljg5NzNWMzYuODk3M1pNMzc4LjE1MiAxNy45ODgyQzM3OC4xNTIgMTguOTczIDM3Ny40NTggMTkuNjYyMyAzNzYuNzY0IDIwLjIyMDJDMzc2LjMwMSAxOS41NjM5IDM3NS43NCAxOC42NzcxIDM3NS43NCAxNy45ODgyQzM3NS43NCAxNy4yMzMxIDM3Ni4yNjggMTYuODA2MSAzNzYuOTk1IDE2LjgwNjFDMzc3Ljk4NyAxNi44MDY1IDM3OC4xNTIgMTcuNjkyNiAzNzguMTUyIDE3Ljk4ODJWMTcuOTg4MlpNMzc4LjQ4MiAyNS4wMTMyQzM3OC4xMTkgMjUuMzQxNyAzNzcuMjYgMjUuOTY1NSAzNzYuNTMzIDI1Ljk2NTVDMzc1LjU3NCAyNS45NjU1IDM3NC40MTggMjUuMjc1OSAzNzQuNDE4IDIzLjc5ODZDMzc0LjQxOCAyMi40ODU1IDM3NS4yNzcgMjEuODk0NyAzNzUuODA2IDIxLjU2NjVDMzc3LjAyOCAyMy4yNDA2IDM3Ny4wOTUgMjMuMzM5MSAzNzguNDgyIDI1LjAxMzJaTTM3OS44MDQgMzIuMjAyOEMzNzkuODA0IDMzLjI1MzUgMzc5LjI3NSAzNC40MDI2IDM3Ny43NTUgMzQuNDAyNkMzNzcuMzI2IDM0LjQwMjYgMzc2LjkyOSAzNC40MDI2IDM3Ni41MzMgMzQuMzY5M1YzMC4yNjU2QzM3Ni45MjkgMzAuMTY3NiAzNzcuNDI1IDMwLjEzNDMgMzc3LjcyMiAzMC4xMzQzQzM3OS4wMTEgMzAuMTM0MyAzNzkuODA0IDMwLjg4OTggMzc5LjgwNCAzMi4yMDI4Wk0zMzguNjAyIDIyLjgxNDFDMzM3LjkwOSAyMi44NDY2IDMzNy41NDUgMjIuODQ2NiAzMzcuMDgyIDIyLjg0NjZDMzM2LjUyMSAyMi44NDY2IDMzNi4xOSAyMi44NDY2IDMzNS40NjMgMjIuODE0MUwzMzcuMDgyIDE5LjAwNkwzMzguNjAyIDIyLjgxNDFaTTMzMy4xNTEgMzIuMzAwOEMzMzMuMTUxIDMzLjgxMTEgMzMyLjI1OCAzNC43OTU5IDMzMC44MDUgMzQuNzk1OUMzMzAuNTA3IDM0Ljc5NTkgMzMwLjE3NyAzNC43OTU5IDMyOS43OCAzNC43MzAxVjMwLjIzMjdDMzMwLjI0MyAzMC4xNjY5IDMzMC42MzkgMzAuMTMzOSAzMzEuMDM2IDMwLjEzMzlDMzMyLjQyNCAzMC4xMzQzIDMzMy4xNTEgMzEuMDIxMSAzMzMuMTUxIDMyLjMwMDhaTTM2OS41MjggMjMuNjY3NkMzNjkuNTI4IDIyLjAyNiAzNjguNDM4IDIxLjMwMzkgMzY2LjU1NSAyMC41MTYyQzM2NS4yIDE5Ljk1ODMgMzY0LjUwNiAxOS40OTg4IDM2NC41MDYgMTguNDE1MUMzNjQuNTA2IDE3LjQ2MzIgMzY1LjI2NiAxNi44MDY1IDM2Ni41MjEgMTYuODA2NUMzNjcuMzQ4IDE2LjgwNjUgMzY4LjA3NSAxNy4xMDE3IDM2OC43MzUgMTcuNjI3NUMzNjguODAyIDE3LjI2NjQgMzY4Ljk2NyAxNi45MDQ5IDM2OS4xMzEgMTYuNjQyMkMzNjguMzcyIDE2LjI4MTEgMzY3LjQ3OSAxNi4xMTcyIDM2Ni41ODcgMTYuMTE3MkMzNjMuOTQ0IDE2LjExNzIgMzYyLjk4NiAxNy42NiAzNjIuOTg2IDE5LjAwNkMzNjIuOTg2IDIwLjU4MTcgMzYzLjgxMiAyMS4zMzY4IDM2NS44NjEgMjIuMTI0NEMzNjcuMTQ5IDIyLjYxNjkgMzY3LjgxIDIzLjI0MDYgMzY3LjgxIDI0LjM1NjhDMzY3LjgxIDI1LjQ3MyAzNjYuOTUxIDI2LjE5NTIgMzY1Ljc2MiAyNi4xOTUyQzM2NS4wMzUgMjYuMTk1MiAzNjMuODc5IDI1LjgzNDEgMzYzLjA1MiAyNS4xMTE5QzM2My4wMiAyNS41Mzg5IDM2Mi45ODYgMjUuOSAzNjIuODg3IDI2LjI2MTFDMzYzLjM4MyAyNi41MjM4IDM2NC42MDYgMjYuOTE3NCAzNjUuNzI5IDI2LjkxNzRDMzY4LjUwNCAyNi45MTc0IDM2OS41MjggMjUuMjQzMyAzNjkuNTI4IDIzLjY2NzZWMjMuNjY3NloiIGZpbGw9IiMwMzY1NTUiLz4NCjxwYXRoIGQ9Ik02NDAuNDE2IDIwLjU1NzNDNjM4LjY3MSAxOS44MzU0IDYzNy42MzEgMTkuNTU1MSA2MzYuNTk4IDE5LjU1NTFDNjM1LjUxNCAxOS41NTUxIDYzNC44MTkgMTkuOTE3IDYzNC44MTkgMjAuNDc2NUM2MzQuODE5IDIyLjE2NDUgNjQwLjk2MiAyMS42ODkzIDY0MC45NjIgMjUuNTkzNkM2NDAuOTYyIDI3Ljc0NjQgNjM5LjAyNCAyOC45OTc0IDYzNi4zMzIgMjguOTk3NEM2MzQuMjIgMjguOTk3NCA2MzMuMTggMjguNDg4IDYzMS45ODMgMjcuOTExNlYyNS40OTYyQzYzMy43MSAyNi41NjM1IDYzNC43NjggMjYuOTQwMSA2MzYuMTAxIDI2Ljk0MDFDNjM3LjI1NiAyNi45NDAxIDYzNy44NzkgMjYuNTYzNSA2MzcuODc5IDI1LjkwNjNDNjM3Ljg3OSAyNC4wNjg1IDYzMS43MzcgMjQuNzQxNSA2MzEuNzM3IDIwLjcyMTNDNjMxLjczNyAxOC43ODI3IDYzMy41MzQgMTcuNDk5IDYzNi4zMzIgMTcuNDk5QzYzNy42ODIgMTcuNDk5IDYzOC45MDEgMTcuNzYzNSA2NDAuNDE2IDE4LjM3MDdWMjAuNTU3M1pNNjQ5LjAxNiAyOC40ODQxQzY0Ny45OTIgMjguODMwNiA2NDcuMTI2IDI4Ljk5NTQgNjQ2LjI2MiAyOC45OTU0QzY0My40MDIgMjguOTk1NCA2NDEuNTUyIDI3LjQ0MjIgNjQxLjU1MiAyNS4wNzkyQzY0MS41NTIgMjIuNzU5NCA2NDMuNDczIDIxLjEyMDIgNjQ2LjE1NiAyMS4xMjAyQzY0Ni45ODUgMjEuMTIwMiA2NDguMDQ0IDIxLjMxODIgNjQ4Ljg5MSAyMS42MTIzVjIzLjM4ODFDNjQ4LjIyMSAyMy4wNTYyIDY0Ny40NDQgMjIuODc0MSA2NDYuODA5IDIyLjg3NDFDNjQ1LjI3MyAyMi44NzQxIDY0NC4yODYgMjMuNzM0MyA2NDQuMjg2IDI1LjA2MTlDNjQ0LjI4NiAyNi40MDggNjQ1LjI1NiAyNy4yOTQgNjQ2LjcyIDI3LjI5NEM2NDcuMzM3IDI3LjI5NCA2NDcuODg2IDI3LjE2MjMgNjQ5LjAxNiAyNi43NjhMNjQ5LjAxNiAyOC40ODQxWk02NzEuMzIgMjQuMjA5QzY3MS40MjUgMjMuMTU0OCA2NzIuMDgxIDIyLjU0NTcgNjczLjA4NyAyMi41NDU3QzY3NC4wNzYgMjIuNTQ1NyA2NzQuNzQ2IDIzLjE3MjEgNjc0Ljg1MiAyNC4yMDlINjcxLjMyWk02NzIuOTEgMjEuMTIyOUM2NzAuNCAyMS4xMjI5IDY2OC42MTQgMjIuNzc1NSA2NjguNjE0IDI1LjEwMTJDNjY4LjYxNCAyNy40NDQxIDY3MC40NzEgMjguOTk1NCA2NzMuMzM1IDI4Ljk5NTRDNjczLjk3IDI4Ljk5NTQgNjc1LjUwNCAyOC45OTU0IDY3Ni45NjYgMjcuOTg3VjI2LjUwNDJDNjc1Ljc2OSAyNy4yOTkzIDY3NC45NzcgMjcuNTczMSA2NzMuOTU1IDI3LjU3MzFDNjcyLjM0MSAyNy41NzMxIDY3MS4zNTQgMjYuNzk0OSA2NzEuMjY1IDI1LjQ2NjZINjc3LjExQzY3Ny4yMzIgMjIuNjkzOSA2NzUuMjc5IDIxLjEyMjkgNjcyLjkxIDIxLjEyMjlWMjEuMTIyOVpNNjc4LjA5OSAyOC44NTcySDY4MC42NTRWMjEuMjYyN0g2NzguMDk5VjI4Ljg1NzJaTTY4Ny43NjcgMjYuNzgxNUM2ODcuMjM0IDI3LjIyODEgNjg2Ljc5MiAyNy40MDcyIDY4Ni4yNDYgMjcuNDA3MkM2ODUuMDQzIDI3LjQwNzIgNjg0LjI4MSAyNi40ODM4IDY4NC4yODEgMjUuMTAwNEM2ODQuMjgxIDIzLjU4NDEgNjg1LjA0MyAyMi43MTAxIDY4Ni4zMzEgMjIuNzEwMUM2ODYuNzkyIDIyLjcxMDEgNjg3LjM5NCAyMi45MDggNjg3Ljc2NyAyMy4xNTU5VjI2Ljc4MTVaTTY4Ny43NjcgMTcuNjM5MVYyMS41OTU4QzY4Ny4wNzYgMjEuMjg0NyA2ODYuMzg4IDIxLjEyMDIgNjg1LjY0NCAyMS4xMjAyQzY4My4zMTMgMjEuMTIwMiA2ODEuNyAyMi43MjY2IDY4MS43IDI1LjA1MDdDNjgxLjcgMjcuMzI0OCA2ODMuMzEzIDI4Ljk5NzQgNjg1LjUgMjguOTk3NEM2ODYuMzY3IDI4Ljk5NzQgNjg3LjAzNyAyOC43ODU2IDY4Ny43NjcgMjguMjQzNVYyOC44NTQ5SDY5MC4zMjJWMTcuNjM5MUg2ODcuNzY3Wk02OTQuMTA1IDI0LjIwOUM2OTQuMjExIDIzLjE1NDggNjk0Ljg2NCAyMi41NDU3IDY5NS44NjggMjIuNTQ1N0M2OTYuODU4IDIyLjU0NTcgNjk3LjUzNSAyMy4xNzIxIDY5Ny42NDEgMjQuMjA5SDY5NC4xMDVaTTY5NS42OTQgMjEuMTIyOUM2OTMuMTg0IDIxLjEyMjkgNjkxLjQgMjIuNzc1NSA2OTEuNCAyNS4xMDEyQzY5MS40IDI3LjQ0NDEgNjkzLjI1OSAyOC45OTU0IDY5Ni4xMTkgMjguOTk1NEM2OTYuNzUzIDI4Ljk5NTQgNjk4LjI5IDI4Ljk5NTQgNjk5Ljc1NSAyNy45ODdWMjYuNTA0MkM2OTguNTU3IDI3LjI5OTMgNjk3Ljc2MyAyNy41NzMxIDY5Ni43MzYgMjcuNTczMUM2OTUuMTMxIDI3LjU3MzEgNjk0LjE0IDI2Ljc5NDkgNjk0LjA1MSAyNS40NjY2SDY5OS44OTRDNzAwLjAxNSAyMi42OTM5IDY5OC4wNjEgMjEuMTIyOSA2OTUuNjk0IDIxLjEyMjkiIGZpbGw9IiMwMDlFNEQiLz4NCjxwYXRoIGQ9Ik03MDMuNzIxIDIzLjQzNjhINzAzLjc1OEM3MDQuNTE3IDIxLjg1NjIgNzA1LjM2NiAyMS4xMTUgNzA2LjM1MiAyMS4xMTVDNzA2Ljg2MiAyMS4xMTUgNzA3LjMwMyAyMS4yOTY0IDcwOC4wNDQgMjEuODA3Nkw3MDcuMzQxIDIzLjkxMzNDNzA2LjY3IDIzLjUxODYgNzA2LjIyOSAyMy4zNTM1IDcwNS44MjMgMjMuMzUzNUM3MDQuODg2IDIzLjM1MzUgNzA0LjI4NiAyNC4xNzc1IDcwMy43MjEgMjUuNTcwNFYyOC44NDY2SDcwMS4xNjJWMjEuMjU0MUg3MDMuNzIxVjIzLjQzNjhaTTY4MC43NzUgMTguMDY3NEM2ODEuMDE1IDE4LjY1NzUgNjgwLjU4MyAxOS40ODA1IDY3OS44MTQgMTkuOTA0QzY3OS4wNDEgMjAuMzI3MSA2NzguMjI0IDIwLjE5MjggNjc3Ljk4NiAxOS42MDI3QzY3Ny43NDMgMTkuMDExNyA2NzguMTczIDE4LjE4NzcgNjc4Ljk0NSAxNy43NjY2QzY3OS43MTYgMTcuMzQxMSA2ODAuNTMzIDE3LjQ3NTkgNjgwLjc3NSAxOC4wNjc0WiIgZmlsbD0iIzAwOUU0RCIvPg0KPHBhdGggZD0iTTY1OC4yMiAyNC4wMjMxQzY1OC4yMiAyMS45NjUxIDY1Ni43MTkgMjEuMTIyNiA2NTUuMjM5IDIxLjEyMjZDNjU0LjIzMiAyMS4xMjI2IDY1My40MDQgMjEuNTE4NCA2NTIuNjY0IDIyLjM5MjFINjUyLjYyOVYxNy42MzkySDY1MC4wNzFWMjguODM1M0g2NTIuNjI5VjI0LjAyMzFDNjUzLjIyOCAyMy4yMTYxIDY1My43MzggMjIuODcxMSA2NTQuMzM4IDIyLjg3MTFDNjU1LjEzNCAyMi44NzExIDY1NS42NjIgMjMuMzk4NiA2NTUuNjYyIDI0LjUzMjlWMjcuMjAwOEM2NTYuNTIgMjYuNzg5NiA2NTcuMzkzIDI2LjUzNzQgNjU4LjIyIDI2LjQ0MzhWMjQuMDIzMVpNNjY0LjYzNiAyMS4xMTk5QzY2My41OTQgMjEuMTE5OSA2NjIuNzk5IDIxLjQ4MTEgNjYxLjk4NCAyMi4zNDkzVjIxLjI2MjRINjU5LjQyOFYyNi40MjM0QzY2MC4zMTMgMjYuNTA1OCA2NjEuNDQzIDI2Ljg4NDcgNjYxLjk4NCAyNy41MTA0VjIzLjk2MzRDNjYyLjY1NyAyMy4wMjMyIDY2My4xMzQgMjIuNzA5NyA2NjMuNzcgMjIuNzA5N0M2NjQuNDk0IDIyLjcwOTcgNjY1LjA0NSAyMy4xNTU2IDY2NS4wNDUgMjQuMjI2NFYyOC44MzcySDY2Ny42MDJWMjQuMDI4OUM2NjcuNjAyIDIxLjc5MjYgNjY1LjkwOCAyMS4xMTk5IDY2NC42MzYgMjEuMTE5OVYyMS4xMTk5Wk02NjkuMDE1IDMxLjAxODFINjY2LjA0M1YzMi45ODY0SDY2OC45MDlWMzMuODMxMkg2NjYuMDQzVjM1Ljg2MTlINjY5LjEwM1YzNi43MDU1SDY2NS4wNDZWMzAuMTc1Mkg2NjkuMDE1TDY2OS4wMTUgMzEuMDE4MVpNNjcxLjQ0MiAzNi43MDkzSDY3Mi4zNTJWMzAuMTczM0g2NzEuNDQyVjM2LjcwOTNaTTY3Ni44NTkgMzMuMDQ4NEM2NzcuNTA0IDMzLjA0ODQgNjc3LjkwNCAzMy40NjMxIDY3Ny45MzUgMzQuMTE0Mkg2NzUuNjE2QzY3NS43NDIgMzMuNDM0MiA2NzYuMTYxIDMzLjA0ODQgNjc2Ljg1OSAzMy4wNDg0Wk02NzUuNiAzNC42ODFINjc4Ljg0MkM2NzguODQyIDMzLjA4NjkgNjc4LjA2MiAzMi4zMTggNjc2LjgzOCAzMi4zMThDNjc1LjU2OSAzMi4zMTggNjc0LjY4OCAzMy4xOTI0IDY3NC42ODggMzQuNDk2OUM2NzQuNjg4IDM1LjY4OSA2NzUuNDg0IDM2Ljc4OTggNjc2LjkxNyAzNi43ODk4QzY3Ny42OTggMzYuNzg5OCA2NzguMjAzIDM2LjYyODEgNjc4Ljc2MyAzNi4yODJWMzUuNDU2QzY3OC4yMjIgMzUuNzg1NiA2NzcuNjk4IDM1Ljk3NTggNjc3LjE0NyAzNS45NzU4QzY3Ni4yNjUgMzUuOTc1OCA2NzUuNzQyIDM1LjUzNSA2NzUuNiAzNC42ODA2VjM0LjY4MVpNNjg0Ljc4NiAzMy41MzA5QzY4NC4yNjMgMzMuMTk2NiA2ODMuOTE0IDMzLjA5ODUgNjgzLjUxNSAzMy4wOTg1QzY4Mi42ODIgMzMuMDk4NSA2ODIuMTA1IDMzLjY5NDUgNjgyLjEwNSAzNC41NjdDNjgyLjEwNSAzNS40NTYgNjgyLjcxOSAzNS45OTE2IDY4My42NjggMzUuOTkxNkM2ODQuMDU4IDM1Ljk5MTYgNjg0LjQzIDM1Ljg5NzMgNjg0Ljg4OCAzNS43MDU5VjM2LjU0MjZDNjg0LjU4MiAzNi42Nzc0IDY4My45OTcgMzYuNzg5OCA2ODMuNTE1IDM2Ljc4OThDNjgyLjEzNiAzNi43ODk4IDY4MS4xOCAzNS45MDYyIDY4MS4xOCAzNC42NDMyQzY4MS4xOCAzMy4yMTc4IDY4Mi4wNTQgMzIuMzE4IDY4My40NTMgMzIuMzE4QzY4My45ODcgMzIuMzE4IDY4NC4zNDYgMzIuNDMzOSA2ODQuNzg3IDMyLjYxNDVMNjg0Ljc4NiAzMy41MzA5Wk02ODguOTM0IDMyLjQwMDRINjkwLjM5NVYzMy4xNjUxSDY4OC45MzRWMzUuMzc1MkM2ODguOTM0IDM1Ljg4MTEgNjg5LjMyNyAzNi4wMjc0IDY4OS41OTMgMzYuMDI3NEM2ODkuOTIyIDM2LjAyNzQgNjkwLjI2MiAzNS45MiA2OTAuNjMgMzUuNzA3OVYzNi41MDM3QzY5MC4zMSAzNi42Njc4IDY4OS44MiAzNi43ODk4IDY4OS41MTkgMzYuNzg5OEM2ODguNTI4IDM2Ljc4OTggNjg4LjAyNyAzNi4yMTYxIDY4OC4wMjcgMzUuNDM5MVYzMy4xNjUxSDY4Ny4yMjRWMzMuMDcwM0w2ODguOTM0IDMxLjUxMDJWMzIuNDAwNFpNNjkzLjg3NiAzMi40MDA0VjMzLjM5NjlINjkzLjg5NUM2OTQuMzU5IDMyLjYzNDUgNjk0LjggMzIuMzE4IDY5NS4yMyAzMi4zMThDNjk1LjYwMSAzMi4zMTggNjk1Ljk0NyAzMi40ODAxIDY5Ni4zMjkgMzIuODE2Nkw2OTUuODQ3IDMzLjU2NDRDNjk1LjU3IDMzLjMwOTEgNjk1LjIxMSAzMy4xMzMxIDY5NC45OTUgMzMuMTMzMUM2OTQuMzY4IDMzLjEzMzEgNjkzLjg3NiAzMy43MjY4IDY5My44NzYgMzQuNDYyNlYzNi43MDkzSDY5Mi45NjdWMzIuNDAwNEg2OTMuODc2Wk03MDUuNjU3IDMzLjUzMDlDNzA1LjEzMSAzMy4xOTY2IDcwNC43ODIgMzMuMDk4NSA3MDQuMzgxIDMzLjA5ODVDNzAzLjU0OSAzMy4wOTg1IDcwMi45NzcgMzMuNjk0NSA3MDIuOTc3IDM0LjU2N0M3MDIuOTc3IDM1LjQ1NiA3MDMuNTkyIDM1Ljk5MTYgNzA0LjUzNSAzNS45OTE2QzcwNC45MjUgMzUuOTkxNiA3MDUuMjk1IDM1Ljg5NzMgNzA1Ljc2IDM1LjcwNTlWMzYuNTQyNkM3MDUuNDQ3IDM2LjY3NzQgNzA0Ljg2MiAzNi43ODk4IDcwNC4zOCAzNi43ODk4QzcwMy4wMDQgMzYuNzg5OCA3MDIuMDQ0IDM1LjkwNjIgNzAyLjA0NCAzNC42NDMyQzcwMi4wNDQgMzMuMjE3OCA3MDIuOTIyIDMyLjMxOCA3MDQuMzIgMzIuMzE4QzcwNC44NTUgMzIuMzE4IDcwNS4yMTIgMzIuNDMzOSA3MDUuNjU3IDMyLjYxNDVMNzA1LjY1NyAzMy41MzA5Wk02OTguNzQyIDM2LjcwOTNINjk5LjY1MlYzMi40MDA4SDY5OC43NDJWMzYuNzA5M1oiIGZpbGw9IiMwMDlFNEQiLz4NCjxwYXRoIGQ9Ik02OTkuNjg0IDMwLjg1MjVDNjk5Ljc3MyAzMS4wNjA0IDY5OS42MTggMzEuMzU0NCA2OTkuMzQ0IDMxLjUwNDFDNjk5LjA2OCAzMS42NTQzIDY5OC43NzYgMzEuNjA2MiA2OTguNjkzIDMxLjM5NzhDNjk4LjYxIDMxLjE4NzQgNjk4Ljc2MSAzMC44OTU4IDY5OS4wMzggMzAuNzQ1NkM2OTkuMzExIDMwLjU5MzUgNjk5LjYwMSAzMC42NDIxIDY5OS42ODQgMzAuODUyNVYzMC44NTI1Wk02NTguOTQgMzEuMjAwOUM2NTguNzc5IDMxLjIwMDkgNjU4LjcxMSAzMS4yMjU1IDY1OC42NDYgMzEuMjkzOEM2NTguNjIgMzEuMzIwMyA2NTguNjEgMzEuMzQ3MiA2NTguNiAzMS40MDExTDY1Ny43ODQgMzQuMjg3QzY1Ny41OTMgMzUuMjk5MiA2NTYuMjU5IDM2LjMwOTkgNjU0LjUyMSAzNi4zMDk5SDY1Mi4xMDRMNjUyLjUyMyAzNC44MjdINjU0LjA3NkM2NTQuMjM0IDM0LjgyNyA2NTQuMzU4IDM0Ljc3MjEgNjU0LjQ2MiAzNC42NjQzQzY1NC41IDM0LjYyMjUgNjU0LjU1IDM0LjU1NyA2NTQuNTU2IDM0LjQ4OTZMNjU1LjIwMSAzMS45NjgxQzY1NS4zOTEgMzAuOTU1NSA2NTYuNTM4IDI5LjgzNjkgNjU4LjI3NiAyOS44MzY5SDY2MC43NTFMNjYwLjQzNSAzMS4yMDA5SDY1OC45NFpNNjU5LjQ5NyAzMi45NTk2TDY1OS43NzMgMzIuMDI1OUg2NjIuMjg4QzY2Mi41OTggMzAuNjcyIDY2Mi4zNTQgMjkuNDE3NyA2NjEuNDczIDI4LjU5NjFDNjU5LjY4OSAyNi45MzMyIDY1NS45NTcgMjcuNDk4MyA2NTMuMTc3IDI5Ljk3NzlDNjUyLjc0MyAzMC4zNjMgNjUyLjM3NiAzMC43NzkzIDY1Mi4wNDIgMzEuMjA0OEg2NTMuNTU2TDY1My4yMDQgMzIuMTQwNEg2NTEuMzk1QzY1MS4yMjIgMzIuNDM1NCA2NTEuMDYgMzIuNzI4MSA2NTAuOTM2IDMzLjAyNUg2NTMuMDgxTDY1Mi43MzcgMzMuOTYwN0g2NTAuNjNDNjUwLjI2OSAzNS4zOTAxIDY1MC40OTkgMzYuNzIzMyA2NTEuNDA2IDM3LjU2OTlDNjUzLjE2NyAzOS4yMTE2IDY1Ni44ODggMzguNjM0NiA2NTkuNjY3IDM2LjE1NTRDNjYwLjE1MyAzNS43MjQyIDY2MC41NTUgMzUuMjU4NyA2NjAuOTE4IDM0Ljc4MDhINjU4Ljk3M0w2NTkuMjY5IDMzLjg0NzFINjYxLjU0M0M2NjEuNzEgMzMuNTUwMSA2NjEuODYzIDMzLjI1NjUgNjYxLjk4MyAzMi45NTk2SDY1OS40OTdaIiBmaWxsPSIjMDA5RTREIi8+DQo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfNThfMTExKSI+DQo8cGF0aCBkPSJNNzc1LjA2OCA0MS4yMjc0Qzc2Ni4yODUgNDIuMDQ2MyA3NTcuMTMxIDQwLjc1NjQgNzU1Ljg0OCAzMy44MTlDNzU1LjIyMSAzMC4zOTkgNzU2Ljc2NSAyNi43NzI1IDc1OC44MSAyNC41MTg0VjIzLjMxNDhDNzU1LjEyNiAyNi41OCA3NTMuMTMgMzAuNzExNSA3NTQuMjggMzUuNTkyQzc1NS43NDggNDEuODUxOCA3NjMuNjAzIDQ1LjM5NjcgNzc1LjU5NSA0NC4yMTk1Qzc4MC4zNDIgNDMuNzU0NSA3ODYuNTUgNDIuMjEyIDc5MC44NjkgMzkuODE0NFYzNi40MTA5Qzc4Ni45NDkgMzguNzcxMyA3ODAuNDY4IDQwLjcyMTEgNzc1LjA2OCA0MS4yMjc0VjQxLjIyNzRaTTc5OC4yMDUgMjMuMjMzNUM3OTYuMTIyIDEyLjk1MzMgNzc2LjM3MyAxMi4zMDE2IDc2My42NDMgMjAuMTMzOFYyMC45OTg5Qzc3Ni4zNTkgMTQuMzkxNSA3OTQuMzk1IDE0LjQzMTcgNzk2LjAzNyAyMy45MDE2Qzc5Ni41ODkgMjcuMDM0MiA3OTQuODQzIDMwLjI5NzggNzkxLjcyMyAzMi4xNzdWMzQuNjM0MkM3OTUuNDc2IDMzLjI0MzIgNzk5LjMyNCAyOC43NDQyIDc5OC4yMDUgMjMuMjMzNVYyMy4yMzM1WiIgZmlsbD0iIzBFN0RDMiIvPg0KPHBhdGggZD0iTTc5MC4xNTkgMjEuNzM2OEg3ODcuODU2VjMyLjEwM0M3ODcuODU2IDMzLjMxNzkgNzg4LjQzNyAzNC4zNzQ0IDc5MC4xNTkgMzQuNTQzMlYyMS43MzY4Wk03NjIuNzM5IDI1LjUyMTdINzYwLjQzMkw3NjAuNDMxIDMyLjI5NDNDNzYwLjQzMSAzMy41MTM0IDc2MS4wMTMgMzQuNTY4OCA3NjIuNzM5IDM0LjczNDRWMjUuNTIxN1YyNS41MjE3Wk03NjAuNDMyIDIyLjA1MjFINzYyLjczMlYyNC4yNTg0SDc2MC40MzJWMjIuMDUyMVpNNzc2LjUzIDM0LjYyNzJDNzc0LjY2NiAzNC42MjcyIDc3My44NzcgMzMuMzE3NyA3NzMuODc3IDMyLjAyOFYyMy4wMzU1SDc3Ni4xNlYyNS41MjE3SDc3Ny44NzlWMjcuMzg1M0g3NzYuMTZWMzEuODg1NEM3NzYuMTYgMzIuNDExMyA3NzYuNDA3IDMyLjcwNDQgNzc2Ljk1IDMyLjcwNDRINzc3Ljg3OVYzNC42MjcyTDc3Ni41MyAzNC42MjcyVjM0LjYyNzJaTTc4MC43MzEgMzAuNzk2MUM3ODAuNzMxIDMxLjk3NjggNzgxLjQ2MSAzMi44NDQ2IDc4Mi43NTQgMzIuODQ0NkM3ODMuNzY2IDMyLjg0NDYgNzg0LjI2NiAzMi41NjA1IDc4NC44NSAzMS45NzY4TDc4Ni4yNjEgMzMuMzM0OUM3ODUuMzU3IDM0LjIzNzkgNzg0LjQwOSAzNC43ODcgNzgyLjczNyAzNC43ODdDNzgwLjU1MiAzNC43ODcgNzc4LjQ1OSAzMy41ODE5IDc3OC40NTkgMzAuMDY4NkM3NzguNDU5IDI3LjA2NTEgNzgwLjI4OCAyNS4zNjczIDc4Mi42ODYgMjUuMzY3M0M3ODUuMTI0IDI1LjM2NzMgNzg2LjUyNSAyNy4zNTQ5IDc4Ni41MjUgMjkuOTYzOVYzMC43OTYzSDc4MC43MzFWMzAuNzk2MVpNNzgyLjU4NiAyNy4yNzU2Qzc4MS44MDUgMjcuMjc1NiA3ODEuMjA0IDI3LjY4MjMgNzgwLjk1IDI4LjIzMDlDNzgwLjgwMiAyOC41NjA3IDc4MC43NDcgMjguODE3NyA3ODAuNzMxIDI5LjIyMjlINzg0LjI0OUM3ODQuMjA0IDI4LjIzMDkgNzgzLjc1OSAyNy4yNzU2IDc4Mi41ODYgMjcuMjc1NlpNNzY4LjkzOSAyNy4zODUzQzc2OS42MDggMjcuMzg1MyA3NjkuODg3IDI3LjcxOTggNzY5Ljg4NyAyOC4yNjI2VjM0LjY0MDZINzcyLjE3VjI4LjI0OTJDNzcyLjE3IDI2Ljk1NDIgNzcxLjQ4NyAyNS41MjQxIDc2OS40ODIgMjUuNTI0MUw3NjQuNzY2IDI1LjUyMTdWMzQuNjQwNkg3NjcuMDVWMjcuMzg1M0g3NjguOTM5VjI3LjM4NTNaTTc5Mi42MzcgMjMuNTg5MUM3OTIuMTI5IDIzLjU4OTEgNzkxLjcyNCAyMy4xNzU0IDc5MS43MjQgMjIuNjYyOUM3OTEuNzI0IDIyLjE1MjkgNzkyLjEyOSAyMS43MzY4IDc5Mi42MzcgMjEuNzM2OEM3OTMuMTQyIDIxLjczNjggNzkzLjU1NiAyMi4xNTI5IDc5My41NTYgMjIuNjYyOUM3OTMuNTU2IDIzLjE3NTQgNzkzLjE0MiAyMy41ODkxIDc5Mi42MzcgMjMuNTg5MVpNNzkyLjYzNyAyMS44OTEyQzc5Mi4yMTggMjEuODkxMiA3OTEuODgyIDIyLjI0MDcgNzkxLjg4MiAyMi42NjI5Qzc5MS44ODIgMjMuMDg3NiA3OTIuMjE4IDIzLjQzMDkgNzkyLjYzNyAyMy40MzA5Qzc5My4wNTUgMjMuNDMwOSA3OTMuNDAyIDIzLjA4NzYgNzkzLjQwMiAyMi42NjI5Qzc5My40MDIgMjIuMjQwNyA3OTMuMDU1IDIxLjg5MTIgNzkyLjYzNyAyMS44OTEyWk03OTMuMDQzIDIzLjIxOEg3OTIuODcyQzc5Mi44NjQgMjMuMjE3OSA3OTIuODU3IDIzLjIxNTcgNzkyLjg1MSAyMy4yMTE2Qzc5Mi44NDUgMjMuMjA3NSA3OTIuODQgMjMuMjAxNyA3OTIuODM3IDIzLjE5NDlMNzkyLjYwNSAyMi43OTdDNzkyLjU5OCAyMi43ODg1IDc5Mi41NzkgMjIuNzc4OCA3OTIuNTczIDIyLjc3ODhINzkyLjQ2N1YyMy4xNzU0Qzc5Mi40NjcgMjMuMTk1IDc5Mi40NTMgMjMuMjE4MSA3OTIuNDI4IDIzLjIxODFINzkyLjI3NEM3OTIuMjUxIDIzLjIxODEgNzkyLjIzNSAyMy4xOTUgNzkyLjIzNSAyMy4xNzU0VjIyLjE3NDlDNzkyLjIzNSAyMi4xMTY0IDc5Mi4yNTQgMjIuMDkyNCA3OTIuMzA1IDIyLjA4NUM3OTIuMzYxIDIyLjA3OSA3OTIuNTA1IDIyLjA3MTYgNzkyLjU4NiAyMi4wNzE2Qzc5Mi44NzIgMjIuMDcxNiA3OTMuMDM5IDIyLjE1NjYgNzkzLjAzOSAyMi40MjQ0VjIyLjQ0NEM3OTMuMDM5IDIyLjYwOTQgNzkyLjk1OSAyMi42OTk1IDc5Mi44MzMgMjIuNzM5N0w3OTMuMDc0IDIzLjE1NDdDNzkzLjA3OCAyMy4xNjQgNzkzLjA4IDIzLjE3MzkgNzkzLjA4IDIzLjE4NEM3OTMuMDggMjMuMTk5NyA3OTMuMDcyIDIzLjIxOCA3OTMuMDQzIDIzLjIxOFYyMy4yMThaTTc5Mi44MjEgMjIuNDI0NEM3OTIuODIxIDIyLjMxMjcgNzkyLjc1MiAyMi4yNzczIDc5Mi42MDUgMjIuMjc3M0g3OTIuNDU5VjIyLjU5NDdDNzkyLjQ4MiAyMi41OTQ3IDc5Mi41ODYgMjIuNTk5NiA3OTIuNjA1IDIyLjU5OTZDNzkyLjc1MiAyMi41OTk2IDc5Mi44MjEgMjIuNTUgNzkyLjgyMSAyMi40NDRWMjIuNDI0NFoiIGZpbGw9IiMwRTdEQzIiLz4NCjwvZz4NCjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMV81OF8xMTEpIj4NCjxwYXRoIGQ9Ik01MzMuNzczIDIwLjk5MTFDNTI5LjI2MyAyMC45OTExIDUyNS41OTkgMjQuNjU0NyA1MjUuNTk5IDI5LjE2NDRDNTI1LjU5OSAzMy42NzQxIDUyOS4yNjMgMzcuMzM3NyA1MzMuNzczIDM3LjMzNzdDNTM4LjI4MiAzNy4zMzc3IDU0MS45NDYgMzMuNjc0MSA1NDEuOTQ2IDI5LjE2NDRDNTQxLjk0NiAyNC42NTQ3IDUzOC4yODIgMjAuOTkxMSA1MzMuNzczIDIwLjk5MTFaTTUzMy43NzMgMzYuNTE4NkM1MjkuNzEzIDM2LjUxODYgNTI2LjQxOSAzMy4yMTUgNTI2LjQxOSAyOS4xNjQ0QzUyNi40MTkgMjUuMTEzNyA1MjkuNzEzIDIxLjgxMDIgNTMzLjc3MyAyMS44MTAyQzUzNy44MzIgMjEuODEwMiA1NDEuMTI3IDI1LjExMzcgNTQxLjEyNyAyOS4xNjQ0QzU0MS4xMjcgMzMuMjE1IDUzNy44MzIgMzYuNTE4NiA1MzMuNzczIDM2LjUxODZaIiBmaWxsPSJibGFjayIvPg0KPHBhdGggZD0iTTUzNi42OSAyMy45MjUyQzUzNi42NjMgMjMuOTA3MiA1MzYuNjI3IDIzLjg5ODIgNTM2LjU5MSAyMy44OTgyQzUzNi40ODMgMjMuODk4MiA1MzYuNDAyIDIzLjk3OTIgNTM2LjQwMiAyNC4wODczVjI2LjY0MzdDNTM2LjQwMiAyNi43MzM3IDUzNi4zMyAyNi44MDU3IDUzNi4yNCAyNi44MDU3SDUzMS4yOUM1MzEuMiAyNi44MDU3IDUzMS4xMzcgMjYuNzMzNyA1MzEuMTI4IDI2LjY0MzdWMjQuMDg3M0M1MzEuMTI4IDI0LjA1MTMgNTMxLjExOSAyNC4wMjQyIDUzMS4xMDEgMjMuOTg4MkM1MzEuMDQ3IDIzLjg5ODIgNTMwLjkzIDIzLjg3MTIgNTMwLjgzOSAyMy45MjUyQzUyOS4wMTIgMjUuMDUwNCA1MjcuOTA1IDI3LjAwMzcgNTI3LjkwNSAyOS4xNjQxQzUyNy45MDUgMzEuMzI0NCA1MjkuMDEyIDMzLjI3NzcgNTMwLjg1NyAzNC40MDI5QzUzMC44ODUgMzQuNDIwOSA1MzAuOTIxIDM0LjQyOTkgNTMwLjk1NyAzNC40Mjk5QzUzMS4wNjUgMzQuNDI5OSA1MzEuMTQ2IDM0LjM0ODkgNTMxLjE0NiAzNC4yNDA5VjMxLjY4NDVDNTMxLjE0NiAzMS41OTQ0IDUzMS4yMTggMzEuNTMxNCA1MzEuMzA4IDMxLjUyMjRINTM2LjI1OEM1MzYuMzQ4IDMxLjUyMjQgNTM2LjQyIDMxLjU5NDQgNTM2LjQyIDMxLjY4NDVWMzQuMjQwOUM1MzYuNDIgMzQuMjc2OSA1MzYuNDI5IDM0LjMwMzkgNTM2LjQ0NyAzNC4zMzk5QzUzNi41MDEgMzQuNDI5OSA1MzYuNjE4IDM0LjQ1NjkgNTM2LjcwOCAzNC40MDI5QzUzOC41NTQgMzMuMjc3NyA1MzkuNjYxIDMxLjMyNDQgNTM5LjY2MSAyOS4xNjQxQzUzOS42NjEgMjcuMDAzNyA1MzguNTM2IDI1LjA1MDQgNTM2LjY5IDIzLjkyNTJWMjMuOTI1MlpNNTMwLjE5MSAzMi4zNjg2TDUzMC4yMTggMzIuNjc0Nkw1MzAuMDIgMzIuNDMxNkM1MjguNDk5IDMwLjUxNDMgNTI4LjQ5OSAyNy44MDQ4IDUzMC4wMiAyNS44ODc1TDUzMC4xOTEgMjUuNjcxNUw1MzAuMjE4IDI1LjY0NDVMNTMwLjE5MSAyNS45NTk2QzUzMC4xNjQgMjYuMjExNiA1MzAuMTU1IDI2LjQ3MjYgNTMwLjE1NSAyNi43MzM3VjMxLjU4NTRDNTMwLjE1NSAzMS44NDY1IDUzMC4xNzMgMzIuMTA3NSA1MzAuMTkxIDMyLjM2ODZaTTUzNi40MDIgMzAuMzg4M0M1MzYuNDAyIDMwLjQ3ODMgNTM2LjMzIDMwLjU1MDMgNTM2LjI0IDMwLjU1MDNINTMxLjI5QzUzMS4yIDMwLjU1MDMgNTMxLjEzNyAzMC40NzgzIDUzMS4xMjggMzAuMzg4M1YyNy45Mzk5QzUzMS4xMjggMjcuODQ5OSA1MzEuMiAyNy43Nzc4IDUzMS4yOSAyNy43Nzc4SDUzNi4yNEM1MzYuMzMgMjcuNzc3OCA1MzYuNDAyIDI3Ljg0OTkgNTM2LjQwMiAyNy45Mzk5VjMwLjM4ODNaTTUzNy41MTkgMzIuNDMxNkw1MzcuMzIxIDMyLjY3NDZMNTM3LjM0OCAzMi4zNjg2QzUzNy4zNzUgMzIuMTE2NSA1MzcuMzg0IDMxLjg1NTUgNTM3LjM4NCAzMS41OTQ0VjI2LjczMzdDNTM3LjM4NCAyNi40NzI2IDUzNy4zNzUgMjYuMjExNiA1MzcuMzQ4IDI1Ljk1OTZMNTM3LjMzOSAyNS44MjQ1TDUzNy4zMyAyNS42ODA1VjI1LjY0NDVMNTM3LjUxOSAyNS44ODc1QzUzOC4yNTcgMjYuODA1NyA1MzguNjYyIDI3Ljk3NTkgNTM4LjY2MiAyOS4xNTUxQzUzOC42NjIgMzAuMzM0MiA1MzguMjU3IDMxLjUxMzQgNTM3LjUxOSAzMi40MzE2VjMyLjQzMTZaIiBmaWxsPSJibGFjayIvPg0KPHBhdGggZD0iTTU1NC4yNzYgMjkuMDIwMkM1NTQuMjMxIDI5LjAwMjIgNTU0LjE3NyAyOC45ODQyIDU1NC4xNzcgMjguOTMwMkM1NTQuMTc3IDI4Ljg5NDIgNTU0LjE5NSAyOC44NjcyIDU1NC4yMzEgMjguODQ5MkM1NTQuMjk0IDI4LjgyMjIgNTU1Ljg1MSAyOC4yNjQxIDU1NS44NTEgMjYuNDI3OEM1NTUuODUxIDI0LjM4NDUgNTU0LjQ3NCAyMy4xNjkzIDU1Mi4xNTIgMjMuMTY5M0g1NDYuNTI2VjM1LjE3NzJINTUyLjY2NUM1NTQuNDU2IDM1LjE3NzIgNTU2LjM4MiAzMy45MDggNTU2LjM4MiAzMS44NjQ2QzU1Ni4zODIgMjkuOTExMyA1NTQuOTA2IDI5LjIyNzIgNTU0LjI3NiAyOS4wMjAyVjI5LjAyMDJaTTU0OS4zNjEgMjUuNjI2N0M1NDkuMzYxIDI1LjU4MTcgNTQ5LjM5NyAyNS41NDU2IDU0OS40NDIgMjUuNTQ1Nkg1NTEuNjc1QzU1Mi40MTMgMjUuNTQ1NiA1NTIuOTE3IDI2LjA0MDcgNTUyLjkxNyAyNi43Nzg4QzU1Mi45MTcgMjcuMzU0OSA1NTIuNDY3IDI3Ljk3NiA1NTEuNjIxIDI3Ljk3Nkg1NDkuNDQyQzU0OS4zOTcgMjcuOTc2IDU0OS4zNjEgMjcuOTQgNTQ5LjM2MSAyNy44OTVWMjUuNjI2N1pNNTUxLjY3NSAzMi44MDk4SDU0OS40NDJDNTQ5LjM5NyAzMi44MDk4IDU0OS4zNjEgMzIuNzczOCA1NDkuMzYxIDMyLjcyODhWMzAuMzM0NEM1NDkuMzYxIDMwLjI4OTQgNTQ5LjM5NyAzMC4yNTM0IDU0OS40NDIgMzAuMjUzNEg1NTEuNjIxQzU1Mi42OTIgMzAuMjUzNCA1NTMuMzA0IDMwLjcxMjUgNTUzLjMwNCAzMS41MjI2QzU1My4zMDQgMzIuMzU5NyA1NTIuNzM3IDMyLjgwOTggNTUxLjY3NSAzMi44MDk4VjMyLjgwOThaTTU3NS4zODQgMjcuOTQ5TDU3NC45NTIgMjcuODU5QzU3My45OCAyNy42NTIgNTczLjAzNSAyNy4zOTA5IDU3My4wMzUgMjYuNTUzOEM1NzMuMDM1IDI1LjcxNjcgNTczLjgxOCAyNS4zMzg2IDU3NC41OTIgMjUuMzM4NkM1NzUuNTAxIDI1LjMzODYgNTc2LjQwMSAyNS43NDM3IDU3Ny4wODYgMjYuNDQ1OEw1NzguODY4IDI0LjY4MTVDNTc4LjEwMyAyMy44MzU0IDU3Ni43NDQgMjIuODYzMiA1NzQuNTQ3IDIyLjg2MzJDNTcxLjkwMSAyMi44NjMyIDU3MC4xMTggMjQuMzY2NSA1NzAuMTE4IDI2LjYwNzhDNTcwLjExOCAyOC45NzUyIDU3MS45ODIgMjkuODY2MyA1NzMuNTQ4IDMwLjE5OTRMNTczLjk3MSAzMC4yODk0QzU3NS40OTIgMzAuNjEzNSA1NzYuMjEyIDMwLjg1NjUgNTc2LjIxMiAzMS43MjA2QzU3Ni4yMTIgMzIuNDk0NyA1NzUuNTE5IDMzLjAwNzggNTc0LjQ5MyAzMy4wMDc4QzU3My4yODcgMzMuMDA3OCA1NzIuMjE2IDMyLjQ3NjcgNTcxLjQwNiAzMS40Nzc2TDU2OS41NzggMzMuMjY4OUM1NzAuNTUxIDM0LjQyMTEgNTcxLjgzOCAzNS40NjUyIDU3NC41MjkgMzUuNDY1MkM1NzYuODI1IDM1LjQ2NTIgNTc5LjE1NiAzNC4xMzMgNTc5LjE1NiAzMS41NzY2QzU3OS4xNDcgMjguOTU3MiA1NzcuMzY1IDI4LjM2MzEgNTc1LjM4NCAyNy45NDlWMjcuOTQ5Wk01OTkuMTAzIDIzLjE2OTNWMjcuNTYyQzU5OS4xMDMgMjcuNjA3IDU5OS4wNjcgMjcuNjQzIDU5OS4wMjIgMjcuNjQzSDU5NS4zMzFDNTk1LjI4NiAyNy42NDMgNTk1LjI1IDI3LjYwNyA1OTUuMjUgMjcuNTYyVjIzLjE2OTNINTkyLjIyNlYzNS4xNzcySDU5NS4yNVYzMC40NjA0QzU5NS4yNSAzMC40MTU0IDU5NS4yODYgMzAuMzc5NCA1OTUuMzMxIDMwLjM3OTRINTk5LjAyMkM1OTkuMDY3IDMwLjM3OTQgNTk5LjEwMyAzMC40MTU0IDU5OS4xMDMgMzAuNDYwNFYzNS4xNzcySDYwMi4xNDZWMjMuMTY5M0g1OTkuMTAzWk01ODYuMTQxIDMyLjcxOThDNTg0Ljc4MiAzMi43MTk4IDU4My4zMTUgMzEuNTg1NiA1ODMuMzE1IDI5LjA5MjJDNTgzLjMxNSAyNi44MTQ4IDU4NC42OTIgMjUuNjI2NyA1ODYuMDUxIDI1LjYyNjdDNTg3LjA0MSAyNS42MjY3IDU4Ny43MzQgMjYuMDQwNyA1ODguMjgzIDI2Ljk1ODlMNTkwLjYwNiAyNS40MTk2QzU4OS40MTggMjMuNjczMyA1ODguMDA0IDIyLjg4MTIgNTg2LjAzMyAyMi44ODEyQzU4Mi4xNzEgMjIuODgxMiA1ODAuNDQzIDI2LjAwNDcgNTgwLjQ0MyAyOS4wOTIyQzU4MC40NDMgMzIuODQ1OCA1ODIuNzI5IDM1LjQ2NTIgNTg1Ljk5NyAzNS40NjUyQzU4OC40MjcgMzUuNDY1MiA1ODkuNTM1IDM0LjU3NDEgNTkwLjY5NiAzMi45MjY4TDU4OC4zNTUgMzEuMzUxNkM1ODcuODMzIDMyLjE5NzcgNTg3LjI2NiAzMi43MTk4IDU4Ni4xNDEgMzIuNzE5OFpNNTYzLjE3OCAyMi44NjMyQzU1OS44NzUgMjIuODYzMiA1NTcuNjYxIDI1LjM5MjYgNTU3LjY2MSAyOS4xNjQyQzU1Ny42NjEgMzIuOTM1OCA1NTkuODc1IDM1LjQ2NTIgNTYzLjE3OCAzNS40NjUyQzU2Ni40ODIgMzUuNDY1MiA1NjguNjk2IDMyLjkzNTggNTY4LjY5NiAyOS4xNjQyQzU2OC42OTYgMjUuMzkyNiA1NjYuNDgyIDIyLjg2MzIgNTYzLjE3OCAyMi44NjMyVjIyLjg2MzJaTTU2My4xNzggMzIuNzE5OEM1NjEuNTU4IDMyLjcxOTggNTYwLjUxNCAzMS4zMjQ2IDU2MC41MTQgMjkuMTY0MkM1NjAuNTE0IDI3LjAxMjkgNTYxLjU1OCAyNS42MjY3IDU2My4xNzggMjUuNjI2N0M1NjQuODA4IDI1LjYyNjcgNTY1Ljg2MSAyNy4wMTI5IDU2NS44NjEgMjkuMTY0MkM1NjUuODYxIDMxLjMyNDYgNTY0LjgwOCAzMi43MTk4IDU2My4xNzggMzIuNzE5OFoiIGZpbGw9IiNGODAwMDAiLz4NCjwvZz4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTQ2LjM0NCAyMi4xODExQzE0Ny41OTUgMjIuMjg1NCAxNDguODQ1IDIxLjU1NTMgMTQ5LjYyNyAyMC42Mjk4QzE1MC4zOTUgMTkuNjc4MSAxNTAuOTAzIDE4LjQwMDUgMTUwLjc3MyAxNy4wOTY5QzE0OS42NjYgMTcuMTQ5MSAxNDguMjk4IDE3LjgyNjkgMTQ3LjUxNyAxOC43Nzg2QzE0Ni44IDE5LjU5OTkgMTQ2LjE4OCAyMC45Mjk2IDE0Ni4zNDQgMjIuMTgxMVpNMTQ3Ljg0MSAyMy4wNzk3QzE0OC42NTMgMjIuNzYwNiAxNDkuNjU4IDIyLjM2NTYgMTUwLjc2IDIyLjQyOTFDMTUxLjQ2MyAyMi40ODEyIDE1My40OTUgMjIuNjg5OCAxNTQuNzk4IDI0LjYxOTJDMTU0Ljc5MiAyNC42MjM3IDE1NC43NzggMjQuNjMyMyAxNTQuNzU5IDI0LjY0NUMxNTQuNDM2IDI0Ljg1NDggMTUyLjM5IDI2LjE4NzEgMTUyLjQxNCAyOC44MTY5QzE1Mi40MzkgMzEuOTQ5OSAxNTQuOTg4IDMzLjExODMgMTU1LjMyMiAzMy4yNzExQzE1NS4zNDQgMzMuMjgxMSAxNTUuMzU2IDMzLjI4NjcgMTU1LjM1OCAzMy4yODgzQzE1NS4zNTYgMzMuMjkyNiAxNTUuMzU0IDMzLjMwMSAxNTUuMzUgMzMuMzEzM0MxNTUuMjgzIDMzLjUyODggMTU0Ljg0NSAzNC45NDg5IDE1My44NDcgMzYuNDA0QzE1Mi45MjIgMzcuNzU5OCAxNTEuOTcxIDM5LjA4OTUgMTUwLjQ2IDM5LjExNTZDMTQ5Ljc0OSAzOS4xMjgzIDE0OS4yNyAzOC45MjExIDE0OC43NzIgMzguNzA1NEMxNDguMjQ3IDM4LjQ3ODUgMTQ3LjcwMSAzOC4yNDIyIDE0Ni44NCAzOC4yNDIyQzE0NS45NDcgMzguMjQyMiAxNDUuMzc2IDM4LjQ4NDggMTQ0LjgyNiAzOC43MTg0QzE0NC4zNDggMzguOTIxNCAxNDMuODg3IDM5LjExNzQgMTQzLjI0NSAzOS4xNDE3QzE0MS43ODYgMzkuMTkzOCAxNDAuNjc5IDM3LjcwNzcgMTM5Ljc1NCAzNi4zNTE5QzEzNy44NjYgMzMuNjE0MyAxMzYuNDIgMjguNjM0NCAxMzguMzc0IDI1LjI3MUMxMzkuMzI1IDIzLjU4OTMgMTQxLjA1NyAyMi41MzM0IDE0Mi45MTkgMjIuNTA3M0MxNDMuNzMyIDIyLjQ5MjUgMTQ0LjUwNyAyMi44MDA2IDE0NS4xODQgMjMuMDcwMUMxNDUuNzAyIDIzLjI3NTggMTQ2LjE2MiAyMy40NTg5IDE0Ni41NCAyMy40NTg5QzE0Ni44NzcgMjMuNDU4OSAxNDcuMzE5IDIzLjI4NTEgMTQ3Ljg0MSAyMy4wNzk3WiIgZmlsbD0iYmxhY2siLz4NCjxwYXRoIGQ9Ik0zNi44NTg3IDM3LjUyNDFIMzEuOTg3NEwzNS4wMzQyIDE5LjY2NjhIMzkuOTA1MkwzNi44NTg3IDM3LjUyNDFaIiBmaWxsPSIjMDA1NzlGIi8+DQo8cGF0aCBkPSJNNTQuNTE1NyAyMC4xMDQxQzUzLjU1NDkgMTkuNzQyOCA1Mi4wMzA5IDE5LjM0MzggNTAuMTQ2NiAxOS4zNDM4QzQ1LjMzNjEgMTkuMzQzOCA0MS45NDg2IDIxLjc3NTMgNDEuOTI3OCAyNS4yNTE2QzQxLjg4NzggMjcuODE2NSA0NC4zNTMxIDI5LjI0MSA0Ni4xOTcgMzAuMDk2MkM0OC4wODE2IDMwLjk3MDEgNDguNzIyMyAzMS41NDA1IDQ4LjcyMjMgMzIuMzE5NEM0OC43MDMxIDMzLjUxNTcgNDcuMTk5NCAzNC4wNjcyIDQ1Ljc5NjkgMzQuMDY3MkM0My44NTIxIDM0LjA2NzIgNDIuODEgMzMuNzgyOSA0MS4yMjY0IDMzLjExNzNMNDAuNTg1IDMyLjgzMkwzOS45MDMzIDM2Ljg0MDZDNDEuMDQ1OCAzNy4zMzM5IDQzLjE1MDcgMzcuNzcxNyA0NS4zMzYxIDM3Ljc5MDlDNTAuNDQ3MyAzNy43OTA5IDUzLjc3NDkgMzUuMzk3MSA1My44MTQzIDMxLjY5MjVDNTMuODMzOCAyOS42NTk3IDUyLjUzMiAyOC4xMDIgNDkuNzI1NCAyNi44MjkyQzQ4LjAyMTcgMjYuMDEyMSA0Ni45NzgzIDI1LjQ2MTIgNDYuOTc4MyAyNC42MjUyQzQ2Ljk5ODMgMjMuODY1MiA0Ny44NjA4IDIzLjA4NjggNDkuNzg0IDIzLjA4NjhDNTEuMzY3NyAyMy4wNDg2IDUyLjUzMTIgMjMuNDA5NCA1My40MTI2IDIzLjc3MDVMNTMuODUzMiAyMy45NjAxTDU0LjUxNTcgMjAuMTA0MVoiIGZpbGw9IiMwMDU3OUYiLz4NCjxwYXRoIGQ9Ik02MC45OTI0IDMxLjE5NzlDNjEuMzkzNiAzMC4xNzIgNjIuOTM3MiAyNi4yMDE2IDYyLjkzNzIgMjYuMjAxNkM2Mi45MTcgMjYuMjM5NyA2My4zMzc2IDI1LjE1NjggNjMuNTc4MSAyNC40OTE5TDYzLjkxODYgMjYuMDMwNkM2My45MTg2IDI2LjAzMDYgNjQuODQxIDMwLjMwNTEgNjUuMDQxNCAzMS4xOTc5QzY0LjI4IDMxLjE5NzkgNjEuOTU0NiAzMS4xOTc5IDYwLjk5MjQgMzEuMTk3OVpNNjcuMDA1NCAxOS42NjY4SDYzLjIzNzRDNjIuMDc1NSAxOS42NjY4IDYxLjE5MjcgMTkuOTg5NSA2MC42OTE0IDIxLjE0ODRMNTMuNDU1OCAzNy41MjM5SDU4LjU2NzFDNTguNTY3MSAzNy41MjM5IDU5LjQwODUgMzUuMzE5OSA1OS41ODk0IDM0Ljg0NTJDNjAuMTUwMSAzNC44NDUyIDY1LjEyMjMgMzQuODQ1MiA2NS44NDM3IDM0Ljg0NTJDNjUuOTgzNSAzNS40NzIxIDY2LjQyNDkgMzcuNTIzOSA2Ni40MjQ5IDM3LjUyMzlINzAuOTM1Mkw2Ny4wMDU0IDE5LjY2NjhWMTkuNjY2OFoiIGZpbGw9IiMwMDU3OUYiLz4NCjxwYXRoIGQ9Ik0yNy45MTggMTkuNjY2OEwyMy4xNDc1IDMxLjg0MzhMMjIuNjI2MiAyOS4zNzQxQzIxLjc0NDIgMjYuNTI0NSAxOC45NzgxIDIzLjQyODQgMTUuODkxNCAyMS44ODlMMjAuMjYxIDM3LjUwNTJIMjUuNDEyMkwzMy4wNjkgMTkuNjY2OEgyNy45MThWMTkuNjY2OFoiIGZpbGw9IiMwMDU3OUYiLz4NCjxwYXRoIGQ9Ik0xOC43MTg0IDE5LjY2NjhIMTAuODgxMUwxMC44MDA5IDIwLjAyNzZDMTYuOTE0NSAyMS41MDk1IDIwLjk2MzUgMjUuMDgxNSAyMi42MjcgMjkuMzc0OUwyMC45MjMyIDIxLjE2NzlDMjAuNjQyNyAyMC4wMjc0IDE5Ljc4MDcgMTkuNzA0NCAxOC43MTg0IDE5LjY2NjhaIiBmaWxsPSIjRkFBNjFBIi8+DQo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDJfNThfMTExKSI+DQo8cGF0aCBkPSJNMjIxLjE1OCAxNy40OTlWMTguOTM1NkgyMzEuMzA2VjE3LjQ5OUgyMjEuMTU4Wk0yMzIuNzQ0IDE3LjQ5OVYxOC45MzU2SDI0Ny4yMDZDMjQ3LjIwNiAxOC45MzU2IDI0NS43MjkgMTcuNDk5IDI0My43NzMgMTcuNDk5SDIzMi43NDRaTTI1MC4wNDMgMTcuNDk5VjE4LjkzNTZIMjU4Ljc5M0wyNTguMjczIDE3LjQ5OUgyNTAuMDQzWk0yNjUuMDY1IDE3LjQ5OUwyNjQuNTQ2IDE4LjkzNTZIMjczLjIxNlYxNy40OTlIMjY1LjA2NVpNMjIxLjE1OCAyMC4yOTI5VjIxLjcyOTZIMjMxLjMwNlYyMC4yOTI5SDIyMS4xNThaTTIzMi43NDQgMjAuMjk1VjIxLjcyOTdIMjQ4Ljg4NEMyNDguODg0IDIxLjcyOTcgMjQ4LjY5NiAyMC42MjM5IDI0OC4zNjcgMjAuMjk1SDIzMi43NDRaTTI1MC4wNDMgMjAuMjk1VjIxLjcyOTdIMjU5Ljc1MkwyNTkuMjcxIDIwLjI5NUgyNTAuMDQzWk0yNjQuMDI3IDIwLjI5NUwyNjMuNTQ2IDIxLjcyOTdIMjczLjIxNlYyMC4yOTVIMjY0LjAyN1YyMC4yOTVaTTIyNC4wNzQgMjMuMDg2OVYyNC41MjU3SDIyOC40NjlWMjMuMDg2OUgyMjQuMDc0VjIzLjA4NjlaTTIzNS42NjEgMjMuMDg2OVYyNC41MjU3SDI0MC4wNTZWMjMuMDg2OUgyMzUuNjYxVjIzLjA4NjlaTTI0NC4zMzEgMjMuMDg2OVYyNC41MjU3SDI0OC43MjZDMjQ4LjcyNiAyNC41MjU3IDI0OS4wMDUgMjMuNzY1OSAyNDkuMDA1IDIzLjA4NjlIMjQ0LjMzMVYyMy4wODY5Wk0yNTIuOTYgMjMuMDg2OVYyNC41MjU3SDI2MC43NTJMMjYwLjIzMiAyMy4wODY5SDI1Mi45NlYyMy4wODY5Wk0yNjMuMDY5IDIzLjA4NjlMMjYyLjU0OCAyNC41MjU3SDI3MC4zNzlWMjMuMDg2OUgyNjMuMDY5VjIzLjA4NjlaTTIyNC4wNzQgMjUuODgzVjI3LjMxOTdIMjI4LjQ2OVYyNS44ODNIMjI0LjA3NFYyNS44ODNaTTIzNS42NjEgMjUuODgzVjI3LjMxOTdIMjQ2Ljg4N0MyNDYuODg3IDI3LjMxOTcgMjQ3LjgyNiAyNi41ODI1IDI0OC4xMjUgMjUuODgzSDIzNS42NjFaTTI1Mi45NiAyNS44ODNWMjcuMzE5N0gyNTcuMzU1VjI2LjUyTDI1Ny42MzQgMjcuMzE5N0gyNjUuNjg0TDI2NS45ODQgMjYuNTJWMjcuMzE5N0gyNzAuMzc5VjI1Ljg4M0gyNjIuMTI5TDI2MS42OTEgMjcuMDk5OUwyNjEuMjUxIDI1Ljg4M0gyNTIuOTZaTTIyNC4wNzQgMjguNjc3VjMwLjExMzdIMjI4LjQ2OVYyOC42NzdIMjI0LjA3NFpNMjM1LjY2MSAyOC42NzdWMzAuMTEzN0gyNDguMTI1QzI0Ny44MjYgMjkuNDE2NSAyNDYuODg3IDI4LjY3NyAyNDYuODg3IDI4LjY3N0gyMzUuNjYxWk0yNTIuOTYgMjguNjc3VjMwLjExMzdIMjU3LjM1NVYyOC42NzdIMjUyLjk2Wk0yNTguMTUzIDI4LjY3N0wyNTguNjg1IDMwLjExMzdIMjY0LjcyMUwyNjUuMjI2IDI4LjY3N0gyNTguMTUzWk0yNjUuOTg0IDI4LjY3N1YzMC4xMTM3SDI3MC4zNzlWMjguNjc3SDI2NS45ODRaTTIyNC4wNzQgMzEuNDcxVjMyLjkwNzZIMjI4LjQ2OVYzMS40NzFIMjI0LjA3NFpNMjM1LjY2MSAzMS40NzFWMzIuOTA3NkgyNDAuMDU2VjMxLjQ3MUgyMzUuNjYxWk0yNDQuMzMxIDMxLjQ3MVYzMi45MDc2SDI0OS4wMDVDMjQ5LjAwNSAzMi4yMjk2IDI0OC43MjYgMzEuNDcxIDI0OC43MjYgMzEuNDcxSDI0NC4zMzFWMzEuNDcxWk0yNTIuOTYgMzEuNDcxVjMyLjkwNzZIMjU3LjM1NVYzMS40NzFIMjUyLjk2Wk0yNTkuMTUxIDMxLjQ3MUwyNTkuNjY2IDMyLjkwNzZIMjYzLjcxM0wyNjQuMjMyIDMxLjQ3MUgyNTkuMTUxWk0yNjUuOTg0IDMxLjQ3MVYzMi45MDc2SDI3MC4zNzlWMzEuNDcxSDI2NS45ODRaTTIyMS4yMzcgMzQuMjY1VjM1LjcwMzdIMjMxLjM4NlYzNC4yNjVIMjIxLjIzN1pNMjMyLjc0NCAzNC4yNjVWMzUuNzAzN0gyNDguMzY3QzI0OC42OTYgMzUuMzc0MyAyNDguODg0IDM0LjI2NSAyNDguODg0IDM0LjI2NUgyMzIuNzQ0VjM0LjI2NVpNMjUwLjEyMyAzNC4yNjVWMzUuNzAzN0gyNTcuMzU1VjM0LjI2NUgyNTAuMTIzWk0yNjAuMTUxIDM0LjI2NUwyNjAuNjggMzUuNzAzN0gyNjIuNzM5TDI2My4yMzYgMzQuMjY1SDI2MC4xNTFaTTI2NS45ODQgMzQuMjY1VjM1LjcwMzdIMjczLjI5NVYzNC4yNjVIMjY1Ljk4NFpNMjIxLjIzNyAzNy4wNjFWMzguNDk3N0gyMzEuMzg2VjM3LjA2MUgyMjEuMjM3Wk0yMzIuNzQ0IDM3LjA2MVYzOC40OTU2SDI0My43NzNDMjQ1LjcyOSAzOC40OTU2IDI0Ny4yMDYgMzcuMDYxIDI0Ny4yMDYgMzcuMDYxSDIzMi43NDRaTTI1MC4xMjMgMzcuMDYxVjM4LjQ5NzdIMjU3LjM1NVYzNy4wNjFIMjUwLjEyM1pNMjYxLjE1NSAzNy4wNjFMMjYxLjY2NCAzOC40OTM2TDI2MS43NTIgMzguNDk1NkwyNjIuMjY5IDM3LjA2MUgyNjEuMTU1VjM3LjA2MVpNMjY1Ljk4NCAzNy4wNjFWMzguNDk3N0gyNzMuMjk1VjM3LjA2MUgyNjUuOTg0WiIgZmlsbD0iIzFGNzBDMSIvPg0KPC9nPg0KPGRlZnM+DQo8Y2xpcFBhdGggaWQ9ImNsaXAwXzU4XzExMSI+DQo8cmVjdCB3aWR0aD0iNDQuNDQ3MyIgaGVpZ2h0PSIyOS42MzE1IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzUzLjk1NSAxNC44MTU1KSIvPg0KPC9jbGlwUGF0aD4NCjxjbGlwUGF0aCBpZD0iY2xpcDFfNThfMTExIj4NCjxyZWN0IHdpZHRoPSI3Ni41NDgxIiBoZWlnaHQ9IjE2LjM1MDciIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MjUuNTk5IDIwLjk4ODkpIi8+DQo8L2NsaXBQYXRoPg0KPGNsaXBQYXRoIGlkPSJjbGlwMl81OF8xMTEiPg0KPHJlY3Qgd2lkdGg9IjUyLjEzNzIiIGhlaWdodD0iMjAuOTk4NyIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMS4xNTggMTcuNDk5KSIvPg0KPC9jbGlwUGF0aD4NCjwvZGVmcz4NCjwvc3ZnPg0K" style="
            width: 742.5px;
            position: relative;
            top: 107px;
            left: 32px;
            ">
            <a href=${accountURL} style="
        float: left;
        border-radius: 56px;
        background: #0D6EFD;
        padding-top: 8px;
        width: 280px;
        height: 38px;
        text-align: center;
        position: relative;
        top: 127px;
        left: 274px;
        font-size: 16px;
        color: white;
        text-decoration: none;
        letter-spacing: 0.02em;
    ">Claim your FREE account</a>
            <div style="
    font-size: 14px;
    position: relative;
    top: 180px;
    left: 19px;
    letter-spacing: 0.02em;
    font-weight: 500;
    line-height: 125%;
">have a Syncfusion account? <a href="https://www.syncfusion.com/account/login?ReturnUrl=/account/login" style="text-decoration: none;
color: #0D6EFD;
font-weight: 500;">Sign In</a></div>
        </div>
    </div>`;
    if (typeof document !== 'undefined' && !isNullOrUndefined(document)) {
        const errorBackground: HTMLElement = createElement('div', {
            innerHTML: bannerTemplate
        });
        document.body.appendChild(errorBackground);
    }
};

interface IValidator {
    version?: string;
    expiryDate?: string;
    platform?: string;
    invalidPlatform?: boolean
}

interface IErrorType {
    noLicense: string;
    trailExpired: string;
    versionMismatched: string;
    platformMismatched: string;
    invalidKey: string;
}
