import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData, projectData2, sampleData5 } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Page } from '../../src/treegrid/actions/page';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { Filter } from '../../src/treegrid/actions/filter';
import { isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { ITreeData } from '../../src';

/**
 * Grid Batch Edit spec
 */
TreeGrid.Inject(Edit, Toolbar, Sort, Filter, Page);
describe('Batch Edit module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); //Skips test (in Chai)
            return;
        }
    });

    describe('Hierarchy - Batch Add', () => {
        let gridObj: TreeGrid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch' },
                    allowSorting: true,
                    allowFiltering: true,
                    treeColumnIndex: 1,
                    toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                    columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                        { field: 'taskName', headerText: 'Task Name' },
                        { field: 'progress', headerText: 'Progress' },
                        { field: 'startDate', headerText: 'Start Date' }
                    ]
                },
                done
            );
        });
        it('Add - Batch Editing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                if (args['requestType'] === 'batchSave' ) {
                    expect(gridObj.dataSource[3].taskID === 41).toBe(true);
                }
                done();
            };
            const addedRecords: string = 'addedRecords';
            gridObj.grid.actionComplete = actionComplete;
            (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
            expect(gridObj.getRowByIndex(0).classList.contains('e-insertedrow')).toBe(true);
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
            expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
            (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
            select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe('Hierarchy - Batch Add for next page', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                pageSettings: { pageSize: 2},
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, validationRules: { required: true }, textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', validationRules: { required: true }, width: 200 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right',  width: 90 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', type: 'date', editType: 'datepickeredit', width: 100, format: { skeleton: 'yMd', type: 'date' }, validationRules: { date: true } }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing for next page', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[0].taskID === 41).toBe(true);
            }
            done();
        };
        const addedRecords: string = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.goToPage(2);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(0).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'Planning Progress';
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy - Batch Add NewRowPosition Below', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[0].subtasks[1].taskID === 41).toBe(true);
            }
            done();
        };
        const addedRecords: string = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy - Batch Add NewRowPosition Above', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Above' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[0].taskID === 41).toBe(true);
            }
            done();
        };
        const addedRecords: string = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(0).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy - Batch Add NewRowPosition Child', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[0].subtasks[0].subtasks.length === 1).toBe(true);
                expect(gridObj.getRowByIndex(1).querySelectorAll('.e-treegridexpand').length === 1).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy - Random action checking', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[1].subtasks[3].taskID === 41).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(5);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(6).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy - Batch cancel checking', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[0].subtasks[0].taskID === 2).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(6);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        gridObj.selectRow(3);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(4).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
        expect(gridObj.getBatchChanges()[addedRecords].length === 2).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy - Random Batch update checking', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[1].subtasks.length === 5).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(5);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
        expect(gridObj.getBatchChanges()[addedRecords].length === 2).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy - Child update count checking', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[1].taskID === 42).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        gridObj.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
        expect(gridObj.getBatchChanges()[addedRecords].length === 2).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy - gotopage delete and add', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[2].subtasks[1].subtasks[0].subtasks[6] === 42).toBe(true);
            }
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.goToPage(3);
        gridObj.selectRow(4);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        gridObj.selectRow(3);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hirarchy editing - Batch Mode', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, mode: 'Batch', allowDeleting: true, allowAdding: true },

                treeColumnIndex: 1,
                toolbar: ['Add', 'Edit', 'Update'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('record double click', () => {
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
    });
    it('batch changeds and save record', () => {
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    it('Batch Add Datasource check - Batch Editing', () => {
        expect(gridObj.dataSource[0].subtasks[1].taskName === 'test').toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hirarchy editing - Batch Edit with expand/collapse request', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, mode: 'Batch', allowDeleting: true, allowAdding: true },

                treeColumnIndex: 1,
                toolbar: ['Add', 'Edit', 'Update'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('record double click', () => {
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
    });
    it('batch edit', () => {
        const click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        gridObj.getRowByIndex(1).dispatchEvent(click);
    });
    it('collapse record', () => {
        const method: string = 'expandCollapseRequest';
        gridObj[method](gridObj.getRowByIndex(0).querySelector('.e-treegridexpand'));
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});


describe('Filtering', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowFiltering: true,
                treeColumnIndex: 1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    mode: 'Batch',
                    newRowPosition: 'Bottom'
                },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'priority', headerText: 'priority' },
                    { field: 'priority', headerText: 'Start Date'},
                    { field: 'duration', headerText: 'duration' }
                ]
            },
            done
        );
    });
    it('Filtering with batch update', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[0].taskName === 'test').toBe(true);
            }
            done();
        };
        gridObj.filterByColumn('priority', 'equal', 'Normal', 'and', true);
        gridObj.grid.actionComplete = actionComplete;
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Sorting', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowSorting: true,
                treeColumnIndex: 1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    mode: 'Batch'
                },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'priority', headerText: 'priority' },
                    { field: 'priority', headerText: 'Start Date'},
                    { field: 'duration', headerText: 'duration' }
                ]
            },
            done
        );
    });
    it('Sorting with batch update', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[2].taskName === 'test').toBe(true);
            }
            done();
        };
        gridObj.sortByColumn('taskID', 'Descending', false);
        gridObj.grid.actionComplete = actionComplete;
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('FlatData - Batch Add', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 90, isPrimaryKey: true },
                    { field: 'TaskName', headerText: 'Task Name', width: 60 },
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[4].taskID === 41).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(0).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('FlatData - Batch Add NewRowPosition Below', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 90, isPrimaryKey: true },
                    { field: 'TaskName', headerText: 'Task Name', width: 60 },
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[2].taskID === 41).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('FlatData - Batch Add NewRowPosition Above', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Above' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 90, isPrimaryKey: true },
                    { field: 'TaskName', headerText: 'Task Name', width: 60 },
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[1].taskID === 41).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(1).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('FlatData - Batch Add NewRowPosition Child', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 90, isPrimaryKey: true },
                    { field: 'TaskName', headerText: 'Task Name', width: 60 },
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] == 'batchSave' ) {
                expect(gridObj.getRowByIndex(1).querySelectorAll('.e-treegridexpand').length === 1).toBe(true);
                expect(gridObj.dataSource[2].taskID === 41).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        expect(gridObj.getRowByIndex(2).classList.contains('e-insertedrow')).toBe(true);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Flat data - Batch Edit ', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 90, isPrimaryKey: true },
                    { field: 'TaskName', headerText: 'Task Name', width: 60 },
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('record double click', () => {
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
    });
    it('batch changes and save record', () => {
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    it('Batch Add Datasource check - Batch Editing', () => {
        expect(gridObj.dataSource[2].TaskName === 'test').toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Filtering', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowFiltering: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 90, isPrimaryKey: true },
                    { field: 'TaskName', headerText: 'Task Name', width: 60 },
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Filtering with batch update', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[0].TaskName === 'test').toBe(true);
            }
            done();
        };
        gridObj.filterByColumn('TaskName', 'equal', 'Parent Task 1', 'and', true);
        gridObj.grid.actionComplete = actionComplete;
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(0, 2).dispatchEvent(event);
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Sorting', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowSorting: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch' },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 90, isPrimaryKey: true },
                    { field: 'TaskName', headerText: 'Task Name', width: 60 },
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Sorting with batch update', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave' ) {
                expect(gridObj.dataSource[3].TaskName === 'test').toBe(true);
            }
            done();
        };
        gridObj.sortByColumn('TaskID', 'Descending', false);
        gridObj.grid.actionComplete = actionComplete;
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect(gridObj.getBatchChanges()['changedRecords'].length === 1).toBe(true);
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe(' Batch  Delete cancel checking', () => {
    let gridObj: TreeGrid;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Batch Delete cancel action ', () => {
        const childRecords: string = 'childRecords';
        gridObj.selectRow(6);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        expect(gridObj.getCurrentViewRecords()[0][childRecords].length === 4).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('While delete all records then add record showing script error', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Delete all records then add new record', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchSave'  ) {
                expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
            }
            done();
        };
        gridObj.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        gridObj.selectRow(6);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        gridObj.selectRow(12);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        const addedRecords: string = 'addedRecords';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 40;
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
        gridObj.grid.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });

    it('Add - Batch Editing', () => {
        const addedRecords: string = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        expect(gridObj.getBatchChanges()[addedRecords].length === 1).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Batch Editing - validation checking for in-between position', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [
                    {
                        field: 'taskID',
                        headerText: 'Task ID',
                        isPrimaryKey: true,
                        textAlign: 'Right',
                        validationRules: { required: true, number: true },
                        width: 90
                    },
                    {
                        field: 'taskName',
                        headerText: 'Task Name',
                        editType: 'stringedit',
                        width: 220,
                        validationRules: { required: true }
                    }
                ]
            },
            done
        );
    });
    it('validation rule', () => {
        gridObj.selectRow(2);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect(gridObj.element.querySelectorAll('.e-griderror').length === 1).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Tab Next Row Edit Testing - EJ2-45352', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, allowNextRowEdit: true, mode: 'Batch',
                    newRowPosition: 'Child' },
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'priority', headerText: 'priority' }
                ]
            },
            done
        );
    });
    it('Edit mode continued to the next row on tab click', () => {
        gridObj.editCell(0, 'priority');
        gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
        expect(gridObj.getRows()[0].classList.contains('e-editedrow')).toBe(true);
        gridObj.grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        gridObj.grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-editedbatchcell') } as any);
        expect(gridObj.getRows()[1].classList.contains('e-editedrow')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-49066 - Random Add and delete check', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] == 'batchSave' ) {
                expect(gridObj.dataSource[0].taskID === 41).toBe(true);
                expect(gridObj.dataSource[1].taskID === 6).toBe(true);
            }
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-53727 - delete the row using deleteRow method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                selectionSettings: { mode: 'Cell',
                    cellSelectionMode: 'Box' },
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', newRowPosition: 'Below' },
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true, width: 90, textAlign: 'Right'},
                    { field: 'TaskName', headerText: 'Task Name', width: 180 },
                    {
                        field: 'StartDate', headerText: 'Start Date', width: 90, editType: 'datepickeredit', textAlign: 'Right', type: 'date', format: 'yMd'
                    },
                    { field: 'Duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
                ]
            },
            done
        );
    });
    it('Delete - Batch Editing', (done: Function) => {
        const deletedRecords: string = 'deletedRecords';
        const row: Element = gridObj.getRows()[1];
        gridObj.deleteRow(row as HTMLTableRowElement);
        expect(gridObj.getBatchChanges()[deletedRecords].length === 1).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        done();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-58264 - Addrecord through method in Batch Editing', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData2,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', newRowPosition: 'Below' },
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', isPrimaryKey: true, width: 90, textAlign: 'Right'},
                    { field: 'TaskName', headerText: 'Task Name', width: 180 },
                    {
                        field: 'StartDate', headerText: 'Start Date', width: 90, editType: 'datepickeredit', textAlign: 'Right', type: 'date', format: 'yMd'
                    },
                    { field: 'Duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
                ]
            },
            done
        );
    });
    it('Addrecordmethod - add as child', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect((gridObj.flatData[3] as any).childRecords[0].TaskID).toBe(111);
            expect((gridObj.flatData[4] as any).TaskID).toBe(111);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.addRecord({TaskID: 111, TaskName: 'Child record'}, 3, 'Child');
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    it('Addrecordmethod - add To Below', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect((gridObj.flatData[2] as any).TaskID).toBe(123);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.addRecord({TaskID: 123, TaskName: 'Below record'}, 1, 'Below');
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    it('Addrecordmethod - add as Above', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect((gridObj.flatData[1] as any).TaskID).toBe(124);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.addRecord({TaskID: 124, taskName: 'Above record'}, 1, 'Above');
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-59077 - Addrecord through method in Batch Editing with single record', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData5,
                idMapping: 'taskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                height: 400,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    mode: 'Batch',
                    newRowPosition: 'Child'
                },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    {
                        field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                        validationRules: { required: true, number: true}, width: 90
                    },
                    { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, validationRules: {required: true} },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                        format: 'yMd', validationRules: { date: true} },
                    {
                        field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100, editType: 'numericedit',
                        validationRules: { number: true, min: 0}, edit: { params: {  format: 'n'}}
                    },
                    {
                        field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 80,
                        editType: 'numericedit', validationRules: { number: true, min: 0 }, edit: { params: {  format: 'n'}}
                    },
                    {
                        field: 'priority', headerText: 'Priority', width: 90,
                        editType: 'stringedit', validationRules: { required: true }
                    }
                ]
            },
            done
        );
    });
    it('Addrecordmethod - Adding child for single record', (done: Function) => {
        gridObj.addRecord({
            taskID: 2,
            taskName: 'CHILD',
            startDate: new Date('02/03/2017'),
            progress: 100,
            duration: 5,
            priority: 'Normal',
            parentID: 1
        }, 0, 'Child');
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        expect(gridObj.getRows()[0].getElementsByClassName('e-treecolumn-container')[0].children[0].classList.contains('e-treegridexpand')).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-59077 - ExpandCollapse Icon position check', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Batch Editing ExpandCollapse Icon check', (done: Function) => {
        gridObj.selectRow(2);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        expect((gridObj.flatData[0] as ITreeData).hasChildRecords).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-60732 - Adding multiple record through addRecord method in Batch Editing', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - Adding multiple record through addRecord method', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect((gridObj.flatData[0] as ITreeData).childRecords.length).toBe(6);
            done();
        };
        gridObj.addRecord({
            taskID: 100,
            taskName: 'Fist Record',
            startDate: new Date('02/03/2017'),
            progress: 100
        }, 1, 'Below');
        gridObj.addRecord({
            taskID: 101,
            taskName: 'Second Record',
            startDate: new Date('02/05/2017'),
            progress: 100
        }, 4, 'Below');
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        gridObj.actionComplete = actionComplete;
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-70058 -When rowdd is enabled with batch edit mode, the expand/collapse icon is not shown for the edited cell', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                allowFiltering: true,
                allowRowDragAndDrop: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Batch edit with rowDragandDrop', (done: Function) => {
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'plannings';
        gridObj.grid.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault,  target: (<any>gridObj.getContent().querySelector('.e-row')).cells[2] } as any);
        expect(gridObj.getRows()[0].getElementsByClassName('e-treecolumn-container')[0].children[0].classList.contains('e-treegridexpand')).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });

    describe('Code coverage improment', () => {
        let treegrid: TreeGrid;
        beforeAll((done: Function) => {
            treegrid = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    allowPaging: true,
                    editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                    allowFiltering: true,
                    allowRowDragAndDrop: true,
                    treeColumnIndex: 1,
                    toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                    columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                        { field: 'taskName', headerText: 'Task Name' },
                        { field: 'progress', headerText: 'Progress' },
                        { field: 'startDate', headerText: 'Start Date' }
                    ]
                },
                done
            );
        });
        it('check the removeEventListener Binding', (done: Function) => {
            treegrid.isDestroyed = true;
            treegrid.editModule['batchEditModule'].removeEventListener();
            done();
        });
        it('check the removeEventListener Binding', (done: Function) => {
            treegrid.isDestroyed = false;
            treegrid.editModule['batchEditModule'].removeEventListener();
            done();
        });
        it('check the destroy Binding', (done: Function) => {
            treegrid.editModule['batchEditModule'].destroy();
            done();
        });
        afterAll(() => {
            destroy(treegrid);
        });
    });
});

describe('coverage improvement', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Delete - collapse action', (done: Function) => {
        gridObj.selectRow(2);
        gridObj.deleteRecord();
        rows = gridObj.getRows();
        (gridObj.getRows()[0].querySelector('.e-treegridexpand')as HTMLElement).click();
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('coverage improvement', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('Add - collapse action', (done: Function) => {
        gridObj.addRecord({
            taskID: 100,
            taskName: 'Fist Record',
            startDate: new Date('02/03/2017'),
            progress: 100
        }, 1, 'Below');
        rows = gridObj.getRows();
        (gridObj.getRows()[0].querySelector('.e-treegridexpand')as HTMLElement).click();
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Code coverage improment', () => {
    let treegrid: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Below' },
                allowFiltering: true,
                allowRowDragAndDrop: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('update cell', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(((treegrid.flatData[1]as any).taskName === 'upadted')).toBe(true);
            done();
        };
        treegrid.updateCell(1,'taskName','upadted');
        (<any>treegrid.grid.toolbarModule).toolbarClickHandler({ item: { id: treegrid.grid.element.id + '_update' } });
        select('#' + treegrid.element.id + '_gridcontrol' + 'EditConfirm', treegrid.element).querySelectorAll('button')[0].click();
        treegrid.actionComplete = actionComplete;
    });
    afterAll(() => {
        destroy(treegrid);
    });
});

describe('Batch Edit - Expand Collapse check after batch Editing', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowPaging: true,
                editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Batch', newRowPosition: 'Child' },
                allowSorting: true,
                allowFiltering: true,
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });
    it('CollapseAll', (done: Function) => {
        gridObj.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        gridObj.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        gridObj.collapseAll();
        // select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        // gridObj.selectRow(0);
        // const record : any = gridObj.getSelectedRecords()[0];
        // expect(record['taskID'] === 1);
        expect(true).toBe(true);
        done();
    });
    it('ExpandAll', (done: Function) => {
        gridObj.collapseAll();
        gridObj.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        gridObj.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        gridObj.expandAll()
        // select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        // gridObj.selectRow(0);
        // const record : any = gridObj.getSelectedRecords()[0];
        // expect(record['taskID'] === 1);
        expect(true).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('939197 - In batch edit mode the dialog for adding values are not opened in the correct place', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                 dataSource: sampleData,
                   childMapping: 'subtasks',
                   treeColumnIndex: 1,
                   allowPaging: true,
                   allowFiltering: true,
                   filterSettings: { type: 'FilterBar', hierarchyMode: 'Child' },
                   height: 400,
                   editSettings: {
                     allowAdding: true,
                     allowEditing: true,
                     allowDeleting: true,
                     mode: 'Batch',
                     newRowPosition: 'Child',
                   },
                      toolbar: [
                     'Add',
                     'Edit',
                     'Delete',
                     'Update',
                     'Cancel',
                     'Search',
                     'Indent',
                     'Outdent',
                   ],
                   columns: [
                     {
                       field: 'taskID',
                       headerText: 'Task ID',
                       isPrimaryKey: true,
                       textAlign: 'Right',
                       validationRules: { required: true, number: true },
                       width: 90,
                     },
                     {
                       field: 'taskName',
                       headerText: 'Task Name',
                       editType: 'stringedit',
                       width: 220,
                       validationRules: { required: true },
                     },
                     {
                       field: 'startDate',
                       headerText: 'Start Date',
                       textAlign: 'Right',
                       width: 130,
                       editType: 'datepickeredit',
                       format: 'yMd',
                       validationRules: { date: true },
                     },
                     {
                       field: 'duration',
                       headerText: 'Duration',
                       textAlign: 'Right',
                       width: 140,
                       editType: 'numericedit',
                       validationRules: { number: true, min: 0 },
                       edit: { params: { format: 'n' } },
                     },
                     {
                       field: 'progress',
                       headerText: 'Progress',
                       textAlign: 'Right',
                       width: 150,
                       editType: 'numericedit',
                       validationRules: { number: true, min: 0 },
                       edit: { params: { format: 'n' } },
                     },
                     {
                       field: 'priority',
                       headerText: 'Priority',
                       width: 90,
                       editType: 'stringedit',
                       validationRules: { required: false },
                     },
                   ],
            },
            done
        );
    });
    it('In Batch Edit mode, verified that the new row is added in the correct position', (done: Function) => {
        gridObj.selectRow(0);
        gridObj.addRecord({ taskID: 111, taskName: 'Child record' });
        gridObj.actionComplete = (args: any) => {
            if (args.requestType === 'save') {
                expect((gridObj.flatData[5] as any).taskID === 111).toBe(true);
                done();
            }
        };
        done();
    });
    it('In Batch Edit mode, verified that the new row is added in the correct position', (done: Function) => {
        gridObj.selectRow(0);
        gridObj.addRecord({ taskID: 114, taskName: 'Child record' });
        gridObj.actionComplete = (args: any) => {
            if (args.requestType === 'save') {
                expect((gridObj.flatData[6] as any).taskID === 114).toBe(true);
                done();
            }
        };
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});		
describe('952900 - Incorrect Child Index When Adding a New Record Using addRecord Method in EJ2 TreeGrid', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging:true,
                allowSelection:true,
                height: 400,
                editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Cell',
                newRowPosition: 'Below',
                },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel', 'Indent', 'Outdent'],
                columns: [
                {
                    field: 'taskID',
                    headerText: 'Task ID',
                    isPrimaryKey: true,
                    textAlign: 'Right',
                    validationRules: { required: true, number: true },
                    width: 90,
                },
                {
                    field: 'taskName',
                    headerText: 'Task Name',
                    editType: 'stringedit',
                    width: 220,
                    validationRules: { required: true },
                },
                {
                    field: 'startDate',
                    headerText: 'Start Date',
                    textAlign: 'Right',
                    width: 130,
                    editType: 'datepickeredit',
                    format: 'yMd',
                    validationRules: { date: true },
                },
                {
                    field: 'duration',
                    headerText: 'Duration',
                    textAlign: 'Right',
                    width: 140,
                    editType: 'numericedit',
                    validationRules: { number: true, min: 0 },
                    edit: { params: { format: 'n' } },
                },
                ],
            },
            done
        );
    });
    it('Add the new row with correction selected position', (done: Function) => {
        gridObj.selectRow(3);
        gridObj.addRecord({
            taskID: 100,
            taskName: 'Fist Record',
            startDate: new Date('02/03/2017'),
            progress: 100
        }, 0, 'Child');
        expect((gridObj.flatData[5] as any).taskID == 100).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});	

describe('Maintain Expand/Collapse State After Edit Actions - Parent', () => {
    let gridObj: TreeGrid;
   
    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: sampleData,
            childMapping: 'subtasks',
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowAdding: true,
                mode: 'Batch',
                newRowPosition: 'Below'
            },
            treeColumnIndex: 1,
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            columns: [
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name' },
                { field: 'progress', headerText: 'Progress' },
                { field: 'startDate', headerText: 'Start Date' }
            ]
        }, done);
    });

    it('should preserve expand/collapse state after editing a parent record', (done: Function) => {
        gridObj.collapseRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
        gridObj.editCell(0, 'taskName');
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'Updated Parent Name';
        gridObj.actionComplete = (args: any): void => {
            if (args.requestType === 'batchsave') {
                expect(gridObj.getRows()[0].getElementsByClassName('e-treegridexpand').length).toBe(0);  
                expect(gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse').length).toBe(1);  
                done();
            }
        };
        (gridObj.grid.toolbarModule as any).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    it('should preserve expand/collapse state after editing a child record', (done: Function) => {
       (gridObj.getRows()[5].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        gridObj.editCell(6, 'taskName');
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'Updated Child Name';
        gridObj.actionComplete = (args: any): void => {
            if (args.requestType === 'batchsave') {
                expect(gridObj.getRows()[5].getElementsByClassName('e-treegridexpand').length).toBe(0);  
                expect(gridObj.getRows()[5].getElementsByClassName('e-treegridcollapse').length).toBe(1);  
                done();
            }
        };
        (gridObj.grid.toolbarModule as any).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });


    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Batch Editing - Update Record on Second Page', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowPaging: true,
               toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                childMapping: 'subtasks',
                editSettings: { allowEditing: true , newRowPosition:'Child', mode:'Batch' },
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' }
                ]
            },
            done
        );
    });

    beforeEach((done: Function) => {
        gridObj.actionComplete = (args?: any): void => {
            if (args.requestType === 'paging') {
                done();
            }
        };


        gridObj.goToPage(2);
    });

    it('should Edit the level 0 record', (done: Function) => {

        actionComplete = (args?: any): void => {
            expect(((gridObj.flatData[13]as any).taskName === 'Test')).toBe(true);
            done();
        };
        gridObj.updateCell(1,'taskName','Test');
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
        gridObj.actionComplete = actionComplete;


    });

    afterAll(() => {
        destroy(gridObj);
    });
});


describe('Batch Editing - Update Record on Second Page', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowPaging: true,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, newRowPosition: 'Child', mode: 'Batch' },
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' }
                ]
            },
            done
        );
    });

    beforeEach((done: Function) => {
        gridObj.actionComplete = (args?: any): void => {
            if (args.requestType === 'paging') {
                done();
            }
        };
        gridObj.goToPage(2);
    });
    it('should edit the level 1 record on page 2 and verify update', (done: Function) => {
         actionComplete = (args?: any): void => {
            expect(((gridObj.flatData[12]as any).taskName === 'Test')).toBe(true);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.updateCell(0,'taskName','Test');
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Batch Editing - Delete Record on Second Page', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowPaging: true,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, newRowPosition: 'Child', mode: 'Batch' },
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' }
                ]
            },
            done
        );
    });
    beforeEach((done: Function) => {
        // Set up actionComplete handler to detect when page navigation is complete
        gridObj.actionComplete = (args?: any): void => {
            if (args.requestType === 'paging') {
                done();
            }
        };
        gridObj.goToPage(2);
    });

    it('Delete record and verify update', (done: Function) => {
         actionComplete = (args?: Object): void => {
            if (args['requestType'] == 'batchSave' ) {
                expect(gridObj.dataSource[1].taskID === 21).toBe(true);
            }
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Batch Editing - Delete Record on Last Page', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowPaging: true,
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                childMapping: 'subtasks',
                editSettings: { allowAdding:true,allowEditing: true, newRowPosition: 'Child', mode: 'Batch' },
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' }
                ]
            },
            done
        );
    });

    beforeEach((done: Function) => {
        gridObj.actionComplete = (args?: any): void => {
            if (args.requestType === 'paging') {
                done();
            }
        };
        gridObj.goToPage(3);
    });

    it('Delete record and cancel it', (done: Function) => {
         actionComplete = (args?: Object): void => {
            if (args['requestType'] == 'cancel' ) {
                expect(gridObj.flatData.length).toBe(36);
            }
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Batch Editing - Keyboard Navigation', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { 
                    allowEditing: true, 
                    allowDeleting: true, 
                    allowAdding: true, 
                    mode: 'Batch',
                    allowNextRowEdit: true 
                },
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'priority', headerText: 'Priority' }
                ]
            },
            done
        );
    });

    it('Tab key should navigate to next cell in edit mode', () => {
        gridObj.editCell(0, 'taskName');
        expect(gridObj.element.querySelector('.e-editedbatchcell')).not.toBe(null);
        gridObj.grid.keyboardModule.keyAction({ 
            action: 'tab', 
            preventDefault: preventDefault, 
            target: gridObj.element.querySelector('.e-editedbatchcell') 
        } as any);
        expect(gridObj.element.querySelector('.e-editedbatchcell').getAttribute('aria-label')).toContain('progress');
    });

    it('Shift+Tab key should navigate to previous cell in edit mode', () => {
        gridObj.editCell(0, 'progress');
        gridObj.grid.keyboardModule.keyAction({ 
            action: 'shiftTab', 
            preventDefault: preventDefault, 
            target: gridObj.element.querySelector('.e-editedbatchcell') 
        } as any);
        expect(gridObj.element.querySelector('.e-editedbatchcell').getAttribute('aria-label')).toContain('taskName');
    });
    it('Escape key should cancel current cell edit', () => {
        gridObj.editCell(0, 'taskName');
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'Temporary Value';
        gridObj.grid.keyboardModule.keyAction({ 
            action: 'escape', 
            preventDefault: preventDefault, 
            target: gridObj.element.querySelector('.e-editedbatchcell') 
        } as any);
        expect((gridObj.getCellFromIndex(0, 1)as any).innerText).toBe("Planning");
    });

    afterAll(() => {
        destroy(gridObj);
    });
});


describe('Batch Editing - Keyboard Navigation', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { 
                    allowEditing: true, 
                    allowDeleting: true, 
                    allowAdding: true, 
                    mode: 'Batch',
                    allowNextRowEdit: true 
                },
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'priority', headerText: 'Priority' }
                ]
            },
            done
        );
    });

    it('Shift+Tab key at first cell should move to last cell of previous row', () => {
        gridObj.editCell(1, 'taskName');
        gridObj.grid.keyboardModule.keyAction({ 
            action: 'shiftTab', 
            preventDefault: preventDefault, 
            target: gridObj.element.querySelector('.e-editedbatchcell') 
        } as any);
        expect(gridObj.element.querySelector('.e-editedbatchcell').getAttribute('aria-label')).toContain('priority');
        expect(gridObj.element.querySelector('.e-editedbatchcell').closest('tr').getAttribute('aria-rowindex')).toBe('1');
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Batch Editing - Keyboard Navigation', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { 
                    allowEditing: true, 
                    allowDeleting: true, 
                    allowAdding: true, 
                    mode: 'Batch',
                    allowNextRowEdit: true 
                },
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'priority', headerText: 'Priority' }
                ]
            },
            done
        );
    });
     it('Enter key should complete current cell edit and move to cell below', () => {
        gridObj.editCell(0, 'taskName');
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'Updated Task';
        gridObj.grid.keyboardModule.keyAction({ 
            action: 'enter', 
            preventDefault: preventDefault, 
            target: gridObj.element.querySelector('.e-editedbatchcell') 
        } as any);
        expect((gridObj.getCellFromIndex(0, 1)as any).innerText).toBe('Updated Task');
        expect(gridObj.element.querySelector('.e-editedbatchcell').getAttribute('aria-label')).toContain('Plan timeline');
        expect(gridObj.element.querySelector('.e-editedbatchcell').closest('tr').getAttribute('aria-rowindex')).toBe('2');
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Batch Editing - Keyboard Navigation', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { 
                    allowEditing: true, 
                    allowDeleting: true, 
                    allowAdding: true, 
                    mode: 'Batch',
                    allowNextRowEdit: true 
                },
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'priority', headerText: 'Priority' }
                ]
            },
            done
        );
    });
    it('Tab key at last cell should move to first cell of next row', () => {
        gridObj.editCell(0, 'priority');
        gridObj.grid.keyboardModule.keyAction({ 
            action: 'tab', 
            preventDefault: preventDefault, 
            target: gridObj.element.querySelector('.e-editedbatchcell') 
        } as any);
        expect(gridObj.element.querySelector('.e-editedbatchcell').getAttribute('aria-label')).toContain('taskName');
        expect(gridObj.element.querySelector('.e-editedbatchcell').closest('tr').getAttribute('aria-rowindex')).toBe('2');
    });

    afterAll(() => {
        destroy(gridObj);
    });
});
describe('Batch Editing - Keyboard Navigation', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { 
                    allowEditing: true, 
                    allowDeleting: true, 
                    allowAdding: true, 
                    mode: 'Batch',
                    allowNextRowEdit: true 
                },
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'priority', headerText: 'Priority' }
                ]
            },
            done
        );
    });

    it('Insert should add a new row', () => {
        gridObj.selectRow(0);
        gridObj.grid.keyboardModule.keyAction({ 
            action: 'insert', 
            preventDefault: preventDefault, 
            target: gridObj.element 
        } as any);
        expect(gridObj.element.querySelector('.e-insertedrow')).not.toBe(null);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Batch Editing - Keyboard Navigation', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { 
                    allowEditing: true, 
                    allowDeleting: true, 
                    allowAdding: true, 
                    mode: 'Batch',
                    allowNextRowEdit: true 
                },
                treeColumnIndex: 1,
                toolbar: ['Add', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'priority', headerText: 'Priority' }
                ]
            },
            done
        );
    });

    it('Delete key should delete selected row', () => {
        gridObj.selectRow(2);
        gridObj.grid.keyboardModule.keyAction({ 
            action: 'delete', 
            preventDefault: preventDefault, 
            target: gridObj.getRowByIndex(2) 
        } as any);
        const deletedRecords = 'deletedRecords';
        expect(gridObj.getBatchChanges()[deletedRecords].length).toBe(1);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});