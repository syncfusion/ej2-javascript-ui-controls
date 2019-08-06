/**
 * Grid logger spec document
 */
import { extend } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { createGrid, destroy } from '../base/specutil.spec';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Logger, ItemDetails, detailLists } from '../../../src/grid/actions/logger';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Filter, Selection, Group, Edit, Sort, Reorder, Toolbar, DetailRow, Freeze, Logger, VirtualScroll);

describe('Logger module', () => {

    let dataSource: Function = (): Object[] => {
        let datasrc: Object[] = [];
        for (let i:  number = 0; i < 15; i++) {
            datasrc.push(extend({}, {}, data[i], true));
        }
        return datasrc;
    };

    let module_missing: ItemDetails = detailLists['module_missing'];
    let promise_enabled: ItemDetails = detailLists['promise_enabled'];
    let primary_column_missing: ItemDetails = detailLists['primary_column_missing'];
    let selection_key_missing: ItemDetails = detailLists['selection_key_missing'];
    let actionfailure: ItemDetails = detailLists['actionfailure'];
    let locale_missing: ItemDetails = detailLists['locale_missing'];
    let action_disabled_column: ItemDetails = detailLists['action_disabled_column'];
    let limitation: ItemDetails = detailLists['limitation'];
    let check_datasource_columns: ItemDetails = detailLists['check_datasource_columns'];
    let virtual_height: ItemDetails = detailLists['virtual_height'];
    let exporting_begin: ItemDetails = detailLists['exporting_begin'];
    let exporting_complete: ItemDetails = detailLists['exporting_complete'];
    let resize_min_max: ItemDetails = detailLists['resize_min_max'];
    let grid_sort_comparer: ItemDetails = detailLists['grid_sort_comparer'];
    let grid_remote_edit: ItemDetails = detailLists['grid_remote_edit'];
    let foreign_key_failure: ItemDetails = detailLists['foreign_key_failure'];
    let initial_action: ItemDetails = detailLists['initial_action'];
    let frozen_rows_columns: ItemDetails = detailLists['frozen_rows_columns'];
    let column_type_missing: ItemDetails = detailLists['column_type_missing'];
    let datasource_syntax_mismatch: ItemDetails = detailLists['datasource_syntax_mismatch'];

    describe('Logger render => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
			
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    locale: 'fr-FR',
                    allowSorting: true,
                    frozenRows: 2,
                    selectionSettings: {persistSelection: true},
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal',
                    showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    height: 400,
                    columns: [
                        { field: 'OrderID', type: 'number', visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', allowGrouping: false, allowReordering: false,
                        allowSorting: false, allowFiltering: false },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }
                    ],
                    dataStateChange:(args:any) =>{

                    },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                },               done);
        });

        it('Chceck promise_enabled test', () => {
            promise_enabled.check({}, gridObj);
            promise_enabled.generateMessage({}, gridObj);
            expect(true).toBeTruthy();
        });

        it('Chceck primary_column_missing test', () => {
            expect(primary_column_missing.check({}, gridObj).success).toBeTruthy();
        });

        it('Chceck selection_key_missing test', () => {
            expect(selection_key_missing.check({}, gridObj).success).toBeTruthy();
        });

        it('Chceck locale_missing test', () => {
            expect(locale_missing.check({}, gridObj).success).toBeTruthy();
        });

        it('Chceck action_disabled_column test', () => {
            gridObj.groupColumn('CustomerID');
            gridObj.reorderColumns('CustomerID', 'OrderID');
            gridObj.sortColumn('CustomerID', 'Ascending');
            expect(action_disabled_column.check({moduleName: 'group', columnName: 'CustomerID' }, gridObj).success).toBeTruthy();
            expect(action_disabled_column.check({moduleName: 'reorder', column: 'CustomerID' }, gridObj).success).toBeTruthy();
            expect(action_disabled_column.check({moduleName: 'reorder', column: 'CustomerID', destColumn: 'OrderID' },
            gridObj).success).toBeTruthy();
            expect(action_disabled_column.check({moduleName: 'filter', columnName: 'CustomerID' }, gridObj).success).toBeTruthy();
            expect(action_disabled_column.check({moduleName: 'sort', columnName: 'CustomerID' }, gridObj).success).toBeTruthy();
        });

        it('Check actionfailure test', () => {
            expect(actionfailure.generateMessage({error: 'Format options'}, gridObj)).not.toBeNull();
            expect(actionfailure.generateMessage({error: 'Format'}, gridObj)).not.toBeNull();
            expect(actionfailure.generateMessage({error: {error: {}}}, gridObj)).not.toBeNull();
            expect(actionfailure.check({}, gridObj).success).toBeTruthy();
        });

        it('Check limitation test', () => {
            expect(limitation.generateMessage({error: {}}, gridObj, {name: 'freeze'})).not.toBeNull();
            expect(limitation.generateMessage({error: {}}, gridObj, {name: 'virtualization'})).not.toBeNull();
            expect(limitation.generateMessage({name: 'scroll'}, gridObj, {name: 'scroll'})).not.toBeNull();
            gridObj.setProperties({allowGrouping: false, frozenRows: 0}, true);
            expect(limitation.check('freeze', gridObj).success).toBeFalsy();
            expect(limitation.check('virtualization', gridObj).success).toBeFalsy();
            expect(limitation.check('scroll', gridObj).success).toBeFalsy();
        });

        it('Check virtual_height test', () => {
            expect(virtual_height.check({}, gridObj).success).toBeFalsy();
            expect(virtual_height.generateMessage({}, gridObj)).not.toBeNull();
        });

        it('Check exporting_begin test', () => {
            expect(exporting_begin.check({}, gridObj).success).toBeTruthy();
            expect(exporting_begin.generateMessage({}, gridObj, {})).not.toBeNull();
        });

        it('Check exporting_complete test', () => {
            expect(exporting_complete.check({}, gridObj).success).toBeTruthy();
            expect(exporting_complete.generateMessage({}, gridObj, {})).not.toBeNull();
        });

        it('Check resize_min_max test', () => {
            expect(resize_min_max.check({column: {}}, gridObj).success).toBeFalsy();
            expect(resize_min_max.generateMessage({}, gridObj)).not.toBeNull();
        });

        it('Check grid_sort_comparer test', () => {
            expect(grid_sort_comparer.check({}, gridObj).success).toBeFalsy();
            expect(grid_sort_comparer.generateMessage({}, gridObj)).not.toBeNull();
        });

        it('Check grid_remote_edit test', () => {
            expect(grid_remote_edit.check({result: []}, gridObj).success).toBeTruthy();
            expect(grid_remote_edit.generateMessage({}, gridObj)).not.toBeNull();
        });
        it('Check foreign_key_failure test', () => {
            expect(foreign_key_failure.check({}, gridObj).success).toBeTruthy();
            expect(foreign_key_failure.generateMessage({}, gridObj)).not.toBeNull();
        });

        it('Chceck initial_action test', () => {
            expect(initial_action.check({moduleName: 'group', columnName: 'CustomerID' }, gridObj).success).toBeTruthy();
            expect(initial_action.check({moduleName: 'sort', column: 'CustomerID' }, gridObj).success).toBeTruthy();
            expect(initial_action.check({moduleName: 'filter', column: 'CustomerID', destColumn: 'OrderID' },
            gridObj).success).toBeTruthy();

            expect(initial_action.generateMessage({}, gridObj, {fn: 'checking'})).not.toBeNull();
        });
        it('Chceck frozen_rows_columns test', () => {
            expect(frozen_rows_columns.check({}, gridObj).success).toBeFalsy();
            expect(frozen_rows_columns.generateMessage({}, gridObj)).not.toBeNull();
            gridObj.setProperties({frozenColumns: 8, frozenRows: 20}, true);
            expect(frozen_rows_columns.generateMessage({}, gridObj)).not.toBeNull();
        });
        it('Chceck column_type_missing test', () => {
            expect(column_type_missing.check({column: gridObj.getColumnByField('OrderID')}, gridObj).success).toBeFalsy();
            expect(column_type_missing.generateMessage({}, gridObj, 'OrderID')).not.toBeNull();
        });
        it('Check check_datasource_columns test', () => {
            gridObj.setProperties({columns: []}, true);
            gridObj.getDataModule().dataManager.adaptor.beforeSend = () => true;
            (<any>gridObj).loggerModule.patchadaptor();
            gridObj.getDataModule().dataManager.adaptor.beforeSend();
            (<any>gridObj).loggerModule.destroy();
            expect(check_datasource_columns.check({}, gridObj).success).toBeFalsy();
            expect(check_datasource_columns.generateMessage({}, gridObj)).not.toBeNull();
        });
        it('datasource_format_mismatch test', () => {
            expect(datasource_syntax_mismatch.check({dataState:gridObj}, gridObj).success).toBeTruthy();
            expect(datasource_syntax_mismatch.generateMessage({dataState:gridObj}, gridObj)).not.toBeNull();
        });
        it('memory leak', () => {     
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });    
        afterAll(() => {
            let index;
            // tslint:disable-next-line:no-unused-expression
            gridObj.getInjectedModules().some((m: Function, i: number) => {
                index = i;
                return m.prototype.getModuleName() === Logger.prototype.getModuleName();
            }) && gridObj.getInjectedModules().splice(index, 1);
            destroy(gridObj);
        });
    });
});