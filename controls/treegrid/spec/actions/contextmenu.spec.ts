import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData } from '../base/datasource.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ContextMenu } from '../../src/treegrid/actions/context-menu';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { CellSaveEventArgs,  } from '../../src';
import{ L10n, select } from '@syncfusion/ej2-base';
import { CellEditArgs } from '@syncfusion/ej2-grids';

/**
 * Grid base spec
 */
TreeGrid.Inject(ContextMenu);
describe('ContextMenu module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

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
        let addrow: HTMLElement = select('#' + gridObj.element.id + '_gridcontrol_cmenu_AddRow',
                                         document.getElementById(gridObj.element.id + '_gridcontrol_cmenu'));
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
  describe('Add new row with AddRow - Above', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: CellSaveEventArgs) => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          allowExcelExport: true,
          allowPdfExport: true,
          allowSorting: true,
          childMapping: 'subtasks',
          allowPaging: true,
          pageSettings: { pageSize: 10 },
          treeColumnIndex: 1,
          editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Row', newRowPosition: 'Below' },
          contextMenuItems: ['SortAscending', 'SortDescending',
               'Edit', 'Delete', 'Save', 'Cancel',
              'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
              'LastPage', 'NextPage', "AddRow"],
              toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
              { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
              { field: 'taskName', headerText: 'Task Name', width: 190 },
              { field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 90,
                  editType: 'datepickeredit', textAlign: 'Right' },
              { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 90, editType: 'datepickeredit', textAlign: 'Right' },
              { field: 'duration', headerText: 'Duration', width: 85, textAlign: 'Right', editType: 'numericedit',
                   edit: {params: {format: 'n'}} },
              { field: 'priority', headerText: 'Priority', width: 80 }
          ],
        },
        done
      );
    });
    it('Add new row with AddRow - Above', (done: Function) => {
      gridObj.selectRow(2);
        actionComplete = (args: CellSaveEventArgs): void => {
          if(args.requestType === 'add'){
          expect((<any>gridObj.getContentTable().querySelectorAll(".e-addedrow")[0]).rowIndex === 2).toBe(true);
          }
          done();
         }
         gridObj.actionComplete = actionComplete;
        (gridObj.grid.contextMenuModule as any).eventArgs =  { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
        let e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        document.getElementsByClassName('e-menu-item')[10].dispatchEvent(new Event('mouseover'));
        var mouseEve = document.createEvent('MouseEvents');
        mouseEve.initEvent('mouseover', true, true);
        document.getElementsByClassName('e-menu-item')[10].dispatchEvent(mouseEve);
        (<HTMLElement>document.getElementsByClassName('e-menu-parent e-ul ')[0].children[0]).click();
    });
    it('Save the added row', (done: Function) => {
      actionComplete = (args: CellSaveEventArgs): void => {
        if(args.requestType === 'save'){
          expect(gridObj.getRows()[2].querySelector('td').innerText === '44').toBe(true);
        }
        done();
       }
       gridObj.actionComplete = actionComplete;
       (<any>gridObj.getContentTable().getElementsByClassName('e-numerictextbox')[0]).ej2_instances[0].value = '44';
       (<HTMLElement>gridObj.element.getElementsByClassName('e-tbar-btn-text')[2]).click();
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Add new row with AddRow - Below', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: CellSaveEventArgs) => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          allowExcelExport: true,
          allowPdfExport: true,
          allowSorting: true,
          childMapping: 'subtasks',
          allowPaging: true,
          pageSettings: { pageSize: 10 },
          treeColumnIndex: 1,
          editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Row', newRowPosition: 'Below' },
          contextMenuItems: ['SortAscending', 'SortDescending',
               'Edit', 'Delete', 'Save', 'Cancel',
              'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
              'LastPage', 'NextPage', "AddRow"],
              toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
              { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
              { field: 'taskName', headerText: 'Task Name', width: 190 },
              { field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 90,
                  editType: 'datepickeredit', textAlign: 'Right' },
              { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 90, editType: 'datepickeredit', textAlign: 'Right' },
              { field: 'duration', headerText: 'Duration', width: 85, textAlign: 'Right', editType: 'numericedit',
                   edit: {params: {format: 'n'}} },
              { field: 'priority', headerText: 'Priority', width: 80 }
          ],
        },
        done
      );
    });
    it('Add new row with AddRow - Below', (done: Function) => {
        gridObj.selectRow(2);
        actionComplete = (args: CellSaveEventArgs): void => {
          if(args.requestType === 'add'){
          expect((<any>gridObj.getContentTable().querySelectorAll(".e-addedrow")[0]).rowIndex === 3).toBe(true);
          }
          done();
         }
         gridObj.actionComplete = actionComplete;
        (gridObj.grid.contextMenuModule as any).eventArgs =  { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
        let e: Object = {
            event: (gridObj.grid.contextMenuModule as any).eventArgs,
            items: gridObj.grid.contextMenuModule.contextMenu.items,
            parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        document.getElementsByClassName('e-menu-item')[10].dispatchEvent(new Event('mouseover'));
        var mouseEve = document.createEvent('MouseEvents');
        mouseEve.initEvent('mouseover', true, true);
        document.getElementsByClassName('e-menu-item')[10].dispatchEvent(mouseEve);
        (<HTMLElement>document.getElementsByClassName('e-menu-parent e-ul ')[0].children[1]).click();
    });
    it('Save the added row', (done: Function) => {
      actionComplete = (args: CellSaveEventArgs): void => {
        if(args.requestType === 'save'){
          expect(gridObj.getRows()[3].getElementsByTagName('td')[0].innerText === '55').toBe(true);
        }
        done();
       }
       gridObj.actionComplete = actionComplete;
       (<any>gridObj.getContentTable().getElementsByClassName('e-numerictextbox')[0]).ej2_instances[0].value = '55';
       (<HTMLElement>gridObj.element.getElementsByClassName('e-tbar-btn-text')[2]).click();
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Check whether Edit Record is hidden in Edit Mode set as Cell', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: CellSaveEventArgs) => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          allowExcelExport: true,
          allowPdfExport: true,
          allowSorting: true,
          childMapping: 'subtasks',
          allowPaging: true,
          pageSettings: { pageSize: 10 },
          treeColumnIndex: 1,
          editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Cell' },
          contextMenuItems: ['SortAscending', 'SortDescending',
               'Edit', 'Delete', 'Save', 'Cancel',
              'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
              'LastPage', 'NextPage', "AddRow"],
              toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          columns: [
              { field: 'taskID', headerText: 'Task ID', width: 80, isPrimaryKey: true, textAlign: 'Right', editType: 'numericedit' },
              { field: 'taskName', headerText: 'Task Name', width: 190 },
              { field: 'startDate', headerText: 'Start Date', format: 'yMd', width: 90,
                  editType: 'datepickeredit', textAlign: 'Right' },
              { field: 'endDate', headerText: 'End Date', format: 'yMd', width: 90, editType: 'datepickeredit', textAlign: 'Right' },
              { field: 'duration', headerText: 'Duration', width: 85, textAlign: 'Right', editType: 'numericedit',
                   edit: {params: {format: 'n'}} },
              { field: 'priority', headerText: 'Priority', width: 80 }
          ],
        },
        done
      );
    });
    it('Check whether Edit Record is hidden in Edit Mode set as Cell', () => {
      gridObj.selectRow(2);
      (gridObj.grid.contextMenuModule as any).eventArgs =  { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
      let e: Object = {
        event: (gridObj.grid.contextMenuModule as any).eventArgs,
        items: gridObj.grid.contextMenuModule.contextMenu.items,
        parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
      };
      (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
      (gridObj.grid.contextMenuModule as any).contextMenuOpen();
      let editRecord: HTMLElement = select('#' + gridObj.element.id + '_gridcontrol_cmenu_Edit',
                                           document.getElementById(gridObj.element.id + '_gridcontrol_cmenu'));
      expect(editRecord.style.display).toBe('none');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Save after cell editing', () => {
    let gridObj: TreeGrid;
    let actionBegin: () => void;
    let actionComplete: (args: CellSaveEventArgs) => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          allowExcelExport: true,
          allowPdfExport: true,
          allowSorting: true,
          childMapping: 'subtasks',
          allowPaging: true,
          pageSettings: { pageSize: 10 },
          treeColumnIndex: 1,
          editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Cell' },
          toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
          contextMenuItems: ['SortAscending', 'SortDescending',
          'Edit', 'Delete', 'Save', 'Cancel',
         'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
         'LastPage', 'NextPage'],
         columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
              { field: 'taskName', headerText: 'Task Name' },
              { field: 'progress', headerText: 'Progress' },
              { field: 'startDate', headerText: 'Start Date' }
              ]
        },
        done
      );
    });
    it('record double click', (done: Function) => {
      gridObj.cellEdit = (args?: CellEditArgs): void => {
        expect(args.columnName).toBe('taskName');
        done();
      };
      let event: MouseEvent = new MouseEvent('dblclick', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
    });
    it('Save the cell edited record with contextmenu save', (done: Function) => {
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
      gridObj.selectRow(2);
      actionComplete = (args: CellSaveEventArgs): void => {
        if(args.type === 'save'){
          expect(gridObj.getRows()[2].querySelectorAll('td')[1].innerText == "test").toBe(true);
        }
        done();
       }
      (gridObj.grid.contextMenuModule as any).eventArgs =  { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
      let e: Object = {
        event: (gridObj.grid.contextMenuModule as any).eventArgs,
        items: gridObj.grid.contextMenuModule.contextMenu.items,
        parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
      };
      (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
      (gridObj.grid.contextMenuModule as any).contextMenuOpen();
      gridObj.actionComplete = actionComplete;
      document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Save').click();
    });
    it('DataSource check after record save using contextmenu', (done: Function) => {
       expect(gridObj.dataSource[0].subtasks[1].taskName == 'test').toBe(true);
       done();
    });
    afterAll(() => {
        destroy(gridObj);
      });
    });
    describe('Cancel after cell editing', () => {
      let gridObj: TreeGrid;
      let actionBegin: () => void;
      let actionComplete: (args: CellSaveEventArgs) => void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            allowExcelExport: true,
            allowPdfExport: true,
            allowSorting: true,
            childMapping: 'subtasks',
            allowPaging: true,
            pageSettings: { pageSize: 10 },
            treeColumnIndex: 1,
            editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Cell' },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
            contextMenuItems: ['SortAscending', 'SortDescending',
            'Edit', 'Delete', 'Save', 'Cancel',
           'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage',
           'LastPage', 'NextPage'],
           columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name' },
                { field: 'progress', headerText: 'Progress' },
                { field: 'startDate', headerText: 'Start Date' }
                ]
          },
          done
        );
      });
      it('record double click', (done: Function) => {
        gridObj.cellEdit = (args?: CellEditArgs): void => {
          expect(args.columnName).toBe('taskName');
          done();
        };
        let event: MouseEvent = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        gridObj.getCellFromIndex(2, 1).dispatchEvent(event);
      });
      it('Cancel the cell edited record with contextmenu cancel', () => {
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
        gridObj.selectRow(2);
        (gridObj.grid.contextMenuModule as any).eventArgs =  { target: gridObj.getContentTable().querySelectorAll('tr')[2] };
        let e: Object = {
          event: (gridObj.grid.contextMenuModule as any).eventArgs,
          items: gridObj.grid.contextMenuModule.contextMenu.items,
          parentItem: document.querySelector('tr'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
        };
        (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
        (gridObj.grid.contextMenuModule as any).contextMenuOpen();
        document.getElementById(gridObj.element.id + '_gridcontrol_cmenu_Cancel').click();
        expect(gridObj.getRows()[2].querySelectorAll('td')[1].innerText == "Plan budget").toBe(true);
      });
      afterAll(() => {
          destroy(gridObj);
        });
      });

       
  describe('Localization', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      L10n.load({
        'de-DE': {
            'treegrid': {
                AddRow: 'Voeg een rij toe',
                Above: 'Bovenstaand',
                Below: 'beneden',
            }
        }
      });
      gridObj = createGrid(
        {
          dataSource: sampleData,
          contextMenuItems:['AddRow'],
          locale: 'de-DE',
        },
        done
      );
    });
    it('render testing', () => {
     expect(document.getElementsByClassName('e-menu-item')[0].textContent).toBe('Voeg een rij toe');
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
