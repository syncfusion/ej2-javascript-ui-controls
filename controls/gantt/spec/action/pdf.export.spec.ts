/**
 * Gantt toolbar spec
 */
import { Gantt, Edit, Toolbar, Selection, Filter, PdfExport } from '../../src/index';
import { exportData } from '../base/data-source.spec';
import { PdfExportProperties } from '../../src/gantt/base/interface';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
import { PdfDocument, PdfColor, PdfStandardFont, PdfFontFamily, PdfFontStyle } from '@syncfusion/ej2-pdf-export';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
describe('Gantt pdfexport support', () => {
    let exportComplete: () => void = () => true;
    describe('Gantt toolbar action', () => {
        Gantt.Inject(Toolbar, Selection, PdfExport);
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
        // it("Export cancel Check", (done: Function) => {
        //     ganttObj.pdfExport().then((doc) => {
        //         expect(doc).toBeUndefined();
        //         done();
        //     });
        // });
        // it('gantt exporting(Check with multiple exporting)', (done) => {
        //     spyOn(ganttObj, 'pdfExportComplete');
        //     let props: PdfExportProperties = {};
        //     props.theme = 'Bootstrap 4';
        //     ganttObj.pdfExport(props, true).then((pdfDoc: PdfDocument) => {
        //         expect(ganttObj.pdfExportComplete).toHaveBeenCalled();
        //         expect(pdfDoc instanceof PdfDocument).toBeTruthy();
        //         done();
        //     });     
        // });

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
            Gantt.Inject(Toolbar, PdfExport);
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
    Gantt.Inject(Toolbar, PdfExport);
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
    Gantt.Inject(Toolbar, PdfExport);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:  [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                            Indicators: [
                                {
                                    'date': '04/10/2019',
                                    'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                    'name': 'Indicator title',
                                    'tooltip': 'tooltip'
                                }
                            ] 
                        },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
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