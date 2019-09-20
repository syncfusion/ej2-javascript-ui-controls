import { Workbook, WorkbookModel, WorkbookAllModule } from "../../../src/workbook/index";
import { WorkbookHelper } from "../util/workbookhelper.spec";

Workbook.Inject(WorkbookAllModule);

/**
 *  Workbook All module spec
 */
describe('Workbook All module checking ->', () => {

    let helper: WorkbookHelper;
    let model: WorkbookModel = {};

    afterEach(() => {
        // Commented since facing issue with base destroy method (required element).
        //helper.invoke('destroy');
    });

    //As of now, checking for code coverage.
    it('Initialization checking', () => {
        helper = new WorkbookHelper(model);
    });

});