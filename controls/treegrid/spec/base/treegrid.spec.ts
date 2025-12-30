import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from './treegridutil.spec';
import { sampleData, projectData, expandStateData, testdata, treeMappedData, multiLevelSelfRef1, emptyChildData, allysonData, selfReferenceData, stateChangeData, childdata1, stackedData, columnSpanData, columnSpanSelfRefData } from './datasource.spec';
import { PageEventArgs, extend, doesImplementInterface, getObject, FilterEventArgs, SearchEventArgs, SortEventArgs, RowSelectEventArgs, ResizeArgs, ColumnModel } from '@syncfusion/ej2-grids';
import { RowExpandingEventArgs, RowCollapsingEventArgs } from '../../src';
import { ColumnMenu } from '../../src/treegrid/actions/column-menu';
import {Toolbar} from '../../src/treegrid/actions/toolbar';
import { isNullOrUndefined, L10n, createElement, EmitType, select, remove } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Page } from '../../src/treegrid/actions/page';
import { Filter } from '../../src/treegrid/actions/filter';
import { Sort } from '../../src/treegrid/actions/sort';
import { projectDatas as data } from './datasource.spec';
import { DataManager, RemoteSaveAdaptor, Query, WebApiAdaptor } from '@syncfusion/ej2-data';
import { Resize } from '../../src/treegrid/actions/resize';
import { Edit } from '../../src/treegrid/actions/edit';
import { Freeze } from '../../src/treegrid/actions/freeze-column';
import { Logger } from '../../src/treegrid/actions/logger';
import { Print } from '../../src/treegrid/actions/print';
import { ITreeData } from '../../src';

/**
 * Grid base spec
 */
TreeGrid.Inject(ColumnMenu, Toolbar, Page, Filter, Sort, Resize, Edit, Freeze, Logger, Print);

L10n.load({
    'de-DE': {
        'grid': {
            'EmptyRecord': 'Keine Aufzeichnungen angezeigt',
            'EmptyDataSourceError': 'DataSource darf bei der Erstauslastung nicht leer sein, da Spalten aus der dataSource im AutoGenerate Spaltenraster',
            'Item': 'Artikel',
            'Items': 'Artikel'
        },
        'pager': {
            'currentPageInfo': '{0} von {1} Seiten',
            'totalItemsInfo': '({0} Beiträge)',
            'firstPageTooltip': 'Zur ersten Seite',
            'lastPageTooltip': 'Zur letzten Seite',
            'nextPageTooltip': 'Zur nächsten Seite',
            'previousPageTooltip': 'Zurück zur letzten Seit',
            'nextPagerTooltip': 'Zum nächsten Pager',
            'previousPagerTooltip': 'Zum vorherigen Pager'
        }
    }
});

describe('TreeGrid base module', () => {

    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); //Skips test (in Chai)
            return;
        }
    });

    describe('Hierarchy Data Basic Rendering', () => {
        let gridObj: TreeGrid;
        let rows: Element[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    showColumnMenu: true,
                    columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
                    actionBegin: (args: PageEventArgs) => {return true; },
                    actionComplete: (args: PageEventArgs) => {return true; }
                },
                done
            );
        });
        it('expand testing', () => {
            rows = gridObj.getRows();
            gridObj.columnMenuModule.getColumnMenu();
            (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
            expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
        });
        it('collapse testing', () => {
            rows = gridObj.getRows();
            (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
            expect(rows[1].classList.contains('e-childrow-visible')).toBe(true);
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

describe('Self Reference Data Basic Rendering', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
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

    it('expand testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
    });
    it('collapse testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        expect(rows[1].classList.contains('e-childrow-visible')).toBe(true);
    });
    it('empty dataSource Update', (done: Function) => {
        gridObj.dataBound = (args: Object) => {
            expect((<HTMLTableElement>gridObj.getContentTable()).rows[0].classList.contains('e-emptyrow')).toBe(true);
            done();
        };
        gridObj.dataSource = [];
        gridObj.dataBind();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Self Reference DataSource update', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
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
    it('dataSource Update', (done: Function) => {
        const data: Object[] = projectData.slice();
        data.push({TaskID : 52, TaskName : 'Test'});
        gridObj.dataBound = (args: PageEventArgs) => {
            rows = gridObj.getRows();
            expect((rows[rows.length - 1] as HTMLTableRowElement).cells[1].textContent).toBe('Test');
            done();
        };
        gridObj.dataSource = data;
        gridObj.dataBind();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('expandcollapse method', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });

    it('collapse testing', () => {
        gridObj.collapseRow(null, gridObj.flatData[11]);
        rows = gridObj.getRows();
        expect(rows[12].classList.contains('e-childrow-hidden')).toBe(true);
        gridObj.collapseRow(rows[0] as HTMLTableRowElement);
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
    });
    it('expand testing', () => {
        gridObj.expandRow(null, gridObj.flatData[11]);
        rows = gridObj.getRows();
        expect(rows[12].classList.contains('e-childrow-visible')).toBe(true);
        gridObj.expandRow(rows[0] as HTMLTableRowElement);
        expect(rows[1].classList.contains('e-childrow-visible')).toBe(true);
    });
    it('treecolumnIndex set model testing', () => {
        gridObj.treeColumnIndex = 2;
        gridObj.dataBind();
        rows = gridObj.getRows();
        expect(((rows[0] as HTMLTableRowElement).cells[2].getElementsByClassName('e-treegridexpand').length).toFixed(1));
    });
    it('getPersistData method', () => {
        expect(gridObj.getPersistData()).toBeDefined();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('grid methods, setmodel', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
                dataBound: (args: Object) => {
                    if (document.querySelectorAll('.e-popup-open').length) {
                        document.querySelectorAll('.e-popup-open')[0].remove();
                    }
                    expect(gridObj.showSpinner).toBeDefined();
                    gridObj.showSpinner();
                    expect(gridObj.hideSpinner).toBeDefined();
                    gridObj.hideSpinner();
                    expect(gridObj.refresh).toBeDefined();
                    gridObj.refresh();
                    expect(gridObj.refreshHeader).toBeDefined();
                    gridObj.refreshHeader();
                    done();
                }
            },
            done
        );
    });
    it('setmodel', () => {
        gridObj.actionComplete = (args: PageEventArgs) => {
            expect(gridObj.grid.showColumnMenu).toBeTruthy();
        };
        gridObj.showColumnMenu = true;
        gridObj.dataBind();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('flat Data Basic Rendering', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: treeMappedData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('collapse testing', () => {
        rows = gridObj.getDataRows();
        expect(rows.length).toBe(5);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('RTL Testing', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                showColumnMenu: true,
                toolbar: ['ExpandAll', 'CollapseAll'],
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
                actionBegin: (args: PageEventArgs) => {return true; },
                actionComplete: (args: PageEventArgs) => {return true; }
            },
            done
        );
    });
    it('enable RTL testing', () => {
        gridObj.enableRtl = true;
        gridObj.dataBind();
        expect(gridObj.element.querySelector('.e-grid').classList.contains('e-rtl')).toBeTruthy();
    });
    it('presence of expand/collapse tools', () => {
        const toolbarElements: Element = gridObj.grid.toolbarModule.getToolbar().firstElementChild;
        expect(toolbarElements.querySelectorAll('.e-toolbar-item')[0].getAttribute('title')).toBe('Expand All');
        expect(toolbarElements.querySelectorAll('.e-toolbar-item')[1].getAttribute('title')).toBe('Collapse All');
    });
    /*it('click events', () => {
      (<HTMLElement>select('#' + gridObj.grid.element.id + '_collapseall', gridObj.grid.toolbarModule.getToolbar())).click();
      expect((<HTMLTableRowElement>gridObj.getRows()[1]).style.display).toBe('none');
      (<HTMLElement>select('#' + gridObj.grid.element.id + '_expandall', gridObj.grid.toolbarModule.getToolbar())).click();
      expect((<HTMLTableRowElement>gridObj.getRows()[1]).style.display).toBe('table-row');
  });*/
    it('disable RTL testing', () => {
        gridObj.enableRtl = false;
        gridObj.dataBind();
        expect(gridObj.element.querySelector('.e-grid').classList.contains('e-rtl')).toBeFalsy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('grid expand methods and properties', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
                enableCollapseAll: true
            },
            done
        );
    });
    it('enableCollapseAll testing', () => {
        expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(0);
        gridObj.enableCollapseAll = false;
        gridObj.dataBind();
        expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(9);
        gridObj.enableCollapseAll = true;
        gridObj.dataBind();
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(9);
        gridObj.enableCollapseAll = false;
    });
    it('expandstatemapping testing', (done: Function) => {
        gridObj.actionComplete = (args: Object) => {
            expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
            done();
        };
        gridObj.expandStateMapping = 'isInExpandState';
        gridObj.dataBind();
    });
    it('collapseAtLevel testing', () => {
        gridObj.collapseAtLevel(1);
        expect(gridObj.getRows()[1].querySelectorAll('.e-treegridcollapse').length).toBe(0);
        expect(gridObj.getRows()[12].querySelectorAll('.e-treegridcollapse').length).toBe(1);
        gridObj.expandAtLevel(1);
        expect(gridObj.getRows()[12].querySelectorAll('.e-treegridexpand').length).toBe(1);
        expect(gridObj.getDataModule()).toBeDefined();
    });
    it('expandrow event testing', () => {
        rows = <HTMLTableRowElement[]>gridObj.getRows();
        gridObj.expandAll();
        gridObj.collapseRow(rows[1]);
        gridObj.collapsing = (args: RowCollapsingEventArgs) => {
            args.cancel = true;
        };
        gridObj.collapseRow(rows[0]);
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
        gridObj.collapsing = undefined;
        gridObj.collapseRow(rows[0]);
        gridObj.expanding = (args: RowExpandingEventArgs) => {
            args.cancel = true;
        };
        gridObj.expandRow(rows[0]);
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(1);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('keyBoard Interaction for collapse particular parent row', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    const preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                selectionSettings: { mode: 'Cell' },
                columns: ['taskID', 'taskName', 'duration', 'progress']
            },
            done
        );
    });
    it('keyBoard Interaction', () => {
        gridObj.selectCell({ cellIndex: 1, rowIndex: 0 }, true);
        gridObj.keyboardModule.keyAction({ action: 'ctrlShiftUpArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        rows = gridObj.getRows();
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
        gridObj.keyboardModule.keyAction({ action: 'ctrlShiftDownArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        expect(rows[1].classList.contains('e-childrow-visible')).toBe(true);
        gridObj.keyboardModule.keyAction({ action: 'ctrlUpArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        expect(gridObj.getRows()[1].classList.contains('e-childrow-hidden')).toBe(true);
        gridObj.keyboardModule.keyAction({ action: 'ctrlDownArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        expect(gridObj.getRows()[1].classList.contains('e-childrow-visible')).toBe(true);
        gridObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        expect(gridObj.getRows()[1].querySelectorAll('.e-focused').length).toBe(1);
        gridObj.keyboardModule.keyAction({ action: 'upArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1] } as any);
        expect(gridObj.getRows()[0].querySelectorAll('.e-focused').length).toBe(1);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Self Reference -multiple child levels', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: multiLevelSelfRef1,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
            },
            done
        );
    });

    it('third inner level child', () => {
        expect(gridObj.getRows()[4].querySelector('td').innerText).toBe('44');
        expect(gridObj.getRows()[4].querySelectorAll('.e-treegridexpand').length).toBe(1);
        expect(gridObj.getRows()[5].querySelector('td').innerText).toBe('9');
        expect(gridObj.getRows()[6].querySelector('td').innerText).toBe('444');
        expect(gridObj.getRows()[9].querySelectorAll('.e-treegridexpand').length).toBe(1);
        expect(gridObj.getRows()[10].querySelectorAll('.e-treegridexpand').length).toBe(1);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Set height and width as 100%', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: '100%',
                width: '100%',
                columns: ['taskID', 'taskName', 'duration', 'progress']
            },
            done
        );
    });
    it('Set height and width as 100%', () => {
        expect(gridObj.element.style.height).toBe('100%');
        expect(gridObj.element.style.width).toBe('100%');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Set height and width as 100% using set model', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'duration', 'progress']
            },
            done
        );
    });
    it('Set height and width as 100% using set model', () => {
        gridObj.height = '100%';
        gridObj.width = '100%';
        gridObj.dataBind();
        expect(gridObj.element.style.height).toBe('100%');
        expect(gridObj.element.style.width).toBe('100%');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checking dataSource property after updating', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('Check the length of dataSource after splicing', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect(gridObj.getRows().length == 11).toBe(true);
            expect(isNullOrUndefined(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
            expect(gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML == 'Planning').toBe(true);
            expect(isNullOrUndefined(gridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treegridexpand'))).toBe(false);
            expect(gridObj.getRows()[5].getElementsByClassName('e-rowcell')[1].querySelector('div>.e-treecell').innerHTML == 'Design').toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.dataSource = (<any>gridObj.dataSource).splice(0, 2);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('columnMenu, setmodel', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                showColumnMenu: true,
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('setmodel', () => {
        gridObj.columnMenuItems = [{text: 'Clear Sorting', id: 'gridclearsorting'}];
        expect(gridObj.columnMenuModule.getColumnMenu().children.length).toBeGreaterThan(0);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checking dataSource when Children property is empty', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: emptyChildData,
                childMapping: 'Children',
                treeColumnIndex: 0,
                columns: ['Name']
            },
            done
        );
    });
    it('Checking dataSource when Children property is empty', () => {
        expect(gridObj.getRows().length == 7).toBe(true);
        expect(gridObj.getRows()[6].classList.contains('e-treegridexpand')).toBe(false);
        expect(gridObj.getRows()[6].classList.contains('e-treegridcollapse')).toBe(false);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Check ParentData for Hierarchy data', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'duration', 'progress']
            },
            done
        );
    });
    it('check parentdata length after rendering', () => {
        expect(gridObj.flatData.length).toBe(36);
        expect(gridObj.parentData.length).toBe(3);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Check ParentData for Selfreference data', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: multiLevelSelfRef1,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                columns: ['TaskID', 'TaskName', 'Duration', 'Progress']
            },
            done
        );
    });
    it('check parentdata length after rendering for selfreference data', () => {
        expect(gridObj.flatData.length).toBe(12);
        expect(gridObj.parentData.length).toBe(2);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-22983: DataSource is not proper whose parentIDMapping record is not defined', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: allysonData,
                idMapping: 'AreaId',
                parentIdMapping: 'AreaPaiId',
                treeColumnIndex: 1,
                columns: ['AreaPaiId', 'AreaId', 'Nome']
            },
            done
        );
    });

    it('Rendering of unordered list', () => {
        expect(Object(gridObj.dataSource).length === gridObj.getCurrentViewRecords().length).toBe(true);
        expect(gridObj.getRows().length === gridObj.getCurrentViewRecords().length).toBe(true);
        gridObj.collapseAtLevel(1);
        let h: number = 0;
        (<any>(gridObj.element.querySelectorAll('.e-treegridcollapse')))
            .forEach((args: any) => {
                if (args.closest('tr').classList.contains('e-childrow-hidden')) {
                    h++;
                }
            });
        expect(h === 14).toBe(true);
        gridObj.expandAtLevel(1);
    });
    it('Collapsing testing', () => {
        let h: number = 0;
        expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(18);
        gridObj.collapseRow(<HTMLTableRowElement>(gridObj.getRowByIndex(2)));
        (<any>(gridObj.element.querySelectorAll('.e-gridrowindex2level3')))
            .forEach((args: any) => {
                if (args.parentElement.classList.contains('e-childrow-hidden')) {
                    h++;
                }
            });
        expect(h === 3).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Self Reference Data Basic Rendering with ParentIDMapping value as Null', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: selfReferenceData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate']
            },
            done
        );
    });

    it('expand testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-25219: uniqueIDCollection is not updated if the datasource contains level property', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: testdata,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskId', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Checking uniqueIDCollection values', ()  => {
        expect(Object.keys(getObject('uniqueIDCollection', gridObj)).length !== 0).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('keyBoard Interaction for collapse particular parent row by selecting a cell', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    const preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'duration', 'progress']
            },
            done
        );
    });
    it('keyBoard Interaction', () => {
    //gridObj.selectCell({ cellIndex: 3, rowIndex: 0 }, true);
        gridObj.keyboardModule.keyAction({ action: 'ctrlShiftUpArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[3] } as any);
        rows = gridObj.getRows();
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-25984: check enablePersistence property in TreeGrid - pageSettings', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Checking pageSettings property with enablePersistence', (done: Function)  => {
        actionComplete = (args?: PageEventArgs): void => {
            if (args.requestType == 'paging') {
                expect(gridObj.pageSettings.currentPage == 2).toBe(true);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.goToPage(2);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-25984: check enablePersistence property in TreeGrid - filterSettings', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                allowFiltering: true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Checking filterSettings property with enablePersistence', (done: Function)  => {
        actionComplete = (args?: FilterEventArgs): void => {
            if (args.requestType == 'filtering') {
                expect(gridObj.filterSettings.columns[0].value == 'Plan').toBe(true);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Plan');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-25984: check enablePersistence property in TreeGrid - searchSettings', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                allowFiltering: true,
                toolbar: [ 'Search'],
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Checking searchSettings property with enablePersistence', (done: Function)  => {
        actionComplete = (args?: SearchEventArgs): void => {
            if (args.requestType == 'searching') {
                expect(gridObj.searchSettings.key == 'Testing').toBe(true);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.search('Testing');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checking setCellValue method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    mode: 'Cell',
                    newRowPosition: 'Below'

                },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 60, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                    {
                        field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd'
                    },
                    { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' }
                ]
            },
            done
        );
    });
    it('Checking Tree Grid data source value', () => {
        gridObj.setCellValue(1, 'taskName', 'test');
        expect(gridObj.dataSource[0].taskName === 'test').toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-25984: check enablePersistence property in TreeGrid - sortSettings', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                allowSorting: true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80 },
                    { field: 'taskName', headerText: 'Task Name', width: 200 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90 }
                ]
            },
            done
        );
    });
    it('Checking sortSettings property with enablePersistence ', (done: Function)  => {
        actionComplete = (args?: SortEventArgs): void => {
            if (args.requestType == 'sorting') {
                expect(gridObj.sortSettings.columns[0].direction == 'Ascending').toBe(true);
                expect(gridObj.sortSettings.columns[0].field == 'taskName').toBe(true);
                done();
            }
        };
        gridObj.actionComplete = actionComplete;
        gridObj.sortByColumn('taskName', 'Ascending', true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-22122-Locale change using SetModel', () => {
    let gridObj: TreeGrid;
    let dataBound: () => void;
    let rowSelected: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('locale testing', () => {
        gridObj.dataBound = dataBound;
        gridObj.locale = 'de-DE';
        dataBound = (args?: Object): void => {
            expect(((gridObj.getPager().getElementsByClassName('e-parentmsgbar')[0] as HTMLElement).innerText.search('von'))).toBe(2);
        };
    });
    it('selectedrowindex testing', () => {
        gridObj.rowSelected = rowSelected;
        gridObj.selectedRowIndex = 2;
        rowSelected = (args?: RowSelectEventArgs): void => {
            expect(args.rowIndex).toBe(2);
        };
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checking aria-expanded attribute for tr element', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('Checking aria-expanded attribute for tr element at initial rendering', () => {
        rows = gridObj.getRows();
        expect(rows[0].hasAttribute('aria-expanded') === true).toBe(true);
        expect(rows[1].hasAttribute('aria-expanded') === false).toBe(true);
        expect(rows[5].hasAttribute('aria-expanded') === true).toBe(true);
        expect(rows[6].hasAttribute('aria-expanded') === false).toBe(true);
        expect(rows[11].hasAttribute('aria-expanded') === true).toBe(true);
    });
    it('Checking aria-expanded attribute for tr element after collaping', () => {
        gridObj.collapseRow(null, gridObj.flatData[0]);
        rows = gridObj.getRows();
        expect(rows[0].getAttribute('aria-expanded') == 'false').toBe(true);
        gridObj.expandRow(null, gridObj.flatData[0]);
        expect(rows[0].getAttribute('aria-expanded') == 'true').toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checking template position', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right' },
                    {
                        headerText: 'Template', textAlign: 'Center',
                        template: '<button id="button">Button</button>', width: 90
                    }
                ]
            },
            done
        );
    });
    it('Checking template position when the template column is marked as treeColumnIndex ', () => {
        const cell = document.getElementsByClassName('e-templatecell')[0];
        expect((cell.getElementsByClassName('e-treecell')[0] as any).innerText == 'Button').toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('borderline testing after expand and collapse records', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                enableCollapseAll: true,
                height: '400px',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('borderline testing after expand', () => {
        rows = gridObj.getRows();
        gridObj.expandRow(rows[11]);
        expect(rows[28].cells[0].classList.contains('e-lastrowcell')).toBe(true);
    });
    it('borderline testing after collapse', () => {
        rows = gridObj.getRows();
        gridObj.expandRow(rows[11]);
        gridObj.collapseRow(rows[11]);
        expect(rows[11].cells[0].classList.contains('e-lastrowcell')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checking borderline for last record after initial rendering', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                enableCollapseAll: true,
                height: '400px',
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('checking border line', () => {
        rows = gridObj.getRows();
        expect(rows[11].cells[0].classList.contains('e-lastrowcell')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Self Reference Data ExpandState Mapping for multiple levels', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: expandStateData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                height: '450px',
                treeColumnIndex: 1,
                expandStateMapping: 'isExpand',
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 140 },
                    { field: 'TaskName', headerText: 'Task Name', width: 160 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
                    { field: 'EndDate', headerText: 'End Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
                    { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 110},
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 110},
                    { field: 'Priority', headerText: 'Priority', width: 110}
                ]
            },
            done
        );
    });

    it('expand testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        expect(rows[1].classList.contains('e-childrow-visible')).toBe(true);
        expect(rows[2].classList.contains('e-childrow-visible')).toBe(true);
        expect(rows[2].getElementsByClassName('e-treegridexpand').length).toBe(1);
        expect(rows[3].classList.contains('e-childrow-visible')).toBe(true);
    });

    it('collapse testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
        expect(rows[2].classList.contains('e-childrow-hidden')).toBe(true);
        expect(rows[3].classList.contains('e-childrow-hidden')).toBe(true);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Self Reference Data ExpandState Mapping for multiple levels', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: expandStateData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                height: '450px',
                treeColumnIndex: 1,
                expandStateMapping: 'isExpand',
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 140 },
                    { field: 'TaskName', headerText: 'Task Name', width: 160 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
                    { field: 'EndDate', headerText: 'End Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
                    { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 110},
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 110},
                    { field: 'Priority', headerText: 'Priority', width: 110}
                ]
            },
            done
        );
    });

    it('expand testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        expect(rows[1].classList.contains('e-childrow-visible')).toBe(true);
        expect(rows[2].classList.contains('e-childrow-visible')).toBe(true);
        expect(rows[2].getElementsByClassName('e-treegridexpand').length).toBe(1);
        expect(rows[3].classList.contains('e-childrow-visible')).toBe(true);
    });

    it('collapse testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
        expect(rows[2].classList.contains('e-childrow-hidden')).toBe(true);
        expect(rows[3].classList.contains('e-childrow-hidden')).toBe(true);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('borderline testing after expand and collapse records', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                enableCollapseAll: true,
                height: '400px',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('borderline testing after expand', () => {
        rows = gridObj.getRows();
        gridObj.expandRow(rows[11]);
        expect(rows[28].cells[0].classList.contains('e-lastrowcell')).toBe(true);
    });
    it('borderline testing after collapse', () => {
        rows = gridObj.getRows();
        gridObj.expandRow(rows[11]);
        gridObj.collapseRow(rows[11]);
        expect(rows[11].cells[0].classList.contains('e-lastrowcell')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checking borderline for last record after initial rendering', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                enableCollapseAll: true,
                height: '400px',
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('checking border line', () => {
        rows = gridObj.getRows();
        expect(rows[11].cells[0].classList.contains('e-lastrowcell')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('sort comparer', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    const data = [
        { 'TaskID': 1, 'TaskName': 'Parent Task 1', 'StartDate': new Date('03/14/2017'),
            'EndDate': new Date('02/27/2017'), 'Duration': 3, 'Progress': '40', 'Priority': 'Normal' },
        { 'TaskID': 5, 'TaskName': 'Parent Task 2', 'StartDate': null,
            'EndDate': new Date('03/18/2017'), 'Duration': 6, 'Progress': '40', 'Priority': 'Normal' },
        { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': null,
            'EndDate': new Date('03/06/2017'), 'Duration': 11, 'Progress': '40', 'parentID': 5, 'Priority': 'High' },
        { 'TaskID': 7, 'TaskName': 'Child Task 2', 'StartDate': new Date('03/02/2017'),
            'EndDate': new Date('03/06/2017'), 'Duration': 7, 'Progress': '40', 'parentID': 5, 'Priority': 'Critical' }
    ];
    const data1: DataManager = new DataManager({
        json: data,
        adaptor: new RemoteSaveAdaptor()
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data1,
                allowSorting: true,
                allowPaging: true,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                actionBegin: actionBegin,
                pageSettings: { pageSize: 10 },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 140 },
                    { field: 'TaskName', headerText: 'Task Name', width: 160 },
                    { field: 'StartDate', headerText: 'Start Date', sortComparer: sortComparer, textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' } },
                    { field: 'EndDate', headerText: 'End Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' } }
                ]
            },
            done
        );
    });
    let action: string;
    /**
     * @param args
     */
    function actionBegin(args: SortEventArgs) {
        if (args.requestType === 'sorting') {
            action = args.direction;
        }
    }
    /**
     * @param reference
     * @param comparer
     */
    function sortComparer (reference: any, comparer: any) {
        const sortAsc = action === 'Ascending' ? true : false;
        if (sortAsc && reference === null) {
            return 1;
        } else if (sortAsc && comparer === null) {
            return -1;
        } else if (!sortAsc && reference === null) {
            return -1;
        } else if (!sortAsc && comparer === null) {
            return 1;
        } else {
            return reference - comparer;
        }
    }

    it('Sort comparer check', (done: Function) => {
        actionComplete = (args?: Object): void => {
            expect((gridObj.getRows()[3].getElementsByClassName('e-rowcell')[2]).innerHTML == '').toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.sortByColumn('StartDate', 'Descending', true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('sub level parent expand/collapse icon', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    const data = [{'TaskId': 1, 'TaskName': 'Parent Task 1', 'Duration': 10, 'ParentId': null, 'isParent': true, 'isExpanded': true},
        {'TaskId': 2, 'TaskName': 'Child task 1', 'Duration': 4, 'ParentId': 1, 'isParent': null, 'isExpanded': true},
        {'TaskId': 15, 'TaskName': 'Sub task 1', 'Duration': 4, 'ParentId': 2, 'isParent': null, 'isExpanded': true},
        {'TaskId': 13, 'TaskName': 'Child task 5', 'Duration': 4, 'ParentId': 15, 'isParent': null, 'isExpanded': false},
        {'TaskId': 5, 'TaskName': 'Parent Task 2', 'Duration': 10, 'ParentId': null, 'isParent': true, 'isExpanded': true},
        {'TaskId': 6, 'TaskName': 'Child task 2', 'Duration': 4, 'ParentId': 5, 'isParent': null, 'isExpanded': false},
        {'TaskId': 10, 'TaskName': 'Parent Task 3', 'Duration': 10, 'ParentId': null, 'isParent': true, 'isExpanded': true},
        {'TaskId': 11, 'TaskName': 'Child task 3', 'Duration': 4, 'ParentId': 10, 'isParent': false, 'isExpanded': false}];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                idMapping: 'TaskID',
                parentIdMapping: 'ParentId',
                height: '450px',
                treeColumnIndex: 1,
                expandStateMapping: 'isExpanded',

                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 140 },
                    { field: 'TaskName', headerText: 'Task Name', width: 160 }

                ]
            },
            done
        );
    });
    it('expand testing', () => {
        rows = gridObj.getRows();
        expect(rows[0].getElementsByClassName('e-treegridexpanded')).toBeTruthy();
        expect(rows[2].getElementsByClassName('e-treegridexpanded')).toBeTruthy();

    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Refresh', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                editSettings: { allowEditing: true, mode: 'Row', allowDeleting: true, allowAdding: true, newRowPosition: 'Above' },

                treeColumnIndex: 1,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                columns: [{ field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' },
                    { field: 'duration', headerText: 'Duration' },
                    { field: 'startDate', headerText: 'Start Date' }
                ]
            },
            done
        );
    });

    it('refresh method', (done: Function) => {
        let count = 10;
        actionComplete = (args?: Object): void => {
            expect((gridObj.getRows()[0].getElementsByClassName('e-rowcell')[2] as HTMLElement).innerText == '11').toBeTruthy();
            expect((gridObj.getRows()[0].getElementsByClassName('e-rowcell')[3] as HTMLElement).innerText == '10').toBeTruthy();
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.dataSource[0].duration = count++;
        gridObj.dataSource[0].progress = count++;
        if (gridObj != undefined) {
            gridObj.refresh();
        }
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checking template column Expand/Collapse', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right' },
                    {
                        headerText: 'Template', textAlign: 'Center',
                        template: '<button id="button">Button</button>', width: 90
                    }
                ]
            },
            done
        );
    });
    it('Checking Expand/Collapse action when the template column is marked as treeColumnIndex ', () => {
        rows = gridObj.getRows();
        gridObj.collapseRow(rows[0] as HTMLTableRowElement);
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
        gridObj.expandRow(rows[0] as HTMLTableRowElement);
        expect(rows[1].classList.contains('e-childrow-visible')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-51954-Expand/Collapse At level method', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [{ 'ID': 'projectXYZ', 'GUID': 'A66B74DE-97B2-4A77-B6D5-7B9D5353C458', 'Description': 'Description 1', 'NodeType': 'Project', 'Name': 'Project XYW', 'hasChild': true },
                    { 'ID': '2361861', 'GUID': 'A66B74DE-97B2-4A77-B6D5-7B9D5353C458', 'Description': 'Description 2', 'NodeType': 'Type1', 'Name': '0000', 'PID': 'projectXYZ' },
                    { 'ID': '2361848', 'GUID': '8C1B0509-B50C-4DEA-A2DC-9049F6FA0D99', 'Description': 'Description 3', 'NodeType': 'Type1', 'Name': '3', 'PID': '2361861' },
                    { 'ID': '2361827', 'GUID': '677DE6EA-FACF-4B4F-BBCF-E2003B7AC98F', 'Description': 'Description 13', 'NodeType': 'Type1', 'Name': '1', 'PID': '2361861' },
                    { 'ID': '2361857', 'GUID': '9F5E2D4A-60C5-40A2-8273-BF6A8A2E97B0', 'Description': 'Description 14', 'NodeType': 'Type1', 'Name': '13', 'PID': '2361848' },
                    { 'ID': '2361858', 'GUID': '9F5E2D4A-60C5-40A2-8273-BF6A8A2E97B0', 'Description': 'Description 15', 'NodeType': 'Type1', 'Name': '14', 'PID': '2361827' },
                    { 'ID': '2361850', 'GUID': '9F5E2D4A-60C5-40A2-8273-BF6A8A2E97B0', 'Description': 'Description 16', 'NodeType': 'Type1', 'Name': '15', 'PID': '2361857' },
                    { 'ID': '236185809', 'GUID': '9F5E2D4A-60C5-40A2-8273-BF6A8A2E97B0', 'Description': 'Description 15', 'NodeType': 'Type1', 'Name': '16', 'PID': '2361858' }
                ],
                idMapping: 'ID',
                parentIdMapping: 'PID',
                enableCollapseAll: true,
                treeColumnIndex: 1,
                columns: [
                    { field: 'ID', headerText: 'Task ID', width: 90, visible: false, textAlign: 'Right' },
                    { field: 'Name', headerText: 'Task Name', width: 180 }
                ]
            },
            done
        );
    });

    it('ExpandAtLevel testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        (rows[1].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        (rows[2].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        gridObj.selectRow(3);
        gridObj.expandAtLevel(3);
        expect(rows[6].classList.contains('e-childrow-visible')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-53010-Expand At level method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [
                    {
                        taskID: 1,
                        taskName: 'Planning',
                        startDate: new Date('02/03/2017'),
                        endDate: new Date('02/07/2017'),
                        progress: 100,
                        duration: 5,
                        priority: 'Normal',
                        approved: false,
                        subtasks: [
                            {
                                taskID: 2,
                                taskName: 'Plan timeline',
                                startDate: new Date('02/03/2017'),
                                endDate: new Date('02/07/2017'),
                                duration: 5,
                                progress: 100,
                                priority: 'Normal',
                                approved: false
                            },
                            {
                                taskID: 3,
                                taskName: 'Plan budget',
                                startDate: new Date('02/03/2017'),
                                endDate: new Date('02/07/2017'),
                                duration: 5,
                                progress: 100,
                                priority: 'Low',
                                approved: true
                            },
                            {
                                taskID: 4,
                                taskName: 'Allocate resources',
                                startDate: new Date('02/03/2017'),
                                endDate: new Date('02/07/2017'),
                                duration: 5,
                                progress: 100,
                                priority: 'Critical',
                                approved: false
                            },
                            {
                                taskID: 5,
                                taskName: 'Planning complete',
                                startDate: new Date('02/07/2017'),
                                endDate: new Date('02/07/2017'),
                                duration: 0,
                                progress: 0,
                                priority: 'Low',
                                approved: true
                            }
                        ]
                    },
                    {
                        taskID: 6,
                        taskName: 'Design',
                        startDate: new Date('02/10/2017'),
                        endDate: new Date('02/14/2017'),
                        duration: 3,
                        progress: 86,
                        priority: 'High',
                        approved: false,
                        subtasks: [
                            {
                                taskID: 7,
                                taskName: 'Software Specification',
                                startDate: new Date('02/10/2017'),
                                endDate: new Date('02/12/2017'),
                                duration: 3,
                                progress: 60,
                                priority: 'Normal',
                                approved: false
                            },
                            {
                                taskID: 8,
                                taskName: 'Develop prototype',
                                startDate: new Date('02/10/2017'),
                                endDate: new Date('02/12/2017'),
                                duration: 3,
                                progress: 100,
                                priority: 'Critical',
                                approved: false
                            },
                            {
                                taskID: 9,
                                taskName: 'Get approval from customer',
                                startDate: new Date('02/13/2017'),
                                endDate: new Date('02/14/2017'),
                                duration: 2,
                                progress: 100,
                                priority: 'Low',
                                approved: true
                            },
                            {
                                taskID: 10,
                                taskName: 'Design Documentation',
                                startDate: new Date('02/13/2017'),
                                endDate: new Date('02/14/2017'),
                                duration: 2,
                                progress: 100,
                                priority: 'High',
                                approved: true
                            },
                            {
                                taskID: 11,
                                taskName: 'Design complete',
                                startDate: new Date('02/14/2017'),
                                endDate: new Date('02/14/2017'),
                                duration: 0,
                                progress: 0,
                                priority: 'Normal',
                                approved: true
                            }
                        ]
                    }
                ],
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 180 },
                    {
                        field: 'startDate',
                        headerText: 'Start Date',
                        width: 90,
                        textAlign: 'Right',
                        type: 'date',
                        format: 'yMd'
                    },
                    {
                        field: 'endDate',
                        headerText: 'End Date',
                        width: 90,
                        textAlign: 'Right',
                        type: 'date',
                        format: 'yMd'
                    },
                    {
                        field: 'duration',
                        headerText: 'Duration',
                        width: 80,
                        textAlign: 'Right'
                    },
                    {
                        field: 'progress',
                        headerText: 'Progress',
                        width: 80,
                        textAlign: 'Right'
                    },
                    { field: 'priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });

    it('ExpandAtLevel', () => {
        gridObj.collapseAtLevel(0);
        gridObj.expandAtLevel(0);
        expect(gridObj.getRows()[0].querySelectorAll('.e-treegridexpand').length).toBe(1);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-54516-expandByKey method testing', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 90, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 180 },
                    {
                        field: 'startDate',
                        headerText: 'Start Date',
                        width: 90,
                        textAlign: 'Right',
                        type: 'date',
                        format: 'yMd'
                    },
                    {
                        field: 'endDate',
                        headerText: 'End Date',
                        width: 90,
                        textAlign: 'Right',
                        type: 'date',
                        format: 'yMd'
                    },
                    {
                        field: 'duration',
                        headerText: 'Duration',
                        width: 80,
                        textAlign: 'Right'
                    },
                    {
                        field: 'progress',
                        headerText: 'Progress',
                        width: 80,
                        textAlign: 'Right'
                    },
                    { field: 'priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });

    it('Expand/Collapse By Key', (done: Function) => {
        gridObj.collapseByKey(6);
        expect(gridObj.getRows()[5].querySelector('.e-treegridcollapse').classList.contains('e-treegridcollapse')).toBe(true);
        gridObj.expandByKey(6);
        expect(gridObj.getRows()[5].querySelector('.e-treegridexpand').classList.contains('e-treegridexpand')).toBe(true);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-54516-expand/collapse level method test with params', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                enableCollapseAll: true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 90, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 180 },
                    {
                        field: 'startDate',
                        headerText: 'Start Date',
                        width: 90,
                        textAlign: 'Right',
                        type: 'date',
                        format: 'yMd'
                    },
                    {
                        field: 'endDate',
                        headerText: 'End Date',
                        width: 90,
                        textAlign: 'Right',
                        type: 'date',
                        format: 'yMd'
                    },
                    {
                        field: 'duration',
                        headerText: 'Duration',
                        width: 80,
                        textAlign: 'Right'
                    },
                    {
                        field: 'progress',
                        headerText: 'Progress',
                        width: 80,
                        textAlign: 'Right'
                    },
                    { field: 'priority', headerText: 'Priority', width: 90 }
                ],
                expanding: function(args: RowExpandingEventArgs) {
                    args.expandAll = true;
                },
                collapsing: function(args: RowCollapsingEventArgs) {
                    args.collapseAll = true;
                }
            },
            done
        );
    });

    it('ExpandAtLevel with params', (done: Function) => {
        gridObj.expandAtLevel(1);
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(2);
        gridObj.collapseAtLevel(1);
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(8);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-57180 - Last grid Line missing after collapsing all records while using setRowData method', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                toolbar: ['CollapseAll'],
                collapsed: function(args){
                    const dataId = args.data.taskID;
                    gridObj.setRowData(dataId, args.data);
                },
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 90 },
                    { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, format: 'yMd' },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 80 },
                    { field: 'priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });

    it('checking border line', () => {
        gridObj.collapseAll();
        rows = gridObj.getRows();
        expect(rows[11].cells[0].classList.contains('e-lastrowcell')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('RTL with Tree column alignment Testing - EJ2-57397', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                enableRtl: true,
                columns: [
                    { field: 'taskID', headerText: 'Player Jersey', width: 140, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Player Name', width: 140, textAlign: 'Left' },
                    { field: 'progress', headerText: 'Year', width: 120, textAlign: 'Right' }
                ]
            },
            done
        );
    });
    it('TreeColumn alignment testing', () => {
        expect((gridObj.columns[1] as any).textAlign == 'Right').toBeTruthy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('ExpandStateMapping not update issue - EJ2-59094', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [ {
                    taskID: 1,
                    taskName: 'Planning',
                    startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'),
                    progress: 100,
                    duration: 5,
                    isExpanded: false,
                    priority: 'Normal',
                    approved: false,
                    designation: 'Vice President',
                    employeeID: 1,
                    subtasks: [
                        {
                            taskID: 2,
                            taskName: 'Plan timeline',
                            startDate: new Date('02/03/2017'),
                            endDate: new Date('02/07/2017'),
                            duration: 5,
                            progress: 100,
                            priority: 'Normal',
                            approved: false,
                            designation: 'Chief Executive Officer',
                            employeeID: 2
                        }
                    ]
                }],
                expandStateMapping: 'isExpanded',
                childMapping: 'subtasks',
                editSettings: { allowEditing: true },
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Player Jersey', isPrimaryKey: true, width: 140, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Player Name', width: 140, textAlign: 'Left' },
                    { field: 'progress', headerText: 'Year', width: 120, textAlign: 'Right' }
                ]
            },
            done
        );
    });
    it('ExpandStateMapping value change testing', () => {
        expect(gridObj.dataSource[0].isExpanded == false).toBeTruthy();
        gridObj.expandRow(gridObj.getRows()[0]);
        expect(gridObj.dataSource[0].isExpanded == true).toBeTruthy();
        gridObj.collapseRow(gridObj.getRows()[0]);
        expect(gridObj.dataSource[0].isExpanded == false).toBeTruthy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-58631 - Extra line adding when using setRowData method', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                toolbar: ['CollapseAll'],
                collapsed: function(args){
                    const dataId = args.data.taskID;
                    gridObj.setRowData(dataId, args.data);
                },
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 90 },
                    { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, format: 'yMd' },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 80 },
                    { field: 'priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });

    it('checking extra border line', () => {
        gridObj.collapseAll();
        rows = gridObj.getRows();
        expect(rows[0].cells[0].classList.contains('e-lastrowcell')).toBe(false);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-64501 - shimmer effect check for normal tree grid', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
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

describe('EJ2-65573- The expanded or collapsed state is not read properly by the NVDA screen reader', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: '410',
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 60, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 150, textAlign: 'Left' },
                    { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' }
                ]
            },
            done
        );
    });

    it('aria-expanded attribute checked', () => {
        expect((gridObj.element.querySelectorAll('.e-row')[0].querySelectorAll('.e-treerowcell')[0] as any).hasAttribute('aria-expanded')).toBe(true);

    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-65701- With the frozenRows property, the methods expand & collpase do not work properly using external button', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: '410',
                frozenRows: 3,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 60, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 150, textAlign: 'Left' },
                    { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' }
                ]
            },
            done
        );
    });

    it('expand & collapse action checking while enable the frozen row', () => {
        rows = gridObj.getRows();
        gridObj.collapseRow(rows[5]);
        expect(rows[6].classList.contains('e-childrow-hidden')).toBe(true);
        gridObj.expandRow(rows[5]);
        expect(rows[6].classList.contains('e-childrow-visible')).toBe(true);
    });
    it('expandall & collapseall action checking while enable the frozen row', () => {
        gridObj.collapseAll();
        expect(gridObj.getRows()[11].cells[0].classList.contains('e-lastrowcell')).toBe(true);
        gridObj.expandAll();
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-66816- Collapsing the records after filtering thows script error', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowFiltering: true,
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 1,
                columns: [
                    {field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 90,  isPrimaryKey: true },
                    {field: 'taskName', headerText: 'Task Name', width: 130 },
                    {field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', format: 'yMd'},
                    {field: 'progress', headerText: 'Progress', width: 90, textAlign: 'Right' },
                    {field: 'duration', headerText: 'Duration', width: 90, textAlign: 'Right' },
                    {field: 'priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });

    it('collapseAll after filtering the records', (done: Function) => {
        actionComplete = (args?: Object): void => {
            gridObj.collapseAll();
	  expect(gridObj.getVisibleRecords().length === 1).toBe(true);
            done();
        };
        gridObj.grid.actionComplete = actionComplete;
        gridObj.filterByColumn('taskName', 'startswith', 'Testing');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-58631 - Script Error thrown while calling lastRowBorder method', () => {

  type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
  type ResponseType = { result: Object[], count: number | string };

  const mockAjax: Function = (d: { data: { [o: string]: Object | Object[] } | Object[], dm?: DataManager }, query: Query | Function, response?: Object):
  MockAjaxReturn => {
      jasmine.Ajax.install();
      const dataManager = d.dm || new DataManager({
          url: '/api/Employees'
      });
      const prom: Promise<Object> = dataManager.executeQuery(query);
      let request: JasmineAjaxRequest;
      const defaults: Object = {
          'status': 200,
          'contentType': 'application/json',
          'responseText': JSON.stringify(d.data)
      };
      const responses: Object = {};
      request = jasmine.Ajax.requests.mostRecent();
      extend(responses, defaults, response);
      request.respondWith(responses);
      return {
          promise: prom,
          request: request
      };
  };

  let gridObj: TreeGrid;
  const elem: HTMLElement = createElement('div', { id: 'Grid' });
  let request: JasmineAjaxRequest;
  let rows: HTMLTableRowElement[];
  let dataManager: DataManager;
  let originalTimeout: number;
  beforeAll((done: Function) => {
      const dataBound: EmitType<Object> = () => { done(); };
      spyOn(window, 'fetch').and.returnValue(Promise.resolve(
          new Response(JSON.stringify({ d: data.filter((e: { [x: string]: Object; }) => { return isNullOrUndefined(e['parentID']); }), __count: 15 }), {
              status: 200
          })
      ));
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
      dataManager = new DataManager({
          url: 'http://localhost:50499/Home/UrlData',
          crossDomain: true
      });
      document.body.appendChild(elem);
      gridObj = new TreeGrid(
          {
              dataSource: dataManager, dataBound: dataBound,
              hasChildMapping: 'isParent',
              idMapping: 'TaskID',
              parentIdMapping: 'ParentID',
              treeColumnIndex: 1,
              columns: [
                  { field: 'TaskID', isPrimaryKey: true, headerText: 'Task Id' },
                  { field: 'TaskName', headerText: 'Task Name' },
                  { field: 'StartDate', headerText: 'Start Date' },
                  { field: 'EndDate', headerText: 'End Date' },
                  { field: 'Progress', headerText: 'Progress' }
              ]
          });
      gridObj.appendTo('#Grid');
      request = window.fetch['calls'].mostRecent();
  });

  it('checking script error', (done: Function) => {
      const firstdata = { TaskID: 1, Duration: 2, TaskName: 'newChild', Progress: 45 };
      const lastdata = { TaskID: 3, Duration: 2, TaskName: 'newChild', Progress: 45 };
      gridObj.setRowData(firstdata.TaskID, firstdata as object);
      rows = gridObj.getRows();
      const lenValue = (gridObj.getRows().length) - 1;
      expect(rows[0].cells[0].classList.contains('e-lastrowcell')).toBe(false);
      gridObj.setRowData(lastdata.TaskID, lastdata as object);
      expect(rows[lenValue].cells[0].classList.contains('e-lastrowcell')).toBe(true);
      done();
  });

  afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      gridObj.destroy();
      remove(elem);
      jasmine.Ajax.uninstall();
  });
});

describe('keyBoard Interaction for expand/collapse child row', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 2,
                allowPaging: true,
                pageSettings: { pageSize: 10 },
                allowSelection: true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 70, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                    { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
                    { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                    { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' },
                    { field: 'priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });
    it('keyBoard Interaction', () => {
        gridObj.selectRow(1);
        gridObj.keyboardModule.keyAction({
            action: 'ctrlShiftUpArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1]
        } as any);
        expect(gridObj.getRows()[0].getElementsByClassName('e-treecolumn-container')[0].children[0].classList.contains('e-treegridexpand')).toBe(true);
        gridObj.keyboardModule.keyAction({
            action: 'ctrlShiftDownArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1]
        } as any);
        expect(gridObj.getRows()[0].getElementsByClassName('e-treecolumn-container')[0].children[0].classList.contains('e-treegridexpand')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-68334 - Column width(resizing) not persisted while using Stacked Columns in case of enablePersistence enabled', () => {
    let TreeGridObj: TreeGrid;
    let headers: any;
    const resizeStartevent: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartevent');
    const resizeStop: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartStop');
    const resize: EmitType<ResizeArgs> = jasmine.createSpy('resize');
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: stackedData,
                allowPaging: true,
                allowResizing: true,
                enablePersistence: true,
                resizeStart: resizeStartevent,
                resizeStop: resizeStop,
                resizing: resize,
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 1,
                pageSettings: { pageCount: 5 },
                columns: [
                    {
                        headerText: 'Order Details', textAlign: 'Center', columns: [
                            { field: 'orderID', headerText: 'Order ID', textAlign: 'Right', width: 90 },
                            { field: 'orderName', headerText: 'Order Name', textAlign: 'Left', width: 150, minWidth: 50, maxWidth: 250 },
                            { field: 'orderDate', headerText: 'Order Date', textAlign: 'Right', width: 120, format: 'yMd'}
                        ]
                    },
                    {
                        headerText: 'Shipment Details', textAlign: 'Center', columns: [
                            { field: 'shipMentCategory', headerText: 'Shipment Category', textAlign: 'Left', width: 150 },
                            { field: 'shippedDate', headerText: 'Shipped Date', textAlign: 'Right', width: 120, format: 'yMd' },
                            { field: 'units', headerText: 'Units', textAlign: 'Left', width: 85 }
                        ]
                    },
                    {
                        headerText: 'Price Details', textAlign: 'Center', columns: [
                            { field: 'unitPrice', headerText: 'Price per unit', format: 'c2', type: 'number', width: 110, textAlign: 'Right' },
                            { field: 'price', headerText: 'Total Price', width: 110, format: 'c', type: 'number', textAlign: 'Right' }
                        ]
                    }
                ]
            }, done);
    });

    it('Resizing and refreshing the treegrid', () => {
        TreeGridObj.autoFitColumns('orderName');
        headers = (<HTMLElement>TreeGridObj.getHeaderTable().querySelectorAll('th')[0]).style.width;
        TreeGridObj.refresh();
        expect(headers).toBeFalsy();
        const columnwidth: string | number = getObject('width', (TreeGridObj.columns[0] as ColumnModel).columns[1]);
        expect(columnwidth === '165px').toBe(true);
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});

describe('EJ2-69752 - Resizing not works when persistence enable while resizing in combination of both individual and Stacked column', () => {
    let TreeGridObj: TreeGrid;
    let headers: any;
    const resizeStartevent: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartevent');
    const resizeStop: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartStop');
    const resize: EmitType<ResizeArgs> = jasmine.createSpy('resize');
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: stackedData,
                allowPaging: true,
                allowResizing: true,
                enablePersistence: true,
                resizeStart: resizeStartevent,
                resizeStop: resizeStop,
                resizing: resize,
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 1,
                pageSettings: { pageCount: 5 },
                columns: [
                    { field: 'orderID', headerText: 'Order ID', textAlign: 'Right', width: 150, minWidth: 50, maxWidth: 250 },
                    {
                        headerText: 'Order Details', textAlign: 'Center', columns: [
                            { field: 'orderName', headerText: 'Order Name', textAlign: 'Left', width: 150, minWidth: 50, maxWidth: 250 },
                            { field: 'orderDate', headerText: 'Order Date', textAlign: 'Right', width: 120, format: 'yMd'}
                        ]
                    },
                    {
                        headerText: 'Shipment Details', textAlign: 'Center', columns: [
                            { field: 'shipMentCategory', headerText: 'Shipment Category', textAlign: 'Left', width: 150 },
                            { field: 'shippedDate', headerText: 'Shipped Date', textAlign: 'Right', width: 120, format: 'yMd' },
                            { field: 'units', headerText: 'Units', textAlign: 'Left', width: 85 }
                        ]
                    },
                    {
                        headerText: 'Price Details', textAlign: 'Center', columns: [
                            { field: 'unitPrice', headerText: 'Price per unit', format: 'c2', type: 'number', width: 110, textAlign: 'Right' },
                            { field: 'price', headerText: 'Total Price', width: 110, format: 'c', type: 'number', textAlign: 'Right' }
                        ]
                    }
                ]
            }, done);
    });

    it('Resizing both individual and Stacked column and refreshing the treegrid', () => {
        TreeGridObj.autoFitColumns(['orderID', 'orderName']);
        headers = (<HTMLElement>TreeGridObj.getHeaderTable().querySelectorAll('th')[0]).style.width;
        TreeGridObj.refresh();
        expect(headers).toBeFalsy();
        const normalColumnWidth: string | number = getObject('width', TreeGridObj.columns[0] as ColumnModel);
        expect(normalColumnWidth === '71px').toBe(true);
        const columnWidth: string | number = getObject('width', (TreeGridObj.columns[1] as ColumnModel).columns[0]);
        expect(columnWidth === '165px').toBe(true);
        TreeGridObj.resizeModule.destroy();
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});

describe('EJ2-70639 - Provide XSS- security for Tree Grid', () => {
    let gridObj: TreeGrid;
    const XssData: Object[] = [
        {
            taskID: 1,
            taskName: '<img id="target" src="x" onerror="alert(document.domain)">',
            startDate: new Date('02/03/2017'),
            endDate: new Date('02/07/2017'),
            progress: 100,
            duration: 5,
            priority: 'Normal',
            approved: false,
            isInExpandState: true,
            subtasks: [
                { taskID: 2, taskName: 'Plan timeline', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Normal', approved: false },
                { taskID: 3, taskName: 'Plan budget', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, approved: true },
                { taskID: 4, taskName: 'Allocate resources', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Critical', approved: false },
                { taskID: 5, taskName: '<img id="target" src="x" onerror="alert(document.domain)">', startDate: new Date('02/07/2017'), endDate: new Date('02/07/2017'), duration: 0, progress: 0, priority: 'Low', approved: true }
            ]
        },
        {
            taskID: 6,
            taskName: 'Design',
            startDate: new Date('02/10/2017'),
            endDate: new Date('02/14/2017'),
            duration: 3,
            progress: 86,
            priority: 'High',
            isInExpandState: false,
            approved: false,
            subtasks: [
                { taskID: 7, taskName: 'Software Specification', startDate: new Date('02/10/2017'), endDate: new Date('02/12/2017'), duration: 3, progress: 60, priority: 'Normal', approved: false },
                { taskID: 8, taskName: 'Develop prototype', startDate: new Date('02/10/2017'), endDate: new Date('02/12/2017'), duration: 3, progress: 100, priority: 'Critical', approved: false },
                { taskID: 9, taskName: 'Get approval from customer', startDate: new Date('02/13/2017'), endDate: new Date('02/14/2017'), duration: 2, progress: 100, approved: true },
                { taskID: 10, taskName: 'Design Documentation', startDate: new Date('02/13/2017'), endDate: new Date('02/14/2017'), duration: 2, progress: 100, approved: true },
                { taskID: 11, taskName: 'Design complete', startDate: new Date('02/14/2017'), endDate: new Date('02/14/2017'), duration: 0, progress: 0, priority: 'Normal', approved: true }
            ]
        }];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: XssData,
                childMapping: 'subtasks',
                enableHtmlSanitizer: true,
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 80, disableHtmlEncode: false },
                    { field: 'taskName', headerText: 'Task Name', width: 200, disableHtmlEncode: false },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 100, format: { skeleton: 'yMd', type: 'date' }, disableHtmlEncode: false },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 90, disableHtmlEncode: false },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 90, disableHtmlEncode: false }
                ]
            },
            done
        );
    });
    it('test the html sanitizer', () => {
        expect((gridObj.getRowByIndex(0) as any ).cells[1].innerHTML.includes('<img id="target" src="x" onerror="alert(document.domain)">')).toBe(false);
        expect((gridObj.getRowByIndex(4) as any ).cells[1].innerHTML.includes('<img id="target" src="x" onerror="alert(document.domain)">')).toBe(false);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('878792 - OnClick event was not binded while creating button in treegrid with HtmlEncode enabled in Javascript Treegrid', () => {
    let TreeGridObj: TreeGrid;
    
    beforeAll((done: Function) => {
        TreeGridObj = createGrid(
            {
                dataSource: [
                    {
                        taskName:
                            '<button id="editComment"  data-toggle="tooltip" data-placement="top" title="Edit Comment" onclick="buttonClick()" type=\'button\' class=\'e-control e-btn e-lib e-small e-primary btn-savecomment e-button-80pt\'><i class="ms-Icon ms-Icon--EditSolid12"></i> Edit Comment</button>',
                    },
                ],
                allowPaging: true,
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 1,
                columns: [
                    { type: 'checkbox', width: 60 },
                    {
                      field: 'taskName',
                      headerText: 'Task Name',
                      width: 200,
                      textAlign: 'Left',
                      disableHtmlEncode: false,
                    },
                  ],
            }, done);
    });

    it('check button click present', () => {
        expect(document.getElementById('editComment').onclick.length === 1).toBe(true);
    });
    afterAll(() => {
        destroy(TreeGridObj);
    });
});


describe('EJ2-71118 - Tab navigation throws script error while navigating to the next row of the collapsed items.', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                height: '400',
                enableCollapseAll: true,
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 250 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 120 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 135 }
                ]
            },
            done
        );
    });
    it('Record and navigate over the cells through Tab', (done: Function) => {
        gridObj.collapseRow(gridObj.getRows()[0]);
        const event: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(0, 3).dispatchEvent(event);
        gridObj.grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: gridObj.element.querySelector('.e-rowcell.e-focus') });
        expect(gridObj.getRows()[5].cells[0].classList.contains('e-focus')).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 839261: Column template is not working properly when using getPersistData method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                pageSettings: { pageSizes: true, pageSize: 5, pageCount: 2 },
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', template: '<span>test</span>', headerText: 'Task Name' },
                    { field: 'startDate', headerText: 'Start Date'},
                    { field: 'duration', headerText: 'duration' }
                ]
            },
            done
        );
    });
    it('column template is not visible', () => {
        gridObj.getPersistData();
        gridObj.collapseRow(gridObj.getRowByIndex(0) as HTMLTableRowElement);
        expect(gridObj.getRows()[0].cells[1].classList.contains('e-templatecell')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Null or undefined check', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', template: '<span>test</span>', headerText: 'Task Name' },
                    { field: 'startDate', headerText: 'Start Date'},
                    { field: 'duration', headerText: 'duration' }
                ]
            },
            done
        );
    });
    it('Paging', () => {
        gridObj.allowPaging = null;
        gridObj.dataBind();
        expect(gridObj.allowPaging).toBe(null);
        gridObj.allowPaging = undefined;
        gridObj.dataBind();
        expect(gridObj.allowPaging).toBe(undefined);
    });
    it('Filtering', () => {
        gridObj.allowFiltering = null;
        gridObj.dataBind();
        expect(gridObj.allowFiltering).toBe(null);
        gridObj.allowFiltering = undefined;
        gridObj.dataBind();
        expect(gridObj.allowFiltering).toBe(undefined);
    });
    it('Sorting', () => {
        gridObj.allowSorting = null;
        gridObj.dataBind();
        expect(gridObj.allowSorting).toBe(null);
        gridObj.allowSorting = undefined;
        gridObj.dataBind();
        expect(gridObj.allowSorting).toBe(undefined);
    });
    it('MultiSorting', () => {
        gridObj.allowMultiSorting = null;
        gridObj.dataBind();
        expect(gridObj.allowMultiSorting).toBe(null);
        gridObj.allowMultiSorting = undefined;
        gridObj.dataBind();
        expect(gridObj.allowMultiSorting).toBe(undefined);
    });
    it('ExcelExport', () => {
        gridObj.allowExcelExport = null;
        gridObj.dataBind();
        expect(gridObj.allowExcelExport).toBe(null);
        gridObj.allowExcelExport = undefined;
        gridObj.dataBind();
        expect(gridObj.allowExcelExport).toBe(undefined);
    });
    it('Keyboard', () => {
        gridObj.allowKeyboard = null;
        gridObj.dataBind();
        expect(gridObj.allowKeyboard).toBe(null);
        gridObj.allowKeyboard = undefined;
        gridObj.dataBind();
        expect(gridObj.allowKeyboard).toBe(undefined);
    });
    it('PDFExport', () => {
        gridObj.allowPdfExport = null;
        gridObj.dataBind();
        expect(gridObj.allowPdfExport).toBe(null);
        gridObj.allowPdfExport = undefined;
        gridObj.dataBind();
        expect(gridObj.allowPdfExport).toBe(undefined);
    });
    it('Reordering', () => {
        gridObj.allowReordering = null;
        gridObj.dataBind();
        expect(gridObj.allowReordering).toBe(null);
        gridObj.allowReordering = undefined;
        gridObj.dataBind();
        expect(gridObj.allowReordering).toBe(undefined);
    });
    it('Resizing', () => {
        gridObj.allowResizing = null;
        gridObj.dataBind();
        expect(gridObj.allowResizing).toBe(null);
        gridObj.allowResizing = undefined;
        gridObj.dataBind();
        expect(gridObj.allowResizing).toBe(undefined);
    });
    it('RowDragAndDrop', () => {
        gridObj.allowRowDragAndDrop = null;
        gridObj.dataBind();
        expect(gridObj.allowRowDragAndDrop).toBe(null);
        gridObj.allowRowDragAndDrop = undefined;
        gridObj.dataBind();
        expect(gridObj.allowRowDragAndDrop).toBe(undefined);
    });
    it('Selection', () => {
        gridObj.allowSelection = null;
        gridObj.dataBind();
        expect(gridObj.allowSelection).toBe(null);
        gridObj.allowSelection = undefined;
        gridObj.dataBind();
        expect(gridObj.allowSelection).toBe(undefined);
    });
    it('TextWrap', () => {
        gridObj.allowTextWrap = null;
        gridObj.dataBind();
        expect(gridObj.allowTextWrap).toBe(null);
        gridObj.allowTextWrap = undefined;
        gridObj.dataBind();
        expect(gridObj.allowTextWrap).toBe(undefined);
    });
    it('AdaptiveUI', () => {
        gridObj.enableAdaptiveUI = null;
        gridObj.dataBind();
        expect(gridObj.enableAdaptiveUI).toBe(null);
        gridObj.enableAdaptiveUI = undefined;
        gridObj.dataBind();
        expect(gridObj.enableAdaptiveUI).toBe(undefined);
    });
    it('Alternative Row', () => {
        gridObj.enableAltRow = null;
        gridObj.dataBind();
        expect(gridObj.enableAltRow).toBe(null);
        gridObj.enableAltRow = undefined;
        gridObj.dataBind();
        expect(gridObj.enableAltRow).toBe(undefined);
    });
    it('AutoFill', () => {
        gridObj.enableAutoFill = null;
        gridObj.dataBind();
        expect(gridObj.enableAutoFill).toBe(null);
        gridObj.enableAutoFill = undefined;
        gridObj.dataBind();
        expect(gridObj.enableAutoFill).toBe(undefined);
    });    
    it('Initial rendering collapsed state', () => {
        gridObj.enableCollapseAll = null;
        gridObj.dataBind();
        expect(gridObj.enableCollapseAll).toBe(null);
        gridObj.enableCollapseAll = undefined;
        gridObj.dataBind();
        expect(gridObj.enableCollapseAll).toBe(undefined);
    });
    it('Column Virtualization', () => {
        gridObj.enableColumnVirtualization = null;
        gridObj.dataBind();
        expect(gridObj.enableColumnVirtualization).toBe(null);
        gridObj.enableColumnVirtualization = undefined;
        gridObj.dataBind();
        expect(gridObj.enableColumnVirtualization).toBe(undefined);
    });
    it('Hovering', () => {
        gridObj.enableHover = null;
        gridObj.dataBind();
        expect(gridObj.enableHover).toBe(null);
        gridObj.enableHover = undefined;
        gridObj.dataBind();
        expect(gridObj.enableHover).toBe(undefined);
    });
    it('Html Sanitizer', () => {
        gridObj.enableHtmlSanitizer = null;
        gridObj.dataBind();
        expect(gridObj.enableHtmlSanitizer).toBe(null);
        gridObj.enableHtmlSanitizer = undefined;
        gridObj.dataBind();
        expect(gridObj.enableHtmlSanitizer).toBe(undefined);
    });
    it('Immutable mode', () => {
        gridObj.enableImmutableMode = null;
        gridObj.dataBind();
        expect(gridObj.enableImmutableMode).toBe(null);
        gridObj.enableImmutableMode = undefined;
        gridObj.dataBind();
        expect(gridObj.enableImmutableMode).toBe(undefined);
    });
    it('Infinity Scrolling', () => {
        gridObj.enableInfiniteScrolling = null;
        gridObj.dataBind();
        expect(gridObj.enableInfiniteScrolling).toBe(null);
        gridObj.enableInfiniteScrolling = undefined;
        gridObj.dataBind();
        expect(gridObj.enableInfiniteScrolling).toBe(undefined);
    });
    it('Persistance', () => {
        gridObj.enablePersistence = null;
        gridObj.dataBind();
        expect(gridObj.enablePersistence).toBe(null);
        gridObj.enablePersistence = undefined;
        gridObj.dataBind();
        expect(gridObj.enablePersistence).toBe(undefined);
    });
    it('RTL', () => {
        gridObj.enableRtl = null;
        gridObj.dataBind();
        expect(gridObj.enableRtl).toBe(null);
        gridObj.enableRtl = undefined;
        gridObj.dataBind();
        expect(gridObj.enableRtl).toBe(undefined);
    });
    it('Virtual Mask Row', () => {
        gridObj.enableVirtualMaskRow = null;
        gridObj.dataBind();
        expect(gridObj.enableVirtualMaskRow).toBe(null);
        gridObj.enableVirtualMaskRow = undefined;
        gridObj.dataBind();
        expect(gridObj.enableVirtualMaskRow).toBe(undefined);
    });
    it('Virtualization', () => {
        gridObj.enableVirtualization = null;
        gridObj.dataBind();
        expect(gridObj.enableVirtualization).toBe(null);
        gridObj.enableVirtualization = undefined;
        gridObj.dataBind();
        expect(gridObj.enableVirtualization).toBe(undefined);
    });
    it('Aggregate', () => {
        gridObj.aggregates = null;
        gridObj.dataBind();
        expect(gridObj.aggregates.length).toBe(0);
        gridObj.aggregates = undefined;
        gridObj.dataBind();
        expect(gridObj.aggregates.length).toBe(0);
    });
    it("clipMode", () => {
        gridObj.clipMode = null;
        gridObj.dataBind();
        expect(gridObj.clipMode).toBe(null);
        gridObj.clipMode = undefined;
        gridObj.dataBind();
        expect(gridObj.clipMode).toBe(undefined);
    });
    it("columnMenuItems", () => {
        gridObj.columnMenuItems = null;
        gridObj.dataBind();
        expect(gridObj.columnMenuItems).toBe(null);
        gridObj.columnMenuItems = undefined;
        gridObj.dataBind();
        expect(gridObj.columnMenuItems).toBe(undefined);
    });
    it("columnQueryMode", () => {
        gridObj.columnQueryMode = null;
        gridObj.dataBind();
        expect(gridObj.columnQueryMode).toBe(null);
        gridObj.columnQueryMode = undefined;
        gridObj.dataBind();
        expect(gridObj.columnQueryMode).toBe(undefined);
    });
    it("columns", () => {
        gridObj.columns = null;
        gridObj.dataBind();
        expect(gridObj.columns).toBe(null);
        gridObj.columns = undefined;
        gridObj.dataBind();
        expect(gridObj.columns).toBe(undefined);
    });
    it("contextMenuItems", () => {
        gridObj.contextMenuItems = null;
        gridObj.dataBind();
        expect(gridObj.contextMenuItems).toBe(null);
        gridObj.contextMenuItems = undefined;
        gridObj.dataBind();
        expect(gridObj.contextMenuItems).toBe(undefined);
    });
    it("dataSource", () => {
        gridObj.dataSource = null;
        gridObj.dataBind();
        expect(gridObj.dataSource).toBe(null);
        gridObj.dataSource = undefined;
        gridObj.dataBind();
        expect(gridObj.dataSource).toBe(undefined);
    });
    it("detailTemplate", () => {
        gridObj.detailTemplate = null;
        gridObj.dataBind();
        expect(gridObj.detailTemplate).toBe(null);
        gridObj.detailTemplate = undefined;
        gridObj.dataBind();
        expect(gridObj.detailTemplate).toBe(undefined);
    });
    it("frozenColumns", () => {
        gridObj.frozenColumns = null;
        gridObj.dataBind();
        expect(gridObj.frozenColumns).toBe(null);
        gridObj.frozenColumns = undefined;
        gridObj.dataBind();
        expect(gridObj.frozenColumns).toBe(undefined);
    });
    it("frozenRows", () => {
        gridObj.frozenRows = null;
        gridObj.dataBind();
        expect(gridObj.frozenRows).toBe(null);
        gridObj.frozenRows = undefined;
        gridObj.dataBind();
        expect(gridObj.frozenRows).toBe(undefined);
    });
    it("gridLines", () => {
        gridObj.gridLines = null;
        gridObj.dataBind();
        expect(gridObj.gridLines).toBe(null);
        gridObj.gridLines = undefined;
        gridObj.dataBind();
        expect(gridObj.gridLines).toBe(undefined);
    });
    it("height", () => {
        gridObj.height = null;
        gridObj.dataBind();
        expect(gridObj.height).toBe(null);
        gridObj.height = undefined;
        gridObj.dataBind();
        expect(gridObj.height).toBe(undefined);
    });
    it("loadingIndicator", () => {
        gridObj.loadingIndicator.indicatorType = null;
        gridObj.dataBind();
        expect(gridObj.loadingIndicator.indicatorType).toBe(null);
        gridObj.loadingIndicator.indicatorType = undefined;
        gridObj.dataBind();
        expect(gridObj.loadingIndicator.indicatorType).toBe(undefined);
    });
    it("pagerTemplate", () => {
        gridObj.pagerTemplate = null;
        gridObj.dataBind();
        expect(gridObj.pagerTemplate).toBe(null);
        gridObj.pagerTemplate = undefined;
        gridObj.dataBind();
        expect(gridObj.pagerTemplate).toBe(undefined);
    });
    it("printMode", () => {
        gridObj.printMode = null;
        gridObj.dataBind();
        expect(gridObj.printMode).toBe(null);
        gridObj.printMode = undefined;
        gridObj.dataBind();
        expect(gridObj.printMode).toBe(undefined);
    });
    it("query", () => {
        gridObj.query = null;
        gridObj.dataBind();
        expect(gridObj.query).toBe(null);
        gridObj.query = undefined;
        gridObj.dataBind();
        expect(gridObj.query).toBe(undefined);
    });
    it("rowHeight", () => {
        gridObj.rowHeight = null;
        gridObj.dataBind();
        expect(gridObj.rowHeight).toBe(null);
        gridObj.rowHeight = undefined;
        gridObj.dataBind();
        expect(gridObj.rowHeight).toBe(undefined);
    });
    it("rowTemplate", () => {
        gridObj.rowTemplate = null;
        gridObj.dataBind();
        expect(gridObj.rowTemplate).toBe(null);
        gridObj.rowTemplate = undefined;
        gridObj.dataBind();
        expect(gridObj.rowTemplate).toBe(undefined);
    });
    it("selectedRowIndex", () => {
        gridObj.selectedRowIndex = null;
        gridObj.dataBind();
        expect(gridObj.selectedRowIndex).toBe(null);
        gridObj.selectedRowIndex = undefined;
        gridObj.dataBind();
        expect(gridObj.selectedRowIndex).toBe(undefined);
    });
    it("showColumnChooser", () => {
        gridObj.showColumnChooser = null;
        gridObj.dataBind();
        expect(gridObj.showColumnChooser).toBe(null);
        gridObj.showColumnChooser = undefined;
        gridObj.dataBind();
        expect(gridObj.showColumnChooser).toBe(undefined);
    });
    it("showColumnMenu", () => {
        gridObj.showColumnMenu = null;
        gridObj.dataBind();
        expect(gridObj.showColumnMenu).toBe(null);
        gridObj.showColumnMenu = undefined;
        gridObj.dataBind();
        expect(gridObj.showColumnMenu).toBe(undefined);
    });
    it("toolbar", () => {
        gridObj.toolbar = null;
        gridObj.dataBind();
        expect(gridObj.toolbar).toBe(null);
        gridObj.toolbar = undefined;
        gridObj.dataBind();
        expect(gridObj.toolbar).toBe(undefined);
    });

    it("toolbarTemplate", () => {
        gridObj.toolbarTemplate = null;
        gridObj.dataBind();
        expect(gridObj.toolbarTemplate).toBe(null);
        gridObj.toolbarTemplate = undefined;
        gridObj.dataBind();
        expect(gridObj.toolbarTemplate).toBe(undefined);
    });
    it("width", () => {
        gridObj.width = null;
        gridObj.dataBind();
        expect(gridObj.width).toBe(null);
        gridObj.width = undefined;
        gridObj.dataBind();
        expect(gridObj.width).toBe(undefined);
    });


    it("clipboardModule", () => {
        gridObj.clipboardModule = null;
        gridObj.dataBind();
        expect(gridObj.clipboardModule).toBe(null);
        gridObj.clipboardModule = undefined;
        gridObj.dataBind();
        expect(gridObj.clipboardModule).toBe(undefined);
    });
    it("columnMenuModule", () => {
        gridObj.columnMenuModule = null;
        gridObj.dataBind();
        expect(gridObj.columnMenuModule).toBe(null);
        gridObj.columnMenuModule = undefined;
        gridObj.dataBind();
        expect(gridObj.columnMenuModule).toBe(undefined);
    });
    it("contextMenuModule", () => {
        gridObj.contextMenuModule = null;
        gridObj.dataBind();
        expect(gridObj.contextMenuModule).toBe(null);
        gridObj.contextMenuModule = undefined;
        gridObj.dataBind();
        expect(gridObj.contextMenuModule).toBe(undefined);
    });
    it("editModule", () => {
        gridObj.editModule = null;
        gridObj.dataBind();
        expect(gridObj.editModule).toBe(null);
        gridObj.editModule = undefined;
        gridObj.dataBind();
        expect(gridObj.editModule).toBe(undefined);
    });
    it("excelExportModule", () => {
        gridObj.excelExportModule = null;
        gridObj.dataBind();
        expect(gridObj.excelExportModule).toBe(null);
        gridObj.excelExportModule = undefined;
        gridObj.dataBind();
        expect(gridObj.excelExportModule).toBe(undefined);
    });
    it("filterModule", () => {
        gridObj.filterModule = null;
        gridObj.dataBind();
        expect(gridObj.filterModule).toBe(null);
        gridObj.filterModule = undefined;
        gridObj.dataBind();
        expect(gridObj.filterModule).toBe(undefined);
    });
    it("keyboardModule", () => {
        gridObj.keyboardModule = null;
        gridObj.dataBind();
        expect(gridObj.keyboardModule).toBe(null);
        gridObj.keyboardModule = undefined;
        gridObj.dataBind();
        expect(gridObj.keyboardModule).toBe(undefined);
    });
    it("pagerModule", () => {
        gridObj.pagerModule = null;
        gridObj.dataBind();
        expect(gridObj.pagerModule).toBe(null);
        gridObj.pagerModule = undefined;
        gridObj.dataBind();
        expect(gridObj.pagerModule).toBe(undefined);
    });
    it("pdfExportModule", () => {
        gridObj.pdfExportModule = null;
        gridObj.dataBind();
        expect(gridObj.pdfExportModule).toBe(null);
        gridObj.pdfExportModule = undefined;
        gridObj.dataBind();
        expect(gridObj.pdfExportModule).toBe(undefined);
    });
    it("printModule", () => {
        gridObj.printModule = null;
        gridObj.dataBind();
        expect(gridObj.printModule).toBe(null);
        gridObj.printModule = undefined;
        gridObj.dataBind();
        expect(gridObj.printModule).toBe(undefined);
    });
    it("reorderModule", () => {
        gridObj.reorderModule = null;
        gridObj.dataBind();
        expect(gridObj.reorderModule).toBe(null);
        gridObj.reorderModule = undefined;
        gridObj.dataBind();
        expect(gridObj.reorderModule).toBe(undefined);
    });
    it("rowDragAndDropModule", () => {
        gridObj.rowDragAndDropModule = null;
        gridObj.dataBind();
        expect(gridObj.rowDragAndDropModule).toBe(null);
        gridObj.rowDragAndDropModule = undefined;
        gridObj.dataBind();
        expect(gridObj.rowDragAndDropModule).toBe(undefined);
    });
    it("selectionModule", () => {
        gridObj.selectionModule = null;
        gridObj.dataBind();
        expect(gridObj.selectionModule).toBe(null);
        gridObj.selectionModule = undefined;
        gridObj.dataBind();
        expect(gridObj.selectionModule).toBe(undefined);
    });
    it("sortModule", () => {
        gridObj.sortModule = null;
        gridObj.dataBind();
        expect(gridObj.sortModule).toBe(null);
        gridObj.sortModule = undefined;
        gridObj.dataBind();
        expect(gridObj.sortModule).toBe(undefined);
    });
    it("toolbarModule", () => {
        gridObj.toolbarModule = null;
        gridObj.dataBind();
        expect(gridObj.toolbarModule).toBe(null);
        gridObj.toolbarModule = undefined;
        gridObj.dataBind();
        expect(gridObj.toolbarModule).toBe(undefined);
    });
    it("editSettings", () => {
        // Test with null value
        gridObj.editSettings.allowAdding = null;
        gridObj.editSettings.allowDeleting = null;
        gridObj.editSettings.allowEditOnDblClick = null;
        gridObj.editSettings.allowEditing = null;
        gridObj.editSettings.allowNextRowEdit = null;
        gridObj.editSettings.dialog = null;
        gridObj.editSettings.mode = null;
        gridObj.dataBind();
        expect(gridObj.editSettings.allowAdding).toBe(null);
        expect(gridObj.editSettings.allowDeleting).toBe(null);
        expect(gridObj.editSettings.allowEditOnDblClick).toBe(null);
        expect(gridObj.editSettings.allowEditing).toBe(null);
        expect(gridObj.editSettings.allowNextRowEdit).toBe(null);
        expect(gridObj.editSettings.dialog).toBe(null);
        expect(gridObj.editSettings.mode).toBe(null);

        // Test with undefined value
        gridObj.editSettings.allowAdding = undefined;
        gridObj.editSettings.allowDeleting = undefined;
        gridObj.editSettings.allowEditOnDblClick= undefined;
        gridObj.editSettings.allowEditing = undefined;
        gridObj.editSettings.allowNextRowEdit = undefined;
        gridObj.editSettings.dialog = undefined;
        gridObj.editSettings.mode = undefined;
        gridObj.dataBind();
        expect(gridObj.editSettings.allowAdding).toBe(undefined);
        expect(gridObj.editSettings.allowDeleting).toBe(undefined);
        expect(gridObj.editSettings.allowEditOnDblClick).toBe(undefined);
        expect(gridObj.editSettings.allowEditing).toBe(undefined);
        expect(gridObj.editSettings.allowNextRowEdit).toBe(undefined);
        expect(gridObj.editSettings.dialog).toBe(undefined);
        expect(gridObj.editSettings.mode).toBe(undefined);
    });
    it("filterSettings", () => {
        // Test with null value
        gridObj.filterSettings.columns = null;
        gridObj.filterSettings.ignoreAccent = null;
        gridObj.filterSettings.immediateModeDelay = null;
        gridObj.filterSettings.mode = null;
        gridObj.filterSettings.operators = null;
        gridObj.filterSettings.showFilterBarStatus = null;
        gridObj.filterSettings.type = null;
        gridObj.dataBind();
        expect(gridObj.filterSettings.columns.length).toBe(0);
        expect(gridObj.filterSettings.ignoreAccent).toBe(null);
        expect(gridObj.filterSettings.immediateModeDelay).toBe(null);
        expect(gridObj.filterSettings.mode).toBe(null);
        expect(gridObj.filterSettings.operators).toBe(null);
        expect(gridObj.filterSettings.showFilterBarStatus).toBe(null);
        expect(gridObj.filterSettings.type).toBe(null);

        // Test with undefined value
        gridObj.filterSettings.columns = undefined;
        gridObj.filterSettings.ignoreAccent = undefined;
        gridObj.filterSettings.immediateModeDelay = undefined;
        gridObj.filterSettings.mode = undefined;
        gridObj.filterSettings.operators = undefined;
        gridObj.filterSettings.showFilterBarStatus = undefined;
        gridObj.filterSettings.type = undefined;
        gridObj.dataBind();
        expect(gridObj.filterSettings.columns.length).toBe(0);
        expect(gridObj.filterSettings.ignoreAccent).toBe(undefined);
        expect(gridObj.filterSettings.immediateModeDelay).toBe(undefined);
        expect(gridObj.filterSettings.mode).toBe(undefined);
        expect(gridObj.filterSettings.operators).toBe(undefined);
        expect(gridObj.filterSettings.showFilterBarStatus).toBe(undefined);
        expect(gridObj.filterSettings.type).toBe(undefined);
    });
    it("infiniteScrollSettings", () => {
        // Test with null value
        gridObj.infiniteScrollSettings.enableCache = null;
        gridObj.infiniteScrollSettings.initialBlocks = null;
        gridObj.infiniteScrollSettings.maxBlocks = null;
        gridObj.dataBind();
        expect(gridObj.infiniteScrollSettings.enableCache).toBe(null);
        expect(gridObj.infiniteScrollSettings.initialBlocks).toBe(null);
        expect(gridObj.infiniteScrollSettings.maxBlocks).toBe(null);

        // Test with undefined value
        gridObj.infiniteScrollSettings.enableCache = undefined;
        gridObj.infiniteScrollSettings.initialBlocks = undefined;
        gridObj.infiniteScrollSettings.maxBlocks = undefined;
        gridObj.dataBind();
        expect(gridObj.infiniteScrollSettings.enableCache).toBe(undefined);
        expect(gridObj.infiniteScrollSettings.initialBlocks).toBe(undefined);
        expect(gridObj.infiniteScrollSettings.maxBlocks).toBe(undefined);
    });
    

    it("selectionSettings", () => {
        // Test with null value
        gridObj.selectionSettings.cellSelectionMode = null;
        gridObj.selectionSettings.checkboxMode = null;
        gridObj.selectionSettings.checkboxOnly = null;
        gridObj.selectionSettings.enableToggle = null;
        gridObj.selectionSettings.mode = null;
        gridObj.selectionSettings.persistSelection = null;
        gridObj.selectionSettings.mode = null;
        gridObj.selectionSettings.type = null;
        gridObj.dataBind();
        expect(gridObj.selectionSettings.cellSelectionMode).toBe(null);
        expect(gridObj.selectionSettings.checkboxMode).toBe(null);
        expect(gridObj.selectionSettings.checkboxOnly).toBe(null);
        expect(gridObj.selectionSettings.enableToggle).toBe(null);
        expect(gridObj.selectionSettings.mode).toBe(null);
        expect(gridObj.selectionSettings.type).toBe(null);
        expect(gridObj.selectionSettings.mode).toBe(null);
        expect(gridObj.selectionSettings.persistSelection).toBe(null);

        // Test with undefined value
        gridObj.selectionSettings.cellSelectionMode = undefined;
        gridObj.selectionSettings.checkboxMode = undefined;
        gridObj.selectionSettings.checkboxOnly = undefined;
        gridObj.selectionSettings.enableToggle = undefined;
        gridObj.selectionSettings.mode = undefined;
        gridObj.selectionSettings.persistSelection = undefined;
        gridObj.selectionSettings.mode = undefined;
        gridObj.selectionSettings.type = undefined;
        gridObj.dataBind();
        expect(gridObj.selectionSettings.cellSelectionMode).toBe(undefined);
        expect(gridObj.selectionSettings.checkboxMode).toBe(undefined);
        expect(gridObj.selectionSettings.checkboxOnly).toBe(undefined);
        expect(gridObj.selectionSettings.enableToggle).toBe(undefined);
        expect(gridObj.selectionSettings.mode).toBe(undefined);
        expect(gridObj.selectionSettings.type).toBe(undefined);
        expect(gridObj.selectionSettings.mode).toBe(undefined);
        expect(gridObj.selectionSettings.persistSelection).toBe(undefined);
    });

    it("rowDropSettings", () => {
        // Test with null value
        gridObj.rowDropSettings.targetID= null;
        gridObj.dataBind();
        expect(gridObj.rowDropSettings.targetID).toBe(null);

        // Test with undefined value
        gridObj.rowDropSettings.targetID= undefined;
        gridObj.dataBind();
        expect(gridObj.rowDropSettings.targetID).toBe(undefined);
    });

    
    it("sortSettings", () => {
        // Test with null value
        gridObj.sortSettings.allowUnsort = null;
        gridObj.sortSettings.columns = null;
        gridObj.dataBind();
        expect(gridObj.sortSettings.allowUnsort).toBe(null);
        expect(gridObj.sortSettings.columns.length).toBe(0);

        // Test with undefined value
        gridObj.sortSettings.allowUnsort = undefined;
        gridObj.sortSettings.columns = undefined;
        gridObj.dataBind();
        expect(gridObj.sortSettings.allowUnsort).toBe(undefined);
        expect(gridObj.sortSettings.columns.length).toBe(0);
    });

    // Test cases for each public property
    // it("textWrapSettings", () => {
    //     // Test with null value
    //     gridObj.textWrapSettings.wrapMode= null;
    //     gridObj.dataBind();
    //     expect(gridObj.textWrapSettings.wrapMode).toBe(null);

    //     // Test with undefined value
    //     gridObj.textWrapSettings.wrapMode= undefined;
    //     gridObj.dataBind();
    //     expect(gridObj.textWrapSettings.wrapMode).toBe(undefined);
    // });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Logger module with row drag and drop', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowRowDragAndDrop: true,
                childMapping: 'subtasks',
                height: '400',
                allowSelection: true,
                selectionSettings: { type: 'Multiple' },
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: false },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'startDate', headerText: 'Start Date' },
                    { field: 'duration', headerText: 'duration' }
                ]
            },
            done
        );
    });
    it('Logger module with row drag and drop', () => {
        expect(gridObj.getPrimaryKeyFieldNames().length === 0).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('ActionFailure with sorting', () => {
    let gridObj: TreeGrid;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                allowSorting: true,
                childMapping: 'subtasks',
                height: '400',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    mode: 'Cell',
                    newRowPosition: 'Below'
    
                },
                toolbar: ['Add', 'Delete', 'Update', 'Cancel', 'Indent', 'Outdent'],
                allowSelection: true,
                selectionSettings: { type: 'Multiple' },
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: false },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'startDate', headerText: 'Start Date' },
                    { field: 'duration', headerText: 'duration' }
                ],
                actionFailure: actionFailedFunction
            },
            done
        );
    });
    it('actionFailure testing', () => {
        expect(actionFailedFunction).toHaveBeenCalled();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});


describe('Print action', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource:sampleData,
                allowSorting: true,
                childMapping: 'subtasks',
                height: 400,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    mode: 'Cell',
                    newRowPosition: 'Below'
                },
                allowPaging: true,
                treeColumnIndex:1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: false },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'startDate', headerText: 'Start Date' },
                    { field: 'duration', headerText: 'duration' }
                ]
            },
            done
    );
    });
    it('Print action', (done: Function) => {
        let printComplete = (args?: { element: Element }): void => {
            expect(args.element.querySelectorAll('.e-gridpager').length).toBe(0);
            done();
        };
        window.print = () => { };
        (<any>Window).print = () => { };
        gridObj.printComplete = printComplete;
        gridObj.print();
    });
    afterAll(() => {
        gridObj.printModule.destroy();
        destroy(gridObj);
    });
});

describe('Enable virtualization action without virtual scroll module', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                enableVirtualization: true,
                height: 200,
                columns: [
                    { field: "taskID", headerText: "Task Id", width: 90 },
                    { field: 'taskName', headerText: 'taskName', width: 60 },
                    { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
                ],
            },
            done
        );
    });

    it('check module present', () => {
        expect(gridObj['virtualScrollModule'] === undefined);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checkbox column', () => {
    let gridObj: TreeGrid;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                autoCheckHierarchy: true,
                height: 400,
                columns: [
                    { field: "taskID", headerText: "Task Id", width: 90, showCheckbox: true },
                    { field: 'taskName', headerText: 'taskName', width: 60, showCheckbox: true },
                    { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
                ],
                actionFailure: actionFailedFunction
            },
            done
        );
    });

    it('actionFailure testing', () => {
        expect(actionFailedFunction).toHaveBeenCalled();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Remote data', () => {
    let gridObj: TreeGrid;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                height: 400,
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
                actionFailure: actionFailedFunction
            },
            done
        );
    });
    it('actionFailure testing', () => {
        expect(actionFailedFunction).toHaveBeenCalled();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Remote data with TotalRecords count', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                height: 400,
                allowPaging: true,
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
                query: new Query().addParams('treegrid','true')
            },
            done
        );
    });
    it('Expand Parent Row', function (done) {
        gridObj.dataModule.isRemote();
        rows = gridObj.getRows();
        gridObj.dataBound = () => {
            done();
        }
        gridObj.expandRow(rows[0]);
    });
    it('Check totalRecordsCount and then Collapse', function (done) {
        const childrenCount = 10;
        expect(gridObj.grid.pageSettings.totalRecordsCount === 60 + childrenCount).toBe(true);
        rows = gridObj.getRows();
        gridObj.collapseRow(rows[0]);
        setTimeout(done, 500);
    });
    it('Check totalrecords count', () => {
        expect(gridObj.grid.pageSettings.totalRecordsCount === 60).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Checking template position in react', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right' },
                    {
                        headerText: 'Template', textAlign: 'Center',
                        template: '<button id="button">Button</button>', width: 90
                    }
                ],
                load: function(){
                    this.isReact = true
                }
            },
            done
        );
    });
    it('Checking template position when the template column is marked as treeColumnIndex ', () => {
        expect((gridObj.element.querySelector('.e-templatecell').querySelector('.e-treecell') as any).innerText == 'Button').toBe(true);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('column template', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                autoCheckHierarchy: true,
                height: 400,
                columns: [
                    { field: "taskID", headerText: "Task Id", width: 90, template:'Test1' },
                    { field: 'taskName', headerText: 'taskName', width: 60, template:'Test2'},
                    { field: 'duration', headerText: 'duration', textAlign: 'Right', width: 90 },
                    { field: 'progress', headerText: 'progress', textAlign: 'Right', width: 90 },
                ],
                load: function(){
                    this.isReact = true
                }
            },
            done
        );
    });

    it('column template in react platform', () => {
        expect(gridObj.getRows()[0].querySelectorAll('td')[1].classList.contains('e-templatecell')).toBe(true);
        expect(gridObj.getRows()[0].querySelectorAll('td')[0].classList.contains('e-templatecell')).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj.renderModule.destroy();
    });
});

describe('Bug 887848: Script Error shown in Column Template sample', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 1,
                allowPaging: true,
                columns: [
                    {
                        field: 'taskID', template: `
                <a href="https://www.w3schools.com">hello</a>`, headerText: 'Task ID', width: 70, textAlign: 'Right'
                    },
                    { field: 'taskName', headerText: 'Task Name', width: 200, textAlign: 'Left' },
                    { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
                    { field: 'endDate', headerText: 'End Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
                    { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                    { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' },
                    { field: 'priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });

    it('column template with downarrow', () => {
        const event: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(0, 0).dispatchEvent(event);
        gridObj.keyboardModule.keyAction({
            action: 'downArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1]
        } as any);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj.renderModule.destroy();
    });
});

describe('Bug 887848: Script Error shown in Column Template sample', () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 1,
                allowPaging: true,
                columns: [
                    {
                        field: 'taskID', template: `
                <a href="https://www.w3schools.com">hello</a>`, headerText: 'Task ID', width: 70, textAlign: 'Right'
                    },
                    { field: 'taskName', headerText: 'Task Name', width: 200, textAlign: 'Left' },
                    { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
                    { field: 'endDate', headerText: 'End Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
                    { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                    { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' },
                    { field: 'priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });

    it('column template with uparrow action', () => {
        const event: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        gridObj.getCellFromIndex(2, 0).dispatchEvent(event);
        gridObj.keyboardModule.keyAction({
            action: 'uparrow', preventDefault: preventDefault,
            target: gridObj.getRows()[2].getElementsByClassName('e-rowcell')[1]
        } as any);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj.renderModule.destroy();
    });
})

describe('code improvement', () => {
    let gridObj: TreeGrid;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [],
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 1,
                allowPaging: true,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 70, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 200, textAlign: 'Left' },
                    { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
                    { field: 'endDate', headerText: 'End Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
                    { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                    { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' },
                    { field: 'priority', headerText: 'Priority', width: 90 }
                ],
                actionFailure: actionFailedFunction
            },
            done
        );
    });

    it('actionFailure testing', () => {
        gridObj.collapseAll();
        expect(actionFailedFunction).toHaveBeenCalled();
    });

    it('actionFailure testing', () => {
        gridObj.expandAll();
        expect(actionFailedFunction).toHaveBeenCalled();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj.renderModule.destroy();
    });
});

describe('Remote data', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                allowPaging: true,
                height: 400,
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ]
            },
            done
        );
    });
    beforeEach((done: Function) => {
        gridObj.expandRow(gridObj.getRows()[0]);
        setTimeout(done, 500);
    });
    it('expand action with paging', (done: Function) => {
        //expect(gridObj.getRows()[0].querySelectorAll('.e-treegridexpand').length == 1).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

// describe('Remote data', () => {
//     let gridObj: TreeGrid;
//     let data: Object = new DataManager({
//         url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
//         adaptor: new WebApiAdaptor,
//         crossDomain: true
//     });
//     beforeAll((done: Function) => {
//         gridObj = createGrid(
//             {
//                 dataSource: data,
//                 hasChildMapping: 'isParent',
//                 idMapping: 'TaskID',
//                 parentIdMapping: 'ParentItem',
//                 enableVirtualization: true,
//                 height: 400,
//                 treeColumnIndex: 1,
//                 columns: [
//                     { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
//                     { field: 'TaskName', headerText: 'Task Name', width: 150 },
//                     { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
//                 ],
//             },
//             done
//         );
//     });
//     beforeEach((done: Function) => {
//         gridObj.expandRow(gridObj.getRows()[0]);
//         setTimeout(done, 500);
//     });
//     it('expand action with virtualization', (done: Function) => {
//         expect(gridObj.grid.currentViewData.length == 10).toBe(true);
//         done();
//     });
//     afterAll(() => {
//         destroy(gridObj);
//     });
// });

describe('Remote data', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                allowPaging: true,
                height: 400,
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ]
            },
            done
        );
    });
    beforeEach((done: Function) => {
        gridObj.expandRow(gridObj.getRows()[0]);
        gridObj.collapseRow(gridObj.getRows()[0]);
        setTimeout(done, 100);
    });
    it('expand action with paging', (done: Function) => {
        //expect(gridObj.grid.currentViewData.length == 12).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Remote data', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                height: 400,
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
            },
            done
        );
    });
    it('Current View Data length', (done: Function) => {
        expect(gridObj.grid.currentViewData.length == 60).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('code coverage improvement', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
                enableRtl: true
            },
            done
        );
    });
    it('enableCollapseAll testing', () => {
        gridObj.enableRtl = false;
        expect(gridObj.enableRtl).toBeFalsy();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});
describe('Remote data', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                enableVirtualization: true,
                allowSorting: true,
                height: 400,
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
            },
            done
        );
    });
    beforeEach((done: Function) => {
        gridObj.sortByColumn("TaskName", "Descending", true);
        setTimeout(done, 500);
    });
    it('expand action with virtualization', (done: Function) => {
        expect(gridObj.grid.sortModule['sortedColumns'].length== 1).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('check actionFailure', () => {
    let gridObj: TreeGrid;
    const actionFailedFunction: () => void = jasmine.createSpy('actionFailure');

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                allowSorting: true,
                treeColumnIndex: 0,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', width: 140 },
                    { field: 'TaskName', headerText: 'Task Name', width: 140 },
                    { field: 'StartDate', headerText: 'Start Date', width: 150, type: 'date', format: 'yMd' },
                    { field: 'EndDate', headerText: 'End Date', width: 150, type: 'date', format: 'yMd' },
                    { field: 'Progress', headerText: 'Progress', width: 150 }
                ],
                height: 315,
                actionFailure: actionFailedFunction
            },
            done
        );
    });

    it('should not call actionFailure if idMapping and parentIdMapping are present', () => {
        const hasIdMapping = 'idMapping' in gridObj;
        const hasParentIdMapping = 'parentIdMapping' in gridObj;
        if (hasIdMapping && hasParentIdMapping) {
            expect(actionFailedFunction).not.toHaveBeenCalled();
        }
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('HasChildRecords property value is not updated properly ', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    let SampelData2: Object[] = [
        {
            taskID: 1,
            taskName: 'Planning',
            startDate: new Date('02/03/2017'),
            endDate: new Date('02/07/2017'),
            progress: 100,
            duration: 5,
            priority: 'Normal',
            approved: false,
            subtasks: [
                { taskID: 2, taskName: 'Plan timeline', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Normal', approved: false, subtasks:[] },
                { taskID: 3, taskName: 'Plan budget', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, approved: true },
                { taskID: 4, taskName: 'Allocate resources', startDate: new Date('02/03/2017'), endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Critical', approved: false },
                { taskID: 5, taskName: 'Planning complete', startDate: new Date('02/07/2017'), endDate: new Date('02/07/2017'), duration: 0, progress: 0, priority: 'Low', approved: true }
            ]
        }];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: SampelData2,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
            },
            done
        );
    });
    it('check currentview data', () => {
        expect((gridObj.flatData[1] as ITreeData).hasChildRecords).toBe(false);
        expect((gridObj.getCurrentViewRecords()[1] as ITreeData).hasChildRecords).toBe(false);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 911555: script error throws while passing the collpaseRow method without parameter', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
            },
            done
        );
    });
    it('check rows attribute', () => {
        gridObj.collapseRow(null);
        rows = gridObj.getRows();
        expect(rows[0].hasAttribute('aria-expanded') === true).toBe(true);
        gridObj.expandRow(null);
        expect(rows[0].hasAttribute('aria-expanded') === true).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 905624: Freeze Direction was not working properly', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
            },
            done
        );
    });
    it('should update tree column index correctly when a non-tree column is set to freeze left', () => {
        const updatedColumns = (gridObj.columns as any).map((col: any, index: number) => {
            if (index === 2) {
                const updatedCol = { ...col, freeze: 'Left' }; 
                return updatedCol;
            }
            return col;
        });
        gridObj.columns = updatedColumns;
        gridObj.refreshColumns();
        expect(gridObj.treeColumnIndex===2).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Coverage', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: expandStateData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                height: '450px',
                treeColumnIndex: 1,
                expandStateMapping: 'isExpand',
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 140 },
                    { field: 'TaskName', headerText: 'Task Name', width: 160 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
                    { field: 'EndDate', headerText: 'End Date', textAlign: 'Right', width: 120, format: { skeleton: 'yMd', type: 'date' }},
                    { field: 'Duration', headerText: 'Duration', textAlign: 'Right', width: 110},
                    { field: 'Progress', headerText: 'Progress', textAlign: 'Right', width: 110},
                    { field: 'Priority', headerText: 'Priority', width: 110}
                ]
            },
            done
        );
    });

    it('expand testing', () => {
        rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        (rows[2].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 923526: Updating row Data (not in currentview) using setRowData()  and then expand the row updated row is missing', () => {
    let gridObj: TreeGrid;
    let data: Object[] = [
        {
            taskID: 1,
            taskName: 'Planning',
            startDate: new Date('02/03/2017'),
            endDate: new Date('02/07/2017'),
            progress: 100,
            duration: 5,
            priority: 'Normal',
            approved: false,
            expand: false,
            designation: 'Vice President',
            employeeID: 1,
            subtasks: [
                {
                    taskID: 2, taskName: 'Plan timeline', startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Normal', approved: false, designation: 'Chief Executive Officer',
                    employeeID: 2
                },
                {
                    taskID: 3, taskName: 'Plan budget', startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Low', approved: true, designation: 'Chief Executive Officer',
                    employeeID: 3
                },
                {
                    taskID: 4, taskName: 'Allocate resources', startDate: new Date('02/03/2017'),
                    endDate: new Date('02/07/2017'), duration: 5, progress: 100, priority: 'Critical', approved: false, designation: 'Chief Executive Officer',
                    employeeID: 4
                },
                {
                    taskID: 5, taskName: 'Planning complete', startDate: new Date('02/07/2017'),
                    endDate: new Date('02/07/2017'), duration: 0, progress: 0, priority: 'Low', approved: true, designation: 'Chief Executive Officer',
                    employeeID: 5
                }
            ]
        },
        {
            taskID: 6,
            taskName: 'Design',
            startDate: new Date('02/10/2017'),
            endDate: new Date('02/14/2017'),
            duration: 3,
            progress: 86,
            priority: 'High',
            approved: false,
            designation: 'Vice President',
            employeeID: 6,
            subtasks: [
                {
                    taskID: 7, taskName: 'Software Specification', startDate: new Date('02/10/2017'),
                    endDate: new Date('02/12/2017'), duration: 3, progress: 60, priority: 'Normal', approved: false, designation: 'Sales Representative',
                    employeeID: 7
                },
                {
                    taskID: 8, taskName: 'Develop prototype', startDate: new Date('02/10/2017'),
                    endDate: new Date('02/12/2017'), duration: 3, progress: 100, priority: 'Critical', approved: false, designation: 'Sales Representative',
                    employeeID: 8
                },
                {
                    taskID: 9, taskName: 'Get approval from customer', startDate: new Date('02/13/2017'),
                    endDate: new Date('02/14/2017'), duration: 2, progress: 100, priority: 'Low', approved: true, designation: 'Sales Representative',
                    employeeID: 9
                },
                {
                    taskID: 10, taskName: 'Design Documentation', startDate: new Date('02/13/2017'),
                    endDate: new Date('02/14/2017'), duration: 2, progress: 100, priority: 'High', approved: true, designation: 'Sales Representative',
                    employeeID: 10
                },
                {
                    taskID: 11, taskName: 'Design complete', startDate: new Date('02/14/2017'),
                    endDate: new Date('02/14/2017'), duration: 0, progress: 0, priority: 'Normal', approved: true, designation: 'Sales Representative',
                    employeeID: 11
                }
            ]
        }
    ];
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                childMapping: 'subtasks',
                height: 350,
                treeColumnIndex: 1,
                expandStateMapping: 'expand',
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 70, textAlign: 'Right' },
                    {
                        field: 'taskName',
                        headerText: 'Task Name',
                        width: 200,
                        textAlign: 'Left',
                    }
                ]
            },
            done
        );
    });

    it('expand testing', () => {
        let value: any = { taskID: 2, taskName: 'game' }
        gridObj.setRowData(2, value);
        (gridObj.getRows()[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        expect(gridObj.getRows()[1].classList.contains('e-hide')).toBe(false);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 905621: RowSelecting event handling during expand/collapse actions', () => {
    let gridObj: TreeGrid;
    let rowSelectingTriggered: boolean = false;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: "subtasks",
                allowPaging: true,
                treeColumnIndex: 0,
                height: 300,
                columns: ['taskName', 'priority'],
                rowSelecting: () => {
                    rowSelectingTriggered = true;
                }
            },
            done
        );
    });
    it('should not trigger rowSelecting when expanding a row', () => {
        (gridObj.getRows()[0].querySelector('.e-treegridexpand') as HTMLElement).click();
        expect(rowSelectingTriggered).toBe(false);
    });
    it('should not trigger rowSelecting when collapsing a row', () => {
        (gridObj.getRows()[0].querySelector('.e-treegridcollapse') as HTMLElement).click();
        expect(rowSelectingTriggered).toBe(false);
    });
    it('should trigger rowSelecting on normal row click', () => {
        rowSelectingTriggered = false;
        gridObj.selectRow(0);
        expect(rowSelectingTriggered).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 926999: Warning throws on using freeze feature in treegrid.', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,                
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, textAlign: 'Right', width: 90 },
                    { field: 'taskName', headerText: 'Task Name', editType: 'stringedit', width: 220 },
                    { field: 'startDate', headerText: 'Start Date', textAlign: 'Right', width: 130, format: 'yMd' },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 100 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 80 },
                    { field: 'priority', headerText: 'Priority', width: 90 ,freeze: 'Left'}
                ]
            },
            done
        );
    });
    it('checking if Freeze module present', () => {
        const injectedModules = (gridObj as any).injectedModules;
        const freezePresent = injectedModules.some((module: Function) => {
            return module.name === 'Freeze';
        });
        expect(freezePresent).toBe(true);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('TreeGrid - Expand and Collapse Row with expandCollapseAllChildren coverage', () => {
    let gridObj: TreeGrid;

    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            height: 400,
            columns: [
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 60, textAlign: 'Right' },
                { field: 'taskName', headerText: 'Task Name', width: 150, textAlign: 'Left' },
                { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' }
            ]
        }, done);
    });

    it('should collapse all rows when isCollapseAll is true', (done: Function) => {
        (gridObj as any).isCollapseAll = true;

        gridObj.collapsing = (args: any) => {
            args.collapseAll = true;
        };

        const parentRow = gridObj.getRows()[11];
        const parentRecord = gridObj.getCurrentViewRecords()[11];
        gridObj.collapseRow(parentRow, parentRecord);

        const row = gridObj.getRows()[12];
        expect(gridObj.getRows()[12].getAttribute('aria-expanded')).toBe('false');
        done();
    });

    it('should expand all rows when isExpandAll is true', (done: Function) => {
        (gridObj as any).isExpandAll = true;

        gridObj.expanding = (args: any) => {
            args.expandAll = true;
        };

        const parentRow = gridObj.getRows()[11];
        const parentRecord = gridObj.getCurrentViewRecords()[11];
        gridObj.expandRow(parentRow, parentRecord);

        const row = gridObj.getRows()[12];
        expect(gridObj.getRows()[12].getAttribute('aria-expanded')).toBe('true');
        done();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('TreeGrid - coverage', () => {
    let gridObj: TreeGrid;

    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: sampleData,
            height: 317,
            childMapping: 'subtasks',
            allowSelection: false,
            treeColumnIndex: 1,
            columns: [
                { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true, width: 60, textAlign: 'Right', freeze: 'Left' },
                { field: 'taskName', headerText: 'Task Name', width: 150, textAlign: 'Left' },
                { field: 'startDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd', freeze: 'Right' }
            ]
        }, done);
    });

    it('get visible movable count', (done: Function) => {
        expect(gridObj.getVisibleMovableCount()).toBe(1);
        setTimeout(done, 500);
    });

    it('get visible frozen right count', (done: Function) => {
        expect(gridObj.getVisibleFrozenRightCount()).toBe(1);
        setTimeout(done, 500);
    });

    it('get visible frozen left count', (done: Function) => {
        expect(gridObj.getVisibleFrozenLeftCount()).toBe(1);
        setTimeout(done, 500);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 908257: Last row border line is not visible', () => {
    let gridObj: TreeGrid;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                frozenColumns: 2,
                allowSorting: true,
                height: 400,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 260 },
                    { field: 'startDate', headerText: 'Start Date', width: 230, textAlign: 'Right', type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                    { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right', type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                    { field: 'duration', headerText: 'Duration', textAlign: 'Right', width: 210 },
                    { field: 'progress', headerText: 'Progress', textAlign: 'Right', width: 210 },
                    { field: 'priority', headerText: 'Priority', textAlign: 'Left', width: 230 },
                    { field: 'approved', headerText: 'Approved', width: 230, textAlign: 'Left' }
                ]
            },
            done
        );
    });
    
    it('checking if last row border is visible after sorting', () => {
        gridObj.collapseAll();
        gridObj.sortByColumn('taskName', 'Descending', false);
        
	const rows: NodeListOf<HTMLTableRowElement> = gridObj.getContentTable().querySelectorAll('tr.e-row');
        const visibleRows: HTMLTableRowElement[] = Array.from(rows).filter((row: HTMLTableRowElement): boolean => !row.classList.contains('e-childrow-hidden'));
        const lastVisibleRow: HTMLTableRowElement = visibleRows[visibleRows.length - 1];
        
	expect(lastVisibleRow.cells[0].classList.contains('e-lastrowcell')).toBe(true);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('938693: Cell Focus Lost After Collapse All and First Record Selection', () => {
    let gridObj: TreeGrid;
    let rows: any;
    var preventDefault = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowPaging: true,
            height: 400,
            columns: [
                { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100 },
                { field: 'taskName', headerText: 'Task Name', width: 260 }
            ]
        }, done);
    });

    it('should retain focus when clicking a cell, collaspeAll, then click same cell again', (done: Function) => {
        gridObj.getRows()[0].cells[1].click();
        gridObj.keyboardModule.keyAction({
            action: 'ctrlShiftUpArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1]
        });
        gridObj.getRows()[0].cells[1].click();
        expect((gridObj as any).element.querySelectorAll('.e-row')[0].cells[1].classList.contains('e-focused')).toBe(true);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('953594: Console error thrown in Playwright Treegrid Sample', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
        gridObj = createGrid({
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            allowPaging: true,
            editSettings: {
                allowEditing: true,
                allowAdding: true,
                allowDeleting: true,
                mode: 'Row',
                newRowPosition: 'Top'
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            height: 400,
            columns: [
                { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100, isPrimaryKey: true },
                { field: 'taskName', headerText: 'Task Name', width: 260 }
            ]
        }, done);
    });

    it('should not throw null or undefined console error', (done: Function) => {
        actionComplete = (args?: Object): void => {
            if (args['requestType'] === 'batchsave' ) {
                expect(gridObj.dataSource[1].subtasks.length === 5).toBe(true);
            }
            done();
        };
        const addedRecords = 'addedRecords';
        gridObj.grid.actionComplete = actionComplete;
        (gridObj as any).setProperties({ editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', newRowPosition: 'Below' }, enableCollapseAll: false});
        gridObj.selectRow(5);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_delete' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 41;
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_add' } });
        (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 42;
        expect(gridObj.getBatchChanges()[addedRecords].length === 2).toBe(true);
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
        select('#' + gridObj.element.id + '_gridcontrol' + 'EditConfirm', gridObj.element).querySelectorAll('button')[0].click();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('coverage', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                frozenColumns: 2,
                height: 400,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100 },
                    { field: 'taskName', headerText: 'Task Name', width: 260 },
                    { field: 'startDate', headerText: 'Start Date', width: 230, textAlign: 'Right', type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                    { field: 'endDate', headerText: 'End Date', width: 230, textAlign: 'Right', type: 'date', format: { type: 'dateTime', format: 'dd/MM/yyyy' } },
                ]
            },
            done
        );
    });

    it('checking if last row border is visible after sorting', () => {
        const columns = gridObj.columns;
        gridObj['frozenLeftBorderColumns'](columns as any);
        gridObj['frozenRightBorderColumns'](columns as any);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Last row border after changing row height', () => {
    let gridObj: TreeGrid;
    let actionComplete: () => void;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
                allowPaging: true,

                childMapping: 'subtasks',
               allowSorting:true,
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name' },
                    { field: 'progress', headerText: 'Progress' }
                ]
        },done);
    });

    it('last row border should exists', (done: Function) => {
         gridObj.dataBound = (args: Object) => {
            expect(gridObj.getRows()[2].getElementsByClassName('e-rowcell').length === 3).toBe(true);
            done();
        };
        gridObj.rowHeight = 40;
        gridObj.dataBind();

    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
describe('Prevent multiple event triggers for the same action', () => {
  let gridObj: TreeGrid;
  let eventCounter: number = 0;
  
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        enableCollapseAll:true,
        columns: [
          { field: 'taskID', headerText: 'Task ID', width: 90 },
          { field: 'taskName', headerText: 'Task Name', width: 150 },
          { field: 'startDate', headerText: 'Start Date', width: 120 },
          { field: 'duration', headerText: 'Duration', width: 90 }
        ]
      },
      done
    );
  });

  it('should trigger expand event only once when expanding a row', (done: Function) => {
   
    eventCounter = 0;
    
    let expandHandler = (args?: any): void => {
      eventCounter=1;
    };
    
     gridObj.expanded = expandHandler;
    
   
    gridObj.expandRow(gridObj.getRows()[0]);
    
   
    
        expect(eventCounter).toBe(1);
        done();
     
  });

  it('should trigger collapse event only once when collapsing a row', (done: Function) => {
    
    eventCounter = 0;
    
   
    let collapseHandler = (args?: any): void => {
      eventCounter=1;
    };
    
    gridObj.collapsed = collapseHandler;
    
    gridObj.collapseRow(gridObj.getRows()[0]);
    expect(eventCounter).toBe(1);
    done();
    
    
  });

  it('should trigger selection event only once when selecting a row', (done: Function) => {
    eventCounter = 0;
    
    let rowSelectHandler = (args?: any): void => {
      eventCounter=1;
    };
    
    gridObj.rowSelected = rowSelectHandler;
    
    gridObj.selectRow(1);
    
   
        expect(eventCounter).toBe(1);
        done();
     
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Prevent multiple event triggers', () => {
  let gridObj: TreeGrid;
  let eventCounter: number = 0;
  
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        enableCollapseAll:true,
        columns: [
          { field: 'taskID', headerText: 'Task ID', width: 90 },
          { field: 'taskName', headerText: 'Task Name', width: 150 },
          { field: 'startDate', headerText: 'Start Date', width: 120 },
          { field: 'duration', headerText: 'Duration', width: 90 }
        ]
      },
      done
    );
  });

  it('should trigger expand event only once when expanding a row', (done: Function) => {
   
    eventCounter = 0;
    
    let expandHandler = (args?: any): void => {
      eventCounter=1;
    };
    
     gridObj.expanded = expandHandler;
    
   
    gridObj.expandAll();
    
   
    
        expect(eventCounter).toBe(1);
        done();
     
  });

  it('should trigger collapse event only once when collapsing a row', (done: Function) => {
    
    eventCounter = 0;
    
   
    let collapseHandler = (args?: any): void => {
      eventCounter=1;
    };
    
    gridObj.collapsed = collapseHandler;
    
    gridObj.collapseAll();
    expect(eventCounter).toBe(1);
    done();
    
    
  });


  afterAll(() => {
    destroy(gridObj);
  });
});

describe('Expand/collapse methods or properties - self reference data', () => {
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate'],
                enableCollapseAll: true,
                height: 400
            },
            done
        );
    });
          
    it('enableCollapseAll testing', () => {
        expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(0);
        gridObj.enableCollapseAll = false;
        gridObj.dataBind();
        expect(gridObj.element.querySelectorAll('.e-treegridexpand').length).toBe(2);
        gridObj.enableCollapseAll = true;
        gridObj.dataBind();
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(2);
        gridObj.enableCollapseAll = false;
    });
    it('expandstatemapping testing', (done: Function) => {
        gridObj.actionComplete = (args: Object) => {
            expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
            done();
        };
        gridObj.expandStateMapping = 'isInExpandState';
        gridObj.dataBind();
    });
    it('collapseAtLevel testing', () => {
        gridObj.collapseAtLevel(1);
        expect(gridObj.getRows()[1].querySelectorAll('.e-treegridcollapse').length).toBe(0);
        gridObj.expandAtLevel(1);
        expect(gridObj.getRows()[2].querySelectorAll('.e-treegridexpand').length).toBe(1);
        expect(gridObj.getDataModule()).toBeDefined();
    });
    it('expandrow event testing', () => {
        rows = <HTMLTableRowElement[]>gridObj.getRows();
        gridObj.expandAll();
        gridObj.collapseRow(rows[1]);
        gridObj.collapsing = (args: RowCollapsingEventArgs) => {
            args.cancel = true;
        };
        gridObj.collapseRow(rows[0]);
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(0);
        gridObj.collapsing = undefined;
        gridObj.collapseRow(rows[0]);
        gridObj.expanding = (args: RowExpandingEventArgs) => {
            args.cancel = true;
        };
        gridObj.expandRow(rows[0]);
        expect(gridObj.element.querySelectorAll('.e-treegridcollapse').length).toBe(1);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('keyBoard Interaction for collapse particular parent row - self reference data' , () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    const preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                columns: ['TaskID', 'TaskName', 'StartDate', 'EndDate'],
                selectionSettings: { mode: 'Cell' },
                
            },
            done
        );
    });
    it('keyBoard Interaction - self reference data', () => {
        gridObj.selectCell({ cellIndex: 1, rowIndex: 0 }, true);
        gridObj.keyboardModule.keyAction({ action: 'ctrlShiftUpArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        rows = gridObj.getRows();
        expect(rows[1].classList.contains('e-childrow-hidden')).toBe(true);
        gridObj.keyboardModule.keyAction({ action: 'ctrlShiftDownArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        expect(rows[1].classList.contains('e-childrow-visible')).toBe(true);
        gridObj.keyboardModule.keyAction({ action: 'ctrlUpArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        expect(gridObj.getRows()[1].classList.contains('e-childrow-hidden')).toBe(true);
        gridObj.keyboardModule.keyAction({ action: 'ctrlDownArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        expect(gridObj.getRows()[1].classList.contains('e-childrow-visible')).toBe(true);
        gridObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1] } as any);
        expect(gridObj.getRows()[1].querySelectorAll('.e-focused').length).toBe(1);
        gridObj.keyboardModule.keyAction({ action: 'upArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1] } as any);
        expect(gridObj.getRows()[0].querySelectorAll('.e-focused').length).toBe(1);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('keyBoard Interaction for expand/collapse child row - self reference data' , () => {
    let gridObj: TreeGrid;
    const preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                 dataSource: projectData,
                idMapping: 'TaskID',
                parentIdMapping: 'parentID',
                treeColumnIndex: 1,
                allowPaging: true,
                pageSettings: { pageSize: 10 },
                allowSelection: true,
                columns: [
                    { field: 'TskID', headerText: 'Task ID', isPrimaryKey: true, width: 70, textAlign: 'Right' },
                    { field: 'TaskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                    { field: 'StartDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
                    { field: 'Duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                    { field: 'Progress', headerText: 'Progress', width: 80, textAlign: 'Right' },
                    { field: 'Priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });
    it('keyBoard Interaction - self reference data', () => {
        gridObj.selectRow(1);
        gridObj.keyboardModule.keyAction({
            action: 'ctrlShiftUpArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1]
        } as any);
        expect(gridObj.getRows()[0].getElementsByClassName('e-treecolumn-container')[0].children[0].classList.contains('e-treegridexpand')).toBe(true);
        gridObj.keyboardModule.keyAction({
            action: 'ctrlShiftDownArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[1].getElementsByClassName('e-rowcell')[1]
        } as any);
        expect(gridObj.getRows()[0].getElementsByClassName('e-treecolumn-container')[0].children[0].classList.contains('e-treegridexpand')).toBe(true);
    });
     it('should retain focus when clicking a cell, collaspeAll, then click same cell again', (done: Function) => {
        gridObj.getRows()[0].cells[1].click();
        gridObj.keyboardModule.keyAction({
            action: 'ctrlShiftUpArrow', preventDefault: preventDefault,
            target: gridObj.getRows()[0].getElementsByClassName('e-rowcell')[1]
        });
        gridObj.getRows()[0].cells[1].click();
        expect((gridObj as any).element.querySelectorAll('.e-row')[0].cells[1].classList.contains('e-focused')).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 960729: Assigning improper tree column index throws exception', () => {
    let gridObj: TreeGrid;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                height: '400',
                treeColumnIndex: 1,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', isPrimaryKey: false },
                ],
                actionFailure: actionFailedFunction
            },
            done
        );
    });
    it('actionFailure testing', () => {
        expect(actionFailedFunction).toHaveBeenCalled();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Task 969587: Testing TreeGrid Empty Record Template', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        // Create a template element in the DOM for testing
        const template = document.createElement('script');
        template.id = 'emptytemplate';
        template.type = 'text/x-template';
        template.innerHTML = "<div class='emptyRecordTemplate'>There is no data available to display at the moment in the TreeGrid.</div>";
        document.body.appendChild(template);

        gridObj = createGrid(
            {
                dataSource: [],
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                emptyRecordTemplate: '#emptytemplate',
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 110 },
                    { field: 'taskName', headerText: 'Task Name', width: 150 }
                ]
            },
            done
        );
    });

    it('should render the empty record template when dataSource is empty', () => {
        const emptyRow = gridObj.getContentTable().querySelector('.e-emptyrow');
        expect(emptyRow).not.toBeNull();
        expect(emptyRow.querySelector('.emptyRecordTemplate')).not.toBeNull();
        expect(emptyRow.querySelector('.emptyRecordTemplate').textContent).toContain('There is no data available to display at the moment in the TreeGrid.');
    });

    afterAll(() => {
        destroy(gridObj);
        const template = document.getElementById('emptytemplate');
        if (template) {
            template.parentNode.removeChild(template);
        }
    });
});

describe('Remote data- child positions are wrong after expanding record', () => {
    class HierarchyAdaptor extends WebApiAdaptor {
    processQuery(dm: any, query: any, hierarchyFilters: any) {
        const processedQuery = super.processQuery(dm, query, hierarchyFilters);
        const url = new URL((processedQuery as any).url);

        return { type: 'GET', url };
    }

    processResponse(data: any, ds: any, query: any, xhr: any, request: any, changes: any) {
        const showCount = query && query.isCountRequired;
        return showCount
            ? {
                count: data.count,
                result: data.result.map((item: any) => ({
                    ...item,
                    TaskID: item.ParentItem ? item.TaskID + 1000 : item.TaskID,
                })),
            }
            : data.result;
    }
}
    let gridObj: TreeGrid;
    let rows: HTMLTableRowElement[];
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new HierarchyAdaptor(),
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                height: 400,
                allowPaging: true,
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
              
            },
            done
        );
    });
    it('Expand Parent Row', function (done) {
        rows = gridObj.getRows();
        gridObj.dataBound = () => {
     
            done();
        }
        gridObj.expandRow(rows[0]);
    });
    it('Check Child record position', function () {
        var cells = gridObj.grid.getRows()[1].querySelectorAll('.e-rowcell');
            expect(cells[0].textContent === '1003').toBeTruthy();
    });
    
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Keyboard selection', () => {
  let gridObj: TreeGrid;
  const preventDefault: Function = new Function();
  let rowSelected:any;

  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: sampleData,
        childMapping: 'subtasks',
        treeColumnIndex: 1,
        height: 400,
        allowSelection: true,
        selectionSettings: { type: 'Single', mode: 'Row' },
        columns: [
          { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right' },
          { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
          { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
          { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' }
        ]
      },
      done
    );
  });

  it('Down arrow on last row should clear selection', () => {
    const rows = gridObj.getVisibleRecords();
    const lastIndex = rows.length - 1;

    gridObj.selectRow(lastIndex);
    expect(gridObj.getSelectedRowIndexes()).toEqual([lastIndex]);

    const lastRowCell = (gridObj.getRows()[lastIndex] as any).getElementsByClassName('e-rowcell')[0] as HTMLElement;
    gridObj.keyboardModule.keyAction({ action: 'downArrow', preventDefault, target: lastRowCell } as any);

    rowSelected=()=>{
            expect(gridObj.getSelectedRowIndexes().length).toBe(1);
            }
            gridObj.rowSelected=rowSelected;
 });

  
  afterAll(() => {
    destroy(gridObj);
  });
});

describe('User Story 970793: Need to provide row and Cell Spanning support with cross features', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: columnSpanData,
                treeColumnIndex: 1,
                childMapping: 'subtasks',
                height: 317,
                rowHeight: 40,
                enableRowSpan: true,
                enableColumnSpan: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                allowReordering: true,
                allowResizing: true,
                showColumnChooser: true,
                filterSettings: { type: 'Excel' },
                toolbar: ['Search', 'ColumnChooser'],
                gridLines: 'Both',
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', width: 150, textAlign: 'Right', isPrimaryKey: true, freeze: 'Left' },
                    { field: 'EmployeeName', headerText: 'Employee Name', width: 200 },
                    { field: '9:00', headerText: '9:00 AM', width: 120, textAlign: 'Center', },
                    { field: '9:30', headerText: '9:30 AM', width: 120, textAlign: 'Center' },
                    { field: '10:00', headerText: '10:00 AM', width: 120, textAlign: 'Center' },
                    { field: '10:30', headerText: '10:30 AM', width: 120, textAlign: 'Center' },
                    { field: '11:00', headerText: '11:00 AM', width: 120, textAlign: 'Center' },
                    { field: '11:30', headerText: '11:30 AM', width: 120, textAlign: 'Center' },
                    { field: '12:00', headerText: '12:00 PM', width: 120, textAlign: 'Center' },
                    { field: '12:30', headerText: '12:30 PM', width: 120, textAlign: 'Center' },
                    { field: '1:00', headerText: '1:00 PM', width: 120, textAlign: 'Center' },
                    { field: '1:30', headerText: '1:30 PM', width: 120, textAlign: 'Center' },
                    { field: '2:00', headerText: '2:00 PM', width: 120, textAlign: 'Center' },
                    { field: '2:30', headerText: '2:30 PM', width: 120, textAlign: 'Center' },
                    { field: '3:00', headerText: '3:00 PM', width: 120, textAlign: 'Center' },
                    { field: '3:30', headerText: '3:30 PM', width: 120, textAlign: 'Center' },
                    { field: '4:00', headerText: '4:00 PM', width: 120, textAlign: 'Center' },
                    { field: '4:30', headerText: '4:30 PM', width: 120, textAlign: 'Center', freeze: 'Right' },
                    { field: '5:00', headerText: '5:00 PM', width: 120, textAlign: 'Center', freeze: 'Right' }
                ]
            },
            done
        );
    });
    it('Row spand and cols span support', (done: Function) => {
        let tr = gridObj.getContentTable().querySelectorAll('tr');
        let row1 = tr[0].querySelectorAll('td');
        let row3 = tr[2].querySelectorAll('td');
        expect(row1.length).toBe(12);
        expect(row3.length).toBe(7);
        expect(row1[11].getAttribute('rowspan')).toBe('2');
        expect(row1[2].getAttribute('colspan')).toBe('2');
        done();
    });
    it('Test sorting with spanned cell', (done: Function) => {
        let dataBound = (args: any): void => {
            let tr = gridObj.getContentTable().querySelectorAll('tr');
            let row1 = tr[0].querySelectorAll('td');
            let row3 = tr[3].querySelectorAll('td');
            expect(row1.length).toBe(12);
            expect(row3.length).toBe(8);
            expect(row1[6].getAttribute('rowspan')).toBe('2');
            expect(row1[4].getAttribute('colspan')).toBe('2');
            gridObj.dataBound = null;
            done();
        }
        gridObj.dataBound = dataBound;
        gridObj.sortByColumn('EmployeeName', 'Ascending', true);
    });
    it('Test Filtering with spanned cell', (done: Function) => {
        let dataBound = (args: any): void => {
            let tr = gridObj.getContentTable().querySelectorAll('tr');
            let row1 = tr[0].querySelectorAll('td');
            expect(row1.length).toBe(12);
            expect(row1[7].getAttribute('rowspan')).toBe('5');
            expect(row1[4].getAttribute('colspan')).toBe('2');
            gridObj.dataBound = null;
            done();
        }
        gridObj.dataBound = dataBound;
        gridObj.filterByColumn('EmployeeName', 'contains', 'Andrew');
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});
describe('User Story 970793: Need to provide row and Cell Spanning support with cross features', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: columnSpanData,
                treeColumnIndex: 1,
                childMapping: 'subtasks',
                height: 317,
                rowHeight: 40,
                enableRowSpan: true,
                enableColumnSpan: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                allowReordering: true,
                allowResizing: true,
                showColumnChooser: true,
                filterSettings: { type: 'Excel' },
                toolbar: ['Search', 'ColumnChooser'],
                gridLines: 'Both',
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', width: 150, textAlign: 'Right', isPrimaryKey: true, freeze: 'Left' },
                    { field: 'EmployeeName', headerText: 'Employee Name', width: 200 },
                    { field: '9:00', headerText: '9:00 AM', width: 120, textAlign: 'Center', },
                    { field: '9:30', headerText: '9:30 AM', width: 120, textAlign: 'Center' },
                    { field: '10:00', headerText: '10:00 AM', width: 120, textAlign: 'Center' },
                    { field: '10:30', headerText: '10:30 AM', width: 120, textAlign: 'Center' },
                    { field: '11:00', headerText: '11:00 AM', width: 120, textAlign: 'Center' },
                    { field: '11:30', headerText: '11:30 AM', width: 120, textAlign: 'Center' },
                    { field: '12:00', headerText: '12:00 PM', width: 120, textAlign: 'Center' },
                    { field: '12:30', headerText: '12:30 PM', width: 120, textAlign: 'Center' },
                    { field: '1:00', headerText: '1:00 PM', width: 120, textAlign: 'Center' },
                    { field: '1:30', headerText: '1:30 PM', width: 120, textAlign: 'Center' },
                    { field: '2:00', headerText: '2:00 PM', width: 120, textAlign: 'Center' },
                    { field: '2:30', headerText: '2:30 PM', width: 120, textAlign: 'Center' },
                    { field: '3:00', headerText: '3:00 PM', width: 120, textAlign: 'Center' },
                    { field: '3:30', headerText: '3:30 PM', width: 120, textAlign: 'Center' },
                    { field: '4:00', headerText: '4:00 PM', width: 120, textAlign: 'Center' },
                    { field: '4:30', headerText: '4:30 PM', width: 120, textAlign: 'Center', freeze: 'Right' },
                    { field: '5:00', headerText: '5:00 PM', width: 120, textAlign: 'Center', freeze: 'Right' }
                ]
            },
            done
        );
    });
    it('Test collapse with spanned cell', (done: Function) => {
        let dataBound = (args: any): void => {
            let tr = gridObj.getContentTable().querySelectorAll('tr');
            let row1 = tr[0].querySelectorAll('td');
            expect(row1.length).toBe(12);
            expect(row1[7].getAttribute('rowspan')).toBe('12');
            expect(row1[5].getAttribute('colspan')).toBe('3');
            gridObj.dataBound = null;
            done();
        }
        gridObj.dataBound = dataBound;
        let rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
    });
    it('Test collapse with spanned cell', (done: Function) => {
        let dataBound = (args: any): void => {
            let tr = gridObj.getContentTable().querySelectorAll('tr');
            let row1 = tr[0].querySelectorAll('td');
            expect(row1.length).toBe(12);
            expect(row1[7].getAttribute('rowspan')).toBe('12');
            expect(row1[5].getAttribute('colspan')).toBe('3');
            gridObj.dataBound = null;
            done();
        }
        gridObj.dataBound = dataBound;
        let rows = gridObj.getRows();
        (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});
describe('User Story 970793: Need to provide row and Cell Spanning support with cross features', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: columnSpanSelfRefData,
                treeColumnIndex: 1,
                idMapping:'EmployeeID',
                parentIdMapping:'parentID',
                height: 317,
                rowHeight: 40,
                enableRowSpan: true,
                enableColumnSpan: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                allowReordering: true,
                allowResizing: true,
                showColumnChooser: true,
                filterSettings: { type: 'Excel' },
                toolbar: ['Search', 'ColumnChooser'],
                gridLines: 'Both',
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', width: 150, textAlign: 'Right', isPrimaryKey: true, freeze: 'Left' },
                    { field: 'EmployeeName', headerText: 'Employee Name', width: 200 },
                    { field: '9:00', headerText: '9:00 AM', width: 120, textAlign: 'Center', },
                    { field: '9:30', headerText: '9:30 AM', width: 120, textAlign: 'Center' },
                    { field: '10:00', headerText: '10:00 AM', width: 120, textAlign: 'Center' },
                    { field: '10:30', headerText: '10:30 AM', width: 120, textAlign: 'Center' },
                    { field: '11:00', headerText: '11:00 AM', width: 120, textAlign: 'Center' },
                    { field: '11:30', headerText: '11:30 AM', width: 120, textAlign: 'Center' },
                    { field: '12:00', headerText: '12:00 PM', width: 120, textAlign: 'Center' },
                    { field: '12:30', headerText: '12:30 PM', width: 120, textAlign: 'Center' },
                    { field: '1:00', headerText: '1:00 PM', width: 120, textAlign: 'Center' },
                    { field: '1:30', headerText: '1:30 PM', width: 120, textAlign: 'Center' },
                    { field: '2:00', headerText: '2:00 PM', width: 120, textAlign: 'Center' },
                    { field: '2:30', headerText: '2:30 PM', width: 120, textAlign: 'Center' },
                    { field: '3:00', headerText: '3:00 PM', width: 120, textAlign: 'Center' },
                    { field: '3:30', headerText: '3:30 PM', width: 120, textAlign: 'Center' },
                    { field: '4:00', headerText: '4:00 PM', width: 120, textAlign: 'Center' },
                    { field: '4:30', headerText: '4:30 PM', width: 120, textAlign: 'Center', freeze: 'Right' },
                    { field: '5:00', headerText: '5:00 PM', width: 120, textAlign: 'Center', freeze: 'Right' }
                ]
            },
            done
        );
    });
    it('Row spand and cols span support with self-referential', (done: Function) => {
        let tr = gridObj.getContentTable().querySelectorAll('tr');
        let row1 = tr[0].querySelectorAll('td');
        let row3 = tr[2].querySelectorAll('td');
        expect(row1.length).toBe(12);
        expect(row3.length).toBe(7);
        expect(row1[11].getAttribute('rowspan')).toBe('2');
        expect(row1[2].getAttribute('colspan')).toBe('2');
        done();
    });
    it('Test sorting with spanned cell with self-referential', (done: Function) => {
            let dataBound = (args: any): void => {
                let tr = gridObj.getContentTable().querySelectorAll('tr');
                let row1 = tr[0].querySelectorAll('td');
                let row3 = tr[3].querySelectorAll('td');
                expect(row1.length).toBe(12);
                expect(row3.length).toBe(8);
                expect(row1[6].getAttribute('rowspan')).toBe('2');
                expect(row1[4].getAttribute('colspan')).toBe('2');
                gridObj.dataBound = null;
                done();
            }
            gridObj.dataBound = dataBound;
            gridObj.sortByColumn('EmployeeName', 'Ascending', true);
        });
        it('Test Filtering with spanned cell with self-referential', (done: Function) => {
            let dataBound = (args: any): void => {
                let tr = gridObj.getContentTable().querySelectorAll('tr');
                let row1 = tr[0].querySelectorAll('td');
                expect(row1.length).toBe(12);
                expect(row1[7].getAttribute('rowspan')).toBe('5');
                expect(row1[4].getAttribute('colspan')).toBe('2');
                gridObj.dataBound = null;
                done();
            }
            gridObj.dataBound = dataBound;
            gridObj.filterByColumn('EmployeeName', 'contains', 'Andrew');
        });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});
describe('User Story 970793: Need to provide row and Cell Spanning support with cross features', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: columnSpanData,
                treeColumnIndex: 1,
                childMapping: 'subtasks',
                height: 317,
                rowHeight: 40,
                enableRowSpan: true,
                enableColumnSpan: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                allowReordering: true,
                allowResizing: true,
                showColumnChooser: true,
                filterSettings: { type: 'Excel' },
                toolbar: ['Search', 'ColumnChooser'],
                gridLines: 'Both',
                columns: [
                    { field: 'EmployeeID', headerText: 'Employee ID', width: 150, textAlign: 'Right', isPrimaryKey: true, freeze: 'Left' },
                    { field: 'EmployeeName', headerText: 'Employee Name', width: 200 },
                    { field: '9:00', headerText: '9:00 AM', width: 120, textAlign: 'Center', },
                    { field: '9:30', headerText: '9:30 AM', width: 120, textAlign: 'Center' },
                    { field: '10:00', headerText: '10:00 AM', width: 120, textAlign: 'Center' },
                    { field: '10:30', headerText: '10:30 AM', width: 120, textAlign: 'Center' },
                    { field: '11:00', headerText: '11:00 AM', width: 120, textAlign: 'Center' },
                    { field: '11:30', headerText: '11:30 AM', width: 120, textAlign: 'Center' },
                    { field: '12:00', headerText: '12:00 PM', width: 120, textAlign: 'Center' },
                    { field: '12:30', headerText: '12:30 PM', width: 120, textAlign: 'Center' },
                    { field: '1:00', headerText: '1:00 PM', width: 120, textAlign: 'Center' },
                    { field: '1:30', headerText: '1:30 PM', width: 120, textAlign: 'Center' },
                    { field: '2:00', headerText: '2:00 PM', width: 120, textAlign: 'Center' },
                    { field: '2:30', headerText: '2:30 PM', width: 120, textAlign: 'Center' },
                    { field: '3:00', headerText: '3:00 PM', width: 120, textAlign: 'Center' },
                    { field: '3:30', headerText: '3:30 PM', width: 120, textAlign: 'Center' },
                    { field: '4:00', headerText: '4:00 PM', width: 120, textAlign: 'Center' },
                    { field: '4:30', headerText: '4:30 PM', width: 120, textAlign: 'Center', freeze: 'Right' },
                    { field: '5:00', headerText: '5:00 PM', width: 120, textAlign: 'Center', freeze: 'Right' }
                ]
            },
            done
        );
    });
        it('Test collapse with spanned cell with self-referential', (done: Function) => {
            let dataBound = (args: any): void => {
                let tr = gridObj.getContentTable().querySelectorAll('tr');
                let row1 = tr[0].querySelectorAll('td');
                expect(row1.length).toBe(12);
                expect(row1[7].getAttribute('rowspan')).toBe('12');
                expect(row1[5].getAttribute('colspan')).toBe('3');
                gridObj.dataBound = null;
                done();
            }
            gridObj.dataBound = dataBound;
            let rows = gridObj.getRows();
            (rows[0].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        });
        it('Test collapse with spanned cell with self-referential', (done: Function) => {
            let dataBound = (args: any): void => {
                let tr = gridObj.getContentTable().querySelectorAll('tr');
                let row1 = tr[0].querySelectorAll('td');
                expect(row1.length).toBe(12);
                expect(row1[7].getAttribute('rowspan')).toBe('12');
                expect(row1[5].getAttribute('colspan')).toBe('3');
                gridObj.dataBound = null;
                done();
            }
            gridObj.dataBound = dataBound;
            let rows = gridObj.getRows();
            (rows[0].getElementsByClassName('e-treegridcollapse')[0] as HTMLElement).click();
        });
        it('Check onpropertychanged for enableRowSpan and enableColumnSpan', () => {
            gridObj.enableRowSpan = false;
            gridObj.enableColumnSpan = false;
            expect(gridObj.enableRowSpan).toBe(false);
            expect(gridObj.enableColumnSpan).toBe(false);
        });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('isRowSelectable method', () => {
    let gridObj: TreeGrid;
    
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            height: 400,
            allowSelection: true,
            columns: [
                { type: 'checkbox', width: 50 },
                { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right' },
                { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' }
            ]
            },
            done
        );
    });

    it('Test isRowSelectable property', () => {
        gridObj.isRowSelectable = (data: any) => {
            return data.taskID !== 1;
        };
        ((<HTMLElement>(gridObj.element.querySelectorAll(".e-row")[0].getElementsByClassName("e-frame e-icons")[0])) as any).click();
        expect(gridObj.flatData.length).toBe(36);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('FreezeRefresh method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            height: 400,
            allowSelection: true,
            allowFiltering: true,
            columns: [
                { type: 'checkbox', width: 50 },
                { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right' },
                { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' }
            ]
            },
            done
        );
    });

    it('Test FreezeRefresh method', (done: Function) => {
        gridObj.setProperties({allowFiltering: false},true);
        gridObj.refreshLayout();
        expect(gridObj.allowFiltering).toBe(false);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Locale', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
            dataSource: sampleData,
            childMapping: 'subtasks',
            treeColumnIndex: 1,
            height: 400,
            columns: [
                { type: 'checkbox', width: 50 },
                { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right' },
                { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' }
            ]
            },
            done
        );
    });

    it("locale", () => {
        gridObj.locale = null;
        gridObj.dataBind();
        expect(gridObj.locale).toBe(null);
        gridObj.locale = undefined;
        gridObj.dataBind();
        expect(gridObj.locale).toBe(undefined);
    });

    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 988871: DataSource not updated on adding records using addRecords method.', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [],
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowResizing: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true
                },
                height: 400,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100, type: 'number' },
                    { field: 'taskName', headerText: 'Task Name', width: 260, template: (data: any) => `<span>${data.taskName}</span>`, allowResizing: true },
                ]
            },
            done
        );
    });
    it('datasource should not be empty after adding data with addRecord method', (done) => {
        let actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                expect((gridObj.dataSource as any).length).toBe(1);
                done();
            }
        }
        gridObj.actionComplete = actionComplete;
        var dummy = { taskID: 1, taskName: 'planning' };
        gridObj.addRecord(dummy, 0, 'Below');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});
describe('Bug 988871: DataSource not updated on adding records using addRecords method.', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [],
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true
                },
                allowResizing: true,
                height: 400,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100, type: 'number', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name', width: 260, template: (data: any) => `<span>${data.taskName}</span>`, allowResizing: true },
                ]
            },
            done
        );
    });
    it('adding child record to newly added record via child', (done) => {
        let step = 0;
        gridObj.actionComplete = (args?: any): void => {
            if (args.requestType === 'save') {
                if (step === 0) {
                    step++;
                    gridObj.addRecord({ taskID: 2, taskName: 'planning TimeLine' }, 0, 'Child');
                } else if (step === 1) {
                    expect((gridObj.dataSource as any).length).toBe(1);
                    const data = gridObj.dataSource as any[];
                    const firstRecord = data[0];
                    expect(firstRecord.subtasks.length).toBe(1);
                    done();
                }
            }
        };
        // Start by adding first record
        gridObj.addRecord({ taskID: 1, taskName: 'planning' }, 0, 'Child');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});
describe('Bug 988871: DataSource not updated on adding records using addRecords method.', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [],
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true
                },
                allowResizing: true,
                height: 400,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100, type: 'number', isPrimaryKey: true },
                    { field: 'taskName', headerText: 'Task Name', width: 260, template: (data: any) => `<span>${data.taskName}</span>`, allowResizing: true },
                ]
            },
            done
        );
    });
    it('adding child record to newly added record', function (done) {
        let step = 0;
        gridObj.actionComplete = function (args) {
            if (args.requestType === 'save') {
                if (step === 0) {
                    step++;
                    gridObj.addRecord({ taskID: 2, taskName: 'planning TimeLine' }, 0, 'Child');
                } else if (step === 1) {
                    expect((gridObj.dataSource as any).length).toBe(1);
                    const data = gridObj.dataSource as any[];
                    expect(data[0].subtasks.length).toBe(1);
                    done();
                }
            }
        };
        gridObj.addRecord({ taskID: 1, taskName: 'planning' }, 0, 'Below');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('EJ2-990496-Properties missing on initial render of treegrid when using getColumnByField() method', () => {
    let gridObj: TreeGrid;
    let isTaskName: boolean;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                height: 400,
                columns: [
                    { type: 'checkbox', width: 50 },
                    { field: 'taskID', headerText: 'Task ID', width: 60, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                    { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                    { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' }
                ],
                created: () => {
                    const treegridElement = document.getElementsByClassName('e-treegrid')[0] as HTMLElement & { ej2_instances: any[] };
                    const treegrid = treegridElement.ej2_instances[0];
                    isTaskName = treegrid.getColumnByField('taskName').visible;
                }
            },
            done
        );
    });
    it('checking the visible property is assigned of column properties in created event', function (done: Function) {
        expect(isTaskName).toBe(true);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    })
});


describe('Task 985326: Testing getPageSizeByHeight method', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowPaging: true,
                height: 410,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 110 },
                    { field: 'taskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', width: 90, textAlign: 'Right', type: 'date', format: 'yMd' },
                    { field: 'Duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                    { field: 'Progress', headerText: 'Progress', width: 80, textAlign: 'Right' },
                    { field: 'Priority', headerText: 'Priority', width: 90 }
                ]
            },
            done
        );
    });
    it('should get pageSize by height without param', () => {
        expect((gridObj as any).getPageSizeByHeight()).toBe(22);
    });
    it('should get pageSize by height with param', () => {
        expect((gridObj as any).getPageSizeByHeight(488)).toBe(17);
    });
    it('should get pageSize by height with param as string', () => {
        expect((gridObj as any).getPageSizeByHeight('488')).toBe(17);
    });
    it('should get pageSize by height with param as percentage', () => {
        expect((gridObj as any).getPageSizeByHeight('100%')).toBe(22);
    });
    it('should get pageSize by height without paging', () => {
        gridObj.allowPaging = false;
        expect((gridObj as any).getPageSizeByHeight()).toBe(22);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Bug 998336: Error throws on binding action failure event with frozen columns', () => {
    let gridObj: TreeGrid;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                frozenColumns: 1,
                columns: [
                { field: 'taskID', headerText: 'Task ID', textAlign: 'Right', width: 100 },
                { field: 'taskName', headerText: 'Task Name', width: 260 },
                ],
                actionFailure: actionFailedFunction
            },
            done
        );
    });
    it('actionFailure testing', () => {
        expect(actionFailedFunction).not.toHaveBeenCalled();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});