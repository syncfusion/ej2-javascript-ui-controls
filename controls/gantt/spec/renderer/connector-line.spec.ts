/**
 * Gantt connector line spec
 */
import { Gantt, Edit } from '../../src/index';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
describe('Gantt connector line support', () => {
    describe('Gantt connector line rendering', () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;
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
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(297);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(132);
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
                expect(ganttObj.flatData[4].ganttProperties.left).toBe(396);
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
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(99);
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
                expect(ganttObj.flatData[6].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[8].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[10].ganttProperties.left).toBe(264);
                done();
            }
            ganttObj.refresh();
        });
        it('predecessor-SS-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineSSDatasource);
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
        it('predecessor-FF-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineFFDatasource);
            ganttObj.connectorLineWidth = 8;
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
        it('predecessor-SF-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineSFDatasource);
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[1].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(165);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(66);
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
        it('Remove Predecessor', () => {
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
            ganttObj.removePredecessor(ganttObj.flatData[2]);
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('');
        });
        it('Add Predecessor', () => {
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('');
            ganttObj.addPredecessor(ganttObj.flatData[2], '2FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with same taskID', () => {
            ganttObj.updatePredecessor(ganttObj.flatData[2], '2FS,2');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with invalid taskID', () => {
            ganttObj.updatePredecessor(ganttObj.flatData[2], '24FS,2');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with valid TaskID and invalid connector type', () => {
            ganttObj.updatePredecessor(ganttObj.flatData[2], '4KS,2');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('4FS,2FS');
        });
        it('Update Predecessor with cyclic dependency', () => {
            ganttObj.updatePredecessor(ganttObj.flatData[2], '3FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('4FS,2FS');
        });
        it('Update Predecessor with current parent', () => {
            ganttObj.updatePredecessor(ganttObj.flatData[2], '1FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('4FS,2FS');
        });
        it('Update Predecessor with independent parent', () => {
            ganttObj.updatePredecessor(ganttObj.flatData[2], '6FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('4FS,2FS');
        });
        it('Update Predecessor with some valid and invalid predecessor strings', () => {
            ganttObj.updatePredecessor(ganttObj.flatData[8], '2FS,5FS,4FS,3FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('4FS,2FS');
        });
    });
});
