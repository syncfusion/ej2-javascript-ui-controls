import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dimension } from '@syncfusion/ej2-inputs';
import { hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { BeforeSaveEventArgs, FileType, ImageEditor, Point, SaveEventArgs, SelectionPoint, ActivePoint, CurrentObject } from '../index';

export class Export {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private imageQuality: number;

    constructor(parent: ImageEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on('export', this.export, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('export', this.export);
        this.parent.off('destroyed', this.destroy);
    }

    private export(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        this.parent.notify('toolbar', { prop: 'refreshShapeDrawing', onPropertyChange: false });
        this.updatePvtVar();
        switch (args.prop) {
        case 'export':
            this.exportImg(args.value['type'], args.value['fileName'], args.value['imgQuality']);
            break;
        case 'exportToCanvas':
            this.exportToCanvas(args.value['object']);
            break;
        case 'updateSaveContext':
            this.updateSaveContext(args.value['context']);
            break;
        case 'setImageQuality':
            this.imageQuality = args.value['value'];
        }
    }

    public getModuleName(): string {
        return 'export';
    }

    private updatePvtVar(): void {
        const parent: ImageEditor = this.parent;
        if (parent.lowerCanvas) {
            this.lowerContext = parent.lowerCanvas.getContext('2d');
        }
    }

    private exportImg(type?: string, fileName?: string, imgQuality?: number): void {
        const parent: ImageEditor = this.parent;
        const obj: Object = { fileName: '' };
        parent.notify('draw', { prop: 'getFileName', onPropertyChange: false, value: {obj: obj }});
        const imageName: string = obj['fileName'];
        if (!parent.disabled && parent.isImageLoaded) {
            const dummyObj: Object = {bool: false };
            parent.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: dummyObj }});
            if (dummyObj['bool']) {
                parent.notify('freehand-draw', { prop: 'applyFhd', onPropertyChange: false});
            }
            if (parent.togglePen) {
                parent.currObjType.isZoomed = true;
                parent.notify('shape', { prop: 'apply', onPropertyChange: false, value: {shape: null, obj: null, canvas: null}});
            }
            if (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') {
                parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                    value: {x: null, y: null, isMouseDown: null}});
            }
            parent.notify('shape', { prop: 'applyActObj', onPropertyChange: false, value: {isMouseDown: null}});
            const obj: Object = {canvasFilter: this.parent.canvasFilter };
            this.lowerContext.filter = obj['canvasFilter'];
            type = type ? type : 'Png';
            parent.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                value: {x: null, y: null, isMouseDown: null}});
            const beforeSave: BeforeSaveEventArgs = { cancel: false, fileName: fileName ? fileName : imageName,
                fileType: type as FileType, imageQuality: imgQuality};
            parent.trigger('beforeSave', beforeSave);
            this.beforeSaveEvent(beforeSave, type, fileName, imageName, imgQuality);
        }
    }

    private beforeSaveEvent(observableSaveArgs: BeforeSaveEventArgs, type: string, fileName: string, imageName: string,
                            imgQuality?: number): void {
        const parent: ImageEditor = this.parent;
        if (!observableSaveArgs.cancel) {
            parent.currObjType.isSave = true;
            fileName = observableSaveArgs.fileName ? observableSaveArgs.fileName : fileName;
            const lowerCaseType: string = type.toLowerCase();
            fileName = fileName || imageName;
            if (lowerCaseType === 'svg') {
                this.toSVGImg(fileName);
            } else {
                this.toBlobFn(fileName, lowerCaseType, imgQuality);
            }
            const saved: SaveEventArgs = { fileName: fileName ? fileName : imageName, fileType: type as FileType};
            parent.trigger('saved', saved);
            parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
            parent.lowerCanvas.style.left = parent.upperCanvas.style.left = '';
            parent.lowerCanvas.style.top = parent.upperCanvas.style.top = '';
            parent.lowerCanvas.style.maxWidth = parent.upperCanvas.style.maxWidth = '';
            parent.lowerCanvas.style.maxHeight = parent.upperCanvas.style.maxHeight = '';
        }
    }

    private toSVGImg(fileName?: string): string {
        const parent: ImageEditor = this.parent;
        showSpinner(parent.element);
        parent.element.style.opacity = '0.5';
        const tempCanvas: HTMLCanvasElement = this.exportToCanvas();
        const dataUrl: string = tempCanvas.toDataURL();
        hideSpinner(parent.element);
        parent.element.style.opacity = '1';
        const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', tempCanvas.style.maxWidth); svg.setAttribute('height', tempCanvas.style.maxHeight);
        const XLinkNS: string = 'http://www.w3.org/1999/xlink';
        const img: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        img.setAttributeNS(null, 'height', tempCanvas.height.toString());
        img.setAttributeNS(null, 'width', tempCanvas.width.toString());
        img.setAttributeNS(XLinkNS, 'xlink:href', dataUrl); svg.appendChild(img);
        const prefix: string = 'data:image/svg+xml;base64,';
        const header: string = '<svg' + ' xmlns="http://www.w3.org/2000/svg"' + ' xmlns:xlink="http://www.w3.org/1999/xlink"'
         + ` width="${tempCanvas.width}"` + ` height="${tempCanvas.height}"` + '>';
        const footer: string = '</svg>'; const body: string = svg.innerHTML;
        const data: string = header + body + footer; const svgDataUrl: string = prefix + btoa(data);
        if (fileName === null) {return svgDataUrl; }
        else {
            this.downloadImg(svgDataUrl, fileName + '.' + 'svg');
            return null;
        }
    }

    private toBlobFn(fileName: string, type: string, imgQuality?: number): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: this = this;
        const parent: ImageEditor = this.parent;
        showSpinner(parent.element);
        parent.element.style.opacity = '0.5';
        if (!isNullOrUndefined(imgQuality)) {
            imgQuality = imgQuality > 1 ? 1 : (imgQuality <= 0 ? 0.01 : imgQuality);
            this.imageQuality = imgQuality ? imgQuality : null;
        }
        const tempCanvas: HTMLCanvasElement = this.exportToCanvas();
        const imagetype: string = type !== 'jpeg' ? 'image/png' : 'image/jpeg';
        // eslint-disable-next-line @typescript-eslint/tslint/config
        tempCanvas.toBlob(function(blob){
            const blobUrl: string = URL.createObjectURL(blob);
            proxy.downloadImg(blobUrl, fileName + '.' + type);
            hideSpinner(parent.element);
            parent.element.style.opacity = '1';
        }, imagetype, this.imageQuality ? this.imageQuality : null);
    }

    private exportToCanvas(object?: Object): HTMLCanvasElement {
        const parent: ImageEditor = this.parent;
        let width: number; let height: number;
        const tempCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
        const tempObj: Object = {currObj: {} as CurrentObject };
        parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: tempObj }});
        const prevObj: CurrentObject = tempObj['currObj'];
        prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        if (this.parent.aspectWidth) {
            parent.notify('undo-redo', { prop: 'setPreventUR', value: { bool: true } });
            parent.notify('toolbar', { prop: 'resizeClick', value: {bool: false }});
            parent.okBtn();
            if (parent.transform.degree % 90 === 0 && parent.transform.degree % 180 !== 0) {
                width = this.parent.aspectHeight; height = this.parent.aspectWidth;
            } else {
                width = this.parent.aspectWidth; height = this.parent.aspectHeight;
            }
            parent.notify('undo-redo', { prop: 'setPreventUR', value: { bool: false } });
        }
        else if (parent.currSelectionPoint) { width = parent.img.srcWidth; height = parent.img.srcHeight; }
        else {width = parent.baseImgCanvas.width; height = parent.baseImgCanvas.height; }
        const obj: Object = {width: 0, height: 0 };
        parent.notify('crop', { prop: 'calcRatio', onPropertyChange: false,
            value: {obj: obj, dimension: {width: width, height: height }}});
        const ratio: Dimension = obj as Dimension;
        const tempContextFilter: string = this.lowerContext.filter;
        // Manipulating blur value
        if (this.lowerContext.filter !== 'none') {
            const splitWords: string[] = this.lowerContext.filter.split(' ');
            let value: number = parseFloat(splitWords[5].split('(')[1]);
            value *= ((ratio.width + ratio.height) / 2);
            splitWords[5] = 'blur(' + value + 'px)';
            this.lowerContext.filter = splitWords.join(' ');
        }
        const tempCanvas: HTMLCanvasElement = parent.createElement('canvas', {
            id: parent.element.id + '_tempCanvas', attrs: { name: 'canvasImage' }
        });
        const tempContext: CanvasRenderingContext2D = tempCanvas.getContext('2d');
        tempCanvas.width = width; tempCanvas.height = height;
        const dimObj: Object = {width: 0, height: 0 };
        parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: width, height: height, obj: dimObj}});
        const maxDimension: Dimension = dimObj as Dimension;
        tempCanvas.style.maxWidth = maxDimension.width + 'px'; tempCanvas.style.maxHeight = maxDimension.height + 'px';
        const temp: string = this.lowerContext.filter;
        tempContext.filter = this.lowerContext.filter;
        this.downScaleImgCanvas(tempContext, width, height);
        this.lowerContext.filter = temp;
        if (parent.transform.degree !== 0 || parent.transform.currFlipState !== '' || parent.transform.straighten !== 0) {
            this.updateSaveContext(tempContext);
            this.exportTransformedImage(tempContext);
        }
        this.drawAnnotation(tempContext, ratio);
        if (parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: tempContext, isSave: true, isFlip: null}});
        }
        this.updateFrame(tempContext, true);
        this.lowerContext.filter = tempContextFilter; parent.canvasFilter = tempContextFilter;
        if (object) { object['canvas'] = tempCanvas; }
        if (parent.aspectWidth) {
            parent.objColl = []; parent.pointColl = []; parent.freehandCounter = 0;
            parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                value: {obj: {selPointColl: [] }}});
            parent.notify('draw', { prop: 'setCurrentObj', onPropertyChange: false, value: {obj: prevObj }});
            prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
            parent.notify('freehand-draw', { prop: 'setSelPointColl', onPropertyChange: false,
                value: {obj: {selPointColl: prevObj.selPointColl }}});
            parent.cropObj = tempCropObj;
            parent.objColl = extend([], prevObj.objColl, [], true) as SelectionPoint[];
            parent.pointColl = extend([], prevObj.pointColl, [], true) as Point[];
            parent.freehandCounter = parent.pointColl.length;
            parent.transform.straighten = 0;
            this.lowerContext.filter = 'none';
            parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                value: {ctx: this.lowerContext, shape: 'zoom', pen: 'zoom', isPreventApply: null }});
            this.lowerContext.filter = prevObj.filter;
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
            if (parent.isCircleCrop || (parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle')) {
                parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                    value: {context: this.lowerContext, isSave: null, isFlip: null}});
            }
        }
        return tempCanvas;
    }

    private drawAnnotation(tempContext: CanvasRenderingContext2D, ratio: Dimension): void {
        const parent: ImageEditor = this.parent;
        const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tempPointColl: any = extend([], parent.pointColl, [], true);
        for (let i: number = 0; i < parent.shapeColl.length; i++) {
            if (parent.shapeColl[i as number].order) {
                if (parent.shapeColl[i as number].currIndex && parent.shapeColl[i as number].currIndex.indexOf('shape') > -1) {
                    parent.objColl = [];
                    parent.objColl.push(extend({}, parent.shapeColl[i as number], {}, true) as SelectionPoint);
                    this.drawShape(tempContext, ratio);
                } else if (parent.shapeColl[i as number].id && parent.shapeColl[i as number].id.indexOf('pen') > -1) {
                    parent.pointColl = []; parent.freehandCounter = 0;
                    parent.pointColl.push(extend({}, parent.shapeColl[i as number], {}, true));
                    parent.freehandCounter = parent.pointColl.length;
                    this.drawPen(tempContext, ratio);
                }
            }
        }
        parent.objColl = tempObjColl; parent.pointColl = tempPointColl; parent.freehandCounter = parent.pointColl.length;
    }

    private drawShape(tempContext: CanvasRenderingContext2D, ratio: Dimension): void {
        const parent: ImageEditor = this.parent;
        if (parent.objColl.length > 0) {
            const temp: string = tempContext.filter;
            tempContext.filter = 'none';
            const indexObj: Object = {index: null };
            parent.notify('shape', { prop: 'getSmallestIndex', onPropertyChange: false, value: {obj: indexObj }});
            let index: number = indexObj['index'];
            const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
            const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
            while (objColl.length > 0) {
                let found: boolean = false;
                for (let i: number = 0; i < objColl.length; i++) {
                    const currentObj: SelectionPoint = objColl[i as number];
                    if (isNullOrUndefined(currentObj.order)) {
                        objColl.splice(i, 1);
                        i--;
                        continue;
                    }
                    if (currentObj.order === index) {
                        const temp: string = tempContext.filter;
                        tempContext.filter = 'none';
                        const currObj: SelectionPoint = objColl[i as number];
                        const activePoint: ActivePoint = currObj.activePoint;
                        // Subtracting destination left and top points
                        activePoint.startX -= parent.img.destLeft;
                        activePoint.startY -= parent.img.destTop;
                        activePoint.endX -= parent.img.destLeft;
                        activePoint.endY -= parent.img.destTop;
                        activePoint.width = activePoint.endX - activePoint.startX;
                        activePoint.height = activePoint.endY - activePoint.startY;
                        // Manipulating points
                        activePoint.startX *= ratio.width;
                        activePoint.startY *= ratio.height;
                        activePoint.endX *= ratio.width;
                        activePoint.endY *= ratio.height;
                        activePoint.width = activePoint.endX - activePoint.startX;
                        activePoint.height = activePoint.endY - activePoint.startY;
                        currObj.strokeSettings.strokeWidth *= ((ratio.width + ratio.height) / 2);
                        if (currObj.shape === 'text') {
                            currObj.textSettings.fontSize *= ((ratio.width + ratio.height) / 2);
                        } else if (currObj.shape === 'path') {
                            for (let l: number = 0; l < currObj.pointColl.length; l++) {
                                currObj.pointColl[l as number].x =
                                    (currObj.pointColl[l as number].x - parent.img.destLeft) * ratio.width;
                                currObj.pointColl[l as number].y =
                                    (currObj.pointColl[l as number].y - parent.img.destTop) * ratio.height;
                            }
                        } else if (currObj.shape === 'image') {
                            parent.activeObj = extend({}, objColl[i as number], {}, true) as SelectionPoint;
                            parent.notify('selection', { prop: 'upgradeImageQuality', onPropertyChange: false});
                            objColl[i as number] = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                        }
                        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'saveContext', obj: objColl[i as number], isCropRatio: null,
                            points: null, isPreventDrag: true, saveContext: tempContext, isPreventSelection: null} });
                        tempContext.filter = temp;
                        parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                        index++;
                        const indexBool: Object = {bool: false };
                        parent.notify('shape', { prop: 'isIndexInObjColl', onPropertyChange: false, value: {obj: indexBool, index: index }});
                        if (!indexBool['bool']) {index++; }
                        objColl.splice(i, 1);
                        found = true;
                        break; // Exit the loop to start from the beginning
                    }
                }
                if (!found) {
                    break; // If no matching order was found, exit the loop
                }
            }
            tempContext.filter = temp;
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.objColl = tempObjColl;
        }
    }

    private drawPen(tempContext: CanvasRenderingContext2D, ratio: Dimension): void {
        const parent: ImageEditor = this.parent;
        if (parent.freehandCounter > 0) {
            const widthObj: Object = {penStrokeWidth: null };
            parent.notify('freehand-draw', {prop: 'getPenStrokeWidth', onPropertyChange: false, value: {obj: widthObj }});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tempPointColl: any = extend({}, parent.pointColl, {}, true);
            for (let n: number = 0; n < parent.freehandCounter; n++) {
                parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
                parent.notify('freehand-draw', { prop: 'setPointCounter', onPropertyChange: false, value: {value: 0 }});
                const len: number = parent.points.length;
                parent.pointColl[n as number].strokeWidth *= ((ratio.width + ratio.height) / 2);
                for (let l: number = 0; l < len; l++) {
                    parent.points[l as number].x = (parent.points[l as number].x - parent.img.destLeft) * ratio.width;
                    parent.points[l as number].y = (parent.points[l as number].y - parent.img.destTop) * ratio.height;
                }
            }
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: tempContext, points: null} });
            parent.pointColl = tempPointColl;
            parent.notify('freehand-draw', {prop: 'setPenStrokeWidth', onPropertyChange: false, value: {value: widthObj['penStrokeWidth'] }});
        }
    }

    private downScaleImgCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const parent: ImageEditor = this.parent;
        const canvas: HTMLCanvasElement = parent.baseImgCanvas;
        const img: HTMLImageElement = parent.baseImg;
        const obj: Object = {width: 0, height: 0 };
        parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: img.width, height: img.height, obj: obj, isImgShape: null }});
        if (obj['width'] > width && obj['height'] > height) {
            const tempCanvas: HTMLCanvasElement = parent.createElement('canvas', {
                id: parent.element.id + '_downScaleCanvas', attrs: { name: 'canvasImage' }
            });
            tempCanvas.width = this.parent.img.srcWidth; tempCanvas.height = this.parent.img.srcHeight;
            tempCanvas.getContext('2d').drawImage(canvas, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                                                  parent.img.srcHeight, 0, 0, tempCanvas.width, tempCanvas.height);
            parent.notify('draw', {prop: 'downScale', value: {canvas: tempCanvas, width: width, height: height }});
            ctx.drawImage(tempCanvas, 0, 0);
        } else {
            ctx.drawImage(parent.baseImgCanvas, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                          parent.img.srcHeight, 0, 0, width, height);
        }
    }

    private updateFrame(tempContext: CanvasRenderingContext2D, isAnnotation?: boolean): void {
        if (this.parent.frameObj.type !== 'none') {
            const temp: string = tempContext.filter;
            tempContext.filter = 'none';
            this.parent.notify('draw', {prop: 'applyFrame', value: {ctx: tempContext, frame: this.parent.frameObj.type, preventImg: isAnnotation }});
            tempContext.filter = temp;
        }
    }

    private downloadImg(blob: string, fileName: string): void {
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = blob; a.target = '_parent';
        a.download = fileName;
        (document.body || document.documentElement).appendChild(a);
        a.click(); a.parentNode.removeChild(a);
    }

    private exportTransformedImage(tempContext: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        const degree: number = parent.transform.degree;
        if (parent.rotateFlipColl.length > 0) {
            for (let i: number = 0, len: number = parent.rotateFlipColl.length; i < len; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const flip: any = parent.rotateFlipColl[i as number];
                if (typeof flip === 'number') {
                    this.exportRotate(tempContext, flip as number);
                } else if (flip === 'horizontal') {
                    this.exportFlip(tempContext, true, false);
                } else if (flip === 'vertical') {
                    this.exportFlip(tempContext, false, true);
                }
            }
        }
        parent.transform.degree = degree;
    }

    private exportRotate(tempContext: CanvasRenderingContext2D, degree: number): void {
        const parent: ImageEditor = this.parent;
        tempContext.clearRect(0, 0, tempContext.canvas.width, tempContext.canvas.height);
        this.setMaxDim(parent.transform.degree, tempContext.canvas);
        tempContext.translate(tempContext.canvas.width / 2, tempContext.canvas.height / 2);
        tempContext.rotate(Math.PI / 180 * degree);
        tempContext.drawImage(parent.inMemoryCanvas, -tempContext.canvas.height / 2, -tempContext.canvas.width / 2,
                              tempContext.canvas.height, tempContext.canvas.width);
        this.updateSaveContext(tempContext);
    }

    private exportFlip(tempContext: CanvasRenderingContext2D, flipHorizontal: boolean, flipVertical: boolean): void {
        tempContext.clearRect(0, 0, tempContext.canvas.width, tempContext.canvas.height);
        if (flipHorizontal) {
            tempContext.translate(tempContext.canvas.width, 0);
            tempContext.scale(-1, 1);
        }
        if (flipVertical) {
            tempContext.translate(0, tempContext.canvas.height);
            tempContext.scale(1, -1);
        }
        tempContext.drawImage(this.parent.inMemoryCanvas, 0, 0);
        this.updateSaveContext(tempContext);
    }

    private updateSaveContext(tempContext: CanvasRenderingContext2D): void {
        const inMemoryContext: CanvasRenderingContext2D = this.parent.inMemoryCanvas.getContext('2d');
        tempContext.setTransform(1, 0, 0, 1, 0, 0);
        const imageData: ImageData = tempContext.getImageData(0, 0, tempContext.canvas.width, tempContext.canvas.height);
        this.parent.inMemoryCanvas.width = imageData.width; this.parent.inMemoryCanvas.height = imageData.height;
        inMemoryContext.putImageData(imageData, 0, 0);
    }

    private setMaxDim(degree: number, tempCanvas: HTMLCanvasElement): void {
        let newWidth: number; let newHeight: number;

        if (degree % 90 === 0 && degree % 180 !== 0) {
            if (isNullOrUndefined(this.parent.currSelectionPoint)) {
                newWidth = this.parent.baseImgCanvas.height;
                newHeight = this.parent.baseImgCanvas.width;
            } else {
                newWidth = this.parent.img.srcHeight;
                newHeight = this.parent.img.srcWidth;
            }
        } else if (degree % 180 === 0 || degree === 0) {
            if (isNullOrUndefined(this.parent.currSelectionPoint)) {
                newWidth = this.parent.baseImgCanvas.width;
                newHeight = this.parent.baseImgCanvas.height;
            } else {
                newWidth = this.parent.img.srcWidth;
                newHeight = this.parent.img.srcHeight;
            }
        }
        if (!isNullOrUndefined(this.parent.aspectWidth)) {
            newWidth = this.parent.aspectWidth;
            newHeight = this.parent.aspectHeight;
        }
        tempCanvas.width = newWidth; tempCanvas.height = newHeight;
        const obj: Object = {width: 0, height: 0 };
        this.parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: newWidth, height: newHeight, obj: obj, isImgShape: null}});
        const maxDimension: Dimension = obj as Dimension;
        tempCanvas.style.maxWidth = maxDimension.width + 'px';
        tempCanvas.style.maxHeight = maxDimension.height + 'px';
    }
}
