/**
 * Gantt Splitter spec
 */
import { Gantt } from '../../src/index';
import { baselineData } from '../base/data-source.spec';
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
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
            ganttObj.dataBind();
            let splitterIcon: HTMLElement = ganttObj.element.querySelector('.e-split-bar') as HTMLElement;
            triggerMouseEvent(splitterIcon, 'mousedown');
            triggerMouseEvent(splitterIcon, 'mousemove',100,0);
            triggerMouseEvent(splitterIcon, 'mouseup');
        });

        it('Setsplitter Position by public method', () => {
            ganttObj.splitterResized = (args) => {
                args.cancel = false;
            }
            ganttObj.dataBind();
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Column index position', () => {
            expect(ganttObj.splitterModule.splitterObject['properties']['separatorSize']).toBe(4);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Vertical scrollbar hidden issue while setting columnIndex', () => {
            ganttObj.splitterSettings.position = '50%';
            ganttObj.dataBind();
            expect(ganttObj.splitterModule.splitterObject.paneSettings[0].size).toBe('50%');
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('bug-871577-updating spliter position', () => {
            let splitterView = ganttObj.splitterSettings.view;
            splitterView = 'Grid';
            ganttObj.setSplitterPosition(splitterView, 'view');
            ganttObj.dataBind();
            expect(ganttObj.splitterSettings.view).toBe('Grid');
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Vertical scrollbar hidden issue while setting columnIndex', () => {
        
        ganttObj.splitterSettings.view = 'Grid';
        setTimeout(() => {
            ganttObj.splitterSettings.view='Default'

            
        }, 100);
        ganttObj.dataBind();
        expect((document.querySelector("#"+ganttObj.element.id+" > div.e-gantt-splitter.e-control.e-splitter.e-lib.e-splitter-horizontal > div.e-gantt-tree-grid-pane.e-pane.e-pane-horizontal.e-scrollable.e-static-pane.e-resizable") as HTMLElement).offsetWidth).toBe(399);
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
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
});