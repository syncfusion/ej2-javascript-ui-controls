import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData2, unorederedData, projectData, virtualData} from '../base/datasource.spec';
import { getObject } from '@syncfusion/ej2-grids';
import { EmitType } from '@syncfusion/ej2-base';
import { RowDD } from '../../src/treegrid/actions/rowdragdrop';
import { VirtualScroll } from '../../src/treegrid/actions/virtual-scroll';
import { ITreeData } from '../../src';
import { getMemoryProfile, inMB, profile } from '../common.spec';
/**
 * TreeGrid Indent and Outdent action spec
 */
TreeGrid.Inject(RowDD, VirtualScroll);

describe('IndentOutdent action', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('EJ2-58872 - Indent/Outdent action check when persistSelection is enabled ', () => {
        let TreeGridObj: TreeGrid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            TreeGridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    height: 400,
                    toolbar: ['Indent', 'Outdent'],
                    selectionSettings: {
                        enableToggle: true,
                        mode: 'Row',
                        type: 'Multiple',
                        persistSelection: true
                    },
                    columns: [
                        {
                            field: 'taskID',
                            headerText: 'Task ID',
                            isPrimaryKey: true,
                            textAlign: 'Right',
                            validationRules: { required: true, number: true },
                            width: 90
                        },
                        {
                            field: 'taskName',
                            headerText: 'Task Name',
                            editType: 'stringedit',
                            width: 220,
                            validationRules: { required: true }
                        },
                        {
                            field: 'startDate',
                            headerText: 'Start Date',
                            textAlign: 'Right',
                            width: 130,
                            editType: 'datepickeredit',
                            format: 'yMd',
                            validationRules: { date: true }
                        },
                        {
                            field: 'duration',
                            headerText: 'Duration',
                            textAlign: 'Right',
                            width: 100,
                            editType: 'numericedit',
                            validationRules: { number: true, min: 0 },
                            edit: { params: { format: 'n' } }
                        }
                    ]
                }, done);
        });

        it('Indent/Outdent icon updated check', (done: Function) => {
            actionComplete = (): void => {
                expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_indent').parentElement.classList.contains('e-hidden')).toBe(false);
                expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_outdent').parentElement.classList.contains('e-hidden')).toBe(true);
                done();
            };
            TreeGridObj.actionComplete = actionComplete;
            TreeGridObj.selectRow(1);
            (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_outdent' } });
            TreeGridObj.rowDragAndDropModule.destroy();
        });
        afterAll(() => {
            destroy(TreeGridObj);
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe('EJ2-59000 - Indent/Outdent action check with virtualization ', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                toolbar: [ 'Indent', 'Outdent'],
                dataSource: virtualData.slice(0, 100),
                parentIdMapping: 'ParentID',
                idMapping: 'TaskID',
                height: 200,
                enableVirtualization: true,
                columns: [
                    { field: 'TaskID', headerText: 'ID', isPrimaryKey: true, width: 140 },

                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
                    { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
                    { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
                    { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
                    { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
                    { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' }
                ],
                treeColumnIndex: 1
            }, done);
    });

    it('Indent/Outdent icon updated check', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(args.data[0].parentItem === undefined).toBe(true);
            done();
        };
        TreeGridObj.actionComplete = actionComplete;
        TreeGridObj.selectRow(50);
        TreeGridObj.selectRow(51);
        (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_outdent' } });
        setTimeout(done, 1000);
        TreeGridObj.rowDragAndDropModule.destroy();
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});

describe('EJ2-59005 - Indent/Outdent action check with checkbox selection', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                toolbar: ['Indent', 'Outdent'],
                columns: [
                    { type: 'checkbox', width: 50 },

                    {
                        field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                        validationRules: { required: true, number: true}, width: 90
                    },
                    { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, validationRules: {required: true} },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                        format: 'yMd', validationRules: { date: true} },
                    {
                        field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100, editType: 'numericedit',
                        validationRules: { number: true, min: 0}, edit: { params: {  format: 'n'}}
                    }
                ]
            }, done);
    });

    it('Indent/Outdent icon updated check', (done: Function) => {
        (<HTMLElement>TreeGridObj.getRows()[1].querySelector('.e-checkselect')).click();
        (<HTMLElement>TreeGridObj.getRows()[2].querySelector('.e-checkselect')).click();
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_indent').parentElement.classList.contains('e-hidden')).toBe(true);
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_outdent').parentElement.classList.contains('e-hidden')).toBe(true);
        (<HTMLElement>TreeGridObj.getRows()[2].querySelector('.e-checkselect')).click();
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_indent').parentElement.classList.contains('e-hidden')).toBe(true);
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector('#' + TreeGridObj.element.id + '_gridcontrol_outdent').parentElement.classList.contains('e-hidden')).toBe(false);
        done();
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});

describe('EJ2-58990 - Indent/Outdent action method check without parameter ', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                toolbar: ['Indent', 'Outdent'],
                selectionSettings: {
                    enableToggle: true,
                    mode: 'Row',
                    type: 'Multiple',
                    persistSelection: true
                },
                columns: [
                    {
                        field: 'taskID',
                        headerText: 'Task ID',
                        isPrimaryKey: true,
                        textAlign: 'Right',
                        validationRules: { required: true, number: true },
                        width: 90
                    },
                    {
                        field: 'taskName',
                        headerText: 'Task Name',
                        editType: 'stringedit',
                        width: 220,
                        validationRules: { required: true }
                    },
                    {
                        field: 'startDate',
                        headerText: 'Start Date',
                        textAlign: 'Right',
                        width: 130,
                        editType: 'datepickeredit',
                        format: 'yMd',
                        validationRules: { date: true }
                    },
                    {
                        field: 'duration',
                        headerText: 'Duration',
                        textAlign: 'Right',
                        width: 100,
                        editType: 'numericedit',
                        validationRules: { number: true, min: 0 },
                        edit: { params: { format: 'n' } }
                    }
                ]
            }, done);
    });

    it('Indent/Outdent icon updated check', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'outdented') {
                expect(args.data[0].parentItem === undefined).toBe(true);
            }
            if (args.requestType === 'indented') {
                expect(args.data[0].parentItem.taskID === 3).toBe(true);
            }
            done();
        };
        TreeGridObj.actionComplete = actionComplete;
        TreeGridObj.selectRow(1);
        TreeGridObj.outdent();
        TreeGridObj.selectRow(2);
        TreeGridObj.indent();
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});

describe('EJ2-58990 - Indent/Outdent action method check with parameter ', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                toolbar: ['Indent', 'Outdent'],
                selectionSettings: {
                    enableToggle: true,
                    mode: 'Row',
                    type: 'Multiple',
                    persistSelection: true
                },
                columns: [
                    {
                        field: 'taskID',
                        headerText: 'Task ID',
                        isPrimaryKey: true,
                        textAlign: 'Right',
                        validationRules: { required: true, number: true },
                        width: 90
                    },
                    {
                        field: 'taskName',
                        headerText: 'Task Name',
                        editType: 'stringedit',
                        width: 220,
                        validationRules: { required: true }
                    },
                    {
                        field: 'startDate',
                        headerText: 'Start Date',
                        textAlign: 'Right',
                        width: 130,
                        editType: 'datepickeredit',
                        format: 'yMd',
                        validationRules: { date: true }
                    },
                    {
                        field: 'duration',
                        headerText: 'Duration',
                        textAlign: 'Right',
                        width: 100,
                        editType: 'numericedit',
                        validationRules: { number: true, min: 0 },
                        edit: { params: { format: 'n' } }
                    }
                ]
            }, done);
    });

    it('Indent/Outdent icon updated check', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'outdented') {
                expect(args.data[0].parentItem === undefined).toBe(true);
            }
            if (args.requestType === 'indented') {
                expect(args.data[0].parentItem !== undefined).toBe(true);
            }
            done();
        };
        TreeGridObj.actionComplete = actionComplete;
        TreeGridObj.outdent(TreeGridObj.getCurrentViewRecords()[1]);
        TreeGridObj.indent(TreeGridObj.getCurrentViewRecords()[2]);
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});

describe('Maintain expand/collapse state after indent/outdent actions', () => {
    let TreeGridObj: TreeGrid;
  
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                toolbar: ['Indent', 'Outdent'],
                columns: [
                    {
                        field: 'taskID',
                        headerText: 'Task ID',
                        isPrimaryKey: true,
                        textAlign: 'Right',
                        validationRules: { required: true, number: true },
                        width: 90
                    },
                    {
                        field: 'taskName',
                        headerText: 'Task Name',
                        editType: 'stringedit',
                        width: 220,
                        validationRules: { required: true }
                    },
                    {
                        field: 'startDate',
                        headerText: 'Start Date',
                        textAlign: 'Right',
                        width: 130,
                        editType: 'datepickeredit',
                        format: 'yMd',
                        validationRules: { date: true }
                    },
                    {
                        field: 'duration',
                        headerText: 'Duration',
                        textAlign: 'Right',
                        width: 100,
                        editType: 'numericedit',
                        validationRules: { number: true, min: 0 },
                        edit: { params: { format: 'n' } }
                    }
                ]
            }, done);
    });

    it('should maintain expand/collapse state after outdent actions', (done: Function) => {
     const actionComplete = (args?: any): void => {
            if (args.requestType === 'outdented') {
               expect(TreeGridObj.getRows()[0].querySelector('.e-treegridexpand')).toBeNull(); 
               expect((TreeGridObj.getVisibleRecords()[1] as any).taskID == 2).toBe(true);
            }
            done();
        }; 
        TreeGridObj.actionComplete = actionComplete;
        TreeGridObj.collapseRow(TreeGridObj.getRows()[0], TreeGridObj.getCurrentViewRecords()[0]);
        TreeGridObj.selectRow(1);
        TreeGridObj.outdent();
        
    });
     it('should maintain expand/collapse state after indent actions', (done: Function) => {
     const actionComplete = (args?: any): void => {
            if (args.requestType === 'indented') {
               expect(TreeGridObj.getRows()[0].querySelector('.e-treegridexpand')).not.toBeNull(); 
             }
            done();
        }; 
        TreeGridObj.actionComplete = actionComplete;
         TreeGridObj.expandRow(TreeGridObj.getRows()[0], TreeGridObj.getCurrentViewRecords()[0]);
        TreeGridObj.selectRow(2);
        TreeGridObj.indent();
        
    });

    afterAll(() => {
        destroy(TreeGridObj);
    });
}); 

describe('TreeGrid Indent/Outdent Tests', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;

    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowPaging: true,
            toolbar: ['Indent', 'Outdent'],
            columns: [
                { field: 'taskID', headerText: 'Task ID',isPrimaryKey:true,width: 90, textAlign: 'Right' },
                { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                { field: 'startDate', headerText: 'Start Date', width: 90, type: 'date', format: 'yMd' },
                { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
            ]
        }, done);
    });

   it('should indent a child row', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect((gridObj.getCurrentViewRecords()[2] as any).taskName == "Plan budget").toBe(true);
            done();
        };
        gridObj.actionComplete = actionComplete;
       gridObj.selectRow(2);
        gridObj.indent();
    });

    it('should outdent a row from child to sibling', (done: Function) => {
        actionComplete = (args?: any): void => {
           expect((gridObj.getCurrentViewRecords()[2] as any).taskName == "Plan budget").toBe(true);
             done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(2);
        gridObj.outdent();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('TreeGrid Expand/Collapse with Indent/Outdent Tests', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;

    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            columns: [
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey:true,width: 90, textAlign: 'Right' },
                { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                { field: 'startDate', headerText: 'Start Date', width: 90, type: 'date', format: 'yMd' },
                { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
            ]
        }, done);
    });

    it('should properly indent and then expand the parent', (done: Function) => {
        
        actionComplete = (args?: any): void => {
            debugger;
            if (args['requestType'] == 'indented') {
                gridObj.expandRow(gridObj.getRows()[1]);
                const expanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand'));
                expect(expanded.length).toBe(10);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(2);
        gridObj.indent();
    });

    it('should outdent a child and collapse all', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args['requestType'] == 'outdented') {
               
                const expanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand'));
                expect(expanded.length).toBe(9);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(2);
        gridObj.outdent();
    });

    it('should persist expand/collapse state through indent/outdent', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args['requestType'] === 'indented') {
                const initialExpanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand')).length;
                gridObj.outdent();
                const newExpanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand')).length;
                expect(newExpanded).toBe(initialExpanded);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        // Initial state
        gridObj.expandAll();
        gridObj.selectRow(2);
        gridObj.indent();
    });

    it('should handle rapid indent/outdent changes with expand/collapse', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args['requestType'] === 'outdented') {
                const expandedRows = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand'));
                expect(expandedRows.length).toBe(0);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(2);
        gridObj.indent();
        gridObj.selectRow(2);
        gridObj.outdent();
        gridObj.expandAll();
        gridObj.collapseAll();
    });

  
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('TreeGrid Indent/Outdent with Collapse All Tests', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;

    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            enableCollapseAll: true,
            columns: [
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey:true,width: 90, textAlign: 'Right' },
                { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                { field: 'startDate', headerText: 'Start Date', width: 90, type: 'date', format: 'yMd' },
                { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
            ]
        }, done);
    });

    it('should indent and expand parent with enableCollapseAll', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args['requestType'] === 'indented') {
                gridObj.expandRow(gridObj.getRows()[0]);
                const expanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand'));
                expect(expanded.length).toBe(2);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(3)
        gridObj.indent();
    });

    it('should persist state with combined indent/outdent and collapse actions', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args['requestType'] === 'outdented') {
                const expandedAfterOutdent = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand')).length;
                gridObj.collapseAll();
                const collapsed = gridObj.getRows().filter(row => row.querySelector('.e-treegridcollapse'));
                expect(collapsed.length).toBe(9);
                expect(expandedAfterOutdent).toBeGreaterThan(0);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        // Initial state
        gridObj.expandAll();
        gridObj.selectRow(3);
        gridObj.indent();
        gridObj.selectRow(3);
        gridObj.outdent();
    });

    it('should consistently update ARIA attributes after collapse and outdent', (done: Function) => {
        actionComplete = (args?: any): void => {
            const rows = gridObj.getRows();
            gridObj.collapseAll();
            expect(rows.every(row => row.querySelector('.e-treecell').getAttribute('aria-expanded') === 'false')).toBeFalsy();
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.selectRow(2);
        gridObj.outdent();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Maintain expand/collapse state after indent/outdent actions using Toolbar', () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        height: 400,
        toolbar: ['Indent', 'Outdent'],
        columns: [
          {
            field: 'taskID',
            headerText: 'Task ID',
            isPrimaryKey: true,
            textAlign: 'Right',
            validationRules: { required: true, number: true },
            width: 90
          },
          {
            field: 'taskName',
            headerText: 'Task Name',
            editType: 'stringedit',
            width: 220,
            validationRules: { required: true }
          },
          {
            field: 'startDate',
            headerText: 'Start Date',
            textAlign: 'Right',
            width: 130,
            editType: 'datepickeredit',
            format: 'yMd',
            validationRules: { date: true }
          },
          {
            field: 'duration',
            headerText: 'Duration',
            textAlign: 'Right',
            width: 100,
            editType: 'numericedit',
            validationRules: { number: true, min: 0 },
            edit: { params: { format: 'n' } }
          }
        ]
      },
      done,
    );
  });

  it('should maintain expand/collapse state after outdent actions using Toolbar', (done: Function) => {
    const actionComplete = (args?: any): void => {
      if (args.requestType === 'outdented') {
        expect(TreeGridObj.getRows()[0].querySelector('.e-treegridexpand')).toBeNull();
        expect((TreeGridObj.getVisibleRecords()[1] as any).taskID == 2).toBe(true);
      }
      done();
    };

    TreeGridObj.actionComplete = actionComplete;
    TreeGridObj.collapseRow(TreeGridObj.getRows()[0], TreeGridObj.getCurrentViewRecords()[0]);
    TreeGridObj.selectRow(1);

    // Simulate toolbar button click for 'Outdent'
    (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: TreeGridObj.grid.element.id + '_outdent' },
    });
  });

  it('should maintain expand/collapse state after indent actions using Toolbar', (done: Function) => {
    const actionComplete = (args?: any): void => {
      if (args.requestType === 'indented') {
        expect(TreeGridObj.getRows()[0].querySelector('.e-treegridexpand')).not.toBeNull();
      }
      done();
    };

    TreeGridObj.actionComplete = actionComplete;
    TreeGridObj.expandRow(TreeGridObj.getRows()[0], TreeGridObj.getCurrentViewRecords()[0]);
    TreeGridObj.selectRow(2);

    // Simulate toolbar button click for 'Indent'
    (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: TreeGridObj.grid.element.id + '_indent' },
    });
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe('TreeGrid Indent/Outdent Tests using Toolbar', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid({
      dataSource: sampleData,
      childMapping: 'subtasks',
      treeColumnIndex: 1,
      allowPaging: true,
      toolbar: ['Indent', 'Outdent'],
      columns: [
        { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 90, textAlign: 'Right' },
        { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
        { field: 'startDate', headerText: 'Start Date', width: 90, type: 'date', format: 'yMd' },
        { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
      ]
    }, done);
  });

  it('should indent a child row using Toolbar', (done: Function) => {
    actionComplete = (args?: any): void => {
      expect((gridObj.getCurrentViewRecords()[2] as any).taskName == "Plan budget").toBe(true);
      done();
    };
    gridObj.actionComplete = actionComplete;
    gridObj.selectRow(2);

    // Simulate toolbar button click for 'Indent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_indent' },
    });
  });

  it('should outdent a row from child to sibling using Toolbar', (done: Function) => {
    actionComplete = (args?: any): void => {
      expect((gridObj.getCurrentViewRecords()[2] as any).taskName == "Plan budget").toBe(true);
      done();
    };
    gridObj.actionComplete = actionComplete;
    gridObj.selectRow(2);

    // Simulate toolbar button click for 'Outdent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_outdent' },
    });
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe('TreeGrid Expand/Collapse with Indent/Outdent Tests using Toolbar', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid({
      dataSource: sampleData,
      childMapping: 'subtasks',
       toolbar: ['Indent', 'Outdent'],
      treeColumnIndex: 1,
      columns: [
        { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 90, textAlign: 'Right' },
        { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
        { field: 'startDate', headerText: 'Start Date', width: 90, type: 'date', format: 'yMd' },
        { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
      ]
    }, done);
  });

  it('should properly indent and then expand the parent using Toolbar', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args['requestType'] == 'indented') {
        gridObj.expandRow(gridObj.getRows()[1]);
        const expanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand'));
        expect(expanded.length).toBe(10);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
    gridObj.selectRow(2);

    // Simulate toolbar button click for 'Indent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_indent' },
    });
  });

  it('should outdent a child and collapse all using Toolbar', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args['requestType'] == 'outdented') {
        const expanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand'));
        expect(expanded.length).toBe(9);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
    gridObj.selectRow(2);

    // Simulate toolbar button click for 'Outdent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_outdent' },
    });
  });

  it('should persist expand/collapse state through indent/outdent using Toolbar', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args['requestType'] === 'indented') {
        const initialExpanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand')).length;
        gridObj.selectRow(2);
        const newExpanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand')).length;
        expect(newExpanded).toBe(initialExpanded);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
  
    gridObj.expandAll();
    gridObj.selectRow(2);

    // Simulate toolbar button click for 'Indent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_indent' },
    });
  });

  it('should handle rapid indent/outdent changes with expand/collapse using Toolbar', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args['requestType'] === 'outdented') {
        const expandedRows = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand'));
        expect(expandedRows.length).toBe(0);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;

    gridObj.selectRow(2);

    // Simulate toolbar button click for 'Indent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_indent' },
    });

    gridObj.selectRow(2);

    // Simulate toolbar button click for 'Outdent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_outdent' },
    });

    gridObj.expandAll();
    gridObj.collapseAll();
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe('TreeGrid Indent/Outdent with Collapse All Tests using Toolbar', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid({
      dataSource: sampleData,
      childMapping: 'subtasks',
      treeColumnIndex: 1,
      enableCollapseAll: true,
       toolbar: ['Indent', 'Outdent'],
      columns: [
        { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 90, textAlign: 'Right' },
        { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
        { field: 'startDate', headerText: 'Start Date', width: 90, type: 'date', format: 'yMd' },
        { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
      ]
    }, done);
  });

  it('should indent and expand parent with enableCollapseAll using Toolbar', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args['requestType'] === 'indented') {
        gridObj.expandRow(gridObj.getRows()[0]);
        const expanded = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand'));
        expect(expanded.length).toBe(2);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
    gridObj.selectRow(3);

    // Simulate toolbar button click for 'Indent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_indent' },
    });
  });

  it('should persist state with combined indent/outdent and collapse actions using Toolbar', (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args['requestType'] === 'outdented') {
        const expandedAfterOutdent = gridObj.getRows().filter(row => row.querySelector('.e-treegridexpand')).length;
        gridObj.collapseAll();
        const collapsed = gridObj.getRows().filter(row => row.querySelector('.e-treegridcollapse'));
        expect(collapsed.length).toBe(9);
        expect(expandedAfterOutdent).toBeGreaterThan(0);
        done();
      }
    };
    gridObj.actionComplete = actionComplete;
  
    gridObj.expandAll();
    gridObj.selectRow(3);

    // Simulate toolbar button click for 'Indent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_indent' },
    });

    gridObj.selectRow(3);

    // Simulate toolbar button click for 'Outdent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_outdent' },
    });
  });

  it('should consistently update ARIA attributes after collapse and outdent using Toolbar', (done: Function) => {
    actionComplete = (args?: any): void => {
      const rows = gridObj.getRows();
      gridObj.collapseAll();
      expect(rows.every(row => row.querySelector('.e-treecell').getAttribute('aria-expanded') === 'false')).toBeFalsy();
      done();
    };
    gridObj.actionComplete = actionComplete;
    gridObj.selectRow(2);

    // Simulate toolbar button click for 'Outdent'
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + '_outdent' },
    });
  });

  afterAll(() => {
    destroy(gridObj);
  });
});