import { PivotView } from '../../src/pivotview/base/pivotview';
import { getInstance, closest, createElement, remove, EmitType, EventHandler } from '@syncfusion/ej2-base';
import { FieldList } from '../../src/common/actions/field-list';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { ExcelExport, PDFExport, VirtualScroll } from '../../src/pivotview/actions';
import { Toolbar } from '../../src/common/popups/toolbar';
import * as util from '../utils.spec';
import { getMemoryProfile, inMB, profile } from '../common.spec';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { MaskedTextBox, TextArea, TextBox } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';
import { NumberFormatting } from '../../src/common/popups/formatting-dialog';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { DrillThrough } from '../../src/pivotview/actions';
import { Grouping } from '../../src/common/popups/grouping';
import { HeadersSortEventArgs } from '../../src/common/base/interface';

describe('Pivot Olap Engine', () => {
    /**
     * Test case for PivotOlapEngine
     */
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });

    describe('Olap specified export', () => {
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
                pending(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, ExcelExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Adventure Works',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    formatSettings: [{ name: '[Measures].[Customer Count]', format: 'N2' }],
                    rows: [
                        { name: '[Date].[Date]', caption: 'Date Fiscal' },
                    ],
                    columns: [
                        { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                        { name: '[Measures]', caption: 'Measures' },
                    ],
                    values: [
                        { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                        { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' },
                    ],
                    valueAxis: 'column'
                },
                enableVirtualization: true,
                exportAllPages: true,
                beforeExport: function (args) {
                    pivotGridObj.exportSpecifiedPages = { rowSize: 10, columnSize: 5 }
                },
                displayOption: { view: 'Both' },
                chartSettings: {
                    value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                },
                toolbar: ['Export', 'FieldList'],
                allowExcelExport: true,
                allowConditionalFormatting: true,
                allowPdfExport: true,
                showToolbar: true,
                allowCalculatedField: true,
                showFieldList: true,
                showGroupingBar: true,
                height: '500px',
                virtualScrollSettings: { allowSinglePage: false }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For olap specified export sample render', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 4000);
        });
        it('Export', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 4000);
        });
        it('PDF Export', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 4000);
        });
        it('Excel Export', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 4000);
        });
        it('CSV Export', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                done();
            }, 4000);
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

    describe('Olap export', () => {
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
                pending(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, ExcelExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Adventure Works',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    formatSettings: [{ name: '[Measures].[Customer Count]', format: 'N2' }],
                    rows: [
                        { name: '[Date].[Date]', caption: 'Date Fiscal' },
                    ],
                    columns: [
                        { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                        { name: '[Measures]', caption: 'Measures' },
                    ],
                    values: [
                        { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                        { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' },
                    ],
                    valueAxis: 'column'
                },
                enableVirtualization: true,
                exportAllPages: true,
                displayOption: { view: 'Both' },
                chartSettings: {
                    value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                },
                toolbar: ['Export', 'FieldList'],
                allowExcelExport: true,
                allowConditionalFormatting: true,
                allowPdfExport: true,
                showToolbar: true,
                allowCalculatedField: true,
                showFieldList: true,
                showGroupingBar: true,
                height: '500px',
                virtualScrollSettings: { allowSinglePage: false }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For olap sample render', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 4000);
        });
        it('Export', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 4000);
        });
        it('PDF Export', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 4000);
        });
        it('Excel Export', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                done();
            }, 4000);
        });
        it('CSV Export', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                done();
            }, 4000);
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

    describe('Features ensures', () => {
        
        describe('NormalUI', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
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
                PivotView.Inject(GroupingBar, DrillThrough, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        catalog: 'Adventure Works DW Standard Edition',
                        cube: 'Adventure Works',
                        providerType: 'SSAS',
                        url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                        localeIdentifier: 1033,
                        allowLabelFilter: true,
                        allowValueFilter: true,
                        formatSettings: [{ name: '[Measures].[Customer Count]', format: 'N2' }],
                        rows: [
                            { name: '[Date].[Date]', caption: 'Date Fiscal' },
                        ],
                        columns: [
                            { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                            { name: '[Measures]', caption: 'Measures' },
                        ],
                        values: [
                            { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                            { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' },
                        ],
                        filterSettings: [
                            {
                                name: '[Customer].[Customer Geography]',
                                items: ['[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]',
                                    '[Customer].[Customer Geography].[State-Province].&[QLD]&[AU]',
                                    '[Customer].[Customer Geography].[Country].&[Germany]',
                                    '[Customer].[Customer Geography].[Country].&[France]',
                                    '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                                    '[Customer].[Customer Geography].[Country].&[United States]'],
                                levelCount: 2
                            },
                        ],
                        calculatedFieldSettings: [
                            {
                                name: 'BikeAndComponents',
                                formula: '([Product].[Product Categories].[Category].[Bikes] + [Product].[Product Categories].[Category].[Components] )',
                                hierarchyUniqueName: '[Product].[Product Categories]',
                                formatString: 'Standard'
                            },
                            {
                                name: 'Order on Discount',
                                formula: '[Measures].[Order Quantity] + ([Measures].[Order Quantity] * 0.10)',
                                formatString: 'Currency'
                            }
                        ],
                        sortSettings: [{ name: '[Date].[Fiscal]', order: 'Ascending' },
                            { name: '[Customer].[Customer Geography]', order: 'Descending', membersOrder: ['United States', 'Germany'] }],
                        valueAxis: 'column',
                        valueSortSettings: {
                            headerDelimiter: '##',
                            sortOrder: 'Descending',
                            measure: '[Measures].[Internet Sales Amount]'
                        },
                        drilledMembers: [
                            {
                                name: '[Date].[Fiscal]',
                                items: ['[Date].[Fiscal].[Fiscal Year].&[2006]',
                                    '[Date].[Fiscal].[Fiscal Semester].&[2006]&[2]',
                                    '[Date].[Fiscal].[Fiscal Year].&[2008]']
                            },
                            {
                                name: '[Customer].[Customer Geography]',
                                items: ['[Customer].[Customer Geography].[Country].&[Australia]',
                                    '[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]'], delimiter: '##'
                            },
                            {
                                name: '[Geography].[Geography]',
                                items: ['[Geography].[Geography].[Country].&[Australia]',
                                    '[Geography].[Geography].[State-Province].&[NSW]&[AU]'], delimiter: '##'
                            }
                        ],
                        expandAll: false,
                        enableSorting: true,
                        valueIndex: 1,
                        filters: [{ name: '[Employee].[Gender]', caption: 'Gender' }],
                        fieldMapping: [{ name: '[Employee].[Base Rate]', dataType: 'string' },
                        { name: '[Employee].[Employees]', caption: 'Employee' }],
                        conditionalFormatSettings: [
                            {
                                measure: '[Measures].[Customer Count]',
                                value1: 100000,
                                conditions: 'LessThan',
                                style: {
                                    backgroundColor: '#80cbc4',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            },
                            {
                                value1: 500,
                                value2: 1000,
                                measure: 'quantity',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: '#f48fb1',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            }
                        ],
                        showHeaderWhenEmpty: false,
                        emptyCellsTextContent: '-',
                        excludeFields: ['[Product].[Product Line]']
                    },
                    height: 800,
                    width: 800,
                    allowDrillThrough: true,
                    allowDataCompression: true,
                    showToolbar: true,
                    allowExcelExport: true,
                    allowConditionalFormatting: true,
                    allowPdfExport: true,
                    showGroupingBar: true,
                    enableVirtualization: true,
                    showFieldList: false,
                    showValuesButton: true,
                    allowGrouping: true,
                    enablePaging: false,
                    allowNumberFormatting: true,
                    allowCalculatedField: true,
                    allowDeferLayoutUpdate: true,
                    enableValueSorting: true,
                    exportAllPages: false,
                    maxNodeLimitInMemberEditor: 50,
                    saveReport: util.saveReport.bind(this),
                    fetchReport: util.fetchReport.bind(this),
                    loadReport: util.loadReport.bind(this),
                    removeReport: util.removeReport.bind(this),
                    renameReport: util.renameReport.bind(this),
                    newReport: util.newReport.bind(this),
                    toolbarRender: util.beforeToolbarRender.bind(this),
                    displayOption: { view: 'Both' },
                    dataBound: dataBound,
                    onHeadersSort: function(args: HeadersSortEventArgs): void{
                        if(args.fieldName == '[Date].[Fiscal]'){
                        args.members = ['FY 2012', 'FY 2010'];
                        args.IsOrderChanged = true;
                        }
                    },
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                    gridSettings: {
                        columnWidth: 120, rowHeight: 36, allowSelection: true,
                        selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' }
                    },
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
                    virtualScrollSettings: { allowSinglePage: false }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('values testing', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.olapEngineModule.pivotValues[3][4]).formattedText).toBe("Internet Sales Amount");
                    done();
                }, 2500);
            });
            it('Sub Total', (done: Function) => {
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 1000);
            });
            it('Sub Total - True', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 500);
            });
            it('Sub Total - False', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 300);
            });
            it('Sub Total - Row', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 300);
            });
            it('Sub Total - Column', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Sub Total - position top', (done: Function) => {
                setTimeout(() => {
                    let li = document.getElementById('PivotGridsubtotalpositions').children[0] as HTMLElement;
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 500);
            });
            it('Sub Total - position top-1', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('#PivotGridsub-top-position')[0] as HTMLElement).click();
                    let li = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 500);
            });
            it('Sub Total - position bottom', (done: Function) => {
                setTimeout(() => {
                    let li = document.getElementById('PivotGridsubtotalpositions').children[0] as HTMLElement;
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 500);
            });
            it('Sub Total - position bottom-1', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('#PivotGridsub-bottom-position')[0] as HTMLElement).click();
                    let li = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    done();
                }, 500);
            });
            it('Grand Total', (done: Function) => {
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Grand Total - True', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 500);
            });
            it('Grand Total - False', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Grand Total - Row', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Grand Total - Column', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Grand Total - position top', (done: Function) => {
                setTimeout(() => {
                    let li = document.getElementById('PivotGridgrandtotalpositions').children[0] as HTMLElement;
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 500);
            });
            it('Grand Total - position top-1', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('#PivotGridtop-position')[0] as HTMLElement).click();
                    let li = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    done();
                }, 500);
            });
            it('Mouseover on chart icon', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                    let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Click Column Chart with chart grouping bar', (done: Function) => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
                    done();
                }, 100);
            });
            it('Switch to Grid with grouping bar', (done: Function) => {
                (document.querySelector('.e-pivot-toolbar .e-toolbar-grid') as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy();
                    pivotGridObj.displayOption.primary = 'Chart';
                    done();
                }, 100);
            });
            it('drillup testing1', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                    done();
                }, 500);
            });
            it('filter testing', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                    done();
                }, 500);
            });
            it('filter testing01', (done: Function) => {
                setTimeout(() => {
                    let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                    (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                    done();
                }, 500);
            });
            it('filter testing02', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.olapEngineModule.pivotValues[0][1]).formattedText).toBe("Grand Total");
                    done();
                }, 1000);
            });
            it('Export', (done: Function) => {
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('PDF Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Excel Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 500);
            });
            it('CSV Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    done();
                }, 500);
            });
        });

        describe('Features ensuring - Drill', () => {
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
            let pivotGridObj: PivotView;
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(FieldList, VirtualScroll, GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        catalog: 'Adventure Works DW Standard Edition',
                        cube: 'Adventure Works',
                        providerType: 'SSAS',
                        url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                        localeIdentifier: 1033,
                        enableSorting: true,
                        columns: [{ name: '[Measures]', caption: 'Measures' }],
                        rows: [{ name: '[Customer].[Gender]', caption: 'Gender' }, { name: '[Customer].[Marital Status]', caption: 'Status' }],
                        values: [{ name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }],
                    },
                    height: 350,
                    showFieldList: true,
                    showGroupingBar: true,
                    enableVirtualization: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Initial rendering', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.olapEngineModule.pivotValues[3][0].formattedText).toBe('Single');
                    done();
                }, 2000);
            });
            it('drillup testing', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            it('drillup testing1', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            it('drilldown testing', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.olapEngineModule.pivotValues[0][1]).formattedText).toBe("Internet Sales Amount");
                    (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            it('drilldown testing1', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            it('filter testing', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.olapEngineModule.pivotValues[4][0]).formattedText).toBe("Male");
                    (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                    done();
                }, 100);
            });
            it('filter testing01', (done: Function) => {
                setTimeout(() => {
                    let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                    (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                    done();
                }, 300);
            });
            it('filter testing02', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.olapEngineModule.pivotValues[4][0]).formattedText).toBe("Single");
                    done();
                }, 1000);
            });
            it('Change settings', () => {
                pivotGridObj.dataSourceSettings.rows = [{ name: '[Measures]', caption: 'Measures' }];
                pivotGridObj.dataSourceSettings.columns = [{ name: '[Customer].[Gender]', caption: 'Gender' }, { name: '[Customer].[Marital Status]', caption: 'Status' }];
                pivotGridObj.enableVirtualization = false;
            });
            it('filter testing1', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.olapEngineModule.pivotValues[1][2]).formattedText).toBe("Total");
                    (document.querySelectorAll('.e-btn-filter')[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            it('filter testing001', (done: Function) => {
                setTimeout(() => {
                    let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                    (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                    done();
                }, 300);
            });
            it('filter testing002', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.olapEngineModule.pivotValues[0][1]).formattedText).toBe("Male");
                    done();
                }, 1000);
            });
            it('drillup testing0', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.olapEngineModule.pivotValues[1][2]).formattedText).toBe("Total");
                    (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            // it('drilldown testing0', (done: Function) => {
            //     setTimeout(() => {
            //         expect((pivotGridObj.olapEngineModule.pivotValues[1][3]).formattedText).toBe("Grand Total");
            //         (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
            //         done();
            //     }, 1000);
            // });
            // it('drilldown testing01', (done: Function) => {
            //     setTimeout(() => {
            //         (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
            //         done();
            //     }, 100);
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
    });
    // describe('Features ensuring - Drillthrough for column', () => {
    //     let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    //     let pivotGridObj: PivotView;
    //     afterAll(() => {
    //         if (pivotGridObj) {
    //             pivotGridObj.destroy();
    //         }
    //         remove(elem);
    //     });
    //     beforeAll((done: Function) => {
    //         document.body.appendChild(elem);
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         PivotView.Inject(FieldList, VirtualScroll, GroupingBar);
    //         pivotGridObj = new PivotView({
    //             dataSourceSettings: {
    //                 catalog: 'Adventure Works DW Standard Edition',
    //                 cube: 'Finance',
    //                 providerType: 'SSAS',
    //                 url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
    //                 localeIdentifier: 1033,
    //                 enableSorting: true,
    //                 columns: [{ name: '[Measures]', caption: 'Measures' }],
    //                 rows: [{name: '[Account].[Account Type]', caption: 'Account Type'}],
    //                 values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
    //             },
    //             height: 350,
    //             showFieldList: true,
    //             showGroupingBar: true,
    //             enableVirtualization: true,
    //             dataBound: dataBound,
    //             allowDrillThrough: true,
    //             maxRowsInDrillThrough: 10
    //         });
    //         pivotGridObj.appendTo('#PivotGrid');
    //     });
    //     it('Initial rendering', (done: Function) => {
    //         setTimeout(() => {
    //             expect(pivotGridObj.olapEngineModule.pivotValues[3][0].formattedText).toBe('Grand Total');
    //             done();
    //         }, 3000);
    //     });
    //     it('drillthrough column testing', (done: Function) => {
    //         setTimeout(() => {
    //             const targetElement = document.querySelectorAll('.e-rowcell')[1] as HTMLElement;
    //             const dblClickEvent = new MouseEvent('dblclick', {
    //                 'bubbles': true,
    //                 'cancelable': true
    //             });
    //             targetElement.dispatchEvent(dblClickEvent);
                
    //             done();
    //         }, 500);
    //     });

    //     it('memory leak', () => {
    //         profile.sample();
    //         let average: any = inMB(profile.averageChange);
    //         //Check average change in memory samples to not be over 10MB
    //         let memory: any = inMB(getMemoryProfile());
    //         //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    //         expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    //     });
    // });
    // describe('Features ensuring - Drillthrough for row', () => {
    //     let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    //     let pivotGridObj: PivotView;
    //     afterAll(() => {
    //         if (pivotGridObj) {
    //             pivotGridObj.destroy();
    //         }
    //         remove(elem);
    //     });
    //     beforeAll((done: Function) => {
    //         document.body.appendChild(elem);
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         PivotView.Inject(FieldList, VirtualScroll, GroupingBar);
    //         pivotGridObj = new PivotView({
    //             dataSourceSettings: {
    //                 catalog: 'Adventure Works DW Standard Edition',
    //                 cube: 'Finance',
    //                 providerType: 'SSAS',
    //                 url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
    //                 localeIdentifier: 1033,
    //                 enableSorting: true,
    //                 columns: [{ name: '[Measures]', caption: 'Measures' }],
    //                 rows: [{name: '[Account].[Account Type]', caption: 'Account Type'}],
    //                 values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
    //                 valueAxis: 'row',
    //             },
    //             height: 350,
    //             showFieldList: true,
    //             showGroupingBar: true,
    //             enableVirtualization: true,
    //             dataBound: dataBound,
    //             allowDrillThrough: true,
    //             maxRowsInDrillThrough: 10,
    //             allowCalculatedField: true
    //         });
    //         pivotGridObj.appendTo('#PivotGrid');
    //     });
    //     it('Initial rendering', (done: Function) => {
    //         setTimeout(() => {
    //             expect(pivotGridObj.olapEngineModule.pivotValues[3][0].formattedText).toBe('Grand Total');
    //             done();
    //         }, 3000);
    //     });
    //     it('drillthrough row testing', (done: Function) => {
    //         setTimeout(() => {
    //             const targetElement = document.querySelectorAll('.e-rowcell')[1] as HTMLElement;
    //             const dblClickEvent = new MouseEvent('dblclick', {
    //                 'bubbles': true,
    //                 'cancelable': true
    //             });
    //             targetElement.dispatchEvent(dblClickEvent);
                
    //             done();
    //         }, 500);
    //     });

    //     it('memory leak', () => {
    //         profile.sample();
    //         let average: any = inMB(profile.averageChange);
    //         //Check average change in memory samples to not be over 10MB
    //         let memory: any = inMB(getMemoryProfile());
    //         //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    //         expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    //     });
    // });

    describe('Olap virtualization', () => {
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let pivotGridObj: PivotView;
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Adventure Works',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    columns: [{ name: '[Customer].[Customer Geography]', caption: 'Customer Geography' }],
                    rows: [{ name: '[Measures]', caption: 'Measures' }],
                    values: [{ name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }],
                    drilledMembers: [{
                        name: '[Customer].[Customer Geography]', items: [
                            '[Customer].[Customer Geography].[Country].&[Canada]', '[Customer].[Customer Geography].[Country].&[Australia]'
                        ]
                    }]
                },
                width: 300,
                enableVirtualization: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Initial rendering', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('.e-headercontent')[0].scrollLeft = 400;
                pivotGridObj.virtualscrollModule.direction = 'horizondal';
                let args: MouseEvent = new MouseEvent("mousedown", { clientX: 1360, view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablescroll').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablescroll').dispatchEvent(args);
                done();
            }, 1000);
        });
        it('Scroll', (done: Function) => {
            setTimeout(() => {
                let args: MouseEvent = new MouseEvent("mousedown", { clientX: 1360, view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablescroll').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablescroll').dispatchEvent(args);
                done();
            }, 1000);
        });
        it('Validation', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[0][1].formattedText === 'Australia').toBeTruthy();
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
});
