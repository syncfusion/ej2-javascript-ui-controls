import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class PdfViewer extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    constructor(id:string, wrapperFn:Function) {
        super();
        this.id = id;
        if(wrapperFn!==undefined){
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    getElement() {
        return this.selector('#' + this.id);
    }
    // tslint:enable
}