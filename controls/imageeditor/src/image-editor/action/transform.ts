import { Browser, extend, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ActivePoint, Dimension } from '@syncfusion/ej2-inputs';
import { CurrentObject, Direction, FlipEventArgs, ImageEditor, PanEventArgs, Point, RotateEventArgs, SelectionPoint, StrokeSettings, ZoomEventArgs } from '../index';

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
            this.zoomAction(args.value['zoomFactor'], args.value['zoomPoint']);
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
            this.calcMaxDimension(args.value['width'], args.value['height'], args.value['obj']);
            break;
        case 'updatePanPoints':
            this.updatePanPoints(args.value['panRegion'], args.value['obj']);
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
        case 'reset':
            this.reset();
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
        this.currDestPoint = null; this.isReverseRotate = false; this.flipColl = [];
        this.transCurrObj = null; this.prevZoomValue = 1; this.isPreventSelect = false;
    }

    private rotateImage(degree: number): void {
        const parent: ImageEditor = this.parent;
        const transitionArgs: RotateEventArgs = {cancel: false, previousDegree: parent.transform.degree,
            currentDegree: Math.abs(parent.transform.degree + degree) === 360 ? 0 : parent.transform.degree + degree };
        if (!this.isPreventSelect && isBlazor() && !isNullOrUndefined(parent.events) && parent.events.rotating.hasDelegate === true) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('RotateEventAsync', 'OnRotate', transitionArgs) as any).then((args: RotateEventArgs) => {
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
                parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                    value: {obj: selPointCollObj }});
                prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
            }
            parent.afterCropActions.push(degree === 90 ? 'rotateRight' : 'rotateLeft');
            let splitWords: string[] = []; let activeObjShape: string;
            if (!isNullOrUndefined(parent.activeObj.activePoint) && !isNullOrUndefined(parent.activeObj.shape)) {
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
                this.isPreventSelect = true; parent.select('custom'); this.isPreventSelect = false;
                parent.setProperties({zoomSettings: { zoomFactor: 1 }}, true);
                this.prevZoomValue = parent.zoomSettings.zoomFactor;
            }
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
        this.parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(this.parent.baseImg, this.parent.img.srcLeft, this.parent.img.srcTop, this.parent.img.srcWidth,
                                    this.parent.img.srcHeight, this.parent.img.destLeft, this.parent.img.destTop, this.parent.img.destWidth,
                                    this.parent.img.destHeight);
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
            parent.img.srcLeft = 0; parent.img.srcTop = 0; parent.img.srcWidth = parent.baseImg.width;
            parent.img.srcHeight = parent.baseImg.height;
            parent.img.destLeft = this.currDestPoint.startX; parent.img.destTop = this.currDestPoint.startY;
            parent.img.destWidth = this.currDestPoint.width; parent.img.destHeight = this.currDestPoint.height;
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
            parent.img.srcLeft = srcPoints.startX; parent.img.srcTop = srcPoints.startY;
            parent.img.srcWidth = srcPoints.width; parent.img.srcHeight = srcPoints.height;
            parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
            parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        }
    }

    private flipImage(direction: Direction): void {
        const parent: ImageEditor = this.parent;
        const transitionArgs: FlipEventArgs = {direction: direction, cancel: false,
            previousDirection: parent.toPascalCase(parent.transform.currFlipState )};
        if (!this.isPreventSelect && isBlazor() && !isNullOrUndefined(parent.events) && parent.events.flipping.hasDelegate === true) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('FlipEventAsync', 'OnFlip', transitionArgs) as any).then((args: FlipEventArgs) => {
                this.flipEvent(args, direction);
            });
        } else {
            if (!this.isPreventSelect) {parent.trigger('flipping', transitionArgs); }
            this.flipEvent(transitionArgs, direction);
        }
    }

    private flipEvent(transitionArgs: FlipEventArgs, direction: Direction): void {
        const parent: ImageEditor = this.parent;
        if (transitionArgs.cancel) { return; }
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
        if (lowercaseDirection === 'horizontal') {
            parent.transform.currFlipState = (parent.transform.currFlipState.toLowerCase() === 'horizontal') ? '' : 'horizontal';
        } else {
            parent.transform.currFlipState = (parent.transform.currFlipState.toLowerCase() === 'vertical') ? '' : 'vertical';
        }
        const selObj: Object = {isSelected: null };
        parent.notify('draw', { prop: 'getRotatedFlipCropSelection', onPropertyChange: false, value: {bool: selObj }});
        if (selObj['isSelected']) {
            parent.img.destLeft += parent.panPoint.totalPannedInternalPoint.x;
            parent.img.destTop += parent.panPoint.totalPannedInternalPoint.y;
        }
        const temp: string = this.lowerContext.filter;
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
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
        if (direction.toLowerCase() === 'horizontal' || direction.toLowerCase() === 'vertical') {
            parent.notify('freehand-draw', { prop: 'flipFHDColl', onPropertyChange: false,
                value: {value: direction.toLowerCase()}});
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
        } else {
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
        }
        this.lowerContext.filter = tempFilter;
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        this.updateCurrSelectionPoint(direction.toLowerCase());
        parent.isUndoRedo = false;
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
        if (parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: null}});
        }
        if (!isNullOrUndefined(activeObjShape)) {
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
            this.isPreventSelect = true;
            parent.select('custom');
            this.isPreventSelect = false;
            parent.setProperties({zoomSettings: { zoomFactor: 1 }}, true);
            this.prevZoomValue = parent.zoomSettings.zoomFactor;
        }
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
        parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false,
            value: {panObj: panObj }});
        if (panObj['panRegion'] !== '') {
            if (panObj['panRegion'] === 'horizontal') {
                parent.img.destLeft = parent.lowerCanvas.clientWidth - (parent.img.destWidth + parent.img.destLeft);
            } else if (panObj['panRegion'] === 'vertical') {
                parent.img.destTop = parent.lowerCanvas.clientHeight - (parent.img.destHeight + parent.img.destTop);
            } else {
                parent.img.destLeft = parent.lowerCanvas.clientWidth - (parent.img.destWidth + parent.img.destLeft);
                parent.img.destTop = parent.lowerCanvas.clientHeight - (parent.img.destHeight + parent.img.destTop);
            }
        }
    }

    private zoomAction(zoomFactor: number, zoomPoint?: Point): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            if (parent.zoomSettings.zoomFactor >= parent.zoomSettings.maxZoomFactor && zoomFactor > 0 ||
                (parent.zoomSettings.zoomFactor > parent.zoomSettings.minZoomFactor && zoomFactor < 0 && this.disableZoomOutBtn(true)) ||
                (parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor && zoomFactor < 0)) {
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'zoom-up-handler', onPropertyChange: false});
                }
                return;
            }
            parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
            const tempZoomFactor: number = zoomFactor;
            zoomFactor = tempZoomFactor > 0 ? 0.1 : -0.1;
            for (let i: number = 0; i < Math.abs(tempZoomFactor / 0.1); i++) {
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
            } else if (!isNullOrUndefined(parent.activeObj.shape) && splitWords[0] !== 'crop') {
                this.isShape = true;
            }
            const obj: Object = {zoomType: null };
            parent.notify('selection', { prop: 'getZoomType', onPropertyChange: false, value: {obj: obj }});
            if (isNullOrUndefined(zoomPoint)) {
                if (parent.isCropTab && !isNullOrUndefined(this.tempActiveObj)) {
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
            if (!parent.isCropToolbar && isBlazor() && !isNullOrUndefined(parent.events) && parent.events.zooming.hasDelegate === true) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                (parent.dotNetRef.invokeMethodAsync('ZoomEventAsync', 'OnZoom', zoomEventArgs) as any).then((args: ZoomEventArgs) => {
                    this.zoomEvent(args, zoomFactor);
                });
            } else {
                if (!parent.isCropToolbar) {parent.trigger('zooming', zoomEventArgs); }
                this.zoomEvent(zoomEventArgs, zoomFactor);
            }

        }
    }

    private zoomEvent(zoomEventArgs: ZoomEventArgs, zoomFactor: number): void {
        const parent: ImageEditor = this.parent;
        if (zoomEventArgs.cancel) {return; }
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'close-contextual-toolbar', onPropertyChange: false});
        } else if(parent.element.querySelector('.e-contextual-toolbar-wrapper') && !parent.element.querySelector('.e-contextual-toolbar-wrapper').classList.contains('e-hidden') ) {
            parent.updateToolbar(parent.element, 'closeContextualToolbar');
        }
        parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
            value: {x: null, y: null, isMouseDown: true}});
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        this.upperContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        const object: Object = {canvasFilter: this.parent.canvasFilter };
        this.lowerContext.filter = object['canvasFilter'];
        parent.upperCanvas.style.cursor = parent.cursor = 'default';
        let objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        if (!parent.isCropTab) {
            if (parent.transform.degree !== 0) {
                parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                    value: {x: null, y: null, isMouseDown: null}});
                parent.panPoint.currentPannedPoint = {x: 0, y: 0};
                this.rotatePan(true, true);
            } else if (parent.transform.currFlipState !== '') {
                parent.panPoint.totalPannedPoint = {x: 0, y: 0};
            }
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
        }
        if (parent.transform.degree === 0) {
            this.drawZoomImgToCanvas(zoomFactor, this.tempActiveObj);
            const panObj: Object = {panRegion: '' };
            parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false,
                value: {panObj: panObj }});
            if (panObj['panRegion'] !== '') {
                parent.notify('crop', { prop: 'setTempFlipPanPoint', onPropertyChange: false, value: {point: parent.panPoint.totalPannedPoint, isAdd: true }});
                objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
                parent.objColl = [];
                const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
                this.setDestPointsForFlipState();
                this.rotatedFlip();
                parent.img.destLeft = destLeft; parent.img.destTop = destTop;
                parent.objColl = objColl;
                parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
                parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
                parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
            }
            if (parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor && !parent.isCropTab) {
                parent.panPoint.totalPannedPoint = { x: 0, y: 0 };
            }
        } else {
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
            parent.panPoint.totalPannedClientPoint = { x: 0, y: 0 };
            parent.panPoint.totalPannedInternalPoint = { x: 0, y: 0 };
            this.rotateZoom(zoomFactor);
            const panObj: Object = {panRegion: '' };
            parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false,
                value: {panObj: panObj }});
            if (panObj['panRegion'] !== '') {
                const temp: string = this.lowerContext.filter;
                this.lowerContext.filter = 'none';
                parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
                parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
                this.lowerContext.filter = temp;
            }
        }
        const powerOften: number = Math.pow(10, 1);
        if (parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor ||
            (Math.round(parent.transform.zoomFactor * powerOften ) / powerOften) === 2) {
            clearInterval(this.zoomBtnHold); this.zoomBtnHold = 0;
        }
        const panObj: Object = {panRegion: '' };
        parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false,
            value: {panObj: panObj }});
        if (panObj['panRegion'] === '') {
            const temp: string = this.lowerContext.filter;
            this.lowerContext.filter = 'none';
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: { isPreventApply: null } });
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
            if (parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor) {parent.currSelectionPoint = null; }
        }
        parent.isUndoRedo = false;
        let zoomOut: HTMLElement;
        if (!isBlazor()) {
            zoomOut = document.querySelector('#' + parent.element.id + '_zoomOut');
            if (zoomOut && parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor) {
                zoomOut.classList.add('e-disabled');
                zoomOut.parentElement.classList.add('e-overlay');
            } else if (zoomOut) {
                zoomOut.classList.remove('e-disabled');
                zoomOut.parentElement.classList.remove('e-overlay');
            }
        } else {
            zoomOut = parent.element.querySelector('#zoomout');
            if (zoomOut && parent.zoomSettings.zoomFactor <= parent.zoomSettings.minZoomFactor) {
                zoomOut.classList.add('e-overlay');
            } else if (zoomOut) {
                zoomOut.classList.remove('e-overlay');
            }
        }
        this.autoEnablePan();
        if (!isNullOrUndefined(this.tempActiveObj)) {
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
    }

    private disableZoomOutBtn(isZoomOut?: boolean): boolean {
        const parent: ImageEditor = this.parent;
        let isDisabled: boolean = false;
        let zoomOut: HTMLElement;
        if (!isNullOrUndefined(isZoomOut)) {
            parent.transform.zoomFactor -= 0.1;
        }
        if (!isBlazor()) {
            zoomOut = document.querySelector('#' + parent.element.id + '_zoomOut');
        } else {
            zoomOut = this.parent.element.querySelector('#zoomout');
        }
        const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
        const destWidth: number = parent.img.destWidth; const destHeight: number = parent.img.destHeight;
        if (parent.activeObj.shape) {
            this.setZoomDimension(-0.1, parent.activeObj);
            if (!isNullOrUndefined(zoomOut)) {
                if (parent.img.destLeft > parent.activeObj.activePoint.startX || parent.img.destTop > parent.activeObj.activePoint.startY
                    || parent.img.destLeft + parent.img.destWidth < parent.activeObj.activePoint.endX || parent.img.destTop +
                    parent.img.destHeight < parent.activeObj.activePoint.endY || parent.zoomSettings.zoomFactor ===
                    parent.zoomSettings.minZoomFactor) {
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
        } else {
            this.setZoomDimension(-0.1, null);
        }
        if (!isNullOrUndefined(isZoomOut)) {
            parent.transform.zoomFactor += 0.1;
        }
        parent.img.destLeft = destLeft; parent.img.destTop = destTop; parent.img.destWidth = destWidth; parent.img.destHeight = destHeight;
        return isDisabled;
    }

    private drawZoomImgToCanvas(value: number, selectionObj?: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        const powerOften: number = Math.pow(10, 1);
        if ((Math.round(parent.transform.zoomFactor * powerOften ) / powerOften) === 0.1 && value === -0.1) {
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
            parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.height) / 2;
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
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
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
        if ((Math.round(parent.transform.zoomFactor * powerOften ) / powerOften) === 0.1 && value === -0.1) {
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
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
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
        if (this.parent.transform.zoomFactor <= 0) {
            this.parent.togglePan = false;
            this.parent.notify('selection', {prop: 'setDragCanvas', value: {bool: false }});
            this.parent.pan(false);
            this.disablePan = false;
        } else {
            this.parent.pan(!this.disablePan);
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
        if (selectionObj) {
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
        const parent: ImageEditor = this.parent;
        let maxDimension: Dimension = { width: 0, height: 0 };
        if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
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
            if (parent.img.destLeft +  maxDimension.width < parent.lowerCanvas.width) {
                parent.img.destLeft = parent.lowerCanvas.width - parent.img.destWidth;
            }
            if (parent.img.destTop +  maxDimension.height < parent.lowerCanvas.height) {
                parent.img.destTop = parent.lowerCanvas.height - parent.img.destHeight;
            }
        }
        return maxDimension;
    }

    private drawPannedImage(xDiff?: number, yDiff?: number): void {
        const parent: ImageEditor = this.parent;
        const obj: Object = {panDown: null };
        parent.notify('selection', { prop: 'getPanDown', onPropertyChange: false, value: {obj: obj }});
        const panEventArgs: PanEventArgs = {startPoint: obj['panDown'], endPoint: this.panMove, cancel: false};
        if (isBlazor() && isNullOrUndefined(this.parent.eventType) && !isNullOrUndefined(parent.events) && parent.events.onPanStart.hasDelegate === true) {
            this.parent.eventType = 'pan';
            this.parent.panEventArgs = panEventArgs;
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
            parent.activeObj.activePoint = {startX: parent.img.destLeft, startY: parent.img.destTop,
                endX: parent.img.destLeft + parent.img.destWidth, endY: parent.img.destTop + parent.img.destHeight};
            const startX: number = parent.activeObj.activePoint.startX;
            const startY: number = parent.activeObj.activePoint.startY;
            const endX: number = parent.activeObj.activePoint.endX;
            const endY: number = parent.activeObj.activePoint.endY;
            if (startX < 0) {parent.activeObj.activePoint.startX = 0; }
            if (startY < 0) {parent.activeObj.activePoint.startY = 0; }
            if (endX > parent.lowerCanvas.width) {parent.activeObj.activePoint.endX =
                parent.lowerCanvas.width; }
            if (endY > parent.lowerCanvas.height) {parent.activeObj.activePoint.endY =
                parent.lowerCanvas.height; }
            parent.activeObj.activePoint.width = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.startX;
            parent.activeObj.activePoint.height = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.startY;
            parent.activeObj.shape = 'crop-custom';
            const obj: Object = {strokeSettings: {} as StrokeSettings };
            parent.notify('shape', { prop: 'getStrokeSettings', onPropertyChange: false,
                value: {obj: obj }});
            parent.activeObj.strokeSettings = obj['strokeSettings'];
            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: parent.activeObj.activePoint, obj: parent.activeObj,
                isMouseMove: null, x: null, y: null}});
            parent.isCropTab = true;
        }
        if (parent.transform.degree === 0) {
            let point: Point;
            if (isNullOrUndefined(xDiff) && isNullOrUndefined(yDiff)) {point = this.updatePanPoints(''); }
            else {point = {x: xDiff, y: yDiff}; }
            parent.panPoint.totalPannedPoint.x += point.x; parent.panPoint.totalPannedPoint.y += point.y;
            const tempSelectionObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            const temp: string = this.lowerContext.filter;
            this.drawPannImage(point); this.lowerContext.filter = temp;
            this.tempPanMove = extend({}, this.panMove, {}, true) as Point;
            parent.activeObj = extend({}, tempSelectionObj, {}, true) as SelectionPoint;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            if (parent.activeObj.shape) {
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj}});
            }
        } else {
            const tempFlipState: string = parent.transform.currFlipState; parent.isCropTab = true;
            if (isNullOrUndefined(xDiff) && isNullOrUndefined(yDiff)) {
                parent.panPoint.currentPannedPoint = this.updatePanPoints('');
            } else {
                parent.panPoint.currentPannedPoint = {x: xDiff, y: yDiff};
            }
            parent.transform.currFlipState = tempFlipState; this.rotatePan(); parent.isCropTab = false;
            this.tempPanMove = extend({}, this.panMove, {}, true) as Point;
        }
        if (isObjCreated) {
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false}); parent.isCropTab = false;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        }
    }

    private drawPannImage(point: Point): void {
        const parent: ImageEditor = this.parent;
        const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
            height: parent.img.destHeight};
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'initial', isPreventDestination: null, isRotatePan: null} });
        parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
        parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        this.setDestPointsForFlipState();
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                                    parent.img.srcHeight, parent.img.destLeft, parent.img.destTop, parent.img.destWidth,
                                    parent.img.destHeight);
        if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: this.lowerContext, isSave: null, isFlip: true}});
        }
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: null, isRotatePan: null} });
        parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
        parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
        const temp: string = this.lowerContext.filter;
        this.lowerContext.filter = 'none';
        parent.notify('shape', { prop: 'panObjColl', onPropertyChange: false,
            value: {xDiff: point.x, yDiff: point.y, panRegion: ''}});
        parent.notify('freehand-draw', { prop: 'panFHDColl', onPropertyChange: false,
            value: {xDiff: point.x, yDiff: point.y, panRegion: ''}});
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
            if (parent.transform.defaultZoomFactor > 0) {
                this.zoomAction(-parent.transform.defaultZoomFactor);
            } else {
                this.zoomAction(Math.abs(parent.transform.defaultZoomFactor));
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
                    value: {collection: parent.objColl[i as number].flipObjColl, isRotateFlipCollection: null, obj: flipObjColl }});
                parent.objColl[i as number].flipObjColl = flipObjColl['collection'];
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

    private rotatePan(isCropSelection?: boolean, isDefaultZoom?: boolean): void {
        const parent: ImageEditor = this.parent; this.isReverseRotate = true;
        const tempDegree: number = parent.transform.degree;
        let rotatePanActiveObj: SelectionPoint; const object: Object = {selPointColl: null };
        if (!isNullOrUndefined(parent.activeObj.activePoint) && !isNullOrUndefined(parent.activeObj.shape)) {
            rotatePanActiveObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        }
        const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        const tempPointColl: Point[] = extend([], parent.pointColl, [], true) as Point[];
        parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: object }});
        const cropSelPointColl: Point[] = object['selPointColl'];
        parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
            value: {obj: {selPointColl: [] } }});
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: true }});
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'initial', isPreventDestination: null, isRotatePan: null} });
        const initialDestLeft: number = parent.img.destLeft; const initialDestTop: number = parent.img.destTop;
        if (parent.isCropTab) {
            parent.img.destLeft += parent.panPoint.totalPannedInternalPoint.x;
            parent.img.destTop += parent.panPoint.totalPannedInternalPoint.y;
        }
        parent.notify('crop', { prop: 'updateRotatePan', onPropertyChange: false});
        if (parent.isCropTab) {
            parent.panPoint.totalPannedInternalPoint.x = parent.img.destLeft - initialDestLeft;
            parent.panPoint.totalPannedInternalPoint.y = parent.img.destTop - initialDestTop;
        }
        const temp: string = this.lowerContext.filter;
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                                    parent.img.srcHeight, parent.img.destLeft, parent.img.destTop, parent.img.destWidth,
                                    parent.img.destHeight);
        parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: false }});
        parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: true, isRotatePan: true} });
        const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
        parent.img.destLeft += parent.panPoint.totalPannedClientPoint.x;
        parent.img.destTop += parent.panPoint.totalPannedClientPoint.y;
        parent.img.destLeft += parent.panPoint.currentPannedPoint.x;
        parent.img.destTop += parent.panPoint.currentPannedPoint.y;
        parent.panPoint.totalPannedClientPoint.x = parent.img.destLeft - destLeft; parent.panPoint.totalPannedClientPoint.y =
        parent.img.destTop - destTop;
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
        parent.notify('shape', { prop: 'panObjColl', onPropertyChange: false,
            value: {xDiff: parent.panPoint.currentPannedPoint.x, yDiff: parent.panPoint.currentPannedPoint.y, panRegion: ''}});
        parent.notify('freehand-draw', { prop: 'panFHDColl', onPropertyChange: false,
            value: {xDiff: parent.panPoint.currentPannedPoint.x, yDiff: parent.panPoint.currentPannedPoint.y, panRegion: ''}});
        this.lowerContext.filter = temp;
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.activeObj = extend({}, rotatePanActiveObj, {}, true) as SelectionPoint;
        if (!isNullOrUndefined(parent.activeObj.activePoint)) {
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: parent.activeObj, isCropRatio: null,
                points: null, isPreventDrag: true, saveContext: null, isPreventSelection: null} });
        }
        this.isReverseRotate = false;
    }

    private limitPan(): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.activePoint) {
            if (parent.img.destLeft > parent.activeObj.activePoint.startX) {
                parent.img.destLeft = parent.activeObj.activePoint.startX;
            }
            if (parent.img.destTop > parent.activeObj.activePoint.startY) {
                parent.img.destTop = parent.activeObj.activePoint.startY;
            }
            if (parent.img.destLeft + parent.img.destWidth < parent.activeObj.activePoint.endX) {
                parent.img.destLeft = parent.activeObj.activePoint.endX - parent.img.destWidth;
            }
            if (parent.img.destTop + parent.img.destHeight < parent.activeObj.activePoint.endY) {
                parent.img.destTop = parent.activeObj.activePoint.endY - parent.img.destHeight;
            }
        }
    }

    private updateFlipActiveObj(panRegion: string): void {
        const parent: ImageEditor = this.parent;
        if (panRegion === 'horizontal') {
            if (parent.activeObj.activePoint.startX > parent.lowerCanvas.width / 2) {
                parent.activeObj.activePoint.endX = (parent.lowerCanvas.width / 2) -
                    (parent.activeObj.activePoint.startX - (parent.lowerCanvas.width / 2));
            } else {
                parent.activeObj.activePoint.endX = (parent.lowerCanvas.width / 2) + ((parent.lowerCanvas.width / 2) -
                    parent.activeObj.activePoint.startX);
            }
            parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.width;
        } else if (panRegion === 'vertical') {
            if (parent.activeObj.activePoint.startX > parent.lowerCanvas.width / 2) {
                parent.activeObj.activePoint.endY = (parent.lowerCanvas.height / 2) -
                    (parent.activeObj.activePoint.startY - (parent.lowerCanvas.height / 2));
            } else {
                parent.activeObj.activePoint.endY = (parent.lowerCanvas.height / 2) +
                    ((parent.lowerCanvas.height / 2) - parent.activeObj.activePoint.startY);
            }
            parent.activeObj.activePoint.startY = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.height;
        } else if (panRegion === 'verticalHorizontal' || panRegion === 'horizontalVertical') {
            if (parent.activeObj.activePoint.startX > parent.lowerCanvas.width / 2) {
                parent.activeObj.activePoint.endX = (parent.lowerCanvas.width / 2) -
                    (parent.activeObj.activePoint.startX - (parent.lowerCanvas.width / 2));
                parent.activeObj.activePoint.endY = (parent.lowerCanvas.height / 2) -
                    (parent.activeObj.activePoint.startY - (parent.lowerCanvas.height / 2));
            }
            else {
                parent.activeObj.activePoint.endX = (parent.lowerCanvas.width / 2) + ((parent.lowerCanvas.width / 2) -
                    parent.activeObj.activePoint.startX);
                parent.activeObj.activePoint.endY = (parent.lowerCanvas.height / 2) +
                    ((parent.lowerCanvas.height / 2) - parent.activeObj.activePoint.startY);
            }
            parent.activeObj.activePoint.startX = parent.activeObj.activePoint.endX - parent.activeObj.activePoint.width;
            parent.activeObj.activePoint.startY = parent.activeObj.activePoint.endY - parent.activeObj.activePoint.height;
        }
        parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: parent.activeObj.activePoint, obj: parent.activeObj,
            isMouseMove: null, x: null, y: null}});
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
                for (let i: number = 0; i < (Math.abs(value) * 10); i++) {
                    parent.notify('draw', { prop: 'performPointZoom', onPropertyChange: false,
                        value: {x: zoomPoint.x, y: zoomPoint.y, type: type}});
                }
            }
        }
    }

    private getCurrentZoomFactor(zoomFactor: number): number {
        return (zoomFactor - this.prevZoomValue) * 0.1;
    }

    private setCurrPanRegion(region: string, type: number | string, obj: Object): void {
        let panRegion: string = region;
        if (region === '') {
            if (type === 'horizontal') {panRegion = 'horizontal'; }
            else if (type === 'vertical') {panRegion = 'vertical'; }
        } else if (region === 'horizontal') {
            if (type === 'horizontal') {panRegion = 'horizontalVertical'; }
            else if (type === 'vertical') {panRegion = 'verticalHorizontal'; }
            else if (type === 90) {panRegion = 'vertical'; }
            else if (type === -90) {panRegion = 'horizontal'; }
        } else if (region === 'vertical') {
            if (type === 'horizontal') {panRegion = 'horizontalVertical'; }
            else if (type === 'vertical') {panRegion = 'verticalHorizontal'; }
            else if (type === 90) {panRegion = 'horizontal'; }
            else if (type === -90) {panRegion = 'vertical'; }
        } else {
            if (type === 'horizontal') {panRegion = 'vertical'; }
            else if (type === 'vertical') {panRegion = 'horizontal'; }
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
        const parent: ImageEditor = this.parent; let toolbarHeight: number = 0;
        const canvasWrapper: HTMLElement = document.querySelector('#' + parent.element.id + '_canvasWrapper');
        if (!isNullOrUndefined(canvasWrapper)) {
            canvasWrapper.style.width = parent.element.offsetWidth - 2 + 'px';
        }
        parent.lowerCanvas.width = parent.upperCanvas.width = parent.element.offsetWidth - 2;
        if (!isNullOrUndefined(parent.toolbarTemplate)) {
            parent.notify('toolbar', { prop: 'setToolbarHeight', value: {height: 0 }});
        } else if (parent.element.querySelector('#' + parent.element.id + '_toolbar')) {
            toolbarHeight = parent.element.querySelector('#' + parent.element.id + '_toolbar').clientHeight;
            parent.notify('toolbar', { prop: 'setToolbarHeight', value: {height: toolbarHeight }});
        }
        if (Browser.isDevice) {
            if (!isNullOrUndefined(canvasWrapper)) {
                canvasWrapper.style.height = parent.element.offsetHeight - (2 * toolbarHeight) - 5 + 'px';
            }
            parent.lowerCanvas.height = parent.upperCanvas.height = parent.element.offsetHeight - (2 * toolbarHeight) - 5;
        } else {
            if (!isNullOrUndefined(canvasWrapper)) {
                canvasWrapper.style.height = parent.element.offsetHeight - toolbarHeight - 3 + 'px';
            }
            parent.lowerCanvas.height = parent.upperCanvas.height = parent.element.offsetHeight - toolbarHeight - 3;
        }
        this.lowerContext.filter =
            'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
            'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
        parent.notify('filter', { prop: 'setAdjustmentValue', onPropertyChange: false, value: {adjustmentValue: this.lowerContext.filter }});
        this.parent.canvasFilter = this.lowerContext.filter; this.parent.initialAdjustmentValue = this.lowerContext.filter;
        this.parent.clearContext(this.lowerContext); this.parent.clearContext(this.upperContext);
    }

    private calcMaxDimension(width: number, height: number, obj?: Object): Dimension {
        const object: Object = {toolbarHeight: 0 };
        if (!isBlazor()) {this.parent.notify('toolbar', { prop: 'getToolbarHeight', value: {obj: object }}); }
        else {object['toolbarHeight'] = this.parent.toolbarHeight; }
        let canvasMaxWidth: number = this.parent.element.clientWidth;
        let canvasMaxHeight: number = this.parent.element.clientHeight - object['toolbarHeight'];
        canvasMaxHeight = Browser.isDevice ? canvasMaxHeight - object['toolbarHeight'] : canvasMaxHeight;
        if (canvasMaxWidth > 30) {canvasMaxWidth -= 30; } if (canvasMaxHeight > 30) {canvasMaxHeight -= 30; }
        const widthScale: number = canvasMaxWidth / width; const heightScale: number = canvasMaxHeight / height;
        let cssMaxWidth: number = Math.min(width, canvasMaxWidth); let cssMaxHeight: number = Math.min(height, canvasMaxHeight);
        if (widthScale < 1 && widthScale < heightScale) {cssMaxWidth = width * widthScale; cssMaxHeight = height * widthScale; }
        else if (heightScale < 1 && heightScale < widthScale) {cssMaxWidth = width * heightScale; cssMaxHeight = height * heightScale; }
        if (!isNullOrUndefined(obj)) {obj['width'] = cssMaxWidth; obj['height'] = cssMaxHeight; }
        return {width: cssMaxWidth, height: cssMaxHeight};
    }

    private updatePanPoints(panRegion: string, obj?: Object): Point {
        const parent: ImageEditor = this.parent;
        const tempActObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        const tempDestLeft: number = parent.img.destLeft; const tempDestTop: number = parent.img.destTop;
        if (isNullOrUndefined(this.tempPanMove)) {this.tempPanMove = {x: this.panMove.x, y: this.panMove.y}; }
        let xDiff: number = this.panMove.x - this.tempPanMove.x; let yDiff: number = this.panMove.y - this.tempPanMove.y;
        switch (panRegion) {
        case '':
            parent.img.destLeft += xDiff; parent.img.destTop += yDiff;
            break;
        case 'horizontal':
            this.updateFlipActiveObj(panRegion);
            xDiff = this.tempPanMove.x - this.panMove.x;
            parent.img.destLeft += xDiff; parent.img.destTop += yDiff;
            break;
        case 'vertical':
            this.updateFlipActiveObj(panRegion);
            yDiff = this.tempPanMove.y - this.panMove.y;
            parent.img.destLeft += xDiff; parent.img.destTop += yDiff;
            break;
        case 'horizontalVertical':
            this.updateFlipActiveObj(panRegion);
            xDiff = this.tempPanMove.x - this.panMove.x;
            parent.img.destLeft += xDiff; parent.img.destTop -= yDiff;
            break;
        case 'verticalHorizontal':
            this.updateFlipActiveObj(panRegion);
            yDiff = this.tempPanMove.y - this.panMove.y;
            parent.img.destLeft -= xDiff; parent.img.destTop += yDiff;
            break;
        }
        this.limitPan(); parent.activeObj = tempActObj;
        if (!isNullOrUndefined(obj)) {
            obj['x'] = parent.img.destLeft - tempDestLeft; obj['y'] = parent.img.destTop - tempDestTop;
        }
        return {x: parent.img.destLeft - tempDestLeft, y: parent.img.destTop - tempDestTop};
    }
}
