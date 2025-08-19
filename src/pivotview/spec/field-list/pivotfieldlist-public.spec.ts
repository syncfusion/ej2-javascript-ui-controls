import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, isNullOrUndefined, EmitType, closest } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import * as util from '../utils.spec';


describe('PivotFieldList null or undefinied values testing', () => {
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
    describe('Field List -public property testing', () => {
        let fieldListObj11: PivotFieldList;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
        afterAll(() => {
            fieldListObj11.destroy();
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            fieldListObj11 = new PivotFieldList({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                    { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                    { name: 'gender', type: 'Include', items: ['male'] }],
                    rows: [{ name: 'company' }, { name: 'state' }],
                    columns: [{ name: 'name' }],
                    values: [{ name: 'balance', caption: 'Amount' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                },
                cssClass: 'test-class',
                dataBound: dataBound
            });
            fieldListObj11.appendTo('#PivotFieldList');
            util.disableDialogAnimation(fieldListObj11.dialogRenderer.fieldListDialog);
        });
        // Test case for the allowCalculatedField public property
        it('allowCalculatedField - public property', () => {
            // Test with null value
            fieldListObj11.allowCalculatedField = null;
            fieldListObj11.dataBind();
        });
        it('allowCalculatedField - public property-1', () => {
            expect(fieldListObj11.allowCalculatedField).toBe(null);
            // Test with undefined value.
            fieldListObj11.allowCalculatedField = undefined;
            fieldListObj11.dataBind();
        });
        it('allowCalculatedField - public property-2', () => {
            expect(fieldListObj11.allowCalculatedField).toBe(undefined);
        });

        // Test case for the allowDeferLayoutUpdate public property
        it('allowDeferLayoutUpdate - public property', () => {
            // Test with null value
            fieldListObj11.allowDeferLayoutUpdate = null;
            fieldListObj11.dataBind();
        });
        it('allowDeferLayoutUpdate - public property-1', () => {
            expect(fieldListObj11.allowDeferLayoutUpdate).toBe(null);
            // Test with undefined value.
            fieldListObj11.allowDeferLayoutUpdate = undefined;
            fieldListObj11.dataBind();
        });
        it('allowDeferLayoutUpdate - public property-2', () => {
            expect(fieldListObj11.allowDeferLayoutUpdate).toBe(undefined);
        });
        // Test case for the cssClass public property
        it('cssClass - public property', () => {
            // Test with null value
            fieldListObj11.cssClass = null;
            fieldListObj11.dataBind();
        });
        it('cssClass - public property-1', () => {
            expect(fieldListObj11.cssClass).toBe(null);
            // Test with undefined value.
            fieldListObj11.cssClass = undefined;
            fieldListObj11.dataBind();
        });
        it('cssClass - public property-2', () => {
            expect(fieldListObj11.cssClass).toBe(undefined);
        });
        // Test case for the enableFieldSearching public property
        it('enableFieldSearching - public property', () => {
            // Test with null value
            fieldListObj11.enableFieldSearching = null;
            fieldListObj11.dataBind();
        });
        it('enableFieldSearching - public property-1', () => {
            expect(fieldListObj11.enableFieldSearching).toBe(null);
            // Test with undefined value.
            fieldListObj11.enableFieldSearching = undefined;
            fieldListObj11.dataBind();
        });
        it('enableFieldSearching - public property-2', () => {
            expect(fieldListObj11.enableFieldSearching).toBe(undefined);
        });
        // Test case for the enableHtmlSanitizer public property
        it('enableHtmlSanitizer - public property', () => {
            // Test with null value
            fieldListObj11.enableHtmlSanitizer = null;
            fieldListObj11.dataBind();
        });
        it('enableHtmlSanitizer - public property-1', () => {
            expect(fieldListObj11.enableHtmlSanitizer).toBe(null);
            // Test with undefined value.
            fieldListObj11.enableHtmlSanitizer = undefined;
            fieldListObj11.dataBind();
        });
        it('enableHtmlSanitizer - public property-2', () => {
            expect(fieldListObj11.enableHtmlSanitizer).toBe(undefined);
        });
        // Test case for the enablePersistence public property
        it('enablePersistence - public property', () => {
            // Test with null value
            fieldListObj11.enablePersistence = null;
            fieldListObj11.dataBind();
        });
        it('enablePersistence - public property-1', () => {
            expect(fieldListObj11.enablePersistence).toBe(null);
            // Test with undefined value.
            fieldListObj11.enablePersistence = undefined;
            fieldListObj11.dataBind();
        });
        it('enablePersistence - public property-2', () => {
            expect(fieldListObj11.enablePersistence).toBe(undefined);
        });
        // Test case for the enableRtl public property
        it('enableRtl - public property', () => {
            // Test with null value
            fieldListObj11.enableRtl = null;
            fieldListObj11.dataBind();
        });
        it('enableRtl - public property-1', () => {
            expect(fieldListObj11.enableRtl).toBe(null);
            // Test with undefined value.
            fieldListObj11.enableRtl = undefined;
            fieldListObj11.dataBind();
        });
        it('enableRtl - public property-2', () => {
            expect(fieldListObj11.enableRtl).toBe(undefined);
        });
        // Test case for the maxNodeLimitInMemberEditor public property
        it('maxNodeLimitInMemberEditor - public property', () => {
            // Test with null value
            fieldListObj11.maxNodeLimitInMemberEditor = null;
            fieldListObj11.dataBind();
        });
        it('maxNodeLimitInMemberEditor - public property-1', () => {
            expect(fieldListObj11.maxNodeLimitInMemberEditor).toBe(null);
            // Test with undefined value.
            fieldListObj11.maxNodeLimitInMemberEditor = undefined;
            fieldListObj11.dataBind();
        });
        it('maxNodeLimitInMemberEditor - public property-2', () => {
            expect(fieldListObj11.maxNodeLimitInMemberEditor).toBe(undefined);
        });
        // Test case for the dataSourceSettings public property
        it('dataSourceSettings - public property', () => {
            // Test with null value
            fieldListObj11.dataSourceSettings.allowLabelFilter = null;
            fieldListObj11.dataSourceSettings.allowMemberFilter = null;
            fieldListObj11.dataSourceSettings.allowValueFilter = null;
            fieldListObj11.dataSourceSettings.alwaysShowValueHeader = null;
            fieldListObj11.dataSourceSettings.emptyCellsTextContent = null;
            fieldListObj11.dataSourceSettings.enableSorting = null;
            fieldListObj11.dataSourceSettings.excludeFields = null;
            fieldListObj11.dataSourceSettings.expandAll = null;
            fieldListObj11.dataSourceSettings.grandTotalsPosition = null;
            fieldListObj11.dataSourceSettings.mode = null;
            fieldListObj11.dataSourceSettings.showAggregationOnValueField = null;
            fieldListObj11.dataSourceSettings.showColumnGrandTotals = null;
            fieldListObj11.dataSourceSettings.showColumnSubTotals = null;
            fieldListObj11.dataSourceSettings.showGrandTotals = null;
            fieldListObj11.dataSourceSettings.showHeaderWhenEmpty = null;
            fieldListObj11.dataSourceSettings.showRowGrandTotals = null;
            fieldListObj11.dataSourceSettings.showRowSubTotals = null;
            fieldListObj11.dataSourceSettings.showSubTotals = null;
            fieldListObj11.dataSourceSettings.subTotalsPosition = null;
            fieldListObj11.dataSourceSettings.type = null;
            fieldListObj11.dataSourceSettings.valueIndex = null;
            fieldListObj11.dataBind();
        });
        it('dataSourceSettings - public property-1', () => {
            expect(fieldListObj11.dataSourceSettings.allowLabelFilter).toBe(null);
            expect(fieldListObj11.dataSourceSettings.allowMemberFilter).toBe(null);
            expect(fieldListObj11.dataSourceSettings.allowValueFilter).toBe(null);
            expect(fieldListObj11.dataSourceSettings.alwaysShowValueHeader).toBe(null);
            expect(fieldListObj11.dataSourceSettings.emptyCellsTextContent).toBe(null);
            expect(fieldListObj11.dataSourceSettings.enableSorting).toBe(null);
            expect(fieldListObj11.dataSourceSettings.excludeFields).toBe(null);
            expect(fieldListObj11.dataSourceSettings.expandAll).toBe(null);
            expect(fieldListObj11.dataSourceSettings.grandTotalsPosition).toBe(null);
            expect(fieldListObj11.dataSourceSettings.mode).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showAggregationOnValueField).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showColumnGrandTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showColumnSubTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showGrandTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showHeaderWhenEmpty).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showRowGrandTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showRowSubTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showSubTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.subTotalsPosition).toBe(null);
            expect(fieldListObj11.dataSourceSettings.type).toBe(null);
            expect(fieldListObj11.dataSourceSettings.valueIndex).toBe(null);
            // Test with undefined value.
            fieldListObj11.dataSourceSettings.allowLabelFilter = undefined;
            fieldListObj11.dataSourceSettings.allowMemberFilter = undefined;
            fieldListObj11.dataSourceSettings.allowValueFilter = undefined;
            fieldListObj11.dataSourceSettings.alwaysShowValueHeader = undefined;
            fieldListObj11.dataSourceSettings.emptyCellsTextContent = undefined;
            fieldListObj11.dataSourceSettings.enableSorting = undefined;
            fieldListObj11.dataSourceSettings.excludeFields = undefined;
            fieldListObj11.dataSourceSettings.expandAll = undefined;
            fieldListObj11.dataSourceSettings.grandTotalsPosition = undefined;
            fieldListObj11.dataSourceSettings.mode = undefined;
            fieldListObj11.dataSourceSettings.showAggregationOnValueField = undefined;
            fieldListObj11.dataSourceSettings.showColumnGrandTotals = undefined;
            fieldListObj11.dataSourceSettings.showColumnSubTotals = undefined;
            fieldListObj11.dataSourceSettings.showGrandTotals = undefined;
            fieldListObj11.dataSourceSettings.showHeaderWhenEmpty = undefined;
            fieldListObj11.dataSourceSettings.showRowGrandTotals = undefined;
            fieldListObj11.dataSourceSettings.showRowSubTotals = undefined;
            fieldListObj11.dataSourceSettings.showSubTotals = undefined;
            fieldListObj11.dataSourceSettings.subTotalsPosition = undefined;
            fieldListObj11.dataSourceSettings.type = undefined;
            fieldListObj11.dataSourceSettings.valueIndex = undefined;
            fieldListObj11.dataBind();
        });
        it('dataSourceSettings - public property-2', () => {
            expect(fieldListObj11.dataSourceSettings.allowLabelFilter).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.allowMemberFilter).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.allowValueFilter).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.alwaysShowValueHeader).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.emptyCellsTextContent).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.enableSorting).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.excludeFields).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.expandAll).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.grandTotalsPosition).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.mode).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showAggregationOnValueField).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showColumnGrandTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showColumnSubTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showGrandTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showHeaderWhenEmpty).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showRowGrandTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showRowSubTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showSubTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.subTotalsPosition).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.type).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.valueIndex).toBe(undefined);
        });
    });



});