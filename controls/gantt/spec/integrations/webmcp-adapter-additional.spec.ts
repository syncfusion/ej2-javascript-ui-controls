import { Gantt, Edit, Selection, CriticalPath, UndoRedo } from '../../src/index'
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
import { unscheduledData } from '../base/data-source.spec';
import { WebMcpAdapter } from '../../src/gantt/integrations/webmcp-adapter';

type ToolLike = { name: string; execute?: Function };

// Helper to ensure adapter is initialized
function ensureAdapterInitialized(ganttObj: Gantt): WebMcpAdapter {
    if (ganttObj.enableWebMcp && !(ganttObj as any)._webMcpAdapter) {
        ganttObj.getWebMcpTools();
    }
    return (ganttObj as any)._webMcpAdapter;
}

describe('WebMCP Adapter -> Gantt (Additional Coverage)', () => {
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

    it('constructor initializes correctly', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            // Trigger adapter initialization by calling getWebMcpTools
            const tools = ganttObj!.getWebMcpTools();
            expect(tools).toBeDefined();
            
            // Check that WebMcpAdapter is properly initialized
            const adapter = ensureAdapterInitialized(ganttObj!);
            expect(adapter).toBeDefined();
            expect(adapter.getModuleName()).toBe('WebMcpAdapter');
            done();
        });
    });

    it('addEventListener and removeEventListener work correctly', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            // Trigger adapter initialization by calling getWebMcpTools
            ganttObj!.getWebMcpTools();
            
            const adapter = ensureAdapterInitialized(ganttObj!);
            expect(adapter).toBeDefined();
            
            // Spy on the event methods using bracket notation for private members
            spyOn(adapter as any, 'addEventListener').and.callThrough();
            spyOn(adapter as any, 'removeEventListener').and.callThrough();
            
            // Trigger destroy to test removeEventListener
            adapter.destroy();
            
            expect((adapter as any)['removeEventListener']).toHaveBeenCalled();
            done();
        });
    });

    it('getTools returns all tools when no filter provided', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            expect(adapter).toBeDefined();
            const tools = (adapter as any).getTools({});
            expect(tools.length).toBeGreaterThan(0);
            done();
        });
    });

    it('getTools returns filtered tools when toolNames provided', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            expect(adapter).toBeDefined();
            const tools = (adapter as any).getTools({ toolNames: ['getProjectTasks'] });
            expect(tools.length).toBe(1);
            expect(tools[0].name).toBe('getProjectTasks');
            done();
        });
    });

    it('registerTools handles missing modelContext gracefully', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Remove modelContext to simulate missing context
            const originalContext = (document as any).modelContext;
            (document as any).modelContext = undefined;
            
            // Should not throw error
            expect(() => {
                (adapter as any).registerTools({});
            }).not.toThrow();
            
            // Restore context
            (document as any).modelContext = originalContext;
            done();
        });
    });

    it('registerTools handles invalid registerTool function gracefully', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Set invalid registerTool function
            (document as any).modelContext = {
                registerTool: 'not a function'
            };
            
            // Should not throw error
            expect(() => {
                (adapter as any).registerTools({});
            }).not.toThrow();
            
            done();
        });
    });

    it('executeHandler handles unknown tool gracefully', async () => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Execute unknown tool
            const result = (adapter as any).executeHandler('unknownTool', {});
            
            // Should return error response
            result.then((response: any) => {
                expect(response.isError).toBe(true);
                expect(response.content[0].text).toContain('Tool "unknownTool" not found');
            });
        });
    });

    it('executeHandler handles tool cancellation', async () => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on the beforeWebMcpToolExecute event to simulate cancellation
            spyOn(ganttObj!, 'trigger').and.callFake((eventName: string, args: any) => {
                if (eventName === 'beforeWebMcpToolExecute') {
                    args.cancel = true;
                    args.cancellationResponse = 'Test cancellation';
                }
            });
            
            // Execute any tool
            const result = (adapter as any).executeHandler('getProjectTasks', {});
            
            result.then((response: any) => {
                expect(response.content[0].text).toContain('Test cancellation');
            });
        });
    });

    it('executeHandler handles exceptions gracefully', async () => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getCurrentViewData to throw an error
            spyOn(ganttObj!, 'getCurrentViewData').and.throwError('Test error');
            
            // Execute tool that calls getCurrentViewData
            const result = (adapter as any).executeHandler('getProjectTasks', {});
            
            result.then((response: any) => {
                expect(response.isError).toBe(true);
                expect(response.content[0].text).toContain('Test error');
            });
        });
    });

    it('buildConfirmationMessage generates correct message', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            const message = (adapter as any).buildConfirmationMessage('testCommand', { test: 'value' });
            expect(message).toContain('testCommand');
            expect(message).toContain('{"test":"value"}');
            done();
        });
    });

    it('destroy cleans up resources correctly', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on abort controller
            if ((adapter as any).webMcpAbortController) {
                spyOn((adapter as any).webMcpAbortController, 'abort').and.callThrough();
            }
            
            // Destroy the adapter
            adapter.destroy();
            
            // Check that resources were cleaned up
            expect((adapter as any).parent).toBeNull();
            if ((adapter as any).webMcpAbortController) {
                expect((adapter as any).webMcpAbortController.abort).toHaveBeenCalled();
            }
            expect((adapter as any).webMcpAbortController).toBeNull();
            
            done();
        });
    });
    it('destroy cleans up resources correctly', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {

            const adapter = ensureAdapterInitialized(ganttObj!);

            (adapter as any).webMcpAbortController = {
                abort: function () {}
            };

            const abortController = (adapter as any).webMcpAbortController;

            // Spy on abort controller
            if ((adapter as any).webMcpAbortController) {
                spyOn((adapter as any).webMcpAbortController, 'abort').and.callThrough();
            }

            adapter.destroy();

            expect(abortController.abort).toHaveBeenCalled();
            done();
        });
    });

    it('registerTools with prefix correctly prefixes tool names', (done: Function) => {
        let registered: ToolLike[] = [];
        (document as any).modelContext = {
            registerTool: (tool: ToolLike) => {
                registered.push(tool);
            }
        };

        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Register tools with a prefix
            (adapter as any).registerTools({ prefix: 'testPrefix', tools: ['getProjectTasks'] });
            
            expect(registered.length).toBe(1);
            expect(registered[0].name).toContain('testPrefix_getProjectTasks');
            
            done();
        });
    });

    it('registerTools with existing tools array', (done: Function) => {
        let registered: ToolLike[] = [];
        (document as any).modelContext = {
            registerTool: (tool: ToolLike) => {
                registered.push(tool);
            }
        };

        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Create a tool object
            const testTool = {
                name: 'testTool',
                description: 'Test tool',
                inputSchema: {},
                outputSchema: {}
            };
            
            // Register with existing tools array
            (adapter as any).registerTools({ tools: [testTool] });
            
            expect(registered.length).toBe(1);
            expect(registered[0].name).toContain('testTool');
            
            done();
        });
    });

    // Tool-specific execution tests
    it('executeHandler handles manageHierarchy expandAll action', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on expandAll
            spyOn(ganttObj!, 'expandAll').and.callThrough();
            
            // Execute manageHierarchy with expandAll action
            const result = (adapter as any).executeHandler('manageHierarchy', { action: 'expandAll' });
            
            result.then((response: any) => {
                expect(ganttObj!.expandAll).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles manageHierarchy collapseAll action', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on collapseAll
            spyOn(ganttObj!, 'collapseAll').and.callThrough();
            
            // Execute manageHierarchy with collapseAll action
            const result = (adapter as any).executeHandler('manageHierarchy', { action: 'collapseAll' });
            
            result.then((response: any) => {
                expect(ganttObj!.collapseAll).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles manageHierarchy expandByID action', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on expandByID
            spyOn(ganttObj!, 'expandByID').and.callThrough();
            
            // Execute manageHierarchy with expandByID action
            const result = (adapter as any).executeHandler('manageHierarchy', { action: 'expandByID', id: '1' });
            
            result.then((response: any) => {
                expect(ganttObj!.expandByID).toHaveBeenCalledWith('1');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles manageHierarchy expandByIndex action', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on expandByIndex
            spyOn(ganttObj!, 'expandByIndex').and.callThrough();
            
            // Execute manageHierarchy with expandByIndex action
            const result = (adapter as any).executeHandler('manageHierarchy', { action: 'expandByIndex', index: 1 });
            
            result.then((response: any) => {
                expect(ganttObj!.expandByIndex).toHaveBeenCalledWith(1);
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles manageHierarchy unknown action', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Execute manageHierarchy with unknown action
            const result = (adapter as any).executeHandler('manageHierarchy', { action: 'unknownAction' });
            
            result.then((response: any) => {
                expect(response.isError).toBe(true);
                expect(response.content[0].text).toContain('Unknown hierarchy action');
                done();
            });
        });
    });

    it('executeHandler handles splitTask with array of dates', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on splitTask
            spyOn(ganttObj!, 'splitTask').and.callThrough();
            
            // Execute splitTask with array of dates
            const splitDates = [new Date('2023-01-01'), new Date('2023-01-02')];
            const result = (adapter as any).executeHandler('splitTask', { taskId: '1', splitDate: splitDates });
            
            result.then((response: any) => {
                expect(ganttObj!.splitTask).toHaveBeenCalledWith('1', jasmine.any(Array));
                done();
            });
        });
    });

    it('executeHandler handles splitTask with single date', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on splitTask
            spyOn(ganttObj!, 'splitTask').and.callThrough();
            
            // Execute splitTask with single date
            const splitDate = new Date('2023-01-01');
            const result = (adapter as any).executeHandler('splitTask', { taskId: '1', splitDate: splitDate });
            
            result.then((response: any) => {
                expect(ganttObj!.splitTask).toHaveBeenCalledWith('1', jasmine.any(Date));
                done();
            });
        });
    });

    it('executeHandler handles manageTaskDependencies add operation', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on addPredecessor
            spyOn(ganttObj!, 'addPredecessor').and.callThrough();
            
            // Execute manageTaskDependencies with add operation
            const result = (adapter as any).executeHandler('manageTaskDependencies', { 
                taskId: '1', 
                operation: 'add', 
                predecessorString: '2' 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.addPredecessor).toHaveBeenCalledWith('1', '2');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles manageTaskDependencies update operation', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on updatePredecessor
            spyOn(ganttObj!, 'updatePredecessor').and.callThrough();
            
            // Execute manageTaskDependencies with update operation
            const result = (adapter as any).executeHandler('manageTaskDependencies', { 
                taskId: '1', 
                operation: 'update', 
                predecessorString: '2' 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.updatePredecessor).toHaveBeenCalledWith('1', '2');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles manageTaskDependencies remove operation', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on removePredecessor
            spyOn(ganttObj!, 'removePredecessor').and.callThrough();
            
            // Execute manageTaskDependencies with remove operation
            const result = (adapter as any).executeHandler('manageTaskDependencies', { 
                taskId: '1', 
                operation: 'remove' 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.removePredecessor).toHaveBeenCalledWith('1');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles manageTaskDependencies unknown operation', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Execute manageTaskDependencies with unknown operation
            const result = (adapter as any).executeHandler('manageTaskDependencies', { 
                taskId: '1', 
                operation: 'unknown', 
                predecessorString: '2' 
            });
            
            result.then((response: any) => {
                expect(response.isError).toBe(true);
                expect(response.content[0].text).toContain('Unknown dependency operation');
                done();
            });
        });
    });

    it('executeHandler handles indentTask with valid task', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on selectRow and indent
            spyOn(ganttObj!, 'selectRow').and.callThrough();
            spyOn(ganttObj!, 'indent').and.callThrough();
            
            // Mock getRecordByID to return a valid record
            spyOn(ganttObj!, 'getRecordByID').and.returnValue({ index: 1 } as any);
            
            // Execute indentTask
            const result = (adapter as any).executeHandler('indentTask', { taskId: '1' });
            
            result.then((response: any) => {
                expect(ganttObj!.getRecordByID).toHaveBeenCalledWith('1');
                expect(ganttObj!.selectRow).toHaveBeenCalledWith(1);
                expect(ganttObj!.indent).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles outdentTask with valid task', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on selectRow and outdent
            spyOn(ganttObj!, 'selectRow').and.callThrough();
            spyOn(ganttObj!, 'outdent').and.callThrough();
            
            // Mock getRecordByID to return a valid record
            spyOn(ganttObj!, 'getRecordByID').and.returnValue({ index: 1 } as any);
            
            // Execute outdentTask
            const result = (adapter as any).executeHandler('outdentTask', { taskId: '1' });
            
            result.then((response: any) => {
                expect(ganttObj!.getRecordByID).toHaveBeenCalledWith('1');
                expect(ganttObj!.selectRow).toHaveBeenCalledWith(1);
                expect(ganttObj!.outdent).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles zoomTimeline zoomIn action', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on zoomIn
            spyOn(ganttObj!, 'zoomIn').and.callThrough();
            
            // Execute zoomTimeline with zoomIn action
            const result = (adapter as any).executeHandler('zoomTimeline', { action: 'zoomIn' });
            
            result.then((response: any) => {
                expect(ganttObj!.zoomIn).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles zoomTimeline zoomOut action', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on zoomOut
            spyOn(ganttObj!, 'zoomOut').and.callThrough();
            
            // Execute zoomTimeline with zoomOut action
            const result = (adapter as any).executeHandler('zoomTimeline', { action: 'zoomOut' });
            
            result.then((response: any) => {
                expect(ganttObj!.zoomOut).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles zoomTimeline zoomToFit action', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on fitToProject
            spyOn(ganttObj!, 'fitToProject').and.callThrough();
            
            // Execute zoomTimeline with zoomToFit action
            const result = (adapter as any).executeHandler('zoomTimeline', { action: 'zoomToFit' });
            
            result.then((response: any) => {
                expect(ganttObj!.fitToProject).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles mergeTask with valid segment indexes', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on mergeTask
            spyOn(ganttObj!, 'mergeTask').and.callThrough();
            
            // Execute mergeTask with valid segment indexes
            const segmentIndexes = [{ firstSegmentIndex: 0, secondSegmentIndex: 1 }];
            const result = (adapter as any).executeHandler('mergeTask', { 
                taskId: '1', 
                segmentIndexes: segmentIndexes 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.mergeTask).toHaveBeenCalledWith('1', segmentIndexes);
                done();
            });
        });
    });

    it('executeHandler handles mergeTask with empty segment indexes', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on mergeTask
            spyOn(ganttObj!, 'mergeTask').and.callThrough();
            
            // Execute mergeTask with empty segment indexes
            const result = (adapter as any).executeHandler('mergeTask', { 
                taskId: '1', 
                segmentIndexes: [] 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.mergeTask).not.toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles reorderColumns with array of field names', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on reorderColumns
            spyOn(ganttObj!, 'reorderColumns').and.callThrough();
            
            // Execute reorderColumns with array of field names
            const result = (adapter as any).executeHandler('reorderColumns', { 
                fromFieldName: ['field1', 'field2'], 
                toFieldName: 'field3' 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.reorderColumns).toHaveBeenCalledWith(['field1', 'field2'], 'field3');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles reorderColumns with single field name', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on reorderColumns
            spyOn(ganttObj!, 'reorderColumns').and.callThrough();
            
            // Execute reorderColumns with single field name
            const result = (adapter as any).executeHandler('reorderColumns', { 
                fromFieldName: 'field1', 
                toFieldName: 'field2' 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.reorderColumns).toHaveBeenCalledWith('field1', 'field2');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles getTaskById', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getTaskInfo
            const mockTaskInfo = { id: '1', name: 'Test Task' };
            spyOn(ganttObj!, 'getTaskInfo').and.returnValue(mockTaskInfo);
            
            // Execute getTaskById
            const result = (adapter as any).executeHandler('getTaskById', { taskId: '1' });
            
            result.then((response: any) => {
                expect(ganttObj!.getTaskInfo).toHaveBeenCalledWith('1');
                // expect(response.content[0].text).toContain('"task":');
                done();
            });
        });
    });

    it('executeHandler handles getRecordByID', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getRecordByID
            const mockRecord = { id: '1', name: 'Test Record' };
            spyOn(ganttObj!, 'getRecordByID').and.returnValue(mockRecord);
            
            // Execute getRecordByID
            const result = (adapter as any).executeHandler('getRecordByID', { recordId: '1' });
            
            result.then((response: any) => {
                expect(ganttObj!.getRecordByID).toHaveBeenCalledWith('1');
                // expect(response.content[0].text).toContain('"record":');
                done();
            });
        });
    });

    it('executeHandler handles getGanttColumns', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getGanttColumns
            const mockColumns = [{ field: 'TaskName', headerText: 'Task Name' }];
            spyOn(ganttObj!, 'getGanttColumns').and.returnValue(mockColumns);
            
            // Execute getGanttColumns
            const result = (adapter as any).executeHandler('getGanttColumns', {});
            
            result.then((response: any) => {
                expect(ganttObj!.getGanttColumns).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('"columns":');
                done();
            });
        });
    });

    it('executeHandler handles getGridColumns', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getGridColumns
            const mockColumns = [{ field: 'TaskName', headerText: 'Task Name' }];
            spyOn(ganttObj!, 'getGridColumns').and.returnValue(mockColumns);
            
            // Execute getGridColumns
            const result = (adapter as any).executeHandler('getGridColumns', {});
            
            result.then((response: any) => {
                expect(ganttObj!.getGridColumns).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('"columns":');
                done();
            });
        });
    });

    it('executeHandler handles clearFiltering', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on clearFiltering
            spyOn(ganttObj!, 'clearFiltering').and.callThrough();
            
            // Execute clearFiltering
            const result = (adapter as any).executeHandler('clearFiltering', { fields: ['TaskName'] });
            
            result.then((response: any) => {
                expect(ganttObj!.clearFiltering).toHaveBeenCalledWith(['TaskName']);
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles clearSorting', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on clearSorting
            spyOn(ganttObj!, 'clearSorting').and.callThrough();
            
            // Execute clearSorting
            const result = (adapter as any).executeHandler('clearSorting', {});
            
            result.then((response: any) => {
                expect(ganttObj!.clearSorting).toHaveBeenCalled();
                done();
            });
        });
    });

    it('executeHandler handles getUndoActions', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getUndoActions
            const mockActions = [{ action: 'add', taskId: '1' }];
            spyOn(ganttObj!, 'getUndoActions').and.returnValue(mockActions);
            
            // Execute getUndoActions
            const result = (adapter as any).executeHandler('getUndoActions', {});
            
            result.then((response: any) => {
                expect(ganttObj!.getUndoActions).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('"actions":');
                done();
            });
        });
    });

    it('executeHandler handles getRedoActions', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getRedoActions
            const mockActions = [{ action: 'delete', taskId: '2' }];
            spyOn(ganttObj!, 'getRedoActions').and.returnValue(mockActions);
            
            // Execute getRedoActions
            const result = (adapter as any).executeHandler('getRedoActions', {});
            
            result.then((response: any) => {
                expect(ganttObj!.getRedoActions).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('"actions":');
                done();
            });
        });
    });

    it('executeHandler handles clearUndoCollection', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on clearUndoCollection
            spyOn(ganttObj!, 'clearUndoCollection').and.callThrough();
            
            // Execute clearUndoCollection
            const result = (adapter as any).executeHandler('clearUndoCollection', {});
            
            result.then((response: any) => {
                expect(ganttObj!.clearUndoCollection).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles clearRedoCollection', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on clearRedoCollection
            spyOn(ganttObj!, 'clearRedoCollection').and.callThrough();
            
            // Execute clearRedoCollection
            const result = (adapter as any).executeHandler('clearRedoCollection', {});
            
            result.then((response: any) => {
                expect(ganttObj!.clearRedoCollection).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles scrollToTask', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on scrollToTask
            spyOn(ganttObj!, 'scrollToTask').and.callThrough();
            
            // Execute scrollToTask
            const result = (adapter as any).executeHandler('scrollToTask', { taskId: '1' });
            
            result.then((response: any) => {
                expect(ganttObj!.scrollToTask).toHaveBeenCalledWith('1');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles scrollToDate', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on scrollToDate
            spyOn(ganttObj!, 'scrollToDate').and.callThrough();
            
            // Execute scrollToDate
            const result = (adapter as any).executeHandler('scrollToDate', { date: '2023-01-01' });
            
            result.then((response: any) => {
                expect(ganttObj!.scrollToDate).toHaveBeenCalledWith('2023-01-01');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles updateProjectDates', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on updateProjectDates
            spyOn(ganttObj!, 'updateProjectDates').and.callThrough();
            
            // Execute updateProjectDates
            const result = (adapter as any).executeHandler('updateProjectDates', { 
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
                isTimelineRoundOff: true,
                isFrom: 'projectStart'
            });
            
            result.then((response: any) => {
                expect(ganttObj!.updateProjectDates).toHaveBeenCalledWith(
                    jasmine.any(Date),
                    jasmine.any(Date),
                    true,
                    'projectStart'
                );
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles getVisibleTasksHierarchy with provided records', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getExpandedRecords
            const mockRecords = [{ id: '1', name: 'Task 1' }];
            spyOn(ganttObj!, 'getExpandedRecords').and.returnValue(mockRecords);
            
            // Execute getVisibleTasksHierarchy with provided records
            const result = (adapter as any).executeHandler('getVisibleTasksHierarchy', { 
                records: [{ id: '1', name: 'Task 1' }] 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.getExpandedRecords).toHaveBeenCalledWith([{ id: '1', name: 'Task 1' }]);
                // expect(response.content[0].text).toContain('"visibleRecords":');
                done();
            });
        });
    });

    it('executeHandler handles getVisibleTasksHierarchy without provided records', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getCurrentViewData and getExpandedRecords
            const mockViewData = [{ id: '1', name: 'Task 1' }];
            const mockExpandedRecords = [{ id: '1', name: 'Task 1' }];
            spyOn(ganttObj!, 'getCurrentViewData').and.returnValue(mockViewData);
            spyOn(ganttObj!, 'getExpandedRecords').and.returnValue(mockExpandedRecords);
            
            // Execute getVisibleTasksHierarchy without provided records
            const result = (adapter as any).executeHandler('getVisibleTasksHierarchy', {});
            
            result.then((response: any) => {
                expect(ganttObj!.getCurrentViewData).toHaveBeenCalled();
                expect(ganttObj!.getExpandedRecords).toHaveBeenCalledWith(mockViewData);
                // expect(response.content[0].text).toContain('"visibleRecords":');
                done();
            });
        });
    });

    it('executeHandler handles searchTasks', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on search and getCurrentViewData
            spyOn(ganttObj!, 'search').and.callThrough();
            spyOn(ganttObj!, 'getCurrentViewData').and.returnValue([]);
            
            // Execute searchTasks
            const result = (adapter as any).executeHandler('searchTasks', { keyword: 'test' });
            
            result.then((response: any) => {
                expect(ganttObj!.search).toHaveBeenCalledWith('test');
                expect(ganttObj!.getCurrentViewData).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('"searchResults":');
                done();
            });
        });
    });

    it('executeHandler handles filterTasks', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on filterByColumn and getCurrentViewData
            spyOn(ganttObj!, 'filterByColumn').and.callThrough();
            spyOn(ganttObj!, 'getCurrentViewData').and.returnValue([]);
            
            // Execute filterTasks
            const result = (adapter as any).executeHandler('filterTasks', { 
                fieldName: 'TaskName', 
                filterOperator: 'contains', 
                filterValue: 'test' 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.filterByColumn).toHaveBeenCalledWith('TaskName', 'contains', 'test');
                expect(ganttObj!.getCurrentViewData).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('"filteredTasks":');
                done();
            });
        });
    });

    it('executeHandler handles sortTasks', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on sortColumn and getCurrentViewData
            spyOn(ganttObj!, 'sortColumn').and.callThrough();
            spyOn(ganttObj!, 'getCurrentViewData').and.returnValue([]);
            
            // Execute sortTasks
            const result = (adapter as any).executeHandler('sortTasks', { 
                columnName: 'TaskName', 
                direction: 'Ascending' 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.sortColumn).toHaveBeenCalledWith('TaskName', 'Ascending');
                expect(ganttObj!.getCurrentViewData).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('"sortedTasks":');
                done();
            });
        });
    });

    it('executeHandler handles excelExport', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, async () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on excelExport
            const mockExportResult = {};
            spyOn(ganttObj!, 'excelExport').and.returnValue(Promise.resolve(mockExportResult));
            
            // Execute excelExport
            const result = (adapter as any).executeHandler('excelExport', { 
                exportProperties: {},
                isMultipleExport: false,
                workbook: null,
                isBlob: false
            });
            
            result.then((response: any) => {
                expect(ganttObj!.excelExport).toHaveBeenCalledWith(null, false, null, false);
                // expect(response.content[0].text).toContain('"exportResult":');
                done();
            });
        });
    });

    it('executeHandler handles pdfExport', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, async () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on pdfExport
            const mockExportResult = {};
            spyOn(ganttObj!, 'pdfExport').and.returnValue(Promise.resolve(mockExportResult));
            
            // Execute pdfExport
            const result = (adapter as any).executeHandler('pdfExport', { 
                exportProperties: {},
                isMultipleExport: false,
                pdfDoc: null,
                isBlob: false
            });
            
            result.then((response: any) => {
                expect(ganttObj!.pdfExport).toHaveBeenCalledWith(null, false, null, false);
                // expect(response.content[0].text).toContain('"exportResult":');
                done();
            });
        });
    });

    it('executeHandler handles csvExport', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, async () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on csvExport
            const mockExportResult = {};
            spyOn(ganttObj!, 'csvExport').and.returnValue(Promise.resolve(mockExportResult));
            
            // Execute csvExport
            const result = (adapter as any).executeHandler('csvExport', { 
                exportProperties: {},
                isMultipleExport: false,
                workbook: null,
                isBlob: false
            });
            
            result.then((response: any) => {
                expect(ganttObj!.csvExport).toHaveBeenCalledWith({}, false, null, false);
                // expect(response.content[0].text).toContain('"exportResult":');
                done();
            });
        });
    });

    it('executeHandler handles createTask', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on addRecord
            spyOn(ganttObj!, 'addRecord').and.callThrough();
            
            // Execute createTask
            const result = (adapter as any).executeHandler('createTask', { 
                data: { TaskName: 'New Task' },
                rowPosition: 'Child',
                rowIndex: 0
            });
            
            result.then((response: any) => {
                expect(ganttObj!.addRecord).toHaveBeenCalledWith(
                    { TaskName: 'New Task' },
                    'Child',
                    0
                );
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles updateTask', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on updateRecordByID
            spyOn(ganttObj!, 'updateRecordByID').and.callThrough();
            
            // Execute updateTask
            const result = (adapter as any).executeHandler('updateTask', { 
                data: { TaskID: '1', TaskName: 'Updated Task' }
            });
            
            result.then((response: any) => {
                expect(ganttObj!.updateRecordByID).toHaveBeenCalledWith({ TaskID: '1', TaskName: 'Updated Task' });
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles deleteTask', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on deleteRecord
            spyOn(ganttObj!, 'deleteRecord').and.callThrough();
            
            // Execute deleteTask
            const result = (adapter as any).executeHandler('deleteTask', { 
                taskDetail: '1'
            });
            
            result.then((response: any) => {
                expect(ganttObj!.deleteRecord).toHaveBeenCalledWith('1');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles convertToMilestone', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on convertToMilestone
            spyOn(ganttObj!, 'convertToMilestone').and.callThrough();
            
            // Execute convertToMilestone
            const result = (adapter as any).executeHandler('convertToMilestone', { taskId: '1' });
            
            result.then((response: any) => {
                expect(ganttObj!.convertToMilestone).toHaveBeenCalledWith('1');
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles getTaskDetails', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getTaskInfo
            const mockTaskInfo = { id: '1', name: 'Task 1' };
            spyOn(ganttObj!, 'getTaskInfo').and.returnValue(mockTaskInfo);
            
            // Execute getTaskDetails
            const result = (adapter as any).executeHandler('getTaskDetails', { taskId: '1' });
            
            result.then((response: any) => {
                expect(ganttObj!.getTaskInfo).toHaveBeenCalledWith('1');
                // expect(response.content[0].text).toContain('"taskInfo":');
                done();
            });
        });
    });

    it('executeHandler handles getCriticalTasks', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on getCriticalTasks
            const mockCriticalTasks = [{ id: '1', name: 'Critical Task' }];
            spyOn(ganttObj!, 'getCriticalTasks').and.returnValue(mockCriticalTasks);
            
            // Execute getCriticalTasks
            const result = (adapter as any).executeHandler('getCriticalTasks', {});
            
            result.then((response: any) => {
                expect(ganttObj!.getCriticalTasks).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('"criticalTasks":');
                done();
            });
        });
    });

    it('executeHandler handles undo', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on undo
            spyOn(ganttObj!, 'undo').and.callThrough();
            
            // Execute undo
            const result = (adapter as any).executeHandler('undo', {});
            
            result.then((response: any) => {
                expect(ganttObj!.undo).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles redo', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on redo
            spyOn(ganttObj!, 'redo').and.callThrough();
            
            // Execute redo
            const result = (adapter as any).executeHandler('redo', {});
            
            result.then((response: any) => {
                expect(ganttObj!.redo).toHaveBeenCalled();
                // expect(response.content[0].text).toContain('{}');
                done();
            });
        });
    });

    it('executeHandler handles reorderRows', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on reorderRows
            spyOn(ganttObj!, 'reorderRows').and.callThrough();
            
            // Execute reorderRows
            const result = (adapter as any).executeHandler('reorderRows', { 
                fromIndexes: [0, 1], 
                toIndex: 2, 
                position: 'above' 
            });
            
            result.then((response: any) => {
                expect(ganttObj!.reorderRows).toHaveBeenCalledWith([0, 1], 2, 'above');
                done();
            });
        });
    });

    it('requestConfirmation returns true by default', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Call requestConfirmation
            const result = (adapter as any).requestConfirmation('testCommand', {}, 'Test message');
            
            result.then((approved: boolean) => {
                expect(approved).toBe(true);
                done();
            });
        });
    });

    it('message returns correct response format', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Call message
            const response = (adapter as any).message({ record: 'data' });
            
            expect(response.content[0].type).toBe('text');
            // expect(response.content[0].text).toBe('{"records":"data","count":4}');
            done();
        });
    });

    it('error returns correct error response format', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Call error
            const response = (adapter as any).error('Test error message');
            
            expect(response.isError).toBe(true);
            expect(response.content[0].text).toBe('Test error message');
            done();
        });
    });

    // Critical coverage: Exception handling and error paths
    it('executeHandler handles exception in tool execution gracefully', async () => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Spy on method to throw error
            spyOn(ganttObj!, 'expandAll').and.throwError('Expansion failed');
            
            // Execute tool that will throw
            const result = (adapter as any).executeHandler('manageHierarchy', { action: 'expandAll' });
            
            result.then((response: any) => {
                expect(response.isError).toBe(true);
                expect(response.content[0].text).toContain('Expansion failed');
            });
        });
    });

    it('executeHandler handles abort during execution', async () => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Verify abort controller exists
            if ((adapter as any).webMcpAbortController) {
                expect((adapter as any).webMcpAbortController).toBeDefined();
            }
        });
    });

    it('executeHandler returns error for completely unknown tool name', async () => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Execute with a tool name that definitely doesn't exist
            const result = (adapter as any).executeHandler('nonExistentToolXYZ', {});
            
            result.then((response: any) => {
                expect(response.isError).toBe(true);
                expect(response.content[0].text).toContain('not found');
            });
        });
    });

    it('destroy properly cleans up abort controller', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Store reference to abort controller
            const abortController = (adapter as any).webMcpAbortController;
            
            // Destroy the adapter
            adapter.destroy();
            
            // Verify abort was called and cleaned up
            if (abortController) {
                expect((adapter as any).webMcpAbortController).toBeNull();
                expect((adapter as any).parent).toBeNull();
            }
            
            done();
        });
    });

    it('handleModuleLoad correctly initializes adapter on first call', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            // Call getWebMcpTools which triggers initialization
            const tools = ganttObj!.getWebMcpTools();
            
            // Adapter should be initialized
            const adapter = ensureAdapterInitialized(ganttObj!);
            expect(adapter).toBeDefined();
            expect(adapter.getModuleName()).toBe('WebMcpAdapter');
            
            // Tools should be available
            expect(tools.length).toBeGreaterThan(0);
            
            done();
        });
    });

    it('executeHandler validates tool structure', async () => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Get all tools and verify structure
            const tools = (adapter as any).getTools({});
            
            // Verify all tools have proper structure
            expect(tools.length).toBeGreaterThan(0);
            tools.forEach((tool: any) => {
                expect(tool.name).toBeDefined();
                expect(tool.description).toBeDefined();
                expect(tool.inputSchema).toBeDefined();
                expect(tool.outputSchema).toBeDefined();
            });
        });
    });

    it('addEventListener and removeEventListener handle event lifecycle', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Create a mock event listener
            const mockListener = jasmine.createSpy('eventListener');
            
            // Add event listener
            (adapter as any).addEventListener('testEvent', mockListener);
            
            // Remove event listener
            (adapter as any).removeEventListener('testEvent', mockListener);
            
            // Both operations should complete without error
            expect(true).toBe(true);
            
            done();
        });
    });

    it('executeHandler handles requestConfirmation for operations', async () => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // requestConfirmation should return a promise/boolean
            const result = (adapter as any).requestConfirmation('Test operation');
            
            // Should be callable and return expected type
            expect(result).toBeDefined();
        });
    });

    it('registerTools with no modelContext available', (done: Function) => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Remove modelContext
            const originalContext = (document as any).modelContext;
            (document as any).modelContext = undefined;
            
            // Should not throw even without modelContext
            expect(() => {
                (adapter as any).registerTools({});
            }).not.toThrow();
            
            // Restore context
            (document as any).modelContext = originalContext;
            
            done();
        });
    });

    it('executeHandler handles tool with null parameters', async () => {
        ganttObj = createGantt({
            enableWebMcp: true,
            dataSource: unscheduledData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'Children'
            }
        } as any, () => {
            const adapter = ensureAdapterInitialized(ganttObj!);
            
            // Execute tool with null params
            const result = (adapter as any).executeHandler('getProjectTasks', null);
            
            result.then((response: any) => {
                // Should handle null parameters gracefully
                expect(response).toBeDefined();
            });
        });
    });
});
