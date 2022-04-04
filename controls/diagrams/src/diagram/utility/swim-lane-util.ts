/* eslint-disable @typescript-eslint/no-unused-vars */
import { Diagram } from '../diagram';
import { NodeModel, LaneModel, PhaseModel, SwimLaneModel } from '../objects/node-model';
import { Node, Shape, SwimLane } from '../objects/node';
import { GridPanel, GridCell, GridRow, RowDefinition, ColumnDefinition } from '../core/containers/grid';
import { Lane, Phase } from '../objects/node';
import { DiagramAction, NodeConstraints, DiagramConstraints, DiagramEvent, ElementAction } from '../enum/enum';
import { cloneObject, randomId } from './../utility/base-util';
import { Container } from '../core/containers/container';
import { DiagramElement } from '../core/elements/diagram-element';
import { TextElement } from '../core/elements/text-element';
import { Size } from '../primitives/size';
import { PointModel } from '../primitives/point-model';
import { Canvas } from '../core/containers/canvas';
import { Rect } from '../primitives/rect';
import { HistoryEntry } from '../diagram/history';
import { StackEntryObject, ICollectionChangeEventArgs } from '../objects/interface/IElement';
import { Connector } from '../objects/connector';
import { ConnectorModel } from '../objects/connector-model';
import { SelectorModel } from '../objects/node-model';
import { checkParentAsContainer, findBounds, removeChildInContainer } from '../interaction/container-interaction';
import { IElement } from '../objects/interface/IElement';
import { ClipBoardObject } from '../interaction/command-manager';
import { canSelect } from './constraints-util';

/**
 * SwimLane modules are used to rendering and interaction.
 */

/** @private */

/**
 * initSwimLane method \
 *
 * @returns {void} initSwimLane method .\
 * @param { GridPanel} grid - provide the grid  value.
 * @param { Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} node - provide the node  value.
 * @private
 */
export function initSwimLane(grid: GridPanel, diagram: Diagram, node: NodeModel): void {
    if (!node.width && (node.shape as SwimLane).phases.length === 0) {
        node.width = 100;
    }
    const row: RowDefinition[] = []; const columns: ColumnDefinition[] = [];
    let index: number = 0; const shape: SwimLaneModel = node.shape as SwimLaneModel;
    const orientation: boolean = shape.orientation === 'Horizontal' ? true : false;
    if (shape.header && (shape as SwimLane).hasHeader) {
        createRow(row, shape.header.height);
    }
    initGridRow(row, orientation, node);
    initGridColumns(columns, orientation, node);
    grid.setDefinitions(row, columns);

    if (shape.header && (shape as SwimLane).hasHeader) {
        headerDefine(grid, diagram, node);
        index++;
    }

    if (shape.phases.length > 0 && shape.phaseSize) {
        for (let k: number = 0; k < shape.phases.length; k++) {
            if (shape.phases[k].id === '') {
                shape.phases[k].id = randomId();
            }
            phaseDefine(grid, diagram, node, index, orientation, k);
        }
        index++;
    }
    if (shape.lanes.length > 0) {
        for (let k: number = 0; k < shape.lanes.length; k++) {
            if (shape.lanes[k].id === '') {
                shape.lanes[k].id = randomId();
            }
            laneCollection(grid, diagram, node, index, k, orientation);
            index++;
        }
    }
}

/**
 * addObjectToGrid method \
 *
 * @returns {Container} addObjectToGrid method .\
 * @param { Diagram} diagram - provide the diagram  value.
 * @param { GridPanel} grid - provide the grid  value.
 * @param {NodeModel} parent - provide the parent  value.
 * @param {NodeModel} object - provide the object  value.
 * @param {boolean} isHeader - provide the isHeader  value.
 * @param {boolean} isPhase - provide the isPhase  value.
 * @param {boolean} isLane - provide the isLane  value.
 * @param {string} canvas - provide the canvas  value.
 * @private
 */
export function addObjectToGrid(
    diagram: Diagram, grid: GridPanel, parent: NodeModel, object: NodeModel,
    isHeader?: boolean, isPhase?: boolean, isLane?: boolean, canvas?: string): Container {

    const node: Node = new Node(diagram, 'nodes', object, true);
    node.parentId = parent.id;
    node.isHeader = (isHeader) ? true : false; node.isPhase = (isPhase) ? true : false;
    node.isLane = (isLane) ? true : false;
    const id: string = (isPhase) ? 'PhaseHeaderParent' : 'LaneHeaderParent';
    if (canvas) { node[id] = canvas; }

    node.constraints &= ~(NodeConstraints.InConnect | NodeConstraints.OutConnect);
    node.constraints |= NodeConstraints.HideThumbs;
    diagram.initObject(node);
    diagram.nodes.push(node);

    if (node.wrapper.children.length > 0) {
        for (let i: number = 0; i < node.wrapper.children.length; i++) {
            const child: DiagramElement = node.wrapper.children[i];
            if (child instanceof DiagramElement) {
                child.isCalculateDesiredSize = false;
            }
            if (child instanceof TextElement) {
                child.canConsiderBounds = false;
                if (!isHeader && ((parent.shape as SwimLaneModel).orientation === 'Vertical' && isPhase) ||
                    ((parent.shape as SwimLaneModel).orientation !== 'Vertical' && isLane)) {
                    child.isLaneOrientation = true;
                    child.refreshTextElement();
                }
            }
        }
        node.wrapper.measure(new Size(undefined, undefined));
        node.wrapper.arrange(node.wrapper.desiredSize);
    }
    return node.wrapper;
}

/**
 * headerDefine method \
 *
 * @returns {void} headerDefine method .\
 * @param { GridPanel} grid - provide the grid  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} object - provide the object  value.
 * @private
 */
export function headerDefine(grid: GridPanel, diagram: Diagram, object: NodeModel): void {
    let maxWidth: number = 0;
    const columns: ColumnDefinition[] = grid.columnDefinitions();
    const shape: SwimLaneModel = object.shape as SwimLaneModel;
    for (let i: number = 0; i < columns.length; i++) {
        maxWidth += columns[i].width;
    }
    shape.header.id = shape.header.id || randomId();
    const node: NodeModel = {
        id: object.id + shape.header.id,
        annotations: [cloneObject(shape.header.annotation)],
        style: shape.header.style ? shape.header.style : undefined,
        offsetX: object.offsetX, offsetY: object.offsetY,
        rowIndex: 0, columnIndex: 0,
        maxWidth: maxWidth,
        container: { type: 'Canvas', orientation: 'Horizontal' }
    } as NodeModel;
    if (!canSelect(object)) {
        node.constraints &= ~NodeConstraints.Select;
    }
    const wrapper: Container = addObjectToGrid(diagram, grid, object, node, true);
    grid.addObject(wrapper, 0, 0, 1, grid.columnDefinitions().length);
}

/**
 * phaseDefine method \
 *
 * @returns {void} phaseDefine method .\
 * @param { GridPanel} grid - provide the grid  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} object - provide the object  value.
 * @param {number} indexValue - provide the indexValue  value.
 * @param {boolean} orientation - provide the orientation  value.
 * @param {number} phaseIndex - provide the phaseIndex  value.
 * @private
 */
export function phaseDefine(
    grid: GridPanel, diagram: Diagram, object: NodeModel, indexValue: number, orientation: boolean, phaseIndex: number): void {
    let rowValue: number = 0; let colValue: number = 0; let maxWidth: number;
    const shape: SwimLaneModel = object.shape as SwimLaneModel;
    if (orientation) {
        colValue = phaseIndex; rowValue = indexValue;
        maxWidth = grid.columnDefinitions()[phaseIndex].width;
    } else {
        rowValue = shape.header && (shape as SwimLane).hasHeader ? phaseIndex + 1 : phaseIndex;
    }
    const phaseObject: NodeModel = {
        annotations: [cloneObject(shape.phases[phaseIndex].header.annotation)],
        maxWidth: maxWidth,
        id: object.id + shape.phases[phaseIndex].id + '_header',
        addInfo:shape.phases[phaseIndex].addInfo,
        offsetX: object.offsetX, offsetY: object.offsetY,
        style: shape.phases[phaseIndex].style,
        rowIndex: rowValue, columnIndex: colValue,
        container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
    };
    phaseObject.annotations[0].rotateAngle = orientation ? 0 : 270;
    if (!canSelect(object)) {
        phaseObject.constraints &= ~NodeConstraints.Select;
    }
    shape.phases[phaseIndex].header.id = phaseObject.id;
    const wrapper: Container = addObjectToGrid(
        diagram, grid, object, phaseObject, false, true, false, shape.phases[phaseIndex].id);
    grid.addObject(wrapper, rowValue, colValue);
}

/**
 * laneCollection method \
 *
 * @returns {void} laneCollection method .\
 * @param { GridPanel} grid - provide the grid  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} object - provide the object  value.
 * @param {number} indexValue - provide the indexValue  value.
 * @param {number} laneIndex - provide the laneIndex  value.
 * @param {boolean} orientation - provide the orientation  value.
 * @private
 */
export function laneCollection(
    grid: GridPanel, diagram: Diagram, object: NodeModel, indexValue: number, laneIndex: number, orientation: boolean): void {
    let laneNode: NodeModel; let parentWrapper: Container; let gridCell: GridCell; let canvas: NodeModel; let childWrapper: Container;
    const shape: SwimLaneModel = object.shape as SwimLaneModel;
    const value: number = shape.phases.length || 1;
    const isHeader: number = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
    let rowValue: number = orientation ? indexValue : isHeader;
    const phaseCount: number = (shape.phaseSize && shape.phases.length > 0) ? 1 : 0;
    for (let l: number = 0; l < value; l++) {
        let colValue: number = orientation ? l : laneIndex + phaseCount;
        gridCell = grid.rows[rowValue].cells[colValue];
        canvas = {
            id: object.id + shape.lanes[laneIndex].id + l,
            rowIndex: rowValue, columnIndex: colValue,
            width: gridCell.minWidth, height: gridCell.minHeight,
            offsetX: object.offsetX, offsetY: object.offsetY,
            style: shape.lanes[laneIndex].style,
            addInfo:shape.lanes[laneIndex].addInfo,
            constraints: NodeConstraints.Default | NodeConstraints.ReadOnly | NodeConstraints.AllowDrop,
            container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
        };
        if (!canSelect(object)) {
            canvas.constraints &= ~NodeConstraints.Select;
        }
        parentWrapper = addObjectToGrid(diagram, grid, object, canvas, false, false, true);
        parentWrapper.children[0].isCalculateDesiredSize = false;
        if (l === 0) {
            laneNode = {
                id: object.id + shape.lanes[laneIndex].id + '_' + l + '_header',
                style: shape.lanes[laneIndex].header.style,
                annotations: [cloneObject(shape.lanes[laneIndex].header.annotation)],
                offsetX: object.offsetX, offsetY: object.offsetY,
                rowIndex: rowValue, columnIndex: colValue,
                container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
            };
            laneNode.annotations[0].rotateAngle = orientation ? 270 : 0;
            shape.lanes[laneIndex].header.id = laneNode.id;
            // eslint-disable-next-line
            (orientation) ? laneNode.width = shape.lanes[laneIndex].header.width :
                laneNode.height = shape.lanes[laneIndex].header.height;
            if (!canSelect(object)) {
                laneNode.constraints &= ~NodeConstraints.Select;
            }
            childWrapper = addObjectToGrid(
                diagram, grid, object, laneNode, false, false, true, shape.lanes[laneIndex].id);
            if (orientation) {
                childWrapper.children[0].elementActions = childWrapper.children[0].elementActions | ElementAction.HorizontalLaneHeader;
            }
            parentWrapper.children.push(childWrapper);
        }
        grid.addObject(parentWrapper, rowValue, colValue);
        if (!orientation) { rowValue++; }
        colValue = orientation ? l : laneIndex + 1;
    }
}

/**
 * createRow method \
 *
 * @returns {void} createRow method .\
 * @param { RowDefinition[]} row - provide the row  value.
 * @param {number} height - provide the height  value.
 * @private
 */
export function createRow(row: RowDefinition[], height: number): void {
    const rows: RowDefinition = new RowDefinition();
    rows.height = height;
    row.push(rows);
}

/**
 * createColumn method \
 *
 * @returns {void} createColumn method .\
 * @param {number} width - provide the width  value.
 * @private
 */
export function createColumn(width: number): ColumnDefinition {
    const cols: ColumnDefinition = new ColumnDefinition();
    cols.width = width;
    return cols;
}

/**
 * initGridRow method \
 *
 * @returns {void} initGridRow method .\
 * @param {RowDefinition[]} row - provide the row  value.
 * @param {boolean} orientation - provide the row  value.
 * @param {NodeModel} object - provide the row  value.
 * @private
 */
export function initGridRow(row: RowDefinition[], orientation: boolean, object: NodeModel): void {
    let totalHeight: number = 0; let height: number;
    const shape: SwimLaneModel = object.shape as SwimLaneModel;
    if (row.length > 0) {
        for (let i: number = 0; i < row.length; i++) {
            totalHeight += row[i].height;
        }
    }
    if (orientation) {
        if (shape.phases.length > 0 && shape.phaseSize) {
            totalHeight += shape.phaseSize;
            createRow(row, shape.phaseSize);
        }
        if (shape.lanes.length > 0) {
            for (let i: number = 0; i < shape.lanes.length; i++) {
                height = shape.lanes[i].height; totalHeight += height;
                if (i === shape.lanes.length - 1 && totalHeight < object.height) {
                    height += object.height - totalHeight;
                }
                createRow(row, height);
            }
        }
    } else {
        if (shape.phases.length > 0) {
            let phaseHeight: number = 0;
            for (let i: number = 0; i < shape.phases.length; i++) {
                let phaseOffset: number = shape.phases[i].offset;
                if (i === 0) {
                    phaseHeight += phaseOffset;
                } else {
                    phaseOffset -= phaseHeight;
                    phaseHeight += phaseOffset;
                }
                height = phaseOffset; totalHeight += height;
                if (i === shape.phases.length - 1 && totalHeight < object.height) {
                    height += object.height - totalHeight;
                }
                createRow(row, height);
            }
        } else {
            createRow(row, object.height);
        }
    }
}

/**
 * initGridColumns method \
 *
 * @returns {void} initGridRow method .\
 * @param {ColumnDefinition[]} columns - provide the row  value.
 * @param {boolean} orientation - provide the row  value.
 * @param {NodeModel} object - provide the row  value.
 * @private
 */
export function initGridColumns(columns: ColumnDefinition[], orientation: boolean, object: NodeModel): void {
    let totalWidth: number = 0; const shape: SwimLaneModel = object.shape as SwimLaneModel;
    let phaseOffset: number; let cols: ColumnDefinition;
    let k: number; let j: number; let value: number;
    if (shape.phases.length > 0 && shape.orientation === 'Horizontal') {
        for (j = 0; j < shape.phases.length; j++) {
            phaseOffset = shape.phases[j].offset;
            if (j === 0) {
                totalWidth += phaseOffset;
            } else {
                phaseOffset -= totalWidth;
                totalWidth += phaseOffset;
            }
            cols = createColumn(phaseOffset);
            if (j === shape.phases.length - 1 && totalWidth < object.width) {
                cols.width += object.width - totalWidth;
            }
            columns.push(cols);
        }
    } else if (!orientation) {
        value = (shape.phaseSize && shape.phases.length > 0) ? shape.lanes.length
            + 1 : shape.lanes.length;
        if (shape.phaseSize && shape.phases.length > 0) {
            totalWidth += shape.phaseSize;
            cols = createColumn(shape.phaseSize);
            columns.push(cols);
        }
        for (k = 0; k < shape.lanes.length; k++) {
            totalWidth += shape.lanes[k].width;
            cols = createColumn(shape.lanes[k].width);
            if (k === shape.lanes.length - 1 && totalWidth < object.width) {
                cols.width += object.width - totalWidth;
            }
            columns.push(cols);
        }
        if ((shape.phases.length === 0 && shape.lanes.length === 0)) {
            cols = createColumn(object.width);
            columns.push(cols);
        }
    } else {
        cols = createColumn(object.width);
        columns.push(cols);
    }
}

/**
 * getConnectors method \
 *
 * @returns {void} getConnectors method .\
 * @param {Diagram} diagram - provide the row  value.
 * @param {GridPanel} grid - provide the row  value.
 * @param {number} rowIndex - provide the row  value.
 * @param {boolean} isRowUpdate - provide the row  value.
 * @private
 */
export function getConnectors(diagram: Diagram, grid: GridPanel, rowIndex: number, isRowUpdate: boolean): string[] {
    const connectors: string[] = []; let conn: number = 0; let childNode: Container; let node: Node;
    let k: number; let i: number; let j: number; let canvas: Container; let row: GridRow;
    const length: number = grid.rowDefinitions().length; let edges: string[];
    for (let i: number = 0; i < length; i++) {
        row = grid.rows[i];
        for (j = 0; j < row.cells.length; j++) {
            canvas = row.cells[j].children[0] as Container;
            if (canvas && canvas.children && canvas.children.length) {
                for (k = 1; k < canvas.children.length; k++) {
                    childNode = canvas.children[k] as Container;
                    node = diagram.getObject(childNode.id) as Node;
                    if (node && ((node as Node).inEdges.length > 0 || (node as Node).outEdges.length > 0)) {
                        edges = (node as Node).inEdges.concat((node as Node).outEdges);
                        for (conn = 0; conn < edges.length; conn++) {
                            if (connectors.indexOf(edges[conn]) === -1) {
                                connectors.push(edges[conn]);
                            }
                        }
                    }
                }
            }
        }
    }
    return connectors;
}

/**
 * swimLaneMeasureAndArrange method \
 *
 * @returns {void} swimLaneMeasureAndArrange method .\
 * @param {NodeModel} obj - provide the row  value.
 * @private
 */
export function swimLaneMeasureAndArrange(obj: NodeModel): void {
    const canvas: Container = obj.wrapper;
    canvas.measure(new Size(obj.width, obj.height));
    if (canvas.children[0] instanceof GridPanel) {
        const grid: GridPanel = canvas.children[0] as GridPanel; let isMeasure: boolean = false;
        if (grid.width && grid.width < grid.desiredSize.width) {
            isMeasure = true; grid.width = grid.desiredSize.width;
        }
        if (grid.height && grid.height < grid.desiredSize.height) {
            isMeasure = true; grid.height = grid.desiredSize.height;
        }
        if (isMeasure) { grid.measure(new Size(grid.width, grid.height)); }
    }
    canvas.arrange(canvas.desiredSize);
}
/**
 * ChangeLaneIndex method \
 *
 * @returns {void} ChangeLaneIndex method .\
 * @param {Diagram} diagram - provide the row  value.
 * @param {NodeModel} obj - provide the row  value.
 * @param {number} startRowIndex - provide the row  value.
 * @private
 */
export function ChangeLaneIndex(diagram: Diagram, obj: NodeModel, startRowIndex: number): void {

    const container: GridPanel = obj.wrapper.children[0] as GridPanel;
    let i: number; let j: number; let k: number; let object: Node; let subChild: Node;
    let row: GridRow; let cell: GridCell; let child: Canvas;

    for (i = startRowIndex; i < container.rows.length; i++) {
        row = container.rows[i];
        for (j = 0; j < row.cells.length; j++) {
            cell = row.cells[j];
            if (cell.children && cell.children.length > 0) {
                for (k = 0; k < cell.children.length; k++) {
                    child = cell.children[k] as Canvas;
                    object = diagram.nameTable[child.id] as Node;
                    if (object.isLane && child.children.length > 1) {
                        subChild = diagram.nameTable[child.children[1].id] as Node;
                        if (subChild && subChild.isLane) {
                            subChild.rowIndex = i; subChild.columnIndex = j;
                        }
                    }
                    object.rowIndex = i; object.columnIndex = j;
                }
            }
        }
    }
}
/**
 * arrangeChildNodesInSwimLane method \
 *
 * @returns {void} arrangeChildNodesInSwimLane method .\
 * @param {Diagram} diagram - provide the row  value.
 * @param {NodeModel} obj - provide the row  value.
 * @private
 */
export function arrangeChildNodesInSwimLane(diagram: Diagram, obj: NodeModel): void {
    const grid: GridPanel = obj.wrapper.children[0] as GridPanel;
    const shape: SwimLaneModel = obj.shape as SwimLaneModel;
    const padding: number = (shape as SwimLane).padding;
    const lanes: LaneModel[] = shape.lanes; let top: number = grid.bounds.y;
    let rowvalue: number; let columnValue: number;
    const phaseCount: number = (shape.phaseSize > 0) ? shape.phases.length : 0;
    let node: NodeModel; let canvas: Container; let cell: GridCell;
    let i: number; let j: number; let k: number;
    const orientation: boolean = shape.orientation === 'Horizontal' ? true : false;
    const col: number = orientation ? shape.phases.length || 1 : lanes.length + 1;
    let row: number = orientation ? ((shape.header && (shape as SwimLane).hasHeader) ? 1 : 0) +
        (shape.phases.length > 0 ? 1 : 0) + (shape.lanes.length)
        : (shape.header && (shape as SwimLane).hasHeader ? 1 : 0) + shape.phases.length;
    if (phaseCount === 0 && !orientation && shape.lanes.length) {
        row += 1;
    }
    if (orientation) {
        rowvalue = (shape.header && (shape as SwimLane).hasHeader ? 1 : 0) + (phaseCount > 0 ? 1 : 0);
        columnValue = 0;
    } else {
        rowvalue = (shape.header && (shape as SwimLane).hasHeader ? 1 : 0);
        columnValue = phaseCount > 0 ? 1 : 0;
    }
    if (lanes.length > 0) {
        top += (shape.header && (shape as SwimLane).hasHeader) ? shape.header.height : 0;
        for (i = 0; i < lanes.length; i++) {
            for (j = 0; j < lanes[i].children.length; j++) {
                node = lanes[i].children[j];
                node.offsetX = lanes[i].width;
                node.offsetY = lanes[i].height;
                diagram.initObject(node as Node);
                diagram.nodes.push(node);
                canvas = node.wrapper;
                if (orientation) {
                    for (k = columnValue; k < col; k++) {
                        cell = grid.rows[rowvalue].cells[k];
                        if (canvas.margin.left < (cell.bounds.right - grid.bounds.x)) {
                            (node as Node).parentId = cell.children[0].id;
                            if (k > columnValue) {
                                canvas.margin.left = canvas.margin.left - (cell.bounds.left - grid.bounds.left);
                            } else {
                                if (((cell.children[0] as Canvas).children[1].actualSize.width + padding) >= canvas.margin.left) {
                                    canvas.margin.left = (cell.children[0] as Canvas).children[1].actualSize.width + padding;
                                }
                            }
                            if (canvas.margin.left < padding) { canvas.margin.left = padding; }
                            if (canvas.margin.top < padding) { canvas.margin.top = padding; }
                            addChildToLane(canvas, node, diagram);
                            break;

                        }
                    }
                } else {
                    for (let k: number = rowvalue; k < row; k++) {
                        cell = grid.rows[k].cells[columnValue];
                        if (canvas.margin.top < (cell.bounds.bottom - top)) {
                            (node as Node).parentId = cell.children[0].id;
                            if (k > rowvalue) {
                                canvas.margin.top = canvas.margin.top - (cell.bounds.top - top);
                            } else {
                                if (((cell.children[0] as Canvas).children[1].actualSize.height + padding) >= canvas.margin.top) {
                                    canvas.margin.top = (cell.children[0] as Canvas).children[1].actualSize.height + padding;
                                }
                            }
                            if (canvas.margin.left < padding) { canvas.margin.left = padding; }
                            if (canvas.margin.top < padding) { canvas.margin.top = padding; }
                            addChildToLane(canvas, node, diagram);
                            break;
                        }
                    }
                }
            }
            // eslint-disable-next-line
            orientation ? rowvalue++ : columnValue++;
        }
    }
    grid.measure(new Size(obj.width, obj.height)); grid.arrange(grid.desiredSize);
    updateChildOuterBounds(grid, obj);
    obj.width = obj.wrapper.width = grid.width;
    obj.height = obj.wrapper.height = grid.height;
    updateHeaderMaxWidth(diagram, obj);
    obj.wrapper.measure(new Size(obj.width, obj.height));
    obj.wrapper.arrange(grid.desiredSize);
    checkLaneChildrenOffset(obj);
    checkPhaseOffset(obj, diagram);
    checkLaneSize(obj);
}

/**
 * addChildToLane method \
 *
 * @returns {void} addChildToLane method .\
 * @param {Container} canvas - provide the row  value.
 * @param {NodeModel} node - provide the row  value.
 * @param {Diagram} diagram - provide the row  value.
 * @private
 */
function addChildToLane(canvas: Container, node: NodeModel, diagram: Diagram): void {
    canvas.measure(new Size(node.width, node.height));
    canvas.arrange(canvas.desiredSize);
    const parent: NodeModel = diagram.getObject((node as Node).parentId);
    diagram.addChild(parent, node.id);
}
/**
 * updateChildOuterBounds method \
 *
 * @returns {void} updateChildOuterBounds method .\
 * @param {GridPanel} grid - provide the row  value.
 * @param {NodeModel} obj - provide the row  value.
 * @private
 */
export function updateChildOuterBounds(grid: GridPanel, obj: NodeModel): void {

    const columnDefinitions: ColumnDefinition[] = grid.columnDefinitions();
    const rowDefinitions: RowDefinition[] = grid.rowDefinitions();
    let i: number; let k: number; let j: number; let cell: GridCell; let child: Canvas; let row: GridRow;
    let rowIndex: number = findStartLaneIndex(obj);
    if ((obj.shape as SwimLaneModel).orientation === 'Vertical') {
        if (rowIndex === 0) {
            rowIndex = ((obj.shape as SwimLaneModel).header && (obj.shape as SwimLane).hasHeader) ? 1 : 0;
        }
    }
    const padding: number = (obj.shape as SwimLane).padding;

    for (i = 0; i < columnDefinitions.length; i++) {
        grid.updateColumnWidth(i, columnDefinitions[i].width, true, padding);
    }

    for (i = rowIndex; i < rowDefinitions.length; i++) {
        grid.updateRowHeight(i, rowDefinitions[i].height, true, padding);
    }
    for (k = 0; k < rowDefinitions.length; k++) {
        row = grid.rows[k];
        for (i = 0; i < columnDefinitions.length; i++) {
            cell = row.cells[i];
            if (cell.children && cell.children.length > 0) {
                for (j = 0; j < cell.children.length; j++) {
                    child = cell.children[j] as Canvas;
                    if (child.maxWidth) {
                        child.maxWidth = cell.actualSize.width;
                    }
                    if (child.maxHeight) {
                        child.maxHeight = cell.actualSize.height;
                    }
                }
            }
        }
    }
}
/**
 * checkLaneSize method \
 *
 * @returns {void} checkLaneSize method .\
 * @param {NodeModel} obj - provide the row  value.
 * @private
 */
export function checkLaneSize(obj: NodeModel): void {

    if (obj.shape.type === 'SwimLane' && !(obj.shape as SwimLaneModel).isLane && !(obj.shape as SwimLaneModel).isPhase) {

        let lane: LaneModel; let i: number; let columns: ColumnDefinition[];
        let size: number; //let laneCount: number = 0;
        const lanes: LaneModel[] = (obj.shape as SwimLaneModel).lanes;
        let laneIndex: number = findStartLaneIndex(obj);
        const rows: RowDefinition[] = (obj.wrapper.children[0] as GridPanel).rowDefinitions();

        for (i = 0; i < lanes.length; i++, laneIndex++) {
            lane = lanes[i];
            if ((obj.shape as SwimLaneModel).orientation === 'Horizontal') {
                size = rows[laneIndex].height;
                if (lane.height !== size) {
                    lane.height = size;
                }
            } else {
                columns = (obj.wrapper.children[0] as GridPanel).columnDefinitions();
                size = columns[laneIndex].width;
                if (lane.width !== size) {
                    lane.width = size;
                }
            }
        }
    }
}
/**
 * checkPhaseOffset method \
 *
 * @returns {void} checkPhaseOffset method .\
 * @param {NodeModel} obj - provide the obj  value.
 * @param {Diagram} diagram - provide the obj  value.
 * @private
 */
export function checkPhaseOffset(obj: NodeModel, diagram: Diagram): void {

    const shape: SwimLaneModel = obj.shape as SwimLaneModel;
    const phases: PhaseModel[] = shape.phases; let i: number; let offset: number;
    let phaseRow: GridRow; let phase: Canvas;
    const gridRowIndex: number = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
    let grid: GridPanel = obj.wrapper.children[0] as GridPanel;
    const top: number = grid.bounds.y + ((shape.header && (shape as SwimLane).hasHeader) ? shape.header.height : 0);

    if (obj.shape.type === 'SwimLane') {
        obj = diagram.getObject(obj.id) || obj;
        if (phases.length > 0) {
            grid = obj.wrapper.children[0] as GridPanel;
            if (shape.orientation === 'Horizontal') {
                phaseRow = (shape.header && (shape as SwimLane).hasHeader) ? grid.rows[1] : grid.rows[0];
                for (i = 0; i < phases.length; i++) {
                    phase = phaseRow.cells[i].children[0] as Canvas;
                    offset = phase.bounds.right - grid.bounds.x;
                    if (phases[i].offset !== offset) {
                        phases[i].offset = offset;
                    }
                    (diagram.nameTable[phase.id] as NodeModel).maxWidth = phase.maxWidth;
                }
            } else {
                for (i = 0; i < phases.length; i++) {
                    phase = grid.rows[gridRowIndex + i].cells[0].children[0] as Canvas;
                    offset = phase.bounds.bottom - top;
                    if (phases[i].offset !== offset) {
                        phases[i].offset = offset;
                    }
                    (diagram.nameTable[phase.id] as NodeModel).maxWidth = phase.maxWidth;
                }
            }
        }
    }
}
/**
 * updateConnectorsProperties method \
 *
 * @returns {void} checkPhaseOffset method .\
 * @param {string[]} connectors - provide the obj  value.
 * @param {Diagram} diagram - provide the obj  value.
 * @private
 */
export function updateConnectorsProperties(connectors: string[], diagram: Diagram): void {
    if (connectors && connectors.length > 0) {
        let edges: Connector;
        if (diagram.lineRoutingModule && (diagram.constraints & DiagramConstraints.LineRouting)) {
            diagram.lineRoutingModule.renderVirtualRegion(diagram, true);
        }
        for (let i: number = 0; i < connectors.length; i++) {
            edges = diagram.getObject(connectors[i]) as Connector;
            if (diagram.lineRoutingModule && (diagram.constraints & DiagramConstraints.LineRouting) && edges.type === 'Orthogonal') {
                diagram.lineRoutingModule.refreshConnectorSegments(diagram, edges, true);
            } else {
                diagram.connectorPropertyChange(edges, {} as Connector, {
                    sourceID: edges.sourceID, targetID: edges.targetID
                } as Connector);
            }
        }
    }
}
/**
 * laneInterChanged method \
 *
 * @returns {void} laneInterChanged method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} obj - provide the obj  value.
 * @param {NodeModel} target - provide the target  value.
 * @param {PointModel} position - provide the position  value.
 * @private
 */
export function laneInterChanged(diagram: Diagram, obj: NodeModel, target: NodeModel, position?: PointModel): void {

    let index: number; let undoElement: StackEntryObject; let entry: HistoryEntry; let redoElement: StackEntryObject;
    let sourceIndex: number; let targetIndex: number; let temp: LaneModel;
    let sourceLaneIndex: number; let targetLaneIndex: number; let rowIndex: number;

    const swimLane: NodeModel = ((diagram.getObject((obj as Node).parentId) as NodeModel));
    const shape: SwimLaneModel = swimLane.shape as SwimLaneModel;
    const grid: GridPanel = swimLane.wrapper.children[0] as GridPanel;
    const lanes: LaneModel[] = shape.lanes;
    const connectors: string[] = getConnectors(diagram, grid, obj.rowIndex, true);
    if ((shape.orientation === 'Horizontal' && obj.rowIndex !== target.rowIndex) ||
        (shape.orientation === 'Vertical' && obj.columnIndex !== target.columnIndex)) {
        if (shape.orientation === 'Horizontal') {
            sourceIndex = obj.rowIndex; targetIndex = (target as Node).rowIndex;
            index = ((shape.header && (shape as SwimLane).hasHeader) ? 1 : 0) + (shape.phases.length && shape.phaseSize ? 1 : 0);
            sourceLaneIndex = obj.rowIndex - index;
            targetLaneIndex = (target as Node).rowIndex - index;
            if (lanes[sourceLaneIndex].canMove) {
                if (sourceLaneIndex < targetLaneIndex) {
                    if (position && target.wrapper.offsetY > position.y) {
                        targetIndex += (targetLaneIndex > 0) ? -1 : 1;
                        targetLaneIndex += (targetLaneIndex > 0) ? -1 : 1;
                    }
                } else {
                    if (position && target.wrapper.offsetY < position.y) {
                        targetIndex += 1; targetLaneIndex += 1;
                    }
                }
                if (sourceIndex !== targetIndex) {
                    grid.updateRowIndex(sourceIndex, targetIndex);
                }
            }

        } else {
            sourceIndex = obj.columnIndex;
            targetIndex = target.columnIndex;
            index = (shape.phases.length && shape.phaseSize) ? 1 : 0;
            sourceLaneIndex = obj.columnIndex - index;
            targetLaneIndex = (target as Node).columnIndex - index;
            rowIndex = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
            if (lanes[sourceLaneIndex].canMove) {
                if (sourceLaneIndex < targetLaneIndex) {
                    if (position && target.wrapper.offsetX > position.x) {
                        targetIndex += (targetLaneIndex > 0) ? -1 : 1;
                        targetLaneIndex += (targetLaneIndex > 0) ? -1 : 1;
                    }
                } else {
                    if (position && target.wrapper.offsetX < position.x) {
                        targetIndex += 1; targetLaneIndex += 1;
                    }
                }
                if (sourceIndex !== targetIndex) {
                    if ((shape.phaseSize === 0 || shape.phases.length === 0) && (targetIndex === 0 || sourceIndex === 0)) {
                        if (shape.header && (shape as SwimLane).hasHeader) {
                            const changeHeaderIndex: number = (targetIndex === 0) ? sourceIndex : targetIndex;
                            grid.rows[0].cells[changeHeaderIndex].children = grid.rows[0].cells[0].children;
                            grid.rows[0].cells[changeHeaderIndex].columnSpan = grid.rows[0].cells[0].columnSpan;
                            grid.rows[0].cells[0].children = [];
                        }
                    }
                    grid.updateColumnIndex(0, sourceIndex, targetIndex);
                }
            }
        }
        if (sourceIndex !== targetIndex) {
            temp = lanes[sourceLaneIndex];
            if (temp.canMove) {

                undoElement = {
                    target: cloneObject(target), source: cloneObject(obj)
                };
                temp = lanes[sourceLaneIndex];
                lanes.splice(sourceLaneIndex, 1);
                lanes.splice(targetLaneIndex, 0, temp);
                redoElement = {
                    target: cloneObject(undoElement.source), source: cloneObject(undoElement.target)
                };
                entry = {
                    type: 'LanePositionChanged', redoObject: redoElement as NodeModel,
                    undoObject: undoElement as NodeModel, category: 'Internal'
                };
                if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                    diagram.commandHandler.addHistoryEntry(entry);
                }
                ChangeLaneIndex(diagram, swimLane, 0);
                updateConnectorsProperties(connectors, diagram);
                updateSwimLaneChildPosition(lanes as Lane[], diagram);
                swimLane.wrapper.measure(new Size(swimLane.width, swimLane.height));
                swimLane.wrapper.arrange(swimLane.wrapper.desiredSize);
                diagram.updateDiagramObject(swimLane);
            }
        }
    }
    diagram.updateDiagramElementQuad();
}
/**
 * updateSwimLaneObject method \
 *
 * @returns {void} updateSwimLaneObject method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {Node} obj - provide the obj  value.
 * @param {NodeModel} swimLane - provide the target  value.
 * @param {NodeModel} helperObject - provide the position  value.
 * @private
 */
export function updateSwimLaneObject(diagram: Diagram, obj: Node, swimLane: NodeModel, helperObject: NodeModel): void {
    const parentNode: NodeModel = diagram.getObject(swimLane.id);
    const shape: SwimLaneModel = parentNode.shape as SwimLaneModel;
    let index: number = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
    const lanes: LaneModel[] = shape.lanes;
    const phases: PhaseModel[] = shape.phases;
    const helperWidth: number = helperObject.wrapper.actualSize.width;
    const helperHeight: number = helperObject.wrapper.actualSize.height;
    const objWidth: number = obj.wrapper.actualSize.width;
    const objHeight: number = obj.wrapper.actualSize.height;
    if (parentNode.shape.type === 'SwimLane') {
        if (shape.orientation === 'Horizontal') {
            if (obj.isPhase) {
                phases[obj.columnIndex].offset += (helperWidth - objWidth);
            } else {
                index = (shape.phaseSize && shape.phases.length > 0) ? index + 1 : index;
                lanes[(obj.rowIndex - index)].height += (helperHeight - objHeight);
            }
        } else {
            if (obj.isPhase) {
                phases[(obj.rowIndex - index)].offset += (helperHeight - objHeight);
            } else {
                index = (shape.phaseSize && shape.phases.length > 0) ? 1 : 0;
                lanes[(obj.columnIndex - index)].width += (helperWidth - objWidth);
            }
        }
    }
}

/**
 * findLaneIndex method \
 *
 * @returns {number} findLaneIndex method .\
 * @param {NodeModel} swimLane - provide the diagram  value.
 * @param {NodeModel} laneObj - provide the obj  value.
 * @private
 */
export function findLaneIndex(swimLane: NodeModel, laneObj: NodeModel): number {

    let laneIndex: number; const shape: SwimLaneModel = swimLane.shape as SwimLaneModel;
    let index: number = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
    if (shape.orientation === 'Horizontal') {
        index += shape.phases.length > 0 ? 1 : 0;
        laneIndex = laneObj.rowIndex - index;
    } else {
        laneIndex = laneObj.columnIndex - (shape.phaseSize && shape.phases.length > 0 ? 1 : 0);
    }
    return laneIndex;
}

/**
 * findPhaseIndex method \
 *
 * @returns {number} findPhaseIndex method .\
 * @param {NodeModel} phase - provide the diagram  value.
 * @param {NodeModel} swimLane - provide the obj  value.
 * @private
 */
export function findPhaseIndex(phase: NodeModel, swimLane: NodeModel): number {
    const shape: SwimLaneModel = swimLane.shape as SwimLaneModel;
    const index: number = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
    const phaseIndex: number = (shape.orientation === 'Horizontal') ? phase.columnIndex : phase.rowIndex - index;
    return phaseIndex;
}

/**
 * findStartLaneIndex method \
 *
 * @returns {number} findStartLaneIndex method .\
 * @param {NodeModel} swimLane - provide the obj  value.
 * @private
 */
export function findStartLaneIndex(swimLane: NodeModel): number {
    let index: number = 0; const shape: SwimLaneModel = swimLane.shape as SwimLaneModel;
    if (shape.orientation === 'Horizontal') {
        index = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
    }
    if (shape.phases.length > 0 && shape.phaseSize) {
        index += 1;
    }
    return index;
}

/**
 * updatePhaseMaxWidth method \
 *
 * @returns {void} updatePhaseMaxWidth method .\
 * @param {NodeModel} parent - provide the obj  value.
 * @param {Diagram} diagram - provide the obj  value.
 * @param {Canvas} wrapper - provide the obj  value.
 * @param {number} columnIndex - provide the obj  value.
 * @private
 */
export function updatePhaseMaxWidth(parent: NodeModel, diagram: Diagram, wrapper: Canvas, columnIndex: number): void {
    const shape: SwimLaneModel = parent.shape as SwimLaneModel;
    if (shape.phases.length > 0) {
        const node: Node = diagram.nameTable[shape.phases[columnIndex].header.id];
        if (node && node.maxWidth < wrapper.outerBounds.width) {
            node.maxWidth = wrapper.outerBounds.width;
            node.wrapper.maxWidth = wrapper.outerBounds.width;
        }
    }
}

/**
 * updateHeaderMaxWidth method \
 *
 * @returns {void} updateHeaderMaxWidth method .\
 * @param {NodeModel} diagram - provide the obj  value.
 * @param {NodeModel} swimLane - provide the obj  value.
 * @private
 */
export function updateHeaderMaxWidth(diagram: Diagram, swimLane: NodeModel): void {
    if ((swimLane.shape as SwimLaneModel).header && (swimLane.shape as SwimLane).hasHeader) {
        const grid: GridPanel = swimLane.wrapper.children[0] as GridPanel;
        const id: string = grid.rows[0].cells[0].children[0].id;
        const headerNode: Node = diagram.nameTable[id];
        if (headerNode && headerNode.isHeader && headerNode.maxWidth < swimLane.width) {
            headerNode.maxWidth = swimLane.width;
            headerNode.wrapper.maxWidth = swimLane.width;
        }
    }
}

/**
 * addLane method \
 *
 * @returns {void} addLane method .\
 * @param {Diagram} diagram - provide the obj  value.
 * @param {NodeModel} parent - provide the obj  value.
 * @param {LaneModel} lane - provide the obj  value.
 * @param {number} count - provide the obj  value.
 * @private
 */
export function addLane(diagram: Diagram, parent: NodeModel, lane: LaneModel, count?: number): void {
    let args: ICollectionChangeEventArgs;
    const swimLane: NodeModel = diagram.nameTable[parent.id];
    if (swimLane.shape.type === 'SwimLane') {
        diagram.protectPropertyChange(true);
        const grid: GridPanel = swimLane.wrapper.children[0] as GridPanel; const bounds: Rect = grid.bounds;
        const shape: SwimLaneModel = swimLane.shape as SwimLaneModel; let redoObj: NodeModel;
        let orientation: boolean = false; let entry: HistoryEntry;
        let index: number; let children: NodeModel[];
        let j: number; let i: number; let k: number; let cell: GridCell; let child: NodeModel; let point: PointModel;
        const laneObj: LaneModel = new Lane(shape as Shape, 'lanes', lane, true);
        index = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
        if (shape.orientation === 'Horizontal') {
            orientation = true;
            index = shape.phases.length > 0 ? index + 1 : index;
        }
        const connectors: string[] = getConnectors(diagram, grid, 0, true);
        const laneIndex: number = (count !== undefined) ? count : shape.lanes.length;
        index += laneIndex;
        args = {
            element: laneObj, cause: diagram.diagramActions, state: 'Changing', type: 'Addition', cancel: false, laneIndex: laneIndex
        };
        diagram.triggerEvent(DiagramEvent.collectionChange, args);
        if (!args.cancel) {
            if (orientation) {
                const rowDef: RowDefinition = new RowDefinition();
                rowDef.height = lane.height;
                grid.addRow(index, rowDef, false);
                swimLane.height = (swimLane.height !== undefined) ? swimLane.height + lane.height : swimLane.height;
                swimLane.wrapper.height = grid.height = swimLane.height;
            } else {
                const colDef: ColumnDefinition = new ColumnDefinition();
                colDef.width = lane.width;
                grid.addColumn(laneIndex + 1, colDef, false);
                if (swimLane.width) {
                    swimLane.width += lane.width;
                    swimLane.wrapper.width = grid.width = swimLane.width;
                }
                if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                    grid.rows[0].cells[0].columnSpan += 1;
                }
            }
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                laneObj.id = (laneObj.id === '') ? randomId() : laneObj.id;
            }
            if (count !== undefined) {
                shape.lanes.splice(count, 0, laneObj);
            } else {
                shape.lanes.push(laneObj);
            }
            args = {
                element: laneObj, cause: diagram.diagramActions, state: 'Changed', type: 'Addition', cancel: false, laneIndex: laneIndex
            };
            diagram.triggerEvent(DiagramEvent.collectionChange, args);
            laneCollection(grid, diagram, swimLane, index, laneIndex, orientation);
            redoObj = (shape.orientation === 'Horizontal') ?
                diagram.nameTable[grid.rows[index].cells[0].children[0].id] :
                ((shape.header && (shape as SwimLane).hasHeader) ? diagram.nameTable[grid.rows[1].cells[index].children[0].id] :
                    diagram.nameTable[grid.rows[0].cells[index].children[0].id]);
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                entry = {
                    type: 'LaneCollectionChanged', changeType: 'Insert', undoObject: cloneObject(laneObj),
                    redoObject: cloneObject(redoObj), category: 'Internal'
                };
                diagram.addHistoryEntry(entry);
            }
            const startRowIndex: number = (shape.orientation === 'Horizontal') ?
                index : ((shape.header && (shape as SwimLane).hasHeader) ? 1 : 0);
            ChangeLaneIndex(diagram, swimLane, startRowIndex);
            swimLaneMeasureAndArrange(swimLane);
            updateHeaderMaxWidth(diagram, swimLane);
            children = lane.children;
            if (children && children.length > 0) {
                for (j = 0; j < children.length; j++) {
                    child = children[j];
                    point = { x: child.wrapper.offsetX, y: child.wrapper.offsetY };

                    if (shape.orientation === 'Horizontal') {
                        cell = grid.rows[index].cells[i];
                        for (i = 0; i < grid.rows[index].cells.length; i++) {
                            addChildNodeToNewLane(diagram, grid.rows[index].cells[i], point, child);
                        }
                    } else {
                        for (k = 0; k < grid.rows.length; k++) {
                            cell = grid.rows[k].cells[index];
                            addChildNodeToNewLane(diagram, cell, point, child);
                        }
                    }
                }
            }
            updateConnectorsProperties(connectors, diagram);
            diagram.drag(swimLane, bounds.x - grid.bounds.x, bounds.y - grid.bounds.y);
        }
        diagram.protectPropertyChange(false);
    }
}

/**
 * addChildNodeToNewLane method \
 *
 * @returns {void} addChildNodeToNewLane method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {GridCell} cell - provide the cell  value.
 * @param {PointModel} point - provide the point  value.
 * @param {NodeModel} child - provide the child  value.
 * @private
 */
function addChildNodeToNewLane(diagram: Diagram, cell: GridCell, point: PointModel, child: NodeModel): void {
    if (cell.children && cell.children.length > 0) {
        const canvas: Canvas = cell.children[0] as Canvas;
        const parent: NodeModel = diagram.nameTable[canvas.id];
        if (canvas.bounds.containsPoint(point)) {
            diagram.addChild(parent, child);
        }
    }
}

/**
 * addPhase method \
 *
 * @returns {void} addPhase method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} parent - provide the cell  value.
 * @param {PhaseModel} newPhase - provide the point  value.
 * @private
 */
export function addPhase(diagram: Diagram, parent: NodeModel, newPhase: PhaseModel): void {
    if (parent.shape.type === 'SwimLane') {
        let gridRowIndex: number; let gridColIndex: number; let phaseNode: NodeModel;
        let phase: PhaseModel; let previousPhase: PhaseModel; let nextPhase: NodeModel;
        let phaseIndex: number;  let i: number;
        const x: number = parent.wrapper.bounds.x; const y: number = parent.wrapper.bounds.y;
        const shape: SwimLaneModel = parent.shape as SwimLaneModel;
        const padding: number = (shape as SwimLane).padding; const phasesCollection: PhaseModel[] = shape.phases; let width: number;
        const grid: GridPanel = parent.wrapper.children[0] as GridPanel;
        const orientation: boolean = shape.orientation === 'Horizontal' ? true : false;
        gridRowIndex = (shape.header && (shape as SwimLane).hasHeader) ? 0 : -1;
        if (shape.phases.length > 0) { gridRowIndex += 1; gridColIndex = 0; }
        const laneHeaderSize: number = (orientation) ? shape.lanes[0].header.width : shape.lanes[0].header.height;
        if (newPhase.offset > laneHeaderSize) {
            for (i = 0; i < phasesCollection.length; i++) {
                phase = phasesCollection[i];
                previousPhase = (i > 0) ? phasesCollection[i - 1] : phase;
                if (phase.offset > newPhase.offset) {
                    width = (i > 0) ? newPhase.offset - previousPhase.offset : newPhase.offset;
                    if (orientation) {
                        const nextCol: ColumnDefinition = grid.columnDefinitions()[i];
                        nextCol.width -= width;
                        nextPhase = diagram.nameTable[shape.phases[i].header.id];
                        nextPhase.maxWidth = nextPhase.wrapper.maxWidth = nextCol.width;
                        grid.updateColumnWidth(i, nextCol.width, false);
                        const addPhase: ColumnDefinition = new ColumnDefinition();
                        addPhase.width = width; phaseIndex = i;
                        grid.addColumn(i, addPhase, false);
                        break;
                    } else {
                        const nextRow: RowDefinition = grid.rowDefinitions()[i + gridRowIndex];
                        nextRow.height -= width; nextPhase = diagram.nameTable[shape.phases[i].header.id];
                        grid.updateRowHeight(i + gridRowIndex, nextRow.height, false);
                        const addPhase: RowDefinition = new RowDefinition();
                        addPhase.height = width; phaseIndex = i;
                        grid.addRow(i + gridRowIndex, addPhase, false);
                        break;
                    }
                }
            }
            if (diagram.diagramActions & DiagramAction.UndoRedo && phaseIndex === undefined) {
                const entry: HistoryEntry = diagram.historyManager.currentEntry.next;
                if (entry.isLastPhase) {
                    phaseIndex = phasesCollection.length;
                    addLastPhase(phaseIndex, parent, entry, grid, orientation, newPhase);
                }
            }
            const phaseObj: PhaseModel = new Phase((parent.shape) as Shape, 'phases', newPhase, true);
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) { phaseObj.id += randomId(); }
            shape.phases.splice(phaseIndex, 0, phaseObj);
            phaseDefine(grid, diagram, parent, gridRowIndex, orientation, phaseIndex);
            if (orientation) {
                phaseNode = diagram.nameTable[grid.rows[gridRowIndex].cells[phaseIndex].children[0].id];
                if (phaseIndex === 0 && shape.header && (shape as SwimLane).hasHeader) {
                    grid.rows[0].cells[0].children = grid.rows[0].cells[1].children; grid.rows[0].cells[1].children = [];
                    const fristRow: GridRow = grid.rows[0];
                    for (let i: number = 0; i < fristRow.cells.length; i++) {
                        fristRow.cells[i].minWidth = undefined;
                        if (i === 0) {
                            fristRow.cells[i].columnSpan = grid.rows[0].cells.length;
                        } else { fristRow.cells[i].columnSpan = 1; }
                    }
                }
                addHorizontalPhase(diagram, parent, grid, phaseIndex, orientation);
                const col: ColumnDefinition[] = grid.columnDefinitions();
                grid.updateColumnWidth(phaseIndex, col[phaseIndex].width, true, padding);
                phaseNode.maxWidth = phaseNode.wrapper.maxWidth = col[phaseIndex].width;
                if (col.length > phaseIndex + 1) {
                    const nextPhaseNode: NodeModel = diagram.nameTable[grid.rows[gridRowIndex].cells[phaseIndex + 1].children[0].id];
                    grid.updateColumnWidth(phaseIndex + 1, col[phaseIndex + 1].width, true, padding);
                    nextPhaseNode.maxWidth = nextPhaseNode.wrapper.maxWidth = col[phaseIndex + 1].width;
                }
                parent.width = parent.wrapper.width = parent.wrapper.children[0].width = grid.width;
            } else {
                phaseNode = diagram.nameTable[grid.rows[gridRowIndex + phaseIndex].cells[0].children[0].id];
                const row: RowDefinition[] = grid.rowDefinitions();
                let size: number = row[gridRowIndex + phaseIndex].height;
                addVerticalPhase(diagram, parent, grid, gridRowIndex + phaseIndex, orientation);
                grid.updateRowHeight(gridRowIndex + phaseIndex, size, true, padding);
                if (row.length > gridRowIndex + phaseIndex + 1) {
                    size = row[gridRowIndex + phaseIndex + 1].height;
                    grid.updateRowHeight(gridRowIndex + phaseIndex + 1, size, true, padding);
                }
                parent.height = parent.wrapper.height = parent.wrapper.children[0].height = grid.actualSize.height;
            }
            swimLaneMeasureAndArrange(parent); parent.width = parent.wrapper.actualSize.width;
            updateHeaderMaxWidth(diagram, parent);
            diagram.drag(parent, x - parent.wrapper.bounds.x, y - parent.wrapper.bounds.y);
            checkPhaseOffset(parent, diagram);
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                const entry: HistoryEntry = {
                    type: 'PhaseCollectionChanged', changeType: 'Insert', undoObject: cloneObject(phaseObj),
                    redoObject: cloneObject(phaseNode), category: 'Internal'
                };
                diagram.addHistoryEntry(entry);
            }
            diagram.updateDiagramObject(parent);
        }
    }
}

/**
 * addLastPhase method \
 *
 * @returns {void} addLastPhase method .\
 * @param {number} phaseIndex - provide the diagram  value.
 * @param {NodeModel} parent - provide the cell  value.
 * @param {HistoryEntry} entry - provide the point  value.
 * @param {GridPanel} grid - provide the grid  value.
 * @param {boolean} orientation - provide the orientation  value.
 * @param {PhaseModel} newPhase - provide the newPhase  value.
 * @private
 */
export function addLastPhase(
    phaseIndex: number, parent: NodeModel, entry: HistoryEntry, grid: GridPanel, orientation: boolean, newPhase: PhaseModel): void {
    const shape: SwimLaneModel = parent.shape as SwimLaneModel;
    const prevPhase: PhaseModel = shape.phases[phaseIndex - 2];
    const prevOffset: number = entry.previousPhase.offset;
    if (orientation) {
        const nextCol: ColumnDefinition = grid.columnDefinitions()[phaseIndex - 1];
        const addPhase: ColumnDefinition = new ColumnDefinition();
        if (phaseIndex > 1) {
            addPhase.width = (nextCol.width) - (prevOffset - prevPhase.offset);
            nextCol.width = prevOffset - prevPhase.offset;
        } else {
            addPhase.width = nextCol.width - prevOffset;
            nextCol.width = prevOffset;
        }
        grid.updateColumnWidth(phaseIndex - 1, nextCol.width, false);
        grid.addColumn(phaseIndex, addPhase, false);
    } else {
        const nextCol: RowDefinition = grid.rowDefinitions()[phaseIndex];
        const addPhase: RowDefinition = new RowDefinition();
        if (phaseIndex > 1) {
            addPhase.height = (entry.undoObject as PhaseModel).offset - prevOffset;
            nextCol.height = prevOffset - prevPhase.offset;
        } else {
            addPhase.height = nextCol.height - prevOffset;
            nextCol.height = prevOffset;
        }
        grid.updateRowHeight(phaseIndex, nextCol.height, false);
        grid.addRow(1 + phaseIndex, addPhase, false);
    }
}

/**
 * addHorizontalPhase method \
 *
 * @returns {void} addHorizontalPhase method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} node - provide the cell  value.
 * @param {GridPanel} grid - provide the point  value.
 * @param {number} index - provide the point  value.
 * @param {boolean} orientation - provide the point  value.
 * @private
 */
export function addHorizontalPhase(diagram: Diagram, node: NodeModel, grid: GridPanel, index: number, orientation: boolean): void {

    const shape: SwimLaneModel = node.shape as SwimLaneModel; let nextCell: GridCell; let i: number;
    let prevCell: GridCell; let gridCell: GridCell; let row: GridRow;

    const laneIndex: number = findStartLaneIndex(node);

    if (shape.header && (shape as SwimLane).hasHeader) {
        grid.rows[0].cells[0].columnSpan = grid.rows[0].cells.length;
    }
    for (i = laneIndex; i < grid.rows.length; i++) {
        row = grid.rows[i]; prevCell = row.cells[index - 1];
        gridCell = row.cells[index]; nextCell = row.cells[index + 1];
        addSwimlanePhases(diagram, node, prevCell, gridCell, nextCell, i, index);
    }
    ChangeLaneIndex(diagram, node, 1);
}

/**
 * addVerticalPhase method \
 *
 * @returns {void} addVerticalPhase method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} node - provide the cell  value.
 * @param {GridPanel} grid - provide the point  value.
 * @param {number} rowIndex - provide the point  value.
 * @param {boolean} orientation - provide the point  value.
 * @private
 */
export function addVerticalPhase(diagram: Diagram, node: NodeModel, grid: GridPanel, rowIndex: number, orientation: boolean): void {
    let prevCell: GridCell; let gridCell: GridCell; let nextCell: GridCell;
    const row: GridRow = grid.rows[rowIndex];
    const nextRow: GridRow = grid.rows[rowIndex + 1];
    const prevRow: GridRow = grid.rows[rowIndex - 1];
    for (let i: number = 1; i < row.cells.length; i++) {
        gridCell = row.cells[i];
        nextCell = (nextRow) ? nextRow.cells[i] : undefined;
        prevCell = prevRow.cells[i];
        addSwimlanePhases(diagram, node, prevCell, gridCell, nextCell, rowIndex, i);
    }
    ChangeLaneIndex(diagram, node, 1);
}
/**
 * addSwimlanePhases method \
 *
 * @returns {void} addSwimlanePhases method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} node - provide the node  value.
 * @param {GridPanel} prevCell - provide the prevCell  value.
 * @param {number} gridCell - provide the gridCell  value.
 * @param {boolean} nextCell - provide the nextCell  value.
 * @param {boolean} rowIndex - provide the rowIndex  value.
 * @param {boolean} columnIndex - provide the columnIndex  value.
 * @private
 */
function addSwimlanePhases(
    diagram: Diagram, node: NodeModel, prevCell: GridCell,
    gridCell: GridCell, nextCell: GridCell, rowIndex: number, columnIndex: number): void {

    let x: number; let y: number;
    const shape: SwimLaneModel = node.shape as SwimLaneModel;
    const orientation: boolean = shape.orientation === 'Horizontal' ? true : false;
    const grid: GridPanel = node.wrapper.children[0] as GridPanel;
    const width: number = gridCell.desiredCellWidth; const height: number = gridCell.desiredCellHeight;
    //const col: number = (orientation) ? rowIndex : columnIndex;
    //let parentWrapper: Container;
    let j: number;
    const i: number = (orientation) ? rowIndex : columnIndex;
    if (prevCell) {
        x = orientation ? prevCell.bounds.x + prevCell.bounds.width : prevCell.bounds.x;
        y = orientation ? prevCell.bounds.y : prevCell.bounds.y + prevCell.bounds.height;
    } else {
        x = grid.bounds.x; y = nextCell.bounds.y;
    }

    const rect: Rect = new Rect(x, y, width, height);

    const canvas: NodeModel = {
        id: node.id + ((orientation) ? shape.lanes[i - 2] : shape.lanes[i - 1]).id + randomId()[0],
        rowIndex: rowIndex, columnIndex: columnIndex,
        width: gridCell.minWidth, height: gridCell.minHeight,
        style: ((orientation) ? shape.lanes[i - 2] : shape.lanes[i - 1]).style,
        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
        container: { type: 'Canvas', orientation: orientation ? 'Horizontal' : 'Vertical' }
    } as NodeModel;
    const parentWrapper: Container = addObjectToGrid(diagram, grid, node, canvas, false, false, true);
    parentWrapper.children[0].isCalculateDesiredSize = false;
    grid.addObject(parentWrapper, rowIndex, columnIndex);

    if (nextCell && nextCell.children && nextCell.children.length) {
        for (j = 0; j < nextCell.children.length; j++) {
            if (orientation) {
                diagram.nameTable[nextCell.children[j].id].columnIndex += 1;
            } else {
                diagram.nameTable[nextCell.children[j].id].rowIndex += 1;
            }
        }
    }
    arrangeChildInGrid(diagram, nextCell, gridCell, rect, parentWrapper, orientation, prevCell);

}
/**
 * arrangeChildInGrid method \
 *
 * @returns {void} arrangeChildInGrid method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {GridCell} nextCell - provide the nextCell  value.
 * @param {GridPanel} gridCell - provide the gridCell  value.
 * @param {Rect} rect - provide the rect  value.
 * @param {Container} parentWrapper - provide the parentWrapper  value.
 * @param {boolean} orientation - provide the orientation  value.
 * @param {GridCell} prevCell - provide the prevCell  value.
 * @private
 */
export function arrangeChildInGrid(
    diagram: Diagram, nextCell: GridCell, gridCell: GridCell,
    rect: Rect, parentWrapper: Container, orientation: boolean, prevCell?: GridCell): void {

    let child: Container; let point: PointModel; let childNode: NodeModel;
    const parent: NodeModel = diagram.nameTable[parentWrapper.id];
    const changeCell: GridCell = (!nextCell) ? prevCell : nextCell;
    const swimLane: NodeModel = diagram.nameTable[(parent as Node).parentId];
    const padding: number = (swimLane.shape as SwimLane).padding;

    if (changeCell.children && (changeCell.children[0] as Container).children.length > 1) {
        for (let j: number = 1; j < (changeCell.children[0] as Container).children.length; j++) {
            child = (changeCell.children[0] as Container).children[j] as Container;
            childNode = diagram.nameTable[child.id] as NodeModel;
            point = (orientation) ? { x: child.bounds.x, y: child.bounds.center.y } :
                { x: child.bounds.center.x, y: child.bounds.top };

            if (rect.containsPoint(point)) {
                (gridCell.children[0] as Container).children.push(child);
                (changeCell.children[0] as Container).children.splice(j, 1);
                j--;
                diagram.deleteChild(childNode);
                if (!(childNode as Node).isLane) {
                    (childNode as Node).parentId = parentWrapper.id;
                }
                if (!parent.children) {
                    parent.children = [];
                }
                if (!nextCell) {
                    if (orientation) {
                        childNode.margin.left = childNode.wrapper.bounds.x - changeCell.children[0].bounds.right;
                    } else {
                        childNode.margin.top = childNode.wrapper.bounds.y - changeCell.children[0].bounds.bottom;
                    }
                }
                parent.children.push(child.id);
                childNode.zIndex = parent.zIndex + 1;
                diagram.removeElements(childNode);
            } else if (nextCell) {
                if (orientation) {
                    childNode.margin.left -= gridCell.desiredCellWidth;
                    if (padding > childNode.margin.left) {
                        childNode.margin.left = padding;
                    }
                } else {
                    childNode.margin.top -= gridCell.desiredCellHeight;
                    if (padding > childNode.margin.top) {
                        childNode.margin.top = padding;
                    }
                }
            }
        }
    }
}

/**
 * swimLaneSelection method \
 *
 * @returns {void} swimLaneSelection method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} node - provide the node  value.
 * @param {string} corner - provide the corner  value.
 * @private
 */
export function swimLaneSelection(diagram: Diagram, node: NodeModel, corner: string): void {
    if (node.shape.type === 'SwimLane' && (corner === 'ResizeSouth' || corner === 'ResizeEast')) {

        const shape: SwimLaneModel = node.shape as SwimLaneModel;
        const wrapper: GridPanel = node.wrapper.children[0] as GridPanel;
        let child: Container; let index: number;

        if (corner === 'ResizeSouth') {
            if (shape.orientation === 'Vertical') {
                child = wrapper.rows[wrapper.rows.length - 1].cells[0];
            } else {
                index = wrapper.rows.length - 1;
                child = wrapper.rows[index].cells[wrapper.rows[index].cells.length - 1];
            }
        } else {
            index = (shape.header && (shape as SwimLane).hasHeader) ? 1 : 0;
            child = wrapper.rows[index].cells[wrapper.rows[index].cells.length - 1];

        }
        diagram.commandHandler.select(diagram.nameTable[child.children[0].id]);
    }
}

/**
 * pasteSwimLane method \
 *
 * @returns {void} pasteSwimLane method .\
 * @param {Diagram} swimLane - provide the diagram  value.
 * @param {NodeModel} diagram - provide the diagram  value.
 * @param {string} clipboardData - provide the clipboardData  value.
 * @param {string} laneNode - provide the laneNode  value.
 * @param {string} isLane - provide the isLane  value.
 * @param {string} isUndo - provide the isUndo  value.
 * @private
 */
export function pasteSwimLane(
    swimLane: NodeModel, diagram: Diagram, clipboardData?: ClipBoardObject,
    laneNode?: NodeModel, isLane?: boolean, isUndo?: boolean): NodeModel {

    let i: number; let j: number; let lane: LaneModel; let phase: PhaseModel; let node: Node;
    const ranId: string = randomId(); let cloneLane: NodeModel; let childX: number; let childY: number;
    const shape: SwimLaneModel = swimLane.shape as SwimLaneModel; //let lanes: LaneModel[];
    const phases: PhaseModel[] = shape.phases;
    const nodeX: number = swimLane.offsetX - swimLane.wrapper.actualSize.width / 2;
    let nodeY: number = swimLane.offsetY - swimLane.wrapper.actualSize.height / 2;

    if (shape.orientation === 'Vertical') {
        nodeY += (shape.header && (shape as SwimLane).hasHeader) ? shape.header.height : 0;
    }
    if (!isUndo) {
        if (!isLane) {
            swimLane.id += ranId;
            if (shape && shape.header && (shape as SwimLane).hasHeader) {
                shape.header.id += ranId;
            } else {
                shape.header = undefined;
            }
        }
        for (i = 0; phases && i < phases.length; i++) {
            phase = phases[i];
            phase.id += ranId;
        }
    }
    const lanes: LaneModel[] = (isLane) ? [clipboardData.childTable[laneNode.id]] : shape.lanes;
    for (i = 0; lanes && i < lanes.length; i++) {
        lane = lanes[i];
        if (!isUndo) {
            lane.id += ranId;
        }
        for (j = 0; lane.children && j < lane.children.length; j++) {
            node = lane.children[j] as Node;
            childX = node.wrapper.offsetX - node.width / 2;
            childY = node.wrapper.offsetY - node.height / 2;
            node.zIndex = -1;
            node.inEdges = node.outEdges = [];
            if (isUndo || (clipboardData && (clipboardData.pasteIndex === 1 || clipboardData.pasteIndex === 0))) {
                if (shape.orientation === 'Vertical') {
                    node.margin.top = childY - nodeY;
                } else {
                    node.margin.left = childX - nodeX;
                }
            }
            if (!isUndo) {
                node.id += ranId;
            }
        }
    }
    if (!isUndo) {
        if (isLane) {
            const newShape: SwimLaneModel = {
                lanes: lanes,
                phases: phases, phaseSize: shape.phaseSize,
                type: 'SwimLane', orientation: shape.orientation,
                header: { annotation: { content: 'Title' }, height: 50 }
            } as SwimLaneModel;
            cloneLane = { shape: newShape } as NodeModel;
            if (shape.orientation === 'Horizontal') {
                cloneLane.width = swimLane.wrapper.actualSize.width;
                cloneLane.height = laneNode.wrapper.actualSize.height + shape.header.height + shape.phaseSize;
                cloneLane.offsetX = swimLane.wrapper.offsetX + (clipboardData.pasteIndex * 10);
                cloneLane.offsetY = laneNode.wrapper.offsetY + (clipboardData.pasteIndex * 10);
            } else {
                cloneLane.width = laneNode.wrapper.actualSize.width;
                cloneLane.height = swimLane.wrapper.actualSize.height;
                cloneLane.offsetX = laneNode.wrapper.offsetX + (clipboardData.pasteIndex * 10);
                cloneLane.offsetY = swimLane.wrapper.offsetY + (clipboardData.pasteIndex * 10);
            }
            swimLane = cloneLane;
        }
        if (clipboardData.pasteIndex !== 0) {
            swimLane.offsetX += 10; swimLane.offsetY += 10;
        }
        swimLane.zIndex = -1;
        swimLane = diagram.add(swimLane) as NodeModel;
        if (!isLane) {
            for (const i of Object.keys(clipboardData.childTable)) {
                const connector: ConnectorModel = clipboardData.childTable[i] as ConnectorModel;
                connector.id += ranId;
                connector.sourceID += ranId;
                connector.targetID += ranId;
                connector.zIndex = -1;
                diagram.add(connector);
            }
        }
        if (diagram.mode !== 'SVG') {
            diagram.refreshDiagramLayer();
        }
        diagram.select([swimLane]);
    }
    return swimLane;
}

/**
 * gridSelection method \
 *
 * @returns {void} gridSelection method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {SelectorModel} selectorModel - provide the selectorModel  value.
 * @param {string} id - provide the id  value.
 * @param {boolean} isSymbolDrag - provide the isSymbolDrag  value.
 * @private
 */
export function gridSelection(diagram: Diagram, selectorModel: SelectorModel, id?: string, isSymbolDrag?: boolean): Canvas {
    let canvas: Canvas; let node: NodeModel = selectorModel.nodes[0];
    if (isSymbolDrag || checkParentAsContainer(diagram, node, true)) {
        let targetnode: NodeModel; let bounds: Rect;
        let swimLaneId: string; const element: DiagramElement = new DiagramElement();

        if (id) {
            swimLaneId = (diagram.nameTable[id].parentId);
            targetnode = node = diagram.nameTable[id];
        }
        const wrapper: Container = !id ? node.wrapper : targetnode.wrapper;
        const parentNode: NodeModel = diagram.nameTable[swimLaneId || (node as Node).parentId];
        if (parentNode && parentNode.container.type === 'Grid') {
            canvas = new Canvas(); canvas.children = [];
            if (isSymbolDrag || !((node as Node).isHeader)) {
                if ((parentNode.container.orientation === 'Horizontal' && (node as Node).isPhase) ||
                    (parentNode.container.orientation === 'Vertical' &&
                        (node.rowIndex > 0 && node.columnIndex > 0 || (node as Node).isLane))) {
                    bounds = findBounds(
                        parentNode,
                        (targetnode) ? targetnode.columnIndex : node.columnIndex,
                        ((parentNode.shape as SwimLaneModel).header && (parentNode.shape as SwimLane).hasHeader) ? true : false);
                    canvas.offsetX = bounds.center.x; canvas.offsetY = bounds.center.y;
                    element.width = bounds.width; element.height = bounds.height;
                } else {
                    canvas.offsetX = parentNode.offsetX;
                    canvas.offsetY = wrapper.offsetY;
                    element.width = parentNode.wrapper.actualSize.width;
                    element.height = wrapper.actualSize.height;
                }
            }
            canvas.children.push(element);
            canvas.measure(new Size());
            canvas.arrange(canvas.desiredSize);
        }
    }
    return canvas;
}

/**
 * removeLaneChildNode method \
 *
 * @returns {void} removeLaneChildNode method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} swimLaneNode - provide the diagram  value.
 * @param {NodeModel} currentObj - provide the currentObj  value.
 * @param {NodeModel} isChildNode - provide the isChildNode  value.
 * @param {number} laneIndex - provide the laneIndex  value.
 * @private
 */
export function removeLaneChildNode(
    diagram: Diagram, swimLaneNode: NodeModel, currentObj: NodeModel, isChildNode?: NodeModel, laneIndex?: number): void {
    laneIndex = (laneIndex !== undefined) ? laneIndex : findLaneIndex(swimLaneNode, currentObj);
    let preventHistory: boolean = false;
    const lanenode: LaneModel = (swimLaneNode.shape as SwimLaneModel).lanes[laneIndex];
    for (let j: number = lanenode.children.length - 1; j >= 0; j--) {
        if (isChildNode) {
            if (isChildNode.id === lanenode.children[j].id) {
                lanenode.children.splice(j, 1);
            }
        } else {
            diagram.removeDependentConnector(lanenode.children[j] as Node);
            if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                diagram.diagramActions = diagram.diagramActions | DiagramAction.UndoRedo;
                preventHistory = true;
            }
            diagram.remove(lanenode.children[j]);
            lanenode.children.splice(j, 1);
            if (preventHistory) {
                diagram.diagramActions = diagram.diagramActions & ~DiagramAction.UndoRedo;
            }

        }
    }
}
/**
 * getGridChildren method \
 *
 * @returns {DiagramElement} getGridChildren method .\
 * @param {Diagram} obj - provide the obj  value.
 * @private
 */
export function getGridChildren(obj: DiagramElement): DiagramElement {
    const children: DiagramElement = (obj as Container).children[0];
    return children;
}

/**
 * removeSwimLane method \
 *
 * @returns {void} removeSwimLane method .\
 * @param {Diagram} diagram - provide the obj  value.
 * @param {NodeModel} obj - provide the obj  value.
 * @private
 */
export function removeSwimLane(diagram: Diagram, obj: NodeModel): void {
    const rows: GridRow[] = (obj.wrapper.children[0] as GridPanel).rows;
    //let preventHistory: boolean = false;
    let node: NodeModel;
    let i: number; let j: number; let k: number; let child: Container; let removeNode: Node;
    for (i = 0; i < rows.length; i++) {
        for (j = 0; j < rows[i].cells.length; j++) {
            child = getGridChildren(rows[i].cells[j]) as Container;
            if (child && child.children) {
                for (k = child.children.length - 1; k >= 0; k--) {
                    if ((child.children[k] as Container).children) {
                        removeNode = diagram.nameTable[child.children[k].id];
                        if (removeNode) {
                            if (removeNode.isLane) {
                                deleteNode(diagram, removeNode);
                            } else {
                                diagram.removeDependentConnector(removeNode);
                                diagram.diagramActions |= DiagramAction.PreventHistory;
                                if ((removeNode.constraints & NodeConstraints.Delete)) {
                                    diagram.remove(removeNode);
                                } else {
                                    removeChildInContainer(diagram, removeNode, {}, false);
                                }
                                diagram.diagramActions &= ~DiagramAction.PreventHistory;
                            }
                        }
                    }
                }
            }
            if (child) {
                node = diagram.nameTable[child.id];
                if (node) {
                    deleteNode(diagram, node);
                }
            }
        }
    }
}

/**
 * deleteNode method \
 *
 * @returns {void} deleteNode method .\
 * @param {Diagram} diagram - provide the obj  value.
 * @param {NodeModel} node - provide the obj  value.
 * @private
 */
function deleteNode(diagram: Diagram, node: NodeModel): void {
    diagram.nodes.splice(diagram.nodes.indexOf(node), 1);
    diagram.removeFromAQuad(node as IElement);
    diagram.removeObjectsFromLayer(node);
    delete diagram.nameTable[node.id];
    diagram.removeElements(node);
}

/**
 * removeLane method \
 *
 * @returns {void} removeLane method .\
 * @param {Diagram} diagram - provide the obj  value.
 * @param {NodeModel} lane - provide the obj  value.
 * @param {NodeModel} swimLane - provide the obj  value.
 * @param {LaneModel} lanes - provide the obj  value.
 * @private
 */
export function removeLane(diagram: Diagram, lane: NodeModel, swimLane: NodeModel, lanes?: LaneModel): void {
    let args: ICollectionChangeEventArgs;
    if (swimLane.shape.type === 'SwimLane') {
        const shape: SwimLaneModel = swimLane.shape as SwimLaneModel; let laneIndex: number;
        if (shape.lanes.length === 1) {
            diagram.remove(swimLane);
        } else {
            const x: number = swimLane.wrapper.bounds.x; const y: number = swimLane.wrapper.bounds.y;
            let row: GridRow; let i: number; let cell: GridCell; let j: number; let child: Canvas;

            const grid: GridPanel = swimLane.wrapper.children[0] as GridPanel;
            laneIndex = (lanes) ? (shape.lanes.indexOf(lanes)) : findLaneIndex(swimLane, lane);
            args = {
                element: lane, cause: diagram.diagramActions, state: 'Changing', type: 'Removal', cancel: false, laneIndex: laneIndex
            };
            diagram.triggerEvent(DiagramEvent.collectionChange, args);
            if (!args.cancel) {
                const undoObj: LaneModel = cloneObject(shape.lanes[laneIndex]) as LaneModel;
                removeLaneChildNode(diagram, swimLane, lane as NodeModel, undefined, laneIndex);
                if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
                    const entry: HistoryEntry = {
                        type: 'LaneCollectionChanged', changeType: 'Remove', undoObject: undoObj,
                        redoObject: cloneObject(lane), category: 'Internal'
                    };
                    diagram.addHistoryEntry(entry);
                }
                shape.lanes.splice(laneIndex, 1);
                let index: number = (lane) ? (shape.orientation === 'Horizontal' ? lane.rowIndex : lane.columnIndex) :
                    (findStartLaneIndex(swimLane) + laneIndex);
                if (shape.orientation === 'Horizontal') {
                    row = grid.rows[index];
                    for (i = 0; i < row.cells.length; i++) {
                        cell = row.cells[i];
                        if (cell && cell.children.length > 0) {
                            for (j = 0; j < cell.children.length; j++) {
                                child = cell.children[j] as Canvas;
                                removeChildren(diagram, child);
                            }
                        }
                    }
                    grid.removeRow(index);
                } else {
                    swimLane.width = (swimLane.width !== undefined) ?
                        swimLane.width - grid.rows[0].cells[index].actualSize.width : swimLane.width;
                    for (i = 0; i < grid.rows.length; i++) {
                        cell = grid.rows[i].cells[index];
                        if (cell && cell.children.length > 0) {
                            for (j = 0; j < cell.children.length; j++) {
                                child = cell.children[j] as Canvas;
                                removeChildren(diagram, child);
                            }
                        }
                    }
                    grid.removeColumn(index);
                }
                args = {
                    element: lane, cause: diagram.diagramActions, state: 'Changed', type: 'Removal', cancel: false, laneIndex: laneIndex
                };
                diagram.triggerEvent(DiagramEvent.collectionChange, args);
                swimLane.width = swimLane.wrapper.width = grid.width;
                swimLane.height = swimLane.wrapper.height = grid.height;
                swimLaneMeasureAndArrange(swimLane);
                if ((swimLane.shape as SwimLaneModel).orientation === 'Vertical') {
                    index = 0;
                }
                ChangeLaneIndex(diagram, swimLane, index);
                diagram.drag(swimLane, x - swimLane.wrapper.bounds.x, y - swimLane.wrapper.bounds.y);
                diagram.updateDiagramObject(swimLane);
            }
        }
    }
}

/**
 * removeChildren method \
 *
 * @returns {void} removeChildren method .\
 * @param {Diagram} diagram - provide the obj  value.
 * @param {Canvas} canvas - provide the obj  value.
 * @private
 */
export function removeChildren(diagram: Diagram, canvas: Canvas): void {
    let i: number; let node: NodeModel;
    if (canvas instanceof Canvas) {
        if (canvas.children.length > 0) {
            for (i = 0; i < canvas.children.length; i++) {
                if (canvas.children[i] instanceof Canvas) {
                    removeChildren(diagram, canvas.children[i] as Canvas);
                }
            }
        }
        node = diagram.getObject(canvas.id);
        deleteNode(diagram, node);
    }
}

/**
 * removePhase method \
 *
 * @returns {void} removePhase method .\
 * @param {Diagram} diagram - provide the obj  value.
 * @param {NodeModel} phase - provide the obj  value.
 * @param {NodeModel} swimLane - provide the obj  value.
 * @param {PhaseModel} swimLanePhases - provide the obj  value.
 * @private
 */
export function removePhase(diagram: Diagram, phase: NodeModel, swimLane: NodeModel, swimLanePhases?: PhaseModel): void {
    diagram.protectPropertyChange(true);
    const x: number = swimLane.wrapper.bounds.x; const y: number = swimLane.wrapper.bounds.y;
    let isLastPhase: boolean = false; let previousPhase: PhaseModel;
    const shape: SwimLaneModel = swimLane.shape as SwimLaneModel;
    const grid: GridPanel = swimLane.wrapper.children[0] as GridPanel;
    const phaseIndex: number = swimLanePhases ? shape.phases.indexOf(swimLanePhases) : findPhaseIndex(phase, swimLane);
    const phaseLength: number = shape.phases.length;
    if (shape.phases.length > 1) {
        if (phaseIndex === phaseLength - 1) {
            isLastPhase = true;
            previousPhase = cloneObject(shape.phases[phaseIndex - 1]) as PhaseModel;
        }
        const undoObj: PhaseModel = cloneObject(shape.phases[phaseIndex]) as PhaseModel;
        shape.phases.splice(phaseIndex, 1);
        if (!(diagram.diagramActions & DiagramAction.UndoRedo)) {
            const entry: HistoryEntry = {
                type: 'PhaseCollectionChanged', changeType: 'Remove', undoObject: undoObj, previousPhase: previousPhase,
                redoObject: cloneObject(phase), category: 'Internal', isLastPhase: isLastPhase
            };
            diagram.addHistoryEntry(entry);
        }
        if (shape.orientation === 'Horizontal') {
            removeHorizontalPhase(diagram, grid, phase, phaseIndex);
        } else {
            removeVerticalPhase(diagram, grid, phase, phaseIndex, swimLane);
        }
        updateHeaderMaxWidth(diagram, swimLane);
        ChangeLaneIndex(diagram, swimLane, 1);
        checkPhaseOffset(swimLane, diagram);
        diagram.protectPropertyChange(false);
        diagram.updateDiagramObject(swimLane);
    }
}

/**
 * removeHorizontalPhase method \
 *
 * @returns {void} removeHorizontalPhase method .\
 * @param {Diagram} diagram - provide the obj  value.
 * @param {GridPanel} grid - provide the obj  value.
 * @param {NodeModel} phase - provide the obj  value.
 * @param {number} phaseIndex - provide the obj  value.
 * @private
 */
export function removeHorizontalPhase(diagram: Diagram, grid: GridPanel, phase: NodeModel, phaseIndex?: number): void {
    let row: GridRow; let cell: GridCell; let prevCell: Canvas; let actualChild: Canvas; //let prevChild: Canvas;
    let prevCanvas: Canvas; let width: number; phaseIndex = (phaseIndex !== undefined) ? phaseIndex : phase.columnIndex;
    let i: number; let j: number; let k: number; let child: Canvas; let node: Node; let object: Node;
    for (i = 0; i < grid.rows.length; i++) {
        row = grid.rows[i];
        if (row.cells.length > 1) {
            cell = row.cells[phaseIndex];
            prevCell = (row.cells.length - 1 === phaseIndex) ? row.cells[phaseIndex - 1] :
                row.cells[phaseIndex + 1];
            prevCanvas = prevCell.children[0] as Canvas;
            if (cell.children.length > 0) {
                actualChild = cell.children[0] as Canvas;
                node = diagram.nameTable[actualChild.id] as Node;
                if (prevCell.children.length === 0 && cell.children.length > 0) {
                    prevCell.children = cell.children;
                    (prevCell as GridCell).columnSpan = (cell as GridCell).columnSpan - 1;
                } else {
                    for (j = 0; j < actualChild.children.length; j++) {
                        child = actualChild.children[j] as Canvas;
                        if (child instanceof Canvas) {
                            object = diagram.nameTable[child.id] as Node;
                            if (!object.isLane) {
                                object.parentId = prevCanvas.id;
                            }
                            if ((row.cells.length - 1 === phaseIndex)) {
                                object.margin.left = object.wrapper.bounds.x - prevCanvas.bounds.x;
                                child.margin.left = object.wrapper.bounds.x - prevCanvas.bounds.x;
                            }
                            prevCanvas.children.push(child);
                            if (diagram.nameTable[prevCanvas.id]) {
                                const parentNode: NodeModel = diagram.nameTable[prevCanvas.id];
                                if (!parentNode.children) {
                                    parentNode.children = [];
                                }
                                parentNode.children.push(child.id);
                            }
                            actualChild.children.splice(j, 1); j--;
                            if (node && node.children && node.children.indexOf(object.id) !== -1) {
                                node.children.splice(node.children.indexOf(object.id), 1);
                            }
                        }
                        if ((row.cells.length - 1 !== phaseIndex)) {
                            for (k = 0; k < prevCanvas.children.length; k++) {
                                const prevChild: Canvas = prevCanvas.children[k] as Canvas;
                                if (prevChild instanceof Canvas) {
                                    const prevNode: NodeModel = diagram.nameTable[prevChild.id];
                                    prevNode.margin.left = prevNode.wrapper.bounds.x - actualChild.bounds.x;
                                    prevChild.margin.left = prevNode.wrapper.bounds.x - actualChild.bounds.x;
                                }
                            }
                        }
                    }
                    if (node && node.isPhase) {
                        const object: NodeModel = diagram.nameTable[prevCanvas.id];
                        if (object) {
                            prevCanvas.maxWidth = object.wrapper.maxWidth = object.wrapper.maxWidth += node.wrapper.maxWidth;
                        }
                    }
                    deleteNode(diagram, node);
                }
            }
        }
    }
    const prevWidth: number = grid.columnDefinitions()[phaseIndex].width;
    grid.removeColumn(phaseIndex);

    if ((phaseIndex < grid.columnDefinitions().length)) {
        width = grid.columnDefinitions()[phaseIndex].width;
        width += prevWidth;
        grid.updateColumnWidth(phaseIndex, width, true);
    } else {
        width = grid.columnDefinitions()[phaseIndex - 1].width;
        width += prevWidth;
        grid.updateColumnWidth(phaseIndex - 1, width, true);
    }

}

/**
 * removeVerticalPhase method \
 *
 * @returns {void} removeVerticalPhase method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {GridPanel} grid - provide the grid  value.
 * @param {NodeModel} phase - provide the phase  value.
 * @param {number} phaseIndex - provide the phaseIndex  value.
 * @param {number} swimLane - provide the swimLane  value.
 * @private
 */
export function removeVerticalPhase(diagram: Diagram, grid: GridPanel, phase: NodeModel, phaseIndex: number, swimLane: NodeModel): void {
    let cell: GridCell;  let height: number;
    let i: number; let j: number; let k: number;
    let prevCell: GridCell; let prevChild: Canvas;
    const shape: SwimLaneModel = swimLane.shape as SwimLaneModel; let child: Canvas; let object: Node;
    const phaseRowIndex: number = (phaseIndex !== undefined) ? ((shape.header) ? phaseIndex + 1 : phaseIndex) : phase.rowIndex;
    const row: GridRow = grid.rows[phaseRowIndex];
    let top: number = swimLane.wrapper.bounds.y;
    const phaseCount: number = shape.phases.length;
    if (shape.header !== undefined && (shape as SwimLane).hasHeader) {
        top += grid.rowDefinitions()[0].height;
    }
    const prevRow: GridRow = (phaseIndex === phaseCount) ? grid.rows[phaseRowIndex - 1] : grid.rows[phaseRowIndex + 1];
    for (i = 0; i < row.cells.length; i++) {
        cell = row.cells[i];
        prevCell = prevRow.cells[i]; prevChild = prevCell.children[0] as Canvas;
        if (cell.children.length > 0) {
            const children: Canvas = cell.children[0] as Canvas;
            const node: NodeModel = diagram.nameTable[children.id] as NodeModel;
            if (phaseIndex < phaseCount) {
                for (k = 0; k < prevChild.children.length; k++) {
                    child = prevChild.children[k] as Canvas;
                    if (child instanceof Canvas) {
                        object = diagram.nameTable[child.id];
                        object.margin.top = object.wrapper.bounds.y - (phaseIndex === 0 ? top : children.bounds.y);
                        child.margin.top = object.wrapper.bounds.y - (phaseIndex === 0 ? top : children.bounds.y);
                    }
                }
            }
            for (j = 0; j < children.children.length; j++) {
                child = children.children[j] as Canvas;
                if (child instanceof Canvas) {
                    object = diagram.nameTable[child.id] as Node;
                    object.parentId = prevChild.id;
                    if (phaseIndex === phaseCount) {
                        object.margin.top = object.wrapper.bounds.y - (phaseIndex === 0 ? top : prevChild.bounds.y);
                        child.margin.top = object.wrapper.bounds.y - (phaseIndex === 0 ? top : prevChild.bounds.y);
                    }
                    prevChild.children.push(child);
                    children.children.splice(j, 1); j--;
                    if (node.children && node.children.indexOf(object.id) !== -1) {
                        node.children.splice(node.children.indexOf(object.id), 1);
                    }
                }
            }
            deleteNode(diagram, node);
        }
    }
    const prevHeight: number = grid.rowDefinitions()[phaseRowIndex].height;
    grid.removeRow(phaseRowIndex);

    if ((phaseRowIndex < grid.rowDefinitions().length)) {
        height = grid.rowDefinitions()[phaseRowIndex].height;
        height += prevHeight;
        grid.updateRowHeight(phaseRowIndex, height, true);
    } else {
        height = grid.rowDefinitions()[phaseRowIndex - 1].height;
        height += prevHeight;
        grid.updateRowHeight(phaseRowIndex - 1, height, true);
    }
}

/**
 * considerSwimLanePadding method \
 *
 * @returns {void} considerSwimLanePadding method .\
 * @param {Diagram} diagram - provide the diagram  value.
 * @param {NodeModel} node - provide the grid  value.
 * @param {number} padding - provide the phase  value.
 * @private
 */
export function considerSwimLanePadding(diagram: Diagram, node: NodeModel, padding: number): void {

    const lane: Node = diagram.nameTable[(node as Node).parentId];
    if (lane && lane.isLane) {
        const swimLane: NodeModel = diagram.nameTable[lane.parentId];
        const grid: GridPanel = swimLane.wrapper.children[0] as GridPanel;
        //let x: number = swimLane.wrapper.bounds.x; let y: number = swimLane.wrapper.bounds.y;
        grid.updateColumnWidth(lane.columnIndex, grid.columnDefinitions()[lane.columnIndex].width, true, padding);
        grid.updateRowHeight(lane.rowIndex, grid.rowDefinitions()[lane.rowIndex].height, true, padding);
        const canvas: Canvas = lane.wrapper as Canvas;
        let laneHeader: Canvas; let isConsiderHeader: boolean = false;

        if (node.margin.left < padding) {
            node.margin.left = padding;
        }
        if (node.margin.top < padding) {
            node.margin.top = padding;
        }

        for (let i: number = 0; i < canvas.children.length; i++) {
            const child: Canvas = canvas.children[i] as Canvas;
            if (child instanceof Canvas) {
                const childNode: Node = diagram.nameTable[child.id];
                if (childNode.isLane) {
                    laneHeader = childNode.wrapper as Canvas;
                    isConsiderHeader = true;
                    break;
                }
            }
        }
        if (laneHeader) {
            if ((swimLane.shape as SwimLaneModel).orientation === 'Horizontal') {
                if (node.margin.left < padding + laneHeader.actualSize.width) {
                    node.margin.left = padding + laneHeader.actualSize.width;
                }
            } else {
                if (node.margin.top < padding + laneHeader.actualSize.height) {
                    node.margin.top = padding + laneHeader.actualSize.height;
                }
            }
        }

        swimLane.wrapper.measure(new Size(swimLane.width, swimLane.height));
        swimLane.wrapper.arrange(swimLane.wrapper.desiredSize);
        node.offsetX = node.wrapper.offsetX; node.offsetY = node.wrapper.offsetY;
        diagram.nodePropertyChange(node as Node, {} as Node, { margin: { left: node.margin.left, top: node.margin.top } } as Node);
        grid.measure(new Size(grid.width, grid.height));
        grid.arrange(grid.desiredSize);
        swimLane.width = swimLane.wrapper.width = swimLane.wrapper.children[0].actualSize.width;
        swimLane.height = swimLane.wrapper.height = swimLane.wrapper.children[0].actualSize.height;
    }
}

/**
 * checkLaneChildrenOffset method \
 *
 * @returns {void} checkLaneChildrenOffset method .\
 * @param {NodeModel} swimLane - provide the diagram  value.
 * @private
 */
export function checkLaneChildrenOffset(swimLane: NodeModel): void {
    if (swimLane.shape.type === 'SwimLane') {
        const lanes: LaneModel[] = (swimLane.shape as SwimLaneModel).lanes;
        let lane: LaneModel; let child: NodeModel;
        for (let i: number = 0; i < lanes.length; i++) {
            lane = lanes[i];
            for (let j: number = 0; j < lane.children.length; j++) {
                child = lane.children[j];
                child.offsetX = child.wrapper.offsetX;
                child.offsetY = child.wrapper.offsetY;
            }
        }
    }
}
/**
 * findLane method \
 *
 * @returns {LaneModel} findLane method .\
 * @param {Node} laneNode - provide the laneNode  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @private
 */
export function findLane(laneNode: Node, diagram: Diagram): LaneModel {
    let lane: LaneModel;
    if (laneNode.isLane) {
        const swimLane: NodeModel = diagram.getObject(laneNode.parentId);
        if (swimLane && swimLane.shape.type === 'SwimLane' && (laneNode as Node).isLane) {
            const laneIndex: number = findLaneIndex(swimLane, laneNode as NodeModel);
            lane = (swimLane.shape as SwimLane).lanes[laneIndex];
        }
    }
    return lane;
}

/**
 * canLaneInterchange method \
 *
 * @returns {boolean} canLaneInterchange method .\
 * @param {Node} laneNode - provide the laneNode  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @private
 */
export function canLaneInterchange(laneNode: Node, diagram: Diagram): boolean {
    if (laneNode.isLane) {
        const lane: LaneModel = findLane(laneNode, diagram);
        const eventHandler: string = 'eventHandler';
        let resize: string = diagram[eventHandler].action;
        let canResize: boolean = resize.includes('Resize');
        if (canResize || lane.canMove) {
            return true;
        }
    }
    return false;
}
/**
 * updateSwimLaneChildPosition method \
 *
 * @returns {void} updateSwimLaneChildPosition method .\
 * @param {Lane[]} lanes - provide the laneNode  value.
 * @param {Diagram} diagram - provide the diagram  value.
 * @private
 */
export function updateSwimLaneChildPosition(lanes: Lane[], diagram: Diagram): void {
    let lane: Lane; let node: NodeModel;
    for (let i: number = 0; i < lanes.length; i++) {
        lane = lanes[i];
        for (let j: number = 0; j < lane.children.length; j++) {
            node = diagram.nameTable[lane.children[j].id];
            node.offsetX = node.wrapper.offsetX;
            node.offsetY = node.wrapper.offsetY;
        }
    }
}
