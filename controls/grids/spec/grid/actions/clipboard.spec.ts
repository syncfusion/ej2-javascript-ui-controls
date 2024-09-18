/**
 * Grid Clipboard spec document
 */
import { Browser } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Selection } from '../../../src/grid/actions/selection';
import { Clipboard } from '../../../src/grid/actions/clipboard';
import { employeeData, filterData } from '../base/datasource.spec';
import { BeforeCopyEventArgs } from '../../../src/grid/base/interface';
import { createGrid, destroy, getKeyActionObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { Edit } from '../../../src/grid/actions/edit';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { InfiniteScroll } from '../../../src/grid/actions/infinite-scroll';
import { LazyLoadGroup } from '../../../src/grid/actions/lazy-load-group';
import { Group } from '../../../src/grid/actions/group';

Grid.Inject(Selection, Clipboard, Edit, Page, Toolbar, Group, VirtualScroll, InfiniteScroll, LazyLoadGroup);

describe('Grid clipboard copy testing - row type selection => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
        gridObj = createGrid(
            {
                dataSource: employeeData, 
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 135, },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Title', headerText: 'Title', width: 180 },
                ],
                allowSelection: true,
                selectionSettings: { type: 'Multiple' }
            }, done);
    });

    it('Check hidden clipboard textarea', () => {
        let clipArea: HTMLElement = (gridObj.element.querySelectorAll('.e-clipboard')[0] as HTMLElement);
        expect(gridObj.element.querySelectorAll('.e-clipboard').length > 0).toBeTruthy();
        expect(clipArea.style.opacity === '0').toBeTruthy();
    });

    it('Check with row type selection', () => {
        gridObj.selectRows([0, 1]);
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1	Nancy	Sales Representative\n2	Andrew	Vice President, Sales').toBeTruthy();
    });

    it('Check with row type selection - include header', () => {
        gridObj.copy(true);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Employee ID	Name	Title\n1	Nancy	Sales Representative\n2	Andrew	Vice President, Sales').toBeTruthy();
    });

    it('Browser default selection for coverage', () => {
        let range: any = document.createRange();
        range.selectNodeContents(gridObj.element.querySelectorAll('.e-rowcell')[2]);
        let selection: any = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        gridObj.copy();
        selection.removeAllRanges();
    });

    it('Check with row type selection in iOS Device', () => {
        let iphoneUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6' +
            ' (KHTML, like Gecko) Version/10.0 Mobile/14D27 Safari/602.1';
        let browUa: string = Browser.userAgent;
        Browser.userAgent = iphoneUa;
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1	Nancy	Sales Representative\n2	Andrew	Vice President, Sales').toBeTruthy();
        Browser.userAgent = browUa;
    });

    it('Check clipboard area after destroy', () => {
        gridObj.clipboardModule.destroy();
        expect(document.querySelectorAll('.e-clipboard').length === 0).toBeTruthy();
    });

    afterAll(() => {
       destroy(gridObj);
       gridObj = null;
    });
});

describe('Grid clipboard copy testing - cells type selection => ', () => {
    let gridObj: Grid;
    let gridBeforeCopy: (e: BeforeCopyEventArgs) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: employeeData,
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 135, },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Title', headerText: 'Title', width: 180 },
                ],
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Cell' },
                beforeCopy: gridBeforeCopy
            }, done);
    });

    it('Check with cells type selection', () => {
        gridObj.selectionModule.selectCells([{
            rowIndex: 0,
            cellIndexes: [0, 1]
        }, {
            rowIndex: 1,
            cellIndexes: [1, 2]
        }]);
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1\nNancy\nAndrew\nVice President, Sales').toBeTruthy();
    });

    it('Check with row type selection - include header', () => {
        gridObj.selectionModule.selectCells([{
            rowIndex: 0,
            cellIndexes: [0, 1]
        }, {
            rowIndex: 1,
            cellIndexes: [1, 2]
        }])
        gridObj.copy(true);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Employee ID\n1\nName\nNancy\nName\nAndrew\nTitle\nVice President, Sales').toBeTruthy();
    });

    it('Check with ctrlPlusC key press', () => {                
        gridObj.keyboardModule.keyAction(getKeyActionObj('ctrlPlusC'));
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1\nNancy\nAndrew\nVice President, Sales').toBeTruthy();
    });

    it('Check with ctrlShiftPlusH key press', () => {
        gridObj.keyboardModule.keyAction(getKeyActionObj('ctrlShiftPlusH'));
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Employee ID\n1\nName\nNancy\nName\nAndrew\nTitle\nVice President, Sales').toBeTruthy();        
        gridObj.keyboardModule.keyAction(getKeyActionObj('space', document.querySelector('.e-clipboard') as HTMLInputElement));
    });

    it('Check with args cancel for coverage', () => {
        gridBeforeCopy = (args: BeforeCopyEventArgs): void => {
            args.cancel = true;
        };
        gridObj.beforeCopy = gridBeforeCopy;
        gridObj.copy();
    });

    afterAll(() => {
       destroy(gridObj);
       gridObj = gridBeforeCopy = null;
    });
});

describe('EJ2-851516 - Grid clipboard copy testing with hidden columns => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: employeeData,
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 135, },
                    { field: 'FirstName', headerText: 'Name', visible: false, width: 125 },
                    { field: 'Title', headerText: 'Title', width: 180 },
                ],
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'Box', },
            }, done);
    });

    it('copy cells without header', () => {
        gridObj.selectionModule.selectCells([{
            rowIndex: 0,
            cellIndexes: [0, 1, 2]
        }]);
        gridObj.copy();
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1\tSales Representative').toBeTruthy();
    });

    afterAll(() => {
       destroy(gridObj);
       gridObj = null;
    });
});

describe('Clipboard copy testing while Freezing columns => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowPaging: true,
                selectionSettings: { type: 'Multiple' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right', freeze : 'Right' },
                    { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' }
                ],
                pageSettings: { pageCount: 5 }
            }, done);
    });

    it('Check the copy value', () => {
        gridObj.selectRows([1]);
        gridObj.copy(true);
        expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Customer Name\tOrder Date\tFreight\tOrder ID\nTOMSP\t7/12/1996\t$11.61\t10249').toBeTruthy();
    });

    afterAll(() => {
       destroy(gridObj);
    });
});

describe('EJ2-7314/7299===>Grid clipboard => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: employeeData,
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 135, },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Title', headerText: 'Title', visible: false, width: 180 },
                    { field: 'Region', headerText: 'Region', width: 180 },
                    { field: 'Country', headerText: 'Country', width: 180 }
                ],
                allowSelection: true,
                selectionSettings: { type: 'Multiple' }
            }, done);
    });

    it('EJ2-7299===>Hiding one column and copying the rows', () => {
        gridObj.selectRow(0, true);
        gridObj.copy();
        expect((gridObj.element.querySelector('.e-clipboard') as HTMLInputElement).value
            === '1	Nancy	WA	USA').toBeTruthy();
        gridObj.copy(true);
        expect((gridObj.element.querySelector('.e-clipboard') as HTMLInputElement).value
            === 'Employee ID	Name	Region	Country\n1	Nancy	WA	USA').toBeTruthy();
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

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-826272 - Copy-Paste problem while adding a new row in grid', () => {
    let gridObj: Grid;
    let inputElement: HTMLInputElement;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowPaging: true,
                pageSettings: { pageCount: 5 },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                selectionSettings: { type: 'Multiple', mode: 'Cell', cellSelectionMode: 'BoxWithBorder' },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' }
                ]
            }, done);
    });

    it('Copy pasting the content in a newly added row', () => {
        gridObj.selectionModule.selectCell({ rowIndex: 0, cellIndex: 1 }, false);
        gridObj.copy();
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        gridObj.editModule.editCell(0, 'CustomerID');
        gridObj.element.querySelectorAll('.e-editedbatchcell')
        inputElement = gridObj.element.querySelector('.e-editedbatchcell').querySelector('input');
        inputElement.value = (gridObj.element.querySelector('.e-clipboard') as HTMLInputElement).value;
    });

    it('Ensuring the copied content', () => {
        gridObj.selectionModule.selectCell({ rowIndex: 2, cellIndex: 1 }, false);
        gridObj.copy();
        expect((gridObj.element.querySelector('.e-clipboard') as HTMLInputElement).value).toBe('TOMSP');
    });

    it('check the removeEventListener  Binding', () => {
        gridObj.isDestroyed = true;
        gridObj.clipboardModule.removeEventListener();
        gridObj.isDestroyed = false;
    });

    it('check the addEventListener Binding', () => {
        gridObj.isDestroyed = true;
        gridObj.clipboardModule.addEventListener();
        gridObj.isDestroyed = false;
    });


    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Coverage Improvemnet - clipborad', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowPaging: true,
                pageSettings: { pageCount: 5 },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                selectionSettings: { type: 'Multiple', mode: 'Cell' },
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer Name', width: 150, allowEditing: false },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' }
                ]
            }, done);
    });

    it('copied content', () => {
        gridObj.selectionModule.selectCell({ rowIndex: 2, cellIndex: 1 }, false);
        gridObj.copy();
    });

    it('Coverage - Ensuring the copied content', () => {
        let cell: any = gridObj.getContent().querySelector('.e-row').childNodes[1];
        cell.click();
        let args: any = { keyCode: 86, ctrlKey: true };
        (gridObj.clipboardModule as any).pasteHandler(args);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Coverage Improvemnet - Lazy Load Grouping with Virtual Scroll  => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowGrouping: true,
                groupSettings: { enableLazyLoading: true, columns: ['CustomerID'] },
                height: 400,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' }
                ],
            }, done);
    });

    it('Expand the first Row', () => {
        let expandElem: any = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
        gridObj.groupModule.expandCollapseRows(expandElem[1]);
    });

    it('Ensuring the copied content - Lazy Load Grouping ', () => {
        let cell: HTMLElement = gridObj.getContent().querySelector('.e-row').childNodes[1] as HTMLElement;
        cell.click();
        gridObj.copy();
    });


    // coverage improvement
    it('lazy load addEventListener coverage ', () => {
        gridObj.isDestroyed = true;
        (gridObj as any).lazyLoadGroupModule.addEventListener();
        gridObj.isDestroyed = false;
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});



describe('Coverage Improvemnet - Infinite Scroll  => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                enableInfiniteScrolling: true,
                infiniteScrollSettings: { enableCache: true },
                height: 400,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' }
                ],
            }, done);
    });

    it('Ensuring the copied content - Infinite scroll', () => {
        gridObj.selectRow(0, true);
        gridObj.copy();
    });


    // clipboard coverage
    it('clipboard coverage', () => {
        (gridObj as any).clipboardModule.paste('', 1, 10);
        gridObj.selectionSettings.mode = 'Cell';
        (gridObj as any).selectionModule.selectedRowCellIndexes = [{ rowIndex: 1, cellIndexes: [] }];
        (gridObj as any).clipboardModule.checkBoxSelection();
        (gridObj as any).clipboardModule.clipBoardTextArea = null;
        (gridObj as any).clipboardModule.isSelect = false;
        gridObj.clipboardModule.copy();
    });


    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});