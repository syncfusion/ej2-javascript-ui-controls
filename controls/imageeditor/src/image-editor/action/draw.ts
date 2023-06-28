import { extend, isNullOrUndefined, Browser, isBlazor, getComponent } from '@syncfusion/ej2-base';
import { ActivePoint, Dimension } from '@syncfusion/ej2-inputs';
import { ImageEditor, Point, SelectionPoint, OpenEventArgs, Direction, CurrentObject, ShapeSettings, FileType, StrokeSettings, Transition, TextSettings, CropSelectionSettings, SelectionChangeEventArgs } from '../index';
import { Dialog, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
export class Draw {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private cancelObjColl: SelectionPoint[] = [];
    private cancelPointColl: Point[] = [];
    private isInitialLoading: boolean = false; // Specifies whether image is loaded for the first time or not (for applying initial filter)
    private fileName: string = '';
    private fileType: FileType;
    private isErrorImage: boolean = false;
    private initZoomValue: number;
    private isShapeTextInserted: boolean = false;
    private currSelPoint: SelectionPoint; // To store current crop selection point (while changing crop selection dynamically)
    private isRotateZoom: boolean = false; // To restore zoomed image on selection crop selection
    private tempStrokeSettings: StrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null}; // restore stroke settings on cancel
    private tempTextSettings: TextSettings =
    {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false}; // restore text settings on cancel
    private tempAdjValue: string = ''; // for temp internal slider value
    private tempFilter: string = ''; // restore filter style on cancel
    private tempUndoRedoStep: number = 0;
    private tempFreehandCounter: number = 0;
    private tempCurrFhdIndex: number = 0;
    private tempZoomFactor: number = null; // Restore zoom factor on cancel
    private isCancelAction: boolean = false;
    private rotatedFlipCropSel: boolean = false;
    private prevActObj: SelectionPoint;
    private dx: number;
    private dy: number;
    private startCircleIntersectX1: number;
    private startCircleIntersectY1: number;
    private endCircleIntersectX1: number;
    private endCircleIntersectY1: number;
    private squareEndIntersectX1: number;
    private squareEndIntersectY1: number;
    private squareStartIntersectX1: number;
    private squareStartIntersectY1: number;
    private zoomCrop: Dimension = {width: 0, height: 0};
    private baseImgSrc: string; // To restore old image source while opening wrong url
    private isImageEdited: boolean = false;
    private openURL: string | ImageData | URL;
    private inputElem: HTMLInputElement;
    private isFileChanged: boolean = false;
    private isNewPath: boolean = false;
    private arrowDimension: Object = {bar: {width: 10, height: 32, ratioX: null, ratioY: null},
        arrow: {width: 24, height: 24, ratioX: null, ratioY: null}, arrowSolid: {width: 32, height: 32, ratioX: null, ratioY: null},
        circle: {width: 10, height: 10, ratioX: null, ratioY: null}, square: {width: 20, height: 20, ratioX: null, ratioY: null }};

    constructor(parent: ImageEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on('draw', this.draw, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('draw', this.draw);
        this.parent.off('destroyed', this.destroy);
    }

    private draw(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        this.updatePrivateVariables();
        switch (args.prop) {
        case 'drawObject':
            this.drawObject(args.value['canvas'], args.value['obj'], args.value['isCropRatio'],
                            args.value['points'], args.value['isPreventDrag'], args.value['saveContext'],
                            args.value['isPreventSelection']);
            break;
        case 'updateActiveObject':
            this.updateActiveObject(args.value['actPoint'], args.value['obj'], args.value['isMouseMove'],
                                    args.value['x'], args.value['y']);
            break;
        case 'clearOuterCanvas':
            this.clearOuterCanvas(args.value['context']);
            break;
        case 'setDestPoints':
            this.setDestPoints();
            break;
        case 'updateCurrTransState':
            this.updateCurrTransState(args.value['type'], args.value['isPreventDestination'], args.value['isRotatePan']);
            break;
        case 'currTransState':
            this.currTransState(args.value['type'], args.value['isPreventDestination'], args.value['context'],
                                args.value['isPreventCircleCrop']);
            break;
        case 'setTransform':
            this.setTransform(args.value['context'], args.value['value'], args.value['isReverse']);
            break;
        case 'render-image':
            this.renderImage(args.value['isMouseWheel']);
            break;
        case 'draw-image-to-canvas':
            this.drawImgToCanvas(args.value['dimension'] as Dimension);
            break;
        case 'update-canvas':
            this.updateCanvas();
            break;
        case 'performCancel':
            this.performCancel(args.value['isContextualToolbar']);
            break;
        case 'updateFlipPan':
            this.updateFlipPan(args.value['tempSelectionObj']);
            break;
        case 'select':
            this.select(args.value['type'], args.value['startX'], args.value['startY'], args.value['width'], args.value['height']);
            break;
        case 'callUpdateCurrTransState':
            this.callUpdateCurrTransState();
            break;
        case 'resetPanPoints':
            this.resetPanPoints();
            break;
        case 'setClientTransDim':
            this.setClientTransDim(args.value['isPreventDimension']);
            break;
        case 'redrawImgWithObj':
            this.redrawImgWithObj();
            break;
        case 'setCurrentObj':
            this.setCurrentObj(args.value['obj']);
            break;
        case 'performPointZoom':
            this.performPointZoom(args.value['x'], args.value['y'], args.value['type']);
            break;
        case 'open':
            this.open(args.value['data']);
            break;
        case 'isInitialLoading':
            this.isInitialLoading = args.value['isInitialLoading'];
            break;
        case 'isInitialLoaded':
            this.getInitialLoaded(args.value['object']);
            break;
        case 'fileSelect':
            this.fileSelect(args.value['inputElement'], args.value['args']);
            break;
        case 'getFileName':
            args.value['obj']['fileName'] = this.fileName;
            args.value['obj']['fileType'] = this.fileType;
            break;
        case 'getErrorImage':
            args.value['obj']['isErrorImage'] = this.isErrorImage;
            break;
        case 'getInitialZoomValue':
            args.value['obj']['initialZoomValue'] = this.initZoomValue;
            break;
        case 'setShapeTextInsert':
            this.isShapeTextInserted = args.value['bool'];
            break;
        case 'resetCurrentSelectionPoint':
            this.currSelPoint = null;
            break;
        case 'setRotateZoom':
            this.isRotateZoom = args.value['isRotateZoom'];
            break;
        case 'setTempStrokeSettings':
            this.tempStrokeSettings = args.value['tempStrokeSettings'];
            break;
        case 'setTempTextSettings':
            this.tempTextSettings = args.value['tempTextSettings'];
            break;
        case 'setTempAdjustmentValue':
            this.tempAdjValue = args.value['tempAdjustmentValue'];
            break;
        case 'getTempAdjustmentValue':
            args.value['obj']['value'] = this.tempAdjValue;
            break;
        case 'setTempFilter':
            this.tempFilter = args.value['tempFilter'];
            break;
        case 'setTempUndoRedoStep':
            this.tempUndoRedoStep = args.value['tempUndoRedoStep'];
            break;
        case 'setTempFreehandCounter':
            this.tempFreehandCounter = args.value['tempFreehandCounter'];
            break;
        case 'setTempCurrentFreehandDrawIndex':
            this.tempCurrFhdIndex = args.value['tempCurrentFreehandDrawIndex'];
            break;
        case 'setTempZoomFactor':
            this.tempZoomFactor = args.value['tempZoomFactor'];
            break;
        case 'setCancelAction':
            this.isCancelAction = args.value['bool'];
            break;
        case 'getRotatedFlipCropSelection':
            args.value['bool']['isSelected'] = this.rotatedFlipCropSel;
            break;
        case 'getPrevActObj':
            args.value['obj']['prevActObj'] = this.prevActObj;
            break;
        case 'setPrevActObj':
            this.prevActObj = args.value['prevActObj'];
            break;
        case 'setZoomCropWidth':
            this.zoomCrop.width = args.value['width'];
            this.zoomCrop.height = args.value['height'];
            break;
        case 'setImageEdited':
            this.isImageEdited = true;
            break;
        case 'reset':
            this.reset();
            break;
        case 'dlgBtnClick':
            this.dlgBtnClick();
            break;
        case 'dlgCloseBtnClick':
            this.dlgCloseBtnClick();
            break;
        case 'setNewPath':
            this.isNewPath = args.value['bool'];
            break;
        case 'getNewPath':
            args.value['obj']['isNewPath'] = this.isNewPath;
            break;
        case 'getArrowDimension':
            args.value['obj']['arrowDimension'] = this.arrowDimension;
            break;
        case 'setArrowDimension':
            this.arrowDimension = args.value['arrowDimension'];
            break;
        case 'moveToSelectionRange':
            this.moveToSelectionRange(args.value['type'], args.value['activeObj']);
            break;
        }
    }

    public getModuleName(): string {
        return 'draw';
    }

    private updatePrivateVariables(): void {
        const parent: ImageEditor = this.parent;
        if (parent.lowerCanvas) {this.lowerContext = parent.lowerCanvas.getContext('2d'); }
        if (parent.upperCanvas) {this.upperContext = parent.upperCanvas.getContext('2d'); }
        if (isNullOrUndefined(this.tempZoomFactor)) {
            this.tempZoomFactor = parent.transform.zoomFactor;
        }
    }

    private reset(): void {
        this.isInitialLoading = this.isErrorImage = this.isNewPath = false;
        this.cancelObjColl = this.cancelPointColl = []; this.isShapeTextInserted = false;
        this.initZoomValue = null; this.tempFilter = '';
        this.currSelPoint = null; this.isRotateZoom = false; this.tempAdjValue = '';
        this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
        this.tempTextSettings =
            {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false};
        this.tempUndoRedoStep = this.tempFreehandCounter = this.tempCurrFhdIndex = 0; this.tempZoomFactor = null;
        this.isCancelAction = false; this.rotatedFlipCropSel = false; this.prevActObj = null;
        this.arrowDimension = {bar: {width: 10, height: 32, ratioX: null, ratioY: null},
            arrow: {width: 24, height: 24, ratioX: null, ratioY: null}, arrowSolid: {width: 32, height: 32, ratioX: null, ratioY: null},
            circle: {width: 10, height: 10, ratioX: null, ratioY: null}, square: {width: 20, height: 20, ratioX: null, ratioY: null }};
    }

    private drawObject(canvas: string, obj?: SelectionPoint, isCropRatio?: boolean, points?: ActivePoint,
                       isPreventDrag?: boolean, saveContext?: CanvasRenderingContext2D,
                       isPreventSelection?: boolean): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        let canvasDraw: CanvasRenderingContext2D;
        if (canvas.toLowerCase() === 'original') {canvasDraw = this.lowerContext; }
        else if (canvas.toLowerCase() === 'duplicate') {canvasDraw = this.upperContext; }
        else if (saveContext) {canvasDraw = saveContext; }
        if (!isPreventDrag && parent.activeObj.shape) {this.setDragLimit(); }
        if (parent.currObjType.shape) {
            const splitWords: string[] = parent.currObjType.shape.split('-');
            if (splitWords[0].toLowerCase() === 'crop' && isCropRatio) {this.drawCropRatio(); }
        }
        if (points) {
            actPoint.startX = points.startX; actPoint.startY = points.startY;
            actPoint.endX = points.endX; actPoint.endY = points.endY;
            actPoint.width = points.width; actPoint.height = points.height;
        }
        if (isNullOrUndefined(parent.activeObj.strokeSettings)) {
            const obj: Object = {strokeSettings: {} as StrokeSettings };
            parent.notify('shape', { prop: 'getStrokeSettings', onPropertyChange: false,
                value: {obj: obj }});
            parent.activeObj.strokeSettings = obj['strokeSettings'];
        }
        if (isNullOrUndefined(parent.activeObj.strokeSettings.strokeWidth)) {
            parent.activeObj.strokeSettings.strokeWidth = 2;
        }
        if (obj) {parent.activeObj = extend({}, obj, {}, true) as SelectionPoint; }
        this.updateActiveObject();
        if (parent.currObjType.isText) {
            const obj: Object = {keyHistory: '' };
            parent.notify('shape', { prop: 'getKeyHistory', onPropertyChange: false, value: {obj: obj }});
            parent.activeObj.keyHistory = obj['keyHistory'];
        }
        if (canvas.toLowerCase() !== 'original') {
            let splitWords: string[]; let isCrop: boolean = false;
            if (parent.activeObj.shape) {
                splitWords = parent.activeObj.shape.split('-');
                if (splitWords[0] === 'crop') {isCrop = true; }
            }
            if (isCrop) {
                this.upperContext.fillStyle = 'rgb(0, 0, 0, 0.25)';
                this.upperContext.fillRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
                this.upperContext.clearRect(actPoint.startX, actPoint.startY, actPoint.width, actPoint.height);
            }
            if (isNullOrUndefined(isPreventSelection) && (canvasDraw === this.lowerContext || canvasDraw === this.upperContext)) {
                this.rotateContext('initial', canvasDraw); this.drawOuterSelection(canvasDraw); this.rotateContext('reverse', canvasDraw);
            }
        }
        parent.currObjType.isActiveObj = true; const object: Object = {keyHistory: '' };
        parent.notify('shape', { prop: 'getKeyHistory', onPropertyChange: false, value: {obj: object }});
        if (obj) {this.drawShapeObj(canvas, obj.shape, saveContext, isPreventSelection); }
        else if (object['keyHistory'] !== '' && parent.currObjType.isText) {this.drawShapeObj(canvas, 'text', saveContext, isPreventSelection); }
        else if (parent.activeObj.shape) {
            this.drawShapeObj(canvas, parent.activeObj.shape, saveContext, isPreventSelection);
        }
        else {this.drawShapeObj(canvas, undefined, saveContext, isPreventSelection); }
    }

    private rotateContext(type: string, ctx: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        const activePoint: ActivePoint = extend({}, parent.activeObj.activePoint, {}, true) as ActivePoint;
        if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow') {
            return;
        }
        const rotationAngle: number = (type === 'initial') ? parent.activeObj.rotatedAngle : -parent.activeObj.rotatedAngle;
        ctx.translate(activePoint.startX + (activePoint.width / 2), activePoint.startY + (activePoint.height / 2));
        ctx.rotate(rotationAngle);
        ctx.translate(-(activePoint.startX + (activePoint.width / 2)), -(activePoint.startY + (activePoint.height / 2)));
    }

    private setDragLimit(): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        if (actPoint && parent.activeObj.rotatedAngle === 0) {
            if (actPoint.startX < parent.img.destLeft) {
                actPoint.startX = parent.img.destLeft;
                actPoint.endX = actPoint.startX + actPoint.width;
            }
            else if (actPoint.endX > parent.img.destLeft + parent.img.destWidth) {
                actPoint.endX = parent.img.destLeft + parent.img.destWidth;
                actPoint.startX = actPoint.endX - actPoint.width;
            }
            if (actPoint.startY < parent.img.destTop) {
                actPoint.startY = parent.img.destTop;
            }
            else if (actPoint.endY > parent.img.destTop + parent.img.destHeight) {
                actPoint.endY = parent.img.destTop + parent.img.destHeight;
                actPoint.startY = actPoint.endY - actPoint.height;
            }
            parent.activeObj = this.updateWidthHeight(parent.activeObj);
        }
    }

    private drawCropRatio(): void {
        const parent: ImageEditor = this.parent; let actPoint: ActivePoint = parent.activeObj.activePoint;
        let x: number; let y: number; let width: number; let height: number;
        if (parent.transform.zoomFactor > 0 && this.currSelPoint) {
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            this.drawCustomSelection('crop-custom', null, null, null, null);
            if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
                width = parent.activeObj.activePoint.width < parent.activeObj.activePoint.height ?
                    parent.activeObj.activePoint.width : parent.activeObj.activePoint.height;
                height = width;
            } else {
                if (parent.img.destLeft + parent.img.destLeft + parent.img.destWidth <= parent.lowerCanvas.clientWidth) {
                    width = actPoint.width;
                } else {
                    width = parent.lowerCanvas.clientWidth - parent.img.destLeft;
                }
                if (parent.img.destTop + parent.img.destTop + parent.img.destHeight <= parent.lowerCanvas.clientHeight) {
                    height = actPoint.height;
                } else {
                    height = parent.lowerCanvas.clientHeight - parent.img.destTop;
                }
            }
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.activeObj = activeObj; parent.currObjType.shape = activeObj.shape;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            parent.currObjType.isCustomCrop = false;
        } else {
            width = parent.img.destWidth; height = parent.img.destHeight;
            if (parent.img.destLeft < 0) {width += parent.img.destLeft; }
            if (parent.img.destTop < 0) {height += parent.img.destTop; }
            if (parent.currObjType.shape.toLowerCase() !== 'crop-square' && parent.currObjType.shape.toLowerCase() !== 'crop-circle') {
                if (parent.img.destLeft + parent.img.destWidth > parent.lowerCanvas.width) {
                    width -= (parent.img.destLeft + parent.img.destWidth - parent.lowerCanvas.width); }
                if (parent.img.destTop + parent.img.destHeight > parent.lowerCanvas.height) {
                    height -= (parent.img.destTop + parent.img.destHeight - parent.lowerCanvas.height); }
            }
        }
        switch (parent.currObjType.shape.toLowerCase()) {
        case 'crop-square':
        case 'crop-circle':
            parent.notify('selection', { prop: 'setDragDirection', onPropertyChange: false, value: { width: width, height: height } });
            actPoint = parent.activeObj.activePoint;
            if (parent.lowerCanvas.width < (actPoint.endX - actPoint.startX)) {
                actPoint.startX = 7.5; actPoint.endX = parent.lowerCanvas.width - 7.5;
            }
            if (parent.lowerCanvas.height < (actPoint.endY - actPoint.startY)) {
                actPoint.startY = 7.5; actPoint.endY = parent.lowerCanvas.height - 7.5;
            }
            if (width === parent.img.destWidth && height === parent.img.destHeight) {
                actPoint.startX += parent.img.destLeft; actPoint.startY +=
                parent.img.destTop;
                actPoint.endX += parent.img.destLeft; actPoint.endY +=
                parent.img.destTop;
            }
            if (parent.lowerCanvas.width > parent.lowerCanvas.height) {
                actPoint.height = actPoint.endY - actPoint.startY;
                actPoint.width = actPoint.height;
                actPoint.endX = actPoint.startX +
                actPoint.width;
            } else {
                actPoint.width = actPoint.endX - actPoint.startX;
                actPoint.height = actPoint.width;
                actPoint.endY = actPoint.startY +
                actPoint.height;
            }
            break;
        case 'crop-3:2':
            x = 3; y = 2;
            break;
        case 'crop-4:3':
            x = 4; y = 3;
            break;
        case 'crop-5:4':
            x = 5; y = 4;
            break;
        case 'crop-7:5':
            x = 7; y = 5;
            break;
        case 'crop-16:9':
            x = 16; y = 9;
            break;
        }
        if (x !== undefined && y !== undefined) {
            parent.notify('selection', { prop: 'calcShapeRatio', onPropertyChange: false,
                value: { x: x, y: y, imgWidth: width, imgHeight: height }});
            if (width === parent.img.destWidth && height === parent.img.destHeight) {
                this.updatePoints();
            }
            actPoint = parent.activeObj.activePoint;
        }
        if (actPoint.startX < parent.img.destLeft) {
            const diff: number = (parent.img.destLeft - actPoint.startX) + 7.5;
            actPoint.startX += diff;
            actPoint.endX += diff;
        }
        if (actPoint.startY < parent.img.destTop) {
            const diff: number = (parent.img.destTop - actPoint.startY) + 7.5;
            actPoint.startY += diff;
            actPoint.endY += diff;
        }
        parent.activeObj = this.updateWidthHeight(parent.activeObj);
        this.adjToCenter();
    }

    private adjToCenter(): void {
        const parent: ImageEditor = this.parent;
        const diffX: number = ((parent.lowerCanvas.width) / 2) - (parent.activeObj.activePoint.endX -
            parent.activeObj.activePoint.width / 2);
        const diffY: number = ((parent.lowerCanvas.height) / 2) - (parent.activeObj.activePoint.endY -
            parent.activeObj.activePoint.height / 2);
        parent.activeObj.activePoint.startX += diffX; parent.activeObj.activePoint.endX += diffX;
        parent.activeObj.activePoint.startY += diffY; parent.activeObj.activePoint.endY += diffY;
        if (parent.activeObj.activePoint.startX < (parent.img.destLeft >= 7.5 ? parent.img.destLeft : 7.5)) {
            const diff: number = ((parent.img.destLeft >= 7.5 ? parent.img.destLeft : 0) - parent.activeObj.activePoint.startX) + 7.5;
            parent.activeObj.activePoint.startX += diff;
            parent.activeObj.activePoint.endX += diff;
        } else if (parent.activeObj.activePoint.endX > parent.img.destLeft + parent.img.destWidth) {
            const diff: number = (parent.activeObj.activePoint.endX - (parent.img.destLeft + parent.img.destWidth)) + 7.5;
            parent.activeObj.activePoint.startX -= diff;
            parent.activeObj.activePoint.endX -= diff;
        }
        if (parent.activeObj.activePoint.startY < (parent.img.destTop > 7.5 ? parent.img.destTop : 7.5)) {
            const diff: number = ((parent.img.destTop > 7.5 ? parent.img.destTop : 0) - parent.activeObj.activePoint.startY) + 7.5;
            parent.activeObj.activePoint.startY += diff;
            parent.activeObj.activePoint.endY += diff;
        } else if (parent.activeObj.activePoint.endY > parent.img.destTop + parent.img.destHeight) {
            const diff: number = (parent.activeObj.activePoint.endY - (parent.img.destTop + parent.img.destHeight)) + 7.5;
            parent.activeObj.activePoint.startY -= diff;
            parent.activeObj.activePoint.endY -= diff;
        }
    }

    private updateActiveObject(actPoint?: ActivePoint, obj?: SelectionPoint, isMouseMove?: boolean, x?: number, y?: number): void {
        actPoint = actPoint ? actPoint : extend({}, this.parent.activeObj.activePoint, {}, true) as ActivePoint;
        obj = obj ? obj : extend({}, this.parent.activeObj, {}, true) as SelectionPoint;
        actPoint.width = actPoint.endX - actPoint.startX;
        actPoint.height = actPoint.endY - actPoint.startY;
        x = x ? x : 0; y = y ? y : 0;
        const horCircleWidth: number = actPoint.width / 2; const verCircleHeight: number = actPoint.height / 2;
        const radius: number = 7.5;
        obj.horTopLine = {startX : actPoint.startX + x, startY: actPoint.startY - y,
            endX: actPoint.endX + x, endY: actPoint.endY + y};
        obj.horBottomLine = {startX : actPoint.startX - x, startY: actPoint.endY - y,
            endX: actPoint.endX - x, endY: actPoint.endY + y};
        obj.verLeftLine = {startX : actPoint.startX + x, startY: actPoint.startY - y,
            endX: actPoint.startX - y, endY: actPoint.endY - y};
        obj.verRightLine = {startX : actPoint.endX + x, startY: actPoint.startY + y,
            endX: actPoint.endX - x, endY: actPoint.endY + y};
        obj.topLeftCircle = {startX : actPoint.startX, startY: actPoint.startY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.topCenterCircle = {startX : actPoint.startX + horCircleWidth, startY: actPoint.startY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.topRightCircle = {startX : actPoint.endX, startY: actPoint.startY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.centerLeftCircle = {startX : actPoint.startX, startY: actPoint.startY + verCircleHeight,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.centerRightCircle = {startX : actPoint.endX, startY: actPoint.startY + verCircleHeight,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.bottomLeftCircle = {startX : actPoint.startX, startY: actPoint.endY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.bottomCenterCircle = {startX : actPoint.startX + horCircleWidth, startY: actPoint.endY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.bottomRightCircle = {startX : actPoint.endX, startY: actPoint.endY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        if (obj.rotatedAngle === 0) {
            obj.rotationCirclePoint = {x: obj.bottomCenterCircle.startX,
                y: obj.bottomCenterCircle.startY + 25};
            obj.rotationCirclePoint.ratioX = (obj.rotationCirclePoint.x - this.parent.img.destLeft) / this.parent.img.destWidth;
            obj.rotationCirclePoint.ratioY = (obj.rotationCirclePoint.y - this.parent.img.destTop) / this.parent.img.destHeight;
        }
        obj.activePoint = actPoint;
        if (isNullOrUndefined(isMouseMove)) {
            this.parent.activeObj = extend({}, obj, {}, true) as SelectionPoint;
        }
    }

    private drawOuterSelection(canvasDraw: CanvasRenderingContext2D, isCropCircle?: boolean): void {
        let splitWords: string[]; const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        canvasDraw.lineWidth = (0.5);
        if (parent.activeObj.shape !== undefined) {
            splitWords  = parent.activeObj.shape.split('-');
        }
        const tempObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        if (parent.activeObj.shape !== undefined) {
            splitWords  = parent.activeObj.shape.split('-');
        }
        if (((splitWords !== undefined && splitWords[0] === 'crop') || parent.activeObj.shape === undefined) && !isCropCircle) {
            this.upperContext.fillStyle = 'rgb(0, 0, 0, 0.25)';
            this.upperContext.fillRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
            this.upperContext.clearRect(actPoint.startX, actPoint.startY, actPoint.width, actPoint.height);
        }
        canvasDraw.strokeStyle = parent.themeColl[parent.theme]['primaryColor'];
        canvasDraw.fillStyle = parent.themeColl[parent.theme]['secondaryColor'];
        let degree: number;
        if (tempObj.shapeDegree === 0) {degree = parent.transform.degree; }
        else {degree = parent.transform.degree - tempObj.shapeDegree; }
        if (degree < 0) {degree = 360 + degree; }
        if (parent.activeObj.shape === 'arrow' || parent.activeObj.shape === 'line') {
            canvasDraw.beginPath();
            canvasDraw.moveTo(actPoint.startX, actPoint.startY);
            canvasDraw.lineTo(actPoint.endX, actPoint.endY);
            canvasDraw.stroke();
        } else if (parent.activeObj.shape === 'path') {
            canvasDraw.beginPath();
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            canvasDraw.moveTo(activeObj.pointColl[0].x, activeObj.pointColl[0].y);
            if (activeObj.pointColl.length > 1) {
                for (let i: number = 1, len: number = activeObj.pointColl.length; i < len; i++) {
                    actPoint.endX = activeObj.pointColl[i as number].x;
                    actPoint.endY = activeObj.pointColl[i as number].y;
                    canvasDraw.lineTo(actPoint.endX, actPoint.endY);
                }
            }
            const obj: Object = {shape: null };
            parent.notify('selection', { prop: 'getCurrentDrawingShape', value: {obj: obj }});
            if (obj['shape'] === 'path') {
                parent.activeObj = activeObj;
            }
            canvasDraw.lineTo(actPoint.endX, actPoint.endY);
            canvasDraw.stroke();
        } else {
            canvasDraw.beginPath();
            canvasDraw.rect(tempObj.activePoint.startX, tempObj.activePoint.startY, tempObj.activePoint.width, tempObj.activePoint.height);
            canvasDraw.stroke(); canvasDraw.closePath();
            if (parent.selectionSettings.showCircle) {
                const strokeColor: string = canvasDraw.strokeStyle as string;
                const fillColor: string = canvasDraw.fillStyle as string;
                canvasDraw.strokeStyle = parent.selectionSettings.strokeColor;
                canvasDraw.fillStyle = parent.selectionSettings.fillColor;
                canvasDraw.lineWidth *= 2; canvasDraw.beginPath();
                canvasDraw.moveTo(tempObj.topLeftCircle.startX, tempObj.topLeftCircle.startY);
                canvasDraw.arc(tempObj.topLeftCircle.startX, tempObj.topLeftCircle.startY,
                               tempObj.topLeftCircle.radius, 0, 2 * Math.PI);
                canvasDraw.moveTo(tempObj.topRightCircle.startX, tempObj.topRightCircle.startY);
                canvasDraw.arc(tempObj.topRightCircle.startX, tempObj.topRightCircle.startY,
                               tempObj.topRightCircle.radius, 0, 2 * Math.PI);
                canvasDraw.moveTo(tempObj.bottomLeftCircle.startX, tempObj.bottomLeftCircle.startY);
                canvasDraw.arc(tempObj.bottomLeftCircle.startX, tempObj.bottomLeftCircle.startY,
                               tempObj.bottomLeftCircle.radius, 0, 2 * Math.PI);
                canvasDraw.moveTo(tempObj.bottomRightCircle.startX, tempObj.bottomRightCircle.startY);
                canvasDraw.arc(tempObj.bottomRightCircle.startX, tempObj.bottomRightCircle.startY,
                               tempObj.bottomRightCircle.radius, 0, 2 * Math.PI);
                canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
                canvasDraw.lineWidth /= 2;
                canvasDraw.strokeStyle = strokeColor; canvasDraw.fillStyle = fillColor;
            }
        }
        if (parent.selectionSettings.showCircle && (splitWords === undefined || splitWords[0] !== 'crop')) {
            const strokeColor: string = canvasDraw.strokeStyle as string;
            const fillColor: string = canvasDraw.fillStyle as string;
            canvasDraw.strokeStyle = parent.selectionSettings.strokeColor;
            canvasDraw.fillStyle = parent.selectionSettings.fillColor;
            if (parent.activeObj.shape === 'text') {
                // Text rotation codes
                // canvasDraw.lineWidth *= 2;
                // canvasDraw.beginPath();
                // this.drawRotationArcLine(canvasDraw);
                // canvasDraw.lineTo(parent.activeObj.rotationCirclePoint.x, parent.activeObj.rotationCirclePoint.y);
                // canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
                // canvasDraw.beginPath();
                // canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x, parent.activeObj.rotationCirclePoint.y);
                // canvasDraw.arc(parent.activeObj.rotationCirclePoint.x, parent.activeObj.rotationCirclePoint.y,
                //                parent.activeObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
                // canvasDraw.stroke();
                // canvasDraw.fill();
                // canvasDraw.closePath();
                // canvasDraw.lineWidth /= 2;
            } else {
                this.drawCenterCircles(canvasDraw);
            }
            canvasDraw.strokeStyle = strokeColor; canvasDraw.fillStyle = fillColor;
        }
        tempObj.rotationCircleLine = parent.activeObj.rotationCircleLine;
        parent.activeObj = extend({}, tempObj, {}, true) as SelectionPoint;
    }

    private drawArrowHead(canvasDraw: CanvasRenderingContext2D, isStartHead: boolean): void {
        const headType: string = isStartHead ? this.parent.activeObj.start : this.parent.activeObj.end;
        switch (headType) {
        case 'arrowSolid':
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isStartHead ? this.arrowSolid(canvasDraw, true) : this.arrowSolid(canvasDraw, false);
            break;
        case 'arrow':
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isStartHead ? this.arrow(canvasDraw, true) : this.arrow(canvasDraw, false);
            break;
        case 'circleSolid':
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isStartHead ? this.arrowCircleSolid(canvasDraw, true) : this.arrowCircleSolid(canvasDraw, false);
            break;
        case 'circle':
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isStartHead ? this.arrowCircle(canvasDraw, true) : this.arrowCircle(canvasDraw, false);
            break;
        case 'bar':
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isStartHead ? this.arrowBar(canvasDraw, true) : this.arrowBar(canvasDraw, false);
            break;
        case 'square':
        case 'squareSolid':
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isStartHead ? this.arrowSquareStart(canvasDraw) : this.arrowSquareEnd(canvasDraw);
            break;
        }
    }

    private drawShapeObj(canvas: string, shape?: string, saveContext?: CanvasRenderingContext2D,
                         isPreventSelection?: boolean): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        const currentShape: string = shape !== undefined ? shape : parent.currObjType.shape;
        parent.currObjType.shape = currentShape; let canvasDraw: CanvasRenderingContext2D;
        if (canvas.toLowerCase() === 'original') {canvasDraw = this.lowerContext; }
        else if (canvas.toLowerCase() === 'duplicate') {canvasDraw = this.upperContext; }
        else if (saveContext) {canvasDraw = saveContext; }
        if (parent.currObjType.shape.toLowerCase() === 'rectangle' || parent.currObjType.shape.toLowerCase() === 'ellipse'
         || parent.currObjType.shape.toLowerCase() === 'line' || parent.activeObj.shape === 'arrow' ||
         parent.activeObj.shape === 'path') {
            parent.activeObj.shape = parent.currObjType.shape;
        }
        canvasDraw.strokeStyle = parent.activeObj.strokeSettings.strokeColor;
        if (shape === 'text' || shape === 'freehanddraw') {
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
        } else {
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.fillColor;
        }
        const horLineWidth: number = actPoint.width / 3;
        const verLineHeight: number = actPoint.height / 3;
        let selectionWidth: number = actPoint.endX - actPoint.startX;
        let selectionHeight: number = actPoint.endY - actPoint.startY;
        this.rotateContext('initial', canvasDraw);
        let degree: number; const tempFillStyle: string = canvasDraw.fillStyle; let activeObj: SelectionPoint;
        switch (parent.currObjType.shape.toLowerCase()) {
        case 'rectangle':
            this.drawSquareLines(canvasDraw);
            if (isNullOrUndefined(isPreventSelection) && canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'ellipse':
            selectionWidth = Math.abs(selectionWidth); selectionHeight = Math.abs(selectionHeight);
            canvasDraw.beginPath();
            canvasDraw.ellipse(actPoint.startX + (selectionWidth / 2),
                               actPoint.startY + (selectionHeight / 2),
                               selectionWidth / 2,  selectionHeight / 2, 0, 0, 2 * Math.PI, false);
            if (parent.activeObj.strokeSettings.fillColor !== '') {
                canvasDraw.fillStyle = parent.activeObj.strokeSettings.fillColor;
                canvasDraw.fill();
            }
            canvasDraw.ellipse(actPoint.startX + (selectionWidth / 2),
                               actPoint.startY + (selectionHeight / 2),
                               Math.abs((selectionWidth / 2) - (parent.activeObj.strokeSettings.strokeWidth)),
                               Math.abs((selectionHeight / 2) - (parent.activeObj.strokeSettings.strokeWidth)),
                               0, 0, 2 * Math.PI, false);
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
            canvasDraw.fill('evenodd');
            canvasDraw.closePath();
            if (isNullOrUndefined(isPreventSelection) && canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'crop-circle':
            if (canvasDraw === this.lowerContext) {
                canvasDraw = this.upperContext;
            }
            this.shapeCircle(canvasDraw, selectionWidth, selectionHeight);
            break;
        case 'line':
            this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                           actPoint.endX, actPoint.endY);
            if (isNullOrUndefined(isPreventSelection) && canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'arrow':
            if (parent.activeObj.shapeDegree === 0) {degree = parent.transform.degree; }
            else {degree = parent.transform.degree - parent.activeObj.shapeDegree; }
            if (degree < 0) {degree = 360 + degree; }
            canvasDraw.fillStyle = canvasDraw.strokeStyle;
            if (isNullOrUndefined(parent.activeObj.triangleDirection)) {
                parent.activeObj.triangleDirection = 'right';
            }
            if (isNullOrUndefined(parent.activeObj.start)) {
                parent.activeObj.start = 'none';
            }
            if (isNullOrUndefined(parent.activeObj.end)) {
                parent.activeObj.end = 'arrowSolid';
            }
            this.drawArrowHead(canvasDraw, true); this.drawArrowHead(canvasDraw, false);
            if (parent.activeObj.end === 'none') {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                               actPoint.endX, actPoint.endY);
            }
            canvasDraw.fillStyle = tempFillStyle;
            if (isNullOrUndefined(isPreventSelection) && canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'path':
            activeObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            if (activeObj.pointColl.length > 1) {
                const obj: Object = {shape: null };
                parent.notify('selection', { prop: 'getCurrentDrawingShape', value: {obj: obj }});
                if (obj['shape'] === 'path') {
                    const nextPoint: Point = {x: 0, y: 0 };
                    for (let i: number = 0, len: number = activeObj.pointColl.length; i < len; i++) {
                        if (isNullOrUndefined(activeObj.pointColl[i + 1])) {
                            nextPoint.x = activeObj.activePoint.endX; nextPoint.y = activeObj.activePoint.endY;
                        } else {
                            nextPoint.x = activeObj.pointColl[i + 1].x; nextPoint.y = activeObj.pointColl[i + 1].y;
                        }
                        actPoint.startX = activeObj.pointColl[i as number].x;
                        actPoint.startY = activeObj.pointColl[i as number].y;
                        actPoint.endX = nextPoint.x; actPoint.endY = nextPoint.y;
                        parent.activeObj = this.updateWidthHeight(parent.activeObj);
                        this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                                       actPoint.endX, actPoint.endY);
                    }
                } else {
                    for (let i: number = 1, len: number = activeObj.pointColl.length; i < len; i++) {
                        actPoint.startX = activeObj.pointColl[i - 1].x;
                        actPoint.startY = activeObj.pointColl[i - 1].y;
                        actPoint.endX = activeObj.pointColl[i as number].x;
                        actPoint.endY = activeObj.pointColl[i as number].y;
                        parent.activeObj = this.updateWidthHeight(parent.activeObj);
                        this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
                    }
                }
                parent.activeObj = activeObj;
            } else {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
            }
            if (canvasDraw === this.upperContext) {this.drawOuterSelection(canvasDraw); }
            break;
        case 'text':
            this.shapeText(canvasDraw);
            break;
        case 'crop-square':
        case 'crop-3:4':
        case 'crop-4:3':
        case 'crop-6:9':
        case 'crop-9:6':
        case 'crop-9:16':
        case 'crop-16:9':
            if (canvasDraw === this.lowerContext) {canvasDraw = this.upperContext; }
            this.drawSelection(horLineWidth, verLineHeight); parent.currObjType.shape = '';
            break;
        default:
            this.drawSelection(horLineWidth, verLineHeight);
            break;
        }
        this.rotateContext('reverse', canvasDraw);
    }

    private updatePoints(): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.activePoint.startX += parent.img.destLeft;
        parent.activeObj.activePoint.startY += parent.img.destTop;
        parent.activeObj.activePoint.endX += parent.img.destLeft;
        parent.activeObj.activePoint.endY += parent.img.destTop;
        parent.activeObj = this.updateWidthHeight(parent.activeObj);
    }

    private updateWidthHeight(obj: SelectionPoint): SelectionPoint {
        obj.activePoint.width = obj.activePoint.endX - obj.activePoint.startX;
        obj.activePoint.height = obj.activePoint.endY - obj.activePoint.startY;
        return obj;
    }

    private drawCenterCircles(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        canvasDraw.lineWidth *= 2;
        canvasDraw.beginPath();
        if (parent.activeObj.shape === 'arrow' || parent.activeObj.shape === 'line') {
            canvasDraw.moveTo(actPoint.startX, actPoint.startY);
            canvasDraw.arc(actPoint.startX, actPoint.startY,
                           parent.activeObj.topCenterCircle.radius, 0, 2 * Math.PI);
            canvasDraw.moveTo(actPoint.endX, actPoint.endY);
            canvasDraw.arc(actPoint.endX, actPoint.endY,
                           parent.activeObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
        } else if (parent.activeObj.shape === 'path') {
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            if (activeObj.pointColl.length > 1) {
                for (let i: number = 1, len: number = activeObj.pointColl.length; i < len; i++) {
                    actPoint.startX = activeObj.pointColl[i - 1].x;
                    actPoint.startY = activeObj.pointColl[i - 1].y;
                    actPoint.endX = activeObj.pointColl[i as number].x;
                    actPoint.endY = activeObj.pointColl[i as number].y;
                    canvasDraw.moveTo(actPoint.startX, actPoint.startY);
                    canvasDraw.arc(actPoint.startX, actPoint.startY,
                                   parent.activeObj.topCenterCircle.radius, 0, 2 * Math.PI);
                    canvasDraw.moveTo(actPoint.endX, actPoint.endY);
                    canvasDraw.arc(actPoint.endX, actPoint.endY,
                                   parent.activeObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
                }
            }
            const obj: Object = {shape: null };
            parent.notify('selection', { prop: 'getCurrentDrawingShape', value: {obj: obj }});
            if (obj['shape'] === 'path') {
                parent.activeObj = activeObj;
            }
            canvasDraw.moveTo(actPoint.startX, actPoint.startY);
            canvasDraw.arc(actPoint.startX, actPoint.startY, parent.activeObj.topCenterCircle.radius, 0, 2 * Math.PI);
            canvasDraw.moveTo(actPoint.endX, actPoint.endY);
            canvasDraw.arc(actPoint.endX, actPoint.endY, parent.activeObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
        } else {
            this.drawRotationArcLine(canvasDraw);
            canvasDraw.lineTo(parent.activeObj.rotationCirclePoint.x, parent.activeObj.rotationCirclePoint.y);
        }
        canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
        if (parent.activeObj.shape !== 'arrow' && parent.activeObj.shape !== 'line' &&
            parent.activeObj.shape !== 'path') {
            canvasDraw.beginPath();
            canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x, parent.activeObj.rotationCirclePoint.y);
            canvasDraw.arc(parent.activeObj.rotationCirclePoint.x, parent.activeObj.rotationCirclePoint.y,
                           parent.activeObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
        }
        canvasDraw.lineWidth /= 2;
    }

    private drawRotationArcLine(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.activeObj.rotationCircleLine)) {
            parent.activeObj.rotationCircleLine = 22.5;
        }
        let degree: number; let isHorizontalflip: boolean = false; let isVerticalflip: boolean = false;
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
        switch (degree) {
        case 0:
        case 360:
            if (isVerticalflip) {
                parent.activeObj.rotationCirclePoint = {x: parent.activeObj.topCenterCircle.startX,
                    y: parent.activeObj.topCenterCircle.startY - parent.activeObj.rotationCircleLine};
                canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x,
                                  parent.activeObj.rotationCirclePoint.y + parent.activeObj.rotationCircleLine);
            } else {
                parent.activeObj.rotationCirclePoint = {x: parent.activeObj.bottomCenterCircle.startX,
                    y: parent.activeObj.bottomCenterCircle.startY + parent.activeObj.rotationCircleLine};
                canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x,
                                  parent.activeObj.rotationCirclePoint.y - parent.activeObj.rotationCircleLine);
            }
            break;
        case 90:
        case -270:
            if (isHorizontalflip) {
                parent.activeObj.rotationCirclePoint = {x: parent.activeObj.centerRightCircle.startX +
                    parent.activeObj.rotationCircleLine, y: parent.activeObj.centerLeftCircle.startY};
                canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x - parent.activeObj.rotationCircleLine,
                                  parent.activeObj.rotationCirclePoint.y);
            } else {
                parent.activeObj.rotationCirclePoint = {x: parent.activeObj.centerLeftCircle.startX -
                    parent.activeObj.rotationCircleLine, y: parent.activeObj.centerLeftCircle.startY};
                canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x + parent.activeObj.rotationCircleLine,
                                  parent.activeObj.rotationCirclePoint.y);
            }
            break;
        case 180:
        case -180:
            if (isVerticalflip) {
                parent.activeObj.rotationCirclePoint = {x: parent.activeObj.bottomCenterCircle.startX,
                    y: parent.activeObj.bottomCenterCircle.startY + parent.activeObj.rotationCircleLine};
                canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x,
                                  parent.activeObj.rotationCirclePoint.y - parent.activeObj.rotationCircleLine);
            } else {
                parent.activeObj.rotationCirclePoint = {x: parent.activeObj.topCenterCircle.startX,
                    y: parent.activeObj.topCenterCircle.startY - parent.activeObj.rotationCircleLine};
                canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x,
                                  parent.activeObj.rotationCirclePoint.y + parent.activeObj.rotationCircleLine);
            }
            break;
        case 270:
        case -90:
            if (isHorizontalflip) {
                parent.activeObj.rotationCirclePoint = {x: parent.activeObj.centerLeftCircle.startX -
                    parent.activeObj.rotationCircleLine, y: parent.activeObj.centerLeftCircle.startY};
                canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x + parent.activeObj.rotationCircleLine,
                                  parent.activeObj.rotationCirclePoint.y);
            } else {
                parent.activeObj.rotationCirclePoint = {x: parent.activeObj.centerRightCircle.startX +
                    parent.activeObj.rotationCircleLine, y: parent.activeObj.centerLeftCircle.startY};
                canvasDraw.moveTo(parent.activeObj.rotationCirclePoint.x - parent.activeObj.rotationCircleLine,
                                  parent.activeObj.rotationCirclePoint.y);
            }
            break;
        }
    }

    private drawSquareLines(canvasDraw: CanvasRenderingContext2D): void {
        let splitWords: string[]; const parent: ImageEditor = this.parent;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
        if (splitWords[0] === 'crop') {canvasDraw.strokeStyle = '#fff'; }
        else {canvasDraw.strokeStyle = parent.activeObj.strokeSettings.strokeColor; }
        canvasDraw.beginPath();
        canvasDraw.rect(actPoint.startX, actPoint.startY, actPoint.width, actPoint.height);
        if (parent.activeObj.strokeSettings.fillColor !== '') {
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.fillColor; canvasDraw.fill();
        }
        canvasDraw.rect(actPoint.startX + parent.activeObj.strokeSettings.strokeWidth,
                        actPoint.startY + parent.activeObj.strokeSettings.strokeWidth,
                        actPoint.width - (2 * parent.activeObj.strokeSettings.strokeWidth),
                        actPoint.height - (2 * parent.activeObj.strokeSettings.strokeWidth));
        canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
        canvasDraw.fill('evenodd'); canvasDraw.closePath();
    }

    private drawSelection(horLineWidth: number, verLineHeight: number): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        this.upperContext.strokeStyle = parent.themeColl[parent.theme]['primaryColor'];
        this.upperContext.beginPath();
        parent.activeObj.horTopInnerLine = {startX : actPoint.startX, startY : actPoint.startY +
            verLineHeight, endX: actPoint.endX, endY: actPoint.endY + verLineHeight };
        parent.activeObj.horBottomInnerLine = {startX : actPoint.startX, startY :
            actPoint.startY + (2 * verLineHeight), endX: actPoint.endX, endY :
            actPoint.endY + (2 * verLineHeight)};
        parent.activeObj.verLeftInnerLine = {startX : actPoint.startX + horLineWidth,
            startY: actPoint.startY, endX: actPoint.startX + horLineWidth,
            endY: actPoint.endY};
        parent.activeObj.verRightInnerLine = {startX : actPoint.startX + (2 * horLineWidth),
            startY: actPoint.startY, endX: actPoint.startX + (2 * horLineWidth),
            endY: actPoint.endY};
        this.upperContext.moveTo(parent.activeObj.horTopInnerLine.startX, parent.activeObj.horTopInnerLine.startY);
        this.upperContext.lineTo(parent.activeObj.horTopInnerLine.endX, parent.activeObj.horTopInnerLine.startY);
        this.upperContext.moveTo(parent.activeObj.horBottomInnerLine.startX, parent.activeObj.horBottomInnerLine.startY);
        this.upperContext.lineTo(parent.activeObj.horBottomInnerLine.endX, parent.activeObj.horBottomInnerLine.startY);
        this.upperContext.moveTo(parent.activeObj.verLeftInnerLine.startX, parent.activeObj.verLeftInnerLine.startY);
        this.upperContext.lineTo(parent.activeObj.verLeftInnerLine.endX, parent.activeObj.verLeftInnerLine.endY);
        this.upperContext.moveTo(parent.activeObj.verRightInnerLine.startX, parent.activeObj.verRightInnerLine.startY);
        this.upperContext.lineTo(parent.activeObj.verRightInnerLine.endX, parent.activeObj.verRightInnerLine.endY);
        this.upperContext.stroke();
        this.upperContext.closePath();
    }

    private shapeCircle(canvasDraw: CanvasRenderingContext2D, selectionWidth: number, selectionHeight: number): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        canvasDraw.strokeStyle = parent.themeColl[parent.theme]['primaryColor'];
        canvasDraw.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        canvasDraw.fillStyle = 'rgb(0, 0, 0, 0.25)';
        canvasDraw.fillRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        const tempWidth: number = canvasDraw.lineWidth;
        canvasDraw.lineWidth = (2); canvasDraw.beginPath();
        canvasDraw.ellipse(parent.activeObj.horTopLine.startX + (selectionWidth / 2), parent.activeObj.horTopLine.startY
                + (selectionHeight / 2), selectionWidth / 2, selectionHeight / 2, 0, 0, 2 * Math.PI, false);
        canvasDraw.stroke(); canvasDraw.closePath();
        canvasDraw.save(); canvasDraw.beginPath();
        canvasDraw.arc(((actPoint.endX - actPoint.startX) / 2) + actPoint.startX,
                       ((actPoint.endY - actPoint.startY) / 2) + actPoint.startY, (actPoint.width / 2), 0, Math.PI * 2);
        canvasDraw.closePath(); canvasDraw.clip();
        canvasDraw.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        canvasDraw.restore(); canvasDraw.lineWidth = tempWidth;
        this.drawOuterSelection(canvasDraw, true); parent.currObjType.shape = '';
    }

    private shapeLine(canvasDraw: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void {
        const tempLineWidth: number = canvasDraw.lineWidth;
        canvasDraw.lineWidth = (this.parent.activeObj.strokeSettings.strokeWidth);
        canvasDraw.beginPath(); canvasDraw.moveTo(x1, y1);
        canvasDraw.lineTo(x2, y2); canvasDraw.stroke();
        canvasDraw.lineWidth = tempLineWidth;
    }

    private arrow(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
        const x: number = this.arrowDimension['arrow']['width'] + parent.activeObj.strokeSettings.strokeWidth;
        const y: number = this.arrowDimension['arrow']['height'] + parent.activeObj.strokeSettings.strokeWidth;
        this.dx = actPoint.endX - actPoint.startX;
        this.dy = actPoint.endY - actPoint.startY;
        canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
        const angle: number = Math.atan2(this.dy, this.dx);
        if ((start && (parent.activeObj.triangleDirection === 'left' || parent.activeObj.triangleDirection === 'right')
            && (parent.activeObj.start === 'arrow' && parent.activeObj.end === 'none')
            || (parent.activeObj.start === 'arrow' && parent.activeObj.end !== 'circle'
            && parent.activeObj.end !== 'square')) ||
            (!start && (parent.activeObj.end === 'arrow' && parent.activeObj.start === 'none'
            || parent.activeObj.start !== 'circle' && parent.activeObj.start !== 'square'))) {
            this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
        }
        if ((start && parent.activeObj.triangleDirection === 'left') ||
            (!start && parent.activeObj.triangleDirection === 'right')) {
            canvasDraw.translate(actPoint.endX, actPoint.endY);
            canvasDraw.rotate(angle); this.shapeLine(canvasDraw, 0, 0, -x, y / 2);
            this.shapeLine(canvasDraw, 0, 0, -x, -y / 2); canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.endX, -actPoint.endY);
        }
        else if ((start && parent.activeObj.triangleDirection === 'right') ||
            (!start && parent.activeObj.triangleDirection === 'left')) {
            canvasDraw.translate(actPoint.startX, actPoint.startY);
            canvasDraw.rotate(angle); this.shapeLine(canvasDraw, 0, 0, x, y / 2);
            this.shapeLine(canvasDraw, 0, 0, x, -y / 2); canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.startX, -actPoint.startY);
        }
    }

    private arrowSolid(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        const x: number = this.arrowDimension['arrowSolid']['width'] + parent.activeObj.strokeSettings.strokeWidth;
        const y: number = this.arrowDimension['arrowSolid']['height'] + parent.activeObj.strokeSettings.strokeWidth;
        this.dx = actPoint.endX - actPoint.startX;
        this.dy = actPoint.endY - actPoint.startY;
        const angle: number = Math.atan2(this.dy, this.dx);
        if ((start && (parent.activeObj.start === 'arrowSolid' && parent.activeObj.end === 'none')
            || (parent.activeObj.start === 'arrowSolid' && parent.activeObj.end !== 'circle' && parent.activeObj.end !== 'square')) ||
            (!start && (parent.activeObj.end === 'arrowSolid' && parent.activeObj.start === 'none'
            || parent.activeObj.start !== 'circle' && parent.activeObj.start !== 'square'))) {
            this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
        }
        if ((start && parent.activeObj.triangleDirection === 'left') ||
            (!start && parent.activeObj.triangleDirection === 'right')) {
            canvasDraw.translate(actPoint.endX, actPoint.endY);
            canvasDraw.rotate(angle); canvasDraw.beginPath();
            canvasDraw.moveTo(parent.activeObj.strokeSettings.strokeWidth, 0);
            canvasDraw.lineTo(-x + y / 2, y / 2); canvasDraw.lineTo(-x + y / 2, -y / 2);
            canvasDraw.closePath(); canvasDraw.fill(); canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.endX, -actPoint.endY);
            parent.activeObj.rotatedAngle = angle;
        }
        else if ((start && parent.activeObj.triangleDirection === 'right') ||
            (!start && parent.activeObj.triangleDirection === 'left')) {
            canvasDraw.translate(actPoint.startX, actPoint.startY);
            canvasDraw.rotate(angle); canvasDraw.beginPath();
            canvasDraw.moveTo(0 - parent.activeObj.strokeSettings.strokeWidth, 0);
            canvasDraw.lineTo(x - y / 2, y / 2); canvasDraw.lineTo(x - y / 2, -y / 2);
            canvasDraw.closePath(); canvasDraw.fill(); canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.startX, -actPoint.startY);
            parent.activeObj.rotatedAngle = angle;
        }

    }

    private arrowSquareStart(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        if ((parent.activeObj.start === 'square' && parent.activeObj.end === 'none')
            || (parent.activeObj.start === 'square' && parent.activeObj.end !== 'circle'
            && parent.activeObj.start !== 'square') || (parent.activeObj.start === 'squareSolid' && parent.activeObj.end === 'circleSolid')) {
            this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
        }
        canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
        canvasDraw.beginPath(); canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
        const x: number = this.arrowDimension['square']['width'] + parent.activeObj.strokeSettings.strokeWidth;
        const y: number = this.arrowDimension['square']['height'] + parent.activeObj.strokeSettings.strokeWidth;
        this.dx = actPoint.endX - actPoint.startX;
        this.dy = actPoint.endY - actPoint.startY;
        const angle: number = Math.atan2(this.dy, this.dx);
        if (parent.activeObj.triangleDirection === 'left') {
            canvasDraw.translate(actPoint.endX, actPoint.endY);
            canvasDraw.rotate(angle);
            if (parent.activeObj.start === 'squareSolid') {
                canvasDraw.fillRect(-x + y / 2, -y / 2, x, y);
            }
            canvasDraw.strokeRect(-x + y / 2, -y / 2, x, y);
            canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.endX, -actPoint.endY);
            this.squareStartIntersectX1 = actPoint.endX - (y / 2) * Math.cos(angle);
            this.squareStartIntersectY1 = actPoint.endY - (y / 2) * Math.sin(angle);
            if (parent.activeObj.start === 'square' && parent.activeObj.end !== 'square'
                && parent.activeObj.end !== 'circle' && parent.activeObj.end !== 'square') {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                               this.squareStartIntersectX1, this.squareStartIntersectY1);
            }
            if (parent.activeObj.start === 'square' && parent.activeObj.end === 'circle') {
                this.shapeLine(canvasDraw, this.endCircleIntersectX1, this.endCircleIntersectY1,
                               this.squareStartIntersectX1, this.squareStartIntersectY1);
            }
            if (parent.activeObj.start === 'squareSolid' && parent.activeObj.end === 'squareSolid') {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
            }
        }
        else if (parent.activeObj.triangleDirection === 'right') {
            canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
            if (parent.activeObj.start === 'squareSolid' && parent.activeObj.end === 'squareSolid') {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
            }
            canvasDraw.translate(actPoint.startX, actPoint.startY);
            canvasDraw.rotate(angle);
            if (parent.activeObj.start === 'squareSolid') {
                canvasDraw.fillRect(y / 2 - x, -y / 2, x, y);
            }
            canvasDraw.strokeRect(y / 2 - x, -y / 2, x, y);
            canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.startX, -actPoint.startY);
            parent.activeObj.rotatedAngle = angle;
            this.squareStartIntersectX1 = actPoint.startX + (y / 2) * Math.cos(angle);
            this.squareStartIntersectY1 = actPoint.startY + (y / 2) * Math.sin(angle);
            if (parent.activeObj.start === 'square' && parent.activeObj.end !== 'square'
                && parent.activeObj.end !== 'circle' && parent.activeObj.end !== 'square') {
                this.shapeLine(canvasDraw, actPoint.endX, actPoint.endY,
                               this.squareStartIntersectX1, this.squareStartIntersectY1);
            }
            if (parent.activeObj.start === 'square' && parent.activeObj.end === 'circle') {
                this.shapeLine(canvasDraw, this.endCircleIntersectX1, this.endCircleIntersectY1, this.squareStartIntersectX1,
                               this.squareStartIntersectY1);
            }
        }
    }

    private arrowSquareEnd(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        const x: number = this.arrowDimension['square']['width'] + parent.activeObj.strokeSettings.strokeWidth;
        const y: number = this.arrowDimension['square']['height'] + parent.activeObj.strokeSettings.strokeWidth;
        this.dx = actPoint.endX - actPoint.startX;
        this.dy = actPoint.endY - actPoint.startY;
        const angle: number = Math.atan2(this.dy, this.dx);
        canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
        if (parent.activeObj.triangleDirection === 'right') {
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
            if (parent.activeObj.end === 'squareSolid' && parent.activeObj.start === 'none') {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
            }
            canvasDraw.translate(actPoint.endX, actPoint.endY);
            canvasDraw.rotate(angle);
            if (parent.activeObj.end === 'squareSolid') {
                canvasDraw.fillRect(-x + y / 2, -y / 2, x, y);
            }
            canvasDraw.strokeRect(-x + y / 2, -y / 2, x, y);
            canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.endX, -actPoint.endY);
            parent.activeObj.rotatedAngle = angle;
            this.squareEndIntersectX1 = actPoint.endX - (y / 2) * Math.cos(angle);
            this.squareEndIntersectY1 = actPoint.endY - (y / 2) * Math.sin(angle);
            if (parent.activeObj.end === 'square' && parent.activeObj.start !== 'square' && parent.activeObj.start !== 'circle'
                && parent.activeObj.end === 'square') {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                               this.squareEndIntersectX1, this.squareEndIntersectY1);
            }
            else if ((parent.activeObj.start === 'circle') && parent.activeObj.end === 'square') {
                this.shapeLine(canvasDraw, this.squareEndIntersectX1, this.squareEndIntersectY1,
                               this.startCircleIntersectX1, this.startCircleIntersectY1 );
            }
            else if ((parent.activeObj.start === 'square') && parent.activeObj.end === 'square') {
                this.shapeLine(canvasDraw, this.squareEndIntersectX1, this.squareEndIntersectY1,
                               this.squareStartIntersectX1, this.squareStartIntersectY1);
            }

        }
        else if (parent.activeObj.triangleDirection === 'left') {
            canvasDraw.translate(actPoint.startX, actPoint.startY);
            canvasDraw.rotate(angle);
            if (parent.activeObj.end === 'squareSolid') {
                canvasDraw.fillRect(y / 2 - x, -y / 2, x, y);
            }
            canvasDraw.strokeRect(y / 2 - x, -y / 2, x, y);
            canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.startX, -actPoint.startY);
            parent.activeObj.rotatedAngle = angle;
            this.squareEndIntersectX1 = actPoint.startX + (y / 2) * Math.cos(angle);
            this.squareEndIntersectY1 = actPoint.startY + (y / 2) * Math.sin(angle);
            if (parent.activeObj.end === 'square' && parent.activeObj.start !== 'square' &&
                parent.activeObj.start !== 'circle' && parent.activeObj.end === 'square') {
                this.shapeLine(canvasDraw, actPoint.endX, actPoint.endY,
                               this.squareEndIntersectX1, this.squareEndIntersectY1);
            }
            else if ((parent.activeObj.start === 'circle') && parent.activeObj.end === 'square') {
                this.shapeLine(canvasDraw, this.squareEndIntersectX1, this.squareEndIntersectY1,
                               this.startCircleIntersectX1, this.startCircleIntersectY1);
            }
            else if ((parent.activeObj.start === 'square') && parent.activeObj.end === 'square') {
                this.shapeLine(canvasDraw, this.squareEndIntersectX1, this.squareEndIntersectY1,
                               this.squareStartIntersectX1, this.squareStartIntersectY1);
            }
        }
    }

    private arrowCircle(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        if ((start && parent.activeObj.triangleDirection === 'left') ||
            (!start && parent.activeObj.triangleDirection === 'right')) {
            canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
            const circleRadius: number = this.arrowDimension['circle']['width'] + parent.activeObj.strokeSettings.strokeWidth;
            canvasDraw.beginPath();
            canvasDraw.arc(actPoint.endX, actPoint.endY, circleRadius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.closePath();
            this.dx = actPoint.endX - actPoint.startX;
            this.dy = actPoint.endY - actPoint.startY;
            const a: number = this.dx * this.dx + this.dy * this.dy;
            const b: number = 2 * (this.dx * (actPoint.startX - actPoint.endX) + this.dy * (actPoint.startY - actPoint.endY));
            const c: number = (actPoint.startX - actPoint.endX) *
                (actPoint.startX - actPoint.endX) +
                (actPoint.startY - actPoint.endY) *
                (actPoint.startY - actPoint.endY) - circleRadius * circleRadius;
            const intersect: number = b * b - 4 * a * c;
            if (intersect >= 0) {
                canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
                const t2: number = (-b - Math.sqrt(intersect)) / (2 * a);
                const intersectionX1: number = actPoint.startX + this.dx * t2;
                const intersectionY1: number = actPoint.startY + this.dy * t2;
                if (start) {
                    this.startCircleIntersectX1 = intersectionX1; this.startCircleIntersectY1 = intersectionY1;
                    canvasDraw.beginPath(); canvasDraw.fill(); canvasDraw.beginPath();
                    if (parent.activeObj.start === 'circle' && parent.activeObj.end === 'circle') {
                        this.shapeLine(canvasDraw, this.startCircleIntersectX1, this.startCircleIntersectY1,
                                       this.endCircleIntersectX1, this.endCircleIntersectY1);
                    }
                    else if (parent.activeObj.start === 'circle' && parent.activeObj.end !== 'circle' && parent.activeObj.end !== 'square') {
                        this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                                       this.startCircleIntersectX1, this.startCircleIntersectY1);
                    }
                    canvasDraw.stroke(); canvasDraw.closePath();
                } else {
                    this.endCircleIntersectX1 = intersectionX1; this.endCircleIntersectY1 = intersectionY1;
                    if (parent.activeObj.end === 'circle' && (parent.activeObj.start !== 'circle' && parent.activeObj.start !== 'square')) {
                        this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                                       this.endCircleIntersectX1, this.endCircleIntersectY1);
                    }
                }
            }
            const angle: number = Math.atan2(this.dy, this.dx);
            parent.activeObj.rotatedAngle = angle;
        }
        else if ((start && parent.activeObj.triangleDirection === 'right') ||
            (!start && parent.activeObj.triangleDirection === 'left')) {
            canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
            const circleRadius: number = this.arrowDimension['circle']['width'] + parent.activeObj.strokeSettings.strokeWidth;
            canvasDraw.beginPath();
            canvasDraw.arc(actPoint.startX, actPoint.startY,
                           circleRadius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.closePath();
            this.dx = actPoint.startX - actPoint.endX;
            this.dy = actPoint.startY - actPoint.endY;
            const a: number = this.dx * this.dx + this.dy * this.dy;
            const b: number = 2 * (this.dx * (actPoint.endX - actPoint.startX) +
                this.dy * (actPoint.endY - actPoint.startY));
            const c: number = (actPoint.endX - actPoint.startX) *
                (actPoint.endX - actPoint.startX) +
                (actPoint.endY - actPoint.startY) *
                (actPoint.endY - actPoint.startY) - circleRadius * circleRadius;
            const intersect: number = b * b - 4 * a * c;
            if (intersect >= 0) {
                canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
                const t2: number = (-b - Math.sqrt(intersect)) / (2 * a);
                const intersectionX1: number = actPoint.endX + this.dx * t2;
                const intersectionY1: number = actPoint.endY + this.dy * t2;
                if (start) {
                    this.startCircleIntersectX1 = intersectionX1; this.startCircleIntersectY1 = intersectionY1;
                    if (parent.activeObj.start === 'circle' && parent.activeObj.end === 'circle') {
                        this.shapeLine(canvasDraw, this.endCircleIntersectX1, this.endCircleIntersectY1,
                                       this.startCircleIntersectX1, this.startCircleIntersectY1);
                    } else if (parent.activeObj.start === 'circle' && parent.activeObj.end !== 'circle' && parent.activeObj.end !== 'square') {
                        this.shapeLine(canvasDraw, actPoint.endX, actPoint.endY,
                                       this.startCircleIntersectX1, this.startCircleIntersectY1);
                    }
                } else {
                    this.endCircleIntersectX1 = intersectionX1; this.endCircleIntersectY1 = intersectionY1;
                    canvasDraw.beginPath(); canvasDraw.fill(); canvasDraw.beginPath();
                    if (parent.activeObj.end === 'circle' && (parent.activeObj.start !== 'circle' && parent.activeObj.start !== 'square')) {
                        this.shapeLine(canvasDraw, actPoint.endX, actPoint.endY,
                                       this.endCircleIntersectX1, this.endCircleIntersectY1);
                    }
                }
            }
            const angle: number = Math.atan2(this.dy, this.dx);
            parent.activeObj.rotatedAngle = angle;
        }
    }

    private arrowCircleSolid(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        if ((start && parent.activeObj.triangleDirection === 'left') ||
            (!start && parent.activeObj.triangleDirection === 'right')) {
            canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
            canvasDraw.beginPath();
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
            if ((start && (parent.activeObj.start === 'circleSolid' && parent.activeObj.end === 'none') ||
                (parent.activeObj.start === 'circleSolid' && parent.activeObj.end !== 'circle' && parent.activeObj.end !== 'square')) ||
                (!start && (parent.activeObj.end === 'circleSolid' && parent.activeObj.start === 'none'))) {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                               actPoint.endX, actPoint.endY);
            }
            const circleRadius: number = this.arrowDimension['circle']['width'] + parent.activeObj.strokeSettings.strokeWidth;
            this.dx = actPoint.endX - actPoint.startX;
            this.dy = actPoint.endY - actPoint.startY;
            canvasDraw.save(); canvasDraw.beginPath();
            canvasDraw.arc(actPoint.endX, actPoint.endY, circleRadius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
            parent.activeObj.rotatedAngle = Math.atan2(this.dy, this.dx);
        } else if ((start && parent.activeObj.triangleDirection === 'right') ||
            (!start && parent.activeObj.triangleDirection === 'left')) {
            canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
            canvasDraw.beginPath();
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
            if ((start && (parent.activeObj.start === 'circleSolid' && parent.activeObj.end === 'none') ||
                (parent.activeObj.start === 'circleSolid' && parent.activeObj.end !== 'circle' && parent.activeObj.end !== 'square')) ||
                !start && (parent.activeObj.end === 'circleSolid' && parent.activeObj.start === 'none')) {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                               actPoint.endX, actPoint.endY);
            }
            const circleRadius: number = this.arrowDimension['circle']['width'] + parent.activeObj.strokeSettings.strokeWidth;
            this.dx = actPoint.endX - actPoint.startX;
            this.dy = actPoint.endY - actPoint.startY;
            canvasDraw.save(); canvasDraw.beginPath();
            canvasDraw.arc(actPoint.startX, actPoint.startY,
                           circleRadius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
            parent.activeObj.rotatedAngle = Math.atan2(this.dy, this.dx);
        }
    }

    private arrowBar(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        if ((start && parent.activeObj.triangleDirection === 'left') ||
            (!start && parent.activeObj.triangleDirection === 'right')) {
            canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
            canvasDraw.beginPath();
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
            if ((start && (parent.activeObj.start === 'bar' && parent.activeObj.end === 'none') ||
                (parent.activeObj.start === 'bar' && (parent.activeObj.end !== 'circle' && parent.activeObj.end !== 'square'))) ||
                (!start && ((parent.activeObj.end === 'bar' && parent.activeObj.start === 'none') ||
                (parent.activeObj.end === 'bar' && (parent.activeObj.start !== 'circle' && parent.activeObj.start !== 'square'))))) {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                               actPoint.endX, actPoint.endY);
            }
            const x: number = this.arrowDimension['bar']['width'] + parent.activeObj.strokeSettings.strokeWidth;
            const y: number = this.arrowDimension['bar']['height'] + parent.activeObj.strokeSettings.strokeWidth;
            this.dx = actPoint.endX - actPoint.startX;
            this.dy = actPoint.endY - actPoint.startY;
            const angle: number = Math.atan2(this.dy, this.dx);
            canvasDraw.translate(actPoint.endX, actPoint.endY);
            canvasDraw.rotate(angle); canvasDraw.fillRect(-x + y / 4, -y / 2, x, y); canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.endX, -actPoint.endY);
            parent.activeObj.rotatedAngle = angle;
        }
        else if ((start && parent.activeObj.triangleDirection === 'right') ||
            (!start && parent.activeObj.triangleDirection === 'left')) {
            canvasDraw.lineWidth = (parent.activeObj.strokeSettings.strokeWidth);
            canvasDraw.beginPath();
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
            if ((start && (parent.activeObj.start === 'bar' && parent.activeObj.end === 'none')
                || (parent.activeObj.start === 'bar' && (parent.activeObj.end !== 'circle' && parent.activeObj.end !== 'square'))) ||
                (!start && (parent.activeObj.end === 'bar' && parent.activeObj.start === 'none'))) {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY,
                               actPoint.endX, actPoint.endY);
            }
            const x: number = this.arrowDimension['bar']['width'] + parent.activeObj.strokeSettings.strokeWidth;
            const y: number = this.arrowDimension['bar']['height'] + parent.activeObj.strokeSettings.strokeWidth;
            this.dx = actPoint.endX - actPoint.startX;
            this.dy = actPoint.endY - actPoint.startY;
            const angle: number = Math.atan2(this.dy, this.dx);
            canvasDraw.translate(actPoint.startX, actPoint.startY);
            canvasDraw.rotate(angle); canvasDraw.fillRect(y / 4 - x, -y / 2, x, y); canvasDraw.rotate(-angle);
            canvasDraw.translate(-actPoint.startX, -actPoint.startY);
            parent.activeObj.rotatedAngle = angle;
        }
    }

    private shapeText(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        const rows: string[] = parent.activeObj.keyHistory.split('\n');
        const height: number = parent.activeObj.textSettings.fontSize + parent.activeObj.textSettings.fontSize * 0.25;
        const lineHeight: number = ((height * rows.length) - (parent.activeObj.textSettings.fontSize * rows.length)) / rows.length;
        for (let i: number = 0; i < rows.length; i++) {
            const text: string = rows[i as number];
            const yPoint: number = ((i + 1) * parent.activeObj.textSettings.fontSize * 0.85) + (i * lineHeight);
            if (parent.transform.degree === -360) {parent.transform.degree = 0; }
            if (parent.transform.degree === 0 || parent.transform.degree === 180) {
                if (parent.activeObj.textSettings.fontSize > actPoint.height) {
                    parent.activeObj.textSettings.fontSize = actPoint.height -
                        (actPoint.height * 0.1);
                }
            }
            else {
                if (parent.activeObj.textSettings.fontSize > actPoint.width) {
                    parent.activeObj.textSettings.fontSize = actPoint.width -
                        (actPoint.width * 0.1);
                }
            }
            canvasDraw.strokeStyle = parent.activeObj.strokeSettings.strokeColor;
            canvasDraw.fillStyle = parent.activeObj.strokeSettings.strokeColor;
            let textStyle: string = '';
            if (parent.activeObj.textSettings.bold) {textStyle = 'bold '; }
            if (parent.activeObj.textSettings.italic) {textStyle = 'italic '; }
            if (parent.activeObj.textSettings.bold && parent.activeObj.textSettings.italic) {textStyle = 'italic bold '; }
            canvasDraw.font = textStyle + parent.activeObj.textSettings.fontSize + 'px' + ' ' +
            parent.activeObj.textSettings.fontFamily;
            if (parent.activeObj.flipObjColl.length === 4) {
                parent.activeObj.flipObjColl = [];
            }
            for (let j: number = 0, len: number = parent.activeObj.flipObjColl.length; j < len; j++) {
                if (parent.activeObj.flipObjColl[j as number].toLowerCase() === 'horizontal') {
                    canvasDraw.translate(canvasDraw.canvas.width, 0); canvasDraw.scale(-1, 1);
                    this.updateActPoint('horizontal', canvasDraw);
                } else if (parent.activeObj.flipObjColl[j as number].toLowerCase() === 'vertical') {
                    canvasDraw.translate(0, canvasDraw.canvas.height); canvasDraw.scale(1, -1);
                    this.updateActPoint('vertical', canvasDraw);
                }
            }
            if (parent.activeObj.shapeDegree !== parent.transform.degree) {
                this.rotateText(canvasDraw);
            } else {
                canvasDraw.fillText(text, actPoint.startX + parent.activeObj.textSettings.fontSize * 0.1,
                                    actPoint.startY + yPoint);
            }
            for (let k: number = 0, len: number = parent.activeObj.flipObjColl.length; k < len; k++) {
                if (parent.activeObj.flipObjColl[k as number].toLowerCase() === 'horizontal') {
                    canvasDraw.translate(canvasDraw.canvas.width, 0); canvasDraw.scale(-1, 1);
                    this.updateActPoint('horizontal', canvasDraw);
                } else if (parent.activeObj.flipObjColl[k as number].toLowerCase() === 'vertical') {
                    canvasDraw.translate(0, canvasDraw.canvas.height); canvasDraw.scale(1, -1);
                    this.updateActPoint('vertical', canvasDraw);
                }
            }
        }
        parent.currObjType.isText = false;
    }

    private updateActPoint(degree: string, canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        if (degree.toLowerCase() === 'horizontal') {
            if (actPoint.startX <= canvasDraw.canvas.width / 2) {
                actPoint.startX = canvasDraw.canvas.width / 2 + ((canvasDraw.canvas.width / 2) -
                    actPoint.endX);
                actPoint.endX = actPoint.startX +
                    actPoint.width;
                this.updateActiveObject(actPoint, parent.activeObj);
            } else if (actPoint.startX >= canvasDraw.canvas.width / 2) {
                actPoint.startX = canvasDraw.canvas.width - actPoint.endX;
                actPoint.endX = actPoint.startX +
                    actPoint.width;
                this.updateActiveObject(actPoint, parent.activeObj);
            }
        }
        else if (degree.toLowerCase() === 'vertical') {
            if (actPoint.startY <= canvasDraw.canvas.height / 2) {
                actPoint.startY = canvasDraw.canvas.height / 2 + ((canvasDraw.canvas.height / 2) - actPoint.endY);
                actPoint.endY = actPoint.startY + actPoint.height;
                this.updateActiveObject(actPoint, parent.activeObj);
            } else if (actPoint.startY >= canvasDraw.canvas.height / 2) {
                actPoint.startY = canvasDraw.canvas.height - actPoint.endY;
                actPoint.endY = actPoint.startY + actPoint.height;
                this.updateActiveObject(actPoint, parent.activeObj);
            }
        }
    }

    private rotateText(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        let startX: number = parent.activeObj.activePoint.startX;
        let startY: number = parent.activeObj.activePoint.startY;
        let degree: number;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        if (parent.activeObj.shapeDegree === 0) {degree = parent.transform.degree; }
        else {degree = parent.transform.degree - parent.activeObj.shapeDegree; }
        if (degree < 0) {degree = 360 + degree; }
        if (degree % 360 === 0 && (parent.transform.degree !== -360 || parent.transform.currFlipState === '')) {
            startX = actPoint.startX + parent.activeObj.textSettings.fontSize * 0.15;
            startY = actPoint.startY + (actPoint.endY - actPoint.startY);
            const rows: string[] = parent.activeObj.keyHistory.split('\n');
            for (let i: number = 0; i < rows.length; i++) {
                startY = actPoint.startY + (i * parent.activeObj.textSettings.fontSize + parent.activeObj.textSettings.fontSize * 0.25);
                canvasDraw.fillText(rows[i as number], startX, startY);
            }
        }
        else if (degree % 90 === 0 && degree % 180 !== 0) {
            canvasDraw.translate(parent.lowerCanvas.width / 2, parent.lowerCanvas.height / 2);
            canvasDraw.rotate(Math.PI / 180 * degree);
            canvasDraw.translate(-parent.lowerCanvas.height / 2, -parent.lowerCanvas.width / 2);
            if (degree % 90 === 0 && degree % 270 !== 0) {
                startY = (parent.lowerCanvas.width - actPoint.endX) +
                parent.activeObj.textSettings.fontSize * 0.4;
                startX = actPoint.startY;
            }
            else if (degree % 270 === 0) {
                startX = parent.lowerCanvas.height - actPoint.endY;
                startY = actPoint.startX + parent.activeObj.textSettings.fontSize * 0.4;
            }
            this.textFlipDegree(canvasDraw, startX, startY);
            canvasDraw.translate(parent.lowerCanvas.height / 2, parent.lowerCanvas.width / 2);
            canvasDraw.rotate(Math.PI / 180 * -degree);
            canvasDraw.translate(-parent.lowerCanvas.width / 2, -parent.lowerCanvas.height / 2);
        }
        else {
            canvasDraw.translate(parent.lowerCanvas.width / 2, parent.lowerCanvas.height / 2);
            canvasDraw.rotate(Math.PI / 180 * degree);
            startX = parent.lowerCanvas.width - actPoint.endX;
            startY = (parent.lowerCanvas.height - actPoint.endY) +
            parent.activeObj.textSettings.fontSize * 0.4;
            canvasDraw.translate(-parent.lowerCanvas.width / 2, -parent.lowerCanvas.height / 2);
            this.textFlipDegree(canvasDraw, startX, startY);
            canvasDraw.translate(parent.lowerCanvas.width / 2, parent.lowerCanvas.height / 2);
            canvasDraw.rotate(Math.PI / 180 * -degree);
            canvasDraw.translate(-parent.lowerCanvas.width / 2, -parent.lowerCanvas.height / 2);
        }
        if (parent.transform.degree === 360 || parent.transform.degree === -360) {
            parent.transform.degree = 0;
        }
    }

    private textFlipDegree(canvasDraw: CanvasRenderingContext2D, startX: number, startY: number): void {
        const parent: ImageEditor = this.parent;
        const rows: string[] = parent.activeObj.keyHistory.split('\n');
        const height: number = parent.activeObj.textSettings.fontSize;
        const lineHeight: number = ((height * rows.length) - (parent.activeObj.textSettings.fontSize * rows.length)) / rows.length;
        let yPoint: number = (parent.activeObj.textSettings.fontSize * 0.85) + lineHeight;
        for (let i: number = 0; i < rows.length; i++) {
            const text: string = rows[i as number];
            if (i > 0) {
                if (i === 1) {
                    yPoint -= (parent.activeObj.textSettings.fontSize * 0.85);
                }
                yPoint += parent.activeObj.textSettings.fontSize + parent.activeObj.textSettings.fontSize * 0.15;
            }
            canvasDraw.fillText(text, startX + parent.activeObj.textSettings.fontSize * 0.15, startY +
                yPoint + (i > 0 ? parent.activeObj.textSettings.fontSize * 0.25 : -parent.activeObj.textSettings.fontSize * 0.35));
        }
    }

    private clearOuterCanvas(context: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
        if (parent.img.destWidth < parent.lowerCanvas.width) {
            const left: number = parent.img.destLeft > 0 ? parent.img.destLeft : 0;
            context.clearRect(0, 0, left, parent.lowerCanvas.height);
            context.clearRect(parent.img.destLeft + parent.img.destWidth, 0, left, parent.lowerCanvas.height);
        }
        if (parent.img.destHeight < parent.lowerCanvas.height) {
            const top: number = parent.img.destTop > 0 ? parent.img.destTop : 0;
            context.clearRect(0, 0, parent.lowerCanvas.width, top);
            context.clearRect(0, parent.img.destTop + parent.img.destHeight, parent.lowerCanvas.width, top);
        }
        if (parent.transform.currFlipState !== '') {
            parent.img.destLeft = destLeft; parent.img.destTop = destTop;
        }
    }

    private setDestPoints(): void {
        let maxDimension: Dimension; const parent: ImageEditor = this.parent;
        if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
            const obj: Object = {width: 0, height: 0 };
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
                value: {width: parent.img.srcHeight, height: parent.img.srcWidth, obj: obj}});
            maxDimension = obj as Dimension;
            if (this.isRotateZoom) {
                maxDimension.width += (maxDimension.width * parent.transform.zoomFactor);
                maxDimension.height += (maxDimension.height * parent.transform.zoomFactor);
                parent.img.destWidth = maxDimension.height; parent.img.destHeight = maxDimension.width;
            }
            parent.img.destLeft = (parent.lowerCanvas.clientWidth - maxDimension.height) / 2;
            parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.width) / 2;
            parent.img.destWidth = maxDimension.height; parent.img.destHeight = maxDimension.width;
        } else {
            const obj: Object = {width: 0, height: 0 };
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
                value: {width: parent.img.srcWidth, height: parent.img.srcHeight, obj: obj}});
            maxDimension = obj as Dimension;
            if (this.isRotateZoom) {
                maxDimension.width += (maxDimension.width * parent.transform.zoomFactor);
                maxDimension.height += (maxDimension.height * parent.transform.zoomFactor);
                parent.img.destWidth = maxDimension.width; parent.img.destHeight = maxDimension.height;
            }
            parent.img.destLeft = (parent.lowerCanvas.clientWidth - maxDimension.width) / 2;
            parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.height) / 2;
            parent.img.destWidth = maxDimension.width; parent.img.destHeight = maxDimension.height;
        }
    }

    private updateCurrTransState(type: string, isPreventDestination?: boolean, isRotatePan?: boolean): void {
        const parent: ImageEditor = this.parent;
        const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
        if (type === 'initial') {
            this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
            if (isNullOrUndefined(isPreventDestination)) {this.setDestPoints(); }
        }
        this.currTransState(type, null, null, isRotatePan);
        if (parent.transform.degree === 0 && parent.transform.currFlipState === '') {
            parent.img.destLeft = destLeft; parent.img.destTop = destTop;
        }
        if (parent.isCircleCrop || (parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle')) {
            if (isRotatePan) {
                parent.img.destLeft += parent.panPoint.totalPannedClientPoint.x; parent.img.destTop +=
                parent.panPoint.totalPannedClientPoint.y;
            }
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
            if (isRotatePan) {
                parent.img.destLeft -= parent.panPoint.totalPannedClientPoint.x; parent.img.destTop -=
                parent.panPoint.totalPannedClientPoint.y;
            }
        }
    }

    private currTransState(type: string, isPreventDimension?: boolean, context?: CanvasRenderingContext2D,
                                    isPreventCircleCrop?: boolean): void {
        const parent: ImageEditor = this.parent;
        context = context ? context : this.lowerContext;
        if (type === 'initial') {
            this.setTransformColl(context, type);
        } else if (type === 'reverse') {
            this.setTransformColl(context, type); this.setClientTransDim(isPreventDimension);
            if (parent.isCircleCrop || (parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle'
            && isNullOrUndefined(isPreventCircleCrop))) {
                if (isPreventCircleCrop) {
                    parent.img.destLeft += parent.panPoint.totalPannedClientPoint.x;
                    parent.img.destTop += parent.panPoint.totalPannedClientPoint.y;
                }
                parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                    value: {context: this.lowerContext, isSave: null, isFlip: null}});
                if (isPreventCircleCrop) {
                    parent.img.destLeft -= parent.panPoint.totalPannedClientPoint.x;
                    parent.img.destTop -= parent.panPoint.totalPannedClientPoint.y;
                }
            }
        }
    }

    private setTransformColl(context: CanvasRenderingContext2D, type: string): void {
        const parent: ImageEditor = this.parent;
        if (type === 'initial') {
            for (let i: number = 0, len: number = parent.rotateFlipColl.length; i < len; i++) {
                this.setTransform(context, parent.rotateFlipColl[i as number]);
            }
        } else if (type === 'reverse') {
            for (let i: number = parent.rotateFlipColl.length - 1; i >= 0; i--) {
                this.setTransform(context, parent.rotateFlipColl[i as number], true);
            }
        }
    }

    private setTransform(context: CanvasRenderingContext2D, value: number | string, isReverse?: boolean): void {
        const parent: ImageEditor = this.parent;
        if (isReverse && value === 90) {value = -90; }
        else if (isReverse && value === -90) {value = 90; }
        if (value === 'horizontal' && parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
            value = 'vertical';
        }
        else if (value === 'vertical' && parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
            value = 'horizontal';
        }
        parent.notify('transform', { prop: 'setReverseRotate', onPropertyChange: false, value: {bool: true}});
        parent.notify('transform', { prop: 'setReverseFlip', onPropertyChange: false, value: {isReverseFlip: true }});
        if (isNullOrUndefined(isReverse)) {context.clearRect(0, 0, context.canvas.width, context.canvas.height); }
        switch (value) {
        case 90:
        case -90:
            context.translate(context.canvas.width / 2, context.canvas.height / 2);
            context.rotate(Math.PI / 180 * value);
            context.translate(-context.canvas.width / 2, -context.canvas.height / 2);
            break;
        case 'horizontal':
            context.translate(context.canvas.width, 0);
            context.scale(-1, 1);
            break;
        case 'vertical':
            context.translate(0, context.canvas.height);
            context.scale(1, -1);
            break;
        }
        parent.notify('transform', { prop: 'setReverseRotate', onPropertyChange: false, value: {bool: false}});
        parent.notify('transform', { prop: 'setReverseFlip', onPropertyChange: false, value: {isReverseFlip: false }});
    }

    private drawImgToCanvas(maxDimension: Dimension): void {
        const parent: ImageEditor = this.parent;
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        parent.img.destWidth = maxDimension.width; parent.img.destHeight = maxDimension.height;
        if (this.isInitialLoading) {
            parent.notify('filter', { prop: 'initFilter', onPropertyChange: false});
            this.isInitialLoading = false;
        }
        const temp: string = this.lowerContext.filter;
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
        if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
        }
        this.lowerContext.filter = temp;
    }

    private renderImage(isMouseWheel?: boolean): void {
        const parent: ImageEditor = this.parent;
        const temp: string = this.lowerContext.filter;
        parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: null}});
        this.upperContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        if (isMouseWheel) {this.setTransformColl(this.lowerContext, 'initial'); }
        else {
            if (parent.transform.zoomFactor > 0) {this.isRotateZoom = true; }
            this.updateCurrTransState('initial');
        }
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        parent.notify('transform', { prop: 'setDestPointsForFlipState', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
        parent.notify('transform', { prop: 'setDestPointsForFlipState', onPropertyChange: false});
        if (isMouseWheel) {this.setTransformColl(this.lowerContext, 'reverse'); }
        else {
            this.updateCurrTransState('reverse'); this.isRotateZoom = false;
        }
        this.lowerContext.filter = 'none';
        parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
        parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
            value: {context: this.lowerContext, points: null} });
        this.lowerContext.filter = temp;
        if (parent.isCircleCrop || (parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle')) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
        }
    }

    private imageOnLoad(src: string): void {
        const parent: ImageEditor = this.parent;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: Draw = this;
        parent.baseImg.src = src;
        parent.baseImg.onload = () => {
            parent.notify('filter', { prop: 'update-finetunes', onPropertyChange: false });
            proxy.lowerContext.drawImage(parent.baseImg, 0, 0, proxy.parent.lowerCanvas.width, proxy.parent.lowerCanvas.height);
            hideSpinner(parent.element); parent.element.style.opacity = '1'; proxy.updateCanvas();
            if (parent.currObjType.isUndoZoom) {
                parent.currObjType.isUndoZoom = false; proxy.parent.lowerCanvas.style.display = 'block';
            }
            parent.isUndoRedo = this.isErrorImage = false;
            if (!isBlazor()) {
                if (Browser.isDevice) {
                    parent.notify('toolbar', {prop: 'destroy-top-toolbar', onPropertyChange: false});
                    parent.notify('toolbar', {prop: 'destroy-bottom-toolbar', onPropertyChange: false});
                    const eventargs: object = { isApplyBtn: false, isDevice: Browser.isDevice, isOkBtn: null };
                    parent.notify('toolbar', { prop: 'init-main-toolbar', onPropertyChange: false, value: eventargs});
                    parent.notify('toolbar', { prop: 'create-bottom-toolbar', onPropertyChange: false});
                } else {
                    parent.notify('toolbar', {prop: 'destroy-top-toolbar', onPropertyChange: false});
                    const eventargs: object = { isApplyBtn: false, isDevice: false, isOkBtn: null };
                    parent.notify('toolbar', { prop: 'init-main-toolbar', onPropertyChange: false, value: eventargs});
                }
            } else {
                parent.updateToolbar(parent.element, 'imageLoaded', 'initial');
                if (Browser.isDevice) {
                    (parent.element.querySelector('.e-bottom-toolbar-area') as HTMLElement).style.display = 'block';
                    (parent.element.querySelector('.e-canvas-wrapper') as HTMLElement).style.height = (parent.element.offsetHeight
                        - parent.toolbarHeight * 2) - 3 + 'px';
                }
            }
        };
        parent.baseImg.onerror = () => {
            hideSpinner(parent.element);
            // proxy.reset();
            // proxy.parent.baseImg.src = proxy.baseImgSrc;
            proxy.isErrorImage = true;
            proxy.errorLoading();
        };
    }

    private errorLoading(): void {
        const parent: ImageEditor = this.parent;
        const fileOpened: OpenEventArgs = {fileName: null, fileType: null, isValidImage: false };
        if (isBlazor() && parent.events && parent.events.fileOpened.hasDelegate === true) {
            parent.dotNetRef.invokeMethodAsync('FileOpenEventAsync', 'FileOpened', fileOpened);
        } else {
            parent.trigger('fileOpened', fileOpened);
        }
    }

    private updateCanvas(): void {
        const parent: ImageEditor = this.parent;
        const fileOpened: OpenEventArgs = {fileName: this.fileName, fileType: this.fileType, isValidImage: true };
        parent.img.srcWidth = parent.baseImg.width; parent.img.srcHeight = parent.baseImg.height;
        const obj: Object = {width: 0, height: 0 };
        parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: parent.img.srcWidth, height: parent.img.srcHeight, obj: obj}});
        const maxDimension: Dimension = obj as Dimension;
        parent.img.destLeft = (parent.lowerCanvas.clientWidth - maxDimension.width) / 2;
        parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.height) / 2;
        this.drawImgToCanvas(maxDimension);
        this.zoomCrop.width = parent.img.destWidth; this.zoomCrop.height = parent.img.destHeight;
        parent.notify('transform', { prop: 'setCropDimension', onPropertyChange: false,
            value: {width: parent.img.destWidth, height: parent.img.destHeight}});
        const point: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
            height: parent.img.destHeight};
        parent.notify('crop', { prop: 'setCropDestPoints', onPropertyChange: false, value: {point: point }});
        const temp: string = this.lowerContext.filter;
        this.lowerContext.filter = 'none';
        parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
        parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
        this.lowerContext.filter = temp;
        if (parent.img.destWidth > 0 && parent.img.destHeight > 0) {parent.isImageLoaded = true; }
        if (parent.isUndoRedo) {
            if (parent.transform.currFlipState !== '') {
                parent.notify('transform', { prop: 'flipImage', onPropertyChange: false,
                    value: {direction: parent.toPascalCase(parent.transform.currFlipState) as Direction}});
            }
        }
        if (parent.disabled) { parent.element.setAttribute('class', 'e-disabled'); }
        if (parent.isImageLoaded && parent.element.style.opacity !== '0.5') {
            if (isBlazor() && parent.events && parent.events.fileOpened.hasDelegate === true) {
                parent.dotNetRef.invokeMethodAsync('FileOpenEventAsync', 'FileOpened', fileOpened);
            } else {
                parent.trigger('fileOpened', fileOpened);
            }
        }
        if (parent.zoomSettings.zoomFactor !== 1 || parent.zoomSettings.zoomPoint) {
            parent.zoom(parent.zoomSettings.zoomFactor, parent.zoomSettings.zoomPoint);
        }
        if (isNullOrUndefined(this.initZoomValue)) {this.initZoomValue = parent.zoomSettings.zoomFactor; }
        this.isImageEdited = false;
    }

    private performCancel(isContextualToolbar?: boolean): void {
        const parent: ImageEditor = this.parent;
        isContextualToolbar = isContextualToolbar ? isContextualToolbar : false;
        const obj: Object = {bool: false };
        parent.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: obj }});
        if (obj['bool']) {
            parent.notify('freehand-draw', {prop: 'cancelFhd', onPropertyChange: false});
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
            } else {
                parent.updateToolbar(parent.element, 'destroyQuickAccessToolbar');
            }
            parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel' }});
        } else if (parent.textArea.style.display === 'block') {
            parent.textArea.style.display = 'none'; parent.textArea.value = ''; parent.textArea.style.transform = '';
            if (this.prevActObj) {
                parent.activeObj = this.prevActObj; this.prevActObj = null;
            } else {
                parent.activeObj.strokeSettings = this.tempStrokeSettings; parent.activeObj.textSettings = this.tempTextSettings;
            }
            parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel' }});
            if (this.isShapeTextInserted) {
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            }
            parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: true}});
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
            } else {
                parent.updateToolbar(parent.element, 'imageLoaded');
            }
        } else if ((!isBlazor() && document.querySelector('#' + parent.element.id + '_sliderWrapper')) || (isBlazor() && !parent.element.querySelector('.e-ie-contextual-slider').classList.contains('e-hidden')) ||
            parent.currObjType.isFiltered) {
            this.lowerContext.filter = this.tempAdjValue; parent.canvasFilter = this.tempAdjValue;
            parent.notify('filter', { prop: 'setAdjustmentValue', onPropertyChange: false, value: {adjustmentValue: this.tempAdjValue }});
            parent.initialAdjustmentValue = this.tempAdjValue;
            if (this.lowerContext.filter.split(' ').length > 1 &&
                this.lowerContext.filter.split(' ')[0].split('(')[1].split(')')[0] === '1') {
                parent.notify('filter', { prop: 'setBrightnessAdjusted', onPropertyChange: false, value: {isBrightnessAdjusted: false }});
            }
            parent.currentFilter = this.tempFilter;
            this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
            this.redrawImgWithObj(); parent.currObjType.isFiltered = false;
            const obj: Object = {tempAdjustmentLevel: null };
            parent.notify('filter', { prop: 'getTempAdjustmentLevel', onPropertyChange: false, value: {obj: obj }});
            parent.notify('filter', { prop: 'setAdjustmentLevel', onPropertyChange: false,
                value: {adjustmentLevel: extend({}, obj['tempAdjustmentLevel'], {}, true )}});
            parent.notify('undo-redo', { prop: 'setUndoRedoStep', onPropertyChange: false, value: {step: this.tempUndoRedoStep }});
            parent.upperCanvas.style.cursor = parent.cursor = 'default'; parent.currObjType.isCustomCrop = false;
            this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
            this.clearOuterCanvas(this.lowerContext);
            if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
                parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                    value: {context: this.lowerContext, isSave: null, isFlip: null}});
            }
            const eventargs: object = { type: 'main', isApplyBtn: null, isCropping: null, isZooming: null};
            if (!isBlazor()) {
                parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
                parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
            } else {
                parent.updateToolbar(parent.element, 'imageLoaded');
            }
            parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel' }});
        } else {
            if (isContextualToolbar) {
                const eventargs: object = { type: 'main', isApplyBtn: null, isCropping: null, isZooming: null};
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
                } else {
                    parent.updateToolbar(parent.element, 'imageLoaded');
                }
            } else {
                this.cancelItems(); parent.togglePan = false;
                parent.notify('selection', {prop: 'setDragCanvas', value: {bool: false }});
            }
        }
        this.isShapeTextInserted = false;
        this.isNewPath = false;
        if (!isBlazor()) {
            parent.notify('toolbar', {prop: 'refresh-dropdown-btn', value: {isDisabled: false}});
            parent.notify('toolbar', {prop: 'setCurrentToolbar', value: {type: 'main' }});
        }
    }

    private cancelItems(): void {
        const parent: ImageEditor = this.parent; let isCropSelection: boolean = false;
        let splitWords: string[]; const shapes: string[] = ['rectangle', 'ellipse', 'line', 'arrow', 'path'];
        if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
        if (splitWords === undefined && parent.currObjType.isCustomCrop) {isCropSelection = true; }
        else if (splitWords !== undefined && splitWords[0] === 'crop'){isCropSelection = true; }
        if (isCropSelection && parent.isCropTab) {
            parent.isCropTab = false;
            parent.transform.zoomFactor = parent.transform.defaultZoomFactor;
        }
        if (parent.togglePen) {
            this.cancelPen();
        } else if (parent.activeObj.shape === 'text') {
            this.cancelText(isCropSelection);
        } else if (shapes.indexOf(parent.activeObj.shape) !== -1) {
            this.cancelShape();
        } else if (isCropSelection) {
            this.cancelSelection();
        } else {
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel' }});
        }
        parent.notify('selection', { prop: 'setCurrentDrawingShape', onPropertyChange: false, value: {value: '' }});
        parent.upperCanvas.style.cursor = parent.cursor = 'default'; parent.currObjType.isCustomCrop = false;
        this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
        const eventargs: object = { type: 'main', isApplyBtn: null, isCropping: false, isZooming: null};
        if (!isBlazor()) {parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs}); }
        else {parent.updateToolbar(parent.element, 'imageLoaded'); }
    }

    private cancelPen(): void {
        const parent: ImageEditor = this.parent;
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.togglePen = false;
        parent.upperCanvas.style.cursor = parent.cursor = 'default';
        // eslint-disable-next-line
        const tempPointsColl: any = extend([], parent.pointColl, [], true);
        parent.pointColl = {};
        for (let i: number = 0; i < this.tempFreehandCounter; i++) {
            parent.pointColl[i as number] = tempPointsColl[i as number];
        }
        parent.freehandCounter = this.tempFreehandCounter;
        parent.notify('freehand-draw', {prop: 'setCurrentFreehandDrawIndex', value: {value: this.tempCurrFhdIndex}});
        parent.activeObj.strokeSettings = this.tempStrokeSettings;
        parent.notify('shape', {prop: 'setStrokeSettings',
            value: {strokeSettings: parent.activeObj.strokeSettings, strokeColor: null, fillColor: null, strokeWidth: null }});
        parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel'}});
        parent.notify('selection', {prop: 'setFreehandDrawCustomized', value: {isFreehandDrawCustomized: false }});
    }

    private cancelText(isCropSelection: boolean): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', { prop: 'setTextSettings', onPropertyChange: false,
            value: {textSettings: this.tempTextSettings, fontFamily: null, fontSize: null }});
        parent.notify('shape', {prop: 'setStrokeSettings',
            value: {strokeSettings: this.tempStrokeSettings, strokeColor: null, fillColor: null, strokeWidth: null }});
        if (isNullOrUndefined(parent.activeObj.currIndex)) {
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        } else {
            const object: Object = {appliedUndoRedoColl: [] as Transition[] };
            parent.notify('undo-redo', {prop: 'getAppliedUndoRedoColl', value: {obj: object }});
            const len: number = object['appliedUndoRedoColl'].length;
            if (this.prevActObj && object['appliedUndoRedoColl'][len - 1] &&
            object['appliedUndoRedoColl'][len - 1].currentObjColl[object['appliedUndoRedoColl'][len - 1].currentObjColl.length - 1].currIndex
            === this.prevActObj.currIndex) {
                parent.activeObj = this.prevActObj;
                this.prevActObj = null;
            } else {
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            }
            if (parent.activeObj.shape && parent.activeObj.keyHistory === 'Enter Text') {
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                parent.notify('shape', { prop: 'draw-shape-text' });
                parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel' }});
                parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: true}});
            } else if (parent.activeObj.shape) {
                parent.notify('shape', { prop: 'redraw-text' });
                parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false, value: {obj: parent.activeObj}});
                if (!isCropSelection && parent.activeObj.topLeftCircle !== undefined) {
                    parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: true}});
                }
                parent.clearSelection();
            }
        }
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
        } else {
            parent.updateToolbar(parent.element, 'destroyQuickAccessToolbar');
        }
        this.tempTextSettings = {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false,
            italic: false, underline: false};
    }

    private cancelShape(): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', {prop: 'setStrokeSettings',
            value: {strokeSettings: this.tempStrokeSettings, strokeColor: null, fillColor: null, strokeWidth: null }});
        if (isNullOrUndefined(parent.activeObj.currIndex)) {
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        } else if (this.isNewPath) {
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            this.renderImage();
        } else {
            const object: Object = {appliedUndoRedoColl: [] as Transition[] };
            parent.notify('undo-redo', {prop: 'getAppliedUndoRedoColl', value: {obj: object }});
            const len: number = object['appliedUndoRedoColl'].length;
            if (this.prevActObj && object['appliedUndoRedoColl'][len - 1] &&
            object['appliedUndoRedoColl'][len - 1].currentObjColl[object['appliedUndoRedoColl'][len - 1].currentObjColl.length - 1].currIndex
                === this.prevActObj.currIndex) {
                parent.activeObj = this.prevActObj;
                this.prevActObj = null;
                parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false, value: {obj: parent.activeObj}});
                parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel' }});
                parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: true}});
            } else {
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            }
        }
        parent.currObjType.isDragging = false;
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
        } else {
            parent.updateToolbar(parent.element, 'destroyQuickAccessToolbar');
        }
    }

    private cancelSelection(): void {
        const parent: ImageEditor = this.parent;
        if (parent.cancelCropSelection) {
            parent.cropObj = extend({}, parent.cancelCropSelection.previousCropObj, {}, true) as CurrentObject;
            parent.afterCropActions = parent.cancelCropSelection.previousObj.afterCropActions;
            parent.notify('undo-redo', { prop: 'undoDefault', onPropertyChange: false, value: {obj: parent.cancelCropSelection }});
            parent.currSelectionPoint = extend({}, parent.cancelCropSelection.previousCropObj.activeObj, true) as SelectionPoint;
            if (parent.currSelectionPoint && isNullOrUndefined(parent.currSelectionPoint.shape)) {
                parent.currSelectionPoint = null;
            }
            this.clearOuterCanvas(this.lowerContext);
            if (parent.isCircleCrop || (parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle')) {
                parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                    value: {context: this.lowerContext, isSave: null, isFlip: null}});
            }
        }
    }

    private updateFlipPan(tempSelectionObj?: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.currFlipState !== '') {
            const temp: string = this.lowerContext.filter;
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.notify('transform', { prop: 'rotatedFlip', onPropertyChange: false});
            this.lowerContext.filter = 'none';
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
            this.lowerContext.filter = temp;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            if (tempSelectionObj) {
                this.drawObject('duplicate', tempSelectionObj);
            }
        }
    }

    private select(type: string, startX?: number, startY?: number, width?: number, height?: number): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            const object: Object = {currObj: {} as CurrentObject };
            parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
            const previousObj: CurrentObject = object['currObj'];
            previousObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
            previousObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
            previousObj.afterCropActions = parent.afterCropActions;
            const selPointCollObj: Object = {selPointColl: null };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                value: {obj: selPointCollObj }});
            previousObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
            parent.notify('crop', { prop: 'setPreviousCropCurrentObj', onPropertyChange: false, value: {obj: previousObj }});
            if (parent.transform.zoomFactor > 0 && parent.activeObj.shape && parent.activeObj.shape.split('-')[0] === 'crop' && isNullOrUndefined(this.currSelPoint)) {
                this.currSelPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            }
            let isPrevent: boolean = false; let splitWords: string[];
            if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
            if (splitWords === undefined && parent.currObjType.isCustomCrop) {
                isPrevent = true;
            } else if (splitWords !== undefined && splitWords[0] === 'crop'){
                isPrevent = true;
            }
            const obj: Object = {currObj: {} as CurrentObject };
            parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: obj }});
            const prevObj: CurrentObject = obj['currObj'];
            prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
            prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
            prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
            parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: {x: null, y: null, isMouseDown: null}});
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.notify('shape', { prop: 'setKeyHistory', onPropertyChange: false, value: {keyHistory: '' }});
            this.upperContext.clearRect(0, 0 , parent.upperCanvas.width, parent.upperCanvas.height);
            parent.upperCanvas.style.display = 'block';
            if (parent.currSelectionPoint || parent.transform.defaultZoomFactor !== 0 ||
                (parent.transform.degree !== 0 && parent.panPoint.totalPannedInternalPoint.x !== 0 &&
                    parent.panPoint.totalPannedInternalPoint.y !== 0 && !isPrevent)) {
                parent.isCircleCrop = false;
                if (parent.transform.defaultZoomFactor !== 0) {
                    const isCropTab: boolean = parent.isCropTab; parent.isCropTab = false;
                    parent.notify('transform', { prop: 'resetZoom', onPropertyChange: false});
                    parent.isCropTab = isCropTab; this.resetPanPoints();
                }
                this.cancelObjColl = extend([], parent.objColl, [], true) as SelectionPoint[];
                this.cancelPointColl = extend([], parent.pointColl, [], true) as Point[];
                parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
                parent.isCropTab = true; parent.isCircleCrop = false;
                parent.notify('crop', { prop: 'setCurrSelPoints', onPropertyChange: false, value: {isSetDimension: true}});
                parent.transform.zoomFactor = parent.transform.cropZoomFactor;
                if (isNullOrUndefined(parent.cropObj.activeObj.shape)) {
                    parent.currObjType.shape = 'crop-' + type.toLowerCase();
                    this.drawNewSelection(type, startX, startY, width, height);
                }
            } else {
                if (type === 'custom') {parent.currObjType.shape = ''; }
                this.drawNewSelection(type, startX, startY, width, height);
            }
        }
    }

    private drawNewSelection(type: string, startX?: number, startY?: number, width?: number, height?: number): void {
        const parent: ImageEditor = this.parent; let points: ActivePoint; const cropShape: string = 'crop-' + type;
        if (cropShape.toLowerCase() === 'crop-custom') {
            if (parent.currObjType.shape === '' || parent.currObjType.shape === 'crop-custom') {
                this.drawCustomSelection('crop-custom', startX, startY, width, height);
            }
        } else if (cropShape.toLowerCase() === 'crop-canvas') {
            parent.upperCanvas.style.display = 'block';
            parent.notify('selection', {prop: 'setDragCanvas', value: {bool: true }});
        } else {
            parent.currObjType.isCustomCrop = false;
            parent.currObjType.shape = cropShape.toLowerCase();
            if (width && height) {
                points = {startX : startX, startY : startY, endX : startX + width, endY : startY + height,
                    width: width, height: height};
            } else if (width && cropShape === 'crop-circle') {
                points = {startX : startX, startY : startY, endX : startX + width, endY : startY + width,
                    width: width, height: width};
            }
            parent.activeObj.shape = cropShape.toLowerCase();
            this.updateSelectionInsert(points);
        }
    }

    private updateSelectionInsert(points?: ActivePoint): void {
        const parent: ImageEditor = this.parent;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        const obj: Object = {shapeSettingsObj: {} as ShapeSettings };
        parent.notify('selection', { prop: 'updatePrevShapeSettings', onPropertyChange: false, value: {obj: obj}});
        const selectionSettings: CropSelectionSettings = {type: parent.getSelectionType(obj['shapeSettingsObj']['type']), startX: obj['shapeSettingsObj']['startX'],
            startY: obj['shapeSettingsObj']['startY'], width: obj['shapeSettingsObj']['width'], height: obj['shapeSettingsObj']['height'] };
        const selectionChangingArgs: SelectionChangeEventArgs = {action: 'insert', previousSelectionSettings: selectionSettings,
            currentSelectionSettings: selectionSettings};
        if (isBlazor() && parent.events && parent.events.onSelectionResizeStart.hasDelegate === true) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('SelectionEventAsync', 'OnSelectionResizeStart', selectionChangingArgs) as any).then((selectionChangingArgs: SelectionChangeEventArgs) => {
                parent.notify('shape', { prop: 'updSelChangeEventArgs', onPropertyChange: false,
                    value: {selectionSettings: selectionChangingArgs.currentSelectionSettings}});
                if (selectionChangingArgs.currentSelectionSettings.type === 'Custom') {
                    this.drawObject('duplicate', parent.activeObj, null, null, true);
                } else {
                    if (actPoint.startX !== 0 || actPoint.startY !== 0 ||
                        actPoint.width !== 0 || actPoint.height !== 0) {
                        points = {startX : actPoint.startX, startY : actPoint.startY,
                            endX : actPoint.endX, endY : actPoint.endY,
                            width: actPoint.width, height: actPoint.height};
                    }
                    this.drawObject('duplicate', null, true, points);
                }
            });
        } else {
            parent.trigger('selectionChanging', selectionChangingArgs);
            parent.notify('shape', { prop: 'updSelChangeEventArgs', onPropertyChange: false,
                value: {selectionSettings: selectionChangingArgs.currentSelectionSettings}});
            if (selectionChangingArgs.currentSelectionSettings.type === 'Custom') {
                this.drawObject('duplicate', parent.activeObj, null, null, true);
            } else {
                if (actPoint.startX !== 0 || actPoint.startY !== 0 ||
                    actPoint.width !== 0 || actPoint.height !== 0) {
                    points = {startX : actPoint.startX, startY : actPoint.startY,
                        endX : actPoint.endX, endY : actPoint.endY,
                        width: actPoint.width, height: actPoint.height};
                }
                this.drawObject('duplicate', null, true, points);
            }
        }
    }

    private drawCustomSelection(cropShape: string, startX?: number, startY?: number, width?: number, height?: number): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        parent.currObjType.isCustomCrop = true;
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.currObjType.shape = parent.activeObj.shape = cropShape.toLowerCase();
        if (!isNullOrUndefined(startX) && !isNullOrUndefined(startY) && !isNullOrUndefined(width) && !isNullOrUndefined(height)) {
            actPoint.startX = startX; actPoint.startY = startY;
            actPoint.endX = startX + width; actPoint.endY = startY + height;
            actPoint.width = width; actPoint.height = height;
        } else {
            if (isNullOrUndefined(parent.transform.zoomFactor) || parent.transform.zoomFactor === 0) {
                const imgLeft: number = parent.img.destLeft; const imgTop: number = parent.img.destTop;
                const imgWidth: number = parent.img.destWidth; const imgHeight: number = parent.img.destHeight;
                const lowerCanvasWidth: number = parent.lowerCanvas.width; const lowerCanvasHeight: number = parent.lowerCanvas.height;
                const activePoint: ActivePoint = actPoint;
                if (imgLeft >= 0 && imgTop >= 0) {
                    activePoint.startX = imgLeft;
                    activePoint.startY = imgTop;
                    activePoint.endX = imgLeft + imgWidth;
                    activePoint.endY = imgTop + imgHeight;
                } else if (imgLeft >= 0) {
                    activePoint.startX = imgLeft;
                    activePoint.startY = 7.5;
                    activePoint.endX = imgLeft + imgWidth;
                    activePoint.endY = lowerCanvasHeight - 15;
                } else if (imgTop >= 0) {
                    activePoint.startX = 7.5;
                    activePoint.startY = imgTop;
                    activePoint.endX = lowerCanvasWidth - 15;
                    activePoint.endY = imgTop + imgHeight;
                } else {
                    activePoint.startX = 7.5;
                    activePoint.startY = 7.5;
                    activePoint.endX = lowerCanvasWidth - 15;
                    activePoint.endY = lowerCanvasHeight - 15;
                }
            } else {
                const imgLeft: number = parent.img.destLeft; const imgTop: number = parent.img.destTop;
                const imgWidth: number = parent.img.destWidth; const imgHeight: number = parent.img.destHeight;
                const lowerCanvasWidth: number = parent.lowerCanvas.width; const lowerCanvasHeight: number = parent.lowerCanvas.height;
                const activePoint: ActivePoint = actPoint;
                activePoint.startX = Math.max(imgLeft > 0 ? imgLeft : 7.5, imgLeft);
                activePoint.startY = Math.max(imgTop > 0 ? imgTop : 7.5, imgTop);
                activePoint.endX = Math.min(imgLeft + imgWidth + 15 < lowerCanvasWidth ? imgLeft + imgWidth - 15 :
                    lowerCanvasWidth - 15, imgLeft + imgWidth);
                activePoint.endY = Math.min(imgTop + imgHeight + 15 < lowerCanvasHeight ? imgTop + imgHeight - 15 :
                    lowerCanvasHeight - 15, imgTop + imgHeight);
            }
            const imgLeft: number = parent.img.destLeft; const imgTop: number = parent.img.destTop;
            const imgWidth: number = parent.img.destWidth; const imgHeight: number = parent.img.destHeight;
            const lowerCanvasWidth: number = parent.lowerCanvas.clientWidth;
            const lowerCanvasHeight: number = parent.lowerCanvas.clientHeight;
            const activePoint: ActivePoint = actPoint;
            activePoint.startX = Math.max(activePoint.startX, imgLeft);
            activePoint.startY = Math.max(activePoint.startY, imgTop);
            activePoint.endX = Math.min(activePoint.endX, imgLeft + imgWidth);
            activePoint.endY = Math.min(activePoint.endY, imgTop + imgHeight);
            if (activePoint.startX === imgLeft && imgLeft + imgWidth > lowerCanvasWidth) {
                activePoint.endX = lowerCanvasWidth - 15;
            }
            if (activePoint.startY === imgTop && imgTop + imgHeight > lowerCanvasHeight) {
                activePoint.endY = lowerCanvasHeight - 15;
            }
            parent.activeObj = this.updateWidthHeight(parent.activeObj);
            this.updateActiveObject(actPoint, parent.activeObj);
        }
        this.updateSelectionInsert();
    }

    private callUpdateCurrTransState(): void {
        const parent: ImageEditor = this.parent;
        const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        parent.objColl = []; parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        this.isRotateZoom = true;
        this.updateCurrTransState('initial');
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        if (parent.transform.degree === 0 && parent.rotateFlipColl.length > 0) {
            parent.img.destLeft += parent.panPoint.totalPannedPoint.x;
            parent.img.destTop += parent.panPoint.totalPannedPoint.y;
        }
        parent.img.destLeft += parent.panPoint.totalPannedInternalPoint.x; parent.img.destTop += parent.panPoint.totalPannedInternalPoint.y;
        const temp: string = this.lowerContext.filter;
        if (parent.transform.degree === 0) {
            parent.notify('transform', { prop: 'setDestPointsForFlipState', onPropertyChange: false});
        }
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
        this.updateCurrTransState('reverse');
        if (parent.transform.degree === 0 && parent.rotateFlipColl.length > 0) {
            parent.img.destLeft += parent.panPoint.totalPannedPoint.x;
            parent.img.destTop += parent.panPoint.totalPannedPoint.y;
        }
        this.isRotateZoom = false; parent.objColl = tempObjColl; const tempTogglePen: boolean = parent.togglePen;
        parent.togglePen = false; this.lowerContext.filter = 'none';
        parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
        parent.img.destLeft += parent.panPoint.totalPannedInternalPoint.x; parent.img.destTop += parent.panPoint.totalPannedInternalPoint.y;
        parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
            value: {context: this.lowerContext, points: null} });
        parent.img.destLeft -= parent.panPoint.totalPannedInternalPoint.x; parent.img.destTop -= parent.panPoint.totalPannedInternalPoint.y;
        parent.togglePen = tempTogglePen; this.lowerContext.filter = temp; parent.activeObj = tempActiveObj;
    }

    private resetPanPoints(): void {
        this.parent.panPoint.totalPannedPoint = {x: 0, y: 0};
        this.parent.panPoint.totalPannedClientPoint = {x: 0, y: 0};
        this.parent.panPoint.totalPannedInternalPoint = {x: 0, y: 0};
    }

    private setClientTransDim(isPreventDimension?: boolean): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
            parent.img.destLeft = (parent.lowerCanvas.width - parent.img.destHeight) / 2;
            parent.img.destTop = (parent.lowerCanvas.height - parent.img.destWidth) / 2;
            const temp: number = parent.img.destWidth; parent.img.destWidth = parent.img.destHeight;
            parent.img.destHeight = temp;
        } else {
            if (isNullOrUndefined(isPreventDimension)) {
                parent.img.destLeft = (parent.lowerCanvas.width - parent.img.destWidth) / 2;
                parent.img.destTop = (parent.lowerCanvas.height - parent.img.destHeight) / 2;
            }
        }
    }

    private redrawImgWithObj(): void {
        const parent: ImageEditor = this.parent;
        const obj: Object = {canvasFilter: parent.canvasFilter };
        this.lowerContext.filter = obj['canvasFilter'];
        if (parent.rotateFlipColl.length !== 0) {
            const totalPannedInternalPoint: Point = extend({}, parent.panPoint.totalPannedInternalPoint, {}, true) as Point;
            const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                height: parent.img.destHeight };
            this.callUpdateCurrTransState();
            parent.panPoint.totalPannedInternalPoint = totalPannedInternalPoint;
            parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
            parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        } else {
            this.callUpdateCurrTransState();
        }
        if (parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
        }
        const tempFilter: string = this.lowerContext.filter;
        this.lowerContext.filter = parent.getDefaultFilter();
        parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
        parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
            value: {context: this.lowerContext, points: null} });
        this.lowerContext.filter = tempFilter;
    }

    private setCurrentObj(obj?: CurrentObject): void {
        const parent: ImageEditor = this.parent;
        const isObj: boolean = obj ? true : false;
        obj = obj ? obj : parent.cropObj;
        parent.transform.cropZoomFactor = obj.cropZoom; parent.transform.defaultZoomFactor = obj.defaultZoom;
        if (!isObj) {parent.transform.zoomFactor = obj.cropZoom; }
        else {
            if (obj.activeObj.shape && obj.activeObj.shape.split('-')[0] === 'crop' ) {
                parent.transform.zoomFactor = obj.cropZoom;
            } else {
                parent.transform.zoomFactor = obj.defaultZoom;
            }
        }
        parent.setProperties({zoomSettings: { zoomFactor: obj.zoomFactor}}, true);
        parent.notify('transform', { prop: 'setPreviousZoomValue', onPropertyChange: false, value: {previousZoomValue: obj.previousZoomValue }});
        parent.panPoint.totalPannedPoint = extend({}, obj.totalPannedPoint, {}, true) as Point;
        parent.panPoint.totalPannedClientPoint = extend({}, obj.totalPannedClientPoint, {}, true) as Point;
        parent.panPoint.totalPannedInternalPoint = extend({}, obj.totalPannedInternalPoint, {}, true) as Point;
        const point: Point = extend({}, obj.tempFlipPanPoint, {}, true) as Point;
        parent.notify('crop', { prop: 'setTempFlipPanPoint', onPropertyChange: false, value: {point: point}});
        parent.rotateFlipColl = extend([], obj.rotateFlipColl, [], true) as string[] | number[];
        parent.transform.degree = obj.degree;
        parent.transform.currFlipState = obj.currFlipState;
        parent.img.destLeft = obj.destPoints.startX; parent.img.destTop = obj.destPoints.startY;
        parent.img.destWidth = obj.destPoints.width; parent.img.destHeight = obj.destPoints.height;
        parent.img.srcLeft = obj.srcPoints.startX; parent.img.srcTop = obj.srcPoints.startY;
        parent.img.srcWidth = obj.srcPoints.width; parent.img.srcHeight = obj.srcPoints.height;
        if (obj.afterCropActions) {parent.afterCropActions = obj.afterCropActions; }
        this.lowerContext.filter = obj.filter;
        parent.notify('filter', { prop: 'setBrightnessAdjusted', onPropertyChange: false, value: {isBrightnessAdjusted: false }});
        const isCircleCrop: boolean = parent.isCircleCrop;
        let currSelectionPoint: SelectionPoint;
        if (isNullOrUndefined(parent.currSelectionPoint)) {currSelectionPoint = null; }
        else {
            currSelectionPoint = extend({}, parent.currSelectionPoint, {}, true) as SelectionPoint;
            parent.currSelectionPoint = null;
        }
        parent.isCircleCrop = false; this.drawCropSelectionImage(obj, false);
        if (parent.transform.degree !== 0) {
            if (parent.transform.currFlipState === '') {
                parent.notify('transform', { prop: 'rotatePan', onPropertyChange: false,
                    value: {isCropSelection: null, isDefaultZoom: null}});
            } else {
                parent.notify('transform', { prop: 'drawPannedImage', value: {xDiff: 0, yDiff: 0 } });
            }
            parent.img.destLeft = obj.destPoints.startX; parent.img.destTop = obj.destPoints.startY;
            parent.panPoint.totalPannedClientPoint = extend({}, obj.totalPannedClientPoint, {}, true) as Point;
            parent.panPoint.totalPannedInternalPoint = extend({}, obj.totalPannedInternalPoint, {}, true) as Point;
        }
        parent.activeObj = extend({}, obj.activeObj, {}, true) as SelectionPoint;
        this.upperContext.clearRect(0, 0 , parent.upperCanvas.width, parent.upperCanvas.height);
        if (parent.activeObj.activePoint.width !== 0 && parent.activeObj.activePoint.height !== 0) {
            this.drawObject('duplicate', null, null, null, true);
        }
        let activeObj: SelectionPoint = extend({}, obj.activeObj, {}, true) as SelectionPoint;
        let isAfterCropAction: boolean = false;
        if (parent.afterCropActions.length > 0) {
            const object: Object = {collection: parent.afterCropActions};
            parent.notify('shape', { prop: 'alignRotateFlipColl', onPropertyChange: false,
                value: {collection: parent.afterCropActions, isRotateFlipCollection: null, obj: object }});
            parent.afterCropActions = object['collection'];
        }
        const afterCropActions: string[] = extend([], parent.afterCropActions, [], true) as string[];
        if (!isObj && afterCropActions.length > 0) {
            isAfterCropAction = true;
            for (let i: number = 0; i < afterCropActions.length; i++) {
                if (afterCropActions[i as number] === 'horizontalflip' || afterCropActions[i as number] === 'verticalflip') {
                    parent.activeObj = extend({}, currSelectionPoint, {}, true) as SelectionPoint;
                    this.rotatedFlipCropSel = true;
                }
                parent.notify('transform', { prop: 'updateTransform', onPropertyChange: false, value: {text: afterCropActions[i as number]}});
            }
            activeObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            this.resetPanPoints(); parent.activeObj = activeObj;
            this.upperContext.clearRect(0, 0 , parent.upperCanvas.width, parent.upperCanvas.height);
            if (parent.activeObj.activePoint.width !== 0 && parent.activeObj.activePoint.height !== 0) {
                this.drawObject('duplicate', null, null, null, true);
            }
            if (obj.degree !== parent.transform.degree) {
                parent.transform.cropZoomFactor = null; parent.transform.zoomFactor = 0;
            }
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
            if (this.rotatedFlipCropSel) {this.rotatedFlipCropSel = false; }
        }
        parent.afterCropActions = afterCropActions;
        if (!this.isCancelAction && !isAfterCropAction) {
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.img.destLeft = obj.destPoints.startX; parent.img.destTop = obj.destPoints.startY;
        }
        parent.activeObj = activeObj; parent.isCircleCrop = isCircleCrop;
        if (isNullOrUndefined(currSelectionPoint)) {parent.currSelectionPoint = null; }
        else {
            parent.currSelectionPoint = extend({}, currSelectionPoint, {}, true) as SelectionPoint;
            if (parent.currSelectionPoint && isNullOrUndefined(parent.currSelectionPoint.shape)) {
                parent.currSelectionPoint = null;
            }
        }
    }

    private drawCropSelectionImage(obj: CurrentObject, isObj: boolean): void {
        const parent: ImageEditor = this.parent; const temp: string = this.lowerContext.filter;
        parent.clearContext(this.lowerContext); parent.clearContext(this.upperContext);
        this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
        if (isObj) {this.updateCurrTransState('initial');}
        else {this.setTransformColl(this.lowerContext, 'initial'); }
        parent.notify('transform', { prop: 'setDestPointsForFlipState', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
        if (isObj) {this.updateCurrTransState('reverse'); }
        else {this.setTransformColl(this.lowerContext, 'reverse'); }
        parent.img.destLeft = parent.cropObj.destPoints.startX;
        parent.img.destTop = parent.cropObj.destPoints.startY;
        const activeObj: SelectionPoint = extend({}, obj.activeObj, {}, true) as SelectionPoint;
        this.lowerContext.filter = 'none';
        if (this.isCancelAction) {
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
        } else {
            parent.img.destLeft = obj.destPoints.startX; parent.img.destTop = obj.destPoints.startY;
            parent.img.destWidth = obj.destPoints.width; parent.img.destHeight = obj.destPoints.height;
            parent.img.srcLeft = obj.srcPoints.startX; parent.img.srcTop = obj.srcPoints.startY;
            parent.img.srcWidth = obj.srcPoints.width; parent.img.srcHeight = obj.srcPoints.height;
            const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                height: parent.img.destHeight};
            parent.img.destLeft = obj.activeObj.activePoint.startX; parent.img.destTop = obj.activeObj.activePoint.startY;
            parent.img.destWidth = obj.activeObj.activePoint.width; parent.img.destHeight = obj.activeObj.activePoint.height;
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
            parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        }
        parent.activeObj = activeObj; this.lowerContext.filter = temp;
    }

    private performPointZoom(x: number, y: number, type: string): void {
        const parent: ImageEditor = this.parent;
        const ratioX: number = (x - parent.img.destLeft) / parent.img.destWidth;
        const ratioY: number = (y - parent.img.destTop) / parent.img.destHeight;
        const isUndoRedo: boolean = parent.isUndoRedo; parent.isUndoRedo = true;
        parent.setProperties({zoomSettings: { zoomPoint: {x: x, y: y}}}, true);
        if (type === 'zoomIn') {
            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                value: {zoomFactor: .1, zoomPoint: null}});
        } else if (type === 'zoomOut') {
            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                value: {zoomFactor: -.1, zoomPoint: null}});
        }
        parent.isUndoRedo = isUndoRedo;
        if (parent.transform.zoomFactor > 0) {
            const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            if (parent.transform.degree === 0) {
                parent.img.destLeft = x - (ratioX * parent.img.destWidth);
                parent.img.destTop = y - (ratioY * parent.img.destHeight);
                this.drawZoomPanImage(parent.img.destLeft - destLeft, parent.img.destTop - destTop);
            } else {
                const isCropTab: boolean = parent.isCropTab;
                parent.isCropTab = true;
                const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
                const pointColl: Point[] = extend([], parent.pointColl, [], true) as Point[];
                parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
                const object: Object = {selPointColl: null };
                parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                    value: {obj: object }});
                const cropSelPointColl: Point[] = object['selPointColl'];
                parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                    value: {obj: {selPointColl: [] } }});
                parent.panPoint.currentPannedPoint = {x: (x - (ratioX * parent.img.destWidth)) - destLeft,
                    y: (y - (ratioY * parent.img.destHeight)) - destTop};
                parent.notify('transform', { prop: 'rotatePan', onPropertyChange: false,
                    value: {isCropSelection: null, isDefaultZoom: null}});
                parent.isCropTab = isCropTab;
                parent.objColl = objColl; parent.pointColl = pointColl; parent.freehandCounter = parent.pointColl.length;
                parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                    value: {obj: {selPointColl: cropSelPointColl } }});
                parent.notify('shape', { prop: 'panObjColl', onPropertyChange: false,
                    value: {xDiff: parent.panPoint.currentPannedPoint.x, yDiff: parent.panPoint.currentPannedPoint.y, panRegion: ''}});
                parent.notify('freehand-draw', { prop: 'panFHDColl', onPropertyChange: false,
                    value: {xDiff: parent.panPoint.currentPannedPoint.x, yDiff: parent.panPoint.currentPannedPoint.y, panRegion: ''}});
            }
            this.adjustPanning(activeObj); parent.activeObj = activeObj;
            if (parent.activeObj.activePoint.width !== 0 && parent.activeObj.activePoint.height !== 0) {
                this.drawObject('duplicate', null, null, null, true);
            }
        }
    }

    private adjustPanning(activeObj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        if (activeObj.activePoint.width !== 0 && activeObj.activePoint.height !== 0) {
            const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
            const point: Point = {x: 0, y: 0};
            if (parent.img.destLeft > activeObj.activePoint.startX) {
                point.x =  parent.img.destLeft - activeObj.activePoint.startX;
            } else if (parent.img.destLeft + parent.img.destWidth < activeObj.activePoint.startX + activeObj.activePoint.width) {
                point.x = (parent.img.destLeft + parent.img.destWidth) - (activeObj.activePoint.startX + activeObj.activePoint.width);
            }
            if (parent.img.destTop > activeObj.activePoint.startY) {
                point.y = parent.img.destTop - activeObj.activePoint.startY;
            } else if (parent.img.destTop + parent.img.destHeight < activeObj.activePoint.startY + activeObj.activePoint.height) {
                point.y = (parent.img.destTop + parent.img.destHeight) - (activeObj.activePoint.startY + activeObj.activePoint.height);
            }
            if (parent.transform.degree === 0) {
                parent.img.destLeft -= point.x; parent.img.destTop -= point.y;
                this.drawZoomPanImage(parent.img.destLeft - destLeft, parent.img.destTop - destTop);
            } else {
                const isCropTab: boolean = parent.isCropTab; parent.isCropTab = true;
                const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
                const pointColl: Point[] = extend([], parent.pointColl, [], true) as Point[];
                parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
                const object: Object = {selPointColl: null };
                parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                    value: {obj: object }});
                const cropSelPointColl: Point[] = object['selPointColl'];
                parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                    value: {obj: {selPointColl: [] } }});
                parent.img.destLeft -= point.x; parent.img.destTop -= point.y;
                parent.panPoint.currentPannedPoint = {x: parent.img.destLeft - destLeft, y: parent.img.destTop - destTop};
                parent.notify('transform', { prop: 'rotatePan', onPropertyChange: false,
                    value: {isCropSelection: null, isDefaultZoom: null}});
                parent.isCropTab = isCropTab;
                parent.objColl = objColl; parent.pointColl = pointColl; parent.freehandCounter = parent.pointColl.length;
                parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                    value: {obj: {selPointColl: cropSelPointColl } }});
                parent.notify('shape', { prop: 'panObjColl', onPropertyChange: false,
                    value: {xDiff: parent.panPoint.currentPannedPoint.x, yDiff: parent.panPoint.currentPannedPoint.y, panRegion: ''}});
                parent.notify('freehand-draw', { prop: 'panFHDColl', onPropertyChange: false,
                    value: {xDiff: parent.panPoint.currentPannedPoint.x, yDiff: parent.panPoint.currentPannedPoint.y, panRegion: ''}});
            }
        }
    }

    private drawZoomPanImage(x: number, y: number): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', { prop: 'panObjColl', onPropertyChange: false,
            value: {xDiff: x, yDiff: y, panRegion: ''}});
        parent.notify('freehand-draw', { prop: 'panFHDColl', onPropertyChange: false,
            value: {xDiff: x, yDiff: y, panRegion: ''}});
        this.renderImage(true);
        const obj: Object = {width: 0, height: 0 };
        parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: parent.img.srcWidth, height: parent.img.srcHeight, obj: obj}});
        const maxDimension: Dimension = obj as Dimension;
        maxDimension.width += (maxDimension.width * parent.transform.zoomFactor);
        maxDimension.height += (maxDimension.height * parent.transform.zoomFactor);
        parent.panPoint.totalPannedPoint.x += x; parent.panPoint.totalPannedPoint.y += y;
        parent.notify('crop', { prop: 'setTempFlipPanPoint', onPropertyChange: false, value: {point: {x: 0, y: 0 }}});
    }

    private openNewImage(): void {
        const parent: ImageEditor = this.parent;
        const inMemoryContext: CanvasRenderingContext2D = parent.inMemoryCanvas.getContext('2d');
        showSpinner(parent.element);
        parent.element.style.opacity = '0.5';
        const toolbar: HTMLInputElement = document.querySelector('#' + parent.element.id + '_currPos');
        if (toolbar) {toolbar.style.display = 'none'; }
        const obj: Object = {defToolbarItems : null };
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'getDefToolbarItems', value: {obj: obj }});
            if (obj['defToolbarItems'].length === 0 &&
                (isNullOrUndefined(document.getElementById(parent.element.id + '_toolbar')))) {
                const height: number = parent.element.querySelector('#' + parent.element.id + '_toolbarArea').clientHeight;
                parent.notify('toolbar', { prop: 'setToolbarHeight', value: {height: height }});
            }
        } else {
            if (parent.element.querySelector('#' + parent.element.id + '_toolbar')) {
                parent.toolbarHeight = parent.element.querySelector('#' + parent.element.id + '_toolbar').clientHeight;
            } else {parent.toolbarHeight = 0; }
        }
        parent.reset(); parent.update();
        parent.transform.degree = 0; parent.transform.zoomFactor = 0; parent.isImageLoaded = false;
        parent.currSelectionPoint = null; const type: string = typeof(this.openURL);
        if (type === 'string') {
            let fileName: string[] = (this.openURL as string).split('.');
            if (fileName.length > 1) {
                fileName = fileName[fileName.length - 2].split('/');
                this.fileName = fileName[fileName.length - 1];
            } else {this.fileName = 'ImageEditor'; }
            this.fileType = this.getFileExtensionFromURL(this.openURL as string) as FileType;
            if (this.fileType) {
                this.fileType = parent.toPascalCase(this.fileType) as FileType;
                let fileType: string = this.fileType.toLowerCase();
                if (fileType === 'jpg' || fileType === 'jpeg') {
                    this.fileType = 'Jpeg' as FileType; fileType = 'jpeg';
                }
                if (fileType !== 'jpeg' && fileType !== 'png' && fileType !== 'svg') {
                    this.fileType = null;
                }
            }
            this.imageOnLoad(this.openURL as string);
        } else {
            this.fileName = 'ImageEditor'; this.fileType = null; 
            parent.lowerCanvas = document.querySelector('#' + parent.element.id + '_lowerCanvas');
            parent.upperCanvas = document.querySelector('#' + parent.element.id + '_upperCanvas');
            this.lowerContext = parent.lowerCanvas.getContext('2d'); this.upperContext = parent.upperCanvas.getContext('2d');
            parent.clearContext(this.lowerContext); parent.clearContext(this.upperContext); parent.clearContext(inMemoryContext);
            parent.inMemoryCanvas.width = parent.baseImg.width = (this.openURL as ImageData).width;
            parent.inMemoryCanvas.height = parent.baseImg.height = (this.openURL as ImageData).height;
            inMemoryContext.putImageData((this.openURL as ImageData), 0, 0);
            parent.baseImg.src = parent.inMemoryCanvas.toDataURL();
        }
    }

    private dlgBtnClick(): void {
        const parent: ImageEditor = this.parent;
        parent.export();
        if (this.isFileChanged) {
            parent.isImageLoaded = this.isFileChanged = false; parent.reset();
            this.checkToolbarTemplate(this.inputElem, this.openURL as URL);
        } else {
            this.reset(); this.openNewImage();
        }
        if (!isBlazor()) {
            (getComponent(document.getElementById(parent.element.id + '_dialog'), 'dialog') as Dialog).destroy();
        }
        this.isImageEdited = false;
    }

    private dlgCloseBtnClick(): void {
        const parent: ImageEditor = this.parent;
        this.baseImgSrc = parent.baseImg.src;
        if (this.isFileChanged) {
            parent.isImageLoaded = this.isFileChanged = false; parent.reset();
            this.checkToolbarTemplate(this.inputElem, this.openURL as URL);
        } else {
            this.reset(); this.openNewImage();
        }
        if (!isBlazor()) {
            (getComponent(document.getElementById(parent.element.id + '_dialog'), 'dialog') as Dialog).destroy();
        }
        this.isImageEdited = false;
    }

    private showDialogPopup(): void {
        (this.parent.element.querySelector('#' + this.parent.element.id + '_dialog') as HTMLElement).style.display = 'block';
        const dialog: Dialog = new Dialog({
            header: 'Confirm Save Changes',
            closeOnEscape: true,
            content: '<span>Do you want to save the changes you made to the image?</span>',
            target: document.getElementById('target'),
            width: '285px',
            isModal: true,
            animationSettings: { effect: 'Zoom' },
            close: this.dlgCloseBtnClick.bind(this),
            buttons: [
                { click: this.dlgCloseBtnClick.bind(this),
                    buttonModel: { content: 'No', iconCss: 'e-icons e-close' }
                },
                { click: this.dlgBtnClick.bind(this),
                    buttonModel: { content: 'Yes', isPrimary: true, iconCss: 'e-icons e-check' }}
            ]
        });
        dialog.appendTo('#' + this.parent.element.id + '_dialog');
    }

    private restoreOldImage(): void {
        if (this.parent.isImageLoaded) {
            // if (this.isImageEdited || this.parent.pointColl.length > 0 || this.parent.objColl.length > 0) {
            //     this.showDialogPopup();
            // } else {
            // this.reset();
            // this.openNewImage();
            // }
            // const data: ImageData = this.parent.getImageData();
            // const canvas: HTMLCanvasElement = document.createElement('canvas');
            // canvas.width = data.width; canvas.height = data.height;
            // canvas.getContext('2d').putImageData(data, 0, 0);
            // this.baseImgSrc = canvas.toDataURL();
            this.reset(); this.openNewImage();
        } else {
            this.openNewImage();
        }
    }

    private open(data: string | ImageData): void {
        if (!this.parent.disabled) {
            this.openURL = data; this.restoreOldImage();
        }
    }

    private getInitialLoaded(object: Object): void {
        object['isInitialLoaded'] = this.isInitialLoading;
    }

    private getFileExtensionFromURL(url: string): string {
        const lastDotIndex: number = url.lastIndexOf(".");
        if (lastDotIndex !== -1) {
            return url.slice(lastDotIndex + 1).toLowerCase();
        }
        return null;
    }

    private fileSelect(inputElement: HTMLInputElement, args: Event): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const filesData: FileList = (args.target as any).files[0];
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const fileData: any = filesData;
            let fileExtension: string = fileData.name && fileData.name.split('.')[1].toLowerCase();
            if (fileExtension && ['jpg', 'jpeg', 'png', 'svg'].indexOf(fileExtension) === -1) {
                this.errorLoading();
                return;
            }
            showSpinner(parent.element); parent.element.style.opacity = '0.5';
            this.inputElem = inputElement;
            fileExtension = fileData.name && fileData.name.split('.')[1];
            if (fileExtension) {
                const fileType: string = parent.toPascalCase(fileExtension);
                if (fileType === 'JPG' || fileType === 'Jpg') {
                    this.fileType = 'Jpeg' as FileType;
                } else {
                    this.fileType = fileType as FileType;
                }
            } else {
                this.fileType = null;
            }
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const URL: any = window.URL; const url: URL = URL.createObjectURL(filesData);
            this.openURL = url;
            if (parent.isImageLoaded && (this.isImageEdited || parent.pointColl.length > 0 || parent.objColl.length > 0)) {
                this.isFileChanged = true;
                if (!isBlazor()) {this.showDialogPopup(); }
                else {parent.dotNetRef.invokeMethodAsync('UpdateDialog'); }
            } else {this.checkToolbarTemplate(inputElement, url); }
        }
    }

    private checkToolbarTemplate(inputElement: HTMLInputElement, url: URL): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.toolbarTemplate)) {
            parent.reset(); parent.update();
        }
        this.fileName = inputElement.value.split('\\')[inputElement.value.split('\\').length - 1];
        this.fileName = this.fileName.split('.')[0];
        this.imageOnLoad(url.toString()); inputElement.value = '';
    }

    private moveToSelectionRange(type: string, activeObj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.shape) {
            if (type === 'rotateleft' || type === 'rotateright') {
                let zoomFactor: number = parent.transform.zoomFactor;
                parent.objColl.push(parent.activeObj);
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
                    if (parent.objColl[parent.objColl.length - 1].activePoint.width < activeObj.activePoint.height) {
                        for (let i: number = 2; i < parent.zoomSettings.maxZoomFactor; i++) {
                            if (parent.objColl[parent.objColl.length - 1].activePoint.width >= activeObj.activePoint.height ||
                                this.isSelectionBiggerThanCanvas(parent.objColl[parent.objColl.length - 1]) ||
                                this.isSelectionOutsideCanvas(parent.objColl[parent.objColl.length - 1])) {
                                if (!isNullOrUndefined(zoomFactor)) {
                                    parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                        value: {zoomFactor: -0.1, zoomPoint: null}});
                                }
                                break;
                            }
                            zoomFactor += 0.1;
                            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                value: {zoomFactor: zoomFactor, zoomPoint: null}});
                        }
                    } else {
                        for (let i: number = 2; i < parent.zoomSettings.maxZoomFactor; i++) {
                            if (parent.objColl[parent.objColl.length - 1].activePoint.width >= activeObj.activePoint.height ||
                                this.isSelectionBiggerThanCanvas(parent.objColl[parent.objColl.length - 1]) ||
                                this.isSelectionOutsideCanvas(parent.objColl[parent.objColl.length - 1])) {
                                if (!isNullOrUndefined(zoomFactor)) {
                                    parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                        value: {zoomFactor: 0.1, zoomPoint: null}});
                                }
                                break;
                            }
                            zoomFactor -= .1;
                            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                value: {zoomFactor: zoomFactor, zoomPoint: null}});
                        }
                    }
                } else {
                    if (parent.objColl[parent.objColl.length - 1].activePoint.height < activeObj.activePoint.width) {
                        for (let i: number = 2; i < parent.zoomSettings.maxZoomFactor; i++) {
                            if (parent.objColl[parent.objColl.length - 1].activePoint.height >= activeObj.activePoint.width ||
                                this.isSelectionBiggerThanCanvas(parent.objColl[parent.objColl.length - 1]) ||
                                this.isSelectionOutsideCanvas(parent.objColl[parent.objColl.length - 1])) {
                                if (!isNullOrUndefined(zoomFactor)) {
                                    parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                        value: {zoomFactor: -0.1, zoomPoint: null}});
                                }
                                break;
                            }
                            zoomFactor += 0.1;
                            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                value: {zoomFactor: zoomFactor, zoomPoint: null}});
                        }
                    } else {
                        for (let i: number = 2; i < parent.zoomSettings.maxZoomFactor; i++) {
                            if (parent.objColl[parent.objColl.length - 1].activePoint.height >= activeObj.activePoint.width ||
                                this.isSelectionBiggerThanCanvas(parent.objColl[parent.objColl.length - 1]) ||
                                this.isSelectionOutsideCanvas(parent.objColl[parent.objColl.length - 1])) {
                                if (!isNullOrUndefined(zoomFactor)) {
                                    parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                        value: {zoomFactor: 0.1, zoomPoint: null}});
                                }
                                break;
                            }
                            zoomFactor -= .1;
                            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                value: {zoomFactor: zoomFactor, zoomPoint: null}});
                        }
                    }
                }
                const panX: number = (parent.lowerCanvas.clientWidth / 2) - (parent.objColl[parent.objColl.length - 1].activePoint.startX +
                    (parent.objColl[parent.objColl.length - 1].activePoint.width / 2));
                const panY: number = (parent.lowerCanvas.clientHeight / 2) - (parent.objColl[parent.objColl.length - 1].activePoint.startY +
                    (parent.objColl[parent.objColl.length - 1].activePoint.height / 2));
                if (parent.transform.degree === 0) {
                    parent.img.destLeft += panX;
                    parent.img.destTop += panY;
                    parent.notify('transform', {prop: 'drawPannImage', value: {point: {x: panX, y: panY}}});
                } else {
                    parent.panPoint.currentPannedPoint = {x: panX, y: panY};
                    parent.notify('transform', {prop: 'drawPannedImage', value: {xDiff: panX, yDiff: panY } });
                    parent.panPoint.currentPannedPoint = {x: 0, y: 0};
                }
                parent.notify('transform', { prop: 'setTempPanMove', onPropertyChange: false,
                    value: {point: null }});
                parent.activeObj = extend({}, parent.objColl[parent.objColl.length - 1]) as SelectionPoint;
                parent.objColl.pop();
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj }});
            }
        }
    }

    private isSelectionBiggerThanCanvas(obj: SelectionPoint): boolean {
        let isBigger: boolean = false;
        if (obj.activePoint.startX <= this.parent.img.destLeft ||
            obj.activePoint.startY <= this.parent.img.destTop ||
            obj.activePoint.endX >= this.parent.img.destLeft + this.parent.img.destWidth ||
            obj.activePoint.endY >= this.parent.img.destTop + this.parent.img.destHeight) {
            isBigger = true;
        }
        return isBigger;
    }

    private isSelectionOutsideCanvas(obj: SelectionPoint): boolean {
        let isOutside: boolean = false;
        if ((obj.activePoint.height < this.parent.lowerCanvas.height - this.parent.toolbarHeight) ||
            (obj.activePoint.width < this.parent.lowerCanvas.width)) {
            isOutside = true;
        }
        return isOutside;
    }
}
