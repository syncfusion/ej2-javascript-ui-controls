/**
 * Gantt toolbar spec
 */
import { Gantt, Edit, Toolbar, Selection, Filter, PdfExport } from '../../src/index';
import { exportData } from '../base/data-source.spec';
import { PdfExportProperties } from '../../src/gantt/base/interface';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
import { PdfDocument, PdfColor, PdfStandardFont, PdfFontFamily, PdfFontStyle } from '@syncfusion/ej2-pdf-export';
import { getValue } from '@syncfusion/ej2-base';
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
                        args.style = {backgroundColor: '#99ffcc'};
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
                            { field: 'StartDate', headerText: 'Start Date', format:'dd-MMM-yy' },
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
