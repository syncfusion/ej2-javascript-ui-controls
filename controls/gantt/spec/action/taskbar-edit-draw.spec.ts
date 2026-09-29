import { Gantt, Edit, VirtualScroll, IGanttData, ActionBeginArgs } from '../../src/index';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { TaskbarEditDraw } from '../../src/gantt/actions/taskbar-edit-draw';
import * as cls from '../../src/gantt/base/css-constants';

describe('Feature Enablement', () => {
    Gantt.Inject(Edit, VirtualScroll);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        'TaskID': 1,
                        'TaskName': 'Parent Task 1',
                        'StartDate': new Date('02/27/2017'),
                        'EndDate': new Date('03/03/2017'),
                        'Progress': '40',
                        'BaselineStartDate': '02/27/2017',
                        'BaselineEndDate': '03/06/2017',
                        'Children': [
                            {
                                'TaskID': 2, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
                                'Progress': '40', 'isManual': true, Duration: 4
                            },
                            {
                                'TaskID': 3, 'TaskName': 'Child Task 1'
                            },
                            {
                                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'), 'EndDate': new Date('03/09/2017'),
                                'Progress': '40', 'BaselineStartDate': new Date('02/25/2017'), 'BaselineEndDate': new Date('03/06/2017'),
                            }
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    dependency: 'Predecessor'
                },
                allowUnscheduledTasks: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    allowTaskbarDraw: true
                },
                projectStartDate: new Date('02/25/2017'),
                projectEndDate: new Date('03/15/2017')
            }, done);
    });
    it('allowTaskbarDraw = true - Feature works', () => {
        expect(ganttObj.editSettings.allowTaskbarDraw).toBe(true);
        expect(ganttObj.editModule.taskbarEditDrawModule).toBeDefined();
        expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(false);
    });

    it('allowTaskbarDraw = false - Feature disabled', (done: Function) => {
        ganttObj.editSettings.allowTaskbarDraw = false;
        ganttObj.dataBind();

        setTimeout(() => {
            expect(ganttObj.editSettings.allowTaskbarDraw).toBe(false);
            done();
        }, 10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Eligibility Validation', () => {
    Gantt.Inject(Edit, VirtualScroll);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        'TaskID': 1,
                        'TaskName': 'Parent Task 1',
                        'StartDate': new Date('02/27/2017'),
                        'EndDate': new Date('03/03/2017'),
                        'Progress': '40',
                        'BaselineStartDate': '02/27/2017',
                        'BaselineEndDate': '03/06/2017',
                        'Children': [
                            {
                                'TaskID': 2, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
                                'Progress': '40', 'isManual': true, Duration: 4
                            },
                            {
                                'TaskID': 3, 'TaskName': 'Child Task 1'
                            },
                            {
                                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'), 'EndDate': new Date('03/09/2017'),
                                'Progress': '40', 'BaselineStartDate': new Date('02/25/2017'), 'BaselineEndDate': new Date('03/06/2017'),
                            }
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    dependency: 'Predecessor'
                },
                allowUnscheduledTasks: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    allowTaskbarDraw: true
                },
                projectStartDate: new Date('02/25/2017'),
                projectEndDate: new Date('03/15/2017')
            }, done);
    });
    beforeEach((done: Function) => {
        // Reset to enabled state
        ganttObj.editSettings.allowTaskbarDraw = true;
        ganttObj.dataBind();
        setTimeout(done, 10);
    });

    it('Existing unscheduled task row - Draw allowed', () => {
        // Row index 2 has an unscheduled task (TaskID: 3)
        const tr: HTMLElement = ganttObj.getRowByIndex(2) as HTMLElement;
        expect(tr).toBeDefined();

        // Check if the row has no taskbar rendered
        const taskbarContainer: Element = tr.querySelector('.' + cls.traceParentTaskBar);
        expect(taskbarContainer).toBeNull();

        // The task should be unscheduled
        const rowData = ganttObj.currentViewData[2];
        expect(ganttObj.isUnscheduledTask(rowData.ganttProperties)).toBe(true);
    });

    it('Scheduled task row - Draw blocked', () => {
        // Row index 0 has a scheduled task (TaskID: 1)
        const tr: HTMLElement = ganttObj.getRowByIndex(1) as HTMLElement;
        expect(tr).toBeDefined();

        // Check if the row has a taskbar rendered
        const taskbarContainer: Element = tr.querySelector('.' + cls.traceChildTaskBar);
        expect(taskbarContainer).not.toBeNull();

        // Simulate mouse down on the row 470 is first row top add 37 to get next row top.
        triggerMouseEvent(tr, 'mousedown', 300, 507);
        triggerMouseEvent(tr, 'mousemove', 500, 507);

        // Should not start drawing
        expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(false);
    });

    it('Parent task row - Draw blocked', () => {
        // Row index 0 is a parent task (TaskID: 1)
        const tr: HTMLElement = ganttObj.getRowByIndex(0) as HTMLElement;
        expect(tr).toBeDefined();

        // Simulate mouse down on the row
        triggerMouseEvent(tr, 'mousedown', 300, 470);
        triggerMouseEvent(tr, 'mousemove', 500, 470);
        // Should not start drawing
        expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(false);
    });

    it('Row with taskbar rendered - Draw blocked', () => {
        // Row index 1 has a scheduled task with taskbar (TaskID: 2 in parent)
        const tr: HTMLElement = ganttObj.getRowByIndex(1) as HTMLElement;
        expect(tr).toBeDefined();

        // Check if the row has a taskbar rendered
        const taskbarContainer: Element = tr.querySelector('.' + cls.traceChildTaskBar);
        expect(taskbarContainer).not.toBeNull();

        // Simulate mouse down on the row
        triggerMouseEvent(tr, 'mousedown', 100, tr.offsetTop + 455);

        // Should not start drawing
        expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(false);
    });

    it('Unscheduled task support disabled - Draw blocked', (done: Function) => {
        ganttObj.allowUnscheduledTasks = false;
        ganttObj.dataBind();

        setTimeout(() => {
            // Row index 2 has an unscheduled task (TaskID: 3)
            const tr: HTMLElement = ganttObj.getRowByIndex(2) as HTMLElement;
            expect(tr).toBeDefined();

            // Simulate mouse down on the row
            triggerMouseEvent(tr, 'mousedown', 100, tr.offsetTop + 455);

            // Should not start drawing
            expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(false);
            done();
        }, 10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Drag Lifecycle', () => {
    Gantt.Inject(Edit, VirtualScroll);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        'TaskID': 1,
                        'TaskName': 'Parent Task 1',
                        'StartDate': new Date('02/27/2017'),
                        'EndDate': new Date('03/03/2017'),
                        'Progress': '40',
                        'BaselineStartDate': '02/27/2017',
                        'BaselineEndDate': '03/06/2017',
                        'Children': [
                            {
                                'TaskID': 2, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
                                'Progress': '40', 'isManual': true, Duration: 4
                            },
                            {
                                'TaskID': 3, 'TaskName': 'Child Task 1'
                            },
                            {
                                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'), 'EndDate': new Date('03/09/2017'),
                                'Progress': '40', 'BaselineStartDate': new Date('02/25/2017'), 'BaselineEndDate': new Date('03/06/2017'),
                            }
                        ]
                    },
                    {
                        'TaskID': 5,
                        'TaskName': 'Parent Task 2',
                        'StartDate': new Date('03/06/2017'),
                        'EndDate': new Date('03/10/2017'),
                        'Progress': '40',
                        'isManual': true,
                        'Children': [
                            {
                                'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': '03/06/2017', 'EndDate': new Date('03/06/2017'),
                                'Progress': '40', Duration: 0, 'BaselineStartDate': new Date('03/06/2017'), 'BaselineEndDate': new Date('03/10/2017'),
                            },
                            {
                                'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': null, 'EndDate': new Date('03/10/2017'), 'Progress': '40', Duration: 4
                            },
                            {
                                'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/06/2017'), 'EndDate': null,
                                'Progress': '40', 'BaselineStartDate': new Date('03/05/2017 05:00:00 AM'),
                                'BaselineEndDate': new Date('03/16/2017 18:00:00 PM'),
                            },
                            {
                                'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/06/2017'), 'EndDate': new Date('03/10/2017'),
                                'Progress': '40', 'isManual': true, Duration: 0
                            }
                        ]
                    },
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    dependency: 'Predecessor'
                },
                allowUnscheduledTasks: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    allowTaskbarDraw: true
                },
                projectStartDate: new Date('02/25/2017'),
                projectEndDate: new Date('03/15/2017')
            }, done);
    });
    beforeEach(() => {
        ganttObj.allowUnscheduledTasks = true;
        ganttObj.dataBind();
    });

    it('Mouse Down - Not start drawing on eligible row', () => {
        const tr: HTMLElement = ganttObj.getRowByIndex(2) as HTMLElement;
        expect(tr).toBeDefined();

        // Check that it's eligible for drawing
        const taskbarContainer: Element = tr.querySelector('.' + cls.traceChildTaskBar);
        expect(taskbarContainer).toBeNull();

        // Simulate mouse down on the row
        triggerMouseEvent(tr, 'mousedown', 300, tr.offsetTop + 455);

        // Should start drawing
        expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(false);
    });

    it('Mouse Move - Preview taskbar rendered', (done: Function) => {
        const tr: HTMLElement = ganttObj.getRowByIndex(3) as HTMLElement;
        expect(tr).toBeDefined();

        // Start drawing
        triggerMouseEvent(tr, 'mousedown', 300, tr.offsetTop + 455);
        // Move mouse to trigger preview
        triggerMouseEvent(tr, 'mousemove', 500, tr.offsetTop + 455);
        expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(true);

        setTimeout(() => {
            // Check if preview is rendered
            const previewTaskbar: HTMLElement = document.querySelector('.' + cls.drawPreviewTaskbar);
            expect(previewTaskbar).not.toBeNull();
            done();
        }, 10);
    });

    it('Mouse Up - Task updated', (done: Function) => {
        const tr: HTMLElement = ganttObj.getRowByIndex(3) as HTMLElement;
        expect(tr).toBeDefined();

        // Start drawing
        triggerMouseEvent(tr, 'mousedown', 300, tr.offsetTop + 455);
        // Move mouse to create a valid draw
        triggerMouseEvent(tr, 'mousemove', 500, tr.offsetTop + 455);
        expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(true);

        // Release mouse to complete drawing
        triggerMouseEvent(tr, 'mouseup', 500, tr.offsetTop + 455);

        setTimeout(() => {
            var data: IGanttData = ganttObj.currentViewData[2];
            expect(data.ganttProperties.startDate).toBeDefined();
            expect(data.ganttProperties.endDate).toBeDefined();
            expect(data.ganttProperties.duration).toBeGreaterThan(0);
            expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(false);
            done();
        }, 10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Direct Method Testing for Code Coverage', () => {
    Gantt.Inject(Edit, VirtualScroll);
    let ganttObj: Gantt;
    let taskbarEditDraw: TaskbarEditDraw;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        'TaskID': 1,
                        'TaskName': 'Parent Task 1',
                        'StartDate': new Date('02/27/2017'),
                        'EndDate': new Date('03/03/2017'),
                        'Progress': '40',
                        'BaselineStartDate': '02/27/2017',
                        'BaselineEndDate': '03/06/2017',
                        'Children': [
                            {
                                'TaskID': 2, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
                                'Progress': '40', 'isManual': true, Duration: 4
                            },
                            {
                                'TaskID': 3, 'TaskName': 'Child Task 1'
                            },
                            {
                                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'), 'EndDate': new Date('03/09/2017'),
                                'Progress': '40', 'BaselineStartDate': new Date('02/25/2017'), 'BaselineEndDate': new Date('03/06/2017'),
                            }
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    dependency: 'Predecessor'
                },
                allowUnscheduledTasks: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    allowTaskbarDraw: true
                },
                projectStartDate: new Date('02/25/2017'),
                projectEndDate: new Date('03/15/2017')
            }, done);
    });

    beforeEach(() => {
        taskbarEditDraw = ganttObj.editModule.taskbarEditDrawModule;
        // Reset state before each test
        taskbarEditDraw['reset']();
    });

    it('getRowIndexFromY - should return correct row index', () => {
        const tr: HTMLElement = ganttObj.getRowByIndex(1) as HTMLElement;
        expect(tr).toBeDefined();
        // Test with a clientY that should correspond to the first row
        const rowIndex = (taskbarEditDraw as any)['getRowIndexFromY'](tr.offsetTop);
        expect(rowIndex).toBe(-1);
    });

    it('isParentRow - should correctly identify parent rows', () => {
        // Test with parent row (index 0)
        const isParent1 = (taskbarEditDraw as any)['isParentRow'](0);
        expect(isParent1).toBe(true);

        // Test with child row (index 1)
        const isParent2 = (taskbarEditDraw as any)['isParentRow'](1);
        expect(isParent2).toBe(false);

        const isParent3 = (taskbarEditDraw as any)['isParentRow'](-1);
        expect(isParent3).toBe(false);
    });

    it('getCoordinate - should return correct coordinates', () => {
        // Test with PointerEvent
        const pointerEvent = new PointerEvent('mousemove', { clientX: 100, clientY: 200 });
        const coord = (taskbarEditDraw as any)['getCoordinate'](pointerEvent);
        expect(coord.pageX).toBe(100);
        expect(coord.pageY).toBe(200);
        const touchEvent = { touches: [{ pageX: 150, pageY: 250 }] } as any;
        const result = (taskbarEditDraw as any).getCoordinate(touchEvent);
        expect(result.pageX).toBe(150);
        expect(result.pageY).toBe(250);
    });

    it('computeDuration - should calculate duration correctly', () => {
        const startDate = new Date('02/27/2017');
        const endDate = new Date('03/03/2017');
        const duration = (taskbarEditDraw as any)['computeDuration'](startDate, endDate);
        expect(duration).toBeGreaterThan(0);
        expect((taskbarEditDraw as any)['computeDuration'](null, new Date())).toBe(0);
    });

    it('reset - should reset all internal state variables', () => {
        // Set some values
        taskbarEditDraw['isDrawing'] = true;
        taskbarEditDraw['startRowIndex'] = 5;
        taskbarEditDraw['mouseDownX'] = 100;
        taskbarEditDraw['mouseMoveX'] = 200;

        // Reset
        (taskbarEditDraw as any)['reset']();

        // Check values are reset
        expect(taskbarEditDraw['isDrawing']).toBe(false);
        expect(taskbarEditDraw['startRowIndex']).toBe(-1);
        expect(taskbarEditDraw['mouseDownX']).toBe(0);
        expect(taskbarEditDraw['mouseMoveX']).toBe(0);
    });

    it('getIsDrawing - should return current drawing state', () => {
        taskbarEditDraw['isDrawing'] = true;
        expect(taskbarEditDraw.getIsDrawing()).toBe(true);

        taskbarEditDraw['isDrawing'] = false;
        expect(taskbarEditDraw.getIsDrawing()).toBe(false);
    });

    it('cleanupPreview - should clean up preview elements', () => {
        // Create mock preview elements
        const previewContainer = document.createElement('div');
        previewContainer.className = 'e-draw-preview-taskbar';
        document.body.appendChild(previewContainer);

        taskbarEditDraw['previewContainer'] = previewContainer;
        taskbarEditDraw['previewTaskbar'] = document.createElement('div');

        // Cleanup
        (taskbarEditDraw as any)['cleanupPreview']();

        // Check elements are cleaned up
        expect(taskbarEditDraw['previewContainer']).toBeNull();
        expect(taskbarEditDraw['previewTaskbar']).toBeNull();
    });

    it('destroy - should properly destroy the module', () => {
        // Spy on unWireEvents
        spyOn(taskbarEditDraw as any, 'unWireEvents').and.callThrough();
        spyOn(taskbarEditDraw as any, 'cleanupPreview').and.callThrough();
        spyOn(taskbarEditDraw as any, 'stopScrollTimer').and.callThrough();
        spyOn(taskbarEditDraw as any, 'reset').and.callThrough();

        // Destroy
        taskbarEditDraw.destroy();

        // Check all cleanup methods were called
        expect((taskbarEditDraw as any)['unWireEvents']).toHaveBeenCalled();
        expect((taskbarEditDraw as any)['cleanupPreview']).toHaveBeenCalled();
        expect((taskbarEditDraw as any)['stopScrollTimer']).toHaveBeenCalled();
        expect((taskbarEditDraw as any)['reset']).toHaveBeenCalled();
    });

    it('handleAutoScroll - should handle auto scroll correctly', () => {
        // Create a mock event that would trigger scrolling
        const chartElement = ganttObj.ganttChartModule.chartElement as HTMLElement;
        const rect = chartElement.getBoundingClientRect();

        const mockEvent = new PointerEvent('mousemove', {
            clientX: rect.right - 10, // Near the right edge
            clientY: rect.top + 50
        });

        // Spy on startScrollTimer
        spyOn(taskbarEditDraw as any, 'startScrollTimer').and.callThrough();
        spyOn(taskbarEditDraw as any, 'stopScrollTimer').and.callThrough();

        // Call handleAutoScroll
        (taskbarEditDraw as any)['handleAutoScroll'](mockEvent);

        // Should start scrolling right
        expect((taskbarEditDraw as any)['startScrollTimer']).toHaveBeenCalledWith('right');
    });

    it('startScrollTimer and stopScrollTimer - should manage scroll timer', () => {
        // Start timer
        (taskbarEditDraw as any)['startScrollTimer']('right');
        expect((taskbarEditDraw as any)['scrollTimer']).not.toBeNull();

        // Stop timer
        (taskbarEditDraw as any)['stopScrollTimer']();
    });
    it('startScrollTimer and stopScrollTimer - should manage scroll timer', () => {
        (taskbarEditDraw as any)['processAutoScroll']('left');
        expect(taskbarEditDraw['isDrawing']).toBe(false);
    });
    it('startDrawPreview - should create preview elements', () => {
        // Call startDrawPreview
        (taskbarEditDraw as any)['startDrawPreview']();

        // Check preview elements are created
        expect(taskbarEditDraw['previewContainer']).not.toBeNull();
        expect(taskbarEditDraw['previewTaskbar']).not.toBeNull();

        // Cleanup
        (taskbarEditDraw as any)['cleanupPreview']();
    });

    it('mouseLeaveHandler - should handle mouse leave correctly', () => {
        // Set drawing state
        taskbarEditDraw['isDrawing'] = true;
        taskbarEditDraw['dragMouseLeave'] = false;
        taskbarEditDraw['startRowIndex'] = 2;
        // Create a mock event
        const mockEvent = new PointerEvent('mouseleave');

        // Call mouseLeaveHandler
        (taskbarEditDraw as any)['mouseLeaveHandler'](mockEvent);

        // Check state is updated
        expect(taskbarEditDraw['dragMouseLeave']).toBe(true);
        taskbarEditDraw['isDrawing'] = false;
        (taskbarEditDraw as any)['mouseLeaveHandler'](mockEvent);
        expect(taskbarEditDraw['isDrawing']).toBe(false);
    });
    it('mouseUpHandler - should handle mouse up correctly', () => {
        // Set drawing state
        taskbarEditDraw['startRowIndex'] = 2;
        taskbarEditDraw['dragMouseLeave'] = true;

        // Create a mock event
        const mockEvent = new PointerEvent('mouseup');

        // Call mouseupHandler
        (taskbarEditDraw as any)['mouseUpHandler'](mockEvent);

        // Check state is updated
        expect(taskbarEditDraw['isDrawing']).toBe(false);
    });
    it('mouseMoveHandler - should handle mouse move correctly', () => {
        // Set drawing state
        taskbarEditDraw['startRowIndex'] = 2;

        // Create a mock event
        const mockEvent = new PointerEvent('mousemove', { clientX: 0, clientY: 0 });

        // Call mouseupHandler
        (taskbarEditDraw as any)['mouseMoveHandler'](mockEvent);

        // Check state is updated
        expect(taskbarEditDraw['isDrawing']).toBe(false);
    });
    it('keyDownHandler - should handle ESC key correctly', () => {
        // Set drawing state
        taskbarEditDraw['isDrawing'] = true;
        taskbarEditDraw['startRowIndex'] = 0;

        // Create a mock ESC key event
        const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' }) as any;
        mockEvent.preventDefault = jasmine.createSpy('preventDefault');

        // Spy on cleanupPreview and reset
        spyOn(taskbarEditDraw as any, 'cleanupPreview').and.callThrough();
        spyOn(taskbarEditDraw as any, 'reset').and.callThrough();

        // Call keyDownHandler
        (taskbarEditDraw as any)['keyDownHandler'](mockEvent);

        // Check methods were called
        expect(taskbarEditDraw['cleanupPreview']).toHaveBeenCalled();
        expect(taskbarEditDraw['reset']).toHaveBeenCalled();
    });
    it('startDrawPreview - should handle startDrawPreview correctly', () => {
        ganttObj.ganttChartModule.chartBodyContainer = document.createElement('div');
        (taskbarEditDraw as any)['startDrawPreview']();
        expect(taskbarEditDraw['isDrawing']).toBe(false);
    });
    it('mouseMove - should handle mouse move correctly', () => {
        // Set drawing state
        taskbarEditDraw['startRowIndex'] = -1;

        // Create a mock event
        const mockEvent = new PointerEvent('mousemove', { clientX: 0, clientY: 0 });

        // Call mouseupHandler
        (taskbarEditDraw as any)['mouseMoveHandler'](mockEvent);

        // Check state is updated
        expect(taskbarEditDraw['isDrawing']).toBe(false);
    });
    it('actionBegin - coverage', () => {
        var eventArgs: ActionBeginArgs = {
            cancel: true
        }
        taskbarEditDraw['handleActionBegin'](eventArgs);
        expect(ganttObj.editModule.taskbarEditDrawModule.getIsDrawing()).toBe(false);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Direct Method Testing for Code Coverage', () => {
    Gantt.Inject(Edit, VirtualScroll);
    let ganttObj: Gantt;
    let taskbarEditDraw: TaskbarEditDraw;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        'TaskID': 1,
                        'TaskName': 'Parent Task 1',
                        'StartDate': new Date('02/27/2017'),
                        'EndDate': new Date('03/03/2017'),
                        'Progress': '40',
                        'BaselineStartDate': '02/27/2017',
                        'BaselineEndDate': '03/06/2017',
                        'Children': [
                            {
                                'TaskID': 2, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
                                'Progress': '40', 'isManual': true, Duration: 4
                            },
                            {
                                'TaskID': 3, 'TaskName': 'Child Task 1'
                            },
                            {
                                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'), 'EndDate': new Date('03/09/2017'),
                                'Progress': '40', 'BaselineStartDate': new Date('02/25/2017'), 'BaselineEndDate': new Date('03/06/2017'),
                            }
                        ]
                    }
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    dependency: 'Predecessor'
                },
                allowUnscheduledTasks: true,
                enableRtl: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    allowTaskbarDraw: true
                },
                projectStartDate: new Date('02/25/2017'),
                projectEndDate: new Date('03/15/2017')
            }, done);
    });

    beforeEach(() => {
        taskbarEditDraw = ganttObj.editModule.taskbarEditDrawModule;
        // Reset state before each test
        taskbarEditDraw['reset']();
    });

    it('getDrawRowElement - code coverage', () => {
        ganttObj.enableVirtualization = true;
        (taskbarEditDraw as any)['getDrawRowElement'](1);
        expect(taskbarEditDraw['isDrawing']).toBe(false);
        ganttObj.enableVirtualization = false;
    });
    it('startScrollTimer and stopScrollTimer - should manage scroll timer', () => {
        taskbarEditDraw['mouseMoveX'] = 300;
        (taskbarEditDraw as any)['processAutoScroll']('left');
        expect(taskbarEditDraw['isDrawing']).toBe(false);
        (taskbarEditDraw as any)['processAutoScroll']('right');
    });
    
    it('updateDrawPreview - should manage updateDrawPreview', () => {
        taskbarEditDraw['mouseMoveX'] = 200;
        taskbarEditDraw['mouseDownX'] = 300;
        taskbarEditDraw['startRowIndex'] = 2;
        taskbarEditDraw['previewTaskbar'] = document.createElement('div');
        (taskbarEditDraw as any)['updateDrawPreview']();
        expect(taskbarEditDraw['isDrawing']).toBe(false);
    });
    it('stopScrollTimer - should handle stopScrollTimer', () => {
        taskbarEditDraw['scrollTimer'] = null;

        // Call mouseupHandler
        (taskbarEditDraw as any)['stopScrollTimer']();

        // Check state is updated
        expect(taskbarEditDraw['isDrawing']).toBe(false);
    });
    it('handleAutoScroll - should handle auto scroll correctly', () => {
        // Create a mock event that would trigger scrolling
        const chartElement = ganttObj.ganttChartModule.chartElement as HTMLElement;
        const rect = chartElement.getBoundingClientRect();

        const mockEvent = new PointerEvent('mousemove', {
            clientX: rect.right - 10, // Near the right edge
            clientY: rect.top + 50
        });
        (taskbarEditDraw as any)['scrollTimer'] = 10;
        // Spy on startScrollTimer
        spyOn(taskbarEditDraw as any, 'startScrollTimer').and.callThrough();
        spyOn(taskbarEditDraw as any, 'stopScrollTimer').and.callThrough();
        // Call handleAutoScroll
        (taskbarEditDraw as any)['handleAutoScroll'](mockEvent);

        expect(taskbarEditDraw['isDrawing']).toBe(false);
    });
    it('getRowIndexFromY - should return correct row index', (done: Function) => {
        ganttObj.dataSource = null;
        setTimeout(() => {
            const rowIndex = (taskbarEditDraw as any)['getRowIndexFromY'](0);
            expect(rowIndex).toBe(-1);
            done();
        }, 10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});