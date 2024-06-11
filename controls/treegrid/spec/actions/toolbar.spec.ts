import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { projectData, sampleData } from '../base/datasource.spec';
import { ToolbarItem } from '../../src/treegrid/enum';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { Edit } from '../../src/treegrid/actions/edit';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { select } from '@syncfusion/ej2-base';
import { ITreeData } from '../../src';
import { isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { PdfExport } from '../../src/treegrid/actions/pdf-export';
import { ExcelExport } from '../../src/treegrid/actions/excel-export';


/**
 * Grid Toolbar spec 
 */
TreeGrid.Inject(Toolbar,Edit, PdfExport, ExcelExport);
describe('TreeGrid Toolbar module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
      });
      
  describe('Toolbar string', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                toolbar: ['Search', 'ExpandAll', 'CollapseAll'],
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
            },
            done
        );
    });

    it('Toolbars string', () => {
        let toolbarElements: Element = gridObj.toolbarModule.getToolbar().firstElementChild;
        expect(toolbarElements.querySelectorAll('.e-toolbar-item')[0].getAttribute('title')).toBe('Expand All');
        expect(toolbarElements.querySelectorAll('.e-toolbar-item')[1].getAttribute('title')).toBe('Collapse All');
        expect(toolbarElements.querySelectorAll('.e-toolbar-item')[2].getAttribute('title')).toBe('Search');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Script error throws in inline editing', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400, 
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    {
                        field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                        validationRules: { required: true, number: true}, width: 90
                    },
                    { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, validationRules: {required: true}, showCheckbox: true },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, editType: 'datepickeredit',
                        format: 'yMd', validationRules: { date: true} },
                    {
                        field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100, editType: 'numericedit',
                        validationRules: { number: true, min: 0}, edit: { params: {  format: 'n'}}
                    }
                ]
            },
            done
        );
    });

    it('Script Error', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.action === 'add') {
              expect(args.data.taskName).toBe('fourth');
              done();
            }
        };
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
        (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '124';
        (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'fourth';
        (select('#' + gridObj.grid.element.id + 'startDate', formEle) as any).value = '2/3/2017';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Toolbar enum', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                toolbar: [ToolbarItem.Search, ToolbarItem.ExpandAll, ToolbarItem.CollapseAll],
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
            },
            done
        );
    });

    it('enum', () => {
        let toolbarElements: Element = gridObj.toolbarModule.getToolbar().firstElementChild;
        expect(toolbarElements.querySelectorAll('.e-toolbar-item')[0].getAttribute('title')).toBe('Expand All');
        expect(toolbarElements.querySelectorAll('.e-toolbar-item')[1].getAttribute('title')).toBe('Collapse All');
        expect(toolbarElements.querySelectorAll('.e-toolbar-item')[2].getAttribute('title')).toBe('Search');
    });
    it('click events', () => {
        (<HTMLElement>select('#' + gridObj.grid.element.id + '_collapseall', gridObj.toolbarModule.getToolbar())).click();
        expect((<HTMLTableRowElement>gridObj.getRows()[1]).style.display).toBe('none');
        (<HTMLElement>select('#' + gridObj.grid.element.id + '_expandall', gridObj.toolbarModule.getToolbar())).click();
        expect((<HTMLTableRowElement>gridObj.getRows()[1]).style.display).toBe('table-row');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Toolbar setmodel', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                toolbar: [ToolbarItem.Search, ToolbarItem.ExpandAll, ToolbarItem.CollapseAll],
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
            },
            done
        );
    });

    it('setmodel', () => {
        gridObj.toolbar = [{text: 'testToolbar'}];
        gridObj.dataBind();
        expect(gridObj.toolbarModule.getToolbar().firstElementChild.querySelector('.e-tbar-btn-text').textContent).toBe('testToolbar');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Toolbar Module test', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                toolbar: [ToolbarItem.ExpandAll, ToolbarItem.CollapseAll],
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
            },
            done
        );
    });

    it('methods', () => {
        let tool: Element = gridObj.toolbarModule.getToolbar();
        gridObj.toolbarModule.enableItems([gridObj.element.id + '_gridcontrol_expandall'], false);
        expect(tool.firstElementChild.firstElementChild.classList.contains('e-overlay')).toBeTruthy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('CollapseAll records ', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                 treeColumnIndex: 1,
                 allowSorting: true,
                 allowPaging: true,
                 allowFiltering: true,
                 allowExcelExport: true,
                 pageSettings: {pageSize: 11},
                 toolbar: ['ExpandAll', 'CollapseAll'],
                 columns: [
          
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true,  width: 150},
                    { field: 'taskName', headerText: 'Task Name', width: 150 },
                    { field: 'priority', headerText: 'priority' ,width: 150},
                    { field: 'approved', headerText: 'approved',width: 150 }  
           
        ]
            },
            done
        );
    });

    it('CollapseAll records', () => {
        gridObj.pagerModule.goToPage(4);
        (<HTMLElement>gridObj.element.querySelector('.e-collapse')).click();
        expect(gridObj.pageSettings.currentPage == 1).toBe(true);
        expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
        expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design").toBe(true);
        expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Implementation Phase").toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-57737 - Indent/Outdent Toolbar icon based on rowselection and deselection', () => {
    let TreeGridObj: TreeGrid;
    let rowSelected: () => void;
    let rowDeselected: () => void;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: "subtasks",
          treeColumnIndex: 1,
          allowRowDragAndDrop: true,
          toolbar: ['Indent', 'Outdent'],
          columns: [
            { field: "TaskID", headerText: "Task Id", isPrimaryKey: true, width: 90 },
            { field: 'TaskName', headerText: 'TaskName', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Checking Indent/Outdent Toolbar on Initial rendering', (done: Function) => {
      expect(TreeGridObj.toolbarModule.getToolbar().querySelector("#" + TreeGridObj.element.id + '_gridcontrol_indent').parentElement.classList.contains("e-hidden")).toBe(true);
      expect(TreeGridObj.toolbarModule.getToolbar().querySelector("#" + TreeGridObj.element.id + '_gridcontrol_outdent').parentElement.classList.contains("e-hidden")).toBe(true);
      done();
    });
    it('Checking Indent/Outdent Toolbar when selecting the row', (done: Function) => {
      rowSelected = (): void => {
        let tool: Element = TreeGridObj.toolbarModule.getToolbar();
        expect(tool.firstElementChild.lastElementChild.classList.contains('e-overlay') === false).toBe(true);
        done();
      };
      TreeGridObj.rowSelected = rowSelected;
      TreeGridObj.grid.selectRow(1);
    });
    it('Checking Indent/Outdent Toolbar when deselecting the row', (done: Function) => {
      rowDeselected = (): void => {
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector("#" + TreeGridObj.element.id + '_gridcontrol_indent').parentElement.classList.contains("e-hidden")).toBe(true);
        expect(TreeGridObj.toolbarModule.getToolbar().querySelector("#" + TreeGridObj.element.id + '_gridcontrol_outdent').parentElement.classList.contains("e-hidden")).toBe(true);
        done();
      };
      TreeGridObj.rowDeselected = rowDeselected;
      TreeGridObj.selectRow(2);
      TreeGridObj.clearSelection();
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('EJ2-58197 - Indent/Outdent functionality without allowRowDragandDrop property', () => {
    let TreeGridObj: TreeGrid;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: "subtasks",
          treeColumnIndex: 1,
          toolbar: ['Indent', 'Outdent'],
          columns: [
            { field: "TaskID", headerText: "Task Id", isPrimaryKey: true, width: 90 },
            { field: 'TaskName', headerText: 'TaskName', width: 60 },
            { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 },
          ],
        },done); 
      });

    it('Checking Indent/Outdent functionality', (done: Function) => {
      TreeGridObj.selectRow(2);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_indent' } });
      expect((TreeGridObj.grid.dataSource[1] as ITreeData).childRecords.length).toBe(1);
      done();
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  it('memory leak', () => {
    profile.sample();
    let average: any = inMB(profile.averageChange)
    //Check average change in memory samples to not be over 10MB
    expect(average).toBeLessThan(10);
    let memory: any = inMB(getMemoryProfile())
    //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    expect(memory).toBeLessThan(profile.samples[0] + 0.25);
});
});

describe('Newly added bottom record get indented', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData.slice(0,1),
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400, 
                selectedRowIndex: 2,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    newRowPosition: 'Bottom'
                },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    {
                        field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right',
                        validationRules: { required: true, number: true}, width: 90
                    },
                    { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220, validationRules: {required: true}, showCheckbox: true },
                    {
                        field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100, editType: 'numericedit',
                        validationRules: { number: true, min: 0}, edit: { params: {  format: 'n'}}
                    }
                ]
            },
            done
        );
    });

    it('Indent', (done: Function) => {
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        let formEle: HTMLFormElement = gridObj.grid.editModule.formObj.element;
        (select('#' + gridObj.grid.element.id + 'taskID', formEle) as any).value = '124';
        (select('#' + gridObj.grid.element.id + 'taskName', formEle) as any).value = 'fourth';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        expect((gridObj.getCurrentViewRecords()[5] as any).level).toBe(0);
        done();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
