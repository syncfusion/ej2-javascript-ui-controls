import { Browser, extend, getComponent, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ActivePoint, Dimension, NumericTextBox } from '@syncfusion/ej2-inputs';
import { CurrentObject, Direction, FlipEventArgs, ImageEditor, PanEventArgs, Point, ResizeEventArgs } from '../index';
import { ImageDimension, RotateEventArgs, SelectionPoint, StrokeSettings, ZoomEventArgs } from '../index';
import { hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { Toolbar } from '@syncfusion/ej2-navigations';

export class Transform {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private zoomBtnHold: any;
    private tempPanMove: Point; // To store previous pan move point
    private panMove: Point; // To store pan move point
    private isReverseFlip: boolean = false; // True when rotate method is called from iteration
    private disablePan: boolean = false; // auto enable / disable pan while zooming
    private currDestPoint: ActivePoint; // To redraw old image when navigate to crop tab
    private isReverseRotate: boolean = false; // True when rotate method is called from iteration
    private flipColl: string[] = []; // To store flip order
    private transCurrObj: CurrentObject;
    private prevZoomValue: number = 1;
    private tempActiveObj: SelectionPoint; private isShape: boolean;
    private cropDimension: Dimension = { width: 0, height: 0 };
    private isPreventSelect: boolean = false;
    private prevResizeCurrObj: CurrentObject;
    private preventDownScale: boolean = false;
    private resizedImgAngle: number = null;
    private resizeEventCancel: boolean;

    constructor(parent: ImageEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on('transform', this.transform, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('transform', this.transform);
        this.parent.off('destroyed', this.destroy);
    }

    private transform(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        this.initTransformPvtVar();
        switch (args.prop) {
        case 'rotateImage':
            this.rotateImage(args.value['degree']);
            break;
        case 'flipImage':
            this.flipImage(args.value['direction']);
            break;
        case 'setDestPointsForFlipState':
            this.setDestPointsForFlipState();
            break;
        case 'zoomAction':
            this.zoomAction(args.value['zoomFactor'], args.value['zoomPoint'], args.value['isResize']);
            break;
        case 'disableZoomOutBtn':
            this.disableZoomOutBtn(args.value['isZoomOut']);
            break;
        case 'rotatedFlip':
            this.rotatedFlip();
            break;
        case 'drawPannedImage':
            this.drawPannedImage(args.value['xDiff'], args.value['yDiff']);
            break;
        case 'drawPannImage':
            this.drawPannImage(args.value['point']);
            break;
        case 'performTransformation':
            this.performTransformation(args.value['text']);
            break;
        case 'updateTransform':
            this.updateTransform(args.value['text']);
            break;
        case 'rotatePan':
            this.rotatePan(args.value['isCropSelection'], args.value['isDefaultZoom']);
            break;
        case 'drawRotatedImage':
            this.drawRotatedImage(args.value['degree']);
            break;
        case 'limitPan':
            this.limitPan();
            break;
        case 'updateFlipActiveObj':
            this.updateFlipActiveObj(args.value['panRegion']);
            break;
        case 'resetZoom':
            this.resetZoom();
            break;
        case 'pan':
            this.pan(args.value['value']);
            break;
        case 'zoom':
            this.zoom(args.value['zoomFactor'], args.value['zoomPoint']);
            break;
        case 'setCurrPanRegion':
            this.setCurrPanRegion(args.value['region'], args.value['type'], args.value['obj']);
            break;
        case 'rotate':
            this.rotate(args.value['degree'], args.value['obj']);
            break;
        case 'flip':
            this.flip(args.value['direction']);
            break;
        case 'update':
            this.update();
            break;
        case 'calcMaxDimension':
            this.calcMaxDimension(args.value['width'], args.value['height'], args.value['obj'], args.value['isImgShape']);
            break;
        case 'getPanMove':
            args.value['obj']['panMove'] = this.panMove;
            break;
        case 'setPanMove':
            this.panMove = args.value['point'];
            break;
        case 'getTempPanMove':
            args.value['obj']['tempPanMove'] = this.tempPanMove;
            break;
        case 'setTempPanMove':
            this.tempPanMove = args.value['point'];
            break;
        case 'setReverseFlip':
            this.isReverseFlip = args.value['isReverseFlip'];
            break;
        case 'setDisablePan':
            this.disablePan = args.value['bool'];
            break;
        case 'setCurrDestinationPoint':
            this.currDestPoint = args.value['point'];
            this.currDestPoint.startX -= this.parent.cropObj.totalPannedPoint.x;
            this.currDestPoint.startY -= this.parent.cropObj.totalPannedPoint.y;
            break;
        case 'setReverseRotate':
            this.isReverseRotate = args.value['bool'];
            break;
        case 'getFlipColl':
            args.value['obj']['flipColl'] = this.flipColl;
            break;
        case 'setFlipColl':
            this.flipColl = args.value['flipColl'];
            break;
        case 'getPreviousZoomValue':
            args.value['obj']['previousZoomValue'] = this.prevZoomValue;
            break;
        case 'setPreviousZoomValue':
            this.prevZoomValue = args.value['previousZoomValue'];
            break;
        case 'getCropDimension':
            args.value['obj']['cropDimension'] = this.cropDimension;
            break;
        case 'setCropDimension':
            this.cropDimension.width = args.value['width']; this.cropDimension.height = args.value['height'];
            break;
        case 'getPreventSelect':
            args.value['obj']['bool'] = this.isPreventSelect;
            break;
        case 'setPreventSelect':
            this.isPreventSelect = args.value['bool'];
            break;
        case 'resizeImage':
            this.resizeImage(args.value['width'], args.value['height']);
            break;
        case 'resizeCrop':
            this.resizeCrop(args.value['width'], args.value['height']);
            break;
        case 'setPreventDownScale':
            this.preventDownScale = args.value['bool'];
            break;
        case 'updateResize':
            this.updateResize();
            break;
        case 'resize':
            this.resize(args.value['width'], args.value['height'], args.value['isAspectRatio']);
            break;
        case 'straightenImage':
            this.straightenImage(args.value['degree']);
            break;
        case 'reset':
            this.reset();
            break;
        case 'cropZoom':
            args.value['obj']['maxDimension'] = this.cropZoom(args.value['value'], args.value['selectionObj']);
            break;
        case 'setResizedImgAngle':
            this.resizedImgAngle = args.value['angle'];
            break;
        }
    }

    public getModuleName(): string {
        return 'transform';
    }

    private initTransformPvtVar(): void {
        if (this.parent.lowerCanvas) {this.lowerContext = this.parent.lowerCanvas.getContext('2d'); }
        if (this.parent.upperCanvas) {this.upperContext = this.parent.upperCanvas.getContext('2d'); }
    }

    private reset(): void {
        this.zoomBtnHold = null; this.tempPanMove = null; this.panMove = null; this.disablePan = false;
        this.currDestPoint = null; this.isReverseRotate = false; this.flipColl = []; this.resizedImgAngle = null;
        this.transCurrObj = null; this.prevZoomValue = 1; this.isPreventSelect = this.preventDownScale = false;
    }

    private rotateImage(degree: number): void {
        const parent: ImageEditor = this.parent;
        const transitionArgs: RotateEventArgs = {cancel: false, previousDegree: parent.transform.degree,
            currentDegree: Math.abs(parent.transform.degree + degree) === 360 ? 0 : parent.transform.degree + degree };
        if (!this.isPreventSelect && isBlazor() && parent.events && parent.events.rotating.hasDelegate === true) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('RotateEventAsync', 'OnRotate', transitionArgs, null) as any).then((args: RotateEventArgs) => {
                this.rotateEvent(args, degree);
            });
        } else {
            if (!this.isPreventSelect) {parent.trigger('rotating', transitionArgs); }
            this.rotateEvent(transitionArgs, degree);
        }
    }

    private rotateEvent(transitionArgs: RotateEventArgs, degree: number): void {
        const parent: ImageEditor = this.parent;
        if (!transitionArgs.cancel) {
            let prevObj: CurrentObject;
            if (isNullOrUndefined(this.transCurrObj)) {
                const object: Object = {currObj: {} as CurrentObject };
                parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                prevObj = object['currObj'];
                prevObj.objColl = extend([], parent.objColl, null, true) as SelectionPoint[];
                prevObj.pointColl = extend({}, parent.pointColl, null, true) as Point[];
                prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
                const selPointCollObj: Object = {selPointColl: null };
                parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false, value: {obj: selPointCollObj }});
                prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
            }
            parent.afterCropActions.push(degree === 90 ? 'rotateRight' : 'rotateLeft');
            let splitWords: string[] = []; let activeObjShape: string;
            if (parent.activeObj.activePoint && parent.activeObj.shape) {
                if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
                if (parent.currObjType.isCustomCrop || splitWords[0] === 'crop') {
                    activeObjShape = parent.currObjType.isCustomCrop ? 'custom' : splitWords[1];
                    parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
                    parent.objColl.push(parent.activeObj);
                    parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                }
            }
            parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: {x: null, y: null, isMouseDown: true}});
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            this.drawRotatedImage(degree);
            parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
            if (parent.isCircleCrop) {
                parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                    value: {context: this.lowerContext, isSave: null, isFlip: null}});
            }
            if (activeObjShape) {
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                parent.activeObj = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
                parent.objColl.pop();
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj}});
            }
            parent.isUndoRedo = false; const obj: Object = {collection: parent.rotateFlipColl};
            parent.notify('shape', { prop: 'alignRotateFlipColl', onPropertyChange: false,
                value: {collection: parent.rotateFlipColl, isRotateFlipCollection: true, obj: obj }});
            parent.rotateFlipColl = obj['collection'];
            if (parent.cropObj.activeObj.shape && !this.isPreventSelect) {
                parent.notify('draw', { prop: 'setIsCropSelect', value: {bool: true }});
                this.isPreventSelect = true;
                parent.notify('draw', { prop: 'select', onPropertyChange: false,
                    value: {type: 'custom', startX: null, startY: null, width: null, height: null }});
                this.isPreventSelect = false;
                parent.setProperties({zoomSettings: { zoomFactor: 1 }}, true);
                this.prevZoomValue = parent.zoomSettings.zoomFactor;
            }
            transitionArgs = { previousDegree: transitionArgs.previousDegree, currentDegree: transitionArgs.currentDegree };
            if (!this.isPreventSelect && isBlazor() && parent.events && parent.events.rotated.hasDelegate === true) {
                const rotatedArgs: object = { degree: transitionArgs.currentDegree };
                parent.dotNetRef.invokeMethodAsync('RotateEventAsync', 'Rotated', null, rotatedArgs);
            } else if (!this.isPreventSelect) {}
            if (isBlazor() && parent.events && parent.events.rotating.hasDelegate === true) {
                parent.notify('draw', { prop: 'resetStraightenDestPoints' });
                parent.notify('draw', { prop: 'setDestForStraighten' });
            }
        } else {
            parent.notify('draw', { prop: 'setCurrentObj', onPropertyChange: false, value: {obj: parent.prevEventObjPoint}});
            parent.activeObj = parent.prevEventSelectionPoint;
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj}});
        }
    }

    private drawRotatedImage(degree: number): void {
        const parent: ImageEditor = this.parent;
        if (degree === 0) {parent.transform.degree = 0; }
        else {parent.transform.degree += degree; }
        if (Math.abs(parent.transform.degree) === 360) {parent.transform.degree = 0; }
        parent.notify('draw', { prop: 'setDestPoints', onPropertyChange: false});
        const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        parent.objColl = [];
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        if (!this.isReverseRotate) {
            parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
                value: {type: 'initial', isPreventDestination: null, isRotatePan: null} });
        }
        this.rotateDegree(degree);
        if (!this.isReverseRotate) {
            parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
                value: {type: 'reverse', isPreventDestination: null, isRotatePan: null} });
            parent.rotateFlipColl.push(degree as number);
        }
        parent.objColl = extend([], tempObjColl, [], true) as SelectionPoint[];
        parent.activeObj = extend({}, tempActiveObj, {}, true) as SelectionPoint;
        if (parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
        }
        parent.notify('shape', { prop: 'redrawObj', onPropertyChange: false, value: {degree: degree}});
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        if (degree > 0) {parent.notify('freehand-draw', { prop: 'rotateFhdColl', onPropertyChange: false}); }
        else {
            for (let i: number = 0; i < 3; i++) {
                parent.notify('freehand-draw', { prop: 'rotateFhdColl', onPropertyChange: false});
            }
        }
        parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
            value: {context: this.lowerContext, points: null} });
        this.updateCurrSelectionPoint(degree);
    }

    private rotateDegree(degree: number): void {
        const parent: ImageEditor = this.parent;
        this.lowerContext.save();
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        this.lowerContext.translate(parent.lowerCanvas.width / 2, parent.lowerCanvas.height / 2);
        this.lowerContext.rotate(Math.PI / 180 * degree);
        this.lowerContext.translate(-parent.lowerCanvas.width / 2, -parent.lowerCanvas.height / 2);
        const temp: string = this.lowerContext.filter;
        parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
        this.lowerContext.filter = temp;
        this.lowerContext.translate(parent.lowerCanvas.width / 2, parent.lowerCanvas.height / 2);
        this.lowerContext.rotate(Math.PI / 180 * -degree);
        this.lowerContext.translate(-parent.lowerCanvas.width / 2, -parent.lowerCanvas.height / 2);
        this.lowerContext.restore();
    }

    private updateCurrSelectionPoint(degree: number | string): void {
        const parent: ImageEditor = this.parent;
        if (parent.currSelectionPoint && this.currDestPoint) {
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
            const srcPoints: ActivePoint = {startX: parent.img.srcLeft, startY: parent.img.srcTop, width: parent.img.srcWidth,
                height: parent.img.srcHeight};
            const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                height: parent.img.destHeight};
            parent.objColl = [];
            parent.objColl.push(extend({}, parent.currSelectionPoint, {}, true) as SelectionPoint);
            if (isNullOrUndefined(parent.objColl[0].imageRatio)) {
                parent.activeObj = parent.objColl[0];
                parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
                parent.objColl[0] = parent.activeObj;
            }
            parent.img = {srcLeft: 0, srcTop: 0, srcWidth: parent.baseImgCanvas.width, srcHeight: parent.baseImgCanvas.height,
                destLeft: this.currDestPoint.startX, destTop: this.currDestPoint.startY, destWidth: this.currDestPoint.width,
                destHeight: this.currDestPoint.height};
            if (typeof(degree) === 'number') {
                parent.notify('draw', { prop: 'setDestPoints', onPropertyChange: false});
                parent.notify('draw', { prop: 'setClientTransDim', onPropertyChange: false,
                    value: {isPreventDimension: null}});
            }
            parent.notify('shape', { prop: 'redrawObj', onPropertyChange: false, value: {degree: degree}});
            parent.currSelectionPoint = extend({}, parent.objColl[0], {}, true) as SelectionPoint;
            this.currDestPoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                height: parent.img.destHeight};
            parent.objColl = objColl; parent.activeObj = activeObj;
            parent.img = {srcLeft: srcPoints.startX, srcTop: srcPoints.startY, srcWidth: srcPoints.width, srcHeight: srcPoints.height,
                destLeft: destPoints.startX, destTop: destPoints.startY, destWidth: destPoints.width, destHeight: destPoints.height};
        }
    }

    private flipImage(direction: Direction): void {
        const parent: ImageEditor = this.parent;
        const transitionArgs: FlipEventArgs = {direction: direction, cancel: false,
            previousDirection: parent.toPascalCase(parent.transform.currFlipState || direction )};
        if (!this.isPreventSelect && isBlazor() && parent.events && parent.events.flipping.hasDelegate === true) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('FlipEventAsync', 'OnFlip', transitionArgs, null) as any).then((args: FlipEventArgs) => {
                this.flipEvent(args, direction);
            });
        } else {
            if (!this.isPreventSelect) {parent.trigger('flipping', transitionArgs); }
            this.flipEvent(transitionArgs, direction);
        }
    }

    private flipEvent(transitionArgs: FlipEventArgs, direction: Direction): void {
        const parent: ImageEditor = this.parent;
        if (transitionArgs.cancel) { 
            parent.notify('draw', { prop: 'setCurrentObj', onPropertyChange: false, value: {obj: parent.prevEventObjPoint}});
            parent.activeObj = parent.prevEventSelectionPoint;
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj}});
            return; 
        }
        let prevObj: CurrentObject;
        if (isNullOrUndefined(this.transCurrObj)) {
            const object: Object = {currObj: {} as CurrentObject };
            parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
            prevObj = object['currObj'];
            prevObj.objColl = extend([], parent.objColl, null, true) as SelectionPoint[];
            prevObj.pointColl = extend({}, parent.pointColl, null, true) as Point[];
            prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
            const selPointCollObj: Object = {selPointColl: null };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                value: {obj: selPointCollObj }});
            prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        }
        parent.afterCropActions.push(direction.toLowerCase() === 'horizontal' ? 'horizontalflip' : 'verticalflip');
        let splitWords: string[] = []; let activeObjShape: string;
        if (parent.activeObj.activePoint) {
            if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
            if (parent.currObjType.isCustomCrop || splitWords[0] === 'crop') {
                activeObjShape = parent.currObjType.isCustomCrop ? 'custom' : splitWords[1];
                parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
                parent.objColl.push(parent.activeObj);
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            }
        }
        parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
            value: {x: null, y: null, isMouseDown: true}});
        parent.clearContext(this.lowerContext); parent.clearContext(this.upperContext);
        const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        parent.objColl = [];
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        if (!this.isReverseFlip) {
            parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
                value: {type: 'initial', isPreventDestination: null, isRotatePan: null} });
        }
        const lowercaseDirection: string = direction.toLowerCase();
        this.updateFlipState(lowercaseDirection);
        const flipState: string = parent.transform.currFlipState.toLowerCase();
        parent.transform.currFlipState = (lowercaseDirection === 'horizontal' && flipState === 'horizontal') ||
                                 (lowercaseDirection === 'vertical' && flipState === 'vertical') ? '' : lowercaseDirection;
        const selObj: Object = {isSelected: null };
        parent.notify('draw', { prop: 'getRotatedFlipCropSelection', onPropertyChange: false, value: {bool: selObj }});
        if (selObj['isSelected']) {
            parent.img.destLeft += parent.panPoint.totalPannedInternalPoint.x;
            parent.img.destTop += parent.panPoint.totalPannedInternalPoint.y;
        }
        const temp: string = this.lowerContext.filter;
        parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
        this.lowerContext.filter = temp;
        parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
        this.updateFlipState(direction.toLowerCase());
        if (!this.isReverseFlip) {
            parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
                value: {type: 'reverse', isPreventDestination: null, isRotatePan: null} });
            this.updateFlipColl(direction.toLocaleLowerCase());
            parent.rotateFlipColl.push(direction.toLowerCase());
        }
        if (parent.rotateFlipColl.length === 1) {
            const panObj: Object = {panRegion: '' };
            parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false,
                value: {panObj: panObj }});
            if (panObj['panRegion'] === '') {
                parent.notify('draw', { prop: 'setClientTransDim', onPropertyChange: false,
                    value: {isPreventDimension: null}});
            } else {
                this.setDestPointsForFlipState();
            }
        }
        if (parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
        }
        parent.objColl = extend([], tempObjColl, [], true) as SelectionPoint[];
        parent.activeObj = extend({}, tempActiveObj, {}, true) as SelectionPoint;
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            const flipObjColl: string[] = parent.objColl[i as number].flipObjColl;
            if (flipObjColl.length === 0) {
                flipObjColl.push(direction);
            } else if (flipObjColl[flipObjColl.length - 1] === direction) {
                flipObjColl.pop();
            } else {
                flipObjColl.push(direction);
            }
        }
        parent.notify('shape', { prop: 'redrawObj', onPropertyChange: false, value: {degree: direction.toLowerCase()}});
        const tempFilter: string = this.lowerContext.filter;
        this.lowerContext.filter = 'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
            'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
        parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
        const dir: string = direction.toLowerCase();
        if (dir === 'horizontal' || dir === 'vertical') {
            parent.notify('freehand-draw', { prop: 'flipFHDColl', onPropertyChange: false,
                value: {value: dir}});
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
        } else {
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
        }
        this.lowerContext.filter = tempFilter;
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        this.updateCurrSelectionPoint(dir);
        parent.isUndoRedo = false;
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
        if (parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
        }
        if (activeObjShape) {
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            parent.activeObj = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
            parent.objColl.pop();
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj}});
        }
        const obj: Object = {collection: parent.rotateFlipColl};
        parent.notify('shape', { prop: 'alignRotateFlipColl', onPropertyChange: false,
            value: {collection: parent.rotateFlipColl, isRotateFlipCollection: true, obj: obj }});
        parent.rotateFlipColl = obj['collection'];
        if (parent.cropObj.activeObj.shape && !this.isPreventSelect) {
            parent.notify('draw', { prop: 'setIsCropSelect', value: {bool: true }});
            this.isPreventSelect = true;
            parent.notify('draw', { prop: 'select', onPropertyChange: false,
                value: {type: 'custom', startX: null, startY: null, width: null, height: null }});
            this.isPreventSelect = false;
            parent.setProperties({zoomSettings: { zoomFactor: 1 }}, true);
            this.prevZoomValue = parent.zoomSettings.zoomFactor;
        }
        transitionArgs = { previousDirection: transitionArgs.previousDirection, direction: transitionArgs.direction };
        if (!this.isPreventSelect && isBlazor() && parent.events && parent.events.flipped.hasDelegate === true) {
            const flipped: object = { direction: transitionArgs.direction };
            parent.dotNetRef.invokeMethodAsync('FlipEventAsync', 'Flipped', null, flipped);
        } else {}
    }

    private updateFlipState(direction: string): void {
        const degree: number = this.parent.transform.degree;
        if (direction === 'horizontal') {
            if (degree % 90 === 0 && degree % 180 !== 0) {
                this.verticalFlip();
            } else {
                this.horizontalFlip();
            }
        } else if (direction === 'vertical') {
            if (degree % 90 === 0 && degree % 180 !== 0) {
                this.horizontalFlip();
            } else {
                this.verticalFlip();
            }
        }
    }

    private horizontalFlip(): void {
        this.lowerContext.translate(this.lowerContext.canvas.width, 0);
        this.lowerContext.scale(-1, 1);
        this.upperContext.translate(this.upperContext.canvas.width, 0);
        this.upperContext.scale(-1, 1);
    }

    private verticalFlip(): void {
        this.lowerContext.translate(0, this.lowerContext.canvas.height);
        this.lowerContext.scale(1, -1);
        this.upperContext.translate(0, this.upperContext.canvas.height);
        this.upperContext.scale(1, -1);
    }

    private updateFlipColl(direction: string): void {
        if (this.isPreventSelect) {
            return;
        }
        if (this.flipColl.length === 0 || this.flipColl[this.flipColl.length - 1] !== direction) {
            this.flipColl.push(direction);
        } else {
            this.flipColl.pop();
        }
        if (this.flipColl.length >= 4) {
            const lastFourItems: string[] = this.flipColl.slice(-4);
            if (
                (lastFourItems[0] === 'horizontal' && lastFourItems[1] === 'vertical' &&
                lastFourItems[2] === 'horizontal' && lastFourItems[3] === 'vertical') ||
                (lastFourItems[0] === 'vertical' && lastFourItems[1] === 'horizontal' &&
                lastFourItems[2] === 'vertical' && lastFourItems[3] === 'horizontal')
            ) {
                this.flipColl.splice(-4);
            }
        }
    }

    private setDestPointsForFlipState(): void {
        const parent: ImageEditor = this.parent; const panObj: Object = {panRegion: '' };
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        const { clientWidth, clientHeight } = parent.lowerCanvas;
        parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false,
            value: {panObj: panObj }});
        if (panObj['panRegion'] !== '') {
            if (panObj['panRegion'] === 'horizontal') {
                parent.img.destLeft = clientWidth - (destWidth + destLeft);
            } else if (panObj['panRegion'] === 'vertical') {
                parent.img.destTop = clientHeight - (destHeight + destTop);
            } else {
                parent.img.destLeft = clientWidth - (destWidth + destLeft);
                parent.img.destTop = clientHeight - (destHeight + destTop);
            }
        }
    }

    private zoomAction(zoomFactor: number, zoomPoint?: Point, isResize?: boolean, isPreventApply?: boolean): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            if (isNullOrUndefined(isResize) && (parent.zoomSettings.zoomFactor >= parent.zoomSettings.maxZoomFactor && zoomFactor > 0 ||
                (parent.zoomSettings.zoomFactor > parent.zoomSettings.minZoomFactor && zoomFactor < 0 && this.disableZoomOutBtn(true)) ||
                (parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor && zoomFactor < 0))) {
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'zoom-up-handler', onPropertyChange: false});
                }
                return;
            }
            parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
            const tempZoomFactor: number = zoomFactor;
            zoomFactor = tempZoomFactor > 0 ? 0.1 : -0.1;
            for (let i: number = 0; i < Math.round(Math.abs(tempZoomFactor / 0.1)); i++) {
                if (this.prevZoomValue === 1) {
                    this.prevZoomValue += zoomFactor > 0 ? zoomFactor * 10 : (zoomFactor * 10) / 10;
                } else if (this.prevZoomValue > 1) {
                    this.prevZoomValue += (zoomFactor * 10);
                } else if (this.prevZoomValue < 1) {
                    this.prevZoomValue += (zoomFactor * 10) / 10;
                    const powerOften: number = Math.pow(10, 1);
                    this.prevZoomValue = (Math.round(this.prevZoomValue * powerOften ) / powerOften);
                }
            }
            zoomFactor = tempZoomFactor;
            parent.setProperties({zoomSettings: { zoomFactor: this.prevZoomValue}}, true);
            let splitWords: string[]; this.tempActiveObj = null; this.isShape = false;
            if (parent.activeObj.shape !== undefined) {
                if (parent.activeObj.shape === 'shape') {
                    parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                }
                else {splitWords = parent.activeObj.shape.split('-'); }
            }
            if (splitWords !== undefined && splitWords[0] === 'crop') {
                this.tempActiveObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                parent.isCropTab = true;
            } else if (parent.activeObj.shape && splitWords[0] !== 'crop') {
                this.isShape = true;
            }
            const obj: Object = {zoomType: null };
            parent.notify('selection', { prop: 'getZoomType', onPropertyChange: false, value: {obj: obj }});
            if (isNullOrUndefined(zoomPoint)) {
                if (parent.isCropTab && this.tempActiveObj) {
                    zoomPoint = {x: parent.activeObj.activePoint.startX + (parent.activeObj.activePoint.width / 2),
                        y: parent.activeObj.activePoint.startY + (parent.activeObj.activePoint.height / 2) };
                } else {
                    zoomPoint = {x: parent.lowerCanvas.clientWidth / 2, y: parent.lowerCanvas.clientHeight / 2 };
                }
                if (obj['zoomType'] === 'MouseWheel' || obj['zoomType'] === 'Pinch') {
                    zoomPoint = {x: parent.zoomSettings.zoomPoint.x, y: parent.zoomSettings.zoomPoint.y};
                }
            }
            const previousZoomFactor: number = parent.zoomSettings.zoomFactor - (zoomFactor * 10);
            const zoomEventArgs: ZoomEventArgs = {zoomPoint: zoomPoint, cancel: false, previousZoomFactor: previousZoomFactor,
                currentZoomFactor: parent.zoomSettings.zoomFactor, zoomTrigger: obj['zoomType']};
            if (!parent.isCropToolbar && isBlazor() && parent.isZoomBtnClick && parent.events && parent.events.zooming.hasDelegate === true) {
                (zoomEventArgs as any).zoomTrigger = parseInt(this.getZoomTriggerType(zoomEventArgs.zoomTrigger));
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                (parent.dotNetRef.invokeMethodAsync('ZoomEventAsync', 'OnZoom', zoomEventArgs, null) as any).then((args: ZoomEventArgs) => {
                    this.zoomEvent(args, zoomFactor, isPreventApply);
                });
            } else {
                if (!parent.isCropToolbar && parent.isZoomBtnClick) {parent.trigger('zooming', zoomEventArgs); }
                this.zoomEvent(zoomEventArgs, zoomFactor, isPreventApply);
            }
        }
    }

    private getZoomTriggerType(type: string): string {
        switch(type) {
            case 'MouseWheel':
                return '1';
            case 'Pinch':
                return '2';
            case 'Commands':
                return '4';
            default:
                return '8';
        }
    }

    private zoomEvent(zoomEventArgs: ZoomEventArgs, zoomFact: number, isPreventApply?: boolean): void {
        const parent: ImageEditor = this.parent;
        const { zoomFactor, minZoomFactor } = parent.zoomSettings;
        if (zoomEventArgs.cancel) { parent.isZoomBtnClick=false; return; }
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'close-contextual-toolbar', onPropertyChange: false});
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        } else if (((parent as any).currentToolbar !== 'resize-toolbar' && (parent as any).currentToolbar !== 'crop-toolbar') && parent.element.querySelector('.e-contextual-toolbar-wrapper') && !parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.contains('e-hidden') ) {
            parent.updateToolbar(parent.element, 'closeContextualToolbar');
        }
        parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
            value: {x: null, y: null, isMouseDown: true}});
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        this.upperContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        const object: Object = {canvasFilter: parent.canvasFilter };
        this.lowerContext.filter = object['canvasFilter'];
        parent.upperCanvas.style.cursor = parent.cursor = 'default';
        let objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        if (!parent.isCropTab) {
            if (parent.transform.degree !== 0) {
                parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false, value: {x: null, y: null, isMouseDown: null}});
                parent.panPoint.currentPannedPoint = {x: 0, y: 0};
                const temp: boolean = parent.allowDownScale;
                parent.allowDownScale = false;
                this.rotatePan(true, true);
                parent.allowDownScale = temp;
            } else if (parent.transform.currFlipState !== '') {
                parent.panPoint.totalPannedPoint = {x: 0, y: 0};
            }
            if (parent.transform.straighten === 0 && !this.isPreventSelect) {
                parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false, value: {isPreventApply: isPreventApply }});
            }
        }
        if (parent.transform.degree === 0) {
            this.drawZoomImgToCanvas(zoomFact, this.tempActiveObj);
            const panObj: Object = {panRegion: '' };
            parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false, value: {panObj: panObj }});
            if (panObj['panRegion'] !== '') {
                parent.notify('crop', { prop: 'setTempFlipPanPoint', onPropertyChange: false, value: {point: parent.panPoint.totalPannedPoint, isAdd: true }});
                objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
                parent.objColl = [];
                const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
                this.setDestPointsForFlipState();
                this.rotatedFlip();
                parent.img.destLeft = destLeft; parent.img.destTop = destTop;
                parent.objColl = objColl;
                parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: isPreventApply}});
                parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: isPreventApply}});
                if (parent.transform.straighten === 0 && !this.isPreventSelect) {
                    parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false, value: {isPreventApply: isPreventApply }});
                }
            }
            if (zoomFactor <= minZoomFactor && !parent.isCropTab) {
                parent.panPoint.totalPannedPoint = { x: 0, y: 0 };
            }
        } else {
            if (parent.transform.straighten === 0 && !this.isPreventSelect) {
                parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false, value: {isPreventApply: isPreventApply }});
            }
            parent.panPoint.totalPannedClientPoint = { x: 0, y: 0 };
            parent.panPoint.totalPannedInternalPoint = { x: 0, y: 0 };
            this.rotateZoom(zoomFact);
            const panObj: Object = {panRegion: '' };
            parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false, value: {panObj: panObj }});
            if (panObj['panRegion'] !== '') {
                const temp: string = this.lowerContext.filter;
                this.lowerContext.filter = 'none';
                parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: isPreventApply}});
                parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: isPreventApply}});
                this.lowerContext.filter = temp;
            }
        }
        const powerOften: number = Math.pow(10, 1);
        if (zoomFactor <= minZoomFactor ||
            (Math.round(parent.transform.zoomFactor * powerOften ) / powerOften) === 2) {
            clearInterval(this.zoomBtnHold); this.zoomBtnHold = 0;
        }
        const panObj: Object = {panRegion: '' };
        parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false, value: {panObj: panObj }});
        if (panObj['panRegion'] === '') {
            const temp: string = this.lowerContext.filter;
            this.lowerContext.filter = 'none';
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: isPreventApply}});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: { isPreventApply: isPreventApply } });
            this.lowerContext.filter = temp;
        }
        if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
        }
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        if (this.tempActiveObj) {
            parent.activeObj = extend({}, this.tempActiveObj, {}, true) as SelectionPoint;
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj}});
            if (zoomFactor <= minZoomFactor) {parent.currSelectionPoint = null; }
        }
        parent.isUndoRedo = false;
        let zoomOut: HTMLElement;
        if (!isBlazor()) {
            zoomOut = document.querySelector('#' + parent.element.id + '_zoomOut');
            if (zoomOut && zoomFactor <= minZoomFactor) {
                zoomOut.classList.add('e-disabled');
                zoomOut.parentElement.classList.add('e-overlay');
            } else if (zoomOut) {
                zoomOut.classList.remove('e-disabled');
                zoomOut.parentElement.classList.remove('e-overlay');
            }
        } else {
            zoomOut = parent.element.querySelector('#zoomout');
            if (zoomOut && zoomFactor <= minZoomFactor) {
                zoomOut.classList.add('e-overlay');
            } else if (zoomOut) {
                zoomOut.classList.remove('e-overlay');
            }
        }
        this.autoEnablePan();
        if (this.tempActiveObj) {
            parent.activeObj = extend({}, this.tempActiveObj, {}, true) as SelectionPoint;
        }
        if (parent.activeObj.shape === 'crop-custom') {parent.currObjType.isCustomCrop = true; }
        const panBtn: HTMLElement = parent.element.querySelector('.e-img-pan .e-btn');
        if (panBtn && parent.togglePan) {
            panBtn.classList.add('e-selected-btn');
        } else if (panBtn) {
            panBtn.classList.remove('e-selected-btn');
        }
        if (this.isShape) {
            parent.activeObj = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
            parent.objColl.pop();
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj, isCropRatio: null,
                points: null, isPreventDrag: true, saveContext: null, isPreventSelection: null} });
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
                parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
            }
        }
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'enable-disable-btns', onPropertyChange: false});
        } else {
            parent.updateToolbar(parent.element, 'enableDisableToolbarBtn');
        }
        parent.notify('selection', { prop: 'setZoomType', onPropertyChange: false, value: {zoomType: 'Toolbar' }});
        zoomEventArgs = { zoomPoint: zoomEventArgs.zoomPoint, previousZoomFactor: zoomEventArgs.previousZoomFactor, currentZoomFactor: zoomEventArgs.currentZoomFactor, zoomTrigger: zoomEventArgs.zoomTrigger};
        if (isBlazor() && !parent.isCropToolbar && parent.isZoomBtnClick && parent.events && parent.events.zoomed.hasDelegate === true) {
            (zoomEventArgs as any).zoomTrigger = typeof zoomEventArgs.zoomTrigger !== 'number' ? parseInt(this.getZoomTriggerType(zoomEventArgs.zoomTrigger)): zoomEventArgs.zoomTrigger;
            const zoomedArgs: object = { zoomPoint: zoomEventArgs.zoomPoint, zoomFactor: zoomEventArgs.currentZoomFactor, zoomTrigger: zoomEventArgs.zoomTrigger };
            parent.dotNetRef.invokeMethodAsync('ZoomEventAsync', 'Zoomed', null, zoomedArgs);
            parent.isZoomBtnClick = false;
        } else if (!parent.isCropToolbar && parent.isZoomBtnClick) {
            parent.isZoomBtnClick = false;
        }
    }

    private disableZoomOutBtn(isZoomOut?: boolean): boolean {
        const parent: ImageEditor = this.parent; const { zoomFactor, minZoomFactor } = parent.zoomSettings;
        let isDisabled: boolean = false;
        let zoomOut: HTMLElement;
        if (!isNullOrUndefined(isZoomOut)) {
            parent.transform.zoomFactor -= 0.1;
        }
        if (isBlazor()) {
            zoomOut = parent.element.querySelector('#zoomout');
        } else {
            zoomOut = parent.element.querySelector('#' + parent.element.id + '_zoomOut');
        }
        const destPoints: Object = {destLeft: parent.img.destLeft, destTop: parent.img.destTop,
            destWidth: parent.img.destWidth, destHeight: parent.img.destHeight };
        if (parent.activeObj.shape) {
            const maxDimension: Dimension = this.setZoomDimension(-0.1, parent.activeObj);
            if (!isNullOrUndefined(zoomOut)) {
                const actPoint: ActivePoint = parent.activeObj.activePoint;
                if (parent.transform.straighten === 0) {
                    if (parent.img.destLeft > actPoint.startX || parent.img.destTop >
                        actPoint.startY || parent.img.destLeft + parent.img.destWidth <
                        actPoint.endX || parent.img.destTop + parent.img.destHeight < actPoint.endY
                        || zoomFactor === minZoomFactor) {
                        if (!isBlazor()) {
                            zoomOut.classList.add('e-disabled');
                            zoomOut.parentElement.classList.add('e-overlay');
                        } else {
                            zoomOut.classList.add('e-overlay');
                        }
                        isDisabled = true;
                    } else {
                        if (!isBlazor()) {
                            zoomOut.classList.remove('e-disabled');
                            zoomOut.parentElement.classList.remove('e-overlay');
                        } else {
                            zoomOut.classList.remove('e-overlay');
                        }
                        isDisabled = false;
                    }
                } else {
                    parent.img.destWidth = maxDimension.width; parent.img.destHeight = maxDimension.height;
                    const obj: Object = {isIntersect: null };
                    parent.notify('draw', { prop: 'updateImgCanvasPoints', onPropertyChange: false });
                    parent.notify('draw', { prop: 'isLinesIntersect', onPropertyChange: false, value: {obj: obj }});
                    if (obj['isIntersect'] ||
                        zoomFactor === minZoomFactor) {
                        if (!isBlazor()) {
                            zoomOut.classList.add('e-disabled');
                            zoomOut.parentElement.classList.add('e-overlay');
                        } else {
                            zoomOut.classList.add('e-overlay');
                        }
                        isDisabled = true;
                    } else {
                        if (!isBlazor()) {
                            zoomOut.classList.remove('e-disabled');
                            zoomOut.parentElement.classList.remove('e-overlay');
                        } else {
                            zoomOut.classList.remove('e-overlay');
                        }
                        isDisabled = false;
                    }
                }
            }
        } else {
            this.setZoomDimension(-0.1, null);
        }
        if (!isNullOrUndefined(isZoomOut)) {
            parent.transform.zoomFactor += 0.1;
        }
        parent.img.destLeft = destPoints['destLeft']; parent.img.destTop = destPoints['destTop'];
        parent.img.destWidth = destPoints['destWidth']; parent.img.destHeight = destPoints['destHeight'];
        return isDisabled;
    }

    private drawZoomImgToCanvas(value: number, selectionObj?: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        const powerOften: number = Math.pow(10, 1);
        const zmFactor: number = Math.round(parent.transform.zoomFactor * powerOften ) / powerOften;
        if ((zmFactor === 0.1 && value === -0.1) || zmFactor === 0 && value === -0.025) {
            parent.transform.zoomFactor = 0;
        } else {parent.transform.zoomFactor += value; }
        parent.transform[parent.isCropTab ? 'cropZoomFactor' : 'defaultZoomFactor'] = parent.transform.zoomFactor;
        let maxDimension: Dimension = {width: 0, height: 0};
        if (parent.isCropTab) {
            maxDimension = this.cropZoom(value, selectionObj);
        } else {
            maxDimension = this.calcMaxDimension(parent.img.srcWidth, parent.img.srcHeight);
            maxDimension.width += (maxDimension.width * parent.transform.zoomFactor);
            maxDimension.height += (maxDimension.height * parent.transform.zoomFactor);
            parent.img.destLeft = (parent.lowerCanvas.clientWidth - maxDimension.width) / 2;
            parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.height + 1) / 2;
        }
        parent.notify('draw', {prop: 'draw-image-to-canvas', value: {dimension: maxDimension } });
        maxDimension.width = this.cropDimension.width; maxDimension.height = this.cropDimension.height;
        maxDimension.width += (maxDimension.width * parent.transform.zoomFactor);
        maxDimension.height += (maxDimension.height * parent.transform.zoomFactor);
        parent.notify('draw', {prop: 'setZoomCropWidth', value: {width: maxDimension.width, height: maxDimension.height }});
    }

    private rotatedFlip(): void {
        const parent: ImageEditor = this.parent;
        this.isReverseFlip = true;
        let tempCurrFlipState: string = parent.transform.currFlipState;
        const tempFlipColl: string[] = this.flipColl;
        const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        this.flipColl = []; parent.objColl = [];
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        parent.notify('draw', { prop: 'currTransState', onPropertyChange: false,
            value: {type: 'initial', isPreventDestination: null, context: null, isPreventCircleCrop: null} });
        const temp: string = this.lowerContext.filter;
        parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
        this.lowerContext.filter = temp;
        parent.notify('draw', { prop: 'currTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: true, context: null, isPreventCircleCrop: null} });
        if (tempCurrFlipState === '' && parent.transform.currFlipState !== '') {
            tempCurrFlipState = parent.transform.currFlipState;
        }
        parent.transform.currFlipState = tempCurrFlipState;
        this.flipColl = tempFlipColl;
        parent.objColl = extend([], tempObjColl, [], true) as SelectionPoint[];
        this.lowerContext.filter = 'none';
        parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
        this.lowerContext.filter = temp;
        if (tempActiveObj.activePoint.width !== 0) {
            parent.activeObj = extend({}, tempActiveObj, {}, true) as SelectionPoint;
        }
        this.isReverseFlip = false;
    }

    private rotateZoom(value: number): void {
        const parent: ImageEditor = this.parent;
        const powerOften: number = Math.pow(10, 1);
        const zmFactor: number = Math.round(parent.transform.zoomFactor * powerOften ) / powerOften;
        if ((zmFactor === 0.1 && value === -0.1) || zmFactor === 0 && value === -0.025) {
            parent.transform.zoomFactor = 0;
        } else {parent.transform.zoomFactor += value; }
        if (parent.isCropTab) {
            parent.transform.cropZoomFactor = parent.transform.zoomFactor;
        } else {
            parent.transform.defaultZoomFactor = parent.transform.zoomFactor;
        }
        const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        parent.objColl = [];
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'initial', isPreventDestination: null, isRotatePan: null} });
        parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: true }});
        parent.notify('draw', { prop: 'setDestPoints', onPropertyChange: false});
        const temp: string = this.lowerContext.filter;
        parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
        this.lowerContext.filter = temp;
        parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: false }});
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: null, isRotatePan: null} });
        parent.objColl = tempObjColl;
        parent.activeObj = tempActiveObj;
        const maxDimension: Dimension = {width: this.cropDimension.width, height: this.cropDimension.height };
        maxDimension.width += (maxDimension.width * parent.transform.zoomFactor);
        maxDimension.height += (maxDimension.height * parent.transform.zoomFactor);
        parent.notify('draw', {prop: 'setZoomCropWidth', value: {width: maxDimension.width, height: maxDimension.height }});
    }

    private autoEnablePan(): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.zoomFactor <= 0) {
            parent.togglePan = false;
            parent.notify('selection', {prop: 'setDragCanvas', value: {bool: false }});
            parent.pan(false); this.disablePan = false;
        } else {
            parent.pan(!this.disablePan);
        }
    }

    private cropZoom(value: number, selectionObj?: SelectionPoint): Dimension {
        const parent: ImageEditor = this.parent;
        let destLeft: number = parent.img.destLeft; let destTop: number = parent.img.destTop;
        let maxDimension: Dimension = {width: 0, height: 0};
        if (parent.img.srcLeft === 0 || parent.img.srcTop === 0) {
            if (isNullOrUndefined(selectionObj)) {
                maxDimension = this.setZoomDimension(value, null);
            } else {
                maxDimension = this.setZoomDimension(value, selectionObj);
            }
        } else {
            if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
                maxDimension = this.calcMaxDimension(parent.img.srcHeight, parent.img.srcWidth);
            } else {
                maxDimension = this.calcMaxDimension(parent.img.srcWidth, parent.img.srcHeight);
            }
            maxDimension.width += (maxDimension.width * parent.transform.zoomFactor);
            maxDimension.height += (maxDimension.height * parent.transform.zoomFactor);
        }
        parent.img.destLeft = destLeft - ((maxDimension.width - parent.img.destWidth) / 2);
        parent.img.destTop = destTop - ((maxDimension.height - parent.img.destHeight) / 2);
        destLeft = parent.img.destLeft; destTop = parent.img.destTop;
        if (selectionObj && parent.transform.straighten === 0) {
            if (parent.img.destLeft > selectionObj.activePoint.startX) {
                parent.img.destLeft = selectionObj.activePoint.startX;
                if (parent.transform.degree === 0) {
                    parent.panPoint.totalPannedPoint.x -= (destLeft - parent.img.destLeft);
                }
            }
            if (parent.img.destTop > selectionObj.activePoint.startY) {
                parent.img.destTop = selectionObj.activePoint.startY;
                if (parent.transform.degree === 0) {
                    parent.panPoint.totalPannedPoint.y -= (destTop - parent.img.destTop);
                }
            }
            if (parent.img.destLeft + maxDimension.width < selectionObj.activePoint.endX) {
                parent.img.destLeft = selectionObj.activePoint.endX - maxDimension.width;
                if (parent.transform.degree === 0) {
                    parent.panPoint.totalPannedPoint.x -= (destLeft - parent.img.destLeft);
                }
            }
            if (parent.img.destTop + maxDimension.height < selectionObj.activePoint.endY) {
                parent.img.destTop = selectionObj.activePoint.endY - maxDimension.height;
                if (parent.transform.degree === 0) {
                    parent.panPoint.totalPannedPoint.y -= (destTop - parent.img.destTop);
                }
            }
        }
        return maxDimension;
    }

    private setZoomDimension(value: number, selectionObj: SelectionPoint): Dimension {
        const parent: ImageEditor = this.parent; const degree: number = parent.transform.degree;
        let maxDimension: Dimension = { width: 0, height: 0 };
        if (degree % 90 === 0 && degree % 180 !== 0) {
            maxDimension = this.calcMaxDimension(parent.img.srcHeight, parent.img.srcWidth);
        } else {
            maxDimension = this.calcMaxDimension(parent.img.srcWidth, parent.img.srcHeight);
        }
        maxDimension.width += (maxDimension.width * parent.transform.zoomFactor);
        maxDimension.height += (maxDimension.height * parent.transform.zoomFactor);
        parent.img.destLeft += ((parent.img.destWidth - maxDimension.width) / 2);
        parent.img.destTop += ((parent.img.destHeight - maxDimension.height) / 2);
        // While zoom out limit image to draw inside the selection range
        if (value < 0 && selectionObj) {
            const startX: number = selectionObj.activePoint.startX;
            const startY: number = selectionObj.activePoint.startY;
            const width: number = selectionObj.activePoint.width;
            const height: number = selectionObj.activePoint.height;
            const maxDestLeft: number = parent.img.destLeft + maxDimension.width;
            const maxDestTop: number = parent.img.destTop + maxDimension.height;
            if (parent.img.destLeft > startX) { parent.img.destLeft = startX; }
            if (parent.img.destTop > startY) { parent.img.destTop = startY; }
            if (maxDestLeft < startX + width) { parent.img.destLeft = startX + width - maxDimension.width; }
            if (maxDestTop < startY + height) { parent.img.destTop = startY + height - maxDimension.height; }
        } else if (value < 0 && isNullOrUndefined(selectionObj)) {
            if (parent.img.destLeft > 0) {parent.img.destLeft = 0; }
            if (parent.img.destTop > 0) {parent.img.destTop = 0; }
            if (parent.img.destLeft +  maxDimension.width < parent.lowerCanvas.clientWidth) {
                parent.img.destLeft = parent.lowerCanvas.clientWidth - parent.img.destWidth;
            }
            if (parent.img.destTop +  maxDimension.height < parent.lowerCanvas.clientHeight) {
                parent.img.destTop = parent.lowerCanvas.clientHeight - parent.img.destHeight;
            }
        }
        return maxDimension;
    }

    private drawPannedImage(xDiff?: number, yDiff?: number): void {
        const parent: ImageEditor = this.parent;
        const obj: Object = {panDown: null };
        parent.notify('selection', { prop: 'getPanDown', onPropertyChange: false, value: {obj: obj }});
        const panEventArgs: PanEventArgs = {startPoint: obj['panDown'], endPoint: this.panMove, cancel: false};
        if (isBlazor() && isNullOrUndefined(parent.eventType) && parent.events && parent.events.onPanStart.hasDelegate === true) {
            parent.eventType = 'pan';
            parent.panEventArgs = panEventArgs;
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('PanEventAsync', 'OnPanStart', panEventArgs) as any).then((args: PanEventArgs) => {
                this.panEvent(args, xDiff, yDiff);
            });
        } else {
            parent.trigger('panning', panEventArgs); this.panEvent(panEventArgs, xDiff, yDiff);
        }
    }

    private panEvent(panEventArgs: PanEventArgs, xDiff?: number, yDiff?: number): void {
        if (panEventArgs.cancel) { return; }
        const parent: ImageEditor = this.parent; let isObjCreated: boolean = false;
        if (parent.activeObj.shape && parent.activeObj.shape === 'shape') {
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        }
        if (isNullOrUndefined(parent.activeObj.shape)) {
            isObjCreated = true;
            const actPoint: ActivePoint = parent.activeObj.activePoint = {startX: parent.img.destLeft, startY: parent.img.destTop,
                endX: parent.img.destLeft + parent.img.destWidth, endY: parent.img.destTop + parent.img.destHeight};
            const startX: number = actPoint.startX;
            const startY: number = actPoint.startY;
            const endX: number = actPoint.endX;
            const endY: number = actPoint.endY;
            if (startX < 0) {actPoint.startX = 0; }
            if (startY < 0) {actPoint.startY = 0; }
            if (endX > parent.lowerCanvas.width) {actPoint.endX = parent.lowerCanvas.width; }
            if (endY > parent.lowerCanvas.height) {actPoint.endY = parent.lowerCanvas.height; }
            actPoint.width = actPoint.endX - actPoint.startX;
            actPoint.height = actPoint.endY - actPoint.startY;
            parent.activeObj.shape = 'crop-custom';
            const obj: Object = {strokeSettings: {} as StrokeSettings };
            parent.notify('shape', { prop: 'getStrokeSettings', onPropertyChange: false, value: {obj: obj }});
            parent.activeObj.strokeSettings = obj['strokeSettings'];
            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: actPoint, obj: parent.activeObj,
                isMouseMove: null, x: null, y: null}});
            parent.isCropTab = true;
        }
        if (parent.transform.degree === 0) {
            let point: Point;
            if (isNullOrUndefined(xDiff) && isNullOrUndefined(yDiff)) {point = this.updatePanPoints(); }
            else {point = {x: xDiff, y: yDiff}; }
            parent.panPoint.totalPannedPoint.x += point.x; parent.panPoint.totalPannedPoint.y += point.y;
            const tempSelectionObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            const temp: string = this.lowerContext.filter;
            this.drawPannImage(point, isObjCreated); this.lowerContext.filter = temp;
            this.tempPanMove = extend({}, this.panMove, {}, true) as Point;
            parent.activeObj = extend({}, tempSelectionObj, {}, true) as SelectionPoint;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            if (parent.activeObj.shape) {
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj}});
            }
        } else {
            const tempFlipState: string = parent.transform.currFlipState; parent.isCropTab = true;
            if (isNullOrUndefined(xDiff) && isNullOrUndefined(yDiff)) {
                parent.panPoint.currentPannedPoint = this.updatePanPoints();
            } else {
                parent.panPoint.currentPannedPoint = {x: xDiff, y: yDiff};
            }
            parent.transform.currFlipState = tempFlipState; this.rotatePan(null, null, isObjCreated); parent.isCropTab = false;
            this.tempPanMove = extend({}, this.panMove, {}, true) as Point;
        }
        if (isObjCreated) {
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false}); parent.isCropTab = false;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        }
    }

    private drawPannImage(point: Point, isObjCreated?: boolean): void {
        const parent: ImageEditor = this.parent;
        const filter: string = this.lowerContext.filter;
        const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
            height: parent.img.destHeight};
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'initial', isPreventDestination: null, isRotatePan: null} });
        parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
        parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        this.setDestPointsForFlipState();
        if (isObjCreated) {parent.isCropTab = false; }
        parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
        if (isObjCreated) {parent.isCropTab = true; }
        if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: true}});
        }
        this.lowerContext.filter = filter;
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: null, isRotatePan: null} });
        parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
        parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        const temp: string = this.lowerContext.filter;
        this.lowerContext.filter = 'none';
        if (isObjCreated) {parent.isCropTab = false; }
        parent.notify('shape', { prop: 'panObjColl', onPropertyChange: false,
            value: {xDiff: point.x, yDiff: point.y, panRegion: ''}});
        parent.notify('freehand-draw', { prop: 'panFHDColl', onPropertyChange: false,
            value: {xDiff: point.x, yDiff: point.y, panRegion: ''}});
        if (isObjCreated) {parent.isCropTab = true; }
        this.lowerContext.filter = temp;
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
        if (parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: true}});
        }
    }

    private resetZoom(): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.defaultZoomFactor !== 0) {
            const isUndoRedo: boolean = parent.isUndoRedo;
            const object: Object = {currObj: {} as CurrentObject };
            parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
            this.transCurrObj = object['currObj'];
            this.transCurrObj.objColl = extend([], parent.objColl, null, true) as SelectionPoint[];
            this.transCurrObj.pointColl = extend({}, parent.pointColl, null, true) as Point[];
            this.transCurrObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
            const selPointCollObj: Object = {selPointColl: null };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                value: {obj: selPointCollObj }});
            this.transCurrObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
            parent.isUndoRedo = parent.isCropToolbar = true;
            const zmFactor: number = parent.transform.defaultZoomFactor;
            if (zmFactor > 0) {
                this.zoomAction(-zmFactor);
            } else {
                this.zoomAction(Math.abs(zmFactor));
            }
            parent.isCropToolbar = false; parent.isUndoRedo = isUndoRedo;
        }
    }

    private performTransformation(text: string): void {
        const parent: ImageEditor = this.parent;
        const tempZoomFactor: number = parent.transform.defaultZoomFactor;
        const isUndoRedo: boolean = parent.isUndoRedo;
        const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
        this.resetZoom();
        this.updateTransform(text);
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            if (parent.objColl[i as number].flipObjColl.length > 0) {
                const flipObjColl: Object = {collection: parent.objColl[i as number].flipObjColl };
                parent.notify('shape', { prop: 'alignRotateFlipColl', onPropertyChange: false,
                    value: {collection: flipObjColl['collection'], isRotateFlipCollection: null, obj: flipObjColl }});
                parent.objColl[i as number].flipObjColl = flipObjColl['collection'];
                if (parent.objColl[i as number].flipObjColl.length === 0) {
                    parent.objColl[i as number].shapeFlip = '';
                }
            }
        }
        if (tempZoomFactor !== 0) {
            parent.isUndoRedo = true;
            this.zoomAction(tempZoomFactor);
            parent.isUndoRedo = isUndoRedo;
            let state: string = '';
            if (text === 'rotateleft' || text === 'rotateright') {state = 'rotate'; }
            else if (text === 'horizontalflip' || text === 'verticalflip') {state = 'flip'; }
            parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: state, previousObj: this.transCurrObj, previousObjColl: this.transCurrObj.objColl,
                    previousPointColl: this.transCurrObj.pointColl, previousSelPointColl: this.transCurrObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: null,
                    currentText: null, previousFilter: null, isCircleCrop: null}});
            this.transCurrObj = null;
        }
    }

    private updateTransform(text: string): void {
        switch (text.toLowerCase()) {
        case 'rotateleft':
            this.rotateImage(-90);
            break;
        case 'rotateright':
            this.rotateImage(90);
            break;
        case 'horizontalflip':
            this.flipImage(Direction.Horizontal);
            break;
        case 'verticalflip':
            this.flipImage(Direction.Vertical);
            break;
        }
    }

    private rotatePan(isCropSelection?: boolean, isDefaultZoom?: boolean, isObjCreated?: boolean): void {
        const parent: ImageEditor = this.parent; this.isReverseRotate = true;
        const tempDegree: number = parent.transform.degree;
        let rotatePanActiveObj: SelectionPoint; const object: Object = {selPointColl: null };
        if (parent.activeObj.activePoint && parent.activeObj.shape) {
            rotatePanActiveObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        }
        const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        const tempPointColl: Point[] = extend([], parent.pointColl, [], true) as Point[];
        parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false, value: {obj: object }});
        const cropSelPointColl: Point[] = object['selPointColl'];
        parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false, value: {obj: {selPointColl: [] } }});
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: true }});
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'initial', isPreventDestination: null, isRotatePan: null} });
        const initialDestLeft: number = parent.img.destLeft; const initialDestTop: number = parent.img.destTop;
        const intPan: Point = parent.panPoint.totalPannedInternalPoint;
        if (parent.isCropTab) {
            parent.img.destLeft += intPan.x;
            parent.img.destTop += intPan.y;
        }
        parent.notify('crop', { prop: 'updateRotatePan', onPropertyChange: false});
        if (parent.isCropTab) {
            parent.panPoint.totalPannedInternalPoint.x = parent.img.destLeft - initialDestLeft;
            parent.panPoint.totalPannedInternalPoint.y = parent.img.destTop - initialDestTop;
        }
        const temp: string = this.lowerContext.filter;
        if (isObjCreated) {parent.isCropTab = false; }
        parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
        if (isObjCreated) {parent.isCropTab = true; }
        parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: false }});
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: true, isRotatePan: true} });
        const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
        parent.img.destLeft += parent.panPoint.totalPannedClientPoint.x;
        parent.img.destTop += parent.panPoint.totalPannedClientPoint.y;
        parent.img.destLeft += parent.panPoint.currentPannedPoint.x;
        parent.img.destTop += parent.panPoint.currentPannedPoint.y;
        parent.panPoint.totalPannedClientPoint.x = parent.img.destLeft - destLeft;
        parent.panPoint.totalPannedClientPoint.y = parent.img.destTop - destTop;
        parent.objColl = tempObjColl; parent.pointColl = tempPointColl; parent.freehandCounter = parent.pointColl.length;
        parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
            value: {obj: {selPointColl: cropSelPointColl } }});
        parent.transform.degree = tempDegree;
        this.lowerContext.filter = 'none';
        if (isCropSelection) {
            if (isDefaultZoom) {
                parent.panPoint.totalPannedClientPoint.x = -parent.panPoint.totalPannedClientPoint.x;
                parent.panPoint.totalPannedClientPoint.y = -parent.panPoint.totalPannedClientPoint.y;
                parent.panPoint.currentPannedPoint = extend({}, parent.panPoint.totalPannedClientPoint, {}, true) as Point;
                parent.panPoint.totalPannedClientPoint = { x: 0, y: 0 };
                parent.img.destLeft += parent.panPoint.currentPannedPoint.x;
                parent.img.destTop += parent.panPoint.currentPannedPoint.y;
            } else {
                parent.panPoint.currentPannedPoint = extend({}, parent.panPoint.totalPannedClientPoint, {}, true) as Point;
            }
        }
        if (isObjCreated) {parent.isCropTab = false; }
        parent.notify('shape', { prop: 'panObjColl', onPropertyChange: false,
            value: {xDiff: parent.panPoint.currentPannedPoint.x, yDiff: parent.panPoint.currentPannedPoint.y, panRegion: ''}});
        parent.notify('freehand-draw', { prop: 'panFHDColl', onPropertyChange: false,
            value: {xDiff: parent.panPoint.currentPannedPoint.x, yDiff: parent.panPoint.currentPannedPoint.y, panRegion: ''}});
        if (isObjCreated) {parent.isCropTab = true; }
        this.lowerContext.filter = temp;
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.activeObj = extend({}, rotatePanActiveObj, {}, true) as SelectionPoint;
        if (parent.activeObj.activePoint) {
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj, isCropRatio: null,
                points: null, isPreventDrag: true, saveContext: null, isPreventSelection: null} });
        }
        this.isReverseRotate = false;
    }

    private limitPan(): void {
        const parent: ImageEditor = this.parent;
        const { startX, startY, endX, endY } = parent.activeObj.activePoint;
        const img: ImageDimension = parent.img;
        if (parent.activeObj.activePoint) {
            if (img.destLeft > startX) {
                parent.img.destLeft = startX;
            }
            if (img.destTop > startY) {
                parent.img.destTop = startY;
            }
            if (img.destLeft + img.destWidth < endX) {
                parent.img.destLeft = endX - img.destWidth;
            }
            if (img.destTop + img.destHeight < endY) {
                parent.img.destTop = endY - img.destHeight;
            }
        }
    }

    private updateFlipActiveObj(panRegion: string): void {
        const parent: ImageEditor = this.parent;
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        const { width, height } = parent.lowerCanvas;
        let endX: number; let endY: number;
        if (panRegion === 'horizontal') {
            endX = actPoint.startX > width / 2 ? (width / 2) - (actPoint.startX - (width / 2)) :
                (width / 2) + ((width / 2) - actPoint.startX);
            actPoint.startX = endX - actPoint.width;
            actPoint.endX = endX;
        } else if (panRegion === 'vertical') {
            endY = actPoint.startX > width / 2 ? (height / 2) - (actPoint.startY - (height / 2)) :
                (height / 2) + ((height / 2) - actPoint.startY);
            actPoint.startY = endY - actPoint.height;
            actPoint.endY = endY;
        } else if (panRegion === 'verticalHorizontal' || panRegion === 'horizontalVertical') {
            endX = actPoint.startX > width / 2 ? (width / 2) - (actPoint.startX - (width / 2)) :
                (width / 2) + ((width / 2) - actPoint.startX);
            endY = actPoint.startX > width / 2 ? (height / 2) - (actPoint.startY - (height / 2)) :
                (height / 2) + ((height / 2) - actPoint.startY);
            actPoint.startX = endX - actPoint.width; actPoint.startY = endY - actPoint.height;
            actPoint.endX = endX; actPoint.endY = endY;
        }
        parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: actPoint,
            obj: parent.activeObj, isMouseMove: null, x: null, y: null }});
    }

    private pan(value: boolean): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            if (value) {
                parent.togglePan = true;
                parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                    value: {x: null, y: null, isMouseDown: null}});
                parent.notify('selection', {prop: 'setDragCanvas', value: {bool: true }});
                parent.lowerCanvas.style.cursor = parent.upperCanvas.style.cursor = parent.cursor = 'grab';
                parent.notify('selection', { prop: 'setPanDown', onPropertyChange: false, value: {panDown: null }});
            } else {
                parent.togglePan = parent.currObjType.isCustomCrop = false;
                parent.notify('selection', {prop: 'setDragCanvas', value: {bool: false }});
                parent.lowerCanvas.style.cursor = parent.upperCanvas.style.cursor = parent.cursor = 'default';
            }
        }
    }

    private zoom(zoomFactor: number, zoomPoint?: Point): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            const value: number = this.getCurrentZoomFactor(zoomFactor);
            if (isNullOrUndefined(zoomPoint)) {
                this.zoomAction(value, zoomPoint);
            } else {
                const type: string = value > 0 ? 'zoomIn' : 'zoomOut';
                const absValue: number = Math.abs(value) * 10;
                for (let i: number = 0; i < absValue; i++) {
                    parent.notify('draw', { prop: 'performPointZoom', onPropertyChange: false,
                        value: {x: zoomPoint.x, y: zoomPoint.y, type: type, isResize: null }});
                }
            }
        }
    }

    private getCurrentZoomFactor(zoomFactor: number): number {
        return zoomFactor >= 1 ? (this.prevZoomValue < 1 ? (zoomFactor - this.prevZoomValue) : (zoomFactor - this.prevZoomValue) * 0.1) :
            (zoomFactor - this.prevZoomValue);
    }

    private setCurrPanRegion(region: string, type: number | string, obj: Object): void {
        let panRegion: string = region;
        if (region === '') {
            panRegion = type === 'horizontal' ? 'horizontal' : type === 'vertical' ? 'vertical' : region;
        } else if (region === 'horizontal') {
            panRegion = type === 'horizontal' ? 'horizontalVertical' : type === 'vertical' ? 'verticalHorizontal' : type === 90 ?
                'vertical' : type === -90 ? 'horizontal' : region;
        } else if (region === 'vertical') {
            panRegion = type === 'horizontal' ? 'horizontalVertical' : type === 'vertical' ? 'verticalHorizontal' : type === 90 ?
                'horizontal' : type === -90 ? 'vertical' : region;
        } else {
            panRegion = type === 'horizontal' ? 'vertical' : type === 'vertical' ? 'horizontal' : region;
        }
        obj['panRegion'] = panRegion;
    }

    private rotate(degree: number, obj: Object): void {
        const parent: ImageEditor = this.parent;
        const isRotate: boolean = false;
        if (!parent.disabled && parent.isImageLoaded && (degree % 90 === 0)) {
            this.rotateImage(degree);
        }
        obj['isRotate'] = isRotate;
    }

    private flip(direction: Direction): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            this.flipImage(direction);
        }
    }

    private update(): void {
        const parent: ImageEditor = this.parent; let toolbarHeight: number = 0; let isFrameToolbar: boolean = false;
        let isActiveObj: boolean = false;  const freehandObj: Object = {bool: false };
        const straightenObj: Object = {bool: parent.isStraightening }; let cxtTbarHeight: number = 0;
        const ctToolbar: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_contextualToolbar');
        const ctWrapper: HTMLElement = parent.element.querySelector('.e-contextual-toolbar-wrapper');
        const hdWrapper: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_headWrapper');
        if (parent.isImageLoaded) {
            let isCropSelection: boolean = false; let splitWords: string[];
            if (Browser.isDevice) {
                if (parent.activeObj.shape) {splitWords = parent.activeObj.shape.split('-'); }
                if (parent.currObjType.isCustomCrop) {isCropSelection = true; }
                else if (splitWords && splitWords[0] === 'crop'){isCropSelection = true; }
            }
            const frameObj: Object = {bool: null };
            parent.notify('toolbar', { prop: 'getFrameToolbar', onPropertyChange: false, value: {obj: frameObj }});
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            if (frameObj['bool'] || (isBlazor() && (parent as any).currentToolbar === 'frame-toolbar')) {isFrameToolbar = true; }
            if (!straightenObj['bool'] && ((ctToolbar && !ctToolbar.parentElement.classList.contains('e-hide')) ||
                (hdWrapper && !hdWrapper.parentElement.classList.contains('e-hide')))) {
                ctWrapper.classList.add('e-hide');
                if (!isCropSelection) {parent.okBtn(); }
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
                    parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
                } else {
                    parent.updateToolbar(parent.element, 'imageLoaded');
                }
            }
            parent.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: freehandObj }});
            if (freehandObj['bool']) {
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
                } else {
                    parent.updateToolbar(parent.element, 'destroyQuickAccessToolbar');
                }
            }
            if (parent.activeObj.shape !== undefined) {
                isActiveObj = true;
                if (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') {
                    parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                        value: {x: null, y: null, isMouseDown: null}});
                    if (isBlazor()) {
                        parent.updateToolbar(parent.element, 'destroyQuickAccessToolbar');
                    } else {
                        parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
                    }
                } else {
                    parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
                    parent.objColl.push(parent.activeObj);
                }
                parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            }
        }
        const tempFilter: string = this.lowerContext.filter;
        const canvasWrapper: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_canvasWrapper');
        if (canvasWrapper) {
            canvasWrapper.style.width = parent.element.offsetWidth - 2 + 'px';
        }
        parent.lowerCanvas.width = parent.upperCanvas.width = parent.element.offsetWidth - 2;
        if (parent.toolbarTemplate) {
            toolbarHeight = parent.element.querySelector('#' + parent.element.id + '_toolbarArea').clientHeight;
        } else if (parent.element.querySelector('#' + parent.element.id + '_toolbar')) {
            toolbarHeight = parent.element.querySelector('#' + parent.element.id + '_toolbar').clientHeight;
        }
        if (Browser.isDevice && straightenObj['bool']) {
            cxtTbarHeight = parent.element.querySelector('#' + parent.element.id + '_contextualToolbarArea').clientHeight;
        }
        parent.notify('toolbar', { prop: 'setToolbarHeight', value: {height: toolbarHeight }});
        if (Browser.isDevice) {
            if (canvasWrapper) {
                canvasWrapper.style.height = parent.element.offsetHeight - ((2 * toolbarHeight) + cxtTbarHeight) - 4 + 'px';
            }
        } else {
            if (canvasWrapper) {
                canvasWrapper.style.height = parent.element.offsetHeight - toolbarHeight - 2 + 'px';
            }
        }
        parent.lowerCanvas.height = parent.upperCanvas.height = parseFloat(canvasWrapper.style.height);
        this.lowerContext.filter =
            'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
            'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
        parent.notify('filter', { prop: 'setAdjustmentValue', onPropertyChange: false, value: {adjustmentValue: this.lowerContext.filter }});
        parent.canvasFilter = this.lowerContext.filter; parent.initialAdjustmentValue = this.lowerContext.filter;
        parent.clearContext(this.lowerContext); parent.clearContext(this.upperContext);
        if (parent.isImageLoaded) {
            parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: null}});
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.lowerContext.filter = tempFilter; parent.initialAdjustmentValue = tempFilter;
            parent.canvasFilter = this.lowerContext.filter;
            if (parent.isImageLoaded) {
                showSpinner(parent.element);
                parent.element.style.opacity = '0.5';
            }
            this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            if (canvasWrapper) {
                canvasWrapper.style.width = parent.element.offsetWidth - 2 + 'px';
                canvasWrapper.style.height = parent.element.offsetHeight + 'px';
                const obj: Object = {toolbarHeight: !isBlazor() ? 0 : parent.toolbarHeight };
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'getToolbarHeight', value: {obj: obj }});
                }
                if (Browser.isDevice) {
                    canvasWrapper.style.height = (parseFloat(canvasWrapper.style.height) - (2 * obj['toolbarHeight']) - cxtTbarHeight) - 4 + 'px';
                } else {
                    canvasWrapper.style.height = (parseFloat(canvasWrapper.style.height) - obj['toolbarHeight']) - 2 + 'px';
                }

            }
            parent.lowerCanvas.width = parent.upperCanvas.width = parseFloat(canvasWrapper.style.width);
            parent.lowerCanvas.height = parent.upperCanvas.height = parseFloat(canvasWrapper.style.height);
            this.lowerContext.filter = tempFilter;
            const obj: Object = {width: 0, height: 0 };
            this.calcMaxDimension(parent.img.srcWidth, parent.img.srcHeight, obj);
            const maxDimension: Dimension = obj as Dimension;
            if (straightenObj['bool'] && parent.transform.cropZoomFactor !== 0) {
                maxDimension.width += (maxDimension.width * parent.transform.cropZoomFactor);
                maxDimension.height += (maxDimension.height * parent.transform.cropZoomFactor);
            } else if (parent.transform.defaultZoomFactor > 0) {
                maxDimension.width += (maxDimension.width * parent.transform.defaultZoomFactor);
                maxDimension.height += (maxDimension.height * parent.transform.defaultZoomFactor);
            }
            parent.img.destLeft = (parent.lowerCanvas.clientWidth - maxDimension.width) / 2;
            parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.height + 1) / 2;
            if (parent.transform.degree === 0 && parent.transform.currFlipState === '') {
                if (parent.transform.defaultZoomFactor > 0) {
                    parent.img.destLeft += parent.panPoint.totalPannedPoint.x;
                    parent.img.destTop += parent.panPoint.totalPannedPoint.y;
                }
                parent.notify('draw', {prop: 'draw-image-to-canvas', value: {dimension: maxDimension } });
            } else {
                parent.notify('draw', {prop: 'draw-image-to-canvas', value: {dimension: maxDimension } });
                parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
                    value: {type: 'initial', isPreventDestination: null, isRotatePan: null} });
                const temp: string = this.lowerContext.filter;
                parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
                this.lowerContext.filter = temp;
                parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
                    value: {type: 'reverse', isPreventDestination: null, isRotatePan: null} });
            }
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
            if (parent.isCircleCrop) {
                parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                    value: {context: this.lowerContext, isSave: null, isFlip: null}});
            }
            hideSpinner(parent.element); parent.element.style.opacity = '1';
            const obj1: Object = {defToolbarItems : null };
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'getDefToolbarItems', value: {obj: obj1 }});
                if (obj1['defToolbarItems'] && obj1['defToolbarItems'].length > 0 && document.getElementById(parent.element.id + '_toolbar')) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const toolbar: any = getComponent(parent.element.id + '_toolbar', 'toolbar') as Toolbar;
                    toolbar.refreshOverflow();
                    if (ctWrapper && !straightenObj['bool']) {
                        ctWrapper.classList.add('e-hide');
                    }
                }
            }
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            if (isActiveObj) {
                let activeObj: SelectionPoint = extend({}, parent.objColl[parent.objColl.length - 1], null, true) as SelectionPoint;
                parent.objColl.pop();
                if (activeObj.activePoint.width !== 0 && activeObj.activePoint.height !== 0) {
                    this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
                    parent.notify('draw', {prop: 'render-image', value: {isMouseWheel: null }});
                    parent.objColl.push(activeObj);
                    parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: true }});
                    parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
                    activeObj = extend({}, parent.objColl[parent.objColl.length - 1], null, true) as SelectionPoint;
                    parent.objColl.pop();
                    this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
                    parent.notify('draw', {prop: 'render-image', value: {isMouseWheel: null }});
                    parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: activeObj}});
                    if (straightenObj['bool']) {
                        parent.notify('draw', { prop: 'setStraightenActObj', value: {activeObj: activeObj }});
                    }
                    if (parent.activeObj.shape === 'rectangle' || parent.activeObj.shape === 'ellipse' || parent.activeObj.shape === 'text' ||
                        parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow' || parent.activeObj.shape === 'path' ||
                        parent.activeObj.shape === 'image') {
                        if (!isBlazor()) {
                            parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
                        } else {
                            parent.updateToolbar(parent.element, 'quickAccessToolbar', parent.activeObj.shape);
                        }
                    }
                }
            }
            if (freehandObj['bool']) {
                if (isBlazor()) {
                    parent.updateToolbar(parent.element, 'quickAccessToolbar', 'pen');
                } else {
                    parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: true} });
                }
            }
            if (isFrameToolbar) {
                if (isBlazor()) {
                    parent.updateToolbar(parent.element, 'frame');
                } else {
                    parent.notify('toolbar', { prop: 'callFrameToolbar', onPropertyChange: false});
                }
            } else if (parent.isResize) {
                parent.aspectWidth = Math.ceil(parent.img.destWidth); parent.aspectHeight = Math.ceil(parent.img.destHeight);
                if (isBlazor()) {
                    parent.updateToolbar(parent.element, 'resize');
                } else {
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'resize',
                        isApplyBtn: false, isCropping: false }});
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'resize',
                        isApplyBtn: false, isCropping: false }});
                }
            }
            if ((parent.transform.degree !== 0 || parent.transform.currFlipState !== '') && parent.transform.defaultZoomFactor > 0) {
                const totalPannedPoint: Point = extend({}, parent.panPoint.totalPannedPoint, null, true) as Point;
                const totalPannedInternalPoint: Point = extend({}, parent.panPoint.totalPannedInternalPoint, null, true) as Point;
                const totalPannedClientPoint: Point = extend({}, parent.panPoint.totalPannedClientPoint, null, true) as Point;
                this.zoomAction(.1);
                this.zoomAction(-.1);
                if (parent.transform.degree === 0) {
                    parent.img.destLeft += totalPannedPoint.x; parent.img.destTop += totalPannedPoint.y;
                    parent.panPoint.totalPannedPoint = totalPannedPoint;
                    parent.notify('draw', {prop: 'updateFlipPan', value: {tempSelectionObj: null}});
                } else {
                    parent.panPoint.totalPannedInternalPoint = totalPannedInternalPoint;
                    parent.panPoint.totalPannedClientPoint = totalPannedClientPoint;
                    parent.panPoint.currentPannedPoint = {x: 0, y: 0};
                    parent.isCropTab = true;
                    this.rotatePan();
                    parent.isCropTab = false;
                }
            } else if (parent.transform.degree !== 0 && parent.transform.cropZoomFactor > 0) {
                parent.transform.zoomFactor = 0; parent.transform.cropZoomFactor = null;
                if (isBlazor()) {
                    parent.updateToolbar(parent.element, 'enableDisableToolbarBtn');
                } else {
                    parent.notify('toolbar', { prop: 'enable-disable-btns', onPropertyChange: false});
                }
            }
        }
    }

    private calcMaxDimension(width: number, height: number, obj?: Object, isImgShape?: boolean): Dimension {
        const object: Object = {toolbarHeight: 0 }; const parent: ImageEditor = this.parent;
        if (!isBlazor()) {parent.notify('toolbar', { prop: 'getToolbarHeight', value: {obj: object }}); }
        else {object['toolbarHeight'] = parent.toolbarHeight; }
        let canvasMaxWidth: number = isImgShape ? parent.element.clientWidth / 3 :
            parent.element.clientWidth;
        let canvasMaxHeight: number = isImgShape ? (parent.element.clientHeight - object['toolbarHeight']) / 3 :
            parent.element.clientHeight - (object['toolbarHeight']); // 1px border
        canvasMaxHeight = Browser.isDevice ? canvasMaxHeight - (object['toolbarHeight']) : canvasMaxHeight; // 1px border
        if (Browser.isDevice && parent.isStraightening) {
            const cxtTbar: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_contextualToolbarArea');
            canvasMaxHeight -= cxtTbar ? cxtTbar.clientHeight : 0;
        }
        if (isNullOrUndefined(isImgShape)) {
            if (canvasMaxWidth > 30) {canvasMaxWidth -= 30; } if (canvasMaxHeight > 30) {canvasMaxHeight -= 30; }
        }
        const widthScale: number = canvasMaxWidth / width; const heightScale: number = canvasMaxHeight / height;
        let cssMaxWidth: number = Math.min(width, canvasMaxWidth); let cssMaxHeight: number = Math.min(height, canvasMaxHeight);
        if (widthScale < 1 && widthScale < heightScale) {cssMaxWidth = width * widthScale; cssMaxHeight = height * widthScale; }
        else if (heightScale < 1 && heightScale < widthScale) {cssMaxWidth = width * heightScale; cssMaxHeight = height * heightScale; }
        if (isNullOrUndefined(isImgShape)) {
            const cropObj: Object = {bool: null };
            parent.notify('crop', { prop: 'getPreventScaling', onPropertyChange: false,
                value: {obj: cropObj }});
            if (cropObj['bool'] && parent.cropObj.activeObj.activePoint &&
                parent.cropObj.activeObj.activePoint.width !== 0 && parent.cropObj.activeObj.activePoint.height !== 0) {
                cssMaxWidth =  parent.cropObj.activeObj.activePoint.width;
                cssMaxHeight = parent.cropObj.activeObj.activePoint.height;
            }
        }
        if (obj) {obj['width'] = cssMaxWidth; obj['height'] = cssMaxHeight; }
        return {width: cssMaxWidth, height: cssMaxHeight};
    }

    private updatePanPoints(): Point {
        const parent: ImageEditor = this.parent;
        const tempActObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        const tempDestLeft: number = parent.img.destLeft; const tempDestTop: number = parent.img.destTop;
        if (isNullOrUndefined(this.tempPanMove)) {this.tempPanMove = {x: this.panMove.x, y: this.panMove.y}; }
        let xDiff: number = this.panMove.x - this.tempPanMove.x; let yDiff: number = this.panMove.y - this.tempPanMove.y;
        parent.img.destLeft += xDiff; parent.img.destTop += yDiff;
        this.limitPan();
        const obj: Object = {bool: null };
        const object: Object = {isIntersect: null };
        parent.notify('draw', { prop: 'updateImgCanvasPoints', onPropertyChange: false });
        parent.notify('draw', { prop: 'isLinesIntersect', onPropertyChange: false, value: {obj: object }});
        parent.notify('draw', { prop: 'isSelOutsideImg', onPropertyChange: false, value: {obj: obj }});
        let count: number = 0;
        while (parent.transform.straighten !== 0 && (object['isIntersect'] || obj['bool'])) {
            count++;
            parent.img.destLeft = tempDestLeft; parent.img.destTop = tempDestTop;
            if (xDiff !== 0 && xDiff > 0) {xDiff -= 1; } else if (xDiff !== 0 && xDiff < 0) {xDiff += 1; }
            if (yDiff !== 0 && yDiff > 0) {yDiff -= 1; } else if (yDiff !== 0 && yDiff < 0) {yDiff += 1; }
            if ((xDiff === 0 && yDiff === 0) || count === 200) {
                break;
            }
            parent.img.destLeft += xDiff; parent.img.destTop += yDiff;
            this.limitPan();
            parent.notify('draw', { prop: 'updateImgCanvasPoints', onPropertyChange: false });
            parent.notify('draw', { prop: 'isLinesIntersect', onPropertyChange: false, value: { obj: object } });
            parent.notify('draw', { prop: 'isSelOutsideImg', onPropertyChange: false, value: { obj: obj } });
        }
        parent.activeObj = tempActObj;
        return {x: parent.img.destLeft - tempDestLeft, y: parent.img.destTop - tempDestTop};
    }

    private resizeImage(width?: number, height?: number): void {
        const parent: ImageEditor = this.parent; let temp: boolean = true; let temp1: boolean = true;
        parent.allowDownScale = false;
        parent.img.srcLeft = 0; parent.img.srcTop = 0; parent.isAspectRatio = true; const minimum: number[] = [];
        parent.img.srcWidth = parent.baseImgCanvas.width; parent.img.srcHeight = parent.baseImgCanvas.height;
        if (parent.resizeSrc && parent.resizeSrc.width !== 0 && parent.resizeSrc.height !== 0) {
            parent.img.srcLeft = parent.resizeSrc.startX; parent.img.srcTop = parent.resizeSrc.startY;
            parent.img.srcWidth = parent.resizeSrc.width; parent.img.srcHeight = parent.resizeSrc.height;
        }
        while ((width < parent.img.destWidth || height < parent.img.destHeight) && temp1) {
            this.zoomAction(-.1, null, true, true);
            if (width > parent.img.destWidth || height > parent.img.destHeight) {
                while (width > parent.img.destWidth || height > parent.img.destHeight) {
                    this.zoomAction(0.0125, null, true, true);
                    temp1 = false;
                    minimum.push(parent.img.destWidth);
                }
            }
        }
        while ((width > parent.img.destWidth || height > parent.img.destHeight) && temp1 && temp) {
            this.zoomAction(.1, null, true, true);
            if (width < parent.img.destWidth || height < parent.img.destHeight) {
                while (width < parent.img.destWidth) {
                    this.zoomAction(-.0125, null, true, true);
                    temp = false;
                    minimum.push(parent.img.destWidth);
                }
            }
        }
        let nearestNumber: number = minimum[0]; let smallestDifference: number = Math.abs(parent.img.destWidth - nearestNumber);
        for (const num of minimum) {
            const difference: number = Math.abs(width - num);
            if (difference < smallestDifference) {
                nearestNumber = num; smallestDifference = difference;
            }
        }
        if (nearestNumber < width && temp) {
            this.zoomAction(-.0125, null, true, true); temp = false;
        }
        if (nearestNumber > width && !temp) {
            this.zoomAction(.0125, null, true, true); temp = false;
        }
        this.zoomAction(.0125, null, true); parent.allowDownScale = true; this.zoomAction(-.0125, null, true);
        const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
        const prevObj: CurrentObject = extend({}, this.prevResizeCurrObj, {}, true) as CurrentObject;
        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false, value: { operation: 'resize',
            previousObj: prevObj, previousObjColl: prevObj.objColl, previousPointColl: prevObj.pointColl,
            previousSelPointColl: prevObj.selPointColl, previousCropObj: prevCropObj, previousText: null, currentText: null,
            previousFilter: null, isCircleCrop: parent.isCircleCrop }});
        parent.notify('undo-redo', { prop: 'updateCurrUrc', value: { type: 'ok' } });
    }

    private resizeCrop(width?: number, height?: number): void {
        const parent: ImageEditor = this.parent; let temp: boolean = true;
        const obj1: object = {prevObj: parent.prevObj};
        parent.cropObj = extend({}, parent.prevCropObj, {}, true) as CurrentObject;
        parent.allowDownScale = false;
        parent.notify('toolbar', { prop: 'getPrevObj', onPropertyChange: false, value: { obj: obj1 } });
        const activeObj: SelectionPoint = extend({}, obj1['prevObj']['activeObj'], {}, true) as SelectionPoint;
        obj1['prevObj']['activeObj'] = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        parent.notify('draw', { prop: 'setCurrentObj', onPropertyChange: false, value: { obj: obj1['prevObj'] }});
        parent.objColl = extend([], obj1['prevObj']['objColl'], [], true) as SelectionPoint[];
        parent.pointColl = extend([], obj1['prevObj']['pointColl'], [], true) as Point[];
        parent.transform.straighten = 0;
        parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
        parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
        if (parent.transform.straighten === 0 && !this.isPreventSelect) {
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
        }
        const tempwidth: number = width; const tempheight: number = height; let tempZoom: boolean = false;
        if (height >= width && height <= Math.ceil(parent.img.destHeight)) {
            while ((height <= Math.ceil(parent.img.destHeight)) && temp) {
                this.zoomAction(-.1, null, true, true);
                if (width > parent.img.destWidth || height > parent.img.destHeight) {
                    while (width > parent.img.destWidth || height > parent.img.destHeight) {
                        this.zoomAction(.0125, null, true, true); temp = false;
                    }
                }
            }
        } else if (height <= width  && width < parent.img.destWidth) {
            while ((width < parent.img.destWidth) && temp) {
                this.zoomAction(-.1, null, true, true);
                if (width > parent.img.destWidth || height > parent.img.destHeight) {
                    while (width > parent.img.destWidth || height > parent.img.destHeight) {
                        this.zoomAction(.0125, null, true, true); temp = false;
                    }
                }
            }
        } else if (height >= width && height >= parent.img.destHeight) {
            while ((height >= parent.img.destHeight) && temp) {
                this.zoomAction(.1, null, true, true);
            }
        } else if (width >= height && width >= parent.img.destWidth) {
            while ((width >= parent.img.destWidth) && temp) {
                this.zoomAction(.1, null, true, true);
            }
            if (width < parent.img.destWidth && height < parent.img.destHeight) {
                while (width < parent.img.destWidth && height < parent.img.destHeight) {
                    this.zoomAction(-.0125, null, true, true);
                    temp = false;
                }
                this.zoomAction(.0125, null, true, true);
            }
        } else if (height > parent.img.destHeight && width > parent.img.destWidth ) {
            while ((height > parent.img.destHeight) && (width > parent.img.destWidth) && temp) {
                this.zoomAction(.1, null, true, true);
            }
            if (width < parent.img.destWidth && height < parent.img.destHeight) {
                while (width < parent.img.destWidth && height < parent.img.destHeight) {
                    this.zoomAction(-.0125, null, true, true);
                    temp = false;
                }
                this.zoomAction(.0125, null, true, true);
            }
        }
        this.resizeImg(activeObj, width, height); width = tempwidth; height = tempheight;
        if ((height !== parent.img.destHeight || width !== parent.img.destWidth)) {
            while ((height > parent.img.destHeight || width > parent.img.destWidth)) {
                this.zoomAction(.0125, null, true, true); tempZoom = true;
            }
            if (tempZoom) {
                this.zoomAction(-.0125, null, true, true); tempZoom = false;
            }
        }
        if ((height !== parent.img.destHeight || width !== parent.img.destWidth)) {
            while ((height < parent.img.destHeight || width < parent.img.destWidth)) {
                this.zoomAction(-.0125, null, true, true); tempZoom = true;
            }
            if (tempZoom) {
                this.zoomAction(-.0125, null, true, true); tempZoom = false;
            }
        }
        obj1['prevObj']['activeObj'] = extend({}, activeObj, {}, true) as SelectionPoint;
        this.zoomAction(.0125, null, true);
        parent.allowDownScale = this.preventDownScale ? false : true; parent.isCropTab = false;
        this.zoomAction(-.0125, null, true);
        parent.aspectWidth = width; parent.aspectHeight = height;
    }

    private resizeImg(activeObj: SelectionPoint, width: number, height: number): void {
        const parent: ImageEditor = this.parent; const widthRatio: number = width / parent.img.destWidth;
        const heightRatio: number = height / parent.img.destHeight;
        if (activeObj.shape) {
            parent.currSelectionPoint = activeObj;
            parent.notify('crop', { prop: 'setInitCrop', onPropertyChange: false, value: {bool: true}});
        } else if (parent.img.srcWidth === parent.baseImgCanvas.width && parent.img.srcHeight === parent.baseImgCanvas.height) {
            parent.currSelectionPoint = null;
            parent.notify('draw', { prop: 'select', onPropertyChange: false,
                value: {type: 'custom', startX: null, startY: null, width: null, height: null }});
        }
        if (isNullOrUndefined(parent.currSelectionPoint)) {
            parent.notify('draw', { prop: 'select', onPropertyChange: false,
                value: {type: 'custom', startX: parent.img.destLeft, startY: parent.img.destTop,
                    width: parent.img.destWidth, height: parent.img.destHeight }});
        } else {
            parent.notify('draw', { prop: 'select', onPropertyChange: false,
                value: {type: 'custom', startX: null, startY: null, width: null, height: null}});
        }
        width = parent.activeObj.activePoint.width * widthRatio;
        height = parent.activeObj.activePoint.height * heightRatio;
        let sx: number = (parent.activeObj.activePoint.startX + (parent.activeObj.activePoint.width / 2)) - (width / 2);
        let sy: number = (parent.activeObj.activePoint.startY + (parent.activeObj.activePoint.height / 2)) - (height / 2);
        let count: number = 0;
        while (Browser.isDevice && count < 500 && (sx < 0 || sy < 0 || (sx + width) > parent.img.destWidth
            || (sy + height) > parent.img.destHeight)) {
            count++;
            width -= 1; height -= 1;
            sx = (parent.activeObj.activePoint.startX + (parent.activeObj.activePoint.width / 2)) - (width / 2);
            sy = (parent.activeObj.activePoint.startY + (parent.activeObj.activePoint.height / 2)) - (height / 2);
        }
        parent.transform.defaultZoomFactor = 0;
        parent.notify('draw', {prop: 'setResizeSelect', value: {bool: true }});
        parent.notify('draw', {prop: 'setIsCropSelect', value: {bool: true }});
        parent.notify('draw', { prop: 'select', onPropertyChange: false,
            value: {type: 'custom', startX: sx, startY: sy, width: width, height: height}});
        parent.notify('draw', {prop: 'setResizeSelect', value: {bool: false }});
        if (parent.transform.straighten !== 0) {
            const obj: Object = {isIntersect: null, arr: null };
            parent.notify('draw', { prop: 'updateImgCanvasPoints', onPropertyChange: false });
            parent.notify('draw', { prop: 'isLinesIntersect', onPropertyChange: false, value: {obj: obj }});
            while (obj['arr'][0] || obj['arr'][1] || obj['arr'][2] || obj['arr'][3]) {
                this.zoomAction(.0125, null, true);
                parent.notify('draw', { prop: 'updateImgCanvasPoints', onPropertyChange: false });
                parent.notify('draw', { prop: 'isLinesIntersect', onPropertyChange: false, value: {obj: obj }});
            }
        }
        parent.isCropToolbar = true;
        parent.crop();
        parent.isCropToolbar = false;
    }

    private updateResize(): void {
        const parent: ImageEditor = this.parent;
        parent.prevCropObj = extend({}, parent.cropObj, {}, true) as CurrentObject;
        const currObject: Object = {currObj: {} as CurrentObject };
        parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: currObject }});
        parent.prevObj = currObject['currObj'];
        if (parent.currSelectionPoint && parent.prevCropObj.activeObj.shape) {
            parent.prevObj.activeObj = extend({}, parent.prevCropObj.activeObj, {}, true) as SelectionPoint;
        }
        parent.prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
        parent.prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
        parent.prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        parent.prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        parent.resizeSrc = {startX: parent.img.srcLeft, startY: parent.img.srcTop, width: parent.img.srcWidth,
            height: parent.img.srcHeight };
    }

    private resize(width: number, height: number, isAspectRatio?: boolean): void {
        const parent: ImageEditor = this.parent;
        parent.isResize = true;
        if (isNullOrUndefined(parent.prevCropObj) && isNullOrUndefined(parent.prevObj)) {
            parent.notify('transform', { prop: 'updateResize', value: {bool: false }});
        }
        const aspectIcon: HTMLInputElement = (parent.element.querySelector('#' + parent.element.id + '_aspectratio') as HTMLInputElement);
        const nonAspectIcon: HTMLInputElement = (parent.element.querySelector('#' + parent.element.id + '_nonaspectratio') as HTMLInputElement);
        if (aspectIcon && nonAspectIcon) {
            parent.notify('toolbar', { prop: 'initResizeToolbar'});
            if (Browser.isDevice) {
                parent.notify('toolbar', { prop: 'init-main-toolbar', value: {isApplyBtn: false, isDevice: true, isOkBtn: true, isResize: true}});
            }
        }
        const resizeEventArgs: ResizeEventArgs = {cancel: false, previousWidth: Math.ceil(parent.img.destWidth),
            previousHeight: Math.ceil(parent.img.destHeight), width: Math.ceil(width), height: height && height !== 0 ? Math.ceil(height) :
                (parent.aspectHeight ? parent.aspectHeight : Math.ceil(parent.img.destHeight)),
            isAspectRatio: isAspectRatio ? isAspectRatio : false };
        if (!isBlazor()) {
            parent.trigger('resizing', resizeEventArgs);
            if (!resizeEventArgs.cancel) {
                this.resizeEventHandler(resizeEventArgs);
            } else if (parent.aspectHeight && parent.aspectWidth) {
                parent.aspectHeight = resizeEventArgs.previousHeight; parent.aspectWidth = resizeEventArgs.previousWidth;
            }
        } else if (isBlazor() && parent.events && parent.events.imageResizing.hasDelegate === true && !parent.isResizeOkBtn) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('OnImageResizingAsync', 'ImageResizing', resizeEventArgs, null) as any).then((args: ResizeEventArgs) => {
                this.resizeEventCancel = args.cancel;
                if (!args.cancel) { 
                    this.resizeEventHandler(args);
                } else if (parent.aspectHeight && parent.aspectWidth) {
                    parent.aspectHeight = resizeEventArgs.previousHeight; parent.aspectWidth = resizeEventArgs.previousWidth;
                }
            });
        } else if (!this.resizeEventCancel){
            this.resizeEventHandler(resizeEventArgs);
        }
    }

    private resizeEventHandler(args: ResizeEventArgs): void {
        const parent: ImageEditor = this.parent; let isRotate: boolean;
        const aspectRatioWidth: HTMLInputElement = parent.element.querySelector('#' + parent.element.id + '_resizeWidth');
        const aspectRatioHeight: HTMLInputElement = parent.element.querySelector('#' + parent.element.id + '_resizeHeight');
        const heightElem: HTMLInputElement = parent.element.querySelector('.e-ie-toolbar-e-resize-height-input .e-textbox');
        const widthElem: HTMLInputElement = parent.element.querySelector('.e-ie-toolbar-e-resize-width-input .e-textbox');
        if (args.isAspectRatio) {
            if (this.resizedImgAngle == null || this.resizedImgAngle !== parent.transform.degree) {
                this.resizedImgAngle = parent.transform.degree;
                isRotate = true;
            }
            if (isRotate) {
                parent.notify('transform', { prop: 'resizeImage', value: { width: args.width, height: 0 } });
                const originalWidth: number = parent.img.destWidth;
                const originalHeight: number = parent.img.destHeight;
                let aspectRatioWidthValue: number;
                if (!isBlazor()) {
                    aspectRatioWidthValue = parseFloat(aspectRatioWidth.value === '' ? aspectRatioWidth.placeholder :
                    aspectRatioWidth.value);
                } else {
                    aspectRatioWidthValue = parseFloat(widthElem.value === '' ? widthElem.placeholder : widthElem.value);
                }
                if (aspectRatioHeight) {
                    let value: number = aspectRatioWidthValue / (originalWidth / originalHeight);
                    const height: number = value % 1 >= 0.5 || value % 1 <= -0.5 ? Math.round(value) : (value < 0) ? Math.ceil(value) : Math.floor(value);
                    (getComponent(aspectRatioHeight, 'numerictextbox') as NumericTextBox).value = height;
                    (aspectRatioHeight as HTMLInputElement).value = height.toString() + ' px';
                    parent.aspectHeight = height;
                    if (aspectRatioWidth && (aspectRatioWidth as HTMLInputElement).value === '') {
                        const aspectRatioHeightValue: number = parseFloat(aspectRatioHeight.value === '' ? aspectRatioHeight.placeholder :
                            aspectRatioHeight.value);
                        value = aspectRatioHeightValue / (originalHeight / originalWidth);
                        const width: number = value % 1 >= 0.5 || value % 1 <= -0.5 ? Math.round(value) : (value < 0) ? Math.ceil(value) : Math.floor(value);
                        (getComponent(aspectRatioWidth, 'numerictextbox') as NumericTextBox).value = width;
                        (aspectRatioWidth as HTMLInputElement).value = width.toString() + ' px';
                        parent.aspectWidth = width;
                    }
                } else if (heightElem) {
                    let value: number = aspectRatioWidthValue / (originalWidth / originalHeight);
                    const height: number = value % 1 >= 0.5 || value % 1 <= -0.5 ? Math.round(value) : (value < 0) ? Math.ceil(value) : Math.floor(value);
                    heightElem.value = height.toString();
                    parent.aspectHeight = height;
                    if (widthElem && widthElem.value === '') {
                        const aspectRatioHeightValue: number = parseFloat(heightElem.value === '' ? heightElem.placeholder : heightElem.value);
                        value = aspectRatioHeightValue / (originalHeight / originalWidth);
                        const width: number = value % 1 >= 0.5 || value % 1 <= -0.5 ? Math.round(value) : (value < 0) ? Math.ceil(value) : Math.floor(value);
                        widthElem.value = width.toString();
                        parent.aspectWidth = width;
                    }
                }
            } else {
                parent.notify('transform', { prop: 'resizeImage', value: { width: args.width, height: null } });
            }
        } else {
            if (this.resizedImgAngle !== null && this.resizedImgAngle !== parent.transform.degree) {
                this.resizedImgAngle = parent.transform.degree;
                isRotate = true;
            }
            if (isRotate) {
                parent.notify('transform', { prop: 'setPreventDownScale', value: { bool: true } });
                parent.notify('transform', { prop: 'resizeCrop', value: { width: args.width, height: args.height } });
                parent.notify('undo-redo', { prop: 'setPreventUR', value: { bool: true } });
                parent.okBtn();
                parent.notify('undo-redo', { prop: 'setPreventUR', value: { bool: false } });
                parent.resizeSrc = { startX: parent.img.srcLeft, startY: parent.img.srcTop, width: parent.img.srcWidth,
                    height: parent.img.srcHeight };
                if (isBlazor()) {
                    parent.updateToolbar(parent.element, 'resize');
                } else {
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'resize',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    parent.notify('transform', { prop: 'setPreventDownScale', value: { bool: false } });
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'resize',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                }
            } else {
                parent.notify('transform', { prop: 'resizeCrop', value: { width: args.width, height: args.height } });
            }
        }
        this.resizedImgAngle = parent.transform.degree;
        args = { previousHeight: args.previousHeight, previousWidth: args.previousWidth, width: args.width, height: args.height, isAspectRatio: args.isAspectRatio };
        if (isBlazor() && parent.isResizeOkBtn && parent.events && parent.events.imageResized.hasDelegate === true) {
            const resizeArgs: object = { width: args.width, height: args.height, isAspectRatio: args.isAspectRatio };
            parent.dotNetRef.invokeMethodAsync('OnImageResizingAsync', 'ImageResized', null, resizeArgs);
        } else {}
    }

    private straightenImage(degree: number): void {
        const parent: ImageEditor = this.parent;
        if (parent.toolbar && parent.toolbar.length === 0) {
            parent.notify('draw', { prop: 'select', onPropertyChange: false,
                value: { type: 'custom', startX: null, startY: null, width: null, height: null } });
        }
        if (isBlazor()) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent as any).performCropClick();
        } else {
            parent.notify('toolbar', { prop: 'performCropTransformClick', value: {shape: null }});
        }
        parent.setStraighten(degree, true);
        if ((isBlazor() && parent.events && parent.events.straightening.hasDelegate === false) || !isBlazor()) {
            parent.okBtn();
        }
    }
}
