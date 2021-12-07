import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData, newSampledata, sampleBlankData } from '../base/datasource.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { actionComplete, SaveEventArgs, ActionEventArgs } from '@syncfusion/ej2-grids';
import { Filter } from '../../src/treegrid/actions/filter';
import { Edit } from '../../src/treegrid/actions/edit';
import { CellSaveEventArgs } from '../../src';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Query } from '@syncfusion/ej2-data';
import { ITreeData } from '../../src/treegrid/base/interface';
/**
 * Grid base spec 
 */
TreeGrid.Inject(Filter, Edit);
describe('Filter module', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

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

describe('Hierarchy Filter Mode Testing - Parent and child', () => {
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
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
        },
        done
      );
    });

    it('Check the filtered records for Parent and child mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Plan budget").toBe(true);
            done();
        }
        gridObj.actionComplete = actionComplete;
      gridObj.filterByColumn("taskName","startswith","Plan budget");
     });

     it('Check the filtered records for child mode', (done: Function) => {
      actionComplete = (args?: Object): void => {
        expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Plan budget").toBe(true);
      done();
      }
      gridObj.actionComplete = actionComplete;
      gridObj.filterSettings.hierarchyMode = 'Child';
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
        expect(document.getElementsByClassName('e-label e-checkboxfiltertext').length==27).toBe(true);
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
            expect(document.getElementsByClassName('e-label e-checkboxfiltertext').length == 6).toBe(true);
            done();
            }
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
        if(args.action === 'clear-filter'){
          expect(gridObj.getRows().length == 36).toBe(true);
          expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelectorAll(".e-treecolumn-container")[0].childNodes.length == 4).toBe(true);
          done();
        }
      } 
      gridObj.grid.actionComplete = actionComplete;
      (<HTMLElement>document.querySelectorAll('.e-filtermenudiv')[1]).click();
      (<HTMLElement>document.getElementsByClassName('e-menu-item')[0]).click();

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
          if (args.requestType === 'filterchoicerequest') {
            expect(document.getElementsByClassName('e-excel-menu')[0].querySelectorAll('.e-menu-item ').length == 9).toBe(true);
            done();
          }
          if (args.requestType === 'filterafteropen') {
            (<HTMLElement>document.getElementsByClassName('e-excel-menu')[0].querySelector('.e-menu-item')).click();
            var dd1Obj = (<any>document.getElementById('taskName-xlfl-frstoptr')).ej2_instances[0];
            dd1Obj.value = "contains";
            var act1Obj = (<any>document.getElementById('taskName-xlfl-frstvalue')).ej2_instances[0];
            act1Obj.value = "software";
            var dd2Obj = (<any>document.getElementById('taskName-xlfl-secndoptr')).ej2_instances[0];
            dd2Obj.value = "contains"
            var act2Obj = (<any>document.getElementById('taskName-xlfl-secndvalue')).ej2_instances[0];
            act2Obj.value = "specification";
            (<HTMLElement>document.getElementsByClassName('e-footer-content')[0].querySelector('.e-primary')).click();
          }
          if (args.requestType === 'filtering') {
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(true);
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Software Specification").toBe(true);
            done();
          }      
        }
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>document.querySelectorAll('.e-filtermenudiv')[1]).click();
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(new Event('mouseover'));
        var mouseEve = document.createEvent('MouseEvents');
        mouseEve.initEvent('mouseover', true, true);
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(mouseEve);        
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
          if (args.requestType === 'filterchoicerequest') {
            expect(document.getElementsByClassName('e-excel-menu')[0].querySelectorAll('.e-menu-item ').length == 9).toBe(true);
            done();
          }
          if (args.requestType == 'filterafteropen') {
            (<HTMLElement>document.getElementsByClassName('e-excel-menu')[0].querySelector('.e-menu-item')).click();
            var act1Obj = (<any>document.getElementById('taskName-xlfl-frstvalue')).ej2_instances[0];
            act1Obj.value = "design";
            var predicate1Obj = (<any>document.getElementById('taskNamee-xlfl-frstpredicate')).ej2_instances[0];
            predicate1Obj.checked = false;
            var predicate2Obj = (<any>document.getElementById('taskNamee-xlfl-secndpredicate')).ej2_instances[0];
            predicate2Obj.checked = true;
            var ddObj = (<any>document.getElementById('taskName-xlfl-secndoptr')).ej2_instances[0];
            ddObj.value = "contains"
            var act2Obj = (<any>document.getElementById('taskName-xlfl-secndvalue')).ej2_instances[0];
            act2Obj.value = "design";
            (<HTMLElement>document.getElementsByClassName('e-footer-content')[0].querySelector('.e-primary')).click();
          }
          if (args.requestType === 'filtering') {
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treegridexpand"))).toBe(false);
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design").toBe(true);
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design Documentation").toBe(true);
            expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Design complete").toBe(true);
            done();
          }
        }
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>document.querySelectorAll('.e-filtermenudiv')[1]).click();
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(new Event('mouseover'));
        var mouseEve = document.createEvent('MouseEvents');
        mouseEve.initEvent('mouseover', true, true);
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(mouseEve);      
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
          if (args.requestType === 'filterchoicerequest') {
            expect(document.getElementsByClassName('e-excel-menu')[0].querySelectorAll('.e-menu-item ').length == 9).toBe(true);
            done();
          }
          if (args.requestType === 'filterafteropen') {
            (<HTMLElement>document.getElementsByClassName('e-excel-menu')[0].querySelector('.e-menu-item')).click();
            var actObj = (<any>document.getElementById('taskName-xlfl-frstvalue')).ej2_instances[0];
            actObj.value = "design";
            var matchObj = (<any>document.getElementById('taskName-xlflmtcase')).ej2_instances[0];
            matchObj.checked = true;
            (<HTMLElement>document.getElementsByClassName('e-footer-content')[0].querySelector('.e-primary')).click();
          }
          if (args.requestType === 'filtering') {
            expect(gridObj.getRows().length == 0).toBe(true);
            done();
          }
        }
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(new Event('mouseover'));
        var mouseEve = document.createEvent('MouseEvents');
        mouseEve.initEvent('mouseover', true, true);
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(mouseEve);             
    });
      afterAll(() => {
        destroy(gridObj);
      });
    });

    describe('EJ2-23098: Editing with Filtering ', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let actionComplete: ()=> void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: newSampledata,
            childMapping: 'Children',
            treeColumnIndex: 1,
            allowFiltering: true,
            editSettings: {
              allowAdding: true,
              allowEditing: true,
              allowDeleting: true,
              mode: 'Cell',
              newRowPosition: 'Below'
            },
            columns: [
                { field: 'TaskId', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 80 },
                { field: 'TaskName', headerText: 'Task Name', width: 200 },
                { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
            ]
  
          },
          done
        );
      });
  
      it('Editing', (done: Function) => {
        let event: MouseEvent = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        gridObj.getCellFromIndex(1, 1).dispatchEvent(event);
        gridObj.actionComplete = (args?: SaveEventArgs): void => {
          expect(args.target.textContent).toBe('SP');
          done();
        };
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'SP';
        gridObj.getRows()[0].click();
      });
      it('Filter after editing', (done: Function) => {
        gridObj.grid.actionComplete = (args?: ActionEventArgs) => {
          expect(gridObj.getRows()[1].querySelector('span.e-treecell').innerHTML).toBe('SP');
          done();
        };
        gridObj.filterByColumn('TaskName', 'startswith', 'SP');
      });
      it('Clear filtering', (done: Function) => {
        gridObj.grid.actionComplete = (args?: ActionEventArgs) => {
          expect((<Object[]>(gridObj.grid.dataSource)).length == gridObj.getRows().length).toBe(true);
          done();
        };
        gridObj.clearFiltering();
      });
  
      it('Check filter tree', (done: Function) => {
        gridObj.grid.actionComplete = (args?: ActionEventArgs) => {
          expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
          expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
          done();
        };
        gridObj.filterByColumn('TaskName', 'startswith', 'Task 1');
      });
      it('Check filter tree after clearing filtering', (done: Function) => {
        gridObj.grid.actionComplete = (args?: ActionEventArgs) => {
          expect(!isNullOrUndefined((<HTMLTableRowElement>
              (gridObj.getRowByIndex(0))).cells[1].querySelector('.e-treegridexpand'))).toBe(true);
          done();
        };
        gridObj.clearFiltering();
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });

    describe('EJ2-23097: Records are not properly collapsed after filter/search is performed', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let actionComplete: ()=> void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: newSampledata,
            childMapping: 'Children',
            treeColumnIndex: 1,
            allowFiltering: true,
            columns: [
                { field: 'TaskId', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 80 },
                { field: 'TaskName', headerText: 'Task Name', width: 200 },
                { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
            ]
          },
          done
        );
      });
  
      it('Filtering', () => {
        gridObj.filterByColumn('TaskName', 'startswith', 'grand');
        gridObj.collapseRow(<HTMLTableRowElement>(gridObj.getRowByIndex(0)));
        expect((<HTMLElement>(gridObj.getRowByIndex(2))).style.display).toBe('none');
        expect((<HTMLElement>(gridObj.getRowByIndex(3))).style.display).toBe('none');
        expect((<HTMLElement>(gridObj.getRowByIndex(4))).style.display).toBe('none');
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    describe('Editing after filtering with summary rows', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let actionComplete: () => void;
        
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            treeColumnIndex: 1, 
            childMapping: 'subtasks',
            height: window.innerHeight - 70,
            allowFiltering: true,
            filterSettings: { type: 'Menu'},
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Row',
                newRowPosition: 'Top',
                showConfirmDialog: true,
                allowEditOnDblClick: true,
                showDeleteConfirmDialog: true
    
            },
            toolbar: ['Add', 'Delete', 'Update', 'Cancel', 'Edit'],
            columns: [
                {
                    field: 'taskID', headerText: 'Task ID', textAlign: 'Right',
                     width: 90, isPrimaryKey: true
                },
                { field: 'taskName', headerText: 'Task Name',  width: 220},
                { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130,
                  format: 'yMd' },
                {
                    field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100
                },
                {
                    field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 100
                }
            ],
            aggregates: [{
                showChildSummary: true,
                columns: [
                    {
                        type: 'Max',
                        field: 'progress',
                        columnName: 'progress',
                        footerTemplate: 'Maximum: ${Max}'
                    },
                    {
                    type: 'Min',
                    field: 'duration',
                    columnName: 'duration',
                    footerTemplate: 'Minimum: ${Min}'
                }]}]
          },
          done
        );
      });
      it('Editing after filtering with summary rows- filtering', (done: Function) => {
        actionComplete = (args?: any): void => {
          if (args.requestType === 'filtering') {
          expect(gridObj.getRows().length == 5).toBe(true);
          expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Planning").toBe(true);
          expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Plan timeline").toBe(true);
          expect(gridObj.getRows()[4].classList.contains('e-summaryrow')).toBe(true);
          done();
          }
        }
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn("taskName","startswith","Plan");
    });
    it('Editing after filtering with summary rows- editing', () => {
      gridObj.selectRow(0);
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
      gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[1].value = "testing";
      actionComplete = (args?: any): void => {
        if (args.requestType === 'save') {
        expect(gridObj.getRows().length == 5).toBe(true);
        expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "testing").toBe(true);
        expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Plan timeline").toBe(true);
        expect(gridObj.getRows()[4].classList.contains('e-summaryrow')).toBe(true);
        }
      }
      gridObj.actionComplete = actionComplete;
      (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
      afterAll(() => {
        destroy(gridObj);
      });
    });
    describe('Hierarchy Filter Mode Testing - Parent with Search Settings Mode as Both', () => {
      let gridObj: TreeGrid;
      let rows: Element[];
      let actionComplete: (args: CellSaveEventArgs) => void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleBlankData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowFiltering: true,
            filterSettings: { type: 'Excel' },
            toolbar: ['Search'],
            searchSettings: { fields: ['taskName'], operator: 'contains', hierarchyMode: 'Both', ignoreCase: true },
            columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          },
          done
        );
      });
  
      it('Hierarchy Filter Mode Testing - Parent with Search Settings Mode as Both', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
          if (args.requestType == "filterafteropen") {
            (<HTMLElement>document.querySelectorAll('.e-excelfilter .e-check')[0]).click();
            (<HTMLElement>document.querySelectorAll('.e-excelfilter .e-uncheck')[1]).click();
            expect(document.querySelectorAll('.e-excelfilter .e-check')[0].textContent == "").toBe(true);
            done();
          }
        }
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>document.querySelectorAll('.e-filtermenudiv')[1]).click();
  
      });
      it('Hierarchy Filter Mode Testing - Parent with Search Settings Mode as Both - result', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
          if (args.requestType == "filtering") {
            expect(gridObj.getRows().length == 3).toBe(true);
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "").toBe(true);
            done();
          }
        }
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>document.querySelector('.e-excelfilter .e-footer-content').getElementsByClassName('e-primary')[0]).click();
  
      });
      afterAll(() => {
        destroy(gridObj);
      });
    });


      describe('EJ2-47011: Filtering using query', () => {
      let gridObj: TreeGrid;
      let actionComplete: ()=>void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowFiltering: true, 
            filterSettings: { hierarchyMode: 'Parent' },
            columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          },
          done
        );
      });
  
      it('Checked filtered rows against query', (done: Function) => {
          actionComplete = (args?: Object): void => {
              expect((args as any).rows.length == 2).toBe(true);
              done();
          }
          gridObj.grid.actionComplete = actionComplete;
          gridObj.query = new Query().where("taskID", "equal", 2);
       });
      afterAll(() => {
        destroy(gridObj);
      });
    });

    describe('EJ2-47011: Searching using query', () => {
      let gridObj: TreeGrid;
      let actionComplete: ()=>void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            toolbar: ['Search'],
            allowFiltering: true, 
            filterSettings: { hierarchyMode: 'Parent' },
            columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          },
          done
        );
      });
  
      it('Checked searched rows against query', (done: Function) => {
          actionComplete = (args?: Object): void => {
              expect((args as any).rows.length == 10).toBe(true);
              done();
          }
          gridObj.grid.actionComplete = actionComplete;
          gridObj.query = new Query().search("Phase", ["taskName"]);
       });
      afterAll(() => {
        destroy(gridObj);
      });
    });

    describe('EJ2-51733: showCheckbox with filtering', () => {
      let gridObj: TreeGrid;
      let actionComplete: () => void;
      beforeAll((done: Function) => {
        gridObj = createGrid(
          {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowFiltering: true,
            filterSettings: {type: 'Excel', hierarchyMode: 'Child'},
            autoCheckHierarchy: true,
            columns: [
              { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
              { field: 'taskName', headerText: 'Task Name', showCheckbox: true, width: 250 },
              { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 },
              { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
              { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
            ]
          },
          done
        );
      });
      it('Filter using excel filter', (done: Function) => {
        actionComplete = (args?: Object): void => {
           expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector("div>.e-treecell").innerHTML == "Allocate resources").toBe(true);
           done();
         }
         gridObj.grid.actionComplete = actionComplete;
         gridObj.filterByColumn("taskName","startswith","Allocate resources");
      });
      it('Check header checkbox', () => {
        (<HTMLElement>gridObj.element.querySelectorAll('.e-treeselectall')[0]).click();
        expect((<ITreeData>gridObj.getCurrentViewRecords()[0]).checkboxState).toBe("check");
        expect(gridObj.getCheckedRecords().length).toBe(1);
      });
      it('Remove filter', (done: Function) => {
        actionComplete = (args?: Object): void => {
          expect(gridObj.getRows().length == 36).toBe(true);
          expect(gridObj.getCheckedRecords().length).toBe(1);
          done();
      }
      gridObj.grid.actionComplete = actionComplete;
      gridObj.clearFiltering();
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
