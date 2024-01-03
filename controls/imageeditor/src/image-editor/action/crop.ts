import { Browser, extend, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ActivePoint, Dimension } from '@syncfusion/ej2-inputs';
import { CropEventArgs, CurrentObject, ImageEditor, Point, SelectionPoint, ImageDimension } from '../index';

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
    private isTransformCrop: boolean = false;

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
        case 'getPreviousCropCurrentObj':
            args.value['obj']['prevObj'] = this.prevCropCurrObj;
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
        case 'adjustStraightenForShapes':
            this.adjustStraightenForShapes(args.value['type'], args.value['isInitialRotated']);
            break;
        case 'resizeWrapper':
            this.resizeWrapper();
            break;
        case 'setTransformCrop':
            this.isTransformCrop = args.value['bool'];
            break;
        case 'setInitCrop':
            this.isInitCrop = args.value['bool'];
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
        this.isTransformCrop = false;
    }

    private cropImg(isRotateCrop?: boolean): void {
        const parent: ImageEditor = this.parent; const isNullCrop: boolean = isNullOrUndefined(isRotateCrop);
        const resizeIcon: HTMLInputElement = (parent.element.querySelector('#' + parent.element.id + '_nonaspectratio') as HTMLInputElement);
        const actPoint: ActivePoint = parent.activeObj.activePoint; const img: ImageDimension = parent.img; let isRotated: boolean = false;
        for (let i: number = 0, len: number = parent.rotateFlipColl.length; i < len; i++) {
            const currentValue: number = parent.rotateFlipColl[i as number];
            if (currentValue === 90 || currentValue === -90) {
                isRotated = true;
            }
        }
        parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
        if (isNullCrop || resizeIcon) {
            this.croppedDegree = parent.transform.degree;
        }
        if (isNullCrop && (parent.transform.degree !== 0) || isRotated) {
            this.updateCropObj();
            const point: ActivePoint = {startX: img.destLeft, startY: img.destTop, width: img.destWidth, height: img.destHeight};
            parent.notify('transform', { prop: 'setCurrDestinationPoint', onPropertyChange: false, value: {point: point }});
            this.rotateCrop();
        } else if (isNullCrop && parent.transform.currFlipState !== '') {
            this.updateCropObj();
            const point: ActivePoint = {startX: img.destLeft, startY: img.destTop, width: img.destWidth, height: img.destHeight};
            parent.notify('transform', { prop: 'setCurrDestinationPoint', onPropertyChange: false, value: {point: point }});
            this.flipCrop();
        } else {
            this.adjustStraightenForShapes('initial', false);
            parent.notify('draw', { prop: 'setTempZoomFactor', onPropertyChange: false, value: {tempZoomFactor: parent.transform.zoomFactor }});
            const ratio: Dimension = this.calcRatio();
            if (isNullCrop || !isRotateCrop) { // isRotateCrop is NULL or False
                this.updateCropObj();
                parent.notify('draw', { prop: 'resetPanPoints', onPropertyChange: false});
                parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
                const point: ActivePoint = {startX: img.destLeft, startY: img.destTop, width: img.destWidth, height: img.destHeight};
                parent.notify('transform', { prop: 'setCurrDestinationPoint', onPropertyChange: false, value: {point: point }});
                parent.currSelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                this.cropDestPoints = {startX: img.destLeft, startY: img.destTop, width: img.destWidth, height: img.destHeight};
            }
            const obj: Object = {width: 0, height: 0 };
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false, value: {width: actPoint.width * ratio.width,
                height: actPoint.height * ratio.height, obj: obj, isImgShape: null }});
            const maxDimension: Dimension = obj as Dimension;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
            parent.img = { srcLeft: (actPoint.startX * ratio.width) - (img.destLeft * ratio.width),
                srcTop: (actPoint.startY * ratio.height) - (img.destTop * ratio.height),
                srcWidth: (actPoint.width * ratio.width), srcHeight: (actPoint.height * ratio.height),
                destLeft: (parent.lowerCanvas.clientWidth - maxDimension.width) / 2,
                destTop: (parent.lowerCanvas.clientHeight - maxDimension.height + 1) / 2,
                destWidth: maxDimension.width, destHeight: maxDimension.height };
            const temp: string = this.lowerContext.filter;
            parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
            this.lowerContext.filter = 'none';
            const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            this.cropObjColl();
            parent.transform.straighten = 0;
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
            for (let i: number = 0, len: number = objColl.length; i < len; i++) {
                if (this.isObjInImage(objColl[i as number])) {
                    parent.notify('shape', { prop: 'apply', onPropertyChange: false,
                        value: {shape: objColl[i as number].shape, obj: objColl[i as number], canvas: null}});
                    parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                }
            }
            parent.activeObj = activeObj;
            this.cropFreehandDrawColl();
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
            if (parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') {this.cropCircle(this.lowerContext); }
            else {parent.isCircleCrop = false; }
            this.lowerContext.filter = temp;
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.currObjType.isCustomCrop = false;
            parent.pan(false);
            parent.transform.defaultZoomFactor = 0;
        }
    }

    private adjustStraightenForShapes(type: string, isInitialRotated: boolean): void {
        const parent: ImageEditor = this.parent;
        const center: Point = {
            x: parent.img.destLeft + parent.img.destWidth / 2,
            y: parent.img.destTop + parent.img.destHeight / 2
        };
        for (const obj of parent.objColl) {
            if (['rectangle', 'ellipse', 'text', 'image'].indexOf(obj.shape) !== -1) {
                if (isInitialRotated || obj.rotatedAngle !== 0) {
                    const { startX, startY, width, height } = obj.activePoint;
                    const angle: number = type === 'initial' ? obj.rotatedAngle : -obj.rotatedAngle;
                    const diffX: number = startX + width / 2 - center.x;
                    const diffY: number = startY + height / 2 - center.y;
                    const cosAngle: number = Math.cos(angle);
                    const sinAngle: number = Math.sin(angle);
                    const centerX: number = cosAngle * diffX - sinAngle * diffY + center.x;
                    const centerY: number = sinAngle * diffX + cosAngle * diffY + center.y;
                    const diffXUpdated: number = centerX - startX - width / 2;
                    const diffYUpdated: number = centerY - startY - height / 2;
                    obj.activePoint.startX += diffXUpdated; obj.activePoint.startY += diffYUpdated;
                    obj.activePoint.endX += diffXUpdated; obj.activePoint.endY += diffYUpdated;
                }
            }
        }
    }

    private updateCropObj(): void {
        this.parent.afterCropActions = []; const object: Object = {currObj: {} as CurrentObject };
        this.parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const obj: CurrentObject = object['currObj']; obj.straighten = this.parent.transform.straighten;
        this.parent.cropObj = extend({}, obj, {}, true) as CurrentObject;
    }

    private rotateCrop(): void {
        const parent: ImageEditor = this.parent;
        const flipState: string = this.getCurrFlipState();
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
        activeObj = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: activeObj}});
        parent.objColl.pop();
        parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
        parent.objColl.push(parent.activeObj);
        // For reverse straightening
        const straighten: number = parent.transform.straighten;
        if (straighten !== 0) {
            parent.transform.straighten = 0;
            parent.straightenBaseImageCanvas();
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: { isPreventApply: null } });
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: { isPreventApply: null } });
            parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: false } });
        }
        this.resetZoom();
        const afterCropActions: string[] = extend([], parent.afterCropActions, [], true) as string[];
        this.revertTransform('initial', coll);
        // Perform straighten
        if (straighten !== 0) {
            parent.transform.straighten = (flipState === 'horizontal' || flipState === 'vertical') ? -straighten : straighten;
            parent.straightenBaseImageCanvas();
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: { isPreventApply: null } });
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: { isPreventApply: null } });
            parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: false } });
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: { isPreventApply: null } });
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: { isPreventApply: null } });
        }
        activeObj = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate', obj: activeObj}});
        parent.objColl.pop(); parent.transform.degree = 0;
        // Checking for selection inside image
        const object: Object = {isIntersect: null };
        parent.notify('draw', { prop: 'updateImgCanvasPoints', onPropertyChange: false });
        parent.notify('draw', { prop: 'isLinesIntersect', onPropertyChange: false, value: {obj: object }});
        let count: number = 0;
        while (straighten !== 0 && object['isIntersect']) {
            count++;
            if (count === 50) {break; }
            parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                value: {zoomFactor: 0.025, zoomPoint: null}, isResize: null});
            parent.notify('draw', { prop: 'updateImgCanvasPoints', onPropertyChange: false });
            parent.notify('draw', { prop: 'isLinesIntersect', onPropertyChange: false, value: {obj: object }});
        }
        this.cropImg(true);
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
                const value: number = coll[i as number] as number;
                switch (value) {
                case 90:
                    parent.notify('transform', {prop: 'rotate', value: { degree: -90, obj: obj }});
                    break;
                case -90:
                    parent.notify('transform', {prop: 'rotate', value: { degree: 90, obj: obj }});
                    break;
                default:
                    parent.notify('transform', {prop: 'flipImage', value: { direction: parent.toPascalCase(value.toString()) }});
                    break;
                }
            }
        } else {
            this.updateFlipState();
            for (let i: number = 0, len: number = coll.length; i < len; i++) {
                const value: number = coll[i as number] as number;
                switch (value) {
                case 90:
                    parent.notify('transform', {prop: 'rotate', value: { degree: 90, obj: obj }});
                    break;
                case -90:
                    parent.notify('transform', {prop: 'rotate', value: { degree: -90, obj: obj }});
                    break;
                default:
                    parent.notify('transform', {prop: 'flipImage', value: { direction: parent.toPascalCase(value.toString()) }});
                    break;
                }
            }
        }
    }

    private updateFlipState(): void {
        const parent: ImageEditor = this.parent;
        const objColl: SelectionPoint[] = parent.objColl as SelectionPoint[];
        for (let i: number = 0, len: number = objColl.length; i < len; i++) {
            objColl[i as number].shapeFlip = '';
        }
        // eslint-disable-next-line
        let pointColl: any = parent.pointColl;
        for (let i: number = 0; i < parent.freehandCounter; i++) {
            pointColl[i as number].shapeFlip = '';
        }
    }

    private resetZoom(): void {
        const parent: ImageEditor = this.parent;
        if (parent.transform.zoomFactor > 0) {
            const zoomFactor: number = parent.transform.zoomFactor;
            const isUndoRedo: boolean = parent.isUndoRedo;
            parent.setProperties({zoomSettings: { zoomFactor: (zoomFactor * 10)}}, true);
            parent.notify('transform', { prop: 'setPreviousZoomValue', onPropertyChange: false,
                value: { previousZoomValue: parent.zoomSettings.zoomFactor } });
            for (let i: number = 0; i < (zoomFactor * 10); i++) {
                parent.isUndoRedo = true;
                parent.notify('transform', { prop: 'zoomAction', onPropertyChange: false,
                    value: {zoomFactor: -0.1, zoomPoint: null}, isResize: null});
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
        if (parent.transform.degree === 0) {
            const panX: number = -parent.cropObj.totalPannedPoint.x; const panY: number = -parent.cropObj.totalPannedPoint.y;
            parent.img.destLeft += panX; parent.img.destTop += panY;
            parent.notify('transform', {prop: 'drawPannImage', value: {point: {x: panX , y: panY }}});
            parent.activeObj = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: { canvas: 'duplicate', obj: parent.activeObj } });
            parent.objColl.pop();
            parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false });
            parent.objColl.push(parent.activeObj);
        }
        this.resetZoom();
        parent.currSelectionPoint = extend({}, parent.objColl[parent.objColl.length - 1], {}, true) as SelectionPoint;
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
        const temp: string = this.lowerContext.filter;
        parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
        this.updateFlipState();
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
        parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
        this.lowerContext.filter = temp;
        parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: false }});
        parent.notify('draw', { prop: 'currTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: null, context: null, isPreventCircleCrop: null} });
        parent.transform.currFlipState = tempCurrFlipState;
        parent.notify('transform', { prop: 'setFlipColl', onPropertyChange: false, value: {flipColl: tempFlipColl }});
        this.lowerContext.filter = 'none';
        this.updateFlipState();
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
        let point: ActivePoint; let shape: string; let obj: SelectionPoint;
        if (parent.objColl.length > 0) {
            for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                obj = parent.objColl[i as number];
                point = obj.activePoint;
                const { startX, startY, width, height} = parent.activeObj.activePoint;
                shape = obj.shape;
                obj.imageRatio = {startX: ((point.startX - startX) / width),
                    startY: ((point.startY - startY) / height),
                    endX: ((point.endX - startX) / width), endY: ((point.endY - startY) / height),
                    width: width / point.width, height: height / point.height };
                let degree: number; let size: number;
                switch (shape) {
                case 'text':
                    degree = (obj.shapeDegree === 0) ? parent.transform.degree : parent.transform.degree - obj.shapeDegree;
                    size = (degree === 0 || Math.abs(degree) === 180) ? point.width : point.height;
                    obj.textSettings.fontRatio = size / obj.textSettings.fontSize;
                    break;
                case 'line':
                case 'arrow':
                    this.cropPointCollection(i);
                    if (shape === 'arrow') {
                        parent.notify('shape', { prop: 'updateArrowRatio', onPropertyChange: false, value: {obj: obj }});
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
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        if (shape === 'path') {
            x = point.startX; y = point.startY; width = point.width; height = point.height;
        } else {
            x = destLeft; y = destTop; width = destWidth; height = destHeight;
        }
        const pointColl: any = parent.objColl[i as number].pointColl;
        for (let n: number = 0, len: number = pointColl.length; n < len; n++) {
            pointColl[n as number].ratioX = (pointColl[n as number].x - x) / width;
            pointColl[n as number].ratioY = (pointColl[n as number].y - y) / height;
        }
    }

    private cropFreehandDrawColl(): void {
        const parent: ImageEditor = this.parent;
        const { startX, startY, width, height} =  parent.activeObj.activePoint;
        for (let n: number = 0; n < parent.freehandCounter; n++) {
            parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
            parent.notify('freehand-draw', { prop: 'setPointCounter', onPropertyChange: false, value: {value: 0 }});
            const len: number = parent.points.length;
            for (let l: number = 0; l < len; l++) {
                parent.points[l as number].ratioX = (parent.points[l as number].x - startX) / width;
                parent.points[l as number].ratioY = (parent.points[l as number].y - startY) / height;
            }
        }
        parent.notify('freehand-draw', { prop: 'updateCropPtsForSel', onPropertyChange: false});
    }

    private resetAnnotations(): void {
        const parent: ImageEditor = this.parent; parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
        parent.notify('freehand-draw', { prop: 'resetStraightenPoint' });
    }

    private setCurrSelPoints(isSetDimension?: boolean): void {
        const parent: ImageEditor = this.parent;
        parent.allowDownScale = false;
        const destPoint: ActivePoint = this.cropDestPoints;
        const filter: string = this.lowerContext.filter;
        const isCropTab: boolean = parent.isCropTab;
        parent.img = { srcLeft: 0, srcTop: 0, srcWidth: parent.baseImgCanvas.width, srcHeight: parent.baseImgCanvas.height,
            destLeft: destPoint.startX, destTop: destPoint.startY, destWidth: destPoint.width, destHeight: destPoint.height };
        const img: ImageDimension = parent.img;
        const currSelPoint: SelectionPoint = parent.currSelectionPoint;
        this.lowerContext.clearRect(0, 0 , parent.lowerCanvas.width, parent.lowerCanvas.height);
        if (isSetDimension) {
            parent.notify('draw', { prop: 'setDestPoints', onPropertyChange: false});
        }
        parent.notify('draw', { prop: 'currTransState', onPropertyChange: false,
            value: {type: 'initial', isPreventDestination: null, context: null, isPreventCircleCrop: null} });
        if (this.croppedDegree === 0 && parent.transform.degree === 0 && currSelPoint
        && currSelPoint.shape !== 'crop-circle' && currSelPoint.shape !== 'crop-square') {
            img.destLeft = destPoint.startX; img.destTop = destPoint.startY;
            img.destWidth = destPoint.width; img.destHeight = destPoint.height;
        }
        if (parent.transform.degree === 0) {
            img.destLeft += parent.panPoint.totalPannedInternalPoint.x;
            img.destTop += parent.panPoint.totalPannedInternalPoint.y;
        }
        parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
        this.lowerContext.filter = filter;
        parent.notify('draw', { prop: 'currTransState', onPropertyChange: false,
            value: {type: 'reverse', isPreventDestination: null, context: null, isPreventCircleCrop: true} });
        let cropObjColl: SelectionPoint[] = extend([], parent.objColl, null, true) as SelectionPoint[];
        let cropPointColl: Point[] = extend([], parent.pointColl, null, true) as Point[];
        const straightenObj: Object = {straightenPoint: null };
        parent.notify('freehand-draw', { prop: 'getStraightenPoint', onPropertyChange: false,
            value: {obj: straightenObj }});
        this.resetAnnotations();
        if (isNullOrUndefined(parent.activeObj.shape) && parent.cropObj.activeObj.shape) {
            parent.activeObj = extend({}, parent.cropObj.activeObj, null, true) as SelectionPoint;
        }
        this.panToSelRangle();
        parent.isCropTab = isCropTab;
        parent.objColl = cropObjColl; parent.pointColl = cropPointColl; parent.freehandCounter = parent.pointColl.length;
        if (straightenObj['straightenPoint']['x'] && straightenObj['straightenPoint']['y']) {
            parent.notify('freehand-draw', { prop: 'setStraightenPoint', onPropertyChange: false,
                value: {x: straightenObj['straightenPoint']['x'], y: straightenObj['straightenPoint']['y'],
                    ratioX: straightenObj['straightenPoint']['ratioX'], ratioY: straightenObj['straightenPoint']['ratioY']}});
        }
        if (parent.cropObj.activeObj.shape) {
            const destPoints: ActivePoint = {startX: img.destLeft, startY: img.destTop, width: img.destWidth, height: img.destHeight};
            if (currSelPoint && currSelPoint.activePoint) {
                const { startX, startY, width, height} = currSelPoint.activePoint;
                img.destLeft = startX; img.destTop = startY;
                img.destWidth = width; img.destHeight = height;
            }
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
            img.destLeft = destPoints.startX; img.destTop = destPoints.startY;
            img.destWidth = destPoints.width; img.destHeight = destPoints.height;
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false});
            cropObjColl = extend([], parent.objColl, null, true) as SelectionPoint[];
            cropPointColl = extend([], parent.pointColl, null, true) as Point[];
            parent.notify('freehand-draw', { prop: 'getStraightenPoint', onPropertyChange: false, value: {obj: straightenObj }});
            this.resetAnnotations();
            const object: Object = {selPointColl: null };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false, value: {obj: object }});
            const cropSelPointColl: Point[] = object['selPointColl'];
            parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false, value: {obj: {selPointColl: [] } }});
            parent.cropObj.filter = this.lowerContext.filter;
            const actObj: SelectionPoint = extend({}, parent.currSelectionPoint, null, true) as SelectionPoint;
            parent.notify('draw', { prop: 'setCurrentObj', onPropertyChange: false, value: {obj: null}});
            parent.activeObj = extend({}, actObj, null, true) as SelectionPoint;
            const activeObj: SelectionPoint = extend({}, parent.activeObj, null, true) as SelectionPoint;
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.currSelectionPoint = null; parent.isCircleCrop = false;
            if (parent.transform.degree !== 0) {
                if (isNullOrUndefined(parent.activeObj.shape) && parent.cropObj.activeObj.shape) {
                    parent.activeObj = extend({}, parent.cropObj.activeObj, null, true) as SelectionPoint;
                }
                parent.notify('transform', { prop: 'drawPannedImage', value: { xDiff: 0, yDiff: 0 } });
                parent.panPoint.currentPannedPoint = { x: 0, y: 0 };
            }
            parent.objColl = cropObjColl; parent.pointColl = cropPointColl; parent.freehandCounter = parent.pointColl.length;
            if (straightenObj['straightenPoint']['x'] && straightenObj['straightenPoint']['y']) {
                parent.notify('freehand-draw', { prop: 'setStraightenPoint', onPropertyChange: false,
                    value: {x: straightenObj['straightenPoint']['x'], y: straightenObj['straightenPoint']['y'],
                        ratioX: straightenObj['straightenPoint']['ratioX'], ratioY: straightenObj['straightenPoint']['ratioY']}});
            }
            parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                value: {obj: {selPointColl: cropSelPointColl } }});
            parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
            this.adjustStraightenForShapes('reverse', false);
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false, value: {isPreventApply: true }});
            parent.notify('shape', { prop: 'zoomObjColl', onPropertyChange: false, value: {isPreventApply: null}});
            parent.notify('freehand-draw', { prop: 'zoomFHDColl', onPropertyChange: false, value: {isPreventApply: null}});
            if (parent.transform.degree === 0) {
                parent.notify('transform', { prop: 'drawPannImage', onPropertyChange: false,
                    value: {point: {x: 0, y: 0}}});
            } else {
                if (isNullOrUndefined(parent.activeObj.shape) && parent.cropObj.activeObj.shape) {
                    parent.activeObj = extend({}, parent.cropObj.activeObj, null, true) as SelectionPoint;
                }
                parent.notify('transform', { prop: 'drawPannedImage', value: { xDiff: 0, yDiff: 0 } });
                parent.panPoint.currentPannedPoint = { x: 0, y: 0 };
            }
            parent.activeObj = activeObj;
            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate'} });
            parent.notify('transform', { prop: 'setTempPanMove', onPropertyChange: false,
                value: {point: null }});
            if (!this.isInitCrop && parent.transform.degree === 0 && parent.cropObj.currFlipState !== '' &&
                parent.cropObj.cropZoom !==  0) {
                this.isInitCrop = true;
                const obj: Object = {activeObj: null };
                parent.notify('draw', { prop: 'getStraightenActObj', onPropertyChange: false, value: {obj: obj }});
                parent.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null}});
                parent.notify('draw', { prop: 'setStraightenActObj', onPropertyChange: false, value: {activeObj: obj['activeObj'] }});
                parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'croptransform',
                    isApplyBtn: false, isCropping: null, isZooming: null, cType: null}});
            } else {this.isInitCrop = false; }
        } else {
            this.adjustStraightenForShapes('reverse', true);
            parent.notify('freehand-draw', { prop: 'updateFHDColl', onPropertyChange: false, value: {isPreventApply: true }});
            const temp: string = this.lowerContext.filter;
            this.lowerContext.filter = 'none';
            parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
            this.lowerContext.filter = temp;
            parent.currSelectionPoint = null;
        }
        if (document.querySelector('.e-ie-straighten-value-span')) {
            document.querySelector('.e-ie-straighten-value-span').innerHTML = parent.transform.straighten.toString() + '&#176';
        }
    }

    private panToSelRangle(isReverse?: boolean): void {
        const parent: ImageEditor = this.parent;
        const pannedPoint: Point = parent.cropObj.totalPannedClientPoint;
        const panX: number = parent.transform.degree !== 0 ? isReverse ? -pannedPoint.x : pannedPoint.x : 0;
        const panY: number = parent.transform.degree !== 0 ? isReverse ? -pannedPoint.y : pannedPoint.y : 0;
        if (parent.transform.degree !== 0) {
            parent.panPoint.currentPannedPoint = { x: panX, y: panY };
            parent.notify('transform', { prop: 'drawPannedImage', value: { xDiff: panX, yDiff: panY } });
            parent.panPoint.currentPannedPoint = { x: 0, y: 0 };
        }
    }

    private cropCircle(context: CanvasRenderingContext2D, isSave?: boolean, isFlip?: boolean): void {
        const parent: ImageEditor = this.parent; const { destLeft, destTop, destWidth, destHeight } = parent.img;
        if (isFlip && parent.transform.currFlipState !== '') {
            parent.notify('draw', { prop: 'setTransform', onPropertyChange: false,
                value: {context: context, value: parent.transform.currFlipState, isReverse: null}});
        }
        const temp: string = context.filter;
        context.filter = 'none';
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        const centerX: number = isNullOrUndefined(isSave) ? destLeft + (destWidth / 2) : context.canvas.width / 2;
        const centerY: number = isNullOrUndefined(isSave) ? destTop + (destHeight / 2) : context.canvas.height / 2;
        const radius: number = isSave ? context.canvas.width / 2 : destWidth / 2;
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.closePath(); context.fill(); context.restore();
        context.globalCompositeOperation = 'source-over';
        parent.currObjType.isActiveObj = parent.isCircleCrop = true;
        context.filter = temp;
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
        let panRegion: string = ''; const degree: number = parent.transform.degree;
        const { x, y} = parent.panPoint.currentPannedPoint;
        if (parent.rotateFlipColl.length > 0 && typeof(parent.rotateFlipColl[0]) === 'number'
            && degree < 0) {
            panRegion = this.getCurrCropState('reverse', true);
        } else {
            panRegion = this.getCurrFlipState();
        }
        if (degree % 90 === 0 && degree % 180 !== 0) {
            if (degree === 90 || (degree === -90 && (panRegion === 'horizontal' || panRegion === 'vertical'))
                || (degree === -270 && (panRegion === '' || panRegion === 'verticalHorizontal'
                || panRegion === 'horizontalVertical'))) {
                if (panRegion === 'horizontal' || panRegion === '') {
                    parent.img.destLeft += y;
                } else {
                    parent.img.destLeft -= y;
                }
                if (panRegion === '' || panRegion === 'vertical') {
                    parent.img.destTop -= x;
                } else {
                    parent.img.destTop += x;
                }
            }
            else if (degree === 270 || (degree === -270 && (panRegion === 'horizontal' || panRegion === 'vertical'))
                || (degree === -90 && (panRegion === '' || panRegion === 'verticalHorizontal'
                || panRegion === 'horizontalVertical'))) {
                if (panRegion === '' || panRegion === 'horizontal') {
                    parent.img.destLeft -= y;
                } else {
                    parent.img.destLeft += y;
                }
                if (panRegion === '' || panRegion === 'vertical') {
                    parent.img.destTop += x;
                } else {
                    parent.img.destTop -= x;
                }
            }
        } else {
            if (degree === 180 || degree === -180) {
                if (panRegion === '' || panRegion === 'vertical') {
                    parent.img.destLeft -= x;
                } else {
                    parent.img.destLeft += x;
                }
                if (panRegion === '' || panRegion === 'horizontal') {
                    parent.img.destTop -= y;
                } else {
                    parent.img.destTop += y;
                }
            }
        }
    }

    private crop(obj: Object): void {
        const parent: ImageEditor = this.parent; const { startX, startY, endX, endY} = parent.activeObj.activePoint;
        if (!parent.disabled && parent.isImageLoaded) {
            const object: Object = {isCropToolbar: parent.isCropToolbar };
            if (parent.currObjType.isUndoAction && !object['isCropToolbar']) {
                parent.notify('undo-redo', {prop: 'refreshUrc', value: {bool: null }});
            }
            const transitionArgs: CropEventArgs = {cancel: false, startPoint: { x: startX, y: startY },
                endPoint: {x: endX, y: endY }, preventScaling: false };
            if (!object['isCropToolbar'] && isBlazor() && parent.events && parent.events.cropping.hasDelegate === true) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                if ((parent as any).currentToolbar === 'resize-toolbar') {
                    parent.dotNetRef.invokeMethodAsync('CropEventAsync', 'OnCrop', transitionArgs, null);
                    this.cropEvent(transitionArgs, obj, object);
                } else {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    (parent.dotNetRef.invokeMethodAsync('CropEventAsync', 'OnCrop', transitionArgs, null) as any).then((args: CropEventArgs) => {
                        this.cropEvent(args, obj, object);
                    });
                }
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
                parent.notify('freehand-draw', { prop: 'resetStraightenPoint' });
                parent.isCropTab = false;
                parent.transform.zoomFactor = 0;
                parent.setProperties({zoomSettings: { zoomFactor: 1}}, true);
                parent.notify('transform', { prop: 'setPreviousZoomValue', onPropertyChange: false,
                    value: { previousZoomValue: parent.zoomSettings.zoomFactor } });
                if (!Browser.isDevice) {this.updateUndoRedoColl(prevObj, prevCropObj, object); }
                parent.notify('transform', { prop: 'setCropDimension', onPropertyChange: false,
                    value: {width: parent.cropObj.destPoints.width, height: parent.cropObj.destPoints.height }});
                const aspectIcon: HTMLInputElement = (parent.element.querySelector('#' + parent.element.id + '_aspectratio') as HTMLInputElement);
                const nonAspectIcon: HTMLInputElement = (parent.element.querySelector('#' + parent.element.id + '_nonaspectratio') as HTMLInputElement);
                parent.notify('draw', { prop: 'render-image', value: { isMouseWheel: false } });
                if (!isBlazor() && !object['isCropToolbar'] && (isNullOrUndefined(aspectIcon) && isNullOrUndefined(nonAspectIcon))) {
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'main',
                        isApplyBtn: false, isCropping: false, isZooming: null, cType: null}});
                } else if (!object['isCropToolbar']) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    if ((parent as any).currentToolbar !== 'resize-toolbar') {
                        parent.updateToolbar(parent.element, 'imageLoaded');
                    }
                }
                this.resizeWrapper();
                if (Browser.isDevice) {this.updateUndoRedoColl(prevObj, prevCropObj, object); }
                transitionArgs = { startPoint: transitionArgs.startPoint, endPoint: transitionArgs.endPoint };
                if (!object['isCropToolbar'] && isBlazor() && parent.events && parent.events.cropped.hasDelegate === true) {
                    parent.dotNetRef.invokeMethodAsync('CropEventAsync', 'Cropped', null, transitionArgs);
                } else {}
            }
        }
    }

    private updateUndoRedoColl(prevObj: CurrentObject, prevCropObj: CurrentObject, object: Object): void {
        const parent: ImageEditor = this.parent;
        const currSelPtObj: Object = {prevCurrSelectionPoint: parent.prevCurrSelectionPoint };
        prevObj.currSelectionPoint = extend({}, currSelPtObj['prevCurrSelectionPoint'], {}, true) as SelectionPoint;
        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: 'crop', previousObj: prevObj, previousObjColl: prevObj.objColl,
                previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                previousCropObj: prevCropObj, previousText: null,
                currentText: null, previousFilter: null, isCircleCrop: parent.isCircleCrop}});
        if (!object['isCropToolbar']) {
            parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
        }
    }

    private resizeWrapper(): void {
        const parent: ImageEditor = this.parent;
        if (Browser.isDevice && !isBlazor()) {
            const elem: HTMLElement = (parent as any).element;
            const ctxToolbar: HTMLElement = elem.querySelector('#' + elem.id + '_contextualToolbarArea') as HTMLElement;
            if (ctxToolbar.style.position === '' && !this.isTransformCrop) {
                ctxToolbar.style.position = 'absolute';
                parent.isStraightening = false;
                parent.update();
                parent.notify('filter', { prop: 'setAdjustmentValue', value: { adjustmentValue: parent.canvasFilter } });
            }
        } else if (Browser.isDevice && isBlazor() && !this.isTransformCrop) {
            parent.isStraightening = false;
            parent.update();
            const canvasWrapper: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_canvasWrapper');
            if (canvasWrapper) {
                canvasWrapper.style.height = (parseInt(canvasWrapper.style.height) + 2) + 'px';
            }
            parent.notify('filter', { prop: 'setAdjustmentValue', value: { adjustmentValue: parent.canvasFilter } });
        }
    }

    private calcRatio(obj?: Object, dimension?: Dimension): Dimension {
        const parent: ImageEditor = this.parent;
        const { degree } = parent.transform;
        const { destWidth, destHeight } = parent.img;
        const { width, height } = dimension || parent.baseImgCanvas;
        const widthRatio = (degree === 0 || degree % 180 === 0) ? width / destWidth : height / destWidth;
        const heightRatio = (degree === 0 || degree % 180 === 0) ? height / destHeight : width / destHeight;
        if (obj) {
            obj['width'] = widthRatio;
            obj['height'] = heightRatio;
        }
        return { width: widthRatio, height: heightRatio };
    }

    private isObjInImage(obj: SelectionPoint, dummyObj?: Object): boolean {
        const parent: ImageEditor = this.parent;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        const { startX, endX, startY, endY } = obj.activePoint;
        const isInside: boolean = (
            (startX >= destLeft && endX <= (destLeft + destWidth)) ||
            (startX <= destLeft && endX >= destLeft) ||
            (startX <= (destLeft + destWidth) && endX >= (destLeft + destWidth)) ||
            (startY >= destTop && endY <= (destTop + destHeight)) ||
            (startY <= destTop && endY >= destTop) ||
            (startY <= (destTop + destHeight) && endY >= (destTop + destHeight))
        );
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
