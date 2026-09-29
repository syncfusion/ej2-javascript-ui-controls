/**
 * ER Node Rendering Utilities
 *
 * Handles ER Entity shape rendering using child node pattern
 * (similar to UML nodes). Each field is rendered as a child NodeModel
 * with annotations containing the combined field data.
 */

import { Diagram, EREventManager, ErShape } from '..';
import { ShapeStyleModel, TextStyleModel } from '../core/appearance-model';
import { DiagramElement } from '../core/elements/diagram-element';
import { TextElement } from '../core/elements/text-element';
import { HistoryEntry } from '../diagram/history';
import { DiagramAction, NodeConstraints, PortConstraints, PortVisibility, TextWrap } from '../enum/enum';
import { AnnotationModel, ShapeAnnotationModel } from '../objects/annotation-model';
import { ErFieldDefaultsModel, ErFieldModel, ErHeaderModel } from '../objects/er-objects-model';
import { Node } from '../objects/node';
import { ErShapeModel, NodeModel } from '../objects/node-model';
import { IErEntityChangedEventArgs } from '../objects/interface/IElement';
import { Size } from '../primitives/size';
import { cloneObject, randomId } from '../utility/base-util';
import { ERColumnarLayoutFactory, generateFieldRowAnnotations, areFieldRowPositionsEqual } from './er-columnar-layout';
import { updateErFieldColors } from './er-field-reorder-util';

/**
 * Get ER Entity child nodes for rendering
 *
 * Creates header, divider, and field child nodes for the ER entity.
 * Follows the same pattern as UML classifier rendering.
 *
 * @param {DiagramElement} content - The SVG/Canvas element for the node
 * @param {any} node - The parent ER entity node
 * @param {Diagram} diagram - The diagram instance
 * @returns {DiagramElement} The updated content element
 * @private
 */
export function getErShapes(content: DiagramElement, node: Node, diagram: Diagram): DiagramElement {
    const erEntity: ErShapeModel = node.shape as ErShapeModel;

    if (!erEntity) {
        return content;
    }

    const fields: ErFieldModel[] = erEntity.fields || [];
    const textWrap: TextWrap = node.maxWidth ? 'Wrap' : 'NoWrap';

    // Set up node container as vertical stack (like UML)
    node.container = { type: 'Stack', orientation: 'Vertical' };
    // Parent: allow horizontal resize only, hide thumbs, no rotation (same as UML)
    node.constraints = (NodeConstraints.Default | NodeConstraints.HideThumbs) &
        ~(NodeConstraints.Rotate | NodeConstraints.Resize) |
        NodeConstraints.ResizeEast | NodeConstraints.ResizeWest;

    node.children = [];

    // Calculate minimum width needed based on entity fields
    const minWidth: number = ERColumnarLayoutFactory.calculateMinimumWidth(erEntity);

    // Set minimum node dimensions
    if (!node.width || node.width < minWidth) {
        node.minWidth = minWidth * 2;
        if (diagram.nodes.length === 0 || diagram.nodes.indexOf(node) === -1) {
            node.offsetX += node.minWidth * 0.5;
        }
    }

    // Create header child node (uses header property from shape if configured)
    createErHeaderNode(node, diagram, erEntity, textWrap);

    // Create field nodes if there are fields, or create a placeholder if none exist
    if (!(erEntity as ErShape).collapsed) {
        if (fields.length > 0) {
            // Create field child nodes
            fields.forEach((field: ErFieldModel, index: number) => {
                createErFieldNode(node, diagram, field, index, textWrap);
            });
        } else {
            // Create placeholder field when no fields are defined
            const placeholdErField: ErFieldModel = {
                id: 'placeholder',
                name: 'Attribute',
                dataType: undefined,
                isPrimaryKey: false,
                isForeignKey: false,
                constraints: []
            };
            erEntity.fields = erEntity.fields || [];
            erEntity.fields.push(placeholdErField);
            createErFieldNode(node, diagram, placeholdErField, 0, textWrap);
        }
    }

    /* eslint-disable */
    diagram.initObject(node as any);
    /* eslint-enable */

    return content;
}

/**
 * Creates a header child node for an ER entity.
 * Uses header configuration from `shape.header` if provided, including
 * annotation content, height, and style. Merges user-provided styles
 * with ER smart defaults and applies hyperlink support via
 * `initAnnotationWrapper`.
 *
 * Header style uses ShapeStyleModel to support full stroke properties:
 * strokeColor, strokeWidth, strokeDashArray, and overrides parent node styling.
 *
 * @param {NodeModel} parentNode - Parent ER entity node
 * @param {Diagram} diagram - Diagram instance used for rendering
 * @param {ErShapeModel} erEntity - ER entity shape model containing header config
 * @param {TextWrap} textWrap - Text wrapping mode for header annotation
 * @returns {void} No return value
 * @private
 */
function createErHeaderNode(parentNode: NodeModel, diagram: Diagram, erEntity: ErShapeModel, textWrap: TextWrap): void {
    const header: ErHeaderModel = (erEntity.header || {}) as ErHeaderModel;

    // Resolve header dimensions
    const headerHeight: number = header.height ? header.height : 30;

    const headerStyle: ShapeStyleModel = header.style || {};
    const parentStyle: ShapeStyleModel = getParentNodeStyle(parentNode);

    const headerAnnotation: ShapeAnnotationModel = header.annotation || {};
    headerAnnotation.content = headerAnnotation.content ? headerAnnotation.content : 'Entity';
    headerAnnotation.style = headerAnnotation.style || {};
    (headerAnnotation.style as TextStyleModel).textWrapping = textWrap;

    let id: string = parentNode.id + 'ErEntityHeader';
    if (diagram.nameTable[`${id}`]) {
        id += randomId();
    }
    const headerNode: Node = new Node(
        diagram, 'nodes', {
            id: id,
            annotations: [headerAnnotation],
            height: headerHeight,
            constraints: (NodeConstraints.Default | NodeConstraints.HideThumbs) &
                ~(NodeConstraints.Rotate | NodeConstraints.Drag | NodeConstraints.Resize),
            style: getHeaderStyle(headerStyle, parentStyle),
            offsetX: parentNode.offsetX, offsetY: parentNode.offsetY
        }, true);

    (erEntity as ErShape).hasHeader = true;
    headerNode.parentId = parentNode.id;
    headerNode.isErHeader = true;
    headerNode.umlIndex = 0;
    if (diagram.nodes.length && diagram.nodes.indexOf(parentNode) !== -1) {
        diagram.nodes.push(headerNode);
    }
    diagram.initObject(headerNode);
    if (headerNode.wrapper.children.length > 0) {
        for (let i: number = 0; i < headerNode.wrapper.children.length; i++) {
            const child: DiagramElement = headerNode.wrapper.children[parseInt(i.toString(), 10)];
            if (child instanceof DiagramElement) {
                child.isCalculateDesiredSize = false;
            }
            if (child instanceof TextElement) {
                child.canConsiderBounds = false;
            }
        }
        headerNode.wrapper.measure(new Size(undefined, undefined));
        headerNode.wrapper.arrange(headerNode.wrapper.desiredSize);
    }
    parentNode.children = getChildernCollection(parentNode);
    parentNode.children.push(headerNode.id);
}

/**
 * Create a field child node for the ER entity
 *
 * Applies style cascade for field color:
 * 1. Field-level style.fill (if provided) - highest priority
 * 2. Node-level alternateRowColors pattern (if configured)
 * 3. Node-level style.fill (if provided)
 * 4. Default white (#ffffff)
 *
 * Uses columnar layout with dynamic annotations for name, type, and constraints.
 * Only includes columns that have data (e.g., if no NotNull/Unique flags, those columns omitted).
 *
 * Each annotation is positioned with proper separators (|) between columns.
 * Child nodes stretch to fill parent width with resolved fill color.
 * Children cannot be dragged independently but are fully selectable.
 *
 * @param {any} parentNode - The parent ER entity node
 * @param {Diagram} diagram - The diagram instance
 * @param {ErFieldModel} field - The ER field model
 * @param {number} index - The field index
 * @param {TextWrap} textWrap - Text wrapping mode
 * @param {boolean} addToParent - Add to parent flag
 * @param {string} fieldId - Entity Field ID
 * @returns {void}
 * @private
 */
function createErFieldNode(
    parentNode: NodeModel,
    diagram: Diagram,
    field: ErFieldModel,
    index: number,
    textWrap: TextWrap,
    addToParent: boolean = true,
    fieldId?: string
): NodeModel {
    const erEntity: ErShapeModel = parentNode.shape as ErShapeModel;
    const erFieldDefaults: ErFieldDefaultsModel = erEntity.fieldDefaults as ErFieldDefaultsModel || {};
    const erFieldStyle: ShapeStyleModel = cloneObject(field.style || {} as ShapeStyleModel);
    const parentStyle: ShapeStyleModel = getParentNodeStyle(parentNode);

    // Priority 1: Field-level style.fill (highest priority)
    // Priority 2: Node-level alternateRowColors pattern
    const hasValidFill: boolean = erFieldStyle && erFieldStyle.fill !== undefined && erFieldStyle.fill != null &&
        erFieldStyle.fill !== '' && erFieldStyle.fill !== 'none';

    if (!hasValidFill && erFieldDefaults && erFieldDefaults.alternateRowColors && erFieldDefaults.alternateRowColors.length >= 2) {
        erFieldStyle.fill = erFieldDefaults.alternateRowColors[index % 2];
    }

    const separatorColor: string = parentStyle.strokeColor;
    const annotations: AnnotationModel[] = generateFieldRowAnnotations(parentNode, field, diagram, separatorColor);
    field.id = field.id || (parentNode.id + 'ErField' + index);
    if (diagram.nameTable[`${field.id}`]) {
        field.id += randomId();
    }
    const fieldNode: Node = new Node(
        diagram, 'nodes', {
            id: field.id,
            annotations: annotations,
            height: erFieldDefaults.height || 25,
            verticalAlignment: 'Stretch',
            horizontalAlignment: 'Stretch',
            constraints: (NodeConstraints.Default | NodeConstraints.HideThumbs) &
                ~(NodeConstraints.Rotate | NodeConstraints.Resize),
            style: getFieldStyle(erFieldStyle, parentStyle),
            offsetX: parentNode.offsetX, offsetY: parentNode.offsetY
        }, true);

    fieldNode.parentId = parentNode.id;
    fieldNode.isErField = true;
    // Calculate index: header=0, fields start at 1
    fieldNode.umlIndex = index + 1;
    if (diagram.nodes.length && diagram.nodes.indexOf(parentNode) !== -1) {
        diagram.nodes.push(fieldNode);
        diagram.UpdateBlazorDiagramModel(fieldNode as Node, 'Node');
    }
    diagram.initObject(fieldNode);
    const effectiveFieldWidth: number | undefined = parentNode.width ||
        (parentNode.wrapper && parentNode.wrapper.actualSize ? parentNode.wrapper.actualSize.width : undefined) ||
        parentNode.minWidth;
    if (effectiveFieldWidth !== undefined && effectiveFieldWidth !== null) {
        fieldNode.width = effectiveFieldWidth;
        if (fieldNode.wrapper) {
            fieldNode.wrapper.width = effectiveFieldWidth;
        }
    }

    if (addToParent) {
        parentNode.children = getChildernCollection(parentNode);
        parentNode.children.push(fieldNode.id);
    }
    return fieldNode;
}

function getParentNodeStyle(parentNode: NodeModel): ShapeStyleModel {
    return parentNode.style || {};
}

function getChildernCollection(parentNode: NodeModel): string[] {
    return parentNode.children || [];
}
function getHeaderStyle(headerStyle: ShapeStyleModel, parentStyle: ShapeStyleModel): ShapeStyleModel {
    //default style: { fill: 'white', strokeColor: 'black', strokeWidth: 1 }
    if ((!headerStyle.fill || headerStyle.fill === 'none') && parentStyle.fill) {
        headerStyle.fill = parentStyle.fill;
    }
    if ((!headerStyle.strokeColor || headerStyle.strokeColor === 'none') && parentStyle.strokeColor) {
        headerStyle.strokeColor = parentStyle.strokeColor;
    }
    if ((!headerStyle.strokeWidth || headerStyle.strokeWidth === 0) && parentStyle.strokeWidth !== 0) {
        headerStyle.strokeWidth = parentStyle.strokeWidth;
    }
    if (headerStyle.strokeDashArray === '' && parentStyle.strokeDashArray !== '') {
        headerStyle.strokeDashArray = parentStyle.strokeDashArray;
    }
    if (headerStyle.opacity === 1 && parentStyle.opacity !== 1) {
        headerStyle.opacity = parentStyle.opacity;
    }
    if (headerStyle.gradient === undefined && parentStyle.gradient !== undefined) {
        headerStyle.gradient = parentStyle.gradient;
    }

    return headerStyle;
}

function getFieldStyle(fieldStyle: ShapeStyleModel, parentStyle: ShapeStyleModel): ShapeStyleModel {
    if ((!fieldStyle.fill || fieldStyle.fill === 'none') && parentStyle.fill) {
        fieldStyle.fill = parentStyle.fill;
    }
    if ((!fieldStyle.strokeColor || fieldStyle.strokeColor === 'none') && parentStyle.strokeColor) {
        fieldStyle.strokeColor = parentStyle.strokeColor;
    }
    // Check for undefined or 0, inherit from parent if not explicitly set
    if ((fieldStyle.strokeWidth === undefined || fieldStyle.strokeWidth === 0)
        && parentStyle.strokeWidth !== undefined && parentStyle.strokeWidth !== 0) {
        fieldStyle.strokeWidth = parentStyle.strokeWidth;
    }
    // Check for undefined or empty string, inherit from parent if not explicitly set
    if ((fieldStyle.strokeDashArray === undefined || fieldStyle.strokeDashArray === '') && parentStyle.strokeDashArray !== undefined && parentStyle.strokeDashArray !== '') {
        fieldStyle.strokeDashArray = parentStyle.strokeDashArray;
    }
    if (parentStyle.opacity !== 1 && fieldStyle.opacity === 1) {
        fieldStyle.opacity = parentStyle.opacity;
    }
    if (fieldStyle.gradient === undefined && parentStyle.gradient !== undefined) {
        fieldStyle.gradient = parentStyle.gradient;
    }

    return fieldStyle;
}


function getErFieldChildIndex(fieldIndex: number): number {
    return fieldIndex + 1;
}

function updateErFieldIndices(parentNode: NodeModel, diagram: Diagram): void {
    const nameTable: { [key: string]: NodeModel } = diagram.nameTable as { [key: string]: NodeModel };
    const fields: NodeModel[] = parentNode.children ? parentNode.children
        .map((childId: string) => nameTable[`${childId}`])
        .filter((child: NodeModel) => child && (child.id as string).includes('ErField')) : [];
    for (let i: number = 0; i < fields.length; i++) {
        const fieldNode: Node = fields[parseInt(i.toString(), 10)] as Node;
        if (fieldNode) {
            fieldNode.umlIndex = i + 1;
        }
    }
}

function refreshERFieldAnnotations(parentNode: NodeModel, diagram: Diagram): void {
    const nameTable: { [key: string]: NodeModel } = diagram.nameTable as { [key: string]: NodeModel };
    const erEntity: ErShapeModel = parentNode.shape as ErShapeModel;
    const fields: ErFieldModel[] = erEntity.fields || [];
    const fieldNodes: NodeModel[] = parentNode.children ? parentNode.children
        .map((childId: string) => nameTable[`${childId}`])
        .filter((child: NodeModel) => child && (child.id as string).includes('ErField')) : [];
    const nodeStrokeColor: string = (parentNode.style && parentNode.style.strokeColor) ? parentNode.style.strokeColor : '#cccccc';
    for (let i: number = 0; i < fieldNodes.length && i < fields.length; i++) {
        const fieldNode: Node = fieldNodes[parseInt(i.toString(), 10)] as Node;
        if (fieldNode) {
            fieldNode.annotations = generateFieldRowAnnotations(parentNode, fields[parseInt(i.toString(), 10)], diagram, nodeStrokeColor);
            diagram.updateDiagramObject(fieldNode);
        }
    }
}

function refreshERParentSize(parentNode: NodeModel, diagram: Diagram): void {
    if (!parentNode.wrapper) {
        return;
    }

    const explicitWidth: number | undefined = parentNode.width;

    if (explicitWidth !== undefined) {
        parentNode.wrapper.width = explicitWidth;
        parentNode.width = explicitWidth;
    } else {
        delete (parentNode.wrapper as any).width;
        parentNode.width = undefined;
    }
    delete (parentNode.wrapper as any).height;
    parentNode.height = undefined;

    const availableSize: Size = explicitWidth !== undefined ? new Size(explicitWidth, undefined) : new Size();
    parentNode.wrapper.measure(availableSize);
    parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
    parentNode.height = parentNode.wrapper.actualSize.height;
    parentNode.offsetX = parentNode.wrapper.offsetX;
    parentNode.offsetY = parentNode.wrapper.offsetY;
    diagram.updateDiagramObject(parentNode);
    diagram.updateDiagramElementQuad();
}

export function addErField(parentNode: NodeModel, diagram: Diagram, field: ErFieldModel,
                           index?: number, fieldNodeId?: string): NodeModel | null {
    if (!parentNode || !parentNode.shape) {
        return null;
    }

    const erEntity: ErShapeModel = parentNode.shape as ErShapeModel;
    erEntity.fields = erEntity.fields || [];
    const explicitWidth: number | undefined = parentNode.width;
    const fieldIndex: number = (index !== undefined && index >= 0 && index <= erEntity.fields.length)
        ? index : erEntity.fields.length;

    if (!field.id) {
        field.id = 'ErField' + randomId();
    }

    // Get event manager from diagram's erDiagramsModule
    const eventManager: EREventManager = diagram.erDiagramsModule.eventManager;
    const oldValue: IErEntityChangedEventArgs['oldValue'] = { fields: erEntity.fields ? erEntity.fields.slice() : [] };
    const newValue: IErEntityChangedEventArgs['newValue'] = { fields: oldValue.fields.slice() };
    newValue.fields.splice(fieldIndex, 0, field);
    if (eventManager) {
        const startAllowed: boolean = eventManager.fireEREntityChanged(diagram, parentNode as Node, oldValue, newValue, 'Start');
        if (!startAllowed) {
            return null;
        }
    }

    erEntity.fields.splice(fieldIndex, 0, field);

    const textWrap: TextWrap = parentNode.maxWidth ? 'Wrap' : 'NoWrap';
    const fieldNodeIdToUse: string = fieldNodeId || parentNode.id + 'ErField' + randomId();
    const fieldNode: NodeModel = createErFieldNode(parentNode, diagram, field, fieldIndex, textWrap, false, fieldNodeIdToUse);

    const childIndex: number = getErFieldChildIndex(fieldIndex);
    diagram.addChild(parentNode, fieldNode.id as string, childIndex);

    if (explicitWidth !== undefined && explicitWidth !== null) {
        parentNode.width = explicitWidth;
        if (parentNode.wrapper) {
            parentNode.wrapper.width = explicitWidth;
        }
    }

    updateErFieldIndices(parentNode, diagram);
    updateErFieldColors(parentNode, diagram);

    let shouldRefreshFields: boolean = false;
    if (parentNode.children) {
        const diagramNameTable: any = diagram.nameTable;
        for (let i: number = 1; i < parentNode.children.length; i++) {
            const childId: string = parentNode.children[parseInt(i.toString(), 10)];
            if (childId !== fieldNode.id) {
                const existingFieldNode: NodeModel = diagramNameTable[`${childId}`];
                if (existingFieldNode && !areFieldRowPositionsEqual(existingFieldNode, parentNode, diagram)) {
                    shouldRefreshFields = true;
                    break;
                }
            }
        }
    }

    if (shouldRefreshFields) {
        refreshERFieldAnnotations(parentNode, diagram);
    }
    if (parentNode.wrapper) {
        refreshERParentSize(parentNode, diagram);
    }

    if (eventManager) {
        eventManager.fireEREntityChanged(diagram, parentNode as Node, oldValue, { fields: erEntity.fields.slice() } as IErEntityChangedEventArgs['newValue'], 'Completed');
    }
    if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
        const historyEntry: HistoryEntry = {
            type: 'ErFieldCollectionChanged', changeType: 'Insert', category: 'Internal',
            undoObject: { parentId: parentNode.id, field: cloneObject(field), fieldNodeId: fieldNode.id, index: fieldIndex },
            redoObject: { parentId: parentNode.id, field: cloneObject(field), fieldNodeId: fieldNode.id, index: fieldIndex }
        } as HistoryEntry;
        diagram.addHistoryEntry(historyEntry);
    }
    return fieldNode;
}

export function removeErField(parentNode: NodeModel, diagram: Diagram, field: ErFieldModel): boolean {
    if (!parentNode || !parentNode.shape || !field) {
        return false;
    }

    const erEntity: ErShapeModel = parentNode.shape as ErShapeModel;
    if (!erEntity || erEntity.type !== 'Er' || !erEntity.fields || erEntity.fields.length === 0) {
        return false;
    }
    diagram.endEdit();
    // Get event manager from diagram's erDiagramsModule
    const eventManager: EREventManager = diagram.erDiagramsModule.eventManager;
    const oldValue: IErEntityChangedEventArgs['oldValue'] = { fields: erEntity.fields ? erEntity.fields.slice() : [] };

    const fieldIndex: number = erEntity.fields.findIndex((existingField: ErFieldModel) =>
        existingField === field ||
        (existingField.id && field.id && existingField.id === field.id)
    );

    if (fieldIndex < 0) {
        return false;
    }

    const newValue: IErEntityChangedEventArgs['newValue'] = { fields: oldValue.fields.slice() };
    newValue.fields.splice(fieldIndex, 1);
    if (eventManager) {
        const startAllowed: boolean = eventManager.fireEREntityChanged(diagram, parentNode as Node, oldValue, newValue, 'Start');
        if (!startAllowed) {
            return false;
        }
    }

    const childIndex: number = getErFieldChildIndex(fieldIndex);
    const childId: string | undefined = parentNode.children ? parentNode.children[parseInt(childIndex.toString(), 10)] : undefined;
    if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
        const historyEntry: HistoryEntry = {
            type: 'ErFieldCollectionChanged', changeType: 'Remove', category: 'Internal',
            undoObject: { parentId: parentNode.id, field: cloneObject(field), fieldNodeId: childId, index: fieldIndex },
            redoObject: { parentId: parentNode.id, field: cloneObject(field), fieldNodeId: childId, index: fieldIndex }
        } as HistoryEntry;
        diagram.addHistoryEntry(historyEntry);
    }

    erEntity.fields.splice(fieldIndex, 1);
    if (!parentNode.children) {
        parentNode.children = [];
    }

    const diagramNameTable: any = diagram.nameTable;
    if (childId && diagramNameTable[`${childId}`]) {
        const childNode: NodeModel = diagramNameTable[`${childId}`];
        diagram.removeFromAQuad(childNode as Node);
        diagram.deleteChild(childNode, parentNode, true);
        diagram.removeObjectsFromLayer(childNode);
        diagram.removeElements(childNode);
        const nodeIndex: number = diagram.nodes.indexOf(childNode as Node);
        if (nodeIndex !== -1) {
            diagram.nodes.splice(nodeIndex, 1);
        }
        delete diagramNameTable[`${childId}`];
    }

    // No placeholder is needed when the last ER field is removed;
    // the entity height will shrink naturally.

    updateErFieldIndices(parentNode, diagram);
    updateErFieldColors(parentNode, diagram);
    if (parentNode.wrapper) {
        refreshERParentSize(parentNode, diagram);
    }
    if (eventManager) {
        eventManager.fireEREntityChanged(diagram, parentNode as Node, oldValue, { fields: erEntity.fields.slice() } as IErEntityChangedEventArgs['newValue'], 'Completed');
    }

    return true;
}
