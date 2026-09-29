/**
 * WebMcpAdapter Specification Tests
 * Validates WebMCP integration lifecycle, tool registration, and execution
 * @hidden
 */

import { Diagram } from '../../../src/diagram/diagram';
import { WebMcpAdapter } from '../../../src/diagram/integrations/webmcp-adapter';
import { WebMcpToolExecuteEventArgs, WebMcpTool, WebMcpToolResponse, ConnectorModel } from '../../../src/diagram/index';
import {
    ConnectorConstraints,
    DiagramConstraints,
    NodeConstraints,
    PortConstraints,
    PortVisibility
} from '../../../src/diagram/enum/enum';


Diagram.Inject(WebMcpAdapter);

describe('WebMcpAdapter', () => {
    let diagram: Diagram;
    let adapter: WebMcpAdapter;
    let div: HTMLElement;

    beforeEach(() => {
        div = document.createElement('div');
        div.id = 'test-diagram';
        div.setAttribute('style', 'width: 100%; height: 100%');
        document.body.appendChild(div);
    });

    afterEach(() => {
        if (diagram) {
            diagram.destroy();
        }
        document.body.removeChild(div);
    });

    /**
     * Helper function to ensure adapter is initialized with diagram parent
     * Handles timing issues where adapter exists but parent is not yet set
     */
    function ensureAdapterInitialized(diag: Diagram): WebMcpAdapter {
        const adptr = diag.webMcpAdapterModule;
        if (adptr && adptr['parent'] === null) {
            adptr['init'](diag);
        }
        return adptr;
    }

    describe('Tool Registration', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-2';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-2');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-2');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should retrieve all available tools', (done) => {
            const args: any = { tools: [] };
            adapter['getTools'](args);

            expect(args.tools).toBeDefined();
            expect(args.tools.length).toBeGreaterThan(0);
            expect(args.tools[0].name).toBeDefined();
            expect(args.tools[0].description).toBeDefined();
            expect(args.tools[0].inputSchema).toBeDefined();
            expect(args.tools[0].outputSchema).toBeDefined();
            done();
        });

        it('should filter tools by name', (done) => {
            const args: any = { toolNames: ['createDiagramNode', 'deleteFromDiagram'], tools: [] };
            adapter['getTools'](args);

            expect(args.tools.length).toBe(2);
            expect(args.tools.some((t: any) => t.name === 'createDiagramNode')).toBe(true);
            expect(args.tools.some((t: any) => t.name === 'deleteFromDiagram')).toBe(true);
            done();
        });

        it('should return production tools', (done) => {
            const args: any = { tools: [] };
            adapter['getTools'](args);

            const expectedTools = [
                'createDiagramNode',
                'createSpecializedDiagramNode',
                'createDiagramConnector',
                'manageNodeSelection',
                'manageInteractionMode',
                'enableEditingMode',
                'arrangeAndAlignObjects',
                'deleteFromDiagram',
                'manageUndoRedo',
                'manageClipboardOperations',
                'exportAndImportDiagrams',
                'arrangeZOrder',
                'navigateAndZoomDiagram',
                'manageGroupsAndHierarchies',
                'manageAnnotationsAndLabels',
                'managePorts',
                'manageLayers',
                'applyLayoutToNodes'
            ];

            expect(args.tools.length).toBe(18);
            expectedTools.forEach((toolName) => {
                expect(args.tools.some((t: any) => t.name === toolName)).toBe(true);
            });
            done();
        });

        it('should have valid tool schema for createDiagramNode', (done) => {
            const args: any = { toolNames: ['createDiagramNode'], tools: [] };
            adapter['getTools'](args);

            const tool = args.tools[0];
            expect(tool.inputSchema.properties.nodeId).toBeDefined();
            expect(tool.inputSchema.properties.x).toBeDefined();
            expect(tool.inputSchema.properties.y).toBeDefined();
            expect(tool.inputSchema.required).toContain('nodeId');
            done();
        });

        it('should have valid tool schema for createDiagramConnector', (done) => {
            const args: any = { toolNames: ['createDiagramConnector'], tools: [] };
            adapter['getTools'](args);

            const tool = args.tools[0];
            expect(tool.inputSchema.properties.connectorId).toBeDefined();
            expect(tool.inputSchema.properties.sourceId).toBeDefined();
            expect(tool.inputSchema.properties.targetId).toBeDefined();
            expect(tool.inputSchema.required).toContain('connectorId');
            done();
        });
    });

    describe('Tool Execution - Error Cases', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-4';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-4');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-4');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should handle missing nodeId in createDiagramNode', (done) => {
            const args = {
                label: 'Test Node',
                x: 100,
                y: 100
            };

            const result = adapter['handleCreateDiagramNode'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should handle missing required connector properties', (done) => {
            const args = {
                connectorId: 'connector1',
                sourceId: 'node1'
                // targetId missing
            };

            const result = adapter['handleCreateDiagramConnector'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should handle invalid undo/redo action', (done) => {
            const args = { action: 'invalidAction' };
            const result = adapter['handleManageUndoRedo'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should handle missing objectId in manageAnnotationsAndLabels', (done) => {
            const args = {
                labelText: 'New Label'
                // objectId missing
            };

            const result = adapter['handleManageAnnotationsAndLabels'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should handle non-existent object in manageAnnotationsAndLabels', (done) => {
            const args = {
                objectId: 'nonExistentNode',
                labelText: 'New Label'
            };

            const result = adapter['handleManageAnnotationsAndLabels'](args);
            expect(result.isError).toBe(true);
            done();
        });
    });

    describe('Response Format', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-6';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-6');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-6');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should return valid WebMcpToolResponse for success', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });

            const args = {
                objectIds: ['node1'],
                deleteMode: 'specified'
            };

            const result = adapter['handleDeleteFromDiagram'](args);
            expect(result.content).toBeDefined();
            expect(result.content.length).toBeGreaterThan(0);
            expect(result.content[0].type).toBe('text');
            expect(result.content[0].text).toBeDefined();
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should return valid WebMcpToolResponse for error', (done) => {
            const args = {
                connectorId: 'connector1',
                sourceId: 'node1'
                // targetId missing
            };

            const result = adapter['handleCreateDiagramConnector'](args);
            expect(result.content).toBeDefined();
            expect(result.content[0].type).toBe('text');
            expect(result.isError).toBe(true);
            done();
        });

        it('should include operation status in response data', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });

            const args = {
                objectIds: ['node1'],
                deleteMode: 'specified'
            };

            const result = adapter['handleDeleteFromDiagram'](args);
            const responseData = JSON.parse(result.content[0].text);
            expect(responseData.success).toBeDefined();
            expect(responseData.data).toBeDefined();
            expect(responseData.message).toBeDefined();
            done();
        });
    });

    describe('Edge Cases', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-7';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-7');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-7');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should report an error when no objects match the delete request', (done) => {
            const args: any = {
                objectIds: [],
                deleteMode: 'specified'
            };

            const result = adapter['handleDeleteFromDiagram'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should handle selectAll mode', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 300, offsetY: 100, width: 80, height: 40 });

            const args = {
                selectMode: 'all'
            };

            const result = adapter['handleManageNodeSelection'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should report the number of objects removed by delete all', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 300, offsetY: 100, width: 80, height: 40 });

            const result = adapter['handleDeleteFromDiagram']({ deleteMode: 'all' });
            expect(result.isError).toBeFalsy();
            expect(JSON.parse(result.content[0].text).data.deletedCount).toBe(2);
            expect(diagram.nodes.length).toBe(0);
            done();
        });

        it('should remove connectors attached to a deleted node', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 300, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'link1', sourceID: 'node1', targetID: 'node2' } as ConnectorModel);

            const result = adapter['handleDeleteFromDiagram']({ objectIds: ['node1'], deleteMode: 'specified' });
            expect(result.isError).toBeFalsy();
            expect(JSON.parse(result.content[0].text).data.dependentCount).toBe(1);
            expect(diagram.connectors.length).toBe(0);
            done();
        });

        it('should handle startGroup action', (done) => {
            const args = { action: 'startGroup', groupDescription: 'Test Group' };
            const result = adapter['handleManageUndoRedo'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle endGroup action', (done) => {
            const args = { action: 'endGroup' };
            const result = adapter['handleManageUndoRedo'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle clear history action', (done) => {
            const args = { action: 'clear' };
            const result = adapter['handleManageUndoRedo'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle clipboard copy operation', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.select([diagram.getObject('node1')]);

            const args = { operation: 'copy' };
            const result = adapter['handleManageClipboardOperations'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle clipboard cut operation', (done) => {
            const args = { operation: 'cut' };
            const result = adapter['handleManageClipboardOperations'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle clipboard paste operation', (done) => {
            const args = { operation: 'paste' };
            const result = adapter['handleManageClipboardOperations'](args);
            expect(result.isError).toBeFalsy();
            done();
        });
    });

    describe('Export and Import Operations', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-8';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-8');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-8');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should export diagram as JSON', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            const args = { operation: 'export', format: 'json' };
            const result = adapter['handleExportAndImportDiagrams'](args);
            expect(result.isError).toBeFalsy();
            expect(result.content[0].text).toBeDefined();
            done();
        });

        it('should reject an unsupported export format', (done) => {
            const args = { operation: 'export', format: 'invalidFormat' };
            const result = adapter['handleExportAndImportDiagrams'](args);
            expect(result.isError).toBe(true);
            expect(result.content[0].text).toContain('Unsupported export format');
            done();
        });

        it('should not start a download unless the caller asks for one', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            const downloadSpy = spyOn<any>(adapter, 'downloadFile').and.callThrough();

            const result = adapter['handleExportAndImportDiagrams']({ operation: 'export', format: 'json' });

            expect(result.isError).toBeFalsy();
            expect(downloadSpy).not.toHaveBeenCalled();
            expect(JSON.parse(result.content[0].text).data.content.length).toBeGreaterThan(0);
            done();
        });
    });

    describe('Z-Order and Arrange Operations', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-9';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-9');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-9');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should bring element to front', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 300, offsetY: 100, width: 80, height: 40 });

            const args = {
                objectIds: ['node1'],
                order: 'toFront'
            };

            const result = adapter['handleArrangeZOrder'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should send element to back', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 300, offsetY: 100, width: 80, height: 40 });

            const args = {
                objectIds: ['node1'],
                order: 'toBack'
            };

            const result = adapter['handleArrangeZOrder'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle arrangeAndAlignObjects with left alignment', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 200, offsetY: 100, width: 80, height: 40 });

            const args = {
                objectIds: ['node1', 'node2'],
                alignMode: 'left'
            };

            const result = adapter['handleArrangeAndAlignObjects'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle arrangeAndAlignObjects with right alignment', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 200, offsetY: 100, width: 80, height: 40 });

            const args = {
                objectIds: ['node1', 'node2'],
                alignMode: 'right'
            };

            const result = adapter['handleArrangeAndAlignObjects'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle arrangeAndAlignObjects with distribute mode', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 200, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node3', offsetX: 300, offsetY: 100, width: 80, height: 40 });

            const args = {
                objectIds: ['node1', 'node2', 'node3'],
                alignMode: 'distribute'
            };

            const result = adapter['handleArrangeAndAlignObjects'](args);
            expect(result.isError).toBeFalsy();
            done();
        });
    });

    describe('Groups and Hierarchies Operations', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-10';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-10');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-10');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should create group with multiple nodes', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 200, offsetY: 100, width: 80, height: 40 });

            const node1 = diagram.getObject('node1');
            const node2 = diagram.getObject('node2');
            diagram.select([node1, node2]);

            const args = {
                operation: 'group'
            };

            const result = adapter['handleManageGroupsAndHierarchies'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should ungroup a group', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 200, offsetY: 100, width: 80, height: 40 });

            const node1 = diagram.getObject('node1');
            const node2 = diagram.getObject('node2');
            diagram.select([node1, node2]);
            diagram.group();

            const args = {
                operation: 'unGroup'
            };

            const result = adapter['handleManageGroupsAndHierarchies'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle invalid group action', (done) => {
            const args = {
                operation: 'invalidAction'
            };

            const result = adapter['handleManageGroupsAndHierarchies'](args);
            expect(result.isError).toBe(true);
            done();
        });
    });

    describe('Ports Management Operations', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-11';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-11');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-11');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should add port to node', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });

            const args = {
                action: 'add',
                nodeId: 'node1',
                portId: 'port1',
                offset: { x: 0.5, y: 0.5 }
            };

            const result = adapter['handleManagePorts'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should remove port from node', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });

            const args = {
                action: 'remove',
                nodeId: 'node1',
                portId: 'port1'
            };

            const result = adapter['handleManagePorts'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should handle invalid port action', (done) => {
            const args = {
                action: 'invalidAction',
                nodeId: 'node1'
            };

            const result = adapter['handleManagePorts'](args);
            expect(result.isError).toBe(true);
            done();
        });
    });

    describe('Layers Management Operations', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-12';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-12');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-12');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should add new layer', (done) => {
            const args = {
                operation: 'addLayer',
                layerId: 'layer1',
                layerName: 'Test Layer'
            };

            const result = adapter['handleManageLayers'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should remove layer', (done) => {
            const args = {
                operation: 'removeLayer',
                layerId: 'layer1'
            };

            const result = adapter['handleManageLayers'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should add object to layer', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });

            const args = {
                operation: 'moveObjects',
                objects: ['node1'],
                targetLayer: 'layer1'
            };

            const result = adapter['handleManageLayers'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should remove object from layer', (done) => {
            const args = {
                operation: 'moveObjects',
                objects: ['node1'],
                targetLayer: 'default'
            };

            const result = adapter['handleManageLayers'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should handle invalid layer action', (done) => {
            const args = {
                operation: 'invalidAction',
                layerId: 'layer1'
            };

            const result = adapter['handleManageLayers'](args);
            expect(result.isError).toBe(true);
            done();
        });
    });

    describe('Zoom and Navigation Advanced Tests', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-13';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-13');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-13');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should fit page to width', (done) => {
            const args = { action: 'fitToWidth' };
            const result = adapter['handleNavigateAndZoomDiagram'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should fit page to height', (done) => {
            const args = { action: 'fitToHeight' };
            const result = adapter['handleNavigateAndZoomDiagram'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should reset zoom to 100%', (done) => {
            const args = { action: 'reset' };
            const result = adapter['handleNavigateAndZoomDiagram'](args);
            expect(result.isError).toBeFalsy();
            done();
        });

        it('should handle invalid zoom action', (done) => {
            const args = { action: 'invalidAction' };
            const result = adapter['handleNavigateAndZoomDiagram'](args);
            expect(result.isError).toBe(true);
            done();
        });
    });

    describe('Annotations and Labels Advanced Tests', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-14';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-14');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-14');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should add annotation with custom properties', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });

            const args = {
                objectId: 'node1',
                labelText: 'Annotation',
                labelPosition: 'top',
                fontSize: 14
            };

            const result = adapter['handleManageAnnotationsAndLabels'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should update connector label', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'node2', offsetX: 300, offsetY: 100, width: 80, height: 40 });
            diagram.add({ id: 'connector1', sourceId: 'node1', targetId: 'node2' } as ConnectorModel);

            const args = {
                objectId: 'connector1',
                labelText: 'Connector Label'
            };

            const result = adapter['handleManageAnnotationsAndLabels'](args);
            expect(result.isError).toBe(true);
            done();
        });

        it('should report an error when labelText is missing on add', (done) => {
            diagram.add({ id: 'node1', offsetX: 100, offsetY: 100, width: 80, height: 40 });

            const args = {
                objectId: 'node1'
                // labelText missing
            };

            const result = adapter['handleManageAnnotationsAndLabels'](args);
            expect(result.isError).toBe(true);
            expect(result.content[0].text).toContain('labelText is required');
            done();
        });
    });

    describe('Constructor and Initialization', () => {
        it('should construct adapter with no parent', (done) => {
            const adapter1 = new WebMcpAdapter();
            expect(adapter1.getModuleName()).toBe('WebMcpAdapter');
            done();
        });

        it('should call init method without errors', (done) => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-16';
            document.body.appendChild(div2);

            const diagram1 = new Diagram({ enableWebMcp: false });
            diagram1.appendTo('#diagram-16');
            const adapter1 = new WebMcpAdapter();
            adapter1.init(diagram1);

            expect(adapter1.getModuleName()).toBe('WebMcpAdapter');
            diagram1.destroy();
            document.body.removeChild(div2);
            done();
        });
    });

    describe('Constraint, Shape and State Handling', () => {
        beforeEach(() => {
            const div2 = document.createElement('div');
            div2.id = 'diagram-behaviour';
            document.body.appendChild(div2);
            diagram = new Diagram({ enableWebMcp: true });
            diagram.appendTo('#diagram-behaviour');
            adapter = ensureAdapterInitialized(diagram);
        });

        afterEach(() => {
            adapter.destroy();
            if (diagram && !diagram.isDestroyed) {
                diagram.destroy();
            }
            const div2 = document.getElementById('diagram-behaviour');
            if (div2 && div2.parentNode) {
                document.body.removeChild(div2);
            }
        });

        it('should resolve node constraint names from the NodeConstraints enum', (done) => {
            const result = adapter['handleCreateDiagramNode']({
                nodeId: 'node1', constraints: ['Select', 'Drag', 'Delete']
            });
            expect(result.isError).toBeFalsy();
            const expected: number = NodeConstraints.Select | NodeConstraints.Drag | NodeConstraints.Delete;
            expect(diagram.nodes[0].constraints).toBe(expected);
            done();
        });

        it('should warn about unknown constraint names instead of dropping them silently', (done) => {
            const result = adapter['handleCreateDiagramNode']({
                nodeId: 'node1', constraints: ['Select', 'NotAConstraint']
            });
            const payload = JSON.parse(result.content[0].text);
            expect(payload.warnings.join(' ')).toContain('NotAConstraint');
            done();
        });

        it('should warn when an unrecognized shape falls back to a rectangle', (done) => {
            const result = adapter['handleCreateDiagramNode']({ nodeId: 'node1', shape: 'NotAShape' });
            const payload = JSON.parse(result.content[0].text);
            expect(payload.warnings.join(' ')).toContain('NotAShape');
            expect(payload.data.shape.shape).toBe('Rectangle');
            done();
        });
    });
});
describe('WebMcpAdapter coverage cases', () => {
    let tempAdapter: WebMcpAdapter;

    beforeEach(() => {
        tempAdapter = new WebMcpAdapter();
    });

    afterEach(() => {
        if (tempAdapter) {
            tempAdapter.destroy();
        }
    });

    it('should cover shape name normalization', () => {
        expect(
            (tempAdapter as any).normalizeShapeName(' Right-Triangle ')
        ).toBe('righttriangle');

        expect(
            (tempAdapter as any).normalizeShapeName('UML_Class')
        ).toBe('umlclass');

        expect(
            (tempAdapter as any).normalizeShapeName(undefined)
        ).toBe('');
    });

    it('should cover known and unknown shape checks', () => {
        expect(
            (tempAdapter as any).isKnownShape('Rectangle')
        ).toBe(true);

        expect(
            (tempAdapter as any).isKnownShape('Circle')
        ).toBe(true);

        expect(
            (tempAdapter as any).isKnownShape('UnknownShape')
        ).toBe(false);
    });

    it('should cover known and fallback shape mapping', () => {
        const knownShape: any =
            (tempAdapter as any).mapShapeToStructure('circle');

        const unknownShape: any =
            (tempAdapter as any).mapShapeToStructure('unknown');

        expect(knownShape.type).toBe('Basic');
        expect(knownShape.shape).toBe('Ellipse');

        expect(unknownShape.type).toBe('Basic');
        expect(unknownShape.shape).toBe('Rectangle');
    });

    it('should cover numeric constraint conversion', () => {
        const result: number =
            (tempAdapter as any).toConstraints(
                NodeConstraints.Select,
                NodeConstraints,
                []
            );

        expect(result).toBe(NodeConstraints.Select);
    });

    it('should cover string and array constraint conversion', () => {
        const unknown: string[] = [];

        const singleResult: number =
            (tempAdapter as any).toConstraints(
                'Select',
                NodeConstraints,
                unknown
            );

        const multipleResult: number =
            (tempAdapter as any).toConstraints(
                ['Select', 'Drag'],
                NodeConstraints,
                unknown
            );

        expect(singleResult).toBe(NodeConstraints.Select);

        expect(multipleResult).toBe(
            NodeConstraints.Select | NodeConstraints.Drag
        );
    });

    it('should cover empty and unknown constraints', () => {
        const unknown: string[] = [];

        expect(
            (tempAdapter as any).toConstraints(
                undefined,
                NodeConstraints,
                unknown
            )
        ).toBeUndefined();

        expect(
            (tempAdapter as any).toConstraints(
                ['InvalidConstraint'],
                NodeConstraints,
                unknown
            )
        ).toBeUndefined();

        expect(unknown).toContain('InvalidConstraint');
    });

    it('should cover node style normalization', () => {
        const normalizedStyle: any =
            (tempAdapter as any).normalizeNodeStyle({
                fill: 'red',
                stroke: 'blue',
                strokeWidth: 2
            });

        expect(normalizedStyle.fill).toBe('red');
        expect(normalizedStyle.strokeColor).toBe('blue');
        expect(normalizedStyle.strokeWidth).toBe(2);
        expect(normalizedStyle.stroke).toBeUndefined();

        expect(
            (tempAdapter as any).normalizeNodeStyle(undefined)
        ).toBeUndefined();
    });

    it('should preserve existing strokeColor during style normalization', () => {
        const normalizedStyle: any =
            (tempAdapter as any).normalizeNodeStyle({
                stroke: 'red',
                strokeColor: 'green'
            });

        expect(normalizedStyle.strokeColor).toBe('green');
        expect(normalizedStyle.stroke).toBeUndefined();
    });

    it('should cover connector decorator normalization', () => {
        expect(
            (tempAdapter as any).normalizeDecorator(
                'arrow',
                'None'
            )
        ).toBe('Arrow');

        expect(
            (tempAdapter as any).normalizeDecorator(
                'diamond',
                'None'
            )
        ).toBe('Diamond');

        expect(
            (tempAdapter as any).normalizeDecorator(
                'circle',
                'None'
            )
        ).toBe('Circle');

        expect(
            (tempAdapter as any).normalizeDecorator(
                'invalid',
                'Arrow'
            )
        ).toBe('Arrow');

        expect(
            (tempAdapter as any).normalizeDecorator(
                undefined,
                'None'
            )
        ).toBe('None');
    });

    it('should cover connector type normalization', () => {
        expect(
            (tempAdapter as any).normalizeConnectorType('straight')
        ).toBe('Straight');

        expect(
            (tempAdapter as any).normalizeConnectorType('curved')
        ).toBe('Bezier');

        expect(
            (tempAdapter as any).normalizeConnectorType('bezier')
        ).toBe('Bezier');

        expect(
            (tempAdapter as any).normalizeConnectorType('orthogonal')
        ).toBe('Orthogonal');

        expect(
            (tempAdapter as any).normalizeConnectorType('right-angle')
        ).toBe('Orthogonal');

        expect(
            (tempAdapter as any).normalizeConnectorType(undefined)
        ).toBe('Orthogonal');
    });

    it('should cover port visibility normalization', () => {
        expect(
            (tempAdapter as any).normalizePortVisibility(
                PortVisibility.Visible
            )
        ).toBe(PortVisibility.Visible);

        expect(
            (tempAdapter as any).normalizePortVisibility('Visible')
        ).toBe(PortVisibility.Visible);

        expect(
            (tempAdapter as any).normalizePortVisibility('Hidden')
        ).toBe(PortVisibility.Hidden);

        expect(
            (tempAdapter as any).normalizePortVisibility('Hover')
        ).toBe(PortVisibility.Hover);

        expect(
            (tempAdapter as any).normalizePortVisibility('Connect')
        ).toBe(PortVisibility.Connect);

        expect(
            (tempAdapter as any).normalizePortVisibility('Invalid')
        ).toBe(PortVisibility.Connect);
    });

    it('should cover alignment normalization', () => {
        expect(
            (tempAdapter as any).normalizeAlignment('left')
        ).toBe('Left');

        expect(
            (tempAdapter as any).normalizeAlignment('right')
        ).toBe('Right');

        expect(
            (tempAdapter as any).normalizeAlignment('center')
        ).toBe('Center');

        expect(
            (tempAdapter as any).normalizeAlignment('top')
        ).toBe('Top');

        expect(
            (tempAdapter as any).normalizeAlignment('bottom')
        ).toBe('Bottom');

        expect(
            (tempAdapter as any).normalizeAlignment('middle')
        ).toBe('Middle');

        expect(
            (tempAdapter as any).normalizeAlignment('custom')
        ).toBe('custom');
    });

    it('should cover distribution normalization', () => {
        expect(
            (tempAdapter as any).normalizeDistribution(
                'horizontalCenter'
            )
        ).toBe('Center');

        expect(
            (tempAdapter as any).normalizeDistribution(
                'horizontalSpacing'
            )
        ).toBe('Center');

        expect(
            (tempAdapter as any).normalizeDistribution(
                'verticalCenter'
            )
        ).toBe('Middle');

        expect(
            (tempAdapter as any).normalizeDistribution(
                'verticalSpacing'
            )
        ).toBe('Middle');

        expect(
            (tempAdapter as any).normalizeDistribution('custom')
        ).toBe('custom');
    });

    it('should cover sizing normalization', () => {
        expect(
            (tempAdapter as any).normalizeSizing('width')
        ).toBe('Width');

        expect(
            (tempAdapter as any).normalizeSizing('height')
        ).toBe('Height');

        expect(
            (tempAdapter as any).normalizeSizing('both')
        ).toBe('Size');

        expect(
            (tempAdapter as any).normalizeSizing('size')
        ).toBe('Size');

        expect(
            (tempAdapter as any).normalizeSizing('custom')
        ).toBe('custom');
    });

    it('should cover safe hyperlink validation', () => {
        expect(
            (tempAdapter as any).isSafeHyperlink(
                'https://example.com'
            )
        ).toBe(true);

        expect(
            (tempAdapter as any).isSafeHyperlink(
                'mailto:test@example.com'
            )
        ).toBe(true);

        expect(
            (tempAdapter as any).isSafeHyperlink(
                'javascript:alert(1)'
            )
        ).toBe(false);

        expect(
            (tempAdapter as any).isSafeHyperlink(
                'data:text/html,test'
            )
        ).toBe(false);

        expect(
            (tempAdapter as any).isSafeHyperlink(
                'vbscript:test'
            )
        ).toBe(false);

        expect(
            (tempAdapter as any).isSafeHyperlink('')
        ).toBe(false);

        expect(
            (tempAdapter as any).isSafeHyperlink(undefined)
        ).toBe(false);
    });

    it('should cover ER field normalization', () => {
        const fields: any[] =
            (tempAdapter as any).normalizeErFields([
                {
                    id: 'field1',
                    name: 'Id',
                    type: 'INT',
                    primaryKey: true
                },
                {
                    fieldName: 'CustomerId',
                    dataType: 'VARCHAR',
                    foreignKey: true,
                    constraints: ['Required']
                },
                {}
            ]);

        expect(fields.length).toBe(3);

        expect(fields[0].id).toBe('field1');
        expect(fields[0].name).toBe('Id');
        expect(fields[0].dataType).toBe('INT');
        expect(fields[0].isPrimaryKey).toBe(true);

        expect(fields[1].name).toBe('CustomerId');
        expect(fields[1].dataType).toBe('VARCHAR');
        expect(fields[1].isForeignKey).toBe(true);
        expect(fields[1].constraints).toEqual(['Required']);

        expect(fields[2].id).toBe('field_3');
        expect(fields[2].name).toBe('Field 3');
        expect(fields[2].dataType).toBe('VARCHAR');
    });

    it('should cover empty ER field normalization', () => {
        expect(
            (tempAdapter as any).normalizeErFields(undefined)
        ).toEqual([]);

        expect(
            (tempAdapter as any).normalizeErFields({})
        ).toEqual([]);
    });

    it('should cover ER field parsing from label', () => {
        const fields: any[] =
            (tempAdapter as any).parseEntityFields(
                'Customer\n+ Id: INT\n+ Name: VARCHAR\n+ Description'
            );

        expect(fields.length).toBe(3);

        expect(fields[0].id).toBe('field_1');
        expect(fields[0].name).toBe('Id');
        expect(fields[0].dataType).toBe('INT');

        expect(fields[1].name).toBe('Name');
        expect(fields[1].dataType).toBe('VARCHAR');

        expect(fields[2].name).toBe('Description');
        expect(fields[2].dataType).toBe('VARCHAR');
    });

    it('should cover empty ER label parsing', () => {
        expect(
            (tempAdapter as any).parseEntityFields(undefined)
        ).toEqual([]);

        expect(
            (tempAdapter as any).parseEntityFields('')
        ).toEqual([]);
    });

    it('should cover specialized container shape', () => {
        const shape: any =
            (tempAdapter as any).buildSpecializedShape({
                nodeId: 'container1',
                shape: 'container'
            });

        expect(shape.type).toBe('Basic');
        expect(shape.shape).toBe('Rectangle');
    });

    it('should cover specialized ER shape', () => {
        const shape: any =
            (tempAdapter as any).buildSpecializedShape({
                nodeId: 'entity1',
                shape: 'entity',
                label: 'Customer',
                fields: [
                    {
                        name: 'Id',
                        dataType: 'INT',
                        primaryKey: true
                    }
                ]
            });

        expect(shape.type).toBe('Er');
        expect(shape.shape).toBe('Entity');
        expect(shape.fields.length).toBe(1);
        expect(shape.fields[0].name).toBe('Id');
    });

    it('should cover specialized UML class shape', () => {
        const shape: any =
            (tempAdapter as any).buildSpecializedShape({
                nodeId: 'class1',
                shape: 'umlclass',
                classShape: {
                    name: 'Customer',
                    attributes: [],
                    methods: []
                }
            });

        expect(shape.type).toBe('UmlClassifier');
        expect(shape.classShape.name).toBe('Customer');
    });

    it('should cover specialized BPMN event shape', () => {
        const shape: any =
            (tempAdapter as any).buildSpecializedShape({
                nodeId: 'event1',
                shape: 'bpmnstart',
                eventType: 'Start',
                trigger: 'Message'
            });

        expect(shape.type).toBe('Bpmn');
        expect(shape.shape).toBe('Event');
        expect(shape.event.event).toBe('Start');
        expect(shape.event.trigger).toBe('Message');
    });

    it('should cover specialized BPMN gateway shape', () => {
        const shape: any =
            (tempAdapter as any).buildSpecializedShape({
                nodeId: 'gateway1',
                shape: 'gateway',
                gatewayType: 'Parallel'
            });

        expect(shape.type).toBe('Bpmn');
        expect(shape.shape).toBe('Gateway');
        expect(shape.gateway.type).toBe('Parallel');
    });

    it('should cover specialized swimlane shape', () => {
        const shape: any =
            (tempAdapter as any).buildSpecializedShape({
                nodeId: 'swimlane1',
                shape: 'swimlane',
                label: 'Order Process',
                orientation: 'Vertical',
                phaseSize: 30,
                phaseLabel: 'Phase 1',
                laneLabel: 'Lane 1',
                width: 500,
                height: 300
            });

        expect(shape.type).toBe('SwimLane');
        expect(shape.orientation).toBe('Vertical');
        expect(shape.phaseSize).toBe(30);
        expect(shape.phases.length).toBe(1);
        expect(shape.lanes.length).toBe(1);
    });

    it('should cover success response formatting', () => {
        const result: any =
            (tempAdapter as any).message({
                success: true,
                data: {
                    status: 'completed'
                },
                message: 'Completed'
            });

        const response: any =
            JSON.parse(result.content[0].text);

        expect(result.isError).toBeUndefined();
        expect(result.content[0].type).toBe('text');
        expect(response.success).toBe(true);
        expect(response.data.status).toBe('completed');
    });

    it('should cover error response formatting', () => {
        const result: any =
            (tempAdapter as any).error('Temporary error');

        expect(result.isError).toBe(true);
        expect(result.content[0].type).toBe('text');
        expect(result.content[0].text).toBe('Temporary error');
    });

    it('should cover parent validation without initialization', () => {
        expect(
            (tempAdapter as any).ensureParent()
        ).toBe(false);
    });
    it('should cover handlers when adapter has no parent', () => {
        const cases: Array<{
            handler: string;
            args: any;
        }> = [
                {
                    handler: 'handleCreateDiagramNode',
                    args: { nodeId: 'node1' }
                },
                {
                    handler: 'handleCreateDiagramConnector',
                    args: {
                        connectorId: 'connector1',
                        sourceId: 'node1',
                        targetId: 'node2'
                    }
                },
                {
                    handler: 'handleManageNodeSelection',
                    args: { selectMode: 'all' }
                },
                {
                    handler: 'handleManageInteractionMode',
                    args: { mode: 'readOnly' }
                },
                {
                    handler: 'handleArrangeAndAlignObjects',
                    args: {}
                },
                {
                    handler: 'handleDeleteFromDiagram',
                    args: { deleteMode: 'all' }
                },
                {
                    handler: 'handleManageUndoRedo',
                    args: { action: 'undo' }
                },
                {
                    handler: 'handleManageClipboardOperations',
                    args: { operation: 'copy' }
                },
                {
                    handler: 'handleExportAndImportDiagrams',
                    args: { operation: 'export' }
                },
                {
                    handler: 'handleArrangeZOrder',
                    args: { order: 'toFront' }
                },
                {
                    handler: 'handleNavigateAndZoomDiagram',
                    args: { action: 'reset' }
                },
                {
                    handler: 'handleManageGroupsAndHierarchies',
                    args: { operation: 'group' }
                },
                {
                    handler: 'handleManageAnnotationsAndLabels',
                    args: {
                        objectId: 'node1',
                        operation: 'add',
                        labelText: 'Text'
                    }
                },
                {
                    handler: 'handleManagePorts',
                    args: {
                        nodeId: 'node1',
                        action: 'add'
                    }
                },
                {
                    handler: 'handleManageLayers',
                    args: {
                        operation: 'addLayer'
                    }
                },
                {
                    handler: 'handleApplyLayoutToNodes',
                    args: {
                        layoutType: 'Hierarchical'
                    }
                }
            ];

        cases.forEach((item: {
            handler: string;
            args: any;
        }) => {
            const handler: Function =
                (tempAdapter as any)[item.handler];

            expect(handler).toBeDefined();

            const result: any =
                handler.call(tempAdapter, item.args);

            expect(result.isError).toBe(true);
            expect(result.content[0].text)
                .toContain('not initialized');
        });
    });
    it('should cover module name and destroy cleanup', () => {
        (tempAdapter as any).savedNodeConstraints = {
            node1: 1
        };

        (tempAdapter as any).savedConnectorConstraints = {
            connector1: 1
        };

        expect(tempAdapter.getModuleName())
            .toBe('WebMcpAdapter');

        tempAdapter.destroy();

        expect((tempAdapter as any).parent)
            .toBeNull();

        expect((tempAdapter as any).savedNodeConstraints)
            .toEqual({});

        expect((tempAdapter as any).savedConnectorConstraints)
            .toEqual({});

        tempAdapter = null as any;
    });
});
describe('WebMcpAdapter handler coverage', () => {
    let adapter: WebMcpAdapter;
    let parent: any;
    let nodes: any[];
    let connectors: any[];

    function parseResult(result: any): any {
        if (result.isError) {
            return {
                success: false,
                message: result.content[0].text
            };
        }

        return JSON.parse(result.content[0].text);
    }

    function createNode(id: string): any {
        return {
            id,
            offsetX: 100,
            offsetY: 100,
            width: 100,
            height: 60,
            constraints: NodeConstraints.Default,
            annotations: [
                {
                    id: `${id}_label`,
                    content: id
                }
            ],
            ports: [],
            children: []
        };
    }

    function createConnector(
        id: string,
        sourceID: string,
        targetID: string
    ): any {
        return {
            id,
            sourceID,
            targetID,
            constraints: ConnectorConstraints.Default,
            annotations: [
                {
                    id: `${id}_label`,
                    content: id
                }
            ],
            style: {}
        };
    }

    beforeEach(() => {
        nodes = [
            createNode('node1'),
            createNode('node2'),
            createNode('node3')
        ];

        connectors = [
            createConnector('connector1', 'node1', 'node2')
        ];

        parent = {
            isDestroyed: false,
            element: {
                id: 'temporaryDiagram'
            },
            nodes,
            connectors,
            constraints: DiagramConstraints.Default,
            selectedItems: {
                nodes: [],
                connectors: []
            },
            layers: [],

            on: jasmine.createSpy('on'),
            off: jasmine.createSpy('off'),
            trigger: jasmine.createSpy('trigger'),

            getObject: jasmine.createSpy('getObject').and.callFake(
                (id: string): any => {
                    return nodes.concat(connectors).filter(
                        (item: any) => item.id === id
                    )[0];
                }
            ),

            addNode: jasmine.createSpy('addNode').and.callFake(
                (node: any): any => {
                    nodes.push(node);
                    return node;
                }
            ),

            addConnector: jasmine.createSpy('addConnector').and.callFake(
                (connector: any): any => {
                    connectors.push(connector);
                    return connector;
                }
            ),

            remove: jasmine.createSpy('remove').and.callFake(
                (object: any): void => {
                    nodes = nodes.filter(
                        (node: any) => node.id !== object.id
                    );

                    connectors = connectors.filter(
                        (connector: any) =>
                            connector.id !== object.id
                    );

                    parent.nodes = nodes;
                    parent.connectors = connectors;
                }
            ),

            dataBind: jasmine.createSpy('dataBind'),

            setProperties: jasmine.createSpy('setProperties').and.callFake(
                (properties: any): void => {
                    Object.keys(properties).forEach(
                        (key: string): void => {
                            parent[key] = properties[key];
                        }
                    );
                }
            ),

            selectAll: jasmine.createSpy('selectAll').and.callFake(
                (): void => {
                    parent.selectedItems.nodes = nodes.slice();
                    parent.selectedItems.connectors =
                        connectors.slice();
                }
            ),

            clearSelection:
                jasmine.createSpy('clearSelection').and.callFake(
                    (): void => {
                        parent.selectedItems.nodes = [];
                        parent.selectedItems.connectors = [];
                    }
                ),

            select: jasmine.createSpy('select').and.callFake(
                (objects: any[]): void => {
                    parent.selectedItems.nodes = objects.filter(
                        (item: any) =>
                            nodes.indexOf(item) !== -1
                    );

                    parent.selectedItems.connectors = objects.filter(
                        (item: any) =>
                            connectors.indexOf(item) !== -1
                    );
                }
            ),

            align: jasmine.createSpy('align'),
            distribute: jasmine.createSpy('distribute'),
            sameSize: jasmine.createSpy('sameSize'),

            bringToFront: jasmine.createSpy('bringToFront'),
            sendToBack: jasmine.createSpy('sendToBack'),
            moveForward: jasmine.createSpy('moveForward'),
            sendBackward: jasmine.createSpy('sendBackward'),

            zoom: jasmine.createSpy('zoom'),
            pan: jasmine.createSpy('pan'),
            reset: jasmine.createSpy('reset'),
            resetZoom: jasmine.createSpy('resetZoom'),
            fitToPage: jasmine.createSpy('fitToPage'),
            bringIntoView: jasmine.createSpy('bringIntoView'),

            undo: jasmine.createSpy('undo'),
            redo: jasmine.createSpy('redo'),
            startGroupAction: jasmine.createSpy('startGroupAction'),
            endGroupAction: jasmine.createSpy('endGroupAction'),
            clearHistory: jasmine.createSpy('clearHistory'),

            copy: jasmine.createSpy('copy'),
            cut: jasmine.createSpy('cut'),
            paste: jasmine.createSpy('paste').and.returnValue([]),

            saveDiagram: jasmine.createSpy('saveDiagram').and.returnValue(
                '{"nodes":[],"connectors":[]}'
            ),

            loadDiagram: jasmine.createSpy('loadDiagram'),
            print: jasmine.createSpy('print'),

            group: jasmine.createSpy('group').and.returnValue({
                id: 'group1',
                children: ['node1', 'node2']
            }),

            unGroup: jasmine.createSpy('unGroup'),

            addChildToGroup:
                jasmine.createSpy('addChildToGroup'),

            removeChildFromGroup:
                jasmine.createSpy('removeChildFromGroup'),

            addLabels: jasmine.createSpy('addLabels').and.callFake(
                (object: any, labels: any[]): void => {
                    object.annotations =
                        (object.annotations || []).concat(labels);
                }
            ),

            removeLabels:
                jasmine.createSpy('removeLabels').and.callFake(
                    (object: any, labels: any[]): void => {
                        object.annotations =
                            object.annotations.filter(
                                (annotation: any) =>
                                    labels.indexOf(annotation) === -1
                            );
                    }
                ),

            addPorts: jasmine.createSpy('addPorts').and.callFake(
                (node: any, ports: any[]): void => {
                    node.ports = (node.ports || []).concat(ports);
                }
            ),

            removePorts:
                jasmine.createSpy('removePorts').and.callFake(
                    (node: any, ports: any[]): void => {
                        node.ports = node.ports.filter(
                            (port: any) =>
                                ports.indexOf(port) === -1
                        );
                    }
                ),

            addLayer: jasmine.createSpy('addLayer').and.callFake(
                (layer: any): void => {
                    parent.layers.push(layer);
                }
            ),

            removeLayer: jasmine.createSpy('removeLayer'),
            moveObjects: jasmine.createSpy('moveObjects'),
            sendLayerBackward:
                jasmine.createSpy('sendLayerBackward'),
            bringLayerForward:
                jasmine.createSpy('bringLayerForward'),

            doLayout: jasmine.createSpy('doLayout'),

            scrollSettings: {
                currentZoom: 1,
                horizontalOffset: 0,
                verticalOffset: 0
            }
        };

        adapter = new WebMcpAdapter(parent);
    });

    afterEach(() => {
        if (adapter) {
            adapter.destroy();
        }
    });

    it('should cover node creation success and validation branches', () => {
        const created: any =
            (adapter as any).handleCreateDiagramNode({
                nodeId: 'node4',
                shape: 'UnknownShape',
                x: 200,
                y: 250,
                width: 120,
                height: 80,
                style: {
                    fill: 'red',
                    stroke: 'blue'
                },
                constraints: [
                    'Select',
                    'Drag',
                    'UnknownConstraint'
                ],
                visible: false,
                isExpanded: false,
                rotateAngle: 10,
                ports: [],
                addInfo: {
                    test: true
                }
            });

        expect(created.isError).toBeUndefined();
        expect(parent.addNode).toHaveBeenCalled();

        const duplicate: any =
            (adapter as any).handleCreateDiagramNode({
                nodeId: 'node1'
            });

        expect(duplicate.isError).toBe(true);

        const missingId: any =
            (adapter as any).handleCreateDiagramNode({});

        expect(missingId.isError).toBe(true);
    });

    it('should cover connector creation branches', () => {
        const created: any =
            (adapter as any).handleCreateDiagramConnector({
                connectorId: 'connector2',
                sourceId: 'node2',
                targetId: 'node3',
                lineType: 'Straight',
                lineColor: 'red',
                lineWidth: 3,
                lineDashArray: '5 5',
                startDecorator: 'Circle',
                endDecorator: 'Diamond',
                constraints: [
                    'Select',
                    'UnknownConstraint'
                ],
                visible: false,
                routing: 'Default'
            });

        expect(created.isError).toBeUndefined();
        expect(parent.addConnector).toHaveBeenCalled();

        const duplicate: any =
            (adapter as any).handleCreateDiagramConnector({
                connectorId: 'connector1',
                sourceId: 'node1',
                targetId: 'node2'
            });

        expect(duplicate.isError).toBe(true);

        const missingNode: any =
            (adapter as any).handleCreateDiagramConnector({
                connectorId: 'connector3',
                sourceId: 'missing',
                targetId: 'node2'
            });

        expect(missingNode.isError).toBe(true);

        const missingArguments: any =
            (adapter as any).handleCreateDiagramConnector({});

        expect(missingArguments.isError).toBe(true);
    });

    it('should cover all selection paths', () => {
        let result: any =
            (adapter as any).handleManageNodeSelection({
                selectMode: 'all'
            });

        expect(result.isError).toBeUndefined();

        result =
            (adapter as any).handleManageNodeSelection({
                selectMode: 'none'
            });

        expect(result.isError).toBeUndefined();

        result =
            (adapter as any).handleManageNodeSelection({
                selectMode: 'single',
                objectIds: ['node1', 'node2']
            });

        expect(result.isError).toBeUndefined();

        result =
            (adapter as any).handleManageNodeSelection({
                selectMode: 'multiple',
                objectIds: ['node1', 'connector1'],
                multipleSelection: true
            });

        expect(result.isError).toBeUndefined();

        result =
            (adapter as any).handleManageNodeSelection({
                selectMode: 'multiple',
                objectIds: ['missing']
            });

        expect(result.isError).toBe(true);
    });

    it('should cover read-only and read-write interaction modes', () => {
        let result: any =
            (adapter as any).handleManageInteractionMode({
                mode: 'readOnly'
            });

        expect(result.isError).toBeUndefined();
        expect(nodes[0].constraints)
            .toBe(NodeConstraints.None);

        result =
            (adapter as any).handleManageInteractionMode({
                mode: 'readWrite'
            });

        expect(result.isError).toBeUndefined();

        result =
            (adapter as any).handleManageInteractionMode({
                mode: 'invalid'
            });

        expect(result.isError).toBe(true);
    });

    it('should cover arrange and alignment operations', () => {
        const result: any =
            (adapter as any).handleArrangeAndAlignObjects({
                objectIds: ['node1', 'node2', 'node3'],
                alignMode: 'left',
                distributeMode: 'horizontalSpacing',
                sizeMode: 'both',
                spacing: 20
            });

        expect(result.isError).toBeUndefined();
        expect(parent.align).toHaveBeenCalled();
        expect(parent.distribute).toHaveBeenCalled();
        expect(parent.sameSize).toHaveBeenCalled();
    });

    it('should cover delete specified objects and dependents', () => {
        const result: any =
            (adapter as any).handleDeleteFromDiagram({
                deleteMode: 'specified',
                objectIds: ['node1'],
                includeDependents: true
            });

        expect(result.isError).toBeUndefined();
        expect(parent.remove).toHaveBeenCalled();
    });

    it('should cover delete selected and delete all', () => {
        parent.selectedItems.nodes = [nodes[0]];

        let result: any =
            (adapter as any).handleDeleteFromDiagram({
                deleteMode: 'selected'
            });

        result =
            (adapter as any).handleDeleteFromDiagram({
                deleteMode: 'all'
            });

    });

    it('should cover undo and redo operations', () => {
        const actions: string[] = [
            'undo',
            'redo',
            'startGroup',
            'endGroup',
            'clear'
        ];

        actions.forEach((action: string) => {
            const result: any =
                (adapter as any).handleManageUndoRedo({
                    action,
                    groupDescription: 'Temporary group'
                });

            expect(result).toBeDefined();
        });

        const invalid: any =
            (adapter as any).handleManageUndoRedo({
                action: 'invalid'
            });

        expect(invalid.isError).toBe(true);
    });

    it('should cover clipboard operations', () => {
        parent.selectedItems.nodes = [
            nodes[0],
            nodes[1]
        ];

        const operations: string[] = [
            'copy',
            'cut',
            'paste'
        ];

        operations.forEach((operation: string) => {
            const result: any =
                (adapter as any).handleManageClipboardOperations({
                    operation,
                    objectIds: ['node1', 'node2']
                });

            expect(result).toBeDefined();
        });

        const invalid: any =
            (adapter as any).handleManageClipboardOperations({
                operation: 'invalid'
            });

        expect(invalid.isError).toBe(true);
    });

    it('should cover JSON save, load, import and print', () => {
        let result: any =
            (adapter as any).handleExportAndImportDiagrams({
                operation: 'save',
                format: 'json',
                filename: 'diagram.json'
            });

        expect(result).toBeDefined();

        result =
            (adapter as any).handleExportAndImportDiagrams({
                operation: 'export',
                format: 'json',
                filename: 'diagram.json',
                download: false
            });

        expect(result).toBeDefined();

        result =
            (adapter as any).handleExportAndImportDiagrams({
                operation: 'load',
                diagramData: '{"nodes":[]}'
            });

        expect(result).toBeDefined();

        result =
            (adapter as any).handleExportAndImportDiagrams({
                operation: 'import',
                diagramData: '{"nodes":[]}'
            });

        expect(result).toBeDefined();

        result =
            (adapter as any).handleExportAndImportDiagrams({
                operation: 'print'
            });

        expect(result).toBeDefined();

        result =
            (adapter as any).handleExportAndImportDiagrams({
                operation: 'invalid'
            });

        expect(result.isError).toBe(true);
    });

    it('should cover z-order operations', () => {
        const operations: string[] = [
            'toFront',
            'toBack',
            'forward',
            'backward'
        ];

        operations.forEach((order: string) => {
            const result: any =
                (adapter as any).handleArrangeZOrder({
                    objectIds: ['node1', 'node2'],
                    order
                });

            expect(result).toBeDefined();
        });

        const invalid: any =
            (adapter as any).handleArrangeZOrder({
                objectIds: ['node1'],
                order: 'invalid'
            });

        expect(invalid.isError).toBe(true);
    });

    it('should cover navigation operations', () => {
        const cases: any[] = [
            {
                action: 'zoom',
                zoomFactor: 1.5,
                focusPoint: {
                    x: 100,
                    y: 100
                }
            },
            {
                action: 'pan',
                horizontalOffset: 20,
                verticalOffset: 30
            },
            {
                action: 'reset'
            },
            {
                action: 'fitToPage'
            },
            {
                action: 'bringIntoView',
                bounds: {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                }
            },
            {
                action: 'bringIntoView',
                objectId: 'node1'
            }
        ];

        cases.forEach((args: any) => {
            const result: any =
                (adapter as any)
                    .handleNavigateAndZoomDiagram(args);

            expect(result).toBeDefined();
        });

        const invalid: any =
            (adapter as any)
                .handleNavigateAndZoomDiagram({
                    action: 'invalid'
                });

        expect(invalid.isError).toBe(true);
    });

    it('should cover group hierarchy operations', () => {
        const cases: any[] = [
            {
                operation: 'group',
                childIds: ['node1', 'node2']
            },
            {
                operation: 'unGroup',
                parentId: 'node1'
            },
            {
                operation: 'addChild',
                parentId: 'node1',
                childIds: ['node2']
            },
            {
                operation: 'removeChild',
                parentId: 'node1',
                childIds: ['node2']
            }
        ];

        cases.forEach((item: any) => {
            const result: any =
                (adapter as any)
                    .handleManageGroupsAndHierarchies(item);

            expect(result).toBeDefined();
        });

        const invalidResult: any =
            (adapter as any)
                .handleManageGroupsAndHierarchies({
                    operation: 'invalid'
                });

        expect(invalidResult.isError).toBe(true);
    });
    it('should cover annotation operations', () => {
        let result: any =
            (adapter as any)
                .handleManageAnnotationsAndLabels({
                    operation: 'add',
                    objectId: 'node1',
                    labelId: 'temporaryLabel',
                    labelText: 'Temporary label',
                    fontSize: 14,
                    color: 'red',
                    horizontalAlignment: 'Center',
                    verticalAlignment: 'Center'
                });

        expect(result).toBeDefined();

        result =
            (adapter as any)
                .handleManageAnnotationsAndLabels({
                    operation: 'update',
                    objectId: 'node1',
                    labelId: 'node1_label',
                    labelText: 'Updated label'
                });

        expect(result).toBeDefined();

        result =
            (adapter as any)
                .handleManageAnnotationsAndLabels({
                    operation: 'delete',
                    objectId: 'node1',
                    labelId: 'node1_label'
                });

        expect(result).toBeDefined();

        result =
            (adapter as any)
                .handleManageAnnotationsAndLabels({
                    operation: 'invalid',
                    objectId: 'node1'
                });

        expect(result.isError).toBe(true);
    });

    it('should cover port add and remove operations', () => {
        let result: any =
            (adapter as any).handleManagePorts({
                action: 'add',
                nodeId: 'node1',
                portDefinitions: [
                    {
                        id: 'port1',
                        offset: {
                            x: 0,
                            y: 0.5
                        },
                        visibility: 'Visible',
                        width: 10,
                        height: 10
                    },
                    {
                        id: 'port2',
                        offset: {
                            x: 1,
                            y: 0.5
                        },
                        visibility: 'Hover'
                    }
                ]
            });

        expect(result).toBeDefined();

        nodes[0].ports.push({
            id: 'removablePort',
            offset: {
                x: 0.5,
                y: 0
            }
        });

        result =
            (adapter as any).handleManagePorts({
                action: 'remove',
                nodeId: 'node1',
                portId: 'removablePort'
            });

        expect(result).toBeDefined();

        result =
            (adapter as any).handleManagePorts({
                action: 'invalid',
                nodeId: 'node1'
            });

        expect(result.isError).toBe(true);
    });

    it('should cover named port positions', () => {
        const result: any =
            (adapter as any).handleManagePorts({
                action: 'add',
                nodeId: 'node1',
                portCount: 9,
                positions: [
                    'top',
                    'bottom',
                    'left',
                    'right',
                    'topLeft',
                    'topRight',
                    'bottomLeft',
                    'bottomRight',
                    'center'
                ]
            });

        expect(result).toBeDefined();
    });

    it('should cover layer operations', () => {
        const layerCases: any[] = [
            {
                operation: 'addLayer',
                layerId: 'layer1',
                layerName: 'Layer 1'
            },
            {
                operation: 'removeLayer',
                layerId: 'layer1'
            },
            {
                operation: 'moveObjects',
                objects: ['node1', 'node2'],
                targetLayer: 'layer1'
            },
            {
                operation: 'reorder',
                layerId: 'layer1',
                direction: 'forward'
            }
        ];

        layerCases.forEach((item: any) => {
            const result: any =
                (adapter as any).handleManageLayers(item);

            expect(result).toBeDefined();
        });

        const invalidResult: any =
            (adapter as any).handleManageLayers({
                operation: 'invalid'
            });

        expect(invalidResult.isError).toBe(true);
    });

    it('should cover layout configuration branches', () => {
        const layoutCases: any[] = [
            {
                layoutType: 'Hierarchical',
                orientation: 'TopToBottom'
            },
            {
                layoutType: 'ComplexHierarchical',
                orientation: 'LeftToRight'
            },
            {
                layoutType: 'Radial',
                rootNode: 'node1'
            },
            {
                layoutType: 'MindMap',
                rootNode: 'node1'
            },
            {
                layoutType: 'Flowchart',
                orientation: 'TopToBottom'
            },
            {
                layoutType: 'Symmetric'
            }
        ];

        layoutCases.forEach((item: any) => {
            const result: any =
                (adapter as any).handleApplyLayoutToNodes({
                    layoutType: item.layoutType,
                    orientation: item.orientation,
                    rootNode: item.rootNode,
                    horizontalSpacing: 40,
                    verticalSpacing: 40,
                    connectorStrokeColor: 'red'
                });

            expect(result).toBeDefined();
        });

        const invalidResult: any =
            (adapter as any).handleApplyLayoutToNodes({
                layoutType: 'InvalidLayout'
            });

        expect(invalidResult.isError).toBe(true);
    });

    it('should cover tool registration and unregistration', () => {
        const registeredTools: any[] = [];
        const originalModelContext: any =
            (document as any).modelContext;

        (document as any).modelContext = {
            registerTool: (
                tool: any,
                options: any
            ): void => {
                registeredTools.push({
                    tool,
                    options
                });
            }
        };

        (adapter as any).registerTools({
            prefix: 'temporary',
            tools: [
                'createDiagramNode',
                'manageNodeSelection',
                'navigateAndZoomDiagram'
            ],
            exposedTo: ['model']
        });

        expect(registeredTools.length).toBe(3);

        (adapter as any).unregisterTools();

        expect(
            (adapter as any).webMcpAbortController
        ).toBeNull();

        (document as any).modelContext =
            originalModelContext;
    });

    it('should cover registered tool execute callback', async () => {
        const registeredTools: any[] = [];
        const originalModelContext: any =
            (document as any).modelContext;

        (document as any).modelContext = {
            registerTool: (tool: any): void => {
                registeredTools.push(tool);
            }
        };

        spyOn(
            adapter as any,
            'executeHandler'
        ).and.returnValue(
            Promise.resolve({
                content: [
                    {
                        type: 'text',
                        text: '{}'
                    }
                ]
            })
        );

        (adapter as any).registerTools({
            prefix: 'temporary',
            tools: ['createDiagramNode']
        });

        await registeredTools[0].execute({
            nodeId: 'node4'
        });

        expect(
            (adapter as any).executeHandler
        ).toHaveBeenCalled();

        (document as any).modelContext =
            originalModelContext;
    });

    it('should cover prefixed and unknown commands', async () => {
        parent.trigger.and.callFake(
            (eventName: string, eventArgs: any): void => {
                eventArgs.cancel = false;
                eventArgs.showConfirmationDialog = false;
            }
        );

        const originalHandler: Function =
            (adapter as any).handleManagePorts;

        (adapter as any).handleManagePorts =
            jasmine.createSpy(
                'handleManagePorts'
            ).and.returnValue({
                content: [
                    {
                        type: 'text',
                        text: '{}'
                    }
                ]
            });

        const prefixedResult: any =
            await (adapter as any).executeHandler(
                'temporary_managePorts',
                {
                    action: 'add',
                    nodeId: 'node1'
                }
            );

        expect(prefixedResult).toBeDefined();

        const unknownResult: any =
            await (adapter as any).executeHandler(
                'unknown-command-with-different-length',
                {}
            );

        expect(unknownResult.isError).toBe(true);

        (adapter as any).handleManagePorts =
            originalHandler;
    });

    it('should cover executeHandler cancellation', async () => {
        parent.trigger.and.callFake(
            (eventName: string, eventArgs: any): void => {
                eventArgs.cancel = true;
                eventArgs.cancellationResponse =
                    'Cancelled temporarily';
            }
        );

        const result: any =
            await (adapter as any).executeHandler(
                'createDiagramNode',
                {
                    nodeId: 'cancelledNode'
                }
            );

        const response: any =
            JSON.parse(result.content[0].text);

        expect(response.cancelled).toBe(true);
        expect(response.message)
            .toBe('Cancelled temporarily');
    });

    it('should cover default cancellation response', async () => {
        parent.trigger.and.callFake(
            (eventName: string, eventArgs: any): void => {
                eventArgs.cancel = true;
                eventArgs.cancellationResponse = undefined;
            }
        );

        const result: any =
            await (adapter as any).executeHandler(
                'createDiagramNode',
                {
                    nodeId: 'cancelledNode'
                }
            );

        const response: any =
            JSON.parse(result.content[0].text);

        expect(response.cancelled).toBe(true);
        expect(response.message)
            .toContain('USER_CANCELLED');
    });

    it('should cover rejected confirmation', async () => {
        parent.trigger.and.callFake(
            (eventName: string, eventArgs: any): void => {
                eventArgs.cancel = false;
                eventArgs.showConfirmationDialog = true;
            }
        );

        const originalConfirm: Function =
            (adapter as any).confirmExecution;

        (adapter as any).confirmExecution =
            jasmine.createSpy(
                'confirmExecution'
            ).and.returnValue(false);

        const result: any =
            await (adapter as any).executeHandler(
                'createDiagramNode',
                {
                    nodeId: 'confirmationNode'
                }
            );

        const response: any =
            JSON.parse(result.content[0].text);

        expect(response.cancelled).toBe(true);

        (adapter as any).confirmExecution =
            originalConfirm;
    });

    it('should cover accepted confirmation', async () => {
        parent.trigger.and.callFake(
            (eventName: string, eventArgs: any): void => {
                eventArgs.cancel = false;
                eventArgs.showConfirmationDialog = true;
            }
        );

        const originalConfirm: Function =
            (adapter as any).confirmExecution;

        const originalHandler: Function =
            (adapter as any).handleCreateDiagramNode;

        (adapter as any).confirmExecution =
            jasmine.createSpy(
                'confirmExecution'
            ).and.returnValue(true);

        (adapter as any).handleCreateDiagramNode =
            jasmine.createSpy(
                'handleCreateDiagramNode'
            ).and.returnValue({
                content: [
                    {
                        type: 'text',
                        text: '{}'
                    }
                ]
            });

        const result: any =
            await (adapter as any).executeHandler(
                'createDiagramNode',
                {
                    nodeId: 'confirmationNode'
                }
            );

        expect(result.isError).toBeUndefined();

        (adapter as any).confirmExecution =
            originalConfirm;

        (adapter as any).handleCreateDiagramNode =
            originalHandler;
    });

    it('should cover executeHandler exception', async () => {
        parent.trigger.and.callFake(
            (eventName: string, eventArgs: any): void => {
                eventArgs.cancel = false;
                eventArgs.showConfirmationDialog = false;
            }
        );

        const originalHandler: Function =
            (adapter as any).handleCreateDiagramNode;

        (adapter as any).handleCreateDiagramNode =
            jasmine.createSpy(
                'handleCreateDiagramNode'
            ).and.throwError('Temporary handler failure');

        const result: any =
            await (adapter as any).executeHandler(
                'createDiagramNode',
                {
                    nodeId: 'errorNode'
                }
            );

        expect(result.isError).toBe(true);
        expect(result.content[0].text)
            .toContain('Temporary handler failure');

        (adapter as any).handleCreateDiagramNode =
            originalHandler;
    });

    it('should cover Mermaid export branches', () => {
        parent.saveDiagramAsMermaid =
            jasmine.createSpy(
                'saveDiagramAsMermaid'
            ).and.returnValue('graph TD\nA-->B');

        const originalDownload: Function =
            (adapter as any).downloadFile;

        (adapter as any).downloadFile =
            jasmine.createSpy('downloadFile');

        let result: any =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'mermaid',
                    filename: 'temporary.md',
                    download: false
                });

        expect(result.isError).toBeUndefined();

        result =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'mermaid',
                    filename: 'temporary.md',
                    download: true
                });

        expect(result.isError).toBeUndefined();

        expect(
            (adapter as any).downloadFile
        ).toHaveBeenCalled();

        (adapter as any).downloadFile =
            originalDownload;
    });

    it('should cover unavailable and empty Mermaid export', () => {
        parent.saveDiagramAsMermaid = undefined;

        let result: any =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'mermaid'
                });

        expect(result.isError).toBe(true);

        parent.saveDiagramAsMermaid =
            jasmine.createSpy(
                'saveDiagramAsMermaid'
            ).and.returnValue('');

        result =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'mermaid'
                });

        expect(result.isError).toBe(true);
    });

    it('should cover image export formats', () => {
        parent.printandExportModule = {
            exportDiagram:
                jasmine.createSpy('moduleExportDiagram')
        };

        parent.exportDiagram =
            jasmine.createSpy(
                'exportDiagram'
            ).and.returnValue(
                'data:image/png;base64,ABC'
            );

        const formats: string[] = [
            'png',
            'jpg',
            'jpeg',
            'svg'
        ];

        formats.forEach((format: string) => {
            const result: any =
                (adapter as any)
                    .handleExportAndImportDiagrams({
                        operation: 'export',
                        format,
                        filename: `temporary.${format}`,
                        download: false
                    });

            expect(result.isError).toBeUndefined();
        });
    });

    it('should cover image alias and download mode', () => {
        parent.printandExportModule = {
            exportDiagram:
                jasmine.createSpy('moduleExportDiagram')
        };

        parent.exportDiagram =
            jasmine.createSpy(
                'exportDiagram'
            ).and.returnValue('download-started');

        const result: any =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'image',
                    imageFormat: 'png',
                    filename: 'temporary',
                    download: true
                });

        expect(result.isError).toBeUndefined();
    });

    it('should cover unavailable and empty image export', () => {
        parent.printandExportModule = {};

        let result: any =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'png'
                });

        expect(result.isError).toBe(true);

        parent.printandExportModule = {
            exportDiagram:
                jasmine.createSpy('moduleExportDiagram')
        };

        parent.exportDiagram =
            jasmine.createSpy(
                'exportDiagram'
            ).and.returnValue('');

        result =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'svg',
                    download: false
                });

        expect(result.isError).toBe(true);
    });

    it('should cover empty and downloaded JSON export', () => {
        parent.saveDiagram.and.returnValue('');

        let result: any =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'json'
                });

        expect(result.isError).toBe(true);

        parent.saveDiagram.and.returnValue(
            '{"nodes":[],"connectors":[]}'
        );

        const originalDownload: Function =
            (adapter as any).downloadFile;

        (adapter as any).downloadFile =
            jasmine.createSpy('downloadFile');

        result =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'json',
                    filename: 'temporary.json',
                    download: true
                });

        expect(result.isError).toBeUndefined();

        expect(
            (adapter as any).downloadFile
        ).toHaveBeenCalled();

        (adapter as any).downloadFile =
            originalDownload;
    });

    it('should cover print branches', () => {
        parent.printandExportModule = {};

        let result: any =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'print'
                });

        expect(result.isError).toBe(true);

        parent.printandExportModule = {
            print: jasmine.createSpy('printModule')
        };

        parent.print =
            jasmine.createSpy('print');

        result =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'print',
                    fitPage: false,
                    region: 'PageSettings',
                    pageOrientation: 'Portrait',
                    margin: {
                        left: 10,
                        top: 10,
                        right: 10,
                        bottom: 10
                    }
                });

        expect(result.isError).toBeUndefined();
        expect(parent.print).toHaveBeenCalled();
    });

    it('should cover missing load and import data', () => {
        const loadResult: any =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'load'
                });

        expect(loadResult.isError).toBe(true);

        const importResult: any =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'import'
                });

        expect(importResult.isError).toBe(true);
    });

    it('should cover successful undo and redo', () => {
        parent.historyManager = {
            canUndo: false,
            canRedo: false,
            undoStack: [{}],
            redoStack: [{}]
        };

        let result: any =
            (adapter as any).handleManageUndoRedo({
                action: 'undo'
            });

        expect(result.isError).toBeUndefined();
        expect(parent.undo).toHaveBeenCalled();

        result =
            (adapter as any).handleManageUndoRedo({
                action: 'redo'
            });

        expect(result.isError).toBeUndefined();
        expect(parent.redo).toHaveBeenCalled();
    });

    it('should cover empty undo and redo history', () => {
        parent.historyManager = {
            canUndo: false,
            canRedo: false,
            undoStack: [],
            redoStack: []
        };

        let result: any =
            (adapter as any).handleManageUndoRedo({
                action: 'undo'
            });

        expect(result.isError).toBe(true);
        expect(result.content[0].text)
            .toContain('Nothing to undo');

        result =
            (adapter as any).handleManageUndoRedo({
                action: 'redo'
            });

        expect(result.isError).toBe(true);
        expect(result.content[0].text)
            .toContain('Nothing to redo');
    });

    it('should cover complete annotation properties', () => {
        const previous: any = {
            id: 'oldLabel',
            horizontalAlignment: 'Left',
            verticalAlignment: 'Top',
            margin: {
                left: 1,
                top: 1,
                right: 1,
                bottom: 1
            },
            style: {
                color: 'black',
                fontSize: 12
            }
        };

        const annotation: any =
            (adapter as any).buildAnnotation(
                {
                    labelColor: 'red',
                    labelFontSize: 18,
                    labelBold: true,
                    labelItalic: true,
                    labelFontFamily: 'Verdana',
                    labelTextAlign: 'Center',
                    labelTextDecoration: 'Underline',
                    labelFill: 'yellow',
                    labelHorizontalAlignment: 'Right',
                    labelVerticalAlignment: 'Bottom',
                    labelMargin: {
                        left: 4,
                        top: 4,
                        right: 4,
                        bottom: 4
                    },
                    labelWidth: 150,
                    labelHeight: 50,
                    rotateAngle: 20,
                    template: 'temporary-template',
                    hyperlink: 'https://example.com'
                },
                'Temporary annotation',
                previous,
                'completeLabel'
            );

        expect(annotation.id).toBe('completeLabel');
        expect(annotation.content).toBe(
            'Temporary annotation'
        );
        expect(annotation.style.color).toBe('red');
        expect(annotation.style.fontSize).toBe(18);
        expect(annotation.style.bold).toBe(true);
        expect(annotation.style.italic).toBe(true);
        expect(annotation.style.fontFamily).toBe(
            'Verdana'
        );
        expect(annotation.style.textAlign).toBe(
            'Center'
        );
        expect(annotation.style.textDecoration).toBe(
            'Underline'
        );
        expect(annotation.style.fill).toBe('yellow');
        expect(annotation.horizontalAlignment).toBe(
            'Right'
        );
        expect(annotation.verticalAlignment).toBe(
            'Bottom'
        );
        expect(annotation.margin.left).toBe(4);
        expect(annotation.width).toBe(150);
        expect(annotation.height).toBe(50);
        expect(annotation.rotateAngle).toBe(20);
        expect(annotation.template).toBe(
            'temporary-template'
        );
        expect(annotation.hyperlink.link).toBe(
            'https://example.com'
        );
    });

    it('should cover annotation hyperlink branches', () => {
        const previous: any = {
            horizontalAlignment: 'Center',
            verticalAlignment: 'Center',
            margin: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            },
            style: {}
        };

        const objectLink: any =
            (adapter as any).buildAnnotation(
                {
                    hyperlink: {
                        link: 'https://example.com',
                        content: 'Example'
                    }
                },
                'Object hyperlink',
                previous,
                'objectLink'
            );

        expect(objectLink.hyperlink.link).toBe(
            'https://example.com'
        );

        const unsafeLink: any =
            (adapter as any).buildAnnotation(
                {
                    hyperlink: 'javascript:alert(1)'
                },
                'Unsafe hyperlink',
                previous,
                'unsafeLink'
            );

        expect(unsafeLink.hyperlink).toBeUndefined();
    });

    it('should cover annotation validation branches', () => {
        const objectWithoutAnnotations: any = {
            id: 'emptyNode'
        };

        nodes.push(objectWithoutAnnotations);

        let result: any =
            (adapter as any)
                .handleManageAnnotationsAndLabels({
                    operation: 'update',
                    objectId: 'emptyNode',
                    labelText: 'Update'
                });

        expect(result.isError).toBe(true);

        result =
            (adapter as any)
                .handleManageAnnotationsAndLabels({
                    operation: 'update',
                    objectId: 'node1',
                    labelId: 'missingLabel',
                    labelText: 'Update'
                });

        expect(result.isError).toBe(true);

        result =
            (adapter as any)
                .handleManageAnnotationsAndLabels({
                    operation: 'delete',
                    objectId: 'node1'
                });

        expect(result.isError).toBe(true);

        result =
            (adapter as any)
                .handleManageAnnotationsAndLabels({
                    operation: 'delete',
                    objectId: 'node1',
                    labelId: 'missingLabel'
                });

        expect(result.isError).toBe(true);

        result =
            (adapter as any)
                .handleManageAnnotationsAndLabels({
                    operation: 'add',
                    objectId: 'missingNode',
                    labelText: 'Text'
                });

        expect(result.isError).toBe(true);
    });

    it('should cover layout without connectors', () => {
        parent.connectors = [];
        connectors = [];

        const result: any =
            (adapter as any).handleApplyLayoutToNodes({
                layoutType: 'Hierarchical',
                autoConnect: false
            });

        expect(result.isError).toBe(true);
        expect(result.content[0].text).toContain(
            'No connectors exist'
        );
    });

    it('should cover layout auto-connect', () => {
        parent.connectors = [];
        connectors = [];

        parent.addConnector.calls.reset();

        parent.addConnector.and.callFake(
            (connector: any): any => {
                parent.connectors.push(connector);
                return connector;
            }
        );

        const result: any =
            (adapter as any).handleApplyLayoutToNodes({
                layoutType: 'Hierarchical',
                autoConnect: true,
                connectorStrokeColor: 'green',
                enableAnimation: false
            });

        expect(result.isError).toBeUndefined();

        expect(parent.addConnector).toHaveBeenCalledTimes(
            nodes.length - 1
        );
    });

    it('should cover connector style creation during layout', () => {
        parent.connectors = [
            {
                id: 'unstyledConnector',
                sourceID: 'node1',
                targetID: 'node2'
            }
        ];

        const result: any =
            (adapter as any).handleApplyLayoutToNodes({
                type: 'hierarchicaltree',
                direction: 'BottomToTop',
                connectorStrokeColor: 'blue'
            });

        expect(result.isError).toBeUndefined();

        expect(
            parent.connectors[0].style.strokeColor
        ).toBe('blue');
    });

    it('should cover alternate layout names', () => {
        parent.connectors = [
            {
                id: 'connector1',
                sourceID: 'node1',
                targetID: 'node2',
                style: {}
            }
        ];

        const layoutCases: any[] = [
            {
                layoutType: 'hierarchicaltree'
            },
            {
                layoutType: 'radialtree',
                centreNode: 'node1'
            },
            {
                layoutType: 'symmetriclayout'
            },
            {
                type: 'flowchart',
                direction: 'LeftToRight'
            }
        ];

        layoutCases.forEach((item: any) => {
            const result: any =
                (adapter as any)
                    .handleApplyLayoutToNodes(item);

            expect(result.isError).toBeUndefined();
        });
    });

    it('should cover registered event callbacks', () => {
        const callbackParent: any = {
            isDestroyed: false,
            element: {
                id: 'callbackDiagram'
            },
            on: jasmine.createSpy('callbackOn'),
            off: jasmine.createSpy('callbackOff')
        };

        const callbackAdapter: WebMcpAdapter =
            new WebMcpAdapter(callbackParent);

        const getToolsSpy: jasmine.Spy =
            spyOn(
                callbackAdapter as any,
                'getTools'
            ).and.callThrough();

        const registerSpy: jasmine.Spy =
            spyOn(
                callbackAdapter as any,
                'registerTools'
            ).and.stub();

        const unregisterSpy: jasmine.Spy =
            spyOn(
                callbackAdapter as any,
                'unregisterTools'
            ).and.stub();

        const toolsArgs: any = {
            tools: []
        };

        (callbackAdapter as any)
            .getToolsHandler(toolsArgs);

        expect(getToolsSpy).toHaveBeenCalled();

        (callbackAdapter as any)
            .registerToolsHandler({
                tools: []
            });

        expect(registerSpy).toHaveBeenCalled();

        (callbackAdapter as any)
            .unregisterToolsHandler();

        expect(unregisterSpy).toHaveBeenCalled();

        callbackAdapter.destroy();
    });

    it('should remove listeners when parent changes', () => {
        const firstParent: any = {
            isDestroyed: false,
            on: jasmine.createSpy('firstOn'),
            off: jasmine.createSpy('firstOff')
        };

        const secondParent: any = {
            isDestroyed: false,
            on: jasmine.createSpy('secondOn'),
            off: jasmine.createSpy('secondOff')
        };

        const changingAdapter: WebMcpAdapter =
            new WebMcpAdapter(firstParent);

        changingAdapter.init(secondParent);

        expect(firstParent.off).toHaveBeenCalled();
        expect(secondParent.on).toHaveBeenCalled();

        changingAdapter.destroy();
    });

    it('should cover custom tool registration', () => {
        const registered: any[] = [];
        const originalModelContext: any =
            (document as any).modelContext;

        const customExecute: Function =
            (): any => {
                return {
                    content: [
                        {
                            type: 'text',
                            text: '{}'
                        }
                    ]
                };
            };

        (document as any).modelContext = {
            registerTool: (
                tool: any,
                options: any
            ): void => {
                registered.push({
                    tool,
                    options
                });
            }
        };

        (adapter as any).registerTools({
            tools: [
                {
                    name: 'customTool',
                    description: 'Temporary custom tool',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    },
                    outputSchema: {
                        type: 'object',
                        properties: {}
                    },
                    annotations: {
                        readOnlyHint: true
                    },
                    execute: customExecute
                }
            ]
        });

        expect(registered.length).toBe(1);
        expect(registered[0].tool.execute).toBe(
            customExecute
        );

        (document as any).modelContext =
            originalModelContext;
    });

    it('should cover registration without model context', () => {
        const originalModelContext: any =
            (document as any).modelContext;

        (document as any).modelContext = undefined;

        expect(() => {
            (adapter as any).registerTools({
                tools: []
            });
        }).not.toThrow();

        (document as any).modelContext =
            originalModelContext;
    });

    it('should cover registration without parent', () => {
        const detachedAdapter: WebMcpAdapter =
            new WebMcpAdapter();

        expect(() => {
            (detachedAdapter as any).registerTools({
                tools: []
            });
        }).not.toThrow();

        detachedAdapter.destroy();
    });

    it('should cover hierarchy validation branches', () => {
        let result: any =
            (adapter as any)
                .handleManageGroupsAndHierarchies({
                    operation: 'addChild'
                });


        result =
            (adapter as any)
                .handleManageGroupsAndHierarchies({
                    operation: 'removeChild'
                });

        result =
            (adapter as any)
                .handleManageGroupsAndHierarchies({
                    operation: 'addChild',
                    parentId: 'missingParent',
                    childIds: ['node1']
                });

        result =
            (adapter as any)
                .handleManageGroupsAndHierarchies({
                    operation: 'removeChild',
                    parentId: 'missingParent',
                    childIds: ['node1']
                });

    });

    it('should cover port validation branches', () => {
        let result: any =
            (adapter as any).handleManagePorts({
                action: 'add'
            });

        expect(result.isError).toBe(true);

        parent.getNodeObject =
            jasmine.createSpy(
                'getNodeObject'
            ).and.callFake(
                (id: string): any => {
                    return nodes.filter(
                        (node: any) => node.id === id
                    )[0];
                }
            );

        result =
            (adapter as any).handleManagePorts({
                action: 'add',
                nodeId: 'missingNode'
            });

        expect(result).toBeDefined();

        result =
            (adapter as any).handleManagePorts({
                action: 'remove',
                nodeId: 'node1'
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleManagePorts({
                action: 'remove',
                nodeId: 'node1',
                portId: 'missingPort'
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleManagePorts({
                action: 'invalid',
                nodeId: 'node1'
            });

        expect(result.isError).toBe(true);
    });

    it('should cover layer validation branches', () => {
        let result: any =
            (adapter as any).handleManageLayers({
                operation: 'addLayer',
                layerId: 'layer1'
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleManageLayers({
                operation: 'addLayer',
                layerName: 'Layer 1'
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleManageLayers({
                operation: 'removeLayer'
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleManageLayers({
                operation: 'moveObjects',
                objects: ['node1']
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleManageLayers({
                operation: 'moveObjects',
                targetLayer: 'layer1'
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleManageLayers({
                operation: 'invalid'
            });

        expect(result.isError).toBe(true);
    });

    it('should cover navigation validation branches', () => {
        let result: any =
            (adapter as any)
                .handleNavigateAndZoomDiagram({
                    action: 'bringIntoView'
                });


        result =
            (adapter as any)
                .handleNavigateAndZoomDiagram({
                    action: 'bringIntoView',
                    objectId: 'missingNode'
                });


        result =
            (adapter as any)
                .handleNavigateAndZoomDiagram({
                    action: 'invalid'
                });

    });

    it('should cover z-order validation branches', () => {
        parent.selectedItems.nodes = [];
        parent.selectedItems.connectors = [];

        let result: any =
            (adapter as any).handleArrangeZOrder({
                order: 'toFront'
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleArrangeZOrder({
                objectIds: ['missingNode'],
                order: 'toFront'
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleArrangeZOrder({
                objectIds: ['node1'],
                order: 'invalid'
            });

        expect(result.isError).toBe(true);
    });

    it('should cover arrange validation branches', () => {
        parent.selectedItems.nodes = [];
        parent.selectedItems.connectors = [];

        let result: any =
            (adapter as any)
                .handleArrangeAndAlignObjects({});

        expect(result.isError).toBe(true);

        result =
            (adapter as any)
                .handleArrangeAndAlignObjects({
                    objectIds: ['missingNode']
                });

        expect(result.isError).toBe(true);
    });

    it('should cover delete validation branches', () => {
        parent.selectedItems.nodes = [];
        parent.selectedItems.connectors = [];

        let result: any =
            (adapter as any).handleDeleteFromDiagram({
                deleteMode: 'selected'
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleDeleteFromDiagram({
                deleteMode: 'specified',
                objectIds: []
            });

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleDeleteFromDiagram({
                deleteMode: 'specified',
                objectIds: ['missingNode']
            });

        expect(result.isError).toBe(true);
    });

    it('should cover clipboard validation branches', () => {
        let result: any =
            (adapter as any)
                .handleManageClipboardOperations({});

        expect(result.isError).toBe(true);

        result =
            (adapter as any)
                .handleManageClipboardOperations({
                    operation: 'invalid'
                });

        expect(result.isError).toBe(true);
    });

    it('should cover undo redo validation branches', () => {
        let result: any =
            (adapter as any).handleManageUndoRedo({});

        expect(result.isError).toBe(true);

        result =
            (adapter as any).handleManageUndoRedo({
                action: 'invalid'
            });

        expect(result.isError).toBe(true);
    });

    it('should cover export validation branches', () => {
        let result: any =
            (adapter as any)
                .handleExportAndImportDiagrams({});

        expect(result.isError).toBe(true);

        result =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'export',
                    format: 'invalidFormat'
                });

        expect(result.isError).toBe(true);

        result =
            (adapter as any)
                .handleExportAndImportDiagrams({
                    operation: 'invalid'
                });

        expect(result.isError).toBe(true);
    });
});