import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet, SpreadsheetModel, SheetModel, DialogBeforeOpenEventArgs, HyperlinkModel } from '../../../src/index';

describe('Find & Replace ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {}] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Replace', (done: Function) => {
            helper.invoke('replace', [{ replaceValue: '150', replaceBy: 'replace', value: 10 }]);
            expect(helper.getInstance().sheets[0].rows[1].cells[3].value).toBe(150);
            expect(helper.invoke('getCell', [1, 3]).textContent).toBe('150');
            expect(helper.getInstance().sheets[0].rows[1].cells[7].value).toBe(10); // this case should not do replace all
            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('10');

            helper.invoke('replace', [{ replaceValue: '150', replaceBy: 'replaceall', value: 10 }]);
            setTimeout((): void => {
                expect(helper.getInstance().sheets[0].rows[1].cells[7].value).toBe(150);
                expect(helper.invoke('getCell', [1, 7]).textContent).toBe('150');
                expect(helper.getInstance().sheets[0].rows[10].cells[4].value).toBe(150);
                expect(helper.invoke('getCell', [10, 4]).textContent).toBe('150');
                done();
            }, 50);
        });

        it('Find all', (done: Function) => {
            const values: string[] = helper.invoke('findAll', ['Shoes', null, null, null, 0]);
            expect(values.length).toBe(5);
            expect(values[0]).toBe('Sheet1!A2');
            expect(values[4]).toBe('Sheet1!A10');
            done();
        });

        it('Goto', (done: Function) => {
            // Go to next sheet
            helper.invoke('goTo', ['Sheet2!K30']);
            expect(helper.getInstance().sheets[1].selectedRange).toBe('K30');
            done();
        });

        it('Trigger openComplete event for openFromJson method', (done: Function) => {
            const json: any = { "Workbook": { "sheets": [{ "name": "Car Sales Report", "rows": [{ "cells": [{ "value": "Color" }, { "value": "Payment Mode" }] },
                { "cells": [{ "value": "Aquamarine" }, { "value": "Debit Card" }] }, { "cells": [{ "value": "Blue" }, { "value": "Net Banking" }] },
                { "cells": [{ "value": "Aquamarine" }, { "value": "Credit Card" }] }, { "cells": [{ "value": "Aquamarine" }, { "value": "Credit Card" }] }] }] } };
            const spreadsheet: Spreadsheet = helper.getInstance();
            const openComplete: any = spreadsheet.openComplete;
            spreadsheet.openComplete = (args: any): void => {
                expect(args.response.isOpenFromJson).toBeTruthy();
                expect(args.response.eventArgs.jsonObject).toBe(JSON.stringify(json));
                spreadsheet.openComplete = openComplete;
                done();
            };
            helper.invoke('openFromJson', [{ file: json, triggerEvent: true }]);
        });

        it('Open find tool dialog using find method', (done: Function) => {
            const findOption: any = { value: 'Aquamarine', sheetIndex: 0, findOpt: 'next', mode: 'Sheet', isCSen: false, isEMatch: false,
                searchBy: 'By Row', showDialog: true };
            const sheetPanel: HTMLElement = helper.getElementFromSpreadsheet('.e-sheet-panel');
            expect(sheetPanel.style.position).toBe('');
            helper.invoke('find', [findOption]);
            const spreadsheet: any = helper.getInstance();
            const sheet: SheetModel = spreadsheet.sheets[0];
            expect(sheet.selectedRange).toBe('A2:A2');
            const findToolDlg: HTMLElement = helper.getElementFromSpreadsheet('.e-findtool-dlg');
            expect(findToolDlg.classList.contains('e-popup-open')).toBeTruthy();
            const findInput: HTMLInputElement = <HTMLInputElement>findToolDlg.querySelector('.e-text-findNext-short');
            expect(findInput.value).toBe('Aquamarine');
            const findCount: Element = findToolDlg.querySelector('.e-find-toolbar .e-input-group-icon');
            expect(findCount.textContent).toBe('1 of 3');
            const findPrevIcon: Element = findToolDlg.querySelector('.e-findRib-prev');
            expect(findPrevIcon.classList.contains('e-overlay')).toBeFalsy();
            const findNextIcon: Element = findToolDlg.querySelector('.e-findRib-next');
            expect(findNextIcon.classList.contains('e-overlay')).toBeFalsy();
            expect(document.activeElement).toBe(findInput);
            expect(sheetPanel.style.position).toBe('relative'); 
            findOption.value = 'Credit Card';
            helper.invoke('find', [findOption]);
            expect(sheet.selectedRange).toBe('B4:B4');
            expect(findToolDlg.classList.contains('e-popup-open')).toBeTruthy();
            expect(findInput.value).toBe('Credit Card');
            expect(findCount.textContent).toBe('1 of 2');
            expect(findPrevIcon.classList.contains('e-overlay')).toBeFalsy();
            expect(findNextIcon.classList.contains('e-overlay')).toBeFalsy();
            findOption.value = 'Test';
            helper.invoke('find', [findOption]);
            expect(sheet.selectedRange).toBe('B4:B4');
            expect(findToolDlg.classList.contains('e-popup-open')).toBeTruthy();
            expect(findInput.value).toBe('Test');
            expect(findCount.textContent).toBe('0 of 0');
            expect(findPrevIcon.classList.contains('e-overlay')).toBeTruthy();
            expect(findNextIcon.classList.contains('e-overlay')).toBeTruthy();
            expect(spreadsheet.findAndReplaceModule.findDialog.animationSettings.effect).not.toBe('None');
            findOption.value = '';
            helper.invoke('find', [findOption]);
            expect(sheet.selectedRange).toBe('A5:A5');
            expect(findInput.value).toBe('');
            expect(findCount.textContent).toBe('0 of 0');
            expect(findPrevIcon.classList.contains('e-overlay')).toBeTruthy();
            expect(findNextIcon.classList.contains('e-overlay')).toBeTruthy();
            helper.setAnimationToNone('.e-findtool-dlg');
            helper.triggerKeyNativeEvent(70, true);
            expect(helper.getElementFromSpreadsheet('.e-findtool-dlg')).toBeNull();
            expect(sheetPanel.style.position).toBe(''); 
            done();
        });
        it ('Replace using cell value instead of the formatted cell', (done: Function) => {
            helper.invoke('updateCell', [{ value: '78.98767', format: '$#,##0.00' }, 'E4']);
            const sheet: SheetModel = helper.getInstance().sheets[0];
            const cell: any = sheet.rows[3].cells[4];
            expect(cell.value).toBe(78.98767);
            const cellEle: HTMLElement = helper.invoke('getCell', [3, 4]);
            expect(cellEle.textContent).toBe('$78.99');
            helper.invoke('replace', [{ replaceValue: '100.5', replaceBy: 'replace', value: '78.98767' }]);
            expect(cell.value).toBe(100.5);
            expect(cellEle.textContent).toBe('$100.50');
            expect(sheet.selectedRange).toBe('E4:E4');
            helper.invoke('replace', [{ replaceValue: '120', replaceBy: 'replace', value: '100.25' }]);
            expect(sheet.selectedRange).toBe('E4:E4');
            done();
        });
        it ('Finding hyperlink applied cells', (done: Function) => {
            helper.invoke('addHyperlink', [{ address: 'https://ej2.syncfusion.com/' }, 'F1']);
            const sheet: SheetModel = helper.getInstance().sheets[0];
            expect((sheet.rows[0].cells[5].hyperlink as HyperlinkModel).address).toBe('https://ej2.syncfusion.com/');
            helper.invoke('addHyperlink', [{ address: '' }, 'F2']);
            expect((sheet.rows[1].cells[5].hyperlink as HyperlinkModel).address).toBe('');
            helper.invoke('addHyperlink', ['https://www.syncfusion.com', 'F3']);
            expect(sheet.rows[2].cells[5].hyperlink).toBe('https://www.syncfusion.com');
            expect(sheet.selectedRange).toBe('E4:E4');
            helper.invoke('find', [{ value: 'syncfusion', findOpt: 'next', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('F1:F1');
            helper.invoke('find', [{ value: 'syncfusion', findOpt: 'next', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('F3:F3');
            helper.invoke('find', [{ value: 'ej2.syncfusion', findOpt: 'prev', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('F1:F1');
            helper.invoke('find', [{ value: 'ej2.syncfusion', findOpt: 'prev', mode: 'Sheet', searchBy: 'By Row' }]);
            expect(sheet.selectedRange).toBe('F1:F1');
            done();
        });
    });

    describe('UI - Interaction for find Next->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { rows: [{ index:1, cells: [{ index:1, value: '10' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Active Cell from below Used Range Row', (done: Function) => {
            helper.invoke('selectRange', ['A12']);
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
                findTxtBox.value = '10';
                helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
                helper.click('.e-findtool-dlg .e-findRib-next');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D2:D2');
                done();
            });
        });
        it('Maintaining Focus inside the Find tool dialog on tab key', (done: Function) => {
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
            findTxtBox.focus();
            // expect(document.activeElement.classList.contains('e-text-findNext-short')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, true, null, 'keydown', false, findTxtBox);
            // expect(document.activeElement.classList.contains('e-tbar-btn')).toBeTruthy();
            // expect(document.activeElement.parentElement.classList.contains('e-findRib-close')).toBeTruthy();
            helper.triggerKeyNativeEvent(9, false, false, null, 'keydown', false, document.activeElement);
            // expect(document.activeElement.classList.contains('e-findtool-dlg')).toBeTruthy();
            done();
        });
        it('Active Cell from after Used Range Column', (done: Function) => {
            helper.invoke('selectRange', ['I11']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
            findTxtBox.value = '10';
            helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
            helper.click('.e-findtool-dlg .e-findRib-next');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('D2:D2');
            done();
        });
        it('Active Cell from below Used Range Row and after Used Range Column', (done: Function) => {
            helper.invoke('selectRange', ['J12']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
            findTxtBox.value = '10';
            helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
            helper.click('.e-findtool-dlg .e-findRib-next');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('D2:D2');
            helper.click('.e-findtool-dlg .e-findRib-more');
            setTimeout(() => {
                helper.getElement().querySelectorAll('.e-sheet-tab .e-toolbar-item')[1].click();
                done();
            })
        });
        it('Apply Find Next in Find Dialog by using searchby Rows with in workbook', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            setTimeout(() => {
                helper.setAnimationToNone('.e-find-dlg.e-dialog');
                let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
                target.ej2_instances[0].value = 'Workbook';
                target.ej2_instances[0].dataBind();
                setTimeout(() => {
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = '10';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    setTimeout(() => {
                        helper.click('.e-find-dlg .e-btn-findNext');
                        setTimeout(() => {
                            expect(helper.getInstance().sheets[0].selectedRange).toBe('D2:D2');
                            done();
                        },20);
                    },20);
                });
            });
        });
        it('Apply Find Next in Find Dialog by using searchby Columns with in Sheet', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const dropDownList: any = helper.getElementFromSpreadsheet('.e-find-dlg .e-findnreplace-searchby');
            dropDownList.ej2_instances[0].value = 'By Column';
            dropDownList.ej2_instances[0].dataBind();
            setTimeout(() => {
                helper.click('.e-find-dlg .e-btn-findNext');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B11:B11');
                done();
            });
        });
        it('Apply Find Next in Find Dialog by using searchby Columns in last used Range Row Index', (done: Function) => {
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('C7:C7');
            helper.getElement().querySelectorAll('.e-sheet-tab .e-toolbar-item')[1].click();
            done();
        });
        it('Apply Find Next in Find Dialog by using searchby Columns with in workbook', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            helper.click('.e-find-dlg .e-btn-findNext');
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B11:B11');
                done();
            });
        });
        it('Apply Find Next in Find Dialog by using searchby Columns in Last used Range Column', (done: Function) => {
            helper.invoke('selectRange', ['H10']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = '166';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            setTimeout(() => {
                helper.click('.e-find-dlg .e-btn-findNext');
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('H10:H10');
                    done();
                });
            });
        });
        it('Apply Find Next in Find Dialog by using searchby Columns in Last used Range Column in active shet', (done: Function) => {
            helper.invoke('selectRange', ['H10']);
            let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
            target.ej2_instances[0].value = 'Sheet';
            target.ej2_instances[0].dataBind();
            setTimeout(() => {
                helper.click('.e-find-dlg .e-btn-findNext');
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('H10:H10');
                    done();
                });
            });
        });
        it('Apply Find Next in Find Dialog by using searchby Columns in Last used Range Column in active shet', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.click('.e-find-dlg .e-findnreplace-checkcase');
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = '100';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
            expect(helper.getElementFromSpreadsheet('.e-find-alert-span').textContent).toBe("We couldn't find what you were looking for.");
            helper.invoke('selectRange', ['A2']);
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');
            expect(helper.getElementFromSpreadsheet('.e-find-alert-span').textContent).toBe("We couldn't find what you were looking for.");
            done();
        });
        it('Apply Find Next in Find Dialog by match case option', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = 'Item Name';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            const dropDownList: any = helper.getElementFromSpreadsheet('.e-find-dlg .e-findnreplace-searchby');
            dropDownList.ej2_instances[0].value = 'By Row';
            dropDownList.ej2_instances[0].dataBind();
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
            findTxtBox.value = 'Date';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('B1:B1');
            done();
        });
        it('Apply Find Next in Find Dialog by match case and match entire cell Content option', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.click('.e-find-dlg .e-findnreplace-checkmatch');
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = 'Item Name';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
            findTxtBox.value = 'Date';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('B1:B1');
            done();
        });
    });

    describe('UI - Interaction for find Previous->', () => { 
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { rows: [{ index:1, cells: [{ index:1, value: '10' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Active Cell from below Used Range Row', (done: Function) => {
            helper.invoke('selectRange', ['H12']);
            helper.triggerKeyNativeEvent(116, false, true);
            setTimeout(() => {
                const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
                findTxtBox.value = '10';
                helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
                helper.click('.e-findtool-dlg .e-findRib-prev');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('E11:E11');
                done();
            });
        });
        it('Active Cell from after Used Range Column', (done: Function) => {
            helper.invoke('selectRange', ['I11']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
            findTxtBox.value = '10';
            helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
            helper.click('.e-findtool-dlg .e-findRib-prev');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('F10:F10');
            done();
        });
        it('Active Cell from below Used Range Row and after Used Range Column', (done: Function) => {
            helper.invoke('selectRange', ['J12']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
            findTxtBox.value = '10';
            helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
            helper.click('.e-findtool-dlg .e-findRib-prev');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('E11:E11');
            done();
        });
        it('Apply Find Previous in Find Dialog by using searchby Rows with in workbook', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            helper.click('.e-findtool-dlg .e-findRib-more');
            setTimeout(() => {
                helper.setAnimationToNone('.e-find-dlg.e-dialog');
                let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
                target.ej2_instances[0].value = 'Workbook';
                target.ej2_instances[0].dataBind();
                setTimeout(() => {
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = '10';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    setTimeout(() => {
                        helper.click('.e-find-dlg .e-btn-findPrevious');
                        setTimeout(() => {
                            expect(helper.getInstance().sheets[1].selectedRange).toBe('B2:B2');
                            done();
                        });
                    });
                });
            });
        });
        it('Apply Find Previous in Find Dialog within sheet by selecting Workbook', (done: Function) => {
            helper.getElement().querySelectorAll('.e-sheet-tab .e-toolbar-item')[0].click();
            setTimeout(() => {
                helper.invoke('selectRange', ['A1']);
                const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                findTxtBox.value = 'Item Name';
                helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                setTimeout(() => {
                    helper.click('.e-find-dlg .e-btn-findPrevious');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                    done();
                });
            });
        });
        it('Apply Find Previous in Find Dialog within workbook in selected cell', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
            target.ej2_instances[0].value = 'Sheet';
            target.ej2_instances[0].dataBind();
            setTimeout(() => {
                helper.click('.e-find-dlg .e-btn-findPrevious');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Apply Find Previous in Find Dialog by search columns within sheet', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const dropDownList: any = helper.getElementFromSpreadsheet('.e-find-dlg .e-findnreplace-searchby');
            dropDownList.ej2_instances[0].value = 'By Column';
            dropDownList.ej2_instances[0].dataBind();
            setTimeout(() => {
                helper.click('.e-find-dlg .e-btn-findPrevious');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Apply Find Previous in Find Dialog by search columns within sheet by selecting within workbook', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
            target.ej2_instances[0].value = 'Workbook';
            target.ej2_instances[0].dataBind();
            setTimeout(() => {
                helper.click('.e-find-dlg .e-btn-findPrevious');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Apply Find Previous in Find Dialog by search columns to navigate to another sheet', (done: Function) => {
            helper.invoke('selectRange', ['D2']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = '10';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            helper.click('.e-find-dlg .e-btn-findPrevious');
            setTimeout(() => {
                expect(helper.getInstance().sheets[1].selectedRange).toBe('B2:B2');
                done();
            });
        });
        it('Apply Find Previous in Find Dialog by match case', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = '10';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
            target.ej2_instances[0].value = 'Sheet';
            target.ej2_instances[0].dataBind();
            helper.click('.e-find-dlg .e-findnreplace-checkcase');
            helper.click('.e-find-dlg .e-btn-findPrevious');
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H2:H2');
                done();
            });
        });
        it('Apply Find Previous in Find Dialog by match entire cell contetnts', (done: Function) => {
            helper.click('.e-find-dlg .e-findnreplace-checkcase');
            helper.click('.e-find-dlg .e-findnreplace-checkmatch');
            helper.click('.e-find-dlg .e-btn-findPrevious');
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('G6:G6');
                done();
            });
        });
        it('Apply Find Previous in Find Dialog by match case and match entire cell contetnts', (done: Function) => {
            helper.click('.e-find-dlg .e-findnreplace-checkcase');
            helper.click('.e-find-dlg .e-btn-findPrevious');
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('E11:E11');
                done();
            });
        });
        it('Apply Find Previous in Find Dialog by match case and Match entire cell contents in Last used Range', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = '55';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            helper.click('.e-find-dlg .e-btn-findPrevious');
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H11:H11');
                done();
            });
        });
    });

    describe('UI - Interaction for Replace & Replace all with other options->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { rows: [{ index:1, cells: [{ index:1, value: 'Test' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Replace all by match entire cell contents', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.edit('I1','Test')
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                helper.click('.e-findtool-dlg .e-findRib-more');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-find-dlg.e-dialog');
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = 'Test';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
                    replaceTxtBox.value = 'Tested';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
                    let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
                    target.ej2_instances[0].value = 'Workbook';
                    target.ej2_instances[0].dataBind();
                    setTimeout(() => {
                        helper.click('.e-find-dlg .e-findnreplace-checkmatch');
                        helper.click('.e-find-dlg .e-btn-replaceAll');
                        setTimeout(() => {
                            expect(helper.getElementFromSpreadsheet('.e-replace-alert-span').textContent).toBe("0 matches replaced with Tested");
                            done();
                        });
                    });
                });
            });
        });
        it('Replace all by match case and match entire cell contents', (done: Function) => {
            helper.click('.e-find-dlg .e-findnreplace-checkcase');
            helper.click('.e-find-dlg .e-btn-replaceAll');
            setTimeout(() => {
                expect(helper.getInstance().sheets[1].rows[1].cells[1].value).toBe('Tested');
                expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('Tested');
                expect(helper.getElementFromSpreadsheet('.e-replace-alert-span').textContent).toBe("2 matches replaced with Tested");
                done();
            }, 20);
        });
        it('Replace all by match case', (done: Function) => {
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = 'Tested';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
            replaceTxtBox.value = 'Test';                    
            helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
            setTimeout(() => {
                helper.click('.e-find-dlg .e-findnreplace-checkmatch');
                helper.click('.e-find-dlg .e-btn-replaceAll');
                setTimeout(() => {
                    // expect(helper.getInstance().sheets[1].rows[1].cells[1].value).toBe('Test');
                    // expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('Test');
                    expect(helper.getElementFromSpreadsheet('.e-replace-alert-span').textContent).toBe("2 matches replaced with Test");
                    done();
                }, 10);
            }); 
        });
        it('Replace by match case', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.setAnimationToNone('.e-find-dlg.e-dialog');
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = 'Test';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
            replaceTxtBox.value = 'Tested';
            helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
            setTimeout(() => {
                helper.click('.e-find-dlg .e-btn-replace');
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('Tested');
                    done();
                }, 10);
            });
        });
        it('Replace by match case and match entire cell contents', (done: Function) => {
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = 'Tested';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
            replaceTxtBox.value = 'Test';                    
            helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
            setTimeout(() => {
                helper.click('.e-find-dlg .e-findnreplace-checkmatch');
                helper.click('.e-find-dlg .e-btn-replace');
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('Test');
                    done()
                }, 10);
            });
        });
        it('Replace all by match entire cell contents', (done: Function) => {
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = 'Test';
            helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
            const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
            replaceTxtBox.value = 'Tested';                    
            helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
            setTimeout(() => {
                helper.click('.e-find-dlg .e-findnreplace-checkcase');
                helper.click('.e-find-dlg .e-btn-replace');
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe('Tested');
                    done();
                }, 10);
            });
        });
    });

    describe('UI - Interaction canceling dialog open->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Add and remove values in textbox', (done: Function) => {
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                helper.click('.e-findtool-dlg .e-findRib-more');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-find-dlg.e-dialog');
                    expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findPrevious') as HTMLInputElement).disabled).toBeTruthy();
                    expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findNext') as HTMLInputElement).disabled).toBeTruthy();
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = '10';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    setTimeout(() => {
                        expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findPrevious') as HTMLInputElement).disabled).toBeFalsy();
                        expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findNext') as HTMLInputElement).disabled).toBeFalsy();
                        findTxtBox.value = '';
                        helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                        setTimeout(() => {
                            expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findPrevious') as HTMLInputElement).disabled).toBeTruthy();
                            expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findNext') as HTMLInputElement).disabled).toBeTruthy();
                            helper.click('.e-find-dlg .e-dlg-closeicon-btn');
                            setTimeout(() => {
                                expect(helper.getElementFromSpreadsheet('.e-find-dlg.e-dialog')).toBeNull(); 
                                done();
                            }, 20);
                        });
                    });
                });
            });
        });
        it('Remove goto alert', (done: Function) => {
            helper.triggerKeyNativeEvent(71, true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-goto-dlg.e-dialog');
                helper.click('.e-goto-dlg .e-btn-goto-ok'); // Check this now
                expect(helper.getElementFromSpreadsheet('.e-goto-alert-span').textContent).toBe('Reference value is not valid.');
                helper.click('.e-goto-dlg .e-btn-goto-ok');
                expect(helper.getElementFromSpreadsheet('.e-goto-alert-span').textContent).toBe('Reference value is not valid.');
                helper.click('.e-goto-dlg .e-dlg-closeicon-btn');
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-goto-dlg.e-dialog')).toBeNull(); 
                     done();
                });
            });
        });
        it('Cancel opening find dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                args.cancel = true;
            };
            helper.triggerKeyNativeEvent(71, true);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-goto-dlg.e-dialog')).not.toBeNull(); 
                done();
            });
        });
        it('Cancel opening find dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                args.cancel = true;
            };
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                helper.click('.e-findtool-dlg .e-findRib-more');
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-find-dlg.e-dialog')).not.toBeNull(); 
                    done();
                });
            });
        });
    });
    
    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ index: 11, cells:
                [{ index: 6, value: 'Total Amount:' }, { formula: '=G12' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Find in tool dialog', (done: Function) => {
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                const findToolDlg: HTMLElement = helper.getElement('.e-findtool-dlg');
                expect(findToolDlg.style.top).toBe(`${helper.invoke('getColumnHeaderContent').parentElement.offsetHeight + 1}px`);
                expect(findToolDlg.style.left).toBe('');
                expect(findToolDlg.style.right).not.toBe('');
                const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
                findTxtBox.value = 'Loafers';
                helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
                helper.click('.e-findtool-dlg .e-findRib-next');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A9:A9');
                helper.click('.e-findtool-dlg .e-findRib-next');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A9:A9');
                findTxtBox.value = '6/23/2014';
                helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
                expect(findTxtBox.nextElementSibling.textContent).toBe('0 of 1');
                helper.click('.e-findtool-dlg .e-findRib-next');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B6:B6');
                helper.click('.e-findtool-dlg .e-findRib-prev');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B6:B6');
                findTxtBox.value = '20';
                helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
                expect(findTxtBox.nextElementSibling.textContent).toBe('10 of 18');
                helper.click('.e-findtool-dlg .e-findRib-next');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B7:B7');
                expect(findTxtBox.nextElementSibling.textContent).toBe('11 of 18');
                helper.click('.e-findtool-dlg .e-findRib-next');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('E7:E7');
                helper.click('.e-findtool-dlg .e-findRib-prev');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B7:B7');
                done();
            });
        });

        it('Find in dialog', (done: Function) => {
            setTimeout(() => {
                helper.click('.e-findtool-dlg .e-findRib-more');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-find-dlg.e-dialog');
                    expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findPrevious') as HTMLInputElement).disabled).toBeTruthy();
                    expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findNext') as HTMLInputElement).disabled).toBeTruthy();
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = '10';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    setTimeout(() => {
                        expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findPrevious') as HTMLInputElement).disabled).toBeFalsy();
                        expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findNext') as HTMLInputElement).disabled).toBeFalsy();
                        helper.click('.e-find-dlg .e-btn-findPrevious');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('G6:G6');
                        helper.click('.e-find-dlg .e-btn-findPrevious');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('E6:E6');
                        helper.click('.e-find-dlg .e-btn-findNext');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('G6:G6');
                        helper.click('.e-find-dlg .e-btn-findNext');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('C7:C7');
                        findTxtBox.value = 'T-Shirts';
                        helper.click('.e-find-dlg .e-btn-findNext');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('A11:A11');
                        helper.click('.e-find-dlg .e-btn-findNext');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('A11:A11');
                        findTxtBox.value = '6:23:54 AM';
                        helper.click('.e-find-dlg .e-btn-findNext');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('C5:C5');
                        findTxtBox.value = '50';
                        helper.click('.e-find-dlg .e-btn-findNext');
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('D11:D11');

                        const dialog: any = helper.getElementFromSpreadsheet('.e-find-dlg.e-dialog');
                        findTxtBox.focus();
                        // Find next by pressing enter key
                        dialog.ej2_instances[0].keyDown({ preventDefault: function () { }, target: findTxtBox, keyCode: 13 });
                        setTimeout(() => {
                            // expect(helper.getInstance().sheets[0].selectedRange).toBe('F11:F11'); // This case need to be fixed
                            // Find previous by pressing shift + enter key
                            findTxtBox.focus();
                            dialog.ej2_instances[0].keyDown({ preventDefault: function () { }, target: findTxtBox, keyCode: 13, shiftKey: true });
                            setTimeout(() => {
                                // expect(helper.getInstance().sheets[0].selectedRange).toBe('D11:D11'); // This case need to be fixed
                                helper.invoke('selectRange', ['D11']); // Remove this when above case is fixed
                                helper.click('.e-find-dlg .e-btn-findPrevious');
                                expect(helper.getInstance().sheets[0].selectedRange).toBe('H3:H3');
                                const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
                                replaceTxtBox.value = 'Test';
                                helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
                                setTimeout(() => {
                                    // Replace
                                    helper.click('.e-find-dlg .e-btn-replace');
                                    // expect(helper.getInstance().sheets[0].rows[2].cells[7].value).toBe('Test');
                                    // expect(helper.invoke('getCell', [2, 7]).textContent).toBe('Test');
                                    // expect(helper.getInstance().sheets[0].rows[10].cells[3].value).toBe(50);

                                    // Replace all
                                    helper.click('.e-find-dlg .e-btn-replaceAll');
                                    setTimeout(() => {
                                        // expect(helper.getElementFromSpreadsheet('.e-findtool-dlg.e-dialog')).toBeNull();
                                        // expect(helper.getInstance().sheets[0].rows[10].cells[3].value).toBe('Test');
                                        // expect(helper.invoke('getCell', [10, 3]).textContent).toBe('Test');
                                        // expect(helper.getInstance().sheets[0].rows[10].cells[5].value).toBe('Test0');
                                        // expect(helper.invoke('getCell', [10, 5]).textContent).toBe('Test0');
                                        // expect(helper.getElementFromSpreadsheet('.e-replace-alert-span').textContent).toBe('2 matches replaced with Test');

                                        // Find by matching exact cell content
                                        helper.click('.e-find-dlg .e-findnreplace-checkmatch');
                                        findTxtBox.value = 'Sneakers';
                                        helper.click('.e-find-dlg .e-btn-findNext');
                                        expect(helper.getInstance().sheets[0].selectedRange).toBe('A7:A7');
                                        helper.invoke('selectRange', ['A1']);
                                        findTxtBox.value = 'Sneaker';
                                        helper.click('.e-find-dlg .e-btn-findNext');
                                        expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                                        expect(helper.getElementFromSpreadsheet('.e-find-alert-span').textContent).toBe("We couldn't find what you were looking for.");

                                        // Search by column
                                        const dropDownList: any = helper.getElementFromSpreadsheet('.e-find-dlg .e-findnreplace-searchby');
                                        dropDownList.ej2_instances[0].value = 'By Column';
                                        dropDownList.ej2_instances[0].dataBind();
                                        findTxtBox.value = '10';
                                        helper.click('.e-find-dlg .e-btn-findNext');
                                        expect(helper.getInstance().sheets[0].selectedRange).toBe('D2:D2');
                                        helper.click('.e-find-dlg .e-btn-findNext');
                                        expect(helper.getInstance().sheets[0].selectedRange).toBe('E6:E6');

                                        // Checking disabling find button when it has empty value
                                        // findTxtBox.value = ''; // Check this case
                                        // helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                                        // setTimeout(() => {
                                        //     expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findNext') as any).disabled).toBeTruthy();
                                        //     expect((helper.getElementFromSpreadsheet('.e-find-dlg .e-btn-findPrevious') as any).disabled).toBeTruthy();
                                        done();
                                        //});
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        it('Find action when the active cell greater than used range', (done: Function) => {
            helper.click('.e-find-dlg .e-findnreplace-checkmatch');
            helper.invoke('selectRange', ['I2:I2']);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
            findTxtBox.value = '10';
            helper.click('.e-find-dlg .e-btn-findNext');
            const sheet: SheetModel = helper.getInstance().sheets[0];
            expect(sheet.selectedRange).toBe('B11:B11');
            helper.invoke('selectRange', ['I2:I2']);
            helper.click('.e-find-dlg .e-btn-findPrevious');
            expect(sheet.selectedRange).toBe('H2:H2');
            helper.invoke('selectRange', ['E12:E12']);
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(sheet.selectedRange).toBe('F9:F9');
            helper.invoke('selectRange', ['E13:E13']);
            helper.click('.e-find-dlg .e-btn-findPrevious');
            expect(sheet.selectedRange).toBe('D2:D2');
            helper.invoke('selectRange', ['I13:I13']);
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(sheet.selectedRange).toBe('B11:B11');
            helper.invoke('selectRange', ['I13:I13']);
            helper.click('.e-find-dlg .e-btn-findPrevious');
            expect(sheet.selectedRange).toBe('H2:H2');
            const dropDownList: any = helper.getElementFromSpreadsheet('.e-find-dlg .e-findnreplace-searchby');
            dropDownList.ej2_instances[0].value = 'By Row';
            dropDownList.ej2_instances[0].dataBind();
            helper.invoke('selectRange', ['I3:I3']);
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(sheet.selectedRange).toBe('E6:E6');
            helper.invoke('selectRange', ['I3:I3']);
            helper.click('.e-find-dlg .e-btn-findPrevious');
            expect(sheet.selectedRange).toBe('H2:H2');
            helper.invoke('selectRange', ['E13:E13']);
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(sheet.selectedRange).toBe('D2:D2');
            helper.invoke('selectRange', ['E13:E13']);
            helper.click('.e-find-dlg .e-btn-findPrevious');
            expect(sheet.selectedRange).toBe('E11:E11');
            helper.invoke('selectRange', ['J13:J13']);
            findTxtBox.value = 'www';
            helper.click('.e-find-dlg .e-btn-findNext');
            expect(sheet.selectedRange).toBe('J13:J13');
            expect(helper.getElementFromSpreadsheet('.e-find-dlg .e-find-alert-span').textContent).toBe("We couldn't find what you were looking for.");
            helper.click('.e-find-dlg .e-btn-findPrevious');
            helper.invoke('selectRange', ['J13:J13']);
            expect(helper.getElementFromSpreadsheet('.e-find-dlg .e-find-alert-span').textContent).toBe("We couldn't find what you were looking for.");
            helper.click('.e-find-dlg .e-dlg-closeicon-btn');
            setTimeout(() => {
                // expect(helper.getElementFromSpreadsheet('.e-find-dlg.e-dialog')).toBeNull(); // Check this now
                done();
            }, 20);
        });

        // it('Find by MatchCase', (done: Function) => {
        //     helper.triggerKeyEvent('keydown', 72, null, true, null);
        //     setTimeout(() => {
        //         const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
        //         // Find by match case
        //         helper.click('.e-find-dlg .e-findnreplace-checkcase');
        //         findTxtBox.value = 'ca';
        //         helper.triggerKeyEvent('keydown', 67);
        //         helper.click('.e-find-dlg .e-btn-findNext');
        //         expect(helper.getInstance().sheets[0].selectedRange).toBe('E6:E6');
        //         setTimeout(() => {
        //             expect(helper.getElementFromSpreadsheet('.e-find-alert-span').textContent).toBe("We couldn't find what you were looking for.");
        //             helper.click('.e-find-dlg .e-dlg-closeicon-btn');
        //             done();
        //         });
        //     });
        // });
        it('GoTo', (done: Function) => {
            helper.triggerKeyNativeEvent(71, true);
            setTimeout(() => {
                helper.setAnimationToNone('.e-goto-dlg.e-dialog');
                const goToText: HTMLInputElement = helper.getElementFromSpreadsheet('.e-goto-dlg .e-text-goto') as HTMLInputElement;
                helper.click('.e-goto-dlg .e-btn-goto-ok'); // Check this now
                expect(helper.getElementFromSpreadsheet('.e-goto-alert-span').textContent).toBe('Reference value is not valid.');
                goToText.value = 'H10';
                helper.click('.e-goto-dlg .e-btn-goto-ok');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('H10:H10');
                expect(helper.getElementFromSpreadsheet('.e-goto-dlg.e-dialog')).toBeNull(); // Need to check this
                done();
            });
        });
    });
    describe('CR-Issues ->', () => {
        describe('I298335 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Fix search issues (Find details checking 0 of 5)', (done: Function) => {
                helper.triggerKeyNativeEvent(70, true);
                setTimeout((): void => {
                    const findEditor: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-text-findNext-short');
                    findEditor.value = 'ShOe';
                    findEditor.focus();
                    helper.triggerKeyNativeEvent(88, false, false, findEditor, 'keyup');
                    expect(findEditor.nextElementSibling.textContent).toBe('0 of 5');
                    helper.triggerKeyNativeEvent(13, false, false, findEditor, 'keyup');
                    expect(findEditor.nextElementSibling.textContent).toBe('1 of 5');
                    helper.triggerKeyNativeEvent(13, false, false, findEditor, 'keyup');
                    expect(findEditor.nextElementSibling.textContent).toBe('2 of 5');
                    helper.triggerKeyNativeEvent(13, false, false, findEditor, 'keyup');
                    expect(findEditor.nextElementSibling.textContent).toBe('3 of 5');
                    helper.getElement('#' + helper.id + ' .e-findtool-dlg .e-findRib-close').click();
                    setTimeout((): void => {
                        done();
                    });
                });
            });
        });
    });
    describe('CR-Issues ->', () => {
        describe('EJ2-57069 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Editing state cell value is updated while selecting the find next button', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.startEdit();
                setTimeout((): void => {
                    spreadsheet.find(
                        { value: '10', sheetIndex: 0, findOpt: 'next', mode: 'Sheet', isCSen: false, isEMatch: false, searchBy: 'By Row' });
                    setTimeout((): void => {
                        expect((spreadsheet.getCell(0,0) as any).innerText).toBe('Item Name');
                        done();
                    });
                });
            });
        });
        describe('EJ2-49854->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{columns: [{ width: 350 }, { width: 350 }, { width: 350 }, { width: 350 } ],
                        rows: [{cells: [{ value: 'Denial Rationale'}] },
                        {cells: [{ }] },{ cells: [{ }] },{ cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.' }] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate.Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate.Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ }] },{ cells: [{ }] },{cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ }] },{cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'We are glad to announce that our weekly patch release We are glad to announce that our weekly patch release'}] },
                        {cells: [{ value: 'We are glad to announce that our weekly patch release We are glad to announce that our weekly patch release'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'We are glad to announce that our weekly patch release We are glad to announce that our weekly patch release'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                        {cells: [{ value: 'Moutain Apply, Environment to the Nature or Climate or .Good for health.'}] },
                    ] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Searching in spreadsheet need to scroll horizontally when values not in visible area', (done: Function) => {
                helper.click('#' + helper.id + '_findbtn');
                setTimeout(() => {
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
                    findTxtBox.value = 'Moutain';
                    helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A4:A4');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A5:A5');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A9:A9');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A12:A12');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A15:A15');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A16:A16');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A18:A18');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A21:A21');
                    helper.click('.e-findtool-dlg .e-findRib-next');
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].selectedRange).toBe('A22:A22');
                        done();
                    });
                });
            });
        });
        describe('EJ2-51507, EJ2-61517, EJ2-55821 ->', () => {
            const model: SpreadsheetModel = { sheets: [{  ranges: [{ dataSource: defaultData }] }] };
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet( model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Destroyed the find dialog while destroying the spreadsheet component', (done: Function) => {
                helper.click('#' + helper.id + '_findbtn');
                setTimeout(() => {
                    helper.click('.e-findtool-dlg .e-findRib-more');
                    setTimeout(() => {
                        helper.invoke('destroy');
                        new Spreadsheet(model, '#' + helper.id);
                        setTimeout(() => {
                            expect(helper.getElementFromSpreadsheet('.e-find-dlg.e-dialog')).toBeNull();
                            done();
                        });
                    });
                });
            });
            it('Find & replace text not updated in its dialog', (done: Function) => {
                helper.click('#' + helper.id + '_findbtn');
                setTimeout(() => {
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
                    findTxtBox.value = 'Test';
                    helper.click('.e-findtool-dlg .e-findRib-more');
                    setTimeout(() => {
                        const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                        expect(findTxtBox.value).toBe('Test');
                        helper.setAnimationToNone('.e-find-dlg.e-dialog');
                        helper.click('.e-find-dlg .e-dlg-closeicon-btn');
                        done();
                    });
                });
            });
            it('EJ2-55821 - Need to fix the cancel event args not working for beforeReplace action in spreadsheet->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'beforeReplace') {  
                        args.args.eventArgs.cancel = true; }
                }
                helper.invoke('selectRange', ['A2']);
                helper.click('#' + helper.id + '_findbtn');
                setTimeout(() => {
                    helper.click('.e-findtool-dlg .e-findRib-more');
                    setTimeout(() => {
                        const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                        findTxtBox.value = 'Casual Shoes';
                        helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                        setTimeout(() => {
                            const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
                            replaceTxtBox.value = 'Test';
                            helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
                            setTimeout(() => {
                                helper.click('.e-find-dlg .e-btn-replace');
                                helper.setAnimationToNone('.e-find-dlg.e-dialog');
                                helper.click('.e-find-dlg .e-dlg-closeicon-btn');
                                expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe('Casual Shoes');
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('EJ2-869788 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Handled infinite looping when using findAll() method in a single sheet', (done: Function) => {
                setTimeout((): void => {
                    const singleSheetValues: string[] = helper.invoke('findAll', ['10', "Workbook", false, true]);
                    setTimeout((): void => {
                        expect(singleSheetValues.length).toBe(7);
                        expect(singleSheetValues[0]).toBe("Sheet1!D2");
                        expect(singleSheetValues[1]).toBe("Sheet1!H2");
                        expect(singleSheetValues[2]).toBe("Sheet1!E6");
                        expect(singleSheetValues[3]).toBe("Sheet1!G6");
                        expect(singleSheetValues[4]).toBe("Sheet1!E8");
                        expect(singleSheetValues[5]).toBe("Sheet1!E9");
                        expect(singleSheetValues[6]).toBe("Sheet1!E11");
                        done();
                    });
                });
            });
            it('Handled infinite looping when using findAll() method in a multiple sheets', (done: Function) => {
                setTimeout((): void => {
                    helper.getElement('#' + helper.id + ' .e-add-sheet-tab').click();
                    setTimeout((): void => {
                        helper.getInstance().goTo('Sheet2!A1');
                        setTimeout((): void => {
                            helper.edit('A1', '10');
                            helper.edit('B2', '10');
                            helper.edit('C3', '10');
                            helper.getInstance().goTo('Sheet1!A1');
                            setTimeout((): void => {
                                const multipleSheetValues: string[] = helper.invoke('findAll', ['10', "Workbook", false, true]);
                                setTimeout((): void => {
                                    expect(multipleSheetValues.length).toBe(10);
                                    expect(multipleSheetValues[0]).toBe("Sheet1!D2");
                                    expect(multipleSheetValues[1]).toBe("Sheet1!H2");
                                    expect(multipleSheetValues[2]).toBe("Sheet1!E6");
                                    expect(multipleSheetValues[3]).toBe("Sheet1!G6");
                                    expect(multipleSheetValues[4]).toBe("Sheet1!E8");
                                    expect(multipleSheetValues[5]).toBe("Sheet1!E9");
                                    expect(multipleSheetValues[6]).toBe("Sheet1!E11");
                                    expect(multipleSheetValues[7]).toBe("Sheet2!A1");
                                    expect(multipleSheetValues[8]).toBe("Sheet2!B2");
                                    expect(multipleSheetValues[9]).toBe("Sheet2!C3");
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('EJ2-875231 ->', () => {
            beforeAll(function (done) {
                helper.initializeSpreadsheet({
                    sheets: [
                        {
                            rows: [
                                { cells: [{ value: 'the test Value' }] }, { cells: [{ value: 'Test value' }] }, { cells: [{ value: '10Test Value!' }] }, { cells: [{ value: '10Test Value10' }] }, { cells: [{ value: 'Test Value' }] }
                            ]
                        },
                        {
                            rows: [
                                { cells: [{ value: 'The Test Value' }] }, { cells: [{ value: 'TeSt vAlue' }] }, { cells: [{ value: 'TeST VaLUE!' }] }, { cells: [{ value: 'test ValuE10' }] }, { cells: [{ value: 'Test VALUE@' }] }
                            ]
                        }
                    ]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('When find value contains uppercase letters case sensitive is set false and entire cell is set true', (done: Function) => {
                let findAllArray: string[] = helper.invoke('findAll', ['Test Value', 'Workbook', false, true]);
                setTimeout(() => {
                    expect(findAllArray.length).toBe(3);
                    expect(findAllArray[0]).toBe('Sheet1!A2');
                    expect(findAllArray[1]).toBe('Sheet1!A5');
                    expect(findAllArray[2]).toBe('Sheet2!A2');
                    findAllArray = helper.invoke('findAll', ['Test Value', 'Sheet', false, true]);
                    setTimeout(() => {
                        expect(findAllArray.length).toBe(2);
                        expect(findAllArray[0]).toBe('Sheet1!A2');
                        expect(findAllArray[1]).toBe('Sheet1!A5');
                        done();
                    });
                });
            });
            it('When find value contains uppercase letters case sensitive is set false and entire cell is set false', (done: Function) => {
                let findAllArray: string[] = helper.invoke('findAll', ['Test Value', 'Workbook', false, false]);
                setTimeout(() => {
                    expect(findAllArray.length).toBe(10);
                    expect(findAllArray[0]).toBe('Sheet1!A1');
                    expect(findAllArray[1]).toBe('Sheet1!A2');
                    expect(findAllArray[2]).toBe('Sheet1!A3');
                    expect(findAllArray[3]).toBe('Sheet1!A4');
                    expect(findAllArray[4]).toBe('Sheet1!A5');
                    expect(findAllArray[5]).toBe('Sheet2!A1');
                    expect(findAllArray[6]).toBe('Sheet2!A2');
                    expect(findAllArray[7]).toBe('Sheet2!A3');
                    expect(findAllArray[8]).toBe('Sheet2!A4');
                    expect(findAllArray[9]).toBe('Sheet2!A5');
                    findAllArray = helper.invoke('findAll', ['Test Value', 'Sheet', false, false]);
                    setTimeout(() => {
                        expect(findAllArray.length).toBe(5);
                        expect(findAllArray[0]).toBe('Sheet1!A1');
                        expect(findAllArray[1]).toBe('Sheet1!A2');
                        expect(findAllArray[2]).toBe('Sheet1!A3');
                        expect(findAllArray[3]).toBe('Sheet1!A4');
                        expect(findAllArray[4]).toBe('Sheet1!A5');
                        done();
                    })
                });
            });
            it('When find value contains uppercase letters case sensitive is set true and entire cell is set true', (done: Function) => {
                let findAllArray: string[] = helper.invoke('findAll', ['Test Value', 'Workbook', true, true]);
                setTimeout(() => {
                    expect(findAllArray.length).toBe(1);
                    expect(findAllArray[0]).toBe('Sheet1!A5');
                    findAllArray = helper.invoke('findAll', ['Test Value', 'Sheet', true, true]);
                    setTimeout(() => {
                        expect(findAllArray.length).toBe(1);
                        expect(findAllArray[0]).toBe('Sheet1!A5');
                        done();
                    });
                });
            });
            it('When find value contains uppercase letters case sensitive is set true and entire cell is set false', (done: Function) => {
                let findAllArray: string[] = helper.invoke('findAll', ['Test Value', 'Workbook', true, false]);
                setTimeout(() => {
                    expect(findAllArray.length).toBe(4);
                    expect(findAllArray[0]).toBe('Sheet1!A3');
                    expect(findAllArray[1]).toBe('Sheet1!A4');
                    expect(findAllArray[2]).toBe('Sheet1!A5');
                    expect(findAllArray[3]).toBe('Sheet2!A1');
                    findAllArray = helper.invoke('findAll', ['Test Value', 'Sheet', true, false]);
                    setTimeout(() => {
                        expect(findAllArray.length).toBe(3);
                        expect(findAllArray[0]).toBe('Sheet1!A3');
                        expect(findAllArray[1]).toBe('Sheet1!A4');
                        expect(findAllArray[2]).toBe('Sheet1!A5');
                        done();
                    });
                });
            });
        });
    });
    
    describe('Checking find button in protect sheet->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {}] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Find in protect sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Sheet1', { selectCells: false, formatRows: true, formatColumns: true, formatCells: true });
            setTimeout(() => {
                helper.click('#' + helper.id + '_findbtn');
                setTimeout(() => {
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
                    findTxtBox.value = '20';
                    helper.triggerKeyNativeEvent(88, false, false, findTxtBox, 'keyup');
                    expect(helper.getInstance().activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
        it('Find in protect sheet by row', (done: Function) => {
            const findOption: any = {
                value: '20', sheetIndex: 0, findOpt: 'next', mode: 'Sheet', isCSen: false, isEMatch: false,
                searchBy: 'By Row', showDialog: true
            };
            helper.invoke('find', [findOption]);
            const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
            helper.triggerKeyNativeEvent(13, false, true, findTxtBox, 'keyup');
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Find in protect sheet with goto sheets', (done: Function) => {
            helper.setModel('enableRtl', true);
            const findOption: any = {
                value: '20', sheetIndex: 0, findOpt: 'next', mode: 'Sheet', isCSen: false, isEMatch: false,
                searchBy: 'By Row', showDialog: true
            };
            helper.invoke('find', [findOption]);
            const args = { action: 'gotoSheet', eventArgs: { currentSheetIndex: 1, previousSheetIndex: 0 } };
            helper.getInstance().updateAction(args);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toEqual(1);
                done();
            });
        });
        it('Find in protect sheet by row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Sheet1', { selectCells: false, formatRows: true, formatColumns: true, formatCells: true });
            setTimeout(() => {
                const findOption: any = {
                    value: '20', sheetIndex: 0, findOpt: 'next', mode: 'Sheet', isCSen: false, isEMatch: false,
                    searchBy: 'By Row', showDialog: true
                };
                helper.invoke('find', [findOption]);
                const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-findtool-dlg .e-text-findNext-short') as HTMLInputElement;
                helper.triggerKeyNativeEvent(13, false, true, findTxtBox, 'keyup');
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
    });
});
