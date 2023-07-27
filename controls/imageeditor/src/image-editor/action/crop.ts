import { extend, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ActivePoint, Dimension } from '@syncfusion/ej2-inputs';
import { CropEventArgs, CurrentObject, ImageEditor, Point, SelectionPoint } from '../index';

export class Crop {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private prevCropCurrObj: CurrentObject;
    private croppedDegree: number = 0; // Specifies the degree when crop is performed
    private cropDestPoints: ActivePoint = {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint; // To redraw old image when navigate to crop tab
    private tempFlipPanPoint: Point = {x: 0, y: 0};
    private isPreventScaling: boolean = false;
    private isInitCrop: boolean = false;

    constructor(parent: ImageEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on('crop', this.cropping, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('crop', this.cropping);
        this.parent.off('destroyed', this.destroy);
    }

    private cropping(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        this.updateCropPvtVar();
        switch (args.prop) {
        case 'cropImg':
            this.cropImg(args.value['isRotateCrop']);
            break;
        case 'cropCircle':
            this.cropCircle(args.value['context'], args.value['isSave'], args.value['isFlip']);
            break;
        case 'setCurrSelPoints':
            this.setCurrSelPoints(args.value['isSetDimension']);
            break;
        case 'updateRotatePan':
            this.updateRotatePan();
            break;
        case 'crop':
            this.crop(args.value['obj']);
            break;
        case 'calcRatio':
            this.calcRatio(args.value['obj'], args.value['dimension']);
            break;
        case 'isObjInImage':
            this.isObjInImage(args.value['obj'], args.value['object']);
            break;
        case 'getCurrFlipState':
            this.getCurrFlipState(args.value['panObj']);
            break;
        case 'setPreviousCropCurrentObj':
            this.prevCropCurrObj = args.value['obj'];
            break;
        case 'setCropDestPoints':
            this.cropDestPoints = args.value['point'];
            break;
        case 'getTempFlipPanPoint':
            args.value['obj']['point'] = this.tempFlipPanPoint;
            break;
        case 'setTempFlipPanPoint':
            if (isNullOrUndefined(args.value['isAdd'])) {
                this.tempFlipPanPoint = args.value['point'];
            } else {
                this.tempFlipPanPoint.x += args.value['point'].x;
                this.tempFlipPanPoint.y += args.value['point'].y;
            }
            break;
        case 'getPreventScaling':
            args.value['obj']['bool'] = this.isPreventScaling;
            break;
        case 'reset':
            this.reset();
            break;
        }
    }

    public getModuleName(): string {
        return 'crop';
    }

    private updateCropPvtVar(): void {
        const parent: ImageEditor = this.parent;
        if (parent.lowerCanvas) {this.lowerContext = parent.lowerCanvas.getContext('2d'); }
        if (parent.upperCanvas) {this.upperContext = parent.upperCanvas.getContext('2d'); }
    }

    private reset(): void {
        this.prevCropCurrObj = null; this.croppedDegree = 0;
        this.cropDestPoints = {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint;
        this.tempFlipPanPoint = {x: 0, y: 0}; this.isPreventScaling = false; this.isInitCrop = false;
    }

    private cropImg(isRotateCrop?: boolean): void {
        const parent: ImageEditor = this.parent; const isNullCrop: boolean = isNullOrUndefined(isRotateCrop);
        const actPoint: ActivePoint = parent.activeObj.activePoint;
        parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
        if (isNullCrop) {
            this.croppedDegree = parent.transform.degree;
        }
        if (isNullCrop && parent.transform.degree !== 0) {
            this.updateCropObj();
            const point: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                height: parent.img.destHeight};
            parent.notify('transform', { prop: 'setCurrDestinationPoint', onPropertyChange: false, value: {point: point }});
            this.rotateCrop();
        } else if (isNullCrop && parent.transform.currFlipState !== '') {
            this.updateCropObj();
            const point: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                height: parent.img.destHeight};
            parent.notify('transform', { prop: 'setCurrDestinationPoint', onPropertyChange: false, value: {point: point }});
            this.flipCrop();
        } else {
            parent.notify('draw', { prop: 'setTempZoomFactor', onPropertyChange: false, value: {tempZoomFactor: parent.transform.zoomFactor }});
            const ratio: Dimension = this.calcRatio();
            if (isNullCrop || !isRotateCrop) { // isRotateCrop is NULL or False
                this.updateCropObj();
                parent.notify('draw', { prop: 'resetPanPoints', onPropertyChange: false});
                parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
                const point: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                    height: parent.img.destHeight};
                parent.notify('transform', { prop: 'setCurrDestinationPoint', onPropertyChange: false, value: {point: point }});
                parent.currSelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                this.cropDestPoints = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                    height: parent.img.destHeight};
            }
            const obj: Object = {width: 0, height: 0 };
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
                value: {width: actPoint.width * ratio.width,
                    height: actPoint.height * ratio.height, obj: obj}});
            const maxDimension: Dimension = obj as Dimension;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
            parent.img.srcLeft = (actPoint.startX * ratio.width) - (parent.img.destLeft * ratio.width);
            parent.img.srcTop = (actPoint.startY * ratio.height) - (parent.img.destTop * ratio.height);
            parent.img.srcWidth = (actPoint.width * ratio.width);
            parent.img.srcHeight = (actPoint.height * ratio.height);
            parent.img.destLeft = (parent.lowerCanvas.clientWidth - maxDimension.width) / 2;
            parent.img.destTop = (parent.lowerCanvas.clientHeight - maxDimension.height) / 2;
            parent.img.destWidth = maxDimension.width;
            parent.img.destHeight = maxDimension.height;
            const temp: string = this.lowerContext.filter;
            parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
            this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                        parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
            this.lowerContext.filter = 'none';
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            this.cropObjColl();
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                if (this.isObjInImage(parent.objColl[i as number])) {
                    parent.notify('shape', { prop: 'apply', onPropertyChange: false,
                        value: {shape: parent.objColl[i as number].shape, obj: parent.objColl[i as number], canvas: null}});
                    parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                }
            }
            parent.activeObj = activeObj;
            this.cropFreehandDrawColl();
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
            if (parent.currSelectionPoint.shape === 'crop-circle') {this.cropCircle(this.lowerContext); }
            else {parent.isCircleCrop = false; }
            this.lowerContext.filter = temp;
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.currObjType.isCustomCrop = false;
            parent.pan(false);
            parent.transform.defaultZoomFactor = 0;
        }
    }

    private updateCropObj(): void {
        this.parent.afterCropActions = [];
        const object: Object = {currObj: {} as CurrentObject };
        this.parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const obj: CurrentObject = object['currObj'];
        this.parent.cropObj = extend({}, obj, {}, true) as CurrentObject;
    }

    private rotateCrop(): void {
        const parent: ImageEditor = this.parent;
        const shape: string = parent.activeObj.shape || '';
        parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
        parent.currSelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        parent.objColl.push(parent.activeObj);
        parent.activeObj = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
        let activeObj: SelectionPoint = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
        const tempCurrSelObj: SelectionPoint = extend({}, parent.currSelectionPoint, {}, true) as SelectionPoint;
        const preventSelObj: Object = {bool: null };
        parent.notify('transform', { prop: 'getPreventSelect', onPropertyChange: false, value: {obj: preventSelObj }});
        parent.notify('transform', { prop: 'setPreventSelect', onPropertyChange: false, value: {bool: true }});
        const coll: string[] | number[] = extend([], parent.rotateFlipColl, [], true) as string[] | number[];
        this.panToSelRangle(true);
        this.resetZoom();
        const afterCropActions: string[] = extend([], parent.afterCropActions, [], true) as string[];
        this.revertTransform('initial', coll);
        activeObj = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: activeObj}});
        parent.objColl.pop(); parent.transform.degree = 0; this.cropImg(true);
        this.revertTransform('reverse', coll);
        parent.afterCropActions = afterCropActions;
        parent.currSelectionPoint = tempCurrSelObj;
        parent.notify('transform', { prop: 'setPreventSelect', onPropertyChange: false, value: {bool: preventSelObj['bool'] }});
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
        if (shape === 'crop-circle') {this.cropCircle(this.lowerContext); }
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.notify('draw', { prop: 'resetPanPoints', onPropertyChange: false});
    }

    private revertTransform(type: string, coll: string[] | number[]): void {
        const parent: ImageEditor = this.parent;
        const obj: Object = {isRotate: false };
        if (type === 'initial') {
            for (let i: number = coll.length - 1; i >= 0; i--) {
                switch (coll[i as number]) {
                case 90:
                    parent.notify('transform', {prop: 'rotate', value: {degree: -90, obj: obj}});
                    break;
                case -90:
                    parent.notify('transform', {prop: 'rotate', value: {degree: 90, obj: obj}});
                    break;
                default:
                    parent.notify('transform', {prop: 'flipImage', value: {direction: parent.toPascalCase(coll[i as number] as string)}});
                    break;
                }
            }
        } else {
            for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                parent.objColl[i as number].shapeFlip = '';
            }
            for (let i: number = 0; i < parent.freehandCounter; i++) {
                parent.pointColl[i as number].shapeFlip = '';
            }
            for (let i: number = 0, len: number = coll.length; i < len; i++) {
                switch (coll[i as number]) {
                case 90:
                    parent.notify('transform', {prop: 'rotate', value: {degree: 90, obj: obj}});
                    break;
                case -90:
                    parent.notify('transform', {prop: 'rotate', value: {degree: -90, obj: obj}});
                    break;
                default:
                    parent.notify('transform', {prop: 'flipImage', value: {direction: parent.toPascalCase(coll[i as number] as string)}});
                    break;
                }
            }
        }
    }

    private resetZoom(): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.zoomFactor > 0) {
            const zoomFactor: number = parent.transform.zoomFactor;
            const isUndoRedo: boolean = parent.isUndoRedo;
            for (let i: number = 0; i < (zoomFactor * 10); i++) {
                parent.isUndoRedo = true;
                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                    value: {zoomFactor: -0.1, zoomPoint: null}});
            }
            parent.isUndoRedo = isUndoRedo;
            parent.notify('draw', { prop: 'resetPanPoints', onPropertyChange: false});
        }
    }

    private flipCrop(): void {
        const parent: ImageEditor = this.parent;
        parent.notify('transform', { prop: 'setReverseFlip', onPropertyChange: false, value: {isReverseFlip: true }});
        parent.panPoint.totalPannedPoint.x += this.tempFlipPanPoint.x;
        parent.panPoint.totalPannedPoint.y += this.tempFlipPanPoint.y;
        const tempCurrFlipState: string = parent.transform.currFlipState;
        const obj: Object = {flipColl: null };
        parent.notify('transform', { prop: 'getFlipColl', onPropertyChange: false, value: {obj: obj }});
        const tempFlipColl: string[] = obj['flipColl'];
        parent.notify('transform', { prop: 'setFlipColl', onPropertyChange: false, value: {flipColl: [] }});
        parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
        parent.objColl.push(parent.activeObj);
        this.resetZoom();
        parent.currSelectionPoint = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        const temp: string = this.lowerContext.filter;
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            parent.objColl[i as number].shapeFlip = '';
        }
        for (let i: number = 0; i < parent.freehandCounter; i++) {
            parent.pointColl[i as number].shapeFlip = '';
        }
        parent.notify('shape', { prop: 'redrawObj', onPropertyChange: false, value: {degree: this.getCurrFlipState()}});
        parent.notify('freehand-draw', { prop: 'flipFHDColl', onPropertyChange: false,
            value: {value: this.getCurrFlipState()}});
        parent.activeObj = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
        parent.objColl.pop();
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate'}});
        this.cropImg(true);
        parent.notify('transform', { prop: 'setReverseRotate', onPropertyChange: false, value: {bool: true}});
        this.lowerContext.setTransform(1, 0, 0, 1, 0, 0);
        parent.notify('draw', { prop: 'setDestPoints', onPropertyChange: false});
        parent.notify('draw', { prop: 'currTransState', onPropertyChange: false,
            value: {type: 'initial', isPreventDestination: null, context: null, isPreventCircleCrop: null} });
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
        this.lowerContext.filter = temp;
        parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: false }});
        parent.notify('draw', { prop: 'currTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: null, context: null, isPreventCircleCrop: null} });
        parent.transform.currFlipState = tempCurrFlipState;
        parent.notify('transform', { prop: 'setFlipColl', onPropertyChange: false, value: {flipColl: tempFlipColl }});
        this.lowerContext.filter = 'none';
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            parent.objColl[i as number].shapeFlip = '';
        }
        for (let i: number = 0; i < parent.freehandCounter; i++) {
            parent.pointColl[i as number].shapeFlip = '';
        }
        parent.notify('shape', { prop: 'redrawObj', onPropertyChange: false, value: {degree: this.getCurrFlipState()}});
        parent.notify('freehand-draw', { prop: 'flipFHDColl', onPropertyChange: false,
            value: {value: this.getCurrFlipState()}});
        parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
        parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
        this.lowerContext.filter = temp;
        if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
            this.cropCircle(this.lowerContext);
        }
        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.notify('transform', { prop: 'setReverseFlip', onPropertyChange: false, value: {isReverseFlip: false }});
        parent.notify('draw', { prop: 'resetPanPoints', onPropertyChange: false});
        this.tempFlipPanPoint = {x: 0, y: 0};
    }

    private cropObjColl(): void {
        const parent: ImageEditor = this.parent;
        let point: ActivePoint; let activePoint: ActivePoint; let shape: string;
        if (parent.objColl.length > 0) {
            for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                point = parent.objColl[i as number].activePoint;
                activePoint = parent.activeObj.activePoint;
                shape = parent.objColl[i as number].shape;
                parent.objColl[i as number].imageRatio = {startX: ((point.startX - activePoint.startX) / activePoint.width),
                    startY: ((point.startY - activePoint.startY) / activePoint.height),
                    endX: ((point.endX - activePoint.startX) / activePoint.width),
                    endY: ((point.endY - activePoint.startY) / activePoint.height),
                    width: activePoint.width / point.width,
                    height: activePoint.height / point.height };
                let degree: number; let size: number;
                switch (shape) {
                case 'text':
                    if (parent.objColl[i as number].shapeDegree === 0) {degree = this.parent.transform.degree; }
                    else {degree =  this.parent.transform.degree - parent.objColl[i as number].shapeDegree; }
                    size = (degree === 0 || Math.abs(degree) === 180) ? point.width : point.height;
                    parent.objColl[i as number].textSettings.fontRatio = size / parent.objColl[i as number].textSettings.fontSize;
                    break;
                case 'line':
                case 'arrow':
                    this.cropPointCollection(i);
                    if (shape === 'arrow') {
                        parent.notify('shape', { prop: 'updateArrowRatio', onPropertyChange: false, value: {obj: parent.objColl[i as number] }});
                    }
                    break;
                case 'path':
                    this.cropPointCollection(i);
                    break;
                }
            }
        }
    }

    private cropPointCollection(i: number): void {
        const parent: ImageEditor = this.parent;
        const shape: string = parent.objColl[i as number].shape;
        let x: number; let y: number; let width: number; let height: number;
        const point: ActivePoint = parent.activeObj.activePoint;
        if (shape === 'path') {
            x = point.startX;
            y = point.startY;
            width = point.width;
            height = point.height;
        } else {
            x = parent.img.destLeft;
            y = parent.img.destTop;
            width = parent.img.destWidth;
            height = parent.img.destHeight;
        }
        const selPoint: SelectionPoint = parent.objColl[i as number];
        for (let n: number = 0, len: number = selPoint.pointColl.length; n < len; n++) {
            selPoint.pointColl[n as number].ratioX =
                (selPoint.pointColl[n as number].x - x) / width;
            selPoint.pointColl[n as number].ratioY =
                (selPoint.pointColl[n as number].y - y) / height;
        }
    }

    private cropFreehandDrawColl(): void {
        const parent: ImageEditor = this.parent;
        // Update crop values to point collection
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
            parent.notify('freehand-draw', { prop: 'setPointCounter', onPropertyChange: false, value: {value: 0 }});
            const len: number = parent.points.length;
            for (let l: number = 0; l < len; l++) {
                parent.points[l as number].ratioX = (parent.points[l as number].x -
                                                   parent.activeObj.activePoint.startX) / parent.activeObj.activePoint.width;
                parent.points[l as number].ratioY = (parent.points[l as number].y -
                                                   parent.activeObj.activePoint.startY) / parent.activeObj.activePoint.height;
            }
        }
        parent.notify('freehand-draw', { prop: 'updateCropPtsForSel', onPropertyChange: false});
    }

    private setCurrSelPoints(isSetDimension?: boolean): void {
        const parent: ImageEditor = this.parent;
        const destPoint: ActivePoint = this.cropDestPoints;
        const filter: string = this.lowerContext.filter;
        parent.img.srcLeft = 0; parent.img.srcTop = 0;
        parent.img.srcWidth = parent.baseImg.width; parent.img.srcHeight = parent.baseImg.height;
        parent.img.destLeft = destPoint.startX; parent.img.destTop = destPoint.startY;
        parent.img.destWidth = destPoint.width; parent.img.destHeight = destPoint.height;
        this.lowerContext.clearRect(0, 0 , parent.lowerCanvas.width, parent.lowerCanvas.height);
        if (isSetDimension) {
            parent.notify('draw', { prop: 'setDestPoints', onPropertyChange: false});
        }
        parent.notify('draw', { prop: 'currTransState', onPropertyChange: false,
            value: {type: 'initial', isPreventDestination: null, context: null, isPreventCircleCrop: null} });
        if (this.croppedDegree === 0 && parent.transform.degree === 0 && parent.currSelectionPoint
        && parent.currSelectionPoint.shape !== 'crop-circle' && parent.currSelectionPoint.shape !== 'crop-square') {
            parent.img.destLeft = destPoint.startX; parent.img.destTop = destPoint.startY;
            parent.img.destWidth = destPoint.width; parent.img.destHeight = destPoint.height;
        }
        if (parent.transform.degree === 0) {
            parent.img.destLeft += parent.panPoint.totalPannedInternalPoint.x;
            parent.img.destTop += parent.panPoint.totalPannedInternalPoint.y;
        }
        parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
        this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth, parent.img.srcHeight,
                                    parent.img.destLeft, parent.img.destTop, parent.img.destWidth, parent.img.destHeight);
        this.lowerContext.filter = filter;
        parent.notify('draw', { prop: 'currTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: null, context: null, isPreventCircleCrop: true} });
        let cropObjColl: SelectionPoint[] = extend([], parent.objColl, null, true) as SelectionPoint[];
        let cropPointColl: Point[] = extend([], parent.pointColl, null, true) as Point[];
        parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
        this.panToSelRangle();
        parent.objColl = cropObjColl; parent.pointColl = cropPointColl; parent.freehandCounter = parent.pointColl.length;
        if (parent.cropObj.activeObj.shape) {
            const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop, width: parent.img.destWidth,
                height: parent.img.destHeight};
            if (parent.currSelectionPoint && parent.currSelectionPoint.activePoint) {
                parent.img.destLeft = parent.currSelectionPoint.activePoint.startX;
                parent.img.destTop = parent.currSelectionPoint.activePoint.startY;
                parent.img.destWidth = parent.currSelectionPoint.activePoint.width;
                parent.img.destHeight = parent.currSelectionPoint.activePoint.height;
            }
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
            parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
            cropObjColl = extend([], parent.objColl, null, true) as SelectionPoint[];
            cropPointColl = extend([], parent.pointColl, null, true) as Point[];
            parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
            const object: Object = {selPointColl: null };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                value: {obj: object }});
            const cropSelPointColl: Point[] = object['selPointColl'];
            parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                value: {obj: {selPointColl: [] } }});
            parent.cropObj.filter = this.lowerContext.filter;
            const actObj: SelectionPoint = extend({}, parent.currSelectionPoint, null, true) as SelectionPoint;
            parent.notify('draw', { prop: 'setCurrentObj', onPropertyChange: false, value: {obj: null}});
            parent.activeObj = extend({}, actObj, null, true) as SelectionPoint;
            const activeObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            this.panToSelRangle();
            parent.objColl = cropObjColl; parent.pointColl = cropPointColl; parent.freehandCounter = parent.pointColl.length;
            parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                value: {obj: {selPointColl: cropSelPointColl } }});
            parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.currSelectionPoint = null;
            if (parent.transform.degree === 0) {
                parent.notify('transform', { prop: 'drawPannImage', onPropertyChange: false,
                    value: {point: {x: 0, y: 0}}});
            }
            parent.activeObj = activeObj;
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate'} });
            parent.notify('transform', { prop: 'setTempPanMove', onPropertyChange: false,
                value: {point: null }});
            if (!this.isInitCrop && parent.transform.degree === 0 && parent.cropObj.currFlipState !== '' &&
                parent.cropObj.cropZoom !==  0) {
                this.isInitCrop = true;
                parent.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null}});
                parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'croptransform',
                    isApplyBtn: false, isCropping: null, isZooming: null, cType: null}});
            } else {this.isInitCrop = false; }
        } else {
            const temp: string = this.lowerContext.filter;
            this.lowerContext.filter = 'none';
            parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
            this.lowerContext.filter = temp;
            parent.currSelectionPoint = null;
        }
    }

    private panToSelRangle(isReverse?: boolean): void {
        const parent: ImageEditor = this.parent;
        const obj: SelectionPoint = extend({}, parent.currSelectionPoint, null, true) as SelectionPoint;
        parent.currSelectionPoint = null;
        const panX: number = parent.transform.degree !== 0 ?
            isReverse ? -parent.cropObj.totalPannedClientPoint.x : parent.cropObj.totalPannedClientPoint.x : 0;
        const panY: number = parent.transform.degree !== 0 ?
            isReverse ? -parent.cropObj.totalPannedClientPoint.y : parent.cropObj.totalPannedClientPoint.y : 0;
        if (parent.transform.degree !== 0) {
            parent.panPoint.currentPannedPoint = { x: panX, y: panY };
            parent.notify('transform', { prop: 'drawPannedImage', value: { xDiff: panX, yDiff: panY } });
            parent.panPoint.currentPannedPoint = { x: 0, y: 0 };
        }
        parent.currSelectionPoint = obj;
    }

    private cropCircle(context: CanvasRenderingContext2D, isSave?: boolean, isFlip?: boolean): void {
        const parent: ImageEditor = this.parent;
        if (isFlip && parent.transform.currFlipState !== '') {
            parent.notify('draw', { prop: 'setTransform', onPropertyChange: false,
                value: {context: context, value: parent.transform.currFlipState, isReverse: null}});
        }
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        const centerX: number = isNullOrUndefined(isSave) ? parent.img.destLeft + (parent.img.destWidth / 2) : context.canvas.width / 2;
        const centerY: number = isNullOrUndefined(isSave) ? parent.img.destTop + (parent.img.destHeight / 2) : context.canvas.height / 2;
        const radius: number = isSave ? context.canvas.width / 2 : parent.img.destWidth / 2;
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.closePath(); context.fill(); context.restore();
        context.globalCompositeOperation = 'source-over';
        parent.currObjType.isActiveObj = parent.isCircleCrop = true;
        if (isFlip && parent.transform.currFlipState !== '') {
            parent.notify('draw', { prop: 'setTransform', onPropertyChange: false,
                value: {context: context, value: parent.transform.currFlipState, isReverse: null}});
        }
    }

    private getCurrCropState(type: string, isAllowInvert?: boolean): string {
        const parent: ImageEditor = this.parent; let flipState: string = '';
        const state: string[] = []; const obj: Object = {flipColl: null };
        parent.notify('transform', { prop: 'getFlipColl', onPropertyChange: false, value: {obj: obj }});
        if (type === 'initial') {
            if (Math.abs(parent.transform.degree) === 180) {
                flipState = obj['flipColl'].length > 1 ? this.getCurrFlipState() : parent.transform.currFlipState;
            } else {
                for (let i: number = 0, len: number = parent.rotateFlipColl.length; i < len; i++) {
                    if (typeof(parent.rotateFlipColl[i as number]) === 'number') {state.push('number'); }
                    else if (typeof(parent.rotateFlipColl[i as number]) === 'string') {state.push('string'); }
                }
                if (state.length > 1 && state[state.length - 1] === 'string' && state[state.length - 2] === 'number') {
                    if (parent.transform.currFlipState === 'horizontal') {flipState = 'vertical'; }
                    else if (parent.transform.currFlipState === 'vertical') {flipState = 'horizontal'; }
                } else if (state.length > 1 && state[state.length - 1] === 'number' && state[state.length - 2] === 'string') {
                    flipState = obj['flipColl'].length > 1 ? this.getCurrFlipState() : parent.transform.currFlipState;
                }
            }
        } else {
            flipState = this.getCurrFlipState();
            if (isAllowInvert || !this.isInitialRotate()) {
                if (parent.transform.degree === -90 || parent.transform.degree === -270) {
                    if (flipState === 'horizontal') {flipState = 'vertical'; }
                    else if (flipState === 'vertical') {flipState = 'horizontal'; }
                }
            }
        }
        if (flipState === '') {flipState = obj['flipColl'].length > 1 ? this.getCurrFlipState() : parent.transform.currFlipState; }
        return flipState;
    }

    private isInitialRotate(): boolean {
        let isRotate: boolean = false;
        if (this.parent.rotateFlipColl.length > 0 && typeof(this.parent.rotateFlipColl[0]) === 'number') {
            isRotate = true;
        }
        return isRotate;
    }

    private updateRotatePan(): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.panPoint.currentPannedPoint)) {
            return;
        }
        let panRegion: string = '';
        if (parent.rotateFlipColl.length > 0 && typeof(parent.rotateFlipColl[0]) === 'number'
            && parent.transform.degree < 0) {
            panRegion = this.getCurrCropState('reverse', true);
        } else {
            panRegion = this.getCurrFlipState();
        }
        if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
            if (parent.transform.degree === 90 || (parent.transform.degree === -90 &&
                (panRegion === 'horizontal' || panRegion === 'vertical'))
                || (parent.transform.degree === -270 && (panRegion === '' || panRegion === 'verticalHorizontal'
                || panRegion === 'horizontalVertical'))) {
                if (panRegion === 'horizontal' || panRegion === '') {
                    parent.img.destLeft += parent.panPoint.currentPannedPoint.y;
                } else {
                    parent.img.destLeft -= parent.panPoint.currentPannedPoint.y;
                }
                if (panRegion === '' || panRegion === 'vertical') {
                    parent.img.destTop -= parent.panPoint.currentPannedPoint.x;
                } else {
                    parent.img.destTop += parent.panPoint.currentPannedPoint.x;
                }
            }
            else if (parent.transform.degree === 270 || (parent.transform.degree === -270 &&
                (panRegion === 'horizontal' || panRegion === 'vertical'))
                || (parent.transform.degree === -90 && (panRegion === '' || panRegion === 'verticalHorizontal'
                || panRegion === 'horizontalVertical'))) {
                if (panRegion === '' || panRegion === 'horizontal') {
                    parent.img.destLeft -= parent.panPoint.currentPannedPoint.y;
                } else {
                    parent.img.destLeft += parent.panPoint.currentPannedPoint.y;
                }
                if (panRegion === '' || panRegion === 'vertical') {
                    parent.img.destTop += parent.panPoint.currentPannedPoint.x;
                } else {
                    parent.img.destTop -= parent.panPoint.currentPannedPoint.x;
                }
            }
        } else {
            if (parent.transform.degree === 180 || parent.transform.degree === -180) {
                if (panRegion === '' || panRegion === 'vertical') {
                    parent.img.destLeft -= parent.panPoint.currentPannedPoint.x;
                } else {
                    parent.img.destLeft += parent.panPoint.currentPannedPoint.x;
                }
                if (panRegion === '' || panRegion === 'horizontal') {
                    parent.img.destTop -= parent.panPoint.currentPannedPoint.y;
                } else {
                    parent.img.destTop += parent.panPoint.currentPannedPoint.y;
                }
            }
        }
    }

    private crop(obj: Object): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            const object: Object = {isCropToolbar: parent.isCropToolbar };
            if (parent.currObjType.isUndoAction && !object['isCropToolbar']) {
                parent.notify('undo-redo', {prop: 'refreshUrc', value: {bool: null }});
            }
            const transitionArgs: CropEventArgs = {cancel: false, startPoint: { x: parent.activeObj.activePoint.startX,
                y: parent.activeObj.activePoint.startY }, endPoint: {x: parent.activeObj.activePoint.endX,
                y: parent.activeObj.activePoint.endY }, preventScaling: false };
            if (!object['isCropToolbar'] && isBlazor() && parent.events && parent.events.cropping.hasDelegate === true) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                (parent.dotNetRef.invokeMethodAsync('CropEventAsync', 'OnCrop', transitionArgs) as any).then((args: CropEventArgs) => {
                    this.cropEvent(args, obj, object);
                });
            } else {
                if (!object['isCropToolbar']) {parent.trigger('cropping', transitionArgs); }
                this.cropEvent(transitionArgs, obj, object);
            }
        }
    }

    private cropEvent(transitionArgs: CropEventArgs, obj: Object, object: Object): void {
        const parent: ImageEditor = this.parent;
        let splitWords: string[];
        if (!transitionArgs.cancel) {
            splitWords = parent.activeObj.shape ? parent.activeObj.shape.split('-') : [];
            if (!parent.disabled && parent.activeObj.horTopLine && (parent.currObjType.isCustomCrop || (splitWords.length > 0 &&
                splitWords[0] === 'crop'))) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (obj as any).isCrop = true;
                const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
                const prevObj: CurrentObject = extend({}, this.prevCropCurrObj, {}, true) as CurrentObject;
                if (transitionArgs.preventScaling) {this.isPreventScaling = true; }
                else {this.isPreventScaling = false; }
                this.cropImg();
                parent.transform.zoomFactor = 0;
                parent.setProperties({zoomSettings: { zoomFactor: 1}}, true);
                parent.notify('transform', { prop: 'setPreviousZoomValue', onPropertyChange: false,
                    value: { previousZoomValue: parent.zoomSettings.zoomFactor } });
                const currSelPtObj: Object = {prevCurrSelectionPoint: this.parent.prevCurrSelectionPoint };
                prevObj.currSelectionPoint = extend({}, currSelPtObj['prevCurrSelectionPoint'], {}, true) as SelectionPoint;
                parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                    value: {operation: 'crop', previousObj: prevObj, previousObjColl: prevObj.objColl,
                        previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                        previousCropObj: prevCropObj, previousText: null,
                        currentText: null, previousFilter: null, isCircleCrop: parent.isCircleCrop}});
                if (!object['isCropToolbar']) {
                    parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
                }
                parent.notify('transform', { prop: 'setCropDimension', onPropertyChange: false,
                    value: {width: parent.cropObj.destPoints.width, height: parent.cropObj.destPoints.height }});
                if (!isBlazor() && !object['isCropToolbar']) {
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'main',
                        isApplyBtn: false, isCropping: false, isZooming: null, cType: null}});
                } else if (!object['isCropToolbar']) {
                    this.parent.updateToolbar(this.parent.element, 'imageLoaded');
                }
            }
        }
    }

    private calcRatio(obj?: Object, dimension?: Dimension): Dimension {
        const parent: ImageEditor = this.parent;
        let widthRatio: number; let heightRatio: number;
        if (parent.transform.degree === 0 || parent.transform.degree % 180 === 0) {
            widthRatio = (dimension ? dimension.width : parent.baseImg.width) / parent.img.destWidth;
            heightRatio = (dimension ? dimension.height : parent.baseImg.height) / parent.img.destHeight;
        } else {
            widthRatio = (dimension ? dimension.height : parent.baseImg.height) / parent.img.destWidth;
            heightRatio = (dimension ? dimension.width : parent.baseImg.width) / parent.img.destHeight;
        }
        if (obj) { obj['width'] = widthRatio; obj['height'] = heightRatio; }
        return {width: widthRatio, height: heightRatio};
    }

    private isObjInImage(obj: SelectionPoint, dummyObj?: Object): boolean {
        const parent: ImageEditor = this.parent;
        let isInside: boolean = false;
        const startX: number = obj.activePoint.startX;
        const endX: number = obj.activePoint.endX;
        const startY: number = obj.activePoint.startY;
        const endY: number = obj.activePoint.endY;
        if ((startX >= parent.img.destLeft && endX <= (parent.img.destLeft + parent.img.destWidth)) ||
            (startX <= parent.img.destLeft && endX >= parent.img.destLeft) ||
            (startX <= (parent.img.destLeft + parent.img.destWidth) && endX >= (parent.img.destLeft + parent.img.destWidth)) ||
            (startY >= parent.img.destTop && endY <= (parent.img.destTop + parent.img.destHeight)) ||
            (startY <= parent.img.destTop && endY >= parent.img.destTop) ||
            (startY <= (parent.img.destTop + parent.img.destHeight) && endY >= (parent.img.destTop + parent.img.destHeight))
        ) { isInside = true; }
        if (dummyObj) { dummyObj['isInside'] = isInside; }
        return isInside;
    }

    private getCurrFlipState(panObj?: Object): string {
        const parent: ImageEditor = this.parent;
        const obj: Object = {panRegion: ''};
        const object: Object = {collection: parent.rotateFlipColl};
        parent.notify('shape', { prop: 'alignRotateFlipColl', onPropertyChange: false,
            value: {collection: parent.rotateFlipColl, isRotateFlipCollection: true, obj: object }});
        parent.rotateFlipColl = object['collection'];
        for (let i: number = 0, len: number = parent.rotateFlipColl.length; i < len; i++) {
            parent.notify('transform', { prop: 'setCurrPanRegion', onPropertyChange: false,
                value: {region: obj['panRegion'], type: parent.rotateFlipColl[i as number], obj: obj }});
        }
        if (panObj) { panObj['panRegion'] = obj['panRegion']; }
        return obj['panRegion'];
    }
}
