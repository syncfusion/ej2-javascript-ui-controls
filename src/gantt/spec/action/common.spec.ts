import { Inputs } from './../../src/gantt/actions/dialog-edit';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Gantt taskbaredit spec
 */
import { createElement, remove, L10n } from '@syncfusion/ej2-base';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, UndoRedo, IActionBeginEventArgs } from '../../src/index';
import { cellEditData, resourcesData, resources, scheduleModeData, resourceDataTaskType, resourceResources, taskTypeData, taskTypeWorkData, projectData, editingData, customSelfReferenceData, autoDateCalculate, customZoomingdata, parentProgressData, virtualData, virtualData1, resourcesDatas, splitTasksData, coverageData, taskModeData, resourceCollection, cR885322, cellEditData1, dataSource1, splitTasksDataRelease, releaseVirtualData, unscheduledData1, MT887459, actionFailureData, resourceData, Data893564, CR898960, crValidateIssue, criticalPath, editingResources3, projectData1, paramsData, overviewData, editingResources, datapdf, localizationData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent, triggerKeyboardEvent, getKeyUpObj } from '../base/gantt-util.spec';
import { DatePickerEditCell } from '@syncfusion/ej2-grids';
import { Input } from '@syncfusion/ej2-inputs';
import { RichTextEditor } from '@syncfusion/ej2-richtexteditor';
import { Calendar } from '@syncfusion/ej2-calendars';
import { getValue } from '@syncfusion/ej2-base';

interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}

Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, UndoRedo);
//  function valueAccess(field: string, data: Object, column: Object) {   
//     return data[field];
// }

describe('Check for correct start date', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: releaseVirtualData,
                treeColumnIndex: 1,
                allowSorting: true,
                showOverAllocation: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'parentID'
                },
                enableVirtualization: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowReordering: true,
                enableContextMenu: true,
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Indent', 'Outdent', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                allowSelection: true,
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowFiltering: true,
                gridLines: 'Both',
                height: '550px',
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
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
                allowResizing: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                taskbarHeight: 20,
                rowHeight: 40,
                splitterSettings: {
                    columnIndex: 3
                },
            }, done);
    });
    it('Checking of start date', (done: Function) => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.type === 'save') {
                expect(ganttObj.getFormatedDate(ganttObj.flatData[22]['StartDate'], 'M/d/yyyy')).toBe('5/31/2019');
                done()
            }
        }
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as any).ej2_instances[0];
        input.value = '5 days'
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt delete action', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                allowSelection: true,
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
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                toolbar: ['Add', 'Edit', 'Delete'],
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
            }, done);
    });
    it('args cancel true in actionBegin event', (done: Function) => {
        ganttObj.dataSource = JSON.parse(JSON.stringify(projectData1));
        let deleteActionTriggered: boolean = false;
        ganttObj.actionBegin = (args: IActionBeginEventArgs) => {
            if (args.requestType === 'beforeDelete') {
                args.cancel = true;
                deleteActionTriggered = true;
            }
        };
        ganttObj.dataBound = () => {
            if (deleteActionTriggered) {
                expect(getValue('TaskID', ganttObj.flatData[ganttObj.flatData.length - 1])).toBe(39); // Verify the record is not deleted
                done();
            }
        };
        ganttObj.refresh();
        ganttObj.editModule.deleteRecord(39);
    }, 500);

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('additional params for notes dialog', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: paramsData,
            showOverAllocation: true,
            enableContextMenu: true,
            enableUndoRedo: true,
            allowSorting: true,
            allowReordering: true,
            addDialogFields: [{
                type: "Notes"
            }],
            editDialogFields: [
                {
                    type: 'Notes', additionalParams: { toolbarSettings: { items: ['Image', 'CreateTable', 'EmojiPicker', 'FileManager', 'FormatPainter'] } }
                },
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                resourceInfo: 'resources',
                work: 'work',
                child: 'subtasks',
                notes: 'info'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'work', headerText: 'Work' },
                { field: 'Progress' },
                { field: 'StartDate' },
                { field: 'Duration' },
            ],
            toolbar: ['Add', 'Undo', 'Redo'],
            allowTaskbarDragAndDrop: true,
            labelSettings: {
                rightLabel: 'resources',
                taskLabel: 'Progress'
            },
            splitterSettings: {
                columnIndex: 3
            },
            selectionSettings: {
                mode: 'Row',
                type: 'Single',
                enableToggle: false
            },
            tooltipSettings: {
                showTooltip: true
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
            readOnly: false,
            //gridLines: "Both",
            allowRowDragAndDrop: true,
            allowResizing: true,
            allowFiltering: true,
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            taskbarHeight: 20,
            rowHeight: 40,
            height: '550px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019')
        }, done);
    });
    it('check data', () => {
        ganttObj['closeGanttActions']();
        expect(ganttObj.currentViewData.length).toBe(4);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Milestone and Work Property Not Working Properly ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [],
            enableContextMenu: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                resourceInfo: 'resources',
                work: 'Work',
                child: 'subtasks',
                type: 'taskType',
                milestone: 'isMilestone',
            },
            workWeek: [],

            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            resources: resourceData,
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'Unit',
            },
            workUnit: 'Hour',
            taskType: 'FixedWork',
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'resources', headerText: 'Resources', width: '160' },
                { field: 'Work', width: '110' },
                { field: 'Duration', width: '100' },
                { field: 'taskType', headerText: 'Task Type', width: '110' },
            ],
        }, done);
    });
    beforeEach((done: Function) => {
        ganttObj.openAddDialog();
        setTimeout(done, 100);
    });
    it('check Milestone as true and Work as number  ', (done: Function) => {
        let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        setTimeout(() => {
            expect(ganttObj.flatData[0].ganttProperties.isMilestone).toBe(false);
            expect(ganttObj.flatData[0]["isMilestone"]).toBe(false);
            expect(ganttObj.flatData[0].ganttProperties.work).toBe(0);
            expect(ganttObj.flatData[0]['Work']).toBe(0);
            done();
        }, 50);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('CR:911375-Scroll jumps when delete random parent record with virtualization', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: releaseVirtualData,
                treeColumnIndex: 1,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    parentID: 'parentID'
                },
                enableVirtualization: true,
                enableTimelineVirtualization: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                allowReordering: true,
                enableContextMenu: true,
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search'],
                allowSelection: true,
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowFiltering: true,
                gridLines: 'Both',
                height: '550px',
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
                allowResizing: true,
                splitterSettings: {
                    columnIndex: 3
                },
            }, done);
    });
    it('Delete a random parent record in virtual mode', () => {
        ganttObj.rowSelected = (args: any) => {
            if (args.name === "rowSelected" && args.rowIndex === 47) {
                expect(ganttObj.selectedRowIndex).toBe(47);
                expect(getValue('TaskID', ganttObj.flatData[ganttObj.selectedRowIndex])).toBe(55);
            }
        };
        ganttObj.editModule.deleteRecord(48);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR:911375-Scroll jumps when delete last parent record with virtualization', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: releaseVirtualData,
                treeColumnIndex: 1,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    parentID: 'parentID'
                },
                enableVirtualization: true,
                enableTimelineVirtualization: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                allowReordering: true,
                enableContextMenu: true,
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search'],
                allowSelection: true,
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowFiltering: true,
                gridLines: 'Both',
                height: '550px',
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
                allowResizing: true,
                splitterSettings: {
                    columnIndex: 3
                },
            }, done);
    });
    it('Delete a last parent record in virtual mode', () => {
        ganttObj.rowSelected = (args: any) => {
            if (args.name === "rowSelected" && args.rowIndex === 0) {
                expect(ganttObj.selectedRowIndex).toBe(0);
                expect(getValue('TaskID', ganttObj.flatData[ganttObj.selectedRowIndex])).toBe(1);
            }
        };
        ganttObj.editModule.deleteRecord(2048);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export  getting console error', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: overviewData,
                resources: editingResources,
                height: '500px',
                width: "100%",
                highlightWeekends: true,
                allowSelection: true,
                allowSorting: true,
                treeColumnIndex: 1,
                viewType: 'ProjectView',
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'TimeLog',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'ParentId',
                    resourceInfo: 'Assignee'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                },
                columns: [
                    { field: 'TaskId', width: 60, visible: false },
                    { field: 'TaskName', width: 200, headerText: 'Product Release' },
                    { field: 'Assignee', width: 130, allowSorting: false, headerText: 'Assignee', template: '#columnTemplate' },
                    { field: 'Work', width: 120, headerText: 'Planned Hours' },
                    { field: 'TimeLog', width: 120, headerText: 'Work Log' }
                ],
                pdfQueryCellInfo(args) {
                    if (args.column.headerText === 'Assignee' && args.data.taskData.resourcesImage) {
                        {
                            args.image = { height: 30, width: 30, base64: args.data.taskData.resourcesImage };
                        }
                    }
                },
                toolbar: ['ExpandAll', 'CollapseAll', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: true
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Vertical",
                showColumnMenu: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Month',
                        format: 'MMM yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 4,
                        format: 'dd'
                    }
                },
                eventMarkers: [
                    {
                        day: '04/04/2024',
                        cssClass: 'e-custom-event-marker',
                        label: 'Q-1 Release'
                    },
                    {
                        day: '06/30/2024',
                        cssClass: 'e-custom-event-marker',
                        label: 'Q-2 Release'
                    },
                    {
                        day: '09/29/2024',
                        cssClass: 'e-custom-event-marker',
                        label: 'Q-3 Release'
                    }
                ],
                holidays: [{
                    from: "01/01/2024",
                    to: "01/01/2024",
                    label: "New Year holiday",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "12/25/2023",
                    to: "12/26/2023",
                    label: "Christmas holidays",
                    cssClass: "e-custom-holiday"
                }],
                labelSettings: {
                    rightLabel: 'Assignee',
                    taskLabel: '${Progress}%'
                },
                allowResizing: true,
                taskbarHeight: 24,
                rowHeight: 36,
                projectStartDate: new Date('12/17/2023'),
                projectEndDate: new Date('10/26/2024'),

            }, done);
    });
    it('Export data with image', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export for big font size', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datapdf,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: "id",
                    name: "name",
                    startDate: "startDate",
                    endDate: "endDate",
                    duration: "duration",
                    progress: "progress",
                    parentID: "parentID",
                    //child: "child",
                    dependency: "dependency",
                    cssClass: "cssClass",
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    {
                        field: "name",
                        width: window.innerWidth <= 768 ? 150 : 250,
                    },
                    {
                        field: "Type",
                        width: 120,
                    },
                    {
                        field: "displayID",
                        headerText: "ID",
                        visible: false,
                    },
                    {
                        field: "assignee",
                        headerText: "Assignee",
                        template: "#assignee-template",
                    },
                    {
                        field: "status",
                        headerText: "Status",
                        template: "#status-template",
                    },
                    {
                        field: "progress",
                        headerText: "Progress %",
                    },
                    {
                        field: "startDate",
                    },
                    {
                        field: "endDate",
                    },
                    {
                        field: "duration",
                    },
                ],
                toolbar: ['PdfExport'],
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
                allowUnscheduledTasks: true,
            }, done);
    });
    it('Export data with big font', () => {
        var exportProperties: any = {
            pageSize: 'A0',
            fitToWidthSettings:
            {
                isFitToWidth: true,
                gridWidth: '100%',
                chartWidth: '100%',
            },
            ganttStyle: {
                cell: { fontSize: 24 },
                columnHeader: { fontSize: 24 },
                footer: { fontSize: 24 },
                label: { fontSize: 24 },
                timeline: { fontSize: 24 },
            }
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('provide support for dependency type localization', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        L10n.load({
            'pt-BR': {
                gantt: {
                    emptyRecord: 'Sem registros para exibir',
                    segments: 'Partes',
                    id: 'ID',
                    name: 'Nome',
                    startDate: 'Data de início',
                    endDate: 'Data de fim',
                    duration: 'Duração',
                    progress: 'Progresso',
                    dependency: 'Dependência',
                    notes: 'Notas',
                    baselineStartDate: 'Data de início da linha de base',
                    baselineEndDate: 'Data de fim da linha de base',
                    type: 'Tipo',
                    offset: 'Offset',
                    resourceName: 'Nome do recurso',
                    resourceID: 'ID do recurso',
                    day: 'Dia',
                    hour: 'Hora',
                    minute: 'Minuto',
                    days: 'Dias',
                    hours: 'Horas',
                    minutes: 'Minutos',
                    generalTab: 'Aba geral',
                    customTab: 'Aba customizada',
                    writeNotes: 'Escrever notas',
                    addDialogTitle: 'Adicionar',
                    editDialogTitle: 'Editar',
                    add: 'Adicionar',
                    edit: 'Editar',
                    update: 'Atualizar',
                    delete: 'Deletar',
                    cancel: 'Cancelar',
                    search: 'Procurar',
                    task: 'Tarefa',
                    tasks: 'Tarefas',
                    zoomIn: '+ Zoom',
                    zoomOut: '- Zoom',
                    zoomToFit: 'Centralizar',
                    expandAll: 'Expandir todos',
                    collapseAll: 'Colapsar todos',
                    nextTimeSpan: '',
                    prevTimeSpan: '',
                    saveButton: 'Salvar',
                    taskBeforePredecessor_FS:
                        'Você moveu “{0}” para iniciar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FS:
                        'Você moveu “{0}” para iniciar após o fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SS:
                        'Você moveu “{0}” para iniciar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SS:
                        'Você moveu “{0}” para iniciar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_FF:
                        'Você moveu “{0}” para terminar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FF:
                        'Você moveu “{0}” para terminar após do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SF:
                        'Você moveu “{0}” para terminar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SF:
                        'Você moveu “{0}” para terminar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    okText: 'Ok',
                    confirmDelete: 'Você tem certeza que deseja deletar esse registro?',
                    from: 'de',
                    to: 'para',
                    taskLink: 'Relacionar tarefa',
                    lag: 'Atraso',
                    start: 'Começar',
                    finish: 'Finalizar',
                    enterValue: 'Entre Com o Valor',
                    taskInformation: 'Informação da Tarefa',
                    deleteTask: 'Deletar Tarefa',
                    deleteDependency: 'Deletar Dependência',
                    convert: 'Converter',
                    save: 'Salvar',
                    above: 'Acima',
                    below: 'Abaixo',
                    child: 'Filha',
                    milestone: 'Milestone',
                    toTask: 'Para Tarefa',
                    toMilestone: 'Para Milestone',
                    eventMarkers: 'Marcadores de Evento',
                    leftTaskLabel: 'Título da Tarefa a Esquerda',
                    rightTaskLabel: 'Título da Tarefa a Direita',
                    timelineCell: 'Célula da Timeline',
                    confirmPredecessorDelete: 'Você realmetne deseja remover a dependência?',
                    changeScheduleMode: 'Alterar Modo do Cronograma',
                    subTasksStartDate: 'Data de Início da Subtarefa',
                    subTasksEndDate: 'Data Final da Subtarefa',
                    scheduleStartDate: 'Data de Início do Cronograma',
                    scheduleEndDate: 'Data Final do Cronograma',
                    auto: 'Auto',
                    manual: 'Manual',
                    excelExport: 'Exportação de Excel',
                    csvExport: 'Exportação de CSV',
                    pdfExport: 'Exportação de PDF',
                    unit: 'Unidade',
                    work: 'Trabalho',
                    taskType: 'Tipo de tarefa',
                    unassignedTask: 'Tarefa não atribuída',
                    group: 'Grupo',
                    FS: "fsi",
                    SS: "ssi",
                    FF: "ffi",
                    SF: "sfi"
                },
                datepicker: {
                    today: 'hoje',
                },
                grid: {
                    EmptyRecord: 'Não há registros a serem exibidos',
                    True: 'verdadeiro',
                    False: 'falso',
                    InvalidFilterMessage: 'Dados da filtragem inválidos',
                    GroupDropArea:
                        'Arraste um cabeçalho de coluna aqui para agrupar sua coluna',
                    UnGroup: 'Clique aqui para desagrupar',
                    GroupDisable: 'O agrupamento está desativado para esta coluna',
                    FilterbarTitle: 'célula da barra de filtro',
                    EmptyDataSourceError:
                        'O DataSource não deve estar vazio no carregamento inicial, pois as colunas são geradas a partir do dataSource no AutoGenerate Column Grid',
                    Add: 'Adicionar',
                    Edit: 'Editar',
                    Cancel: 'Cancelar',
                    Update: 'Atualizar',
                    Delete: 'Excluir',
                    Print: 'Imprimir',
                    Pdfexport: 'Exportar PDF',
                    Excelexport: 'Exportar Excel',
                    Wordexport: 'Exportar Word',
                    Csvexport: 'Exportar CSV',
                    Search: 'Buscar',
                    Columnchooser: 'Selecionar Colunas',
                    Save: 'Salvar ',
                    Item: 'item',
                    Items: 'itens',
                    EditOperationAlert: 'Nenhum registro selecionado para operação de edição',
                    DeleteOperationAlert:
                        'Nenhum registro selecionado para operação de exclusão',
                    SaveButton: 'Salvar ',
                    OKButton: 'OK',
                    CancelButton: 'Cancelar',
                    EditFormTitle: 'Editar registro',
                    AddFormTitle: 'Adicionar novo registro',
                    BatchSaveConfirm: 'Tem certeza de que deseja salvar as alterações?',
                    BatchSaveLostChanges:
                        'Alterações não salvas serão perdidas. Você tem certeza que quer continuar?',
                    ConfirmDelete: 'Tem certeza de que deseja excluir o registro?',
                    CancelEdit: 'Tem certeza de que deseja cancelar as alterações?',
                    ChooseColumns: 'Escolher colunas',
                    SearchColumns: 'Buscar colunas',
                    Matchs: 'Nenhuma correspondência encontrada',
                    FilterButton: 'Filtrar',
                    ClearButton: 'Limpar',
                    StartsWith: 'Começa com',
                    EndsWith: 'Termina com',
                    Contains: 'Contém',
                    Equal: 'Igual',
                    NotEqual: 'Diferente',
                    LessThan: 'Menor que',
                    LessThanOrEqual: 'Menor ou igual',
                    GreaterThan: 'Maior que',
                    GreaterThanOrEqual: 'Maior ou igual',
                    ChooseDate: 'Escolha uma data',
                    EnterValue: 'Digite o valor',
                    Copy: 'Copiar',
                    Group: 'Agrupar por esta coluna',
                    Ungroup: 'Desagrupar por esta coluna',
                    autoFitAll: 'Ajustar automaticamente a todas as colunas',
                    autoFit: 'Ajustar automaticamente a esta coluna',
                    Export: 'Exportar',
                    FirstPage: 'Primeira página',
                    LastPage: 'Última página',
                    PreviousPage: 'Página anterior',
                    NextPage: 'Próxima página',
                    SortAscending: 'Classificar em ordem ascendente',
                    SortDescending: 'Classificar em ordem decrescente',
                    EditRecord: 'Editar registro',
                    DeleteRecord: 'Apagar registro',
                    FilterMenu: 'Filtro',
                    SelectAll: 'Selecionar tudo',
                    Blanks: 'Espaços em branco',
                    FilterTrue: 'Verdadeiro',
                    FilterFalse: 'Falso',
                    NoResult: 'Nenhum resultado encontrada',
                    ClearFilter: 'Limpar filtro',
                    NumberFilter: 'Filtros numéricos',
                    TextFilter: 'Filtros de texto',
                    DateFilter: 'Filtros de data',
                    DateTimeFilter: 'Filtros DateTime',
                    MatchCase: 'Caso de compatibilidade',
                    Between: 'Entre',
                    CustomFilter: 'Filtro customizado',
                    CustomFilterPlaceHolder: 'Digite o valor',
                    CustomFilterDatePlaceHolder: 'Escolha uma data',
                    AND: 'E',
                    OR: 'OU',
                    ShowRowsWhere: 'Mostrar linhas onde:',
                    NotStartsWith: 'Não começa com',
                    Like: 'Como',
                    NotEndsWith: 'Não termina com',
                    NotContains: 'Não contém',
                    IsNull: 'Nula',
                    NotNull: 'Não nulo',
                    IsEmpty: 'Vazia',
                    IsNotEmpty: 'Não está vazio',
                    AddCurrentSelection: 'Adicionar seleção atual para filtrar',
                    UnGroupButton: 'Clique aqui para desagrupar',
                    AutoFitAll: 'Ajustar automaticamente todas as colunas',
                    AutoFit: 'Ajustar automaticamente esta coluna',
                    Clear: 'Clara',
                    FilterMenuDialogARIA: 'Caixa de diálogo do menu de filtro',
                    ExcelFilterDialogARIA: 'Caixa de diálogo de filtro do Excel',
                    DialogEditARIA: 'Caixa de diálogo Editar',
                    ColumnChooserDialogARIA: 'Seletor de coluna',
                    ColumnMenuDialogARIA: 'Caixa de diálogo do menu da coluna',
                    CustomFilterDialogARIA: 'Caixa de diálogo de filtro personalizado',
                    SortAtoZ: 'Ordenar de A a Z',
                    SortZtoA: 'Ordenar Z a A',
                    SortByOldest: 'Classificar por mais antigo',
                    SortByNewest: 'Classificar por mais recente',
                    SortSmallestToLargest: 'Classificar do menor para o maior',
                    SortLargestToSmallest: 'Classificar do maior para o menor',
                    Sort: 'Ordenar',
                    FilterDescription: 'Pressione Alt para baixo para abrir o menu de filtro',
                    SortDescription: 'Pressione Enter para classificar',
                    ColumnMenuDescription:
                        'Pressione Alt para baixo para abrir o menu de colunas',
                    GroupDescription: 'Pressione o espaço Ctrl para agrupar',
                    ColumnHeader: ' cabeçalho da coluna ',
                    TemplateCell: ' é célula modelo',
                    CommandColumnAria: 'é o cabeçalho da coluna da coluna de comando ',
                    DialogEdit: 'Editar caixa de diálogo',
                    ClipBoard: 'prancheta',
                    GroupButton: 'Botão de grupo',
                    UnGroupAria: 'botão desagrupar',
                    GroupSeperator: 'Separador para as colunas agrupadas',
                    UnGroupIcon: 'desagrupar a coluna agrupada ',
                    GroupedSortIcon: 'classificar a coluna agrupada ',
                    GroupedDrag: 'Arraste a coluna agrupada',
                    GroupCaption: ' é célula de legenda de grupo',
                    CheckBoxLabel: 'caixa de seleção',
                    Expanded: 'Expandida',
                    Collapsed: 'Desabou',
                    SelectAllCheckbox: 'Caixa de seleção Selecionar tudo',
                    SelectRow: 'Selecione a linha',
                },
            },
        });

        ganttObj = createGantt(
            {
                dataSource: localizationData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                locale: 'pt-BR',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                allowFiltering: true,
                filterSettings: {
                    type: "Menu",
                    hierarchyMode: "Both"
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('checking predecessorsName localization', () => {
        let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[4] as HTMLElement;
        triggerMouseEvent(filterMenuIcon, 'click');
        expect(ganttObj.element.querySelectorAll('.e-headercell')[4].getElementsByClassName('e-headertext')[0].textContent).toBe('Dependência');
        expect(ganttObj.treeGridModule.changeLocale(ganttObj.treeGrid.grid.dataSource).length).toBe(7);
        expect(ganttObj.treeGridModule.changeDelocale("10ffi")).toBe('10FF');
        expect(ganttObj.treeGridModule.changeDelocale("10fsi")).toBe('10FS');
        expect(ganttObj.treeGridModule.changeDelocale("10sfi")).toBe('10SF');
        expect(ganttObj.treeGridModule.changeDelocale("10ssi")).toBe('10SS');
        expect(ganttObj.treeGridModule.changeDelocale(null)).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('provide support for dependency type localization', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        L10n.load({
            'pt-BR': {
                gantt: {
                    emptyRecord: 'Sem registros para exibir',
                    segments: 'Partes',
                    id: 'ID',
                    name: 'Nome',
                    startDate: 'Data de início',
                    endDate: 'Data de fim',
                    duration: 'Duração',
                    progress: 'Progresso',
                    dependency: 'Dependência',
                    notes: 'Notas',
                    baselineStartDate: 'Data de início da linha de base',
                    baselineEndDate: 'Data de fim da linha de base',
                    type: 'Tipo',
                    offset: 'Offset',
                    resourceName: 'Nome do recurso',
                    resourceID: 'ID do recurso',
                    day: 'Dia',
                    hour: 'Hora',
                    minute: 'Minuto',
                    days: 'Dias',
                    hours: 'Horas',
                    minutes: 'Minutos',
                    generalTab: 'Aba geral',
                    customTab: 'Aba customizada',
                    writeNotes: 'Escrever notas',
                    addDialogTitle: 'Adicionar',
                    editDialogTitle: 'Editar',
                    add: 'Adicionar',
                    edit: 'Editar',
                    update: 'Atualizar',
                    delete: 'Deletar',
                    cancel: 'Cancelar',
                    search: 'Procurar',
                    task: 'Tarefa',
                    tasks: 'Tarefas',
                    zoomIn: '+ Zoom',
                    zoomOut: '- Zoom',
                    zoomToFit: 'Centralizar',
                    expandAll: 'Expandir todos',
                    collapseAll: 'Colapsar todos',
                    nextTimeSpan: '',
                    prevTimeSpan: '',
                    saveButton: 'Salvar',
                    taskBeforePredecessor_FS:
                        'Você moveu “{0}” para iniciar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FS:
                        'Você moveu “{0}” para iniciar após o fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SS:
                        'Você moveu “{0}” para iniciar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SS:
                        'Você moveu “{0}” para iniciar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_FF:
                        'Você moveu “{0}” para terminar antes do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_FF:
                        'Você moveu “{0}” para terminar após do fim de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskBeforePredecessor_SF:
                        'Você moveu “{0}” para terminar antes do início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    taskAfterPredecessor_SF:
                        'Você moveu “{0}” para terminar após o início de “{1}” e as duas tarefas já estão relacionadas. Como resultado a relação não pode ser feita. Selecione uma das seguintes ações para prosseguir',
                    okText: 'Ok',
                    confirmDelete: 'Você tem certeza que deseja deletar esse registro?',
                    from: 'de',
                    to: 'para',
                    taskLink: 'Relacionar tarefa',
                    lag: 'Atraso',
                    start: 'Começar',
                    finish: 'Finalizar',
                    enterValue: 'Entre Com o Valor',
                    taskInformation: 'Informação da Tarefa',
                    deleteTask: 'Deletar Tarefa',
                    deleteDependency: 'Deletar Dependência',
                    convert: 'Converter',
                    save: 'Salvar',
                    above: 'Acima',
                    below: 'Abaixo',
                    child: 'Filha',
                    milestone: 'Milestone',
                    toTask: 'Para Tarefa',
                    toMilestone: 'Para Milestone',
                    eventMarkers: 'Marcadores de Evento',
                    leftTaskLabel: 'Título da Tarefa a Esquerda',
                    rightTaskLabel: 'Título da Tarefa a Direita',
                    timelineCell: 'Célula da Timeline',
                    confirmPredecessorDelete: 'Você realmetne deseja remover a dependência?',
                    changeScheduleMode: 'Alterar Modo do Cronograma',
                    subTasksStartDate: 'Data de Início da Subtarefa',
                    subTasksEndDate: 'Data Final da Subtarefa',
                    scheduleStartDate: 'Data de Início do Cronograma',
                    scheduleEndDate: 'Data Final do Cronograma',
                    auto: 'Auto',
                    manual: 'Manual',
                    excelExport: 'Exportação de Excel',
                    csvExport: 'Exportação de CSV',
                    pdfExport: 'Exportação de PDF',
                    unit: 'Unidade',
                    work: 'Trabalho',
                    taskType: 'Tipo de tarefa',
                    unassignedTask: 'Tarefa não atribuída',
                    group: 'Grupo',
                    FS: "fsi",
                    SS: "ssi",
                    FF: "ffi",
                    SF: "sfi"
                },
                datepicker: {
                    today: 'hoje',
                },
                grid: {
                    EmptyRecord: 'Não há registros a serem exibidos',
                    True: 'verdadeiro',
                    False: 'falso',
                    InvalidFilterMessage: 'Dados da filtragem inválidos',
                    GroupDropArea:
                        'Arraste um cabeçalho de coluna aqui para agrupar sua coluna',
                    UnGroup: 'Clique aqui para desagrupar',
                    GroupDisable: 'O agrupamento está desativado para esta coluna',
                    FilterbarTitle: 'célula da barra de filtro',
                    EmptyDataSourceError:
                        'O DataSource não deve estar vazio no carregamento inicial, pois as colunas são geradas a partir do dataSource no AutoGenerate Column Grid',
                    Add: 'Adicionar',
                    Edit: 'Editar',
                    Cancel: 'Cancelar',
                    Update: 'Atualizar',
                    Delete: 'Excluir',
                    Print: 'Imprimir',
                    Pdfexport: 'Exportar PDF',
                    Excelexport: 'Exportar Excel',
                    Wordexport: 'Exportar Word',
                    Csvexport: 'Exportar CSV',
                    Search: 'Buscar',
                    Columnchooser: 'Selecionar Colunas',
                    Save: 'Salvar ',
                    Item: 'item',
                    Items: 'itens',
                    EditOperationAlert: 'Nenhum registro selecionado para operação de edição',
                    DeleteOperationAlert:
                        'Nenhum registro selecionado para operação de exclusão',
                    SaveButton: 'Salvar ',
                    OKButton: 'OK',
                    CancelButton: 'Cancelar',
                    EditFormTitle: 'Editar registro',
                    AddFormTitle: 'Adicionar novo registro',
                    BatchSaveConfirm: 'Tem certeza de que deseja salvar as alterações?',
                    BatchSaveLostChanges:
                        'Alterações não salvas serão perdidas. Você tem certeza que quer continuar?',
                    ConfirmDelete: 'Tem certeza de que deseja excluir o registro?',
                    CancelEdit: 'Tem certeza de que deseja cancelar as alterações?',
                    ChooseColumns: 'Escolher colunas',
                    SearchColumns: 'Buscar colunas',
                    Matchs: 'Nenhuma correspondência encontrada',
                    FilterButton: 'Filtrar',
                    ClearButton: 'Limpar',
                    StartsWith: 'Começa com',
                    EndsWith: 'Termina com',
                    Contains: 'Contém',
                    Equal: 'Igual',
                    NotEqual: 'Diferente',
                    LessThan: 'Menor que',
                    LessThanOrEqual: 'Menor ou igual',
                    GreaterThan: 'Maior que',
                    GreaterThanOrEqual: 'Maior ou igual',
                    ChooseDate: 'Escolha uma data',
                    EnterValue: 'Digite o valor',
                    Copy: 'Copiar',
                    Group: 'Agrupar por esta coluna',
                    Ungroup: 'Desagrupar por esta coluna',
                    autoFitAll: 'Ajustar automaticamente a todas as colunas',
                    autoFit: 'Ajustar automaticamente a esta coluna',
                    Export: 'Exportar',
                    FirstPage: 'Primeira página',
                    LastPage: 'Última página',
                    PreviousPage: 'Página anterior',
                    NextPage: 'Próxima página',
                    SortAscending: 'Classificar em ordem ascendente',
                    SortDescending: 'Classificar em ordem decrescente',
                    EditRecord: 'Editar registro',
                    DeleteRecord: 'Apagar registro',
                    FilterMenu: 'Filtro',
                    SelectAll: 'Selecionar tudo',
                    Blanks: 'Espaços em branco',
                    FilterTrue: 'Verdadeiro',
                    FilterFalse: 'Falso',
                    NoResult: 'Nenhum resultado encontrada',
                    ClearFilter: 'Limpar filtro',
                    NumberFilter: 'Filtros numéricos',
                    TextFilter: 'Filtros de texto',
                    DateFilter: 'Filtros de data',
                    DateTimeFilter: 'Filtros DateTime',
                    MatchCase: 'Caso de compatibilidade',
                    Between: 'Entre',
                    CustomFilter: 'Filtro customizado',
                    CustomFilterPlaceHolder: 'Digite o valor',
                    CustomFilterDatePlaceHolder: 'Escolha uma data',
                    AND: 'E',
                    OR: 'OU',
                    ShowRowsWhere: 'Mostrar linhas onde:',
                    NotStartsWith: 'Não começa com',
                    Like: 'Como',
                    NotEndsWith: 'Não termina com',
                    NotContains: 'Não contém',
                    IsNull: 'Nula',
                    NotNull: 'Não nulo',
                    IsEmpty: 'Vazia',
                    IsNotEmpty: 'Não está vazio',
                    AddCurrentSelection: 'Adicionar seleção atual para filtrar',
                    UnGroupButton: 'Clique aqui para desagrupar',
                    AutoFitAll: 'Ajustar automaticamente todas as colunas',
                    AutoFit: 'Ajustar automaticamente esta coluna',
                    Clear: 'Clara',
                    FilterMenuDialogARIA: 'Caixa de diálogo do menu de filtro',
                    ExcelFilterDialogARIA: 'Caixa de diálogo de filtro do Excel',
                    DialogEditARIA: 'Caixa de diálogo Editar',
                    ColumnChooserDialogARIA: 'Seletor de coluna',
                    ColumnMenuDialogARIA: 'Caixa de diálogo do menu da coluna',
                    CustomFilterDialogARIA: 'Caixa de diálogo de filtro personalizado',
                    SortAtoZ: 'Ordenar de A a Z',
                    SortZtoA: 'Ordenar Z a A',
                    SortByOldest: 'Classificar por mais antigo',
                    SortByNewest: 'Classificar por mais recente',
                    SortSmallestToLargest: 'Classificar do menor para o maior',
                    SortLargestToSmallest: 'Classificar do maior para o menor',
                    Sort: 'Ordenar',
                    FilterDescription: 'Pressione Alt para baixo para abrir o menu de filtro',
                    SortDescription: 'Pressione Enter para classificar',
                    ColumnMenuDescription:
                        'Pressione Alt para baixo para abrir o menu de colunas',
                    GroupDescription: 'Pressione o espaço Ctrl para agrupar',
                    ColumnHeader: ' cabeçalho da coluna ',
                    TemplateCell: ' é célula modelo',
                    CommandColumnAria: 'é o cabeçalho da coluna da coluna de comando ',
                    DialogEdit: 'Editar caixa de diálogo',
                    ClipBoard: 'prancheta',
                    GroupButton: 'Botão de grupo',
                    UnGroupAria: 'botão desagrupar',
                    GroupSeperator: 'Separador para as colunas agrupadas',
                    UnGroupIcon: 'desagrupar a coluna agrupada ',
                    GroupedSortIcon: 'classificar a coluna agrupada ',
                    GroupedDrag: 'Arraste a coluna agrupada',
                    GroupCaption: ' é célula de legenda de grupo',
                    CheckBoxLabel: 'caixa de seleção',
                    Expanded: 'Expandida',
                    Collapsed: 'Desabou',
                    SelectAllCheckbox: 'Caixa de seleção Selecionar tudo',
                    SelectRow: 'Selecione a linha',
                },
            },
        });

        ganttObj = createGantt(
            {
                dataSource: localizationData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                locale: 'pt-BR',
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('checking predecessorsName localization', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        expect(taskName.innerText).toBe('2fsi');
        let taskName1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(5)') as HTMLElement;
        expect(taskName1.innerText).toBe('5ffi');
        let taskName2: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(9) > td:nth-child(5)') as HTMLElement;
        expect(taskName2.innerText).toBe('5ssi');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
