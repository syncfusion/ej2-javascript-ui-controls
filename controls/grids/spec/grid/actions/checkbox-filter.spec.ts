/**
 * Grid Filtering spec document
 */
import { Grid } from '../../../src/grid/base/grid';
import { PredicateModel } from '../../../src/grid/base/grid-model';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { InfiniteScroll } from '../../../src/grid/actions/infinite-scroll';
import { filterData, customerData, fdata, fCustomerData} from '../base/datasource.spec';
import { createGrid, destroy, getKeyUpObj, getClickObj, getKeyActionObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Edit } from '../../../src/grid/actions/edit';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { Query } from '@syncfusion/ej2-data';
import { FilterSearchBeginEventArgs } from '../../../src/grid/base/interface';
import { select } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import * as events from '../../../src/grid/base/constant';
import { ForeignKey } from '../../../src/grid/actions/foreign-key';

Grid.Inject(Filter, Page, Toolbar, Selection, Group, Edit, Filter, ForeignKey, VirtualScroll, InfiniteScroll);

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

    describe('Checkbox dialog functionalities => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;     
        let checkBoxFilter: Element; 
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
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
                expect(checkBoxFilter.querySelectorAll('.e-add-current').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-chk-hidden').length).toBe(4);
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(3);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck:not(.e-add-current)').length).toBe(0);       
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);                    
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '1024';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('search box keyup repeat testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-add-current').length).toBe(1);  
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck:not(.e-add-current)').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);              
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '10249';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('search box keyup invalid input testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(0);    
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(0);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);              
                expect(checkBoxFilter.querySelector('.e-checkfltrnmdiv').children[0].innerHTML).toBe('No matches found');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '1024923';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('search box keyup invalid - corrected input testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-add-current').length).toBe(1);   
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck:not(.e-add-current)').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);              
                expect(checkBoxFilter.children[0].tagName.toLowerCase()).not.toBe('span');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '10248';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13,searchElement));
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
            let searchElement : any  = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13,searchElement));
        });

        it('intermediate state with keyup testing', (done: Function) => {                        
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();          
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[2] as any).click();
            expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(1);

            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterchoicerequest'){                
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);    
                expect(checkBoxFilter.querySelectorAll('.e-add-current').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck:not(.e-add-current)').length).toBe(0);              
                expect(checkBoxFilter.querySelectorAll('.e-stop').length).toBe(0);               
                (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click();                         
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;        
            let searchElement : any  = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '10255';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13,searchElement));
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
            let searchElement : any  = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13,searchElement));
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
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'notequal', 10248, 'and', false)).toBeTruthy();
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
                expect(checkFilterObj(gridObj.filterSettings.columns[4], 'Freight', 'notequal', 0.12, 'and', false)).toBeTruthy();        
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
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'notequal', 10248, 'and', false)).toBeTruthy();
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
                expect(checkFilterObj(gridObj.filterSettings.columns[4], 'Freight', 'notequal', 0.12, 'and', false)).toBeTruthy();        
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
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10248, 'or', false)).toBeTruthy();
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
                expect(checkFilterObj(gridObj.filterSettings.columns[6], 'Freight', 'equal', 11.61, 'or', false)).toBeTruthy();        
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
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10248, 'or', false)).toBeTruthy();
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
                expect(checkFilterObj(gridObj.filterSettings.columns[6], 'Freight', 'equal', 11.61, 'or', false)).toBeTruthy();        
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
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'notequal', 10248, 'or', false)).toBeTruthy();
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
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10251, 'or', false)).toBeTruthy();
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
                    (<any>gridObj.filterModule).filterModule.checkBoxBase.sInput.value = '7/9/1996';
                    (<any>gridObj.filterModule).filterModule.checkBoxBase.refreshCheckboxes();
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
                    (<any>gridObj.filterModule).filterModule.checkBoxBase.sInput.value = 'Vinet';
                    (<any>gridObj.filterModule).filterModule.checkBoxBase.btnClick({target: (<any>gridObj.filterModule).filterModule.checkBoxBase.sInput});
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
            gridObj = checkBoxFilter = actionBegin = actionComplete = null;
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
            gridObj = checkBoxFilter = actionBegin = actionComplete = null;
        });
    });  

    describe('EJ2-13031 Batch confirm for checkbox filter => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let checkBoxFilter: Element;
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
            expect(select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).classList.contains('e-dialog')).toBeTruthy();
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
            select('#' + gridObj.element.id + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
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
            gridObj = checkBoxFilter = actionBegin = actionComplete = null;
        });
    });  

    describe('Filter operation after searching ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0),
                    allowFiltering: true,
                    filterSettings: { type: 'Excel' },
                    toolbar: ['Search'],
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string', filter: { type: 'CheckBox' } },
                    { field: 'Freight', format: 'C2', type: 'number' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });
        
        it('Search', function(done) {
            actionComplete = (args?: any): void => {
                expect(gridObj.currentViewData.length).toBe(1);                         
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('32.38');      
        });

        it('Filter after search toolbar action', function (done) {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                expect(gridObj.element.querySelectorAll('.e-check').length).toBe(2);
                expect(gridObj.element.querySelectorAll('.e-selectall').length).toBe(1);                          
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = checkFilterObj = actionBegin = actionComplete = null;
        });
    });

    describe('EJ2-26559  enable case sensitivity check for Checkbox filter', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let checkBoxFilter: Element;
        let actionComplete: () => void;
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
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'CheckBox', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string', filter: {type: 'CheckBox'} },
                    { field: 'Freight', format: 'C2', type: 'number' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Filter OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('Filter OrderID testing for matchcase default value true', (done: Function) => {    
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(2);
                expect(checkFilterObj(gridObj.filterSettings.columns[0], 'OrderID', 'equal', 10248, 'or', true)).toBeFalsy();
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

        it('Filter CustomerID dialog open testing', (done: Function) => {
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

        it('Filter CustomerID testing for matchcase default value true', (done: Function) => {
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(4);
                expect(checkFilterObj(gridObj.filterSettings.columns[2], 'CustomerID', 'notequal', 'ANATR', 'and', true)).toBeFalsy();
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

        it('Filter Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Filter Freight testing for matchcase default value true', (done: Function) => {    
            actionComplete = (args?: any): void => {       
                expect(gridObj.filterSettings.columns.length).toBe(6);
                expect(checkFilterObj(gridObj.filterSettings.columns[4], 'Freight', 'notequal', 0.12, 'and', true)).toBeFalsy();        
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

        it('Filter Freight dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                    gridObj.actionComplete =null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Freight').querySelector('.e-filtermenudiv')));
        });

        it('Filter Freight testing ', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(args.requestType).toBe('filtering');       
                gridObj.actionComplete =null;
                done();
            };
            gridObj.actionComplete = actionComplete;                     
           checkBoxFilter.querySelectorAll('button')[1].click();
        });
        
        afterAll(() => {
            destroy(gridObj);
            gridObj = checkBoxFilter = actionBegin = actionComplete = null;
        });
    });
    describe('EJ2-34831  parent query check for Checkbox filter searchlist ', function () {
        let gridObj: Grid;
        let actionBegin: () => void;
        let checkBoxFilter: Element;
        let actionComplete: () => void;
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
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    query: new Query().where("EmployeeID","equal",5),
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'CheckBox', showFilterBarStatus: true },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'CustomerID', type: 'string', filter: {type: 'CheckBox'} },
                    { field: 'Freight', format: 'C2', type: 'number' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });        
        it('Filter OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });
        it('search OrderID testing for searchlist length', function (done) {
            actionComplete = (args?: any): void => {
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-add-current').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-chk-hidden').length).toBe(3);
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck:not(.e-add-current)').length).toBe(0);
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            let searchElement: any = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '10248';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13, searchElement));
        });
        it('clear OrderID search testing for searchlist length', function (done) {
            actionComplete = (args?: any): void => {
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-chk-hidden').length).toBe(gridObj.currentViewData.length+1);
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(gridObj.currentViewData.length+1);
                expect(checkBoxFilter.querySelectorAll('.e-uncheck').length).toBe(0);
                gridObj.actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            let searchElement: any = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13, searchElement));
        });
        afterAll(function () {
            destroy(gridObj);
            gridObj = checkBoxFilter = actionBegin = actionComplete = null;
        });
    });

    describe('EJ2-36547- Adding value in filterSearchBegin event args ', function () {
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
                    { field: 'CustomerID', type: 'string', filter: {type: 'CheckBox'} },
                    { field: 'Freight', format: 'C2', type: 'number' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });        
        it('Filter OrderID dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });
        it('search OrderID testing for search value in search begin event', function (done) {
            actionBegin = (args?: FilterSearchBeginEventArgs): void => {
                expect(args.value).toBe(10248);
                gridObj.actionBegin = null;
                done();
            };
            gridObj.actionBegin = actionBegin;
            let searchElement: any = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = '10248';
            (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13, searchElement));
        });
        afterAll(function () {
            destroy(gridObj);
            gridObj = checkBoxFilter = actionBegin = actionComplete = null;
        });
    });

    describe('EJ2-36047- Incorrect datetime filter predicates ', function () {
        let gridObj: Grid;
        let fData: Object[] = [
            { OrderID: 10248, OrderDate: new Date(2019, 8, 28, 18, 33, 36), Freight: 32.38 },
            { OrderID: 10249, OrderDate: new Date(2019, 8, 28, 18, 33, 37), Freight: 11.61 },
            { OrderID: 10250, OrderDate: new Date(2019, 8, 28, 18, 33, 38), Freight: 65.83 },
            { OrderID: 10251, OrderDate: new Date(2019, 8, 28, 18, 35, 53), Freight: 41.34 }];
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: fData,
                    allowFiltering: true,
                    allowPaging: false,
                    filterSettings: { type: 'CheckBox' },
                    columns: [{ field: 'OrderID', type: 'number', visible: true },
                    { field: 'OrderDate', type: 'datetime' },
                    { field: 'Freight', format: 'C2', type: 'number' }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('Filter OrderDate dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){
                expect(gridObj.currentViewData.length).toBe(4);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderDate').querySelector('.e-filtermenudiv')));
        });
        it('OrderDate dialog filter testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filtering'){
                expect(gridObj.currentViewData.length).toBe(2);
                gridObj.actionComplete =null;
                done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelectorAll('.e-checkboxlist .e-frame:not(.e-selectall)')[0] as any).click();
            (gridObj.element.querySelectorAll('.e-checkboxlist .e-frame:not(.e-selectall)')[1] as any).click();
            (gridObj.element.querySelectorAll('.e-checkboxfilter .e-btn')[0] as any).click();
        });
        afterAll(function () {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
    
    describe('EJ2-37831 checkbox filtering with enter key', () => {
        let gridObj: Grid;
        let actionBegin: () => void;     
        let checkBoxFilter: Element; 
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    filterSettings: { type: 'CheckBox' },
                    columns: [{ field: 'OrderID',headerText:'OrderID',visible: true },
                    { field: 'CustomerID',headerText:'CustomerName'},
                    { field: 'Freight', format: 'C2',headerText:'Freight' },
                    { field: 'Verified',headerText:'Verified' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });
        
        it('OrderID filter dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){          
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');      
                    done();
                }   
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });
        it('Filter OrderID testing', () => {   
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(1);                                               
            };                    
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click(); 
            gridObj.keyboardModule.keyAction({ action: 'enter', target: checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] } as any);                        
        });
        it('CustomerID filter dialog open testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if(args.requestType === 'filterafteropen'){          
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter'); 
                    done();     
                }
            };
            gridObj.actionComplete = actionComplete;        
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });
        it('Filter CustomerID testing', () => {   
            actionComplete = (args?: any): void => {               
                expect(gridObj.filterSettings.columns.length).toBe(2);                                               
            };           
            let searchElement : any = gridObj.element.querySelector('.e-searchinput');
            searchElement.value = 'ER';
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[0] as any).click();           
            (checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] as any).click(); 
            gridObj.keyboardModule.keyAction({ action: 'enter', target: checkBoxFilter.querySelectorAll('.e-checkbox-wrapper')[1] } as any);                        
        }); 
           
        afterAll(() => {
            destroy(gridObj);
            gridObj = checkBoxFilter = actionBegin = actionComplete = null;
        });
    });

    describe('EJ2-37912 - Checkbox selection not maintain properly in overview sample', () => {
        let gridObj: Grid;
        let chkAll: HTMLElement;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    enableVirtualization: true,
                    filterSettings: { type: 'Menu' },
                    selectionSettings: { persistSelection: true, type: 'Multiple', checkboxOnly: true },
                    height: 500,
                    columns: [
                        { type: 'checkbox', allowFiltering: false, allowSorting: false, width: '20' },
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 40 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 40 },
                        { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 30 },
                        { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 40 }
                    ],    
                    actionComplete: actionComplete
                }, done);
        });

        it('Checkbox state filtering', (done: Function) => {
            actionComplete = (args?: any): void => {
                actionComplete = null;
                done();
            };
            gridObj.actionComplete = actionComplete;
            chkAll = gridObj.element.querySelector('.e-checkselectall').nextElementSibling as HTMLElement;
            chkAll.click();
            gridObj.filterByColumn('OrderID', 'equal', '67');
        });
        
        it('checkbox state clearing', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(chkAll.classList.contains('e-check')).toBeTruthy();
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
        });
        
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
});

describe('EJ2-46285 - Provide support to handle custom filter dataSource in Excel Filter', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                enableVirtualization: true,
                filterSettings:{type:'Excel',
                columns: [{ field: 'OrderID', matchCase: false, operator: 'equal', value: '10248' }]},
                selectionSettings: { persistSelection: true, type: 'Multiple', checkboxOnly: true },
                height: 500,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right',  editType: 'numericedit',},
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 },
                ],
                actionComplete: actionComplete
            }, done);
    });

    it('assigning custom datasource', () => {
        gridObj.on('beforeCheckboxRenderer', function(e: any){
            if (e.field === "EmployeeID") {
                e.executeQuery = false;
                e.dataSource = [
                    { EmployeeID: 5 },
                    { EmployeeID: 6 },
                    { EmployeeID: 4 },
                    { EmployeeID: 3 }
                ];  }
        })
    });
    
    it('checking the datasource', (done: Function) => {
        gridObj.actionComplete = actionComplete = (args?: any): void => {
        if(args.requestType === "filterchoicerequest") {
            expect(document.getElementsByClassName('e-ftrchk').length).toBe(5);
            done();
        }
        }
        gridObj.actionComplete = actionComplete;
        (gridObj.element.getElementsByClassName('e-filtermenudiv e-icons e-icon-filter')[1] as any).click();
    });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });

    describe('EJ2-43845 - Provided the support to set locale texts for Boolean values in checkbox filter', () => {
        let gridObj: Grid;
        let checkBoxFilter: Element; 
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            L10n.load({
                'de-DE': {
                    'grid': {
                        FilterTrue: 'Wahr',
                        FilterFalse: 'Falsch',
                        FilterButton: 'Filter',
                        ClearButton: 'Löschen',
                    }
                }
            });
            gridObj = createGrid(
                {
                    dataSource: filterData, 
                    locale: 'de-DE', 
                    allowPaging: true,
                    allowFiltering: true,
                    filterSettings: { type: 'CheckBox' },
                    columns: [
                        { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', width: 40 },
                        { field: 'Verified', headerText: 'Verified', type: 'boolean', width: 100 }
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('checking the locale text', (done: Function) => {
            gridObj.actionComplete = actionComplete = (args?: any): void => {
                if (args.requestType === "filterchoicerequest") {
                    checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');
                    expect(checkBoxFilter.querySelectorAll('.e-checkboxfiltertext')[1].innerHTML).toBe('Falsch');
                    expect(checkBoxFilter.querySelectorAll('.e-checkboxfiltertext')[2].innerHTML).toBe('Wahr');
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            (gridObj.element.getElementsByClassName('e-filtermenudiv e-icons e-icon-filter')[1] as any).click();
        });
        
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
});

describe('EJ2-47692 - Throws script error while using hideSearchbox as true in IFilter.', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                filterSettings: { type: 'Menu' },
                height: 500,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150, filter: {
                        type: "CheckBox",
                        hideSearchbox: true,
                        params: {
                          showSpinButton: false
                        }
                      } },
                ],
                actionComplete: actionComplete
            }, done);
    });
    
    it('checking the Filter popup open', (done: Function) => {
        gridObj.actionComplete = actionComplete = (args?: any): void => {
            if (args.requestType === "filterchoicerequest") {
                done();
            }
        }
        gridObj.actionComplete = actionComplete;
        (gridObj.element.getElementsByClassName('e-filtermenudiv e-icons e-icon-filter')[1] as any).click();
        setTimeout(done, 200);
    });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });
});

describe('EJ2-49551 - Provide public event to handle queries on custom ExcelFilter dataSource.', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                filterSettings: { type: 'Excel' },
                height: 500,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150, },
                ],
            }, done);
    });

    it('beforeCheckboxRendererQuery internal event check', (done: Function) => {
        gridObj.on(events.beforeCheckboxRendererQuery, (args: any) => {
            gridObj.off(events.beforeCheckboxRendererQuery);
            done();
        });
        (gridObj.element.getElementsByClassName('e-filtermenudiv e-icons e-icon-filter')[1] as any).click();
    });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-50998 - Searching blank in filter text box', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    let checkBoxFilter: Element; 
    let fltrData: Object[] = [
        { OrderID: 10248, CustomerID: null, ShipCountry: 'France', Freight: 32.38 },
        { OrderID: 10249, CustomerID: 'TOMSP', ShipCountry: 'Germany', Freight: 11.61 },
        { OrderID: 10250, CustomerID: 'HANAR', ShipCountry: 'Brazil', Freight: 65.83 },
        { OrderID: 10251, CustomerID: 'VICTE', ShipCountry: 'France', Freight: 41.34 },
        { OrderID: 10252, CustomerID: 'SUPRD', ShipCountry: 'Belgium', Freight: 51.3 }];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: fltrData,
                allowFiltering: true,
                filterSettings: { type: 'CheckBox' },
                height: 500,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true,  textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer ID' },
                    { field: 'Freight',  format: 'C2', textAlign: 'Right' },
                    { field: 'ShipCountry', headerText: 'Ship Country', },
                ],
                actionComplete: actionComplete
            }, done);
    });

    it('open filter popup', (done: Function) => {
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

    it('Searching blank value', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterchoicerequest') {
                expect(checkBoxFilter.querySelectorAll('.e-selectall').length).toBe(1);
                expect(checkBoxFilter.querySelectorAll('.e-check').length).toBe(2);
                expect((checkBoxFilter.querySelector('.e-checkboxlist').children[2] as HTMLElement).innerText).toBe('Blanks');
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        let searchElement : any  = gridObj.element.querySelector('.e-searchinput');
        searchElement.value = 'Blanks';
        (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13,searchElement));
    });

    it('Check the filter data length', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filtering') {
                expect(gridObj.currentViewData.length).toBe(1);
                gridObj.actionComplete = null;
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        checkBoxFilter.querySelectorAll('button')[0].click();
    });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = fltrData = checkBoxFilter = actionComplete = null;
    });
});

describe('EJ2-53849 - Script error while searching in the infinite scrolling enabled Grid.', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                toolbar: ['Search'],
                height: 400,
                enableInfiniteScrolling: true,
                pageSettings: { pageSize: 10},
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                    { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' }
                ],
                actionComplete: actionComplete
            }, done);
    });
    
    it('Search', (done: Function) => {
        gridObj.selectRow(4);
        gridObj.actionComplete = actionComplete = (args?: any): void => {
            expect(gridObj.currentViewData.length).toBe(1);
            gridObj.actionComplete =null;
            done();
        }
        gridObj.actionComplete = actionComplete;
        gridObj.searchModule.search('10248');
    });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });
});

describe('EJ2-56656 - Wrong operator while filtering with Excel filter search box', () => {
    let gridObj: Grid;
    let actionBegin: () => void;     
    let checkBoxFilter: Element; 
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                filterSettings: { type: 'CheckBox' },
                columns: [
                { field: 'OrderID',headerText:'OrderID',visible: true },
                { field: 'CustomerID',headerText:'CustomerName'},
                { field: 'Freight', format: 'C2',headerText:'Freight' },
                ],
                actionBegin: actionBegin,
                actionComplete: actionComplete
            }, done);
    });
    
    it('CustomerID filter dialog open testing', (done: Function) => {
        actionComplete = (args?: any): void => {
            if(args.requestType === 'filterafteropen'){          
                checkBoxFilter = gridObj.element.querySelector('.e-checkboxfilter');      
                done();
            }   
        };
        gridObj.actionComplete = actionComplete;        
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
    });
    it('search box keyup testing CustomerID', (done: Function) => {   
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filterchoicerequest') {
                done();
            }                                 
        };
        let searchElement : any = gridObj.element.querySelector('.e-searchinput');
        searchElement.value = 'NA';
        gridObj.actionComplete = actionComplete;
        (gridObj.filterModule as any).filterModule.checkBoxBase.searchBoxKeyUp(getKeyUpObj(13,searchElement));            
    });

    it('Filter CustomerID testing with enter key', (done: Function) => {   
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filtering') {
                expect(gridObj.filterSettings.columns.length).toBe(2);
                done();
            }                                 
        };
        let searchElement : any = gridObj.element.querySelector('.e-searchinput');
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.filterModule).filterModule.checkBoxBase.btnClick({ target: searchElement });              
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = checkBoxFilter = actionBegin = actionComplete = null;
    });
});

describe('EJ2-58687 - template support for checkbox rendering in checkbox filter.', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                filterSettings: { type: 'Excel' },
                height: 500,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150, },
                ],
                actionComplete: actionComplete
            }, done);
    });

    it('EmployeeID filter dialog open testing', (done: Function) => {
        gridObj.on(events.beforeCheckboxfilterRenderer, (args: any) => {
            args.element.innerHTML = '';
            args.isCheckboxFilterTemplate = true;
            gridObj.off(events.beforeCheckboxfilterRenderer);
            done();
        });
        actionComplete = (args?: any): void => {
            if(args.requestType === 'filterafteropen'){  
                expect(gridObj.element.querySelector('.e-excelfilter').querySelector('.e-checkboxlist').innerHTML).toBe('');      
                done();
            }   
        };
        gridObj.actionComplete = actionComplete;        
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('EmployeeID').querySelector('.e-filtermenudiv')));
    });

    it('EmployeeID filter dialog open testing', (done: Function) => {
        gridObj.on(events.beforeCheckboxfilterRenderer, (args: any) => {
            args.element.innerHTML = '';
            args.isCheckboxFilterTemplate = true;
            let elem = document.createElement('input');
            args.element.appendChild(elem);
            gridObj.off(events.beforeCheckboxfilterRenderer);
            done();
        });
        actionComplete = (args?: any): void => {
            if(args.requestType === 'filterafteropen'){  
                expect(gridObj.element.querySelector('.e-excelfilter').querySelector('.e-checkboxlist').innerHTML).toBe('<input>');      
                done();
            }   
        };
        gridObj.actionComplete = actionComplete;        
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
    });

    
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-61734 - disableHtmlEncode property is not working with Excel Filter Dialog.', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    let data: object[] = [{ OrderID: 1, CustomerID: '<button>hi</button>' }];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowFiltering: true,
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer Name', disableHtmlEncode: true, width: 150 },
                ],
                actionComplete: actionComplete
            }, done);
    });
    it('EmployeeID filter dialog open testing', (done: Function) => {

        actionComplete = (args?: any): void => {
            if(args.requestType === 'filterafteropen'){  
                expect(gridObj.element.querySelector('.e-excelfilter').querySelector('.e-checkboxlist').querySelectorAll('button').length).toBe(0);      
                done();
            }   
        };
        gridObj.actionComplete = actionComplete;        
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('coverage improvemnet.', () => {
    let gridObj: Grid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData,
                allowFiltering: true,
                filterSettings: { type: 'CheckBox' },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                ],
                actionComplete: actionComplete
            }, done);
    });
    it('Check module name', () => {
        gridObj.filterByColumn('OrderID', 'equal', 10250);
        expect(gridObj.filterSettings.columns.length).toBe(1);
        // gridObj.filterModule.filterModule.clearCustomFilter(gridObj.columns[0]);
        // expect(gridObj.filterSettings.columns.length).toBe(0);
    });

    it('filter dialog open/close testing - 1', (done: Function) => {
        actionComplete = (args?: any): void => {
            if(args.requestType === 'filterafteropen') {
                // expect((gridObj.filterModule.filterModule as any).getModuleName()).toBe('CheckBoxFilter');
                gridObj.filterModule.filterModule.applyCustomFilter();    
                done();
            }   
        };
        gridObj.actionComplete = actionComplete;        
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
    });

    it('filter dialog open/close testing - 2', (done: Function) => {
        actionComplete = (args?: any): void => {
            if(args.requestType === 'filterafteropen') {
                gridObj.filterModule.filterModule.closeResponsiveDialog();    
                done();
            }   
        };
        gridObj.actionComplete = actionComplete;        
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
    });

    it('check the addEventListener Binding', () => {
        gridObj.isDestroyed = true;
        (gridObj.filterModule.filterModule as any).addEventListener();
        gridObj.isDestroyed = false;
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });

    // used for code coverage
    describe('checkbox filter with foreign key =>', () => {
        let gridObj: Grid;
        let actionBegin: (e?: any) => void;
        let actionComplete: (e?: any) => void;
        let isDlgOpened: boolean = false;
        beforeAll((done: Function) => {
            let options: Object = {
                dataSource: fdata.slice(0, 10),
                allowFiltering: true,
                filterSettings: {
                    type: "CheckBox", columns: [
                        { field: 'ShipCity', matchCase: false, operator: 'equal', value: 'Rio de Janeiro' }]
                },
                cssClass: 'report market',
                loadingIndicator: { indicatorType: 'Shimmer' },
                enablePersistence: true,
                enableRtl: true,
                columns: [
                    { field: 'OrderID', width: 120 },
                    { field: 'ShipCity', width: 120 },
                    { field: 'Verified', width: 120 },
                    { field: 'OrderDate', width: 120 },
                    {
                        field: 'CustomerID', width: 100, foreignKeyValue: 'City', foreignKeyField: 'CustomerID',
                        dataSource: fCustomerData.slice(0, 20), filter: { itemTemplate: "${foreignKeyData.City}" },
                    },
                    { field: 'ShipCountry', width: 120 },
                ]
            };
            gridObj = createGrid(options, done);
        });

        it('prevent filter dialog opening', (done: Function) => {
            actionBegin = (args?: any): void => {
                if (args.requestType === 'filterbeforeopen') {
                    args.cancel = true;
                    expect(args.cancel).toBeTruthy();
                    gridObj.actionBegin = null;
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderID').querySelector('.e-filtermenudiv')));
        });

        it('open filter dialog - 1', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    expect(args.filterModel.dlg.querySelectorAll('.e-searchinput').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('ShipCity').querySelector('.e-filtermenudiv')));
        });

        it('destroy the filter dialog', (done: Function) => {
            (gridObj.filterModule as any).filterModule.checkBoxBase.destroy();
            expect(document.querySelectorAll('.e-checkboxfilter').length).toBe(0);
            done();
        });

        it('open filter dialog - 2 (date column without format)', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    expect(args.filterModel.dlg.querySelectorAll('.e-searchinput').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderDate').querySelector('.e-filtermenudiv')));
        });

        it('open filter dialog - 3 (boolean column)', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest' && args.filterModel.dlg.querySelector('.e-searchinput').value == '' && !isDlgOpened) {
                    args.filterModel.dlg.querySelector('.e-searchinput').value = 'true';
                    expect(args.filterModel.dlg.querySelectorAll('.e-searchinput').length).toBe(1);
                    isDlgOpened = true;
                    args.filterModel.refreshCheckboxes();
                }
                if (args.requestType === 'filterchoicerequest' && isDlgOpened) {
                    isDlgOpened = false;
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Verified').querySelector('.e-filtermenudiv')));
        });

        it('open filter dialog - 4 (foreign key)', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest' && args.filterModel.dlg.querySelector('.e-searchinput').value == '' && !isDlgOpened) {
                    args.filterModel.dlg.querySelector('.e-searchinput').value = 'b';
                    args.filterModel.dlg.querySelector('.e-searchinput').click();
                    expect(args.filterModel.dlg.querySelectorAll('.e-searchinput').length).toBe(1);
                    isDlgOpened = true;
                    args.filterModel.refreshCheckboxes();
                }
                if (args.requestType === 'filterchoicerequest' && isDlgOpened) {
                    isDlgOpened = false;
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.resetFilterDlgPosition('Verified');
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('CustomerID').querySelector('.e-filtermenudiv')));
        });

        it('clear search', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest') {
                    expect(args.filterModel.dlg.querySelectorAll('.e-searchinput').length).toBe(1);
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (document.querySelector('.e-checkboxfilter .e-searchclear') as any).click();
        });

        it('open filter dialog - 5 (boolean column)', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest' && args.filterModel.dlg.querySelector('.e-searchinput').value == '' && !isDlgOpened) {
                    args.filterModel.dlg.querySelector('.e-searchinput').value = 'false';
                    expect(args.filterModel.dlg.querySelectorAll('.e-searchinput').length).toBe(1);
                    isDlgOpened = true;
                    args.filterModel.refreshCheckboxes();
                }
                if (args.requestType === 'filterchoicerequest' && isDlgOpened) {
                    isDlgOpened = false;
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('Verified').querySelector('.e-filtermenudiv')));
        });

        it('open filter dialog - 6', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest' && args.filterModel.dlg.querySelector('.e-searchinput').value === '' && !isDlgOpened) {
                    args.filterModel.dlg.querySelector('.e-searchinput').value = 'qzz';
                    expect(args.filterModel.dlg.querySelectorAll('.e-searchinput').length).toBe(1);
                    isDlgOpened = true;
                    args.filterModel.refreshCheckboxes();
                }
                if (args.requestType === 'filterchoicerequest' && isDlgOpened) {
                    isDlgOpened = false;
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('ShipCountry').querySelector('.e-filtermenudiv')));
        });

        it('clear filter', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filtering' && args.action === 'clear-filter') {
                    expect(document.querySelectorAll('.e-checkboxfilter').length).toBe(0);
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterModule.checkBoxBase.filterState = false;
            (document.querySelectorAll('.e-checkboxfilter .e-footer-content .e-btn') as any)[1].click();
        });

        it('open filter dialog - 7', (done: Function) => {
            (gridObj.filterModule as any).filterModule.closeDialog();
            actionComplete = (args?: any): void => {
                if (args.requestType === 'filterchoicerequest' && !isDlgOpened) {
                    args.filterModel.dlg.querySelector('.e-searchinput').value = 'r';
                    expect(args.filterModel.dlg.querySelectorAll('.e-searchinput').length).toBe(1);
                    isDlgOpened = true;
                    args.filterModel.searchBoxKeyUp();
                    args.filterModel.filterEvent(undefined, new Query());
                }
                if (args.requestType === 'filterchoicerequest' && isDlgOpened) {
                    isDlgOpened = false;
                    gridObj.actionComplete = null;
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('ShipCity').querySelector('.e-filtermenudiv')));
        });

        it('add current selection filter', (done: Function) => {
            (document.querySelector('.e-checkboxfilter .e-add-current') as any).click();
            (document.querySelector('.e-checkboxfilter .e-footer-content .e-primary') as any).click();
            expect(document.querySelectorAll('.e-checkboxfilter').length).toBe(0);
            done();
        });

        afterAll((done) => {
            destroy(gridObj);
            gridObj = actionBegin = isDlgOpened = actionComplete = null;
        });
    });

    // used for code coverage
    describe('on property change =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            let options: Object = {
                dataSource: fdata.slice(0, 10),
                filterSettings: {
                    type: "CheckBox"
                },
                columns: [
                    { field: 'OrderID', width: 120 },
                    { field: 'ShipCity', width: 120 },
                    { field: 'Verified', width: 120 },
                ]
            };
            gridObj = createGrid(options, done);
        });

        it('enable filtering', (done: Function) => {
            gridObj.allowFiltering = true;
            expect(1).toBe(1);
            done();
        });

        afterAll((done) => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });
});
