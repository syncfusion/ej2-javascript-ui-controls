import { EventHandler, extend, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ActivePoint } from '@syncfusion/ej2-inputs';
import { FreehandDraw, Point, SelectionPoint, ShapeChangeEventArgs, ShapeSettings, ShapeType, StrokeSettings } from '../index';
import { CurrentObject, ImageDimension, ImageEditor } from '../index';

export class FreehandDrawing {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private fhdObj: FreehandDraw = {lastWidth: 0, lastVelocity: 0, time: 0, pointX: 0, pointY: 0};
    private isFreehandDrawing: boolean = false;
    private freehandDownPoint: Point = {x: 0, y: 0};
    private isFreehandPointMoved: boolean = false;
    private fhdHovIdx: number; // Specifies current hovered index of freehand drawing
    private pointCounter: number = 0;
    // eslint-disable-next-line
    private selPointColl: any = {};
    private penStrokeWidth: number;
    private currFHDIdx: number = 0; // Specifies id for every freehand drawing - uses while deleting
    private selPoints: Point[] = [];
    private dummyPoints: Point[] = [];
    private fhdSelID: string;
    private tempFHDStyles: StrokeSettings = {strokeColor: null, fillColor: null, strokeWidth: null};
    private fhdSelIdx: number;
    private straightenPoint: Point = {x: null, y: null, ratioX: null, ratioY: null };
    private prevStraightenObj: SelectionPoint;
    private straightenPointAngle: number = 0;

    constructor(parent: ImageEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on('freehand-draw', this.draw, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('freehand-draw', this.draw);
        this.parent.off('destroyed', this.destroy);
    }

    private draw(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        this.updateFhdPvtVar();
        switch (args.prop) {
        case 'hoverFhd': {
            this.hoverFhd(args.value['strokeColor'], args.value['strokeWidth']);
            break;
        }
        case 'freehandDownHandler':
            this.freehandDownHandler(args.value['e'], args.value['canvas']);
            break;
        case 'freehandUpHandler':
            this.freehandUpHandler(args.value['e'], args.value['canvas'], args.value['context']);
            break;
        case 'handle-freehand-draw': {
            const id: number = parseInt(args.value['id'].split('_')[1], 10) - 1;
            if (this.isFHDIdx(id)) {
                this.deleteFhd(id, true);
            }
            break;
        }
        case 'freehandRedraw':
            this.freehandRedraw(args.value['context'], args.value['points']);
            break;
        case 'deleteFhd': {
            const id: number = parseInt(args.value['id'].split('_')[1], 10) - 1;
            this.deleteFhd(id, true);
            break;
        }
        case 'selectFhd': {
            let id: number = null;
            if (args.value['id']) {
                id = parseInt(args.value['id'].split('_')[1], 10) - 1;
            }
            this.selectFhd(id);
            break;
        }
        case 'applyFhd':
            this.applyFhd();
            break;
        case 'cancelFhd':
            this.cancelFhd();
            break;
        case 'updateFHDCurPts':
            this.updateFHDCurPts();
            break;
        case 'rotateFhdColl':
            this.rotateFhdColl();
            break;
        case 'flipFHDColl':
            this.flipFHDColl(args.value['value']);
            break;
        case 'panFHDColl':
            this.panFHDColl(args.value['xDiff'], args.value['yDiff'], args.value['panRegion']);
            break;
        case 'updateFHDColl':
            if (args.value && args.value['isPreventApply']) {
                this.updateFHDColl(args.value['isPreventApply']);
            } else {
                this.updateFHDColl();
            }
            break;
        case 'zoomFHDColl':
            this.zoomFHDColl(args.value['isPreventApply']);
            break;
        case 'apply-pen-draw':
            this.applyPenDraw();
            break;
        case 'freeHandDraw':
            this.freeHandDraw(args.value['value']);
            break;
        case 'isFHDIdx':
            this.isFHDIdx(args.value['index'], args.value['obj']);
            break;
        case 'getSqPtFD':
            this.getSqPtFD(args.value['idx'], args.value['obj']);
            break;
        case 'getSelPointColl':
            args.value['obj']['selPointColl'] = extend([], this.selPointColl);
            break;
        case 'setSelPointColl':
            this.selPointColl = extend([], args.value['obj']['selPointColl']);
            break;
        case 'setFreehandDrawHoveredIndex':
            this.fhdHovIdx = args.value['index'];
            break;
        case 'getFreehandDrawHoveredIndex':
            args.value['obj']['index'] = this.fhdHovIdx;
            break;
        case 'setPointCounter':
            this.pointCounter = args.value['value'];
            break;
        case 'getPenStrokeWidth':
            args.value['obj']['penStrokeWidth'] = this.penStrokeWidth;
            break;
        case 'setPenStrokeWidth':
            this.penStrokeWidth = args.value['value'];
            break;
        case 'getCurrentFreehandDrawIndex':
            args.value['obj']['currentFreehandDrawIndex'] = this.currFHDIdx;
            break;
        case 'setCurrentFreehandDrawIndex':
            this.currFHDIdx = args.value['value'];
            break;
        case 'updateCropPtsForSel':
            this.updateCropPtsForSel();
            break;
        case 'getFreehandDrawSelectedId':
            args.value['obj']['freehandDrawSelectedId'] = this.fhdSelID;
            break;
        case 'resetFreehandDrawSelectedId':
            this.fhdSelID = null;
            break;
        case 'getTempFreeHandDrawEditingStyles':
            args.value['obj']['tempFreeHandDrawEditingStyles'] = this.tempFHDStyles;
            break;
        case 'setFreehandSelectedIndex':
            this.fhdSelIdx = args.value['index'];
            break;
        case 'getFreehandSelectedIndex':
            args.value['obj']['freehandSelectedIndex'] = this.fhdSelIdx;
            break;
        case 'setCenterSelPoints':
            this.setCenterSelPoints();
            break;
        case 'getStraightenPoint':
            args.value['obj']['straightenPoint'] = extend({}, this.straightenPoint, {}, true);
            break;
        case 'setStraightenPoint':
            this.straightenPoint.x = args.value['x'];
            this.straightenPoint.y = args.value['y'];
            if (args.value['ratioX'] && args.value['ratioY']) {
                this.straightenPoint.ratioX = args.value['ratioX'];
                this.straightenPoint.ratioY = args.value['ratioY'];
            }
            break;
        case 'resetStraightenPoint':
            this.straightenPoint = {x: null, y: null, ratioX: null, ratioY: null };
            this.prevStraightenObj = null; this.straightenPointAngle = 0;
            break;
        case 'getStraightenPointAngle':
            args.value['obj']['angle'] = this.straightenPointAngle;
            break;
        case 'reset':
            this.reset();
            break;
        }
    }

    private updateFhdPvtVar(): void {
        const parent: ImageEditor = this.parent;
        if (parent.lowerCanvas) {this.lowerContext = parent.lowerCanvas.getContext('2d'); }
        if (parent.upperCanvas) {this.upperContext = parent.upperCanvas.getContext('2d'); }
    }

    private reset(): void {
        this.fhdObj = {lastWidth: 0, lastVelocity: 0, time: 0, pointX: 0, pointY: 0};
        this.isFreehandDrawing = this.isFreehandPointMoved = false; this.selPoints = []; this.dummyPoints = [];
        this.freehandDownPoint = {x: 0, y: 0}; this.selPointColl = {}; this.straightenPointAngle = 0;
        this.fhdHovIdx = null; this.pointCounter = 0; this.fhdSelID = null;
        this.penStrokeWidth = undefined; this.currFHDIdx = 0; this.fhdSelIdx = null;
        this.tempFHDStyles = {strokeColor: null, fillColor: null, strokeWidth: null};
        this.straightenPoint = {x: null, y: null, ratioX: null, ratioY: null }; this.prevStraightenObj = null;
    }

    public getModuleName(): string {
        return 'freehand-draw';
    }

    private hoverFhd(fillStyle?: string, strokeWidth?: number): void {
        const parent: ImageEditor = this.parent;
        const context: CanvasRenderingContext2D = this.upperContext;
        let idx: number = -1;
        if (this.fhdHovIdx > -1) {idx = this.fhdHovIdx; }
        else {idx = this.fhdSelIdx; }
        parent.points = extend([], parent.pointColl[idx as number].points) as Point[];
        this.pointCounter = 0;
        const len: number = parent.points.length;
        let controlPoint1: Point; let controlPoint2: Point; let startPoint: Point; let endPoint: Point;
        let minStrokeWidth: number = 0; let maxStrokeWidth: number = 0;
        context.fillStyle = fillStyle ? fillStyle : parent.pointColl[idx as number].strokeColor;
        context.strokeStyle = context.fillStyle;
        minStrokeWidth = maxStrokeWidth = this.penStrokeWidth = strokeWidth ?
            strokeWidth : parent.pointColl[idx as number].strokeWidth;
        if (len === 1) {
            controlPoint1 = controlPoint2 = startPoint = endPoint = parent.points[0];
            this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
        }
        for (let l: number = 0; l < len - 3; l++) {
            if (parent.points[l + 1] && parent.points[l + 2] && parent.points[l + 2]) {
                controlPoint1 = (this.calcCurveCP(parent.points[l + 0], parent.points[l + 1],
                                                  parent.points[l + 2])).controlPoint2;
                controlPoint2 = (this.calcCurveCP(parent.points[l + 1], parent.points[l + 2],
                                                  parent.points[l + 3])).controlPoint1;
                if (l === 0) {
                    startPoint = parent.points[l as number];
                } else {
                    startPoint = parent.points[l + 1];
                }
                endPoint = parent.points[l + 2];
                this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
            }
        }
        context.closePath();
        // Outer selection
        const point: ActivePoint = this.getSqPtFD(idx);
        const tempLineWidth: number = context.lineWidth;
        context.lineWidth = 2;
        context.strokeStyle = parent.themeColl[parent.theme]['primaryColor'];
        context.beginPath();
        context.rect(point.startX, point.startY, point.width, point.height);
        context.stroke(); context.closePath();
        context.lineWidth = tempLineWidth;
    }

    private freehandDownHandler(e: MouseEvent & TouchEvent, canvas: HTMLCanvasElement): void {
        const parent: ImageEditor = this.parent;
        parent.lowerCanvas = document.querySelector('#' + parent.element.id + '_lowerCanvas');
        this.lowerContext = parent.lowerCanvas.getContext('2d');
        parent.upperCanvas = document.querySelector('#' + parent.element.id + '_upperCanvas');
        this.upperContext = parent.upperCanvas.getContext('2d');
        this.fhdObj.time = new Date().getTime();
        this.isFreehandDrawing = true;
        if (e.type === 'mousedown') {this.freehandDownPoint = {x: e.clientX, y: e.clientY}; }
        else {this.freehandDownPoint = {x: e.touches[0].clientX, y: e.touches[0].clientY }; }
        this.isFreehandPointMoved = false;
        EventHandler.add(canvas, 'mousemove touchmove', this.freehandMoveHandler, this);
        const shapeSettings: ShapeSettings = {id: 'pen_' + (this.currFHDIdx + 1), type: ShapeType.FreehandDraw,
            startX: this.freehandDownPoint.x, startY: this.freehandDownPoint.y,
            strokeColor: parent.activeObj.strokeSettings.strokeColor, strokeWidth: this.penStrokeWidth, points: null };
        const shapeChangingArgs: ShapeChangeEventArgs = {cancel: false, action: 'draw-start', previousShapeSettings: shapeSettings,
            currentShapeSettings: shapeSettings};
        this.triggerShapeChanging(shapeChangingArgs);
    }

    private freehandUpHandler(e: MouseEvent & TouchEvent, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        const rect: DOMRect = canvas.getBoundingClientRect() as DOMRect;
        const parent: ImageEditor = this.parent;
        EventHandler.remove(canvas, 'mousemove touchmove', this.freehandMoveHandler);
        if (parent.points.length === 0) {
            if (e.type === 'mouseup') {this.processPoint(e.clientX - rect.left, e.clientY - rect.top, true, context); }
            else if (e.type === 'touchend' && e.changedTouches) {
                this.processPoint(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top, true, context);
            } else {
                if (!this.isFreehandPointMoved) {
                    this.processPoint(this.freehandDownPoint.x - rect.left, this.freehandDownPoint.y - rect.top, true, context);
                }
            }
        }
        context.closePath();
        const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false, value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        const fhCnt: number = parent.freehandCounter;
        parent.pointColl[fhCnt as number] = { points: extend([], parent.points), strokeColor: parent.activeObj.strokeSettings.strokeColor,
            strokeWidth: this.penStrokeWidth, flipState: parent.transform.currFlipState, id: 'pen_' + (this.currFHDIdx + 1)};
        parent.points = []; this.dummyPoints = [];
        this.selPointColl[fhCnt as number] = { points: extend([], this.selPoints) };
        this.selPoints = []; this.pointCounter = 0;
        parent.freehandCounter++;
        this.isFreehandDrawing = false;
        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: 'freehand-draw', previousObj: prevObj, previousObjColl: prevObj.objColl,
                previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                previousCropObj: prevCropObj, previousText: null,
                currentText: null, previousFilter: null, isCircleCrop: null}});
        const shapeSettings: ShapeSettings = {id: 'pen_' + (this.currFHDIdx + 1), type: ShapeType.FreehandDraw,
            startX: this.freehandDownPoint.x, startY: this.freehandDownPoint.y,
            strokeColor: parent.activeObj.strokeSettings.strokeColor, strokeWidth: this.penStrokeWidth,
            points: parent.pointColl[this.currFHDIdx].points };
        const shapeChangingArgs: ShapeChangeEventArgs = {cancel: false, action: 'draw-end', previousShapeSettings: shapeSettings,
            currentShapeSettings: shapeSettings};
        this.triggerShapeChanging(shapeChangingArgs);
        this.currFHDIdx++;
    }

    private freehandMoveHandler(e: MouseEvent & TouchEvent): void {
        this.isFreehandPointMoved = true;
        const rect: DOMRect = this.parent.upperCanvas.getBoundingClientRect() as DOMRect;
        let x: number; let y: number;
        if (e.type === 'mousemove') {
            x = e.clientX - rect.left; y = e.clientY - rect.top;
        } else {
            x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top;
        }
        if (this.isFreehandDrawing) {
            this.upperContext.fillStyle = this.parent.activeObj.strokeSettings.strokeColor;
            this.processPoint(x, y, false, this.upperContext);
        }
    }

    private processPoint(x: number, y: number, mouseDown: boolean, context: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        let lastPoint: Point = this.point(x, y, new Date().getTime());
        lastPoint = parent.points.length > 0 && parent.points[parent.points.length - 1];
        const isLastPointTooClose: boolean = lastPoint ? this.distanceTo(lastPoint) <= 5 : false;
        let controlPoint1: Point; let controlPoint2: Point;
        let startPoint: Point; let endPoint: Point;
        this.selPoints.push({x: x, y: y, ratioX: (x - parent.img.destLeft) / parent.img.destWidth,
            ratioY: (y - parent.img.destTop) / parent.img.destHeight, time: this.fhdObj.time });
        if (!lastPoint || !(lastPoint && isLastPointTooClose) || mouseDown) {
            this.fhdObj.time = new Date().getTime();
            parent.points.push({x: x, y: y, ratioX: (x - parent.img.destLeft) / parent.img.destWidth,
                ratioY: (y - parent.img.destTop) / parent.img.destHeight,
                time: this.fhdObj.time });
            this.dummyPoints.push({x: x, y: y, ratioX: (x - parent.img.destLeft) / parent.img.destWidth,
                ratioY: (y - parent.img.destTop) / parent.img.destHeight,
                time: this.fhdObj.time });
            if (this.dummyPoints.length > 2) {
                if (this.dummyPoints.length === 3) {
                    this.dummyPoints.unshift(this.dummyPoints[0]);
                }
                const p0: Point = this.dummyPoints[0];
                const p1: Point = this.dummyPoints[1];
                const p2: Point = this.dummyPoints[2];
                const p3: Point = this.dummyPoints[3];
                controlPoint1 = this.calcCurveCP(p0, p1, p2).controlPoint2;
                controlPoint2 = this.calcCurveCP(p1, p2, p3).controlPoint1;
                startPoint = this.dummyPoints[1];
                endPoint = this.dummyPoints[2];
                let minStrokeWidth: number = 0.5; let maxStrokeWidth: number = 5;
                if (!isNullOrUndefined(this.penStrokeWidth)) {
                    minStrokeWidth = maxStrokeWidth = this.penStrokeWidth;
                }
                this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
                this.pointCounter++;
                this.dummyPoints.shift();
            }
            if (mouseDown) {
                controlPoint1 = controlPoint2 = startPoint = endPoint = {x: x, y: y, time: new Date().getTime()};
                let minStrokeWidth: number = 0.5; let maxStrokeWidth: number = 5;
                if (!isNullOrUndefined(this.penStrokeWidth)) {
                    minStrokeWidth = maxStrokeWidth = this.penStrokeWidth;
                }
                this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
            }
        }
    }

    private calcCurveCP(p1: Point, p2: Point, p3: Point): {controlPoint1: Point, controlPoint2: Point} {
        if (!p2) { p2 = p1; } if (!p3) { p3 = p2; }
        const dx1: number = p1.x - p2.x; const dy1: number = p1.y - p2.y;
        const dx2: number = p2.x - p3.x; const dy2: number = p2.y - p3.y;
        const m1: Point = { x: (p1.x + p2.x) / 2.0, y: (p1.y + p2.y) / 2.0 };
        const m2: Point = { x: (p2.x + p3.x) / 2.0, y: (p2.y + p3.y) / 2.0 };
        const l1: number = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const l2: number = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const dxm: number = (m1.x - m2.x); const dym: number = (m1.y - m2.y);
        const k: number = l2 / (l1 + l2);
        const cm: Point = { x: m2.x + dxm * k, y: m2.y + dym * k };
        const tx: number = p2.x - cm.x; const ty: number = p2.y - cm.y;
        return {
            controlPoint1: this.point(m1.x + tx, m1.y + ty, 0),
            controlPoint2: this.point(m2.x + tx, m2.y + ty, 0)
        };
    }

    private point(x: number, y: number, time: number): Point {
        this.fhdObj.pointX = x; this.fhdObj.pointY = y;
        return {x: this.fhdObj.pointX, y: this.fhdObj.pointY, time: time};
    }

    private startDraw(context: CanvasRenderingContext2D, controlPoint1: Point, controlPoint2: Point,
                      startPoint: Point, endPoint: Point, minStrokeWidth: number, maxStrokeWidth: number): void {
        let tempVelocity: number;
        tempVelocity = this.pointVelocity(startPoint);
        tempVelocity = 0.7 * tempVelocity + (1 - 0.7) * this.fhdObj.lastVelocity;
        const newWidth: number  = Math.max(maxStrokeWidth / (0.7 + 1), minStrokeWidth);
        this.drawCurve(this.fhdObj.time, newWidth, context, controlPoint1, controlPoint2, startPoint, endPoint, maxStrokeWidth);
        this.fhdObj.lastVelocity = tempVelocity; this.fhdObj.time = newWidth;
    }

    private pointVelocity(startPoint: Point): number{
        return (this.fhdObj.time !== startPoint.time) ? this.distanceTo(startPoint) /
        (this.fhdObj.time - startPoint.time) : 0;
    }

    private distanceTo(start: Point): number{
        return Math.sqrt(Math.pow(this.fhdObj.pointX - start.x, 2) + Math.pow(this.fhdObj.pointY - start.y, 2));
    }

    private drawCurve(startWidth: number, endWidth: number, context: CanvasRenderingContext2D, controlPoint1: Point, controlPoint2: Point,
                      startPoint: Point, endPoint: Point, maxStrokeWidth: number): void {
        let width: number; let i: number; let t1: number; let t2: number;
        let t3: number; let u1: number; let u2: number; let u3: number; let x: number; let y: number;
        const widthValue: number = endWidth - startWidth;
        const bezierLength: number = this.bezierLength(controlPoint1, controlPoint2, startPoint, endPoint);
        const drawSteps: number  = Math.ceil(bezierLength) * 2;
        context.beginPath();
        for (i = 0; i < drawSteps; i++) {
            t1 = i / drawSteps; t2 = t1 * t1; t3 = t2 * t1;
            u1 = 1 - t1; u2 = u1 * u1; u3 = u2 * u1;
            x = u3 * startPoint.x; x += 3 * u2 * t1 * controlPoint1.x;
            x += 3 * u1 * t2 * controlPoint2.x; x += t3 * endPoint.x;
            y = u3 * startPoint.y; y += 3 * u2 * t1 * controlPoint1.y;
            y += 3 * u1 * t2 * controlPoint2.y; y += t3 * endPoint.y;
            width = Math.min(startWidth + t3 * widthValue, maxStrokeWidth);
            this.drawArc(x, y, width, context);
        }
        context.closePath(); context.fill();
    }

    private bezierLength(controlPoint1: Point, controlPoint2: Point, startPoint: Point, endPoint: Point): number {
        const steps: number = 10; let length: number = 0; let i: number; let t: number;
        let pointX1: number; let pointY1: number; let pointX2: number; let pointY2: number;
        let pointX3: number; let pointY3: number;
        for (i = 0; i <= steps; i++) {
            t = i / steps;
            pointX1 = this.bezierPoint(t, startPoint.x, controlPoint1.x, controlPoint2.x, endPoint.x);
            pointY1 = this.bezierPoint(t, startPoint.y, controlPoint1.y, controlPoint2.y, endPoint.y);
            if (i > 0) {
                pointX3 = pointX1 - pointX2; pointY3 = pointY1 - pointY2;
                length += Math.sqrt(pointX3 * pointX3 + pointY3 * pointY3);
            }
            pointX2 = pointX1; pointY2 = pointY1;
        }
        return length;
    }

    private bezierPoint(t: number, startPoint: number, cp1: number, cp2: number, endPoint: number): number {
        return startPoint * (1.0 - t) * (1.0 - t) * (1.0 - t) + 3.0 * cp1 * (1.0 - t) * (1.0 - t) * t + 3.0 *
        cp2 * (1.0 - t) * t * t + endPoint * t * t * t;
    }

    private drawArc(x: number, y: number, size: number, context: CanvasRenderingContext2D): void {
        const img: ImageDimension = this.parent.img;
        if ((x > img.destLeft && y > img.destTop && x < (img.destLeft + img.destWidth) &&
            y < (img.destTop + img.destHeight) ||
            (context !== this.lowerContext && context !== this.upperContext))) {
            context.moveTo(x, y); context.arc(x, y, size, 0, 2 * Math.PI, false);
        }
    }

    private freehandRedraw(context: CanvasRenderingContext2D, points?: Point[]): void {
        const parent: ImageEditor = this.parent;
        const temp: string = context.filter; context.filter = 'none';
        if (points) {
            parent.pointColl[parent.freehandCounter] = { points: points, strokeColor: parent.activeObj.strokeSettings.strokeColor,
                strokeWidth: this.penStrokeWidth, flipState: parent.transform.currFlipState };
            parent.freehandCounter++;
        }
        if (parent.freehandCounter > 0) {
            for (let n: number = 0; n < parent.freehandCounter; n++) {
                parent.points = extend([], parent.pointColl[n as number].points) as Point[];
                this.pointCounter = 0;
                const len: number = parent.points.length;
                let controlPoint1: Point; let controlPoint2: Point; let startPoint: Point; let endPoint: Point;
                let minStrokeWidth: number; let maxStrokeWidth: number;
                if (len > 0) {
                    context.fillStyle = parent.pointColl[n as number].strokeColor;
                    minStrokeWidth = maxStrokeWidth = this.penStrokeWidth = parent.pointColl[n as number].strokeWidth;
                }
                if (len === 1) {
                    controlPoint1 = controlPoint2 = startPoint = endPoint = parent.points[0];
                    this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
                }
                for (let l: number = 0; l < len - 3; l++) {
                    if (parent.points[l + 1] && parent.points[l + 2] && parent.points[l + 2]) {
                        controlPoint1 = (this.calcCurveCP(parent.points[l + 0],
                                                          parent.points[l + 1], parent.points[l + 2])).controlPoint2;
                        controlPoint2 = (this.calcCurveCP(parent.points[l + 1], parent.points[l + 2],
                                                          parent.points[l + 3])).controlPoint1;
                        if (l === 0) {
                            startPoint = parent.points[l as number];
                        } else {
                            startPoint = parent.points[l + 1];
                        }
                        endPoint = parent.points[l + 2];
                        this.startDraw(context, controlPoint1, controlPoint2, startPoint, endPoint, minStrokeWidth, maxStrokeWidth);
                    }
                }
                context.closePath();
            }
            if (context === this.lowerContext) {
                parent.notify('draw', {prop: 'applyFrame', value: {ctx: this.lowerContext, frame: parent.frameObj.type, preventImg: true}});
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            }
        }
        context.filter = temp;
    }

    private getSqPtFD(idx: number, obj?: Object): ActivePoint {
        const activePoint: ActivePoint = {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0};
        const sPoints: Point[] = extend([], this.selPointColl[idx as number].points, []) as Point[];
        this.parent.points = extend([], this.parent.pointColl[idx as number].points) as Point[];
        this.pointCounter = 0; const len: number = sPoints.length;
        for (let l: number = 0; l < len; l++) {
            if (activePoint.startX === 0 && activePoint.startY === 0 && activePoint.endX === 0 && activePoint.endY === 0) {
                activePoint.startX = sPoints[l as number].x;
                activePoint.startY = sPoints[l as number].y;
                activePoint.endX = sPoints[l as number].x;
                activePoint.endY = sPoints[l as number].y;
            } else {
                activePoint.startX = Math.min(activePoint.startX, sPoints[l as number].x);
                activePoint.startY = Math.min(activePoint.startY, sPoints[l as number].y);
                activePoint.endX = Math.max(activePoint.endX, sPoints[l as number].x);
                activePoint.endY = Math.max(activePoint.endY, sPoints[l as number].y);
            }
        }
        activePoint.startX -= this.penStrokeWidth; activePoint.startY -= this.penStrokeWidth;
        activePoint.endX += this.penStrokeWidth; activePoint.endY += this.penStrokeWidth;
        activePoint.width = activePoint.endX - activePoint.startX;
        activePoint.height = activePoint.endY - activePoint.startY;
        if (obj) { obj['activePoint'] = activePoint; }
        return activePoint;
    }

    private applyPenDraw(): void {
        const parent: ImageEditor = this.parent;
        if (parent.currObjType.shape === 'freehanddraw') {
            parent.notify('shape', { prop: 'apply', onPropertyChange: false, value: {shape: null, obj: null, canvas: null}});
            parent.upperCanvas.style.cursor = parent.cursor = 'default';
            parent.currObjType.shape = '';
        }
        parent.notify('shape', {prop: 'clearActObj'});
    }

    private applyFhd(): void {
        const parent: ImageEditor = this.parent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selectedPoint: any = parent.pointColl[this.fhdSelIdx];
        if (selectedPoint.strokeColor === '#42a5f5') {
            selectedPoint.strokeColor = this.tempFHDStyles.strokeColor;
        }
        if (!isBlazor()) {
            parent.notify('toolbar', {prop: 'setSelectedFreehandColor', value: {color: '#42a5f5' } });
        }
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        parent.notify('draw', {prop: 'render-image', value: {isMouseWheel: null } });
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
        }
        if (selectedPoint) {
            selectedPoint.isSelected = false;
        }
        parent.notify('selection', {prop: 'resetFreehandDrawVariables'});
        this.fhdHovIdx = this.fhdSelIdx = null;
    }

    private cancelFhd(): void {
        const parent: ImageEditor = this.parent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selectedPoint: any = parent.pointColl[this.fhdSelIdx];
        if (!isBlazor()) {
            parent.notify('toolbar', {prop: 'setSelectedFreehandColor', value: {color: '#42a5f5' } });
        }
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        this.lowerContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        this.pointCounter = 0;
        if (selectedPoint) {
            selectedPoint.strokeColor = this.tempFHDStyles.strokeColor;
            selectedPoint.strokeWidth = this.tempFHDStyles.strokeWidth;
            selectedPoint.isSelected = false;
        }
        this.fhdHovIdx = this.fhdSelIdx = this.fhdSelID = null;
        parent.notify('selection', {prop: 'resetFreehandDrawVariables'});
        parent.activeObj.strokeSettings.strokeColor = this.tempFHDStyles.strokeColor;
        parent.activeObj.strokeSettings.strokeWidth = this.penStrokeWidth = this.tempFHDStyles.strokeWidth;
        this.tempFHDStyles = {strokeColor: null, strokeWidth: null, fillColor: null};
        parent.notify('draw', {prop: 'render-image', value: {isMouseWheel: null } });
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false}); 
        } else {
            parent.updateToolbar(parent.element, 'imageLoaded');
        }
    }

    private selectFhd(index?: number): void {
        const parent: ImageEditor = this.parent;
        parent.notify('selection', { prop: 'setFreehandDrawEditing', onPropertyChange: false, value: {bool: true }});
        if (index || index === 0) {
            if (this.isFHDIdx(index)) {
                this.fhdSelIdx = this.fhdHovIdx = index;
                this.hoverFhd();
                parent.upperCanvas.style.cursor = parent.cursor = 'pointer';
            } else {
                return;
            }
        }
        this.fhdSelIdx = this.fhdHovIdx;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const point: any = parent.pointColl[this.fhdSelIdx];
        point.isSelected = true; this.fhdSelID = point.id;
        if (point.strokeColor !== '#42a5f5') {
            parent.activeObj.strokeSettings.strokeColor = this.tempFHDStyles.strokeColor = point.strokeColor;
        }
        parent.activeObj.strokeSettings.strokeWidth = this.tempFHDStyles.strokeWidth =
            parent.pointColl[this.fhdHovIdx].strokeWidth;
        const obj: Object = {bool: false };
        parent.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: obj }});
        if (obj['bool']) {
            const shapeSettings: ShapeSettings = {id: 'pen_' + (this.fhdSelIdx + 1), type: ShapeType.FreehandDraw,
                startX: point.points[0].x, startY: point.points[0].y, strokeColor: point.strokeColor,
                strokeWidth: point.strokeWidth, points: point.points, opacity: point.opacity };
            const shapeChangingArgs: ShapeChangeEventArgs = {cancel: false, action: 'select', previousShapeSettings: shapeSettings,
                currentShapeSettings: shapeSettings};
            this.triggerShapeChanging(shapeChangingArgs);
        } else {
            parent.okBtn();
        }
        if (isBlazor()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (parent as any).getShapeValue('pen');
        }
    }

    private deleteFhd(index: number, isId?: boolean): void {
        const parent: ImageEditor = this.parent;
        if (this.isFHDIdx(index)) {
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tempPointColl: any = extend({}, parent.pointColl, {}, true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tempSelPointColl: any = extend({}, this.selPointColl, {}, true);
            parent.pointColl = {}; this.selPointColl = {}; let count: number = 0;
            if (isNullOrUndefined(isId)) {
                for (let i: number = 0; i < parent.freehandCounter; i++) {
                    if (i !== index) {
                        parent.pointColl[count as number] = tempPointColl[i as number];
                        this.selPointColl[count as number] = tempSelPointColl[i as number];
                        count++;
                    }
                }
            } else {
                for (let i: number = 0; i < parent.freehandCounter; i++) {
                    if (parseInt(tempPointColl[i as number].id.split('_')[1], 10) - 1 !== index) {
                        parent.pointColl[count as number] = tempPointColl[i as number];
                        this.selPointColl[count as number] = tempSelPointColl[i as number];
                        count++;
                    }
                }
            }
            parent.freehandCounter -= 1; this.fhdHovIdx = this.fhdSelIdx = null;
            parent.notify('selection', {prop: 'resetFreehandDrawVariables'});
            parent.notify('draw', {prop: 'render-image', value: {isMouseWheel: null } });
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
            }
        }
    }

    private zoomX(x: number): number {
        return (x * this.parent.img.destWidth) + this.parent.img.destLeft;
    }

    private zoomY(y: number): number {
        return (y * this.parent.img.destHeight) + this.parent.img.destTop;
    }

    private zoomFHDColl(isPreventApply?: boolean): void {
        const parent: ImageEditor = this.parent;
        const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop,
            width: parent.img.destWidth, height: parent.img.destHeight};
        parent.notify('shape', { prop: 'straightenShapes', onPropertyChange: false});
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0; const len: number = parent.points.length;
            for (let l: number = 0; l < len; l++) {
                const point: Point = parent.points[l as number];
                point.x = this.zoomX(point.ratioX);
                point.y = this.zoomY(point.ratioY);
            }
        }
        this.updateFHDCurPts();
        if (this.straightenPoint.x && this.straightenPoint.y) {
            this.straightenPoint.x = this.zoomX(this.straightenPoint.ratioX);
            this.straightenPoint.y = this.zoomY(this.straightenPoint.ratioY);
        }
        if (parent.transform.straighten !== 0) {
            parent.notify('shape', { prop: 'straightenFHD', onPropertyChange: false});
        }
        parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
        parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        if (isNullOrUndefined(isPreventApply)) {
            this.freehandRedraw(this.lowerContext, null);
        }
    }

    private updateFHDCurPts(): void {
        const parent: ImageEditor = this.parent;
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            if (this.selPointColl[n as number]) {
                this.selPoints = extend([], this.selPointColl[n as number].points, []) as Point[];
                this.pointCounter = 0; const len: number = this.selPoints.length;
                for (let l: number = 0; l < len; l++) {
                    const point: Point = this.selPoints[l as number];
                    point.x = this.zoomX(point.ratioX);
                    point.y = this.zoomY(point.ratioY);
                }
            }
        }
    }

    private rotateFhdColl(): void {
        const parent: ImageEditor = this.parent;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0; const len: number = parent.points.length;
            for (let l: number = 0; l < len; l++) {
                const point: Point = parent.points[l as number];
                point.y = destTop + (destHeight * point.ratioX);
                point.x = (destLeft + destWidth) - (destWidth * point.ratioY);
                point.ratioX = (point.x - destLeft) / destWidth;
                point.ratioY = (point.y - destTop) / destHeight;
            }
        }
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            if (this.selPointColl[n as number]) {
                this.selPoints = extend([], this.selPointColl[n as number].points, []) as Point[];
                this.pointCounter = 0;
                const len: number = this.selPoints.length;
                for (let l: number = 0; l < len; l++) {
                    const point: Point = this.selPoints[l as number];
                    point.y = destTop + (destHeight * point.ratioX);
                    point.x = (destLeft + destWidth) - (destWidth * point.ratioY);
                    point.ratioX = (point.x - destLeft) / destWidth;
                    point.ratioY = (point.y - destTop) / destHeight;
                }
            }
        }
        this.updateFHDCurPts();
    }

    private flipFHDColl(value: string): void {
        const lowercaseValue: string = value.toLowerCase();
        if (lowercaseValue === 'horizontal') {
            this.pointsHorizontalFlip();
        } else if (lowercaseValue === 'vertical') {
            this.pointsVerticalFlip();
        } else {
            this.pointsHorizontalFlip();
            for (let i: number = 0; i < this.parent.freehandCounter; i++) {
                this.parent.pointColl[i as number].shapeFlip = '';
            }
            this.pointsVerticalFlip();
        }
    }

    private pointsHorizontalFlip(): void {
        const parent: ImageEditor = this.parent;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            if (parent.pointColl[n as number].shapeFlip !== parent.transform.currFlipState) {
                parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
                this.pointCounter = 0;
                const len: number = parent.points.length;
                for (let l: number = 0; l < len; l++) {
                    const point: Point = parent.points[l as number];
                    if (point.x <= destLeft + (destWidth / 2)) {
                        point.x = (destLeft + destWidth) - (point.x - destLeft);
                    } else if (point.x >= destLeft + (destWidth / 2)) {
                        point.x = destLeft + (destLeft + destWidth - point.x);
                    }
                    point.ratioX = (point.x - destLeft) / destWidth;
                    point.ratioY = (point.y - destTop) / destHeight;
                }
                parent.pointColl[n as number].shapeFlip = parent.transform.currFlipState;
            }
        }
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            if (this.selPointColl[n as number]) {
                if (this.selPointColl[n as number].shapeFlip !== parent.transform.currFlipState) {
                    this.selPoints = extend([], this.selPointColl[n as number].points, []) as Point[];
                    this.pointCounter = 0;
                    const len: number = this.selPoints.length;
                    for (let l: number = 0; l < len; l++) {
                        const point: Point = this.selPoints[l as number];
                        if (point.x <= destLeft + (destWidth / 2)) {
                            point.x = (destLeft + destWidth) - (point.x - destLeft);
                        } else if (point.x >= destLeft + (destWidth / 2)) {
                            point.x = destLeft + (destLeft + destWidth - point.x);
                        }
                        point.ratioX = (point.x - destLeft) / destWidth;
                        point.ratioY = (point.y - destTop) / destHeight;
                    }
                }
            }
        }
        this.updateFHDCurPts();
    }

    private pointsVerticalFlip(): void {
        const parent: ImageEditor = this.parent;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            if (parent.pointColl[n as number].shapeFlip !== parent.transform.currFlipState) {
                parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
                this.pointCounter = 0;
                const len: number = parent.points.length;
                for (let l: number = 0; l < len; l++) {
                    const point: Point = parent.points[l as number];
                    if (point.y <= destTop + (destHeight / 2)) {
                        point.y = (destTop + destHeight) - (point.y - destTop);
                    } else if (point.y >= destTop + (destHeight / 2)) {
                        point.y = destTop + (destTop + destHeight - point.y);
                    }
                    point.ratioX = (point.x - destLeft) / destWidth;
                    point.ratioY = (point.y - destTop) / destHeight;
                }
                parent.pointColl[n as number].shapeFlip = parent.transform.currFlipState;
            }
        }
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            if (this.selPointColl[n as number]) {
                if (this.selPointColl[n as number].shapeFlip !== parent.transform.currFlipState) {
                    this.selPoints = extend([], this.selPointColl[n as number].points, []) as Point[];
                    this.pointCounter = 0;
                    const len: number = this.selPoints.length;
                    for (let l: number = 0; l < len; l++) {
                        const point: Point = this.selPoints[l as number];
                        if (point.y <= destTop + (destHeight / 2)) {
                            point.y = (destTop + destHeight) - (point.y - destTop);
                        } else if (point.y >= destTop + (destHeight / 2)) {
                            point.y = destTop + (destTop + destHeight - point.y);
                        }
                        point.ratioX = (point.x - destLeft) / destWidth;
                        point.ratioY = (point.y - destTop) / destHeight;
                    }
                }
            }
        }
        this.updateFHDCurPts();
    }

    private updateFHDColl(isPreventApply?: boolean): void {
        const parent: ImageEditor = this.parent;
        const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop,
            width: parent.img.destWidth, height: parent.img.destHeight};
        parent.notify('shape', { prop: 'straightenShapes', onPropertyChange: false});
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        for (let i: number = 0, iLen: number = parent.objColl.length; i < iLen; i++) {
            const currObj: SelectionPoint = parent.objColl[i as number];
            if (currObj.shape === 'line' || currObj.shape === 'arrow') {
                parent.notify('shape', { prop: 'straightenShapePoints', value: {obj: currObj, isReverse: true }});
            } else if (currObj.shape === 'path') {
                const temp: number = parent.transform.straighten;
                parent.transform.straighten = -parent.transform.straighten;
                parent.notify('shape', { prop: 'straightenPath', onPropertyChange: false, value: {obj: currObj }});
                parent.transform.straighten = temp;
            }
            currObj.imageRatio = {startX: ((currObj.activePoint.startX - destLeft) /
            destWidth), startY: ((currObj.activePoint.startY - destTop) / destHeight),
            endX: ((currObj.activePoint.endX - destLeft) / destWidth),
            endY: ((currObj.activePoint.endY - destTop) / destHeight),
            width: destWidth / currObj.activePoint.width, height: destHeight /
            currObj.activePoint.height };
            if (currObj.shape === 'path') {
                for (let j: number = 0, jLen: number = currObj.pointColl.length; j < jLen; j++) {
                    currObj.pointColl[j as number].ratioX =
                        (currObj.pointColl[j as number].x - destLeft) / destWidth;
                    currObj.pointColl[j as number].ratioY =
                        (currObj.pointColl[j as number].y - destTop) / destHeight;
                }
            }
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        }
        if (parent.freehandCounter > 0 && parent.transform.straighten !== 0) {
            const temp: number = parent.transform.straighten;
            parent.transform.straighten = -parent.transform.straighten;
            parent.notify('shape', { prop: 'straightenFHD', onPropertyChange: false});
            parent.transform.straighten = temp;
        }
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0;
            const len: number = parent.points.length;
            for (let l: number = 0; l < len; l++) {
                const point: Point = parent.points[l as number];
                point.ratioX = (point.x - destLeft) / destWidth;
                point.ratioY = (point.y - destTop) / destHeight;
            }
        }
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            if (this.selPointColl[n as number]) {
                this.selPoints = extend([], this.selPointColl[n as number].points, []) as Point[];
                this.pointCounter = 0;
                const len: number = this.selPoints.length;
                for (let l: number = 0; l < len; l++) {
                    const point: Point = this.selPoints[l as number];
                    point.ratioX = (point.x - destLeft) / destWidth;
                    point.ratioY = (point.y - destTop) / destHeight;
                }
            }
        }
        if (this.straightenPoint.x && this.straightenPoint.y) {
            this.straightenPoint.ratioX = (this.straightenPoint.x - destLeft) / destWidth;
            this.straightenPoint.ratioY = (this.straightenPoint.y - destTop) / destHeight;
        }
        parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
        parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: { isPreventApply: isPreventApply } });
        parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: { isPreventApply: isPreventApply } });
    }

    private panFHDColl(xDiff: number, yDiff: number, panRegion: string): void {
        const parent: ImageEditor = this.parent;
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
            this.pointCounter = 0;
            const len: number = parent.points.length;
            for (let l: number = 0; l < len; l++) {
                const point: Point = parent.points[l as number];
                if (panRegion === '' || panRegion === 'vertical') {
                    point.x += xDiff;
                } else {
                    point.x -= xDiff;
                }
                if (panRegion === '' || panRegion === 'horizontal') {
                    point.y += yDiff;
                }
                else {
                    point.y -= yDiff;
                }
            }
        }
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            if (this.selPointColl[n as number]) {
                this.selPoints = extend([], this.selPointColl[n as number].points, []) as Point[];
                this.pointCounter = 0;
                const len: number = this.selPoints.length;
                for (let l: number = 0; l < len; l++) {
                    const point: Point = this.selPoints[l as number];
                    if (panRegion === '' || panRegion === 'vertical') {
                        point.x += xDiff;
                    } else {
                        point.x -= xDiff;
                    }
                    if (panRegion === '' || panRegion === 'horizontal') {
                        point.y += yDiff;
                    }
                    else {
                        point.y -= yDiff;
                    }
                }
            }
        }
        if (this.straightenPoint.x && this.straightenPoint.y) {
            if (panRegion === '' || panRegion === 'vertical') {
                this.straightenPoint.x += xDiff;
            } else {
                this.straightenPoint.x -= xDiff;
            }
            if (panRegion === '' || panRegion === 'horizontal') {
                this.straightenPoint.y += yDiff;
            }
            else {
                this.straightenPoint.y -= yDiff;
            }
        }
        this.freehandRedraw(this.lowerContext, null);
    }

    private freeHandDraw(value: boolean): void {
        const parent: ImageEditor = this.parent;
        if (value) {
            parent.points = [];
            this.dummyPoints = [];
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.togglePen = true;
            parent.upperCanvas.style.cursor = parent.cursor = 'crosshair';
            parent.upperCanvas.style.display = 'block';
            if (isNullOrUndefined(parent.activeObj.strokeSettings)) {
                const obj: Object = {strokeSettings: {} as StrokeSettings };
                parent.notify('shape', { prop: 'getStrokeSettings', onPropertyChange: false,
                    value: {obj: obj }});
                parent.activeObj.strokeSettings = obj['strokeSettings'];
            }
            if (isNullOrUndefined(parent.activeObj.strokeSettings.strokeWidth)) {
                parent.activeObj.strokeSettings.strokeWidth = 2;
            }
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'pen',
                    isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
            } else {
                parent.updateToolbar(parent.element, 'pen');
            }
        } else {
            parent.upperCanvas.style.cursor = parent.cursor = 'default';
            parent.notify('shape', { prop: 'apply', onPropertyChange: false, value: {shape: null, obj: null, canvas: null}});
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
                parent.notify('toolbar', {prop: 'setCurrentToolbar', value: {type: 'main' }});
            } else {
                parent.updateToolbar(parent.element, 'imageLoaded');
            }
            parent.notify('selection', {prop: 'setFreehandDrawCustomized', value: {isFreehandDrawCustomized: false }});
        }
    }

    private isFHDIdx(index: number, obj?: Object): boolean {
        let isIndex: boolean = false;
        for (let i: number = 0; i < this.parent.freehandCounter; i++) {
            if (this.parent.pointColl[i as number].id &&
                parseInt(this.parent.pointColl[i as number].id.split('_')[1], 10) - 1 === index) {
                isIndex = true;
                break;
            }
        }
        if (obj) { obj['isIndex'] = isIndex; }
        return isIndex;
    }

    private updateCropPtsForSel(): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            const obj: Object = {selPointColl: extend([], this.selPointColl) };
            if (obj['selPointColl'][n as number]) {
                this.selPoints = extend([], obj['selPointColl'][n as number].points, []) as Point[];
                this.pointCounter = 0;
                const len: number = this.selPoints.length;
                for (let l: number = 0; l < len; l++) {
                    const point: Point = this.selPoints[l as number];
                    point.ratioX = (point.x - actPoint.startX) / actPoint.width;
                    point.ratioY = (point.y - actPoint.startY) / actPoint.height;
                }
            }
        }
    }

    private triggerShapeChanging(shapeChangingArgs: ShapeChangeEventArgs) : void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const parent: ImageEditor = this.parent; const point: any = parent.pointColl[this.fhdSelIdx];
        if (isBlazor() && parent.events && parent.events.shapeChanging.hasDelegate === true) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShape',  shapeChangingArgs, null) as any).then((shapeChangingArgs: ShapeChangeEventArgs) => {
                this.penStrokeWidth = shapeChangingArgs.currentShapeSettings.strokeWidth;
                if (parent.activeObj.strokeSettings.strokeColor !== shapeChangingArgs.currentShapeSettings.strokeColor) {
                    parent.activeObj.strokeSettings.strokeColor = shapeChangingArgs.currentShapeSettings.strokeColor;
                    const penColorElement: HTMLElement = parent.element.querySelector('.e-ie-toolbar-e-pen-color .e-dropdownbtn-preview') as HTMLElement;
                    if (penColorElement) {
                        penColorElement.style.background = shapeChangingArgs.currentShapeSettings.strokeColor;
                    }
                }
                if (this.fhdSelID) {
                    point.strokeColor = shapeChangingArgs.currentShapeSettings.strokeColor;
                    point.strokeWidth = shapeChangingArgs.currentShapeSettings.strokeWidth;
                    point.points = shapeChangingArgs.currentShapeSettings.points;
                    point.opacity = shapeChangingArgs.currentShapeSettings.opacity;
                }
                if (shapeChangingArgs.action === 'select') {
                    this.freehandRedraw(this.upperContext);
                    parent.updateToolbar(parent.element, 'imageLoaded');
                    parent.updateToolbar(parent.element, 'pen');
                }
            });
        } else {
            parent.trigger('shapeChanging', shapeChangingArgs);
            this.penStrokeWidth = shapeChangingArgs.currentShapeSettings.strokeWidth;
            if (parent.activeObj.strokeSettings.strokeColor !== shapeChangingArgs.currentShapeSettings.strokeColor) {
                parent.activeObj.strokeSettings.strokeColor = shapeChangingArgs.currentShapeSettings.strokeColor;
                parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false });
            }
            if (this.fhdSelID) {
                point.strokeColor = shapeChangingArgs.currentShapeSettings.strokeColor;
                point.strokeWidth = shapeChangingArgs.currentShapeSettings.strokeWidth;
                point.points = shapeChangingArgs.currentShapeSettings.points;
                point.opacity = shapeChangingArgs.currentShapeSettings.opacity;
            }
            if (shapeChangingArgs.action === 'select') {
                this.freehandRedraw(this.upperContext);
                parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'pen',
                    isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
            }
        }
    }

    private setCenterSelPoints(): void {
        const parent: ImageEditor = this.parent;
        const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop,
            width: parent.img.destWidth, height: parent.img.destHeight};
        parent.notify('shape', { prop: 'straightenShapes', onPropertyChange: false});
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        if (isNullOrUndefined(this.prevStraightenObj) ||
            (JSON.stringify(this.prevStraightenObj.activePoint) !== JSON.stringify(actPoint))) {
            this.straightenPoint = { x: actPoint.startX + (actPoint.width / 2),
                y: actPoint.startY + (actPoint.height / 2),
                ratioX: (actPoint.startX + (actPoint.width / 2) - destLeft) / destWidth,
                ratioY: (actPoint.startY + (actPoint.height / 2) - destTop) / destHeight };
            this.prevStraightenObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            this.straightenPointAngle = parent.transform.straighten;
        }
        parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
        parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
    }
}
