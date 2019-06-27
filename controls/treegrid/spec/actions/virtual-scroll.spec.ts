import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { QueryCellInfoEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { VirtualScroll } from '../../src/treegrid/actions/virtual-scroll';
import { virtualData } from '../base/datasource.spec';

/**
 * TreeGrid Virtual Scroll spec 
 */

TreeGrid.Inject(VirtualScroll);

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
});