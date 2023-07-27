import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove } from '@syncfusion/ej2-base';
import { VirtualScroll } from '../../src/pivotview/actions';
import { PDFExport } from '../../src/pivotview/actions/pdf-export';
import { Toolbar } from '../../src/common/popups/toolbar';
import { FieldList } from '../../src/common/actions/field-list';
import { PdfCellRenderArgs } from '../../src/common/base/interface';

describe('PDF Export', () => {
    describe('- Row height', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false,
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true,
                onPdfCellRender: (args: PdfCellRenderArgs) => {
                    if (args.pivotCell && args.pivotCell.valueSort && args.pivotCell.valueSort.levelName === 'Bike') {
                        args.cell.height = 150;
                    }
                },
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('- customization while export', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('Column width', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false,
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true,
                onPdfCellRender: (args: PdfCellRenderArgs) => {
                    if (args.pivotCell && args.pivotCell.valueSort && args.pivotCell.valueSort.levelName === 'male.balance') {
                        args.column.width = 50;
                    }
                },
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('- customization while export', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });
})