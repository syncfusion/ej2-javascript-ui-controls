
import { TestHelper } from '../../common/helper.spec';
import { WorkbookModel, Workbook } from '../../../src/workbook/index';

/**
 * Represents the class which contains Helper functions to test Workbook library.
 */
export class WorkbookHelper {
    private instance: Workbook;

    constructor(model: WorkbookModel = {}) {
        this.instance = new Workbook(model);
    }

    getInstance(): Workbook {
        return this.instance;
    }

    setModel(property: any, value: any, dataBind: boolean = true): void {
        let inst: Workbook = this.getInstance();
        inst[property] = value;
        if (dataBind) {
            inst.dataBind();
        }
    }

    getModel(property: any) {
        return this.getInstance()[property];
    }

    invoke(fName: string, args: any[] = []): any {
        let inst: Workbook = this.getInstance();
        return inst[fName].call(inst, ...args);
    }
}
