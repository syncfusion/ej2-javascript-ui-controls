/**
 * Gantt data-source spec
 */
export let projectResources: Object[] = [
    { ResourceId: 1, ResourceName: 'Project Manager' },
    { ResourceId: 2, ResourceName: 'Software Analyst' },
    { ResourceId: 3, ResourceName: 'Developer' },
    { ResourceId: 4, ResourceName: 'Testing Engineer' }
];

export let selfReference: Object[] = [
    {
        'TaskID': 1, 'TaskName': 'Parent Task 1', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Progress': '40'
    },
    {
        'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Progress': '40', 'parentID': 1
    },
    {
        'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Progress': '40', 'parentID': 1
    },
    {
        'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', 'parentID': 1
    },
    {
        'TaskID': 5, 'TaskName': 'Parent Task 2', 'StartDate': new Date('03/14/2017'),
        'EndDate': new Date('03/18/2017'), 'Progress': '40'
    },
    {
        'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'), 'Progress': '40', 'parentID': 5
    },
    {
        'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'), 'Progress': '40', 'parentID': 5
    },
    {
        'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'), 'Progress': '40', 'parentID': 5
    },
    {
        'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'), 'Progress': '40', 'parentID': 5
    },
    {
        'TaskID': 10, 'TaskName': 'Parent Task 3', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40'
    },
    {
        'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    },
    {
        'TaskID': 12, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    },
    {
        'TaskID': 13, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    },
    {
        'TaskID': 14, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    },
    {
        'TaskID': 15, 'TaskName': 'Child Task 5', 'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'), 'Progress': '40', 'parentID': 10
    }

];

export let projectData: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/06/2017'),
        EndDate: new Date('03/13/2017'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/06/2017'),
                EndDate: new Date('02/10/2017'),
                subtasks: [
                    {
                        TaskID: 3, TaskName: 'Plan timeline', StartDate: null, EndDate: new Date('02/10/2017'),
                        Duration: 7200, DurationUnit: 'min', Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2017 05:00:00 AM'), EndDate: new Date('02/10/2017'),
                        Duration: 120, DurationUnit: 'hour', Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/06/2017'), EndDate: new Date('02/13/2017'),
                        Duration: 5, Progress: '100', ResourceId: [1], milestone: true
                    },
                    {
                        TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/10/2017'), EndDate: new Date('02/10/2017'),
                        Duration: 0, Predecessor: '3FS,4FS,5FS'
                    },
                    {
                        TaskID: 51,
                        TaskName: 'Temp Parent',
                        StartDate: new Date('02/10/2017'),
                        EndDate: new Date('02/12/2017'),
                        subtasks: [
                            {
                                TaskID: 52, TaskName: 'Temp child', StartDate: null, EndDate: new Date('02/10/2017'),
                                Duration: 3, DurationUnit: 'day', Progress: '100', ResourceId: [1]
                            }
                        ]
                    }
                ]
                
            },
            {
                TaskID: 7,
                TaskName: 'Design',
                StartDate: new Date('02/13/2017'),
                EndDate: new Date('02/17/2017'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/13/2017'),
                        EndDate: new Date('02/15/2017 18:00:00 PM'),
                        Duration: 3, Progress: '60', Predecessor: '6FS', ResourceId: [2]
                    },
                    {
                        TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/13/2017'), EndDate: new Date('02/15/2017'),
                        Duration: '3 days', Progress: '100', Predecessor: '6FS', ResourceId: [3]
                    },
                    {
                        TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/16/2017'), milestone: true,
                        EndDate: new Date('02/17/2017'), Duration: 2, Progress: '100', Predecessor: '9FS', ResourceId: [1]
                    },
                    {
                        TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/17/2017'),
                        EndDate: new Date('02/17/2017'), Duration: 0, Predecessor: '10FS'
                    }
                ]
            },
            {
                TaskID: 12,
                TaskName: 'Implementation Phase',
                StartDate: new Date('02/23/2017'),
                EndDate: new Date('03/03/2017'),
                Expand: false,
                subtasks: [
                    {
                        TaskID: 13,
                        TaskName: 'Phase 1',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/05/2017'),
                        subtasks: [{
                            TaskID: 14,
                            TaskName: 'Implementation Module 1',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/05/2017'),
                            subtasks: [
                                {
                                    TaskID: 15, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', Predecessor: '11FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 16, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', Predecessor: '11FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 17, TaskName: 'Testing', StartDate: new Date('02/23/2017'),
                                    EndDate: new Date('02/24/2017'), Duration: 2, Progress: '0', Predecessor: '15FS,16FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 18, TaskName: 'Bug fix', StartDate: new Date('02/27/2017'),
                                    EndDate: new Date('02/28/2017'), Duration: 2, Progress: '0', Predecessor: '17FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 19, TaskName: 'Customer review meeting', StartDate: new Date('03/01/2017'),
                                    EndDate: new Date('03/05/2017'), Duration: 2, Progress: '0', Predecessor: '18FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 20, TaskName: 'Phase 1 complete', StartDate: new Date('03/05/2017'),
                                    EndDate: new Date('03/05/2017'), Duration: 0, Predecessor: '19FS'
                                }

                            ]
                        }]
                    },

                    {
                        TaskID: 21,
                        TaskName: 'Phase 2',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/03/2017'),
                        subtasks: [{
                            TaskID: 22,
                            TaskName: 'Implementation Module 2',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/03/2017'),
                            subtasks: [
                                {
                                    TaskID: 23, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/23/2017'), Duration: 4, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 24, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/23/2017'), Duration: 4, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 25, TaskName: 'Testing', StartDate: new Date('02/24/2017'),
                                    EndDate: new Date('02/27/2017'), Duration: 2, Progress: '0', Predecessor: '23FS,24FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 26, TaskName: 'Bug fix', StartDate: new Date('02/28/2017'),
                                    EndDate: new Date('03/01/2017'), Duration: 2, Progress: '0', Predecessor: '25FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 27, TaskName: 'Customer review meeting', StartDate: new Date('03/05/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 2, Progress: '0', Predecessor: '26FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 28, TaskName: 'Phase 2 complete', StartDate: new Date('03/03/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 0, Predecessor: '27FS'
                                }

                            ]
                        }]
                    },

                    {
                        TaskID: 29,
                        TaskName: 'Phase 3',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/05/2017'),
                        subtasks: [{
                            TaskID: 30,
                            TaskName: 'Implementation Module 3',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/05/2017'),
                            subtasks: [
                                {
                                    TaskID: 31, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 32, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 33, TaskName: 'Testing', StartDate: new Date('02/23/2017'),
                                    EndDate: new Date('02/24/2017'), Duration: 2, Progress: '0', Predecessor: '31FS,32FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 34, TaskName: 'Bug fix', StartDate: new Date('02/27/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 2, Progress: '0', Predecessor: '33FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 35, TaskName: 'Customer review meeting', StartDate: new Date('03/01/2017'),
                                    EndDate: new Date('03/02/2017'), Duration: 2, Progress: '0', Predecessor: '34FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 36, TaskName: 'Phase 3 complete', StartDate: new Date('03/02/2017'),
                                    EndDate: new Date('03/02/2017'), Duration: 0, Predecessor: '35FS'
                                },

                            ]
                        }]
                    }
                ]
            },
            {
                TaskID: 37, TaskName: 'Integration', StartDate: new Date('03/06/2017'),
                EndDate: new Date('03/08/2017'), Duration: 3, Progress: '0', Predecessor: '20FS,28FS,36FS', ResourceId: [3]
            },
            {
                TaskID: 38, TaskName: 'Final Testing', StartDate: new Date('03/09/2017'),
                EndDate: new Date('03/10/2017'), Duration: 2, Progress: '0', Predecessor: '37FS', ResourceId: [4]
            },
            {
                TaskID: 39, TaskName: 'Final Delivery', StartDate: new Date('03/10/2017'),
                EndDate: new Date('03/10/2017'), Duration: 0, Predecessor: '38FS'
            }
        ]
    }
];

export let projectData1: Object[] = [
    {
        TaskID: 1,
        TaskName: 'Project Schedule',
        StartDate: new Date('02/06/2017'),
        EndDate: new Date('03/13/2017'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Planning',
                StartDate: new Date('02/06/2017'),
                EndDate: new Date('02/10/2017'),
                subtasks: [
                    {
                        TaskID: 3, TaskName: 'Plan timeline', StartDate: null, EndDate: new Date('02/10/2017'),
                        Duration: 7200, DurationUnit: 'min', Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2017 05:00:00 AM'), EndDate: new Date('02/10/2017'),
                        Duration: 120, DurationUnit: 'hour', Progress: '100', ResourceId: [1]
                    },
                    {
                        TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/06/2017'), EndDate: new Date('02/13/2017'),
                        Duration: 5, Progress: '100', ResourceId: [1], milestone: true
                    },
                    {
                        TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/10/2017'), EndDate: new Date('02/10/2017'),
                        Duration: 0, Predecessor: '3FS,4FS,5FS'
                    },
                    {
                        TaskID: 51,
                        TaskName: 'Temp Parent',
                        StartDate: new Date('02/10/2017'),
                        EndDate: new Date('02/12/2017'),
                        subtasks: [
                            {
                                TaskID: 52, TaskName: 'Temp child', StartDate: null, EndDate: new Date('02/10/2017'),
                                Duration: 3, DurationUnit: 'day', Progress: '100', ResourceId: [1]
                            }
                        ]
                    }
                ]
                
            },
            {
                TaskID: 7,
                TaskName: 'Design',
                StartDate: new Date('02/13/2017'),
                EndDate: new Date('02/17/2017'),
                subtasks: [
                    {
                        TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/13/2017'),
                        EndDate: new Date('02/15/2017 18:00:00 PM'),
                        Duration: 3, Progress: '60', Predecessor: '6FS', ResourceId: [2]
                    },
                    {
                        TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/13/2017'), EndDate: new Date('02/15/2017'),
                        Duration: '3 days', Progress: '100', Predecessor: '6FS', ResourceId: [3]
                    },
                    {
                        TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/16/2017'), milestone: true,
                        EndDate: new Date('02/17/2017'), Duration: 2, Progress: '100', Predecessor: '9FS', ResourceId: [1]
                    },
                    {
                        TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/17/2017'),
                        EndDate: new Date('02/17/2017'), Duration: 0, Predecessor: '10FS'
                    }
                ]
            },
            {
                TaskID: 12,
                TaskName: 'Implementation Phase',
                StartDate: new Date('02/23/2017'),
                EndDate: new Date('03/03/2017'),
                Expand: false,
                subtasks: [
                    {
                        TaskID: 13,
                        TaskName: 'Phase 1',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/05/2017'),
                        subtasks: [{
                            TaskID: 14,
                            TaskName: 'Implementation Module 1',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/05/2017'),
                            subtasks: [
                                {
                                    TaskID: 15, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', Predecessor: '11FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 16, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', Predecessor: '11FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 17, TaskName: 'Testing', StartDate: new Date('02/23/2017'),
                                    EndDate: new Date('02/24/2017'), Duration: 2, Progress: '0', Predecessor: '15FS,16FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 18, TaskName: 'Bug fix', StartDate: new Date('02/27/2017'),
                                    EndDate: new Date('02/28/2017'), Duration: 2, Progress: '0', Predecessor: '17FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 19, TaskName: 'Customer review meeting', StartDate: new Date('03/01/2017'),
                                    EndDate: new Date('03/05/2017'), Duration: 2, Progress: '0', Predecessor: '18FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 20, TaskName: 'Phase 1 complete', StartDate: new Date('03/05/2017'),
                                    EndDate: new Date('03/05/2017'), Duration: 0, Predecessor: '19FS'
                                }

                            ]
                        }]
                    },

                    {
                        TaskID: 21,
                        TaskName: 'Phase 2',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/03/2017'),
                        subtasks: [{
                            TaskID: 22,
                            TaskName: 'Implementation Module 2',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/03/2017'),
                            subtasks: [
                                {
                                    TaskID: 23, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/23/2017'), Duration: 4, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 24, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/23/2017'), Duration: 4, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 25, TaskName: 'Testing', StartDate: new Date('02/24/2017'),
                                    EndDate: new Date('02/27/2017'), Duration: 2, Progress: '0', Predecessor: '23FS,24FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 26, TaskName: 'Bug fix', StartDate: new Date('02/28/2017'),
                                    EndDate: new Date('03/01/2017'), Duration: 2, Progress: '0', Predecessor: '25FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 27, TaskName: 'Customer review meeting', StartDate: new Date('03/05/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 2, Progress: '0', Predecessor: '26FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 28, TaskName: 'Phase 2 complete', StartDate: new Date('03/03/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 0, Predecessor: '27FS'
                                }

                            ]
                        }]
                    },

                    {
                        TaskID: 29,
                        TaskName: 'Phase 3',
                        StartDate: new Date('02/23/2017'),
                        EndDate: new Date('03/05/2017'),
                        subtasks: [{
                            TaskID: 30,
                            TaskName: 'Implementation Module 3',
                            StartDate: new Date('02/23/2017'),
                            EndDate: new Date('03/05/2017'),
                            subtasks: [
                                {
                                    TaskID: 31, TaskName: 'Development Task 1', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 32, TaskName: 'Development Task 2', StartDate: new Date('02/20/2017'),
                                    EndDate: new Date('02/22/2017'), Duration: 3, Progress: '50', ResourceId: [3]
                                },
                                {
                                    TaskID: 33, TaskName: 'Testing', StartDate: new Date('02/23/2017'),
                                    EndDate: new Date('02/24/2017'), Duration: 2, Progress: '0', Predecessor: '31FS,32FS', ResourceId: [4]
                                },
                                {
                                    TaskID: 34, TaskName: 'Bug fix', StartDate: new Date('02/27/2017'),
                                    EndDate: new Date('03/03/2017'), Duration: 2, Progress: '0', Predecessor: '33FS', ResourceId: [3]
                                },
                                {
                                    TaskID: 35, TaskName: 'Customer review meeting', StartDate: new Date('03/01/2017'),
                                    EndDate: new Date('03/02/2017'), Duration: 2, Progress: '0', Predecessor: '34FS', ResourceId: [1]
                                },
                                {
                                    TaskID: 36, TaskName: 'Phase 3 complete', StartDate: new Date('03/02/2017'),
                                    EndDate: new Date('03/02/2017'), Duration: 0, Predecessor: '35FS'
                                },

                            ]
                        }]
                    }
                ]
            },
            {
                TaskID: 37, TaskName: 'Integration', StartDate: new Date('03/06/2017'),
                EndDate: new Date('03/08/2017'), Duration: 3, Progress: '0', Predecessor: '20FS,28FS,36FS', ResourceId: [3]
            },
            {
                TaskID: 38, TaskName: 'Final Testing', StartDate: new Date('03/09/2017'),
                EndDate: new Date('03/10/2017'), Duration: 2, Progress: '0', Predecessor: '37FS', ResourceId: [4]
            },
            {
                TaskID: 39, TaskName: 'Final Delivery', StartDate: new Date('03/10/2017'),
                EndDate: new Date('03/10/2017'), Duration: 0, Predecessor: '38FS'
            }
        ]
    }
];

export let unscheduledData: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'EndDate': new Date('03/03/2017'),
        'Progress': '40',
        'BaselineStartDate': '02/27/2017',
        'BaselineEndDate': '03/06/2017',
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'),
                'Progress': '40', 'isManual': true, Duration: 4
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 1', 'EndDate': '03/03/2017', 'Progress': '40', Duration: 4,
                'BaselineStartDate': new Date('02/25/2017 10:00 AM'), 'BaselineEndDate': new Date('03/06/2017 04:00 PM'),
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'), 'EndDate': new Date('03/09/2017'),
                'Progress': '40', 'BaselineStartDate': new Date('02/25/2017'), 'BaselineEndDate': new Date('03/06/2017'),
            }
        ]
    },
    {
        'TaskID': 5,
        'TaskName': 'Parent Task 2',
        'StartDate': new Date('03/06/2017'),
        'EndDate': new Date('03/10/2017'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': '03/06/2017', 'EndDate': new Date('03/06/2017'),
                'Progress': '40', Duration: 0, 'BaselineStartDate': new Date('03/06/2017'), 'BaselineEndDate': new Date('03/10/2017'),
            },
            {
                'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': null, 'EndDate': new Date('03/10/2017'), 'Progress': '40', Duration: 4
            },
            {
                'TaskID': 8, 'TaskName': 'Child Task 3', 'StartDate': new Date('03/06/2017'), 'EndDate': null,
                'Progress': '40', 'BaselineStartDate': new Date('03/05/2017 05:00:00 AM'),
                'BaselineEndDate': new Date('03/16/2017 18:00:00 PM'),
            },
            {
                'TaskID': 9, 'TaskName': 'Child Task 4', 'StartDate': new Date('03/06/2017'), 'EndDate': new Date('03/10/2017'),
                'Progress': '40', 'isManual': true, Duration: 0
            }
        ]
    },
    {
        'TaskID': 10,
        'TaskName': 'Parent Task 3',
        'StartDate': new Date('03/13/2017'),
        'EndDate': new Date('03/17/2017'),
        'Progress': '40',
        'Children': [
            {
                'TaskID': 11, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/13/2017'), 'Progress': '40'
            },
            {
                'TaskID': 12, 'TaskName': 'Child Task 2', 'EndDate': '03/17/2017', 'Progress': '40'
            },
            {
                'TaskID': 13, 'TaskName': 'Child Task 3', 'Progress': '40', Duration: 4
            },
            {
                'TaskID': 14, 'TaskName': 'Child Task 4', 'Progress': '40', 'isManual': true, Duration: 0
            },
            {
                'TaskID': 15, 'TaskName': 'Child Task 5', 'Progress': '40',
            }
        ]
    }
];
export let unscheduledData2: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/27/2017'),
        'BaselineStartDate': '02/27/2017',
        'Progress': '40',
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/27/2017'), 'BaselineStartDate': '02/27/2017',
                'Progress': '40', 'isManual': true,
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 1', 'StartDate': '03/03/2017', 'Progress': '40', Duration: 4, 'BaselineStartDate': '02/25/2017',
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'), 'BaselineStartDate': '02/27/2017',
                'Progress': '40'
            }
        ]
    }
];
export let unscheduledData3: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'EndDate': new Date('02/27/2017'),
        'BaselineEndDate': '02/27/2017',
        'Progress': '40',
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 2', 'EndDate': new Date('02/27/2017'), 'BaselineEndDate': '02/27/2017',
                'Progress': '40', 'isManual': true,
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 1', 'EndDate': '03/03/2017', 'Progress': '40', 'BaselineEndDate': '03/03/2017',
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'EndDate': new Date('02/27/2017'), 'BaselineEndDate': '02/27/2017',
                'Progress': '40'
            }
        ]
    }
];
export let unscheduledData4: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'Progress': '40',
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 2', 'Progress': '40', 'isManual': true,
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 1', 'Progress': '40'
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'Progress': '40'
            }
        ]
    }
];


export let defaultGanttData: Object[] = [
    {
        'TaskID': 1,
        'TaskName': 'Parent Task 1',
        'StartDate': new Date('02/02/2018'),
        'EndDate': new Date('03/03/2018'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/04/2018'), 'EndDate': new Date('02/12/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/05/2018'), 'EndDate': new Date('02/13/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/06/2018'), 'EndDate': new Date('02/14/2018'),
                'Progress': '40', 'Duration': 8
            }
        ]
    },
    {
        'TaskID': 5,
        'TaskName': 'Parent Task 5',
        'StartDate': new Date('02/02/2018'),
        'EndDate': new Date('03/03/2018'),
        'Progress': '40',
        'isManual': true,
        'Children': [
            {
                'TaskID': 6, 'TaskName': 'Child Task 6', 'StartDate': new Date('03/04/2018'), 'EndDate': new Date('03/12/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 7, 'TaskName': 'Child Task 7', 'StartDate': new Date('03/05/2018'), 'EndDate': new Date('03/13/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 8, 'TaskName': 'Child Task 8', 'StartDate': new Date('03/06/2018'), 'EndDate': new Date('03/14/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 9, 'TaskName': 'Child Task 9', 'StartDate': new Date('03/05/2018'), 'EndDate': new Date('03/13/2018'),
                'Progress': '40', 'Duration': 8
            },
            {
                'TaskID': 10, 'TaskName': 'Child Task 10', 'StartDate': new Date('03/06/2018'), 'EndDate': new Date('03/14/2018'),
                'Progress': '40', 'Duration': 8
            }
        ]
    }];

export let baselineData: Object[] = [
    {
        'TaskId': 1,
        'TaskName': 'Task 1',
        'StartDate': new Date('10/23/2017'),
        'BaselineStartDate': new Date('10/23/2017'),
        'BaselineEndDate': new Date('10/28/2017'),
        'Duration': 10,
        'Progress': 70,
        'cusClass': 'cusclass',
        'Children': [
            {
                'resourceInfo': [1], 'TaskId': 2, 'TaskName': 'Child task 1', 'cusClass': 'cusclass',
                'StartDate': new Date('10/23/2017'), 'BaselineStartDate': new Date('10/23/2017'),
                'BaselineEndDate': new Date('10/26/2017'), 'Duration': 4, 'Progress': 80
            },
            {
                'resourceInfo': [2, 4], 'TaskId': 3, 'TaskName': 'Child task 2',
                'StartDate': new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
                'BaselineEndDate': new Date('10/24/2017'), 'Duration': 0, 'Progress': 65, 'Predecessor': '2'
            },
            {
                'TaskId': 4,
                'TaskName': 'Child task 3',
                'StartDate': new Date('10/25/2017'),
                'BaselineStartDate': new Date('10/26/2017'),
                'BaselineEndDate': new Date('10/28/2017'),
                'Duration': 6,
                'Progress': 77,
                'Expand': false,
                'Children': [
                    {
                        'resourceInfo': [3], 'TaskId': 5, 'TaskName': 'Grand child task 1',
                        'StartDate': new Date('10/28/2017'), 'BaselineStartDate': new Date('10/27/2017'),
                        'BaselineEndDate': new Date('11/1/2017'), 'Duration': 5, 'Progress': 60
                    },
                    {
                        'TaskId': 6, 'TaskName': 'Grand child task 2', 'Expand': false,
                        'StartDate': new Date('10/29/2017'), 'BaselineStartDate': new Date('10/29/2017'),
                        'BaselineEndDate': new Date('10/31/2017'), 'Duration': 6, 'Progress': 77, 'Predecessor': '5'
                    },
                    {
                        'resourceInfo': [], 'TaskId': 7, 'TaskName': 'Grand child task 3',
                        'StartDate': new Date('10/25/2017'), 'BaselineStartDate': new Date('10/25/2017'),
                        'BaselineEndDate': new Date('10/25/2017'), 'Duration': 0, 'Progress': 0, 'Predecessor': '6'
                    }, {
                        'TaskId': 4,
                        'TaskName': 'Child task 8',
                        'StartDate': new Date('10/25/2017'),
                        'BaselineStartDate': new Date('10/26/2017'),
                        'BaselineEndDate': new Date('10/28/2017'),
                        'Duration': 6,
                        'Progress': 77,
                        'Expand': true,
                        'Children': [
                            {
                                'resourceInfo': [3], 'TaskId': 9, 'TaskName': 'Grand child task 1',
                                'StartDate': new Date('10/28/2017'), 'BaselineStartDate': new Date('10/27/2017'),
                                'BaselineEndDate': new Date('11/1/2017'), 'Duration': 5, 'Progress': 60
                            }]
                    }
                ]
            }
        ]
    }
];

export let resourceData: Object[] = [
    { resourceId: 1, resourceName: 'Robert King' },
    { resourceId: 2, resourceName: 'Anne Dodsworth' },
    { resourceId: 3, resourceName: 'David William' },
    { resourceId: 4, resourceName: 'Nancy Davolio' },
    { resourceId: 5, resourceName: 'Janet Leverling' },
    { resourceId: 6, resourceName: 'Romey_Wilson' }
];

export let sampleData: Object[] = [
    {
        'resourceInfo': [1], 'TaskId': 1, 'TaskName': 'Start-Duration', 'cusClass': 'cusclass',
        'StartDate': new Date('10/23/2017'), 'BaselineStartDate': new Date('10/23/2017'),
        'BaselineEndDate': new Date('10/26/2017'), 'Duration': 4, 'Progress': 80, 'Notes': 'testing1',
        'Indicators': [
            {
                'date': '10/29/2017',
                'iconCls': 'fas fa-cat',
                'name': 'Custom String',
                'tooltip': 'Follow up'
            },
            {
                'date': '11/1/2017',
                'iconCls': 'fas fa-dragon',
                'name': '<span style="color:red">String Template</span>',
                'tooltip': 'Review results'
            }
        ]
    },
    {
        'resourceInfo': [2], 'TaskId': 2, 'TaskName': 'Start-End',
        'StartDate': new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), EndDate: new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1', 'Notes': 'testing2'
    },
    {
        'resourceInfo': [2], 'TaskId': 3, 'TaskName': 'Duration-End',
        'BaselineStartDate': new Date('10/24/2017'), Duration: '32h',
        'BaselineEndDate': new Date('10/28/2017'), EndDate: new Date('10/24/2017'), 'Progress': 65, 'Predecessor': '1SS','Notes': 'testing3'
    },
    {
        'resourceInfo': [2], 'TaskId': 4, 'TaskName': 'Duration-alone',
        'BaselineStartDate': new Date('10/24/2017'), Duration: '32h',
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, 'Notes': '4'
    },
    {
        'resourceInfo': [2], 'TaskId': 5, 'TaskName': 'StartDate-alone',
        StartDate: new Date('10/24/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, 'Predecessor': '2', 'Notes': 'testing5'
    },
    {
        'resourceInfo': [2], 'TaskId': 6, 'TaskName': 'EndDate-alone',
        EndDate: new Date('10/28/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, 'Notes': 'testing6'
    },
    {
        'resourceInfo': [2], 'TaskId': 7, 'TaskName': 'Milestone',
        EndDate: new Date('10/28/2017'), 'BaselineStartDate': new Date('10/24/2017'),
        'BaselineEndDate': new Date('10/28/2017'), 'Progress': 65, Duration: 0, 'Notes': 'testing7'
    },
];
