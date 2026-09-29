/**
 * Gantt taskbar spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, IQueryTaskbarInfoEventArgs } from '../../src/index';
import * as cls from '../../src/gantt/base/css-constants';
import { baselineData, resourceData, projectData, projectNewData18, projectNewData19, projectNewData20, splitData, projectNewData21, taskModeData4, taskModeData5, projectNewData22, CR899690, addDependency, manualParentdata, CR991733, CR1005919, CRres1005919, CR1017044 } from './data-source.spec';
import * as utils from '../../src/gantt/base/utils';
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
        it('Left/Right label with task property', () => {
            ganttObj.queryTaskbarInfo = null;
            ganttObj.renderBaseline = true;
            ganttObj.taskbarHeight = 40;
            ganttObj.rowHeight = 50;
            ganttObj.baselineColor = 'blue';
            ganttObj.labelSettings.leftLabel = 'Progress';
            ganttObj.labelSettings.rightLabel = 'resourceInfo';
            ganttObj.labelSettings.taskLabel = 'TaskId';
            ganttObj.dataBound = () => {
                setTimeout(() => {
                    expect((ganttObj.element.querySelector('.' + cls.chartRow) as HTMLElement).offsetHeight).toBe(50);
                    expect((ganttObj.element.querySelector('.' + cls.taskBarMainContainer) as HTMLElement).offsetHeight).toBe(40);
                    expect((ganttObj.element.querySelector('.' + cls.baselineBar) as HTMLElement).style.backgroundColor).toBe("blue");
                    expect((ganttObj.element.querySelector('.' + cls.baselineMilestoneContainer) as HTMLElement).style.backgroundColor).toBe("blue");
                    expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.leftLabelContainer).textContent).toBe('80');
                    expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.rightLabelContainer).textContent).toBe('Robert King');
                    expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('2');
                }, 100);
            }
        });
        it('Left/Right label with string template', () => {
            ganttObj.labelSettings.leftLabel = '<div>${TaskName}</div>';
            ganttObj.labelSettings.rightLabel = '<div>${TaskId}</div>';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.leftLabelContainer).textContent).toBe('Child task 1');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.rightLabelContainer).textContent).toBe('2');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('2');
            }
        });
        it('Left/Right label with invalid task property', () => {
            ganttObj.labelSettings.leftLabel = 'Custom';
            ganttObj.labelSettings.rightLabel = 'Custom';
            ganttObj.labelSettings.taskLabel = 'Custom';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.leftLabelContainer).textContent).toBe('Custom');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.rightLabelContainer).textContent).toBe('Custom');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('Custom');
            }
        });
        it('Left/Right label with template ID', () => {
            ganttObj.labelSettings.leftLabel = '#lefttasklabelTS';
            ganttObj.labelSettings.rightLabel = '#righttasklabelTS';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.leftLabelContainer).textContent).toBe('Progress - 80%');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.rightLabelContainer).textContent).toBe('Task Name- Child task 1');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('Custom');
            }
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
        expect((ganttObj.element.querySelector('.' + cls.childTaskBarInnerDiv) as HTMLElement).style.outlineColor).toBe("red");;
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
    it('Style not applied for the collapsed row when the virtual scroll is enabled', () => {
        ganttObj.ganttChartModule.expandCollapseAll('collapse');
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === 'refresh') {
                expect((ganttObj.element.querySelector('.' + cls.childTaskBarInnerDiv) as HTMLElement).style.backgroundColor).toBe('rgb(242, 210, 189)');
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
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(5);
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
    it('Add a predecessor to Task 3', () => {
        ganttObj.allowParentDependency =false;
        ganttObj.flatData[2].ganttProperties.predecessorsName = "";
        ganttObj.addPredecessor(3, '1FS');
        var updatedTask = ganttObj.getRecordByID('3');
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
describe('MT:943439- Code coverage for resourceview offset calculate', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Project initiation',
                    StartDate: new Date('03/29/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        {
                            TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                            Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                        },
                        {
                            TaskID: 3, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                            resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                        }
                    ]
                }
            ],
            resources: [
                { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'}
            ],
            viewType: 'ResourceView', 
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                resourceInfo: 'resources',
                child: 'subtasks'
            },
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit',
                group: 'resourceGroup'
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
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Verifying the offset call for resource view', () => {
        ganttObj.predecessorModule['calculateOffset'](ganttObj.currentViewData[1]);
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].offset).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-991733-Right label not rendered when multitaskbar is enabled and record is collapsed', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
            dataSource: CR991733,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            allowSelection: true,
            gridLines: "Both",
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                rightLabel: 'TaskID',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Verifying the rightlabel while multi-taskbar is enabled', () => {
        let collapseallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_collapseall') as HTMLElement;
        triggerMouseEvent(collapseallToolbar, 'click');
        let rightLabelElement: HTMLElement = ganttObj.chartPane.querySelectorAll('.e-label')[1] as HTMLElement;
        expect(rightLabelElement.innerText).toBe('1');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-1005919: Dynamically changing values are not reflected in actionBegin event', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR1005919,
                resources: CRres1005919,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'ParentId',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                resourceFields : {
                    id: 'resourceId',
                    name: 'resourceName',
                },
                actionBegin(args) {
                    if (args.requestType == 'beforeSave' && args.data.Duration < 1) {
                        // dynamic changing values here
                        args.data.Duration = 1;
                    }
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'End Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }
                ],
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('check if task left resize, will updates actionBegins duration value', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -400, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate, 'M/dd/yyyy HH:mm')).toBe('4/02/2025 17:00');
        expect(ganttObj.flatData[1].ganttProperties.duration).toBe(1);
        expect(ganttObj.flatData[1].ganttProperties.isMilestone).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-1017044: While using queryTaskbarInfo with enableMultiTaskbar taskbar customization is not applied while record collapse', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR1017044,
                treeColumnIndex: 1,
                allowTaskbarOverlap: false,
                queryTaskbarInfo(e) {
                    e.taskbarBgColor = '#ffff00';
                    e.taskbarBorderColor = '#cccc00';
                    e.progressBarBgColor = '#cccc00';
                },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    parentID: 'ParentID',
                },
                allowSelection: true,
                gridLines: "Both",
                height: '550px',
                enableMultiTaskbar: true,
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Style not applied for the collapsed row when the multi-taskbar is enabled', () => {
        ganttObj.ganttChartModule.expandCollapseAll('collapse');
        let childTaskbar: HTMLElement = ganttObj.element.querySelectorAll('.' + cls.traceChildTaskBar)[1] as HTMLElement;
        expect(childTaskbar.style.backgroundColor).toBe('rgb(255, 255, 0)');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Split task segment start date validation', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'UI Wireframing',
                    StartDate: new Date('2026-04-06 09:20:00'),
                    EndDate: new Date('2026-04-14 19:00:00'),
                    Progress: 75,
                    Segments: [
                        {
                            StartDate: new Date('2026-04-06 09:20:00'),
                            EndDate: new Date('2026-04-07 07:30:00'),
                        },
                        {
                            StartDate: new Date('2026-04-08 10:00:00'),
                            EndDate: new Date('2026-04-08 15:00:00'),
                        },
                        {
                            StartDate: new Date('2026-04-10 09:00:00'),
                            EndDate: new Date('2026-04-10 17:00:00'),
                        }
                    ],
                }],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                segments: 'Segments'
            },
            height: '450px',
            projectStartDate: new Date('2026-04-01'),
            projectEndDate: new Date('2026-04-20')
        }, done);
    });

    afterAll(() => {
        destroyGantt(ganttObj);
    });

    it('should render segment start dates correctly', () => {
        const ganttSegments: any[] =
            ganttObj.flatData[0].ganttProperties.segments;
        expect(ganttSegments.length).toBe(3);
        expect(ganttSegments[0].startDate.getTime()).toBe( new Date('2026-04-06 09:20:00').getTime());
        expect(ganttSegments[1].startDate.getTime()).toBe( new Date('2026-04-08 10:00:00').getTime());
        expect(ganttSegments[2].startDate.getTime()).toBe(new Date('2026-04-10 09:00:00').getTime());
    });
});
describe('Spec to cover branches', () => {
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
                allowRowDragAndDrop: true,
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
    it('should set position from dropPosition in ProjectView', () => {
        const rowElement: HTMLTableRowElement = document.createElement('tr');
        ganttObj.rowDragAndDropModule = {
            dropPosition: 'below',
            reorderRows: jasmine.createSpy('reorderRows')
        } as any;
        const draggedRecord: any = {
            index: 0,
            hasChildRecords: false
        };
        const droppedRecord: any = {
            index: 1,
            hasChildRecords: false,
            childRecords: [],
            parentItem: null
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = draggedRecord;
        spyOn(ganttObj.ganttChartModule, 'getChartRows')
            .and.returnValue([rowElement]);
        spyOn(ganttObj, 'getRootParent')
            .and.callFake((record: any) => {
                return {
                    index: record.index
                };
            });
        spyOn(ganttObj, 'trigger');
        ganttObj.flatData = [draggedRecord, droppedRecord];
        ganttObj.editModule.taskbarEditModule['handleRowDrop'](rowElement, [droppedRecord], 1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
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
                allowRowDragAndDrop: true,
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
    it('should update dstStart and dstEnd when timezone offset changes', () => {
        spyOn(Date.prototype, 'getTimezoneOffset').and.callFake(function (this: Date): number {
            const month = this.getMonth();
            // Jan-Mar
            if (month < 3) {
                return 120;
            }
            // Apr-Sep
            if (month < 9) {
                return 60;
            }
            // Oct-Dec
            return 120;
        });
        ganttObj.editModule.taskbarEditModule['getDSTTransitions'](2024);
    });
    it('should return true when timelineStartDate is before dstStart', () => {
        const calculatedDate = new Date('2024-06-01');
        const timelineStartDate = new Date('2024-01-01');
        const pStartDate = new Date('2024-01-01');
        spyOn(ganttObj, 'isInDst').and.returnValue(true);
        ganttObj.editModule.taskbarEditModule['shouldAdjustForDst'](
            calculatedDate,
            timelineStartDate,
            pStartDate
        );
    });
    it('should calculate left position for ConnectorPointLeftDrag RTL', () => {
        ganttObj.enableRtl = true;
        ganttObj.editModule.taskbarEditModule.taskBarEditAction =
            'ConnectorPointLeftDrag';
        ganttObj.editModule.taskbarEditModule['drawFalseLine']();
    });
    it('should calculate right position for ConnectorPointRightDrag RTL', () => {
        ganttObj.enableRtl = true;
        ganttObj.editModule.taskbarEditModule.taskBarEditAction =
            'ConnectorPointRightDrag';
        ganttObj.editModule.taskbarEditModule['drawFalseLine']();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
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
                allowRowDragAndDrop: true,
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
    it('should remove connector highlight when parent dependency is allowed', () => {
        ganttObj.allowParentDependency = true;
        const connectorElement = document.createElement('div');
        const left = document.createElement('div');
        left.className = 'e-connectorpoint-left';
        const right = document.createElement('div');
        right.className = 'e-connectorpoint-right';
        connectorElement.appendChild(left);
        connectorElement.appendChild(right);
        ganttObj.editModule.taskbarEditModule.connectorSecondRecord = {
            hasChildRecords: true
        } as any;
        spyOn((ganttObj.editModule.taskbarEditModule as any), 'getElementByPosition')
            .and.returnValue(document.createElement('div'));
        ganttObj.editModule.taskbarEditModule.connectorSecondElement =
            connectorElement;
        spyOn(
            ganttObj.editModule.taskbarEditModule['editTooltip'],
            'showHideTaskbarEditTooltip'
        );
        ganttObj.editModule.taskbarEditModule.updateConnectorLineSecondProperties({} as any);
    });
    it('should calculate zoomedPageY when parent has zoom style', () => {
        const zoomParent = document.createElement('div');
        zoomParent.style.zoom = '2';
        const ganttElement = document.createElement('div');
        zoomParent.appendChild(ganttElement);
        document.body.appendChild(zoomParent);
        ganttObj.element = ganttElement;
        spyOn((ganttObj.editModule.taskbarEditModule as any), 'getElementByPosition')
            .and.returnValue(document.createElement('div'));
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: {
                taskId: 1,
                rowUniqueID: 1
            }
        } as any;
        (ganttObj.editModule.taskbarEditModule.connectorSecondRecord as any) = null;
        ganttObj.editModule.taskbarEditModule['triggerDependencyEvent'](
            {
                pageY: 100
            } as any,
            false
        );
    });
    it('should return when connectorSecondRecord is null', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: {
                taskId: 1,
                rowUniqueID: 1
            }
        } as any;
        (ganttObj.editModule.taskbarEditModule.connectorSecondRecord as any) = null;
        ganttObj.editModule.taskbarEditModule['triggerDependencyEvent']({
            pageY: 100
        } as any, false);
    });
    it('should update connectedRecords and enable undo toolbar item', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditAction = 'ConnectorPointRightDrag';
        ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
        ganttObj.editModule.taskbarEditModule.finalPredecessor = '2FS';
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: {
                taskId: 1
            }
        } as any;
        ganttObj.editModule.taskbarEditModule.connectorSecondRecord = {
            hasChildRecords: true,
            ganttProperties: {
                taskId: 2
            }
        } as any;
        ganttObj.allowParentDependency = true;
        ganttObj.controlId = 'Gantt';
        ganttObj.undoRedoModule = {
            getUndoCollection: [{}]
        } as any;
        ganttObj.toolbarModule = {
            enableItems: jasmine.createSpy('enableItems')
        } as any;
        spyOn(
            ganttObj.connectorLineEditModule,
            'updatePredecessor'
        );
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 10;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 10;
        ganttObj.editModule.taskbarEditModule.taskBarEditElement =
            document.createElement('div');
        ganttObj.ganttChartModule.chartBodyContainer =
            document.createElement('div');
        ganttObj.editModule.taskbarEditModule.taskBarEditedAction({} as any);
    });
    it('should adjust DST and add one hour when DST condition matches', () => {
        ganttObj.perDayWidth = 100;
        ganttObj.timelineSettings = {
            showWeekend: true
        } as any;
        ganttObj.timelineModule = {
            timelineStartDate: new Date('2024-06-01'),
            topTier: 'Day',
            bottomTier: 'None'
        } as any;
        ganttObj.editModule.taskbarEditModule.getDateByLeft(
            48,
            false,
            {} as any
        );
    });
    it('should return valid when predecessor date is not available', () => {
        const record: any = {
            ganttProperties: {
                startDate: new Date('2024-01-02'),
                rowUniqueID: 1,
                predecessor: [{
                    from: '1',
                    to: '2'
                }]
            }
        };
        ganttObj.editModule.taskbarEditModule['isValidDependency'](record);
    });
    it('should skip predecessor when gantt record is not available', () => {
        const predecessors: any[] = [{
            from: 1,
            type: 'FS'
        }];
        spyOn(ganttObj, 'getRecordByID')
            .and.returnValue(null);
        const result = ganttObj.editModule.taskbarEditModule['extractEndDates'](predecessors);
        expect(result.maxEndDate.getTime()).toBe(new Date(0).getTime());
    });
    it('should use startDate when endDate is not available for FF dependency', () => {
        const startDate = new Date('2024-01-10');
        const predecessors: any[] = [{
            from: 1,
            type: 'FF'
        }];
        spyOn(ganttObj, 'getRecordByID').and.returnValue({
            ganttProperties: {
                endDate: null,
                startDate: startDate
            }
        });
        const result = ganttObj.editModule.taskbarEditModule['extractEndDates'](predecessors);
        expect(result.maxEndDate.getTime())
            .toBe(startDate.getTime());
    });
    it('should use endDate when startDate is not available for SF dependency', () => {
        const endDate = new Date('2024-01-20');
        const predecessors: any[] = [{
            from: 1,
            type: 'SF'
        }];
        spyOn(ganttObj, 'getRecordByID').and.returnValue({
            ganttProperties: {
                startDate: null,
                endDate: endDate
            }
        });
        const result = ganttObj.editModule.taskbarEditModule['extractEndDates'](predecessors);
        expect(result.maxEndDate.getTime())
            .toBe(endDate.getTime());
    });
    it('should use previousMouseMove while resizing segmented taskbar to left', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.editModule.taskbarEditModule['previousMouseMove'] = 200;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 250;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 150;
        ganttObj.editModule.taskbarEditModule.previousItem = {width: 240};
        const item: any = {
            left: 0,
            segments: [{
                left: 10,
                width: 100
            }]
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = document.createElement('div');
        ganttObj.editModule.taskbarEditModule.taskBarEditElement.classList.add('e-segmented-taskbar')
        ganttObj.editModule.taskbarEditModule['enableRightResizing']({} as any);
        expect(ganttObj.editModule.taskbarEditModule['previousMouseMove']).toBe(200);
    });
    it('should use timelineUnitSize when topTier unit is Minutes', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 100;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 0;
        ganttObj.timelineModule = {
            isSingleTier: true,
            customTimelineSettings: {
                timelineUnitSize: 40,
                topTier: {
                    unit: 'Minutes'
                },
                bottomTier: {
                    unit: 'Day'
                }
            }
        } as any;
        const item: any = {
            left: 0,
            segments: [{
                left: 20,
                width: 100
            }]
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        const ele = document.createElement('div');
        ele.classList.add('e-segmented-taskbar');
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ele;
        ganttObj.editModule.taskbarEditModule['enableRightResizing']({} as any);
    });
    it('should use previousMouseMove while expanding segmented taskbar', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.editModule.taskbarEditModule['previousMouseMove'] = 150;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 100;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 200;
        const item: any = {
            left: 0,
            segments: [{
                left: 10,
                width: 100
            }]
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        const ele = document.createElement('div');
        ele.classList.add('e-segmented-taskbar');
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ele;
        ganttObj.editModule.taskbarEditModule['enableRightResizing']({} as any);
        expect(ganttObj.editModule.taskbarEditModule['previousMouseMove']).toBe(150);
    });
    it('should reduce width for normal taskbar right resize', () => {
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 150;
        ganttObj.editModule.taskbarEditModule.previousItem = {
            width: 100
        } as any;
        const item: any = {
            left: 50,
            width: 100
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        ganttObj.editModule.taskbarEditModule.taskBarEditElement =
            document.createElement('div');
        ganttObj.editModule.taskbarEditModule['enableRightResizing']({} as any);
    });
    it('should update single segment width', () => {
        const item: any = {
            left: 10,
            width: 120,
            segments: [{
                width: 10
            }]
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        ganttObj.editModule.taskbarEditModule.taskBarEditElement =
            document.createElement('div');
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 100;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 110;
        ganttObj.editModule.taskbarEditModule.previousItem = {
            width: 120
        } as any;
        ganttObj.editModule.taskbarEditModule['enableRightResizing']({} as any);
        expect(item.segments[0].width)
            .toBe(item.width);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
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
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                },
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
                    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
                ],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                viewType: 'ResourceView',
                allowRowDragAndDrop: true,
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
    it('should set drop position as Invalid when dropping child record under resource view', () => {
        const droppedRecord: any = {
            index: 1,
            hasChildRecords: false,
            childRecords: [],
            parentItem: { taskId: 10 },
            level: 0
        };
        const draggedRecord: any = {
            index: 0,
            hasChildRecords: false,
            level: 0
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = draggedRecord;
        ganttObj.flatData = [draggedRecord, droppedRecord];
        ganttObj.rowDragAndDropModule = {
            dropPosition: 'child',
            reorderRows: jasmine.createSpy('reorderRows')
        } as any;
        ganttObj.editModule.taskbarEditModule['handleRowDrop'](
            ganttObj.ganttChartModule.getChartRows()[1],
            ganttObj.flatData,
            0
        );
        expect(ganttObj.rowDragAndDropModule['dropPosition'])
            .toBe('Invalid');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
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
            allowRowDragAndDrop: true,
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
    it('should update mouse coordinates when pageY exists and zoom is applied', () => {
        const zoomParent = document.createElement('div');
        zoomParent.style.zoom = '2';
        const ganttElement = document.createElement('div');
        zoomParent.appendChild(ganttElement);
        document.body.appendChild(zoomParent);
        ganttObj.element = ganttElement;
        ganttObj.ganttChartModule.chartBodyContainer =
            document.createElement('div');
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: {
                width: 2,
                isMilestone: false,
                progress: 0
            }
        } as any;
        ganttObj.editModule.taskbarEditModule['updateMouseMoveProperties']({} as any);
    });
    it('should use previousMouseMove while dragging segmented taskbar to left', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 1;
        ganttObj.editModule.taskbarEditModule['previousMouseMove'] = 200;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 250;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 150;
        const item: any = {
            left: 0,
            segments: [
                { left: 0, width: 50 },
                { left: 100, width: 50 }
            ]
        };
        ganttObj.taskFields.segments= 'segments';
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item,
            taskData:{segments: [
                { left: 0, width: 50 },
                { left: 100, width: 50 }
            ]}
        } as any;
        const ele = document.createElement('div');
        ele.classList.add('e-segmented-taskbar');
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ele;
        ganttObj.editModule.taskbarEditModule['enableDragging']({} as any);
        expect(ganttObj.editModule.taskbarEditModule['previousMouseMove']).toBe(150);
    });
    it('should use previousMouseMove while dragging segmented taskbar to right', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 1;
        ganttObj.editModule.taskbarEditModule['previousMouseMove'] = 120;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 100;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 180;
        const item: any = {
            left: 0,
            segments: [
                { left: 0, width: 50 },
                { left: 100, width: 50 }
            ]
        };
        ganttObj.taskFields.segments= 'segments';
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item,
            taskData:{segments: [
                { left: 0, width: 50 },
                { left: 100, width: 50 }
            ]}
        } as any;
        const ele = document.createElement('div');
        ele.classList.add('e-segmented-taskbar');
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ele;
        ganttObj.editModule.taskbarEditModule['enableDragging']({} as any);
        expect(ganttObj.editModule.taskbarEditModule['previousMouseMove']).toBe(180);
    });
    it('should set left to previous segment end in segment-inprogress mode', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 1;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 150;
        const item: any = {
            left: 0,
            segments: [
                { left: 0, width: 100 },
                { left: 80, width: 50 },
                { left: 200, width: 50 }
            ]
        };
        ganttObj.taskFields.segments= 'segments';
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item,
            taskData:{segments: [
                { left: 0, width: 100 },
                { left: 80, width: 50 },
                { left: 200, width: 50 }
            ]}
        } as any;
        const ele = document.createElement('div');
        ele.classList.add('e-segmented-taskbar');
        ele.classList.add('e-segment-inprogress');
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ele;
        ganttObj.editModule.taskbarEditModule['enableDragging']({} as any);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
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
            allowRowDragAndDrop: true,
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
    it('should set left as timelineWidth minus segmentWidth', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 1;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 100;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 200;
        ganttObj.timelineModule = {
            totalTimelineWidth: 300
        } as any;
        const item: any = {
            left: 200,
            segments: [
                { left: 0, width: 50 },
                { left: 120, width: 100 }
            ]
        };
        ganttObj.taskFields.segments= 'segments';
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item,
            taskData:{segments: [
                { left: 0, width: 50 },
                { left: 120, width: 100 }
            ]}
        } as any;
        const ele = document.createElement('div');
        ele.classList.add('e-segmented-taskbar');
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ele;
        ganttObj.editModule.taskbarEditModule['enableDragging']({} as any);
    });
    it('should update progress width while resizing from right to left', () => {
        const item: any = {
            left: 50,
            width: 100,
            progressWidth: 20
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 100;
        ganttObj.editModule.taskbarEditModule['performProgressResize']({} as any, 0);
        expect(item.progressWidth).toBe(50); // 100 - 50
    });
    it('should set progress width to full width when mouse exceeds task width', () => {
        const item: any = {
            left: 50,
            width: 100,
            progressWidth: 20
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 170; // >= 50 + 100
        ganttObj.editModule.taskbarEditModule['performProgressResize']({} as any, 0);
        expect(item.progressWidth).toBe(100);
    });
    it('should update progress width while dragging from left to right', () => {
        const item: any = {
            left: 50,
            width: 100,
            progressWidth: 20
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 100;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 120;
        ganttObj.editModule.taskbarEditModule['performProgressResize']({} as any, 0);
        expect(item.progressWidth).toBe(70); // 120 - 50
    });
    it('should restore previous progress width when segmentIndex is -1', () => {
        const item: any = {
            left: 50,
            width: 100,
            progressWidth: 30
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 100;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 120;

        ganttObj.editModule.taskbarEditModule['performProgressResize'](
            {} as any,
            -1
        );
        expect(item.progressWidth).toBe(30);
    });
    it('should update progress border radius when diff is less than or equal to 4', () => {
        const item: any = {
            left: 50,
            width: 100,
            progressWidth: 98
        };
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item
        } as any;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 198;
        ganttObj.editModule.taskbarEditModule['performProgressResize'](
            {} as any,
            0
        );
    });
    it('should update milestone field to false when width is greater than 3', () => {
        const item: any = {
            width: 10
        };
        ganttObj.taskFields = {
            milestone: 'Milestone'
        } as any;
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            Milestone: true
        } as any;
        ganttObj.editModule.taskbarEditModule['updateIsMilestone'](item);
    });
    it('should update milestone field to false when width is lesser than 3', () => {
        const item: any = {
            width: 2
        };
        ganttObj.taskFields = {
            milestone: 'Milestone'
        } as any;
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            Milestone: true
        } as any;
        ganttObj.editModule.taskbarEditModule['updateIsMilestone'](item);
    });
    it('should use mouseDownX and mouseMoveX when previousMouseMove is undefined', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        (ganttObj.editModule.taskbarEditModule['previousMouseMove'] as any) = null;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 250;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 200;
        const item: any = {
            left: 10,
            segments: [
                {
                    left: 20,
                    width: 50
                }
            ]
        };
        ganttObj.taskFields.segments= 'segments';
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item,
            taskData:{segments: [
                {
                    left: 20,
                    width: 50
                }
            ]}
        } as any;
        ganttObj.editModule.taskbarEditModule['enableSplitTaskLeftResize'](item);
        expect(ganttObj.editModule.taskbarEditModule['previousMouseMove']).toBe(200);
    });
    it('should use previousMouseMove when resizing split task to left', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.editModule.taskbarEditModule['previousMouseMove'] = 200;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 250;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 150;
        const item: any = {
            left: 10,
            segments: [
                {
                    left: 20,
                    width: 100
                }
            ]
        };
        ganttObj.taskFields.segments= 'segments';
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: item,
            taskData:{segments: [
                {
                    left: 20,
                    width: 100
                }
            ]}
        } as any;
        ganttObj.editModule.taskbarEditModule['enableSplitTaskLeftResize'](item);
        expect(ganttObj.editModule.taskbarEditModule['previousMouseMove']).toBe(150);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
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
            allowRowDragAndDrop: true,
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
    it('should use changedTouches pageY when event type is not mousemove', () => {
        const cloneTaskbar = document.createElement('div');
        cloneTaskbar.className = 'e-clone-taskbar';
        document.body.appendChild(cloneTaskbar);
        const target = document.createElement('div');
        const row = document.createElement('tr');
        row.setAttribute('aria-rowindex', '1');
        row.setAttribute('data-uid', '2');
        const draggedRow = document.createElement('tr');
        draggedRow.setAttribute('data-uid', '1');
        ganttObj.editModule.taskbarEditModule['draggedTreeGridRowElement'] =
            draggedRow;
        ganttObj.editModule.taskbarEditModule['draggedTreeGridRowHeight'] = 30;
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            ganttProperties: {
                segments: [{}]
            }
        } as any;
        const event: any = {
            type: 'touchmove',
            changedTouches: [{
                pageY: 100
            }]
        };
        ganttObj.currentViewData = [{
            hasChildRecords: true
        }] as any;
        ganttObj.rowDragAndDropModule = {
            dropPosition: ''
        } as any;
        ganttObj.editModule.taskbarEditModule['processDropPosition'](
            event,
            target,
            row
        );
        expect(event.changedTouches[0].pageY).toBe(100);
        document.body.removeChild(cloneTaskbar);
    });
    it('should set drop position as child for middle segment', () => {
        const cloneTaskbar = document.createElement('div');
        cloneTaskbar.className = 'e-clone-taskbar';
        document.body.appendChild(cloneTaskbar);
        const row = document.createElement('tr');
        row.setAttribute('aria-rowindex', '1');
        row.setAttribute('data-uid', '2');
        const draggedRow = document.createElement('tr');
        draggedRow.setAttribute('data-uid', '1');
        ganttObj.editModule.taskbarEditModule['draggedTreeGridRowElement'] = draggedRow;
        ganttObj.editModule.taskbarEditModule['draggedTreeGridRowHeight'] = 30;
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            hasChildRecords: true,
            ganttProperties: {
                segments: [{}]
            }
        } as any;
        ganttObj.currentViewData = [{
            hasChildRecords: true
        }] as any;
        ganttObj.rowDragAndDropModule = {
            dropPosition: ''
        } as any;
        const target = document.createElement('div');
        spyOn(utils, 'parentsUntil').and.returnValue(target);
        spyOn(ganttObj.treeGrid, 'getRows')
            .and.returnValue([row]);
        spyOn(ganttObj.treeGrid, 'getHeaderContent')
            .and.returnValue({
                offsetHeight: 0
            } as any);
        spyOn(ganttObj.treeGrid, 'getContent')
            .and.returnValue({
                firstElementChild: {
                    scrollTop: 0
                }
            } as any);
        spyOn(ganttObj, 'getOffsetRect')
            .and.returnValue({
                top: 0,
                left: 0
            } as any);
        spyOn(ganttObj, 'getRowByIndex')
            .and.returnValue({
                rowIndex: 0,
                children: []
            } as any);
        spyOn(
            ganttObj.editModule.taskbarEditModule as any,
            'ensurePosition'
        );
        spyOn(
            ganttObj.editModule.taskbarEditModule as any,
            'addRemoveClasses'
        );
        spyOn(
            ganttObj.editModule.taskbarEditModule as any,
            'removetopOrBottomBorder'
        );
        const event: any = {
            type: 'mousemove',
            pageY: 15
        };
        ganttObj.editModule.taskbarEditModule['processDropPosition'](
            event,
            target,
            row
        );
        expect(ganttObj.rowDragAndDropModule['dropPosition']).toBe('child');
        document.body.removeChild(cloneTaskbar);
    });
    it('should set drop position as below for bottom segment', () => {
        const cloneTaskbar = document.createElement('div');
        cloneTaskbar.className = 'e-clone-taskbar';
        document.body.appendChild(cloneTaskbar);
        const row = document.createElement('tr');
        row.setAttribute('aria-rowindex', '1');
        row.setAttribute('data-uid', '2');
        const draggedRow = document.createElement('tr');
        draggedRow.setAttribute('data-uid', '1');
        ganttObj.editModule.taskbarEditModule['draggedTreeGridRowElement'] = draggedRow;
        ganttObj.editModule.taskbarEditModule['draggedTreeGridRowHeight'] = 90;
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            hasChildRecords: true,
            ganttProperties: {
                segments: [{}]
            }
        } as any;
        const target = document.createElement('div');
        ganttObj.currentViewData = [{
            hasChildRecords: true
        }] as any;
        ganttObj.rowDragAndDropModule = {
            dropPosition: ''
        } as any;
        spyOn(utils, 'parentsUntil')
            .and.returnValue(document.createElement('div'));
        spyOn(ganttObj.treeGrid, 'getRows')
            .and.returnValue([row]);
        spyOn(ganttObj.treeGrid, 'getHeaderContent')
            .and.returnValue({
                offsetHeight: 0
            } as any);
        spyOn(ganttObj.treeGrid, 'getContent')
            .and.returnValue({
                firstElementChild: {
                    scrollTop: 0
                }
            } as any);
        spyOn(ganttObj, 'getOffsetRect')
            .and.returnValue({
                top: 0,
                left: 0
            } as any);
        spyOn(ganttObj, 'getRowByIndex')
            .and.returnValue({
                rowIndex: 0,
                children: []
            } as any);
        spyOn(
            ganttObj.editModule.taskbarEditModule as any,
            'ensurePosition'
        );
        spyOn(
            ganttObj.editModule.taskbarEditModule as any,
            'topOrBottomBorder'
        );
        const event: any = {
            type: 'mousemove',
            pageY: 85
        };
        ganttObj.editModule.taskbarEditModule['processDropPosition'](
            event,
            target,
            row
        );
        expect(ganttObj.rowDragAndDropModule['dropPosition']).toBe('below');
        document.body.removeChild(cloneTaskbar);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
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
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                },
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
                    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
                ],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                viewType: 'ResourceView',
                allowRowDragAndDrop: true,
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
    it('should set isValid to false for sibling resource records', () => {
        const cloneTaskbar = document.createElement('div');
        cloneTaskbar.className = 'e-clone-taskbar';
        document.body.appendChild(cloneTaskbar);
        const row = document.createElement('tr');
        row.setAttribute('aria-rowindex', '1');
        row.setAttribute('data-uid', '2');
        const draggedRow = document.createElement('tr');
        draggedRow.setAttribute('data-uid', '1');
        ganttObj.editModule.taskbarEditModule['draggedTreeGridRowElement'] = draggedRow;
        ganttObj.editModule.taskbarEditModule['draggedTreeGridRowHeight'] = 30;
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = {
            hasChildRecords: false,
            parentItem: {
                taskId: 10
            },
            ganttProperties: {
                segments: [{}]
            }
        } as any;
        const droppedRecord = {
            hasChildRecords: false,
            parentItem: {
                taskId: 10
            }
        };
        ganttObj.currentViewData = [droppedRecord] as any;
        ganttObj.rowDragAndDropModule = {
            dropPosition: ''
        } as any;
        spyOn(utils, 'parentsUntil')
            .and.returnValue(document.createElement('div'));
        spyOn(ganttObj.treeGrid, 'getRows')
            .and.returnValue([row]);
        spyOn(ganttObj.treeGrid, 'getHeaderContent')
            .and.returnValue({ offsetHeight: 0 } as any);
        spyOn(ganttObj.treeGrid, 'getContent')
            .and.returnValue({
                firstElementChild: {
                    scrollTop: 0
                }
            } as any);
        spyOn(ganttObj, 'getOffsetRect')
            .and.returnValue({
                top: 0,
                left: 0
            } as any);
        spyOn(ganttObj, 'getRowByIndex')
            .and.returnValue({
                rowIndex: 0,
                children: []
            } as any);
        spyOn(ganttObj.editModule.taskbarEditModule as any, 'ensurePosition');
        ganttObj.editModule.taskbarEditModule['processDropPosition'](
            {
                type: 'mousemove',
                pageY: 15
            } as any,
            document.createElement('div'),
            row
        );
        expect(ganttObj.editModule.taskbarEditModule['ensurePosition'])
        document.body.removeChild(cloneTaskbar);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});