import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, getInstance, closest} from '@syncfusion/ej2-base';
import { FieldList } from '../../src/common/actions/field-list';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Toolbar } from '../../src/common/popups/toolbar';
import { PDFExport } from '../../src/pivotview/actions/pdf-export';
import { ExcelExport } from '../../src/pivotview/actions/excel-export';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';

describe('Server side pivot engine ', () => {

    describe('- Initial Rendering and Basic Operations', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:400px;width:60%' });
        let down: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        let up: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    url: 'https://productionservices.azurewebsites.net/js/production/api/pivot/post',
                    mode: 'Server',
                    expandAll: true,
                    enableSorting: true,
                    columns: [{ name: 'Year', caption: 'Production Year' },
                    ],
                    values: [
                        { name: 'Sold', caption: 'Units Sold' },
                        { name: 'Price', caption: 'Sold Amount' }
                    ],
                    rows: [{ name: 'Country', caption: 'Countries' }],
                    formatSettings: [{ name: 'Price', format: 'C0' }, { name: 'Sold', format: 'N0' }],
                },
                showFieldList: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Intial rendering - pivot table', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[0][1].formattedText).toBe('FY 2015');
                (pivotGridObj.element.querySelectorAll('.e-select-table')[0] as HTMLElement).click();
                done();
            }, 4500);
        });
        it('Popup field list - ascend & descend', () => {
            expect(document.querySelectorAll('.e-field-table .e-field-list-tree-outer-div .e-field-list ul li')[0].textContent).toBe('Production Year');
            (document.querySelectorAll('.e-sort-ascend')[0] as HTMLElement).click();
        });
        it('Popup field list - ascend & descend-1', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-field-table .e-field-list-tree-outer-div .e-field-list ul li')[0].textContent).toBe('Countries');
                (document.querySelectorAll('.e-sort-descend')[0] as HTMLElement).click()
                done();
            }, 1500);
        });
        it('Field list Filering - columns - 1', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-field-table .e-field-list-tree-outer-div .e-field-list ul li')[0].textContent).toBe('Units Sold');
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
            done();
            }, 2500);
        });
        it('Field list Filering - columns - 01', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(1);
                done();
            }, 5000);
        });
        it('Field list Filering - columns - 001', (done: Function) => {
            setTimeout(() => {
                let treeObj: TreeView = getInstance(document.querySelectorAll('.e-member-editor-container')[0] as HTMLElement, TreeView) as TreeView;
                let checkEle: NodeListOf<Element> = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                checkEle[0].dispatchEvent(down);
                checkEle[0].dispatchEvent(up);
                done();
            }, 2000);
        });
        it('Field list Filering - columns - 2', (done: Function) => {
            let treeObj: TreeView = getInstance(document.querySelectorAll('.e-member-editor-container')[0] as HTMLElement, TreeView) as TreeView;
            let checkEle: NodeListOf<Element> = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
            setTimeout(() => {
                checkEle[1].dispatchEvent(down);
                checkEle[1].dispatchEvent(up);
                done();
            }, 500);
        });
        it('Field list Filering - columns - 02', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(1);
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(0);
                done();
            }, 1000);
        });
    });

    describe('- Initial Rendering and Basic Operations-1', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:400px;width:60%' });
        let down: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        let up: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    url: 'https://productionservices.azurewebsites.net/js/production/api/pivot/post',
                    mode: 'Server',
                    expandAll: true,
                    enableSorting: true,
                    columns: [{ name: 'Year', caption: 'Production Year' },
                    ],
                    values: [
                        { name: 'Sold', caption: 'Units Sold' },
                        { name: 'Price', caption: 'Sold Amount' }
                    ],
                    rows: [{ name: 'Country', caption: 'Countries' }],
                    formatSettings: [{ name: 'Price', format: 'C0' }, { name: 'Sold', format: 'N0' }],
                },
                showFieldList: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Intial rendering - pivot table', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[0][1].formattedText).toBe('FY 2015');
                (pivotGridObj.element.querySelectorAll('.e-select-table')[0] as HTMLElement).click();
                done();
            }, 4000);
        });
        it('Popup field list - ascend & descend', () => {
            expect(document.querySelectorAll('.e-field-table .e-field-list-tree-outer-div .e-field-list ul li')[0].textContent).toBe('Production Year');
        });
        it('Field list Filering - rows - 1', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-btn-filter')[0] as HTMLElement).click();
                done();
            }, 2000);
        });
        it('Field list Filering - rows - 01', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(1);
                done();
            }, 4000);
        });
        it('Field list Filering - rows - 001', (done: Function) => {
            let treeObj: TreeView = getInstance(document.querySelectorAll('.e-member-editor-container')[0] as HTMLElement, TreeView) as TreeView;
            let checkEle: NodeListOf<Element> = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            setTimeout(() => {
                checkEle[0].dispatchEvent(down);
                checkEle[0].dispatchEvent(up);
                done();
            }, 1000);
        });
        it('Field list Filering - rows - 2', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(1);
                done();
            }, 1000);
        });
        it('Field list Filering - rows - 02', (done: Function) => {
            let treeObj: TreeView = getInstance(document.querySelectorAll('.e-member-editor-container')[0] as HTMLElement, TreeView) as TreeView;
            let checkEle: NodeListOf<Element> = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
            setTimeout(() => {
                checkEle[1].dispatchEvent(down);
                checkEle[1].dispatchEvent(up);
                done();
            }, 1500);
        });
        it('Field list Filering - rows - 002', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Field list Filering - rows - 0002', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivotfieldlist-container').length).toBe(1);
                done();
            }, 1000);
        });
        it('Field list close', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-cancel-btn')[0] as HTMLElement).click()
                done();
            }, 1000);
        });
    });

    // describe('Pivot field list - server side engine', () => {
    //     let fieldListObj: PivotFieldList;
    //     let pivotCommon: PivotCommon;
    //     let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
    //     let down: MouseEvent = new MouseEvent('mousedown', {
    //         'view': window,
    //         'bubbles': true,
    //         'cancelable': true,
    //     });
    //     let up: MouseEvent = new MouseEvent('mouseup', {
    //         'view': window,
    //         'bubbles': true,
    //         'cancelable': true,
    //     });
    //     afterAll(() => {
    //         if (fieldListObj) {
    //             fieldListObj.destroy();
    //         }
    //         remove(elem);
    //     });
    //     beforeAll(() => {
    //         if (document.getElementById(elem.id)) {
    //             remove(document.getElementById(elem.id));
    //         }
    //         document.body.appendChild(elem);
    //         fieldListObj = new PivotFieldList({
    //             dataSourceSettings: {
    //                 url: 'https://services.syncfusion.com/js/production/api/pivot/post',
    //                 mode: 'Server',
    //                 expandAll: true,
    //                 enableSorting: true,
    //                 columns: [{ name: 'Year', caption: 'Production Year' },
    //                 ],
    //                 values: [
    //                     { name: 'Sold', caption: 'Units Sold' },
    //                     { name: 'Price', caption: 'Sold Amount' }
    //                 ],
    //                 rows: [{ name: 'Country', caption: 'Countries' }],
    //                 formatSettings: [{ name: 'Price', format: 'C0' }, { name: 'Sold', format: 'N0' }],
    //             },
    //             renderMode: 'Fixed'
    //         });
    //         fieldListObj.appendTo('#PivotFieldList');
    //         pivotCommon = fieldListObj.pivotCommon;
    //     });
    //     it('Intial rendering', (done: Function) => {
    //         setTimeout(() => {
    //             expect(fieldListObj.element.querySelectorAll('.e-field-table .e-field-list-tree-outer-div .e-field-list ul li')[0].textContent).toBe('Product ID');
    //             done();
    //         }, 4000);
    //     });
    //     it('Field list sorting - ascending', (done: Function) => {
    //         (fieldListObj.element.querySelectorAll('.e-sort-ascend')[0] as HTMLElement).click()
    //         setTimeout(() => {
    //             expect(fieldListObj.element.querySelectorAll('.e-field-table .e-field-list-tree-outer-div .e-field-list ul li')[0].textContent).toBe('Country');
    //             done();
    //         }, 1000);
    //     });
    //     it('Field list sorting - descending', (done: Function) => {
    //         (fieldListObj.element.querySelectorAll('.e-sort-descend')[0] as HTMLElement).click()
    //         setTimeout(() => {
    //             expect(fieldListObj.element.querySelectorAll('.e-field-table .e-field-list-tree-outer-div .e-field-list ul li')[0].textContent).toBe('Units Sold');
    //             done();
    //         }, 1000);
    //     });
    //     it('Field list Filering - columns', (done: Function) => {
    //         (fieldListObj.element.querySelector('.e-right-axis-fields .e-field-list-columns .e-columns .e-pivot-button .e-pv-filter') as HTMLElement).click();
    //         setTimeout(() => {
    //             let treeObj: TreeView = getInstance(document.querySelectorAll('.e-member-editor-dialog .e-member-editor-container')[0] as HTMLElement, TreeView) as TreeView;
    //             let checkEle: NodeListOf<Element> = document.querySelectorAll('.e-member-editor-dialog .e-member-editor-container ul li.e-list-item');
    //             util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
    //             checkEle[0].dispatchEvent(down);
    //             checkEle[0].dispatchEvent(up);
    //             expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(1);
    //             done();
    //         }, 2000);
    //     });
    //     it('Field list Filering - rows - 1', (done: Function) => {
    //         let treeObj: TreeView = getInstance(document.querySelectorAll('.e-member-editor-dialog .e-member-editor-container')[0] as HTMLElement, TreeView) as TreeView;
    //         let checkEle: NodeListOf<Element> = document.querySelectorAll('.e-member-editor-dialog .e-member-editor-container ul li.e-list-item');
    //         util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
    //         checkEle[1].dispatchEvent(down);
    //         checkEle[1].dispatchEvent(up);
    //         setTimeout(() => {
    //             expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(1);
    //             (document.querySelector(".e-member-editor-dialog .e-footer-content .e-primary") as HTMLElement).click();
    //             expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(0);
    //             done();
    //         }, 2000);
    //     });
    //     it('Field list Filering - rows - 2', (done: Function) => {
    //         (fieldListObj.element.querySelector('.e-left-axis-fields .e-field-list-rows .e-rows .e-pivot-button .e-pv-filter') as HTMLElement).click();
    //         setTimeout(() => {
    //             let checkObj: NodeListOf<Element> = document.querySelectorAll(".e-member-editor-dialog .e-member-editor-container ul li.e-list-item");
    //             checkObj[0].dispatchEvent(down);
    //             checkObj[0].dispatchEvent(up);
    //             expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(1);
    //             done();
    //         }, 2000);
    //     });
    //     it('Field list Filering - rows', (done: Function) => {
    //         let checkObj: NodeListOf<Element> = document.querySelectorAll(".e-member-editor-dialog .e-member-editor-container ul li.e-list-item");
    //         checkObj[1].dispatchEvent(down);
    //         checkObj[1].dispatchEvent(up);
    //         setTimeout(() => {
    //             expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(1);
    //             (document.querySelector(".e-member-editor-dialog .e-footer-content .e-primary") as HTMLElement).click();
    //             expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(0);
    //             done();
    //         }, 2000);
    //     });
    // });

    describe('Drillthrough', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:400px;width:60%' });
        let down: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        let up: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    url: 'https://productionservices.azurewebsites.net/js/production/api/pivot/post',
                    mode: 'Server',
                    expandAll: true,
                    enableSorting: true,
                    columns: [{ name: 'Year', caption: 'Production Year' },
                    ],
                    values: [
                        { name: 'Sold', caption: 'Units Sold' },
                        { name: 'Price', caption: 'Sold Amount' }
                    ],
                    rows: [{ name: 'Country', caption: 'Countries' }],
                    formatSettings: [{ name: 'Price', format: 'C0' }, { name: 'Sold', format: 'N0' }],
                },
                showFieldList: true,
                allowDrillThrough: true,
                allowDataCompression: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Intial rendering - pivot table', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[0][1].formattedText).toBe('FY 2015');
                done();
            }, 3000);
        });
        it('drillthrough row testing', (done: Function) => {
            setTimeout(() => {
                const targetElement = document.querySelectorAll('.e-rowcell')[1] as HTMLElement;
                const dblClickEvent = new MouseEvent('dblclick', {
                    'bubbles': true,
                    'cancelable': true
                });
                targetElement.dispatchEvent(dblClickEvent);
                
                done();
            }, 1000);
        });
    });

    describe('Toolbar', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:400px;width:60%' });
        let down: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        let up: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    url: 'https://productionservices.azurewebsites.net/js/production/api/pivot/post',
                    mode: 'Server',
                    expandAll: true,
                    enableSorting: true,
                    columns: [{ name: 'Year', caption: 'Production Year' },
                    ],
                    values: [
                        { name: 'Sold', caption: 'Units Sold' },
                        { name: 'Price', caption: 'Sold Amount' }
                    ],
                    rows: [{ name: 'Country', caption: 'Countries' }],
                    formatSettings: [{ name: 'Price', format: 'C0' }, { name: 'Sold', format: 'N0' }],
                },
                showFieldList: true,
                toolbar: ['FieldList'],
                showToolbar: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Intial rendering - pivot table', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[0][1].formattedText).toBe('FY 2015');
                done();
            }, 3000);
        });
    });

    // describe('Export', () => {
    //     let originalTimeout: number;
    //     let pivotGridObj: PivotView;
    //     let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:400px;width:60%' });
    //     let down: MouseEvent = new MouseEvent('mousedown', {
    //         'view': window,
    //         'bubbles': true,
    //         'cancelable': true,
    //     });
    //     let up: MouseEvent = new MouseEvent('mouseup', {
    //         'view': window,
    //         'bubbles': true,
    //         'cancelable': true,
    //     });
    //     afterAll(() => {
    //         if (pivotGridObj) {
    //             pivotGridObj.destroy();
    //         }
    //         remove(elem);
    //     });
    //     beforeAll((done: Function) => {
    //         originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    //         if (document.getElementById(elem.id)) {
    //             remove(document.getElementById(elem.id));
    //         }
    //         document.body.appendChild(elem);
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         PivotView.Inject(FieldList, Toolbar, PDFExport, ExcelExport);
    //         pivotGridObj = new PivotView({
    //             dataSourceSettings: {
    //                 url: 'https://productionservices.azurewebsites.net/js/production/api/pivot/post',
    //                 mode: 'Server',
    //                 expandAll: true,
    //                 enableSorting: true,
    //                 columns: [{ name: 'Year', caption: 'Production Year' },
    //                 ],
    //                 values: [
    //                     { name: 'Sold', caption: 'Units Sold' },
    //                     { name: 'Price', caption: 'Sold Amount' }
    //                 ],
    //                 rows: [{ name: 'Country', caption: 'Countries' }],
    //                 formatSettings: [{ name: 'Price', format: 'C0' }, { name: 'Sold', format: 'N0' }],
    //             },
    //             showFieldList: true,
    //             allowDrillThrough: true,
    //             showToolbar: true,
    //             allowExcelExport: true,
    //             toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
    //                 'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
    //             allowDataCompression: true,
    //             dataBound: dataBound
    //         });
    //         pivotGridObj.appendTo('#PivotGrid');
    //     });
    //     beforeEach((done: Function) => {
    //         setTimeout(() => { done(); }, 1000);
    //     });
    //     it('Intial rendering - pivot table', (done: Function) => {
    //         setTimeout(() => {
    //             expect(pivotGridObj.pivotValues[0][1].formattedText).toBe('FY 2015');
    //             done();
    //         }, 3000);
    //     });
    //     it('Export', () => {
    //         let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
    //         expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
    //         util.triggerEvent(li, 'mouseover');
    //     });
    //     it('Excel Export', () => {
    //         (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
    //     });
    //     it('Check', (done: Function) => {
    //         setTimeout(() => {
    //             expect(pivotGridObj.pivotValues[0][1].formattedText).toBe('FY 2015');
    //             done();
    //         }, 2000);
    //     });
    //     it('Blob export', (done: Function) => {
    //         pivotGridObj.excelExport({}, false, undefined, true);
    //         done();
    //     });
    // });

    // describe('Filtering', () => {
    //     let originalTimeout: number;
    //     let pivotGridObj: PivotView;
    //     let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:400px;width:60%' });
    //     let down: MouseEvent = new MouseEvent('mousedown', {
    //         'view': window,
    //         'bubbles': true,
    //         'cancelable': true,
    //     });
    //     let up: MouseEvent = new MouseEvent('mouseup', {
    //         'view': window,
    //         'bubbles': true,
    //         'cancelable': true,
    //     });
    //     afterAll(() => {
    //         if (pivotGridObj) {
    //             pivotGridObj.destroy();
    //         }
    //         remove(elem);
    //     });
    //     beforeAll((done: Function) => {
    //         originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    //         if (document.getElementById(elem.id)) {
    //             remove(document.getElementById(elem.id));
    //         }
    //         document.body.appendChild(elem);
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         PivotView.Inject(GroupingBar);
    //         pivotGridObj = new PivotView({
    //             dataSourceSettings: {
    //                 url: 'https://productionservices.azurewebsites.net/js/production/api/pivot/post',
    //                 mode: 'Server',
    //                 expandAll: true,
    //                 enableSorting: true,
    //                 columns: [{ name: 'Year', caption: 'Production Year' },
    //                 ],
    //                 values: [
    //                     { name: 'Sold', caption: 'Units Sold' },
    //                     { name: 'Price', caption: 'Sold Amount' }
    //                 ],
    //                 rows: [{ name: 'Country', caption: 'Countries' }],
    //                 formatSettings: [{ name: 'Price', format: 'C0' }, { name: 'Sold', format: 'N0' }],
    //             },
    //             showGroupingBar: true,
    //             dataBound: dataBound
    //         });
    //         pivotGridObj.appendTo('#PivotGrid');
    //     });
    //     beforeEach((done: Function) => {
    //         setTimeout(() => { done(); }, 1000);
    //     });
    //     it('Intial rendering - pivot table', (done: Function) => {
    //         setTimeout(() => {
    //             expect(pivotGridObj.pivotValues[0][1].formattedText).toBe('FY 2015');
    //             done();
    //         }, 3000);
    //     });
    //     it('Open field list', (done: Function) => {
    //         setTimeout(() => {
    //             (document.querySelectorAll('.e-btn-filter')[0] as HTMLElement).click();
    //             done();
    //         }, 2000);
    //     });
    //     it('Check', (done: Function) => {
    //         setTimeout(() => {
    //             expect(document.querySelectorAll('.e-member-editor-dialog').length).toBe(1);
    //             done();
    //         }, 4000);
    //     });
    // });
    
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});
