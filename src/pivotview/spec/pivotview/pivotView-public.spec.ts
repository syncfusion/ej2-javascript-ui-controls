import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { NumberFormatting } from '../../src/common/popups/formatting-dialog';
import { PDFExport } from '../../src/pivotview/actions/pdf-export';
import { ExcelExport } from '../../src/pivotview/actions/excel-export';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { Toolbar } from '../../src/common/popups/toolbar';
import { DrillThrough } from '../../src/pivotview/actions';
import { Pager } from '../../src/pivotview/actions/pager';
import { Grouping } from '../../src/common/popups/grouping';
import { createElement, EmitType, remove } from '@syncfusion/ej2-base';




describe('Pivotview Public properties null or undefined value testing', () => {
    let pivotDatas: IDataSet[] = [
        {
            _id: "5a940692c2d185d9fde50e5e",
            index: 0,
            guid: "810a1191-81bd-4c18-ac73-d16ad3fc80eb",
            isActive: "false",
            balance: 2430.87,
            advance: 7658,
            quantity: 11,
            age: 21,
            eyeColor: "blue",
            name: "Skinner Ward",
            gender: "male",
            company: "GROK",
            email: "skinnerward@grok.com",
            phone: "+1 (931) 600-3042",
            date: "Wed Feb 16 2000 15:01:01 GMT+0530 (India Standard Time)",
            product: "Flight",
            state: "New Jercy",
            pno: "FEDD2340",
        },
        {
            _id: "5a940692c5752f1ed81bbb3d",
            index: 1,
            guid: "41c9986b-ccef-459e-a22d-5458bbdca9c7",
            isActive: "true",
            balance: 3192.7,
            advance: 6124,
            quantity: 15,

            age: 27,
            eyeColor: "brown",
            name: "Gwen Dixon",
            gender: "female",
            company: "ICOLOGY",
            email: "gwendixon@icology.com",
            phone: "+1 (951) 589-2187",
            date: "Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)",
            product: "Jet",
            state: "Vetaikan",
            pno: "ERTS4512",
        },
        {
            _id: "5a9406924c0e7f4c98a82ca7",
            index: 2,
            guid: "50d2bf16-9092-4202-84f6-e892721fe5a5",
            isActive: "true",
            balance: 1663.84,
            advance: 7631,
            quantity: 14,

            age: 28,
            eyeColor: "green",
            name: "Deena Gillespie",
            gender: "female",
            company: "OVERPLEX",
            email: "deenagillespie@overplex.com",
            phone: "+1 (826) 588-3430",
            date: "Thu Mar 18 1993 17:07:48 GMT+0530 (India Standard Time)",
            product: "Car",
            state: "New Jercy",
            pno: "ERTS4512",
        },
        {
            _id: "5a940692dd9db638eee09828",
            index: 3,
            guid: "b8bdc65e-4338-440f-a731-810186ce0b3a",
            isActive: "true",
            balance: 1601.82,
            advance: 6519,
            quantity: 18,

            age: 33,
            eyeColor: "green",
            name: "Susanne Peterson",
            gender: "female",
            company: "KROG",
            email: "susannepeterson@krog.com",
            phone: "+1 (868) 499-3292",
            date: "Sat Feb 09 2002 04:28:45 GMT+0530 (India Standard Time)",
            product: "Jet",
            state: "Vetaikan",
            pno: "CCOP1239",
        },
        {
            _id: "5a9406926f9971a87eae51af",
            index: 4,
            guid: "3f4c79ec-a227-4210-940f-162ca0c293de",
            isActive: "false",
            balance: 1855.77,
            advance: 7333,
            quantity: 20,

            age: 33,
            eyeColor: "green",
            name: "Stokes Hicks",
            gender: "male",
            company: "SIGNITY",
            email: "stokeshicks@signity.com",
            phone: "+1 (927) 585-2980",
            date: "Fri Mar 12 2004 11:08:06 GMT+0530 (India Standard Time)",
            product: "Van",
            state: "Tamilnadu",
            pno: "MEWD9812",
        },
        {
            _id: "5a940692bcbbcdde08fcf7ec",
            index: 5,
            guid: "1d0ee387-14d4-403e-9a0c-3a8514a64281",
            isActive: "true",
            balance: 1372.23,
            advance: 5668,
            quantity: 16,

            age: 39,
            eyeColor: "green",
            name: "Sandoval Nicholson",
            gender: "male",
            company: "IDEALIS",
            email: "sandovalnicholson@idealis.com",
            phone: "+1 (951) 438-3539",
            date: "Sat Aug 30 1975 22:02:15 GMT+0530 (India Standard Time)",
            product: "Bike",
            state: "Tamilnadu",
            pno: "CCOP1239",
        },
        {
            _id: "5a940692ff31a6e1cdd10487",
            index: 6,
            guid: "58417d45-f279-4e21-ba61-16943d0f11c1",
            isActive: "false",
            balance: 2008.28,
            advance: 7107,
            quantity: 14,

            age: 20,
            eyeColor: "brown",
            name: "Blake Thornton",
            gender: "male",
            company: "IMMUNICS",
            email: "blakethornton@immunics.com",
            phone: "+1 (852) 462-3571",
            date: "Mon Oct 03 2005 05:16:53 GMT+0530 (India Standard Time)",
            product: "Tempo",
            state: "New Jercy",
            pno: "CCOP1239",
        },
        {
            _id: "5a9406928f2f2598c7ac7809",
            index: 7,
            guid: "d16299e3-e243-4e57-90fb-52446c4c0275",
            isActive: "false",
            balance: 2052.58,
            advance: 7431,
            quantity: 20,

            age: 22,
            eyeColor: "blue",
            name: "Dillard Sharpe",
            gender: "male",
            company: "INEAR",
            email: "dillardsharpe@inear.com",
            phone: "+1 (963) 473-2308",
            date: "Thu May 25 1978 04:57:00 GMT+0530 (India Standard Time)",
            product: "Tempo",
            state: "Rajkot",
            pno: "ERTS4512",
        },
    ];
    /**
     * Test case for Pivotview Public properties
     */
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('PivotView public property testing', () => {
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
            PivotView.Inject(GroupingBar, DrillThrough, Pager, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    rows: [{ name: 'state' }, { name: 'age' }],
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                    columns: [{ name: 'gender', expandAll: true }, { name: 'advance' }],
                    values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }],
                    filterSettings: [
                        { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                    ],
                },
                dataBound: dataBound,
                toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('load time', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element !== undefined).toBeTruthy();
                done();
            }, 100);
        });
        // Test case for the allowdrillthrough public property
        it('allowDrillThrough-null-set', () => {
            // Test with null value
            pivotGridObj.allowDrillThrough = null;
            pivotGridObj.dataBind();
        });
        it('allowDrillThrough-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowDrillThrough).toBe(null);
                done();
            }, 100);
        });
        it('allowDrillThrough-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.allowDrillThrough = undefined;
            pivotGridObj.dataBind();
        });
        it('allowDrillThrough-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowDrillThrough).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the allowDataCompression public property
        it('allowDataCompression-null-set', () => {
            // Test with null value
            pivotGridObj.allowDataCompression = null;
            pivotGridObj.dataBind();
        });
        it('allowDataCompression-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowDataCompression).toBe(null);
                done();
            }, 100);
        });
        it('allowDataCompression-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.allowDataCompression = undefined;
            pivotGridObj.dataBind();
        });
        it('allowDataCompression-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowDataCompression).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the showFieldlist public property.
        it('showFieldList-null-set', () => {
            // Test with null value
            pivotGridObj.showFieldList = null;
            pivotGridObj.dataBind();
        });
        it('showFieldList-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.showFieldList).toBe(null);
                done();
            }, 100);
        });
        it('showFieldList-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.showFieldList = undefined;
            pivotGridObj.dataBind();
        });
        it('showFieldList-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.showFieldList).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the allowDeferLayoutUpdate public property.
        it('allowDeferLayoutUpdate-null-set', () => {
            // Test with null value
            pivotGridObj.allowDeferLayoutUpdate = null;
            pivotGridObj.dataBind();
        });
        it('allowDeferLayoutUpdate-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowDeferLayoutUpdate).toBe(null);
                done();
            }, 100);
        });
        it('allowDeferLayoutUpdate-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.allowDeferLayoutUpdate = undefined;
            pivotGridObj.dataBind();
        });
        it('allowDeferLayoutUpdate-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowDeferLayoutUpdate).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the exportAllPages public property.
        it('exportAllPages-null-set', () => {
            // Test with null value
            pivotGridObj.exportAllPages = null;
            pivotGridObj.dataBind();
        });
        it('exportAllPages-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.exportAllPages).toBe(null);
                done();
            }, 100);
        });
        it('exportAllPages-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.exportAllPages = undefined;
            pivotGridObj.dataBind();
        });
        it('exportAllPages-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.exportAllPages).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the enableVirtualization public property.
        it('enableVirtualization-null-set', () => {
            // Test with null value
            pivotGridObj.enableVirtualization = null;
            pivotGridObj.dataBind();
        });
        it('enableVirtualization-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.enableVirtualization).toBe(null);
                done();
            }, 100);
        });
        it('enableVirtualization-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.enableVirtualization = undefined;
            pivotGridObj.dataBind();
        });
        it('enableVirtualization-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.enableVirtualization).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the enableFieldSearching public property.
        it('enableFieldSearching-null-set', () => {
            // Test with null value
            pivotGridObj.enableFieldSearching = null;
            pivotGridObj.dataBind();
        });
        it('enableFieldSearching-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.enableFieldSearching).toBe(null);
                done();
            }, 100);
        });
        it('enableFieldSearching-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.enableFieldSearching = undefined;
            pivotGridObj.dataBind();
        });
        it('enableFieldSearching-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.enableFieldSearching).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the showToolbar public property.
        it('showToolbar-null-set', () => {
            // Test with null value
            pivotGridObj.showToolbar = null;
            pivotGridObj.dataBind();
        });
        it('showToolbar-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.showToolbar).toBe(null);
                done();
            }, 100);
        });
        it('showToolbar-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.showToolbar = undefined;
            pivotGridObj.dataBind();
        });
        it('showToolbar-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.showToolbar).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the toolbar public property.
        it('toolbar-null-set', () => {
            // Test with null value
            pivotGridObj.toolbar = null;
            pivotGridObj.dataBind();
        });
        it('toolbar-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.toolbar).toBe(null);
                done();
            }, 100);
        });
        it('toolbar-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.toolbar = undefined;
            pivotGridObj.dataBind();
        });
        it('toolbar-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.toolbar).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the allowNumberFormatting public property.
        it('allowNumberFormatting-null-set', () => {
            // Test with null value
            pivotGridObj.allowNumberFormatting = null;
            pivotGridObj.dataBind();
        });
        it('allowNumberFormatting-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowNumberFormatting).toBe(null);
                done();
            }, 100);
        });
        it('allowNumberFormatting-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.allowNumberFormatting = undefined;
            pivotGridObj.dataBind();
        });
        it('allowNumberFormatting-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowNumberFormatting).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the allowConditionalFormatting public property.
        it('allowConditionalFormatting-null-set', () => {
            // Test with null value
            pivotGridObj.allowConditionalFormatting = null;
            pivotGridObj.dataBind();
        });
        it('allowConditionalFormatting-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowConditionalFormatting).toBe(null);
                done();
            }, 100);
        });
        it('allowConditionalFormatting-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.allowConditionalFormatting = undefined;
            pivotGridObj.dataBind();
        });
        it('allowConditionalFormatting-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowConditionalFormatting).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the allowCalculatedField public property.
        it('allowCalculatedField-null-set', () => {
            // Test with null value
            pivotGridObj.allowCalculatedField = null;
            pivotGridObj.dataBind();
        });
        it('allowCalculatedField-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowCalculatedField).toBe(null);
                done();
            }, 100);
        });
        it('allowCalculatedField-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.allowCalculatedField = undefined;
            pivotGridObj.dataBind();
        });
        it('allowCalculatedField-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowCalculatedField).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the allowPdfExport public property.
        it('allowPdfExport-null-set', () => {
            // Test with null value
            pivotGridObj.allowPdfExport = null;
            pivotGridObj.dataBind();
        });
        it('allowPdfExport-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowPdfExport).toBe(null);
                done();
            }, 100);
        });
        it('allowPdfExport-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.allowPdfExport = undefined;
            pivotGridObj.dataBind();
        });
        it('allowPdfExport-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowPdfExport).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the allowExcelExport public property.
        it('allowExcelExport-null-set', () => {
            // Test with null value
            pivotGridObj.allowExcelExport = null;
            pivotGridObj.dataBind();
        });
        it('allowExcelExport-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowExcelExport).toBe(null);
                done();
            }, 100);
        });
        it('allowExcelExport-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.allowExcelExport = undefined;
            pivotGridObj.dataBind();
        });
        it('allowExcelExport-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowExcelExport).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the showGroupingBar public property.
        it('showGroupingBar-null-set', () => {
            // Test with null value
            pivotGridObj.showGroupingBar = null;
            pivotGridObj.dataBind();
        });
        it('showGroupingBar-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.showGroupingBar).toBe(null);
                done();
            }, 100);
        });
        it('showGroupingBar-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.showGroupingBar = undefined;
            pivotGridObj.dataBind();
        });
        it('showGroupingBar-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.showGroupingBar).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the allowGrouping public property.
        it('allowGrouping-null-set', () => {
            // Test with null value
            pivotGridObj.allowGrouping = null;
            pivotGridObj.dataBind();
        });
        it('allowGrouping-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowGrouping).toBe(null);
                done();
            }, 100);
        });
        it('allowGrouping-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.allowGrouping = undefined;
            pivotGridObj.dataBind();
        });
        it('allowGrouping-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.allowGrouping).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the enableValueSorting public property.
        it('enableValueSorting-null-set', () => {
            // Test with null value
            pivotGridObj.enableValueSorting = null;
            pivotGridObj.dataBind();
        });
        it('enableValueSorting-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.enableValueSorting).toBe(null);
                done();
            }, 100);
        });
        it('enableValueSorting-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.enableValueSorting = undefined;
            pivotGridObj.dataBind();
        });
        it('enableValueSorting-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.enableValueSorting).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the showTooltip public property.
        it('showTooltip-null-set', () => {
            // Test with null value
            pivotGridObj.showTooltip = null;
            pivotGridObj.dataBind();
        });
        it('showTooltip-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.showTooltip).toBe(null);
                done();
            }, 100);
        });
        it('showTooltip-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.showTooltip = undefined;
            pivotGridObj.dataBind();
        });
        it('showTooltip-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.showTooltip).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the maxNodeLimitInMemberEditor public property.
        it('maxNodeLimitInMemberEditor-null-set', () => {
            // Test with null value
            pivotGridObj.maxNodeLimitInMemberEditor = null;
            pivotGridObj.dataBind();
        });
        it('maxNodeLimitInMemberEditor-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.maxNodeLimitInMemberEditor).toBe(null);
                done();
            }, 100);
        });
        it('maxNodeLimitInMemberEditor-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.maxNodeLimitInMemberEditor = undefined;
            pivotGridObj.dataBind();
        });
        it('maxNodeLimitInMemberEditor-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.maxNodeLimitInMemberEditor).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the aggregateTypes public property.
        it('aggregateTypes-null-set', () => {
            // Test with null value
            pivotGridObj.aggregateTypes = null;
            pivotGridObj.dataBind();
        });
        it('aggregateTypes-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.aggregateTypes).toBe(null);
                done();
            }, 100);
        });
        it('aggregateTypes-undefined-set', () => {
            // Test with undefined value.
            pivotGridObj.aggregateTypes = undefined;
            pivotGridObj.dataBind();
        });
        it('aggregateTypes-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.aggregateTypes).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the  pivotview -gridsettings  public property.
        it('pivotview-gridsettings-null-set', () => {
            // Test with null value
            pivotGridObj.gridSettings.height = null;
            pivotGridObj.gridSettings.width = null;
            pivotGridObj.gridSettings.allowSelection = null;
            pivotGridObj.gridSettings.selectionSettings.mode = null;
            pivotGridObj.gridSettings.selectionSettings.type = null;
            pivotGridObj.gridSettings.selectionSettings.cellSelectionMode = null;
            pivotGridObj.dataBind();
        });
        it('load time', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element !== undefined).toBeTruthy();
                done();
            }, 100);
        });
        it('pivotview-gridsettings-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.gridSettings.height).toBe(null);
                expect(pivotGridObj.gridSettings.width).toBe(null);
                expect(pivotGridObj.gridSettings.allowSelection).toBe(null);
                expect(pivotGridObj.gridSettings.selectionSettings.mode).toBe(null);
                expect(pivotGridObj.gridSettings.selectionSettings.type).toBe(null);
                expect(pivotGridObj.gridSettings.selectionSettings.cellSelectionMode).toBe(null);
                // Test with undefined value
                pivotGridObj.gridSettings.height = undefined;
                pivotGridObj.gridSettings.width = undefined;
                pivotGridObj.gridSettings.allowSelection = undefined;
                pivotGridObj.gridSettings.selectionSettings.mode = undefined;
                pivotGridObj.gridSettings.selectionSettings.type = undefined;
                pivotGridObj.gridSettings.selectionSettings.cellSelectionMode = undefined;
                pivotGridObj.dataBind();
                done();
            }, 100);
        });
        it('load time', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element !== undefined).toBeTruthy();
                done();
            }, 100);
        });
        it('pivotview-gridsettings-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.gridSettings.height).toBe(undefined);
                expect(pivotGridObj.gridSettings.width).toBe(undefined);
                expect(pivotGridObj.gridSettings.allowSelection).toBe(undefined);
                expect(pivotGridObj.gridSettings.selectionSettings.mode).toBe(undefined);
                expect(pivotGridObj.gridSettings.selectionSettings.type).toBe(undefined);
                expect(pivotGridObj.gridSettings.selectionSettings.cellSelectionMode).toBe(undefined);
                done();
            }, 100);
        });
        //Test case for the public properties showValuesButton, spinnerTemplate, and toolbarTemplate type.
        it('showValuesButton, spinnerTemplate, and toolbarTemplate -null-set', () => {
            // Test with null value
            pivotGridObj.showValuesButton = null;
            pivotGridObj.spinnerTemplate = null;
            pivotGridObj.toolbarTemplate = null;
            pivotGridObj.dataBind();
        });
        it('load time', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element !== undefined).toBeTruthy();
                done();
            }, 100);
        });
        it('showValuesButton, spinnerTemplate, and toolbarTemplate -null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.showValuesButton).toBe(null);
                expect(pivotGridObj.spinnerTemplate).toBe(null);
                expect(pivotGridObj.toolbarTemplate).toBe(null);
                // Test with undefined value
                pivotGridObj.showValuesButton = undefined;
                pivotGridObj.spinnerTemplate = undefined;
                pivotGridObj.toolbarTemplate = undefined;
                pivotGridObj.dataBind();
                done();
            }, 100);
        });
        it('load time', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element !== undefined).toBeTruthy();
                done();
            }, 100);
        });
        it('showValuesButton, spinnerTemplate, and toolbarTemplate -undefined-check', (done: Function) => {
            // Test with null value
            setTimeout(() => {
                expect(pivotGridObj.showValuesButton).toBe(undefined);
                expect(pivotGridObj.spinnerTemplate).toBe(undefined);
                expect(pivotGridObj.toolbarTemplate).toBe(undefined);
                done();
            }, 100);
        });
        // Test case for the virtualscrollsettings-allowSinglePage public property.
        it('virtualscrollsettings-allowSinglePage-null-set', () => {
            // Test with null value
            pivotGridObj.virtualScrollSettings.allowSinglePage = null;
            pivotGridObj.dataBind();
        });
        it('virtualscrollsettings-allowSinglePage-null-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.virtualScrollSettings.allowSinglePage).toBe(null);
                // Test with undefined value
                pivotGridObj.virtualScrollSettings.allowSinglePage = undefined;
                pivotGridObj.dataBind();
                done();
            }, 100);
        });
        it('virtualscrollsettings-allowSinglePage-undefined-check', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.virtualScrollSettings.allowSinglePage).toBe(undefined);
                done();
            }, 100);
        });
    })

    describe(' PivotView DataSourceSettings - public property testing', () => {
        let pivotGridObj1: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
            if (pivotGridObj1) {
                pivotGridObj1.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(GroupingBar, DrillThrough, Pager, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
            pivotGridObj1 = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    rows: [{ name: 'state' }, { name: 'age' }],
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                    columns: [{ name: 'gender', expandAll: true }, { name: 'advance' }],
                    values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }],
                    filterSettings: [
                        { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                    ],
                },
                height: 800,
                width: 800,
                dataBound: dataBound,
            });
            pivotGridObj1.appendTo('#PivotGrid');
        });
        // Test case for the celltemplate Type public property.
        it('celltemplate - public property', () => {
            // Test with null value
            pivotGridObj1.cellTemplate = null;
            pivotGridObj1.dataBind();
        });
        it('celltemplate - public property-1', () => {
            expect(pivotGridObj1.cellTemplate).toBe(null);
            // Test with undefined value
            pivotGridObj1.cellTemplate = undefined;
            pivotGridObj1.dataBind();
        });
        it('celltemplate - public property-2', () => {
            expect(pivotGridObj1.cellTemplate).toBe(undefined);
        });
        // Test case for the cssClass Type public property.
        it('cssClass - public property', () => {
            // Test with null value
            pivotGridObj1.cssClass = null;
            pivotGridObj1.dataBind();
        });
        it('cssClass - public property-1', () => {
            expect(pivotGridObj1.cssClass).toBe(null);
            // Test with undefined value
            pivotGridObj1.cssClass = undefined;
            pivotGridObj1.dataBind();
        });
        it('cssClass - public property-2', () => {
            expect(pivotGridObj1.cssClass).toBe(undefined);
        });
        // Test case for the DataSourceSettings Type public property.
        it('DataSourceSettings-public property', () => {
            // Test with null value
            pivotGridObj1.dataSourceSettings.expandAll = null;
            pivotGridObj1.dataSourceSettings.excludeFields = null;
            pivotGridObj1.dataSourceSettings.valueAxis = null;
            pivotGridObj1.dataSourceSettings.valueIndex = null;
            pivotGridObj1.dataSourceSettings.enableSorting = null;
            pivotGridObj1.dataSourceSettings.allowLabelFilter = null;
            pivotGridObj1.dataSourceSettings.allowMemberFilter = null;
            pivotGridObj1.dataSourceSettings.allowValueFilter = null;
            pivotGridObj1.dataSourceSettings.showSubTotals = null
            pivotGridObj1.dataSourceSettings.showRowSubTotals = null
            pivotGridObj1.dataSourceSettings.showColumnSubTotals = null
            pivotGridObj1.dataSourceSettings.subTotalsPosition = null
            pivotGridObj1.dataSourceSettings.showGrandTotals = null
            pivotGridObj1.dataSourceSettings.grandTotalsPosition = null
            pivotGridObj1.dataSourceSettings.showRowGrandTotals = null
            pivotGridObj1.dataSourceSettings.showColumnGrandTotals = null
            pivotGridObj1.dataSourceSettings.alwaysShowValueHeader = null
            pivotGridObj1.dataSourceSettings.showHeaderWhenEmpty = null
            pivotGridObj1.dataSourceSettings.showAggregationOnValueField = null
            pivotGridObj1.dataSourceSettings.emptyCellsTextContent = null
            pivotGridObj1.dataSourceSettings.showAggregationOnValueField = null
            pivotGridObj1.dataSourceSettings.showAggregationOnValueField = null
            pivotGridObj1.dataSourceSettings.showAggregationOnValueField = null
            pivotGridObj1.dataSourceSettings.showAggregationOnValueField = null
            pivotGridObj1.dataBind();
        });
        it('DataSourceSettings-public property-1', () => {
            expect(pivotGridObj1.dataSourceSettings.expandAll).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.excludeFields).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.valueAxis).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.valueIndex).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.enableSorting).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.allowLabelFilter).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.allowMemberFilter).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.allowValueFilter).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.showSubTotals).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.showRowSubTotals).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.showColumnSubTotals).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.subTotalsPosition).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.showGrandTotals).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.grandTotalsPosition).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.showRowGrandTotals).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.showColumnGrandTotals).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.alwaysShowValueHeader).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.showHeaderWhenEmpty).toBe(null);
            expect(pivotGridObj1.dataSourceSettings.showAggregationOnValueField).toBe(null);
            // Test with undefined value
            pivotGridObj1.dataSourceSettings.expandAll = undefined;
            pivotGridObj1.dataSourceSettings.excludeFields = undefined;
            pivotGridObj1.dataSourceSettings.valueAxis = undefined;
            pivotGridObj1.dataSourceSettings.valueIndex = undefined;
            pivotGridObj1.dataSourceSettings.enableSorting = undefined;
            pivotGridObj1.dataSourceSettings.allowLabelFilter = undefined;
            pivotGridObj1.dataSourceSettings.allowMemberFilter = undefined;
            pivotGridObj1.dataSourceSettings.allowValueFilter = undefined;
            pivotGridObj1.dataSourceSettings.showSubTotals = undefined
            pivotGridObj1.dataSourceSettings.showRowSubTotals = undefined
            pivotGridObj1.dataSourceSettings.showColumnSubTotals = undefined
            pivotGridObj1.dataSourceSettings.subTotalsPosition = undefined
            pivotGridObj1.dataSourceSettings.showGrandTotals = undefined
            pivotGridObj1.dataSourceSettings.grandTotalsPosition = undefined
            pivotGridObj1.dataSourceSettings.showRowGrandTotals = undefined
            pivotGridObj1.dataSourceSettings.showColumnGrandTotals = undefined
            pivotGridObj1.dataSourceSettings.alwaysShowValueHeader = undefined
            pivotGridObj1.dataSourceSettings.showHeaderWhenEmpty = undefined
            pivotGridObj1.dataSourceSettings.showAggregationOnValueField = undefined
            pivotGridObj1.dataBind();
        });
        it('DataSourceSettings-public property-2', () => {
            expect(pivotGridObj1.dataSourceSettings.expandAll).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.excludeFields).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.valueAxis).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.valueIndex).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.enableSorting).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.allowLabelFilter).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.allowMemberFilter).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.allowValueFilter).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.showSubTotals).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.showRowSubTotals).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.showColumnSubTotals).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.subTotalsPosition).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.showGrandTotals).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.grandTotalsPosition).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.showRowGrandTotals).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.showColumnGrandTotals).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.alwaysShowValueHeader).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.showHeaderWhenEmpty).toBe(undefined);
            expect(pivotGridObj1.dataSourceSettings.showAggregationOnValueField).toBe(undefined);
        });
        // Test case for the display options Type public property.
        it('display option - public property', () => {
            // Test with null value
            pivotGridObj1.displayOption.primary = null;
            pivotGridObj1.displayOption.view = null;
            pivotGridObj1.dataBind();
        });
        // Test case for the display options Type public property.
        it('display option - public property-1', () => {
            // Test with null value
            expect(pivotGridObj1.displayOption.primary).toBe(null);
            expect(pivotGridObj1.displayOption.view).toBe(null);
            // Test with undefined value
            pivotGridObj1.displayOption.primary = undefined;
            pivotGridObj1.displayOption.view = undefined;
            pivotGridObj1.dataBind();
        });
        // Test case for the display options Type public property.
        it('display option - public property-2', () => {
            // Test with null value
            expect(pivotGridObj1.displayOption.primary).toBe(undefined);
            expect(pivotGridObj1.displayOption.view).toBe(undefined);
        });
        // Test case for editsettings Type public property.
        it('editsettings - public property', () => {
            // Test with null value
            pivotGridObj1.editSettings.allowAdding = null;
            pivotGridObj1.editSettings.allowEditing = null;
            pivotGridObj1.editSettings.allowDeleting = null;
            pivotGridObj1.editSettings.allowCommandColumns = null;
            pivotGridObj1.editSettings.mode = null;
            pivotGridObj1.editSettings.allowEditOnDblClick = null;
            pivotGridObj1.editSettings.showConfirmDialog = null;
            pivotGridObj1.editSettings.showDeleteConfirmDialog = null;
            pivotGridObj1.editSettings.allowInlineEditing = null;
            pivotGridObj1.dataBind();
        });
        it('editsettings - public property-1', () => {
            expect(pivotGridObj1.editSettings.allowAdding).toBe(null);
            expect(pivotGridObj1.editSettings.allowEditing).toBe(null);
            expect(pivotGridObj1.editSettings.allowDeleting).toBe(null);
            expect(pivotGridObj1.editSettings.allowCommandColumns).toBe(null);
            expect(pivotGridObj1.editSettings.mode).toBe(null);
            expect(pivotGridObj1.editSettings.allowEditOnDblClick).toBe(null);
            expect(pivotGridObj1.editSettings.showConfirmDialog).toBe(null);
            expect(pivotGridObj1.editSettings.showDeleteConfirmDialog).toBe(null);
            expect(pivotGridObj1.editSettings.allowInlineEditing).toBe(null);
            // Test with undefined value
            pivotGridObj1.editSettings.allowAdding = undefined;
            pivotGridObj1.editSettings.allowEditing = undefined;
            pivotGridObj1.editSettings.allowDeleting = undefined;
            pivotGridObj1.editSettings.allowCommandColumns = undefined;
            pivotGridObj1.editSettings.mode = undefined;
            pivotGridObj1.editSettings.allowEditOnDblClick = undefined;
            pivotGridObj1.editSettings.showConfirmDialog = undefined;
            pivotGridObj1.editSettings.showDeleteConfirmDialog = undefined;
            pivotGridObj1.editSettings.allowInlineEditing = undefined;
            pivotGridObj1.dataBind();
        });
        it('editsettings - public property-2', () => {
            expect(pivotGridObj1.editSettings.allowAdding).toBe(undefined);
            expect(pivotGridObj1.editSettings.allowEditing).toBe(undefined);
            expect(pivotGridObj1.editSettings.allowDeleting).toBe(undefined);
            expect(pivotGridObj1.editSettings.allowCommandColumns).toBe(undefined);
            expect(pivotGridObj1.editSettings.mode).toBe(undefined);
            expect(pivotGridObj1.editSettings.allowEditOnDblClick).toBe(undefined);
            expect(pivotGridObj1.editSettings.showConfirmDialog).toBe(undefined);
            expect(pivotGridObj1.editSettings.showDeleteConfirmDialog).toBe(undefined);
            expect(pivotGridObj1.editSettings.allowInlineEditing).toBe(undefined);
        });
        // Test case for the enableHtmlSanitizer Type public property.
        it('enableHtmlSanitizer - public property', () => {
            pivotGridObj1.enableHtmlSanitizer = null;
            pivotGridObj1.dataBind();
        });
        it('enableHtmlSanitizer - public property-1', () => {
            expect(pivotGridObj1.enableHtmlSanitizer).toBe(null);
            // Test with undefined value
            pivotGridObj1.enableHtmlSanitizer = undefined;
            pivotGridObj1.dataBind();
        });
        it('enableHtmlSanitizer - public property-2', () => {
            expect(pivotGridObj1.enableHtmlSanitizer).toBe(undefined);
        });
        // Test case for the enablePaging Type public property.
        it('enablePaging - public property', () => {
            // Test with null value
            pivotGridObj1.enablePaging = null;
            pivotGridObj1.dataBind();
        });
        it('enablePaging - public property-1', () => {
            expect(pivotGridObj1.enablePaging).toBe(null);
            // Test with undefined value
            pivotGridObj1.enablePaging = undefined;
            pivotGridObj1.dataBind();
        });
        it('enablePaging - public property-2', () => {
            expect(pivotGridObj1.enablePaging).toBe(undefined);
        });
        // Test case for the enablePersistence Type public property.
        it('enablePersistence - public property', () => {
            // Test with null value
            pivotGridObj1.enablePersistence = null;
            pivotGridObj1.dataBind();
        });
        it('enablePersistence - public property-1', () => {
            expect(pivotGridObj1.enablePersistence).toBe(null);
            // Test with undefined value
            pivotGridObj1.enablePersistence = undefined;
            pivotGridObj1.dataBind();
        });
        it('enablePersistence - public property-2', () => {
            expect(pivotGridObj1.enablePersistence).toBe(undefined);
        });
        // Test case for the enableRtl Type public property.
        it('enableRtl - public property', () => {
            // Test with null value
            pivotGridObj1.enableRtl = null;
            pivotGridObj1.dataBind();
        });
        it('enableRtl - public property-1', () => {
            expect(pivotGridObj1.enableRtl).toBe(null);
            // Test with undefined value
            pivotGridObj1.enableRtl = undefined;
            pivotGridObj1.dataBind();
        });
        it('enableRtl - public property-2', () => {
            expect(pivotGridObj1.enableRtl).toBe(undefined);
        });
        //Test case for the gridSettings public property.
        it('gridSettings - public property', () => {
            // Test with null value
                pivotGridObj1.gridSettings.gridLines = null;
                pivotGridObj1.gridSettings.allowTextWrap = null;
                pivotGridObj1.gridSettings.textWrapSettings = null;
                pivotGridObj1.gridSettings.allowReordering = null;
                pivotGridObj1.gridSettings.allowAutoResizing = null;
                pivotGridObj1.gridSettings.allowResizing = null;
                pivotGridObj1.gridSettings.rowHeight = null;
                pivotGridObj1.gridSettings.columnWidth = null;
                pivotGridObj1.gridSettings.clipMode = null;
                pivotGridObj1.gridSettings.selectedRowIndex = null;
                pivotGridObj1.gridSettings.contextMenuItems = null;
                pivotGridObj1.dataBind();
        });
        it('gridSettings - public property-1', () => {
            expect(pivotGridObj1.gridSettings.gridLines).toBe(null);
            expect(pivotGridObj1.gridSettings.allowTextWrap).toBe(null);
            expect(pivotGridObj1.gridSettings.textWrapSettings).toBe(null);
            expect(pivotGridObj1.gridSettings.allowAutoResizing).toBe(null);
            expect(pivotGridObj1.gridSettings.allowResizing).toBe(null);
            expect(pivotGridObj1.gridSettings.allowReordering).toBe(null);
            expect(pivotGridObj1.gridSettings.rowHeight).toBe(null);
            expect(pivotGridObj1.gridSettings.columnWidth).toBe(null);
            expect(pivotGridObj1.gridSettings.clipMode).toBe(null);
            expect(pivotGridObj1.gridSettings.selectedRowIndex).toBe(null);
            expect(pivotGridObj1.gridSettings.contextMenuItems).toBe(null);
            // Test with undefined value
            pivotGridObj1.gridSettings.gridLines = undefined;
            pivotGridObj1.gridSettings.allowTextWrap = undefined;
            pivotGridObj1.gridSettings.textWrapSettings = undefined;
            pivotGridObj1.gridSettings.allowReordering = undefined;
            pivotGridObj1.gridSettings.allowAutoResizing = undefined;
            pivotGridObj1.gridSettings.allowResizing = undefined;
            pivotGridObj1.gridSettings.rowHeight = undefined;
            pivotGridObj1.gridSettings.columnWidth = undefined;
            pivotGridObj1.gridSettings.clipMode = undefined;
            pivotGridObj1.gridSettings.selectedRowIndex = undefined;
            pivotGridObj1.gridSettings.contextMenuItems = undefined;
            pivotGridObj1.dataBind();
        });
        it('gridSettings - public property-2', () => {
            expect(pivotGridObj1.gridSettings.gridLines).toBe(undefined);
            expect(pivotGridObj1.gridSettings.allowTextWrap).toBe(undefined);
            expect(pivotGridObj1.gridSettings.textWrapSettings).toBe(undefined);
            expect(pivotGridObj1.gridSettings.allowAutoResizing).toBe(undefined);
            expect(pivotGridObj1.gridSettings.allowResizing).toBe(undefined);
            expect(pivotGridObj1.gridSettings.allowReordering).toBe(undefined);
            expect(pivotGridObj1.gridSettings.rowHeight).toBe(undefined);
            expect(pivotGridObj1.gridSettings.columnWidth).toBe(undefined);
            expect(pivotGridObj1.gridSettings.clipMode).toBe(undefined);
            expect(pivotGridObj1.gridSettings.selectedRowIndex).toBe(undefined);
            expect(pivotGridObj1.gridSettings.contextMenuItems).toBe(undefined);
        });
        // Test case for the groupingbarsettings  public property.
        it('groupingbarsettings - public property', () => {
            pivotGridObj1.groupingBarSettings.allowDragAndDrop = null;
            pivotGridObj1.groupingBarSettings.showFilterIcon = null;
            pivotGridObj1.groupingBarSettings.showRemoveIcon = null;
            pivotGridObj1.groupingBarSettings.showValueTypeIcon = null;
            pivotGridObj1.groupingBarSettings.displayMode = null;
            pivotGridObj1.groupingBarSettings.showFieldsPanel = null;
            pivotGridObj1.dataBind();
        });
        it('groupingbarsettings - public property-1', () => {
            expect(pivotGridObj1.groupingBarSettings.allowDragAndDrop).toBe(null);
            expect(pivotGridObj1.groupingBarSettings.showFilterIcon).toBe(null);
            expect(pivotGridObj1.groupingBarSettings.showRemoveIcon).toBe(null);
            expect(pivotGridObj1.groupingBarSettings.showValueTypeIcon).toBe(null);
            expect(pivotGridObj1.groupingBarSettings.displayMode).toBe(null);
            expect(pivotGridObj1.groupingBarSettings.showFieldsPanel).toBe(null);
            // Test with undefined value
            pivotGridObj1.groupingBarSettings.allowDragAndDrop = undefined;
            pivotGridObj1.groupingBarSettings.showFilterIcon = undefined;
            pivotGridObj1.groupingBarSettings.showRemoveIcon = undefined;
            pivotGridObj1.groupingBarSettings.showValueTypeIcon = undefined;
            pivotGridObj1.groupingBarSettings.displayMode = undefined;
            pivotGridObj1.groupingBarSettings.showFieldsPanel = undefined;
            pivotGridObj1.dataBind();
        });
        it('groupingbarsettings - public property-2', () => {
            expect(pivotGridObj1.groupingBarSettings.allowDragAndDrop).toBe(undefined);
            expect(pivotGridObj1.groupingBarSettings.showFilterIcon).toBe(undefined);
            expect(pivotGridObj1.groupingBarSettings.showRemoveIcon).toBe(undefined);
            expect(pivotGridObj1.groupingBarSettings.showValueTypeIcon).toBe(undefined);
            expect(pivotGridObj1.groupingBarSettings.displayMode).toBe(undefined);
            expect(pivotGridObj1.groupingBarSettings.showFieldsPanel).toBe(undefined);
        });
        // Test case for the hyperlinkSettings  public property.
        it('hyperlinkSettings - public property', () => {
            // Test with null value
            pivotGridObj1.hyperlinkSettings.showHyperlink = null;
            pivotGridObj1.hyperlinkSettings.showRowHeaderHyperlink = null;
            pivotGridObj1.hyperlinkSettings.showColumnHeaderHyperlink = null;
            pivotGridObj1.hyperlinkSettings.showValueCellHyperlink = null;
            pivotGridObj1.hyperlinkSettings.showSummaryCellHyperlink = null;
            pivotGridObj1.hyperlinkSettings.headerText = null;
            pivotGridObj1.hyperlinkSettings.cssClass = null;
            pivotGridObj1.dataBind();
        });
        it('hyperlinkSettings - public property', () => {
            expect(pivotGridObj1.hyperlinkSettings.showHyperlink).toBe(null);
            expect(pivotGridObj1.hyperlinkSettings.showRowHeaderHyperlink).toBe(null);
            expect(pivotGridObj1.hyperlinkSettings.showColumnHeaderHyperlink).toBe(null);
            expect(pivotGridObj1.hyperlinkSettings.showValueCellHyperlink).toBe(null);
            expect(pivotGridObj1.hyperlinkSettings.showSummaryCellHyperlink).toBe(null);
            expect(pivotGridObj1.hyperlinkSettings.headerText).toBe(null);
            expect(pivotGridObj1.hyperlinkSettings.cssClass).toBe(null);
            // Test with undefined value
            pivotGridObj1.hyperlinkSettings.showHyperlink = undefined;
            pivotGridObj1.hyperlinkSettings.showRowHeaderHyperlink = undefined;
            pivotGridObj1.hyperlinkSettings.showColumnHeaderHyperlink = undefined;
            pivotGridObj1.hyperlinkSettings.showValueCellHyperlink = undefined;
            pivotGridObj1.hyperlinkSettings.showSummaryCellHyperlink = undefined;
            pivotGridObj1.hyperlinkSettings.headerText = undefined;
            pivotGridObj1.hyperlinkSettings.cssClass = undefined;
            pivotGridObj1.dataBind();
        });
        it('hyperlinkSettings - public property', () => {
            expect(pivotGridObj1.hyperlinkSettings.showHyperlink).toBe(undefined);
            expect(pivotGridObj1.hyperlinkSettings.showRowHeaderHyperlink).toBe(undefined);
            expect(pivotGridObj1.hyperlinkSettings.showColumnHeaderHyperlink).toBe(undefined);
            expect(pivotGridObj1.hyperlinkSettings.showValueCellHyperlink).toBe(undefined);
            expect(pivotGridObj1.hyperlinkSettings.showSummaryCellHyperlink).toBe(undefined);
            expect(pivotGridObj1.hyperlinkSettings.headerText).toBe(undefined);
            expect(pivotGridObj1.hyperlinkSettings.cssClass).toBe(undefined);
        });
    })

    describe('ChartSettings public property testing', () => {
        let pivotGridObj2: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
            if (pivotGridObj2) {
                pivotGridObj2.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(GroupingBar, DrillThrough, Pager, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
            pivotGridObj2 = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    rows: [{ name: 'state' }, { name: 'age' }],
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                    columns: [{ name: 'gender', expandAll: true }, { name: 'advance' }],
                    values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }],
                    filterSettings: [
                        { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                    ],
                },
                dataBound: dataBound,
                toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
            });
            pivotGridObj2.appendTo('#PivotGrid');
        });
        // Test case for the chartsettings background  public property
        it('chartsettings background public property', () => {
            pivotGridObj2.chartSettings.background = null;
            pivotGridObj2.chartSettings.accumulationSelectionMode = null;
            pivotGridObj2.chartSettings.border.color = null;
            pivotGridObj2.chartSettings.border.dashArray = null;
            pivotGridObj2.chartSettings.border.width = null;
            pivotGridObj2.chartSettings.chartArea.background = null;
            pivotGridObj2.chartSettings.chartArea.backgroundImage = null;
            pivotGridObj2.chartSettings.chartArea.opacity = null;
            pivotGridObj2.chartSettings.chartArea.width = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings background public property-1', () => {
            expect(pivotGridObj2.chartSettings.background).toBe(null);
            expect(pivotGridObj2.chartSettings.accumulationSelectionMode).toBe(null);
            expect(pivotGridObj2.chartSettings.border.dashArray).toBe(null);
            expect(pivotGridObj2.chartSettings.border.width).toBe(null);
            expect(pivotGridObj2.chartSettings.border.color).toBe(null);
            expect(pivotGridObj2.chartSettings.chartArea.background).toBe(null);
            expect(pivotGridObj2.chartSettings.chartArea.backgroundImage).toBe(null);
            expect(pivotGridObj2.chartSettings.chartArea.opacity).toBe(null);
            expect(pivotGridObj2.chartSettings.chartArea.width).toBe(null);
            // Test with undefined value.
            pivotGridObj2.chartSettings.background = undefined;
            pivotGridObj2.chartSettings.accumulationSelectionMode = undefined;
            pivotGridObj2.chartSettings.border.color = undefined;
            pivotGridObj2.chartSettings.border.dashArray = undefined;
            pivotGridObj2.chartSettings.border.width = undefined;
            pivotGridObj2.chartSettings.chartArea.background = undefined;
            pivotGridObj2.chartSettings.chartArea.backgroundImage = undefined;
            pivotGridObj2.chartSettings.chartArea.opacity = undefined;
            pivotGridObj2.chartSettings.chartArea.width = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings background public property-2', () => {
            expect(pivotGridObj2.chartSettings.background).toBe(undefined);
            expect(pivotGridObj2.chartSettings.accumulationSelectionMode).toBe(undefined);
            expect(pivotGridObj2.chartSettings.border.dashArray).toBe(undefined);
            expect(pivotGridObj2.chartSettings.border.width).toBe(undefined);
            expect(pivotGridObj2.chartSettings.border.color).toBe(undefined);
            expect(pivotGridObj2.chartSettings.chartArea.background).toBe(undefined);
            expect(pivotGridObj2.chartSettings.chartArea.backgroundImage).toBe(undefined);
            expect(pivotGridObj2.chartSettings.chartArea.opacity).toBe(undefined);
            expect(pivotGridObj2.chartSettings.chartArea.width).toBe(undefined);
        });
        // Test case for the chartSettings-ChartArea public property.
        it('chartSettings-ChartArea public property', () => {
            pivotGridObj2.chartSettings.chartArea.border.color = null;
            pivotGridObj2.chartSettings.chartArea.border.dashArray = null;
            pivotGridObj2.chartSettings.chartArea.border.width = null;
            pivotGridObj2.dataBind();
        });
        it('chartSettings-ChartArea public property-1', () => {
            expect(pivotGridObj2.chartSettings.chartArea.border.color).toBe(null);
            expect(pivotGridObj2.chartSettings.chartArea.border.dashArray).toBe(null);
            expect(pivotGridObj2.chartSettings.chartArea.border.width).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.chartArea.border.color = undefined;
            pivotGridObj2.chartSettings.chartArea.border.dashArray = undefined;
            pivotGridObj2.chartSettings.chartArea.border.width = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartSettings-ChartArea public property-2', () => {
            expect(pivotGridObj2.chartSettings.chartArea.border.color).toBe(undefined);
            expect(pivotGridObj2.chartSettings.chartArea.border.dashArray).toBe(undefined);
            expect(pivotGridObj2.chartSettings.chartArea.border.width).toBe(undefined);
        });
        // Test case for the chartsettings-enableAnimation public property.
        it('chartsettings-enableAnimation public property', () => {
            pivotGridObj2.chartSettings.enableAnimation = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableAnimation public property-1', () => {
            expect(pivotGridObj2.chartSettings.enableAnimation).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.enableAnimation = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableAnimation public property-2', () => {
            expect(pivotGridObj2.chartSettings.enableAnimation).toBe(undefined);
        });
        // Test case for the chartsettings-chartseries public property.
        it('chartsettings-chartseries public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.chartSeries.type = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-chartseries public property-1', () => {
            expect(pivotGridObj2.chartSettings.chartSeries.type).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.chartSeries.type = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-chartseries public property-2', () => {
            expect(pivotGridObj2.chartSettings.chartSeries.type).toBe(undefined);
        });
        // Test case for the chartsettings-columnDelimiter public property.
        it('chartsettings-columnDelimiter public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.columnDelimiter = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-columnDelimiter public property-1', () => {
            expect(pivotGridObj2.chartSettings.columnDelimiter).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.columnDelimiter = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-columnDelimiter public property-2', () => {
            expect(pivotGridObj2.chartSettings.columnDelimiter).toBe(undefined);
        });
        // Test case for the chartsettings-columnHeader public property.
        it('chartsettings-columnHeader public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.columnHeader = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-columnHeader public property-1', () => {
            expect(pivotGridObj2.chartSettings.columnHeader).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.columnHeader = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-columnHeader public property-2', () => {
            expect(pivotGridObj2.chartSettings.columnHeader).toBe(undefined);
        });
        // Test case for the chartsettings-description public property.
        it('chartsettings-description public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.description = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-description public property-1', () => {
            expect(pivotGridObj2.chartSettings.description).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.description = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-description public property-2', () => {
            expect(pivotGridObj2.chartSettings.description).toBe(undefined);
        });
        // Test case for the chartsettings-enableBorderOnMouseMove public property.
        it('chartsettings-enableBorderOnMouseMove public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.enableBorderOnMouseMove = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableBorderOnMouseMove public property-1', () => {
            expect(pivotGridObj2.chartSettings.enableBorderOnMouseMove).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.enableBorderOnMouseMove = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableBorderOnMouseMove public property-2', () => {
            expect(pivotGridObj2.chartSettings.enableBorderOnMouseMove).toBe(undefined);
        });
        // Test case for the chartsettings-enableCanvas public property.
        it('chartsettings-enableCanvas public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.enableCanvas = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableCanvas public property-1', () => {
            expect(pivotGridObj2.chartSettings.enableCanvas).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.enableCanvas = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableCanvas public property-2', () => {
            expect(pivotGridObj2.chartSettings.enableCanvas).toBe(undefined);
        });
        // Test case for the chartsettings-enableExport public property.
        it('chartsettings-enableExport public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.enableExport = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableExport public property-1', () => {
            expect(pivotGridObj2.chartSettings.enableExport).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.enableExport = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableExport public property-2', () => {
            expect(pivotGridObj2.chartSettings.enableExport).toBe(undefined);
        });
        // Test case for the chartsettings-enableMultipleAxis public property.
        it('chartsettings-enableMultipleAxis public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.enableMultipleAxis = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableMultipleAxis public property-1', () => {
            expect(pivotGridObj2.chartSettings.enableMultipleAxis).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.enableMultipleAxis = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableMultipleAxis public property-2', () => {
            expect(pivotGridObj2.chartSettings.enableMultipleAxis).toBe(undefined);
        });
        // Test case for the chartsettings-enableScrollOnMultiAxis public property.
        it('chartsettings-enableScrollOnMultiAxis public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.enableScrollOnMultiAxis = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableScrollOnMultiAxis public property-1', () => {
            expect(pivotGridObj2.chartSettings.enableScrollOnMultiAxis).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.enableScrollOnMultiAxis = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableScrollOnMultiAxis public property-2', () => {
            expect(pivotGridObj2.chartSettings.enableScrollOnMultiAxis).toBe(undefined);
        });
        // Test case for the chartsettings-enableScrollOnMultiAxis public property.
        it('chartsettings-enableSideBySidePlacement public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.enableSideBySidePlacement = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableSideBySidePlacement public property-1', () => {
            expect(pivotGridObj2.chartSettings.enableSideBySidePlacement).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.enableSideBySidePlacement = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableSideBySidePlacement public property-2', () => {
            expect(pivotGridObj2.chartSettings.enableSideBySidePlacement).toBe(undefined);
        });
        // Test case for the chartsettings-enableSmartLabels public property.
        it('chartsettings-enableSmartLabels public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.enableSmartLabels = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableSmartLabels public property-1', () => {
            expect(pivotGridObj2.chartSettings.enableSmartLabels).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.enableSmartLabels = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-enableSmartLabels public property-2', () => {
            expect(pivotGridObj2.chartSettings.enableSmartLabels).toBe(undefined);
        });
        // Test case for the chartsettings-highlightMode public property.
        it('chartsettings-highlightMode public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.highlightMode = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-highlightMode public property-1', () => {
            expect(pivotGridObj2.chartSettings.highlightMode).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.highlightMode = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-highlightMode public property-2', () => {
            expect(pivotGridObj2.chartSettings.highlightMode).toBe(undefined);
        });

        // Test case for the chartsettings-highlightPattern public property.
        it('chartsettings-highlightPattern public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.highlightPattern = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-highlightPattern public property-1', () => {
            expect(pivotGridObj2.chartSettings.highlightPattern).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.highlightPattern = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-highlightPattern public property-2', () => {
            expect(pivotGridObj2.chartSettings.highlightPattern).toBe(undefined);
        });

        // Test case for the chartsettings-isMultiSelect public property.
        it('chartsettings-isMultiSelect public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.isMultiSelect = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-isMultiSelect public property-1', () => {
            expect(pivotGridObj2.chartSettings.isMultiSelect).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.isMultiSelect = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-isMultiSelect public property-2', () => {
            expect(pivotGridObj2.chartSettings.isMultiSelect).toBe(undefined);
        });

        // Test case for the chartsettings-isTransposed public property.
        it('chartsettings-isTransposed public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.isTransposed = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-isTransposed public property-1', () => {
            expect(pivotGridObj2.chartSettings.isTransposed).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.isTransposed = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-isTransposed public property-2', () => {
            expect(pivotGridObj2.chartSettings.isTransposed).toBe(undefined);
        });
        // Test case for the chartsettings-legendSettings public property.
        it('chartsettings-legendSettings public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.legendSettings = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-legendSettings public property-1', () => {
            expect(pivotGridObj2.chartSettings.legendSettings).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.legendSettings = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-legendSettings public property-2', () => {
            expect(pivotGridObj2.chartSettings.legendSettings).toBe(undefined);
        });
        // Test case for the chartsettings-margin public property.
        it('chartsettings-margin public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.margin.bottom = null;
            pivotGridObj2.chartSettings.margin.left = null;
            pivotGridObj2.chartSettings.margin.right = null;
            pivotGridObj2.chartSettings.margin.top = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-margin public property-1', () => {
            expect(pivotGridObj2.chartSettings.margin.bottom).toBe(null);
            expect(pivotGridObj2.chartSettings.margin.left).toBe(null);
            expect(pivotGridObj2.chartSettings.margin.right).toBe(null);
            expect(pivotGridObj2.chartSettings.margin.top).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.margin.bottom = undefined;
            pivotGridObj2.chartSettings.margin.left = undefined;
            pivotGridObj2.chartSettings.margin.right = undefined;
            pivotGridObj2.chartSettings.margin.top = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-margin public property-2', () => {
            expect(pivotGridObj2.chartSettings.margin.bottom).toBe(undefined);
            expect(pivotGridObj2.chartSettings.margin.left).toBe(undefined);
            expect(pivotGridObj2.chartSettings.margin.right).toBe(undefined);
            expect(pivotGridObj2.chartSettings.margin.top).toBe(undefined);
        });
        // Test case for the chartsettings-multipleAxisMode public property.
        it('chartsettings-multipleAxisMode public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.multipleAxisMode = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-multipleAxisMode public property-1', () => {
            expect(pivotGridObj2.chartSettings.multipleAxisMode).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.multipleAxisMode = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-multipleAxisMode public property-2', () => {
            expect(pivotGridObj2.chartSettings.multipleAxisMode).toBe(undefined);
        });
        // Test case for the chartsettings-palettes public property.
        it('chartsettings-palettes public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.palettes = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-palettes public property-1', () => {
            expect(pivotGridObj2.chartSettings.palettes).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.palettes = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-palettes public property-2', () => {
            expect(pivotGridObj2.chartSettings.palettes).toBe(undefined);
        });
        // Test case for the chartsettings-pieCenter public property.
        it('chartsettings-pieCenter public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.pieCenter.x = null;
            pivotGridObj2.chartSettings.pieCenter.y = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-pieCenter public property-1', () => {
            expect(pivotGridObj2.chartSettings.pieCenter.x).toBe(null);
            expect(pivotGridObj2.chartSettings.pieCenter.y).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.pieCenter.x = undefined;
            pivotGridObj2.chartSettings.pieCenter.y = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-pieCenter public property-2', () => {
            expect(pivotGridObj2.chartSettings.pieCenter.x).toBe(undefined);
            expect(pivotGridObj2.chartSettings.pieCenter.y).toBe(undefined);
        });
        // Test case for the chartsettings-primaryXAxis.zoomFactor public property.
        it('chartsettings-primaryXAxis.zoomFactor public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.primaryXAxis.zoomFactor = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-primaryXAxis.zoomFactor public property-1', () => {
            expect(pivotGridObj2.chartSettings.primaryXAxis.zoomFactor).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.primaryXAxis.zoomFactor = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-primaryXAxis.zoomFactor public property-2', () => {
            expect(pivotGridObj2.chartSettings.primaryXAxis.zoomFactor).toBe(undefined);
        });
        // Test case for the chartsettings-multipleAxisMode public property.
        it('chartsettings-primaryYAxis public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.primaryYAxis.zoomFactor = null;
            pivotGridObj2.chartSettings.primaryYAxis.edgeLabelPlacement = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-primaryYAxis public property-1', () => {
            expect(pivotGridObj2.chartSettings.primaryYAxis.zoomFactor).toBe(null);
            expect(pivotGridObj2.chartSettings.primaryYAxis.edgeLabelPlacement).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.primaryYAxis.zoomFactor = undefined;
            pivotGridObj2.chartSettings.primaryYAxis.edgeLabelPlacement = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-primaryYAxis public property-2', () => {
            expect(pivotGridObj2.chartSettings.primaryYAxis.zoomFactor).toBe(undefined);
            expect(pivotGridObj2.chartSettings.primaryYAxis.edgeLabelPlacement).toBe(undefined);
        });
        // Test case for the chartsettings-selectionMode public property.
        it('chartsettings-selectionMode public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.selectionMode = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-selectionMode public property-1', () => {
            expect(pivotGridObj2.chartSettings.selectionMode).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.selectionMode = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-selectionMode public property-2', () => {
            expect(pivotGridObj2.chartSettings.selectionMode).toBe(undefined);
        });
        // Test case for the chartsettings-showMultiLevelLabels public property.
        it('chartsettings-showMultiLevelLabels public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.showMultiLevelLabels = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-showMultiLevelLabels public property-1', () => {
            expect(pivotGridObj2.chartSettings.showMultiLevelLabels).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.showMultiLevelLabels = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-showMultiLevelLabels public property-2', () => {
            expect(pivotGridObj2.chartSettings.showMultiLevelLabels).toBe(undefined);
        });
        // Test case for the chartsettings-showPointColorByMembers public property.
        it('chartsettings-showPointColorByMembers public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.showPointColorByMembers = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-showPointColorByMembers public property-1', () => {
            expect(pivotGridObj2.chartSettings.showPointColorByMembers).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.showPointColorByMembers = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-showPointColorByMembers public property-2', () => {
            expect(pivotGridObj2.chartSettings.showPointColorByMembers).toBe(undefined);
        });
        // Test case for the chartsettings-subTitle public property.
        it('chartsettings-subTitle public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.subTitle = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-subTitle public property-1', () => {
            expect(pivotGridObj2.chartSettings.subTitle).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.subTitle = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-subTitle public property-2', () => {
            expect(pivotGridObj2.chartSettings.subTitle).toBe(undefined);
        });
        // Test case for the chartsettings-tabIndex public property.
        it('chartsettings-tabIndex public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.tabIndex = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-tabIndex public property-1', () => {
            expect(pivotGridObj2.chartSettings.tabIndex).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.tabIndex = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-tabIndex public property-2', () => {
            expect(pivotGridObj2.chartSettings.tabIndex).toBe(undefined);
        });
        // Test case for the chartsettings-theme public property.
        it('chartsettings-theme public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.theme = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-theme public property-1', () => {
            expect(pivotGridObj2.chartSettings.theme).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.theme = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-theme public property-2', () => {
            expect(pivotGridObj2.chartSettings.theme).toBe(undefined);
        });
        // Test case for the chartsettings-title public property.
        it('chartsettings-title public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.title = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-title public property-1', () => {
            expect(pivotGridObj2.chartSettings.title).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.title = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-title public property-2', () => {
            expect(pivotGridObj2.chartSettings.title).toBe(undefined);
        });
        // Test case for the chartsettings-tooltip public property.
        it('chartsettings-tooltip public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.tooltip.template = null;
            pivotGridObj2.chartSettings.tooltip.enable = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-tooltip public property-1', () => {
            expect(pivotGridObj2.chartSettings.tooltip.template).toBe(null);
            expect(pivotGridObj2.chartSettings.tooltip.enable).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.tooltip.template = undefined;
            pivotGridObj2.chartSettings.tooltip.enable = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-tooltip public property-2', () => {
            expect(pivotGridObj2.chartSettings.tooltip.template).toBe(undefined);
            expect(pivotGridObj2.chartSettings.tooltip.enable).toBe(undefined);
        });
        // Test case for the chartsettings-useGroupingSeparator public property.
        it('chartsettings-useGroupingSeparator public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.useGroupingSeparator = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-useGroupingSeparator public property-1', () => {
            expect(pivotGridObj2.chartSettings.useGroupingSeparator).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.useGroupingSeparator = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-useGroupingSeparator public property-2', () => {
            expect(pivotGridObj2.chartSettings.useGroupingSeparator).toBe(undefined);
        });
        // Test case for the chartsettings-value public property.
        it('chartsettings-value public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.value = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-value public property-1', () => {
            expect(pivotGridObj2.chartSettings.value).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.value = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-value public property-2', () => {
            expect(pivotGridObj2.chartSettings.value).toBe(undefined);
        });
        // Test case for the chartsettings-zoomSettings public property.
        it('chartsettings-zoomSettings public property', () => {
            // Test with null value
            pivotGridObj2.chartSettings.zoomSettings.enableDeferredZooming = null;
            pivotGridObj2.chartSettings.zoomSettings.enableMouseWheelZooming = null;
            pivotGridObj2.chartSettings.zoomSettings.enablePan = null;
            pivotGridObj2.chartSettings.zoomSettings.enablePinchZooming = null;
            pivotGridObj2.chartSettings.zoomSettings.enableScrollbar = null;
            pivotGridObj2.chartSettings.zoomSettings.enableSelectionZooming = null;
            pivotGridObj2.chartSettings.zoomSettings.mode = null;
            pivotGridObj2.chartSettings.zoomSettings.toolbarItems = null;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-zoomSettings public property-1', () => {
            expect(pivotGridObj2.chartSettings.zoomSettings.enableDeferredZooming).toBe(null);
            expect(pivotGridObj2.chartSettings.zoomSettings.enableMouseWheelZooming).toBe(null);
            expect(pivotGridObj2.chartSettings.zoomSettings.enablePan).toBe(null);
            expect(pivotGridObj2.chartSettings.zoomSettings.enablePinchZooming).toBe(null);
            expect(pivotGridObj2.chartSettings.zoomSettings.enableScrollbar).toBe(null);
            expect(pivotGridObj2.chartSettings.zoomSettings.enableSelectionZooming).toBe(null);
            expect(pivotGridObj2.chartSettings.zoomSettings.mode).toBe(null);
            expect(pivotGridObj2.chartSettings.zoomSettings.toolbarItems).toBe(null);
            // Test with undefined value
            pivotGridObj2.chartSettings.zoomSettings.enableDeferredZooming = undefined;
            pivotGridObj2.chartSettings.zoomSettings.enableMouseWheelZooming = undefined;
            pivotGridObj2.chartSettings.zoomSettings.enablePan = undefined;
            pivotGridObj2.chartSettings.zoomSettings.enablePinchZooming = undefined;
            pivotGridObj2.chartSettings.zoomSettings.enableScrollbar = undefined;
            pivotGridObj2.chartSettings.zoomSettings.enableSelectionZooming = undefined;
            pivotGridObj2.chartSettings.zoomSettings.mode = undefined;
            pivotGridObj2.chartSettings.zoomSettings.toolbarItems = undefined;
            pivotGridObj2.dataBind();
        });
        it('chartsettings-zoomSettings public property-2', () => {
            expect(pivotGridObj2.chartSettings.zoomSettings.enableDeferredZooming).toBe(undefined);
            expect(pivotGridObj2.chartSettings.zoomSettings.enableMouseWheelZooming).toBe(undefined);
            expect(pivotGridObj2.chartSettings.zoomSettings.enablePan).toBe(undefined);
            expect(pivotGridObj2.chartSettings.zoomSettings.enablePinchZooming).toBe(undefined);
            expect(pivotGridObj2.chartSettings.zoomSettings.enableScrollbar).toBe(undefined);
            expect(pivotGridObj2.chartSettings.zoomSettings.enableSelectionZooming).toBe(undefined);
            expect(pivotGridObj2.chartSettings.zoomSettings.mode).toBe(undefined);
            expect(pivotGridObj2.chartSettings.zoomSettings.toolbarItems).toBe(undefined);
        });
    })
    describe('PivotView public datasourcesettings default item property- testing', () => {
        let pivotGridObj4: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
            if (pivotGridObj4) {
                pivotGridObj4.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(GroupingBar, DrillThrough, Pager, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
            pivotGridObj4 = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                    columns: [{ name: 'gender', expandAll: true }, { name: 'advance' }],
                    values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }],
                    filterSettings: [
                        { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                    ],
                },
                dataBound: dataBound,
                toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
            });
            pivotGridObj4.appendTo('#PivotGrid');
        });
        // Test case for the dataSourceSettings-rows public property
        it('dataSourceSettings-rows public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.rows = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-rows public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.rows).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.rows = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-rows public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.rows).toEqual([]);
        });
        // Test case for the dataSourceSettings-columns public property
        it('dataSourceSettings-columns public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.columns = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-columns public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.columns).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.columns = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-columns public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.columns).toEqual([]);
        });
        // Test case for the dataSourceSettings-values public property
        it('dataSourceSettings-values public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.values = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-values public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.values).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.values = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-values public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.values).toEqual([]);
        });
        // Test case for the dataSourceSettings-filters public property
        it('dataSourceSettings-filters public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.filters = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-filters public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.filters).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.filters = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-filters public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.filters).toEqual([]);
        });
        // Test case for the dataSourceSettings-fieldMapping public property
        it('dataSourceSettings-fieldMapping public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.fieldMapping = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-fieldMapping public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.fieldMapping).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.fieldMapping = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-fieldMapping public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.fieldMapping).toEqual([]);
        });
        // Test case for the dataSourceSettings-conditionalFormatSettings public property
        it('dataSourceSettings-conditionalFormatSettings public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.conditionalFormatSettings = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-conditionalFormatSettings public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.conditionalFormatSettings).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.conditionalFormatSettings = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-conditionalFormatSettings public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.conditionalFormatSettings).toEqual([]);
        });
        // Test case for the dataSourceSettings-calculatedFieldSettings public property
        it('dataSourceSettings-calculatedFieldSettings public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.calculatedFieldSettings = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-calculatedFieldSettings public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.calculatedFieldSettings).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.calculatedFieldSettings = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-calculatedFieldSettings public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.calculatedFieldSettings).toEqual([]);
        });
        // Test case for the dataSourceSettings-filterSettings public property
        it('dataSourceSettings-filterSettings public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.filterSettings = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-filterSettings public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.filterSettings).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.filterSettings = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-filterSettings public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.filterSettings).toEqual([]);
        });
        // Test case for the dataSourceSettings-sortSettings public property
        it('dataSourceSettings-sortSettings public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.sortSettings = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-sortSettings public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.sortSettings).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.sortSettings = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-sortSettings public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.sortSettings).toEqual([]);
        });
        // Test case for the dataSourceSettings-formatSettings public property
        it('dataSourceSettings-formatSettings public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.formatSettings = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-formatSettings public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.formatSettings).toEqual([]);
            // Test with undefined value
            pivotGridObj4.dataSourceSettings.formatSettings = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-formatSettings public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.formatSettings).toEqual([]);
        });
        // Test case for the dataSourceSettings-pageSettings public property
        it('dataSourceSettings-pageSettings public property', () => {
            // Test with null value
            pivotGridObj4.pageSettings.columnPageSize = null;
            pivotGridObj4.pageSettings.currentColumnPage = null;
            pivotGridObj4.pageSettings.currentRowPage = null;
            pivotGridObj4.pageSettings.rowPageSize = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-pageSettings public property-1', () => {
            expect(pivotGridObj4.pageSettings.columnPageSize).toBe(null);
            expect(pivotGridObj4.pageSettings.currentColumnPage).toBe(null);
            expect(pivotGridObj4.pageSettings.currentRowPage).toBe(null);
            expect(pivotGridObj4.pageSettings.rowPageSize).toBe(null);
            // Test with undefined value.
            pivotGridObj4.pageSettings.columnPageSize = undefined;
            pivotGridObj4.pageSettings.currentColumnPage = undefined;
            pivotGridObj4.pageSettings.currentRowPage = undefined;
            pivotGridObj4.pageSettings.rowPageSize = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-pageSettings public property-2', () => {
            expect(pivotGridObj4.pageSettings.columnPageSize).toBe(undefined);
            expect(pivotGridObj4.pageSettings.currentColumnPage).toBe(undefined);
            expect(pivotGridObj4.pageSettings.currentRowPage).toBe(undefined);
            expect(pivotGridObj4.pageSettings.rowPageSize).toBe(undefined);
        });
        //Test case for the dataSourceSettings-drilledMembers public property
        it('dataSourceSettings-drilledMembers public property', () => {
            // Test with null value
            pivotGridObj4.dataSourceSettings.valueSortSettings.headerDelimiter = null;
            pivotGridObj4.dataSourceSettings.valueSortSettings.headerText = null;
            pivotGridObj4.dataSourceSettings.valueSortSettings.measure = null;
            pivotGridObj4.dataSourceSettings.valueSortSettings.sortOrder = null;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-drilledMembers public property-1', () => {
            expect(pivotGridObj4.dataSourceSettings.valueSortSettings.headerDelimiter).toBe(null);
            expect(pivotGridObj4.dataSourceSettings.valueSortSettings.headerText).toBe(null);
            expect(pivotGridObj4.dataSourceSettings.valueSortSettings.measure).toBe(null);
            expect(pivotGridObj4.dataSourceSettings.valueSortSettings.sortOrder).toBe(null);
            // Test with undefined value.
            pivotGridObj4.dataSourceSettings.valueSortSettings.headerDelimiter = undefined;
            pivotGridObj4.dataSourceSettings.valueSortSettings.headerText = undefined;
            pivotGridObj4.dataSourceSettings.valueSortSettings.measure = undefined;
            pivotGridObj4.dataSourceSettings.valueSortSettings.sortOrder = undefined;
            pivotGridObj4.dataBind();
        });
        it('dataSourceSettings-drilledMembers public property-2', () => {
            expect(pivotGridObj4.dataSourceSettings.valueSortSettings.headerDelimiter).toBe(undefined);
            expect(pivotGridObj4.dataSourceSettings.valueSortSettings.headerText).toBe(undefined);
            expect(pivotGridObj4.dataSourceSettings.valueSortSettings.measure).toBe(undefined);
            expect(pivotGridObj4.dataSourceSettings.valueSortSettings.sortOrder).toBe(undefined);
        });
    })
})