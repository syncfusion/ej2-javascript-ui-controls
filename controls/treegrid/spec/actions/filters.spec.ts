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
import { Aggregate } from '../../src/treegrid/actions/summary';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { Sort } from '../../src/treegrid/actions/sort';

/**
 * Grid base spec
 */
TreeGrid.Inject(Filter, Edit, Aggregate, Toolbar, Sort);
describe('Filter module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); //Skips test (in Chai)
            return;
        }
    });

    describe('Hierarchy Filter Mode Testing - Parent', () => {
        let gridObj: TreeGrid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    allowFiltering: true,
                    columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
                },
                done
            );
        });
        it('Check the filered records for parent mode', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Planning').toBe(true);
                expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Plan timeline').toBe(true);
                done();
            };
            gridObj.grid.actionComplete = actionComplete;
            gridObj.filterByColumn('taskName', 'startswith', 'Plan');
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

describe('Hierarchy Filter Mode Testing - Child', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'Child' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Check the filtered records for child mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(true);
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Develop prototype').toBe(true);
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Development Task 1').toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'dev');
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy Filter Mode Testing - Child1', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'Child' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Check the filtered records for child mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Planning').toBe(true);
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Plan timeline').toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Plan');
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy Filter Mode Testing - Child2', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'Child' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Check the filtered records for child mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Implementation Module 1').toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'phase');
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy Filter Mode Testing - Both', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'Both' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Check the filtered records for Both mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Implementation Phase').toBe(true);
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Phase 1').toBe(true);
            expect(isNullOrUndefined(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
            expect(isNullOrUndefined(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
            expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Implementation Module 1').toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Phase 1');
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy Filter Mode Testing - Parent and child', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Check the filtered records for Parent and child mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Planning').toBe(true);
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Plan budget').toBe(true);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Plan budget');
    });

    it('Check the filtered records for child mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Plan budget').toBe(true);
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.filterSettings.hierarchyMode = 'Child';
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy Filter Mode Testing - None', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'None' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Check the filtered records for None mode', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows().length === 1).toBe(true);
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'All');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy Filter - Basics of Filtering', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'Child' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Check the filter levels - filter', (done: Function) => {
        expect(gridObj.getRows().length === 36).toBe(true);
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('.e-treecolumn-container').getAttribute('style') === 'padding-left:0px');
            expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('.e-treecolumn-container').getAttribute('style') === 'padding-left:25px');
            expect(gridObj.getRows()[4].getElementsByClassName('e-rowcell')[1].querySelector('.e-treecolumn-container').getAttribute('style') === 'padding-left:0px');
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'De');

    });
    it('Check the filter levels - clearfilter', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows().length === 36).toBe(true);
            expect(gridObj.getRows()[14].getElementsByClassName('e-rowcell')[1].querySelector('.e-treecolumn-container').getAttribute('style') === 'padding-left:75px');
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.clearFiltering();

    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Remove Filtering Method', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'None' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('remove the single column alone', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows().length === 36).toBe(true);
            done();
        };
        gridObj.filterByColumn('taskName', 'startswith', 'All');
        gridObj.grid.actionComplete = actionComplete;
        gridObj.removeFilteredColsByField('taskName');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Filtering and sorting', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
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
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Develop prototype').toBe(true);
            done();
        };
        gridObj.grid.dataBound = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'dev');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Filtering Propertychange', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowSorting: true,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('allowFiltering and filterSettings using onproperty', (done: Function) => {
        actionComplete = (args?: Object) => {
            expect(document.getElementsByClassName('e-filterbarcell').length > 0).toBe(true);
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
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'Child' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
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
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'Child' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
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
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { type: 'Excel'},
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('Check the count of checkboxes in excel filter ', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(document.getElementsByClassName('e-label e-checkboxfiltertext').length === 27).toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Excel Filter Checkbox Testing Of One Column After Filtering Another Column- Parent', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: CellSaveEventArgs) => void ;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'None', type: 'Excel' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('Check the filtered records for checkbox count', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs) => {
            if (args.requestType === 'filterchoicerequest'){
                expect(document.getElementsByClassName('e-label e-checkboxfiltertext').length === 6).toBe(true);
                done();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('duration', 'equal', 11);
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
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Check the filter levels - before clearfilter', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
            expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelectorAll('.e-treecolumn-container')[0].childNodes.length === 5).toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'phase');
    });
    it('Check the filter levels - after clearfilter', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
            if (args.action === 'clear-filter'){
                expect(gridObj.getRows().length === 36).toBe(true);
                expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelectorAll('.e-treecolumn-container')[0].childNodes.length === 4).toBe(true);
                done();
            }
        };
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
    let actionComplete: (args: CellSaveEventArgs) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { type: 'Excel', hierarchyMode: 'None'},
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Check the AND of custom filter- Mouseover', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
            if (args.requestType === 'filterchoicerequest') {
                expect(document.getElementsByClassName('e-excel-menu')[0].querySelectorAll('.e-menu-item ').length === 10).toBe(true);
                done();
            }
            if (args.requestType === 'filterafteropen') {
                (<HTMLElement>document.getElementsByClassName('e-excel-menu')[0].querySelector('.e-menu-item')).click();
                const dd1Obj = (<any>document.getElementById('taskName-xlfl-frstoptr')).ej2_instances[0];
                dd1Obj.value = 'contains';
                const act1Obj = (<any>document.getElementById('taskName-xlfl-frstvalue')).ej2_instances[0];
                act1Obj.value = 'software';
                const dd2Obj = (<any>document.getElementById('taskName-xlfl-secndoptr')).ej2_instances[0];
                dd2Obj.value = 'contains';
                const act2Obj = (<any>document.getElementById('taskName-xlfl-secndvalue')).ej2_instances[0];
                act2Obj.value = 'specification';
                (<HTMLElement>document.getElementsByClassName('e-footer-content')[0].querySelector('.e-primary')).click();
            }
            if (args.requestType === 'filtering') {
                expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(true);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Software Specification').toBe(true);
                done();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>document.querySelectorAll('.e-filtermenudiv')[1]).click();
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(new Event('mouseover'));
        const mouseEve: MouseEvent = document.createEvent('MouseEvents');
        mouseEve.initEvent('mouseover', true, true);
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(mouseEve);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Excel Filter Custom Filter Testing - With OR', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: CellSaveEventArgs) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { type: 'Excel', hierarchyMode: 'None'},
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Check the OR of custom filter- Mouseover', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
            if (args.requestType === 'filterchoicerequest') {
                expect(document.getElementsByClassName('e-excel-menu')[0].querySelectorAll('.e-menu-item ').length === 10).toBe(true);
                done();
            }
            if (args.requestType === 'filterafteropen') {
                (<HTMLElement>document.getElementsByClassName('e-excel-menu')[0].querySelector('.e-menu-item')).click();
                const act1Obj = (<any>document.getElementById('taskName-xlfl-frstvalue')).ej2_instances[0];
                act1Obj.value = 'design';
                const predicate1Obj = (<any>document.getElementById('taskNamee-xlfl-frstpredicate')).ej2_instances[0];
                predicate1Obj.checked = false;
                const predicate2Obj = (<any>document.getElementById('taskNamee-xlfl-secndpredicate')).ej2_instances[0];
                predicate2Obj.checked = true;
                const ddObj = (<any>document.getElementById('taskName-xlfl-secndoptr')).ej2_instances[0];
                ddObj.value = 'contains';
                const act2Obj = (<any>document.getElementById('taskName-xlfl-secndvalue')).ej2_instances[0];
                act2Obj.value = 'design';
                (<HTMLElement>document.getElementsByClassName('e-footer-content')[0].querySelector('.e-primary')).click();
            }
            if (args.requestType === 'filtering') {
                expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Design').toBe(true);
                expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Design Documentation').toBe(true);
                expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Design complete').toBe(true);
                done();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>document.querySelectorAll('.e-filtermenudiv')[1]).click();
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(new Event('mouseover'));
        const mouseEve:  MouseEvent = document.createEvent('MouseEvents');
        mouseEve.initEvent('mouseover', true, true);
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(mouseEve);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Excel Filter Custom Filter Testing - MatchCase', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: CellSaveEventArgs) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { type: 'Excel', hierarchyMode: 'None'},
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('Check the custom filter of excel filter', (done: Function) => {
        actionComplete = (args: CellSaveEventArgs): void => {
            if (args.requestType === 'filterchoicerequest') {
                expect(document.getElementsByClassName('e-excel-menu')[0].querySelectorAll('.e-menu-item ').length === 10).toBe(true);
                done();
            }
            if (args.requestType === 'filterafteropen') {
                (<HTMLElement>document.getElementsByClassName('e-excel-menu')[0].querySelector('.e-menu-item')).click();
                const actObj = (<any>document.getElementById('taskName-xlfl-frstvalue')).ej2_instances[0];
                actObj.value = 'design';
                const matchObj = (<any>document.getElementById('taskName-xlflmtcase')).ej2_instances[0];
                matchObj.checked = true;
                (<HTMLElement>document.getElementsByClassName('e-footer-content')[0].querySelector('.e-primary')).click();
            }
            if (args.requestType === 'filtering') {
                expect(gridObj.getRows().length === 0).toBe(true);
                done();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(new Event('mouseover'));
        const mouseEve: MouseEvent = document.createEvent('MouseEvents');
        mouseEve.initEvent('mouseover', true, true);
        document.getElementsByClassName('e-menu-item')[1].dispatchEvent(mouseEve);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

// describe('EJ2-23098: Editing with Filtering ', () => {
//     let gridObj: TreeGrid;
//     beforeAll((done: Function) => {
//         gridObj = createGrid(
//             {
//                 dataSource: newSampledata,
//                 childMapping: 'Children',
//                 treeColumnIndex: 1,
//                 allowFiltering: true,
//                 editSettings: {
//                     allowAdding: true,
//                     allowEditing: true,
//                     allowDeleting: true,
//                     mode: 'Cell',
//                     newRowPosition: 'Below'
//                 },
//                 columns: [
//                     { field: 'TaskId', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 80 },
//                     { field: 'TaskName', headerText: 'Task Name', width: 200 },
//                     { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
//                     { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
//                     { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
//                 ]
//             },
//             done
//         );
//     });

//     it('Editing', () => {
//         const event: MouseEvent = new MouseEvent('dblclick', {
//             'view': window,
//             'bubbles': true,
//             'cancelable': true
//         });
//         gridObj.getCellFromIndex(1, 1).dispatchEvent(event);
//         gridObj.actionComplete = (args?: SaveEventArgs): void => {
//             expect(args.target.textContent).toBe('SP');
//         };
//         gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'SP';
//         gridObj.getRows()[0].click();
//     });
//     it('Filter after editing', () => {
//         gridObj.grid.actionComplete = (args?: ActionEventArgs) => {
//             expect(gridObj.getRows()[1].querySelector('span.e-treecell').innerHTML).toBe('SP');
//         };
//         gridObj.filterByColumn('TaskName', 'startswith', 'SP');
//     });
//     it('Clear filtering', () => {
//         gridObj.grid.actionComplete = (args?: ActionEventArgs) => {
//             expect((<Object[]>(gridObj.grid.dataSource)).length === gridObj.getRows().length).toBe(true);
//         };
//         gridObj.clearFiltering();
//     });

//     it('Check filter tree', (done: Function) => {
//         gridObj.grid.actionComplete = (args?: ActionEventArgs) => {
//             expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
//             expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
//             done();
//         };
//         gridObj.filterByColumn('TaskName', 'startswith', 'Task 1');
//     });
//     it('Check filter tree after clearing filtering', () => {
//         gridObj.clearFiltering();
//         gridObj.grid.actionComplete = (args?: ActionEventArgs) => {
//             expect(!isNullOrUndefined((<HTMLTableRowElement>
//           (gridObj.getRowByIndex(0))).cells[1].querySelector('.e-treegridexpand'))).toBe(true);
//         };
//     });
//     afterAll(() => {
//         destroy(gridObj);
//     });
// });

describe('EJ2-23097: Records are not properly collapsed after filter/search is performed', () => {
    let gridObj: TreeGrid;
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
        expect(gridObj.getRowByIndex(2).classList.contains('e-childrow-hidden')).toBe(true);
        expect(gridObj.getRowByIndex(3).classList.contains('e-childrow-hidden')).toBe(true);
        expect(gridObj.getRowByIndex(4).classList.contains('e-childrow-hidden')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Editing after filtering with summary rows', () => {
    let gridObj: TreeGrid;
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
                expect(gridObj.getRows().length === 5).toBe(true);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Planning').toBe(true);
                expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Plan timeline').toBe(true);
                expect(gridObj.getRows()[4].classList.contains('e-summaryrow')).toBe(true);
                done();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Plan');
    });
    it('Editing after filtering with summary rows- editing', () => {
        gridObj.selectRow(0);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_edit' } });
        gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[1].value = 'testing';
        actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect(gridObj.getRows().length === 5).toBe(true);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'testing').toBe(true);
                expect(gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Plan timeline').toBe(true);
                expect(gridObj.getRows()[4].classList.contains('e-summaryrow')).toBe(true);
            }
        };
        gridObj.actionComplete = actionComplete;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Hierarchy Filter Mode Testing - Parent with Search Settings Mode as Both', () => {
    let gridObj: TreeGrid;
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
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Hierarchy Filter Mode Testing - Parent with Search Settings Mode as Both', () => {
        actionComplete = (args: CellSaveEventArgs): void => {
            if (args.requestType === 'filterafteropen') {
                (<HTMLElement>document.querySelectorAll('.e-excelfilter .e-check')[0]).click();
                (<HTMLElement>document.querySelectorAll('.e-excelfilter .e-uncheck')[1]).click();
                expect(document.querySelectorAll('.e-excelfilter .e-check')[0].textContent === '').toBe(true);
            }
        };
        (<HTMLElement>document.querySelectorAll('.e-filtermenudiv')[1]).click();
        gridObj.grid.actionComplete = actionComplete;

    });
    it('Hierarchy Filter Mode Testing - Parent with Search Settings Mode as Both - result', () => {
        actionComplete = (args: CellSaveEventArgs): void => {
            if (args.requestType === 'filtering') {
                expect(gridObj.getRows().length === 3).toBe(true);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === '').toBe(true);
            }
        };
        (<HTMLElement>document.querySelector('.e-excelfilter .e-footer-content').getElementsByClassName('e-primary')[0]).click();
        gridObj.grid.actionComplete = actionComplete;
    });
    afterAll(() => {
        destroy(gridObj);
    });
});


describe('EJ2-47011: Filtering using query', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'Parent' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Checked filtered rows against query', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect((args as any).rows.length === 2).toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.query = new Query().where('taskID', 'equal', 2);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-47011: Searching using query', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                toolbar: ['Search'],
                allowFiltering: true,
                filterSettings: { hierarchyMode: 'Parent' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('Checked searched rows against query', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect((args as any).rows.length === 10).toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.query = new Query().search('Phase', ['taskName']);
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
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML === 'Allocate resources').toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Allocate resources');
    });
    it('Check header checkbox', () => {
        (<HTMLElement>gridObj.element.querySelectorAll('.e-treeselectall')[0]).click();
        expect((<ITreeData>gridObj.getCurrentViewRecords()[0]).checkboxState).toBe('check');
        expect(gridObj.getCheckedRecords().length).toBe(1);
    });
    it('Remove filter', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows().length === 36).toBe(true);
            expect(gridObj.getCheckedRecords().length).toBe(1);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.clearFiltering();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-58933: Searched child record not shown when its parent record in collapsed state', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowFiltering: true,
                filterSettings: { type: 'Menu'},
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 120, isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name', width: 220 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 140, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 120 }
                ]
            },
            done
        );
    });

    it('Expand test for the parent record ', (done: Function) => {
        gridObj.collapseAll();
        gridObj.filterByColumn('taskName', 'startsWith', 'Plan timeline');
        expect(gridObj.getVisibleRecords()[0]['isInExpandState']).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-63073: The checkbox selection is not working properly while removing the filter', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowFiltering: true,
                filterSettings: { type: 'Menu', hierarchyMode: 'Parent' },
                childMapping: 'subtasks',
                height: 350,
                autoCheckHierarchy: true,
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'taskName', headerText: 'Task Name', width: 220, showCheckbox: true },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 120 }
                ]
            },
            done
        );
    });

    it('Selecting the records when first Filter applied ', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.filterModule.filteredResult.length === 5).toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskID', 'lessthan', '6');
        (<HTMLElement>gridObj.getRows()[0].querySelectorAll('.e-treecheckselect')[0]).click();
        expect(gridObj.getCheckedRecords().length).toBe(5);
    });
    it('test the second filter applied ', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.filterModule.filteredResult.length === 4).toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('progress', 'greaterthan', '40');
    });
    it('Check the selected Records when remove the single column alone', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getCheckedRecords().length === 5).toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.removeFilteredColsByField('taskID');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Code coverage improvement', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                enableCollapseAll: true,
                filterSettings: { type: 'Menu', hierarchyMode: 'None'},
                columns: ['taskID', 'taskName', 'startDate', 'duration']
            },
            done
        );
    });
    it('clear filtering with enableCollapseAll', (done: Function) => {
        gridObj.filterByColumn('taskName', 'startswith', 'Plan');
        (<HTMLElement>gridObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
        (<HTMLElement>document.querySelectorAll('.e-flmenu-cancelbtn')[0]).click();
        expect(gridObj.getRows().length === 36).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('TreeGrid Filter and CollapseAll Tests', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowFiltering: true,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'duration', headerText: 'Duration' },
                    { field: 'progress', headerText: 'Progress' }

                ]
            },
            done
        );
    });
    it('Collapse All after applying filter with results', (done: Function) => {
       actionComplete = (args?: any): void => {
            if (args.requestType === 'filtering') {
                gridObj.collapseAll();
                 expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(true);         
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'contains', 'plan');
    });
     afterAll(() => {
        destroy(gridObj);
    });
});


describe('Expand/Collapse with Filtering in TreeGrid', () => {
    let treeGrid :TreeGrid;;

       beforeAll((done: Function) => {
        treeGrid = createGrid(
            {
                dataSource: sampleData,
                allowFiltering: true,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging:true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'duration', headerText: 'Duration' },
                    { field: 'progress', headerText: 'Progress' }

                ]
            },
            done
        );
    });
    it('should preserve expanded state after filtering by task name', (done) => {
        treeGrid.expandRow(treeGrid.getRows()[0] as HTMLTableRowElement);
        treeGrid.filterByColumn('taskName', 'contains', 'Plan');
        treeGrid.actionComplete = (args) => {
            if (args.requestType === 'filtering') {
                expect(treeGrid.getRows()[0].getAttribute('aria-expanded')).toBe('true');
                done();
            }
        };
    });

    it('should preserve collapsed state after removing filters', (done) => {
        treeGrid.collapseRow(treeGrid.getRows()[0] as HTMLTableRowElement);
        treeGrid.clearFiltering();
        treeGrid.actionComplete = (args) => {
            if (args.requestType == 'refresh') {
                expect(treeGrid.getRows()[0].getAttribute('aria-expanded')).toBe('false');
                done();
            }
        };
    });

    it('should expand all and filter, validating structure', (done) => {
        treeGrid.expandAll();
        treeGrid.filterByColumn('taskName', 'contains', 'Design');
        treeGrid.actionComplete = (args) => {
            if (args.requestType === 'filtering') {
                expect(treeGrid.getVisibleRecords().every(record => (record as any).taskName.includes('Design'))).toBe(true);
                done();
            }
        };
    });

    it('should maintain expand/collapse toggle state after filter operation', (done) => {
        treeGrid.filterByColumn('taskName', 'contains', 'plan');
        treeGrid.actionComplete = (args) => {
            if (args.requestType === 'filtering') {
                expect(isNullOrUndefined(treeGrid.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
                done();
            }
        };
    });

    it('should handle filter reset while preserving structural changes', (done) => {
        treeGrid.clearFiltering();
        treeGrid.expandAll();
        treeGrid.actionComplete = (args) => {
            if (args.requestType === 'refresh') {
                expect(isNullOrUndefined(treeGrid.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
                done();
            }
        };
    });

    it('should filter parent nodes and maintain child visibility states', (done) => {
        treeGrid.filterByColumn('taskName', 'contains', 'plan');
        treeGrid.actionComplete = (args) => {
            if (args.requestType === 'filtering') {
                expect((treeGrid.getVisibleRecords()[0]as any) .hasChildRecords).toBe(true);
                done();
            }
        };
    });

    it('should keep expand state intact when paging with filters', (done) => {
        treeGrid.expandRow(treeGrid.getRows()[0] as HTMLTableRowElement);
        treeGrid.pageSettings.pageSize=2;
        treeGrid.filterByColumn('taskName', 'contains', 'Plan');
        treeGrid.goToPage(2);
       
        treeGrid.actionComplete = (args) => {
            if (args.requestType === 'paging') {
                expect((treeGrid.getVisibleRecords()[0] as any).taskID==1).toBe(true);
                treeGrid.pageSettings.pageSize=12;
                done();
            }
        };
    });

    it('should ensure correct structure with child filters', (done) => {
        treeGrid.filterByColumn('taskName', 'contains', 'plan');
        treeGrid.actionComplete = (args) => {
            if (args.requestType === 'filtering') {
                expect((treeGrid.getVisibleRecords()[0] as any).taskName =="Planning").toBe(true);
                done();
            }
        };
    });

     afterAll(() => {
        treeGrid.destroy();
        
    });
});

describe('Expand/Collapse with Filtering in TreeGrid', () => {
    let treeGrid :TreeGrid;;

       beforeAll((done: Function) => {
        treeGrid = createGrid(
            {
                dataSource: sampleData,
                allowFiltering: true,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging:true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'duration', headerText: 'Duration' },
                    { field: 'progress', headerText: 'Progress' }

                ]
            },
            done
        );
    });

      it('should collapse all and apply filter, verifying results', (done) => {
        treeGrid.collapseAll();
        treeGrid.filterByColumn('taskName', 'contains', 'plan');
        treeGrid.actionComplete = (args) => {
            if (args.requestType === 'filtering') {
                
                expect(treeGrid.getVisibleRecords().length).toBeGreaterThan(0);
                done();
            }
        };
    });
    afterAll(() => {
        treeGrid.destroy();
        
    });
});


describe('Expand/Collapse with Filtering using enableCollapseAll in TreeGrid', () => {
     let treeGrid :TreeGrid;

       beforeAll((done: Function) => {
        treeGrid = createGrid(
            {
                dataSource: sampleData,
                allowFiltering: true,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                enableCollapseAll:true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'duration', headerText: 'Duration' },
                    { field: 'progress', headerText: 'Progress' }

                ]
            },
            done
        );
    });

    it('should apply filter with collapsed state and verify correct results', (done) => {
       treeGrid.filterByColumn('taskName', 'contains', 'plan');
       treeGrid.actionComplete = (args:any) => {
            if (args.requestType === 'filtering') {
                  expect((treeGrid.getVisibleRecords()[0] as any).taskName =="Planning").toBe(true);
                done();
            }
        };
    });

    it('should maintain collapse state after filter reset', (done) => {
        treeGrid.collapseAll();
        treeGrid.clearFiltering();

        treeGrid.actionComplete = (args:any) => {
            if (args.requestType == 'refresh') {
                expect(treeGrid.getVisibleRecords().length == 36).toBeFalsy();
               done();
            }
        };
    });
    
    it('should ensure all nodes are collapsed when filter result is empty', (done) => {
        treeGrid.filterByColumn('taskName', 'contains', 'NonExistentTask');

        treeGrid.actionComplete = (args:any) => {
            if (args.requestType === 'filtering') {
                expect(treeGrid.getVisibleRecords().length).toBe(0);
               done();
            }
        };
    });

    afterAll(() => {
        treeGrid.destroy();
        
    });
});

describe('TreeGrid Filtering Tests', () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;

  beforeAll((done: Function) => {
    gridObj = createGrid({
      dataSource: sampleData,
      childMapping: 'subtasks',
      treeColumnIndex: 1,
      allowFiltering: true,
      pageSettings: { pageSize: 11 },
      columns: [
        { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right' },
        { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
        { field: 'startDate', headerText: 'Start Date', width: 90, type: 'date', format: 'yMd' },
        { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
      ],
    }, done);
  });

  it('should filter records based on Task Name', (done: Function) => {
    actionComplete = (args?: Object): void => {
      const rows = gridObj.getRows();
      expect(isNullOrUndefined(rows[0].querySelector('.e-treegridexpand'))).toBe(false);
      expect(rows[0].querySelector('.e-treecell').textContent).toBe('Planning');
      expect(rows[1].querySelector('.e-treecell').textContent).toBe('Plan timeline');
      done();
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.filterByColumn('taskName', 'startswith', 'Plan');
  });

  it('should clear filters and restore original record count', (done: Function) => {
    actionComplete = (args?: Object): void => {
      expect(gridObj.getRows().length).toBe(36);
      done();
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.clearFiltering();
  });

  it('should filter using `endswith` and restore data upon clearing', (done: Function) => {
    actionComplete = (args?: Object): void => {
      expect(gridObj.getRows().length).toBe(2);
      const rows = gridObj.getRows();
      expect(rows[1].querySelector('.e-treecell').textContent).toContain('timeline');
      done();
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.filterByColumn('taskName', 'endswith', 'timeline');
  });

  it('should filter with `contains` and verify UI structure', (done: Function) => {
    actionComplete = (args?: Object): void => {
      const rows = gridObj.getRows();
      expect(rows.length).toBeGreaterThan(0);
      expect(/Design/.test(rows[0].querySelector('.e-treecell').textContent)).toBe(true);
      done();
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.filterByColumn('taskName', 'contains', 'Design');
  });

  afterAll(() => {
    destroy(gridObj);
  });

});

describe('Expand/Collapse Action after Filter', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('should expand/collapse nodes after filtering', (done: Function) => {
         actionComplete = (args?: any): void => {
            if (args.requestType === 'filtering') {
                expect(gridObj.getRows().length).toBeGreaterThan(0);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML).toBe('Planning');
                done();
            }
        };

        gridObj.expandAll();
        gridObj.collapseRow(<HTMLTableRowElement>gridObj.getRows()[0]);
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Plan');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Filter and Expand/Collapse Actions with Menu filter', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: Object) => void;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { type: 'Menu', hierarchyMode: 'Parent' },
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('should filter and then expand/collapse nodes', (done: Function) => {
        actionComplete = (args?: any): void => {
            if (args.requestType === 'filtering') {
                expect(gridObj.getRows().length).toBeGreaterThan(0);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML).toBe('Planning');

                gridObj.expandAll();
                gridObj.collapseRow(<HTMLTableRowElement>gridObj.getRows()[0]);
                done();
            }
        };

        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Plan');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Filter Action after Expand/Collapse with Self Reference Data (projectData)', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: any) => void;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 120, textAlign: 'Right' },
                    { field: 'TaskName', headerText: 'Task Name', width: 220 },
                    { field: 'StartDate', headerText: 'Start Date', width: 120 },
                    { field: 'EndDate', headerText: 'End Date', width: 120 },
                    { field: 'Progress', headerText: 'Progress', width: 120 }
                ]
            },
            done
        );
    });

    it('should filter rows correctly after expand/collapse action', (done: Function) => {
        actionComplete = (args: any): void => {
            if (args.requestType === 'filtering') {
                expect(gridObj.getRows().length).toBeGreaterThan(0);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].textContent).toBe('Parent Task 1');
                done();
            }
        };
        gridObj.expandAll();
        gridObj.collapseRow(<HTMLTableRowElement>gridObj.getRows()[0]);
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('TaskName', 'startswith', 'Parent');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Filter Action with Menu Filter after Expand/Collapse with Self Reference Data(projectData)', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: any) => void;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { type: 'Menu' },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 120, textAlign: 'Right' },
                    { field: 'TaskName', headerText: 'Task Name', width: 220 },
                    { field: 'StartDate', headerText: 'Start Date', width: 120 },
                    { field: 'EndDate', headerText: 'End Date', width: 120 },
                    { field: 'Progress', headerText: 'Progress', width: 120 }
                ]
            },
            done
        );
    });

    it('should filter rows correctly with menu filter after expand/collapse action', (done: Function) => {
        actionComplete = (args: any): void => {
            if (args.requestType === 'filtering') {
                expect(gridObj.getRows().length).toBeGreaterThan(0);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].textContent).toBe('Parent Task 1');
                done();
            }
        };
        gridObj.expandAll();
        gridObj.collapseRow(<HTMLTableRowElement>gridObj.getRows()[0]);
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('TaskName', 'startswith', 'Parent');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Filter Action with Excel Filter after Expand/Collapse with Self Reference Data (projectData)', () => {
    let gridObj: TreeGrid;
    let actionComplete: (args: any) => void;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { type: 'Excel' },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 120, textAlign: 'Right' },
                    { field: 'TaskName', headerText: 'Task Name', width: 220 },
                    { field: 'StartDate', headerText: 'Start Date', width: 120 },
                    { field: 'EndDate', headerText: 'End Date', width: 120 },
                    { field: 'Progress', headerText: 'Progress', width: 120 }
                ]
            },
            done
        );
    });

    it('should filter rows correctly with excel filter after expand/collapse action', (done: Function) => {
        actionComplete = (args: any): void => {
            if (args.requestType === 'filtering') {
                expect(gridObj.getRows().length).toBeGreaterThan(0);
                expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].textContent).toBe('Parent Task 1');
                done();
            }
        };
        gridObj.expandAll();
        gridObj.collapseRow(<HTMLTableRowElement>gridObj.getRows()[0]);
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('TaskName', 'startswith', 'Parent');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Cancel Filtering Action with Self Reference Data (projectData)', () => {
    let gridObj: TreeGrid;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 120, textAlign: 'Right' },
                    { field: 'TaskName', headerText: 'Task Name', width: 220 },
                    { field: 'StartDate', headerText: 'Start Date', width: 120 },
                    { field: 'EndDate', headerText: 'End Date', width: 120 },
                    { field: 'Progress', headerText: 'Progress', width: 120 }
                ]
            },
            done
        );
    });

    it('should not filter rows when filtering is cancelled', (done: Function) => {
        gridObj.grid.actionBegin = (args: any): void => {
            if (args.requestType === 'filtering') {
                args.cancel = true;
            }
        };
        const initialRowCount = gridObj.getRows().length;
        gridObj.filterByColumn('TaskName', 'startswith', 'Parent');
        setTimeout(() => {
            expect(gridObj.getRows().length).toBe(initialRowCount);
            done();
        }, 100); 
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Cancel Filtering Action with Menu Filter and Self Reference Data (projectData)', () => {
    let gridObj: TreeGrid;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowFiltering: true,
                filterSettings: { type: 'Menu' },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 120, textAlign: 'Right' },
                    { field: 'TaskName', headerText: 'Task Name', width: 220 },
                    { field: 'StartDate', headerText: 'Start Date', width: 120 },
                    { field: 'EndDate', headerText: 'End Date', width: 120 },
                    { field: 'Progress', headerText: 'Progress', width: 120 }
                ]
            },
            done
        );
    });

    it('should not filter rows when filtering is cancelled with menu filter', (done: Function) => {
        gridObj.grid.actionBegin = (args: any): void => {
            if (args.requestType === 'filtering') {
                args.cancel = true;
            }
        };
        const initialRowCount = gridObj.getRows().length;
        gridObj.filterByColumn('TaskName', 'startswith', 'Parent');
        setTimeout(() => {
            expect(gridObj.getRows().length).toBe(initialRowCount);
            done();
        }, 100);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Cancel Filtering Action with Hierarchy Data (sampleData)', () => {
    let gridObj: TreeGrid;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 120, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 220 },
                    { field: 'startDate', headerText: 'Start Date', width: 120 },
                    { field: 'endDate', headerText: 'End Date', width: 120 },
                    { field: 'duration', headerText: 'Duration', width: 120 },
                    { field: 'progress', headerText: 'Progress', width: 120 }
                ]
            },
            done
        );
    });

    it('should not filter rows when filtering is cancelled', (done: Function) => {
        gridObj.grid.actionBegin = (args: any): void => {
            if (args.requestType === 'filtering') {
                args.cancel = true;
            }
        };
        const initialRowCount = gridObj.getRows().length;
        gridObj.filterByColumn('taskName', 'startswith', 'Plan');
        setTimeout(() => {
            expect(gridObj.getRows().length).toBe(initialRowCount);
            done();
        }, 100);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('959378: Filtering using query and Sorting', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowFiltering: true,
                allowSorting:true,
                columns: ['taskID', 'taskName','duration', 'progress']
            },
            done
        );
    });

    it('Checked Sorted rows', (done: Function) => {
        actionComplete = (args?: any): void => {
            gridObj.sortByColumn('taskName','Ascending');
            if((args.requestType as any) === 'sorting'){
                expect(gridObj.getRows().length === 2).toBe(true);
                done();
            }
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.query = new Query().where('taskID', 'equal', 2);
        
    });
    afterAll(() => {
        destroy(gridObj);
    });
});