import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet, dialog } from '../../../src/index';
import { Dialog } from '../../../src/spreadsheet/services/index';


describe('Conditional formatting ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('API Checking ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{
                conditionalFormats: [
                  { type: "ContainsText", cFColor: "RedFT", value:'shoes', range: 'A2:A11' },
                  { type: "DateOccur", cFColor: "YellowFT", value:'7/22/2014', range: 'B2:B11' },
                  { type: "GreaterThan", cFColor: "GreenFT", value:'11:26:32 AM', range: 'C2:C11' },
                  { type: "LessThan", cFColor: "RedF", value:'20', range: 'D2:D11' },
                ],
                ranges: [{
                    dataSource: defaultData
                }],
            }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            let td: HTMLElement = helper.invoke('getCell', [1, 0]);
            expect(td.style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(td.style.color).toBe('rgb(156, 0, 85)');
            td = helper.invoke('getCell', [4, 0]);
            expect(td.style.backgroundColor).toBe('');
            expect(td.style.color).toBe('');
            done();
        });
    });

    describe('Public Method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{
                ranges: [{
                    dataSource: defaultData
                }],
            }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: "RYGColorScale", range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(250, 157, 117)');
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(248, 105, 107)');
            expect(helper.invoke('getCell', [4, 4]).style.backgroundColor).toBe('rgb(250, 157, 117)');
            expect(helper.invoke('getCell', [5, 4]).style.backgroundColor).toBe('rgb(223, 226, 130)');
            helper.edit('E2', '10');
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 235, 132)');
            helper.invoke('clearConditionalFormat', ['E2:E11']);
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 255, 255)');

            helper.invoke('conditionalFormat', [{ type: "GreaterThan", cFColor: 'RedFT', value: '300', range: 'F2:F11' }]);
            expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 5]).style.color).toBe('rgb(156, 0, 85)');

            helper.invoke('conditionalFormat', [{ type: 'Top10Items', value: '1', format: { style: { color: '#ffffff', backgroundColor: '#009999', fontStyle: 'italic', textDecoration: 'line-through', fontWeight: 'bold'}}, range: 'G2:G11' }]);
            expect(helper.invoke('getCell', [6, 6]).style.backgroundColor).toBe('rgb(0, 153, 153)');
            expect(helper.invoke('getCell', [6, 6]).style.color).toBe('rgb(255, 255, 255)');
            expect(helper.invoke('getCell', [6, 6]).style.fontWeight).toBe('bold');

            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H2:H11' }]);
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('7%');
            expect(helper.invoke('getCell', [1, 7]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [9, 7]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');

            helper.invoke('conditionalFormat', [{ type: 'Bottom10Percentage', range: 'H2:H11', value: "30" }]);
            expect(helper.invoke('getCell', [1, 7]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 7]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 7]).style.backgroundColor).toBe('');

            helper.invoke('conditionalFormat', [{ type: 'ThreeArrows', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [1, 3]).children[0].classList).toContain('e-3arrows-3');
            expect(helper.invoke('getCell', [5, 3]).children[0].classList).toContain('e-3arrows-2');
            expect(helper.invoke('getCell', [6, 3]).children[0].classList).toContain('e-3arrows-1');

            helper.invoke('conditionalFormat', [{ type: 'Top10Percentage', cFColor: 'GreenFT', range: 'B2:B11', value: "15" }]);
            expect(helper.invoke('getCell', [4, 1]).style.backgroundColor).toBe('rgb(198, 239, 206)');
            expect(helper.invoke('getCell', [4, 1]).style.color).toBe('rgb(0, 97, 0)');
            expect(helper.invoke('getCell', [8, 1]).style.backgroundColor).toBe('rgb(198, 239, 206)');

            helper.invoke('clearConditionalFormat', ['B2:B11']);
            helper.invoke('conditionalFormat', [{ type: 'BelowAverage', range: 'B2:B11' }]);
            expect(helper.invoke('getCell', [1, 1]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 1]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 1]).style.backgroundColor).toBe('rgb(255, 255, 255)');

            helper.invoke('conditionalFormat', [{ type: 'Duplicate', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [2, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [2, 3]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 3]).style.backgroundColor).toBe('rgb(255, 199, 206)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: 'Unique', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [4, 4]).style.color).toBe('rgb(0, 0, 0)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: 'Bottom10Percentage', range: 'E2:E11', value: "30" }]);
            expect(helper.invoke('getCell', [1, 4]).style.backgroundColor).toBe('rgb(255, 199, 206)');
            expect(helper.invoke('getCell', [1, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 255, 255)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: "Between", cFColor: 'RedT', value: '16,30', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [2, 4]).style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(helper.invoke('getCell', [2, 4]).style.color).toBe('rgb(156, 0, 85)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(0, 0, 0)');

            helper.invoke('clearConditionalFormat', ['E2:E11']);
            helper.invoke('conditionalFormat', [{ type: "EqualTo", cFColor: 'YellowFT', value: '15', range: 'E2:E11' }]);
            expect(helper.invoke('getCell', [3, 4]).style.backgroundColor).toBe('rgb(255, 235, 156)');
            expect(helper.invoke('getCell', [3, 4]).style.color).toBe('rgb(156, 101, 0)');

            helper.invoke('clear', [{ type: 'Clear All', range: 'F2:G11' }]);
            expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('');
            expect(helper.invoke('getCell', [6, 6]).style.backgroundColor).toBe('');
            done();
        });
    });
    describe('CR-Issues ->', () => {
        describe('fb22057, FB24222, FB23945 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ cellStyle: { color: '#0000FF' }, sheets: [{ conditionalFormats: [{ type: 'ContainsText', value: '1', cFColor: 'GreenFT',
                range: 'A1:A1' }, { type: 'ContainsText', value: '2', cFColor: 'RedF', range: 'A1:A1' }, { type: 'ContainsText', value:
                '3', cFColor: 'YellowFT', range: 'A1:A1' }], rows: [{ cells:[{ index: 2, value: 'Romona Heaslip' }, { value: 'Eamon Traise' }, { value: 'Julius Gorner'}] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Conditional Formatting not properly working while more than one condition applied', (done: Function) => {
                const cell: HTMLElement = helper.invoke('getCell', [0, 0]);
                helper.invoke('updateCell', [{ value: '1' }]);
                expect(cell.classList).toContain('e-greenft');
                helper.invoke('updateCell', [{ value: '2' }]);
                expect(cell.classList).toContain('e-redf');
                helper.invoke('updateCell', [{ value: '3' }]);
                expect(cell.classList).toContain('e-yellowft');
                done();
            });

            it('Conditional Formatting font color changed to default color', (done: Function) => {
                helper.invoke('addDataValidation', [{ type: "List", operator: "Between", value1: "a,b,c" }, 'B1']);
                helper.invoke('conditionalFormat', [{ type: "ContainsText", cFColor: "YellowFT", value: "a", range: "B1" }]);
                helper.invoke('selectRange', ['B1']);
                const td: HTMLElement = helper.invoke('getCell', [0, 1]);
                (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                setTimeout(() => {
                    helper.click('.e-ddl.e-popup li:nth-child(1)');
                    expect(helper.invoke('getCell', [0, 1]).style.color).toBe('rgb(156, 101, 0)');
                    (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                    setTimeout(() => {
                        helper.click('.e-ddl.e-popup li:nth-child(2)');
                        expect(helper.invoke('getCell', [0, 1]).style.color).toBe('rgb(0, 0, 255)');
                        done();
                    });
                });
            });

            it('Conditional Formatting does not work when range is selected from right to left', (done: Function) => {
                helper.invoke('selectRange', ['E1:C1'])
                helper.invoke('conditionalFormat', [{ type: 'ContainsText', cFColor: 'RedFT', value: 'Ju' }]);
                expect(helper.invoke('getCell', [0, 4]).classList).toContain('e-redft');
                expect(helper.getInstance().sheets[0].conditionalFormats[4].range).toBe('C1:E1');
                done();
            });
        });
        describe('I304843 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            // it('Conditional Formatting not properly working while more than one condition applied', (done: Function) => {
            //     const spreadsheet: Spreadsheet = helper.getInstance();
            //     spreadsheet.openFromJson({ file: { "Workbook": { "sheets": [{ "conditionalFormats": [{ "format": { "style": { "backgroundColor": "#FFFF00" } },
            //         "range": "H7:BP40", "value": "IF(COUNT(H7)<1,NOT(ISBLANK(H7)),FALSE),", "type": "GreaterThan", "cFColor": "RedFT" }],
            //         "protectSettings": { "selectCells": true, "formatCells": false, "insertLink": false, "formatColumns": false, "formatRows": false },
            //         "isProtected": true, "name": "CA55", "rowCount": 240, "selectedRange": "A4:A6", "usedRange": { "rowIndex": 239, "colIndex": 68 }, "activeCell": "A4",
            //         "rows": [{ "cells": [{ "index": 3, "isLocked": true, "colSpan": 7,
            //             "style": { "fontFamily": "Arial", "backgroundColor": "#FFC000", "fontSize": "12pt", "fontWeight": "Bold", "textAlign": "Center", "verticalAlign": "Middle" },
            //             "value": "Please ensure date entered on the STL is the same as the visit date entered in EDC." }], "height": 71 },
            //         { "index": 3, "cells": [{ "rowSpan": 3, "value": "Initials" }, { "rowSpan": 3, "value": "Subject Number" },
            //         { "rowSpan": 3, "value": "Source of Subject Referral\n(Please select from list)" },
            //         { "rowSpan": 3, "value": "Date Consent Signed" }, { "rowSpan": 3, "value": "# of Amendments to Consent" },
            //         { "rowSpan": 3, "value": "Visit 1\nScreening" }, { "rowSpan": 3, "value": "Screening\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 2\nBaseline\n(BSV)" }, { "rowSpan": 3, "value": "Baseline\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 3 \nDay 1\nRandomization" }, { "rowSpan": 3, "value": "Day 1\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 4\n4 Weeks" }, { "rowSpan": 3, "value": "4 Weeks\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Phone Call 1" }, { "rowSpan": 3, "value": "Phone Call 2" },
            //         { "rowSpan": 3, "value": "Visit 5\n27 Weeks" }, { "rowSpan": 3, "value": "27 Weeks\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 6\n44-49 Weeks" }, { "rowSpan": 3, "value": "44-49 Weeks\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Visit 7\n52-57 Weeks" }, { "rowSpan": 3, "value": "52-57 Weeks\nUrine Preg Test" },
            //         { "rowSpan": 3, "value": "Phone Call 3\nFollow Up" }, { "rowSpan": 3, "value": "SAE" },
            //         { "rowSpan": 3, "value": "Unscheduled Visit" }, { "rowSpan": 3, "value": "Unscheduled Visit" },
            //         { "rowSpan": 3, "value": "COMMENTS" }], "height": 115 }] }] } } });
            //     setTimeout((): void => {
            //         spreadsheet.cellFormat({ fontFamily: 'Arial', fontSize: '10pt', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A2:G2');
            //         spreadsheet.cellFormat({
            //             fontFamily: 'Arial', backgroundColor: '#FFFF99', border: '1px solid #000000', fontSize: '9pt', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle'
            //         }, 'A4:Z4');
            //         spreadsheet.wrap('A4:Z4');
            //         spreadsheet.cellFormat({
            //             fontFamily: 'Arial', border: '1px solid #000000', fontSize: '9pt', fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle'
            //         }, 'A7:BQ40');
            //         spreadsheet.cellFormat({ backgroundColor: '#B8CCE4' }, 'E7:E40');
            //         spreadsheet.addDataValidation({ type: 'List', value1: '=$A$200:$A$205' }, 'E7:E40');
            //         spreadsheet.numberFormat('mm-dd-yyyy', 'F7:F40');
            //         spreadsheet.addDataValidation({ type: 'Date', value1: '5/26/2020', value2: 'TODAY()' }, 'F7:F40');
            //         spreadsheet.addDataValidation({ value1: '0', value2: '5' }, 'G7:G40');
            //         spreadsheet.numberFormat('mm-dd-yyyy', 'D7:Z40');
            //         spreadsheet.addDataValidation({ type: 'Date', value1: '5/26/2020', value2: 'TODAY()' }, 'H7:Z40');
            //         setTimeout((): void => {
            //             expect(spreadsheet.sheets[0].rows[6].cells[4].validation.type).toBe('List');
            //             expect(spreadsheet.sheets[0].rows[7].cells[5].validation.type).toBe('Date');
            //             expect(spreadsheet.sheets[0].rows[8].cells[6].validation.type).toBeUndefined();
            //             done();
            //         });
            //     });
            // });
        });
        describe('fb24298, EJ2-58351 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: '7' }] }, { cells: [{ value: '35' }] }, { cells: [{ value: '20' }] }],
                    selectedRange: 'A1:A3' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cells are getting highlighted even if no value for conditional formatting is applied', (done: Function) => {
                helper.getElement('#' + helper.id + '_conditionalformatting').click();
                const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-menu-item');
                helper.triggerMouseAction(
                    'mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document,
                    target);
                setTimeout((): void => {
                    helper.getElement('#cf_greaterthan').click();
                    setTimeout((): void => {
                        const btn: HTMLButtonElement = helper.getElement('#' + helper.id + ' .e-clearall-btn.e-btn');
                        expect(btn.disabled).toBeTruthy();
                        let input: HTMLInputElement = helper.getElement('#' + helper.id + ' .e-conditionalformatting-dlg .e-cfmain .e-input');
                        let evt: Event;
                        ['1', ''].forEach((text: string): void => {
                            input.value = text;
                            evt = document.createEvent('Event'); evt.initEvent('input', true, true); input.dispatchEvent(evt);
                            if (text === '1') {
                                expect(btn.disabled).toBeFalsy();
                            } else {
                                expect(btn.disabled).toBeTruthy();
                            }
                        });
                        (helper.getInstance().serviceLocator.getService(dialog) as Dialog).hide();
                        done();
                    });
                });
            });
            it('Conditional formatting DataBars do not have cleared after clearing content', (done: Function) => {
                helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'A1:A3' }]);
                expect(helper.invoke('getCell', [0, 0]).getElementsByClassName('e-databar')[1].style.width).toBe('20%');
                expect(helper.invoke('getCell', [1, 0]).getElementsByClassName('e-databar')[1].style.width).toBe('100%');
                expect(helper.invoke('getCell', [2, 0]).getElementsByClassName('e-databar')[1].style.width).toBe('58%');
                helper.click('#spreadsheet_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(3)');
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [1, 0]).querySelector('.e-databar')).toBeNull();
                expect(helper.invoke('getCell', [2, 0]).querySelector('.e-databar')).toBeNull();
                done();
            });
        });

        describe('F171297 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    {
                        sheets: [{
                            rows: [{ cells: [{ value: '444' }, { formula: '=SUM(A1,A2)' }, { formula: '=SUM(B1,B2)' }, { formula: '=SUM(C1,C2)' }] },
                            { cells: [{ value: '555' }, { formula: '=A2+A3' }, { formula: '=B2+B3' }, { formula: '=C2+C3' }] },
                            { cells: [{ value: '666' }, { value: '777' }, { value: '2109' }, { value: '4329' }] }
                            ],
                            conditionalFormats: [
                                { range: 'A1:A3', value: '444,', type: 'GreaterThan', cFColor: 'RedFT' },
                                { type: 'GYRColorScale', range: 'B1:B3', cFColor: 'RedFT', value: '' },
                                { type: 'LightBlueDataBar', range: 'C1:C3', cFColor: 'RedFT', value: '' },
                                { type: 'ThreeArrows', range: 'D1:D3', cFColor: 'RedFT', value: '' }
                            ]
                        },
                        ]
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Importing excel having CF with formulas throws script error', (done: Function) => {
                expect(helper.invoke('getCell', [1, 0]).classList).toContain('e-redft');
                expect(helper.invoke('getCell', [0, 1]).style.backgroundColor).toContain('rgb(99, 190, 123)');
                expect(helper.invoke('getCell', [0, 2]).querySelector('.e-databar')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 3]).querySelector('.e-3arrows-3')).not.toBeNull();
                done();
            });
        });
        describe('SF-364570 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: [] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Conditional formatting is not working after vol 4 release', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.dataSourceChanged = (): void => {
                    spreadsheet.conditionalFormat({ type: 'GWRColorScale', range: 'D3:H5' });
                    expect(helper.invoke('getCell', [2, 3]).style.backgroundColor).toBe('rgb(244, 250, 246)');
                    setTimeout((): void => {
                        expect(helper.invoke('getCell', [2, 3]).style.backgroundColor).toBe('rgb(244, 250, 246)');
                        expect(helper.invoke('getCell', [2, 5]).style.backgroundColor).toBe('rgb(99, 190, 123)');
                        expect(helper.invoke('getCell', [3, 6]).style.backgroundColor).toBe('rgb(249, 145, 146)');
                        expect(helper.invoke('getCell', [4, 7]).style.backgroundColor).toBe('rgb(161, 216, 175)');
                        done();
                    });
                };
                spreadsheet.sheets[0].ranges = [{ dataSource: defaultData }];
                spreadsheet.dataBind();
            });
        });
    });
});