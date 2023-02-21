import { SpreadsheetModel, CellRenderEventArgs, Spreadsheet, CellEditEventArgs, CellSaveEventArgs, onContentScroll } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel, SheetModel, getCell } from '../../../src/index';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { EventHandler } from '@syncfusion/ej2-base';

/**
 *  Editing test cases
 */
describe('Editing ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    describe('Checking updated edited value ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [{
                        index: 1,
                        cells: [
                            { index: 9, formula: '=D2' },
                            { index: 11, formula: '=J2' },
                            { index: 13, formula: '=L2' },
                            { index: 15, formula: '=N2' },
                        ]
                    }]
                }]
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Check multiple cell dependency', (done: Function) => {
            setTimeout(() => {
                helper.invoke('getData', ['Sheet1!A1:Q11']).then((values: Map<string, CellModel>) => {
                    expect(values.get('D2').value.toString()).toEqual('10');
                    expect(values.get('J2').value.toString()).toEqual('10');
                    expect(values.get('L2').value.toString()).toEqual('10');
                    expect(values.get('N2').value.toString()).toEqual('10');
                    done();
                });
            }, 20);
        });
    });

    describe('UI interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{
                        dataSource: defaultData, template: '<button class="e-button-template">BUTTON</button>',
                        address: 'G10'
                    }]
                }],
                beforeCellRender: (evt: CellRenderEventArgs) => {
                    if (evt.element.children.length) {
                        let template: string = evt.element.children[0].className;
                        switch (template) {
                            case 'e-button-template':
                                new Button({
                                    content: (evt.cell && evt.cell.value) ? evt.cell.value : 'Button'
                                }, evt.element.children[0] as HTMLButtonElement);
                                break;
                        }
                    } else {
                        if (evt.rowIndex === undefined && evt.colIndex === 0) {
                            expect(evt.address).toBe('A');
                            expect(evt.cell).toBeNull();
                        }
                        if (evt.colIndex === undefined && evt.rowIndex === 2) {
                            expect(evt.address).toBe('3');
                            expect(evt.cell).toBeNull();
                        }
                    }
                    expect(evt.element.parentElement).not.toBeUndefined();
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Enter key', (done: Function) => {
            helper.invoke('startEdit');
            helper.getElement('.e-spreadsheet-edit').textContent = 'Test 1';
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe('Test 1');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');
                done();
            });
        });

        it('Editing with key', (done: Function) => {
            helper.invoke('startEdit');
            helper.triggerKeyEvent('keyup', 66);
            //helper.triggerKeyNativeEvent(66, null, null, helper.getElement('.e-spreadsheet-edit'), 'keyup');
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                //expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe('Casual Shoes2');
                done();
            });
        });

        it('Cancel Edit - ESC', (done: Function) => {
            helper.invoke('startEdit');
            helper.getElement('.e-spreadsheet-edit').textContent = 'Test 2';
            helper.triggerKeyNativeEvent(27);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[2].cells[0].value).toBe('Sports Shoes');
                done();
            });
        });

        it('Tab key', (done: Function) => {
            helper.invoke('startEdit');
            helper.getElement('.e-spreadsheet-edit').textContent = 'Test 2';
            helper.triggerKeyNativeEvent(9);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[2].cells[0].value).toBe('Test 2');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B3:B3');
                done();
            }, 10);
        });

        it('F2', (done: Function) => {
            helper.triggerKeyNativeEvent(113);
            helper.getElement('.e-spreadsheet-edit').textContent = 'Test 3';
            helper.triggerKeyNativeEvent(9, null, true); // Shift tab save
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[2].cells[1].value).toBe('Test 3');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A3:A3');
                done();
            }, 10);
        });

        it('Delete', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[0])).toBe('{}');
                done();
            }, 5);
        });

        it('Cell template', (done: Function) => {
            helper.invoke('selectRange', ['G10']);
            helper.editInUI('Test 4')
            setTimeout(() => {
                // expect(helper.getInstance().sheets[0].rows[9].cells[6].value).toBe('Test 4'); // check this
                done();
            });
        });

        it('Formula', (done: Function) => {
            helper.invoke('selectRange', ['K15'])
            helper.invoke('startEdit');
            helper.getElement('.e-spreadsheet-edit').textContent = '=SUM(H2:H11)';
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[14].cells[10])).toBe('{"value":554,"formula":"=SUM(H2:H11)"}');
                done();
            });
        });

        it('Mouse down on Formula', (done: Function) => {
            helper.invoke('selectRange', ['K15'])
            helper.invoke('startEdit');
            let coords: ClientRect = helper.getElement('.e-spreadsheet-edit').getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, null, helper.getElement('.e-spreadsheet-edit'));
            const selection: Selection = window.getSelection();
            expect(selection.focusNode.nodeName).toBe('#text');
            expect(selection.focusOffset).toBe(12);
            expect(selection.anchorOffset).toBe(12);
            const td: HTMLElement = helper.invoke('getCell', [2, 2]);
            coords = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left, y: coords.top }, document, td);
            helper.invoke('endEdit');
            done();
        });

        it('Double click to save on formula', (done: Function) => {
            helper.invoke('selectRange', ['K15']);
            helper.invoke('startEdit');
            const coords: ClientRect = helper.getElement('.e-spreadsheet-edit').getBoundingClientRect();
            helper.triggerMouseAction('dblclick', { x: coords.left, y: coords.top }, null, helper.getElement('.e-spreadsheet-edit'));
            expect(helper.invoke('getCell', [14, 10]).classList).toContain('e-ss-edited');
            expect(helper.getElement('.e-spreadsheet-edit').textContent).toBe('5:56:32 AM');
            expect(helper.getInstance().editModule.isEdit).toBeTruthy();
            helper.invoke('endEdit');
            done();
        }, 20);

        it('Alt enter', (done: Function) => {
            helper.invoke('selectRange', ['F2']);
            helper.triggerKeyNativeEvent(113);
            const editElem: HTMLElement = helper.getElement('.e-spreadsheet-edit');
            helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
            expect(editElem.textContent.split('\n').length).toBe(2);
            helper.triggerKeyNativeEvent(13);
            expect(helper.getInstance().sheets[0].rows[1].cells[5].wrap).toBeTruthy();
            done();
        });

        it('Mouse down after alt enter', (done: Function) => {
            helper.triggerKeyNativeEvent(113);
            const editElem: HTMLElement = helper.getElement('.e-spreadsheet-edit');
            helper.triggerKeyEvent('keyup', 13, null, null, null, editElem, undefined, true);
            const td: HTMLElement = helper.invoke('getCell', [2, 2]);
            const coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left, y: coords.top }, document, td);
            expect(helper.getInstance().sheets[0].rows[2].cells[5].wrap).toBeTruthy();
            done();
        });

        it('Formula reference', (done: Function) => {
            helper.invoke('selectRange', ['F4'])
            helper.invoke('startEdit');
            helper.getInstance().editModule.editCellData.value = '=sum(';
            const td: HTMLElement = helper.invoke('getCell', [3, 6]);
            const coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left, y: coords.top }, document, td);
            expect(helper.getElement('.e-spreadsheet-edit').textContent).toBe('=sum(G4')
            expect(td.classList).toContain('e-formularef-selection');
            helper.triggerKeyNativeEvent(13);
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[3].cells[5])).toBe('{"value":7,"formula":"=sum(G4)"}');
            done();
        }, 20);
    });

    describe('Rtl ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ enableRtl: true }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            let td: HTMLElement = helper.invoke('getCell', [3, 5]);
            let coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('dblclick', { x: coords.right, y: coords.top }, null, td);
            let ele: HTMLElement = helper.getElementFromSpreadsheet('.e-spreadsheet-edit');
            // expect(ele.style.top).toBe('61px');
            // expect(ele.style.right).toBe('321px');
            // expect(ele.style.height).toBe('17px');
            done();
        });
    });

    describe('Delete image, apply unique formula ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Delete image, apply unique formula ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertImage([{src:"https://www.w3schools.com/images/w3schools_green.jpg"}],"D3");
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[3].image)).toBe('[{"src":"https://www.w3schools.com/images/w3schools_green.jpg","id":"spreadsheet_overlay_picture_1","height":300,"width":400,"top":40,"left":192}]');
            EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
            helper.invoke('deleteImage', ['spreadsheet_overlay_picture_1']);
            setTimeout(() => {
            helper.edit('I3','=UNIQUE(H2:H5)');
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"10","formula":"=UNIQUE(H2:H5)"}');
                done();
            });
        },0);
        });
    });

    describe('Edit formula in formula bar and cells ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Edit formula in formula bar and cells ', (done: Function) => {
            helper.edit('I5', '=SUM(H2:H5)');
            helper.triggerKeyNativeEvent(13);
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":154,"formula":"=SUM(H2:H5)"}');
            helper.invoke('selectRange', ['I5']);
            helper.edit('I5', '=SUM(G2:G5)');
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[8])).toBe('{"value":24,"formula":"=SUM(G2:G5)"}');
                done();
            });
        });
    });
    describe('Update unique range formula ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Update unique range formula ', (done: Function) => {
            helper.edit('I3','=UNIQUE(H2:H5)')
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"10","formula":"=UNIQUE(H2:H5)"}');
            });
            setTimeout(() => {
            helper.edit('I3','=UNIQUE(H2:H10)')
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[8])).toBe('{"value":"29"}');
                done();
            });
            });
            
            
        });
    });

    describe('Editing after applying Freeze Panes->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], frozenRows: 2, frozenColumns: 2, selectedRange: 'C2'  }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Edit above Frozen Row->', (done: Function) => {
            helper.invoke('startEdit');
            const coords: ClientRect = helper.getElement('.e-spreadsheet-edit').getBoundingClientRect();
            helper.triggerMouseAction('dblclick', { x: coords.left, y: coords.top }, null, helper.getElement('.e-spreadsheet-edit'));
            helper.triggerKeyNativeEvent(13);
            done();
        });

        it('Edit below Frozen Column->', (done: Function) => {
            helper.invoke('selectRange', ['C3']);
            helper.invoke('startEdit');
            const coords: ClientRect = helper.getElement('.e-spreadsheet-edit').getBoundingClientRect();
            helper.triggerMouseAction('dblclick', { x: coords.left, y: coords.top }, null, helper.getElement('.e-spreadsheet-edit'));
            helper.triggerKeyNativeEvent(13);
            done();
        });

        it('Edit before Frozen Column->', (done: Function) => {
            helper.invoke('selectRange', ['B3']);
            helper.invoke('startEdit');
            const coords: ClientRect = helper.getElement('.e-spreadsheet-edit').getBoundingClientRect();
            helper.triggerMouseAction('dblclick', { x: coords.left, y: coords.top }, null, helper.getElement('.e-spreadsheet-edit'));
            helper.triggerKeyNativeEvent(13);
            done();
        });
    });

    describe('UI - Interaction->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'I1' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Edit Formula by adding "-"->', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.invoke('updateCell', [{ formula: '=SUM(F2:F6)' }, 'I1']);
            let td: HTMLElement = helper.invoke('getCell', [0, 8]);
            const coords: ClientRect = helper.getElement('.e-spreadsheet-edit').getBoundingClientRect();
            helper.triggerMouseAction('dblclick', { x: coords.right, y: coords.top }, null, td);
            setTimeout(() => {   
                helper.getElement('.e-spreadsheet-edit').textContent = '=SUM(F2:F6-)';
                helper.triggerKeyEvent('keyup', 189);
                helper.triggerKeyNativeEvent(13);
                setTimeout((): void => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBe(1700);
                    done();
                }, 10);
            });
        });

        it('Opening Hyperlink Dialog by Keyboard Shortcuts with Protect Sheet->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Price Details', { insertLink: true,  });
            helper.triggerKeyNativeEvent(75, true);
            setTimeout(() => {
                var dialog = helper.getElement('.e-hyperlink-dlg.e-dialog');
                expect(!!dialog).toBeTruthy();
                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(2)');
                spreadsheet.unprotectSheet();
                done();
            });
        });

        it('Delete Image->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertImage([{src:"https://www.w3schools.com/images/w3schools_green.jpg"}],"D3");
            expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[3].image)).toBe('[{"src":"https://www.w3schools.com/images/w3schools_green.jpg","id":"spreadsheet_overlay_picture_1","height":300,"width":400,"top":40,"left":192}]');
            EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
            setTimeout(() => {
                const Image: HTMLElement = helper.getElement().querySelector('.e-ss-overlay');
                helper.triggerMouseAction( 'mousedown', { x: Image.getBoundingClientRect().left, y: Image.getBoundingClientRect().top }, Image, Image);
                helper.triggerMouseAction( 'mouseup', { x: Image.getBoundingClientRect().left, y: Image.getBoundingClientRect().top }, document, Image);
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('#' + helper.id + '_overlay_picture_1')).toBeNull();
                    done();
                });
            });
        });

        it('Delete Chart->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'D1:E5' }]]);
            EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
            setTimeout(() => {
                const Chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                helper.triggerMouseAction( 'mousedown', { x: Chart.getBoundingClientRect().left, y: Chart.getBoundingClientRect().top }, Chart, Chart);
                helper.triggerMouseAction( 'mouseup', { x: Chart.getBoundingClientRect().left, y: Chart.getBoundingClientRect().top }, document, Chart);
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('#' + helper.id + '_spreadsheet_chart_1_overlay')).toBeNull();
                    done();
                });
            });
        });

        it('Delete Unique Formula->', (done: Function) => {
            helper.invoke('selectRange', ['J1']);
            helper.invoke('updateCell', [{ formula: '=UNIQUE(E2:E10)' }, 'J1']);
            expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toBe('=UNIQUE(E2:E10)');
            expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toBe('20');
            expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBe('30');
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toBeUndefined;
                expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toBeUndefined;
                expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBeUndefined;
                done();
            });
        });

        it('Delete #SPILL Occurred Unique Formula->', (done: Function) => {
            helper.getElement('#' + helper.id + '_undo').click();
            helper.edit('J4', '1');
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toBe('=UNIQUE(E2:E10)');
                expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toBe('#SPILL!');
                expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBeUndefined;
                helper.invoke('selectRange', ['J4']);
                setTimeout(() => {
                    helper.triggerKeyNativeEvent(46);
                    expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toBe('=UNIQUE(E2:E10)');
                    expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toBe('20');
                    expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBe('30');
                    done();
                });
            });
        });

        it('Update Unique Formula Range->', (done: Function) => {
            helper.invoke('selectRange', ['J1']);
            helper.invoke('startEdit');
            helper.getElement('.e-spreadsheet-edit').textContent = '=UNIQUE(E2:E5)';
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toBe('=UNIQUE(E2:E5)');
                expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toBe('20');
                expect(helper.getInstance().sheets[0].rows[1].cells[9].value).toBe('30');
                expect(helper.getInstance().sheets[0].rows[2].cells[9].value).toBe('15');
                expect(helper.getInstance().sheets[0].rows[3].cells[9].value).toBeUndefined;
                done();
            });
        });

        it('Remove Unique Formula with Empty value->', (done: Function) => {
            helper.invoke('selectRange', ['J1']);
            helper.triggerKeyNativeEvent(32);
            setTimeout(() => {
                helper.triggerKeyNativeEvent(8);
                helper.triggerKeyNativeEvent(13);
                expect(helper.getInstance().sheets[0].rows[0].cells[9].formula).toBeUndefined;
                expect(helper.getInstance().sheets[0].rows[0].cells[9].value).toBeUndefined;
                done();
           });
        });

        it('Edit the Hyperlink applied cell->', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            helper.invoke('addHyperlink', ['www.google.com', 'H11', '55']);
            expect(helper.getInstance().sheets[0].rows[10].cells[7].value).toBe(55);
            expect(helper.getInstance().sheets[0].rows[10].cells[7].hyperlink).toBe('http://www.google.com');
            helper.triggerKeyNativeEvent(32);
            setTimeout(() => {
                helper.triggerKeyNativeEvent(13);
                expect(helper.getInstance().sheets[0].rows[10].cells[7].value).toBeUndefined;
                expect(helper.getInstance().sheets[0].rows[10].cells[7].hyperlink).toBe('http://www.google.com');
                done();
           });
        });
        
        it('Delete Formula applied cell->', (done: Function) => {
            helper.invoke('selectRange', ['I1']);
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[0].cells[8].formula).toBeUndefined;
                expect(helper.getInstance().sheets[0].rows[0].cells[8].value).toBeUndefined;
                done();
            });
        });

        it('Delete Formula applied cell->', (done: Function) => {
            helper.invoke('selectRange', ['H11']);
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[10].cells[7].value).toBeUndefined;
                expect(helper.getInstance().sheets[0].rows[10].cells[7].hyperlink).toBeUndefined;
                done();
            });
        });

        it('Delete Databar applied cell->', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'H2' }]);
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[2].cells[7].value).toBeUndefined;
                expect(helper.invoke('getCell', [2, 7]).querySelector('.e-databar')).toBeNull();
                done();
            });
        });

        it('Delete iconset applied cell->', (done: Function) => {
            helper.invoke('selectRange', ['H3']);
            helper.invoke('conditionalFormat', [{ type: 'ThreeArrows', range: 'H3' }]);
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[3].cells[7].value).toBeUndefined;
                expect(helper.invoke('getCell', [3, 7]).querySelector('e-3arrows-3')).toBeNull();
                done();
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('I309407, EJ2-60617, EJ2-6280, EJ2-628859 ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }] }], height: 1000,
                    created: (): void => {
                        helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                    }
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('curser is moving to the 4th cell when click on the second cell after entering value in first cell', (done: Function) => {
                helper.invoke('selectRange', ['A1'])
                const spreadsheet: any = helper.getInstance();
                expect(spreadsheet.sheets[0].selectedRange).toEqual('A1:A1');
                spreadsheet.editModule.startEdit();
                spreadsheet.editModule.editCellData.value = 'Customer';
                helper.triggerKeyNativeEvent(13);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].selectedRange).toEqual('A2:A2');
                    done();
                }, 10);
            });

            it('Edit dot(.) in a cell changes to NaN issue', (done: Function) => {
                helper.edit('A2', '.');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('.')
                expect(helper.getInstance().sheets[0].rows[1].cells[0].value).toBe('.');
                done();
            });
            it('Repeated character combined with the lock cells has improper behavior', (done: Function) => {
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.invoke('lockCells', ['I1:J1', false]);
                helper.edit('I1', 'text');
                expect(getCell(0, 8, sheet).value).toBe("text");
                expect(getCell(0, 9, sheet).value).not.toBe('text');
                done();
            });
            it('Formula value is not calculated properly for percentage values', (done: Function) => {
                const sheet: SheetModel = helper.invoke('getActiveSheet');
                helper.edit('A15', '=50% * 2');
                helper.edit('A16', '=2 * 50%');
                helper.edit('A17', '=50% - 1');
                helper.edit('A18', '=1 - 50%');
                expect(getCell(14, 0, sheet).value).toBe("1");
                expect(getCell(15, 0, sheet).value).toBe("1");
                expect(getCell(16, 0, sheet).value).toBe("-0.5");
                expect(getCell(17, 0, sheet).value).toBe("0.5");
                done();
            });
        });
        describe('I290629 ->', () => {
            beforeEach((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }], topLeftCell: 'A73' }], height: 1000,
                    created: (): void => {
                        helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                    }
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Editing issue occurs in edge & chrome browser from my laptop - "Script error throws while editing after scrolling"', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].topLeftCell).toEqual('A73');
                helper.edit('C90', 'Test');
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].rows[89].cells[2].value).toEqual('Test');
                    expect(helper.invoke('getCell', [89, 2]).textContent).toEqual('Test');
                    expect(helper.getElement('#' + helper.id + '_formula_input').value).toEqual('Test');
                    done();
                });
            });
        });
        describe('I282937 ->', () => {
            beforeAll((done: Function) => {
                model = {
                    sheets: [{
                        name: 'Datos de asunto', showGridLines: false, columns: [{ width: 130 }, { width: 92 }, { width: 96 }],
                        ranges: [{ template: '<input class="e-datos-asunto"/>', address: 'E5:E50' },
                                { template: '<input class="e-compartido"/>', address: 'H5:H50' },
                                { template: '<input class="e-visible"/>', address: 'I5:I50' }, { dataSource: [{ isDeleted: false }, { isDeleted: false }] }] }],
                    created: (): void => {
                        helper.getInstance().autoFit('1:100');
                    },
                    beforeCellRender: function (args) {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        if (spreadsheet.sheets[spreadsheet.activeSheetIndex].name === 'Datos de asunto') {
                            const target: HTMLElement = args.element.firstElementChild as HTMLElement;
                            if (args.element.children.length) {
                              const template = args.element.children[0].className;
                              switch (template) {
                                  case 'e-datos-asunto':
                                      const ddl_tipo_dato =  ['N - Número con decimales', 'R - Número entero', 'A - Alfanumérico', 'E - Texto Largo',
                                                                      'B - Checkbox', 'D - Documento externo', 'L - Link', 'M - Mail', 'F - Fecha',
                                                                      'H - Hora', 'Tnnn - Tabla de 1, 2 o 3 Niveles.', 'Vnnn - Tabla de 3 Niveles',
                                                                      'Innn - Tabla de 2 Niveles', 'Onnn - Tabla con cache', 'Gnnn - Tabla sin cache',
                                                                      'Snnn - Tabla de selección múltiple Simple', 'Ynnn - Tabla de selección multiple Completo',
                                                                      'P - Selector de Personas ', 'U - Selector de Asuntos', 'C - Selector de Producto '];
                                      new DropDownList({ placeholder: 'Tipo de Dato', dataSource: ddl_tipo_dato},  target );
                                      break;
                                  case 'e-compartido':
                                    const ddl_compartido =  ['S', 'N '];
                                      new DropDownList({ placeholder: 'Compartido', dataSource: ddl_compartido},  target );
                                    break;
                                  case 'e-visible':
                                    const ddl_visible=  ['S', 'N '];
                                      new DropDownList({ placeholder: 'Visible', dataSource: ddl_visible},  target );
                                    break;
                              }
                            }
                        }
                    }
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Implement CellTemplates, it does not allow me to edit the other cells', (done: Function) => {
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = 'Test 1';
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe('Test 1');
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');
                    done();
                });
            });
            it('Edit element is not showing cell value if it contains boolean value false', (done: Function) => {
                helper.invoke('startEdit');
                expect(helper.getInstance().sheets[0].rows[1].cells[0].value.toString()).toBe('false');
                expect(helper.getElement('.e-spreadsheet-edit').textContent).toBe('FALSE');
                helper.triggerKeyNativeEvent(13);
                done();
            });
        });
        describe('EJ2-63515 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: '123', index: 1 }] },  { cells: [{ value: '123', index: 1 }] }, { cells: [{ value: '123', index: 1 }] }, { cells: [{ value: '123', index: 1 }] }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Unexpected behavior when working with number format on sheet', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                helper.invoke('numberFormat', ['_(* #,##0_);_(* \\\\(#,##0\\\\);_(* \\\"-\\\"_);_(@_)', 'B1:B4']);
                helper.edit('A1', '1');
                helper.edit('A2', '2');
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('1');
                expect(helper.invoke('getCell', [1, 0]).textContent).toBe('2');
                spreadsheet.notify(onContentScroll, { scrollTop: 4000, scrollLeft: 0 });
                setTimeout(() => {
                    spreadsheet.notify(onContentScroll, { scrollTop: 0, scrollLeft: 0 });
                    setTimeout(() => {
                        helper.edit('A3', '3');
                        helper.edit('A4', '4');
                        expect(helper.invoke('getCell', [2, 0]).textContent).toBe('3');
                        expect(helper.invoke('getCell', [3, 0]).textContent).toBe('4');
                        done();
                    }, 10);
                }, 10);
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('I267737, I267730, FB21561, EJ2-56562, EJ2-60404, EJ2-68764 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    actionBegin: (args) => {
                        if (args.action === 'cellDelete') {
                            args.args.eventArgs.cancel = true;
                        }
                    }
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Serious issues with Time type of cell (Issue in Time number format)', (done: Function) => {
                helper.edit('A1', '7:00 AM');
                setTimeout((): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('0.2916666666666667');
                    expect(spreadsheet.sheets[0].rows[0].cells[0].format).toBe('h:mm AM/PM');
                    expect(helper.invoke('getCell', [0, 0]).textContent).toBe('7:00 AM');
                    helper.invoke('startEdit', []);
                    setTimeout((): void => {
                        expect(helper.getElement('#' + helper.id + '_edit').textContent).toBe('7:00:00 AM');
                        helper.invoke('endEdit', []);
                        done();
                    });
                });
            });

            it('Typing percentage value is auto formatted', (done: Function) => {
                helper.edit('B1', '25%');
                expect(helper.invoke('getCell', [0, 1]).textContent).toBe('25%');
                expect(helper.getInstance().sheets[0].rows[0].cells[1].value).toBe('0.25');
                expect(helper.getInstance().sheets[0].rows[0].cells[1].format).toBe('0%');
                helper.invoke('selectRange', ['A1']);
                helper.invoke('selectRange', ['B1']);
                expect(helper.getElementFromSpreadsheet('#' + helper.id + '_number_format').textContent).toBe('Percentage');
                done();
            });

            it('Cancelling cell delete in action begin event', (done: Function) => {
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[1].value).toBe('0.25');
                    expect(helper.invoke('getCell', [0, 1]).textContent).toBe('25%');
                    done();
                });
            });
            it('Adjacent column cells getting updated with the formula results for hidden formula cells', (done: Function) => {
                helper.invoke('numberFormat', ['General', 'A1:B1']);
                helper.edit('A1', '1');
                helper.edit('B1', '2');
                helper.edit('C1', '=A1+B1');
                helper.edit('D1', '=C1');
                helper.getInstance().hideColumn(2, 2, true);
                helper.edit('A1', '11');
                expect(helper.invoke('getCell', [0, 1]).textContent).toBe('2');
                expect(helper.getInstance().sheets[0].rows[0].cells[1].value).toBe(2);
                done();
            });
            it('When a large cell range is selected for calculation, the formula result is not updated in the cell', (done: Function) => {
                helper.invoke('selectRange', ['F1']);
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = 'Test1';
                helper.getContentElement().parentElement.scrollTop = 1000;
                helper.getContentElement().parentElement.scrollTop = 0;
                expect(helper.getInstance().editModule.isEdit).toBeTruthy();
                helper.triggerKeyNativeEvent(13);
                expect(helper.invoke('getCell', [0, 5]).textContent).toBe('Test1');
                expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toBe('Test1');
                done();
            });
        });
        describe('I301868, I301863 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ index: 1, value: '56' }, { value: '35' }, { formula: '=B1-C1' }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('number max 9 digits, at 10 or move through javascript error and unexpected auto formating on TEXT formated cell', (done: Function) => {
                helper.edit('D1', '1234567890'); // editing the cell conataining formula with number more than 9 digit.
                setTimeout((): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[0].cells[3].value.toString()).toBe('1234567890');
                    expect(spreadsheet.sheets[0].rows[0].cells[3].formula).toBe('');
                    helper.invoke('selectRange', ['A2']);
                    setTimeout((): void => {
                        helper.edit('A2', '10/10/2020'); // Updated the date format value using Edting.
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('44114');
                            expect(spreadsheet.sheets[0].rows[1].cells[0].format).toBe('mm-dd-yyyy');
                            expect(helper.invoke('getCell', [1, 0]).textContent).toBe('10/10/2020');
                            done();
                        });
                    });
                });
            });
        });
        describe('I308693 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'A1:C3' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('merge cell related issue (Merged cell edited state contains 2 values)', (done: Function) => {
                helper.invoke('merge');
                helper.invoke('startEdit');
                setTimeout((): void => {
                    expect(helper.getElement('#' +helper.id + '_edit').textContent).toBe('Item Name');
                    done();
                });
            });
        });
        describe('fb21593 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: 'text' }] }] }, {}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Style applied is getting omitted when redo the changes', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.getElement('#' + helper.id + '_underline').click();
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.textDecoration).toBe('underline');
                helper.getElement('#' + helper.id + '_line-through').click();
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.textDecoration).toBe('underline line-through');
                helper.getElement('#' + helper.id + '_undo').click();
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.textDecoration).toBe('underline');
                helper.getElement('#' + helper.id + '_undo').click();
                expect(spreadsheet.sheets[0].rows[0].cells[0].style).toBeNull();
                helper.getElement('#' + helper.id + '_redo').click();
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.textDecoration).toBe('underline');
                helper.getElement('#' + helper.id + '_redo').click();
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.textDecoration).toBe('underline line-through');
                helper.invoke('selectRange', ['A2']);
                done();
            });
            it('Style applied is getting omitted when redo the changes', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.invoke('startEdit');
                (spreadsheet as any).editModule.editCellData.value = 'edited';
                helper.getElement('#' + helper.id + ' .e-sheet-tab .e-tab-header .e-toolbar-item:nth-child(3)').click();
                setTimeout((): void => {
                    helper.getElement('#' + helper.id + ' .e-sheet-tab .e-tab-header .e-toolbar-item').click();
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('edited');
                        done();
                    });
                });
            });
        });
        describe('EJ2-58213 -> Filtering not applied properly after deleting A1 cell and script error thrown while open filer dialog', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{  ranges: [{ dataSource: defaultData }]}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Delete', (done: Function) => {
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].usedRange.rowIndex).toBe(10);
                    expect(helper.getInstance().sheets[0].usedRange.colIndex).toBe(7);
                    done();
                });
            });
        });
        describe('EJ2-55046, EJ2-54233, EJ2-56562, EJ2-49472, EJ2-55703,', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ colCount: 20, rowCount: 90, ranges: [{ dataSource: defaultData }] }],
                        scrollSettings: {enableVirtualization: false, isFinite: true }
                    }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('EJ2-55046 - script error on cell delete issues->', (done: Function) => {
                helper.invoke('selectRange', ['G1:G1000']);
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 6]).textContent).toBeUndefined;
                    done();
                });
            });

            it('EJ2-54233 - Events not triggered in uniformity when cellEdit and save action.->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let actionBeginCalled: boolean = false; let actionCompleteCalled: boolean = false;
                const actionBegin: any = spreadsheet.actionBegin;
                const actionComplete: any = spreadsheet.actionComplete;
                const cellSave: any = spreadsheet.cellSave;
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'cellSave') { actionBeginCalled = true; }
                },
                spreadsheet.actionComplete = (args: any): void => {
                    if (args.action === 'cellSave') { actionCompleteCalled = true; }
                },
                spreadsheet.cellSave = (args: CellSaveEventArgs): void => {
                    expect(args.address).toEqual('Sheet1!A1');
                    expect(args.oldValue).toBeUndefined;
                    expect(args.value as any).toEqual('CellSave');
                }
                expect(actionBeginCalled).toBeFalsy();
                expect(actionCompleteCalled).toBeFalsy();
                helper.invoke('selectRange', ['A1']);
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = 'CellSave';
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    expect(actionBeginCalled).toBeTruthy();
                    expect(actionCompleteCalled).toBeTruthy();
                    spreadsheet.actionBegin = actionBegin;
                    spreadsheet.actionComplete = actionComplete;
                    spreadsheet.cellSave = cellSave;
                    done();
                });
            });

            it('EJ2-56562 - Need to provide cancel argument in action begin for delete cell action->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'cellDelete') {  
                        args.args.eventArgs.cancel = true; }
                }
                helper.invoke('selectRange', ['B1']);
                helper.triggerKeyNativeEvent(46);
                expect(helper.invoke('getCell', [0, 1]).textContent).toBe('Date');
                done();
            });

            it('EJ2-49472 - Spreadsheet scrolls up on Enter/Tab keypress while editing the cells', (done: Function) => {
                helper.invoke('goTo', ['A85']);
                helper.edit('A85', '1');
                helper.triggerKeyNativeEvent(13);
                setTimeout(() => {
                    helper.edit('A86', '1');
                    helper.triggerKeyNativeEvent(9);
                    setTimeout(() => {
                        helper.edit('B86', '1');
                        expect(helper.getInstance().sheets[0].selectedRange).toEqual('B86:B86');
                        done();
                    });
                });
            });

            it('EJ2-55703 - Not able to change the cell value in the beforeCellSave event while saving the edited value.->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.beforeCellSave = (args: CellEditEventArgs): void => {
                    args.value = 'New value';
                }
                helper.invoke('goTo', ['A1']);
                helper.invoke('selectRange', ['A1']);
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = 'CellSave';
                helper.triggerKeyNativeEvent(13);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('New value');
                done();
            });
        });
        describe('EJ2-69340', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{  ranges: [{ dataSource: defaultData }]}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Cell reference functionality gets failed when referring in another cell using = (equal) sign', (done: Function) => {
                helper.invoke('selectRange', ['J2'])
                helper.invoke('startEdit');
                helper.getInstance().editModule.editCellData.value = '=';
                let td: HTMLElement = helper.invoke('getCell', [1, 7]);
                let coords: ClientRect = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left, y: coords.top }, document, td);
                expect(helper.getElement('.e-spreadsheet-edit').textContent).toBe('=H2');
                helper.triggerKeyNativeEvent(13);
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":"10","formula":"=H2"}');
                helper.invoke('selectRange', ['J3'])
                helper.invoke('startEdit');
                helper.getInstance().editModule.editCellData.value = '=';
                td = helper.invoke('getCell', [2, 7]);
                coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left, y: coords.top }, document, td);
                expect(helper.getElement('.e-spreadsheet-edit').textContent).toBe('=H3');
                helper.getElement('.e-spreadsheet-edit').textContent = '=H3+1';
                helper.triggerKeyNativeEvent(13);
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[9])).toBe('{"value":"51","formula":"=H3+1"}');
                done();
            });
        });
        describe('EJ2-53885->', () => {
            beforeEach((done: Function) => {
                model = {
                    sheets: [{ selectedRange: 'B2' }],
                    cellEditing: (args: CellEditEventArgs):  void => {
                        expect(args.value).toEqual('CellSave');
                        expect(args.oldValue).toEqual('');
                    }
                }
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('cellEditing event args does not contains edited value->', (done: Function) => {
                helper.invoke('startEdit');
                helper.getElement('.e-spreadsheet-edit').textContent = 'CellSave';
                done();
            });
        });
    });
});