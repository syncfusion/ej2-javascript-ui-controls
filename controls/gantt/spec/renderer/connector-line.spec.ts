/**
 * Gantt connector line spec
 */
import { Gantt, Edit } from '../../src/index';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('Gantt connector line support', () => {
         let connectorLineFSDatasource: Object[] = [
            {
                'TaskId': 1, 'TaskName': 'FS',
                'StartDate': new Date('10/23/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 2, 'TaskName': 'FS',
                'StartDate': new Date('10/18/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 3, 'TaskName': 'FS',
                'StartDate': new Date('10/26/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 4, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7'
            },
            {
                'TaskId': 5, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7+3'
            },
            {
                'TaskId': 6, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7-3'
            },
            {
                'TaskId': 7, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1,2,3-3,8,9,10-3'
            },
            {
                'TaskId': 8, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/23/2017'), 'Progress': 65
            },
            {
                'TaskId': 9, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/18/2017'), 'Progress': 65
            },
            {
                'TaskId': 10, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/26/2017'), 'Progress': 65
            },
            {
                'TaskId': 11, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7'
            },
            {
                'TaskId': 12, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7+3'
            },
            {
                'TaskId': 13, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7-3'
            },
            {
                'TaskId': 14, 'TaskName': 'FS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '23,16'
            }
        ];
    describe('Gantt connector line rendering', () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;

        let connectorLineSSDatasource: Object[] = [
            {
                'TaskId': 1, 'TaskName': 'SS',
                'StartDate': new Date('10/23/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 2, 'TaskName': 'SS',
                'StartDate': new Date('10/18/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 3, 'TaskName': 'SS',
                'StartDate': new Date('10/26/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 4, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS'
            },
            {
                'TaskId': 5, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS+3'
            },
            {
                'TaskId': 6, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS-3'
            },
            {
                'TaskId': 7, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1SS,2SS,3SS-3,8SS,9SS,10SS-3'
            },
            {
                'TaskId': 8, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/23/2017'), 'Progress': 65
            },
            {
                'TaskId': 9, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/18/2017'), 'Progress': 65
            },
            {
                'TaskId': 10, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/26/2017'), 'Progress': 65
            },
            {
                'TaskId': 11, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS'
            },
            {
                'TaskId': 12, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS+3'
            },
            {
                'TaskId': 13, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SS-3'
            },
            {
                'TaskId': 14, 'TaskName': 'SS', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '14'
            }
        ];
        let connectorLineFFDatasource: Object[] = [
            {
                'TaskId': 1, 'TaskName': 'FF',
                'StartDate': new Date('10/23/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 2, 'TaskName': 'FF',
                'StartDate': new Date('10/18/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 3, 'TaskName': 'FF',
                'StartDate': new Date('10/26/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 4, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF'
            },
            {
                'TaskId': 5, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF+3'
            },
            {
                'TaskId': 6, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF-3'
            },
            {
                'TaskId': 7, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1FF,2FF,3FF-3,8FF,9FF,10FF-3'
            },
            {
                'TaskId': 8, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/23/2017'), 'Progress': 65
            },
            {
                'TaskId': 9, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/18/2017'), 'Progress': 65
            },
            {
                'TaskId': 10, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/26/2017'), 'Progress': 65
            },
            {
                'TaskId': 11, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF'
            },
            {
                'TaskId': 12, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF+3'
            },
            {
                'TaskId': 13, 'TaskName': 'FF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7FF-3'
            },
            {
                'TaskId': 14, 'TaskName': 'FF', 'Predecessor': '7FF'
            }
        ];
        let connectorLineSFDatasource: Object[] = [
            {
                'TaskId': 1, 'TaskName': 'SF',
                'StartDate': new Date('10/23/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 2, 'TaskName': 'SF',
                'StartDate': new Date('10/18/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 3, 'TaskName': 'SF',
                'StartDate': new Date('10/26/2017'), 'Duration': 1, 'Progress': 80
            },
            {
                'TaskId': 4, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF'
            },
            {
                'TaskId': 5, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF+3'
            },
            {
                'TaskId': 6, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF-3'
            },
            {
                'TaskId': 7, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1SF,2SF,3SF-3,8SF,9SF,10SF-3'
            },
            {
                'TaskId': 8, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/23/2017'), 'Progress': 65
            },
            {
                'TaskId': 9, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/18/2017'), 'Progress': 65
            },
            {
                'TaskId': 10, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/26/2017'), 'Progress': 65
            },
            {
                'TaskId': 11, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF'
            },
            {
                'TaskId': 12, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF+3'
            },
            {
                'TaskId': 13, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65, 'Predecessor': '7SF-3'
            },
            {
                'TaskId': 14, 'TaskName': 'SF', 'Duration': 1,
                'StartDate': new Date('10/25/2017'), 'Progress': 65
            }
        ];
        let predecessorData: Object[] = [
            {
                TaskId: 1,
                TaskName: "Planning",
                StartDate: new Date("10/06/2017"),
                EndDate: new Date("10/10/2017"),
                taskColor: "#79BDC9",
                progressColor: "#59AAB4",
                Children: [
                    {
                        TaskId: 2, TaskName: "Allocate resources 1",
                        EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
                    },
                    {
                        TaskId: 3, TaskName: "Allocate resources 2", Predecessor: '2FS',
                        EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
                    },
                    {
                        TaskId: 4, TaskName: "Allocate resources 3", Predecessor: '2FS,9FS',
                        EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
                    },
                    {
                        TaskId: 5, TaskName: "Allocate resources 4", Predecessor: '2FS',
                        EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
                    }
                ]
            }, {
                TaskId: 6,
                TaskName: "Planning",
                StartDate: new Date("02/06/2017"),
                EndDate: new Date("02/10/2017"),
                taskColor: "#79BDC9",
                progressColor: "#59AAB4",
                Children: [
                    {
                        TaskId: 7, TaskName: "Allocate resources 1",
                        EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
                    },
                    {
                        TaskId: 8, TaskName: "Allocate resources 2", Predecessor: '4FS',
                        EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
                    },
                    {
                        TaskId: 9, TaskName: "Allocate resources 3", Predecessor: '2FS',
                        EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
                    },
                    {
                        TaskId: 10, TaskName: "Allocate resources 4",
                        EndDate: new Date("10/10/2017"), Duration: 6, Progress: "75", resourceId: [6]
                    }
                ]
            }];
        let changeDuration: Function = (data: Object[]) => {
            for (let i: number = 0; i < data.length; i++) {
                data[i]['Duration'] = 0;
            }
            return data;
        };
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: connectorLineFSDatasource,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'Children'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                editSettings: {
                    allowTaskbarEditing: true,
                    allowEditing: true
                }
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('predecessor-SS', (done: Function) => {
            ganttObj.dataSource = connectorLineSSDatasource;
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[1].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[7].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[9].ganttProperties.left).toBe(363);
                done();
            }
            ganttObj.refresh();
        });
        it('predecessor-FF', (done: Function) => {
            ganttObj.dataSource = connectorLineFFDatasource;
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[2].ganttProperties.left).toBe(363);
                expect(ganttObj.flatData[4].ganttProperties.left).toBe(363);
                expect(ganttObj.flatData[6].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[8].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[10].ganttProperties.left).toBe(264);
                done();
            }
            ganttObj.refresh();
        });
        it('predecessor-SF', (done: Function) => {
            ganttObj.dataSource = connectorLineSFDatasource;
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[1].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(132);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(33);
                expect(ganttObj.flatData[7].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[9].ganttProperties.left).toBe(363);
                done();
            }
            ganttObj.refresh();
        });
        it('predecessor-FS-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineFSDatasource);
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[2].ganttProperties.left).toBe(363);
                expect(ganttObj.flatData[4].ganttProperties.left).toBe(396);
                expect(ganttObj.flatData[6].ganttProperties.left).toBe(297);
                expect(ganttObj.flatData[8].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[10].ganttProperties.left).toBe(297);
                done();
            }
            ganttObj.refresh();
        });
        it('predecessor-SS-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineSSDatasource);
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[1].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(297);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(132);
                expect(ganttObj.flatData[7].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[9].ganttProperties.left).toBe(363);
                done();
            }
            ganttObj.refresh();
        });
        it('predecessor-FF-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineFFDatasource);
            ganttObj.connectorLineWidth = 8;
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[2].ganttProperties.left).toBe(363);
                expect(ganttObj.flatData[4].ganttProperties.left).toBe(396);
                expect(ganttObj.flatData[6].ganttProperties.left).toBe(297);
                expect(ganttObj.flatData[8].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[10].ganttProperties.left).toBe(297);
                done();
            }
            ganttObj.refresh();
        });
        it('predecessor-SF-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineSFDatasource);
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[1].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(297);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(132);
                expect(ganttObj.flatData[7].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[9].ganttProperties.left).toBe(363);
                done();
            }
            ganttObj.refresh();
        });
        it('New predecessor sample loaded', (done: Function) => {
            ganttObj.dataSource = predecessorData;
            ganttObj.dataBound = () => {
                done();
            }
            ganttObj.refresh();
        });
        it('Remove Predecessor with edit module false value', () => {
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
            ganttObj.editSettings.allowTaskbarEditing = false;
            ganttObj.dataBind();
            ganttObj.removePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId));
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Remove Predecessor', () => {
            ganttObj.editSettings.allowTaskbarEditing = true;
            ganttObj.dataBind();
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
            ganttObj.removePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId));
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('');
        });
        it('Add Predecessor', () => {
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('');
            ganttObj.addPredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '2FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Add Predecessor with edit module false value', () => {
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
            ganttObj.editSettings.allowTaskbarEditing = false;
            ganttObj.dataBind();
            ganttObj.addPredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '4FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with edit module false value', () => {
            ganttObj.editSettings.allowTaskbarEditing = false;
            ganttObj.dataBind();
            ganttObj.updatePredecessor(Number(ganttObj.flatData[4].ganttProperties.taskId), '3FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with same taskID', () => {
            ganttObj.editSettings.allowTaskbarEditing = true;
            ganttObj.dataBind();
            ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '2FS,2');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with invalid taskID', () => {
            ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '24FS,2');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with valid TaskID and invalid connector type', () => {
            ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '4KS,2');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('4FS,2FS');
        });
        it('Update Predecessor with cyclic dependency', () => {
            ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '3FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('4FS,2FS');
        });
        it('Aria-label testing - SS', (done: Function) => {
            ganttObj.dataSource = connectorLineSSDatasource;
            ganttObj.dataBound = () => {
              const connectorLine : HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent2child7').childNodes[0] as HTMLElement;
              const ariaLabel = connectorLine.getAttribute('aria-label');
              expect(ariaLabel && ariaLabel.indexOf('SS Start to SS Start') > -1).toBeTruthy();
              done();
            };
            ganttObj.refresh();
          });   
        it('Aria-label testing - FF', (done: Function) => {
            ganttObj.dataSource = connectorLineFFDatasource;
            ganttObj.dataBound = () => {
                const connectorLine : HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent9child7').childNodes[0] as HTMLElement;
                const ariaLabel = connectorLine.getAttribute('aria-label');
                expect(ariaLabel && ariaLabel.indexOf('FF Finish to FF Finish')> -1).toBeTruthy();
                done();
            }
            ganttObj.refresh();            
        });
        it('Aria-label testing - SF', (done: Function) => {
            ganttObj.dataSource = connectorLineSFDatasource;
            ganttObj.dataBound = () => {
                const connectorLine : HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent7child13').childNodes[0] as HTMLElement;
                const ariaLabel = connectorLine.getAttribute('aria-label');
                expect(ariaLabel && ariaLabel.indexOf('SF Start to SF Finish')> -1).toBeTruthy();
                done();
            }
            ganttObj.refresh();            
        });                
        it('Aria-label testing - FS', (done: Function) => {
            ganttObj.dataSource = connectorLineFSDatasource;
            ganttObj.dataBound = () => {
                const connectorLine : HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent7child6').childNodes[0] as HTMLElement;
                const ariaLabel = connectorLine.getAttribute('aria-label');
                expect(ariaLabel && ariaLabel.indexOf('FS Finish to FS Start')> -1).toBeTruthy();
                done();
            }
            ganttObj.refresh();            
        });
    });
      let projectNewData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
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
                        { TaskID: 8, TaskName: 'Customer strength', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
                { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
                { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
            ]
        }
    ];
    describe('Cancel connector line using actionBegin event', () => {
        let ganttObj_tree: Gantt;
        beforeAll((done: Function) => {
            ganttObj_tree = createGantt(
                {
                    dataSource: projectNewData,
                    taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks'
                },

                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
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
        it('cancel connector line using actionBegin event', () => {
            ganttObj_tree.actionBegin = (args) => {
                if(args.action == 'DrawConnectorLine') {
                    args.cancel = true;
                }
            }
            ganttObj_tree.updatePredecessor(Number(ganttObj_tree.flatData[2].ganttProperties.taskId), '2SS');
            expect(ganttObj_tree.flatData[2]['Predecessor']).toBe(null);
        });
        afterAll(() => {
            destroyGantt(ganttObj_tree);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
     describe('Cancel connector line using actionBegin event', () => {
         let ganttObj_tree: Gantt;
         beforeAll((done: Function) => {
             ganttObj_tree = createGantt(
                 {
                     dataSource: connectorLineFSDatasource,
                     taskFields: {
                         id: 'TaskId',
                         name: 'TaskName',
                         startDate: 'StartDate',
                         endDate: 'EndDate',
                         duration: 'Duration',
                         progress: 'Progress',
                         dependency: 'Predecessor',
                         child: 'Children'
                     },
                     projectStartDate: new Date('10/15/2017'),
                     projectEndDate: new Date('12/30/2017'),
                     editSettings: {
                         allowTaskbarEditing: true,
                         allowEditing: true
                     }
             }, done);
         });
         it('Update Predecessor with current parent', () => {
             ganttObj_tree.updatePredecessor(Number(ganttObj_tree.flatData[2].ganttProperties.taskId), '1FS');
             expect(ganttObj_tree.flatData[2].ganttProperties.predecessorsName).toBe('1FS');
         });
         it('Update Predecessor with independent parent', () => {
             ganttObj_tree.updatePredecessor(Number(ganttObj_tree.flatData[2].ganttProperties.taskId), '6FS');
             expect(ganttObj_tree.flatData[2].ganttProperties.predecessorsName).toBe('1FS');
         });
         it('Update Predecessor with some valid and invalid predecessor strings', () => {
             ganttObj_tree.updatePredecessor(Number(ganttObj_tree.flatData[8].ganttProperties.taskId), '2FS,5FS,4FS,3FS');
             expect(ganttObj_tree.flatData[2].ganttProperties.predecessorsName).toBe('1FS');
         });
         afterAll(() => {
             destroyGantt(ganttObj_tree);
         });
         beforeEach((done: Function) => {
             setTimeout(done, 2000);
         });
     });
     describe('offset not updating properly issue', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj= createGantt(
                {
                    dataSource: [],
                    taskFields: {
                        id: 'TaskId',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor'
                    },
                    toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                    allowSelection: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    allowUnscheduledTasks: true,
                    editSettings: {
                        allowTaskbarEditing: true,
                        allowEditing: true,
                        allowAdding:true
                    }
            }, done);
        });

        afterAll(() => {
            destroyGantt(ganttObj);
        });

        it('check offset value after adding dependency', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].offset).toBe(0);
                }
            };
            ganttObj.openAddDialog(); 
            let taskName: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
            taskName.value="New Task 2";
            taskName.dataBind();
            let duration: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            duration.value="2 days";
            duration.dataBind();
            ganttObj.dataBind();
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(save, 'click');
            ganttObj.openAddDialog();
            let taskName1: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
            taskName1.value="New Task 1";
            taskName1.dataBind();
            let duration1: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            duration1.value="3 days";
            duration1.dataBind();
            let save1: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(save1, 'click');
            ganttObj.openEditDialog(1);
            let duration2: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            duration2.value="3 days";
            duration2.dataBind();
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
            let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
            triggerMouseEvent(add, 'click');
            let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
            input.dataSource = input.dataSource.dataSource.json;
            input.value = "2-New Task 1";
            input.dataBind();
            ganttObj.dataBind();
            triggerMouseEvent(save, 'click');  
        });
     });
});
