import { sampleData, zerothRecord } from './datasource.spec';
import { createGrid, destroy } from './treegridutil.spec';
import { TreeGrid } from '../../src';
import { Data } from '@syncfusion/ej2-grids';
import { profile, inMB, getMemoryProfile } from '../common.spec';


describe('TreeGrid Row module', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); //Skips test (in Chai)
            return;
        }
    });

    describe('gridLines', () => {
        let gridObj: TreeGrid;
        let rows: Element[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    gridLines: 'None',
                    columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
                },
                done
            );
        });
        it('gridline testing', () => {
            expect(gridObj.grid.element.classList.contains('e-hidelines')).toBe(true);
        });
        it('gridline setmodel testing', () => {
            gridObj.gridLines = 'Vertical';
            gridObj.dataBind();
            expect(gridObj.grid.element.classList.contains('e-verticallines')).toBe(true);
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

describe('gridhover, alt row, rowHeight', () => {
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

    it('row hoversetmodel testing', () => {
        gridObj.enableHover = false;
        gridObj.dataBind();
        expect(gridObj.grid.element.classList.contains('e-gridhover')).toBe(false);
        gridObj.enableAltRow = false;
        expect(gridObj.grid.element.classList.contains('e-altrow')).toBe(false);
    });
    it('row hoversetmodel testing', (done: Function) => {
        gridObj.dataBound = (args: Object) => {
            expect(gridObj.getRows()[1].style.height).toBe('60px');
            done();
        };
        gridObj.rowHeight = 60;
        gridObj.dataBind();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('rows methods', () => {
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
    it('methods', () => {
        rows = gridObj.getDataRows();
        expect(rows.length).toEqual(gridObj.getCurrentViewRecords().length);
        expect(gridObj.getRowInfo(<Element | EventTarget>gridObj.element).toString()).toBe({}.toString());
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Indent for 0th level Row', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: zerothRecord,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('Testing Indent for 0th level Row that has no childrecords and 0th level record with chidrecord', () => {
        expect(gridObj.getRowByIndex(0).querySelector('.e-icons.e-none')).not.toBe(null);
        expect(gridObj.getRowByIndex(1).querySelector('.e-icons.e-none')).not.toBe(null);
        expect((gridObj.getRowByIndex(0).querySelectorAll('.e-icons.e-none')).length).toBe(2);
        expect((gridObj.getRowByIndex(1).querySelectorAll('.e-icons.e-none')).length).toBe(1);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('height set through setmodel', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                height: 200,
                treeColumnIndex: 1,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
            },
            done
        );
    });
    it('height set through setmodel method', () => {
        gridObj.height = 600;
        gridObj.dataBind();
        expect((gridObj.getContent().firstChild as HTMLElement).style.height).toBe('600px');
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('alt row without paging', () => {
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
    it('checking alt row without paging', () => {
        gridObj.enableAltRow = true;
        rows = gridObj.getRows();
        expect(rows[11].classList.contains('e-altrow')).toBe(true);
        (rows[5].getElementsByClassName('e-treegridexpand')[0] as HTMLElement).click();
        expect(rows[11].classList.contains('e-altrow')).toBe(false);
    });
    afterAll(() => {
        destroy(gridObj);
    });
});
