import { Gantt, Edit, Selection, CriticalPath, UndoRedo } from '../../src/index'
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
import { unscheduledData } from '../base/data-source.spec';

type ToolLike = { name: string; execute?: Function };

describe('WebMCP Adapter -> Gantt', () => {
    beforeAll(() => {
        Gantt.Inject(Edit, Selection, CriticalPath, UndoRedo);
    });

    let ganttObj: Gantt | null = null;

    afterEach(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
            ganttObj = null;
        }
        // cleanup modelContext between tests
        (document as any).modelContext = undefined;
    });

    it('getWebMcpTools returns the expected tool set', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            allowSelection: true,
            enableCriticalPath: true,
            enableUndoRedo: true,
            undoRedoActions: [],
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate'
            }
        } as any, () => {
            const tools = ganttObj!.getWebMcpTools();
            expect(tools.length).toBe(38);
            const names = tools.map(t => t.name);
            expect(names).toContain('getProjectTasks');
            expect(names).toContain('manageHierarchy');
            expect(names).toContain('csvExport');
            done();
        });
    });

    it('registerWebMcpTools registers selected tools into modelContext', (done: Function) => {
        let registered: ToolLike[] = [];
        (document as any).modelContext = {
            registerTool: (tool: ToolLike) => {
                registered.push(tool);
            }
        };

        ganttObj = createGantt({
            enableWebMcp: true,
            allowSelection: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate'
            }
        } as any, (data: any) => {
            // Once dataBound happens
            ganttObj.registerWebMcpTools(undefined, ['getProjectTasks']);
            expect(registered.length).toBe(1);
            expect(registered[0].name).toContain('getProjectTasks');
            expect(typeof registered[0].execute).toBe('function');
            done();
        });
    });
});
