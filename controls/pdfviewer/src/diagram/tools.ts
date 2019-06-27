import { PointModel, randomId, Point } from '@syncfusion/ej2-drawings';
import { IElement } from '@syncfusion/ej2-drawings';
import { rotatePoint, } from '@syncfusion/ej2-drawings';
import { Rect } from '@syncfusion/ej2-drawings';
import { Matrix, transformPointByMatrix, rotateMatrix, identityMatrix } from '@syncfusion/ej2-drawings';
import { SelectorModel } from './selector-model';
import { TextElement } from '@syncfusion/ej2-drawings';
import { Selector } from './selector';
import { DrawingElement } from '@syncfusion/ej2-drawings';
import { findActiveElement } from './action';
import { PdfViewer, PdfViewerBase, MeasureAnnotation } from '../pdfviewer';
import { PdfAnnotationBaseModel } from './pdf-annotation-model';
import { PdfAnnotationBase } from './pdf-annotation';
import { cloneObject, isLineShapes } from './drawing-util';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { updatePerimeterLabel, removePerimeterLabel } from './connector-util';

/**
 * Defines the interactive tools
 * @hidden
 */
export class ToolBase {
    /**
     * Initializes the tool
     * @param command Command that is corresponding to the current action
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase, protectChange: boolean = false) {
        this.commandHandler = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**   @private  */
    public prevPageId: number;

    /**
     * Command that is corresponding to the current action
     */
    protected commandHandler: PdfViewer = null;

    /**
     * Sets/Gets whether the interaction is being done
     */
    protected inAction: boolean = false;

    /**
     * Sets/Gets the protect change
     */
    protected pdfViewerBase: PdfViewerBase = null;

    /**
     * Sets/Gets the current mouse position
     */
    protected currentPosition: PointModel;

    /**
     * Sets/Gets the previous mouse position
     */
    /**   @private  */
    public prevPosition: PointModel;

    /** 
     * Sets/Gets the initial mouse position
     */
    protected startPosition: PointModel;

    /**
     * Sets/Gets the current element that is under mouse
     */
    /**   @private  */
    public currentElement: IElement = null;

    /**   @private  */
    public blocked: boolean = false;

    protected isTooltipVisible: boolean = false;

    /** @private */
    public childTable: {} = {};
    /** @private */
    public helper: PdfAnnotationBaseModel = undefined;

    /**
     * Sets/Gets the previous object when mouse down
     */
    protected undoElement: SelectorModel = { annotations: [] };

    protected undoParentElement: SelectorModel = { annotations: [] };

    protected startAction(currentElement: IElement): void {
        this.currentElement = currentElement;
        this.inAction = true;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.currentElement = args.source;
        this.startPosition = this.currentPosition = this.prevPosition = args.position;
        this.isTooltipVisible = true;
        this.startAction(args.source);
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        this.currentPosition = args.position;
        //this.currentElement = currentElement;
        this.prevPageId = this.pdfViewerBase.activeElements.activePageID;
        return !this.blocked;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        this.currentPosition = args.position;
        // this.currentElement = currentElement;
        this.isTooltipVisible = false;
        //At the end
        this.endAction();
        this.helper = null;


    }

    protected endAction(): void {
        //remove helper  
        this.commandHandler.tool = '';
        if (this.helper) {
            this.commandHandler.remove(this.helper);
        }
        this.commandHandler = null;
        this.currentElement = null;
        this.currentPosition = null;
        this.inAction = false;
        this.blocked = false;

    }

    /**   @private  */
    public mouseWheel(args: MouseEventArgs): void {
        this.currentPosition = args.position;
    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    protected updateSize(
        shape: SelectorModel | PdfAnnotationBaseModel, startPoint: PointModel,
        endPoint: PointModel, corner: string, initialBounds: Rect, angle?: number): Rect {
        shape = shape;
        let zoom: number = this.commandHandler.viewerBase.getZoomFactor();

        let difx: number = this.currentPosition.x / zoom - this.startPosition.x / zoom;
        let dify: number = this.currentPosition.y / zoom - this.startPosition.y / zoom;
        let rotateAngle: number = (shape instanceof TextElement) ? angle : shape.rotateAngle;
        let matrix: Matrix;
        matrix = identityMatrix();
        rotateMatrix(matrix, -rotateAngle, 0, 0);
        let deltaWidth: number = 0; let deltaHeight: number = 0;
        let diff: PointModel;
        let width: number = (shape instanceof TextElement) ? shape.actualSize.width : shape.wrapper.bounds.width;
        let height: number = (shape instanceof TextElement) ? shape.actualSize.height : shape.wrapper.bounds.height;
        switch (corner) {
            case 'ResizeWest':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                deltaHeight = 1;
                difx = difx;
                dify = 0; deltaWidth = (initialBounds.width - difx) / width; break;
            case 'ResizeEast':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                dify = 0;
                deltaWidth = (initialBounds.width + difx) / width;
                deltaHeight = 1;
                break;
            case 'ResizeNorth':
                deltaWidth = 1;
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;

                deltaHeight = (initialBounds.height - dify) / height; break;
            case 'ResizeSouth':
                deltaWidth = 1;
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                deltaHeight = (initialBounds.height + dify) / height; break;
            case 'ResizeNorthEast':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                deltaWidth = (initialBounds.width + difx) / width; deltaHeight = (initialBounds.height - dify) / height;
                break;
            case 'ResizeNorthWest':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                deltaWidth = (initialBounds.width - difx) / width; deltaHeight = (initialBounds.height - dify) / height;
                break;
            case 'ResizeSouthEast':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                deltaHeight = (initialBounds.height + dify) / height; deltaWidth = (initialBounds.width + difx) / width;
                break;
            case 'ResizeSouthWest':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                deltaWidth = (initialBounds.width - difx) / width; deltaHeight = (initialBounds.height + dify) / height; break;
        }
        return { width: deltaWidth, height: deltaHeight } as Rect;
    }
    protected getPivot(corner: string): PointModel {
        switch (corner) {
            case 'ResizeWest':
                return { x: 1, y: 0.5 };
            case 'ResizeEast':
                return { x: 0, y: 0.5 };
            case 'ResizeNorth':
                return { x: 0.5, y: 1 };
            case 'ResizeSouth':
                return { x: 0.5, y: 0 };
            case 'ResizeNorthEast':
                return { x: 0, y: 1 };
            case 'ResizeNorthWest':
                return { x: 1, y: 1 };
            case 'ResizeSouthEast':
                return { x: 0, y: 0 };
            case 'ResizeSouthWest':
                return { x: 1, y: 0 };
        }
        return { x: 0.5, y: 0.5 };
    }
}

/**
 * Helps to select the objects
 * @hidden
 */
export class SelectTool extends ToolBase {
    private action: Actions;
    constructor(commandHandler: PdfViewer, base: PdfViewerBase) {
        super(commandHandler, base, true);
        //     this.action = action;
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.mouseEventHelper(args);
        super.mouseDown(args);
    }

    private mouseEventHelper(args: MouseEventArgs): void {
        // tslint:disable-next-line
        let object: IElement = findActiveElement(args as any, this.pdfViewerBase, this.commandHandler);
        let selectedObject: SelectorModel = this.commandHandler.selectedItems;
        if ((selectedObject.annotations.length) && args.info && !args.info.ctrlKey) {
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
        }
        if (object) {
            this.commandHandler.select([(object as PdfAnnotationBaseModel).id]);
        }
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        //draw selected region
        return !this.blocked;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        // tslint:disable-next-line
        this.mouseEventHelper(args);
        this.inAction = false;
        super.mouseUp(args);

    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        if (this.inAction) {
            this.mouseUp(args);
        }
    }
}
/** @private */
export type Actions = 'None' | 'Select' | 'Drag' | 'ResizeWest' | 'ConnectorSourceEnd' | 'ConnectorTargetEnd' |
    'ResizeEast' | 'ResizeSouth' | 'ResizeNorth' | 'ResizeSouthEast' | 'ConnectorSegmentPoint' |
    'ResizeSouthWest' | 'ResizeNorthEast' | 'ResizeNorthWest' | 'Rotate' | 'ConnectorEnd' | 'Custom' | 'Draw' | 'Pan' |
    'BezierSourceThumb' | 'BezierTargetThumb' | 'LayoutAnimation' | 'PinchZoom' | 'Hyperlink' | 'SegmentEnd' | 'OrthoThumb' |
    'PortDrag' | 'PortDraw' | 'LabelSelect' | 'LabelDrag' | 'LabelResizeSouthEast' | 'LabelResizeSouthWest' | 'LabelResizeNorthEast' |
    'LabelResizeNorthWest' | 'LabelResizeSouth' | 'LabelResizeNorth' | 'LabelResizeWest' | 'LabelResizeEast' | 'LabelRotate';

/** @hidden */
export class MoveTool extends ToolBase {
    /**
     * Sets/Gets the previous mouse position
     */
    /**   @private  */
    public prevPosition: PointModel;

    /**   @private  */
    public startPosition: PointModel;

    private offset: PointModel;
    /**   @private  */
    public currentTarget: IElement = null;
    /**   @private  */
    public redoElement: PdfAnnotationBaseModel;
    /**   @private  */
    public prevNode: PdfAnnotationBaseModel = null;
    constructor(commandHandler: PdfViewer, base: PdfViewerBase) {
        super(commandHandler, base);
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.offset = { x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY };
        this.startPosition = args.position;
        let nodeMouseDown: PdfAnnotationBaseModel = cloneObject(args.source);
        this.redoElement = {
            bounds: {
                x: nodeMouseDown.wrapper.offsetX, y: nodeMouseDown.wrapper.offsetY,
                width: nodeMouseDown.wrapper.actualSize.width, height: nodeMouseDown.wrapper.actualSize.height
            }
            // tslint:disable-next-line
        } as any;
        if (isLineShapes(nodeMouseDown)) {
            this.redoElement.vertexPoints = (nodeMouseDown as PdfAnnotationBaseModel).vertexPoints;
            this.redoElement.leaderHeight = (nodeMouseDown as PdfAnnotationBaseModel).leaderHeight;
        }
        this.inAction = true;
    }
    /**   @private  */
    /* tslint:disable */
    public mouseUp(args: MouseEventArgs): void {
        let object: SelectorModel;
        if (this.commandHandler) {
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            this.commandHandler.select([(args.source as PdfAnnotationBaseModel).id]);
            this.commandHandler.dragSelectedObjects(this.calculateMouseActionXDiff(args), this.calculateMouseActionYDiff(args), this.pdfViewerBase.activeElements.activePageID, null);
            this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID);
            // tslint:disable-next-line
            let newShapeObject: any = {
                bounds: {
                    x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                    width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                }
            };
            if (isLineShapes(args.source)) {
                newShapeObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                newShapeObject.leaderHeight = (args.source as PdfAnnotationBaseModel).leaderHeight;

            }
            // tslint:disable-next-line
            this.commandHandler.annotation.addAction((this as any).pageIndex, null, args.source, 'Drag', '', this.redoElement as any, newShapeObject);
            this.commandHandler.annotation.stampAnnotationModule.updateSessionStorage(args.source, null, 'Drag');
            this.commandHandler.annotation.stickyNotesAnnotationModule.updateStickyNotes(args.source, null);
        }
        super.mouseUp(args);
    }

    private calculateMouseXDiff(): number {
        return this.currentPosition.x - this.startPosition.x;
    }

    private calculateMouseYDiff(): number {
        return this.currentPosition.y - this.startPosition.y;
    }

    private calculateMouseActionXDiff(args: MouseEventArgs): number {
        let x: number = this.calculateMouseXDiff() / this.commandHandler.viewerBase.getZoomFactor();
        // let y: number = this.calculateMouseYDiff() / this.commandHandler.magnification.zoomFactor;
        let requiredX: number = this.offset.x + x;
        // let requiredY: number = this.offset.y + y;
        return requiredX - args.source.wrapper.offsetX;
        //let diffY: number = requiredY - args.source.wrapper.offsetY;
    }
    private calculateMouseActionYDiff(args: MouseEventArgs): number {
        // let x: number = this.calculateMouseXDiff() / this.commandHandler.magnification.zoomFactor;
        let y: number = this.calculateMouseYDiff() / this.commandHandler.viewerBase.getZoomFactor();
        // let requiredX: number = this.offset.x + x;
        let requiredY: number = this.offset.y + y;
        // let diffX: number = requiredX - args.source.wrapper.offsetX;
        return requiredY - args.source.wrapper.offsetY;
    }
    /**   @private  */
    /* tslint:disable */
    public mouseMove(args: MouseEventArgs, isStamp?: boolean): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            this.currentPosition = args.position;
            this.currentTarget = args.target;
            let x: number = this.calculateMouseXDiff() / this.commandHandler.viewerBase.getZoomFactor();
            let y: number = this.calculateMouseYDiff() / this.commandHandler.viewerBase.getZoomFactor();
            let requiredX: number = this.offset.x + x;
            let requiredY: number = this.offset.y + y;
            let diffX: number = this.calculateMouseActionXDiff(args);
            let diffY: number = this.calculateMouseActionYDiff(args);
            if (!this.helper) {
                let selectedItem: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
                // tslint:disable-next-line
                let cobject: any = cloneObject(this.commandHandler.selectedItems.annotations[0]) as PdfAnnotationBaseModel;
                diffX = requiredX - cobject.wrapper.offsetX;
                diffY = requiredY - cobject.wrapper.offsetY;
                cobject.bounds = this.commandHandler.selectedItems.annotations[0].wrapper.bounds;
                cobject.wrapper = undefined;
                cobject.id = 'diagram_helper';
                if (cobject.shapeAnnotationType === 'Stamp') {
                    cobject.strokeColor = '';
                    cobject.borderDashArray = '';
                    cobject.fillColor = 'transparent';
                    cobject.stampFillColor = 'transparent';
                    cobject.data = '';
                } else {
                    cobject.strokeColor = 'red';
                    cobject.borderDashArray = '5,5';
                    cobject.fillColor = 'transparent';
                    cobject.thickness = 2;
                    cobject.opacity = 1;
                }
                if (!isStamp) {
                    this.helper = cobject = this.commandHandler.add(cobject as PdfAnnotationBase);
                } else {
                    cobject = this.helper = args.source;
                }
                this.commandHandler.selectedItems.annotations = [cobject];
            } else {
                diffX = requiredX - this.helper.wrapper.offsetX;
                diffY = requiredY - this.helper.wrapper.offsetY;
            }
            if (this.helper && this.helper.shapeAnnotationType === 'Stamp') {
                isStamp = true;
            }
            // tslint:disable-next-line:max-line-length
            if (this.commandHandler.checkBoundaryConstraints(diffX, diffY, this.pdfViewerBase.activeElements.activePageID, this.helper.wrapper.bounds, isStamp)) {
                this.commandHandler.dragSelectedObjects(diffX, diffY, this.pdfViewerBase.activeElements.activePageID, this.helper);
                this.prevNode = this.helper;
                this.prevPosition = this.currentPosition;
            } else {
                this.currentPosition = this.prevPosition;
            }

        }
        return true;
    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        let object: SelectorModel;
        let requiredX: number = this.offset.x + this.calculateMouseXDiff();
        let requiredY: number = this.offset.y + this.calculateMouseYDiff();
        let diffX: number = requiredX - args.source.wrapper.offsetX;
        let diffY: number = requiredY - args.source.wrapper.offsetY;
        this.commandHandler.dragSelectedObjects(diffX, diffY, this.prevPageId, null);
        this.commandHandler.renderSelector(this.prevPageId);
        super.mouseLeave(args);
    }
    /**   @private  */
    public endAction(): void {
        super.endAction();
        this.currentTarget = null;
        this.prevPosition = null;
    }
}

/** @hidden */
export class StampTool extends MoveTool {
    /**   @private  */
    // tslint:disable-next-line
    public mouseDown(args: MouseEventArgs): any {
        super.mouseUp.call(this, args);
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        // tslint:disable-next-line
        let newObject: any;
        if (!this.inAction) {
            let pageIndex: number = this.pdfViewerBase.activeElements.activePageID;
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            // tslint:disable-next-line:max-line-length
            let nodeElement: PdfAnnotationBaseModel = this.commandHandler.annotation.stampAnnotationModule.moveStampElement(args.position.x, args.position.y, pageIndex);
            newObject = this.commandHandler.add(nodeElement as PdfAnnotationBase);
            args.source = this.commandHandler.annotations[this.commandHandler.annotations.length - 1] as IElement;
            args.sourceWrapper = args.source.wrapper; this.inAction = true;
            // tslint:disable-next-line
            this['offset'] = { x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY };
            this.startPosition = args.position;
            this.commandHandler.select([newObject.id]);
        }
        super.mouseMove.call(this, args, true);
        this.commandHandler.renderSelector((args.source as PdfAnnotationBaseModel).pageIndex);
        return this.inAction;
    }
}


/**
 * Helps to edit the selected connectors
 * @hidden
 */
export class ConnectTool extends ToolBase {

    protected endPoint: string;

    /**   @private  */
    public selectedSegment: PointModel;

    /**   @private  */
    public initialPosition: PointModel;

    /**   @private  */
    public prevSource: PdfAnnotationBaseModel;
    /**   @private  */
    public redoElement: PdfAnnotationBaseModel;

    constructor(commandHandler: PdfViewer, base: PdfViewerBase, endPoint: string) {
        super(commandHandler, base, true);
        this.endPoint = endPoint;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.undoElement = undefined;
        super.mouseDown(args);
        let oldValue: PointModel;
        let connectors: PdfAnnotationBaseModel;
        if (args.source && (args.source as SelectorModel).annotations) {
            oldValue = { x: this.prevPosition.x, y: this.prevPosition.y };
            connectors = (args.source as SelectorModel).annotations[0];
        }
        this.initialPosition = args.position;
        this.prevSource = this.commandHandler.selectedItems.annotations[0];
        let nodeElement: PdfAnnotationBaseModel = cloneObject(args.source);

        this.redoElement = {
            bounds: {
                x: nodeElement.wrapper.offsetX, y: nodeElement.wrapper.offsetY,
                width: nodeElement.wrapper.actualSize.width, height: nodeElement.wrapper.actualSize.height
            }
            // tslint:disable-next-line
        } as any;
        if (isLineShapes(nodeElement)) {
            this.redoElement.vertexPoints = (nodeElement as PdfAnnotationBaseModel).vertexPoints;
            this.redoElement.leaderHeight = (nodeElement as PdfAnnotationBaseModel).leaderHeight;
            // tslint:disable-next-line:max-line-length
            if (nodeElement.measureType === 'Distance' || nodeElement.measureType === 'Perimeter' || nodeElement.measureType === 'Area' || nodeElement.measureType === 'Volume') {
                this.redoElement.notes = (nodeElement as PdfAnnotationBaseModel).notes;
            }
        }
        this.currentPosition = args.position;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        if (this.commandHandler) {
            let node: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
            this.commandHandler.nodePropertyChange(this.prevSource, { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            this.commandHandler.select([this.prevSource.id]);
            this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID);
            // tslint:disable-next-line
            let newShapeElementObject: any = {
                bounds: {
                    x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                    width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                }
            };
            // tslint:disable-next-line:max-line-length
            if (node.measureType === 'Distance' || node.measureType === 'Perimeter' || node.measureType === 'Area' || node.measureType === 'Volume') {
                this.commandHandler.annotation.updateCalibrateValues(this.commandHandler.selectedItems.annotations[0]);
                newShapeElementObject.notes = (args.source as PdfAnnotationBaseModel).notes;
            }
            if (isLineShapes(args.source)) {
                newShapeElementObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                newShapeElementObject.leaderHeight = (args.source as PdfAnnotationBaseModel).leaderHeight;
            }
            // tslint:disable-next-line
            this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.prevSource, 'Resize', '', this.redoElement as any, newShapeElementObject);
        }
        super.mouseUp(args);
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let connector: PdfAnnotationBaseModel;
        this.currentPosition = args.position;
        if (this.currentPosition && this.prevPosition) {
            let diffX: number = this.currentPosition.x - this.prevPosition.x;
            let diffY: number = this.currentPosition.y - this.prevPosition.y;
            let newValue: PointModel; let oldValue: PointModel;
            if (args.source && (args.source as SelectorModel).annotations) {
                newValue = {
                    x: this.currentPosition.x, y: this.currentPosition.y,
                };
                oldValue = {
                    x: this.prevPosition.x, y: this.prevPosition.y
                };
                connector = (args.source as SelectorModel).annotations[0];
            }
            let targetPortId: string; let targetPdfAnnotationBaseModelId: string;

            if (this.inAction && this.endPoint !== undefined && diffX !== 0 || diffY !== 0) {
                if (!this.helper) {
                    // tslint:disable-next-line
                    let cloneShapebject: any = cloneObject(this.commandHandler.selectedItems.annotations[0]) as PdfAnnotationBaseModel;
                    cloneShapebject.id = 'diagram_helper';
                    cloneShapebject.strokeColor = 'red';
                    cloneShapebject.borderDashArray = '5,5';
                    cloneShapebject.fillColor = 'transparent';
                    cloneShapebject.thickness = 2;
                    cloneShapebject.opacity = 1;
                    this.helper = cloneShapebject = this.commandHandler.add(cloneShapebject as PdfAnnotationBase);
                    this.commandHandler.selectedItems.annotations = [cloneShapebject];
                }
                this.blocked = !this.commandHandler.dragConnectorEnds(
                    this.endPoint, this.helper as IElement, this.currentPosition, this.selectedSegment, args.target);
                this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID);
            }
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
        this.prevPosition = null;
        this.endPoint = null;
    }
}


/**
 * Scales the selected objects
 * @hidden
 */
export class ResizeTool extends ToolBase {
    /**
     * Sets/Gets the previous mouse position
     */
    /**   @private  */
    public prevPosition: PointModel;

    /**   @private  */
    public corner: string;
    public possibleRect: Rect;
    /**   @private  */
    public initialOffset: PointModel;

    /**   @private  */
    public initialBounds: Rect = new Rect();

    /**   @private  */
    public initialPosition: PointModel;
    /**   @private  */
    public redoElement: PdfAnnotationBaseModel;

    /**   @private  */
    public prevSource: PdfAnnotationBaseModel;
    constructor(commandHandler: PdfViewer, base: PdfViewerBase, corner: string) {
        super(commandHandler, base, true);
        this.corner = corner;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.initialBounds.x = args.source.wrapper.offsetX;
        this.initialBounds.y = args.source.wrapper.offsetY;
        this.initialBounds.height = args.source.wrapper.actualSize.height;
        this.initialBounds.width = args.source.wrapper.actualSize.width;
        this.initialPosition = args.position;
        let node: PdfAnnotationBaseModel = cloneObject(args.source);

        this.redoElement = {
            bounds: {
                x: node.wrapper.offsetX, y: node.wrapper.offsetY,
                width: node.wrapper.actualSize.width, height: node.wrapper.actualSize.height
            }
            // tslint:disable-next-line
        } as any;
        if (isLineShapes(node)) {
            this.redoElement.vertexPoints = (node as PdfAnnotationBaseModel).vertexPoints;
            this.redoElement.leaderHeight = (node as PdfAnnotationBaseModel).leaderHeight;

        }
        if (node.measureType === 'Radius') {
            this.redoElement.notes = (node as PdfAnnotationBaseModel).notes;
        }
        this.prevSource = this.commandHandler.selectedItems.annotations[0];

    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs, isPreventHistory?: boolean): boolean {
        let object: PdfAnnotationBaseModel | SelectorModel;
        object = args.source as PdfAnnotationBaseModel | Selector;
        if (this.commandHandler) {
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            this.commandHandler.select([this.prevSource.id]);
            // tslint:disable-next-line:max-line-length
            let deltaValues: Rect = this.updateSize(this.prevSource, this.currentPosition, this.initialPosition, this.corner, this.initialBounds);
            this.blocked = this.scaleObjects(
                deltaValues.width, deltaValues.height, this.corner, this.currentPosition, this.initialPosition, this.prevSource);

            this.commandHandler.renderSelector(this.prevPageId);
            if (this.commandHandler.annotation) {
                // tslint:disable-next-line
                let newObject: any = {
                    bounds: {
                        x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                        width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                    }
                };
                if (isLineShapes(args.source)) {
                    newObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                    newObject.leaderHeight = (args.source as PdfAnnotationBaseModel).leaderHeight;
                }
                if (this.prevSource.measureType === 'Radius') {
                    newObject.notes = (args.source as PdfAnnotationBaseModel).notes;
                    this.commandHandler.annotation.updateCalibrateValues(this.prevSource);
                }
                // tslint:disable-next-line
                this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.prevSource, 'Resize', '', this.redoElement as any, newObject);
            }
            this.commandHandler.annotation.stampAnnotationModule.updateSessionStorage(args.source, this.prevSource.id, 'Resize');
        }
        super.mouseUp(args);
        return !this.blocked;
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let object: PdfAnnotationBaseModel | SelectorModel;
        object = args.source as PdfAnnotationBaseModel | Selector;

        this.currentPosition = args.position;
        let x: number = this.currentPosition.x - this.startPosition.x;
        let y: number = this.currentPosition.y - this.startPosition.y;
        x = x / this.commandHandler.viewerBase.getZoomFactor();
        y = y / this.commandHandler.viewerBase.getZoomFactor();
        let changes: PointModel = { x: x, y: y };
        changes = rotatePoint(-this.currentElement.wrapper.rotateAngle, undefined, undefined, changes);
        let sx: number = (this.currentElement.wrapper.actualSize.width + changes.x) / this.currentElement.wrapper.actualSize.width;
        let sy: number = (this.currentElement.wrapper.actualSize.height + changes.y) / this.currentElement.wrapper.actualSize.height;
        changes = this.getChanges(changes);
        if (!this.helper) {
            // tslint:disable-next-line
            let cobject: any = cloneObject(this.commandHandler.selectedItems.annotations[0]) as PdfAnnotationBaseModel;
            cobject.id = 'diagram_helper';
            if (cobject.shapeAnnotationType === 'Stamp') {
                cobject.strokeColor = '';
                cobject.borderDashArray = '';
                cobject.fillColor = 'transparent';
                cobject.stampFillColor = 'transparent';
                cobject.data = '';
            } else {
                cobject.bounds = this.commandHandler.selectedItems.annotations[0].wrapper.bounds;
                cobject.strokeColor = 'red';
                cobject.borderDashArray = '5,5';
                cobject.fillColor = 'transparent';
                cobject.thickness = 2;
                cobject.opacity = 1;
            }
            this.helper = cobject = this.commandHandler.add(cobject as PdfAnnotationBase);
            this.commandHandler.selectedItems.annotations = [cobject];
        }
        let deltaValues: Rect = this.updateSize(this.helper, this.startPosition, this.currentPosition, this.corner, this.initialBounds);
        this.blocked = !(this.scaleObjects(
            deltaValues.width, deltaValues.height, this.corner, this.startPosition, this.currentPosition, this.helper));
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
    private getTooltipContent(pdfAnnotationBaseModel: SelectorModel): string {
        // tslint:disable-next-line:max-line-length
        return 'W:' + Math.round(pdfAnnotationBaseModel.wrapper.bounds.width) + ' ' + 'H:' + Math.round(pdfAnnotationBaseModel.wrapper.bounds.height);
    }

    private getChanges(change: PointModel): PointModel {
        switch (this.corner) {
            case 'ResizeEast':
                return { x: change.x, y: 0 };
            case 'ResizeSouthEast':
                return change;
            case 'ResizeSouth':
                return { x: 0, y: change.y };
            case 'ResizeNorth':
                return { x: 0, y: -change.y };
            case 'ResizeNorthEast':
                return { x: change.x, y: -change.y };
            case 'ResizeNorthWest':
                return { x: -change.x, y: -change.y };
            case 'ResizeWest':
                return { x: - change.x, y: 0 };
            case 'ResizeSouthWest':
                return { x: - change.x, y: change.y };
        }
        return change;
    }
    /**
     * Updates the size with delta width and delta height using scaling.
     */

    /**
     * Aspect ratio used to resize the width or height based on resizing the height or width
     */
    private scaleObjects(
        deltaWidth: number, deltaHeight: number, corner: string, startPoint: PointModel, endPoint: PointModel,
        source?: SelectorModel | PdfAnnotationBaseModel)
        : boolean {
        if (source instanceof Selector && source.annotations.length === 1 &&
            // tslint:disable-next-line:max-line-length
            (source.annotations[0].shapeAnnotationType === 'Perimeter' || source.annotations[0].shapeAnnotationType === 'Radius' || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'Stamp')) {
            if (!(deltaHeight === 1 && deltaWidth === 1)) {
                deltaHeight = deltaWidth = Math.max(deltaHeight === 1 ? 0 : deltaHeight, deltaWidth === 1 ? 0 : deltaWidth);
            } else if (startPoint !== endPoint) {
                deltaHeight = deltaWidth = Math.max(deltaHeight, deltaWidth);
            } else {
                deltaHeight = deltaWidth = 0;
            }
        } else {
            // tslint:disable-next-line:max-line-length
            if ((source as PdfAnnotationBaseModel).shapeAnnotationType === 'Perimeter' || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'Radius'
                || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'Stamp') {
                if (!(deltaHeight === 1 && deltaWidth === 1)) {
                    deltaHeight = deltaWidth = Math.max(deltaHeight === 1 ? 0 : deltaHeight, deltaWidth === 1 ? 0 : deltaWidth);
                }
            }
        }
        let oldValue: SelectorModel = {
            offsetX: source.wrapper.offsetX, offsetY: source.wrapper.offsetY,
            // width: source.bound.width, height: source.height
        };
        this.blocked = this.commandHandler.scaleSelectedItems(deltaWidth, deltaHeight, this.getPivot(this.corner));
        return this.blocked;
    }
}

/**
 * Draws a node that is defined by the user
 * @hidden
 */
export class NodeDrawingTool extends ToolBase {
    /** @private */
    public drawingObject: PdfAnnotationBaseModel;
    /** @private */
    public sourceObject: PdfAnnotationBaseModel;
    /** @private */
    public dragging: boolean;

    constructor(commandHandler: PdfViewer, base: PdfViewerBase, sourceObject: PdfAnnotationBaseModel) {
        super(commandHandler, base);
        this.sourceObject = sourceObject;
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        let node: PdfAnnotationBaseModel = {
            bounds: { x: 100, y: 300, width: 100, height: 100 },
            pageIndex: 0, strokeColor: 'red', thickness: 3
        };
        node.id = randomId();
        this.sourceObject.pageIndex = node.pageIndex = this.pdfViewerBase.activeElements.activePageID || 0;
        // tslint:disable-next-line
        this.commandHandler.drawingObject = this.drawingObject = this.commandHandler.add(this.sourceObject || node as any) as PdfAnnotationBaseModel;
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            this.dragging = true;
            let rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            this.updateNodeDimension(this.drawingObject, rect);
            if (this.drawingObject.shapeAnnotationType === 'Radius') {
                this.updateRadiusLinePosition(this.drawingObject.wrapper.children[1], this.drawingObject);
            }
        }
        return true;
    }
    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        if (this.drawingObject && this.dragging) {
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            this.commandHandler.select([this.drawingObject.id]);
            this.commandHandler.annotation.updateCalibrateValues(this.drawingObject);
            // tslint:disable-next-line
            this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.drawingObject, 'Addition', '', this.drawingObject as any, this.drawingObject);
            this.drawingObject = null;
            this.dragging = false;
            super.mouseUp(args);
            this.inAction = false;
        }

    }
    /**   @private  */
    public endAction(): void {
        super.endAction();
    }
    /**   @private  */
    public updateNodeDimension(obj: PdfAnnotationBaseModel, rect?: Rect): void {
        let zoom: number = this.commandHandler.viewerBase.getZoomFactor();
        obj.bounds.x = (rect.x / zoom) + rect.width / zoom;
        obj.bounds.y = (rect.y / zoom) + rect.height / zoom;
        obj.bounds.width = rect.width / zoom;
        obj.bounds.height = rect.height / zoom;
        this.commandHandler.nodePropertyChange(obj, { bounds: obj.bounds });
    }

    /**   @private  */
    public updateRadiusLinePosition(obj: DrawingElement, node: PdfAnnotationBaseModel): void {
        let trasPoint: PointModel = { x: node.bounds.x + (node.bounds.width / 4), y: node.bounds.y };
        let center: PointModel = { x: (node.bounds.x + (node.bounds.width / 2)), y: (node.bounds.y + (node.bounds.height / 2)) };
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, node.rotateAngle, center.x, center.y);
        let rotatedPoint: PointModel = transformPointByMatrix(matrix, trasPoint);
        let newPoint1: PointModel = { x: rotatedPoint.x, y: rotatedPoint.y };
        obj.offsetX = newPoint1.x;
        obj.offsetY = newPoint1.y;
        obj.width = node.bounds.width / 2;
        this.commandHandler.renderDrawing(undefined, node.pageIndex);
    }
}
/**
 * Draws a Polygon shape node dynamically using polygon Tool
 * @hidden
 */
export class PolygonDrawingTool extends ToolBase {
    /** @private */
    public drawingObject: PdfAnnotationBaseModel;
    /** @private */
    public startPoint: PointModel;
    /** @private */
    public dragging: boolean;
    /** @private */
    public action: string;
    constructor(commandHandler: PdfViewer, base: PdfViewerBase, action: string) {
        super(commandHandler, base);
        this.action = action;
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        if (!this.drawingObject) {
            this.startPoint = { x: this.startPosition.x, y: this.startPosition.y };
            let nodeAnnotElement: PdfAnnotationBaseModel = {
                bounds: {
                    x: this.currentPosition.x,
                    y: this.currentPosition.y, width: 5, height: 5
                }, vertexPoints: [{ x: this.startPoint.x, y: this.startPoint.y }, { x: this.currentPosition.x, y: this.currentPosition.y }],
                shapeAnnotationType: 'Line', fillColor: this.commandHandler.drawingObject.fillColor,
                strokeColor: this.commandHandler.drawingObject.strokeColor, pageIndex: this.pdfViewerBase.activeElements.activePageID,
                // tslint:disable-next-line:max-line-length
                notes: this.commandHandler.drawingObject.notes, thickness: this.commandHandler.drawingObject.thickness, author: this.commandHandler.drawingObject.author,
                subject: this.commandHandler.drawingObject.subject, borderDashArray: this.commandHandler.drawingObject.borderDashArray,
                modifiedDate: this.commandHandler.drawingObject.modifiedDate, borderStyle: this.commandHandler.drawingObject.borderStyle,
                measureType: this.commandHandler.drawingObject.measureType
            };
            // tslint:disable-next-line
            this.drawingObject = this.commandHandler.add(nodeAnnotElement as any);
        } else {
            let pt: PointModel;
            let obj: PdfAnnotationBaseModel = (this.drawingObject);
            pt = obj.vertexPoints[obj.vertexPoints.length - 1];
            pt = { x: pt.x, y: pt.y };
            let lastPoint: PointModel = this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length - 1];
            if (!(lastPoint.x === pt.x && lastPoint.x === pt.y)) {
                this.drawingObject.vertexPoints.push(pt);
            }
            this.commandHandler.nodePropertyChange(obj, { vertexPoints: obj.vertexPoints });
        }
    }


    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            this.dragging = true;
            let obj: PdfAnnotationBaseModel = (this.drawingObject);
            if (this.drawingObject && this.currentPosition) {
                obj.vertexPoints[obj.vertexPoints.length - 1].x = this.currentPosition.x;
                obj.vertexPoints[obj.vertexPoints.length - 1].y = this.currentPosition.y;
                this.commandHandler.nodePropertyChange(obj, { vertexPoints: obj.vertexPoints });
            }
            if (obj.measureType === 'Perimeter') {
                updatePerimeterLabel(obj, obj.vertexPoints, this.commandHandler.annotation.measureAnnotationModule);
            }
        }
        return true;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs, isDoubleClineck?: boolean): void {
        super.mouseMove(args);
        let bounds: Rect = new Rect(args.position.x - 5, args.position.y - 5, args.position.x + 5, args.position.y + 5);
        if (((this.drawingObject && bounds.containsPoint((this.drawingObject.vertexPoints[0]))) || isDoubleClineck) && this.dragging) {
            if (this.inAction) {
                this.inAction = false;
                if (this.drawingObject) {
                    this.drawingObject.vertexPoints.splice(this.drawingObject.vertexPoints.length - 1, 1);
                    if (this.action === 'Polygon') {
                        this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length - 1] = this.drawingObject.vertexPoints[0];
                        this.commandHandler.nodePropertyChange(this.drawingObject, { vertexPoints: this.drawingObject.vertexPoints });
                        let cobject: PdfAnnotationBase = cloneObject(this.drawingObject) as PdfAnnotationBase;
                        cobject.shapeAnnotationType = 'Polygon';
                        cobject.bounds.width = cobject.wrapper.actualSize.width;
                        cobject.bounds.height = cobject.wrapper.actualSize.height;
                        cobject.bounds.x = this.drawingObject.wrapper.bounds.x;
                        cobject.bounds.y = this.drawingObject.wrapper.bounds.y;
                        this.commandHandler.add(cobject);
                        this.commandHandler.remove(this.drawingObject);
                        this.commandHandler.select([cobject.id]);
                        let drawingObject: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
                        // tslint:disable-next-line:max-line-length
                        if (this.commandHandler.enableShapeAnnotation && (isNullOrUndefined(drawingObject.measureType) || drawingObject.measureType === '')) {
                            this.commandHandler.annotation.shapeAnnotationModule.renderShapeAnnotations(drawingObject, drawingObject.pageIndex);
                        }
                        // tslint:disable-next-line:max-line-length
                        if (this.commandHandler.enableMeasureAnnotation && (drawingObject.measureType === 'Area' || drawingObject.measureType === 'Volume')) {
                            if (drawingObject.measureType === 'Area') {
                                // tslint:disable-next-line:max-line-length
                                drawingObject.notes = this.commandHandler.annotation.measureAnnotationModule.calculateArea(drawingObject.vertexPoints);
                                this.commandHandler.annotation.stickyNotesAnnotationModule.addTextToComments(drawingObject.annotName, drawingObject.notes);
                            } else if (drawingObject.measureType === 'Volume') {
                                // tslint:disable-next-line:max-line-length
                                drawingObject.notes = this.commandHandler.annotation.measureAnnotationModule.calculateVolume(drawingObject.vertexPoints);
                                this.commandHandler.annotation.stickyNotesAnnotationModule.addTextToComments(drawingObject.annotName, drawingObject.notes);
                            }
                            // tslint:disable-next-line:max-line-length
                            this.commandHandler.annotation.measureAnnotationModule.renderMeasureShapeAnnotations(drawingObject, drawingObject.pageIndex);
                        }
                        // tslint:disable-next-line
                        let setting: any = {
                            opacity: drawingObject.opacity, fillColor: drawingObject.fillColor, strokeColor: drawingObject.strokeColor,
                            thickness: drawingObject.thickness, author: drawingObject.author, subject: drawingObject.subject,
                            modifiedDate: drawingObject.modifiedDate, borderDashArray: drawingObject.borderDashArray,
                            lineHeadStartStyle: this.commandHandler.annotation.getArrowString(drawingObject.sourceDecoraterShapes),
                            lineHeadEndStyle: this.commandHandler.annotation.getArrowString(drawingObject.taregetDecoraterShapes)
                        };
                        // tslint:disable-next-line
                        let bounds: any = {left: drawingObject.bounds.x, top: drawingObject.bounds.y, width: drawingObject.bounds.width, height: drawingObject.bounds.height};
                        // tslint:disable-next-line:max-line-length
                        this.commandHandler.fireAnnotationAdd(drawingObject.pageIndex, this.commandHandler.annotation.getAnnotationIndex(drawingObject.pageIndex, drawingObject.id), this.commandHandler.annotation.getAnnotationType(drawingObject.shapeAnnotationType, drawingObject.measureType), bounds, setting);
                    } else {
                        this.drawingObject.vertexPoints.splice(this.drawingObject.vertexPoints.length - 1, 1);
                        this.commandHandler.nodePropertyChange(this.drawingObject, {
                            // tslint:disable-next-line:max-line-length
                            vertexPoints: this.drawingObject.vertexPoints, sourceDecoraterShapes: this.commandHandler.drawingObject.sourceDecoraterShapes,
                            taregetDecoraterShapes: this.commandHandler.drawingObject.taregetDecoraterShapes
                        });
                        this.commandHandler.select([this.drawingObject.id]);
                        if (this.commandHandler.enableMeasureAnnotation && this.drawingObject.measureType === 'Perimeter') {
                            removePerimeterLabel(this.drawingObject);
                            this.commandHandler.renderDrawing(null, this.drawingObject.pageIndex);
                            // tslint:disable-next-line:max-line-length
                            this.drawingObject.notes = this.commandHandler.annotation.measureAnnotationModule.calculatePerimeter(this.drawingObject);
                            this.commandHandler.annotation.stickyNotesAnnotationModule.addTextToComments(this.drawingObject.annotName, this.drawingObject.notes);
                            // tslint:disable-next-line:max-line-length
                            this.commandHandler.annotation.measureAnnotationModule.renderMeasureShapeAnnotations(this.drawingObject, this.drawingObject.pageIndex);
                            let drawingObject: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
                            // tslint:disable-next-line
                            let setting: any = {
                                opacity: drawingObject.opacity, fillColor: drawingObject.fillColor, strokeColor: drawingObject.strokeColor,
                                thickness: drawingObject.thickness, author: drawingObject.author, subject: drawingObject.subject,
                                modifiedDate: drawingObject.modifiedDate, borderDashArray: drawingObject.borderDashArray,
                                lineHeadStartStyle: this.commandHandler.annotation.getArrowString(drawingObject.sourceDecoraterShapes),
                                lineHeadEndStyle: this.commandHandler.annotation.getArrowString(drawingObject.taregetDecoraterShapes)
                            };
                            // tslint:disable-next-line
                            let bounds: any = {left: drawingObject.bounds.x, top: drawingObject.bounds.y, width: drawingObject.bounds.width, height: drawingObject.bounds.height};
                            // tslint:disable-next-line:max-line-length
                            this.commandHandler.fireAnnotationAdd(drawingObject.pageIndex, 0, this.commandHandler.annotation.getAnnotationType(drawingObject.shapeAnnotationType, drawingObject.measureType), bounds, setting);
                        }

                    }
                    // tslint:disable-next-line
                    this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.drawingObject, 'Addition', '', this.drawingObject as any, this.drawingObject);

                    this.drawingObject = null;
                }
            }
            this.endAction();
        } else if (this.inAction && !this.dragging) {
            this.commandHandler.remove(this.drawingObject);
        }
    }

    /**   @private  */
    public mouseWheel(args: MouseEventArgs): void {
        super.mouseWheel(args);
        this.mouseMove(args as MouseEventArgs);
    }

    /**   @private  */
    public endAction(): void {
        this.inAction = false;
        this.drawingObject = null;
        this.commandHandler.tool = '';
    }
}

/**
 * Helps to edit the selected connectors
 * @hidden
 */
export class LineTool extends ToolBase {

    protected endPoint: string;

    /**   @private  */
    public selectedSegment: PointModel;
    /**   @private  */
    public startPoint: PointModel;
    /** @private */
    public dragging: boolean;
    /**   @private  */
    public initialPosition: PointModel;
    /** @private */
    public drawingObject: PdfAnnotationBaseModel;

    /**   @private  */
    public prevSource: PdfAnnotationBaseModel;
    constructor(commandHandler: PdfViewer, base: PdfViewerBase, endPoint: string, drawingObject: PdfAnnotationBaseModel) {
        super(commandHandler, base, true);
        this.endPoint = endPoint;
        this.drawingObject = drawingObject;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.undoElement = undefined;
        super.mouseDown(args);
        let oldPointValue: PointModel;
        let connectorsShape: PdfAnnotationBaseModel;
        if (args.source && (args.source as SelectorModel).annotations) {
            oldPointValue = { x: this.prevPosition.x, y: this.prevPosition.y };
            connectorsShape = this.drawingObject;
        }
        this.initialPosition = args.position;
        this.prevSource = this.drawingObject;
        this.currentPosition = args.position;
        if (!this.drawingObject) {
            let measureModule: MeasureAnnotation = this.commandHandler.annotation.measureAnnotationModule;
            let annotationNode: PdfAnnotationBaseModel = {
                // tslint:disable-next-line:max-line-length
                vertexPoints: [{ x: this.startPosition.x, y: this.startPosition.y }, { x: this.currentPosition.x, y: this.currentPosition.y }],
                bounds: {
                    x: this.currentPosition.x,
                    y: this.currentPosition.y, width: 5, height: 5
                }, sourceDecoraterShapes: this.commandHandler.drawingObject.sourceDecoraterShapes,
                taregetDecoraterShapes: this.commandHandler.drawingObject.taregetDecoraterShapes, measureType: 'Distance',
                // tslint:disable-next-line:max-line-length
                fillColor: this.commandHandler.drawingObject.fillColor, notes: this.commandHandler.drawingObject.notes, strokeColor: this.commandHandler.drawingObject.strokeColor,
                opacity: this.commandHandler.drawingObject.opacity, thickness: this.commandHandler.drawingObject.thickness, borderDashArray: this.commandHandler.drawingObject.borderDashArray,
                // tslint:disable-next-line:max-line-length
                shapeAnnotationType: 'Distance', pageIndex: this.pdfViewerBase.activeElements.activePageID,
                author: this.commandHandler.drawingObject.author, subject: this.commandHandler.drawingObject.subject
            };
            // tslint:disable-next-line
            this.drawingObject = this.commandHandler.add(annotationNode as any);
        } else if (!this.dragging) {
            let nodeAnnot: PdfAnnotationBaseModel = {
                bounds: {
                    x: this.currentPosition.x,
                    y: this.currentPosition.y, width: 5, height: 5
                    // tslint:disable-next-line:max-line-length
                }, vertexPoints: [{ x: this.startPosition.x, y: this.startPosition.y }, { x: this.currentPosition.x, y: this.currentPosition.y }],
                // tslint:disable-next-line:max-line-length
                shapeAnnotationType: this.drawingObject.shapeAnnotationType, sourceDecoraterShapes: this.drawingObject.sourceDecoraterShapes,
                taregetDecoraterShapes: this.drawingObject.taregetDecoraterShapes, fillColor: this.drawingObject.fillColor,
                strokeColor: this.drawingObject.strokeColor, pageIndex: this.pdfViewerBase.activeElements.activePageID,
                // tslint:disable-next-line:max-line-length
                opacity: this.drawingObject.opacity || 1, borderDashArray: this.drawingObject.borderDashArray, thickness: this.drawingObject.thickness,
                modifiedDate: this.drawingObject.modifiedDate, author: this.drawingObject.author, subject: this.drawingObject.subject,
                lineHeadEnd: this.drawingObject.lineHeadEnd, lineHeadStart: this.drawingObject.lineHeadStart,
                measureType: this.commandHandler.drawingObject.measureType
            };
            // tslint:disable-next-line
            this.drawingObject = this.commandHandler.add(nodeAnnot as any);

        }

    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        if (this.dragging) {
            super.mouseMove(args);
            if (this.commandHandler) {
                let node: PdfAnnotationBaseModel = this.drawingObject;
                this.commandHandler.nodePropertyChange(node, { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                this.commandHandler.select([node.id]);
                this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID);
            }
            if (this.endPoint && this.endPoint.indexOf('ConnectorSegmentPoint') > -1 && this.dragging) {
                this.commandHandler.annotation.updateCalibrateValues(this.drawingObject);
                // tslint:disable-next-line
                this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.drawingObject, 'Addition', '', this.drawingObject as any, this.drawingObject);
                this.drawingObject = null;
                this.dragging = false;
                super.mouseUp(args);
            }
            if (this.drawingObject) {
                this.endPoint = 'ConnectorSegmentPoint_1';
            }
        } else {
            if (this.drawingObject) {
                this.commandHandler.remove(this.drawingObject);
            }
        }
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            let connector: PdfAnnotationBaseModel;
            this.currentPosition = args.position;
            this.dragging = true;
            if (this.currentPosition && this.prevPosition) {
                let diffX: number = this.currentPosition.x - this.prevPosition.x;
                let diffY: number = this.currentPosition.y - this.prevPosition.y;
                let newValue: PointModel; let oldValue: PointModel;
                connector = this.drawingObject;
                let targetPortId: string; let targetPdfAnnotationBaseModelId: string;
                // tslint:disable-next-line:max-line-length
                if (this.inAction && this.commandHandler && this.drawingObject && this.endPoint !== undefined && diffX !== 0 || diffY !== 0) {
                    this.blocked = !this.commandHandler.dragConnectorEnds(
                        this.endPoint, this.drawingObject as IElement, this.currentPosition, this.selectedSegment, args.target);
                    this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID);
                }
            }
            this.prevPosition = this.currentPosition;
        }
        return !this.blocked;

    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
        this.prevPosition = null;
        this.endPoint = null;
    }
}


/**
 * Rotates the selected objects
 * @hidden
 */
export class RotateTool extends ToolBase {

    constructor(commandHandler: PdfViewer, base: PdfViewerBase) {
        super(commandHandler, base, true);
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.undoElement = cloneObject(args.source);
        super.mouseDown(args);
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        let object: PdfAnnotationBaseModel | SelectorModel;
        object = args.source as PdfAnnotationBaseModel | Selector;
        if (this.undoElement.rotateAngle !== object.wrapper.rotateAngle) {
            let oldValue: SelectorModel = { rotateAngle: object.wrapper.rotateAngle };
            let obj: SelectorModel;
            obj = cloneObject(args.source);
            this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID);
        }
        this.commandHandler.annotation.stampAnnotationModule.updateSessionStorage(args.source, null, 'Rotate');
        super.mouseUp(args);
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let object: PdfAnnotationBaseModel | SelectorModel;
        object = args.source as PdfAnnotationBaseModel | Selector;
        this.currentPosition = args.position;
        let refPoint: PointModel = { x: object.wrapper.offsetX, y: object.wrapper.offsetY };
        let angle: number = Point.findAngle(refPoint, this.currentPosition) + 90;
        angle = (angle + 360) % 360;
        let oldValue: SelectorModel = { rotateAngle: object.wrapper.rotateAngle };
        let newValue: SelectorModel = { rotateAngle: angle };
        this.blocked = !(this.commandHandler.rotate(angle - object.wrapper.rotateAngle));
        return !this.blocked;
    }

    private getTooltipContent(node: SelectorModel): string {
        return Math.round((node.rotateAngle % 360)).toString() + '\xB0';
    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }
}

/**
 * @hidden
 */
export interface Info {
    ctrlKey?: boolean;
    shiftKey?: boolean;
}

/**
 * @hidden
 */
export interface ITouches {
    pageX?: number;
    pageY?: number;
    pointerId?: number;
}

/**
 * @hidden
 */
export interface MouseEventArgs {
    position?: PointModel;
    source?: IElement;
    sourceWrapper?: DrawingElement;
    target?: IElement;
    targetWrapper?: DrawingElement;
    info?: Info;
    startTouches?: TouchList | ITouches[];
    moveTouches?: TouchList | ITouches[];
    clickCount?: number;
    actualObject?: IElement;
}