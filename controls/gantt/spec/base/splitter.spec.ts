/**
 * Gantt Splitter spec
 */
import { Gantt } from '../../src/index';
import { baselineData, projectData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { ResizeEventArgs, ResizingEventArgs } from '@syncfusion/ej2-layouts';
import { ISplitterResizedEventArgs } from '../../src/gantt/base/interface';
import { EmitType } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

describe('Gantt splitter support', () => {
    describe('Gantt splitter action', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: baselineData,
                    taskFields: {
                        id: 'TaskId',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children'
                    },
                    projectStartDate: new Date('10/15/2017'),
                    projectEndDate: new Date('12/30/2017'),
                }, done);
        });
        it('Perform Splitter Action', () => {
            ganttObj.splitterResizeStart = (args: ResizeEventArgs) => {
                expect(args['name']).toBe('splitterResizeStart');
            };
            ganttObj.splitterResizing = (args: ResizingEventArgs) => {
                expect(args['name']).toBe('splitterResizing');
            };
            ganttObj.splitterResized = (args: ISplitterResizedEventArgs) => {
                args.cancel = true;
                expect(args['name']).toBe('splitterResized');
            };
            let splitterIcon: HTMLElement = ganttObj.element.querySelector('.e-split-bar') as HTMLElement;
            triggerMouseEvent(splitterIcon, 'mousedown');
            triggerMouseEvent(splitterIcon, 'mousemove',100,0);
            triggerMouseEvent(splitterIcon, 'mouseup');
        });

        it('Setsplitter Position by public method', () => {
            ganttObj.splitterResized = (args) => {
                args.cancel = false;
            }
            ganttObj.setSplitterPosition('50%','position');
            expect(ganttObj.splitterModule.splitterObject.paneSettings[0].size).toBe('50%');
        });

        it('Splitter Settings at Initial Load', () => {
            
            ganttObj.splitterSettings.position = '70';
            ganttObj.dataBind();
            expect(ganttObj.splitterModule.splitterObject.paneSettings[0].size).toBe('70%');
        });
       

        it('Splitter Settings grid view', () => {
            ganttObj.splitterSettings.view = 'Grid';
            ganttObj.dataBind();
            expect(ganttObj.splitterModule.splitterObject.paneSettings[0].size).toBe('100%');
        });

        it('Splitter Settings chart view', () => {
            ganttObj.splitterSettings.view = 'Chart';
            ganttObj.dataBind();
            expect(ganttObj.splitterModule.splitterObject.paneSettings[0].size).toBe('0%');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        
    });
    describe('Splitter setting columnIndex issue', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: baselineData,
                    taskFields: {
                        id: 'TaskId',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children'
                    },
                    splitterSettings: {
                        columnIndex: 4
                    },
                    projectStartDate: new Date('10/15/2017'),
                    projectEndDate: new Date('12/30/2017'),
                }, done);
        });
        it('Column index position', () => {
            expect(ganttObj.splitterModule.splitterObject['properties']['separatorSize']).toBe(4);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Splitter setting columnIndex when column is not visible', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: [{
                        taskID: 1,
                        taskName: 'Project schedule',
                        startDate: new Date('02/08/2019'),
                        endDate: new Date('03/15/2019')
                    }],
                    taskFields: {
                        id: 'taskID',
                        name: 'taskName',
                        startDate: 'startDate',
                        endDate: 'endDate',
                        duration: 'duration',
                        progress: 'progress',
                        dependency: 'predecessor',
                        child: 'subtasks',
                    },
                    height: '503px',
                    highlightWeekends: true,
                    gridLines: "Both",
                    projectStartDate: new Date('02/03/2019'),
                    projectEndDate: new Date('03/23/2019'),
                    timelineSettings: {
                        topTier: {
                            format: 'MMM dd, yyyy',
                            unit: 'Week',
                        },
                        bottomTier: {
                            unit: 'Day',
                        }
                    },
                    splitterSettings: {
                        columnIndex: 1
                    },
                    treeColumnIndex: 1,
                    labelSettings: {
                        rightLabel: 'taskName',
                    },
                    columns: [
                        { field: 'taskID', visible: false },
                        { field: 'taskName', headerText: 'Name', width: 400 },
                        { field: 'StartDate', headerText: 'Start Date', type: 'date', format: 'yMd' },
                        { field: 'endDate', headerText: 'End Date', type: 'date', format: 'yMd' },
                        { field: 'duration', headerText: 'Duration' },
                        { field: 'predecessor', headerText: 'Dependency' },
                        { field: 'progress', headerText: 'Progress' }
                    ]
                }, done);
        });
        it('Column index position column visible is set to false', () => {
            expect((document.getElementsByClassName('e-split-bar')[0] as HTMLElement).style.order).toBe('1');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Schedule mode', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
            }, done);
        });
        it('Vertical scrollbar hidden issue while setting columnIndex', () => {
            ganttObj.splitterSettings.position = '50%';
            ganttObj.dataBind();
            expect(ganttObj.splitterModule.splitterObject.paneSettings[0].size).toBe('50%');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('bug-871577-updating spliter position', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
            }, done);
        });
        it('bug-871577-updating spliter position', () => {
            let splitterView = ganttObj.splitterSettings.view;
            splitterView = 'Grid';
            ganttObj.setSplitterPosition(splitterView, 'view');
            expect(ganttObj.splitterSettings.view).toBe('Grid');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
});



describe('Schedule mode', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: baselineData,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children'
            },
            splitterSettings: {
                columnIndex: 3
            },
            projectStartDate: new Date('10/15/2017'),
            projectEndDate: new Date('12/30/2017'),
        }, done);
    });
    it('Vertical scrollbar hidden issue while setting columnIndex', () => {
        
        ganttObj.splitterSettings.view = 'Grid';
        setTimeout(() => {
            ganttObj.splitterSettings.view='Default'     
        }, 100);
        expect((document.querySelector("#"+ganttObj.element.id+" > div.e-gantt-splitter.e-control.e-splitter.e-lib.e-splitter-horizontal > div.e-gantt-tree-grid-pane.e-pane.e-pane-horizontal.e-scrollable.e-static-pane.e-resizable") as HTMLElement).offsetWidth).toBe(399);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Splitter position issue after resizing', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: baselineData,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children'
            },
            splitterSettings:{
                columnIndex:2
            },
            projectStartDate: new Date('10/15/2017'),
            projectEndDate: new Date('12/30/2017'),
        }, done);
    });
    it('checking position of splitter after splitter resize', () => {
        ganttObj.setSplitterPosition('50%', 'position');
        let splitterIcon: HTMLElement = ganttObj.element.querySelector('.e-split-bar') as HTMLElement;
        triggerMouseEvent(splitterIcon, 'mousedown');
        triggerMouseEvent(splitterIcon, 'mousemove',60);
        triggerMouseEvent(splitterIcon, 'mouseup');
        ganttObj.setSplitterPosition('50%', 'position');
        expect(ganttObj.splitterModule.splitterObject.paneSettings[0].size).toBe('50%');
        
    });
    it('checking column index of splitter after splitter resize', () => {
        ganttObj.setSplitterPosition(2, 'columnIndex');
        let splitterIcon: HTMLElement = ganttObj.element.querySelector('.e-split-bar') as HTMLElement;
        triggerMouseEvent(splitterIcon, 'mousedown');
        triggerMouseEvent(splitterIcon, 'mousemove',60);
        triggerMouseEvent(splitterIcon, 'mouseup');
        ganttObj.setSplitterPosition(2, 'columnIndex');
        expect(ganttObj.splitterSettings.columnIndex).toBe(2);
        
    });
    it('checking class added e-droppable', () => {
       var className= ganttObj.chartPane.classList[1];
        expect(className).toBe('e-droppable');
        
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});