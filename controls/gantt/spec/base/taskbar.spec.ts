/**
 * Gantt taskbar spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Gantt, IQueryTaskbarInfoEventArgs } from '../../src/index';
import * as cls from '../../src/gantt/base/css-constants';
import { baselineData, resourceData, projectData } from './data-source.spec';
import { createGantt, destroyGantt } from './gantt-util.spec';
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Testing QueryTaskbarInfo event', (done: Function) => {
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
                done();
            }
            ganttObj.refresh();
        });
        it('Testing with taskbarheight and rowheight', (done: Function) => {
            ganttObj.taskbarHeight = 50;
            ganttObj.rowHeight = 40;
            ganttObj.baselineColor = '';
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.' + cls.chartRow) as HTMLElement).offsetHeight).toBe(40);
                expect((ganttObj.element.querySelector('.' + cls.taskBarMainContainer) as HTMLElement).offsetHeight).toBe(18);
                done();
            }
            ganttObj.refresh();
        });
        it('Render gantt without base line', () => {
            ganttObj.renderBaseline = false;
            ganttObj.dataBound = (done: Function) => {
                expect(ganttObj.element.querySelector('.' + cls.baselineBar)).toBe(null);
            }
            ganttObj.refresh();

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
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.leftLabelContainer).textContent).toBe('Child task 1');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.rightLabelContainer).textContent).toBe('2');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('2');
                done();
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
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('Custom');
                done();
            }
            ganttObj.refresh();
        });
        it('Parent taskbar with template ID', (done: Function) => {
            ganttObj.parentTaskbarTemplate = '#demoParentTaskTemplate';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.' + cls.taskLabel).textContent).toBe('ParentTemplate');
                done();
            }
            ganttObj.refresh();
        });
        it('Child taskbar with template ID', (done: Function) => {
            ganttObj.taskbarTemplate = '#demoChildTaskTemplate';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('ChildTemplate');
                done();
            }
            ganttObj.refresh();
        });
        it('Milestone with template ID', (done: Function) => {
            ganttObj.milestoneTemplate = '#milestoneTemplate';
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.' + cls.traceMilestone).children[0] as HTMLElement).style.backgroundColor).toBe("gray");
                done();
            }
            ganttObj.refresh();
        });
        it('Milestone with direct string template', (done: Function) => {
            ganttObj.milestoneTemplate = '<div class="' + cls.traceMilestone + '"><div style="width:30px;height:30px;background:Yellow;"><div><div></div></div>';
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.' + cls.traceMilestone).children[0] as HTMLElement).style.backgroundColor).toBe("yellow");
                done();
            }
            ganttObj.refresh();
        });
        it('Testing with Parent taskbar and taskbar template', (done: Function) => {
            ganttObj.parentTaskbarTemplate = '#demoParentTaskTemplateCustom';
            ganttObj.taskbarTemplate = '#demoChildTaskTemplateCustom';
            ganttObj.dataBound = () => {
                expect(ganttObj.element.querySelector('.' + cls.taskLabel).textContent).toBe('ParentTemplate-custom');
                expect(ganttObj.element.querySelector('.gridrowtaskId1level1').querySelector('.' + cls.taskLabel).textContent).toBe('ChildTemplate-custom');
                done();
            }
            ganttObj.refresh();
        });
        it('Testing with Expand status', (done: Function) => {
            ganttObj.taskFields.expandState = 'Expand';
            ganttObj.dataBound = () => {
                expect((ganttObj.element.querySelector('.gridrowtaskId4level2') as HTMLElement).style.display).toBe("none");
                done();
            }
            ganttObj.refresh();

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
                expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div:nth-child(1)').getAttribute('aria-label').indexOf('Left task label 1')> -1).toBeTruthy();
                expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div:nth-child(2)').getAttribute('aria-label').indexOf('Name Task 1 Start Date 10/23/2017 End Date 11/6/2017 Duration 11 days')> -1).toBeTruthy();
                expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div:nth-child(3)').getAttribute('aria-label').indexOf('Right task label Task 1')> -1).toBeTruthy();
                done();
            }
            ganttObj.refresh();
        });
    });
});
describe('Manual Task', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    'TaskID': 1,
                    'TaskName': 'Parent Task 1',
                    'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'),
                    'Progress': '40',
                    'isManual' : true,
                    'Children': [
                         { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                         'EndDate': new Date('02/03/2017'), 'Progress': '40' },
                        
                    ]
                }
              
            ],
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('manual task convert into milestone', () => {
       expect(ganttObj.currentViewData[0].ganttProperties.isMilestone).toBe(true);
    });
});
describe('Render taskbar duration in minutes ', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                  taskID: 5,
                  taskName: 'Project estimation',
                  startDate: new Date('04/02/2019'),
                  endDate: new Date('04/21/2019'),
                  BaselinestartDate: new Date('04/02/2019 10:45:00 AM'),
                  BaselineendDate: new Date('04/15/2019 11:15:00 AM'),
                },
                {
                  taskID: 6,
                  taskName: 'Develop floor plan for estimation',
                  startDate: new Date('04/04/2019'),
                  duration: 3,
                  predecessor: '3FS,4FS,7SS',
                  Progress: 30,
                  resources: 4,
                  info: 'Develop floor plans and obtain a materials list for estimations',
                  parentID: 5,
                  BaselinestartDate: new Date('04/02/2019 11:15:00 AM'),
                  BaselineendDate: new Date('04/12/2019 11:25:00 AM'),
                },
                {
                  taskID: 7,
                  taskName: 'List materials',
                  startDate: new Date('04/04/2019'),
                  duration: 3,
                  resources: [4, 8],
                  info: '',
                  parentID: 5,
                  BaselinestartDate: new Date('04/02/2019 11:00:00 AM'),
                  BaselineendDate: new Date('04/18/2019 11:20:00 AM'),
                },
                {
                  taskID: 8,
                  taskName: 'Estimation approval',
                  startDate: new Date('04/04/2019 08:00:00 AM'),
                  duration: '40 minutes',
                  predecessor: '',
                  resources: [12, 5],
                  info: '',
                  parentID: 5,
                  BaselinestartDate: new Date('04/02/2019 11:00:00 AM'),
                  BaselineendDate: new Date('04/02/2019 11:30:00 AM'),
                },

                {
                  taskID: 9,
                  taskName: 'Sign contract',
                  startDate: new Date('04/04/2019 08:00:00 AM'),
                  duration: '100 minutes',
                  predecessor: '8FS',
                  Progress: 30,
                  resources: [12],
                  info: 'If required obtain approval from HOA (homeowners association) or ARC (architectural review committee)',
                  BaselinestartDate: new Date('04/02/2019 11:20:00 AM'),
                  BaselineendDate: new Date('04/02/2019 11:40:00 AM'),
                },
                {
                  taskID: 10,
                  taskName: 'Project approval and kick off',
                  startDate: new Date('04/04/2019 08:00:00 AM'),
                  endDate: new Date('05/21/2019 08:40:00 AM'),
                  duration: '40 minutes',
                  predecessor: '',
                  BaselinestartDate: new Date('04/02/2019 11:40:00 AM'),
                  BaselineendDate: new Date('05/02/2019 12:00:00 PM'),
                },
              ],
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Taskbar renders in minutes', () => {
       expect(ganttObj.currentViewData[3].ganttProperties.width.toFixed()).toBe('3');
    });
});
describe('Progress width not updated properly in split tasks issue', () => {
    let ganttObj: Gantt;
    const tempData = [
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
        let virtualData1 :any= [];
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
        destroyGantt(ganttObj);
    });
});
describe('Bug-834012-Incorrect taskbar render when unit is given in hour', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Task 2',
                    StartDate: new Date('06/16/2023'),
                    Duration: 72,
                    DurationUnit: 'hour',
                    EndDate: new Date('06/20/2023'),
                },
                {
                    TaskID: 2,
                    TaskName: 'Task 2',
                    StartDate: new Date('06/16/2023'),
                    Duration: 1800,
                    DurationUnit: 'minutes',
                    EndDate: new Date('06/20/2023'),
                }
              ],
              dateFormat: 'dd/MM/yyyy hh:mm a',
              taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
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
                { field: 'taskID', width: 60 },
                { field: 'taskName', width: 250 },
                { field: 'startDate' },
                { field: 'endDate' },
                { field: 'duration' },
                { field: 'predecessor' },
                { field: 'progress' },
              ],
                splitterSettings: {
                columnIndex: 2,
              },
        }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Taskbar renders in hour mode & Minute mode', () => {
        //Checking taskbar width in "Hour" mode:
       expect(ganttObj.currentViewData[0].ganttProperties.width.toFixed()).toBe('429');
       //Checking taskbar width in "Minute" mode:
       expect(ganttObj.currentViewData[1].ganttProperties.width.toFixed()).toBe('186');  
    });
});
let splitData: object[] = [
    {
        TaskID: 1,
        TaskName: 'Project initiation',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('09/29/2019'),
        Segments: [
          {
            TaskName: 'Identify site location',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/01/2019'),
          },
          {
            TaskName: 'Perform soil test',
            StartDate: new Date('09/03/2019'),
            EndDate: new Date('09/29/2019'),
          },
        ],
      },
];
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
        destroyGantt(ganttObj);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 2000);
    });
});
describe('bug-833211-Render incorrect taskbarwidth with duration in minutes mode', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                  taskID: 1,
                  taskName: 'Estimation approval',
                  startDate: new Date('04/04/2019'),
                  duration: '960 minutes'
                },
              ],
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Verifying taskbar width in minutes mode', () => {
        //Checking taskbar width in "Minutes" mode:
       expect(ganttObj.currentViewData[0].ganttProperties.width.toFixed()).toBe('66');  
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
        destroyGantt(ganttObj);
    });
});
describe('Style not applied for the collapsed row when the virtual scroll is enabled', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
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
                            TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                            resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                        },
                        {
                            TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                            resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                        },
                    ]
                }],
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
        expect((ganttObj.element.querySelector('.' + cls.childTaskBarInnerDiv) as HTMLElement).style.backgroundColor).toBe('rgb(242, 210, 189)');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});