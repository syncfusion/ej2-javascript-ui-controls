import { EventHandler, extend, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CurrentObject, ImageEditor, Point, SelectionPoint, CropSelectionSettings, ShapeChangeEventArgs, ShapeSettings, ShapeType, StrokeSettings, TextSettings, ArrowheadType, ActivePoint } from '../index';

export class Shape {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private textSettings: TextSettings =
    {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false};
    private strokeSettings: StrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
    private keyHistory: string = '';  // text history
    private prevObj: CurrentObject;

    constructor(parent: ImageEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on('shape', this.shape, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('shape', this.shape);
        this.parent.off('destroyed', this.destroy);
    }

    private shape(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        this.initShapePvtProps();
        switch (args.prop) {
        case 'drawEllipse':
            this.drawEllipse(args.value['x'], args.value['y'], args.value['radiusX'], args.value['radiusY'],
                             args.value['strokeWidth'], args.value['strokeColor'], args.value['fillColor']);
            break;
        case 'drawLine':
            this.drawLine(args.value['startX'], args.value['startY'], args.value['endX'], args.value['endY'],
                          args.value['strokeWidth'], args.value['strokeColor']);
            break;
        case 'drawArrow':
            this.drawArrow(args.value['startX'], args.value['startY'], args.value['endX'], args.value['endY'],
                           args.value['strokeWidth'], args.value['strokeColor'], args.value['arrowStart'],
                           args.value['arrowEnd']);
            break;
        case 'drawPath':
            this.drawPath(args.value['pointColl'], args.value['strokeWidth'], args.value['strokeColor']);
            break;
        case 'drawRectangle':
            this.drawRectangle(args.value['x'], args.value['y'], args.value['width'], args.value['height'],
                               args.value['strokeWidth'], args.value['strokeColor'], args.value['fillColor']);
            break;
        case 'drawText':
            this.drawText(args.value['x'], args.value['y'], args.value['text'], args.value['fontFamily'],
                          args.value['fontSize'], args.value['bold'], args.value['italic'], args.value['color']);
            break;
        case 'redrawActObj':
            this.redrawActObj(args.value['x'], args.value['y'], args.value['isMouseDown']);
            break;
        case 'apply':
            this.apply(args.value['shape'], args.value['obj'], args.value['canvas']);
            break;
        case 'updateShapeChangeEventArgs':
            this.updateShapeChangeEventArgs(args.value['shapeSettings']);
            break;
        case 'updSelChangeEventArgs':
            this.updSelChangeEventArgs(args.value['selectionSettings']);
            break;
        case 'iterateObjColl':
            this.iterateObjColl();
            break;
        case 'updImgRatioForActObj':
            this.updImgRatioForActObj();
            break;
        case 'zoomObjColl':
            this.zoomObjColl(args.value['isPreventApply']);
            break;
        case 'redrawObj':
            this.redrawObj(args.value['degree']);
            break;
        case 'rotateObjColl':
            this.rotateObjColl();
            break;
        case 'draw-shape-text':
            this.drawShapeText();
            break;
        case 'redraw-text':
            this.redrawText();
            break;
        case 'draw-shape':
            this.drawShape(args.value['obj'] as string, args.value['strokeWidth'], args.value['strokeColor'],
                           args.value['fillColor'], args.value['start'], args.value['width'], args.value['height']);
            break;
        case 'renderTextArea':
            this.renderTextArea(args.value['x'], args.value['y'], args.value['actObj']);
            break;
        case 'setTextBoxWidth':
            this.setTextBoxWidth(args.value['e']);
            break;
        case 'findTextTarget':
            this.findTextTarget(args.value['e']);
            break;
        case 'panObjColl':
            this.panObjColl(args.value['xDiff'], args.value['yDiff'], args.value['panRegion']);
            break;
        case 'updateFontStyles':
            this.updateFontStyles(args.value['isTextBox']);
            break;
        case 'applyFontStyle':
            this.applyFontStyle(args.value['item']);
            break;
        case 'updateFontRatio':
            this.updateFontRatio(args.value['obj'], args.value['isTextArea']);
            break;
        case 'updateFontSize':
            this.updateFontSize(args.value['obj']);
            break;
        case 'updateObjColl':
            this.updateObjColl(args.value['item'], args.value['objColl']);
            break;
        case 'pushActItemIntoObj':
            this.pushActItemIntoObj();
            break;
        case 'clearActObj':
            this.clearActObj();
            break;
        case 'refreshActiveObj':
            this.refreshActiveObj();
            break;
        case 'applyActObj':
            this.applyActObj(args.value['isMouseDown']);
            break;
        case 'wireEvent':
            EventHandler.add(this.parent.upperCanvas, 'dblclick', this.findTextTarget, this);
            EventHandler.add(this.parent.textArea, 'mousedown', this.findTextTarget, this);
            break;
        case 'unWireEvent':
            EventHandler.remove(this.parent.upperCanvas, 'dblclick', this.findTextTarget);
            EventHandler.remove(this.parent.textArea, 'mousedown', this.findTextTarget);
            break;
        case 'getShapeSetting':
            this.getShapeSetting(args.value['id'], args.value['obj']);
            break;
        case 'getShapeSettings':
            this.getShapeSettings(args.value['obj']);
            break;
        case 'isPointsInRange':
            this.isPointsInRange(args.value['x'], args.value['y'], args.value['obj']);
            break;
        case 'alignRotateFlipColl':
            this.alignRotateFlipColl(args.value['collection'], args.value['isRotateFlipCollection'],
                                     args.value['obj']);
            break;
        case 'selectShape':
            this.selectShape(args.value['id'], args.value['obj']);
            break;
        case 'deleteShape':
            this.deleteShape(args.value['id']);
            break;
        case 'getMaxText':
            this.getMaxText(args.value['isTextBox'], args.value['text'], args.value['obj']);
            break;
        case 'setPointCollForLineArrow':
            args.value['obj'].pointColl = this.getLinePoints(args.value['obj'].activePoint.startX,
                                                             args.value['obj'].activePoint.startY, args.value['obj'].activePoint.endX,
                                                             args.value['obj'].activePoint.endY);
            break;
        case 'setPointCollForShapeRotation':
            this.setPointCollForShapeRotation(args.value['obj']);
            break;
        case 'setTextSettings':
            if (args.value['textSettings']) {
                this.textSettings = args.value['textSettings'];
            } else if (args.value['fontFamily']) {
                this.textSettings.fontFamily = args.value['fontFamily'];
            } else if (args.value['fontSize']) {
                this.textSettings.fontSize = args.value['fontSize'];
            }
            break;
        case 'setStrokeSettings':
            if (args.value['strokeSettings']) {
                this.strokeSettings = args.value['strokeSettings'];
            } else if (args.value['strokeColor']) {
                this.strokeSettings.strokeColor = args.value['strokeColor'];
            }  else if (args.value['fillColor']) {
                this.strokeSettings.fillColor = args.value['fillColor'];
            } else if (args.value['strokeWidth']) {
                this.strokeSettings.strokeWidth = args.value['strokeWidth'];
            }
            break;
        case 'getStrokeSettings':
            args.value['obj']['strokeSettings'] = this.strokeSettings;
            break;
        case 'setKeyHistory':
            this.keyHistory = args.value['keyHistory'];
            break;
        case 'getKeyHistory':
            args.value['obj']['keyHistory'] = this.keyHistory;
            break;
        case 'setTextBoxPos':
            this.setTextBoxPos(args.value['actObj'], args.value['degree'], args.value['flip'], args.value['x'], args.value['y']);
            break;
        case 'setTextBoxPoints':
            this.setTextBoxPoints(args.value['actObj'], args.value['degree'], args.value['flip'], args.value['x'], args.value['y']);
            break;
        case 'alignTextAreaIntoCanvas':
            this.alignTextAreaIntoCanvas();
            break;
        case 'initializeTextShape':
            this.initializeTextShape(args.value['text'], args.value['fontFamily'], args.value['fontSize'],
                                     args.value['bold'], args.value['italic'], args.value['strokeColor']);
            break;
        case 'stopPathDrawing':
            this.stopPathDrawing(args.value['e']);
            break;
        case 'updateArrowRatio':
            this.updateArrowRatio(args.value['obj']);
            break;
        case 'getSquarePointForRotatedShape':
            this.getSquarePointForRotatedShape(args.value['obj'], args.value['object']);
            break;
        case 'reset':
            this.reset();
            break;
        }
    }

    public getModuleName(): string {
        return 'shape';
    }

    private initShapePvtProps(): void {
        if (this.parent.lowerCanvas) {this.lowerContext = this.parent.lowerCanvas.getContext('2d'); }
        if (this.parent.upperCanvas) {this.upperContext = this.parent.upperCanvas.getContext('2d'); }
    }

    private reset(): void {
        this.textSettings =
            {text: 'Enter Text', fontFamily: 'Arial', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false};
        this.strokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
    }

    private drawEllipse(x?: number, y?: number, radiusX?: number, radiusY?: number, strokeWidth?: number, strokeColor?: string,
                        fillColor?: string, degree?: number): void {
        this.initializeShape('ellipse');
        const start: Point = x && y ? {x: x, y: y} : null;
        this.drawShape('ellipse', strokeWidth, strokeColor, fillColor, start, radiusX, radiusY, null, null,
                       null, degree);
    }

    private drawLine(startX?: number, startY?: number, endX?: number, endY?: number, strokeWidth?: number, strokeColor?: string): void {
        this.initializeShape('line');
        const start: Point = startX && startY ? {x: startX, y: startY} : null;
        const width: number = endX - startX; const height: number = endY - startY;
        this.drawShape('line', strokeWidth, strokeColor, null, start, width, height);
    }

    private drawPath(pointColl: Point[], strokeWidth?: number, strokeColor?: string): void {
        this.initializeShape('path');
        if (pointColl) {
            this.drawShape('path', strokeWidth, strokeColor, null, null, null, null, pointColl);
        } else {
            this.drawShape('line', strokeWidth, strokeColor, null, null, null, null);
            const obj: SelectionPoint = extend({}, this.parent.objColl[this.parent.objColl.length - 1], null, true) as SelectionPoint;
            obj.shape = 'path'; obj.lineDraw = null;
            obj.pointColl = [{x: obj.activePoint.startX, y: obj.activePoint.startY},
                {x: obj.activePoint.endX, y: obj.activePoint.endY }];
            this.parent.objColl[this.parent.objColl.length - 1] = obj;
        }
    }

    private drawArrow(startX?: number, startY?: number, endX?: number, endY?: number, strokeWidth?: number,
                      strokeColor?: string, arrowStart?: ArrowheadType, arrowEnd?: ArrowheadType): void {
        this.initializeShape('arrow');
        const start: Point = startX && startY ? {x: startX, y: startY} : null;
        const width: number = endX - startX; const height: number = endY - startY;
        this.drawShape('arrow', strokeWidth, strokeColor, null, start, width, height, null, arrowStart, arrowEnd);
    }

    private drawRectangle(x?: number, y?: number, width?: number, height?: number, strokeWidth?: number, strokeColor?: string,
                          fillColor?: string, degree?: number): void {
        this.initializeShape('rectangle');
        const start: Point = x && y ? {x: x, y: y} : null;
        this.drawShape('rectangle', strokeWidth, strokeColor, fillColor, start, width, height, null,
                       null, null, degree);
    }

    private drawText(x?: number, y?: number, text?: string, fontFamily?: string, fontSize?: number, bold?: boolean, italic?: boolean,
                     color?: string): void {
        this.drawShapeText(text, fontFamily, fontSize, bold, italic, color, x, y);
    }

    private initializeShape(type: string): void {
        this.redrawActObj();
        this.parent.activeObj.shape = type;
        if (this.parent.currObjType.shape === 'freehanddraw') {
            this.apply(); this.parent.upperCanvas.style.cursor = this.parent.cursor = 'default';
            this.parent.currObjType.shape = '';
        }
        this.parent.currObjType.isCustomCrop = false;
    }

    private updateWidthHeight(obj: SelectionPoint): SelectionPoint {
        obj.activePoint.width = obj.activePoint.endX - obj.activePoint.startX;
        obj.activePoint.height = obj.activePoint.endY - obj.activePoint.startY;
        return obj;
    }

    private setDimension(width: number, height: number): void {
        if (width && height) {
            this.parent.activeObj.activePoint.width = width; this.parent.activeObj.activePoint.height = height;
            if (this.parent.currObjType.shape.toLowerCase() === 'ellipse') {
                this.parent.activeObj.activePoint.width = 2 * width;
                this.parent.activeObj.activePoint.height = 2 * height;
            }
        }
    }

    private getArrowType(type: ArrowheadType): string {
        let arrowType: string = type;
        if (type) {
            const typeToArrowType: Object = {'None': 'none', 'Arrow': 'arrow', 'SolidArrow': 'arrowSolid',
                'Circle': 'circle', 'SolidCircle': 'circleSolid', 'Square': 'square', 'SolidSquare': 'squareSolid', 'Bar': 'bar' };
            arrowType = typeToArrowType[`${type}`];
        }
        return arrowType;
    }

    private drawShape(type: string, strokeWidth?: number, strokeColor?: string, fillColor?: string, start?: Point, width?: number,
                      height?: number, pointColl?: Point[], arrowStart?: ArrowheadType, arrowEnd?: ArrowheadType, degree?: number): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
            this.redrawActObj();
            const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
            parent.togglePen = false; this.keyHistory = '';
            this.parent.upperCanvas.style.display = 'block'; this.refreshActiveObj();
            parent.currObjType.shape = type;
            if (parent.currObjType.shape.toLowerCase() === 'path' && isNullOrUndefined(pointColl)) {
                parent.activeObj.shape = parent.currObjType.shape.toLowerCase();
                parent.activeObj.pointColl = [];
                parent.upperCanvas.style.cursor = this.parent.cursor = 'crosshair';
                parent.notify('selection', { prop: 'setCurrentDrawingShape', onPropertyChange: false, value: {value: 'path' }});
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'shapes',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
                }
            } else {
                if (parent.currObjType.shape.toLowerCase() !== 'freehanddraw' && parent.currObjType.shape.toLowerCase() !== '') {
                    parent.activeObj.shape = parent.currObjType.shape.toLowerCase();
                    this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                    if (isNullOrUndefined(parent.activeObj.strokeSettings)) {
                        parent.activeObj.strokeSettings = this.strokeSettings;
                    }
                    if (parent.currObjType.shape.toLowerCase() === 'path' && pointColl) {
                        parent.activeObj.pointColl = pointColl;
                    }
                    parent.activeObj.strokeSettings.strokeWidth = strokeWidth ? strokeWidth : parent.activeObj.strokeSettings.strokeWidth;
                    parent.activeObj.strokeSettings.strokeColor = strokeColor ? strokeColor : parent.activeObj.strokeSettings.strokeColor;
                    parent.activeObj.strokeSettings.fillColor = fillColor ? fillColor : parent.activeObj.strokeSettings.fillColor;
                    const tempWidth: number = parent.img.destWidth > 100 ? 100 : parent.img.destWidth / 2;
                    const tempHeight: number = parent.img.destHeight > 100 ? 100 : parent.img.destHeight / 2;
                    parent.activeObj.activePoint.width = tempWidth; parent.activeObj.activePoint.height = tempHeight;
                    if (parent.currObjType.shape.toLowerCase() === 'line' || parent.currObjType.shape.toLowerCase() === 'arrow') {
                        parent.activeObj.lineDraw = 'horizontal'; parent.activeObj.activePoint.height = 0;
                        if (parent.currObjType.shape.toLowerCase() === 'arrow') {
                            parent.activeObj.activePoint.width += 50;
                            parent.activeObj.start = this.getArrowType(arrowStart); parent.activeObj.end = this.getArrowType(arrowEnd);
                        }
                    } else if (parent.currObjType.shape.toLowerCase() === 'rectangle') {
                        parent.activeObj.activePoint.width += parent.activeObj.activePoint.width / 2;
                    }
                    this.setDimension(width, height);
                    if (start) {
                        parent.activeObj.activePoint.startX = start.x; parent.activeObj.activePoint.startY = start.y;
                        parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX +
                            parent.activeObj.activePoint.width;
                        parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY +
                            parent.activeObj.activePoint.height;
                    } else {
                        this.setCenterPoints();
                    }
                    this.setPointCollForLineAndArrow();
                    if (parent.currObjType.shape.toLowerCase() === 'arrow') {
                        parent.activeObj.triangleDirection = 'right';
                    }
                    parent.currObjType.isDragging = parent.currObjType.isCustomCrop = false;
                    this.initShapeProps();
                    const obj: Object = {shapeSettingsObj: {} as ShapeSettings };
                    parent.notify('selection', { prop: 'updatePrevShapeSettings', onPropertyChange: false, value: {obj: obj}});
                    const shapeSettings: ShapeSettings = obj['shapeSettingsObj'];
                    const shapeChangingArgs: ShapeChangeEventArgs = {action: 'insert', previousShapeSettings: shapeSettings,
                        currentShapeSettings: shapeSettings};
                    if (isBlazor() && parent.events && parent.events.shapeChanging.hasDelegate === true) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (this.parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShape', shapeChangingArgs) as any).then((shapeChangingArgs: ShapeChangeEventArgs) => {
                            this.updateShapeChangeEventArgs(shapeChangingArgs.currentShapeSettings);
                            this.setDimension(width, height);
                            parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate'}});
                            if (degree) {
                                parent.activeObj.rotatedAngle = degree * (Math.PI / 180);
                                parent.notify('selection', {prop: 'updPtCollForShpRot', onPropertyChange: false, value: {obj: parent.activeObj }});
                            }
                            parent.updateToolbar(parent.element, 'quickAccessToolbar', 'shape');
                            parent.notify('selection', { prop: 'isShapeInserted', onPropertyChange: false, value: {bool: true} });
                            parent.notify('undo-redo', { prop: 'updateUrObj', onPropertyChange: false, value: {objColl: objColl}});
                            if (parent.isPublicMethod) {
                                parent.notify('undo-redo', {prop: 'updateUndoRedo', onPropertyChange: false});
                            }
                            parent.isPublicMethod = false;
                        });
                    } else {
                        parent.trigger('shapeChanging', shapeChangingArgs);
                        this.updateShapeChangeEventArgs(shapeChangingArgs.currentShapeSettings);
                        this.setDimension(width, height);
                        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate'}});
                        if (degree) {
                            parent.activeObj.rotatedAngle = degree * (Math.PI / 180);
                            parent.notify('selection', {prop: 'updPtCollForShpRot', onPropertyChange: false, value: {obj: parent.activeObj }});
                        }
                        if (!isBlazor()) {
                            parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
                        } else {
                            parent.updateToolbar(parent.element, 'quickAccessToolbar', 'shape');
                        }
                        parent.notify('selection', { prop: 'isShapeInserted', onPropertyChange: false, value: {bool: true} });
                        parent.notify('undo-redo', { prop: 'updateUrObj', onPropertyChange: false, value: {objColl: objColl}});
                        parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'shapes',
                            isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                        parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
                        if (parent.isPublicMethod) {
                            parent.notify('undo-redo', {prop: 'updateUndoRedo', onPropertyChange: false});
                        }
                        parent.isPublicMethod = false;
                    }
                }
            }
        }
    }

    private initShapeProps(): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.shapeDegree = parent.transform.degree;
        parent.activeObj.shapeFlip = parent.transform.currFlipState;
        parent.activeObj.textFlip = parent.transform.currFlipState;
        parent.activeObj.flipObjColl = [];
    }

    private setPointCollForLineAndArrow(): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.shape === 'line' || parent.activeObj.shape === 'arrow') {
            parent.activeObj.pointColl = this.getLinePoints(parent.activeObj.activePoint.startX, parent.activeObj.activePoint.startY,
                                                            parent.activeObj.activePoint.endX, parent.activeObj.activePoint.endY);
            if (parent.activeObj.pointColl) {
                for (let i: number = 0, len: number = parent.activeObj.pointColl.length; i < len; i++) {
                    parent.activeObj.pointColl[i as number].ratioX = (parent.activeObj.pointColl[i as number].x -
                        parent.img.destLeft) / parent.img.destWidth;
                    parent.activeObj.pointColl[i as number].ratioY = (parent.activeObj.pointColl[i as number].y -
                        parent.img.destTop) / parent.img.destHeight;
                }
            }
        }
    }

    private prevObjColl(): void {
        const parent: ImageEditor = this.parent;
        const object: Object = {currObj: {} as CurrentObject };
        parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        this.prevObj = object['currObj'];
        this.prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
        this.prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
        this.prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        this.prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
    }

    private drawShapeText(text?: string, fontFamily?: string, fontSize?: number, bold?: boolean, italic?: boolean,
                          strokeColor?: string, x?: number, y?: number): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            if (parent.currObjType.shape === 'freehanddraw') {
                this.apply();
                parent.upperCanvas.style.cursor = parent.cursor = 'default';
                parent.currObjType.shape = '';
            }
            parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
            parent.togglePen = false; this.redrawActObj();
            this.prevObjColl();
            this.refreshActiveObj(); parent.activeObj.shape = parent.currObjType.shape = 'text';
            parent.currObjType.isCustomCrop = false;
            this.initializeTextShape(text, fontFamily, fontSize, bold, italic, strokeColor);
            parent.currObjType.isText = parent.currObjType.isInitialText = true;
            if (isNullOrUndefined(parent.activeObj.textSettings.fontSize)) {
                if (parent.img.destWidth > parent.img.destHeight) {
                    parent.activeObj.textSettings.fontSize = (parent.img.destWidth / 15);
                }
                else {
                    parent.activeObj.textSettings.fontSize = (parent.img.destHeight / 15);
                }
                if (parent.activeObj.textSettings.fontSize < 20) {
                    parent.activeObj.textSettings.fontSize = 20;
                }
            }
            if (parent.img.destWidth < 100) {
                parent.activeObj.textSettings.fontSize = Math.floor((parent.img.destWidth / 20));
            } else if (parent.img.destHeight < 100) {
                parent.activeObj.textSettings.fontSize = Math.floor((parent.img.destHeight / 20));
            }
            parent.activeObj.shapeDegree = parent.transform.degree;
            parent.activeObj.shapeFlip = parent.transform.currFlipState;
            parent.activeObj.flipObjColl = []; this.updateFontStyles();
            const width: number = this.upperContext.measureText(parent.activeObj.textSettings.text).width +
            parent.activeObj.textSettings.fontSize * 0.5;
            const height: number = parent.activeObj.textSettings.fontSize + parent.activeObj.textSettings.fontSize * 0.25;
            if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
                parent.activeObj.activePoint.startX = x; parent.activeObj.activePoint.startY = y;
                parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + width;
                parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY + height;
            } else {
                this.setCenterPoints(true, width, height);
            }
            const obj: Object = {shapeSettingsObj: {} as ShapeSettings };
            parent.notify('selection', { prop: 'updatePrevShapeSettings', onPropertyChange: false, value: {obj: obj}});
            const shapeSettings: ShapeSettings = obj['shapeSettingsObj'];
            const shapeChangingArgs: ShapeChangeEventArgs = {action: 'insert', previousShapeSettings: shapeSettings,
                currentShapeSettings: shapeSettings};
            if (isBlazor() && parent.events && parent.events.shapeChanging.hasDelegate === true) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                (parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShape', shapeChangingArgs) as any).then((shapeChangingArgs: ShapeChangeEventArgs) => {
                    this.drawShapeTextEvent(shapeChangingArgs);
                    if (parent.isPublicMethod) {
                        parent.notify('undo-redo', {prop: 'updateUndoRedo', onPropertyChange: false});
                    }
                    parent.isPublicMethod = false;
                });
            } else {
                parent.trigger('shapeChanging', shapeChangingArgs);
                this.drawShapeTextEvent(shapeChangingArgs);
                if (parent.isPublicMethod) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedo', onPropertyChange: false});
                }
                parent.isPublicMethod = false;
            }
        }
    }

    private drawShapeTextEvent(shapeChangingArgs: ShapeChangeEventArgs): void {
        const parent: ImageEditor = this.parent;
        this.updateShapeChangeEventArgs(shapeChangingArgs.currentShapeSettings);
        this.addLetter(parent.activeObj.textSettings.text);
        parent.activeObj.textFlip = parent.transform.currFlipState;
        this.updateFontRatio(parent.activeObj);
        parent.objColl.push(parent.activeObj);
        const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: 'shapeTransform', previousObj: this.prevObj, previousObjColl: this.prevObj.objColl,
                previousPointColl: this.prevObj.pointColl, previousSelPointColl: this.prevObj.selPointColl,
                previousCropObj: prevCropObj, previousText: null,
                currentText: null, previousFilter: null, isCircleCrop: null}});
        parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false,
            value: {obj: parent.objColl[parent.objColl.length - 1]}});
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
        }  else {
            parent.updateToolbar(parent.element, 'quickAccessToolbar', 'text');
        }
        parent.notify('selection', { prop: 'isShapeInserted', onPropertyChange: false, value: {bool: true} });
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'text',
                isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
            parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
        } else {
            parent.updateToolbar(parent.element, 'text');
        }
    }

    private initializeTextShape(text?: string, fontFamily?: string, fontSize?: number, bold?: boolean, italic?: boolean,
                                strokeColor?: string): void {
        const parent: ImageEditor = this.parent;
        this.keyHistory = ''; parent.upperCanvas.style.display = 'block';
        if (isNullOrUndefined(parent.activeObj.textSettings)) {
            parent.activeObj.textSettings = this.textSettings;
        }
        if (isNullOrUndefined(parent.activeObj.strokeSettings)) {
            parent.activeObj.strokeSettings = this.strokeSettings;
        }
        parent.activeObj.strokeSettings.strokeColor = strokeColor || parent.activeObj.strokeSettings.strokeColor;
        parent.activeObj.textSettings.text = text || parent.activeObj.textSettings.text;
        parent.activeObj.textSettings.fontFamily = fontFamily || parent.activeObj.textSettings.fontFamily;
        parent.activeObj.textSettings.fontSize = fontSize || parent.activeObj.textSettings.fontSize;
        parent.activeObj.textSettings.bold = bold || parent.activeObj.textSettings.bold;
        parent.activeObj.textSettings.italic = italic || parent.activeObj.textSettings.italic;
    }

    private redrawActObj(x?: number, y?: number, isMouseDown?: boolean): void {
        let splitWords: string[];
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.shape) {splitWords = parent.activeObj.shape.split('-'); }
        if (parent.activeObj.horTopLine && (parent.activeObj.shape && splitWords[0] !== 'crop')) {
            if (parent.textArea.style.display === 'block') {
                parent.notify('selection', { prop: 'setTextBoxStylesToActObj', onPropertyChange: false });
                this.updateFontRatio(parent.activeObj, true);
                if (x && y) {
                    if ((x !== parent.activeObj.activePoint.startX) && (y !== parent.activeObj.activePoint.startY)) {
                        this.updateTextFromTextArea(); this.applyActObj();
                    }
                } else {
                    this.updateTextFromTextArea();
                    this.apply(parent.activeObj.shape, parent.activeObj);
                    parent.objColl.push(parent.activeObj);
                    this.refreshActiveObj(); parent.textArea.style.transform = '';
                    parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
                }
            } else {
                this.applyActObj(isMouseDown);
            }
        }
    }

    private apply(shape?: string, obj?: SelectionPoint, canvas?: string): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled) {
            if (parent.togglePen && !parent.currObjType.isCustomCrop) {
                const destLeft: number = parent.img.destLeft; const destTop: number = parent.img.destTop;
                const destWidth: number = parent.img.destWidth; const destHeight: number = parent.img.destHeight;
                parent.notify('draw', { prop: 'callUpdateCurrTransState', onPropertyChange: false});
                const temp: string = this.lowerContext.filter; this.lowerContext.filter = 'none';
                parent.togglePen = false; this.iterateObjColl();
                parent.notify('freehandDraw', { prop: 'freehandRedraw', onPropertyChange: false,
                    value: {context: this.lowerContext, points: null} });
                parent.togglePen = false;
                if (parent.isCircleCrop || (parent.currSelectionPoint &&
                    parent.currSelectionPoint.shape === 'crop-circle')) {
                    parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                        value: {context: this.lowerContext, isSave: null, isFlip: null}});
                }
                parent.img.destLeft = destLeft; parent.img.destTop = destTop; parent.img.destWidth = destWidth;
                parent.img.destHeight = destHeight; this.lowerContext.filter = temp;
            }
            else {
                canvas = canvas ? canvas : 'original';
                if (isNullOrUndefined(parent.activeObj.shape) && isNullOrUndefined(shape)) {
                    parent.currObjType.shape = '';
                } else {
                    parent.currObjType.shape = shape || parent.currObjType.shape;
                }
                if (parent.currObjType.shape !== '') {
                    this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                    if (parent.activeObj.shape === 'text') {
                        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: canvas, obj: obj, isCropRatio: null,
                            points: null, isPreventDrag: true, saveContext: null, isPreventSelection: null} });
                        parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
                    } else {
                        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: canvas, obj: obj} });
                    }
                    parent.activeObj.shape = parent.currObjType.shape.toLowerCase();
                    if (!shape && parent.currObjType.shape !== '' && !parent.currObjType.isCustomCrop) {
                        parent.objColl.push(extend({}, parent.activeObj, {}, true) as SelectionPoint);
                    }
                    this.keyHistory = '';
                }
            }
        }
    }

    private setCenterPoints(text?: boolean, width?: number, height?: number): void {
        const parent: ImageEditor = this.parent;
        let renderWidth: number; let renderHeight: number;
        if (text && width && height) { renderWidth = width; renderHeight = height; }
        else {renderWidth = parent.activeObj.activePoint.width; renderHeight = parent.activeObj.activePoint.height; }
        parent.activeObj.activePoint.startX = (parent.lowerCanvas.width / 2) - renderWidth / 2;
        parent.activeObj.activePoint.startY = (parent.lowerCanvas.height / 2) - renderHeight / 2;
        parent.activeObj.activePoint.endX = (parent.lowerCanvas.width / 2) + renderWidth / 2;
        parent.activeObj.activePoint.endY = (parent.lowerCanvas.height / 2) + renderHeight / 2;
    }

    private updSelChangeEventArgs(selectionSettings: CropSelectionSettings): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.activePoint.startX = selectionSettings.startX;
        parent.activeObj.activePoint.startY = selectionSettings.startY;
        parent.activeObj.activePoint.width = selectionSettings.width;
        parent.activeObj.activePoint.height = selectionSettings.height;
        parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + parent.activeObj.activePoint.width;
        parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY + parent.activeObj.activePoint.height;
    }

    private updateShapeChangeEventArgs(shapeSettings: ShapeSettings): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.currIndex = shapeSettings.id;
        parent.activeObj.activePoint.startX = shapeSettings.startX;
        parent.activeObj.activePoint.startY = shapeSettings.startY;
        parent.activeObj.activePoint.width = shapeSettings.width;
        parent.activeObj.activePoint.height = shapeSettings.height;
        parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + parent.activeObj.activePoint.width;
        parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY + parent.activeObj.activePoint.height;
        parent.activeObj.strokeSettings.strokeColor = shapeSettings.strokeColor;
        parent.activeObj.strokeSettings.fillColor = shapeSettings.fillColor;
        switch (parent.activeObj.shape) {
        case 'ellipse':
            parent.activeObj.activePoint.width = shapeSettings.radius / 2;
            break;
        case 'line':
        case 'arrow':
            parent.activeObj.activePoint.width = shapeSettings.length;
            break;
        case 'text':
            parent.activeObj.keyHistory = parent.activeObj.textSettings.text = shapeSettings.text;
            parent.activeObj.textSettings.fontSize = shapeSettings.fontSize;
            parent.activeObj.strokeSettings.strokeColor = shapeSettings.color;
            parent.activeObj.textSettings.fontFamily = shapeSettings.fontFamily;
            break;
        case 'rectangle':
            break;
        }
        if (parent.activeObj.shape === 'text' && parent.activeObj.textSettings) {
            for (let i: number = 0; i < shapeSettings.fontStyle.length; i++) {
                switch (shapeSettings.fontStyle[i as number]) {
                case 'bold':
                    parent.activeObj.textSettings.bold = true;
                    break;
                case 'italic':
                    parent.activeObj.textSettings.italic = true;
                    break;
                case 'underline':
                    parent.activeObj.textSettings.underline = true;
                    break;
                }
            }
        }
    }

    private addLetter(letter: string): void {
        const parent: ImageEditor = this.parent;
        if (parent.textArea.style.display === 'none' && (parent.currObjType.isText || parent.activeObj.shape === 'text')) {
            if (letter === 'Backspace') {this.keyHistory = this.keyHistory.slice(0, -1); }
            else {this.keyHistory += letter; }
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            this.updateFontStyles();
            const width: number = this.upperContext.measureText(this.keyHistory).width
                + parent.activeObj.textSettings.fontSize * 0.5;
            const height: number = parent.activeObj.textSettings.fontSize + parent.activeObj.textSettings.fontSize * 0.25;
            this.upperContext.fillText(this.keyHistory, parent.activeObj.activePoint.startX,
                                       parent.activeObj.activePoint.startY +
                                       parent.activeObj.textSettings.fontSize);
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            parent.currObjType.isText = true;
            parent.notify('selection', { prop: 'setActivePoint', onPropertyChange: false,
                value: {startX: width, startY: height}});
        }
    }

    private redrawText(): void {
        const parent: ImageEditor = this.parent;
        let fontStyle: string = '';
        if (parent.activeObj.textSettings.bold) {
            fontStyle += 'bold ';
        }
        if (parent.activeObj.textSettings.italic) {
            fontStyle += 'italic ';
        }
        this.upperContext.font = fontStyle + parent.activeObj.textSettings.fontSize + 'px ' + parent.activeObj.textSettings.fontFamily;
        const rows: string[] = parent.activeObj.keyHistory.split('\n');
        const text: string = parent.textArea.style.display === 'block' ? this.getMaxText(true) : this.getMaxText();
        const width: number = this.upperContext.measureText(text).width + parent.activeObj.textSettings.fontSize * 0.5;
        const height: number = rows.length * (parent.activeObj.textSettings.fontSize + parent.activeObj.textSettings.fontSize * 0.25);
        parent.notify('selection', { prop: 'setTextSelection', onPropertyChange: false,
            value: {width: width, height: height}});
        parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: parent.activeObj.activePoint, obj: parent.activeObj,
            isMouseMove: null, x: null, y: null}});
        parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false,
            value: {obj: parent.activeObj}});
    }

    private updateTextFromTextArea(): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.keyHistory !== parent.textArea.value) {
            const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
            const object: Object = {currObj: {} as CurrentObject };
            parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
            const prevObj: CurrentObject = object['currObj'];
            prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
            prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
            prevObj.afterCropActions = extend([], this.parent.afterCropActions, [], true) as string[];
            const selPointCollObj: Object = {selPointColl: null };
            parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                value: {obj: selPointCollObj }});
            prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
            parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'text', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: parent.activeObj.keyHistory,
                    currentText: parent.textArea.value, previousFilter: null, isCircleCrop: null}});
        }
        parent.activeObj.keyHistory = parent.textArea.value; parent.textArea.style.display = 'none';
        parent.textArea.value = ''; this.updateFontStyles();
        let width: number = this.upperContext.measureText(parent.activeObj.keyHistory).width +
        parent.activeObj.textSettings.fontSize * 0.5;
        let height: number = parent.activeObj.textSettings.fontSize + this.parent.activeObj.textSettings.fontSize * 0.25;
        const rows: string[] = parent.activeObj.keyHistory.split('\n');
        if (rows.length > 1) {
            height *= rows.length; const widthColl: number[] = [];
            for (let i: number = 0, len: number = rows.length; i < len; i++) {
                widthColl.push(this.upperContext.measureText(rows[i as number]).width +
                parent.activeObj.textSettings.fontSize * 0.5);
            }
            width = Math.max(...widthColl);
        }
        parent.notify('selection', { prop: 'setTextSelection', onPropertyChange: false,
            value: {width: width, height: height}});
        parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: parent.activeObj.activePoint, obj: parent.activeObj,
            isMouseMove: null, x: null, y: null}});
        this.updImgRatioForActObj();
    }

    private iterateObjColl(): void {
        const parent: ImageEditor = this.parent;
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            this.apply(parent.objColl[i as number].shape, parent.objColl[i as number]);
            this.refreshActiveObj();
        }
    }

    private updImgRatioForActObj(): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.imageRatio = { startX: ((parent.activeObj.activePoint.startX - parent.img.destLeft) /
            parent.img.destWidth),
        startY: ((parent.activeObj.activePoint.startY - parent.img.destTop) / parent.img.destHeight),
        endX: ((parent.activeObj.activePoint.endX - parent.img.destLeft) / parent.img.destWidth),
        endY: ((parent.activeObj.activePoint.endY - parent.img.destTop) / parent.img.destHeight),
        width: parent.img.destWidth / parent.activeObj.activePoint.width, height: parent.img.destHeight /
            parent.activeObj.activePoint.height };
        if (parent.activeObj.rotationCirclePointColl) {
            parent.activeObj.rotationCirclePointColl.ratioX = (parent.activeObj.rotationCirclePointColl.x -
                parent.img.destLeft) / parent.img.destWidth;
            parent.activeObj.rotationCirclePointColl.ratioY = (parent.activeObj.rotationCirclePointColl.y -
                parent.img.destTop) / parent.img.destHeight;
        }
        if (parent.activeObj.shape === 'path') {this.updatePathRatio(parent.activeObj); }
        else if (parent.activeObj.shape === 'arrow') {this.updateArrowRatio(parent.activeObj); }
    }

    private zoomObjColl(preventApply?: true): void {
        const parent: ImageEditor = this.parent;
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            let currObj: SelectionPoint = parent.objColl[i as number];
            currObj.activePoint.startX = (currObj.imageRatio.startX * parent.img.destWidth) + parent.img.destLeft;
            currObj.activePoint.startY = (currObj.imageRatio.startY * parent.img.destHeight) + parent.img.destTop;
            currObj.activePoint.endX = (currObj.imageRatio.endX * parent.img.destWidth) + parent.img.destLeft;
            currObj.activePoint.endY = (currObj.imageRatio.endY * parent.img.destHeight) + parent.img.destTop;
            currObj = this.updateWidthHeight(currObj);
            if (currObj.shape === 'text') {
                this.updateFontSize(currObj);
            } else if (currObj.shape === 'line' || currObj.shape === 'arrow') {
                currObj.pointColl = this.getLinePoints(currObj.activePoint.startX, currObj.activePoint.startY, currObj.activePoint.endX,
                                                       currObj.activePoint.endY);
                for (let n: number = 0, len: number = currObj.pointColl.length; n < len; n++) {
                    currObj.pointColl[n as number].ratioX =
                        (currObj.pointColl[n as number].x - parent.img.destLeft) / parent.img.destWidth;
                    currObj.pointColl[n as number].ratioY =
                        (currObj.pointColl[n as number].y - parent.img.destTop) / parent.img.destHeight;
                }
                if (currObj.shape === 'arrow') {
                    this.updateArrowSize(currObj);
                }
            } else if (currObj.shape === 'path') {
                for (let l: number = 0, len: number = currObj.pointColl.length; l < len; l++) {
                    currObj.pointColl[l as number].x = (currObj.pointColl[l as number].ratioX * parent.img.destWidth)
                        + parent.img.destLeft;
                    currObj.pointColl[l as number].y = (currObj.pointColl[l as number].ratioY * parent.img.destHeight) +
                        parent.img.destTop;
                }
                this.updatePathRatio(currObj);
            }
            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: currObj.activePoint,
                obj: currObj}});
            if (isNullOrUndefined(preventApply)) {
                const temp: string = this.lowerContext.filter; this.lowerContext.filter = 'none';
                this.apply(currObj.shape, currObj);
                this.refreshActiveObj(); this.lowerContext.filter = temp;
            }
            if (currObj.shape !== 'line' && currObj.shape !== 'arrow' && currObj.shape !== 'path' && currObj.rotatedAngle !== 0) {
                this.setPointCollForShapeRotation(currObj);
                currObj.rotationCirclePoint.x =
                    (currObj.rotationCirclePoint.ratioX * parent.img.destWidth) + parent.img.destLeft;
                currObj.rotationCirclePoint.y =
                    (currObj.rotationCirclePoint.ratioY * parent.img.destHeight) + parent.img.destTop;
                currObj.rotationCirclePointColl.x =
                    (currObj.rotationCirclePointColl.ratioX * parent.img.destWidth) +
                    parent.img.destLeft;
                currObj.rotationCirclePointColl.y =
                    (currObj.rotationCirclePointColl.ratioY * parent.img.destHeight) +
                    parent.img.destTop;
            }
        }
    }

    private redrawObj(degree?: number | string): void {
        const parent: ImageEditor = this.parent;
        if (this.parent.objColl.length > 0) {
            if (degree === 'horizontal' || degree === 'vertical' || degree === 'Horizontal' || degree === 'Vertical' ||
            degree === 'horizontalVertical' || degree === 'verticalHorizontal') {
                this.updateCurrentActiveObjPoint((degree as string).toLowerCase());
            } else if (typeof(degree) === 'number') {
                this.updateCurrentActiveObjPoint(degree); const tempFilter: string = this.lowerContext.filter;
                this.lowerContext.filter = 'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
                    'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
                for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                    const splitWords: string[] = parent.objColl[i as number].shape.split('-');
                    if (splitWords[0] !== 'crop') {
                        this.apply(parent.objColl[i as number].shape, parent.objColl[i as number]);
                    }
                }
                this.lowerContext.filter = tempFilter;
            }
        }
    }

    private updateCurrentActiveObjPoint(degree: number | string): void {
        const parent: ImageEditor = this.parent;
        let currActObjIndex: number;
        for (let index: number = 0, len: number = parent.objColl.length; index < len; index++) {
            const currObj: SelectionPoint = parent.objColl[index as number];
            if (parent.activeObj.shape === currObj.shape &&
                parent.activeObj.activePoint.startX === currObj.activePoint.startX &&
                parent.activeObj.activePoint.startY === currObj.activePoint.startY &&
                parent.activeObj.activePoint.endX === currObj.activePoint.endX &&
                parent.activeObj.activePoint.endY === currObj.activePoint.endY &&
                parent.activeObj.currIndex === currObj.currIndex) {
                currActObjIndex = index;
                break;
            }
        }
        if (degree === 'horizontal' || degree === 'vertical' || degree === 'Horizontal' || degree === 'Vertical' ||
        degree === 'horizontalvertical' || degree === 'verticalhorizontal') {
            if (degree === 'horizontal' || degree === 'Horizontal') {
                for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                    const currObj: SelectionPoint = parent.objColl[i as number];
                    if (currObj.shapeFlip !== parent.transform.currFlipState) {
                        if (currObj.activePoint.startX <= parent.img.destLeft + (parent.img.destWidth / 2)) {
                            currObj.activePoint.endX = (parent.img.destLeft + parent.img.destWidth) - (currObj.activePoint.startX -
                                parent.img.destLeft);
                            currObj.activePoint.startX = currObj.activePoint.endX - currObj.activePoint.width;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint:
                                currObj.activePoint, obj: currObj}});
                        } else if (currObj.activePoint.startX >= parent.img.destLeft + (parent.img.destWidth / 2)) {
                            currObj.activePoint.startX = parent.img.destLeft + (parent.img.destLeft + parent.img.destWidth -
                                currObj.activePoint.endX);
                            currObj.activePoint.endX = currObj.activePoint.startX + currObj.activePoint.width;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: currObj.activePoint,
                                obj: currObj}});
                        }
                        if (currObj.shape === 'line' || currObj.shape === 'arrow' || currObj.shape === 'path') {
                            this.flipLineArrowObj(currObj, 'horizontal');
                        } else if (currObj.rotatedAngle !== 0) {
                            currObj.rotatedAngle = currObj.rotatedAngle + (Math.PI - currObj.rotatedAngle) * 2;
                            if (currObj.rotationCirclePointColl.x <= parent.img.destLeft + (parent.img.destWidth / 2)) {
                                currObj.rotationCirclePointColl.x = (parent.img.destLeft + parent.img.destWidth) -
                                (currObj.rotationCirclePointColl.x - parent.img.destLeft);
                            } else if (currObj.rotationCirclePointColl.x >= parent.img.destLeft + (parent.img.destWidth / 2)) {
                                currObj.rotationCirclePointColl.x = parent.img.destLeft +
                                (parent.img.destLeft + parent.img.destWidth - currObj.rotationCirclePointColl.x);
                            }
                            currObj.rotationCirclePointColl.ratioX =
                                (currObj.rotationCirclePointColl.x - parent.img.destLeft) / parent.img.destWidth;
                        }
                        currObj.shapeFlip = parent.transform.currFlipState;
                        currObj.imageRatio = {startX: ((currObj.activePoint.startX - parent.img.destLeft) / parent.img.destWidth),
                            startY: ((currObj.activePoint.startY - parent.img.destTop) / parent.img.destHeight),
                            endX: ((currObj.activePoint.endX - parent.img.destLeft) / parent.img.destWidth),
                            endY: ((currObj.activePoint.endY - parent.img.destTop) / parent.img.destHeight),
                            width: parent.img.destWidth / currObj.activePoint.width,
                            height: parent.img.destHeight / currObj.activePoint.height };
                    }
                }
            }
            else if (degree === 'vertical' || degree === 'Vertical') {
                for (let i: number = 0; i < parent.objColl.length; i++) {
                    const currObj: SelectionPoint = parent.objColl[i as number];
                    if (currObj.shapeFlip !== parent.transform.currFlipState) {
                        if (currObj.activePoint.startY <= parent.img.destTop + (parent.img.destHeight / 2)) {
                            currObj.activePoint.endY = (parent.img.destTop + parent.img.destHeight) -
                            (currObj.activePoint.startY - parent.img.destTop);
                            currObj.activePoint.startY = currObj.activePoint.endY - currObj.activePoint.height;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: currObj.activePoint,
                                obj: currObj}});
                        } else if (currObj.activePoint.startY >= this.parent.lowerCanvas.height / 2) {
                            currObj.activePoint.startY = parent.img.destTop + (parent.img.destTop +
                                parent.img.destHeight - currObj.activePoint.endY);
                            currObj.activePoint.endY = currObj.activePoint.startY +
                            currObj.activePoint.height;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: currObj.activePoint,
                                obj: currObj}});
                        }
                        if (currObj.shape === 'line' || currObj.shape === 'arrow' ||
                            currObj.shape === 'path') {
                            this.flipLineArrowObj(currObj, 'vertical');
                        } else if (currObj.rotatedAngle !== 0) {
                            currObj.rotatedAngle = -currObj.rotatedAngle;
                            if (currObj.rotationCirclePointColl.y <= parent.img.destTop + (parent.img.destHeight / 2)) {
                                currObj.rotationCirclePointColl.y = (parent.img.destTop + parent.img.destHeight) -
                                (currObj.rotationCirclePointColl.y - parent.img.destTop);
                            } else if (currObj.rotationCirclePointColl.y >= parent.img.destTop +
                                (parent.img.destHeight / 2)) {
                                currObj.rotationCirclePointColl.y = parent.img.destTop + (parent.img.destTop +
                                    parent.img.destHeight - currObj.rotationCirclePointColl.y);
                            }
                            currObj.rotationCirclePointColl.ratioY =
                                (currObj.rotationCirclePointColl.y - parent.img.destTop) / parent.img.destHeight;
                        }
                        currObj.shapeFlip = parent.transform.currFlipState;
                        currObj.imageRatio = {startX: ((currObj.activePoint.startX - parent.img.destLeft) / parent.img.destWidth),
                            startY: ((currObj.activePoint.startY - parent.img.destTop) / parent.img.destHeight),
                            endX: ((currObj.activePoint.endX - parent.img.destLeft) / parent.img.destWidth),
                            endY: ((currObj.activePoint.endY - parent.img.destTop) / parent.img.destHeight),
                            width: parent.img.destWidth / currObj.activePoint.width,
                            height: parent.img.destHeight / currObj.activePoint.height };
                    }
                }
            }
            else if (degree === 'verticalhorizontal' || degree === 'horizontalvertical') {
                for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                    const currObj: SelectionPoint = parent.objColl[i as number];
                    if (currObj.shapeFlip !== parent.transform.currFlipState) {
                        if (currObj.activePoint.startX <= parent.img.destLeft + (parent.img.destWidth / 2)) {
                            currObj.activePoint.endX = (parent.img.destLeft + parent.img.destWidth) - (currObj.activePoint.startX -
                                parent.img.destLeft);
                            currObj.activePoint.startX = currObj.activePoint.endX - currObj.activePoint.width;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value:
                            {actPoint: currObj.activePoint, obj: currObj}});
                        } else if (currObj.activePoint.startX >= parent.img.destLeft + (parent.img.destWidth / 2)) {
                            currObj.activePoint.startX = parent.img.destLeft + (parent.img.destLeft +
                                parent.img.destWidth - currObj.activePoint.endX);
                            currObj.activePoint.endX = currObj.activePoint.startX + currObj.activePoint.width;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint:
                                currObj.activePoint, obj: currObj}});
                        }
                        if (currObj.activePoint.startY <= parent.img.destTop + (parent.img.destHeight / 2)) {
                            currObj.activePoint.endY = (parent.img.destTop + parent.img.destHeight) -
                            (currObj.activePoint.startY - parent.img.destTop);
                            currObj.activePoint.startY = currObj.activePoint.endY -
                            currObj.activePoint.height;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint:
                                currObj.activePoint, obj: currObj}});
                        } else if (currObj.activePoint.startY >= this.parent.lowerCanvas.height / 2) {
                            currObj.activePoint.startY = parent.img.destTop + (parent.img.destTop +
                                parent.img.destHeight - currObj.activePoint.endY);
                            currObj.activePoint.endY = currObj.activePoint.startY +
                            currObj.activePoint.height;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value:
                            {actPoint: currObj.activePoint, obj: currObj}});
                        }
                        if (currObj.shape === 'line' || currObj.shape === 'arrow' || currObj.shape === 'path') {
                            this.flipLineArrowObj(currObj, degree);
                        }
                        currObj.shapeFlip = parent.transform.currFlipState;
                        currObj.imageRatio = {startX: ((currObj.activePoint.startX - parent.img.destLeft) / parent.img.destWidth),
                            startY: ((currObj.activePoint.startY - parent.img.destTop) / parent.img.destHeight),
                            endX: ((currObj.activePoint.endX - parent.img.destLeft) / parent.img.destWidth),
                            endY: ((currObj.activePoint.endY - parent.img.destTop) / parent.img.destHeight),
                            width: parent.img.destWidth / currObj.activePoint.width,
                            height: parent.img.destHeight / currObj.activePoint.height };
                    }
                }
            }
            if (currActObjIndex !== undefined) {
                parent.activeObj = extend({}, parent.objColl[currActObjIndex as number], {}, true) as SelectionPoint;
            }
        }
        else if (degree === 90) {
            this.rotateObjColl();
        }
        else if (degree === -90) {
            for (let i: number = 0; i < 3; i++) {
                this.rotateObjColl();
            }
        } else if (typeof(degree) === 'number') {
            if (degree > 0) {this.rotateObjColl(); }
            else {
                for (let i: number = 0; i < 3; i++) {
                    this.rotateObjColl();
                }
            }
        }
    }

    private rotateObjColl(): void {
        const parent: ImageEditor = this.parent;
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            let currObj: SelectionPoint = parent.objColl[i as number];
            currObj.activePoint.startY = parent.img.destTop + (parent.img.destHeight * currObj.imageRatio.startX);
            currObj.activePoint.endY = parent.img.destTop + (parent.img.destHeight * currObj.imageRatio.endX);
            currObj.activePoint.startX = (parent.img.destLeft + parent.img.destWidth) -
                (parent.img.destWidth * currObj.imageRatio.endY);
            currObj.activePoint.endX = (parent.img.destLeft + parent.img.destWidth) -
                (parent.img.destWidth * currObj.imageRatio.startY);
            currObj = this.updateWidthHeight(parent.objColl[i as number]);
            this.updateFontSize(currObj);
            if (currObj.shape === 'line' || currObj.shape === 'arrow' ||
                currObj.shape === 'path') {
                this.rotateLineArrowObj(currObj);
                if (currObj.shape === 'arrow') {
                    this.updateArrowSize(currObj);
                }
            } else if (currObj.rotatedAngle !== 0) {
                currObj.rotationCirclePointColl.y = parent.img.destTop + (parent.img.destHeight * currObj.rotationCirclePointColl.ratioX);
                currObj.rotationCirclePointColl.x = (parent.img.destLeft + parent.img.destWidth) -
                    (parent.img.destWidth * currObj.rotationCirclePointColl.ratioY);
                currObj.rotationCirclePointColl.ratioX = (currObj.rotationCirclePointColl.x
                    - parent.img.destLeft) / parent.img.destWidth;
                currObj.rotationCirclePointColl.ratioY = (currObj.rotationCirclePointColl.y
                    - parent.img.destTop) / parent.img.destHeight;
            }
        }
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint:
                parent.objColl[i as number].activePoint, obj: parent.objColl[i as number]}});
        }
        // Update current image ratio for all objects
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            const currObj: SelectionPoint = parent.objColl[i as number];
            currObj.imageRatio = {startX: ((currObj.activePoint.startX - parent.img.destLeft) / parent.img.destWidth),
                startY: ((currObj.activePoint.startY - parent.img.destTop) / parent.img.destHeight),
                endX: ((currObj.activePoint.endX - parent.img.destLeft) / parent.img.destWidth),
                endY: ((currObj.activePoint.endY - parent.img.destTop) / parent.img.destHeight),
                width: parent.img.destWidth / currObj.activePoint.width,
                height: parent.img.destHeight / currObj.activePoint.height };
        }
    }

    private rotateLineArrowObj(obj: SelectionPoint): void {
        if (isNullOrUndefined(obj.pointColl)) {
            return;
        }
        const parent: ImageEditor = this.parent;
        if (obj.pointColl.length > 0) {
            for (let n: number = 0; n < obj.pointColl.length; n++) {
                obj.pointColl[n as number].y = parent.img.destTop + (parent.img.destHeight * obj.pointColl[n as number].ratioX);
                obj.pointColl[n as number].x = (parent.img.destLeft + parent.img.destWidth) - (parent.img.destWidth *
                    obj.pointColl[n as number].ratioY);
            }
            for (let n: number = 0; n < obj.pointColl.length; n++) {
                obj.pointColl[n as number].ratioX = (obj.pointColl[n as number].x - parent.img.destLeft) / parent.img.destWidth;
                obj.pointColl[n as number].ratioY = (obj.pointColl[n as number].y - parent.img.destTop) / parent.img.destHeight;
            }
            let prevPoint: Point;
            if (isNullOrUndefined(obj.pointColl[obj.pointColl.length - 2])) {prevPoint = {x: 0, y: 0 }; }
            else {prevPoint = {x: obj.pointColl[obj.pointColl.length - 2].x, y: obj.pointColl[obj.pointColl.length - 2].y }; }
            const diffX: number = obj.pointColl[obj.pointColl.length - 1].x - prevPoint.x;
            const diffY: number = obj.pointColl[obj.pointColl.length - 1].y - prevPoint.y;
            obj.activePoint.startX = obj.pointColl[0].x; obj.activePoint.startY = obj.pointColl[0].y;
            obj.activePoint.endX = obj.pointColl[obj.pointColl.length - 1].x + (diffX / 2);
            obj.activePoint.endY = obj.pointColl[obj.pointColl.length - 1].y + (diffY / 2);
            obj = this.updateWidthHeight(obj);
        }
    }

    private flipLineArrowObj(obj: SelectionPoint, value: string): void {
        if (isNullOrUndefined(obj.pointColl)) {return; }
        if (value.toLowerCase() === 'horizontal') {this.lineArrowHorizontalFlip(obj); }
        else if (value.toLowerCase() === 'vertical') {this.lineArrowVerticalFlip(obj); }
        else {this.lineArrowHorizontalFlip(obj); obj.shapeFlip = ''; this.lineArrowVerticalFlip(obj); }
        obj.activePoint.startX = obj.pointColl[0].x; obj.activePoint.startY = obj.pointColl[0].y;
        obj.activePoint.endX = obj.pointColl[obj.pointColl.length - 1].x;
        obj.activePoint.endY = obj.pointColl[obj.pointColl.length - 1].y;
        if (obj.activePoint.startX > obj.activePoint.endX) {
            let temp: number = obj.activePoint.startX; obj.activePoint.startX = obj.activePoint.endX;
            obj.activePoint.endX = temp; temp = obj.activePoint.startY;
            obj.activePoint.startY = obj.activePoint.endY; obj.activePoint.endY = temp;
        }
    }

    private lineArrowHorizontalFlip(obj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        // Update flip value for point collection
        if (obj.shapeFlip !== parent.transform.currFlipState) {
            for (let l: number = 0, len: number = obj.pointColl.length; l < len; l++) {
                const currPoint: Point = obj.pointColl[l as number];
                if (currPoint.x <= parent.img.destLeft + (parent.img.destWidth / 2)) {
                    currPoint.x = (parent.img.destLeft + parent.img.destWidth) - (currPoint.x
                        - parent.img.destLeft);
                } else if (currPoint.x >= parent.img.destLeft + (parent.img.destWidth / 2)) {
                    currPoint.x = parent.img.destLeft + (parent.img.destLeft + parent.img.destWidth -
                        currPoint.x);
                }
                currPoint.ratioX = (currPoint.x - parent.img.destLeft) / parent.img.destWidth;
                currPoint.ratioY = (currPoint.y - parent.img.destTop) / parent.img.destHeight;
            }
            if (obj.shape === 'arrow') {
                const value: string = obj.start; obj.start = obj.end; obj.end = value;
            }
            obj.shapeFlip = parent.transform.currFlipState;
        }
    }

    private lineArrowVerticalFlip(obj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        // Update flip value for point collection
        if (obj.shapeFlip !== parent.transform.currFlipState) {
            for (let l: number = 0, len: number = obj.pointColl.length; l < len; l++) {
                const currPoint: Point = obj.pointColl[l as number];
                if (currPoint.y <= parent.img.destTop + (parent.img.destHeight / 2)) {
                    currPoint.y = (parent.img.destTop + parent.img.destHeight) -
                    (currPoint.y - parent.img.destTop);
                } else if (currPoint.y >= parent.img.destTop + (parent.img.destHeight / 2)) {
                    currPoint.y = parent.img.destTop + (parent.img.destTop + parent.img.destHeight -
                        currPoint.y);
                }
                currPoint.ratioX = (currPoint.x - parent.img.destLeft) / parent.img.destWidth;
                currPoint.ratioY = (currPoint.y - parent.img.destTop) / parent.img.destHeight;
            }
            obj.shapeFlip = parent.transform.currFlipState;
        }
    }

    private getRotDegOfShape(obj: SelectionPoint): number {
        let degree: number;
        if (obj.shapeDegree === 0) {degree = this.parent.transform.degree; }
        else {degree = this.parent.transform.degree - obj.shapeDegree; }
        if (degree < 0) {degree = 360 + degree; }
        return degree;
    }

    private renderTextArea(x: number, y: number, actObj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        const degree: number = this.getRotDegOfShape(parent.activeObj);
        this.transformTextArea();
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
        } else {
            parent.updateToolbar(parent.element, 'destroyQuickAccessToolbar');
        }
        if (parent.element.querySelector('#' + parent.element.id + '_duplicate')) {
            parent.element.querySelector('#' + parent.element.id + '_duplicate').classList.add('e-disabled');
        }
        if (parent.element.querySelector('#' + parent.element.id + '_remove')) {
            parent.element.querySelector('#' + parent.element.id + '_remove').classList.add('e-disabled');
        }
        if (parent.element.querySelector('#' + parent.element.id + '_editText')) {
            parent.element.querySelector('#' + parent.element.id + '_editText').classList.add('e-disabled');
        }
        parent.textArea.style.display = 'block'; parent.textArea.style.left = x + 'px';
        parent.textArea.style.top = y + 'px'; parent.textArea.style.fontFamily = actObj.textSettings.fontFamily;
        parent.textArea.style.fontSize = actObj.textSettings.fontSize + 'px';
        parent.textArea.style.color = actObj.strokeSettings.strokeColor;
        parent.textArea.style.fontWeight = actObj.textSettings.bold ? 'bold' : 'normal';
        parent.textArea.style.fontStyle = actObj.textSettings.italic ? 'italic' : 'normal';
        parent.textArea.style.border = '2px solid ' + parent.themeColl[parent.theme]['primaryColor'];
        parent.textArea.value = actObj.keyHistory; parent.textArea.style.overflow = 'hidden';
        parent.textArea.style.width = 'auto'; parent.textArea.style.height = 'auto';
        parent.textArea.focus();
        const zoomFactor: number = parent.transform.zoomFactor;
        const { width, height } = actObj.activePoint;
        if (degree % 90 === 0 && degree % 180 !== 0 && degree !== 0) {
            parent.textArea.style.width = (zoomFactor === 0 ? height : height) + 'px';
            parent.textArea.style.height = (zoomFactor === 0 ? width : width) + 'px';
        } else {
            parent.textArea.style.width = (zoomFactor === 0 ? width : width) + 'px';
            parent.textArea.style.height = (zoomFactor === 0 ? height : height) + 'px';
        }
        this.setTextBoxWidth(); const obj: Object = {flipColl: null };
        parent.notify('transform', { prop: 'getFlipColl', onPropertyChange: false, value: {obj: obj }});
        if (obj['flipColl'].length <= 1) {this.setTextBoxHeight(); }
        if (degree % 90 === 0 && degree % 180 !== 0) {
            if (parseFloat(parent.textArea.style.left) + parseFloat(parent.textArea.style.width) > parent.img.destTop +
            parent.img.destHeight) {this.alignTextAreaIntoCanvas(); }
        } else {
            if (parseFloat(parent.textArea.style.left) + parseFloat(parent.textArea.style.width) > parent.img.destLeft +
            parent.img.destWidth) {this.alignTextAreaIntoCanvas(); }
        }
        parent.notify('selection', { prop: 'clearUpperCanvas', onPropertyChange: false});
    }

    private setTextBoxWidth(e?: KeyboardEvent): void {
        const parent: ImageEditor = this.parent; const text: string = this.getMaxText(true);
        if (parent.textArea.style.display === 'block') {this.updateFontStyles(true); }
        else {this.updateFontStyles(); }
        const textAreaWidth: number = (this.upperContext.measureText(text).width + (parseFloat(parent.textArea.style.fontSize) / 2));
        const letterWidth: number = e ? this.upperContext.measureText(String.fromCharCode(e.which)).width : 0;
        const actObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        let flip: string = ''; const degree: number = this.getRotDegOfShape(actObj);
        if (actObj.shapeFlip !== parent.transform.currFlipState) {flip = ''; }
        else {flip = parent.transform.currFlipState; }
        if ((e && parseFloat(parent.textArea.style.width) < (textAreaWidth + letterWidth)) || isNullOrUndefined(e)) {
            if (degree === 0) {
                if (flip.toLowerCase() === 'horizontal') {
                    if ((parseFloat(parent.textArea.style.left) - parent.img.destLeft) - textAreaWidth - letterWidth > 0) {
                        parent.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                } else if ((parent.img.destWidth - (parseFloat(parent.textArea.style.left) -
                    parent.img.destLeft)) > (textAreaWidth + letterWidth)) {
                    parent.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                }
            } else if (degree === 90) {
                if (flip.toLowerCase() === 'vertical') {
                    if ((parseFloat(parent.textArea.style.top) - parent.img.destTop) - textAreaWidth - letterWidth > 0) {
                        parent.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
                else if ((parent.img.destHeight - (parseFloat(parent.textArea.style.top) -
                    parent.img.destTop)) > (textAreaWidth + letterWidth)) {
                    parent.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                }
            } else if (degree === 180) {
                const textAreaLeft: number = parseFloat(parent.textArea.style.left);
                const destLeft: number = parent.img.destLeft;
                if (flip.toLowerCase() === 'horizontal') {
                    const remainingWidth: number = parent.img.destWidth - (textAreaLeft - destLeft);
                    if (remainingWidth > textAreaWidth + letterWidth) {
                        parent.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                } else {
                    const distanceToLeft: number = textAreaLeft - destLeft;
                    if (distanceToLeft - textAreaWidth - letterWidth > 0) {
                        parent.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
            } else if (degree === 270) {
                const textAreaTop: number = parseFloat(parent.textArea.style.top);
                const destTop: number = parent.img.destTop;
                if (flip.toLowerCase() === 'vertical') {
                    const remainingHeight: number = parent.img.destHeight - (textAreaTop - destTop);
                    if (remainingHeight > textAreaWidth + letterWidth) {
                        parent.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                } else {
                    const distanceToTop: number = textAreaTop - destTop;
                    if (distanceToTop - textAreaWidth - letterWidth > 0) {
                        parent.textArea.style.width = (textAreaWidth + letterWidth) + 'px';
                    }
                }
            }
        }
    }

    private setTextBoxHeight(): void {
        const parent: ImageEditor = this.parent; let textAreaTop: number;
        const actObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        let flip: string = ''; const degree: number = this.getRotDegOfShape(actObj);
        if (actObj.textFlip === parent.transform.currFlipState) {
            flip = '';
        } else if (actObj.textFlip === '') {
            flip = parent.transform.currFlipState;
        } else {
            flip = actObj.textFlip;
        }
        switch (degree) {
        case 0:
            if (flip.toLowerCase() === 'vertical') {
                parent.textArea.style.maxHeight = (parent.img.destHeight - (parent.img.destHeight -
                    parseFloat(parent.textArea.style.top))) + 'px';
            }
            else {
                textAreaTop = parseFloat(parent.textArea.style.top) - parent.img.destTop;
                parent.textArea.style.maxHeight = (parent.img.destHeight - textAreaTop) + 'px';
            }
            break;
        case 90:
            if (flip.toLowerCase() === 'horizontal') {
                parent.textArea.style.maxHeight = (parent.img.destWidth - (parseFloat(parent.textArea.style.left) -
                parent.img.destLeft)) + 'px';
            }
            else {
                parent.textArea.style.maxHeight = (parseFloat(parent.textArea.style.left) - parent.img.destLeft) + 'px';
            }
            break;
        case 180:
            if (flip.toLowerCase() === 'vertical') {
                textAreaTop = parseFloat(parent.textArea.style.top) - parent.img.destTop;
                parent.textArea.style.maxHeight = (parent.img.destHeight - textAreaTop) + 'px';
            }
            else {
                parent.textArea.style.maxHeight = (parseFloat(parent.textArea.style.top) - parent.img.destTop) + 'px';
            }
            break;
        case 270:
            if (flip.toLowerCase() === 'horizontal') {
                parent.textArea.style.maxHeight = (parseFloat(parent.textArea.style.left) - parent.img.destLeft) + 'px';
            }
            else {
                parent.textArea.style.maxHeight = parent.img.destWidth - (parseFloat(parent.textArea.style.left)
                - parent.img.destLeft) + 'px';
            }
            break;
        }
    }

    private updatePathRatio(obj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        for (let i: number = 0, len: number = obj.pointColl.length; i < len; i++) {
            const currPoint: Point = obj.pointColl[i as number];
            currPoint.ratioX = (currPoint.x - parent.img.destLeft) / parent.img.destWidth;
            currPoint.ratioY = (currPoint.y - parent.img.destTop) / parent.img.destHeight;
        }
    }

    private stopPathDrawing(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.shape === 'path') {
            const obj: Object = {shape: null };
            parent.notify('selection', { prop: 'getCurrentDrawingShape', value: {obj: obj }});
            if (obj['shape'] === 'path') {
                const prevCropObj: CurrentObject = extend({}, this.parent.cropObj, {}, true) as CurrentObject;
                const object: Object = {currObj: {} as CurrentObject };
                this.parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                const prevObj: CurrentObject = object['currObj'];
                prevObj.objColl = extend([], this.parent.objColl, [], true) as SelectionPoint[];
                prevObj.pointColl = extend([], this.parent.pointColl, [], true) as Point[];
                prevObj.afterCropActions = extend([], this.parent.afterCropActions, [], true) as string[];
                const selPointCollObj: Object = {selPointColl: null };
                this.parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
                    value: {obj: selPointCollObj }});
                prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
                parent.notify('selection', { prop: 'setCurrentDrawingShape', value: {value: '' }});
                parent.currObjType.isDragging = false;
                if (e.type !== 'touchstart') {parent.activeObj.pointColl.pop(); }
                this.updatePathRatio(parent.activeObj);
                parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                    value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                        previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                        previousCropObj: prevCropObj, previousText: null,
                        currentText: null, previousFilter: null, isCircleCrop: null}});
                parent.notify('selection', { prop: 'mouseUpEventHandler', value: {e: e }});
                parent.notify('draw', { prop: 'setNewPath', value: {bool: true }});
                if (parent.objColl[parent.objColl.length - 1]) {
                    parent.selectShape(parent.objColl[parent.objColl.length - 1].currIndex);
                }
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
                } else {
                    parent.updateToolbar(parent.element, 'quickAccessToolbar', parent.activeObj.shape);
                }
            }
        }
    }

    private findTextTarget(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.shape !== 'text') {
            this.stopPathDrawing(e);
            return;
        }
        let x: number; let y: number;
        if (e.type === 'dblclick') {x = e.clientX; y = e.clientY; }
        else if (e.type === 'touchstart') {
            x = e.touches[0].clientX; y = e.touches[0].clientY;
            parent.notify('selection', { prop: 'setTouchEndPoint', onPropertyChange: false,
                value: {x: e.touches[0].clientX, y: e.touches[0].clientY}});
        }
        parent.notify('toolbar', { prop: 'setPreventZoomBtn', onPropertyChange: false, value: {isPrevent: true }});
        parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'text',
            isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
        parent.notify('toolbar', { prop: 'setPreventZoomBtn', onPropertyChange: false, value: {isPrevent: false }});
        parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
            const bbox: DOMRect = this.parent.lowerCanvas.getBoundingClientRect() as DOMRect;
            x -= bbox.left; y -= bbox.top; let flip: string = '';
            const degree: number = this.getRotDegOfShape(parent.activeObj);
            if (parent.activeObj.textFlip === '') {
                if (parent.activeObj.textFlip === parent.transform.currFlipState) {flip = ''; }
                else {flip = parent.transform.currFlipState; }
            } else {
                if (parent.activeObj.textFlip === parent.transform.currFlipState) {flip = ''; }
                else if (parent.transform.currFlipState === '') {flip = parent.activeObj.textFlip; }
                else {flip = parent.transform.currFlipState; }
            }
            let temp: SelectionPoint;
            if (parent.textArea.style.display === 'none') {
                temp = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                for (let i: number = 0; i < parent.objColl.length; i++) {
                    if (JSON.stringify(parent.activeObj) === JSON.stringify(parent.objColl[i as number])) {
                        parent.objColl.splice(i, 1);
                    }
                }
                this.refreshActiveObj();
                this.upperContext.clearRect(0, 0, this.parent.upperCanvas.width, this.parent.upperCanvas.height);
                this.lowerContext.clearRect(0, 0, this.parent.upperCanvas.width, this.parent.upperCanvas.height);
                parent.notify('draw', { prop: 'redrawImgWithObj', onPropertyChange: false});
                if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
                    parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                        value: {context: this.lowerContext, isSave: null, isFlip: null}});
                }
                parent.activeObj = temp; this.updateFontStyles();
                const actObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                if (x >= (actObj.activePoint.startX - (actObj.topLeftCircle.radius * 2)) &&
                            x <= (actObj.activePoint.endX + (actObj.topLeftCircle.radius * 2)) &&
                            y >= (actObj.activePoint.startY - (actObj.topLeftCircle.radius * 2)) &&
                            y <= (actObj.activePoint.endY + (actObj.topLeftCircle.radius * 2))) {
                    this.upperContext.clearRect(0, 0, this.parent.upperCanvas.width, this.parent.upperCanvas.height);
                    if (actObj.flipObjColl.length === 4) {
                        actObj.flipObjColl = []; flip = ''; actObj.shapeFlip = '';
                    }
                    if (flip === '' && actObj.flipObjColl.length > 1) {
                        flip = actObj.flipObjColl[actObj.flipObjColl.length - 1];
                    }
                    if (actObj.flipObjColl.length <= 1) {
                        const points: Point = this.setTextBoxPos(actObj, degree, flip, x, y);
                        x = points.x; y = points.y;
                    } else {
                        const points: Point = this.setTextBoxPoints(actObj, degree, flip, x, y);
                        x = points.x; y = points.y;
                    }
                    if (parent.activeObj.rotatedAngle !== 0) {
                        x = parent.activeObj.horTopLinePointColl[0].x;
                        y = parent.activeObj.horTopLinePointColl[0].y;
                    }
                    this.renderTextArea(x, y, actObj);

                } else {this.applyActObj(); }
            }
        } else if (parent.textArea.style.display === 'block' && this.selectedText() !== '' && e.type === 'mousedown') {
            const temp: string = parent.textArea.value; parent.textArea.value += 'a'; parent.textArea.value = temp;
        } else if (parent.textArea.style.display === 'none') {
            parent.textArea.style.display = 'block';
        }
    }

    private setTextBoxPos(actObj: SelectionPoint, degree: number, flip: string, x: number, y: number): Point {
        const point: Point = {x: x, y: y};
        switch (degree) {
        case 0:
            if (flip.toLowerCase() === 'horizontal') {
                point.x = actObj.activePoint.endX; point.y = actObj.activePoint.startY;
            } else if (flip.toLowerCase() === 'vertical') {
                point.x = actObj.activePoint.startX; point.y = actObj.activePoint.endY;
            } else {
                point.x = actObj.activePoint.startX; point.y = actObj.activePoint.startY;
            }
            break;
        case 90:
            if (flip.toLowerCase() === 'horizontal') {
                point.x = actObj.activePoint.startX; point.y = actObj.activePoint.startY;
            } else if (flip.toLowerCase() === 'vertical') {
                point.x = actObj.activePoint.endX; point.y = actObj.activePoint.endY;
            } else {
                point.x = actObj.activePoint.endX; point.y = actObj.activePoint.startY;
            }
            break;
        case 180:
            if (flip.toLowerCase() === 'horizontal') {
                point.x = actObj.activePoint.startX; point.y = actObj.activePoint.endY;
            } else if (flip.toLowerCase() === 'vertical') {
                point.x = actObj.activePoint.endX; point.y = actObj.activePoint.startY;
            } else {
                point.x = actObj.activePoint.endX; point.y = actObj.activePoint.endY;
            }
            break;
        case 270:
            if (flip.toLowerCase() === 'horizontal') {
                point.x = actObj.activePoint.endX; point.y = actObj.activePoint.endY;
            } else if (flip.toLowerCase() === 'vertical') {
                point.x = actObj.activePoint.startX; point.y = actObj.activePoint.startY;
            } else {
                point.x = actObj.activePoint.startX; point.y = actObj.activePoint.endY;
            }
            break;
        }
        return point;
    }

    private setTextBoxPoints(actObj: SelectionPoint, degree: number, flip: string, x: number, y: number): Point {
        const point: Point = {x: x, y: y};
        switch (degree) {
        case 0:
            if (actObj.flipObjColl[0] && actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX); point.y = (actObj.activePoint.startY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.endX); point.y = (actObj.activePoint.endY);
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.endX); point.y = (actObj.activePoint.endY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.endX); point.y = (actObj.activePoint.startY);
                }
            }
            break;
        case 90:
            if (actObj.flipObjColl[0] && actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.endX); point.y = (actObj.activePoint.endY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.startX); point.y = (actObj.activePoint.endY);
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX); point.y = (actObj.activePoint.endY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.startX); point.y = (actObj.activePoint.startY);
                }
            }
            break;
        case 180:
            if (actObj.flipObjColl[0] && actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX); point.y = (actObj.activePoint.startY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.startX); point.y = (actObj.activePoint.startY);
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX); point.y = (actObj.activePoint.startY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.startX); point.y = (actObj.activePoint.endY);
                }
            }
            break;
        case 270:
            if (actObj.flipObjColl[0] && actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.startX); point.y = (actObj.activePoint.startY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.endX); point.y = (actObj.activePoint.startY);
                }
            } else {
                if (flip.toLowerCase() === 'horizontal') {
                    point.x = (actObj.activePoint.endX); point.y = (actObj.activePoint.startY);
                } else if (flip.toLowerCase() === 'vertical') {
                    point.x = (actObj.activePoint.endX); point.y = (actObj.activePoint.endY);
                }
            }
            break;
        }
        return point;
    }

    private selectedText(): string {
        const start: number = this.parent.textArea.selectionStart;
        const finish: number = this.parent.textArea.selectionEnd;
        return this.parent.textArea.value.substring(start, finish);
    }

    private panObjColl(xDiff: number, yDiff: number, panRegion: string): void {
        const parent: ImageEditor = this.parent;
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            let currObj: SelectionPoint = parent.objColl[i as number];
            if (panRegion === '' || panRegion === 'vertical') {
                currObj.activePoint.startX += xDiff;
                currObj.activePoint.endX += xDiff;
                if (currObj.rotationCirclePointColl) {
                    currObj.rotationCirclePointColl.x += xDiff;
                }
                if (currObj.shape === 'path') {
                    for (let l: number = 0, len: number = currObj.pointColl.length; l < len; l++) {
                        currObj.pointColl[l as number].x += xDiff;
                    }
                }
            } else {
                currObj.activePoint.startX -= xDiff;
                currObj.activePoint.endX -= xDiff;
                if (currObj.rotationCirclePointColl) {
                    currObj.rotationCirclePointColl.x -= xDiff;
                }
                if (currObj.shape === 'path') {
                    for (let l: number = 0, len: number = currObj.pointColl.length; l < len; l++) {
                        currObj.pointColl[l as number].x -= xDiff;
                    }
                }
            }
            if (panRegion === '' || panRegion === 'horizontal') {
                currObj.activePoint.startY += yDiff;
                currObj.activePoint.endY += yDiff;
                if (currObj.rotationCirclePointColl) {
                    currObj.rotationCirclePointColl.y += yDiff;
                }
                if (currObj.shape === 'path') {
                    for (let l: number = 0; l < currObj.pointColl.length; l++) {
                        currObj.pointColl[l as number].y += yDiff;
                    }
                }
            } else {
                currObj.activePoint.startY -= yDiff;
                currObj.activePoint.endY -= yDiff;
                if (currObj.rotationCirclePointColl) {
                    currObj.rotationCirclePointColl.y -= yDiff;
                }
                if (currObj.shape === 'path') {
                    for (let l: number = 0; l < currObj.pointColl.length; l++) {
                        currObj.pointColl[l as number].y -= yDiff;
                    }
                }
            }
            currObj = this.updateWidthHeight(currObj);
            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value:
            {actPoint: currObj.activePoint,
                obj: currObj}});
            if (currObj.shape === 'line' || currObj.shape === 'arrow') {
                currObj.pointColl = this.getLinePoints(currObj.activePoint.startX, currObj.activePoint.startY, currObj.activePoint.endX,
                                                       currObj.activePoint.endY);
                for (let j: number = 0, len: number = currObj.pointColl.length; j < len; j++) {
                    currObj.pointColl[j as number].ratioX =
                        (currObj.pointColl[j as number].x - parent.img.destLeft) / parent.img.destWidth;
                    currObj.pointColl[j as number].ratioY =
                        (currObj.pointColl[j as number].y - parent.img.destTop) / parent.img.destHeight;
                }
            }
            const temp: string = this.lowerContext.filter; this.lowerContext.filter = 'none';
            this.apply(currObj.shape, currObj);
            this.lowerContext.filter = temp; this.refreshActiveObj();
        }
    }

    private updateFontStyles(isTextBox?: boolean): void {
        const parent: ImageEditor = this.parent;
        this.upperContext.strokeStyle = parent.activeObj.strokeSettings.strokeColor;
        this.upperContext.fillStyle = parent.activeObj.strokeSettings.strokeColor;
        let textStyle: string = '';
        if (parent.activeObj.textSettings.bold) {textStyle = 'bold '; }
        if (parent.activeObj.textSettings.italic) {textStyle = 'italic '; }
        if (parent.activeObj.textSettings.bold && parent.activeObj.textSettings.italic) {textStyle = 'italic bold '; }
        const fontSize: number = isTextBox ? parseFloat(parent.textArea.style.fontSize) : parent.activeObj.textSettings.fontSize;
        const fontFamily: string = parent.textArea.style.display === 'block' ? parent.textArea.style.fontFamily : parent.activeObj.textSettings.fontFamily;
        this.upperContext.font = textStyle + fontSize + 'px' + ' ' + fontFamily;
    }

    private applyFontStyle(item: string): void {
        const parent: ImageEditor = this.parent;
        this.pushActItemIntoObj();
        const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
        parent.objColl.pop();
        if (parent.textArea.style.display === 'none') {this.updateFontRatio(parent.activeObj); }
        else {this.updateFontRatio(parent.activeObj, true); }
        switch (item) {
        case 'default':
            this.updateFontStyle(item, objColl, 'normal', 'normal');
            break;
        case 'bold':
            this.updateFontStyle(item, objColl, 'bold', 'normal');
            break;
        case 'italic':
            this.updateFontStyle(item, objColl, 'normal', 'italic');
            break;
        case 'bolditalic':
            this.updateFontStyle(item, objColl, 'bold', 'italic');
            break;
        }
    }

    private updateFontStyle(item: string, objColl: SelectionPoint[], fontWeight: string, fontStyle: string): void {
        const parent: ImageEditor = this.parent;
        if (parent.textArea.style.display === 'block') {
            const width: number = this.getTextAreaWidth(item); parent.textArea.style.width = width + 'px';
            parent.textArea.style.fontWeight = fontWeight; parent.textArea.style.fontStyle = fontStyle;
            this.updateObjColl(item, objColl);
        } else {
            this.textSettings.bold = parent.activeObj.textSettings.bold = fontWeight === 'normal' ? false : true;
            this.textSettings.italic = parent.activeObj.textSettings.italic = fontStyle === 'normal' ? false : true;
            this.redrawText();
            parent.notify('undo-redo', { prop: 'updateUrObj', onPropertyChange: false, value: {objColl: objColl}});
        }
    }

    private updateArrowRatio(obj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        const object: Object = {arrowDimension: null };
        parent.notify('draw', { prop: 'getArrowDimension', onPropertyChange: false, value: {obj: object }});
        let length: number; const degree: number = this.getRotDegOfShape(obj);
        if (degree === 0 || degree === 180 || degree === -180) {length =  Math.abs(obj.activePoint.width); }
        else {length =  Math.abs(obj.activePoint.height); }
        let dimension: string; const dimensions: string[] = ['bar', 'arrow', 'arrowSolid', 'circle', 'square'];
        for (dimension of dimensions) {
            const ratioX: number = length / object['arrowDimension'][dimension as string]['width'];
            const ratioY: number = length / object['arrowDimension'][dimension as string]['height'];
            object['arrowDimension'][dimension as string]['ratioX'] = ratioX;
            object['arrowDimension'][dimension as string]['ratioY'] = ratioY;
        }
    }

    private updateArrowSize(obj: SelectionPoint): void {
        const object: Object = {arrowDimension: null };
        this.parent.notify('draw', { prop: 'getArrowDimension', onPropertyChange: false, value: {obj: object }});
        let length: number; const degree: number = this.getRotDegOfShape(obj);
        if (degree === 0 || degree === 180 || degree === -180) {length =  Math.abs(obj.activePoint.width); }
        else {length =  Math.abs(obj.activePoint.height); }
        let dimension: string; const dimensions: string[] = ['bar', 'arrow', 'arrowSolid', 'circle', 'square'];
        for (dimension of dimensions) {
            const ratioX: number = object['arrowDimension'][dimension as string]['ratioX'];
            const ratioY: number = object['arrowDimension'][dimension as string]['ratioY'];
            object['arrowDimension'][dimension as string]['width'] = length / ratioX;
            object['arrowDimension'][dimension as string]['height'] = length / ratioY;
        }
    }

    private updateFontRatio(obj: SelectionPoint, isTextArea?: boolean): void {
        const parent: ImageEditor = this.parent;
        const text: string = this.getMaxText(isTextArea);
        const width: number = this.upperContext.measureText(text).width +
            parent.activeObj.textSettings.fontSize * 0.5;
        const height: number = (parent.activeObj.textSettings.fontSize + parent.activeObj.textSettings.fontSize * 0.25);
        const degree: number = this.getRotDegOfShape(obj);
        if (isNullOrUndefined(isTextArea)) {
            if (degree === 0 || Math.abs(degree) === 180) {
                obj.textSettings.fontRatio = width / obj.textSettings.fontSize;
            } else {
                obj.textSettings.fontRatio = height / obj.textSettings.fontSize;
            }
        } else if (isTextArea) {
            obj.textSettings.fontRatio = width / parseFloat(parent.textArea.style.fontSize);
        }
    }

    private updateFontSize(obj: SelectionPoint): void {
        const degree: number = this.getRotDegOfShape(obj);
        if (degree === 0 || Math.abs(degree) === 180) {
            obj.textSettings.fontSize = (obj.activePoint.width / obj.textSettings.fontRatio);
        } else {
            obj.textSettings.fontSize = (obj.activePoint.height / obj.textSettings.fontRatio);
        }
    }

    private updateObjColl(item: string, objColl: SelectionPoint[]): void {
        const parent: ImageEditor = this.parent;
        const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
        const object: Object = {currObj: {} as CurrentObject };
        parent.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
        const prevObj: CurrentObject = object['currObj'];
        prevObj.objColl = objColl;
        prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        const tempBold: boolean = parent.activeObj.textSettings.bold;
        const tempItalic: boolean = parent.activeObj.textSettings.italic;
        switch (item) {
        case 'default':
            parent.activeObj.textSettings.bold = false;
            parent.activeObj.textSettings.italic = false;
            break;
        case 'bold':
            parent.activeObj.textSettings.bold = true;
            parent.activeObj.textSettings.italic = false;
            break;
        case 'italic':
            parent.activeObj.textSettings.bold = false;
            parent.activeObj.textSettings.italic = true;
            break;
        case 'bolditalic':
            parent.activeObj.textSettings.bold = true;
            parent.activeObj.textSettings.italic = true;
            break;
        }
        parent.objColl.push(parent.activeObj);
        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: 'textAreaCustomization', previousObj: prevObj, previousObjColl: prevObj.objColl,
                previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                previousCropObj: prevCropObj, previousText: null,
                currentText: null, previousFilter: null, isCircleCrop: null}});
        parent.objColl.pop();
        parent.activeObj.textSettings.bold = tempBold; parent.activeObj.textSettings.italic = tempItalic;
    }

    private pushActItemIntoObj(): void {
        if (this.parent.textArea.style.display === 'none') {
            this.parent.objColl.push(this.parent.activeObj);
        } else {
            const temp: SelectionPoint = extend({}, this.parent.activeObj, {}, true) as SelectionPoint;
            this.parent.notify('selection', { prop: 'setTextBoxStylesToActObj', onPropertyChange: false });
            this.parent.objColl.push(this.parent.activeObj); this.parent.activeObj = temp;
        }
    }

    private clearActObj(): void {
        if (this.parent.textArea.style.display === 'none') {
            this.refreshActiveObj(); this.applyActObj();
            this.refreshActiveObj(); this.parent.currObjType.isCustomCrop = false;
        }
    }

    private refreshActiveObj(): void {
        this.parent.activeObj = {} as SelectionPoint;
        this.parent.activeObj.activePoint = {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0};
        this.parent.activeObj.triangle = []; this.parent.activeObj.triangleRatio = [];
        this.parent.activeObj.flipObjColl = []; this.parent.activeObj.strokeSettings = this.strokeSettings;
        this.parent.activeObj.textSettings = this.textSettings; this.parent.activeObj.rotatedAngle = 0;
    }

    private applyActObj(isMouseDown?: boolean): void {
        let isActObj: boolean = false;
        if (this.parent.activeObj.shape !== undefined && this.parent.activeObj.shape === 'text' && this.parent.activeObj.keyHistory === '') {
            this.refreshActiveObj();
            this.upperContext.clearRect(0, 0 , this.parent.upperCanvas.width, this.parent.upperCanvas.height);
        } else {
            let splitWords: string[]; let isCropSelection: boolean = false;
            if (this.parent.activeObj.shape !== undefined) {splitWords = this.parent.activeObj.shape.split('-'); }
            if (splitWords === undefined && this.parent.currObjType.isCustomCrop) {isCropSelection = true; }
            else if (splitWords !== undefined && splitWords[0] === 'crop') {isCropSelection = true; }
            if (this.parent.activeObj.shape && !isCropSelection && this.parent.activeObj.shape !== 'shape') {
                for (let i: number = 0; i < this.parent.objColl.length; i++) {
                    if (JSON.stringify(this.parent.activeObj) === JSON.stringify(this.parent.objColl[i as number])) {
                        isActObj = true;
                        break;
                    }
                }
                if (!isActObj) {
                    if (isNullOrUndefined(this.parent.activeObj.currIndex)) {
                        this.parent.activeObj.currIndex = 'shape_' + (this.parent.objColl.length + 1);
                    }
                    this.updImgRatioForActObj();
                    const splitWords: string[] = this.parent.activeObj.currIndex.split('_');
                    let tempObjColl: SelectionPoint[] = this.parent.objColl.splice(0, parseInt(splitWords[1], 10) - 1);
                    tempObjColl.push(extend({}, this.parent.activeObj, {}, true) as SelectionPoint);
                    for (let i: number = 0; i < this.parent.objColl.length; i++) {
                        tempObjColl.push(this.parent.objColl[i as number]);
                    }
                    this.parent.objColl = tempObjColl;
                    tempObjColl = []; this.refreshActiveObj();
                    this.lowerContext.clearRect(0, 0, this.parent.lowerCanvas.width, this.parent.lowerCanvas.height);
                    this.parent.notify('draw', { prop: 'redrawImgWithObj', onPropertyChange: false});
                    this.parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
                    this.parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
                    this.parent.currObjType.shape = ''; this.refreshActiveObj();
                    if (this.parent.isCircleCrop) {
                        this.parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                            value: {context: this.lowerContext, isSave: null, isFlip: null}});
                    }
                    if (!isBlazor()) {this.parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false}); }
                    else {this.parent.updateToolbar(this.parent.element, 'destroyQuickAccessToolbar'); }
                    if (isNullOrUndefined(isMouseDown)) {
                        this.parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
                        this.parent.notify('draw', { prop: 'setPrevActObj', onPropertyChange: false, value: { prevActObj: null }});
                    }
                }
            }
        }
    }

    private alignTextAreaIntoCanvas(): void {
        const parent: ImageEditor = this.parent; const letters: string = parent.textArea.value;
        parent.textArea.value = '';
        for (let i: number = 0, len: number = letters.length; i < len; i++) {
            parent.textArea.value += letters[i as number]; parent.textArea.style.height = 'auto';
            parent.textArea.style.height = parent.textArea.scrollHeight + 'px'; this.setTextBoxWidth();
        }
    }

    private transformTextArea(): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.shape === 'text') {
            parent.textArea.style.transformOrigin = '0 0';
            const rotatedDegree: number = parent.activeObj.rotatedAngle * (180 / Math.PI);
            let scale: string = ''; let degree: number = this.getRotDegOfShape(parent.activeObj);
            if (parent.activeObj.flipObjColl.length > 0) {
                // need to add scale value according to length.
                for (let i: number = 0; i < parent.activeObj.flipObjColl.length; i++) {
                    if (degree !== 0 && degree % 90 === 0 && degree !== 180) {
                        scale += parent.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal' ? 'scale(1, -1)' :
                            'scale(-1, 1)';
                    } else {
                        scale += parent.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal' ? 'scale(-1, 1)' :
                            'scale(1, -1)';
                    }
                    degree += rotatedDegree;
                    if (parent.activeObj.flipObjColl[i as number].toLowerCase() === 'horizontal') {
                        parent.textArea.style.transform = 'rotate(' + degree + 'deg)' + scale;
                    } else if (parent.activeObj.flipObjColl[i as number].toLowerCase() === 'vertical') {
                        parent.textArea.style.transform = 'rotate(' + degree + 'deg)' + scale;
                    }
                }
            } else {
                degree += rotatedDegree; parent.textArea.style.transform = 'rotate(' + degree + 'deg)';
            }
        }
    }

    private getTextAreaWidth(item: string): number {
        const parent: ImageEditor = this.parent;
        const tempBold: boolean = parent.activeObj.textSettings.bold;
        const tempItalic: boolean = parent.activeObj.textSettings.italic;
        switch (item) {
        case 'default':
            parent.activeObj.textSettings.bold = false; parent.activeObj.textSettings.italic = false;
            break;
        case 'bold':
            parent.activeObj.textSettings.bold = true; parent.activeObj.textSettings.italic = false;
            break;
        case 'italic':
            parent.activeObj.textSettings.bold = false; parent.activeObj.textSettings.italic = true;
            break;
        case 'bolditalic':
            parent.activeObj.textSettings.bold = true; parent.activeObj.textSettings.italic = true;
            break;
        }
        this.updateFontStyles(); let width: number;
        if (parent.textArea.style.display === 'none') {
            width = this.upperContext.measureText(parent.activeObj.keyHistory).width +
            parent.activeObj.textSettings.fontSize * 0.5;
        } else {
            width = this.upperContext.measureText(parent.textArea.value).width +
            parent.activeObj.textSettings.fontSize * 0.5;
        }
        parent.activeObj.textSettings.bold = tempBold; parent.activeObj.textSettings.italic = tempItalic;
        return width;
    }

    private getObjDetails(obj: SelectionPoint): ShapeSettings {
        const parent: ImageEditor = this.parent;
        const shapeDetails: ShapeSettings = {} as ShapeSettings; shapeDetails.id = obj.currIndex;
        shapeDetails.type = parent.toPascalCase(obj.shape) as ShapeType;
        shapeDetails.startX = obj.activePoint.startX; shapeDetails.startY = obj.activePoint.startY;
        switch (obj.shape) {
        case 'rectangle':
            shapeDetails.width = obj.activePoint.width;
            shapeDetails.height = obj.activePoint.height;
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.fillColor = obj.strokeSettings.fillColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
            break;
        case 'ellipse':
            shapeDetails.radius = obj.activePoint.width / 2;
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.fillColor = obj.strokeSettings.fillColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
            break;
        case 'line':
        case 'arrow':
            shapeDetails.length = obj.activePoint.width;
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
            break;
        case 'text':
            shapeDetails.text = obj.keyHistory;
            shapeDetails.fontSize = obj.textSettings.fontSize;
            shapeDetails.color = obj.strokeSettings.strokeColor;
            shapeDetails.fontStyle = [];
            if (obj.textSettings.bold) {shapeDetails.fontStyle.push('bold'); }
            if (obj.textSettings.italic) {shapeDetails.fontStyle.push('italic'); }
            break;
        case 'path':
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
            break;
        }
        return shapeDetails;
    }

    private getFreehandDrawDetails(index: number): ShapeSettings {
        const parent: ImageEditor = this.parent;
        const shapeDetails: ShapeSettings = {} as ShapeSettings;
        shapeDetails.id = parent.pointColl[index as number].id;
        shapeDetails.type = ShapeType.FreehandDraw;
        shapeDetails.points = extend([], parent.pointColl[index as number].points) as Point[];
        shapeDetails.strokeColor = parent.pointColl[index as number].strokeColor;
        shapeDetails.strokeWidth = parent.pointColl[index as number].strokeWidth;
        return shapeDetails;
    }

    private getShapeSetting(id: string, obj: Object): void {
        const parent: ImageEditor = this.parent; let shapeDetails: ShapeSettings;
        if (!parent.disabled && parent.isImageLoaded) {
            this.applyActObj();
            if (id.split('_')[0] === 'shape') {
                let obj: SelectionPoint;
                for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                    if (parent.objColl[i as number].currIndex === id) {
                        obj = extend({}, parent.objColl[i as number], {}, true) as SelectionPoint;
                        break;
                    }
                }
                shapeDetails = this.getObjDetails(obj);
            } else if (id.split('_')[0] === 'pen') {
                shapeDetails = this.getFreehandDrawDetails(parseInt(id.split('_')[1], 10) - 1);
            }
        }
        obj['shapeDetails'] = shapeDetails;
    }

    private getShapeSettings(obj: Object): void {
        const parent: ImageEditor = this.parent; const shapeDetailsColl: ShapeSettings[] = [];
        if (!parent.disabled && parent.isImageLoaded) {
            this.applyActObj();
            for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                const shapeDetails: ShapeSettings = this.getObjDetails(parent.objColl[i as number]);
                shapeDetailsColl.push(shapeDetails);
            }
            for (let i: number = 0; i < parent.freehandCounter; i++) {
                const shapeDetails: ShapeSettings = this.getFreehandDrawDetails(i as number);
                shapeDetailsColl.push(shapeDetails);
            }
        }
        obj['shapeDetailsColl'] = shapeDetailsColl;
    }

    private isPointsInRange(x: number, y: number, obj: Object): void {
        let inRange: boolean = false;
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y) && x >= this.parent.img.destLeft && y >= this.parent.img.destTop &&
            x <= this.parent.img.destLeft + this.parent.img.destWidth && y <= this.parent.img.destTop + this.parent.img.destHeight) {
            inRange = true;
        }
        obj['inRange'] = inRange;
    }

    private alignRotateFlipColl(collection: number[] | string[], isRotateFlipCollection?: boolean,
                                obj?: Object): number[] | string[] {
        collection = this.popForDefaultTransformedState(collection);
        collection = this.popForDefaultFlipState(collection);
        collection = this.popForDefaultRotateState(collection);
        if (collection.length === 0 && isRotateFlipCollection) {
            this.parent.transform.degree = 0; this.parent.transform.currFlipState = '';
        }
        obj['collection'] = collection;
        return collection;
    }

    private popForDefaultTransformedState(collection: number[] | string[]): number[] | string[] {
        let rotateRight: number = 0; let rotateleft: number = 0; let horizontal: number = 0; let vertical: number = 0;
        for (let i: number = 0; i < collection.length; i++) {
            if (collection[i as number] === 90 || collection[i as number] === 'rotateRight') {
                rotateRight++; rotateleft = 0; horizontal = 0; vertical = 0;
                if (rotateRight === 4) {
                    collection.pop(); collection.pop(); collection.pop(); collection.pop();
                }
            } else if (collection[i as number] === -90 || collection[i as number] === 'rotateLeft') {
                rotateleft++; rotateRight = 0; horizontal = 0; vertical = 0;
                if (rotateleft === 4) {
                    collection.pop(); collection.pop(); collection.pop(); collection.pop();
                }
            } else if (collection[i as number] === 'horizontal' || collection[i as number] === 'Horizontal'
                || collection[i as number] === 'horizontalflip') {
                horizontal++; rotateleft = 0; rotateRight = 0; vertical = 0;
                if (horizontal === 2) {
                    collection.pop(); collection.pop();
                }
            } else if (collection[i as number] === 'vertical' || collection[i as number] === 'Vertical'
                || collection[i as number] === 'verticalflip') {
                vertical++; horizontal = 0; rotateleft = 0; rotateRight = 0;
                if (vertical === 2) {
                    collection.pop(); collection.pop();
                }
            }
        }
        return collection;
    }

    private popForDefaultFlipState(collection: number[] | string[]): number[] | string[] {
        for (let i: number = 0; i < collection.length; i++) {
            if (!isNullOrUndefined(collection[i + 3])) {
                if ((collection[i as number] === 'horizontal' || collection[i as number] === 'Horizontal'
                    || collection[i as number] === 'horizontalFlip')
                    && (collection[i + 1] === 'vertical' || collection[i + 1] === 'Vertical'
                    || collection[i as number] === 'verticalFlip') &&
                    (collection[i + 2] === 'horizontal' || collection[i + 2] === 'Horizontal'
                    || collection[i as number] === 'horizontalFlip') &&
                    (collection[i + 3] === 'vertical' || collection[i + 3] === 'Vertical'
                    || collection[i as number] === 'verticalFlip')) {
                    collection.pop(); collection.pop(); collection.pop(); collection.pop();
                } else if ((collection[i as number] === 'vertical' || collection[i as number] === 'Vertical'
                || collection[i as number] === 'verticalFlip')
                && (collection[i + 1] === 'horizontal' || collection[i + 1] === 'Horizontal'
                || collection[i + 1] === 'horizontalFlip') &&
                (collection[i + 2] === 'vertical' || collection[i + 2] === 'Vertical' || collection[i as number] === 'verticalFlip') &&
                (collection[i + 3] === 'horizontal' || collection[i + 3] === 'Horizontal' || collection[i as number] === 'horizontalFlip')) {
                    collection.pop(); collection.pop(); collection.pop(); collection.pop();
                }
            }
        }
        return collection;
    }

    private popForDefaultRotateState(collection: number[] | string[]): number[] | string[] {
        for (let i: number = 0; i < collection.length; i++) {
            if (!isNullOrUndefined(collection[i + 1])) {
                if ((collection[i as number] === 90 || collection[i as number] === 'rotateRight') &&
                    (collection[i + 1] === -90 || collection[i as number] === 'rotateLeft')) {
                    collection.pop(); collection.pop();
                } else if ((collection[i as number] === -90 || collection[i as number] === 'rotateLeft') &&
                    (collection[i + 1] === 90 || collection[i as number] === 'rotateRight')) {
                    collection.pop(); collection.pop();
                }
            }
        }
        return collection;
    }

    private selectShape(id: string, obj: Object): void {
        const parent: ImageEditor = this.parent; let isSelected: boolean = false;
        if (!parent.disabled && parent.isImageLoaded) {
            this.applyActObj();
            if (id.split('_')[0] === 'shape') {
                let obj: SelectionPoint;
                for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                    if (parent.objColl[i as number].currIndex === id) {
                        obj = extend({}, parent.objColl[i as number], {}, true) as SelectionPoint;
                        break;
                    }
                }
                if (isNullOrUndefined(obj)) {isSelected = false; }
                else {
                    isSelected = true; parent.activeObj = obj;
                    const object: Object = {canvasFilter: null };
                    parent.notify('toolbar', { prop: 'getCanvasFilter', onPropertyChange: false, value: {obj: object }});
                    this.lowerContext.filter = object['canvasFilter'];
                    parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false,
                        value: {obj: parent.activeObj}});
                    if (!isBlazor()) {
                        if (parent.activeObj.shape === 'text') {
                            parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'text',
                                isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                        } else if (parent.activeObj.shape === 'pen') {
                            parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'pen',
                                isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                        } else {
                            parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'shapes',
                                isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                        }
                        parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
                        parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
                    } else {
                        parent.updateToolbar(parent.element, parent.activeObj.shape);
                        if (parent.activeObj.shape === 'path') {
                            parent.updateToolbar(this.parent.element, 'path', 'pathQuickAccessToolbar');
                        } else {
                            parent.updateToolbar(parent.element, 'quickAccessToolbar', parent.activeObj.shape);
                        }
                    }
                }
            } else if (id.split('_')[0] === 'pen') {
                const object: Object = {bool: false };
                parent.notify('selection', { prop: 'getFreehandDrawEditing', onPropertyChange: false, value: {obj: object }});
                if (object['bool']) {parent.okBtn(); }
                const obj: Object = {isIndex: false };
                parent.notify('freehand-draw', { prop: 'isFHDIdx', value: { index: parseInt(id.split('_')[1], 10) - 1, obj: obj }});
                if (obj['isIndex']) {
                    isSelected = true;
                    parent.notify('freehand-draw', { prop: 'selectFhd', value: { id: id} });
                    if (!isBlazor()) {
                        parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: true} });
                        parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
                    } else {
                        parent.updateToolbar(parent.element, 'pen');
                        parent.updateToolbar(parent.element, 'quickAccessToolbar', 'pen');
                    }
                } else {
                    isSelected = false;
                }
            }
        }
        obj['isSelected'] = isSelected;
    }

    private deleteShape(id: string): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            this.applyActObj();
            if (id.split('_')[0] === 'shape') {
                for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                    if (parent.objColl[i as number].currIndex === id) {
                        parent.objColl.splice(i, 1);
                        break;
                    }
                }
            } else if (id.split('_')[0] === 'pen') {
                parent.notify('freehand-draw', {prop: 'handle-freehand-draw', value: {id: id}});
            }
            const object: Object = {canvasFilter: null };
            parent.notify('toolbar', { prop: 'getCanvasFilter', onPropertyChange: false, value: {obj: object }});
            this.lowerContext.filter = object['canvasFilter'];
            this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
            parent.notify('draw', { prop: 'redrawImgWithObj', onPropertyChange: false});
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
            } else {
                parent.updateToolbar(parent.element, 'imageLoaded');
            }
        }
    }

    private getMaxText(isTextBox?: boolean, text?: string, obj?: Object): string {
        if (isNullOrUndefined(text)) {
            text = isTextBox ? this.parent.textArea.value : this.parent.activeObj.keyHistory;
        }
        let maxi: number; const rows: string[] = text.split('\n'); let maxStr: number = rows[0].length;
        let maxText: string = rows[0];
        for (let i: number = 1; i < rows.length; i++) {
            maxi = rows[i as number].length;
            if (maxi > maxStr) {
                maxText = rows[i as number]; maxStr = maxi;
            }
        }
        if (obj) { obj['maxText'] = maxText; }
        return maxText;
    }
    private getLinePoints(x1: number, y1: number, x2: number, y2: number): Point[] {
        let points: Point[] = []; let i: number[]; let j: number[];
        if (x1 === x2) {
            if (y1 < y2) {
                i = [x1, y1]; j = [x2, y2];
            } else {
                j = [x1, y1]; i = [x2, y2];
            }
            const m: number = this.getSlope(i, j, true); const b: number = this.getIntercept(i, m);
            for (let y: number = i[1]; y <= j[1]; y++){
                const x: number = m * y + b; points.push({x: x, y: y});
            }
        } else {
            if (x1 < x2) {
                i = [x1, y1]; j = [x2, y2];
            } else {
                j = [x1, y1]; i = [x2, y2];
            }
            const m: number = this.getSlope(i, j, false); const b: number = this.getIntercept(i, m);
            for (let x: number = i[0]; x <= j[0]; x++){
                const y: number = m * x + b; points.push({x: x, y: y});
            }
        }
        if (Math.floor(x1) === Math.floor(x2) || (points.length < 10 && (y2 - y1 > 10 || y1 - y2 > 10))) {
            points = [];
            const lesserY: number = Math.min(y1, y2);
            for (let i: number = 0; i < Math.abs(Math.floor(y2) - Math.floor(y1)); i++) {
                points.push({x: x1, y: lesserY + i});
            }
            if (points.length > 1) {
                let prev: Point;
                if (isNullOrUndefined(points[points.length - 2])) {prev = {x: 0, y: 0}; }
                else {prev = points[points.length - 2]; }
                const diffX: number = points[points.length - 1]['x'] - prev.x;
                const diffY: number = points[points.length - 1]['y'] - prev.y;
                points.push({ x: points[points.length - 1]['x'] + (diffX / 2), y: points[points.length - 1]['y'] + (diffY / 2) });
            }
        } else if (Math.floor(y1) === Math.floor(y2) || (points.length < 10 && (x2 - x1 > 10 || x1 - x2 > 10))) {
            points = [];
            const lesserX: number = Math.min(x1, x2);
            for (let i: number = 0; i < Math.abs(Math.floor(x2) - Math.floor(x1)); i++) {
                points.push({x: lesserX + i, y: y1});
            }
            if (points.length > 1) {
                let prev: Point;
                if (isNullOrUndefined(points[points.length - 2])) {prev = {x: 0, y: 0}; }
                else {prev = points[points.length - 2]; }
                const diffX: number = points[points.length - 1]['x'] - prev.x;
                const diffY: number = points[points.length - 1]['y'] - prev.y;
                points.push({ x: points[points.length - 1]['x'] + (diffX / 2), y: points[points.length - 1]['y'] + (diffY / 2) });
            }
        }
        return points;
    }

    private getSlope(a: number[], b: number[], isSameAxis: boolean): number {
        let slope: number;
        if (isSameAxis) {
            if (a[1] === b[1]) {return null; } slope = (b[0] - a[0]) / (b[1] - a[1]);
        } else {
            if (a[0] === b[0]) {return null; } slope = (b[1] - a[1]) / (b[0] - a[0]);
        }
        return slope;
    }

    private getIntercept(point: number[], getSlope: number): number {
        if (getSlope === null) {return point[0]; }
        return point[1] - getSlope * point[0];
    }

    private setPointCollForShapeRotation(obj: SelectionPoint): void {
        const center: Point = {x: obj.activePoint.startX + (obj.activePoint.width / 2), y: obj.activePoint.startY +
        (obj.activePoint.height / 2)};
        const p1: Point = { x: Math.cos(obj.rotatedAngle) * (obj.activePoint.startX - center.x) - Math.sin(obj.rotatedAngle) *
            (obj.activePoint.startY - center.y) + center.x,
        y: Math.sin(obj.rotatedAngle) * (obj.activePoint.startX - center.x) + Math.cos(obj.rotatedAngle) *
            (obj.activePoint.startY - center.y) + center.y };
        const p2: Point = { x: Math.cos(obj.rotatedAngle) * (obj.activePoint.endX - center.x) - Math.sin(obj.rotatedAngle) *
            (obj.activePoint.startY - center.y) + center.x,
        y: Math.sin(obj.rotatedAngle) * (obj.activePoint.endX - center.x) + Math.cos(obj.rotatedAngle) * (obj.activePoint.startY
                - center.y) + center.y };
        const p3: Point = { x: Math.cos(obj.rotatedAngle) * (obj.activePoint.startX - center.x) - Math.sin(obj.rotatedAngle) *
            (obj.activePoint.endY - center.y) + center.x,
        y: Math.sin(obj.rotatedAngle) * (obj.activePoint.startX - center.x) + Math.cos(obj.rotatedAngle) * (obj.activePoint.endY
                - center.y) + center.y };
        const p4: Point = { x: Math.cos(obj.rotatedAngle) * (obj.activePoint.endX - center.x) - Math.sin(obj.rotatedAngle) *
            (obj.activePoint.endY - center.y) + center.x,
        y: Math.sin(obj.rotatedAngle) * (obj.activePoint.endX - center.x) + Math.cos(obj.rotatedAngle) * (obj.activePoint.endY
                - center.y) + center.y };
        obj.horTopLinePointColl = this.getLinePoints(p1.x, p1.y, p2.x, p2.y);
        obj.horBottomLinePointColl = this.getLinePoints(p3.x, p3.y, p4.x, p4.y);
        obj.verLeftLinePointColl = this.getLinePoints(p1.x, p1.y, p3.x, p3.y);
        obj.verRightLinePointColl = this.getLinePoints(p2.x, p2.y, p4.x, p4.y);
        obj.verLeftLinePointColl.reverse(); obj.verRightLinePointColl.reverse();
        // Updating ratio for point collection
        for (let i: number = 0; i < obj.horTopLinePointColl.length; i++) {
            obj.horTopLinePointColl[i as number].ratioX = (obj.horTopLinePointColl[i as number].x -
                this.parent.img.destLeft) / this.parent.img.destWidth;
            obj.horTopLinePointColl[i as number].ratioY = (obj.horTopLinePointColl[i as number].y -
                this.parent.img.destTop) / this.parent.img.destHeight;
        }
        for (let i: number = 0; i < obj.horBottomLinePointColl.length; i++) {
            obj.horBottomLinePointColl[i as number].ratioX = (obj.horBottomLinePointColl[i as number].x -
                this.parent.img.destLeft) / this.parent.img.destWidth;
            obj.horBottomLinePointColl[i as number].ratioY = (obj.horBottomLinePointColl[i as number].y -
                this.parent.img.destTop) / this.parent.img.destHeight;
        }
        for (let i: number = 0; i < obj.verLeftLinePointColl.length; i++) {
            obj.verLeftLinePointColl[i as number].ratioX = (obj.verLeftLinePointColl[i as number].x -
                this.parent.img.destLeft) / this.parent.img.destWidth;
            obj.verLeftLinePointColl[i as number].ratioY = (obj.verLeftLinePointColl[i as number].y -
                this.parent.img.destTop) / this.parent.img.destHeight;
        }
        for (let i: number = 0; i < obj.verRightLinePointColl.length; i++) {
            obj.verRightLinePointColl[i as number].ratioX = (obj.verRightLinePointColl[i as number].x -
                this.parent.img.destLeft) / this.parent.img.destWidth;
            obj.verRightLinePointColl[i as number].ratioY = (obj.verRightLinePointColl[i as number].y -
                this.parent.img.destTop) / this.parent.img.destHeight;
        }
        if (this.parent.upperCanvas.style.cursor !== 'move') {
            const object: Object = {rotationCirclePoint: null };
            this.parent.notify('selection', { prop: 'getTransRotationPoint', value: {obj: obj, object: object }});
            const rotationCirclePoint: Point = object['rotationCirclePoint'];
            if (rotationCirclePoint) {
                obj.rotationCirclePointColl = { x: Math.cos(obj.rotatedAngle) * (rotationCirclePoint.x - center.x) -
                    Math.sin(obj.rotatedAngle) * (rotationCirclePoint.y - center.y) + center.x,
                y: Math.sin(obj.rotatedAngle) * (rotationCirclePoint.x - center.x) + Math.cos(obj.rotatedAngle)
                    * (rotationCirclePoint.y - center.y) + center.y };
                obj.rotationCirclePointColl.ratioX = (obj.rotationCirclePointColl.x - this.parent.img.destLeft) /
                this.parent.img.destWidth;
                obj.rotationCirclePointColl.ratioY = (obj.rotationCirclePointColl.y - this.parent.img.destTop) /
                this.parent.img.destHeight;
            }
        }
    }

    private getSquarePointForRotatedShape(obj: SelectionPoint, object?: Object): ActivePoint {
        const point: ActivePoint = { startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0 };
        const center: Point = {x: obj.activePoint.startX + (obj.activePoint.width / 2), y: obj.activePoint.startY +
        (obj.activePoint.height / 2)};
        const p1: Point = { x: Math.cos(obj.rotatedAngle) * (obj.activePoint.startX - center.x) - Math.sin(obj.rotatedAngle)
            * (obj.activePoint.startY - center.y) + center.x,
        y: Math.sin(obj.rotatedAngle) * (obj.activePoint.startX - center.x) + Math.cos(obj.rotatedAngle) * (obj.activePoint.startY
                - center.y) + center.y };
        const p2: Point = { x: Math.cos(obj.rotatedAngle) * (obj.activePoint.endX - center.x) - Math.sin(obj.rotatedAngle) *
            (obj.activePoint.startY - center.y) + center.x,
        y: Math.sin(obj.rotatedAngle) * (obj.activePoint.endX - center.x) + Math.cos(obj.rotatedAngle) * (obj.activePoint.startY
                - center.y) + center.y };
        const p3: Point = { x: Math.cos(obj.rotatedAngle) * (obj.activePoint.startX - center.x) - Math.sin(obj.rotatedAngle) *
            (obj.activePoint.endY - center.y) + center.x,
        y: Math.sin(obj.rotatedAngle) * (obj.activePoint.startX - center.x) + Math.cos(obj.rotatedAngle) * (obj.activePoint.endY
                - center.y) + center.y };
        const p4: Point = { x: Math.cos(obj.rotatedAngle) * (obj.activePoint.endX - center.x) - Math.sin(obj.rotatedAngle) *
            (obj.activePoint.endY - center.y) + center.x,
        y: Math.sin(obj.rotatedAngle) * (obj.activePoint.endX - center.x) + Math.cos(obj.rotatedAngle) *
            (obj.activePoint.endY - center.y) + center.y };
        point.startX = p1.x; point.startY = p1.y; point.endX = p1.x; point.endY = p1.y;
        if (point.startX > p2.x) { point.startX = p2.x; } if (point.startX > p3.x) { point.startX = p3.x; }
        if (point.startX > p4.x) { point.startX = p4.x; } if (point.startY > p2.y) { point.startY = p2.y; }
        if (point.startY > p3.y) { point.startY = p3.y; } if (point.startY > p4.y) { point.startY = p4.y; }
        if (point.endX < p2.x) { point.endX = p2.x; } if (point.endX < p3.x) { point.endX = p3.x; }
        if (point.endX < p4.x) { point.endX = p4.x; } if (point.endY < p2.y) { point.endY = p2.y; }
        if (point.endY < p3.y) { point.endY = p3.y; } if (point.endY < p4.y) { point.endY = p4.y; }
        point.width = point.endX - point.startX; point.height = point.endY - point.startY;
        if (object) {
            object['activePoint'] = point;
        }
        return point;
    }
}
