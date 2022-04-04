/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsdoc/require-param */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable no-self-assign */
import { PointModel } from '../primitives/point-model';
import { NodeModel } from './node-model';
import { Rect } from '../primitives/rect';
import { Diagram } from '../diagram';
import { DiagramElement } from '../core/elements/diagram-element';
import { PathElement } from '../core/elements/path-element';
import { SnapConstraints } from '../enum/enum';
import { Connector } from './connector';
import { Node, Selector } from '../objects/node';
import { SelectorModel } from '../objects/node-model';
import { Gridlines } from '../diagram/grid-lines';
import { SnapSettingsModel } from '../diagram/grid-lines-model';
import { getBounds } from './../utility/base-util';
import { SpatialSearch } from '../interaction/spatial-search/spatial-search';
import { Quad } from '../interaction/spatial-search/quad';
import { randomId } from './../utility/base-util';
import { DiagramScroller, TransformFactor } from '../interaction/scroller';
import { DiagramRenderer } from '../rendering/renderer';
import { LineAttributes, PathAttributes } from '../rendering/canvas-interface';
import { getAdornerLayerSvg } from './../utility/dom-util';
import { isSelected } from '../interaction/actions';
import { TextElement } from '../core/elements/text-element';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { Container } from '../core/containers/container';

/**
 * Snapping
 */
export class Snapping {
    private line: LineAttributes[] = [];
    private diagram: Diagram;
    private render: DiagramRenderer;

    constructor(diagram: Diagram) {
        this.diagram = diagram;
    }

    /** @private */
    public canSnap(): boolean {
        return (this.diagram.snapSettings.constraints
            & (SnapConstraints.SnapToObject | SnapConstraints.SnapToLines)) !== 0;
    }
    private getWrapperObject(selectedObject: SelectorModel, nameTable: {}): Container {
        if (selectedObject.nodes && selectedObject.nodes.length > 0
            && (this.diagram.snapSettings.constraints & SnapConstraints.SnapToLines || this.diagram.snapSettings.constraints
                & SnapConstraints.SnapToObject)) {
            for (let i: number = 0; i < selectedObject.nodes.length; i++) {
                if (((selectedObject.nodes[i].shape.type === "SwimLane" || (selectedObject.nodes[i] as Node).isLane)
                    || (selectedObject.nodes[i] as Node).parentId !== ''
                    && nameTable[((selectedObject.nodes[i] as Node).parentId)]
                    && nameTable[((selectedObject.nodes[i] as Node).parentId)].isLane) && nameTable['helper']) {
                    return nameTable['helper'].wrapper;
                } else {
                    return selectedObject.wrapper;
                }
            }
        }
        return selectedObject.wrapper;
    };
    
    public setSnapLineColor():string
    {
        return this.diagram.snapSettings.snapLineColor;
    }
    /**
     * Snap to object
     *
     * @private
     */
    public snapPoint(
        diagram: Diagram, selectedObject: SelectorModel, towardsLeft: boolean, towardsTop: boolean, delta: PointModel,
        startPoint: PointModel, endPoint: PointModel): PointModel {
        const snapSettings: SnapSettingsModel = this.diagram.snapSettings;
        const zoomFactor: number = this.diagram.scroller.currentZoom;
        const offset: PointModel = { x: 0, y: 0 };
        let wrapper: Container;
        wrapper = this.getWrapperObject(selectedObject, diagram.nameTable);
        const bounds: Rect = getBounds(wrapper);
        const horizontallysnapped: Snap = { snapped: false, offset: 0 };
        const verticallysnapped: Snap = { snapped: false, offset: 0 };
        if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToObject) {
            //let snapLine: SVGElement;
            const snapLine: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            snapLine.setAttribute('id', '_SnappingLines');
            snapLine.setAttribute('shapeRendering', 'crispEdges');
            this.getAdornerLayerSvg().appendChild(snapLine);
            this.snapObject(
                diagram, selectedObject, snapLine, horizontallysnapped, verticallysnapped, delta, startPoint === endPoint);
        }
        //original position
        const left: number = bounds.x + delta.x;
        const top: number = bounds.y + delta.y;
        const right: number = bounds.x + bounds.width + delta.x;
        const bottom: number = bounds.y + bounds.height + delta.y;
        let scaledIntervals: number[] = (snapSettings.verticalGridlines as Gridlines).scaledIntervals;
        //snapped positions
        const roundedRight: number = this.round(right, scaledIntervals, zoomFactor);
        const roundedLeft: number = this.round(left, scaledIntervals, zoomFactor);

        scaledIntervals = (snapSettings.horizontalGridlines as Gridlines).scaledIntervals;
        const roundedTop: number = this.round(top, scaledIntervals, zoomFactor);
        const roundedBottom: number = this.round(bottom, scaledIntervals, zoomFactor);
        //currentposition
        const currentright: number = bounds.x + bounds.width;
        const currentbottom: number = bounds.y + bounds.height;
        if (!horizontallysnapped.snapped) {
            if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToVerticalLines) {
                if (Math.abs(delta.x) >= 1) {
                    if (towardsLeft) {
                        if (Math.abs(roundedRight - currentright) > Math.abs(roundedLeft - bounds.x)) {
                            offset.x += roundedLeft - bounds.x;
                        } else {
                            offset.x += roundedRight - currentright;
                        }
                    } else {
                        if (Math.abs(roundedRight - currentright) < Math.abs(roundedLeft - bounds.x)) {
                            offset.x += roundedRight - currentright;
                        } else {
                            offset.x += roundedLeft - bounds.x;
                        }
                    }
                }
            } else {
                offset.x = endPoint.x - startPoint.x;
            }
        } else {
            if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToObject) {
                offset.x = horizontallysnapped.offset;
            } else {
                offset.x = endPoint.x - startPoint.x;
            }
        }
        if (!verticallysnapped.snapped) {
            if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToHorizontalLines) {
                if (Math.abs(delta.y) >= 1) {
                    if (towardsTop) {
                        if (Math.abs(roundedBottom - currentbottom) > Math.abs(roundedTop - bounds.y)) {
                            offset.y += roundedTop - bounds.y;
                        } else {
                            offset.y += roundedBottom - currentbottom;
                        }
                    } else {
                        if (Math.abs(roundedBottom - currentbottom) < Math.abs(roundedTop - bounds.y)) {
                            offset.y += roundedBottom - currentbottom;
                        } else {
                            offset.y += roundedTop - bounds.y;
                        }
                    }
                }
            } else {
                offset.y = endPoint.y - startPoint.y;
            }
        } else {
            offset.y = verticallysnapped.offset;
        }
        return offset;
    }
    /**
     * @private
     */
    public round(value: number, snapIntervals: number[], scale: number): number {
        if (scale === 1) {
            scale = Math.pow(2, Math.floor(Math.log(scale) / Math.log(2)));
        } else {
            scale = scale;
        }
        let cutoff: number = 0;
        let i: number = 0;
        for (i = 0; i < snapIntervals.length; i++) {
            cutoff += snapIntervals[i];
        }
        cutoff /= scale;
        const quotient: number = Math.floor(Math.abs(value) / cutoff);
        let bal: number = value % cutoff;
        let prev: number = quotient * cutoff;
        if (prev !== value) {
            if (value >= 0) {
                for (i = 0; i < snapIntervals.length; i++) {
                    if (bal <= snapIntervals[i] / scale) {
                        return prev + (bal < (snapIntervals[i] / (2 * scale)) ? 0 : snapIntervals[i] / scale);
                    } else {
                        prev += snapIntervals[i] / scale;
                        bal -= snapIntervals[i] / scale;
                    }
                }
            } else {
                prev = prev * -1;
                for (i = snapIntervals.length - 1; i >= 0; i--) {
                    if (Math.abs(bal) <= snapIntervals[i] / scale) {
                        return prev - (Math.abs(bal) < (snapIntervals[i] / (2 * scale)) ? 0 : snapIntervals[i] / scale);
                    } else {
                        prev -= snapIntervals[i] / scale;
                        bal += snapIntervals[i] / scale;
                    }
                }
            }
        }
        return value;
    }

    //Snap to Object
    private snapObject(
        diagram: Diagram, selectedObject: SelectorModel, g: SVGElement, horizontalSnap: Snap, verticalSnap: Snap,
        delta: PointModel, ended: boolean): void {
        let lengthX: number = null; let lengthY: number;
        let hTarget: SnapObject; let vTarget: SnapObject; const scroller: DiagramScroller = this.diagram.scroller;
        const snapSettings: SnapSettingsModel = this.diagram.snapSettings;
        const objectsAtLeft: Objects[] = []; const objectsAtRight: Objects[] = []; const objectsAtTop: Objects[] = [];
        const objectsAtBottom: Objects[] = [];
        let wrapper: Container;
        wrapper = this.getWrapperObject(selectedObject, diagram.nameTable);
        const bounds: Rect = getBounds(wrapper); const scale: number = diagram.scroller.currentZoom;
        const hoffset: number = -scroller.horizontalOffset; const voffset: number = -scroller.verticalOffset;
        const snapObjDistance: number = snapSettings.snapObjectDistance / scale;
        let viewPort: Rect = new Rect(0, 0, scroller.viewPortWidth, scroller.viewPortHeight);
        const hIntersectRect: Rect = new Rect(
            hoffset / scale, (bounds.y - snapObjDistance - 5), viewPort.width / scale, (bounds.height + 2 * snapObjDistance + 10));
        const vIntersectRect: Rect = new Rect(
            (bounds.x - snapObjDistance - 5), voffset / scale, (bounds.width + 2 * snapObjDistance + 10), viewPort.height / scale);
        viewPort = new Rect(
            hoffset / scale, voffset / scale, viewPort.width / scale, viewPort.height / scale);
        let nodes: DiagramElement[] = this.findNodes(diagram.spatialSearch, selectedObject, vIntersectRect, viewPort);
        let i: number; let target: DiagramElement; let targetBounds: Rect; const nameTable: NodeModel = diagram.nameTable;
        for (i = 0; i < nodes.length; i++) {
            target = nodes[i];
            if (this.canBeTarget(diagram, target)) {
                if (!(this.diagram.nameTable[target.id] instanceof Connector) && this.canConsider(nameTable, selectedObject, target)) {
                    targetBounds = target.bounds;
                    if (targetBounds.height + targetBounds.y < delta.y + bounds.y) {
                        objectsAtTop.push({
                            obj: target, distance: Math.abs(bounds.y + delta.y - targetBounds.y - targetBounds.height)
                        });
                    } else if (targetBounds.y > bounds.y + delta.y + bounds.height) {
                        objectsAtBottom.push({ obj: target, distance: Math.abs(bounds.y + delta.y + bounds.height - targetBounds.y) });
                    }
                    if (lengthX == null || lengthX > Math.abs(targetBounds.y - bounds.y - delta.y)) {
                        if (Math.abs(targetBounds.x + targetBounds.width / 2 - (bounds.x + bounds.width / 2 + delta.x)) <=
                            snapObjDistance) {
                            hTarget = this.createSnapObject(targetBounds, bounds, 'centerX');
                            lengthX = Math.abs(targetBounds.y - bounds.y);
                        } else if (Math.abs(targetBounds.x + targetBounds.width - (bounds.x + bounds.width + delta.x)) <= snapObjDistance) {
                            hTarget = this.createSnapObject(targetBounds, bounds, 'right');
                            lengthX = Math.abs(targetBounds.y - bounds.y);
                        } else if (Math.abs(targetBounds.x - (bounds.x + delta.x)) <= snapObjDistance) {
                            hTarget = this.createSnapObject(targetBounds, bounds, 'left');
                            lengthX = Math.abs(targetBounds.y - bounds.y);
                        } else if (Math.abs(targetBounds.x - (bounds.x + bounds.width + delta.x)) <= snapObjDistance) {
                            hTarget = this.createSnapObject(targetBounds, bounds, 'rightLeft');
                            lengthX = Math.abs(targetBounds.y - bounds.y);
                        } else if (Math.abs(targetBounds.x + targetBounds.width - (bounds.x + delta.x)) <= snapObjDistance) {
                            hTarget = this.createSnapObject(targetBounds, bounds, 'leftRight');
                            lengthX = Math.abs(targetBounds.y - bounds.y);
                        }
                    }
                }
            }
        }
        nodes = this.findNodes(diagram.spatialSearch, selectedObject, hIntersectRect, viewPort);
        for (let j: number = 0; j < nodes.length; j++) {
            target = nodes[j];
            if (this.canBeTarget(diagram, target)) {
                if (!(this.diagram.nameTable[target.id] instanceof Connector) && this.canConsider(nameTable, selectedObject, target)) {
                    targetBounds = target.bounds;
                    if (targetBounds.x + targetBounds.width < bounds.x + delta.x) {
                        objectsAtLeft[objectsAtLeft.length] = {
                            obj: target, distance: Math.abs((bounds.x + delta.x) - targetBounds.x - targetBounds.width)
                        };
                    }
                    if (targetBounds.x > bounds.x + delta.x + bounds.width) {
                        objectsAtRight[objectsAtRight.length] = {
                            obj: target, distance: Math.abs(bounds.x + delta.x + bounds.width - targetBounds.x)
                        };
                    }
                    if (lengthY == null || lengthY > Math.abs(targetBounds.x - bounds.x - delta.x)) {
                        if (Math.abs(targetBounds.y + targetBounds.height / 2 - (bounds.y + bounds.height / 2 + delta.y))
                            <= snapObjDistance) {
                            vTarget = this.createSnapObject(targetBounds, bounds, 'centerY');
                            lengthY = Math.abs(targetBounds.x - bounds.x);
                        } else if (Math.abs(targetBounds.y - bounds.y - delta.y) <= snapObjDistance) {
                            vTarget = this.createSnapObject(targetBounds, bounds, 'top');
                            lengthY = Math.abs(targetBounds.x - bounds.x);
                        } else if (Math.abs(targetBounds.y + targetBounds.height - (bounds.y + bounds.height + delta.y)) <=
                            snapObjDistance) {
                            vTarget = this.createSnapObject(targetBounds, bounds, 'bottom');
                            lengthY = Math.abs(targetBounds.x - bounds.x);
                        } else if (Math.abs(targetBounds.y + targetBounds.height - bounds.y - delta.y) <= snapObjDistance) {
                            vTarget = this.createSnapObject(targetBounds, bounds, 'topBottom');
                            lengthY = Math.abs(targetBounds.x - bounds.x);
                        } else if (Math.abs(targetBounds.y - (bounds.y + bounds.height + delta.y)) <= snapObjDistance) {
                            vTarget = this.createSnapObject(targetBounds, bounds, 'bottomTop');
                            lengthY = Math.abs(targetBounds.x - bounds.x);
                        }
                    }
                }
            }
        }
        this.createGuidelines(diagram, hTarget, vTarget, g, horizontalSnap, verticalSnap, ended);
        if (!horizontalSnap.snapped) {
            this.createHSpacingLines(
                diagram, g, selectedObject, objectsAtLeft, objectsAtRight, horizontalSnap, verticalSnap, ended, delta, snapObjDistance);
        }
        if (!verticalSnap.snapped) {
            this.createVSpacingLines(
                diagram, g, selectedObject, objectsAtTop, objectsAtBottom, horizontalSnap, verticalSnap, ended, delta, snapObjDistance);
        }
    }
    /**
     * @private
     */
    public snapConnectorEnd(point: PointModel): PointModel {
        const snapSettings: SnapSettingsModel = this.diagram.snapSettings;
        const zoomFactor: number = this.diagram.scroller.currentZoom;
        if (snapSettings.constraints & SnapConstraints.SnapToLines) {
            point.x = this.round(point.x, (snapSettings.verticalGridlines as Gridlines).scaledIntervals, zoomFactor);
            point.y = this.round(point.y, (snapSettings.horizontalGridlines as Gridlines).scaledIntervals, zoomFactor);

        }
        return point;
    }

    private canBeTarget(diagram: Diagram, node: NodeModel): boolean {
        node = this.diagram.nameTable[node.id];
        return !(isSelected(this.diagram, node, false));
    }

    private snapSize(
        diagram: Diagram, horizontalSnap: Snap, verticalSnap: Snap, snapLine: SVGElement, deltaX: number, deltaY: number,
        selectedObject: SelectorModel, ended: boolean): void {
        let lengthX: number; let lengthY: number;
        const snapSettings: SnapSettingsModel = this.diagram.snapSettings;
        const scroller: DiagramScroller = this.diagram.scroller;
        let hTarget: SnapObject; let vTarget: SnapObject;
        const bounds: Rect = getBounds(selectedObject.wrapper);
        const nameTable: NodeModel = diagram.nameTable;
        const sameWidth: SnapSize[] = []; const sameHeight: SnapSize[] = []; const scale: number = diagram.scroller.currentZoom;
        const hoffset: number = -scroller.horizontalOffset; const voffset: number = -scroller.verticalOffset;
        const snapObjDistance: number = snapSettings.snapObjectDistance / scale;
        let viewPort: Rect = new Rect(0, 0, scroller.viewPortWidth, scroller.viewPortHeight);
        const hintersectedrect: Rect = new Rect(
            hoffset / scale, (bounds.y - 5) / scale, viewPort.width / scale, (bounds.height + 10) / scale);
        const vintersectedrect: Rect = new Rect(
            (bounds.x - 5) / scale, voffset / scale, (bounds.width + 10) / scale, viewPort.height / scale);
        viewPort = new Rect(
            hoffset / scale, voffset / scale, viewPort.width / scale, viewPort.height / scale);
        const nodesInView: DiagramElement[] = [];
        let nodes: DiagramElement[] = this.findNodes(diagram.spatialSearch, selectedObject, vintersectedrect, viewPort, nodesInView);
        let i: number; let target: DiagramElement; let targetBounds: Rect;
        for (i = 0; i < nodes.length; i++) {
            target = nodes[i];
            if (this.canConsider(nameTable, selectedObject, target) && !(this.diagram.nameTable[target.id] instanceof Connector)) {
                targetBounds = target.bounds;
                if (lengthX == null || lengthX > Math.abs(targetBounds.y - bounds.y)) {
                    if (horizontalSnap.left) {
                        if (Math.abs(bounds.x + deltaX - targetBounds.x) <= snapObjDistance) {
                            hTarget = this.createSnapObject(targetBounds, bounds, 'left');
                            lengthX = Math.abs(targetBounds.y - bounds.y);
                        } else if (Math.abs(bounds.x + deltaX - targetBounds.x - targetBounds.width) <= snapObjDistance) {
                            hTarget = this.createSnapObject(targetBounds, bounds, 'leftRight');
                            lengthX = Math.abs(targetBounds.y - bounds.y);
                        }
                    } else if (horizontalSnap.right) {
                        if (Math.abs(bounds.x + deltaX + bounds.width - targetBounds.x - targetBounds.width) <= snapObjDistance) {
                            hTarget = this.createSnapObject(targetBounds, bounds, 'right');
                            lengthX = Math.abs(targetBounds.y - bounds.y);
                        } else if (Math.abs(bounds.x + deltaX + bounds.width - targetBounds.x) <= snapObjDistance) {
                            hTarget = this.createSnapObject(targetBounds, bounds, 'rightLeft');
                            lengthX = Math.abs(targetBounds.y - bounds.y);
                        }
                    }
                }
            }
        }
        nodes = this.findNodes(diagram.spatialSearch, selectedObject, hintersectedrect, viewPort);
        for (let i: number = 0; i < nodes.length; i++) {
            const target: DiagramElement = nodes[i];
            if (this.canConsider(nameTable, selectedObject, target) && !(this.diagram.nameTable[target.id] instanceof Connector)) {
                const targetBounds: Rect = target.bounds;
                if (lengthY == null || lengthY > Math.abs(targetBounds.x - bounds.x)) {
                    if (verticalSnap.top) {
                        if (Math.abs(bounds.y + deltaY - targetBounds.y) <= snapObjDistance) {
                            vTarget = this.createSnapObject(targetBounds, bounds, 'top');
                            lengthY = Math.abs(targetBounds.x - bounds.x);
                        } else if (Math.abs(bounds.y + deltaY - targetBounds.y - targetBounds.height) <= snapObjDistance) {
                            vTarget = this.createSnapObject(targetBounds, bounds, 'topBottom');
                            lengthY = Math.abs(targetBounds.x - bounds.x);
                        }
                    } else if (verticalSnap.bottom) {
                        if (Math.abs(bounds.y + bounds.height + deltaY - targetBounds.y - targetBounds.height) <= snapObjDistance) {
                            vTarget = this.createSnapObject(targetBounds, bounds, 'bottom');
                            lengthY = Math.abs(targetBounds.x - bounds.x);
                        } else if (Math.abs(bounds.y + bounds.height + deltaY - targetBounds.y) <= snapObjDistance) {
                            vTarget = this.createSnapObject(targetBounds, bounds, 'bottomTop');
                            lengthY = Math.abs(targetBounds.x - bounds.x);
                        }
                    }
                }
            }
        }
        for (i = 0; i < nodesInView.length; i++) {
            target = nodesInView[i];
            if (this.canConsider(nameTable, selectedObject, target)) {
                const targetBounds: Rect = target.bounds;
                let delta: number = horizontalSnap.left ? -deltaX : deltaX;
                const difference: number = Math.abs(bounds.width + delta - targetBounds.width);
                let actualDiff: number;
                if (difference <= snapObjDistance) {
                    actualDiff = horizontalSnap.left ? -targetBounds.width + bounds.width : targetBounds.width - bounds.width;
                    sameWidth[sameWidth.length] = { source: target, difference: difference, offset: actualDiff };
                }
                delta = verticalSnap.top ? -deltaY : deltaY;
                const dify: number = Math.abs(bounds.height + delta - targetBounds.height);
                if (dify <= snapObjDistance) {
                    actualDiff = verticalSnap.top ? -targetBounds.height + bounds.height : targetBounds.height - bounds.height;
                    sameHeight[sameHeight.length] = { source: target, difference: dify, offset: actualDiff };
                }
            }
        }
        let g: SVGElement;
        if (!diagram.getTool) {
            const g: SVGElement = this.createGuidelines(diagram, hTarget, vTarget, snapLine, horizontalSnap, verticalSnap, ended);
        }
        if (!horizontalSnap.snapped && sameWidth.length > 0 && (horizontalSnap.left || horizontalSnap.right)) {
            this.addSameWidthLines(diagram, snapLine, sameWidth, horizontalSnap, ended, selectedObject);
        }
        if (!verticalSnap.snapped && sameHeight.length > 0 && (verticalSnap.top || verticalSnap.bottom)) {
            this.addSameHeightLines(diagram, snapLine, sameHeight, verticalSnap, ended, selectedObject);
        }
    }
    /**
     * Snap to object on top
     *
     * @private
     */
    public snapTop(
        horizontalSnap: Snap, verticalSnap: Snap, snapLine: SVGElement, deltaX: number, deltaY: number,
        shape: SelectorModel, ended: boolean, initialBoundsT: Rect): number {
        let dify: number = deltaY;
        verticalSnap.top = true;
        let y: number;
        horizontalSnap.left = horizontalSnap.right = false;
        const zoomFactor: number = this.diagram.scroller.currentZoom;
        //let initialBoundsT: Rect = new Rect(shape.offsetX, shape.offsetY, shape.width, shape.height);
        if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToObject && !shape.rotateAngle) {
            //(!this.selectedObject.isLane && !this.selectedObject.isSwimlane)) {
            y = initialBoundsT.y - initialBoundsT.height * shape.pivot.y + deltaY - (shape.offsetY - shape.height * shape.pivot.y);
            this.snapSize(this.diagram, horizontalSnap, verticalSnap, snapLine, deltaX, y, this.diagram.selectedItems, ended);
        }
        if (!verticalSnap.snapped) {
            if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToHorizontalLines) {
                const top: number = initialBoundsT.y - initialBoundsT.height * shape.pivot.y;
                const actualTop: number = top + deltaY;
                const roundedTop: number = this.round(
                    actualTop, (this.diagram.snapSettings.horizontalGridlines as Gridlines).scaledIntervals, zoomFactor);
                dify = roundedTop - top;
            }
        } else {
            dify = (deltaY - y) + verticalSnap.offset;
        }
        return dify;
    }
    /**
     * Snap to object on right
     *
     * @private
     */
    public snapRight(
        horizontalSnap: Snap, verticalSnap: Snap, snapLine: SVGElement, deltaX: number, deltaY: number,
        shape: SelectorModel, ended: boolean, initialBound: Rect): number {
        let difx: number = deltaX;
        let x: number;
        horizontalSnap.right = true;
        verticalSnap.top = verticalSnap.bottom = false;
        const zoomFactor: number = this.diagram.scroller.currentZoom;
        //let initialBound: Rect = new Rect(shape.offsetX, shape.offsetY, shape.width, shape.height);
        if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToObject && !shape.rotateAngle) {
            //(!this.selectedObject.isLane && !this.selectedObject.isSwimlane)) {
            x = initialBound.x + initialBound.width * (1 - shape.pivot.x) + deltaX - (shape.offsetX + shape.width * (1 - shape.pivot.x));
            this.snapSize(this.diagram, horizontalSnap, verticalSnap, snapLine, x, deltaY, this.diagram.selectedItems, ended);
        }
        if (!horizontalSnap.snapped) {
            if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToVerticalLines) {
                const right: number = initialBound.x + initialBound.width * (1 - shape.pivot.x);
                const actualRight: number = right + deltaX;
                const roundedRight: number = this.round(
                    actualRight, (this.diagram.snapSettings.verticalGridlines as Gridlines).scaledIntervals, zoomFactor);
                difx = roundedRight - right;
            }
        } else {
            difx = (deltaX - x) + horizontalSnap.offset;
        }
        return difx;
    }
    /**
     * Snap to object on left
     *
     * @private
     */
    public snapLeft(
        horizontalSnap: Snap, verticalSnap: Snap, snapLine: SVGElement, deltaX: number, deltaY: number,
        shape: SelectorModel, ended: boolean, initialBoundsB: Rect): number {
        let difx: number = deltaX;
        let x: number = 0;
        horizontalSnap.left = true;
        verticalSnap.top = verticalSnap.bottom = false;
        const zoomFactor: number = this.diagram.scroller.currentZoom;
        //let initialBoundsB: Rect = new Rect(shape.offsetX, shape.offsetY, shape.width, shape.height);
        if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToObject && !shape.rotateAngle) {
            //(!this.selectedObject.isLane && !this.selectedObject.isSwimlane)) {
            x = initialBoundsB.x - initialBoundsB.width * shape.pivot.x + deltaX - (shape.offsetX - shape.width * shape.pivot.x);
            this.snapSize(this.diagram, horizontalSnap, verticalSnap, snapLine, x, deltaY, this.diagram.selectedItems, ended);
        }
        if (!horizontalSnap.snapped) {
            if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToVerticalLines) {
                const left: number = initialBoundsB.x - initialBoundsB.width * shape.pivot.x;
                const actualLeft: number = left + deltaX;
                const roundedLeft: number = this.round(
                    actualLeft, (this.diagram.snapSettings.horizontalGridlines as Gridlines).scaledIntervals, zoomFactor);
                difx = roundedLeft - left;
            }
        } else {
            difx = (deltaX - x) + horizontalSnap.offset;
        }
        return difx;
    }
    /**
     * Snap to object on bottom
     *
     * @private
     */
    public snapBottom(
        horizontalSnap: Snap, verticalSnap: Snap, snapLine: SVGElement, deltaX: number, deltaY: number,
        shape: SelectorModel | DiagramElement, ended: boolean, initialRect: Rect): number {
        let dify: number = deltaY;
        verticalSnap.bottom = true;
        horizontalSnap.left = horizontalSnap.right = false;
        const zoomFactor: number = this.diagram.scroller.currentZoom;
        let y: number = 0;
        //let initialRect: Rect = new Rect(shape.offsetX, shape.offsetY, shape.width, shape.height);
        if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToObject && !shape.rotateAngle) {
            //(!this.selectedObject.isLane && !this.selectedObject.isSwimlane)) {
            y = initialRect.y + initialRect.height * (1 - shape.pivot.y) + deltaY - (shape.offsetY + shape.height * (1 - shape.pivot.y));
            this.snapSize(this.diagram, horizontalSnap, verticalSnap, snapLine, deltaX, y, this.diagram.selectedItems, ended);
        }
        // eslint-disable-next-line max-len
        const bounds: Rect = ((shape instanceof TextElement) || (shape instanceof DiagramHtmlElement)) ? getBounds(shape as DiagramElement) :
            getBounds((shape as SelectorModel).wrapper);
        if (!verticalSnap.snapped) {
            if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToHorizontalLines) {
                const bottom: number = initialRect.y + initialRect.height * (1 - shape.pivot.y);
                const actualBottom: number = bottom + deltaY;
                const roundedBottom: number = this.round(
                    actualBottom, (this.diagram.snapSettings.horizontalGridlines as Gridlines).scaledIntervals, zoomFactor);
                dify = roundedBottom - bottom;
            }
        } else {
            dify = (deltaY - y) + verticalSnap.offset;
        }
        return dify;
    }

    //To create the same width and same size lines
    private createGuidelines(
        diagram: Diagram, hTarget: SnapObject, vTarget: SnapObject, snapLine: SVGElement,
        horizontalSnap: Snap, verticalSnap: Snap, ended: boolean): SVGElement {
        if (hTarget) {
            horizontalSnap.offset = hTarget.offsetX;
            horizontalSnap.snapped = true;
            if (!ended) {
                if (hTarget.type === 'sideAlign') {
                    this.renderAlignmentLines(hTarget.start, hTarget.end, snapLine, diagram.scroller.transform);
                } else {
                    this.renderAlignmentLines(hTarget.start, hTarget.end, snapLine, diagram.scroller.transform);
                }
            }
        }
        if (vTarget) {
            verticalSnap.offset = vTarget.offsetY;
            verticalSnap.snapped = true;
            if (!ended) {
                if (vTarget.type === 'sideAlign') {
                    this.renderAlignmentLines(vTarget.start, vTarget.end, snapLine, diagram.scroller.transform);
                } else {
                    this.renderAlignmentLines(vTarget.start, vTarget.end, snapLine, diagram.scroller.transform);
                }
            }
        }
        return snapLine;
    }
    //To create the alignment lines
    private renderAlignmentLines(
        start: PointModel, end: PointModel, svg: SVGElement, transform: TransformFactor): void {
        start = {
            x: (start.x + transform.tx) * transform.scale,
            y: (start.y + transform.ty) * transform.scale
        };
        end = {
            x: (end.x + transform.tx) * transform.scale,
            y: (end.y + transform.ty) * transform.scale
        };
        const line1: LineAttributes = {
            stroke:this.setSnapLineColor(), strokeWidth: 1, startPoint: { x: start.x, y: start.y },
            endPoint: { x: end.x, y: end.y }, fill:this.setSnapLineColor(), dashArray: '', width: 1,
            x: 0, y: 0, height: 0, angle: 0, pivotX: 0,
            pivotY: 0, visible: true, opacity: 1, id: randomId()
        };
        let i: number = 0;
        this.line.push(line1);
        for (i = 0; i < this.line.length; i++) {
            this.diagram.diagramRenderer.drawLine(svg, this.line.pop());
        }
    }

    //To create Horizontal spacing lines
    private createHSpacingLines(
        diagram: Diagram, g: SVGElement, shape: SelectorModel, objectsAtLeft: Objects[], objectsAtRight: Objects[],
        horizontalSnap: Snap, verticalSnap: Snap, ended: boolean, delta: PointModel,
        snapObjDistance: number): void {
        let top: number = 0;
        this.sortByDistance(objectsAtLeft, 'distance', true);
        this.sortByDistance(objectsAtRight, 'distance', true);
        const equallySpaced: Objects[] = [];
        let bounds: Rect;
        if (diagram.selectedObject.helperObject) {
            bounds = getBounds(diagram.selectedObject.helperObject.wrapper);
        } else {
            bounds = getBounds(shape.wrapper);
        }
        let nearestleft: Rect; let nearestright: Rect;
        let targetBounds: Rect;
        let equaldistance: number;
        if (objectsAtLeft.length > 0) {
            equallySpaced[equallySpaced.length] = objectsAtLeft[0];
            nearestleft = ((objectsAtLeft[0].obj).bounds);
            top = nearestleft.y;
            if (objectsAtLeft.length > 1) {
                targetBounds = ((objectsAtLeft[1].obj).bounds);
                equaldistance = nearestleft.x - targetBounds.x - targetBounds.width;
                if (Math.abs(equaldistance - objectsAtLeft[0].distance) <= snapObjDistance) {
                    top = this.findEquallySpacedNodesAtLeft(objectsAtLeft, equaldistance, top, equallySpaced);

                } else {
                    equaldistance = objectsAtLeft[0].distance;
                }
            } else {
                equaldistance = objectsAtLeft[0].distance;
            }
        }
        this.sortByDistance(equallySpaced, 'distance');
        equallySpaced[equallySpaced.length] = { obj: shape as DiagramElement, distance: 0 };
        top = bounds.y < top || !top ? bounds.y : top;
        if (objectsAtRight.length > 0) {
            let dist: number;
            nearestright = ((objectsAtRight[0].obj).bounds);
            top = nearestright.y < top ? nearestright.y : top;
            if (objectsAtRight.length > 1) {
                targetBounds = ((objectsAtRight[1].obj).bounds);
                dist = targetBounds.x - nearestright.x - nearestright.width;
            }
            if (objectsAtLeft.length > 0) {
                if (Math.abs(objectsAtRight[0].distance - objectsAtLeft[0].distance) <= snapObjDistance) {
                    const adjustablevalue: number = Math.abs(objectsAtRight[0].distance - objectsAtLeft[0].distance) / 2;
                    (objectsAtRight[0].distance < objectsAtLeft[0].distance) ?
                        equaldistance -= adjustablevalue : equaldistance += adjustablevalue;
                    equallySpaced[equallySpaced.length] = objectsAtRight[0];
                } else if (objectsAtLeft.length === 1) {
                    nearestleft = undefined;
                    equallySpaced.splice(0, 1);
                    equallySpaced[equallySpaced.length] = objectsAtRight[0];
                    equaldistance = dist;
                }
            } else {
                equaldistance = dist;
                equallySpaced[equallySpaced.length] = objectsAtRight[0];
            }
            if (objectsAtRight.length > 1 && nearestright.x + nearestright.width < targetBounds.x) {
                top = this.findEquallySpacedNodesAtRight(objectsAtRight, dist, top, equallySpaced, snapObjDistance);
            }
        }
        if (equallySpaced.length > 2) {
            this.addHSpacingLines(diagram, g, equallySpaced, ended, top);
            let deltaHorizontal: number = 0;
            if (ended) {
                deltaHorizontal = delta.x;
            }
            if (nearestleft) {
                horizontalSnap.offset = equaldistance - Math.abs(bounds.x + deltaHorizontal - nearestleft.x - nearestleft.width)
                    + deltaHorizontal;
            } else if (nearestright) {
                horizontalSnap.offset = Math.abs(bounds.x + bounds.width + deltaHorizontal - nearestright.x)
                    - equaldistance + deltaHorizontal;
            }
            horizontalSnap.snapped = true;
        }
    }
    //To create vertical spacing lines
    private createVSpacingLines(
        diagram: Diagram, g: SVGElement, shape: SelectorModel, objectsAtTop: Objects[], objectsAtBottom: Objects[],
        horizontalSnap: Snap, verticalSnap: Snap, ended: boolean, delta: PointModel,
        snapObjDistance: number): void {
        let right: number = 0;
        this.sortByDistance(objectsAtTop, 'distance', true);
        this.sortByDistance(objectsAtBottom, 'distance', true);
        const equallySpaced: Objects[] = [];
        let wrapper: Container;
        wrapper = this.getWrapperObject(shape, diagram.nameTable);
        const bounds: Rect = getBounds(wrapper);
        let nearesttop: Rect; let nearestbottom: Rect;
        let targetBounds: Rect;
        let equaldistance: number;
        if (objectsAtTop.length > 0) {
            equallySpaced[equallySpaced.length] = objectsAtTop[0];
            nearesttop = ((objectsAtTop[0].obj).bounds);
            right = nearesttop.x + nearesttop.width;
            if (objectsAtTop.length > 1) {
                targetBounds = ((objectsAtTop[1].obj).bounds);
                equaldistance = nearesttop.y - targetBounds.y - targetBounds.height;
                if (Math.abs(equaldistance - objectsAtTop[0].distance) <= snapObjDistance) {
                    right = this.findEquallySpacedNodesAtTop(objectsAtTop, equaldistance, right, equallySpaced);
                } else {
                    equaldistance = objectsAtTop[0].distance;
                }
            } else {
                equaldistance = objectsAtTop[0].distance;
            }
        }
        this.sortByDistance(equallySpaced, 'distance');
        equallySpaced[equallySpaced.length] = { obj: shape as DiagramElement, distance: 0 };
        right = bounds.x + bounds.width > right || !right ? bounds.x + bounds.width : right;
        let dist: number;
        if (objectsAtBottom.length > 0) {
            nearestbottom = ((objectsAtBottom[0].obj).bounds);
            right = nearestbottom.x + nearestbottom.width > right ? nearestbottom.x + nearestbottom.width : right;
            if (objectsAtBottom.length > 1) {
                targetBounds = ((objectsAtBottom[1].obj).bounds);
                dist = targetBounds.y - nearestbottom.y - nearestbottom.height;
            }

            if (objectsAtTop.length > 0) {
                if (Math.abs(objectsAtBottom[0].distance - objectsAtTop[0].distance) <= snapObjDistance) {
                    const adjustablevalue: number = Math.abs(objectsAtBottom[0].distance - objectsAtTop[0].distance) / 2;
                    (objectsAtBottom[0].distance < objectsAtTop[0].distance) ?
                        equaldistance -= adjustablevalue : equaldistance += adjustablevalue;
                    equallySpaced[equallySpaced.length] = objectsAtBottom[0];
                } else if (objectsAtTop.length === 1) {
                    nearesttop = undefined;
                    equallySpaced.splice(0, 1);
                    equallySpaced[equallySpaced.length] = objectsAtBottom[0];
                    equaldistance = dist;
                }
            } else {
                equaldistance = dist;
                equallySpaced[equallySpaced.length] = objectsAtBottom[0];
            }
            if (objectsAtBottom.length > 1 && targetBounds.y > nearestbottom.y + nearestbottom.height) {
                right = this.findEquallySpacedNodesAtBottom(objectsAtBottom, dist, right, equallySpaced, snapObjDistance);
            }

        }
        if (equallySpaced.length > 2) {
            this.addVSpacingLines(diagram, g, equallySpaced, ended, right);
            let deltaVertical: number = 0;
            if (ended) {
                deltaVertical = delta.y;
            }
            if (nearesttop) {
                verticalSnap.offset = equaldistance - Math.abs(bounds.y + deltaVertical - nearesttop.y - nearesttop.height) + deltaVertical;
            } else if (nearestbottom) {
                verticalSnap.offset = Math.abs(bounds.y + bounds.height + deltaVertical - nearestbottom.y) - equaldistance + deltaVertical;
            }
            verticalSnap.snapped = true;
        }
    }
    //Add the Horizontal spacing lines
    private addHSpacingLines(diagram: Diagram, g: SVGElement, equallySpaced: Objects[], ended: boolean, top: number): void {
        let i: number;
        let start: PointModel;
        let end: PointModel;
        if (!ended) {
            for (i = 0; i < equallySpaced.length - 1; i++) {
                const crnt: Rect = equallySpaced[i].obj instanceof Selector ?
                    getBounds(((equallySpaced[i].obj) as SelectorModel).wrapper) : ((equallySpaced[i].obj).bounds);
                const next: Rect = equallySpaced[i + 1].obj instanceof Selector ?
                    getBounds(((equallySpaced[i + 1].obj) as SelectorModel).wrapper) : ((equallySpaced[i + 1].obj).bounds);
                start = { x: crnt.x + crnt.width, y: top - 15 };
                end = { x: next.x, y: top - 15 };
                this.renderSpacingLines(
                    start, end, g, this.getAdornerLayerSvg(), diagram.scroller.transform);
            }
        }
    }
    //Add the vertical spacing lines
    private addVSpacingLines(diagram: Diagram, g: SVGElement, equallySpacedObjects: Objects[], ended: boolean, right: number): void {
        let start: PointModel;
        let end: PointModel;
        if (!ended) {
            for (let i: number = 0; i < equallySpacedObjects.length - 1; i++) {
                const crnt: Rect = equallySpacedObjects[i].obj instanceof Selector ?
                    getBounds(((equallySpacedObjects[i].obj) as SelectorModel).wrapper) : ((equallySpacedObjects[i].obj).bounds);
                const next: Rect = equallySpacedObjects[i + 1].obj instanceof Selector ?
                    getBounds(((equallySpacedObjects[i + 1].obj) as SelectorModel).wrapper) :
                    ((equallySpacedObjects[i + 1].obj).bounds);
                start = { x: right + 15, y: crnt.y + crnt.height };
                end = { x: right + 15, y: next.y };
                this.renderSpacingLines(
                    start, end, g, this.getAdornerLayerSvg(), diagram.scroller.transform);
            }
        }
    }
    //To add same width lines
    private addSameWidthLines(
        diagram: Diagram, snapLine: SVGElement, sameWidths: SnapSize[], horizontalSnap: Snap, ended: boolean,
        shape: SelectorModel): void {
        this.sortByDistance(sameWidths, 'offset');
        let bounds: Rect = getBounds(shape.wrapper);
        const target: SnapSize = sameWidths[0];
        let startPt: PointModel;
        let endPt: PointModel;
        const targetBounds: Rect = ((target.source) as DiagramElement).bounds;
        const sameSizes: SnapSize[] = [];
        sameSizes.push(sameWidths[0]);
        let i: number; let crntbounds: Rect;
        for (i = 1; i < sameWidths.length; i++) {
            crntbounds = ((sameWidths[i].source) as DiagramElement).bounds;
            if (crntbounds.width === targetBounds.width) {
                sameSizes.push(sameWidths[i]);
            }
        }
        if (!ended) {
            startPt = { x: bounds.x + target.offset, y: bounds.y - 15 };
            endPt = { x: bounds.x + bounds.width + target.offset, y: bounds.y - 15 };
            this.renderSpacingLines(
                startPt, endPt, snapLine, this.getAdornerLayerSvg(), diagram.scroller.transform);
            for (i = 0; i < sameSizes.length; i++) {
                bounds = ((sameSizes[i].source) as DiagramElement).bounds;
                startPt = { x: bounds.x, y: bounds.y - 15 };
                endPt = { x: bounds.x + bounds.width, y: bounds.y - 15 };
                this.renderSpacingLines(
                    startPt, endPt, snapLine, this.getAdornerLayerSvg(), diagram.scroller.transform);
            }
        }
        horizontalSnap.offset = target.offset;
        horizontalSnap.snapped = true;

    }
    //To add same height lines
    private addSameHeightLines(
        diagram: Diagram, snapLine: SVGElement, sameHeights: SnapSize[], verticalSnap: Snap, ended: boolean,
        shape: SelectorModel): void {
        this.sortByDistance(sameHeights, 'offset');
        let bounds: Rect = getBounds(shape.wrapper);
        const target: SnapSize = sameHeights[0];
        const targetBounds: Rect = ((target.source) as DiagramElement).bounds;
        let start: PointModel;
        let end: PointModel;
        const sameSizes: SnapSize[] = [];
        sameSizes.push(sameHeights[0]);
        let i: number;
        let crntbounds: Rect;
        for (i = 0; i < sameHeights.length; i++) {
            crntbounds = ((sameHeights[i].source) as DiagramElement).bounds;
            if (crntbounds.height === targetBounds.height) {
                sameSizes.push(sameHeights[i]);
            }
        }
        if (!ended) {
            start = { x: bounds.x + bounds.width + 15, y: bounds.y + target.offset };
            end = { x: bounds.x + bounds.width + 15, y: bounds.y + target.offset + bounds.height };
            this.renderSpacingLines(
                start, end, snapLine, this.getAdornerLayerSvg(), diagram.scroller.transform);
            for (i = 0; i < sameSizes.length; i++) {
                bounds = ((sameSizes[i].source) as DiagramElement).bounds;
                start = { x: bounds.x + bounds.width + 15, y: bounds.y };
                end = { x: bounds.x + bounds.width + 15, y: bounds.y + bounds.height };
                this.renderSpacingLines(
                    start, end, snapLine, this.getAdornerLayerSvg(), diagram.scroller.transform);
            }
        }
        verticalSnap.offset = target.offset;
        verticalSnap.snapped = true;
    }

    //Render spacing lines
    private renderSpacingLines(
        start: PointModel, end: PointModel, snapLine: SVGElement, svg: HTMLCanvasElement | SVGElement,
        transform: TransformFactor): void {
        let d: string;
        let d1: string;
        let line1: LineAttributes;
        const element: PathElement = new PathElement();
        const options: PathAttributes = {} as PathAttributes;
        start = {
            x: (start.x + transform.tx) * transform.scale,
            y: (start.y + transform.ty) * transform.scale
        };
        end = {
            x: (end.x + transform.tx) * transform.scale,
            y: (end.y + transform.ty) * transform.scale
        };
        if (start.x === end.x) {
            d = 'M' + (start.x - 5) + ' ' + (start.y + 5) + 'L' + start.x + ' ' + start.y +
                'L' + (start.x + 5) + ' ' + (start.y + 5) + 'z' + 'M' + (end.x - 5) + ' ' +
                (end.y - 5) + ' L' + end.x + ' ' + end.y + ' L' +
                (end.x + 5) + ' ' + (end.y - 5) + 'z';
            line1 = {
                startPoint: { x: start.x - 8, y: start.y - 1 },
                endPoint: { x: start.x + 8, y: start.y - 1 },
                stroke: this.setSnapLineColor(),
                strokeWidth: 1, fill: this.setSnapLineColor(), dashArray: '', width: 1, x: 0, y: 0, height: 0, angle: 0, pivotX: 0,
                pivotY: 0, visible: true, opacity: 1, id: randomId()
            };
            element.data = d;
            options.data = element.data;
            options.angle = 0;
            options.pivotX = 0;
            options.pivotY = 0;
            options.x = 0;
            options.y = 0;
            options.height = 0;
            options.width = 1;
            options.id = randomId();
            this.diagram.diagramRenderer.drawPath(snapLine, options as PathAttributes);
            this.line.push(line1);
            this.diagram.diagramRenderer.drawLine(snapLine, this.line.pop());
            line1 = {
                startPoint: { x: end.x - 8, y: end.y + 1 },
                endPoint: { x: end.x + 8, y: end.y + 1 },
                stroke:this.setSnapLineColor(),
                strokeWidth: 1, fill: this.setSnapLineColor(), dashArray: '', width: 1, x: 0, y: 0, height: 0, angle: 0, pivotX: 0,
                pivotY: 0, visible: true, opacity: 1, id: this.getAdornerLayerSvg().id + 'spacing'
            };
            this.line.push(line1);
            this.diagram.diagramRenderer.drawLine(snapLine, this.line.pop());
        } else {
            d = 'M' + (start.x + 5) + ' ' + (start.y + 5) + ' L' + start.x + ' ' + start.y +
                ' L' + (start.x + 5) + ' ' + (start.y - 5) + 'z' + 'M' + (end.x - 5) + ' ' +
                (end.y - 5) + ' L' + end.x + ' ' + end.y +
                ' L' + (end.x - 5) + ' ' + (end.y + 5) + 'z';
            element.data = d;
            options.data = d;
            options.angle = 0;
            options.pivotX = 0;
            options.pivotY = 0;
            options.x = 0;
            options.y = 0;
            options.height = 0;
            options.width = 1;
            options.id = randomId();
            this.diagram.diagramRenderer.drawPath(snapLine, options);
            line1 = {
                visible: true, opacity: 1, id: randomId(),
                startPoint: { x: start.x - 1, y: start.y - 8 },
                endPoint: { x: start.x - 1, y: start.y + 8 },
                stroke: this.setSnapLineColor(),
                strokeWidth: 1, fill: this.setSnapLineColor(), dashArray: '0', width: 1, x: 0, y: 0, height: 0, angle: 0, pivotX: 0,
                pivotY: 0
            };
            this.line.push(line1);
            this.diagram.diagramRenderer.drawLine(snapLine, this.line.pop());
            line1 = {
                width: 1, x: 0, y: 0, height: 0, angle: 0, pivotX: 0,
                pivotY: 0, visible: true, opacity: 1, id: randomId(),
                startPoint: { x: end.x + 1, y: end.y - 8 },
                endPoint: { x: end.x + 1, y: end.y + 8 },
                stroke: this.setSnapLineColor(),
                strokeWidth: 1, fill: this.setSnapLineColor(), dashArray: '0'
            };
            this.line.push(line1);
            this.diagram.diagramRenderer.drawLine(snapLine, this.line.pop());
        }
        line1 = {
            startPoint: { x: start.x, y: start.y },
            endPoint: { x: end.x, y: end.y }, stroke: this.setSnapLineColor(), strokeWidth: 1, fill:this.setSnapLineColor(),
            dashArray: '0', width: 1, x: 0, y: 0, height: 0, angle: 0, pivotX: 0,
            pivotY: 0, visible: true, opacity: 1, id: randomId()
        };
        this.line.push(line1);
        this.diagram.diagramRenderer.drawLine(snapLine, this.line.pop());
    }

    /**
     * To Create Snap object with position, initial bounds, and final bounds \
     *
     * @returns {  void }  To Create Snap object with position, initial bounds, and final bounds .\
     * @param {Diagram} targetBounds - provide the targetBounds value.
     * @param {Rect} bounds - provide the angle value.
     * @param {string} snap - provide the angle value.
     * @private
     */
    public createSnapObject(targetBounds: Rect, bounds: Rect, snap: string): SnapObject {
        let snapObject: SnapObject;
        switch (snap) {
        case 'left':
            snapObject = {
                start: { x: (targetBounds.x), y: Math.min(targetBounds.y, bounds.y) },
                end: { x: (targetBounds.x), y: Math.max(targetBounds.y + targetBounds.height, bounds.y + bounds.height) },
                offsetX: targetBounds.x - bounds.x, offsetY: 0, type: 'sideAlign'
            };
            break;
        case 'right':
            snapObject = {
                type: 'sideAlign',
                start: { x: (targetBounds.x + targetBounds.width), y: Math.min(targetBounds.y, bounds.y) },
                offsetX: targetBounds.x + targetBounds.width - bounds.x - bounds.width,
                offsetY: 0,
                end: {
                    x: (targetBounds.x + targetBounds.width),
                    y: Math.max(targetBounds.y + targetBounds.height, bounds.y + bounds.height)
                }
            };
            break;
        case 'top':
            snapObject = {
                offsetY: targetBounds.y - bounds.y, offsetX: 0, type: 'sideAlign',
                start: { x: (Math.min(targetBounds.x, bounds.x)), y: targetBounds.y },
                end: { x: (Math.max(targetBounds.x + targetBounds.width, bounds.x + bounds.width)), y: targetBounds.y }
            };
            break;
        case 'bottom':
            snapObject = {
                type: 'sideAlign', offsetY: targetBounds.y + targetBounds.height - bounds.y - bounds.height, offsetX: 0,
                end: {
                    x: (Math.max(targetBounds.x + targetBounds.width, bounds.x + bounds.width)),
                    y: targetBounds.y + targetBounds.height
                },
                start: { x: (Math.min(targetBounds.x, bounds.x)), y: targetBounds.y + targetBounds.height }
            };
            break;
        case 'topBottom':
            snapObject = {
                start: { x: (Math.min(targetBounds.x, bounds.x)), y: targetBounds.y + targetBounds.height },
                end: {
                    x: (Math.max(targetBounds.x + targetBounds.width, bounds.x + bounds.width)),
                    y: targetBounds.y + targetBounds.height
                },
                offsetY: targetBounds.y + targetBounds.height - bounds.y, offsetX: 0, type: 'sideAlign'
            };
            break;
        case 'bottomTop':
            snapObject = {
                start: { x: (Math.min(targetBounds.x, bounds.x)), y: targetBounds.y },
                end: { x: (Math.max(targetBounds.x + targetBounds.width, bounds.x + bounds.width)), y: targetBounds.y },
                offsetY: targetBounds.y - bounds.y - bounds.height, offsetX: 0, type: 'sideAlign'
            };
            break;
        case 'leftRight':
            snapObject = {
                start: { x: (targetBounds.x + targetBounds.width), y: Math.min(targetBounds.y, bounds.y) },
                end: {
                    x: (targetBounds.x + targetBounds.width),
                    y: Math.max(targetBounds.y + targetBounds.height, bounds.y + bounds.height)
                },
                offsetX: targetBounds.x + targetBounds.width - bounds.x, offsetY: 0, type: 'sideAlign'
            };
            break;
        case 'rightLeft':
            snapObject = {
                start: { x: (targetBounds.x), y: (Math.min(targetBounds.y, bounds.y)) },
                end: { x: (targetBounds.x), y: Math.max(targetBounds.y + targetBounds.height, bounds.y + bounds.height) },
                offsetX: targetBounds.x - bounds.x - bounds.width, offsetY: 0, type: 'sideAlign'
            };
            break;
        case 'centerX':
            snapObject = {
                start: { x: (targetBounds.x + targetBounds.width / 2), y: (Math.min(targetBounds.y, bounds.y)) },
                end: {
                    x: (targetBounds.x + targetBounds.width / 2),
                    y: Math.max(targetBounds.y + targetBounds.height, bounds.y + bounds.height)
                },
                offsetX: targetBounds.x + targetBounds.width / 2 - (bounds.x + bounds.width / 2), offsetY: 0, type: 'centerAlign'
            };
            break;
        case 'centerY':
            snapObject = {
                start: { x: (Math.min(targetBounds.x, bounds.x)), y: targetBounds.y + targetBounds.height / 2 },
                end: {
                    x: (Math.max(targetBounds.x + targetBounds.width, bounds.x + bounds.width)),
                    y: targetBounds.y + targetBounds.height / 2
                },
                offsetY: targetBounds.y + targetBounds.height / 2 - (bounds.y + bounds.height / 2), offsetX: 0, type: 'centerAlign'
            };
            break;
        }
        return snapObject;
    }

    /**
     *  Calculate the snap angle \
     *
     * @returns {  void }  Calculate the snap angle .\
     * @param {Diagram} diagram - provide the diagram value.
     * @param {number} angle - provide the angle value.
     * @private
     */
    public snapAngle(diagram: Diagram, angle: number): number {
        const snapSettings: SnapSettingsModel = this.diagram.snapSettings;
        const snapAngle: number = snapSettings.snapAngle;
        const width: number = angle % (snapAngle || 0);
        if (width >= (snapAngle / 2)) {
            return angle + snapAngle - width;
        } else {
            return angle - width;
        }
    }

    //Check whether the node to be snapped or not.
    private canConsider(nameTable: NodeModel, selectedObject: SelectorModel, target: DiagramElement): boolean {
        const consider: boolean = false;
        if (this.diagram.selectedItems.nodes.length && this.diagram.selectedItems.nodes[0].id === (target as NodeModel).id) {
            return false;
        } else {
            return true;
        }
    }

    //Find the total number of nodes in diagram using SpatialSearch
    private findNodes(
        spatialSearch: SpatialSearch, node: SelectorModel, child: Rect, viewPort?: Rect,
        nodesInView?: DiagramElement[]): DiagramElement[] {
        const nodes: DiagramElement[] = [];
        let nd: DiagramElement;
        let bounds: Rect;
        const quads: Quad[] = spatialSearch.findQuads(nodesInView ? viewPort : child);
        for (let i: number = 0; i < quads.length; i++) {
            const quad: Quad = quads[i];
            if (quad.objects.length > 0) {
                for (let j: number = 0; j < quad.objects.length; j++) {
                    nd = quad.objects[j] as DiagramElement;
                    if (!(this.diagram.nameTable[nd.id] instanceof Connector) && nd.visible
                        && !(this.diagram.nameTable[nd.id].shape.type === 'SwimLane') && !(this.diagram.nameTable[nd.id].isLane) &&
                        !(this.diagram.nameTable[nd.id].isPhase) && !(this.diagram.nameTable[nd.id].isHeader) && nd.id != 'helper') {
                        bounds = getBounds(nd);
                        if (nodes.indexOf(nd) === -1 && this.intersectsRect(child, bounds)) {
                            nodes.push(nd);
                        }
                        if (nodesInView && nodesInView.indexOf(nd) && this.intersectsRect(viewPort, bounds)) {
                            nodesInView.push(nd);
                        }
                    }
                }
            }
        }
        return nodes;
    }
    private intersectsRect(child: Rect, bounds: Rect): boolean {
        return ((((bounds.x < (child.x + child.width)) && (child.x < (bounds.x + bounds.width)))
            && (bounds.y < (child.y + child.height))) && (child.y < (bounds.y + bounds.height)));
    }
    private getAdornerLayerSvg(): SVGSVGElement {
        return this.diagram.diagramRenderer.adornerSvgLayer;
    }

    /**
     *  To remove grid lines on mouse move and mouse up \
     *
     * @returns {  void }  To remove grid lines on mouse move and mouse up .\
     * @param {Diagram} diagram - provide the source value.
     * @private
     */
    public removeGuidelines(diagram: Diagram): void {
        const selectionRect: SVGElement =
            (this.getAdornerLayerSvg() as SVGSVGElement).getElementById('_SnappingLines') as SVGElement;
        const line: SVGElement =
            (this.getAdornerLayerSvg() as SVGSVGElement).getElementById('pivotLine') as SVGElement;
        if (selectionRect) {
            selectionRect.parentNode.removeChild(selectionRect);
        }
        if (line) {
            line.parentNode.removeChild(line);
        }
    }

    //Sort the objects by its distance
    private sortByDistance(obj: (Objects | SnapSize)[], value: string, ascending?: boolean): void {
        let i: number;
        let j: number;
        let temp: (Objects | SnapSize);
        if (ascending) {
            for (i = 0; i < obj.length; i++) {
                for (j = i + 1; j < obj.length; j++) {
                    if (obj[i][value] > obj[j][value]) {
                        temp = obj[i];
                        obj[i] = obj[j];
                        obj[j] = temp;
                    }
                }
            }
        } else {
            for (i = 0; i < obj.length; i++) {
                for (j = i + 1; j < obj.length; j++) {
                    if (obj[i][value] < obj[j][value]) {
                        temp = obj[i];
                        obj[i] = obj[j];
                        obj[j] = temp;
                    }
                }
            }
        }
    }

    //To find nodes that are equally placed at left of the selected node
    private findEquallySpacedNodesAtLeft(objectsAtLeft: Objects[], equalDistance: number, top: number, equallySpaced: Objects[]): number {
        let prevBounds: Rect;
        let targetBounds: Rect;
        let dist: number;
        let i: number;
        for (i = 1; i < objectsAtLeft.length; i++) {
            prevBounds = ((objectsAtLeft[i - 1].obj).bounds);
            targetBounds = ((objectsAtLeft[i].obj).bounds);
            dist = prevBounds.x - targetBounds.x - targetBounds.width;
            if (Math.abs(dist - equalDistance) <= 1) {
                equallySpaced[equallySpaced.length] = objectsAtLeft[i];
                if (targetBounds.y < top) {
                    top = targetBounds.y;
                }
            } else {
                break;
            }
        }
        return top;
    }

    //To find nodes that are equally placed at right of the selected node
    private findEquallySpacedNodesAtRight(
        objectsAtRight: Objects[], equalDistance: number, top: number, equallySpaced: Objects[],
        snapObjDistance: number): number {
        const actualDistance: number = objectsAtRight[0].distance;
        let target: DiagramElement;
        let targetBounds: Rect;
        let prevBounds: Rect;
        let dist: number;
        if (Math.abs(equalDistance - actualDistance) <= snapObjDistance) {
            for (let i: number = 0; i < objectsAtRight.length - 1; i++) {
                target = objectsAtRight[i].obj;
                targetBounds = ((objectsAtRight[i + 1].obj).bounds);
                prevBounds = (target.bounds);
                dist = targetBounds.x - prevBounds.x - prevBounds.width;
                if (Math.abs(dist - equalDistance) <= 1) {
                    equallySpaced[equallySpaced.length] = objectsAtRight[i + 1];
                    if (prevBounds.y < top) {
                        top = prevBounds.y;
                    }
                } else {
                    break;
                }
            }
        }
        return top;

    }
    private findEquallySpacedNodesAtTop(objectsAtTop: Objects[], equalDistance: number, right: number, equallySpaced: Objects[]): number {
        let prevBounds: Rect;
        let targetBounds: Rect;
        let dist: number;
        for (let i: number = 1; i < objectsAtTop.length; i++) {
            prevBounds = ((objectsAtTop[i - 1].obj).bounds);
            targetBounds = ((objectsAtTop[i].obj).bounds);
            dist = prevBounds.y - targetBounds.y - targetBounds.height;
            if (Math.abs(dist - equalDistance) <= 1) {
                equallySpaced[equallySpaced.length] = objectsAtTop[i];
                if (targetBounds.x + targetBounds.width > right) {
                    right = targetBounds.x + targetBounds.width;
                }
            } else {
                break;
            }
        }
        return right;
    }
    //To find nodes that are equally placed at bottom of the selected node
    private findEquallySpacedNodesAtBottom(
        objectsAtBottom: Objects[], equalDistance: number, right: number,
        equallySpaced: Objects[], snapObjDistance: number): number {
        const actualDistance: number = objectsAtBottom[0].distance;
        let target: DiagramElement;
        let targetBounds: Rect;
        let prevBounds: Rect;
        let dist: number;
        if (Math.abs(equalDistance - actualDistance) <= snapObjDistance) {
            for (let i: number = 0; i < objectsAtBottom.length - 1; i++) {
                target = objectsAtBottom[i].obj;
                targetBounds = ((objectsAtBottom[i + 1].obj).bounds);
                prevBounds = (target.bounds);
                dist = targetBounds.y - prevBounds.y - prevBounds.height;
                if (Math.abs(dist - equalDistance) <= 1) {
                    equallySpaced[equallySpaced.length] = objectsAtBottom[i + 1];
                    if (prevBounds.x + prevBounds.width > right) {
                        right = prevBounds.x + prevBounds.width;
                    }
                } else {
                    break;
                }
            }
        }
        return right;

    }
    /**
     * To get Adoner layer to draw snapLine
     *
     * @private
     */
    public getLayer(): SVGElement {
        let snapLine: SVGElement;
        if (this.diagram.snapSettings.constraints & SnapConstraints.SnapToObject) {
            snapLine = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            snapLine.setAttribute('id', '_SnappingLines');
            snapLine.setAttribute('shapeRendering', 'crispEdges');
            this.getAdornerLayerSvg().appendChild(snapLine);
        }
        return snapLine;
    }

    /**
     * Constructor for the snapping module
     *
     * @private
     */

    // constructor() {
    //     //constructs the snapping module
    // }

    /**
     *To destroy the ruler
     *
     * @returns {void} To destroy the ruler
     */

    public destroy(): void {
        /**
         * Destroys the snapping module
         */
    }

    /**
     * Core method to return the component name.
     *
     * @returns {string}  Core method to return the component name.
     * @private
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Snapping';
    }
}

export interface Snap {
    snapped: boolean;
    offset: number;
    left?: boolean;
    bottom?: boolean;
    right?: boolean;
    top?: boolean;
}
/**
 * @private
 */
export interface SnapObject {
    start: PointModel;
    end: PointModel;
    offsetX: number;
    offsetY: number;
    type: string;
}
/**
 * @private
 */
export interface Objects {
    obj: DiagramElement;
    distance: number;
}
/**
 * @private
 */
export interface SnapSize {
    source: NodeModel;
    difference: number;
    offset: number;
}
