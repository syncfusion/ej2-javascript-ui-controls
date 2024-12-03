import { SpreadsheetModel, CellRenderEventArgs, Spreadsheet, CellEditEventArgs, CellSaveEventArgs, onContentScroll } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel, SheetModel, getCell, ImageModel } from '../../../src/index';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { EventHandler, createElement } from '@syncfusion/ej2-base';

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
                // expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe('Test 1');
                // expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');
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
                // expect(helper.getInstance().sheets[0].rows[2].cells[0].value).toBe('Test 2');
                // expect(helper.getInstance().sheets[0].selectedRange).toBe('B3:B3');
                done();
            }, 10);
        });

        it('F2', (done: Function) => {
            helper.triggerKeyNativeEvent(113);
            helper.getElement('.e-spreadsheet-edit').textContent = 'Test 3';
            helper.triggerKeyNativeEvent(9, null, true); // Shift tab save
            setTimeout(() => {
                // expect(helper.getInstance().sheets[0].rows[2].cells[1].value).toBe('Test 3');
                // expect(helper.getInstance().sheets[0].selectedRange).toBe('A3:A3');
                done();
            }, 10);
        });

        it('Delete', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                // expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[0])).toBe('{}');
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
            // expect(helper.getInstance().sheets[0].rows[2].cells[5].wrap).toBeTruthy();
            done();
        });

        it('Formula reference', (done: Function) => {
            helper.invoke('selectRange', ['F4'])
            helper.invoke('startEdit');
            helper.getInstance().notify('editOperation', { action: 'refreshEditor', value: '=sum(', refreshCurPos: true, refreshEditorElem: true });
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
            const image: ImageModel[] = spreadsheet.sheets[0].rows[2].cells[3].image;
            expect(image[0].height).toBe(300);
            expect(image[0].width).toBe(400);
            expect(image[0].top).toBe(40);
            expect(image[0].left).toBe(192);
            expect(image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
            const imageId: string = image[0].id;
            expect(helper.getElement('#' + imageId).style.height).toBe('300px');
            EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
            helper.invoke('deleteImage', [imageId]);
            setTimeout(() => {
                expect(helper.getElement('#' + imageId)).toBe(null);
                expect(image.length).toBe(0);
            helper.edit('I3','=UNIQUE(H2:H5)');
            helper.triggerKeyNativeEvent(13);
            setTimeout(() => {
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[2].cells[8])).toBe('{"value":"10","formula":"=UNIQUE(H2:H5)"}');
                done();
            });
        },0);
        });
        it('EJ2-896098 - On typing the long text in border applied cell, border is also getting extended in edit mode', function (done) {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.cellFormat({ border: '1px solid #000000', backgroundColor: '#FFFF00' }, 'D13');
            const cell: any = spreadsheet.sheets[0].rows[12].cells[3];
            expect(cell.style.borderLeft).toEqual('1px solid #000000');
            expect(cell.style.borderRight).toEqual('1px solid #000000');
            expect(cell.style.borderTop).toEqual('1px solid #000000');
            expect(cell.style.borderBottom).toEqual('1px solid #000000');
            expect(cell.style.backgroundColor).toEqual('#FFFF00');
            helper.edit('D13', 'Border wont be expand when type long text along with border applied');
            expect(cell.value).toEqual('Border wont be expand when type long text along with border applied');
            const editorElement: any = helper.getElement('.e-spreadsheet-edit');
            helper.invoke('startEdit');
            expect(editorElement.style.borderLeft).toBe('');
            expect(editorElement.style.borderRight).toBe('');
            expect(editorElement.style.borderTop).toBe('');
            expect(editorElement.style.borderBottom).toBe('');
            expect(editorElement.style.backgroundColor).toBe('rgb(255, 255, 0)');
            helper.invoke('endEdit');
            done();
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
                }, 20);
            });
        });

        it('Opening Hyperlink Dialog by Keyboard Shortcuts with Protect Sheet->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Price Details', { insertLink: true,  });
            helper.triggerKeyNativeEvent(75, true);
            setTimeout(() => {
                var dialog = helper.getElement('.e-hyperlink-dlg.e-dialog');
                // expect(!!dialog).toBeTruthy();
                // expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(2)');
                spreadsheet.unprotectSheet();
                done();
            });
        });

        it('Delete Image->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertImage([{src:"https://www.w3schools.com/images/w3schools_green.jpg"}],"D3");
            const image: ImageModel[] = spreadsheet.sheets[0].rows[2].cells[3].image;
            expect(image[0].height).toBe(300);
            expect(image[0].width).toBe(400);
            expect(image[0].top).toBe(40);
            expect(image[0].left).toBe(192);
            expect(image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
            const imageId: string = image[0].id;
            expect(helper.getElement('#' + imageId).style.height).toBe('300px');
            EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
            setTimeout(() => {
                const Image: HTMLElement = helper.getElement().querySelector('.e-ss-overlay');
                helper.triggerMouseAction( 'mousedown', { x: Image.getBoundingClientRect().left, y: Image.getBoundingClientRect().top }, Image, Image);
                helper.triggerMouseAction( 'mouseup', { x: Image.getBoundingClientRect().left, y: Image.getBoundingClientRect().top }, document, Image);
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    expect(image.length).toBe(0);
                    expect(helper.getElementFromSpreadsheet('#' + imageId)).toBeNull();
                    done();
                });
            });
        });

        it('Delete Image using Backspace key->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.insertImage([{ src: 'https://www.w3schools.com/images/w3schools_green.jpg'}], 'K3');
            const image: ImageModel = spreadsheet.sheets[0].rows[2].cells[10].image[0];
            expect(image.height).toBe(300);
            expect(image.width).toBe(400);
            expect(image.top).toBe(40);
            expect(image.left).toBe(640);
            expect(image.src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
            const imageId: string = image.id;
            expect(helper.getElement('#' + imageId).style.left).toBe('640px');
            EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
            setTimeout(() => {
                const Image: HTMLElement = helper.getElement().querySelector('.e-ss-overlay');
                helper.triggerMouseAction( 'mousedown', { x: Image.getBoundingClientRect().left, y: Image.getBoundingClientRect().top }, Image, Image);
                helper.triggerMouseAction( 'mouseup', { x: Image.getBoundingClientRect().left, y: Image.getBoundingClientRect().top }, document, Image);
                helper.triggerKeyNativeEvent(8);
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('#' + imageId)).toBeNull();
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

        it('Delete Chart using Backspace key->', (done: Function) => {
            helper.invoke('insertChart', [[{ type: 'Column', range: 'I1:J5' }]]);
            EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
            setTimeout(() => {
                const Chart: HTMLElement = helper.getElement().querySelector('.e-datavisualization-chart');
                helper.triggerMouseAction( 'mousedown', { x: Chart.getBoundingClientRect().left, y: Chart.getBoundingClientRect().top }, Chart, Chart);
                helper.triggerMouseAction( 'mouseup', { x: Chart.getBoundingClientRect().left, y: Chart.getBoundingClientRect().top }, document, Chart);
                helper.triggerKeyNativeEvent(8);
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
            expect(helper.getInstance().sheets[0].rows[10].cells[7].value).toBe('55');
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

    describe('Checking delete key with merged cells', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Deleting merged cell through Delete Key', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.merge('B4:C6');
            spreadsheet.selectRange("A2:D7");
            helper.triggerKeyNativeEvent(46);
            expect(spreadsheet.sheets[0].rows[3].cells[1].rowSpan).toBe(3);
            expect(spreadsheet.sheets[0].rows[3].cells[1].colSpan).toBe(2);
            expect(spreadsheet.sheets[0].rows[3].cells[1].value).toBeUndefined();
            done();
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
        describe('I282937, EJ2-69520 ->', () => {
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
                // setTimeout(() => {
                //     expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe('Test 1');
                //     expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');       
                // });
                done();
            });
            it('Edit element is not showing cell value if it contains boolean value false', (done: Function) => {
                helper.invoke('startEdit');
                expect(helper.getInstance().sheets[0].rows[1].cells[0].value.toString()).toBe('false');
                expect(helper.getElement('.e-spreadsheet-edit').textContent).toBe('FALSE');
                helper.triggerKeyNativeEvent(13);
                done();
            });
            it('Rendered template gets destroyed when updating value to the cell via update cell method', (done: Function) => {
                helper.invoke('updateCell', [{ value: 'Test' }, 'E5']);
                expect(helper.getInstance().sheets[0].rows[4].cells[4].value).toBe('Test');
                expect(helper.invoke('getCell', [4, 4]).classList.contains('e-cell-template')).toBeTruthy();
                expect(helper.invoke('getCell', [4, 4]).querySelector('.e-dropdownlist')).not.toBeNull();
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
        describe('I267737, I267730, FB21561, EJ2-56562, EJ2-60404 ->', () => {
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
                            expect(spreadsheet.sheets[0].rows[1].cells[0].format).toBe('m/d/yyyy');
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
                expect(spreadsheet.sheets[0].rows[0].cells[0].style).toBeUndefined();
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
                helper.getInstance().notify('editOperation', { action: 'refreshEditor', value: '=', refreshCurPos: true, refreshEditorElem: true });
                let td: HTMLElement = helper.invoke('getCell', [1, 7]);
                let coords: ClientRect = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left, y: coords.top }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left, y: coords.top }, document, td);
                expect(helper.getElement('.e-spreadsheet-edit').textContent).toBe('=H2');
                helper.triggerKeyNativeEvent(13);
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[9])).toBe('{"value":"10","formula":"=H2"}');
                helper.invoke('selectRange', ['J3'])
                helper.invoke('startEdit');
                helper.getInstance().notify('editOperation', { action: 'refreshEditor', value: '=', refreshCurPos: true, refreshEditorElem: true });
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
        describe('EJ2-71834, EJ2-853079, EJ2-861718', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{  ranges: [{ dataSource: defaultData }]}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('The hyphen (-) symbol it converted to NaN after saving the cell', (done: Function) => {
                helper.invoke('goTo', ['I2']);
                helper.edit('I2', '-');
                expect(helper.invoke('getCell', [1, 8]).textContent).toBe('-');
                helper.invoke('goTo', ['I3']);
                helper.edit('I3', '-hello');
                expect(helper.invoke('getCell', [2, 8]).textContent).toBe('-hello');
                helper.invoke('goTo', ['I4']);
                helper.edit('I4', '-$*');
                expect(helper.invoke('getCell', [3, 8]).textContent).toBe('-$*');
                helper.invoke('goTo', ['I5']);
                helper.edit('I5', '--');
                expect(helper.invoke('getCell', [4, 8]).textContent).toBe('--');
                helper.invoke('goTo', ['I6']);
                helper.edit('I6', '$-');
                expect(helper.invoke('getCell', [5, 8]).textContent).toBe('$-');
                done();
            });
            it('Aria label getting updated as undefined while using updateCell method', (done: Function) => {
                helper.invoke('updateCell', [{ value: 'value1' }, 'J1']);
                expect(helper.invoke('getCell', [0, 9]).ariaLabel).toBe('value1 J1');
                helper.edit('J2', 'value2');
                expect(helper.invoke('getCell', [1, 9]).ariaLabel).toBe('value2 J2');
                helper.edit('H2', 'value3');
                expect(helper.invoke('getCell', [1, 7]).ariaLabel).toBe('value3 H2');
                done();
            });
            it('Deleting range of value does not work when the range is selected from right to left', (done: Function) => {
                helper.invoke('selectRange', ['H10:E10']);
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [9, 7]).textContent).toBe('');
                    expect(JSON.stringify(helper.getInstance().sheets[0].rows[9].cells[7])).toBe('{}');
                    helper.invoke('selectRange', ['H8:F7']);
                    helper.triggerKeyNativeEvent(46);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [7, 6]).textContent).toBe('');
                        expect(JSON.stringify(helper.getInstance().sheets[0].rows[7].cells[6])).toBe('{}');
                        helper.invoke('selectRange', ['H4:G5']);
                        helper.triggerKeyNativeEvent(46);
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [4, 6]).textContent).toBe('');
                            expect(JSON.stringify(helper.getInstance().sheets[0].rows[4].cells[6])).toBe('{}');
                            done();
                        });
                    });
                });
            });
        });
        describe('EJ2-846321', () => {
            let spreadsheet: SpreadsheetHelper;
            beforeAll((done: Function) => {
                document.body.appendChild(createElement('div', { id: 'dialog', className: 'e-dialog' }));
                document.body.getElementsByClassName('e-dialog')[0].appendChild(createElement('div', { id: 'spreadsheet1' }));
                spreadsheet = new SpreadsheetHelper('spreadsheet1');
                spreadsheet.initializeSpreadsheet({ sheets: [{  ranges: [{ dataSource: defaultData }]}] }, done);
            });
            afterAll(() => {
                spreadsheet.invoke('destroy');
                document.body.removeChild(document.getElementById('dialog'));
            });
            it('ESC key down and edit mode functionality gets broke when spreadsheet is rendered inside dialog', (done: Function) => {
                spreadsheet.triggerKeyEvent('keydown', 65);
                expect(spreadsheet.getInstance().isEdit).toBeTruthy();
                spreadsheet.triggerKeyNativeEvent(27);
                setTimeout(() => {
                    expect(spreadsheet.getInstance().sheets[0].rows[0].cells[0].value).toBe('Item Name');
                    done();
                });
            });
        });
        describe('EJ2-899811 ', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{  ranges: [{ dataSource: defaultData }]}] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Values starting with double equals display as empty instead of showing the entered value in text format cells.', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.numberFormat('@','I1:J10');
                helper.edit('I1','==');
                helper.edit('I2','=A1+A2+A3');
                helper.edit('I3','=SUM(10,10,10)');
                helper.edit('I4','======');
                helper.edit('I5','=10*20*30');
                helper.edit('J1','=AVERAGEIF(A1:A5,"=0")');
                helper.edit('J2','=COUNT(A1:A5)');
                helper.edit('J3','=SUM(A1:A5,B1:B5)');
                helper.edit('J4','=AVERAGE(A1:E1)');
                helper.edit('J5','=SUM(A1:F1)');
                expect(helper.invoke('getCell', [0, 8]).textContent).toBe('==');
                expect(helper.invoke('getCell', [1, 8]).textContent).toBe('=A1+A2+A3');
                expect(helper.invoke('getCell', [2, 8]).textContent).toBe('=SUM(10,10,10)');
                expect(helper.invoke('getCell', [3, 8]).textContent).toBe('======');
                expect(helper.invoke('getCell', [4, 8]).textContent).toBe('=10*20*30');
                expect(helper.invoke('getCell', [0, 9]).textContent).toBe('=AVERAGEIF(A1:A5,"=0")');
                expect(helper.invoke('getCell', [1, 9]).textContent).toBe('=COUNT(A1:A5)');
                expect(helper.invoke('getCell', [2, 9]).textContent).toBe('=SUM(A1:A5,B1:B5)');
                expect(helper.invoke('getCell', [3, 9]).textContent).toBe('=AVERAGE(A1:E1)');
                expect(helper.invoke('getCell', [4, 9]).textContent).toBe('=SUM(A1:F1)');
                helper.edit('K1','==');
                helper.edit('K2','=10+20');
                helper.edit('K3','=SUM(D2,D3,D4)');
                helper.invoke('copy', ['K2:K3']).then(() => {
                    helper.invoke('paste', ['I6:J9']);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [5, 8]).textContent).toBe('30');
                        expect(helper.invoke('getCell', [5, 8]).textContent).toBe('30');
                        expect(helper.invoke('getCell', [7, 9]).textContent).toBe('30');
                        expect(helper.invoke('getCell', [7, 9]).textContent).toBe('30');
                        expect(spreadsheet.sheets[0].rows[6].cells[8].formula).toBe('=SUM(B6,B7,B8)');
                        expect(spreadsheet.sheets[0].rows[6].cells[9].formula).toBe('=SUM(C6,C7,C8)');
                        expect(spreadsheet.sheets[0].rows[8].cells[8].formula).toBe('=SUM(B8,B9,B10)');
                        expect(spreadsheet.sheets[0].rows[8].cells[9].formula).toBe('=SUM(C8,C9,C10)');
                        helper.invoke('copy', ['I1:J5']).then(() => {
                            helper.invoke('paste', ['K1:L5']);
                            setTimeout(() => {
                                expect(helper.invoke('getCell', [0, 10]).textContent).toBe('==');
                                expect(helper.invoke('getCell', [1, 10]).textContent).toBe('=A1+A2+A3');
                                expect(helper.invoke('getCell', [2, 10]).textContent).toBe('=SUM(10,10,10)');
                                expect(helper.invoke('getCell', [3, 10]).textContent).toBe('======');
                                expect(helper.invoke('getCell', [4, 10]).textContent).toBe('=10*20*30');
                                expect(helper.invoke('getCell', [0, 11]).textContent).toBe('=AVERAGEIF(A1:A5,"=0")');
                                expect(helper.invoke('getCell', [1, 11]).textContent).toBe('=COUNT(A1:A5)');
                                expect(helper.invoke('getCell', [2, 11]).textContent).toBe('=SUM(A1:A5,B1:B5)');
                                expect(helper.invoke('getCell', [3, 11]).textContent).toBe('=AVERAGE(A1:E1)');
                                expect(helper.invoke('getCell', [4, 11]).textContent).toBe('=SUM(A1:F1)');
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('Checking ReadOnly Cells. ->', () => {
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], columns: [{ index: 11, isReadOnly: true, }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Check setRangeReadOnly public method with true as readonly', (done: Function) => {
            spreadsheet = helper.getInstance();
            let cell: CellModel = spreadsheet.sheets[0].rows[0].cells[0];
            expect(cell.isReadOnly).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[1].cells[2].isReadOnly).toBeUndefined();
            spreadsheet.setRangeReadOnly(true, 'A1:C2', spreadsheet.activeSheetIndex);
            expect(cell.isReadOnly).toBe(true);
            expect(spreadsheet.sheets[0].rows[1].cells[2].isReadOnly).toBe(true);
            expect(helper.invoke('getCell', [0, 0]).classList).toContain('e-readonly');
            done();
        });
        it('Check setRangeReadOnly public method with false as readonly', (done: Function) => {
            spreadsheet = helper.getInstance();
            let cell: CellModel = spreadsheet.sheets[0].rows[0].cells[0];
            expect(cell.isReadOnly).toBe(true);
            expect(spreadsheet.sheets[0].rows[1].cells[2].isReadOnly).toBe(true);
            expect(helper.invoke('getCell', [0, 0]).classList).toContain('e-readonly');
            spreadsheet.setRangeReadOnly(false, 'A1:C2', spreadsheet.activeSheetIndex);
            expect(cell.isReadOnly).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[1].cells[2].isReadOnly).toBeUndefined();
            expect(helper.invoke('getCell', [0, 0]).classList).not.toContain('e-readonly');
            done();
        });
        it('Alert dialog shown while the autofill applied on read only cell as data range', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'B2:B5', spreadsheet.activeSheetIndex);
            helper.invoke('autoFill', ['C2:D2', 'B2:B2', 'Right', 'FillSeries']);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-readonly-alert-dlg.e-dialog');
                expect(dialog.querySelector('.e-dlg-content').textContent).toBe(
                    "You are trying to modify a cell that is in read-only mode. To make changes, please disable the read-only status.");
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Alert dialog shown while the autofill applied on read only cell as fill range', (done: Function) => {
            helper.invoke('autoFill', ['B2:D2', 'A2:A2', 'Right', 'FillSeries']);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-readonly-alert-dlg.e-dialog');
                expect(dialog.querySelector('.e-dlg-content').textContent).toBe(
                    "You are trying to modify a cell that is in read-only mode. To make changes, please disable the read-only status.");
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking context menu items for the readonly cells', (done: Function) => {
            helper.invoke('selectRange', ['B3']);
            let td: HTMLTableCellElement = helper.invoke('getCell', [1, 3]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(1)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(2)').classList).not.toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(3)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(4)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(6)').classList).toContain('e-disabled');
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(7)').classList).toContain('e-disabled');
                done();
            });
        });
        it('Alert dialog shown when cut action is performed on read only cells', (done: Function) => {
            helper.invoke('cut', ['B2:B3']);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Alert dialog shown when paste action is performed on read only cells', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.invoke('copy', ['A2']).then(() => {
                helper.invoke('paste', ['B2']);
                setTimeout(() => {
                    const dialog: HTMLElement = helper.getElement('.e-dialog');
                    expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                    helper.click('.e-dialog .e-primary');
                    done();
                });
            });
        });
        it('Alert dialog shown when replace action is performed on read only cells', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'A10:A11', spreadsheet.activeSheetIndex);
            helper.invoke('selectRange', ['A11']);
            helper.invoke('replace', [{ replaceValue: 'T-Shirts', replaceBy: 'replace', value: 'T-Shirt' }]);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking Repalce All with readonly cases', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'H2:H3', spreadsheet.activeSheetIndex);
            helper.invoke('selectRange', ['H2']);
            helper.invoke('replace', [{ replaceValue: '150', replaceBy: 'replaceall', value: 10 }]);
            expect(helper.getInstance().sheets[0].rows[1].cells[7].value).toBe(10);
            done();
        });
        it('Checking improper sheet index in setRangeReadonly method', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'D2:D3', 1);
            expect(helper.getInstance().sheets[0].rows[1].cells[3].isReadOnly).toBeUndefined();
            done();
        });
        it('Checking Readonly with true as column cases', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'D:D', 0);
            spreadsheet.setRangeReadOnly(true, 'e:e', 0);
            expect(helper.getInstance().sheets[0].columns[3].isReadOnly).toBeTruthy();
            expect(helper.getInstance().sheets[0].columns[4].isReadOnly).toBeTruthy();
            done();
        });
        it('Checking Readonly with false as column cases', (done: Function) => {
            spreadsheet.setRangeReadOnly(false, 'D:D', 0);
            spreadsheet.setRangeReadOnly(false, 'e:e', 0);
            expect(helper.getInstance().sheets[0].columns[3].isReadOnly).toBeUndefined();
            expect(helper.getInstance().sheets[0].columns[4].isReadOnly).toBeUndefined();
            done();
        });
        it('Checking Readonly with null as range cases', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            spreadsheet.setRangeReadOnly(true, null, 0);
            expect(helper.getInstance().sheets[0].rows[1].cells[0].isReadOnly).toBeTruthy();
            done();
        });
        it('Checking Readonly with true as row cases', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, '2:2', 0);
            expect(helper.getInstance().sheets[0].rows[1].isReadOnly).toBeTruthy();
            done();
        });
        it('Checking Readonly with false as row cases', (done: Function) => {
            spreadsheet.setRangeReadOnly(false, '2:2', 0);
            expect(helper.getInstance().sheets[0].rows[1].isReadOnly).toBeFalsy();
            done();
        });
        it('Checking copy and paste with readonly cells cases', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'A2:A3', 0);
            helper.invoke('copy', ['A2']).then(() => {
                helper.invoke('paste', ['A12']);
                expect(helper.getInstance().sheets[0].rows[11].cells[0].value).toBe('Casual Shoes');
                expect(helper.getInstance().sheets[0].rows[11].cells[0].isReadOnly).toBeUndefined();
                done();
            });
        });
        it('Checking readonly cells with Insert Row-Before cases->', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(1, 0, [6, 1], true);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking readonly cells with Insert Row-after cases->', (done: Function) => {
            helper.invoke('selectRange', ['A3']);
            helper.openAndClickCMenuItem(2, 0, [6, 2], true);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking readonly cells with Delete Row cases->', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.openAndClickCMenuItem(1, 0, [7], true);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking readonly cells with Insert Column-Before cases->', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'B:B', spreadsheet.activeSheetIndex);
            helper.invoke('selectRange', ['A2']);
            helper.openAndClickCMenuItem(0, 1, [6, 1], false, true);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking readonly cells with Insert Column-After cases->', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'C:C', spreadsheet.activeSheetIndex);
            helper.invoke('selectRange', ['A3']);
            helper.openAndClickCMenuItem(0, 2, [6, 2], false, true);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking readonly cells with Delete Column cases->', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            helper.openAndClickCMenuItem(0, 1, [7], false, true);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking readonly cells with sort ascending using ribbon items ->', (done: Function) => {
            helper.invoke('selectRange', ['D1']);
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(1)');
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking readonly cells with sort descending using ribbon items ->', (done: Function) => {
            helper.invoke('selectRange', ['E1']);
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(2)');
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking readonly cells with sort ascending using context menu items ->', (done: Function) => {
            helper.invoke('selectRange', ['F6']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [7, 1], false, false);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking readonly cells with sort descending using context menu items ->', (done: Function) => {
            helper.invoke('selectRange', ['G2']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [7, 2], false, false);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Readonly cells with Listvalidation', (done: Function) => {
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'A11']);
            const cell: CellModel = helper.getInstance().sheets[0].rows[10].cells[0];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"12,13,14"}');
            expect(cell.isReadOnly).toBe(true);
            done();
        });
        it('Alert dialog shown when hyperlink applied on read only cells', (done: Function) => {
            helper.invoke('addHyperlink', ['www.syncfusion.com', 'B3']);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Deleting values from readonly cells using delete key and warning dialog', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'E2:E5', spreadsheet.activeSheetIndex);
            helper.invoke('selectRange', ['E3']);
            helper.getElement().focus();
            helper.triggerKeyEvent('keydown', 46, null, null, null, helper.invoke('getCell', [2, 4]));
            setTimeout((): void => {
                const dialog: HTMLElement = helper.getElement('.e-dialog');
                expect(dialog.classList.contains('e-readonly-alert-dlg')).toBeTruthy();
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Deleting values from readonly cells using backspace key and warning dialog', (done: Function) => {
            helper.invoke('selectRange', ['E4']);
            helper.getElement().focus();
            helper.triggerKeyEvent('keydown', 8, null, null, null, helper.invoke('getCell', [3, 4]));
            setTimeout((): void => {
                helper.setAnimationToNone('.e-readonly-alert-dlg.e-dialog');
                expect(helper.getElement('.e-readonly-alert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-readonly-alert-dlg .e-footer-content button:nth-child(1)');
                done();
            });
        });
        it('Editing values from readonly cells using general keys', (done: Function) => {
            helper.invoke('selectRange', ['E3']);
            helper.getElement().focus();
            helper.triggerKeyEvent('keydown', 72, null, null, null, helper.invoke('getCell', [2, 4]));
            setTimeout((): void => {
                helper.setAnimationToNone('.e-readonly-alert-dlg.e-dialog');
                expect(helper.getElement('.e-readonly-alert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-readonly-alert-dlg .e-footer-content button:nth-child(1)');
                done();
            });
        });
        it('Formula bar edit alert with readonly cells', (done: Function) => {
            helper.invoke('selectRange', ['E3']);
            setTimeout(() => {
                let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar');
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                editorElem.dispatchEvent(e);
                setTimeout((): void => {
                    helper.setAnimationToNone('.e-readonly-alert-dlg.e-dialog');
                    expect(helper.getElement('.e-readonly-alert-dlg.e-dialog')).not.toBeNull();
                    helper.click('.e-readonly-alert-dlg .e-footer-content button:nth-child(1)');
                    done();
                });
            });
        });
        it('Formula Insert Function Dialog alert with readonly cells', (done: Function) => {
            helper.click('.e-formula-bar-panel .e-insert-function');
            setTimeout((): void => {
                helper.setAnimationToNone('.e-readonly-alert-dlg.e-dialog');
                expect(helper.getElement('.e-readonly-alert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-readonly-alert-dlg .e-footer-content button:nth-child(1)');
                done();
            });
        });
        it('Applying Number format to the readonly cells', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'G2:G11', spreadsheet.activeSheetIndex);
            helper.invoke('selectRange', ['F2:H2']);
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_number_format').click();
            helper.getElement('#' + helper.id + '_Percentage').click();
            setTimeout((): void => {
                expect(helper.invoke('getCell', [1, 6]).textContent).toBe('1');
                done();
            });
        });
        it('Applying cell format to the readonly cells', (done: Function) => {
            helper.invoke('cellFormat', [{ fontWeight: 'bold' }, 'F2:H2']);
            helper.invoke('cellFormat', [{ fontStyle: 'italic' }, 'F3:H3']);
            helper.invoke('cellFormat', [{ textDecoration: 'underline line-through' }, 'F4:H4']);
            helper.invoke('cellFormat', [{ border: '1px solid #000' }, 'F5:H5']);
            helper.invoke('cellFormat', [{ fontSize: '14pt' }, 'F6:H6']);
            helper.invoke('cellFormat', [{ fontFamily: 'Georgia' }, 'F7:H7']);
            setTimeout((): void => {
                expect(helper.invoke('getCell', [1, 6]).style.fontWeight).not.toBe('bold');
                expect(helper.invoke('getCell', [2, 6]).style.fontStyle).not.toBe('italic');
                expect(helper.invoke('getCell', [3, 6]).style.textDecoration).not.toBe('underline line-through');
                expect(helper.invoke('getCell', [5, 6]).style.fontSize).not.toBe('14pt');
                expect(helper.invoke('getCell', [6, 6]).style.fontFamily).not.toBe('Georgia');
                let td: HTMLElement = helper.invoke('getCell', [4, 6]);
                expect(td.style.borderWidth).not.toBe('1px');
                expect(td.style.borderStyle).not.toBe('solid');
                expect(td.style.borderColor).not.toBe('rgb(0, 0, 0)');
                done();
            });
        });
        it('Apply Merge to read only cells->', (done: Function) => {
            helper.invoke('selectRange', ['F2:H2']);
            helper.getElement('#' + helper.id + '_merge_dropdownbtn').click();
            helper.getElement('.e-item[aria-label="Merge All"]').click();
            setTimeout((): void => {
                helper.setAnimationToNone('.e-readonly-alert-dlg.e-dialog');
                expect(helper.getElement('.e-readonly-alert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-readonly-alert-dlg .e-footer-content button:nth-child(1)');
                done();
            });
        });
        it('Checking Find and Replace dialog cancel with readonly alert dialog', (done: Function) => {
            spreadsheet.setRangeReadOnly(true, 'F:F', spreadsheet.activeSheetIndex);
            helper.invoke('selectRange', ['F4']);
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                helper.click('.e-findtool-dlg .e-findRib-more');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-find-dlg.e-dialog');
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = '300';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    const replaceTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-replaceInp') as HTMLInputElement;
                    replaceTxtBox.value = '343';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, replaceTxtBox);
                    let target: any = helper.getElements('.e-find-dlg .e-search-within .e-dropdownlist')[0];
                    target.ej2_instances[0].value = 'Workbook';
                    target.ej2_instances[0].dataBind();
                    setTimeout(() => {
                        helper.click('.e-find-dlg .e-btn-replace');
                        setTimeout(() => {
                            helper.setAnimationToNone('.e-readonly-alert-dlg.e-dialog');
                            expect(helper.getElement('.e-readonly-alert-dlg.e-dialog')).not.toBeNull();
                            helper.click('.e-readonly-alert-dlg .e-footer-content button:nth-child(1)');
                            helper.click('.e-find-dlg .e-footer-content button:nth-child(5)');
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('EJ2-893055 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Formula cells are not calculated properly while changing the values of formula dependent cells', (done: Function) => {
            helper.invoke('numberFormat', ['dd-mm-yyyy', 'B3']);
            helper.edit('B3', '26-02-2024');
            helper.edit('I1', '=IF(B3="", True, SUM(B3,H2))');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('45358');
            helper.edit('B3', '25-02-2024');
            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('45357');
            done();
        });
        it('Checking the values of formula dependent cells', (done: Function) => {
            helper.invoke('numberFormat', ['dd-mm-yyyy', 'B4']);
            helper.edit('B4', '26-02-2024');
            helper.edit('I2', '=B4');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('26-02-2024');
            helper.edit('B4', '25-02-2024');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('25-02-2024');
            done();
        });
        it('Checking the values of formula dependent cells with custom formats', (done: Function) => {
            helper.invoke('numberFormat', ['dd-mm-yyyy', 'B4']);
            helper.edit('B4', '26-02-2024');
            helper.edit('I2', '=B4');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('26-02-2024');
            helper.edit('B4', '02/25/2024');
            expect(helper.invoke('getCell', [1, 8]).textContent).toBe('25-02-2024');
            done();
        });
    });
});