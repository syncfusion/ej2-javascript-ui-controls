import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet, dialog as dlg, DialogBeforeOpenEventArgs, BeforeSelectEventArgs, getRangeIndexes, getCell, CellModel } from '../../../src/index';
import { SheetModel } from '../../../src/index';
import { ListView, SelectedCollection } from '@syncfusion/ej2-lists';
import { Dialog, Overlay } from '../../../src/spreadsheet/services/index';

describe('Protect sheet ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.invoke('protectSheet', ['Sheet1', {}]);
            expect(getComputedStyle(helper.getElementFromSpreadsheet('.e-active-cell')).display).toBe('none');
            expect(helper.getElements('.e-overlay').length).toBeGreaterThanOrEqual(23);

            helper.invoke('unprotectSheet', ['Sheet1']);
            setTimeout(() => {
                expect(getComputedStyle(helper.getElementFromSpreadsheet('.e-active-cell')).display).toBe('block');
                expect(helper.getElements('.e-overlay').length).toBeLessThanOrEqual(5);
                done();
            });
        });
    });

    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                helper.invoke('selectRange', ['D4']);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D4:D4');
                // helper.editInUI('Test'); // This case need to be fixed
                setTimeout(() => {
                    // expect(helper.getElementFromSpreadsheet('#' + helper.id + '_protect').textContent).toBe('Unprotect Sheet'); // Check this now
                    // expect(helper.getElementFromSpreadsheet('.e-editAlert-dlg.e-dialog')).not.toBeNull(); // This case need to be fixed
                    // helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                    // helper.click('.e-editAlert-dlg .e-primary');
                    // expect(helper.invoke('getCell', [2, 3]).textContent).toBe('20');
                    done();
                });
            });
        });

        it('Delete in locked cell', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                expect(helper.getElement('.e-editAlert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":"Item Name"}');
                done();
            });
        });

        it('Delete in unlocked cell', (done: Function) => {
            helper.invoke('lockCells', ['B2', false]);
            helper.invoke('selectRange', ['B2']);
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getElement('.e-editAlert-dlg.e-dialog')).toBeNull();
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[1].cells[1])).toBe('{"format":"m/d/yyyy","isLocked":false}');
                done();
            });
        });

        it('Set unlocked to whole column', (done: Function) => {
            helper.invoke('selectRange', ['D1:D100']);
            helper.invoke('lockCells', [null, false]);
            expect(helper.getInstance().sheets[0].columns[3].isLocked).toBeFalsy();
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getElement('.e-editAlert-dlg.e-dialog')).toBeNull();
                done();
            });
        });

        it('Protect workbook', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                //helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
                (helper.getElementFromSpreadsheet('.e-protectworkbook-dlg input') as HTMLInputElement).value = 'T1@/a';
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'T1@/a';
                helper.click('.e-protectworkbook-dlg .e-primary');
                // This case need to be fixed.
                setTimeout(()=>{
                    done();
                });
            });
        });

        it('Un protect sheet', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            expect(helper.getInstance().sheets[0].isProtected).toBeFalsy();
            done();
        });
    });

    describe('Protectsheet/Protect Workbook - Checkbox Selection and Providing Password ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Protect sheet - Checkbox Selection', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[3] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[4] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[5] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[6] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                helper.invoke('selectRange', ['D4']);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D4:D4');
                done();
            },);
        });

        it('Protect sheet - UnChecking Selection', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[2] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });

        it('Protect sheet - Checking only Locked cells', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[2] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[0] as HTMLElement).click();
                var btnDisable = (helper.getElements('.e-protect-dlg .e-primary')[0] as HTMLInputElement).disabled;
                expect(btnDisable).toBeTruthy();
                done();
            });
        });

        it('Protect sheet - Checkbox Selection - cancel button', (done: Function) => {
            helper.setAnimationToNone('.e-protect-dlg.e-dialog');
            (document.getElementsByClassName('e-frame e-icons')[3] as HTMLElement).click();
            (document.getElementsByClassName('e-frame e-icons')[4] as HTMLElement).click();
            (document.getElementsByClassName('e-frame e-icons')[5] as HTMLElement).click();
            (document.getElementsByClassName('e-frame e-icons')[6] as HTMLElement).click();
            (document.querySelector('.e-footer-content .e-btn:not(.e-primary)') as HTMLButtonElement).click();
            expect(helper.getInstance().sheets[0].isProtected).toBeFalsy();
            done();
        });

        it('Protect sheet - Providing password', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                helper.click('.e-protect-dlg .e-primary');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-reenterpwd-dlg.e-dialog');
                    (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                    (helper.getElements('.e-reenterpwd-dlg .e-primary')[0] as HTMLInputElement).disabled = false;
                    helper.click('.e-reenterpwd-dlg .e-primary');
                    setTimeout(() => {
                        var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[0] as HTMLElement).textContent;
                        expect(btnText).toBe('Unprotect Sheet');
                        done();
                    }, 10);
                });
            },);
        });

        it('Checking for unprotect sheet', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-unprotectworksheet-dlg.e-dialog');
                (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                (helper.getElements('.e-unprotectworksheet-dlg .e-primary')[0] as HTMLInputElement).disabled = false;
                helper.click('.e-unprotectworksheet-dlg .e-primary');
                setTimeout(() => {
                    var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[0] as HTMLElement).textContent;
                    expect(btnText).toBe('Protect Sheet');
                    done();
                }, 10);
            });
        });

        it('Protect sheet - Providing wrong password in reentered dialog', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                helper.click('.e-protect-dlg .e-primary');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-reenterpwd-dlg.e-dialog');
                    (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement).value = 'syncfusion1';
                    (helper.getElements('.e-reenterpwd-dlg .e-primary')[0] as HTMLInputElement).disabled = false;
                    helper.click('.e-reenterpwd-dlg .e-primary');
                    setTimeout(() => {
                    var alertText =  (document.getElementsByClassName('e-reenterpwd-alert-span')[0] as HTMLElement).textContent;
                    expect(alertText).toBe('Confirmation password is not identical');
                    (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                    helper.click('.e-reenterpwd-dlg .e-primary');
                    done();
                    });
                });
            },);
        });

        it('Protect sheet - Providing wrong password in unprotectsheet dialog', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-unprotectworksheet-dlg.e-dialog');
                (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement).value = 'syncfusion1';
                (helper.getElements('.e-unprotectworksheet-dlg .e-primary')[0] as HTMLInputElement).disabled = false;
                helper.click('.e-unprotectworksheet-dlg .e-primary');
                setTimeout(() => {
                    var alertText =  (document.getElementsByClassName('e-unprotectsheetpwd-alert-span')[0] as HTMLElement).textContent;
                    expect(alertText).toBe('The password you supplied is not correct.');
                    (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                    helper.click('.e-unprotectworksheet-dlg .e-primary');
                    done();
                },);
            });
        });

        it('Protect sheet - Providing password - Cancelbutton', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                helper.click('.e-protect-dlg .e-primary');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-reenterpwd-dlg.e-dialog');
                    (document.querySelector('.e-reenterpwd-dlg .e-footer-content .e-btn:not(.e-primary)') as HTMLButtonElement).click();
                    expect(document.querySelector('.e-reenterpwd-dlg')).toBeNull();
                    helper.click('.e-protect-dlg .e-primary');
                    setTimeout(() => {
                        expect(document.querySelector('.e-reenterpwd-dlg')).not.toBeNull();
                        done();
                    });
                });
            });
        });

        it('Protectsheet - checking for keyup event for renterpassword dialog', (done: Function) => {
            helper.setAnimationToNone('.e-reenterpwd-dlg.e-dialog');
            (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
            helper.triggerKeyEvent('keyup', 110, null, null, null, (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement));
            helper.click('.e-reenterpwd-dlg .e-primary');
            done();
        });

        it('Checking for keyup event for unprotect password dialog', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-unprotectworksheet-dlg.e-dialog');
                (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                helper.triggerKeyEvent('keyup', 110, null, null, null, (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement));
                helper.click('.e-unprotectworksheet-dlg .e-primary');
                setTimeout(() => {
                    var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[0] as HTMLElement).textContent;
                    // expect(btnText).toBe('Protect Sheet');
                    done();
                });
            });
        });

        it('ProtectWorkbook - Providing password', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
                (helper.getElements('.e-protectworkbook-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'syncfusion';
                (document.getElementsByClassName('e-primary')[1] as HTMLElement).click();
                setTimeout(() => {
                    var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[1] as HTMLElement).textContent;
                    expect(btnText).toBe('Unprotect Workbook');
                    done();
                }, 50);
            });
        });

        it('UnprotectWorkbook - Providing password', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-unprotectworkbook-dlg.e-dialog');
                (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                helper.triggerKeyEvent('keyup', 110, null, null, null, (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement));
                (document.getElementsByClassName('e-primary')[1] as HTMLElement).click();
                setTimeout(() => {
                    var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[1] as HTMLElement).textContent;
                    expect(btnText).toBe('Protect Workbook');
                    done();
                }, 50);
            });
        });

        it('ProtectWorkbook - Providing wrong password', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
                (helper.getElements('.e-protectworkbook-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'syncfusion123';
                (document.getElementsByClassName('e-primary')[1] as HTMLElement).click();
                setTimeout(() => {
                    var alertText =  (document.getElementsByClassName('e-pwd-alert-span')[0] as HTMLElement).textContent;
                    expect(alertText).toBe('Confirmation password is not identical');
                    (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'syncfusion';
                    (document.getElementsByClassName('e-primary')[1] as HTMLElement).click();
                    done();
                });
            });
        });

        it('ProtectWorkbook - Providing wrong password in unprotectworkbook', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-unprotectworkbook-dlg.e-dialog');
                (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement).value = 'syncfusion123';
                (helper.getElements('.e-unprotectworkbook-dlg .e-primary')[0] as HTMLInputElement).disabled = false;
                (document.getElementsByClassName('e-primary')[1] as HTMLElement).click();
                setTimeout(()=>{
                    var alertText =  (document.getElementsByClassName('e-unprotectpwd-alert-span')[0] as HTMLElement).textContent;
                    expect(alertText).toBe('The password you supplied is not correct.');
                    (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                    (helper.getElements('.e-unprotectworkbook-dlg .e-primary')[0] as HTMLInputElement).disabled = false;
                    (document.getElementsByClassName('e-primary')[1] as HTMLElement).click();
                    done();        
                });
            });
        });
        
    });

    describe('ProtectWorkbook - Providing password in 2nd input textbox', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('ProtectWorkbook - Providing password in 2nd input textbox', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'syncfusion';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement));
                var btnDisable = (helper.getElements('.e-protectworkbook-dlg .e-primary')[0] as HTMLInputElement).disabled;
                expect(btnDisable).toBeFalsy();
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = '';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement));
                var btnDisable = (helper.getElements('.e-protectworkbook-dlg .e-primary')[0] as HTMLInputElement).disabled;
                expect(btnDisable).toBeTruthy();
                helper.click('.e-protectworkbook-dlg .e-flat');
                done();
            });
        });
        it('Protect sheet - Checkbox selection for select locked cells', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                done();
            });
        });
        it('Protect sheet - Providing empty password', (done: Function) => {
            helper.setAnimationToNone('.e-protect-dlg.e-dialog');
            (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement).value = '';
            helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement));
            (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement).value = '123';
            helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement));
            helper.click('.e-protect-dlg .e-primary');
            setTimeout(() => {
                helper.setAnimationToNone('.e-reenterpwd-dlg.e-dialog');
                (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement));
                (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement).value = '';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement));
                (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement));
                helper.click('.e-reenterpwd-dlg .e-primary');
                setTimeout(() => {
                    var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[0] as HTMLElement).textContent;
                    //expect(btnText).toBe('Unprotect Sheet');
                    done();
                });
            });
        });
        it('UnProtect sheet - Providing empty password', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-unprotectworksheet-dlg.e-dialog');
                (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement));
                (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement).value = '';
                helper.triggerKeyEvent('keyup', 110, null, null, null, (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement));
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement));
                (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement));
                helper.click('.e-unprotectworksheet-dlg .e-primary');
                setTimeout(() => {
                    var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[0] as HTMLElement).textContent;
                    expect(btnText).toBe('Protect Sheet');
                    done();
                }, 50);
            }, 10);
        });
        it('ProtectWorkbook - Providing empty password', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
                (helper.getElements('.e-protectworkbook-dlg input')[0] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-protectworkbook-dlg input')[0] as HTMLInputElement));
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement));
                (document.getElementsByClassName('e-primary')[1] as HTMLElement).click();
                setTimeout(() => {
                    var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[1] as HTMLElement).textContent;
                    expect(btnText).toBe('Unprotect Workbook');
                    done();
                }, 50);
            });
        });
        it('UnprotectWorkbook - Providing empty password', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-unprotectworkbook-dlg.e-dialog');
                (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 110, null, null, null, (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement));
                (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement).value = '';
                helper.triggerKeyEvent('keyup', 110, null, null, null, (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement));
                (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 110, null, null, null, (helper.getElements('.e-unprotectworkbook-dlg input')[0] as HTMLInputElement));
                (document.getElementsByClassName('e-primary')[1] as HTMLElement).click();
                setTimeout(() => {
                    var btnText =  (document.getElementsByClassName('e-tbar-btn-text')[1] as HTMLElement).textContent;
                    expect(btnText).toBe('Protect Workbook');
                    done();
                }, 50);	
	        });
	    });
        it('Protect sheet - Uncheck all checkboxes', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[2] as HTMLElement).click();
                (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement));
                helper.click('.e-protect-dlg .e-primary');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-reenterpwd-dlg.e-dialog');
                    (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement).value = '123';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement));
                    helper.click('.e-reenterpwd-dlg .e-primary');
                    setTimeout(() => {
                        const autofill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                        expect(autofill.classList).toContain('e-hide');
                        done();
                    });
                });
            });
        });
        it('Unprotect sheet after uncheck all checkboxes', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-unprotectworksheet-dlg.e-dialog');
                (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement).value = '123';
                helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-unprotectworksheet-dlg input')[0] as HTMLInputElement));
                helper.click('.e-unprotectworksheet-dlg .e-primary');
                done();
            }, 10);
        });
    });

    describe('Protect sheet and protect workbook', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.protectSheet('Sheet1', { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false });
                    spreadsheet.lockCells('Sheet1!B2:B5', false);
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Select unlocked cells in protected sheet', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[1] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                helper.invoke('selectRange', ['A2']);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                    done();
                });
            });
        });
        it('Unprotect sheet in unlocked cells', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.invoke('selectRange', ['B2']);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                done();
            }, 10);
        });
        it('ProtectWorkbook - Providing password in 1st input textbox only and click ok', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
                (helper.getElements('.e-protectworkbook-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                helper.click('.e-protectworkbook-dlg .e-primary');
                var alertText =  (document.getElementsByClassName('e-pwd-alert-span')[0] as HTMLElement).textContent;
                expect(alertText).toBe('Please enter the confirm password');
                done();
            });
        });
        it('ProtectWorkbook - Providing password in 2nd input textbox only and click ok', (done: Function) => {
            helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
            (helper.getElements('.e-protectworkbook-dlg input')[0] as HTMLInputElement).value = '';
            (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'syncfusion';
            helper.click('.e-protectworkbook-dlg .e-primary');
            var alertText =  (document.getElementsByClassName('e-pwd-alert-span')[0] as HTMLElement).textContent;
            expect(alertText).toBe('Please enter the password');
            helper.click('.e-protectworkbook-dlg .e-flat');
            done();
        });
        it('Cancelling protect sheet dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                args.cancel = true;
            };
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                expect(helper.getElement('.e-protect-dlg.e-dialog')).toBeNull();
                done();
            });
        }); 
        it('Cancelling protect workbook dialog', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                expect(helper.getElement('.e-protect-dlg.e-dialog')).toBeNull();
                done();
            });
        }); 
    });

    describe('Cancelling dialog open for unprotect sheet and unprotect workbook', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (helper.getElements('.e-protect-dlg input')[0] as HTMLInputElement).value = '123';
                helper.click('.e-protect-dlg .e-primary');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-reenterpwd-dlg.e-dialog');
                    (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement).value = '123';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, (helper.getElements('.e-reenterpwd-dlg input')[0] as HTMLInputElement));
                    helper.click('.e-reenterpwd-dlg .e-primary');
                    done();
                });
            });
        }); 
        it('Appply - Protect workbook', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protectworkbook-dlg.e-dialog');
                (helper.getElements('.e-protectworkbook-dlg input')[0] as HTMLInputElement).value = 'syncfusion';
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'syncfusion';
                helper.click('.e-protectworkbook-dlg .e-primary');
                done();
            });
        });
        it('Cancelling unprotect sheet dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                args.cancel = true;
            };
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                expect(helper.getElement('.e-unprotectworksheet-dlg.e-dialog')).toBeNull();
                done();
            });
        }); 
        it('Cancelling unprotect workbook dialog', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                expect(helper.getElement('.e-unprotectworkbook-dlg.e-dialog')).toBeNull();
                done();
            });
        }); 
    });

    describe('CR-Issues ->', () => {
        describe('I275297 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: [{ 'Employee ID': '2963633', 'Employee Name': 'Kylie Phettis', 'Gender': 'Female',
                    'Department': 'Marketing', 'Date of Joining': '03/18/2011', 'Salary': '$26038.56', 'City': 'Huangzhai' }] }], selectedRange: 'E2:E2' }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A1:F1');
                        spreadsheet.cellFormat({ fontWeight: 'bold' }, 'E31:F31');
                        spreadsheet.cellFormat({ textAlign: 'right' }, 'E31');
                        spreadsheet.numberFormat('$#,##0.00', 'F2:F31');
                        spreadsheet.protectSheet(
                            'Sheet1', { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false });
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Unable to lock a cell without protecting the sheet ~ from 275269', (done: Function) => {
                let cell: HTMLElement = helper.invoke('getCell', [1, 4]);
                helper.triggerMouseAction('dblclick', { x: cell.getBoundingClientRect().left + 2, y:
                    cell.getBoundingClientRect().top + 2 }, null, cell);
                setTimeout((): void => {
                    var dialog = helper.getElement('.e-editAlert-dlg.e-dialog');
                    expect(!!dialog).toBeTruthy();
                    expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                    const editor: HTMLElement = helper.getElement('#' + helper.id + '_edit');
                    expect(editor.style.display).toBe('');
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    (spreadsheet.serviceLocator.getService(dlg) as Dialog).hide();
                    setTimeout((): void => {
                        helper.invoke('lockCells', ['A2:AZ100', false]);
                        cell = helper.invoke('getCell', [1, 4]);
                        helper.triggerMouseAction('dblclick', {
                            x: cell.getBoundingClientRect().left + 10, y: cell.getBoundingClientRect().top + 5
                        }, null, cell);
                        setTimeout((): void => {
                            expect(editor.style.display).toBe('block');
                            helper.invoke('lockCells', ['E2:E4', true]);
                            helper.invoke('endEdit', []);
                            helper.triggerMouseAction('dblclick', {
                                x: cell.getBoundingClientRect().left + 2, y: cell.getBoundingClientRect().top + 2
                            }, null, cell);
                            setTimeout((): void => {
                                dialog = helper.getElement('.e-editAlert-dlg.e-dialog');
                                expect(!!dialog).toBeTruthy();
                                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                                expect(dialog.querySelector('.e-dlg-content').textContent).toBe(
                                    "The cell you're trying to change is protected. To make change, unprotect the sheet.");
                                expect(editor.style.display).toBe('');
                                (spreadsheet.serviceLocator.getService(dlg) as Dialog).hide();
                                done();
                            });
                        });
                    });
                }, 100);
            });
        });
        describe('I321143, F161227, FB23867 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: 'spreadsheet' }] }], isProtected: true }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Deleting values from locked cells and warning dialog', (done: Function) => {
                helper.getElement().focus();
                helper.triggerKeyEvent('keydown', 46, null, null, null, helper.invoke('getCell', [0, 0]));
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('spreadsheet');
                setTimeout((): void => {
                    helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                    expect(helper.getElement('.e-editAlert-dlg.e-dialog')).not.toBeNull();
                    helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                    done();
                });
            });
            it('Cancel button in hyperlink popup is not working in protected sheet', (done: Function) => {
                helper.invoke('protectSheet', ['Sheet1', { selectCells: true, insertLink: true }]);
                helper.invoke('lockCells', ['A1', false]);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                helper.click('#' + helper.id + '_contextmenu li:nth-child(11)');
                setTimeout(() => {
                    expect(helper.getElement('.e-editAlert-dlg.e-dialog')).toBeNull();
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(2)');
                    expect(helper.getElement('.e-hyperlink-dlg.e-dialog')).toBeNull();
                    done();
                });
            });
        });
        describe('I282699 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: 'spreadsheet' }] }], isProtected: true }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Prevent protected sheet dialog box', (done: Function) => {
                helper.getElement().focus();                
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    args.cancel = true;
                };
                spreadsheet.dataBind();
                helper.triggerKeyEvent('keydown', 46, null, null, null, helper.invoke('getCell', [0, 0]));
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('spreadsheet');
                setTimeout((): void => {
                    expect(helper.getElement('#' + helper.id + ' .e-editAlert-dlg.e-dialog')).toBeNull();
                    done();
                }, 50);
            });
        });
        describe('F161227, I264291 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            // it('Aggregate after open from json throw error issue and cell cannot be copy/paste after using openFromJson', (done: Function) => {
            //     const json: object = { "Workbook": { "sheets": [{ "rows": [{ "cells": [{ "value": "20" }, { "value": "10" }] }, { "cells":
            //         [{ "value": "5" }, { "value": "7" }] }], "selectedRange": "A1:B2" }] } };
            //     const spreadsheet: Spreadsheet = helper.getInstance();
            //     spreadsheet.openFromJson({ file: json });
            //     setTimeout((): void => {
            //         helper.getElement('#' + helper.id + '_aggregate').click();
            //         const aggregatePopup: HTMLElement = helper.getElement('#' + helper.id + '_aggregate-popup');
            //         expect(aggregatePopup.classList).toContain('e-popup-open');
            //         expect(aggregatePopup.firstElementChild.childElementCount).toBe(5);
            //         expect(aggregatePopup.querySelector('.e-item').textContent).toBe('Count: 4');
            //         helper.invoke('copy').then((): void => {
            //             helper.invoke('paste', ['C3']);
            //             setTimeout((): void => {
            //                 expect(spreadsheet.sheets[0].rows[2].cells[2].value.toString()).toBe('20');
            //                 expect(spreadsheet.sheets[0].rows[3].cells[3].value.toString()).toBe('7');
            //                 done();
            //             });
            //         });
            //     });
            // });
        });
        describe('F161227 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ allowResizing: false, enableContextMenu: false, allowUndoRedo: false, allowScrolling: false,
                    allowFindAndReplace: false, showRibbon: false, showFormulaBar: false, showSheetTabs: false, allowOpen: false, allowSave:
                    false, allowSorting: false, allowFiltering: false, allowNumberFormatting: false, allowHyperlink: false, allowInsert:
                    false, allowDelete: false, allowDataValidation: false, allowChart: false, allowConditionalFormat: false, height: 1500,
                    sheets: [{ rowCount: 16, rows: [{ cells: [{ image: [{ src:
                        "https://ravennaareachamber.com/wp-content/uploads/2017/03/your-company-lsiting.png", height: 70, width: 100,
                        top: 2, left: 10 }] }, { index: 2, value: 'LOCKED' }, { value: 'LOCKED' }] }, { cells: [{index: 2, value: 'LOCKED'
                        }, { value: 'UNLOCKED' }] }, { cells: [{ value: 'LOCKED' }, { value: 'LOCKED' }, { value: 'LOCKED' }, { value:
                        'LOCKED' }, { value: 'LOCKED' }] }, { index: 15, cells: [{ value: 'LOCKED' }, { index: 4, value: 'LOCKED' }] }] }],
                    beforeSelect: (args: BeforeSelectEventArgs): void => {
                        const range: number[] = getRangeIndexes(args.range);
                        const sheet: SheetModel = helper.getInstance().getActiveSheet();
                        const cell: CellModel = getCell(range[0], range[1], sheet);
                        if (sheet.isProtected) args.cancel = true;
                        if (cell && cell.isLocked == false) args.cancel = false;
                    },
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.merge("D2:E2"); spreadsheet.merge("A1:B3"); spreadsheet.merge("A4:E4");
                        spreadsheet.protectSheet(spreadsheet.sheets[0].name, { selectCells: true, formatCells: false, formatRows: false, insertLink: false, formatColumns: false });
                        spreadsheet.lockCells("D1", false); spreadsheet.lockCells("D3", false); spreadsheet.lockCells("A6:E15", false);
                        spreadsheet.lockCells("A17", false);
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Preventing delete when a range contains locked cell', (done: Function) => {
                helper.getElement().focus();
                helper.invoke('selectRange', ['A6:D1'])
                setTimeout((): void => {
                    helper.triggerKeyNativeEvent(46);
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[0].cells[0].image).toBeDefined();
                    expect(spreadsheet.sheets[0].rows[0].cells[2].value).toBe('LOCKED');
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBe('UNLOCKED');
                    expect(spreadsheet.sheets[0].rows[2].cells[0].rowSpan).toBe(-2);
                    expect(spreadsheet.sheets[0].rows[2].cells[3].value).toBe('LOCKED');
                    expect(spreadsheet.sheets[0].rows[2].cells[3].isLocked).toBeFalsy();
                    (helper.getInstance().serviceLocator.getService('shape') as Overlay).destroy();// Need to remove once destory of overlay service handled in image.
                    done();
                });
            });
        });
        describe('EJ2-56489 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ isProtected: true }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('To disable some toolbar items for protect sheet and customize the edit alert dialog content', (done: Function) => {
                helper.getElement().focus();                
                const spreadsheet: Spreadsheet = helper.getInstance();
                const id: string = '#' + helper.id;
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                    if (args.dialogName == "EditAlertDialog") {
                        args.content = "Custom Alert";
                    }
                };
                const overlayClass: string = "e-overlay";
                expect((helper.getElement(id + '_undo') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_redo') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_cut') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_copy') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_bold') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_italic') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_line-through') as any).parentElement.classList).toContain(overlayClass);;
                expect((helper.getElement(id + '_underline') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_font_color_picker') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id+ '_fill_color_picker') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_borders') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_text_align') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_vertical_align') as any).parentElement.classList).toContain("e-overlay");
                expect((helper.getElement(id + '_wrap') as any).parentElement.classList).toContain(overlayClass);
                (helper.getElement(id).getElementsByClassName('e-toolbar-item')[2] as any).click();
                expect((helper.getElement(id + '_hyperlink') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_image') as any).parentElement.classList).toContain(overlayClass);
                expect((helper.getElement(id + '_chart-btn') as any).parentElement.classList).toContain(overlayClass);
                (helper.getElement(id).getElementsByClassName('e-toolbar-item')[3] as any).click();
                expect((helper.getElement(id + '_insert_function') as any).parentElement.classList).toContain(overlayClass);
                (helper.getElement(id).getElementsByClassName('e-toolbar-item')[4] as any).click();
                expect((helper.getElement(id + '_datavalidation') as any).parentElement.classList).toContain(overlayClass);
                helper.triggerKeyEvent('keydown', 46, null, null, null, helper.invoke('getCell', [0, 0]));
                setTimeout((): void => {
                    expect((helper.getElement(id + ' .e-editAlert-dlg' + ' .e-dlg-content') as any).innerText).toBe("Custom Alert");
                    helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                    helper.click('.e-editAlert-dlg .e-dlg-closeicon-btn');
                    done();
                });
            });
            it('Ribbon items are disabled after creating a new sheet between two protected sheets', (done: Function) => {
                helper.switchRibbonTab(1);
                const spreadsheet: Spreadsheet = helper.getInstance();
                const toolbarBtn: HTMLElement = helper.getElementFromSpreadsheet(`#${helper.id}_bold`).parentElement;
                expect(toolbarBtn.classList).toContain('e-overlay');
                expect(spreadsheet.activeSheetIndex).toBe(0);
                helper.invoke('insertSheet', [0, 0]);
                expect(toolbarBtn.classList.contains('e-overlay')).toBeFalsy();
                setTimeout((): void => {
                    expect(spreadsheet.activeSheetIndex).toBe(0);
                    done();
                });
            });
        });
        describe('EJ2-56133 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Check first two checkboxs in protect sheet dialog is selected initally', (done: Function) => {
                helper.getElement().focus();
                let listView: ListView;            
                (helper.getElement('#' + helper.id).getElementsByClassName('e-toolbar-item')[4] as any).click();
                (helper.getElement('#' + helper.id + '_protect') as any).click();
                setTimeout((): void => {
                    listView = helper.getElements('.e-listview')[0].ej2_instances[0];
                    setTimeout((): void => {
                        const selectedItems: SelectedCollection = listView.getSelectedItems() as SelectedCollection;
                        expect(selectedItems.text.indexOf('Select locked cells')).toBeGreaterThan(-1);
                        expect(selectedItems.text.indexOf('Select unlocked cells')).toBeGreaterThan(-1);
                        done();
                    });
                });
            });
            it('If Select Cells option is selected then Select Unlocked Cells option need to be selected automatically', (done: Function) => {
                helper.getElement().focus();                
                (helper.getElement('#' + helper.id).getElementsByClassName('e-toolbar-item')[4] as any).click();
                (helper.getElement('#' + helper.id + '_protect') as any).click();
                let lisView: ListView;
                setTimeout((): void => {
                    lisView = helper.getElements('.e-listview')[0].ej2_instances[0];
                     lisView.selectItem({ id: '1'});
                    setTimeout((): void => {
                        const selectedItems: SelectedCollection = lisView.getSelectedItems() as SelectedCollection;
                        expect(selectedItems.text.indexOf('Select unlocked cells')).toBeGreaterThan(-1);
                        done();
                    });
                });
            });
            it('If Select Unlocked Cells option is unselected then Select locked Cells option need to be unselected ', (done: Function) => {
                helper.getElement().focus();                
                (helper.getElement('#' + helper.id).getElementsByClassName('e-toolbar-item')[4] as any).click();
                (helper.getElement('#' + helper.id + '_protect') as any).click();
                let lisView: ListView;
                setTimeout((): void => {
                    lisView = helper.getElements('.e-listview')[0].ej2_instances[0];
                    lisView.uncheckItem({id: '6'});
                    setTimeout((): void => {
                        const selectedItems: SelectedCollection = lisView.getSelectedItems() as SelectedCollection;
                        expect(selectedItems.text.indexOf('Select unlocked cells')).toEqual(-1);
                        done();
                    });
                });
            });
            it('Selection need to hide while select both locked and unlocked cells options ', (done: Function) => {
                helper.getElement().focus();                
                setTimeout((): void => {
                    expect(helper.getElements('.e-protected')[0]).toBeUndefined();
                    done();
                });
            });
        });
        describe('I328018 ->', () => { 
            beforeEach((done: Function) => { 
                helper.initializeSpreadsheet({ allowResizing: false, enableContextMenu: false, allowUndoRedo: false, allowScrolling: false,
                    allowFindAndReplace: false, showRibbon: false, showFormulaBar: true, showSheetTabs: false, allowOpen: false, allowSave:
                    false, allowSorting: false, allowFiltering: false, allowNumberFormatting: false, allowHyperlink: false, allowInsert:
                    false, allowDelete: false, allowDataValidation: false, allowChart: false, allowConditionalFormat: false, height: 1500,
                    sheets: [{ rowCount: 16, rows: [{ cells: [{index: 2, value: 'LOCKED'
                        }, { value: 'UNLOCKED' }] }, { cells: [{ value: 'LOCKED' }, { value: 'LOCKED' }, { value: 'LOCKED' }, { value:
                        'LOCKED' }, { value: 'LOCKED' }] }, { index: 15, cells: [{ value: 'LOCKED' }, { index: 4, value: 'LOCKED' }] }] }],
                        beforeSelect: (args: BeforeSelectEventArgs): void => {
                            const range: number[] = getRangeIndexes(args.range);
                            const sheet: SheetModel = helper.getInstance().getActiveSheet();
                            const cell: CellModel = getCell(range[0], range[1], sheet);
                            if (sheet.isProtected) args.cancel = true;
                            if (cell && cell.isLocked == false) args.cancel = false;
                        },
                        created: (): void => {
                            const spreadsheet: Spreadsheet = helper.getInstance();
                            spreadsheet.merge("D2:E2"); spreadsheet.merge("A1:B3"); spreadsheet.merge("A4:E4");
                            spreadsheet.protectSheet(spreadsheet.sheets[0].name, { selectCells: true, formatCells: false, formatRows: false, insertLink: false, formatColumns: false});
                            spreadsheet.lockCells("D1", false); spreadsheet.lockCells("D3", false); spreadsheet.lockCells("A6:E15", false);
                            spreadsheet.lockCells("A17", false);
                        }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Editing is not working in formula bar for unlocked cells', (done: Function) => {
                helper.getElement().focus();
                helper.invoke('selectRange', ['D1']);
                expect(helper.getInstance().sheets[0].selectedRange).toEqual('D1:D1');
                setTimeout((): void => {
                    helper.triggerKeyNativeEvent(46);
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[0].cells[2].value).toBe('LOCKED');
                    expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBe('LOCKED');
                    expect(spreadsheet.sheets[0].rows[2].cells[0].rowSpan).toBe(-2);
                    expect(spreadsheet.sheets[0].rows[2].cells[3].isLocked).toBeFalsy();
                    setTimeout(() => {
                        let editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar');
                        editorElem.click();
                        editorElem.value = 'Edit';
                        helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar'), helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar'));
                        editorElem.value = 'Edited';
                        helper.triggerKeyNativeEvent(46);
                        done();
                    });
                });
            });
        });
        describe('EJ2-39934->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: [{ 'Employee ID': '2963633', 'Employee Name': 'Kylie Phettis', 'Gender': 'Female',
                    'Department': 'Marketing', 'Date of Joining': '03/18/2011', 'Salary': '$26038.56', 'City': 'Huangzhai' }] }], selectedRange: 'B1:B1' }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A1:F1');
                        spreadsheet.protectSheet(
                            'Sheet1', { selectCells: true, formatCells: false, formatRows: false, formatColumns: false, insertLink: false });
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Dropdownlist(list validation) value changed when enable the lock cell', (done: Function) => {
                let td: HTMLElement = helper.invoke('getCell', [1, 1]);
                helper.triggerMouseAction('dblclick', { x: td.getBoundingClientRect().left + 2, y:
                td.getBoundingClientRect().top + 2 }, null, td);
                setTimeout(() => {
                    const dialog: HTMLElement = helper.getElement('.e-editAlert-dlg.e-dialog');
                    expect(!!dialog).toBeTruthy();
                    //expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                    helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                    setTimeout(() => {
                        helper.invoke('addDataValidation', [{ type: "List", operator: "Between", value1: "a,b,c" }, 'A3']);
                        helper.invoke('selectRange', ['A3']);
                        const td: HTMLElement = helper.invoke('getCell', [2, 0]);
                        (td.querySelector('.e-dropdownlist') as any).ej2_instances[0].dropDownClick({ preventDefault: function () { }, target: td.children[0] });
                        setTimeout(() => {
                            helper.click('.e-ddl.e-popup li:nth-child(1)');
                            setTimeout(() => {
                                const dialog: HTMLElement = helper.getElement('.e-editAlert-dlg.e-dialog');
                                expect(!!dialog).toBeTruthy();
                                expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                                done();
                            });
                        });
                    });
                }, 100);
            });
        });
        describe('EJ2-49892', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ showRibbon: true,
                    sheets: [{ rows: [{ cells: [{ value: '1' }, { value: '2'}, { value: '3'}] }] ,selectedRange: 'A1:C1' }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.protectSheet(
                            'Sheet1', { selectCells: true, formatCells: true, formatRows: true, formatColumns: true, insertLink: false });
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('External copy paste not properly working while preventing Edit alert Dialog on Mac', (done: Function) => {
                helper.invoke('lockCells', ['A1:C100', false]);
                helper.invoke('selectRange', ['A1:C1']);
                helper.getElement('#' + helper.id + '_copy').click();
                setTimeout(() => {
                    helper.invoke('selectRange', ['D4']);
                    helper.getElement('#' + helper.id + '_paste').click();
                    setTimeout(() => {
                        const dialog: HTMLElement = helper.getElement('.e-editAlert-dlg.e-dialog');
                        expect(!!dialog).toBeTruthy();
                        expect(dialog.classList.contains('e-popup-open')).toBeTruthy();
                        expect(dialog.querySelector('.e-dlg-content').textContent).toBe(
                        "The cell you're trying to change is protected. To make change, unprotect the sheet.");
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        (spreadsheet.serviceLocator.getService(dlg) as Dialog).hide();
                        setTimeout(() => {
                            helper.invoke('selectRange', ['A5']);
                            helper.getElement('#' + helper.id + '_paste').click();
                            setTimeout(() => {
                                done();
                            });
                        });
                    }, 100);
                });
            });
        });
        describe('EJ2-54827->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ isProtected: true, protectSettings: { selectCells: true, formatCells: false, formatRows: true, insertLink:
                        false, formatColumns: true }, rows: [{ cells: [{ value: '2' }] }] }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.lockCells("A2:A10", false);
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Autofill function working improperly when lockcells as false for selected range->', (done: Function) => {
                helper.invoke('autoFill', ['A2:A5', 'A1', 'Down', 'CopyCells']);
                expect(helper.getInstance().sheets[0].rows[2].cells[0].value).toBe(2);
                done();
            });
        });
        describe('EJ2-60129 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.protectSheet('Sheet1', { selectCells: false}, "syncfusion");
                    }
                 }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Need to consider the password when selecting the unprotect sheet option in the sheet tab context menu', (done: Function) => {
                let sheetTabEle: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-item.e-active');
                let coords: DOMRect = <DOMRect>sheetTabEle.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, sheetTabEle);
                setTimeout(() => {
                    helper.click('#' + helper.id + '_contextmenu li:nth-child(6)');
                    setTimeout(() => {
                        expect(helper.getElementFromSpreadsheet('.e-dlg-container .e-unprotectworksheet-dlg.e-dialog')).not.toBeNull();
                        done();
                    });
                });
            });
        });
        describe('EJ2-855321 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{}, { rows: [{ cells: [{ value: 'test' }] }], isProtected: true }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cross sheet referencing of protected cell reference to the formula argument are restricted in spreadsheet', (done: Function) => {
                helper.invoke('startEdit');
                setTimeout(() => {
                    helper.getElement('.e-spreadsheet-edit').textContent = '=';
                    helper.getInstance().editModule.editCellData.value = '=';
                    (<HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar')).value = '=';
                    setTimeout(() => {
                        const sheetTabs: HTMLElement[] = [].slice.call(helper.getElements('.e-sheet-tab-panel .e-toolbar-item'));
                        (sheetTabs[sheetTabs.length - 1].querySelector('.e-tab-wrap') as HTMLElement).click();
                        setTimeout(() => {
                            helper.getElement('.e-spreadsheet-edit').textContent = '=Sheet2!A1';
                            helper.getInstance().editModule.editCellData.value = '=Sheet2!A1';
                            (<HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar')).value = '=Sheet2!A1';
                            helper.triggerKeyEvent('keydown', 13, null, false, false, (<HTMLInputElement>helper.getElementFromSpreadsheet('.e-formula-bar-panel .e-formula-bar')));
                            setTimeout(() => {
                                expect(helper.getInstance().sheets[0].rows[0].cells[0].formula).toBe('=Sheet2!A1');
                                expect(helper.getInstance().sheets[0].rows[0].cells[0].value).toBe('test');
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            });
        });
        describe('CR-895594', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: 'spreadsheet' }] }], isProtected: true }, { rows: [{ cells: [{ value: 'spreadsheet' }] }], isProtected: true }, { rows: [{ cells: [{ value: 'spreadsheet' }] }], isProtected: true }], activeSheetIndex: 1 }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('When unprotecting a non-active sheet using the unprotectSheet() method, activeSheet gets unprotected', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].isProtected).toBe(true);
                spreadsheet.unprotectSheet(0);
                setTimeout(() => {
                    expect(spreadsheet.sheets[1].isProtected).toBe(true);
                    expect(spreadsheet.sheets[0].isProtected).toBe(false);
                    done();
                });
            });
        });
    });

    describe('Checking updateAction method for the protect workbook and lock cells ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, {}], activeSheetIndex: 1 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect Workbook through updateAction method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const args = { action: 'protectWorkbook', eventArgs: { isProtected: true, password: 'Spreadsheet' } };
            helper.getInstance().updateAction(args);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(1);
                done();
            });
        });
        it('Unprotect Workbook through updateAction method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const args = { action: 'protectWorkbook', eventArgs: { isProtected: false } };
            helper.getInstance().updateAction(args);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(1);
                done();
            });
        });
        it('Unprotect Sheet through updateAction method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            let args = {
                action: 'protectSheet', eventArgs: {
                    isProtected: true, password: 'Spreadsheet', protectSettings: {
                        selectCells: true,
                        formatCells: false,
                        formatRows: false,
                        formatColumns: false,
                        insertLink: false
                    }
                }
            };
            helper.getInstance().updateAction(args);
            args = {
                action: 'protectSheet', eventArgs: {
                    isProtected: false, password: '', protectSettings: {
                        selectCells: false,
                        formatCells: false,
                        formatRows: false,
                        formatColumns: false,
                        insertLink: false
                    }
                }
            };
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toBe(1);
                done();
            });
        });
        it('Lock cells using updateAction method', function (done) {
            let args = { action: 'lockCells', eventArgs: { range: 'Sheet1!C1:C10' } };
            helper.getInstance().updateAction(args);
            expect(helper.getInstance().activeSheetIndex).toEqual(1);
            done();
        });
        it('Chart Design using updateAction method', function (done) {
            let args = { action: 'chartDesign', eventArgs: {} };
            helper.getInstance().updateAction(args);
            expect(helper.getInstance().activeSheetIndex).toEqual(1);
            done();
        });
        it('Add note using updateAction method', function (done) {
            let args = { action: 'addNote', eventArgs: { address: 'Sheet1!C1' } };
            helper.getInstance().updateAction(args);
            expect(helper.getInstance().activeSheetIndex).toEqual(1);
            done();
        });
    });

    describe('Protect sheet dialog checkbox->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[0] as HTMLElement).click();
                expect((helper.getElements('.e-protect-dlg.e-primary')[0] as HTMLInputElement).disabled).toBe(true);
                (document.getElementsByClassName('e-frame e-icons')[0] as HTMLElement).click();
                expect((helper.getElements('.e-protect-dlg.e-primary')[0] as HTMLInputElement).disabled).toBe(false);
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });
    });

    describe('Protect sheet hyperlink->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[6] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                helper.switchRibbonTab(2);
                expect(helper.getElements('.e-overlay').length).toBe(3);
                let btnDisable: boolean = (helper.getElements('#spreadsheet_hyperlink')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
                expect(btnDisable).toBeTruthy();
                done();
            });
        });
        it('LockCells', (done: Function) => {
            helper.invoke('lockCells', ['A2:A100', false]);
            helper.invoke('selectRange', ['B4']);
            helper.invoke('selectRange', ['A2']);
            let btnDisable: boolean = (helper.getElements('#' + helper.id + '_hyperlink')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeFalsy();
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            let td: HTMLTableCellElement = helper.invoke('getCell', [1, 0]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            btnDisable = (helper.getElements('#' + helper.id + '_cmenu_hyperlink')[0] as HTMLInputElement).classList.contains('e-disabled');
            expect(btnDisable).toBeFalsy();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            helper.invoke('selectRange', ['B2']);
            btnDisable = (helper.getElements('#' + helper.id + '_hyperlink')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeTruthy();
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            td = helper.invoke('getCell', [1, 1]);
            coords = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            btnDisable = (helper.getElements('#' + helper.id + '_cmenu_hyperlink')[0] as HTMLInputElement).classList.contains('e-disabled');
            expect(btnDisable).toBeTruthy();
            done();
        });
    });

    describe('Protect sheet internal method hyperlink->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.invoke('protectSheet', ['Sheet1', { selectCells: true, formatCells: true }]);
            expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
            done();
        });
        it('Check hyperlink', (done: Function) => {
            helper.switchRibbonTab(2);
            let btnDisable: boolean = (helper.getElements('#spreadsheet_hyperlink')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeTruthy();
            done();
        });
        it('LockCells check', (done: Function) => {
            helper.invoke('lockCells', ['A2:A100', false]);
            helper.invoke('selectRange', ['B4']);
            helper.invoke('selectRange', ['A2']);
            let btnDisable: boolean = (helper.getElements('#' + helper.id + '_hyperlink')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeTruthy();
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            let td: HTMLTableCellElement = helper.invoke('getCell', [1, 0]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            btnDisable = (helper.getElements('#' + helper.id + '_cmenu_hyperlink')[0] as HTMLInputElement).classList.contains('e-disabled');
            expect(btnDisable).toBeTruthy();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            helper.invoke('selectRange', ['B2']);
            btnDisable = (helper.getElements('#' + helper.id + '_hyperlink')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeTruthy();
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            td = helper.invoke('getCell', [1, 1]);
            coords = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            btnDisable = (helper.getElements('#' + helper.id + '_cmenu_hyperlink')[0] as HTMLInputElement).classList.contains('e-disabled');
            expect(btnDisable).toBeTruthy();
            done();
        });
    });

    describe('Protect check context-menu ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ name: 'Sheet', ranges: [{ dataSource: defaultData }], isProtected: true },
                { name: 'Sheets', ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Check', (done: Function) => {
            let sheetTabEle: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-item.e-active');
            let coords: DOMRect = <DOMRect>sheetTabEle.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, sheetTabEle);
            setTimeout(() => {
                let btnText: string =  (document.getElementById('spreadsheet_cmenu_protect') as HTMLElement).textContent;
                expect(btnText).toBe('Unprotect Sheet');
                done();
            });
        });
        it('Open sheet tab context menu', (done: Function) => {
            let sheetTabEle: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-toolbar-items.e-sheet-tabs-items')
                .querySelectorAll('.e-sheet-tab .e-toolbar-item')[1];
            let coords: DOMRect = <DOMRect>sheetTabEle.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, sheetTabEle);
            setTimeout(() => {
                let btnText: string = (document.getElementById('spreadsheet_cmenu_protect') as HTMLElement).textContent;
                expect(btnText).toBe('Protect Sheet');
                done();
            });
        });
    });

    describe('Undo protect cells ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[3] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[4] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[5] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[6] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });
        it('Cell Edit', (done: Function) => {
            helper.invoke('lockCells', ['A3', false]);
            helper.edit('A3', 'Hi');
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Hi');
            helper.switchRibbonTab(1);
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Sports Shoes');
            helper.invoke('selectRange', ['A3']);
        });
        it('Delete in unlocked cell', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('');
                done();
            });
        });
    });

    describe('Sort & Filter context menu ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[3] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[4] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[5] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[6] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });
        it('Unlock cells', (done: Function) => {
            helper.invoke('lockCells', ['A1:H10', false]);
            let td: HTMLTableCellElement = helper.invoke('getCell', [4, 4]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').classList).toContain('e-disabled');
                done();
            }, 10);
        });
        it('Check lock cells', (done: Function) => {
            helper.invoke('selectRange', ['M4']);
            let td: HTMLTableCellElement = helper.invoke('getCell', [3, 12]);
            let coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(() => {
                expect(helper.getElement('#' + helper.id + '_contextmenu li:nth-child(9)').classList).toContain('e-disabled');
                done();
            }, 10);
        });
    });

    describe('Paste icon context menu ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[3] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[4] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[5] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[6] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });
        it('Check paste icon', (done: Function) => {
            helper.switchRibbonTab(1);
            let btnDisable: boolean = (helper.getElements('#spreadsheet_paste')[0] as HTMLInputElement).parentElement.parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeTruthy();
            helper.invoke('lockCells', ['A1:H10', false]);
            helper.invoke('selectRange', ['D4']);
            helper.getElement('#' + helper.id + '_copy').click();
            done();
        });
        it('Check paste icon-1', (done: Function) => {
            let td: HTMLElement = helper.invoke('getCell', [4, 5]);
            let coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left + 1, y: coords.top }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top }, document, td);
            let btnDisable: boolean = (helper.getElements('#spreadsheet_paste')[0] as HTMLInputElement).parentElement.parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeFalsy();
            td = helper.invoke('getCell', [4, 12]);
            coords = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left + 1, y: coords.top }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top }, document, td);
            btnDisable = (helper.getElements('#spreadsheet_paste')[0] as HTMLInputElement).parentElement.parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeTruthy();
            done();
        });
    });

    describe('Insert func icon ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[3] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[4] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[5] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[6] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });
        it('Check insert func icon', (done: Function) => {
            helper.switchRibbonTab(3);
            const btnDisable: boolean = (helper.getElements('#spreadsheet_insert_function')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeTruthy();
            helper.invoke('lockCells', ['A1:H10', false]);
            done();
        });
        it('Icon check', (done: Function) => {
            let td: HTMLElement = helper.invoke('getCell', [4, 3]);
            let coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left + 1, y: coords.top }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top }, document, td);
            const btnDisable: boolean = (helper.getElements('#spreadsheet_insert_function')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeFalsy();
            done();
        });
        it('Check insert func icon-1', (done: Function) => {
            let td: HTMLElement = helper.invoke('getCell', [4, 10]);
            let coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left + 1, y: coords.top }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top }, document, td);
            const btnDisable: boolean = (helper.getElements('#spreadsheet_insert_function')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeTruthy();
            done();
        });
    });

    describe('Unlock cells ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[3] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[4] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[5] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[6] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });
        it('Cell Edit', (done: Function) => {
            helper.invoke('lockCells', ['A:A', false]);
            helper.edit('A3', 'Hi');
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Hi');
            helper.edit('A14', 'Hi');
            expect(helper.invoke('getCell', [13, 0]).textContent).toBe('Hi');
            helper.invoke('selectRange', ['B3']);
            done();
        });
        it('Delete in locked cell', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                expect(helper.getElement('.e-editAlert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                expect(helper.getInstance().sheets[0].rows[2].cells[1].value).toBe('41801');
                done();
            });
        });
        it('Unlock cells', (done: Function) => {
            helper.invoke('lockCells', ['6:8', false]);
            helper.invoke('selectRange', ['D7']);
            done();
        });
        it('Delete in unlocked cell', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[3].value).toBe(undefined);
                helper.invoke('selectRange', ['D3']);
                done();
            });
        });
        it('Delete in locked cell - 1', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                expect(helper.getElement('.e-editAlert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                expect(helper.getInstance().sheets[0].rows[2].cells[3].value).toBe(20);
                done();
            });
        });
    });

    describe('Perform console methods ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });
        it('setColWidth cells', (done: Function) => {
            helper.invoke('setColWidth', [140, 2, 0]);
            expect(helper.invoke('getCell', [2, 2]).offsetWidth).toBe(64);
            done();
        });
        it('cellFormat cells', (done: Function) => {
            helper.invoke('cellFormat', [{ fontWeight: 'bold', fontSize: '12pt', backgroundColor: '#279377', color: '#ffffff' }, 'A2:E2']);
            expect(helper.invoke('getCell', [1, 2]).style.backgroundColor).toBe('');
            done();
        });
        it('Un protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            expect(helper.getInstance().sheets[0].isProtected).toBeFalsy();
            done();
        });
        it('Protect sheet-1', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[3] as HTMLElement).click();
                (document.getElementsByClassName('e-frame e-icons')[5] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });
        it('setColWidth cells-1', (done: Function) => {
            helper.invoke('setColWidth', [140, 2, 0]);
            expect(helper.invoke('getCell', [2, 2]).offsetWidth).toBe(140);
            done();
        });
        it('cellFormat cells-1', (done: Function) => {
            helper.invoke('cellFormat', [{ fontWeight: 'bold', fontSize: '12pt', backgroundColor: '#279377', color: '#ffffff' }, 'A2:E2']);
            expect(helper.invoke('getCell', [1, 2]).style.backgroundColor).toBe('rgb(39, 147, 119)');
            done();
        });
    });

    describe('Protect workbook public methods ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Switch sheet', (done: Function) => {
            helper.click('.e-sheets-list');
            helper.click('.e-popup.e-sheets-list ul li:nth-child(2)');
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 5]).textContent).toBe('200');
                done();
            }, 100);
        });
        it('Protect workbook', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                (helper.getElementFromSpreadsheet('.e-protectworkbook-dlg input') as HTMLInputElement).value = 'hi';
                (helper.getElements('.e-protectworkbook-dlg input')[1] as HTMLInputElement).value = 'hi';
                helper.click('.e-protectworkbook-dlg .e-primary');
                done();
            });
        });
        it('Duplicate public methods', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            spreadsheet.duplicateSheet();
            setTimeout(() => {
                expect(spreadsheet.sheets.length).toBe(2);
                done();
            });
        });
        it('Insert public methods', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            spreadsheet.insertSheet();
            setTimeout(() => {
                expect(spreadsheet.sheets.length).toBe(2);
                done();
            });
        });
        it('Move sheet public methods', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            spreadsheet.moveSheet(0);
            setTimeout(() => {
                expect(spreadsheet.sheets.length).toBe(2);
                done();
            });
        });
        it('Delete public methods', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            spreadsheet.delete();
            setTimeout(() => {
                expect(spreadsheet.sheets.length).toBe(2);
                done();
            });
        });
    });

    describe('Undo Redo for lock cells ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                done();
            });
        });
        it('Unlock cells', (done: Function) => {
            helper.invoke('lockCells', ['A:H', false]);
            helper.invoke('selectRange', ['D4:G8']);
            done();
        });
        it('Delete in unlocked cells', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[3].value).toBe(undefined);
                done();
            });
        });
        it('Cell Edit', (done: Function) => {
            helper.edit('A3', 'Hi');
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Hi');
            helper.switchRibbonTab(1);
            done();
        });
        it('Undo action', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Sports Shoes');
        });
        it('Redo action', () => {
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Hi');
        });
        it('Cell Edit-1', (done: Function) => {
            helper.edit('A3', 'Hello');
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Hello');
            done();
        });
        it('Lock cells', (done: Function) => {
            helper.invoke('lockCells', ['A:H', true]);
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Hello');
            done();
        });
        it('Undo action-1', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Hi');
        });
        it('Undo action-2', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.invoke('getCell', [2, 0]).textContent).toBe('Sports Shoes');
        });
        it('Undo action-3', () => {
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.getInstance().sheets[0].rows[6].cells[3].value).toBe(40);
            helper.invoke('selectRange', ['E5']);
        });
        it('Delete in locked cell', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                helper.setAnimationToNone('.e-editAlert-dlg.e-dialog');
                expect(helper.getElement('.e-editAlert-dlg.e-dialog')).not.toBeNull();
                helper.click('.e-editAlert-dlg .e-footer-content button:nth-child(1)');
                expect(helper.getInstance().sheets[0].rows[2].cells[3].value).toBe(20);
                done();
            });
        });
    });

    describe('Sort & Filter icon ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Check', (done: Function) => {
            let btnDisable: boolean = (helper.getElements('.e-sort-filter-ddb.e-icon-btn')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeFalsy();
            done();
        });
        it('Protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg.e-dialog');
                (document.getElementsByClassName('e-frame e-icons')[3] as HTMLElement).click();
                helper.click('.e-protect-dlg .e-primary');
                expect(helper.getInstance().sheets[0].isProtected).toBeTruthy();
                helper.switchRibbonTab(1);
                let btnDisable: boolean = (helper.getElements('.e-sort-filter-ddb.e-icon-btn')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
                expect(btnDisable).toBeTruthy();
                done();
            });
        });
        it('Un protect sheet', (done: Function) => {
            helper.switchRibbonTab(4);
            helper.click('#' + helper.id + '_protect');
            expect(helper.getInstance().sheets[0].isProtected).toBeFalsy();
            done();
        });
        it('Check-1', (done: Function) => {
            helper.switchRibbonTab(1);
            let btnDisable: boolean = (helper.getElements('.e-sort-filter-ddb.e-icon-btn')[0] as HTMLInputElement).parentElement.classList.contains('e-overlay');
            expect(btnDisable).toBeFalsy();
            done();
        });
    });
});