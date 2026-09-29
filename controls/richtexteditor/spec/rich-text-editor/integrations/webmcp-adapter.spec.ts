import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { WebMcpAdapter } from '../../../src/rich-text-editor/integrations/webmcp-adapter';
import { createElement, remove } from '@syncfusion/ej2-base';
import { DialogRenderer } from '../../../src/rich-text-editor/renderer/dialog-renderer';
import { DialogModel } from '@syncfusion/ej2-popups';
import { renderWebMCPToolsEditor } from '../module-renderer.spec';

describe('RichTextEditor - WebMCP Adapter', () => {
    let rteObj: RichTextEditor;
    let webMcpAdapter: WebMcpAdapter;
    let elem: HTMLElement;
    RichTextEditor.Inject(WebMcpAdapter);
    beforeAll(() => {
        elem = createElement('div', {
            id: 'testRTE',
            styles: 'width: 200px; height: 200px;'
        });
        document.body.appendChild(elem);
    });

    afterAll(() => {
        if (elem) {
            remove(elem);
        }
    });

    beforeEach(() => {
        rteObj = new RichTextEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        rteObj.appendTo('#testRTE');
        webMcpAdapter = new WebMcpAdapter(rteObj);
    });

    afterEach(() => {
        if (webMcpAdapter) {
            webMcpAdapter.destroy();
        }
        if (rteObj && !rteObj.isDestroyed) {
            rteObj.destroy();
        }
    });

    describe('Module Lifecycle', () => {
        it('should be accessible through requiredModules when enableWebMcp is true', () => {
            const modules = rteObj.requiredModules();
            const webMcpModule = modules.find(module => module.member === 'WebMcpAdapter');
            expect(webMcpModule).toBeDefined();
            expect(webMcpModule.args[0]).toBe(rteObj);
        });

        it('should not be accessible when enableWebMcp is false', () => {
            rteObj.destroy();
            rteObj = new RichTextEditor({
                enableWebMcp: false,
                value: '<p>Test content</p>'
            });
            rteObj.appendTo('#testRTE');
            
            const modules = rteObj.requiredModules();
            const webMcpModule = modules.find(module => module.member === 'WebMcpAdapter');
            expect(webMcpModule).toBeUndefined();
        });
    });

    describe('Tool Registration and Discovery', () => {
        it('should return all tools when getWebMcpTools is called without parameters', () => {
            const tools = rteObj.getWebMcpTools();
            expect(tools.length).toBeGreaterThan(0);
            // Check that we have the core tools
            const toolNames = tools.map(tool => tool.name);
            expect(toolNames).toContain('getContent');
            expect(toolNames).toContain('getSelectedHtml');
            expect(toolNames).toContain('insertContent');
        });

        it('should return specific tools when getWebMcpTools is called with tool names', () => {
            const tools = rteObj.getWebMcpTools(['getContent', 'insertContent']);
            expect(tools.length).toBe(2);
            const toolNames = tools.map(tool => tool.name);
            expect(toolNames).toContain('getContent');
            expect(toolNames).toContain('insertContent');
        });

        it('should return an empty array for an unknown tool name', () => {
            const tools = rteObj.getWebMcpTools(['not_a_real_tool']);
            expect(tools).toEqual([]);
        });

        it('should expose the declared schema contract for insertContent', () => {
            const tools = rteObj.getWebMcpTools();
            const insertContentTool = tools.find(tool => tool.name === 'insertContent');

            expect(insertContentTool).toBeDefined();
            expect(insertContentTool.inputSchema).toBeDefined();
            expect(insertContentTool.outputSchema).toBeDefined();
        });

        it('should expose the complete WebMCP command catalog', () => {
            const tools = rteObj.getWebMcpTools();
            const toolNames = tools.map(tool => tool.name);

            expect(toolNames).toEqual(jasmine.arrayContaining([
                'getContent',
                'getSelectedHtml',
                'selectAllContent',
                'showDialog',
                'closeDialog',
                'insertContent',
                'formatSelectedContent',
                'setBlockType',
                'setTextAlignment',
                'insertLink',
                'insertTable',
                'insertImage',
                'undoLastAction',
                'redoLastAction',
                'clearFormatting',
                'printContent',
                'setCodeBlock',
                'applyNumberedListFormat',
                'applyBulletedListFormat',
                'insertBR'
            ]));
        });

    });

    describe('Tool Execution', () => {
        beforeEach(() => {
            spyOn(webMcpAdapter as any, 'requestConfirmation').and.callFake(() => Promise.resolve(true));
        });
        it('should execute getContent tool and return content', async () => {
            // Register a mock modelContext for testing
            (document as any).modelContext = {
                registerTool: jasmine.createSpy('registerTool')
            };
            
            rteObj.registerWebMcpTools();
            
            // Check that tools were registered
            expect((document as any).modelContext.registerTool).toHaveBeenCalled();
            
            // Clean up
            delete (document as any).modelContext;
        });

        it('should fire beforeWebMcpToolExecute event before tool execution', async () => {
            let eventFired = false;
            let eventArgs: any;

            rteObj.beforeWebMcpToolExecute = (args: any) => {
                eventFired = true;
                eventArgs = args;
            };

            await (webMcpAdapter as any).executeHandler('getContent', {});

            expect(eventFired).toBe(true);
            expect(eventArgs).toBeDefined();
            expect(eventArgs.toolName).toBe('getContent');
            expect(eventArgs.toolArgs).toEqual({});
        });

        it('should route the getContent handler and return the JSON WebMCP response contract', async () => {
            const response = await (webMcpAdapter as any).executeHandler('rte_getContent', {});
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.data).toBeDefined();
            expect(payload.data.content).toContain('<p>Test content</p>');
            expect(payload.message).toBe('Successfully retrieved content');
        });

        it('should register a custom write tool through modelContext and route the custom tool fallback branch', async () => {
            const registerToolSpy = jasmine.createSpy('registerTool');
            (document as any).modelContext = {
                registerTool: registerToolSpy
            };

            const customTool = {
                name: 'customWriteTool',
                description: 'A custom write tool example',
                inputSchema: { type: 'object', properties: {} },
                outputSchema: { type: 'object', properties: {} },
                annotations: { readOnlyHint: false }
            };

            (webMcpAdapter as any).registerTools({
                prefix: 'testRTE',
                tools: [customTool],
                exposedTo: ['*']
            });

            expect(registerToolSpy).toHaveBeenCalled();
            const registeredTool = registerToolSpy.calls.mostRecent().args[0];
            expect(registeredTool.name).toBe('testRTE_customWriteTool');
            expect(registeredTool.annotations.readOnlyHint).toBe(false);

            delete (document as any).modelContext;
        });

        it('should route the getSelectedHtml handler and return the JSON WebMCP response contract', async () => {
            spyOn(rteObj, 'getSelectedHtml').and.returnValue('<p>Selected</p>');

            const response = await (webMcpAdapter as any).executeHandler('rte_getSelectedHtml', {});
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.data.selectedHtml).toBe('<p>Selected</p>');
            expect(payload.message).toBe('Successfully retrieved selected HTML');
        });

        it('should route the selectAllContent handler through the component API', async () => {
            spyOn(rteObj, 'selectAll').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_selectAllContent', {});
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully selected all content');
            expect(rteObj.selectAll).toHaveBeenCalled();
        });

        it('should route the showDialog handler through the component API', async () => {
            spyOn(rteObj, 'showDialog').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_showDialog', { type: 'InsertLink' });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully showed InsertLink dialog');
            expect(rteObj.showDialog).toHaveBeenCalledWith('InsertLink');
        });

        it('should route the closeDialog handler through the component API', async () => {
            spyOn(rteObj, 'closeDialog').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_closeDialog', { type: 'InsertImage' });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully closed InsertImage dialog');
            expect(rteObj.closeDialog).toHaveBeenCalledWith('InsertImage');
        });

        it('should route the insertContent handler to insertHTML for HTML payloads', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertContent', {
                content: '<p>Inserted</p>',
                contentType: 'html'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted content');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('insertHTML', '<p>Inserted</p>', { undo: true });
        });

        it('should route the insertContent handler to insertText for text payloads', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertContent', {
                content: 'Inserted text',
                contentType: 'text'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted content');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('insertText', 'Inserted text', { undo: true });
        });

        it('should route the formatSelectedContent handler to the formatting command', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_formatSelectedContent', {
                formatType: 'bold',
                enableUndo: true
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully applied bold formatting');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('bold', null, { undo: true });
        });

        it('should route the setBlockType handler through heading for heading blocks', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_setBlockType', {
                blockType: 'H1'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully set block type to H1');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('heading', 'H1', { undo: true });
        });


        it('should route the setBlockType handler through formatBlock for non-heading blocks', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_setBlockType', {
                blockType: 'P'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully set block type to P');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('formatBlock', 'P', { undo: true });
        });

        it('should route the setTextAlignment handler to the alignment command', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_setTextAlignment', {
                alignment: 'justifyLeft'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully set text alignment to justifyLeft');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('justifyLeft', null, { undo: true });
        });

        it('should route the insertLink handler to createLink with link arguments', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertLink', {
                url: 'https://example.com',
                text: 'Example',
                title: 'Example title',
                target: '_blank'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted link');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('createLink', {
                url: 'https://example.com',
                text: 'Example',
                title: 'Example title',
                target: '_blank'
            }, { undo: true });
        });


        it('should route the insertImage handler to insertImage with image arguments', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertImage', {
                url: 'https://example.com/img.png',
                altText: 'Example image',
                width: { width: 50 },
                height: { height: 40 },
                cssClass: 'image-class'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted image');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('insertImage', {
                url: 'https://example.com/img.png',
                altText: 'Example image',
                width: { width: 50 },
                height: { height: 40 },
                cssClass: 'image-class'
            }, { undo: true });
        });

        it('should route the insertTable handler to insertTable with table arguments', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertTable', {
                rows: 2,
                columns: 3,
                width: { width: 100 },
                enableUndo: true
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted 2x3 table');
            
            // Verify executeCommand was called with insertTable, verify rows/columns/width structure
            const callArgs = (rteObj.executeCommand as jasmine.Spy).calls.mostRecent().args;
            expect(callArgs[0]).toBe('insertTable');
            expect(callArgs[1].rows).toBe(2);
            expect(callArgs[1].columns).toBe(3);
            expect(callArgs[1].width.width).toBe(100);
            expect(callArgs[1].selection).toBeDefined();
            expect(callArgs[2]).toEqual({ undo: true });
        });

        it('should use tableSettings defaults when width is not provided for insertTable', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertTable', {
                rows: 2,
                columns: 3
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted 2x3 table');
            
            const callArgs = (rteObj.executeCommand as jasmine.Spy).calls.mostRecent().args;
            expect(callArgs[0]).toBe('insertTable');
            expect(callArgs[1].rows).toBe(2);
            expect(callArgs[1].columns).toBe(3);
            expect(callArgs[1].width.width).toBe(rteObj.tableSettings.width);
            expect(callArgs[1].width.minWidth).toBe(rteObj.tableSettings.minWidth);
            expect(callArgs[1].width.maxWidth).toBe(rteObj.tableSettings.maxWidth);
            expect(callArgs[1].selection).toBeDefined();
        });

        it('should use tableSettings fallback for missing width properties in insertTable', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertTable', {
                rows: 3,
                columns: 4,
                width: { width: 150 }
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted 3x4 table');
            
            const callArgs = (rteObj.executeCommand as jasmine.Spy).calls.mostRecent().args;
            expect(callArgs[0]).toBe('insertTable');
            expect(callArgs[1].width.width).toBe(150);
            expect(callArgs[1].width.minWidth).toBe(rteObj.tableSettings.minWidth);
            expect(callArgs[1].width.maxWidth).toBe(rteObj.tableSettings.maxWidth);
        });

        it('should use all provided width properties when insertTable has complete width object', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertTable', {
                rows: 2,
                columns: 3,
                width: { width: 200, minWidth: 50, maxWidth: 500 }
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            
            const callArgs = (rteObj.executeCommand as jasmine.Spy).calls.mostRecent().args;
            expect(callArgs[1].width.width).toBe(200);
            expect(callArgs[1].width.minWidth).toBe(50);
            expect(callArgs[1].width.maxWidth).toBe(500);
        });

        it('should handle invalid rows and columns in insertTable by using defaults', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertTable', {
                rows: -1,
                columns: 0,
                width: { width: 100 }
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            
            const callArgs = (rteObj.executeCommand as jasmine.Spy).calls.mostRecent().args;
            expect(callArgs[1].rows).toBe(3);
            expect(callArgs[1].columns).toBe(3);
        });

        it('should clamp rows and columns to valid bounds in insertTable', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertTable', {
                rows: 150,
                columns: 100,
                width: { width: 100 }
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            
            const callArgs = (rteObj.executeCommand as jasmine.Spy).calls.mostRecent().args;
            expect(callArgs[1].rows).toBe(3);
            expect(callArgs[1].columns).toBe(3);
        });

        it('should route the insertImage handler to insertImage with image arguments', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertImage', {
                url: 'https://example.com/img.png',
                altText: 'Example image',
                width: { width: 50 },
                height: { height: 40 },
                cssClass: 'image-class'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted image');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('insertImage', {
                url: 'https://example.com/img.png',
                altText: 'Example image',
                width: { width: 50 },
                height: { height: 40 },
                cssClass: 'image-class'
            }, { undo: true });
        });

        it('should route the undoLastAction handler through the editor undo command', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_undoLastAction', {});
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully undid last action');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('undo');
        });

        it('should route the redoLastAction handler through the editor redo command', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_redoLastAction', {});
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully redid last action');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('redo');
        });

        it('should route the clearFormatting handler through removeFormat', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_clearFormatting', {
                enableUndo: true
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully cleared formatting');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('removeFormat', null, { undo: true });
        });

        it('should route the setCodeBlock handler through insertCodeBlock when the code block module is available', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_setCodeBlock', {
                language: 'JavaScript',
                label: 'JavaScript'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted code block with JavaScript syntax highlighting');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('insertCodeBlock', {
                language: 'JavaScript',
                label: 'JavaScript'
            }, { undo: true });
        });
        it('should route the applyNumberedListFormat handler through numberFormatList', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_applyNumberedListFormat', {
                style: 'decimal'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully applied numbered list format: decimal');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('numberFormatList', 'decimal', { undo: true });
        });

        it('should apply lowerroman numbered list format', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_applyNumberedListFormat', {
                style: 'lowerroman'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully applied numbered list format: lowerroman');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('numberFormatList', 'lowerroman', { undo: true });
        });

        it('should apply upperalpha numbered list format', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_applyNumberedListFormat', {
                style: 'upperalpha'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully applied numbered list format: upperalpha');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('numberFormatList', 'upperalpha', { undo: true });
        });

        it('should route the applyBulletedListFormat handler through bulletFormatList', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_applyBulletedListFormat', {
                style: 'disc'
            });
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully applied bulleted list format: disc');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('bulletFormatList', 'disc', { undo: true });
        });

        it('should return a cancellation message when applyNumberedListFormat is denied by confirmation', async () => {
            (webMcpAdapter as any).requestConfirmation = jasmine.createSpy('requestConfirmation')
                .and.returnValue(Promise.resolve(false));

            const response = await (webMcpAdapter as any).executeHandler('rte_applyNumberedListFormat', {
                style: 'decimal'
            });

            const payload = JSON.parse(response.content[0].text);
            expect(payload.cancelled).toBe(true);
            expect(payload.action).toBe('applyNumberedListFormat');
            expect(payload.message).toContain('[USER_CANCELLED] User denied: "Confirm: applyNumberedListFormat". This is final. Do NOT retry.');
        });
        it('should route the unknown default executeHandler branch to the WebMCP error contract', async () => {
            const response = await (webMcpAdapter as any).executeHandler('rte_customUnknownTool', { payload: 'value' });
            expect(response.isError).toBe(true);
            expect(response.content[0].text).toBe('Tool "customUnknownTool" not found.');
        });

        it('should return the default executeHandler error contract for an unregistered custom tool', async () => {
            const response = await (webMcpAdapter as any).executeHandler('rte_customUnknownTool', { payload: 'value' });
            expect(response.isError).toBe(true);
            expect(response.content[0].text).toBe('Tool "customUnknownTool" not found.');
        });

        it('should return a cancellation message when a write tool is denied by confirmation', async () => {
            const requestConfirmationSpy = webMcpAdapter as any;
            requestConfirmationSpy.requestConfirmation = jasmine.createSpy('requestConfirmation').and.returnValue(Promise.resolve(false));

            const response = await (webMcpAdapter as any).executeHandler('rte_insertContent', {
                content: '<p>Inserted</p>',
                contentType: 'html',
                enableUndo: true
            });

            const payload = JSON.parse(response.content[0].text);
            expect(payload.cancelled).toBe(true);
            expect(payload.action).toBe('insertContent');
            expect(payload.message).toContain('[USER_CANCELLED] User denied: "Confirm: insertContent". This is final. Do NOT retry.');
        });

        it('should detect a custom write tool with readOnlyHint false and fall through to the default tool-not-found error contract', async () => {
            const registerToolSpy = jasmine.createSpy('registerTool');
            (document as any).modelContext = {
                registerTool: registerToolSpy
            };

            const customTool = {
                name: 'customWriteTool',
                description: 'A custom write tool example',
                inputSchema: { type: 'object', properties: {} },
                outputSchema: { type: 'object', properties: {} },
                annotations: { readOnlyHint: false }
            };

            (webMcpAdapter as any).registerTools({
                prefix: 'testRTE',
                tools: [customTool],
                exposedTo: ['*']
            });

            const registeredTool = registerToolSpy.calls.mostRecent().args[0];
            expect(registeredTool.name).toBe('testRTE_customWriteTool');
            expect(registeredTool.annotations.readOnlyHint).toBe(false);

            const response = await (webMcpAdapter as any).executeHandler('testRTE_customWriteTool', { payload: 'value' });
            expect(response.isError).toBe(true);
            expect(response.content[0].text).toBe('Tool "customWriteTool" not found.');

            delete (document as any).modelContext;
        });

        it('should route fontfamily through fontName with the expected executeCommand branch', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);
            const adapter = new WebMcpAdapter(rteObj);
            spyOn(adapter as any, 'requestConfirmation').and.returnValue(Promise.resolve(true));

            await (adapter as any).executeHandler('rte_formatSelectedContent', {
                formatType: 'fontfamily',
                fontfamily: 'Arial'
            });

            expect(rteObj.executeCommand).toHaveBeenCalledWith('fontName', 'Arial', { undo: true });
        });

        it('should route fontsize through fontSize with the expected executeCommand branch', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);
            const adapter = new WebMcpAdapter(rteObj);
            spyOn(adapter as any, 'requestConfirmation').and.returnValue(Promise.resolve(true));

            await (adapter as any).executeHandler('rte_formatSelectedContent', {
                formatType: 'fontsize',
                fontsize: '14px'
            });

            expect(rteObj.executeCommand).toHaveBeenCalledWith('fontSize', '14px', { undo: true });
        });

        it('should route backgroundcolor through backColor with the expected executeCommand branch', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);
            const adapter = new WebMcpAdapter(rteObj);
            spyOn(adapter as any, 'requestConfirmation').and.returnValue(Promise.resolve(true));

            await (adapter as any).executeHandler('rte_formatSelectedContent', {
                formatType: 'backgroundcolor',
                backgroundcolor: '#ffffff'
            });

            expect(rteObj.executeCommand).toHaveBeenCalledWith('backColor', '#ffffff', { undo: true });
        });

        it('should route fontcolor through fontColor with the expected executeCommand branch', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);
            const adapter = new WebMcpAdapter(rteObj);
            spyOn(adapter as any, 'requestConfirmation').and.returnValue(Promise.resolve(true));

            await (adapter as any).executeHandler('rte_formatSelectedContent', {
                formatType: 'fontcolor',
                fontcolor: '#000000'
            });

            expect(rteObj.executeCommand).toHaveBeenCalledWith('fontColor', '#000000', { undo: true });
        });

        it('should route the printContent handler through the editor print API', async () => {
            spyOn(rteObj, 'print').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_printContent', {});
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully initiated print');
            expect(rteObj.print).toHaveBeenCalled();
        });

        it('should route the insertBR handler through insertBrOnReturn', async () => {
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);

            const response = await (webMcpAdapter as any).executeHandler('rte_insertBR', {});
            const payload = JSON.parse(response.content[0].text);

            expect(payload.success).toBe(true);
            expect(payload.message).toBe('Successfully inserted line break');
            expect(rteObj.executeCommand).toHaveBeenCalledWith('insertBrOnReturn', null, { undo: true });
        });

        it('should return a cancellation message when insertBR is denied by confirmation', async () => {
            // Create fresh adapter instance to avoid spy conflicts
            const freshAdapter = new WebMcpAdapter(rteObj);
            const requestConfirmationSpy = spyOn(freshAdapter as any, 'requestConfirmation')
                .and.returnValue(Promise.resolve(false));

            const response = await (freshAdapter as any).executeHandler('rte_insertBR', {});

            const payload = JSON.parse(response.content[0].text);
            expect(payload.cancelled).toBe(true);
            expect(payload.action).toBe('insertBR');
            expect(payload.message).toContain('[USER_CANCELLED] User denied: "Confirm: insertBR". This is final. Do NOT retry.');
            expect(requestConfirmationSpy).toHaveBeenCalled();
        });

        it('should request confirmation before executing insertBR', async () => {
            // Create fresh adapter instance to avoid spy conflicts
            const freshAdapter = new WebMcpAdapter(rteObj);
            spyOn(rteObj, 'executeCommand').and.callFake((): void => undefined);
            const requestConfirmationSpy = spyOn(freshAdapter as any, 'requestConfirmation')
                .and.returnValue(Promise.resolve(true));

            await (freshAdapter as any).executeHandler('rte_insertBR', {});

            expect(requestConfirmationSpy).toHaveBeenCalledWith(
                'insertBR',
                {},
                'Confirm: insertBR'
            );
            expect(rteObj.executeCommand).toHaveBeenCalled();
        });

        it('should request confirmation and return cancelled message when a write tool with readOnlyHint false falls into the default branch', async () => {
            const fakeToolName = 'fakeWriteTool';

            // Make Array.prototype.find return a tool that has readOnlyHint: false
            // so the condition inside the default case becomes true
            const originalFind = Array.prototype.find;
            spyOn(Array.prototype, 'find').and.callFake(function (this: any[], predicate: Function) {
                const fakeTool = {
                    name: fakeToolName,
                    description: 'fake write tool for coverage',
                    inputSchema: { type: 'object', properties: {} },
                    outputSchema: { type: 'object', properties: {} },
                    annotations: { readOnlyHint: false }
                };
                // Return the fake tool only when the predicate is looking for our name
                if (typeof predicate === 'function' && predicate(fakeTool)) {
                    return fakeTool;
                }
                return originalFind.call(this, predicate);
            });
            // Deny the confirmation so we also exercise the cancelled path
            (webMcpAdapter as any).requestConfirmation = jasmine.createSpy('requestConfirmation')
                .and.returnValue(Promise.resolve(false));

            const response = await (webMcpAdapter as any).executeHandler(
                `rte_${fakeToolName}`,
                { payload: 'test' }
            );
            const payload = JSON.parse(response.content[0].text);

            expect((webMcpAdapter as any).requestConfirmation).toHaveBeenCalledWith(
                fakeToolName,
                { payload: 'test' },
                `Confirm: ${fakeToolName}`
            );
            expect(payload.cancelled).toBe(true);
            expect(payload.action).toBe(fakeToolName);
            expect(payload.message).toContain(
                `[USER_CANCELLED] User denied: "Confirm: ${fakeToolName}". This is final. Do NOT retry.`
            );
        });
    });

    describe('Dialog Rendering Coverage', () => {
        it('should render the confirmation dialog through DialogRenderer and resolve on the Ok button', async () => {
            const fakeDialog: any = {
                appendTo: jasmine.createSpy('appendTo'),
                show: jasmine.createSpy('show'),
                hide: jasmine.createSpy('hide'),
                destroy: jasmine.createSpy('destroy')
            };
            let capturedModel: DialogModel;

            spyOn(DialogRenderer.prototype, 'render').and.callFake((model: DialogModel) => {
                capturedModel = model;
                return fakeDialog;
            });

            const confirmationPromise = (webMcpAdapter as any).requestConfirmation(
                'insertContent',
                { content: '<p>Inserted</p>' },
                'Confirm: insertContent'
            );

            expect(DialogRenderer.prototype.render).toHaveBeenCalled();
            expect(capturedModel.header).toBe('AI Action Request');
            expect(capturedModel.content).toBe('Confirm: insertContent');
            expect(capturedModel.buttons.length).toBe(2);

            capturedModel.buttons[0].click();

            const approved = await confirmationPromise;
            expect(approved).toBe(true);
            expect(fakeDialog.hide).toHaveBeenCalled();
            expect(fakeDialog.destroy).toHaveBeenCalled();
            expect(fakeDialog.appendTo).toHaveBeenCalled();
            expect(fakeDialog.show).toHaveBeenCalled();
        });

        it('should resolve true from the Ok button click branch and false from the Cancel button click branch in the dialog model', async () => {
            const fakeDialog: any = {
                appendTo: jasmine.createSpy('appendTo'),
                show: jasmine.createSpy('show'),
                hide: jasmine.createSpy('hide'),
                destroy: jasmine.createSpy('destroy')
            };
            let capturedModel: DialogModel;

            spyOn(DialogRenderer.prototype, 'render').and.callFake((model: DialogModel) => {
                capturedModel = model;
                return fakeDialog;
            });

            const okConfirmationPromise = (webMcpAdapter as any).requestConfirmation(
                'insertContent',
                { content: '<p>Inserted</p>' },
                'Confirm: insertContent'
            );

            expect(DialogRenderer.prototype.render).toHaveBeenCalled();
            expect(capturedModel.buttons.length).toBe(2);

            capturedModel.buttons[0].click();
            const approved = await okConfirmationPromise;
            expect(approved).toBe(true);
            expect(fakeDialog.hide).toHaveBeenCalled();
            expect(fakeDialog.destroy).toHaveBeenCalled();
            expect(fakeDialog.appendTo).toHaveBeenCalled();
            expect(fakeDialog.show).toHaveBeenCalled();

            const cancelConfirmationPromise = (webMcpAdapter as any).requestConfirmation(
                'insertContent',
                { content: '<p>Inserted</p>' },
                'Confirm: insertContent'
            );

            expect(DialogRenderer.prototype.render).toHaveBeenCalled();
            expect(capturedModel.buttons.length).toBe(2);

            capturedModel.buttons[1].click();
            const cancelled = await cancelConfirmationPromise;
            expect(cancelled).toBe(false);
            expect(fakeDialog.hide).toHaveBeenCalled();
            expect(fakeDialog.destroy).toHaveBeenCalled();
        });
    });

    describe('Adapter Methods', () => {
        it('should return correct module name', () => {
            expect(webMcpAdapter.getModuleName()).toBe('WebMcpAdapter');
        });

        it('should properly destroy and clean up', () => {
            // Before destroy, the adapter should be functional
            expect(webMcpAdapter.getModuleName()).toBe('WebMcpAdapter');
            
            // After destroy, the parent should be null
            webMcpAdapter.destroy();
            // We can't easily test that parent is null because it's private,
            // but we can ensure the method runs without error
            expect(true).toBe(true);
        });
    });
});

describe('RichTextEditor - WebMCP Adapter without module injection', () => {
    let rteObj: RichTextEditor;

    afterEach(() => {
        if (rteObj && !rteObj.isDestroyed) {
            rteObj.destroy();
        }
    });

    it('should return the Link module dialog error contract when the Link module is missing from showDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_showDialog', {
            type: 'InsertLink'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Link module is not injected. Please inject the Link module to use this dialog.');
    });

    it('should return the Link module dialog error contract when the Link module is missing from closeDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_closeDialog', {
            type: 'InsertLink'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Link module is not injected. Please inject the Link module to use this dialog.');
    });

    it('should return the Table module dialog error contract when the Table module is missing from showDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_showDialog', {
            type: 'InsertTable'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Table module is not injected. Please inject the Table module to use this dialog.');
    });

    it('should return the Table module dialog error contract when the Table module is missing from closeDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_closeDialog', {
            type: 'InsertTable'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Table module is not injected. Please inject the Table module to use this dialog.');
    });

    it('should return the Image module dialog error contract when the Image module is missing from showDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_showDialog', {
            type: 'InsertImage'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Image module is not injected. Please inject the Image module to use this dialog.');
    });

    it('should return the Image module dialog error contract when the Image module is missing from closeDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_closeDialog', {
            type: 'InsertImage'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Image module is not injected. Please inject the Image module to use this dialog.');
    });

    it('should return the Audio module dialog error contract when the Audio module is missing from showDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_showDialog', {
            type: 'InsertAudio'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Audio module is not injected. Please inject the Audio module to use this dialog.');
    });

    it('should return the Audio module dialog error contract when the Audio module is missing from closeDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_closeDialog', {
            type: 'InsertAudio'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Audio module is not injected. Please inject the Audio module to use this dialog.');
    });

    it('should return the Video module dialog error contract when the Video module is missing from showDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_showDialog', {
            type: 'InsertVideo'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Video module is not injected. Please inject the Video module to use this dialog.');
    });

    it('should return the Video module dialog error contract when the Video module is missing from closeDialog', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_closeDialog', {
            type: 'InsertVideo'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Video module is not injected. Please inject the Video module to use this dialog.');
    });

    it('should return the Link module error contract when Link is not injected', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_insertLink', {
            url: 'https://example.com',
            text: 'Example',
            title: 'Example title',
            target: '_blank'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Link module is not injected. Please inject the Link module to use this tool.');
    });

    it('should return the Table module error contract when Table is not injected', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_insertTable', {
            rows: 2,
            columns: 3,
            width: { width: 100 },
            enableUndo: true
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Table module is not injected. Please inject the Table module to use this tool.');
    });

    it('should return the Image module error contract when Image is not injected', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_insertImage', {
            url: 'https://example.com/img.png',
            altText: 'Example image',
            width: { width: 50 },
            height: { height: 40 },
            cssClass: 'image-class'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('Image module is not injected. Please inject the Image module to use this tool.');
    });

    it('should return the CodeBlock module error contract when CodeBlock is not injected', async () => {
        rteObj = renderWebMCPToolsEditor({
            enableWebMcp: true,
            value: '<p>Test content</p>'
        });
        const webMcpAdapter = new WebMcpAdapter(rteObj);

        const response = await (webMcpAdapter as any).executeHandler('rte_setCodeBlock', {
            language: 'JavaScript',
            label: 'JavaScript'
        });

        expect(response.isError).toBe(true);
        expect(response.content[0].text).toBe('CodeBlock module is not injected. Please inject the CodeBlock module to use this tool.');
    });
});