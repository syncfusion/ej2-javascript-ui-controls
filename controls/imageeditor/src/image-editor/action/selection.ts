import { Browser, EventHandler, extend, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ActivePoint, Dimension } from '@syncfusion/ej2-inputs';
import { BeforeSaveEventArgs, CropSelectionSettings, CurrentObject, ImageEditor, ImageEditorClickEventArgs, Point, SelectionChangeEventArgs, SelectionPoint, ShapeChangeEventArgs, ShapeSettings, ShapeType, StrokeSettings, TextSettings, ZoomTrigger } from '../index';
export class Selection {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private diffPoint: Point = {x: 0, y: 0};  // updates resize points
    private oldPoint: Point = {} as Point;
    private isTouch: boolean = false;
    private isObjSelected: boolean = false;
    private isFhdPoint: boolean = false; // Specifies whether mouse cursor is on freehand drawing point or not
    private dragPoint: ActivePoint = {startX: 0, startY: 0, endX: 0, endY: 0};  // updates drag start and end points in mousedown and mousemove
    private isShapeInserted: boolean = false;
    private tempActiveObj: SelectionPoint = {activePoint: {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0},
        flipObjColl: [], triangle: [], triangleRatio: []} as SelectionPoint; // for undo redo
    private isFirstMove: boolean = false; // for pinch zoom
    private startTouches: Point[] = []; // for pinch zoom
    private tempTouches: Point[] = []; // for pinch zoom
    private currMousePoint: Point = {x: 0, y: 0}; // To prevent mouse move event on pinch zoom
    private cursorTargetId: string = '';
    private isPreventDragging: boolean = false; // Shapes dragging is prevented when crop region is inside shape points
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private timer: any; // mobile mode text area rendering on long touch
    private tempObjColl: SelectionPoint[]; // for undo redo
    private dragElement: string = '';
    private textRow: number = 1; // text area row count
    private mouseDownPoint: Point = {x: 0, y: 0};
    private previousPoint: Point = {x: 0, y: 0};  // updates prev x and y points in mouseMove
    private zoomType: string = 'Toolbar';
    private isInitialTextEdited: boolean = false;
    private dragCanvas: boolean = false;
    private isFhdCustomized: boolean = false;
    private touchEndPoint: Point = {} as Point;
    private panDown: Point; // To store pan down point
    private isFhdEditing: boolean = false; // Specifies whether freehand drawing is in editing mode or not
    private currentDrawingShape: string = '';
    private initialPrevObj: CurrentObject = {} as CurrentObject;
    private isCropSelection: boolean;
    private isPan: boolean;
    private pathAdjustedIndex: number;
    private touchTime: number = 0;
    private resizedElement: string = '';
    private shapeResizingArgs: ShapeChangeEventArgs;
    private shapeMovingArgs: ShapeChangeEventArgs;
    private selectionResizingArgs: SelectionChangeEventArgs;

    constructor(parent: ImageEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on('selection', this.selection, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('selection', this.selection);
        this.parent.off('destroyed', this.destroy);
    }

    private selection(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        this.updatePrivateVariables();
        switch (args.prop) {
        case 'mouse-up':
            this.selMouseUpEvent();
            break;
        case 'setCursor':
            this.setCursor(args.value['x'], args.value['y']);
            break;
        case 'updateActivePoint':
            this.updateActivePoint(args.value['x'], args.value['y'], args.value['isCropSelection']);
            break;
        case 'updateCursorStyles':
            this.updateCursorStyles(args.value['x'], args.value['y'], args.value['type']);
            break;
        case 'setTextSelection':
            this.setTextSelection(args.value['width'], args.value['height']);
            break;
        case 'setActivePoint':
            this.setActivePoint(args.value['startX'], args.value['startY']);
            break;
        case 'clearSelection':
            this.clearSelection();
            break;
        case 'calcShapeRatio':
            this.calcShapeRatio(args.value['x'], args.value['y'], args.value['imgWidth'], args.value['imgHeight']);
            break;
        case 'applyCurrShape':
            this.applyCurrShape(args.value['isShapeClick']);
            break;
        case 'tab':
            this.performTabAction();
            break;
        case 'setDragDirection':
            this.setDragDirection(args.value['width'], args.value['height']);
            break;
        case 'clearUpperCanvas':
            if (this.isTouch) {
                setTimeout(() => {
                    this.parent.upperCanvas.getContext('2d').clearRect(0, 0, this.parent.upperCanvas.width, this.parent.upperCanvas.height);
                }, 550);
            }
            break;
        case 'resetFreehandDrawVariables':
            this.isFhdEditing = this.isFhdPoint = false;
            break;
        case 'isShapeInserted':
            this.isShapeInserted = args.value['bool'];
            break;
        case 'redrawShape':
            this.redrawShape(args.value['obj']);
            break;
        case 'setTextBoxStylesToActObj':
            this.setTextBoxStylesToActObj();
            break;
        case 'mouseDownEventHandler':
            this.mouseDownEventHandler(args.value['e']);
            break;
        case 'mouseMoveEventHandler':
            this.mouseMoveEventHandler(args.value['e']);
            break;
        case 'mouseUpEventHandler':
            this.mouseUpEventHandler(args.value['e']);
            break;
        case 'canvasMouseDownHandler':
            this.canvasMouseDownHandler(args.value['e']);
            break;
        case 'canvasMouseMoveHandler':
            this.canvasMouseMoveHandler(args.value['e']);
            break;
        case 'canvasMouseUpHandler':
            this.canvasMouseUpHandler(args.value['e']);
            break;
        case 'touchStartHandler':
            this.touchStartHandler(args.value['e']);
            break;
        case 'keyDownEventHandler':
            this.keyDownEventHandler(args.value['e']);
            break;
        case 'handleScroll':
            this.handleScroll(args.value['e']);
            break;
        case 'textKeyDown':
            setTimeout(this.textKeyDown.bind(this), 1, args.value['e']);
            break;
        case 'deleteItem':
            this.deleteItem();
            break;
        case 'updatePrevShapeSettings':
            this.updatePrevShapeSettings(args.value['obj']);
            break;
        case 'getZoomType':
            args.value['obj']['zoomType'] = this.zoomType;
            break;
        case 'setZoomType':
            this.zoomType = args.value['zoomType'];
            break;
        case 'setInitialTextEdit':
            this.isInitialTextEdited = args.value['bool'];
            break;
        case 'setDragCanvas':
            this.dragCanvas = args.value['bool'];
            break;
        case 'setFreehandDrawCustomized':
            this.isFhdCustomized = args.value['isFreehandDrawCustomized'];
            break;
        case 'setTouchEndPoint':
            this.touchEndPoint.x = args.value['x'];
            this.touchEndPoint.y = args.value['y'];
            break;
        case 'getPanDown':
            args.value['obj']['panDown'] = this.panDown;
            break;
        case 'setPanDown':
            this.panDown = args.value['panDown'];
            break;
        case 'getFreehandDrawEditing':
            args.value['obj']['bool'] = this.isFhdEditing;
            break;
        case 'setFreehandDrawEditing':
            this.isFhdEditing = args.value['bool'];
            break;
        case 'getTempActObj':
            args.value['obj']['tempObj'] = this.tempActiveObj;
            break;
        case 'setTempActObj':
            this.tempActiveObj = args.value['obj'];
            break;
        case 'isInside':
            this.isInside(args.value['x'], args.value['y'], args.value['z1'], args.value['z2'], args.value['z3'], args.value['z4']);
            break;
        case 'setDragElement':
            this.dragElement = args.value['value'];
            break;
        case 'setObjSelected':
            this.isObjSelected = args.value['bool'];
            break;
        case 'adjustActObjForLineArrow':
            this.adjustActObjForLineArrow(args.value['obj']);
            break;
        case 'findTarget':
            this.findTarget(args.value['x'], args.value['y'], args.value['type']);
            break;
        case 'getCurrentFlipState':
            this.getCurrentFlipState();
            break;
        case 'setDragWidth':
            this.setDragWidth(args.value['width']);
            break;
        case 'setDragHeight':
            this.setDragHeight(args.value['setDragHeight']);
            break;
        case 'annotate':
            this.currentDrawingShape = args.value['shape'];
            if (args.value['shape'] === 'text') {
                this.parent.activeObj.textSettings.fontSize = 100;
                this.parent.activeObj.keyHistory = 'Enter Text';
                this.parent.notify('shape', { prop: 'initializeTextShape', onPropertyChange: false,
                    value: {text: null, fontFamily: null, fontSize: null, bold: null, italic: null, strokeColor: null }});
            } else if (args.value['shape'] === 'path') {
                this.parent.activeObj.pointColl = [];
            }
            break;
        case 'getCurrentDrawingShape':
            args.value['obj']['shape'] = this.currentDrawingShape;
            break;
        case 'setCurrentDrawingShape':
            this.currentDrawingShape = args.value['value'];
            break;
        case 'getTransRotationPoint':
            this.getTransRotationPoint(args.value['obj'], args.value['object']);
            break;
        case 'adjustNEPoints':
            this.adjustNEPoints(args.value['rectangle'], args.value['x'], args.value['y'], args.value['angle']);
            break;
        case 'adjustRotationPoints':
            this.adjustRotationPoints(args.value['rectangle'], args.value['x'], args.value['y'], args.value['angle']);
            break;
        case 'getResizeDirection':
            this.getResizeDirection(args.value['rectangle'], args.value['x'], args.value['y'], args.value['angle']);
            break;
        case 'setResizedElement':
            this.resizedElement = args.value['value'];
            break;
        case 'reset':
            this.reset();
            break;
        case 'unWireEvent':
            this.unwireEvent();
            break;
        case 'updPtCollForShpRot':
            this.updPtCollForShpRot(args.value['obj']);
            break;
        }
    }

    public getModuleName(): string {
        return 'selection';
    }

    private updatePrivateVariables(): void {
        const parent: ImageEditor = this.parent;
        if (parent.lowerCanvas) {this.lowerContext = parent.lowerCanvas.getContext('2d'); }
        if (parent.upperCanvas) {this.upperContext = parent.upperCanvas.getContext('2d'); }
    }

    private reset(): void {
        this.diffPoint = {x: 0, y: 0}; this.oldPoint = {} as Point;
        this.isTouch = this.isObjSelected = this.isFhdPoint = this.isShapeInserted = false;
        this.dragPoint = {startX: 0, startY: 0, endX: 0, endY: 0};
        this.tempActiveObj = {activePoint: {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0},
            flipObjColl: [], triangle: [], triangleRatio: []} as SelectionPoint;
        this.isFirstMove = false; this.cursorTargetId = this.dragElement = '';
        this.startTouches = []; this.tempTouches = []; this.currMousePoint = {x: 0, y: 0};
        this.isPreventDragging = false; this.timer = undefined; this.tempObjColl = undefined;
        this.textRow = 1; this.mouseDownPoint = {x: 0, y: 0}; this.previousPoint = {x: 0, y: 0};
        this.zoomType = 'Toolbar'; this.isInitialTextEdited = false; this.dragCanvas = false;
        this.isFhdCustomized = false; this.touchEndPoint = {} as Point; this.panDown = null;
        this.isFhdEditing = false; this.pathAdjustedIndex = null; this.touchTime = 0;
        this.currentDrawingShape = ''; this.initialPrevObj = {} as CurrentObject; this.resizedElement = '';
    }

    private performTabAction(): void {
        if (this.parent.textArea.style.display === 'block') {
            const allowUndoRedoPush: boolean = this.applyCurrShape(false);
            this.parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: { x: null, y: null, isMouseDown: null } });
            if (allowUndoRedoPush) {
                this.parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
            }
        }
    }

    private selMouseUpEvent(): void {
        this.oldPoint.x = undefined; this.oldPoint.y = undefined;
    }

    private getMouseCursor(actObj: SelectionPoint, x: number, y: number, isCropSelection: boolean, isApply: boolean): string {
        const rotationCirclePoint: Point = this.getTransRotationPoint(actObj);
        let cursor: string = 'default'; const ratio: number = isApply ? 0 : ((actObj.topLeftCircle.radius * 2));
        if (x >= (actObj.topLeftCircle.startX - ratio) &&
            x <= (actObj.topLeftCircle.startX + ratio) &&
            y >= (actObj.topLeftCircle.startY - ratio) &&
            y <= (actObj.topLeftCircle.startY + ratio)) {
            cursor = 'nw-resize';
        }
        else if (x >= (actObj.topLeftCircle.startX - ratio) &&
            x <= (actObj.topRightCircle.startX - ratio) &&
            y >= (actObj.topCenterCircle.startY - ratio) &&
            y <= (actObj.topCenterCircle.startY + ratio)) {
            cursor = 'n-resize';
        }
        else if (x >= (actObj.topRightCircle.startX - ratio) &&
            x <= (actObj.topRightCircle.startX + ratio) &&
            y >= (actObj.topRightCircle.startY - ratio) &&
            y <= (actObj.topRightCircle.startY + ratio)) {
            cursor = 'ne-resize';
        }
        else if (x >= (actObj.centerLeftCircle.startX - ratio) &&
            x <= (actObj.centerLeftCircle.startX + ratio) &&
            y >= (actObj.topLeftCircle.startY - ratio) &&
            y <= (actObj.bottomLeftCircle.startY - ratio)) {
            cursor = 'w-resize';
        }
        else if (x >= (actObj.centerRightCircle.startX - ratio) &&
            x <= (actObj.centerRightCircle.startX + ratio) &&
            y >= (actObj.topRightCircle.startY - ratio) &&
            y <= (actObj.bottomRightCircle.startY - ratio)) {
            cursor = 'e-resize';
        }
        else if (x >= (actObj.bottomLeftCircle.startX - ratio) &&
            x <= (actObj.bottomLeftCircle.startX + ratio) &&
            y >= (actObj.bottomLeftCircle.startY - ratio) &&
            y <= (actObj.bottomLeftCircle.startY + ratio)) {
            cursor = 'sw-resize';
        }
        else if (x >= (actObj.bottomLeftCircle.startX - ratio) &&
            x <= (actObj.bottomRightCircle.startX - ratio) &&
            y >= (actObj.bottomCenterCircle.startY - ratio) &&
            y <= (actObj.bottomCenterCircle.startY + ratio)) {
            cursor = 's-resize';
        }
        else if (x >= (actObj.bottomRightCircle.startX - ratio) &&
            x <= (actObj.bottomRightCircle.startX + ratio) &&
            y >= (actObj.bottomRightCircle.startY - ratio) &&
            y <= (actObj.bottomRightCircle.startY + ratio)) {
            cursor = 'se-resize';
        }
        else if ((x >= actObj.activePoint.startX &&
            x <= actObj.activePoint.endX) && (y >= actObj.activePoint.startY &&
            y <= actObj.activePoint.endY)) {
            if (isCropSelection) {cursor = 'grab'; }
            else {cursor = 'move'; }
        }
        else if (rotationCirclePoint && !isApply &&
            x >= (rotationCirclePoint.x - (actObj.bottomCenterCircle.radius + 2)) &&
            x <= rotationCirclePoint.x + (actObj.bottomCenterCircle.radius + 2) &&
            y >= rotationCirclePoint.y - (actObj.bottomCenterCircle.radius + 2) &&
            y <= rotationCirclePoint.y + (actObj.bottomCenterCircle.radius + 2)) {
            cursor = 'grabbing';
        }
        else {
            cursor = 'default';
        }
        return cursor;
    }

    private setCursor(x: number, y: number): void {
        const parent: ImageEditor = this.parent;
        const lowerCanvas: HTMLCanvasElement = document.querySelector('#' + parent.element.id + '_lowerCanvas');
        const upperCanvas: HTMLCanvasElement = document.querySelector('#' + parent.element.id + '_upperCanvas');
        let isCropSelection: boolean = false; let splitWords: string[];
        if (this.currentDrawingShape !== '') {
            upperCanvas.style.cursor = parent.cursor = 'crosshair';
            return;
        }
        if (parent.currObjType.isDragging) {
            if (this.dragElement === '') {
                upperCanvas.style.cursor = parent.cursor = 'move';
            } else {
                upperCanvas.style.cursor = parent.cursor = this.dragElement;
            }
            return;
        }
        if (parent.activeObj.horTopLine !== undefined) {
            if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
            if (splitWords === undefined && parent.currObjType.isCustomCrop) {
                isCropSelection = true;
            } else if (splitWords !== undefined && splitWords[0] === 'crop'){
                isCropSelection = true;
            }
            if (!isCropSelection && parent.togglePan) {
                lowerCanvas.style.cursor = upperCanvas.style.cursor = parent.cursor = 'grab';
            }
            const cursor: string = upperCanvas.style.cursor;
            const actObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            this.cursorTargetId = actObj.currIndex;
            let degree: number;
            if (actObj.shapeDegree === 0) {degree = parent.transform.degree; }
            else {degree = parent.transform.degree - actObj.shapeDegree; }
            if (degree < 0) {degree = 360 + degree; }
            if (actObj.shape === 'line' || actObj.shape === 'arrow') {
                this.setCursorForLineArrow(actObj, x, y, upperCanvas);
            } else if (actObj.shape === 'path') {
                this.setCursorForPath(actObj, x, y, upperCanvas);
            } else if (!isNullOrUndefined(actObj.rotatedAngle) && actObj.rotatedAngle !== 0) {
                this.setCursorForRotatedObject(actObj, x, y, upperCanvas);
            } else {
                upperCanvas.style.cursor = parent.cursor = this.getMouseCursor(actObj, x, y, isCropSelection, false);
                if ((actObj.shape === 'text') && (parent.cursor === 'n-resize' ||
                    parent.cursor === 's-resize' || parent.cursor === 'e-resize' ||
                    parent.cursor === 'w-resize')) {
                    upperCanvas.style.cursor = parent.cursor = 'move';
                }
            }
            if (cursor === 'default' && parent.cursor === 'default' && isCropSelection) {
                upperCanvas.style.cursor = parent.cursor = 'grab';
            }
            if (cursor === 'grab' && parent.cursor === 'default') {
                upperCanvas.style.cursor = parent.cursor = 'grab';
            }
        }
        else if (parent.togglePan && !parent.togglePen) {
            lowerCanvas.style.cursor = upperCanvas.style.cursor = parent.cursor = 'grab';
        } else {
            if (parent.currObjType.isCustomCrop || parent.togglePen) {upperCanvas.style.cursor = parent.cursor = 'crosshair'; }
            else {upperCanvas.style.cursor = parent.cursor = 'default'; }
        }
        if (parent.cursor === 'default' || parent.cursor === 'grab') {
            const cursor: string = upperCanvas.style.cursor;
            if (parent.objColl.length > 0 && (parent.cursor !== 'grab' || !isCropSelection)) {
                this.setCursorFromObj(x, y, parent.objColl, upperCanvas, isCropSelection);
            }
            if (cursor === 'grab' && parent.cursor === 'default') {
                upperCanvas.style.cursor = parent.cursor = 'grab';
            }
        }
        if ((parent.cursor === 'default' || parent.cursor === 'grab')
            && parent.pointColl[0] && (parent.cursor !== 'grab' || !isCropSelection)
            && !parent.currObjType.isDragging && !parent.currObjType.isResize) {
            this.setCursorForFreehandDrawing(x, y, upperCanvas);
        }
    }

    private setCursorForPath(actObj: SelectionPoint, x: number, y: number, upperCanvas: HTMLCanvasElement): string {
        this.setCursorForLineArrow(actObj, x, y, upperCanvas);
        const parent: ImageEditor = this.parent;
        if (parent.cursor === 'default') {
            const obj: SelectionPoint = extend({}, actObj, null, true) as SelectionPoint; let isMove: boolean = false;
            for (let i: number = 1; i < actObj.pointColl.length; i++) {
                if (isMove) {
                    break;
                }
                obj.activePoint.startX = actObj.pointColl[i - 1].x; obj.activePoint.startY = actObj.pointColl[i - 1].y;
                obj.activePoint.endX = actObj.pointColl[i as number].x; obj.activePoint.endY = actObj.pointColl[i as number].y;
                parent.notify('shape', { prop: 'setPointCollForLineArrow', onPropertyChange: false,
                    value: {obj: obj }});
                for (let j: number = 0; j < obj.pointColl.length; j++) {
                    const point: Point = obj.pointColl[j as number];
                    if (!isNullOrUndefined(point.x - (actObj.topLeftCircle.radius * 2)) &&
                        !isNullOrUndefined(point.x + (actObj.topLeftCircle.radius * 2)) &&
                        !isNullOrUndefined(point.y - (actObj.topLeftCircle.radius * 2)) &&
                        !isNullOrUndefined(point.y + (actObj.topLeftCircle.radius * 2)) &&
                        x >= (point.x - (actObj.topLeftCircle.radius * 2)) &&
                        x <= (point.x + (actObj.topLeftCircle.radius * 2)) &&
                        y >= (point.y - (actObj.topLeftCircle.radius * 2)) &&
                        y <= (point.y + (actObj.topLeftCircle.radius * 2))) {
                        upperCanvas.style.cursor = parent.cursor = 'move'; isMove = true;
                        break;
                    } else {
                        upperCanvas.style.cursor = parent.cursor = 'default';
                    }
                }
            }
        }
        return parent.cursor;
    }

    private setCursorForLineArrow(actObj: SelectionPoint, x: number, y: number, upperCanvas: HTMLCanvasElement): number {
        let index: number;
        for (let i: number = 0; i < actObj.pointColl.length; i++) {
            const point: Point = actObj.pointColl[i as number];
            if (x >= (point.x - (actObj.topLeftCircle.radius * 2)) && x <= (point.x + (actObj.topLeftCircle.radius * 2)) &&
                y >= (point.y - (actObj.topLeftCircle.radius * 2)) && y <= (point.y + (actObj.topLeftCircle.radius * 2))) {
                upperCanvas.style.cursor = this.parent.cursor = 'move'; index = i;
                break;
            } else {
                upperCanvas.style.cursor = this.parent.cursor = 'default';
            }
        }
        return index;
    }

    private setCursorForRotatedObject(actObj: SelectionPoint, x: number, y: number, upperCanvas: HTMLCanvasElement): string {
        this.resizedElement = '';  const parent: ImageEditor = this.parent;
        if (x >= (actObj.horTopLinePointColl[0].x - (actObj.bottomCenterCircle.radius + 2)) &&
            x <= (actObj.horTopLinePointColl[0].x + (actObj.bottomCenterCircle.radius + 2)) &&
            y >= (actObj.horTopLinePointColl[0].y - (actObj.bottomCenterCircle.radius + 2)) &&
            y <= (actObj.horTopLinePointColl[0].y + (actObj.bottomCenterCircle.radius + 2))) {
            upperCanvas.style.cursor = parent.cursor = 'nw-resize';
        }
        else if (x >= (actObj.horTopLinePointColl[Math.round(actObj.horTopLinePointColl.length / 2)].x - 5) &&
            x <= (actObj.horTopLinePointColl[Math.round(actObj.horTopLinePointColl.length / 2)].x + 5) &&
            y >= (actObj.horTopLinePointColl[Math.round(actObj.horTopLinePointColl.length / 2)].y - 5) &&
            y <= (actObj.horTopLinePointColl[Math.round(actObj.horTopLinePointColl.length / 2)].y + 5)) {
            upperCanvas.style.cursor = parent.cursor = this.resizedElement = 'n-resize';
        }
        else if (x >= (actObj.horTopLinePointColl[Math.round(actObj.horTopLinePointColl.length - 1)].x -
            (actObj.bottomCenterCircle.radius + 2)) &&
            x <= (actObj.horTopLinePointColl[Math.round(actObj.horTopLinePointColl.length - 1)].x +
            (actObj.bottomCenterCircle.radius + 2)) &&
            y >= (actObj.horTopLinePointColl[Math.round(actObj.horTopLinePointColl.length - 1)].y -
            (actObj.bottomCenterCircle.radius + 2)) &&
            y <= (actObj.horTopLinePointColl[Math.round(actObj.horTopLinePointColl.length - 1)].y +
            (actObj.bottomCenterCircle.radius + 2))) {
            upperCanvas.style.cursor = parent.cursor = 'ne-resize';
        }
        else if (x >= (actObj.verLeftLinePointColl[Math.round(actObj.verLeftLinePointColl.length / 2)].x - 5) &&
            x <= (actObj.verLeftLinePointColl[Math.round(actObj.verLeftLinePointColl.length / 2)].x + 5) &&
            y >= (actObj.verLeftLinePointColl[Math.round(actObj.verLeftLinePointColl.length / 2)].y - 5)
            && y <= (actObj.verLeftLinePointColl[Math.round(actObj.verLeftLinePointColl.length / 2)].y + 5)) {
            upperCanvas.style.cursor = parent.cursor = this.resizedElement = 'w-resize';
        }
        else if (x >= (actObj.verRightLinePointColl[Math.round(actObj.verRightLinePointColl.length / 2)].x - 5) &&
            x <= (actObj.verRightLinePointColl[Math.round(actObj.verRightLinePointColl.length / 2)].x + 5)
            && y >= (actObj.verRightLinePointColl[Math.round(actObj.verRightLinePointColl.length / 2)].y - 5) &&
            y <= (actObj.verRightLinePointColl[Math.round(actObj.verRightLinePointColl.length / 2)].y + 5)) {
            upperCanvas.style.cursor = parent.cursor = this.resizedElement = 'e-resize';
        }
        else if (x >= (actObj.horBottomLinePointColl[0].x - (actObj.bottomCenterCircle.radius + 2)) &&
            x <= (actObj.horBottomLinePointColl[0].x + (actObj.bottomCenterCircle.radius + 2)) &&
            y >= (actObj.horBottomLinePointColl[0].y - (actObj.bottomCenterCircle.radius + 2)) &&
            y <= (actObj.horBottomLinePointColl[0].y + (actObj.bottomCenterCircle.radius + 2))) {
            upperCanvas.style.cursor = parent.cursor = 'sw-resize';
        }
        else if (x >= (actObj.horBottomLinePointColl[Math.round(actObj.horBottomLinePointColl.length / 2)].x - 5) &&
            x <= (actObj.horBottomLinePointColl[Math.round(actObj.horBottomLinePointColl.length / 2)].x + 5) &&
            y >= (actObj.horBottomLinePointColl[Math.round(actObj.horBottomLinePointColl.length / 2)].y - 5) &&
            y <= (actObj.horBottomLinePointColl[Math.round(actObj.horBottomLinePointColl.length / 2)].y + 5)) {
            upperCanvas.style.cursor = parent.cursor = this.resizedElement = 's-resize';
        }
        else if (x >= (actObj.horBottomLinePointColl[Math.round(actObj.horBottomLinePointColl.length - 1)].x -
            (actObj.bottomCenterCircle.radius + 2)) &&
            x <= (actObj.horBottomLinePointColl[Math.round(actObj.horBottomLinePointColl.length - 1)].x +
            (actObj.bottomCenterCircle.radius + 2)) &&
            y >= (actObj.horBottomLinePointColl[Math.round(actObj.horBottomLinePointColl.length - 1)].y -
            (actObj.bottomCenterCircle.radius + 2)) &&
            y <= (actObj.horBottomLinePointColl[Math.round(actObj.horBottomLinePointColl.length - 1)].y +
            (actObj.bottomCenterCircle.radius + 2))) {
            upperCanvas.style.cursor = parent.cursor = 'se-resize';
        }
        else if (actObj.rotationCirclePointColl &&
            x >= (actObj.rotationCirclePointColl.x - (actObj.bottomCenterCircle.radius + 2)) &&
            x <= actObj.rotationCirclePointColl.x + (actObj.bottomCenterCircle.radius + 2) &&
            y >= actObj.rotationCirclePointColl.y - (actObj.bottomCenterCircle.radius + 2) &&
            y <= actObj.rotationCirclePointColl.y + (actObj.bottomCenterCircle.radius + 2)) {
            upperCanvas.style.cursor = parent.cursor = 'grabbing';
        }
        else {
            upperCanvas.style.cursor = parent.cursor = 'default';
            const isPointsInsideRectangle: boolean = this.getRectanglePoints(actObj.activePoint.startX,
                                                                             actObj.activePoint.startY,
                                                                             actObj.activePoint.width, actObj.activePoint.height,
                                                                             actObj.rotatedAngle * (180 / Math.PI ), x, y);
            if (isPointsInsideRectangle) {
                upperCanvas.style.cursor = parent.cursor = 'move';
            }
        }
        if (parent.cursor === 'default') {
            for (let i: number = 0, len: number = actObj.horTopLinePointColl.length; i < len; i++) {
                if (x >= (actObj.horTopLinePointColl[i as number].x - 5) &&
                    x <= (actObj.horTopLinePointColl[i as number].x + 5) &&
                    y >= (actObj.horTopLinePointColl[i as number].y - 5) &&
                    y <= (actObj.horTopLinePointColl[i as number].y + 5)) {
                    upperCanvas.style.cursor = parent.cursor = this.resizedElement = 'n-resize';
                    break;
                }
            }
        }
        if (parent.cursor === 'default') {
            for (let i: number = 0, len: number = actObj.horBottomLinePointColl.length; i < len; i++) {
                if (x >= (actObj.horBottomLinePointColl[i as number].x - 5) &&
                    x <= (actObj.horBottomLinePointColl[i as number].x + 5) &&
                    y >= (actObj.horBottomLinePointColl[i as number].y - 5) &&
                    y <= (actObj.horBottomLinePointColl[i as number].y + 5)) {
                    upperCanvas.style.cursor = parent.cursor = this.resizedElement = 's-resize';
                    break;
                }
            }
        }
        if (parent.cursor === 'default') {
            for (let i: number = 0, len: number = actObj.verLeftLinePointColl.length; i < len; i++) {
                if (x >= (actObj.verLeftLinePointColl[i as number].x - 5) &&
                    x <= (actObj.verLeftLinePointColl[i as number].x + 5) &&
                    y >= (actObj.verLeftLinePointColl[i as number].y - 5) &&
                    y <= (actObj.verLeftLinePointColl[i as number].y + 5)) {
                    upperCanvas.style.cursor = parent.cursor = this.resizedElement = 'w-resize';
                    break;
                }
            }
        }
        if (parent.cursor === 'default') {
            for (let i: number = 0, len: number = actObj.verRightLinePointColl.length; i < len; i++) {
                if (x >= (actObj.verRightLinePointColl[i as number].x - 5) &&
                    x <= (actObj.verRightLinePointColl[i as number].x + 5) &&
                    y >= (actObj.verRightLinePointColl[i as number].y - 5) &&
                    y <= (actObj.verRightLinePointColl[i as number].y + 5)) {
                    upperCanvas.style.cursor = parent.cursor = this.resizedElement = 'e-resize';
                    break;
                }
            }
        }
        this.adjustCursorStylesForRotatedState(actObj);
        return parent.cursor;
    }

    private adjustCursorStylesForRotatedState(actObj: SelectionPoint): string {
        const parent: ImageEditor = this.parent;
        let length: number = actObj.rotatedAngle * (180 / Math.PI);
        length = length > 0 ? Math.floor(length) : Math.ceil(length);
        if ((length >= 92 && length <= 182) || (length >= -178 && length <= -88)) {
            const cursorMap: object = {'nw-resize': 'ne-resize', 'n-resize': 's-resize',
                'ne-resize': 'nw-resize', 'w-resize': 'e-resize', 'e-resize': 'w-resize',
                'sw-resize': 'se-resize', 's-resize': 'n-resize', 'se-resize': 'sw-resize'
            };
            if (parent.cursor in cursorMap) { parent.cursor = cursorMap[parent.cursor]; }
        }
        parent.upperCanvas.style.cursor = this.getResizeElement((actObj.rotatedAngle * (180 / Math.PI)), parent.cursor);
        return parent.cursor;
    }

    private getResizeElement(degree: number, element: string): string {
        let resizeMappings: [number, number, string][] = [];
        if (element === 'nw-resize') {
            resizeMappings = [
                [337.5, 22.5, 'nw-resize'], [22.5, 67.5, 'n-resize'], [67.5, 112.5, 'ne-resize'],
                [112.5, 157.5, 'e-resize'], [157.5, 202.5, 'se-resize'],
                [202.5, 247.5, 's-resize'], [247.5, 292.5, 'sw-resize'],
                [292.5, 337.5, 'w-resize']
            ];
        } else if (element === 'n-resize') {
            resizeMappings = [
                [337.5, 22.5, 'n-resize'], [22.5, 67.5, 'ne-resize'], [67.5, 112.5, 'e-resize'],
                [112.5, 157.5, 'se-resize'], [157.5, 202.5, 's-resize'], [202.5, 247.5, 'sw-resize'],
                [247.5, 292.5, 'w-resize'], [292.5, 337.5, 'nw-resize']
            ];
        } else if (element === 'ne-resize') {
            resizeMappings = [
                [337.5, 22.5, 'ne-resize'],  [22.5, 67.5, 'e-resize'],
                [67.5, 112.5, 'se-resize'], [112.5, 157.5, 's-resize'], [157.5, 202.5, 'sw-resize'],
                [202.5, 247.5, 'w-resize'], [247.5, 292.5, 'nw-resize'], [292.5, 337.5, 'n-resize']
            ];
        } else if (element === 'e-resize') {
            resizeMappings = [
                [337.5, 22.5, 'e-resize'], [22.5, 67.5, 'se-resize'], [67.5, 112.5, 's-resize'],
                [112.5, 157.5, 'sw-resize'], [157.5, 202.5, 'w-resize'], [202.5, 247.5, 'nw-resize'],
                [247.5, 292.5, 'n-resize'], [292.5, 337.5, 'ne-resize']
            ];
        } else if (element === 'se-resize') {
            resizeMappings = [
                [337.5, 22.5, 'se-resize'], [22.5, 67.5, 's-resize'], [67.5, 112.5, 'sw-resize'],
                [112.5, 157.5, 'w-resize'], [157.5, 202.5, 'nw-resize'], [202.5, 247.5, 'n-resize'],
                [247.5, 292.5, 'ne-resize'], [292.5, 337.5, 'e-resize']
            ];
        } else if (element === 's-resize') {
            resizeMappings = [
                [337.5, 22.5, 's-resize'], [22.5, 67.5, 'sw-resize'], [67.5, 112.5, 'w-resize'],
                [112.5, 157.5, 'nw-resize'], [157.5, 202.5, 'n-resize'], [202.5, 247.5, 'ne-resize'],
                [247.5, 292.5, 'e-resize'], [292.5, 337.5, 'se-resize']
            ];
        } else if (element === 'sw-resize') {
            resizeMappings = [
                [337.5, 22.5, 'sw-resize'], [22.5, 67.5, 'w-resize'], [67.5, 112.5, 'nw-resize'],
                [112.5, 157.5, 'n-resize'], [157.5, 202.5, 'ne-resize'], [202.5, 247.5, 'e-resize'],
                [247.5, 292.5, 'se-resize'], [292.5, 337.5, 's-resize']
            ];
        } else if (element === 'w-resize') {
            resizeMappings = [
                [337.5, 22.5, 'w-resize'], [22.5, 67.5, 'nw-resize'], [67.5, 112.5, 'n-resize'],
                [112.5, 157.5, 'ne-resize'], [157.5, 202.5, 'e-resize'], [202.5, 247.5, 'se-resize'],
                [247.5, 292.5, 's-resize'], [292.5, 337.5, 'sw-resize']
            ];
        }
        const positiveDegree: number = degree < 0 ? 360 - Math.abs(degree) : degree;
        for (const [startDegree, endDegree, resizeElement] of resizeMappings) {
            if ((positiveDegree > startDegree && positiveDegree <= endDegree) ||
                (positiveDegree + 360 > startDegree && positiveDegree + 360 <= endDegree)) {
                return resizeElement;
            }
        }
        return element;
    }

    private setCursorForFreehandDrawing(x: number, y: number, upperCanvas: HTMLCanvasElement): void {
        const upperContext: CanvasRenderingContext2D = upperCanvas.getContext('2d');
        const parent: ImageEditor = this.parent;
        const textArea: HTMLInputElement = document.querySelector('#' + parent.element.id + '_textArea');
        let isEntered: boolean = false;
        parent.notify('freehand-draw', { prop: 'setFreehandDrawHoveredIndex', onPropertyChange: false,
            value: {index: -1 }});
        let sPoints: Point[];
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            const obj: Object = {selPointColl: {} };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false, value: {obj: obj }});
            sPoints = extend([], obj['selPointColl'][n as number].points, []) as Point[];
            parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
            parent.notify('freehand-draw', { prop: 'setPointCounter', onPropertyChange: false, value: {value: 0 }});
            const len: number = sPoints.length;
            for (let l: number = 0; l < len; l++) {
                if (l !== 0) {
                    let isInside: boolean = false;
                    if (sPoints[l - 1] && sPoints[l as number]) {
                        isInside = this.isInside(x, y, sPoints[l - 1].x, sPoints[l - 1].y,
                                                 sPoints[l as number].x, sPoints[l as number].y);
                    }
                    if (isInside) {
                        this.isFhdPoint = true;
                        parent.notify('freehand-draw', { prop: 'setFreehandDrawHoveredIndex', onPropertyChange: false,
                            value: {index: n }});
                        parent.notify('freehand-draw', { prop: 'hoverFhd', onPropertyChange: false,
                            value: {strokeColor: null, strokeWidth: null }});
                        upperCanvas.style.cursor = parent.cursor = 'pointer';
                        isEntered = true;
                        break;
                    } else if (!this.isFhdEditing || parent.pointColl[n as number].isSelected) {
                        if (this.isFhdPoint || this.isFhdEditing) {
                            upperContext.clearRect(0, 0, upperCanvas.width, upperCanvas.height);
                            if (parent.activeObj.shape && textArea.style.display === 'none') {
                                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj} });
                            }
                        }
                        if (this.isFhdEditing) {
                            const strokeColor: string = parent.pointColl[n as number].strokeColor;
                            parent.notify('freehand-draw', { prop: 'hoverFhd', onPropertyChange: false,
                                value: {strokeColor: strokeColor, strokeWidth: parent.pointColl[n as number].strokeWidth} });
                        } else {
                            parent.notify('freehand-draw', { prop: 'setFreehandDrawHoveredIndex', onPropertyChange: false,
                                value: {index: null }});
                        }
                        this.isFhdPoint = false;
                    }
                } else {
                    if (x > parent.points[l as number].x - parent.pointColl[n as number].strokeWidth &&
                        x < parent.points[l as number].x + parent.pointColl[n as number].strokeWidth &&
                        y > parent.points[l as number].y - parent.pointColl[n as number].strokeWidth &&
                        y < parent.points[l as number].y + parent.pointColl[n as number].strokeWidth) {
                        this.isFhdPoint = true;
                        parent.notify('freehand-draw', { prop: 'setFreehandDrawHoveredIndex', onPropertyChange: false,
                            value: {index: n }});
                        parent.notify('freehand-draw', { prop: 'hoverFhd', onPropertyChange: false,
                            value: {strokeColor: null, strokeWidth: null }});
                        upperCanvas.style.cursor = parent.cursor = 'pointer';
                        isEntered = true;
                        break;
                    } else if (!this.isFhdEditing || parent.pointColl[n as number].isSelected) {
                        if (this.isFhdPoint || this.isFhdEditing) {
                            upperContext.clearRect(0, 0, upperCanvas.width, upperCanvas.height);
                            if (parent.activeObj.shape && textArea.style.display === 'none') {
                                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj} });
                            }
                        }
                        if (this.isFhdEditing) {
                            const strokeColor: string = parent.pointColl[n as number].strokeColor;
                            parent.notify('freehand-draw', { prop: 'hoverFhd', onPropertyChange: false,
                                value: {strokeColor: strokeColor, strokeWidth: parent.pointColl[n as number].strokeWidth} });
                        }
                        this.isFhdPoint = false;
                    }
                }
            }
            if (isEntered) {
                break;
            }
        }
    }

    private setCursorFromObj(x: number, y: number, obj: SelectionPoint[], upperCanvas: HTMLCanvasElement, isCropSelection: boolean): void {
        const parent: ImageEditor = this.parent;
        for (let i: number = 0, len: number = obj.length; i < len; i++) {
            if (parent.cursor === 'move') {return; }
            const actObj: SelectionPoint = extend({}, obj[i as number], {}, true) as SelectionPoint;
            this.cursorTargetId = actObj.currIndex;
            if (actObj.shape === 'line' || actObj.shape === 'arrow') {
                this.setCursorForLineArrow(actObj, x, y, upperCanvas);
            } else if (actObj.shape === 'path') {
                this.setCursorForPath(actObj, x, y, upperCanvas);
            } else if (!isNullOrUndefined(actObj.rotatedAngle) && actObj.rotatedAngle !== 0) {
                this.setCursorForRotatedObject(actObj, x, y, upperCanvas);
            } else {
                upperCanvas.style.cursor = parent.cursor = this.getMouseCursor(actObj, x, y, isCropSelection, true);
            }
        }
    }

    private isInside(x: number, y: number, z1: number, z2: number, z3: number, z4: number): boolean {
        const x1: number = Math.min(z1, z3);
        const x2: number = Math.max(z1, z3);
        const y1: number = Math.min(z2, z4);
        const y2: number = Math.max(z2, z4);
        if ((x1 <= x && x <= x2) && (y1 <= y && y <= y2)) {return true; }
        else {return false; }
    }

    private updateActivePoint(x: number, y: number, isCropSelection: boolean):  void {
        const parent: ImageEditor = this.parent;
        const obj: Object = {width: 0, height: 0 };
        parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: parent.activeObj.activePoint.width, height: parent.activeObj.activePoint.height, obj: obj}});
        const maxDimension: Dimension = obj as Dimension;
        const previousShapeSettings: ShapeSettings = this.updatePrevShapeSettings();
        const shapeResizingArgs: ShapeChangeEventArgs = {action: 'resize',  previousShapeSettings: previousShapeSettings};
        const shapeMovingArgs: ShapeChangeEventArgs = {action: 'move', previousShapeSettings: previousShapeSettings};
        this.shapeResizingArgs = shapeResizingArgs;
        this.shapeMovingArgs = shapeMovingArgs;
        if (parent.activeObj.shape === 'text' && this.dragElement !== '') {
            parent.notify('shape', { prop: 'updateFontRatio', onPropertyChange: false,
                value: {obj: parent.activeObj, isTextArea: null}});
        }
        if (this.currentDrawingShape !== '' && (this.dragElement === '' || this.dragElement === 'move')) {
            if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow' ||
            parent.activeObj.shape === 'path') {this.dragElement = 'e-resize'; }
            else {
                if (x > parent.activeObj.activePoint.startX && y > parent.activeObj.activePoint.startY) {
                    this.dragElement = 'se-resize';
                } else if (x < parent.activeObj.activePoint.startX && y > parent.activeObj.activePoint.startY) {
                    this.dragElement = 'sw-resize';
                } else if (x > parent.activeObj.activePoint.startX && y < parent.activeObj.activePoint.startY) {
                    this.dragElement = 'ne-resize';
                } else if (x < parent.activeObj.activePoint.startX && y < parent.activeObj.activePoint.startY) {
                    this.dragElement = 'nw-resize';
                }
            }
        }
        if (parent.activeObj.shape === 'arrow') {
            if (Math.atan2(x - parent.lowerCanvas.width / 2, y - parent.lowerCanvas.height / 2) > 0) {
                parent.activeObj.rotatedAngle = -Math.atan2(x - parent.lowerCanvas.width / 2, y - parent.lowerCanvas.height / 2);
            } else {
                parent.activeObj.rotatedAngle = Math.abs(Math.atan2(x - parent.lowerCanvas.width / 2, y - parent.lowerCanvas.height / 2));
            }
        }
        let degree: number; let isHorizontalflip: boolean = false; let isVerticalflip: boolean = false;
        switch (this.dragElement.toLowerCase()) {
        case 'nw-resize':
            this.updateNWPoints(x, y, maxDimension);
            parent.notify('shape', { prop: 'updateArrowDirection', onPropertyChange: false,
                value: {obj: parent.activeObj, flip: null, rotatedDegree: null}});
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'n-resize':
            this.updateNPoints(x, y);
            parent.notify('shape', { prop: 'updateArrowDirection', onPropertyChange: false,
                value: {obj: parent.activeObj, flip: null, rotatedDegree: null}});
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'ne-resize':
            this.updateNEPoints(x, y, maxDimension);
            parent.notify('shape', { prop: 'updateArrowDirection', onPropertyChange: false,
                value: {obj: parent.activeObj, flip: null, rotatedDegree: null}});
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'w-resize':
            this.updateWPoints(x, y);
            parent.notify('shape', { prop: 'updateArrowDirection', onPropertyChange: false,
                value: {obj: parent.activeObj, flip: null, rotatedDegree: null}});
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'e-resize':
            this.updateEPoints(x, y);
            parent.notify('shape', { prop: 'updateArrowDirection', onPropertyChange: false,
                value: {obj: parent.activeObj, flip: null, rotatedDegree: null}});
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'sw-resize':
            this.updateSWPoints(x, y, maxDimension);
            parent.notify('shape', { prop: 'updateArrowDirection', onPropertyChange: false,
                value: {obj: parent.activeObj, flip: null, rotatedDegree: null}});
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 's-resize':
            this.updateSPoints(x, y);
            parent.notify('shape', { prop: 'updateArrowDirection', onPropertyChange: false,
                value: {obj: parent.activeObj, flip: null, rotatedDegree: null}});
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'se-resize':
            this.updateSEPoints(x, y, maxDimension);
            parent.notify('shape', { prop: 'updateArrowDirection', onPropertyChange: false,
                value: {obj: parent.activeObj, flip: null, rotatedDegree: null}});
            this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'resize');
            break;
        case 'grabbing':
            if (Math.atan2(x - (parent.activeObj.activePoint.startX + (parent.activeObj.activePoint.width / 2)),
                           y - (parent.activeObj.activePoint.startY + (parent.activeObj.activePoint.height / 2))) > 0) {
                parent.activeObj.rotatedAngle = -Math.atan2(x - (parent.activeObj.activePoint.startX + (parent.activeObj.activePoint.width
                / 2)), y - (parent.activeObj.activePoint.startY + (parent.activeObj.activePoint.height / 2)));
            }
            else {
                parent.activeObj.rotatedAngle = Math.abs(Math.atan2(x - (parent.activeObj.activePoint.startX +
                    (parent.activeObj.activePoint.width / 2)), y - (parent.activeObj.activePoint.startY +
                        (parent.activeObj.activePoint.height / 2))));
            }
            if (parent.activeObj.shapeDegree === 0) {degree = parent.transform.degree; }
            else {degree = parent.transform.degree - parent.activeObj.shapeDegree; }
            if (degree < 0) {degree = 360 + degree; }
            for (let i: number = 0, len: number = parent.activeObj.flipObjColl.length; i < len; i++) {
                if (parent.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal') {
                    isHorizontalflip = true;
                } else if (parent.activeObj.flipObjColl[i as number].toLowerCase() === 'vertical') {
                    isVerticalflip = true;
                }
            }
            parent.activeObj.rotatedAngle -= (degree * (Math.PI / 180));
            if (degree === 0 || degree === 360) {
                if (isVerticalflip) {parent.activeObj.rotatedAngle -= (180 * (Math.PI / 180)); }
            } else if (degree === 90 || degree === -270) {
                if (isHorizontalflip) {parent.activeObj.rotatedAngle -= (180 * (Math.PI / 180)); }
            } else if (degree === 180 || degree === -180) {
                if (isVerticalflip) {parent.activeObj.rotatedAngle -= (180 * (Math.PI / 180)); }
            } else if (degree === 270 || degree === -90) {
                if (isHorizontalflip) {parent.activeObj.rotatedAngle -= (180 * (Math.PI / 180)); }
            }
            break;
        case 'pathdrag':
            if (!isNullOrUndefined(this.pathAdjustedIndex)) {
                parent.activeObj.pointColl[this.pathAdjustedIndex].x = x;
                parent.activeObj.pointColl[this.pathAdjustedIndex].y = y;
            }
            break;
        default:
            if (!isCropSelection && !parent.currObjType.isCustomCrop) {
                if (this.dragPoint.startX) {
                    const width: number = (this.dragPoint.endX - this.previousPoint.x);
                    const height: number = (this.dragPoint.endY - this.previousPoint.y);
                    parent.activeObj.activePoint.startX += width; parent.activeObj.activePoint.endX += width;
                    parent.activeObj.activePoint.startY += height; parent.activeObj.activePoint.endY += height;
                    if (parent.activeObj.shape !== 'line' && parent.activeObj.shape !== 'arrow' &&
                        parent.activeObj.rotationCirclePointColl) {
                        parent.activeObj.rotationCirclePointColl.x += width;
                        parent.activeObj.rotationCirclePointColl.y += height;
                        parent.activeObj.rotationCirclePoint.x += width;
                        parent.activeObj.rotationCirclePoint.y += height;
                    }
                    if (parent.activeObj.shape === 'path') {
                        for (let i: number = 0, len: number = parent.activeObj.pointColl.length; i < len; i++) {
                            parent.activeObj.pointColl[i as number].x += width;
                            parent.activeObj.pointColl[i as number].y += height;
                        }
                    }
                    if (!this.isPreventDragging && (parent.activeObj.activePoint.startX < parent.img.destLeft ||
                        parent.activeObj.activePoint.startY < parent.img.destTop || parent.activeObj.activePoint.endX >
                        parent.img.destLeft + parent.img.destWidth || parent.activeObj.activePoint.endY > parent.img.destTop
                        + parent.img.destHeight)) {
                        parent.activeObj.activePoint.startX -= width;
                        parent.activeObj.activePoint.endX -= width;
                        parent.activeObj.activePoint.startY -= height;
                        parent.activeObj.activePoint.endY -= height;
                        if (parent.activeObj.shape !== 'line' && parent.activeObj.shape !== 'arrow' &&
                            parent.activeObj.rotationCirclePointColl) {
                            parent.activeObj.rotationCirclePointColl.x -= width;
                            parent.activeObj.rotationCirclePointColl.y -= height;
                            parent.activeObj.rotationCirclePoint.x -= width;
                            parent.activeObj.rotationCirclePoint.y -= height;
                        }
                        this.setDragWidth(width); this.setDragHeight(height);
                    }
                } else {
                    parent.activeObj.activePoint.startX = x < this.mouseDownPoint.x ? x : this.mouseDownPoint.x;
                    parent.activeObj.activePoint.startY = y < this.mouseDownPoint.y ? y : this.mouseDownPoint.y;
                    x = x < this.mouseDownPoint.x ? this.mouseDownPoint.x : x;
                    y = y < this.mouseDownPoint.y ? this.mouseDownPoint.y : y;
                    parent.activeObj.activePoint.endX = x;
                    parent.activeObj.activePoint.endY = y;
                }
                this.triggerShapeChange(shapeResizingArgs, shapeMovingArgs, 'move');
            }
            break;
        }
    }

    private triggerShapeChange(shapeResizingArgs: ShapeChangeEventArgs, shapeMovingArgs: ShapeChangeEventArgs, type: string): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
        parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
        const currentShapeSettings: ShapeSettings = this.updatePrevShapeSettings();
        shapeResizingArgs.currentShapeSettings = this.shapeResizingArgs.currentShapeSettings = currentShapeSettings;
        shapeMovingArgs.currentShapeSettings =  this.shapeMovingArgs.currentShapeSettings = currentShapeSettings;
        if (type === 'resize') {
            this.isCropSelection = false; let splitWords: string[];
            if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
            if (splitWords !== undefined && splitWords[0] === 'crop') {
                this.isCropSelection = true;
            }
            if (!this.isCropSelection && this.parent.eventType !== 'resize' && isBlazor() && parent.events && this.parent.events.onShapeResizeStart.hasDelegate === true) {
                shapeResizingArgs.action = this.currentDrawingShape !== '' ? 'drawing' : 'resize-start';
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                (parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShapeResizeStart', shapeResizingArgs) as any).then((shapeResizingArgs: ShapeChangeEventArgs) => {
                    parent.notify('shape', { prop: 'updateShapeChangeEventArgs', onPropertyChange: false,
                        value: {shapeSettings: shapeResizingArgs.currentShapeSettings}});
                });
            } else if (!this.isCropSelection) {
                if (this.currentDrawingShape !== '') {shapeResizingArgs.action = 'drawing'; }
                parent.trigger('shapeChanging', shapeResizingArgs);
                parent.notify('shape', { prop: 'updateShapeChangeEventArgs', onPropertyChange: false,
                    value: {shapeSettings: shapeResizingArgs.currentShapeSettings}});
            } else {
                const selectionResizingArgs: SelectionChangeEventArgs = {action: shapeResizingArgs.action,
                    previousSelectionSettings: {type: parent.getSelectionType(parent.activeObj.shape),
                        startX: shapeResizingArgs.previousShapeSettings.startX,
                        startY: shapeResizingArgs.previousShapeSettings.startY,
                        width: shapeResizingArgs.previousShapeSettings.width,
                        height: shapeResizingArgs.previousShapeSettings.height},
                    currentSelectionSettings: {type: parent.getSelectionType(parent.activeObj.shape),
                        startX: shapeResizingArgs.currentShapeSettings.startX,
                        startY: shapeResizingArgs.currentShapeSettings.startY,
                        width: shapeResizingArgs.currentShapeSettings.width,
                        height: shapeResizingArgs.currentShapeSettings.height}};
                this.selectionResizingArgs = selectionResizingArgs;
                if (isBlazor() && isNullOrUndefined(this.parent.eventType) && parent.events &&
                    parent.events.onSelectionResizeStart.hasDelegate === true) {
                    selectionResizingArgs.action = 'resize-start';
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    (parent.dotNetRef.invokeMethodAsync('SelectionEventAsync', 'OnSelectionResizeStart', selectionResizingArgs) as any).then((selectionResizingArgs: SelectionChangeEventArgs) => {
                        parent.notify('shape', { prop: 'updSelChangeEventArgs', onPropertyChange: false,
                            value: {selectionSettings: selectionResizingArgs.currentSelectionSettings}});
                    });
                } else {
                    parent.trigger('selectionChanging', selectionResizingArgs);
                    parent.notify('shape', { prop: 'updSelChangeEventArgs', onPropertyChange: false,
                        value: {selectionSettings: selectionResizingArgs.currentSelectionSettings}});
                }
            }
        } else {
            if (isBlazor() && isNullOrUndefined(this.parent.eventType) && parent.events &&
                parent.events.onShapeDragStart.hasDelegate === true) {
                shapeMovingArgs.action = 'drag-start';
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                (parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShapeDragStart', shapeMovingArgs) as any).then((shapeMovingArgs: ShapeChangeEventArgs) => {
                    parent.notify('shape', { prop: 'updateShapeChangeEventArgs', onPropertyChange: false,
                        value: {shapeSettings: shapeMovingArgs.currentShapeSettings}});
                });
            } else {
                parent.trigger('shapeChanging', shapeMovingArgs);
                parent.notify('shape', { prop: 'updateShapeChangeEventArgs', onPropertyChange: false,
                    value: {shapeSettings: shapeMovingArgs.currentShapeSettings}});
            }
        }
        this.parent.eventType = type;
    }

    private setDragWidth(width: number): void {
        const parent: ImageEditor = this.parent;
        const tempWidth: number = width;
        if (tempWidth >= 0) {
            for (let i: number = 0; i < tempWidth; i++) {
                width = tempWidth - i;
                parent.activeObj.activePoint.startX += width; parent.activeObj.activePoint.endX += width;
                if (parent.activeObj.activePoint.startX >= parent.img.destLeft &&
                    parent.activeObj.activePoint.endX <= parent.img.destLeft + parent.img.destWidth) {
                    break;
                } else {
                    parent.activeObj.activePoint.startX -= width; parent.activeObj.activePoint.endX -= width;
                }
            }
        } else {
            for (let i: number = 1; i < Math.abs(tempWidth); i++) {
                width = tempWidth + i;
                parent.activeObj.activePoint.startX += width; parent.activeObj.activePoint.endX += width;
                if (parent.activeObj.activePoint.startX >= parent.img.destLeft &&
                    parent.activeObj.activePoint.endX <= parent.img.destLeft + parent.img.destWidth) {
                    break;
                } else {
                    parent.activeObj.activePoint.startX -= width; parent.activeObj.activePoint.endX -= width;
                }
            }
        }
    }

    private setDragHeight(height: number): void {
        const parent: ImageEditor = this.parent;
        const tempHeight: number = height;
        if (tempHeight >= 0) {
            for (let i: number = 1; i < tempHeight; i++) {
                height = tempHeight - i;
                parent.activeObj.activePoint.startY += height; parent.activeObj.activePoint.endY += height;
                if (parent.activeObj.activePoint.startY >= parent.img.destTop &&
                    parent.activeObj.activePoint.endY <= parent.img.destTop + parent.img.destHeight) {
                    break;
                } else {
                    parent.activeObj.activePoint.startY -= height; parent.activeObj.activePoint.endY -= height;
                }
            }
        } else {
            for (let i: number = 0; i < Math.abs(tempHeight); i++) {
                height = tempHeight + i;
                parent.activeObj.activePoint.startY += height; parent.activeObj.activePoint.endY += height;
                if (parent.activeObj.activePoint.startY >= parent.img.destTop &&
                    parent.activeObj.activePoint.endY <= parent.img.destTop + parent.img.destHeight) {
                    break;
                } else {
                    parent.activeObj.activePoint.startY -= height; parent.activeObj.activePoint.endY -= height;
                }
            }
        }
    }

    private limitDrag(isStart: boolean): void {
        const parent: ImageEditor = this.parent;
        let startX: number = isStart ? parent.activeObj.activePoint.startX : parent.activeObj.activePoint.endX;
        let startY: number = isStart ? parent.activeObj.activePoint.startY : parent.activeObj.activePoint.endY;
        let endX: number = isStart ? parent.activeObj.activePoint.endX : parent.activeObj.activePoint.startX;
        let endY: number = isStart ? parent.activeObj.activePoint.endY : parent.activeObj.activePoint.startY;
        if (startX < parent.img.destLeft) {startX = parent.img.destLeft; }
        if (startY < parent.img.destTop) {startY = parent.img.destTop; }
        if (endX > parent.img.destLeft + parent.img.destWidth) {endX = parent.img.destLeft + parent.img.destWidth; }
        if (endY > parent.img.destTop + parent.img.destHeight) {endY = parent.img.destTop + parent.img.destHeight; }
        if (isStart) {
            parent.activeObj.activePoint.startX = startX; parent.activeObj.activePoint.startY = startY;
            parent.activeObj.activePoint.endX = endX; parent.activeObj.activePoint.endY = endY;
        } else {
            parent.activeObj.activePoint.startX = endX; parent.activeObj.activePoint.startY = endY;
            parent.activeObj.activePoint.endX = startX; parent.activeObj.activePoint.endY = startY;
        }
    }

    private preventDraggingInvertly(): void {
        const parent: ImageEditor = this.parent;
        if (!this.isPreventDragging && parent.activeObj.rotatedAngle === 0) {
            this.limitDrag(true);
            if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow' ||
                parent.activeObj.shape === 'path') {
                this.limitDrag(false);
            }
        }
    }

    private preventTextDraggingInvertly(): boolean {
        const parent: ImageEditor = this.parent; let isLimiting: boolean = false;
        if (!this.isPreventDragging) {
            if (parent.activeObj.activePoint.startX < parent.img.destLeft ||
                parent.activeObj.activePoint.startY < parent.img.destTop ||
                parent.activeObj.activePoint.endX > parent.img.destLeft + parent.img.destWidth ||
                parent.activeObj.activePoint.endY > parent.img.destTop + parent.img.destHeight) {
                isLimiting = true;
            }
        }
        return isLimiting;
    }

    private preventInverseResize(tempActiveObj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.activePoint.width < 0) {
            parent.activeObj.activePoint.width = 0;
            parent.activeObj.activePoint.startX = tempActiveObj.activePoint.startX;
            parent.activeObj.activePoint.endX = tempActiveObj.activePoint.endX;
        }
        if (parent.activeObj.activePoint.height < 0) {
            parent.activeObj.activePoint.height = 0;
            parent.activeObj.activePoint.startY = tempActiveObj.activePoint.startY;
            parent.activeObj.activePoint.endY = tempActiveObj.activePoint.endY;
        }
    }

    private getScaleRatio(scale: number): Point {
        const parent: ImageEditor = this.parent; const point: Point = {x: scale, y: scale};
        if (parent.activeObj.shape && parent.activeObj.shape !== 'crop-custom' &&
            parent.activeObj.shape !== 'crop-circle' && parent.activeObj.shape !== 'crop-square') {
            let ratio: string[] = parent.activeObj.shape.split('-');
            if (ratio.length > 1) {
                ratio = ratio[1].split(':');
                const newScale: number = scale / (parseInt(ratio[1], 10));
                point.x = newScale * (parseInt(ratio[0], 10)); point.y = newScale * (parseInt(ratio[1], 10));
            }
        }
        return point;
    }

    private updateNWPoints(x: number, y: number, maxDimension: Dimension): void {
        const parent: ImageEditor = this.parent;
        let diff: number; let width: number; let height: number; let scale: number; let percentage: number;
        const prevDiffX: number = this.diffPoint.x; const prevDiffY: number = this.diffPoint.y;
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
        if (parent.activeObj.shape === 'text') {
            if (this.oldPoint.x === undefined && this.oldPoint.y === undefined) {
                this.diffPoint.x = parent.activeObj.activePoint.startX - x; this.diffPoint.y = parent.activeObj.activePoint.startY - y;
            }
            else {this.diffPoint.x = this.oldPoint.x - x; this.diffPoint.y = this.oldPoint.y - y; }
            this.oldPoint.x = x; this.oldPoint.y = y;
            if (this.diffPoint.x <= prevDiffX && this.diffPoint.y >= prevDiffY) {diff = Math.min(this.diffPoint.x, this.diffPoint.y); }
            else {diff = Math.max(this.diffPoint.x, this.diffPoint.y); }
            percentage = (diff / 10);
            parent.activeObj.activePoint.startX -= (maxDimension.width / 100) * percentage;
            parent.activeObj.activePoint.startY -= (maxDimension.height / 100) * percentage;
            if (this.preventTextDraggingInvertly()) {
                parent.activeObj.activePoint.startX += (maxDimension.width / 100) * percentage;
                parent.activeObj.activePoint.startY += (maxDimension.height / 100) * percentage;
            }
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            parent.notify('shape', { prop: 'updateFontSize', onPropertyChange: false,
                value: {obj: parent.activeObj}});


        } else {
            let splitWords: string[];
            if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
            if (parent.activeObj.shape === 'crop-custom' || (parent.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.adjustNWPoints(parent.activeObj.activePoint, x, y, parent.activeObj.rotatedAngle);
                if (parent.activeObj.activePoint.startX > parent.activeObj.activePoint.endX) {
                    const temp: number = parent.activeObj.activePoint.startX;
                    parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX;
                    parent.activeObj.activePoint.endX = temp;
                    this.dragElement = parent.upperCanvas.style.cursor = parent.cursor = 'ne-resize';
                }
                if (parent.activeObj.activePoint.startY > parent.activeObj.activePoint.endY) {
                    const temp: number = parent.activeObj.activePoint.startY;
                    parent.activeObj.activePoint.startY = parent.activeObj.activePoint.endY;
                    parent.activeObj.activePoint.endY = temp;
                    this.dragElement = parent.upperCanvas.style.cursor = parent.cursor = 'sw-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (parent.activeObj.activePoint.startX < x && parent.activeObj.activePoint.startY < y) {
                    width = x - parent.activeObj.activePoint.startX; height = y - parent.activeObj.activePoint.startY;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.startX += newScale.x; parent.activeObj.activePoint.startY += newScale.y;
                    const left: number = parent.img.destLeft > 0 ? parent.img.destLeft : 0;
                    const top: number = parent.img.destTop > 0 ? parent.img.destTop : 0;
                    if (parent.activeObj.activePoint.startX < left || parent.activeObj.activePoint.startY < top) {
                        parent.activeObj.activePoint.startX -= newScale.x; parent.activeObj.activePoint.startY -= newScale.y;
                    }
                } else {
                    width = parent.activeObj.activePoint.startX - x; height = y - parent.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.startX -= newScale.x; parent.activeObj.activePoint.startY -= newScale.y;
                    const left: number = parent.img.destLeft > 0 ? parent.img.destLeft : 0;
                    const top: number = parent.img.destTop > 0 ? parent.img.destTop : 0;
                    if (parent.activeObj.activePoint.startX < left || parent.activeObj.activePoint.startY < top) {
                        parent.activeObj.activePoint.startX += newScale.x; parent.activeObj.activePoint.startY += newScale.y;
                    }
                }
            }
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            this.preventInverseResize(tempActiveObj);
        }
    }

    private updateNPoints(x: number, y: number): void {
        const parent: ImageEditor = this.parent;
        let width: number; let height: number; let scale: number;
        if (parent.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (parent.activeObj.shape) {splitWords = parent.activeObj.shape.split('-'); }
            if (parent.activeObj.shape === 'crop-custom' || (parent.activeObj.shape && splitWords[0] !== 'crop')) {
                if (parent.activeObj.shape !== 'line' && parent.activeObj.shape !== 'arrow' && parent.activeObj.shape !== 'path' &&
                    parent.activeObj.rotatedAngle !== 0 && this.dragPoint.startX) {
                    if (this.dragPoint.startX && this.dragPoint.startY) {
                        this.previousPoint.x = this.dragPoint.endX; this.previousPoint.y = this.dragPoint.endY;
                        this.dragPoint.endX = x; this.dragPoint.endY = y;
                    }
                    width = (this.dragPoint.endX - this.previousPoint.x);
                    height = (this.dragPoint.endY - this.previousPoint.y);
                    this.adjustRotationPoints(parent.activeObj.activePoint, width, height, parent.activeObj.rotatedAngle);
                } else {
                    parent.activeObj.activePoint.startY = y;
                    parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
                }
                if (parent.activeObj.activePoint.startY > parent.activeObj.activePoint.endY) {
                    const temp: number = parent.activeObj.activePoint.startY;
                    parent.activeObj.activePoint.startY = parent.activeObj.activePoint.endY;
                    parent.activeObj.activePoint.endY = temp;
                    this.dragElement = this.resizedElement = 's-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (parent.activeObj.activePoint.endX > x && parent.activeObj.activePoint.startY < y) {
                    width = parent.activeObj.activePoint.endX - x; height = y - parent.activeObj.activePoint.startY;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.startY += newScale.y;
                    if (parent.activeObj.activePoint.endX > (parent.img.destLeft + parent.img.destWidth) ||
                        parent.activeObj.activePoint.startY < parent.img.destTop) {
                        parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.startY -= newScale.y;
                    }
                } else {
                    width = x - parent.activeObj.activePoint.endX; height = parent.activeObj.activePoint.startY - y;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.startY -= newScale.y;
                    if (parent.activeObj.activePoint.endX > (parent.img.destLeft + parent.img.destWidth) ||
                        parent.activeObj.activePoint.startY < parent.img.destTop) {
                        parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.startY += newScale.y;
                    }
                }
                parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
                parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            }
        }
    }

    private updateNEPoints(x: number, y: number, maxDimension: Dimension): void {
        const parent: ImageEditor = this.parent;
        let diff: number; let width: number; let height: number; let scale: number; let percentage: number;
        const prevDiffX: number = this.diffPoint.x; const prevDiffY: number = this.diffPoint.y;
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
        if (parent.activeObj.shape === 'text') {
            if (this.oldPoint.x === undefined && this.oldPoint.y === undefined) {
                this.diffPoint.x = x - parent.activeObj.activePoint.endX; this.diffPoint.y = parent.activeObj.activePoint.startY - y;
            }
            else {this.diffPoint.x = x - this.oldPoint.x; this.diffPoint.y = this.oldPoint.y - y; }
            this.oldPoint.x = x; this.oldPoint.y = y;
            if (this.diffPoint.x <= prevDiffX && this.diffPoint.y >= prevDiffY) {
                diff = Math.min(this.diffPoint.x, this.diffPoint.y);
            }
            else {diff = Math.max(this.diffPoint.x, this.diffPoint.y); }
            percentage = (diff / 10);
            parent.activeObj.activePoint.endX += (maxDimension.width / 100) * percentage;
            parent.activeObj.activePoint.startY -= (maxDimension.height / 100) * percentage;
            if (this.preventTextDraggingInvertly()) {
                parent.activeObj.activePoint.endX -= (maxDimension.width / 100) * percentage;
                parent.activeObj.activePoint.startY += (maxDimension.height / 100) * percentage;
            }
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            parent.notify('shape', { prop: 'updateFontSize', onPropertyChange: false,
                value: {obj: parent.activeObj}});
        } else {
            let splitWords: string[];
            if (parent.activeObj.shape) {splitWords = parent.activeObj.shape.split('-'); }
            if (parent.activeObj.shape === 'crop-custom' || (parent.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.adjustNEPoints(parent.activeObj.activePoint, x, y, parent.activeObj.rotatedAngle);
                if (parent.activeObj.activePoint.endX < parent.activeObj.activePoint.startX) {
                    const temp: number = parent.activeObj.activePoint.endX;
                    parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX;
                    parent.activeObj.activePoint.startX = temp;
                    this.dragElement = parent.upperCanvas.style.cursor = parent.cursor = 'nw-resize';
                }
                if (parent.activeObj.activePoint.startY > parent.activeObj.activePoint.endY) {
                    const temp: number = parent.activeObj.activePoint.startY;
                    parent.activeObj.activePoint.startY = parent.activeObj.activePoint.endY;
                    parent.activeObj.activePoint.endY = temp;
                    this.dragElement = parent.upperCanvas.style.cursor = parent.cursor = 'se-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (parent.activeObj.activePoint.endX > x && parent.activeObj.activePoint.startY < y) {
                    width = parent.activeObj.activePoint.endX - x; height = y - parent.activeObj.activePoint.startY;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.startY += newScale.y;
                    const endX: number = parent.img.destLeft + parent.img.destWidth < parent.lowerCanvas.width ?
                        parent.img.destLeft + parent.img.destWidth : parent.lowerCanvas.width;
                    const endY: number = parent.img.destTop > 0 ? parent.img.destTop : 0;
                    if (parent.activeObj.activePoint.endX > endX || parent.activeObj.activePoint.startY < endY) {
                        parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.startY -= newScale.y;
                    }
                } else {
                    width = x - parent.activeObj.activePoint.endX; height = parent.activeObj.activePoint.startY - y;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.startY -= newScale.y;
                    const endX: number = parent.img.destLeft + parent.img.destWidth < parent.lowerCanvas.width ?
                        parent.img.destLeft + parent.img.destWidth : parent.lowerCanvas.width;
                    const endY: number = parent.img.destTop > 0 ? parent.img.destTop : 0;
                    if (parent.activeObj.activePoint.endX > endX || parent.activeObj.activePoint.startY < endY) {
                        parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.startY += newScale.y;
                    }
                }
            }
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            this.preventInverseResize(tempActiveObj);
        }
    }

    private updateWPoints(x: number, y: number): void {
        const parent: ImageEditor = this.parent;
        let width: number; let height: number; let scale: number;
        if (parent.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (parent.activeObj.shape) {splitWords = parent.activeObj.shape.split('-'); }
            if (parent.activeObj.shape === 'crop-custom' || (parent.activeObj.shape && splitWords[0] !== 'crop')) {
                if (parent.activeObj.shape !== 'line' && parent.activeObj.shape !== 'arrow' && parent.activeObj.shape !== 'path' &&
                    parent.activeObj.rotatedAngle !== 0 && this.dragPoint.startX) {
                    if (this.dragPoint.startX && this.dragPoint.startY) {
                        this.previousPoint.x = this.dragPoint.endX; this.previousPoint.y = this.dragPoint.endY;
                        this.dragPoint.endX = x; this.dragPoint.endY = y;
                    }
                    width = (this.dragPoint.endX - this.previousPoint.x);
                    height = (this.dragPoint.endY - this.previousPoint.y);
                    this.adjustRotationPoints(parent.activeObj.activePoint, width, height, parent.activeObj.rotatedAngle);
                } else {
                    parent.activeObj.activePoint.startX = x;
                    parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
                }
                if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow' || parent.activeObj.shape === 'path') {
                    parent.activeObj.activePoint.startY = y;
                    parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
                    if (this.adjustActObjForLineArrow()) {
                        this.dragElement = 'e-resize';
                        if (parent.activeObj.triangleDirection === 'right') {
                            parent.activeObj.triangleDirection = 'left';
                        } else if (parent.activeObj.triangleDirection === 'left') {
                            parent.activeObj.triangleDirection = 'right';
                        }
                    }
                } else if (parent.activeObj.activePoint.startX > parent.activeObj.activePoint.endX) {
                    const temp: number = parent.activeObj.activePoint.startX;
                    parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX;
                    parent.activeObj.activePoint.endX = temp;
                    this.dragElement = this.resizedElement = 'e-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (parent.activeObj.activePoint.startX < x && parent.activeObj.activePoint.endY > y) {
                    width = x - parent.activeObj.activePoint.startX; height = parent.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.startX += newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    if (parent.activeObj.activePoint.startX < parent.img.destLeft || parent.activeObj.activePoint.endY >
                        (parent.img.destTop + parent.img.destHeight)) {
                        parent.activeObj.activePoint.startX -= newScale.x; parent.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = parent.activeObj.activePoint.startX - x; height = y - parent.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.startX -= newScale.x; parent.activeObj.activePoint.endY += newScale.y;
                    if (parent.activeObj.activePoint.startX < parent.img.destLeft || parent.activeObj.activePoint.endY >
                        (parent.img.destTop + parent.img.destHeight)) {
                        parent.activeObj.activePoint.startX += newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    }
                }
                parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
                parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            }
        }
    }

    private updateEPoints(x: number, y: number): void {
        const parent: ImageEditor = this.parent;
        let width: number; let height: number; let scale: number;
        if (parent.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (parent.activeObj.shape) {splitWords = parent.activeObj.shape.split('-'); }
            if (parent.activeObj.shape === 'crop-custom' || (parent.activeObj.shape && splitWords[0] !== 'crop')) {
                if (parent.activeObj.shape !== 'line' && parent.activeObj.shape !== 'arrow' && parent.activeObj.shape !== 'path' &&
                    parent.activeObj.rotatedAngle !== 0 && this.dragPoint.startX) {
                    if (this.dragPoint.startX && this.dragPoint.startY) {
                        this.previousPoint.x = this.dragPoint.endX; this.previousPoint.y = this.dragPoint.endY;
                        this.dragPoint.endX = x; this.dragPoint.endY = y;
                    }
                    width = (this.dragPoint.endX - this.previousPoint.x);
                    height = (this.dragPoint.endY - this.previousPoint.y);
                    this.adjustRotationPoints(parent.activeObj.activePoint, width, height, parent.activeObj.rotatedAngle);
                } else {
                    parent.activeObj.activePoint.endX = x;
                    parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
                }
                if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow' || parent.activeObj.shape === 'path') {
                    parent.activeObj.activePoint.endY = y;
                    parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
                    if (this.adjustActObjForLineArrow()) {
                        this.dragElement = 'w-resize';
                        if (parent.activeObj.triangleDirection === 'right') {
                            parent.activeObj.triangleDirection = 'left';
                        } else if (parent.activeObj.triangleDirection === 'left') {
                            parent.activeObj.triangleDirection = 'right';
                        }
                    }
                } else if (parent.activeObj.activePoint.endX < parent.activeObj.activePoint.startX) {
                    const temp: number = parent.activeObj.activePoint.endX;
                    parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX;
                    parent.activeObj.activePoint.startX = temp;
                    this.dragElement = this.resizedElement = 'w-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (parent.activeObj.activePoint.endX > x && parent.activeObj.activePoint.endY > y) {
                    width = parent.activeObj.activePoint.endX - x; height = parent.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    if (parent.activeObj.activePoint.endX > (parent.img.destLeft + parent.img.destWidth) ||
                        parent.activeObj.activePoint.endY > (parent.img.destTop + parent.img.destHeight)) {
                        parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = x - parent.activeObj.activePoint.endX; height = y - parent.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.endY += newScale.y;
                    if (parent.activeObj.activePoint.endX > (parent.img.destLeft + parent.img.destWidth) ||
                    parent.activeObj.activePoint.endY > (parent.img.destTop + parent.img.destHeight)) {
                        parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    }
                }
                parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
                parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            }
        }
    }

    private updateSWPoints(x: number, y: number, maxDimension: Dimension): void {
        const parent: ImageEditor = this.parent;
        let diff: number; let width: number; let height: number; let scale: number; let percentage: number;
        const prevDiffX: number = this.diffPoint.x; const prevDiffY: number = this.diffPoint.y;
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
        if (parent.activeObj.shape === 'text') {
            if (isNullOrUndefined(this.oldPoint.x) && isNullOrUndefined(this.oldPoint.y)) {
                this.diffPoint.x = parent.activeObj.activePoint.startX - x; this.diffPoint.y = y - parent.activeObj.activePoint.endY;
            }
            else {this.diffPoint.x = this.oldPoint.x - x; this.diffPoint.y = y - this.oldPoint.y; }
            this.oldPoint.x = x; this.oldPoint.y = y;
            if (this.diffPoint.x <= prevDiffX && this.diffPoint.y >= prevDiffY) {
                diff = Math.min(this.diffPoint.x, this.diffPoint.y);
            }
            else {diff = Math.max(this.diffPoint.x, this.diffPoint.y); }
            percentage = (diff / 10);
            parent.activeObj.activePoint.startX -= (maxDimension.width / 100) * percentage;
            parent.activeObj.activePoint.endY += (maxDimension.height / 100) * percentage;
            if (this.preventTextDraggingInvertly()) {
                parent.activeObj.activePoint.startX += (maxDimension.width / 100) * percentage;
                parent.activeObj.activePoint.endY -= (maxDimension.height / 100) * percentage;
            }
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            parent.notify('shape', { prop: 'updateFontSize', onPropertyChange: false,
                value: {obj: parent.activeObj}});
        } else {
            let splitWords: string[];
            if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
            if (parent.activeObj.shape === 'crop-custom' || (parent.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.adjustSWPoints(parent.activeObj.activePoint, x, y, parent.activeObj.rotatedAngle);
                if (parent.activeObj.activePoint.startX > parent.activeObj.activePoint.endX) {
                    const temp: number = parent.activeObj.activePoint.startX;
                    parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX;
                    parent.activeObj.activePoint.endX = temp;
                    this.dragElement = parent.upperCanvas.style.cursor = parent.cursor = 'se-resize';
                }
                if (parent.activeObj.activePoint.endY < parent.activeObj.activePoint.startY) {
                    const temp: number = parent.activeObj.activePoint.endY;
                    parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY;
                    parent.activeObj.activePoint.startY = temp;
                    this.dragElement = parent.upperCanvas.style.cursor = parent.cursor = 'nw-resize';
                }
                this.preventDraggingInvertly();
            } else {
                if (parent.activeObj.activePoint.startX < x && parent.activeObj.activePoint.endY > y) {
                    width = x - parent.activeObj.activePoint.startX; height = parent.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.startX += newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    const endX: number = parent.img.destLeft > 0 ? parent.img.destLeft : 0;
                    const endY: number = parent.img.destTop + parent.img.destHeight < parent.lowerCanvas.height ? parent.img.destTop +
                                         parent.img.destHeight : parent.lowerCanvas.height;
                    if (parent.activeObj.activePoint.startX < endX || parent.activeObj.activePoint.endY > endY) {
                        parent.activeObj.activePoint.startX -= newScale.x; parent.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = parent.activeObj.activePoint.startX - x; height = y - parent.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.startX -= newScale.x; parent.activeObj.activePoint.endY += newScale.y;
                    const endX: number = parent.img.destLeft > 0 ? parent.img.destLeft : 0;
                    const endY: number = parent.img.destTop + parent.img.destHeight < parent.lowerCanvas.height ? parent.img.destTop +
                                         parent.img.destHeight : parent.lowerCanvas.height;
                    if (parent.activeObj.activePoint.startX < endX || parent.activeObj.activePoint.endY > endY) {
                        parent.activeObj.activePoint.startX += newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    }
                }
            }
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            this.preventInverseResize(tempActiveObj);
        }
    }

    private updateSPoints(x: number, y: number): void {
        const parent: ImageEditor = this.parent;
        let width: number; let height: number; let scale: number;
        if (parent.activeObj.shape !== 'text') {
            let splitWords: string[];
            if (parent.activeObj.shape) {splitWords = parent.activeObj.shape.split('-'); }
            if (parent.activeObj.shape === 'crop-custom' || (parent.activeObj.shape && splitWords[0] !== 'crop')) {
                if (parent.activeObj.shape !== 'line' && parent.activeObj.shape !== 'arrow' && parent.activeObj.shape !== 'path' &&
                    parent.activeObj.rotatedAngle !== 0 && this.dragPoint.startX) {
                    if (this.dragPoint.startX && this.dragPoint.startY) {
                        this.previousPoint.x = this.dragPoint.endX; this.previousPoint.y = this.dragPoint.endY;
                        this.dragPoint.endX = x; this.dragPoint.endY = y;
                    }
                    width = (this.dragPoint.endX - this.previousPoint.x);
                    height = (this.dragPoint.endY - this.previousPoint.y);
                    this.adjustRotationPoints(parent.activeObj.activePoint, width, height, parent.activeObj.rotatedAngle);
                } else {
                    parent.activeObj.activePoint.endY = y;
                    parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
                }
                if (parent.activeObj.activePoint.endY < parent.activeObj.activePoint.startY) {
                    const temp: number = parent.activeObj.activePoint.endY;
                    parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY;
                    parent.activeObj.activePoint.startY = temp;
                    this.dragElement = this.resizedElement = 'n-resize';
                }
                this.preventDraggingInvertly();
            }
            else {
                if (parent.activeObj.activePoint.endX > x && parent.activeObj.activePoint.endY > y) {
                    width = parent.activeObj.activePoint.endX - x;
                    height = parent.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    if (parent.activeObj.activePoint.endX > (parent.img.destLeft + parent.img.destWidth) ||
                        parent.activeObj.activePoint.endY > (parent.img.destTop + parent.img.destHeight)) {
                        parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = x - parent.activeObj.activePoint.endX; height = y - parent.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.endY += newScale.x;
                    if (parent.activeObj.activePoint.endX > (parent.img.destLeft + parent.img.destWidth) ||
                        parent.activeObj.activePoint.endY > (parent.img.destTop + parent.img.destHeight)) {
                        parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    }
                }
                parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
                parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            }
        }
    }

    private updateSEPoints(x: number, y: number, maxDimension: Dimension): void {
        const parent: ImageEditor = this.parent;
        let diff: number; let width: number; let height: number; let scale: number; let percentage: number;
        const prevDiffX: number = this.diffPoint.x; const prevDiffY: number = this.diffPoint.y;
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
        if (parent.activeObj.shape === 'text') {
            if (this.oldPoint.x === undefined && this.oldPoint.y === undefined) {
                this.diffPoint.x = x - parent.activeObj.activePoint.endX;
                this.diffPoint.y = y - parent.activeObj.activePoint.endY;
            } else {
                this.diffPoint.x = x - this.oldPoint.x;
                this.diffPoint.y = y - this.oldPoint.y;
            }
            this.oldPoint.x = x; this.oldPoint.y = y;
            if (this.diffPoint.x >= prevDiffX && this.diffPoint.y >= prevDiffY) {
                diff = Math.max(this.diffPoint.x, this.diffPoint.y);
            }
            else {diff = Math.min(this.diffPoint.x, this.diffPoint.y); }
            percentage = (diff / 10);
            parent.activeObj.activePoint.endX += (maxDimension.width / 50) * percentage;
            parent.activeObj.activePoint.endY += (maxDimension.height / 50) * percentage;
            if (this.preventTextDraggingInvertly()) {
                parent.activeObj.activePoint.endX -= (maxDimension.width / 50) * percentage;
                parent.activeObj.activePoint.endY -= (maxDimension.height / 50) * percentage;
            }
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            parent.notify('shape', { prop: 'updateFontSize', onPropertyChange: false,
                value: {obj: parent.activeObj}});
        } else {
            let splitWords: string[];
            if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
            if (parent.activeObj.shape === 'crop-custom' || (parent.activeObj.shape !== undefined && splitWords[0] !== 'crop')) {
                this.adjustSEPoints(parent.activeObj.activePoint, x, y, parent.activeObj.rotatedAngle);
                if (parent.activeObj.activePoint.endX < parent.activeObj.activePoint.startX) {
                    const temp: number = parent.activeObj.activePoint.endX;
                    parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX;
                    parent.activeObj.activePoint.startX = temp;
                    this.dragElement = parent.upperCanvas.style.cursor = parent.cursor = 'sw-resize';
                }
                if (parent.activeObj.activePoint.endY < parent.activeObj.activePoint.startY) {
                    const temp: number = parent.activeObj.activePoint.endY;
                    parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY;
                    parent.activeObj.activePoint.startY = temp;
                    this.dragElement = parent.upperCanvas.style.cursor = parent.cursor = 'ne-resize';
                }
                this.preventDraggingInvertly();
            } else {
                if (parent.activeObj.activePoint.endX > x && parent.activeObj.activePoint.endY > y) {
                    width = parent.activeObj.activePoint.endX - x; height = parent.activeObj.activePoint.endY - y;
                    scale = Math.min(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    const endX: number = parent.img.destLeft + parent.img.destWidth < parent.lowerCanvas.width ?
                        parent.img.destLeft + parent.img.destWidth : parent.lowerCanvas.width;
                    const endY: number = parent.img.destTop + parent.img.destHeight < parent.lowerCanvas.height ?
                        parent.img.destTop + parent.img.destHeight : parent.lowerCanvas.height;
                    if (parent.activeObj.activePoint.endX > endX || parent.activeObj.activePoint.endY > endY) {
                        parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.endY += newScale.y;
                    }
                } else {
                    width = x - parent.activeObj.activePoint.endX; height = y - parent.activeObj.activePoint.endY;
                    scale = Math.max(width, height);
                    const newScale: Point = this.getScaleRatio(scale);
                    parent.activeObj.activePoint.endX += newScale.x; parent.activeObj.activePoint.endY += newScale.y;
                    const endX: number = parent.img.destLeft + parent.img.destWidth < parent.lowerCanvas.width ? parent.img.destLeft +
                                         parent.img.destWidth : parent.lowerCanvas.width;
                    const endY: number = parent.img.destTop + parent.img.destHeight < parent.lowerCanvas.height ? parent.img.destTop +
                                         parent.img.destHeight : parent.lowerCanvas.height;
                    if (parent.activeObj.activePoint.endX > endX || parent.activeObj.activePoint.endY > endY) {
                        parent.activeObj.activePoint.endX -= newScale.x; parent.activeObj.activePoint.endY -= newScale.y;
                    }
                }
            }
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            this.preventInverseResize(tempActiveObj);
        }
    }

    private adjustNWPoints(rectangle: ActivePoint, x: number, y: number, angle: number): ActivePoint {
        const cx: number = rectangle.startX + rectangle.width / 2;
        const cy: number = rectangle.startY + rectangle.height / 2;
        const rotatedC: number[] = this.rotatePoints(rectangle.endX, rectangle.endY, cx, cy, angle);
        const newCenter: number[] = [(rotatedC[0] + x) / 2, (rotatedC[1] + y) / 2];
        const newBottomRight: number[] = this.rotatePoints(rotatedC[0], rotatedC[1], newCenter[0], newCenter[1], -angle);
        const newTopLeft: number[] = this.rotatePoints(x, y, newCenter[0], newCenter[1], -angle);
        rectangle.endX = newBottomRight[0];
        rectangle.endY = newBottomRight[1];
        rectangle.startY = newTopLeft[1];
        rectangle.startX = newTopLeft[0];
        rectangle.width = rectangle.endX - rectangle.startX;
        rectangle.height = rectangle.endY - rectangle.startY;
        return rectangle;
    }

    private adjustNEPoints(rectangle: ActivePoint, x: number, y: number, angle: number): ActivePoint {
        const cx: number = rectangle.startX + rectangle.width / 2;
        const cy: number = rectangle.startY + rectangle.height / 2;
        const rotatedD: number[] = this.rotatePoints(rectangle.startX, rectangle.endY, cx, cy, angle);
        const newCenter: number[] = [(rotatedD[0] + x) / 2, (rotatedD[1] + y) / 2];
        const newBottomLeft: number[] = this.rotatePoints(rotatedD[0], rotatedD[1], newCenter[0], newCenter[1], -angle);
        const newTopRight: number[] = this.rotatePoints(x, y, newCenter[0], newCenter[1], -angle);
        rectangle.startX = newBottomLeft[0];
        rectangle.endY = newBottomLeft[1];
        rectangle.width = newTopRight[0] - newBottomLeft[0];
        rectangle.height = newBottomLeft[1] - newTopRight[1];
        rectangle.endX = rectangle.startX + rectangle.width;
        rectangle.startY = rectangle.endY - rectangle.height;
        return rectangle;
    }

    private adjustSWPoints(rectangle: ActivePoint, x: number, y: number, angle: number): ActivePoint {
        const cx: number = rectangle.startX + rectangle.width / 2;
        const cy: number = rectangle.startY + rectangle.height / 2;
        const rotatedB: number[] = this.rotatePoints(rectangle.endX, rectangle.startY, cx, cy, angle);
        const newCenter: number[] = [(rotatedB[0] + x) / 2, (rotatedB[1] + y) / 2];
        const newTopRight: number[] = this.rotatePoints(rotatedB[0], rotatedB[1], newCenter[0], newCenter[1], -angle);
        const newBottomLeft: number[] = this.rotatePoints(x, y, newCenter[0], newCenter[1], -angle);
        rectangle.endX = newTopRight[0];
        rectangle.startY = newTopRight[1];
        rectangle.startX = newBottomLeft[0];
        rectangle.endY = newBottomLeft[1];
        rectangle.width = rectangle.endX - rectangle.startX;
        rectangle.height = rectangle.endY - rectangle.startY;
        return rectangle;
    }

    private adjustSEPoints(rectangle: ActivePoint, x: number, y: number, angle: number): ActivePoint {
        const cx: number = rectangle.startX + rectangle.width / 2;
        const cy: number = rectangle.startY + rectangle.height / 2;
        const rotatedA: number[] = this.rotatePoints(rectangle.startX, rectangle.startY, cx, cy, angle);
        const newCenter: number[] = [(rotatedA[0] + x) / 2, (rotatedA[1] + y) / 2];
        const newTopLeft: number[] = this.rotatePoints(rotatedA[0], rotatedA[1], newCenter[0], newCenter[1], -angle);
        const newBottomRight: number[] = this.rotatePoints(x, y, newCenter[0], newCenter[1], -angle);
        rectangle.startX = newTopLeft[0];
        rectangle.startY = newTopLeft[1];
        rectangle.width = newBottomRight[0] - newTopLeft[0];
        rectangle.height = newBottomRight[1] - newTopLeft[1];
        rectangle.endX = rectangle.startX + rectangle.width;
        rectangle.endY = rectangle.startY + rectangle.height;
        return rectangle;
    }

    private adjustRotationPoints(rectangle: ActivePoint, x: number, y: number, angle: number): ActivePoint {
        const cx: number = rectangle.startX + rectangle.width / 2;
        const cy: number = rectangle.startY + rectangle.height / 2;
        this.getResizeDirection(rectangle, x, y , angle);
        const rotatedA: number[] = this.rotatePoints(rectangle.startX, rectangle.startY, cx, cy, angle);
        const rotatedB: number[] = this.rotatePoints(rectangle.endX, rectangle.startY, cx, cy, angle);
        const rotatedC: number[] = this.rotatePoints(rectangle.endX, rectangle.endY, cx, cy, angle);
        const rotatedD: number[] = this.rotatePoints(rectangle.startX, rectangle.endY, cx, cy, angle);
        const newCenter: number[] = [(rotatedA[0] + rotatedC[0]) / 2, (rotatedA[1] + rotatedC[1]) / 2];
        const newTopLeft: number[] = this.rotatePoints(rotatedA[0], rotatedA[1], newCenter[0], newCenter[1], -angle);
        const newBottomLeft: number[] = this.rotatePoints(rotatedD[0], rotatedD[1], newCenter[0], newCenter[1], -angle);
        const newTopRight: number[] = this.rotatePoints(rotatedB[0], rotatedB[1], newCenter[0], newCenter[1], -angle);
        rectangle.startX = newTopLeft[0];
        rectangle.startY = newTopLeft[1];
        rectangle.endX = newTopRight[0];
        rectangle.endY = newBottomLeft[1];
        rectangle.width = rectangle.endX - rectangle.startX;
        rectangle.height = rectangle.endY - rectangle.startY;
        return rectangle;
    }

    private rotatePoints(x: number, y: number, cx: number, cy: number, angle: number): number[] {
        return [
            (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle) + cx,
            (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle) + cy
        ];
    }

    private setResizedValue(element: string, value: number, x: number, y: number): number {
        switch (element) {
        case 'x':
            value += x;
            break;
        case 'y':
            value += y;
            break;
        case 'abs-x':
            value += (x > 0 ? -x : Math.abs(x));
            break;
        case 'abs-y':
            value += (y > 0 ? -y : Math.abs(y));
            break;
        case 'y-abs-x':
            value += (y + ((x > 0 ? -x : Math.abs(x)) / 2));
            break;
        case 'abs-x-abs-y':
            value += ((x > 0 ? -x : Math.abs(x)) + ((y > 0 ? -y : Math.abs(y)) / 2));
            break;
        case 'abs-y-x':
            value += ((y > 0 ? -y : Math.abs(y)) + (x / 2));
            break;
        case 'x-y':
            value += (x + (y / 2));
            break;
        }
        return value;
    }

    private getResizeDirection(rectangle: ActivePoint, x: number, y: number, angle: number): void {
        const rotatedAngle: number = angle * (180 / Math.PI);
        const element: string = this.getResizedElement(rotatedAngle, this.resizedElement);
        if (this.resizedElement === 'e-resize') {
            rectangle.width = this.setResizedValue(element, rectangle.width, x, y);
            rectangle.endX = rectangle.width + rectangle.startX;
        } else if (this.resizedElement === 'n-resize') {
            rectangle.startY = this.setResizedValue(element, rectangle.startY, x, y);
            rectangle.height = rectangle.endY - rectangle.startY;
        } else if (this.resizedElement === 'w-resize') {
            rectangle.startX = this.setResizedValue(element, rectangle.startX, x, y);
            rectangle.width = rectangle.startX + rectangle.endX;
        } else if (this.resizedElement === 's-resize') {
            rectangle.height = this.setResizedValue(element, rectangle.height, x, y);
            rectangle.endY = rectangle.height + rectangle.startY;
        }
    }

    private getResizedElement(degree: number, element: string): string {
        let resizeMappings: [number, number, string][] = [];
        if (element === 'n-resize') {
            resizeMappings = [
                [337.5, 360, 'y'],
                [0, 22.5, 'y'],
                [22.5, 67.5, 'y-abs-x'],
                [67.5, 112.5, 'abs-x'],
                [112.5, 157.5, 'abs-x-abs-y'],
                [157.5, 202.5, 'abs-y'],
                [202.5, 247.5, 'abs-y-x'],
                [247.5, 292.5, 'x'],
                [292.5, 337.5, 'x-y']
            ];
        } else if (element === 'e-resize') {
            resizeMappings = [
                [337.5, 360, 'x'],
                [0, 22.5, 'x'],
                [22.5, 67.5, 'x-y'],
                [67.5, 112.5, 'y'],
                [112.5, 157.5, 'y-abs-x'],
                [157.5, 202.5, 'abs-x'],
                [202.5, 247.5, 'abs-x-abs-y'],
                [247.5, 292.5, 'abs-y'],
                [292.5, 337.5, 'abs-y-x']
            ];
        } else if (element === 's-resize') {
            resizeMappings = [
                [337.5, 360, 'y'],
                [0, 22.5, 'y'],
                [22.5, 67.5, 'y-abs-x'],
                [67.5, 112.5, 'abs-x'],
                [112.5, 157.5, 'abs-x-abs-y'],
                [157.5, 202.5, 'abs-y'],
                [202.5, 247.5, 'abs-y-x'],
                [247.5, 292.5, 'x'],
                [292.5, 337.5, 'x-y']
            ];
        } else if (element === 'w-resize') {
            resizeMappings = [
                [337.5, 360, 'x'],
                [0, 22.5, 'x'],
                [22.5, 67.5, 'x-y'],
                [67.5, 112.5, 'y'],
                [112.5, 157.5, 'y-abs-x'],
                [157.5, 202.5, 'abs-x'],
                [202.5, 247.5, 'abs-x-abs-y'],
                [247.5, 292.5, 'abs-y'],
                [292.5, 337.5, 'abs-y-x']
            ];
        }
        const positiveDegree: number = degree < 0 ? 360 - Math.abs(degree) : degree;
        for (const [startDegree, endDegree, resizeElement] of resizeMappings) {
            if ((positiveDegree > startDegree && positiveDegree <= endDegree) ||
                (positiveDegree + 360 > startDegree && positiveDegree + 360 <= endDegree)) {
                return resizeElement;
            }
        }
        return element;
    }

    private updateCursorStyles(x: number, y: number, type: string): void {
        const parent: ImageEditor = this.parent;
        let isResize: boolean = false;
        if (parent.activeObj.keyHistory !== '' && parent.activeObj.shape === undefined && !parent.currObjType.isCustomCrop &&
            !parent.currObjType.isLine && parent.currObjType.isText) {
            parent.activeObj.shape = 'text';
        }
        const actObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        if (isNullOrUndefined(actObj.topLeftCircle)) {
            return;
        }
        let degree: number;
        if (actObj.shapeDegree === 0) {degree = parent.transform.degree; }
        else {degree = parent.transform.degree - actObj.shapeDegree; }
        if (degree < 0) {degree = 360 + degree; }
        if (this.isObjSelected) {
            if (actObj.shape === 'line' || actObj.shape === 'arrow') {
                isResize = this.updateCursorStylesForLineArrow(x, y, actObj);
            } else if (actObj.shape === 'path') {
                isResize = this.updateCursorStylesForPath(x, y, actObj);
            } else if (actObj.rotatedAngle) {
                this.setCursorForRotatedObject(actObj, x, y, parent.upperCanvas);
                if (parent.cursor === 'grabbing') {
                    parent.upperCanvas.style.cursor = this.parent.cursor = 'grabbing';
                    this.dragElement = parent.cursor;
                } else if (parent.cursor === 'move') {
                    this.dragPoint.startX = this.previousPoint.x = this.dragPoint.endX = x;
                    this.dragPoint.startY = this.previousPoint.y = this.dragPoint.endY = y;
                } else if (parent.cursor !== 'default') {
                    isResize = true; this.dragElement = parent.cursor;
                    parent.currObjType.isResize = true;
                }
            } else {
                const rotationCirclePoint: Point = this.getTransRotationPoint(actObj);
                if (x >= (actObj.topLeftCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                    x <= (actObj.topLeftCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                    y >= (actObj.topLeftCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                    y <= (actObj.topLeftCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'nw-resize') {
                    actObj.topLeftCircle.startX = actObj.topLeftCircle.startY = 0;
                    parent.upperCanvas.style.cursor = parent.cursor = 'nw-resize'; isResize = true;
                    this.dragElement = parent.upperCanvas.style.cursor;
                } else if (x >= (actObj.topLeftCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                    x <= (actObj.topRightCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                    y >= (actObj.topCenterCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                    y <= (actObj.topCenterCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'n-resize') {
                    actObj.topCenterCircle.startX = actObj.topCenterCircle.startY = 0;
                    parent.upperCanvas.style.cursor = parent.cursor = 'n-resize'; isResize = true;
                    this.dragElement = parent.upperCanvas.style.cursor;
                } else if (x >= (actObj.topRightCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                        x <= (actObj.topRightCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                        y >= (actObj.topRightCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                        y <= (actObj.topRightCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'ne-resize') {
                    actObj.topRightCircle.startX = actObj.topRightCircle.startY = 0;
                    parent.upperCanvas.style.cursor = parent.cursor = 'ne-resize'; isResize = true;
                    this.dragElement = parent.upperCanvas.style.cursor;
                } else if (x >= (actObj.centerLeftCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                        x <= (actObj.centerLeftCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                        y >= (actObj.topLeftCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                        y <= (actObj.bottomLeftCircle.startY - (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'w-resize') {
                    actObj.centerLeftCircle.startX = actObj.centerLeftCircle.startY = 0;
                    parent.upperCanvas.style.cursor = parent.cursor = 'w-resize'; isResize = true;
                    this.dragElement = parent.upperCanvas.style.cursor;
                } else if (x >= (actObj.centerRightCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                        x <= (actObj.centerRightCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                        y >= (actObj.topRightCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                        y <= (actObj.bottomRightCircle.startY - (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'e-resize') {
                    actObj.centerRightCircle.startX = actObj.centerRightCircle.startY = 0;
                    parent.upperCanvas.style.cursor = parent.cursor = 'e-resize'; isResize = true;
                    this.dragElement = parent.upperCanvas.style.cursor;
                } else if (x >= (actObj.bottomLeftCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                        x <= (actObj.bottomLeftCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                        y >= (actObj.bottomLeftCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                        y <= (actObj.bottomLeftCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'sw-resize') {
                    actObj.bottomLeftCircle.startX = actObj.bottomLeftCircle.startY = 0;
                    parent.upperCanvas.style.cursor = parent.cursor = 'sw-resize'; isResize = true;
                    this.dragElement = parent.upperCanvas.style.cursor;
                } else if (x >= (actObj.bottomLeftCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                        x <= (actObj.bottomRightCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                        y >= (actObj.bottomCenterCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                        y <= (actObj.bottomCenterCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 's-resize') {
                    actObj.bottomCenterCircle.startX = actObj.bottomCenterCircle.startY = 0;
                    parent.upperCanvas.style.cursor = parent.cursor = 's-resize'; isResize = true;
                    this.dragElement = parent.upperCanvas.style.cursor;
                } else if (x >= (actObj.bottomRightCircle.startX - (actObj.topLeftCircle.radius * 2)) &&
                        x <= (actObj.bottomRightCircle.startX + (actObj.topLeftCircle.radius * 2)) &&
                        y >= (actObj.bottomRightCircle.startY - (actObj.topLeftCircle.radius * 2)) &&
                        y <= (actObj.bottomRightCircle.startY + (actObj.topLeftCircle.radius * 2)) && this.dragElement !== 'se-resize') {
                    actObj.bottomRightCircle.startX = actObj.bottomRightCircle.startY = 0;
                    parent.upperCanvas.style.cursor = parent.cursor = 'se-resize'; isResize = true;
                    this.dragElement = parent.upperCanvas.style.cursor;
                } else if (rotationCirclePoint &&
                        x >= rotationCirclePoint.x - (actObj.topLeftCircle.radius * 2) &&
                        x <= rotationCirclePoint.x + (actObj.topLeftCircle.radius * 2) &&
                        y >= rotationCirclePoint.y - (actObj.topLeftCircle.radius * 2) &&
                        y <= rotationCirclePoint.y + (actObj.topLeftCircle.radius * 2) && this.dragElement !== 'grabbing') {
                    parent.upperCanvas.style.cursor = parent.cursor = 'grabbing';
                    this.dragElement = parent.upperCanvas.style.cursor;
                } else {
                    this.dragPoint.startX = this.previousPoint.x = this.dragPoint.endX = x;
                    this.dragPoint.startY = this.previousPoint.y = this.dragPoint.endY = y;
                }
                if ((actObj.shape === 'text') && (parent.cursor === 'n-resize' ||
                    parent.cursor === 's-resize' || parent.cursor === 'e-resize' ||
                    parent.cursor === 'w-resize')) {
                    parent.upperCanvas.style.cursor = parent.cursor = 'move'; this.dragElement = '';
                    this.dragPoint.startX = this.previousPoint.x = this.dragPoint.endX = x;
                    this.dragPoint.startY = this.previousPoint.y = this.dragPoint.endY = y;
                }
            }
        } else {
            this.dragPoint.startX = this.previousPoint.x = this.dragPoint.endX = x;
            this.dragPoint.startY = this.previousPoint.y = this.dragPoint.endY = y;
        }
        this.previousPoint.x = this.previousPoint.y = this.diffPoint.x = this.diffPoint.y = 0;
        if (type === 'touchstart') {
            if (isResize || (x >= actObj.activePoint.startX && x <= actObj.activePoint.endX
                && y >= actObj.activePoint.startY && y <= actObj.activePoint.endY) || this.dragElement === 'grabbing') {
                parent.currObjType.isDragging = true;
            } else if (actObj.shape === 'line' || actObj.shape === 'arrow') {
                this.setCursorForLineArrow(actObj, x, y, parent.upperCanvas);
                if (parent.cursor === 'move') {
                    parent.currObjType.isDragging = true;
                }
            } else if (actObj.shape === 'path') {
                this.setCursorForPath(actObj, x, y, parent.upperCanvas);
                if (parent.cursor === 'move') {
                    parent.currObjType.isDragging = true;
                }
            }
        } else {
            parent.currObjType.isDragging = true;
        }
        if (actObj.rotatedAngle !== 0 && (this.dragElement === 'e-resize' ||
            this.dragElement === 'w-resize' || this.dragElement === 'n-resize' ||
            this.dragElement === 's-resize')) {
            this.dragPoint.startX = this.previousPoint.x = this.dragPoint.endX = x;
            this.dragPoint.startY = this.previousPoint.y = this.dragPoint.endY = y;
        }
    }

    private updateCursorStylesForLineArrow(x: number, y: number, actObj: SelectionPoint): boolean {
        let isResize: boolean = false;
        const parent: ImageEditor = this.parent;
        let point: Point;
        for (let i: number = 0; i < 5; i++) {
            point = actObj.pointColl[i as number];
            if (x >= (point.x - (actObj.topLeftCircle.radius * 2)) && x <= (point.x + (actObj.topLeftCircle.radius * 2)) &&
                y >= (point.y - (actObj.topLeftCircle.radius * 2)) && y <= (point.y + (actObj.topLeftCircle.radius * 2))) {
                actObj.centerLeftCircle.startX = actObj.centerLeftCircle.startY = 0;
                this.dragElement = 'w-resize'; isResize = true;
                break;
            }
        }
        if (!isResize) {
            for (let i: number = 1; i < 6; i++) {
                point = actObj.pointColl[actObj.pointColl.length - i as number];
                if (x >= (point.x - (actObj.topLeftCircle.radius * 2)) && x <= (point.x + (actObj.topLeftCircle.radius * 2)) &&
                    y >= (point.y - (actObj.topLeftCircle.radius * 2)) && y <= (point.y + (actObj.topLeftCircle.radius * 2))) {
                    actObj.centerRightCircle.startX = actObj.centerRightCircle.startY = 0;
                    this.dragElement = 'e-resize'; isResize = true;
                    break;
                }
            }
        }
        if (!isResize) {
            for (let i: number = 0; i < actObj.pointColl.length; i++) {
                point = actObj.pointColl[i as number];
                if (x >= (point.x - (actObj.topLeftCircle.radius * 2)) && x <= (point.x + (actObj.topLeftCircle.radius * 2)) &&
                    y >= (point.y - (actObj.topLeftCircle.radius * 2)) && y <= (point.y + (actObj.topLeftCircle.radius * 2))) {
                    parent.upperCanvas.style.cursor = parent.cursor = 'move';
                    this.dragPoint.startX = this.previousPoint.x = this.dragPoint.endX = x;
                    this.dragPoint.startY = this.previousPoint.y = this.dragPoint.endY = y;
                    break;
                } else {
                    parent.upperCanvas.style.cursor = parent.cursor = 'default';
                }
            }
        }
        return isResize;
    }

    private updateCursorStylesForPath(x: number, y: number, actObj: SelectionPoint): boolean {
        let isResize: boolean = false;
        this.pathAdjustedIndex = this.setCursorForLineArrow(actObj, x, y, this.parent.upperCanvas);
        if (this.parent.cursor === 'move') {
            isResize = true;
            this.dragElement = 'pathDrag';
        }
        if (!isResize) {
            this.parent.upperCanvas.style.cursor = this.parent.cursor = 'move';
            this.dragPoint.startX = this.previousPoint.x = this.dragPoint.endX = x;
            this.dragPoint.startY = this.previousPoint.y = this.dragPoint.endY = y;
        }
        return isResize;
    }

    private setTextSelection(width: number, height: number): void {
        const parent: ImageEditor = this.parent;
        let degree: number = parent.transform.degree;
        if (parent.activeObj.shapeDegree === 0) {degree = parent.transform.degree; }
        else {degree =  parent.transform.degree - parent.activeObj.shapeDegree; }
        if (degree < 0) {degree = 360 + degree; }
        for (let i: number = 0, len: number = parent.activeObj.flipObjColl.length; i < len; i++) {
            const flip: string = parent.activeObj.flipObjColl[i as number].toLowerCase();
            switch (degree) {
            case 0:
                switch (flip) {
                case 'horizontal':
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.endX - width,
                        startY: parent.activeObj.activePoint.startY,
                        endX: (parent.activeObj.activePoint.endX),
                        endY: parent.activeObj.activePoint.startY + (height ? height : 0) };
                    break;
                case 'vertical':
                    parent.activeObj.activePoint.startY = parent.activeObj.activePoint.endY - height;
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                        startY: parent.activeObj.activePoint.startY,
                        endX: (parent.activeObj.activePoint.startX + (width ? width : 0)),
                        endY: parent.activeObj.activePoint.endY };
                    break;
                default:
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                        startY: parent.activeObj.activePoint.startY,
                        endX: (parent.activeObj.activePoint.startX + (width ? width : 0)),
                        endY: parent.activeObj.activePoint.startY + (height ? height : 0) };
                    break;
                }
                break;
            case 90:
                switch (flip) {
                case 'horizontal':
                    parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + height;
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                        startY: parent.activeObj.activePoint.startY, endX: (parent.activeObj.activePoint.endX),
                        endY: parent.activeObj.activePoint.startY + (width ? width : 0) };
                    break;
                case 'vertical':
                    parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX - height;
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                        startY: parent.activeObj.activePoint.endY - width,
                        endX: (parent.activeObj.activePoint.endX),
                        endY: parent.activeObj.activePoint.endY};
                    break;
                default:
                    parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX - height;
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                        startY: parent.activeObj.activePoint.startY, endX: (parent.activeObj.activePoint.endX),
                        endY: parent.activeObj.activePoint.startY + (width ? width : 0) };
                    break;
                }
                break;
            case 180:
                switch (flip) {
                case 'horizontal':
                    parent.activeObj.activePoint.startY = parent.activeObj.activePoint.endY - height;
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                        startY: parent.activeObj.activePoint.startY,
                        endX: (parent.activeObj.activePoint.startX + width),
                        endY: parent.activeObj.activePoint.endY };
                    break;
                case 'vertical':
                    parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY + height;
                    parent.activeObj.activePoint = { endX: parent.activeObj.activePoint.endX, endY: parent.activeObj.activePoint.endY,
                        startX: (parent.activeObj.activePoint.endX - (width ? width : 0)),
                        startY: parent.activeObj.activePoint.startY };
                    break;
                default:
                    parent.activeObj.activePoint = { endX: parent.activeObj.activePoint.endX, endY: parent.activeObj.activePoint.endY,
                        startX: (parent.activeObj.activePoint.endX - (width ? width : 0)),
                        startY: parent.activeObj.activePoint.endY - (height ? height : 0) };
                    break;
                }
                break;
            case 270:
                switch (flip) {
                case 'horizontal':
                    parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX - height;
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                        startY: parent.activeObj.activePoint.endY - (width ? width : 0),
                        endX: parent.activeObj.activePoint.endX,
                        endY: parent.activeObj.activePoint.endY};
                    break;
                case 'vertical':
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                        startY: parent.activeObj.activePoint.startY,
                        endX: (parent.activeObj.activePoint.startX + height),
                        endY: parent.activeObj.activePoint.startY + (width ? width : 0) };
                    break;
                default:
                    parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + height;
                    parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                        startY: parent.activeObj.activePoint.endY - (width ? width : 0),
                        endX: parent.activeObj.activePoint.endX,
                        endY: parent.activeObj.activePoint.endY};
                    break;
                }
                break;
            }
        }
        if (parent.activeObj.flipObjColl.length === 0) {
            switch (degree) {
            case 0:
                parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX, startY: parent.activeObj.activePoint.startY,
                    endX: (parent.activeObj.activePoint.startX + (width ? width : 0)),
                    endY: parent.activeObj.activePoint.startY + (height ? height : 0) };
                break;
            case 90:
                parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX - height;
                parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX, startY: parent.activeObj.activePoint.startY,
                    endX: (parent.activeObj.activePoint.endX),
                    endY: parent.activeObj.activePoint.startY + (width ? width : 0) };
                break;
            case 180:
                parent.activeObj.activePoint = { endX: parent.activeObj.activePoint.endX, endY: parent.activeObj.activePoint.endY,
                    startX: (parent.activeObj.activePoint.endX - (width ? width : 0)),
                    startY: parent.activeObj.activePoint.endY - (height ? height : 0) };
                break;
            case 270:
                parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + height;
                parent.activeObj.activePoint = { startX: parent.activeObj.activePoint.startX,
                    startY: parent.activeObj.activePoint.endY - (width ? width : 0),
                    endX: parent.activeObj.activePoint.endX,
                    endY: parent.activeObj.activePoint.endY};
                break;
            }
        }
        parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
        parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
        if (parent.transform.degree === 360 || parent.transform.degree === -360) {parent.transform.degree = 0; }
    }

    private setActivePoint(startX?: number, startY?: number): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.activeObj.activePoint)) {
            return;
        }
        if (parent.currObjType.isText) {
            const textWidth: number = startX ? startX : 0;
            const textHeight: number = startY ? startY : parent.activeObj.textSettings.fontSize;
            if (parent.activeObj.textSettings.fontSize === undefined) {
                parent.activeObj.textSettings.fontSize = (Math.abs(parent.baseImg.width - parent.baseImg.height)) * 0.1;
            }
            this.setTextSelection(textWidth, textHeight);
            this.mouseDownPoint.x = parent.activeObj.activePoint.endX; this.mouseDownPoint.y = parent.activeObj.activePoint.endY;
            if (parent.activeObj.horTopLine !== undefined) {
                parent.activeObj.activePoint = extend({}, parent.activeObj.activePoint, {}, true) as ActivePoint;
            }
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate'}});
        } else if (startX && startY) {
            parent.activeObj.activePoint.startX = this.mouseDownPoint.x = startX;
            parent.activeObj.activePoint.startY = this.mouseDownPoint.y = startY;
            parent.currObjType.isDragging = true;
        } else {
            const selectInfo: SelectionPoint = parent.activeObj;
            parent.activeObj.activePoint = { startX: selectInfo.horTopLine.startX, startY: selectInfo.horTopLine.startY,
                endX: selectInfo.horTopLine.endX, endY: selectInfo.horTopLine.endY };
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
        }
    }

    private mouseDownEventHandler(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        if (e.type === 'touchstart') {
            this.isTouch = true;
        } else {
            this.isTouch = false;
        }
        if (e.type === 'touchstart' && e.currentTarget === parent.lowerCanvas && !parent.isImageLoaded) {
            return;
        }
        this.isCropSelection = false; this.isPan = true; let splitWords: string[];
        if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
        if (splitWords !== undefined && splitWords[0] === 'crop'){
            this.isCropSelection = true;
        }
        if (this.isCropSelection) {
            this.dragCanvas = parent.togglePan = true;
        }
        const imageEditorClickEventArgs: ImageEditorClickEventArgs = {point: this.setXYPoints(e)};
        if (isBlazor() && parent.events && parent.events.clicked.hasDelegate === true) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('ClickEventAsync', 'click', imageEditorClickEventArgs) as any).then((imageEditorClickEventArgs: ImageEditorClickEventArgs) => {
                this.clickEvent(imageEditorClickEventArgs, e);
            });
        } else {
            parent.trigger('click', imageEditorClickEventArgs);
            this.clickEvent(imageEditorClickEventArgs, e);
        }
    }

    private getImagePoints(x: number, y: number): Point {
        const parent: ImageEditor = this.parent;
        if (x < parent.img.destLeft) {
            x = parent.img.destLeft;
        }
        else if (x > parent.img.destLeft + parent.img.destWidth) {
            x = parent.img.destLeft + parent.img.destWidth;
        }
        if (y < parent.img.destTop) {
            y = parent.img.destTop;
        }
        else if (y > parent.img.destTop + parent.img.destHeight) {
            y = parent.img.destTop + parent.img.destHeight;
        }
        return {x: x, y: y};
    }

    private clickEvent(imageEditorClickEventArgs: ImageEditorClickEventArgs, e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        const x: number = imageEditorClickEventArgs.point.x; const y: number = imageEditorClickEventArgs.point.y;
        const cursor: string = parent.activeObj.shape && parent.activeObj.shape === 'text' ?
            parent.cursor : 'default';
        if (this.currentDrawingShape !== '') {
            const object: Object = {currObj: {} as CurrentObject };
            parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
            this.initialPrevObj = object['currObj'];
            this.initialPrevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
            this.initialPrevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
            this.initialPrevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
            const selPointCollObj: Object = {selPointColl: null };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                value: {obj: selPointCollObj }});
            this.initialPrevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
            this.setActivePoint(x, y);
            if (this.currentDrawingShape === 'path') {
                const point: Point = this.getImagePoints(x, y);
                parent.activeObj.pointColl.push({x: point.x, y: point.y });
                if (parent.activeObj.activePoint.width !== 0 && parent.activeObj.activePoint.height !== 0) {
                    parent.activeObj.activePoint.width = 0; parent.activeObj.activePoint.height = 0;
                    parent.activeObj.activePoint.startX = parent.activeObj.pointColl[parent.activeObj.pointColl.length - 1].x;
                    parent.activeObj.activePoint.startY = parent.activeObj.pointColl[parent.activeObj.pointColl.length - 1].y;
                }
            }
            parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY;
            parent.currObjType.isDragging = true;
            return;
        }
        if (this.isCropSelection && this.dragCanvas) {
            this.setCursor(x, y);
            if (parent.cursor !== 'move' && parent.cursor !== 'crosshair' &&
            parent.cursor !== 'default' && parent.cursor !== 'grab') {
                this.isPan = false;
            }
        }
        if (parent.activeObj.shape) {
            this.isObjSelected = true;
        } else {
            this.isObjSelected = false;
        }
        const object: Object = {currObj: {} as CurrentObject };
        parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        const activeObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
        const isShape: boolean = this.isShapeTouch(e, this.isCropSelection);
        const isFreehandDraw: boolean = this.isFreehandDrawTouch(e, this.isCropSelection);
        const isShapeClick: boolean = isShape ? isShape : this.isShapeClick(e, this.isCropSelection);
        const allowUndoRedoPush: boolean = this.applyCurrShape(isShapeClick);
        if (this.isTouch && !isShape && activeObj.shape && !this.isCropSelection) {
            if (this.applyObj(x, y)) {
                parent.okBtn(true);
                parent.notify('draw', { prop: 'setPrevActObj', onPropertyChange: false, value: { prevActObj: null }});
            }
            const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
            parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: parent.isCircleCrop}});
            if (allowUndoRedoPush) {
                parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
            }
        }
        if (!isShape && !parent.togglePen && !this.isCropSelection) {
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
                parent.notify('toolbar', { prop: 'close-contextual-toolbar', onPropertyChange: false});
            } else if (parent.isImageLoaded) {
                parent.updateToolbar(parent.element, 'imageLoaded', 'okBtnClick');
            }
        }
        if (this.dragCanvas && this.isPan && (parent.cursor === 'grab' || this.isTouch)
            && !isShape && !isFreehandDraw && !parent.togglePen) {
            if (this.applyObj(x, y)) {
                parent.okBtn(true);
                if (allowUndoRedoPush) {
                    parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
                }
                parent.notify('draw', { prop: 'setPrevActObj', onPropertyChange: false, value: { prevActObj: null }});
            }
            if (this.isFhdEditing) {
                parent.notify('freehand-draw', {prop: 'applyFhd', onPropertyChange: false});
                this.isFhdCustomized = false;
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
                }
            }
            if (parent.activeObj.shape && (parent.activeObj.shape === 'rectangle' ||
                parent.activeObj.shape === 'ellipse' || parent.activeObj.shape === 'line' ||
                parent.activeObj.shape === 'arrow' || parent.activeObj.shape === 'path' || parent.activeObj.shape === 'text')) {
                parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                    value: {x: null, y: null, isMouseDown: null}});
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                if (!isBlazor()) {
                    parent.notify('toolbar', {prop: 'setCurrentToolbar', value: {type: 'main' }});
                    parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
                } else {
                    parent.updateToolbar(parent.element, 'imageLoaded');
                }
            }
            this.canvasMouseDownHandler(e);
        }
        else {
            let isLineArrow: boolean = false;
            if (parent.activeObj.shape && (parent.activeObj.shape === 'line' ||
                parent.activeObj.shape === 'arrow')) {
                isLineArrow = true;
            }
            const points: Point = this.setXYPoints(e);
            const x: number = points.x; const y: number = points.y;
            if (this.applyObj(x, y)) {
                parent.okBtn(true);
                if (allowUndoRedoPush) {
                    parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
                }
                parent.notify('draw', { prop: 'setPrevActObj', onPropertyChange: false, value: { prevActObj: null }});
            }
            parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: {x: x, y: y, isMouseDown: true}});
            const obj: Object = {index: null };
            parent.notify('freehand-draw', {prop: 'getFreehandDrawHoveredIndex', onPropertyChange: false, value: {obj: obj }});
            const indexObj: Object = {freehandSelectedIndex: null };
            parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
            if (this.isFhdPoint || (this.isFhdCustomized && !parent.togglePen)) {
                if (!isNullOrUndefined(indexObj['freehandSelectedIndex']) &&
                indexObj['freehandSelectedIndex'] !== obj['index']) {
                    const tempHoveredIndex: number = obj['index'];
                    parent.okBtn();
                    this.isFhdCustomized = false;
                    parent.notify('freehand-draw', { prop: 'setFreehandDrawHoveredIndex', onPropertyChange: false,
                        value: {index: tempHoveredIndex }});
                    if (obj['index'] > -1) {
                        const strokeColor: string = parent.pointColl[obj['index']].strokeColor;
                        parent.notify('freehand-draw', { prop: 'hoverFhd', onPropertyChange: false,
                            value: {strokeColor: strokeColor, strokeWidth: parent.pointColl[obj['index']].strokeWidth}});
                    }
                }
                indexObj['freehandSelectedIndex'] = null;
                parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
                if (!isNullOrUndefined(obj['index']) && obj['index'] > -1) {
                    parent.notify('freehand-draw', {prop: 'selectFhd', value: {type: 'ok' }});
                    if (!isBlazor()) {
                        parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: true} });
                    } else {
                        parent.updateToolbar(parent.element, 'pen');
                        parent.updateToolbar(parent.element, 'quickAccessToolbar', 'pen');
                    }
                } else if (indexObj['freehandSelectedIndex']) {
                    parent.okBtn();
                    const strokeColor: string = parent.pointColl[indexObj['freehandSelectedIndex']].strokeColor;
                    parent.notify('freehand-draw', { prop: 'hoverFhd', onPropertyChange: false,
                        value: {strokeColor: strokeColor, strokeWidth: parent.pointColl[indexObj['freehandSelectedIndex']].strokeWidth}});
                }
            } else {
                if (this.isFhdEditing) {
                    parent.notify('freehand-draw', {prop: 'cancelFhd', value: {type: 'ok' }});
                    if (document.getElementById(parent.element.id + '_quickAccessToolbarArea')) {
                        document.getElementById(parent.element.id + '_quickAccessToolbarArea').style.display = 'none';
                    }
                }
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'close-contextual-toolbar', onPropertyChange: false});
                }
                this.isFhdEditing = false;
                if (isLineArrow) {
                    this.setCursor(x, y);
                } else if (cursor !== 'default') {
                    parent.upperCanvas.style.cursor = parent.cursor = cursor;
                }
                // this.setCursor(x, y);
                if (parent.cursor === 'crosshair' || (Browser.isDevice && parent.togglePen)) {
                    if (parent.togglePen) {
                        if (isNullOrUndefined(parent.activeObj.strokeSettings)) {
                            const obj: Object = {strokeSettings: {} as StrokeSettings };
                            parent.notify('shape', { prop: 'getStrokeSettings', onPropertyChange: false,
                                value: {obj: obj }});
                            parent.activeObj.strokeSettings = obj['strokeSettings'];
                        }
                        const obj: Object = {penStrokeWidth: null };
                        parent.notify('freehand-draw', {prop: 'getPenStrokeWidth', onPropertyChange: false, value: {obj: obj }});
                        if (isNullOrUndefined(obj['penStrokeWidth'])) {
                            parent.notify('freehand-draw', {prop: 'setPenStrokeWidth', onPropertyChange: false, value: {value: 2 }});
                        }
                        this.upperContext.strokeStyle = parent.activeObj.strokeSettings.strokeColor;
                        this.upperContext.fillStyle = parent.activeObj.strokeSettings.strokeColor;
                        parent.notify('freehand-draw', { prop: 'freehandDownHandler', onPropertyChange: false,
                            value: {e: e, canvas: parent.upperCanvas} });
                    } else {
                        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                    }
                    parent.currObjType.isActiveObj = false; this.dragElement = '';
                    this.dragPoint.startX = this.dragPoint.startY = this.dragPoint.endX = this.dragPoint.endY = 0;
                }
                if ((parent.cursor !== 'crosshair' && e.type.toLowerCase() === 'touchstart') ||
                (parent.currObjType.isActiveObj && parent.cursor !== 'default' && !parent.togglePen)) {
                    if (parent.currObjType.isUndoAction) {
                        parent.notify('undo-redo', {prop: 'refreshUrc', value: {bool: null }});
                    }
                    this.findTarget(x, y, e.type);
                }
                else if ((parent.currObjType.shape === '' || parent.currObjType.isCustomCrop) && !parent.togglePen  && parent.cursor !== 'default') {
                    this.setActivePoint(x, y);
                }
            }
        }
        this.isShapeInserted = false;
        this.tempActiveObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
    }

    private mouseMoveEventHandler(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        const cursor: string = parent.cursor;
        const canvasCursor: string = parent.upperCanvas.style.cursor;
        e.preventDefault();
        const bbox: DOMRect = parent.lowerCanvas.getBoundingClientRect() as DOMRect;
        if (e.type === 'touchmove' && e.touches.length === 2) {
            if (this.isFirstMove) {
                this.startTouches = this.targetTouches(e.touches);
                this.tempTouches = [];
                this.tempTouches.push({x: (e.touches[0].clientX || (e.touches[0].pageX - parent.lowerCanvas.offsetLeft) - bbox.left),
                    y: (e.touches[0].clientY || (e.touches[0].pageY - parent.lowerCanvas.offsetTop)) - bbox.top});
                this.tempTouches.push({x: (e.touches[1].clientX || (e.touches[1].pageX - parent.lowerCanvas.offsetLeft)) - bbox.left,
                    y: (e.touches[1].clientY || (e.touches[1].pageY - parent.lowerCanvas.offsetTop)) - bbox.top});
            } else {
                const firstFingerX: number = (e.touches[0].clientX || (e.touches[0].pageX - parent.lowerCanvas.offsetLeft)) - bbox.left;
                const firstFingerY: number = (e.touches[0].clientY || (e.touches[0].pageY - parent.lowerCanvas.offsetTop)) - bbox.top;
                const secondFingerX: number = (e.touches[1].clientX || (e.touches[1].pageX - parent.lowerCanvas.offsetLeft)) - bbox.left;
                const secondFingerY: number = (e.touches[1].clientY || (e.touches[1].pageY - parent.lowerCanvas.offsetTop)) - bbox.top;
                const center: Point = {x: firstFingerX < secondFingerX ? secondFingerX - ((secondFingerX - firstFingerX) / 2) :
                    firstFingerX - ((firstFingerX - secondFingerX) / 2), y: firstFingerY < secondFingerY ?
                    secondFingerY - ((secondFingerY - firstFingerY) / 2) : firstFingerY - ((firstFingerY - secondFingerY) / 2)};
                if (this.currMousePoint.x !== center.x && this.currMousePoint.y !== center.y) {
                    let type: string = '';
                    if (e.type === 'touchmove' && (parent.zoomSettings.zoomTrigger & ZoomTrigger.Pinch) === ZoomTrigger.Pinch) {
                        this.zoomType = 'Pinch';
                        const scale: number = this.calculateScale(this.startTouches,
                                                                  this.targetTouches((e as MouseEvent & TouchEvent).touches));
                        this.startTouches = this.targetTouches((e as MouseEvent & TouchEvent).touches);
                        if (scale > 1) {
                            type = 'zoomIn';
                        } else if (scale < 1) {
                            type = 'zoomOut';
                        }
                    }
                    if (type !== '') {
                        parent.notify('draw', { prop: 'performPointZoom', onPropertyChange: false,
                            value: {x: center.x, y: center.y, type: type}});
                    }
                    this.tempTouches = [];
                    this.tempTouches.push({x: e.touches[0].clientX || (e.touches[0].pageX - parent.lowerCanvas.offsetLeft),
                        y: e.touches[0].clientY || (e.touches[0].pageY - parent.lowerCanvas.offsetTop)});
                    this.tempTouches.push({x: e.touches[1].clientX || (e.touches[1].pageX - parent.lowerCanvas.offsetLeft),
                        y: e.touches[1].clientY || (e.touches[1].pageY - parent.lowerCanvas.offsetTop)});
                    this.currMousePoint.x = center.x; this.currMousePoint.y = center.y;
                }
            }
            this.isFirstMove = false;
            return;
        }
        let x: number; let y: number;
        if (e.type === 'mousemove') {
            x = e.clientX; y = e.clientY;
        } else {
            this.touchEndPoint.x = x = e.touches[0].clientX;
            this.touchEndPoint.y = y = e.touches[0].clientY;
        }
        x -= bbox.left; y -= bbox.top;
        this.canvasMouseMoveHandler(e);
        let isCropSelection: boolean = false; let splitWords: string[];
        if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
        if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        if (isCropSelection) {
            parent.notify('transform', { prop: 'disableZoomOutBtn', value: {isZoomOut: true }});
        }
        parent.upperCanvas.style.cursor = canvasCursor; parent.cursor = cursor;
        if (parent.currObjType.isActiveObj && (parent.activeObj.activePoint !== undefined || parent.objColl.length > 0) &&
            !this.dragCanvas || parent.activeObj.activePoint !== undefined) {
            if (this.dragElement === '') {
                this.setCursor(x, y);
                if ((parent.activeObj.activePoint &&
                    (parent.activeObj.activePoint.width === 0 || (!isNullOrUndefined(parent.activeObj.currIndex) &&
                    this.cursorTargetId !== parent.activeObj.currIndex)))
                    && parent.cursor !== 'default' &&
                    parent.cursor !== 'move' && parent.cursor !== 'crosshair'
                    && parent.cursor !== 'grab' && parent.cursor !== 'pointer') {
                    parent.upperCanvas.style.cursor = parent.cursor = 'move';
                }
                this.findTarget(x, y, e.type);
            }
        }
        if (parent.currObjType.isDragging) {
            this.upperContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
            this.updateActivePoint(x, y, isCropSelection);
            parent.notify('shape', { prop: 'updateTrianglePoints', onPropertyChange: false, value: {obj: parent.activeObj}});
            if (this.isPreventDragging) {
                if ((parent.activeObj.activePoint.startX > parent.img.destLeft) &&
                    (parent.activeObj.activePoint.endX < parent.img.destLeft + parent.img.destWidth) &&
                    (parent.activeObj.activePoint.startY > parent.img.destTop)
                    && (parent.activeObj.activePoint.endY < parent.img.destTop + parent.img.destHeight)) {
                    this.isPreventDragging = false;
                }
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: null, isCropRatio: null,
                    points: null, isPreventDrag: true, saveContext: null, isPreventSelection: null } });
            } else {
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: null, isCropRatio: null,
                    points: null, isPreventDrag: null, saveContext: null, isPreventSelection: null }});
            }
            if (isCropSelection) {
                this.dragCanvas = parent.togglePan = true;
            }
        }
    }

    private mouseUpEventHandler(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        if (e.type === 'touchstart') {
            this.isTouch = false;
        } else if (e.type === 'touchend') {
            e.stopImmediatePropagation();
        }
        e.preventDefault();
        if (parent.togglePan) {this.canvasMouseUpHandler(e); }
        let x: number; let y: number;
        if (e.type === 'mouseup') {
            x = e.clientX; y = e.clientY;
        } else {
            x = this.touchEndPoint.x; y = this.touchEndPoint.y;
        }
        const bbox: DOMRect = parent.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        if (e.type === 'touchend') {
            this.startTouches = this.tempTouches = [];
            this.isFirstMove = false;
            if (parent.textArea.style.display === 'none') {
                this.timer = 0;
            }
        }
        let isCropSelection: boolean = false; let splitWords: string[];
        if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
        if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        if (isBlazor() && this.parent.eventType) {
            if (this.parent.eventType === 'pan') {
                if (parent.events && parent.events.onPanEnd.hasDelegate === true) {
                    parent.dotNetRef.invokeMethodAsync('PanEventAsync', 'OnPanEnd', this.parent.panEventArgs);
                }
            }
            else if (this.parent.eventType === 'resize') {
                if (!this.isCropSelection && this.parent.events && this.parent.events.onShapeResizeEnd.hasDelegate === true) {
                    this.shapeResizingArgs.currentShapeSettings = this.updatePrevShapeSettings();
                    this.shapeResizingArgs.action = this.currentDrawingShape !== '' ? 'drawing' : 'resize-end';
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    (this.parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShapeResizeEnd', this.shapeResizingArgs) as any).then((shapeResizingArgs: ShapeChangeEventArgs) => {
                        this.parent.notify('shape', { prop: 'updateShapeChangeEventArgs', onPropertyChange: false,
                            value: {shapeSettings: shapeResizingArgs.currentShapeSettings}});
                    });
                } else if (this.shapeResizingArgs && this.selectionResizingArgs && this.parent.events &&
                    this.parent.events.onSelectionResizeEnd.hasDelegate === true) {
                    const currentSelectionSettings: CropSelectionSettings = {type: this.parent.activeObj.shape,
                        startX: this.shapeResizingArgs.currentShapeSettings.startX,
                        startY: this.shapeResizingArgs.currentShapeSettings.startY,
                        width: this.shapeResizingArgs.currentShapeSettings.width,
                        height: this.shapeResizingArgs.currentShapeSettings.height};
                    this.selectionResizingArgs.currentSelectionSettings = currentSelectionSettings;
                    this.selectionResizingArgs.action = 'resize-end';
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    (this.parent.dotNetRef.invokeMethodAsync('SelectionEventAsync', 'OnSelectionResizeEnd', this.selectionResizingArgs) as any).then((selectionResizingArgs: SelectionChangeEventArgs) => {
                        this.parent.notify('shape', { prop: 'updateSelectionChangeEventArgs', onPropertyChange: false,
                            value: {selectionSettings: selectionResizingArgs.currentSelectionSettings}});
                    });
                }
            } else {
                if (this.shapeMovingArgs && this.parent.events && this.parent.events.onShapeDragEnd.hasDelegate === true) {
                    this.shapeMovingArgs.currentShapeSettings = this.updatePrevShapeSettings();
                    this.shapeMovingArgs.action = 'drag-end';
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    (this.parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShapeDragEnd', this.shapeMovingArgs) as any).then((shapeMovingArgs: ShapeChangeEventArgs) => {
                        this.parent.notify('shape', { prop: 'updateShapeChangeEventArgs', onPropertyChange: false,
                            value: {shapeSettings: shapeMovingArgs.currentShapeSettings}});
                    });
                }
            }
            this.shapeResizingArgs = null;
            this.shapeMovingArgs = null;
            this.parent.panEventArgs = null;
            this.parent.eventType = null;
        }
        if (this.currentDrawingShape === 'path') {
            return;
        }
        if (e.currentTarget === parent.upperCanvas) {
            this.pathAdjustedIndex = null;
            if (this.currentDrawingShape !== '') {
                if (this.currentDrawingShape === 'text') {
                    const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
                    parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                        value: {operation: 'shapeTransform', previousObj: this.initialPrevObj, previousObjColl: this.initialPrevObj.objColl,
                            previousPointColl: this.initialPrevObj.pointColl, previousSelPointColl: this.initialPrevObj.selPointColl,
                            previousCropObj: prevCropObj, previousText: null,
                            currentText: null, previousFilter: null, isCircleCrop: null }});
                } else {
                    parent.notify('undo-redo', { prop: 'updateUrObj', onPropertyChange: false, value: {objColl: this.initialPrevObj.objColl}});
                }
                this.isShapeInserted = true; this.currentDrawingShape = '';
                if (parent.activeObj.activePoint.width === 0 && parent.activeObj.activePoint.height === 0) {
                    parent.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                }
            }
            this.adjustActObjForLineArrow(); this.updPtCollForShpRot();
            parent.currObjType.shape = parent.currObjType.shape.toLowerCase();
            const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
            const object: Object = {currObj: {} as CurrentObject };
            parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
            const prevObj: CurrentObject = object['currObj'];
            prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
            prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
            prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
            const selPointCollObj: Object = {selPointColl: null };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                value: {obj: selPointCollObj }});
            prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
            if (!parent.togglePen && !isCropSelection) {
                if (this.tempObjColl && parent.activeObj.activePoint.width !== 0) {
                    parent.objColl.push(parent.activeObj);
                    if (JSON.stringify(parent.activeObj.activePoint) !== JSON.stringify(this.tempActiveObj.activePoint)) {
                        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                            value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: this.tempObjColl,
                                previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                                previousCropObj: prevCropObj, previousText: null,
                                currentText: null, previousFilter: null, isCircleCrop: null}});
                    }
                    this.redrawShape(parent.objColl[parent.objColl.length - 1], true);
                    this.tempObjColl = undefined;
                }
                if (!this.isFhdEditing) {
                    this.applyCurrActObj(x, y);
                    parent.currObjType.isResize = false;
                    if (!isBlazor()) {parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false}); }
                }
            }
            if (parent.activeObj) {
                let isCropSelection: boolean = false;
                let splitWords: string[];
                if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
                if (splitWords === undefined && (parent.currObjType.isCustomCrop || parent.togglePen)) {
                    isCropSelection = true;
                } else if (splitWords !== undefined && splitWords[0] === 'crop'){
                    isCropSelection = true;
                }
                if (!isBlazor()) {
                    if ((parent.activeObj.shape === 'rectangle') || (parent.activeObj.shape === 'ellipse')
                    || (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow' || parent.activeObj.shape === 'path')) {
                        parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'shapes',
                            isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    } else if (parent.activeObj.shape === 'text') {
                        parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'text',
                            isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    } else if (this.isFhdEditing) {
                        parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'pen',
                            isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    } else if (!isCropSelection) {
                        const eventargs: object = { type: 'main', isApplyBtn: null, isCropping: false, isZooming: null };
                        parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
                    }
                    parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
                } else {
                    if ((parent.activeObj.shape === 'rectangle') || (parent.activeObj.shape === 'ellipse')
                    || (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow' || parent.activeObj.shape === 'path')) {
                        parent.updateToolbar(parent.element, parent.activeObj.shape);
                    } else if (parent.activeObj.shape === 'text') {
                        parent.updateToolbar(parent.element, 'text');
                    }
                }
            }
        }
        if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
        if (splitWords !== undefined && splitWords[0] === 'crop'){
            isCropSelection = true;
        }
        if (parent.activeObj.shape && !isCropSelection && e.currentTarget === parent.upperCanvas &&
            parent.textArea.style.display === 'none') {
            if (parent.activeObj.shape === 'text') {
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'text',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                }
            } else {
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'shapes',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                }
            }
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
                parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
            } else {
                parent.updateToolbar(parent.element, 'quickAccessToolbar', parent.activeObj.shape);
            }
        }
        if (parent.togglePen && e.currentTarget === parent.upperCanvas) {
            parent.notify('freehand-draw', { prop: 'freehandUpHandler', onPropertyChange: false,
                value: {e: e, canvas: parent.upperCanvas, context: this.upperContext} });
        } else {parent.currObjType.shape = ''; }
        this.dragElement = '';
        parent.currObjType.isInitialLine = parent.currObjType.isDragging = false;
        this.selMouseUpEvent();
    }

    private adjustActObjForLineArrow(obj?: SelectionPoint): boolean {
        let isAdjusted: boolean = false;  const parent: ImageEditor = this.parent;
        obj = obj ? obj : parent.activeObj;
        if (obj.shape && (obj.shape === 'line' || parent.activeObj.shape === 'arrow')) {
            let temp: number;
            if ((this.dragElement === 'e-resize' && obj.activePoint.endX < obj.activePoint.startX) ||
                (this.dragElement === 'w-resize' && obj.activePoint.startX > obj.activePoint.endX)) {
                isAdjusted = true;
                temp = obj.activePoint.startX;
                obj.activePoint.startX = obj.activePoint.endX;
                obj.activePoint.endX = temp;
                temp = obj.activePoint.startY;
                obj.activePoint.startY = obj.activePoint.endY;
                obj.activePoint.endY = temp;
            }
            obj.activePoint.width = Math.abs(obj.activePoint.endX - obj.activePoint.startX);
            obj.activePoint.height = Math.abs(obj.activePoint.endY - obj.activePoint.startY);
            if (parent.activeObj.shape !== 'path') {
                parent.notify('shape', { prop: 'setPointCollForLineArrow', onPropertyChange: false,
                    value: {obj: obj }});
                // Updating ratio for point collection
                for (let i: number = 0; i < obj.pointColl.length; i++) {
                    obj.pointColl[i as number].ratioX = (obj.pointColl[i as number].x -
                        parent.img.destLeft) / parent.img.destWidth;
                    obj.pointColl[i as number].ratioY = (obj.pointColl[i as number].y -
                        parent.img.destTop) / parent.img.destHeight;
                }
            }
        }
        return isAdjusted;
    }

    private updPtCollForShpRot(obj?: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        obj = obj ? obj : parent.activeObj;
        if (obj.shape && obj.rotatedAngle !== 0) {
            parent.notify('shape', { prop: 'setPointCollForShapeRotation', onPropertyChange: false,
                value: {obj: obj }});
            // Updating ratio for point collection
            for (let i: number = 0; i < obj.horTopLinePointColl.length; i++) {
                obj.horTopLinePointColl[i as number].ratioX = (obj.horTopLinePointColl[i as number].x -
                    parent.img.destLeft) / parent.img.destWidth;
                obj.horTopLinePointColl[i as number].ratioY = (obj.horTopLinePointColl[i as number].y -
                    parent.img.destTop) / parent.img.destHeight;
            }
            for (let i: number = 0; i < obj.horBottomLinePointColl.length; i++) {
                obj.horBottomLinePointColl[i as number].ratioX = (obj.horBottomLinePointColl[i as number].x -
                    parent.img.destLeft) / parent.img.destWidth;
                obj.horBottomLinePointColl[i as number].ratioY = (obj.horBottomLinePointColl[i as number].y -
                    parent.img.destTop) / parent.img.destHeight;
            }
            for (let i: number = 0; i < obj.verLeftLinePointColl.length; i++) {
                obj.verLeftLinePointColl[i as number].ratioX = (obj.verLeftLinePointColl[i as number].x -
                    parent.img.destLeft) / parent.img.destWidth;
                obj.verLeftLinePointColl[i as number].ratioY = (obj.verLeftLinePointColl[i as number].y -
                    parent.img.destTop) / parent.img.destHeight;
            }
            for (let i: number = 0; i < obj.verRightLinePointColl.length; i++) {
                obj.verRightLinePointColl[i as number].ratioX = (obj.verRightLinePointColl[i as number].x -
                    parent.img.destLeft) / parent.img.destWidth;
                obj.verRightLinePointColl[i as number].ratioY = (obj.verRightLinePointColl[i as number].y -
                    parent.img.destTop) / parent.img.destHeight;
            }
        }
    }

    private setXYPoints(e: MouseEvent & TouchEvent): Point {
        e.preventDefault();
        let x: number; let y: number;
        if (e.type === 'mousedown') {
            x = e.clientX; y = e.clientY;
        } else {
            this.touchEndPoint.x = x = e.touches[0].clientX;
            this.touchEndPoint.y = y = e.touches[0].clientY;
        }
        const bbox: DOMRect = this.parent.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        return {x: x, y: y};
    }

    private getCurrentIndex(): number {
        let index: number; const parent: ImageEditor = this.parent;
        for (let i: number = 0; i < parent.objColl.length; i++) {
            if (parent.activeObj.currIndex === parent.objColl[i as number].currIndex) {
                index = i;
                break;
            }
        }
        return index;
    }

    private isShapeClick(e: MouseEvent & TouchEvent, isCropSelection: boolean): boolean {
        const parent: ImageEditor = this.parent;
        let isShape: boolean = false;
        if (parent.togglePen) {
            return isShape;
        }
        if (parent.activeObj.shape && parent.activeObj.shape === 'text' && this.isShapeInserted) {
            const isTextArea: boolean = parent.textArea.style.display === 'block' ? true : false;
            const activeObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
            parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: { x: null, y: null, isMouseDown: true } });
            const points: Point = this.setXYPoints(e);
            const x: number = points.x; const y: number = points.y;
            isShape = this.findTargetObj(x, y, isCropSelection);
            if (!isCropSelection) {
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            }
            if (isTextArea) {
                parent.textArea.value = parent.objColl[parent.objColl.length - 1].keyHistory;
                parent.textArea.style.display = 'block';
                parent.activeObj = activeObj;
                const index: number = this.getCurrentIndex();
                if (isNullOrUndefined(index)) {
                    parent.objColl.pop();
                } else {
                    parent.objColl.splice(index, 1);
                }
            } else if (!isShape && activeObj.shape) {
                parent.activeObj = activeObj;
                const index: number = this.getCurrentIndex();
                if ((!isNullOrUndefined(index) &&
                    JSON.stringify(parent.activeObj.activePoint) === JSON.stringify(parent.objColl[index as number].activePoint))) {
                    parent.objColl.splice(index, 1);
                } else if (isNullOrUndefined(parent.activeObj.currIndex)) {
                    parent.objColl.pop();
                }
            }
        }
        return isShape;
    }

    private isShapeTouch(e: MouseEvent & TouchEvent, isCropSelection: boolean): boolean {
        const parent: ImageEditor = this.parent;
        let isShape: boolean = false;
        if (e.type === 'touchstart' && !parent.togglePen) {
            if (parent.activeObj && parent.activeObj.shape === 'text') {
                this.timer = setTimeout(this.setTimer.bind(this), 1000, e);
            }
            const isTextArea: boolean = parent.textArea.style.display === 'block' ? true : false;
            const activeObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
            parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: { x: null, y: null, isMouseDown: true } });
            const points: Point = this.setXYPoints(e);
            const x: number = points.x; const y: number = points.y;
            isShape = this.findTargetObj(x, y, isCropSelection);
            if (!isCropSelection) {
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            }
            if (isTextArea) {
                parent.textArea.value = parent.objColl[parent.objColl.length - 1].keyHistory;
                parent.textArea.style.display = 'block';
                parent.activeObj = activeObj;
                const index: number = this.getCurrentIndex();
                if (isNullOrUndefined(index)) {
                    parent.objColl.pop();
                } else {
                    parent.objColl.splice(index, 1);
                }
            } else if (!isShape && activeObj.shape) {
                parent.activeObj = activeObj;
                const index: number = this.getCurrentIndex();
                if (!isCropSelection) {
                    if ((!isNullOrUndefined(index) && JSON.stringify(parent.activeObj.activePoint) ===
                    JSON.stringify(parent.objColl[index as number].activePoint))) {
                        parent.objColl.splice(index, 1);
                    } else if (isNullOrUndefined(parent.activeObj.currIndex)) {
                        parent.objColl.pop();
                    }
                }
            }
            // this.timer = null;
        }
        return isShape;
    }

    private isFreehandDrawTouch(e: MouseEvent & TouchEvent, isCropSelection: boolean): boolean {
        const parent: ImageEditor = this.parent;
        let isFreehandDraw: boolean = false;
        if (e.type === 'touchstart' && !isCropSelection && !parent.togglePen) {
            const isTextArea: boolean = parent.textArea.style.display === 'block' ? true : false;
            const activeObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
            parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: {x: null, y: null, isMouseDown: true}});
            const points: Point = this.setXYPoints(e);
            const x: number = points.x; const y: number = points.y;
            this.setCursor(x, y);
            if (this.isFhdPoint) {
                isFreehandDraw = true;
            }
            if (isTextArea) {
                parent.textArea.value = parent.objColl[parent.objColl.length - 1].keyHistory;
                parent.textArea.style.display = 'block';
                parent.activeObj = activeObj;
                const index: number = this.getCurrentIndex();
                if (isNullOrUndefined(index)) {
                    parent.objColl.pop();
                } else {
                    parent.objColl.splice(index, 1);
                }
            } else if (activeObj.shape) {
                parent.activeObj = activeObj;
                const index: number = this.getCurrentIndex();
                if (!isCropSelection) {
                    if ((!isNullOrUndefined(index) && JSON.stringify(parent.activeObj.activePoint) ===
                    JSON.stringify(parent.objColl[index as number].activePoint))) {
                        parent.objColl.splice(index, 1);
                    } else if (isNullOrUndefined(parent.activeObj.currIndex)) {
                        parent.objColl.pop();
                    }
                }
            }
        }
        return isFreehandDraw;
    }

    private applyObj(x: number, y:  number): boolean {
        const parent: ImageEditor = this.parent;
        let isApply: boolean = false;
        if (parent.activeObj.shape && (parent.activeObj.shape === 'rectangle' || parent.activeObj.shape === 'ellipse' ||
            parent.activeObj.shape === 'text' || parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow' ||
            parent.activeObj.shape === 'path')) {
            if (x >= (parent.activeObj.activePoint.startX - (parent.activeObj.topLeftCircle.radius * 2)) &&
                        x <= (parent.activeObj.activePoint.endX + (parent.activeObj.topLeftCircle.radius * 2)) &&
                        y >= (parent.activeObj.activePoint.startY - (parent.activeObj.topLeftCircle.radius * 2)) &&
                        y <= (parent.activeObj.activePoint.endY + (parent.activeObj.topLeftCircle.radius * 2))) {
                isApply = false;
            } else if (parent.upperCanvas.style.cursor !== 'default' && parent.upperCanvas.style.cursor !== 'grab' &&
                parent.upperCanvas.style.cursor !== 'crosshair' && parent.upperCanvas.style.cursor !== 'pointer' &&
                parent.upperCanvas.style.cursor !== 'move') {
                isApply = false;
            } else {
                isApply = true;
            }
        }
        return isApply;
    }

    private applyCurrShape(isShapeClick: boolean): boolean {
        const parent: ImageEditor = this.parent;
        let isApply: boolean = false;
        if (parent.togglePen) {
            return isApply;
        }
        let obj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
        if (this.isShapeInserted && parent.activeObj.shape === 'text' && isShapeClick) {
            this.isInitialTextEdited = true;
            parent.notify('draw', { prop: 'setShapeTextInsert', onPropertyChange: false, value: {bool: true } });
        }
        if (parent.textArea.style.display === 'block') {
            const activeObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
            parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: { x: null, y: null, isMouseDown: null } });
            obj = extend({}, parent.objColl[parent.objColl.length - 1], null, true) as SelectionPoint;
            parent.objColl.pop();
            parent.activeObj = extend({}, activeObj, null, true) as SelectionPoint;
            parent.textArea.value = obj.keyHistory;
            parent.textArea.style.display = 'block';
            let strokeColor: string = obj.strokeSettings.strokeColor.split('(')[0] === 'rgb' ?
                this.rgbToHex(parseFloat(obj.strokeSettings.strokeColor.split('(')[1].split(',')[0]),
                              parseFloat(obj.strokeSettings.strokeColor.split('(')[1].split(',')[1]),
                              parseFloat(obj.strokeSettings.strokeColor.split('(')[1].split(',')[2])) :
                obj.strokeSettings.strokeColor;
            if (strokeColor === '#ffffff') {
                strokeColor = '#fff';
            }
            if (this.tempActiveObj.strokeSettings.strokeColor === '#ffffff') {
                this.tempActiveObj.strokeSettings.strokeColor = '#fff';
            }
            if (obj.keyHistory !== this.tempActiveObj.keyHistory ||
                strokeColor !== this.tempActiveObj.strokeSettings.strokeColor ||
                obj.textSettings.fontFamily !== this.tempActiveObj.textSettings.fontFamily ||
                Math.round(obj.textSettings.fontSize) !== Math.round(this.tempActiveObj.textSettings.fontSize) ||
                Math.round(obj.textSettings.fontRatio) !== Math.round(this.tempActiveObj.textSettings.fontRatio) ||
                obj.textSettings.bold !== this.tempActiveObj.textSettings.bold ||
                obj.textSettings.italic !== this.tempActiveObj.textSettings.italic ||
                obj.textSettings.underline !== this.tempActiveObj.textSettings.underline) {
                isApply = true;
            }
            if (this.isInitialTextEdited && !isApply) {
                isApply = true;
                this.isInitialTextEdited = false;
            }
        } else {
            this.tempActiveObj.activePoint.height = Math.abs(this.tempActiveObj.activePoint.height);
            isApply = JSON.stringify(obj) !== JSON.stringify(this.tempActiveObj);
        }
        return isApply;
    }

    private canvasMouseDownHandler(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        e.preventDefault();
        let x: number; let y: number;
        if (e.type === 'mousedown') {
            x = e.offsetX || (e.pageX - parent.lowerCanvas.offsetLeft);
            y = e.offsetY || (e.pageY - parent.lowerCanvas.offsetTop);
        } else {
            x = e.touches[0].clientX || (e.touches[0].pageX - parent.lowerCanvas.offsetLeft);
            y = e.touches[0].clientY || (e.touches[0].pageY - parent.lowerCanvas.offsetTop);
        }
        const bbox: DOMRect = parent.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        this.panDown = {x: x, y: y};
        const tempPanMoveObj: Object = {tempPanMove: null };
        parent.notify('transform', { prop: 'getTempPanMove', onPropertyChange: false,
            value: {obj: tempPanMoveObj }});
        if (isNullOrUndefined(tempPanMoveObj['tempPanMove'])) {
            parent.notify('transform', { prop: 'setTempPanMove', onPropertyChange: false,
                value: {point: {x: x, y: y} }});
        }
    }

    private canvasMouseMoveHandler(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        if (this.dragCanvas) {parent.lowerCanvas.style.cursor = 'grab'; }
        else {this.dragCanvas = parent.togglePan = false;
            parent.lowerCanvas.style.cursor = parent.upperCanvas.style.cursor = parent.cursor = 'default'; }
        let x: number; let y: number;
        if (e.type === 'mousemove') {
            x = e.offsetX;
            y = e.offsetY;
        } else {
            x = e.touches[0].clientX || (e.touches[0].pageX - parent.lowerCanvas.offsetLeft);
            y = e.touches[0].clientY || (e.touches[0].pageY - parent.lowerCanvas.offsetTop);
        }
        const bbox: DOMRect = parent.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        const panMove: Point = {x: x, y: y};
        parent.notify('transform', { prop: 'setPanMove', onPropertyChange: false,
            value: {point: {x: x, y: y} }});
        if (this.panDown && panMove && parent.togglePan && this.dragCanvas) {
            parent.notify('transform', { prop: 'drawPannedImage', onPropertyChange: false,
                value: {xDiff: null, yDiff: null}});
        }
    }

    private canvasMouseUpHandler(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        e.preventDefault();
        const panMoveObj: Object = {panMove: null };
        parent.notify('transform', { prop: 'getPanMove', onPropertyChange: false,
            value: {obj: panMoveObj }});
        if (parent.togglePan) {
            if (this.panDown && panMoveObj['panMove'] && parent.togglePan && this.dragCanvas) {
                this.panDown = null;
                parent.notify('transform', { prop: 'setPanMove', onPropertyChange: false,
                    value: {point: null }});
                parent.notify('transform', { prop: 'setTempPanMove', onPropertyChange: false,
                    value: {point: null }});
            }
        }
        if (this.currentDrawingShape !== 'path') {
            parent.currObjType.isDragging = false;
        }
    }

    private touchStartHandler(e: MouseEvent & TouchEvent): void {
        e.preventDefault();
        if (this.touchTime === 0) {
            this.touchTime = new Date().getTime();
        } else {
            if (((new Date().getTime()) - this.touchTime) < 400) {
                this.parent.notify('shape', { prop: 'stopPathDrawing', onPropertyChange: false, value: {e: e }});
                this.touchTime = 0;
            } else {
                this.touchTime = new Date().getTime();
            }
        }
        if (e.touches.length === 2) {
            this.isFirstMove = true;
        } else {
            this.mouseDownEventHandler(e);
        }
        EventHandler.add(this.parent.lowerCanvas, 'touchend', this.mouseUpEventHandler, this);
        EventHandler.add(this.parent.lowerCanvas, 'touchmove', this.mouseMoveEventHandler, this);
        EventHandler.add(this.parent.upperCanvas, 'touchend', this.mouseUpEventHandler, this);
        EventHandler.add(this.parent.upperCanvas, 'touchmove', this.mouseMoveEventHandler, this);
    }

    private unwireEvent(): void {
        EventHandler.remove(this.parent.lowerCanvas, 'touchend', this.mouseUpEventHandler);
        EventHandler.remove(this.parent.lowerCanvas, 'touchmove', this.mouseMoveEventHandler);
        EventHandler.remove(this.parent.upperCanvas, 'touchend', this.mouseUpEventHandler);
        EventHandler.remove(this.parent.upperCanvas, 'touchmove', this.mouseMoveEventHandler);
    }

    private keyDownEventHandler(e: KeyboardEvent): void {
        const parent: ImageEditor = this.parent;
        if (e.ctrlKey && (e.key === '+' || e.key === '-')) {
            e.preventDefault();
        }
        const obj: Object = { fileName: '', fileType: null };
        parent.notify('draw', { prop: 'getFileName', onPropertyChange: false, value: {obj: obj }});
        const beforeSave: BeforeSaveEventArgs = {fileName: obj['fileName'], fileType: obj['fileType'], cancel: false};
        let splitWords: string[];
        switch (e.key) {
        case (e.ctrlKey && 's'):
            if (isBlazor() && parent.events && parent.events.saving.hasDelegate === true) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                (parent.dotNetRef.invokeMethodAsync('BeforeSaveEventAsync', 'BeforeSave', beforeSave) as any).then((args: BeforeSaveEventArgs) => {
                    this.beforeSaveEvent(args, e);
                });
            } else {
                parent.trigger('beforeSave', beforeSave);
                this.beforeSaveEvent(beforeSave, e);
            }
            break;
        case (e.ctrlKey && 'z'):
            if (parent.allowUndoRedo) {
                parent.notify('undo-redo', {prop: 'call-undo'});
            }
            break;
        case (e.ctrlKey && 'y'):
            if (parent.allowUndoRedo) {
                parent.notify('undo-redo', {prop: 'call-redo'});
            }
            break;
        case (e.ctrlKey && '+'):
            if ((parent.zoomSettings.zoomTrigger & ZoomTrigger.Commands) === ZoomTrigger.Commands) {
                this.zoomType = 'Commands';
                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                    value: {zoomFactor: .1, zoomPoint: null}});
            }
            break;
        case (e.ctrlKey && '-'):
            if ((parent.zoomSettings.zoomTrigger & ZoomTrigger.Commands) === ZoomTrigger.Commands) {
                this.zoomType = 'Commands';
                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                    value: {zoomFactor: -.1, zoomPoint: null}});
            }
            break;
        case 'Delete':
            this.deleteItem();
            break;
        case 'Escape':
            parent.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null}});
            break;
        case 'Enter':
            if (parent.activeObj.shape) {splitWords = parent.activeObj.shape.split('-'); }
            if (this.isKeyBoardCrop(e) &&
                parent.activeObj.horTopLine && (parent.activeObj.shape && splitWords[0] === 'crop')) {
                parent.crop();
            }
            break;
        case 'Tab':
            this.performTabAction();
            break;
        default:
            if (Browser.isDevice && parent.textArea.style.display === 'block') {
                setTimeout(this.textKeyDown.bind(this), 1, e);
            }
            break;
        }
    }

    private isKeyBoardCrop(e: KeyboardEvent): boolean {
        let bool: boolean = false;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const target: any = e.target;
        if ((target.id === this.parent.element.id + '_ok' || target.id === '') && !isBlazor()) {
            bool = true;
        }
        return bool;
    }

    private beforeSaveEvent(observableSaveArgs: BeforeSaveEventArgs, e: KeyboardEvent): void {
        const parent: ImageEditor = this.parent;
        if (!observableSaveArgs.cancel) {
            parent.notify('export', { prop: 'export', onPropertyChange: false,
                value: {type: observableSaveArgs.fileType, fileName: observableSaveArgs.fileName}});
        }
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    private handleScroll(e: KeyboardEvent): void {
        const parent: ImageEditor = this.parent;
        let x: number; let y: number; let isInsideCanvas: boolean = false;
        if (e.type === 'mousewheel') {
            // eslint-disable-next-line
            x = (e as any).clientX; y = (e as any).clientY;
        }
        const bbox: DOMRect = parent.lowerCanvas.getBoundingClientRect() as DOMRect;
        x -= bbox.left; y -= bbox.top;
        if (x > parent.img.destLeft && x < parent.img.destLeft + parent.img.destWidth && y > parent.img.destTop &&
            y < parent.img.destTop + parent.img.destHeight) {
            isInsideCanvas = true;
        }
        e.stopPropagation();
        if (e.ctrlKey === true && isInsideCanvas) {
            e.preventDefault();
            if (!parent.isCropTab && (parent.activeObj.shape && parent.activeObj.shape.split('-')[0] !== 'crop')) {
                parent.okBtn();
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'close-contextual-toolbar', onPropertyChange: false});
                }
            }
            let type: string = '';
            if (e.type === 'mousewheel' && (parent.zoomSettings.zoomTrigger & ZoomTrigger.MouseWheel) === ZoomTrigger.MouseWheel) {
                this.zoomType = 'MouseWheel';
                // eslint-disable-next-line
                if ((e as any).wheelDelta > 0) {
                    type = 'zoomIn';
                } else {
                    type = 'zoomOut';
                }
            }
            if (type !== '') {
                parent.notify('draw', { prop: 'performPointZoom', onPropertyChange: false,
                    value: {x: x, y: y, type: type}});
            }
        }
    }

    private textKeyDown(e: KeyboardEvent): void {
        const parent: ImageEditor = this.parent;
        if (String.fromCharCode(e.which) === '\r') {
            this.textRow += 1;
        }
        parent.textArea.setAttribute('rows', this.textRow.toString());
        parent.textArea.style.height = 'auto';
        parent.textArea.style.height = parent.textArea.scrollHeight + 'px';
        parent.notify('shape', { prop: 'setTextBoxWidth', onPropertyChange: false, value: { e: e }});
        if (Browser.isDevice) {
            parent.textArea.style.width = parseFloat(parent.textArea.style.width) + parent.textArea.style.fontSize + 'px';
        }
        const rows: string[] = parent.textArea.value.split('\n');
        this.textRow = rows.length;
        parent.textArea.setAttribute('rows', this.textRow.toString());
        this.isInitialTextEdited = false;
    }

    private clearSelection(): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            parent.togglePen = false;
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.dragElement = '';
            this.dragPoint.startX = this.dragPoint.startY = this.dragPoint.endX = this.dragPoint.endY = 0;
            parent.currObjType.shape = '';
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            parent.currObjType.isActiveObj = true; parent.currObjType.isCustomCrop = false;
            parent.upperCanvas.style.cursor = parent.cursor = 'default';
        }
    }

    private setDragDirection(width: number, height: number): void {
        const arcRadius: number = (7.5); const parent: ImageEditor = this.parent;
        if (parent.img.destWidth > parent.img.destHeight) {
            parent.activeObj.activePoint.startX = this.dragPoint.startX = ((width / 2) - (height / 2))
                + arcRadius;
            parent.activeObj.activePoint.startY = this.dragPoint.startY = ((height / 2) - (height / 2))
                + arcRadius;
            parent.activeObj.activePoint.endX = ((width / 2) + (height / 2)) - arcRadius;
            parent.activeObj.activePoint.endY = ((height / 2) + (height / 2)) - arcRadius;
        }
        else {
            parent.activeObj.activePoint.startY = this.dragPoint.startX = ((height / 2) - (width) / 2)
                + arcRadius;
            parent.activeObj.activePoint.endY = ((height / 2) + (width) / 2) - arcRadius;
            parent.activeObj.activePoint.startX = this.dragPoint.startX = arcRadius;
            parent.activeObj.activePoint.endX = width - arcRadius;
        }
    }

    private calcShapeRatio(x: number, y: number, imgWidth: number, imgHeight: number): void {
        const parent: ImageEditor = this.parent;
        const arcRadius: number = (7.5);
        const originalWidth: number = imgWidth;
        const originalHeight: number = imgHeight;
        const presetRatio: number = x / y;
        const standardSize: number = originalWidth >= originalHeight ? originalWidth : originalHeight;
        let width: number = standardSize * presetRatio; let height: number = standardSize;
        const scaleWidth: number = this.getScale(width, originalWidth);
        const snippetArray: number[] = [];
        for (let i: number = 0; i < 2; i++) {
            if (i === 0) { snippetArray.push(width * scaleWidth); }
            else { snippetArray.push(height * scaleWidth); }
        }
        width = snippetArray[0]; height = snippetArray[1];
        const scaleHeight: number = this.getScale(height, originalHeight);
        const snippetArray1: number[] = [];
        for (let i: number = 0; i < 2; i++) {
            if (i === 0) { snippetArray1.push(width * scaleHeight); }
            else { snippetArray1.push(height * scaleHeight); }
        }
        width = snippetArray1[0]; height = snippetArray1[1];
        parent.activeObj.activePoint.width = width;
        parent.activeObj.activePoint.height = height;
        parent.activeObj.activePoint.startX = (this.dragPoint.startX = (originalWidth - width) / 2) + arcRadius;
        parent.activeObj.activePoint.startY = (this.dragPoint.startY = (originalHeight - height) / 2) + arcRadius;
        parent.activeObj.activePoint.endX = ((originalWidth - width) / 2 + width) - arcRadius;
        parent.activeObj.activePoint.endY = ((originalHeight - height) / 2 + height) - arcRadius;
        if (parent.activeObj.activePoint.startX < parent.img.destLeft && parent.img.destLeft + parent.img.destWidth >
            parent.lowerCanvas.clientWidth) {
            parent.activeObj.activePoint.startX = parent.img.destLeft;
            parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + width - arcRadius;
        }
        if (parent.activeObj.activePoint.startY < parent.img.destTop && parent.img.destTop + parent.img.destHeight >
            parent.lowerCanvas.clientHeight) {
            parent.activeObj.activePoint.startY = parent.img.destTop;
            parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY + height - arcRadius;
        }
        parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
        parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
    }

    private getScale(value: number, originalValue: number): number {
        return value > originalValue ? originalValue / value : 1;
    }


    private findTarget(x: number, y: number, type: string): void {
        const parent: ImageEditor = this.parent;
        if (type.toLowerCase() === 'mousedown' || type.toLowerCase() === 'touchstart') {
            let splitWords: string[]; let isCrop: boolean = false;
            if (parent.activeObj.shape) {
                splitWords = parent.activeObj.shape.split('-');
                if (splitWords[0] === 'crop') {isCrop = true; }
            }
            this.findTargetObj(x, y, isCrop);
            this.updateCursorStyles(x, y, type);
        } else {
            switch ( this.dragElement.toLowerCase()) {
            case 'nw-resize':
                parent.activeObj.topLeftCircle.startX = x; parent.activeObj.topLeftCircle.startY = y;
                break;
            case 'n-resize':
                parent.activeObj.topCenterCircle.startX = x; parent.activeObj.topCenterCircle.startY = y;
                break;
            case 'ne-resize':
                parent.activeObj.topRightCircle.startX = x; parent.activeObj.topRightCircle.startY = y;
                break;
            case 'w-resize':
                parent.activeObj.centerLeftCircle.startX = x; parent.activeObj.centerLeftCircle.startY = y;
                break;
            case 'e-resize':
                parent.activeObj.centerRightCircle.startX = x; parent.activeObj.centerRightCircle.startY = y;
                break;
            case 'sw-resize':
                parent.activeObj.bottomLeftCircle.startX = x; parent.activeObj.bottomLeftCircle.startY = y;
                break;
            case 's-resize':
                parent.activeObj.bottomCenterCircle.startX = x; parent.activeObj.bottomCenterCircle.startY = y;
                break;
            case 'se-resize':
                parent.activeObj.bottomRightCircle.startX = x; parent.activeObj.bottomRightCircle.startY = y;
                break;
            default:
                if (this.dragPoint.startX && this.dragPoint.startY) {
                    this.previousPoint.x = this.dragPoint.endX; this.previousPoint.y = this.dragPoint.endY;
                    this.dragPoint.endX = x; this.dragPoint.endY = y;
                }
                break;
            }
        }
    }

    private findTargetObj(x: number, y: number, isCrop: boolean): boolean {
        const parent: ImageEditor = this.parent;
        let isShape: boolean = false;
        if (parent.objColl.length !== 0 && !parent.currObjType.isCustomCrop && !isCrop) {
            let diffX: number = 0; let i: number;
            for (let index: number = 0; index < parent.objColl.length; index++ ) {
                const cursor: string = parent.upperCanvas.style.cursor;
                this.setCursor(x, y);
                const actObj: SelectionPoint = extend({}, parent.objColl[index as number], {}, true) as SelectionPoint;
                if (actObj.shape === 'line' || actObj.shape === 'arrow') {
                    for (let j: number = 0; j < actObj.pointColl.length; j++) {
                        if (x >= actObj.pointColl[j as number].x - (actObj.topLeftCircle.radius * 2) &&
                            x <= actObj.pointColl[j as number].x + (actObj.topLeftCircle.radius * 2) &&
                            y >= actObj.pointColl[j as number].y - (actObj.topLeftCircle.radius * 2) &&
                            y <= actObj.pointColl[j as number].y + (actObj.topLeftCircle.radius * 2)) {
                            if (this.isTouch || parent.cursor === 'move' ||
                                parent.cursor === 'grab' || this.isShapeInserted) {
                                if (diffX === 0 || diffX > x - actObj.activePoint.startX) {
                                    diffX = x - parent.objColl[index as number].activePoint.startX;
                                    i = index;
                                }
                            } else if (parent.objColl[index as number].currIndex === this.tempActiveObj.currIndex) {
                                i = index;
                            }
                            break;
                        }
                    }
                } else if (actObj.shape === 'path') {
                    const cursor: string = this.setCursorForPath(actObj, x, y, parent.upperCanvas);
                    if (cursor !== 'default' && cursor !== 'grab') {
                        if (this.isTouch || parent.cursor === 'move' || parent.cursor === 'grab' || this.isShapeInserted) {
                            if (diffX === 0 || diffX > x - actObj.activePoint.startX) {
                                diffX = x - parent.objColl[index as number].activePoint.startX;
                                i = index;
                            }
                        } else if (parent.objColl[index as number].currIndex === this.tempActiveObj.currIndex) {
                            i = index;
                        }
                    }
                } else if (actObj.rotatedAngle !== 0) {
                    const cursor: string = this.setCursorForRotatedObject(actObj, x, y, parent.upperCanvas);
                    if (cursor !== 'default' && cursor !== 'grab') {
                        if (this.isTouch || parent.cursor === 'move' || parent.cursor === 'grab' || this.isShapeInserted) {
                            if (diffX === 0 || diffX > x - actObj.activePoint.startX) {
                                diffX = x - parent.objColl[index as number].activePoint.startX;
                                i = index;
                            }
                        } else if (parent.objColl[index as number].currIndex === this.tempActiveObj.currIndex) {
                            i = index;
                        }
                    }
                } else {
                    const rotationCirclePoint: Point = this.getTransRotationPoint(actObj);
                    if ((x >= (actObj.activePoint.startX - (actObj.topLeftCircle.radius * 2)) &&
                        x <= (actObj.activePoint.endX + (actObj.topLeftCircle.radius * 2)) &&
                        y >= (actObj.activePoint.startY - (actObj.topLeftCircle.radius * 2)) &&
                        y <= (actObj.activePoint.endY + (actObj.topLeftCircle.radius * 2))) ||
                        (rotationCirclePoint &&
                        x >= (rotationCirclePoint.x - (actObj.topLeftCircle.radius * 2)) &&
                        x <= (rotationCirclePoint.x + (actObj.topLeftCircle.radius * 2)) &&
                        y >= (rotationCirclePoint.y - (actObj.topLeftCircle.radius * 2)) &&
                        y <= (rotationCirclePoint.y + (actObj.topLeftCircle.radius * 2)))) {
                        if (this.isTouch || cursor === 'move' || cursor === 'grabbing' || this.isShapeInserted
                            || parent.cursor === 'move' || parent.cursor === 'grabbing') {
                            if (diffX === 0 || diffX > x - actObj.activePoint.startX) {
                                diffX = x - parent.objColl[index as number].activePoint.startX;
                                i = index;
                            }
                        } else if (parent.objColl[index as number].currIndex === this.tempActiveObj.currIndex) {
                            i = index;
                        }
                    }
                }
            }
            if (isNullOrUndefined(i)) {
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                isShape = false;
            } else {
                this.tempObjColl = extend([], parent.objColl, [], true) as SelectionPoint[];
                parent.currObjType.isCustomCrop = false;
                parent.activeObj = extend({}, parent.objColl[i as number], {}, true) as SelectionPoint;
                const temp: SelectionPoint = extend({}, parent.objColl[i as number], {}, true) as SelectionPoint;
                parent.objColl.splice(i, 1);
                if (parent.transform.degree === 0) {
                    const temp: string = this.lowerContext.filter;
                    this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
                    parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
                    this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                                                parent.img.srcHeight, parent.img.destLeft, parent.img.destTop, parent.img.destWidth,
                                                parent.img.destHeight);
                    this.lowerContext.filter = 'none';
                    parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
                    parent.activeObj = extend({}, temp, {}, true) as SelectionPoint;
                    parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                        value: {context: this.lowerContext, points: null} });
                    this.lowerContext.filter = temp;
                    this.getCurrentFlipState();
                } else {
                    parent.notify('draw', { prop: 'callUpdateCurrTransState', onPropertyChange: false});
                    parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                        value: {context: this.lowerContext, points: null} });
                }
                parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
                if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
                    parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                        value: {context: this.lowerContext, isSave: null, isFlip: null}});
                }
                this.setActivePoint();
                parent.activeObj = extend({}, temp, {}, true) as SelectionPoint;
                const tempStrokeSettings: StrokeSettings = extend({}, parent.activeObj.strokeSettings, {}, true) as StrokeSettings;
                parent.notify('draw', { prop: 'setTempStrokeSettings', onPropertyChange: false,
                    value: {tempStrokeSettings: tempStrokeSettings }});
                const tempTextSettings: TextSettings = extend({}, parent.activeObj.textSettings, {}, true) as TextSettings;
                parent.notify('draw', { prop: 'setTempTextSettings', onPropertyChange: false, value: {tempTextSettings: tempTextSettings}});
                const shapeSettings: ShapeSettings = this.updatePrevShapeSettings();
                const shapeChangingArgs: ShapeChangeEventArgs = {action: 'select', previousShapeSettings: shapeSettings,
                    currentShapeSettings: shapeSettings};
                if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow') {
                    shapeChangingArgs.currentShapeSettings.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
                    shapeChangingArgs.currentShapeSettings.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
                }
                this.isCropSelection = false; let splitWords: string[];
                if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
                if (splitWords !== undefined && splitWords[0] === 'crop'){
                    this.isCropSelection = true;
                }
                if (!this.isCropSelection && isBlazor() && isNullOrUndefined(this.parent.eventType) &&
                    parent.events && parent.events.shapeChanging.hasDelegate === true) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    (parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShape',  shapeChangingArgs) as any).then((shapeChangingArgs: ShapeChangeEventArgs) => {
                        this.shapeEvent(shapeChangingArgs);
                    });
                } else if (!this.isCropSelection) {
                    parent.trigger('shapeChanging', shapeChangingArgs);
                    this.shapeEvent(shapeChangingArgs);
                } else {
                    const selectionChangingArgs: SelectionChangeEventArgs = {action: shapeChangingArgs.action,
                        previousSelectionSettings: {type: parent.getSelectionType(parent.activeObj.shape),
                            startX: shapeChangingArgs.previousShapeSettings.startX,
                            startY: shapeChangingArgs.previousShapeSettings.startY,
                            width: shapeChangingArgs.previousShapeSettings.width,
                            height: shapeChangingArgs.previousShapeSettings.height},
                        currentSelectionSettings: {type: parent.getSelectionType(parent.activeObj.shape),
                            startX: shapeChangingArgs.currentShapeSettings.startX,
                            startY: shapeChangingArgs.currentShapeSettings.startY,
                            width: shapeChangingArgs.currentShapeSettings.width,
                            height: shapeChangingArgs.currentShapeSettings.height}};
                    if (isBlazor() && parent.events && parent.events.onSelectionResizeStart.hasDelegate === true) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (parent.dotNetRef.invokeMethodAsync('SelectionEventAsync', 'OnSelectionResizeStart', selectionChangingArgs) as any).then((selectionChangingArgs: SelectionChangeEventArgs) => {
                            shapeChangingArgs.currentShapeSettings.startX = selectionChangingArgs.currentSelectionSettings.startX;
                            shapeChangingArgs.currentShapeSettings.startY = selectionChangingArgs.currentSelectionSettings.startY;
                            shapeChangingArgs.currentShapeSettings.width = selectionChangingArgs.currentSelectionSettings.width;
                            shapeChangingArgs.currentShapeSettings.height = selectionChangingArgs.currentSelectionSettings.height;
                            this.shapeEvent(shapeChangingArgs);
                        });
                    } else {
                        parent.trigger('selectionChanging', selectionChangingArgs);
                        shapeChangingArgs.currentShapeSettings.startX = selectionChangingArgs.currentSelectionSettings.startX;
                        shapeChangingArgs.currentShapeSettings.startY = selectionChangingArgs.currentSelectionSettings.startY;
                        shapeChangingArgs.currentShapeSettings.width = selectionChangingArgs.currentSelectionSettings.width;
                        shapeChangingArgs.currentShapeSettings.height = selectionChangingArgs.currentSelectionSettings.height;
                        this.shapeEvent(shapeChangingArgs);
                    }
                }
                isShape = true;
            }
        }
        return isShape;
    }

    private shapeEvent(shapeChangingArgs: ShapeChangeEventArgs): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', { prop: 'updateShapeChangeEventArgs', onPropertyChange: false,
            value: {shapeSettings: shapeChangingArgs.currentShapeSettings}});
        if (parent.activeObj.activePoint) {
            const obj: Object = {prevActObj: null };
            parent.notify('draw', { prop: 'getPrevActObj', onPropertyChange: false, value: {obj: obj }});
            if (isNullOrUndefined(obj['prevActObj'])) {
                parent.notify('draw', { prop: 'setPrevActObj', onPropertyChange: false,
                    value: { prevActObj: extend({}, parent.activeObj, {}, true) }});
            }
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj, isCropRatio: null,
                points: null, isPreventDrag: true, saveContext: null, isPreventSelection: true} });
            if (!this.isShapeInserted) {
                if (parent.activeObj.activePoint.startX < parent.img.destLeft) {this.isPreventDragging = true; }
                else if (parent.activeObj.activePoint.endX > parent.img.destLeft + parent.img.destWidth) {this.isPreventDragging = true; }
                else if (parent.activeObj.activePoint.startY < parent.img.destTop) {this.isPreventDragging = true; }
                else if (parent.activeObj.activePoint.endY > parent.img.destTop + parent.img.destHeight) {this.isPreventDragging = true; }
            }
        }
    }

    // eslint-disable-next-line
    private targetTouches(touches: any): Point[] {
        const bbox: DOMRect = this.parent.lowerCanvas.getBoundingClientRect() as DOMRect;
        const p1: Point = {x: touches[0].pageX - bbox.left, y: touches[0].pageY - bbox.top};
        const p2: Point = {x: touches[1].pageX - bbox.left, y: touches[1].pageY - bbox.top};
        const points: Point[] = [p1, p2];
        return points;
    }

    private calculateScale(startTouches: Point[], endTouches: Point[]): number {
        const startDistance: number = this.getDistance(startTouches[0], startTouches[1]);
        const endDistance: number = this.getDistance(endTouches[0], endTouches[1]);
        return endDistance / startDistance;
    }

    private getDistance(a: Point, b: Point): number {
        let x: number = 0; let y: number = 0;
        if (a && b) {
            x = a.x - b.x;
            y = a.y - b.y;
        }
        return Math.sqrt(x * x + y * y);
    }

    private redrawShape(obj: SelectionPoint, isMouseUp?: boolean): void {
        const parent: ImageEditor = this.parent;
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            if (JSON.stringify(obj) === JSON.stringify(parent.objColl[i as number])) {
                parent.objColl.splice(i, 1);
                break;
            }
        }
        this.upperContext.clearRect(0, 0 , parent.upperCanvas.width, parent.upperCanvas.height);
        if (this.isPreventDragging) {
            if (parent.activeObj.activePoint.startX > parent.img.destLeft) {this.isPreventDragging = false; }
            if (isMouseUp && parent.activeObj.rotatedAngle !== 0) {
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: null, isCropRatio: null,
                    points: null, isPreventDrag: true, saveContext: null, isPreventSelection: null }});
            } else {
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: null, isCropRatio: null,
                    points: null, isPreventDrag: true, saveContext: null, isPreventSelection: null} });
            }
        }
        else {
            if (isMouseUp && parent.activeObj.rotatedAngle !== 0) {
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: null, isCropRatio: null,
                    points: null, isPreventDrag: true, saveContext: null, isPreventSelection: null }});
            } else {
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: null, isCropRatio: null,
                    points: null, isPreventDrag: true, saveContext: null, isPreventSelection: null} });
            }
        }
    }

    private setTimer(e: MouseEvent & TouchEvent): void {
        if (this.timer > 10) {
            clearTimeout(this.timer); this.timer = 0;
            this.parent.notify('shape', { prop: 'findTextTarget', onPropertyChange: false, value: {e: e}});
            if (Browser.isDevice) {
                this.upperContext.clearRect(0, 0, this.parent.upperCanvas.width, this.parent.upperCanvas.height);
            }
        }
    }

    private applyCurrActObj(x: number, y: number): void {
        const parent: ImageEditor = this.parent;
        let isInside: boolean = false;
        const actObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        if (isNullOrUndefined(actObj.activePoint)) {
            return;
        }
        const radius: number = actObj.topLeftCircle ? actObj.topLeftCircle.radius : 0;
        if ((x >= Math.floor(actObj.activePoint.startX) &&
            x <= Math.ceil(actObj.activePoint.endX) &&
            y >= Math.floor(actObj.activePoint.startY) &&
            y <= Math.ceil(actObj.activePoint.endY))) {
            isInside = true;
        } else if (radius !== 0 && (x >= Math.floor(actObj.activePoint.startX) - radius &&
            x <= Math.ceil(actObj.activePoint.endX) + radius &&
            y >= Math.floor(actObj.activePoint.startY) - radius &&
            y <= Math.ceil(actObj.activePoint.endY) + radius)) {
            isInside = true;
            this.tempActiveObj = { activePoint: { startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0 },
                flipObjColl: [], triangle: [], triangleRatio: [] } as SelectionPoint;
        } else if (actObj.shape === 'text' && this.dragElement !== '') {
            isInside = true;
        } else if (actObj.shape === 'line' || actObj.shape === 'arrow') {
            const smallPoint: Point = {x: actObj.activePoint.startX < actObj.activePoint.endX ? actObj.activePoint.startX :
                actObj.activePoint.endX,
            y: actObj.activePoint.startY < actObj.activePoint.endY ? actObj.activePoint.startY : actObj.activePoint.endY};
            const largePoint: Point = {x: actObj.activePoint.startX > actObj.activePoint.endX ? actObj.activePoint.startX :
                actObj.activePoint.endX,
            y: actObj.activePoint.startY > actObj.activePoint.endY ? actObj.activePoint.startY : actObj.activePoint.endY};
            if (x >= (Math.floor(smallPoint.x) - 5) && x <= (Math.ceil(largePoint.x) + 5) &&
                y >= (Math.floor(smallPoint.y) - 5) && y <= (Math.ceil(largePoint.y) + 5)) {
                isInside = true;
            }
        } else if (actObj.shape === 'path') {
            const cursor: string = this.setCursorForPath(actObj, x, y, parent.upperCanvas);
            if (cursor === 'move') {
                isInside = true;
            }
        } else if (this.dragElement === 'grabbing') {
            isInside = true;
        } else if (actObj.rotatedAngle !== 0) {
            const cursor: string = this.setCursorForRotatedObject(actObj, x, y, parent.upperCanvas);
            if ((cursor !== 'default' && cursor !== 'grab') || this.dragElement === 'n-resize' || this.dragElement === 'e-resize' ||
                this.dragElement === 's-resize' || this.dragElement === 'w-resize') {
                isInside = true;
            }
        }
        if (!isInside) {
            if (isNullOrUndefined(parent.activeObj.currIndex)) {
                parent.activeObj.currIndex = 'shape_' + (parent.objColl.length + 1);
            }
            parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
            if (parent.activeObj.horTopLine !== undefined && parent.activeObj.horTopLine.startX !== 0 && parent.activeObj.horTopLine.endX
                !== 0 && !parent.currObjType.isCustomCrop && parent.currObjType.shape !== '') {
                parent.objColl.push(extend({}, parent.activeObj, {}, true) as SelectionPoint);
            }
            if (parent.activeObj.shape === 'text' || (parent.currObjType.shape === 'ellipse' || parent.currObjType.shape === 'rectangle' ||
               parent.currObjType.shape === 'line' || parent.activeObj.shape === 'arrow' || parent.activeObj.shape === 'path')) {
                const tempFilter: string = this.lowerContext.filter;
                this.lowerContext.filter = 'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
                    'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' +
                    'invert(0%)';
                for (let i: number = 0; i < parent.objColl.length; i++) {
                    const obj: Object = {isInside: false };
                    parent.notify('crop', { prop: 'isObjInImage', onPropertyChange: false,
                        value: {obj: parent.objColl[i as number], object: obj }});
                    if (obj['isInside']) {
                        parent.notify('shape', { prop: 'apply', onPropertyChange: false,
                            value: {shape: parent.objColl[i as number].shape, obj: parent.objColl[i as number], canvas: null}});
                        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                    }
                }
                parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
                this.lowerContext.filter = tempFilter;
                if (parent.activeObj.shape) {
                    parent.notify('shape', { prop: 'apply', onPropertyChange: false,
                        value: {shape: null, obj: null, canvas: null}});
                }
                parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
                parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
                if (parent.isCircleCrop) {
                    parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                        value: {context: this.lowerContext, isSave: null, isFlip: null}});
                }
            }
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
            }
        }
    }

    private getCurrentFlipState(): void {
        const parent: ImageEditor = this.parent;
        if (parent.rotateFlipColl.length !== 0) {
            const totalPannedInternalPoint: Point = extend({}, parent.panPoint.totalPannedInternalPoint, {}, true) as Point;
            parent.notify('draw', { prop: 'callUpdateCurrTransState', onPropertyChange: false});
            parent.panPoint.totalPannedInternalPoint = totalPannedInternalPoint;
        } else {
            parent.notify('draw', { prop: 'callUpdateCurrTransState', onPropertyChange: false});
        }
    }

    private setTextBoxStylesToActObj(): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.textSettings.fontFamily = parent.textArea.style.fontFamily;
        parent.activeObj.strokeSettings.strokeColor = parent.textArea.style.color !== '' &&
            parent.textArea.style.color.split('(')[1] && parent.textArea.style.color.split('(')[1].split(',')[0] &&
            parent.textArea.style.color.split('(')[1].split(',')[1] && parent.textArea.style.color.split('(')[1].split(',')[2] ?
            this.rgbToHex(parseFloat(parent.textArea.style.color.split('(')[1].split(',')[0]),
                          parseFloat(parent.textArea.style.color.split('(')[1].split(',')[1]),
                          parseFloat(parent.textArea.style.color.split('(')[1].split(',')[2])) :
            parent.textArea.style.color;
        if (parent.textArea.style.fontWeight === 'bold') {
            parent.activeObj.textSettings.bold = true;
        } else {
            parent.activeObj.textSettings.bold = false;
        }
        if (parent.textArea.style.fontStyle === 'italic') {
            parent.activeObj.textSettings.italic = true;
        } else {
            parent.activeObj.textSettings.italic = false;
        }
        parent.activeObj.textSettings.fontSize = (parseFloat(parent.textArea.style.fontSize));
    }

    private rgbToHex(r: number, g: number, b: number): string {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    private componentToHex(rgb: number): string {
        const hex: string = rgb.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    private deleteItem(): void {
        const parent: ImageEditor = this.parent;
        let shapeChangingArgs: ShapeChangeEventArgs = {};
        let previousShapeSettings: ShapeSettings = {} as ShapeSettings;
        if (this.isFhdEditing) {
            this.updateFreehandDrawColorChange();
            const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
            const object: Object = {currObj: {} as CurrentObject };
            parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
            const prevObj: CurrentObject = object['currObj'];
            prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
            prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
            prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
            const selPointCollObj: Object = {selPointColl: null };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                value: {obj: selPointCollObj }});
            prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
            const obj: Object = {freehandDrawSelectedId: null };
            parent.notify('freehand-draw', { prop: 'getFreehandDrawSelectedId', onPropertyChange: false, value: {obj: obj }});
            parent.notify('freehand-draw', {prop: 'deleteFhd', value: { id: obj['freehandDrawSelectedId'] }});
            parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'deleteFreehandDrawing', previousObj: prevObj, previousObjColl: this.tempObjColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
            parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
            parent.notify('freehand-draw', {prop: 'resetFreehandDrawSelectedId' });
        } else if (parent.textArea.style.display === 'none') {
            const obj: Object = {prevActObj: null };
            parent.notify('draw', { prop: 'getPrevActObj', onPropertyChange: false, value: {obj: obj }});
            if (obj['prevActObj']) {
                obj['prevActObj']['activePoint']['width'] = Math.abs(obj['prevActObj']['activePoint']['width']);
                obj['prevActObj']['activePoint']['height'] = Math.abs(obj['prevActObj']['activePoint']['height']);
            }
            if (obj['prevActObj'] && JSON.stringify(obj['prevActObj']) !== JSON.stringify(parent.activeObj)) {
                const index: string = parent.activeObj.currIndex;
                parent.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null}});
                for (let i: number = 0; i < parent.objColl.length; i++) {
                    if (parent.objColl[i as number].currIndex === index) {
                        parent.objColl.splice(i, 1);
                        parent.notify('draw', {prop: 'render-image', value: {isMouseWheel: null}});
                        break;
                    }
                }
            }
            const object: Object = {isNewPath: null };
            parent.notify('draw', {prop: 'getNewPath', value: {obj: object}});
            if (object['isNewPath']) {
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                parent.notify('draw', {prop: 'render-image', value: {isMouseWheel: null}});
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
                } else {
                    parent.updateToolbar(parent.element, 'imageLoaded');
                }
            } else if (parent.activeObj.shape) {
                parent.objColl.push(parent.activeObj);
                const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                const prevObj: CurrentObject = object['currObj'];
                prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
                prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
                prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
                const selPointCollObj: Object = {selPointColl: null };
                parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                    value: {obj: selPointCollObj }});
                prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
                parent.objColl.pop();
                previousShapeSettings = this.updatePrevShapeSettings();
                shapeChangingArgs = {action: 'delete', previousShapeSettings: previousShapeSettings, currentShapeSettings: null};
                parent.notify('shape', { prop: 'setKeyHistory', onPropertyChange: false, value: {keyHistory: '' }});
                parent.clearSelection();
                if (isBlazor() && parent.events && parent.events.shapeChanging.hasDelegate === true) {
                    parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShape', shapeChangingArgs);
                } else {
                    parent.trigger('shapeChanging', shapeChangingArgs);
                    if (!isBlazor()) {
                        parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
                    }
                }
                if (!isNullOrUndefined(prevObj.objColl[prevObj.objColl.length - 1].currIndex)) {
                    parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                        value: {operation: 'deleteObj', previousObj: prevObj, previousObjColl: this.tempObjColl,
                            previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                            previousCropObj: prevCropObj, previousText: null,
                            currentText: null, previousFilter: null, isCircleCrop: null}});
                    parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
                }
            }
            parent.notify('draw', { prop: 'setPrevActObj', onPropertyChange: false, value: { prevActObj: null }});
        }
        if (document.getElementById(parent.element.id + '_quickAccessToolbarArea')) {
            document.getElementById(parent.element.id + '_quickAccessToolbarArea').style.display = 'none';
        }
    }

    private updateFreehandDrawColorChange(): void {
        const parent: ImageEditor = this.parent;
        const indexObj: Object = {freehandSelectedIndex: null };
        parent.notify('freehand-draw', {prop: 'getFreehandSelectedIndex', onPropertyChange: false, value: {obj: indexObj }});
        if (!isNullOrUndefined(indexObj['freehandSelectedIndex']) && !isNullOrUndefined(parent.pointColl[indexObj['freehandSelectedIndex']])
            && parent.pointColl[indexObj['freehandSelectedIndex']].strokeColor === '#42a5f5') {
            const obj: Object = {tempFreeHandDrawEditingStyles: null };
            parent.notify('freehand-draw', {prop: 'getTempFreeHandDrawEditingStyles', value: {obj: obj }});
            parent.pointColl[indexObj['freehandSelectedIndex']].strokeColor = obj['tempFreeHandDrawEditingStyles'].strokeColor;
        }
    }

    private updatePrevShapeSettings(obj?: Object): ShapeSettings {
        const parent: ImageEditor = this.parent;
        const fontStyle: string[] = [];
        if (parent.activeObj.shape === 'text' && parent.activeObj.textSettings) {
            if (parent.activeObj.textSettings.bold) {
                fontStyle.push('bold');
            }
            if (parent.activeObj.textSettings.italic) {
                fontStyle.push('italic');
            }
            if (parent.activeObj.textSettings.underline) {
                fontStyle.push('underline');
            }
        }
        const shapeSettingsObj: ShapeSettings = {
            id: !isNullOrUndefined(parent.activeObj.currIndex) ? parent.activeObj.currIndex : null,
            type: parent.toPascalCase(parent.activeObj.shape) as ShapeType,
            startX: parent.activeObj.activePoint.startX, startY: parent.activeObj.activePoint.startY,
            width: parent.activeObj.activePoint.width, height: parent.activeObj.activePoint.height,
            strokeColor: parent.activeObj.strokeSettings ? parent.activeObj.strokeSettings.strokeColor : null,
            strokeWidth: parent.activeObj.strokeSettings ? parent.activeObj.strokeSettings.strokeWidth : null,
            fillColor: parent.activeObj.strokeSettings ? parent.activeObj.strokeSettings.fillColor : null,
            radius: parent.activeObj.shape === 'ellipse' ? parent.activeObj.activePoint.width / 2 : null,
            length: parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow' ? parent.activeObj.activePoint.width : null,
            text: parent.activeObj.shape === 'text' ? (parent.activeObj.keyHistory ? parent.activeObj.keyHistory :
                (parent.activeObj.textSettings.text ? parent.activeObj.textSettings.text : null)) : null,
            fontSize: parent.activeObj.shape === 'text' ? (parent.activeObj.textSettings ? parent.activeObj.textSettings.fontSize : null) : null,
            fontFamily: parent.activeObj.shape === 'text' ? (parent.activeObj.textSettings ? parent.activeObj.textSettings.fontFamily : null) : null,
            fontStyle: parent.activeObj.shape === 'text' ? fontStyle : null,
            color: parent.activeObj.shape === 'text' ? (parent.activeObj.strokeSettings ? parent.activeObj.strokeSettings.strokeColor : null) : null
        };
        if (obj) { obj['shapeSettingsObj'] = shapeSettingsObj; }
        return shapeSettingsObj;
    }

    private getRectanglePoints(rectX: number, rectY: number, rectWidth: number, rectHeight: number, rectAngle: number,
                               pointX: number, pointY: number): boolean {
        const centerX: number = rectX + rectWidth / 2;
        const centerY: number = rectY + rectHeight / 2;
        const angleRad: number = rectAngle * (Math.PI / 180);
        const cosAngle: number = Math.cos(angleRad);
        const sinAngle: number = Math.sin(angleRad);
        const localX: number = pointX - centerX;
        const localY: number = pointY - centerY;
        const rotatedX: number = localX * cosAngle + localY * sinAngle;
        const rotatedY: number = -localX * sinAngle + localY * cosAngle;
        const halfWidth: number = rectWidth / 2;
        const halfHeight: number = rectHeight / 2;
        // Check if the rotated point is within the bounds of the rectangle
        if (rotatedX >= -halfWidth && rotatedX <= halfWidth && rotatedY >= -halfHeight &&
            rotatedY <= halfHeight) {
            return true; // Point is inside the rotated rectangle
        } else {
            return false; // Point is outside the rotated rectangle
        }
    }

    private getTransRotationPoint(obj: SelectionPoint, object?: Object): Point {
        let rotationCirclePoint: Point; let degree: number; let isHorizontalflip: boolean = false; let isVerticalflip: boolean = false;
        if (obj.shapeDegree === 0) {
            degree = this.parent.transform.degree;
        }
        else {
            degree = this.parent.transform.degree - obj.shapeDegree;
        }
        if (degree < 0) {
            degree = 360 + degree;
        }
        if (obj.flipObjColl) {
            for (let i: number = 0; i < obj.flipObjColl.length; i++) {
                if (obj.flipObjColl[i as number].toLowerCase() === 'horizontal') {
                    isHorizontalflip = true;
                } else if (obj.flipObjColl[i as number].toLowerCase() === 'vertical') {
                    isVerticalflip = true;
                }
            }
        }
        if (degree === 0 || degree === 360) {
            if (isVerticalflip) {
                rotationCirclePoint = {x: obj.topCenterCircle.startX,
                    y: obj.topCenterCircle.startY - obj.rotationCircleLine};
            } else {
                rotationCirclePoint = {x: obj.bottomCenterCircle.startX,
                    y: obj.bottomCenterCircle.startY + obj.rotationCircleLine};
            }
        } else if (degree === 90 || degree === -270) {
            if (isHorizontalflip) {
                rotationCirclePoint = {x: obj.centerRightCircle.startX +
                    obj.rotationCircleLine, y: obj.centerLeftCircle.startY};
            } else {
                rotationCirclePoint = {x: obj.centerLeftCircle.startX -
                    obj.rotationCircleLine, y: obj.centerLeftCircle.startY};
            }
        } else if (degree === 180 || degree === -180) {
            if (isVerticalflip) {
                rotationCirclePoint = {x: obj.bottomCenterCircle.startX,
                    y: obj.bottomCenterCircle.startY + obj.rotationCircleLine};
            } else {
                rotationCirclePoint = {x: obj.topCenterCircle.startX,
                    y: obj.topCenterCircle.startY - obj.rotationCircleLine};
            }
        } else if (degree === 270 || degree === -90) {
            if (isHorizontalflip) {
                rotationCirclePoint = {x: obj.centerLeftCircle.startX -
                    obj.rotationCircleLine, y: obj.centerLeftCircle.startY};
            } else {
                rotationCirclePoint = {x: obj.centerRightCircle.startX +
                    obj.rotationCircleLine, y: obj.centerLeftCircle.startY};
            }
        }
        if (object) { object['rotationCirclePoint'] = rotationCirclePoint; }
        return rotationCirclePoint;
    }
}
