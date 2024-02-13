import { EventHandler, extend, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CurrentObject, ImageEditor, Point, SelectionPoint, CropSelectionSettings, ShapeChangeEventArgs, ShapeSettings, ShapeType, StrokeSettings, TextSettings, ArrowheadType, ActivePoint } from '../index';

export class Shape {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private upperContext: CanvasRenderingContext2D;
    private textSettings: TextSettings =
        {text: 'Enter Text', fontFamily: '', fontSize: null, fontRatio: null, bold: false, italic: false, underline: false};
    private strokeSettings: StrokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
    private keyHistory: string = '';  // text history
    private prevObj: CurrentObject;
    private shapeImg: HTMLImageElement;

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
        const parent: ImageEditor = this.parent;
        this.initShapePvtProps(); let uploader: HTMLElement;
        switch (args.prop) {
        case 'drawEllipse':
            this.drawEllipse(args.value['x'], args.value['y'], args.value['radiusX'], args.value['radiusY'],
                             args.value['strokeWidth'], args.value['strokeColor'], args.value['fillColor'],
                             args.value['degree']);
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
                               args.value['strokeWidth'], args.value['strokeColor'], args.value['fillColor'],
                               args.value['degree']);
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
            EventHandler.add(parent.upperCanvas, 'dblclick', this.findTextTarget, this);
            EventHandler.add(parent.textArea, 'mousedown', this.findTextTarget, this);
            uploader = document.getElementById(parent.element.id + '_fileUpload');
            if (uploader) {
                EventHandler.add(uploader, 'change', this.fileChanged, this);
            }
            break;
        case 'unWireEvent':
            EventHandler.remove(parent.upperCanvas, 'dblclick', this.findTextTarget);
            EventHandler.remove(parent.textArea, 'mousedown', this.findTextTarget);
            uploader = document.getElementById(parent.element.id + '_fileUpload');
            EventHandler.remove(uploader, 'change', this.fileChanged);
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
            this.stopPathDrawing(args.value['e'], args.value['isApply']);
            break;
        case 'updateArrowRatio':
            this.updateArrowRatio(args.value['obj']);
            break;
        case 'getSquarePointForRotatedShape':
            this.getSquarePointForRotatedShape(args.value['obj'], args.value['object']);
            break;
        case 'drawImage':
            this.drawImage(args.value['x'], args.value['y'], args.value['width'], args.value['height'],
                           args.value['src'], args.value['degree'], args.value['isAspectRatio'], args.value['opacity']);
            break;
        case 'reset':
            this.reset();
            break;
        case 'fileChanged':
            this.fileChanged(args.value['e']);
            break;
        case 'updateObj':
            this.updateObj(args.value['dimObj'], args.value['x'], args.value['y']);
            break;
        case 'straightenShapes':
            this.straightenShapes();
            break;
        case 'straightenShapePoints':
            this.straightenShapePoints(args.value['obj'], args.value['isReverse']);
            break;
        case 'straightenPath':
            this.straightenPath(args.value['obj']);
            break;
        case 'straightenFHD':
            this.straightenFHD();
            break;
        case 'getTextBoxPosition':
            this.getTextBoxPosition(args.value['obj'], args.value['object']);
            break;
        case 'updateSelectionChangeEventArgs':
            this.updateSelectionChangeEventArgs(args.value['selectionSettings']);
            break;
        case 'setFlipState':
            this.setFlipState(args.value['x'], args.value['y'], args.value['obj'], args.value['object']);
            break;
        case 'getNewShapeId':
            args.value['obj']['id'] = this.getNewShapeId();
            break;
        }
    }

    public getModuleName(): string {
        return 'shape';
    }

    private initShapePvtProps(): void {
        const parent: ImageEditor = this.parent;
        if (parent.lowerCanvas) {this.lowerContext = parent.lowerCanvas.getContext('2d'); }
        if (parent.upperCanvas) {this.upperContext = parent.upperCanvas.getContext('2d'); }
        if (isNullOrUndefined(this.shapeImg)) {
            this.shapeImg = parent.createElement('img', {
                id: parent.element.id + '_shapeImg', attrs: { name: 'Image', crossorigin: 'anonymous' }
            });
        }
        if (this.textSettings.fontFamily === '') {
            this.textSettings.fontFamily = parent.fontFamily.default;
        }
    }

    private reset(): void {
        this.textSettings =
            {text: 'Enter Text', fontFamily: this.parent.fontFamily.default, fontSize: null, fontRatio: null, bold: false, italic: false, underline: false};
        this.strokeSettings = {strokeColor: '#fff', fillColor: '', strokeWidth: null};
    }

    private drawEllipse(x?: number, y?: number, radiusX?: number, radiusY?: number, strokeWidth?: number, strokeColor?: string,
                        fillColor?: string, degree?: number): void {
        this.initializeShape('ellipse');
        const start: Point = x && y ? {x: x, y: y} : null;
        this.drawShape('ellipse', strokeWidth, strokeColor, fillColor, start, radiusX, radiusY, null, null, null, degree);
    }

    private drawLine(startX?: number, startY?: number, endX?: number, endY?: number, strokeWidth?: number,
        strokeColor?: string): void {
        this.initializeShape('line');
        const start: Point = startX && startY ? {x: startX, y: startY} : null;
        const width: number = endX - startX; const height: number = endY - startY;
        this.drawShape('line', strokeWidth, strokeColor, null, start, width, height);
    }

    private drawPath(pointColl: Point[], strokeWidth?: number, strokeColor?: string): void {
        const parent: ImageEditor = this.parent;
        this.initializeShape('path');
        if (pointColl) {
            this.drawShape('path', strokeWidth, strokeColor, null, null, null, null, pointColl);
        } else {
            this.drawShape('line', strokeWidth, strokeColor);
            const obj: SelectionPoint = extend({}, parent.objColl[parent.objColl.length - 1], null, true) as SelectionPoint;
            obj.shape = 'path'; obj.lineDraw = null;
            obj.pointColl = [{x: obj.activePoint.startX, y: obj.activePoint.startY},
                {x: obj.activePoint.endX, y: obj.activePoint.endY }];
            parent.objColl[parent.objColl.length - 1] = obj;
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
        const parent: ImageEditor = this.parent;
        this.redrawActObj();
        parent.activeObj.shape = type;
        if (parent.currObjType.shape === 'freehanddraw') {
            this.apply(); parent.upperCanvas.style.cursor = parent.cursor = 'default';
            parent.currObjType.shape = '';
        }
        parent.currObjType.isCustomCrop = false;
    }

    private updateWidthHeight(obj: SelectionPoint): SelectionPoint {
        obj.activePoint.width = obj.activePoint.endX - obj.activePoint.startX;
        obj.activePoint.height = obj.activePoint.endY - obj.activePoint.startY;
        return obj;
    }

    private setDimension(width: number, height: number): void {
        const parent: ImageEditor = this.parent;
        if (width && height) {
            parent.activeObj.activePoint.width = width; parent.activeObj.activePoint.height = height;
            if (parent.currObjType.shape.toLowerCase() === 'ellipse') {
                parent.activeObj.activePoint.width = 2 * width;
                parent.activeObj.activePoint.height = 2 * height;
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
                      height?: number, pointColl?: Point[], arrowStart?: ArrowheadType, arrowEnd?: ArrowheadType, degree?: number,
                      opacity?: number): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
            this.redrawActObj();
            const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
            parent.togglePen = false; this.keyHistory = '';
            parent.upperCanvas.style.display = 'block'; this.refreshActiveObj();
            parent.currObjType.shape = type = type.toLowerCase();
            if (type === 'path' && isNullOrUndefined(pointColl)) {
                parent.activeObj.shape = type;
                parent.activeObj.pointColl = [];
                parent.upperCanvas.style.cursor = parent.cursor = 'crosshair';
                parent.notify('selection', { prop: 'setCurrentDrawingShape', onPropertyChange: false, value: {value: 'path' }});
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'shapes',
                        isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                    parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
                }
            } else {
                if (type !== 'freehanddraw' && type !== '') {
                    parent.activeObj.shape = type;
                    let strokeSettings: StrokeSettings = parent.activeObj.strokeSettings;
                    this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                    if (isNullOrUndefined(strokeSettings)) {
                        strokeSettings = this.strokeSettings;
                    }
                    if (type === 'path' && pointColl) {
                        parent.activeObj.pointColl = pointColl;
                    }
                    if (opacity !== null && opacity !== undefined) {parent.activeObj.opacity = opacity; }
                    strokeSettings.strokeWidth = strokeWidth ? strokeWidth : strokeSettings.strokeWidth;
                    strokeSettings.strokeColor = strokeColor ? strokeColor : strokeSettings.strokeColor;
                    strokeSettings.fillColor = fillColor ? fillColor : strokeSettings.fillColor;
                    const tempWidth: number = parent.img.destWidth > 100 ? 100 : parent.img.destWidth / 2;
                    const tempHeight: number = parent.img.destHeight > 100 ? 100 : parent.img.destHeight / 2;
                    parent.activeObj.activePoint.width = tempWidth; parent.activeObj.activePoint.height = tempHeight;
                    if (type === 'line' || type === 'arrow') {
                        parent.activeObj.lineDraw = 'horizontal'; parent.activeObj.activePoint.height = 0;
                        if (type === 'arrow') {
                            parent.activeObj.activePoint.width += 50;
                            parent.activeObj.start = this.getArrowType(arrowStart); parent.activeObj.end = this.getArrowType(arrowEnd);
                        }
                    } else if (type === 'rectangle') {
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
                    if (type === 'arrow') {
                        parent.activeObj.triangleDirection = 'right';
                    }
                    parent.currObjType.isDragging = parent.currObjType.isCustomCrop = false;
                    this.initShapeProps();
                    const obj: Object = {shapeSettingsObj: {} as ShapeSettings };
                    parent.notify('selection', { prop: 'updatePrevShapeSettings', onPropertyChange: false, value: {obj: obj}});
                    const shapeSettings: ShapeSettings = obj['shapeSettingsObj'];
                    const shapeChangingArgs: ShapeChangeEventArgs = {cancel: false, action: 'insert', previousShapeSettings: shapeSettings,
                        currentShapeSettings: shapeSettings};
                    if (isBlazor() && parent.events && parent.events.shapeChanging.hasDelegate === true) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        (parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShape', shapeChangingArgs, null) as any).then((shapeChangingArgs: ShapeChangeEventArgs) => {
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
                                parent.notify('undo-redo', {prop: 'updateUndoRedo', value: {operation: 'shapeInsert'}, onPropertyChange: false});
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
                            parent.notify('undo-redo', {prop: 'updateUndoRedo', value: {operation: 'shapeInsert'}, onPropertyChange: false});
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
        const shape: string = parent.activeObj.shape;
        const {startX, startY, endX, endY} : ActivePoint = parent.activeObj.activePoint;
        if (shape === 'line' || shape === 'arrow') {
            parent.activeObj.pointColl = this.getLinePoints(startX, startY, endX, endY);
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
                parent.getFontSizes();
                parent.activeObj.textSettings.fontSize = parseInt(parent.fontSizeColl[(parseInt('3', 10) - 1)].text, 10);
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
            const shapeChangingArgs: ShapeChangeEventArgs = {cancel: false, action: 'insert', previousShapeSettings: shapeSettings,
                currentShapeSettings: shapeSettings};
            if (isBlazor() && parent.events && parent.events.shapeChanging.hasDelegate === true) {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                (parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShape', shapeChangingArgs, null) as any).then((shapeChangingArgs: ShapeChangeEventArgs) => {
                    this.drawShapeTextEvent(shapeChangingArgs);
                    if (parent.isPublicMethod) {
                        parent.notify('undo-redo', {prop: 'updateUndoRedo', value: {operation: 'shapeInsert'}, onPropertyChange: false});
                    }
                    parent.isPublicMethod = false;
                });
            } else {
                parent.trigger('shapeChanging', shapeChangingArgs);
                this.drawShapeTextEvent(shapeChangingArgs);
                if (parent.isPublicMethod) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedo', value: {operation: 'shapeInsert'}, onPropertyChange: false});
                }
                parent.isPublicMethod = false;
            }
        }
    }

    private drawShapeImageEvent(shapeChangingArgs: ShapeChangeEventArgs, isSelect: boolean): void {
        const parent: ImageEditor = this.parent;
        this.updateShapeChangeEventArgs(shapeChangingArgs.currentShapeSettings);
        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate' }});
        parent.objColl.push(parent.activeObj);
        const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: 'shapeInsert', previousObj: this.prevObj, previousObjColl: this.prevObj.objColl,
                previousPointColl: this.prevObj.pointColl, previousSelPointColl: this.prevObj.selPointColl, previousCropObj: prevCropObj,
                previousText: null, currentText: null, previousFilter: null, isCircleCrop: null}});
        parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false,
            value: {obj: parent.objColl[parent.objColl.length - 1]}});
        if (isSelect) {
            if (!isBlazor()) {
                parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'shapes',
                    isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
                parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
                parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
            } else {
                parent.updateToolbar(parent.element, parent.activeObj.shape);
                parent.updateToolbar(parent.element, 'quickAccessToolbar', parent.activeObj.shape);
            }
        } else {
            parent.okBtn();
        }
        parent.notify('selection', { prop: 'isShapeInserted', onPropertyChange: false, value: {bool: true} });
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
            value: {operation: 'shapeInsert', previousObj: this.prevObj, previousObjColl: this.prevObj.objColl,
                previousPointColl: this.prevObj.pointColl, previousSelPointColl: this.prevObj.selPointColl,
                previousCropObj: prevCropObj, previousText: null, currentText: null, previousFilter: null, isCircleCrop: null}});
        parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false,
            value: {obj: parent.objColl[parent.objColl.length - 1]}});
        if (isBlazor()) {
            parent.updateToolbar(parent.element, 'quickAccessToolbar', 'text');
        }  else {
            parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
        }
        parent.notify('selection', { prop: 'isShapeInserted', onPropertyChange: false, value: {bool: true} });
        if (isBlazor()) {
            parent.updateToolbar(parent.element, 'text');
            parent.getFontSizes();
        } else {
            parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'text',
                isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
            parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
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

    private drawImage(x: number, y: number, width: number, height: number, src: string | ImageData, degree: number,
                      isAspectRatio: boolean, opacity?: number): void {
        this.initializeShape('image');
        this.onLoadImgShape(x, y, width, height, src, null, degree, isAspectRatio, opacity);
    }

    private redrawActObj(x?: number, y?: number, isMouseDown?: boolean): void {
        let splitWords: string[];
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.shape) {splitWords = parent.activeObj.shape.split('-'); }
        if (parent.activeObj.horTopLine && (parent.activeObj.shape && splitWords[0] !== 'crop')) {
            if (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') {
                parent.notify('selection', { prop: 'setTextBoxStylesToActObj', onPropertyChange: false });
                this.updateFontRatio(parent.activeObj, true);
                if (x && y) {
                    if ((x !== parent.activeObj.activePoint.startX) && (y !== parent.activeObj.activePoint.startY)) {
                        this.updateTextFromTextArea();
                    }
                } else {
                    this.updateTextFromTextArea();
                    parent.textArea.style.transform = '';
                    parent.notify('toolbar', { prop: 'refresh-main-toolbar', onPropertyChange: false});
                }
                this.refreshActiveObj();
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
        parent.activeObj.activePoint = { startX: selectionSettings.startX, startY: selectionSettings.startY,
            endX: parent.activeObj.activePoint.startX + parent.activeObj.activePoint.width,
            endY: parent.activeObj.activePoint.startY + parent.activeObj.activePoint.height,
            width: selectionSettings.width, height: selectionSettings.height };
    }

    private updateShapeChangeEventArgs(shapeSettings: ShapeSettings): void {
        const parent: ImageEditor = this.parent; let shapeId: number;
        if (shapeSettings.id && shapeSettings.id.split('_')[0] && shapeSettings.id.split('_')[0] === 'pen') {
            shapeId = parseInt(shapeSettings.id.split('_')[1], 10) - 1;
            parent.pointColl[shapeId as number].points = shapeSettings.points;
            parent.pointColl[shapeId as number].strokeColor = shapeSettings.strokeColor;
            parent.pointColl[shapeId as number].strokeWidth = shapeSettings.strokeWidth;
            parent.pointColl[shapeId as number].opacity = shapeSettings.opacity;
        } else {
            parent.activeObj.currIndex = shapeSettings.id;
            parent.activeObj.activePoint.startX = shapeSettings.startX;
            parent.activeObj.activePoint.startY = shapeSettings.startY;
            if (shapeSettings.width && shapeSettings.height) {
                parent.activeObj.activePoint.width = shapeSettings.width;
                parent.activeObj.activePoint.height = shapeSettings.height;
                parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + parent.activeObj.activePoint.width;
                parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY + parent.activeObj.activePoint.height;
            }
            parent.activeObj.strokeSettings.strokeColor = shapeSettings.strokeColor;
            parent.activeObj.strokeSettings.fillColor = shapeSettings.fillColor;
            parent.activeObj.strokeSettings.strokeWidth = shapeSettings.strokeWidth;
            parent.activeObj.opacity = shapeSettings.opacity;
            if (isNullOrUndefined(shapeSettings.degree)) { shapeSettings.degree = 0; }
            switch (parent.activeObj.shape) {
            case 'ellipse':
                if (isBlazor()) {
                    parent.activeObj.activePoint.width = shapeSettings.radius;
                } else {
                    parent.activeObj.activePoint.width = shapeSettings.radiusX * 2;
                    parent.activeObj.activePoint.height = shapeSettings.radiusY * 2;
                    parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + parent.activeObj.activePoint.width;
                    parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY + parent.activeObj.activePoint.height;
                }
                if (shapeSettings.degree) {
                    parent.activeObj.rotatedAngle = shapeSettings.degree * (Math.PI / 180);
                }
                break;
            case 'line':
            case 'arrow':
                parent.activeObj.activePoint.width = shapeSettings.length;
                if (!isBlazor()) {
                    parent.activeObj.activePoint.endX = shapeSettings.endX;
                    parent.activeObj.activePoint.endY = shapeSettings.endY;
                    parent.activeObj.activePoint.width = parent.activeObj.activePoint.startX + parent.activeObj.activePoint.width;
                    parent.activeObj.activePoint.height = parent.activeObj.activePoint.startY + parent.activeObj.activePoint.height;
                    if (parent.activeObj.shape === 'arrow') {
                        parent.activeObj.start = this.getArrowType(shapeSettings.arrowHead);
                        parent.activeObj.end = this.getArrowType(shapeSettings.arrowTail);
                    }
                }
                break;
            case 'text':
                parent.activeObj.keyHistory = parent.activeObj.textSettings.text = shapeSettings.text;
                parent.activeObj.textSettings.fontSize = shapeSettings.fontSize;
                parent.activeObj.strokeSettings.strokeColor = shapeSettings.color;
                parent.activeObj.textSettings.fontFamily = shapeSettings.fontFamily;
                if (shapeSettings.degree) {
                    parent.activeObj.rotatedAngle = shapeSettings.degree * (Math.PI / 180);
                }
                break;
            case 'rectangle':
            case 'image':
                if (shapeSettings.degree) {
                    parent.activeObj.rotatedAngle = shapeSettings.degree * (Math.PI / 180);
                }
                // Prevented setting image src as it cannot be set in canvas
                break;
            case 'path':
                parent.activeObj.pointColl = shapeSettings.points;
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
    }

    private updateSelectionChangeEventArgs(selectionSettings: CropSelectionSettings): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.activePoint.startX = selectionSettings.startX;
        parent.activeObj.activePoint.startY = selectionSettings.startY;
        if (selectionSettings.width && selectionSettings.height) {
            parent.activeObj.activePoint.width = selectionSettings.width;
            parent.activeObj.activePoint.height = selectionSettings.height;
            parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + parent.activeObj.activePoint.width;
            parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY + parent.activeObj.activePoint.height;
        }
    }

    private addLetter(letter: string): void {
        const parent: ImageEditor = this.parent;
        if (parent.textArea.style.display === 'none' && (parent.currObjType.isText || parent.activeObj.shape === 'text')) {
            const {fontSize} : TextSettings = parent.activeObj.textSettings;
            if (letter === 'Backspace') {this.keyHistory = this.keyHistory.slice(0, -1); }
            else {this.keyHistory += letter; }
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            this.updateFontStyles();
            const width: number = this.upperContext.measureText(this.keyHistory).width + fontSize * 0.5;
            const height: number = fontSize + fontSize * 0.25;
            this.upperContext.fillText(this.keyHistory, parent.activeObj.activePoint.startX,
                                       parent.activeObj.activePoint.startY + fontSize);
            this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
            parent.currObjType.isText = true;
            parent.notify('selection', { prop: 'setActivePoint', onPropertyChange: false,
                value: {startX: width, startY: height}});
        }
    }

    private redrawText(): void {
        const parent: ImageEditor = this.parent;
        const {fontSize, fontFamily, bold, italic} : TextSettings = parent.activeObj.textSettings;
        let fontStyle: string = '';
        if (bold) {
            fontStyle += 'bold ';
        }
        if (italic) {
            fontStyle += 'italic ';
        }
        this.upperContext.font = fontStyle + fontSize + 'px ' + fontFamily;
        const rows: string[] = parent.activeObj.keyHistory.split('\n');
        const text: string = (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') ?
            this.getMaxText(true) : this.getMaxText();
        const width: number = this.upperContext.measureText(text).width + fontSize * 0.5;
        const height: number = rows.length * (fontSize + fontSize * 0.25);
        parent.notify('selection', { prop: 'setTextSelection', onPropertyChange: false,
            value: {width: width, height: height}});
        parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: parent.activeObj.activePoint, obj: parent.activeObj,
            isMouseMove: null, x: null, y: null}});
        parent.notify('selection', { prop: 'redrawShape', onPropertyChange: false,
            value: {obj: parent.activeObj}});
    }

    private updateTextFromTextArea(): void {
        const parent: ImageEditor = this.parent; let allowUndoRedo: boolean = false;
        const { fontSize } : TextSettings = parent.activeObj.textSettings;
        const tempActiveObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
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
        if (parent.activeObj.keyHistory !== parent.textArea.value) {
            allowUndoRedo = true;
        }
        parent.activeObj.keyHistory = parent.textArea.value; parent.textArea.style.display = 'none';
        parent.textArea.value = ''; this.updateFontStyles();
        let width: number = this.upperContext.measureText(parent.activeObj.keyHistory).width + fontSize * 0.5;
        let height: number = fontSize + fontSize * 0.25;
        const rows: string[] = parent.activeObj.keyHistory.split('\n');
        if (rows.length > 1) {
            height *= rows.length; const widthColl: number[] = [];
            for (let i: number = 0, len: number = rows.length; i < len; i++) {
                widthColl.push(this.upperContext.measureText(rows[i as number]).width + fontSize * 0.5);
            }
            width = Math.max(...widthColl);
        }
        parent.notify('selection', { prop: 'setTextSelection', onPropertyChange: false,
            value: {width: width, height: height}});
        if (parent.activeObj.rotatedAngle !== 0) {
            const width: number = parent.activeObj.activePoint.width - tempActiveObj.activePoint.width;
            const height: number = parent.activeObj.activePoint.height - tempActiveObj.activePoint.height;
            let value: string = '';
            if (width > 0 && height > 0) {
                value = 'widthHeight';
            } else if (width !== 0) {
                value = 'width';
            } else if (height !== 0) {
                value = 'height';
            }
            parent.activeObj.activePoint = extend({}, tempActiveObj.activePoint, {}, true) as ActivePoint;
            parent.notify('selection', { prop: 'adjustRotationPoints', onPropertyChange: false, value: { rectangle: parent.activeObj.activePoint,
                x: width, y: height, angle: parent.activeObj.rotatedAngle, type: 'text', elem: value }});
            parent.notify('shape', { prop: 'updateFontSize', onPropertyChange: false,
                value: {obj: parent.activeObj}});
        }
        parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: parent.activeObj.activePoint, obj: parent.activeObj,
            isMouseMove: null, x: null, y: null}});
        this.updImgRatioForActObj();
        if  (parent.activeObj.rotatedAngle !== 0) {
            parent.notify('selection', {prop: 'updPtCollForShpRot', onPropertyChange: false, value: {obj: parent.activeObj }});
        }
        if (allowUndoRedo) {
            this.apply(parent.activeObj.shape, parent.activeObj);
            parent.objColl.push(extend({}, parent.activeObj, {}, true) as SelectionPoint);
            parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                value: {operation: 'text', previousObj: prevObj, previousObjColl: prevObj.objColl,
                    previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                    previousCropObj: prevCropObj, previousText: parent.activeObj.keyHistory,
                    currentText: parent.textArea.value, previousFilter: null, isCircleCrop: null}});
        } else {
            this.apply(parent.activeObj.shape, parent.activeObj);
            parent.objColl.push(extend({}, parent.activeObj, {}, true) as SelectionPoint);
        }
    }

    private iterateObjColl(): void {
        const parent: ImageEditor = this.parent;
        if (parent.objColl.length > 0) {
            for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                const temp: string = this.lowerContext.filter; this.lowerContext.filter = 'none';
                this.apply(parent.objColl[i as number].shape, parent.objColl[i as number]);
                this.lowerContext.filter = temp; this.refreshActiveObj();
            }
            parent.notify('draw', {prop: 'applyFrame', value: {ctx: this.lowerContext, frame: parent.frameObj.type, preventImg: true}});
        }
    }

    private updImgRatioForActObj(): void {
        const parent: ImageEditor = this.parent;
        const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop,
            width: parent.img.destWidth, height: parent.img.destHeight};
        this.straightenShapes();
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        const activePoint: ActivePoint = parent.activeObj.activePoint;
        parent.activeObj.imageRatio = { startX: ((activePoint.startX - destLeft) /
            destWidth), startY: ((activePoint.startY - destTop) / destHeight),
        endX: ((activePoint.endX - destLeft) / destWidth),
        endY: ((activePoint.endY - destTop) / destHeight),
        width: destWidth / activePoint.width, height: destHeight / activePoint.height };
        if (parent.activeObj.rotationCirclePointColl) {
            parent.activeObj.rotationCirclePointColl.ratioX = (parent.activeObj.rotationCirclePointColl.x -
                destLeft) / destWidth;
            parent.activeObj.rotationCirclePointColl.ratioY = (parent.activeObj.rotationCirclePointColl.y -
                destTop) / destHeight;
        }
        if (parent.activeObj.shape === 'path') {this.updatePathRatio(parent.activeObj); }
        else if (parent.activeObj.shape === 'arrow') {this.updateArrowRatio(parent.activeObj); }
        parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
        parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
    }

    private zoomObjColl(preventApply?: true): void {
        const parent: ImageEditor = this.parent;
        const destPoints: ActivePoint = {startX: parent.img.destLeft, startY: parent.img.destTop,
            width: parent.img.destWidth, height: parent.img.destHeight};
        this.straightenShapes();
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            let currObj: SelectionPoint = parent.objColl[i as number];
            currObj.activePoint.startX = (currObj.imageRatio.startX * destWidth) + destLeft;
            currObj.activePoint.startY = (currObj.imageRatio.startY * destHeight) + destTop;
            currObj.activePoint.endX = (currObj.imageRatio.endX * destWidth) + destLeft;
            currObj.activePoint.endY = (currObj.imageRatio.endY * destHeight) + destTop;
            currObj = this.updateWidthHeight(currObj);
            if (currObj.shape === 'text') {
                this.updateFontSize(currObj);
            } else if (currObj.shape === 'line' || currObj.shape === 'arrow') {
                currObj.pointColl = this.getLinePoints(currObj.activePoint.startX, currObj.activePoint.startY, currObj.activePoint.endX,
                                                       currObj.activePoint.endY);
                for (let n: number = 0, len: number = currObj.pointColl.length; n < len; n++) {
                    currObj.pointColl[n as number].ratioX =
                        (currObj.pointColl[n as number].x - destLeft) / destWidth;
                    currObj.pointColl[n as number].ratioY =
                        (currObj.pointColl[n as number].y - destTop) / destHeight;
                }
                if (currObj.shape === 'arrow') {
                    this.updateArrowSize(currObj);
                }
                if (parent.transform.straighten !== 0 && (currObj.shape === 'line' || currObj.shape === 'arrow')) {
                    this.straightenShapePoints(currObj);
                }
            } else if (currObj.shape === 'path') {
                for (let l: number = 0, len: number = currObj.pointColl.length; l < len; l++) {
                    currObj.pointColl[l as number].x = (currObj.pointColl[l as number].ratioX * destWidth) +
                        destLeft;
                    currObj.pointColl[l as number].y = (currObj.pointColl[l as number].ratioY * destHeight) +
                        destTop;
                }
                this.updatePathRatio(currObj);
                if (parent.transform.straighten !== 0) {
                    this.straightenPath(currObj);
                }
            }
            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: currObj.activePoint,
                obj: currObj}});
            if (isNullOrUndefined(preventApply)) {
                const temp: string = this.lowerContext.filter; this.lowerContext.filter = 'none';
                this.apply(currObj.shape, currObj);
                this.refreshActiveObj(); this.lowerContext.filter = temp;
                parent.notify('draw', {prop: 'applyFrame', value: {ctx: this.lowerContext, frame: parent.frameObj.type, preventImg: true}});
            }
            if (currObj.shape !== 'line' && currObj.shape !== 'arrow' && currObj.shape !== 'path' && currObj.rotatedAngle !== 0) {
                this.setPointCollForShapeRotation(currObj);
                currObj.rotationCirclePoint.x = (currObj.rotationCirclePoint.ratioX * destWidth) + destLeft;
                currObj.rotationCirclePoint.y = (currObj.rotationCirclePoint.ratioY * destHeight) + destTop;
                currObj.rotationCirclePointColl.x = (currObj.rotationCirclePointColl.ratioX * destWidth) + destLeft;
                currObj.rotationCirclePointColl.y = (currObj.rotationCirclePointColl.ratioY * destHeight) + destTop;
            }
        }
        parent.img.destLeft = destPoints.startX; parent.img.destTop = destPoints.startY;
        parent.img.destWidth = destPoints.width; parent.img.destHeight = destPoints.height;
    }

    private straightenPath(obj: SelectionPoint): void {
        let point: Point;
        for (let j: number = 0, len: number = obj.pointColl.length; j < len; j++) {
            point = this.straightenPoints(obj.pointColl[j as number].x, obj.pointColl[j as number].y);
            obj.pointColl[j as number].x = point.x;
            obj.pointColl[j as number].y = point.y;
        }
    }

    private straightenFHD(): void {
        const parent: ImageEditor = this.parent;
        for (let i: number = 0, fLen: number = parent.freehandCounter; i < fLen; i++) {
            parent.points = extend([], parent.pointColl[i as number].points, []) as Point[];
            const len: number = parent.points.length; let point: Point;
            for (let l: number = 0; l < len; l++) {
                point = this.straightenPoints(parent.points[l as number].x, parent.points[l as number].y);
                parent.points[l as number].x = point.x; parent.points[l as number].y = point.y;
            }
        }
        const selPointCollObj: Object = {selPointColl: null };
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false, value: {obj: selPointCollObj }});
        for (let i: number = 0, fLen: number = parent.freehandCounter; i < fLen; i++) {
            const len: number = selPointCollObj['selPointColl'][i as number].points.length; let point: Point;
            for (let l: number = 0; l < len; l++) {
                point = this.straightenPoints(selPointCollObj['selPointColl'][i as number].points[l as number].x,
                                              selPointCollObj['selPointColl'][i as number].points[l as number].y);
                selPointCollObj['selPointColl'][i as number].points[l as number].x = point.x;
                selPointCollObj['selPointColl'][i as number].points[l as number].y = point.y;
            }
        }
        const straightenObj: Object = { straightenPoint: null };
        parent.notify('freehand-draw', { prop: 'getStraightenPoint', onPropertyChange: false, value: {obj: straightenObj }});
        if (straightenObj['straightenPoint']['x'] && straightenObj['straightenPoint']['y']) {
            const obj: Object = {angle: 0 };
            parent.notify('freehand-draw', { prop: 'getStraightenPointAngle', onPropertyChange: false, value: {obj: obj }});
            const angle: number = (((parent.transform.straighten === 360 ? 0 : parent.transform.straighten) - obj['angle']) * (Math.PI / 180));
            const point: Point = this.straightenPoints(straightenObj['straightenPoint']['x'], straightenObj['straightenPoint']['y'], angle);
            if (angle === 0) {
                point.x = straightenObj['straightenPoint']['x']; point.y = straightenObj['straightenPoint']['y'];
            }
            parent.notify('freehand-draw', { prop: 'setStraightenPoint', onPropertyChange: false, value: {x: point.x, y: point.y }});
        }
    }

    private straightenPoints(x: number, y: number, angle?: number): Point {
        const parent: ImageEditor = this.parent;
        const center: Point = {x: parent.img.destLeft + (parent.img.destWidth / 2), y: parent.img.destTop + (parent.img.destHeight / 2)};
        angle = angle ? angle : ((parent.transform.straighten) * (Math.PI / 180));
        const point: Point = { x: Math.cos(angle) * (x - center.x) - Math.sin(angle) * (y - center.y) + center.x,
        y: Math.sin(angle) * (x - center.x) + Math.cos(angle) * (y - center.y) + center.y };
        return point;
    }

    private straightenShapes(): void {
        const parent: ImageEditor = this.parent;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        const straightenObj: Object = {bool: parent.isStraightening };
        if (!straightenObj['bool'] || parent.transform.straighten === 0) {
            return;
        }
        parent.notify('draw', {prop: 'updateImgCanvasPoints'});
        const object: Object = {points: null };
        parent.notify('draw', {prop: 'getImageCanvasPoints', value: {obj: object }});
        const center: Point = {x: destLeft + (destWidth / 2), y: destTop + (destHeight / 2)};
        const angle: number = -((parent.transform.straighten) * (Math.PI / 180));
        const p1: Point = { x: Math.cos(angle) * (object['points'][0]['x'] - center.x) - Math.sin(angle) *
            (object['points'][0]['y'] - center.y) + center.x,
        y: Math.sin(angle) * (object['points'][0]['x'] - center.x) + Math.cos(angle) *
            (object['points'][0]['y'] - center.y) + center.y };
        const p2: Point = { x: Math.cos(angle) * (object['points'][1]['x'] - center.x) - Math.sin(angle) *
            (object['points'][1]['y'] - center.y) + center.x,
        y: Math.sin(angle) * (object['points'][1]['x'] - center.x) + Math.cos(angle) * (object['points'][1]['y']
            - center.y) + center.y };
        const p3: Point = { x: Math.cos(angle) * (object['points'][2]['x'] - center.x) - Math.sin(angle) *
            (object['points'][2]['y'] - center.y) + center.x,
        y: Math.sin(angle) * (object['points'][2]['x'] - center.x) + Math.cos(angle) * (object['points'][2]['y']
            - center.y) + center.y };
        parent.img.destWidth = p2.x - p1.x; parent.img.destHeight = p3.y - p2.y;
        parent.img.destLeft = p1.x; parent.img.destTop = p1.y;
    }

    private straightenShapePoints(obj: SelectionPoint, isReverse?: boolean): void {
        const parent: ImageEditor = this.parent;
        const { destLeft, destTop, destWidth, destHeight } = parent.img;
        const straightenObj: Object = {bool: parent.isStraightening };
        if (!straightenObj['bool']) {
            return;
        }
        if (obj.shape === 'line' || obj.shape === 'arrow') {
            obj.activePoint.width = obj.activePoint.endX > obj.activePoint.startX ? obj.activePoint.endX -
                obj.activePoint.startX : obj.activePoint.startX - obj.activePoint.endX;
            obj.activePoint.height = obj.activePoint.endY > obj.activePoint.startY ? obj.activePoint.endY -
                obj.activePoint.startY : obj.activePoint.startY - obj.activePoint.endY;
            const center: Point = {x: destLeft + (destWidth / 2), y: destTop + (destHeight / 2)};
            const angle: number = (isReverse ? -parent.transform.straighten : parent.transform.straighten) * (Math.PI / 180);
            const start: Point = { x: Math.cos(angle) * (obj.activePoint.startX - center.x) - Math.sin(angle) *
                (obj.activePoint.startY - center.y) + center.x, y: Math.sin(angle) * (obj.activePoint.startX - center.x) + Math.cos(angle)
                * (obj.activePoint.startY - center.y) + center.y };
            const end: Point = { x: Math.cos(angle) * (obj.activePoint.endX - center.x) -
                Math.sin(angle) * (obj.activePoint.endY - center.y) + center.x, y: Math.sin(angle) * (obj.activePoint.endX  - center.x) +
                Math.cos(angle) * (obj.activePoint.endY - center.y) + center.y };
            obj.activePoint.startX = start.x; obj.activePoint.startY = start.y;
            obj.activePoint.endX = end.x; obj.activePoint.endY = end.y;
            obj.activePoint.width = obj.activePoint.endX > obj.activePoint.startX ? obj.activePoint.endX -
                obj.activePoint.startX : obj.activePoint.startX - obj.activePoint.endX;
            obj.activePoint.height = obj.activePoint.endY > obj.activePoint.startY ? obj.activePoint.endY -
                obj.activePoint.startY : obj.activePoint.startY - obj.activePoint.endY;
            parent.notify('selection', { prop: 'adjustActObjForLineArrow', onPropertyChange: false, value: {obj: obj }});
        }
    }

    private redrawObj(degree?: number | string): void {
        const parent: ImageEditor = this.parent;
        let isShape: boolean = false;
        if (parent.objColl.length > 0) {
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
                        isShape = true;
                    }
                }
                if (isShape) {
                    parent.notify('draw', {prop: 'applyFrame', value: {ctx: this.lowerContext, frame: parent.frameObj.type, preventImg: true}});
                }
                this.lowerContext.filter = tempFilter;
            }
        }
    }

    private updateCurrentActiveObjPoint(degree: number | string): void {
        const parent: ImageEditor = this.parent;
        let currActObjIndex: number; const { destLeft, destTop, destWidth, destHeight } = parent.img;
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
                        if (currObj.activePoint.startX <= destLeft + (destWidth / 2)) {
                            currObj.activePoint.endX = (destLeft + destWidth) - (currObj.activePoint.startX - destLeft);
                            currObj.activePoint.startX = currObj.activePoint.endX - currObj.activePoint.width;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint:
                                currObj.activePoint, obj: currObj}});
                        } else if (currObj.activePoint.startX >= destLeft + (destWidth / 2)) {
                            currObj.activePoint.startX = destLeft + (destLeft + destWidth - currObj.activePoint.endX);
                            currObj.activePoint.endX = currObj.activePoint.startX + currObj.activePoint.width;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value:
                                {actPoint: currObj.activePoint, obj: currObj}});
                        }
                        if (currObj.shape === 'line' || currObj.shape === 'arrow' || currObj.shape === 'path') {
                            this.flipLineArrowObj(currObj, 'horizontal');
                        } else if (currObj.rotatedAngle !== 0) {
                            currObj.rotatedAngle = currObj.rotatedAngle + (Math.PI - currObj.rotatedAngle) * 2;
                            if (currObj.rotationCirclePointColl.x <= destLeft + (destWidth / 2)) {
                                currObj.rotationCirclePointColl.x = (destLeft + destWidth) -
                                (currObj.rotationCirclePointColl.x - destLeft);
                            } else if (currObj.rotationCirclePointColl.x >= destLeft + (destWidth / 2)) {
                                currObj.rotationCirclePointColl.x = destLeft +
                                (destLeft + destWidth - currObj.rotationCirclePointColl.x);
                            }
                            currObj.rotationCirclePointColl.ratioX =
                                (currObj.rotationCirclePointColl.x - destLeft) / destWidth;
                        }
                        currObj.shapeFlip = parent.transform.currFlipState;
                        currObj.imageRatio = {startX: ((currObj.activePoint.startX - destLeft) / destWidth),
                            startY: ((currObj.activePoint.startY - destTop) / destHeight),
                            endX: ((currObj.activePoint.endX - destLeft) / destWidth),
                            endY: ((currObj.activePoint.endY - destTop) / destHeight),
                            width: destWidth / currObj.activePoint.width,
                            height: destHeight / currObj.activePoint.height };
                    }
                }
            }
            else if (degree === 'vertical' || degree === 'Vertical') {
                for (let i: number = 0; i < parent.objColl.length; i++) {
                    const currObj: SelectionPoint = parent.objColl[i as number];
                    if (currObj.shapeFlip !== parent.transform.currFlipState) {
                        if (currObj.activePoint.startY <= destTop + (destHeight / 2)) {
                            currObj.activePoint.endY = (destTop + destHeight) - (currObj.activePoint.startY - destTop);
                            currObj.activePoint.startY = currObj.activePoint.endY - currObj.activePoint.height;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: currObj.activePoint,
                                obj: currObj}});
                        } else if (currObj.activePoint.startY >= parent.lowerCanvas.height / 2) {
                            currObj.activePoint.startY = destTop + (destTop + destHeight - currObj.activePoint.endY);
                            currObj.activePoint.endY = currObj.activePoint.startY + currObj.activePoint.height;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint: currObj.activePoint,
                                obj: currObj}});
                        }
                        if (currObj.shape === 'line' || currObj.shape === 'arrow' ||
                            currObj.shape === 'path') {
                            this.flipLineArrowObj(currObj, 'vertical');
                        } else if (currObj.rotatedAngle !== 0) {
                            currObj.rotatedAngle = -currObj.rotatedAngle;
                            if (currObj.rotationCirclePointColl.y <= destTop + (destHeight / 2)) {
                                currObj.rotationCirclePointColl.y = (destTop + destHeight) - (currObj.rotationCirclePointColl.y - destTop);
                            } else if (currObj.rotationCirclePointColl.y >= destTop +
                                (destHeight / 2)) {
                                currObj.rotationCirclePointColl.y = destTop + (destTop + destHeight - currObj.rotationCirclePointColl.y);
                            }
                            currObj.rotationCirclePointColl.ratioY =
                                (currObj.rotationCirclePointColl.y - destTop) / destHeight;
                        }
                        currObj.shapeFlip = parent.transform.currFlipState;
                        currObj.imageRatio = {startX: ((currObj.activePoint.startX - destLeft) / destWidth),
                            startY: ((currObj.activePoint.startY - destTop) / destHeight),
                            endX: ((currObj.activePoint.endX - destLeft) / destWidth),
                            endY: ((currObj.activePoint.endY - destTop) / destHeight),
                            width: destWidth / currObj.activePoint.width,
                            height: destHeight / currObj.activePoint.height };
                    }
                }
            }
            else if (degree === 'verticalhorizontal' || degree === 'horizontalvertical') {
                for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
                    const currObj: SelectionPoint = parent.objColl[i as number];
                    if (currObj.shapeFlip !== parent.transform.currFlipState) {
                        if (currObj.activePoint.startX <= destLeft + (destWidth / 2)) {
                            currObj.activePoint.endX = (destLeft + destWidth) - (currObj.activePoint.startX -
                                destLeft);
                            currObj.activePoint.startX = currObj.activePoint.endX - currObj.activePoint.width;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value:
                            {actPoint: currObj.activePoint, obj: currObj}});
                        } else if (currObj.activePoint.startX >= destLeft + (destWidth / 2)) {
                            currObj.activePoint.startX = destLeft + (destLeft +
                                destWidth - currObj.activePoint.endX);
                            currObj.activePoint.endX = currObj.activePoint.startX + currObj.activePoint.width;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint:
                                currObj.activePoint, obj: currObj}});
                        }
                        if (currObj.activePoint.startY <= destTop + (destHeight / 2)) {
                            currObj.activePoint.endY = (destTop + destHeight) -
                            (currObj.activePoint.startY - destTop);
                            currObj.activePoint.startY = currObj.activePoint.endY -
                            currObj.activePoint.height;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint:
                                currObj.activePoint, obj: currObj}});
                        } else if (currObj.activePoint.startY >= parent.lowerCanvas.height / 2) {
                            currObj.activePoint.startY = destTop + (destTop +
                                destHeight - currObj.activePoint.endY);
                            currObj.activePoint.endY = currObj.activePoint.startY +
                            currObj.activePoint.height;
                            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value:
                            {actPoint: currObj.activePoint, obj: currObj}});
                        }
                        if (currObj.shape === 'line' || currObj.shape === 'arrow' || currObj.shape === 'path') {
                            this.flipLineArrowObj(currObj, degree);
                        }
                        currObj.shapeFlip = parent.transform.currFlipState;
                        currObj.imageRatio = {startX: ((currObj.activePoint.startX - destLeft) / destWidth),
                            startY: ((currObj.activePoint.startY - destTop) / destHeight),
                            endX: ((currObj.activePoint.endX - destLeft) / destWidth),
                            endY: ((currObj.activePoint.endY - destTop) / destHeight),
                            width: destWidth / currObj.activePoint.width,
                            height: destHeight / currObj.activePoint.height };
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
        const { destWidth, destHeight, destLeft, destTop } = parent.img;
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            let currObj: SelectionPoint = parent.objColl[i as number];
            const shape: string = currObj.shape;
            currObj.activePoint.startY = destTop + (destHeight * currObj.imageRatio.startX);
            currObj.activePoint.endY = destTop + (destHeight * currObj.imageRatio.endX);
            currObj.activePoint.startX = (destLeft + destWidth) - (destWidth * currObj.imageRatio.endY);
            currObj.activePoint.endX = (destLeft + destWidth) - (destWidth * currObj.imageRatio.startY);
            currObj = this.updateWidthHeight(parent.objColl[i as number]);
            this.updateFontSize(currObj);
            if (shape === 'line' || shape === 'arrow' || shape === 'path') {
                this.rotateLineArrowObj(currObj);
                if (shape === 'arrow') {
                    this.updateArrowSize(currObj);
                }
            } else if (currObj.rotatedAngle !== 0) {
                currObj.rotationCirclePointColl.y = destTop + (destHeight * currObj.rotationCirclePointColl.ratioX);
                currObj.rotationCirclePointColl.x = (destLeft + destWidth) -
                    (destWidth * currObj.rotationCirclePointColl.ratioY);
                currObj.rotationCirclePointColl.ratioX = (currObj.rotationCirclePointColl.x - destLeft) / destWidth;
                currObj.rotationCirclePointColl.ratioY = (currObj.rotationCirclePointColl.y - destTop) / destHeight;
            }
        }
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            parent.notify('draw', { prop: 'updateActiveObject', onPropertyChange: false, value: {actPoint:
                parent.objColl[i as number].activePoint, obj: parent.objColl[i as number]}});
        }
        for (let i: number = 0, len: number = parent.objColl.length; i < len; i++) {
            const currObj: SelectionPoint = parent.objColl[i as number];
            currObj.imageRatio = {startX: ((currObj.activePoint.startX - destLeft) / destWidth),
                startY: ((currObj.activePoint.startY - destTop) / destHeight),
                endX: ((currObj.activePoint.endX - destLeft) / destWidth),
                endY: ((currObj.activePoint.endY - destTop) / destHeight),
                width: destWidth / currObj.activePoint.width,
                height: destHeight / currObj.activePoint.height };
        }
    }

    private rotateLineArrowObj(obj: SelectionPoint): void {
        if (isNullOrUndefined(obj.pointColl)) {
            return;
        }
        const parent: ImageEditor = this.parent;
        const { destWidth, destHeight, destLeft, destTop } = parent.img;
        if (obj.pointColl.length > 0) {
            for (let n: number = 0; n < obj.pointColl.length; n++) {
                obj.pointColl[n as number].y = destTop + (destHeight * obj.pointColl[n as number].ratioX);
                obj.pointColl[n as number].x = (destLeft + destWidth) - (destWidth *
                    obj.pointColl[n as number].ratioY);
            }
            for (let n: number = 0; n < obj.pointColl.length; n++) {
                obj.pointColl[n as number].ratioX = (obj.pointColl[n as number].x - destLeft) / destWidth;
                obj.pointColl[n as number].ratioY = (obj.pointColl[n as number].y - destTop) / destHeight;
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
        value = value.toLowerCase();
        if (isNullOrUndefined(obj.pointColl)) {return; }
        if (value === 'horizontal') {this.lineArrowHorizontalFlip(obj); }
        else if (value === 'vertical') {this.lineArrowVerticalFlip(obj); }
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
        const { destWidth, destHeight, destLeft, destTop } = parent.img;
        if (obj.shapeFlip !== parent.transform.currFlipState) {
            for (let l: number = 0, len: number = obj.pointColl.length; l < len; l++) {
                const currPoint: Point = obj.pointColl[l as number];
                if (currPoint.x <= destLeft + (destWidth / 2)) {
                    currPoint.x = (destLeft + destWidth) - (currPoint.x - destLeft);
                } else if (currPoint.x >= destLeft + (destWidth / 2)) {
                    currPoint.x = destLeft + (destLeft + destWidth - currPoint.x);
                }
                currPoint.ratioX = (currPoint.x - destLeft) / destWidth;
                currPoint.ratioY = (currPoint.y - destTop) / destHeight;
            }
            if (obj.shape === 'arrow') {
                const value: string = obj.start; obj.start = obj.end; obj.end = value;
            }
            obj.shapeFlip = parent.transform.currFlipState;
        }
    }

    private lineArrowVerticalFlip(obj: SelectionPoint): void {
        const parent: ImageEditor = this.parent;
        const { destWidth, destHeight, destLeft, destTop } = parent.img;
        if (obj.shapeFlip !== parent.transform.currFlipState) {
            for (let l: number = 0, len: number = obj.pointColl.length; l < len; l++) {
                const currPoint: Point = obj.pointColl[l as number];
                if (currPoint.y <= destTop + (destHeight / 2)) {
                    currPoint.y = (destTop + destHeight) - (currPoint.y - destTop);
                } else if (currPoint.y >= destTop + (destHeight / 2)) {
                    currPoint.y = destTop + (destTop + destHeight - currPoint.y);
                }
                currPoint.ratioX = (currPoint.x - destLeft) / destWidth;
                currPoint.ratioY = (currPoint.y - destTop) / destHeight;
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
        if (isBlazor()) {
            parent.updateToolbar(parent.element, 'destroyQuickAccessToolbar');
        } else {
            parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false});
        }
        const dupElem: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_duplicate');
        const removeElem: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_remove');
        const editTextElem: HTMLElement = parent.element.querySelector('#' + parent.element.id + '_editText');
        if (dupElem) {dupElem.classList.add('e-disabled'); }
        if (removeElem) {removeElem.classList.add('e-disabled'); }
        if (editTextElem) {editTextElem.classList.add('e-disabled'); }
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
        if (parseFloat(parent.textArea.style.maxHeight) < parent.activeObj.textSettings.fontSize) {
            parent.textArea.style.maxHeight = parent.activeObj.textSettings.fontSize + 'px';
        } 
        if (degree % 90 === 0 && degree % 180 !== 0) {
            if (parseFloat(parent.textArea.style.left) + parseFloat(parent.textArea.style.width) > parent.img.destTop +
            parent.img.destHeight) {this.alignTextAreaIntoCanvas(); }
        } else {
            if (parseFloat(parent.textArea.style.left) + parseFloat(parent.textArea.style.width) > parent.img.destLeft +
            parent.img.destWidth) {this.alignTextAreaIntoCanvas(); }
        }
        // Limit text area
        if (actObj.rotatedAngle !== 0) {
            let tempLeft: number = parseFloat(parent.textArea.style.left); let tempTop: number = parseFloat(parent.textArea.style.top);
            if (actObj.flipObjColl.length > 0) {
                const panObj: Object = {panRegion: '' };
                const { clientWidth, clientHeight } = parent.lowerCanvas;
                let center: Point = {x: 0, y: 0};
                parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false,
                    value: {panObj: panObj }});
                if (panObj['panRegion'] !== '') {
                    if (panObj['panRegion'] === 'horizontal') {
                        center.x = clientWidth - (clientWidth / 2);
                        tempLeft = (center.x - tempLeft) + center.x;
                    } else if (panObj['panRegion'] === 'vertical') {
                        center.y = clientHeight - (clientHeight / 2);
                        tempTop = (center.y - tempTop) + center.y;
                    } else {
                        center = {x: clientWidth - (clientWidth / 2), y: clientHeight - (clientHeight / 2)};
                        tempLeft = (center.x - tempLeft) + center.x;
                        tempTop = (center.y - tempTop) + center.y;
                    }
                }
            }
            let left: number = tempLeft + parseFloat(parent.textArea.style.width);
            const top: number = tempTop + parseFloat(parent.textArea.style.height);
            let width1: number = parseFloat(parent.textArea.style.width);
            const height1: number = parseFloat(parent.textArea.style.height);
            let center: Point = {x: left - (width1 / 2), y: top - (height1 / 2)};
            const cosAngle: number = Math.cos(actObj.rotatedAngle);
            const sinAngle: number = Math.sin(actObj.rotatedAngle);
            let p1: Point = { x: cosAngle * (left - center.x) - sinAngle * (top - center.y) + center.x,
                y: sinAngle * (left - center.x) + cosAngle * (top - center.y) + center.y };
            if (p1.x > parent.img.destLeft && p1.x < parent.img.destLeft + parent.img.destWidth &&
                p1.y > parent.img.destTop && p1.y + parseFloat(parent.textArea.style.fontSize) < parent.img.destTop + parent.img.destHeight) {
                parent.textArea.style.width = parent.textArea.style.width;
            } else {
                let count: number = 0;
                const width2: number = parseFloat(parent.textArea.style.width);
                while (true) {
                    count++;
                    width1 -= 1;
                    left = tempLeft + width1;
                    center = {x: left - (width1 / 2), y: top - (height1 / 2)};
                    p1 = { x: cosAngle * (left - center.x) - sinAngle * (top - center.y) + center.x,
                        y: sinAngle * (left - center.x) + cosAngle * (top - center.y) + center.y };
                    if ((p1.x > parent.img.destLeft && p1.x < parent.img.destLeft + parent.img.destWidth &&
                        p1.y > parent.img.destTop && p1.y + parseFloat(parent.textArea.style.fontSize) < parent.img.destTop + parent.img.destHeight) ||
                        count === width2) {
                        parent.textArea.style.width = width1 + 'px';
                        break;
                    }
                }
            }
        }
        parent.notify('selection', { prop: 'clearUpperCanvas', onPropertyChange: false});
    }

    private setTextBoxWidth(e?: KeyboardEvent): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.rotatedAngle !== 0) {
            parent.textArea.style.whiteSpace = 'nowrap';
            parent.textArea.style.textOverflow = 'ellipsis';
            parent.textArea.style.display = 'inline-block';
            return;
        } else {
            parent.textArea.style.whiteSpace = '';
            parent.textArea.style.textOverflow = '';
            if (parent.textArea.style.display === 'inline-block') {
                parent.textArea.style.display = 'block';
            }
        }
        const text: string = this.getMaxText(true);
        if (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') {this.updateFontStyles(true); }
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
            } else {
                textAreaTop = parseFloat(parent.textArea.style.top) - parent.img.destTop;
                parent.textArea.style.maxHeight = (parent.img.destHeight - textAreaTop) + 'px';
            }
            break;
        case 90:
            if (flip.toLowerCase() === 'horizontal') {
                parent.textArea.style.maxHeight = (parent.img.destWidth - (parseFloat(parent.textArea.style.left) -
                parent.img.destLeft)) + 'px';
            } else {
                parent.textArea.style.maxHeight = (parseFloat(parent.textArea.style.left) - parent.img.destLeft) + 'px';
            }
            break;
        case 180:
            if (flip.toLowerCase() === 'vertical') {
                textAreaTop = parseFloat(parent.textArea.style.top) - parent.img.destTop;
                parent.textArea.style.maxHeight = (parent.img.destHeight - textAreaTop) + 'px';
            } else {
                parent.textArea.style.maxHeight = (parseFloat(parent.textArea.style.top) - parent.img.destTop) + 'px';
            }
            break;
        case 270:
            if (flip.toLowerCase() === 'horizontal') {
                parent.textArea.style.maxHeight = (parseFloat(parent.textArea.style.left) - parent.img.destLeft) + 'px';
            } else {
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

    private stopPathDrawing(e: MouseEvent & TouchEvent, isApply: boolean): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.shape === 'path') {
            const obj: Object = {shape: null };
            parent.notify('selection', { prop: 'getCurrentDrawingShape', value: {obj: obj }});
            if (obj['shape'] === 'path') {
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
                parent.notify('selection', { prop: 'setCurrentDrawingShape', value: {value: '' }});
                parent.currObjType.isDragging = false;
                if (e && e.type !== 'touchstart' && isNullOrUndefined(isApply)) {parent.activeObj.pointColl.pop(); }
                this.updatePathRatio(parent.activeObj);
                if (isNullOrUndefined(parent.activeObj.imageRatio)) {
                    parent.notify('shape', { prop: 'updImgRatioForActObj', onPropertyChange: false});
                }
                parent.objColl.push(parent.activeObj);
                parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                    value: {operation: 'shapeTransform', previousObj: prevObj, previousObjColl: prevObj.objColl,
                        previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                        previousCropObj: prevCropObj, previousText: null,
                        currentText: null, previousFilter: null, isCircleCrop: null}});
                parent.objColl.pop();
                if (e) {
                    parent.notify('selection', { prop: 'mouseUpEventHandler', value: {e: e }});
                    this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
                    parent.notify('draw', { prop: 'redrawImgWithObj', onPropertyChange: false});
                }
                parent.notify('draw', { prop: 'setNewPath', value: {bool: true }});
                if (parent.objColl[parent.objColl.length - 1]) {
                    parent.selectShape(parent.objColl[parent.objColl.length - 1].currIndex);
                }
                if (!isBlazor()) {
                    parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: null} });
                } else {
                    parent.updateToolbar(parent.element, 'quickAccessToolbar', parent.activeObj.shape);
                }
                const obj: Object = {shapeSettingsObj: {} as ShapeSettings };
                parent.notify('selection', { prop: 'updatePrevShapeSettings', onPropertyChange: false, value: {obj: obj}});
                const shapeSettings: ShapeSettings = obj['shapeSettingsObj'];
                const shapeResizingArgs: ShapeChangeEventArgs = {cancel: false, action: 'draw-end',  previousShapeSettings: shapeSettings};
                const shapeMovingArgs: ShapeChangeEventArgs = {cancel: false, action: 'move', previousShapeSettings: shapeSettings};
                parent.notify('selection', { prop: 'triggerShapeChange', onPropertyChange: false,
                    value: {shapeResizingArgs: shapeResizingArgs, shapeMovingArgs: shapeMovingArgs, type: 'mouse-up'}});
            }
        }
    }

    private findTextTarget(e: MouseEvent & TouchEvent): void {
        const parent: ImageEditor = this.parent;
        if (parent.activeObj.shape !== 'text') {
            if (parent.activeObj.shape === 'path') {
                this.stopPathDrawing(e, null);
                return;
            } else if (e.type === 'dblclick') {
                const activeObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                const objColl: SelectionPoint[] = extend([], parent.objColl, [], true) as SelectionPoint[];
                const obj: Object = {bool: null };
                parent.notify('selection', { prop: 'findTargetObj', onPropertyChange: false,
                    value: {x: e.clientX, y: e.clientY, isCrop: false, obj: obj }});
                parent.objColl = objColl;
                if (!obj['bool'] || parent.activeObj.shape !== 'text') {
                    parent.activeObj = extend({}, activeObj, {}, true) as SelectionPoint;
                    return;
                }
            } else {
                return;
            }
        }
        let x: number; let y: number;
        if (e.type === 'dblclick') {x = e.clientX; y = e.clientY; }
        else if (e.type === 'touchstart') {
            x = e.touches[0].clientX; y = e.touches[0].clientY;
            parent.notify('selection', { prop: 'setTouchEndPoint', onPropertyChange: false,
                value: {x: e.touches[0].clientX, y: e.touches[0].clientY}});
        }
        if (!isBlazor()) {
            parent.notify('toolbar', { prop: 'setPreventZoomBtn', onPropertyChange: false, value: {isPrevent: true }});
            parent.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: {type: 'text',
                isApplyBtn: null, isCropping: null, isZooming: null, cType: null}});
            parent.notify('toolbar', { prop: 'setPreventZoomBtn', onPropertyChange: false, value: {isPrevent: false }});
            parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
        } else {
            parent.updateToolbar(parent.element, 'enableDisableToolbarBtn', 'textAreaClicked');
        }
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
            const bbox: DOMRect = parent.lowerCanvas.getBoundingClientRect() as DOMRect;
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
                this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                this.lowerContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
                parent.notify('draw', { prop: 'redrawImgWithObj', onPropertyChange: false});
                parent.notify('draw', { prop: 'redrawDownScale' });
                parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
                parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
                if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
                    parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                        value: {context: this.lowerContext, isSave: null, isFlip: null}});
                }
                parent.activeObj = temp; this.updateFontStyles();
                const actObj: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
                const radius: number = actObj.topLeftCircle.radius;
                const { startX, startY, endX, endY, width, height } = actObj.activePoint;
                const center: Point = {x: startX + (width / 2), y: startY +
                    (height / 2)};
                const cosAngle: number = Math.cos(actObj.rotatedAngle);
                const sinAngle: number = Math.sin(actObj.rotatedAngle);
                const p1: Point = { x: cosAngle * (startX - center.x) - sinAngle * (startY - center.y) + center.x,
                    y: sinAngle * (startX - center.x) + cosAngle * (startY - center.y) + center.y };
                const p2: Point = { x: cosAngle * (endX - center.x) - sinAngle * (startY - center.y) + center.x,
                    y: sinAngle * (endX - center.x) + cosAngle * (startY - center.y) + center.y };
                const p3: Point = { x: cosAngle * (startX - center.x) - sinAngle * (endY - center.y) + center.x,
                    y: sinAngle * (startX - center.x) + cosAngle * (endY - center.y) + center.y };
                const p4: Point = { x: cosAngle * (endX - center.x) - sinAngle * (endY - center.y) + center.x,
                    y: sinAngle * (endX - center.x) + cosAngle * (endY - center.y) + center.y };
                const obj: Object = {position: null, x: x, y: y, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
                    x3: p3.x, y3: p3.y, x4: p4.x, y4: p4.y };
                parent.notify('draw', { prop: 'checkPointPosition', onPropertyChange: false, value: {obj: obj }});
                if ((actObj.rotatedAngle !== 0 && (obj['position'] === 'inside' || obj['position'] === 'on')) ||
                    (actObj.rotatedAngle === 0 && x >= (actObj.activePoint.startX - (radius * 2)) &&
                    x <= (actObj.activePoint.endX + (radius * 2)) &&
                    y >= (actObj.activePoint.startY - (radius * 2)) &&
                    y <= (actObj.activePoint.endY + (radius * 2)))) {
                    this.upperContext.clearRect(0, 0, parent.upperCanvas.width, parent.upperCanvas.height);
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
                        let point: Point = this.getTextBoxPosition(parent.activeObj);
                        x = point.x; y = point.y;
                        point = this.setFlipState(x, y, parent.activeObj);
                        x = point.x; y = point.y;
                    }
                    this.renderTextArea(x, y, actObj);

                } else {this.applyActObj(); }
            }
        } else if ((parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block')
            && this.selectedText() !== '' && e.type === 'mousedown') {
            const temp: string = parent.textArea.value; parent.textArea.value += 'a'; parent.textArea.value = temp;
        } else if (parent.textArea.style.display === 'none') {
            parent.textArea.style.display = 'block';
        }
    }

    private getTextBoxPosition(obj: SelectionPoint, object?: Object): Point {
        let point: Point = {x: 0, y: 0 };
        const { startX, startY, endX, endY, width, height } = obj.activePoint;
        const center: Point = {x: startX + (width / 2), y: startY + (height / 2)};
        const cosAngle: number = Math.cos(obj.rotatedAngle);
        const sinAngle: number = Math.sin(obj.rotatedAngle);
        const p1: Point = { x: cosAngle * (startX - center.x) - sinAngle * (startY - center.y) + center.x,
            y: sinAngle * (startX - center.x) + cosAngle * (startY - center.y) + center.y };
        const p2: Point = { x: cosAngle * (endX - center.x) - sinAngle * (startY - center.y) + center.x,
            y: sinAngle * (endX - center.x) + cosAngle * (startY - center.y) + center.y };
        const p3: Point = { x: cosAngle * (startX - center.x) - sinAngle * (endY - center.y) + center.x,
            y: sinAngle * (startX - center.x) + cosAngle * (endY - center.y) + center.y };
        const p4: Point = { x: cosAngle * (endX - center.x) - sinAngle * (endY - center.y) + center.x,
            y: sinAngle * (endX - center.x) + cosAngle * (endY - center.y) + center.y };
        const degree: number = this.getRotDegOfShape(obj);
        if (degree === 0 || degree === 360) {point = {x: p1.x, y: p1.y}; }
        else if (degree === 90 || degree === -270) {point = {x: p2.x, y: p2.y}; }
        else if (degree === 180 || degree === -180) {point = {x: p4.x, y: p4.y}; }
        else if (degree === 270 || degree === -90) {point = {x: p3.x, y: p3.y}; }
        if (object) {object['x'] = point.x; object['y'] = point.y; }
        return point;
    }

    private setFlipState(x: number, y: number, obj: SelectionPoint, object?: Object): Point {
        const parent: ImageEditor = this.parent; const panObj: Object = {panRegion: '' };
        const { clientWidth, clientHeight } = parent.lowerCanvas;
        let center: Point = {x: 0, y: 0};
        parent.notify('crop', { prop: 'getCurrFlipState', onPropertyChange: false,
            value: {panObj: panObj }});
        if (panObj['panRegion'] !== '') {
            if (panObj['panRegion'] === 'horizontal') {
                center.x = clientWidth - (clientWidth / 2);
                x = (center.x - x) + center.x;
            } else if (panObj['panRegion'] === 'vertical') {
                center.y = clientHeight - (clientHeight / 2);
                y = (center.y - y) + center.y;
            } else {
                center = {x: clientWidth - (clientWidth / 2), y: clientHeight - (clientHeight / 2)};
                x = (center.x - x) + center.x;
                y = (center.y - y) + center.y;
            }
        }
        if (object) {object['x'] = x; object['y'] = y; }
        return {x: x, y: y};
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private fileChanged(e: any): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const filesData: FileList = (e.target as any).files[0];
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const fileData: any = filesData;
        const fileExtension: string = fileData.name && fileData.name.split('.')[1].toLowerCase();
        if (fileExtension && ['jpg', 'jpeg', 'png', 'svg'].indexOf(fileExtension) === -1) {
            this.refreshActiveObj();
            return;
        }
        // eslint-disable-next-line @typescript-eslint/tslint/config, @typescript-eslint/no-explicit-any
        const URL = window.URL; const url = URL.createObjectURL((e.target as any).files[0]);
        this.onLoadImgShape(null, null, null, null, url.toString(), true);
        if (!isBlazor()) {
            (document.getElementById(this.parent.element.id + '_fileUpload') as HTMLInputElement).value = '';
        }
    }

    private onLoadImgShape(x: number, y: number, width: number, height: number, url: string | ImageData,
                           isSelect?: boolean, degree?: number, isAspectRatio?: boolean, opacity?: number): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: Shape = this; const parent: ImageEditor = this.parent;
        if (typeof(url) === 'string') {this.shapeImg.src = url; }
        else {
            parent.inMemoryCanvas.width = (url as ImageData).width;
            parent.inMemoryCanvas.height = (url as ImageData).height;
            parent.inMemoryCanvas.getContext('2d').putImageData((url as ImageData), 0, 0);
            this.shapeImg.src = parent.inMemoryCanvas.toDataURL();
        }
        this.prevObjColl();
        parent.activeObj.shape = 'image';
        this.initShapeProps();
        this.shapeImg.onload = () => {
            proxy.upperContext.drawImage(proxy.shapeImg, 0, 0, proxy.shapeImg.width, proxy.shapeImg.height);
            proxy.updateImgCanvas(isSelect, x, y, width, height, degree, isAspectRatio, opacity);
        };
    }

    private updateImgCanvas(isSelect: boolean, x: number, y: number, width: number, height: number, degree: number,
                            isAspectRatio: boolean, opacity: number): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.imageElement = this.shapeImg;
        parent.activeObj.imageCanvas = parent.createElement('canvas');
        let dimObj: Object = {width: 0, height: 0 };
        parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: this.shapeImg.width, height: this.shapeImg.height, obj: dimObj, isImgShape: null }});
        if (width && height) {
            if (isAspectRatio) {
                const obj: Object = {ratio: null };
                parent.notify('selection', { prop: 'findImageRatio', onPropertyChange: false,
                    value: {width: this.shapeImg.width, height: this.shapeImg.height, obj: obj }});
                dimObj = this.resizeImage(width, obj['ratio']);
            } else {
                dimObj = {width: width, height: height };
            }
        }
        this.updateObj(dimObj, x, y);
        parent.notify('draw', { prop: 'downScaleImgCanvas', onPropertyChange: false,
            value: {ctx: parent.activeObj.imageCanvas.getContext('2d'), isImgAnnotation: true, isHFlip: null, isVFlip: null }});
        parent.notify('transform', { prop: 'calcMaxDimension', onPropertyChange: false,
            value: {width: this.shapeImg.width, height: this.shapeImg.height, obj: dimObj, isImgShape: true }});
        if (width && height) {
            if (isAspectRatio) {
                const obj: Object = {ratio: null };
                parent.notify('selection', { prop: 'findImageRatio', onPropertyChange: false,
                    value: {width: this.shapeImg.width, height: this.shapeImg.height, obj: obj }});
                dimObj = this.resizeImage(width, obj['ratio']);
            } else {
                dimObj = {width: width, height: height };
            }
        }
        if (opacity !== null && opacity !== undefined) {parent.activeObj.opacity = opacity; }
        this.updateObj(dimObj, x, y);
        parent.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate' }});
        this.shapeImg = null;
        if (degree) {
            parent.activeObj.rotatedAngle = degree * (Math.PI / 180);
            parent.notify('selection', {prop: 'updPtCollForShpRot', onPropertyChange: false, value: {obj: parent.activeObj }});
        }
        const obj: Object = {shapeSettingsObj: {} as ShapeSettings };
        parent.notify('selection', { prop: 'updatePrevShapeSettings', onPropertyChange: false, value: {obj: obj}});
        const shapeSettings: ShapeSettings = obj['shapeSettingsObj'];
        const shapeChangingArgs: ShapeChangeEventArgs = {cancel: false, action: 'insert', previousShapeSettings: shapeSettings,
            currentShapeSettings: shapeSettings};
        if (isBlazor() && parent.events && parent.events.shapeChanging.hasDelegate === true) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (parent.dotNetRef.invokeMethodAsync('ShapeEventAsync', 'OnShape', shapeChangingArgs, null) as any).then((shapeChangingArgs: ShapeChangeEventArgs) => {
                this.drawShapeImageEvent(shapeChangingArgs, isSelect);
                if (parent.isPublicMethod) {
                    parent.notify('undo-redo', {prop: 'updateUndoRedo', onPropertyChange: false});
                }
                parent.isPublicMethod = false;
            });
        } else {
            parent.trigger('shapeChanging', shapeChangingArgs);
            this.drawShapeImageEvent(shapeChangingArgs, isSelect);
            if (parent.isPublicMethod) {
                parent.notify('undo-redo', {prop: 'updateUndoRedo', onPropertyChange: false});
            }
            parent.isPublicMethod = false;
        }
    }

    private updateObj(dimObj: Object, x: number, y: number): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj.activePoint.width = dimObj['width'];
        parent.activeObj.activePoint.height = dimObj['height'];
        parent.activeObj.activePoint.startX = x ? x : (parent.lowerCanvas.width / 2) - (dimObj['width'] / 2);
        parent.activeObj.activePoint.startY = y ? y : (parent.lowerCanvas.height / 2) - (dimObj['height'] / 2);
        parent.activeObj.activePoint.endX = parent.activeObj.activePoint.startX + dimObj['width'];
        parent.activeObj.activePoint.endY = parent.activeObj.activePoint.startY + dimObj['height'];
    }

    private resizeImage(newWidth: number, aspectRatio: string): Object {
        const aspectRatioArray: string[] = aspectRatio.split(':');
        const aspectRatioWidth: number = parseInt(aspectRatioArray[0], 10);
        const aspectRatioHeight: number = parseInt(aspectRatioArray[1], 10);
        const newHeight: number = Math.round((newWidth * aspectRatioHeight) / aspectRatioWidth);
        return { width: newWidth, height: newHeight };
    }

    private setTextBoxPos(actObj: SelectionPoint, degree: number, flip: string, x: number, y: number): Point {
        const point: Point = {x: x, y: y};
        const { startX, startY, endX, endY } = actObj.activePoint;
        flip = flip.toLowerCase();
        switch (degree) {
        case 0:
            if (flip === 'horizontal') {
                point.x = endX; point.y = startY;
            } else if (flip === 'vertical') {
                point.x = startX; point.y = endY;
            } else {
                point.x = startX; point.y = startY;
            }
            break;
        case 90:
            if (flip === 'horizontal') {
                point.x = startX; point.y = startY;
            } else if (flip === 'vertical') {
                point.x = endX; point.y = endY;
            } else {
                point.x = endX; point.y = startY;
            }
            break;
        case 180:
            if (flip === 'horizontal') {
                point.x = startX; point.y = endY;
            } else if (flip === 'vertical') {
                point.x = endX; point.y = startY;
            } else {
                point.x = endX; point.y = endY;
            }
            break;
        case 270:
            if (flip === 'horizontal') {
                point.x = endX; point.y = endY;
            } else if (flip === 'vertical') {
                point.x = startX; point.y = startY;
            } else {
                point.x = startX; point.y = endY;
            }
            break;
        }
        return point;
    }

    private setTextBoxPoints(actObj: SelectionPoint, degree: number, flip: string, x: number, y: number): Point {
        const point: Point = {x: x, y: y};
        const { startX, startY, endX, endY } = actObj.activePoint;
        flip = flip.toLowerCase();
        switch (degree) {
        case 0:
            if (actObj.flipObjColl[0] && actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip === 'horizontal') {
                    point.x = startX; point.y = startY;
                } else if (flip === 'vertical') {
                    point.x = endX; point.y = endY;
                }
            } else {
                if (flip === 'horizontal') {
                    point.x = endX; point.y = endY;
                } else if (flip === 'vertical') {
                    point.x = endX; point.y = startY;
                }
            }
            break;
        case 90:
            if (actObj.flipObjColl[0] && actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip === 'horizontal') {
                    point.x = endX; point.y = endY;
                } else if (flip === 'vertical') {
                    point.x = startX; point.y = endY;
                }
            } else {
                if (flip === 'horizontal') {
                    point.x = startX; point.y = endY;
                } else if (flip === 'vertical') {
                    point.x = startX; point.y = startY;
                }
            }
            break;
        case 180:
            if (actObj.flipObjColl[0] && actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip === 'horizontal') {
                    point.x = startX; point.y = startY;
                } else if (flip === 'vertical') {
                    point.x = startX; point.y = startY;
                }
            } else {
                if (flip === 'horizontal') {
                    point.x = startX; point.y = startY;
                } else if (flip === 'vertical') {
                    point.x = startX; point.y = endY;
                }
            }
            break;
        case 270:
            if (actObj.flipObjColl[0] && actObj.flipObjColl[0].toLowerCase() === 'horizontal') {
                if (flip === 'horizontal') {
                    point.x = startX; point.y = startY;
                } else if (flip === 'vertical') {
                    point.x = endX; point.y = startY;
                }
            } else {
                if (flip === 'horizontal') {
                    point.x = endX; point.y = startY;
                } else if (flip === 'vertical') {
                    point.x = endX; point.y = endY;
                }
            }
            break;
        }
        return point;
    }

    private selectedText(): string {
        const parent: ImageEditor = this.parent;
        const start: number = parent.textArea.selectionStart;
        const finish: number = parent.textArea.selectionEnd;
        return parent.textArea.value.substring(start, finish);
    }

    private panObjColl(xDiff: number, yDiff: number, panRegion: string): void {
        const parent: ImageEditor = this.parent;
        if (parent.objColl.length > 0) {
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
            parent.notify('draw', {prop: 'applyFrame', value: {ctx: this.lowerContext, frame: parent.frameObj.type, preventImg: true}});
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
        const fontFamily: string = (parent.textArea.style.display === 'block' || parent.textArea.style.display === 'inline-block') ?
            parent.textArea.style.fontFamily : parent.activeObj.textSettings.fontFamily;
        this.upperContext.font = textStyle + fontSize + 'px' + ' ' + fontFamily;
    }

    private applyFontStyle(item: string): void {
        const parent: ImageEditor = this.parent;
        const obj: Object = {shapeSettingsObj: {} as ShapeSettings };
        parent.notify('selection', { prop: 'updatePrevShapeSettings', onPropertyChange: false, value: {obj: obj}});
        const shapeSettings: ShapeSettings = obj['shapeSettingsObj'];
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
        const shapeChangedArgs: ShapeChangeEventArgs = {action: 'font-style', currentShapeSettings: extend({}, shapeSettings, {}, true) as ShapeSettings};
        shapeChangedArgs.currentShapeSettings.fontStyle = [item];
        parent.triggerShapeChanged(shapeChangedArgs);
    }

    private updateFontStyle(item: string, objColl: SelectionPoint[], fontWeight: string, fontStyle: string): void {
        const parent: ImageEditor = this.parent;
        const style: CSSStyleDeclaration = parent.textArea.style;
        if (style.display === 'block' || style.display === 'inline-block') {
            if (style.fontWeight === 'normal' && fontWeight === 'bold') {style.fontWeight = 'bold'; }
            else if (style.fontWeight === 'bold' && fontWeight === 'bold') {style.fontWeight = 'normal'; }
            if (style.fontStyle === 'normal' && fontStyle === 'italic') {style.fontStyle = 'italic'; }
            else if (style.fontStyle === 'italic' && fontStyle === 'italic') {style.fontStyle = 'normal'; }
            const value: string = (style.fontWeight === 'normal' && style.fontStyle === 'normal' ? 'default' :
                (style.fontWeight === 'bold' && style.fontStyle === 'normal' ? 'bold' :
                (style.fontWeight === 'normal' && style.fontStyle === 'italic' ? 'italic' : 'bolditalic')));
            const width: number = this.getTextAreaWidth(value); style.width = width + 'px';
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
        let length: number;
        if (Math.abs(obj.activePoint.width) > Math.abs(obj.activePoint.height)) {length =  Math.abs(obj.activePoint.width); }
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
        let length: number;
        if (Math.abs(obj.activePoint.width) > Math.abs(obj.activePoint.height)) {length =  Math.abs(obj.activePoint.width); }
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
        const parent: ImageEditor = this.parent;
        if (parent.textArea.style.display === 'none') {
            parent.objColl.push(parent.activeObj);
        } else {
            const temp: SelectionPoint = extend({}, parent.activeObj, {}, true) as SelectionPoint;
            parent.notify('selection', { prop: 'setTextBoxStylesToActObj', onPropertyChange: false });
            parent.objColl.push(parent.activeObj); parent.activeObj = temp;
        }
    }

    private clearActObj(): void {
        const parent: ImageEditor = this.parent;
        if (parent.textArea.style.display === 'none') {
            this.refreshActiveObj(); this.applyActObj();
            this.refreshActiveObj(); parent.currObjType.isCustomCrop = false;
        }
    }

    private refreshActiveObj(): void {
        const parent: ImageEditor = this.parent;
        parent.activeObj = {} as SelectionPoint;
        parent.activeObj.activePoint = {startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0};
        parent.activeObj.triangle = []; parent.activeObj.triangleRatio = [];
        parent.activeObj.flipObjColl = []; parent.activeObj.strokeSettings = this.strokeSettings;
        parent.activeObj.textSettings = this.textSettings; parent.activeObj.rotatedAngle = 0;
        parent.activeObj.opacity = 1;
    }

    private applyActObj(isMouseDown?: boolean): void {
        const parent: ImageEditor = this.parent;
        let isActObj: boolean = false;
        if (parent.activeObj.shape !== undefined && parent.activeObj.shape === 'text' && parent.activeObj.keyHistory === '') {
            this.refreshActiveObj();
            this.upperContext.clearRect(0, 0 , parent.upperCanvas.width, parent.upperCanvas.height);
        } else {
            let splitWords: string[]; let isCropSelection: boolean = false;
            if (parent.activeObj.shape !== undefined) {splitWords = parent.activeObj.shape.split('-'); }
            if (splitWords === undefined && parent.currObjType.isCustomCrop) {isCropSelection = true; }
            else if (splitWords !== undefined && splitWords[0] === 'crop') {isCropSelection = true; }
            if (parent.activeObj.shape && !isCropSelection && parent.activeObj.shape !== 'shape') {
                for (let i: number = 0; i < parent.objColl.length; i++) {
                    if (JSON.stringify(parent.activeObj) === JSON.stringify(parent.objColl[i as number])) {
                        isActObj = true;
                        break;
                    }
                }
                if (!isActObj) {
                    if (isNullOrUndefined(parent.activeObj.currIndex)) {
                        parent.activeObj.currIndex = this.getNewShapeId();
                    }
                    this.updImgRatioForActObj();
                    const splitWords: string[] = parent.activeObj.currIndex.split('_');
                    let tempObjColl: SelectionPoint[] = parent.objColl.splice(0, parseInt(splitWords[1], 10) - 1);
                    tempObjColl.push(extend({}, parent.activeObj, {}, true) as SelectionPoint);
                    for (let i: number = 0; i < parent.objColl.length; i++) {
                        tempObjColl.push(parent.objColl[i as number]);
                    }
                    parent.objColl = tempObjColl;
                    tempObjColl = []; this.refreshActiveObj();
                    this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
                    parent.notify('draw', { prop: 'redrawImgWithObj', onPropertyChange: false});
                    parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
                    parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.upperContext}});
                    parent.currObjType.shape = ''; this.refreshActiveObj();
                    if (parent.isCircleCrop) {
                        parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                            value: {context: this.lowerContext, isSave: null, isFlip: null}});
                    }
                    if (!isBlazor()) {parent.notify('toolbar', { prop: 'destroy-qa-toolbar', onPropertyChange: false}); }
                    else {parent.updateToolbar(parent.element, 'destroyQuickAccessToolbar'); }
                    if (isNullOrUndefined(isMouseDown)) {
                        parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
                        parent.notify('draw', { prop: 'setPrevActObj', onPropertyChange: false, value: { prevActObj: null }});
                    }
                }
            }
        }
    }

    private getNewShapeId(): string {
        const parent: ImageEditor = this.parent;
        let value: number = parent.objColl.length + 1;
        for (let i: number = 0; i < parent.objColl.length; i++) {
            if (parent.objColl[i as number].currIndex === 'shape_' + value) {
                value++; i = -1;
            }
        }
        return 'shape_' + value;
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
        const isTextArea: boolean = parent.textArea.style.display === 'none' ? false : true;
        this.updateFontStyles(isTextArea); let width: number;
        if (!isTextArea) {
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
            shapeDetails.degree = obj.rotatedAngle * (180 / Math.PI);
            break;
        case 'ellipse':
            shapeDetails.radius = obj.activePoint.width / 2;
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.fillColor = obj.strokeSettings.fillColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
            shapeDetails.radiusX = obj.activePoint.width / 2;
            shapeDetails.radiusY = obj.activePoint.height / 2;
            shapeDetails.degree = obj.rotatedAngle * (180 / Math.PI);
            break;
        case 'line':
        case 'arrow':
            shapeDetails.length = obj.activePoint.width;
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
            shapeDetails.endX = obj.activePoint.endX;
            shapeDetails.endY = obj.activePoint.endY;
            if (obj.shape === 'arrow') {
                const arrowObj: Object = {type: null };
                parent.notify('selection', {prop: 'getArrowType', onPropertyChange: false, value: {type: obj.start, obj: arrowObj}});
                shapeDetails.arrowHead = arrowObj['type'];
                parent.notify('selection', {prop: 'getArrowType', onPropertyChange: false, value: {type: obj.end, obj: arrowObj}});
                shapeDetails.arrowTail = arrowObj['type'];
            }
            break;
        case 'text':
            shapeDetails.text = obj.keyHistory;
            shapeDetails.fontSize = obj.textSettings.fontSize;
            shapeDetails.fontFamily = obj.textSettings.fontFamily;
            shapeDetails.color = obj.strokeSettings.strokeColor;
            shapeDetails.fontStyle = [];
            if (obj.textSettings.bold) {shapeDetails.fontStyle.push('bold'); }
            if (obj.textSettings.italic) {shapeDetails.fontStyle.push('italic'); }
            shapeDetails.degree = obj.rotatedAngle * (180 / Math.PI);
            break;
        case 'path':
            shapeDetails.strokeColor = obj.strokeSettings.strokeColor;
            shapeDetails.strokeWidth = obj.strokeSettings.strokeWidth;
            shapeDetails.points = obj.pointColl;
            break;
        case 'image':
            shapeDetails.imageData = obj.imageCanvas.toDataURL();
            shapeDetails.degree = obj.rotatedAngle * (180 / Math.PI);
            shapeDetails.width = obj.activePoint.width;
            shapeDetails.height = obj.activePoint.height;
            shapeDetails.opacity = obj.opacity;
            break;
        case 'image':
            shapeDetails.imageData = obj.imageCanvas.toDataURL();
            shapeDetails.degree = obj.rotatedAngle * (180 / Math.PI);
            shapeDetails.width = obj.activePoint.width;
            shapeDetails.height = obj.activePoint.height;
            shapeDetails.opacity = obj.opacity;
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
        let inRange: boolean = false; const parent: ImageEditor = this.parent;
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y) && x >= parent.img.destLeft && y >= parent.img.destTop &&
            x <= parent.img.destLeft + parent.img.destWidth && y <= parent.img.destTop + parent.img.destHeight) {
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
        for (let i: number = 0, iLen: number = collection.length - 3; i < iLen; i++) {
            const isHorizontal: boolean = collection[i as number] === 'horizontal' || collection[i as number] === 'Horizontal'
            || collection[i as number] === 'horizontalFlip';
            const isVertical: boolean = collection[i as number] === 'vertical' || collection[i as number] === 'Vertical' ||
            collection[i as number] === 'verticalFlip';
            const isNextHorizontal: boolean = collection[i + 1] === 'horizontal' || collection[i + 1] === 'Horizontal' ||
            collection[i + 1] === 'horizontalFlip';
            const isNextVertical: boolean = collection[i + 1] === 'vertical' || collection[i + 1] === 'Vertical' ||
            collection[i + 1] === 'verticalFlip';
            const isNextToNextHorizontal: boolean = collection[i + 2] === 'horizontal' || collection[i + 2] === 'Horizontal' ||
            collection[i + 2] === 'horizontalFlip';
            const isNextToNextVertical: boolean = collection[i + 2] === 'vertical' || collection[i + 2] === 'Vertical' ||
            collection[i + 2] === 'verticalFlip';
            const isNextToNextToNextHorizontal: boolean = collection[i + 3] === 'horizontal' || collection[i + 3] === 'Horizontal' ||
            collection[i + 3] === 'horizontalFlip';
            if ((isHorizontal && isNextVertical && isNextToNextHorizontal && isNextToNextVertical) ||
                (isVertical && isNextHorizontal && isNextToNextVertical && isNextToNextToNextHorizontal)) {
                collection.splice(i, 4);
                i -= 4;
            }
        }
        return collection;
    }

    private popForDefaultRotateState(collection: number[] | string[]): number[] | string[] {
        for (let i: number = 0; i < collection.length - 1; i++) {
            const curr: number | string = collection[i as number];
            const next: number | string = collection[i + 1];
            if ((curr === 90 || curr === 'rotateRight') && (next === -90 || next === 'rotateLeft')) {
                collection.splice(i, 2);
                i -= 2;
            } else if ((curr === -90 || curr === 'rotateLeft') && (next === 90 || next === 'rotateRight')) {
                collection.splice(i, 2);
                i -= 2;
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
                            parent.updateToolbar(parent.element, 'path', 'pathQuickAccessToolbar');
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
                    if (isBlazor()) {
                        parent.updateToolbar(parent.element, 'pen');
                        parent.updateToolbar(parent.element, 'quickAccessToolbar', 'pen');
                    } else {
                        parent.notify('toolbar', { prop: 'renderQAT', onPropertyChange: false, value: {isPenEdit: true} });
                        parent.notify('toolbar', { prop: 'update-toolbar-items', onPropertyChange: false});
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
        const parent: ImageEditor = this.parent;
        const { startX, startY, endX, endY, width, height } = obj.activePoint;
        const center: Point = {x: startX + (width / 2), y: startY +
        (height / 2)};
        const cosAngle: number = Math.cos(obj.rotatedAngle);
        const sinAngle: number = Math.sin(obj.rotatedAngle);
        const p1: Point = { x: cosAngle * (startX - center.x) - sinAngle * (startY - center.y) + center.x,
            y: sinAngle * (startX - center.x) + cosAngle * (startY - center.y) + center.y };
        const p2: Point = { x: cosAngle * (endX - center.x) - sinAngle * (startY - center.y) + center.x,
            y: sinAngle * (endX - center.x) + cosAngle * (startY - center.y) + center.y };
        const p3: Point = { x: cosAngle * (startX - center.x) - sinAngle * (endY - center.y) + center.x,
            y: sinAngle * (startX - center.x) + cosAngle * (endY - center.y) + center.y };
        const p4: Point = { x: cosAngle * (endX - center.x) - sinAngle * (endY - center.y) + center.x,
            y: sinAngle * (endX - center.x) + cosAngle * (endY - center.y) + center.y };
        obj.horTopLinePointColl = this.getLinePoints(p1.x, p1.y, p2.x, p2.y);
        obj.horTopLinePointColl = this.getLinePoints(p1.x, p1.y, p2.x, p2.y);
        obj.horBottomLinePointColl = this.getLinePoints(p3.x, p3.y, p4.x, p4.y);
        obj.verLeftLinePointColl = this.getLinePoints(p1.x, p1.y, p3.x, p3.y);
        obj.verRightLinePointColl = this.getLinePoints(p2.x, p2.y, p4.x, p4.y);
        obj.verLeftLinePointColl.reverse(); obj.verRightLinePointColl.reverse();
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
        if (parent.upperCanvas.style.cursor !== 'move') {
            const object: Object = {rotationCirclePoint: null };
            parent.notify('selection', { prop: 'getTransRotationPoint', value: {obj: obj, object: object }});
            const rotationCirclePoint: Point = object['rotationCirclePoint'];
            if (rotationCirclePoint) {
                obj.rotationCirclePointColl = { x: cosAngle * (rotationCirclePoint.x - center.x) -
                    sinAngle * (rotationCirclePoint.y - center.y) + center.x,
                y: sinAngle * (rotationCirclePoint.x - center.x) + cosAngle
                    * (rotationCirclePoint.y - center.y) + center.y };
                obj.rotationCirclePointColl.ratioX = (obj.rotationCirclePointColl.x - parent.img.destLeft) /
                parent.img.destWidth;
                obj.rotationCirclePointColl.ratioY = (obj.rotationCirclePointColl.y - parent.img.destTop) /
                parent.img.destHeight;
            }
        }
    }

    private getSquarePointForRotatedShape(obj: SelectionPoint, object?: Object): ActivePoint {
        const point: ActivePoint = { startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0 };
        const { startX, startY, endX, endY, width, height } = obj.activePoint;
        const center: Point = {x: startX + (width / 2), y: startY + (height / 2)};
        const cosAngle: number = Math.cos(obj.rotatedAngle);
        const sinAngle: number = Math.sin(obj.rotatedAngle);
        const p1: Point = { x: cosAngle * (startX - center.x) - sinAngle * (startY - center.y) + center.x,
            y: sinAngle * (startX - center.x) + cosAngle * (startY - center.y) + center.y };
        const p2: Point = { x: cosAngle * (endX - center.x) - sinAngle * (startY - center.y) + center.x,
            y: sinAngle * (endX - center.x) + cosAngle * (startY - center.y) + center.y };
        const p3: Point = { x: cosAngle * (startX - center.x) - sinAngle * (endY - center.y) + center.x,
            y: sinAngle * (startX - center.x) + cosAngle * (endY - center.y) + center.y };
        const p4: Point = { x: cosAngle * (endX - center.x) - sinAngle * (endY - center.y) + center.x,
            y: sinAngle * (endX - center.x) + cosAngle * (endY - center.y) + center.y };
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
