import { Diagram } from '../diagram';
import {
    NodeModel, UmlClassifierShapeModel, UmlClassModel, ContainerModel,
    UmlEnumerationModel, UmlEnumerationMemberModel, UmlClassAttributeModel, UmlClassMethodModel
} from '../objects/node-model';
import { DiagramElement } from '../core/elements/diagram-element';
import { ShapeStyleModel, TextStyleModel } from '../core/appearance-model';
import { NodeConstraints, TextWrap, AnnotationConstraints, DiagramAction } from '../enum/enum';
import { Container, Header, Node } from '../objects/node';
import { cloneObject, randomId } from './../utility/base-util';
import { TextElement } from '../core/elements/text-element';
import { GroupableView } from '../core/containers/container';
import { Connector } from '../objects/connector';
import { Canvas } from '../core/containers/canvas';
import { Size } from '../primitives/size';
import { getDiagramElement } from './dom-util';
import { HistoryEntry } from '../diagram/history';
import { Rect } from '../primitives/rect';
import { PointModel } from '../primitives/point-model';
import { Matrix, transformPointByMatrix, identityMatrix, rotateMatrix } from '../primitives/matrix';
import { ConnectorModel } from '../objects/connector-model';
import { PathElement } from '../core/elements/path-element';
import { Layer } from '../diagram/layer';

/**
 * Container wrapper initialization \
 *
 * @returns {DiagramElement} initContainerWrapper method. \
 * @param {DiagramElement} content - Provide the content value.
 * @param {NodeModel} node - Provide the node value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
export function initContainerWrapper(content: DiagramElement, node: NodeModel, diagram: Diagram): DiagramElement {
    content = getContainerElement(content, (node as Node), diagram);
    return content;
}

/**
 * Apply styles to the element \
 *
 * @returns {void} setStyle method. \
 * @param {DiagramElement} child - Provide the child value.
 * @param {Node} node - Provide the node value.
 * @private
 */
function setStyle(child: DiagramElement, node: Node): void {
    //set style
    child.style.fill = node.style.fill; child.style.strokeColor = node.style.strokeColor;
    child.style.strokeWidth = node.style.strokeWidth;
    child.style.strokeDashArray = node.style.strokeDashArray;
    child.style.opacity = node.style.opacity; child.style.gradient = node.style.gradient;
    //941052: Issue with visible property doesn't hide shadows
    if ((node.constraints & NodeConstraints.Shadow) !== 0 && node.visible) {
        child.shadow = node.shadow;
    }
}

/**
 * Gets the container element for a node \
 *
 * @returns {GroupableView} getContainerElement method. \
 * @param {DiagramElement} content - Provide the content value.
 * @param {Node} node - Provide the node value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
function getContainerElement(content: DiagramElement, node: Node, diagram: Diagram): GroupableView {
    const container: Canvas = new Canvas();
    //set style
    setStyle(container, node);
    container.id = node.id + '_container';
    const size: Size = getSize(node, content);
    node.width = size.width;
    node.height = size.height;
    content.id = node.id + '_content';
    content.width = size.width;
    content.height = size.height;
    setStyle(content, node);
    container.children = [content];
    if ((node.shape as Container).header && (node.shape as Container).hasHeader) {
        const header: GroupableView = initHeader(diagram, node);
        container.children.push(header);
    }
    const containerShapeObj: NodeModel = ((node.shape as any));
    if ((node.shape as any).children && (node.shape as any).children.length > 0) {
        for (let i: number = 0; i < containerShapeObj.children.length; i++) {
            const child: Node | Connector = diagram.nameTable[containerShapeObj.children[parseInt(i.toString(), 10)]];
            if (child && (!child.parentId || child.parentId === node.id)) {
                child.parentId = node.id;
                if (!child.margin.left) {
                    child.margin.left = 10;
                }
                if (!child.margin.top) {
                    child.margin.top = 10;
                }
                if ((node.shape as Container).header && (node.shape as Container).hasHeader && !diagram.isLoading
                    && !(diagram.diagramActions & DiagramAction.UndoRedo)) {
                    child.margin.top += (node.shape as Container).header.height;
                }
                const nodeOffsetX: number = (node.offsetX - node.width * node.pivot.x) +
                (child.margin.left + (child as Node).width * (child as Node).pivot.x);
                const nodeOffsetY: number = (node.offsetY - node.height * node.pivot.y) +
                    (child.margin.top + (child as Node).height * (child as Node).pivot.y);
                if ((child as Node).offsetX !== nodeOffsetX || (child as Node).offsetY !== nodeOffsetY) {
                    (child as Node).offsetX = nodeOffsetX;
                    (child as Node).offsetY = nodeOffsetY;
                }
                container.children.push(child.wrapper);
                updateIndex(diagram, child);
            }
        }
    }
    container.width = node.width;
    container.height = node.height;
    return container;
}

/**
 * Computes size for a node based on constraints and content \
 *
 * @returns {Size} getSize method. \
 * @param {Node} node - Provide the node value.
 * @param {DiagramElement} content - Provide the content value.
 * @private
 */
function getSize(node: Node, content: DiagramElement): Size {
    const size: Size = new Size(node.width, node.height);
    if (!(content instanceof PathElement)) {
        size.width = size.width || 50;
        size.height = size.height || 50;
    }
    if (content.actualSize.width && content.actualSize.height) {
        return content.actualSize;
    }
    if (node.maxWidth !== undefined) {
        size.width = Math.min(size.width, node.maxWidth);
    }
    if (node.maxHeight !== undefined) {
        size.height = Math.min(size.height, node.maxHeight);
    }
    if (node.minWidth !== undefined) {
        size.width = Math.max(size.width, node.minWidth);
    }
    if (node.minHeight !== undefined) {
        size.height = Math.max(size.height, node.minHeight);
    }
    return size;
}

/**
 * Updates the size for a container node when modified \
 *
 * @returns {void} setSizeForContainer method. \
 * @param {Node} newObject - Provide the newObject value.
 * @param {Node} oldObject - Provide the oldObject value.
 * @param {Node} object - Provide the object value.
 * @param {Canvas} wrapper - Provide the wrapper value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
export function setSizeForContainer(
    newObject: Node, oldObject: Node, object: Node, wrapper: Canvas, diagram: Diagram): void {

    wrapper.children[0].width = newObject.width;
    wrapper.children[0].height = newObject.height;

    if ((object.shape as Container).header && (object.shape as Container).hasHeader) {
        const header: NodeModel = diagram.nameTable[object.id + (object.shape as Container).header.id];
        header.wrapper.children[0].width = newObject.width;
        header.wrapper.measure(new Size(header.wrapper.bounds.width, header.wrapper.bounds.height));
        header.wrapper.arrange(header.wrapper.desiredSize);
    }
}

/**
 * Initialize header for container nodes \
 *
 * @returns {GroupableView} initHeader method. \
 * @param {Diagram} diagram - Provide the diagram value.
 * @param {NodeModel} object - Provide the object value.
 * @private
 */
function initHeader(diagram: Diagram, object: NodeModel): GroupableView {
    const shape: ContainerModel = object.shape as ContainerModel;
    shape.header.id = shape.header.id || randomId();
    const node: NodeModel = {
        id: object.id + shape.header.id,
        annotations: [cloneObject(shape.header.annotation)],
        style: shape.header.style,
        offsetX: object.offsetX, offsetY: object.offsetY,
        height: shape.header.height,
        width: object.width
    } as NodeModel;
    const wrapper: GroupableView = getHeaderWrapper(diagram, object, node, true);
    return wrapper;
}

/**
 * Retrieves the header wrapper for rendering \
 *
 * @returns {GroupableView} getHeaderWrapper method. \
 * @param {Diagram} diagram - Provide the diagram value.
 * @param {NodeModel} parent - Provide the parent value.
 * @param {NodeModel} object - Provide the object value.
 * @param {boolean} isHeader - Provide the isHeader value.
 * @private
 */
function getHeaderWrapper(
    diagram: Diagram, parent: NodeModel, object: NodeModel,
    isHeader?: boolean): GroupableView {

    const node: Node = new Node(diagram, 'nodes', object, true);
    node.parentId = parent.id;
    node.isHeader = isHeader;

    node.constraints &= ~(NodeConstraints.InConnect | NodeConstraints.OutConnect);
    node.constraints |= NodeConstraints.HideThumbs;
    diagram.initObject(node);
    diagram.nodes.push(node);

    if (node.wrapper.children.length > 0) {
        for (let i: number = 0; i < node.wrapper.children.length; i++) {
            const child: DiagramElement = node.wrapper.children[parseInt(i.toString(), 10)];
            if (child instanceof DiagramElement) {
                child.isCalculateDesiredSize = false;
            }
            if (child instanceof TextElement) {
                child.canConsiderBounds = false;
            }
        }
        node.wrapper.measure(new Size(undefined, undefined));
        node.wrapper.arrange(node.wrapper.desiredSize);
    }
    node.wrapper.measure(new Size(undefined, undefined));
    node.wrapper.arrange(node.wrapper.desiredSize);
    return node.wrapper;
}

/**
 * Updates the z-index and order of nodes within the diagram \
 *
 * @returns {void} updateIndex method. \
 * @param {Diagram} diagram - Provide the diagram value.
 * @param {Node | Connector} source - Provide the source value.
 * @private
 */
function updateIndex(diagram: Diagram, source: Node | Connector): void {
    const childNode: Node | Connector = source;
    const nodeindex: string = diagram.getIndex(childNode, childNode.id);
    const layerIndex: number = diagram.layers.indexOf(diagram.commandHandler.getObjectLayer(source.id));
    const layer: Layer = (diagram.layers[parseInt(layerIndex.toString(), 10)] as Layer);
    diagram.nodes.splice(Number(nodeindex), 1);
    delete layer.zIndexTable[childNode.zIndex];
    childNode.zIndex = layer.objectZIndex + 1;
    diagram.nodes.push((childNode as NodeModel));
    layer.zIndexTable[childNode.zIndex] = childNode.id;
}

/**
 * Manages the drop of a child node into a container node \
 *
 * @returns {void} dropContainerChild method. \
 * @param {Node} target - Provide the target value.
 * @param {Node} source - Provide the source value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
export function dropContainerChild(target: Node, source: Node, diagram: Diagram): void {
    const container: ContainerModel = diagram.nameTable[target.id].shape;
    container.children = container.children || [];
    const redoElement: NodeModel = cloneObject(source);
    const sources: DiagramElement = diagram.nameTable[source.id].wrapper;
    const targetWrapper: DiagramElement = diagram.nameTable[target.id].wrapper;
    sources.margin.top = (sources.offsetY - (sources.actualSize.height / 2))
        - (target.offsetY - (target.actualSize.height / 2));
    sources.margin.left = (sources.offsetX - (sources.actualSize.width / 2))
        - (target.offsetX - (target.actualSize.width / 2));
    diagram.nameTable[source.id].parentId = target.id;
    container.children.push(source.id);
    ((targetWrapper as Canvas).children[0] as Canvas).children.push(diagram.nameTable[source.id].wrapper);
    const bound: Rect = getChildrenBound(target, source.id, diagram);
    adjustContainerSize(bound, source, diagram, false);
    if (sources.margin.left < 0) {
        sources.margin.left = 10;
    }
    if (sources.margin.top < 0 || ((container as Container).hasHeader && (sources.margin.top < container.header.height))) {
        sources.margin.top = 10;
        if ((container as Container).hasHeader) {
            sources.margin.top += container.header.height;
        }
    }
    targetWrapper.measure(new Size(undefined, undefined));
    targetWrapper.arrange(targetWrapper.desiredSize);
    const obj: NodeModel = cloneObject(source);
    const entry: HistoryEntry = {
        type: 'PositionChanged', undoObject: { nodes: [redoElement] },
        redoObject: { nodes: [obj] }, category: 'Internal'
    };
    diagram.addHistoryEntry(entry);
    if (diagram.mode === 'SVG') {
        if (source.zIndex < target.zIndex) {
            diagram.moveSvgNode(source.id);
            updateIndex(diagram, source);
        }
        const parent: HTMLElement = getDiagramElement(target.id + '_groupElement');
        parent.appendChild(getDiagramElement(source.id + '_groupElement'));
    }
}

/**
 * Computes the bounding rectangle of children nodes excluding a specific child \
 *
 * @returns {Rect} getChildrenBound method. \
 * @param {Node} node - Provide the node value.
 * @param {string} excludeChild - Provide the excludeChild value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
export function getChildrenBound(node: Node, excludeChild: string, diagram: Diagram): Rect {
    const children: string[] = (node.shape as Container).children;
    let bound: Rect;
    if (children && children.length) {
        for (let _i: number = 0; _i < children.length; _i++) {
            const i: string = children[parseInt(_i.toString(), 10)];
            if (excludeChild !== i) {
                if (!bound) {
                    bound = diagram.nameTable['' + i].wrapper.bounds;
                }
                else {
                    bound = diagram.nameTable['' + i].wrapper.bounds.uniteRect(bound);
                }
            }
        }
    }
    return bound || diagram.nameTable['' + excludeChild].wrapper.bounds;
}

/**
 * Adjusts the container size based on child element bounds \
 *
 * @returns {void} adjustContainerSize method. \
 * @param {Rect} bound - Provide the bound value.
 * @param {Node} obj - Provide the obj value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @param {boolean} isDrag - Provide the isDrag value.
 * @private
 */
export function adjustContainerSize(bound: Rect, obj: Node, diagram: Diagram, isDrag: boolean): void {
    let diffX: number;
    let diffY: number;
    const node: Node = diagram.nameTable[obj.parentId];
    const pivot: PointModel = { x: 0.5, y: 0.5 };
    const actualSize: Size = node.wrapper.actualSize;
    let headerHeight: number = 0;
    if ((node.shape as Container).hasHeader) {
        headerHeight = (node.shape as Container).header.height;
    }
    if ((node.wrapper.bounds.left + obj.margin.left + obj.width) > (node.wrapper.bounds.right)) {
        pivot.x = 0;
        diffX = (obj.wrapper.margin.left + obj.wrapper.bounds.width) / actualSize.width;
    } else if (obj.margin.left < 0) {
        pivot.x = 1;
        diffX = (obj.wrapper.bounds.x + obj.wrapper.bounds.width) / node.wrapper.bounds.x;
    }
    if ((node.wrapper.bounds.top + obj.margin.top + obj.height) > (node.wrapper.bounds.bottom)) {
        pivot.y = 0;
        diffY = (obj.wrapper.margin.top + obj.wrapper.bounds.height) / actualSize.height;
    } else if (obj.margin.top < headerHeight && !isDrag) {
        pivot.y = 1;
        diffY = (obj.wrapper.bounds.y + obj.wrapper.bounds.height) / node.wrapper.bounds.y;
    }
    if ((diffX > 0 || diffY > 0) && (node.constraints & NodeConstraints.Resize)) {
        diagram.commandHandler.scale(diagram.nameTable[obj.parentId], diffX || 1, diffY || 1, pivot);
    }
}

/**
 * Handles drag operation of a child node within its container \
 *
 * @returns {void} dragContainerChild method. \
 * @param {Node} obj - Provide the obj value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @param {number} tx - Provide the tx value.
 * @param {number} ty - Provide the ty value.
 * @private
 */
export function dragContainerChild(obj: Node, diagram: Diagram, tx: number, ty: number): void {
    const node: NodeModel = diagram.nameTable[(obj).parentId];
    let headerHeight: number = 0;
    if ((node.shape as Container).hasHeader) {
        headerHeight = (node.shape as Container).header.height;
    }
    const newMargin: Margins = {
        top: (obj.margin.top + ty) - headerHeight >= 0 ? obj.margin.top + ty : obj.margin.top,
        left: obj.margin.left + tx >= 0 ? obj.margin.left + tx : obj.margin.left
    };
    if (newMargin.top !== obj.margin.top || newMargin.left !== obj.margin.left) {
        diagram.nodePropertyChange(obj as Node, {} as Node, { margin: newMargin } as Node);
    }
    const bound: Rect = getChildrenBound((node as Node), obj.id, diagram);
    adjustContainerSize(bound, obj, diagram, true);
    node.wrapper.measure(new Size(undefined, undefined));
    node.wrapper.arrange(node.wrapper.desiredSize);
    diagram.updateSelector();
    updateContainerDocks((node as Node), diagram);
}

/**
 * Change the child wrapper value in container while drop from symbol palette \
 *
 * @returns {void} updateChildWrapper method. \
 * @param {Node} node - Provide the id of node.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
export function updateChildWrapper(node: Node, diagram: Diagram): void {
    const containerChildren: any[] = diagram.nameTable[node.parentId].wrapper.children[0].children;
    for (let i: number = 0; i < containerChildren.length; i++) {
        if (containerChildren[parseInt(i.toString(), 10)].id === node.wrapper.id &&
            ((containerChildren[parseInt(i.toString(), 10)] as Node).offsetX === node.wrapper.offsetX ||
             (containerChildren[parseInt(i.toString(), 10)] as Node).offsetY === node.wrapper.offsetY)) {
            containerChildren[parseInt(i.toString(), 10)] = node.wrapper;
            break;
        }
    }
}

/**
 * Updates connections and dock positions for container's child nodes \
 *
 * @returns {void} updateContainerDocks method. \
 * @param {Node} obj - Provide the obj value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
export function updateContainerDocks(obj: Node, diagram: Diagram): void {
    const childTable: string[] = (obj.shape as Container).children;
    if (childTable) {
        for (const i of childTable) {
            const actualObject: Node = diagram.nameTable[`${i}`];
            if (actualObject) {
                diagram.updateConnectorEdges(actualObject);
                actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
                actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
                if ((actualObject.shape as Container).children
                    && (actualObject.shape as Container).children.length) {
                    updateContainerDocks(actualObject, diagram);
                }
            }
        }
    } else {
        return;
    }
}

/**
 * Removes a child node from its container \
 *
 * @returns {void} removeChildFromContainer method. \
 * @param {Node} currentObj - Provide the currentObj value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
export function removeChildFromContainer(currentObj: Node, diagram: Diagram): void {
    const element: NodeModel = diagram.nameTable[currentObj.parentId];
    if (currentObj.shape.type === 'Container') {
        if ((currentObj.shape as Container).children && (currentObj.shape as Container).children.length > 0) {
            const children: string[] = (currentObj.shape as Container).children;
            for (let j: number = children.length - 1; j >= 0; j--) {
                diagram.remove(diagram.nameTable[children[parseInt(j.toString(), 10)]]);
            }
        }
        if ((currentObj.shape as Container).hasHeader) {
            diagram.remove(diagram.nameTable[currentObj.id + (currentObj.shape as Container).header.id]);
        }
    }
    if (element) {
        diagram.removeDependentConnector(currentObj);
        const children: string[] = (element.shape as Container).children;
        removeGElement(element.wrapper, currentObj.id, diagram, true);
        if (children) {
            const childIndex: number = children.indexOf(currentObj.id);
            children.splice(childIndex, 1);
        }
    }
}

/**
 * Removes a child element from a container's layout \
 *
 * @returns {void} removeGElement method. \
 * @param {GroupableView} wrapper - Provide the wrapper value.
 * @param {string} name - Provide the name value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @param {boolean} isDelete - Provide the isDelete value.
 * @private
 */
export function removeGElement(wrapper: GroupableView, name: string, diagram?: Diagram, isDelete?: boolean): void {
    for (const i of wrapper.children) {
        if (i.id === name) {
            wrapper.children.splice(wrapper.children.indexOf(i), 1);
            if (!isDelete) {
                const element: HTMLElement = document.getElementById(i.id + '_groupElement');
                const diagramLayer: HTMLElement = document.getElementById((diagram as any).element.id + '_diagramLayer');
                const parent: HTMLElement = element.parentElement;
                parent.removeChild(element);
                diagramLayer.appendChild(element);
            }
        } else if ((i as GroupableView).children) {
            removeGElement((i as GroupableView), name, diagram, isDelete);
        }
    }
}

/**
 * Adds a child node to a container \
 *
 * @returns {void} addContainerChild method. \
 * @param {NodeModel} child - Provide the child value.
 * @param {string} parentId - Provide the parentId value.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
export function addContainerChild(child: NodeModel, parentId: string, diagram: Diagram): void {
    const id: string = child.id;
    let node: Node = diagram.nameTable[`${id}`];

    const undoElement: NodeModel = cloneObject(node);

    // Add the child to the diagram if it's not already present
    if (!node) {
        diagram.add(child);
        node = diagram.nameTable[`${id}`];
    }
    (child as Node).parentId = parentId;
    const parentContainer: NodeModel = diagram.nameTable[`${parentId}`];

    // Ensure the parent has a children structure
    const containerShape: any = parentContainer.shape;
    if (!containerShape.children) {
        containerShape.children = [];
    }

    // Check if the container and parent are correctly configured
    if (node && parentContainer) {
        node.parentId = parentId;
        if (node.margin.top <= 0 || ((parentContainer.shape as Container).hasHeader &&
            node.margin.top < (parentContainer.shape as Container).header.height)) {
            node.margin.top = 10;
            if ((parentContainer.shape as Container).hasHeader) {
                node.margin.top += (parentContainer.shape as Container).header.height;
            }
        }
        if (node.margin.left <= 0) {
            node.margin.left = 10;
        }
        const nodeOffsetX: number = (parentContainer.offsetX - parentContainer.width * parentContainer.pivot.x) +
            (node.margin.left + node.width * node.pivot.x);
        const nodeOffsetY: number = (parentContainer.offsetY - parentContainer.height * parentContainer.pivot.y) +
            (node.margin.top + node.height * node.pivot.y);
        if (node.offsetX !== nodeOffsetX || node.offsetY !== nodeOffsetY) {
            node.offsetX = nodeOffsetX;
            node.offsetY = nodeOffsetY;
        }
        const children: string[] = containerShape.children;
        // Add the container id to the parent's children list if not already present
        if (children.indexOf(id) < 0) {
            children.push(id);
        }
        // Append the container wrapper to the parent's wrapper and measure layout
        parentContainer.wrapper.children.push(node.wrapper);
        parentContainer.wrapper.measure(new Size());
        parentContainer.wrapper.arrange(parentContainer.wrapper.desiredSize);
        diagram.refreshDiagramLayer();

        // Record the action in history for undo/redo functionality
        if (!(diagram.diagramActions & DiagramAction.UndoRedo) && (!diagram.historyManager.currentEntry ||
            diagram.historyManager.currentEntry.type !== 'CollectionChanged')) {
            const obj: NodeModel = cloneObject(node);
            const entry: HistoryEntry = {
                type: 'PositionChanged',
                undoObject: { nodes: [undoElement] },
                redoObject: { nodes: [obj] },
                category: 'Internal'
            };
            diagram.addHistoryEntry(entry);
        }

        // If using SVG, configure DOM accordingly
        if (diagram.mode === 'SVG') {
            const childElement: HTMLElement = getDiagramElement(parentId + '_groupElement');
            childElement.appendChild(getDiagramElement(child.id + '_groupElement'));
        }
    }
}

/**
 * Removes a child node from its parent container while undo \
 *
 * @returns {void} removeChild method. \
 * @param {Node} node - Provide the id of node.
 * @param {Diagram} diagram - Provide the diagram value.
 * @private
 */
export function removeChild(node: Node, diagram: Diagram): void {
    const id: string = node.id;
    const parent: NodeModel = diagram.nameTable[node.parentId];
    const children: string[] = (parent.shape as Container).children;
    removeGElement(parent.wrapper, id, diagram, true);
    const childrenIndex: number = children.indexOf(id);
    children.splice(childrenIndex, 1);
    node.parentId = '';
    diagram.refreshDiagramLayer();
    diagram.updateSelector();
}

/** @private */
export interface Margins {
    top?: number;
    left?: number;
}
