import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData2, unorederedData, projectData, virtualData} from '../base/datasource.spec';
import { getObject } from '@syncfusion/ej2-grids';
import { EmitType } from '@syncfusion/ej2-base';
import { RowDD } from '../../src/treegrid/actions/rowdragdrop';
import { VirtualScroll } from '../../src/treegrid/actions/virtual-scroll';
import { ITreeData } from '../../src';
import { getMemoryProfile, inMB, profile } from '../common.spec';
/**
 * TreeGrid Indent and Outdent action spec
 */
TreeGrid.Inject(RowDD, VirtualScroll);

describe('IndentOutdent action', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('EJ2-58872 - Indent/Outdent action check when persistSelection is enabled ', () => {
        let TreeGridObj: TreeGrid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            TreeGridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    height: 400,
                    toolbar: ['Indent', 'Outdent'],
                    selectionSettings: {
                        enableToggle: true,
                        mode: 'Row',
                        type: 'Multiple',
                        persistSelection: true
                    },
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
                        },
                        {
                            field: 'startDate',
                            headerText: 'Start Date',
                            textAlign: 'Right',
                            width: 130,
                            editType: 'datepickeredit',
                            format: 'yMd',
                            validationRules: { date: true }
                        },
                        {
                            field: 'duration',
                            headerText: 'Duration',
                            textAlign: 'Right',
                            width: 100,
                            editType: 'numericedit',
                            validationRules: { number: true, min: 0 },
                            edit: { params: { format: 'n' } }
                        }
                    ]
                }, done);
        });

        it('Indent/Outdent icon updated check', (done: Function) => {
            actionComplete = (): void => {
                expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_indent').parentElement.classList.contains('e-hidden')).toBe(false);
                expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_outdent').parentElement.classList.contains('e-hidden')).toBe(true);
                done();
            };
            TreeGridObj.actionComplete = actionComplete;
            TreeGridObj.selectRow(1);
            (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_outdent' } });
            TreeGridObj.rowDragAndDropModule.destroy();
        });
        afterAll(() => {
            destroy(TreeGridObj);
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

describe('EJ2-59000 - Indent/Outdent action check with virtualization ', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                toolbar: [ 'Indent', 'Outdent'],
                dataSource: virtualData.slice(0, 100),
                parentIdMapping: 'ParentID',
                idMapping: 'TaskID',
                height: 200,
                enableVirtualization: true,
                columns: [
                    { field: 'TaskID', headerText: 'ID', isPrimaryKey: true, width: 140 },

                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
                    { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
                    { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
                    { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
                    { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
                    { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' }
                ],
                treeColumnIndex: 1
            }, done);
    });

    it('Indent/Outdent icon updated check', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(args.data[0].parentItem === undefined).toBe(true);
            done();
        };
        TreeGridObj.actionComplete = actionComplete;
        TreeGridObj.selectRow(50);
        TreeGridObj.selectRow(51);
        (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_outdent' } });
        setTimeout(done, 1000);
        TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});

describe('EJ2-59005 - Indent/Outdent action check with checkbox selection', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                toolbar: ['Indent', 'Outdent'],
                columns: [
                    { type: 'checkbox', width: 50 },

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
                    }
                ]
            }, done);
    });

    it('Indent/Outdent icon updated check', (done: Function) => {
        (<HTMLElement>TreeGridObj.getRows()[1].querySelector('.e-checkselect')).click();
        (<HTMLElement>TreeGridObj.getRows()[2].querySelector('.e-checkselect')).click();
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_indent').parentElement.classList.contains('e-hidden')).toBe(true);
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_outdent').parentElement.classList.contains('e-hidden')).toBe(true);
        (<HTMLElement>TreeGridObj.getRows()[2].querySelector('.e-checkselect')).click();
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_indent').parentElement.classList.contains('e-hidden')).toBe(true);
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_outdent').parentElement.classList.contains('e-hidden')).toBe(false);
        done();
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});

describe('EJ2-58990 - Indent/Outdent action method check without parameter ', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                toolbar: ['Indent', 'Outdent'],
                selectionSettings: {
                    enableToggle: true,
                    mode: 'Row',
                    type: 'Multiple',
                    persistSelection: true
                },
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
                    },
                    {
                        field: 'startDate',
                        headerText: 'Start Date',
                        textAlign: 'Right',
                        width: 130,
                        editType: 'datepickeredit',
                        format: 'yMd',
                        validationRules: { date: true }
                    },
                    {
                        field: 'duration',
                        headerText: 'Duration',
                        textAlign: 'Right',
                        width: 100,
                        editType: 'numericedit',
                        validationRules: { number: true, min: 0 },
                        edit: { params: { format: 'n' } }
                    }
                ]
            }, done);
    });

    it('Indent/Outdent icon updated check', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'outdented') {
                expect(args.data[0].parentItem === undefined).toBe(true);
            }
            if (args.requestType === 'indented') {
                expect(args.data[0].parentItem.taskID === 3).toBe(true);
            }
            done();
        };
        TreeGridObj.actionComplete = actionComplete;
        TreeGridObj.selectRow(1);
        TreeGridObj.outdent();
        TreeGridObj.selectRow(2);
        TreeGridObj.indent();
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});

describe('EJ2-58990 - Indent/Outdent action method check with parameter ', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                toolbar: ['Indent', 'Outdent'],
                selectionSettings: {
                    enableToggle: true,
                    mode: 'Row',
                    type: 'Multiple',
                    persistSelection: true
                },
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
                    },
                    {
                        field: 'startDate',
                        headerText: 'Start Date',
                        textAlign: 'Right',
                        width: 130,
                        editType: 'datepickeredit',
                        format: 'yMd',
                        validationRules: { date: true }
                    },
                    {
                        field: 'duration',
                        headerText: 'Duration',
                        textAlign: 'Right',
                        width: 100,
                        editType: 'numericedit',
                        validationRules: { number: true, min: 0 },
                        edit: { params: { format: 'n' } }
                    }
                ]
            }, done);
    });

    it('Indent/Outdent icon updated check', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'outdented') {
                expect(args.data[0].parentItem === undefined).toBe(true);
            }
            if (args.requestType === 'indented') {
                expect(args.data[0].parentItem !== undefined).toBe(true);
            }
            done();
        };
        TreeGridObj.actionComplete = actionComplete;
        TreeGridObj.outdent(TreeGridObj.getCurrentViewRecords()[1]);
        TreeGridObj.indent(TreeGridObj.getCurrentViewRecords()[2]);
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});
