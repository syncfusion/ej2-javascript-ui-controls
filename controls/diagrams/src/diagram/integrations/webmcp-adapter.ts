/**
 * WebMcpDiagram - Diagram Component WebMCP Integration
 * Enables AI model access to diagram manipulation capabilities through the WebMCP protocol
 *
 */

import { isNullOrUndefined, Property, ChildProperty } from '@syncfusion/ej2-base';
import { Diagram } from '../diagram';
import { WebMcpTool, WebMcpToolResponse, WebMcpToolExecuteEventArgs } from '../objects/interface/IElement';
/* eslint-disable @typescript-eslint/ban-types */
import { AlignmentOptions, ConnectorConstraints, DiagramConstraints, DistributeOptions, NodeConstraints, PortConstraints, PortVisibility, SizingOptions } from '../enum/enum';

/**
 * Each tool represents a workflow that can be executed by AI models
 */
const webMcpTools: WebMcpTool[] = [
    {
        name: 'createDiagramNode',
        description: 'Creates a standard Basic or Flowchart node. Do not use this tool for BPMN, ER, UML, or swimlane nodes; use ' +
            'createSpecializedDiagramNode for those.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                nodeId: { type: 'string', description: 'Unique identifier for the node' },
                label: { type: 'string', description: 'Display text for the node' },
                x: { type: 'number', description: 'X-coordinate position' },
                y: { type: 'number', description: 'Y-coordinate position' },
                width: { type: 'number', description: 'Node width in pixels' },
                height: { type: 'number', description: 'Node height in pixels' },
                shape: {
                    type: 'string',
                    description: 'Standard Basic or Flow shape such as Rectangle, Ellipse, Diamond, Process, or Terminator. BPMN shapes ' +
                        'are not valid here.'
                },
                style: { type: 'object', description: 'Style properties (fill, stroke, strokeWidth, etc.)' },
                parentId: { type: 'string', description: 'Parent node ID if adding to group' },
                swimlaneId: {
                    type: 'string',
                    description: 'Swimlane nodeId when the node belongs to a swimlane; pair with laneId targeting a specific lane under it.'
                },
                laneId: {
                    type: 'string',
                    description: 'Lane ID inside the swimlane; must be supplied with swimlaneId so the node renders inside the lane.'
                },
                constraints: { type: 'array', items: { type: 'string' }, description: 'Array of constraints (e.g., Select, Drag, Delete)' }
            },
            required: ['nodeId']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        nodeId: { type: 'string' },
                        status: { type: 'string' },
                        properties: { type: 'object' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'createSpecializedDiagramNode',
        description: 'Creates specialized diagram nodes using canonical component models. Use this tool for BPMN, ER, UML, and swimlane nodes. ' +
            'For swimlane children, supply swimlaneId and laneId so the node is positioned inside the swimlane instead of at absolute coordinates. ' +
            'BPMN examples: shape bpmnstart with eventType Start, shape bpmnend with eventType End, shape activity for tasks, and shape gateway with gatewayType Exclusive.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                nodeId: { type: 'string' }, label: { type: 'string' },
                shape: {
                    type: 'string',
                    description: 'Specialized shape. BPMN values: bpmnstart, bpmnend, bpmnintermediateevent, activity, gateway, message, ' +
                        'dataobject, datasource, group, textannotation. ER values: entity, erentity, or table. Swimlane value: swimlane.'
                },
                x: { type: 'number' }, y: { type: 'number' }, width: { type: 'number' }, height: { type: 'number' },
                fields: { type: 'array', description: 'ER fields with name and dataType; type is also accepted and normalized' },
                classShape: { type: 'object', description: 'UML class data with name, attributes, and methods' },
                lanes: {
                    type: 'array',
                    description: 'For swimlane shape: array of lane definitions. Each lane has id, label, and height (e.g. {"id":"lane_customer","label":"Customer","height":150}).',
                    items: { type: 'object' }
                },
                phases: {
                    type: 'array',
                    description: 'For swimlane shape: optional phase splits inside the swimlane. Each phase has id, offset, and header.',
                    items: { type: 'object' }
                },
                swimlaneId: {
                    type: 'string',
                    description: 'Required for child nodes inside a swimlane: the parent swimlane nodeId supplied at swimlane creation time. The returned shape body contains the lane IDs, address children via {swimlaneId, laneId}.'
                },
                laneId: {
                    type: 'string',
                    description: 'Required together with swimlaneId when the node belongs to a particular lane of a swimlane. Use the id returned in the swimlane shape body.'
                },
                eventType: { type: 'string' }, trigger: { type: 'string' }, gatewayType: { type: 'string' },
                task: { type: 'object' }, subProcess: { type: 'object' },
                orientation: { type: 'string' }, container: { type: 'object' }
            },
            required: ['nodeId', 'shape']
        },
        outputSchema: {
            type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'object' }, message: { type: 'string' } }
        }
    },
    {
        name: 'createDiagramConnector',
        description: 'Creates a connector between two nodes with optional labels, routing behavior (straight, orthogonal, curved), and ' +
            'styling',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                connectorId: { type: 'string', description: 'Unique identifier for the connector' },
                sourceId: { type: 'string', description: 'Source node ID' },
                targetId: { type: 'string', description: 'Target node ID' },
                label: { type: 'string', description: 'Connector label/annotation text' },
                lineType: { type: 'string', description: 'Line routing type (straight, orthogonal, curved)' },
                lineColor: { type: 'string', description: 'Connector line color (hex or named)' },
                lineWidth: { type: 'number', description: 'Connector line thickness' },
                startDecorator: { type: 'string', description: 'Start decorator (arrow, circle, diamond, etc.)' },
                endDecorator: { type: 'string', description: 'End decorator (arrow, circle, diamond, etc.)' },
                constraints: { type: 'array', items: { type: 'string' }, description: 'Array of constraints' },
                shape: {
                    type: 'object',
                    description: 'Specialized connector shape, such as UML activity flow, BPMN flow, ER relationship, or diagram ' +
                        'relationship'
                }
            },
            required: ['connectorId', 'sourceId', 'targetId']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        connectorId: { type: 'string' },
                        sourceId: { type: 'string' },
                        targetId: { type: 'string' },
                        status: { type: 'string' },
                        labelAdded: { type: 'boolean' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'manageNodeSelection',
        description: 'Manages node/connector selection state with support for single, multi, and select-all modes. ' +
            'Essential prerequisite for diagram operations',
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                objectIds: { type: 'array', items: { type: 'string' }, description: 'Array of object IDs to select' },
                multipleSelection: { type: 'boolean', description: 'Allow multiple selection (default: true)' },
                selectMode: { type: 'string', description: 'Selection mode (single, multiple, all, none)' },
                x: { type: 'number', description: 'X coordinate for mouse-based selection' },
                y: { type: 'number', description: 'Y coordinate for mouse-based selection' }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        selectedObjects: { type: 'array' },
                        selectionCount: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'manageInteractionMode',
        description: 'Enables or disables diagram interaction, selection, dragging, editing, and deletion',
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                mode: { type: 'string', description: 'Interaction mode (readWrite or readOnly)', enum: ['readWrite', 'readOnly'] }
            },
            required: ['mode']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'enableEditingMode',
        description: 'Enables or disables diagram editing and interaction',
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                enabled: { type: 'boolean', description: 'Enable editing when true, disable it when false' }
            },
            required: ['enabled']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'arrangeAndAlignObjects',
        description: 'Aligns, distributes, and sizes selected objects uniformly. Creates professional organized diagram layouts ' +
            'automatically',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                objectIds: { type: 'array', items: { type: 'string' }, description: 'Object IDs (default: selected)' },
                alignMode: { type: 'string', description: 'Alignment type (left, right, top, bottom, center, middle)' },
                distributeMode: {
                    type: 'string',
                    description: 'Distribution type (horizontalCenter, horizontalSpacing, verticalCenter, verticalSpacing)'
                },
                sizeMode: { type: 'string', description: 'Sizing type (width, height, both)' },
                spacing: { type: 'number', description: 'Space between objects for distribution' }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        operationsApplied: { type: 'array', items: { type: 'string' } },
                        objectCount: { type: 'number' },
                        status: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'deleteFromDiagram',
        description: 'Removes nodes, connectors, or all objects from the diagram with dependent connector cleanup. Enables automated ' +
            'cleanup and bulk removal',
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                objectIds: { type: 'array', items: { type: 'string' }, description: 'Array of object IDs to remove' },
                deleteMode: { type: 'string', description: 'Delete mode (selected, specified, all, withDependents)' },
                includeDependents: { type: 'boolean', description: 'Also delete dependent connectors (default: true)' }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        deletedObjects: { type: 'array' },
                        deletedCount: { type: 'number' },
                        dependentCount: { type: 'number' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'manageUndoRedo',
        description: 'Controls undo/redo history with support for grouped atomic transactions. Enables atomic multi-step operations',
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    description: 'Action (undo, redo, startGroup, endGroup, clear)',
                    enum: ['undo', 'redo', 'startGroup', 'endGroup', 'clear']
                },
                groupDescription: { type: 'string', description: 'Description for grouped actions' },
                customEntry: { type: 'object', description: 'Custom history entry object' }
            },
            required: ['action']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        action: { type: 'string' },
                        undoCount: { type: 'number' },
                        canUndo: { type: 'boolean' },
                        canRedo: { type: 'boolean' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'manageClipboardOperations',
        description: 'Manages copy, cut, and paste operations for diagram objects. Enables object duplication and bulk copying',
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                operation: { type: 'string', description: 'Operation (copy, cut, paste)', enum: ['copy', 'cut', 'paste'] },
                objectIds: { type: 'array', items: { type: 'string' }, description: 'Object IDs (default: selected)' },
                objects: { type: 'array', description: 'Objects to paste' }
            },
            required: ['operation']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        operation: { type: 'string' },
                        objectsCopied: { type: 'number' },
                        clipboardSize: { type: 'number' },
                        canPaste: { type: 'boolean' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'exportAndImportDiagrams',
        description: 'Exports diagram data in multiple formats (JSON, Visio, Image, Mermaid) and imports from various sources. Enables ' +
            'persistence and format conversion',
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                operation: {
                    type: 'string',
                    description: 'Operation (save, load, export, import, print)',
                    enum: ['save', 'load', 'export', 'import', 'print']
                },
                format: { type: 'string', description: 'Export format (json, visio, image, mermaid, pdf)' },
                filename: { type: 'string', description: 'Output/input filename' },
                diagramData: { type: 'string', description: 'Diagram data for import' },
                imageFormat: { type: 'string', description: 'Image format (png, svg, jpg)' },
                download: {
                    type: 'boolean',
                    description: 'Start a browser download of the export (default: false). When false, the content is returned in the ' +
                        'response.'
                }
            },
            required: ['operation']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        operation: { type: 'string' },
                        format: { type: 'string' },
                        filename: { type: 'string' },
                        size: { type: 'number' },
                        exportUrl: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'arrangeZOrder',
        description: 'Controls stacking order (z-order) of objects. Ensures proper visual layering for overlapping objects',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                objectIds: { type: 'array', items: { type: 'string' }, description: 'Object IDs (default: selected)' },
                order: {
                    type: 'string',
                    description: 'Order operation (toFront, toBack, forward, backward)',
                    enum: ['toFront', 'toBack', 'forward', 'backward']
                }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        objectIds: { type: 'array', items: { type: 'string' } },
                        operation: { type: 'string' },
                        newZOrder: { type: 'array', items: { type: 'number' } }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'navigateAndZoomDiagram',
        description: 'Controls viewport navigation including zoom, pan, reset, and fit-to-view operations. Supports presentation ' +
            'automation',
        annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                action: {
                    type: 'string',
                    description: 'Navigation action (zoom, pan, reset, fitToPage, bringIntoView)',
                    enum: ['zoom', 'pan', 'reset', 'fitToPage', 'bringIntoView']
                },
                zoomFactor: { type: 'number', description: 'Zoom factor (e.g., 1.5 for 150% zoom)' },
                horizontalOffset: { type: 'number', description: 'Pan horizontal distance' },
                verticalOffset: { type: 'number', description: 'Pan vertical distance' },
                focusPoint: { type: 'object', description: 'Focus point {x, y}' },
                objectId: { type: 'string', description: 'Object ID to bring into view' },
                bounds: { type: 'object', description: 'Bounding area {x, y, width, height}' }
            },
            required: ['action']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        action: { type: 'string' },
                        zoomLevel: { type: 'number' },
                        viewportCenter: { type: 'object' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'manageGroupsAndHierarchies',
        description: 'Creates, modifies, and removes groups and hierarchical relationships. Enables complex hierarchical structures and ' +
            'org charts',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                operation: {
                    type: 'string',
                    description: 'Operation (group, unGroup, addChild, removeChild)',
                    enum: ['group', 'unGroup', 'addChild', 'removeChild']
                },
                parentId: { type: 'string', description: 'Parent node ID' },
                childIds: { type: 'array', items: { type: 'string' }, description: 'Child node IDs' },
                swimlaneId: { type: 'string', description: 'Swimlane ID' },
                laneId: { type: 'string', description: 'Lane ID' }
            },
            required: ['operation']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        operation: { type: 'string' },
                        groupId: { type: 'string' },
                        childrenCount: { type: 'number' },
                        members: { type: 'array', items: { type: 'string' } }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'manageAnnotationsAndLabels',
        description: 'Adds, removes, and modifies annotations, labels, and text content on nodes and connectors. Enables programmatic ' +
            'content updates',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                objectId: { type: 'string', description: 'Object ID to annotate' },
                labelText: { type: 'string', description: 'Label or annotation text' },
                operation: { type: 'string', description: 'Operation (add, update, delete)', enum: ['add', 'update', 'delete'] },
                labelId: { type: 'string', description: 'Annotation ID for update or delete' },
                labelType: { type: 'string', description: 'Type (shapeAnnotation, pathAnnotation, textAnnotation)' },
                position: { type: 'string', description: 'Position (top, bottom, left, right, center)' },
                fontSize: { type: 'number', description: 'Annotation font size' },
                color: { type: 'string', description: 'Annotation text color' },
                horizontalAlignment: { type: 'string', description: 'Horizontal alignment' },
                verticalAlignment: { type: 'string', description: 'Vertical alignment' },
                editMode: { type: 'boolean', description: 'Enable text editing mode' }
            },
            required: ['objectId']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        objectId: { type: 'string' },
                        labelAdded: { type: 'boolean' },
                        labelId: { type: 'string' },
                        text: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'managePorts',
        description: 'Adds and removes ports on nodes. Ports are connection points for connectors. Enables precise connector attachment ' +
            'topology',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                nodeId: { type: 'string', description: 'Node ID to add ports to' },
                action: { type: 'string', description: 'Port operation (add, remove)', enum: ['add', 'remove'] },
                portDefinitions: {
                    type: 'array',
                    items: { type: 'object' },
                    description: 'Per-port configuration: id, offset {x,y}, visibility, shape, width, height, constraints'
                },
                distribution: { type: 'string', description: 'Auto-distribution (left, right, top, bottom, all)' },
                portCount: { type: 'number', description: 'Number of ports to distribute' },
                positions: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Named port positions applied in order: top, bottom, left, right, topLeft, topRight, bottomLeft, ' +
                        'bottomRight, center'
                },
                portId: { type: 'string', description: 'Port ID for removal or a single add' },
                visibility: { type: 'string', description: 'Visibility (Visible, Hidden, Hover, Connect)' }
            },
            required: ['nodeId', 'action']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        nodeId: { type: 'string' },
                        portsAdded: { type: 'number' },
                        portIds: { type: 'array', items: { type: 'string' } },
                        distribution: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'manageLayers',
        description: 'Creates, removes, and manages diagram layers for object organization and visibility control. Enables complex ' +
            'diagram organization',
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                operation: {
                    type: 'string',
                    description: 'Operation (addLayer, removeLayer, moveObjects, reorder)',
                    enum: ['addLayer', 'removeLayer', 'moveObjects', 'reorder']
                },
                layerId: { type: 'string', description: 'Layer ID' },
                layerName: { type: 'string', description: 'Layer name/label' },
                objects: { type: 'array', items: { type: 'string' }, description: 'Object IDs to move' },
                targetLayer: { type: 'string', description: 'Target layer ID' }
            },
            required: ['operation']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        operation: { type: 'string' },
                        layerId: { type: 'string' },
                        layerName: { type: 'string' },
                        visible: { type: 'boolean' }
                    }
                },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'applyLayoutToNodes',
        description: 'Applies a named diagram layout and optionally updates connector stroke color',
        annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true },
        inputSchema: {
            type: 'object',
            properties: {
                layoutType: {
                    type: 'string',
                    description: 'Layout (Hierarchical, Radial, MindMap, Flowchart, Symmetric, ComplexHierarchical)'
                },
                orientation: { type: 'string', description: 'Layout orientation' },
                rootNode: { type: 'string', description: 'Root node ID for root-based layouts' },
                horizontalSpacing: { type: 'number', description: 'Horizontal spacing' },
                verticalSpacing: { type: 'number', description: 'Vertical spacing' },
                connectorStrokeColor: { type: 'string', description: 'Stroke color for all connectors' },
                autoConnect: {
                    type: 'boolean',
                    description: 'Chain unconnected nodes in their current order so a graph layout can run (default: false)'
                }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' }
            }
        }
    },
    {
        name: 'createSpecializedRelationship',
        description: 'Creates specialized relationship connectors for ER diagrams and UML class diagrams with proper cardinality ' +
            'and relationship types. Use this tool for creating relationships between entities or classes.',
        annotations: { readOnlyHint: false },
        inputSchema: {
            type: 'object',
            properties: {
                connectorId: { type: 'string', description: 'Unique identifier for the relationship connector' },
                sourceId: { type: 'string', description: 'Source entity/class ID' },
                targetId: { type: 'string', description: 'Target entity/class ID' },
                relationshipType: {
                    type: 'string',
                    description: 'Type of relationship (oneToOne, oneToMany, manyToMany, association, inheritance, etc.)'
                },
                cardinality: {
                    type: 'string',
                    description: 'Cardinality notation (1..1, 1..*, 0..*, *, etc.)'
                },
                label: { type: 'string', description: 'Relationship label/annotation text' },
                lineType: { type: 'string', description: 'Line routing type (straight, orthogonal, curved)' },
                lineColor: { type: 'string', description: 'Connector line color (hex or named)' },
                lineWidth: { type: 'number', description: 'Connector line thickness' },
                startDecorator: { type: 'string', description: 'Start decorator (arrow, circle, diamond, etc.)' },
                endDecorator: { type: 'string', description: 'End decorator (arrow, circle, diamond, etc.)' }
            },
            required: ['sourceId', 'targetId']
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                data: {
                    type: 'object',
                    properties: {
                        connectorId: { type: 'string' },
                        sourceId: { type: 'string' },
                        targetId: { type: 'string' },
                        status: { type: 'string' },
                        relationshipType: { type: 'string' },
                        cardinality: { type: 'string' }
                    }
                },
                message: { type: 'string' }
            }
        }
    }
];

/**
 * Loosely typed argument bag. Tool arguments arrive as JSON from an AI client, so their
 * members cannot be described statically; every handler validates what it reads.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WebMcpArgs = { [key: string]: any };

/**
 * Payload of the `getWebMcpTools` notification.
 */
interface WebMcpToolsRequest {
    /** Optional allowlist of tool names to return. */
    toolNames?: string[];
    /** Receives the matching tool definitions. */
    tools?: WebMcpTool[];
}

/**
 * Payload of the `registerWebMcpTools` notification.
 */
interface WebMcpRegisterRequest {
    /** Prefix applied to every registered tool name. */
    prefix?: string;
    /** Allowlist of tool names, or complete custom tool definitions. */
    tools?: string[] | WebMcpTool[];
    /** Origins allowed to reach the tools from a cross-origin iframe. */
    exposedTo?: string[];
}

/**
 * Canonical EJ2 Diagram shape structures keyed by the normalized name an AI client may supply.
 * Keys are lower case with whitespace, underscores and hyphens removed.
 */
const diagramShapeMap: { [key: string]: WebMcpArgs } = {
    // Basic shapes
    'circle': { type: 'Basic', shape: 'Ellipse' },
    'ellipse': { type: 'Basic', shape: 'Ellipse' },
    'rectangle': { type: 'Basic', shape: 'Rectangle' },
    'diamond': { type: 'Basic', shape: 'Diamond' },
    'hexagon': { type: 'Basic', shape: 'Hexagon' },
    'triangle': { type: 'Basic', shape: 'Triangle' },
    'pentagon': { type: 'Basic', shape: 'Pentagon' },
    'heptagon': { type: 'Basic', shape: 'Heptagon' },
    'octagon': { type: 'Basic', shape: 'Octagon' },
    'star': { type: 'Basic', shape: 'Star' },
    'cylinder': { type: 'Basic', shape: 'Cylinder' },
    'plus': { type: 'Basic', shape: 'Plus' },
    'trapezoid': { type: 'Basic', shape: 'Trapezoid' },
    'parallelogram': { type: 'Basic', shape: 'Parallelogram' },
    'righttriangle': { type: 'Basic', shape: 'RightTriangle' },
    'decagon': { type: 'Basic', shape: 'Decagon' },
    'polygon': { type: 'Basic', shape: 'Polygon' },
    // Containers are plain rectangles; the container settings are applied by the node handler.
    'container': { type: 'Basic', shape: 'Rectangle' },
    'group': { type: 'Basic', shape: 'Rectangle' },
    // Flow shapes
    'terminator': { type: 'Flow', shape: 'Terminator' },
    'process': { type: 'Flow', shape: 'Process' },
    'decision': { type: 'Flow', shape: 'Decision' },
    'document': { type: 'Flow', shape: 'Document' },
    'predefinedprocess': { type: 'Flow', shape: 'PreDefinedProcess' },
    'papertap': { type: 'Flow', shape: 'PaperTap' },
    'directdata': { type: 'Flow', shape: 'DirectData' },
    'sequentialdata': { type: 'Flow', shape: 'SequentialData' },
    'sort': { type: 'Flow', shape: 'Sort' },
    'multidocument': { type: 'Flow', shape: 'MultiDocument' },
    'collate': { type: 'Flow', shape: 'Collate' },
    'summingjunction': { type: 'Flow', shape: 'SummingJunction' },
    'or': { type: 'Flow', shape: 'Or' },
    'internalstorage': { type: 'Flow', shape: 'InternalStorage' },
    'extract': { type: 'Flow', shape: 'Extract' },
    'manualoperation': { type: 'Flow', shape: 'ManualOperation' },
    'merge': { type: 'Flow', shape: 'Merge' },
    'offpagereference': { type: 'Flow', shape: 'OffPageReference' },
    'sequentialaccessstorage': { type: 'Flow', shape: 'SequentialAccessStorage' },
    'annotation': { type: 'Flow', shape: 'Annotation' },
    'annotation2': { type: 'Flow', shape: 'Annotation2' },
    'data': { type: 'Flow', shape: 'Data' },
    'card': { type: 'Flow', shape: 'Card' },
    'delay': { type: 'Flow', shape: 'Delay' },
    'preparation': { type: 'Flow', shape: 'Preparation' },
    'display': { type: 'Flow', shape: 'Display' },
    'manualinput': { type: 'Flow', shape: 'ManualInput' },
    'looplimit': { type: 'Flow', shape: 'LoopLimit' },
    'storeddata': { type: 'Flow', shape: 'StoredData' },
    // BPMN shapes
    'event': { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } },
    'bpmnstart': { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } },
    'bpmnstartevent': { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'None' } },
    'bpmnend': { type: 'Bpmn', shape: 'Event', event: { event: 'End', trigger: 'None' } },
    'bpmnendevent': { type: 'Bpmn', shape: 'Event', event: { event: 'End', trigger: 'None' } },
    'bpmnintermediateevent': { type: 'Bpmn', shape: 'Event', event: { event: 'Intermediate', trigger: 'None' } },
    'gateway': { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } },
    'bpmngateway': { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } },
    'bpmndecision': { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'Exclusive' } },
    'message': { type: 'Bpmn', shape: 'Message' },
    'dataobject': { type: 'Bpmn', shape: 'DataObject', dataObject: { type: 'None', collection: false } },
    'datasource': { type: 'Bpmn', shape: 'DataSource' },
    'activity': { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task', task: { type: 'None' } } },
    'bpmnactivity': { type: 'Bpmn', shape: 'Activity', activity: { activity: 'Task', task: { type: 'None' } } },
    'bpmngroup': { type: 'Bpmn', shape: 'Group' },
    'textannotation': { type: 'Bpmn', shape: 'TextAnnotation' },
    // Swimlane
    'swimlane': { type: 'SwimLane', orientation: 'Horizontal' },
    // ER shapes
    'entity': { type: 'Er', shape: 'Entity', fields: [] },
    'erentity': { type: 'Er', shape: 'Entity', fields: [] },
    'table': { type: 'Er', shape: 'Entity', fields: [] },
    // UML shapes
    'umlclass': { type: 'UmlClassifier', classifier: 'Class', classShape: { name: 'Class', attributes: [], methods: [] } },
    'class': { type: 'UmlClassifier', classifier: 'Class', classShape: { name: 'Class', attributes: [], methods: [] } },
    'classdiagram': { type: 'UmlClassifier', classifier: 'Class', classShape: { name: 'Class', attributes: [], methods: [] } },
    'action': { type: 'UmlActivity', shape: 'Action' },
    'umlaction': { type: 'UmlActivity', shape: 'Action' },
    'umldecision': { type: 'UmlActivity', shape: 'Decision' },
    'mergenode': { type: 'UmlActivity', shape: 'MergeNode' },
    'initialnode': { type: 'UmlActivity', shape: 'InitialNode' },
    'finalnode': { type: 'UmlActivity', shape: 'FinalNode' },
    'forknode': { type: 'UmlActivity', shape: 'ForkNode' },
    'joinnode': { type: 'UmlActivity', shape: 'JoinNode' },
    'timeevent': { type: 'UmlActivity', shape: 'TimeEvent' },
    'acceptingevent': { type: 'UmlActivity', shape: 'AcceptingEvent' },
    'sendsignal': { type: 'UmlActivity', shape: 'SendSignal' },
    'receivesignal': { type: 'UmlActivity', shape: 'ReceiveSignal' },
    'structurednode': { type: 'UmlActivity', shape: 'StructuredNode' },
    'note': { type: 'UmlActivity', shape: 'Note' },
    // Additional shapes for better AI recognition
    'customer': { type: 'Er', shape: 'Entity', fields: [] },
    'order': { type: 'Er', shape: 'Entity', fields: [] },
    'product': { type: 'Er', shape: 'Entity', fields: [] },
    'library': { type: 'UmlClassifier', classifier: 'Class', classShape: { name: 'Library', attributes: [], methods: [] } },
    'book': { type: 'UmlClassifier', classifier: 'Class', classShape: { name: 'Book', attributes: [], methods: [] } },
    'member': { type: 'UmlClassifier', classifier: 'Class', classShape: { name: 'Member', attributes: [], methods: [] } },
    'loan': { type: 'UmlClassifier', classifier: 'Class', classShape: { name: 'Loan', attributes: [], methods: [] } },
    // ER diagram specific shapes
    'erdiagram': { type: 'Er', shape: 'Entity', fields: [] },
    'erd': { type: 'Er', shape: 'Entity', fields: [] },
    // Additional common entities for order management system
    'customerid': { type: 'Er', shape: 'Entity', fields: [] },
    'name': { type: 'Er', shape: 'Entity', fields: [] },
    'email': { type: 'Er', shape: 'Entity', fields: [] },
    'phonenumber': { type: 'Er', shape: 'Entity', fields: [] },
    'orderid': { type: 'Er', shape: 'Entity', fields: [] },
    'orderdate': { type: 'Er', shape: 'Entity', fields: [] },
    'totalamount': { type: 'Er', shape: 'Entity', fields: [] },
    'productid': { type: 'Er', shape: 'Entity', fields: [] },
    'productname': { type: 'Er', shape: 'Entity', fields: [] },
    'price': { type: 'Er', shape: 'Entity', fields: [] },
    'category': { type: 'Er', shape: 'Entity', fields: [] },
    // Relationship types for ER diagrams
    'relationship': { type: 'Basic', shape: 'Rectangle' },
    'onerelationship': { type: 'Basic', shape: 'Rectangle' },
    'manyrelationship': { type: 'Basic', shape: 'Rectangle' },
    // UML relationship types
    'association': { type: 'Basic', shape: 'Rectangle' },
    'inheritance': { type: 'Basic', shape: 'Rectangle' },
    'dependency': { type: 'Basic', shape: 'Rectangle' },
    'aggregation': { type: 'Basic', shape: 'Rectangle' },
    'composition': { type: 'Basic', shape: 'Rectangle' }
};

/**
 * WebMcpDiagram — Integrates Diagram with WebMCP protocol
 * Manages tool registration, execution, and communication with the MCP server
 */
export class WebMcpDiagram {
    private parent: Diagram = null as Diagram;
    private webMcpAbortController: AbortController = null;
    private listenersAttached: boolean = false;
    private savedNodeConstraints: { [id: string]: number } = {};
    private savedConnectorConstraints: { [id: string]: number } = {};
    private getToolsHandler: Function = null;
    private registerToolsHandler: Function = null;
    private unregisterToolsHandler: Function = null;
    private destroyHandler: Function = null;
    private registeredToolNames: string[] = [];

    /**
     * Creates the adapter. The module loader supplies the owning diagram.
     *
     * @param {Diagram} parent - The diagram instance that owns this adapter.
     */
    public constructor(parent?: Diagram) {
        this.parent = parent || null;
        if (parent) {
            this.addEventListener();
        }
    }

    /**
     * Initializes the WebMCP adapter with the parent diagram.
     * Called by the parent Diagram component after module injection.
     *
     * @param {Diagram} parent - The diagram instance that owns this adapter.
     * @returns {void}
     */
    public init(parent: Diagram): void {
        if (this.parent && this.parent !== parent) {
            this.removeEventListener();
        }
        this.parent = parent || null;
        this.addEventListener();
    }

    /**
     * Registers listeners for the getWebMcpTools and registerWebMcpTools notifications.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (isNullOrUndefined(this.parent) || this.listenersAttached) {
            return;
        }
        this.getToolsHandler = (args: WebMcpToolsRequest): void => {
            this.getTools(args);
        };
        this.registerToolsHandler = (args: WebMcpRegisterRequest): void => {
            this.registerTools(args);
        };
        this.unregisterToolsHandler = (): void => {
            this.unregisterTools();
        };
        this.destroyHandler = (): void => {
            this.destroy();
        };
        this.parent.on('getWebMcpTools', this.getToolsHandler, this);
        this.parent.on('registerWebMcpTools', this.registerToolsHandler, this);
        this.parent.on('unregisterWebMcpTools', this.unregisterToolsHandler, this);
        // Diagram.destroy raises this notification before the component tears itself down.
        this.parent.on('destroy', this.destroyHandler, this);
        this.listenersAttached = true;
    }

    /**
     * Removes the notification listeners registered by this adapter.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (isNullOrUndefined(this.parent) || this.parent.isDestroyed || !this.listenersAttached) {
            this.listenersAttached = false;
            return;
        }
        this.parent.off('getWebMcpTools', this.getToolsHandler);
        this.parent.off('registerWebMcpTools', this.registerToolsHandler);
        this.parent.off('unregisterWebMcpTools', this.unregisterToolsHandler);
        this.parent.off('destroy', this.destroyHandler);
        this.getToolsHandler = null;
        this.registerToolsHandler = null;
        this.unregisterToolsHandler = null;
        this.destroyHandler = null;
        this.listenersAttached = false;
    }

    /**
     * Creates an isolated copy of a tool definition so callers cannot mutate the shared registry.
     *
     * @param {WebMcpTool} tool - The tool definition to clone.
     * @returns {WebMcpTool} - A deep copy of the supplied tool definition.
     */
    private cloneTool(tool: WebMcpTool): WebMcpTool {
        const clone: WebMcpTool = {
            name: tool.name,
            description: tool.description,
            inputSchema: JSON.parse(JSON.stringify(tool.inputSchema)),
            outputSchema: JSON.parse(JSON.stringify(tool.outputSchema)),
            annotations: JSON.parse(JSON.stringify(tool.annotations))
        };
        if (tool.execute) {
            clone.execute = tool.execute;
        }
        return clone;
    }

    /**
     * Retrieves available tools, optionally filtered by name.
     *
     * @param {WebMcpToolsRequest} args - Holds the optional name filter and receives the resulting tools.
     * @returns {WebMcpTool[]} - The matching tool definitions.
     */
    private getTools(args: WebMcpToolsRequest): WebMcpTool[] {
        const toolNames: string[] = <string[]>args.toolNames;
        if (toolNames && toolNames.length !== 0) {
            args.tools = webMcpTools.filter((webMcpTool: WebMcpTool) => toolNames.indexOf(webMcpTool.name) !== -1)
                .map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        } else {
            args.tools = webMcpTools.map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        }
        return args.tools;
    }

    /**
     * Registers tools on document.modelContext so AI clients can discover and invoke them.
     *
     * @param {WebMcpRegisterRequest} args - Registration options: name prefix, tool filter or definitions, and allowed origins.
     * @returns {void}
     */
    /**
     * Registers tools for WebMCP integration. Called automatically when webMcpSettings is configured.
     *
     * @param {WebMcpRegisterRequest} args - Tool registration request containing prefix, tools, and exposedTo
     * @returns {void}
     */
    public registerTools(args: WebMcpRegisterRequest): void {
        const modelContext: { registerTool: Function } =
            <{ registerTool: Function }>(document as { modelContext?: { registerTool: Function } }).modelContext;
        if (!modelContext || typeof modelContext.registerTool !== 'function') {
            return;
        }
        this.webMcpAbortController = new AbortController();
        const toolPrefix: string = (isNullOrUndefined(args.prefix) ? this.parent.element.id : args.prefix) as string;
        const tools: WebMcpTool[] = args.tools && args.tools.length && typeof args.tools[0] === 'object' ? <WebMcpTool[]>args.tools :
            this.getTools({ toolNames: <string[]>args.tools });
        tools.forEach((tool: WebMcpTool): void => {
            tool.name = `${toolPrefix}_${tool.name}`;
            tool.execute = tool.execute || (async (args: object) => this.executeHandler(tool.name, args || {}));
            const registerOptions: { signal: AbortSignal; exposedTo?: string[] } = {
                signal: (<AbortController>this.webMcpAbortController).signal
            };
            if (Array.isArray(args.exposedTo) && args.exposedTo.length > 0) {
                registerOptions.exposedTo = args.exposedTo;
            }
            modelContext.registerTool(tool, registerOptions);
        });
    }

    /**
     * Revokes every tool previously registered by this adapter instance.
     *
     * @returns {void}
     */
    public unregisterTools(): void {
        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }
        this.registeredToolNames = [];
    }

    /**
     * Resolves a registered (possibly prefixed) tool name back to its base command name.
     * Matching against the registry avoids breaking on prefixes that contain underscores.
     *
     * @param {string} command - The registered tool name received from the MCP client.
     * @returns {string} - The base command name used for handler dispatch.
     */
    private resolveBaseCommand(command: string): string {
        if (!command) {
            return command;
        }
        // Direct hit on a registered base name
        for (const tool of webMcpTools) {
            if (command === tool.name || command.endsWith(`_${tool.name}`)) {
                return tool.name;
            }
        }
        // Strip any trailing '_toolName' style suffix that a prefix may have introduced
        for (const tool of webMcpTools) {
            const suffix: string = `_${tool.name}`;
            const idx: number = command.lastIndexOf(suffix);
            if (idx !== -1 && idx + suffix.length === command.length) {
                return tool.name;
            }
        }
        return command;
    }

    /**
     * Asks the end user to confirm a tool execution when the application requests it.
     *
     * @param {WebMcpToolExecuteEventArgs} eventArgs - The event arguments raised for this execution.
     * @returns {boolean} - True when the execution may proceed.
     */
    private confirmExecution(eventArgs: WebMcpToolExecuteEventArgs): boolean {
        if (typeof window === 'undefined' || typeof window.confirm !== 'function') {
            // No way to ask the user: fail closed rather than silently running a destructive tool.
            return false;
        }
        return window.confirm(`Allow the AI assistant to run "${eventArgs.toolName}" on this diagram?`);
    }

    /**
     * Builds the response returned to the AI client when an execution is refused.
     *
     * @param {string} command - The tool that was refused.
     * @param {string} reason - Optional application supplied message.
     * @returns {WebMcpToolResponse} - The cancellation response.
     */
    private cancelled(command: string, reason?: string): WebMcpToolResponse {
        return this.message({
            success: false,
            action: command,
            cancelled: true,
            message: reason || `[USER_CANCELLED] Tool "${command}" was cancelled. This is final. Do NOT retry.`
        });
    }

    /**
     * Executes a WebMCP tool handler and raises beforeWebMcpToolExecute for cancellation or confirmation.
     *
     * @param {string} command - The tool name to execute.
     * @param {Object} args - The arguments supplied by the AI client.
     * @returns {Promise<WebMcpToolResponse>} - The tool response.
     */
    private async executeHandler(command: string, args: Object): Promise<WebMcpToolResponse> {
        if (!this.ensureParent()) {
            return this.error('WebMcpDiagram is not properly initialized. Parent diagram is not available.');
        }
        const baseCommand: string = this.resolveBaseCommand(command);
        const eventArgs: WebMcpToolExecuteEventArgs = {
            cancel: false,
            toolName: baseCommand,
            registeredName: command,
            toolArgs: args,
            showConfirmationDialog: false
        };
        this.parent.trigger('beforeWebMcpToolExecute', eventArgs);

        if (eventArgs.cancel) {
            return this.cancelled(baseCommand, eventArgs.cancellationResponse);
        }
        if (eventArgs.showConfirmationDialog && !this.confirmExecution(eventArgs)) {
            return this.cancelled(baseCommand, eventArgs.cancellationResponse);
        }

        try {
            // Route to the appropriate tool handler.
            switch (baseCommand) {
            case 'createDiagramNode':
            case 'createSpecializedDiagramNode':
                return this.handleCreateDiagramNode(args);
            case 'createDiagramConnector':
                return this.handleCreateDiagramConnector(args);
            case 'createSpecializedRelationship':
                return this.createSpecializedRelationship(args);
            case 'manageNodeSelection':
                return this.handleManageNodeSelection(args);
            case 'manageInteractionMode':
                return this.handleManageInteractionMode(args);
            case 'enableEditingMode':
                return this.handleManageInteractionMode({ mode: (args as { enabled?: boolean }).enabled ? 'readWrite' : 'readOnly' });
            case 'arrangeAndAlignObjects':
                return this.handleArrangeAndAlignObjects(args);
            case 'deleteFromDiagram':
                return this.handleDeleteFromDiagram(args);
            case 'manageUndoRedo':
                return this.handleManageUndoRedo(args);
            case 'manageClipboardOperations':
                return this.handleManageClipboardOperations(args);
            case 'exportAndImportDiagrams':
                return this.handleExportAndImportDiagrams(args);
            case 'arrangeZOrder':
                return this.handleArrangeZOrder(args);
            case 'navigateAndZoomDiagram':
            case 'zoomAndPan':
            case 'fitToPage':
            case 'pan':
                return this.handleNavigateAndZoomDiagram(args);
            case 'manageGroupsAndHierarchies':
                return this.handleManageGroupsAndHierarchies(args);
            case 'manageAnnotationsAndLabels':
                return this.handleManageAnnotationsAndLabels(args);
            case 'managePorts':
                return this.handleManagePorts(args);
            case 'manageLayers':
                return this.handleManageLayers(args);
            case 'applyLayoutToNodes':
                return this.handleApplyLayoutToNodes(args);
            default: return this.error(`Tool "${baseCommand}" not found.`);
            }
        } catch (err) {
            return this.error(`Tool execution failed: ${(err as Error).message || 'Unknown error'}`);
        }
    }

    /**
     * Verifies that a usable parent diagram is attached before a handler runs.
     *
     * @returns {boolean} - True when the parent diagram is available.
     */
    private ensureParent(): boolean {
        return !isNullOrUndefined(this.parent) && !this.parent.isDestroyed;
    }

    /**
     * Converts a constraint name, or list of names, into the numeric bit flag value.
     * Values are read from the enum itself so they cannot drift from the component.
     *
     * @param {string | string[] | number} value - The constraint name(s) or an already numeric value.
     * @param {Object} constraintEnum - The constraint enum to resolve names against.
     * @param {string[]} unknown - Receives any names that could not be resolved.
     * @returns {number} - The combined bit flag value, or undefined when nothing resolved.
     */
    private toConstraints(value: string | string[] | number, constraintEnum: Object, unknown: string[] = []): number {
        if (typeof value === 'number') {
            return value;
        }
        const names: string[] = Array.isArray(value) ? value : (value ? [value] : []);
        if (names.length === 0) {
            return undefined;
        }
        let result: number = 0;
        let resolved: boolean = false;
        for (const name of names) {
            const flag: number = (constraintEnum as { [key: string]: number })[`${name}`];
            if (typeof flag === 'number') {
                result |= flag;
                resolved = true;
            } else {
                unknown.push(name);
            }
        }
        return resolved ? result : undefined;
    }

    /**
     * Rejects hyperlink values that could execute script when the annotation is clicked.
     *
     * @param {string} link - The hyperlink supplied by the AI client.
     * @returns {boolean} - True when the link uses a safe scheme.
     */
    private isSafeHyperlink(link: string): boolean {
        if (typeof link !== 'string' || link.length === 0) {
            return false;
        }
        return !(/^\s*(javascript|data|vbscript):/i).test(link);
    }

    /**
     * Builds an annotation object from tool arguments, optionally inheriting from an existing annotation.
     *
     * @param {Object} args - The tool arguments holding the label text and style overrides.
     * @param {string} content - The annotation text.
     * @param {Object} previous - Optional existing annotation whose values are used as defaults.
     * @param {string} id - Optional annotation id.
     * @returns {Object} - The annotation definition.
     */
    private buildAnnotation(args: WebMcpArgs, content: string, previous?: WebMcpArgs, id?: string): WebMcpArgs {
        const prevStyle: WebMcpArgs = (previous ? previous.style as WebMcpArgs : {}) || {};
        const style: WebMcpArgs = {
            color: args.labelColor || args.fontColor || args.color || prevStyle.color || 'black',
            fontSize: args.labelFontSize || args.fontSize || prevStyle.fontSize || 12,
            bold: args.labelBold || args.bold || prevStyle.bold || false,
            italic: args.labelItalic || args.italic || prevStyle.italic || false,
            fontFamily: args.labelFontFamily || args.fontFamily || prevStyle.fontFamily || 'Arial'
        };
        const textAlign: Object = args.labelTextAlign || args.textAlign || prevStyle.textAlign;
        if (textAlign !== undefined) {
            style.textAlign = textAlign;
        }
        const textDecoration: Object = args.labelTextDecoration || args.textDecoration || prevStyle.textDecoration;
        if (textDecoration !== undefined) {
            style.textDecoration = textDecoration;
        }
        const fill: Object = args.labelFill || args.fill || prevStyle.fill;
        if (fill !== undefined) {
            style.fill = fill;
        }
        const annotation: WebMcpArgs = {
            content: content,
            style: style,
            horizontalAlignment: args.labelHorizontalAlignment || args.labelAlignment || args.horizontalAlignment ||
                (previous ? previous.horizontalAlignment : undefined) || 'Center',
            verticalAlignment: args.labelVerticalAlignment || args.verticalAlignment ||
                (previous ? previous.verticalAlignment : undefined) || 'Center',
            margin: args.labelOffset || args.labelMargin || args.margin ||
                (previous ? previous.margin : undefined) ||
                { left: 0, top: 0, right: 0, bottom: 0 }
        };
        if (id !== undefined) {
            annotation.id = id;
        }
        const width: Object = args.labelWidth || args.width;
        if (width !== undefined) {
            annotation.width = width;
        }
        const height: Object = args.labelHeight || args.height;
        if (height !== undefined) {
            annotation.height = height;
        }
        if (args.rotateAngle !== undefined) {
            annotation.rotateAngle = args.rotateAngle;
        }
        if (args.template !== undefined) {
            annotation.template = args.template;
        }
        if (args.hyperlink !== undefined) {
            // hyperlink may arrive as a plain string or as a HyperlinkModel; both are screened.
            const link: string = typeof args.hyperlink === 'string'
                ? args.hyperlink : (args.hyperlink as WebMcpArgs).link;
            if (this.isSafeHyperlink(link)) {
                annotation.hyperlink = typeof args.hyperlink === 'string' ? { link: args.hyperlink } : args.hyperlink;
            }
        }

        // Handle specialized annotations for ER and UML diagrams
        if (args.annotationType) {
            annotation.type = args.annotationType;
            // Add cardinality information for ER relationships
            if (args.annotationType === 'ERRelationship') {
                annotation.cardinality = args.cardinality || '1..1';
                annotation.relationshipType = args.relationshipType || 'association';
            }
            // Add multiplicity information for UML associations
            else if (args.annotationType === 'UMLAssociation') {
                annotation.multiplicity = args.multiplicity || '1';
                annotation.stereotype = args.stereotype || '';
            }
        }

        return annotation;
    }
    /**
     * Returns the currently selected nodes and connectors.
     *
     * @returns {Object[]} - The selected diagram objects.
     */
    private getSelectedObjects(): WebMcpArgs[] {
        const selected: WebMcpArgs = (this.parent.selectedItems as WebMcpArgs) || {};
        const nodes: WebMcpArgs[] = (selected.nodes as WebMcpArgs[]) || [];
        const connectors: WebMcpArgs[] = (selected.connectors as WebMcpArgs[]) || [];
        return nodes.concat(connectors);
    }

    /**
     * Maps user-friendly shape input to EJ2 Diagram hierarchical shape structure
     * EJ2 shapes are NOT flat strings - they require type + shape + optional sub-properties
     */
    /**
     * Normalizes a shape name to the key format used by diagramShapeMap.
     *
     * @param {string} shapeInput - The shape name supplied by the AI client.
     * @returns {string} - The normalized lookup key.
     */
    private normalizeShapeName(shapeInput: string): string {
        return (shapeInput || '').toLowerCase().trim().replace(/[\s_-]/g, '');
    }

    /**
     * Indicates whether the supplied shape name is known to the adapter.
     *
     * @param {string} shapeInput - The shape name supplied by the AI client.
     * @returns {boolean} - True when the name resolves to a canonical shape.
     */
    private isKnownShape(shapeInput: string): boolean {
        return !!diagramShapeMap[this.normalizeShapeName(shapeInput)];
    }

    /**
     * Maps a user friendly shape name to the hierarchical EJ2 Diagram shape structure.
     * EJ2 shapes are not flat strings: they require a type, a shape and optional sub properties.
     * Unknown names fall back to a basic rectangle; callers should surface that with isKnownShape.
     *
     * @param {string} shapeInput - The shape name supplied by the AI client.
     * @returns {Object} - The canonical shape structure.
     */
    private mapShapeToStructure(shapeInput: string): WebMcpArgs {
        const definition: WebMcpArgs = diagramShapeMap[this.normalizeShapeName(shapeInput)];
        return definition ? JSON.parse(JSON.stringify(definition)) : { type: 'Basic', shape: 'Rectangle' };
    }
    /**
     * Builds the shape structure for a node, applying swimlane, ER, UML and BPMN sub properties.
     *
     * @param {Object} args - The tool arguments describing the node.
     * @returns {Object} - The shape structure to assign to the node.
     */
    private buildSpecializedShape(args: WebMcpArgs): WebMcpArgs {
        const shapeName: string = this.normalizeShapeName(args.shape);
        // Containers and groups are rendered as plain rectangles; container settings are applied separately.
        if (shapeName === 'container' || shapeName === 'group') {
            return { type: 'Basic', shape: 'Rectangle' };
        }
        const shape: WebMcpArgs = this.mapShapeToStructure(args.shape);
        if (shape.type === 'SwimLane') {
            shape.orientation = args.orientation || 'Horizontal';
            shape.phaseSize = args.phaseSize || 20;
            shape.header = args.header || { annotation: { content: args.label || 'Swimlane' } };
            shape.phases = args.phases || [{
                id: `${args.nodeId}_phase_1`,
                offset: args.phaseOffset || 100,
                header: { annotation: { content: args.phaseLabel || 'Phase 1' } }
            }];
            shape.lanes = args.lanes || [{
                id: `${args.nodeId}_lane_1`,
                height: args.laneHeight || Math.max(100, ((args.height || 300) - 50)),
                header: { annotation: { content: args.laneLabel || 'Lane 1' } },
                children: []
            }];
        } else if (shape.type === 'Er') {
            // Handle ER entity creation with proper fields
            const headerContent: string = args.label || 'Entity';
            shape.header = args.header || { annotation: { content: headerContent.split('\n')[0] || headerContent } };

            // Parse fields from label if not explicitly provided
            let fields: any = args.fields;
            if (!fields && headerContent.includes('\n')) {
                fields = this.parseEntityFields(headerContent);
            }

            shape.fields = this.normalizeErFields(fields || []);
        } else if (shape.type === 'UmlClassifier') {
            // Handle UML class creation with proper attributes and methods
            const className: string = args.label || 'Class';
            let classShape: WebMcpArgs = args.classShape;

            if (!classShape) {
                // Parse class information from label
                classShape = { name: className, attributes: [], methods: [] };

                if (className.includes('\n')) {
                    const lines: string[] = className.split('\n').map((line: string) => line.trim())
                        .filter((line: string) => line.length > 0);
                    classShape.name = lines[0];

                    // Parse attributes and methods from subsequent lines
                    for (let i: number = 1; i < lines.length; i++) {
                        const line: string = lines[parseInt(i.toString(), 10)];
                        if (line.startsWith('+') || line.startsWith('-')) {
                            // This is likely a method or attribute
                            const cleanLine: string = line.replace(/[+-]\s*/, '');
                            if (line.includes('(') && line.includes(')')) {
                                // Method - extract name and parameters
                                // eslint-disable-next-line security/detect-unsafe-regex
                                const methodMatch: RegExpMatchArray = cleanLine.match(/^([^(]+)\(([^)]*)\)(?::\s*(.+))?/);
                                if (methodMatch) {
                                    const methodName: string = methodMatch[1].trim();
                                    const params: string = methodMatch[2].trim();
                                    const returnType: string = methodMatch[3] ? methodMatch[3].trim() : 'void';
                                    classShape.methods.push({
                                        name: methodName,
                                        parameters: params ? params.split(',').map((p: string) => p.trim()) : [],
                                        type: returnType
                                    });
                                } else {
                                    // Fallback for simple method format
                                    classShape.methods.push({ name: cleanLine });
                                }
                            } else {
                                // Attribute - extract name and type
                                const parts: string[] = cleanLine.split(':');
                                classShape.attributes.push({
                                    name: parts[0].trim(),
                                    type: parts[1] ? parts[1].trim() : 'string'
                                });
                            }
                        }
                    }
                }
            } else {
                // Coerce AI supplied attributes/methods (which are sometimes plain strings)
                // into the UmlClassModel shape expected by the engine.
                classShape.attributes = this.normalizeUmlMembers(classShape.attributes, false);
                classShape.methods = this.normalizeUmlMembers(classShape.methods, true);
            }

            // Ensure attributes and methods arrays exist
            if (!classShape.attributes || !Array.isArray(classShape.attributes)) {
                classShape.attributes = [];
            }
            if (!classShape.methods || !Array.isArray(classShape.methods)) {
                classShape.methods = [];
            }

            shape.classShape = classShape;
        } else if (shape.type === 'Bpmn' && shape.shape === 'Event') {
            shape.event = {
                event: args.eventType || shape.event.event,
                trigger: args.trigger || shape.event.trigger || 'None'
            };
        } else if (shape.type === 'Bpmn' && shape.shape === 'Gateway') {
            shape.gateway = { type: args.gatewayType || (shape.gateway && shape.gateway.type) || 'Exclusive' };
        }
        return shape;
    }
    /**
     * Normalizes ER field definitions, accepting the common aliases an AI client may produce.
     * Strips stray (PK)/(FK) markers that an AI sometimes appends to the dataType literal
     * ("INT (PK)") and re-uses them as isPrimaryKey / isForeignKey flags. The EJ2 ER renderer
     * renders the Key column itself via getKeyIndicator(); the marker must never appear in
     * the dataType column.
     *
     * @param {Object[]} fields - The raw field definitions.
     * @returns {Object[]} - The normalized field definitions.
     */
    private normalizeErFields(fields: WebMcpArgs[]): WebMcpArgs[] {
        return (Array.isArray(fields) ? fields : []).map((field: WebMcpArgs, index: number) => {
            const explicitPk: boolean = field.isPrimaryKey === true || field.primaryKey === true || field.pk === true;
            const explicitFk: boolean = field.isForeignKey === true || field.foreignKey === true || field.fk === true;
            // Look at the raw text BEFORE alias resolution so we can strip markers the AI put
            // inside the dataType literal itself ("INT (PK)").
            const rawType: string = (field.dataType || field.type || '').toString();
            const { cleanDataType, hasPk, hasFk } = this.splitErTypeMarkers(rawType);

            // Strip inline (PK)/(FK)/(PK, FK) markers from the name itself — the AI sometimes
            // writes "CustomerID (PK)" — so they don't leak into the rendered Name column.
            let nameText: string = field.name || field.fieldName || field.attribute || `Field ${index + 1}`;
            const nameHasPk: boolean = nameText.includes('(PK)') || nameText.includes('*') || nameText.startsWith('^');
            const nameHasFk: boolean = /\(FK\)/i.test(nameText);
            nameText = nameText.replace(/\(\s*(PK\s*,\s*FK|PK|FK)\s*\)/gi, '')
                .replace(/[*^]/g, '').trim();

            return {
                id: field.id || `field_${index + 1}`,
                name: nameText,
                dataType: cleanDataType || field.dataType || field.type || 'VARCHAR',
                isPrimaryKey: explicitPk || hasPk || nameHasPk,
                isForeignKey: explicitFk || hasFk || nameHasFk,
                constraints: Array.isArray(field.constraints) ? field.constraints : [],
                // Handle cardinality for relationships
                cardinality: field.cardinality || field.relationship || field.multiplicity || ''
            };
        }).filter((field: WebMcpArgs): boolean => !!(field && field.name && field.name.trim() !== ''));
    }

    /**
     * Splits (PK) / (FK) / (PK, FK) markers from the tail of a raw dataType literal.
     * Returns the trimmed dataType without the markers plus the parsed key flags.
     * The renderer adds the key column itself, so we never want these tokens inside dataType.
     *
     * @param {string} rawDataType - The raw dataType supplied by the AI client.
     * @returns {{ cleanDataType: string, hasPk: boolean, hasFk: boolean }} - Sanitized result.
     */
    private splitErTypeMarkers(rawDataType: string): { cleanDataType: string, hasPk: boolean, hasFk: boolean } {
        let hasPk: boolean = false;
        let hasFk: boolean = false;
        let current: string = (rawDataType || '').trim();
        // Pull off "(PK, FK)", "(PK)", "(FK)" — possibly repeated — from the end of the string.
        let changed: boolean = true;
        while (changed) {
            changed = false;
            const match: RegExpMatchArray = current.match(/\s*\(\s*(PK\s*,\s*FK|PK|FK)\s*\)\s*$/i);
            if (match) {
                const marker: string = match[1].toUpperCase().replace(/\s+/g, '');
                if (marker.indexOf('PK') !== -1) {
                    hasPk = true;
                }
                if (marker.indexOf('FK') !== -1) {
                    hasFk = true;
                }
                current = current.substring(0, match.index).trim();
                changed = true;
            }
        }
        return { cleanDataType: current, hasPk: hasPk, hasFk: hasFk };
    }

    /**
     * Coerces a UML attribute or method declaration into the canonical UmlClassModel entry.
     * Accepts an already-formed object, a plain string like "+ addBook(book: Book): void",
     * or an empty value, and guarantees the resulting array only contains the model shape
     * (with name, type, and optional parameters) that the EJ2 engine expects.
     *
     * @param {Object[] | string[]} members - The raw member definitions supplied by the AI.
     * @param {boolean} isMethod - True to coerce method entries, false for attributes.
     * @returns {Object[]} - An array of well-formed UmlClassMembers.
     */
    private normalizeUmlMembers(members: WebMcpArgs[], isMethod: boolean): WebMcpArgs[] {
        if (!Array.isArray(members)) {
            return [];
        }
        return members
            .map((member: WebMcpArgs): WebMcpArgs => {
                if (typeof member === 'string') {
                    return this.parseUmlMemberString(member, isMethod);
                }
                // Already an object: fill in defaults so the engine receives a complete model.
                const name: string = (member.name as string) || (member.propertyName as string) || '';
                return {
                    name: name,
                    type: (member.type as string) || (isMethod ? 'void' : 'string'),
                    scope: (member.scope as string) || (member.visibility as string) || 'Public',
                    parameters: Array.isArray(member.parameters) ? member.parameters : [],
                    style: member.style || {}
                };
            })
            .filter((member: WebMcpArgs): boolean => !!(member && (member.name as string) && ((member.name as string).length > 0)));
    }

    /**
     * Parses a single UML member in the form "+ name: type" or "+ name(params): returnType".
     *
     * @param {string} raw - The raw member string.
     * @param {boolean} isMethod - True for method parsing, false for attribute parsing.
     * @returns {Object} - The parsed UmlClassMember.
     */
    private parseUmlMemberString(raw: string, isMethod: boolean): WebMcpArgs {
        let source: string = (raw || '').trim();
        if (!source) {
            return { name: '', type: isMethod ? 'void' : 'string', scope: 'Public', parameters: [] };
        }
        let scope: string = 'Public';
        const visibility: string = source.charAt(0);
        if (visibility === '+') {
            scope = 'Public';
            source = source.substring(1).trim();
        } else if (visibility === '-') {
            scope = 'Private';
            source = source.substring(1).trim();
        } else if (visibility === '#') {
            scope = 'Protected';
            source = source.substring(1).trim();
        } else {
            scope = 'Package';
        }
        // eslint-disable-next-line security/detect-unsafe-regex
        const nameTypeMatch: RegExpMatchArray = source.match(/^([\w$]+(?:\s*<[^>]*>)?)\s*(?:\(([^)]*)\))?\s*:?\s*(.*)$/);
        if (!nameTypeMatch) {
            return { name: source.replace(/\(.*\)/, '').trim(), type: isMethod ? 'void' : 'string', scope: scope, parameters: [] };
        }
        const name: string = nameTypeMatch[1].trim();
        const params: string = (nameTypeMatch[2] || '').trim();
        const explicit: string = (nameTypeMatch[3] || '').trim();
        // Detect whether the source had parentheses; that determines method vs attribute.
        const hadParens: boolean = /\(/.test(source);
        if (hadParens || isMethod) {
            const parameters: WebMcpArgs[] = params
                ? params.split(',').map((p: string): WebMcpArgs => {
                    const trimmed: string = p.trim();
                    const colonAt: number = trimmed.lastIndexOf(':');
                    if (colonAt > 0) {
                        return { name: trimmed.substring(0, colonAt).trim(), type: trimmed.substring(colonAt + 1).trim() };
                    }
                    return { name: trimmed, type: '' };
                })
                : [];
            return {
                name: name,
                type: explicit || 'void',
                scope: scope,
                parameters: parameters,
                style: {}
            };
        }
        return {
            name: name,
            type: explicit || 'string',
            scope: scope,
            style: {}
        };
    }

    /**
     * Derives ER fields from a multi line label of the form "Entity\nname: type".
     * Also tolerates (PK)/(FK) markers — both inside the name ("CustomerID (PK)") and
     * appended to the dataType literal ("INT (PK)") — and converts them into the dedicated
     * isPrimaryKey / isForeignKey flags rather than leaving them inside the rendered strings.
     *
     * @param {string} label - The label to parse.
     * @returns {Object[]} - The parsed field definitions.
     */
    private parseEntityFields(label: string): WebMcpArgs[] {
        if (!label) {
            return [];
        }
        const lines: string[] = label.split(/\r?\n/).map((line: string) => line.trim())
            .filter((line: string) => line.length > 0);
        // The first line is the entity name and is applied to the header, not to the field list.
        lines.shift();
        return lines.map((line: string, index: number) => {
            // Handle different field formats:
            // 1. "name: type" (standard format)
            // 2. "+ name: type" (with visibility modifier)
            // 3. "name" (just name, default type)
            // 4. "name*: type" (primary key with asterisk)
            // 5. "name (PK): type" (primary key with PK indicator)
            // 6. "name: type (PK)" (PK marker appended to the dataType literal)
            const cleanLine: string = line.replace(/^\+\s*/, ''); // Remove visibility modifiers
            const fieldParts: string[] = cleanLine.split(':');

            let fieldName: string = fieldParts[0].trim();
            const combinedType: string = fieldParts.length > 1 ? fieldParts.slice(1).join(':').trim() : '';

            // Detect and strip markers that appear in the name itself.
            const nameHasPk: boolean = fieldName.includes('*') || fieldName.includes('(PK)') || fieldName.startsWith('^');
            fieldName = fieldName.replace(/[*^]|\(PK\)/g, '').trim();

            // Detect and strip markers inside the dataType string. Same helper used in
            // normalizeErFields so both code paths produce identical output.
            const { cleanDataType, hasPk: typeHasPk, hasFk: typeHasFk } = this.splitErTypeMarkers(combinedType || 'VARCHAR');

            const isPrimaryKey: boolean = nameHasPk || typeHasPk;
            // Foreign‑key marker may also appear inside the dataType literal or the name.
            const isForeignKey: boolean = /\(FK\)/i.test(fieldName)
                || /\(FK\)/i.test(combinedType || '')
                || fieldName.includes('_id')
                || fieldName.includes('Id')
                || typeHasFk;

            return {
                id: `field_${index + 1}`,
                name: fieldName,
                dataType: cleanDataType || 'VARCHAR',
                isPrimaryKey: isPrimaryKey,
                isForeignKey: isForeignKey
            };
        }).filter((field: WebMcpArgs): boolean => !!(field && field.name && field.name.length > 0));
    }
    /**
     * Normalizes node style aliases, mapping stroke to the strokeColor member used by the model.
     *
     * @param {Object} style - The style supplied by the AI client.
     * @returns {Object} - The normalized style, or undefined when nothing was supplied.
     */
    private normalizeNodeStyle(style: WebMcpArgs): WebMcpArgs {
        if (!style) {
            return undefined;
        }
        const normalized: WebMcpArgs = { ...style };
        if (normalized.strokeColor === undefined && normalized.stroke !== undefined) {
            normalized.strokeColor = normalized.stroke;
        }
        delete normalized.stroke;
        return normalized;
    }

    /**
     * Resolves a decorator name to a valid DecoratorShape value.
     *
     * @param {string} value - The decorator name supplied by the AI client.
     * @param {string} fallback - The value used when the name cannot be resolved.
     * @returns {string} - A valid decorator shape name.
     */
    private normalizeDecorator(value: string, fallback: string): string {
        const decorators: { [key: string]: string } = {
            arrow: 'Arrow', none: 'None', diamond: 'Diamond', openarrow: 'OpenArrow',
            circle: 'Circle', square: 'Square', fletch: 'Fletch', openfetch: 'OpenFetch',
            indentedarrow: 'IndentedArrow', outdentedarrow: 'OutdentedArrow', doublearrow: 'DoubleArrow', custom: 'Custom'
        };
        return value && decorators[value.toLowerCase()] ? decorators[value.toLowerCase()] : fallback;
    }

    /**
     * Resolves a routing description to a valid connector type.
     *
     * @param {string} value - The routing description supplied by the AI client.
     * @returns {string} - Straight, Bezier or Orthogonal.
     */
    private normalizeConnectorType(value: string): string {
        const type: string = (value || '').toLowerCase();
        if (type.indexOf('straight') >= 0) {
            return 'Straight';
        }
        if (type.indexOf('bezier') >= 0 || type.indexOf('curved') >= 0 || type.indexOf('curve') >= 0) {
            return 'Bezier';
        }
        if (type.indexOf('orthogonal') >= 0 || type.indexOf('bent') >= 0 ||
            type.indexOf('right-angle') >= 0 || type.indexOf('right angle') >= 0) {
            return 'Orthogonal';
        }
        return 'Orthogonal';
    }

    /**
     * Resolves a port visibility name to its numeric PortVisibility value.
     *
     * @param {string | number} value - The visibility name or an already numeric value.
     * @returns {number} - The numeric port visibility.
     */
    private normalizePortVisibility(value: string | number): number {
        if (typeof value === 'number') {
            return value;
        }
        const visibility: { [key: string]: number } = {
            visible: PortVisibility.Visible, hidden: PortVisibility.Hidden,
            hover: PortVisibility.Hover, connect: PortVisibility.Connect, default: PortVisibility.Connect
        };
        return visibility[(value || 'Connect').toString().toLowerCase()] || PortVisibility.Connect;
    }

    /**
     * Finds a node by id.
     *
     * @param {string} id - The node id.
     * @returns {Object} - The matching node, or undefined.
     */
    private findNode(id: string): WebMcpArgs {
        for (const node of this.parent.nodes) {
            if (node.id === id) {
                return node;
            }
        }
        return undefined;
    }

    /**
     * Inspects the source and target node shapes to infer the right connector shape when
     * the AI client did not provide one. Returns undefined when no inference applies.
     *
     * BPMN-to-BPMN edges default to a Sequence flow so the correct BPMN marker renders;
     * UML class-to-UML class edges default to an Association relationship so UML class
     * notation applies; ER-to-ER edges default to a NonIdentifying Er relationship.
     *
     * @param {string} sourceId - The source node id.
     * @param {string} targetId - The target node id.
     * @returns {Object} - The inferred connector shape, or undefined.
     */
    private inferConnectorShape(sourceId: string, targetId: string): WebMcpArgs {
        const sourceShape: WebMcpArgs = ((this.findNode(sourceId) || {}).shape as WebMcpArgs) || {};
        const targetShape: WebMcpArgs = ((this.findNode(targetId) || {}).shape as WebMcpArgs) || {};
        const sourceType: string = (sourceShape.type || '').toString();
        const targetType: string = (targetShape.type || '').toString();
        if (sourceType === 'Bpmn' && targetType === 'Bpmn') {
            return { type: 'Bpmn', flow: 'Sequence', sequence: 'Normal' };
        }
        if (sourceType === 'UmlClassifier' && targetType === 'UmlClassifier') {
            return { type: 'UmlClassifier', relationship: 'Association', associationType: 'Default' };
        }
        if (sourceType === 'Er' && targetType === 'Er') {
            return {
                type: 'Er',
                relationship: 'NonIdentifying',
                sourceMultiplicity: { type: 'One' },
                targetMultiplicity: { type: 'One' }
            };
        }
        return undefined as any;
    }

    /**
     * Finds a connector by id.
     *
     * @param {string} id - The connector id.
     * @returns {Object} - The matching connector, or undefined.
     */
    private findConnector(id: string): WebMcpArgs {
        for (const connector of this.parent.connectors) {
            if (connector.id === id) {
                return connector;
            }
        }
        return undefined;
    }

    /**
     * Finds a node or connector by id.
     *
     * @param {string} id - The object id.
     * @returns {Object} - The matching diagram object, or undefined.
     */
    private resolveDiagramObject(id: string): WebMcpArgs {
        return this.findNode(id) || this.findConnector(id);
    }

    /**
     * Picks the swimlane and lane that should own a freshly created node.
     * When the AI supplies both swimlaneId and laneId this is a pass-through. Otherwise, the
     * helper walks every existing SwimLane in the diagram and returns the lane whose vertical
     * strip contains the node's center, which is how nodes are positioned inside lanes visually.
     *
     * @param {Object} node - The node that has just been built and added to the diagram.
     * @param {Object} args - The original tool arguments.
     * @returns {WebMcpArgs} - The {swimlaneId, laneId} pair, or undefined when no lane owns the node.
     */
    private resolveLaneMembership(node: WebMcpArgs, args: WebMcpArgs): WebMcpArgs {
        if (args.swimlaneId && args.laneId) {
            return { swimlaneId: args.swimlaneId, laneId: args.laneId };
        }
        const nodeCenterY: number = (node.offsetY as number) + ((node.height as number) / 2);
        for (const swimlane of this.parent.nodes) {
            const shape: WebMcpArgs = swimlane.shape as WebMcpArgs;
            if (!shape || shape.type !== 'SwimLane') {
                continue;
            }
            // Lane area starts directly below the phase header row (which has height phaseSize).
            const lanes: WebMcpArgs[] = (shape.lanes as WebMcpArgs[]) || [];
            const headerOffset: number = shape.phaseSize as number || 0;
            let laneTop: number = (swimlane.offsetY as number) + headerOffset;
            for (const lane of lanes) {
                const laneHeight: number = (lane.height as number) || 0;
                const laneBottom: number = laneTop + laneHeight;
                if (nodeCenterY >= laneTop && nodeCenterY <= laneBottom && lane.id) {
                    return { swimlaneId: swimlane.id, laneId: lane.id as string };
                }
                laneTop = laneBottom;
            }
        }
        return undefined as WebMcpArgs;
    }

    /**
     * Resolves an alignment name to a valid AlignmentOptions value.
     *
     * @param {string} value - The alignment name supplied by the AI client.
     * @returns {string} - The normalized alignment name.
     */
    private normalizeAlignment(value: string): string {
        const values: { [key: string]: string } = {
            left: 'Left', right: 'Right', center: 'Center', top: 'Top', bottom: 'Bottom', middle: 'Middle'
        };
        return values[(value || '').toLowerCase()] || value;
    }

    /**
     * Resolves a distribution name to a valid DistributeOptions value.
     *
     * @param {string} value - The distribution name supplied by the AI client.
     * @returns {string} - The normalized distribution name.
     */
    private normalizeDistribution(value: string): string {
        const values: { [key: string]: string } = {
            horizontalcenter: 'Center', horizontalspacing: 'Center', verticalcenter: 'Middle',
            verticalspacing: 'Middle', left: 'Left', right: 'Right', top: 'Top', bottom: 'Bottom',
            center: 'Center', middle: 'Middle'
        };
        return values[(value || '').toLowerCase()] || value;
    }

    /**
     * Resolves a sizing name to a valid SizingOptions value.
     *
     * @param {string} value - The sizing name supplied by the AI client.
     * @returns {string} - The normalized sizing name.
     */
    private normalizeSizing(value: string): string {
        const values: { [key: string]: string } = { width: 'Width', height: 'Height', both: 'Size', size: 'Size' };
        return values[(value || '').toLowerCase()] || value;
    }

    /**
     * Tool handlers
     */

    /**
     * Creates a node from the supplied tool arguments.
     *
     * @param {Object} args - The tool arguments describing the node.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleCreateDiagramNode(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const nodeId: string = args.nodeId;
            if (!nodeId) {
                return this.error('nodeId is required');
            }
            if (this.parent.getObject(nodeId)) {
                return this.error(`Object '${nodeId}' already exists. Use an update tool instead.`);
            }

            const warnings: string[] = [];
            const unknownConstraints: string[] = [];
            const constraints: number = this.toConstraints(args.constraints, NodeConstraints, unknownConstraints);
            if (unknownConstraints.length) {
                warnings.push(`Ignored unknown node constraints: ${unknownConstraints.join(', ')}.`);
            }
            if (args.shape && !this.isKnownShape(args.shape)) {
                warnings.push(`Shape '${args.shape}' is not recognized; a Basic Rectangle was used instead.`);
            }

            const shapeName: string = this.normalizeShapeName(args.shape);
            const specializedShape: WebMcpArgs = this.buildSpecializedShape(args);

            // Enhanced error handling for shape creation
            if (!specializedShape || !specializedShape.type) {
                return this.error(`Failed to create shape for node '${nodeId}'. Invalid shape type.`);
            }

            // Top-level annotations on the node are ONLY valid for plain Basic/Flow shapes.
            // Container shapes (Er, UmlClassifier, SwimLane, Bpmn) manage their own internal
            // labels (e.g., shape.header.annotation.content for ER, shape.classShape.name for
            // UML, swimLane.lanes[].header for swimlanes). A redundant top-level annotation
            // on these containers causes the container-rendering pipeline to fight with our
            // annotation and breaks the `children` collection — yielding the
            // "Cannot read properties of undefined (reading 'push')" error inside er-util.
            const annotations: WebMcpArgs[] = [];
            const labelContent: string = args.label || args.labelText;
            const shapeTypeUpper: string = (specializedShape.type || '').toString().toLowerCase();
            const isContainerShape: boolean = shapeTypeUpper === 'er'
                || shapeTypeUpper === 'umlclassifier'
                || shapeTypeUpper === 'swimlane'
                || shapeTypeUpper === 'bpmn';
            if (labelContent && !isContainerShape) {
                annotations.push(this.buildAnnotation(args, labelContent));
            }

            // Container shapes that auto-size from their content must NOT receive an
            // arbitrary width/height from the AI. The renderer computes minWidth from the
            // columnar layout; user-supplied dimensions would be silently overridden or
            // produce clipped fields. ER and UML classifier fall into this category.
            const isAutoSizedContainer: boolean = shapeTypeUpper === 'er'
                || shapeTypeUpper === 'umlclassifier';
            const nodeWidth: number | undefined = isAutoSizedContainer ? undefined : (args.width || 100);
            const nodeHeight: number | undefined = isAutoSizedContainer ? undefined : (args.height || 100);

            const node: WebMcpArgs = {
                id: nodeId,
                offsetX: args.x || args.offsetX || 100,
                offsetY: args.y || args.offsetY || 100,
                width: nodeWidth,
                height: nodeHeight,
                annotations: annotations,
                shape: specializedShape,
                container: args.container || (shapeName === 'container'
                    ? { type: args.containerType || 'Canvas', orientation: args.orientation || 'Vertical' } : undefined),
                style: this.normalizeNodeStyle(args.style),
                constraints: constraints,
                ports: args.ports,
                rotateAngle: args.rotateAngle || 0,
                visible: args.visible !== false,
                isExpanded: args.isExpanded !== false,
                minWidth: args.minWidth,
                minHeight: args.minHeight,
                maxWidth: args.maxWidth,
                maxHeight: args.maxHeight,
                previewSize: args.previewSize,
                margin: args.margin,
                padding: args.padding,
                tooltip: args.tooltip,
                // flipped is a FlipDirection value, so only forward it when a valid string is supplied.
                flipped: typeof args.flipped === 'string' ? args.flipped : undefined,
                excludeFromLayout: args.excludeFromLayout || false,
                addInfo: args.addInfo
            };
            // Do not hand undefined members to the component; they would override model defaults.
            Object.keys(node).forEach((key: string) => {
                if (node[`${key}`] === undefined) {
                    delete node[`${key}`];
                }
            });

            try {
                this.parent.addNode(node as WebMcpArgs);
                this.parent.dataBind();

                if (args.parentId) {
                    this.parent.addChildToGroup({ id: args.parentId } as WebMcpArgs, nodeId);
                    this.parent.dataBind();
                }

                // Resolve lane membership before adding to lane: when an AI client omits
                // swimlaneId/laneId, snap to the lane whose vertical bounds contain the node.
                let swimlaneId: string = args.swimlaneId;
                let laneId: string = args.laneId;
                if (!swimlaneId || !laneId) {
                    const resolved: { swimlaneId: string, laneId: string }
                        = this.resolveLaneMembership(node, args) as { swimlaneId: string, laneId: string };
                    if (resolved) {
                        swimlaneId = swimlaneId || resolved.swimlaneId;
                        laneId = laneId || resolved.laneId;
                    }
                }
                if (swimlaneId && laneId) {
                    this.parent.addNodeToLane(node as WebMcpArgs, swimlaneId, laneId);
                    this.parent.dataBind();
                }

                return this.message({
                    success: true,
                    data: {
                        nodeId: nodeId,
                        status: 'created',
                        shape: node.shape,
                        properties: { x: node.offsetX, y: node.offsetY, width: node.width, height: node.height }
                    },
                    warnings: warnings,
                    message: `Node '${nodeId}' created successfully`
                });
            } catch (addNodeError) {
                // If node was partially added, try to remove it
                if (this.ensureParent() && this.parent.getObject(nodeId)) {
                    try {
                        this.parent.remove(this.parent.getObject(nodeId));
                        this.parent.dataBind();
                    } catch (cleanupError) {
                        // Log cleanup error but don't throw it
                        console.warn(`Failed to cleanup node ${nodeId}: ${(cleanupError as Error).message}`);
                    }
                }
                throw addNodeError;
            }
        } catch (err) {
            return this.error(`Failed to create node: ${(err as Error).message}`);
        }
    }
    /**
     * Creates a connector between two existing nodes.
     *
     * @param {Object} args - The tool arguments describing the connector.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleCreateDiagramConnector(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const connectorId: string = args.connectorId;
            const sourceId: string = args.sourceId;
            const targetId: string = args.targetId;

            if (!connectorId || !sourceId || !targetId) {
                return this.error('connectorId, sourceId, and targetId are required');
            }
            if (!this.findNode(sourceId) || !this.findNode(targetId)) {
                return this.error(`Source '${sourceId}' and target '${targetId}' must be existing nodes`);
            }
            if (this.findConnector(connectorId)) {
                return this.error(`Connector '${connectorId}' already exists`);
            }

            const warnings: string[] = [];
            const unknownConstraints: string[] = [];
            const connectorConstraints: number = this.toConstraints(args.constraints, ConnectorConstraints, unknownConstraints);
            if (unknownConstraints.length) {
                warnings.push(`Ignored unknown connector constraints: ${unknownConstraints.join(', ')}.`);
            }

            const startDecorator: string = this.normalizeDecorator(args.startDecorator, 'None');
            const endDecorator: string = this.normalizeDecorator(args.endDecorator, 'Arrow');
            // Routing is taken only from explicit type members. The label is never inspected,
            // otherwise a label such as "straight to approval" would silently change the routing.
            const typeField: string = args.lineType || args.type || args.connectorType || args.connectorShape || args.shapeType || '';
            const connectorType: string = this.normalizeConnectorType(typeField);

            const annotations: WebMcpArgs[] = [];
            const labelContent: string = args.label || args.labelText;
            if (labelContent) {
                annotations.push(this.buildAnnotation(args, labelContent));
            }

            const connectorStyle: WebMcpArgs = {};
            if (args.lineColor !== undefined) {
                connectorStyle.strokeColor = args.lineColor;
            }
            if (args.lineWidth !== undefined) {
                connectorStyle.strokeWidth = args.lineWidth;
            }
            if (args.lineDashArray !== undefined) {
                connectorStyle.strokeDashArray = args.lineDashArray;
            }

            // Handle specialized connector shapes for BPMN, UML, and ER diagrams
            let connectorShape: WebMcpArgs = args.shape;
            // When the AI omits an explicit shape, infer the right connector type from the
            // node types at both ends. BPMN-to-BPMN edges must produce a Bpmn sequence flow
            // (rendered with the diamond marker); otherwise the renderer falls back to a plain
            // arrow that doesn't match BPMN semantics.
            if (!connectorShape) {
                const inferred: WebMcpArgs = this.inferConnectorShape(sourceId, targetId);
                if (inferred) {
                    connectorShape = inferred;
                }
            }
            if (args.shape) {
                // When the AI client supplies a shape object directly, hand it through untouched
                // so the renderer can apply whatever relationship / cardinality / flow markup it carries.
                if (typeof args.shape === 'object') {
                    connectorShape = args.shape;
                } else {
                    const shapeName: string = this.normalizeShapeName(args.shape);

                    // Handle BPMN connectors
                    if (shapeName.indexOf('bpmn') >= 0) {
                        // Default BPMN flow properties
                        connectorShape = {
                            type: 'Bpmn',
                            flow: args.bpmnFlowType || 'Sequence'
                        };

                        // Set specific properties based on flow type
                        const flowType: string = args.bpmnFlowType || 'Sequence';
                        if (flowType === 'Sequence') {
                            connectorShape.sequence = args.sequenceFlowType || 'Normal';
                        } else if (flowType === 'Message') {
                            connectorShape.message = args.messageFlowType || 'Default';
                        } else if (flowType === 'Association') {
                            connectorShape.association = args.associationFlowType || 'Default';
                        }
                    }
                    // Handle ER relationship connectors
                    else if (shapeName.indexOf('relationship') >= 0 || shapeName.indexOf('er') >= 0) {
                        connectorShape = {
                            type: 'Er',
                            relationship: args.erRelationshipType || 'NonIdentifying',
                            sourceMultiplicity: {
                                type: args.sourceMultiplicity || 'One'
                            },
                            targetMultiplicity: {
                                type: args.targetMultiplicity || 'One'
                            }
                        };
                    }
                    // Handle UML association connectors
                    else if (shapeName.indexOf('association') >= 0 || shapeName.indexOf('uml') >= 0) {
                        connectorShape = {
                            type: 'UmlClassifier',
                            relationship: args.umlRelationshipType || 'Association',
                            associationType: args.associationType || 'Default'
                        };

                        // Add multiplicity if provided
                        if (args.sourceMultiplicity || args.targetMultiplicity) {
                            connectorShape.multiplicity = {
                                source: args.sourceMultiplicity || 'OneToOne',
                                target: args.targetMultiplicity || 'OneToOne'
                            };
                        }
                    }
                }
            }

            const connector: WebMcpArgs = {
                id: connectorId,
                sourceID: sourceId,
                targetID: targetId,
                type: connectorType,
                style: connectorStyle,
                annotations: annotations,
                sourceDecorator: { shape: startDecorator },
                targetDecorator: { shape: endDecorator },
                constraints: connectorConstraints,
                shape: connectorShape,
                segments: args.segments,
                cornerRadius: args.cornerRadius,
                hitPadding: args.hitPadding,
                bridgeSpace: args.bridgeSpace,
                visible: args.visible !== false,
                routing: args.routing || 'Default',
                targetPadding: args.targetPadding,
                sourcePadding: args.sourcePadding,
                tooltip: args.tooltip,
                addInfo: args.addInfo
            };
            Object.keys(connector).forEach((key: string) => {
                if (connector[`${key}`] === undefined) {
                    delete connector[`${key}`];
                }
            });

            try {
                this.parent.addConnector(connector as WebMcpArgs);
                // setProperties ensures the connector type change is picked up by the renderer.
                this.parent.setProperties({ connectors: this.parent.connectors });

                return this.message({
                    success: true,
                    data: {
                        connectorId: connectorId,
                        status: 'created',
                        sourceId: sourceId,
                        targetId: targetId,
                        connectorType: connectorType,
                        labelAdded: !!labelContent
                    },
                    warnings: warnings,
                    message: `Connector '${connectorId}' created successfully as ${connectorType} type between ${sourceId} and ${targetId}`
                });
            } catch (addConnectorError) {
                // Log the error but don't throw it to avoid breaking the flow
                console.warn(`Failed to add connector ${connectorId}: ${(addConnectorError as Error).message}`);
                throw addConnectorError;
            }
        } catch (err) {
            return this.error(`Failed to create connector: ${(err as Error).message}`);
        }
    }
    /**
     * Manages the selection state of nodes and connectors.
     *
     * @param {Object} args - The tool arguments describing the selection request.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManageNodeSelection(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const selectMode: string = args.selectMode || 'multiple';
            const missing: string[] = [];

            if (selectMode === 'all') {
                this.parent.selectAll();
            } else if (selectMode === 'none') {
                this.parent.clearSelection();
            } else if (args.objectIds && args.objectIds.length > 0) {
                const objects: WebMcpArgs[] = (args.objectIds as string[]).map((id: string) => {
                    const resolved: WebMcpArgs = this.parent.getObject(id) || this.resolveDiagramObject(id);
                    if (!resolved) {
                        missing.push(id);
                    }
                    return resolved;
                }).filter((obj: WebMcpArgs) => !!obj);

                if (objects.length === 0) {
                    return this.error(`None of the requested objects exist: ${missing.join(', ')}`);
                }
                if (selectMode === 'single') {
                    this.parent.select([objects[0] as WebMcpArgs], false);
                } else {
                    this.parent.select(objects as WebMcpArgs[], args.multipleSelection !== false);
                }
            }

            const selectedObjects: WebMcpArgs[] = this.getSelectedObjects().map((obj: WebMcpArgs) => ({
                id: obj.id,
                type: this.findConnector(obj.id) ? 'connector' : 'node',
                // Some nodes (container shapes like Er / UmlClassifier / SwimLane / Bpmn) do not
                // expose a top-level annotations array. Guard before accessing [0] so a missing
                // annotations entry cannot blow up the whole selection response.
                label: ((obj.annotations && obj.annotations[0] && obj.annotations[0].content) || '') as string
            }));

            return this.message({
                success: true,
                data: {
                    selectedObjects: selectedObjects,
                    selectionCount: selectedObjects.length,
                    notFound: missing
                },
                message: `${selectedObjects.length} object(s) selected successfully`
            });
        } catch (err) {
            return this.error(`Failed to manage selection: ${(err as Error).message}`);
        }
    }
    /**
     * Switches the diagram between read only and read write interaction.
     *
     * @param {Object} args - The tool arguments holding the requested mode.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManageInteractionMode(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const mode: string = args.mode;
            if (mode !== 'readOnly' && mode !== 'readWrite') {
                return this.error('mode must be readOnly or readWrite');
            }

            if (mode === 'readOnly') {
                this.parent.nodes.forEach((node: WebMcpArgs) => {
                    if (this.savedNodeConstraints[node.id] === undefined) {
                        this.savedNodeConstraints[node.id] = node.constraints;
                    }
                    node.constraints = NodeConstraints.None;
                });
                this.parent.connectors.forEach((connector: WebMcpArgs) => {
                    if (this.savedConnectorConstraints[connector.id] === undefined) {
                        this.savedConnectorConstraints[connector.id] = connector.constraints;
                    }
                    connector.constraints = ConnectorConstraints.None;
                });
                this.parent.setProperties({
                    constraints: this.parent.constraints & ~DiagramConstraints.UserInteraction
                });
                this.parent.clearSelection();
            } else {
                this.parent.nodes.forEach((node: WebMcpArgs) => {
                    node.constraints = this.savedNodeConstraints[node.id] !== undefined
                        ? this.savedNodeConstraints[node.id] : NodeConstraints.Default;
                });
                this.parent.connectors.forEach((connector: WebMcpArgs) => {
                    connector.constraints = this.savedConnectorConstraints[connector.id] !== undefined
                        ? this.savedConnectorConstraints[connector.id] : ConnectorConstraints.Default;
                });
                // Drop the snapshot so a later readOnly cycle captures the current constraints.
                this.savedNodeConstraints = {};
                this.savedConnectorConstraints = {};
                this.parent.setProperties({
                    constraints: this.parent.constraints | DiagramConstraints.UserInteraction
                });
            }
            this.parent.setProperties({ nodes: this.parent.nodes, connectors: this.parent.connectors });
            return this.message({
                success: true,
                data: { mode: mode, selectionCleared: mode === 'readOnly' },
                message: `Diagram interaction mode set to ${mode}`
            });
        } catch (err) {
            return this.error(`Failed to manage interaction mode: ${(err as Error).message}`);
        }
    }
    /**
     * Aligns, distributes and resizes the requested or selected objects.
     *
     * @param {Object} args - The tool arguments describing the arrangement.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleArrangeAndAlignObjects(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const objects: WebMcpArgs[] = args.objectIds
                ? (args.objectIds as string[]).map((id: string) => this.resolveDiagramObject(id))
                    .filter((obj: WebMcpArgs) => !!obj)
                : this.getSelectedObjects();

            if (objects.length === 0) {
                return this.error('No objects available for arrangement. Please specify objectIds or select objects.');
            }

            // Alignment operates on the selection, so make sure the requested objects are selected.
            if (args.objectIds && (args.objectIds as string[]).length > 0) {
                this.parent.clearSelection();
                this.parent.select(objects as WebMcpArgs[], true);
            }

            if (args.alignMode) {
                this.parent.align(this.normalizeAlignment(args.alignMode) as AlignmentOptions, objects as WebMcpArgs[]);
                this.parent.dataBind();
            }
            if (args.distributeMode) {
                this.parent.distribute(this.normalizeDistribution(args.distributeMode) as DistributeOptions, objects as WebMcpArgs[]);
                this.parent.dataBind();
            }
            if (args.sizeMode) {
                this.parent.sameSize(this.normalizeSizing(args.sizeMode) as SizingOptions, objects as WebMcpArgs[]);
                this.parent.dataBind();
            }

            return this.message({
                success: true,
                data: {
                    operationsApplied: [args.alignMode, args.distributeMode, args.sizeMode].filter(Boolean),
                    objectCount: objects.length,
                    status: 'arranged'
                },
                message: `${objects.length} object(s) arranged successfully`
            });
        } catch (err) {
            return this.error(`Failed to arrange objects: ${(err as Error).message}`);
        }
    }
    /**
     * Deletes the requested, selected, or all diagram objects.
     *
     * @param {Object} args - The tool arguments describing what to delete.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleDeleteFromDiagram(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const deleteMode: string = args.deleteMode || 'specified';
            const includeDependents: boolean = args.includeDependents !== false;

            if (deleteMode === 'all') {
                const clearedCount: number = this.parent.nodes.length + this.parent.connectors.length;
                this.parent.clear();
                this.parent.dataBind();
                return this.message({
                    success: true,
                    data: { deletedCount: clearedCount, dependentCount: 0 },
                    message: `All diagram objects cleared (${clearedCount} object(s))`
                });
            }

            const objects: WebMcpArgs[] = deleteMode === 'selected'
                ? this.getSelectedObjects().slice()
                : ((args.objectIds as string[]) || []).map((id: string) =>
                    this.parent.getObject(id) || this.resolveDiagramObject(id)
                ).filter((obj: WebMcpArgs) => !!obj);

            if (objects.length === 0) {
                return this.error('No matching objects found to delete.');
            }

            // Connectors attached to a deleted node are removed first so no dangling ends remain.
            const dependents: WebMcpArgs[] = [];
            if (includeDependents) {
                const nodeIds: string[] = objects.filter((obj: WebMcpArgs) => !!this.findNode(obj.id))
                    .map((obj: WebMcpArgs) => obj.id);
                this.parent.connectors.forEach((connector: WebMcpArgs) => {
                    const attached: boolean = nodeIds.indexOf(connector.sourceID) !== -1 ||
                        nodeIds.indexOf(connector.targetID) !== -1;
                    const alreadyListed: boolean = objects.some((obj: WebMcpArgs) => obj.id === connector.id);
                    if (attached && !alreadyListed) {
                        dependents.push(connector);
                    }
                });
            }

            const deleted: WebMcpArgs[] = objects.map((obj: WebMcpArgs) => ({
                id: obj.id, type: this.findConnector(obj.id) ? 'connector' : 'node'
            }));
            dependents.forEach((obj: WebMcpArgs) => this.parent.remove(obj));
            objects.forEach((obj: WebMcpArgs) => this.parent.remove(obj));
            this.parent.dataBind();

            return this.message({
                success: true,
                data: {
                    deletedObjects: deleted,
                    deletedCount: objects.length,
                    dependentConnectors: dependents.map((obj: WebMcpArgs) => obj.id),
                    dependentCount: dependents.length
                },
                message: `${objects.length} object(s) deleted successfully`
            });
        } catch (err) {
            return this.error(`Failed to delete objects: ${(err as Error).message}`);
        }
    }
    /**
     * Returns the current undo and redo availability.
     *
     * @returns {Object} - The canUndo and canRedo flags.
     */
    private getHistoryState(): WebMcpArgs {
        const history: WebMcpArgs = (this.parent.historyManager || {}) as WebMcpArgs;
        return {
            canUndo: history.canUndo || !!history.undoStack.length,
            canRedo: history.canRedo || !!history.redoStack.length
        };
    }

    /**
     * Performs undo, redo, history grouping and history clearing operations.
     *
     * @param {Object} args - The tool arguments holding the requested action.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManageUndoRedo(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const action: string = args.action;

            switch (action) {
            case 'undo': {
                const before: WebMcpArgs = this.getHistoryState();
                if (!before.canUndo) {
                    return this.error('Nothing to undo.');
                }
                this.parent.undo();
                this.parent.dataBind();
                const state: WebMcpArgs = this.getHistoryState();
                return this.message({
                    success: true,
                    data: { action: 'undo', canUndo: state.canUndo, canRedo: state.canRedo },
                    message: 'Undo successful'
                });
            }
            case 'redo': {
                const before: WebMcpArgs = this.getHistoryState();
                if (!before.canRedo) {
                    return this.error('Nothing to redo.');
                }
                this.parent.redo();
                this.parent.dataBind();
                const state: WebMcpArgs = this.getHistoryState();
                return this.message({
                    success: true,
                    data: { action: 'redo', canUndo: state.canUndo, canRedo: state.canRedo },
                    message: 'Redo successful'
                });
            }
            case 'startGroup':
                this.parent.startGroupAction();
                return this.message({
                    success: true,
                    data: { action: 'startGroup' },
                    message: 'Group action started'
                });
            case 'endGroup':
                this.parent.endGroupAction();
                this.parent.dataBind();
                return this.message({
                    success: true,
                    data: { action: 'endGroup' },
                    message: 'Group action ended'
                });
            case 'clear':
                this.parent.clearHistory();
                return this.message({
                    success: true,
                    data: { action: 'clear', canUndo: false, canRedo: false },
                    message: 'History cleared'
                });
            default:
                return this.error(`Unknown undo/redo action: ${action}`);
            }
        } catch (err) {
            return this.error(`Failed to manage undo/redo: ${(err as Error).message}`);
        }
    }
    /**
     * Performs copy, cut and paste operations on the current selection.
     *
     * @param {Object} args - The tool arguments holding the requested operation.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManageClipboardOperations(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const operation: string = args.operation;

            switch (operation) {
            case 'copy': {
                const copyCount: number = this.getSelectedObjects().length;
                this.parent.copy();
                return this.message({
                    success: true,
                    data: { operation: 'copy', objectsCopied: copyCount, canPaste: true },
                    message: `${copyCount} object(s) copied`
                });
            }
            case 'cut':
                this.parent.cut();

                // Update diagram after cut
                this.parent.dataBind();

                return this.message({
                    success: true,
                    data: { operation: 'cut', canPaste: true },
                    message: 'Objects cut successfully'
                });
            case 'paste':
                this.parent.paste();

                // Update diagram after paste
                this.parent.dataBind();

                return this.message({
                    success: true,
                    data: { operation: 'paste' },
                    message: 'Objects pasted successfully'
                });
            default:
                return this.error(`Unknown clipboard operation: ${operation}`);
            }
        } catch (err) {
            return this.error(`Failed to manage clipboard: ${(err as Error).message}`);
        }
    }

    /**
     * Exports the diagram as JSON, Mermaid or an image, loads diagram data, or prints.
     * A browser download is only started when the caller explicitly sets download to true.
     *
     * @param {Object} args - The tool arguments describing the operation.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleExportAndImportDiagrams(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const operation: string = args.operation;
            const format: string = ((args.format === 'image' ? args.imageFormat : args.format) || 'json').toString().toLowerCase();
            // A download is a visible side effect, so an AI client has to ask for it explicitly.
            const shouldDownload: boolean = args.download === true;

            switch (operation) {
            case 'save':
                return this.exportAsJson(args, false);
            case 'export':
                if (format === 'json') {
                    return this.exportAsJson(args, shouldDownload);
                }
                if (format === 'mermaid') {
                    return this.exportAsMermaid(args, shouldDownload);
                }
                if (['png', 'jpg', 'jpeg', 'svg'].indexOf(format) !== -1) {
                    return this.exportAsImage(args, format, shouldDownload);
                }
                return this.error(`Unsupported export format: ${format}. Supported formats: json, mermaid, png, jpg, svg.`);
            case 'load':
            case 'import':
                if (!args.diagramData) {
                    return this.error('diagramData is required for load operations');
                }
                this.parent.loadDiagram(args.diagramData);
                this.parent.dataBind();
                return this.message({
                    success: true,
                    data: {
                        operation: operation,
                        nodesCount: this.parent.nodes.length,
                        connectorsCount: this.parent.connectors.length
                    },
                    message: `Diagram ${operation === 'load' ? 'loaded' : 'imported'} successfully`
                });
            case 'print':
                if (!this.parent.printandExportModule.print) {
                    return this.error('Print not available - PrintAndExport module not loaded');
                }
                this.parent.print({
                    fitPage: args.fitPage !== false,
                    region: args.region || 'Content',
                    pageOrientation: args.pageOrientation || 'Landscape',
                    margin: args.margin
                } as WebMcpArgs);
                return this.message({
                    success: true,
                    data: { operation: 'print' },
                    message: 'Diagram print requested successfully'
                });
            default:
                return this.error(`Unknown export operation: ${operation}. Use save, export, load, or print.`);
            }
        } catch (err) {
            return this.error(`Failed to export: ${(err as Error).message}`);
        }
    }

    /**
     * Serializes the diagram to JSON.
     *
     * @param {Object} args - The tool arguments.
     * @param {boolean} shouldDownload - True to also start a browser download.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private exportAsJson(args: WebMcpArgs, shouldDownload: boolean): WebMcpToolResponse {
        const jsonData: string = this.parent.saveDiagram();
        if (!jsonData || jsonData.length === 0) {
            return this.error('Failed to generate JSON export - diagram appears to be empty');
        }
        const filename: string = args.filename || `diagram_${Date.now()}.json`;
        if (shouldDownload) {
            this.downloadFile(jsonData, filename, 'application/json');
        }
        return this.message({
            success: true,
            data: {
                operation: args.operation || 'export',
                format: 'json',
                content: jsonData,
                filename: filename,
                size: jsonData.length,
                mimeType: 'application/json',
                downloaded: shouldDownload
            },
            message: 'Diagram exported as JSON successfully'
        });
    }

    /**
     * Serializes the diagram to Mermaid syntax.
     *
     * @param {Object} args - The tool arguments.
     * @param {boolean} shouldDownload - True to also start a browser download.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private exportAsMermaid(args: WebMcpArgs, shouldDownload: boolean): WebMcpToolResponse {
        if (!this.parent.saveDiagramAsMermaid) {
            return this.error('Mermaid export not available - MermaidDiagram module not loaded');
        }
        const mermaidData: string = this.parent.saveDiagramAsMermaid();
        if (!mermaidData || mermaidData.length === 0) {
            return this.error('Failed to generate Mermaid export - diagram appears to be empty');
        }
        const filename: string = args.filename || `diagram_${Date.now()}.md`;
        if (shouldDownload) {
            this.downloadFile(mermaidData, filename, 'text/markdown');
        }
        return this.message({
            success: true,
            data: {
                operation: 'export',
                format: 'mermaid',
                content: mermaidData,
                filename: filename,
                size: mermaidData.length,
                mimeType: 'text/markdown',
                downloaded: shouldDownload
            },
            message: 'Diagram exported as Mermaid successfully'
        });
    }

    /**
     * Exports the diagram as a raster or vector image.
     *
     * @param {Object} args - The tool arguments.
     * @param {string} format - The requested image format.
     * @param {boolean} shouldDownload - True to download instead of returning the data.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private exportAsImage(args: WebMcpArgs, format: string, shouldDownload: boolean): WebMcpToolResponse {
        if (!this.parent.printandExportModule.exportDiagram) {
            return this.error('Image export not available - PrintAndExport module not loaded. Ensure PrintAndExport is injected.');
        }
        const exportFormat: string = (format === 'jpg' || format === 'jpeg') ? 'JPG' : format.toUpperCase();
        const imageData: string = this.parent.exportDiagram({
            format: exportFormat,
            mode: shouldDownload ? 'Download' : 'Data',
            region: args.region || 'Content',
            fileName: args.filename || 'diagram'
        } as WebMcpArgs) as string;

        // Download mode returns no content by design; Data mode must return content.
        if (!shouldDownload && (!imageData || (typeof imageData === 'string' && imageData.length === 0))) {
            return this.error(`Failed to export diagram as ${format} - no image data generated`);
        }

        return this.message({
            success: true,
            data: {
                operation: 'export',
                format: exportFormat,
                content: shouldDownload ? undefined : imageData,
                filename: args.filename || `diagram_${Date.now()}.${exportFormat === 'JPG' ? 'jpg' : exportFormat.toLowerCase()}`,
                size: typeof imageData === 'string' ? imageData.length : 0,
                mimeType: exportFormat === 'JPG' ? 'image/jpeg' : `image/${exportFormat.toLowerCase()}`,
                downloaded: shouldDownload
            },
            message: `Diagram exported as ${exportFormat} successfully`
        });
    }

    /**
     * Changes the z-order of the requested or selected objects.
     *
     * @param {Object} args - The tool arguments holding the objects and the order to apply.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleArrangeZOrder(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const objects: WebMcpArgs[] = args.objectIds
                ? (args.objectIds as string[]).map((id: string) => this.parent.getObject(id) || this.resolveDiagramObject(id))
                    .filter((obj: WebMcpArgs) => !!obj)
                : this.getSelectedObjects().slice();

            if (objects.length === 0) {
                return this.error('No objects available for z-order changes. Please specify objectIds or select objects.');
            }

            // The z-order commands act on the current selection, so select the requested objects first.
            if (args.objectIds && (args.objectIds as string[]).length > 0) {
                this.parent.clearSelection();
                this.parent.select(objects as WebMcpArgs[], true);
            }

            switch (args.order) {
            case 'toFront':
                this.parent.bringToFront();
                break;
            case 'toBack':
                this.parent.sendToBack();
                break;
            case 'forward':
                this.parent.moveForward();
                break;
            case 'backward':
                this.parent.sendBackward();
                break;
            default:
                return this.error(`Unknown z-order operation: ${args.order}. Use toFront, toBack, forward, or backward.`);
            }
            this.parent.dataBind();

            return this.message({
                success: true,
                data: { objectIds: objects.map((obj: WebMcpArgs) => obj.id), operation: args.order },
                message: `Objects moved ${args.order} successfully`
            });
        } catch (err) {
            return this.error(`Failed to arrange z-order: ${(err as Error).message}`);
        }
    }
    /**
     * Zooms, pans, resets or fits the diagram view.
     *
     * @param {Object} args - The tool arguments holding the requested action.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleNavigateAndZoomDiagram(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const action: string = args.action;

            switch (action) {
            case 'zoom':
                this.parent.zoom(args.zoomFactor || 1.2, args.focusPoint);
                return this.message({
                    success: true,
                    data: { action: 'zoom', zoomLevel: (args.zoomFactor || 1.2) * 100 },
                    message: 'Zoomed successfully'
                });
            case 'pan':
                this.parent.pan(args.horizontalOffset || 0, args.verticalOffset || 0, args.focusPoint);
                return this.message({
                    success: true,
                    data: { action: 'pan' },
                    message: 'Panned successfully'
                });
            case 'reset':
                this.parent.reset();
                return this.message({
                    success: true,
                    data: { action: 'reset' },
                    message: 'View reset successfully'
                });
            case 'fitToPage':
                this.parent.fitToPage();
                return this.message({
                    success: true,
                    data: { action: 'fitToPage' },
                    message: 'Fit to page successfully'
                });
            case 'bringIntoView':
                if (args.bounds) {
                    this.parent.bringIntoView(args.bounds);
                }
                return this.message({
                    success: true,
                    data: { action: 'bringIntoView' },
                    message: 'Brought into view successfully'
                });
            default:
                return this.error(`Unknown navigation action: ${action}`);
            }
        } catch (err) {
            return this.error(`Failed to navigate/zoom: ${(err as Error).message}`);
        }
    }

    /**
     * Groups, ungroups and reparents diagram objects.
     *
     * @param {Object} args - The tool arguments holding the requested operation.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManageGroupsAndHierarchies(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const operation: string = args.operation;

            switch (operation) {
            case 'group': {
                this.parent.group();

                // Update diagram to show grouped objects
                this.parent.dataBind();

                const groupedCount: number = this.getSelectedObjects().length;
                return this.message({
                    success: true,
                    data: { operation: 'group', childrenCount: groupedCount },
                    message: 'Objects grouped successfully'
                });
            }
            case 'unGroup':
                this.parent.unGroup();

                // Update diagram after ungrouping
                this.parent.dataBind();

                return this.message({
                    success: true,
                    data: { operation: 'unGroup' },
                    message: 'Objects ungrouped successfully'
                });
            case 'addChild':
                if (args.parentId && args.childIds) {
                    const parent: WebMcpArgs = this.parent.getObject(args.parentId) as WebMcpArgs;
                    args.childIds.forEach((childId: string) => {
                        this.parent.addChildToGroup(parent, childId);
                    });

                    // Update diagram after adding children
                    this.parent.dataBind();

                    return this.message({
                        success: true,
                        data: { operation: 'addChild', groupId: args.parentId, childrenCount: args.childIds.length },
                        message: `Added ${args.childIds.length} children to group`
                    });
                }
                return this.error('parentId and childIds are required');
            case 'removeChild':
                if (args.parentId && args.childIds) {
                    const parent: WebMcpArgs = this.parent.getObject(args.parentId) as WebMcpArgs;
                    args.childIds.forEach((childId: string) => {
                        this.parent.removeChildFromGroup(parent, childId);
                    });

                    // Update diagram after removing children
                    this.parent.dataBind();

                    return this.message({
                        success: true,
                        data: { operation: 'removeChild' },
                        message: 'Removed children from group'
                    });
                }
                return this.error('parentId and childIds are required');
            default:
                return this.error(`Unknown hierarchy operation: ${operation}`);
            }
        } catch (err) {
            return this.error(`Failed to manage hierarchies: ${(err as Error).message}`);
        }
    }

    /**
     * Adds, updates or removes an annotation on a node or connector.
     *
     * @param {Object} args - The tool arguments describing the annotation operation.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManageAnnotationsAndLabels(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const objectId: string = args.objectId;
            const labelText: string = args.labelText;
            const operation: string = args.operation || 'add';

            if (!objectId) {
                return this.error('objectId is required');
            }
            if (operation !== 'delete' && labelText === undefined) {
                return this.error('labelText is required for add and update operations');
            }

            const obj: WebMcpArgs = this.parent.getObject(objectId) || this.resolveDiagramObject(objectId);
            if (!obj) {
                return this.error(`Object '${objectId}' not found`);
            }
            if (!obj.annotations) {
                obj.annotations = [];
            }

            if (operation === 'update') {
                if (!obj.annotations.length) {
                    return this.error(`No existing annotations found on ${objectId} to update`);
                }
                let existingIndex: number = 0;
                if (args.labelId) {
                    existingIndex = -1;
                    for (let i: number = 0; i < obj.annotations.length; i++) {
                        if (obj.annotations[parseInt(i.toString(), 10)].id === args.labelId) {
                            existingIndex = i;
                            break;
                        }
                    }
                }
                if (existingIndex < 0) {
                    return this.error(`Annotation '${args.labelId}' not found on ${objectId}`);
                }
                const previousAnnotation: WebMcpArgs = obj.annotations[parseInt(existingIndex.toString(), 10)];
                const annotation: WebMcpArgs = this.buildAnnotation(args, labelText, previousAnnotation, previousAnnotation.id);
                this.parent.removeLabels(obj as WebMcpArgs, [previousAnnotation] as WebMcpArgs[]);
                this.parent.addLabels(obj as WebMcpArgs, [annotation] as WebMcpArgs[]);
                this.parent.dataBind();
                return this.message({
                    success: true,
                    data: {
                        objectId: objectId,
                        labelUpdated: true,
                        labelId: previousAnnotation.id,
                        annotationIndex: existingIndex,
                        text: labelText
                    },
                    message: `Label updated on ${objectId} successfully`
                });
            }

            if (operation === 'delete') {
                if (!args.labelId) {
                    return this.error('labelId is required for delete operation');
                }
                const annotation: WebMcpArgs = obj.annotations
                    .filter((item: WebMcpArgs) => item.id === args.labelId)[0];
                if (!annotation) {
                    return this.error(`Annotation '${args.labelId}' not found on ${objectId}`);
                }
                this.parent.removeLabels(obj as WebMcpArgs, [annotation] as WebMcpArgs[]);
                this.parent.dataBind();
                return this.message({
                    success: true,
                    data: { objectId: objectId, labelDeleted: true, labelId: args.labelId },
                    message: `Label deleted from ${objectId} successfully`
                });
            }

            if (operation !== 'add') {
                return this.error(`Unknown annotation operation: ${operation}. Use add, update, or delete.`);
            }

            const labelId: string = args.labelId || `label_${Date.now()}`;
            const annotation: WebMcpArgs = this.buildAnnotation(args, labelText, undefined, labelId);
            this.parent.addLabels(obj as WebMcpArgs, [annotation] as WebMcpArgs[]);
            this.parent.dataBind();
            return this.message({
                success: true,
                data: { objectId: objectId, labelAdded: true, labelId: labelId, text: labelText },
                message: `Label added to ${objectId} successfully`
            });
        } catch (err) {
            return this.error(`Failed to manage annotations: ${(err as Error).message}`);
        }
    }
    /**
     * Adds or removes connection ports on a node.
     *
     * @param {Object} args - The tool arguments describing the port operation.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManagePorts(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const nodeId: string = args.nodeId;
            const action: string = args.action;

            if (!nodeId) {
                return this.error('nodeId is required');
            }

            const node: WebMcpArgs = this.parent.getNodeObject(nodeId) as WebMcpArgs;
            if (!node) {
                return this.error(`Node '${nodeId}' not found`);
            }

            switch (action) {
            case 'add': {
                const definitions: WebMcpArgs[] = Array.isArray(args.portDefinitions) ? args.portDefinitions : [];
                const portCount: number = definitions.length || args.portCount || 1;
                const ports: WebMcpArgs[] = [];
                const warnings: string[] = [];

                const portPositions: WebMcpArgs = {
                    'top': { x: 0.5, y: 0 },
                    'bottom': { x: 0.5, y: 1 },
                    'left': { x: 0, y: 0.5 },
                    'right': { x: 1, y: 0.5 },
                    'topleft': { x: 0, y: 0 },
                    'topright': { x: 1, y: 0 },
                    'bottomleft': { x: 0, y: 1 },
                    'bottomright': { x: 1, y: 1 },
                    'center': { x: 0.5, y: 0.5 }
                };

                const positions: string[] = args.positions || args.location || [];
                const unknownConstraints: string[] = [];
                const sharedConstraints: number = this.toConstraints(args.constraints, PortConstraints, unknownConstraints);
                if (unknownConstraints.length) {
                    warnings.push(`Ignored unknown port constraints: ${unknownConstraints.join(', ')}.`);
                }

                for (let i: number = 0; i < portCount; i++) {
                    const definition: WebMcpArgs = definitions[parseInt(i.toString(), 10)] || {};
                    const portId: string = definition.id || (portCount === 1 && args.portId) || `port_${nodeId}_${i}`;

                    let offset: WebMcpArgs = { x: 0.5, y: 0.5 };
                    if (definition.offset) {
                        offset = definition.offset;
                    } else if (Array.isArray(positions) && positions[parseInt(i.toString(), 10)]) {
                        const posName: string = this.normalizeShapeName(positions[parseInt(i.toString(), 10)]);
                        if (!portPositions[`${posName}`]) {
                            warnings.push(`Unknown port position '${positions[parseInt(i.toString(), 10)]}'; centered instead.`);
                        }
                        offset = portPositions[`${posName}`] || { x: 0.5, y: 0.5 };
                    } else if (args.offset) {
                        offset = args.offset;
                    }

                    const definitionConstraints: number = definition.constraints !== undefined
                        ? this.toConstraints(definition.constraints, PortConstraints) : undefined;

                    const port: WebMcpArgs = {
                        id: portId,
                        offset: offset,
                        visibility: this.normalizePortVisibility(definition.visibility || args.visibility),
                        shape: definition.shape || args.shape || 'Square',
                        width: definition.width || args.width || 12,
                        height: definition.height || args.height || 12,
                        margin: definition.margin || args.margin || { left: 0, top: 0, right: 0, bottom: 0 },
                        horizontalAlignment: definition.horizontalAlignment || args.horizontalAlignment || 'Center',
                        verticalAlignment: definition.verticalAlignment || args.verticalAlignment || 'Center',
                        connectionDirection: definition.connectionDirection || args.connectionDirection || 'Auto',
                        constraints: definitionConstraints !== undefined ? definitionConstraints : sharedConstraints,
                        style: definition.style || args.style,
                        pathData: definition.pathData || args.pathData,
                        tooltip: definition.tooltip || args.tooltip,
                        addInfo: definition.addInfo || args.addInfo
                    };
                    Object.keys(port).forEach((key: string) => {
                        if (port[`${key}`] === undefined) {
                            delete port[`${key}`];
                        }
                    });
                    ports.push(port);
                }

                this.parent.addPorts(node as WebMcpArgs, ports as WebMcpArgs[]);
                // setProperties keeps the renderer and property change detection in sync.
                this.parent.setProperties({ nodes: this.parent.nodes });

                return this.message({
                    success: true,
                    data: {
                        nodeId: nodeId,
                        portsAdded: ports.length,
                        portIds: ports.map((port: WebMcpArgs) => port.id)
                    },
                    warnings: warnings,
                    message: `${ports.length} ports added to ${nodeId}`
                });
            }
            case 'remove': {
                const portId: string = args.portId;
                if (!portId) {
                    return this.error('portId is required for remove operation');
                }
                const port: WebMcpArgs = (node.ports as WebMcpArgs[])
                    .filter((item: WebMcpArgs) => item.id === portId)[0];
                if (!port) {
                    return this.error(`Port '${portId}' not found on ${nodeId}`);
                }
                this.parent.removePorts(node as any, [port] as WebMcpArgs[]);
                this.parent.setProperties({ nodes: this.parent.nodes });

                return this.message({
                    success: true,
                    data: { nodeId: nodeId, portId: portId, removed: true },
                    message: `Port '${portId}' removed from ${nodeId}`
                });
            }
            default:
                return this.error(`Unknown port action: ${action}. Use add or remove.`);
            }
        } catch (err) {
            return this.error(`Failed to manage ports: ${(err as Error).message}`);
        }
    }
    /**
     * Adds or removes layers and moves objects between them.
     *
     * @param {Object} args - The tool arguments holding the requested operation.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleManageLayers(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }
            const operation: string = args.operation;

            switch (operation) {
            case 'addLayer':
                if (args.layerId && args.layerName) {
                    this.parent.addLayer({ id: args.layerId, addInfo: { name: args.layerName }, visible: true });

                    // Update diagram after adding layer
                    this.parent.dataBind();

                    return this.message({
                        success: true,
                        data: { operation: 'addLayer', layerId: args.layerId, layerName: args.layerName, visible: true },
                        message: `Layer '${args.layerName}' created`
                    });
                }
                return this.error('layerId and layerName are required');
            case 'removeLayer':
                if (args.layerId) {
                    this.parent.removeLayer(args.layerId);

                    // Update diagram after removing layer
                    this.parent.dataBind();

                    return this.message({
                        success: true,
                        data: { operation: 'removeLayer', layerId: args.layerId },
                        message: 'Layer removed'
                    });
                }
                return this.error('layerId is required');
            case 'moveObjects':
                if (args.objects && args.targetLayer) {
                    this.parent.moveObjects(args.objects, args.targetLayer);

                    // Update diagram after moving objects to layer
                    this.parent.dataBind();

                    return this.message({
                        success: true,
                        data: { operation: 'moveObjects', targetLayer: args.targetLayer },
                        message: 'Objects moved to layer'
                    });
                }
                return this.error('objects and targetLayer are required');
            default:
                return this.error(`Unknown layer operation: ${operation}`);
            }
        } catch (err) {
            return this.error(`Failed to manage layers: ${(err as Error).message}`);
        }
    }

    /**
     * Removes event listeners and cleanup
     */
    /**
     * Revokes registered tools, removes listeners and releases the parent reference.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
        this.unregisterTools();
        this.savedNodeConstraints = {};
        this.savedConnectorConstraints = {};
        this.parent = null;
    }
    /**
     * Returns the module name used for injection and lookup.
     *
     * @returns {string} - The module name.
     */
    public getModuleName(): string {
        return 'WebMcpDiagram';
    }

    /**
     * Applies an automatic layout to the diagram.
     *
     * @param {Object} args - The tool arguments describing the layout.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private handleApplyLayoutToNodes(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }

            const layoutType: string = args.layoutType || args.type || 'Hierarchical';
            const orientation: string = args.orientation || args.direction || 'TopToBottom';
            const horizontalSpacing: number = args.horizontalSpacing !== undefined ? args.horizontalSpacing : 40;
            const verticalSpacing: number = args.verticalSpacing !== undefined ? args.verticalSpacing : 40;
            const rootNode: string = args.rootNode || args.centreNode || '';
            const common: WebMcpArgs = {
                horizontalSpacing: horizontalSpacing,
                verticalSpacing: verticalSpacing,
                marginX: 20,
                marginY: 20,
                enableAnimation: args.enableAnimation !== false
            };

            let layout: WebMcpArgs = null;
            switch (layoutType.toLowerCase()) {
            case 'hierarchical':
            case 'hierarchicaltree':
                layout = { ...common, type: 'HierarchicalTree', orientation: orientation };
                break;
            case 'radial':
            case 'radialtree':
                layout = { ...common, type: 'RadialTree', root: rootNode };
                break;
            case 'mindmap':
                layout = { ...common, type: 'MindMap', root: rootNode };
                break;
            case 'flowchart':
                layout = { ...common, type: 'Flowchart', orientation: orientation };
                break;
            case 'symmetric':
            case 'symmetriclayout':
                layout = { ...common, type: 'SymmetricLayout' };
                break;
            case 'complexhierarchical':
                layout = { ...common, type: 'ComplexHierarchicalTree' };
                break;
            // Additional layout types for better AI recognition
            case 'organization':
            case 'org':
                layout = { ...common, type: 'HierarchicalTree', orientation: orientation || 'TopToBottom' };
                break;
            case 'network':
                layout = { ...common, type: 'Flowchart', orientation: orientation || 'TopToBottom' };
                break;
            default: {
                // Try to match layout type more flexibly
                const normalizedLayoutType: string = layoutType.toLowerCase().replace(/\s+/g, '');
                if (normalizedLayoutType.includes('hierarchical') || normalizedLayoutType.includes('tree')) {
                    layout = { ...common, type: 'HierarchicalTree', orientation: orientation };
                } else if (normalizedLayoutType.includes('mind') || normalizedLayoutType.includes('map')) {
                    layout = { ...common, type: 'MindMap', root: rootNode };
                } else if (normalizedLayoutType.includes('flow') || normalizedLayoutType.includes('chart')) {
                    layout = { ...common, type: 'Flowchart', orientation: orientation };
                } else if (normalizedLayoutType.includes('radial')) {
                    layout = { ...common, type: 'RadialTree', root: rootNode };
                } else if (normalizedLayoutType.includes('symmetric')) {
                    layout = { ...common, type: 'SymmetricLayout' };
                } else if (normalizedLayoutType.includes('complex')) {
                    layout = { ...common, type: 'ComplexHierarchicalTree' };
                } else {
                    layout = { ...common, type: 'HierarchicalTree', orientation: orientation };
                }
                break;
            }}

            const createdConnectors: string[] = [];
            if (this.parent.nodes.length > 1 && this.parent.connectors.length === 0) {
                // Graph layouts need edges. Inventing them changes the user's diagram, so it is opt-in.
                if (args.autoConnect !== true) {
                    return this.error(
                        'No connectors exist, so a graph layout cannot be computed. Create connectors between the nodes first, ' +
                        'or call this tool again with autoConnect set to true to chain the nodes in their current order.');
                }
                const connectorColor: string = args.connectorStrokeColor || 'black';
                for (let index: number = 1; index < this.parent.nodes.length; index++) {
                    const source: WebMcpArgs = this.parent.nodes[parseInt((index - 1).toString(), 10)] as WebMcpArgs;
                    const target: WebMcpArgs = this.parent.nodes[parseInt(index.toString(), 10)] as WebMcpArgs;
                    const connectorId: string = `layout_${layoutType.toLowerCase()}_${index}`;
                    if (!this.findConnector(connectorId)) {
                        this.parent.addConnector({
                            id: connectorId,
                            sourceID: source.id,
                            targetID: target.id,
                            type: 'Orthogonal',
                            style: { strokeColor: connectorColor },
                            targetDecorator: { shape: 'Arrow' }
                        } as WebMcpArgs);
                        createdConnectors.push(connectorId);
                    }
                }
                this.parent.setProperties({ connectors: this.parent.connectors });
            }

            // setProperties triggers onPropertyChanged, which runs doLayout.
            this.parent.setProperties({ layout: layout as WebMcpArgs });

            if (args.connectorStrokeColor) {
                this.parent.connectors.forEach((connector: WebMcpArgs) => {
                    if (!connector.style) {
                        connector.style = {};
                    }
                    connector.style.strokeColor = args.connectorStrokeColor;
                });
                this.parent.setProperties({ connectors: this.parent.connectors });
            }

            return this.message({
                success: true,
                data: {
                    layoutType: layoutType,
                    orientation: orientation,
                    nodesCount: this.parent.nodes.length,
                    connectorsCount: this.parent.connectors.length,
                    connectorsCreated: createdConnectors,
                    applied: true
                },
                message: `${layoutType} layout applied successfully to diagram with ${this.parent.nodes.length} nodes`
            });
        } catch (err) {
            return this.error(`Failed to apply layout: ${(err as Error).message}`);
        }
    }
    /**
     * Starts a browser download for the supplied content.
     *
     * @param {string} content - The file content.
     * @param {string} filename - The download file name.
     * @param {string} mimeType - The content MIME type.
     * @returns {void}
     */
    private downloadFile(content: string, filename: string, mimeType: string): void {
        const blob: Blob = new Blob([content], { type: mimeType });
        const url: string = URL.createObjectURL(blob);
        const anchor: HTMLAnchorElement = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }

    /**
     * Creates a specialized relationship connector between two entities for ER or UML diagrams.
     *
     * @param {Object} args - The tool arguments describing the relationship.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private createSpecializedRelationship(args: WebMcpArgs): WebMcpToolResponse {
        try {
            if (!this.ensureParent()) {
                return this.error('Diagram is not initialized');
            }

            const sourceId: string = args.sourceId;
            const targetId: string = args.targetId;

            if (!sourceId || !targetId) {
                return this.error('Both sourceId and targetId are required for relationship creation');
            }

            // Determine connector type based on provided properties
            const connectorType: string = args.connectorType || args.type || 'Orthogonal';

            // Prepare connector arguments with proper defaults
            const connectorArgs: WebMcpArgs = {
                connectorId: args.connectorId || `rel_${sourceId}_${targetId}_${Date.now()}`,
                sourceId: sourceId,
                targetId: targetId,
                label: args.label,
                lineType: connectorType,
                style: {
                    strokeColor: args.lineColor || '#000000',
                    strokeWidth: args.lineWidth || 2
                }
            };

            // Handle different diagram types based on provided properties
            if (args.bpmnFlowType) {
                // BPMN connector
                connectorArgs.shape = {
                    type: 'Bpmn',
                    flow: args.bpmnFlowType,
                    sequence: args.sequenceFlowType || 'Normal',
                    message: args.messageFlowType || 'Default',
                    association: args.associationFlowType || 'Default'
                };

                // Set decorators based on BPMN flow type
                if (args.bpmnFlowType === 'Sequence') {
                    connectorArgs.startDecorator = 'None';
                    connectorArgs.endDecorator = 'Arrow';
                } else if (args.bpmnFlowType === 'Message') {
                    connectorArgs.startDecorator = 'None';
                    connectorArgs.endDecorator = 'Arrow';
                } else if (args.bpmnFlowType === 'Association') {
                    connectorArgs.startDecorator = 'None';
                    connectorArgs.endDecorator = 'None';
                }
            } else if (args.erRelationshipType || args.sourceMultiplicity || args.targetMultiplicity) {
                // ER connector
                connectorArgs.shape = {
                    type: 'Er',
                    relationship: args.erRelationshipType || 'NonIdentifying',
                    sourceMultiplicity: {
                        type: args.sourceMultiplicity || 'One'
                    },
                    targetMultiplicity: {
                        type: args.targetMultiplicity || 'One'
                    }
                };

                // Set decorators based on multiplicity
                const sourceMult: string = args.sourceMultiplicity || 'One';
                const targetMult: string = args.targetMultiplicity || 'One';
                connectorArgs.startDecorator = sourceMult.includes('Many') || sourceMult.includes('ZeroOrMany') || sourceMult.includes('OneOrMany') ? 'Crow' : 'None';
                connectorArgs.endDecorator = targetMult.includes('Many') || targetMult.includes('ZeroOrMany') || targetMult.includes('OneOrMany') ? 'Crow' : 'None';
            } else if (args.umlRelationshipType || args.associationType) {
                // UML connector
                connectorArgs.shape = {
                    type: 'UmlClassifier',
                    relationship: args.umlRelationshipType || 'Association',
                    associationType: args.associationType || 'Default'
                };

                // Add multiplicity if provided
                if (args.sourceMultiplicity || args.targetMultiplicity) {
                    connectorArgs.shape.multiplicity = {
                        source: args.sourceMultiplicity || 'OneToOne',
                        target: args.targetMultiplicity || 'OneToOne'
                    };
                }

                // Set decorators based on relationship type
                const relType: string = args.umlRelationshipType || 'Association';
                if (relType === 'Aggregation') {
                    connectorArgs.startDecorator = 'None';
                    connectorArgs.endDecorator = 'Diamond';
                } else if (relType === 'Composition') {
                    connectorArgs.startDecorator = 'None';
                    connectorArgs.endDecorator = 'FilledDiamond';
                } else {
                    connectorArgs.startDecorator = 'None';
                    connectorArgs.endDecorator = 'Arrow';
                }
            } else {
                // Detect whether this is an ER relationship request from cardinality-style signals.
                // The AI commonly supplies relationshipType as "oneToMany"/"manyToMany"/"oneToOne"
                // or a cardinality like "1..*"/"*..*"/"1..1" — none of which are UML relationship names.
                const relationshipType: string = (args.relationshipType || '').toString();
                const cardinality: string = (args.cardinality || '').toString();
                const isErLikeRelationship: boolean = /oneToOne|oneToMany|manyToOne|manyToMany/i.test(relationshipType)
                    || /\*|\.\./.test(cardinality);
                const isUmlLikeRelationship: boolean = /Aggregation|Composition|Inheritance|Realization|Dependency|Association/i.test(relationshipType);

                if (isErLikeRelationship && !isUmlLikeRelationship) {
                    // ER connector — translate cardinality notation into ErMultiplicity values.
                    const srcMult: string = this.toErMultiplicity(this.parseCardinalitySide(cardinality, 0), relationshipType);
                    const tgtMult: string = this.toErMultiplicity(this.parseCardinalitySide(cardinality, 1), relationshipType);

                    connectorArgs.shape = {
                        type: 'Er',
                        relationship: args.erRelationshipType || 'NonIdentifying',
                        sourceMultiplicity: { type: srcMult },
                        targetMultiplicity: { type: tgtMult }
                    };
                    connectorArgs.startDecorator = this.getCrowDecorator(srcMult);
                    connectorArgs.endDecorator = this.getCrowDecorator(tgtMult);
                } else {
                    // UML connector (default fallback)
                    connectorArgs.shape = {
                        type: 'UmlClassifier',
                        relationship: relationshipType || 'Association',
                        associationType: args.associationType || 'Default'
                    };

                    connectorArgs.label = args.label || `${cardinality}`;
                    connectorArgs.startDecorator = relationshipType.includes('one') || relationshipType.includes('1') ? 'None' : 'Circle';
                    connectorArgs.endDecorator = relationshipType.includes('many') || relationshipType.includes('n') ? 'Crow' : 'Arrow';
                }
            }

            // Use the existing connector creation method
            return this.handleCreateDiagramConnector(connectorArgs);
        } catch (err) {
            return this.error(`Failed to create specialized relationship: ${(err as Error).message}`);
        }
    }

    /**
     * Extracts one side of a cardinality string like "1..*". Returns 'One' or 'Many'.
     *
     * @param {string} cardinality - The cardinality string.
     * @param {number} side - 0 for the source side, 1 for the target side.
     * @returns {string} - 'One' or 'Many'.
     */
    private parseCardinalitySide(cardinality: string, side: number): string {
        if (!cardinality) {
            return 'One';
        }
        const parts: string[] = cardinality.split('..');
        // Use indexOf with explicit bounds instead of array index access so the
        // security plugin does not flag this as an object-injection sink.
        const sideIndex: number = (side === 1) ? 1 : 0;
        const token: string = (sideIndex < parts.length ? parts[parseInt(sideIndex.toString(), 10)] : (parts[0] || '')).trim();
        if (!token || token === '0' || token === '1') {
            return 'One';
        }
        return 'Many';
    }

    /**
     * Maps an ER relationship description to the appropriate ErMultiplicityTypes value.
     * Falls back to the parsed cardinality side when the relationship type yields no hint.
     *
     * @param {string} side - 'One' or 'Many' parsed from the cardinality literal.
     * @param {string} relationshipType - The relationship type supplied by the AI client.
     * @returns {string} - A valid ErMultiplicityTypes value.
     */
    private toErMultiplicity(side: string, relationshipType: string): string {
        const rel: string = (relationshipType || '').toLowerCase();
        const isMany: boolean = side === 'Many'
            || rel.indexOf('many') !== -1
            || rel.indexOf('mandatory') !== -1;
        return isMany ? 'Many' : 'One';
    }

    /**
     * Picks the appropriate decorator shape for an ER multiplicity value.
     *
     * @param {string} multiplicity - The ErMultiplicityTypes value.
     * @returns {string} - A valid DecoratorShapes value.
     */
    private getCrowDecorator(multiplicity: string): string {
        return multiplicity === 'Many' ? 'Crow' : 'None';
    }

    /**
     * Formats a successful result in the WebMCP standard response format.
     *
     * @param {unknown} data - The payload serialized into the response content.
     * @returns {WebMcpToolResponse} - The tool response.
     */
    private message(data: unknown): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    /**
     * Formats a failure in the WebMCP standard response format.
     *
     * @param {string} text - The message describing what went wrong.
     * @returns {WebMcpToolResponse} - The tool response flagged as an error.
     */
    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
    }
}

/**
 * Defines the settings for WebMCP integration in the Diagram component.
 * Provides declarative configuration for tool registration and exposure.
 */
export class WebMcpDiagramSettings extends ChildProperty<WebMcpDiagramSettings> {
    /**
     * Name of the diagram for organizing registered tools
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * Array of tool names or custom WebMcpTool definitions to register
     *
     * @default null
     */
    @Property(null)
    public tools: string[] | WebMcpTool[];

    /**
     * Optional list of allowed origins for cross-origin iframe access
     *
     * @default null
     */
    @Property(null)
    public exposedTo: string[];
}
