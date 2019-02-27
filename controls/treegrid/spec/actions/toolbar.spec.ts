import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { projectData } from '../base/datasource.spec';
import { ToolbarItem } from '../../src/treegrid/enum';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { profile, inMB, getMemoryProfile } from '../common.spec';


/**
 * Grid Toolbar spec 
 */
TreeGrid.Inject(Toolbar);
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

