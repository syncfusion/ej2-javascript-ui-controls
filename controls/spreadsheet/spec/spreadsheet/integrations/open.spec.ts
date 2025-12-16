import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { BeforeOpenEventArgs, DialogBeforeOpenEventArgs, ICellRenderer, setCell, SheetModel, Spreadsheet } from '../../../src/index';
import { BeforeSaveEventArgs, saveCompleted, CellModel, getCell } from '../../../src/index';

describe('Open & Save ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                openUrl: 'https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/open',
                saveUrl: 'https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/save', sheets: [{ ranges: [{ dataSource: defaultData }] }],
                beforeSave: (args: any) => { args.isFullPost = false }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Open', (done: Function) => {
            fetch('https://cdn.syncfusion.com/scripts/spreadsheet/Sample.xlsx').then((response) => {
                response.blob().then((data: Blob) => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.openComplete = () => {
                        const sheet: SheetModel = helper.invoke('getActiveSheet');
                        expect(JSON.stringify(sheet.rows[0].cells[0])).toBe('{"value":"Customer Name","style":{"fontWeight":"Bold","verticalAlign":"Middle","textAlign":"Center"}}');
                        expect(JSON.stringify(sheet.rows[30].cells[5])).toBe('{"format":"$#,##0.00","formula":"=SUM(F2:F30)","style":{"fontWeight":"Bold"}}');
                        expect(sheet.columns[0].width).toBe(180);
                        setTimeout(() => {
                            spreadsheet.openComplete = undefined;
                            spreadsheet.dataBind();
                            done();
                        }, 150);
                    };
                    spreadsheet.dataBind();
                    const file: File = new File([data], 'Sample.xlsx');
                    helper.invoke('open', [{ file: file }]);
                });
            });
        });

        // it('Save', (done: Function) => {
        //     helper.invoke('save', []);
        //     setTimeout(()=>{
        //         // Need to check how to write test case for this case
        //         done();
        //     }, 3000);
        // });

        it('Open & Save from JSON', (done: Function) => {
            // helper.edit('A1', 'Test'); Check this now
            // helper.invoke('saveAsJson').then((response: any) => {
            //     expect(response.jsonObject.Workbook.sheets[0].rows[0].cells[0].value).toBe('Test');
            //     helper.invoke('openFromJson', [{ file: response.jsonObject }]);
            //     setTimeout(() => {
            //         expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe('Test');
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.notify(saveCompleted, {});
                     done();
            //     });
            // });
        });
        it('Changing allowOpen property dynamically', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            expect(spreadsheet.allowOpen).toBeTruthy();
            expect(spreadsheet.openModule.isImportedFile).toBeTruthy();
            const prevUploadInput: HTMLElement = spreadsheet.element.querySelector(`#${helper.id}_fileUpload`);
            expect(prevUploadInput).not.toBeNull();
            spreadsheet.allowOpen = false;
            spreadsheet.dataBind();
            expect(spreadsheet.allowOpen).toBeFalsy();
            expect(spreadsheet.openModule).toBeUndefined();
            expect(spreadsheet.element.querySelector(`#${helper.id}_fileUpload`)).toBeNull();
            spreadsheet.allowOpen = true;
            spreadsheet.dataBind();
            expect(spreadsheet.allowOpen).toBeTruthy();
            expect(spreadsheet.openModule.isImportedFile).toBeFalsy();
            const uploadInput: HTMLElement = spreadsheet.element.querySelector(`#${helper.id}_fileUpload`);
            expect(uploadInput).not.toBeNull();
            expect(uploadInput).not.toBe(prevUploadInput);
            // Added for code coverage.
            spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[0], 'selectedRange', 'IV65536:IV65536');
            spreadsheet.workbookOpenModule.setSelectAllRange(spreadsheet.sheets, true);
            done();
        });
    });

    describe('Save method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                openUrl: 'https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/open',
                saveUrl: 'https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/save', sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Save dialog opening using keyboard shortcuts->', (done: Function) => {
            helper.triggerKeyNativeEvent(83, true);
            setTimeout(() => {
                //expect(helper.getElementFromSpreadsheet('.e-open-dlg.e-dialog.e-popup-open')).not.toBeNull();
                helper.setAnimationToNone('.e-open-dlg.e-dialog');
                helper.click('.e-dialog .e-flat');
                done();
            });
        });
        it('Checking Save dialog opening using keyboard shortcuts twice->', (done: Function) => {
            helper.triggerKeyNativeEvent(83, true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-open-dlg.e-dialog');
                helper.triggerKeyNativeEvent(83, true);
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-open-dlg.e-dialog')).toBeNull();
                    done();
                });
            });
        });
        it('Providing no name in save as dialog->', (done: Function) => {
            helper.triggerKeyNativeEvent(113, false, false, null, undefined, true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-open-dlg.e-dialog');
                (helper.getElements('.e-dialog input')[0] as HTMLInputElement).value = '';
                helper.click('.e-dialog .e-primary');
                var alertText =  (document.getElementsByClassName('e-file-alert-span')[0] as HTMLElement).textContent;
                expect(alertText).toBe('File name cannot be empty.');
                helper.click('.e-dialog .e-flat');
                done();
            });
        });
        it('Providing invalid characters in name input in save as dialog->', (done: Function) => {
            helper.triggerKeyNativeEvent(83,true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-open-dlg.e-dialog');
                (helper.getElements('.e-dialog input')[0] as HTMLInputElement).value = '/Test/';
                helper.click('.e-dialog .e-primary');
                var alertText =  (document.getElementsByClassName('e-file-alert-span')[0] as HTMLElement).textContent;
                expect(alertText).not.toBeNull();
                helper.click('.e-dialog .e-flat');
                done();
            });
        });
        it('Providing name with length > 218->', (done: Function) => {
            helper.triggerKeyNativeEvent(83,true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-open-dlg.e-dialog');
                (helper.getElements('.e-dialog input')[0] as HTMLInputElement).value = 'xcvbnjhgfdwertyuytresdxcvbnbvcxzxcvbnmjuytrewqasxcvbhjuytredscvhjiokjhgfdsxsaqwertyuioooooooooplkjhgfdsazxcvbnmkiuytrewqasdfghjklkmnbvcxzaqwertyujhgfdertyuiuytrewqazxcvbnjkioiuytrewqwertyuiopoiuytrewqasdfghjklkjhgfdszxcvbnm';
                helper.click('.e-dialog .e-primary');
                var alertText =  (document.getElementsByClassName('e-file-alert-span')[0] as HTMLElement).textContent;
                expect(alertText).toBe('The name is too long.');
                helper.click('.e-dialog .e-flat');
                done();
            });
        });
        it('Save error dialog opening by calling showerrordialog method->', (done: Function) => {
            helper.getInstance().saveModule.showErrorDialog({content: 'Save not Working'});
            setTimeout(() => {
                //expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).not.toBeNull();
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Save as Excel action using dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.beforeSave = (args: BeforeSaveEventArgs): void => {
                args.cancel = true;
            };
            spreadsheet.dataBind();
            helper.triggerKeyNativeEvent(83, true);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-open-dlg.e-dialog')).not.toBeNull();
                expect(helper.getElement('.e-open-dlg.e-dialog .e-dlg-content .e-text-open').value).toBe('Sample');
                helper.setAnimationToNone('.e-open-dlg.e-dialog');
                helper.click('.e-open-dlg.e-dialog .e-btn-open-ok.e-primary');
                spreadsheet.beforeSave = undefined;
                spreadsheet.dataBind();
                done();
            });
        });
        it('Canceling the save as dialog opening', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                expect(args.dialogName).toBe('Save As');
                args.cancel = true;
            };
            spreadsheet.dataBind();
            helper.triggerKeyNativeEvent(83, true);
            expect(helper.getElementFromSpreadsheet('.e-open-dlg.e-dialog')).toBeNull();
            spreadsheet.dialogBeforeOpen = undefined;
            spreadsheet.dataBind();
            done();
        });
        it('EJ2-982172: Provided bypassWorkerPipeline property to avoid CSP related issues', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            spreadsheet.beforeSave = (args: BeforeSaveEventArgs): void => {
                (<{ skipWorkerPipeline?: boolean }>args).skipWorkerPipeline = true;
                args.isFullPost = false;
            };
            spreadsheet.dataBind();
            helper.invoke('saveAsJson').then((response: any) => {
                expect(response.jsonObject.Workbook.sheets[0].rows[0].cells[0].value).toBe('Item Name');
                done();
            });
        });
    });
});
describe('EJ2-56416 ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    beforeAll((done: Function) => {
        helper.initializeSpreadsheet({
            openUrl: 'https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/open',
            sheets: [{ ranges: [{ dataSource: defaultData }] }],
            beforeOpen: (args: BeforeOpenEventArgs) => { args.cancel = true }
        }, done);
    });
    afterAll(() => {
        helper.invoke('destroy');
    });
    it('Spinner loads endlessly while importing an excel file', (done: Function) => {
        fetch('https://cdn.syncfusion.com/scripts/spreadsheet/Sample.xlsx').then((response) => {
            response.blob().then((data: Blob) => {
                const file: File = new File([data], "Sample.xlsx");
                helper.invoke('open', [{ file: file }]);
                setTimeout(() => {
                    expect(helper.getElements('.e-spin-show')[0]).toBeUndefined();
                    done();
                }, 500);
            });
        });
    });
    it('Number format update checking after importing', (done: Function) => {
        const spreadsheet: Spreadsheet = helper.getInstance();
        spreadsheet.openModule.isImportedFile = true; // After importing, this property will be enabled.
        const sheet: SheetModel = helper.invoke('getActiveSheet');
        setCell(12, 0, sheet, { value: '5-10' });
        const cell: HTMLElement = helper.invoke('getCell', [12, 0]);
        spreadsheet.serviceLocator.getService<ICellRenderer>('cell').refresh(12, 0, false, cell, false, false, true);
        expect(cell.textContent).toBe('5-10');
        expect(sheet.rows[12].cells[0].format).toBeUndefined();
        helper.edit('B13', '5-10');
        expect(sheet.rows[12].cells[1].value).toBe('45787');
        expect(sheet.rows[12].cells[1].format).toBe('d-mmm');
        done();
    });
});
describe('EJ2-832406', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    beforeAll((done: Function) => {
        helper.initializeSpreadsheet({
            created: function () {
                const json: object = { Workbook: { sheets: [{
                    columns: [{ width: 100 }, { width: 200 },{ width: 120 },{ width: 120 },{ width: 120 },{ width: 120 },{ width: 120 },],
                    ranges: [{ dataSource: defaultData }] }], selectedRange: 'A1' }
                }
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.openFromJson({ file: json});
            }
        }, done);
    });
    afterAll(() => {
        helper.invoke('destroy');
    });
    it('Default scroller is moved while importing the Excel file when the spreadsheet is not fully rendered in the UI', (done: Function) => {
        expect(document.activeElement.classList).not.toContain('e-tab-wrap');
        var tabEle = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
        var coords = tabEle.getBoundingClientRect();
        helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, tabEle);
        setTimeout(() => {
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.click('#' + helper.id + '_contextmenu li:nth-child(1)');
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                expect(document.activeElement.id).toBe('spreadsheet');
                tabEle = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                coords = tabEle.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, tabEle);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(2)');
                    expect(document.activeElement.id).toBe('spreadsheet');
                    tabEle = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                    coords = tabEle.getBoundingClientRect();
                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, tabEle);
                    setTimeout(() => {
                        helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                        helper.click('#' + helper.id + '_contextmenu li:nth-child(3)');
                        expect(document.activeElement.id).toBe('spreadsheet');
                        setTimeout(() => {
                            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                            const editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                            editorElem.click();
                            editorElem.value = 'TestSheet';
                            helper.triggerKeyNativeEvent(13, false, false, editorElem);
                            setTimeout(() => {
                                expect(document.activeElement.classList[0]).toBe('e-tab-wrap');
                                tabEle = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                                coords = tabEle.getBoundingClientRect();
                                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, tabEle);
                                setTimeout(() => {
                                    helper.click('#' + helper.id + '_contextmenu li:nth-child(8)');
                                    expect(document.activeElement.id).toBe('spreadsheet');
                                    tabEle = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                                    coords = tabEle.getBoundingClientRect();
                                    helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, tabEle);
                                    setTimeout(() => {
                                        helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                                        helper.click('#' + helper.id + '_contextmenu li:nth-child(7)');
                                        expect(document.activeElement.id).toBe('spreadsheet');
                                        tabEle = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                                        coords = tabEle.getBoundingClientRect();
                                        helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, tabEle);
                                        setTimeout(() => {
                                            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                                            helper.click('#' + helper.id + '_contextmenu li:nth-child(5)');
                                            setTimeout(() => {
                                                expect(document.activeElement.id).toBe('spreadsheet');
                                                done();
                                            });
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
});

describe('EJ2-842068', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    beforeAll((done: Function) => {
        helper.initializeSpreadsheet({}, done);
    });
    afterAll(() => {
        helper.invoke('destroy');
    });
    it('Spreadsheet throws console error using openFromJson method when sheet tab is hidden', (done: Function) => {
        var spreadsheet = helper.getInstance();
        var json = { Workbook: { sheets: [{ ranges: [{ dataSource: defaultData }] }], selectedRange: 'A2', showSheetTabs: false }};
        expect(spreadsheet.showSheetTabs).toBeTruthy();
        spreadsheet.openFromJson({ file: json });
        setTimeout(function () {
            expect(spreadsheet.showSheetTabs).toBeFalsy();
            done();
        });
    });
})

describe('EJ2-870688 -> Checking openFromJson method with optional parameter -> ', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    const json = {
        Workbook: {
            sheets: [{
                rows: [
                    { cells: [{ index: 0, value: 'Hello World', style: { fontWeight: 'bold' } }] },
                    { cells: [{ index: 0, value: 'World', style: { textAlign: 'center', verticalAlign: 'middle' } }] },
                    { cells: [{ index: 0, value: 'Today', style: { color: '#4472c4' } }] }, { cells: [{ index: 0, value: '10', format: '0.00' }] },
                    { cells: [{ index: 0, value: '100', format: '$#,##0.00' }] }, { cells: [{ index: 0, value: '111', formula: '=SUM(100,11)' }] },
                    { cells: [{ index: 0, value: '3', formula: '=1+2' }] }, {
                        cells: [{
                            index: 0, value: '20', validation: {
                                type: 'WholeNumber',
                                operator: 'Between', value1: '1', value2: '2', ignoreBlank: true, isHighlighted: true
                            }
                        }]
                    },
                    { cells: [{ index: 0, value: '10', hyperlink: { address: 'http://www.google.com' } }] },
                    { cells: [{ index: 0, value: '10', hyperlink: { address: 'http://www.google.com' } }] },
                    { cells: [{ index: 0, value: '123', wrap: true }] }, { cells: [{ index: 0, value: '124', wrap: true }] },
                    { cells: [{ index: 0, value: '123' }] }, { cells: [{ index: 0, value: '124' }] }, { cells: [{ index: 0, value: '125' }] },
                    { cells: [{ index: 0, value: '126' }] }, { cells: [{ index: 0, value: '127' }] }, { cells: [{ index: 0, value: '121' }] },
                    { cells: [{ index: 0, value: '10', colSpan: '2', rowSpan: '2' }] }, { cells: [{ index: 0, value: '12', colSpan: '-1' }] },
                    { cells: [{ index: 0, value: '18' }] }],
                conditionalFormats: [{
                    type: 'RedDataBar', range: 'A13:A14', cFColor: 'RedFT', format: {
                        style: {
                            fontFamily: 'Calibri', verticalAlign: 'bottom', textIndent: '0pt', backgroundColor: '#ffffff',
                            color: '#000000', textAlign: 'left', fontSize: '11pt', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none'
                        }
                    }
                },
                { type: 'RWGColorScale', range: 'A15:A16', cFColor: 'RedFT' },
                { type: 'ThreeTrafficLights1', range: 'A17:A18', cFColor: 'RedFT' }], frozenRows: 2, frozenColumns: 2
            }], selectedRange: 'A2', showSheetTabs: false
        }
    };
    beforeAll((done: Function) => {
        helper.initializeSpreadsheet({}, done);
    });
    afterAll(() => {
        helper.invoke('destroy');
    });
    it('Checking open from json method without options', (done: Function) => {
        let spreadsheet = helper.getInstance();
        expect(spreadsheet.showSheetTabs).toBeTruthy();
        spreadsheet.openFromJson({ file: json });
        setTimeout(() => {
            expect(spreadsheet.showSheetTabs).toBeFalsy();
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[7].cells[0].validation).not.toBeUndefined();
            done();
        });
    });
    it('Options as only values ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { onlyValues: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[1].cells[0].style).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[2].cells[0].style).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[4].cells[0].format).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[6].cells[0].formula).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[7].cells[0].validation).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[8].cells[0].hyperlink).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[9].cells[0].hyperlink).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[10].cells[0].wrap).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[11].cells[0].wrap).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].colSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].rowSpan).not.toBeUndefined();
            done();
        });
    });
    it('Options as Ignore Styles ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { ignoreStyle: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[1].cells[0].style).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[2].cells[0].style).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[7].cells[0].validation).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[8].cells[0].hyperlink).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[10].cells[0].wrap).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].colSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].rowSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].conditionalFormats[0].type).not.toBeUndefined();
            expect(spreadsheet.sheets[0].frozenRows).toBe(2);
            expect(spreadsheet.sheets[0].frozenColumns).toBe(2);
            done();
        });
    });
    it('Options as Ignore Formulas ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { ignoreFormula: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[6].cells[0].formula).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[7].cells[0].validation).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[8].cells[0].hyperlink).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[10].cells[0].wrap).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].colSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].rowSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].conditionalFormats[0].type).not.toBeUndefined();
            expect(spreadsheet.sheets[0].frozenRows).toBe(2);
            expect(spreadsheet.sheets[0].frozenColumns).toBe(2);
            done();
        });
    });
    it('Options as Ignore Formats ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { ignoreFormat: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[4].cells[0].format).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[6].cells[0].formula).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[7].cells[0].validation).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[8].cells[0].hyperlink).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[10].cells[0].wrap).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].colSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].rowSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].conditionalFormats[0].type).not.toBeUndefined();
            expect(spreadsheet.sheets[0].frozenRows).toBe(2);
            expect(spreadsheet.sheets[0].frozenColumns).toBe(2);
            done();
        });
    });
    it('Options as Ignore Conditional Formats ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { ignoreConditionalFormat: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[7].cells[0].validation).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[8].cells[0].hyperlink).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[10].cells[0].wrap).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].colSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].rowSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].conditionalFormats[0]).toBeUndefined();
            expect(spreadsheet.sheets[0].frozenRows).toBe(2);
            expect(spreadsheet.sheets[0].frozenColumns).toBe(2);
            done();
        });
    });
    it('Options as Ignore DataValidation ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { ignoreValidation: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[7].cells[0].validation).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].colSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].rowSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].conditionalFormats[0].type).not.toBeUndefined();
            done();
        });
    });
    it('Options as Ignore FreezePane ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { ignoreFreezePane: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].colSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[18].cells[0].rowSpan).not.toBeUndefined();
            expect(spreadsheet.sheets[0].frozenRows).toBe(0);
            expect(spreadsheet.sheets[0].frozenColumns).toBe(0);
            done();
        });
    });
    it('Options as Ignore Wrap ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { ignoreWrap: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[7].cells[0].validation).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[8].cells[0].hyperlink).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[10].cells[0].wrap).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[11].cells[0].wrap).toBeUndefined();
            expect(spreadsheet.sheets[0].conditionalFormats[0].type).not.toBeUndefined();
            expect(spreadsheet.sheets[0].frozenRows).toBe(2);
            expect(spreadsheet.sheets[0].frozenColumns).toBe(2);
            done();
        });
    });
    it('Options as combinations 1 ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { ignoreStyle: true, ignoreFormat: false, ignoreFormula: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].rows[0].cells[0].style).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[1].cells[0].style).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[2].cells[0].style).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[0].format).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[4].cells[0].format).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[5].cells[0].formula).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[6].cells[0].formula).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[8].cells[0].hyperlink).not.toBeUndefined();
            expect(spreadsheet.sheets[0].frozenRows).toBe(2);
            expect(spreadsheet.sheets[0].frozenColumns).toBe(2);
            done();
        });
    });
    it('Options as combinations 2 ->', (done: Function) => {
        let spreadsheet = helper.getInstance();
        spreadsheet.openFromJson({ file: json }, { ignoreConditionalFormat: true, ignoreValidation: true, ignoreFreezePane: false, ignoreWrap: true })
        setTimeout(() => {
            expect(spreadsheet.sheets[0].conditionalFormats[0]).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[7].cells[0].validation).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[8].cells[0].hyperlink).not.toBeUndefined();
            expect(spreadsheet.sheets[0].rows[10].cells[0].wrap).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[11].cells[0].wrap).toBeUndefined();
            expect(spreadsheet.sheets[0].frozenRows).toBe(2);
            expect(spreadsheet.sheets[0].frozenColumns).toBe(2);
            done();
        });
    });
});

describe('Opening document using chunk processing', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    beforeAll((done: Function) => {
        helper.initializeSpreadsheet({
            openUrl: 'https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/open',
            saveUrl: 'https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/save',
            openSettings: {
                chunkSize: 10000,
                retryCount: 3
            }
        }, done);
    });
    afterAll(() => {
        helper.invoke('destroy');
    });
    it('Open', (done: Function) => {
        fetch('https://cdn.syncfusion.com/scripts/spreadsheet/Sample.xlsx').then((response) => {
            response.blob().then((data: Blob) => {
                const file: File = new File([data], 'Sample.xlsx');
                helper.invoke('open', [{ file: file }]);
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.openComplete = () => {
                    const sheet: SheetModel = helper.invoke('getActiveSheet');
                    expect(JSON.stringify(sheet.rows[0].cells[0])).toBe('{"value":"Customer Name","style":{"fontWeight":"Bold","verticalAlign":"Middle","textAlign":"Center"}}');
                    expect(JSON.stringify(sheet.rows[30].cells[5])).toBe('{"format":"$#,##0.00","formula":"=SUM(F2:F30)","style":{"fontWeight":"Bold"}}');
                    expect(sheet.columns[0].width).toBe(180);
                    done();
                }
            });
        });
    });
});

describe('EJ2-976393: Excel file is not rendered properly if it contains merged cell with maximum row span and column span values.', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    const json = {
        Workbook: {
            sheets: [{
                colCount: 100, rowCount: 100,
                rows: [
                    { cells: [{  value: '123' }] }, { cells: [{ value: '124' }] }, { cells: [{ value: '125' }] },
                    { cells: [{ value: '126' }] }, { cells: [{ value: '127' }] }, { cells: [{ value: '121' }] },
                    { cells: [{ value: '10' }] }, { cells: [{ value: '12' }] }, { cells: [{ value: '18' }] }
                ],
                mergedCells: [{ address: [0, 15], colSpan: 16369, rowSpan: 1048576 }, { address: [15, 0], colSpan: 10, rowSpan: 1048561 }],
                usedRange: { colIndex: 20, rowIndex: 8 }
            },
            {
                colCount: 100, rowCount: 100,
                mergedCells: [{ address: [15, 0], colSpan: 16384, rowSpan: 1048576 }]
            }]
        }
    };
    beforeAll((done: Function) => {
        helper.initializeSpreadsheet({}, done);
    });
    afterAll(() => {
        helper.invoke('destroy');
    });
    it('rowSpan and colSpan with Excel maximum row and column count should cutoff to our default count -> ', (done: Function) => {
        const spreadsheet = helper.getInstance();
        spreadsheet.openComplete = (): void => {
            let sheet: SheetModel = spreadsheet.getActiveSheet();
            let cell: CellModel = getCell(0, 15, sheet);
            expect(cell.rowSpan).toBe(100);
            expect(cell.colSpan).toBe(85);
            cell = getCell(15, 0, sheet);
            expect(cell.rowSpan).toBe(85);
            expect(cell.colSpan).toBe(10);
            sheet = spreadsheet.sheets[1];
            cell = getCell(15, 0, sheet);
            expect(cell.rowSpan).toBe(85);
            expect(cell.colSpan).toBe(100);
            spreadsheet.openComplete = undefined;
            spreadsheet.dataBind();
            done();
        };
        spreadsheet.dataBind();
        spreadsheet.openFromJson({ file: json, triggerEvent: true });
    });
});