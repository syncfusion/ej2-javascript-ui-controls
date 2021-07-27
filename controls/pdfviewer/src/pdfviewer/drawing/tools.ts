/* eslint-disable */
import { PointModel, randomId, Point, cornersPointsBeforeRotation, TextAlign } from '@syncfusion/ej2-drawings';
import { IElement } from '@syncfusion/ej2-drawings';
import { rotatePoint } from '@syncfusion/ej2-drawings';
import { Rect } from '@syncfusion/ej2-drawings';
import { Matrix, transformPointByMatrix, rotateMatrix, identityMatrix } from '@syncfusion/ej2-drawings';
import { SelectorModel } from './selector-model';
import { TextElement } from '@syncfusion/ej2-drawings';
import { Selector } from './selector';
import { DrawingElement } from '@syncfusion/ej2-drawings';
import { findActiveElement } from './action';
// eslint-disable-next-line max-len
import { PdfViewer, PdfViewerBase, MeasureAnnotation, AnnotationSelectorSettingsModel } from '../index';
import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './pdf-annotation-model';
import { PdfAnnotationBase } from './pdf-annotation';
import { cloneObject, isLineShapes } from './drawing-util';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { updatePerimeterLabel } from './connector-util';
import { Browser } from '@syncfusion/ej2-base';
import { DiagramHtmlElement } from './html-element';
import { IFormField, IFormFieldBound } from '../form-designer';
import { FormFieldModel } from '../pdfviewer-model';
import { FontStyle, FormFieldType } from '../base';

/**
 * Defines the interactive tools
 *
 * @hidden
 */
export class ToolBase {
    /**
     * Initializes the tool
     *
     * @param command Command that is corresponding to the current action
     * @param pdfViewer
     * @param pdfViewerBase
     * @param protectChange
     * @param pdfViewer
     * @param pdfViewerBase
     * @param protectChange
     * @param pdfViewer
     * @param pdfViewerBase
     * @param protectChange
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

    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        this.currentElement = args.source;
        this.startPosition = this.currentPosition = this.prevPosition = args.position;
        this.isTooltipVisible = true;
        this.startAction(args.source);
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        this.currentPosition = args.position;
        //this.currentElement = currentElement;
        this.prevPageId = this.pdfViewerBase.activeElements.activePageID;
        return !this.blocked;
    }

    /**
     * @param args
     * @private
     */
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
        if (this.commandHandler) {
            this.commandHandler.tool = '';
            if (this.helper) {
                this.commandHandler.remove(this.helper);
            }
        }
        this.commandHandler = null;
        this.currentElement = null;
        this.currentPosition = null;
        this.inAction = false;
        this.blocked = false;

    }

    /**
     * @param args
     * @private
     */
    public mouseWheel(args: MouseEventArgs): void {
        this.currentPosition = args.position;
    }

    /**
     * @param args
     * @private
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    // eslint-disable-next-line
    protected updateSize(
        // eslint-disable-next-line
        shape: any, startPoint: PointModel,
        endPoint: PointModel, corner: string, initialBounds: Rect, angle?: number, isMouseUp?: boolean): Rect {
        shape = shape;
        const zoom: number = this.commandHandler.viewerBase.getZoomFactor();

        let difx: number = this.currentPosition.x / zoom - this.startPosition.x / zoom;
        let dify: number = this.currentPosition.y / zoom - this.startPosition.y / zoom;
        const rotateAngle: number = (shape instanceof TextElement) ? angle : shape.rotateAngle;
        let matrix: Matrix;
        matrix = identityMatrix();
        rotateMatrix(matrix, -rotateAngle, 0, 0);
        let deltaWidth: number = 0; let deltaHeight: number = 0;
        let diff: PointModel;
        const width: number = (shape instanceof TextElement) ? shape.actualSize.width : shape.wrapper.bounds.width;
        const height: number = (shape instanceof TextElement) ? shape.actualSize.height : shape.wrapper.bounds.height;
        // eslint-disable-next-line
        let obj: any = shape;
        if(!shape.formFieldAnnotationType) {
        if (!shape.annotName && !shape.shapeAnnotationType) {
            if (shape as SelectorModel) {
                // eslint-disable-next-line
                obj = (shape as any).annotations[0];
            }
        }
    }
        // eslint-disable-next-line
        let annotationSettings: any = this.commandHandler.annotationModule ? this.commandHandler.annotationModule.findAnnotationSettings(obj): {};
        let annotationMaxHeight: number = 0;
        let annotationMaxWidth: number  = 0;
        let annotationMinHeight: number = 0;
        let annotationMinWidth: number = 0;
        if (annotationSettings.minWidth ||  annotationSettings.maxWidth || annotationSettings.minHeight || annotationSettings.maxHeight) {
            annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
            annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            annotationMinHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
            annotationMinWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
        }
        let isAnnotationSet: boolean = false;
        if (annotationMinHeight || annotationMinWidth || annotationMaxHeight || annotationMaxWidth) {
            isAnnotationSet = true;
        }
        if (isAnnotationSet && isMouseUp) {
            // eslint-disable-next-line
            let size: any = this.getPositions(corner, difx, dify);
            const newWidth: number = width + size.x;
            const newHeight: number = height + size.y;
            // eslint-disable-next-line max-len
            if ((newHeight > annotationMinHeight && newHeight < annotationMaxHeight) && (newWidth > annotationMinWidth && newWidth < annotationMaxWidth)) {
                difx = difx;
                dify = dify;
            } else {
                if (newHeight < annotationMinHeight  || newHeight > annotationMaxHeight) {
                    if (newHeight < annotationMinHeight) {
                        dify = annotationMinHeight - height;
                    } else {
                        dify = annotationMaxHeight - height;
                    }
                }
                if (newWidth < annotationMinWidth || newWidth > annotationMaxWidth) {
                    if (newWidth < annotationMinWidth) {
                        difx = annotationMinWidth - width;
                    } else {
                        difx = annotationMaxWidth - width;
                    }
                }
            }
        }
        switch (corner) {
        case 'ResizeWest':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            deltaHeight = 1;
            difx = difx;
            dify = 0;
            if (isAnnotationSet) {
                if (initialBounds.width - difx > annotationMaxWidth) {
                    difx = annotationMaxWidth - initialBounds.width;
                }
            }
            deltaWidth = (initialBounds.width - difx) / width; break;
        case 'ResizeEast':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
            difx = diff.x;
            dify = diff.y;
            dify = 0;
            if (isAnnotationSet) {
                if (initialBounds.width + difx > annotationMaxWidth) {
                    difx = annotationMaxWidth - initialBounds.width;
                }
            }
            deltaWidth = (initialBounds.width + difx) / width;
            deltaHeight = 1;
            break;
        case 'ResizeNorth':
            deltaWidth = 1;
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet) {
                if (initialBounds.height - dify > annotationMaxHeight) {
                    dify = annotationMaxHeight - initialBounds.height;
                }
            }
            deltaHeight = (initialBounds.height - dify) / height; break;
        case 'ResizeSouth':
            deltaWidth = 1;
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet) {
                if (initialBounds.height + dify > annotationMaxHeight) {
                    dify = annotationMaxHeight - initialBounds.height;
                }
            }
            deltaHeight = (initialBounds.height + dify) / height; break;
        case 'ResizeNorthEast':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet) {
                if (initialBounds.width + difx > annotationMaxWidth) {
                    difx = annotationMaxWidth - initialBounds.width;
                }
                if (initialBounds.height - dify > annotationMaxHeight) {
                    dify = annotationMaxHeight - initialBounds.height;
                }
            }
            deltaWidth = (initialBounds.width + difx) / width; deltaHeight = (initialBounds.height - dify) / height;
            break;
        case 'ResizeNorthWest':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet) {
                if (initialBounds.width - difx > annotationMaxWidth) {
                    difx = annotationMaxWidth - initialBounds.width;
                }
                if (initialBounds.height - dify > annotationMaxHeight) {
                    dify = annotationMaxHeight - initialBounds.height;
                }
            }
            deltaWidth = (initialBounds.width - difx) / width; deltaHeight = (initialBounds.height - dify) / height;
            break;
        case 'ResizeSouthEast':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet) {
                if (initialBounds.width + difx > annotationMaxWidth) {
                    difx = annotationMaxWidth - initialBounds.width;
                }
                if (initialBounds.height + dify > annotationMaxHeight) {
                    dify = annotationMaxHeight - initialBounds.height;
                }
            }
            deltaHeight = (initialBounds.height + dify) / height; deltaWidth = (initialBounds.width + difx) / width;
            break;
        case 'ResizeSouthWest':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet) {
                if (initialBounds.width - difx > annotationMaxWidth) {
                    difx = annotationMaxWidth - initialBounds.width;
                }
                if (initialBounds.height + dify > annotationMaxHeight) {
                    dify = annotationMaxHeight - initialBounds.height;
                }
            }
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
    protected getPositions(corner: string, x: number, y: number): PointModel {
        switch (corner) {
        case 'ResizeEast':
            return { x: x, y: 0 };
        case 'ResizeSouthEast':
            return { x: x, y: y };
        case 'ResizeSouth':
            return { x: 0, y: y };
        case 'ResizeNorth':
            return { x: 0, y: -y };
        case 'ResizeNorthEast':
            return { x: x, y: -y };
        case 'ResizeNorthWest':
            return { x: -x, y: - y };
        case 'ResizeWest':
            return { x: -x, y: 0 };
        case 'ResizeSouthWest':
            return { x: -x, y: y };
        }
        return {x: x, y: y };
    }
}

/**
 * Helps to select the objects
 *
 * @hidden
 */
export class SelectTool extends ToolBase {
    private action: Actions;
    constructor(commandHandler: PdfViewer, base: PdfViewerBase) {
        super(commandHandler, base, true);
        //     this.action = action;
    }
    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.mouseEventHelper(args);
        super.mouseDown(args);
    }

    private mouseEventHelper(args: MouseEventArgs): void {
        if (this.commandHandler && this.commandHandler.annotationModule) {
            // eslint-disable-next-line
            this.commandHandler.annotationModule.overlappedCollections = findActiveElement(args as any, this.pdfViewerBase, this.commandHandler, true);
        }
        // eslint-disable-next-line
        let object: IElement = findActiveElement(args as any, this.pdfViewerBase, this.commandHandler);
       // if (!isNullOrUndefined(object) && (object as any).shapeAnnotationType != 'Path'){
        let isLock: boolean = false;
        // eslint-disable-next-line
        if (object && (object as any).shapeAnnotationType === 'StickyNotes') {
            // eslint-disable-next-line
            if ((object as any).annotationSettings && (object as any).annotationSettings.isLock) {
                if (this.commandHandler.annotationModule.checkAllowedInteractions('Select', object)) {
                    isLock = false;
                } else {
                    isLock = true;
                }
            }
        }
        if (!isLock) {
            // eslint-disable-next-line
            let currentSelctor: any;
            if ((args.source as PdfAnnotationBaseModel) && (args as PdfAnnotationBaseModel).annotationSelectorSettings !== null) {
                currentSelctor = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
            } else {
                currentSelctor = '';
            }
            if (this.commandHandler) {
                const selectedObject: SelectorModel = this.commandHandler.selectedItems;
                if (selectedObject) {
                    // eslint-disable-next-line
                    let annotation: any = selectedObject.annotations[0];
                    let formField : any =  selectedObject.formFields[0];
                    const currentSource: PdfAnnotationBaseModel = args.source as PdfAnnotationBaseModel;
                    if ((selectedObject.annotations.length) && args.info && !args.info.ctrlKey
                        // eslint-disable-next-line
                        && this.commandHandler.annotationModule && this.commandHandler.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === false) {
                        this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                        // eslint-disable-next-line max-len
                    } else if (args.info && args.info.ctrlKey && ((currentSource && currentSource.shapeAnnotationType === 'FreeText') || (this.commandHandler.selectedItems.annotations[0] && this.commandHandler.selectedItems.annotations[0].shapeAnnotationType === 'FreeText'))) {
                        this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    } else if( isNullOrUndefined(object) && this.commandHandler.formDesignerModule) {
                        this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    }
                    if (object) {
                        this.commandHandler.select([(object as PdfAnnotationBaseModel).id], currentSelctor);
                        this.commandHandler.viewerBase.isAnnotationMouseDown = true;
                        this.commandHandler.viewerBase.isFormFieldMouseDown = true;
                    }
                    if (selectedObject.annotations.length === 0 && annotation && annotation.shapeAnnotationType !== 'Stamp' && !annotation.formFieldAnnotationType) {
                        if (Browser.isDevice && !this.commandHandler.enableDesktopMode) {
                            this.commandHandler.toolbarModule.showToolbar(true);
                        }
                        this.commandHandler.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
                    }
                    if(selectedObject.formFields.length === 0 && this.commandHandler.formDesignerModule && formField && formField.formFieldAnnotationType) {
                        let field: IFormField = { value: (formField as any).value, fontFamily: formField.fontFamily, fontSize: formField.fontSize, fontStyle: (formField as any).fontStyle,
                            color: (formField as PdfFormFieldBaseModel).color, backgroundColor: (formField as PdfFormFieldBaseModel).backgroundColor, alignment: (formField as PdfFormFieldBaseModel).alignment, isReadonly: (formField as any).isReadOnly, visibility: (formField as any).visibility,
                            maxLength: (formField as any).maxLength,  isRequired: (formField as any).isRequired, isPrint: formField.isPrint, rotation: (formField as any).rotation, tooltip: (formField as any).tooltip, 
                            options: (formField as any).options, isChecked: (formField as any).isChecked, isSelected: (formField as any).isSelected };
                        this.commandHandler.fireFormFieldUnselectEvent("formFieldUnselect", field, formField.pageIndex);
                    }
                }
            }
        }
        // } else {
        //     if (!isNullOrUndefined(this.commandHandler))
        //         this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
        // }
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        //draw selected region
        return !this.blocked;
    }

    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        // eslint-disable-next-line
        this.mouseEventHelper(args);
        this.inAction = false;
        super.mouseUp(args);

    }

    /**
     * @param args
     * @private
     */
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
    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.offset = { x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY };
        this.startPosition = args.position;
        const nodeMouseDown: PdfAnnotationBaseModel = cloneObject(args.source);
        this.redoElement = {
            bounds: {
                x: nodeMouseDown.wrapper.offsetX, y: nodeMouseDown.wrapper.offsetY,
                width: nodeMouseDown.wrapper.actualSize.width, height: nodeMouseDown.wrapper.actualSize.height
            }
            // eslint-disable-next-line
        } as any;
        if (isLineShapes(nodeMouseDown)) {
            this.redoElement.vertexPoints = (nodeMouseDown as PdfAnnotationBaseModel).vertexPoints;
            this.redoElement.leaderHeight = (nodeMouseDown as PdfAnnotationBaseModel).leaderHeight;
        }
        this.inAction = true;
    }
    /**   @private  */
    /* eslint-disable */
    public mouseUp(args: any): void {
        let object: SelectorModel;
        if (this.commandHandler && args.source) {
            if (this.commandHandler.selectedItems && this.commandHandler.selectedItems.annotations && this.commandHandler.selectedItems.annotations.length > 0) {
                if (this.commandHandler.selectedItems.annotations[0].annotName === args.source.annotName) {
                    this.commandHandler.viewerBase.isAnnotationMouseMove = true;
                }
            } else {
                this.commandHandler.viewerBase.isAnnotationMouseMove = false;
            }
            if (this.commandHandler.selectedItems && this.commandHandler.selectedItems.formFields && this.commandHandler.selectedItems.formFields.length > 0) {
                if (this.commandHandler.selectedItems.formFields[0].name === args.source.name) {
                    this.commandHandler.viewerBase.isFormFieldMouseMove = true;
                }
            } else {
                this.commandHandler.viewerBase.isFormFieldMouseMove = false;
            }
            let currentSelctor:AnnotationSelectorSettingsModel=(args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            this.commandHandler.select([(args.source as PdfAnnotationBaseModel).id], currentSelctor);
            this.commandHandler.dragSelectedObjects(this.calculateMouseActionXDiff(args), this.calculateMouseActionYDiff(args), this.pdfViewerBase.activeElements.activePageID, currentSelctor , null);
            if(args.source && (args.source.formFieldAnnotationType === "Textbox" || args.source.formFieldAnnotationType === "Checkbox" 
            || args.source.formFieldAnnotationType === "RadioButton" || args.source.formFieldAnnotationType === "ListBox"
            || args.source.formFieldAnnotationType === "SignatureField" || args.source.formFieldAnnotationType === "InitialField" || args.source.formFieldAnnotationType === "DropdownList"
            || args.source.formFieldAnnotationType === "PasswordField")) {
             this.commandHandler.formDesignerModule.updateHTMLElement(args.source as PdfAnnotationBaseModel);
            }
            this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelctor);
            this.commandHandler.viewerBase.isAnnotationMouseMove = false;
            this.commandHandler.viewerBase.isFormFieldMouseMove = false;
            // eslint-disable-next-line
            let newShapeObject: any = {
                bounds: {
                    x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                    width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                }, modifiedDate: args.source.modifiedDate
            };
            if (isLineShapes(args.source)) {
                newShapeObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                newShapeObject.leaderHeight = (args.source as PdfAnnotationBaseModel).leaderHeight;
            }
            if (args.target && (args.target as PdfAnnotationBaseModel).formFieldAnnotationType) { 
                let node: PdfAnnotationBaseModel = args.target;
                let field: IFormField = {
                    value: (node as any).value, fontFamily: node.fontFamily, fontSize: node.fontSize, fontStyle: (node as any).fontStyle,
                    color: (node as PdfFormFieldBaseModel).color, backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor, borderColor: (node as PdfFormFieldBaseModel).borderColor,
                    thickness: (node as PdfFormFieldBaseModel).thickness, alignment: (node as PdfFormFieldBaseModel).alignment, isReadonly: (node as any).isReadonly, visibility: (node as any).visibility,
                    maxLength: (node as any).maxLength, isRequired: (node as any).isRequired, isPrint: node.isPrint, rotation: (node as any).rotateAngle, tooltip: (node as any).tooltip, options: (node as any).options,
                    isChecked: (node as any).isChecked, isSelected: (node as any).isSelected
                };
                let currentPosition: IFormFieldBound = { X: args.source.wrapper.offsetX, Y: args.source.wrapper.offsetY, Width: args.source.wrapper.actualSize.width, Height: args.source.wrapper.actualSize.height };
                let previousPosition: IFormFieldBound = { X: this.offset.x, Y: this.offset.y, Width: args.source.wrapper.actualSize.width, Height: args.source.wrapper.actualSize.height };
                this.commandHandler.fireFormFieldMoveEvent("formFieldMove", field, node.pageIndex, previousPosition, currentPosition);
            }
            if (this.commandHandler.annotation) {
            // eslint-disable-next-line
            this.commandHandler.annotation.addAction((this as any).pageIndex, null, args.source, 'Drag', '', this.redoElement as any, newShapeObject);
            this.commandHandler.annotation.stampAnnotationModule.updateSessionStorage(args.source, null, 'Drag');
            this.commandHandler.annotation.stickyNotesAnnotationModule.updateStickyNotes(args.source, null);
            }
        }
        super.mouseUp(args);
    }

    private calculateMouseXDiff(): number {
        if (this.currentPosition && this.startPosition) {
            return this.currentPosition.x - this.startPosition.x;
        } else {
            return 0;
        }
    }

    private calculateMouseYDiff(): number {
        if (this.currentPosition && this.startPosition) {
            return this.currentPosition.y - this.startPosition.y;
        } else {
            return 0;
        }
    }

    private calculateMouseActionXDiff(args: MouseEventArgs): number {
        let x: number = this.calculateMouseXDiff() / this.commandHandler.viewerBase.getZoomFactor();
        // let y: number = this.calculateMouseYDiff() / this.commandHandler.magnification.zoomFactor;
        if (this.offset) {
            let requiredX: number = this.offset.x + x;
            // let requiredY: number = this.offset.y + y;
            return requiredX - args.source.wrapper.offsetX;
            //let diffY: number = requiredY - args.source.wrapper.offsetY;
        } else {
            return 0;
        }
    }
    private calculateMouseActionYDiff(args: MouseEventArgs): number {
        // let x: number = this.calculateMouseXDiff() / this.commandHandler.magnification.zoomFactor;
        let y: number = this.calculateMouseYDiff() / this.commandHandler.viewerBase.getZoomFactor();
        if (this.offset) {
            // let requiredX: number = this.offset.x + x;
            let requiredY: number = this.offset.y + y;
            // let diffX: number = requiredX - args.source.wrapper.offsetX;
            return requiredY - args.source.wrapper.offsetY;
        } else {
            return 0;
        }
    }
    /**   @private  */
    /* eslint-disable */
    public mouseMove(args: MouseEventArgs, isStamp?: boolean, isSkip?: boolean): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            this.currentPosition = args.position;
            this.currentTarget = args.target;
            let currentSelctor:AnnotationSelectorSettingsModel=(args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
            let x: number = this.calculateMouseXDiff() / this.commandHandler.viewerBase.getZoomFactor();
            let y: number = this.calculateMouseYDiff() / this.commandHandler.viewerBase.getZoomFactor();
            let requiredX: number = this.offset.x + x;
            let requiredY: number = this.offset.y + y;
            let diffX: number = this.calculateMouseActionXDiff(args);
            let diffY: number = this.calculateMouseActionYDiff(args);
            if (!this.helper) {
                let selectedItem: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
                // eslint-disable-next-line
                let cobject: any = this.commandHandler.selectedItems.annotations.length > 0 ? cloneObject(this.commandHandler.selectedItems.annotations[0]) as PdfAnnotationBaseModel: 
                cloneObject(this.commandHandler.selectedItems.formFields[0]) as PdfFormFieldBaseModel;
                if (cobject.wrapper) {
                    diffX = requiredX - cobject.wrapper.offsetX;
                    diffY = requiredY - cobject.wrapper.offsetY;
                    cobject.bounds = this.commandHandler.selectedItems.annotations.length > 0 ? this.commandHandler.selectedItems.annotations[0].wrapper.bounds:
                    this.commandHandler.selectedItems.formFields[0].wrapper.bounds;
                }
                cobject.wrapper = undefined;
                cobject.id = 'diagram_helper';
                if (cobject.shapeAnnotationType === 'Stamp') {
                    cobject.strokeColor = '';
                    cobject.borderDashArray = '';
                    cobject.fillColor = 'transparent';
                    cobject.stampFillColor = 'transparent';
                    cobject.data = '';
                } else if (cobject.shapeAnnotationType === 'FreeText') {
                    cobject.strokeColor = 'blue';
                    cobject.fillColor = 'transparent';
                    cobject.thickness = 1;
                    cobject.opacity = 1;
                    cobject.dynamicText = '';
                } else {
                    cobject.strokeColor = 'red';
                    cobject.borderDashArray = '5,5';
                    cobject.fillColor = 'transparent';
                    cobject.thickness = 2;
                    cobject.opacity = 1;
                }
                if (cobject.enableShapeLabel === true) {
                    cobject.labelContent = '';
                }
                if (!isStamp) {
                    this.helper = cobject = this.commandHandler.add(cobject as PdfAnnotationBase);
                } else {
                    cobject = this.helper = args.source;
                }
                if(this.commandHandler.selectedItems.annotations.length > 0) {
                this.commandHandler.selectedItems.annotations = [cobject];
                } else {
                    this.commandHandler.selectedItems.formFields = [cobject];
                }
            } else {
                diffX = requiredX - this.helper.wrapper.offsetX;
                diffY = requiredY - this.helper.wrapper.offsetY;
            }
            if (this.helper && this.helper.shapeAnnotationType === 'Stamp') {
                isStamp = true;
            }
            // eslint-disable-next-line max-len
            if (this.commandHandler.checkBoundaryConstraints(diffX, diffY, this.pdfViewerBase.activeElements.activePageID, this.helper.wrapper.bounds, isStamp, isSkip)) {
                this.commandHandler.dragSelectedObjects(diffX, diffY, this.pdfViewerBase.activeElements.activePageID, currentSelctor, this.helper);
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
        let currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
        let requiredX: number = this.offset.x + this.calculateMouseXDiff();
        let requiredY: number = this.offset.y + this.calculateMouseYDiff();
        let diffX: number = requiredX - args.source.wrapper.offsetX;
        let diffY: number = requiredY - args.source.wrapper.offsetY;
        this.commandHandler.dragSelectedObjects(diffX, diffY, this.prevPageId, currentSelctor, null);
        this.commandHandler.renderSelector(this.prevPageId, currentSelctor);
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
    // eslint-disable-next-line
    public mouseDown(args: MouseEventArgs): any {
        super.mouseUp.call(this, args);
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        // eslint-disable-next-line
        let newObject: any;
        if (!this.inAction) {
            let pageIndex: number = this.pdfViewerBase.activeElements.activePageID;
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            // eslint-disable-next-line max-len
            let nodeElement: PdfAnnotationBaseModel = this.commandHandler.annotation.stampAnnotationModule.moveStampElement(args.position.x, args.position.y, pageIndex);
            newObject = this.commandHandler.add(nodeElement as PdfAnnotationBase);
            args.source = this.commandHandler.annotations[this.commandHandler.annotations.length - 1] as IElement;
            args.sourceWrapper = args.source.wrapper; this.inAction = true;
            // eslint-disable-next-line
            let currentSource: any = args.source;
            if (currentSource && (currentSource.shapeAnnotationType === 'HandWrittenSignature' ||currentSource.shapeAnnotationType === 'SignatureText' ||currentSource.shapeAnnotationType === 'SignatureImage')) {
                // eslint-disable-next-line max-len
                // eslint-disable-next-line
                this['offset'] = { x: args.source.wrapper.offsetX - (args.source.wrapper.bounds.width / 2), y: args.source.wrapper.offsetY - (args.source.wrapper.bounds.height / 2) };
            } else {
                // eslint-disable-next-line
                this['offset'] = { x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY };
            }
            this.startPosition = args.position;
            this.commandHandler.select([newObject.id]);
        }
        let currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
        super.mouseMove.call(this, args, true, true);
        this.commandHandler.renderSelector((args.source as PdfAnnotationBaseModel).pageIndex, currentSelctor);
        return this.inAction;
    }
}

/**
 * Draws a node that is defined by the user
 * @hidden
 */
export class InkDrawingTool extends ToolBase {
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
        this.pdfViewerBase.disableTextSelectionMode();
        super.mouseDown(args);
        this.inAction = true;
        // eslint-disable-next-line
        let node: any = { currentPosition: this.currentPosition, prevPosition: this.prevPosition };
        this.commandHandler.annotation.inkAnnotationModule.drawInkInCanvas(node, this.pdfViewerBase.activeElements.activePageID);
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            // eslint-disable-next-line
            let node: any = { currentPosition: this.currentPosition, prevPosition: this.pdfViewerBase.prevPosition };
            this.commandHandler.annotation.inkAnnotationModule.drawInkInCanvas(node, this.pdfViewerBase.activeElements.activePageID);
        }
        return this.inAction;
    }
    /**   @private  */
    public mouseUp(args: MouseEventArgs): boolean {
        this.commandHandler.annotation.inkAnnotationModule.storePathData();
        return true;
    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
      //  this.mouseUp(args);
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }
}

/**
 * Helps to edit the selected connectors
 * @hidden
 */
export class ConnectTool extends ToolBase {

    /**   @private  */
    public endPoint: string;

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
            // eslint-disable-next-line
        } as any;
        if (isLineShapes(nodeElement)) {
            this.redoElement.vertexPoints = (nodeElement as PdfAnnotationBaseModel).vertexPoints;
            this.redoElement.leaderHeight = (nodeElement as PdfAnnotationBaseModel).leaderHeight;
            // eslint-disable-next-line max-len
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
            if (node) {
                // eslint-disable-next-line
                let annotationSettings: any = this.commandHandler.annotationModule.findAnnotationSettings(node);
                let annotationMaxHeight: number = 0;
                let annotationMaxWidth: number  = 0;
                let annotationMinHeight: number = 0;
                let annotationMinWidth: number = 0;
                // eslint-disable-next-line max-len
                if (annotationSettings.minWidth ||  annotationSettings.maxWidth || annotationSettings.minHeight || annotationSettings.maxHeight) {
                    annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
                    annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
                    annotationMinHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
                    annotationMinWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
                }
                if (node.vertexPoints.length > 3) {
                    // eslint-disable-next-line
                    let sizeObject: any = this.commandHandler.viewerBase.checkAnnotationWidth(node.vertexPoints);
                    let width: number = sizeObject.width;
                    let height: number = sizeObject.height;
                    if (annotationMinHeight || annotationMinWidth || annotationMaxHeight || annotationMaxWidth) {
                        // eslint-disable-next-line max-len
                        if ((height > annotationMinHeight && height < annotationMaxHeight) || (width > annotationMinWidth && width < annotationMaxWidth)) {
                            // eslint-disable-next-line max-len
                            this.commandHandler.nodePropertyChange(this.prevSource, { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                        }
                    } else {
                        // eslint-disable-next-line max-len
                        this.commandHandler.nodePropertyChange(this.prevSource, { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                    }
                } else {
                    if (annotationMinHeight || annotationMinWidth || annotationMaxHeight || annotationMaxWidth) {
                        if (node.shapeAnnotationType === 'Line' || 'Distance' || 'LineWidthArrowHead') {
                            let x: number = 0;
                            let y: number = 0;
                            if (node.vertexPoints[0].x > node.vertexPoints[1].x) {
                                x = node.vertexPoints[0].x - node.vertexPoints[1].x;
                            } else {
                                x = node.vertexPoints[1].x - node.vertexPoints[0].x;
                            }
                            if (node.vertexPoints[0].y > node.vertexPoints[1].y) {
                                y = node.vertexPoints[0].y - node.vertexPoints[1].y;
                            } else {
                                y = node.vertexPoints[1].y - node.vertexPoints[0].y;
                            }
                            let diff: number = (x > y) ? x : y;
                            if (diff < (annotationMaxHeight || annotationMaxWidth) && diff > (annotationMinHeight || annotationMinWidth)) {
                                // eslint-disable-next-line max-len
                                this.commandHandler.nodePropertyChange(this.prevSource, { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                            }
                        } else {
                            // eslint-disable-next-line max-len
                            this.commandHandler.nodePropertyChange(this.prevSource, { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                        }
                    } else {
                        // eslint-disable-next-line max-len
                        this.commandHandler.nodePropertyChange(this.prevSource, { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                    }
                }
                let currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
                this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                this.commandHandler.select([this.prevSource.id], currentSelctor);
                this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelctor);
                // eslint-disable-next-line
                let newShapeElementObject: any = {
                    bounds: {
                        x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                        width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                    }
                };
                // eslint-disable-next-line max-len
                if (node.measureType === 'Distance' || node.measureType === 'Perimeter' || node.measureType === 'Area' || node.measureType === 'Volume') {
                    this.commandHandler.annotation.updateCalibrateValues(this.commandHandler.selectedItems.annotations[0]);
                    newShapeElementObject.notes = (args.source as PdfAnnotationBaseModel).notes;
                }
                if (isLineShapes(args.source)) {
                    newShapeElementObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                    newShapeElementObject.leaderHeight = (args.source as PdfAnnotationBaseModel).leaderHeight;
                }
                // eslint-disable-next-line
                this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.prevSource, 'Resize', '', this.redoElement as any, newShapeElementObject);
            }
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
                    // eslint-disable-next-line
                    let cloneShapebject: any = cloneObject(this.commandHandler.selectedItems.annotations[0]) as PdfAnnotationBaseModel;
                    cloneShapebject.id = 'diagram_helper';
                    cloneShapebject.strokeColor = 'red';
                    cloneShapebject.borderDashArray = '5,5';
                    cloneShapebject.fillColor = 'transparent';
                    cloneShapebject.thickness = 2;
                    cloneShapebject.opacity = 1;
                    if (cloneShapebject.enableShapeLabel === true) {
                        cloneShapebject.labelContent = '';
                    }
                    this.helper = cloneShapebject = this.commandHandler.add(cloneShapebject as PdfAnnotationBase);
                    this.commandHandler.selectedItems.annotations = [cloneShapebject];
                }
                let currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
                this.blocked = !this.commandHandler.dragConnectorEnds(
                    this.endPoint, this.helper as IElement, this.currentPosition, this.selectedSegment, args.target, null, currentSelctor);
                this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelctor);
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
            // eslint-disable-next-line
        } as any;
        if (isLineShapes(node)) {
            this.redoElement.vertexPoints = (node as PdfAnnotationBaseModel).vertexPoints;
            this.redoElement.leaderHeight = (node as PdfAnnotationBaseModel).leaderHeight;

        }
        if (node.measureType === 'Radius') {
            this.redoElement.notes = (node as PdfAnnotationBaseModel).notes;
        }
        this.prevSource = this.commandHandler.selectedItems.annotations.length >0 ? this.commandHandler.selectedItems.annotations[0]:
        this.commandHandler.selectedItems.formFields[0];
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs, isPreventHistory?: boolean): boolean {
        let object: PdfAnnotationBaseModel | SelectorModel;
        object = args.source as PdfAnnotationBaseModel | Selector;
        if (this.commandHandler && this.prevSource) {
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            this.commandHandler.viewerBase.isAnnotationSelect = true;
            this.commandHandler.viewerBase.isFormFieldSelect = true;
            this.commandHandler.select([this.prevSource.id], this.prevSource.annotationSelectorSettings);
            // eslint-disable-next-line max-len
            let deltaValues: Rect = this.updateSize(this.prevSource, this.currentPosition, this.initialPosition, this.corner, this.initialBounds, null, true);
            this.blocked = this.scaleObjects(
                deltaValues.width, deltaValues.height, this.corner, this.currentPosition, this.initialPosition, this.prevSource);
            if (this.commandHandler.selectedItems && this.commandHandler.selectedItems.annotations &&
                // eslint-disable-next-line max-len
                this.commandHandler.selectedItems.annotations[0] && this.commandHandler.selectedItems.annotations[0].shapeAnnotationType === 'Stamp') {
                if (this.commandHandler.stampSettings.minHeight || this.commandHandler.stampSettings.minWidth) {
                    this.commandHandler.select([this.prevSource.id], this.prevSource.annotationSelectorSettings);
                }
            }
            if(this.commandHandler.selectedItems.formFields.length > 0 && (this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'Textbox' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'Checkbox'
              || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'RadioButton' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === "InitialField" || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === "SignatureField"
              || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'DropdownList' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'ListBox' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'PasswordField')) {
                this.commandHandler.formDesignerModule.updateHTMLElement(this.commandHandler.selectedItems.formFields[0]); 
            }
            this.commandHandler.renderSelector(this.prevPageId, this.prevSource.annotationSelectorSettings);
            if (this.commandHandler.annotation && args.source.wrapper) {
                // eslint-disable-next-line
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
                if (this.prevSource.shapeAnnotationType === 'SignatureText') {
                    newObject.fontSize = newObject.bounds.height / 2;
                    if (args.target != null) {
                        (args.target as PdfAnnotationBaseModel).fontSize = newObject.bounds.height / 2;
                        ((args.target as PdfAnnotationBaseModel).wrapper.children[1] as any).style.fontSize = newObject.fontSize;
                        (args.target as PdfAnnotationBaseModel).wrapper.children[1].horizontalAlignment = 'Center';
                        (args.target as PdfAnnotationBaseModel).wrapper.children[1].verticalAlignment = 'Center';
                        (args.target as PdfAnnotationBaseModel).wrapper.children[1].setOffsetWithRespectToBounds(0, 0, 'Absolute');
                        (this.commandHandler.selectedItems.annotations[0].wrapper.children[1] as any).style.fontSize = newObject.fontSize;
                        this.commandHandler.selectedItems.annotations[0].wrapper.children[1].horizontalAlignment = 'Center';
                        this.commandHandler.selectedItems.annotations[0].wrapper.children[1].verticalAlignment = 'Center';
                        this.commandHandler.selectedItems.annotations[0].wrapper.children[1].setOffsetWithRespectToBounds(0, 0, 'Absolute');
                        this.commandHandler.selectedItems.annotations[0].fontSize = newObject.bounds.height / 2;
                    }
                }
                // eslint-disable-next-line
                if ((this.prevSource.shapeAnnotationType === 'SignatureText') && this.commandHandler.selectedItems.annotations && this.commandHandler.selectedItems.annotations.length > 0) {
                    this.commandHandler.nodePropertyChange(this.commandHandler.selectedItems.annotations[0], { fontSize: newObject.bounds.height / 2 });
                }

                // eslint-disable-next-line
                this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.prevSource, 'Resize', '', this.redoElement as any, newObject);
            }
            if(args.target && (args.target as PdfAnnotationBaseModel).formFieldAnnotationType) { 
                let node: PdfAnnotationBaseModel = args.target;
                let field: IFormField = { value: (node as any).value, fontFamily: node.fontFamily, fontSize: node.fontSize, fontStyle: (node as any).fontStyle,
                    color: (node as PdfFormFieldBaseModel).color, backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor, alignment: (node as PdfFormFieldBaseModel).alignment, isReadonly: (node as any).isReadonly, visibility: (node as any).visibility,
                    maxLength: (node as any).maxLength,  isRequired: (node as any).isRequired, isPrint: node.isPrint, rotation: (node as any).rotateAngle, tooltip: (node as any).tooltip, 
                    options: (node as any).options, isChecked: (node as any).isChecked, isSelected: (node as any).isSelected }; 
                let currentPosition: IFormFieldBound = { X: args.source.wrapper.offsetX, Y: args.source.wrapper.offsetY, Width: args.source.wrapper.actualSize.width, Height: args.source.wrapper.actualSize.height };
                let previousPosition: IFormFieldBound = { X: this.initialBounds.x, Y: this.initialBounds.y, Width: this.initialBounds.width, Height: this.initialBounds.height };
                this.commandHandler.fireFormFieldResizeEvent("formFieldResize", field, node.pageIndex, previousPosition, currentPosition);
            }
            if (this.commandHandler.annotation && this.commandHandler.annotation.stampAnnotationModule) {
              this.commandHandler.annotation.stampAnnotationModule.updateSessionStorage(args.source, this.prevSource.id, 'Resize');
            }
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
        // eslint-disable-next-line
        let annotationElement : any = args.source;
        // eslint-disable-next-line
        let size: any = this.getPoints(x, y);
        let width: number = annotationElement.width + size.x;
        let height: number = annotationElement.height + size.y;
        // eslint-disable-next-line
        let obj: any = object;
        if (object && (object as SelectorModel | Selector).annotations) {
            // eslint-disable-next-line
            obj = (object as any).annotations[0];
        }
        // eslint-disable-next-line
        let annotationSettings: any = this.commandHandler.annotationModule ? this.commandHandler.annotationModule.findAnnotationSettings(obj): {};
        let annotationMaxHeight: number = 0;
        let annotationMaxWidth: number  = 0;
        let annotationMinHeight: number = 0;
        let annotationMinWidth: number = 0;
        if (annotationSettings.minWidth ||  annotationSettings.maxWidth || annotationSettings.minHeight || annotationSettings.maxHeight) {
            annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
            annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            annotationMinHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
            annotationMinWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
        }
        if (annotationMinHeight || annotationMinWidth || annotationMaxHeight || annotationMaxWidth) {
            // eslint-disable-next-line max-len
            if ((height >= annotationMinHeight && height <= annotationMaxHeight) && (width >= annotationMinWidth && width <= annotationMaxWidth)) {
                x = x;
                y = y;
            } else {
                if (height < annotationMinHeight || height > annotationMaxHeight) {
                    if (height < annotationMinHeight) {
                        y = annotationMinHeight - annotationElement.height;
                    } else {
                        y = annotationMaxHeight - annotationElement.height;
                    }
                }
                if (width < annotationMinWidth || width > annotationMaxWidth) {
                    if (width < annotationMinWidth) {
                        x = annotationMinWidth - annotationElement.width;
                    } else {
                        x = annotationMaxWidth - annotationElement.width;
                    }
                }
            }
        }
        let changes: PointModel = { x: x, y: y };
        if (this.currentElement.wrapper) {
            changes = rotatePoint(-this.currentElement.wrapper.rotateAngle, undefined, undefined, changes);
            let sx: number = (this.currentElement.wrapper.actualSize.width + changes.x) / this.currentElement.wrapper.actualSize.width;
            let sy: number = (this.currentElement.wrapper.actualSize.height + changes.y) / this.currentElement.wrapper.actualSize.height;
        }
        changes = this.getChanges(changes);
        if (!this.helper) {
            // eslint-disable-next-line
            let cobject: any = this.commandHandler.selectedItems.annotations.length > 0 ? cloneObject(this.commandHandler.selectedItems.annotations[0]) as PdfAnnotationBaseModel:
            cloneObject(this.commandHandler.selectedItems.formFields[0]) as PdfFormFieldBaseModel;
            cobject.id = 'diagram_helper';
            if (cobject.shapeAnnotationType === 'Stamp') {
                cobject.strokeColor = '';
                cobject.borderDashArray = '';
                cobject.fillColor = 'transparent';
                cobject.stampFillColor = 'transparent';
                cobject.data = '';
            } else if (cobject.shapeAnnotationType === 'FreeText') {
                cobject.strokeColor = 'blue';
                cobject.fillColor = 'transparent';
                cobject.thickness = 1;
                cobject.opacity = 1;
                cobject.dynamicText = '';
            } else {
                cobject.bounds = this.commandHandler.selectedItems.annotations.length > 0 ?this.commandHandler.selectedItems.annotations[0].wrapper.bounds:
                    this.commandHandler.selectedItems.formFields[0].wrapper.bounds;
                cobject.strokeColor = 'red';
                cobject.borderDashArray = '5,5';
                cobject.fillColor = 'transparent';
                cobject.thickness = 2;
                cobject.opacity = 1;
            }
            if (cobject.enableShapeLabel === true) {
                cobject.labelContent = '';
            }
            if (cobject.shapeAnnotationType === 'SignatureText') {
                cobject.fontSize = cobject.bounds.height / 2;
            }
            this.helper = cobject = this.commandHandler.add(cobject as PdfAnnotationBase);
            if(this.commandHandler.selectedItems.annotations.length > 0) {
            this.commandHandler.selectedItems.annotations = [cobject];
            } else {
                this.commandHandler.selectedItems.formFields = [cobject];
            }
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
        // eslint-disable-next-line max-len
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
    private getPoints(x: number, y: number): PointModel {
        switch (this.corner) {
            case 'ResizeEast':
                return { x: x, y: 0 };
            case 'ResizeSouthEast':
                return { x: x, y: y };
            case 'ResizeSouth':
                return { x: 0, y: y };
            case 'ResizeNorth':
                return { x: 0, y: -y };
            case 'ResizeNorthEast':
                return { x: x, y: -y };
            case 'ResizeNorthWest':
                return { x: -x, y: - y };
            case 'ResizeWest':
                return { x: -x, y: 0 };
            case 'ResizeSouthWest':
                return { x: -x, y: y };
        }
        return {x: x, y: y };
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
        // eslint-disable-next-line
        let annotationSettings: any = this.commandHandler.annotationModule? this.commandHandler.annotationModule.findAnnotationSettings(source): {};
        let annotationMaxHeight: number = 0;
        let annotationMaxWidth: number = 0;
        let annotationMinHeight: number = 0;
        let annotationMinWidth: number = 0;
        let x: number = this.currentPosition.x - this.startPosition.x;
        let y: number = this.currentPosition.y - this.startPosition.y;
        x = x / this.commandHandler.viewerBase.getZoomFactor();
        y = y / this.commandHandler.viewerBase.getZoomFactor();
        // eslint-disable-next-line
        let annotationElement : any = source;
        // eslint-disable-next-line
        let size: any = this.getPoints(x, y);
        let width: number = annotationElement.bounds.width + size.x;
        let height: number = annotationElement.bounds.height + size.y;
        if (annotationSettings.minWidth || annotationSettings.maxWidth || annotationSettings.minHeight || annotationSettings.maxHeight) {
            annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
            annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            annotationMinHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
            annotationMinWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
        }
        if (source instanceof Selector && source.annotations.length === 1 &&
            // eslint-disable-next-line max-len
            (source.annotations[0].shapeAnnotationType === 'Perimeter' || source.annotations[0].shapeAnnotationType === 'Radius' || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'Stamp')) {
            if (!(deltaHeight === 1 && deltaWidth === 1)) {
                deltaHeight = deltaWidth = Math.max(deltaHeight === 1 ? 0 : deltaHeight, deltaWidth === 1 ? 0 : deltaWidth);
            } else if (startPoint !== endPoint) {
                deltaHeight = deltaWidth = Math.max(deltaHeight, deltaWidth);
            } else {
                deltaHeight = deltaWidth = 0;
            }
            // eslint-disable-next-line max-len
        } else if ((source as PdfAnnotationBaseModel).shapeAnnotationType === 'Image' || ((source as PdfAnnotationBaseModel).shapeAnnotationType === 'HandWrittenSignature'||(source as PdfAnnotationBaseModel).shapeAnnotationType === 'SignatureText'||(source as PdfAnnotationBaseModel).shapeAnnotationType === 'SignatureImage')) {
            if (!(deltaHeight === 1 && deltaWidth === 1)) {
                if (width >= annotationMaxWidth && height < annotationMaxHeight) {
                    deltaHeight = Math.max(deltaHeight, deltaWidth);
                }
                if (height >= annotationMaxHeight && width < annotationMaxWidth) {
                    deltaWidth = Math.max(deltaHeight, deltaWidth);
                }
                if (width < annotationMaxWidth && height < annotationMaxHeight) {
                    deltaHeight = deltaWidth = Math.max(deltaHeight, deltaWidth);
                }
            }
        } else {
            // eslint-disable-next-line max-len
            if ((source as PdfAnnotationBaseModel).shapeAnnotationType === 'Perimeter' || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'Radius'
                || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'Stamp') {
                if (!annotationMaxHeight || !annotationMaxWidth) {
                    if (!(deltaHeight === 1 && deltaWidth === 1)) {
                        deltaHeight = deltaWidth = Math.max(deltaHeight === 1 ? 0 : deltaHeight, deltaWidth === 1 ? 0 : deltaWidth);
                    }
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
    /** @private */
    public isFormDesign:boolean;

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
        this.sourceObject.enableShapeLabel = this.commandHandler.enableShapeLabel;
        this.pdfViewerBase.updateFreeTextProperties(this.sourceObject);
        this.isFormDesign=false;
        let formFieldElement = document.getElementById("FormField_helper_html_element");
        if(formFieldElement) {
            formFieldElement.remove();
        }
        // eslint-disable-next-line
        this.commandHandler.drawingObject = this.drawingObject = this.commandHandler.add(this.sourceObject || node as any) as PdfAnnotationBaseModel;
        if (this.drawingObject.formFieldAnnotationType === "Textbox" || this.drawingObject.formFieldAnnotationType === "SignatureField" || this.drawingObject.formFieldAnnotationType === "InitialField" ||
        this.drawingObject.formFieldAnnotationType === "Checkbox" || this.drawingObject.formFieldAnnotationType === "ListBox" || this.drawingObject.formFieldAnnotationType === "RadioButton" ||
        this.drawingObject.formFieldAnnotationType === "DropdownList" || this.drawingObject.formFieldAnnotationType === "PasswordField") {
        this.inAction = false;
        (this.drawingObject as any).pageNumber = this.pdfViewerBase.currentPageNumber;
        let bounds =this.commandHandler.formDesignerModule.updateFormFieldInitialSize(this.drawingObject.wrapper.children[0], this.drawingObject.formFieldAnnotationType);
        let pageWidth = this.pdfViewerBase.pageContainer.firstElementChild.clientWidth - bounds.width;
        let pageHeight = this.pdfViewerBase.pageContainer.firstElementChild.clientHeight - bounds.height;
        let left =  (this.pdfViewerBase.pageContainer.firstElementChild as any).offsetLeft;
        let offsetX: number; 
        if (this.currentPosition.y >= pageHeight && event.target && (event.target as any).parentElement && (event.target as any).parentElement.classList.contains("foreign-object")) {
            var targetParentRect = (event as any).path[3].getBoundingClientRect();
            offsetX = (event as any).clientX - targetParentRect.left; 
        } else {
            offsetX = this.currentPosition.x - left; 
        }
        let rect: any;
        if(this.currentPosition.x >= pageWidth && this.currentPosition.y >= pageHeight) {
            rect = { x: pageWidth, y: pageHeight, width: this.drawingObject.wrapper.children[0].width, height: this.drawingObject.wrapper.children[0].height }; 
        } else if (this.currentPosition.x >= pageWidth) {
            rect = { x: pageWidth, y: this.currentPosition.y, width: this.drawingObject.wrapper.children[0].width, height: this.drawingObject.wrapper.children[0].height };
        } else if(this.currentPosition.y >= pageHeight) {
            rect = { x: offsetX, y: pageHeight, width: this.drawingObject.wrapper.children[0].width, height: this.drawingObject.wrapper.children[0].height }; 
        } else {
            rect = { x: this.currentPosition.x, y: this.currentPosition.y, width: this.drawingObject.wrapper.children[0].width, height: this.drawingObject.wrapper.children[0].height };
        }
        this.updateNodeDimension(this.drawingObject, rect);
        this.commandHandler.formDesignerModule.drawHTMLContent(this.drawingObject.formFieldAnnotationType, this.drawingObject.wrapper.children[0] as DiagramHtmlElement, this.drawingObject, this.drawingObject.pageIndex, this.commandHandler);
        this.commandHandler.select([this.commandHandler.drawingObject.id], this.commandHandler.annotationSelectorSettings);
        this.commandHandler.formFieldCollection.push(this.drawingObject);
        let formField: FormFieldModel = {id: this.drawingObject.id, name: (this.drawingObject as PdfFormFieldBaseModel).name, value: (this.drawingObject as PdfFormFieldBaseModel).value,
            type: this.drawingObject.formFieldAnnotationType as FormFieldType, isReadOnly: this.drawingObject.isReadonly, fontFamily: this.drawingObject.fontFamily,
            fontSize: this.drawingObject.fontSize, fontStyle: this.drawingObject.fontStyle as unknown as FontStyle, color: (this.drawingObject as PdfFormFieldBaseModel).color, backgroundColor: (this.drawingObject as PdfFormFieldBaseModel).backgroundColor,
            alignment: (this.drawingObject as PdfFormFieldBaseModel).alignment as TextAlign, visibility: (this.drawingObject as PdfFormFieldBaseModel).visibility, maxLength: (this.drawingObject as PdfFormFieldBaseModel).maxLength, isRequired: (this.drawingObject as PdfFormFieldBaseModel).isRequired,
            isPrint: this.drawingObject.isPrint, isSelected: (this.drawingObject as PdfFormFieldBaseModel).isSelected, isChecked: (this.drawingObject as PdfFormFieldBaseModel).isChecked, tooltip:  (this.drawingObject as PdfFormFieldBaseModel).tooltip, bounds: this.drawingObject.bounds as IFormFieldBound, thickness: this.drawingObject.thickness, borderColor: (this.drawingObject as PdfFormFieldBaseModel).borderColor,
            signatureIndicatorSettings: (this.drawingObject as PdfFormFieldBaseModel).signatureIndicatorSettings };
        this.commandHandler.formFieldCollections.push(formField);
        this.commandHandler.annotation.addAction(this.pdfViewerBase.currentPageNumber, null, this.drawingObject, 'Addition', '', this.drawingObject, this.drawingObject);
        this.endAction();
        this.pdfViewerBase.tool = null;
        this.pdfViewerBase.action = "Select";
        this.drawingObject = null;
        this.pdfViewerBase.isMouseDown = false;
        this.pdfViewerBase.pdfViewer.drawingObject = null;
        this.isFormDesign=true;
      }
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
            this.commandHandler.select([this.drawingObject.id], this.commandHandler.annotationSelectorSettings);
            this.commandHandler.annotation.updateCalibrateValues(this.drawingObject, true);
            if (this.commandHandler &&!this.isFormDesign) {
                // eslint-disable-next-line
                this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.drawingObject, 'Addition', '', this.drawingObject as any, this.drawingObject);
            }
            this.drawingObject = null;
            this.dragging = false;
            super.mouseUp(args);
            this.inAction = false;
        } else  { 
            super.mouseUp(args); 
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
        // eslint-disable-next-line
        let annotationSettings: any = this.commandHandler.annotationModule? this.commandHandler.annotationModule.findAnnotationSettings(obj): {};
        let annotationMaxHeight: number = 0;
        let annotationMaxWidth: number  = 0;
        if (annotationSettings.maxWidth || annotationSettings.maxHeight) {
            annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
            annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            if (obj.bounds.width > annotationMaxWidth) {
                obj.bounds.width = annotationMaxWidth;
            }
            if (obj.bounds.height > annotationMaxHeight) {
                obj.bounds.height = annotationMaxHeight;
            }
            // eslint-disable-next-line max-len
            if (obj.bounds.height <= annotationMaxHeight && obj.bounds.width <= annotationMaxWidth) {
                this.commandHandler.nodePropertyChange(obj, { bounds: obj.bounds });
            }
        } else {
            this.commandHandler.nodePropertyChange(obj, { bounds: obj.bounds });
        }
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
        // eslint-disable-next-line
        let annotationSettings: any = this.commandHandler.annotationModule.findAnnotationSettings(node);
        let annotationMaxWidth: number = 0;
        if (annotationSettings.maxWidth) {
            annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            if (node.bounds.width > annotationMaxWidth) {
                node.bounds.width = annotationMaxWidth;
                obj.width = node.bounds.width / 2;
            }
        }
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
                    // eslint-disable-next-line max-len
                }, vertexPoints: [{ x: this.startPoint.x / this.pdfViewerBase.getZoomFactor(), y: this.startPoint.y / this.pdfViewerBase.getZoomFactor() }, { x: this.currentPosition.x / this.pdfViewerBase.getZoomFactor(), y: this.currentPosition.y / this.pdfViewerBase.getZoomFactor() }],
                shapeAnnotationType: 'Line', fillColor: this.commandHandler.drawingObject.fillColor,
                strokeColor: this.commandHandler.drawingObject.strokeColor, pageIndex: this.pdfViewerBase.activeElements.activePageID,
                // eslint-disable-next-line max-len
                notes: this.commandHandler.drawingObject.notes, thickness: this.commandHandler.drawingObject.thickness, author: this.commandHandler.drawingObject.author,
                subject: this.commandHandler.drawingObject.subject, borderDashArray: this.commandHandler.drawingObject.borderDashArray,
                modifiedDate: this.commandHandler.drawingObject.modifiedDate, borderStyle: this.commandHandler.drawingObject.borderStyle,
                // eslint-disable-next-line max-len
                measureType: this.commandHandler.drawingObject.measureType, enableShapeLabel: this.commandHandler.enableShapeLabel, opacity: this.commandHandler.drawingObject.opacity
            };
            this.pdfViewerBase.updateFreeTextProperties(nodeAnnotElement);
            // eslint-disable-next-line
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
                obj.vertexPoints[obj.vertexPoints.length - 1].x = this.currentPosition.x / this.pdfViewerBase.getZoomFactor();
                obj.vertexPoints[obj.vertexPoints.length - 1].y = this.currentPosition.y / this.pdfViewerBase.getZoomFactor();
                this.commandHandler.nodePropertyChange(obj, { vertexPoints: obj.vertexPoints });
            }
            if (obj.measureType === 'Perimeter') {
                updatePerimeterLabel(obj, obj.vertexPoints, this.commandHandler.annotation.measureAnnotationModule);
            }
        }
        return true;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs, isDoubleClineck?: boolean, isMouseLeave?: boolean): void {
        super.mouseMove(args);
        // eslint-disable-next-line
        let currentSelector: any;
        if ((args.source as PdfAnnotationBaseModel) && (args as PdfAnnotationBaseModel).annotationSelectorSettings !== null) {
        currentSelector = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
        }
        if (this.drawingObject) {
            // eslint-disable-next-line max-len
            let bounds: Rect = new Rect(this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length - 1].x - 20, this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length - 1].y - 20, 40, 40);
            let point: PointModel = { x: this.drawingObject.vertexPoints[0].x, y: this.drawingObject.vertexPoints[0].y };
            if ((bounds.containsPoint(point) || isDoubleClineck) && this.dragging) {
                if (this.inAction) {
                    this.inAction = false;
                    if (this.drawingObject) {
                        if (!isMouseLeave) {
                            if (this.drawingObject.vertexPoints.length > 2) {
                                this.drawingObject.vertexPoints.splice(this.drawingObject.vertexPoints.length - 1, 1);
                            }
                        }
                        if (this.action === 'Polygon') {
                            if (!isMouseLeave) {
                                // eslint-disable-next-line max-len
                                this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length - 1] = this.drawingObject.vertexPoints[0];
                            } else {
                                // eslint-disable-next-line max-len
                                this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length] = this.drawingObject.vertexPoints[0];
                            }
                            this.commandHandler.nodePropertyChange(this.drawingObject, { vertexPoints: this.drawingObject.vertexPoints });
                            let cobject: PdfAnnotationBase = cloneObject(this.drawingObject) as PdfAnnotationBase;
                            cobject.shapeAnnotationType = 'Polygon';
                            cobject.bounds.width = cobject.wrapper.actualSize.width;
                            cobject.bounds.height = cobject.wrapper.actualSize.height;
                            cobject.bounds.x = this.drawingObject.wrapper.bounds.x;
                            cobject.bounds.y = this.drawingObject.wrapper.bounds.y;
                            this.commandHandler.add(cobject);
                            this.commandHandler.remove(this.drawingObject);
                            this.commandHandler.select([cobject.id], currentSelector);
                            let drawingObject: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
                            if (drawingObject) {
                                // eslint-disable-next-line max-len
                                if (this.commandHandler.enableShapeAnnotation && (isNullOrUndefined(drawingObject.measureType) || drawingObject.measureType === '')) {
                                    this.commandHandler.annotation.shapeAnnotationModule.renderShapeAnnotations(drawingObject, drawingObject.pageIndex);
                                }
                                // eslint-disable-next-line max-len
                                if (this.commandHandler.enableMeasureAnnotation && (drawingObject.measureType === 'Area' || drawingObject.measureType === 'Volume')) {
                                    if (drawingObject.measureType === 'Area') {
                                        // eslint-disable-next-line max-len
                                        drawingObject.notes = this.commandHandler.annotation.measureAnnotationModule.calculateArea(drawingObject.vertexPoints);
                                        this.commandHandler.annotation.stickyNotesAnnotationModule.addTextToComments(drawingObject.annotName, drawingObject.notes);
                                    } else if (drawingObject.measureType === 'Volume') {
                                        // eslint-disable-next-line max-len
                                        drawingObject.notes = this.commandHandler.annotation.measureAnnotationModule.calculateVolume(drawingObject.vertexPoints);
                                        this.commandHandler.annotation.stickyNotesAnnotationModule.addTextToComments(drawingObject.annotName, drawingObject.notes);
                                    }
                                    if (drawingObject.enableShapeLabel) {
                                        drawingObject.labelContent = drawingObject.notes;
                                        // eslint-disable-next-line max-len
                                        this.commandHandler.nodePropertyChange(drawingObject, { vertexPoints: drawingObject.vertexPoints, notes: drawingObject.notes });
                                    }
                                    // eslint-disable-next-line max-len
                                    this.commandHandler.annotation.measureAnnotationModule.renderMeasureShapeAnnotations(drawingObject, drawingObject.pageIndex);
                                }
                            }
                        } else {
                            if (!isMouseLeave) {
                                if (isDoubleClineck) {
                                    this.drawingObject.vertexPoints.splice(this.drawingObject.vertexPoints.length - 1, 1);
                                }
                            }
                            this.commandHandler.nodePropertyChange(this.drawingObject, {
                                // eslint-disable-next-line max-len
                                vertexPoints: this.drawingObject.vertexPoints, sourceDecoraterShapes: this.commandHandler.drawingObject.sourceDecoraterShapes,
                                taregetDecoraterShapes: this.commandHandler.drawingObject.taregetDecoraterShapes
                            });
                            this.commandHandler.select([this.drawingObject.id], currentSelector);
                            if (this.commandHandler.enableMeasureAnnotation && this.drawingObject.measureType === 'Perimeter') {
                                this.commandHandler.renderDrawing(null, this.drawingObject.pageIndex);
                                // eslint-disable-next-line max-len
                                this.drawingObject.notes = this.commandHandler.annotation.measureAnnotationModule.calculatePerimeter(this.drawingObject);
                                if (this.drawingObject.enableShapeLabel) {
                                    this.drawingObject.labelContent = this.drawingObject.notes;
                                    // eslint-disable-next-line max-len
                                    this.commandHandler.nodePropertyChange(this.drawingObject, { vertexPoints: this.drawingObject.vertexPoints, notes: this.drawingObject.notes });
                                }
                                // eslint-disable-next-line max-len
                                this.commandHandler.annotation.stickyNotesAnnotationModule.addTextToComments(this.drawingObject.annotName, this.drawingObject.notes);
                                // eslint-disable-next-line max-len
                                this.commandHandler.annotation.measureAnnotationModule.renderMeasureShapeAnnotations(this.drawingObject, this.drawingObject.pageIndex);
                            }

                        }
                        let annotationObject: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
                        // eslint-disable-next-line
                        this.commandHandler.annotation.addAction((this as any).pageIndex, null, annotationObject, 'Addition', '', annotationObject as any, annotationObject);
                        this.drawingObject = null;
                    }
                }
                this.endAction();
            } else if (this.inAction && !this.dragging) {
                this.commandHandler.remove(this.drawingObject);
            }
        }
    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args, true, true);
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
                // eslint-disable-next-line max-len
                vertexPoints: [{ x: this.startPosition.x / this.pdfViewerBase.getZoomFactor(), y: this.startPosition.y / this.pdfViewerBase.getZoomFactor() }, { x: this.currentPosition.x / this.pdfViewerBase.getZoomFactor(), y: this.currentPosition.y / this.pdfViewerBase.getZoomFactor() }],
                bounds: {
                    x: this.currentPosition.x,
                    y: this.currentPosition.y, width: 5, height: 5
                }, sourceDecoraterShapes: this.commandHandler.drawingObject.sourceDecoraterShapes,
                taregetDecoraterShapes: this.commandHandler.drawingObject.taregetDecoraterShapes, measureType: 'Distance',
                // eslint-disable-next-line max-len
                fillColor: this.commandHandler.drawingObject.fillColor, notes: this.commandHandler.drawingObject.notes, strokeColor: this.commandHandler.drawingObject.strokeColor,
                opacity: this.commandHandler.drawingObject.opacity, thickness: this.commandHandler.drawingObject.thickness, borderDashArray: this.commandHandler.drawingObject.borderDashArray,
                // eslint-disable-next-line max-len
                shapeAnnotationType: 'Distance', pageIndex: this.pdfViewerBase.activeElements.activePageID,
                author: this.commandHandler.drawingObject.author, subject: this.commandHandler.drawingObject.subject,
                enableShapeLabel: this.commandHandler.enableShapeLabel, leaderHeight: measureModule.leaderLength
            };
            this.pdfViewerBase.updateFreeTextProperties(annotationNode);
            // eslint-disable-next-line
            this.drawingObject = this.commandHandler.add(annotationNode as any);
        } else if (!this.dragging) {
            let nodeAnnot: PdfAnnotationBaseModel = {
                bounds: {
                    x: this.currentPosition.x,
                    y: this.currentPosition.y, width: 5, height: 5
                    // eslint-disable-next-line max-len
                }, vertexPoints: [{ x: this.startPosition.x / this.pdfViewerBase.getZoomFactor(), y: this.startPosition.y / this.pdfViewerBase.getZoomFactor() }, { x: this.currentPosition.x / this.pdfViewerBase.getZoomFactor(), y: this.currentPosition.y / this.pdfViewerBase.getZoomFactor() }],
                // eslint-disable-next-line max-len
                shapeAnnotationType: this.drawingObject.shapeAnnotationType, sourceDecoraterShapes: this.drawingObject.sourceDecoraterShapes,
                taregetDecoraterShapes: this.drawingObject.taregetDecoraterShapes, fillColor: this.drawingObject.fillColor,
                strokeColor: this.drawingObject.strokeColor, pageIndex: this.pdfViewerBase.activeElements.activePageID,
                // eslint-disable-next-line max-len
                opacity: this.drawingObject.opacity || 1, borderDashArray: this.drawingObject.borderDashArray, thickness: this.drawingObject.thickness,
                modifiedDate: this.drawingObject.modifiedDate, author: this.drawingObject.author, subject: this.drawingObject.subject,
                lineHeadEnd: this.drawingObject.lineHeadEnd, lineHeadStart: this.drawingObject.lineHeadStart,
                measureType: this.commandHandler.drawingObject.measureType, enableShapeLabel: this.commandHandler.enableShapeLabel
            };
            this.pdfViewerBase.updateFreeTextProperties(nodeAnnot);
             // eslint-disable-next-line
            this.drawingObject = this.commandHandler.add(nodeAnnot as any);

        }

    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        if (this.dragging) {
            super.mouseMove(args);
            if (this.commandHandler) {
                // eslint-disable-next-line
                let currentSelector: any;
                if ((args.source as PdfAnnotationBaseModel) && (args as PdfAnnotationBaseModel).annotationSelectorSettings !== null) {
                currentSelector = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
                } else {currentSelector = '';
                }
                let node: PdfAnnotationBaseModel = this.drawingObject;
                this.commandHandler.nodePropertyChange(node, { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                this.commandHandler.select([node.id], currentSelector);
                this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelector);
            }
            if (this.endPoint && this.endPoint.indexOf('ConnectorSegmentPoint') > -1 && this.dragging) {
                this.commandHandler.annotation.updateCalibrateValues(this.drawingObject);
                // eslint-disable-next-line
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
                 // eslint-disable-next-line
                 let currentSelector: any;
                 if ((args.source as PdfAnnotationBaseModel) && (args as PdfAnnotationBaseModel).annotationSelectorSettings !== null) {
                  currentSelector = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
                 } else { currentSelector = '';
                 }
                // eslint-disable-next-line max-len
                if (this.inAction && this.commandHandler && this.drawingObject && this.endPoint !== undefined && diffX !== 0 || diffY !== 0) {
                    // eslint-disable-next-line max-len
                    this.blocked = !this.commandHandler.dragConnectorEnds(
                        this.endPoint, this.drawingObject as IElement, this.currentPosition, this.selectedSegment, args.target, null, currentSelector);
                    this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelector);
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
        let nodeMouseDown: PdfAnnotationBaseModel = cloneObject(args.source);
        this.undoElement = {
            bounds: {
                x: nodeMouseDown.wrapper.offsetX, y: nodeMouseDown.wrapper.offsetY,
                width: nodeMouseDown.wrapper.actualSize.width, height: nodeMouseDown.wrapper.actualSize.height
            }, rotateAngle: nodeMouseDown.rotateAngle
            // eslint-disable-next-line
        } as any;
        super.mouseDown(args);
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        let object: PdfAnnotationBaseModel | SelectorModel;
        object = args.source as PdfAnnotationBaseModel | Selector;
        // eslint-disable-next-line
        let newShapeObject: any;
        if (this.undoElement.rotateAngle !== object.wrapper.rotateAngle) {
            let oldValue: SelectorModel = { rotateAngle: object.wrapper.rotateAngle };
            let obj: SelectorModel;
            obj = cloneObject(args.source);
             // eslint-disable-next-line
            let currentSelector : any = (args.source as Selector).annotations[0].annotationSelectorSettings;
            this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelector);
            newShapeObject = {
            bounds: {
                x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
            }, rotateAngle: args.source.wrapper.rotateAngle
        };
        }
        // eslint-disable-next-line
        this.commandHandler.annotation.addAction((this as any).pageIndex, null, args.source, 'Rotate', '', this.undoElement as any, newShapeObject);
        this.commandHandler.annotation.stampAnnotationModule.updateSessionStorage(args.source, null, 'Rotate');
        this.commandHandler.annotation.stickyNotesAnnotationModule.updateStickyNotes(args.source, null);
        super.mouseUp(args);
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let object: PdfAnnotationBaseModel | SelectorModel;
        object = args.source as PdfAnnotationBaseModel | Selector;
        // eslint-disable-next-line
        let currentSelector :any = (args.source as Selector).annotations[0].annotationSelectorSettings;
        this.currentPosition = args.position;
        if (object.wrapper) {
            let refPoint: PointModel = { x: object.wrapper.offsetX, y: object.wrapper.offsetY };
            let angle: number = Point.findAngle(refPoint, this.currentPosition) + 90;
            angle = (angle + 360) % 360;
            let oldValue: SelectorModel = { rotateAngle: object.wrapper.rotateAngle };
            let newValue: SelectorModel = { rotateAngle: angle };
            this.blocked = !(this.commandHandler.rotate(angle - object.wrapper.rotateAngle, currentSelector));
        }
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