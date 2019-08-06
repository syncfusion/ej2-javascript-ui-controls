import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { employeeData } from '../base/datasource.spec';
import { Sort } from '../../src/treegrid/actions/sort';
import { Page } from '../../src/treegrid/actions/page';
import { Filter } from '../../src/treegrid/actions/filter';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { ContextMenu } from '../../src/treegrid/actions/context-menu';
import { CellSaveEventArgs,  } from '../../src';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { dataBound, actionFailure } from '@syncfusion/ej2-grids';


TreeGrid.Inject(Sort, Page, Filter, Toolbar, ContextMenu);
let template : string = `<tr>
    <div>
    <td class="photo">
                \${EmployeeID}<img src="" alt="\${EmployeeID}" />
                </td>
            <td class="photo">
                <img src="" alt="\${EmployeeID}" />
            </td></div>
            <td class="details">
                <table class="CardTable" cellpadding="3" cellspacing="2">
                    <colgroup>
                        <col width="50%">
                        <col width="50%">
                    </colgroup>
                    <tbody>
                        <tr>
                            <td class="CardHeader">FullName </td>
                            <td>\${FullName} </td>
                        </tr>
                        <tr>
                            <td class="CardHeader">Designation</td>
                            <td>\${Designation} </td>
                        </tr>
                        <tr>
                            <td class="CardHeader">Address
                            </td>
    
                            <td>\${Address}
                            </td>
                        </tr>
                        <tr>
                            <td class="CardHeader">Country
                            </td>
                            <td>\${Country}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
         </tr>`;

         let altrowtemplate : string = `<tr>
         <div>
             <td class="photo">
                 \${FullName}
                 </td>
             <td class="photo">
                 <img src="" alt="\${EmployeeID}" />
             </td></div>
             <td class="details">
                 <table class="CardTable" cellpadding="3" cellspacing="2">
                     <colgroup>
                         <col width="50%">
                         <col width="50%">
                     </colgroup>
                     <tbody>
                         <tr>
                             <td class="CardHeader">FullName </td>
                             <td>\${FullName} </td>
                         </tr>
                         <tr>
                             <td class="CardHeader">Designation</td>
                             <td>\${Designation} </td>
                         </tr>
                         <tr>
                             <td class="CardHeader">Address
                             </td>
     
                             <td>\${Address}
                             </td>
                         </tr>
                         <tr>
                             <td class="CardHeader">Country
                             </td>
                             <td>\${Country}
                             </td>
                         </tr>
                     </tbody>
                 </table>
             </td>
          </tr>`;


describe('Render rowtemplate', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
    let dataBound: () => void;
    let actionFailure: () => void;
    beforeAll((done: Function) => {
        
      gridObj = createGrid(
        {
            dataSource: employeeData,
            rowTemplate: template,
            childMapping: "Children",
            allowResizing: true,
            allowSorting: true,
            toolbar: ['Search'],
            allowPaging:true,
            allowFiltering: true,
            pageSettings: {pageSize: 7, pageSizes: true},
            sortSettings: { columns: [{ field: 'EmployeeID', direction: 'Ascending' }] },
            treeColumnIndex: 0,
            columns: [
                {field:'EmployeeID', width: 150, textAlign: 'Center'},
                { headerText: 'Employee Image', width: 150, textAlign: 'Center', field: 'OrderID' },
                { headerText: 'Employee Details', width: 300, field:'EmployeeID'}
            ],
            height: 315
        },
        done
      );
    });
    it('Render the row template', () => {
        expect(gridObj.getRows()[0].querySelectorAll('td')[2].classList.contains("details")).toBe(true);
     });
     it('onpropertychange set null value', function () {
        gridObj.rowTemplate = null;
        expect((gridObj.getRows()[0].firstChild as HTMLElement).innerText == "EMP001").toBe(true);
    });
    it('onpropertychange alt id', function (done: Function) {
        dataBound = (args?: Object): void => {
            expect((gridObj.getRows()[0].getElementsByClassName('photo')[0] as HTMLElement).innerText == "RobertKing").toBe(true);
            done();
        }
        gridObj.dataBound = dataBound;
        gridObj.rowTemplate = altrowtemplate;
    });
        afterAll(() => {
        destroy(gridObj);
      });
});

describe('Sorting in row template', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        
      gridObj = createGrid(
        {
            dataSource: employeeData,
            rowTemplate: template,
            childMapping: "Children",
            allowResizing: true,
            allowSorting: true,
            pageSettings: {pageSize: 7, pageSizes: true},
            sortSettings: { columns: [{ field: 'EmployeeID', direction: 'Ascending' }] },
            treeColumnIndex: 0,
            columns: [
                {field:'EmployeeID', width: 150, textAlign: 'Center'},
                { headerText: 'Employee Image', width: 150, textAlign: 'Center', field: 'OrderID' },
                { headerText: 'Employee Details', width: 300, field:'EmployeeID'}
            ],
            height: 315
        },
        done
      );
    });
    it('Sorting the column', (done: Function) => {
        actionComplete = (args?: Object): void => {
           expect((gridObj.getRows()[0].getElementsByClassName('photo')[0].querySelector("div>.e-treecell") as HTMLElement).innerText == "EMP675").toBe(true);
           expect((gridObj.getRows()[1].getElementsByClassName('photo')[0].querySelector("div>.e-treecell") as HTMLElement).innerText == "EMP712").toBe(true);
           expect((gridObj.getRows()[2].getElementsByClassName('photo')[0].querySelector("div>.e-treecell") as HTMLElement).innerText == "EMP710").toBe(true);
           expect((gridObj.getRows()[3].getElementsByClassName('photo')[0].querySelector("div>.e-treecell") as HTMLElement).innerText == "EMP676").toBe(true);
           done();
        }
      gridObj.sortByColumn("EmployeeID", "Descending", true);
      gridObj.grid.actionComplete = actionComplete;
        });
        afterAll(() => {
        destroy(gridObj);
      });
});

describe('Paging in row template', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        
      gridObj = createGrid(
        {
            dataSource: employeeData,
            rowTemplate: template,
            childMapping: "Children",
            allowResizing: true,
            allowPaging:true,
            pageSettings: {pageSize: 7, pageSizes: true},
            treeColumnIndex: 0,
            columns: [
                {field:'EmployeeID', width: 150, textAlign: 'Center'},
                { headerText: 'Employee Image', width: 150, textAlign: 'Center', field: 'OrderID' },
                { headerText: 'Employee Details', width: 300, field:'EmployeeID'}
            ],
            height: 315
        },
        done
      );
    });
    it('check the pagesize', (done: Function) => {
       expect(gridObj.getRows().length).toBe(7);
       done();
    });
        afterAll(() => {
        destroy(gridObj);
      });
});

describe('Searching in rowtemplate', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        
      gridObj = createGrid(
        {
            dataSource: employeeData,
            rowTemplate: template,
            childMapping: "Children",
            allowResizing: true,
            toolbar: ['Search'],
            allowPaging:true,
            pageSettings: {pageSize: 7, pageSizes: true},
            treeColumnIndex: 0,
            columns: [
                {field:'EmployeeID', width: 150, textAlign: 'Center'},
                { headerText: 'Employee Image', width: 150, textAlign: 'Center', field: 'OrderID' },
                { headerText: 'Employee Details', width: 300, field:'EmployeeID'}
            ],
            height: 315
        },
        done
      );
    });
    it('Check the search records', (done: Function) => {
        actionComplete = (args?: Object): void => {
        expect((gridObj.getRows()[0].getElementsByClassName('photo')[0].querySelector("div>.e-treecell") as HTMLElement).innerText == "EMP675").toBe(true);
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.search("EMP675");
    });
        afterAll(() => {
        destroy(gridObj);
      });
});

describe('Filter in rowtemplate', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        
      gridObj = createGrid(
        {
            dataSource: employeeData,
            rowTemplate: template,
            childMapping: "Children",
            allowResizing: true,
            allowFiltering: true,
            pageSettings: {pageSize: 7, pageSizes: true},
            treeColumnIndex: 0,
            columns: [
                {field:'EmployeeID', width: 150, textAlign: 'Center'},
                { headerText: 'Employee Image', width: 150, textAlign: 'Center', field: 'OrderID' },
                { headerText: 'Employee Details', width: 300, field:'EmployeeID'}
            ],
            height: 315
        },
        done
      );
    });
    it('Check the filered records', (done: Function) => {
        actionComplete = (args?: Object): void => {
        expect((gridObj.getRows()[0].getElementsByClassName('photo')[0].querySelector("div>.e-treecell") as HTMLElement).innerText == "EMP675").toBe(true);
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn("EmployeeID","contains","EMP675");
    });
        afterAll(() => {
        destroy(gridObj);
      });
});

describe('Contextmenu in row template', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        
      gridObj = createGrid(
        {
            dataSource: employeeData,
            rowTemplate: template,
            childMapping: "Children",
            allowResizing: true,
            allowSorting: true,
            sortSettings: { columns: [{ field: 'EmployeeID', direction: 'Ascending' }] },
            contextMenuItems: ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending','Edit', 'Delete', 'Save', 'Cancel', 'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage', 'LastPage', 'NextPage'],
            pageSettings: {pageSize: 7, pageSizes: true},
            treeColumnIndex: 0,
            columns: [
                {field:'EmployeeID', width: 150, textAlign: 'Center'},
                { headerText: 'Employee Image', width: 150, textAlign: 'Center', field: 'OrderID' },
                { headerText: 'Employee Details', width: 300, field:'EmployeeID'}
            ],
            height: 315
        },
        done
      );
    });
    it('Sort context menu in th ', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect((gridObj.getRows()[0].getElementsByClassName('photo')[0].querySelector("div>.e-treecell") as HTMLElement).innerText == "EMP675").toBe(true);
             done();
            }
         gridObj.actionComplete = actionComplete;
        setTimeout(function () {
            (gridObj.grid.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e: Object = {
                event: (gridObj.grid.contextMenuModule as any).eventArgs,
                items: gridObj.grid.contextMenuModule.contextMenu.items,
                parentItem: gridObj.element.querySelector('th'), element: document.getElementById(gridObj.element.id + '_gridcontrol_cmenu')
            };
            (gridObj.grid.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.grid.contextMenuModule as any).contextMenuOpen();
            (<HTMLElement>document.getElementById(gridObj.element.id + '_gridcontrol_cmenu').getElementsByClassName('e-icon-descending')[0]).click();
        }, 100)
    });
        afterAll(() => {
        destroy(gridObj);
      });
});

describe('Check the row databound in row template', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;
    let rowDataBound: () => void;
    beforeAll((done: Function) => {
        
      gridObj = createGrid(
        {
            dataSource: employeeData,
            rowTemplate: template,
            childMapping: "Children",
            allowResizing: true,
            allowSorting: true,
            pageSettings: {pageSize: 7, pageSizes: true},
            sortSettings: { columns: [{ field: 'EmployeeID', direction: 'Ascending' }] },
            treeColumnIndex: 0,
            columns: [
                {field:'EmployeeID', width: 150, textAlign: 'Center'},
                { headerText: 'Employee Image', width: 150, textAlign: 'Center', field: 'OrderID' },
                { headerText: 'Employee Details', width: 300, field:'EmployeeID'}
            ],
            height: 315
        },
        done
      );
    });
    it('Sorting the column', (done: Function) => {
        rowDataBound = (args?: any): void => {
            if(gridObj.sortSettings.columns[0].direction == "Descending"){
           expect(!isNullOrUndefined(args.data)).toBe(true);
           done();
            }
        }
        gridObj.grid.rowDataBound = rowDataBound;
        gridObj.sortByColumn("EmployeeID", "Descending", true);
        });
        afterAll(() => {
        destroy(gridObj);
      });
});