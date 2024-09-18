/* eslint-disable no-constant-condition */
/* eslint-disable radix */
import { extend, isNullOrUndefined, Browser, getComponent } from '@syncfusion/ej2-base';
import { ActivePoint, Dimension } from '@syncfusion/ej2-inputs';
import { ImageEditor, Point, SelectionPoint, OpenEventArgs, Direction, CurrentObject, ShapeSettings, FileType, StrokeSettings, Transition, TextSettings, CropSelectionSettings, SelectionChangeEventArgs, FrameValue, FrameChangeEventArgs, FrameSettings, FrameType, FrameLineStyle, ImageDimension, ShapeType, EditCompleteEventArgs  } from '../index';
import { Dialog, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
export class Draw {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private isInitialLoading: boolean = false; // Specifies whether image is loaded for the first time or not (for applying initial filter)
    private fileName: string = '';
    private fileType: FileType;
    private isErrorImage: boolean = false;
    private initZoomValue: number;
    private isShapeTextInserted: boolean = false;
    private currSelPoint: SelectionPoint; // To store current crop selection point (while changing crop selection dynamically)
    private isRotateZoom: boolean = false; // To restore zoomed image on selection crop selection
    private tempStrokeSettings: StrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null, outlineColor: '', radius: null, outlineWidth: null}; // restore stroke settings on cancel
    private tempTextSettings: TextSettings =
    {text: 'Enter Text', fontFamily: '', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false}; // restore text settings on cancel
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
    private isImageEdited: boolean = false;
    private openURL: string | ImageData | URL;
    private inputElem: HTMLInputElement;
    private isFileChanged: boolean = false;
    private isNewPath: boolean = false;
    private isResizeSelect: boolean = false;
    private arrowDimension: Object = {bar: {width: 10, height: 32, ratioX: null, ratioY: null},
        arrow: {width: 24, height: 24, ratioX: null, ratioY: null}, arrowSolid: {width: 32, height: 32, ratioX: null, ratioY: null},
        circle: {width: 10, height: 10, ratioX: null, ratioY: null}, square: {width: 20, height: 20, ratioX: null, ratioY: null }};
    private origDim: Dimension = {width: 0, height: 0 };
    private isImageApply: boolean = false;
    private straightenActObj: SelectionPoint;
    private straightenInitZoom: number;
    private imgCanvasPoints: Point[] = [];
    private straightenDestPoints: ImageDimension;
    private isCropSelect: boolean = false;
    private isDownScale: boolean = false;
    private tempStraightenDestPoints: ImageDimension;
    private preventStraightening: boolean = false;
    private tempObjColl: SelectionPoint[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private tempPointColl: any = {};
    private imageBackgroundColor: string = '';
    private tempStrokeWidth: number;
    private allowRedactStraighten: boolean = true;

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
            this.renderImage(args.value['isMouseWheel'], args.value['isPreventClearRect'], args.value['isFrame'], args.value['isStraighten']);
            break;
        case 'draw-image-to-canvas':
            this.drawImgToCanvas(args.value['dimension'] as Dimension);
            break;
        case 'update-canvas':
            this.updateCanvas();
            break;
        case 'performCancel':
            this.performCancel(args.value['isContextualToolbar'], args.value['isUndoRedo'], args.value['isFinalCancel']);
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
            this.setCurrentObj(args.value['obj'], args.value['isUndoRedo'], args.value['isCircleCrop']);
            break;
        case 'performPointZoom':
            this.performPointZoom(args.value['x'], args.value['y'], args.value['type'], args.value['isResize']);
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
        case 'setNewPath':
            this.isNewPath = args.value['bool'];
            break;
        case 'getNewPath':
            args.value['obj']['isNewPath'] = this.isNewPath;
            break;
        case 'getArrowDimension':
            args.value['obj']['arrowDimension'] = extend({}, this.arrowDimension, {}, true);
            break;
        case 'setArrowDimension':
            this.arrowDimension = args.value['arrowDimension'];
            break;
        case 'moveToSelectionRange':
            this.moveToSelectionRange(args.value['type'], args.value['activeObj']);
            break;
        case 'setResizeSelect':
            this.isResizeSelect = args.value['bool'];
            break;
        case 'applyFrame':
            this.applyFrame(args.value['ctx'], args.value['frame'], args.value['preventImg']);
            break;
        case 'drawImage':
            this.drawImage();
            break;
        case 'downScaleImgCanvas':
            this.downScaleImgCanvas(args.value['ctx'], args.value['isImgAnnotation'], args.value['isHFlip'], args.value['isVFlip']);
            break;
        case 'downScale':
            this.downScale(args.value['canvas'], args.value['width'], args.value['height']);
            break;
        case 'resetFrameZoom':
            this.resetFrameZoom(args.value['isOk']);
            break;
        case 'triggerFrameChange':
            args.value['obj']['frameChangeEventArgs'] = this.triggerFrameChange(args.value['prevFrameSettings']);
            break;
        case 'setImageApply':
            this.isImageApply = args.value['bool'];
            break;
        case 'zoomToSel':
            this.zoomToSel(args.value['activeObj'], args.value['isToolbar']);
            break;
        case 'getStraightenActObj':
            args.value['obj']['activeObj'] = this.straightenActObj;
            break;
        case 'setStraightenActObj':
            this.straightenActObj = args.value['activeObj'];
            break;
        case 'updateImgCanvasPoints':
            this.updateImgCanvasPoints();
            break;
        case 'isLinesIntersect':
            args.value['obj']['isIntersect'] = this.isLinesIntersect(args.value['obj']);
            break;
        case 'getImageCanvasPoints':
            args.value['obj']['points'] = this.imgCanvasPoints;
            break;
        case 'setDestForStraighten':
            this.setDestForStraighten();
            break;
        case 'setTempDestForStraighten':
            this.tempStraightenDestPoints = extend({}, this.straightenDestPoints, {}, true) as ImageDimension;
            break;
        case 'getStraightenInitZoom':
            args.value['obj']['zoomFactor'] = this.straightenInitZoom;
            break;
        case 'setStraightenInitZoom':
            this.straightenInitZoom = args.value['zoomFactor'];
            break;
        case 'isPointsInsideImg':
            args.value['obj']['bool'] = this.checkPointPosition(args.value['x'], args.value['y'], this.imgCanvasPoints[0].x,
                                                                this.imgCanvasPoints[0].y, this.imgCanvasPoints[1].x,
                                                                this.imgCanvasPoints[1].y, this.imgCanvasPoints[2].x,
                                                                this.imgCanvasPoints[2].y, this.imgCanvasPoints[3].x,
                                                                this.imgCanvasPoints[3].y) !== 'inside';
            break;
        case 'setIsCropSelect':
            this.isCropSelect = args.value['bool'];
            break;
        case 'updateCropSelection':
            this.updateCropSelection();
            break;
        case 'updateCropSelObj':
            this.updateCropSelObj();
            break;
        case 'redrawDownScale':
            this.redrawDownScale();
            break;
        case 'updateFinetune':
            this.updateFinetune();
            break;
        case 'isSelOutsideImg':
            args.value['obj']['bool'] = this.isSelOutsideImg();
            break;
        case 'resetStraightenDestPoints':
            this.straightenDestPoints = null;
            break;
        case 'checkPointPosition':
            args.value['obj']['position'] = this.checkPointPosition(args.value['obj']['x'], args.value['obj']['y'], args.value['obj']['x1'],
                                                                    args.value['obj']['y1'], args.value['obj']['x2'], args.value['obj']['y2'],
                                                                    args.value['obj']['x3'], args.value['obj']['y3'], args.value['obj']['x4'],
                                                                    args.value['obj']['y4']);
            break;
        case 'updateTempObjColl':
            this.tempObjColl = extend([], this.parent.objColl, [], true) as SelectionPoint[];
            break;
        case 'resetTempObjColl':
            this.tempObjColl = null;
            break;
        case 'updateTempPointColl':
            this.tempPointColl = extend({}, this.parent.pointColl, {}, true);
            break;
        case 'resetTempPointColl':
            this.tempPointColl = {};
            break;
        case 'showDialogPopup':
            this.showDialogPopup();
            break;
        case 'imageBackgroundColor':
            this.imageBackgroundColor = args.value['color'];
            break;
        case 'getImageBackgroundColor':
            args.value['obj']['color'] = this.imageBackgroundColor;
            break;
        case 'setTempStrokeWidth':
            this.tempStrokeWidth = args.value['strokeWidth'];
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
        if (this.tempTextSettings.fontFamily === '') {
            this.tempTextSettings.fontFamily = parent.fontFamily.default;
        }
    }

    private reset(): void {
        this.isInitialLoading = this.isErrorImage = this.isNewPath = this.isResizeSelect = false;
        this.isShapeTextInserted = false; this.isImageApply = false;
        this.initZoomValue = null; this.tempFilter = ''; this.origDim = {width: 0, height: 0 };
        this.currSelPoint = null; this.isRotateZoom = false; this.tempAdjValue = '';
        this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null, radius: null, outlineColor: '', outlineWidth: null};
        this.tempTextSettings =
            {text: 'Enter Text', fontFamily: this.parent.fontFamily.default, fontSize: null, fontRatio: null, bold: false, italic: false, underline: false};
        this.tempUndoRedoStep = this.tempFreehandCounter = this.tempCurrFhdIndex = 0; this.tempZoomFactor = null;
        this.isCancelAction = false; this.rotatedFlipCropSel = false; this.prevActObj = null; this.tempStraightenDestPoints = null;
        this.arrowDimension = {bar: {width: 10, height: 32, ratioX: null, ratioY: null},
            arrow: {width: 24, height: 24, ratioX: null, ratioY: null}, arrowSolid: {width: 32, height: 32, ratioX: null, ratioY: null},
            circle: {width: 10, height: 10, ratioX: null, ratioY: null}, square: {width: 20, height: 20, ratioX: null, ratioY: null }};
        this.straightenActObj = null; this.imgCanvasPoints = []; this.straightenInitZoom = null; this.allowRedactStraighten = true;
        this.tempObjColl = []; this.tempPointColl = {}; this.imageBackgroundColor = ''; this.tempStrokeWidth = null;
        this.straightenDestPoints = null; this.isCropSelect = this.isDownScale = this.preventStraightening = false;
    }

    private redrawDownScale(): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.zoomFactor && parent.transform.zoomFactor < 0) {
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.isDownScale = true;
            this.renderImage();
            this.isDownScale = false;
            if (activeObj.shape) {
                this.drawObject('duplicate', activeObj);
            }
        }
    }

    private updateFinetune(): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.zoomFactor && parent.transform.zoomFactor < 0) {
            const filter: string = this.lowerContext.filter;
            this.lowerContext.filter = 'none';
            parent.notify('draw', { prop: 'redrawDownScale' });
            const inMemoryContext: CanvasRenderingContext2D = parent.inMemoryCanvas.getContext('2d');
            const ctx: CanvasRenderingContext2D = this.lowerContext;
            const imageData: ImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            parent.inMemoryCanvas.width = imageData.width; parent.inMemoryCanvas.height = imageData.height;
            inMemoryContext.putImageData(imageData, 0, 0);
            this.lowerContext.filter = filter;
            parent.notify('draw', { prop: 'redrawDownScale' });
        }
    }

    private drawImage(): void {
        this.applyFrame(this.lowerContext, this.parent.frameObj.type);
    }

    private drawObject(canvas: string, obj?: SelectionPoint, isCropRatio?: boolean, points?: ActivePoint,
                       isPreventDrag?: boolean, saveContext?: CanvasRenderingContext2D,
                       isPreventSelection?: boolean): void {
        const parent: ImageEditor = this.parent;  let actObj: SelectionPoint = parent.activeObj;
        let actPoint: ActivePoint = parent.activeObj.activePoint;
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        let canvasDraw: CanvasRenderingContext2D; canvas = canvas.toLowerCase();
        if (canvas === 'original') {canvasDraw = this.lowerContext; }
        else if (canvas === 'duplicate') {canvasDraw = this.upperContext; }
        else if (saveContext) {canvasDraw = saveContext; }
        if (!isPreventDrag && actObj.shape) {this.setDragLimit(); }
        if (parent.currObjType.shape) {
            const splitWords: string[] = parent.currObjType.shape.split('-');
            if (splitWords[0].toLowerCase() === 'crop' && isCropRatio) {this.drawCropRatio(); }
        }
        actObj = parent.activeObj; actPoint = parent.activeObj.activePoint;
        if (isNullOrUndefined(actObj.strokeSettings)) {
            const obj: Object = {strokeSettings: {} as StrokeSettings };
            parent.notify('shape', { prop: 'getStrokeSettings', onPropertyChange: false, value: {obj: obj }});
            actObj.strokeSettings = obj['strokeSettings'];
        }
        if (isNullOrUndefined(actObj.strokeSettings.strokeWidth)) {
            actObj.strokeSettings.strokeWidth = 2;
        }
        if (obj) {
            parent.activeObj = extend({}, obj, {}, true) as SelectionPoint;
        }
        if (points && points.startX && points.startY && points.endX && points.endY && points.width && points.height) {
            actPoint.startX = points.startX; actPoint.startY = points.startY;
            actPoint.endX = points.endX; actPoint.endY = points.endY;
            actPoint.width = points.width; actPoint.height = points.height;
        }
        this.updateActiveObject();
        actObj = parent.activeObj; actPoint = parent.activeObj.activePoint;
        if (isNullOrUndefined(actPoint.startX) && isNullOrUndefined(actPoint.startY)) {
            return;
        }
        if (parent.currObjType.isText) {
            const obj: Object = {keyHistory: '' };
            parent.notify('shape', { prop: 'getKeyHistory', onPropertyChange: false, value: {obj: obj }});
            actObj.keyHistory = obj['keyHistory'];
        }
        let isCrop: boolean = false;
        if (canvas !== 'original') {
            let splitWords: string[];
            if (actObj.shape) {
                splitWords = actObj.shape.split('-');
                if (splitWords[0] === 'crop') {isCrop = true; }
            }
            if (isCrop) {
                if (points && points.startX && points.startY && points.endX && points.endY && points.width && points.height) {
                    actPoint.startX = points.startX; actPoint.startY = points.startY;
                    actPoint.endX = points.endX; actPoint.endY = points.endY;
                    actPoint.width = points.width; actPoint.height = points.height;
                } else {
                    actPoint = actObj.activePoint;
                }
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
        if (obj) {
            this.drawShapeObj(canvas, obj.shape, saveContext, isPreventSelection);
        } else if (object['keyHistory'] !== '' && parent.currObjType.isText) {
            this.drawShapeObj(canvas, 'text', saveContext, isPreventSelection);
        } else if (actObj.shape) {
            this.drawShapeObj(canvas, actObj.shape, saveContext, isPreventSelection);
        } else {
            this.drawShapeObj(canvas, undefined, saveContext, isPreventSelection);
        }
        if (canvas === 'duplicate' && isCrop && actObj.shape !== 'crop-circle' && parent.frameObj.type !== 'none') {
            this.applyFrame(this.upperContext, parent.frameObj.type);
            this.drawCornerCircles(this.upperContext);
        }
    }

    private rotateContext(type: string, ctx: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        const {shape, rotatedAngle} = parent.activeObj;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        const { startX, startY, width, height } = parent.activeObj.activePoint;
        if (shape === 'line' || shape === 'arrow') {
            return;
        }
        const rotationAngle: number = (type === 'initial') ? rotatedAngle : -rotatedAngle;
        let translateX: number; let translateY: number;
        if (parent.transform.straighten === 0 && !parent.isCropTab) {
            translateX = startX + (width / 2);
            translateY = startY + (height / 2);
        } else {
            translateX = destLeft + (destWidth / 2);
            translateY = destTop + (destHeight / 2);
        }
        ctx.translate(translateX, translateY);
        ctx.rotate(rotationAngle);
        ctx.translate(-translateX, -translateY);
    }

    private setDragLimit(): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        const {shape, rotatedAngle} = parent.activeObj;
        if (actPoint && shape !== 'image' && shape !== 'line' && rotatedAngle === 0 && parent.activeObj.preventShapeDragOut) {
            const { destLeft, destTop, destWidth, destHeight } = parent.img;
            if (actPoint.startX < destLeft) {
                actPoint.startX = destLeft;
                actPoint.endX = Math.min(actPoint.startX + actPoint.width, destLeft + destWidth);
            }
            else if (actPoint.endX > destLeft + destWidth) {
                actPoint.endX = destLeft + destWidth;
                actPoint.startX = Math.max(actPoint.endX - actPoint.width, destLeft);
            }
            if (actPoint.startY < destTop) {
                actPoint.startY = destTop;
            }
            else if (actPoint.endY > destTop + destHeight) {
                actPoint.endY = destTop + destHeight;
                actPoint.startY = Math.max(actPoint.endY - actPoint.height, destTop);
            }
            parent.activeObj = this.updateWidthHeight(parent.activeObj);
        }
    }

    private drawCropRatio(): void {
        const parent: ImageEditor = this.parent; let actPoint: ActivePoint = parent.activeObj.activePoint;
        let x: number; let y: number; let width: number; let height: number;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        if (parent.transform.zoomFactor > 0 && this.currSelPoint) {
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            this.drawCustomSelection('crop-custom', null, null, null, null);
            if (parent.transform.straighten !== 0) {
                actPoint = parent.activeObj.activePoint;
            }
            if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
                width = actPoint.width < actPoint.height ? actPoint.width : actPoint.height;
                height = width;
            } else {
                width = actPoint.width; height = actPoint.height;
            }
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.activeObj = activeObj; parent.currObjType.shape = activeObj.shape;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            parent.currObjType.isCustomCrop = false;
        } else {
            width = destWidth; height = destHeight;
            if (destLeft < 0) {width += destLeft; }
            if (destTop < 0) {height += destTop; }
            if (destLeft + destWidth > parent.lowerCanvas.width) {
                width -= (destLeft + destWidth - parent.lowerCanvas.width); }
            if (destTop + destHeight > parent.lowerCanvas.height) {
                height -= (destTop + destHeight - parent.lowerCanvas.height); }
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
            if (width === destWidth && height === destHeight) {
                actPoint.startX += destLeft; actPoint.startY += destTop;
                actPoint.endX += destLeft; actPoint.endY += destTop;
            }
            if (parent.lowerCanvas.width > parent.lowerCanvas.height) {
                actPoint.height = actPoint.endY - actPoint.startY;
                actPoint.width = actPoint.height;
                actPoint.endX = actPoint.startX + actPoint.width;
            } else {
                actPoint.width = actPoint.endX - actPoint.startX;
                actPoint.height = actPoint.width;
                actPoint.endY = actPoint.startY + actPoint.height;
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
        case 'crop-2:3':
            x = 2; y = 3;
            break;
        case 'crop-3:4':
            x = 3; y = 4;
            break;
        case 'crop-4:5':
            x = 4; y = 5;
            break;
        case 'crop-5:7':
            x = 5; y = 7;
            break;
        case 'crop-9:16':
            x = 9; y = 16;
            break;
        default:
            x = parseInt(parent.currObjType.shape.toLowerCase().split('crop-')[1].split(':')[0]);
            y = parseInt(parent.currObjType.shape.toLowerCase().split('crop-')[1].split(':')[1]);
            break;
        }
        if (x !== undefined && y !== undefined) {
            parent.notify('selection', { prop: 'calcShapeRatio', onPropertyChange: false,
                value: { x: x, y: y, imgWidth: width, imgHeight: height }});
            if (width === destWidth && height === destHeight) {
                this.updatePoints();
            }
            actPoint = parent.activeObj.activePoint;
        }
        if (actPoint.startX < destLeft) {
            const diff: number = (destLeft - actPoint.startX) + 7.5;
            actPoint.startX += diff;
            actPoint.endX += diff;
        }
        if (actPoint.startY < destTop) {
            const diff: number = (destTop - actPoint.startY) + 7.5;
            actPoint.startY += diff;
            actPoint.endY += diff;
        }
        parent.activeObj = this.updateWidthHeight(parent.activeObj);
        this.adjToCenter();
        this.enlargeToImg();
        if (parent.transform.straighten !== 0) {
            this.adjToStraighten();
            this.updateActiveObject(parent.activeObj.activePoint, parent.activeObj);
        }
        const object: Object = { isIntersect: null, arr: null };
        let count: number = 0;
        actPoint = parent.activeObj.activePoint;
        if (parent.transform.straighten !== 0) {
            while (this.isLinesIntersect(object) && count < 100) {
                count++;
                let diff: number = (actPoint.width * 1) / 100;
                actPoint.startX += diff; actPoint.endX -= diff;
                diff = (actPoint.height * 1) / 100;
                actPoint.startY += diff; actPoint.endY -= diff;
                actPoint.width = actPoint.endX - actPoint.startX;
                actPoint.height = actPoint.endY - actPoint.startY;
                this.updateActiveObject(actPoint, parent.activeObj);
            }
        }
        this.straightenInitZoom = parent.transform.zoomFactor;
        this.straightenActObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        parent.notify('draw', { prop: 'resetStraightenDestPoints' });
        parent.notify('draw', { prop: 'setDestForStraighten' });
    }

    private adjToCenter(): void {
        const parent: ImageEditor = this.parent;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        const diffX: number = ((parent.lowerCanvas.width) / 2) - (actPoint.endX - actPoint.width / 2);
        const diffY: number = ((parent.lowerCanvas.height) / 2) - (actPoint.endY - actPoint.height / 2);
        actPoint.startX += diffX; actPoint.endX += diffX;
        actPoint.startY += diffY; actPoint.endY += diffY;
        if (actPoint.startX < (destLeft >= 7.5 ? destLeft : 7.5)) {
            const diff: number = ((destLeft >= 7.5 ? destLeft : 0) - actPoint.startX);
            actPoint.startX += diff;
            actPoint.endX += diff;
        } else if (actPoint.endX > destLeft + destWidth) {
            const diff: number = (actPoint.endX - (destLeft + destWidth));
            actPoint.startX -= diff;
            actPoint.endX -= diff;
        }
        if (actPoint.startY < (destTop >= 7.5 ? destTop : 7.5)) {
            const diff: number = ((destTop >= 7.5 ? destTop : 0) - actPoint.startY);
            actPoint.startY += diff;
            actPoint.endY += diff;
        } else if (actPoint.endY > destTop + destHeight) {
            const diff: number = (actPoint.endY - (destTop + destHeight));
            actPoint.startY -= diff;
            actPoint.endY -= diff;
        }
    }

    private enlargeToImg(): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.straighten === 0) {return; }
        if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
            let actPoint: ActivePoint = parent.activeObj.activePoint;
            let tempActPoint: ActivePoint = extend({}, actPoint, {}, true) as ActivePoint;
            let count: number = 0;
            while (true) {
                // Increase width and height by 5% from center to enlarge the crop selection
                count++;
                let diff: number = (actPoint.width * 5) / 100;
                actPoint.startX -= diff; actPoint.endX += diff;
                diff = (actPoint.height * 5) / 100;
                actPoint.startY -= diff; actPoint.endY += diff;
                actPoint.width = actPoint.endX - actPoint.startX;
                actPoint.height = actPoint.endY - actPoint.startY;
                this.updateActiveObject(actPoint, parent.activeObj);
                const object: Object = { isIntersect: null, arr: null };
                this.updateImgCanvasPoints();
                this.isLinesIntersect(object);
                if (object['arr'][0] || object['arr'][1] || object['arr'][2] || object['arr'][3] ||
                    actPoint.startX < 7.5 || actPoint.startY < 7.5 || count === 100) {
                    actPoint = extend({}, tempActPoint, {}, true) as ActivePoint;
                    diff = (actPoint.width * 1) / 100;
                    actPoint.startX += diff; actPoint.endX -= diff;
                    diff = (actPoint.height * 1) / 100;
                    actPoint.startY += diff; actPoint.endY -= diff;
                    actPoint.width = actPoint.endX - actPoint.startX;
                    actPoint.height = actPoint.endY - actPoint.startY;
                    this.updateActiveObject(actPoint, parent.activeObj);
                    break;
                }
                tempActPoint = extend({}, actPoint, {}, true) as ActivePoint;
            }
        }
    }

    private updateActiveObject(actPoint?: ActivePoint, obj?: SelectionPoint, isMouseMove?: boolean, x?: number, y?: number): void {
        const parent: ImageEditor = this.parent;
        actPoint = actPoint ? actPoint : extend({}, parent.activeObj.activePoint, {}, true) as ActivePoint;
        obj = obj ? obj : extend({}, parent.activeObj, {}, true) as SelectionPoint;
        actPoint.width = actPoint.endX - actPoint.startX;
        actPoint.height = actPoint.endY - actPoint.startY;
        const {startX, startY, endX, endY, width, height} = actPoint;
        x = x ? x : 0; y = y ? y : 0;
        const horCircleWidth: number = width / 2; const verCircleHeight: number = height / 2;
        const radius: number = 7.5;
        obj.horTopLine = {startX : startX + x, startY: startY - y,
            endX: endX + x, endY: endY + y};
        obj.horBottomLine = {startX : startX - x, startY: endY - y,
            endX: endX - x, endY: endY + y};
        obj.verLeftLine = {startX : startX + x, startY: startY - y,
            endX: startX - y, endY: endY - y};
        obj.verRightLine = {startX : endX + x, startY: startY + y,
            endX: endX - x, endY: endY + y};
        obj.topLeftCircle = {startX : startX, startY: startY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.topCenterCircle = {startX : startX + horCircleWidth, startY: startY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.topRightCircle = {startX : endX, startY: startY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.centerLeftCircle = {startX : startX, startY: startY + verCircleHeight,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.centerRightCircle = {startX : endX, startY: startY + verCircleHeight,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.bottomLeftCircle = {startX : startX, startY: endY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.bottomCenterCircle = {startX : startX + horCircleWidth, startY: endY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        obj.bottomRightCircle = {startX : endX, startY: endY,
            radius: obj.horTopLine.endX ? (radius) : 0};
        if (obj.rotatedAngle === 0) {
            obj.rotationCirclePoint = {x: obj.bottomCenterCircle.startX,
                y: obj.bottomCenterCircle.startY + 25};
            obj.rotationCirclePoint.ratioX = (obj.rotationCirclePoint.x - parent.img.destLeft) / parent.img.destWidth;
            obj.rotationCirclePoint.ratioY = (obj.rotationCirclePoint.y - parent.img.destTop) / parent.img.destHeight;
        }
        obj.activePoint = actPoint;
        if (isNullOrUndefined(isMouseMove)) {
            parent.activeObj = extend({}, obj, {}, true) as SelectionPoint;
        }
    }

    private drawOuterSelection(canvasDraw: CanvasRenderingContext2D, isCropCircle?: boolean): void {
        let splitWords: string[]; const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        let actObj: SelectionPoint = parent.activeObj;
        canvasDraw.lineWidth = (0.5);
        const tempObj: SelectionPoint = extend({}, actObj, {}, true) as SelectionPoint;
        if (actObj.shape) {
            splitWords  = actObj.shape.split('-');
        }
        if (((splitWords && splitWords[0] === 'crop') || actObj.shape === undefined) && !isCropCircle) {
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
        if (actObj.shape === 'arrow' || actObj.shape === 'line') {
            canvasDraw.beginPath();
            canvasDraw.moveTo(actPoint.startX, actPoint.startY);
            canvasDraw.lineTo(actPoint.endX, actPoint.endY);
            canvasDraw.stroke();
        } else if (actObj.shape === 'path') {
            canvasDraw.beginPath();
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            if (activeObj.pointColl[0]) {
                canvasDraw.moveTo(activeObj.pointColl[0].x, activeObj.pointColl[0].y);
                if (activeObj.pointColl.length > 1) {
                    for (let i: number = 1, len: number = activeObj.pointColl.length; i < len; i++) {
                        actPoint.endX = activeObj.pointColl[i as number].x;
                        actPoint.endY = activeObj.pointColl[i as number].y;
                        canvasDraw.lineTo(actPoint.endX, actPoint.endY);
                    }
                }
            }
            const obj: Object = {shape: null };
            parent.notify('selection', { prop: 'getCurrentDrawingShape', value: {obj: obj }});
            if (obj['shape'] === 'path') {
                parent.activeObj = actObj = activeObj;
            }
            canvasDraw.lineTo(actPoint.endX, actPoint.endY);
            canvasDraw.stroke();
        } else {
            this.drawCornerCircles(canvasDraw);
        }
        if (parent.selectionSettings.showCircle && (splitWords === undefined || splitWords[0] !== 'crop')) {
            const strokeColor: string = canvasDraw.strokeStyle as string;
            const fillColor: string = canvasDraw.fillStyle as string;
            canvasDraw.strokeStyle = parent.selectionSettings.strokeColor;
            canvasDraw.fillStyle = parent.selectionSettings.fillColor;
            if (actObj.shape === 'text') {
                canvasDraw.lineWidth *= 2;
                canvasDraw.beginPath();
                this.drawRotationArcLine(canvasDraw);
                canvasDraw.lineTo(actObj.rotationCirclePoint.x, actObj.rotationCirclePoint.y);
                canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
                canvasDraw.beginPath();
                canvasDraw.moveTo(actObj.rotationCirclePoint.x, actObj.rotationCirclePoint.y);
                canvasDraw.arc(actObj.rotationCirclePoint.x, actObj.rotationCirclePoint.y,
                               actObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
                canvasDraw.stroke();
                canvasDraw.fill();
                canvasDraw.closePath();
                canvasDraw.lineWidth /= 2;
            } else {
                if (parent.activeObj.shape !== 'redact') {
                    this.drawCenterCircles(canvasDraw);
                }
            }
            canvasDraw.strokeStyle = strokeColor; canvasDraw.fillStyle = fillColor;
        }
        tempObj.rotationCircleLine = actObj.rotationCircleLine;
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
        let actObj: SelectionPoint = parent.activeObj;
        const {strokeColor, fillColor, strokeWidth } = actObj.strokeSettings;
        const currentShape: string = shape !== undefined ? shape : parent.currObjType.shape;
        parent.currObjType.shape = currentShape; let canvasDraw: CanvasRenderingContext2D;
        if (canvas.toLowerCase() === 'original') {canvasDraw = this.lowerContext; }
        else if (canvas.toLowerCase() === 'duplicate') {canvasDraw = this.upperContext; }
        else if (saveContext) {canvasDraw = saveContext; }
        const shapeType: string = parent.currObjType.shape.toLowerCase();
        const shapeColl: string[] = ['rectangle', 'ellipse', 'line', 'arrow', 'path', 'image', 'redact'];
        if (shapeColl.indexOf(shapeType) !== -1) {
            actObj.shape = parent.currObjType.shape;
        }
        canvasDraw.strokeStyle = strokeColor;
        if (shape === 'text' || shape === 'freehanddraw') {
            canvasDraw.fillStyle = strokeColor;
        } else {
            canvasDraw.fillStyle = fillColor;
        }
        const horLineWidth: number = actPoint.width / 3;
        const verLineHeight: number = actPoint.height / 3;
        let selectionWidth: number = actPoint.endX - actPoint.startX;
        let selectionHeight: number = actPoint.endY - actPoint.startY;
        this.rotateContext('initial', canvasDraw);
        let degree: number; const tempFillStyle: string = canvasDraw.fillStyle as string; let activeObj: SelectionPoint;
        switch (parent.currObjType.shape.toLowerCase()) {
        case 'rectangle':
            this.drawSquareLines(canvasDraw);
            if (isNullOrUndefined(isPreventSelection) && canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'redact':
            this.drawRedact(canvasDraw, actObj);
            if (isNullOrUndefined(isPreventSelection) && canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            parent.currObjType.isRedact = true;
            break;
        case 'ellipse':
            selectionWidth = Math.abs(selectionWidth); selectionHeight = Math.abs(selectionHeight);
            canvasDraw.beginPath();
            canvasDraw.ellipse(actPoint.startX + (selectionWidth / 2),
                               actPoint.startY + (selectionHeight / 2),
                               selectionWidth / 2,  selectionHeight / 2, 0, 0, 2 * Math.PI, false);
            if (fillColor !== '') {
                canvasDraw.fillStyle = fillColor;
                canvasDraw.fill();
            }
            canvasDraw.ellipse(actPoint.startX + (selectionWidth / 2),
                               actPoint.startY + (selectionHeight / 2),
                               Math.abs((selectionWidth / 2) - (strokeWidth)),
                               Math.abs((selectionHeight / 2) - (strokeWidth)),
                               0, 0, 2 * Math.PI, false);
            canvasDraw.fillStyle = strokeColor;
            canvasDraw.fill('evenodd'); canvasDraw.closePath();
            if (isNullOrUndefined(isPreventSelection) && canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
            break;
        case 'crop-circle':
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
            if (actObj.shapeDegree === 0) {degree = parent.transform.degree; }
            else {degree = parent.transform.degree - actObj.shapeDegree; }
            if (degree < 0) {degree = 360 + degree; }
            canvasDraw.fillStyle = canvasDraw.strokeStyle;
            if (isNullOrUndefined(actObj.triangleDirection)) {
                actObj.triangleDirection = 'right';
            }
            if (isNullOrUndefined(actObj.start)) {
                actObj.start = 'none';
            }
            if (isNullOrUndefined(actObj.end)) {
                actObj.end = 'arrowSolid';
            }
            this.drawArrowHead(canvasDraw, true); this.drawArrowHead(canvasDraw, false);
            if (actObj.end === 'none') {
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
                if (obj['shape'] === 'path' && parent.isShapeDrawing) {
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
                        this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
                        if (Browser.isDevice) {
                            activeObj.activePoint.endX = nextPoint.x; activeObj.activePoint.endY = nextPoint.y;
                        }
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
                parent.activeObj = actObj = activeObj;
            } else {
                this.shapeLine(canvasDraw, actPoint.startX, actPoint.startY, actPoint.endX, actPoint.endY);
            }
            if (canvasDraw === this.upperContext) {this.drawOuterSelection(canvasDraw); }
            break;
        case 'text':
            this.shapeText(canvasDraw);
            break;
        case 'image':
            this.shapeImage(canvasDraw);
            if (isNullOrUndefined(isPreventSelection) && canvasDraw === this.upperContext) {
                this.drawOuterSelection(canvasDraw);
            }
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
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        const { destLeft, destTop } = parent.img;
        actPoint.startX += destLeft; actPoint.startY += destTop;
        actPoint.endX += destLeft; actPoint.endY += destTop;
        parent.activeObj = this.updateWidthHeight(parent.activeObj);
    }

    private updateWidthHeight(obj: SelectionPoint): SelectionPoint {
        const { startX, startY, endX, endY } = obj.activePoint;
        obj.activePoint.width = endX - startX;
        obj.activePoint.height = endY - startY;
        return obj;
    }

    private drawCornerCircles(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        const tempObj: SelectionPoint = parent.activeObj;
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

    private drawCenterCircles(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        let actObj: SelectionPoint = parent.activeObj;
        canvasDraw.lineWidth *= 2;
        canvasDraw.beginPath();
        if (actObj.shape === 'arrow' || actObj.shape === 'line') {
            canvasDraw.moveTo(actPoint.startX, actPoint.startY);
            canvasDraw.arc(actPoint.startX, actPoint.startY, actObj.topCenterCircle.radius, 0, 2 * Math.PI);
            canvasDraw.moveTo(actPoint.endX, actPoint.endY);
            canvasDraw.arc(actPoint.endX, actPoint.endY, actObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
        } else if (actObj.shape === 'path') {
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            if (activeObj.pointColl.length > 1) {
                for (let i: number = 1, len: number = activeObj.pointColl.length; i < len; i++) {
                    actPoint.startX = activeObj.pointColl[i - 1].x;
                    actPoint.startY = activeObj.pointColl[i - 1].y;
                    actPoint.endX = activeObj.pointColl[i as number].x;
                    actPoint.endY = activeObj.pointColl[i as number].y;
                    canvasDraw.moveTo(actPoint.startX, actPoint.startY);
                    canvasDraw.arc(actPoint.startX, actPoint.startY, actObj.topCenterCircle.radius, 0, 2 * Math.PI);
                    canvasDraw.moveTo(actPoint.endX, actPoint.endY);
                    canvasDraw.arc(actPoint.endX, actPoint.endY, actObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
                }
            }
            const obj: Object = {shape: null };
            parent.notify('selection', { prop: 'getCurrentDrawingShape', value: {obj: obj }});
            if (obj['shape'] === 'path') {
                parent.activeObj = actObj = activeObj;
            }
            canvasDraw.moveTo(actPoint.startX, actPoint.startY);
            canvasDraw.arc(actPoint.startX, actPoint.startY, actObj.topCenterCircle.radius, 0, 2 * Math.PI);
            canvasDraw.moveTo(actPoint.endX, actPoint.endY);
            canvasDraw.arc(actPoint.endX, actPoint.endY, actObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
        } else {
            this.drawRotationArcLine(canvasDraw);
            canvasDraw.lineTo(actObj.rotationCirclePoint.x, actObj.rotationCirclePoint.y);
        }
        canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
        if (actObj.shape !== 'arrow' && actObj.shape !== 'line' && actObj.shape !== 'path') {
            canvasDraw.beginPath();
            canvasDraw.moveTo(actObj.rotationCirclePoint.x, actObj.rotationCirclePoint.y);
            canvasDraw.arc(actObj.rotationCirclePoint.x, actObj.rotationCirclePoint.y,
                           actObj.bottomCenterCircle.radius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
        }
        canvasDraw.lineWidth /= 2;
    }

    private drawRotationArcLine(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        if (isNullOrUndefined(actObj.rotationCircleLine)) {
            actObj.rotationCircleLine = 22.5;
        }
        let degree: number; let isHorizontalflip: boolean = false; let isVerticalflip: boolean = false;
        if (actObj.shapeDegree === 0) {degree = parent.transform.degree; }
        else {degree = parent.transform.degree - actObj.shapeDegree; }
        if (degree < 0) {degree = 360 + degree; }
        if (actObj.flipObjColl) {
            for (let i: number = 0, len: number = actObj.flipObjColl.length; i < len; i++) {
                const flipStr: string = actObj.flipObjColl[i as number].toLowerCase();
                if (flipStr === 'horizontal') {
                    isHorizontalflip = true;
                } else if (flipStr === 'vertical') {
                    isVerticalflip = true;
                }
            }
        }
        switch (degree) {
        case 0:
        case 360:
            if (isVerticalflip) {
                actObj.rotationCirclePoint = {x: actObj.topCenterCircle.startX,
                    y: actObj.topCenterCircle.startY - actObj.rotationCircleLine};
                canvasDraw.moveTo(actObj.rotationCirclePoint.x,
                                  actObj.rotationCirclePoint.y + actObj.rotationCircleLine);
            } else {
                actObj.rotationCirclePoint = {x: actObj.bottomCenterCircle.startX,
                    y: actObj.bottomCenterCircle.startY + actObj.rotationCircleLine};
                canvasDraw.moveTo(actObj.rotationCirclePoint.x,
                                  actObj.rotationCirclePoint.y - actObj.rotationCircleLine);
            }
            break;
        case 90:
        case -270:
            if (isHorizontalflip) {
                actObj.rotationCirclePoint = {x: actObj.centerRightCircle.startX +
                    actObj.rotationCircleLine, y: actObj.centerLeftCircle.startY};
                canvasDraw.moveTo(actObj.rotationCirclePoint.x - actObj.rotationCircleLine,
                                  actObj.rotationCirclePoint.y);
            } else {
                actObj.rotationCirclePoint = {x: actObj.centerLeftCircle.startX -
                    actObj.rotationCircleLine, y: actObj.centerLeftCircle.startY};
                canvasDraw.moveTo(actObj.rotationCirclePoint.x + actObj.rotationCircleLine,
                                  actObj.rotationCirclePoint.y);
            }
            break;
        case 180:
        case -180:
            if (isVerticalflip) {
                actObj.rotationCirclePoint = {x: actObj.bottomCenterCircle.startX,
                    y: actObj.bottomCenterCircle.startY + actObj.rotationCircleLine};
                canvasDraw.moveTo(actObj.rotationCirclePoint.x,
                                  actObj.rotationCirclePoint.y - actObj.rotationCircleLine);
            } else {
                actObj.rotationCirclePoint = {x: actObj.topCenterCircle.startX,
                    y: actObj.topCenterCircle.startY - actObj.rotationCircleLine};
                canvasDraw.moveTo(actObj.rotationCirclePoint.x,
                                  actObj.rotationCirclePoint.y + actObj.rotationCircleLine);
            }
            break;
        case 270:
        case -90:
            if (isHorizontalflip) {
                actObj.rotationCirclePoint = {x: actObj.centerLeftCircle.startX -
                    actObj.rotationCircleLine, y: actObj.centerLeftCircle.startY};
                canvasDraw.moveTo(actObj.rotationCirclePoint.x + actObj.rotationCircleLine,
                                  actObj.rotationCirclePoint.y);
            } else {
                actObj.rotationCirclePoint = {x: actObj.centerRightCircle.startX +
                    actObj.rotationCircleLine, y: actObj.centerLeftCircle.startY};
                canvasDraw.moveTo(actObj.rotationCirclePoint.x - actObj.rotationCircleLine,
                                  actObj.rotationCirclePoint.y);
            }
            break;
        }
    }

    private drawSquareLines(canvasDraw: CanvasRenderingContext2D): void {
        let splitWords: string[]; const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const {startX, startY, width, height} = actObj.activePoint;
        const { fillColor, strokeColor, strokeWidth, radius } = actObj.strokeSettings;
        if (actObj.shape) {splitWords = actObj.shape.split('-'); }
        if (splitWords[0] === 'crop') {canvasDraw.strokeStyle = '#fff'; }
        else {canvasDraw.strokeStyle = strokeColor; }
        canvasDraw.beginPath();
        const obj: Object = {width: 0, height: 0 };
        let ratio: Dimension = {width: 1, height: 1 };
        parent.notify('crop', { prop: 'calcRatio', onPropertyChange: false,
            value: {obj: obj, dimension: {width: canvasDraw.canvas.width, height: canvasDraw.canvas.height }}});
        ratio = obj as Dimension;
        const isTempCanvas: boolean = canvasDraw.canvas.id === parent.element.id + '_tempCanvas';
        const zoomFactor: number = parent.transform.zoomFactor;
        const baseRadius: number = isTempCanvas ? radius * 10 * ((ratio.width + ratio.height) / 2) : radius * 10;
        const adjustedRadius: number = baseRadius + (baseRadius * zoomFactor);
        if (radius !== null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (canvasDraw as any).roundRect(startX, startY, width, height, adjustedRadius);
        } else {
            canvasDraw.rect(startX, startY, width, height);
        }
        if (fillColor !== '') {
            canvasDraw.fillStyle = fillColor; canvasDraw.fill();
        }
        if (radius !== null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (canvasDraw as any).roundRect(startX + strokeWidth, startY + strokeWidth, width - (2 * strokeWidth),
                                          height - (2 * strokeWidth), adjustedRadius);
        } else {
            canvasDraw.rect(startX + strokeWidth, startY + strokeWidth, width - (2 * strokeWidth), height - (2 * strokeWidth));
        }
        canvasDraw.fillStyle = strokeColor;
        canvasDraw.fill('evenodd'); canvasDraw.closePath();
    }

    private drawSelection(horLineWidth: number, verLineHeight: number): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const { startX, startY, endX, endY } = actObj.activePoint;
        this.upperContext.strokeStyle = parent.themeColl[parent.theme]['primaryColor'];
        this.upperContext.beginPath();
        actObj.horTopInnerLine = {startX: startX, startY: startY +
            verLineHeight, endX: endX, endY: endY + verLineHeight };
        actObj.horBottomInnerLine = {startX : startX, startY :
            startY + (2 * verLineHeight), endX: endX, endY: endY + (2 * verLineHeight)};
        actObj.verLeftInnerLine = {startX: startX + horLineWidth,
            startY: startY, endX: startX + horLineWidth, endY: endY};
        actObj.verRightInnerLine = {startX: startX + (2 * horLineWidth),
            startY: startY, endX: startX + (2 * horLineWidth), endY: endY};
        this.upperContext.moveTo(actObj.horTopInnerLine.startX, actObj.horTopInnerLine.startY);
        this.upperContext.lineTo(actObj.horTopInnerLine.endX, actObj.horTopInnerLine.startY);
        this.upperContext.moveTo(actObj.horBottomInnerLine.startX, actObj.horBottomInnerLine.startY);
        this.upperContext.lineTo(actObj.horBottomInnerLine.endX, actObj.horBottomInnerLine.startY);
        this.upperContext.moveTo(actObj.verLeftInnerLine.startX, actObj.verLeftInnerLine.startY);
        this.upperContext.lineTo(actObj.verLeftInnerLine.endX, actObj.verLeftInnerLine.endY);
        this.upperContext.moveTo(actObj.verRightInnerLine.startX, actObj.verRightInnerLine.startY);
        this.upperContext.lineTo(actObj.verRightInnerLine.endX, actObj.verRightInnerLine.endY);
        this.upperContext.stroke();
        this.upperContext.closePath();
    }

    private shapeCircle(canvasDraw: CanvasRenderingContext2D, selectionWidth: number, selectionHeight: number): void {
        const parent: ImageEditor = this.parent; const {startX, startY, endX, endY, width} = parent.activeObj.activePoint;
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
        canvasDraw.arc(((endX - startX) / 2) + startX,
                       ((endY - startY) / 2) + startY, (width / 2), 0, Math.PI * 2);
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

    private manipulateSaveCtx(canvasDraw: CanvasRenderingContext2D, x: number, y: number): Point {
        if (canvasDraw !== this.lowerContext && canvasDraw !== this.upperContext) {
            const obj: Object = {width: 0, height: 0 };
            this.parent.notify('crop', { prop: 'calcRatio', onPropertyChange: false,
                value: {obj: obj, dimension: {width: canvasDraw.canvas.width, height: canvasDraw.canvas.height }}});
            const ratio: Dimension = obj as Dimension;
            if (x) {x *= (ratio.width); }
            if (y) {y *= (ratio.height); }
        }
        return {x: x, y: y };
    }

    private arrow(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const {startX, startY, endX, endY} = actObj.activePoint; const strWidth: number = actObj.strokeSettings.strokeWidth;
        canvasDraw.lineWidth = strWidth;
        let x: number = this.arrowDimension['arrow']['width'];
        let y: number = this.arrowDimension['arrow']['height'];
        const point: Point = this.manipulateSaveCtx(canvasDraw, x, y);
        x = point.x + strWidth; y = point.y + strWidth;
        this.dx = endX - startX;
        this.dy = endY - startY;
        canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
        const angle: number = Math.atan2(this.dy, this.dx);
        const isStartArrow: boolean = actObj.start === 'arrow';
        const isEndArrow: boolean = actObj.end === 'arrow';
        const isEndCircleOrSquare: boolean = actObj.end === 'circle' || actObj.end === 'square';
        if ((start && actObj.triangleDirection === 'left' || actObj.triangleDirection === 'right') &&
            ((isStartArrow && actObj.end === 'none') || (isStartArrow && !isEndCircleOrSquare)) ||
            (!start && (isEndArrow && actObj.start === 'none' || !isStartArrow && !isEndCircleOrSquare))) {
            this.shapeLine(canvasDraw, startX, startY, endX, endY);
        }
        if ((start && actObj.triangleDirection === 'left') || (!start && actObj.triangleDirection === 'right')) {
            canvasDraw.translate(endX, endY);
            canvasDraw.rotate(angle); this.shapeLine(canvasDraw, 0, 0, -x, y / 2);
            this.shapeLine(canvasDraw, 0, 0, -x, -y / 2); canvasDraw.rotate(-angle);
            canvasDraw.translate(-endX, -endY);
        }
        else if ((start && actObj.triangleDirection === 'right') || (!start && actObj.triangleDirection === 'left')) {
            canvasDraw.translate(startX, startY);
            canvasDraw.rotate(angle); this.shapeLine(canvasDraw, 0, 0, x, y / 2);
            this.shapeLine(canvasDraw, 0, 0, x, -y / 2); canvasDraw.rotate(-angle);
            canvasDraw.translate(-startX, -startY);
        }
    }

    private arrowSolid(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const strWidth: number = actObj.strokeSettings.strokeWidth;
        const {startX, startY, endX, endY} = actObj.activePoint;
        let x: number = this.arrowDimension['arrowSolid']['width'];
        let y: number = this.arrowDimension['arrowSolid']['height'];
        const point: Point = this.manipulateSaveCtx(canvasDraw, x, y);
        x = point.x + strWidth; y = point.y + strWidth;
        this.dx = endX - startX;
        this.dy = endY - startY;
        const angle: number = Math.atan2(this.dy, this.dx);
        const isStartArrowSolid: boolean = actObj.start === 'arrowSolid';
        const isEndArrowSolid: boolean = actObj.end === 'arrowSolid';
        const isEndCircleOrSquare: boolean = actObj.end === 'circle' || actObj.end === 'square';
        if ((start && (isStartArrowSolid && actObj.end === 'none') || (isStartArrowSolid && !isEndCircleOrSquare)) ||
            (!start && (isEndArrowSolid && actObj.start === 'none' || !isStartArrowSolid && !isEndCircleOrSquare))) {
            this.shapeLine(canvasDraw, startX, startY, endX, endY);
        }
        if ((start && actObj.triangleDirection === 'left') || (!start && actObj.triangleDirection === 'right')) {
            canvasDraw.translate(endX, endY);
            canvasDraw.rotate(angle); canvasDraw.beginPath();
            canvasDraw.moveTo(strWidth, 0);
            canvasDraw.lineTo(-x + y / 2, y / 2); canvasDraw.lineTo(-x + y / 2, -y / 2);
            canvasDraw.closePath(); canvasDraw.fill(); canvasDraw.rotate(-angle);
            canvasDraw.translate(-endX, -endY);
            actObj.rotatedAngle = angle;
        }
        else if ((start && actObj.triangleDirection === 'right') || (!start && actObj.triangleDirection === 'left')) {
            canvasDraw.translate(startX, startY);
            canvasDraw.rotate(angle); canvasDraw.beginPath();
            canvasDraw.moveTo(0 - strWidth, 0);
            canvasDraw.lineTo(x - y / 2, y / 2); canvasDraw.lineTo(x - y / 2, -y / 2);
            canvasDraw.closePath(); canvasDraw.fill(); canvasDraw.rotate(-angle);
            canvasDraw.translate(-startX, -startY);
            actObj.rotatedAngle = angle;
        }
    }

    private arrowSquareStart(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const strWidth: number = actObj.strokeSettings.strokeWidth;
        const {startX, startY, endX, endY} = actObj.activePoint;
        const isStartSquare: boolean = actObj.start === 'square';
        const isEndCircle: boolean = actObj.end === 'circle';
        const isStartSquareSolid: boolean = actObj.start === 'squareSolid';
        const isEndCircleSolid: boolean = actObj.end === 'circleSolid';
        if ((isStartSquare && actObj.end === 'none') || (isStartSquare && !isEndCircle && actObj.start !== 'square') ||
            (isStartSquareSolid && isEndCircleSolid)) {
            this.shapeLine(canvasDraw, startX, startY, endX, endY);
        }
        canvasDraw.lineWidth = (strWidth);
        canvasDraw.beginPath(); canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
        let x: number = this.arrowDimension['square']['width'];
        let y: number = this.arrowDimension['square']['height'];
        const point: Point = this.manipulateSaveCtx(canvasDraw, x, y);
        x = point.x + strWidth; y = point.y + strWidth;
        this.dx = endX - startX;
        this.dy = endY - startY;
        const angle: number = Math.atan2(this.dy, this.dx);
        if (actObj.triangleDirection === 'left') {
            canvasDraw.translate(endX, endY);
            canvasDraw.rotate(angle);
            if (actObj.start === 'squareSolid') {
                canvasDraw.fillRect(-x + y / 2, -y / 2, x, y);
            }
            canvasDraw.strokeRect(-x + y / 2, -y / 2, x, y);
            canvasDraw.rotate(-angle);
            canvasDraw.translate(-endX, -endY);
            this.squareStartIntersectX1 = endX - (y / 2) * Math.cos(angle);
            this.squareStartIntersectY1 = endY - (y / 2) * Math.sin(angle);
            if (actObj.start === 'square' && actObj.end !== 'square' && actObj.end !== 'circle') {
                this.shapeLine(canvasDraw, startX, startY, this.squareStartIntersectX1, this.squareStartIntersectY1);
            } else if (actObj.start === 'square' && actObj.end === 'circle') {
                this.shapeLine(canvasDraw, this.endCircleIntersectX1, this.endCircleIntersectY1, this.squareStartIntersectX1,
                               this.squareStartIntersectY1);
            } else if (actObj.start === 'squareSolid' && actObj.end === 'squareSolid') {
                this.shapeLine(canvasDraw, startX, startY, endX, endY);
            }
        }
        else if (actObj.triangleDirection === 'right') {
            canvasDraw.lineWidth = (strWidth);
            canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
            if (actObj.start === 'squareSolid' && actObj.end === 'squareSolid') {
                this.shapeLine(canvasDraw, startX, startY, endX, endY);
            }
            canvasDraw.translate(startX, startY);
            canvasDraw.rotate(angle);
            if (actObj.start === 'squareSolid') {
                canvasDraw.fillRect(y / 2 - x, -y / 2, x, y);
            }
            canvasDraw.strokeRect(y / 2 - x, -y / 2, x, y);
            canvasDraw.rotate(-angle);
            canvasDraw.translate(-startX, -startY);
            actObj.rotatedAngle = angle;
            this.squareStartIntersectX1 = startX + (y / 2) * Math.cos(angle);
            this.squareStartIntersectY1 = startY + (y / 2) * Math.sin(angle);
            if (actObj.start === 'square' && actObj.end !== 'square' && actObj.end !== 'circle') {
                this.shapeLine(canvasDraw, endX, endY,
                               this.squareStartIntersectX1, this.squareStartIntersectY1);
            }
            if (actObj.start === 'square' && actObj.end === 'circle') {
                this.shapeLine(canvasDraw, this.endCircleIntersectX1, this.endCircleIntersectY1, this.squareStartIntersectX1,
                               this.squareStartIntersectY1);
            }
        }
    }

    private arrowSquareEnd(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const {startX, startY, endX, endY} = actObj.activePoint;
        const strWidth: number = actObj.strokeSettings.strokeWidth;
        let x: number = this.arrowDimension['square']['width'];
        let y: number = this.arrowDimension['square']['height'];
        const point: Point = this.manipulateSaveCtx(canvasDraw, x, y);
        x = point.x + strWidth; y = point.y + strWidth;
        this.dx = endX - startX;
        this.dy = endY - startY;
        const angle: number = Math.atan2(this.dy, this.dx);
        canvasDraw.lineWidth = (strWidth);
        if (actObj.triangleDirection === 'right') {
            canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
            if (actObj.end === 'squareSolid' && actObj.start === 'none') {
                this.shapeLine(canvasDraw, startX, startY, endX, endY);
            }
            canvasDraw.translate(endX, endY);
            canvasDraw.rotate(angle);
            if (actObj.end === 'squareSolid') {
                canvasDraw.fillRect(-x + y / 2, -y / 2, x, y);
            }
            canvasDraw.strokeRect(-x + y / 2, -y / 2, x, y);
            canvasDraw.rotate(-angle);
            canvasDraw.translate(-endX, -endY);
            actObj.rotatedAngle = angle;
            this.squareEndIntersectX1 = endX - (y / 2) * Math.cos(angle);
            this.squareEndIntersectY1 = endY - (y / 2) * Math.sin(angle);
            if (actObj.end === 'square' && actObj.start !== 'square' && actObj.start !== 'circle') {
                this.shapeLine(canvasDraw, startX, startY,
                               this.squareEndIntersectX1, this.squareEndIntersectY1);
            }
            else if (actObj.start === 'circle' && actObj.end === 'square') {
                this.shapeLine(canvasDraw, this.squareEndIntersectX1, this.squareEndIntersectY1,
                               this.startCircleIntersectX1, this.startCircleIntersectY1 );
            }
            else if (actObj.start === 'square' && actObj.end === 'square') {
                this.shapeLine(canvasDraw, this.squareEndIntersectX1, this.squareEndIntersectY1,
                               this.squareStartIntersectX1, this.squareStartIntersectY1);
            }
        }
        else if (actObj.triangleDirection === 'left') {
            canvasDraw.translate(startX, startY);
            canvasDraw.rotate(angle);
            if (actObj.end === 'squareSolid') {
                canvasDraw.fillRect(y / 2 - x, -y / 2, x, y);
            }
            canvasDraw.strokeRect(y / 2 - x, -y / 2, x, y);
            canvasDraw.rotate(-angle);
            canvasDraw.translate(-startX, -startY);
            actObj.rotatedAngle = angle;
            this.squareEndIntersectX1 = startX + (y / 2) * Math.cos(angle);
            this.squareEndIntersectY1 = startY + (y / 2) * Math.sin(angle);
            if (actObj.end === 'square' && actObj.start !== 'square' && actObj.start !== 'circle') {
                this.shapeLine(canvasDraw, endX, endY, this.squareEndIntersectX1, this.squareEndIntersectY1);
            }
            else if (actObj.start === 'circle' && actObj.end === 'square') {
                this.shapeLine(canvasDraw, this.squareEndIntersectX1, this.squareEndIntersectY1,
                               this.startCircleIntersectX1, this.startCircleIntersectY1);
            }
            else if (actObj.start === 'square' && actObj.end === 'square') {
                this.shapeLine(canvasDraw, this.squareEndIntersectX1, this.squareEndIntersectY1,
                               this.squareStartIntersectX1, this.squareStartIntersectY1);
            }
            else if (actObj.end === 'squareSolid' && actObj.start === 'none') {
                this.shapeLine(canvasDraw, startX, startY, endX, endY);
            }
        }
    }

    private arrowCircle(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const {startX, startY, endX, endY} = actObj.activePoint;
        const strWidth: number = actObj.strokeSettings.strokeWidth;
        if ((start && actObj.triangleDirection === 'left') ||
            (!start && actObj.triangleDirection === 'right')) {
            canvasDraw.lineWidth = strWidth;
            let circleRadius: number = this.arrowDimension['circle']['width'];
            const point: Point = this.manipulateSaveCtx(canvasDraw, circleRadius, null);
            circleRadius = point.x + strWidth;
            canvasDraw.beginPath();
            canvasDraw.arc(endX, endY, circleRadius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.closePath();
            this.dx = endX - startX;
            this.dy = endY - startY;
            const a: number = this.dx * this.dx + this.dy * this.dy;
            const b: number = 2 * (this.dx * (startX - endX) + this.dy * (startY - endY));
            const c: number = (startX - endX) * (startX - endX) + (startY - endY) *
                (startY - endY) - circleRadius * circleRadius;
            const intersect: number = b * b - 4 * a * c;
            if (intersect >= 0) {
                canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
                const t2: number = (-b - Math.sqrt(intersect)) / (2 * a);
                const intersectionX1: number = startX + this.dx * t2;
                const intersectionY1: number = startY + this.dy * t2;
                if (start) {
                    this.startCircleIntersectX1 = intersectionX1; this.startCircleIntersectY1 = intersectionY1;
                    this.endCircleIntersectX1 = endX - this.dx * t2;
                    this.endCircleIntersectY1 = endY - this.dy * t2;
                    canvasDraw.beginPath(); canvasDraw.fill(); canvasDraw.beginPath();
                    if (actObj.start === 'circle' && actObj.end === 'circle') {
                        this.shapeLine(canvasDraw, this.startCircleIntersectX1, this.startCircleIntersectY1,
                                       this.endCircleIntersectX1, this.endCircleIntersectY1);
                    }
                    else if (actObj.start === 'circle' && actObj.end !== 'circle' && actObj.end !== 'square') {
                        this.shapeLine(canvasDraw, startX, startY,
                                       this.startCircleIntersectX1, this.startCircleIntersectY1);
                    }
                    canvasDraw.stroke(); canvasDraw.closePath();
                } else {
                    this.endCircleIntersectX1 = intersectionX1; this.endCircleIntersectY1 = intersectionY1;
                    if (actObj.end === 'circle' && (actObj.start !== 'circle' && actObj.start !== 'square')) {
                        this.shapeLine(canvasDraw, startX, startY,
                                       this.endCircleIntersectX1, this.endCircleIntersectY1);
                    }
                }
            }
            const angle: number = Math.atan2(this.dy, this.dx);
            parent.activeObj.rotatedAngle = angle;
        }
        else if ((start && actObj.triangleDirection === 'right') ||
            (!start && actObj.triangleDirection === 'left')) {
            canvasDraw.lineWidth = strWidth;
            let circleRadius: number = this.arrowDimension['circle']['width'];
            const point: Point = this.manipulateSaveCtx(canvasDraw, circleRadius, null);
            circleRadius = point.x + strWidth;
            canvasDraw.beginPath();
            canvasDraw.arc(startX, startY, circleRadius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.closePath();
            this.dx = startX - endX;
            this.dy = startY - endY;
            const a: number = this.dx * this.dx + this.dy * this.dy;
            const b: number = 2 * (this.dx * (endX - startX) + this.dy * (endY - startY));
            const c: number = (endX - startX) * (endX - startX) + (endY - startY) *
                (endY - startY) - circleRadius * circleRadius;
            const intersect: number = b * b - 4 * a * c;
            if (intersect >= 0) {
                canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
                const t2: number = (-b - Math.sqrt(intersect)) / (2 * a);
                const intersectionX1: number = endX + this.dx * t2;
                const intersectionY1: number = endY + this.dy * t2;
                if (start) {
                    this.startCircleIntersectX1 = intersectionX1; this.startCircleIntersectY1 = intersectionY1;
                    this.endCircleIntersectX1 = startX - this.dx * t2;
                    this.endCircleIntersectY1 = startY - this.dy * t2;
                    if (actObj.start === 'circle' && actObj.end === 'circle') {
                        this.shapeLine(canvasDraw, this.endCircleIntersectX1, this.endCircleIntersectY1,
                                       this.startCircleIntersectX1, this.startCircleIntersectY1);
                    } else if (actObj.start === 'circle' && actObj.end !== 'circle' && actObj.end !== 'square') {
                        this.shapeLine(canvasDraw, endX, endY,
                                       this.startCircleIntersectX1, this.startCircleIntersectY1);
                    }
                } else {
                    this.endCircleIntersectX1 = intersectionX1; this.endCircleIntersectY1 = intersectionY1;
                    canvasDraw.beginPath(); canvasDraw.fill(); canvasDraw.beginPath();
                    if (actObj.end === 'circle' && (actObj.start !== 'circle' && actObj.start !== 'square')) {
                        this.shapeLine(canvasDraw, endX, endY, this.endCircleIntersectX1, this.endCircleIntersectY1);
                    }
                }
            }
            const angle: number = Math.atan2(this.dy, this.dx);
            parent.activeObj.rotatedAngle = angle;
        }
    }

    private arrowCircleSolid(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const {startX, startY, endX, endY} = actObj.activePoint; const isStartCircleSolid: boolean = actObj.start === 'circleSolid';
        const strWidth: number = actObj.strokeSettings.strokeWidth;
        if ((start && actObj.triangleDirection === 'left') || (!start && actObj.triangleDirection === 'right')) {
            canvasDraw.lineWidth = strWidth;
            canvasDraw.beginPath();
            canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
            if ((start && (isStartCircleSolid && actObj.end === 'none') ||
                (isStartCircleSolid && actObj.end !== 'circle' && actObj.end !== 'square')) ||
                (!start && (actObj.end === 'circleSolid' && actObj.start === 'none'))) {
                this.shapeLine(canvasDraw, startX, startY, endX, endY);
            }
            let circleRadius: number = this.arrowDimension['circle']['width'];
            const point: Point = this.manipulateSaveCtx(canvasDraw, circleRadius, null);
            circleRadius = point.x + strWidth;
            this.dx = endX - startX;
            this.dy = endY - startY;
            canvasDraw.save(); canvasDraw.beginPath();
            canvasDraw.arc(endX, endY, circleRadius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
            actObj.rotatedAngle = Math.atan2(this.dy, this.dx);
        } else if ((start && actObj.triangleDirection === 'right') || (!start && actObj.triangleDirection === 'left')) {
            canvasDraw.lineWidth = strWidth;
            canvasDraw.beginPath();
            canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
            if ((start && (isStartCircleSolid && actObj.end === 'none') ||
                (isStartCircleSolid && actObj.end !== 'circle' && actObj.end !== 'square')) ||
                !start && (actObj.end === 'circleSolid' && actObj.start === 'none')) {
                this.shapeLine(canvasDraw, startX, startY, endX, endY);
            }
            let circleRadius: number = this.arrowDimension['circle']['width'];
            const point: Point = this.manipulateSaveCtx(canvasDraw, circleRadius, null);
            circleRadius = point.x + strWidth;
            this.dx = endX - startX;
            this.dy = endY - startY;
            canvasDraw.save(); canvasDraw.beginPath();
            canvasDraw.arc(startX, startY, circleRadius, 0, 2 * Math.PI);
            canvasDraw.stroke(); canvasDraw.fill(); canvasDraw.closePath();
            actObj.rotatedAngle = Math.atan2(this.dy, this.dx);
        }
    }

    private arrowBar(canvasDraw: CanvasRenderingContext2D, start: boolean): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const {startX, startY, endX, endY} = actObj.activePoint;
        const strWidth: number = actObj.strokeSettings.strokeWidth;
        if ((start && actObj.triangleDirection === 'left') || (!start && actObj.triangleDirection === 'right')) {
            canvasDraw.lineWidth = strWidth;
            canvasDraw.beginPath();
            canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
            if ((start && (actObj.start === 'bar' && actObj.end === 'none') ||
                (actObj.start === 'bar' && (actObj.end !== 'circle' && actObj.end !== 'square'))) ||
                (!start && ((actObj.end === 'bar' && actObj.start === 'none') ||
                (actObj.end === 'bar' && (actObj.start !== 'circle' && actObj.start !== 'square'))))) {
                this.shapeLine(canvasDraw, startX, startY, endX, endY);
            }
            let x: number = this.arrowDimension['bar']['width'];
            let y: number = this.arrowDimension['bar']['height'];
            const point: Point = this.manipulateSaveCtx(canvasDraw, x, y);
            x = point.x + strWidth; y = point.y + strWidth;
            this.dx = endX - startX;
            this.dy = endY - startY;
            const angle: number = Math.atan2(this.dy, this.dx);
            canvasDraw.translate(endX, endY);
            canvasDraw.rotate(angle); canvasDraw.fillRect(-x + y / 4, -y / 2, x, y); canvasDraw.rotate(-angle);
            canvasDraw.translate(-endX, -endY);
            actObj.rotatedAngle = angle;
        } else if ((start && actObj.triangleDirection === 'right') || (!start && actObj.triangleDirection === 'left')) {
            canvasDraw.lineWidth = strWidth;
            canvasDraw.beginPath();
            canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
            if ((start && (actObj.start === 'bar' && actObj.end === 'none')
                || (actObj.start === 'bar' && (actObj.end !== 'circle' && actObj.end !== 'square'))) ||
                (!start && (actObj.end === 'bar' && actObj.start === 'none'))) {
                this.shapeLine(canvasDraw, startX, startY, endX, endY);
            }
            let x: number = this.arrowDimension['bar']['width'];
            let y: number = this.arrowDimension['bar']['height'];
            const point: Point = this.manipulateSaveCtx(canvasDraw, x, y);
            x = point.x + strWidth; y = point.y + strWidth;
            this.dx = endX - startX;
            this.dy = endY - startY;
            const angle: number = Math.atan2(this.dy, this.dx);
            canvasDraw.translate(startX, startY);
            canvasDraw.rotate(angle); canvasDraw.fillRect(y / 4 - x, -y / 2, x, y); canvasDraw.rotate(-angle);
            canvasDraw.translate(-startX, -startY);
            parent.activeObj.rotatedAngle = angle;
        }
    }

    private shapeImage(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const {startX, startY, width, height} = actObj.activePoint;
        const ctx: CanvasRenderingContext2D = actObj.imageCanvas.getContext('2d');
        if (canvasDraw === this.lowerContext && this.isImageApply) {
            const dimObj: Object = {width: 0, height: 0 };
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false, value: {width: actObj
                .imageElement.width, height: actObj.imageElement.height, obj: dimObj, isImgShape: null }});
            if (width < (dimObj['width'] / 5) || height < (dimObj['height'] / 5)) {
                ctx.clearRect(0, 0, actObj.imageCanvas.width, actObj.imageCanvas.height);
                parent.notify('selection', { prop: 'applyTransformToImg', onPropertyChange: false, value: {ctx: ctx }});
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate' }});
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                parent.notify('selection', { prop: 'setImageClarity', onPropertyChange: false, value: {bool: false }});
                this.isImageApply = false;
            }
        }
        const imgPoint: ActivePoint = {startX: 0, startY: 0, width: 0, height: 0 };
        imgPoint.width = width; imgPoint.height = height;
        if (actObj.flipObjColl.length === 4) {
            actObj.flipObjColl = []; actObj.shapeFlip = '';
        }
        imgPoint.startX = ((width - imgPoint.width) / 2) + startX;
        imgPoint.startY = ((height - imgPoint.height) / 2) + startY;
        const temp: number = canvasDraw.globalAlpha;
        canvasDraw.globalAlpha = actObj.opacity;
        if (actObj.rotateFlipColl && actObj.rotateFlipColl.length > 0) {
            this.rotateImage(canvasDraw);
        } else {
            canvasDraw.drawImage(actObj.imageCanvas, imgPoint.startX, imgPoint.startY, imgPoint.width, imgPoint.height);
        }
        canvasDraw.globalAlpha = temp;
        parent.currObjType.isText = false;
    }

    private shapeText(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        const filter: string = canvasDraw.filter; const actObj: SelectionPoint = parent.activeObj;
        const { startX, startY, width, height } = actObj.activePoint;
        const rows: string[] = actObj.keyHistory.split('\n');
        const { fontFamily, bold, italic } = actObj.textSettings;
        let { fontSize } = actObj.textSettings;
        const lHeight: number = fontSize + fontSize * 0.25;
        const lineHeight: number = ((lHeight * rows.length) - (fontSize * rows.length)) / rows.length;
        canvasDraw.filter = 'none';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tempFill: any = canvasDraw.fillStyle;
        if (actObj.strokeSettings.fillColor !== '' ) {
            canvasDraw.fillStyle = actObj.strokeSettings.fillColor;
            canvasDraw.fillRect(actObj.activePoint.startX, actObj.activePoint.startY,
                                actObj.activePoint.width, actObj.activePoint.height);
        }
        canvasDraw.fillStyle = tempFill;
        for (let i: number = 0; i < rows.length; i++) {
            const text: string = rows[i as number];
            const yPoint: number = ((i + 1) * fontSize * 0.85) + (i * lineHeight);
            if (parent.transform.degree === -360) {parent.transform.degree = 0; }
            if (parent.transform.degree === 0 || parent.transform.degree === 180) {
                if (fontSize > height) {
                    fontSize = actObj.textSettings.fontSize = height - (height * 0.1);
                }
            }
            else {
                if (fontSize > width) {
                    fontSize = actObj.textSettings.fontSize = width - (width * 0.1);
                }
            }
            canvasDraw.strokeStyle = actObj.strokeSettings.outlineColor;
            canvasDraw.fillStyle = actObj.strokeSettings.strokeColor;
            const tempWidth: number = canvasDraw.lineWidth;
            const obj: Object = {width: 0, height: 0 };
            let ratio: Dimension = {width: 1, height: 1 };
            parent.notify('crop', { prop: 'calcRatio', onPropertyChange: false,
                value: {obj: obj, dimension: {width: canvasDraw.canvas.width, height: canvasDraw.canvas.height }}});
            ratio = obj as Dimension;
            const isTempCanvas: boolean = canvasDraw.canvas.id === parent.element.id + '_tempCanvas';
            const baseWidth: number = Math.max(1, actObj.strokeSettings.outlineWidth / 2);
            if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$|^[a-zA-Z]+$/.test(actObj.strokeSettings.outlineColor)) {
                canvasDraw.lineWidth = baseWidth * ((isTempCanvas ? Math.floor((fontSize - 1) / 60) :
                    Math.floor((fontSize - 1) / 16)) * 0.5 + 0.5);
                if (isTempCanvas) {
                    canvasDraw.lineWidth *= ((ratio.width + ratio.height) / 2);
                    if (parent.transform.degree !== 0) {
                        canvasDraw.lineWidth /= 1.8;
                    }
                }
            } else {
                canvasDraw.lineWidth = 0;
            }
            let textStyle: string = '';
            if (bold) {textStyle = 'bold '; }
            if (italic) {textStyle = 'italic '; }
            if (bold && italic) {textStyle = 'italic bold '; }
            canvasDraw.font = textStyle + fontSize + 'px' + ' ' + fontFamily;
            if (actObj.flipObjColl.length === 4) {
                actObj.flipObjColl = []; actObj.shapeFlip = '';
            }
            if (actObj.rotateFlipColl && actObj.rotateFlipColl.length > 0) {
                this.rotateText(canvasDraw);
            } else {
                canvasDraw.strokeText(text, startX + fontSize * 0.1, startY + yPoint);
                canvasDraw.fillText(text, startX + fontSize * 0.1, startY + yPoint);
            }
            canvasDraw.lineWidth = tempWidth;
        }
        canvasDraw.filter = filter;
        parent.currObjType.isText = false;
        if (this.upperContext === canvasDraw) {
            this.drawOuterSelection(canvasDraw);
        }
    }

    private updateActPoint(degree: string, canvasDraw: CanvasRenderingContext2D): ActivePoint {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const actPoint: ActivePoint = actObj.activePoint;
        if (degree.toLowerCase() === 'horizontal') {
            if (actPoint.startX <= canvasDraw.canvas.width / 2) {
                actPoint.startX = canvasDraw.canvas.width / 2 + ((canvasDraw.canvas.width / 2) - actPoint.endX);
                actPoint.endX = actPoint.startX + actPoint.width;
                this.updateActiveObject(actPoint, actObj);
                parent.activeObj = actObj;
            } else if (actPoint.startX >= canvasDraw.canvas.width / 2) {
                actPoint.startX = canvasDraw.canvas.width - actPoint.endX;
                actPoint.endX = actPoint.startX + actPoint.width;
                this.updateActiveObject(actPoint, actObj);
                parent.activeObj = actObj;
            }
        }
        else if (degree.toLowerCase() === 'vertical') {
            if (actPoint.startY <= canvasDraw.canvas.height / 2) {
                actPoint.startY = canvasDraw.canvas.height / 2 + ((canvasDraw.canvas.height / 2) - actPoint.endY);
                actPoint.endY = actPoint.startY + actPoint.height;
                this.updateActiveObject(actPoint, actObj);
                parent.activeObj = actObj;
            } else if (actPoint.startY >= canvasDraw.canvas.height / 2) {
                actPoint.startY = canvasDraw.canvas.height - actPoint.endY;
                actPoint.endY = actPoint.startY + actPoint.height;
                this.updateActiveObject(actPoint, actObj);
                parent.activeObj = actObj;
            }
        }
        return actPoint;
    }

    private rotateImage(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; let degree: number; let actObj: SelectionPoint = parent.activeObj;
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
        if (actObj.shapeDegree === 0) {degree = parent.transform.degree; }
        else {degree = parent.transform.degree - actObj.shapeDegree; }
        if (degree === -450) {degree = -90; }
        if (degree < 0) {degree = 360 + degree; }
        const imgPoint: ActivePoint = {startX: 0, startY: 0, width: 0, height: 0 };
        imgPoint.width = degree % 90 === 0 && degree % 180 !== 0 ? actObj.activePoint.height : actObj.activePoint.width;
        imgPoint.height = degree % 90 === 0 && degree % 180 !== 0 ? actObj.activePoint.width :
            actObj.activePoint.height;
        imgPoint.startX = actObj.activePoint.startX;
        imgPoint.startY = actObj.activePoint.startY;
        let startX: number = imgPoint.startX;
        let startY: number = imgPoint.startY;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        let tempDegree: number; const tempColl: any = [];
        canvasDraw.save();
        for (let i: number = 0, len: number = actObj.rotateFlipColl.length; i < len; i++) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            let coll: any = actObj.rotateFlipColl[i as number];
            tempColl.push(coll);
            if (typeof(coll) === 'number') {
                if (actObj.shapeDegree === 0) {tempDegree = coll; }
                else {tempDegree = coll - actObj.shapeDegree; }
                if (tempDegree === -450) {tempDegree = -90; }
                if (tempDegree < 0) {tempDegree = 360 + tempDegree; }
                imgPoint.width = tempDegree % 90 === 0 && tempDegree % 180 !== 0 ? actObj.activePoint.height : actObj.activePoint.width;
                imgPoint.height = tempDegree % 90 === 0 && tempDegree % 180 !== 0 ? actObj.activePoint.width :
                    actObj.activePoint.height;
                canvasDraw.translate(canvasDraw.canvas.width / 2, canvasDraw.canvas.height / 2);
                canvasDraw.rotate(Math.PI / 180 * coll);
                canvasDraw.translate(-canvasDraw.canvas.height / 2, -canvasDraw.canvas.width / 2);
                if ((tempDegree % 90 === 0 && tempDegree % 270 !== 0) || tempDegree === 0) {
                    startY = canvasDraw.canvas.width - (actObj.activePoint.startX + actObj.activePoint.width);
                    startY += ((actObj.activePoint.width - imgPoint.height) / 2);
                    startX = imgPoint.startY;
                } else if (tempDegree % 270 === 0) {
                    startX = canvasDraw.canvas.height - (actObj.activePoint.startY + actObj.activePoint.height);
                    startX += ((actObj.activePoint.height - imgPoint.width) / 2);
                    startY = imgPoint.startX;
                }
                imgPoint.startX = startX; imgPoint.startY = startY;
                actObj.activePoint.startX = startX; actObj.activePoint.startY = startY;
                actObj.activePoint.endX = actObj.activePoint.startX + imgPoint.width;
                actObj.activePoint.endY = actObj.activePoint.startY + imgPoint.height;
                actObj = this.updateWidthHeight(actObj);
            } else {
                if (coll === 'horizontal' && degree % 90 === 0 && degree % 180 !== 0) {
                    coll = 'vertical';
                } else if (coll === 'vertical' && degree % 90 === 0 && degree % 180 !== 0) {
                    coll = 'horizontal';
                }
                if (coll === 'horizontal') {
                    canvasDraw.translate(canvasDraw.canvas.width, 0); canvasDraw.scale(-1, 1);
                    actObj.activePoint = this.updateActPoint('horizontal', canvasDraw);
                } else if (coll === 'vertical') {
                    canvasDraw.translate(0, canvasDraw.canvas.height); canvasDraw.scale(1, -1);
                    actObj.activePoint = this.updateActPoint('vertical', canvasDraw);
                }
                imgPoint.startX = actObj.activePoint.startX; imgPoint.startY = actObj.activePoint.startY;
            }
            imgPoint.startX = actObj.activePoint.startX;
            imgPoint.startY = actObj.activePoint.startY;
            startX = imgPoint.startX; startY = imgPoint.startY;
        }
        if (actObj.rotatedAngle !== 0) {
            parent.notify('shape', { prop: 'setPointCollForShapeRotation', onPropertyChange: false, value: { obj: actObj } });
        }
        canvasDraw.drawImage(actObj.imageCanvas, imgPoint.startX, imgPoint.startY, imgPoint.width, imgPoint.height);
        canvasDraw.restore();
        parent.activeObj = tempActiveObj;
        if (parent.transform.degree === 360 || parent.transform.degree === -360) {
            parent.transform.degree = 0;
        }
    }

    private rotateText(canvasDraw: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent; let degree: number; let actObj: SelectionPoint = parent.activeObj;
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
        let actPoint: ActivePoint = parent.activeObj.activePoint;
        if (actObj.shapeDegree === 0) {degree = parent.transform.degree; }
        else {degree = parent.transform.degree - actObj.shapeDegree; }
        if (degree === -450) {degree = -90; }
        if (degree < 0) {degree = 360 + degree; }
        const imgPoint: ActivePoint = {startX: 0, startY: 0, width: 0, height: 0 };
        imgPoint.width = degree % 90 === 0 && degree % 180 !== 0 ? actPoint.height : actPoint.width;
        imgPoint.height = degree % 90 === 0 && degree % 180 !== 0 ? actPoint.width : actPoint.height;
        imgPoint.startX = actPoint.startX;
        imgPoint.startY = actPoint.startY;
        let startX: number = imgPoint.startX;
        let startY: number = imgPoint.startY;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        let tempDegree: number; const tempColl: any = [];
        canvasDraw.save();
        for (let i: number = 0, len: number = actObj.rotateFlipColl.length; i < len; i++) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            let coll: any = actObj.rotateFlipColl[i as number];
            tempColl.push(coll);
            if (typeof(coll) === 'number') {
                if (actObj.shapeDegree === 0) {tempDegree = coll; }
                else {tempDegree = coll - actObj.shapeDegree; }
                if (tempDegree === -450) {tempDegree = -90; }
                if (tempDegree < 0) {tempDegree = 360 + tempDegree; }
                imgPoint.width = tempDegree % 90 === 0 && tempDegree % 180 !== 0 ? actPoint.height : actPoint.width;
                imgPoint.height = tempDegree % 90 === 0 && tempDegree % 180 !== 0 ? actPoint.width : actPoint.height;
                canvasDraw.translate(canvasDraw.canvas.width / 2, canvasDraw.canvas.height / 2);
                canvasDraw.rotate(Math.PI / 180 * coll);
                canvasDraw.translate(-canvasDraw.canvas.height / 2, -canvasDraw.canvas.width / 2);
                if ((tempDegree % 90 === 0 && tempDegree % 270 !== 0) || tempDegree === 0) {
                    startY = (canvasDraw.canvas.width - actPoint.endX);
                    startX = actPoint.startY;
                } else if (tempDegree % 270 === 0) {
                    startX = canvasDraw.canvas.height - actPoint.endY;
                    startY = actPoint.startX;
                }
                imgPoint.startX = startX; imgPoint.startY = startY;
                actPoint.startX = startX; actPoint.startY = startY;
                actPoint.endX = actPoint.startX + imgPoint.width;
                actPoint.endY = actPoint.startY + imgPoint.height;
                actObj = this.updateWidthHeight(actObj);
            } else {
                if (coll === 'horizontal' && degree % 90 === 0 && degree % 180 !== 0) {
                    coll = 'vertical';
                } else if (coll === 'vertical' && degree % 90 === 0 && degree % 180 !== 0) {
                    coll = 'horizontal';
                }
                if (coll === 'horizontal') {
                    canvasDraw.translate(canvasDraw.canvas.width, 0); canvasDraw.scale(-1, 1);
                } else if (coll === 'vertical') {
                    canvasDraw.translate(0, canvasDraw.canvas.height); canvasDraw.scale(1, -1);
                }
                actObj.activePoint = actPoint = this.updateActPoint(coll, canvasDraw);
                imgPoint.startX = actPoint.startX; imgPoint.startY = actPoint.startY;
            }
            imgPoint.startX = actPoint.startX;
            imgPoint.startY = actPoint.startY;
            startX = imgPoint.startX; startY = imgPoint.startY;
        }
        if (actObj.rotatedAngle !== 0) {
            parent.notify('shape', { prop: 'setPointCollForShapeRotation', onPropertyChange: false, value: { obj: actObj } });
        }
        startY += actObj.textSettings.fontSize * 0.4;
        this.textFlipDegree(canvasDraw, startX, startY);
        canvasDraw.restore();
        parent.activeObj = tempActiveObj;
        if (parent.transform.degree === 360 || parent.transform.degree === -360) {
            parent.transform.degree = 0;
        }
    }

    private textFlipDegree(canvasDraw: CanvasRenderingContext2D, startX: number, startY: number): void {
        const parent: ImageEditor = this.parent; const actObj: SelectionPoint = parent.activeObj;
        const rows: string[] = actObj.keyHistory.split('\n');
        const fontSize: number = actObj.textSettings.fontSize;
        const lineHeight: number = ((fontSize * rows.length) - (fontSize * rows.length)) / rows.length;
        let yPoint: number = (fontSize * 0.85) + lineHeight;
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            const text: string = rows[i as number];
            if (i > 0) {
                if (i === 1) {
                    yPoint -= (fontSize * 0.85);
                }
                yPoint += fontSize + fontSize * 0.15;
            }
            canvasDraw.strokeText(text, startX + fontSize * 0.15, startY +
                yPoint + (i > 0 ? fontSize * 0.25 : -fontSize * 0.35));
            canvasDraw.fillText(text, startX + fontSize * 0.15, startY +
                yPoint + (i > 0 ? fontSize * 0.25 : -fontSize * 0.35));
        }
    }

    private clearOuterCanvas(context: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        const {destLeft, destTop, destWidth, destHeight} = parent.img;
        const left: number = destLeft > 0 ? destLeft : 0;
        const top: number = destTop > 0 ? destTop : 0;
        context.clearRect(0, 0, left, parent.lowerCanvas.height);
        context.clearRect(destLeft + destWidth, 0, parent.lowerCanvas.width - (destLeft + destWidth), parent.lowerCanvas.height);
        context.clearRect(0, 0, parent.lowerCanvas.width, top);
        context.clearRect(0, destTop + destHeight, parent.lowerCanvas.width, parent.lowerCanvas.height - (destTop + destHeight));
        if (parent.transform.currFlipState !== '') {
            parent.img.destLeft = destLeft; parent.img.destTop = destTop;
        }
    }

    private setDestPoints(): void {
        let maxDimension: Dimension; const parent: ImageEditor = this.parent;
        const { degree, zoomFactor } = parent.transform;
        if (degree % 90 === 0 && degree % 180 !== 0) {
            const obj: Object = {width: 0, height: 0 };
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
                value: {width: parent.img.srcHeight, height: parent.img.srcWidth, obj: obj, isImgShape: null}});
            maxDimension = obj as Dimension;
            if (this.isRotateZoom) {
                maxDimension.width += (maxDimension.width * zoomFactor);
                maxDimension.height += (maxDimension.height * zoomFactor);
                parent.img.destWidth = maxDimension.height; parent.img.destHeight = maxDimension.width;
            }
            parent.img.destLeft = (parent.lowerCanvas.clientWidth - maxDimension.height) / 2;
            parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.width) / 2;
            parent.img.destWidth = maxDimension.height; parent.img.destHeight = maxDimension.width;
        } else {
            const obj: Object = {width: 0, height: 0 };
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
                value: {width: parent.img.srcWidth, height: parent.img.srcHeight, obj: obj, isImgShape: null}});
            maxDimension = obj as Dimension;
            if (this.isRotateZoom) {
                maxDimension.width += (maxDimension.width * zoomFactor);
                maxDimension.height += (maxDimension.height * zoomFactor);
                parent.img.destWidth = maxDimension.width; parent.img.destHeight = maxDimension.height;
            }
            parent.img.destLeft = (parent.lowerCanvas.clientWidth - maxDimension.width) / 2;
            if (degree === 0) {
                parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.height + 1) / 2;
            } else {
                parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.height) / 2;
            }
            parent.img.destWidth = maxDimension.width; parent.img.destHeight = maxDimension.height;
        }
    }

    private updateCurrTransState(type: string, isPreventDestination?: boolean, isRotatePan?: boolean, isStraighten?: boolean): void {
        const parent: ImageEditor = this.parent;
        const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
        if (type === 'initial') {
            this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
            if (isNullOrUndefined(isPreventDestination)) {this.setDestPoints(); }
        }
        if (parent.isCircleCrop || (parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle')) {
            this.currTransState(type, true, null, isRotatePan);
            if (parent.transform.degree === 0 && parent.transform.currFlipState === '' && parent.transform.straighten === 0 &&
                isNullOrUndefined(isStraighten)) {
                parent.img.destLeft = destLeft; parent.img.destTop = destTop;
            }
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
        } else {
            this.currTransState(type, null, null, isRotatePan);
            if (parent.transform.degree === 0 && parent.transform.currFlipState === '' && parent.transform.straighten === 0 &&
                isNullOrUndefined(isStraighten)) {
                parent.img.destLeft = destLeft; parent.img.destTop = destTop;
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
        } else if (value === 'vertical' && parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
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
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        this.drawImage();
        if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
        }
        this.lowerContext.filter = temp;
    }

    private renderImage(isMouseWheel?: boolean, isPreventClearRect?: boolean, isFrame?: boolean, isStraighten?: boolean): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: null}});
        if (isNullOrUndefined(isPreventClearRect)) {
            this.upperContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
            this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        }
        if (isMouseWheel) {this.setTransformColl(this.lowerContext, 'initial'); }
        else {
            if (parent.transform.zoomFactor !== 0) {this.isRotateZoom = true; }
            this.updateCurrTransState('initial', null, null, isStraighten);
        }
        parent.notify('transform', { prop: 'setDestPointsForFlipState', onPropertyChange: false});
        this.drawImage();
        parent.notify('transform', { prop: 'setDestPointsForFlipState', onPropertyChange: false});
        if (isMouseWheel) {this.setTransformColl(this.lowerContext, 'reverse'); }
        else {
            this.updateCurrTransState('reverse', null, null, isStraighten); this.isRotateZoom = false;
        }
        if (isFrame) {
            parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                value: {ctx: this.lowerContext, shape: 'zoom', pen: 'zoom', isPreventApply: null }});
        } else {
            parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                value: {ctx: this.lowerContext, shape: 'iterate', pen: 'iterate', isPreventApply: null }});
        }
        this.clearOuterCanvas(this.lowerContext);
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
            parent.imgSrc = src;
            if (!parent.isUndoRedo) {
                parent.notify('filter', { prop: 'update-finetunes', onPropertyChange: false });
            }
            proxy.lowerContext.drawImage(parent.baseImg, 0, 0, proxy.parent.lowerCanvas.width, proxy.parent.lowerCanvas.height);
            hideSpinner(parent.element); parent.element.style.opacity = '1'; proxy.updateBaseImgCanvas();
            const fileOpened: OpenEventArgs = {fileName: this.fileName, fileType: this.fileType, isValidImage: true };
            proxy.updateCanvas();
            if (parent.currObjType.isUndoZoom) {
                parent.currObjType.isUndoZoom = false; proxy.parent.lowerCanvas.style.display = 'block';
            }
            parent.isUndoRedo = this.isErrorImage = false;
            if (Browser.isDevice) {
                parent.notify('toolbar', {prop: 'destroy-top-toolbar', onPropertyChange: false});
                parent.notify('toolbar', {prop: 'destroy-bottom-toolbar', onPropertyChange: false});
                const eventargs: object = { isApplyBtn: false, isDevice: Browser.isDevice, isOkBtn: null,
                    isResize: null, isFrame: null, isMainToolbar: true };
                parent.notify('toolbar', { prop: 'init-main-toolbar', onPropertyChange: false, value: eventargs});
                parent.notify('toolbar', { prop: 'create-bottom-toolbar', onPropertyChange: false});
            } else {
                parent.notify('toolbar', {prop: 'destroy-top-toolbar', onPropertyChange: false});
                const eventargs: object = { isApplyBtn: false, isDevice: false, isOkBtn: null };
                parent.notify('toolbar', { prop: 'init-main-toolbar', onPropertyChange: false, value: eventargs});
            }
            if (parent.isImageLoaded && parent.element.style.opacity !== '0.5') {
                parent.trigger('fileOpened', fileOpened);
                const action: EditCompleteEventArgs  = { action: 'file-open', actionEventArgs: fileOpened };
                parent.triggerEditCompleteEvent(action);
            }
        };
        parent.baseImg.onerror = () => {
            hideSpinner(parent.element);
            proxy.isErrorImage = true;
            proxy.errorLoading();
        };
    }

    private errorLoading(): void {
        const parent: ImageEditor = this.parent;
        const fileOpened: OpenEventArgs = {fileName: null, fileType: null, isValidImage: false };
        parent.trigger('fileOpened', fileOpened);
    }

    private updateBaseImgCanvas(): void {
        const parent: ImageEditor = this.parent;
        parent.baseImgCanvas.width = parent.baseImg.width; parent.baseImgCanvas.height = parent.baseImg.height;
        parent.baseImgCanvas.getContext('2d').drawImage(parent.baseImg, 0, 0);
    }

    private updateCanvas(): void {
        const parent: ImageEditor = this.parent;
        if (!parent.isImageUpdated) {
            parent.img.srcWidth = parent.baseImgCanvas.width; parent.img.srcHeight = parent.baseImgCanvas.height;
        }
        const obj: Object = {width: 0, height: 0 };
        parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: parent.img.srcWidth, height: parent.img.srcHeight, obj: obj, isImgShape: null}});
        const maxDimension: Dimension = obj as Dimension;
        parent.img.destLeft = (parent.lowerCanvas.clientWidth - maxDimension.width) / 2;
        parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.height + 1) / 2;
        this.drawImgToCanvas(maxDimension);
        this.origDim.width = parent.img.destWidth; this.origDim.height = parent.img.destHeight;
        this.zoomCrop.width = parent.img.destWidth; this.zoomCrop.height = parent.img.destHeight;
        parent.notify('transform', { prop: 'setCropDimension', onPropertyChange: false,
            value: {width: parent.img.destWidth, height: parent.img.destHeight}});
        const point: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
            height: parent.img.destHeight};
        parent.notify('crop', { prop: 'setCropDestPoints', onPropertyChange: false, value: {point: point }});
        const temp: string = this.lowerContext.filter;
        this.lowerContext.filter = 'none';
        parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
            value: {ctx: this.lowerContext, shape: 'iterate', pen: 'zoom', isPreventApply: null }});
        this.lowerContext.filter = temp;
        if (parent.img.destWidth > 0 && parent.img.destHeight > 0) {parent.isImageLoaded = true; }
        if (parent.isUndoRedo) {
            if (parent.transform.currFlipState !== '') {
                parent.notify('transform', { prop: 'flipImage', onPropertyChange: false,
                    value: {direction: parent.toPascalCase(parent.transform.currFlipState) as Direction}});
            }
        }
        if (parent.disabled) { parent.element.setAttribute('class', 'e-disabled'); }
        if (parent.zoomSettings.zoomFactor !== 1 || parent.zoomSettings.zoomPoint) {
            parent.zoom(parent.zoomSettings.zoomFactor, parent.zoomSettings.zoomPoint);
        }
        if (isNullOrUndefined(this.initZoomValue)) {this.initZoomValue = parent.zoomSettings.zoomFactor; }
        this.isImageEdited = false;
    }

    private resetFrameZoom(isOk: boolean): void {
        const parent: ImageEditor = this.parent;
        if (!isNullOrUndefined(parent.tempFrameZoomLevel)) {
            const temp: number = parent.tempFrameZoomLevel;
            parent.tempFrameZoomLevel = null;
            parent.notify('transform', { prop: 'resetZoom', onPropertyChange: false});
            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                value: { zoomFactor: temp, zoomPoint: null, isResize: true } });
            const obj: Transition = parent.cancelCropSelection;
            if (isOk && obj) {
                obj.previousObj.frameObj = extend({}, parent.frameObj, null, true) as FrameValue;
                obj.currentObj.frameObj = extend({}, parent.frameObj, null, true) as FrameValue;
                obj.previousObj.frame = obj.currentObj.frame = parent.frameObj.type;
            }
            this.updateCropSelObj();
            parent.cancelCropSelection = null;
        }
    }

    private performCancel(isContextualToolbar?: boolean, isUndoRedo?: boolean, isFinalCancel?: boolean): void {
        const parent: ImageEditor = this.parent;
        if (isFinalCancel) {
            parent.noPushUndo = false;
        }
        const straightenObj: Object = {bool: parent.isStraightening };
        isContextualToolbar = isContextualToolbar ? isContextualToolbar : false;
        const obj: Object = {bool: false };
        parent.allowDownScale = true;
        parent.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: obj }});
        if (isNullOrUndefined(isUndoRedo) && JSON.stringify(parent.frameObj) !== JSON.stringify(parent.tempFrameObj)) {
            extend(parent.frameObj, parent.tempFrameObj);
            this.renderImage(null, null, true);
        }
        this.resetFrameZoom(false);
        const editCompleteArgs: object = {action: '' };
        if (obj['bool']) {
            editCompleteArgs['action'] = 'freehand-draw';
            parent.notify('freehand-draw', {prop: 'cancelFhd', onPropertyChange: false});
            parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
            parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
        } else if (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') {
            editCompleteArgs['action'] = 'text-editing';
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
            parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
            parent.notify('selection', { prop: 'setTempActObj', onPropertyChange: false, value: {obj: parent.activeObj }});
            if (parent.drawingShape) {
                parent.enableShapeDrawing(parent.toPascalCase(parent.drawingShape) as ShapeType, true);
            }
        } else if ((!parent.activeObj.shape || parent.activeObj.shape !== 'redact') && (((!Browser.isDevice || (Browser.isDevice && !straightenObj['bool'])) &&
            document.querySelector('#' + parent.element.id + '_sliderWrapper')) || parent.currObjType.isFiltered)) {
            editCompleteArgs['action'] = parent.isFinetuneBtnClick ? 'fine-tune' : 'filter';
            this.lowerContext.filter = this.tempAdjValue; parent.canvasFilter = this.tempAdjValue;
            parent.notify('filter', { prop: 'setAdjustmentValue', onPropertyChange: false, value: {adjustmentValue: this.tempAdjValue }});
            parent.initialAdjustmentValue = this.tempAdjValue;
            if (this.lowerContext.filter.split(' ').length > 1 &&
                this.lowerContext.filter.split(' ')[0].split('(')[1].split(')')[0] === '1') {
                parent.notify('filter', { prop: 'setBrightnessAdjusted', onPropertyChange: false, value: {isBrightnessAdjusted: false }});
            }
            parent.currentFilter = this.tempFilter;
            parent.notify('filter', { prop: 'setBevelFilter', onPropertyChange: false, value: { bevelFilter: this.lowerContext.filter }});
            this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
            this.redrawImgWithObj(); parent.currObjType.isFiltered = false;
            const obj: Object = {tempAdjustmentLevel: null };
            parent.notify('filter', { prop: 'getTempAdjustmentLevel', onPropertyChange: false, value: {obj: obj }});
            parent.notify('filter', { prop: 'setAdjustmentLevel', onPropertyChange: false,
                value: {adjustmentLevel: extend({}, obj['tempAdjustmentLevel'], {}, true )}});
            parent.notify('undo-redo', { prop: 'setUndoRedoStep', onPropertyChange: false, value: {step: this.tempUndoRedoStep }});
            parent.upperCanvas.style.cursor = parent.cursor = 'default'; parent.currObjType.isCustomCrop = false;
            this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null, radius: null, outlineColor: '', outlineWidth: null};
            this.clearOuterCanvas(this.lowerContext);
            if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
                parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                    value: {context: this.lowerContext, isSave: null, isFlip: null}});
            }
            const eventargs: object = { type: 'main', isApplyBtn: null, isCropping: null, isZooming: null};
            parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
            parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
            if (parent.activeObj.shape && parent.activeObj.shape === 'image') {
                parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
            }
            parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel' }});
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false });
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            if (parent.drawingShape) {
                parent.drawingShape = null;
                parent.notify('selection', { prop: 'setCurrentDrawingShape', onPropertyChange: false, value: { value: '' } });
            }
        } else {
            if ((!parent.activeObj.shape || parent.activeObj.shape !== 'redact') && isContextualToolbar && (!Browser.isDevice || (Browser.isDevice && !straightenObj['bool']))) {
                const eventargs: object = { type: 'main', isApplyBtn: null, isCropping: null, isZooming: null};
                parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
            } else {
                this.cancelItems(editCompleteArgs);
                if (parent.transform.zoomFactor > 0) {
                    parent.togglePan = true;
                    parent.notify('selection', {prop: 'setDragCanvas', value: {bool: true }});
                } else {
                    parent.togglePan = false;
                    parent.notify('selection', {prop: 'setDragCanvas', value: {bool: false }});
                }
            }
        }
        this.isShapeTextInserted = false;
        this.isNewPath = false;
        parent.notify('toolbar', {prop: 'refresh-dropdown-btn', value: {isDisabled: false}});
        parent.notify('toolbar', {prop: 'setCurrentToolbar', value: {type: 'main' }});
        if (isFinalCancel) {
            parent.noPushUndo = false;
        }
        parent.drawingShape = null;
        parent.notify('draw', { prop: 'resetTempObjColl'});
        parent.notify('draw', { prop: 'resetTempPointColl'});
        parent.isMaskImage = parent.isFinetuneBtnClick = false;
        const actionArgs: EditCompleteEventArgs  = { action: 'cancel', actionEventArgs: editCompleteArgs as object };
        parent.triggerEditCompleteEvent(actionArgs);
    }

    private cancelItems(editCompleteArgs?: object): void {
        const parent: ImageEditor = this.parent; let isCropSelection: boolean = false;
        const id: string = parent.element.id;
        const ascpectIcon: HTMLInputElement = (parent.element.querySelector('#' + id + '_aspectratio') as HTMLInputElement);
        const nonAspectIcon: HTMLInputElement = (parent.element.querySelector('#' + id + '_nonaspectratio') as HTMLInputElement);
        let splitWords: string[]; const shapes: string[] = ['rectangle', 'ellipse', 'line', 'arrow', 'path', 'image', 'redact'];
        if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
        if (splitWords === undefined && parent.currObjType.isCustomCrop) {isCropSelection = true; }
        else if (splitWords !== undefined && splitWords[0] === 'crop'){isCropSelection = true; }
        if (isCropSelection && parent.isCropTab) {
            parent.isCropTab = false;
            parent.transform.zoomFactor = parent.transform.defaultZoomFactor;
        }
        if (parent.isResize) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            if (ascpectIcon || nonAspectIcon || (parent as any).currentToolbar === 'resize-toolbar') {
                editCompleteArgs['action'] = 'resize';
                const obj: Object = {width: null, height: null };
                parent.notify('selection', { prop: 'getNumTextValue', onPropertyChange: false, value: { obj: obj } });
                const point: Point = {x: obj['width'], y: obj['height'] };
                const aspectRatioElement: HTMLInputElement = (parent.element.querySelector('#' + parent.element.id + '_aspectratio') as HTMLInputElement);
                const blrAspRatElem: HTMLInputElement = (parent.element.querySelector('.e-ie-toolbar-aspect-ratio-btn') as HTMLInputElement);
                if (point && point.x && point.y && !isNullOrUndefined(parent.aspectWidth)) {
                    if (aspectRatioElement || (blrAspRatElem && !blrAspRatElem.classList.contains('e-hidden'))) {
                        parent.notify('transform', { prop: 'resizeImage', value: { width: parent.aspectWidth, height: parent.aspectHeight } });
                    }
                    else {
                        const bool: boolean = parent.currObjType.isUndoAction;
                        parent.currObjType.isUndoAction = false;
                        parent.notify('transform', { prop: 'resizeCrop', value: { width: parent.aspectWidth, height: parent.aspectHeight }});
                        parent.currObjType.isUndoAction = bool;
                    }
                }
                const obj1: object = {prevCropObj: parent.prevCropObj};
                const obj2: object = {prevObj: parent.prevObj};
                parent.notify('toolbar', { prop: 'getPrevCropObj', onPropertyChange: false, value: { obj: obj1 } });
                parent.notify('toolbar', { prop: 'getPrevObj', onPropertyChange: false, value: { obj: obj2 } });
                if (obj1['prevCropObj'] && obj2['prevObj']) {
                    parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
                    parent.cropObj = extend({}, obj1['prevCropObj'], {}, true) as CurrentObject;
                    this.setCurrentObj(obj2['prevObj']);
                    parent.objColl = obj2['prevObj']['objColl'];
                    parent.pointColl = obj2['prevObj']['pointColl'];
                    parent.freehandCounter = parent.pointColl.length;
                    parent.transform.straighten = 0;
                    parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                        value: {ctx: this.lowerContext, shape: 'zoom', pen: 'zoom', isPreventApply: null }});
                    const currObj: SelectionPoint = parent.currSelectionPoint ?
                        extend({}, parent.currSelectionPoint, {}, true) as SelectionPoint : null;
                    parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                        value: { zoomFactor: -parent.transform.zoomFactor, zoomPoint: null, isResize: true } });
                    parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                        value: { zoomFactor: obj2['prevObj']['defaultZoom'], zoomPoint: null, isResize: true } });
                    parent.currSelectionPoint = currObj;
                    if (obj2['prevObj'].zoomFactor) {
                        parent.setProperties({zoomSettings: { zoomFactor: obj2['prevObj'].zoomFactor}}, true);
                    }
                    parent.notify('transform', { prop: 'setPreviousZoomValue', onPropertyChange: false,
                        value: { previousZoomValue: parent.zoomSettings.zoomFactor }});
                }
                parent.isResize = false;
                parent.notify('transform', { prop: 'setResizedImgAngle', onPropertyChange: false, value: {angle: null}});
                const temp: boolean = parent.isCropTab; parent.isCropTab = false;
                this.updateCropSelObj(); parent.cancelCropSelection = null; parent.isCropTab = temp;
            }
        }
        switch (true) {
        case parent.togglePen:
            editCompleteArgs['action'] = 'freehand-draw';
            this.cancelPen();
            break;
        case parent.activeObj.shape === 'text':
            editCompleteArgs['action'] = 'text';
            this.cancelText();
            break;
        case shapes.indexOf(parent.activeObj.shape) !== -1:
            editCompleteArgs['action'] = parent.activeObj.shape;
            this.cancelShape();
            parent.currObjType.isRedact = false;
            break;
        case isCropSelection:
            editCompleteArgs['action'] = 'crop-selection';
            this.cancelSelection();
            break;
        default:
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false });
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            parent.notify('undo-redo', { prop: 'updateCurrUrc', value: { type: 'cancel' } });
            break;
        }
        parent.notify('selection', { prop: 'setCurrentDrawingShape', onPropertyChange: false, value: {value: '' }});
        parent.upperCanvas.style.cursor = parent.cursor = 'default'; parent.currObjType.isCustomCrop = false;
        this.tempStrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null, radius: null, outlineColor: '', outlineWidth: null};
        const eventargs: object = { type: 'main', isApplyBtn: null, isCropping: false, isZooming: null};
        parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
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
        parent.notify('shape', {prop: 'setStrokeSettings', value: {strokeSettings: parent.activeObj.strokeSettings, strokeColor: null,
            fillColor: null, strokeWidth: null, radius: null }});
        parent.notify('freehand-draw', { prop: 'setPenStrokeWidth', onPropertyChange: false, value: { value: this.tempStrokeWidth } });
        parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel'}});
        parent.notify('selection', {prop: 'setFreehandDrawCustomized', value: {isFreehandDrawCustomized: false }});
        parent.objColl = extend([], this.tempObjColl, [], true) as SelectionPoint[];
        parent.pointColl = extend([], this.tempPointColl, [], true) as Point[];
        parent.freehandCounter = parent.pointColl.length;
        this.tempPointColl = {};
        this.renderImage();
        parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok', isCancel: true}});
    }

    private cancelText(): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', { prop: 'setTextSettings', onPropertyChange: false,
            value: {textSettings: this.tempTextSettings, fontFamily: null, fontSize: null }});
        parent.notify('shape', {prop: 'setStrokeSettings',
            value: {strokeSettings: this.tempStrokeSettings, strokeColor: null, fillColor: null, strokeWidth: null, radius: null }});
        if (isNullOrUndefined(parent.activeObj.currIndex)) {
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        } else {
            const object: Object = {appliedUndoRedoColl: [] as Transition[] };
            parent.notify('undo-redo', {prop: 'getAppliedUndoRedoColl', value: {obj: object }});
            const len: number = object['appliedUndoRedoColl'].length;
            const appliedColl: Transition = object['appliedUndoRedoColl'][len - 1];
            if (this.prevActObj && appliedColl && appliedColl.currentObjColl.length &&
                appliedColl.currentObjColl[appliedColl.currentObjColl.length - 1].currIndex === this.prevActObj.currIndex) {
                parent.activeObj = this.prevActObj;
                this.prevActObj = null;
            } else {
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false });
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            }
        }
        parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
        this.tempTextSettings = {text: 'Enter Text', fontFamily: parent.fontFamily.default, fontSize: null, fontRatio: null, bold: false,
            italic: false, underline: false};
        parent.objColl = extend([], this.tempObjColl, [], true) as SelectionPoint[];
        parent.pointColl = extend([], this.tempPointColl, [], true) as Point[];
        this.renderImage();
        this.tempObjColl = [];
        parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok', isCancel: true}});
    }

    private cancelShape(): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', {prop: 'setStrokeSettings',
            value: {strokeSettings: this.tempStrokeSettings, strokeColor: null, fillColor: null, strokeWidth: null, radius: null }});
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
            let obj: SelectionPoint;
            for (let i: number = 0, iLen: number = object['appliedUndoRedoColl'].length; i < iLen; i++) {
                const currObjColl: SelectionPoint[] = object['appliedUndoRedoColl'][i as number].currentObjColl;
                for (let j: number = 0, jLen: number = currObjColl.length; j < jLen; j++) {
                    if (this.prevActObj && this.prevActObj.currIndex &&
                        currObjColl[j as number].currIndex === this.prevActObj.currIndex) {
                        obj = currObjColl[0];
                        break;
                    }
                }
            }
            if (this.prevActObj && obj) {
                parent.activeObj = this.prevActObj;
                this.prevActObj = null;
                parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false, value: {obj: parent.activeObj}});
                parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'cancel' }});
                parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: true}});
            } else {
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            }
            const undoRedoObj: Object = {undoRedoStep: null };
            parent.notify('undo-redo', {prop: 'getUndoRedoStep', value: {obj: undoRedoObj }});
            if (object['appliedUndoRedoColl'][(undoRedoObj['undoRedoStep'] - 1) as number]) {
                parent.objColl =
                    extend([], object['appliedUndoRedoColl'][(undoRedoObj['undoRedoStep'] - 1) as number].currentObjColl, [], true) as SelectionPoint[];
            } else {
                parent.objColl = [];
            }
            this.renderImage();
        }
        parent.currObjType.isDragging = false;
        parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
        parent.objColl = extend([], this.tempObjColl, [], true) as SelectionPoint[];
        parent.pointColl = extend([], this.tempPointColl, [], true) as Point[];
        this.renderImage();
        this.tempObjColl = [];
        parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok', isCancel: true}});
    }

    private cancelSelection(): void {
        const parent: ImageEditor = this.parent;
        if (parent.cancelCropSelection) {
            const obj: Object = {value: parent.tempStraighten };
            parent.transform.straighten = obj['value'];
            parent.straightenBaseImageCanvas();
            parent.notify('freehand-draw', { prop: 'resetStraightenPoint' });
            parent.notify('draw', {prop: 'render-image', value: {isMouseWheel: false } });
            parent.notify('draw', { prop: 'setStraightenActObj', value: {activeObj: parent.activeObj }});
            parent.notify('crop', {prop: 'resizeWrapper'});
            this.updateCropSelObj();
            // eslint-disable-next-line max-len
            if (this.tempStraightenDestPoints && JSON.stringify(this.tempStraightenDestPoints) !== JSON.stringify(this.straightenDestPoints)) {
                this.straightenDestPoints = extend({}, this.tempStraightenDestPoints, {}, true) as ImageDimension;
            }
        }
    }

    private updateCropSelObj(): void {
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

    private updateCropSelection(): void {
        const parent: ImageEditor = this.parent;
        const object: Object = {currObj: {} as CurrentObject };
        parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const currentObj: CurrentObject = object['currObj'];
        currentObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
        currentObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
        currentObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        currentObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        parent.cancelCropSelection = {operation: 'cropTransform', previousObj: currentObj, currentObj: currentObj,
            previousObjColl: currentObj.objColl, currentObjColl: currentObj.objColl,
            previousPointColl: currentObj.pointColl, currentPointColl: currentObj.pointColl,
            previousSelPointColl: currentObj.selPointColl, currentSelPointColl: currentObj.selPointColl,
            previousCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject,
            currentCropObj: extend({}, parent.cropObj, {}, true) as CurrentObject,
            previousText: null, currentText: null, filter: null, isCircleCrop: parent.isCircleCrop };
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
        type = type.toLowerCase();
        if (!parent.disabled && parent.isImageLoaded) {
            parent.allowDownScale = false;
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
            if (parent.transform.zoomFactor > 0 && parent.activeObj.shape &&
                parent.activeObj.shape.split('-')[0] === 'crop' && isNullOrUndefined(this.currSelPoint)) {
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
                if (parent.transform.defaultZoomFactor !== 0 && !this.isResizeSelect) {
                    const isCropTab: boolean = parent.isCropTab; parent.isCropTab = false;
                    parent.notify('transform', { prop: 'resetZoom', onPropertyChange: false});
                    parent.isCropTab = isCropTab; this.resetPanPoints();
                }
                parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
                parent.isCropTab = true; parent.isCircleCrop = false;
                if (!this.isResizeSelect) {
                    parent.notify('crop', { prop: 'setCurrSelPoints', onPropertyChange: false, value: {isSetDimension: true}});
                }
                parent.transform.zoomFactor = parent.transform.cropZoomFactor;
                if (isNullOrUndefined(parent.cropObj.activeObj.shape)) {
                    parent.currObjType.shape = 'crop-' + type;
                    this.drawNewSelection(type, startX, startY, width, height);
                }
            } else {
                if (!this.isCropSelect) {
                    parent.notify('crop', { prop: 'adjustStraightenForShapes', onPropertyChange: false,
                        value: {type: 'reverse', isInitialRotated: true }});
                    parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
                    this.renderImage();
                } else {
                    this.isCropSelect = false;
                }
                if (type === 'custom') {parent.currObjType.shape = ''; }
                this.drawNewSelection(type, startX, startY, width, height);
            }
        }
    }

    private drawNewSelection(type: string, startX?: number, startY?: number, width?: number, height?: number): void {
        const parent: ImageEditor = this.parent; let points: ActivePoint; const cropShape: string = 'crop-' + type.toLowerCase();
        if (cropShape === 'crop-custom') {
            if (parent.currObjType.shape === '' || parent.currObjType.shape === 'crop-custom') {
                this.drawCustomSelection('crop-custom', startX, startY, width, height);
                this.adjToStraighten(); this.updateSelectionInsert();
                if (parent.isStraightening) {
                    this.straightenActObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                    this.straightenInitZoom = parent.transform.zoomFactor;
                }
            }
        } else if (cropShape === 'crop-canvas') {
            parent.upperCanvas.style.display = 'block';
            parent.notify('selection', {prop: 'setDragCanvas', value: {bool: true }});
        } else {
            parent.currObjType.isCustomCrop = false;
            parent.currObjType.shape = cropShape;
            if (width && height) {
                points = {startX : startX, startY : startY, endX : startX + width, endY : startY + height,
                    width: width, height: height};
            } else if (width && cropShape === 'crop-circle') {
                points = {startX : startX, startY : startY, endX : startX + width, endY : startY + width,
                    width: width, height: width};
            }
            parent.activeObj.shape = cropShape;
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
        parent.trigger('selectionChanging', selectionChangingArgs);
        parent.editCompleteArgs = selectionChangingArgs;
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

    private drawCustomSelection(cropShape: string, startX?: number, startY?: number, width?: number, height?: number): void {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        parent.currObjType.isCustomCrop = true;
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.currObjType.shape = parent.activeObj.shape = cropShape.toLowerCase();
        if (!isNullOrUndefined(startX) && !isNullOrUndefined(startY) && !isNullOrUndefined(width) && !isNullOrUndefined(height)) {
            actPoint.startX = startX; actPoint.startY = startY;
            actPoint.endX = startX + width; actPoint.endY = startY + height;
            actPoint.width = width; actPoint.height = height;
        } else if (width && height) {
            const { destLeft, destTop, destWidth, destHeight } = parent.img;
            actPoint.width = width; actPoint.height = height;
            actPoint.startX = destLeft + ((destWidth / 2) - (width / 2));
            actPoint.startY = destTop + ((destHeight / 2) - (height / 2));
        } else {
            if (isNullOrUndefined(parent.transform.zoomFactor) || parent.transform.zoomFactor === 0) {
                const { destLeft, destTop, destWidth, destHeight } = parent.img;
                const lowerCanvasWidth: number = parent.lowerCanvas.width; const lowerCanvasHeight: number = parent.lowerCanvas.height;
                const activePoint: ActivePoint = actPoint;
                if (destLeft >= 0 && destTop >= 0) {
                    activePoint.startX = destLeft;
                    activePoint.startY = destTop;
                    activePoint.endX = destLeft + destWidth;
                    activePoint.endY = destTop + destHeight;
                } else if (destLeft >= 0) {
                    activePoint.startX = destLeft;
                    activePoint.startY = 7.5;
                    activePoint.endX = destLeft + destWidth;
                    activePoint.endY = lowerCanvasHeight - 15;
                } else if (destTop >= 0) {
                    activePoint.startX = 7.5;
                    activePoint.startY = destTop;
                    activePoint.endX = lowerCanvasWidth - 15;
                    activePoint.endY = destTop + destHeight;
                } else {
                    activePoint.startX = 7.5;
                    activePoint.startY = 7.5;
                    activePoint.endX = lowerCanvasWidth - 15;
                    activePoint.endY = lowerCanvasHeight - 15;
                }
            } else {
                const { destLeft, destTop, destWidth, destHeight } = parent.img;
                const lowerCanvasWidth: number = parent.lowerCanvas.width; const lowerCanvasHeight: number = parent.lowerCanvas.height;
                const activePoint: ActivePoint = actPoint;
                activePoint.startX = Math.max(destLeft > 0 ? destLeft : 7.5, destLeft);
                activePoint.startY = Math.max(destTop > 0 ? destTop : 7.5, destTop);
                activePoint.endX = Math.min(destLeft + destWidth + 15 < lowerCanvasWidth ? destLeft + destWidth - 15 :
                    lowerCanvasWidth - 15, destLeft + destWidth);
                activePoint.endY = Math.min(destTop + destHeight + 15 < lowerCanvasHeight ? destTop + destHeight - 15 :
                    lowerCanvasHeight - 15, destTop + destHeight);
            }
            const { destLeft, destTop, destWidth, destHeight } = parent.img;
            const lowerCanvasWidth: number = parent.lowerCanvas.clientWidth;
            const lowerCanvasHeight: number = parent.lowerCanvas.clientHeight;
            const activePoint: ActivePoint = actPoint;
            activePoint.startX = Math.max(activePoint.startX, destLeft);
            activePoint.startY = Math.max(activePoint.startY, destTop);
            activePoint.endX = Math.min(activePoint.endX, destLeft + destWidth);
            activePoint.endY = Math.min(activePoint.endY, destTop + destHeight);
            if (parent.transform.straighten > 0) {
                if (this.imgCanvasPoints[0].x > activePoint.startX) {activePoint.startX = this.imgCanvasPoints[0].x; }
                if (this.imgCanvasPoints[0].y > activePoint.startY) {activePoint.startY = this.imgCanvasPoints[0].y; }
                if (this.imgCanvasPoints[2].x < activePoint.endX) {activePoint.endX = this.imgCanvasPoints[2].x; }
                if (this.imgCanvasPoints[2].y < activePoint.endY) {activePoint.endY = this.imgCanvasPoints[2].x; }
            } else if (parent.transform.straighten < 0) {
                if (this.imgCanvasPoints[3].x > activePoint.startX) {activePoint.startX = this.imgCanvasPoints[3].x; }
                if (this.imgCanvasPoints[3].y < activePoint.startY) {activePoint.startY = this.imgCanvasPoints[3].y; }
                if (this.imgCanvasPoints[1].x < activePoint.endX) {activePoint.endX = this.imgCanvasPoints[1].x; }
                if (this.imgCanvasPoints[1].y > activePoint.endY) {activePoint.endY = this.imgCanvasPoints[1].x; }
            }
            if (activePoint.startX === destLeft && destLeft + destWidth > lowerCanvasWidth) {
                activePoint.endX = lowerCanvasWidth - 15;
            }
            if (activePoint.startY === destTop && destTop + destHeight > lowerCanvasHeight) {
                activePoint.endY = lowerCanvasHeight - 15;
            }
            if (parent.activeObj.activePoint.startX > parent.activeObj.activePoint.endX) {
                const temp: number = parent.activeObj.activePoint.startX;
                parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX;
                parent.activeObj.activePoint.endX = temp;
            }
            if (parent.activeObj.activePoint.startY > parent.activeObj.activePoint.endY) {
                const temp: number = parent.activeObj.activePoint.startY;
                parent.activeObj.activePoint.startY = parent.activeObj.activePoint.endY;
                parent.activeObj.activePoint.endY = temp;
            }
            parent.activeObj = this.updateWidthHeight(parent.activeObj);
            this.updateActiveObject(actPoint, parent.activeObj);
            this.adjActObj();
        }
        this.updateSelectionInsert();
    }

    private adjToStraighten(): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.straighten !== 0 && parent.isStraightening) {
            const actPoint: ActivePoint = parent.activeObj.activePoint;
            actPoint.startX += 7.5; actPoint.startY += 7.5;
            actPoint.endX -= 7.5; actPoint.endY -= 7.5;
            parent.activeObj = this.updateWidthHeight(parent.activeObj);
        }
    }

    private adjActObj(): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.straighten === 0) {return; }
        let actPoint: ActivePoint = parent.activeObj.activePoint;
        let tempActPoint: ActivePoint = extend({}, actPoint, {}, true) as ActivePoint;
        let count: number = 0;
        while (true) {
            count++;
            const object: Object = { isIntersect: null, arr: null };
            parent.notify('draw', { prop: 'updateImgCanvasPoints', onPropertyChange: false });
            parent.notify('draw', { prop: 'isLinesIntersect', onPropertyChange: false, value: { obj: object } });
            if (object['arr'][0] || object['arr'][1] || object['arr'][2] || object['arr'][3] || count === 100) {
                actPoint = extend({}, tempActPoint, {}, true) as ActivePoint;
                break;
            }
            tempActPoint = extend({}, actPoint, {}, true) as ActivePoint;
            actPoint.startX -= 5; actPoint.endX += 5;
            actPoint.width = actPoint.endX - actPoint.startX;
            this.updateActiveObject(actPoint, parent.activeObj);
        }
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
        this.drawImage();
        this.updateCurrTransState('reverse');
        if (parent.transform.degree === 0 && parent.rotateFlipColl.length > 0) {
            parent.img.destLeft += parent.panPoint.totalPannedPoint.x;
            parent.img.destTop += parent.panPoint.totalPannedPoint.y;
        }
        this.isRotateZoom = false; parent.objColl = tempObjColl; const tempTogglePen: boolean = parent.togglePen;
        parent.togglePen = false; this.lowerContext.filter = 'none';
        const widthObj: Object = {penStrokeWidth: null };
        parent.notify('freehand-draw', {prop: 'getPenStrokeWidth', onPropertyChange: false, value: {obj: widthObj }});
        parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
            value: {ctx: this.lowerContext, shape: 'iterate', pen: 'iterate', isPreventApply: null }});
        parent.notify('freehand-draw', {prop: 'setPenStrokeWidth', onPropertyChange: false, value: {value: widthObj['penStrokeWidth'] }});
        parent.img.destLeft += parent.panPoint.totalPannedInternalPoint.x; parent.img.destTop += parent.panPoint.totalPannedInternalPoint.y;
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
            parent.img.destLeft = (parent.lowerCanvas.clientWidth - parent.img.destHeight) / 2;
            parent.img.destTop = (parent.lowerCanvas.clientHeight - parent.img.destWidth + 1) / 2;
            const temp: number = parent.img.destWidth; parent.img.destWidth = parent.img.destHeight;
            parent.img.destHeight = temp;
        } else {
            if (isNullOrUndefined(isPreventDimension)) {
                parent.img.destLeft = (parent.lowerCanvas.clientWidth - parent.img.destWidth) / 2;
                parent.img.destTop = (parent.lowerCanvas.clientHeight - parent.img.destHeight + 1) / 2;
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
    }

    private setCurrentObj(obj?: CurrentObject, isUndoRedo?: boolean, isCircleCropped?: boolean): void {
        const parent: ImageEditor = this.parent;
        const isObj: boolean = obj ? true : false;
        if (!isObj) {
            parent.cropObj.aspectWidth = parent.aspectWidth; parent.cropObj.aspectHeight = parent.aspectHeight;
            parent.cropObj.frame = parent.frameObj.type;
        }
        obj = obj ? obj : parent.cropObj;
        parent.transform.cropZoomFactor = obj.cropZoom; parent.transform.defaultZoomFactor = obj.defaultZoom;
        this.straightenInitZoom = obj.straightenZoom;
        if (!isObj) { parent.transform.zoomFactor = obj.cropZoom; }
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
        parent.transform.degree = obj.degree; parent.frameObj.type = obj.frame;
        parent.transform.currFlipState = obj.currFlipState;
        parent.notify('filter', { prop: 'setAdjustmentLevel', onPropertyChange: false, value: { adjustmentLevel: obj.adjustmentLevel }});
        parent.notify('filter', { prop: 'setTempAdjVal' });
        parent.currentFilter = obj.currentFilter;
        parent.notify('filter', { prop: 'setTempFilVal' });
        if (parent.transform.straighten !== obj.straighten || isUndoRedo) {
            parent.transform.straighten = obj.straighten;
            parent.straightenBaseImageCanvas();
        }
        parent.img = { destLeft: obj.destPoints.startX, destTop: obj.destPoints.startY, destWidth: obj.destPoints.width,
            destHeight: obj.destPoints.height, srcLeft: obj.srcPoints.startX, srcTop: obj.srcPoints.startY,
            srcWidth: obj.srcPoints.width, srcHeight: obj.srcPoints.height };
        parent.aspectWidth = obj.aspectWidth; parent.aspectHeight = obj.aspectHeight;
        if (obj.afterCropActions) {parent.afterCropActions = obj.afterCropActions; }
        this.lowerContext.filter = obj.filter;
        parent.notify('filter', { prop: 'setBrightnessAdjusted', onPropertyChange: false, value: {isBrightnessAdjusted: obj.isBrightAdjust }});
        parent.notify('draw', { prop: 'imageBackgroundColor', onPropertyChange: false, value: {color: obj.bgColor }});
        const isCircleCrop: boolean = parent.isCircleCrop;
        let currSelectionPoint: SelectionPoint;
        if (isNullOrUndefined(parent.currSelectionPoint)) {currSelectionPoint = null; }
        else {
            currSelectionPoint = extend({}, parent.currSelectionPoint, {}, true) as SelectionPoint;
            parent.currSelectionPoint = null;
        }
        parent.isCircleCrop = false;
        if (isCircleCropped) {
            parent.frameObj.type = 'none';
        }
        this.drawCropSelectionImage(obj, false);
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
            for (let i: number = 0, len: number = afterCropActions.length; i < len; i++) {
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
            parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                value: {ctx: this.lowerContext, shape: 'zoom', pen: 'zoom', isPreventApply: null }});
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
        if (isObj) {this.updateCurrTransState('initial'); }
        else {this.setTransformColl(this.lowerContext, 'initial'); }
        parent.notify('transform', { prop: 'setDestPointsForFlipState', onPropertyChange: false});
        this.drawImage();
        if (isObj) {this.updateCurrTransState('reverse'); }
        else {this.setTransformColl(this.lowerContext, 'reverse'); }
        parent.img.destLeft = parent.cropObj.destPoints.startX;
        parent.img.destTop = parent.cropObj.destPoints.startY;
        const activeObj: SelectionPoint = extend({}, obj.activeObj, {}, true) as SelectionPoint;
        this.lowerContext.filter = 'none';
        parent.img = { destLeft: obj.destPoints.startX, destTop: obj.destPoints.startY, destWidth: obj.destPoints.width,
            destHeight: obj.destPoints.height, srcLeft: obj.srcPoints.startX, srcTop: obj.srcPoints.startY,
            srcWidth: obj.srcPoints.width, srcHeight: obj.srcPoints.height };
        if (obj.activeObj.activePoint.width !== 0 && obj.activeObj.activePoint.height !== 0) {
            const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                height: parent.img.destHeight};
            parent.img.destLeft = obj.activeObj.activePoint.startX; parent.img.destTop = obj.activeObj.activePoint.startY;
            parent.img.destWidth = obj.activeObj.activePoint.width; parent.img.destHeight = obj.activeObj.activePoint.height;
            parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                value: {ctx: this.lowerContext, shape: 'zoom', pen: 'zoom', isPreventApply: null }});
            parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
            parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        }
        parent.activeObj = activeObj; this.lowerContext.filter = temp;
    }

    private performPointZoom(x: number, y: number, type: string, isResize: boolean, value?: number): void {
        const parent: ImageEditor = this.parent; const { destLeft, destTop, destWidth, destHeight } = parent.img;
        let isCropSelection: boolean = false;
        if (parent.activeObj.shape && parent.activeObj.shape.indexOf('crop-') > -1) {
            isCropSelection = true;
        }
        if (parent.element.querySelector('.e-contextual-toolbar-wrapper') && !isCropSelection) {
            if (!parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.contains('e-hide')) {
                parent.okBtn();
                parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.add('e-hide');
            }
        }
        const ratioX: number = (x - destLeft) / destWidth;
        const ratioY: number = (y - destTop) / destHeight;
        const isUndoRedo: boolean = parent.isUndoRedo; parent.isUndoRedo = true;
        parent.setProperties({zoomSettings: { zoomPoint: {x: x, y: y}}}, true);
        const zoomValue: number = value ? value : (type === 'zoomIn') ? .1 : -.1;
        parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
            value: {zoomFactor: zoomValue, zoomPoint: null, isResize: isResize }});
        parent.isUndoRedo = isUndoRedo;
        this.panToPoint(x, y, ratioX, ratioY);
    }

    private panToPoint(x: number, y: number, ratioX: number, ratioY: number): void {
        const parent: ImageEditor = this.parent;
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
                const straightenObj: Object = {straightenPoint: null };
                parent.notify('freehand-draw', { prop: 'getStraightenPoint', onPropertyChange: false,
                    value: {obj: straightenObj }});
                parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
                parent.notify('freehand-draw', { prop: 'setStraightenPoint', onPropertyChange: false,
                    value: {x: null, y: null, ratioX: null, ratioY: null}});
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
                if (straightenObj['straightenPoint']['x'] && straightenObj['straightenPoint']['y']) {
                    parent.notify('freehand-draw', { prop: 'setStraightenPoint', onPropertyChange: false,
                        value: {x: straightenObj['straightenPoint']['x'], y: straightenObj['straightenPoint']['y'],
                            ratioX: straightenObj['straightenPoint']['ratioX'], ratioY: straightenObj['straightenPoint']['ratioY']}});
                }
                parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                    value: {obj: {selPointColl: cropSelPointColl } }});
                parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                    value: {ctx: this.lowerContext, shape: 'pan', pen: 'pan', x: parent.panPoint.currentPannedPoint.x,
                        y: parent.panPoint.currentPannedPoint.y, panRegion: '' }});
            }
            this.adjustPanning(activeObj); let isActObj: boolean = false;
            for (let i: number = 0; i < parent.objColl.length; i++) {
                if (JSON.stringify(activeObj.activePoint) === JSON.stringify(parent.objColl[i as number].activePoint)) {
                    isActObj = true;
                    break;
                }
            }
            if (!isActObj) { parent.activeObj = activeObj; }
            if (parent.activeObj.activePoint.width !== 0 && parent.activeObj.activePoint.height !== 0) {
                this.drawObject('duplicate', null, null, null, true);
            }
        }
    }

    private adjustPanning(activeObj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        const { startX, startY, width, height } = activeObj.activePoint;
        if (width !== 0 && height !== 0) {
            const { destLeft, destTop, destWidth, destHeight } = parent.img;
            const point: Point = {x: 0, y: 0};
            if (destLeft > startX) {
                point.x =  destLeft - startX;
            } else if (destLeft + destWidth < startX + width) {
                point.x = (destLeft + destWidth) - (startX + width);
            }
            if (destTop > startY) {
                point.y = destTop - startY;
            } else if (destTop + destHeight < startY + height) {
                point.y = (destTop + destHeight) - (startY + height);
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
                parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                    value: {ctx: this.lowerContext, shape: 'pan', pen: 'pan', x: parent.panPoint.currentPannedPoint.x,
                        y: parent.panPoint.currentPannedPoint.y, panRegion: '' }});
            }
        }
    }

    private panToSel(): void {
        const parent: ImageEditor = this.parent;
        const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        const { startX, startY, width, height } = activeObj.activePoint;
        this.allowRedactStraighten = true;
        const straightenObj: Object = {straightenPoint: null };
        parent.notify('freehand-draw', { prop: 'getStraightenPoint', onPropertyChange: false,
            value: {obj: straightenObj }});
        if (straightenObj['straightenPoint']['x'] && straightenObj['straightenPoint']['y']) {
            const panX: number = (startX + (width / 2)) - straightenObj['straightenPoint']['x'];
            const panY: number = (startY + (height / 2)) - straightenObj['straightenPoint']['y'];
            if (parent.transform.degree === 0) {
                parent.img.destLeft += panX; parent.img.destTop += panY;
                parent.notify('transform', {prop: 'drawPannImage', value: {point: {x: panX, y: panY}}});
            } else {
                parent.panPoint.currentPannedPoint = {x: panX, y: panY};
                parent.notify('transform', {prop: 'drawPannedImage', value: {xDiff: panX, yDiff: panY } });
                parent.panPoint.currentPannedPoint = {x: 0, y: 0};
                parent.notify('transform', {prop: 'setTempPanMove', value: {point: null } });
            }
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: activeObj }});
            const { destLeft, destTop, destWidth, destHeight } = parent.img;
            const points: Point[] = this.imgCanvasPoints;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            points.forEach((point: any) => {
                point.x = (point.ratioX * destWidth) + destLeft;
                point.y = (point.ratioY * destHeight) + destTop;
            });
            this.imgCanvasPoints = points;
            let count: number = 0;
            if (parent.transform.straighten === 3 && !this.preventStraightening) {
                this.preventStraightening = true;
                const temp: number = parent.prevStraightenedDegree;
                parent.prevStraightenedDegree = parent.transform.straighten;
                parent.setStraighten(0);
                parent.setStraighten(3);
                parent.prevStraightenedDegree = temp;
                this.preventStraightening = false;
            }
            while (this.isLinesIntersect() && parent.transform.straighten !== 0  && parent.transform.straighten !== 360 && count < 100) {
                count++;
                this.performPointZoom(parent.activeObj.activePoint.startX + (parent.activeObj.activePoint.width / 2),
                                      parent.activeObj.activePoint.startY + (parent.activeObj.activePoint.height / 2),
                                      'zoomIn', false, 0.025);
                this.updateImgCanvasPoints();
            }
        }
    }

    private drawZoomPanImage(x: number, y: number): void {
        const parent: ImageEditor = this.parent;
        parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
            value: {ctx: this.lowerContext, shape: 'pan', pen: 'pan', x: x, y: y, panRegion: '' }});
        this.renderImage(true);
        const obj: Object = {width: 0, height: 0 };
        parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: parent.img.srcWidth, height: parent.img.srcHeight, obj: obj, isImgShape: null}});
        const maxDimension: Dimension = obj as Dimension;
        maxDimension.width += (maxDimension.width * parent.transform.zoomFactor);
        maxDimension.height += (maxDimension.height * parent.transform.zoomFactor);
        parent.panPoint.totalPannedPoint.x += x; parent.panPoint.totalPannedPoint.y += y;
        parent.notify('crop', { prop: 'setTempFlipPanPoint', onPropertyChange: false, value: {point: {x: 0, y: 0 }}});
    }

    private openNewImage(): void {
        const parent: ImageEditor = this.parent;
        const id: string = parent.element.id;
        const inMemoryContext: CanvasRenderingContext2D = parent.inMemoryCanvas.getContext('2d');
        showSpinner(parent.element);
        parent.element.style.opacity = '0.5';
        const toolbar: HTMLInputElement = document.querySelector('#' + id + '_currPos');
        if (toolbar) {toolbar.style.display = 'none'; }
        const obj: Object = {defToolbarItems : null };
        parent.notify('toolbar', { prop: 'getDefToolbarItems', value: {obj: obj }});
        if (obj['defToolbarItems'].length === 0 &&
            (isNullOrUndefined(document.getElementById(id + '_toolbar'))) &&
            parent.element.querySelector('#' + id + '_toolbarArea')) {
            const height: number = parent.element.querySelector('#' + id + '_toolbarArea').clientHeight;
            parent.notify('toolbar', { prop: 'setToolbarHeight', value: {height: height }});
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
            if (typeof(this.openURL) !== 'string' || this.openURL.indexOf('localhost') === -1) {
                this.getImageSizeFromURL(this.openURL.toString(), (imageSizeMB: number | null) => {
                    if (imageSizeMB !== null) {
                        this.parent.notify('toolbar', { prop: 'setInitialSize', value: {value: +imageSizeMB }});
                    }
                });
            }
        } else {
            this.fileName = 'ImageEditor'; this.fileType = null;
            parent.lowerCanvas = document.querySelector('#' + id + '_lowerCanvas');
            parent.upperCanvas = document.querySelector('#' + id + '_upperCanvas');
            this.lowerContext = parent.lowerCanvas.getContext('2d'); this.upperContext = parent.upperCanvas.getContext('2d');
            parent.clearContext(this.lowerContext); parent.clearContext(this.upperContext); parent.clearContext(inMemoryContext);
            parent.inMemoryCanvas.width = (this.openURL as ImageData).width;
            parent.inMemoryCanvas.height = (this.openURL as ImageData).height;
            inMemoryContext.putImageData((this.openURL as ImageData), 0, 0);
            parent.baseImg.src = parent.inMemoryCanvas.toDataURL();
        }
    }

    private async getImageSizeFromURL(imageUrl: string, callback: (imageSizeMB: number | null) => void): Promise<void> {
        let response: Response;
        try {
            response = await fetch(imageUrl, { method: 'HEAD' });
            const contentLength: number = parseInt(response.headers.get('content-length') || '0', 10);
            const imageSizeMB: number | null = contentLength;
            callback(imageSizeMB);
        } catch (ex) {
            // eslint-disable-next-line no-console
            console.log(ex.message);
        }
    }

    private dlgBtnClick(): void {
        this.parent.export();
        this.applyDialogOption();
    }

    private dlgCloseBtnClick(): void {
        this.applyDialogOption();
    }

    private applyDialogOption(): void {
        const parent: ImageEditor = this.parent;
        if (this.isFileChanged) {
            parent.isImageLoaded = this.isFileChanged = false; parent.reset();
            this.checkToolbarTemplate(this.inputElem, this.openURL as URL);
        } else {
            this.reset(); this.openNewImage();
        }
        (getComponent(document.getElementById(parent.element.id + '_dialog'), 'dialog') as Dialog).destroy();
        this.isImageEdited = false;
    }

    private showDialogPopup(): void {
        const parent: ImageEditor = this.parent;
        const headerObj: Object = { key: 'ConfirmDialogHeader' };
        parent.notify('toolbar', { prop: 'getLocaleText', onPropertyChange: false, value: {obj: headerObj }});
        const contentObj: Object = { key: 'ConfirmDialogContent' };
        parent.notify('toolbar', { prop: 'getLocaleText', onPropertyChange: false, value: {obj: contentObj }});
        const yesObj: Object = { key: 'Yes' };
        parent.notify('toolbar', { prop: 'getLocaleText', onPropertyChange: false, value: {obj: yesObj }});
        const noObj: Object = { key: 'No' };
        parent.notify('toolbar', { prop: 'getLocaleText', onPropertyChange: false, value: {obj: noObj }});
        (parent.element.querySelector('#' + parent.element.id + '_dialog') as HTMLElement).style.display = 'block';
        const dialog: Dialog = new Dialog({
            header: headerObj['value'],
            closeOnEscape: true,
            content: '<span>' + contentObj['value'] + '</span>',
            target: document.getElementById('target'),
            width: '285px',
            isModal: true,
            animationSettings: { effect: 'Zoom' },
            close: this.dlgCloseBtnClick.bind(this),
            buttons: [
                { click: this.dlgCloseBtnClick.bind(this),
                    buttonModel: { content: noObj['value'], iconCss: 'e-icons e-close' }
                },
                { click: this.dlgBtnClick.bind(this),
                    buttonModel: { content: yesObj['value'], isPrimary: true, iconCss: 'e-icons e-check' }}
            ]
        });
        dialog.appendTo('#' + parent.element.id + '_dialog');
    }

    private restoreOldImage(): void {
        if (this.parent.isImageLoaded) {
            this.reset(); this.openNewImage();
        } else {
            this.openNewImage();
        }
    }

    private open(data: string | ImageData): void {
        const dropArea: HTMLElement = document.getElementById(this.parent.element.id + '_dropArea');
        if (dropArea) {
            dropArea.style.display = 'none';
        }
        if (!this.parent.disabled) {
            this.openURL = data; this.restoreOldImage();
        }
    }

    private getInitialLoaded(object: Object): void {
        object['isInitialLoaded'] = this.isInitialLoading;
    }

    private getFileExtensionFromURL(url: string): string {
        const lastDotIndex: number = url.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            return url.slice(lastDotIndex + 1).toLowerCase();
        } else if (url.indexOf('base64') !== -1) {
            return url.slice(url.indexOf('/') + 1, url.indexOf(';')).toLowerCase();
        }
        return null;
    }

    private fileSelect(inputElement: HTMLInputElement, args: Event): void {
        const parent: ImageEditor = this.parent;
        const dropArea: HTMLElement = document.getElementById(parent.element.id + '_dropArea');
        if (dropArea) {
            dropArea.style.display = 'none';
        }
        if (!parent.disabled) {
            let filesData: FileList;
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            let fileData: any;
            if (args.target) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                filesData = (args.target as any).files[0];
                fileData = filesData;
            } else {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                filesData = fileData = (args as any).filesData[0].rawFile;
            }
            let fileExtension: string;
            if (fileData.name) {
                const fileExtensionArray: string[] = fileData.name.split('.');
                fileExtension = fileExtensionArray[fileExtensionArray.length - 1].toLowerCase();
            }
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
            // eslint-disable-next-line max-len
            if (parent.isImageLoaded && !parent.isChangesSaved && (this.isImageEdited || parent.pointColl.length > 0 || parent.objColl.length > 0)) {
                this.isFileChanged = true;
                this.showDialogPopup();
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
            let isRotated: boolean = false;
            for (let i: number = 0, len: number = parent.rotateFlipColl.length; i < len; i++) {
                const degree: number = parent.rotateFlipColl[i as number];
                if (degree === 90 || degree === -90) {
                    isRotated = true; break;
                }
            }
            if (isRotated) {
                if (parent.transform.degree === 0) {return; }
                let zoomFactor: number = parent.transform.zoomFactor;
                parent.objColl.push(parent.activeObj);
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                const currObj: SelectionPoint = parent.objColl[parent.objColl.length - 1];
                if (type === 'rotateleft' || type === 'rotateright') {
                    if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
                        if (currObj.activePoint.width < activeObj.activePoint.height) {
                            for (let i: number = 2; i < parent.zoomSettings.maxZoomFactor; i++) {
                                if (currObj.activePoint.width >= activeObj.activePoint.height ||
                                    this.isSelectionBiggerThanCanvas(currObj) ||
                                    this.isSelectionOutsideCanvas(currObj)) {
                                    if (!isNullOrUndefined(zoomFactor)) {
                                        parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                            value: {zoomFactor: -0.1, zoomPoint: null}, isResize: null});
                                    }
                                    break;
                                }
                                zoomFactor += 0.1;
                                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                    value: {zoomFactor: zoomFactor, zoomPoint: null}, isResize: null});
                            }
                        } else {
                            for (let i: number = 2; i < parent.zoomSettings.maxZoomFactor; i++) {
                                if (currObj.activePoint.width >= activeObj.activePoint.height ||
                                    this.isSelectionBiggerThanCanvas(currObj) ||
                                    this.isSelectionOutsideCanvas(currObj)) {
                                    if (!isNullOrUndefined(zoomFactor)) {
                                        parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                            value: {zoomFactor: 0.1, zoomPoint: null, isResize: null}});
                                    }
                                    break;
                                }
                                zoomFactor -= .1;
                                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                    value: {zoomFactor: zoomFactor, zoomPoint: null}, isResize: null});
                            }
                        }
                    } else {
                        if (currObj.activePoint.height < activeObj.activePoint.width) {
                            for (let i: number = 2; i < parent.zoomSettings.maxZoomFactor; i++) {
                                if (currObj.activePoint.height >= activeObj.activePoint.width ||
                                    this.isSelectionBiggerThanCanvas(currObj) ||
                                    this.isSelectionOutsideCanvas(currObj)) {
                                    if (!isNullOrUndefined(zoomFactor)) {
                                        parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                            value: {zoomFactor: -0.1, zoomPoint: null}, isResize: null});
                                    }
                                    break;
                                }
                                zoomFactor += 0.1;
                                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                    value: {zoomFactor: zoomFactor, zoomPoint: null}, isResize: null});
                            }
                        } else {
                            for (let i: number = 2; i < parent.zoomSettings.maxZoomFactor; i++) {
                                if (currObj.activePoint.height >= activeObj.activePoint.width ||
                                    this.isSelectionBiggerThanCanvas(currObj) ||
                                    this.isSelectionOutsideCanvas(currObj)) {
                                    if (!isNullOrUndefined(zoomFactor)) {
                                        parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                            value: {zoomFactor: 0.1, zoomPoint: null}, isResize: null});
                                    }
                                    break;
                                }
                                zoomFactor -= .1;
                                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                                    value: {zoomFactor: zoomFactor, zoomPoint: null}, isResize: null});
                            }
                        }
                    }
                }
                const panX: number = (parent.lowerCanvas.clientWidth / 2) - (currObj.activePoint.startX +
                    (currObj.activePoint.width / 2));
                const panY: number = ((parent.lowerCanvas.clientHeight + 1) / 2) - (currObj.activePoint.startY +
                    (currObj.activePoint.height / 2));
                if (isNullOrUndefined(parent.activeObj.shape)) {
                    parent.activeObj = extend({}, activeObj, {}, true) as SelectionPoint;
                }
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
        let isBigger: boolean = false; const parent: ImageEditor = this.parent;
        const { startX, startY, endX, endY } = obj.activePoint;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        if (startX <= destLeft || startY <= destTop || endX >= destLeft + destWidth || endY >= destTop + destHeight) {
            isBigger = true;
        }
        return isBigger;
    }

    private isSelectionOutsideCanvas(obj: SelectionPoint): boolean {
        let isOutside: boolean = false; const parent: ImageEditor = this.parent;
        if ((obj.activePoint.height < parent.lowerCanvas.height - parent.toolbarHeight) ||
            (obj.activePoint.width < parent.lowerCanvas.width)) {
            isOutside = true;
        }
        return isOutside;
    }

    private downScaleImgCanvas(ctx: CanvasRenderingContext2D, isImgAnnotation: boolean, isHFlip: boolean, isVFlip: boolean): void {
        const parent: ImageEditor = this.parent;
        const canvas: HTMLCanvasElement = isImgAnnotation ? parent.activeObj.imageCanvas : parent.baseImgCanvas;
        const img: HTMLImageElement = isImgAnnotation ? parent.activeObj.imageElement : parent.baseImg;
        const width: number = isImgAnnotation ? parent.activeObj.activePoint.width : parent.img.destWidth;
        const height: number = isImgAnnotation ? parent.activeObj.activePoint.height : parent.img.destHeight;
        const obj: Object = {width: 0, height: 0 };
        if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
                value: {width: img.height, height: img.width, obj: obj, isImgShape: isImgAnnotation }});
        } else {
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
                value: {width: img.width, height: img.height, obj: obj, isImgShape: isImgAnnotation }});
        }
        if (isImgAnnotation || (parent.allowDownScale && !parent.isCropTab && !parent.isCropToolbar && img.width !== 0 && img.height !== 0
            && obj['width'] * 0.75 > width && obj['height'] * 0.75 > height)) {
            const tempCanvas: HTMLCanvasElement = parent.createElement('canvas', {
                id: parent.element.id + '_downScaleCanvas', attrs: { name: 'canvasImage' }
            });
            tempCanvas.width = isImgAnnotation ? img.width : parent.img.srcWidth;
            tempCanvas.height = isImgAnnotation ? img.height : parent.img.srcHeight;
            if (isImgAnnotation) {
                tempCanvas.getContext('2d').drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            } else {
                if (this.imageBackgroundColor !== '') {
                    ctx.fillStyle = this.imageBackgroundColor;
                    ctx.fillRect(parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
                }
                tempCanvas.getContext('2d').drawImage(canvas, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                                                      parent.img.srcHeight, 0, 0, tempCanvas.width, tempCanvas.height);
            }
            if (isImgAnnotation || this.isDownScale) {
                this.downScale(tempCanvas, width, height, isImgAnnotation);
            }
            if (isImgAnnotation) {
                ctx.canvas.width = tempCanvas.width; ctx.canvas.height = tempCanvas.height;
                if (isHFlip && isVFlip) {
                    ctx.translate(parent.activeObj.imageCanvas.width, 0); ctx.scale(-1, 1);
                    ctx.translate(0, parent.activeObj.imageCanvas.height); ctx.scale(1, -1);
                } else {
                    if (isHFlip) {
                        if (isNullOrUndefined(parent.activeObj.isHorImageFlip) || !parent.activeObj.isHorImageFlip) {
                            parent.activeObj.isHorImageFlip = true;
                            ctx.translate(parent.activeObj.imageCanvas.width, 0); ctx.scale(-1, 1);
                        } else if (parent.activeObj.isHorImageFlip) {
                            parent.activeObj.isHorImageFlip = false;
                        }
                        if (parent.activeObj.isVerImageFlip) {
                            ctx.translate(0, parent.activeObj.imageCanvas.height); ctx.scale(1, -1);
                        }
                    } else if (isVFlip) {
                        if (isNullOrUndefined(parent.activeObj.isVerImageFlip) || !parent.activeObj.isVerImageFlip) {
                            parent.activeObj.isVerImageFlip = true;
                            ctx.translate(0, parent.activeObj.imageCanvas.height); ctx.scale(1, -1);
                        } else if (parent.activeObj.isVerImageFlip) {
                            parent.activeObj.isVerImageFlip = false;
                        }
                        if (parent.activeObj.isHorImageFlip) {
                            ctx.translate(parent.activeObj.imageCanvas.width, 0); ctx.scale(-1, 1);
                        }
                    }
                }
                ctx.drawImage(tempCanvas, 0, 0);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            } else if (parent.isFinetuning) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(parent.inMemoryCanvas, 0, 0);
                ctx.restore();
            } else {
                ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height,
                              parent.img.destLeft, parent.img.destTop, tempCanvas.width, tempCanvas.height);
            }
        } else {
            if ((isNullOrUndefined(isImgAnnotation) || !isImgAnnotation) && parent.baseImgCanvas.width !== 0 &&
                parent.baseImgCanvas.height !== 0) {
                if (this.imageBackgroundColor !== '') {
                    ctx.fillStyle = this.imageBackgroundColor;
                    ctx.fillRect(parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
                }
                ctx.drawImage(parent.baseImgCanvas, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                              parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
            }
        }
        if (parent.isSafari) {
            parent.notify('filter', { prop: 'apply-filter', onPropertyChange: false, value: {context: ctx}});
        }
    }

    private downScale(canvas: HTMLCanvasElement, width: number, height: number, isImgAnnotation?: boolean): void {
        const parent: ImageEditor = this.parent;
        if (isImgAnnotation && parent.isStraightening) {return; }
        const widthSource: number = canvas.width;
        const heightSource: number = canvas.height;
        width = Math.round(width);
        height = Math.round(height);
        const widthRatio: number = widthSource / width; const heightRatio: number = heightSource / height;
        const halfWidthRatio: number = Math.ceil(widthRatio / 2); const halfHeightRatio: number = Math.ceil(heightRatio / 2);
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        const img: ImageData = ctx.getImageData(0, 0, widthSource, heightSource);
        const img2: ImageData = ctx.createImageData(width, height);
        const data: Uint8ClampedArray = img.data; const data2: Uint8ClampedArray = img2.data;
        for (let j: number = 0; j < height; j++) {
            for (let i: number = 0; i < width; i++) {
                const x2: number = (i + j * width) * 4; let weight: number = 0;
                let weights: number = 0; let alphaWeights: number = 0;
                let r: number = 0; let g: number = 0; let b: number = 0; let a: number = 0;
                const centerY: number = (j + 0.5) * heightRatio;
                const startY: number = Math.floor(j * heightRatio); const stopY: number = Math.ceil((j + 1) * heightRatio);
                for (let y: number = startY; y < stopY; y++) {
                    const dy: number = Math.abs(centerY - (y + 0.5)) / halfHeightRatio;
                    const centerX: number = (i + 0.5) * widthRatio;
                    const w0: number = dy * dy; //pre-calc part of w
                    const startX: number = Math.floor(i * widthRatio); const stopX: number = Math.ceil((i + 1) * widthRatio);
                    for (let x: number = startX; x < stopX; x++) {
                        const dx: number = Math.abs(centerX - (x + 0.5)) / halfWidthRatio;
                        const w: number = Math.sqrt(w0 + dx * dx);
                        if (w >= 1) {continue; }
                        weight = 2 * w * w * w - 3 * w * w + 1;
                        const xPos: number = 4 * (x + y * widthSource);
                        a += weight * data[xPos + 3];
                        alphaWeights += weight;
                        weight = weight * data[xPos + 3] / 250;
                        r += weight * data[xPos as number];
                        g += weight * data[xPos + 1];
                        b += weight * data[xPos + 2];
                        weights += weight;
                    }
                }
                data2[x2 as number] = r / weights; data2[x2 + 1] = g / weights; data2[x2 + 2] = b / weights;
                data2[x2 + 3] = a / alphaWeights;
            }
        }
        canvas.width = isImgAnnotation ? parent.activeObj.activePoint.width : parent.lowerCanvas.width;
        canvas.height = isImgAnnotation ? parent.activeObj.activePoint.height : parent.lowerCanvas.height;
        ctx.putImageData(img2, 0, 0);
    }

    private drawImgToCtx(ctx: CanvasRenderingContext2D, preventImg: boolean): void {
        const parent: ImageEditor = this.parent;
        if (ctx.canvas.id !== parent.element.id + '_tempCanvas' && ctx !== this.upperContext && isNullOrUndefined(preventImg)) {
            this.downScaleImgCanvas(ctx, null, null, null);
        }
    }

    private getFrameColor(frameObj: FrameValue, ctx: CanvasRenderingContext2D, points: ActivePoint):
    string | CanvasGradient | CanvasPattern {
        const parent: ImageEditor = this.parent;
        let color: string | CanvasGradient | CanvasPattern = parent.frameObj.color;
        if (frameObj.gradientColor) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const gradient: any = ctx.createLinearGradient(points.startX, points.startY, points.startX + points.width,
                                                           points.startY + points.height);
            gradient.addColorStop(0, frameObj.color);
            gradient.addColorStop(1, frameObj.gradientColor);
            color = gradient;
        } else {
            color = frameObj.color;
        }
        return color;
    }

    private applyFrame(ctx: CanvasRenderingContext2D, frame: string, preventImg?: boolean): void {
        const parent: ImageEditor = this.parent; parent.frameObj.type = frame;
        let tempLineWidth: number; let ratio: Dimension = {width: 1, height: 1 };
        let points: ActivePoint = {startX: parent.img.destLeft - ctx.lineWidth, startY: parent.img.destTop - ctx.lineWidth,
            width: parent.img.destWidth + (2 * ctx.lineWidth), height: parent.img.destHeight + (2 * ctx.lineWidth) };
        const frameObj: FrameValue = {type: parent.frameObj.type, color: parent.frameObj.color, size: parent.frameObj.size,
            inset: parent.frameObj.inset, offset: parent.frameObj.offset / 2, radius: parent.frameObj.radius,
            amount: parent.frameObj.amount, border: parent.frameObj.border, gradientColor: parent.frameObj.gradientColor };
        const zoomFactor: number = parent.transform.zoomFactor;
        if (ctx.canvas.id === parent.element.id + '_tempCanvas') {
            const newWidth: number = ctx.canvas.width; const newHeight: number = ctx.canvas.height;
            const obj: Object = {width: 0, height: 0 };
            parent.notify('crop', { prop: 'calcRatio', onPropertyChange: false,
                value: {obj: obj, dimension: {width: newWidth, height: newHeight }}});
            ratio = obj as Dimension;
            frameObj.size *= ((ratio.width + ratio.height) / 2);
            frameObj.inset *= ((ratio.width + ratio.height) / 2);
            frameObj.offset *= ((ratio.width + ratio.height) / 2);
            frameObj.radius *= ((ratio.width + ratio.height) / 2);
            points = {startX: 0, startY: 0, width: ctx.canvas.width, height: ctx.canvas.height };
            parent.notify('export', { prop: 'updateSaveContext', onPropertyChange: false, value: {context: ctx }});
        } else if (ctx === this.upperContext && parent.activeObj.shape) {
            points = {startX: parent.activeObj.activePoint.startX - ctx.lineWidth, startY: parent.activeObj.activePoint.startY
                - ctx.lineWidth, width: parent.activeObj.activePoint.width + (2 * ctx.lineWidth), height:
                parent.activeObj.activePoint.height + (2 * ctx.lineWidth) };
        } else if (isNullOrUndefined(preventImg)) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        let valueForty: number = (40 * ((ratio.width + ratio.height) / 2));
        let valueFifty: number = (50 * ((ratio.width + ratio.height) / 2));
        if (ctx !== this.upperContext) {
            frameObj.size += (frameObj.size * zoomFactor);
            frameObj.inset += (frameObj.inset * zoomFactor);
            frameObj.offset += (frameObj.offset * zoomFactor);
            frameObj.radius += (frameObj.radius * zoomFactor);
            valueForty += (valueForty * zoomFactor);
            valueFifty += (valueFifty * zoomFactor);
        }
        if (ctx === this.upperContext && parent.activeObj.shape) {
            if ((frame === 'mat' && ((points.width - (2 * frameObj.size) < 0) || (points.height - (2 * frameObj.size) < 0))) ||
                (frame === 'bevel' && (points.width - (2 * frameObj.size) < 40 || points.height - (2 * frameObj.size) < 40)) ||
                ((frame === 'inset') && (points.startX + points.width - frameObj.offset - (points.startX + frameObj.offset) < 0 ||
                points.startY + points.height - frameObj.offset - (points.startY + frameObj.offset) < 0)) ||
                (frame === 'hook' && (points.width - (2 * frameObj.size) < 50 || points.height - (2 * frameObj.size) < 50))) {
                return;
            }
        }
        const bevelObj: Object = {bevelFilter: ctx.filter };
        const filter: string = ctx.filter;
        if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop ||
            (ctx === this.lowerContext && parent.isCropTab)) {
            this.drawImgToCtx(ctx, preventImg);
        } else {
            switch (frame) {
            case 'none':
                this.drawImgToCtx(ctx, preventImg);
                break;
            case 'mat':
                this.drawImgToCtx(ctx, preventImg);
                while (((points.width - (2 * frameObj.size) < 0) ||
                    (points.height - (2 * frameObj.size) < 0)) && frameObj.size > 0) {
                    frameObj.size -= 20;
                }
                ctx.filter = 'none';
                ctx.fillStyle = this.getFrameColor(frameObj, ctx, points);
                ctx.beginPath();
                ctx.rect(points.startX, points.startY, points.width, points.height);
                ctx.rect(points.startX + frameObj.size, points.startY + frameObj.size, points.width -
                    (2 * frameObj.size), points.height - (2 * frameObj.size));
                ctx.fill('evenodd');
                ctx.closePath();
                break;
            case 'bevel':
                ctx.filter = 'none';
                ctx.fillStyle = this.getFrameColor(frameObj, ctx, points);
                ctx.beginPath();
                ctx.fillRect(points.startX, points.startY, points.width, points.height);
                ctx.closePath();
                points.startX += frameObj.size; points.startY += frameObj.size;
                points.width -= (2 * frameObj.size); points.height -= (2 * frameObj.size);
                while ((points.width - (2 * frameObj.size) < 40 ||
                    points.height - (2 * frameObj.size) < 40) && frameObj.size > 0) {
                    points.startX -= frameObj.size;
                    points.startY -= frameObj.size;
                    points.width += (2 * frameObj.size);
                    points.height += (2 * frameObj.size);
                    frameObj.size -= 20;
                    points.startX += frameObj.size;
                    points.startY += frameObj.size;
                    points.width -= (2 * frameObj.size);
                    points.height -= (2 * frameObj.size);
                }
                ctx.fillStyle = this.getFrameColor(frameObj, ctx, points);
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(points.startX + valueForty, points.startY);
                ctx.lineTo(points.startX + points.width - valueForty, points.startY);
                ctx.quadraticCurveTo(points.startX + points.width, points.startY, points.startX + points.width, points.startY + valueForty);
                ctx.lineTo(points.startX + points.width, points.startY + points.height - valueForty);
                ctx.quadraticCurveTo(points.startX + points.width, points.startY + points.height, points.startX + points.width - valueForty,
                                     points.startY + points.height);
                ctx.lineTo(points.startX + valueForty, points.startY + points.height);
                ctx.quadraticCurveTo(points.startX, points.startY + points.height, points.startX, points.startY + points.height
                    - valueForty);
                ctx.lineTo(points.startX, points.startY + valueForty);
                ctx.quadraticCurveTo(points.startX, points.startY, points.startX + valueForty, points.startY);
                ctx.closePath();
                ctx.clip();
                ctx.filter = filter === 'none' ? parent.canvasFilter : filter;
                if (ctx.canvas.id === parent.element.id + '_tempCanvas') {
                    preventImg = null;
                    ctx.filter = 'none';
                    ctx.drawImage(parent.inMemoryCanvas, 0, 0);
                    ctx.filter = filter === 'none' ? parent.canvasFilter : filter;
                } else {
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    if (preventImg) {
                        preventImg = null;
                        if (parent.transform.zoomFactor !== 0) {this.isRotateZoom = true; }
                        parent.notify('filter', { prop: 'getBevelFilter', onPropertyChange: false, value: {obj: bevelObj} });
                        ctx.filter = bevelObj['bevelFilter'];
                        this.updateCurrTransState('initial');
                        this.drawImgToCtx(ctx, preventImg);
                        this.updateCurrTransState('reverse'); this.isRotateZoom = false;
                        parent.frameObj.type = 'none'; ctx.filter = 'none';
                        parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                            value: {ctx: ctx, shape: 'iterate', pen: 'iterate', isPreventApply: null }});
                        parent.frameObj.type = 'bevel'; ctx.filter = filter === 'none' ? parent.canvasFilter : filter;
                    } else {
                        parent.notify('filter', { prop: 'getBevelFilter', onPropertyChange: false, value: {obj: bevelObj} });
                        ctx.filter = bevelObj['bevelFilter'];
                        this.drawImgToCtx(ctx, preventImg);
                    }
                }
                ctx.restore();
                break;
            case 'line':
                this.drawImgToCtx(ctx, preventImg);
                tempLineWidth = ctx.lineWidth;
                ctx.lineWidth = frameObj.size / 10;
                for (let i: number = 0; i < parent.frameObj.amount; i++) {
                    if (i > 0) {
                        points.startX += frameObj.offset; points.startY += frameObj.offset;
                        points.width -= (2 * frameObj.offset); points.height -= (2 * frameObj.offset);
                    }
                    const arcY2: number = points.startY + points.height - frameObj.inset - frameObj.radius;
                    const lineY: number = points.startY + frameObj.inset + frameObj.radius;
                    const arcX2: number = points.startX + points.width - frameObj.inset - frameObj.radius;
                    const lineX: number = points.startX + frameObj.inset + frameObj.radius;
                    const arcX1: number = points.startX + frameObj.inset + frameObj.radius;
                    const lineX2: number = points.startX + points.width - frameObj.inset - frameObj.radius;
                    const arcY1: number = points.startY + frameObj.inset + frameObj.radius;
                    const lineY2: number = points.startY + points.height - frameObj.inset - frameObj.radius;
                    if (arcY2 >= lineY && arcX2 >= lineX && arcX1 <= lineX2 && arcY1 <= lineY2) {
                        ctx.filter = 'none';
                        ctx.strokeStyle = this.getFrameColor(frameObj, ctx, points);
                        if (frameObj.border === 'dashed') {
                            ctx.setLineDash([ctx.lineWidth * 2.5, ctx.lineWidth * 1.5]);
                        }
                        else if (frameObj.border === 'dotted') {
                            ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
                        }
                        ctx.beginPath();
                        ctx.moveTo(points.startX + frameObj.inset + frameObj.radius, points.startY + frameObj.inset);
                        ctx.lineTo(points.startX + points.width - frameObj.inset - frameObj.radius, points.startY + frameObj.inset);
                        ctx.arcTo(points.startX + points.width - frameObj.inset, points.startY + frameObj.inset,
                                  points.startX + points.width - frameObj.inset, points.startY + frameObj.inset + frameObj.radius,
                                  frameObj.radius);
                        ctx.lineTo(points.startX + points.width - frameObj.inset, points.startY + points.height - frameObj.inset -
                            frameObj.radius);
                        ctx.arcTo(points.startX + points.width - frameObj.inset, points.startY + points.height - frameObj.inset,
                                  points.startX + points.width - frameObj.inset - frameObj.radius, points.startY + points.height
                                - frameObj.inset, frameObj.radius);
                        ctx.lineTo(points.startX + frameObj.inset + frameObj.radius, points.startY + points.height - frameObj.inset);
                        ctx.arcTo(points.startX + frameObj.inset, points.startY + points.height - frameObj.inset,
                                  points.startX + frameObj.inset, points.startY + points.height - frameObj.inset - frameObj.radius,
                                  frameObj.radius);
                        ctx.lineTo(points.startX + frameObj.inset, points.startY + frameObj.inset + frameObj.radius);
                        ctx.arcTo(points.startX + frameObj.inset, points.startY + frameObj.inset,
                                  points.startX + frameObj.inset + frameObj.radius, points.startY + frameObj.inset, frameObj.radius);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                }
                ctx.lineWidth = tempLineWidth;
                break;
            case 'inset':
                this.drawImgToCtx(ctx, preventImg);
                ctx.filter = 'none';
                ctx.strokeStyle = this.getFrameColor(frameObj, ctx, points);
                tempLineWidth = ctx.lineWidth;
                ctx.lineWidth = frameObj.size / 10;
                ctx.beginPath();
                ctx.moveTo(points.startX + frameObj.offset, points.startY + frameObj.inset);
                ctx.lineTo(points.startX + points.width - frameObj.offset, points.startY + frameObj.inset);
                ctx.moveTo(points.startX + points.width - frameObj.inset, points.startY + frameObj.offset);
                ctx.lineTo(points.startX + points.width - frameObj.inset, points.startY + points.height - frameObj.offset);
                ctx.moveTo(points.startX + points.width - frameObj.offset, points.startY + points.height - frameObj.inset);
                ctx.lineTo(points.startX + frameObj.offset, points.startY + points.height - frameObj.inset);
                ctx.moveTo(points.startX + frameObj.inset, points.startY + points.height - frameObj.offset);
                ctx.lineTo(points.startX + frameObj.inset, points.startY + frameObj.offset);
                ctx.stroke();
                ctx.closePath();
                ctx.lineWidth = tempLineWidth;
                break;
            case 'hook':
                this.drawImgToCtx(ctx, preventImg);
                ctx.filter = 'none';
                ctx.strokeStyle = this.getFrameColor(frameObj, ctx, points);
                tempLineWidth = ctx.lineWidth;
                ctx.lineWidth = frameObj.size / 10;
                ctx.beginPath();
                ctx.moveTo(points.startX + frameObj.inset + valueFifty, points.startY + frameObj.inset);
                ctx.lineTo(points.startX + frameObj.inset, points.startY + frameObj.inset);
                ctx.lineTo(points.startX + frameObj.inset, points.startY + frameObj.inset + valueFifty);
                ctx.moveTo(points.startX + points.width - frameObj.inset - valueFifty, points.startY + frameObj.inset);
                ctx.lineTo(points.startX + points.width - frameObj.inset, points.startY + frameObj.inset);
                ctx.lineTo(points.startX + points.width - frameObj.inset, points.startY + frameObj.inset + valueFifty);
                ctx.moveTo(points.startX + points.width - frameObj.inset - valueFifty, points.startY + points.height - frameObj.inset);
                ctx.lineTo(points.startX + points.width - frameObj.inset, points.startY + points.height - frameObj.inset);
                ctx.lineTo(points.startX + points.width - frameObj.inset, points.startY + points.height - frameObj.inset - valueFifty);
                ctx.moveTo(points.startX + frameObj.inset + valueFifty, points.startY + points.height - frameObj.inset);
                ctx.lineTo(points.startX + frameObj.inset, points.startY + points.height - frameObj.inset);
                ctx.lineTo(points.startX + frameObj.inset, points.startY + points.height - frameObj.inset - valueFifty);
                ctx.stroke();
                ctx.lineWidth = tempLineWidth;
                break;
            }
            if (parent.isCircleCrop || (parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle')) {
                parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                    value: {context: ctx, isSave: ctx.canvas.id === parent.element.id + '_tempCanvas' ? true : null, isFlip: null}});
            }
            ctx.filter = filter;
        }
    }

    private triggerFrameChange(prevFrameSettings: FrameSettings): FrameChangeEventArgs {
        const parent: ImageEditor = this.parent;
        const currFrameSettings: FrameSettings = {type: parent.toPascalCase(parent.frameObj.type) as FrameType,
            color: parent.frameObj.color, gradientColor: parent.frameObj.gradientColor, size: parent.frameObj.size,
            inset: parent.frameObj.inset, offset: parent.frameObj.offset, borderRadius: parent.frameObj.radius,
            frameLineStyle: parent.toPascalCase(parent.frameObj.border) as FrameLineStyle, lineCount: parent.frameObj.amount};
        const frameChange: FrameChangeEventArgs = {cancel: false, previousFrameSetting: prevFrameSettings,
            currentFrameSetting: currFrameSettings };
        parent.trigger('frameChange', frameChange);
        parent.editCompleteArgs = frameChange;
        if (!frameChange.cancel) {this.setFrameObj(frameChange.currentFrameSetting); }
        return frameChange;
    }

    private setFrameObj(currFrameSettings: FrameSettings): void {
        const parent: ImageEditor = this.parent;
        parent.frameObj.type = currFrameSettings.type.toLowerCase();
        parent.frameObj.color = currFrameSettings.color;
        parent.frameObj.gradientColor = currFrameSettings.gradientColor;
        parent.frameObj.size = currFrameSettings.size;
        parent.frameObj.inset = currFrameSettings.inset;
        parent.frameObj.offset = currFrameSettings.offset;
        parent.frameObj.radius = currFrameSettings.borderRadius;
        parent.frameObj.border = currFrameSettings.frameLineStyle.toLowerCase();
        parent.frameObj.amount = currFrameSettings.lineCount;
    }

    private zoomToSel(activeObj: SelectionPoint, isToolbar: boolean): void {
        const parent: ImageEditor = this.parent;
        if (this.straightenActObj && JSON.stringify(this.straightenActObj.activePoint) === JSON.stringify(activeObj.activePoint)) {
            parent.activeObj = extend({}, this.straightenActObj, null, true) as SelectionPoint;
            this.allowRedactStraighten = false;
            if (parent.transform.straighten === 0) {
                const destWidth: number = parent.img.destWidth; const destHeight: number = parent.img.destHeight;
                parent.transform.straighten = 360;
                while (true) {
                    if (!isNullOrUndefined(this.straightenInitZoom) &&
                        (Math.round(parent.transform.zoomFactor * Math.pow(10, 3) ) / Math.pow(10, 3)) >
                        (Math.round(this.straightenInitZoom * Math.pow(10, 3) ) / Math.pow(10, 3))) {
                        this.setZoomPan('out');
                        if (destWidth === parent.img.destWidth && destHeight === parent.img.destHeight) {
                            this.performDummyZoom();
                            break;
                        }
                        if (parent.transform.degree === 0) {
                            parent.transform.zoomFactor -= 0.025; parent.transform.cropZoomFactor -= 0.025;
                        }
                    } else {
                        this.performDummyZoom();
                        break;
                    }
                }
                parent.transform.straighten = 0;
                parent.img = {destLeft: parent.img.destLeft, destTop: parent.img.destTop, destWidth: parent.img.destWidth,
                    destHeight: parent.img.destHeight, srcLeft: parent.img.srcLeft, srcTop: parent.img.srcTop,
                    srcWidth: parent.img.srcWidth, srcHeight: parent.img.srcHeight};
            } else {
                if (isNullOrUndefined(this.straightenInitZoom)) {
                    this.straightenInitZoom = parent.transform.zoomFactor;
                }
                if (this.straightenInitZoom - parent.transform.zoomFactor > 0) {
                    parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                        value: { zoomFactor: -(this.straightenInitZoom - parent.transform.zoomFactor), zoomPoint: null, isResize: true } });
                }
                else if (this.straightenInitZoom - parent.transform.zoomFactor < 0) {
                    parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                        value: { zoomFactor: (this.straightenInitZoom - parent.transform.zoomFactor), zoomPoint: null, isResize: true } });
                }
                parent.activeObj = extend({}, activeObj, null, true) as SelectionPoint;
                parent.transform.zoomFactor += 0.001;
                this.calcStraightenedPoints(isToolbar);
            }
        } else {
            this.straightenActObj = extend({}, activeObj, null, true) as SelectionPoint;
            parent.activeObj = extend({}, this.straightenActObj, null, true) as SelectionPoint;
            this.straightenInitZoom = parent.transform.zoomFactor;
            this.calcStraightenedPoints(isToolbar);
        }
    }

    private isDestPointSmall(): boolean {
        const parent: ImageEditor = this.parent;
        const img: ImageDimension = parent.img;
        const destPoints: ActivePoint = {startX: img.destLeft, startY: img.destTop,
            width: img.destWidth, height: img.destHeight};
        parent.notify('shape', { prop: 'straightenShapes', onPropertyChange: false});
        let isSmall: boolean = false;
        if (this.straightenDestPoints.destWidth && this.straightenDestPoints.destHeight &&
            (img.destWidth < this.straightenDestPoints.destWidth || img.destHeight < this.straightenDestPoints.destHeight)) {
            isSmall = true;
        }
        img.destLeft = destPoints.startX; img.destTop = destPoints.startY;
        img.destWidth = destPoints.width; img.destHeight = destPoints.height;
        parent.img = img;
        return isSmall;
    }

    private calcStraightenedPoints(isToolbar: boolean): void {
        const parent: ImageEditor = this.parent;
        const destWidth: number = parent.img.destWidth;
        const destHeight: number = parent.img.destHeight;
        if (isNullOrUndefined(parent.transform.zoomFactor)) {
            parent.transform.zoomFactor += 0.025;
        }
        this.updateImgCanvasPoints();
        while (true) {
            if (this.isLinesIntersect() || this.isSelOutsideImg() || (isToolbar && this.isDestPointSmall())) {
                parent.activeObj = extend({}, this.straightenActObj, null, true) as SelectionPoint;
                this.setZoomPan('in');
                if (destWidth === parent.img.destWidth && destHeight === parent.img.destHeight) {
                    this.performDummyZoom();
                    break;
                }
                if (parent.transform.degree === 0) {
                    parent.transform.zoomFactor += 0.025; parent.transform.cropZoomFactor += 0.025;
                }
                const points: Point[] = this.imgCanvasPoints;
                const left: number = parent.img.destLeft; const top: number = parent.img.destTop;
                const width: number = parent.img.destWidth; const height: number = parent.img.destHeight;
                points.forEach((point: Point): void => {
                    point.x = (point.ratioX * width) + left;
                    point.y = (point.ratioY * height) + top;
                });
                this.imgCanvasPoints = points;
            } else {
                this.performDummyZoom();
                break;
            }
        }
    }

    private performDummyZoom(): void {
        const parent: ImageEditor = this.parent;
        parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
            value: {zoomFactor: 0.025, zoomPoint: null, isResize: true}});
        parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
            value: {zoomFactor: -0.025, zoomPoint: null, isResize: true}});
        let zoom: number = parent.transform.zoomFactor * 10;
        if (zoom < 1) {zoom = 1 + (zoom / 10); }
        parent.setProperties({ zoomSettings: { zoomFactor: zoom }}, true);
        parent.notify('transform', { prop: 'setPreviousZoomValue', onPropertyChange: false,
            value: { previousZoomValue: zoom }});
        this.panToSel();
    }

    private setZoomPan(type: string): void {
        const parent: ImageEditor = this.parent;
        const obj: Object = {maxDimension: null };
        if (parent.transform.degree === 0) {
            parent.notify('transform', { prop: 'cropZoom', onPropertyChange: false,
                value: { value: type === 'in' ? 0.025 : -0.025, selectionObj: parent.activeObj, obj: obj }});
            parent.img.destWidth = obj['maxDimension']['width']; parent.img.destHeight = obj['maxDimension']['height'];
        } else {
            parent.transform.zoomFactor += (type === 'in' ? 0.025 : -0.025 );
            parent.transform.cropZoomFactor += (type === 'in' ? 0.025 : -0.025 );
            this.updateCurrTransState('initial');
            this.isRotateZoom = true;
            this.setDestPoints();
            this.isRotateZoom = false;
            this.updateCurrTransState('reverse');
        }
    }

    private updateImgCanvasPoints(): void {
        const parent: ImageEditor = this.parent;
        const points: Point[] = this.getImagePoints();
        const obj: Object = {width: 0, height: 0 };
        let width: number = parent.baseImgCanvas.width;
        let height: number = parent.baseImgCanvas.height;
        parent.notify('crop', { prop: 'calcRatio', onPropertyChange: false,
            value: {obj: obj, dimension: {width: width, height: height }}});
        const ratio: Dimension = obj as Dimension;
        width = parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0 ?
            ratio.height : ratio.width;
        height = parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0 ?
            ratio.width : ratio.height;
        let p1: Point; let p2: Point; let p3: Point; let p4: Point;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        if (parent.transform.straighten > 0) {
            p1 = {x: destLeft + (points[0].x / width), y: destTop};
            p2 = {x: destLeft + destWidth, y: destTop + (points[1].y / height)};
            p3 = {x: destLeft + destWidth - (points[0].x / width), y: destTop + destHeight};
            p4 = {x: destLeft, y: destTop + destHeight - (points[1].y / height)};
        } else if (parent.transform.straighten < 0) {
            p1 = {x: destLeft, y: destTop + (points[0].y / height)};
            p2 = {x: destLeft + (points[1].x / width), y: destTop};
            p3 = {x: destLeft + destWidth, y: destTop + destHeight - (points[0].y / height)};
            p4 = {x: destLeft + destWidth - (points[1].x / width), y: destTop + destHeight};
        } else if (parent.transform.straighten === 0) {
            p1 = {x: destLeft, y: destTop};
            p2 = {x: destLeft + destWidth, y: destTop};
            p3 = {x: destLeft + destWidth, y: destTop + destHeight};
            p4 = {x: destLeft, y: destTop + destHeight};
        }
        p1.ratioX = (p1.x - destLeft) / destWidth; p1.ratioY = (p1.y - destTop) / destHeight;
        p2.ratioX = (p2.x - destLeft) / destWidth; p2.ratioY = (p2.y - destTop) / destHeight;
        p3.ratioX = (p3.x - destLeft) / destWidth; p3.ratioY = (p3.y - destTop) / destHeight;
        p4.ratioX = (p4.x - destLeft) / destWidth; p4.ratioY = (p4.y - destTop) / destHeight;
        this.imgCanvasPoints = [p1, p2, p3, p4];
    }

    private isLinesIntersect(obj?: Object): boolean {
        const parent: ImageEditor = this.parent;
        const point: ActivePoint = parent.activeObj.activePoint;
        if (parent.activeObj.rotatedAngle !== 0) {
            const { startX, startY, endX, endY, width, height } = parent.activeObj.activePoint;
            const center: Point = {x: startX + (width / 2), y: startY +
                (height / 2)};
            const cosAngle: number = Math.cos(parent.activeObj.rotatedAngle);
            const sinAngle: number = Math.sin(parent.activeObj.rotatedAngle);
            const p1: Point = { x: cosAngle * (startX - center.x) - sinAngle * (startY - center.y) + center.x,
                y: sinAngle * (startX - center.x) + cosAngle * (startY - center.y) + center.y };
            const p2: Point = { x: cosAngle * (endX - center.x) - sinAngle * (startY - center.y) + center.x,
                y: sinAngle * (endX - center.x) + cosAngle * (startY - center.y) + center.y };
            const p3: Point = { x: cosAngle * (startX - center.x) - sinAngle * (endY - center.y) + center.x,
                y: sinAngle * (startX - center.x) + cosAngle * (endY - center.y) + center.y };
            const p4: Point = { x: cosAngle * (endX - center.x) - sinAngle * (endY - center.y) + center.x,
                y: sinAngle * (endX - center.x) + cosAngle * (endY - center.y) + center.y };
            const imgPoints: Point[] = this.imgCanvasPoints;
            const isTopIntersect: boolean = this.doIntersect(p1, p2, imgPoints[0], imgPoints[1]);
            const isRightIntersect: boolean = this.doIntersect(p2, p4, imgPoints[1], imgPoints[2]);
            const isBottomIntersect: boolean = this.doIntersect(p3, p4, imgPoints[2], imgPoints[3]);
            const isLeftIntersect: boolean = this.doIntersect(p1, p3, imgPoints[3], imgPoints[0]);
            if (obj) {obj['arr'] = [isTopIntersect, isRightIntersect, isBottomIntersect, isLeftIntersect]; }
            return isTopIntersect || isRightIntersect || isBottomIntersect || isLeftIntersect;
        }
        const imgPoints: Point[] = this.imgCanvasPoints;
        const isTopIntersect: boolean = this.doIntersect({x: point.startX, y: point.startY},
                                                         {x: point.endX, y: point.startY}, imgPoints[0], imgPoints[1]);
        const isRightIntersect: boolean = this.doIntersect({x: point.endX, y: point.startY},
                                                           {x: point.endX, y: point.endY}, imgPoints[1], imgPoints[2]);
        const isBottomIntersect: boolean = this.doIntersect({x: point.startX, y: point.endY},
                                                            {x: point.endX, y: point.endY}, imgPoints[2], imgPoints[3]);
        const isLeftIntersect: boolean = this.doIntersect({x: point.startX, y: point.startY},
                                                          {x: point.startX, y: point.endY}, imgPoints[3], imgPoints[0]);
        const isTopLeftInsideRect: boolean = this.isInsideRect(imgPoints[0]);
        const isTopRightInsideRect: boolean = this.isInsideRect(imgPoints[1]);
        const isBottomRightInsideRect: boolean = this.isInsideRect(imgPoints[2]);
        const isBottomLeftInsideRect: boolean = this.isInsideRect(imgPoints[3]);
        if (obj) {obj['arr'] = [isTopIntersect, isRightIntersect, isBottomIntersect, isLeftIntersect]; }
        return isTopIntersect || isRightIntersect || isBottomIntersect || isLeftIntersect ||
            isTopLeftInsideRect || isTopRightInsideRect || isBottomRightInsideRect || isBottomLeftInsideRect ||
            (imgPoints[0].x > point.startX && imgPoints[1].x < point.endX &&
            imgPoints[2].x < point.endX && imgPoints[3].x > point.startX &&
            imgPoints[0].y < point.startY && imgPoints[1].y < point.startY &&
            imgPoints[2].y > point.endY && imgPoints[3].y > point.endY) ||
            (imgPoints[0].x < point.startX && imgPoints[1].x > point.endX &&
            imgPoints[2].x > point.endX && imgPoints[3].x < point.startX &&
            imgPoints[0].y > point.startY && imgPoints[1].y > point.startY &&
            imgPoints[2].y < point.endY && imgPoints[3].y < point.endY);
    }

    private isSelOutsideImg(): boolean {
        const parent: ImageEditor = this.parent;
        const points: Point[] = this.imgCanvasPoints;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        return (this.checkPointPosition(actPoint.startX, actPoint.startY, points[0].x, points[0].y,
                                        points[1].x, points[1].y, points[2].x, points[2].y,
                                        points[3].x, points[3].y) !== 'inside' ||
        this.checkPointPosition(actPoint.endX, actPoint.startY, points[0].x, points[0].y,
                                points[1].x, points[1].y, points[2].x, points[2].y,
                                points[3].x, points[3].y) !== 'inside' ||
        this.checkPointPosition(actPoint.startX, actPoint.endY, points[0].x, points[0].y,
                                points[1].x, points[1].y, points[2].x, points[2].y,
                                points[3].x, points[3].y) !== 'inside' ||
        this.checkPointPosition(actPoint.endX, actPoint.endY, points[0].x, points[0].y,
                                points[1].x, points[1].y, points[2].x, points[2].y,
                                points[3].x, points[3].y) !== 'inside');
    }

    private calcTriangleArea(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
    }

    private checkPointPosition(x: number, y: number, x1: number, y1: number, x2: number, y2: number,
                               x3: number, y3: number, x4: number, y4: number): string {
        const area1: number = this.calcTriangleArea(x, y, x1, y1, x4, y4);
        const area2: number = this.calcTriangleArea(x, y, x4, y4, x3, y3);
        const area3: number = this.calcTriangleArea(x, y, x3, y3, x2, y2);
        const area4: number = this.calcTriangleArea(x, y, x2, y2, x1, y1);
        const areaRectangle: number = this.calcTriangleArea(x1, y1, x2, y2, x3, y3) + this.calcTriangleArea(x3, y3, x4, y4, x1, y1);
        if (area1 + area2 + area3 + area4 > areaRectangle) {
            return 'outside';
        } else if (area1 + area2 + area3 + area4 === areaRectangle && (area1 === 0 || area2 === 0 || area3 === 0 || area4 === 0)) {
            return 'on';
        } else {
            return 'inside';
        }
    }

    private getImagePoints(): Point[] {
        const point: Point[] = []; const parent: ImageEditor = this.parent;
        const degree: number = parent.transform.degree;
        const width: number = parent.baseImg.width;
        const height: number = parent.baseImg.height;
        const obj: Object = {dim: null, width: height, height: width, angle: parent.transform.straighten };
        obj['dim'] = parent.getRotatedCanvasDim(obj['width'], obj['height'], obj['angle']);
        const baseImgCanvasWidth: number = degree % 90 === 0 && degree % 180 !== 0 ? obj['dim']['width'] : parent.baseImgCanvas.width;
        const baseImgCanvasHeight: number = degree % 90 === 0 && degree % 180 !== 0 ? obj['dim']['height'] : parent.baseImgCanvas.height;
        const baseImgWidth: number = degree % 90 === 0 && degree % 180 !== 0 ? height : width;
        const baseImgHeight: number = degree % 90 === 0 && degree % 180 !== 0 ? width : height;
        const centerX: number = baseImgCanvasWidth / 2;
        const centerY: number = baseImgCanvasHeight / 2;
        const startX: number = centerX - (baseImgWidth / 2);
        const startY: number = centerY - (baseImgHeight / 2);
        const endX: number = centerX + (baseImgWidth / 2);
        const endY: number = centerY + (baseImgHeight / 2);
        const center: Point = {x: centerX, y: centerY};
        const radians: number = parent.transform.straighten * (Math.PI / 180);
        const p1: Point = { x: Math.cos(radians) * (startX - center.x) - Math.sin(radians) * (startY - center.y) + center.x,
            y: Math.sin(radians) * (startX - center.x) + Math.cos(radians) * (startY - center.y) + center.y };
        const p2: Point = { x: Math.cos(radians) * (endX - center.x) - Math.sin(radians) * (startY - center.y) + center.x,
            y: Math.sin(radians) * (endX - center.x) + Math.cos(radians) * (startY - center.y) + center.y };
        const p3: Point = { x: Math.cos(radians) * (endX - center.x) - Math.sin(radians) * (endY - center.y) + center.x,
            y: Math.sin(radians) * (endX - center.x) + Math.cos(radians) * (endY - center.y) + center.y };
        const p4: Point = { x: Math.cos(radians) * (startX - center.x) - Math.sin(radians) * (endY - center.y) + center.x,
            y: Math.sin(radians) * (startX - center.x) + Math.cos(radians) * (endY - center.y) + center.y };
        point.push(p1); point.push(p2); point.push(p3); point.push(p4);
        return point;
    }

    private doIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
        const point1: number = this.initiation(a, b, c);
        const point2: number = this.initiation(a, b, d);
        const point3: number = this.initiation(c, d, a);
        const point4: number = this.initiation(c, d, b);
        if (point1 !== point2 && point3 !== point4) { return true; }
        if (point1 === 0 && this.onSegment(a, c, b)) { return true; }
        if (point2 === 0 && this.onSegment(a, d, b)) { return true; }
        if (point3 === 0 && this.onSegment(c, a, d)) { return true; }
        if (point4 === 0 && this.onSegment(c, b, d)) { return true; }
        return false;
    }

    private initiation(a: Point, b: Point, c: Point): number {
        const value: number = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
        if (value === 0) { return 0; }
        return (value > 0) ? 1 : 2;
    }

    private onSegment(a: Point, b: Point, c: Point): boolean {
        if (b.x <= Math.max(a.x, c.x) && b.x >= Math.min(a.x, c.x) &&
            b.y <= Math.max(a.y, c.y) && b.y >= Math.min(a.y, c.y)) {
            return true;
        }
        return false;
    }

    private isInsideRect(point: Point): boolean {
        const parent: ImageEditor = this.parent; const actPoint: ActivePoint = parent.activeObj.activePoint;
        let isInside: boolean = false;
        if (point.x >= actPoint.startX && point.x <= actPoint.endX &&
            point.y >= actPoint.startY && point.y <= actPoint.endY) {
            isInside = true;
        }
        return isInside;
    }

    private setDestForStraighten(): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(this.straightenDestPoints)) {
            const { destLeft, destTop, destWidth, destHeight } = parent.img;
            // If straightening performed, then destination points are set in non-straightened state
            parent.notify('shape', { prop: 'straightenShapes', onPropertyChange: false});
            this.straightenDestPoints = extend({}, parent.img, {}, true) as ImageDimension;
            parent.img.destLeft = destLeft; parent.img.destTop = destTop;
            parent.img.destWidth = destWidth; parent.img.destHeight = destHeight;
        }
    }

    private drawRedact(canvasDraw: CanvasRenderingContext2D, obj: SelectionPoint): void {
        let {startX, startY, endX, endY} = obj.activePoint;
        const {width, height} = obj.activePoint;
        let isSaveCtx: boolean = false; const canvas: HTMLCanvasElement = canvasDraw.canvas;
        if (canvas.id.indexOf('_tempCanvas') !== -1) {isSaveCtx = true; }
        const img: ImageDimension = this.parent.img;
        if (width <= 0 || height <= 0) {
            return;
        } else if (this.parent.isCropTab) {
            canvasDraw.drawImage(obj.redactImage, 0, 0, obj.redactImage.width, obj.redactImage.height,
                                 startX, startY, width, height);
        } else {
            const offscreenCanvas: HTMLCanvasElement = document.createElement('canvas');
            const offscreenCtx: CanvasRenderingContext2D = offscreenCanvas.getContext('2d');
            const imageWidth: number = canvas.width;
            const imageHeight: number = canvas.height;
            const tempRatio: number = Math.min(imageWidth, imageHeight) / 1000;
            const straighten: number = this.parent.transform.straighten !== 0 ? this.parent.transform.straighten :
                this.parent.cropObj.straighten;
            if (this.allowRedactStraighten && straighten !== 0) {
                const tempCanvas: HTMLCanvasElement = document.createElement('canvas');
                const tempCtx: CanvasRenderingContext2D = tempCanvas.getContext('2d');
                if (isSaveCtx) {
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    tempCtx.drawImage(canvas, 0, 0);
                } else {
                    tempCanvas.width = img.destWidth; tempCanvas.height = img.destHeight;
                    tempCtx.drawImage(this.lowerContext.canvas, img.destLeft, img.destTop, img.destWidth, img.destHeight,
                                      0, 0, img.destWidth, img.destHeight);
                }
                const radians: number = -straighten * Math.PI / 180;
                const straightenCanvas: HTMLCanvasElement = document.createElement('canvas');
                const straightenCtx: CanvasRenderingContext2D = straightenCanvas.getContext('2d');
                straightenCanvas.width = tempCanvas.width; straightenCanvas.height = tempCanvas.height;
                if (img.destWidth > canvas.width && !isSaveCtx) {
                    straightenCanvas.width = canvas.width;
                }
                if (img.destHeight > canvas.height && !isSaveCtx) {
                    straightenCanvas.height = canvas.height;
                }
                straightenCtx.save();
                straightenCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
                straightenCtx.rotate(radians);
                straightenCtx.drawImage(tempCanvas, -tempCanvas.width / 2, -tempCanvas.height / 2);
                straightenCtx.restore();
                if (img.destLeft > 0 && !isSaveCtx) {startX -= img.destLeft; endX -= img.destLeft; }
                if (img.destTop > 0 && !isSaveCtx) {startY -= img.destTop; endY -= img.destTop; }
                let center: Point = {x: startX + (width / 2), y: startY + (height / 2)};
                let cosAngle: number = Math.cos(straighten * Math.PI / 180);
                let sinAngle: number = Math.sin(straighten * Math.PI / 180);
                const p1: Point = { x: cosAngle * (startX - center.x) - sinAngle * (startY - center.y) + center.x,
                    y: sinAngle * (startX - center.x) + cosAngle * (startY - center.y) + center.y };
                const p2: Point = { x: cosAngle * (endX - center.x) - sinAngle * (startY - center.y) + center.x,
                    y: sinAngle * (endX - center.x) + cosAngle * (startY - center.y) + center.y };
                const p3: Point = { x: cosAngle * (startX - center.x) - sinAngle * (endY - center.y) + center.x,
                    y: sinAngle * (startX - center.x) + cosAngle * (endY - center.y) + center.y };
                if (!isSaveCtx) {
                    center = { x: img.destWidth / 2, y: img.destHeight / 2 };
                    if (img.destWidth > canvas.width) {
                        center.x = canvas.width / 2;
                    }
                    if (img.destHeight > canvas.height) {
                        center.y = canvas.height / 2;
                    }
                } else {
                    center = { x: canvas.width / 2, y: canvas.height / 2 };
                }
                cosAngle = Math.cos(radians);
                sinAngle = Math.sin(radians);
                const newP1: Point = { x: cosAngle * (p1.x - center.x) - sinAngle * (p1.y - center.y) + center.x,
                    y: sinAngle * (p1.x - center.x) + cosAngle * (p1.y - center.y) + center.y };
                const newP2: Point = { x: cosAngle * (p2.x - center.x) - sinAngle * (p2.y - center.y) + center.x,
                    y: sinAngle * (p2.x - center.x) + cosAngle * (p2.y - center.y) + center.y };
                const newP3: Point = { x: cosAngle * (p3.x - center.x) - sinAngle * (p3.y - center.y) + center.x,
                    y: sinAngle * (p3.x - center.x) + cosAngle * (p3.y - center.y) + center.y };
                if (this.parent.activeObj.redactType === 'blur') {
                    offscreenCanvas.width = width;
                    offscreenCanvas.height = height;
                    offscreenCtx.drawImage(straightenCanvas, newP1.x, newP1.y, newP2.x - newP1.x, newP3.y - newP2.y, 0, 0, width, height);
                } else {
                    let pixelSize: number = (obj.redactPixelate / 100) * 20;
                    if (isSaveCtx) {
                        pixelSize = tempRatio * (obj.redactPixelate / 100) * 35;
                    }
                    offscreenCanvas.width = Math.ceil(width / pixelSize);
                    offscreenCanvas.height = Math.ceil(height / pixelSize);
                    offscreenCtx.drawImage(straightenCanvas, newP1.x, newP1.y, newP2.x - newP1.x, newP3.y - newP2.y,
                                           0, 0, offscreenCanvas.width, offscreenCanvas.height);
                }
            }
            if (this.parent.activeObj.redactType === 'blur') {
                if (straighten === 0) {
                    offscreenCanvas.width = width;
                    offscreenCanvas.height = height;
                    offscreenCtx.drawImage(
                        (isSaveCtx) ? canvas : this.lowerContext.canvas,
                        startX, startY, width, height, 0, 0, width, height
                    );
                }
                if (isSaveCtx) {
                    const blur: number = tempRatio * ((obj.redactBlur / 100) * 34);
                    offscreenCtx.filter = `blur(${blur}px)`;
                } else {
                    offscreenCtx.filter = `blur(${(obj.redactBlur / 100) * 17}px)`;
                }
                offscreenCtx.drawImage(offscreenCanvas, 0, 0);
                if (straighten === 0) {
                    offscreenCtx.drawImage((isSaveCtx) ? canvas : this.lowerContext.canvas, startX, startY, width, height,
                                           0, 0, width, height);
                } else {
                    if (img.destLeft > 0 && !isSaveCtx) {startX += img.destLeft; endX += img.destLeft; }
                    if (img.destTop > 0 && !isSaveCtx) {startY += img.destTop; endY += img.destTop; }
                }
                if (this.parent.isSafari) {
                    this.parent.notify('filter', { prop: 'apply-filter', onPropertyChange: false, value: {context: offscreenCtx }});
                }
                canvasDraw.drawImage(offscreenCanvas, 0, 0, width, height, startX, startY, width, height);
            } else {
                let pixelSize: number = (obj.redactPixelate / 100) * 20;
                if (isSaveCtx) {
                    pixelSize = tempRatio * (obj.redactPixelate / 100) * 35;
                }
                if (straighten === 0) {
                    offscreenCanvas.width = Math.ceil(width / pixelSize);
                    offscreenCanvas.height = Math.ceil(height / pixelSize);
                    offscreenCtx.drawImage((isSaveCtx) ? canvas : this.lowerContext.canvas, startX, startY, width, height,
                                           0, 0, offscreenCanvas.width, offscreenCanvas.height);
                } else {
                    if (img.destLeft > 0 && !isSaveCtx) {
                        startX += img.destLeft;
                        endX += img.destLeft;
                    }
                    if (img.destTop > 0 && !isSaveCtx) {
                        startY += img.destTop;
                        endY += img.destTop;
                    }
                }
                canvasDraw.imageSmoothingEnabled = false;
                canvasDraw.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, startX, startY, width, height);
            }
            obj.redactImage = this.parent.createElement('canvas');
            obj.redactImage.width = offscreenCanvas.width;
            obj.redactImage.height = offscreenCanvas.height;
            obj.redactImage.getContext('2d').drawImage(offscreenCanvas, 0, 0);
            canvasDraw.beginPath();
            canvasDraw.rect(startX, startY, width, height);
            canvasDraw.rect(startX, startY, width, height);
            canvasDraw.fill('evenodd');
            canvasDraw.closePath();
        }
    }
}
