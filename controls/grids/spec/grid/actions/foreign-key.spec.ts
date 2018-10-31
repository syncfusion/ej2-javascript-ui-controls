import { getValue } from '@syncfusion/ej2-base';
import { createGrid, destroy } from '../base/specutil.spec';
import { Grid, FilterSettings } from '../../../src/grid/base/grid';
import { fdata, employeeSelectData, fCustomerData, data } from '../base/datasource.spec';
import { DataManager, Predicate, Query, Deferred } from '@syncfusion/ej2-data';
import { Column } from '../../../src/grid/models/column';
import { PredicateModel } from '../../../src/grid/base/grid-model';
import { CheckBoxFilter } from '../../../src/grid/actions/checkbox-filter';
import { Page } from '../../../src/grid/actions/page';
import { Edit } from '../../../src/grid/actions/edit';
import { Filter } from '../../../src/grid/actions/filter';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { ForeignKey } from '../../../src/grid/actions/foreign-key';
import { PdfExport } from '../../../src/grid/actions/pdf-export';
import { DropDownEditCell } from '../../../src/grid/renderer/dropdown-edit-cell';
import { AggregateColumnModel } from '../../../src/grid/models/aggregate-model';
import { getColumnByForeignKeyValue, refreshForeignData } from '../../../src/grid/base/util';
import { getForeignData } from '../../../src/grid/base/util';
import { CustomSummaryType } from '../../../src/grid/base/type';
import { IRow } from '../../../src/grid/base/interface';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { ExcelExport } from '../../../src/grid/actions/excel-export';

/**
 * Foreign key column feature test cases
 */
Grid.Inject(Page, Edit, Filter, ForeignKey, ExcelExport, Aggregate, Group, Sort, PdfExport);
describe('Foreign Key =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        let options: Object = {
            dataSource: fdata,
            allowSorting: true,
            allowFiltering: true,
            allowExcelExport: true,
            allowGrouping: true,
            allowPaging: true,
            editSettings: { allowEditing: true },
            allowPdfExport: true,
            columns: [
                { field: 'OrderID', width: 120 },
                { field: 'ShipCity', width: 120, dataSource: [] },
                { field: 'EmployeeID', width: 150, foreignKeyValue: 'BirthDate', dataSource: new DataManager(employeeSelectData), format: 'yMd' },
                { field: 'CustomerID', width: 100, foreignKeyValue: 'City', dataSource: fCustomerData, template: '${foreignKeyData.City}' },
            ]
        };
        gridObj = createGrid(options, done);
    });
    // Default Rendering functions
    describe('Default Rendering functions =>', () => {
        it('Initial Rendering in grid.ts', () => {
            expect((<any>gridObj).isForeignKeyEnabled(gridObj.getColumns())).toBe(true);
            expect(gridObj.getForeignKeyColumns().length).toBe(2);
            expect((<any>gridObj).foreignKeyModule).not.toBeUndefined();
        });
        it('Initial Rendering in foreign key.ts', () => {
            let column: Column[] = gridObj.getForeignKeyColumns();
            (<any>gridObj).foreignKeyModule.initForeignKeyColumns(column);
            (<any>gridObj).foreignKeyModule.initForeignKeyColumns(gridObj.getColumns());
            expect(column[0].dataSource instanceof DataManager).toBeTruthy();
            expect(column[0].isForeignColumn()).toBeTruthy();

            let args: { column: Column, predicate: { predicate?: Predicate } } = { column: column[0], predicate: {} };
            (<any>gridObj).foreignKeyModule.generateQueryFormData(args);
            expect(args.predicate.predicate.predicates.length).toBe(6);

            let query: Query = (<any>gridObj).foreignKeyModule.genarateQuery(column[0], column[0].columnData, false, true);
            expect(query instanceof Query).toBeTruthy();
            expect((<any>gridObj).foreignKeyModule.genarateColumnQuery() instanceof Query).toBeTruthy();

            let object: { column: PredicateModel[], isTrue: boolean } = (<any>gridObj).foreignKeyModule.isFiltered(column[0]);
            expect(object.isTrue).toBeFalsy();
            expect(object.column.length).toBe(0);
        });
        it('data query generation', () => {
            expect(getColumnByForeignKeyValue('BirthDate', gridObj.getForeignKeyColumns()).field).toBe('EmployeeID');
        });

        it('from column class', () => {
            let column: Column = gridObj.getForeignKeyColumns()[0];
            expect(column.isForeignColumn()).toBeTruthy();
            expect(column.columnData.length).toBe(6);
            expect(column.editType).toBe('dropdownedit');
            expect(column.sortComparer).not.toBeUndefined();
            expect(column.getSortDirection()).toBe('Descending');
            column.setSortDirection('Ascending');
            expect(column.getSortDirection()).toBe('Ascending');
        });
    });
    describe('Sorting with Foreign key =>', () => {
        it('sort a column', (done: Function) => {
            gridObj.actionComplete = () => {
                expect(gridObj.sortSettings.columns.length).toBe(1);
                expect(gridObj.sortSettings.columns[0].field).toBe('EmployeeID');
                expect(gridObj.sortSettings.columns[0].direction).toBe('Ascending');
                expect(gridObj.getRowsObject()[0].data['EmployeeID']).toBe(4);
                expect(gridObj.getRowsObject()[0].foreignKeyData['EmployeeID'][0]).not.toBeUndefined();
                done();
            };
            gridObj.sortModule.sortColumn('EmployeeID', 'Ascending', false);
        });
    });

    describe('Filtering with Foreign key =>', () => {
        // check box filter
        it('Menu Filter testing', (done: Function) => {
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'filtering') {
                    expect(gridObj.filterSettings.columns[0].field).toBe('BirthDate');
                    expect(gridObj.filterSettings.columns[0].value).not.toBeUndefined();
                    expect(gridObj.getDataRows().length).toBe(9);
                    done();
                }
            };
            gridObj.filterModule.filterByColumn('EmployeeID', '>=', new Date(-664743600000), 'or', false);
        });

        // filter bar filtering
        it('Filter bar filtering', (done: Function) => {
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'filtering') {
                    expect(gridObj.filterSettings.columns[1].field).toBe('City');
                    expect(gridObj.filterSettings.columns[1].value).toBe('Berlin');
                    expect(gridObj.getDataRows().length).toBe(0);
                    done();
                }
            };
            gridObj.filterModule.filterByColumn('CustomerID', 'equal', 'Berlin', 'or', false);
        });

        // check box filtering
        it('Check box filtering', (done: Function) => {
            gridObj.filterSettings.type = 'Excel';
            gridObj.dataBind();
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'filtering') {
                    expect(gridObj.filterSettings.columns.length).toBeGreaterThanOrEqual(2);
                    done();
                }
            };
            (<any>gridObj.filterModule).filterDialogOpen(gridObj.getForeignKeyColumns()[1], gridObj.getHeaderTable().querySelectorAll('.e-filtermenudiv.e-icons')[2]);
            (<any>gridObj.filterModule).filterModule.initiateFilter(gridObj.filterSettings.columns);
        });
        // excel Filtering
        it('Excel Filtering', (done: Function) => {
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'filtering'){
                    expect(gridObj.filterSettings.columns.length).toBeGreaterThanOrEqual(2);
                    done();
                }

            };
            (<any>gridObj.filterModule).filterModule = undefined;
            (<any>gridObj.filterModule).filterDialogOpen(gridObj.getForeignKeyColumns()[1], gridObj.getHeaderTable().querySelectorAll('.e-filtermenudiv.e-icons')[2]);
            (<any>gridObj.filterModule).filterModule.filterByColumn('EmployeeID', 'equal', new Date(-664743600000), 'or', false, 'equal', new Date(-200088000000));
        });

// test case continuously failed so exculde this
        it('clear Filtering', (done: Function) => {
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'filtering') {
                    expect(gridObj.filterSettings.columns.length).toBe(0);
                    !(<any>gridObj.filterModule).filterModule.dialogObj.isDestroyed && 
                    (<any>gridObj.filterModule).filterModule.closeDialog();
                    done();
                }
            };
            gridObj.filterSettings.columns = [];
            gridObj.dataBind();
        });

    });

    describe('Grouping with Foreign key', () => {
        it('Group the column', (done: Function) => {
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'grouping') {
                    expect(gridObj.groupSettings.columns.length).toBe(1);
                    expect(gridObj.getCurrentViewRecords()[0]['EmployeeID']).toBe(4);
                    done();
                }
            };
            gridObj.groupColumn('EmployeeID');
        });
        afterAll((done: Function) => {
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'ungrouping')
                    done();
            }
            gridObj.ungroupColumn('EmployeeID');
        })
    });

    describe('Aggregate with Foreign key =>', () => {
        it('Normal Aggregate testing', () => {
            let customAggregateFn: CustomSummaryType = (data: Object[], column: AggregateColumnModel) => {
                expect(data).not.toBeUndefined();
                let value: number = data.filter((dObj: Object) => {
                    return getValue('City', getForeignData(gridObj.getColumnByField(column.columnName), dObj)[0]) === 'Bern';
                }).length;
                return value;
            };
            gridObj.aggregates = [{
                columns: [{
                    type: 'Custom',
                    customAggregate: customAggregateFn,
                    columnName: 'CustomerID',
                    footerTemplate: 'London count: ${custom}'
                }]
            }];
            gridObj.dataBind();
        });
        it('Group Aggregate testing', (done: Function) => { //random failure
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'grouping') {
                    done();
                }
            };
            let customAggregateFn: CustomSummaryType = (data: Object, column: AggregateColumnModel) => {
                expect(data).not.toBeUndefined();
                return 1;
            };
            gridObj.aggregates = [{
                columns: [{
                    type: 'Custom',
                    customAggregate: customAggregateFn,
                    columnName: 'CustomerID',
                    groupFooterTemplate: 'London count: ${custom}'
                }]
            }];
            gridObj.groupSettings.columns = ['EmployeeID'];
            gridObj.dataBind();
        });
        afterAll((done) => {
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'ungrouping') {
                    done();
                }
            };
            gridObj.ungroupColumn('EmployeeID');
            gridObj.aggregates = [];
            gridObj.dataBind();
        });
    });

    describe('Edit with Foreign key =>', () => {
        // Normal Edit
        it('Normal Edit', () => {
            gridObj.actionComplete = undefined;
            gridObj.selectRow(1);
            gridObj.startEdit();
            expect(gridObj.isEdit).toBeTruthy();
            let dropDownObj: DropDownEditCell = new DropDownEditCell(gridObj);
            (<any>dropDownObj).column = gridObj.getForeignKeyColumns()[0];
            (<any>dropDownObj).obj = {fields: {value: (<any>dropDownObj).column.foreignKeyField}};
            (<any>dropDownObj).ddActionComplete({ result: (<any>dropDownObj).column.columnData });
            expect((<DataManager>(<Column>(<any>dropDownObj).column).dataSource).dataSource.json.length).toBeGreaterThan(5);
            gridObj.endEdit();
        });
    });

    describe('Template Column with Foreign key =>', () => {
        it('Template Testing', () => {
            expect(gridObj.getColumns()[3].template).not.toBeUndefined();
            expect((<HTMLTableRowElement>gridObj.getDataRows()[0]).cells[3].innerText).toBe('Rio de Janeiro');
        });
    });

    describe('Exporting Grid with Foreign key =>', () => {
        it('Excel Export', (done: Function) => {
            let columns: Column[] = gridObj.getForeignKeyColumns();
            (<any>gridObj.excelExportModule).helper.getColumnData(gridObj).then(() => {
                expect((<any>gridObj.excelExportModule).helper.foreignKeyData['EmployeeID']).not.toBeUndefined();
                done();
            });
        });
    });

    describe('Searching Grid with Foreign key =>', () => { //random failure
        it(' Search testing', (done: Function) => { //random failure
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'searching') {
                    expect(gridObj.getDataRows().length).toBe(1);
                    expect(gridObj.searchSettings.key).toBe('Bern');
                    done();
                }
            };
            gridObj.search('Bern');
        });

        afterAll((done: Function) => {
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'searching') {
                    expect(gridObj.getDataRows().length).toBe(12);
                    expect(gridObj.searchSettings.key).toBe('');
                    done();
                }
            };
            gridObj.search('');
        });
    });
    
    it('Edit Template', (done: Function) => { //random failure
        let elem: HTMLElement;
        let datePickerObj: DatePicker;
        let create: Function = () => {
            elem = document.createElement('input');
            return elem;
        };
        gridObj.dataBound = () => {
            gridObj.selectRow(1);
            gridObj.editModule.startEdit();
            expect(gridObj.isEdit).toBeTruthy();
            gridObj.endEdit();
            expect(gridObj.isEdit).toBeFalsy();
            gridObj.dataBound = null;
            done();
        };
        gridObj.columns[2] = {
            field: 'EmployeeID', width: 150, foreignKeyValue: 'BirthDate', dataSource: new DataManager(employeeSelectData), format: 'yMd', type: 'date', edit: {
                create: create,
                read: () => {
                    return datePickerObj.value;
                },
                destroy: () => {
                    datePickerObj.destroy();
                },
                write: (args: { rowData: Object, column: Column, foreignKeyData: Object }) => {
                    expect(args.foreignKeyData).not.toBeUndefined();
                    datePickerObj = new DatePicker({
                        value: new Date(args.foreignKeyData[args.column.field]),
                        floatLabelType: 'Never'
                    });
                    datePickerObj.appendTo(elem);
                }
            }
        };
        gridObj.columns = gridObj.columns;
        gridObj.refreshColumns();
    });

    describe('Util Functions =>', () => {

        it('Refresh Foreign Data', () => {
            let rowObj: IRow<Column> = gridObj.getRowsObject()[1];
            let a: string = rowObj.foreignKeyData['CustomerID'][0]['City'];
            expect(rowObj.foreignKeyData['CustomerID']).not.toBeUndefined();
            expect(rowObj.foreignKeyData['EmployeeID']).not.toBeUndefined();
            refreshForeignData(rowObj, gridObj.getForeignKeyColumns(), gridObj.getRowsObject()[2].data);
            expect(rowObj.foreignKeyData['CustomerID'][0]['City']).not.toBe(a);
            expect(rowObj.foreignKeyData['EmployeeID'][0]['BirthDate'].toString()).not.toBeUndefined();
        });

        it('Get Foreign Data', () => {
            expect(getForeignData(gridObj.getForeignKeyColumns()[0], {}, 5)[0]['FirstName']).toBe('Steven');
        });
    });

    describe('Check failed cases =>', () => {
        // To do uncovered statements or functions.
        it('Data Source getting error', () => {
            let deferred: Deferred = new Deferred();
            deferred.resolve(true);
            let column: Column = gridObj.getForeignKeyColumns()[0];
            (<DataManager>column.dataSource).dataSource.offline = false;
            (<DataManager>column.dataSource).ready = <any>deferred.promise;
            (<any>gridObj).foreignKeyModule.getForeignKeyData({ column: gridObj.getForeignKeyColumns()[0], isComplex: true, promise: deferred.promise });
            gridObj.allowPaging = false;
            (<any>gridObj).foreignKeyModule.genarateQuery({ needQuery: true, fromData: false });
            gridObj.isDestroyed = true;
            (<any>gridObj).foreignKeyModule.initEvent();
            gridObj.isDestroyed = false;
            expect(true).toBeTruthy();
        });

    });

    describe('Binding datasource dynamically with Foreign key =>', () => {
        it('Bind the data', () => {
            expect(gridObj.getDataModule().dataManager.dataSource.json.length).toBe(15);
        });
        it('Check the data', (done: Function) => {
            gridObj.actionComplete = (args) => {
                if (args.requestType === 'refresh') {
                expect(gridObj.getDataModule().dataManager.dataSource.json.length).toBe(5);
                done();
                }
            };
            gridObj.dataSource = data.slice(0,5);
        });
    });

    afterAll(() => {
        destroy(gridObj);
    });
});