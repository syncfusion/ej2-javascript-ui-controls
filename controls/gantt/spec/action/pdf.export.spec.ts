/**
 * Gantt toolbar spec
 */
import { Gantt, Edit, Toolbar, Selection, ZoomTimelineSettings, Filter, PdfQueryCellInfoEventArgs, PdfExport, CriticalPath, DayMarkers, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, ContextMenu, ExcelExport, PdfQueryTimelineCellInfoEventArgs, PdfTreeGridLayoutFormat } from '../../src/index';
import { exportData, image, adventProFont, GanttData1, pdfData1, customZoomingdata, templateData, projectResourcestemplate, virtual1, criticalData1, resourcesData1, resourceCollection1, coulmntemplate, resourceCollectiontemplate1, splitTasks, headerFooter, weekEndData,pdfData, images, milestoneTemplate,editingResourcess, editingDatas, pdfquerycelldata,editingResources,CR911356manualTask, CR912356font, GanttData, adventProFonts1, editingData4, editingResources4, GanttDataPdf, projectNewDatapdf, projectpdfNewData,GanttDatapdf1,segmentprojectNewData,GanttDatapdf,ganttdatamanual, GanttDataIndicator, pdfWorkWeekData} from '../base/data-source.spec';
import { PdfExportProperties } from '../../src/gantt/base/interface';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
import { PdfDocument, PdfColor, PdfStandardFont, PdfFontFamily, PdfPen, PdfFontStyle, PdfDashStyle, PdfTextAlignment, PdfVerticalAlignment } from '@syncfusion/ej2-pdf-export';
import { PdfBorders } from '../../src/gantt/export/pdf-base/pdf-borders';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfTrueTypeFont } from '@syncfusion/ej2-pdf-export';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import {  triggerMouseEvent, getKeyUpObj } from '../base/gantt-util.spec';
import {
     RectangleF,PointF,PdfStringFormat, RowLayoutResult, PdfPage
} from '@syncfusion/ej2-pdf-export';
import {  TemporaryDictionary, PdfPaddings, PdfTreeGridHeaderCollection, PdfTreeGridRow, PdfTreeGridLayouter, PdfTreeGridColumn, PdfTreeGridColumnCollection, PdfTreeGridCell} from '../../src/gantt/export/pdf-base/index';
import { PdfTreeGrid } from '../../src/gantt/export/pdf-treegrid';
Gantt.Inject(Edit, Toolbar, Selection, Filter, PdfExport, CriticalPath, DayMarkers, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, ContextMenu, ExcelExport);

describe('Gantt pdfexport support', () => {
    let exportComplete: () => void = () => true;
    describe('Gantt toolbar action', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: exportData,
                    allowPdfExport: true,
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
                    toolbar: ['PdfExport'],
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    timelineSettings: {
                        topTier: {
                            unit: 'Year',
                            format: 'dd/MM/yyyy'
                        },
                        bottomTier: {
                            unit: 'Month',
                            count: 1
                        }
                    },
                    pdfExportComplete: exportComplete,
                    labelSettings: {
                        leftLabel: 'TaskName',
                        taskLabel: 'Progress',
                        rightLabel: 'TaskName'
                    },
                    beforePdfExport: (args: any) => {
                        ganttObj.beforePdfExport = undefined;
                        args.cancel = true;
                    },
                    pdfQueryCellInfo: (args: any) => {
                        ganttObj.pdfQueryCellInfo = undefined;
                        args.style = { backgroundColor: '#99ffcc' };
                    },
                }, done);
        });
        it("Export cancel Check", (done: Function) => {
            ganttObj.pdfExport().then((doc) => {
                expect(doc).toBeUndefined();
                done();
            });
        });
        it('gantt exporting(Check with multiple exporting)', (done) => {
            spyOn(ganttObj, 'pdfExportComplete');
            let props: PdfExportProperties = {};
            props.theme = 'Bootstrap 4';
            ganttObj.pdfExport(props, true).then((pdfDoc: PdfDocument) => {
                expect(ganttObj.pdfExportComplete).toHaveBeenCalled();
                expect(pdfDoc instanceof PdfDocument).toBeTruthy();
                done();
            });     
        });

        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

        describe('Gantt toolbar action', () => {

            let ganttObj1: Gantt;
            beforeAll((done: Function) => {
                ganttObj1 = createGantt(
                    {
                        dataSource: exportData,
                        allowPdfExport: true,
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
                        toolbar: ['PdfExport'],
                        timelineSettings: {
                            topTier: {
                                unit: 'Month',
                                format: 'dd/MM/yyyy'
                            },
                            bottomTier: {
                                unit: 'Week',
                                count: 1
                            }
                        },
                        projectStartDate: new Date('03/25/2019'),
                        projectEndDate: new Date('05/30/2019'),
                        rowHeight: 40,
                        taskbarHeight: 30,
                        pdfExportComplete: exportComplete,
                        labelSettings: {
                            leftLabel: 'TaskName',
                            taskLabel: 'Progress',
                            rightLabel: 'TaskName'
                        },
                        // beforePdfExport: (args: any) => {
                        //     ganttObj.beforePdfExport = undefined;
                        //     args.cancel = true;
                        // }
                    }, done);
            });

            // it("Check export theme support", (done: Function) => {
            //     let props: PdfExportProperties = {};
            //     props.theme = 'Fabric';
            //     let customtheme: CustomGanttTheme = {};
            //     customtheme.milestoneColor = new PdfColor(128, 0, 128);
            //     ganttObj1.pdfExport(props, true).then((pdfDoc: PdfDocument) => {
            //         done();
            //     });
            //     ganttObj1.pdfQueryTaskbarInfo = (args: any) => {
            //         expect(args.taskbar.taskColor).toBe(new PdfColor(0, 91, 163));
            //         if (args.row.TaskID === 2) {
            //           expect(args.taskbar.milestoneColor).toBe(new PdfColor(128, 0, 128));
            //         }
            //     } 
            // });
            afterAll(() => {
                if (ganttObj1) {
                    destroyGantt(ganttObj1);
                }
            });
        });
        describe('Gantt PDF Export', () => {

            let ganttObj: Gantt;
            beforeAll((done: Function) => {
                ganttObj = createGantt(
                    {
                        dataSource: exportData,
                        allowPdfExport: true,
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
                        toolbar: ['PdfExport'],
                        projectStartDate: new Date('03/25/2019'),
                        projectEndDate: new Date('05/30/2019'),
                        rowHeight: 40,
                        taskbarHeight: 30,
                        loadingIndicator: { indicatorType: 'Shimmer' },
                        pdfExportComplete: (args: any) => {
                            expect(args.name).toBe("pdfExportComplete");
                        },
                        columns: [
                            { field: 'TaskID', visible: false },
                            {
                                field: 'TaskName',
                                headerText: 'Task Name',
                                width: '250',
                                clipMode: 'EllipsisWithTooltip',
                            },
                            { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                            { field: 'Duration', headerText: 'Duration' },
                            { field: 'EndDate', headerText: 'End Date' },
                            { field: 'Predecessor', headerText: 'Predecessor' },
                        ],
                        treeColumnIndex: 0,
                        height: '450px',
                    }, done);
            });
            afterAll(() => {
                if (ganttObj) {
                    destroyGantt(ganttObj);
                }
            });
            it('Export with custom date format', () => {
                ganttObj.pdfExport();
            });
        });
    });
});
describe('Gantt PDF Export with blobdata', () => {

    let ganttObj: Gantt;
    let blobDatas: any;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(!isNullOrUndefined(args)).toBe(true);
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',

            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export blob object', () => {
        ganttObj.pdfExport(null, null, null, true)

    });
});
describe('Gantt PDF Export with baseline', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with baseline', () => {
        ganttObj.pdfExport();
    });
});
describe('Gantt PDF Export with eventmarker', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                eventMarkers: [
                    {
                        day: '04/02/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with eventMarker', () => {
        let pdfExportProperties = {
            ganttStyle: {
                font: new PdfTrueTypeFont(adventProFont, 12)
            }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
});
describe('Gantt PDF Export with eventmarker without label', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                eventMarkers: [
                    {
                        day: '04/02/2019',
                        cssClass: 'e-custom-event-marker',

                    }
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with eventMarker without lable', () => {
        ganttObj.pdfExport();
    });
});
describe('Gantt PDF Export indicator', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttData1,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                toolbarClick: (args?: any) => {
                    if (args.item.id === 'ganttContainer_pdfexport') {
                        ganttObj.pdfExport();
                    }
                }
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with indicator', () => {
        ganttObj.pdfExport();
    });
});
describe('Gantt PDF Export with eventmarker without empty  label', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                eventMarkers: [
                    {
                        label: '',
                        day: '04/02/2019',
                        cssClass: 'e-custom-event-marker',

                    }
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with eventMarker without empty lable', () => {
        ganttObj.pdfExport();
    });
});
describe('Gantt PDF Export with customization of header and footer', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it("Export data with header and footer", () => {
        ganttObj.pdfExportModule.helper['getHorizontalAlignment']('Right',undefined);
        ganttObj.pdfExportModule.helper['getHorizontalAlignment']('Centre',undefined);
        ganttObj.pdfExportModule.helper['getHorizontalAlignment']('Justify',undefined);
        ganttObj.pdfExportModule.helper['getHorizontalAlignment']('Left',undefined);
        ganttObj.pdfExportModule.helper['getFontFamily']('TimesRoman');
        ganttObj.pdfExportModule.helper['getFontFamily']('Courier');
        ganttObj.pdfExportModule.helper['getFontFamily']('Symbol');
        ganttObj.pdfExportModule.helper['getFontFamily']('ZapfDingbats');
        let exportProperties: PdfExportProperties = {
            header: {
                fromTop: 0,
                height: 150,
                contents: [
                    {
                        type: 'Text',
                        value: 'INVOICE',
                        position: { x: 380, y: 0 },
                        style: { textBrushColor: '#C25050', fontSize: 25 },
                    },
                    {
                        type: 'Text',
                        value: 'INVOICE NUMBER',
                        position: { x: 700, y: 30 },
                        style: { textBrushColor: '#C67878', fontSize: 10 },
                    },
                    {
                        type: 'Text',
                        value: 'Date',
                        position: { x: 800, y: 30 },
                        style: { textBrushColor: '#C67878', fontSize: 10 },
                    },
                    {
                        type: 'Text',
                        value: '223344',
                        position: { x: 700, y: 50 },
                        style: { textBrushColor: '#000000', fontSize: 10 },
                    },
                    {
                        type: 'Text',
                        value: 'CUSTOMER ID',
                        position: { x: 700, y: 70 },
                        style: { textBrushColor: '#C67878', fontSize: 10 },
                    },
                    {
                        type: 'Text',
                        value: 'TERMS',
                        position: { x: 800, y: 70 },
                        style: { textBrushColor: '#C67878', fontSize: 10 },
                    }, {
                        type: 'Text',
                        value: '223',
                        position: { x: 700, y: 90 },
                        style: { textBrushColor: '#000000', fontSize: 10 },
                    },
                    {
                        type: 'Text',
                        value: 'Net 30 days',
                        position: { x: 800, y: 90 },
                        style: { textBrushColor: '#000000', fontSize: 10 },
                    },
                    {
                        type: 'Text',
                        value: 'Adventure Traders',
                        position: { x: 20, y: 30 },
                        style: { textBrushColor: '#C67878', fontSize: 20 }
                    },
                    {
                        type: 'Text',
                        value: '2501 Aerial Center Parkway',
                        position: { x: 20, y: 65 },
                        style: { textBrushColor: '#000000', fontSize: 11 }
                    },
                    {
                        type: 'Text',
                        value: 'Tel +1 888.936.8638 Fax +1 919.573.0306',
                        position: { x: 20, y: 80 },
                        style: { textBrushColor: '#000000', fontSize: 11 }
                    },
                    {
                        type: 'Image',
                        src: image,
                        position: { x: 400, y: 70 },
                        size: { height: 50, width: 50 },
                    },

                ]
            },
            footer: {
                fromBottom: 160,
                height: 100,
                contents: [
                    {
                        type: 'Text',
                        value: 'Thank you for your business !',
                        position: { x: 350, y: 40 },
                        style: { textBrushColor: '#C67878', fontSize: 14 }
                    },
                    {
                        type: 'PageNumber',
                        pageNumberType: 'LowerRoman',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        size: { height: 50, width: 100 },
                        style: { textBrushColor: '#000000', hAlign: 'Center', vAlign: 'Bottom' }
                    },
                    {
                        type: 'PageNumber',
                        position: { x: 250, y: 10 },
                        pageNumberType:'UpperLatin',
                        style: { textBrushColor: '#C67878', fontSize: 14 }
                    },
                    {
                        type: 'Image',
                        src: image,
                        position: { x: 400, y: 70 },
                        size: { height: 50, width: 50 },
                    },
                    {
                        type: 'Line',
                        points: { x1: 400, y1: 90, x2: 450, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'Dash'
                        }
                    },
                ]
            },
        };
        ganttObj.pdfExport(exportProperties, true);
    });
});
describe('Gantt PDF Export with holiday label', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                eventMarkers: [
                    {
                        day: '04/02/2019',
                        cssClass: 'e-custom-event-marker',

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
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with holiday lable', () => {
        var exportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
            }
        };
        ganttObj.pdfExport(exportProperties);
    });
});
describe('Gantt PDF Export  with number taskname', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: "1project",
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                eventMarkers: [
                    {
                        day: '04/02/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                labelSettings: {
                    taskLabel: 'TaskName',
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with long text', () => {
        ganttObj.pdfExport();
    });
});
describe('Gantt PDF Export  with number taskname', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: "1project",
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                eventMarkers: [
                    {
                        day: '04/02/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                labelSettings: {
                    taskLabel: 'TaskName',
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with long text', () => {
        ganttObj.pdfExport();
    });
});
describe('Gantt PDF Export for resource', () => {

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
                            Progress: 30, work: 10, resourceInfo: [{ resourceId: 1, resourceUnit: 50 }]
                        },
                        {
                            TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                            resourceInfo: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                        },
                        {
                            TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                            resourceInfo: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                        },
                    ]
                }],
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
                    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' }],
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resourceInfo',
                    work: 'work',
                    child: 'subtasks',
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
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'resourceInfo', headerText: 'ResourceInfo' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export with resource data', () => {
        ganttObj.pdfExport();
    });
});
describe('Gantt PDF Export', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export with custom date format', () => {
        ganttObj.pdfExport();
    });
});
describe('Gantt PDF Export with critical task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Project Initiation',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Identify Site location', Duration: 3, Progress: 50 },
                            { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Progress: 50 },
                            { TaskID: 4, TaskName: 'Soil test approval', EndDate: new Date('04/08/2019'), Progress: 50 },
                        ]
                    }],
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    args.taskbar.progressColor = new PdfColor(205, 92, 92);
                    args.taskbar.taskColor = args.taskbar.taskBorderColor = new PdfColor(240, 128, 128);
                    args.taskbar.progressFontColor = new PdfColor(105, 92, 92);
                    args.taskbar.milestoneColor = new PdfColor(240, 128, 128);

                },
                enableCriticalPath: true,
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy', },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                allowUnscheduledTasks: true,
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export with custom date format', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'Ledger'
        };
        ganttObj.pdfExport(exportProperties);
    });
});
describe('Gantt PDF Export with empty gantt', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with empty gantt', () => {
        ganttObj.pdfExport();
    });
});
describe('Gantt PDF Export for connector lines', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', Predecessor: '3FS', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: '4FF',
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "10FF", Progress: 30 },
                        ]
                    },
                    { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
                    {
                        TaskID: 6,
                        TaskName: 'Market Research',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 7,
                                TaskName: 'Demand Analysis',
                                StartDate: new Date('04/04/2019'),
                                EndDate: new Date('04/21/2019'),
                                subtasks: [
                                    { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                                    { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "20FF" }
                                ]
                            },
                            { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8", Progress: 30 },
                            { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9SS" },
                            { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10FF" }
                        ]
                    },
                    {
                        TaskID: 13,
                        TaskName: 'Product Design and Development',
                        StartDate: new Date('04/04/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 14, TaskName: 'Functionality design', StartDate: new Date('04/04/2019'), Duration: 7, Progress: 30, Predecessor: '19SF', },
                            { TaskID: 15, TaskName: 'Quality design', StartDate: new Date('04/04/2019'), Duration: 5, Predecessor: '14SS', },
                            { TaskID: 16, TaskName: 'Define Reliability', StartDate: new Date('04/04/2019'), Duration: 5, Progress: 30 },
                            { TaskID: 17, TaskName: 'Identifying raw materials ', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: '5FS', },
                            {
                                TaskID: 18,
                                TaskName: 'Define cost plan',
                                StartDate: new Date('04/04/2019'),
                                EndDate: new Date('04/21/2019'),
                                subtasks: [
                                    { TaskID: 19, TaskName: 'Manufacturing cost', StartDate: new Date('04/04/2019'), Duration: 1, Progress: 30, Predecessor: '12SS' },
                                    { TaskID: 20, TaskName: 'Selling cost', StartDate: new Date('04/04/2019'), Duration: 1, Predecessor: '12SF', }
                                ]
                            },
                            {
                                TaskID: 21,
                                TaskName: 'Development of the final design',
                                StartDate: new Date('04/04/2019'),
                                EndDate: new Date('04/21/2019'),
                                subtasks: [
                                    { TaskID: 22, TaskName: 'Defining dimensions and package volume', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30, Predecessor: '33SF' },
                                    { TaskID: 23, TaskName: 'Develop design to meet industry standards', StartDate: new Date('04/04/2019'), Duration: 3 },
                                    { TaskID: 24, TaskName: 'Include all the details', StartDate: new Date('04/04/2019'), Duration: 5, Predecessor: '22FS', }
                                ]
                            },
                            { TaskID: 25, TaskName: 'CAD Computer-aided design', StartDate: new Date('04/04/2019'), Duration: 10, Progress: 30, Predecessor: '34SF' },
                            { TaskID: 26, TaskName: 'CAM Computer-aided manufacturing', StartDate: new Date('04/04/2019'), Duration: 10 }
                        ]
                    },
                    { TaskID: 27, TaskName: 'Prototype Testing', StartDate: new Date('04/04/2019'), Duration: 12, Progress: 30, Predecessor: '10SF', },
                    { TaskID: 28, TaskName: 'Include feedback', StartDate: new Date('04/04/2019'), Duration: 5, Predecessor: '9FF', },
                    { TaskID: 29, TaskName: 'Manufacturing', StartDate: new Date('04/04/2019'), Duration: 9, Progress: 30, Predecessor: '8FS', },
                    { TaskID: 30, TaskName: 'Assembling materials to finished goods', StartDate: new Date('04/04/2019'), Duration: 12, Predecessor: '7SS', },
                    {
                        TaskID: 31,
                        TaskName: 'Feedback and Testing',
                        StartDate: new Date('04/04/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 32, TaskName: 'Internal testing and feedback', StartDate: new Date('04/04/2019'), Duration: 5, Progress: 30 },
                            { TaskID: 33, TaskName: 'Customer testing and feedback', StartDate: new Date('04/04/2019'), Duration: 7, Progress: 30 }
                        ]
                    },
                    {
                        TaskID: 34,
                        TaskName: 'Product Development',
                        StartDate: new Date('04/04/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 35, TaskName: 'Important improvements', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30, Predecessor: '4SS', },
                            { TaskID: 36, TaskName: 'Address any unforeseen issues', StartDate: new Date('04/04/2019'), Duration: 2, Progress: 30 }
                        ]
                    },
                    {
                        TaskID: 37,
                        TaskName: 'Final Product',
                        StartDate: new Date('04/04/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 38, TaskName: 'Branding product', StartDate: new Date('04/04/2019'), Duration: 5 },
                            { TaskID: 39, TaskName: 'Marketing and pre-sales', StartDate: new Date('04/04/2019'), Duration: 10, Progress: 30, Predecessor: '5FS', }
                        ]
                    }
                ],
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                pdfQueryTimelineCellInfo: (args: any) => {
                    args.timelineCell.backgroundColor = new PdfColor(240, 248, 255);

                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px'
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data for connector lines', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'Letter11x17'
        };
        ganttObj.pdfExport(exportProperties);
    });
});
describe('Gantt PDF Export with grid width', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: pdfData1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with holiday lable', () => {
        var exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
                gridWidth: '50%'
            },
            pageSize : 'HalfLetter'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with chart width', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: pdfData1,
                allowPdfExport: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    }
                },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                toolbar: ['PdfExport'],
                columns: [
                    { field: 'TaskID', headerTextAlign: 'Right' },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    }
                ],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with holiday lable', () => {
        var exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
                chartWidth: '50%'
            },
            pageSize : 'Flsa'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with customZoomingLevels with fittowidth ', () => {
    let ganttObj: Gantt;
    let customZoomingLevels: ZoomTimelineSettings[] = [{
        topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd', count: 1 }, timelineUnitSize: 33, level: 0,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true,
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 66, level: 1,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 30, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 99, level: 2,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 33, level: 3,
        timelineViewMode: 'Week', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 66, level: 4,
        timelineViewMode: 'Week', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 66, level: 5,
        timelineViewMode: 'Day', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 6 }, timelineUnitSize: 99, level: 6,
        timelineViewMode: 'Day', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: customZoomingdata,
                allowPdfExport: true,
                dataBound: function () {
                    ganttObj.zoomingLevels = customZoomingLevels;
                },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with customZoomingLevels', () => {
        var exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            },
            pageSize:'Arche'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with customZoomingLevels ', () => {
    let ganttObj: Gantt;
    let customZoomingLevels: ZoomTimelineSettings[] = [{
        topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd', count: 1 }, timelineUnitSize: 33, level: 0,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true,
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 66, level: 1,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 30, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 99, level: 2,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 33, level: 3,
        timelineViewMode: 'Week', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 66, level: 4,
        timelineViewMode: 'Week', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 66, level: 5,
        timelineViewMode: 'Day', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 6 }, timelineUnitSize: 99, level: 6,
        timelineViewMode: 'Day', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: customZoomingdata,
                allowPdfExport: true,
                dataBound: function () {
                    ganttObj.zoomingLevels = customZoomingLevels;
                },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with customZoomingLevels', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'Archd'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with column header template with fittowidth', () => {
    let ganttObj: Gantt;
    let i: number = 0;
    let pdfColumnHeaderQueryCellInfo = (args: any) => {
        let base64Array: Object[] = [
            { 'TaskName': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABgAAQEBAQEAAAAAAAAAAAAAAAYIAAcF/8QALBAAAQQCAgEDAwIHAAAAAAAAAQIDBAUGBxESAAgTIRQVQRYxFzhXdpa01f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwB7gessOlaiw2zpdS4Ld2cqngOyl2rLbHcqjpLiy6IzylL7/gp/J+RxwQQt68w6mewu7XrfEKC+azXGuiqiO2r2ybqKnhD3stLVy2TyOg/cj5A5IXr4G8Cf9+aD0XT6K2Nb1GlsEgz4OJW8mLKjY5DaeYdRDdUhxC0thSVJUAQoEEEAjwNW2XoFprGLb1E/QEGdBeRJiyoztK08w6hQUhxC0kFKkqAIUCCCAR4CDD9sbV2RWSso19r3BrDGza2NfWWEnOH21T2Yst2MJKUs1ryAhwslSeHFfBHyRwSHnW26tv12qpO5Ier8GtMdYoVZI2qJm01L0iCGPfC0IeqEcKLfyErKT+DwfjwFvqO/l62h/Zl3/oveB0TwJTe2FRYxX5RqrLrj065HUuZRdzXIOQ7GRHc6yLV+YlmVDcgPJS6044AQVHhTY/I58Ao3lmJUeibfRWBZH6bKCFbUL1K7PTtRpTrzjsQRlzJCWqxoPyFISkqWepUQOfj48Ctdj4j/ABA15lGB/cPoP1JSzaj6v2vd+n+oYW17nTsnv1789ew5445H7+Ad+x+oX+qGu/8AA53/AGPA5drHb+D4rru/xSy3nrPG86i5hkwnOXDjbTIkG9lrU4qCqY271W0R0BfJSFI5UvqQQKWW5cOT6NMhxTZO+9d5Fl72ByIYjQrmM9LMo1oQll0iXIMuSH+3Z9BSlaiFBCeOSH//2Q==' },
            { 'StartDate': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABcAAQEBAQAAAAAAAAAAAAAAAAcABgX/xAAzEAAABAQDBwEGBwAAAAAAAAABAgMEBQYHEQgSEwAUFRYYITI0IiQxMzVCN0NRVWaCg//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAGBEBAQEBAQAAAAAAAAAAAAAAABEBIUH/2gAMAwEAAhEDEQA/AG2t2PafKP4qHFI3sLlRGR4bE4QlEIi4Yu1XqLJdBsq5UAU1spjEKqoJQBIfEoZTD8QCJcxxTdhwp3JlI6RxCQ5yYQmGOVYjEVYbE8oPVoi8VFNMVRanEoInbjcUvIxwAw27BTHjim7EfTuc6R1ciEhyawi0MbKw6IpQ2J5ReoxFmqCagpC6OBRRI4G4JeRSAJgv3B3ojj2nysGKhvSNlC5UWkeJROLpQ+It2LtJ6syQQcqtlBFRbKUxypJiYBSDyMGUo/AOtP7GoFVcRtTZRkWjGHiLcm8F3qKTvLi68Qd72wIoTMslm1MmmcgXAtigmAXsO1lSwYwJKqEwV0mLD8yw54TiTFLMNJFXblWUHAMjpHK2MAJnC5xNZ2n2EgB2N37BdCqOpVQl+uku4fnuHPCceYpmhp4q0cpSg4FkRIhXJhBQ42OBrNFOwEEO5e/cbIUnSAxqBSrEbTKUZ6oxh4hPOXGt1ikkS4uhEGm6MDqHyrK5dPPqEINgNcoqANrhskLWameB0/jWL2uPPWIuYaV6PLO68Jm5CB8SvCy58+qA62nYlreOqN/INmGiCT5cpetjBnmEvcV00w2XUIAio0ndKem6L2Jq5GN2ykQEMixQEygaYBcN3KH5Y7PTxThLlL0cYMjQlliummJS6vAFlHc7qz03WewxXI+s2TiABkRKIlTDTELjvBg/MDZ6eF+WIHT+C4vaHci4i5hqprczb1xabkI5w20LNkyaQBo6lz3v5aQW8R2aYz1VOkrq9rP1Sfx3gX1P9rJvPof8PP8Ar92zDQxLHQ71NzbzJ+EHBkuAfV/X5Gefw968t8+Z7P6fZs4dUz9DvU3KXLf4QcGV4/8AV/X5HmTz968tz+X7P6/fs4dM9K+krq9ox0t/yLjv1P8Aaz7t67/fw/t9uzTH/9k=' },
            { 'Progress': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABoAAAICAwAAAAAAAAAAAAAAAAAIAwUGBwn/xAArEAAABQIEBQQDAQAAAAAAAAABAgQFBgMHABESFAgTFSEiFhcxMiQzYWL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A6p4AwBgDAK3BuMx4n0rYrftUSgyaWSFuTuiVlVyt1LWLRroSria6pGUycDbYwHEAqjl9ft2wELJxwJ5HEJLPGZJbtQxRDZ9aV+pXwm13dUaSfwMwgc+o5RDwKbL5HIO+Ay6N8Q85l8QaZ5HYpbtWxPnP2Cv1g7U+dyao0qvgdkA5cjlEPIoZ5ZhmHfATzm+d2YC0vrm62ygympHm5Q6KkaSarjVjUaFA1c+gTtBaYm5ZREAE4Z/Hz2wC92j4bLmQW9EOvm+W2nNRwjrCgaVLIkpsFSieonZCNgmIrM8FMJREnNDOiA99P+sBUQng6m8OtDcq1XpO4iv3D6N+f02PU9jsFRq/6+ujzderT9iacs/L4wG3bbW5m9vbQxO1XtNcRf6X3/5/Lj1LcblUev8Ar6ybRp16fsOeWfb4wFvdxruZOmWYlY7FTmm4SJhXtKairVsFOiSooQnTAY9QroYwFAT6hyII9sv7gGcwBgDAGA//2Q==' }
        ]
        while (i < base64Array.length) {
            const key = Object.keys(base64Array[i])[0];
            const value = base64Array[i][key];
            if (key === args.column.field) {
                args.headerTemplate.image = [{
                    base64: value, width: 20, height: 20
                }];
                args.headerTemplate.value = args.column.field;
                args.headerTemplate.fontStyle.fontSize = 6;
                args.headerTemplate.fontStyle.fontColor = new PdfColor(255, 0, 0);
                break;
            }
            i++;
        }
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: templateData,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskName', width: 250 },
                    { field: 'StartDate' },
                    { field: 'Progress' }
                ],
                toolbar: ['PdfExport'],
                resources: projectResourcestemplate,
                pdfColumnHeaderQueryCellInfo: pdfColumnHeaderQueryCellInfo,
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('07/06/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with column template', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
                gridWidth: '50%'
            },
            pageSize :'Archc'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with column header template without image height and width', () => {
    let ganttObj: Gantt;
    let i: number = 0;
    let pdfColumnHeaderQueryCellInfo = (args: any) => {
        let base64Array: Object[] = [
            { 'TaskName': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABgAAQEBAQEAAAAAAAAAAAAAAAYIAAcF/8QALBAAAQQCAgEDAwIHAAAAAAAAAQIDBAUGBxESAAgTIRQVQRYxFzhXdpa01f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwB7gessOlaiw2zpdS4Ld2cqngOyl2rLbHcqjpLiy6IzylL7/gp/J+RxwQQt68w6mewu7XrfEKC+azXGuiqiO2r2ybqKnhD3stLVy2TyOg/cj5A5IXr4G8Cf9+aD0XT6K2Nb1GlsEgz4OJW8mLKjY5DaeYdRDdUhxC0thSVJUAQoEEEAjwNW2XoFprGLb1E/QEGdBeRJiyoztK08w6hQUhxC0kFKkqAIUCCCAR4CDD9sbV2RWSso19r3BrDGza2NfWWEnOH21T2Yst2MJKUs1ryAhwslSeHFfBHyRwSHnW26tv12qpO5Ier8GtMdYoVZI2qJm01L0iCGPfC0IeqEcKLfyErKT+DwfjwFvqO/l62h/Zl3/oveB0TwJTe2FRYxX5RqrLrj065HUuZRdzXIOQ7GRHc6yLV+YlmVDcgPJS6044AQVHhTY/I58Ao3lmJUeibfRWBZH6bKCFbUL1K7PTtRpTrzjsQRlzJCWqxoPyFISkqWepUQOfj48Ctdj4j/ABA15lGB/cPoP1JSzaj6v2vd+n+oYW17nTsnv1789ew5445H7+Ad+x+oX+qGu/8AA53/AGPA5drHb+D4rru/xSy3nrPG86i5hkwnOXDjbTIkG9lrU4qCqY271W0R0BfJSFI5UvqQQKWW5cOT6NMhxTZO+9d5Fl72ByIYjQrmM9LMo1oQll0iXIMuSH+3Z9BSlaiFBCeOSH//2Q==' },
            { 'StartDate': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABcAAQEBAQAAAAAAAAAAAAAAAAcABgX/xAAzEAAABAQDBwEGBwAAAAAAAAABAgMEBQYHEQgSEwAUFRYYITI0IiQxMzVCN0NRVWaCg//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAGBEBAQEBAQAAAAAAAAAAAAAAABEBIUH/2gAMAwEAAhEDEQA/AG2t2PafKP4qHFI3sLlRGR4bE4QlEIi4Yu1XqLJdBsq5UAU1spjEKqoJQBIfEoZTD8QCJcxxTdhwp3JlI6RxCQ5yYQmGOVYjEVYbE8oPVoi8VFNMVRanEoInbjcUvIxwAw27BTHjim7EfTuc6R1ciEhyawi0MbKw6IpQ2J5ReoxFmqCagpC6OBRRI4G4JeRSAJgv3B3ojj2nysGKhvSNlC5UWkeJROLpQ+It2LtJ6syQQcqtlBFRbKUxypJiYBSDyMGUo/AOtP7GoFVcRtTZRkWjGHiLcm8F3qKTvLi68Qd72wIoTMslm1MmmcgXAtigmAXsO1lSwYwJKqEwV0mLD8yw54TiTFLMNJFXblWUHAMjpHK2MAJnC5xNZ2n2EgB2N37BdCqOpVQl+uku4fnuHPCceYpmhp4q0cpSg4FkRIhXJhBQ42OBrNFOwEEO5e/cbIUnSAxqBSrEbTKUZ6oxh4hPOXGt1ikkS4uhEGm6MDqHyrK5dPPqEINgNcoqANrhskLWameB0/jWL2uPPWIuYaV6PLO68Jm5CB8SvCy58+qA62nYlreOqN/INmGiCT5cpetjBnmEvcV00w2XUIAio0ndKem6L2Jq5GN2ykQEMixQEygaYBcN3KH5Y7PTxThLlL0cYMjQlliummJS6vAFlHc7qz03WewxXI+s2TiABkRKIlTDTELjvBg/MDZ6eF+WIHT+C4vaHci4i5hqprczb1xabkI5w20LNkyaQBo6lz3v5aQW8R2aYz1VOkrq9rP1Sfx3gX1P9rJvPof8PP8Ar92zDQxLHQ71NzbzJ+EHBkuAfV/X5Gefw968t8+Z7P6fZs4dUz9DvU3KXLf4QcGV4/8AV/X5HmTz968tz+X7P6/fs4dM9K+krq9ox0t/yLjv1P8Aaz7t67/fw/t9uzTH/9k=' },
            { 'Progress': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABoAAAICAwAAAAAAAAAAAAAAAAAIAwUGBwn/xAArEAAABQIEBQQDAQAAAAAAAAABAgQFBgMHABESFAgTFSEiFhcxMiQzYWL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A6p4AwBgDAK3BuMx4n0rYrftUSgyaWSFuTuiVlVyt1LWLRroSria6pGUycDbYwHEAqjl9ft2wELJxwJ5HEJLPGZJbtQxRDZ9aV+pXwm13dUaSfwMwgc+o5RDwKbL5HIO+Ay6N8Q85l8QaZ5HYpbtWxPnP2Cv1g7U+dyao0qvgdkA5cjlEPIoZ5ZhmHfATzm+d2YC0vrm62ygympHm5Q6KkaSarjVjUaFA1c+gTtBaYm5ZREAE4Z/Hz2wC92j4bLmQW9EOvm+W2nNRwjrCgaVLIkpsFSieonZCNgmIrM8FMJREnNDOiA99P+sBUQng6m8OtDcq1XpO4iv3D6N+f02PU9jsFRq/6+ujzderT9iacs/L4wG3bbW5m9vbQxO1XtNcRf6X3/5/Lj1LcblUev8Ar6ybRp16fsOeWfb4wFvdxruZOmWYlY7FTmm4SJhXtKairVsFOiSooQnTAY9QroYwFAT6hyII9sv7gGcwBgDAGA//2Q==' }
        ]
        while (i < base64Array.length) {
            const key = Object.keys(base64Array[i])[0];
            const value = base64Array[i][key];
            if (key === args.column.field) {
                args.headerTemplate.image = [{
                    base64: value
                }];
                args.headerTemplate.value = args.column.field;
                args.headerTemplate.fontStyle.fontSize = 6;
                args.headerTemplate.fontStyle.fontColor = new PdfColor(255, 0, 0);
                break;
            }
            i++;
        }
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: templateData,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskName', width: 250 },
                    { field: 'StartDate' },
                    { field: 'Progress' }
                ],
                toolbar: ['PdfExport'],
                resources: projectResourcestemplate,
                pdfColumnHeaderQueryCellInfo: pdfColumnHeaderQueryCellInfo,
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('07/06/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with column template', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
                gridWidth: '50%'
            },
            pageSize : 'Archb'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with column header template', () => {
    let ganttObj: Gantt;
    let i: number = 0;
    let pdfColumnHeaderQueryCellInfo = (args: any) => {
        let base64Array: Object[] = [
            { 'TaskName': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABgAAQEBAQEAAAAAAAAAAAAAAAYIAAcF/8QALBAAAQQCAgEDAwIHAAAAAAAAAQIDBAUGBxESAAgTIRQVQRYxFzhXdpa01f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwB7gessOlaiw2zpdS4Ld2cqngOyl2rLbHcqjpLiy6IzylL7/gp/J+RxwQQt68w6mewu7XrfEKC+azXGuiqiO2r2ybqKnhD3stLVy2TyOg/cj5A5IXr4G8Cf9+aD0XT6K2Nb1GlsEgz4OJW8mLKjY5DaeYdRDdUhxC0thSVJUAQoEEEAjwNW2XoFprGLb1E/QEGdBeRJiyoztK08w6hQUhxC0kFKkqAIUCCCAR4CDD9sbV2RWSso19r3BrDGza2NfWWEnOH21T2Yst2MJKUs1ryAhwslSeHFfBHyRwSHnW26tv12qpO5Ier8GtMdYoVZI2qJm01L0iCGPfC0IeqEcKLfyErKT+DwfjwFvqO/l62h/Zl3/oveB0TwJTe2FRYxX5RqrLrj065HUuZRdzXIOQ7GRHc6yLV+YlmVDcgPJS6044AQVHhTY/I58Ao3lmJUeibfRWBZH6bKCFbUL1K7PTtRpTrzjsQRlzJCWqxoPyFISkqWepUQOfj48Ctdj4j/ABA15lGB/cPoP1JSzaj6v2vd+n+oYW17nTsnv1789ew5445H7+Ad+x+oX+qGu/8AA53/AGPA5drHb+D4rru/xSy3nrPG86i5hkwnOXDjbTIkG9lrU4qCqY271W0R0BfJSFI5UvqQQKWW5cOT6NMhxTZO+9d5Fl72ByIYjQrmM9LMo1oQll0iXIMuSH+3Z9BSlaiFBCeOSH//2Q==' },
            { 'StartDate': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABcAAQEBAQAAAAAAAAAAAAAAAAcABgX/xAAzEAAABAQDBwEGBwAAAAAAAAABAgMEBQYHEQgSEwAUFRYYITI0IiQxMzVCN0NRVWaCg//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAGBEBAQEBAQAAAAAAAAAAAAAAABEBIUH/2gAMAwEAAhEDEQA/AG2t2PafKP4qHFI3sLlRGR4bE4QlEIi4Yu1XqLJdBsq5UAU1spjEKqoJQBIfEoZTD8QCJcxxTdhwp3JlI6RxCQ5yYQmGOVYjEVYbE8oPVoi8VFNMVRanEoInbjcUvIxwAw27BTHjim7EfTuc6R1ciEhyawi0MbKw6IpQ2J5ReoxFmqCagpC6OBRRI4G4JeRSAJgv3B3ojj2nysGKhvSNlC5UWkeJROLpQ+It2LtJ6syQQcqtlBFRbKUxypJiYBSDyMGUo/AOtP7GoFVcRtTZRkWjGHiLcm8F3qKTvLi68Qd72wIoTMslm1MmmcgXAtigmAXsO1lSwYwJKqEwV0mLD8yw54TiTFLMNJFXblWUHAMjpHK2MAJnC5xNZ2n2EgB2N37BdCqOpVQl+uku4fnuHPCceYpmhp4q0cpSg4FkRIhXJhBQ42OBrNFOwEEO5e/cbIUnSAxqBSrEbTKUZ6oxh4hPOXGt1ikkS4uhEGm6MDqHyrK5dPPqEINgNcoqANrhskLWameB0/jWL2uPPWIuYaV6PLO68Jm5CB8SvCy58+qA62nYlreOqN/INmGiCT5cpetjBnmEvcV00w2XUIAio0ndKem6L2Jq5GN2ykQEMixQEygaYBcN3KH5Y7PTxThLlL0cYMjQlliummJS6vAFlHc7qz03WewxXI+s2TiABkRKIlTDTELjvBg/MDZ6eF+WIHT+C4vaHci4i5hqprczb1xabkI5w20LNkyaQBo6lz3v5aQW8R2aYz1VOkrq9rP1Sfx3gX1P9rJvPof8PP8Ar92zDQxLHQ71NzbzJ+EHBkuAfV/X5Gefw968t8+Z7P6fZs4dUz9DvU3KXLf4QcGV4/8AV/X5HmTz968tz+X7P6/fs4dM9K+krq9ox0t/yLjv1P8Aaz7t67/fw/t9uzTH/9k=' },
            { 'Progress': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABoAAAICAwAAAAAAAAAAAAAAAAAIAwUGBwn/xAArEAAABQIEBQQDAQAAAAAAAAABAgQFBgMHABESFAgTFSEiFhcxMiQzYWL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A6p4AwBgDAK3BuMx4n0rYrftUSgyaWSFuTuiVlVyt1LWLRroSria6pGUycDbYwHEAqjl9ft2wELJxwJ5HEJLPGZJbtQxRDZ9aV+pXwm13dUaSfwMwgc+o5RDwKbL5HIO+Ay6N8Q85l8QaZ5HYpbtWxPnP2Cv1g7U+dyao0qvgdkA5cjlEPIoZ5ZhmHfATzm+d2YC0vrm62ygympHm5Q6KkaSarjVjUaFA1c+gTtBaYm5ZREAE4Z/Hz2wC92j4bLmQW9EOvm+W2nNRwjrCgaVLIkpsFSieonZCNgmIrM8FMJREnNDOiA99P+sBUQng6m8OtDcq1XpO4iv3D6N+f02PU9jsFRq/6+ujzderT9iacs/L4wG3bbW5m9vbQxO1XtNcRf6X3/5/Lj1LcblUev8Ar6ybRp16fsOeWfb4wFvdxruZOmWYlY7FTmm4SJhXtKairVsFOiSooQnTAY9QroYwFAT6hyII9sv7gGcwBgDAGA//2Q==' }
        ]
        while (i < base64Array.length) {
            const key = Object.keys(base64Array[i])[0];
            const value = base64Array[i][key];
            if (key === args.column.field) {
                args.headerTemplate.image = [{
                    base64: value
                }];
                args.headerTemplate.value = args.column.field;
                args.headerTemplate.fontStyle.fontSize = 6;
                args.headerTemplate.fontStyle.fontColor = new PdfColor(255, 0, 0);
                break;
            }
            i++;
        }
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: templateData,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskName', width: 250 },
                    { field: 'StartDate' },
                    { field: 'Progress' }
                ],
                toolbar: ['PdfExport'],
                resources: projectResourcestemplate,
                pdfColumnHeaderQueryCellInfo: pdfColumnHeaderQueryCellInfo,
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('07/06/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with column template', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'Archa'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with virtualization', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: virtual1,
                allowPdfExport: true,
                enableTimelineVirtualization: true,
                enableVirtualization: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with virtualization', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
                gridWidth: '50%'
            },
            pageSize : 'B5'
        };
        ganttObj.pdfExport(exportProperties);
    });
    it('Export data with virtualization', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with virtualization', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: virtual1,
                allowPdfExport: true,
                enableTimelineVirtualization: true,
                enableVirtualization: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                timelineSettings: {
                    bottomTier: {
                        unit: 'Month',
                        count: 1
                    }
                },
                height: '450px',
            }, done);
    });
    it('Export data with virtualization', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
                gridWidth: '50%'
            },
            showPredecessorLines: false,
            pageSize : 'B4'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
})
describe('Gantt PDF Export with critical task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: criticalData1,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    args.taskbar.progressColor = new PdfColor(205, 92, 92);
                    args.taskbar.taskColor = args.taskbar.taskBorderColor = new PdfColor(240, 128, 128);
                    args.taskbar.progressFontColor = new PdfColor(105, 92, 92);
                    args.taskbar.milestoneColor = new PdfColor(240, 128, 128);

                },
                enableCriticalPath: true,
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy', },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                connectorLineWidth: 7,
                allowUnscheduledTasks: true,
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it('Export with custom date format', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            },
            showPredecessorLines: true,
            pageSize : 'B3'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with resource', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData1,
                resources: resourceCollection1,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
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
                    child: 'subtasks'
                },
                renderBaseline: true,
                allowPdfExport: true,
                baselineColor: 'red',
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
                    { field: 'resources', headerText: 'resources' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Gantt PDF Export with resource', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'B2'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with column template', () => {
    let ganttObj: Gantt;
    function pdfQueryCellInfo(args: PdfQueryCellInfoEventArgs): any {
        if (args.column.headerText === 'Resources') {
            {
                args.image = { height: 40, width: 40, base64: (args as any).data.taskData.resourcesImage };
            }
        }
        if (args.column.headerText === 'Email ID') {
            args.hyperLink = {
                target: 'mailto:' + (args as any).data.taskData.EmailId,
                displayText: (args as any).data.taskData.EmailId
            };
        }
        args.style.fontBrush =  new PdfColor(205, 92, 92);
        args.style.fontFamily =  2;
        args.style.fontStyle = 2;
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
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
                toolbar: ['PdfExport'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Left' },
                    { field: 'TaskName', headerText: 'Task Name', width: '250' },
                    { field: 'resources', headerText: 'Resources', width: '250', template: '#columnTemplate' },
                    { field: 'EmailId', headerText: 'Email ID', template: '#template2', width: 180 }
                ],
                allowExcelExport: true,
                pdfQueryCellInfo: pdfQueryCellInfo,
                allowPdfExport: true,
                allowSelection: true,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Gantt PDF Export with column template', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'B1'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with column template with fittowidth', () => {
    let ganttObj: Gantt;
    function pdfQueryCellInfo(args: PdfQueryCellInfoEventArgs): any {
        if (args.column.headerText === 'Resources') {
            {
                args.image = { height: 40, width: 40, base64: (args as any).data.taskData.resourcesImage };
            }
        }
        if (args.column.headerText === 'Email ID') {
            args.hyperLink = {
                target: 'mailto:' + (args as any).data.taskData.EmailId,
                displayText: (args as any).data.taskData.EmailId
            };
        }
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
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
                toolbar: ['PdfExport'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Left' },
                    { field: 'TaskName', headerText: 'Task Name', width: '250' },
                    { field: 'resources', headerText: 'Resources', width: '250', template: '#columnTemplate' },
                    { field: 'EmailId', headerText: 'Email ID', template: '#template2', width: 180 }
                ],
                allowExcelExport: true,
                pdfQueryCellInfo: pdfQueryCellInfo,
                allowPdfExport: true,
                allowSelection: true,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Gantt PDF Export with column template', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            },
            showPredecessorLines: true,
            pageSize : 'B0'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with column template without height and width to image', () => {
    let ganttObj: Gantt;
    function pdfQueryCellInfo(args: PdfQueryCellInfoEventArgs): any {
        if (args.column.headerText === 'Resources') {
            {
                args.image = { base64: (args as any).data.taskData.resourcesImage };
            }
        }
        if (args.column.headerText === 'Email ID') {
            args.hyperLink = {
                target: 'mailto:' + (args as any).data.taskData.EmailId,
            };
        }
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
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
                toolbar: ['PdfExport'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Left' },
                    { field: 'TaskName', headerText: 'Task Name', width: '250' },
                    { field: 'resources', headerText: 'Resources', width: '250', template: '#columnTemplate' },
                    { field: 'EmailId', headerText: 'Email ID', template: '#template2', width: 180 }
                ],
                allowExcelExport: true,
                pdfQueryCellInfo: pdfQueryCellInfo,
                allowPdfExport: true,
                allowSelection: true,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Gantt PDF Export with column template', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'A9'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with splitask', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasks,
                allowPdfExport: true,
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
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with splittask', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'A8'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with splitask with fittowidth', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasks,
                allowPdfExport: true,
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
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with splittaskb with fittowidth', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            },
            pageSize: 'A7',
            showPredecessorLines: true
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with tasklabel template', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    args.labelSettings.leftLabel.value = args.data.ganttProperties.taskName + '[' + args.data.ganttProperties.progress + ']';
                    args.labelSettings.leftLabel.fontStyle.fontSize = 6;
                    if (args.data.ganttProperties.resourceNames) {
                        args.labelSettings.rightLabel.value = args.data.ganttProperties.resourceNames;
                        args.labelSettings.rightLabel.fontStyle.fontSize = 6;
                        args.labelSettings.rightLabel.image = [{
                            base64: (args as any).data.taskData.resourcesImage, width: 20, height: 20
                        }]

                    }
                    args.labelSettings.taskLabel.value = args.data.ganttProperties.progress + '%';
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with tasklabel template', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    args.labelSettings.rightLabel.value = args.data.ganttProperties.taskName + '[' + args.data.ganttProperties.progress + ']';
                    args.labelSettings.rightLabel.fontStyle.fontSize = 6;
                    if (args.data.ganttProperties.resourceNames) {
                        args.labelSettings.leftLabel.value = args.data.ganttProperties.resourceNames;
                        args.labelSettings.leftLabel.fontStyle.fontSize = 6;
                        args.labelSettings.leftLabel.image = [{
                            base64: (args as any).data.taskData.resourcesImage
                        }]

                    }
                    args.labelSettings.taskLabel.value = args.data.ganttProperties.progress + '%';
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with tasklabel template fittowidth', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    args.labelSettings.leftLabel.value = args.data.ganttProperties.taskName + '[' + args.data.ganttProperties.progress + ']';
                    args.labelSettings.leftLabel.fontStyle.fontSize = 6;
                    if (args.data.ganttProperties.resourceNames) {
                        args.labelSettings.rightLabel.value = args.data.ganttProperties.resourceNames;
                        args.labelSettings.rightLabel.fontStyle.fontSize = 6;
                        args.labelSettings.rightLabel.image = [{
                            base64: (args as any).data.taskData.resourcesImage, width: 20, height: 20
                        }]

                    }
                    args.labelSettings.taskLabel.value = args.data.ganttProperties.progress + '%';
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            },
            showPredecessorLines: true
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with taskbar template', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',

                        }
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                            fontSize : 12
                        }
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20,
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontColor: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            }
                    }
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'A6'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with taskbar template', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',

                        }
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',

                        }
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20,
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontColor: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            }
                    }
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            },
            showPredecessorLines: true,
            pageSize : 'A5'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with customization of header and footer', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: headerFooter,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 100);
    });
    it("Export data with header and footer", () => {
        let exportProperties: PdfExportProperties = {
            header: {
                fromTop: 0,
                height: 150,
                contents: [
                    {
                        type: 'Text',
                        value: null,
                        position: { x: 380, y: 0 },
                        style: { penColor: '#C25050', penSize: 25, },
                    },
                    {
                        type: 'Image',
                        src: '',
                        position: { x: 400, y: 70 },
                        size: { height: 50, width: 50 },
                    },
                ]
            },
            footer: {
                fromBottom: 160,
                height: 100,
                contents: [
                    {
                        type: 'Text',
                        value: 'Thank you for your business !',
                        position: { x: 350, y: 40 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Top' }
                    },
                    {
                        type: 'PageNumber',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        size: { height: 50, width: 100 },
                        style: { textBrushColor: '#000000', hAlign: 'Center', vAlign: 'Bottom' }
                    },
                    {
                        type: 'PageNumber',
                        position: { x: 250, y: 10 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Middle' }
                    },
                    {
                        type: 'Line',
                        points: { x1: 400, y1: 90, x2: 450, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'Dash'
                        }
                    },
                    {
                        type: 'Line',
                        points: { x1: 200, y1: 40, x2: 150, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'Dot'
                        }
                    },

                ]
            },
            pageSize: 'A4'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with customization of header and footer with fittowidth', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: headerFooter,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 100);
    });
    it("Export data with header and footer", () => {
        let exportProperties: PdfExportProperties = {
            header: {
                fromTop: 0,
                height: 150,
                contents: [
                    {
                        type: 'Text',
                        value: 'invoice',
                        position: { x: 380, y: 0 },
                        style: { penColor: '#C25050', penSize: 25, },
                    },
                    {
                        type: 'Image',
                        src: images,
                        position: { x: 400, y: 70 },
                        size: { height: 50, width: 50 },
                    },
                ]
            },
            footer: {
                fromBottom: 160,
                height: 100,
                contents: [
                    {
                        type: 'Text',
                        value: 'Thank you for your business !',
                        position: { x: 350, y: 40 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Top' }
                    },
                    {
                        type: 'PageNumber',
                        pageNumberType: 'UpperRoman',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        size: { height: 50, width: 100 },
                        style: { textBrushColor: '#000000', hAlign: 'Center', vAlign: 'Bottom' }
                    },
                    {
                        type: 'PageNumber',
                        position: { x: 250, y: 10 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Middle' }
                    },
                    {
                        type: 'Line',
                        points: { x1: 400, y1: 90, x2: 450, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'Dash'
                        }
                    },
                    {
                        type: 'Line',
                        points: { x1: 200, y1: 40, x2: 150, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'Dot'
                        }
                    },

                ]
            },
            fitToWidthSettings:{
                isFitToWidth : true
            },
            pageSize:'A3'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with eventmarker with fittowidth', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: headerFooter,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                eventMarkers: [
                    {
                        day: '04/02/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it('Export data with eventMarker', () => {
        let exportProperties :PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
            },
            pageSize: 'A2'
        
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Gantt PDF Export with orientation', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it('Export with Orientation', () => {
        let exportProperties: PdfExportProperties = {
            pageOrientation: 'Portrait',
            pageSize:'A1'
         };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with CurrentViewData fittowidth', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it('Export with CurrentViewData', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings:{
                isFitToWidth: true
            },
            exportType: 'CurrentViewData',
            pageSize:'A0'
         };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with AllData fittowidth', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it('Export with AllData', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings:{
                isFitToWidth: true
            },
            exportType: 'AllData',
            pageSize : 'Legal'
         };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with CurrentViewData', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it('Export with CurrentViewData', () => {
        let exportProperties: PdfExportProperties = {
            exportType: 'CurrentViewData',
            fileName:'abv',
            pageSize :'Note'
         };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with AllData', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it('Export with AllData', () => {
        let exportProperties: PdfExportProperties = {
            exportType: 'AllData',
            pageSize: 'Letter',
            theme:"Fabric"
         };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with highlightWeekends', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: weekEndData,
                allowPdfExport: true,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                allowExcelExport: true,
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
                 { fields: ['TaskName', 'Duration'] 
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
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                toolbar: ['PdfExport'],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                treeColumnIndex: 0
            }, done);
    });
    it('Export with AllData', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with highlightWeekends with botom tier as none', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: weekEndData,
                allowPdfExport: true,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                allowExcelExport: true,
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
                        unit: 'None',
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
                 { fields: ['TaskName', 'Duration'] 
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
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                toolbar: ['PdfExport'],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                treeColumnIndex: 0
            }, done);
    });
    it('Export with AllData', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with highlightWeekends with top tier as Day', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: weekEndData,
                allowPdfExport: true,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                allowExcelExport: true,
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
                        unit: 'Day',
                        format: 'dd/MM/yyyy'
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
                 { fields: ['TaskName', 'Duration'] 
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
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                toolbar: ['PdfExport'],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                treeColumnIndex: 0
            }, done);
    });
    it('Export with AllData', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with timeline cell formating', () => {
    let ganttObj: Gantt;
    let pdfQueryTimelineCellInfo: any = (args: PdfQueryTimelineCellInfoEventArgs) => {
        args.timelineCell.backgroundColor= new PdfColor(240, 248, 255);
        args.timelineCell.padding.left =2
        args.timelineCell.padding.top =2
    };
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: weekEndData,
                allowPdfExport: true,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                pdfQueryTimelineCellInfo: pdfQueryTimelineCellInfo,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                allowExcelExport: true,
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
                        unit: 'Day',
                        format: 'dd/MM/yyyy'
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
                 { fields: ['TaskName', 'Duration'] 
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
               connectorLineBackground: "red",
               connectorLineWidth: 2,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                toolbar: ['PdfExport'],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                treeColumnIndex: 0
            }, done);
    });
    it('Export with AllData', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with custom timeline settings', () => {
    let ganttObj: Gantt;
    let customZoomingLevels: ZoomTimelineSettings[] = [{
        topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd', count: 1 }, timelineUnitSize: 33, level: 0,
        timelineViewMode: 'Month', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 66, level: 1,
        timelineViewMode: 'Month', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 99, level: 2,
        timelineViewMode: 'Month', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 33, level: 3,
        timelineViewMode: 'Week', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 66, level: 4,
        timelineViewMode: 'Week', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 66, level: 5,
        timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 6 }, timelineUnitSize: 99, level: 6,
        timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: weekEndData,
                allowPdfExport: true,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                dataBound: function () {
                    ganttObj.zoomingLevels = customZoomingLevels;
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                allowExcelExport: true,
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
                        unit: 'Day',
                        format: 'dd/MM/yyyy'
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
                 { fields: ['TaskName', 'Duration'] 
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
               connectorLineBackground: "red",
               connectorLineWidth: 2,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                toolbar: ['PdfExport'],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                treeColumnIndex: 0
            }, done);
    });
    it('Export with custom timeline settings', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with timeline settings', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: weekEndData,
                allowPdfExport: true,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                allowExcelExport: true,
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
                    topTier: {
                        unit: 'Month',
                        count: 3,
                        formatter: (date) => {
                            var month = date.getMonth();
                            if (month >= 0 && month <= 2) {
                                return 'Q1';
                            } else if (month >= 3 && month <= 5) {
                                return 'Q2';
                            } else if (month >= 6 && month <= 8) {
                                return 'Q3';
                            } else {
                                return 'Q4';
                            }
            
                        }
                    },
                    bottomTier: {
                        unit: 'Month',
                        format: 'MMM'
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
                 { fields: ['TaskName', 'Duration'] 
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
               connectorLineBackground: "red",
               connectorLineWidth: 2,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                toolbar: ['PdfExport'],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                treeColumnIndex: 0
            }, done);
    });
    it('Export with timeline settings', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with timeline settings', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: weekEndData,
                allowPdfExport: true,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                allowExcelExport: true,
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
                    timelineViewMode: 'Year',
                    timelineUnitSize: 70,
                    updateTimescaleView: false
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
                 { fields: ['TaskName', 'Duration'] 
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
               connectorLineBackground: "red",
               connectorLineWidth: 2,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                toolbar: ['PdfExport'],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                treeColumnIndex: 0
            }, done);
    });
    it('Export with timeline settings', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                loadingIndicator: { indicatorType: 'Shimmer' },
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                toolbarClick: (args?: ClickEventArgs) => {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        ganttObj.pdfExport();
                    }
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export with custom date format', () => {
        let toolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_pdfexport') as HTMLElement;
        triggerMouseEvent(toolbar, 'click');
    });
});
describe('Event markers are hidden behind the taskbar in PDF exported file', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: pdfData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    indicators: 'Indicators',
                    child: 'subtasks',
                    resourceInfo: 'resources'
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

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
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
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
                        day: '04/07/2024',
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
                 { fields: ['TaskName', 'Duration'] 
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
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
                projectStartDate: new Date('03/31/2024'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with eventMarker', () => {
        let exportProperties:any = {
            pageSize: 'A0',
            };
        ganttObj.pdfExport(exportProperties);
    });
});
describe('Gantt PDF Export with AllData in Bootstrap theme', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it('Export with AllData', () => {
        let exportProperties: PdfExportProperties = {
            exportType: 'AllData',
            pageSize: 'Letter',
            theme:"Bootstrap"
         };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with AllData in Bootstrap 4 theme', () => {
    let ganttObj: Gantt;
    let exportComplete: () => void = () => true;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowPdfExport: true,
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
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                pdfExportComplete: exportComplete,
                columns: [
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it('Export with AllData', () => {
        let exportProperties: PdfExportProperties = {
            exportType: 'AllData',
            pageSize: 'Letter',
            theme:"Bootstrap 4"
         };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with customZoomingLevels ', () => {
    let ganttObj: Gantt;
    let customZoomingLevels: ZoomTimelineSettings[] = [{
        topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd', count: 1 }, timelineUnitSize: 33, level: 0,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 22, updateTimescaleView: true, weekendBackground: null, showTooltip: true,
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 66, level: 1,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 33, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 99, level: 2,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 33, level: 3,
        timelineViewMode: 'Week', weekStartDay: 0, perDayWidth: null, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 66, level: 4,
        timelineViewMode: 'Week', weekStartDay: 0, perDayWidth: null, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 66, level: 5,
        timelineViewMode: 'Day', weekStartDay: 0, perDayWidth: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 6 }, timelineUnitSize: 99, level: 6,
        timelineViewMode: 'Day', weekStartDay: 0, perDayWidth: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: customZoomingdata,
                allowPdfExport: true,
                // dataBound: function () {
                //     ganttObj.zoomingLevels = customZoomingLevels;
                // },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with customZoomingLevels', () => {
        ganttObj.zoomingLevels = customZoomingLevels;
        var exportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
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
describe('Gantt PDF Export with customZoomingLevels ', () => {
    let ganttObj: Gantt;
    let customZoomingLevels: ZoomTimelineSettings[] = [{
        topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd', count: 1 }, timelineUnitSize: 33, level: 0,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 22, updateTimescaleView: true, weekendBackground: null, showTooltip: true,
    }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: customZoomingdata,
                allowPdfExport: true,
                // dataBound: function () {
                //     ganttObj.zoomingLevels = customZoomingLevels;
                // },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with customZoomingLevels', () => {
        ganttObj.zoomingLevels = customZoomingLevels;
        var exportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
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
describe('Gantt PDF Export with customZoomingLevels ', () => {
    let ganttObj: Gantt;
    let customZoomingLevels: ZoomTimelineSettings[] =  [{
        topTier: { unit: 'Month', format: 'MMM, yy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd', count: 1 }, timelineUnitSize: 33, level: 0,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 23, updateTimescaleView: true, weekendBackground: null, showTooltip: true,
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 66, level: 1,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 20, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Month', format: 'MMM, yyyy', count: 1 },
        bottomTier: { unit: 'Week', format: 'dd MMM', count: 1 }, timelineUnitSize: 99, level: 2,
        timelineViewMode: 'Month', weekStartDay: 0, perDayWidth: 23, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 33, level: 3,
        timelineViewMode: 'Week', weekStartDay: 0, perDayWidth: 23, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Week', format: 'MMM dd, yyyy', count: 1 },
        bottomTier: { unit: 'Day', format: 'd', count: 1 }, timelineUnitSize: 66, level: 4,
        timelineViewMode: 'Week', weekStartDay: 0, perDayWidth: 23, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 66, level: 5,
        timelineViewMode: 'Day', weekStartDay: 0, perDayWidth: 23, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
    {
        topTier: { unit: 'Day', format: 'E dd yyyy', count: 1 },
        bottomTier: { unit: 'Hour', format: 'hh a', count: 6 }, timelineUnitSize: 99, level: 6,
        timelineViewMode: 'Day', weekStartDay: 0, perDayWidth: 23, updateTimescaleView: true, weekendBackground: null, showTooltip: true
    },
];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
                taskFields: {
                    name: 'TaskName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('06/30/2019')
            }, done);
    });
    it('Export data with customZoomingLevels', () => {
        ganttObj.zoomingLevels = customZoomingLevels;
        var exportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
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
describe('Gantt PDF Export for unscheduled task', () => {
    let ganttObj: Gantt;
    let datasource: Object[]=  [
        {
            TaskId: 1, TaskName: 'Task 1', TaskType: ''
        },
        {
            TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'
        },
        {
            TaskId: 3, TaskName: 'Task 3', StartDate: new Date('04/03/2019'), TaskType: 'Task with start date only'
        },
        {
            TaskId: 4, TaskName: 'Task 4', EndDate: new Date('04/08/2019'), TaskType: 'Task with end date only'
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskId', width: 75 },
                    { field: 'TaskName', width: 80 },
                    { field: 'StartDate', width: 120 },
                    { field: 'EndDate', width: 120 },
                    { field: 'Duration', width: 90 },
                    { field: 'TaskType', visible: false }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' }]
                },
                splitterSettings: {
                    columnIndex: 4
                },
                toolbar: ['PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
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
                eventMarkers: [
                    {
                        day: '04/11/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                        from: "04/16/2019",
                        to: "04/16/2019",
                        label: " Public holidays",
                        cssClass: "e-custom-holiday"
                    },
                    {
                        from: "03/26/2019",
                        to: "03/26/2019",
                        label: " Public holiday",
                        cssClass: "e-custom-holiday"
                    }],
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
                searchSettings: { fields: ['TaskName', 'Duration']
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
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Export data with unscheduled', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with customization of header and footer', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: headerFooter,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 100);
    });
    it("Export data with header and footer", () => {
        let exportProperties: PdfExportProperties = {
            header: {
                fromTop: 0,
                height: 150,
                contents: [
                    {
                        type: 'Text',
                        value: 'invoice',
                        position: { x: 380, y: 0 },
                        style: { penColor: '#C25050', penSize: 25, hAlign: 'Right', vAlign: 'Top' },
                    },
                    {
                        type: 'Text',
                        value: 'syncfusion',
                        position: { x: 10, y: 0 },
                        style: { penColor: '#C25050', penSize: 25, hAlign: 'Justify', vAlign: 'Top', },
                    },
                    {
                        type: 'Image',
                        src: images,
                        position: { x: 400, y: 70 },
                        size: { height: 50, width: 50 },
                    },
                ]
            },
            footer: {
                fromBottom: 160,
                height: 100,
                contents: [
                    {
                        type: 'Text',
                        value: 'Thank you for your business !',
                        position: { x: 350, y: 40 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Top' }
                    },
                    {
                        type: 'PageNumber',
                        pageNumberType: 'Arabic',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        size: { height: 50, width: 100 },
                        style: { textBrushColor: '#000000', hAlign: 'Center', vAlign: 'Bottom' }
                    },
                    {
                        type: 'PageNumber',
                        position: { x: 250, y: 10 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Middle' }
                    },
                    {
                        type: 'Line',
                        points: { x1: 400, y1: 90, x2: 450, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'Dash'
                        }
                    },
                    {
                        type: 'Line',
                        points: { x1: 200, y1: 40, x2: 150, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'Dot'
                        }
                    },

                ]
            },
            pageSize: 'A4'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with customization of header and footer', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: headerFooter,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    it("Export data with header and footer", () => {
        let exportProperties: PdfExportProperties = {
            header: {
                fromTop: 0,
                height: 150,
                contents: [
                    {
                        type: 'Text',
                        value: 'invoise',
                        position: { x: 380, y: 0 },
                        style: { penColor: '#C25050', penSize: 25, },
                    },
                    {
                        type: 'Image',
                        src: images,
                        position: { x: 400, y: 70 },
                        size: { height: 50, width: 50 },
                    },
                ]
            },
            footer: {
                fromBottom: 160,
                height: 100,
                contents: [
                    {
                        type: 'Text',
                        value: 'Thank you for your business !',
                        position: { x: 350, y: 40 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Top' }
                    },
                    {
                        type: 'PageNumber',
                        pageNumberType: 'Arabic',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        size: { height: 50, width: 100 },
                        style: { textBrushColor: '#000000', hAlign: 'Center', vAlign: 'Bottom' }
                    },
                    {
                        type: 'PageNumber',
                        position: { x: 250, y: 10 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Middle' }
                    },
                    {
                        type: 'Line',
                        points: { x1: 400, y1: 90, x2: 450, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'DashDot'
                        }
                    },
                    {
                        type: 'Line',
                        points: { x1: 200, y1: 40, x2: 150, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'DashDotDot'
                        }
                    },
                    {
                        type: 'Line',
                        points: { x1: 250, y1: 40, x2: 150, y2: 90 },
                        style: {
                            penSize: 2,
                        }
                    },

                ]
            },
            pageSize: 'A4'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with taskbar template', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: milestoneTemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',

                        }
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',

                        }
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20,
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontColor: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            }
                    }
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'A6'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with taskbar template', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: milestoneTemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                 base64: (args as any).data.taskData.resourcesImage
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',

                        }
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                base64: (args as any).data.taskData.resourcesImage
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',

                        }
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 0.5, base64: (args as any).data.taskData.resourcesImage, height: 0.5,
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontColor: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            }
                    }
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'A6'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with customization of header and footer', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: headerFooter,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 100);
    });
    it("Export data with header and footer", () => {
        let exportProperties: PdfExportProperties = {
            header: {
                fromTop: 0,
                height: 150,
                contents: [
                    {
                        type: 'Text',
                        value: 'invoice',
                        position: { x: 380, y: 0 },
                        style: {textPenColor: '#C25050', penSize: 25 },
                    },
                    {
                        type: 'Image',
                        src: images,
                        position: { x: 400, y: 70 },
                        size: { height: 50, width: 50 },
                    },
                ]
            },
            footer: {
                fromBottom: 160,
                height: 100,
                contents: [
                    {
                        type: 'Text',
                        value: 'Thank you for your business !',
                        position: { x: 350, y: 40 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Top' }
                    },
                    {
                        type: 'PageNumber',
                        pageNumberType: 'Arabic',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        size: { height: 50, width: 100 },
                        style: { textBrushColor: '#000000', hAlign: 'Center', vAlign: 'Bottom' }
                    },
                    {
                        type: 'PageNumber',
                        position: { x: 250, y: 10 },
                        style: { textBrushColor: '#C67878', fontSize: 14, hAlign: 'Right', vAlign: 'Middle' },
                        pageNumberType:'LowerLatin'
                    },
                    {
                        type: 'Line',
                        points: { x1: 400, y1: 90, x2: 450, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'Dash'
                        }
                    },
                    {
                        type: 'Line',
                        points: { x1: 200, y1: 40, x2: 150, y2: 90 },
                        style: {
                            penSize: 2,
                            dashStyle: 'Dot'
                        }
                    },

                ]
            },
            pageSize: 'A4'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with customization of header and without footer', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: headerFooter,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 100);
    });
    it("Export data with header and without footer", () => {
        let exportProperties: PdfExportProperties = {
            header: {
                fromTop: 0,
                height: 150,
                contents: [
                    {
                        type: 'Text',
                        value: 'invoice',
                        position: { x: 380, y: 0 },
                        style: {textPenColor: '#C25050', penSize: 25 },
                    },
                ]
            },
           
          
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
// describe('Gantt PDF Export for big font size', () => {
//     let ganttObj: Gantt;
//     beforeAll((done: Function) => {
//         ganttObj = createGantt(
//             {dataSource:datapdf,
//                 allowSorting: true,
//                 allowReordering: true,
//                 enableContextMenu: true,
//                 taskFields: {
//                     id: "id",
//                     name: "name",
//                     startDate: "startDate",
//                     endDate: "endDate",
//                     duration: "duration",
//                     progress: "progress",
//                     parentID: "parentID",
//                     //child: "child",
//                     dependency: "dependency",
//                     cssClass: "cssClass",
//                 },
//                 renderBaseline: true,
//                 baselineColor: 'red',
//                 editSettings: {
//                     allowAdding: true,
//                     allowEditing: true,
//                     allowDeleting: true,
//                     allowTaskbarEditing: true,
//                     showDeleteConfirmDialog: true
//                 },
//                 columns: [
//                     {
//                       field: "name",
//                       width: window.innerWidth <= 768 ? 150 : 250,
//                     },
//                     {
//                       field: "Type",
//                       width: 120,
//                     },
//                     {
//                       field: "displayID",
//                       headerText: "ID",
//                       visible: false,
//                     },
//                     {
//                       field: "assignee",
//                       headerText: "Assignee",
//                       template: "#assignee-template",
//                     },
//                     {
//                       field: "status",
//                       headerText: "Status",
//                       template: "#status-template",
//                     },
//                     {
//                       field: "progress",
//                       headerText: "Progress %",
//                     },
//                     {
//                       field: "startDate",
//                     },
//                     {
//                       field: "endDate",
//                     },
//                     {
//                       field: "duration",
//                     },
//                   ],
//                 toolbar: ['PdfExport'],
//                 allowExcelExport: true,
//                 allowPdfExport: true,
//                 allowSelection: true,
//                 allowRowDragAndDrop: true,
//                 selectedRowIndex: 1,
//                 splitterSettings: {
//                     position: "50%",
//                    // columnIndex: 4
//                 },
//                 selectionSettings: {
//                     mode: 'Row',
//                     type: 'Single',
//                     enableToggle: false
//                 },
//                 tooltipSettings: {
//                     showTooltip: true
//                 },
//                 filterSettings: {
//                     type: 'Menu'
//                 },
//                 allowFiltering: true,
//                 gridLines: "Both",
//                 showColumnMenu: true,
//                 highlightWeekends: true,
//                 timelineSettings: {
//                     showTooltip: true,
//                     topTier: {
//                         unit: 'Week',
//                         format: 'dd/MM/yyyy'
//                     },
//                     bottomTier: {
//                         unit: 'Day',
//                         count: 1
//                     }
//                 },
                
//                 searchSettings:
//                  { fields: ['TaskName', 'Duration'] 
//                 },
//                 labelSettings: {
//                     leftLabel: 'TaskID',
//                     rightLabel: 'Task Name: ${taskData.TaskName}',
//                     taskLabel: '${Progress}%'
//                 },
//                 allowResizing: true,
//                 readOnly: false,
//                 taskbarHeight: 20,
//                 rowHeight: 40,
//                 height: '550px',
//                 allowUnscheduledTasks: true,
//             }, done);
//     });
//     it('Export data with big font', () => {
//         var exportProperties:any = {
//             pageSize: 'A0',
//             fitToWidthSettings:
//             {
//               isFitToWidth: true,
//               gridWidth: '100%',
//               chartWidth: '100%',
//             },
//             ganttStyle:{
//               cell:{fontSize:24},
//               columnHeader:{fontSize:24},
//               footer:{fontSize:24},
//               label:{fontSize:24},
//               timeline:{fontSize:24},
//             }
//           };
//         ganttObj.pdfExport(exportProperties);
//     });
//     afterAll(() => {
//         if (ganttObj) {
//             destroyGantt(ganttObj);
//         }
//     });
// });

describe('Gantt PDF Export with unnscheduled task with fit to width ', () => {
    let ganttObj: Gantt;
    let unscheduledData: Object[] = [
        {
            TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'), Duration: '5', TaskType: ''
        },
        {
            TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'
        },
        {
            TaskId: 3, TaskName: 'Task 3', StartDate: new Date('04/03/2019'), TaskType: 'Task with start date only'
        },
        {
            TaskId: 4, TaskName: 'Task 4', EndDate: new Date('04/08/2019'), TaskType: 'Task with end date only'
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
    enableContextMenu: true,
    pdfExportComplete: (args: any) => {
        expect(args.name).toBe("pdfExportComplete");
    },
    taskFields: {
        id: 'TaskId',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        {field: 'TaskId', width: 75 },
        {field: 'TaskName', width: 80 },
        {field: 'StartDate', width: 120},
        {field: 'EndDate', width: 120 },
        {field: 'Duration', width: 90 },
        {field: 'TaskType', visible: false}
    ],
    sortSettings: {
        columns: [{ field: 'TaskID', direction: 'Ascending' }, 
        { field: 'TaskName', direction: 'Ascending' }]
    },
    splitterSettings: {
        columnIndex: 4
    },
    toolbar: ['PdfExport'],
    allowSelection: true,
    allowRowDragAndDrop: true,
    selectedRowIndex: 1,
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
    eventMarkers: [
        {
            day: '04/11/2019',
            cssClass: 'e-custom-event-marker',
            label: 'Project approval and kick-off'
        }
    ],
    holidays: [{
        from: "04/16/2019",
        to: "04/16/2019",
        label: " Public holidays",
        cssClass: "e-custom-holiday"
    
    },
    {
        from: "03/26/2019",
        to: "03/26/2019",
        label: " Public holiday",
        cssClass: "e-custom-holiday"
    
    }],
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
     { fields: ['TaskName', 'Duration'] 
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
  //  connectorLineBackground: "red",
  //  connectorLineWidth: 3,
    projectStartDate: new Date('03/25/2019'),
    projectEndDate: new Date('05/30/2019'),
    allowPdfExport: true,
            }, done);
    });
    it('Export data with customZoomingLevels', () => {
        let pdfExportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});


describe('Gantt PDF Export with unscheduled task template with fit to width', () => {
    let ganttObj: Gantt;
    let unscheduledData: Object[] = [
        {
            TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'), Duration: '5', TaskType: ''
        },
        {
            TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'
        },
        {
            TaskId: 3, TaskName: 'Task 3', StartDate: new Date('04/03/2019'), TaskType: 'Task with start date only'
        },
        {
            TaskId: 4, TaskName: 'Task 4', EndDate: new Date('04/08/2019'), TaskType: 'Task with end date only'
        },
        {
            TaskId: 5, TaskName: 'Task 1', StartDate: new Date('03/01/2019'),
            EndDate: new Date('04/21/2019'), TaskType: '', resourcesImage: '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'
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: (args: any) => {
            if (!args.data.hasChildRecords) {
                args.taskbar.taskColor = new PdfColor(109, 97, 155);
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.hasChildRecords) {
                args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.ganttProperties.duration === 0) {
                args.taskbar.taskColor = new PdfColor(0, 2, 92);
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20,
                    }]
                args.taskbarTemplate.value = args.data.TaskName,
                    args.taskbarTemplate.fontStyle = {
                        fontColor: new PdfColor(255, 255, 255),
                        fontFamily: 'TimesRoman'
                    }
            }
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        pdfExportComplete: (args: any) => {
            expect(args.name).toBe("pdfExportComplete");
        },
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Export data with customZoomingLevels', () => {
        let pdfExportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export with unscheduled task template', () => {
    let ganttObj: Gantt;
    let unscheduledData: Object[] = [
        {
            TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'), Duration: '5', TaskType: ''
        },
        {
            TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'
        },
        {
            TaskId: 3, TaskName: 'Task 3', StartDate: new Date('04/03/2019'), TaskType: 'Task with start date only'
        },
        {
            TaskId: 4, TaskName: 'Task 4', EndDate: new Date('04/08/2019'), TaskType: 'Task with end date only'
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: (args: any) => {
            if (!args.data.hasChildRecords) {
                args.taskbar.taskColor = new PdfColor(109, 97, 155);
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.hasChildRecords) {
                args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.ganttProperties.duration === 0) {
                args.taskbar.taskColor = new PdfColor(0, 2, 92);
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20,
                    }]
                args.taskbarTemplate.value = args.data.TaskName,
                    args.taskbarTemplate.fontStyle = {
                        fontColor: new PdfColor(255, 255, 255),
                        fontFamily: 'TimesRoman'
                    }
            }
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        selectionSettings: {
            mode: 'Row',
            type: 'Single',
            enableToggle: false
        },
        tooltipSettings: {
            showTooltip: true
        },
        pdfExportComplete: (args: any) => {
            expect(args.name).toBe("pdfExportComplete");
        },
        filterSettings: {
            type: 'Menu'
        },
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Export data with unscheduled task', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export with split tasks width template', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
        {
            TaskID: 1,
            TaskName: 'Project Schedule',
            StartDate: new Date('02/04/2019'),
            EndDate: new Date('03/10/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Planning',
                    StartDate: new Date('02/04/2019'),
                    resourcesImage: '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',
                    subtasks: [
                        {
                            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                             Progress: '60', resourcesImage: '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',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 2 },
                                { StartDate: new Date('02/05/2019'), Duration: 5 },
                                { StartDate: new Date('02/08/2019'), Duration: 3 }
                            ]
                        },
                        {
                            TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '90', resourcesImage: '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'
                        },
                        {
                            TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'),
                            Duration: 20, Progress: '75',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 4 },
                                { StartDate: new Date('02/08/2019'), Duration: 2 }
                            ]
                        },
                        {
                            TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                            Duration: 0, Predecessor: '3FS,5FS'
                        },
                    ]
                },
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
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
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
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
                searchSettings: { fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: 'TaskID'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Export data with unscheduled task', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with split tasks width template', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
        {
            TaskID: 1,
            TaskName: 'Project Schedule',
            StartDate: new Date('02/04/2019'),
            EndDate: new Date('03/10/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Planning',
                    StartDate: new Date('02/04/2019'),
                    resourcesImage: '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',
                    subtasks: [
                        {
                            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                             Progress: '60', resourcesImage: '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',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 2 },
                                { StartDate: new Date('02/05/2019'), Duration: 5 },
                                { StartDate: new Date('02/08/2019'), Duration: 3 }
                            ]
                        },
                        {
                            TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '90', resourcesImage: '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'
                        },
                        {
                            TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'),
                            Duration: 20, Progress: '75',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 4 },
                                { StartDate: new Date('02/08/2019'), Duration: 2 }
                            ]
                        },
                        {
                            TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                            Duration: 0, Predecessor: '3FS,5FS'
                        },
                    ]
                },
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
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
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                pdfQueryTaskbarInfo: function (args) {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20
                            }];
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                        };
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20
                            }];
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                        };
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20,
                            }];
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontColor: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            };
                    }
                },
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
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
                searchSettings: { fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: 'TaskID'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Export data with unscheduled task', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export with split tasks width template', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
        {
            TaskID: 1,
            TaskName: 'Project Schedule',
            StartDate: new Date('02/04/2019'),
            EndDate: new Date('03/10/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Planning',
                    StartDate: new Date('02/04/2019'),
                    resourcesImage: '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',
                    subtasks: [
                        {
                            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                             Progress: '60', resourcesImage: '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',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 2 },
                                { StartDate: new Date('02/05/2019'), Duration: 5 },
                                { StartDate: new Date('02/08/2019'), Duration: 3 }
                            ]
                        },
                        {
                            TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '90', resourcesImage: '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'
                        },
                        {
                            TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'),
                            Duration: 10, Progress: '75',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 4 },
                                { StartDate: new Date('02/08/2019'), Duration: 2 }
                            ]
                        },
                        {
                            TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                            Duration: 0, Predecessor: '3FS,5FS'
                        },
                    ]
                },
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
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
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                pdfQueryTaskbarInfo: function (args) {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20
                            }];
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                        };
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20
                            }];
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                        };
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20,
                            }];
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontColor: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            };
                    }
                },
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
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
                searchSettings: { fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: 'TaskID'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Export data with split task', () => {
        let pdfExportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export with split tasks width template', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
        {
            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/01/2019'),
            Duration: 20, Progress: '60', resourcesImage: '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',
            Segments: [
                { StartDate: new Date('02/01/2019'), Duration: 2 },
                { StartDate: new Date('02/05/2019'), Duration: 5 },
            ]
        },
        {
            TaskID: 4, TaskName: 'Plan timeline', StartDate: new Date('02/01/2019'),
            Duration: 20, Progress: '60',
            Segments: [
                { StartDate: new Date('02/01/2019'), Duration: 2 },
                { StartDate: new Date('02/05/2019'), Duration: 5 },
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        enableVirtualization: false,
        pdfQueryTaskbarInfo: function (args) {
            if (!args.data.hasChildRecords) {
                args.taskbar.taskColor = new PdfColor(109, 97, 155);
                if(args.data.taskData.resourcesImage)
                args.taskbarTemplate.image = [{
                        width: 20, base64: args.data.taskData.resourcesImage, height: 20
                    }];
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',
                };
            }
            if (args.data.hasChildRecords) {
                args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                if(args.data.taskData.resourcesImage)
                args.taskbarTemplate.image = [{
                        width: 20, base64: args.data.taskData.resourcesImage, height: 20
                    }];
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',
                };
            }
            if (args.data.ganttProperties.duration === 0) {
                args.taskbar.taskColor = new PdfColor(0, 2, 92);
                if(args.data.taskData.resourcesImage)
                args.taskbarTemplate.image = [{
                        width: 20, base64: args.data.taskData.resourcesImage, height: 20,
                    }];
                args.taskbarTemplate.value = args.data.TaskName,
                    args.taskbarTemplate.fontStyle = {
                        fontColor: new PdfColor(255, 255, 255),
                        fontFamily: 'TimesRoman'
                    };
            }
        },
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
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        labelSettings: {
            leftLabel: 'TaskID',
            rightLabel: 'Task Name: ${taskData.TaskName}',
            taskLabel: 'TaskID'
        },
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        projectStartDate: new Date('01/30/2019'),
        projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Export data with unscheduled task', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export with split tasks width template', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
        {
            TaskID: 4, TaskName: 'Plan timeline', StartDate: new Date('02/01/2019'),
            Duration: 20, Progress: '60'
            
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
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
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        labelSettings: {
            leftLabel: 'TaskID',
            rightLabel: 'Task Name: ${taskData.TaskName}',
            taskLabel: 'TaskID'
        },
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        projectStartDate: new Date('01/30/2019'),
        projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Export data with unscheduled task', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with task mode', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('03/09/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40' },
                { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', },
                { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017'),
                    'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
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
        allowUnscheduledTasks: true,
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
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('Export data with split task', () => {
        let pdfExportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with task mode', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('03/09/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40' },
                { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', },
                { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017'),
                    'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
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
        allowUnscheduledTasks: true,
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
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('Export data with task mode', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export with task mode', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/20/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/20/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('04/09/2017'),
            'Progress': '40',
            'Children': [
                { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40' },
                { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', },
                { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017'),
                    'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
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
        allowUnscheduledTasks: true,
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
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('Export data with task mode', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with task mode', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/20/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/20/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('04/09/2017'),
            'Progress': '40',
            'Children': [
                { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40' },
                { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', },
                { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017'),
                    'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
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
        allowUnscheduledTasks: true,
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
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('Export data with task mode', () => {
        let pdfExportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export with unnscheduled task with fit to width ', () => {
    let ganttObj: Gantt;
    let unscheduledData: Object[] = [
        {
            TaskId: 1, TaskName: 'Task 1', StartDate: new Date('03/01/2019'),
            EndDate: new Date('04/21/2019'), TaskType: '', resourcesImage: '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'
        },
        {
            TaskId: 2, TaskName: 'Task 1', StartDate: new Date('03/01/2019'),
            EndDate: new Date('04/21/2019'), TaskType: ''
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: (args) => {
            if (!args.data.hasChildRecords) {
                args.taskbar.taskColor = new PdfColor(109, 97, 155);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args ).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.hasChildRecords) {
                args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.ganttProperties.duration === 0) {
                args.taskbar.taskColor = new PdfColor(0, 2, 92);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args).data.taskData.resourcesImage, height: 20,
                    }]
                args.taskbarTemplate.value = args.data.TaskName,
                    args.taskbarTemplate.fontStyle = {
                        fontColor: new PdfColor(255, 255, 255),
                        fontFamily: 'TimesRoman'
                    }
            }
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/01/2019'),
        projectEndDate: new Date('05/30/2019'),
    }, done);
    });
    it('Export data with customZoomingLevels', () => {
        let pdfExportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with unnscheduled task with fit to width ', () => {
    let ganttObj: Gantt;
    let unscheduledData: Object[] = [
        {
            TaskId: 1, TaskName: 'Task 1', StartDate: new Date('03/01/2019'),
            EndDate: new Date('04/21/2019'), TaskType: '', resourcesImage: '/9j/4AAQSkZJRgABAQAAAQABAAD//gAfQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3P/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIADcANwMBIgACEQEDEQH/xAAbAAADAAMBAQAAAAAAAAAAAAAFBwgEBgkCA//aAAgBAQAAAAC/hQFOvYjnCinKzbmZbGH5zuQtL+rjE/fO5y7I93/rpMhES5qCgxOTPErmqDaDCzVpNoBsPfbf/8QAGgEAAQUBAAAAAAAAAAAAAAAAAAECAwQFBv/aAAgBAhAAAAAoWZjmNLVM6a2Pan//xAAXAQEBAQEAAAAAAAAAAAAAAAAABAUG/9oACAEDEAAAAGjNO7PFxm1FEH//xAA3EAACAgECBAMFBgQHAAAAAAABAgMEBQAGBxESQSExMhATUVKBCBQiYWKhFiNxkTNCU2RygrH/2gAIAQEAAT8A0chavSvWwcaFUYrJdlBMSkeYjA9Z/bW5b209pY98xvncBFf57UrKrP8ACOGL1H8gCdRcfOB8txaopTojeU5p8o9Uq+OuVUv7XzrLE4DIYpvvNduY+Vif2I1Vyk0NiPH5eBYLD+EUqEmCc/BSfJv0n2ZB5MjajwlZ2RCnvbkinkViJ5CMH5n/APNdNajV5L0Q14IyflREUeJ1vDP53jTu65l72QMOMWZ4MbW/yQwBuw+Yj1HW3OAEF1lntZ50iHNRGkHiSe/MtrbEF3ghuPEWkyktvbt2daeQRx4oH8EfkPk1PTr5CrLVtRBom5fkQR3B7EdjrD2Z1exibrdVury/mf6sLeiT+vY6wRV69rJv671mSX4n3anoRfoo1l6pv4rKUAwQ2ak8AY+QMiFef76x2VbacmNrvjnnmjAMiGRU5OW9IB8WOtucRXk2ra3FiMK9panISQGTpCv+ZAJ1ZvZjiJgbr28VBVimjjmj6RYVo2V/DwljQN3BI1Gysqup5hgCNZ2VcbZx2Z7Rl683LzaORSw/syjW3HUYHFfEVkB9m7sNitqby3LVzlFmkhlkmrFVKO6MSY+nXBvN0Zq+YoLQsixLKr9DxosBHkSCxAIXvrFTRzyDCrSjhnM6x9KgCFwT6l5dtIOlFX4Aa3uhG3bCjxYyxfU9WsEfu5v4lvBqlhygPeGY9aH9yPZ9rHEQ0M5tvOo/4sjVnqSoP9uQQw+kuuFMAd0DW4pK5J61lkYsOf8A28DrYaU23dFVqoohgWWdlTyDEcv7nnz9mShTIZGhiTzaNFe1Z5dlAKIPqTrK1bEU8GYx8ZezApSWIec8BPMqP1DzXXEn7Ue2dlT2sNisLfyGZi7TxmrWT+rP+JtY7c03GVty/wAVSKcnNcjsQyJ4CCLoEaJEOypy1tjgruGnuypiZcpXkSWMWVevZVHeH5mTnzGt75ylwWweJkw5jmzlu5FyD94IiGm+jenWy+NG1N60m+4CxHlo4laTGshMhZjyHQw8GBOsZTmrJNaukNftMJJyPJeyxj9KD2cReDu0OJNUnJVBDdH+Hai/C6nW2+AWe4ZbrOTe3VvYKeKSByT0ypzIKkL31tfZ+8It62tx5a37h6+T+/0pY5FKycj0CAgEkRmPw1ujg/n+Ke7XzuRvpTwcaJBVjRg0vuk8T/xJOtmcPtu7EpJVw9VRL0/zJ28XY+z/xAAiEQACAQMEAgMAAAAAAAAAAAABAgMABBEQEhNRISIFQYH/2gAIAQIBAT8AqW/hjk4y/t1ioJ0nTemtyA0pYREOjeT3XxjFufxhcg/ut5aMw5Ez7H6Gas7ZraHa4wzHcdVYjaOjmiSTk6f/xAAiEQACAQIGAwEAAAAAAAAAAAABAgMEEQAFEBITISJBUZH/2gAIAQMBAT8AxFltRJGsvH4H3fFTTvTPsf2LjWlBEChp1aNk8V+YzdVUwDddrH81y6t4xxkjpSLsbdYr6hamfehuoULr91//2Q=='
        },
        {
            TaskId: 2, TaskName: 'Task 1', StartDate: new Date('03/01/2019'),
            EndDate: new Date('04/21/2019'), TaskType: ''
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: (args) => {
            if (!args.data.hasChildRecords) {
                args.taskbar.taskColor = new PdfColor(109, 97, 155);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args ).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.hasChildRecords) {
                args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.ganttProperties.duration === 0) {
                args.taskbar.taskColor = new PdfColor(0, 2, 92);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args).data.taskData.resourcesImage, height: 20,
                    }]
                args.taskbarTemplate.value = args.data.TaskName,
                    args.taskbarTemplate.fontStyle = {
                        fontColor: new PdfColor(255, 255, 255),
                        fontFamily: 'TimesRoman'
                    }
            }
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/01/2019'),
        projectEndDate: new Date('05/30/2019'),
    }, done);
    });
    it('Export data with customZoomingLevels', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with task mode', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('04/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('04/20/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('04/20/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('04/09/2017'),
            'Progress': '40',
            'Children': [
                { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40' },
                { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', },
                { 'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017'),
                    'EndDate': new Date('03/20/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
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
        allowUnscheduledTasks: true,
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
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('Export data with task mode', () => {
        let pdfExportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with task mode', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('04/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'), 'Duration': 20,
                     'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('04/20/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
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
        allowUnscheduledTasks: true,
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
            }, done);
    });
    it('Export data with task mode', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with unscheduled task template with fit to width', () => {
    let ganttObj: Gantt;
    let unscheduledData: Object[] = [
        {
            TaskId: 5, TaskName: 'Task 1', StartDate: new Date('04/01/2019'),Duration: 2,
            TaskType: '', resourcesImage: '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'
        },
        {
            TaskId: 6, TaskName: 'Task 1', StartDate: new Date('04/01/2019'),Duration: 2,
            TaskType: ''
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: (args: any) => {
            if (!args.data.hasChildRecords) {
                args.taskbar.taskColor = new PdfColor(109, 97, 155);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.hasChildRecords) {
                args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.ganttProperties.duration === 0) {
                args.taskbar.taskColor = new PdfColor(0, 2, 92);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20,
                    }]
                args.taskbarTemplate.value = args.data.TaskName,
                    args.taskbarTemplate.fontStyle = {
                        fontColor: new PdfColor(255, 255, 255),
                        fontFamily: 'TimesRoman'
                    }
            }
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            duration: 'Duration',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        pdfExportComplete: (args: any) => {
            expect(args.name).toBe("pdfExportComplete");
        },
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Export data with customZoomingLevels', () => {
        let pdfExportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true
            }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with unscheduled task template with fit to width', () => {
    let ganttObj: Gantt;
    let unscheduledData: Object[] = [
        {
            TaskId: 5, TaskName: 'Task 1', StartDate: new Date('04/01/2019'),Duration: 2,
            TaskType: '', resourcesImage: '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'
        },
        {
            TaskId: 6, TaskName: 'Task 1', StartDate: new Date('04/01/2019'),Duration: 2,
            TaskType: ''
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: (args: any) => {
            if (!args.data.hasChildRecords) {
                args.taskbar.taskColor = new PdfColor(109, 97, 155);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.hasChildRecords) {
                args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                    }]
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',

                }
            }
            if (args.data.ganttProperties.duration === 0) {
                args.taskbar.taskColor = new PdfColor(0, 2, 92);
                if(args.data.taskData.resourcesImage)
                    args.taskbarTemplate.image = [{
                        width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20,
                    }]
                args.taskbarTemplate.value = args.data.TaskName,
                    args.taskbarTemplate.fontStyle = {
                        fontColor: new PdfColor(255, 255, 255),
                        fontFamily: 'TimesRoman'
                    }
            }
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            duration: 'Duration',
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        pdfExportComplete: (args: any) => {
            expect(args.name).toBe("pdfExportComplete");
        },
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Export data with customZoomingLevels', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks width template', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
        {
            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('01/29/2019'),BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            Duration: 30, Progress: '60', resourcesImage: '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',
            
        },
        {
            TaskID: 4, TaskName: 'Plan timeline', StartDate: new Date('01/29/2019'),BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            Duration: 30, Progress: '60'
            
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                renderBaseline: true,
                allowUnscheduledTasks: true,
                enableVirtualization: false,
                pdfQueryTaskbarInfo: function (args) {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20
                            }];
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                        };
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20
                            }];
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                        };
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20,
                            }];
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontColor: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            };
                    }
                },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
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
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
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
                searchSettings: { fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: 'TaskID'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Export data with unscheduled task', () => {
        let pdfExportProperties = {
           fitToWidthSettings: {
                isFitToWidth: true
           }
        }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks width template', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
        {
            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('01/29/2019'),BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            Duration: 30, Progress: '60', resourcesImage: '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',
            
        },
        {
            TaskID: 4, TaskName: 'Plan timeline', StartDate: new Date('01/29/2019'),BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            Duration: 30, Progress: '60'
            
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                renderBaseline: true,
                allowUnscheduledTasks: true,
                enableVirtualization: false,
                pdfQueryTaskbarInfo: function (args) {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20
                            }];
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                        };
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20
                            }];
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontColor: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                        };
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if(args.data.taskData.resourcesImage)
                        args.taskbarTemplate.image = [{
                                width: 20, base64: args.data.taskData.resourcesImage, height: 20,
                            }];
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontColor: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            };
                    }
                },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
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
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
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
                searchSettings: { fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: 'TaskID'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Export data with unscheduled task', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks width template for manual mode', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
        {
            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('01/29/2019'),BaselineStartDate: new Date('04/02/2019'),            'isManual': true,                            BaselineEndDate: new Date('04/06/2019'),
            Duration: 50, Progress: '60', resourcesImage: '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',
            
        },
        {
            TaskID: 4, TaskName: 'Plan timeline', StartDate: new Date('01/29/2019'),BaselineStartDate: new Date('04/02/2019'),            'isManual': true,                            BaselineEndDate: new Date('04/06/2019'),
            Duration: 50, Progress: '60'
            
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        taskMode: 'Custom',
        renderBaseline: true,
        allowUnscheduledTasks: true,
        enableVirtualization: false,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            child: 'subtasks',
            manual: 'isManual',
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
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        labelSettings: {
            leftLabel: 'TaskID',
            rightLabel: 'Task Name: ${taskData.TaskName}',
            taskLabel: 'TaskID'
        },
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        projectStartDate: new Date('01/30/2019'),
        projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Export data with unscheduled task', () => {
        let pdfExportProperties = {
            fitToWidthSettings: {
                 isFitToWidth: true
            }
         }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Beyond end date with split tasks width template for manual mode', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
        {
            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('01/29/2019'),BaselineStartDate: new Date('04/02/2019'),            'isManual': true,                            BaselineEndDate: new Date('04/06/2019'),
            Duration: 50, Progress: '60', resourcesImage: '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',
            
        },
        {
            TaskID: 4, TaskName: 'Plan timeline', StartDate: new Date('01/29/2019'),BaselineStartDate: new Date('04/02/2019'),            'isManual': true,                            BaselineEndDate: new Date('04/06/2019'),
            Duration: 50, Progress: '60'
            
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        taskMode: 'Custom',
        renderBaseline: true,
        allowUnscheduledTasks: true,
        enableVirtualization: false,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            child: 'subtasks',
            manual: 'isManual',
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
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        labelSettings: {
            leftLabel: 'TaskID',
            rightLabel: 'Task Name: ${taskData.TaskName}',
            taskLabel: 'TaskID'
        },
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        projectStartDate: new Date('01/30/2019'),
        projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Export data with manual task', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks width template for manual parent task', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/18/2017'),
            'EndDate': new Date('03/21/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/18/2017'),
                    'EndDate': new Date('05/03/2017'), 'Progress': '40', 'isManual': true },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
        allowSorting: true,
        enableContextMenu: true,
        height: '450px',
        allowUnscheduledTasks: true,
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
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('Export data with manual task', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks width template for manual parent task', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/18/2017'),
            'EndDate': new Date('03/21/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/18/2017'),
                    'EndDate': new Date('05/03/2017'), 'Progress': '40', 'isManual': true },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
        allowSorting: true,
        enableContextMenu: true,
        height: '450px',
        allowUnscheduledTasks: true,
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
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('Export data with manual task', () => {
        let pdfExportProperties = {
            fitToWidthSettings: {
                 isFitToWidth: true
            }
         }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks width template for manual parent task', () => {
    let ganttObj: Gantt;
    var unscheduledData = [
        {
            TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            EndDate: new Date('04/21/2019'), Duration: '5', TaskType: '', resourcesImage: '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'
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: function (args) {
            args.labelSettings.leftLabel.value = '1';
            args.labelSettings.leftLabel.image = [{
                width: 20, base64: args.data.taskData.resourcesImage, height: 20
            }];
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        pdfExportComplete: (args: any) => {
            expect(args.name).toBe("pdfExportComplete");
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('left label and image', () => {
        let pdfExportProperties = {
            fitToWidthSettings: {
                 isFitToWidth: true
            }
         }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks width template for manual parent task', () => {
    let ganttObj: Gantt;
    var unscheduledData = [
        {
            TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            EndDate: new Date('04/21/2019'), Duration: '5', TaskType: '', resourcesImage: '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'
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: function (args) {
            args.labelSettings.leftLabel.value = '1';
            args.labelSettings.leftLabel.image = [{
                width: 20, base64: args.data.taskData.resourcesImage, height: 20
            }];
        },
        renderBaseline: true,
        pdfExportComplete: (args: any) => {
            expect(args.name).toBe("pdfExportComplete");
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('left label and image', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks width template for manual parent task', () => {
    let ganttObj: Gantt;
    var unscheduledData = [
        {
            TaskId: 1, TaskName: 'Task 1',BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            Duration: '30', TaskType: '', resourcesImage: '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'
        },
        {
            TaskId: 2, TaskName: 'Task 1',BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('05/06/2019'),
            Duration: '30', TaskType: ''
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: function (args) {
            if (!args.data.hasChildRecords) {
                args.taskbar.taskColor = new PdfColor(109, 97, 155);
                if(args.data.taskData.resourcesImage)
                args.taskbarTemplate.image = [{
                        width: 20, base64: args.data.taskData.resourcesImage, height: 20
                    }];
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',
                };
            }
            if (args.data.hasChildRecords) {
                args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                if(args.data.taskData.resourcesImage)
                args.taskbarTemplate.image = [{
                        width: 20, base64: args.data.taskData.resourcesImage, height: 20
                    }];
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',
                };
            }
            if (args.data.ganttProperties.duration === 0) {
                args.taskbar.taskColor = new PdfColor(0, 2, 92);
                if(args.data.taskData.resourcesImage)
                args.taskbarTemplate.image = [{
                        width: 20, base64: args.data.taskData.resourcesImage, height: 20,
                    }];
                args.taskbarTemplate.value = args.data.TaskName,
                    args.taskbarTemplate.fontStyle = {
                        fontColor: new PdfColor(255, 255, 255),
                        fontFamily: 'TimesRoman'
                    };
            }
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
        },
        renderBaseline: true,
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        pdfExportComplete: (args: any) => {
            expect(args.name).toBe("pdfExportComplete");
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('render baseline', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks width template for unscheduled task', () => {
    let ganttObj: Gantt;
    var unscheduledData = [
        {
            TaskId: 1, TaskName: 'Task 1',BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            Duration: '30', TaskType: '', resourcesImage: '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'
        },
        {
            TaskId: 2, TaskName: 'Task 1',BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            Duration: '30', TaskType: ''
        },
        {
            TaskId: 3, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'),
            Duration: '0', TaskType: '', resourcesImage: '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'
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData,
        enableContextMenu: true,
        pdfQueryTaskbarInfo: function (args) {
            args.labelSettings.leftLabel.value = '1';
            args.labelSettings.rightLabel.value = '1';
            if (!args.data.hasChildRecords) {
                args.taskbar.taskColor = new PdfColor(109, 97, 155);
                if(args.data.taskData.resourcesImage)
                args.taskbarTemplate.image = [{
                        width: 20, base64: args.data.taskData.resourcesImage, height: 20
                    }];
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',
                };
            }
            if (args.data.hasChildRecords) {
                args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                if(args.data.taskData.resourcesImage)
                args.taskbarTemplate.image = [{
                        width: 20, base64: args.data.taskData.resourcesImage, height: 20
                    }];
                args.taskbarTemplate.value = args.data.TaskName;
                args.taskbarTemplate.fontStyle = {
                    fontColor: new PdfColor(255, 255, 255),
                    fontFamily: 'TimesRoman',
                };
            }
            if (args.data.ganttProperties.duration === 0) {
                args.taskbar.taskColor = new PdfColor(0, 2, 92);
                if(args.data.taskData.resourcesImage)
                args.taskbarTemplate.image = [{
                        width: 20, base64: args.data.taskData.resourcesImage, height: 20,
                    }];
                args.taskbarTemplate.value = args.data.TaskName,
                    args.taskbarTemplate.fontStyle = {
                        fontColor: new PdfColor(255, 255, 255),
                        fontFamily: 'TimesRoman'
                    };
            }
        },
        taskFields: {
            id: 'TaskId',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
        },
        renderBaseline: true,
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        pdfExportComplete: (args: any) => {
            expect(args.name).toBe("pdfExportComplete");
        },
        columns: [
            { field: 'TaskId', width: 75 },
            { field: 'TaskName', width: 80 },
            { field: 'StartDate', width: 120 },
            { field: 'EndDate', width: 120 },
            { field: 'Duration', width: 90 },
            { field: 'TaskType', visible: false }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        splitterSettings: {
            columnIndex: 4
        },
        allowPdfExport: true,
        toolbar: ['PdfExport'],
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        labelSettings: {
            leftLabel: 'TaskID',
            rightLabel: 'TaskID',
            taskLabel: '${Progress}%'
        },
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        allowUnscheduledTasks: true,
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('render baseline', () => {
        let pdfExportProperties = {
            fitToWidthSettings: {
                 isFitToWidth: true
            },
            ganttStyle: {
                font: new PdfTrueTypeFont(adventProFont, 12)
            }
         }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Beyond end date with split tasks for manual parent task', () => {
    let ganttObj: Gantt;
    var taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('03/15/2017'),
            'EndDate': new Date('05/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/15/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40' },
            ]
        },
        {
            'TaskID': 3,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('03/15/2017'),
            'EndDate': new Date('05/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 4, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/15/2017'),
                    'EndDate': new Date('05/03/2017'), 'Progress': '40' },
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
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
        pdfQueryTaskbarInfo: function (args) {
            args.labelSettings.leftLabel.value = '1';
            args.labelSettings.rightLabel.value = '1';
        },
        labelSettings: {
            leftLabel: 'TaskName',
            rightLabel: 'TaskName',
            taskLabel: '${Progress}%'
        },
        projectStartDate: new Date('02/20/2017'),
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('render baseline', () => {
        let pdfExportProperties = {
            fitToWidthSettings: {
                 isFitToWidth: true
            },
            ganttStyle: {
                font: new PdfTrueTypeFont(adventProFont, 12)
            }
         }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('predecessor connection', () => {
    let ganttObj: Gantt;
    var projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, Predecessor: "4FS+2",TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "5",
                    Indicators: [
                        {
                            'date': '04/10/2019',
                            'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                            'name': 'Indicator title',
                            'tooltip': 'tooltip'
                        }
                    ]
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0 },
        { TaskID: 6, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'7FF-2' },
        { TaskID: 7, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 8, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 9, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 ,Predecessor:'8FF-2'},
        { TaskID: 10, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'11SS-2' },
        { TaskID: 11, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 12, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'13SS+2' },
        { TaskID: 13, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 14, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'15SF-2' },
        { TaskID: 15, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 16, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'17SF+2' },
        { TaskID: 17, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 18, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'19FF+2' },
        { TaskID: 19, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },

    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            child: 'subtasks',
            indicators: 'Indicators'
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
            { field: 'TaskID', headerText: 'Task ID' },
            { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
            { field: 'StartDate', headerText: 'Start Date', format:'m/d/yy',type:'date'},
            { field: 'StartDate', headerText: 'Start Date', format:'m/d/yy',type:'time'},
            { field: 'StartDate', headerText: 'Start Date',type:'date'},
            { field: 'StartDate', headerText: 'Start Date',type:'time'},
            { field: 'Duration', headerText: 'Duration', allowEditing: false },
            { field: 'Progress', headerText: 'Progress', allowFiltering: false },
            { field: 'CustomColumn', headerText: 'CustomColumn' }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('FS type connection', () => {
        let pdfExportProperties = {
            fitToWidthSettings: {
                 isFitToWidth: true
            },
         }
        ganttObj.pdfExport(pdfExportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('predecessor connection', () => {
    let ganttObj: Gantt;
    var projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, Predecessor: "4FS+2",TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "5",
                    Indicators: [
                        {
                            'date': '04/10/2019',
                            'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                            'name': 'Indicator title',
                            'tooltip': 'tooltip'
                        }
                    ]
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0 },
        { TaskID: 6, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'7FF-2' },
        { TaskID: 7, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 8, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 9, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 ,Predecessor:'8FF-2'},
        { TaskID: 10, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'11SS-2' },
        { TaskID: 11, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 12, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'13SS+2' },
        { TaskID: 13, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 14, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'15SF-2' },
        { TaskID: 15, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 16, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'17SF+2' },
        { TaskID: 17, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 18, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'19FF+2' },
        { TaskID: 19, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },

    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            child: 'subtasks',
            indicators: 'Indicators'
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
            { field: 'TaskID', headerText: 'Task ID' },
            { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
            { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
            { field: 'Duration', headerText: 'Duration', allowEditing: false },
            { field: 'Progress', headerText: 'Progress', allowFiltering: false },
            { field: 'CustomColumn', headerText: 'CustomColumn' }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('FS type connection', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('predecessor connection', () => {
    let ganttObj: Gantt;
    var projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, Predecessor: "4FS+2",TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "5",
                    Indicators: [
                        {
                            'date': '04/10/2019',
                            'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                            'name': 'Indicator title',
                            'tooltip': 'tooltip'
                        }
                    ]
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0 },
        { TaskID: 6, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'7FF-2' },
        { TaskID: 7, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 8, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 9, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 ,Predecessor:'8FF-2'},
        { TaskID: 10, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'11SS-2' },
        { TaskID: 11, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 12, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'13SS+2' },
        { TaskID: 13, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 14, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'15SF-2' },
        { TaskID: 15, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 16, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'17SF+2' },
        { TaskID: 17, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 18, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30,Predecessor:'19FF+2' },
        { TaskID: 19, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 29, TaskName: 'Prepare product sketch and notes game game game game game game game game game game game game game game', StartDate: new Date('04/02/2019'), Duration: 20, Progress: 30 }

    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            child: 'subtasks',
            indicators: 'Indicators'
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
            { field: 'TaskID', headerText: 'Task ID' },
            { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
            { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
            { field: 'Duration', headerText: 'Duration', allowEditing: false },
            { field: 'Progress', headerText: 'Progress', allowFiltering: false },
            { field: 'CustomColumn', headerText: 'CustomColumn' }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
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
        searchSettings: { fields: ['TaskName', 'Duration']
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
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('cover draw', () => {
        ganttObj.pdfExport();
        const layout: RectangleF = new RectangleF(0, 0, 0, 0);
        const format: any = new PdfTreeGridLayoutFormat();
        ganttObj.pdfExportModule.gantt.draw(ganttObj.pdfExportModule.pdfPage,layout,format);
        ganttObj.pdfExportModule.gantt.draw(ganttObj.pdfExportModule.pdfPage,10,10);
        const layout1: RectangleF = new RectangleF(0, 0, 400, 0);
        ganttObj.pdfExportModule.gantt.draw(ganttObj.pdfExportModule.pdfPage,layout1,undefined);
        ganttObj.pdfExportModule.gantt.draw(ganttObj.pdfExportModule.pdfPage, 10, 10,null);
        ganttObj.pdfExportModule.gantt.draw(ganttObj.pdfExportModule.pdfPage, layout1, true);
        const layout3 = new PointF(10, 10);
        ganttObj.pdfExportModule.gantt.draw(ganttObj.pdfExportModule.pdfPage, layout3, undefined);
        ganttObj.pdfExportModule.gantt.draw(ganttObj.pdfExportModule.pdfPage, layout3, format);
        let a = {height:480,width:760,x:0.5,y:0.5};
        ganttObj.pdfExportModule.gantt.columns.getColumn(0).width = -10;
        ganttObj.pdfExportModule.gantt.measureColumnsWidth(a);
        ganttObj.pdfExportModule.gantt.columns.getColumn(0).width = -10;
        ganttObj.pdfExportModule.gantt.measureColumnsWidth(undefined);
        const dic: any = new TemporaryDictionary();
        dic.add(ganttObj.pdfExportModule.pdfPage, [0,1]);
        dic.getValue(ganttObj.pdfExportModule.pdfPage);
        dic.setValue([0,1],ganttObj.pdfExportModule.pdfPage);
        dic.setValue(ganttObj.pdfExportModule.pdfPage,ganttObj.pdfExportModule.pdfPage);
        dic.remove(ganttObj.pdfExportModule.pdfPage);
        dic.size();
        dic.keys();
        dic.values();
        dic.clear();
        ganttObj.pdfExportModule.helper['row'].cells['cells'][0].style.borders.bottom = new PdfPen(ganttObj.pdfExportModule.helper['row'].cells['cells'][0].style.borderColor);
        ganttObj.pdfExportModule.helper['row'].cells['cells'][0].style.borders.top = new PdfPen(ganttObj.pdfExportModule.helper['row'].cells['cells'][0].style.borderColor);
        ganttObj.pdfExportModule.helper['row'].cells['cells'][0].style.borders.left = new PdfPen(ganttObj.pdfExportModule.helper['row'].cells['cells'][0].style.borderColor);
        ganttObj.pdfExportModule.helper['row'].cells['cells'][0].style.borders.right = new PdfPen(ganttObj.pdfExportModule.helper['row'].cells['cells'][0].style.borderColor);
        ganttObj.pdfExportModule.helper['row'].cells['cells'][0].style.padding.all = 10;
        let newPadding = new PdfPaddings(10, 10, 10, 10);
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).width = ganttObj.pdfExportModule.helper['row'].cells.getCell(0).width;
        let b = new PdfTreeGrid();
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).value = b;
        let c= {height:50,width:82,x:0.5,y:0.5};
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0)['adjustContentLayoutArea'](c);
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).style.format.alignment = 1;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0)['adjustContentLayoutArea'](c);
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).style.format.alignment = 2;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0)['adjustContentLayoutArea'](c);
        let d:PdfTreeGridLayouter = new PdfTreeGridLayouter(ganttObj.pdfExportModule.gantt);
        ganttObj.pdfExportModule.helper['row'].treegrid.style.borderOverlapStyle = 1;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).style.borders.left.dashStyle = 1;
    ganttObj.pdfExportModule.helper['row'].cells.getCell(0).style.borders.right.dashStyle = 1;
    ganttObj.pdfExportModule.helper['row'].cells.getCell(0).style.borders.top.dashStyle = 1;
    ganttObj.pdfExportModule.helper['row'].cells.getCell(0).style.borders.bottom.dashStyle = 1;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0)['drawCellBorder'](ganttObj.pdfExportModule.pdfPage.graphics,c);
        let e: PdfTreeGridRow = new PdfTreeGridRow(b);
        e.treegrid=b;
        e.rowOverflowIndex = e.rowOverflowIndex;
        e.width;
        e['measureWidth']();
        let headerCollection: PdfTreeGridHeaderCollection = new PdfTreeGridHeaderCollection(b);
        headerCollection.getHeader(0);
        headerCollection.count;
        headerCollection.add(ganttObj.pdfExportModule.helper['row']);
        headerCollection.indexOf(ganttObj.pdfExportModule.helper['row']);
        let treegridColumn: PdfTreeGridColumn = new PdfTreeGridColumn(b);
        treegridColumn.headerText;
        treegridColumn.field;
        treegridColumn.format = treegridColumn.format;
        let columncollection:PdfTreeGridColumnCollection  = new PdfTreeGridColumnCollection(b);
        columncollection.width;
        columncollection.measureColumnsWidth();
        ganttObj.pdfExportModule.gantt.allowRowBreakAcrossPages = false;
        let pdfPage =ganttObj.pdfExportModule.pdfPage.graphics;
        let bounds= {height:550,width:82,x:0.5,y:0.5};
        ganttObj.pdfExportModule.helper['row'].treegrid.allowRowBreakAcrossPages = false;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).remainingString = '';
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0)['draw'](pdfPage,bounds,false,0);
        ganttObj.pdfExportModule.helper['row'].cells.add(undefined);
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).columnSpan = 0;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).rowSpan = 0;
       // ganttObj.pdfExportModule.helper['row']['measureHeight']();
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).finishedDrawingCell = false;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).remainingString = '';
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).measureHeight();
        let rowCell: PdfTreeGridCell= new PdfTreeGridCell(ganttObj.pdfExportModule.helper['row']);
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).finishedDrawingCell = false;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).remainingString = '';
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0)['draw'](pdfPage,bounds,false,0);
        d['startLocation'] = new PointF(0.5,0.5);
        d['checkBounds'](format);
        d.treegrid.allowRowBreakAcrossPages = false;
        d['currentPageBounds'] = { height: 480, width: 700 };
        ganttObj.pdfExportModule.helper['row'].height = 500;
        let cols = new PdfTreeGridColumnCollection(b);
        cols.add(6);
        let string: PdfStringFormat = new PdfStringFormat();
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).style.format = string;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).columnSpan = 4;
        cols.getColumn(0).format.lineSpacing = 10;
        d.treegrid.columns = cols;
        d['currentGraphics'] = pdfPage;
        d['cellStartIndex'] = 0;
        d['cellEndIndex'] = 2;
        d['drawRow'](ganttObj.pdfExportModule.helper['row'], undefined, 600);
        ganttObj.pdfExportModule.helper['row'].height = 100;
        d['repeatRowIndex'] = 3;
        d['drawRow'](ganttObj.pdfExportModule.helper['row'], undefined, 100);
        const result: RowLayoutResult = new RowLayoutResult();
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).value = null;
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).remainingString = null;
        d['drawRowWithBreak'](result,ganttObj.pdfExportModule.helper['row'],29.73913043478261);
        const lay: TemporaryDictionary<PdfPage, number[]> = new TemporaryDictionary();
        d['currentPage'] = ganttObj.pdfExportModule.pdfPage;
        lay.add(ganttObj.pdfExportModule.pdfPage, [0,1]);
        d['reArrangePages'](lay);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('render timeline in year mode', () => {
    let ganttObj: Gantt;
    var projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, Predecessor: "4FS+2",TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "5",
                    Indicators: [
                        {
                            'date': '04/10/2019',
                            'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                            'name': 'Indicator title',
                            'tooltip': 'tooltip'
                        }
                    ]
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
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
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', format: 'm/d/yy', type: 'date' },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
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
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    bottomTier: {
                        unit: 'Year',
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
                searchSettings: { fields: ['TaskName', 'Duration']
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
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('render year in timeline', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export with column header template with fittowidth', () => {
    let ganttObj: Gantt;
    let i: number = 0;
    let pdfColumnHeaderQueryCellInfo = (args: any) => {
        let base64Array: Object[] = [
            { 'TaskName': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABgAAQEBAQEAAAAAAAAAAAAAAAYIAAcF/8QALBAAAQQCAgEDAwIHAAAAAAAAAQIDBAUGBxESAAgTIRQVQRYxFzhXdpa01f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwB7gessOlaiw2zpdS4Ld2cqngOyl2rLbHcqjpLiy6IzylL7/gp/J+RxwQQt68w6mewu7XrfEKC+azXGuiqiO2r2ybqKnhD3stLVy2TyOg/cj5A5IXr4G8Cf9+aD0XT6K2Nb1GlsEgz4OJW8mLKjY5DaeYdRDdUhxC0thSVJUAQoEEEAjwNW2XoFprGLb1E/QEGdBeRJiyoztK08w6hQUhxC0kFKkqAIUCCCAR4CDD9sbV2RWSso19r3BrDGza2NfWWEnOH21T2Yst2MJKUs1ryAhwslSeHFfBHyRwSHnW26tv12qpO5Ier8GtMdYoVZI2qJm01L0iCGPfC0IeqEcKLfyErKT+DwfjwFvqO/l62h/Zl3/oveB0TwJTe2FRYxX5RqrLrj065HUuZRdzXIOQ7GRHc6yLV+YlmVDcgPJS6044AQVHhTY/I58Ao3lmJUeibfRWBZH6bKCFbUL1K7PTtRpTrzjsQRlzJCWqxoPyFISkqWepUQOfj48Ctdj4j/ABA15lGB/cPoP1JSzaj6v2vd+n+oYW17nTsnv1789ew5445H7+Ad+x+oX+qGu/8AA53/AGPA5drHb+D4rru/xSy3nrPG86i5hkwnOXDjbTIkG9lrU4qCqY271W0R0BfJSFI5UvqQQKWW5cOT6NMhxTZO+9d5Fl72ByIYjQrmM9LMo1oQll0iXIMuSH+3Z9BSlaiFBCeOSH//2Q==' },
            { 'StartDate': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABcAAQEBAQAAAAAAAAAAAAAAAAcABgX/xAAzEAAABAQDBwEGBwAAAAAAAAABAgMEBQYHEQgSEwAUFRYYITI0IiQxMzVCN0NRVWaCg//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAGBEBAQEBAQAAAAAAAAAAAAAAABEBIUH/2gAMAwEAAhEDEQA/AG2t2PafKP4qHFI3sLlRGR4bE4QlEIi4Yu1XqLJdBsq5UAU1spjEKqoJQBIfEoZTD8QCJcxxTdhwp3JlI6RxCQ5yYQmGOVYjEVYbE8oPVoi8VFNMVRanEoInbjcUvIxwAw27BTHjim7EfTuc6R1ciEhyawi0MbKw6IpQ2J5ReoxFmqCagpC6OBRRI4G4JeRSAJgv3B3ojj2nysGKhvSNlC5UWkeJROLpQ+It2LtJ6syQQcqtlBFRbKUxypJiYBSDyMGUo/AOtP7GoFVcRtTZRkWjGHiLcm8F3qKTvLi68Qd72wIoTMslm1MmmcgXAtigmAXsO1lSwYwJKqEwV0mLD8yw54TiTFLMNJFXblWUHAMjpHK2MAJnC5xNZ2n2EgB2N37BdCqOpVQl+uku4fnuHPCceYpmhp4q0cpSg4FkRIhXJhBQ42OBrNFOwEEO5e/cbIUnSAxqBSrEbTKUZ6oxh4hPOXGt1ikkS4uhEGm6MDqHyrK5dPPqEINgNcoqANrhskLWameB0/jWL2uPPWIuYaV6PLO68Jm5CB8SvCy58+qA62nYlreOqN/INmGiCT5cpetjBnmEvcV00w2XUIAio0ndKem6L2Jq5GN2ykQEMixQEygaYBcN3KH5Y7PTxThLlL0cYMjQlliummJS6vAFlHc7qz03WewxXI+s2TiABkRKIlTDTELjvBg/MDZ6eF+WIHT+C4vaHci4i5hqprczb1xabkI5w20LNkyaQBo6lz3v5aQW8R2aYz1VOkrq9rP1Sfx3gX1P9rJvPof8PP8Ar92zDQxLHQ71NzbzJ+EHBkuAfV/X5Gefw968t8+Z7P6fZs4dUz9DvU3KXLf4QcGV4/8AV/X5HmTz968tz+X7P6/fs4dM9K+krq9ox0t/yLjv1P8Aaz7t67/fw/t9uzTH/9k=' },
            { 'Progress': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABoAAAICAwAAAAAAAAAAAAAAAAAIAwUGBwn/xAArEAAABQIEBQQDAQAAAAAAAAABAgQFBgMHABESFAgTFSEiFhcxMiQzYWL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A6p4AwBgDAK3BuMx4n0rYrftUSgyaWSFuTuiVlVyt1LWLRroSria6pGUycDbYwHEAqjl9ft2wELJxwJ5HEJLPGZJbtQxRDZ9aV+pXwm13dUaSfwMwgc+o5RDwKbL5HIO+Ay6N8Q85l8QaZ5HYpbtWxPnP2Cv1g7U+dyao0qvgdkA5cjlEPIoZ5ZhmHfATzm+d2YC0vrm62ygympHm5Q6KkaSarjVjUaFA1c+gTtBaYm5ZREAE4Z/Hz2wC92j4bLmQW9EOvm+W2nNRwjrCgaVLIkpsFSieonZCNgmIrM8FMJREnNDOiA99P+sBUQng6m8OtDcq1XpO4iv3D6N+f02PU9jsFRq/6+ujzderT9iacs/L4wG3bbW5m9vbQxO1XtNcRf6X3/5/Lj1LcblUev8Ar6ybRp16fsOeWfb4wFvdxruZOmWYlY7FTmm4SJhXtKairVsFOiSooQnTAY9QroYwFAT6hyII9sv7gGcwBgDAGA//2Q==' }
        ]
        while (i < base64Array.length) {
            const key = Object.keys(base64Array[i])[0];
            const value = base64Array[i][key];
            if (key === args.column.field) {
                args.headerTemplate.image = [{
                    base64: value, width: 250, height: 20
                }];
                args.headerTemplate.value = args.column.field;
                args.headerTemplate.fontStyle.fontColor = new PdfColor(255, 0, 0);
                break;
            }
            i++;
        }
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: templateData,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskName', width: 250 },
                    { field: 'StartDate' },
                    { field: 'Progress' }
                ],
                toolbar: ['PdfExport'],
                resources: projectResourcestemplate,
                pdfColumnHeaderQueryCellInfo: pdfColumnHeaderQueryCellInfo,
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('07/06/2019'),
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with column template', () => {
        ganttObj.pdfExport();
        let pdfPage =ganttObj.pdfExportModule.pdfPage.graphics;
        let bounds= {height:550,width:82,x:0.5,y:0.5};
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0).remainingString = '';
        ganttObj.pdfExportModule.helper['row'].cells.getCell(0)['draw'](pdfPage,bounds,false,0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export with column template without height and width to image', () => {
    let ganttObj: Gantt;
    function pdfQueryCellInfo(args: PdfQueryCellInfoEventArgs): any {
        args.image = { height: 40, width: 40, base64: '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' };        
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
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
                toolbar: ['PdfExport'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Left' },
                    { field: 'TaskName', headerText: 'Task Name', width: '250' },
                    { field: 'resources', headerText: 'Resources', width: '250' },
                    { field: 'EmailId', headerText: 'Email ID', width: 180 }
                ],
                allowExcelExport: true,
                pdfQueryCellInfo: pdfQueryCellInfo,
                allowPdfExport: true,
                allowSelection: true,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Gantt PDF Export with column template', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with column template without height and width to image', () => {
    let ganttObj: Gantt;
    function pdfQueryCellInfo(args: PdfQueryCellInfoEventArgs): any {
        args.hyperLink = {
            target: 'mailto:' + 'FullerKing@gmail.com',
            displayText: 'FullerKing@gmail.com'
        };
        }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
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
                toolbar: ['PdfExport'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Left' },
                    { field: 'TaskName', headerText: 'Task Name', width: '250' },
                    { field: 'resources', headerText: 'Resources', width: '250' },
                    { field: 'EmailId', headerText: 'Email ID', width: 180 }
                ],
                allowExcelExport: true,
                pdfQueryCellInfo: pdfQueryCellInfo,
                allowPdfExport: true,
                allowSelection: true,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Gantt PDF Export with column template', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with column template', () => {
    let ganttObj: Gantt;
    function pdfQueryCellInfo(args: PdfQueryCellInfoEventArgs): any {
        if (args.column.headerText === 'Resources') {
            {
                args.image = { height: 40, width: 40, base64: (args as any).data.taskData.resourcesImage };
            }
        }
        if (args.column.headerText === 'Email ID') {
            args.hyperLink = {
                target: 'mailto:' + (args as any).data.taskData.EmailId,
                displayText: (args as any).data.taskData.EmailId
            };
        }
        if (args.column.field == 'Progress') {
            if (args.value === 10) {
                args.style = { backgroundColor: new PdfColor(205, 92, 92) };
                args.style.borderColor = new PdfColor(205, 92, 92);
                args.style.fontBrush = new PdfColor(205, 92, 92);
                args.style.fontStyle = 1;
                args.style.fontFamily = 0;
                args.style.fontSize = 12
            }
            else if (args.value === 20) {
                args.style = { borderColor: new PdfColor(205, 92, 92) };
                args.style.fontColor = new PdfColor(205, 92, 92);
                args.style.fontStyle = 2;
                args.style.fontFamily = 1;
                args.style.fontSize = 12
            }
            else if (args.value === 30) {
                args.style = { fontBrush: new PdfColor(205, 92, 92) };
                args.style.fontStyle = 4;
                args.style.fontFamily = 2;
                args.style.fontSize = 12;
                args.style.padding.all = 2;
            }
            else if (args.value === 40) {
                args.style = { backgroundColor: new PdfColor(205, 92, 92) };
                args.style.fontStyle = 8;
                args.style.fontFamily = 3;
                args.style.fontSize = 12
            }
            else {
                args.style = { backgroundColor: new PdfColor(205, 92, 92) };
                args.style.fontStyle = 0;
                args.style.fontFamily = 4;
            }
        }
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
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
                toolbar: ['PdfExport'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Left' },
                    { field: 'TaskName', headerText: 'Task Name', width: '250' },
                    { field: 'resources', headerText: 'Resources', width: '250', template: '#columnTemplate' },
                    { field: 'EmailId', headerText: 'Email ID', template: '#template2', width: 180 }
                ],
                allowExcelExport: true,
                pdfQueryCellInfo: pdfQueryCellInfo,
                allowPdfExport: true,
                allowSelection: true,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Gantt PDF Export with column template', () => {
        let exportProperties: PdfExportProperties = {
            pageSize : 'B1'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export for baseline task', () => {
    let ganttObj: Gantt;
    let datasource: Object[]=  [
        {
            TaskId: 1, TaskName: 'Receive vehicle and create job card', BaselineStartDate: new Date('03/05/2024 10:00:00 AM'),
            BaselineEndDate: new Date('12/05/2024 10:00:00 AM'), StartDate: new Date('03/05/2024 10:00:00 AM'),
            EndDate: new Date('06/05/2024 10:00:00 AM')
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks'
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
                toolbarClick: (args?: ClickEventArgs) => {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        let exportProperties: PdfExportProperties = {
                            fitToWidthSettings: {       
                                isFitToWidth: true,       
                            }       
                        };
                        ganttObj.pdfExport(exportProperties);
                    }
                },
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
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
                allowResizing: true,
                readOnly: false,
                height: '550px',
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
              projectStartDate:new Date('03/05/2024'),
              projectEndDate:new Date('10/05/2024'),
            }, done);
    });
    it('Export data with baseline', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export for baseline task', () => {
    let ganttObj: Gantt;
    let datasource: Object[]=  [
        {
            TaskId: 1, TaskName: 'Receive vehicle and create job card', BaselineStartDate: new Date('03/05/2024 10:00:00 AM'),
            BaselineEndDate: new Date('12/05/2024 10:00:00 AM'), StartDate: new Date('03/05/2024 10:00:00 AM'),
            EndDate: new Date('06/05/2024 10:00:00 AM')
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks'
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

                toolbarClick: (args?: ClickEventArgs) => {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        ganttObj.pdfExport();
                    }
                },
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
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
                allowResizing: true,
                readOnly: false,
                height: '550px',
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
              projectStartDate:new Date('03/05/2024'),
              projectEndDate:new Date('10/05/2024'),
            }, done);
    });
    it('Export data with baseline', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt pdf export with pdfQueryCellInfo', () => {
    let ganttObj: Gantt;
    let exportComplete: () => void = () => true;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: pdfquerycelldata,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks'
                },
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 30,
                timelineSettings: {
                    topTier: {
                        unit: 'Year',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Month',
                        count: 1
                    }
                },
                pdfExportComplete: exportComplete,
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress',
                    rightLabel: 'TaskName'
                },
                beforePdfExport: (args: any) => {
                    ganttObj.beforePdfExport = undefined;
                    args.cancel = true;
                },
                pdfQueryCellInfo: (args: any) => {
                    if (args.column.field == 'Progress') {
                        if (args.value === 10) {
                            args.style = { backgroundColor: new PdfColor(205, 92, 92) };
                            args.style.fontStyle = 'Italic';
                            args.style.fontFamily = 'TimesRoman';
                            args.style.fontSize = 12
                        }
                        else if (args.value === 20) {
                            args.style = { borderColor: new PdfColor(205, 92, 92) };
                            args.style.fontStyle = 'Bold';
                            args.style.fontFamily = 'TimesRoman';
                            args.style.fontSize = 12
                        }
                        else if (args.value === 30) {
                            args.style = { fontBrush: new PdfColor(205, 92, 92) };
                            args.style.fontStyle = 'Strikeout';
                            args.style.fontFamily = 'TimesRoman';
                            args.style.fontSize = 12
                        }
                        else if (args.value === 40) {
                            args.style = { backgroundColor: new PdfColor(205, 92, 92) };
                            args.style.fontStyle = 'Regular';
                            args.style.fontFamily = 'TimesRoman';
                            args.style.fontSize = 12
                        }
                        else {
                            args.style = { backgroundColor: '#A569BD' };
                            args.style.fontStyle = 'Underline';
                        }
                    }
                },
            }, done);
    });
    it("Export cancel Check", () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
// describe('Gantt PDF Export  getting console error', () => {
//     let ganttObj: Gantt;
//     beforeAll((done: Function) => {
//         ganttObj = createGantt(
//             {
//                 dataSource: editingDatas,
//                 resources: editingResourcess,
//                 allowSorting: true,
//                 allowReordering: true,
//                 enableContextMenu: true,
//                 taskFields: {
//                     id: 'TaskID',
//                     name: 'TaskName',
//                     startDate: 'StartDate',
//                     duration: 'Duration',
//                     progress: 'Progress',
//                     dependency: 'Predecessor',
//                     child: 'subtasks',
//                     resourceInfo: 'resources'
//                 },
//                 renderBaseline: true,
//                 baselineColor: 'red',
//                 editSettings: {
//                     allowAdding: true,
//                     allowEditing: true,
//                     allowDeleting: true,
//                     allowTaskbarEditing: true,
//                     showDeleteConfirmDialog: true
//                 },
//                 columns: [
//                     { field: 'TaskID', headerText: 'Task ID' },
//                     { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
//                     { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
//                     { field: 'Duration', headerText: 'Duration', allowEditing: false },
//                     { field: 'Progress', headerText: 'Progress', allowFiltering: false },
//                     { field: 'CustomColumn', headerText: 'CustomColumn' }
//                 ],
//                 sortSettings: {
//                     columns: [{ field: 'TaskID', direction: 'Ascending' },
//                     { field: 'TaskName', direction: 'Ascending' }]
//                 },
//                 toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
//                     'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

//                 toolbarClick: (args?: ClickEventArgs) => {
//                     if (args.item.id === 'ganttContainer_excelexport') {
//                         ganttObj.excelExport();
//                     } else if (args.item.id === 'ganttContainer_csvexport') {
//                         ganttObj.csvExport();
//                     } else if (args.item.id === 'ganttContainer_pdfexport') {
//                         let pdfExportProperties = {
//                             ganttStyle: {
//                                 font: new PdfTrueTypeFont(adventProFont1, 12)
//                             },
//                             fileName: `newFile.pdf`,
//                         }
//                         ganttObj.pdfExport(pdfExportProperties);
//                     }
//                 },
//                 allowExcelExport: true,
//                 allowPdfExport: true,
//                 allowSelection: true,
//                 allowRowDragAndDrop: true,
//                 selectedRowIndex: 1,
//                 splitterSettings: {
//                     position: "50%",
//                     // columnIndex: 4
//                 },
//                 selectionSettings: {
//                     mode: 'Row',
//                     type: 'Single',
//                     enableToggle: false
//                 },
//                 tooltipSettings: {
//                     showTooltip: true
//                 },
//                 filterSettings: {
//                     type: 'Menu'
//                 },
//                 allowFiltering: true,
//                 gridLines: "Both",
//                 showColumnMenu: true,
//                 highlightWeekends: true,
//                 timelineSettings: {
//                     showTooltip: true,
//                     topTier: {
//                         unit: 'Week',
//                         format: 'dd/MM/yyyy'
//                     },
//                     bottomTier: {
//                         unit: 'Day',
//                         count: 1
//                     }
//                 },
//                 eventMarkers: [
//                     {
//                         day: new Date('04/02/2024'),
//                     }, {
//                         day: new Date("04/09/2024"),
//                         label: 'Research phase'
//                     }, {
//                         day: new Date("04/30/2024"),
//                         label: 'Design phase'
//                     }, {
//                         day: new Date("05/23/2024"),
//                         label: 'Production phase'
//                     }, {
//                         day: new Date("06/20/2024"),
//                         label: 'Sales and marketing phase'
//                     }
//                 ],
//                 holidays: [{
//                     from: new Date('04/04/2024'),
//                     to: new Date('04/04/2024'),
//                     label: 'Local Holiday'
//                 }, {
//                     from: new Date('04/19/2024'),
//                     to: new Date('04/19/2024'),
//                     label: 'Good Friday'
//                 }, {
//                     from: new Date('04/30/2024'),
//                     to: new Date('04/30/2024'),
//                     label: 'Release Holiday'
//                 },],
//                 resourceFields: {
//                     id: 'resourceId',
//                     name: 'resourceName'
//                 },
//                 searchSettings:
//                 {
//                     fields: ['TaskName', 'Duration']
//                 },
//                 labelSettings: {
//                     leftLabel: 'TaskID',
//                     rightLabel: 'Task Name: ${taskData.TaskName}',
//                     taskLabel: '${Progress}%'
//                 },
//                 allowResizing: true,
//                 readOnly: false,
//                 taskbarHeight: 20,
//                 rowHeight: 40,
//                 height: '550px',
//                 allowUnscheduledTasks: true,
//                 //  connectorLineBackground: "red",
//                 //  connectorLineWidth: 3,
//                 projectStartDate: new Date('03/25/2024'),
//                 projectEndDate: new Date('07/28/2024'),
//                 pdfExportComplete: (args: any) => {
//                     expect(args.name).toBe("pdfExportComplete");
//                 },

//             }, done);
//     });
//     it('Export data with custom font', () => {
//         ganttObj.pdfExport();
//     });
//     afterAll(() => {
//         if (ganttObj) {
//             destroyGantt(ganttObj);
//         }
//     });
// });
// describe('Gantt PDF Export  getting console error', () => {
//     let ganttObj: Gantt;
//     beforeAll((done: Function) => {
//         ganttObj = createGantt(
//             {
//                 dataSource: overviewData,
//         resources: editingResources,
//         height: '500px',
//         width: "100%",
//         highlightWeekends: true,
//         allowSelection: true,
//         allowSorting: true,
//         treeColumnIndex: 1,
//         viewType: 'ProjectView',
//         taskFields: {
//             id: 'TaskId',
//             name: 'TaskName',
//             startDate: 'StartDate',
//             endDate: 'EndDate',
//             duration: 'TimeLog',
//             progress: 'Progress',
//             dependency: 'Predecessor',
//             parentID: 'ParentId',
//             resourceInfo: 'Assignee'
//         },
//         resourceFields: {
//             id: 'resourceId',
//             name: 'resourceName',
//         },
//         columns: [
//             { field: 'TaskId', width: 60, visible: false },
//             { field: 'TaskName', width: 200, headerText: 'Product Release' },
//             { field: 'Assignee', width: 130, allowSorting: false, headerText: 'Assignee', template: '#columnTemplate' },
//             // { field: 'Status', minWidth: 100, width: 120, headerText: 'Status', template: '#columnTemplate1' },
//             // { field: 'Priority', minWidth: 80, width: 100, headerText: 'Priority', template: '#columnTemplate2' },
//             { field: 'Work', width: 120, headerText: 'Planned Hours' },
//             { field: 'TimeLog', width: 120, headerText: 'Work Log' }
//         ],
//         pdfQueryCellInfo(args) {
//             if (args.column.headerText === 'Assignee' && args.data.taskData.resourcesImage) {
//                 {
//                     args.image = { height:30,width:30, base64: args.data.taskData.resourcesImage };
//                 }
//             }
//         },
//         toolbar: ['ExpandAll', 'CollapseAll', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'ExcelExport', 'CsvExport', 'PdfExport'],
//         allowExcelExport: true,
//         allowPdfExport: true,
//         splitterSettings: {
//             position: "50%",
//         },
//         selectionSettings: {
//             mode: 'Row',
//             type: 'Single',
//             enableToggle: true
//         },
//         tooltipSettings: {
//             showTooltip: true
//         },
//         filterSettings: {
//             type: 'Menu'
//         },
//         allowFiltering: true,
//         gridLines: "Vertical",
//         showColumnMenu: true,
//         timelineSettings: {
//             showTooltip: true,
//             topTier: {
//                 unit: 'Month',
//                 format: 'MMM yyyy'
//             },
//             bottomTier: {
//                 unit: 'Day',
//                 count: 4,
//                 format: 'dd'
//             }
//         },
//         eventMarkers: [
//             {
//                 day: '04/04/2024',
//                 cssClass: 'e-custom-event-marker',
//                 label: 'Q-1 Release'
//             },
//             {
//                 day: '06/30/2024',
//                 cssClass: 'e-custom-event-marker',
//                 label: 'Q-2 Release'
//             },
//             {
//                 day: '09/29/2024',
//                 cssClass: 'e-custom-event-marker',
//                 label: 'Q-3 Release'
//             }
//         ],
//         holidays: [{
//             from: "01/01/2024",
//             to: "01/01/2024",
//             label: "New Year holiday",
//             cssClass: "e-custom-holiday"
//         },
//         {
//             from: "12/25/2023",
//             to: "12/26/2023",
//             label: "Christmas holidays",
//             cssClass: "e-custom-holiday"
//         }],
//         labelSettings: {
//             rightLabel: 'Assignee',
//             taskLabel: '${Progress}%'
//         },
//         allowResizing: true,
//         taskbarHeight: 24,
//         rowHeight: 36,
//         projectStartDate: new Date('12/17/2023'),
//         projectEndDate: new Date('10/26/2024'),

//             }, done);
//     });
//     it('Export data with image', () => {
//         ganttObj.pdfExport();
//     });
//     afterAll(() => {
//         if (ganttObj) {
//             destroyGantt(ganttObj);
//         }
//     });
// });
describe('Gantt PDF Export with manual task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR911356manualTask,
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    resourceInfo: 'resources'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                taskMode: 'Manual',
                toolbar: ['PdfExport'],
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
                    { field: 'TaskName' }
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
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                }
            }, done);
    });
    it('Export data with manual task', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with custom font size', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR912356font,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                labelSettings: {
                    rightLabel: "TaskName",
                    leftLabel: "TaskID",
                },
            }, done);
    });
    it('Export data custom font size', () => {
        const exportProperties : any= {
            ganttStyle: {
                label: {
                  fontSize: 40
                }
              }
        }
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with custom fontfamily', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR912356font,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                labelSettings: {
                    rightLabel: "TaskName",
                    leftLabel: "TaskID",
                },
            }, done);
    });
    it('Export data with custom fontfamily', () => {
        const exportProperties : any= {
            ganttStyle: {
                label: {
                  fontFamily: 'ZapfDingbats'
                }
              }
        }
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with custom fontstyle', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR912356font,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                labelSettings: {
                    rightLabel: "TaskName",
                    leftLabel: "TaskID",
                },
            }, done);
    });
    it('Export data with custom fontstyle', () => {
        const exportProperties : any= {
            ganttStyle: {
                label: {
                  fontStyle: 'Strikeout'
                }
              }
        }
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with custom fontstyle', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR912356font,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                labelSettings: {
                    rightLabel: "TaskName",
                    leftLabel: "TaskID",
                },
            }, done);
    });
    it('Export data with custom fontstyle', () => {
        const exportProperties : any= {
            ganttStyle: {
                label: {
                  fontStyle: 'Strikeout',
                  padding: new PdfPaddings(10,10,10,10)
                }
              }
        }
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('console error Gantt PDF Export with custom fontstyle', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR912356font,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                labelSettings: {
                    rightLabel: "TaskName",
                    leftLabel: "TaskID",
                },
            }, done);
    });
    it('Export data with custom fontstyle', () => {
        const exportProperties: any = {
            pageSize: 'A0',
            enableFooter: true,
            ganttStyle: {
                columnHeader: {
                    padding: new PdfPaddings(10, 10, 10, 10),
                },
            },
        }
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt PDF Export for baseline task', () => {
    let ganttObj: Gantt;
    let datasource: Object[]=  [
        {
            TaskId: 1,
            TaskName: 'Receive vehicle and create job card',
            BaselineStartDate: new Date('03/05/2024'),
            BaselineEndDate: new Date('12/05/2025'),
            StartDate: new Date('03/05/2024'),
            EndDate: new Date('12/03/2024'),
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

                toolbarClick: (args?: ClickEventArgs) => {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        ganttObj.pdfExport();
                    }
                },
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
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
                allowResizing: true,
                readOnly: false,
                height: '550px',
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
              projectStartDate: new Date('01/01/2025'),
              projectEndDate: new Date('10/05/2026'),
            }, done);
    });
    it('Export data with baseline', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export for baseline task', () => {
    let ganttObj: Gantt;
    let datasource: Object[]=  [
        {
            TaskId: 1,
            TaskName: 'Receive vehicle and create job card',
            BaselineStartDate: new Date('03/05/2024'),
            BaselineEndDate: new Date('12/05/2025'),
            StartDate: new Date('03/05/2024'),
            EndDate: new Date('12/03/2024'),
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datasource,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

                toolbarClick: (args?: ClickEventArgs) => {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        ganttObj.pdfExport();
                    }
                },
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
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
                allowResizing: true,
                readOnly: false,
                height: '550px',
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
              projectStartDate: new Date('01/01/2025'),
              projectEndDate: new Date('10/05/2026'),
            }, done);
    });
    it('Export data with baseline', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('console error occurs while exporting pdf with empty data and cirtical path', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
                height: '450px',
                dayWorkingTime: [{
                    from: 0,
                    to: 24
                }],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                labelSettings: {
                    rightLabel: "TaskName",
                    leftLabel: "TaskID",
                },
                enableCriticalPath: true,
            }, done);
    });
    it('console error occurs while exporting pdf with empty data and cirtical path', () => {
        ganttObj.pdfExport();
        expect(ganttObj.currentViewData.length).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export  not visible last three records', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttData,
    toolbar: ['PdfExport','ZoomToFit'],
    toolbarClick: (args :any) =>{

        if (args.item.id === 'ganttContainer_pdfexport') {
          var exportProperties : PdfExportProperties = {
           // connectorLineColor: new PdfColor(0, 168, 173),
            fitToWidthSettings: {
              gridWidth: "20%",
              chartWidth: "80%",
              isFitToWidth: true,
            },
            header: {
              fromTop: 0,
              height: 130,
              contents: [{
                type: "Text",
                value: 'title',
                position: {
                  x: 3480 / 2 - ('title'.length / 2) * 14,
                  y: 30
                },
                style: {
                  fontSize: 30
                },
              }, ],
            },
            footer: {
              fromBottom: 160,
              height: 100,
              contents: [{
                type: "PageNumber",
                pageNumberType: "Arabic",
                format: "Page {$current} of {$total}",
                position: {
                  x: 1528 / 2 - 10,
                  y: 25
                },
                size: {
                  height: 50,
                  width: 100
                },
                style: {
                  fontSize: 30,
                  hAlign: "Center",
                  vAlign: "Bottom",
                },
              }, ],
            },
            enableFooter: false,
            ganttStyle: {
              fontFamily: 1,
              taskbar: {
                taskColor: new PdfColor(223, 234, 235),
                taskBorderColor: new PdfColor(159, 191, 194),
                progressColor: new PdfColor(0, 119, 139),
                milestoneColor: new PdfColor(61, 57, 53), // "#B8394C";
                baselineColor: new PdfColor(194, 194, 194),
                baselineBorderColor: new PdfColor(194, 194, 194),
              },
              connectorLineColor: new PdfColor(0, 168, 173),
              criticalConnectorLineColor: new PdfColor(0, 168, 173),
              timeline: {
                fontStyle: 1,
              },
              font: new PdfTrueTypeFont(adventProFonts1, 12),
            },
           pageOrientation: "Portrait",
          pageSize: "A0",
          };
          ganttObj.pdfExport(exportProperties);
        }
      },

    dateFormat: "dd/MM/yyyy HH:mm",
    timezone: "Asia/Shanghai",
    includeWeekend: true,
    dayWorkingTime: [{
      from: 0.01,
      to: 24
    }], 
    renderBaseline: true,
    taskFields: {
      id: "taskID",
      name: "taskName",
      // milestone: "milestone", 
      startDate: "startDate",
      endDate: "endDate",
      duration: "duration",
      progress: "progress",
      dependency: "dependency",
      notes: "notes",
      child: "subtasks",
      expandState: "expandState",
      cssClass: "cssClass",
      baselineStartDate: "baselineStartDate",
      baselineEndDate: "baselineEndDate",
    },
    //height: "calc(100vh - 325px)", // height: "768px",
    labelSettings: {
      // rightLabel: "taskName",
      // leftLabel: "taskID",
    },
    eventMarkers: [{
      day: new Date(),
      label: "Today"
    }],
    enableCriticalPath: true,
    highlightWeekends: true,
   // queryTaskbarInfo: queryTaskbarInfo,
    columns: [{
        field: "taskID",
        width: '100px'
      },
      {
        field: "taskName",
        width: '300px'
      },
    ],
    allowPdfExport: true,
    gridLines: "Both",
   // pdfQueryTaskbarInfo: pdfQueryTaskbarInfo,
            }, done);
    });
    it('Export data not visible last three records', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Gantt PDF Export Words and taskbar alignment are misaligned in pdf file when row height is less than 20', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData4,
                dateFormat: 'MMM dd, y',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    resourceInfo: 'resources',
                    milestone: 'isMilestone'
                },

                holidays: [
                    {
                        from: new Date('04/04/2024'),
                        to: new Date('04/04/2024'),
                        label: 'Local Holiday',
                    },
                    {
                        from: new Date('04/19/2024'),
                        to: new Date('04/19/2024'),
                        label: 'Good Friday',
                    },
                    {
                        from: new Date('04/30/2024'),
                        to: new Date('04/30/2024'),
                        label: 'Release Holiday',
                    },
                ],
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', width: 250 },
                ],
                allowExcelExport: true,
                allowPdfExport: true,
                toolbar: ['ExcelExport', 'CsvExport', 'PdfExport'],
                toolbarClick: function (args) {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        ganttObj.pdfExport();
                    }
                },
                allowSelection: true,
                gridLines: 'Both',
                height: '450px',
                treeColumnIndex: 1,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                },
                resources: editingResources4,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                },
                splitterSettings: {
                    columnIndex: 2,
                },
                projectStartDate: new Date('03/25/2024'),
                projectEndDate: new Date('07/28/2024'),
                rowHeight: 15,
            }, done);
    });
    it('Export data row height is less than 20', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Gantt PDF Export for Header image not render proeprly i', () => {
    let ganttObj: Gantt;
    let i : number = 0;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttDataPdf,
                height: '450px',
                rowHeight: 45,
                taskbarHeight: 35,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfColumnHeaderQueryCellInfo :(args: any) => {
                    let base64Array: Object[] = [
                        { 'TaskName': '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABgAAQEBAQEAAAAAAAAAAAAAAAYIAAcF/8QALBAAAQQCAgEDAwIHAAAAAAAAAQIDBAUGBxESAAgTIRQVQRYxFzhXdpa01f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwB7gessOlaiw2zpdS4Ld2cqngOyl2rLbHcqjpLiy6IzylL7/gp/J+RxwQQt68w6mewu7XrfEKC+azXGuiqiO2r2ybqKnhD3stLVy2TyOg/cj5A5IXr4G8Cf9+aD0XT6K2Nb1GlsEgz4OJW8mLKjY5DaeYdRDdUhxC0thSVJUAQoEEEAjwNW2XoFprGLb1E/QEGdBeRJiyoztK08w6hQUhxC0kFKkqAIUCCCAR4CDD9sbV2RWSso19r3BrDGza2NfWWEnOH21T2Yst2MJKUs1ryAhwslSeHFfBHyRwSHnW26tv12qpO5Ier8GtMdYoVZI2qJm01L0iCGPfC0IeqEcKLfyErKT+DwfjwFvqO/l62h/Zl3/oveB0TwJTe2FRYxX5RqrLrj065HUuZRdzXIOQ7GRHc6yLV+YlmVDcgPJS6044AQVHhTY/I58Ao3lmJUeibfRWBZH6bKCFbUL1K7PTtRpTrzjsQRlzJCWqxoPyFISkqWepUQOfj48Ctdj4j/ABA15lGB/cPoP1JSzaj6v2vd+n+oYW17nTsnv1789ew5445H7+Ad+x+oX+qGu/8AA53/AGPA5drHb+D4rru/xSy3nrPG86i5hkwnOXDjbTIkG9lrU4qCqY271W0R0BfJSFI5UvqQQKWW5cOT6NMhxTZO+9d5Fl72ByIYjQrmM9LMo1oQll0iXIMuSH+3Z9BSlaiFBCeOSH//2Q=='},
                        { 'StartDate' : '/9j/4AAQSkZJRgABAQIAHAAcAAD/4QBiRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAMAAAITAAMAAAABAAEAAAAAAAAAAAAcAAAAAQAAABwAAAAB/9sAQwADAgICAgIDAgICAwMDAwQGBAQEBAQIBgYFBgkICgoJCAkJCgwPDAoLDgsJCQ0RDQ4PEBAREAoMEhMSEBMPEBAQ/9sAQwEDAwMEAwQIBAQIEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/8AAEQgAIAAgAwERAAIRAQMRAf/EABcAAQEBAQAAAAAAAAAAAAAAAAcABgX/xAAzEAAABAQDBwEGBwAAAAAAAAABAgMEBQYHEQgSEwAUFRYYITI0IiQxMzVCN0NRVWaCg//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAGBEBAQEBAQAAAAAAAAAAAAAAABEBIUH/2gAMAwEAAhEDEQA/AG2t2PafKP4qHFI3sLlRGR4bE4QlEIi4Yu1XqLJdBsq5UAU1spjEKqoJQBIfEoZTD8QCJcxxTdhwp3JlI6RxCQ5yYQmGOVYjEVYbE8oPVoi8VFNMVRanEoInbjcUvIxwAw27BTHjim7EfTuc6R1ciEhyawi0MbKw6IpQ2J5ReoxFmqCagpC6OBRRI4G4JeRSAJgv3B3ojj2nysGKhvSNlC5UWkeJROLpQ+It2LtJ6syQQcqtlBFRbKUxypJiYBSDyMGUo/AOtP7GoFVcRtTZRkWjGHiLcm8F3qKTvLi68Qd72wIoTMslm1MmmcgXAtigmAXsO1lSwYwJKqEwV0mLD8yw54TiTFLMNJFXblWUHAMjpHK2MAJnC5xNZ2n2EgB2N37BdCqOpVQl+uku4fnuHPCceYpmhp4q0cpSg4FkRIhXJhBQ42OBrNFOwEEO5e/cbIUnSAxqBSrEbTKUZ6oxh4hPOXGt1ikkS4uhEGm6MDqHyrK5dPPqEINgNcoqANrhskLWameB0/jWL2uPPWIuYaV6PLO68Jm5CB8SvCy58+qA62nYlreOqN/INmGiCT5cpetjBnmEvcV00w2XUIAio0ndKem6L2Jq5GN2ykQEMixQEygaYBcN3KH5Y7PTxThLlL0cYMjQlliummJS6vAFlHc7qz03WewxXI+s2TiABkRKIlTDTELjvBg/MDZ6eF+WIHT+C4vaHci4i5hqprczb1xabkI5w20LNkyaQBo6lz3v5aQW8R2aYz1VOkrq9rP1Sfx3gX1P9rJvPof8PP8Ar92zDQxLHQ71NzbzJ+EHBkuAfV/X5Gefw968t8+Z7P6fZs4dUz9DvU3KXLf4QcGV4/8AV/X5HmTz968tz+X7P6/fs4dM9K+krq9ox0t/yLjv1P8Aaz7t67/fw/t9uzTH/9k='},
                        ]
                    while (i < base64Array.length) {
                        const key = Object.keys(base64Array[i])[0];
                        const value  = base64Array[i][key];
                        if (key === args.column.field) {
                            args.headerTemplate.image = [{
                                base64: value, width: 20, height: 20
                            }];
                            args.headerTemplate.value = args.column.field;
                            break;
                        }
                        i++;
                    }
                },
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                toolbarClick: (args: any) => {
                    if (args.item.id === 'ganttContainer_pdfexport') {
                        let exportProperties: PdfExportProperties = {
                            enableFooter: false
                        };
                        ganttObj.pdfExport(exportProperties);
                    }
                },
                resources: editingResources,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('04/30/2019'),
            }, done);
    });
    it('Export data with Header image ', () => {
        const stringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.Right;
        let exportProeprties: PdfExportProperties = {
          ganttStyle: {
            cell: {
              format: stringFormat,
              fontBrush: new PdfColor(255, 0, 0),
            },
          },
        };
        ganttObj.pdfExport(exportProeprties);
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export  not visible last three records', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewDatapdf,
                enableCriticalPath: true,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                  name: 'TaskName',
                  startDate: 'StartDate',
                  duration: 'Duration',
                  progress: 'Progress',
                  child: 'subtasks',
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
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

                toolbarClick: (args?: ClickEventArgs) => {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        let exportProperties: PdfExportProperties = {

                            ganttStyle: {
                                font: new PdfTrueTypeFont(adventProFonts1, 12),
                              },
                        };
                        ganttObj.pdfExport(exportProperties);
                    }
                },
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
                    label: "这是中文）括号s",
                    cssClass: "e-custom-holiday"

                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: "这是中文）括号",
                    cssClass: "e-custom-holiday"

                }],
                searchSettings:
                 { fields: ['TaskName', 'Duration'] 
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'TaskName',
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Export data not visible last three records', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Gantt PDF Export  not visible last three records', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectpdfNewData,
                allowSorting: true,
    allowReordering: true,
    enableContextMenu: true,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency:'Predecessor',
        baselineStartDate: "BaselineStartDate",
        baselineEndDate: "BaselineEndDate",
        child: 'subtasks',
        indicators: 'Indicators'
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
        { field: 'TaskID', headerText: 'Task ID' },
        { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
        { field: 'Duration', headerText: 'Duration', allowEditing: false },
        { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
        { field: 'CustomColumn', headerText: 'CustomColumn' }
    ],
    sortSettings: {
        columns: [{ field: 'TaskID', direction: 'Ascending' }, 
        { field: 'TaskName', direction: 'Ascending' }]
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
    'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

    toolbarClick: (args?: ClickEventArgs) => {
        if (args.item.id === 'ganttContainer_excelexport') {
            ganttObj.excelExport();
        } else if (args.item.id === 'ganttContainer_csvexport') {
            ganttObj.csvExport();
        } else if (args.item.id === 'ganttContainer_pdfexport') {
            let exportProperties: PdfExportProperties = {
                ganttStyle: {
                  // fontFamily: 1,
                  timeline: {
                    fontBrush: new PdfColor(179, 219, 255)
                  },
                },
              };
            ganttObj.pdfExport(exportProperties);
        }
    },
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
    pdfExportComplete: (args: any) => {
        expect(args.name).toBe("pdfExportComplete");
    },
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
    readOnly: false,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    allowUnscheduledTasks: true,
  //  connectorLineBackground: "red",
  //  connectorLineWidth: 3,
    projectStartDate: new Date('03/25/2019'),
    projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Export data not visible last three records', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Gantt PDF Export Words and taskbar alignment are misaligned in pdf file when row height is less than 20', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData4,
                dateFormat: 'MMM dd, y',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    resourceInfo: 'resources',
                    milestone: 'isMilestone'
                },
             
                holidays: [
                    {
                        from: new Date('04/04/2024'),
                        to: new Date('04/04/2024'),
                        label: 'Local Holiday',
                    },
                    {
                        from: new Date('04/19/2024'),
                        to: new Date('04/19/2024'),
                        label: 'Good Friday',
                    },
                    {
                        from: new Date('04/30/2024'),
                        to: new Date('04/30/2024'),
                        label: 'Release Holiday',
                    },
                ],
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', width: 250 },
                ],
                allowExcelExport: true,
                allowPdfExport: true,
                toolbar: ['ExcelExport', 'CsvExport', 'PdfExport'],
                toolbarClick: function (args) {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        ganttObj.pdfExport();
                    }
                },
                allowSelection: true,
                gridLines: 'Both',
                height: '450px',
                treeColumnIndex: 1,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                },
                resources: editingResources4,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                },
                splitterSettings: {
                    columnIndex: 2,
                },
                projectStartDate: new Date('03/25/2024'),
                projectEndDate: new Date('07/28/2024'),
                rowHeight: 15,
            }, done);
    });
    it('Export data row height is less than 20', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Gantt PDF Export with font brush', () => {
    let ganttObj: Gantt;
    let GanttData: Object[] = [
        {
          TaskID: 5,
          TaskName: 'Project Estimation',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/10/2019'),
          Indicators: [
            {
              date: '04/13/2019',
              iconClass:
                'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
              name: 'Indicator title',
            },
          ],
          subtasks: [
            {
              TaskID: 6,
              TaskName: 'Develop floor plan for estimation',
              StartDate: new Date('04/04/2019'),
              Duration: 3,
              Progress: 85,
            },
            {
              TaskID: 7,
              TaskName: 'List materials',
              StartDate: new Date('04/04/2019'),
              Duration: 3,
              Progress: 15,
            },
            {
              TaskID: 8,
              TaskName: 'Estimation approval',
              StartDate: new Date('04/04/2019'),
              Duration: 3,
              Progress: 70,
            },
          ],
        },
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttData,
                height: '450px',
                taskFields: {
                  id: 'TaskID',
                  name: 'TaskName',
                  startDate: 'StartDate',
                  duration: 'Duration',
                  progress: 'Progress',
                  dependency: 'Predecessor',
                  child: 'subtasks',
                },
                columns: [
                  { field: 'TaskID' },
                  { field: 'TaskName' },
                  { field: 'StartDate' },
                  { field: 'Duration' },
                  { field: 'Progress' },
                ],
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                labelSettings: {
                  leftLabel: 'TaskID',
                  rightLabel: 'TaskName',
                  taskLabel: 'TaskID',
                },
            }, done);
    });
    it('Exporting with font brush', () => {
        let exportProperties: PdfExportProperties = {
      ganttStyle: {
        // fontFamily: 1,
        label: {
          fontBrush: new PdfColor(179, 219, 255),
        },
      },
    };
          ganttObj.pdfExport(exportProperties);
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Gantt PDF Export label background color and border', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData4,
                height: '450px',
    taskFields: {
      id: 'TaskID',
      name: 'TaskName',
      startDate: 'StartDate',
      duration: 'Duration',
      progress: 'Progress',
      dependency: 'Predecessor',
      child: 'subtasks',
    },
    columns: [
      { field: 'TaskID' },
      { field: 'TaskName' },
      { field: 'StartDate' },
      { field: 'Duration' },
      { field: 'Progress' },
    ],
    allowPdfExport: true,
    toolbar: ['PdfExport'],
    labelSettings: {
        leftLabel: 'TaskID',
        rightLabel: 'TaskName',
        taskLabel: '${Progress}%'
    },
    toolbarClick:  (args: any) => {
        if (args.item.id === 'ganttContainer_pdfexport') {
          const borderColor = new PdfColor(0, 0, 0); // Black color
          const borderWidth = 1; // 1px width
          const pen = new PdfPen(borderColor, borderWidth); // Create PdfPen instance
          pen.dashStyle = PdfDashStyle.Solid; // Solid border style
      
          const pdfBorders = new PdfBorders();
          pdfBorders.left = pen;
          pdfBorders.right = pen;
          pdfBorders.top = pen;
          pdfBorders.bottom = pen;
          let exportProperties: PdfExportProperties = {
            ganttStyle: {
              // fontFamily: 1,
              label: {
                backgroundColor: new PdfColor(179, 219, 255),
                borderColor: new PdfColor(255, 0, 0)
              },
            },
          };
          ganttObj.pdfExport(exportProperties);
        }
      },
            }, done);
    });
    it('Export data row height is less than 20', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Critical connectorline is also applied for normal connecter line if we customizing using gantt style', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {  dataSource: GanttDatapdf1,
                enableCriticalPath: true,
    height: '450px',
    taskFields: {
      id: 'TaskID',
      name: 'TaskName',
      startDate: 'StartDate',
      duration: 'Duration',
      progress: 'Progress',
      dependency: 'Predecessor',
      child: 'subtasks',
    },
    columns: [
      { field: 'TaskID' },
      { field: 'TaskName' },
      { field: 'StartDate' },
      { field: 'Duration' }, 
      { field: 'Progress' },
    ],
    allowPdfExport: true,
    toolbar: ['PdfExport'],
    labelSettings: {
      leftLabel: 'TaskID',
      rightLabel: 'TaskName',
      taskLabel: '${Progress}%',
    },
    toolbarClick:(args: any) => {
        if (args.item.id === 'ganttContainer_pdfexport') { 

          let exportProperties: PdfExportProperties = {
            ganttStyle: {
                connectorLineColor: new PdfColor(255, 255, 102),     
                chartGridLineColor: new PdfColor(250,0, 0)
            }, 
          };
          ganttObj.pdfExport(exportProperties);
        }
      },

    pdfExportComplete: (args: any) => {
        expect(args.name).toBe("pdfExportComplete");
    },

            }, done);
    });
    it('connectorline color Updated Properly', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export for segment color task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: segmentprojectNewData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    segments: 'Segments',
                },

                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

                toolbarClick: (args?: any) => {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        let exportProperties: any = {
                            fitToWidthSettings: {
                              isFitToWidth: true,
                            },}
                        ganttObj.pdfExport(exportProperties);
                    }
                },
                allowPdfExport: true,
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                queryTaskbarInfo: (args: any) => {
                    const index = +args.taskbarElement.dataset.segmentIndex || 0;
                    if (args.data.taskData.Segments) {
                        const segment = args.data.taskData.Segments[index];
                        if (segment.foo) {
                            args.taskbarBgColor = 'red';
                        }
                    }
                },
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                      },
                      bottomTier: {
                        unit: 'Day',
                        count: 1,
                      },
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', width: 230 },
                ],
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                pdfQueryTaskbarInfo: (args: any) => {
                    if(args.taskbar.taskSegmentStyles){
                        args.taskbar.taskSegmentStyles[1].taskColor= new PdfColor(255, 0, 0)
                    }
                },
            }, done);
    });
    it('Export data with segment color', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Progress Not Updated Properly on Second Page in PDF Export', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {  dataSource: GanttDatapdf,
                height: '450px',
                enableCriticalPath: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                toolbarClick: (args?: ClickEventArgs) => {
                    if (args.item.id === 'ganttContainer_excelexport') {
                        ganttObj.excelExport();
                    } else if (args.item.id === 'ganttContainer_csvexport') {
                        ganttObj.csvExport();
                    } else if (args.item.id === 'ganttContainer_pdfexport') {
                        // let exportProperties : PdfExportProperties = {
                        //     fitToWidthSettings:{
                        //         isFitToWidth: true
                        //     }
                        // }
                        ganttObj.pdfExport();
                    }
                },

    pdfExportComplete: (args: any) => {
        expect(args.name).toBe("pdfExportComplete");
    },

            }, done);
    });
    it('Progress Not Updated Properly', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Chart grid line color is not applied to grid lines rather than it applies to footer if we use chartGridLineColor in gantt style', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
    dataSource: GanttDatapdf,
    allowSorting: true,
    allowReordering: true,
    enableContextMenu: true,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency:'Predecessor',
        baselineStartDate: "BaselineStartDate",
        baselineEndDate: "BaselineEndDate",
        child: 'subtasks',
        indicators: 'Indicators'
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
        { field: 'TaskID', headerText: 'Task ID' },
        { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
        { field: 'Duration', headerText: 'Duration', allowEditing: false },
        { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
        { field: 'CustomColumn', headerText: 'CustomColumn' }
    ],
    sortSettings: {
        columns: [{ field: 'TaskID', direction: 'Ascending' }, 
        { field: 'TaskName', direction: 'Ascending' }]
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
    'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

    toolbarClick: (args?: ClickEventArgs) => {
        if (args.item.id === 'ganttContainer_excelexport') {
            ganttObj.excelExport();
        } else if (args.item.id === 'ganttContainer_csvexport') {
            ganttObj.csvExport();
        } else if (args.item.id === 'ganttContainer_pdfexport') {
            let exportProperties: PdfExportProperties = {
                ganttStyle: {
                    chartGridLineColor: new PdfColor(250,0, 0)
                },
              };
            ganttObj.pdfExport(exportProperties);
        }
    },
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
    pdfExportComplete: (args: any) => {
        expect(args.name).toBe("pdfExportComplete");
    },
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
    readOnly: false,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    allowUnscheduledTasks: true,
            }, done);
    });
    it('Export data Chart grid line color', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Gantt PDF Export with manual taskbar', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: ganttdatamanual,
                height: '450px',
    taskMode: 'Custom',
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
      timelineSettings: {
        timelineUnitSize:100,
        topTier: {
            unit: 'Week',
            format: 'MMM dd, y',
        },
        bottomTier: {
            unit: 'Day',
        },
    },
    allowPdfExport: true,
    toolbar: ['PdfExport'],
    toolbarClick: (args?: ClickEventArgs) => {
        if (args.item.id === 'ganttContainer_excelexport') {
            ganttObj.excelExport();
        } else if (args.item.id === 'ganttContainer_csvexport') {
            ganttObj.csvExport();
        } else if (args.item.id === 'ganttContainer_pdfexport') {
            ganttObj.pdfExport();
        }
    },

            }, done);
    });
    it('Exporting with manualtaskbar', () => {
          ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Fix Border Color and Font Brush Styling Issues in TreeGrid Cells if using gantt styles in export properties.', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttDatapdf,
                height: '450px',
                taskFields: {
                  id: 'TaskID',
                  name: 'TaskName',
                  startDate: 'StartDate',
                  duration: 'Duration',
                  progress: 'Progress',
                  dependency: 'Predecessor',
                  child: 'subtasks',
                },
                columns: [
                  { field: 'TaskID' },
                  { field: 'TaskName' },
                  { field: 'StartDate' },
                  { field: 'Duration' },
                  { field: 'Progress' },
                ],
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                toolbarClick: (args: any) => {
                  if (args.item.id === 'ganttContainer_pdfexport') {
                    let exportProperties: PdfExportProperties = {
                      ganttStyle: {
                        cell: {
                          fontBrush: new PdfColor(255, 0, 0),
                        },
                      },
                    };
                    ganttObj.pdfExport(exportProperties);
                  }
                },

            }, done);
    });
    it('Export data  Font Brush Styling Issues in cell text', () => {
        let exportProperties: PdfExportProperties = {
            ganttStyle: {
              cell: {
                fontBrush: new PdfColor(255, 0, 0),
              },
            },
          };
        ganttObj.pdfExport(exportProperties);
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('Fix Border Color and Font Brush Styling Issues in TreeGrid Cells if using gantt styles in export properties.', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttDatapdf,
                height: '450px',
                taskFields: {
                  id: 'TaskID',
                  name: 'TaskName',
                  startDate: 'StartDate',
                  duration: 'Duration',
                  progress: 'Progress',
                  dependency: 'Predecessor',
                  child: 'subtasks',
                },
                columns: [
                  { field: 'TaskID' },
                  { field: 'TaskName' },
                  { field: 'StartDate' },
                  { field: 'Duration' },
                  { field: 'Progress' },
                ],
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                toolbarClick: (args: any) => {
                  if (args.item.id === 'ganttContainer_pdfexport') {
                    const borderColor = new PdfColor(0, 0, 0); // Black color
                    const borderWidth = 1; // 1px width
                    const pen = new PdfPen(borderColor, borderWidth); // Create PdfPen instance
                    pen.dashStyle = PdfDashStyle.DashDot; // Solid border style

                    const pdfBorders = new PdfBorders();
                    pdfBorders.left = pen;
                    pdfBorders.right = pen;
                    pdfBorders.top = pen;
                    pdfBorders.bottom = pen;
                    const stringFormat = new PdfStringFormat();
                    stringFormat.alignment = PdfTextAlignment.Right;
                    let exportProeprties: PdfExportProperties = {
                      ganttStyle: {
                        // fontFamily: 4,
                        cell: {
                          backgroundColor: new PdfColor(179, 219, 255),
                        //   fontSize: 30,
                          fontStyle: PdfFontStyle.Italic,
                          fontColor: new PdfColor(255, 0, 0),
                          borderColor: new PdfColor(255, 0, 0),
                          format: stringFormat,
                          fontBrush: new PdfColor(255, 0, 0),
                        },
                      },
                    };
                    ganttObj.pdfExport(exportProeprties);
                  }
                }
            }, done);
    });
    it('Export data  Font Brush Styling Issues in cell text', () => {
        const stringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.Right;
        let exportProeprties: PdfExportProperties = {
          ganttStyle: {
            cell: {
              format: stringFormat,
              fontBrush: new PdfColor(255, 0, 0),
            },
          },
        };
        ganttObj.pdfExport(exportProeprties);
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('indicator issue', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttDataIndicator,
                enableCriticalPath: true,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'TaskName',
                    taskLabel: '${Progress}%',
                },
                toolbarClick: (args: any) => {
                    if (args.item.id === 'ganttContainer_pdfexport') {

                        let exportProperties: PdfExportProperties = {
                            fitToWidthSettings:{
                                isFitToWidth: true
                            }
                        };
                        ganttObj.pdfExport(exportProperties);
                    }
                },

                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },

            }, done);
    });
    it('Updated Properly', () => {
        let exportProperties: PdfExportProperties = {
            ganttStyle: {
                connectorLineColor: new PdfColor(255, 255, 102),
                chartGridLineColor: new PdfColor(250, 0, 0)
            },
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('indicator issue', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttDataIndicator,
                enableCriticalPath: true,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                ],
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'TaskName',
                    taskLabel: '${Progress}%',
                },
                toolbarClick: (args: any) => {
                    if (args.item.id === 'ganttContainer_pdfexport') {

                        let exportProperties: PdfExportProperties = {
                            fitToWidthSettings:{
                                isFitToWidth: true
                            }
                        };
                        ganttObj.pdfExport(exportProperties);
                    }
                },

                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },

            }, done);
    });
    it(' Updated Properly', () => {
        let exportProperties: PdfExportProperties = {
           pageOrientation: 'Portrait'
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('fontFamily for the header and footer not change in the PDF export', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData4,
                dateFormat: 'MMM dd, y',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    resourceInfo: 'resources',
                    milestone: 'isMilestone'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', width: 250 },
                ],
                allowExcelExport: true,
                allowPdfExport: true,
                toolbar: ['ExcelExport', 'CsvExport', 'PdfExport'],
                toolbarClick: function (args) {
                 if (args.item.id === 'ganttContainer_pdfexport') {
                        let exportProperties: PdfExportProperties = {
                            ganttStyle: {
                                fontFamily: PdfFontFamily.ZapfDingbats,
                            },
                            header: {
                                fromTop: 0,
                                height: 130,
                                contents: [
                                    {
                                        type: 'Text',
                                        value: 'INVOICE',
                                        position: { x: 380, y: 0 },
                                        style: { textBrushColor: '#C25050', fontSize: 25 },
                                    },

                                ]
                            }
                        };
                        ganttObj.pdfExport(exportProperties);
                    }
                },
                allowSelection: true,
                gridLines: 'Both',
                height: '450px',
                treeColumnIndex: 1,
                splitterSettings: {
                    columnIndex: 2,
                },
                projectStartDate: new Date('03/25/2024'),
                projectEndDate: new Date('07/28/2024')
            }, done);
    });
    it('fontFamily for the header and footer not change in the PDF export', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('pdf label issue', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttDatapdf,
                height: '450px',
                taskFields: {
                  id: 'TaskID',
                  name: 'TaskName',
                  startDate: 'StartDate',
                  duration: 'Duration',
                  progress: 'Progress',
                  dependency: 'Predecessor',
                  child: 'subtasks',
                },
                columns: [
                  { field: 'TaskID' },
                  { field: 'TaskName' },
                  { field: 'StartDate' },
                  { field: 'Duration' },
                  { field: 'Progress' },
                ],
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'TaskName',
                    taskLabel: '${Progress}%',
                  },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                toolbarClick: (args: any) => {
                  if (args.item.id === 'ganttContainer_pdfexport') {
                    const stringFormat = new PdfStringFormat();
                    stringFormat.alignment = PdfTextAlignment.Right;
                    let exportProperties: PdfExportProperties = {
                      ganttStyle: {
                        // fontFamily: 1,
                        label: {
                          fontBrush: new PdfColor(179, 219, 255),
                          format: stringFormat,
                        },
                      },
                    };
                    ganttObj.pdfExport(exportProperties);
                  }
                }
            }, done);
    });
    it('Export data  Font Brush Styling Issues in cell text', () => {
        const stringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.Right;
        let exportProeprties: PdfExportProperties = {
            ganttStyle:{
                label:{
                    format: stringFormat,
                    fontBrush: new PdfColor(255, 0, 0),
                    backgroundColor: new PdfColor(179, 219, 255),
                    fontColor: new PdfColor(255, 0, 0),
                    borderColor: new PdfColor(255, 0, 0)
                }
               },
        };
        ganttObj.pdfExport(exportProeprties);
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
}); 
describe('pdfexport with eventmarker and holiday', () => {
    let ganttObj: Gantt;
    const data: Object =  [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
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
                    to: "04/04/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                
                }],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                allowPdfExport: true,
                toolbar: ['PdfExport']
            }, done);
    });
    it('pdfexport with eventmarker and holiday', () => {
        const stringFormat = new PdfStringFormat();
        stringFormat.alignment = PdfTextAlignment.Right;
        const vertical = new PdfStringFormat();
        vertical.lineAlignment = PdfVerticalAlignment.Top;
        vertical.alignment = PdfTextAlignment.Right;
        const penColor = new PdfColor(33,82,125); // Black color
        const penWidth = 1; 
        // 1px width
        const pen = new PdfPen(penColor, penWidth); // Create PdfPen instance
        pen.dashStyle = PdfDashStyle.DashDotDot; // Solid border style
        const borderWidth = 1;
        const borderColor = new PdfColor(0,0,0);
        let pdfpen : PdfPen= new PdfPen(borderColor, borderWidth);
        let pdfborders: PdfBorders = new PdfBorders();
        pdfborders.all = pdfpen
        let exportProperties: PdfExportProperties = {
            theme:"Bootstrap 4",
            ganttStyle: {   
                eventMarker:{ 
                    label:{
                        fontFamily: PdfFontFamily.TimesRoman,
                        fontColor: new PdfColor(97, 97, 97),
                        fontSize: 9,
                        format : stringFormat,
                        fontStyle : PdfFontStyle.Bold,
                        borderColor : new PdfColor(33, 82, 125),
                        borders: pdfborders,
                        padding:new PdfPaddings(2, 2, 2, 2),
                        fontBrush: new PdfColor(97, 97, 97),
                    },
                    lineStyle: pen,
                    
                },
                holiday:{
                    fontFamily: PdfFontFamily.TimesRoman,
                    fontSize: 10,
                    fontStyle : PdfFontStyle.Bold,
                    borderColor : new PdfColor(97, 97, 97),
                    backgroundColor: new PdfColor(0,0,0),
                    fontColor: new PdfColor(97, 97, 97),
                    padding:new PdfPaddings(2, 2, 2, 2),
                    format : vertical,
                    borders: pdfborders
                }
                
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
describe('pdfexport testcase for code coverage', () => {
    let ganttObj: Gantt;
    const data: Object =  [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
          
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('03/09/2017'),
            'Progress': '40',
            'Predecessor': "1" ,
            'isManual': true,
        },
       
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
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
                toolbar: ['PdfExport'],
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
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('pdfexport testcase for code coverage', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('pdfexport testcase for code coverage', () => {
    let ganttObj: Gantt;
    const data: Object =  [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Predecessor': "5" ,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('03/09/2017'),
            'Progress': '40',
            'isManual': true,
        },
       
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
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
                toolbar: ['PdfExport'],
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
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('pdfexport testcase for code coverage', () => {
        ganttObj.pdfExport();
       });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('pdfexport testcase for code coverage', () => {
    let ganttObj: Gantt;
    const data: Object =  [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Predecessor': "5" ,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('03/09/2017'),
            'Progress': '40',
            'isManual': true,
        },
       
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
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
                taskMode: "Manual",
                toolbar: ['PdfExport'],
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
                  labelSettings: {
                            rightLabel: 'TaskName',
                           taskLabel: 'TaskName',
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
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('pdfexport testcase for code coverage', () => {
        ganttObj.pdfExport();
    });
    it('pdfexport testcase for code coverage autofit', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
            },
        };
        ganttObj.pdfExport(exportProperties);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with baseline', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                        ]
                    }],
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    dependency: 'Predecessor'
                },
                renderBaseline: true,
                baselineColor: 'red',
                toolbar: ['PdfExport'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
                taskbarHeight: 20,
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    {
                        field: 'TaskName',
                        headerText: 'Task Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate', headerText: 'Start Date', format: 'dd-MMM-yy' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Predecessor', headerText: 'Predecessor' },
                ],
                treeColumnIndex: 0,
                height: '450px',
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with baseline', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
            },
        };
        ganttObj.pdfExport(exportProperties);
    });
});
describe('Gantt PDF Export indicator', () => {

    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: GanttData1,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                allowPdfExport: true,
                toolbar: ['PdfExport'],
                toolbarClick: (args?: any) => {
                    if (args.item.id === 'ganttContainer_pdfexport') {
                        ganttObj.pdfExport();
                    }
                }
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Export data with indicator', () => {
        let exportProperties: PdfExportProperties = {
            fitToWidthSettings: {
                isFitToWidth: true,
            },
        };
        ganttObj.pdfExport(exportProperties);
    });
});
describe('Gantt PDF Export by setting showWeekend as false with workWeek', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: pdfWorkWeekData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                workWeek: ['Monday', 'Tuesday', 'Thursday','Friday'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel',  'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showWeekend:false,
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
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Gantt PDF Export by setting showWeekend as false with workWeek', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export by setting showWeekend as false with workWeek', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: pdfWorkWeekData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                workWeek: ['Monday', 'Tuesday', 'Thursday','Friday'],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel',  'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showWeekend:false,
                    showTooltip: true,
                    topTier: {
                        unit: 'Day',
                    },
                    bottomTier: {
                        unit: 'Hour',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Gantt PDF Export by setting showWeekend as false with workWeek', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with taskbar template fontbrush', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontBrush: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',

                        }
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontBrush: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                            fontSize : 12
                        }
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20,
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontBrush: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            }
                    }
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with tasklabel template for font color', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    args.labelSettings.leftLabel.value = args.data.ganttProperties.taskName + '[' + args.data.ganttProperties.progress + ']';
                    args.labelSettings.leftLabel.fontStyle.fontSize = 6;
                    args.labelSettings.leftLabel.fontStyle.fontColor = new PdfColor(255, 255, 255);
                    if (args.data.ganttProperties.resourceNames) {
                        args.labelSettings.rightLabel.value = args.data.ganttProperties.resourceNames;
                        args.labelSettings.rightLabel.fontStyle.fontSize = 6;
                        args.labelSettings.rightLabel.fontStyle.fontColor = new PdfColor(255, 255, 255);
                        args.labelSettings.rightLabel.image = [{
                            base64: (args as any).data.taskData.resourcesImage, width: 20, height: 20
                        }]

                    }
                    args.labelSettings.taskLabel.value = args.data.ganttProperties.progress + '%';
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with taskbar template fontbrush', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    if (!args.data.hasChildRecords) {
                        args.taskbar.taskColor = new PdfColor(109, 97, 155);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontBrush: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',

                        }
                    }
                    if (args.data.hasChildRecords) {
                        args.taskbar.milestoneColor = new PdfColor(0, 2, 0);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName;
                        args.taskbarTemplate.fontStyle = {
                            fontBrush: new PdfColor(255, 255, 255),
                            fontFamily: 'TimesRoman',
                            fontSize : 12
                        }
                    }
                    if (args.data.ganttProperties.duration === 0) {
                        args.taskbar.taskColor = new PdfColor(0, 2, 92);
                        if (args.data.ganttProperties.resourceNames) {
                            args.taskbarTemplate.image = [{
                                width: 20, base64: (args as any).data.taskData.resourcesImage, height: 20,
                            }]
                        }
                        args.taskbarTemplate.value = args.data.TaskName,
                            args.taskbarTemplate.fontStyle = {
                                fontBrush: new PdfColor(255, 255, 255),
                                fontFamily: 'TimesRoman'
                            }
                    }
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt PDF Export with tasklabel template for font color', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
                resources: resourceCollectiontemplate1,
                allowPdfExport: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    resourceInfo: 'resources',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                pdfQueryTaskbarInfo: (args: any) => {
                    args.labelSettings.leftLabel.value = args.data.ganttProperties.taskName + '[' + args.data.ganttProperties.progress + ']';
                    args.labelSettings.leftLabel.fontStyle.fontSize = 6;
                    args.labelSettings.leftLabel.fontStyle.fontColor = new PdfColor(255, 255, 255);
                    if (args.data.ganttProperties.resourceNames) {
                        args.labelSettings.rightLabel.value = args.data.ganttProperties.resourceNames;
                        args.labelSettings.rightLabel.fontStyle.fontSize = 6;
                        args.labelSettings.rightLabel.fontStyle.fontColor = new PdfColor(255, 255, 255);
                        args.labelSettings.rightLabel.image = [{
                            base64: (args as any).data.taskData.resourcesImage, width: 20, height: 20
                        }]

                    }
                    args.labelSettings.taskLabel.value = args.data.ganttProperties.progress + '%';
                    args.labelSettings.taskLabel.fontStyle.fontColor = new PdfColor(255, 255, 255);
                    args.labelSettings.taskLabel.fontStyle.fontFamily = PdfFontFamily.TimesRoman,
                    args.labelSettings.taskLabel.fontStyle.fontSize = 12,
                    args.labelSettings.taskLabel.fontStyle.fontStyle = PdfFontStyle.Italic
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName', headerTemplate: '#projectName', width: 250 },
                    { field: 'StartDate', headerTemplate: '#dateTemplate' }
                ],
                pdfExportComplete: (args: any) => {
                    expect(args.name).toBe("pdfExportComplete");
                },
                height: '450px',
            }, done);
    });
    it('Export data with tasklabel template', () => {
        ganttObj.pdfExport();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
})
