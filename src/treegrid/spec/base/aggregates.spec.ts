import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { sampleData } from './datasource.spec';
import { Aggregate } from '@syncfusion/ej2-grids';
import { createGrid, destroy } from './treegridutil.spec';
TreeGrid.Inject(Aggregate);

describe('The Column template with child Aggreagate is not working properly- EJ2-63995 ', () => {
    let gridObj: TreeGrid;
    let rows: Element[];
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 0,
                rowHeight: 83,
                columns: [
                    { field: 'taskID', headerText: 'Task ID', width: 90, textAlign: 'Right' },
                    { field: 'taskName', headerText: 'Task Name', width: 180, textAlign: 'Left' },
                    { field: 'duration', headerText: 'Duration', width: 80, textAlign: 'Right' },
                    { field: 'progress', headerText: 'Progress', width: 80, textAlign: 'Right' },
                    { headerText: 'Tax per annum', textAlign: 'Center', template: '<span>test</span>', width: 90 }
                ],
                width: 'auto',
                height: 360,
                aggregates: [
                    {
                        showChildSummary: true,
                        columns: [
                            {
                                type: 'Max',
                                field: 'progress',
                                columnName: 'progress',
                                footerTemplate: 'Maximum: ${Max}'
                            }
                        ]
                    }
                ]
            },
            done
        );
    });
    it('Check the Column template with child Aggreagate working properly', () => {
        rows = gridObj.getRows();
        expect((rows[5] as HTMLTableRowElement).cells[4].classList.contains('e-templatecell')).toBe(true);
        expect((rows[5] as HTMLTableRowElement).cells[4].classList.contains('e-summarycell')).toBe(true);
        expect((rows[5] as HTMLTableRowElement).cells[4].innerHTML).toBe('');

    });
    afterAll(() => {
        destroy(gridObj);
    });
});
