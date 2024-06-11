/**
 * Lazy load group spec
 */
import { Grid } from '../../../src/grid/base/grid';
import { Group } from '../../../src/grid/actions/group';
import { LazyLoadGroup } from '../../../src/grid/actions/lazy-load-group';
import { Page } from '../../../src/grid/actions/page';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { createGrid, destroy, getKeyUpObj, getClickObj } from '../base/specutil.spec';
import { ColumnChooser } from '../../../src/grid/actions/column-chooser';
import { filterData } from '../base/datasource.spec';
import { InfiniteScroll } from '../../../src/grid/actions/infinite-scroll';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { VirtualContentRenderer } from '../../../src/grid/renderer/virtual-content-renderer';
import { SortSettingsModel } from '../../../src/grid/base/grid-model';
import { Row } from '../../../src/grid/models/row';
import { Column } from '../../../src/grid/models/column';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { GroupLazyLoadRenderer } from '../../../src/grid/renderer/group-lazy-load-renderer';
import { NotifyArgs, RowSelectEventArgs } from '../../../src/grid/base/interface';
import { select } from '@syncfusion/ej2-base';
import { Toolbar } from '../../../src/grid/actions/toolbar';

Grid.Inject(Page, Group, LazyLoadGroup, Reorder, ColumnChooser, Aggregate, InfiniteScroll, VirtualScroll, Sort, Filter, Toolbar, Edit);

let lazyLoadData: Object[] = [];
function createLazyLoadData(): void {
    let customerid: string[] = ['VINET', 'TOMSP', 'HANAR', 'VICTE', 'SUPRD', 'HANAR', 'CHOPS', 'RICSU', 'WELLI', 'HILAA', 'ERNSH', 'CENTC',
        'OTTIK', 'QUEDE', 'RATTC', 'ERNSH', 'FOLKO', 'BLONP', 'WARTH', 'FRANK', 'GROSR', 'WHITC', 'WARTH', 'SPLIR', 'RATTC', 'QUICK', 'VINET',
        'MAGAA', 'TORTU', 'MORGK', 'BERGS', 'LEHMS', 'BERGS', 'ROMEY', 'ROMEY', 'LILAS', 'LEHMS', 'QUICK', 'QUICK', 'RICAR', 'REGGC', 'BSBEV',
        'COMMI', 'QUEDE', 'TRADH', 'TORTU', 'RATTC', 'VINET', 'LILAS', 'BLONP', 'HUNGO', 'RICAR', 'MAGAA', 'WANDK', 'SUPRD', 'GODOS', 'TORTU',
        'OLDWO', 'ROMEY', 'LONEP', 'ANATR', 'HUNGO', 'THEBI', 'DUMON', 'WANDK', 'QUICK', 'RATTC', 'ISLAT', 'RATTC', 'LONEP', 'ISLAT', 'TORTU',
        'WARTH', 'ISLAT', 'PERIC', 'KOENE', 'SAVEA', 'KOENE', 'BOLID', 'FOLKO', 'FURIB', 'SPLIR', 'LILAS', 'BONAP', 'MEREP', 'WARTH', 'VICTE',
        'HUNGO', 'PRINI', 'FRANK', 'OLDWO', 'MEREP', 'BONAP', 'SIMOB', 'FRANK', 'LEHMS', 'WHITC', 'QUICK', 'RATTC', 'FAMIA'];

    let product: string[] = ['Chai', 'Chang', 'Aniseed Syrup', 'Chef Anton\'s Cajun Seasoning', 'Chef Anton\'s Gumbo Mix', 'Grandma\'s Boysenberry Spread',
        'Uncle Bob\'s Organic Dried Pears', 'Northwoods Cranberry Sauce', 'Mishi Kobe Niku', 'Ikura', 'Queso Cabrales', 'Queso Manchego La Pastora', 'Konbu',
        'Tofu', 'Genen Shouyu', 'Pavlova', 'Alice Mutton', 'Carnarvon Tigers', 'Teatime Chocolate Biscuits', 'Sir Rodney\'s Marmalade', 'Sir Rodney\'s Scones',
        'Gustaf\'s Knäckebröd', 'Tunnbröd', 'Guaraná Fantástica', 'NuNuCa Nuß-Nougat-Creme', 'Gumbär Gummibärchen', 'Schoggi Schokolade', 'Rössle Sauerkraut',
        'Thüringer Rostbratwurst', 'Nord-Ost Matjeshering', 'Gorgonzola Telino', 'Mascarpone Fabioli', 'Geitost', 'Sasquatch Ale', 'Steeleye Stout', 'Inlagd Sill',
        'Gravad lax', 'Côte de Blaye', 'Chartreuse verte', 'Boston Crab Meat', 'Jack\'s New England Clam Chowder', 'Singaporean Hokkien Fried Mee', 'Ipoh Coffee',
        'Gula Malacca', 'Rogede sild', 'Spegesild', 'Zaanse koeken', 'Chocolade', 'Maxilaku', 'Valkoinen suklaa', 'Manjimup Dried Apples', 'Filo Mix', 'Perth Pasties',
        'Tourtière', 'Pâté chinois', 'Gnocchi di nonna Alice', 'Ravioli Angelo', 'Escargots de Bourgogne', 'Raclette Courdavault', 'Camembert Pierrot', 'Sirop d\'érable',
        'Tarte au sucre', 'Vegie-spread', 'Wimmers gute Semmelknödel', 'Louisiana Fiery Hot Pepper Sauce', 'Louisiana Hot Spiced Okra', 'Laughing Lumberjack Lager', 'Scottish Longbreads',
        'Gudbrandsdalsost', 'Outback Lager', 'Flotemysost', 'Mozzarella di Giovanni', 'Röd Kaviar', 'Longlife Tofu', 'Rhönbräu Klosterbier', 'Lakkalikööri', 'Original Frankfurter grüne Soße'];

    let customername: string[] = ['Maria', 'Ana Trujillo', 'Antonio Moreno', 'Thomas Hardy', 'Christina Berglund', 'Hanna Moos', 'Frédérique Citeaux', 'Martín Sommer', 'Laurence Lebihan', 'Elizabeth Lincoln',
        'Victoria Ashworth', 'Patricio Simpson', 'Francisco Chang', 'Yang Wang', 'Pedro Afonso', 'Elizabeth Brown', 'Sven Ottlieb', 'Janine Labrune', 'Ann Devon', 'Roland Mendel', 'Aria Cruz', 'Diego Roel',
        'Martine Rancé', 'Maria Larsson', 'Peter Franken', 'Carine Schmitt', 'Paolo Accorti', 'Lino Rodriguez', 'Eduardo Saavedra', 'José Pedro Freyre', 'André Fonseca', 'Howard Snyder', 'Manuel Pereira',
        'Mario Pontes', 'Carlos Hernández', 'Yoshi Latimer', 'Patricia McKenna', 'Helen Bennett', 'Philip Cramer', 'Daniel Tonini', 'Annette Roulet', 'Yoshi Tannamuri', 'John Steel', 'Renate Messner', 'Jaime Yorres',
        'Carlos González', 'Felipe Izquierdo', 'Fran Wilson', 'Giovanni Rovelli', 'Catherine Dewey', 'Jean Fresnière', 'Alexander Feuer', 'Simon Crowther', 'Yvonne Moncada', 'Rene Phillips', 'Henriette Pfalzheim',
        'Marie Bertrand', 'Guillermo Fernández', 'Georg Pipps', 'Isabel de Castro', 'Bernardo Batista', 'Lúcia Carvalho', 'Horst Kloss', 'Sergio Gutiérrez', 'Paula Wilson', 'Maurizio Moroni', 'Janete Limeira', 'Michael Holz',
        'Alejandra Camino', 'Jonas Bergulfsen', 'Jose Pavarotti', 'Hari Kumar', 'Jytte Petersen', 'Dominique Perrier', 'Art Braunschweiger', 'Pascale Cartrain', 'Liz Nixon', 'Liu Wong', 'Karin Josephs', 'Miguel Angel Paolino',
        'Anabela Domingues', 'Helvetius Nagy', 'Palle Ibsen', 'Mary Saveley', 'Paul Henriot', 'Rita Müller', 'Pirkko Koskitalo', 'Paula Parente', 'Karl Jablonski', 'Matti Karttunen', 'Zbyszek Piestrzeniewicz'];

    let customeraddress: string[] = ['507 - 20th Ave. E.\r\nApt. 2A', '908 W. Capital Way', '722 Moss Bay Blvd.', '4110 Old Redmond Rd.', '14 Garrett Hill', 'Coventry House\r\nMiner Rd.', 'Edgeham Hollow\r\nWinchester Way',
        '4726 - 11th Ave. N.E.', '7 Houndstooth Rd.', '59 rue de l\'Abbaye', 'Luisenstr. 48', '908 W. Capital Way', '722 Moss Bay Blvd.', '4110 Old Redmond Rd.', '14 Garrett Hill', 'Coventry House\r\nMiner Rd.', 'Edgeham Hollow\r\nWinchester Way',
        '7 Houndstooth Rd.', '2817 Milton Dr.', 'Kirchgasse 6', 'Sierras de Granada 9993', 'Mehrheimerstr. 369', 'Rua da Panificadora, 12', '2817 Milton Dr.', 'Mehrheimerstr. 369'];

    let quantityperunit: string[] = ['10 boxes x 20 bags', '24 - 12 oz bottles', '12 - 550 ml bottles', '48 - 6 oz jars', '36 boxes', '12 - 8 oz jars', '12 - 1 lb pkgs.', '12 - 12 oz jars', '18 - 500 g pkgs.', '12 - 200 ml jars',
        '1 kg pkg.', '10 - 500 g pkgs.', '2 kg box', '40 - 100 g pkgs.', '24 - 250 ml bottles', '32 - 500 g boxes', '20 - 1 kg tins', '16 kg pkg.', '10 boxes x 12 pieces', '30 gift boxes', '24 pkgs. x 4 pieces', '24 - 500 g pkgs.', '12 - 250 g pkgs.',
        '12 - 355 ml cans', '20 - 450 g glasses', '100 - 250 g bags'];

    let OrderID: number = 10248;
    for (let i: number = 0; i < 5000; i++) {
        lazyLoadData.push({
            'OrderID': OrderID + i,
            'CustomerID': customerid[Math.floor(Math.random() * customerid.length)],
            'CustomerName': customername[Math.floor(Math.random() * customername.length)],
            'CustomerAddress': customeraddress[Math.floor(Math.random() * customeraddress.length)],
            'ProductName': product[Math.floor(Math.random() * product.length)],
            'ProductID': i,
            'Quantity': quantityperunit[Math.floor(Math.random() * quantityperunit.length)]
        })
    }
}

createLazyLoadData();

let filterColumn: Function = (gridObj: Grid, colName: string, value: string, keyCode?: number) => {
    let filterElement: any = gridObj.element.querySelector('[id=\'' + colName + '_filterBarcell\']');
    filterElement.value = value;
    filterElement.focus();
    (gridObj.filterModule as any).keyUpHandler(getKeyUpObj(keyCode ? keyCode : 13, filterElement));
};

let checkFilterObj: Function = (obj: any, field?: string,
    operator?: string, value?: string, predicate?: string, matchCase?: boolean): boolean => {
    let isEqual: boolean = true;
    if (field) {
        isEqual = isEqual && obj.field === field;
    }
    if (operator) {
        isEqual = isEqual && obj.operator === operator;
    }
    if (value) {
        isEqual = isEqual && obj.value === value;
    }
    if (matchCase) {
        isEqual = isEqual && obj.matchCase === matchCase;
    }
    return isEqual;
};

describe('LazyLoadGroup module', () => {
    describe('Grouping test', () => {
        let gridObj: any;
        let isExpand: boolean = false;
        let uid: string;
        let expandShortcut: boolean = false;
        let collapseShortcut: boolean = false;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: lazyLoadData,
                    allowGrouping: true,
                    allowPaging: true,
                    allowReordering: true,
                    showColumnChooser: true,
                    groupSettings: { enableLazyLoading: true },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', width: 120 },
                        { field: 'ProductName', headerText: 'Product Name', width: 120 },
                        { field: 'ProductID', headerText: 'Product ID', textAlign: 'Right', width: 120 },
                        { field: 'Quantity', headerText: 'Quantity', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 120 },
                        { field: 'CustomerAddress', headerText: 'Address', width: 120 }
                    ]
                }, done);
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                expect(gridObj.contentModule.cacheMode).toBe(false);
                expect(gridObj.contentModule.groupCache[gridObj.pageSettings.currentPage].length).toBe(gridObj.pageSettings.pageSize);
                let scrollEle: Element = gridObj.getContent().firstElementChild;
                let blockSize: number = Math.floor((scrollEle as HTMLElement).offsetHeight / gridObj.getRowHeight()) - 1;
                let pageSize = blockSize * 3;
                expect(gridObj.contentModule.pageSize).toBe(pageSize);
                expect(gridObj.contentModule.blockSize).toBe(Math.ceil(pageSize / 2));
                expect(gridObj.contentModule.initialGroupCaptions[gridObj.pageSettings.currentPage].length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.contentModule.initialPageRecords.length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.getContent().querySelector('.e-row')).toBeNull();
                expect(gridObj.getContent().querySelectorAll('tr').length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.contentModule.getInitialCaptionIndexes().length).toBe(gridObj.pageSettings.pageSize);
                expect(Object.keys(gridObj.contentModule.rowsByUid[gridObj.pageSettings.currentPage]).length).toBe(gridObj.pageSettings.pageSize);
                expect(Object.keys(gridObj.contentModule.objIdxByUid[gridObj.pageSettings.currentPage]).length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.contentModule.startIndexes[gridObj.pageSettings.currentPage]).toBeUndefined();
                expect(gridObj.getRows().length).toBe(0);
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductName');
        });
        it('caption expand', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            let lazyLoadGroupExpand = function(args: any) {
                isExpand = true;
                expect(args.enableCaching).toBe(true);
                expect(args.captionRowElement).toBe(expandElem[0].parentElement);
                expect(args.groupInfo.indent).toBe(0);
                gridObj.lazyLoadGroupExpand = null;
                setTimeout(done, 100);
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        it('caption collapse', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            expect(gridObj.getContent().querySelectorAll('tr').length).not.toBe(gridObj.pageSettings.pageSize);
            expect(gridObj.getContent().querySelector('.e-row')).not.toBeNull();
            expect(gridObj.contentModule.groupCache[gridObj.pageSettings.currentPage].length).toBeGreaterThan(gridObj.pageSettings.pageSize);
            expect(gridObj.contentModule.startIndexes[gridObj.pageSettings.currentPage].length).toBe(gridObj.pageSettings.pageSize);
            expect(Object.keys(gridObj.contentModule.rowsByUid[gridObj.pageSettings.currentPage]).length).not.toBe(gridObj.pageSettings.pageSize);
            expect(Object.keys(gridObj.contentModule.objIdxByUid[gridObj.pageSettings.currentPage]).length).not.toBe(gridObj.pageSettings.pageSize);
            expect(gridObj.getRows().length).not.toBe(0);
            expect(gridObj.getRowByIndex(0)).not.toBeUndefined();
            let lazyLoadGroupCollapse = function(args: any) {
                isExpand = false;
                expect(args.enableCaching).toBeUndefined();
                expect(args.captionRowElement).toBe(expandElem[0].parentElement);
                expect(args.groupInfo.indent).toBe(0);
                gridObj.lazyLoadGroupCollapse = null;
                setTimeout(done, 100);
            };
            expect(isExpand).toBe(true);
            gridObj.lazyLoadGroupCollapse = lazyLoadGroupCollapse;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        it('Ensure rows', () => {
            expect(isExpand).toBe(false);
            expect(gridObj.getContent().querySelectorAll('tr').length).toBe(gridObj.pageSettings.pageSize);
            expect(gridObj.getContent().querySelector('.e-row')).toBeNull();
        });
        it('clear groping', (done: Function) => {
            let actionComplete = function (args: any) {
                expect(gridObj.contentModule.startIndexes[gridObj.pageSettings.currentPage]).toBeUndefined();
                expect(gridObj.contentModule.rowsByUid[gridObj.pageSettings.currentPage]).toBeUndefined();
                expect(gridObj.contentModule.objIdxByUid[gridObj.pageSettings.currentPage]).toBeUndefined();
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductName');
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductName');
        });
        it('Group ProductID column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductID');
        });
        it('caption expand', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            let lazyLoadGroupExpand = function(args: any) {
                expect(gridObj.getContent().querySelector('.e-row')).toBeNull();
                gridObj.lazyLoadGroupExpand = null;
                done();
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
        });
        it('Go to second page', (done: Function) => {
            uid = gridObj.getContent().querySelectorAll('tr')[2].getAttribute('data-uid');
            let actionComplete = function () {
                expect(gridObj.getContent().querySelectorAll('tr').length).toBe(gridObj.pageSettings.pageSize);
                expect(gridObj.contentModule.groupCache[gridObj.pageSettings.currentPage].length).toBe(gridObj.pageSettings.pageSize);
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 2;
            gridObj.dataBind();
        });
        it('Go to first page', (done: Function) => {
            let actionComplete = function () {
                gridObj.actionComplete = null;
                setTimeout(done, 100);
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 1;
            gridObj.dataBind();
        });
        it('clear groping', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductName');
        });
        it('clear groping', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductID');
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductName');
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductID');
        });
        it('expand shortcut ProductName', (done: Function) => {
            gridObj.keyA = true;
            let keyDownArgs = { 
                altKey: true, keyCode: 74, target: gridObj.getContent().querySelectorAll('tr')[0].cells[0]
            }
            let lazyLoadGroupExpand = function(args: any) {
                expandShortcut = true;
                gridObj.lazyLoadGroupExpand = null;
                done();
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.keyDownHandler(keyDownArgs);
        });
        it('expand shortcut ProductID', (done: Function) => {
            gridObj.keyA = true;
            let keyDownArgs = { 
                altKey: true, keyCode: 74, target: gridObj.getContent().querySelectorAll('tr')[1].cells[0]
            }
            let lazyLoadGroupExpand = function(args: any) {
                gridObj.lazyLoadGroupExpand = null;
                setTimeout(done, 100);
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.keyDownHandler(keyDownArgs);
        });
        it('clear groping ProductName', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductName');
        });
        it('clear groping ProductID', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductID');
        });
        it('Group ProductName column', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ProductName');
        });
        it('first caption expand', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            let lazyLoadGroupExpand = function(args: any) {
                gridObj.lazyLoadGroupExpand = null;
                done();
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        it('Reorder Column method testing', (done: Function) => {
            let actionComplete = (args: Object): void => {
                let headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[3].querySelector('.e-headercelldiv').textContent).toBe('Customer Name');
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.reorderColumns('CustomerName', 'Quantity');
        });
        it('check the visible cells true/false', () => {
            gridObj.hideColumns('Address');
            expect(gridObj.getRowsObject()[1].cells[7].visible).toBeFalsy();
        });
        it('clear groping ProductName', (done: Function) => {
            let actionComplete = function (args: any) {
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ProductName');
        });
        it('check the visible cells true/false', () => {
            gridObj.showColumns('Address');
            expect(gridObj.getRowsObject()[1].cells[6].visible).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('LazyLoadGroup with aggregate', () => {
        let gridObj: any;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: lazyLoadData,
                    allowGrouping: true,
                    allowPaging: true,
                    allowReordering: true,
                    showColumnChooser: true,
                    groupSettings: { enableLazyLoading: true, columns: ['ProductName'] },
                    columns: [
                        { field: 'ProductName', headerText: 'Product Name', width: 120 },
                        { field: 'Quantity', headerText: 'Quantity', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 120 },
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', width: 120 },
                        { field: 'ProductID', headerText: 'Product ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerAddress', headerText: 'Address', width: 120 }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'OrderID',
                            groupFooterTemplate: 'Total units: ${Sum}'
                        },
                        {
                            type: 'Max',
                            field: 'ProductID',
                            groupCaptionTemplate: 'Maximum: ${Max}'
                        }]
                    }],
                }, done);
        });
        it('caption expand', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            let lazyLoadGroupExpand = function(args: any) {
                gridObj.lazyLoadGroupExpand = null;
                done();
            };
            gridObj.lazyLoadGroupExpand = lazyLoadGroupExpand;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        it('Ensure caption', () => {
            let captionRow = gridObj.getContent().querySelector('tr');
            expect(captionRow.querySelector('.e-templatecell')).not.toBeNull();
        });
        it('check the visible cells true/false', () => {
            gridObj.hideColumns('Address');
            expect(gridObj.getRowsObject()[1].cells[7].visible).toBeFalsy();
        });
        it('caption collapse', (done: Function) => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            let lazyLoadGroupCollapse = function(args: any) {
                let captionRow = gridObj.getContent().querySelector('tr');
                expect(captionRow.querySelector('.e-templatecell')).not.toBeNull();
                gridObj.lazyLoadGroupCollapse = null;
                done();
            };
            gridObj.lazyLoadGroupCollapse = lazyLoadGroupCollapse;
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('LazyLoadGroup with aggregate and edit', () => {
        let gridObj: any;
        let currentPageGroupCache: Row<Column>[] = [];
        let max: number = 0;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: lazyLoadData,
                    allowGrouping: true,
                    allowPaging: true,
                    allowReordering: true,
                    showColumnChooser: true,
                    groupSettings: { enableLazyLoading: true, columns: ['ProductName', 'CustomerID'] },
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal',
                        showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'ProductName', headerText: 'Product Name', width: 120 },
                        { field: 'Quantity', headerText: 'Quantity', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 120 },
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', width: 120 },
                        { field: 'ProductID', headerText: 'Product ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerAddress', headerText: 'Address', width: 120 }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'OrderID',
                            groupFooterTemplate: 'Total units: ${Sum}'
                        },
                        {
                            type: 'Max',
                            field: 'ProductID',
                            groupCaptionTemplate: 'Maximum: ${Max}'
                        }]
                    }]
                }, done);
        });
        it('caption expand', (done: Function) => {
            const expandElem: NodeListOf<Element> = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            setTimeout(done, 200);
        });
        it('caption expand again', (done: Function) => {
            const expandElem: NodeListOf<Element> = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            setTimeout(done, 200);
        });
        it('edit first row of first caption', () => {
            const dataRow: HTMLElement = gridObj.getContentTable().querySelector('.e-row');
            gridObj.selectRow(parseInt(dataRow.getAttribute('data-rowindex'), 10));
            gridObj.startEdit();
        });
        it('edit group caption aggregate', (done: Function) => {
            const groupLazyLoadRenderer: GroupLazyLoadRenderer = gridObj.contentModule as GroupLazyLoadRenderer;
            const groupCache: { [x: number]: Row<Column>[]; } = groupLazyLoadRenderer.getGroupCache();
            currentPageGroupCache = groupCache[gridObj.pageSettings.currentPage];
            max = parseInt((currentPageGroupCache[0].data as any).aggregates['ProductID - max'], 10) + 1;
            (select('#' + gridObj.element.id + (gridObj.columns[5] as Column).field, gridObj.element) as any).value = max.toString();
            gridObj.endEdit();
            setTimeout(done, 600);
        });
        it('check group caption aggregate after edit', () => {
            expect(parseInt((currentPageGroupCache[0].data as any).aggregates['ProductID - max'], 10)).toBe(max);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Group caption 1st column template with lazyloading =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowGrouping: true,
                    groupSettings: { showDropArea: true, enableLazyLoading: true, columns: ['OrderID'] },
                    columns: [
                        { field: 'Freight', headerText: 'Freight', width: 150, format: 'C2' },
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                    ],
                    height: 290,
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            format: 'C2',
                            groupFooterTemplate: 'Sum: ${Sum}'
                        }]
                    },
                    {
                        columns: [{
                            type: 'Max',
                            field: 'Freight',
                            format: 'C2',
                            groupCaptionTemplate: 'Max: ${Max}'
                        }]
                    }]
                }, done);
        });
    
        it('check 1st column template', () => {
            expect(gridObj.getContent().querySelectorAll('.e-groupcaption')[0].innerHTML).toBe('Order ID: 10248   Max: $32.38');
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    // Lazy Load Grouping with Infinite Scroll Support
    describe('Lazy Load Group with Infinite scroll => ', () => {
        let gridObj: Grid;
        let actionComplete: any;
        let rowindex = 0;
        let sortSettings: SortSettingsModel;
        let cols: any
        let data1: number;
        let dataLength = lazyLoadData.length;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: lazyLoadData,
                    enableInfiniteScrolling: true,
                    allowGrouping: true,
                    allowFiltering: true,
                    allowSorting: true,
                    editSettings: {allowAdding: true, allowDeleting: true, allowEditing: true},
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'],
                    groupSettings: { enableLazyLoading: true, columns: ['ProductName', 'CustomerName'] },
                    height: 400,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true, validationRules: {required: true}, },
                        { field: 'ProductName', headerText: 'Product Name', width: 160 },
                        { field: 'ProductID', headerText: 'Product ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 160 },
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('check initial render', function () {
            let pageSize: number = gridObj.pageSettings.pageSize;
            let initialBlocks: number = gridObj.infiniteScrollSettings.initialBlocks;
            let captionRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr');
            expect(captionRows.length).toBe(pageSize * initialBlocks);
        });

        it('scroll to bottom', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 5500;
            setTimeout(done, 200);
        });
        it('check current page, data append and expand level1 group', () => {
            let pageSize: number = gridObj.pageSettings.pageSize;
            let currentPage: number = gridObj.pageSettings.currentPage;
            let initialBlocks: number = gridObj.infiniteScrollSettings.initialBlocks;
            let captionRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr');
            expect(currentPage).toBe(initialBlocks + 1);
            expect(captionRows.length).toBe(currentPage * pageSize);
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            gridObj.groupModule.expandCollapseRows(expandElem[33]);
        });

        it('scroll to bottom', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 5500;
            setTimeout(done, 200);
        });

        it('check datas after scroll and expand', function () {
            let pageSize: number = gridObj.pageSettings.pageSize;
            let initialBlocks: number = gridObj.infiniteScrollSettings.initialBlocks;
            let currentPage: number = gridObj.pageSettings.currentPage;
            let totalTr: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr');
            let level1CaptionRows: NodeListOf<HTMLTableRowElement> = gridObj.getContent().querySelectorAll('.e-indentcell');
            let captionRowsCount: number = totalTr.length - level1CaptionRows.length;
            expect(currentPage).toBe(initialBlocks + 2);
            expect(captionRowsCount).toBe(pageSize * currentPage);
        });

        it('scroll to expanded caption row top', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 1000;
            setTimeout(done, 200);
        });

        it('expand level2 group', function () {
            let dataRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('.e-row');
            expect(dataRows.length).toBe(0);
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            gridObj.groupModule.expandCollapseRows(expandElem[33]);
        });
        
        it('check data row, select and start edit', function () {
            let dataRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('.e-row');
            rowindex = parseInt(dataRows[0].getAttribute("data-rowindex"), 10);
            expect(dataRows.length).toBeGreaterThan(0);
            gridObj.selectRow(rowindex);
            gridObj.startEdit();
        });

        it('Check edit state, edit and save', function(){
            expect((gridObj.editModule as any).editModule.editRowIndex).toBe(rowindex);
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
            expect(gridObj.element.querySelectorAll('form').length).toBe(1);
            let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
            expect(cells.length).toBe(gridObj.columns.length);
            //primary key check
            expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
            //focus check
            expect(document.activeElement.id).toBe(gridObj.element.id + (gridObj.columns[2] as Column).field);
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            expect(gridObj.isEdit).toBeTruthy();
            rowindex = (select('#' + gridObj.element.id + (gridObj.columns[2] as Column).field, gridObj.element) as any).value;
            expect((select('#' + gridObj.element.id + (gridObj.columns[3] as Column).field, gridObj.element) as any).value).toBe(gridObj.dataSource[rowindex][(gridObj.columns[3] as Column).field]);
            (select('#' + gridObj.element.id + (gridObj.columns[3] as Column).field, gridObj.element) as any).value = 'updated';
            gridObj.endEdit();
        });

        it('filter updated data', function(done: Function){
            expect(gridObj.dataSource[rowindex][(gridObj.columns[3] as Column).field]).toBe('updated');
            let actionComplete = (args?: Object): void => {
                expect(checkFilterObj(gridObj.filterSettings.columns)).toBeTruthy();
                expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
                expect(gridObj.pageSettings.currentPage).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            filterColumn(gridObj, 'CustomerID', 'updated');
        });

        it('clear filter', (done: Function) => {
            let totalTr: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr');
            let dataRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('.e-row');
            expect(totalTr.length).toBe(1);
            expect(dataRows.length).toBe(0);
            let actionComplete = (args?: Object): void => {
                expect(gridObj.filterSettings.columns.length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('check rows after clear filter', function () {
            let pageSize: number = gridObj.pageSettings.pageSize;
            let initialBlocks: number = gridObj.infiniteScrollSettings.initialBlocks;
            let captionRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr');
            expect(captionRows.length).toBe(pageSize * initialBlocks);
        });

        it('scroll to bottom', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 5500;
            setTimeout(done, 200);
        });

        it('Sort orderID asc action', (done: Function) => {
            let pageSize: number = gridObj.pageSettings.pageSize;
            let currentPage: number = gridObj.pageSettings.currentPage;
            let captionRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr');
            expect(captionRows.length).toBe(pageSize * currentPage);
            expect(gridObj.pageSettings.currentPage).not.toBe(1);
            let actionComplete = function (args: any) {
                expect(cols[0].querySelectorAll('.e-ascending').length).toBe(1);
                expect(sortSettings.columns[2].field).toBe('OrderID');
                expect(sortSettings.columns[2].direction).toBe('Ascending');
                expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
                expect(gridObj.pageSettings.currentPage).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(3);
                done();
            }
            gridObj.actionComplete = actionComplete;
            sortSettings = gridObj.sortSettings;
            cols = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            (gridObj as any).mouseClickHandler(getClickObj(cols[0]));
        });

        it('start add', function (done: Function) {
            let actionBegin = function (args: NotifyArgs) {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                    gridObj.actionBegin = null;
                }
            }
            let actionComplete = function (args: NotifyArgs) {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.columns.length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + (gridObj.columns[0] as Column).field);
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
                    data1 = gridObj.dataSource[4999][(gridObj.columns[0] as Column).field];
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('scroll to bottom', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 15000;
            setTimeout(done, 200);
        });

        it('Save add', function(done: Function){
            let actionComplete = function(args: NotifyArgs) {
                if (args.requestType === 'save') {
                    expect(gridObj.dataSource[0][(gridObj.columns[0] as Column).field]).toBe(data1 + 1);
                    expect(gridObj.dataSource[0][(gridObj.columns[3] as Column).field]).toBe('updated');
                    expect((gridObj.dataSource as any).length).toBe(dataLength + 1);
                    expect(gridObj.isEdit).toBeFalsy();
                    expect(gridObj.dataSource[4999][(gridObj.columns[0] as Column).field]).not.toBe(data1);
                    expect(gridObj.dataSource[4999][(gridObj.columns[0] as Column).field]).toBe(data1 - 1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
            (select('#' + gridObj.element.id + (gridObj.columns[0] as Column).field, gridObj.element) as any).value = data1 + 1;
            (select('#' + gridObj.element.id + (gridObj.columns[3] as Column).field, gridObj.element) as any).value = 'updated';
            let beforeDataBound = function(args: any) {
                expect(args.result.records.length).toBe(dataLength + 1);
                // expect(args.result.records[args.result.records.length - 1][(gridObj.columns[0] as Column).field]).toBe(data1 + 1);
                gridObj.beforeDataBound = null;
            };
            gridObj.beforeDataBound = beforeDataBound;
            gridObj.actionComplete = actionComplete;
            (gridObj.editModule as any).editModule.endEdit();
        });

        it('scroll to bottom', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 900;
            setTimeout(done, 200);
        });

        it('expand 1st level group', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            gridObj.groupModule.expandCollapseRows(expandElem[33]);
        });

        it('expand 2nd level group', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            gridObj.groupModule.expandCollapseRows(expandElem[33]);
        });

        it('scroll to bottom', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 1000;
            setTimeout(done, 200);
        });

        it('check data row, select and delete', function (done: Function) {
            let dataRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('.e-row');
            rowindex = parseInt(dataRows[0].getAttribute("data-rowindex"), 10);
            expect(dataRows.length).toBeGreaterThan(0);
            gridObj.selectRow(rowindex);
            rowindex = gridObj.selectionModule['data'][(gridObj.columns[2] as Column).field];
            let actionComplete = function(args: any): any {
                if (args.requestType === 'delete') {
                    expect(gridObj.dataSource['length']).toBe(dataLength);
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    // Lazy Load Grouping with Virtual Scroll Support
    describe('Lazy Load Group with Virtual scroll => ', () => {
        let gridObj: Grid;
        let actionComplete: any;
        let rowindex = 0;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: lazyLoadData,
                    enableVirtualization: true,
                    allowGrouping: true,
                    allowFiltering: true,
                    allowSorting: true,
                    toolbar: ['Search'],
                    groupSettings: { enableLazyLoading: true, columns: ['ProductName', 'CustomerName'] },
                    height: 400,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true, validationRules: {required: true}, },
                        { field: 'ProductName', headerText: 'Product Name', width: 160 },
                        { field: 'ProductID', headerText: 'Product ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 160 },
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('check initial render', function () {
            let captionRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr');
            expect(captionRows.length).toBe(gridObj.pageSettings.pageSize);
        });

        it('scroll to bottom', function (done) {
            gridObj.getContent().firstElementChild.scrollTop = 500;
            setTimeout(done, 500);
        });
        it('check current page, data append and expand level1 group', () => {
            let blockSize: number =  (<VirtualContentRenderer>gridObj.contentModule).getBlockSize();
            let blockLen: number = (<VirtualContentRenderer>gridObj.contentModule).currentInfo.blockIndexes.length;
            let captionRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr');
            expect(captionRows.length).toBe(blockSize * blockLen);
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            gridObj.groupModule.expandCollapseRows(expandElem[5]);
        });

        it('expand level2 group', function () {
            let dataRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('.e-row');
            expect(dataRows.length).toBe(0);
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            gridObj.groupModule.expandCollapseRows(expandElem[6]);
        });

        it('check data row, select and start edit', function () {
            let dataRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('.e-row');
            rowindex = parseInt(dataRows[0].getAttribute("data-rowindex"), 10);
            expect(dataRows.length).toBeGreaterThan(0);
            gridObj.selectRow(rowindex);
        });

        it('Check Selection', function() {
            expect(gridObj.getSelectedRows().length).toBe(1);
            gridObj.clearSelection();
        });

        it('filter updated data', function(done: Function){
            let actionComplete = (args?: Object): void => {
                expect(checkFilterObj(gridObj.filterSettings.columns)).toBeTruthy();
                expect(gridObj.getContent().firstElementChild.scrollTop).toBe(0);
                expect(gridObj.pageSettings.currentPage).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            filterColumn(gridObj, 'CustomerID', gridObj.dataSource[rowindex][(gridObj.columns[3] as Column).field]);
        });

        it('clear filter', (done: Function) => {
            let actionComplete = (args?: Object): void => {
                expect(gridObj.filterSettings.columns.length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });

        it('check rows after clear filter', function () {
            let captionRows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr');
            expect(captionRows.length).toBe(gridObj.pageSettings.pageSize);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });


      // used for code coverage
     describe('Lazy Load Group code coverage => ', () => {
        let gridObj: Grid;
        let rows: any;
        let groupLazyLoadRenderer: GroupLazyLoadRenderer;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: lazyLoadData,
                    allowGrouping: true,
                    allowFiltering: true,
                    allowSorting: true,
                    toolbar: ['Search'],
                    groupSettings: { enableLazyLoading: true, columns: ['ProductName'] },
                    height: 400,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, isPrimaryKey: true, validationRules: {required: true}, },
                        { field: 'ProductName', headerText: 'Product Name', width: 160 },
                        { field: 'ProductID', headerText: 'Product ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 120 },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 160 },
                    ],
                }, done);
        });



        it('expand 1st level group', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordpluscollapse');
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
        });

        
        it('coevarge the getCacheRowsOnDownScroll and getCacheRowsOnUpScroll', function () {
            groupLazyLoadRenderer = gridObj.contentModule as GroupLazyLoadRenderer;
            rows = gridObj.getRowsObject();
            (groupLazyLoadRenderer as any).getCacheRowsOnDownScroll(0);
            (groupLazyLoadRenderer as any).getCacheRowsOnUpScroll(rows[0].uid, rows[5].uid, 0);
        });

        it('coevarge the scrollDownHandler', function () {
            (groupLazyLoadRenderer as any).scrollDownHandler(gridObj.getDataRows()[gridObj.getDataRows().length - 1]);
        });


        it('coevarge the removeTopRows and removeBottomRows', function () {
            (groupLazyLoadRenderer as any).removeTopRows(rows[0].uid, rows[1].uid, rows[2].uid);
            (groupLazyLoadRenderer as any).removeBottomRows(rows[4].uid, rows[5].uid, rows[6].uid);
        });

        it('coevarge the clearLazyGroupCache', function () {
            gridObj.isDestroyed = true;
            (groupLazyLoadRenderer as any).scrollHandler();
            gridObj.isDestroyed = false;
            groupLazyLoadRenderer.clearLazyGroupCache();
            (groupLazyLoadRenderer as any).moveCells(gridObj.getRowsObject()[0].cells, 3, 1);
        });


     

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});
