import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData } from '../base/datasource.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ContextMenu } from '../../src/treegrid/actions/context-menu';
/**
 * Grid base spec 
 */
TreeGrid.Inject(ContextMenu);
describe('ContextMenu module', () => {
  describe('Default context menu', () => {
    let gridObj: TreeGrid;

    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          contextMenuItems: ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                  'Edit', 'Delete', 'Save', 'Cancel',
                  'ExcelExport', 'FirstPage', 'PrevPage',
                  'LastPage', 'NextPage', 'AddRow'],
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });
    it('Check the filered records for parent mode', () => {
        expect((gridObj.grid.contextMenuModule as any).element).not.toBe(null);
    });
    it ('Context menu property changes', () => {
        (gridObj.grid.contextMenuModule as any).eventArgs =  { target: gridObj.getContentTable().querySelector('tr') };
        let e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        let addrow: HTMLElement = document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            .querySelector('#' + gridObj.element.id + '_gridcontrol_cmenu_AddRow');
        expect(addrow.style.display).toBe('none');
        (gridObj.grid.contextMenuModule as any).contextMenuOnClose(e);
        gridObj.grid.editSettings.allowAdding = true;
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        expect(addrow.style.display).toBe('block');
        (gridObj.grid.contextMenuModule as any).contextMenuOnClose(e);
        gridObj.contextMenuItems = [{text: 'Expand all', target: '.e-content', id: 'expandall'}];
        gridObj.dataBind();
        expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu').querySelector('#expandall')).not.toBe(null);
        expect(gridObj.contextMenuModule.getContextMenu()).not.toBe(null);
        gridObj.contextMenuModule.destroy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('context menu without addrow ', () => {
    let gridObj: TreeGrid;

    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          contextMenuItems: ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
                  'Edit', 'Delete', 'Save', 'Cancel',
                  'ExcelExport', 'FirstPage', 'PrevPage',
                  'LastPage', 'NextPage'],
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });
    it ('Context menu items check', () => {
        let addrow: string = '#' + gridObj.element.id + '_gridcontrol_cmenu_AddRow';
        (gridObj.grid.contextMenuModule as any).eventArgs =  { target: gridObj.getContentTable().querySelector('tr') };
        let e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        expect(document.getElementById(gridObj.element.id + '_gridcontrol_cmenu').querySelector('addrow')).toBe(null);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
});
