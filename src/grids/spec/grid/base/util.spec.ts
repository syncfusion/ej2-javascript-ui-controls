/**
 * Util spec
 */
import { doesImplementInterface, prepareColumns, setCssInGridPopUp, calculateAggregate } from '../../../src/grid/base/util';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { Grid } from '../../../src/grid/base/grid';
import { createGrid, destroy } from '../base/specutil.spec';
import { Column } from '../../../src/grid/models';
import { data } from '../base/datasource.spec';
import { Edit, Toolbar, Filter, Aggregate } from '../../../src/grid/actions';

Grid.Inject(Edit, Toolbar, Filter, Aggregate);

describe('Util module', () => {

    describe('Method testing', () => {
        class Test {
        }
        it('doesImplementInterface testing', () => {
            expect(doesImplementInterface(Test, 'hi')).toBeFalsy();      

            //for coverage
            let div = createElement('div');
            div.appendChild(createElement('span',));
            createElement('div').appendChild(div);
            setCssInGridPopUp(div,{target:div,clientX:0, clientY:100} as any,'e-downtail e-uptail');
            setCssInGridPopUp(div,{target:div,changedTouches:[{clientX:0, clientY:100}]} as any,'e-downtail e-uptail');
            prepareColumns(['a', 'b']); 
        });

    });
    describe('Get methods from Window =>', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let elem: HTMLElement;
        let datePickerObj: DatePicker;

        (<any>window).create = () => {
            elem = document.createElement('input');
            return elem;
        };
        (<any>window).write = (args: { rowData: Object, column: Column }) => {
            datePickerObj = new DatePicker({
                value: new Date(args.rowData[args.column.field]),
                floatLabelType: 'Never'
            });
            datePickerObj.appendTo(elem);
        };

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let options: Object = {
                dataSource: data.map(data => data),
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 100, isPrimaryKey: true },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120 },
                    { field: 'ShipCountry', headerText: 'Ship Name', width: 150 },
                    {
                        field: 'OrderDate', headerText: 'Order Date', type: 'date', width: 150, format: 'yMd', edit: {
                            create: 'create', write: 'write'
                        }
                    }
                ],
                aggregates: [{
                    columns: [{
                        type: 'Custom',
                        customAggregate: 'customAggregateFn',
                        columnName: 'ShipCountry',
                        footerTemplate: 'Brazil Count: ${Custom}'
                    }]
                }],
                actionBegin: actionBegin,
                actionComplete: actionComplete,
            };
            gridObj = createGrid(options, done);
        });
        let customAggFunc: (data: Object) => any = (<any>window).customAggregateFn = (data: Object) => data['result'].filter((item: Object) => item['ShipCountry'] === 'Brazil').length;
        it('Create and Write functions from window', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(args.requestType).toBe('beginEdit');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(4);
            gridObj.editModule.startEdit();
        });

        it('Custom Aggregate method from window', (done: Function) => {
            let column: Object = { customAggregate: 'customAggregateFn' };
            let tempData: any = { result: data };
            let count: any = calculateAggregate('Custom', tempData, column);
            expect(count).toBe(4);
            done();
        });

        afterAll((done) => {
            destroy(gridObj);
            gridObj.aggregates = [];
        });
    });    

});