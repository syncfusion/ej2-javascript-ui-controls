import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { Aggregate } from '../../src/treegrid/actions/summary';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { projectData, sampleData, allysonData } from '../base/datasource.spec';
import { Page } from '../../src/treegrid/actions/page';
import { RowExpandedEventArgs, RowCollapsedEventArgs, RowCollapsingEventArgs } from '../../src';
import { Filter } from '../../src/treegrid/actions/filter';
import { ActionEventArgs } from '@syncfusion/ej2-grids';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Grid Toolbar spec 
 */
TreeGrid.Inject(Page, Filter, Aggregate);
describe('TreeGrid Pager module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
        });
    
  describe('Pager', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowPaging: true,
                pageSettings: {
                    pageSize: 2, currentPage: 2, pageCount: 4
                },
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
            },
            done
        );
    });

    it('current page testing', () => {
        expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('2');
    });
    it('gotpage testing', () => {
        gridObj.goToPage(2);
        expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('2');
    });
    it('set model testing pager settings', () => {
        gridObj.pageSettings = {currentPage: 1};
        gridObj.dataBind();
        expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toBe('1');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager setModel', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
            },
            done
        );
    });
    it('set model testing pager', (done: Function) => {
        gridObj.actionComplete = () => {
            expect(gridObj.getPager().querySelectorAll('.e-pagercontainer').length).toBe(1);
            done();
        };
        gridObj.allowPaging = true;
        gridObj.dataBind();
    });
    it('module methods', () => {
        gridObj.pagerModule.goToPage(2);
        gridObj.pagerModule.refresh();
        gridObj.pagerModule.updateExternalMessage('Test');
        expect(gridObj.getPager()).toBeDefined();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                pageSettings: { pageSizeMode: 'Root', pageSize: 2 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Pager Mode - root', () => {
        expect(gridObj.getRows().length).toBe(11);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes - All', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                pageSettings: { pageSizeMode: 'All', pageSize: 2 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Pager Mode - Check the current view', () => {
        expect(gridObj.getRows().length).toBe(2);
    });
    it('Pager Mode - Checking collapse action', (done: Function) => {
        gridObj.collapsed = (args?: RowCollapsedEventArgs) => {
            expect(gridObj.getRows()[0].querySelector('span').classList.contains('e-treegridcollapse')).toBe(true);
            done();
        }
        gridObj.collapseRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
    });
    it('Pager Mode - Checking expand action', (done: Function) => {
        gridObj.expanded = (args?: RowExpandedEventArgs) => {
            expect(gridObj.getRows()[0].querySelector('span').classList.contains('e-treegridexpand')).toBe(true);
            done();
        }
        gridObj.expandRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes - Checking visibility', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                pageSettings: { pageSizeMode: 'All', pageSize: 4, currentPage: 6 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Checke the row count', () => {
        expect(gridObj.getRows().length).toBe(4);
    });
    it('Checking visibility of the inner level records', (done: Function) => {
        gridObj.collapsed = (args?: RowCollapsedEventArgs) => {
            expect((<HTMLElement>(gridObj.getRows()[1].querySelector('span.e-treecell'))).innerText === 'Phase 3').toBe(true);
            done();
        }
        gridObj.collapseRow(gridObj.getRows()[0], gridObj.getCurrentViewRecords()[0]);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes with Filtering functionality', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                allowFiltering: true,
                filterSettings: {hierarchyMode: 'Child',
                    columns: [{field: 'taskName', operator: 'startswith', value: 'Implementation phase'}]
                },
                pageSettings: { pageSizeMode: 'Root', pageSize: 4 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Check data count', () => {
        expect(gridObj.getRows().length).toBe(25);
        expect(gridObj.grid.pageSettings.totalRecordsCount).toBe(1);
        expect((<HTMLElement>(gridObj.getRowByIndex(0).querySelector('span.e-treecell'))).innerText === 'Implementation Phase').toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager Modes - destroy', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
               childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging:true,
                allowFiltering: true,
                filterSettings: {hierarchyMode: 'Child',
                    columns: [{field: 'taskName', operator: 'startswith', value: 'Implementation phase'}]
                },
                pageSettings: { pageSizeMode: 'Root', pageSize: 4 },
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('Check data count', () => {
        gridObj.pagerModule.destroy();
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Pager with filter, sort, summary', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSelection: true,
                allowPaging: true,
                allowFiltering: true,
                allowSorting: true,
                aggregates: [{
                        columns: [
                            {
                                type: 'Max',
                                field: 'duration',
                                columnName: 'duration',
                                footerTemplate: 'Maximum: ${Max}'
                            }]
                }],
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Check successful collapsing', (done: Function) => {
        gridObj.collapsed = (args?: RowCollapsedEventArgs) => {
            expect(gridObj.getRows()[1].querySelector('.e-treecell').innerHTML === 'Design').toBe(true);
            done();
        }
        gridObj.collapseRow(gridObj.getRows()[0])
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('ExpandStateMapping with pager', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                pageSettings: { pageSize: 35 },
                expandStateMapping: 'isInExpandState',
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Checking the rendered records', () => {
      expect(gridObj.grid.pageSettings.totalRecordsCount).toBe(24);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('CollaspeAll and ExpandAll methods with pager - All Mode', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Check the collapseAll Method -- All Mode', (done: Function) => {
        gridObj.collapsing = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(9);
        }
        gridObj.collapsed = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(9);
            expect(gridObj.getRows().length).toBe(3);
            done();
        }
        gridObj.collapseAll();
    });
    it('Check the expandAll Method -- All Mode', (done: Function) => {
        gridObj.expanding = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(9);
        }
        gridObj.expanded = (args?: RowExpandedEventArgs) => {
            expect((args.data as Object[]).length).toBe(9);
            expect(gridObj.getRows().length).toBe(12);
            done();
        }
        gridObj.expandAll();
    });
    it('Check the collapseAtLevel Method -- All Mode', (done: Function) => {
        gridObj.collapsing = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(3);
        }
        gridObj.collapsed = (args?: RowExpandedEventArgs) => {
            expect((args.data as Object[]).length).toBe(3);
            expect(gridObj.grid.pageSettings.totalRecordsCount).toBe(15);
            done();
        }
        gridObj.collapseAtLevel(1);
    });
    it('Check the expandAtLevel Method -- All Mode', (done: Function) => {
        gridObj.expanding = (args?: RowCollapsingEventArgs) => {
            expect((args.data as Object[]).length).toBe(3);
        }
        gridObj.expanded = (args?: RowExpandedEventArgs) => {
            expect((args.data as Object[]).length).toBe(3);
            expect(gridObj.grid.pageSettings.totalRecordsCount).toBe(36);
            done();
        }
        gridObj.expandAtLevel(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('EJ2-22983: DataSource is not proper whose parentIDMapping record is not defined', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: allysonData,
          idMapping: 'AreaId',
          allowPaging: true,
          parentIdMapping: 'AreaPaiId',
          treeColumnIndex: 1,
          columns: ['AreaPaiId', 'AreaId', 'Nome']
        },
        done
      );
    });

    it('Rendering of unordered list', () => {
      expect(gridObj.getRows().length === gridObj.getCurrentViewRecords().length).toBe(true);
    });
    it('Collapsing testing', (done: Function) => {
        gridObj.collapsed = () => {
            expect(gridObj.getRows().length === 4).toBe(true);
            done();
        };
        gridObj.collapseAtLevel(1);
    });
    it('Expand testing', (done: Function) => {
        gridObj.expanded = () => {
            expect(gridObj.getRows().length === 12).toBe(true);
            expect(gridObj.grid.pageSettings.totalRecordsCount === 56).toBe(true);
            done();
        };
        gridObj.expandAtLevel(1);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('updateExternalMessage method testing', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                treeColumnIndex: 1,
                allowPaging: true,
                columns: ['taskID', 'taskName', 'startDate', 'endDate']
            },
            done
        );
    });
    it('updateExternalMessage method testing', () => {
        gridObj.updateExternalMessage('Testing');
        expect(gridObj.grid.getPager().getElementsByClassName('e-pagerexternalmsg')[0].innerHTML == 'Testing').toBe(true);
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
  describe('Checking enableCollapseAll with paging', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let expanded: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
          enableCollapseAll: true,
        },
        done
      );
    });
    it('enableCollapseAll testing', () => {
        expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(0);
    });
    it('expanding record with enableCollapseAll', (done: Function) => {
        rows = gridObj.getRows();
        gridObj.expanded = (args?: RowExpandedEventArgs) => {
            rows = gridObj.getRows();
            expect(rows[0].getElementsByClassName('e-treecolumn-container')[0].querySelector('.e-treegridexpand').classList.contains('e-treegridexpand')).toBe(true);
            expect(isNullOrUndefined(rows[5].getElementsByClassName('e-treecolumn-container')[0].querySelector('.e-treegridexpand'))).toBe(true);
            done();
        }
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
    });
    afterAll(() => {
        destroy(gridObj);
      });
    });
    describe(' EJ2-27659 - CollaspeAll method with current page other than 1 ', () => {
        let gridObj: TreeGrid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    allowPaging: true,
                    pageSettings: { pageSize: 3 },
                    columns: ['taskID', 'taskName', 'startDate', 'duration']
                },
                done
            );
        });
        it('Check the collapseAll Method -- All Mode', (done: Function) => {
            gridObj.actionComplete = () => {
                expect(gridObj.pageSettings.currentPage == 1).toBe(true);
                expect(gridObj.getRows().length == 3).toBe(true);
                expect(gridObj.getRows()[0].querySelector('.e-treecell').innerHTML == "Planning").toBe(true);
                expect(gridObj.getRows()[1].querySelector('.e-treecell').innerHTML == "Design").toBe(true);
                expect(gridObj.getRows()[2].querySelector('.e-treecell').innerHTML == "Implementation Phase").toBe(true);
                done();
            };
            gridObj.goToPage(3);
            gridObj.collapseAll();
        });
        afterAll(() => {
          destroy(gridObj);
        });
      });
      describe('Checking template position', () => {
        let gridObj: TreeGrid;
        let rows: HTMLTableRowElement[];
        let dataBound: ()=> void;
        beforeAll((done: Function) => {
          gridObj = createGrid(
            {
              dataSource: sampleData,
              childMapping: 'subtasks',
              allowPaging: true,
              treeColumnIndex: 1,
              columns: [
                { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right' },
                {
                    field:'taskName', headerText: 'Template', textAlign: 'Center',
                    template: '<button id="button">Button</button>', width: 90
                },
                { field: 'duration', headerText: 'Duration', width: 60, textAlign: 'Right' }
                ],
            },
            done
          );
        });
        it('Checking template position when the template column is marked as treeColumnIndex with paging', (done: Function) => {
            let rows: HTMLTableRowElement[] = gridObj.getRows();
            gridObj.collapsed = function (args: RowCollapsedEventArgs) {
                rows = gridObj.getRows();
                expect(rows[1].cells[0].innerText).toBe('6');
                expect(rows[0].cells[1].innerHTML.indexOf('Button')).toBeGreaterThan(0);
                done();
            };
            gridObj.collapseRow(rows[0] as HTMLTableRowElement);
      
        });
        afterAll(() => {
          destroy(gridObj);
        });
      });

	  describe('While Selecting ALL, displays only 3 records', () => {
		let gridObj: TreeGrid;
		let rows: HTMLTableRowElement[];
		let dataBound: () => void;
		beforeAll((done: Function) => {
			gridObj = createGrid(
				{
					dataSource: sampleData,
					allowPaging: true,
					childMapping: 'subtasks',
					height: 350,
					treeColumnIndex: 1,
					columns: [
						{ field: 'taskID', headerText: 'Task ID', width: 70, textAlign: 'Right' },
						{ field: 'taskName', headerText: 'Task Name', width: 200, textAlign: 'Left' },
						{ field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
						{ field: 'endDate', headerText: 'End Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
						{ field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
						{ field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' },
						{ field: 'priority', headerText: 'Priority', width: 90 }
					],
					pageSettings: { pageSize: 5, pageSizes: true }
				},
				done
			);
		});
		it('Checking the totalRecordCount', (done: Function) => {
			if (gridObj.pageSettings.pageSizes)
			{
				gridObj.collapseAll();
				gridObj.grid.pagerModule.pagerObj.pagerdropdownModule['dropDownListObject'].value = gridObj.grid.pagerModule.pagerObj.getLocalizedLabel('All');
				gridObj.expandAll();
				expect(gridObj.grid.currentViewData.length === 36).toBe(true);
				done();
			}
		});
		afterAll(() => {
			destroy(gridObj);
		});
	});

    describe('867916 - Filtering not working on navigating to another page when all records are collapsed', () => {
		let gridObj: TreeGrid;
        let actionComplete: () => void;
		beforeAll((done: Function) => {
			gridObj = createGrid(
				{
                    dataSource: sampleData,
                    allowPaging: true,
                    pageSettings: { pageSize: 5 },
                    allowFiltering: true,
                    filterSettings: {
                      type: 'FilterBar',
                      hierarchyMode: 'Child',
                      mode: 'Immediate',
                    },
                    childMapping: 'subtasks',
                    enableCollapseAll: true,
                    height: 350,
                    treeColumnIndex: 1, 
                    columns: [
                      { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                      { field: 'taskName', headerText: 'Task Name', width: 200 },
                      {
                        field: 'startDate',
                        headerText: 'Start Date',
                        textAlign: 'Right',
                        width: 100,
                        format: { skeleton: 'yMd', type: 'date' },
                      }
                    ]
				},
				done
			);
		});
		it('Checking the Filtering with page navigation', (done: Function) => {
            gridObj.actionComplete = (args: any) => {
                if (args.requestType == 'filtering') {
                    expect(gridObj.grid.currentViewData.length === 5).toBe(true);
                }
                if (args.requestType == 'paging') { 
                    expect(gridObj.grid.currentViewData.length === 2).toBe(true);
                }
                done();
            };
            gridObj.filterByColumn('taskName', 'contains', 'Dev');
            gridObj.goToPage(2);
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
