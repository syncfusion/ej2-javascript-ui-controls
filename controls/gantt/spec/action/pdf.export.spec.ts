/**
 * Gantt toolbar spec
 */
import { Gantt, Edit, Toolbar, Selection, Filter, PdfExport } from '../../src/index';
import { exportData, image,adventProFont } from '../base/data-source.spec';
import { PdfExportProperties } from '../../src/gantt/base/interface';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
import { PdfDocument, PdfColor, PdfStandardFont, PdfFontFamily, PdfFontStyle } from '@syncfusion/ej2-pdf-export';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfTrueTypeFont } from '@syncfusion/ej2-pdf-export';

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
describe('Gantt PDF Export with eventmarker', () => {
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
                font:  new PdfTrueTypeFont(adventProFont, 12)
            }}
        ganttObj.pdfExport(pdfExportProperties);
    });
}); 
describe('Gantt PDF Export with eventmarker without label', () => {
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
describe('Gantt PDF Export with customization of header and footer', () => {
    Gantt.Inject(Toolbar, PdfExport);
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
    it("Export data with header and footer", (done: Function) => {
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
                        pageNumberType: 'Arabic',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        size: { height: 50, width: 100 },
                        style: { textBrushColor: '#000000', hAlign: 'Center', vAlign: 'Bottom' }
                    },
                    {
                        type: 'PageNumber',
                        position: { x: 250, y: 10 },
                        style: { textBrushColor: '#C67878', fontSize: 14 }
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
        ganttObj.pdfExport(exportProperties, true).then((pdfDoc: PdfDocument) => {
            done();
        });
    });
});    
describe('Gantt PDF Export with holiday label', () => {
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
describe('Gantt PDF Export with Long text to taskname', () => {
    Gantt.Inject(Toolbar, PdfExport);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:  [
                    {
                        TaskID: 1,
                        TaskName:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
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
    it('Export data with long text', () => {
        ganttObj.pdfExport();
    });
}); 