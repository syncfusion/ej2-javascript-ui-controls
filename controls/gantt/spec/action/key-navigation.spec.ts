import { Gantt, Selection,UndoRedo, Edit, Toolbar,Filter, Sort, ContextMenu, DayMarkers, RowDD } from '../../src/index';
import { projectData1, splitTasksData,exportData, editingData, resourcesData, cellEditData} from '../base/data-source.spec';
import { IKeyPressedEventArgs } from '../../src/gantt/base/interface';
import { createGantt, destroyGantt, triggerMouseEvent, getKeyUpObj, triggerKeyboardEvent } from '../base/gantt-util.spec';
import { Browser, getValue } from '@syncfusion/ej2-base';
import { RowSelectingEventArgs } from '@syncfusion/ej2-grids';
import { TextBox } from '@syncfusion/ej2-inputs';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
Gantt.Inject(Selection, Edit, Toolbar,Filter,ContextMenu, DayMarkers, RowDD);

describe('Gantt Selection support', () => {
    describe('Gantt selection', () => {
        let ganttObj: Gantt;
        let preventDefault: Function = new Function();
        let oldRowIndex: number;
        beforeAll((done: Function) => {            
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                    },
                    load: function (args) {
                        this.keyConfig["customKey"] = "ctrl+82"; //ctr + r
                    },
                    actionComplete: function (args: IKeyPressedEventArgs) {
                        if (args.requestType == "keyPressed" && args.action == "customKey") {
                            args.keyEvent.preventDefault();
                            this.selectionModule.selectRow(6);
                        }
                        if (args.requestType == 'add') {
                            expect(args['data'].taskData.ganttProperties).toBe(undefined)
                        }
                    },
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: true,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Single'
                    }
                }, done);
        });
        beforeEach(() => {
            ganttObj.selectionModule.selectRow(3);
            oldRowIndex = ganttObj.selectedRowIndex;
        });

        it('upArrow shortcut testing', () => {
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(oldRowIndex - 1).toBe(ganttObj.selectedRowIndex);
        });
        it('downArrow shortcut testing', () => {
          
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(oldRowIndex +1).toBe(ganttObj.selectedRowIndex);
        });
        it('home key testing', () => {
            let args: any = { action: 'home', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(ganttObj.selectedRowIndex).toBe(0);
        });
        it('end key testing', () => {
            let args: any = { action: 'end', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(ganttObj.selectedRowIndex).toBe(ganttObj.currentViewData.length - 1);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);               
            }
        });
    });
})
describe('Gantt selection', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    let oldRowIndex: number;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor',
                },
                load: function (args) {
                    this.keyConfig["customKey"] = "ctrl+82"; //ctr + r
                },
                actionComplete: function (args: IKeyPressedEventArgs) {
                    if (args.requestType == "keyPressed" && args.action == "customKey") {
                        args.keyEvent.preventDefault();
                        this.selectionModule.selectRow(6);
                    }
                    if (args.requestType == 'add') {
                        expect(args['data'].taskData.ganttProperties).toBe(undefined)
                    }
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single'
                }
            }, done);
    });
    beforeEach(() => {
        ganttObj.selectionModule.selectRow(3);
        oldRowIndex = ganttObj.selectedRowIndex;
    });
    it('end key last data selection testing', () => {
        let args: any = { action: 'end', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData[40] !== ganttObj.selectedRowIndex).toBe(true);
    });
    it('collapseAll key testing', () => {

        ganttObj.ganttChartModule.expandCollapseAll('expand');
        expect(ganttObj.currentViewData[0].expanded).toBe(true);
        let args: any = { action: 'collapseAll', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData[0].expanded).toBe(false);
    });
    it('expandAll key testing', () => {
        expect(ganttObj.currentViewData[0].expanded).toBe(false);
        let args: any = { action: 'expandAll', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData[0].expanded).toBe(true);
    });
    it('collapseRow key testing', () => {
        ganttObj.selectionModule.selectRow(0);
        let args: any = { action: 'collapseRow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData[0].expanded).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt selection', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    let oldRowIndex: number;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor',
                },
                load: function (args) {
                    this.keyConfig["customKey"] = "ctrl+82"; //ctr + r
                },
                actionComplete: function (args: IKeyPressedEventArgs) {
                    if (args.requestType == "keyPressed" && args.action == "customKey") {
                        args.keyEvent.preventDefault();
                        this.selectionModule.selectRow(6);
                    }
                    if (args.requestType == 'add') {
                        expect(args['data'].taskData.ganttProperties).toBe(undefined)
                    }
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single'
                }
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 100);
        ganttObj.selectionModule.selectRow(3);
        oldRowIndex = ganttObj.selectedRowIndex;
    });
    it('expandRow key testing', () => {
        ganttObj.selectionModule.selectRow(0);
        let args: any = { action: 'expandRow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData[0].expanded).toBe(true);
    });
    it('addrow key testing with selection', () => {
        oldRowIndex = ganttObj.currentViewData.length;
        let args: any = { action: 'addRow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(oldRowIndex + 1).toBe(ganttObj.currentViewData.length);
        expect((ganttObj.selectionModule.getSelectedRows().length)).toBe(1);
    });
    it('delete key testing', (done: Function) => {
        oldRowIndex = ganttObj.currentViewData.length;
        ganttObj.selectionModule.selectRow(0);
        let args: any = { action: 'delete', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(oldRowIndex - 1).toBe(ganttObj.currentViewData.length);
        done();
    });
    it('addRowDialog key testing', () => {
        let args: any = { action: 'addRowDialog', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        let dialog: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_dialog')).ej2_instances[0];
        if (dialog) {
            expect(getValue('isEdit', ganttObj.editModule.dialogModule)).toBe(false);
        }
        dialog.hide();
    });
    it('editRowDialog key testing', () => {
        let args: any = { action: 'editRowDialog', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        let dialog: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_dialog')).ej2_instances[0];
        if (dialog) {
            expect(getValue('isEdit', ganttObj.editModule.dialogModule)).toBe(true);
        }
        dialog.hide();
    });
    it('Custom key testing', (done : Function) => {
        setTimeout(function () {
            let args: any = { action: 'customKey', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(ganttObj.selectedRowIndex).toBe(6);
            done();
        }, 100);
    }, 200);
    it('saveRequest key testing', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let args1: any = { action: 'saveRequest', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args1);
        expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
    });
    it('Search key testing', (done) => {
        let args: any = { action: 'focusSearch', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        let searchbar: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar'));
        searchbar.value = 'Plan budget';
        (ganttObj.toolbarModule as any).keyUpHandler(getKeyUpObj(13, searchbar));
        setTimeout(function () {
            expect(ganttObj.currentViewData.length).toBe(3);
            searchbar.value = '';
            (ganttObj.toolbarModule as any).keyUpHandler(getKeyUpObj(13, searchbar));
            done();
        }, 100);
    }, 200);
    it('cancelRequest key testing', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let args1: any = { action: 'cancelRequest', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args1);
        expect(ganttObj.currentViewData[3].ganttProperties.taskName).toBe('Plan budget');
    });
    // it('focusTask key testing', () => { 
    //     ganttObj.selectionModule.selectRow(19);
    //     let args1: any = { action: 'focusTask', preventDefault: preventDefault };
    //     ganttObj.keyboardModule.keyAction(args1); 
    //     expect(ganttObj.ganttChartModule.scrollElement.scrollLeft).toBe(907);
    // }); 
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt delete and add', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    let oldRowIndex: number;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor',
                },
                load: function (args) {
                    this.keyConfig["customKey"] = "ctrl+82"; //ctr + r
                },
                actionComplete: function (args: IKeyPressedEventArgs) {
                    if (args.requestType == "keyPressed" && args.action == "customKey") {
                        args.keyEvent.preventDefault();
                        this.selectionModule.selectRow(6);
                    }
                    if (args.requestType == 'add') {
                        expect(args['data'].taskData.ganttProperties).toBe(undefined)
                    }
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single'
                }
            }, done);
    });
    it('delete and add record', () => {
        ganttObj.selectionModule.selectRow(3);
        oldRowIndex = ganttObj.selectedRowIndex;
        oldRowIndex = ganttObj.currentViewData.length;
        ganttObj.selectionModule.selectRow(5);
        let args: any = { action: 'delete', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        let args1: any = { action: 'addRow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args1);
        expect(oldRowIndex).toBe(ganttObj.currentViewData.length);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-issues', function () {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: projectData1,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'subtasks',
                dependency: 'Predecessor',
            },
            projectStartDate: new Date('02/01/2017'),
            projectEndDate: new Date('12/30/2017'),
            rowHeight: 40,
            taskbarHeight: 30,
            allowSelection: true
        }, done);
    });
    it('Insert key Testing after dialog opened', () => {
        let addToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
        triggerMouseEvent(addToolbar, 'click');
        let args: any = { action: 'addRow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect((ganttObj.selectionModule.getSelectedRows().length)).toBe(0);
    });
    it('Escape key on dependency tab', () => {
        let Add: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems > div > div.e-toolbar-right > div:nth-child(1)') as HTMLElement;
        triggerMouseEvent(Add, 'click');
        let args: any = { action: 'escape', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        let element: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog') as HTMLElement;
        expect(element.classList.contains('e-dialog')).toBe(true);
    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Tab action', function () {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: splitTasksData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                segments: 'Segments',
            },
            allowRowDragAndDrop: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: false,
                showDeleteConfirmDialog: true,
                allowNextRowEdit: false,
            },
            columns: [
                { field: 'TaskID', width: 60 },
                {
                    field: 'TaskName',
                    headerText: 'Job Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            enableContextMenu: true,
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            splitterSettings: {
                columnIndex: 2,
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%',
            },
            projectStartDate: new Date('01/30/2019'),
            projectEndDate: new Date('03/04/2019')
        }, done);
    });
    it('Tab action after editing cell', () => {
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let args: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.treeGrid.grid.element.querySelector('.e-editedbatchcell') } as any;
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe("2/4/2019");

    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Navigation Up and Down Arrow', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    let oldRowIndex: number;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor',
                },
                load: function (args) {
                    this.keyConfig["customKey"] = "ctrl+82"; //ctr + r
                },
                actionComplete: function (args: IKeyPressedEventArgs) {
                    if (args.requestType == "keyPressed" && args.action == "customKey") {
                        args.keyEvent.preventDefault();
                        this.selectionModule.selectRow(6);
                    }
                    if (args.requestType == 'add') {
                        expect(args['data'].taskData.ganttProperties).toBe(undefined)
                    }
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single'
                }
            }, done);
    });
    it('navigation row', () => {
        ganttObj.selectionModule.selectRow(5);
        oldRowIndex = ganttObj.selectedRowIndex;
        ganttObj.ganttChartModule.expandCollapseAll('expand');
        expect(ganttObj.currentViewData[0].expanded).toBe(true);
        let args: any = { action: 'collapseAll', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData[0].expanded).toBe(false);
        let args1: any = { action: 'upArrow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args1);
        let args2: any = { action: 'upArrow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args2);
        let args3: any = { action: 'downArrow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args3);
        let args4: any = { action: 'downArrow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args4);
        expect(oldRowIndex).toBe(ganttObj.selectedRowIndex);

    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Tab Key allow editing false', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: editingData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                notes: 'info',
                resourceInfo: 'resources'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
                allowNextRowEdit: true

            },

            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                { field: 'StartDate' },
                { field: 'Duration', allowEditing: false },
                { field: 'Progress' },
                { field: 'Predecessor' }
            ],
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            enableContextMenu: true,
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            splitterSettings: {
                columnIndex: 2,
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%',
            },
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('07/28/2019')
        }, done);
    });
    it('Tab action after allow editing false', () => {
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let args: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.treeGrid.grid.element.querySelector('.e-editedbatchcell') } as any;
        ganttObj.keyboardModule.keyAction(args);
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
        // expect(duration.classList.contains('e-focused')).toBe(true);
        let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(5)') as HTMLElement;
        expect(progress.classList.contains('e-editedbatchcell')).toBe(true);
    });
    it('Editing and tab navigation', () => {
        ganttObj.dataBind();
        let Predecessor: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(Predecessor, 'dblclick');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let args2: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement };
        ganttObj.keyboardModule.keyAction(args2);
        let label = document.getElementsByClassName("e-label e-active-container");
        expect(label[0]['innerText']).toBe('Perform soil test');
    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('CR-EJ2-828122-Error when doubleclick insertkey while edit mode', function () {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: [],
            height: '450px',
            highlightWeekends: true,
            treeColumnIndex: 1,
            allowSelection: true,
            allowKeyboard: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
            },
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', width: 250 },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            enableContextMenu: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            toolbar: ['Search', 'Add', 'Delete'],
            labelSettings: {
                leftLabel: 'TaskName',
            },
            splitterSettings: {
                columnIndex: 2,
            },
            projectStartDate: new Date('03/24/2019'),
            projectEndDate: new Date('07/06/2019'),
        }, done);
    });
    it('Insert key Testing without Add button', () => {
        // Stimulate triggering the "Insert key" action to add a new row
        let args: any = { action: 'addRow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        // Expect the current view data to contain a single row
        expect(ganttObj.currentViewData.length).toBe(1);
        // Expect the current view data index value to contain a 'New Task 1'
        expect(ganttObj.currentViewData[0].ganttProperties.taskName).toBe('New Task 1');
    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt editing action', () => {
    let ganttObj: Gantt;
    let interval: number;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cellEditData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    notes: 'Notes',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    resourceInfo: 'Resource',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceIDMapping: 'resourceId',
                resourceNameMapping: 'resourceName',
                resources: resourcesData,
                allowSelection: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Multiple',
                    enableToggle: false
                },
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                editDialogFields: [
                    { type: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                ],
                splitterSettings: {
                    columnIndex: 9
                },
                allowUnscheduledTasks: true,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', editType: 'stringedit', width: 100 },
                    { field: 'StartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'EndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Duration', width: 100 },
                    { field: 'Predecessor', width: 100 },
                    { field: 'Progress', width: 100 },
                    { field: 'BaselineStartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'BaselineEndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Resource', width: 100 },
                    { field: 'Notes', width: 100 },
                    { field: 'Customcol', headerText: 'Custom Column', width: 100 }
                ],

            }, done);
    });
    it('Editing duration column', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = 5;
        let args: any = { action: 'saveRequest', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(5);
    });
    it('home key testing', () => {
        let args: any = { action: 'home', preventDefault: preventDefault };
        ganttObj.selectedRowIndex = 0;
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.selectedRowIndex).toBe(0);
    });
    it('delete  record', () => {
        ganttObj.selectionModule.selectCell({ cellIndex: 1, rowIndex: 1 });
        let args: any = { action: 'delete', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData.length).toBe(6)
    });
    it('focus  record', () => {
        let args: any = { action: 'focusTask', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData.length).toBe(6)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt undo redo action for new record', () => {
    Gantt.Inject(Sort, UndoRedo, Edit, Toolbar, Selection);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                enableUndoRedo: true,
                undoRedoActions: ['Add', 'Edit', 'Delete'],
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                //sortSettings: { columns: [{ field: 'TaskID', direction: 'Ascending' }, { field: 'TaskName', direction: 'Ascending' }] },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                toolbar: ['Undo', 'Redo'],
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Undo action for Add new record', (done: Function) => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === 'delete') {
                expect(ganttObj.flatData.length).toBe(41);
                done();
            }
        };
        ganttObj.addRecord();
        let args: any = { action: 'undo', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
    });
    it('Redo actin for add record', (done: Function) => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === 'add') {
                expect(ganttObj.flatData.length).toBe(42);
                done()
            }
        };
        let args: any = { action: 'redo', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);

    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Cell selection keyboard navigation', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Selecting record', () => {
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
    });
    it('Checking for selecting record', () => {
        let args: any = { action: 'downArrow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Duration edit with edit template', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection);
    let elem: HTMLElement;
    let dropdownlistObj: TextBox;
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                selectedRowIndex: 2,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    {
                        field: 'Duration',
                        edit: {
                            create: () => {
                                elem = document.createElement('input');
                                return elem;
                            },
                            read: () => {
                                return dropdownlistObj.value;
                            },
                            destroy: () => {
                                dropdownlistObj.destroy();
                            },
                            write: (args: any) => {
                                dropdownlistObj = new TextBox({
                                    value: args.rowData[args.column.field],
                                    floatLabelType: 'Auto'
                                });
                                dropdownlistObj.appendTo(elem);
                            }
                        }
                    },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                splitterSettings: {
                    position: "70%"
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Editing duration column', (done: Function) => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "save") {
                expect(args.data.ganttProperties.duration).toBe(50)
                done()
            }
        };
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = 50;
        let args1: any = { action: 'saveRequest', preventDefault: preventDefault, target: input };
        ganttObj.keyboardModule.keyAction(args1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Sorting using keyboard event', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                selectedRowIndex: 2,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    {
                        field: 'Duration'
                    },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                splitterSettings: {
                    position: "70%"
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Sorting Column', () => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "sorting") {
                expect(parseInt(ganttObj.currentViewData[1].ganttProperties.taskId)).toBe(2);
            }
        };
        let headerCell: HTMLElement = document.getElementsByClassName('e-headercell')[0] as HTMLElement;
        let args1 = { action: 'saveRequest', preventDefault: preventDefault, target: headerCell, key: 'Enter' };
        ganttObj.keyboardModule.keyAction(args1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Down arrow key navigation in chart row', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                selectedRowIndex:2,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    {
                        field: 'Duration'
                    },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                splitterSettings: {
                    position: "70%"
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Check selection row', () => {
        let taskbar: HTMLElement = document.getElementsByClassName('e-taskbar-main-container')[2] as HTMLElement;
        triggerMouseEvent(taskbar, 'click');
        triggerMouseEvent(taskbar, 'mousedown');
        triggerMouseEvent(taskbar, 'mouseup');
        taskbar.focus()
        let args1 = { action: 'downArrow', preventDefault: preventDefault, target: taskbar };
        ganttObj.keyboardModule.keyAction(args1);
    });
    // it('Check selection row1', (done:Function) => {
    //     ganttObj.rowSelected = function (args: any): void {
    //         if (args.rowIndex === 3) {
    //             done()
    //         }
    //     };
    //     let taskbar: HTMLElement = document.getElementsByClassName('e-taskbar-main-container')[2] as HTMLElement;
    //     triggerMouseEvent(taskbar, 'click');
    //     triggerMouseEvent(taskbar, 'mousedown');
    //     triggerMouseEvent(taskbar, 'mouseup');
    //     taskbar.focus()
    //     let args1 = { action: 'downArrow', preventDefault: preventDefault, target: taskbar };
    //     ganttObj.keyboardModule.keyAction(args1);
    // });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Opening add dialog using keyboard', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                selectedRowIndex: 2,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    {
                        field: 'Duration'
                    },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                splitterSettings: {
                    position: "70%"
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('checking if dialog open', () => {
        ganttObj.openAddDialog()
        let button: HTMLElement = document.getElementById(ganttObj.element.id + '_dialog').querySelector('button') as HTMLElement;
        triggerMouseEvent(button, 'click');
        let args: any = { action: 'addRowDialog', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(document.getElementById(ganttObj.element.id + '_dialog') != null).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Deleting record after dialog open', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                selectedRowIndex: 2,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    {
                        field: 'Duration'
                    },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                splitterSettings: {
                    position: "70%"
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Record after delete action', (done: Function) => {
        ganttObj.openAddDialog()
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "delete") {
                expect(ganttObj.flatData.length).toBe(40)
                done()
            }
        };
        let button: HTMLElement = document.getElementById(ganttObj.element.id + '_dialog').querySelector('button') as HTMLElement;
        triggerMouseEvent(button, 'click');
        let args: any = { action: 'delete', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Focus task keyboard action', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                selectedRowIndex: 2,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    {
                        field: 'Duration'
                    },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                splitterSettings: {
                    position: "70%"
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    beforeEach((done) => {
        setTimeout(done, 500);
    });
    it('Checked focused task', () => {
        let args: any = { action: 'focusTask', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(document.getElementsByClassName('e-selectionbackground').length > 0).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Up arrow key navigation', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection, ContextMenu);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                enableContextMenu: true,
                selectedRowIndex: 2,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    {
                        field: 'Duration'
                    },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                splitterSettings: {
                    position: "70%"
                },
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Selected cell index', (done: Function) => {
        let targetCell: HTMLElement = document.getElementsByClassName('e-rowcell')[25] as HTMLElement;
        triggerMouseEvent(targetCell, 'click');
        targetCell.focus()
        let args: any = { action: 'upArrow', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        done()
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Collapse key', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection, ContextMenu);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                enableContextMenu: true,
                selectedRowIndex: 2,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    {
                        field: 'Duration'
                    },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                splitterSettings: {
                    position: "70%"
                },
                selectionSettings: {
                    mode: 'Cell',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Collapsed record', () => {
        ganttObj.collapsed = function (args: any): void {
            expect(args.data.expanded).toBe(false)
        };
        let targetCell: HTMLElement = document.getElementsByClassName('e-rowcell')[7] as HTMLElement;
        triggerMouseEvent(targetCell, 'click');
        targetCell.focus()
        let args: any = { action: "collapseRow", preventDefault: preventDefault, target: targetCell };
        ganttObj.keyboardModule.keyAction(args);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Pressing enter key on taskbar', () => {
    Gantt.Inject(Sort, Edit, Toolbar, Selection);
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                selectedRowIndex: 2,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    {
                        field: 'Duration'
                    },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                splitterSettings: {
                    position: "70%"
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30
            }, done);
    });
    it('Check selection row after enter', (done: Function) => {
        let taskbar: HTMLElement = document.getElementsByClassName('e-taskbar-main-container')[2] as HTMLElement;
        triggerMouseEvent(taskbar, 'click');
        triggerMouseEvent(taskbar, 'mousedown');
        triggerMouseEvent(taskbar, 'mouseup');
        taskbar.focus()
        let args1 = { action: 'saveRequest', preventDefault: preventDefault, target: taskbar, key: 'Enter' };
        ganttObj.keyboardModule.keyAction(args1);
        done()
    });
    it('Check selection row after enter1', (done: Function) => {
        let taskbar: HTMLElement = document.getElementsByClassName('e-taskbar-main-container')[2] as HTMLElement;
        triggerMouseEvent(taskbar, 'click');
        triggerMouseEvent(taskbar, 'mousedown');
        triggerMouseEvent(taskbar, 'mouseup');
        taskbar.focus()
        let args1 = { action: 'saveRequest', preventDefault: preventDefault, target: taskbar, key: 'Enter' };
        ganttObj.keyboardModule.keyAction(args1);
        done()
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('shift Tab action', function () {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: splitTasksData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                segments: 'Segments',
            },
            allowRowDragAndDrop: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: false,
                showDeleteConfirmDialog: true,
                allowNextRowEdit: false,
            },
            columns: [
                { field: 'TaskID', width: 60 },
                {
                    field: 'TaskName',
                    headerText: 'Job Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            enableContextMenu: true,
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            splitterSettings: {
                columnIndex: 2,
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%',
            },
            projectStartDate: new Date('01/30/2019'),
            projectEndDate: new Date('03/04/2019')
        }, done);
    });
    it('shift Tab action after editing cell', () => {
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let args: any = { action: 'shiftTab', preventDefault: preventDefault, target: ganttObj.treeGrid.grid.element.querySelector('.e-editedbatchcell') } as any;
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.element.getElementsByClassName('e-editedbatchcell')[0].getAttribute('data-colindex')).toBe("2");

    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('shift Tab action', function () {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: splitTasksData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                segments: 'Segments',
            },
            allowRowDragAndDrop: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: false,
                showDeleteConfirmDialog: true,
                allowNextRowEdit: false,
            },
            columns: [
                { field: 'TaskID', width: 60 },
                {
                    field: 'TaskName',
                    headerText: 'Job Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            enableContextMenu: true,
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            splitterSettings: {
                columnIndex: 2,
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: '${Progress}%',
            },
            projectStartDate: new Date('01/30/2019'),
            projectEndDate: new Date('03/04/2019')
        }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    it('Tab action after focusing header cell', () => {
        let headerCell: HTMLElement = document.getElementsByClassName('e-headercell')[0] as HTMLElement;
        triggerMouseEvent(headerCell, 'click');
        let args: any = { action: 'tab', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args);
        expect(document.getElementsByClassName('e-headercell e-ellipsistooltip e-focused e-focus').length).toBe(1);

    });

    it('shift Tab action after focusing header cell', () => {
        let headerCell: HTMLElement = document.getElementsByClassName('e-headercell')[1] as HTMLElement;
        triggerMouseEvent(headerCell, 'click');
        let args: any = { action: 'shiftTab', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args);

    });
    it('tab action for header items', () => {
        let headerCell: HTMLElement = document.getElementsByClassName('e-headercell')[0] as HTMLElement;
        triggerMouseEvent(headerCell, 'click');
        let args: any = { action: 'shiftTab', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args);

    });
    it('tab action for cells', () => {
        let headerCell: HTMLElement = (document.getElementsByClassName('e-row')[0] as any).cells[1] as HTMLElement;
        triggerMouseEvent(headerCell, 'click');
        let args: any = { action: 'focusTask', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args);
        let args1: any = { action: 'tab', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args1);

    });
    it('tab action for labels', () => {
        let headerCell: HTMLElement = (document.getElementsByClassName('e-row')[0] as any).cells[7] as HTMLElement;
        triggerMouseEvent(headerCell, 'click');
        let args: any = { action: 'focusTask', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args);
        let args1: any = { action: 'tab', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args1);

    });
    it('tab action for second row to first row', () => {
        let headerCell: HTMLElement = (document.getElementsByClassName('e-row')[1] as any).cells[1] as HTMLElement;
        triggerMouseEvent(headerCell, 'click');
        let args: any = { action: 'focusTask', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args);
        let args1: any = { action: 'shiftTab', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args1);

    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('control + all to select all record action', function () {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: projectData1,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true
            },
            enableUndoRedo: true,
            undoRedoActions: ['Add', 'Edit', 'Delete'],
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'subtasks',
                dependency: 'Predecessor'
            },
            selectionSettings: {
                mode: 'Row',
                type: 'Multiple'
            },
            projectStartDate: new Date('02/01/2017'),
            projectEndDate: new Date('12/30/2017'),
            rowHeight: 40,
            taskbarHeight: 30
        }, done);
    });
    it('to select all record', () => {
        let args: any = { action: 'selectAll', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.selectionModule.selectedRowIndexes.length).toBe(41)
    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt editing action', () => {
    let ganttObj: Gantt;
    let interval: number;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cellEditData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    notes: 'Notes',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    resourceInfo: 'Resource',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceIDMapping: 'resourceId',
                resourceNameMapping: 'resourceName',
                resources: resourcesData,
                allowSelection: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                selectionSettings: {
                    mode: 'Both',
                    type: 'Multiple',
                    enableToggle: false
                },
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                editDialogFields: [
                    { type: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                ],
                splitterSettings: {
                    columnIndex: 9
                },
                allowUnscheduledTasks: true,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', editType: 'stringedit', width: 100 },
                    { field: 'StartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'EndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Duration', width: 100 },
                    { field: 'Predecessor', width: 100 },
                    { field: 'Progress', width: 100 },
                    { field: 'BaselineStartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'BaselineEndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Resource', width: 100 },
                    { field: 'Notes', width: 100 },
                    { field: 'Customcol', headerText: 'Custom Column', width: 100 }
                ],

            }, done);
    });
    it('home key testing', () => {
        let args: any = { action: 'home', preventDefault: preventDefault };
        ganttObj.selectedRowIndex = 0;
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.selectedRowIndex).toBe(0);
    });
    it('end key testing', () => {
        let args: any = { action: 'end', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.selectedRowIndex).toBe(ganttObj.currentViewData.length - 1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('shift Tab action', function () {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: splitTasksData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                segments: 'Segments',
            },
            labelSettings: {
                leftLabel: 'TaskID',
                rightLabel: 'TaskName'
            },
            allowRowDragAndDrop: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: false,
                showDeleteConfirmDialog: true,
                allowNextRowEdit: false,
            },
            columns: [
                { field: 'TaskID', width: 60 },
                {
                    field: 'TaskName',
                    headerText: 'Job Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            enableContextMenu: true,
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            splitterSettings: {
                columnIndex: 2,
            },
            projectStartDate: new Date('01/30/2019'),
            projectEndDate: new Date('03/04/2019')
        }, done);
    });
    it('shift tab action from taskbar to label', function () {
        let taskbar: any = document.getElementsByClassName('e-gantt-child-taskbar-inner-div')[2];
        triggerMouseEvent(taskbar, 'click');
        var args = { action: 'focusTask', preventDefault: preventDefault, target: taskbar };
        ganttObj.keyboardModule.keyAction(args);
        var args1 = { action: 'shiftTab', preventDefault: preventDefault, target: taskbar };
        ganttObj.keyboardModule.keyAction(args1);
    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('shift Tab action', function () {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll(function (done) {
        ganttObj = createGantt({
            dataSource: splitTasksData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                segments: 'Segments',
            },
            allowRowDragAndDrop: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: false,
                showDeleteConfirmDialog: true,
                allowNextRowEdit: false,
            },
            columns: [
                { field: 'TaskID', width: 60 },
                {
                    field: 'TaskName',
                    headerText: 'Job Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            enableContextMenu: true,
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            splitterSettings: {
                columnIndex: 2,
            },
            projectStartDate: new Date('01/30/2019'),
            projectEndDate: new Date('03/04/2019')
        }, done);
    });
    it('shift tab from', () => {
        let headerCell: HTMLElement = (document.getElementsByClassName('e-taskbar-main-container')[0] as any) as HTMLElement;
        triggerMouseEvent(headerCell, 'click');
        let args: any = { action: 'focusTask', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args);
        let args1: any = { action: 'shiftTab', preventDefault: preventDefault, target: headerCell } as any;
        ganttObj.keyboardModule.keyAction(args1);

    });
    it('tab for non editing cell', function () {
        let headerCell = (document.getElementsByClassName('e-row')[0] as any).cells[5];
        triggerMouseEvent(headerCell, 'dblclick');
        var args1 = { action: 'tab', preventDefault: preventDefault, target: headerCell };
        ganttObj.keyboardModule.keyAction(args1);
        expect(document.getElementsByClassName('e-editedbatchcell').length).toBe(1);
    });
    it('shift tab for non editing cell', function () {
        let headerCell = (document.getElementsByClassName('e-row')[0] as any).cells[7];
        triggerMouseEvent(headerCell, 'dblclick');
        var args1 = { action: 'shiftTab', preventDefault: preventDefault, target: headerCell };
        ganttObj.keyboardModule.keyAction(args1);
        expect(document.getElementsByClassName('e-editedbatchcell').length).toBe(1);
    });
    afterAll(function () {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('excape key for Gantt selection', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor',
                },
                selectedRowIndex: 2,
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single'
                }
            }, done);
    });
    it('excape key for Gantt selection', () => {
        let args: any = { action: 'cancelRequest', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args);
       // expect(ganttObj.selectionModule['selectedClass']).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('tab action for selection', () => {
    let ganttObj: Gantt;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor',
                },
                // selectedRowIndex: 2,
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Both',
                    type: 'Single'
                }
            }, done);
    });
    it('tab action for selection', () => {
        ganttObj.selectRow(1);
        const rows: any = ganttObj.treeGrid.getRows();
        (rows[0] as HTMLTableRowElement).cells[0].focus();
        ganttObj.treeGrid.grid.focusModule.setActive(true);
        let args: any = { action: 'tab', preventDefault: preventDefault, target: (rows[0] as HTMLTableRowElement).cells[0] };
        ganttObj.keyboardModule.keyAction(args);
        ganttObj.selectRow(4);
        const previousElement: HTMLElement = ganttObj.focusModule['previousActiveElement'];
        if (previousElement) {
            expect(previousElement.classList.contains('e-focus')).toBe(false);
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
