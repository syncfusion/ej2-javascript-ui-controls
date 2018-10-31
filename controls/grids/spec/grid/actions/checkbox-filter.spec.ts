/**
 * Grid Filtering spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { PredicateModel } from '../../../src/grid/base/grid-model';
import { BatchEdit } from '../../../src/grid/actions/batch-edit';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Freeze } from '../../../src/grid/actions/freeze';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { filterData } from '../base/datasource.spec';
import { createGrid, destroy, getKeyUpObj, getClickObj, getKeyActionObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Edit } from '../../../src/grid/actions/edit';

Grid.Inject(Filter, Page,Toolbar, Selection, Group, Freeze, Edit);

describe('Checkbox Filter module => ', () => {

    let checkFilterObj: Function = (obj: PredicateModel, field?: string,
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

    let filterColumn: Function = (gridObj: Grid, colName: string, value: string, keyCode?: number) => {
        let filterElement: any = gridObj.element.querySelector('#' + colName + '_filterBarcell');
        filterElement.value = value;
        filterElement.focus();
        (gridObj.filterModule as any).keyUpHandler(getKeyUpObj(keyCode ? keyCode : 13, filterElement));
    };

    let clearFilter: Function = (gridObj: Grid, done: Function) => {
        let actionComplete: any = (args?: Object): void => {
            if (gridObj.element.querySelectorAll('.e-row').length === filterData.length &&
                gridObj.filterSettings.columns.length === 0) {
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.clearFiltering();
    };

    describe('Checkbox dialog functionalities => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;     
        let checkBoxFilter: Element; 
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'CheckBox', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number' },
                    { field: 'OrderDate', format: 'yMd'}
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-searchinput').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-chk-hidden').length).toBe(72);
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);                         
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('intermediate state testing', () => {                        
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);         
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);                        
        });

        it('search box keyup testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){
                expect(gridObj.element.querySelector('.e-searchcontainer').querySelectorAll('.e-searchinput').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-chk-hidden').length).toBe(3);
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(3);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);       
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);                    
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  =gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '1024';
            (gridObj.filterModule as any).filterModule.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('search box keyup repeat testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);              
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  =gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '10249';
            (gridObj.filterModule as any).filterModule.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('search box keyup invalid input testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(0);    
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(0);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);              
                expect(checkBoxFilter.querySelector('.e-checkboxlist').children[0].innerHTML).toBe('No Matches Found');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  =gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '1024923';
            (gridObj.filterModule as any).filterModule.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('search box keyup invalid - corrected input testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);              
                expect(checkBoxFilter.children[0].tagName.toLowerCase()).not.toBe('span');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  =gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '10248';
            (gridObj.filterModule as any).filterModule.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('clear searchbox testing', (done: Function) => {                                    
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);                              
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  =gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '';
            (gridObj.filterModule as any).filterModule.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('intermediate state with keyup testing', (done: Function) => {                        
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();          
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);

            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);               
                (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();                         
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  =gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '10255';
            (gridObj.filterModule as any).filterModule.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('intermediate state with keyup - clear testing', (done: Function) => {                                    
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);                              
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  =gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '';
            (gridObj.filterModule as any).filterModule.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('select all testing', () => {                        
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();         
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
            expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(0);
            expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(72);
            // filter btn disable testing
            expect(checkBoxFilter.querySelectorAll('button')[0].getAttribute('disabled')).not.toBeNull();
            
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
            expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
            expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);
            // filter btn disable testing
            expect(checkBoxFilter.querySelectorAll('button')[0].getAttribute('disabled')).toBeNull();
            
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
            expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(70);
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
            expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);

            //repeat same - faced this issue in rare scenario
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
            expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(0);
            expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(72);
            
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
            expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
            expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);
        });

        //scenario1:  filter orderid, customerid, freight - 2 items uncheck and then clear filter freight, customerid, orderid 

        it('Filter orderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(2);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'notequal', 10248, 'and', true)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(69);                
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });        

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(69);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(69);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(43);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

      it('Filter CustomerID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(4);
                expect(checkFilterObj(gridObj.filterSettings.columns[2], 'CustomerID', 'notequal', 'ANATR', 'and', false)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(66);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });  


        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(66);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });        

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(40);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(66);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Filter Freight testing', (done: Function) => {    
            actionComplete = (args?: any): void => {       
                expect(gridObj.filterSettings.columns.length).toBe(6);
                expect(checkFilterObj(gridObj.filterSettings.columns[4], 'Freight', 'notequal', 0.12, 'and', true)).toBeTruthy();        
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(64);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(64);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });        

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(40);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(63);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter Freight testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(4);
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(66);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                               
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(66);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        
        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');          
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter CustomerID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(2);
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(69);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                               
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(43);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');          
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter OrderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {              
                expect(gridObj.filterSettings.columns.length).toBe(0); 
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        //scenario1 cases completed

        //scenario2:  filter orderid, customerid, freight - 2 items uncheck and then clear filter orderid, customerid, freight 

          it('Filter orderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(2);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'notequal', 10248, 'and', true)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(69);                
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });        

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(69);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(69);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(43);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

      it('Filter CustomerID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(4);
                expect(checkFilterObj(gridObj.filterSettings.columns[2], 'CustomerID', 'notequal', 'ANATR', 'and', false)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(66);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });  


        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(66);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });        

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(40);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(66);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Filter Freight testing', (done: Function) => {    
            actionComplete = (args?: any): void => {       
                expect(gridObj.filterSettings.columns.length).toBe(6);
                expect(checkFilterObj(gridObj.filterSettings.columns[4], 'Freight', 'notequal', 0.12, 'and', true)).toBeTruthy();        
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(64);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(64);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });        

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(40);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(63);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');          
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter OrderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(4);
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(66);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                               
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(67);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(65);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        
        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter'); 
                    expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(41);
                    expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                    expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);         
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter CustomerID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(2);
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(69);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                               
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(44);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });           

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');   
                    expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(70);
                    expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                    expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);       
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(68);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter Freight testing', (done: Function) => {    
            actionComplete = (args?: any): void => {              
                expect(gridObj.filterSettings.columns.length).toBe(0); 
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        //scenario2 cases completed

        //scenario3:  filter orderid, customerid, freight - 2 to 4 items check and then clear filter freight, customerid, orderid 

        it('Filter orderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(4);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10248, 'or', true)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(4);                
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click(); 
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[3] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[4] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });        

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(4);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(67);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(5);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(5);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

      it('Filter CustomerID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(6);
                expect(checkFilterObj(gridObj.filterSettings.columns[5], 'CustomerID', 'equal', 'TOMSP', 'or', false)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(2);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click(); 
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });  

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(1);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(3);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Filter Freight testing', (done: Function) => {    
            actionComplete = (args?: any): void => {       
                expect(gridObj.filterSettings.columns.length).toBe(7);
                expect(checkFilterObj(gridObj.filterSettings.columns[6], 'Freight', 'equal', 11.61, 'or', true)).toBeTruthy();        
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();                       
           checkBoxFilter.querySelectorAll('button')[0].click();
        });

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });        

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(1);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter Freight testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(6);
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(2);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                               
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(3);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        
        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');          
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter CustomerID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(4);
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(4);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                               
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(5);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');          
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter OrderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {              
                expect(gridObj.filterSettings.columns.length).toBe(0); 
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        //scenario3 cases completed

        //scenario4:  filter orderid, customerid, freight - 2 to 4 items check and then clear filter orderid, customerid, freight 

        it('Filter orderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(4);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10248, 'or', true)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(4);                
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click(); 
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[3] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[4] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });        

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(4);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(67);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(5);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(5);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

      it('Filter CustomerID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(6);
                expect(checkFilterObj(gridObj.filterSettings.columns[5], 'CustomerID', 'equal', 'TOMSP', 'or', false)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(2);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click(); 
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });  

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(1);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(3);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Filter Freight testing', (done: Function) => {    
            actionComplete = (args?: any): void => {       
                expect(gridObj.filterSettings.columns.length).toBe(7);
                expect(checkFilterObj(gridObj.filterSettings.columns[6], 'Freight', 'equal', 11.61, 'or', true)).toBeTruthy();        
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();                       
           checkBoxFilter.querySelectorAll('button')[0].click();
        });

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });        

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(1);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');          
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter OrderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(3);
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                               
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(2);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        
        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter'); 
                    expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                    expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                    expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);         
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter CustomerID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                               
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });           

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen') {    
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');   
                    expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                    expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                    expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);       
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(69);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter Freight testing', (done: Function) => {    
            actionComplete = (args?: any): void => {              
                expect(gridObj.filterSettings.columns.length).toBe(0); 
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        //scenario4 cases completed

        //scenario5 multiple filter on same column
        it('Filter orderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(3);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'notequal', 10248, 'or', true)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(68);                
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                               
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[3] as any).click();                       
           checkBoxFilter.querySelectorAll('button')[0].click();
        });        

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(68);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(3);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Filter orderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(2);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10251, 'or', true)).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(2);                
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeTruthy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                              
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();    
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[4] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[5] as any).click();             
           checkBoxFilter.querySelectorAll('button')[0].click();
        });        

        it('orderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(69);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Clear Filter OrderID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {              
                expect(gridObj.filterSettings.columns.length).toBe(0); 
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
                expect(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                expect(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv').classList.contains('e-filtered')).toBeFalsy();
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;
           checkBoxFilter.querySelectorAll('button')[1].click();
        });

        it('OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(72);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);   
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('EJ2-6971-Date filter search checking ', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    expect(gridObj.getColumnByField('OrderDate').type).toBe('datetime');
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                    (<any>gridObj.filterModule).filterModule.sInput.value = '7/9/1996';
                    (<any>gridObj.filterModule).filterModule.refreshCheckboxes();
                    expect(checkBoxFilter.querySelector('.e-checkboxlist.e-fields').children.length).toBeGreaterThanOrEqual(2);
                    gridObj.actionComplete =null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderDate').querySelector('.e-filtermenudiv')));
        });

        it('EJ2-7690-Search In Filtering Dialog Box Get Closed While Press "Enter Key" ', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    (<any>gridObj.filterModule).filterModule.sInput.value = 'Vinet';
                    (<any>gridObj.filterModule).filterModule.btnClick({target: (<any>gridObj.filterModule).filterModule.sInput});
                }
                if (args.requestType === 'filtering') {
                    expect(gridObj.currentViewData[0]['CustomerID']).toBe('VINET');
                    gridObj.actionComplete =null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        // time - delayed issue
    //     it('EJ2-7257-Need to hide the filter button in check box filter when no matches found like EJ1 ', (done: Function) => {            
    //         actionComplete = (args?: any): void => {
    //             if(args.requestType === 'filterafteropen'){
    //                 checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
    //                 (<any>gridObj.filterModule).filterModule.sInput.value = 'edybh';
    //                 (<any>gridObj.filterModule).filterModule.refreshCheckboxes();
    //                 expect(checkBoxFilter.querySelector('.e-footer-content').children[0].hasAttribute('disabled')).toBeTruthy();
    //                 let edit: any = (<any>new Edit(gridObj, gridObj.serviceLocator));
    //                 spyOn(edit, 'deleteRecord');
    //                 edit.keyPressHandler({action: 'delete', target: gridObj.element});
    //                 expect(edit.deleteRecord).not.toHaveBeenCalled();
    //                 gridObj.actionComplete = null;
    //                 done();
    //             }
    //         };
    //         gridObj.actionComplete = actionComplete;        
    //         (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
    //     });


    //     //scenario5 case completed

        afterAll(() => {
            destroy(gridObj);
        });
     });    

    describe('EJ2-7408 Checkbox filter for column and filter type menu => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;     
        let checkBoxFilter: Element; 
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'Menu', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string', filter: {type: 'CheckBox'} },
                    { field: 'Freight', format: 'C2', type: 'number' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){          
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');         
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

      it('Filter CustomerID testing', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(2);                
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(68);                               
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click(); 
           checkBoxFilter.querySelectorAll('button')[0].click();
        });  

        afterAll(() => {
            destroy(gridObj);
        });
    });  

    describe('EJ2-13031 Batch confirm for checkbox filter => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let checkBoxFilter: Element;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let cellEdit: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0),
                    allowFiltering: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    filterSettings: { type: 'CheckBox' },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string', filter: { type: 'CheckBox' } },
                    { field: 'Freight', format: 'C2', type: 'number' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    cellEdit: cellEdit
                }, done);
        });
        
        it('edit cell', () => {
            gridObj.editModule.editCell(1, 'CustomerID');
        });

        it('shift tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.editModule.saveCell();
        });

        it('CustomerID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterafteropen') {
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('Filter CustomerID testing', () => {
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();
            checkBoxFilter.querySelectorAll('button')[0].click();
        });
        it('Check confirm dialog', () => {
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-dialog')).toBeTruthy();
        });
        it('check data are filtered', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filtering') {
                    expect(gridObj.currentViewData[0]['CustomerID']).toBe('ANATR');
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });


        afterAll(() => {
            destroy(gridObj);
        });
    });  


});
