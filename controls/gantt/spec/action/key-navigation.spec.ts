import { Gantt, Selection, Edit, Toolbar,Filter } from '../../src/index';
import { projectData1 } from '../base/data-source.spec';
import { IKeyPressedEventArgs } from '../../src/gantt/base/interface';
import { createGantt, destroyGantt, triggerMouseEvent, getKeyUpObj } from '../base/gantt-util.spec';
import { Browser, getValue } from '@syncfusion/ej2-base';
import { RowSelectingEventArgs } from '@syncfusion/ej2-grids';
import { EJ2Instance } from '@syncfusion/ej2-navigations';
Gantt.Inject(Selection, Edit, Toolbar,Filter);

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
                    actionComplete: function (args:IKeyPressedEventArgs) {
                        if (args.requestType == "keyPressed" && args.action == "customKey") {
                            args.keyEvent.preventDefault();
                            this.selectionModule.selectRow(6);
                           
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);               
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
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
            expect(oldRowIndex + 1).toBe(ganttObj.selectedRowIndex);
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
        it('expandRow key testing', () => {
            ganttObj.selectionModule.selectRow(0);
            let args: any = { action: 'expandRow', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(ganttObj.currentViewData[0].expanded).toBe(true);
        });
        it('addrow key testing', () => {
            oldRowIndex = ganttObj.currentViewData.length;
            let args: any = { action: 'addRow', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(oldRowIndex + 1).toBe(ganttObj.currentViewData.length);
        });
        it('delete key testing', () => {
            oldRowIndex = ganttObj.currentViewData.length;
            ganttObj.selectionModule.selectRow(0);
            let args: any = { action: 'delete', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            expect(oldRowIndex - 1).toBe(ganttObj.currentViewData.length);
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
        it('Custom key testing', () => {
            setTimeout(function () {
                let args: any = { action: 'customKey', preventDefault: preventDefault };
                ganttObj.keyboardModule.keyAction(args);
                expect(ganttObj.selectedRowIndex).toBe(6);
            }, 100);
        });       
        it('saveRequest key testing', () => {  
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');           
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let args1: any = { action: 'saveRequest', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args1); 
            expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
        });       
        it('Search key testing', () => {
            let args: any = { action: 'focusSearch', preventDefault: preventDefault };
            ganttObj.keyboardModule.keyAction(args);
            let searchbar: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar'));
            searchbar.value = 'Plan budget';
            (ganttObj.toolbarModule as any).keyUpHandler(getKeyUpObj(13, searchbar));
            setTimeout(function() {
                expect(ganttObj.currentViewData.length).toBe(3);
                searchbar.value = '';
                (ganttObj.toolbarModule as any).keyUpHandler(getKeyUpObj(13, searchbar));
              }, 100);   
        });		
    });
});