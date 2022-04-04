import { createElement } from './dom';
import { getValue, containerObject, setValue, isNullOrUndefined } from './util'

const bypassKey: number[] = [115, 121, 110, 99, 102, 117, 115, 105,
    111, 110, 46, 105, 115, 76, 105, 99, 86, 97, 108,
    105, 100, 97, 116, 101, 100];
/**
 * License validation module
 * @private
 */
class LicenseValidator {
    private isValidated: boolean = false;
    public version: string = '20.1';
    public platform: RegExp = /JavaScript|ASPNET|ASPNETCORE|ASPNETMVC|FileFormats/i;
    private errors: IErrorType = {
        noLicense: 'This application was built using a trial version of Syncfusion Essential Studio.' +
            ' Please include a valid license to permanently remove this license validation message.' +
            ' You can also obtain a free 30 day evaluation license to temporarily remove this message ' +
            'during the evaluation period. Please refer to this <a style="color:yellow;text-decoration:none;"' +
            'href="https://help.syncfusion.com/common/essential-studio/licensing">help topic</a> for more information.',
        trailExpired: 'Your Syncfusion trial license has expired. Please refer to this ' +
            '<a style="color:yellow;text-decoration:none;"' +
            'href="https://help.syncfusion.com/common/essential-studio/licensing/licensing-errors#trial-expired">help topic</a> for more information.',
        versionMismatched: 'The included Syncfusion license (v##LicenseVersion) is invalid for version ' +
            '##Requireversion. Please refer to this <a style="color:yellow;text-decoration:none;" ' +
            'href="https://help.syncfusion.com/es/licensing/version-mismatch/">help topic</a> for more information.',
        platformMismatched: 'The included Syncfusion license is invalid (Platform mismatch). Please refer' +
            ' to this <a style="color:yellow;text-decoration:none;" ' +
            'href="https://help.syncfusion.com/common/essential-studio/licensing/licensing-errors#platform-mismatch">help topic</a> for more information.',
        invalidKey: 'The included Syncfusion license is invalid. Please refer to this ' +
            '<a style="color:yellow;text-decoration:none;" ' +
            'href="https://help.syncfusion.com/common/essential-studio/licensing/licensing-errors#invalid-key">help topic</a> for more information.'
    };

    constructor(key?: string) {
        this.manager.setKey(key);
    }

    /**
     * To manage licensing operation.
     */
    private manager: { setKey: Function, getKey: Function } = (() => {
        let licKey: string = null;
        function set(key: string): void { licKey = key; }
        function get(): string { return licKey; }
        return {
            setKey: set,
            getKey: get
        };
    })();

    /**
     * To validate the provided license key.
     */
    public validate(): void {
        if (!this.isValidated && (containerObject && !getValue(convertToChar(bypassKey), containerObject) && !getValue('Blazor', containerObject))) {
            let validateMsg: string;
            if (this.manager && this.manager.getKey()) {
                let result: IValidator[] = this.getInfoFromKey();
                if (result && result.length) {
                    for (let res of result) {
                        if (!this.platform.test(res.platform) || res.invalidPlatform) {
                            validateMsg = this.errors.platformMismatched;
                        } else if (res.version.indexOf(this.version) === -1) {
                            validateMsg = this.errors.versionMismatched;
                            validateMsg = validateMsg.replace('##LicenseVersion', res.version);
                            validateMsg = validateMsg.replace('##Requireversion', this.version + '.x');
                        } else if (res.expiryDate) {
                            let expDate: Date = new Date(res.expiryDate);
                            let currDate: Date = new Date();
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
                validateMsg = this.errors.noLicense;
            }
            if (validateMsg && !isNullOrUndefined(document)) {
                let errorDiv: HTMLElement = createElement('div', {
                    innerHTML: validateMsg +
                        '<span style="position:absolute;right: 10px;top:27%;cursor:pointer;"' +
                        'onClick=this.parentElement.remove();>' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">' +
                        '<line x1="5" y1="5" x2="15" y2="15" stroke="yellow" stroke-width="2.5" ' +
                        'stroke-miterlimit="10" stroke-linecap="round"></line><line x1="15" y1="5" ' +
                        'x2="5" y2="15" stroke="yellow" stroke-width="2.5" stroke-linecap="round" ' +
                        'stroke-miterlimit="10"></line></svg></span>',
                    styles: 'position:fixed;top:0;left:0;right:0;font-family:"Segoe UI";font-size:16px;' +
                        'background:repeating-linear-gradient(45deg,#d70f0f,#d70f0f 10px,#e12121 10px,#e12121 17px);' +
                        'color:#ffffff;z-index:999999999;text-align:center;padding:10px 50px 10px 25px;'
                });
                errorDiv.setAttribute('id', 'js-licensing');
                document.body.appendChild(errorDiv);
            }
            this.isValidated = true;
            setValue(convertToChar(bypassKey), this.isValidated, containerObject)
        }
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
     */
    private getInfoFromKey(): IValidator[] {
        try {
            let licKey: string = this.manager.getKey();
            let licKeySplit: string[] = licKey.split(';');
            let pkey: number[] = [5439488, 7929856, 5111808, 6488064, 4587520, 7667712, 5439488,
                6881280, 5177344, 7208960, 4194304, 4456448, 6619136, 7733248, 5242880, 7077888,
                6356992, 7602176, 4587520, 7274496, 7471104, 7143424];
            let decryptedStr: string[] = [];
            let resultArray: IValidator[] = [];
            let invalidPlatform: boolean = false;
            for (let lKey of licKeySplit) {
                let decodeStr: string = this.getDecryptedData(lKey);
                if (!decodeStr) {
                    continue;
                }
                let k: number = 0;
                let buffr: string = '';
                for (let i: number = 0; i < decodeStr.length; i++, k++) {
                    if (k === pkey.length) { k = 0; }
                    let c: number = decodeStr.charCodeAt(i);
                    buffr += String.fromCharCode(c ^ (pkey[k] >> 16));
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
function convertToChar(cArr: number[]): string {
    let ret: string = '';
    for (let arr of cArr) {
        ret += String.fromCharCode(arr);
    }
    return ret;
}
/**
 * To set license key.
 * @param {string} key - license key
 */
export function registerLicense(key: string): void {
    licenseValidator = new LicenseValidator(key);
}

export const validateLicense: Function = (key?: string): void => {
    if (key) {
        registerLicense(key);
    }
    licenseValidator.validate();
};

export const getVersion: Function = (): string => {
    return licenseValidator.version;
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