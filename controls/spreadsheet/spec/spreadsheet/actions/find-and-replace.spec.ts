import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet, SpreadsheetModel } from '../../../src/spreadsheet/index';

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
                                    expect(helper.getInstance().sheets[0].rows[2].cells[7].value).toBe('Test');
                                    expect(helper.invoke('getCell', [2, 7]).textContent).toBe('Test');
                                    expect(helper.getInstance().sheets[0].rows[10].cells[3].value).toBe(50);

                                    // Replace all
                                    helper.click('.e-find-dlg .e-btn-replaceAll');
                                    setTimeout(() => {
                                        expect(helper.getElementFromSpreadsheet('.e-findtool-dlg.e-dialog')).toBeNull();
                                        expect(helper.getInstance().sheets[0].rows[10].cells[3].value).toBe('Test');
                                        expect(helper.invoke('getCell', [10, 3]).textContent).toBe('Test');
                                        expect(helper.getInstance().sheets[0].rows[10].cells[5].value).toBe('Test0');
                                        expect(helper.invoke('getCell', [10, 5]).textContent).toBe('Test0');
                                        expect(helper.getElementFromSpreadsheet('.e-replace-alert-span').textContent).toBe('2 matches replaced with Test');

                                        // Find by matching exact cell content
                                        helper.click('.e-find-dlg .e-findnreplace-checkmatch');
                                        findTxtBox.value = 'Sneakers';
                                        helper.click('.e-find-dlg .e-btn-findNext');
                                        expect(helper.getInstance().sheets[0].selectedRange).toBe('H3:H3');
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
                                        helper.click('.e-find-dlg .e-dlg-closeicon-btn');
                                        setTimeout(() => {
                                            // expect(helper.getElementFromSpreadsheet('.e-find-dlg.e-dialog')).toBeNull(); // Check this now
                                            done();
                                        }, 20);
                                        //});
                                    });
                                });
                            });
                        });
                    });
                });
            });
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
                helper.click('.e-goto-dlg .e-dlg-closeicon-btn');
                setTimeout(() => {
                    expect(helper.getElementFromSpreadsheet('.e-goto-dlg.e-dialog')).toBeNull(); // Need to check this
                     done();
                });
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
    });
});
