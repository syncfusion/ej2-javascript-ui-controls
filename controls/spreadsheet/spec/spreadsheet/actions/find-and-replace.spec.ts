import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';

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
            });
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
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Find in tool dialog', (done: Function) => {
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
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
                helper.click('.e-findtool-dlg .e-findRib-close');
                expect(helper.getElementFromSpreadsheet('.e-findtool-dlg')).toBeNull();
                done();
            });
        });

        it('Find in dialog', (done: Function) => {
            helper.click('#' + helper.id + '_findbtn');
            setTimeout(() => {
                helper.click('.e-findtool-dlg .e-findRib-more');
                setTimeout(() => {
                    const findTxtBox: HTMLInputElement = helper.getElementFromSpreadsheet('.e-find-dlg .e-text-findNext') as HTMLInputElement;
                    findTxtBox.value = 'T-Shirts';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, findTxtBox);
                    setTimeout(() => {
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

                        const dialog: any = helper.getElementFromSpreadsheet('.e-find-dlg');
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
                                            // expect(helper.getElementFromSpreadsheet('.e-find-dlg')).toBeNull(); // Check this now
                                            done();
                                        });
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
        // it('GoTo', (done: Function) => {
        //     helper.triggerKeyEvent('keydown', 71, null, true, null);
        //     setTimeout(() => {
        //         const goToText: HTMLInputElement = helper.getElementFromSpreadsheet('.e-goto-dlg .e-text-goto') as HTMLInputElement;
        //         // helper.click('.e-goto-dlg .e-btn-goto-ok'); // Check this now
        //         // expect(helper.getElementFromSpreadsheet('.e-goto-alert-span').textContent).toBe('Reference value is not valid.');
        //         // goToText.value = 'H10';
        //         // helper.click('.e-goto-dlg .e-btn-goto-ok');
        //         // expect(helper.getInstance().sheets[0].selectedRange).toBe('H10:H10');
        //         // helper.click('.e-goto-dlg .e-dlg-closeicon-btn');
        //         // setTimeout(() => {
        //         //     // expect(helper.getElementFromSpreadsheet('.e-goto-dlg')).toBeNull(); // Need to check this
        //              done();
        //         // });
        //     });
        // });
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
});
