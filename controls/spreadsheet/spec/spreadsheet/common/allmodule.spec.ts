import { Spreadsheet, AllModule, SpreadsheetModel } from "../../../src/spreadsheet/index";
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";

Spreadsheet.Inject(AllModule)

/**
 *  Spreadsheet All module spec
 */
describe('Spreadsheet All module checking ->', () => {

    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel = {};

    afterEach(() => {
       helper.invoke('destroy');
    });

    //As of now, checking for code coverage.
    it('Initialization checking', (done: Function) => {
        helper.initializeSpreadsheet(model, done);
    });

});