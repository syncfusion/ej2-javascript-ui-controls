import { Ajax, loadCldr } from '@syncfusion/ej2-base';

/**
 * Represents the class which contains Helper functions to test component.
 */
export class TestHelper {
    public id: string;
    public androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

    /**
     * Initialize the Spreadsheet E2E helpers
     * @param id Element id of the Spreadsheet element
     * @param wrapperFn Pass the wrapper function
     */
    constructor(id: string) {
        this.id = id;
    }

    public getElement(elemRefr: string = '#' + this.id): any {
        return document.querySelector(elemRefr);
    }

    public getElements(elemRefr: string = '#' + this.id): any {
        return document.querySelectorAll(elemRefr);
    }

    public getInstance(elemRefr: string = '#' + this.id): any {
        return this.getElement(elemRefr).ej2_instances[0];
    }

    public setModel(property: any, value: any, dataBind: boolean = true): void {
        let inst: any = this.getInstance();
        inst[property] = value;
        if (dataBind) {
            inst.dataBind();
        }
    }

    public getModel(property: any) {
        return this.getInstance()[property];
    }

    public invoke(fName: string, args: any[] = []): any {
        let inst: any = this.getInstance();
        return inst[fName].call(inst, ...args);
    }

    public eventHandler(eventName: string, callback: any): void {
        this.getInstance()[eventName] =  callback;
    }

    public loadCultureFiles(locales: string[]): void {
        const files: string[] = ['ca-gregorian', 'numbers', 'timeZoneNames', 'currencies'];
        locales.forEach((locale: string) => {
            for (let prop of files) {
                const url: string = `base/spec/common/cldr-data/main/${locale}/${prop}.json`;
                const ajax: Ajax = new Ajax(url, 'GET', false);
                ajax.onSuccess = (value: string) => loadCldr(JSON.parse(value));
                ajax.send();
            }
        });
    }
}
