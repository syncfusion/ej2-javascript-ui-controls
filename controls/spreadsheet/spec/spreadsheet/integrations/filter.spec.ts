import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, filterData } from '../util/datasource.spec';
import { Spreadsheet, filterByCellValue, refreshCheckbox } from '../../../src/index';
import { classList, getComponent } from '@syncfusion/ej2-base';

describe('Filter ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    
    describe('Actions ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply Filter using public method', (done: Function) => {
            helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).children[0].classList).toContain('e-filter-btn');
                expect(helper.invoke('getCell', [0, 4]).children[0].children[0].classList).toContain('e-filtered');
                done();
            });
        });

        it('Clear Filter using public method', (done: Function) => {
            helper.invoke('clearFilter', ['E']);
            expect(helper.invoke('getCell', [0, 4]).children[0].children[0].classList).not.toContain('e-filtered');
            done();
        });

        it('Remove Filter using public method', (done: Function) => {
            helper.invoke('applyFilter', [null, 'A1:A1']);
            expect(helper.invoke('getCell', [0, 1]).children[0]).toBeUndefined();
            done();
        });

        it('Apply and remove filter using toolbar', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            const firstCell: HTMLElement = helper.invoke('getCell', [0, 0]);
            const lastCell: HTMLElement = helper.invoke('getCell', [0, spreadsheet.sheets[0].usedRange.colIndex]);
            expect(firstCell.querySelector('.e-filter-icon')).toBeNull();
            expect(lastCell.querySelector('.e-filter-icon')).toBeNull();
            helper.getElement('#' + helper.id + '_sorting').click();
            helper.getElement('#' + helper.id + '_applyfilter').click();
            expect(firstCell.querySelector('.e-filter-icon')).not.toBeNull();
            expect(lastCell.querySelector('.e-filter-icon')).not.toBeNull();
            expect(spreadsheet.filterModule.filterRange.size).toBe(1);
            expect(spreadsheet.filterModule.filterRange.get(0).range).toEqual([0, 0, 10, 7]);
            expect(spreadsheet.filterModule.filterRange.get(0).useFilterRange).toBeFalsy();
            expect(spreadsheet.filterModule.filterCollection.size).toBe(1);
            expect(spreadsheet.filterModule.filterCollection.get(0)).toEqual([]);
            helper.getElement('#' + helper.id + '_sorting').click();
            helper.getElement('#' + helper.id + '_applyfilter').click();
            expect(firstCell.querySelector('.e-filter-icon')).toBeNull();
            expect(lastCell.querySelector('.e-filter-icon')).toBeNull();
            expect(spreadsheet.filterModule.filterRange.size).toBe(0);
            expect(spreadsheet.filterModule.filterCollection.size).toBe(0);
            helper.getElement('#' + helper.id + '_sorting').click();
            helper.getElement('#' + helper.id + '_applyfilter').click();
            done();
        });

        it('Filter popup open close using key action', (done: Function) => {
            helper.invoke('getCell', [0, 0]).focus();
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
            setTimeout(() => {
                let filterPopup: HTMLElement = helper.getElement().lastElementChild;
                expect(filterPopup.classList.contains('e-filter-popup')).toBeTruthy();
                expect(parseInt(filterPopup.style.left, 10)).toBeGreaterThan(0); // Left collision check
                helper.triggerKeyNativeEvent(38, false, false, null, 'keydown', true);
                expect(helper.getElement().querySelector('.e-filter-popup')).toBeNull();
                done();
            });
        });
    });

    describe('Date column filter ->', () => {
        const dataSource: Object[] = [
            { 'Item Name': 'Casual Shoes', Date: '02/14/2014', Amount: 200 },
            { 'Item Name': 'Sports Shoes', Date: '06/11/2016', Amount: 600 },
            { 'Item Name': 'Formal Shoes', Date: '07/27/2014', Amount: 300 },
            { 'Item Name': 'Sandals & Floaters', Date: '11/21/2014', Amount: 300 },
            { 'Item Name': 'Flip- Flops & Slippers', Date: '06/23/2015', Amount: 300 },
            { 'Item Name': 'Sneakers', Date: '07/22/2014', Amount: 800 },
            { 'Item Name': 'Running Shoes', Date: '02/04/2014', Amount: 200 },
            { 'Item Name': 'Loafers', Date: '11/30/2015', Amount: 310 },
            { 'Item Name': 'Cricket Shoes', Date: '07/09/2014', Amount: 1210 },
            { 'Item Name': 'T-Shirts', Date: '10/31/2014', Amount: 500 },
        ];
        let spreadsheet: any; let checkboxList: HTMLElement; let ulList: HTMLElement; let treeObj: any; let filterCol: any[];
        let selectAll: HTMLElement;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: dataSource }], selectedRange: 'B1:B1' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Date filter popup rendering check', (done: Function) => {
            helper.invoke('applyFilter');
            helper.invoke('numberFormat', ['dddd, mmmm dd, yyyy', 'B2']);
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 1]);
            helper.invoke('selectRange', ['B1']);
            helper.invoke('getCell', [0, 1]).focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                checkboxList = helper.getElement('.e-checkboxlist');
                expect(checkboxList.childElementCount).toBe(0);
                setTimeout(() => {
                    expect(checkboxList.childElementCount).toBe(2);
                    selectAll = checkboxList.firstElementChild as HTMLElement;
                    expect(selectAll.classList.contains('e-spreadsheet-ftrchk')).toBeTruthy();
                    expect(selectAll.querySelector('.e-selectall').classList.contains('e-check')).toBeTruthy();
                    expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeTruthy();
                    const searchBox: HTMLInputElement = helper.getElement().querySelector('.e-searchinput');
                    // EJ2-62078 -> backspace key in search area without performing search operation.
                    helper.getInstance().notify(refreshCheckbox, { event: { type: 'keyup', keyCode: 8, target: searchBox } });
                    done();
                });
            });
        });
        it('Treeview rendering check', (done: Function) => {
            expect(checkboxList.lastElementChild.classList.contains('e-checkboxtree')).toBeTruthy();
            treeObj = getComponent(checkboxList.lastElementChild as HTMLElement, 'treeview');
            expect(treeObj.fields.id).toBe('__rowIndex');
            expect(treeObj.fields.parentID).toBe('pId');
            expect(treeObj.fields.text).toBe('B');
            expect(treeObj.fields.hasChildren).toBe('hasChild');
            expect(treeObj.fields.dataSource.length).toBe(20);
            expect(treeObj.fields.dataSource.length === treeObj.checkedNodes.length).toBeTruthy();
            expect(treeObj.fields.dataSource[0]['__rowIndex']).toBe('2016');
            expect(treeObj.fields.dataSource[1]['B']).toBe('2015');
            expect(treeObj.fields.dataSource[2]['hasChild']).toBeTruthy();
            expect(treeObj.fields.dataSource[0]['pId']).toBeUndefined();
            expect(treeObj.fields.dataSource[4]['__rowIndex']).toBe('2016 June');
            expect(treeObj.fields.dataSource[4]['B']).toBe('June');
            expect(treeObj.fields.dataSource[9]['hasChild']).toBeTruthy();
            expect(treeObj.fields.dataSource[6]['pId']).toBe('2014');
            expect(treeObj.fields.dataSource[19]['__rowIndex']).toBe('2014 October 31');
            expect(treeObj.fields.dataSource[19]['B']).toBe(31);
            expect(treeObj.fields.dataSource[17]['hasChild']).toBeUndefined();
            expect(treeObj.fields.dataSource[15]['pId']).toBe('2014 July');
            expect(treeObj.fields.dataSource[13]['B']).toBe(14);
            expect(treeObj.fields.dataSource[13]['pId']).toBe('2014 February');
            expect(treeObj.fields.dataSource[13]['__rowIndex']).toBe('2014 February 14');
            ulList = checkboxList.lastElementChild.querySelector('.e-ul');
            expect(ulList.childElementCount).toBe(3);
            expect(ulList.getElementsByClassName('e-check').length).toBe(3);
            done();
        });
        it('Checkbox interaction and filtering', (done: Function) => {
            selectAll.click();
            expect(selectAll.querySelector('.e-selectall').classList.contains('e-check')).toBeFalsy();
            expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeFalsy();
            expect(ulList.getElementsByClassName('e-check').length).toBe(0);
            const okBtn: HTMLButtonElement = helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary');
            expect(okBtn.disabled).toBeTruthy();
            selectAll.click();
            expect(selectAll.querySelector('.e-selectall').classList.contains('e-check')).toBeTruthy();
            expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeTruthy();
            expect(ulList.getElementsByClassName('e-check').length).toBe(3);
            expect(okBtn.disabled).toBeFalsy();
            const list: HTMLElement = ulList.children[1].querySelector('.e-frame');
            let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
            list.dispatchEvent(e);
            e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            list.dispatchEvent(e);
            e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
            list.dispatchEvent(e);
            expect(list.parentElement.querySelector('.e-check')).toBeNull();
            expect(selectAll.querySelector('.e-check')).toBeNull();
            expect(selectAll.querySelector('.e-selectall').classList.contains('e-stop')).toBeTruthy();
            expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeFalsy();
            okBtn.click();
            spreadsheet = helper.getInstance();
            filterCol = spreadsheet.filterModule.filterCollection.get(0);
            expect(filterCol.length).toBe(2);
            expect(filterCol[0].type).toBe('date');
            expect(filterCol[0].predicate).toBe('and');
            expect(filterCol[0].operator).toBe('notequal');
            let date: Date = filterCol[0].value as Date;
            expect(date.getDate()).toBe(23);
            expect(date.getMonth()).toBe(5);
            expect(date.getFullYear()).toBe(2015);
            date = filterCol[1].value as Date;
            expect(date.getDate()).toBe(30);
            expect(date.getMonth()).toBe(10);
            expect(date.getFullYear()).toBe(2015);
            done();
        });
        it('Checkbox rendering with same filtered column and Clear filter action', (done: Function) => {
            spreadsheet.element.focus();
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
            setTimeout(() => {
                setTimeout(() => {
                    checkboxList = helper.getElement('.e-checkboxlist');
                    expect((getComponent(checkboxList.lastElementChild as HTMLElement, 'treeview') as any).checkedNodes.length).toBe(15);
                    selectAll = checkboxList.firstElementChild as HTMLElement;
                    expect(selectAll.querySelector('.e-selectall').classList.contains('e-stop')).toBeTruthy();
                    expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeFalsy();
                    ulList = checkboxList.lastElementChild.querySelector('.e-ul');
                    expect(ulList.children[1].querySelector('.e-check')).toBeNull();
                    selectAll.click();
                    expect(selectAll.querySelector('.e-stop')).toBeNull();
                    expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeTruthy();
                    expect(ulList.getElementsByClassName('e-check').length).toBe(3);
                    helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary').click();
                    expect(filterCol.length).toBe(0);
                    done();
                });
            });
        });
        it('Checkbox rendering with other filtered column', (done: Function) => {
            helper.invoke('applyFilter', [[{
                'value': 300, 'field': 'C', 'predicate': 'and', 'operator': 'notequal', 'type': 'number', 'matchCase': false,
                'ignoreAccent': false
            }], 'A1:C11']);
            setTimeout(() => {
                expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(1);
                spreadsheet.element.focus();
                helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
                setTimeout(() => {
                    setTimeout(() => {
                        checkboxList = helper.getElement('.e-checkboxlist');
                        treeObj = getComponent(checkboxList.lastElementChild as HTMLElement, 'treeview');
                        expect(treeObj.fields.dataSource.length).toBe(15);
                        expect(treeObj.fields.dataSource.length === treeObj.checkedNodes.length).toBeTruthy();
                        done();
                    });
                });
            });
        });
        it('Searching day, month and year then filter', (done: Function) => {
            const serachBox: HTMLInputElement = helper.getElement().querySelector('.e-searchinput');
            serachBox.value = '2014';
            spreadsheet.notify('refreshCheckbox', { event: { type: 'keyup', target: serachBox } });
            expect(treeObj.fields.dataSource.length).toBe(9);
            expect(treeObj.fields.dataSource[0]['__rowIndex']).toBe('2014');
            expect(treeObj.fields.dataSource[1]['__rowIndex']).toBe('2014 February');
            expect(treeObj.fields.dataSource[6]['__rowIndex']).toBe('2014 February 14');
            expect(treeObj.fields.dataSource.length === treeObj.checkedNodes.length).toBeTruthy();
            serachBox.value = '';
            spreadsheet.notify('refreshCheckbox', { event: { type: 'click', target: serachBox } });
            expect(treeObj.fields.dataSource.length).toBe(15);
            expect(treeObj.fields.dataSource.length === treeObj.checkedNodes.length).toBeTruthy();
            spreadsheet.notify('refreshCheckbox', { event: { type: 'click', target: serachBox.parentElement.querySelector('.e-search-icon') } });
            expect(treeObj.fields.dataSource.length).toBe(15);
            serachBox.value = '30';
            spreadsheet.notify('refreshCheckbox', { event: { type: 'keyup', target: serachBox } });
            expect(treeObj.fields.dataSource.length).toBe(3);
            expect(treeObj.fields.dataSource[0]['__rowIndex']).toBe('2015');
            expect(treeObj.fields.dataSource[1]['__rowIndex']).toBe('2015 November');
            expect(treeObj.fields.dataSource[2]['__rowIndex']).toBe('2015 November 30');
            expect(treeObj.fields.dataSource.length === treeObj.checkedNodes.length).toBeTruthy();
            serachBox.value = 'Jun';
            spreadsheet.notify('refreshCheckbox', { event: { type: 'keyup', target: serachBox } });
            expect(treeObj.fields.dataSource.length).toBe(3);
            expect(treeObj.fields.dataSource.length === treeObj.checkedNodes.length).toBeTruthy();
            helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary').click();
            filterCol = spreadsheet.filterModule.filterCollection.get(0);
            expect(filterCol.length).toBe(2);
            expect(filterCol[1].operator).toBe('equal');
            expect(filterCol[1].predicate).toBe('or');
            expect(filterCol[1].type).toBe('date');
            const date: Date = filterCol[1].value as Date;
            expect(date.getDate()).toBe(11);
            expect(date.getMonth()).toBe(5);
            expect(date.getFullYear()).toBe(2016);
            done();
        });
        it('Checkbox rendering with same and other filtered columns', (done: Function) => {
            spreadsheet.element.focus();
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
            setTimeout(() => {
                setTimeout(() => {
                    checkboxList = helper.getElement('.e-checkboxlist');
                    treeObj = getComponent(checkboxList.lastElementChild as HTMLElement, 'treeview');
                    expect(treeObj.fields.dataSource.length).toBe(15);
                    expect(treeObj.checkedNodes.length).toBe(3);
                    selectAll = checkboxList.firstElementChild as HTMLElement;
                    expect(selectAll.querySelector('.e-selectall').classList.contains('e-stop')).toBeTruthy();
                    expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeFalsy();
                    ulList = checkboxList.lastElementChild.querySelector('.e-ul');
                    expect(ulList.children[0].querySelector('.e-frame').classList.contains('e-check')).toBeTruthy();
                    expect(ulList.children[1].querySelector('.e-check')).toBeNull();
                    expect(ulList.children[2].querySelector('.e-check')).toBeNull();
                    selectAll.click();
                    expect(selectAll.querySelector('.e-stop')).toBeNull();
                    expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeTruthy();
                    expect(ulList.getElementsByClassName('e-check').length).toBe(3);
                    treeObj.uncheckAll(['2014 February 14']);
                    helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary').click();
                    filterCol = spreadsheet.filterModule.filterCollection.get(0);
                    expect(filterCol.length).toBe(2);
                    expect(filterCol[1].operator).toBe('notequal');
                    const date: Date = filterCol[1].value as Date;
                    expect(date.getDate()).toBe(14);
                    expect(date.getMonth()).toBe(1);
                    expect(date.getFullYear()).toBe(2014);
                    done();
                });
            });
        });
        it('Columns with blank cell and other format cell', (done: Function) => {
            helper.invoke('updateCell', [{ value: '', format: 'General' }, 'B8']);
            helper.invoke('updateCell', [{ value: 'Test', format: 'General' }, 'B9']);
            spreadsheet.element.focus();
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
            setTimeout(() => {
                setTimeout(() => {
                    selectAll = helper.getElement('.e-spreadsheet-ftrchk');
                    selectAll.click();
                    const searchBox: HTMLInputElement = helper.getElement().querySelector('.e-searchinput');
                    searchBox.value = 'Blan';
                    spreadsheet.notify('refreshCheckbox', { event: { type: 'keyup', target: searchBox } });
                    treeObj = getComponent(helper.getElement('.e-checkboxtree'), 'treeview');
                    expect(treeObj.fields.dataSource.length).toBe(1);
                    expect(treeObj.fields.dataSource.length === treeObj.checkedNodes.length).toBeTruthy();
                    expect(treeObj.fields.dataSource[0]['__rowIndex']).toBe('blanks');
                    searchBox.value = 'Tes';
                    spreadsheet.notify('refreshCheckbox', { event: { type: 'keyup', target: searchBox } });
                    expect(treeObj.fields.dataSource.length).toBe(1);
                    expect(treeObj.fields.dataSource.length === treeObj.checkedNodes.length).toBeTruthy();
                    expect(treeObj.fields.dataSource[0]['__rowIndex']).toBe('text test');
                    helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary').click();
                    filterCol = spreadsheet.filterModule.filterCollection.get(0);
                    expect(filterCol.length).toBe(2);
                    expect(filterCol[1].value).toBe('test');
                    expect(filterCol[1].predicate).toBe('or');
                    expect(filterCol[1].type).toBe('string');
                    done();
                });
            });
        });
        it('Invalid date rendering and filtering check, SF-407671 -> Date filter options dialog date selecting is not proper', (done: Function) => {
            helper.edit('B12', '10/10/202');
            const cell: HTMLElement = helper.invoke('getCell', [11, 1]);
            expect(cell.classList.contains('e-right-align')).toBeFalsy();
            expect(cell.textContent).toBe('10/10/202');
            const actionBegin: any = spreadsheet.actionBegin;
            spreadsheet.actionBegin = (args: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    expect(args.filterModel.options.format).toBe('EEEE, MMMM d, y');
                    spreadsheet.actionBegin = actionBegin;
                }
            };
            helper.invoke('selectRange', ['B1']);
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 1]);
            helper.invoke('getCell', [0, 1]).focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                checkboxList = helper.getElement('.e-checkboxlist');
                expect(checkboxList.childElementCount).toBe(0);
                setTimeout(() => {
                    ulList = checkboxList.lastElementChild.querySelector('.e-ul');
                    expect(ulList.children[2].querySelector('.e-icon-expandable')).toBeNull();
                    expect(ulList.children[2].querySelector('.e-list-text').textContent).toBe('10/10/202');
                    treeObj = getComponent(checkboxList.lastElementChild as HTMLElement, 'treeview');
                    expect(treeObj.fields.dataSource[11]['B']).toBe('10/10/202');
                    expect(treeObj.fields.dataSource[11]['__rowIndex']).toBe('text 10/10/202');
                    const list: HTMLElement = ulList.children[1].querySelector('.e-frame');
                    let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                    list.dispatchEvent(e);
                    e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                    list.dispatchEvent(e);
                    e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                    list.dispatchEvent(e);
                    expect(list.parentElement.querySelector('.e-check')).not.toBeNull();
                    helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary').click();
                    const filterCol: any[] = spreadsheet.filterModule.filterCollection.get(0);
                    expect(filterCol.length).toBe(3);
                    expect(filterCol[0].type).toBe('number');
                    expect(filterCol[0].value).toBe(300);
                    expect(filterCol[0].operator).toBe('notequal');
                    expect(filterCol[0].predicate).toBe('and');
                    expect(filterCol[1].type).toBe('string');
                    expect(filterCol[1].value.getFullYear()).toBe(2016);
                    expect(filterCol[1].operator).toBe('notequal');
                    expect(filterCol[1].predicate).toBe('and');
                    expect(filterCol[2].type).toBe('string');
                    expect(filterCol[2].value).toBe('');
                    expect(filterCol[2].operator).toBe('notequal');
                    expect(filterCol[2].predicate).toBe('and');
                    done();
                });
            });
        });
    });
    describe('CR-Issues ->', () => {
        describe('I289560, FB22087, FB24231, SF-361036, EJ2-50631, EJ2-55605, SF-361123, SF-367021, EJ2-55527 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        spreadsheet.cellFormat({ backgroundColor: '#e56590', color: '#fff', fontWeight: 'bold', textAlign: 'center' }, 'A1:F1');
                    }
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Facing issues on spreadsheet - Filter applied after the specified range using applyFilter method', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.applyFilter(null, 'A1:F11');
                expect(!!helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                expect(!!helper.invoke('getCell', [0, 1]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                expect(!!helper.invoke('getCell', [0, 5]).querySelector('.e-filter-iconbtn')).toBeTruthy();
                expect(!!helper.invoke('getCell', [0, 6]).querySelector('.e-filter-iconbtn')).toBeFalsy();
                done();
            });

            it('Filter icon disappears after refresh', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.applyFilter([{ field: 'H', predicate: 'or', operator: 'contains', value: '10' }]);
                setTimeout(() => {
                    spreadsheet.refresh();
                    setTimeout(() => {
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                            expect(helper.invoke('getCell', [0, 7]).querySelector('.e-filtered')).not.toBeNull();
                            expect(helper.invoke('getCell', [1, 7]).textContent).toBe('10');
                            done();
                        });
                    });
                });
            });
            
            it('EJ2-53803 -> Console error issue while calling clearFilter method twice->', (done: Function) => {
                helper.invoke('clearFilter');
                helper.invoke('clearFilter');
                expect(helper.invoke('getCell', [0, 7]).children[0].children[0].classList).not.toContain('e-filtered');
                done();
            });

            it('I328009 -> Filter event argument checking', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let filterArgs: any;
                const actionComplete: any = spreadsheet.actionComplete;
                spreadsheet.actionComplete = (args: any): void => {
                    if (args.action === 'filter') {
                        filterArgs = args.eventArgs;
                    }
                }
                helper.invoke('selectRange', ['E6']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(5, 4, [6, 4], false, false);
                setTimeout(() => {
                    expect(JSON.stringify(filterArgs.predicates)).toBe(JSON.stringify(helper.getInstance().filterModule.filterCollection.get(0)));
                    expect(filterArgs.range).toBe('A1:H11');
                    spreadsheet.actionComplete = actionComplete;
                    done();
                });
            });

            it('EJ2-54849 -> Undo after filter ->', (done: Function) => {
                helper.invoke('selectRange', ['F8']);
                helper.openAndClickCMenuItem(7, 5, [6, 4], false, false);
                setTimeout(() => {
                    helper.invoke('selectRange', ['A1']);
                    helper.getElement('#' + helper.id + '_undo').click();
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filtered')).toBeNull();
                        expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                        helper.getElement('#' + helper.id + '_undo').click();
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).toBeNull();
                            expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filter-iconbtn')).toBeNull();
                            expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).toBeNull();
                            done();
                        });
                    });
                });
            });

            it('EJ2-53663 -> Console error on clear filter when manually unhide filtered row->', (done: Function) => {
                helper.invoke('selectRange', ['A2']);
                helper.openAndClickCMenuItem(1, 0, [6, 4]);
                setTimeout(() => {
                    helper.invoke('hideRow', [2, 2, false]);
                    expect(helper.getInstance().sheets[0].rows[2].hidden).toBeFalsy();
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                    helper.invoke('selectRange', ['A1']);
                    helper.getElement('#' + helper.id + '_sorting').click();
                    helper.getElement('#' + helper.id + '_clearfilter').click();
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).toBeNull();
                    done();
                });
            });

            it('Paste is not working on filtered rows', (done: Function) => {
                helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }, { field: 'E', predicate: 'or', operator: 'equal', value: '20' }], 'A1:H1']);
                setTimeout(() => {
                    helper.invoke('copy', ['A9']).then(() => {
                        helper.invoke('paste', ['A5']);
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Loafers');
                            expect(helper.invoke('getCell', [6, 0]).textContent).toBe('Sneakers');
                            done();
                        });
                    });
                });
            });

            it('Action Begin and Action Complete Events are not triggered on Clear Filters->', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                let actionBeginCalled: boolean = false; let actionCompleteCalled: boolean = false;
                const actionBegin: any = spreadsheet.actionBegin;
                const actionComplete: any = spreadsheet.actionComplete;
                spreadsheet.actionBegin = (args: any): void => {
                    if (args.action === 'filter') { actionBeginCalled = true; }
                },
                spreadsheet.actionComplete = (args: any): void => {
                    if (args.action === 'filter') { actionCompleteCalled = true; }
                }
                helper.invoke('selectRange', ['A1']);
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_clearfilter').click();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).toBeNull();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(actionBeginCalled).toBeTruthy();
                expect(actionCompleteCalled).toBeTruthy();
                spreadsheet.actionBegin = actionBegin;
                spreadsheet.actionComplete = actionComplete;
                done();
            });

            it('Filter not get removed from the sheet while apply clear all', (done: Function) => {
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_applyfilter').click();
                helper.getElement('#' + helper.id + '_clear').click();
                expect(helper.getElement('#' + helper.id + '_clear-popup ul li:nth-child(1)').textContent).toBe('Clear All');
                helper.click('#' + helper.id + '_clear-popup ul li:nth-child(1)');
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeNull();
                expect(helper.invoke('getCell', [0, 7]).querySelector('.e-filter-iconbtn')).toBeNull();
                done();
            });

            
            it('Filter popup not shown properly for blank columns->', (done: Function) => {
                helper.invoke('selectRange', ['A1:K1']);
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_applyfilter').click();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 7]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 8]).querySelector('.e-filter-iconbtn')).toBeNull();
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_applyfilter').click();
                done();
            });

            it('EJ2-56163 -> Script error while re-apply the filter with the wrap and resized row header->', (done: Function) => {
                helper.invoke('selectRange', ['A1:H1']);
                helper.getElement('#' + helper.id + '_wrap').click();
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_applyfilter').click();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                helper.invoke('setRowHeight', [60, 0]);
                expect(helper.getInstance().sheets[0].rows[0].height).toBe(60);
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_applyfilter').click();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeNull();
                done();
            });
            
            it('Filter by custom formatted (0.00) cell value not working', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                for (let i: number = 1; i < 11; i++) {
                    spreadsheet.updateCell({ format: '0.00' }, 'D' + (i + 1));
                    spreadsheet.updateCell({ format: 'dd/MM/yyyy' }, 'B' + (i + 1));
                }
                helper.invoke('selectRange', ['D4']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(3, 3, [6, 4]);
                setTimeout(() => {
                    const predicates: any[] = spreadsheet.filterModule.filterCollection.get(0);
                    expect(predicates.length).toBe(1);
                    expect(predicates[0].field).toBe('D');
                    expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[1].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[2].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[2].isFiltered).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[3].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[3].isFiltered).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[7].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[7].isFiltered).toBeFalsy();
                    expect(helper.invoke('getContentTable').rows[1].cells[3].textContent).toBe('20.00');
                    helper.invoke('selectRange', ['E2:E7']);
                    done();
                });
            });
            
            it('EJ2-50433 -> Count value is wrongly Displayed in Aggregate in Sort and Filter Sample', (done: Function) => {
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 6');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 6');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li:nth-child(2)').textContent).toBe('Sum: 115');
                helper.invoke('selectRange', ['B4']);
                done();
            });

            it('Filter by date cell value not working', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                spreadsheet.notify(filterByCellValue, null);
                setTimeout(() => {
                    const predicates: any[] = spreadsheet.filterModule.filterCollection.get(0);
                    expect(predicates.length).toBe(2);
                    expect(predicates[1].field).toBe('B');
                    expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[2].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[3].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[3].isFiltered).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[7].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[7].isFiltered).toBeTruthy();
                    expect(helper.invoke('getContentTable').rows[1].cells[1].textContent).toBe('27/07/2014');
                    done();
                });
            });

            it('EJ2-54427 - When cut and paste the filter applied column, it causes a script error.->', (done: Function) => {
                helper.invoke('selectRange', ['D1:D200']);
                helper.getElement('#' + helper.id + '_cut').click();
                setTimeout(() => {
                    helper.invoke('selectRange', ['D1']);
                    helper.openAndClickCMenuItem(0, 3, [6, 2], false, true);
                    setTimeout(() => {
                        helper.invoke('selectRange', ['E1']);
                        helper.getElement('#' + helper.id + '_paste').click();
                        setTimeout(function () {
                            expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                            expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).toBeNull();
                            expect(helper.invoke('getCell', [3, 4]).textContent).toBe('20.00');
                            done();
                        });   
                    });
                });
            });

            it('EJ2-55246 -> Click undo on cut / paste the filter applied column, the spinner spins endless->', (done: Function) => {
                expect(helper.invoke('getCell', [0, 4]).textContent).toBe('Quantity');
                helper.getElement('#' + helper.id + '_undo').click();
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 4]).textContent).toBe('');
                    done();
                });
            });

            it('Filter issue in duplicate sheet', (done: Function) => {
                helper.invoke('duplicateSheet', [0]);
                setTimeout(() => {
                    expect(helper.invoke('getCell',[0, 1]).querySelector('.e-filter-icon').classList).toContain('e-filtered');
                    // expect(helper.getInstance().filterCollection[1].filterRange).toContain('A1:H11');
                    expect(JSON.stringify(helper.getInstance().filterModule.filterRange.get(1))).toBe('{"range":[0,0,10,8]}');
                    done();
                });
            });
            
            it('EJ2-55275 -> Cell delete on the filtered rows data issue ->', (done: Function) => {
                helper.invoke('selectRange', ['B1:B4']);
                helper.triggerKeyNativeEvent(46);
                helper.invoke('selectRange', ['B1']);
                // Need to remove once empty cells are not updated in used range while  the copy / paste
                helper.getInstance().sheets[1].usedRange.rowIndex = 10;
                helper.invoke('clearFilter');
                expect(helper.invoke('getCell', [3, 1]).textContent).toBe('');
                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('14/02/2014');
                done();
            });
            
            it('EJ2-55397 - Need to fix the sorting and filtering related issues->', (done: Function) => {
                helper.invoke('selectRange', ['G2']);
                helper.openAndClickCMenuItem(1, 6, [6, 4], false, false);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 6]).querySelector('.e-filtered')).not.toBeNull();
                    expect(helper.invoke('getCell', [1, 6]).textContent).toBe('200');
                    expect(helper.getInstance().sheets[1].rows[7].hidden).toBeFalsy();
                    done();
                });
            });

            it('EJ2-53662 -> Copy paste issue in spreadsheet after clear filtering ->', (done: Function) => {
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_clearfilter').click();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).toBeNull();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                helper.invoke('selectRange', ['A1:A100']);
                helper.invoke('copy').then((): void => {
                    helper.invoke('paste', ['J1']);
                    setTimeout((): void => {
                        expect(helper.invoke('getCell', [0, 9]).textContent).toBe('');
                        expect(helper.invoke('getCell', [2, 9]).textContent).toBe('Sports Shoes');
                        expect(helper.invoke('getCell', [8, 9]).textContent).toBe('Loafers');
                        expect(helper.invoke('getCell', [10, 9]).textContent).toBe('T-Shirts');
                        done();
                    });
                });
            });
            
            it('EJ2-55882 -> Console error appears while using cut and filter functionality->', (done: Function) => {
                helper.invoke('selectRange', ['B1:B200']);
                helper.getElement('#' + helper.id + '_cut').click();
                setTimeout(() => {
                    helper.invoke('hideColumn', [1]);
                    helper.invoke('insertColumn', [3]);
                    setTimeout(() => {
                        helper.invoke('selectRange', ['D1']);
                        helper.getElement('#' + helper.id + '_paste').click();
                        helper.invoke('hideColumn', [1, 1, false]);
                        setTimeout(() => {
                            helper.invoke('selectRange', ['B2']);
                            helper.openAndClickCMenuItem(1, 1, [6, 4], false, false);
                            setTimeout(() => {
                                expect(helper.invoke('getCell', [0, 1]).querySelector('.e-filtered')).not.toBeNull();
                                expect(helper.invoke('getCell', [1, 1]).textContent).toBe('');
                                done();
                            });
                        });
                    });
                });
            });
            
            it('EJ2-55012 -> Used range not updated while save and load the spreadsheet as JSON ->', (done: Function) => {
                const json: object = { Workbook: { sheets: [{ ranges: [{ dataSource: defaultData }] }] } }
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.openFromJson({ file: json });
                setTimeout(() => {
                    helper.invoke('selectRange', ['A3']);
                    helper.getElement('#' + helper.id + '_sorting').click();
                    helper.getElement('#' + helper.id + '_applyfilter').click();
                    helper.openAndClickCMenuItem(2, 0, [6, 4]);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                        expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                        done();
                    });
                });
            });

            it('EJ2-54430 -> Copy paste working incorretly after clearing the filters ->', (done: Function) => {
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_clearfilter').click();
                setTimeout(() => {
                    helper.invoke('selectRange', ['A1:A15']);
                    helper.getElement('#' + helper.id + '_copy').click();
                    setTimeout(() => {
                        helper.invoke('selectRange', ['K1']);
                        helper.getElement('#' + helper.id + '_paste').click();
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 10]).textContent).toBe('Item Name');
                            expect(helper.invoke('getCell', [2, 10]).textContent).toBe('Sports Shoes');
                            expect(helper.invoke('getCell', [4, 10]).textContent).toBe('Sandals & Floaters');
                            done();
                        });
                    });
                });
            });

            it('SF-403235 -> Filter state not maintained while loading JSON using openFromJson method ->', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(0);
                spreadsheet.filterCollection = [{ sheetIndex: 0, filterRange: 'A1:H11', hasFilter: true, column: [3],
                    criteria: ['notequal'], value: [20], dataType: ['number'], predicates: ['and'] }];
                helper.invoke('refresh');
                setTimeout((): void => {
                    const filterPredicate: any = spreadsheet.filterModule.filterCollection.get(0);
                    expect(filterPredicate.length).toBe(1);
                    expect(filterPredicate[0].value).toBe(20);
                    expect(filterPredicate[0].type).toBe('number');
                    expect(spreadsheet.sheets[0].rows[2].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[7].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[7].hidden).toBeTruthy();
                    done();
                });
            });

            // it('Filter with unchecked values after open from json', (done: Function) => {
            //     const spreadsheet: Spreadsheet = helper.getInstance();
            //     spreadsheet.applyFilter();
            //     spreadsheet.applyFilter([{ field: 'A', predicate: 'and', operator: 'notequal', value: 'Casual Shoes' }, { field: 'A', predicate: 'and', operator: 'notequal', value: 'Sneakers' }]);
            //     setTimeout(() => {
            //         spreadsheet.saveAsJson().then((json: any) => {
            //             spreadsheet.openFromJson({ file: json.jsonObject });
            //             setTimeout(() => {
            //                 expect(spreadsheet.filterCollection[0].predicates.toString()).toBe('and,and');
            //                 expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(2)') as any).ariaRowIndex).toBe('3');
            //                 expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Sports Shoes');
            //                 expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(6) td').textContent).toBe('Running Shoes');
            //                 done();
            //             });
            //         });
            //     });
            // });

            // it('Cleared filter is not removed after open from json', (done: Function) => {
            //     const spreadsheet: Spreadsheet = helper.getInstance();
            //     helper.triggerKeyEvent('keydown', 76, null, true, true);
            //     expect(spreadsheet.filterCollection.length).toBe(0);
            //     spreadsheet.saveAsJson().then((json: any) => {
            //         spreadsheet.openFromJson({ file: json.jsonObject });
            //         setTimeout(() => {
            //             expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeNull();
            //             expect(helper.invoke('getCell', [0, 7]).querySelector('.e-filtered')).toBeNull();
            //             expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(2)') as any).ariaRowIndex).toBe('2');
            //             done();
            //         });
            //     });
            // });
        });

        // describe('I307401 -> Fiter UI updating ->', () => {
        //     beforeAll((done: Function) => {
        //         helper.initializeSpreadsheet({
        //             sheets: [{ ranges: [{ dataSource: defaultData }] }, {}, { ranges: [{ dataSource: defaultData }] }],
        //             created: (): void => {
        //                 const spreadsheet: any = helper.getInstance();
        //                 spreadsheet.applyFilter([{ field: "F", operator: "contains", value: 200 }]);
        //                 setTimeout(() => {
        //                     spreadsheet.filterModule.selectSortItemHandler(createElement('div', { className: 'e-filter-sortdesc' }));
        //                 });
        //             }
        //         }, done);
        //     });
        //     afterAll(() => {
        //         helper.invoke('destroy');
        //     });

        //     it('Insert sheet', (done: Function) => {
        //         helper.invoke('insertSheet', [0]);
        //         setTimeout(() => {
        //             helper.invoke('goTo', ['Sheet1!A1']);
        //             setTimeout(() => {
        //                 let td: Element = helper.invoke('getCell', [0, 0]);
        //                 expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                 expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Running Shoes');
        //                 expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('8');
        //                 td = helper.invoke('getCell', [0, 5]);
        //                 expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                 expect(helper.getInstance().filterCollection[0].sheetIndex).toBe(1);
        //                 done();
        //             });
        //         });
        //     });

        //     it('Delete sheet', (done: Function) => {
        //         const spreadsheet: any = helper.getInstance();
        //         spreadsheet.goTo('Sheet3!F2');
        //         setTimeout(() => {
        //             spreadsheet.applyFilter([{ field: "D", operator: "contains", value: 20 }]);
        //             setTimeout(() => {
        //                 spreadsheet.filterModule.selectSortItemHandler(createElement('div', { className: 'e-filter-sortdesc' }));
        //                 setTimeout(() => {
        //                     helper.invoke('goTo', ['Sheet4!A1']);
        //                     setTimeout(() => {
        //                         helper.getInstance().notify('removeSheetTab', {});
        //                         setTimeout(() => {
        //                             let td: Element = helper.invoke('getCell', [0, 0]);
        //                             expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                             expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Running Shoes');
        //                             expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('8');
        //                             td = helper.invoke('getCell', [0, 5]);
        //                             expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                             expect(helper.getInstance().filterCollection[0].sheetIndex).toBe(0);

        //                             helper.invoke('goTo', ['Sheet3!A1']);
        //                             setTimeout(() => {
        //                                 td = helper.invoke('getCell', [0, 5]);
        //                                 expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                                 expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Sports Shoes');
        //                                 expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('4');
        //                                 td = helper.invoke('getCell', [0, 3]);
        //                                 expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                                 expect(helper.getInstance().filterCollection[1].sheetIndex).toBe(2);
        //                                 done();
        //                             }, 30);
        //                         }, 20);
        //                     });
        //                 });
        //             });
        //         });
        //     });

        //     it('Insert Column', (done: Function) => {
        //         helper.invoke('insertColumn', [0, 1]);
        //         setTimeout(() => {
        //             let td: Element = helper.invoke('getCell', [0, 7]);
        //             expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //             expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td:nth-child(3)').textContent).toBe('Sports Shoes');
        //             expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('4');
        //             td = helper.invoke('getCell', [0, 5]);
        //             expect(td.children[0].children[0].classList).toContain('e-filtered');
        //             expect(helper.getInstance().filterCollection[1].filterRange).toBe('C1:J11');
        //             helper.invoke('insertColumn', [3, 4]);
        //             setTimeout(() => {
        //                 td = helper.invoke('getCell', [0, 9]);
        //                 expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                 td = helper.invoke('getCell', [0, 7]);
        //                 expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                 expect(helper.getInstance().filterCollection[1].filterRange).toBe('C1:L11');
        //                 done();
        //             });
        //         });
        //     });

        //     it('Delete Column', (done: Function) => {
        //         helper.invoke('delete', [0, 1, 'Column']);
        //         setTimeout(() => {
        //             let td: Element = helper.invoke('getCell', [0, 7]);
        //             expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //             expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Sports Shoes');
        //             expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('4');
        //             td = helper.invoke('getCell', [0, 5]);
        //             expect(td.children[0].children[0].classList).toContain('e-filtered');
        //             expect(helper.getInstance().filterCollection[1].filterRange).toBe('A1:J11');
        //             helper.invoke('delete', [1, 3, 'Column']);
        //             setTimeout(() => {
        //                 td = helper.invoke('getCell', [0, 4]);
        //                 expect(td.children[0].children[0].classList).toContain('e-sortdesc-filter');
        //                 td = helper.invoke('getCell', [0, 2]);
        //                 expect(td.children[0].children[0].classList).toContain('e-filtered');
        //                 expect(helper.getInstance().filterCollection[1].filterRange).toBe('A1:G11');
        //                 helper.invoke('delete', [2, 2, 'Column']);
        //                 setTimeout(() => {
        //                     expect(helper.getContentTableElement().querySelector('tbody tr:nth-child(2) td').textContent).toBe('Casual Shoes');
        //                     expect((helper.getContentTableElement().querySelector('tbody tr:nth-child(3)') as any).ariaRowIndex).toBe('3');
        //                     expect(helper.getInstance().filterCollection[1].column.length).toBe(0);
        //                     done();
        //                 });
        //             });
        //         });
        //     });

        // });
        describe('SF-360112 ->', () => {
            let filterArgs: any;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: filterData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Script error while performing undo continuously after applying filters', (done: Function) => {
                const id: string = '#' + helper.id;
                helper.getElement(`${id}_sorting`).click();
                helper.getElement(`${id}_applyfilter`).click();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                helper.invoke('selectRange', ['G1']);
                helper.invoke('getCell', [0, 0]).focus();
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    setTimeout(() => {
                        const cbox: HTMLElement = helper.getElement('.e-checkboxlist').lastElementChild.querySelector('.e-checkbox-wrapper');
                        (cbox.querySelector('.e-chk-hidden') as HTMLInputElement).checked = false;
                        classList(cbox.querySelector('.e-frame') as HTMLInputElement, ['e-uncheck'], ['e-check']);
                        helper.getElement('.e-filter-popup .e-btn.e-primary').click();
                        setTimeout(() => {
                            helper.triggerKeyNativeEvent(90, true);
                            helper.triggerKeyNativeEvent(90);
                            setTimeout(() => {
                                helper.invoke('endEdit');
                                helper.triggerKeyNativeEvent(90, true);
                                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeNull();
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('SF-364894 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ ranges: [{ dataSource: defaultData }], rowCount: 11 }], scrollSettings: { isFinite: true },
                    created: (): void => {
                        helper.invoke('merge', ['A2:G2']);
                    }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Filtering is not proper in finite mode with less row count and merged cell', (done: Function) => {
                helper.invoke('applyFilter', [[{ field: 'F', predicate: 'or', operator: 'equal', value: '1210' }], 'A1:H11']);
                setTimeout(() => {
                    expect(helper.invoke('getContentTable').rows.length).toBe(2);
                    expect(helper.getInstance().viewport.bottomIndex).toBe(9);
                    done();
                });
            });
        });
        describe('SF-368464 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }], frozenRows: 1, frozenColumns: 1, paneTopLeftCell: 'A1002' }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Filtering issue with freeze pane when the sheet is scrolled', (done: Function) => {
                const tableRowCount: number = helper.invoke('getContentTable').rows.length;
                helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
                setTimeout(() => {
                    expect(helper.invoke('getContentTable').rows.length).toBe(tableRowCount);
                    done();
                });
            });
        });
        describe('SF-369477 ->', () => {
            let spreadsheet: any;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'D7:D9', paneTopLeftCell: 'A7', frozenRows: 1 }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Cells jumbled up while filtering with freeze pane', (done: Function) => {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].topLeftCell).toBe('A1');
                expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('A7');
                helper.triggerKeyNativeEvent(46);
                helper.invoke(
                    'applyFilter', [[{ field: 'D', matchCase: false, operator: 'notequal', predicate: 'and', value: null,
                    ignoreAccent: false }, { field: 'D', matchCase: false, operator: 'notequal', predicate: 'and', value: undefined }],
                    'A1:H11'])
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].topLeftCell).toBe('A1');
                    expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('A10');
                    done();
                }, 100);
            });
            it('Apply filter in multiple column and clear filter using context menu', (done: Function) => {
                helper.invoke('selectRange', ['E2']);
                let predicates: any[] = [].slice.call(spreadsheet.filterModule.filterCollection.get(0));
                predicates.push(
                    { value: 10, field: 'E', predicate: 'and', operator: 'notequal', type: 'number', matchCase: false,
                    ignoreAccent: false });
                helper.invoke('applyFilter', [predicates, 'A1:H11']);
                setTimeout(() => {
                    predicates = spreadsheet.filterModule.filterCollection.get(0);
                    expect(predicates.length).toBe(3);
                    expect(predicates[2].field).toBe('E');
                    expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[5].isFiltered).toBeTruthy();
                    expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-icon').classList.contains('e-filtered')).toBeTruthy();
                    helper.setAnimationToNone('#spreadsheet_contextmenu');
                    const checkFn: Function = (): void => {
                        expect(helper.getElement('#' + helper.id + '_cmenu_clearfilter').classList.contains('e-disabled')).toBeFalsy();
                    };
                    helper.openAndClickCMenuItem(4, 1, [6, 1], false, false, checkFn);
                    setTimeout(() => {
                        expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(2);
                        expect(spreadsheet.sheets[0].rows[5].hidden).toBeFalsy();
                        expect(spreadsheet.sheets[0].rows[5].isFiltered).toBeFalsy();
                        expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-icon').classList.contains('e-filtered')).toBeFalsy();
                        done();
                    });
                });
            });
            it('Clear filter in final filtered column in a range using context menu', (done: Function) => {
                helper.invoke('selectRange', ['D2']);
                expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-icon').classList.contains('e-filtered')).toBeTruthy();
                helper.openAndClickCMenuItem(3, 1, [6, 1]);
                setTimeout(() => {
                    expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(0);
                    expect(spreadsheet.sheets[0].rows[6].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[6].isFiltered).toBeFalsy();
                    expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-icon').classList.contains('e-filtered')).toBeFalsy();
                    done();
                });
            });
        });

        describe('EJ2-55604->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }], selectedRange: 'D1' }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Apply Filter in Multiple Column->', (done: Function) => {
                helper.invoke(
                    'applyFilter', [[{ value: 10, field: 'D', predicate: 'or', operator: 'equal', type: 'number', matchCase: false, ignoreAccent: false },
                    { value: 20, field: 'D', predicate: 'or', operator: 'equal', type: 'number', matchCase: false, ignoreAccent: false },
                    { value: 30, field: 'D', predicate: 'or', operator: 'equal', type: 'number', matchCase: false, ignoreAccent: false },
                    { value: 300, field: 'F', predicate: 'or', operator: 'equal', type: 'number', matchCase: false, ignoreAccent: false }
                ]]);
                done();
            });
            it('Filter not applied properly in multiple column filtering after clearing the single column filter->', (done: Function) => {
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 3]);
                helper.invoke('selectRange', ['D1']);
                helper.invoke('getCell', [0, 3]).focus();
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    setTimeout(() => {
                        helper.click('.e-excelfilter .e-spreadsheet-contextmenu ul li:nth-child(3)');
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filtered')).toBeNull();
                            expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filtered')).not.toBeNull();
                            done();
                        });
                    });
                });
            });
        });
    });
});