import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { QueryCellInfoEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { VirtualScroll } from '../../src/treegrid/actions/virtual-scroll';
import { virtualData, editVirtualData, dataSource, addVirtualData, dataSource1 } from '../base/datasource.spec';
import { Edit } from '../../src/treegrid/actions/edit';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { select } from '@syncfusion/ej2-base';
import { RowDD } from '../../src/treegrid/actions/rowdragdrop';
import { Sort } from '../../src/treegrid/actions/sort';
import { Filter } from '../../src/treegrid/actions/filter';
import { ITreeData } from '../../src/treegrid/base/interface';

/**
 * TreeGrid Virtual Scroll spec 
 */

TreeGrid.Inject(VirtualScroll, Edit, Toolbar, Sort, Filter, RowDD);

if(!editVirtualData.length){
    dataSource();
}

describe('TreeGrid Virtual Scroll', () => {
  describe('Rendering and basic actions', () => {
    let treegrid: TreeGrid;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
        {
          dataSource: virtualData.slice(0,1000),
          parentIdMapping: 'ParentID',
          idMapping: 'TaskID',
          height: 200,
          enableVirtualMaskRow: false,
          
    queryCellInfo: (args: QueryCellInfoEventArgs) => {
        if (parseInt(args.cell.innerHTML, 0) > 1000) {
         let x: HTMLElement = document.createElement('IMG');
         x.setAttribute('height', '15px');
         let span: HTMLElement = document.createElement('span');
         span.innerHTML = args.cell.innerHTML;
         span.setAttribute('style', 'padding-left:7px;');
         args.cell.innerHTML = '';
         args.cell.appendChild(x);
         args.cell.setAttribute('style', 'background-color:#7b2b1d;color:white;');
         args.cell.appendChild(span);
        } else if (parseInt(args.cell.innerHTML, 0) > 500) {
         let y: HTMLElement = document.createElement('IMG');
         y.setAttribute('height', '15px');
         let span: HTMLElement = document.createElement('span');
         span.innerHTML = args.cell.innerHTML;
         span.setAttribute('style', 'padding-left:7px;');
         args.cell.innerHTML = '';
         args.cell.appendChild(y);
         args.cell.setAttribute('style', 'background-color:#7b2b1d;color:white;');
         args.cell.appendChild(span);
        } else if (parseInt(args.cell.innerHTML, 0) > 250) {
         let z: HTMLElement = document.createElement('IMG');
         z.setAttribute('height', '15px');
         let span: HTMLElement = document.createElement('span');
         span.innerHTML = args.cell.innerHTML;
         span.setAttribute('style', 'padding-left:7px;');
         args.cell.innerHTML = '';
         args.cell.appendChild(z);
         args.cell.setAttribute('style', 'background-color:#336c12;color:white;');
         args.cell.appendChild(span);
        } else if (parseInt(args.cell.innerHTML, 0) > 100) {
         let a: HTMLElement = document.createElement('IMG');
         a.setAttribute('height', '15px');
         let span: HTMLElement = document.createElement('span');
         span.innerHTML = args.cell.innerHTML;
         span.setAttribute('style', 'padding-left:7px;');
         args.cell.innerHTML = '';
         args.cell.appendChild(a);
         args.cell.setAttribute('style', 'background-color:#336c12;color:white;');
         args.cell.appendChild(span);
        }
     },
            enableVirtualization: true,
            columns: [{ field: 'FIELD1', headerText: 'Player Name', width: 140 },
            { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
            { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
            { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
            { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
            { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
            { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
            { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' },
            { field: 'FIELD10', headerText: 'oRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD11', headerText: 'dRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD12', headerText: 'Rebounds', width: 120, textAlign: 'Right' },
            { field: 'FIELD13', headerText: 'Assists', width: 120, textAlign: 'Right' },
            { field: 'FIELD14', headerText: 'Steals', width: 120, textAlign: 'Right' },
            { field: 'FIELD15', headerText: 'Blocks', width: 120, textAlign: 'Right' },
            { field: 'FIELD16', headerText: 'Turnovers', width: 130, textAlign: 'Right' },
            { field: 'FIELD17', headerText: 'PF', width: 130, textAlign: 'Right' },
            { field: 'FIELD18', headerText: 'fgAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD19', headerText: 'fgMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD20', headerText: 'ftAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD21', headerText: 'ftMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD22', headerText: 'ThreeAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD23', headerText: 'ThreeMade', width: 130, textAlign: 'Right' },
            { field: 'FIELD24', headerText: 'PostGP', width: 120, textAlign: 'Right' },
            { field: 'FIELD25', headerText: 'PostGS', width: 120, textAlign: 'Right' },
            { field: 'FIELD26', headerText: 'PostMinutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD27', headerText: 'PostPoints', width: 130, textAlign: 'Right' },
            { field: 'FIELD28', headerText: 'PostoRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD29', headerText: 'PostdRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD30', headerText: 'PostRebounds', width: 130, textAlign: 'Right' }],
            treeColumnIndex: 1
        },
        done
      );
    });
    it('rendering test', (done: Function) => {
        expect(treegrid.getRows().length).toBe(20);
        expect(treegrid.getRows()[0].querySelectorAll('td')[2].getAttribute('style')).toBe('background-color:#336c12;color:white;');
        expect(!isNullOrUndefined(treegrid.getRows()[0].querySelectorAll('td')[1].querySelector('.e-icons.e-treegridexpand'))).toBe(true);
        done();
    });
    it('collapse test', (done: Function) => {
        let len: number = 0;
        collapsed = (args?: any) => {
            let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
        }
        treegrid.collapsed = collapsed;
        treegrid.collapseAll();
    });
    it('expand test', (done: Function) => {
        expanded = (args?: any) => {
            expect(isNullOrUndefined(treegrid.getRows()[1].querySelector('.e-treegridexpand'))).toBe(true);
            treegrid.expanded = null;
            done();
        }
        treegrid.expanded = expanded;
        treegrid.expandAll();
    });
    it('collapse test before scroll', (done: Function) => {
        let len: number = 0;
        collapsed = (args?: any) => {
            let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
        }
        treegrid.collapsed = collapsed;
        treegrid.collapseAll();
    });
    it('Scrolling continous', (done: Function) => {
        let content: HTMLElement = (<HTMLElement>treegrid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 10;
        content.scrollTop = 1000;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 500);
        done();
    }) 
    it('collapse test after scroll', (done: Function) => {
        let len: number = 0;
        let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
    });
    it('expandAtLevel() test', (done: Function) => {
        expanded = (args?: any) => {
            expect(isNullOrUndefined(treegrid.getRows()[1].querySelector('.e-treegridexpand'))).toBe(true);
            treegrid.expanded = null;
            done();
        }
        treegrid.expanded = expanded;
        treegrid.expandAtLevel(0);
    });
    it('collapseAtLevel test', (done: Function) => {
        let len: number = 0;
        collapsed = (args?: any) => {
            let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
        }
        treegrid.collapsed = collapsed;
        treegrid.collapseAtLevel(0);
    });    
    it('Scrolling up continous', (done: Function) => {
        let content: HTMLElement = (<HTMLElement>treegrid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 0;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 500);
        done();
    }) 
    afterAll(() => {
      destroy(treegrid);
    });
  });
  describe('Scroll Down with CollapseAll', () => {
    let treegrid: TreeGrid;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        treegrid = createGrid(
            {
              dataSource: virtualData.slice(0,1000),
              parentIdMapping: 'ParentID',
              idMapping: 'TaskID',
              enableVirtualMaskRow: false,
              height: 200,
              enableVirtualization: true,
            columns: [{ field: 'FIELD1', headerText: 'Player Name', width: 140 },
            { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
            { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
            { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
            { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
            { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
            { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
            { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' },
            { field: 'FIELD10', headerText: 'oRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD11', headerText: 'dRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD12', headerText: 'Rebounds', width: 120, textAlign: 'Right' },
            { field: 'FIELD13', headerText: 'Assists', width: 120, textAlign: 'Right' },
            { field: 'FIELD14', headerText: 'Steals', width: 120, textAlign: 'Right' },
            { field: 'FIELD15', headerText: 'Blocks', width: 120, textAlign: 'Right' },
            { field: 'FIELD16', headerText: 'Turnovers', width: 130, textAlign: 'Right' },
            { field: 'FIELD17', headerText: 'PF', width: 130, textAlign: 'Right' },
            { field: 'FIELD18', headerText: 'fgAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD19', headerText: 'fgMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD20', headerText: 'ftAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD21', headerText: 'ftMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD22', headerText: 'ThreeAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD23', headerText: 'ThreeMade', width: 130, textAlign: 'Right' },
            { field: 'FIELD24', headerText: 'PostGP', width: 120, textAlign: 'Right' },
            { field: 'FIELD25', headerText: 'PostGS', width: 120, textAlign: 'Right' },
            { field: 'FIELD26', headerText: 'PostMinutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD27', headerText: 'PostPoints', width: 130, textAlign: 'Right' },
            { field: 'FIELD28', headerText: 'PostoRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD29', headerText: 'PostdRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD30', headerText: 'PostRebounds', width: 130, textAlign: 'Right' }],
            treeColumnIndex: 1
        },
        done
      );
    });
    it('rendering test', (done: Function) => {
        expect(treegrid.getRows().length).toBe(20);
        done();
    });
    it('collapseAll after scroll', (done: Function) => {
        let rows: HTMLTableRowElement[] = treegrid.getRows();
        let content: HTMLElement = (<HTMLElement>treegrid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 20000;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 1000);
        let len: number = 0;
        collapsed = (args?: any) => {
            let rows: HTMLTableRowElement[] = treegrid.getRows();
            for (let n: number = 0; n < rows.length; n++) {
                if (!isNullOrUndefined(rows[n].querySelector('.e-treegridcollapse'))) {
                    len = len + 1;
                }
            }
            expect(len).toBe(20);
            treegrid.collapsed = null;
            done();
        }
        treegrid.collapseAll();
        expect(treegrid.getCurrentViewRecords().length > 0).toBe(true);
        done();
    }) 
    afterAll(() => {
      destroy(treegrid);
    });
  });
  describe('Height 100%', () => {
    let treegrid: TreeGrid;
    let rows: Element[];
    let expanded: () => void;
    let collapsed: () => void;
    let rowSelected: () => void;
    let dataBound: () => void;
    document.body.style.height = '600px';
    beforeAll((done: Function) => {
        treegrid = createGrid(
            {
              dataSource: virtualData.slice(0,1000),
              parentIdMapping: 'ParentID',
              idMapping: 'TaskID',
              height: '100%',
              enableVirtualization: true,
            columns: [{ field: 'FIELD1', headerText: 'Player Name', width: 140 },
            { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
            { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
            { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
            { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
            { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
            { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
            { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' },
            { field: 'FIELD10', headerText: 'oRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD11', headerText: 'dRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD12', headerText: 'Rebounds', width: 120, textAlign: 'Right' },
            { field: 'FIELD13', headerText: 'Assists', width: 120, textAlign: 'Right' },
            { field: 'FIELD14', headerText: 'Steals', width: 120, textAlign: 'Right' },
            { field: 'FIELD15', headerText: 'Blocks', width: 120, textAlign: 'Right' },
            { field: 'FIELD16', headerText: 'Turnovers', width: 130, textAlign: 'Right' },
            { field: 'FIELD17', headerText: 'PF', width: 130, textAlign: 'Right' },
            { field: 'FIELD18', headerText: 'fgAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD19', headerText: 'fgMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD20', headerText: 'ftAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD21', headerText: 'ftMade', width: 120, textAlign: 'Right' },
            { field: 'FIELD22', headerText: 'ThreeAttempted', width: 150, textAlign: 'Right' },
            { field: 'FIELD23', headerText: 'ThreeMade', width: 130, textAlign: 'Right' },
            { field: 'FIELD24', headerText: 'PostGP', width: 120, textAlign: 'Right' },
            { field: 'FIELD25', headerText: 'PostGS', width: 120, textAlign: 'Right' },
            { field: 'FIELD26', headerText: 'PostMinutes', width: 120, textAlign: 'Right' },
            { field: 'FIELD27', headerText: 'PostPoints', width: 130, textAlign: 'Right' },
            { field: 'FIELD28', headerText: 'PostoRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD29', headerText: 'PostdRebounds', width: 130, textAlign: 'Right' },
            { field: 'FIELD30', headerText: 'PostRebounds', width: 130, textAlign: 'Right' }],
            treeColumnIndex: 1
        },
        done
      );
    });
    it('rendering test', () => {
        dataBound = (args?: any) => {
           expect(treegrid.getRows().length > 12).toBe(true);
        }
    });
    afterAll(() => {
      destroy(treegrid);
    });
  });


  describe('Row Editing with Virtual Scrolling', () => {
    let gridObj: TreeGrid;
    let rowIndex: number;
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Add','Edit','Update','Delete','Cancel'],               
                editSettings:{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row', newRowPosition: 'Below' },
                childMapping: 'Crew',
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Rendering Test', (done: Function) => {
        expect(gridObj.getRows().length > 12).toBe(true);
        done();
    })
    
    it('Edit Start in Current View Records', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'beginEdit') {                
                expect(gridObj.grid.element.querySelectorAll('.e-editedrow').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);
                let cells = gridObj.grid.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                expect(cells.length).toBe(gridObj.grid.columns.length);
                //primary key check
                expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                // allow Editing false
                expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                //focus check
                expect(document.activeElement.id).toBe(gridObj.grid.element.id + 'FIELD1');
                //toolbar status check
                expect(gridObj.grid.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.grid.isEdit).toBeTruthy();                
                done();
            }            
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'beginEdit') {
                expect(gridObj.grid.isEdit).toBeFalsy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        gridObj.grid.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    });

    it('Edit Complete in Current View Records', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(0);
                //updatated data cehck
                expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe('updated');
                done();
            }
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.isEdit).toBeTruthy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        (select('#' + gridObj.grid.element.id + 'FIELD1', gridObj.grid.element) as any).value = 'updated';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });

    it('Scroll', (done: Function) => {
        (<HTMLElement>gridObj.grid.getContent().firstChild).scrollTop = 1480;
        setTimeout(done, 400);
    });    

    it('Edit Start After Scroll', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'beginEdit') {                
                expect(gridObj.grid.element.querySelectorAll('.e-editedrow').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);
                let cells = gridObj.grid.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                expect(cells.length).toBe(gridObj.grid.columns.length);
                //primary key check
                expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                // allow Editing false
                expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                //focus check
                expect(document.activeElement.id).toBe(gridObj.grid.element.id + 'FIELD1');
                //toolbar status check
                expect(gridObj.grid.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.grid.isEdit).toBeTruthy();                
                done();
            }            
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'beginEdit') {
                expect(gridObj.grid.isEdit).toBeFalsy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        rowIndex = parseInt(gridObj.getRows()[0].getAttribute('data-rowindex'), 10);
        gridObj.grid.selectRow(rowIndex);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    });

    it('Edit Complete After Scroll', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(0);
                //updatated data cehck
                expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe('scroll updated');
                done();
            }
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.isEdit).toBeTruthy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        (select('#' + gridObj.grid.element.id + 'FIELD1', gridObj.grid.element) as any).value = 'scroll updated';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });


    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('Add New Row with Virtual Scrolling', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Add','Edit','Update','Delete','Cancel'],               
                editSettings:{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row'},
                childMapping: 'Crew',
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Rendering Test', (done: Function) => {
        expect(gridObj.getRows().length > 12).toBe(true);
        done();
    })
    
    it('Add New Row Begin', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'add') {                
                expect(gridObj.grid.element.querySelectorAll('.e-addedrow').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);                
                expect(document.activeElement.id).toBe(gridObj.grid.element.id + 'TaskID');
                //toolbar status check
                expect(gridObj.grid.element.querySelectorAll('.e-overlay').length).toBe(4);
                expect(gridObj.grid.isEdit).toBeTruthy();                
                done();
            }            
        };        
        gridObj.grid.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
    });

    it('Save New Row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(0);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(0);
                //updatated data cehck
                expect((gridObj.grid.currentViewData[0] as any).TaskID).toBe(98765);
                expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe('New Row');
                done();
            }
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.grid.isEdit).toBeTruthy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        (select('#' + gridObj.grid.element.id + 'TaskID', gridObj.grid.element) as any).value = '98765';
        (select('#' + gridObj.grid.element.id + 'FIELD1', gridObj.grid.element) as any).value = 'New Row';
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });  


  describe('Delete Row with Virtual Scrolling', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Add','Edit','Update','Delete','Cancel'],               
                editSettings:{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row'},
                childMapping: 'Crew',
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Rendering Test', (done: Function) => {
        expect(gridObj.getRows().length > 12).toBe(true);
        done();
    })
    
    it('Delete First Parent Row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'delete') {                
               expect((gridObj.grid.dataSource as any).length === 995).toBe(true);
               done();
            }            
        };        
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });

    it('Scroll', (done: Function) => {
        (<HTMLElement>gridObj.grid.getContent().firstChild).scrollTop = 4000;
        setTimeout(done, 400);
    });    

    it('Delete Row after Scroll', (done: Function) => {
        let isParent: boolean;
        let row: Element;
        actionComplete = (args?: any): void => {
            if (args.requestType === 'delete') {         
                if (isParent) {
                    expect((gridObj.grid.dataSource as any).length === 990).toBe(true);
                } else {
                    expect((gridObj.grid.dataSource as any).length === 994).toBe(true);
                }                
                done();
            }
        };        
        gridObj.grid.actionComplete = actionComplete;
        row = gridObj.getRows()[0];
        if(row.querySelector('.e-treegridexpand')){
            isParent = true;
        }
        gridObj.selectRow(parseInt(row.getAttribute('data-rowindex'), 10));
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });


  describe('Edit Cancel Checking', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Add','Edit','Update','Delete','Cancel'],               
                editSettings:{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row'},
                childMapping: 'Crew',
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Rendering Test', (done: Function) => {
        expect(gridObj.getRows().length > 12).toBe(true);
        done();
    })
    
    it('Edit Row', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'beginEdit') {                
                expect(gridObj.grid.element.querySelectorAll('.e-editedrow').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);
                done();
            }            
        };        
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.selectRow(1);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
    });       

    it('Cancel Edit', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'cancel') {
                //form destroy check
                expect(gridObj.grid.editModule.formObj.isDestroyed).toBeTruthy();
                expect(gridObj.grid.isEdit).toBeFalsy();
                done();
            }
        };
        actionBegin = (args?: any): void => {
            if (args.requestType === 'cancel') {
                expect(gridObj.grid.element.querySelectorAll('.e-normaledit').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.grid.element.querySelectorAll('form').length).toBe(1);
                expect(gridObj.grid.isEdit).toBeTruthy();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.grid.actionBegin = actionBegin;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_cancel' } });
    });

    afterAll(() => {
      gridObj.grid.contentModule.removeEventListener();
      destroy(gridObj);
    });
  });

  describe('EJ2-60955- The checkbox selection is not working properly while the child has an empty child array.', () => {
	if (!addVirtualData.length) {
        dataSource1();
    }
	let TreeGridObj: TreeGrid;
	let actionComplete: () => void;
	beforeAll((done: Function) => {
		TreeGridObj = createGrid(
			{
				dataSource: addVirtualData,
				enableVirtualization: true,
				allowSorting: true,
				allowFiltering: true,
				autoCheckHierarchy: true,
				childMapping: 'Crew',
				toolbar: ['Indent', 'Outdent', 'Add', 'Delete', 'Update', 'Cancel'],
				editSettings: {
					allowAdding: true,
					allowEditing: true,
					allowDeleting: true,
				},
				height: 400,
				treeColumnIndex: 1,
				columns: [
					{ field: 'TaskID', headerText: 'Player Jersey', width: 140, textAlign: 'Right', isPrimaryKey: true },
					{ field: 'FIELD1', headerText: 'Player Name', width: 140, showCheckbox: true },
					{ field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
					{ field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
					{ field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
				]
			},
			done
		);
	});

	it('Checkbox checking', () => {
		(<HTMLElement>TreeGridObj.element.querySelectorAll('.e-row')[0].getElementsByClassName('e-frame e-icons')[0] as any).click();
		expect(TreeGridObj.getCheckedRecords().length).toBe(5);
		TreeGridObj.collapseAll();
		expect(TreeGridObj.getCheckedRecords().length).toBe(5);
	});

	afterAll(() => {
		destroy(TreeGridObj);
	});
});

  describe('EJ2-58929 - Searching after scroll shows no records to display in case of Virtualization enabled', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionBegin: () => void;
    let actionComplete: () => void;    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                childMapping: 'Crew',
                enableVirtualization: true,
                enableVirtualMaskRow: false,
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: {
                  mode: 'Immediate',
                  type: 'FilterBar',
                  hierarchyMode: 'None',
                },
                toolbar: ['Search'],
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Scroll', (done: Function) => {
        let content: HTMLElement = (<HTMLElement>gridObj.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 20000;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 1000);
        done();
    });    

    it('Searching after Scroll', (done: Function) => {
        actionComplete = (args?: any): void => {
            expect(gridObj.getRows().length == 1).toBe(true);
            done();
        }
        gridObj.search("496");
        gridObj.grid.actionComplete = actionComplete;
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-59214- Row Drag And Drop support with Virtual Scrolling', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: editVirtualData,
            enableVirtualization: true,
            allowSorting: true,
            allowFiltering: true,
            enableVirtualMaskRow: false,
            childMapping: 'Crew',
            toolbar: ['Indent', 'Outdent','Add', 'Delete', 'Update', 'Cancel'],
            editSettings: {
              allowAdding: true,
              allowEditing: true,
              allowDeleting: true,
              mode: 'Cell',
              newRowPosition: 'Below'
          },
            allowRowDragAndDrop: true,
            height: 400,
            treeColumnIndex: 1,
            columns: [
              { field: 'TaskID', headerText: 'Player Jersey', width: 140, textAlign: 'Right', isPrimaryKey: true },
              { field: 'FIELD1', headerText: 'Player Name', width: 140 },
              { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
              { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
              { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
             ]
        },
        done
      );
    });

    it('Initial Row Reorder Testing for Above, Child, Below positions', () => {
      TreeGridObj.rowDragAndDropModule.reorderRows([3], 1, 'above');
      expect((TreeGridObj.flatData[1] as ITreeData)['TaskID']).toBe(4);
      TreeGridObj.rowDragAndDropModule.reorderRows([1], 2, 'child');
      expect((TreeGridObj.flatData[2] as ITreeData).childRecords.length).toBe(1);
      TreeGridObj.rowDragAndDropModule.reorderRows([3], 4, 'below');
      expect((TreeGridObj.flatData[4] as ITreeData)['TaskID']).toBe(4);
    });

    it('Scroll', (done: Function) => {
        let content: HTMLElement = (<HTMLElement>TreeGridObj.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 10;
        content.scrollTop = 2000;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 500);
        done();
    });

    it('Row Reorder Testing for Above, Child, Below positions After Scroll', () => {
        TreeGridObj.rowDragAndDropModule.reorderRows([102], 105, 'above');
        expect((TreeGridObj.flatData[104] as ITreeData)['TaskID']).toBe(103);
        TreeGridObj.rowDragAndDropModule.reorderRows([104], 106, 'child');
        expect((TreeGridObj.flatData[105] as ITreeData).childRecords.length).toBe(1);
        TreeGridObj.rowDragAndDropModule.reorderRows([101], 103, 'below');
        expect((TreeGridObj.flatData[102] as ITreeData)['TaskID']).toBe(102);
      });

      it('Filtering the column', (done: Function) => {
        TreeGridObj.filterByColumn("FIELD2","contains","1968");
        done();
    });

    it('Row Reorder Testing for Above, Child, Below positions After Filtering', () => {
        TreeGridObj.rowDragAndDropModule.reorderRows([5], 3, 'above');
        expect((TreeGridObj.flatData[10] as ITreeData)['TaskID']).toBe(21);
        TreeGridObj.rowDragAndDropModule.reorderRows([1], 4, 'child');
        expect((TreeGridObj.flatData[14] as ITreeData).childRecords.length).toBe(1);
        TreeGridObj.rowDragAndDropModule.reorderRows([1], 4, 'below');
        expect((TreeGridObj.flatData[15] as ITreeData)['TaskID']).toBe(3);
        TreeGridObj.clearFiltering();
      });

      it('Sorting the column', (done: Function)  => {
        TreeGridObj.sortByColumn("FIELD1", "Descending", true);
        done();
      });

      it('Row Reorder Testing for Above, Child, Below positions After Sorting', () => {
        TreeGridObj.rowDragAndDropModule.reorderRows([4], 0, 'above');
        expect((TreeGridObj.rowDragAndDropModule['draggedRecord'] as ITreeData).level).toBe(0);
        TreeGridObj.rowDragAndDropModule.reorderRows([1], 4, 'child');
        expect((TreeGridObj.getCurrentViewRecords()[4] as ITreeData).childRecords.length).toBe(1);
        TreeGridObj.rowDragAndDropModule.reorderRows([8], 5, 'below');
        expect((TreeGridObj.rowDragAndDropModule['draggedRecord'] as ITreeData).level).toBe(0);
        TreeGridObj.rowDragAndDropModule.destroy();
      });

    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('EJ2-62215 - When hierarchyMode is Both and perform searching at initial load, the error is thrown in case of Virtualization enabled', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                childMapping: 'Crew',
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Search'],
                enableCollapseAll: true,
                searchSettings: { ignoreCase: true, hierarchyMode: 'Both', key: '1' },
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });  

    it('Initial Searching when hierarchyMode is Both', () => {
        expect((gridObj.flatData[0] as ITreeData).expanded === false).toBe(true);
        expect((gridObj.flatData[0] as any).TaskID === 1).toBe(true);
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-62266 - Frozen columns with Row and Column virutalization', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                childMapping: 'Crew',
                enableVirtualization: true,
                enableColumnVirtualization: true,
                treeColumnIndex: 1,
                allowFiltering: true,
                frozenColumns: 2,
                allowSorting: true,
                toolbar: ['Search'],
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
                    { field: 'FIELD5', headerText: 'TMD', width: 120, textAlign: 'Right' },
                    { field: 'FIELD6', headerText: 'GP', width: 120, textAlign: 'Right' },
                    { field: 'FIELD7', headerText: 'GS', width: 120, textAlign: 'Right' },
                    { field: 'FIELD8', headerText: 'Minutes', width: 120, textAlign: 'Right' },
                    { field: 'FIELD9', headerText: 'Points', width: 120, textAlign: 'Right' },
                    { field: 'FIELD10', headerText: 'OREB', width: 130, textAlign: 'Right' },
                    { field: 'FIELD11', headerText: 'DREB', width: 130, textAlign: 'Right' },
                    { field: 'FIELD12', headerText: 'REB', width: 120, textAlign: 'Right' },
                    { field: 'FIELD13', headerText: 'Assists', width: 120, textAlign: 'Right' },
                    { field: 'FIELD14', headerText: 'Steals', width: 120, textAlign: 'Right' },
                    { field: 'FIELD15', headerText: 'Blocks', width: 120, textAlign: 'Right' },
                    { field: 'FIELD16', headerText: 'Turnovers', width: 130, textAlign: 'Right' },
                    { field: 'FIELD17', headerText: 'PF', width: 130, textAlign: 'Right' },
                    { field: 'FIELD18', headerText: 'FGA', width: 150, textAlign: 'Right' },
                    { field: 'FIELD19', headerText: 'FGM', width: 120, textAlign: 'Right' },
                    { field: 'FIELD20', headerText: 'FTA', width: 150, textAlign: 'Right' },
                    { field: 'FIELD21', headerText: 'FTM', width: 120, textAlign: 'Right' },
                    { field: 'FIELD22', headerText: 'Three Attempted', width: 150, textAlign: 'Right' },
                    { field: 'FIELD23', headerText: 'Three Made', width: 130, textAlign: 'Right' },
                    { field: 'FIELD24', headerText: 'Post GP', width: 120, textAlign: 'Right' },
                    { field: 'FIELD25', headerText: 'Post GS', width: 120, textAlign: 'Right' },
                    { field: 'FIELD26', headerText: 'Post Minutes', width: 120, textAlign: 'Right' },
                    { field: 'FIELD27', headerText: 'Post Points', width: 130, textAlign: 'Right' },
                    { field: 'FIELD28', headerText: 'Post OREB', width: 130, textAlign: 'Right' },
                    { field: 'FIELD29', headerText: 'Post DREB', width: 130, textAlign: 'Right' },
                    { field: 'FIELD30', headerText: 'Post REB', width: 130, textAlign: 'Right' }
                   ]
            },
        done
      );
    });

    it('Frozen rows with virtualization render check', () => {
        expect(gridObj.getRows()[gridObj.frozenRows].closest('div').classList.contains("e-frozencontent")).toBe(true);
        expect(gridObj.getMovableDataRows()[gridObj.frozenColumns].closest('div').classList.contains("e-virtualtable")).toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-62266 - Frozen columns with virutalization', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                childMapping: 'Crew',
                enableVirtualization: true,
                treeColumnIndex: 1,
                allowFiltering: true,
                frozenColumns: 2,
                allowSorting: true,
                toolbar: ['Search'],
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
                    { field: 'FIELD5', headerText: 'TMD', width: 120, textAlign: 'Right' },
                   
                   ]
            },
        done
      );
    });

    it('Frozen rows with virtualization render check', () => {
        expect(gridObj.getRows()[gridObj.frozenRows].closest('div').classList.contains("e-frozencontent")).toBe(true);
        expect(gridObj.getMovableDataRows()[gridObj.frozenColumns].closest('div').classList.contains("e-movablecontent")).toBe(true);
    });


    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('EJ2-62266 - Freeze direction with virutalization', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                childMapping: 'Crew',
                enableVirtualization: true,
                treeColumnIndex: 1,
                allowFiltering: true,
                allowSorting: true,
                toolbar: ['Search'],
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', width: 140, freeze: 'Left', textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', freeze: 'Left', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, freeze: 'Right',  textAlign: 'Right' },                   
                   ]
            },
        done
      );
    });

    it('Ensure frozen method', (done: Function) => {
        expect(gridObj.getFrozenLeftColumnsCount()).toBe(2);
        expect(gridObj.getMovableColumnsCount()).toBe(2);
        expect(gridObj.getFrozenRightColumnsCount()).toBe(1);
        expect(gridObj.getFrozenLeftColumns().length).toBe(gridObj.getFrozenLeftColumnsCount());
        expect(gridObj.getMovableColumns().length).toBe(gridObj.getMovableColumnsCount());
        expect(gridObj.getFrozenRightColumns().length).toBe(gridObj.getFrozenRightColumnsCount());
        done();
     });

    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('EJ2-62928 - Script error throws when we filter the record using filter menu.', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                childMapping: 'Crew',
                enableVirtualization: true,
                treeColumnIndex: 1,
                toolbar: ['Search'],
                enableCollapseAll: true,
                searchSettings: { ignoreCase: true, hierarchyMode: 'Both', key: '1' },
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120,allowEditing: false, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
                   ]
            },
        done
      );
    });  

    it('Initial Filtering when hierarchyMode is Both', () => {
        gridObj.filterByColumn('FIELD1', 'startswith', 'FRANK');
		gridObj.collapseAll();
		expect((gridObj.getRows()[0] as HTMLTableRowElement).getElementsByClassName('e-treegridcollapse').length).toBe(1);
    });

    afterAll(() => {
      destroy(gridObj);
    });
	  
    describe('scrolling and adding records', () => {
        let gridObj: TreeGrid;
	beforeAll((done: Function) => {
	    gridObj = createGrid(
	        {
		        dataSource: virtualData.slice(0,1000),
		        childMapping: 'Crew',
			enableVirtualization: true,
			treeColumnIndex: 1,
			height: 400,
			editSettings: {
				allowAdding: true,
				allowEditing: true,
				allowDeleting: true,
				mode: 'Row',
				newRowPosition: 'Child'
			},
			toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Indent', 'Outdent'],
			columns: [
				{ field: 'TaskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
				{ field: 'FIELD1', headerText: 'Player Name', width: 140 },
				{ field: 'FIELD2', headerText: 'Year', width: 120, allowEditing: false, textAlign: 'Right' },
				{ field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
				{ field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' }
			]
			},
			done
		);
		});

		it('scrolling and adding records', () => {
			gridObj.getContent().firstElementChild.scrollTop = 20000;
			gridObj.selectRow(gridObj.getCurrentViewRecords()[3]['TaskID']);
			gridObj.addRecord({ TaskID: 10000, FIELD1: 'TEST1' }, gridObj.getCurrentViewRecords()[3]['TaskID'], 'Child');
			expect((gridObj.flatData as ITreeData)['length'] === 1001).toBe(true);
		});

		afterAll(() => {
			destroy(gridObj);
	});
	});
  });

  describe('EJ2-63548 - Indent/Outdent action check after edited the row with virtualization ', () => {
    let TreeGridObj: TreeGrid;
    let actionComplete: () => void;
    let rows: Element[];
    beforeAll((done: Function) => {
      TreeGridObj = createGrid(
        {
          dataSource: editVirtualData,
          childMapping: 'Crew',
          enableVirtualization: true,
          height: 400,
          toolbar: [ 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Indent', 'Outdent'],
          editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Child' },
          columns: [
          { field: 'TaskID', headerText: 'ID', isPrimaryKey: true, width: 140 },
          { field: 'FIELD1', headerText: 'Player Name', width: 140 },
          { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
          { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
          { field: 'FIELD4', headerText: 'TMID', width: 120, textAlign: 'Right' },
          { field: 'FIELD5', headerText: 'LGID', width: 120, textAlign: 'Right' },
          ],
        treeColumnIndex: 1
        },done);
    });
  
    it('Indent/Outdent icon updated check after edited the row', (done: Function) => {
      actionComplete = (args?: any): void => {
        if (args.requestType == 'outdented') {
          expect(args.data[0].parentItem == undefined).toBe(true);
          done();
        }
      }
      rows = TreeGridObj.grid.getRows();
      TreeGridObj.selectRow(1);
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_edit' } });
      (select('#' + TreeGridObj.grid.element.id + 'FIELD1', TreeGridObj.grid.element) as any).value = 'updated';
      (<any>TreeGridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: TreeGridObj.grid.element.id + '_update' } });
      TreeGridObj.outdent(TreeGridObj.getCurrentViewRecords()[1]);
      TreeGridObj.actionComplete = actionComplete;
    });
    afterAll(() => {
      destroy(TreeGridObj);
    });
  });

  describe('EJ2-64501 - virutalization shimmer effect check', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                childMapping: 'Crew',
                enableVirtualization: true,
                treeColumnIndex: 1,
                allowFiltering: true,
                allowSorting: true,
                toolbar: ['Search'],
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', width: 140, textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name',  width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120,  textAlign: 'Right' },                   
                   ]
            },
        done
      );
    });

    it('Show Mask Row', () => {
      gridObj.grid.showMaskRow();
      expect(gridObj.getContent().querySelector('.e-masked-table')).toBeTruthy();
  });
  it('Remove Mask Row', () => {
      gridObj.grid.removeMaskRow();
      expect(gridObj.getContent().querySelector('.e-masked-table')).toBeFalsy();
  });

    afterAll(() => {
      destroy(gridObj);
    });
  });



  describe('EJ2-64501 - Freeze direction with virutalization shimmer effect check', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: editVirtualData,
                childMapping: 'Crew',
                enableVirtualization: true,
                treeColumnIndex: 1,
                allowFiltering: true,
                allowSorting: true,
                toolbar: ['Search'],
                height: 400,
                columns: [
                    { field: 'TaskID', headerText: 'Player Jersey', width: 140, freeze: 'Left', textAlign: 'Right' },
                    { field: 'FIELD1', headerText: 'Player Name', freeze: 'Left', width: 140 },
                    { field: 'FIELD2', headerText: 'Year', width: 120, textAlign: 'Right' },
                    { field: 'FIELD3', headerText: 'Stint', width: 120, textAlign: 'Right' },
                    { field: 'FIELD4', headerText: 'TMID', width: 120, freeze: 'Right',  textAlign: 'Right' },                   
                   ]
            },
        done
      );
    });

    it('Show Mask Row', () => {
      gridObj.grid.showMaskRow();
      expect(gridObj.getContent().querySelector('.e-masked-table')).toBeTruthy();
  });
  it('Remove Mask Row', () => {
      gridObj.grid.removeMaskRow();
      expect(gridObj.getContent().querySelector('.e-masked-table')).toBeFalsy();
  });

    afterAll(() => {
      destroy(gridObj);
    });
  });


});
