import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { projectData, sampleData } from '../base/datasource.spec';
import { ToolbarItem } from '../../src/treegrid/enum';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { Edit } from '../../src/treegrid/actions/edit';
import { profile, inMB, getMemoryProfile } from '../common.spec';


/**
 * Grid Toolbar spec 
 */
TreeGrid.Inject(Toolbar,Edit);
describe('TreeGrid Toolbar module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
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
        (formEle.querySelector('#' + gridObj.grid.element.id + 'taskID') as any).value = '124';
        (formEle.querySelector('#' + gridObj.grid.element.id + 'taskName') as any).value = 'fourth';
        (formEle.querySelector('#' + gridObj.grid.element.id + 'startDate') as any).value = '2/3/2017';
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
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.grid.element.id + '_collapseall')).click();
        expect((<HTMLTableRowElement>gridObj.getRows()[1]).style.display).toBe('none');
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.grid.element.id + '_expandall')).click();
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
