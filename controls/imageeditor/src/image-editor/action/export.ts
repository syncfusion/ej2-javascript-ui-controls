import { extend, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dimension } from '@syncfusion/ej2-inputs';
import { hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { BeforeSaveEventArgs, FileType, ImageEditor, Point, SaveEventArgs, SelectionPoint, ActivePoint } from '../index';

export class Export {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;

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
        if (isBlazor()) {
            const obj: Object = {shape: '' };
            this.parent.notify('selection', { prop: 'getCurrentDrawingShape', onPropertyChange: false, value: {obj: obj }});
            if (obj['shape'] !== '') {
                this.parent.notify('selection', { prop: 'setCurrentDrawingShape', onPropertyChange: false, value: {value: '' }});
                this.parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            }
        } else {
            this.parent.notify('toolbar', { prop: 'refreshShapeDrawing', onPropertyChange: false });
        }
        this.updatePvtVar();
        switch (args.prop) {
        case 'export':
            this.exportImg(args.value['type'], args.value['fileName']);
            break;
        case 'exportToCanvas':
            this.exportToCanvas(args.value['object']);
            break;
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

    private exportImg(type?: string, fileName?: string): void {
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
            if (parent.textArea.style.display === 'block') {
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
                fileType: type as FileType};
            if (isBlazor() && parent.events && parent.events.saving.hasDelegate === true) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                (parent.dotNetRef.invokeMethodAsync('BeforeSaveEventAsync', 'BeforeSave', beforeSave) as any).then((beforeSave: BeforeSaveEventArgs) => {
                    this.beforeSaveEvent(beforeSave, type, fileName, imageName);
                });
            } else {
                parent.trigger('beforeSave', beforeSave);
                this.beforeSaveEvent(beforeSave, type, fileName, imageName);
            }
        }
    }

    private beforeSaveEvent(observableSaveArgs: BeforeSaveEventArgs, type: string, fileName: string, imageName: string): void {
        const parent: ImageEditor = this.parent;
        if (!observableSaveArgs.cancel) {
            parent.currObjType.isSave = true;
            fileName = observableSaveArgs.fileName ? observableSaveArgs.fileName : fileName;
            const lowerCaseType: string = type.toLowerCase();
            fileName = fileName || imageName;
            if (lowerCaseType === 'svg') {
                this.toSVGImg(fileName);
            } else {
                this.toBlobFn(fileName, lowerCaseType);
            }
            const saved: SaveEventArgs = { fileName: fileName ? fileName : imageName, fileType: type as FileType};
            parent.trigger('saved', saved);
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
            }
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

    private toBlobFn(fileName: string, type: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: this = this;
        const parent: ImageEditor = this.parent;
        showSpinner(parent.element);
        parent.element.style.opacity = '0.5';
        const tempCanvas: HTMLCanvasElement = this.exportToCanvas();
        // eslint-disable-next-line @typescript-eslint/tslint/config
        tempCanvas.toBlob(function(blob){
            const blobUrl: string = URL.createObjectURL(blob);
            proxy.downloadImg(blobUrl, fileName + '.' + type);
            hideSpinner(parent.element);
            parent.element.style.opacity = '1';
        }, 'image/png');
    }

    private exportToCanvas(object?: Object): HTMLCanvasElement {
        const parent: ImageEditor = this.parent;
        const obj: Object = {width: 0, height: 0 };
        parent.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
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
        let maxDimension: Dimension;
        const tempCanvas: HTMLCanvasElement = parent.createElement('canvas', {
            id: parent.element.id + '_tempCanvas', attrs: { name: 'canvasImage' }
        });
        const tempContext: CanvasRenderingContext2D = tempCanvas.getContext('2d');
        tempContext.filter = this.lowerContext.filter;
        if (parent.currSelectionPoint) {
            tempCanvas.width = parent.img.destWidth; tempCanvas.height = parent.img.destHeight;
            tempContext.filter = this.lowerContext.filter;
            const temp: string = this.lowerContext.filter;
            parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
            tempContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                                  parent.img.srcHeight, 0, 0, parent.img.destWidth, parent.img.destHeight);
            this.lowerContext.filter = temp;
        } else {
            tempCanvas.width = parent.baseImg.width; tempCanvas.height = parent.baseImg.height;
            const obj: Object = {width: 0, height: 0 };
            parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
                value: {width: parent.baseImg.width, height: parent.baseImg.height, obj: obj}});
            maxDimension = obj as Dimension;
            tempCanvas.style.maxWidth = maxDimension.width + 'px'; tempCanvas.style.maxHeight = maxDimension.height + 'px';
            tempContext.filter = this.lowerContext.filter;
            const temp: string = this.lowerContext.filter;
            parent.notify('filter', { prop: 'updateBrightFilter', onPropertyChange: false});
            tempContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                                  parent.img.srcHeight, 0, 0, parent.baseImg.width, parent.baseImg.height);
            this.lowerContext.filter = temp;
        }
        if (parent.transform.degree !== 0 || parent.transform.currFlipState !== '') {
            this.updateSaveContext(tempContext);
            this.exportTransformedImage(tempContext);
        }
        if (parent.objColl.length > 0) {
            const temp: string = tempContext.filter;
            tempContext.filter = 'none';
            const tempObjColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
            for (let i: number = 0, len: number = parent.objColl.length ; i < len; i++) {
                const activePoint: ActivePoint = parent.objColl[i as number].activePoint;
                // Subtracting destination left and top points
                activePoint.startX -= parent.img.destLeft;
                activePoint.startY -= parent.img.destTop;
                activePoint.endX -= parent.img.destLeft;
                activePoint.endY -= parent.img.destTop;
                activePoint.width = activePoint.endX - activePoint.startX;
                activePoint.height = activePoint.endY - activePoint.startY;
                // Manipulating points
                if (isNullOrUndefined(parent.currSelectionPoint)) {
                    activePoint.startX *= ratio.width;
                    activePoint.startY *= ratio.height;
                    activePoint.endX *= ratio.width;
                    activePoint.endY *= ratio.height;
                    activePoint.width = activePoint.endX - activePoint.startX;
                    activePoint.height = activePoint.endY - activePoint.startY;
                    parent.objColl[i as number].strokeSettings.strokeWidth *= ((ratio.width + ratio.height) / 2);
                    if (parent.objColl[i as number].shape === 'text') {
                        parent.objColl[i as number].textSettings.fontSize *= ((ratio.width + ratio.height) / 2);
                    }
                }
                parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'saveContext', obj: parent.objColl[i as number], isCropRatio: null,
                    points: null, isPreventDrag: true, saveContext: tempContext, isPreventSelection: null} });
            }
            tempContext.filter = temp;
            parent.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
            parent.objColl = tempObjColl;
        }
        if (parent.freehandCounter > 0) {
            // eslint-disable-next-line
            const tempPointColl: any = extend({}, parent.pointColl, {}, true);
            for (let n: number = 0; n < parent.freehandCounter; n++) {
                parent.points = extend([], parent.pointColl[n as number].points, []) as Point[];
                parent.notify('freehand-draw', { prop: 'setPointCounter', onPropertyChange: false, value: {value: 0 }});
                const len: number = parent.points.length;
                if (parent.currSelectionPoint) {
                    for (let l: number = 0; l < len; l++) {
                        parent.points[l as number].x -= parent.img.destLeft;
                        parent.points[l as number].y -= parent.img.destTop;
                    }
                } else {
                    parent.pointColl[n as number].strokeWidth *= ((ratio.width + ratio.height) / 2);
                    for (let l: number = 0; l < len; l++) {
                        parent.points[l as number].x = (parent.points[l as number].x - parent.img.destLeft) * ratio.width;
                        parent.points[l as number].y = (parent.points[l as number].y - parent.img.destTop) * ratio.height;
                    }
                }
            }
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: tempContext, points: null} });
            parent.pointColl = tempPointColl;
        }
        if (parent.isCircleCrop) {
            parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                value: {context: tempContext, isSave: true, isFlip: null}});
        }
        this.lowerContext.filter = tempContextFilter;
        if (object) { object['canvas'] = tempCanvas; }
        return tempCanvas;
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
        parent.transform.degree = degree;
    }

    private exportRotate(tempContext: CanvasRenderingContext2D, degree: number): void {
        const parent: ImageEditor = this.parent;
        if (isNullOrUndefined(parent.currSelectionPoint)) {
            this.setMaxDim(parent.transform.degree, tempContext.canvas);
            tempContext.translate(tempContext.canvas.width / 2, tempContext.canvas.height / 2);
            tempContext.rotate(Math.PI / 180 * degree);
            tempContext.drawImage(parent.inMemoryCanvas, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                                  parent.img.srcHeight, -tempContext.canvas.height / 2, -tempContext.canvas.width / 2,
                                  tempContext.canvas.height, tempContext.canvas.width);
        } else {
            tempContext.translate(tempContext.canvas.width / 2, tempContext.canvas.height / 2);
            tempContext.rotate(Math.PI / 180 * degree);
            tempContext.drawImage(parent.inMemoryCanvas, -tempContext.canvas.height / 2, -tempContext.canvas.width / 2,
                                  tempContext.canvas.height, tempContext.canvas.width);
        }
        this.updateSaveContext(tempContext);
    }

    private exportFlip(tempContext: CanvasRenderingContext2D, flipHorizontal: boolean, flipVertical: boolean): void {
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
            newWidth = this.parent.baseImg.height; newHeight = this.parent.baseImg.width;
        } else if (degree % 180 === 0 || degree === 0) {
            newWidth = this.parent.baseImg.width; newHeight = this.parent.baseImg.height;
        }
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        const obj: Object = {width: 0, height: 0 };
        this.parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: newWidth, height: newHeight, obj: obj}});
        const maxDimension: Dimension = obj as Dimension;
        tempCanvas.style.maxWidth = maxDimension.width + 'px';
        tempCanvas.style.maxHeight = maxDimension.height + 'px';
    }
}
