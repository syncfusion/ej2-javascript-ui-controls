import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { ExcelExport, PDFExport } from '../../src/pivotview/actions';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { Toolbar } from '../../src/common/popups/toolbar';
import { PivotChart } from '../../src/pivotchart/index';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Pivot Grid Toolbar', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' -  Initial Rendering and Basic Operations', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList, CalculatedField, Toolbar, ConditionalFormatting, PivotChart);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                displayOption: {
                    view: 'Both'
                },
                dataBound: dataBound,
                saveReport: util.saveReport.bind(this),
                fetchReport: util.fetchReport.bind(this),
                loadReport: util.loadReport.bind(this),
                removeReport: util.removeReport.bind(this),
                renameReport: util.renameReport.bind(this),
                newReport: util.newReport.bind(this),
                toolbarRender: util.beforeToolbarRender.bind(this),
                toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load', 'ConditionalFormatting',
                    'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'FieldList'],
                allowExcelExport: true,
                allowConditionalFormatting: true,
                allowPdfExport: true,
                showToolbar: true,
                allowCalculatedField: true,
                showFieldList: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Toolbar initial render check', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                (pivotGridObj.element.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Save Report Dialog-check', () => {
            expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
            (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        });
        it('Remove Report Dialog - Cancel', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
                (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[1] as HTMLElement).click();
                done();
            }, 1000);
        });
        // it('Save Report Dialog', (done: Function) => {
        //     expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
        //     (pivotGridObj.element.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[2] as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Save Report Dialog - Cancel', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
        //         (document.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Save Report Dialog - OK', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Save Report', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report1";
        //         (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        //         (document.querySelector('.e-pivot-toolbar .e-save-report') as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Save Report', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
        //         (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Save As Report Dialog', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[2] as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Save As Report Dialog - Cancel', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
        //         (document.querySelector('.e-pivot-toolbar .e-saveas-report') as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Save As Report Dialog - OK', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Save As Report', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "Report2";
        //         (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        //         (pivotGridObj.toolbarModule as any).action = 'Load';
        //         (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Rename Report Dialog', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[2] as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Rename Report Dialog - Cancel', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display === 'none').toBeTruthy();
        //         (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Rename Report Dialog - OK', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "";
        //         (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Rename Report', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivotview-report-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelector('.e-pivotview-report-input') as HTMLInputElement).value = "ReportRenamed";
        //         (document.querySelectorAll('.e-pivotview-report-dialog .e-btn')[1] as HTMLElement).click();
        //         (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        //         done();
        //     }, 2000);
        // });
        // it('Remove Report Dialog', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[2] as HTMLElement).click();
        //         done();
        //     }, 2000);
        // });
        // it('Remove Report Dialog', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        //         done();
        //     }, 2000);
        // });
        // it('Remove Report Dialog - Cancel', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[1] as HTMLElement).click();
        //         done();
        //     }, 2000);
        // });
        // it('Remove Report Dialog - Cancel', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         (document.querySelector('.e-pivot-toolbar .e-toolbar-fieldlist') as HTMLElement).click();
        //         done();
        //     }, 2000);
        // });
        // it('Fieldlist', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         //expect(window.getComputedStyle(document.querySelector('.e-pivotfieldlist-container')).display !== 'none').toBeTruthy();
        //         (document.querySelector('.e-pivotfieldlist-container .e-cancel-btn') as HTMLElement).click();
        //         (document.querySelector('.e-pivot-toolbar .e-toolbar-formatting') as HTMLElement).click();
        //         done();
        //     }, 2000);
        // });
        // it('Conditional Formatting', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivot-formatting-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelector('.e-collapse') as HTMLElement).click();
        //         (document.querySelector('.e-pivot-formatting-dialog .e-format-cancel-button') as HTMLElement).click();
        //         (document.querySelector('.e-pivot-toolbar .e-new-report') as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('New Report', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[2] as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('New Report', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         //expect(window.getComputedStyle(document.querySelector('.e-pivot-error-dialog')).display === 'none').toBeTruthy();
        //         (document.querySelector('.e-pivot-toolbar .e-remove-report') as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Remove - Empty Report', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         //expect(window.getComputedStyle(document.querySelectorAll('.e-pivot-error-dialog')[1]).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[4] as HTMLElement).click();
        //         (document.querySelector('.e-pivot-toolbar .e-rename-report') as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        // it('Remove - Rename Report', (done: Function) => {
        //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        //     setTimeout(() => {
        //         //expect(window.getComputedStyle(document.querySelectorAll('.e-pivot-error-dialog')[1]).display !== 'none').toBeTruthy();
        //         (document.querySelectorAll('.e-pivot-error-dialog .e-btn')[4] as HTMLElement).click();
        //         done();
        //     }, 1000);
        // });
        it('Export', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('PDF Export', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Excel Export', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('CSV Export', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                done();
            }, 1000);
        });
        it('Export', (done: Function) => {
            PivotView.Inject(PDFExport, ExcelExport);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('PDF Export', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Excel Export', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('CSV Export', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                done();
            }, 1000);
        });
        it('Sub Total', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Sub Total - True', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Sub Total - False', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Sub Total - Row', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Sub Total - Column', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                done();
            }, 1000);
        });
        it('Grand Total', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Grand Total - True', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Grand Total - False', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Grand Total - Row', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Grand Total - Column', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                // pivotGridObj.toolbarModule.refreshToolbar();
                done();
            }, 1000);
        });
    });
    describe(' -  Chart and Grid with grouping bar', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(Toolbar, PivotChart, GroupingBar, FieldList, CalculatedField);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                dataBound: dataBound,
                saveReport: util.saveReport.bind(this),
                fetchReport: util.fetchReport.bind(this),
                loadReport: util.loadReport.bind(this),
                removeReport: util.removeReport.bind(this),
                renameReport: util.renameReport.bind(this),
                newReport: util.newReport.bind(this),
                toolbarRender: util.beforeToolbarRender.bind(this),
                toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'FieldList'],
                allowExcelExport: true,
                allowPdfExport: true,
                showToolbar: true,
                allowCalculatedField: true,
                showFieldList: true,
                showGroupingBar: true,
                displayOption: { view: 'Both' }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Mouseover on chart icon', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 1000);
        });
        it('Click Column Chart with chart grouping bar', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
            setTimeout(() => {
                expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'none').toBeFalsy();
                expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
                done();
            }, 1000);
        });
        it('Switch to Grid with grouping bar', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            (document.querySelector('.e-pivot-toolbar .e-toolbar-grid') as HTMLElement).click();
            setTimeout(() => {
                //expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display).toBe('none');
                expect((document.querySelector('.e-grid') as HTMLElement).style.display === 'none').toBeFalsy();
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy();
                pivotGridObj.displayOption.primary = 'Chart';
                done();
            }, 1000);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        //expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});