import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { destroy } from './treegridutil.spec';
import { stateChangeData, childdata1 , customTotalData, stateDatas} from './datasource.spec';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { select } from '@syncfusion/ej2-base';

describe('Custom Binding', () => {
    let gridObj: TreeGrid;
    const elem: HTMLElement = createElement('div', { id: 'Grid' });
    let dataStateChange: (args: any) => void;
    let dataSourceChanged: (args: any) => void;
    let originalTimeout: number;
    beforeAll((done: Function) => {
        document.body.appendChild(elem);
        const dataBound: EmitType<Object> = () => { done(); };
        jasmine.Ajax.install();
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        gridObj = new TreeGrid(
            {
                dataSource: { result: stateChangeData.slice(0, 1), count: 2 },
                dataBound: dataBound,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                allowPaging: true,
                treeColumnIndex: 1,
                dataStateChange: dataStateChange,
                dataSourceChanged: dataSourceChanged,
                allowSorting: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
                pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
                columns: [
                    {field: 'TaskID',  isPrimaryKey: true},
                    {field: 'TaskName'},
                    {field: 'StartDate'},
                    {field: 'Duration'}
                ]
            }
        );
        gridObj.appendTo('#Grid');
        done();
    });
    it('Expand Testing', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        dataStateChange = (args: any) => {
            if (args.requestType === 'expand') {
                args.childData = childdata1;
                args.childDataBind();
            }
        };
        gridObj.dataStateChange = dataStateChange;
        gridObj.expanded = (args: any) => {
            expect(gridObj.getRows()[0].getElementsByClassName('e-treegridexpand').length === 1).toBe(true);
            expect(gridObj.getRows()[1].getElementsByClassName('e-treegridexpand').length === 1).toBe(true);
        };
        done();
        gridObj.expandRow(gridObj.getRows()[0]);
    });
    it ('Nested record expand/collapse icon test', () => {
        expect(gridObj.getRows()[1].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
    });
    it('Pager Testing', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        dataStateChange = (args: any) => {
            if (args.action.requestType === 'paging') {
                const data: any = stateChangeData.slice(1, 2);
                gridObj.dataSource = { result: data, count: 2 };
            }
        };
        gridObj.dataStateChange = dataStateChange;
        gridObj.actionComplete = (args: any) => {
            if (args.requestType === 'paging') {
                expect(gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell')[1].querySelectorAll('.e-treecell')[0].innerHTML == 'Parent Task 2').toBe(true);
                expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('data-index')).toBe('2');
            }
            done();
        };
        gridObj.goToPage(2);
    });

    it('Add Row', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        dataSourceChanged = (state: any) => {
            if (state.action == 'add') {
                state.endEdit();
            }
        };
        dataStateChange = (args: any) => {
            if (args.action.action == 'add') {
                (gridObj.dataSource as any).result.splice(0, 0, args.action.data);
                gridObj.dataSource = { result: (gridObj.dataSource as any).result, count: (gridObj.dataSource as any).count + 1 };
            }
        };
        gridObj.actionComplete = (args: any) => {
            if (args.requestType === 'add'){
                const formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
                (select('#' + gridObj.grid.element.id + 'TaskID', formEle) as any).value = '121';
                (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'testing';
            }
            if (args.requestType == 'save'){
                const cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
                expect(cells[0].textContent === '121' ).toBeTruthy();
                expect(cells[1].textContent ).toBe('testing');
                done();
            }
        };
        gridObj.dataStateChange = dataStateChange;
        gridObj.dataSourceChanged = dataSourceChanged;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });


    it('Edit Row', (done: Function) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        dataSourceChanged = (state: any) => {
            if (state.action == 'edit') {
                state.endEdit();
            }
        };
        dataStateChange = (args: any) => {
            if (args.action.requestType == 'save') {
                gridObj.dataSource = { result: (gridObj.dataSource as any).result, count: (gridObj.dataSource as any).count };
            }
        };
        gridObj.selectRow(0);
        gridObj.dataSourceChanged = dataSourceChanged;
        gridObj.dataStateChange = dataStateChange;
        gridObj.actionComplete = (args?: any): void => {
            if (args.requestType === 'save'){
                const cells: NodeListOf<Element> = gridObj.grid.getRows()[0].querySelectorAll('.e-rowcell');
                expect(cells[0].textContent === '121' ).toBeTruthy();
                expect(cells[1].querySelectorAll('.e-treecell')[0].innerHTML).toBe('test1');
            }
            done();
        };
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
        const formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
        (select('#' + gridObj.grid.element.id + 'TaskName', formEle) as any).value = 'test1';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });

    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        destroy(gridObj);
        jasmine.Ajax.uninstall();
    });
});

describe('Custom Binding with loadChildOnDemand enabled', () => {
    let gridObj: TreeGrid;
    const elem: HTMLElement = createElement('div', { id: 'Grid' });
    beforeAll((done: Function) => {
        document.body.appendChild(elem);
        gridObj = new TreeGrid(
            {
                dataSource: { result: customTotalData, count: 2 },
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                loadChildOnDemand: false,
                parentIdMapping: 'parentID',
                allowPaging: true,
                treeColumnIndex: 1,
                allowSorting: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
                pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
                columns: [
                    {field: 'TaskID',  isPrimaryKey: true},
                    {field: 'TaskName'},
                    {field: 'StartDate'},
                    {field: 'Duration'}
                ]
            }
        );
        gridObj.appendTo('#Grid');
        done();
    });
    it('Expand Testing', (done: Function) => {
        expect(gridObj.getRows()[0].getElementsByClassName('e-treegridexpand').length === 1).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Custom Binding with loadChildOnDemand disabled', () => {
    let gridObj: TreeGrid;
    const elem: HTMLElement = createElement('div', { id: 'Grid' });
    beforeAll((done: Function) => {
        document.body.appendChild(elem);
        gridObj = new TreeGrid(
            {
                dataSource: { result: customTotalData, count: 2 },
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                loadChildOnDemand: true,
                parentIdMapping: 'parentID',
                allowPaging: true,
                treeColumnIndex: 1,
                allowSorting: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
                pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
                columns: [
                    {field: 'TaskID',  isPrimaryKey: true},
                    {field: 'TaskName'},
                    {field: 'StartDate'},
                    {field: 'Duration'}
                ]
            }
        );
        gridObj.appendTo('#Grid');
        done();
    });
    it('Expand Testing', (done: Function) => {
        expect(gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Refresh method for custom binding', () => {
    let gridObj: TreeGrid;
    const elem: HTMLElement = createElement('div', { id: 'Grid' });
    let dataStateChange: (args: any) => void;
    beforeAll((done: Function) => {
        document.body.appendChild(elem);
        gridObj = new TreeGrid(
            {
                dataSource: { result: customTotalData, count: 2 },
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                allowPaging: true,
                treeColumnIndex: 1,
                allowSorting: true,
                pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
                columns: [
                    {field: 'TaskID',  isPrimaryKey: true},
                    {field: 'TaskName'},
                    {field: 'StartDate'},
                    {field: 'Duration'}
                ]
            }
        );
        gridObj.appendTo('#Grid');
        done();
    });
    it('custom binding', (done: Function) => {
        dataStateChange = (args: any) => {
            if (args.requestType === 'refresh') {
                expect(args.requestType === 'refresh').toBe(true);
                (this as any).dataSource = {
                    result:  (this as any).dataSource.result,
                    count:  (this as any).dataSource.count
                };
            }
        };
        gridObj.dataStateChange = dataStateChange;
        gridObj.refresh();
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-61682 - Expand/collapse in observable binding', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let dataStateChange: (args: any) => void;
    const elem: HTMLElement = createElement('div', { id: 'Grid' });
    beforeAll((done: Function) => {
        document.body.appendChild(elem);
        gridObj = new TreeGrid(
            {
                dataSource: { result: customTotalData, count: 2 },
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                dataStateChange: dataStateChange,
                parentIdMapping: 'parentID',
                allowPaging: true,
                treeColumnIndex: 1,
                allowSorting: true,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
                pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
                columns: [
                    {field: 'TaskID',  isPrimaryKey: true},
                    {field: 'TaskName'},
                    {field: 'StartDate'},
                    {field: 'Duration'}
                ]
            }
        );
        gridObj.appendTo('#Grid');
        done();
    });
    it('Expand testing first parent record', () => {
        dataStateChange = (args: any) => {
            if (args.requestType === 'expand') {
                args.childData = childdata1;
                args.childDataBind();
            }
        };
        gridObj.dataStateChange = dataStateChange;
        rows = gridObj.getRows();
        gridObj.expandRow(rows[0] as HTMLTableRowElement);
        gridObj.collapseRow(rows[0] as HTMLTableRowElement);
        expect(gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
    });
    it('Expand testing second parent record', () => {
        rows = gridObj.getRows();
        gridObj.expandRow(rows[3] as HTMLTableRowElement);
        expect(gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
        expect(gridObj.getRows()[3].getElementsByClassName('e-treegridexpand').length === 1).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });

    describe('EJ2-67375 - Data is hidden while expanding the childs parents', () => {
        let gridObj: TreeGrid;
        let rows: Element[];
        let expanded: () => void;
        let dataStateChange: (args: any) => void;
        const elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            gridObj = new TreeGrid(
                {
                    dataSource: { result: stateDatas, count: 4 },
                    hasChildMapping: 'isParent',
                    parentIdMapping: 'ParentID',
                    idMapping: 'id',
                    height: '470',
                    dataStateChange: dataStateChange,
                    allowPaging: true,
                    treeColumnIndex: 1,
                    pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
                    columns: [
                        {field: 'TaskID',  isPrimaryKey: true},
                        {field: 'TaskName'},
                        {field: 'StartDate'}
                    ]
                }
            );
            gridObj.appendTo('#Grid');
            done();
        });
        it('Collapse and expand first parent record then expand second record - icon check', (done: Function) => {
            dataStateChange = (args: any) => {
                if (args.requestType === 'expand') {
                    /////    assigning the child data for the expanded record.

                    if ((<any>args.data).id == 2) {
                        args.childData = <any>[
                            { id: 11, TaskName: 'ANDREW', ParentID: 2, isParent: true },
                            { id: 12, TaskName: 'JOSH', ParentID: 2, isParent: false },
                            { id: 13, TaskName: 'TOM', ParentID: 2, isParent: false }
                        ];
                        if (args.childDataBind){
                            args.childDataBind();
                        }

                    }
                    else if ((<any>args.data).id == 3) {
                        args.childData = <any>[
                            { id: 14, TaskName: 'ANDREW', ParentID: 3, isParent: false },
                            { id: 15, TaskName: 'JOSH', ParentID: 3, isParent: false },
                            { id: 16, TaskName: 'TOM', ParentID: 3, isParent: false }
                        ];
                        if (args.childDataBind){
                            args.childDataBind();
                        }
                    }

                    else if ((<any>args.data).id == 4) {
                        args.childData = <any>[
                            { id: 17, TaskName: 'ANDREW', ParentID: 4, isParent: false },
                            { id: 18, TaskName: 'JOSH', ParentID: 5, isParent: false },
                            { id: 19, TaskName: 'TOM', ParentID: 6, isParent: false }
                        ];
                        if (args.childDataBind){
                            args.childDataBind();
                        }
                    } else if ((<any>args.data).id == 11) {
                        args.childData = <any>[
                            { id: 21, TaskName: 'ANDREW', ParentID: 11, isParent: false },
                            { id: 22, TaskName: 'JOSH', ParentID: 11, isParent: false },
                            { id: 23, TaskName: 'TOM', ParentID: 11, isParent: false }
                        ];
                        if (args.childDataBind){
                            args.childDataBind();
                        }
                    }
                }
            };
            gridObj.dataStateChange = dataStateChange;
            rows = gridObj.getRows();
            gridObj.collapseRow(rows[0] as HTMLTableRowElement);
            gridObj.expandRow(rows[0] as HTMLTableRowElement);
            gridObj.expandRow(rows[1] as HTMLTableRowElement);
            expanded = (args?: any) => {
                expect(args.row.getElementsByClassName('e-treegridexpand').length === 1).toBe(true);
                gridObj.expanded = null;
                done();
            };
            gridObj.expanded = expanded;
        });
        it('Collapse and expand first parent record then expand second record - data count check', () => {
            expect(gridObj.getCurrentViewRecords().length === 7).toBe(true);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-61682 - Expand/collapse in observable binding', () => {
        let gridObj: TreeGrid;
        let rows: Element[];
        let dataStateChange: (args: any) => void;
        const elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
		  document.body.appendChild(elem);
		  gridObj = new TreeGrid(
                {
			  dataSource: { result: stateChangeData, count: 2 },
			  hasChildMapping: 'isParent',
			  idMapping: 'TaskID',
			  dataStateChange: dataStateChange,
			  parentIdMapping: 'parentID',
			  allowPaging: true,
			  treeColumnIndex: 1,
			  allowSorting: true,
			  toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
			  editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' },
			  pageSettings: { pageSize: 1, pageSizeMode: 'Root' },
                    columns: [
                        {field: 'TaskID',  isPrimaryKey: true},
                        {field: 'TaskName'},
                        {field: 'StartDate'},
                        {field: 'Duration'}
                    ]
                }
		  );
		  gridObj.appendTo('#Grid');
		  done();
        });
        it('Expand testing first parent record', () => {
		  expect(gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
        });
        afterAll(() => {
		  destroy(gridObj);
        });
	  });

    describe('EJ2-64609 - Expand icon is not showing properly while using the custom binding', () => {
        let gridObj: TreeGrid;
        let rows: Element[];
        const dataSource = [
            {
                taskID: 1,
                taskName: 'Planning',
                startDate: '2017-02-02T22:00:00.000Z',
                endDate: '2017-02-06T22:00:00.000Z',
                progress: 100,
                duration: 5,
                priority: 'Normal',
                approved: false,
                designation: 'Vice President',
                employeeID: 1,
                hasChild: true,
                parentItem: null
            },
            {
                taskID: 6,
                taskName: 'Design',
                startDate: '2017-02-09T22:00:00.000Z',
                endDate: '2017-02-13T22:00:00.000Z',
                duration: 3,
                progress: 86,
                priority: 'High',
                approved: false,
                designation: 'Vice President',
                employeeID: 6,
                hasChild: true,
                parentItem: null
            },
            {
                taskID: 9,
                taskName: 'Design',
                startDate: '2017-02-09T22:00:00.000Z',
                endDate: '2017-02-13T22:00:00.000Z',
                duration: 3,
                progress: 86,
                priority: 'High',
                approved: false,
                designation: 'Vice President',
                employeeID: 6,
                hasChild: false,
                parentItem: 6
            },
            {
                taskID: 10,
                taskName: 'Design',
                startDate: '2017-02-09T22:00:00.000Z',
                endDate: '2017-02-13T22:00:00.000Z',
                duration: 3,
                progress: 86,
                priority: 'High',
                approved: false,
                designation: 'Vice President',
                employeeID: 6,
                hasChild: false,
                parentItem: 6
            },
            {
                taskID: 11,
                taskName: 'Design',
                startDate: '2017-02-09T22:00:00.000Z',
                endDate: '2017-02-13T22:00:00.000Z',
                duration: 3,
                progress: 86,
                priority: 'High',
                approved: false,
                designation: 'Vice President',
                employeeID: 6,
                hasChild: true,
                parentItem: 6
            },
            {
                taskID: 12,
                taskName: 'Design',
                startDate: '2017-02-09T22:00:00.000Z',
                endDate: '2017-02-13T22:00:00.000Z',
                duration: 3,
                progress: 86,
                priority: 'High',
                approved: false,
                designation: 'Vice President',
                employeeID: 6,
                hasChild: false,
                parentItem: 11
            },
            {
                taskID: 13,
                taskName: 'Design',
                startDate: '2017-02-09T22:00:00.000Z',
                endDate: '2017-02-13T22:00:00.000Z',
                duration: 3,
                progress: 86,
                priority: 'High',
                approved: false,
                designation: 'Vice President',
                employeeID: 6,
                hasChild: false,
                parentItem: 11
            },
            {
                taskID: 14,
                taskName: 'Design',
                startDate: '2017-02-09T22:00:00.000Z',
                endDate: '2017-02-13T22:00:00.000Z',
                duration: 3,
                progress: 86,
                priority: 'High',
                approved: false,
                designation: 'Vice President',
                employeeID: 6,
                hasChild: true,
                parentItem: 11
            },
            {
                taskID: 15,
                taskName: 'Implementation Phase',
                startDate: '2017-02-16T22:00:00.000Z',
                endDate: '2017-02-26T22:00:00.000Z',
                priority: 'Normal',
                approved: false,
                duration: 11,
                progress: 66,
                designation: 'Vice President',
                employeeID: 12,
                hasChild: true,
                parentItem: null
            }
        ];
        const elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            gridObj = new TreeGrid(
                {
                    dataSource: { result: [], count: 0 },
                    idMapping: 'taskID',
                    hasChildMapping: 'hasChild',
                    parentIdMapping: 'parentItem',
                    treeColumnIndex: 1,
                    columns: [
                        { field: 'taskID', headerText: 'Task ID', width: 70, textAlign: 'Right', isPrimaryKey: true },
                        {
                            field: 'taskName',
                            headerText: 'Task Name',
                            width: 200,
                            textAlign: 'Left'
                        },
                        {
                            field: 'startDate',
                            headerText: 'Start Date',
                            width: 90,
                            textAlign: 'Right',
                            type: 'date',
                            format: 'yMd'
                        },
                        {
                            field: 'endDate',
                            headerText: 'End Date',
                            width: 90,
                            textAlign: 'Right',
                            type: 'date',
                            format: 'yMd'
                        },
                        {
                            field: 'duration',
                            headerText: 'Duration',
                            width: 80,
                            textAlign: 'Right'
                        },
                        {
                            field: 'progress',
                            headerText: 'Progress',
                            width: 80,
                            textAlign: 'Right'
                        },
                        { field: 'priority', headerText: 'Priority', width: 90 }
                    ]
                }
            );
            gridObj.appendTo('#Grid');
            done();
        });
        it('Binding dataSource after some delay', (done: Function) => {
            setTimeout(done, 1000);
            gridObj.dataSource = { result: dataSource, count: 9 };
            gridObj.dataBind();
            done();
        });
        it('Collapse testing for second parent record', () => {
            expect(gridObj.getRows()[0].getElementsByClassName('e-treegridexpand').length === 1).toBe(true);
            rows = gridObj.getRows();
            gridObj.collapseRow(rows[1] as HTMLTableRowElement);
            expect(gridObj.getRows()[1].getElementsByClassName('e-treegridcollapse').length === 1).toBe(true);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('EJ2-68426 - Child record not shown properly issue', () => {
        let gridObj: TreeGrid;
        let rows: Element[];
        let dataStateChange: (args: any) => void;
        const elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            gridObj = new TreeGrid(
                {
                    dataSource: {
                        result: [
                            {
                                TaskID: 1,
                                TaskName: 'Parent Task 1',
                                StartDate: '1992-06-07T00:00:00Z',
                                EndDate: '1994-08-25T00:00:00Z',
                                Progress: 'Open',
                                Priority: 'Critical',
                                Duration: 17,
                                isParent: true
                            },
                            {
                                TaskID: 2,
                                TaskName: 'Parent Task 2',
                                StartDate: '1992-06-07T00:00:00Z',
                                EndDate: '1994-08-25T00:00:00Z',
                                Progress: 'In Progress',
                                Priority: 'Critical',
                                Duration: 21,
                                isParent: true
                            },
                            {
                                TaskID: 3,
                                TaskName: 'Parent Task 3',
                                StartDate: '1992-06-07T00:00:00Z',
                                EndDate: '1994-08-25T00:00:00Z',
                                Progress: 'In Progress',
                                Priority: 'Critical',
                                Duration: 21,
                                isParent: true
                            },
                            {
                                TaskID: 4,
                                TaskName: 'Parent Task 4',
                                StartDate: '1992-06-07T00:00:00Z',
                                EndDate: '1994-08-25T00:00:00Z',
                                Progress: 'In Progress',
                                Priority: 'Critical',
                                Duration: 21,
                                isParent: false
                            }
                        ],
                        count: 4
                    },
                    hasChildMapping: 'isParent',
                    idMapping: 'TaskID',
                    parentIdMapping: 'ParentItem',
                    height: 400,
                    treeColumnIndex: 1,
                    allowPaging: true,
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID', width: 80, textAlign: 'Right', isPrimaryKey: true },
                        {
                            field: 'TaskName',
                            headerText: 'Task Name',
                            width: 200,
                            textAlign: 'Left'
                        },
                        {
                            field: 'StartDate',
                            headerText: 'Start Date',
                            width: 90,
                            textAlign: 'Right',
                            type: 'date',
                            format: 'yMd'
                        },
                        {
                            field: 'EndDate',
                            headerText: 'End Date',
                            width: 90,
                            textAlign: 'Right',
                            type: 'date',
                            format: 'yMd'
                        },
                        {
                            field: 'Duration',
                            headerText: 'Duration',
                            width: 90,
                            textAlign: 'Right'
                        },
                        { field: 'Progress', headerText: 'Progress', width: 90 }
                    ],
                    dataStateChange: dataStateChange

                }
            );
            gridObj.appendTo('#Grid');
            done();
        });
        it('Random expand/collapse and child data check', (done: Function) => {
            dataStateChange = (state: any) => {
                if (state.requestType === 'expand') {
                    if (state.data.Children === undefined) {
                        if (state.data.Children !== null || state.data.Children.length === 0) {
                            let childData: any = [];
                            if (state.data.TaskID === 1) {
                                childData = [
                                    {
                                        TaskID: 11,
                                        TaskName: 'Parent Task 11',
                                        StartDate: '1992-06-07T00:00:00Z',
                                        EndDate: '1994-08-25T00:00:00Z',
                                        Progress: 'Open',
                                        Priority: 'Critical',
                                        Duration: 17,
                                        isParent: true,
                                        ParentItem: 1
                                    },
                                    {
                                        TaskID: 12,
                                        TaskName: 'Parent Task 12',
                                        StartDate: '1992-06-07T00:00:00Z',
                                        EndDate: '1994-08-25T00:00:00Z',
                                        Progress: 'In Progress',
                                        Priority: 'Critical',
                                        Duration: 21,
                                        isParent: false,
                                        ParentItem: 1
                                    }
                                ];
                            } else if (state.data.TaskID === 2) {
                                childData = [
                                    {
                                        TaskID: 21,
                                        TaskName: 'Parent Task 21',
                                        StartDate: '1992-06-07T00:00:00Z',
                                        EndDate: '1994-08-25T00:00:00Z',
                                        Progress: 'Open',
                                        Priority: 'Critical',
                                        Duration: 17,
                                        isParent: false,
                                        ParentItem: 2
                                    },
                                    {
                                        TaskID: 22,
                                        TaskName: 'Parent Task 22',
                                        StartDate: '1992-06-07T00:00:00Z',
                                        EndDate: '1994-08-25T00:00:00Z',
                                        Progress: 'In Progress',
                                        Priority: 'Critical',
                                        Duration: 21,
                                        isParent: false,
                                        ParentItem: 2
                                    }
                                ];
                            } else if (state.data.TaskID === 3) {
                                childData = [
                                    {
                                        TaskID: 31,
                                        TaskName: 'Parent Task 31',
                                        StartDate: '1992-06-07T00:00:00Z',
                                        EndDate: '1994-08-25T00:00:00Z',
                                        Progress: 'Open',
                                        Priority: 'Critical',
                                        Duration: 17,
                                        isParent: false,
                                        ParentItem: 2
                                    },
                                    {
                                        TaskID: 32,
                                        TaskName: 'Parent Task 32',
                                        StartDate: '1992-06-07T00:00:00Z',
                                        EndDate: '1994-08-25T00:00:00Z',
                                        Progress: 'In Progress',
                                        Priority: 'Critical',
                                        Duration: 21,
                                        isParent: false,
                                        ParentItem: 2
                                    }
                                ];
                            } else if (state.data.TaskID === 11) {
                                childData = [
                                    {
                                        TaskID: 111,
                                        TaskName: 'Parent Task 111',
                                        StartDate: '1992-06-07T00:00:00Z',
                                        EndDate: '1994-08-25T00:00:00Z',
                                        Progress: 'Open',
                                        Priority: 'Critical',
                                        Duration: 17,
                                        isParent: false,
                                        ParentItem: 2
                                    },
                                    {
                                        TaskID: 112,
                                        TaskName: 'Parent Task 112',
                                        StartDate: '1992-06-07T00:00:00Z',
                                        EndDate: '1994-08-25T00:00:00Z',
                                        Progress: 'In Progress',
                                        Priority: 'Critical',
                                        Duration: 21,
                                        isParent: false,
                                        ParentItem: 2
                                    }
                                ];
                            }

                            state.childData = childData;
                            state.childDataBind();
                        }
                    } else {
                        state.childData = state.data.childRecords;
                        state.childDataBind();
                    }
                }
            };
            gridObj.dataStateChange = dataStateChange;
            rows = gridObj.getRows();
            gridObj.expandRow(rows[0]  as HTMLTableRowElement);
            gridObj.collapseRow(rows[0] as HTMLTableRowElement);
            gridObj.expandRow(rows[3] as HTMLTableRowElement);
            expect(gridObj.getCurrentViewRecords()[1]['TaskID'] === 2).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
});

