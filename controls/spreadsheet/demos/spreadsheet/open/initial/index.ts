import { Spreadsheet, OpenFailureArgs } from '../../../../src/index';

let spreadsheet: Spreadsheet = new Spreadsheet({
    height: '60%',
    openUrl: '//localhost:64980/Home/Open',
    saveUrl: '//localhost:64980/Home/Save',
    openFailure: (args: OpenFailureArgs) => {
        alert(args.statusText);
    },
    created: (args: Event) => {
        spreadsheet.open({ file: "http://localhost:64980/Book1.xlsx" });
        
    }
});
spreadsheet.appendTo('#spreadsheet');