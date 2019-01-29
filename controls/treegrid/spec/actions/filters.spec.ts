import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData } from '../base/datasource.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { actionComplete } from '@syncfusion/ej2-grids';
import { Filter } from '../../src/treegrid/actions/filter';
import { CellSaveEventArgs } from '../../src';
/**
 * Grid base spec 
 */
TreeGrid.Inject(Filter);
describe('Filter module', () => {
  describe('Hierarchy Filter Mode Testing - Parent', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let originalTimeout: number;
    let actionComplete: () => void;

    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });
    it('Check the filered records for parent mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
         expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
          expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Plan timeline").toBe(true);
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn("taskName","startswith","Plan");
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hierarchy Filter Mode Testing - Child', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true, 
          filterSettings: { hierarchyMode: 'Child' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the filtered records for child mode', (done: Function) => {

        actionComplete = (args?: Object): void => {
           expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(true);
           expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Develop prototype").toBe(true);
           expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Development Task 1").toBe(true); 
           done();
        }
        gridObj.grid.actionComplete = actionComplete;

      gridObj.filterByColumn("taskName","startswith","dev");
      
     
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hierarchy Filter Mode Testing - Child1', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true, 
          filterSettings: { hierarchyMode: 'Child' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the filtered records for child mode', (done: Function) => {

        actionComplete = (args?: Object): void => {
           expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
           expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
           expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Plan timeline").toBe(true); 
           done();
        }
        gridObj.grid.actionComplete = actionComplete;

      gridObj.filterByColumn("taskName","startswith","Plan");
      
     
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hierarchy Filter Mode Testing - Child2', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=> void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true, 
          filterSettings: { hierarchyMode: 'Child' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the filtered records for child mode', (done: Function) => {

        actionComplete = (args?: Object): void => {
           expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
           expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Implementation Module 1").toBe(true);
           done();
        }
        gridObj.grid.actionComplete = actionComplete;

      gridObj.filterByColumn("taskName","startswith","phase");
      
     
    });

    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hierarchy Filter Mode Testing - Both', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=>void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true, 
          filterSettings: { hierarchyMode: 'Both' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the filtered records for Both mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Implementation Phase").toBe(true);
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Phase 1").toBe(true);
            expect(isNullOrUndefined(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
            expect(isNullOrUndefined(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
            expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Implementation Module 1").toBe(true);
            done();
        }
        gridObj.grid.actionComplete = actionComplete;
      gridObj.filterByColumn("taskName","startswith","Phase 1")
     });
    afterAll(() => {
      destroy(gridObj);
    });
  });

  describe('Hierarchy Filter Mode Testing - None', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=>void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true, 
          filterSettings: { hierarchyMode: 'None' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the filtered records for None mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows().length ==1).toBe(true);
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(true);
              done();
        }
        gridObj.grid.actionComplete = actionComplete;
      gridObj.filterByColumn("taskName","startswith","All");
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Hierarchy Filter - Basics of Filtering', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=> void; 
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true,
          filterSettings: { hierarchyMode: 'Child' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the filter levels - filter', (done: Function) => {
        expect(gridObj.getRows().length == 36).toBe(true);
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector(".e-treecolumn-container").getAttribute("style") == "padding-left:0px");
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector(".e-treecolumn-container").getAttribute("style") == "padding-left:25px");
            expect(gridObj.getRows()[4].getElementsByClassName('e-rowcell')[1].querySelector(".e-treecolumn-container").getAttribute("style") == "padding-left:0px")
                  done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn("taskName","startswith","De");

    });
    it('Check the filter levels - clearfilter', (done: Function) => {
      actionComplete = (args?: Object): void => {
          expect(gridObj.getRows().length == 36).toBe(true);
          expect(gridObj.getRows()[14].getElementsByClassName('e-rowcell')[1].querySelector(".e-treecolumn-container").getAttribute("style") == "padding-left:75px")
                 done();
      }
      gridObj.grid.actionComplete = actionComplete;
      gridObj.clearFiltering();

  });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Remove Filtering Method', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=>void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true, 
          filterSettings: { hierarchyMode: 'None' },
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('remove the single column alone', (done: Function) => {
        actionComplete = (args?: Object): void => {
           expect(gridObj.getRows().length === 36).toBe(true);
           done();
        }
      gridObj.filterByColumn("taskName","startswith","All");
      gridObj.grid.actionComplete = actionComplete;
      gridObj.removeFilteredColsByField("taskName");
  });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Filtering and sorting', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=>void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowSorting: true,
          allowFiltering: true,
          sortSettings: {columns: [{field: 'taskName', direction: 'Ascending'}]},
          filterSettings: { hierarchyMode: 'Child'},

          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
        },
        done
      );
    });

    it('Filtering with sorting functionality', (done: Function) => {
      actionComplete = (args?: Object): void => {
          expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Develop prototype").toBe(true);
          done();
      }
      gridObj.grid.dataBound = actionComplete;
    gridObj.filterByColumn("taskName","startswith","dev");
});
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Filtering Propertychange', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=>void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowSorting: true,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('allowFiltering and filterSettings using onproperty', (done: Function) => {
      actionComplete = (args?: Object) => {
        expect(document.getElementsByClassName("e-filterbarcell").length > 0).toBe(true);
        done();
      };
      gridObj.grid.actionComplete = actionComplete;
      gridObj.allowFiltering = true;
      gridObj.filterSettings = { hierarchyMode: 'Child' };
});
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Without child and parent in child mode', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=>void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowFiltering: true,
          filterSettings: { hierarchyMode: 'Child' }, 
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Filtering', (done: Function) => {
      actionComplete = (args?: Object) => {
        expect(gridObj.element.getElementsByClassName('e-treecolumn-container')[0].querySelectorAll('span').length).toBe(1);
        done();
      };
      gridObj.grid.actionComplete = actionComplete;
      gridObj.filterByColumn('taskName', 'startswith', 'allo');
});
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Without child and parent in child mode', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let actionComplete: ()=>void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          allowFiltering: true,
          filterSettings: { hierarchyMode: 'Child' }, 
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Checking filter levels', (done: Function) => {
      actionComplete = (args?: Object) => {
        expect(gridObj.getCurrentViewRecords()[1]['filterLevel']).toBe(1);
        done();
      };
      gridObj.grid.actionComplete = actionComplete;
      gridObj.filterByColumn('taskName', 'startswith', 'design');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Excel Filter Type Testing - Parent', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let originalTimeout: number;
    let actionComplete: () => void;

    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowFiltering: true,
          filterSettings: { type: 'Excel'},
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });
    it('Check the count of checkboxes in excel filter ', (done: Function) => {
      actionComplete = (args?: Object): void => {
        expect(gridObj.element.getElementsByClassName('e-label e-checkboxfiltertext').length==27).toBe(true);
        done();
      }
      gridObj.grid.actionComplete = actionComplete;
      (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
    describe('Excel Filter Checkbox Testing Of One Column After Filtering Another Column- Parent', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let actionComplete: (args: CellSaveEventArgs) => void ;
  
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowFiltering: true,
            filterSettings: { hierarchyMode: 'None', type: 'Excel' },
            columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          },
          done
        );
      });
      it('Check the filtered records for checkbox count', (done: Function) => {
          actionComplete = (args: CellSaveEventArgs) => {
            if(args.requestType === 'filterchoicerequest'){
            expect(gridObj.element.getElementsByClassName('e-label e-checkboxfiltertext').length == 6).toBe(true);
            }
           done();
          }
          gridObj.grid.actionComplete = actionComplete;
          gridObj.filterByColumn("duration","equal",11);
          (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });
   describe('Excel Clear Filter Testing - Parent', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let actionComplete: (args: CellSaveEventArgs) => void;
  
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowFiltering: true,
            filterSettings: { type: 'Excel', hierarchyMode: 'None'},
            columns: ['taskID', 'taskName', 'startDate', 'duration'],
          },
          done
        );
      });
      it('Check the filter levels - before clearfilter', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
            expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelectorAll(".e-treecolumn-container")[0].childNodes.length == 5).toBe(true);
            done();
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'phase');
    });
    it('Check the filter levels - after clearfilter', (done: Function) => {
      actionComplete = (args: CellSaveEventArgs): void => {
        if(args.requestType === 'refresh'){
          expect(gridObj.getRows().length == 36).toBe(true);
          expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelectorAll(".e-treecolumn-container")[0].childNodes.length == 4).toBe(true);
        }
        done();
      }
      gridObj.grid.actionComplete = actionComplete;
      (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
      (<HTMLElement>gridObj.element.getElementsByClassName('e-menu-item')[0]).click();

  });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    describe('Excel Filter Custom Filter Testing - With AND', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let originalTimeout: number;
      let actionComplete: (args: CellSaveEventArgs) => void;
  
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowFiltering: true,
            filterSettings: { type: 'Excel', hierarchyMode: 'None'},
            columns: ['taskID', 'taskName', 'startDate', 'duration'],
          },
          done
        );
      });
      it('Check the AND of custom filter- Mouseover', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
          if(args.requestType === 'filterchoicerequest'){
          expect(document.getElementsByClassName('e-excel-menu')[0].querySelectorAll('.e-menu-item ').length ==9).toBe(true);
          }
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
          (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
          gridObj.element.getElementsByClassName('e-menu-item')[1].dispatchEvent(new Event('mouseover'));
          var mouseEve = document.createEvent('MouseEvents');
          mouseEve.initEvent('mouseover', true, true);
          gridObj.element.getElementsByClassName('e-menu-item')[1].dispatchEvent(mouseEve);
          
      });
      it('Check the AND of custom filter', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
          if(args.requestType === 'filtering'){
         expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(true);
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Software Specification").toBe(true);
        }
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>document.getElementsByClassName('e-excel-menu')[0].querySelector('.e-menu-item')).click();
        var dd1Obj=(<any>document.getElementById('taskName-xlfl-frstoptr')).ej2_instances[0];
        dd1Obj.value ="contains";
        var act1Obj = (<any>document.getElementById('taskName-xlfl-frstvalue')).ej2_instances[0];
        act1Obj.value="software";
        var dd2Obj=(<any>document.getElementById('taskName-xlfl-secndoptr')).ej2_instances[0];
        dd2Obj.value ="contains"
        var act2Obj = (<any>document.getElementById('taskName-xlfl-secndvalue')).ej2_instances[0];
        act2Obj.value="specification";
        (<HTMLElement>document.getElementsByClassName('e-footer-content')[0].querySelector('.e-primary')).click();
    });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    describe('Excel Filter Custom Filter Testing - With OR', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let originalTimeout: number;
      let actionComplete: (args: CellSaveEventArgs) => void;
  
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowFiltering: true,
            filterSettings: { type: 'Excel', hierarchyMode: 'None'},
            columns: ['taskID', 'taskName', 'startDate', 'duration'],
          },
          done
        );
      });
      it('Check the OR of custom filter- Mouseover', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
          if(args.requestType === 'filterchoicerequest'){
          expect(document.getElementsByClassName('e-excel-menu')[0].querySelectorAll('.e-menu-item ').length ==9).toBe(true);
          }
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
          (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
          gridObj.element.getElementsByClassName('e-menu-item')[1].dispatchEvent(new Event('mouseover'));
          var mouseEve = document.createEvent('MouseEvents');
          mouseEve.initEvent('mouseover', true, true);
          gridObj.element.getElementsByClassName('e-menu-item')[1].dispatchEvent(mouseEve);
      });
      it('Check the OR of custom filter', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
          if(args.requestType === 'filtering'){
         expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
         expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design").toBe(true);
         expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design Documentation").toBe(true);
         expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design complete").toBe(true);

        }
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>document.getElementsByClassName('e-excel-menu')[0].querySelector('.e-menu-item')).click();
        var act1Obj = (<any>document.getElementById('taskName-xlfl-frstvalue')).ej2_instances[0];
        act1Obj.value="design";
        var predicate1Obj=(<any>document.getElementById('taskNamee-xlfl-frstpredicate')).ej2_instances[0];
        predicate1Obj.checked=false;
        var predicate2Obj=(<any>document.getElementById('taskNamee-xlfl-secndpredicate')).ej2_instances[0];
        predicate2Obj.checked=true;
        var ddObj=(<any>document.getElementById('taskName-xlfl-secndoptr')).ej2_instances[0];
        ddObj.value ="contains"
        var act2Obj = (<any>document.getElementById('taskName-xlfl-secndvalue')).ej2_instances[0];
        act2Obj.value="design";
        (<HTMLElement>document.getElementsByClassName('e-footer-content')[0].querySelector('.e-primary')).click();
    });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    describe('Excel Filter Custom Filter Testing - MatchCase', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let originalTimeout: number;
      let actionComplete: (args: CellSaveEventArgs) => void;
  
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowFiltering: true,
            filterSettings: { type: 'Excel', hierarchyMode: 'None'},
            columns: ['taskID', 'taskName', 'startDate', 'duration'],
          },
          done
        );
      });
      it('Check the custom filter of excel filter', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
          if(args.requestType === 'filterchoicerequest'){
          expect(document.getElementsByClassName('e-excel-menu')[0].querySelectorAll('.e-menu-item ').length ==9).toBe(true);
          }
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
          (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
          gridObj.element.getElementsByClassName('e-menu-item')[1].dispatchEvent(new Event('mouseover'));
          var mouseEve = document.createEvent('MouseEvents');
          mouseEve.initEvent('mouseover', true, true);
          gridObj.element.getElementsByClassName('e-menu-item')[1].dispatchEvent(mouseEve);  
      });
      it('Check the custom filter of excel filter', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
          if(args.requestType === 'filtering'){
            expect(gridObj.getRows().length ==0).toBe(true);
        }
         done();
        }
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>document.getElementsByClassName('e-excel-menu')[0].querySelector('.e-menu-item')).click();
        var actObj = (<any>document.getElementById('taskName-xlfl-frstvalue')).ej2_instances[0];
        actObj.value="design";
        var matchObj=(<any>document.getElementById('taskName-xlflmtcase')).ej2_instances[0];
        matchObj.checked=true;
        (<HTMLElement>document.getElementsByClassName('e-footer-content')[0].querySelector('.e-primary')).click();
    });
      afterAll(() => {
        destroy(gridObj);
      });
    });
});
