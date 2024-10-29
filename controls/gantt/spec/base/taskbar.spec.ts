/**
 * Gantt taskbar spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, IQueryTaskbarInfoEventArgs } from '../../src/index';
import * as cls from '../../src/gantt/base/css-constants';
import { baselineData, resourceData, projectData, projectNewData18, projectNewData19, projectNewData20, splitData, projectNewData21, taskModeData4, taskModeData5, projectNewData22, CR899690, addDependency, manualParentdata } from './data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from './gantt-util.spec';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
describe('Gantt taskbar rendering', () => {
    describe('Gantt taskbar rendering actions', () => {
        let ganttObj: Gantt;

        (window as WindowDom).getheight = () => {
            return ganttObj.getTaskbarHeight();
        };

        interface WindowDom extends Window {
            getheight?: Function;
        }

        let lefttasklabel: Element = createElement('div', { id: 'lefttasklabelTS', styles: 'visibility:hidden' });
        lefttasklabel.innerHTML = '<div>Progress - ${Progress}%</div>';
        document.body.appendChild(lefttasklabel);

        let righttasklabel: Element = createElement('div', { id: 'righttasklabelTS', styles: 'visibility:hidden' });
        righttasklabel.innerHTML = '<div>Task Name  - ${TaskName}</div>';
        document.body.appendChild(righttasklabel);

        let parentTaskTemplate: Element = createElement('div', { id: 'demoParentTaskTemplate', className: cls.traceParentTaskBar + ' ' + cls.parentTaskBarInnerDiv, styles: 'visibility:hidden' });
        parentTaskTemplate.innerHTML = '<div class="' + cls.parentProgressBarInnerDiv + ' ' + cls.traceParentProgressBar + '" style="width:${progressWidth}px;height:${getheight()}px;"><span class="e-task-label" style="color:white">ParentTemplate</span></div>';
        document.body.appendChild(parentTaskTemplate);

        let childTaskTemplate: Element = createElement('div', { id: 'demoChildTaskTemplate', className: cls.childTaskBarInnerDiv + ' ' + cls.traceChildTaskBar, styles: 'visibility:hidden' });
        childTaskTemplate.innerHTML = '<div class="' + cls.childProgressBarInnerDiv + ' ' + cls.traceChildProgressBar + '" style="width:${progressWidth}px;"><span class="e-task-label" style="color:white">ChildTemplate</span></div>';
        document.body.appendChild(childTaskTemplate);

        let parentTaskTemplateCustom: Element = createElement('div', { id: 'demoParentTaskTemplateCustom', className: cls.traceParentTaskBar, styles: 'visibility:hidden' });
        parentTaskTemplateCustom.innerHTML = '<div class="' + cls.traceParentProgressBar + '"style="width:${progressWidth}px;height:${getheight()}px;"><span class="e-task-label" style="color:black">ParentTemplate-custom</span></div>';
        document.body.appendChild(parentTaskTemplateCustom);

        let childTaskTemplateCustom: Element = createElement('div', { id: 'demoChildTaskTemplateCustom', className: cls.traceChildTaskBar, styles: 'visibility:hidden' });
        childTaskTemplateCustom.innerHTML = '<div class="' + cls.traceChildProgressBar + '" style="width:${progressWidth}px;"><span class="e-task-label" style="color:black">ChildTemplate-custom</span></div>';
        document.body.appendChild(childTaskTemplateCustom);

        let milestoneTemplate: Element = createElement('div', { id: 'milestoneTemplate', className: cls.traceMilestone, styles: 'visibility:hidden' });
        milestoneTemplate.innerHTML = '<div class="' + cls.traceMilestone + '"><div style="width:100%;height:100%;background:gray;"><div></div>';
        document.body.appendChild(milestoneTemplate);

        let indicatorlabel: Element = createElement('div', { id: 'indicatorTS', styles: 'visibility:hidden' });
        indicatorlabel.innerHTML = '<span>TS-Template : ${TaskName}</span>';
        document.body.appendChild(indicatorlabel);

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
                        child: 'Children',
                        cssClass: 'cusClass',
                        baselineStartDate: 'BaselineStartDate',
                        baselineEndDate: 'BaselineEndDate',
                        resourceInfo: 'resourceInfo',
                        indicators: 'Indicators'
                    },
                    projectStartDate: new Date('10/15/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    renderBaseline: true,
                    timelineSettings: {
                        bottomTier: {
                            unit: 'Day',
                            format: 'ddd, MMM',
                            count: 2
                        },
                        timelineUnitSize: 60
                    },
                    rowHeight: 40,
                    taskbarHeight: 30,
                    resourceIDMapping: 'resourceId',
                    resourceNameMapping: 'resourceName',
                    resources: resourceData,
                }, done);
        });
        it('Testing QueryTaskbarInfo event', () => {
            ganttObj.queryTaskbarInfo = function (args: IQueryTaskbarInfoEventArgs) {
                if (args.taskbarType === 'Milestone') {
                    args.milestoneColor = "green";
                    args.baselineColor = "yellow";
                }
                if (args.taskbarType === 'ParentTask') {
                    args.taskbarBgColor = "green";
                    args.taskbarBorderColor = "gray";
                    args.progressBarBgColor = "orange";
                    //args.progressBarBorderColor = "Red";
                    args.baselineColor = "Green";
                }
                if (args.taskbarType === 'ChildTask') {
                    args.taskbarBgColor = "black";
                    args.taskbarBorderColor = "yellow";
                    args.progressBarBgColor = "brown";
                    //args.progressBarBorderColor = "gray";
                    args.leftLabelColor = "yellow";
                    args.rightLabelColor = "brown";
                    args.taskLabelColor = "white";
                    args.baselineColor = "Brown";
                }
            };
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.' + cls.parentProgressBarInnerDiv) as HTMLElement).style.backgroundColor).toBe("orange");
                expect((ganttObj.element.querySelector('.' + cls.parentTaskBarInnerDiv) as HTMLElement).style.backgroundColor).toBe("green");
                expect((ganttObj.element.querySelector('.' + cls.childTaskBarInnerDiv) as HTMLElement).style.backgroundColor).toBe("black");
                expect((ganttObj.element.querySelector('.' + cls.childProgressBarInnerDiv) as HTMLElement).style.backgroundColor).toBe("brown");
                expect((ganttObj.element.querySelector('.' + cls.traceMilestone) as HTMLElement).style.backgroundColor).toBe("green");
                expect((ganttObj.element.querySelector('.' + cls.baselineBar) as HTMLElement).style.backgroundColor).toBe("green");
                expect((ganttObj.element.querySelector('.' + cls.baselineMilestoneContainer) as HTMLElement).style.backgroundColor).toBe("yellow");
            }
        });
        it('Testing with taskbarheight and rowheight', () => {
            ganttObj.taskbarHeight = 50;
            ganttObj.rowHeight = 40;
            ganttObj.baselineColor = '';
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.' + cls.chartRow) as HTMLElement).offsetHeight).toBe(40);
                expect((ganttObj.element.querySelector('.' + cls.taskBarMainContainer) as HTMLElement).offsetHeight).toBe(18);
            }
        });
        it('Render gantt without base line', () => {
            ganttObj.renderBaseline = false;
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.' + cls.baselineBar)).toBe(null);
            }

        });

        it('Parent taskbar with template ID', () => {
            ganttObj.parentTaskbarTemplate = '#demoParentTaskTemplate';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.' + cls.taskLabel).textContent).toBe('ParentTemplate');
            }
        });
        it('Child taskbar with template ID', () => {
            ganttObj.taskbarTemplate = '#demoChildTaskTemplate';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('ChildTemplate');
            }
        });
        it('Milestone with template ID', () => {
            ganttObj.milestoneTemplate = '#milestoneTemplate';
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.' + cls.traceMilestone).children[0] as HTMLElement).style.backgroundColor).toBe("gray");
            }
        });
        it('Milestone with direct string template', () => {
            ganttObj.milestoneTemplate = '<div class="' + cls.traceMilestone + '"><div style="width:30px;height:30px;background:Yellow;"><div><div></div></div>';
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.' + cls.traceMilestone).children[0] as HTMLElement).style.backgroundColor).toBe("yellow");
            }
        });
        it('Testing with Parent taskbar and taskbar template', () => {
            ganttObj.parentTaskbarTemplate = '#demoParentTaskTemplateCustom';
            ganttObj.taskbarTemplate = '#demoChildTaskTemplateCustom';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.' + cls.taskLabel).textContent).toBe('ParentTemplate-custom');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('ChildTemplate-custom');
            }
        });
        it('Testing with Expand status', () => {
            ganttObj.taskFields.expandState = 'Expand';
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.gridrowtaskId4level2') as HTMLElement).style.display).toBe("none");
            }

        });
        it('Testing with task start with project start date', (done: Function) => {
            ganttObj.milestoneTemplate = null;
            ganttObj.taskbarTemplate = null;
            ganttObj.parentTaskbarTemplate = null;
            ganttObj.projectStartDate = new Date('10/23/2017');
            ganttObj.projectEndDate = new Date('12/30/2017');
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.' + cls.taskBarMainContainer) as HTMLElement).style.left).toBe("0px");
                ganttObj.chartRowsModule.refreshRecords([ganttObj.flatData[2]]);
                done();
            }
            ganttObj.refresh();
        });
        it('Aria-label testing', (done: Function) => {
            ganttObj.projectStartDate = new Date('10/15/2017');
            ganttObj.projectEndDate = new Date('12/30/2017');
            ganttObj.labelSettings.leftLabel = 'TaskId';
            ganttObj.labelSettings.rightLabel = 'TaskName';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div:nth-child(1)').getAttribute('aria-label').indexOf('Left task label 1') > -1).toBeTruthy();
                expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div:nth-child(2)').getAttribute('aria-label').indexOf('Name Task 1 Start Date 10/23/2017 End Date 11/6/2017 Duration 11 days') > -1).toBeTruthy();
                expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div:nth-child(3)').getAttribute('aria-label').indexOf('Right task label Task 1') > -1).toBeTruthy();
                done();
            }
            ganttObj.refresh();
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Gantt taskbar rendering actions', () => {
        let ganttObj: Gantt;

        (window as WindowDom).getheight = () => {
            return ganttObj.getTaskbarHeight();
        };

        interface WindowDom extends Window {
            getheight?: Function;
        }

        let lefttasklabel: Element = createElement('div', { id: 'lefttasklabelTS', styles: 'visibility:hidden' });
        lefttasklabel.innerHTML = '<div>Progress - ${Progress}%</div>';
        document.body.appendChild(lefttasklabel);

        let righttasklabel: Element = createElement('div', { id: 'righttasklabelTS', styles: 'visibility:hidden' });
        righttasklabel.innerHTML = '<div>Task Name  - ${TaskName}</div>';
        document.body.appendChild(righttasklabel);

        let indicatorlabel: Element = createElement('div', { id: 'indicatorTS', styles: 'visibility:hidden' });
        indicatorlabel.innerHTML = '<span>TS-Template : ${TaskName}</span>';
        document.body.appendChild(indicatorlabel);

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
                        child: 'Children',
                        cssClass: 'cusClass',
                        baselineStartDate: 'BaselineStartDate',
                        baselineEndDate: 'BaselineEndDate',
                        resourceInfo: 'resourceInfo',
                        indicators: 'Indicators'
                    },
                    projectStartDate: new Date('10/15/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    renderBaseline: true,
                    timelineSettings: {
                        bottomTier: {
                            unit: 'Day',
                            format: 'ddd, MMM',
                            count: 2
                        },
                        timelineUnitSize: 60
                    },
                    rowHeight: 40,
                    taskbarHeight: 30,
                    resourceIDMapping: 'resourceId',
                    resourceNameMapping: 'resourceName',
                    resources: resourceData,
                }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('Left/Right label with task property', (done: Function) => {
            ganttObj.queryTaskbarInfo = null;
            ganttObj.renderBaseline = true;
            ganttObj.taskbarHeight = 40;
            ganttObj.rowHeight = 50;
            ganttObj.baselineColor = 'blue';
            ganttObj.labelSettings.leftLabel = 'Progress';
            ganttObj.labelSettings.rightLabel = 'resourceInfo';
            ganttObj.labelSettings.taskLabel = 'TaskId';
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.' + cls.chartRow) as HTMLElement).offsetHeight).toBe(50);
                expect((ganttObj.element.querySelector('.' + cls.taskBarMainContainer) as HTMLElement).offsetHeight).toBe(40);
                expect((ganttObj.element.querySelector('.' + cls.baselineBar) as HTMLElement).style.backgroundColor).toBe("blue");
                expect((ganttObj.element.querySelector('.' + cls.baselineMilestoneContainer) as HTMLElement).style.backgroundColor).toBe("blue");
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.leftLabelContainer).textContent).toBe('80');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.rightLabelContainer).textContent).toBe('Robert King');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('2');
                done();
            }
            ganttObj.refresh();
        });
        it('Left/Right label with string template', (done: Function) => {
            ganttObj.labelSettings.leftLabel = '<div>${TaskName}</div>';
            ganttObj.labelSettings.rightLabel = '<div>${TaskId}</div>';
            ganttObj.dataBound = () => {
                setTimeout(() => {
                    expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.leftLabelContainer).textContent).toBe('Child task 1');
                    expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.rightLabelContainer).textContent).toBe('2');
                    // expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('2');
                    done();
                }, 500);
            }
            ganttObj.refresh();
        });
        it('Left/Right label with invalid task property', (done: Function) => {
            ganttObj.labelSettings.leftLabel = 'Custom';
            ganttObj.labelSettings.rightLabel = 'Custom';
            ganttObj.labelSettings.taskLabel = 'Custom';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.leftLabelContainer).textContent).toBe('Custom');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.rightLabelContainer).textContent).toBe('Custom');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('Custom');
                done();
            }
            ganttObj.refresh();
        });
        it('Left/Right label with template ID', (done: Function) => {
            ganttObj.labelSettings.leftLabel = '#lefttasklabelTS';
            ganttObj.labelSettings.rightLabel = '#righttasklabelTS';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.leftLabelContainer).textContent).toBe('Progress - 80%');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.rightLabelContainer).textContent).toBe('Task Name- Child task 1');
                // expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('Custom');
                done();
            }
            ganttObj.refresh();
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    })
});
describe('Manual Task', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData18,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                endDate: 'EndDate',
                dependency: 'Predecessor',
                child: 'Children',
                manual: 'isManual',
            },
            splitterSettings: {
                columnIndex: 3
            },
            projectStartDate: new Date('02/20/2017'),
            projectEndDate: new Date('03/30/2017'),
        }, done);
    });
    it('manual task convert into milestone', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.isMilestone).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Render taskbar duration in minutes ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData19,
            dateFormat: 'dd/MM/yyyy hh:mm a',
            taskFields: {
                id: 'taskID',
                name: 'taskName',
                startDate: 'startDate',
                endDate: 'endDate',
                duration: 'duration',
                progress: 'Progress',
                dependency: 'predecessor',
                resourceInfo: 'resources',
            },
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                },
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
                'Indent',
                'Outdent',
            ],
            allowSelection: true,
            gridLines: 'Both',
            height: '450px',
            treeColumnIndex: 1,
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
            },
            highlightWeekends: true,
            columns: [
                { field: 'taskID', width: 60 },
                { field: 'taskName', width: 250 },
                { field: 'startDate' },
                { field: 'endDate' },
                { field: 'duration' },
                { field: 'predecessor' },
                { field: 'progress' },
            ],
            eventMarkers: [
                { day: '4/17/2019', label: 'Project approval and kick-off' },
                { day: '5/3/2019', label: 'Foundation inspection' },
                { day: '6/7/2019', label: 'Site manager inspection' },
                { day: '7/16/2019', label: 'Property handover and sign-off' },
            ],
            labelSettings: {
                leftLabel: 'TaskName',
                rightLabel: 'resources',
            },
            splitterSettings: {
                columnIndex: 2,
            },
            editDialogFields: [
                { type: 'General', headerText: 'General' },
                { type: 'Dependency' },
                { type: 'Resources' },
                { type: 'Notes' },
            ]
        }, done);
    });
    it('Taskbar renders in minutes', () => {
        expect(ganttObj.currentViewData[3].ganttProperties.width.toFixed()).toBe('3');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Progress width not updated properly in split tasks issue', () => {
    let ganttObj: Gantt;
    const tempData: any = [
        {
            TaskID: 1,
            TaskName: 'Product concept',
            StartDate: new Date('2019-04-02'),
            EndDate: new Date('2019-04-03'),
            parentID: 0,
        },
        {
            TaskID: 2,
            TaskName: 'Defining the product and its usage',
            StartDate: new Date('02/04/2019 08:00'),
            Duration: 360,
            DurationUnit: 'minute',
            Progress: 10,
            parentID: 1,
            Segments: [
                {
                    StartDate: new Date('02/04/2019 08:00'),
                    Duration: 120,
                },
                {
                    StartDate: new Date('02/04/2019 11:00'),
                    Duration: 240,
                },
            ],
        },
        {
            TaskID: 3,
            TaskName: 'Defining target audience',
            StartDate: new Date('02/04/2019 08:00'),
            Progress: 10,
            parentID: 1,
            Duration: 240,
            DurationUnit: 'minute',
        },
        {
            TaskID: 4,
            TaskName: 'Prepare product sketch and notes',
            StartDate: new Date('02/04/2019 08:00'),
            Duration: 300,
            DurationUnit: 'minute',
            parentID: 1,
            Progress: 50,
        },
        {
            TaskID: 5,
            TaskName: 'Market research',
            StartDate: new Date('2019-04-02'),
            parentID: 0,
            EndDate: new Date('2019-04-03'),
        },
        {
            TaskID: 7,
            TaskName: 'Demand analysis',
            StartDate: new Date('2019-04-02T00:00:00.000'),
            Duration: 300,
            DurationUnit: 'minute',
            parentID: 5,
        },
    ];
    let virtualData1: any = [];
    let projId = 1;
    for (let i = 0; i < 50; i++) {
        let x = virtualData1.length + 1;
        let parent = {};
        parent['TaskID'] = x;
        parent['TaskName'] = 'Project' + projId++;
        virtualData1.push(parent);
        for (let j = 0; j < tempData.length; j++) {
            let subtasks = {};
            subtasks['TaskID'] = tempData[j].TaskID + x;
            subtasks['TaskName'] = tempData[j].TaskName;
            subtasks['StartDate'] = tempData[j].StartDate;
            subtasks['Duration'] = tempData[j].Duration;
            subtasks['Segments'] = tempData[j].Segments;

            subtasks['Progress'] = tempData[j].Progress;
            subtasks['parentID'] = tempData[j].parentID + x;
            virtualData1.push(subtasks);
        }
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: virtualData1,
                treeColumnIndex: 1,
                allowSorting: true,
                showOverAllocation: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    durationUnit: 'DurationUnit',
                    progress: 'Progress',
                    parentID: 'parentID',
                    segments: 'Segments',
                },
                enableVirtualization: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                durationUnit: 'Minute',
                workWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                ],
                timelineSettings: {
                    showTooltip: true,
                    timelineViewMode: 'Day',
                },
                dayWorkingTime: [{ from: 0, to: 24 }],
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                labelSettings: {
                    taskLabel: 'Progress',
                },
                allowSelection: true,
                highlightWeekends: true,
                gridLines: 'Both',
                height: '450px',
                allowResizing: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false,
                },
                tooltipSettings: {
                    showTooltip: true,
                },
                taskbarHeight: 20,
                rowHeight: 40,
                splitterSettings: {
                    columnIndex: 3,
                },
                projectEndDate: new Date('02/09/2019'),
                projectStartDate: new Date('02/04/2019'),
            }, done);
    });
    it('check progress width', () => {
        expect(ganttObj.currentViewData[2].ganttProperties.segments[0].progressWidth).toBe(19.8);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Bug-834012-Incorrect taskbar render when unit is given in hour', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData20,
            dateFormat: 'dd/MM/yyyy hh:mm a',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                child: 'subtasks',
                durationUnit: 'DurationUnit'
            },
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                },
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            allowSelection: true,
            gridLines: 'Both',
            height: '450px',
            treeColumnIndex: 1,
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
            },
            highlightWeekends: true,
            columns: [
                { field: 'TaskID', width: 60 },
                { field: 'TaskName', width: 250 },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
            ],
            splitterSettings: {
                columnIndex: 2,
            },
        }, done);
    });
    it('Taskbar renders in hour mode & Minute mode', () => {
        //Checking taskbar width in "Hour" mode:
        expect(ganttObj.currentViewData[0].ganttProperties.width.toFixed()).toBe('429');
        //Checking taskbar width in "Minute" mode:
        expect(ganttObj.currentViewData[1].ganttProperties.width.toFixed()).toBe('186');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('CR-834869-Segment taskbar is not rendered correctly ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                height: '450px',
            }, done);
    });
    it('Verifying 2nd segments enddate', () => {
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.segments[1].endDate, 'M/d/yyyy')).toBe('9/27/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('bug-833211-Render incorrect taskbarwidth with duration in minutes mode', () => {
    let ganttObj: Gantt;
    let datas: any = [
        {
            taskID: 1,
            taskName: 'Estimation approval',
            startDate: new Date('04/04/2019'),
            duration: '960 minutes'
        },
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: datas,
            dateFormat: 'dd/MM/yyyy hh:mm a',
            taskFields: {
                id: 'taskID',
                name: 'taskName',
                startDate: 'startDate',
                endDate: 'endDate',
                duration: 'duration',
            },
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                },
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            allowSelection: true,
            gridLines: 'Both',
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            columns: [
                { field: 'taskID', width: 60 },
                { field: 'taskName', width: 250 },
                { field: 'startDate' },
                { field: 'endDate' },
                { field: 'duration' },
            ],
            labelSettings: {
                leftLabel: 'TaskName',
                rightLabel: 'resources',
            },
            splitterSettings: {
                columnIndex: 2,
            },
        }, done);
    });
    it('Verifying taskbar width in minutes mode', () => {
        //Checking taskbar width in "Minutes" mode:
        expect(ganttObj.currentViewData[0].ganttProperties.width.toFixed()).toBe('66');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Border is changed to outline in CSS', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData,
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
                    resourceInfo: 'resources',
                },
                editSettings: {
                    allowEditing: true
                },
                splitterSettings: {
                    columnIndex: 2,
                },
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
                queryTaskbarInfo(args) {
                    args.taskbarBorderColor = 'red';
                }
            }, done);
    });
    it('check border color', () => {
        expect((ganttObj.element.querySelector('.' + cls.parentTaskBarInnerDiv) as HTMLElement).style.outlineColor).toBe("red");
        expect((ganttObj.element.querySelector('.' + cls.childTaskBarInnerDiv) as HTMLElement).style.outlineColor).toBe("red");
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Style not applied for the collapsed row when the virtual scroll is enabled', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData21,
                resources: [{ resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' }],
                viewType: 'ResourceView',
                enableMultiTaskbar: true,
                showOverAllocation: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    work: 'work',
                    expandState: 'isExpand',
                    child: 'subtasks',
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
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
                labelSettings: {
                    taskLabel: 'TaskName',
                },
                splitterSettings: {
                    columnIndex: 2,
                },
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019'),
                enableVirtualization: true,
                queryTaskbarInfo(args: any) {
                    args.taskbarBgColor = 'rgb(242, 210, 189)';
                    args.progressBarBgColor = 'rgb(201, 169, 166)';
                },
            }, done);
    });
    it('Style not applied for the collapsed row when the virtual scroll is enabled', (done: Function) => {
        ganttObj.ganttChartModule.expandCollapseAll('collapse');
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === 'refresh') {
                setTimeout(() => {
                    expect((ganttObj.element.querySelector('.' + cls.childTaskBarInnerDiv) as HTMLElement).style.backgroundColor).toBe('rgb(242, 210, 189)');
                    done();
                }, 100);
            }
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Manual parent does not render properly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData4,
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                selectedRowIndex: 2,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Custom',
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowRowDragAndDrop: true,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', visible: true },
                    { field: 'TaskName' },
                    { field: 'isManual' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' }
                ],
                validateManualTasksOnLinking: true,
                treeColumnIndex: 1,
                allowReordering: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                gridLines: "Both",
                showColumnMenu: true,
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
    });
    it('Convert manual milestone to parent task', () => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === 'refresh') {
                expect(ganttObj.currentViewData[0].ganttProperties.width).toBe(33);
            }
        }
        ganttObj.indent();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('parent drag for custom task mode', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData5,
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                selectedRowIndex: 2,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Custom',
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowRowDragAndDrop: true,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', visible: true },
                    { field: 'TaskName' },
                    { field: 'isManual' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' }
                ],
                validateManualTasksOnLinking: true,
                treeColumnIndex: 1,
                allowReordering: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                gridLines: "Both",
                showColumnMenu: true,
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017')
            }, done);
    });
    it('Convert manual milestone to parent task', () => {
        ganttObj.taskbarEditing = (args: any) => {
            expect(args.taskBarEditAction).toBe('ParentDrag');
            args.cancel = true;
        };
        ganttObj.dataBind();
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-869856: dayWorkingTime and TimeZone issue', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData22,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate'
            },
            dayWorkingTime: [
                { from: 8.5, to: 13 },
                { from: 14, to: 17.5 },
            ],
            timezone: "UTC",
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                },
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            allowSelection: true,
            gridLines: 'Both',
            height: '450px',
            highlightWeekends: true,
            splitterSettings: {
                columnIndex: 2,
            },
        }, done);
    });
    it('Checking Taskbar width timeZone API', () => {
        expect(ganttObj.currentViewData[2].ganttProperties.width).toBe(28.875);
        expect(ganttObj.currentViewData[1].ganttProperties.width).toBe(33);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Merge segment getting console error', () => {
    let ganttObj: Gantt;
    let datas1: any = [{

        TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
        Duration: 3, Progress: '60',
        Segments: [
            { StartDate: new Date('02/04/2019'), Duration: 1 },
            { StartDate: new Date('02/05/2019'), Duration: 2 },

        ]
    },]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: datas1,
            allowSorting: true,
            allowReordering: true,
            enableContextMenu: true,
            enableVirtualization: false,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                segments: 'Segments'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', width: 60 },
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' }
            ],
            sortSettings: {
                columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan',],
            allowExcelExport: true,
            allowPdfExport: true,
            allowSelection: true,
            allowRowDragAndDrop: true,
            selectedRowIndex: 1,
            splitterSettings: {
                position: "50%",
                // columnIndex: 4
            },
            selectionSettings: {
                mode: 'Row',
                type: 'Single',
                enableToggle: false
            },
            tooltipSettings: {
                showTooltip: true
            },
            filterSettings: {
                type: 'Menu'
            },
            allowFiltering: true,
            gridLines: "Both",
            showColumnMenu: true,
            highlightWeekends: true,
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            eventMarkers: [
                {
                    day: '04/10/2019',
                    cssClass: 'e-custom-event-marker',
                    label: 'Project approval and kick-off'
                }
            ],
            holidays: [{
                from: "04/04/2019",
                to: "04/05/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"

            },
            {
                from: "04/12/2019",
                to: "04/12/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"

            }],
            searchSettings:
            {
                fields: ['TaskName', 'Duration']
            },
            labelSettings: {
                leftLabel: 'TaskID',
                rightLabel: 'Task Name: ${taskData.TaskName}',
                taskLabel: '${Progress}%'
            },
            allowResizing: true,
            readOnly: false,
            taskbarHeight: 20,
            rowHeight: 40,
            height: '550px',
            projectStartDate: new Date('01/30/2019'),
            projectEndDate: new Date('03/04/2019'),
        }, done);
    });
    it('Marge task', () => {
        let dragElement: HTMLElement = document.getElementsByClassName('e-segment-last')[0] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        // console.log(ganttObj.currentViewData[0].ganttProperties.segments)
        expect(ganttObj.currentViewData[0].ganttProperties.segments).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('manual parent right resizing ', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: manualParentdata,
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Custom',
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                enableVirtualization: true,
                allowExcelExport: true,
                allowPdfExport: true,
                allowRowDragAndDrop: true,
                splitterSettings: {
                    position: "50%",
                    // columnIndex: 4
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', visible: true },
                    { field: 'TaskName' },
                    { field: 'isManual' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' }
                ],
                validateManualTasksOnLinking: true,
                treeColumnIndex: 1,
                allowReordering: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                gridLines: "Both",
                showColumnMenu: true,
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('Right resizing', () => {
        ganttObj.actionBegin = (args: object) => { };
        ganttObj.taskbarEditing = (args: any) => {
            expect(args.taskBarEditAction).toBe('ParentResizing');
        };
        ganttObj.taskbarEdited = (args: any) => {
            expect(args.taskBarEditAction).toBe('ParentResizing');
            expect(ganttObj.currentViewData[1].taskData['Duration']).toBe(5);
        };
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-manualparent-main-container >div.e-gantt-manualparenttaskbar-right') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-899690: Left value miscalculated for taskbar while duration in decimals duration', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: CR899690,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            dateFormat: 'MMM dd, y',
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            allowSelection: true,
            gridLines: "Both",
            height: '450px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('04/03/2024'),
            projectEndDate: new Date('07/28/2024'),
        }, done);
    });
    it('Checking Taskbar left with decimal duration', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.left).toBe(33);
        expect(Math.floor(ganttObj.currentViewData[2].ganttProperties.left)).toBe(59);
        expect(Math.floor(ganttObj.currentViewData[4].ganttProperties.left)).toBe(59);
        expect(Math.floor(ganttObj.currentViewData[6].ganttProperties.left)).toBe(59);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Add dependency', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: addDependency,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                gridLines: "Both",
                height: '450px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('Add a predecessor to Task 2', () => {
        ganttObj.addPredecessor(2, '1FS');
        var updatedTask = ganttObj.getRecordByID('2');
        if (updatedTask && updatedTask.ganttProperties) {
            expect(updatedTask.ganttProperties.predecessorsName).toBe('1FS');
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
