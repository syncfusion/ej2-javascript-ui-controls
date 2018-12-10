import { NodeModel, SwimLaneModel } from '../objects/node-model';
import { Node } from '../objects/node';
import { Diagram } from '../diagram';
import { ConnectorModel } from '../objects/connector-model';
import { Connector } from '../objects/connector';
import { PointModel } from '../primitives/point-model';
import { SelectorModel } from './selector-model';
import { Selector } from './selector';
import { Size } from '../primitives/size';
import { cloneObject } from './../utility/base-util';
import { getObjectType } from './../utility/diagram-util';
import { HistoryEntry } from '../diagram/history';
import { GridPanel, GridRow, RowDefinition, ColumnDefinition } from '../core/containers/grid';
import { Canvas } from '../core/containers/canvas';
import { Rect } from '../primitives/rect';
import { getAdornerLayerSvg } from '../utility/dom-util';
import { DiagramElement } from '../core/elements/diagram-element';
import { StackEntryObject, IElement } from '../objects/interface/IElement';
import { Actions } from './actions';
import { Container } from '../core/containers/container';
import { NodeConstraints } from '../enum/enum';
/**
 * Interaction for Container
 */

//#region canvas Container interaction

/** @private */
export function updateCanvasBounds(diagram: Diagram, obj: NodeModel | ConnectorModel, position: PointModel, isBoundsUpdate: boolean): void {
    let container: NodeModel;
    if (checkParentAsContainer(diagram, obj, true)) {
        container = diagram.nameTable[(obj as Node).parentId];
        let wrapper: Canvas = container.wrapper as Canvas;
        if (container && container.container.type === 'Canvas') {
            if ((isBoundsUpdate || (wrapper.bounds.x <= position.x && wrapper.bounds.right >= position.x &&
                (wrapper.bounds.y <= position.y && wrapper.bounds.bottom >= position.y)))) {
                if (wrapper.actualSize.width < wrapper.outerBounds.width &&
                    (!(wrapper.bounds.x > wrapper.outerBounds.x))) {
                    if (container.rowIndex !== undefined) {
                        let parent: NodeModel = diagram.nameTable[(container as Node).parentId];
                        if (parent.columns.length - 1 === container.columnIndex) {
                            let x: number = wrapper.bounds.x;
                            let y: number = wrapper.bounds.y;
                            (wrapper).maxWidth = wrapper.outerBounds.width;
                            (parent.wrapper as GridPanel).updateColumnWidth(container.columnIndex, wrapper.outerBounds.width);
                            diagram.drag(parent, x - wrapper.bounds.x, y - wrapper.bounds.y);
                            diagram.updateDiagramObject(parent);
                        }
                    } else {
                        diagram.scale(
                            container, (1 + ((wrapper.outerBounds.width - wrapper.actualSize.width) / wrapper.actualSize.width)), 1,
                            ((wrapper.outerBounds.x < wrapper.bounds.x) ? { x: 1, y: 0.5 } : { x: 0, y: 0.5 }));
                    }
                }
                if (wrapper.actualSize.height < wrapper.outerBounds.height &&
                    (!(wrapper.bounds.y > wrapper.outerBounds.y))) {
                    if (container.rowIndex !== undefined) {
                        let contai: NodeModel = diagram.nameTable[(container as Node).parentId];
                        let x: number = wrapper.bounds.x;
                        let y: number = wrapper.bounds.y;
                        (wrapper).maxHeight = wrapper.outerBounds.height;
                        (contai.wrapper as GridPanel).updateRowHeight(container.rowIndex, wrapper.outerBounds.height);
                        diagram.drag(contai, x - wrapper.bounds.x, y - wrapper.bounds.y);
                    } else {
                        diagram.scale(
                            container, 1, (1 + ((wrapper.outerBounds.height - wrapper.actualSize.height) / wrapper.actualSize.height)),
                            ((wrapper.outerBounds.y < wrapper.bounds.y) ? { x: 0.5, y: 1 } : { x: 0.5, y: 0 }));
                    }
                }
            } else if (container.container.type === 'Canvas') {
                let undoObj: NodeModel = cloneObject(obj);
                diagram.clearSelection();
                diagram.deleteChild(obj);
                (obj as Node).parentId = '';
                let entry: HistoryEntry = {
                    type: 'ChildCollectionChanged', category: 'Internal',
                    undoObject: undoObj, redoObject: cloneObject(obj)
                };
                diagram.addHistoryEntry(entry);
            }
            diagram.select([obj as NodeModel]);

        }
    }
}

/** @private */
export function findBounds(obj: NodeModel, columnIndex: number, isHeader: boolean): Rect {
    let rect: Rect = new Rect();
    let rows: GridRow[] = ((obj as Node).shape.type === 'SwimLane') ?
        (obj.wrapper.children[0] as GridPanel).rows : (obj.wrapper as GridPanel).rows;
    for (let i: number = ((isHeader) ? 1 : 0); i < rows.length; i++) {
        rect.uniteRect(rows[i].cells[columnIndex].bounds);
    }
    return rect;
}

/** @private */
export function createHelper(diagram: Diagram, obj: Node): Node {
    let newObj: Node;
    let cloneObject: Node | Connector = {} as Node | Connector;
    for (let prop of Object.keys(obj)) {
        cloneObject[prop] = obj[prop];
    }
    if (getObjectType(obj) === Node) {
        newObj = new Node(diagram, 'nodes', cloneObject, true);
        newObj.id = obj.id;
        diagram.initObject(newObj as Node);
    }
    diagram.updateDiagramObject(newObj);
    return newObj;
}

/** @private */
export function renderContainerHelper(diagram: Diagram, obj: SelectorModel | NodeModel): NodeModel | ConnectorModel {
    let object: NodeModel | ConnectorModel;
    let nodes: NodeModel;
    if (diagram.selectedObject.helperObject) {
        nodes = diagram.selectedObject.helperObject;
    } else {
        if (obj instanceof Selector && obj.nodes.length + obj.connectors.length === 1) {
            object = (obj.nodes.length > 0) ? obj.nodes[0] : obj.connectors[0];
        } else {
            object = obj as NodeModel;
        }
        diagram.selectedObject.actualObject = object as NodeModel;
        let container: Canvas = diagram.selectedItems.wrapper.children[0] as Canvas;
        if (checkParentAsContainer(diagram, object)) {
            let node: NodeModel = {
                id: 'helper',
                rotateAngle: container.rotateAngle,
                offsetX: container.offsetX, offsetY: container.offsetY,
                minWidth: container.minWidth, minHeight: container.minHeight,
                maxWidth: container.maxWidth, maxHeight: container.maxHeight,
                width: container.actualSize.width,
                height: container.actualSize.height,
                style: { strokeDashArray: '2 2', fill: 'transparent', strokeColor: 'red' }
            };
            nodes = createHelper(diagram, node as Node) as NodeModel;
            diagram.selectedObject.helperObject = nodes;
        }
    }
    return nodes;
}

/** @private */
export function checkParentAsContainer(diagram: Diagram, obj: NodeModel | ConnectorModel, isChild?: boolean): boolean {
    let parentNode: NodeModel = (isChild) ? diagram.nameTable[(obj as Node).parentId] :
        (diagram.nameTable[(obj as Node).parentId] || obj as Node);
    if (parentNode && parentNode.container) {
        return true;
    }
    return false;
}

/** @private */
export function checkChildNodeInContainer(diagram: Diagram, obj: NodeModel): void {
    let parentNode: NodeModel = diagram.nameTable[(obj as Node).parentId];
    if (parentNode.container.type === 'Canvas') {
        obj.margin.left = (obj.offsetX - parentNode.wrapper.bounds.x - (obj.width / 2));
        obj.margin.top = (obj.offsetY - parentNode.wrapper.bounds.y - (obj.height / 2));
    }
    diagram.nodePropertyChange(obj as Node, {} as Node, {
        width: obj.width, height: obj.height,
        offsetX: obj.offsetX, offsetY: obj.offsetY,

        margin: {
            left: obj.margin.left,
            right: obj.margin.right, top: obj.margin.top,
            bottom: obj.margin.bottom
        }, rotateAngle: obj.rotateAngle
    } as Node);
    parentNode.wrapper.measure(new Size());
    parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
}


/**
 * @private
 */
export function addChildToContainer(diagram: Diagram, parent: NodeModel, node: NodeModel): void {
    if (!diagram.currentSymbol) {
        let child: string | NodeModel = (diagram.nodes.indexOf(node) !== -1) ? node.id : node;
        if (parent.container.type === 'Canvas') {
            let left: number = (node.wrapper.offsetX - node.wrapper.actualSize.width / 2) -
                (parent.wrapper.offsetX - parent.wrapper.actualSize.width / 2);
            let top: number = (node.wrapper.offsetY - node.wrapper.actualSize.height / 2) -
                (parent.wrapper.offsetY - parent.wrapper.actualSize.height / 2);
            node.margin.left = left; node.margin.top = top;
        }
        let container: NodeModel = diagram.nameTable[parent.id];
        if (!container.children) { container.children = []; }
        if (container.children.indexOf(node.id) === -1) {
            if ((node as Node).parentId !== '') {
                diagram.deleteChild(node);
            }
            let undoObj: NodeModel = cloneObject(node);
            diagram.addChild(container, child);
            let entry: HistoryEntry = {
                type: 'ChildCollectionChanged', category: 'Internal',
                undoObject: undoObj, redoObject: cloneObject(node)
            };
            diagram.addHistoryEntry(entry);
            diagram.updateDiagramObject(container);
        }
    }
}

//#endregion

//# reginon stack panel interaction

/** @private */
export function renderStackHighlighter(
    element: DiagramElement, isVertical: Boolean, position: PointModel, diagram: Diagram, isUml?: boolean): void {
    let adornerSvg: SVGElement = getAdornerLayerSvg(diagram.element.id);
    diagram.diagramRenderer.renderStackHighlighter(element, adornerSvg, diagram.scroller.transform, isVertical, position, isUml);
}

/** @private */
export function moveChildInStack(sourceNode: Node, target: Node, diagram: Diagram, action: Actions): void {
    let obj: Node = sourceNode;
    let parent: Node = diagram.nameTable[(obj as Node).parentId];
    let sourceParent: Node = diagram.nameTable[(obj as Node).parentId];
    if (target && sourceParent && sourceParent.container && sourceParent.container.type === 'Stack' &&
        target.container && target.container.type === 'Stack' && (sourceParent.id !== target.parentId)) {
        let value: number = sourceParent.wrapper.children.indexOf(obj.wrapper);
        if (value > -1) {
            diagram.nameTable[obj.id].parentId = target.id;
            sourceParent.wrapper.children.splice(value, 1);
        }
    }
    if (target && target.parentId && (obj as Node).parentId && action === 'Drag') {
        let targetIndex: number = parent.wrapper.children.indexOf(target.wrapper);
        let sourceIndex: number = parent.wrapper.children.indexOf(obj.wrapper);
        let undoElement: StackEntryObject = {
            targetIndex: targetIndex, target: target,
            sourceIndex: sourceIndex, source: sourceNode
        };
        parent.wrapper.children.splice(sourceIndex, 1);
        parent.wrapper.children.splice(targetIndex, 0, obj.wrapper);
        let redoElement: StackEntryObject = {
            targetIndex: sourceIndex, target: target,
            sourceIndex: targetIndex, source: sourceNode
        };
        let entry: HistoryEntry = {
            type: 'StackChildPositionChanged', redoObject: redoElement as NodeModel,
            undoObject: undoElement as NodeModel, category: 'Internal'
        };
        diagram.commandHandler.addHistoryEntry(entry);
    }
}

//#end region

//# region Swimlane rendering

/** @private */
export function initSwimLane(grid: GridPanel, diagram: Diagram, node: NodeModel): void {
    let row: RowDefinition[] = [];
    let columns: ColumnDefinition[] = [];
    let orientation: boolean = (node.shape as SwimLaneModel).orientation === 'Horizontal' ? true : false;
    if ((node.shape as SwimLaneModel).header) {
        createRow(row, (node.shape as SwimLaneModel).header.height);
    }
    initGridRow(row, orientation, node);
    initGridColumns(columns, orientation, node);
    grid.setDefinitions(row, columns);
    let index: number = 0;
    if ((node.shape as SwimLaneModel).header) {
        headerDefine(grid, diagram, node);
        index++;
    }

    if ((node.shape as SwimLaneModel).phases.length > 0) {
        phaseDefine(grid, diagram, node, index, orientation);
        index++;
    }
    if ((node.shape as SwimLaneModel).lanes.length > 0) {
        for (let k: number = 0; k < (node.shape as SwimLaneModel).lanes.length; k++) {
            laneCollection(grid, diagram, node, index, k, orientation);
            index++;
        }
    }
}

/** @private */
export function addObjectToGrid(diagram: Diagram, grid: GridPanel, parent: NodeModel, object: NodeModel, isHeader?: boolean): Container {
    let node: Node = new Node(parent, 'nodes', object);
    node.parentId = grid.id;
    if (isHeader) { node.isHeader = true; }
    diagram.initObject(node);

    if (node.wrapper.children.length > 0) {
        for (let i: number = 0; i < node.wrapper.children.length; i++) {
            let child: DiagramElement = node.wrapper.children[i];
            if (child instanceof DiagramElement) {
                child.isCalculateDesiredSize = false;
            }
        }
    }
    return node.wrapper;
}

// /** @private */
// export function addGridObject(
//     diagram: Diagram, grid: Grid, object: NodeModel, isHeader?: boolean, rowValue?: number, colValue?: number,
//     nodeObj?: NodeModel, orientation?: boolean, lanesNo?: number): void {
//     let node: Node = new Node(object, 'nodes', { container: { type: 'Canvas', orientation: 'Horziontal' } });
//     diagram.initObject(node as IElement);
//     node.parentId = grid.id;
//     if (isHeader) {
//         (node as Node).isHeader = true;
//     }
//     diagram.nodes.push(node);
//     let canvas: Container = node.wrapper;
//     node.rowIndex = rowValue; node.columnIndex = colValue;
//     canvas.children = [];
//     if (nodeObj) {
//         if (lanesNo !== undefined) {
//             orientation ? canvas.verticalAlignment = 'Stretch' : canvas.horizontalAlignment = 'Stretch';
//             canvas.relativeMode = 'Object';
//             if (orientation) {
//                 nodeObj.width = (object.shape as SwimLaneModel).lanes[lanesNo].header.width;
//             } else {
//                 nodeObj.height = (object.shape as SwimLaneModel).lanes[lanesNo].header.width;
//             }
//         }
//         let node: Node = new Node(object, 'nodes', nodeObj);
//         node.parentId = grid.id;
//         node.rowIndex = rowValue; node.columnIndex = colValue;
//         if (isHeader) {
//             (node as Node).isHeader = true;
//         }
//         diagram.initObject(node);
//         if (lanesNo === undefined) {
//             if (isHeader) {
//                 node.wrapper.horizontalAlignment = 'Stretch';
//             } else {
//                 orientation ? node.wrapper.horizontalAlignment = 'Stretch' : node.wrapper.verticalAlignment = 'Stretch';
//             }
//             canvas.horizontalAlignment = node.wrapper.horizontalAlignment;
//             canvas.verticalAlignment = node.wrapper.verticalAlignment;
//             canvas.relativeMode = node.wrapper.relativeMode = 'Object';
//         } else {
//             orientation ? node.wrapper.verticalAlignment = 'Stretch' : node.wrapper.horizontalAlignment = 'Stretch';
//             node.wrapper.relativeMode = 'Object';
//         }
//         if (node.wrapper.children.length > 0) {
//             for (let i: number = 0; i < node.wrapper.children.length; i++) {
//                 let child: DiagramElement = node.wrapper.children[i];
//                 if (child instanceof DiagramElement) {
//                     child.isCalculateDesiredSize = false;
//                 }
//             }
//         }

//         canvas.children.push(node.wrapper);
//     }
//     grid.addObject(canvas, rowValue, colValue, 1, (isHeader) ? grid.columnDefinitions().length : 1);
// }

/** @private */
export function headerDefine(grid: GridPanel, diagram: Diagram, object: NodeModel): void {
    let node: object = {
        annotations: [{ content: (object.shape as SwimLaneModel).header.content.content }],
        style: (object.shape as SwimLaneModel).header.style,
        rowIndex: 0, columnIndex: 0,
        container: { type: 'Canvas', orientation: 'Horizontal' }
    };
    let wrapper: Container = addObjectToGrid(diagram, grid, object, node, true);
    grid.addObject(wrapper, 0, 0, 1, grid.columnDefinitions().length);
}

/** @private */
export function phaseDefine(grid: GridPanel, diagram: Diagram, object: NodeModel, indexValue: number, orientation: boolean): void {
    let rowValue: number = 0; let colValue: number = 0;
    for (let k: number = 0; k < (object.shape as SwimLaneModel).phases.length; k++) {
        if (orientation) {
            colValue = k; rowValue = indexValue;
        } else {
            rowValue = (object.shape as SwimLaneModel).header ? k + 1 : k;
        }
        let phaseObject: NodeModel = {
            annotations: [{
                content: (object.shape as SwimLaneModel).phases[k].header.content.content,
                rotateAngle: orientation ? 0 : 270
            }],
            style: (object.shape as SwimLaneModel).phases[k].style,
            rowIndex: rowValue, columnIndex: colValue,
            container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
        };
        let wrapper: Container = addObjectToGrid(diagram, grid, object, phaseObject);
        grid.addObject(wrapper, rowValue, colValue);
    }
}

/** @private */
export function laneCollection(
    grid: GridPanel, diagram: Diagram, object: NodeModel, indexValue: number, laneIndex: number, orientation: boolean): void {
    let value: number = (object.shape as SwimLaneModel).phases.length || 1;
    let colValue: number = 0; let rowValue: number = orientation ? indexValue : 1;
    let phaseCount: number = (object.shape as SwimLaneModel).phases.length > 0 ? 1 : 0;
    for (let l: number = 0; l < value; l++) {
        colValue = orientation ? l : laneIndex + phaseCount;
        let canvas: NodeModel = {
            id: (object.shape as SwimLaneModel).lanes[laneIndex].id + l,
            rowIndex: rowValue, columnIndex: colValue,
            style: (object.shape as SwimLaneModel).lanes[laneIndex].style,
            constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
            container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
        };
        let parentWrapper: Container = addObjectToGrid(diagram, grid, object, canvas);
        parentWrapper.children[0].isCalculateDesiredSize = false;
        if (l === 0) {
            let laneNode: NodeModel;
            laneNode = {
                id: (object.shape as SwimLaneModel).lanes[laneIndex].id + '_header',
                style: (object.shape as SwimLaneModel).lanes[laneIndex].header.style,
                annotations: [{
                    content: (object.shape as SwimLaneModel).lanes[laneIndex].header.content.content,
                    rotateAngle: orientation ? 270 : 0
                }],
                rowIndex: rowValue, columnIndex: colValue,
                container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
            };
            (orientation) ? laneNode.width = (object.shape as SwimLaneModel).lanes[laneIndex].header.width :
                laneNode.height = (object.shape as SwimLaneModel).lanes[laneIndex].header.width;
            let childWrapper: Container = addObjectToGrid(diagram, grid, object, laneNode);
            parentWrapper.children.push(childWrapper);
        }
        grid.addObject(parentWrapper, rowValue, colValue);
        if (!orientation) {
            rowValue++;
        }
        colValue = orientation ? l : laneIndex + 1;
    }
}

// /** @private */
// export function laneDefine(
//     grid: Grid, diagram: Diagram, object: NodeModel, indexValue: number, laneIndex: number, orientation: boolean): void {
//     let value: number = orientation ? grid.columnDefinitions().length : (object.shape as SwimLaneModel).phases.length || 1;
//     let colValue: number = 0;
//     let rowValue: number = 0;
//     let phaseLength: number = (object.shape as SwimLaneModel).phases.length > 0 ? 1 : 0;
//     rowValue = orientation ? indexValue : 1;
//     for (let l: number = 0; l < value; l++) {
//         colValue = orientation ? l : laneIndex + phaseLength;
//         let node: NodeModel = {
//             style: (object.shape as SwimLaneModel).lanes[laneIndex].style, width: object.width, height: object.height
//         };
//         addGridObject(diagram, grid, object, false, orientation ? rowValue : rowValue, colValue);
//         if (l === 0) {
//             let laneNode: NodeModel;
//             laneNode = {
//                 id: (object.shape as SwimLaneModel).lanes[laneIndex].id,
//                 style: (object.shape as SwimLaneModel).lanes[laneIndex].header.style,
//                 annotations: [{
//                     content: (object.shape as SwimLaneModel).lanes[laneIndex].header.content.content,
//                     rotateAngle: orientation ? 270 : 0
//                 }],
//                 container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
//             };
//             addGridObject(diagram, grid, object, false, rowValue, orientation ? 0 : colValue, laneNode, orientation, laneIndex);
//         }
//         if (!orientation) {
//             rowValue++;
//         }
//         colValue = orientation ? l : laneIndex + 1;
//     }
// }

/** @private */
export function createRow(row: RowDefinition[], height: number): void {
    let rows: RowDefinition = new RowDefinition();
    rows.height = height;
    row.push(rows);
}

/** @private */
export function createColumn(width: number): ColumnDefinition {
    let cols: ColumnDefinition = new ColumnDefinition();
    cols.width = width;
    return cols;
}

/** @private */
export function initGridRow(row: RowDefinition[], orientation: boolean, object: NodeModel): void {
    let totalHeight: number = 0; let height: number;
    if (row.length > 0) {
        for (let i: number = 0; i < row.length; i++) {
            totalHeight += row[i].height;
        }
    }
    if (orientation) {
        if ((object.shape as SwimLaneModel).phases.length > 0) {
            totalHeight += (object.shape as SwimLaneModel).phases[0].height;
            createRow(row, (object.shape as SwimLaneModel).phases[0].height);
        }
        if ((object.shape as SwimLaneModel).lanes.length > 0) {
            for (let i: number = 0; i < (object.shape as SwimLaneModel).lanes.length; i++) {
                height = (object.shape as SwimLaneModel).lanes[i].height; totalHeight += height;
                if (i === (object.shape as SwimLaneModel).lanes.length - 1 && totalHeight < object.height) {
                    height += object.height - totalHeight;
                }
                createRow(row, height);
            }
        }
    } else {
        if ((object.shape as SwimLaneModel).phases.length > 0) {
            for (let i: number = 0; i < (object.shape as SwimLaneModel).phases.length; i++) {
                height = (object.shape as SwimLaneModel).phases[i].offset; totalHeight += height;
                if (i === (object.shape as SwimLaneModel).phases.length - 1 && totalHeight < object.height) {
                    height += object.height - totalHeight;
                }
                createRow(row, height);
            }
        } else {
            createRow(row, object.height);
        }
    }
}

/** @private */
export function initGridColumns(columns: ColumnDefinition[], orientation: boolean, object: NodeModel): void {
    let totalWidth: number = 0;
    if ((object.shape as SwimLaneModel).phases.length > 0 && (object.shape as SwimLaneModel).orientation === 'Horizontal') {
        for (let j: number = 0; j < (object.shape as SwimLaneModel).phases.length; j++) {
            totalWidth += (object.shape as SwimLaneModel).phases[j].offset;
            let cols: ColumnDefinition = createColumn((object.shape as SwimLaneModel).phases[j].offset);
            if (j === (object.shape as SwimLaneModel).phases.length - 1 && totalWidth < object.width) {
                cols.width += object.width - totalWidth;
            }
            columns.push(cols);
        }
    } else if (!orientation) {
        let value: number = (object.shape as SwimLaneModel).phases.length > 0 ? (object.shape as SwimLaneModel).lanes.length
            + 1 : (object.shape as SwimLaneModel).lanes.length;
        for (let j: number = 0; j < value; j++) {
            if (j === 0 && (object.shape as SwimLaneModel).phases.length > 0) {
                totalWidth += (object.shape as SwimLaneModel).phases[0].height;
                let cols: ColumnDefinition = createColumn((object.shape as SwimLaneModel).phases[0].height);
                columns.push(cols);
            } else {
                totalWidth += (object.shape as SwimLaneModel).lanes[0].height;
                let cols: ColumnDefinition = createColumn((object.shape as SwimLaneModel).lanes[0].height);
                if (j === (object.shape as SwimLaneModel).lanes.length && totalWidth < object.width) {
                    cols.width += object.width - totalWidth;
                }
                columns.push(cols);
            }
        }

    } else {
        let cols: ColumnDefinition = createColumn(object.width);
        columns.push(cols);
    }
}

//#end region