import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData, filterData, emptyCellData } from '../util/datasource.spec';
import { Spreadsheet, filterByCellValue, refreshCheckbox, DialogBeforeOpenEventArgs, focus, setCell, setImage, onContentScroll } from '../../../src/index';
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
        it('Add current selection to filter use case', (done: Function) => {
            helper.invoke('selectRange', ['E1']);
            focus(helper.invoke('getCell', [0, 5]));
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
            setTimeout(() => {
                setTimeout(() => {
                    const searchEle: HTMLInputElement = helper.getElementFromSpreadsheet('.e-searchinput') as HTMLInputElement;
                    searchEle.value = '20';
                    const excelFilter: HTMLElement = helper.getElementFromSpreadsheet('.e-excelfilter');
                    const spreadsheet: any = helper.getInstance();
                    spreadsheet.notify(refreshCheckbox, { event: { type: 'keyup', target: searchEle } });
                    expect(spreadsheet.filterModule.filterRange.size).toBe(1);
                    expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(1);
                    expect(spreadsheet.filterModule.filterCollection.get(0)[0].value).toBe('10');
                    helper.getElementFromSpreadsheet('.e-add-current').click();
                    (excelFilter.querySelector('.e-btn.e-primary') as HTMLElement).click();
                    expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(2);
                    expect(spreadsheet.filterModule.filterCollection.get(0)[0].value).toBe('10');
                    expect(spreadsheet.filterModule.filterCollection.get(0)[1].value).toBe('20');
                    done();
                });
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

        it('Apply and remove filter using keyboard shortcuts', (done: Function) => {
            const cellEle: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect(cellEle.childElementCount).toBe(0);
            helper.triggerKeyNativeEvent(76, true, true);
            expect(cellEle.children[0].classList).toContain('e-filter-btn');
            const spreadsheet: any = helper.getInstance();
            expect(spreadsheet.filterModule.filterRange.size).toBe(1);
            expect(spreadsheet.filterModule.filterRange.get(0).range).toEqual([0, 0, 10, 7]);
            helper.triggerKeyNativeEvent(76, true, true);
            expect(cellEle.childElementCount).toBe(0);
            expect(spreadsheet.filterModule.filterRange.size).toBe(0);
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
            helper.setModel('allowSorting', false);
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
            setTimeout(() => {
                let filterPopup: HTMLElement = helper.getElement().lastElementChild;
                expect(filterPopup.classList.contains('e-filter-popup')).toBeTruthy();
                expect(parseInt(filterPopup.style.left, 10)).toBeGreaterThan(0); // Left collision check
                // Sort items disabled state checking
                expect(filterPopup.querySelector('.e-filter-sortasc').classList.contains('e-disabled')).toBeTruthy();
                expect(filterPopup.querySelector('.e-filter-sortdesc').classList.contains('e-disabled')).toBeTruthy();
                helper.triggerKeyNativeEvent(38, false, false, null, 'keydown', true);
                expect(helper.getElement().querySelector('.e-filter-popup')).toBeNull();
                helper.setModel('allowSorting', true);
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
                    expect(args.filterModel.options.format).toBe('yMd');
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

    describe('Number formatted column filter ->', () => {
        const dataSource: Object[] = [
            { Amount: 200, profit: 10 },
            { Amount: 600, profit: 30 },
            { Amount: 300, profit: 12 },
            { Amount: 300, profit: 12 },
            { Amount: 300, profit: 12 },
            { Amount: 800, profit: 40 },
            { Amount: 200, profit: 10 },
            { Amount: 310, profit: 11 },
            { Amount: 1210, profit: 80 },
            { Amount: 500, profit: 50 },
        ];
        let spreadsheet: any; let checkboxList: HTMLElement; let ulList: HTMLElement; let filterCol: any[];
        let selectAll: HTMLElement;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: dataSource }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Number format filter popup rendering check', (done: Function) => {
            helper.invoke('applyFilter');
            helper.invoke('numberFormat', ['$#,##0.00', 'A1:A11']);
            helper.invoke('numberFormat', ['_($* #,##0.00_);_($* (#,##0.00);_($* \"-\"??_);_(@_)', 'B1:B11']);
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            helper.invoke('selectRange', ['A1']);
            td.focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                checkboxList = helper.getElement('.e-checkboxlist');
                expect(checkboxList.childElementCount).toBe(0);
                setTimeout(() => {
                    expect(checkboxList.childElementCount).toBe(8);
                    selectAll = checkboxList.firstElementChild as HTMLElement;
                    expect(selectAll.querySelector('.e-selectall').classList.contains('e-check')).toBeTruthy();
                    expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeTruthy();
                    const searchBox: HTMLInputElement = helper.getElement().querySelector('.e-searchinput');
                    helper.getInstance().notify(refreshCheckbox, { event: { type: 'keyup', keyCode: 8, target: searchBox } });
                    done();
                });
            });
        });
        it('Checkbox interaction and filtering', (done: Function) => {
            selectAll.click();
            expect(selectAll.querySelector('.e-selectall').classList.contains('e-check')).toBeFalsy();
            expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeFalsy();
            ulList = selectAll.parentElement;
            expect(ulList.getElementsByClassName('e-check').length).toBe(0);
            const okBtn: HTMLButtonElement = helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary');
            expect(okBtn.disabled).toBeTruthy();
            selectAll.click();
            expect(selectAll.querySelector('.e-selectall').classList.contains('e-check')).toBeTruthy();
            expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeTruthy();
            expect(ulList.getElementsByClassName('e-check').length).toBe(8);
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
            expect(filterCol.length).toBe(1);
            expect(filterCol[0].type).toBe('number');
            expect(filterCol[0].predicate).toBe('and');
            expect(filterCol[0].operator).toBe('notequal');
            expect(filterCol[0].value).toBe('$200.00');
            done();
        });
        it('Checkbox rendering with same filtered column and Clear filter action', (done: Function) => {
            spreadsheet.element.focus();
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
            setTimeout(() => {
                setTimeout(() => {
                    checkboxList = helper.getElement('.e-checkboxlist');
                    selectAll = checkboxList.firstElementChild as HTMLElement;
                    expect(checkboxList.getElementsByClassName('e-check').length).toBe(6);
                    expect(selectAll.querySelector('.e-selectall').classList.contains('e-stop')).toBeTruthy();
                    expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeFalsy();
                    expect(checkboxList.children[1].querySelector('.e-check')).toBeNull();
                    selectAll.click();
                    expect(selectAll.querySelector('.e-stop')).toBeNull();
                    expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeTruthy();
                    expect(checkboxList.getElementsByClassName('e-check').length).toBe(8);
                    helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary').click();
                    expect(filterCol.length).toBe(0);
                    done();
                });
            });
        });
        it('Searching and apply filter', (done: Function) => {
            spreadsheet.element.focus();
            helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
            setTimeout(() => {
                setTimeout(() => {
                    const searchBox: HTMLInputElement = helper.getElement().querySelector('.e-searchinput');
                    searchBox.value = '2';
                    spreadsheet.notify('refreshCheckbox', { event: { type: 'keyup', target: searchBox } });
                    checkboxList = helper.getElement('.e-checkboxlist');
                    expect(checkboxList.getElementsByClassName('e-check').length).toBe(3);
                    expect(checkboxList.children[1].querySelector('.e-frame').classList.contains('e-add-current')).toBeTruthy();
                    const okBtn: HTMLButtonElement = helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary');
                    okBtn.click();
                    filterCol = spreadsheet.filterModule.filterCollection.get(0);
                    expect(filterCol.length).toBe(2);
                    expect(filterCol[0].type).toBe('number');
                    expect(filterCol[0].predicate).toBe('or');
                    expect(filterCol[0].operator).toBe('equal');
                    expect(filterCol[0].value).toBe('$200.00');
                    expect(filterCol[1].value).toBe('$1,210.00');
                    done();
                });
            });
        });
    });

    describe('Invalid filter range dialog->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply filter and apply remove filter in other sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'contains', value: '10' }]);
            spreadsheet.goTo('Sheet2!A1');
            setTimeout(() => {
                spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'contains', value: '10' }]);
                setTimeout(() => {
                    helper.getInstance().filterModule.removeFilter(1);
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).toBeNull();
                        expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).toBeNull();
                        done();
                    });
                });
            });
        });
        it('Open invalid filter range dialog', (done: Function) => {
            helper.invoke('selectRange', ['M1']);
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
            setTimeout(() => {
                //expect(helper.getElementFromSpreadsheet('.e-dialog.e-popup-open')).not.toBeNull();
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Open invalid filter range dialog with row and column greater than used range', (done: Function) => {
            helper.invoke('selectRange', ['M15']);
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElementFromSpreadsheet('.e-dialog.e-popup-open');
                expect(dialog).not.toBeNull();
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dialog .e-primary');
                done();
            }, 20);
        });
        it('Open invalid filter range dialog using context menu', (done: Function) => {
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 12, [6, 4], false, false);
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElementFromSpreadsheet('.e-dialog.e-popup-open');
                expect(dialog).not.toBeNull();
                helper.setAnimationToNone('.e-dialog');
                helper.click('.e-dialog .e-primary');
                done();
            }, 20);
        });
        it('Cancel opening invalid filter range dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
            args.cancel = true;
            };
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
            setTimeout(() => {
                const dialog: HTMLElement = helper.getElementFromSpreadsheet('.e-dialog.e-popup-open');
                expect(dialog).toBeNull(); 
                done();
            });
        });
    });

    describe('Filter with insert/delete row, column and sheet->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }], activeSheetIndex: 0 }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert column before first column for filtered rows', (done: Function) => {
            helper.invoke('selectRange', ['E6']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(5, 4, [6, 4], false, false);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).not.toBeNull();
                helper.invoke('selectRange', ['A1']);
                helper.invoke('insertColumn', [0]);
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeNull();
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).toBeNull();
                    helper.invoke('delete', [0, 0, 'Column']);
                    done();
                });
            });
        });
        it('Insert column before first column for filtered rows and sorted rows', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            helper.invoke('getCell', [0, 0]).focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                setTimeout(() => {
                    const sortAsc: HTMLElement = helper.getElement('.e-excelfilter .e-filter-sortasc');
                    helper.triggerMouseAction('mousedown', { x: sortAsc.getBoundingClientRect().left + 1, y: sortAsc.getBoundingClientRect().top + 1 }, null, sortAsc);
                    setTimeout(() => {
                        const spreadsheet: Spreadsheet = helper.getInstance();
                        expect(spreadsheet.sheets[0].rows[0].cells[0].value.toString()).toEqual('Item Name');
                        expect(spreadsheet.sheets[0].rows[5].cells[0].value.toString()).toEqual('Flip- Flops & Slippers');
                        helper.invoke('insertColumn', [0]);
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).toBeNull();
                            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).toBeNull();
                            done();
                        }, 10);
                    }, 10);
                });
            });
        });
        it('Delete the empty column after inserted from sorted and filtered column->', (done: Function) => {
            helper.invoke('delete', [0, 0, 'Column']);
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value.toString()).toEqual('Item Name');
                done();
            });
        });
        it('Delete the sorting applied column ->', (done: Function) => {
            helper.invoke('delete', [0, 0, 'Column']);
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value.toString()).toEqual('Date');
                done();
            });
        });
        it('Delete the empty column and filter applied column ->', (done: Function) => {
            helper.invoke('insertColumn', [0]);
            setTimeout(() => {
                helper.invoke('selectRange', ['A1:C1'])
                helper.invoke('delete', [0, 2, 'Column']);
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[0].cells[0].value.toString()).toEqual('Quantity');
                    done();
                });
            });
        });
        it('Delete the filter applied column with with filter collection more than 1 ->', (done: Function) => {
            helper.invoke('selectRange', ['C8']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(7, 2, [6, 4], false, false);
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[2].value.toString()).toEqual('Amount');
                expect(helper.invoke('getCell', [0, 2]).querySelector('.e-filtered')).not.toBeNull();
                helper.invoke('selectRange', ['C1'])
                helper.invoke('delete', [2, 2, 'Column']);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[0].cells[2].value.toString()).toEqual('Discount');
                    expect(helper.invoke('getCell', [0, 2]).querySelector('.e-filtered')).toBeNull();
                    done();
                });
            });
        });
        it('Delete the filter applied column ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            expect(spreadsheet.sheets[0].rows[0].cells[1].value.toString()).toEqual('Price');
            expect(helper.invoke('getCell', [0, 1]).querySelector('.e-filtered')).not.toBeNull();
            helper.invoke('delete', [1, 1, 'Column']);
            setTimeout(() => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[1].value.toString()).toEqual('Discount');
                expect(helper.invoke('getCell', [0, 1]).querySelector('.e-filtered')).toBeNull();
                done()
            });
        });
        it('Insert sheet after apply filter and sort using filter dialog in newly inserted sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.goTo('Sheet2!A1');
            setTimeout(() => {
                helper.invoke('selectRange', ['E6']);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.openAndClickCMenuItem(5, 4, [6, 4], false, false);
                setTimeout(() => {
                    helper.invoke('selectRange', ['A1']);
                    const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                    helper.invoke('getCell', [0, 0]).focus();
                    helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                    setTimeout(() => {
                        setTimeout(() => {
                            const sortAsc: HTMLElement = helper.getElement('.e-excelfilter .e-filter-sortasc');
                            helper.triggerMouseAction('mousedown', { x: sortAsc.getBoundingClientRect().left + 1, y: sortAsc.getBoundingClientRect().top + 1 }, null, sortAsc);
                            setTimeout(() => {
                                helper.invoke('insertSheet', [1]);
                                setTimeout(() => {
                                    expect(helper.getInstance().activeSheetIndex).toBe(1);
                                    done();
                                });
                            }, 10);
                        });
                    });
                });
            }, 50);
        });
        it('Delete the non-filter applied sheet', (done: Function) => {
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(function () {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(2)');
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toBe(1);
                    expect(helper.getInstance().sheets.length).toBe(2);
                    done();
                });
            });
        });
        it('Delete the filter applied sheet', (done: Function) => {
            var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
            var coords = td.getBoundingClientRect();
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            setTimeout(function () {
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(2)');
                setTimeout(() => {
                    helper.setAnimationToNone('.e-dialog');
                    helper.click('.e-dialog .e-primary');
                    expect(helper.getInstance().activeSheetIndex).toBe(0);
                    expect(helper.getInstance().sheets.length).toBe(1);
                    done();
                });
            });
        });
    });

	describe('Apply filter and clear filter->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Filterdialogcreatedhandler method testing', (done: Function) => {
            helper.getInstance().filterModule.filterDialogCreatedHandler();
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).toBeNull();
                done();
            });
        });
        it('Apply filter and apply clear format', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'contains', value: '10' }]);
            spreadsheet.selectRange('A1:H11');
            setTimeout(() => {
                helper.click('#spreadsheet_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(1)');
                setTimeout(() => {
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).toBeNull();
                        expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).toBeNull();
                        done();
                    });
                });
            });
        });
        it('EJ2-895426 - Filter does not work correctly when fractional values are entered', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            helper.edit('F3', '12.89');
            helper.edit('F5', '7.056');
            helper.edit('F7', '9.988');
            helper.edit('F9', '4.78');
            expect(helper.getInstance().sheets[0].rows[2].cells[5].value).toEqual(12.89);
            expect(helper.getInstance().sheets[0].rows[4].cells[5].value).toEqual(7.056);
            expect(helper.getInstance().sheets[0].rows[6].cells[5].value).toEqual(9.988);
            expect(helper.getInstance().sheets[0].rows[8].cells[5].value).toEqual(4.78);
            helper.getInstance().filterModule.getFilterOperator('between');
            spreadsheet.applyFilter([{ field: 'F', predicate: 'and', operator: 'greaterthanorequal', value: '4 39/50' }, { field: 'F', predicate: 'and', operator: 'lessthanorequal', value: '12 89/100' }]);
            setTimeout(function () {
                const filterCol = spreadsheet.filterModule.filterCollection.get(0);
                expect(filterCol[0].field).toBe('F');
                expect(filterCol[0].operator).toBe('greaterthanorequal');
                expect(filterCol[0].predicate).toBe('and');
                expect(filterCol[0].value).toBe(4.78);
                expect(filterCol[1].field).toBe('F');
                expect(filterCol[1].operator).toBe('lessthanorequal');
                expect(filterCol[1].predicate).toBe('and');
                expect(filterCol[1].value).toBe(12.89);
                expect(spreadsheet.sheets[0].rows[3].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[3].isFiltered).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[5].isFiltered).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[7].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[7].isFiltered).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[9].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[9].isFiltered).toBeTruthy();
                done();
            });
        });
    });

    describe('Filter dialog opening and filter with different operators->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [
                        { cells: [{ index: 8, value: 'Boolean Test' }]},
                        { cells: [{ index: 8, value: 'True' }]},
                        { cells: [{ index: 8, value: 'False' }]},
                        { cells: [{ index: 8, value: 'True' }]},
                        { cells: [{ index: 8, value: 'True' }]},
                        { index:6, cells: [{ index: 8, value: 'True' }]},
                        { cells: [{ index: 8, value: 'False' }]},
                        { cells: [{ index: 8, value: 'False' }]},
                        { cells: [{ index: 8, value: 'True' }]},
                        { cells: [{ index: 8, value: 'False' }]}
                    ]
                }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Open filter dialog for short date format column ', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            helper.click('#' + helper.id + '_sorting');
            helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 1]);
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                setTimeout(() => {
                    helper.click('.e-excelfilter .e-flat');
                    done();
                });
            });
        });
        it('Open filter dialog for time format column ', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 2]);
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                setTimeout(() => {
                    helper.click('.e-excelfilter .e-flat');
                    done();
                });
            });
        });
        it('Apply filter with operator as startwith', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('BeginsWith');
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'startswith', value: '1' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as lessthan', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('Less');
            spreadsheet.applyFilter([{ field: 'D', predicate: 'or', operator: 'lessthan', value: '20' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as endswith', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('EndsWith');
            spreadsheet.applyFilter([{ field: 'A', predicate: 'or', operator: 'endswith', value: 'Shoes' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[4].hidden).toBeTruthy();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as equal', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('Equal');
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as notequal', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('Notequal');
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'Notequal', value: '10' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].hidden).toBeFalsy();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as greaterthan', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('Greater');
            spreadsheet.applyFilter([{ field: 'D', predicate: 'or', operator: 'greaterthan', value: '20' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[5].hidden).toBeFalsy();
                expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as contains', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('Contains');
            spreadsheet.applyFilter([{ field: 'F', predicate: 'or', operator: 'contains', value: '200' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as lessthanorequal', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('LessOrEqual');
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'lessthanorequal', value: '20' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as greaterthanorequal', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('GreaterOrEqual');
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'greaterthanorequal', value: '20' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[2].hidden).toBeFalsy();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as doesnotcontain', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('NotContains');
            spreadsheet.applyFilter([{ field: 'F', predicate: 'or', operator: 'doesnotcontain', value: '300' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[3].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[6].hidden).toBeFalsy();
                expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                spreadsheet.applyFilter([{ field: 'A', predicate: 'or', operator: 'doesnotcontain', value: 'Shoe' }]);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[3].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[7].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[4].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[6].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[10].hidden).toBeFalsy();
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                    helper.click('#' + helper.id + '_sorting');
                    helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                    done();
                });
            });
        });
        it('Apply filter with operator as doesnotstartwith', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('NotBeginsWith');
            spreadsheet.applyFilter([{ field: 'A', predicate: 'or', operator: 'doesnotstartwith', value: 's' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[4].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[6].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[8].hidden).toBeFalsy();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as doesnotendwith', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('NotEndsWith');
            spreadsheet.applyFilter([{ field: 'A', predicate: 'or', operator: 'doesnotendwith', value: 'shoes' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[9].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[4].hidden).toBeFalsy();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                done();
            });
        });
        it('Apply filter with operator as isempty', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A2']);
            helper.triggerKeyNativeEvent(46);
            helper.getInstance().filterModule.getFilterOperator('Empty');
            spreadsheet.applyFilter([{ field: 'A', predicate: 'or', operator: 'isempty', value: '' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].hidden).toBeFalsy();
                expect(spreadsheet.sheets[0].rows[4].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[7].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[10].hidden).toBeTruthy();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                spreadsheet.applyFilter([{ field: 'I', predicate: 'or', operator: 'isempty', value: '' }]);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[5].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[7].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[10].hidden).toBeTruthy();
                    expect(helper.invoke('getCell', [0, 8]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                    expect(helper.invoke('getCell', [0, 8]).querySelector('.e-filtered')).not.toBeNull();
                    helper.click('#' + helper.id + '_sorting');
                    helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                    helper.invoke('selectRange', ['B4']);
                    helper.triggerKeyNativeEvent(46);
                    spreadsheet.applyFilter([{ field: 'B', predicate: 'or', operator: 'isempty', value: '' }]);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[3].hidden).toBeFalsy();
                        expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[7].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[9].hidden).toBeTruthy();
                        expect(helper.invoke('getCell', [0, 1]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                        expect(helper.invoke('getCell', [0, 1]).querySelector('.e-filtered')).not.toBeNull();
                        helper.click('#' + helper.id + '_sorting');
                        helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                        helper.invoke('selectRange', ['D10']);
                        helper.triggerKeyNativeEvent(46);
                        spreadsheet.applyFilter([{ field: 'D', predicate: 'or', operator: 'isempty', value: '' }]);
                        setTimeout(() => {
                            expect(spreadsheet.sheets[0].rows[9].hidden).toBeFalsy();
                            expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                            expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                            expect(spreadsheet.sheets[0].rows[10].hidden).toBeTruthy();
                            expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                            expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filtered')).not.toBeNull();
                            helper.click('#' + helper.id + '_sorting');
                            helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                            helper.invoke('selectRange', ['C5']);
                            helper.triggerKeyNativeEvent(46);
                            spreadsheet.applyFilter([{ field: 'C', predicate: 'or', operator: 'isempty', value: '' }]);
                            setTimeout(() => {
                                expect(spreadsheet.sheets[0].rows[4].hidden).toBeFalsy();
                                expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                                expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                                expect(spreadsheet.sheets[0].rows[9].hidden).toBeTruthy();
                                expect(helper.invoke('getCell', [0, 2]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                                expect(helper.invoke('getCell', [0, 2]).querySelector('.e-filtered')).not.toBeNull();
                                helper.click('#' + helper.id + '_sorting');
                                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                                done();
                            });
                        });
                    });
                });
            });
        });
        it('Apply filter with operator as isnotempty', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.getInstance().filterModule.getFilterOperator('NotEmpty');
            spreadsheet.applyFilter([{ field: 'A', predicate: 'or', operator: 'isnotempty', value: '' }]);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[4].hidden).toBeFalsy();
                expect(spreadsheet.sheets[0].rows[7].hidden).toBeFalsy();
                expect(spreadsheet.sheets[0].rows[10].hidden).toBeFalsy();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filtered')).not.toBeNull();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                spreadsheet.applyFilter([{ field: 'I', predicate: 'or', operator: 'isnotempty', value: '' }]);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[1].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[7].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[10].hidden).toBeFalsy();
                    expect(helper.invoke('getCell', [0, 8]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                    expect(helper.invoke('getCell', [0, 8]).querySelector('.e-filtered')).not.toBeNull();
                    helper.click('#' + helper.id + '_sorting');
                    helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                    helper.invoke('selectRange', ['B4']);
                    helper.triggerKeyNativeEvent(46);
                    spreadsheet.applyFilter([{ field: 'B', predicate: 'or', operator: 'isnotempty', value: '' }]);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[3].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[5].hidden).toBeFalsy();
                        expect(spreadsheet.sheets[0].rows[7].hidden).toBeFalsy();
                        expect(spreadsheet.sheets[0].rows[9].hidden).toBeFalsy();
                        expect(helper.invoke('getCell', [0, 1]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                        expect(helper.invoke('getCell', [0, 1]).querySelector('.e-filtered')).not.toBeNull();
                        helper.click('#' + helper.id + '_sorting');
                        helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                        helper.invoke('selectRange', ['D10']);
                        helper.triggerKeyNativeEvent(46);
                        spreadsheet.applyFilter([{ field: 'D', predicate: 'or', operator: 'isnotempty', value: '' }]);
                        setTimeout(() => {
                            expect(spreadsheet.sheets[0].rows[9].hidden).toBeTruthy();
                            expect(spreadsheet.sheets[0].rows[1].hidden).toBeFalsy();
                            expect(spreadsheet.sheets[0].rows[5].hidden).toBeFalsy();
                            expect(spreadsheet.sheets[0].rows[10].hidden).toBeFalsy();
                            expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                            expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filtered')).not.toBeNull();
                            helper.click('#' + helper.id + '_sorting');
                            helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                            helper.invoke('selectRange', ['C5']);
                            helper.triggerKeyNativeEvent(46);
                            spreadsheet.applyFilter([{ field: 'C', predicate: 'or', operator: 'isnotempty', value: '' }]);
                            setTimeout(() => {
                                expect(spreadsheet.sheets[0].rows[4].hidden).toBeTruthy();
                                expect(spreadsheet.sheets[0].rows[1].hidden).toBeFalsy();
                                expect(spreadsheet.sheets[0].rows[5].hidden).toBeFalsy();
                                expect(spreadsheet.sheets[0].rows[9].hidden).toBeFalsy();
                                expect(helper.invoke('getCell', [0, 2]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                                expect(helper.invoke('getCell', [0, 2]).querySelector('.e-filtered')).not.toBeNull();
                                helper.click('#' + helper.id + '_sorting');
                                helper.click('.e-sort-filter-ddb ul li:nth-child(6)');
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('Checking invalid filter range cases ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{}] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply filter in empty sheet to cover invalidFilterRange cases', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange('E1:E2');
            spreadsheet.applyFilter([{ field: 'E', predicate: 'or', operator: 'contains', value: '10' }]);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filter-iconbtn')).toBeNull();
                expect(helper.invoke('getCell', [0, 4]).querySelector('.e-filtered')).toBeNull();
                done();
            });
        });
    });

    describe('EJ2-931391', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }],
                created: (): void => {
                    let spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.setRangeReadOnly(true, 'A1:H11', 0);
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Multiple alert dialogs are shown when applying filtering to data with read-only cells', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            spreadsheet.applyFilter();
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 7]);
            helper.invoke('selectRange', ['H1']);
            td.focus();
            helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
            setTimeout(() => {
                let checkboxList: HTMLElement;
                let selectAll: HTMLElement;
                setTimeout(() => {
                    checkboxList = helper.getElement('.e-checkboxlist');
                    expect(checkboxList.childElementCount).toBe(11);
                    selectAll = checkboxList.firstElementChild as HTMLElement;
                    selectAll.click();
                    expect(selectAll.querySelector('.e-selectall').classList.contains('e-check')).toBeFalsy();
                    expect((selectAll.querySelector('.e-chk-hidden') as HTMLInputElement).checked).toBeFalsy();
                    const cbox: HTMLElement = helper.getElement('.e-checkboxlist').lastElementChild.querySelector('.e-checkbox-wrapper');
                    cbox.click();
                    helper.setAnimationToNone('.e-filter-popup.e-dialog');
                    helper.getElement('.e-filter-popup .e-btn.e-primary').click();
                    setTimeout(() => {
                        expect(helper.getElement('.e-readonly-alert-dlg.e-dialog')).toBeNull();
                        expect(spreadsheet.sheets[0].rows[1].isFiltered).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[1].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[2].isFiltered).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[3].isFiltered).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[3].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[4].isFiltered).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[4].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[5].isFiltered).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[6].isFiltered).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[6].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[7].isFiltered).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[7].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[8].isFiltered).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[8].hidden).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[9].isFiltered).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[9].hidden).toBeUndefined();
                        expect(spreadsheet.sheets[0].rows[10].isFiltered).toBeTruthy();
                        expect(spreadsheet.sheets[0].rows[10].hidden).toBeTruthy();
                        done();
                    });
                });
            });
        });
        it('Hide row on readonly applied cells', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            spreadsheet.hideRow(9);
            expect(spreadsheet.sheets[0].rows[9].isFiltered).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[9].hidden).toBeUndefined();
            expect(helper.getElement('.e-readonly-alert-dlg.e-dialog')).toBeNull();
            done();
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
                    expect(helper.getInstance().sheets[0].rows[2].hidden).toBeTruthy();
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
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 2');
                helper.click('#' + helper.id + '_aggregate-popup ul li:nth-child(3)');
                helper.click('#' + helper.id + '_aggregate');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li').textContent).toBe('Count: 2');
                expect(helper.getElement('#' + helper.id + '_aggregate-popup ul li:nth-child(2)').textContent).toBe('Sum: 45');
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
                spreadsheet.filterModule.updateFilter({ isOpen: true });
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
                    //expect(spreadsheet.sheets[0].paneTopLeftCell).toBe('A10');
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
                helper.invoke('updateCell', [{ value: 'value' }, 'I1']);
                setCell(3, 8, helper.invoke('getActiveSheet'), { value: '0.11' });
                helper.invoke(
                    'applyFilter', [[{ value: 10, field: 'D', predicate: 'or', operator: 'equal', type: 'number', matchCase: false, ignoreAccent: false },
                        { value: 20, field: 'D', predicate: 'or', operator: 'equal', type: 'number', matchCase: false, ignoreAccent: false },
                        { value: 30, field: 'D', predicate: 'or', operator: 'equal', type: 'number', matchCase: false, ignoreAccent: false },
                        { value: 300, field: 'F', predicate: 'or', operator: 'equal', type: 'number', matchCase: false, ignoreAccent: false }
                    ]]).then(
                    () => {
                        expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filtered')).not.toBeNull();
                        expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filtered')).not.toBeNull();
                        done();
                    });
            });
            it('Filter not applied properly in multiple column filtering after clearing the single column filter->', (done: Function) => {
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 3]);
                helper.invoke('selectRange', ['D1']);
                focus(td);
                helper.getInstance().keyboardNavigationModule.keyDownHandler(
                    { preventDefault: () => {}, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    setTimeout(() => {
                        helper.setAnimationToNone('.e-filter-popup.e-dialog');
                        helper.click('.e-excelfilter .e-spreadsheet-contextmenu ul li:nth-child(3)');
                        setTimeout(() => {
                            //expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filtered')).toBeNull();
                            expect(helper.invoke('getCell', [0, 5]).querySelector('.e-filtered')).not.toBeNull();
                            done();
                        });
                    });
                });
            });
            it('Number column filtering with cell value as number in string type', (done: Function) => {
                helper.invoke('selectRange', ['I1']);
                const cell: HTMLTableCellElement = helper.invoke('getCell', [0, 8]);
                focus(cell);
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: cell, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    expect(helper.getElement('.e-filter-popup .e-submenu.e-menu-item').textContent).toBe('Number Filters');
                    done();
                });
            });
        });
        describe('EJ2-65848 ->', () => {
            let selectAll: HTMLElement;
            let checkboxList: HTMLElement;
            let filterTable: any;
            let filterRow: any;
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    scrollSettings: { isFinite: true, enableVirtualization: false }
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Check string value filtering is not working properly in the finite mode while setting virtualization as false ', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                // SF-655415 - Checking the 'Text' filter does not load properly when dynamically disabling and enabling the filter support.
                spreadsheet.allowFiltering = false;
                spreadsheet.dataBind();
                spreadsheet.allowFiltering = true;
                spreadsheet.dataBind();
                const id: string = '#' + helper.id;
                helper.getElement(`${id}_sorting`).click();
                helper.getElement(`${id}_applyfilter`).click();
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                spreadsheet.keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    setTimeout(() => {
                        selectAll = helper.getElement('.e-checkboxlist .e-selectall');
                        selectAll.click();
                        checkboxList = helper.getElement('.e-checkboxlist');
                        setTimeout(() => {
                            const list: HTMLElement = checkboxList.children[1].querySelector('.e-frame');
                            list.click();
                            helper.getElement('.e-filter-popup .e-btn.e-primary').click();
                            setTimeout(() => {
                                filterTable = spreadsheet.getContentTable().rows;
                                filterRow = spreadsheet.sheets[0].rows;
                                expect(filterTable[1].cells[0].innerText).toBe('Casual Shoes');
                                expect(filterTable[1].hidden).toBeFalsy();
                                expect(filterTable[1].isFiltered).toBeFalsy();
                                expect(filterTable[2].cells[0].innerText).toBe('');
                                expect(filterRow[2].hidden).toBeTruthy();
                                expect(filterRow[2].isFiltered).toBeTruthy();
                                expect(filterTable[3].cells[0].innerText).toBe('');
                                expect(filterRow[3].hidden).toBeTruthy();
                                expect(filterRow[3].isFiltered).toBeTruthy();
                                expect(filterTable[4].cells[0].innerText).toBe('');
                                expect(filterRow[4].hidden).toBeTruthy();
                                expect(filterRow[4].isFiltered).toBeTruthy();
                                done();
                            });
                        });
                    });
                });
            });
            it('Check number value filtering is not working properly in the finite mode while setting virtualization as false ', (done: Function) => {
                const id: string = '#' + helper.id;
                helper.getElement(`${id}_sorting`).click();
                helper.getElement(`${id}_applyfilter`).click();
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                helper.invoke('selectRange', ['G1']);
                helper.invoke('getCell', [0, 0]).focus();
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    setTimeout(() => {
                        selectAll = helper.getElement('.e-checkboxlist .e-selectall');
                        selectAll.click();
                        checkboxList = helper.getElement('.e-checkboxlist');
                        setTimeout(() => {
                            const list: HTMLElement = checkboxList.children[2].querySelector('.e-frame');
                            list.click();
                            helper.getElement('.e-filter-popup .e-btn.e-primary').click();
                            setTimeout(() => {
                                filterTable = helper.getInstance().getContentTable().rows;
                                filterRow = helper.getInstance().sheets[0].rows;
                                expect(filterTable[1].cells[6].innerText).toBe('3');
                                expect(filterTable[1].hidden).toBeFalsy();
                                expect(filterTable[1].isFiltered).toBeFalsy();
                                expect(filterTable[2].cells[0].innerText).toBe('');
                                expect(filterRow[2].hidden).toBeTruthy();
                                expect(filterRow[2].isFiltered).toBeTruthy();
                                expect(filterTable[3].cells[0].innerText).toBe('');
                                expect(filterRow[3].hidden).toBeTruthy();
                                expect(filterRow[3].isFiltered).toBeTruthy();
                                expect(filterTable[4].cells[0].innerText).toBe('');
                                expect(filterRow[4].hidden).toBeTruthy();
                                expect(filterRow[4].isFiltered).toBeTruthy();
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('EJ2-891546 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Filtering is applied to the active sheet when applying filter to a non-active sheet using applyFilter() method', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.goTo('Sheet2!A1');
                setTimeout(() => {
                    helper.edit('I12', '10');
                    spreadsheet.goTo('Sheet1!A1');
                    setTimeout(() => {
                        spreadsheet.applyFilter(null, 'Sheet2!A1:H11');
                        spreadsheet.goTo('Sheet2!A1');
                        setTimeout(() => {
                            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-icon')).not.toBeNull();
                            expect(helper.invoke('getCell', [0, 1]).querySelector('.e-filter-icon')).not.toBeNull();
                            expect(helper.invoke('getCell', [0, 2]).querySelector('.e-filter-icon')).not.toBeNull();
                            expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-icon')).not.toBeNull();
                            spreadsheet.goTo('Sheet1!A1');
                            setTimeout(() => {
                                spreadsheet.applyFilter(null, 'Sheet2!A1:H11');
                                spreadsheet.goTo('Sheet2!A1');
                                setTimeout(() => {
                                    expect(helper.invoke('getCell', [0, 0]).querySelector('.e-filter-icon')).toBeNull();
                                    expect(helper.invoke('getCell', [0, 1]).querySelector('.e-filter-icon')).toBeNull();
                                    expect(helper.invoke('getCell', [0, 2]).querySelector('.e-filter-icon')).toBeNull();
                                    expect(helper.invoke('getCell', [0, 3]).querySelector('.e-filter-icon')).toBeNull();
                                    done();
                                });
                            });
                        });
                    });

                });
            });
        });

        describe('EJ2-896267 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Provide options in clearFilter() public method to clear filter collections based on sheet index', (done: Function) => {
                const spreadsheet: any = helper.getInstance();
                helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
                setTimeout(() => {
                    expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(1);
                    spreadsheet.goTo('Sheet2!A1');
                    setTimeout(() => {
                        helper.invoke('clearFilter', [null, 0]);
                        expect(spreadsheet.filterModule.filterCollection.get(0).length).toBe(0);
                        helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
                        setTimeout(() => {
                            expect(spreadsheet.filterModule.filterCollection.get(1).length).toBe(1);
                            helper.invoke('clearFilter', [null, null]);
                            expect(spreadsheet.filterModule.filterCollection.get(1).length).toBe(0);
                            done();
                        });
                    });
                });
            });
            it('EJ2-882824 - Hyperlink text not displayed in filter popup', (done: Function) => {
                const sheet = helper.getInstance().sheets[0];
                expect(sheet.usedRange.rowIndex).toBe(10);
                helper.invoke('insertHyperlink', ['www.google.com', 'F13']);
                helper.invoke('insertHyperlink', [{ address: 'www.syncfusion.com' }, 'F14']);
                helper.invoke('addHyperlink', [{ address: '' }, 'F15']);
                expect(sheet.rows[12].cells[5].hyperlink).toBe('http://www.google.com');
                expect(sheet.rows[13].cells[5].hyperlink.address).toBe('http://www.syncfusion.com');
                expect(sheet.rows[14].cells[5].hyperlink.address).toBe('');
                expect(sheet.usedRange.rowIndex).toBe(14);
                helper.getElement('#' + helper.id + '_sorting').click();
                helper.getElement('#' + helper.id + '_applyfilter').click();
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 5]);
                helper.invoke('selectRange', ['F1']);
                helper.invoke('getCell', [0, 5]).focus();
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    setTimeout(() => {
                        const items = document.querySelectorAll('.e-checkboxlist .e-ftrchk');
                        expect(items[9].textContent).toBe('http://www.google.com');
                        expect(items[10].textContent).toBe('http://www.syncfusion.com');
                        done();
                    });
                });
            });
            it('EJ2-989682 - Unwanted Whitespace Strings Added in Filter Options in Spreadsheet', (done: Function) => {
                helper.edit('K2', ' 1 ');
                helper.edit('K3', '   ');
                helper.edit('K4', '=LEN(K2)');
                expect(helper.invoke('getCell', [1, 10]).textContent).toBe('1');
                helper.getInstance().goTo('K1');
                helper.triggerKeyNativeEvent(76, true, true);
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 10]);
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    setTimeout(() => {
                        const items = document.querySelectorAll('.e-checkboxlist .e-ftrchk');
                        expect(items[0].textContent).not.toBe('   ');
                        expect(items[1].textContent).not.toBe('   ');
                        expect(items[2].textContent).not.toBe('   ');
                        done();
                    });
                });
            });
        });
    });

    describe('Filter ->', () => {
        describe('880404: Script error issue on clicking undo button ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: [] }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', (done: Function) => {
                helper.edit('A1', '1');
                const spreadsheet: any = helper.getInstance();
                const id: string = '#' + helper.id;
                helper.getElement(`${id}_sorting`).click();
                helper.getElement(`${id}_applyfilter`).click();
                setTimeout(() => {
                    helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
                    const editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
                    editorElem.click();
                    editorElem.value = '880404';
                    helper.triggerKeyNativeEvent(13, false, false, editorElem);
                    done();
                });
            });
            it('Undo changes', (done: Function) => {
                helper.getElement('#' + helper.id + '_undo').click();
                setTimeout(() => {
                    expect(helper.getInstance().element.querySelector('.e-sheet .e-sheet-content tbody tr td .e-filter-btn')).toBeNull();
                    done();
                });
            });
        });
        
        describe('904152: Date filter hanging and not responding when click the clear icon on search box. ->', () => {
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
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: dataSource }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', (done: Function) => {
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                helper.invoke('selectRange', ['B1']);
                helper.invoke('getCell', [0, 1]).focus();
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    setTimeout(() => {
                        const inputEle: HTMLInputElement = document.querySelector('.e-filter-popup .e-searchinput') as HTMLInputElement;
                        inputEle.value = '2016'
                        helper.triggerKeyEvent('keydown', 49, inputEle as HTMLInputElement, false, false, inputEle as HTMLInputElement);
                        helper.triggerKeyEvent('keyup', 49, inputEle as HTMLInputElement, false, false, inputEle as HTMLInputElement);
                        setTimeout(() => {
                            setTimeout(() => {
                                expect(helper.getInstance().filterModule.treeViewEle.querySelectorAll('.e-list-parent li')[2].textContent).toBe('2014');
                                helper.click('.e-excelfilter .e-btn.e-primary');
                                done();
                            });
                        });
                    });
                });
            });
        });

        describe('880373: Filtering not maintained correctly on creating duplicate sheet ->', () => {
            const dataSource: Object[] = [
                { "Text": "67.32" },
                { "Text": "12.89" },
                { "Text": "1.5" },
                { "Text": "2.4" },
                { "Text": "7.056" },
                { "Text": "9.988" },
                { "Text": "0" },
                { "Text": "-0.67" },
                { "Text": "-0.12" },
                { "Text": "-90.45679" },
                { "Text": "78.456783" },
                { "Text": "4.78" },
                { "Text": "23.01" }
            ];
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: dataSource }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', (done: Function) => {
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                helper.invoke('selectRange', ['A1']);
                helper.invoke('getCell', [0, 0]).focus();
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    helper.click('.e-excelfilter .e-searchcontainer .e-checkboxlist .e-selectall');
                    helper.click('.e-excelfilter .e-searchcontainer .e-checkboxlist .e-uncheck:not(.e-selectall)');
                    helper.click('.e-excelfilter .e-btn.e-primary');
                    done();
                }, 100);
            });
            it('creating duplicate sheet', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                var td = helper.getElement('.e-sheet-tab .e-active .e-text-wrap');
                var coords = td.getBoundingClientRect();
                helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
                helper.setAnimationToNone('#' + helper.id + '_contextmenu');
                helper.click('#' + helper.id + '_contextmenu li:nth-child(3)');
                setTimeout(() => {
                    expect(spreadsheet.sheets[1].name.toString()).toBe('Sheet1 (2)');
                    done();
                });
            });
            it('clearing filters', (done: Function) => {
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                helper.invoke('selectRange', ['A1']);
                helper.invoke('getCell', [0, 0]).focus();
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    helper.click('.e-excelfilter .e-spreadsheet-contextmenu .e-menu-item:nth-child(3)');
                    done();
                }, 100);
            });
            it('Checking tab', (done) => {
                helper.click('.e-sheet-tab-panel .e-sheet-tab .e-sheet-tabs-items .e-toolbar-item .e-tab-wrap');
                setTimeout(() => {
                    const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                    helper.invoke('selectRange', ['A1']);
                    helper.invoke('getCell', [0, 0]).focus();
                    helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                    setTimeout(() => {
                        expect(helper.getInstance().element.querySelector('.e-excelfilter .e-spreadsheet-contextmenu .e-menu-item:nth-child(3)').classList.contains('e-dissabled')).toBeFalsy();
                        done();
                    }, 200);
                });
            });
        });

        describe('904276: Filter icon wrongly update for hidden rows in spreadsheet ->', () => {
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
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: dataSource }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', () => {
                helper.invoke('selectRange', ['A4:A10']);
                helper.openAndClickCMenuItem(4, 0, [8], true);
            });
            it('Enabeling filter', (done: Function) => {
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
                setTimeout(() => {
                    expect(helper.getInstance().element.querySelector('.e-sheet .e-sheet-content tbody tr td .e-filter-btn')).toBeNull();
                    done();
                });
            });
        });

        describe('880385: Filter option not maintained properly after clearing the formats ->', () => {
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
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: dataSource }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', (done: Function) => {
                helper.invoke('selectRange', ['B1:B10']);
                helper.click('#' + helper.id + '_clear');
                helper.click('.e-clear-ddb ul li:nth-child(2)');
                setTimeout(() => {
                    helper.click('#' + helper.id + '_sorting');
                    helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
                    const td: HTMLTableCellElement = helper.invoke('getCell', [0, 1]);
                    helper.invoke('selectRange', ['B1']);
                    helper.invoke('getCell', [0, 1]).focus();
                    helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                    setTimeout(() => {
                        expect(helper.getInstance().element.querySelector('.e-filter-popup.e-excelfilter .e-spreadsheet-contextmenu .e-submenu').textContent).toBe('Number Filters');
                        helper.click('.e-excelfilter .e-btn.e-primary');
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('880393: Filter option not displayed correctly for "text" formatted column ->', () => {
            const dataSource: Object[] = [
                { "Text": "\"67.32\"" },
                { "Text": "\"12.89\"" },
                { "Text": "\"1.5\"" },
                { "Text": "\"2.4\"" },
                { "Text": "\"7.05\"" },
                { "Text": "\"9.988\"" },
                { "Text": "\"0\"" },
                { "Text": "\"-0.67\"" },
                { "Text": "\"-0.12\"" },
                { "Text": "\"-90.45679\"" },
                { "Text": "\"78.456783\"" },
                { "Text": "\"4.78\"" },
                { "Text": "\"23.01\"" }
            ];
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: dataSource }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', (done: Function) => {
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                helper.invoke('selectRange', ['A1']);
                helper.invoke('getCell', [0, 0]).focus();
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    expect(helper.getInstance().element.querySelector('.e-filter-popup.e-excelfilter .e-spreadsheet-contextmenu .e-submenu').textContent).toBe('Text Filters');
                    helper.click('.e-excelfilter .e-btn.e-primary');
                    done();
                }, 100);
            });
        });

        describe('880382: Filter pop up values are not maintained correctly ->', () => {
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
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: dataSource }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', () => {
                helper.invoke('selectRange', ['A4:A10']);
                helper.openAndClickCMenuItem(4, 0, [8], true);
            });
            it('initial rendering', (done: Function) => {
                helper.invoke('selectRange', ['A1']);
                helper.invoke('getCell', [0, 0]).focus();
                helper.click('#' + helper.id + '_sorting');
                helper.click('.e-sort-filter-ddb ul li:nth-child(5)');
                const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
                helper.invoke('selectRange', ['A1']);
                helper.invoke('getCell', [0, 0]).focus();
                helper.getInstance().keyboardNavigationModule.keyDownHandler({ preventDefault: function () { }, target: td, altKey: true, keyCode: 40 });
                setTimeout(() => {
                    expect(helper.getInstance().element.querySelectorAll('.e-excelfilter .e-searchcontainer .e-checkboxlist .e-ftrchk').length).toBe(4)
                    helper.click('.e-excelfilter .e-btn.e-primary');
                    done();
                }, 100);
            });
        });

        describe('ClearAll actions for filter cases', () => {
            let spreadsheet: any;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Apply conditional formatting', (done: Function) => {
                spreadsheet = helper.getInstance();
                helper.invoke('selectRange', ['A2:H2']);
                setTimeout((): void => {
                    helper.getElement('#' + helper.id + '_conditionalformatting').click();
                    const target: HTMLElement = helper.getElement('#' + helper.id + '_conditionalformatting-popup .e-colorscales');
                    (getComponent(target.parentElement.parentElement, 'menu') as any).animationSettings.effect = 'None';
                    helper.triggerMouseAction('mouseover', { x: target.getBoundingClientRect().left + 5, y: target.getBoundingClientRect().top + 5 }, document, target);
                    setTimeout((): void => {
                        helper.getElement('#GYRColorScale').click();
                        expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('rgb(143, 202, 125)');
                        done();
                    });
                });
            });
            it('Apply hyperlink', (done: Function) => {
                helper.invoke('selectRange', ['A2:H2']);
                helper.switchRibbonTab(2);
                helper.getElementFromSpreadsheet('#' + helper.id + '_hyperlink').click();
                setTimeout(() => {
                    helper.getElements('.e-hyperlink-dlg .e-webpage input')[1].value = 'www.google.com';
                    helper.triggerKeyEvent('keyup', 88, null, null, null, helper.getElements('.e-hyperlink-dlg .e-webpage input')[1]);
                    helper.setAnimationToNone('.e-hyperlink-dlg.e-dialog');
                    helper.click('.e-hyperlink-dlg .e-footer-content button:nth-child(1)');
                    done();
                });
            });
            it('Apply Filter icons', (done: Function) => {
                expect((spreadsheet.sheets[0].rows[1].cells[3].hyperlink).address).toBe('http://www.google.com');
                helper.switchRibbonTab(1);
                setTimeout((): void => {
                    helper.click('#' + helper.id + '_sorting');
                    helper.getElement('#' + helper.id + '_applyfilter').click();
                    expect(helper.invoke('getCell', [1, 0]).querySelector('.e-filter-btn')).not.toBeNull();
                    expect(spreadsheet.filterModule.filterRange.size).toBe(1);
                    done();
                });
            });
            it('Apply Filter', (done: Function) => {
                helper.invoke('selectRange', ['D2']);
                focus(helper.invoke('getCell', [1, 4]));
                helper.triggerKeyNativeEvent(40, false, false, null, 'keydown', true);
                setTimeout((): void => {
                    const checkboxList: HTMLElement = helper.getElement('.e-checkboxlist');
                    expect(checkboxList.childElementCount).toBe(0);
                    setTimeout(() => {
                        const ulList: HTMLElement = checkboxList.firstElementChild.parentElement;
                        expect(ulList.getElementsByClassName('e-check').length).toBe(8);
                        let list: HTMLElement = ulList.children[1].querySelector('.e-frame');
                        let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                        list.dispatchEvent(e);
                        e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                        list.dispatchEvent(e);
                        e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                        list.dispatchEvent(e);
                        list = ulList.children[2].querySelector('.e-frame');
                        e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                        list.dispatchEvent(e);
                        e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                        list.dispatchEvent(e);
                        e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                        list.dispatchEvent(e);
                        list = ulList.children[3].querySelector('.e-frame');
                        e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                        list.dispatchEvent(e);
                        e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                        list.dispatchEvent(e);
                        e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                        list.dispatchEvent(e);
                        const okBtn: HTMLButtonElement = helper.getElement().querySelector('.e-excelfilter .e-footer-content .e-primary');
                        okBtn.click();
                        done();
                    });
                });
            });
            it('Apply Clear All', (done: Function) => {
                expect(helper.invoke('getCell', [1, 3]).querySelector('.e-filtered')).not.toBeNull();
                helper.invoke('selectRange', ['A2:H2']);
                helper.click('#' + helper.id + '_clear');
                helper.click('#spreadsheet_clear-popup ul li:nth-child(1)');
                setTimeout((): void => {
                    expect(helper.invoke('getCell', [1, 0]).querySelector('.e-filter-btn')).toBeNull();
                    expect(helper.invoke('getCell', [1, 3]).textContent).toBe('');
                    done();
                });
            });
            it('Undo action', (done: Function) => {
                helper.getElement('#' + helper.id + '_undo').click();
                setTimeout((): void => {
                    expect(helper.invoke('getCell', [1, 3]).querySelector('.e-filtered')).not.toBeNull();
                    expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('rgb(143, 202, 125)');
                    expect((spreadsheet.sheets[0].rows[1].cells[3].hyperlink).address).toBe('http://www.google.com');
                    done();
                });
            });
            it('Redo action', (done: Function) => {
                helper.getElement('#' + helper.id + '_redo').click();
                setTimeout((): void => {
                    expect(helper.invoke('getCell', [1, 0]).querySelector('.e-filter-btn')).toBeNull();
                    expect(helper.invoke('getCell', [1, 3]).textContent).toBe('');
                    done();
                });
            });
            it('Undo action-1', (done: Function) => {
                helper.getElement('#' + helper.id + '_undo').click();
                setTimeout((): void => {
                    helper.getElement('#' + helper.id + '_undo').click();
                    setTimeout((): void => {
                        helper.getElement('#' + helper.id + '_undo').click();
                        setTimeout((): void => {
                            helper.getElement('#' + helper.id + '_undo').click();
                            setTimeout((): void => {
                                helper.getElement('#' + helper.id + '_undo').click();
                                done();
                            });
                        });
                    });
                });
            });
            it('Redo action-1', (done: Function) => {
                expect(helper.invoke('getCell', [1, 5]).style.backgroundColor).toBe('');
                expect(helper.invoke('getCell', [1, 3]).style.textDecoration).toBe('');
                helper.getElement('#' + helper.id + '_redo').click();
                setTimeout((): void => {
                    helper.getElement('#' + helper.id + '_redo').click();
                    setTimeout((): void => {
                        helper.getElement('#' + helper.id + '_redo').click();
                        setTimeout((): void => {
                            helper.getElement('#' + helper.id + '_redo').click();
                            setTimeout((): void => {
                                helper.getElement('#' + helper.id + '_redo').click();
                                setTimeout((): void => {
                                    helper.getElement('#' + helper.id + '_redo').click();
                                    done();
                                }, 10);
                            }, 10);
                        }, 10);
                    }, 10);
                });
            });
            it('Check', (done: Function) => {
                expect(helper.invoke('getCell', [1, 0]).querySelector('.e-filter-btn')).toBeNull();
                expect(helper.invoke('getCell', [1, 3]).textContent).toBe('');
                done();
            });
        });

        describe('931157: Inserted Image not deleted when filter applied. ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: emptyCellData }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', (done: Function) => {
                helper.invoke('applyFilter', [[
                    { field: 'D', predicate: 'and', operator: 'greaterthan', value: '0' },
                    { field: 'D', predicate: 'and', operator: 'lessthan', value: '51' }
                ], 'A1:H1']);
                setTimeout(() => {
                    helper.invoke('insertImage', [[{src:"https://www.w3schools.com/images/w3schools_green.jpg", width: 110, height: 70 }], 'B70']);
                    setTimeout(() => {
                        helper.invoke('clearFilter', ['D']);
                        done();
                    }, 100);
                }, 100);
            });
            it('Scrolling and checking', (done: Function) => {
                setTimeout(() => {
                    helper.invoke('goTo', ['D65']);
                    helper.getInstance().notify(onContentScroll, { scrollTop: 1280, scrollLeft: 0 });                    
                    setTimeout(() => {
                        expect(helper.getInstance().element.querySelectorAll('.e-ss-overlay.e-ss-overlay-active').length > 0).toBeTruthy();
                        const spreadsheet: any = helper.getInstance();
                        spreadsheet.notify(setImage, { options: undefined, range: 'Sheet1B70', isPositionChanged: undefined });
                        done();
                    }, 100);
                });
            });
        });

        describe('915344: Un-hide action in the spreadsheet is unhide the filtered hidden rows ->', () => {
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
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: dataSource }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', (done: Function) => {
                helper.invoke('applyFilter', [[
                    { field: 'C', predicate: 'and', operator: 'notequal', value: '300' },
                ], 'A1:H1']);
                setTimeout(() => {
                    helper.invoke('hideRow', [3, 7, false]);
                    expect(helper.getInstance().sheets[0].rows[2].hidden).toBeFalsy();
                    expect(helper.getInstance().sheets[0].rows[3].hidden).toBeTruthy();
                    expect(helper.getInstance().sheets[0].rows[4].hidden).toBeTruthy();
                    expect(helper.getInstance().sheets[0].rows[5].hidden).toBeTruthy();
                    expect(helper.getInstance().sheets[0].rows[6].hidden).toBeFalsy();
                    done();
                }, 100);
            });
        });

        describe('880363: Issue in filtering the negative number format ->', () => {
            const dataSource: Object[] = [
                { 'Item Name': 'Casual Shoes', Date: '02/14/2014', Amount: 200, Number: 50 },
                { 'Item Name': 'Sports Shoes', Date: '06/11/2016', Amount: 600, Number: 0 },
                { 'Item Name': 'Formal Shoes', Date: '07/27/2014', Amount: 300, Number: -6 },
                { 'Item Name': 'Sandals & Floaters', Date: '11/21/2014', Amount: 300, Number: 25 },
                { 'Item Name': 'Flip- Flops & Slippers', Date: '06/23/2015', Amount: 300, Number: 12 },
                { 'Item Name': 'Sneakers', Date: '07/22/2014', Amount: 800, Number: -49 },
                { 'Item Name': 'Running Shoes', Date: '02/04/2014', Amount: 200, Number: 49 },
                { 'Item Name': 'Loafers', Date: '11/30/2015', Amount: 310, Number: 7 },
                { 'Item Name': 'Cricket Shoes', Date: '07/09/2014', Amount: 1210, Number: -1 },
                { 'Item Name': 'T-Shirts', Date: '10/31/2014', Amount: 500, Number: 1  },
            ];
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: dataSource }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('initial rendering', (done: Function) => {
                helper.invoke('applyFilter', [[
                    { field: 'D', predicate: 'and', operator: 'lessthan', value: '1' },
                    { field: 'D', predicate: 'and', operator: 'greaterthan', value: '(50)' }
                ], 'A1:H1']);
                setTimeout(() => {
                    const spreadsheet: any = helper.getInstance();
                    expect(spreadsheet.filterModule.filterCollection.get(0)[1].value).toBe(-50);
                    expect(spreadsheet.sheets[0].rows[1].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[2].isFiltered).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[3].isFiltered).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[4].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[5].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[6].isFiltered).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[7].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[8].isFiltered).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[9].isFiltered).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[10].isFiltered).toBeTruthy();
                    done();
                });
            });
        });

        describe('Fraction format in spreadsheet component', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ ranges: [{ dataSource: [] }] }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Fraction fromat - I', (done: Function) => {
                helper.invoke('updateCell', [{ value: '0', format: '# ?/?' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('0       ');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":0,"format":"# ?/?","formattedText":"0       "}');
                done();
            });
            it('Fraction fromat - II', (done: Function) => {
                helper.invoke('updateCell', [{ value: '67.32', format: '# ?/?' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('67 1/3');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":67.32,"format":"# ?/?","formattedText":"67 1/3"}');
                done();
            });
            it('Fraction fromat - III', (done: Function) => {
                helper.invoke('updateCell', [{ value: '12.89', format: '# ??/??' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('12 81/91');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":12.89,"format":"# ??/??","formattedText":"12 81/91"}');
                done();
            });
            it('Fraction fromat - IV', (done: Function) => {
                helper.invoke('updateCell', [{ value: '7.056', format: '# ???/???' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('7 7/125');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":7.056,"format":"# ???/???","formattedText":"7 7/125"}');
                done();
            });
            it('Fraction fromat - V', (done: Function) => {
                helper.invoke('updateCell', [{ value: '2.4', format: '# ?/?' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('2 2/5');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":2.4,"format":"# ?/?","formattedText":"2 2/5"}');
                done();
            });
            it('Fraction fromat - VI', (done: Function) => {
                helper.invoke('updateCell', [{ value: '9.988', format: '# ??/??' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('9 82/83');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":9.988,"format":"# ??/??","formattedText":"9 82/83"}');
                done();
            });
            it('Fraction fromat - VI', (done: Function) => {
                helper.invoke('updateCell', [{ value: '-0.67', format: '# ?/?' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('- 2/3');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":-0.67,"format":"# ?/?","formattedText":"- 2/3"}');
                done();
            });
            it('Fraction fromat - VII', (done: Function) => {
                helper.invoke('updateCell', [{ value: '-0.12', format: '# ?/2' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('-0     ');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":-0.12,"format":"# ?/2","formattedText":"-0     "}');
                done();
            });
            it('Fraction fromat - VIII', (done: Function) => {
                helper.invoke('updateCell', [{ value: '78.456783', format: '# ?/4' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('78 1/2');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":78.456783,"format":"# ?/4","formattedText":"78 1/2"}');
                done();
            });
            it('Fraction fromat - IX', (done: Function) => {
                helper.invoke('updateCell', [{ value: '4.12', format: '# ?/8' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('4 1/8');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":4.12,"format":"# ?/8","formattedText":"4 1/8"}');
                done();
            });
            it('Fraction fromat - X', (done: Function) => {
                helper.invoke('updateCell', [{ value: '1.999', format: '# ????/????' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('1 999/1000');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":1.999,"format":"# ????/????","formattedText":"1 999/1000"}');
                done();
            });
            it('Fraction fromat - XI', (done: Function) => {
                helper.invoke('updateCell', [{ value: '-1.25', format: '# ??/16' }, 'A1']);
                expect(helper.invoke('getCell', [0, 0]).textContent).toBe('-1 1/4');
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[0])).toBe('{"value":-1.25,"format":"# ??/16","formattedText":"-1 1/4"}');
                done();
            });
        });

        describe('931147: Custom filter to a text column not working when we use the wildcards ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('wildcards: startswith', (done: Function) => {
                helper.invoke('applyFilter', [[{ field: 'A', predicate: 'and', operator: 'equal', value: 'C*' }], 'A1:A11']);
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[1].hidden).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[9].hidden).toBeUndefined();
                    expect(spreadsheet.sheets[0].rows[10].hidden).toBeTruthy();
                    done();
                });
            });
            it('wildcards: endswith', (done: Function) => {
                helper.invoke('applyFilter', [[{ field: 'A', predicate: 'and', operator: 'equal', value: '*ts' }], 'A1:A11']);
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[9].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[10].hidden).toBeFalsy();
                    done();
                });
            });
            it('wildcards: contains', (done: Function) => {
                helper.invoke('applyFilter', [[{ field: 'A', predicate: 'and', operator: 'equal', value: '*eaker*' }], 'A1:A11']);
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[6].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[7].hidden).toBeTruthy();
                    done();
                });
            });
            it('EJ2-968587 -> Applied Filter Value With "notEqual" Operator Is Not Maintained Properly', (done: Function) => {
                helper.edit('A12', 'RA02');
                helper.edit('A13', 'RA02');
                helper.edit('A14', 'RA02');
                helper.edit('A15', 'RA02');
                helper.edit('A16', 'RA02');
                helper.edit('A17', 'RA02');
                helper.invoke('applyFilter', [[{ field: 'A', predicate: 'or', operator: 'notequal', value: 'RA02' }], 'A1:A17']);
                setTimeout(() => {
                    const spreadsheet: any = helper.getInstance();
                    expect(spreadsheet.filterModule.filterCollection.get(0)[0].value).toBe('RA02');
                    expect(spreadsheet.filterModule.filterCollection.get(0)[0].operator).toBe('notequal');
                    expect(spreadsheet.filterModule.filterCollection.get(0)[0].predicate).toBe('or');
                    expect(spreadsheet.sheets[0].rows[11].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[12].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[13].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[14].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[15].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[16].hidden).toBeTruthy();
                    expect(spreadsheet.sheets[0].rows[0].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[1].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[2].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[3].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[4].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[5].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[6].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[7].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[8].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[9].hidden).toBeFalsy();
                    expect(spreadsheet.sheets[0].rows[10].hidden).toBeFalsy();
                    done();
                });
            });
        });
    });

    describe('AllowFiltering: false condition checks', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }]
                }], allowFiltering: false
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Check through public method call and UI interaction', (done: Function) => {
            helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
            const cell = helper.invoke('getCell', [0, 4]);
            const hasFilteredIcon = cell.children[0]
            expect(hasFilteredIcon).toBeUndefined();
            helper.setAnimationToNone('#' + helper.id + '_sorting');
            helper.click('#' + helper.id + '_sorting');
            const applyFilterBtn = document.getElementById('spreadsheet_applyfilter') as HTMLElement;
            expect(applyFilterBtn).not.toBeNull();
            const isDisabled = applyFilterBtn.classList.contains('e-disabled');
            expect(isDisabled).toBe(true);
            done();
        });
        it('Check through contextmenu UI interaction', (done: Function) => {
            helper.invoke('selectRange', ['A2']);
            const td: HTMLTableCellElement = helper.invoke('getCell', [1, 0]);
            const coords: DOMRect = <DOMRect>td.getBoundingClientRect();
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.triggerMouseAction('contextmenu', { x: coords.x, y: coords.y }, null, td);
            const filterMenuElement = document.getElementById('spreadsheet_cmenu_filter');
            expect(filterMenuElement).toBeNull();
            done();
        });
    });
});
