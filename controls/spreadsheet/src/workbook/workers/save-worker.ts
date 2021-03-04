import { Workbook } from '../base';
import { SaveOptions } from '../common/index';

/**
 * @hidden
 * The `SaveWorker` module is used to perform save functionality with Web Worker.
 */
export class SaveWorker {
    protected parent: Workbook;

    /**
     * Constructor for SaveWorker module in Workbook library.
     * @private
     */
    constructor(parent: Workbook) {
        this.parent = parent;
    }

    /**
     * Process sheet.
     * @hidden
     */
    protected processSheet(sheet: string, sheetIndex: number): Object {
        let parsedSheet: { [key: string]: Object } = JSON.parse(sheet, (key: string, value: Object) => {
            //Remove empty properties
            if ((Array.isArray(value) || typeof value === 'string') && !value.length) {
                return undefined;
            }
            return value;
        });

        return [sheetIndex, parsedSheet];
    }

    /**
     * Process save action.
     * @hidden
     */
    protected processSave(
        saveJSON: Object, saveSettings: SaveOptions | { [key: string]: string },
        customParams: Object): void {
        let formData: FormData = new FormData();
        let i: number;
        let keys: string[] = Object.keys(saveSettings);

        formData.append('JSONData', JSON.stringify(saveJSON));
        for (i = 0; i < keys.length; i++) {
            formData.append(keys[i], (<{ [key: string]: string }>saveSettings)[keys[i]]);
        }

        keys = Object.keys(customParams);
        for (i = 0; i < keys.length; i++) {
            formData.append(keys[i], customParams[keys[i]]);
        }
        fetch(saveSettings.url, { method: 'POST', body: formData })
        .then((response: Response) => {
            if (response.ok) {
                return response.blob();
            } else {
                return Promise.reject({
                    message: response.statusText
                });
            }
        })
        .then((data: Blob) => {
            new Promise((resolve: Function) => {
                let reader: FileReader = new FileReader();
                reader.onload = () => {
                    let result: string = reader.result.toString();
                    if (result.indexOf('data:text/plain;base64,') > -1 || result.indexOf('data:text/html;base64,') > -1 ||
                        result.indexOf('data:application/json;base64,') > -1) {
                        let str: string[];
                        result = result.replace('data:text/plain;base64,', ''); result = result.replace('data:text/html;base64,', '');
                        if (result.indexOf('data:application/json;base64,') > -1) {
                            result = result.replace('data:application/json;base64,', '');
                            str = atob(result).split('.');
                        } else {
                            str = atob(result).split(/(\r\n|\n|\r)/gm);
                        }
                        if (str.length) {
                            let text: string = str[0].length > 1 && str[0][0] === '"' ? str[0].split('"')[1] + '.' : str[0];
                            (postMessage as Function)({ dialog: text });
                        }
                    } else {
                        (postMessage as Function)(data);
                    }
                    resolve(reader.result);
                };
                reader.readAsDataURL(data);
            });
        })
        .catch((error: Error) => {
            (postMessage as Function)({ error: error.message });
        });

        // try {
        //     let httpRequest: XMLHttpRequest = new XMLHttpRequest();
        //     let formData: FormData = new FormData();
        //     let i: number;
        //     let keys: string[] = Object.keys(saveSettings);

        //     httpRequest.onreadystatechange = (event: Event) => {
        //         if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        //             (postMessage as Function)(httpRequest.response);
        //         }
        //     };

        //     httpRequest.onerror = (event: Event) => {
        //         (postMessage as Function)(event);
        //     };

        //     formData.append('JSONData', JSON.stringify(saveJSON));
        //     for (i = 0; i < keys.length; i++) {
        //         formData.append(keys[i], (<{ [key: string]: string }>saveSettings)[keys[i]]);
        //     }

        //     httpRequest.open('POST', saveSettings.saveUrl, false);
        //     httpRequest.send(formData);
        // } catch (e) {
        //     (postMessage as Function)({ error: e.message });
        // }
    }
}