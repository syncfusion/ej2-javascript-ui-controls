import { DrawingElement, TextElement, Matrix, transformPointByMatrix, rotateMatrix, identityMatrix, Rect, rotatePoint, IElement, PointModel, randomId, Point, TextAlign } from './../ej2-drawings/index';
import { SelectorModel } from './selector-model';
import { Selector } from './selector';
import { findActiveElement } from './action';
import { PdfViewer, PdfViewerBase, MeasureAnnotation, AnnotationSelectorSettingsModel, AnnotationDrawingOptions, EditAction, FreeTextAnnotation, CalloutSettings, PdfAnnotationType, InkAnnotation, IPageAnnotations, RGBA } from '../index';
import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './pdf-annotation-model';
import { PdfAnnotationBase, PdfBounds } from './pdf-annotation';
import { cloneObject, isLineShapes, updateColorWithOpacity } from './drawing-util';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { updatePerimeterLabel } from './connector-util';
import { Browser } from '@syncfusion/ej2-base';
import { DiagramHtmlElement } from './html-element';
import { IFormField, IFormFieldBound } from '../form-designer';
import { AnnotationDrawingOptionsModel, AnnotationSettingsModel, FormFieldModel } from '../pdfviewer-model';
import { BarcodeSymbology, BarcodeValueFormat, FontStyle, FormFieldType, ISize, Pdf417ErrorCorrectionLevel, QRErrorCorrectionLevel, SignatureType } from '../base';
import { AnnotationStatus } from '../base/pdfviewer-utlis';
import { Rectangle } from '@syncfusion/ej2-pdf';
import { ensureCollaborationId } from '../collaboration/collaborative-editing-handler';

/**
 * Defines the interactive tools
 *
 * @hidden
 */
export class ToolBase {
    /**
     * Initializes the tool
     *
     * @param {PdfViewer} pdfViewer - Specified the pdfviewer component.
     * @param {PdfViewerBase} pdfViewerBase - Specified the pdfViewer base component.
     * @param {boolean} protectChange - Set the default value as false.
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

    private baseDirection: 'right' | 'left' | 'up' | 'down';
    /**
     * @param {IElement} currentElement - Specified the current element.
     * @returns {void}
     */
    protected startAction(currentElement: IElement): void {
        this.currentElement = currentElement;
        this.inAction = true;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Mouse up event arguments.
     * @returns {void}
     */
    public mouseDown(args: MouseEventArgs): void {
        this.currentElement = args.source;
        this.startPosition = this.currentPosition = this.prevPosition = args.position;
        this.isTooltipVisible = true;
        this.baseDirection = null;
        this.startAction(args.source);
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Mouse up event arguments.
     * @returns {boolean} - Returns true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        this.currentPosition = args.position;
        //this.currentElement = currentElement;
        this.prevPageId = this.pdfViewerBase.activeElements.activePageID;
        return !this.blocked;
    }

    /**
     * @private
     * @param {number} deltaX - The difference in X-axis points.
     * @param {number} deltaY - The difference in Y-axis points.
     * @param {PointModel} start - The starting point of the line.
     * @param {PointModel} previous - The previous mouse position.
     * @param {number} restrictAngle - The angle increment to snap to.
     * @returns {PointModel}  - The snapped position.
     */
    protected getSnappedPosition(
        deltaX: number,
        deltaY: number,
        start: PointModel,
        previous: PointModel,
        restrictAngle: number
    ): PointModel  {
        // Step 1: Determine initial movement direction
        if (!this.baseDirection) {
            const initDX: number = previous.x - start.x;
            const initDY: number = previous.y - start.y;
            if (Math.abs(initDX) > Math.abs(initDY)) {
                this.baseDirection = initDX > 0 ? 'right' : 'left';
            } else {
                this.baseDirection = initDY > 0 ? 'down' : 'up';
            }
        }
        // Step 2: Calculate angle from start to current
        let angle: number = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        if (angle < 0) { angle += 360; }

        // Step 3: Adjust angle so baseDirection becomes 0°
        let adjustedAngle: number = angle;
        switch (this.baseDirection) {
        case 'right': adjustedAngle = angle; break;
        case 'left': adjustedAngle = (angle + 180) % 360; break;
        case 'up': adjustedAngle = (angle + 90) % 360; break;
        case 'down': adjustedAngle = (angle + 270) % 360; break;
        }

        // Step 4: Snap adjusted angle
        const maxSnaps: number = Math.floor(360 / restrictAngle);
        let snappedRelativeAngle: number = Math.round(adjustedAngle / restrictAngle) * restrictAngle;
        snappedRelativeAngle = Math.min(snappedRelativeAngle, maxSnaps * restrictAngle);

        // Step 5: Convert back to absolute angle
        let snappedAngle: number = snappedRelativeAngle;
        switch (this.baseDirection) {
        case 'right': snappedAngle = snappedRelativeAngle; break;
        case 'left': snappedAngle = (snappedRelativeAngle + 180) % 360; break;
        case 'up': snappedAngle = (snappedRelativeAngle + 270) % 360; break;
        case 'down': snappedAngle = (snappedRelativeAngle + 90) % 360; break;
        }
        snappedAngle = ((snappedAngle % 360) + 360) % 360;
        const snappedAngleRad: number = snappedAngle * (Math.PI / 180);
        const distance: number = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const snappedX: number = start.x + distance * Math.cos(snappedAngleRad);
        const snappedY: number = start.y + distance * Math.sin(snappedAngleRad);

        const snappedPosition: PointModel = {
            x: snappedX,
            y: snappedY
        };

        return snappedPosition;
    }

    protected isCompleteLinkAnnotation(obj: PdfAnnotationBaseModel): boolean {
        if (!obj || obj.shapeAnnotationType !== 'Link') {
            return false;
        }
        const hasUrl: boolean = !isNullOrUndefined(obj.url) && (obj.url as string).toString().trim() !== '';
        const hasDestination: boolean = !isNullOrUndefined(obj.destinationPageIndex) &&
            (obj.destinationPageIndex as number) >= 0;
        return hasUrl || hasDestination;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Mouse up event arguments.
     * @returns {void}
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
     * @private
     * @param {MouseEventArgs} args - Mouse wheel event arguments.
     * @returns {void}
     */
    public mouseWheel(args: MouseEventArgs): void {
        this.currentPosition = args.position;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Mouse leave event arguments.
     * @returns {void}
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    protected updateSize(shape: PdfAnnotationBaseModel, startPoint: PointModel, endPoint: PointModel, corner: string,
                         initialBounds: Rect, angle?: number, isMouseUp?: boolean): Rect {
        const zoom: number = this.commandHandler.viewerBase.getZoomFactor();
        let difx: number = this.currentPosition.x / zoom - this.startPosition.x / zoom;
        let dify: number = this.currentPosition.y / zoom - this.startPosition.y / zoom;
        const rotateAngle: number = (shape instanceof TextElement) ? angle : shape.rotateAngle;
        const matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, -rotateAngle, 0, 0);
        let deltaWidth: number = 0; let deltaHeight: number = 0;
        let diff: PointModel;
        let width: number = (shape instanceof TextElement) ? shape.actualSize.width : shape.wrapper.bounds.width;
        let height: number = (shape instanceof TextElement) ? shape.actualSize.height : shape.wrapper.bounds.height;
        if (shape.shapeAnnotationType === 'Stamp' && rotateAngle !== 0) {
            const selectedAnnotation: PdfAnnotationBaseModel = this.commandHandler && this.commandHandler.selectedItems &&
                this.commandHandler.selectedItems.annotations && this.commandHandler.selectedItems.annotations.length > 0 ?
                this.commandHandler.selectedItems.annotations[0] : null;
            const wrapperSize: { width: number, height: number } = selectedAnnotation && selectedAnnotation.wrapper &&
                selectedAnnotation.wrapper.actualSize ? selectedAnnotation.wrapper.actualSize : null;
            if (wrapperSize) {
                width = wrapperSize.width;
                height = wrapperSize.height;
            }
        }
        let obj: PdfAnnotationBaseModel = shape;
        if (!shape.formFieldAnnotationType) {
            if (!shape.annotName && !shape.shapeAnnotationType) {
                if (shape as SelectorModel) {

                    obj = (shape as SelectorModel).annotations[0];
                }
            }
        }
        const isRectBased: boolean = (shape.shapeAnnotationType === 'Rectangle' || shape.shapeAnnotationType === 'Ellipse'
            || shape.shapeAnnotationType === 'Radius' || shape.shapeAnnotationType === 'Redaction' || shape.shapeAnnotationType === 'FreeText');
        const isStamp: boolean = (shape.shapeAnnotationType === 'Stamp');
        const annotationSettings: AnnotationSettingsModel = this.commandHandler.annotationModule ?
            this.commandHandler.annotationModule.findAnnotationSettings(obj) : {};
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
        if (isAnnotationSet && isMouseUp && !isRectBased && !isStamp) {
            const size: PointModel = this.getPositions(corner, difx, dify);
            const newWidth: number = width + size.x;
            const newHeight: number = height + size.y;
            if (newHeight < annotationMinHeight) {
                dify = annotationMinHeight - height;
            } else if (newHeight > annotationMaxHeight) {
                dify = annotationMaxHeight - height;
            }
            if (newWidth < annotationMinWidth) {
                difx = annotationMinWidth - width;
            } else if (newWidth > annotationMaxWidth) {
                difx = annotationMaxWidth - width;
            }
        }
        switch (corner) {
        case 'ResizeWest':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            deltaHeight = 1;
            dify = 0;
            if (isAnnotationSet) {
                if (initialBounds.width - difx > annotationMaxWidth) {
                    difx = -(annotationMaxWidth - initialBounds.width);
                }
                else if (initialBounds.width - difx < annotationMinWidth) {
                    difx = -(annotationMinWidth - initialBounds.width);
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
                else if (initialBounds.width + difx < annotationMinWidth) {
                    difx = annotationMinWidth - initialBounds.width;
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
                    dify = -(annotationMaxHeight - initialBounds.height);
                }
                else if (initialBounds.height - dify < annotationMinHeight) {
                    dify = -(annotationMinHeight - initialBounds.height);
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
                else if (initialBounds.height + dify < annotationMinHeight) {
                    dify = annotationMinHeight - initialBounds.height;
                }
            }
            deltaHeight = (initialBounds.height + dify) / height; break;
        case 'ResizeNorthEast':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet && !isStamp) {
                if (initialBounds.width + difx > annotationMaxWidth) {
                    difx = annotationMaxWidth - initialBounds.width;
                }
                else if (initialBounds.width + difx < annotationMinWidth) {
                    difx = annotationMinWidth - initialBounds.width;
                }
                if (initialBounds.height - dify > annotationMaxHeight) {
                    if ((shape.shapeAnnotationType === 'FreeText') && (initialBounds.height > annotationMaxHeight)) {
                        dify = 0;
                    }
                    else {
                        dify = -(annotationMaxHeight - initialBounds.height);
                    }
                }
                else if (initialBounds.height - dify < annotationMinHeight) {
                    dify = -(annotationMinHeight - initialBounds.height);
                }
            }
            deltaWidth = (initialBounds.width + difx) / width; deltaHeight = (initialBounds.height - dify) / height;
            break;
        case 'ResizeNorthWest':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet && !isStamp) {
                if (initialBounds.width - difx > annotationMaxWidth) {
                    difx = -(annotationMaxWidth - initialBounds.width);
                }
                else if (initialBounds.width - difx < annotationMinWidth) {
                    difx = -(annotationMinWidth - initialBounds.width);
                }
                if (initialBounds.height - dify > annotationMaxHeight) {
                    if ((shape.shapeAnnotationType === 'FreeText') && (initialBounds.height > annotationMaxHeight)) {
                        dify = 0;
                    }
                    else {
                        dify = -(annotationMaxHeight - initialBounds.height);
                    }
                }
                else if (initialBounds.height - dify < annotationMinHeight) {
                    dify = -(annotationMinHeight - initialBounds.height);
                }
            }
            deltaWidth = (initialBounds.width - difx) / width; deltaHeight = (initialBounds.height - dify) / height;
            break;
        case 'ResizeSouthEast':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet && !isStamp) {
                if (initialBounds.width + difx > annotationMaxWidth) {
                    difx = annotationMaxWidth - initialBounds.width;
                }
                else if (initialBounds.width + difx < annotationMinWidth) {
                    difx = annotationMinWidth - initialBounds.width;
                }
                if (initialBounds.height + dify > annotationMaxHeight) {
                    if ((shape.shapeAnnotationType === 'FreeText') && (initialBounds.height > annotationMaxHeight)) {
                        dify = 0;
                    }
                    else {
                        dify = annotationMaxHeight - initialBounds.height;
                    }
                }
                else if (initialBounds.height + dify < annotationMinHeight) {
                    dify = annotationMinHeight - initialBounds.height;
                }
            }
            deltaHeight = (initialBounds.height + dify) / height; deltaWidth = (initialBounds.width + difx) / width;
            break;
        case 'ResizeSouthWest':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            if (isAnnotationSet && !isStamp) {
                if (initialBounds.width - difx > annotationMaxWidth) {
                    difx = -(annotationMaxWidth - initialBounds.width);
                }
                else if (initialBounds.width - difx < annotationMinWidth) {
                    difx = -(annotationMinWidth - initialBounds.width);
                }
                if (initialBounds.height + dify > annotationMaxHeight) {
                    if ((shape.shapeAnnotationType === 'FreeText') && (initialBounds.height > annotationMaxHeight)) {
                        dify = 0;
                    }
                    else {
                        dify = annotationMaxHeight - initialBounds.height;
                    }
                }
                else if (initialBounds.height + dify < annotationMinHeight) {
                    dify = annotationMinHeight - initialBounds.height;
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
     * @private
     * @param {MouseEventArgs} args - Mouse down event arguments.
     * @returns {void}
     */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.mouseEventHelper(args);
        super.mouseDown(args);
    }

    private mouseEventHelper(args: MouseEventArgs | MouseEvent): void {
        if (this.commandHandler && this.commandHandler.annotationModule) {

            this.commandHandler.annotationModule.overlappedCollections =
             findActiveElement(args as MouseEvent, this.pdfViewerBase, this.commandHandler, true);
        }
        const object: PdfAnnotationBaseModel = findActiveElement(args as MouseEvent, this.pdfViewerBase, this.commandHandler);
        if (object && object.shapeAnnotationType === 'Link' &&
            this.isCompleteLinkAnnotation(object)) {
            if (this.commandHandler && this.commandHandler.selectedItems &&
                this.commandHandler.selectedItems.annotations &&
                this.commandHandler.selectedItems.annotations.length > 0) {
                this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            }
            // Block further selection interaction for the duration of this gesture.
            this.blocked = true;
            return;
        }
        let isLock: boolean = false;
        if (object && object.shapeAnnotationType === 'StickyNotes') {
            if (object.annotationSettings && (object.annotationSettings as AnnotationSettingsModel).isLock) {
                if (this.commandHandler.annotationModule.checkAllowedInteractions('Select', object)) {
                    isLock = false;
                } else {
                    isLock = true;
                }
            }
        }
        if (!isLock) {
            if (this.commandHandler) {
                const selectedObject: SelectorModel = this.commandHandler.selectedItems;
                if (selectedObject) {
                    const annotation: PdfAnnotationBaseModel = selectedObject.annotations[0];
                    const formField : PdfFormFieldBaseModel =  selectedObject.formFields[0];
                    const currentAnnot : PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
                    const currentSource: PdfAnnotationBaseModel = (args as MouseEventArgs).source as PdfAnnotationBaseModel;
                    if ((selectedObject.annotations.length) && (args as MouseEventArgs).info && !(args as MouseEventArgs).info.ctrlKey
                        && this.commandHandler.annotationModule &&
                         this.commandHandler.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === false) {
                        this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    } else if ((args as MouseEventArgs).info && (args as MouseEventArgs).info.ctrlKey && ((currentSource && currentSource.shapeAnnotationType === 'FreeText') || (currentAnnot && currentAnnot.shapeAnnotationType === 'FreeText'))) {
                        this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    } else if (isNullOrUndefined(object) && (this.commandHandler.annotationModule && !isNullOrUndefined(this.commandHandler.annotation.textMarkupAnnotationModule) && isNullOrUndefined(this.commandHandler.annotation.textMarkupAnnotationModule.currentTextMarkupAnnotation)) && this.commandHandler.formDesignerModule && !((currentSource && currentSource.shapeAnnotationType === 'FreeText') || (currentAnnot && (currentAnnot.shapeAnnotationType === 'FreeText' || currentAnnot.shapeAnnotationType === 'Image' || currentAnnot.shapeAnnotationType === 'StickyNotes')))) {
                        this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    }
                    if (object) {
                        if ((isNullOrUndefined(formField) || (formField &&
                             formField.id !== (object as PdfAnnotationBaseModel).id)) &&
                              !isNullOrUndefined(this.pdfViewerBase.isFreeTextSelected) && !this.pdfViewerBase.isFreeTextSelected) {
                            this.commandHandler.select([(object as PdfAnnotationBaseModel).id], (args as MouseEventArgs).source &&
                            ((args as MouseEventArgs).source as PdfAnnotationBaseModel).annotationSelectorSettings);
                            this.commandHandler.viewerBase.isAnnotationMouseDown = true;
                        }
                        this.pdfViewerBase.isFreeTextSelected = false;
                        this.commandHandler.viewerBase.isFormFieldMouseDown = true;
                    }
                    if (selectedObject.annotations.length === 0 && annotation && annotation.shapeAnnotationType !== 'HandWrittenSignature' && annotation.shapeAnnotationType !== 'SignatureText' && annotation.shapeAnnotationType !== 'SignatureImage' && annotation.shapeAnnotationType !== 'Path' && !annotation.formFieldAnnotationType) {
                        if (this.commandHandler.enableToolbar && Browser.isDevice && !this.commandHandler.enableDesktopMode) {
                            this.commandHandler.toolbarModule.showToolbar(true);
                        }
                        this.commandHandler.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
                        if (annotation && annotation.shapeAnnotationType === 'Redaction' &&
                            this.commandHandler.toolbar && this.commandHandler.toolbar.redactionToolbarModule) {
                            this.commandHandler.toolbar.redactionToolbarModule.showHideDeleteIcon(false);
                        }
                    }
                    if (selectedObject.annotations.length === 0 && annotation && (annotation.shapeAnnotationType === 'HandWrittenSignature' || annotation.shapeAnnotationType === 'SignatureText' || annotation.shapeAnnotationType === 'SignatureImage' || annotation.shapeAnnotationType === 'Path' || (annotation as any).signatureType)) {
                        this.commandHandler.fireSignatureUnselect(annotation.signatureName, annotation.pageIndex, annotation);
                    }
                    if (selectedObject.formFields.length === 0 && this.commandHandler.formDesignerModule &&
                         formField && formField.formFieldAnnotationType) {
                        const field: IFormField = { name: formField.name, id: formField.id,
                            value: formField.value, fontFamily: formField.fontFamily, fontSize: formField.fontSize,
                            fontStyle: formField.fontStyle,
                            color: (formField as PdfFormFieldBaseModel).color,
                            backgroundColor: (formField as PdfFormFieldBaseModel).backgroundColor as RGBA,
                            alignment: (formField as PdfFormFieldBaseModel).alignment, isReadonly: formField.isReadonly,
                            visibility: formField.visibility,
                            maxLength: formField.maxLength,  isRequired: formField.isRequired,
                            isPrint: formField.isPrint, rotation: (formField as any).rotation, tooltip: formField.tooltip,
                            options: formField.options, isChecked: formField.isChecked,
                            isSelected: formField.isSelected,
                            customData : formField.customData, lineBound: formField.bounds as IFormFieldBound,
                            pageNumber: formField.pageIndex, insertSpaces: formField.insertSpaces,
                            formFieldAnnotationType: formField.formFieldAnnotationType,
                            borderColor: formField.borderColor as RGBA, thickness: formField.thickness,
                            isTransparent: formField.isTransparent
                        };
                        this.commandHandler.fireFormFieldUnselectEvent('formFieldUnselect', field, formField.pageIndex);
                    }
                    else if (this.pdfViewerBase.currentTarget && (this.pdfViewerBase.currentTarget as HTMLElement).id && this.commandHandler.formFields && event.type === 'mousedown') {
                        for (let i: number = 0; i < this.commandHandler.formFields.length; i++) {
                            const formField: PdfFormFieldBaseModel = this.commandHandler.formFields[parseInt(i.toString(), 10)];
                            if (this.pdfViewerBase.currentTarget && (this.pdfViewerBase.currentTarget as HTMLElement).id === formField.id) {
                                const field: IFormField = {
                                    value: formField.value, fontFamily: formField.fontFamily, fontSize: formField.fontSize,
                                    fontStyle: formField.fontStyle, color: formField.color,
                                    backgroundColor: formField.backgroundColor as RGBA, alignment: formField.alignment,
                                    isReadonly: formField.isReadonly, visibility: formField.visibility,
                                    maxLength: formField.maxLength, isRequired: formField.isRequired,
                                    isPrint: formField.isPrint, rotation: formField.rotateAngle,
                                    tooltip: formField.tooltip,
                                    options: formField.options, isChecked: formField.isChecked,
                                    isSelected: formField.isSelected, id: formField.id, name: formField.name
                                };
                                if (!object) {
                                    this.commandHandler.fireFocusOutFormField((field as any), formField.pageIndex.toString());
                                    this.pdfViewerBase.currentTarget = null;
                                }
                                else {
                                    if ((this.pdfViewerBase.currentTarget as HTMLElement).id !== (event.target as any).id && (event.target as any).className !== 'e-pv-text-layer') {
                                        this.commandHandler.fireFocusOutFormField((field as any), formField.pageIndex.toString());
                                        this.pdfViewerBase.currentTarget = null;
                                    }
                                }
                            }
                        }
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
     * @private
     * @param {MouseEventArgs} args - Mouse move event arguments.
     * @returns {boolean} - Returns true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        //draw selected region
        return !this.blocked;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Mouse up event arguments.
     * @returns {void}
     */
    public mouseUp(args: MouseEventArgs): void {
        this.mouseEventHelper(args);
        this.inAction = false;
        super.mouseUp(args);

    }

    /**
     * @private
     * @param {MouseEventArgs} args - Mouse leave event arguments.
     * @returns {void}
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
    /**
     * Tracks the page index of the annotation when a drag begins.
     * Used to detect and finalise cross-page moves on mouse-up.
     * @private
     */
    private dragStartPageIndex: number = -1;
    /**
     * Tracks whether the object being dragged is a form field (or a signature
     * rendered inside a form field). Cross-page move is annotation-only;
     * form fields must stop at the page edge and keep their page index.
     * @private
     */
    private isFormFieldDrag: boolean = false;
    constructor(commandHandler: PdfViewer, base: PdfViewerBase) {
        super(commandHandler, base);
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Mouse down event arguments.
     * @returns {void}
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.offset = { x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY };
        // Record the page the annotation is on when the drag begins
        this.dragStartPageIndex = (args.source as PdfAnnotationBaseModel).pageIndex;
        // Form fields (and signatures rendered inside a form field) must never
        // take part in the cross-page move: mark the drag so mouseMove/mouseUp
        // skip the annotation-only migration logic.
        this.isFormFieldDrag = !isNullOrUndefined((args.source as PdfFormFieldBaseModel).formFieldAnnotationType) ||
            (args.source as PdfAnnotationBaseModel).annotName === 'SignatureField' ||
            (args.source as PdfAnnotationBaseModel).annotName === 'InitialField';
        this.startPosition = args.position;
        const nodeMouseDown: PdfAnnotationBaseModel = cloneObject(args.source);
        this.redoElement = {
            bounds: {
                x: nodeMouseDown.wrapper.offsetX, y: nodeMouseDown.wrapper.offsetY,
                width: nodeMouseDown.wrapper.actualSize.width, height: nodeMouseDown.wrapper.actualSize.height
            }
        } as PdfAnnotationBaseModel;
        if (isLineShapes(nodeMouseDown)) {
            this.redoElement.vertexPoints = (nodeMouseDown as PdfAnnotationBaseModel).vertexPoints;
            this.redoElement.leaderHeight = (nodeMouseDown as PdfAnnotationBaseModel).leaderHeight;
        } else if (nodeMouseDown.shapeAnnotationType === 'FreeText'
                && !isNullOrUndefined((nodeMouseDown as any).calloutLinesWrapper)) {
            this.redoElement.vertexPoints = (nodeMouseDown as PdfAnnotationBaseModel).vertexPoints;
        }
        this.inAction = true;
    }

    /**
     * @private
     * @param {any} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseUp(args: MouseEventArgs): void {
        if (this.commandHandler && args.source) {
            this.checkisAnnotationMove(args);
            let isDragged: boolean = false;
            const currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
            // Snapshot the drop page BEFORE any cross-page cleanup mutates pageIndex.
            const dropPageIndex: number = (args.source as PdfAnnotationBaseModel).pageIndex;
            // Cross-page move applies to annotations only. A form field drag
            // never migrates pages, so it is always treated as a same-page drop.
            const isCrossPageDrop: boolean = !this.isFormFieldDrag && this.dragStartPageIndex >= 0 &&
                !isNullOrUndefined(dropPageIndex) && !isNaN(dropPageIndex) &&
                dropPageIndex !== this.dragStartPageIndex && !isNullOrUndefined(args.source);

            if (isCrossPageDrop) {
                this.commandHandler.drawing.clearSelectorLayer(this.dragStartPageIndex);
                const oldCanvas: HTMLElement = this.commandHandler.viewerBase
                    .getAnnotationCanvas('_annotationCanvas_', this.dragStartPageIndex);
                if (oldCanvas) {
                    this.commandHandler.renderDrawing(oldCanvas as HTMLCanvasElement, this.dragStartPageIndex);
                }
                this.commandHandler.drawing.clearSelectorLayer(dropPageIndex);

                const nameTableObj: any =
                    (this.commandHandler.nameTable as any)[(args.source as PdfAnnotationBaseModel).id];
                if (nameTableObj) {
                    nameTableObj.pageIndex = this.dragStartPageIndex;
                }
                (args.source as PdfAnnotationBaseModel).pageIndex = this.dragStartPageIndex;
                (args.source as any).pageNumber = this.dragStartPageIndex;
            }
            this.commandHandler.clearSelection(
                isCrossPageDrop ? this.dragStartPageIndex : this.pdfViewerBase.activeElements.activePageID);
            if (!isCrossPageDrop) {
                this.commandHandler.select([(args.source as PdfAnnotationBaseModel).id], currentSelctor);
            }
            if (!isCrossPageDrop && this.pdfViewerBase.activeElements.activePageID === (args.source as PdfAnnotationBaseModel).pageIndex && this.pdfViewerBase.action === 'Drag') {
                this.commandHandler.dragSelectedObjects(this.calculateMouseActionXDiff(args),
                                                        this.calculateMouseActionYDiff(args),
                                                        this.pdfViewerBase.activeElements.activePageID, currentSelctor , null);
            }
            if (args.source && ((args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'Textbox' || (args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'Checkbox'
            || (args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'RadioButton' || (args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'ListBox'
            || (args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'SignatureField' || (args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'InitialField' || (args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'DropdownList'
            || (args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'PasswordField' || (args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'Button' || (args.source as PdfFormFieldBaseModel).formFieldAnnotationType === 'BarcodeField')) {
                this.commandHandler.formDesignerModule.updateHTMLElement(args.source as PdfAnnotationBaseModel);
            }
            if (!isCrossPageDrop) {
                this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelctor);
            }
            this.commandHandler.viewerBase.isAnnotationMouseMove = false;
            this.commandHandler.viewerBase.isFormFieldMouseMove = false;
            const newShapeObject: any = {
                bounds: {
                    x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                    width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                }, modifiedDate: (args.source as PdfAnnotationBaseModel).modifiedDate
            };
            if (isLineShapes(args.source)) {
                newShapeObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                newShapeObject.leaderHeight = (args.source as PdfAnnotationBaseModel).leaderHeight;
            } else if ((args.source as PdfAnnotationBaseModel).shapeAnnotationType === 'FreeText'
                && !isNullOrUndefined((args.source as any).calloutLinesWrapper)) {
                newShapeObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
            }
            if (args.target && (args.target as PdfAnnotationBaseModel).formFieldAnnotationType) {
                const node: PdfAnnotationBaseModel = args.target;
                const field: IFormField = {
                    value: (node as PdfFormFieldBaseModel).value, fontFamily: node.fontFamily, fontSize: node.fontSize,
                    fontStyle: node.fontStyle,
                    color: (node as PdfFormFieldBaseModel).color,
                    backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor as RGBA,
                    borderColor: (node as PdfFormFieldBaseModel).borderColor as RGBA,
                    thickness: (node as PdfFormFieldBaseModel).thickness,
                    alignment: (node as PdfFormFieldBaseModel).alignment,
                    isReadonly: node.isReadonly,
                    visibility: (node as PdfFormFieldBaseModel).visibility,
                    maxLength: (node as PdfFormFieldBaseModel).maxLength,
                    isRequired: (node as PdfFormFieldBaseModel).isRequired,
                    isPrint: node.isPrint,
                    rotation: (node as PdfFormFieldBaseModel).rotateAngle,
                    tooltip: (node as PdfFormFieldBaseModel).tooltip,
                    options: (node as PdfFormFieldBaseModel).options,
                    isChecked: (node as PdfFormFieldBaseModel).isChecked,
                    isSelected: (node as PdfFormFieldBaseModel).isSelected,
                    id: args.source ? (args.source as PdfFormFieldBaseModel).id : '',
                    name: (node as PdfFormFieldBaseModel).name,
                    customData: (node as PdfFormFieldBaseModel).customData,
                    lineBound: (node as PdfFormFieldBaseModel).bounds as IFormFieldBound,
                    pageNumber: node.pageIndex,
                    insertSpaces: (node as PdfFormFieldBaseModel).insertSpaces,
                    formFieldAnnotationType: node.formFieldAnnotationType,
                    isTransparent: (node as PdfFormFieldBaseModel).isTransparent
                };
                const actualWidth: number = args.source.wrapper.actualSize.width;
                const actualHeight: number = args.source.wrapper.actualSize.height;
                const currentPosition: IFormFieldBound = { X: args.source.wrapper.offsetX - actualWidth / 2,
                    Y: args.source.wrapper.offsetY - actualHeight / 2,
                    Width: actualWidth, Height: actualHeight };
                const previousPosition: IFormFieldBound = { X: this.offset.x - actualWidth / 2, Y: this.offset.y - actualHeight / 2,
                    Width: args.source.wrapper.actualSize.width, Height: args.source.wrapper.actualSize.height };
                this.commandHandler.fireFormFieldMoveEvent('formFieldMove', field, node.pageIndex, previousPosition, currentPosition);
                if (this.commandHandler.formFieldsModule && !this.commandHandler.formFieldsModule.isCollaborativeImport) {
                    const fields: FormFieldModel = field as unknown as FormFieldModel;
                    fields.pageNumber = node.pageIndex + 1;
                    fields.bounds = node.bounds as IFormFieldBound;
                    fields.selectedIndex = (node as PdfFormFieldBaseModel).selectedIndex;
                    this.commandHandler.fireFormFieldChangedEvent(EditAction.Modify, fields);
                }
            }
            if (!isNullOrUndefined(this.redoElement) && (this.redoElement.bounds.height !== newShapeObject.bounds.height ||
                 this.redoElement.bounds.width !== newShapeObject.bounds.width || this.redoElement.bounds.x !==
                  newShapeObject.bounds.x || this.redoElement.bounds.y !== newShapeObject.bounds.y)){
                isDragged = true;
            }
            // ── Cross-page drop finalisation ───────────────────────────────────────
            if (isCrossPageDrop && this.commandHandler.annotation) {
                const annotModule: any = this.commandHandler.annotation;
                // moveAnnotationAcrossPages uses currentAnnotation.pageIndex as source
                // (already restored to dragStartPageIndex above) and annotDescriptor.pageNumber
                // as the destination. After it runs, nameTable[id].pageIndex = dropPageIndex.
                if (typeof annotModule.moveAnnotationAcrossPages === 'function' && args.target) {
                    (args.target as any).pageNumber = dropPageIndex;
                    annotModule.moveAnnotationAcrossPages(args.source, args.target, true, true);
                }
                // After moveAnnotationAcrossPages sets nameTable[id].pageIndex = dropPageIndex,
                // select() populates selectedItems.annotations and builds selectorModel.wrapper,
                // which renderSelector requires to draw the handles.
                this.commandHandler.select([(args.source as PdfAnnotationBaseModel).id], currentSelctor);
                // Re-render the selector on the destination page with updated pageIndex.
                //this.commandHandler.renderSelector(dropPageIndex, currentSelctor);
            } else if (this.commandHandler.annotation && isDragged) {
                this.commandHandler.annotation.addAction((this as any).pageIndex, null, args.source, 'Drag', '', this.redoElement, newShapeObject);
                this.commandHandler.annotation.stampAnnotationModule.updateSessionStorage(args.source, null, 'Drag');
                this.commandHandler.annotation.stickyNotesAnnotationModule.updateStickyNotes(args.source, null);
            }
            // Reset cross-page tracking state
            this.dragStartPageIndex = -1;
            this.isFormFieldDrag = false;
        }
        const shapeAnnotationType : PdfAnnotationType = this.commandHandler && this.commandHandler.selectedItems &&
         this.commandHandler.selectedItems.annotations && this.commandHandler.selectedItems.annotations.length > 0 ?
            this.commandHandler.selectedItems.annotations[0].shapeAnnotationType : null;
        if (shapeAnnotationType && shapeAnnotationType !== 'Image' && shapeAnnotationType !== 'SignatureImage') {
            super.mouseUp(args);
        }
        else if (shapeAnnotationType === 'Image' || shapeAnnotationType === 'SignatureImage') {
            this.inAction = false;
        }
        else if (this.commandHandler && this.commandHandler.selectedItems && this.commandHandler.selectedItems.formFields &&
             this.commandHandler.selectedItems.formFields.length > 0) {
            super.mouseUp(args);
        }
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
        const x: number = this.calculateMouseXDiff() / this.commandHandler.viewerBase.getZoomFactor();
        // let y: number = this.calculateMouseYDiff() / this.commandHandler.magnification.zoomFactor;
        if (this.offset) {
            const requiredX: number = this.offset.x + x;
            // let requiredY: number = this.offset.y + y;
            return requiredX - args.source.wrapper.offsetX;
            //let diffY: number = requiredY - args.source.wrapper.offsetY;
        } else {
            return 0;
        }
    }

    private calculateMouseActionYDiff(args: MouseEventArgs): number {
        // let x: number = this.calculateMouseXDiff() / this.commandHandler.magnification.zoomFactor;
        const y: number = this.calculateMouseYDiff() / this.commandHandler.viewerBase.getZoomFactor();
        if (this.offset) {
            // let requiredX: number = this.offset.x + x;
            const requiredY: number = this.offset.y + y;
            // let diffX: number = requiredX - args.source.wrapper.offsetX;
            return requiredY - args.source.wrapper.offsetY;
        } else {
            return 0;
        }
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @param {boolean} isStamp - Specified the stamp annotation or not.
     * @param {boolean} isSkip - Specified the annotation skip or not.
     * @returns {boolean} - Returns the true or false.
     */
    public mouseMove(args: MouseEventArgs, isStamp?: boolean, isSkip?: boolean): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            this.currentPosition = args.position;
            this.currentTarget = args.target;
            const currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
            const x: number = this.calculateMouseXDiff() / this.commandHandler.viewerBase.getZoomFactor();
            const y: number = this.calculateMouseYDiff() / this.commandHandler.viewerBase.getZoomFactor();
            const requiredX: number = this.offset.x + x;
            const requiredY: number = this.offset.y + y;
            let diffX: number = this.calculateMouseActionXDiff(args);
            let diffY: number = this.calculateMouseActionYDiff(args);
            const selectedItem: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
            let cobject: PdfAnnotationBaseModel;
            if (!this.helper) {
                cobject = this.commandHandler.selectedItems.annotations.length > 0 ?
                    cloneObject(this.commandHandler.selectedItems.annotations[0]) as PdfAnnotationBaseModel :
                    cloneObject(this.commandHandler.selectedItems.formFields[0]) as PdfFormFieldBaseModel;
                if (cobject.wrapper) {
                    diffX = requiredX - cobject.wrapper.offsetX;
                    diffY = requiredY - cobject.wrapper.offsetY;
                    cobject.bounds = this.commandHandler.selectedItems.annotations.length > 0 ?
                        this.commandHandler.selectedItems.annotations[0].wrapper.bounds :
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
                    cobject.bounds.width = this.commandHandler.selectedItems.annotations[0].wrapper.actualSize.width;
                    cobject.bounds.height = this.commandHandler.selectedItems.annotations[0].wrapper.actualSize.height;
                } else if (cobject.shapeAnnotationType === 'FreeText') {
                    cobject.strokeColor = 'blue';
                    cobject.fillColor = 'transparent';
                    cobject.thickness = 1;
                    cobject.opacity = 1;
                    cobject.dynamicText = '';
                } else if (cobject.shapeAnnotationType === 'SignatureText') {
                    cobject.strokeColor = 'red';
                    cobject.borderDashArray = '5,5';
                    cobject.fillColor = 'transparent';
                    cobject.thickness = 2;
                    cobject.opacity = 1;
                    cobject.data = '';
                } else if (cobject.shapeAnnotationType === 'Redaction') {
                    cobject.strokeColor = cobject.markerBorderColor;
                    const fillColor: string = updateColorWithOpacity(cobject.fillColor, cobject.markerOpacity);
                    cobject.borderDashArray = '0,0';
                    cobject.fillColor = fillColor;
                    cobject.thickness = 2;
                    cobject.opacity = 1;
                    cobject.data = '';
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
                const shapeAnnotationType: PdfAnnotationType = cobject.shapeAnnotationType;
                if (!isStamp && shapeAnnotationType !== 'Image' && shapeAnnotationType !== 'SignatureImage' ) {
                    this.helper = cobject = this.commandHandler.add(cobject as PdfAnnotationBase);
                } else {
                    cobject = this.helper = args.source;
                }
                if (this.commandHandler.selectedItems.annotations.length > 0) {
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
            if (this.commandHandler.checkBoundaryConstraints(diffX, diffY, this.pdfViewerBase.activeElements.activePageID,
                                                             this.helper.wrapper.bounds, isStamp, isSkip)) {
                const shapeAnnotationType : PdfAnnotationType = this.helper.shapeAnnotationType;
                if (this.helper && (shapeAnnotationType === 'Image' || shapeAnnotationType === 'SignatureImage')) {
                    this.checkisAnnotationMove(args);
                    const currentSelctor: AnnotationSelectorSettingsModel =
                     (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
                    this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                    this.commandHandler.select([(args.source as PdfAnnotationBaseModel).id], currentSelctor);
                    this.commandHandler.dragSelectedObjects(diffX, diffY, this.pdfViewerBase.activeElements.activePageID,
                                                            currentSelctor, this.helper);
                    this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelctor);
                }
                else{
                    this.commandHandler.dragSelectedObjects(diffX, diffY, this.pdfViewerBase.activeElements.activePageID,
                                                            currentSelctor, this.helper);
                }
                this.prevNode = this.helper;
                this.prevPosition = this.currentPosition;
            } else {
                // Cross-page drag: when checkBoundaryConstraints fails AND the mouse
                // is over a different page, discard the stale helper and create a
                // fresh one for the target page, positioned correctly under the cursor.
                // Annotations only — a form field drag stops at the page edge
                // (handled by the final else branch below) and never migrates pages.
                const mousePageIndex: number = this.pdfViewerBase.activeElements.activePageID;
                if (!this.isFormFieldDrag && !isNullOrUndefined(mousePageIndex) && !isNaN(mousePageIndex) &&
                    this.helper && mousePageIndex !== (this.helper as any).pageIndex) {
                    const prevHelperPage: number = (this.helper as any).pageIndex;
                    const zoom: number = this.commandHandler.viewerBase.getZoomFactor();

                    // ── Step 1: Capture helper geometry before any cleanup ────────
                    // Read size and centre from the existing wrapper so the replacement
                    // helper can be positioned and sized identically on the target page.
                    const helperWidth: number = this.helper.wrapper
                        ? this.helper.wrapper.actualSize.width : 50;
                    const helperHeight: number = this.helper.wrapper
                        ? this.helper.wrapper.actualSize.height : 50;
                    // Centre is needed to translate vertexPoints for line annotations.
                    const helperCenterX: number = this.helper.wrapper
                        ? this.helper.wrapper.offsetX : 0;
                    const helperCenterY: number = this.helper.wrapper
                        ? this.helper.wrapper.offsetY : 0;

                    // ── Step 2: Clone helper to preserve annotation type / styling ─
                    // Do this BEFORE remove() so the wrapper is still intact.
                    const newCobject: PdfAnnotationBaseModel =
                        cloneObject(this.helper) as PdfAnnotationBaseModel;

                    // ── Step 3: Remove old helper from the source page ────────────
                    // 3a. Clear selection handles on the source page canvas layer.
                    this.commandHandler.drawing.clearSelectorLayer(prevHelperPage);
                    // 3b. Remove from the drawing (annotations array + page z-order
                    //     table) and trigger a redraw of the source page canvas so
                    //     the ghost outline disappears immediately.
                    this.commandHandler.remove(this.helper);
                    // 3c. Remove the stale nameTable entry so add() can re-register
                    //     the new helper without ID collisions.
                    if ((this.commandHandler.nameTable as any)['diagram_helper']) {
                        delete (this.commandHandler.nameTable as any)['diagram_helper'];
                    }
                    // 3d. Null the reference to prevent any accidental reuse of the
                    //     removed helper and its source-page position data.
                    this.helper = null;

                    // ── Step 4: Configure the new helper for the target page ───────
                    newCobject.wrapper = undefined;
                    newCobject.id = 'diagram_helper';
                    (newCobject as any).pageIndex = mousePageIndex;
                    // Reset zIndex so setZIndex() assigns a fresh slot in the target
                    // page's z-order table instead of reusing the source page value.
                    newCobject.zIndex = -1;

                    // ── Step 5: Position helper at the correct location on the new page
                    // requiredX/Y is the geometrically correct annotation-centre derived
                    // from the pickup-offset formula.  It may be slightly out of bounds
                    // when the cursor first crosses the page boundary, so clamp it to
                    // keep the helper fully within the target page.
                    const targetCanvas: HTMLElement = this.commandHandler.viewerBase
                        .getAnnotationCanvas('_annotationCanvas_', mousePageIndex);
                    const targetPageW: number = targetCanvas
                        ? targetCanvas.clientWidth / zoom : Number.MAX_VALUE;
                    const targetPageH: number = targetCanvas
                        ? targetCanvas.clientHeight / zoom : Number.MAX_VALUE;
                    const halfW: number = helperWidth / 2;
                    const halfH: number = helperHeight / 2;
                    // Clamp centre co-ordinates so the annotation stays within [1, page-3].
                    const clampedX: number =
                        Math.max(1 + halfW, Math.min(targetPageW - 3 - halfW, requiredX));
                    const clampedY: number =
                        Math.max(1 + halfH, Math.min(targetPageH - 3 - halfH, requiredY));

                    if (isLineShapes(newCobject)) {
                        // For line/distance/arrow/polygon annotations, the rendered shape
                        // is driven by vertexPoints (not bounds).  Drawing.initLine() uses
                        // vertexPoints to compute sourcePoint, targetPoint and the path,
                        // so we must translate every vertex by the delta between the old
                        // helper centre and the clamped target centre.
                        const vtxDeltaX: number = clampedX - helperCenterX;
                        const vtxDeltaY: number = clampedY - helperCenterY;
                        const vpts: any[] = (newCobject as any).vertexPoints;
                        if (vpts && vpts.length) {
                            for (const pt of vpts) {
                                pt.x += vtxDeltaX;
                                pt.y += vtxDeltaY;
                            }
                            // Keep sourcePoint / targetPoint in sync so initLine()
                            // does not pick up stale endpoint references.
                            (newCobject as any).sourcePoint = { x: vpts[0].x, y: vpts[0].y };
                            (newCobject as any).targetPoint = {
                                x: vpts[vpts.length - 1].x,
                                y: vpts[vpts.length - 1].y
                            };
                        }
                        // Update bounds to match so the bounding-box queries stay correct.
                        (newCobject as any).bounds = {
                            x: clampedX - halfW,
                            y: clampedY - halfH,
                            width: helperWidth,
                            height: helperHeight
                        };
                    } else {
                        // For rectangular / stamp / free-text etc.: set bounds directly.
                        // initNode() reads bounds.x/y as the top-left corner and derives
                        // wrapper.offsetX/Y = bounds.x + width/2.
                        (newCobject as any).bounds = {
                            x: clampedX - halfW,
                            y: clampedY - halfH,
                            width: helperWidth,
                            height: helperHeight
                        };
                    }

                    // ── Step 6: Register the new helper on the target page ─────────
                    // add() → initObject() → setZIndex() inserts it into the target
                    // page's z-order table; initNode() builds the wrapper at bounds.
                    this.helper = this.commandHandler.add(newCobject as PdfAnnotationBase);
                    // Ensure the page association is correct on the returned instance.
                    (this.helper as any).pageIndex = mousePageIndex;

                    // ── Step 7: Keep selectedItems in sync with the new helper ──────
                    if (this.commandHandler.selectedItems &&
                        this.commandHandler.selectedItems.annotations &&
                        this.commandHandler.selectedItems.annotations.length > 0) {
                        this.commandHandler.selectedItems.annotations = [this.helper];
                    } else if (this.commandHandler.selectedItems &&
                               this.commandHandler.selectedItems.formFields &&
                               this.commandHandler.selectedItems.formFields.length > 0) {
                        this.commandHandler.selectedItems.formFields = [this.helper];
                    }

                    // ── Step 8: Propagate pageIndex to the real annotation ──────────
                    // args.source is the ORIGINAL annotation (persisted from mouseDown);
                    // it is never the helper ('diagram_helper'). Updating it now ensures
                    // that mouseUp's cross-page drop logic uses the correct destination.
                    if (args.source &&
                        (args.source as PdfAnnotationBaseModel).id !== 'diagram_helper') {
                        (args.source as PdfAnnotationBaseModel).pageIndex = mousePageIndex;
                        const nameTableObj: any = (this.commandHandler.nameTable as any)[
                            (args.source as PdfAnnotationBaseModel).id];
                        if (nameTableObj) {
                            nameTableObj.pageIndex = mousePageIndex;
                        }
                    }

                    // ── Step 9: Render helper and selector on target page ──────────
                    // Flush the annotation canvas so the helper outline appears
                    // immediately without waiting for the next dragSelectedObjects call.
                    const newPageCanvas: HTMLElement = this.commandHandler.viewerBase
                        .getAnnotationCanvas('_annotationCanvas_', mousePageIndex);
                    if (newPageCanvas) {
                        this.commandHandler.renderDrawing(
                            newPageCanvas as HTMLCanvasElement, mousePageIndex);
                    }
                    //this.commandHandler.renderSelector(mousePageIndex, currentSelctor);
                    this.prevNode = this.helper;
                    this.prevPosition = this.currentPosition;
                } else if (this.helper && isLineShapes(this.helper)) {
                    if (!this.commandHandler.drawing.isLineInVerticalBounds && !this.commandHandler.drawing.isLineInHorizontalBounds) {
                        this.currentPosition = this.prevPosition;
                        this.startPosition = { x: this.startPosition.x + diffX, y: this.startPosition.y + diffY };
                    }
                    else if (!this.commandHandler.drawing.isLineInVerticalBounds) {
                        this.commandHandler.dragSelectedObjects(
                            diffX, 0, this.pdfViewerBase.activeElements.activePageID, currentSelctor, this.helper);
                        this.currentPosition = { x: this.currentPosition.x, y: this.prevPosition.y };
                        this.startPosition = { x: this.startPosition.x, y: this.startPosition.y + diffY };
                    }
                    else if (!this.commandHandler.drawing.isLineInHorizontalBounds) {
                        this.commandHandler.dragSelectedObjects(
                            0, diffY, this.pdfViewerBase.activeElements.activePageID, currentSelctor, this.helper);
                        this.currentPosition = { x: this.prevPosition.x, y: this.currentPosition.y };
                        this.startPosition = { x: this.startPosition.x + diffX, y: this.startPosition.y };
                    }
                    this.prevNode = this.helper;
                    this.prevPosition = this.currentPosition;
                }
                else {
                    this.currentPosition = this.prevPosition;
                }
            }
            if (selectedItem && selectedItem.annotName) {
                this.commandHandler.annotation.triggerAnnotationMove(selectedItem, true);
            }
        }
        return true;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseLeave(args: MouseEventArgs): void {
        const currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
        const requiredX: number = this.offset.x + this.calculateMouseXDiff();
        const requiredY: number = this.offset.y + this.calculateMouseYDiff();
        const diffX: number = requiredX - args.source.wrapper.offsetX;
        const diffY: number = requiredY - args.source.wrapper.offsetY;
        this.commandHandler.dragSelectedObjects(diffX, diffY, this.prevPageId, currentSelctor, null);
        this.commandHandler.renderSelector(this.prevPageId, currentSelctor);
        super.mouseLeave(args);
    }

    /**
     * @private
     * @returns {void}
     */
    public endAction(): void {
        super.endAction();
        this.currentTarget = null;
        this.prevPosition = null;
    }

    private checkisAnnotationMove(args: MouseEventArgs): void{
        if (this.commandHandler.selectedItems && this.commandHandler.selectedItems.annotations &&
             this.commandHandler.selectedItems.annotations.length > 0) {
            if (this.commandHandler.selectedItems.annotations[0].annotName === (args.source as PdfAnnotationBaseModel).annotName) {
                this.commandHandler.viewerBase.isAnnotationMouseMove = true;
            }
        } else {
            this.commandHandler.viewerBase.isAnnotationMouseMove = false;
        }
        if (this.commandHandler.selectedItems && this.commandHandler.selectedItems.formFields &&
             this.commandHandler.selectedItems.formFields.length > 0) {
            if (this.commandHandler.selectedItems.formFields[0].name === (args.source as PdfFormFieldBaseModel).name) {
                this.commandHandler.viewerBase.isFormFieldMouseMove = true;
            }
        } else {
            this.commandHandler.viewerBase.isFormFieldMouseMove = false;
        }
    }
}

/** @hidden */
export class StampTool extends MoveTool {
    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseUp.call(this, args);
    }
    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {boolean} - Returns the true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        let newObject: PdfAnnotationBaseModel;
        if (!this.inAction) {
            const pageIndex: number = this.pdfViewerBase.activeElements.activePageID;
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            const nodeElement: PdfAnnotationBaseModel =
             this.commandHandler.annotation.stampAnnotationModule.moveStampElement(args.position.x, args.position.y, pageIndex);
            if (nodeElement.shapeAnnotationType === 'SignatureText') {
                const textWidth: number = this.getTextWidth(nodeElement.data, nodeElement.fontSize, nodeElement.fontFamily);
                let widthRatio: number = 1;
                if (textWidth > nodeElement.bounds.width)
                {widthRatio =  nodeElement.bounds.width / textWidth; }
                nodeElement.fontSize = this.getFontSize(Math.floor((nodeElement.fontSize * widthRatio)));
                const defaultFontSize : number = 32; // default font size.
                nodeElement.bounds.height = nodeElement.fontSize < defaultFontSize ? nodeElement.fontSize * 2 : nodeElement.bounds.height;
                nodeElement.thickness = 0;
                let newtextWidth: number = this.getTextWidth(
                    nodeElement.data,
                    nodeElement.fontSize,
                    nodeElement.fontFamily
                );
                newtextWidth = this.pdfViewerBase.ConvertPointToPixel(newtextWidth);
                if (nodeElement.fontSize === 2) {
                    nodeElement.bounds.width = newtextWidth;
                }
            }
            if (nodeElement.shapeAnnotationType === 'Stamp') {
                // Enforce annotation min/max constraints for stamp size before creation
                const stampSettings: AnnotationSettingsModel = this.commandHandler.annotationModule ?
                    this.commandHandler.annotationModule.findAnnotationSettings(nodeElement) : {};
                if (stampSettings && nodeElement && nodeElement.bounds) {
                    let maxH: number = 0;
                    let maxW: number = 0;
                    let minH: number = 0;
                    let minW: number = 0;
                    if (stampSettings.minWidth || stampSettings.maxWidth || stampSettings.minHeight || stampSettings.maxHeight) {
                        maxH = stampSettings.maxHeight ? stampSettings.maxHeight : 2000;
                        maxW = stampSettings.maxWidth ? stampSettings.maxWidth : 2000;
                        minH = stampSettings.minHeight ? stampSettings.minHeight : 0;
                        minW = stampSettings.minWidth ? stampSettings.minWidth : 0;
                        // Clamp inner bounds
                        if (minW && nodeElement.bounds.width < minW) { nodeElement.bounds.width = minW; }
                        if (maxW && nodeElement.bounds.width > maxW) { nodeElement.bounds.width = maxW; }
                        if (minH && nodeElement.bounds.height < minH) { nodeElement.bounds.height = minH; }
                        if (maxH && nodeElement.bounds.height > maxH) { nodeElement.bounds.height = maxH; }
                    }
                }
            }
            newObject = this.commandHandler.add(nodeElement as PdfAnnotationBase);
            args.source = this.commandHandler.annotations[this.commandHandler.annotations.length - 1] as IElement;
            args.sourceWrapper = args.source.wrapper; this.inAction = true;
            const currentSource: PdfAnnotationBaseModel = args.source;
            if (currentSource && (currentSource.shapeAnnotationType === 'HandWrittenSignature' || currentSource.shapeAnnotationType === 'SignatureText' || currentSource.shapeAnnotationType === 'SignatureImage')) {
                this['offset'] = { x: args.source.wrapper.offsetX - (args.source.wrapper.bounds.width / 2), y: args.source.wrapper.offsetY - (args.source.wrapper.bounds.height / 2) };
            } else {
                this['offset'] = { x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY };
            }
            this.startPosition = args.position;
            this.commandHandler.select([newObject.id]);
        }
        const currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
        super.mouseMove.call(this, args, true, true);
        this.commandHandler.renderSelector((args.source as PdfAnnotationBaseModel).pageIndex, currentSelctor);
        return this.inAction;
    }

    private getTextWidth(text: string, font: number, fontFamily: string): number {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        let fontName: string;
        if (font) {
            fontName = font + 'px' + ' ' + fontFamily;
        }
        context.font = fontName || getComputedStyle(document.body).font;
        const textWidth: number = context.measureText(text).width;
        this.pdfViewerBase.releaseCanvas(canvas);
        return textWidth;
    }

    /**
     * @param {number} fontSize - Font size.
     * @returns {number} - Returns the font size.
     */
    private getFontSize(fontSize: number): number {
        let safeSize: number = Math.max(2, fontSize);
        return (safeSize % 2 === 0) ? safeSize : --safeSize;
    }
}

/**
 * Draws a node that is defined by the user
 *
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

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseDown(args: MouseEventArgs): void {
        this.pdfViewerBase.disableTextSelectionMode();
        super.mouseDown(args);
        this.inAction = true;
        const node: PositionChange = { currentPosition: this.currentPosition, prevPosition: this.prevPosition };
        if (!this.commandHandler.enableInkEraser) {
            this.commandHandler.annotation.inkAnnotationModule.drawInkInCanvas(node, this.pdfViewerBase.activeElements.activePageID);
        } else {
            this.commandHandler.annotation.inkAnnotationModule.addEraserPath(node);
        }
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {boolean} - Returns true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            const node: PositionChange = { currentPosition: this.currentPosition, prevPosition: this.pdfViewerBase.prevPosition };
            if (this.commandHandler.enableInkEraser) {
                const inkModule: InkAnnotation = this.commandHandler.annotationModule.inkAnnotationModule;
                if (inkModule && inkModule.outputString && inkModule.outputString !== '') {
                    const currentPageNumber: string = inkModule.currentPageNumber;
                    if (currentPageNumber) {
                        inkModule.drawInkAnnotation(parseInt(currentPageNumber, 10));
                        this.pdfViewerBase.isToolbarInkClicked = true;
                        this.pdfViewerBase.pdfViewer.tool = 'Ink';
                        this.pdfViewerBase.pdfViewer.clearSelection(parseInt(currentPageNumber, 10));
                    }
                }
                this.commandHandler.annotation.inkAnnotationModule.addEraserPath(node);
                const eraserSize: number = this.commandHandler.inkEraserSize;
                const pageIndex: number = this.pdfViewerBase.activeElements.activePageID;
                this.commandHandler.annotation.renderAnnotations(pageIndex, null, null, null);
                inkModule.drawEraserPreview(pageIndex, eraserSize);
            } else {
                this.commandHandler.annotation.inkAnnotationModule.drawInkInCanvas(node, this.pdfViewerBase.activeElements.activePageID);
            }
        }
        return this.inAction;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {boolean} - Returns true.
     */
    public mouseUp(args: MouseEventArgs): boolean {
        if (this.commandHandler.enableInkEraser) {
            const eraserPath: PointModel[] = this.commandHandler.annotation.inkAnnotationModule.eraserPath;
            const eraserSize: number = this.commandHandler.inkEraserSize;
            const pageIndex: number = this.pdfViewerBase.activeElements.activePageID;
            if (eraserPath.length > 0) {
                const storeObject: IPageAnnotations[] = this.commandHandler.annotationsCollection.get(
                    this.pdfViewerBase.documentId + '_annotations_ink'
                );
                if (storeObject) {
                    const pageCollection: number = this.commandHandler.annotationModule.getPageCollection(storeObject, pageIndex);
                    if (pageCollection != null && storeObject[parseInt(pageCollection.toString(), 10)]) {
                        const pageAnnotations: any[] = storeObject[parseInt(pageCollection.toString(), 10)].annotations;
                        if (pageAnnotations && pageAnnotations.length > 0) {
                            for (const annotation of pageAnnotations) {
                                if (this.eraserIntersectsBounds(eraserPath, annotation.bounds)) {
                                    const oldBounds: any = annotation.bounds;
                                    const inkModule: InkAnnotation = this.commandHandler.annotation.inkAnnotationModule;
                                    let oldPathData: string = annotation.data;
                                    const currentZoom: number = this.commandHandler.viewerBase.getZoomFactor();
                                    if (this.commandHandler.annotation.inkAnnotationModule.isAddAnnotationProgramatically) {
                                        oldPathData = this.convertPathToBoundsRelative(oldPathData, annotation.bounds);
                                        annotation.data = oldPathData;
                                        annotation.initialZoom = 1;
                                    }
                                    const initialZoom: number = annotation.initialZoom || 0.75;
                                    if (currentZoom !== initialZoom && oldPathData) {
                                        const zoomRatio: number = currentZoom / initialZoom;
                                        oldPathData = this.transformPathDataByZoom(oldPathData, zoomRatio);
                                        annotation.data = oldPathData;
                                        annotation.initialZoom = currentZoom;
                                    }
                                    // Normalize eraser path coordinates
                                    // Convert eraser points from zoom (screen) space → PDF space
                                    const normalizedEraserPath: { x: number; y: number }[] = eraserPath.map(
                                        (pt: { x: number; y: number }) => ({ x: pt.x / currentZoom, y: pt.y / currentZoom }));
                                    // Convert old path to bounds-relative space (for proper undo/redo alignment)
                                    const normalizedOldPathData: string = this.convertPathToBoundsRelative(oldPathData, annotation.bounds);
                                    annotation.data = this.convertPathToBoundsRelative(oldPathData, annotation.bounds);
                                    const adjustEraserSize: number = eraserSize / currentZoom;
                                    const pathData: string = inkModule.processInkErase(annotation, normalizedEraserPath, adjustEraserSize);
                                    if (pathData === '') {
                                        this.commandHandler.select([annotation.id]);
                                        this.commandHandler.annotationModule.deleteAnnotation();
                                        this.commandHandler.toolbar.annotationToolbarModule.resetFreeTextAnnot();
                                    } else {
                                        const newBounds: { x: number; y: number; width: number; height: number } =
                                            this.calculateBoundsFromPath(pathData);
                                        annotation.bounds = newBounds;
                                        annotation.data = pathData;
                                        this.commandHandler.add(annotation);
                                        annotation.modifiedDate = this.commandHandler.annotation.stickyNotesAnnotationModule.
                                            getDateAndTime();
                                        if (annotation.status !== 'NewlyAdded') {
                                            annotation.status = AnnotationStatus.ExistingModified;
                                        }
                                        this.commandHandler.annotationModule.storeAnnotationCollections(annotation, pageIndex);
                                        const newPathData: string = annotation.data;
                                        this.commandHandler.annotation.addAction(
                                            pageIndex as number,
                                            null,
                                            annotation,
                                            'InkPathModified',
                                            'data',
                                            {
                                                id: annotation.id as string,
                                                data: normalizedOldPathData as string,
                                                bounds: oldBounds
                                            },
                                            {
                                                id: annotation.id as string,
                                                data: newPathData as string,
                                                bounds: annotation.bounds
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
                this.commandHandler.annotation.inkAnnotationModule.eraserPath = [];
                this.commandHandler.annotation.renderAnnotations(pageIndex, null, null, null);
            }
            return true;
        }
        this.commandHandler.annotation.inkAnnotationModule.storePathData();
        return true;
    }

    /**
     * Calculate bounding box from an SVG path string.
     * @param {string} pathStr - The SVG path data string.
     * @returns {{x: number, y: number, width: number, height: number}} - The bounding box.
     * @private
     */
    private calculateBoundsFromPath(pathStr: string): {x: number, y: number, width: number, height: number} {
        if (!pathStr || typeof pathStr !== 'string') {
            return { x: 0, y: 0, width: 1, height: 1 };
        }
        const tokens: string[] = pathStr.match(/[ML]|-?\d*\.?\d+/g) || [];
        let minX: number = Infinity; let minY: number = Infinity;
        let maxX: number = -Infinity; let maxY: number = -Infinity;
        for (let i: number = 0; i < tokens.length;) {
            const cmd: string = tokens[i++];
            const x: number = parseFloat(tokens[i++]);
            const y: number = parseFloat(tokens[i++]);
            if (!isNaN(x) && !isNaN(y)) {
                if (x < minX) { minX = x; }
                if (y < minY) { minY = y; }
                if (x > maxX) { maxX = x; }
                if (y > maxY) { maxY = y; }
            }
        }
        if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
            return { x: 0, y: 0, width: 1, height: 1 };
        }
        return {
            x: minX,
            y: minY,
            width: Math.max(maxX - minX, 1),
            height: Math.max(maxY - minY, 1)
        };
    }

    /**
     * Convert SVG path coordinates to be relative to a bounding box.
     * Maps original path points to new coordinates within the specified bounds.
     * @param {string} pathStr - The SVG path data string.
     * @param {any} bounds - The bounding box containing x, y, width, and height.
     * @returns {string} - The converted path data string with coordinates relative to bounds.
     * @private
     */
    private convertPathToBoundsRelative(pathStr: string, bounds: any): string {
        const tokens: string[] = pathStr.match(/[ML]|-?\d*\.?\d+/g) || [];
        const points: PointModel[] = [];
        const commands: string[] = [];
        for (let i: number = 0; i < tokens.length;) {
            const cmd: string = tokens[i++];
            const x: number = parseFloat(tokens[i++]);
            const y: number = parseFloat(tokens[i++]);
            commands.push(cmd);
            points.push({ x, y });
        }
        let minX: number = Infinity;
        let minY: number = Infinity;
        let maxX: number = -Infinity;
        let maxY: number = -Infinity;
        points.forEach((p: PointModel) => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });
        let pathWidth: number = maxX - minX;
        let pathHeight: number = maxY - minY;
        if (pathWidth === 0) {
            pathWidth = 1;
        }
        if (pathHeight === 0) {
            pathHeight = 1;
        }
        const result: string[] = [];
        for (let i: number = 0; i < points.length; i++) {
            const p: PointModel = points[(i as number)];
            let nx: number = bounds.x + ((p.x - minX) / pathWidth) * bounds.width;
            let ny: number = bounds.y + ((p.y - minY) / pathHeight) * bounds.height;
            nx = Number(nx.toFixed(7));
            ny = Number(ny.toFixed(7));
            result.push(`${commands[(i as number)]}${nx},${ny}`);
        }
        return result.join(' ');
    }

    /**
     * Transform SVG path data by scaling all numeric coordinates by zoom ratio.
     * @param {string} pathData - The SVG path data string.
     * @param {number} zoomRatio - The zoom scaling ratio.
     * @returns {string} - The transformed path data string.
     * @private
     */
    private transformPathDataByZoom(pathData: string, zoomRatio: number): string {
        if (!pathData) {
            return pathData;
        }
        return pathData.replace(/(\d+\.?\d*)/g, (match: string) => {
            return Math.round(parseFloat(match) * zoomRatio).toString();
        });
    }

    /**
     * Quick bounding box check for eraser-annotation intersection
     * Checks whether the eraser path intersects with the annotation bounds.
     * @param {PointModel[]} eraserPath - Array of eraser path points.
     * @param {any} bounds - The annotation bounds to check intersection against.
     * @returns {boolean} - Returns true if the eraser intersects the bounds, otherwise false.
     * @private
     */
    private eraserIntersectsBounds(eraserPath: PointModel[], bounds: any): boolean {
        const zoom: number = this.commandHandler.viewerBase.getZoomFactor();
        const scaledBounds: Rectangle = {
            x: bounds.x * zoom,
            y: bounds.y * zoom,
            width: bounds.width * zoom,
            height: bounds.height * zoom
        };
        const distPointToSegment: (p: PointModel, a: PointModel, b: PointModel) => number =
        (p: PointModel, a: PointModel, b: PointModel): number => {
            const dx: number = b.x - a.x;
            const dy: number = b.y - a.y;
            const lenSq: number = dx * dx + dy * dy;
            const t: number = lenSq ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq)) : 0;
            return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
        };
        const segmentsCross: (a1: PointModel, a2: PointModel, b1: PointModel, b2: PointModel) => boolean =
        (a1: PointModel, a2: PointModel, b1: PointModel, b2: PointModel): boolean => {
            const cross2D: (o: PointModel, u: PointModel, v: PointModel) => number =
            (o: PointModel, u: PointModel, v: PointModel): number => {
                return (u.x - o.x) * (v.y - o.y) - (u.y - o.y) * (v.x - o.x);
            };
            const d1: number = cross2D(b1, b2, a1);
            const d2: number = cross2D(b1, b2, a2);
            const d3: number = cross2D(a1, a2, b1);
            const d4: number = cross2D(a1, a2, b2);
            return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
                   ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
        };
        const boundsCorners: PointModel[] = [
            { x: scaledBounds.x, y: scaledBounds.y },
            { x: scaledBounds.x + scaledBounds.width, y: scaledBounds.y },
            { x: scaledBounds.x + scaledBounds.width, y: scaledBounds.y + scaledBounds.height },
            { x: scaledBounds.x, y: scaledBounds.y + scaledBounds.height }
        ];
        for (let i: number = 0; i < eraserPath.length - 1; i++) {
            const eraserSegStart: PointModel = eraserPath[(i as number)];
            const eraserSegEnd: PointModel = eraserPath[i + 1];
            for (let j: number = 0; j < boundsCorners.length; j++) {
                const corner1: PointModel = boundsCorners[(j as number)];
                const corner2: PointModel = boundsCorners[(j + 1) % boundsCorners.length];
                if (segmentsCross(eraserSegStart, eraserSegEnd, corner1, corner2)) {
                    return true;
                }
            }
            if (eraserSegStart.x >= scaledBounds.x && eraserSegStart.x <= scaledBounds.x + scaledBounds.width &&
                eraserSegStart.y >= scaledBounds.y && eraserSegStart.y <= scaledBounds.y + scaledBounds.height) {
                return true;
            }
            for (let j: number = 0; j < boundsCorners.length; j++) {
                const corner: PointModel = boundsCorners[(j as number)];
                if (distPointToSegment(corner, eraserSegStart, eraserSegEnd) <= 2) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseLeave(args: MouseEventArgs): void {
        //this.mouseUp(args);
    }

    /**
     * @private
     * @returns {void}
     */
    public endAction(): void {
        super.endAction();
    }
}

/**
 * Helps to edit the selected connectors
 *
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

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
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
        const nodeElement: PdfAnnotationBaseModel = cloneObject(args.source);
        this.redoElement = {
            bounds: {
                x: nodeElement.wrapper.offsetX, y: nodeElement.wrapper.offsetY,
                width: nodeElement.wrapper.actualSize.width, height: nodeElement.wrapper.actualSize.height
            }
        } as SelectorModel;
        if (isLineShapes(nodeElement)) {
            this.redoElement.vertexPoints = (nodeElement as PdfAnnotationBaseModel).vertexPoints;
            this.redoElement.leaderHeight = (nodeElement as PdfAnnotationBaseModel).leaderHeight;
            if (nodeElement.measureType === 'Distance' || nodeElement.measureType === 'Perimeter' || nodeElement.measureType === 'Area' || nodeElement.measureType === 'Volume') {
                this.redoElement.notes = (nodeElement as PdfAnnotationBaseModel).notes;
            }
        } else if (nodeElement.shapeAnnotationType === 'FreeText'
                && !isNullOrUndefined((nodeElement as any).calloutLinesWrapper)) {
            this.redoElement.vertexPoints = (nodeElement as PdfAnnotationBaseModel).vertexPoints;
        }
        this.currentPosition = args.position;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseUp(args: MouseEventArgs): void {
        if (this.commandHandler) {
            const node: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
            let isResized: boolean = false;
            if (node) {
                const annotationSettings: AnnotationSettingsModel = this.commandHandler.annotationModule.findAnnotationSettings(node);
                let annotationMaxHeight: number = 0;
                let annotationMaxWidth: number  = 0;
                let annotationMinHeight: number = 0;
                let annotationMinWidth: number = 0;
                if (annotationSettings.minWidth ||  annotationSettings.maxWidth || annotationSettings.minHeight ||
                     annotationSettings.maxHeight) {
                    annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
                    annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
                    annotationMinHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
                    annotationMinWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
                }
                if (node.vertexPoints.length > 3) {
                    const sizeObject: any = this.commandHandler.viewerBase.checkAnnotationWidth(node.vertexPoints);
                    const width: number = sizeObject.width;
                    const height: number = sizeObject.height;
                    if (annotationMinHeight || annotationMinWidth || annotationMaxHeight || annotationMaxWidth) {
                        if ((height > annotationMinHeight && height < annotationMaxHeight) ||
                         (width > annotationMinWidth && width < annotationMaxWidth)) {
                            this.commandHandler.nodePropertyChange(this.prevSource,
                                                                   { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                        }
                    } else {
                        this.commandHandler.nodePropertyChange(this.prevSource,
                                                               { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                    }
                } else {
                    if (annotationMinHeight || annotationMinWidth || annotationMaxHeight || annotationMaxWidth) {
                        if (node.shapeAnnotationType === 'Line' || node.shapeAnnotationType === 'Distance' || node.shapeAnnotationType === 'LineWidthArrowHead' || (node.shapeAnnotationType === 'FreeText' && node.calloutLinesWrapper)) {
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
                            const diff: number = (x > y) ? x : y;
                            if (diff < (annotationMaxHeight || annotationMaxWidth) && diff > (annotationMinHeight || annotationMinWidth)) {
                                this.commandHandler.nodePropertyChange(this.prevSource,
                                                                       { vertexPoints: node.vertexPoints,
                                                                           leaderHeight: node.leaderHeight });
                            }
                        } else {
                            this.commandHandler.nodePropertyChange(this.prevSource,
                                                                   { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                        }
                    } else {
                        this.commandHandler.nodePropertyChange(this.prevSource,
                                                               { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                    }
                }
                const currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
                this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                this.commandHandler.select([this.prevSource.id], currentSelctor);
                this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelctor);
                const newShapeElementObject: any = {
                    bounds: {
                        x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                        width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                    }
                };
                if (node.measureType === 'Distance' || node.measureType === 'Perimeter' || node.measureType === 'Area' || node.measureType === 'Volume') {
                    this.commandHandler.annotation.isSkipLastAction = true;
                    this.commandHandler.annotation.updateCalibrateValues(this.commandHandler.selectedItems.annotations[0]);
                    newShapeElementObject.notes = (args.source as PdfAnnotationBaseModel).notes;
                }
                if (isLineShapes(args.source)) {
                    newShapeElementObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                    newShapeElementObject.leaderHeight = (args.source as PdfAnnotationBaseModel).leaderHeight;
                } else if ((args.source as PdfAnnotationBaseModel).shapeAnnotationType === 'FreeText'
                        && !isNullOrUndefined((args.source as any).calloutLinesWrapper)) {
                    newShapeElementObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                }
                if (this.redoElement.bounds.height !== newShapeElementObject.bounds.height ||
                     this.redoElement.bounds.width !== newShapeElementObject.bounds.width ||
                      this.redoElement.bounds.x !== newShapeElementObject.bounds.x || this.redoElement.bounds.y !==
                       newShapeElementObject.bounds.y){
                    isResized = true;
                }
                if (!isResized && (args.source as PdfAnnotationBaseModel).shapeAnnotationType === 'FreeText'
                    && !isNullOrUndefined((args.source as any).calloutLinesWrapper)
                    && !isNullOrUndefined(newShapeElementObject.vertexPoints)
                    && !isNullOrUndefined(this.redoElement.vertexPoints)) {
                    const beforePts: PointModel[] = this.redoElement.vertexPoints;
                    const afterPts: PointModel[] = newShapeElementObject.vertexPoints;
                    let calloutMoved: boolean = beforePts.length !== afterPts.length;
                    if (!calloutMoved) {
                        for (let vi: number = 0; vi < beforePts.length; vi++) {
                            if (beforePts[parseInt(vi.toString(), 10)].x !== afterPts[parseInt(vi.toString(), 10)].x
                                || beforePts[parseInt(vi.toString(), 10)].y !== afterPts[parseInt(vi.toString(), 10)].y) {
                                calloutMoved = true;
                                break;
                            }
                        }
                    }
                    if (calloutMoved) {
                        isResized = true;
                    }
                }
                if (isResized)
                {
                    this.commandHandler.annotationModule.invalidateAppearanceImage(this.prevSource);
                    this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.prevSource, 'Resize', '', this.redoElement, newShapeElementObject);
                }
            }
        }
        super.mouseUp(args);
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {boolean} - Returns true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let connector: PdfAnnotationBaseModel;
        this.currentPosition = args.position;
        if (this.currentPosition && this.prevPosition) {
            const diffX: number = this.currentPosition.x - this.prevPosition.x;
            const diffY: number = this.currentPosition.y - this.prevPosition.y;
            const drawingOptions: AnnotationDrawingOptionsModel = this.pdfViewerBase.pdfViewer.annotationDrawingOptions;

            if (!isNullOrUndefined(drawingOptions) && (drawingOptions.enableLineAngleConstraints || args.info.shiftKey) &&
                Number.isInteger(drawingOptions.restrictLineAngleTo) &&
                drawingOptions.restrictLineAngleTo > 0 && drawingOptions.restrictLineAngleTo <= 360 &&
                ((args.source as any).properties.shapeAnnotationType === 'Line' ||
                    (args.source as any).properties.shapeAnnotationType === 'LineWidthArrowHead')) {
                let startingPoint: any;
                if (this.endPoint === 'ConnectorSegmentPoint_0') {
                    startingPoint = (args.source as any).vertexPoints[1];
                } else if (this.endPoint === 'ConnectorSegmentPoint_1') {
                    startingPoint = (args.source as any).vertexPoints[0];
                }
                const restrictAngle: number = drawingOptions.restrictLineAngleTo;

                const deltaX: number = this.currentPosition.x - startingPoint.x;
                const deltaY: number = this.currentPosition.y - startingPoint.y;
                const previousPoint: PointModel  = (startingPoint.x === this.prevPosition.x &&
                        startingPoint.y === this.prevPosition.y)
                    ? this.currentPosition
                    : this.prevPosition;
                const result: PointModel = this.getSnappedPosition(deltaX, deltaY, startingPoint, previousPoint,
                                                                   restrictAngle);
                this.currentPosition = {
                    x: result.x,
                    y: result.y
                };
            }
            let newValue: PointModel;
            let oldValue: PointModel;
            if (args.source && (args.source as SelectorModel).annotations) {
                newValue = {
                    x: this.currentPosition.x,
                    y: this.currentPosition.y
                };
                oldValue = {
                    x: this.prevPosition.x,
                    y: this.prevPosition.y
                };
                connector = (args.source as SelectorModel).annotations[0];
            }
            if (this.inAction && this.endPoint !== undefined && diffX !== 0 || diffY !== 0) {
                if (!this.helper) {
                    let cloneShapebject: PdfAnnotationBaseModel = cloneObject(
                        this.commandHandler.selectedItems.annotations[0]) as PdfAnnotationBaseModel;
                    if (cloneShapebject.shapeAnnotationType === 'FreeText' && cloneShapebject.calloutLinesWrapper) {
                        cloneShapebject.id = 'diagram_helper';
                        cloneShapebject.strokeColor = 'blue';
                        cloneShapebject.fillColor = 'transparent';
                        cloneShapebject.thickness = 1;
                        cloneShapebject.opacity = 1;
                        cloneShapebject.dynamicText = '';
                    }
                    else {
                        cloneShapebject.id = 'diagram_helper';
                        cloneShapebject.strokeColor = 'red';
                        cloneShapebject.borderDashArray = '5,5';
                        cloneShapebject.fillColor = 'transparent';
                        cloneShapebject.thickness = 2;
                        cloneShapebject.opacity = 1;
                    }
                    if (cloneShapebject.enableShapeLabel === true) {
                        cloneShapebject.labelContent = '';
                    }
                    this.helper = cloneShapebject = this.commandHandler.add(cloneShapebject as PdfAnnotationBase);
                    this.commandHandler.selectedItems.annotations = [cloneShapebject];
                }
                const currentSelctor: AnnotationSelectorSettingsModel = (args.source as PdfAnnotationBaseModel).annotationSelectorSettings;
                this.blocked = !this.commandHandler.dragConnectorEnds(
                    this.endPoint, this.helper as IElement, this.currentPosition, this.selectedSegment, args.target, null, currentSelctor);
                this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelctor);
            }
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    /**
     * @private
     * @returns {void}
     */
    public endAction(): void {
        super.endAction();
        this.prevPosition = null;
        this.endPoint = null;
    }
}

/**
 * Scales the selected objects
 *
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

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void} - Returns true or false.
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.initialBounds.x = args.source.wrapper.offsetX;
        this.initialBounds.y = args.source.wrapper.offsetY;
        this.initialBounds.height = args.source.wrapper.actualSize.height;
        this.initialBounds.width = args.source.wrapper.actualSize.width;
        this.initialPosition = args.position;
        const node: PdfAnnotationBaseModel = cloneObject(args.source);
        this.redoElement = {
            bounds: {
                x: node.wrapper.offsetX, y: node.wrapper.offsetY,
                width: node.wrapper.actualSize.width, height: node.wrapper.actualSize.height
            },
            isAppearanceStale: node.isAppearanceStale
        } as any;
        if (isLineShapes(node)) {
            this.redoElement.vertexPoints = (node as PdfAnnotationBaseModel).vertexPoints;
            this.redoElement.leaderHeight = (node as PdfAnnotationBaseModel).leaderHeight;
        } else if (node.shapeAnnotationType === 'FreeText'
                && !isNullOrUndefined((node as any).calloutLinesWrapper)) {
            this.redoElement.vertexPoints = (node as PdfAnnotationBaseModel).vertexPoints;
        }
        if (node.measureType === 'Radius') {
            this.redoElement.notes = (node as PdfAnnotationBaseModel).notes;
        }
        this.prevSource = this.commandHandler.selectedItems.annotations.length > 0 ?
            this.commandHandler.selectedItems.annotations[0] : this.commandHandler.selectedItems.formFields[0];
        if (this.prevSource && (this.prevSource as PdfFormFieldBaseModel).formFieldAnnotationType === 'BarcodeField'
            && this.commandHandler && this.commandHandler.formDesignerModule) {
            this.commandHandler.formDesignerModule.beginBarcodeResizeTracking(this.prevSource as PdfFormFieldBaseModel);
        }
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @param {boolean} isPreventHistory - Specified the prevent history value.
     * @returns {boolean} - Returns true or false.
     */
    public mouseUp(args: MouseEventArgs, isPreventHistory?: boolean): boolean {
        const object: PdfAnnotationBaseModel | SelectorModel = args.source as PdfAnnotationBaseModel | Selector;
        const oldObject: any = cloneObject(args.source);
        let isResized: boolean = false;
        if (this.commandHandler && this.prevSource) {
            this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
            this.commandHandler.viewerBase.isAnnotationSelect = true;
            this.commandHandler.viewerBase.isFormFieldSelect = true;
            this.commandHandler.select([this.prevSource.id], this.prevSource.annotationSelectorSettings);
            const deltaValues: Rect = this.updateSize(this.prevSource, this.currentPosition,
                                                      this.initialPosition, this.corner, this.initialBounds, null, true);
            this.blocked = this.scaleObjects(
                deltaValues.width, deltaValues.height, this.corner, this.currentPosition,
                this.initialPosition, this.prevSource, args.info.ctrlKey);
            if (this.commandHandler.selectedItems && this.commandHandler.selectedItems.annotations &&
                this.commandHandler.selectedItems.annotations[0] && this.commandHandler.selectedItems.annotations[0].shapeAnnotationType === 'Stamp') {
                if (this.commandHandler.stampSettings.minHeight || this.commandHandler.stampSettings.minWidth) {
                    this.commandHandler.select([this.prevSource.id], this.prevSource.annotationSelectorSettings);
                }
            }
            if (this.commandHandler.selectedItems.formFields.length > 0 && (this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'Textbox' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'Checkbox'
              || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'RadioButton' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'InitialField' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'SignatureField'
              || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'DropdownList' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'ListBox' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'PasswordField'
              || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'Button' || this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'BarcodeField')) {
                if (this.commandHandler.selectedItems.formFields[0].formFieldAnnotationType === 'SignatureField'){
                    this.commandHandler.selectedItems.formFields[0].signatureIndicatorSettings = this.commandHandler.selectedItems.formFields[0].signatureIndicatorSettings ? this.commandHandler.selectedItems.formFields[0].signatureIndicatorSettings : { opacity: 1, backgroundColor: 'rgba(255, 228, 133, 0.35)', width: 19, height: 10, fontSize: 10, text: null, color: 'black' };
                }
                const resizedFormField: PdfFormFieldBaseModel = this.commandHandler.selectedItems.formFields[0];
                if (resizedFormField && this.commandHandler && this.commandHandler.formDesignerModule) {
                    this.commandHandler.formDesignerModule.revertBarcodeResizeIfReduced(resizedFormField);
                }
                this.commandHandler.formDesignerModule.updateHTMLElement(resizedFormField);
                // R2-FIX-09: re-assert composite chrome so the picker button stays anchored after resize.
                // DateTime only. updateTextboxProperties still uses model bounds, so the icon is
                // scaled again from the live resized height, same as zoom.
                if (resizedFormField.formFieldAnnotationType === 'Textbox' && resizedFormField.isDateField) {
                    const wrapper: HTMLElement = document.getElementById(resizedFormField.id + '_content_html_element');
                    if (wrapper) {
                        this.commandHandler.formDesignerModule.updateTextboxProperties(resizedFormField, wrapper, false);
                        const dateTimeComposite: HTMLElement = wrapper.querySelector('.e-pv-datetime-composite') as HTMLElement;
                        const contentNode: any = resizedFormField.wrapper && resizedFormField.wrapper.children ?
                            resizedFormField.wrapper.children[0] : null;
                        const zoomValue: number = this.commandHandler.viewerBase.getZoomFactor();
                        const fieldHeightPx: number = contentNode && contentNode.actualSize ?
                            contentNode.actualSize.height * zoomValue : 0;
                        if (dateTimeComposite && fieldHeightPx > 0) {
                            this.commandHandler.viewerBase.scaleDateTimePickerIcon(dateTimeComposite, fieldHeightPx);
                        }
                    }
                }
            }
            this.commandHandler.renderSelector(this.prevPageId, this.prevSource.annotationSelectorSettings);
            if (this.commandHandler.annotation && args.source.wrapper) {
                const newObject: any = {
                    bounds: {
                        x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                        width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                    }
                } as PdfAnnotationBaseModel;
                if (isLineShapes(args.source)) {
                    newObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                    newObject.leaderHeight = (args.source as PdfAnnotationBaseModel).leaderHeight;
                } else if ((args.source as PdfAnnotationBaseModel).shapeAnnotationType === 'FreeText'
                        && !isNullOrUndefined((args.source as any).calloutLinesWrapper)) {
                    newObject.vertexPoints = (args.source as PdfAnnotationBaseModel).vertexPoints;
                }
                if (this.redoElement.bounds.height !== newObject.bounds.height ||
                     this.redoElement.bounds.width !== newObject.bounds.width || this.redoElement.bounds.x !==
                      newObject.bounds.x || this.redoElement.bounds.y !== newObject.bounds.y){
                    isResized = true;
                }
                if (this.prevSource.measureType === 'Radius' && isResized) {
                    newObject.notes = (args.source as PdfAnnotationBaseModel).notes;
                    this.commandHandler.annotation.isSkipLastAction = true;
                    this.commandHandler.annotation.updateCalibrateValues(this.prevSource);
                }
                if (this.prevSource.shapeAnnotationType === 'SignatureText') {
                    const oldObjectWidth: number = (oldObject.bounds && oldObject.bounds.width) ? oldObject.bounds.width : oldObject.width;
                    const boundsRatio: number = newObject.bounds.width / oldObjectWidth;
                    newObject.fontSize = (this.prevSource as any).wrapper.children[1].style.fontSize * boundsRatio;
                    if (args.target != null) {
                        (args.target as PdfAnnotationBaseModel).fontSize = newObject.fontSize;
                        ((args.target as PdfAnnotationBaseModel).wrapper.children[1] as any).style.fontSize = newObject.fontSize;
                        (args.target as PdfAnnotationBaseModel).wrapper.children[1].horizontalAlignment = 'Center';
                        (args.target as PdfAnnotationBaseModel).wrapper.children[1].verticalAlignment = 'Center';
                        (args.target as PdfAnnotationBaseModel).wrapper.children[1].setOffsetWithRespectToBounds(0, 0, 'Absolute');
                        (this.commandHandler.selectedItems.annotations[0].wrapper.children[1] as any).style.fontSize = newObject.fontSize;
                        this.commandHandler.selectedItems.annotations[0].wrapper.children[1].horizontalAlignment = 'Center';
                        this.commandHandler.selectedItems.annotations[0].wrapper.children[1].verticalAlignment = 'Center';
                        this.commandHandler.selectedItems.annotations[0].wrapper.children[1].setOffsetWithRespectToBounds(0, 0, 'Absolute');
                        this.commandHandler.selectedItems.annotations[0].fontSize = newObject.fontSize;
                    }
                }
                if ((this.prevSource.shapeAnnotationType === 'SignatureText') && this.commandHandler.selectedItems.annotations &&
                    this.commandHandler.selectedItems.annotations.length > 0) {
                    this.commandHandler.nodePropertyChange(this.commandHandler.selectedItems.annotations[0],
                                                           { fontSize: newObject.fontSize });
                }
                if (isResized)
                {
                    this.commandHandler.annotationModule.invalidateAppearanceImage(this.prevSource);
                    this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.prevSource, 'Resize', '', this.redoElement as any, newObject);
                }
            }
            const formField: PdfFormFieldBaseModel = this.commandHandler.selectedItems.annotations.length > 0 ?
                this.commandHandler.selectedItems.annotations[0] : this.commandHandler.selectedItems.formFields[0];
            if (formField && formField.formFieldAnnotationType) {
                const node: PdfAnnotationBaseModel = formField;
                const field: IFormField = { id: (args.source as PdfFormFieldBaseModel).id,
                    value: (node as PdfFormFieldBaseModel).value, fontFamily: node.fontFamily,
                    fontSize: node.fontSize, fontStyle: (node as PdfFormFieldBaseModel).fontStyle,
                    color: (node as PdfFormFieldBaseModel).color,
                    backgroundColor: (node as PdfFormFieldBaseModel).backgroundColor as RGBA,
                    alignment: (node as PdfFormFieldBaseModel).alignment, isReadonly: node.isReadonly,
                    visibility: (node as PdfFormFieldBaseModel).visibility,
                    maxLength: (node as PdfFormFieldBaseModel).maxLength,
                    isRequired: (node as PdfFormFieldBaseModel).isRequired, isPrint: node.isPrint,
                    rotation: (node as PdfFormFieldBaseModel).rotateAngle,
                    tooltip: (node as PdfFormFieldBaseModel).tooltip,
                    options: (node as PdfFormFieldBaseModel).options,
                    isChecked: (node as PdfFormFieldBaseModel).isChecked,
                    isSelected: (node as PdfFormFieldBaseModel).isSelected,
                    name: (node as PdfFormFieldBaseModel).name,
                    customData: (node as PdfFormFieldBaseModel).customData,
                    lineBound: (node as PdfFormFieldBaseModel).bounds as IFormFieldBound,
                    pageNumber: (node as PdfFormFieldBaseModel).pageIndex,
                    insertSpaces: (node as PdfFormFieldBaseModel).insertSpaces,
                    isTransparent: (node as PdfFormFieldBaseModel).isTransparent,
                    formFieldAnnotationType: (node as PdfAnnotationBaseModel).formFieldAnnotationType,
                    borderColor: (node as PdfFormFieldBaseModel).borderColor as RGBA,
                    thickness: (node as PdfFormFieldBaseModel).thickness
                };
                const actualWidth: number = args.source.wrapper.actualSize.width;
                const actualHeight: number = args.source.wrapper.actualSize.height;
                const currentPosition: IFormFieldBound = { X: args.source.wrapper.offsetX - actualWidth / 2,
                    Y: args.source.wrapper.offsetY - actualHeight / 2,
                    Width: actualWidth, Height: actualHeight };
                const previousPosition: IFormFieldBound = { X: this.initialBounds.x - this.initialBounds.width / 2,
                    Y: this.initialBounds.y - this.initialBounds.height / 2,
                    Width: this.initialBounds.width, Height: this.initialBounds.height };
                this.commandHandler.fireFormFieldResizeEvent('formFieldResize', field, node.pageIndex, previousPosition, currentPosition);
                if (!this.commandHandler.formFieldsModule.isCollaborativeImport) {
                    const fields: FormFieldModel = field as unknown as FormFieldModel;
                    fields.pageNumber = (node as PdfFormFieldBaseModel).pageIndex + 1;
                    fields.bounds = (node as PdfFormFieldBaseModel).bounds as IFormFieldBound;
                    fields.selectedIndex = (node as PdfFormFieldBaseModel).selectedIndex;
                    this.commandHandler.fireFormFieldChangedEvent(EditAction.Modify, fields);
                }
            }
            if (this.commandHandler.annotation && this.commandHandler.annotation.stampAnnotationModule) {
                this.commandHandler.annotation.stampAnnotationModule.updateSessionStorage(args.source, this.prevSource.id, 'Resize');
            }
        }
        super.mouseUp(args);
        return !this.blocked;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {boolean} - Returns true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        const object: PdfAnnotationBaseModel | SelectorModel = args.source as PdfAnnotationBaseModel | Selector;
        this.currentPosition = args.position;
        let x: number = this.currentPosition.x - this.startPosition.x;
        let y: number = this.currentPosition.y - this.startPosition.y;
        x = x / this.commandHandler.viewerBase.getZoomFactor();
        y = y / this.commandHandler.viewerBase.getZoomFactor();
        const annotationElement : any = args.source;
        const size: PointModel = this.getPoints(x, y);
        const width: number = annotationElement.width + size.x;
        const height: number = annotationElement.height + size.y;
        let obj: any = object;
        if (object && (object as SelectorModel | Selector).annotations) {
            obj = (object as SelectorModel).annotations[0];
        }
        const annotationSettings: AnnotationSettingsModel = this.commandHandler.annotationModule ?
            this.commandHandler.annotationModule.findAnnotationSettings(obj) : {};
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
            if (height < annotationMinHeight) {
                y = annotationMinHeight - annotationElement.height;
            } else if (height > annotationMaxHeight) {
                y = annotationMaxHeight - annotationElement.height;
            }
            if (width < annotationMinWidth) {
                x = annotationMinWidth - annotationElement.width;
            } else if (width > annotationMaxWidth) {
                x = annotationMaxWidth - annotationElement.width;
            }
        }
        let changes: PointModel = { x: x, y: y };
        if (this.currentElement.wrapper) {
            changes = rotatePoint(-this.currentElement.wrapper.rotateAngle, undefined, undefined, changes);
        }
        changes = this.getChanges(changes);
        this.commandHandler.renderSelector(this.prevPageId, this.prevSource.annotationSelectorSettings);
        if (!this.helper) {
            let cobject: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations.length > 0 ?
                cloneObject(this.commandHandler.selectedItems.annotations[0]) as PdfAnnotationBaseModel :
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
                cobject.bounds = this.commandHandler.selectedItems.annotations.length > 0 ?
                    this.commandHandler.selectedItems.annotations[0].wrapper.bounds :
                    this.commandHandler.selectedItems.formFields[0].wrapper.bounds;
                cobject.strokeColor = 'red';
                cobject.borderDashArray = '5,5';
                cobject.fillColor = 'transparent';
                cobject.thickness = 2;
                cobject.opacity = cobject.shapeAnnotationType !== 'Image' ? 1 : cobject.opacity;
            }
            if (cobject.enableShapeLabel === true) {
                cobject.labelContent = '';
            }
            if (cobject.shapeAnnotationType === 'SignatureText') {
                cobject.fillColor = 'transparent';
                cobject.thickness = 1;
                cobject.opacity = 1;
                cobject.data = '';
            }
            this.helper = cobject = this.commandHandler.add(cobject as PdfAnnotationBase);
            if (this.commandHandler.selectedItems.annotations.length > 0) {
                this.commandHandler.selectedItems.annotations = [cobject];
            } else {
                this.commandHandler.selectedItems.formFields = [cobject];
            }
        }
        const deltaValues: Rect = this.updateSize(this.helper, this.startPosition, this.currentPosition, this.corner, this.initialBounds);
        this.blocked = !(this.scaleObjects(deltaValues.width, deltaValues.height, this.corner, this.startPosition,
                                           this.currentPosition, this.helper, args.info.ctrlKey));
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
    private getTooltipContent(pdfAnnotationBaseModel: SelectorModel): string {
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
        return { x: x, y: y };
    }

    /**
     * Updates the size with delta width and delta height using scaling.
     * Aspect ratio used to resize the width or height based on resizing the height or width.
     *
     * @param {number} deltaWidth - Specified the delta width.
     * @param {number} deltaHeight - Specified the delta height.
     * @param {string} corner - Specified the corner value.
     * @param {PointModel} startPoint - Specified the start point of the annotation.
     * @param {PointModel} endPoint - Specified the end point of the annotation.
     * @param {SelectorModel | PdfAnnotationBaseModel} source - Specified the annotation object.
     * @param {boolean} isCtrlKeyPressed - becomes true when ctrl Key is pressed.
     * @returns {boolean} - Returns true or false.
     */
    private scaleObjects(
        deltaWidth: number, deltaHeight: number, corner: string, startPoint: PointModel, endPoint: PointModel,
        source?: SelectorModel | PdfAnnotationBaseModel, isCtrlKeyPressed?: boolean)
        : boolean {
        const resizerLoc: any = this.commandHandler.viewerBase.getResizerLocationFrom.call(this, source);
        if (resizerLoc === 1 && this.commandHandler.viewerBase.isEdgeHandle(corner)) {
            this.blocked = true;
            return true;
        }
        if (resizerLoc === 2 && this.commandHandler.viewerBase.isCornerHandle(corner)) {
            this.blocked = true;
            return true;
        }
        const annotationSettings: AnnotationSettingsModel = this.commandHandler.annotationModule ?
            this.commandHandler.annotationModule.findAnnotationSettings(source) : {};
        let annotationMaxHeight: number = 0;
        let annotationMaxWidth: number = 0;
        let annotationMinHeight: number = 0;
        let annotationMinWidth: number = 0;
        let x: number = this.currentPosition.x - this.startPosition.x;
        let y: number = this.currentPosition.y - this.startPosition.y;
        x = x / this.commandHandler.viewerBase.getZoomFactor();
        y = y / this.commandHandler.viewerBase.getZoomFactor();
        const annotationElement : PdfAnnotationBaseModel = source;
        const size: PointModel = this.getPoints(x, y);
        const width: number = annotationElement.bounds.width + size.x;
        const height: number = annotationElement.bounds.height + size.y;
        if (annotationSettings.minWidth || annotationSettings.maxWidth || annotationSettings.minHeight || annotationSettings.maxHeight) {
            annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
            annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            annotationMinHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
            annotationMinWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
        }
        if (source instanceof Selector && source.annotations.length === 1 &&
            (source.annotations[0].shapeAnnotationType === 'Perimeter' || source.annotations[0].shapeAnnotationType === 'Radius')) {
            if (!(deltaHeight === 1 && deltaWidth === 1)) {
                deltaHeight = deltaWidth = Math.max(deltaHeight === 1 ? 0 : deltaHeight, deltaWidth === 1 ? 0 : deltaWidth);
            } else if (startPoint !== endPoint) {
                deltaHeight = deltaWidth = Math.max(deltaHeight, deltaWidth);
            } else {
                deltaHeight = deltaWidth = 0;
            }
        } else if ((source as PdfAnnotationBaseModel).shapeAnnotationType === 'Image' || ((source as PdfAnnotationBaseModel).shapeAnnotationType === 'HandWrittenSignature' || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'SignatureText' || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'SignatureImage') || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'Stamp') {
            if (!(deltaHeight === 1 && deltaWidth === 1)) {
                if (isCtrlKeyPressed){
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
            }
            if (!isCtrlKeyPressed){
                deltaHeight = deltaWidth = Math.max(deltaHeight, deltaWidth);
                let maxReached: boolean = false;
                let minReached: boolean = false;
                if (annotationSettings.maxWidth || annotationSettings.maxHeight) {
                    if ((deltaWidth * annotationElement.bounds.width) > annotationMaxWidth) {
                        deltaWidth = annotationMaxWidth / annotationElement.bounds.width;
                        maxReached = true;
                    }
                    if ((deltaHeight * annotationElement.bounds.height) > annotationMaxHeight) {
                        deltaHeight = annotationMaxHeight / annotationElement.bounds.height;
                        maxReached = true;
                    }
                    if (maxReached) {
                        deltaHeight = deltaWidth = Math.min(deltaHeight, deltaWidth);
                    }
                }
                if (annotationSettings.minWidth || annotationSettings.minHeight) {
                    if ((deltaWidth * annotationElement.bounds.width) < annotationMinWidth) {
                        deltaWidth = annotationMinWidth / annotationElement.bounds.width;
                        minReached = true;
                    }
                    if ((deltaHeight * annotationElement.bounds.height) < annotationMinHeight) {
                        deltaHeight = annotationMinHeight / annotationElement.bounds.height;
                        minReached = true;
                    }
                    if (minReached) {
                        deltaHeight = deltaWidth = Math.max(deltaHeight, deltaWidth);
                    }
                }
            }
        } else {
            if ((source as PdfAnnotationBaseModel).shapeAnnotationType === 'Perimeter' || (source as PdfAnnotationBaseModel).shapeAnnotationType === 'Radius') {
                if (!annotationMaxHeight || !annotationMaxWidth) {
                    if (!(deltaHeight === 1 && deltaWidth === 1)) {
                        deltaHeight = deltaWidth = Math.max(deltaHeight === 1 ? 0 : deltaHeight, deltaWidth === 1 ? 0 : deltaWidth);
                    }
                }
            }
        }
        this.blocked = this.commandHandler.scaleSelectedItems(deltaWidth, deltaHeight, this.getPivot(this.corner));
        return this.blocked;
    }
}

/**
 * Draws a node that is defined by the user
 *
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
    public isFormDesign: boolean;
    constructor(commandHandler: PdfViewer, base: PdfViewerBase, sourceObject: PdfAnnotationBaseModel) {
        super(commandHandler, base);
        this.sourceObject = sourceObject;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseDown(args: MouseEventArgs): void {
        if (this.commandHandler.readOnlySettings.formFields && this.sourceObject && this.sourceObject.formFieldAnnotationType) {
            return;
        }
        if (!isNaN(this.pdfViewerBase.activeElements.activePageID) && (event.target as HTMLElement).className !== 'e-pv-page-container') {
            super.mouseDown(args);
            this.inAction = true;
            const node: PdfAnnotationBaseModel = { bounds: { x: 100, y: 300, width: 100, height: 100 }, pageIndex: 0, strokeColor: 'red', thickness: 3 };
            node.id = randomId();
            this.sourceObject.pageIndex = node.pageIndex = this.pdfViewerBase.activeElements.activePageID || 0;
            this.sourceObject.enableShapeLabel = this.commandHandler.enableShapeLabel;
            this.pdfViewerBase.updateFreeTextProperties(this.sourceObject);
            this.isFormDesign = false;
            const formFieldElement: HTMLElement = document.getElementById('FormField_helper_html_element');
            if (formFieldElement) {
                formFieldElement.remove();
            }
            this.commandHandler.drawingObject = this.drawingObject =
             this.commandHandler.add(this.sourceObject || node as any) as PdfAnnotationBaseModel;
            if (this.drawingObject.formFieldAnnotationType === 'Textbox' || this.drawingObject.formFieldAnnotationType === 'SignatureField' || this.drawingObject.formFieldAnnotationType === 'InitialField' ||
                this.drawingObject.formFieldAnnotationType === 'Checkbox' || this.drawingObject.formFieldAnnotationType === 'ListBox' || this.drawingObject.formFieldAnnotationType === 'RadioButton' ||
                this.drawingObject.formFieldAnnotationType === 'DropdownList' || this.drawingObject.formFieldAnnotationType === 'PasswordField' ||
                this.drawingObject.formFieldAnnotationType === 'Button' || this.drawingObject.formFieldAnnotationType === 'BarcodeField') {
                this.inAction = false;
                (this.drawingObject as PdfFormFieldBaseModel).pageNumber = this.pdfViewerBase.getActivePage(true);
                const bounds: { width: number; height: number; } = this.commandHandler.formDesignerModule.
                    updateFormFieldInitialSize(this.drawingObject.wrapper.children[0], this.drawingObject.formFieldAnnotationType);
                const pageIndex: number = this.drawingObject.pageIndex;
                const page: HTMLElement = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex);
                const pageWidth: number = page.clientWidth - bounds.width;
                const pageHeight: number = page.clientHeight - bounds.height;
                const left: number = page.offsetLeft;
                let offsetX: number;
                if (this.currentPosition.y >= pageHeight && event.target && (event.target as HTMLElement).parentElement && (event.target as HTMLElement).parentElement.classList.contains('foreign-object') && (event as any).path) {
                    const targetParentRect: DOMRect = (event as any).path[3].getBoundingClientRect();
                    offsetX = (event as any).clientX - targetParentRect.left;
                } else {
                    offsetX = this.currentPosition.x;
                }
                let rect: { x: number, y: number, width: number, height: number };
                if (this.currentPosition.x >= pageWidth && this.currentPosition.y >= pageHeight) {
                    rect = { x: pageWidth, y: pageHeight, width: this.drawingObject.wrapper.children[0].width,
                        height: this.drawingObject.wrapper.children[0].height };
                } else if (this.currentPosition.x >= pageWidth) {
                    rect = { x: pageWidth, y: this.currentPosition.y, width: this.drawingObject.wrapper.children[0].width,
                        height: this.drawingObject.wrapper.children[0].height };
                } else if (this.currentPosition.y >= pageHeight) {
                    rect = { x: offsetX, y: pageHeight, width: this.drawingObject.wrapper.children[0].width,
                        height: this.drawingObject.wrapper.children[0].height };
                } else {
                    rect = { x: this.currentPosition.x, y: this.currentPosition.y, width: this.drawingObject.wrapper.children[0].width,
                        height: this.drawingObject.wrapper.children[0].height };
                }
                this.updateNodeDimension(this.drawingObject, rect as Rect);
                this.drawingObject.bounds.x = this.drawingObject.bounds.x - (this.drawingObject.bounds.width / 2);
                this.drawingObject.bounds.y = this.drawingObject.bounds.y - (this.drawingObject.bounds.height / 2);
                this.commandHandler.formFieldCollection.push(this.drawingObject);
                const drawingObject: PdfFormFieldBaseModel = this.drawingObject as PdfFormFieldBaseModel;
                // Public collection type: internal 'Button' → 'ButtonField' (I4); preserve AA (I8).
                const drawAnnotType: string = drawingObject.formFieldAnnotationType as string;
                const drawPublicType: FormFieldType = (drawAnnotType === 'Button' ?
                    'ButtonField' : drawAnnotType) as FormFieldType;
                const formField: FormFieldModel = {
                    id: drawingObject.id, name: drawingObject.name, value: drawingObject.value,
                    type: drawPublicType, isReadOnly: drawingObject.isReadonly,
                    fontFamily: drawingObject.fontFamily,
                    fontSize: drawingObject.fontSize, fontStyle: drawingObject.fontStyle as unknown as FontStyle,
                    color: drawingObject.color, backgroundColor: drawingObject.backgroundColor as string,
                    alignment: drawingObject.alignment as TextAlign, visibility: drawingObject.visibility,
                    maxLength: drawingObject.maxLength, isRequired: drawingObject.isRequired,
                    isPrint: drawingObject.isPrint, isSelected: drawingObject.isSelected, isChecked: drawingObject.isChecked,
                    tooltip: drawingObject.tooltip, bounds: drawingObject.bounds as IFormFieldBound,
                    thickness: drawingObject.thickness, borderColor: drawingObject.borderColor as string,
                    signatureIndicatorSettings: drawingObject.signatureIndicatorSettings, pageIndex: drawingObject.pageIndex,
                    pageNumber : drawingObject.pageNumber, isMultiline: drawingObject.isMultiline,
                    insertSpaces: drawingObject.insertSpaces, isTransparent : drawingObject.isTransparent,
                    rotateAngle: drawingObject.rotateAngle,
                    selectedIndex: drawingObject.selectedIndex, options: drawingObject.options ? drawingObject.options : [],
                    signatureType: drawingObject.signatureType as unknown as SignatureType[],
                    zIndex: drawingObject.zIndex,
                    customData: drawingObject.customData ? drawingObject.customData : {} as object,
                    symbology: drawingObject.symbology as BarcodeSymbology, xDimension: drawingObject.xDimension,
                    errorCorrectionLevel: drawingObject.errorCorrectionLevel as Pdf417ErrorCorrectionLevel | QRErrorCorrectionLevel,
                    valueFormat: drawingObject.valueFormat as BarcodeValueFormat, fields: drawingObject.fields ? drawingObject.fields : [],
                    includeFieldNames: drawingObject.includeFieldNames, compressData: drawingObject.compressData,
                    customValue: drawingObject.customValue, caption: drawingObject.caption
                };
                if (this.commandHandler.enableCollaborativeEditing) {
                    ensureCollaborationId(formField);
                    drawingObject.customData = formField.customData;
                }
                if (drawAnnotType === 'Button' && !isNullOrUndefined(drawingObject.actions)) {
                    formField.actions = drawingObject.actions;
                }
                this.commandHandler.formFieldCollections.push(formField);
                this.commandHandler.formDesignerModule.drawHTMLContent(this.drawingObject.formFieldAnnotationType,
                                                                       this.drawingObject.wrapper.children[0] as DiagramHtmlElement,
                                                                       this.drawingObject,
                                                                       this.drawingObject.pageIndex, this.commandHandler);
                this.commandHandler.select([this.commandHandler.drawingObject.id], this.commandHandler.annotationSelectorSettings);
                if (this.commandHandler.annotation) {
                    this.commandHandler.annotation.addAction(this.pdfViewerBase.getActivePage(true), null, this.drawingObject, 'Addition', '', this.drawingObject, this.drawingObject);
                }
                this.endAction();
                this.pdfViewerBase.tool = null;
                this.pdfViewerBase.action = 'Select';
                this.drawingObject = null;
                this.pdfViewerBase.isMouseDown = false;
                this.pdfViewerBase.pdfViewer.drawingObject = null;
                this.isFormDesign = true;
            }
        }
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {boolean} - Returns true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            this.dragging = true;
            const rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            if (!isNullOrUndefined(this.drawingObject)) {
                this.updateNodeDimension(this.drawingObject, rect);
                if (this.drawingObject.shapeAnnotationType === 'Radius') {
                    this.updateRadiusLinePosition(this.drawingObject.wrapper.children[1], this.drawingObject);
                }
            }
        }
        return true;
    }

    private checkMinBounds(drawnAnnotation: PdfAnnotationBase): PdfBounds | null {
        const zoom: number = this.pdfViewerBase.getZoomFactor();
        const modifiedBounds: PdfBounds = {} as PdfBounds;
        if (drawnAnnotation.shapeAnnotationType) {
            if (drawnAnnotation.shapeAnnotationType === 'Rectangle' || drawnAnnotation.shapeAnnotationType === 'Radius'
                || drawnAnnotation.shapeAnnotationType === 'Ellipse' || drawnAnnotation.shapeAnnotationType === 'Redaction') {
                const annotationSettings: AnnotationSettingsModel =
                    this.commandHandler.annotationModule.findAnnotationSettings(drawnAnnotation);
                const pageSize: ISize = this.pdfViewerBase.pageSize[drawnAnnotation.pageIndex];
                if ((annotationSettings.minWidth && (annotationSettings.minWidth > 0))
                    || (annotationSettings.minHeight && (annotationSettings.minHeight > 0))) {
                    if (annotationSettings.minWidth > drawnAnnotation.wrapper.bounds.width) {
                        modifiedBounds.width = annotationSettings.minWidth;
                        if ((drawnAnnotation.wrapper.bounds.x + modifiedBounds.width) > pageSize.width) {
                            modifiedBounds.x = ((drawnAnnotation.wrapper.bounds.x + drawnAnnotation.wrapper.bounds.width)
                                                    - (modifiedBounds.width * 0.5));
                        }
                        else {
                            modifiedBounds.x = drawnAnnotation.wrapper.bounds.x + (modifiedBounds.width * 0.5);
                        }
                    }
                    if (annotationSettings.minHeight > drawnAnnotation.wrapper.height) {
                        modifiedBounds.height = annotationSettings.minHeight;
                        if ((drawnAnnotation.wrapper.bounds.y + modifiedBounds.height) > pageSize.height) {
                            modifiedBounds.y = ((drawnAnnotation.wrapper.bounds.y + drawnAnnotation.wrapper.bounds.height)
                                                    - (modifiedBounds.height * 0.5));
                        }
                        else {
                            modifiedBounds.y = drawnAnnotation.wrapper.bounds.y + (modifiedBounds.height * 0.5);
                        }
                    }
                }
            }
            if (JSON.stringify(modifiedBounds) !== '{}') {
                return modifiedBounds;
            }
            return null;
        }
        return null;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseUp(args: MouseEventArgs): void {
        if (this.drawingObject && this.dragging) {
            const isLinkAnnotation: boolean = this.drawingObject.shapeAnnotationType === 'Link';
            const isInteractiveLink: boolean = isLinkAnnotation && !this.isCompleteLinkAnnotation(this.drawingObject);
            let annotationSelectorSettings: AnnotationSelectorSettingsModel;
            if (!isLinkAnnotation || isInteractiveLink) {
                this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                annotationSelectorSettings = cloneObject(this.commandHandler.annotationSelectorSettings);
                const shapeType: PdfAnnotationType = this.drawingObject.shapeAnnotationType;
                this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType);
                this.commandHandler.select([this.drawingObject.id], annotationSelectorSettings);
            }
            const drawnAnnotation: PdfAnnotationBaseModel =
                (this.commandHandler.selectedItems && this.commandHandler.selectedItems.annotations &&
                this.commandHandler.selectedItems.annotations.length > 0)
                    ? this.commandHandler.selectedItems.annotations[0] : this.drawingObject;
            const selectorSettings: { annotationSelectorSettings: AnnotationSelectorSettingsModel } =
                { annotationSelectorSettings: annotationSelectorSettings };
            if (!isNullOrUndefined(drawnAnnotation) && !isNullOrUndefined(drawnAnnotation.wrapper)) {
                this.commandHandler.nodePropertyChange(drawnAnnotation,
                                                       { bounds: { x: drawnAnnotation.wrapper.offsetX,
                                                           y: drawnAnnotation.wrapper.offsetY } , annotationSelectorSettings:
                                                           selectorSettings.annotationSelectorSettings});
                const modifiedBounds: PdfBounds | null = this.checkMinBounds(drawnAnnotation as PdfAnnotationBase);
                if (!isNullOrUndefined(modifiedBounds)) {
                    this.commandHandler.nodePropertyChange(drawnAnnotation, { bounds: modifiedBounds });
                    if (!isLinkAnnotation || isInteractiveLink) {
                        this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                        if (!isNullOrUndefined(args.source) &&
                            !isNullOrUndefined((args.source as PdfAnnotationBaseModel).annotationSelectorSettings)) {
                            this.commandHandler.select([this.drawingObject.id],
                                                       (args.source as PdfAnnotationBaseModel).annotationSelectorSettings);
                        }
                    }
                }
                this.commandHandler.annotation.updateCalibrateValues(this.drawingObject, true);
                if (this.commandHandler && !this.isFormDesign) {

                    this.commandHandler.annotation.addAction(
                        (this as any).pageIndex, null, this.drawingObject, 'Addition', '', this.drawingObject, this.drawingObject);
                    if (this.drawingObject && this.drawingObject.shapeAnnotationType === 'Redaction' &&
                        this.commandHandler.toolbar && this.commandHandler.toolbar.redactionToolbarModule) {
                        this.commandHandler.toolbar.redactionToolbarModule.showHideDeleteIcon(true);
                        this.commandHandler.toolbar.redactionToolbarModule.showHideRedactIcon(true);
                    }
                }
                this.dragging = false;
                super.mouseUp(args);
                this.inAction = false;
            }
        } else {
            super.mouseUp(args);
        }
        this.drawingObject = null;
    }

    /**
     * @private
     * @returns {void}
     */
    public endAction(): void {
        super.endAction();
    }

    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - Specified the annotation object.
     * @param {Rect} rect - Specified the annotation rect element.
     * @returns {void}
     */
    public updateNodeDimension(obj: PdfAnnotationBaseModel, rect?: Rect): void {
        const zoom: number = this.commandHandler.viewerBase.getZoomFactor();
        if (!isNullOrUndefined(obj)) {
            obj.bounds.x = (rect.x / zoom) + rect.width / zoom;
            obj.bounds.y = (rect.y / zoom) + rect.height / zoom;
            obj.bounds.width = rect.width / zoom;
            obj.bounds.height = rect.height / zoom;
            const annotationSettings: AnnotationSettingsModel = this.commandHandler.annotationModule ?
                this.commandHandler.annotationModule.findAnnotationSettings(obj) : {};
            let annotationMaxHeight: number = 0;
            let annotationMaxWidth: number = 0;
            if (annotationSettings.maxWidth || annotationSettings.maxHeight) {
                annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
                annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
                if (obj.bounds.width > annotationMaxWidth) {
                    obj.bounds.width = annotationMaxWidth;
                    if ((rect.x + rect.width) === this.currentPosition.x) {
                        obj.bounds.x = (rect.x / zoom) + obj.bounds.width;
                    }
                    else if ((rect.x + rect.width) === this.prevPosition.x) {
                        obj.bounds.x = rect.right / zoom;
                    }
                }
                if (obj.bounds.height > annotationMaxHeight) {
                    obj.bounds.height = annotationMaxHeight;
                    if ((rect.y + rect.height) === this.currentPosition.y) {
                        obj.bounds.y = (rect.y / zoom) + obj.bounds.height;
                    }
                    else if ((rect.y + rect.height) === this.prevPosition.y) {
                        obj.bounds.y = rect.bottom / zoom;
                    }
                }
                if (obj.bounds.height <= annotationMaxHeight && obj.bounds.width <= annotationMaxWidth) {
                    this.commandHandler.nodePropertyChange(obj, { bounds: obj.bounds });
                }
            } else {
                this.commandHandler.nodePropertyChange(obj, { bounds: obj.bounds });
            }
        }
    }

    /**
     * @private
     * @param {DrawingElement} obj - Specified the drawing element.
     * @param {PdfAnnotationBaseModel} node - Specified the annotation object.
     * @returns {void}
     */
    public updateRadiusLinePosition(obj: DrawingElement, node: PdfAnnotationBaseModel): void {
        const trasPoint: PointModel = { x: node.bounds.x + (node.bounds.width / 4), y: node.bounds.y };
        const center: PointModel = { x: (node.bounds.x + (node.bounds.width / 2)), y: (node.bounds.y + (node.bounds.height / 2)) };
        const matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, node.rotateAngle, center.x, center.y);
        const rotatedPoint: PointModel = transformPointByMatrix(matrix, trasPoint);
        const newPoint1: PointModel = { x: rotatedPoint.x, y: rotatedPoint.y };
        obj.offsetX = newPoint1.x;
        obj.offsetY = newPoint1.y;
        obj.width = node.bounds.width / 2;
        const annotationSettings: AnnotationSettingsModel = this.commandHandler.annotationModule.findAnnotationSettings(node);
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
 *
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

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        const annotationSelectorSettings: AnnotationSelectorSettingsModel = cloneObject(this.commandHandler.annotationSelectorSettings);
        const shapeType: string = 'Line';
        const subject: string = (args.source as PdfAnnotationBaseModel) && (args.source as PdfAnnotationBaseModel).subject;
        this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType, null, subject);
        if (!this.drawingObject) {
            this.startPoint = { x: this.startPosition.x, y: this.startPosition.y };
            const nodeAnnotElement: PdfAnnotationBaseModel = {
                bounds: { x: this.currentPosition.x, y: this.currentPosition.y, width: 5, height: 5},
                vertexPoints: [{ x: this.startPoint.x / this.pdfViewerBase.getZoomFactor(),
                    y: this.startPoint.y / this.pdfViewerBase.getZoomFactor() },
                { x: this.currentPosition.x / this.pdfViewerBase.getZoomFactor(),
                    y: this.currentPosition.y / this.pdfViewerBase.getZoomFactor() }],
                shapeAnnotationType: 'Line', fillColor: this.commandHandler.drawingObject.fillColor,
                strokeColor: this.commandHandler.drawingObject.strokeColor, pageIndex: this.pdfViewerBase.activeElements.activePageID,
                notes: this.commandHandler.drawingObject.notes, thickness: this.commandHandler.drawingObject.thickness,
                author: this.commandHandler.drawingObject.author,
                subject: this.commandHandler.drawingObject.subject, borderDashArray: this.commandHandler.drawingObject.borderDashArray,
                modifiedDate: this.commandHandler.drawingObject.modifiedDate, borderStyle: this.commandHandler.drawingObject.borderStyle,
                measureType: this.commandHandler.drawingObject.measureType, enableShapeLabel: this.commandHandler.enableShapeLabel,
                opacity: this.commandHandler.drawingObject.opacity, annotationSelectorSettings: annotationSelectorSettings,
                cloudIntensity: this.commandHandler.drawingObject.cloudIntensity,
                isCloudShape: this.commandHandler.drawingObject.isCloudShape
            };
            this.pdfViewerBase.updateFreeTextProperties(nodeAnnotElement);
            this.drawingObject = this.commandHandler.add(nodeAnnotElement as PdfAnnotationBase);
        } else {
            let pt: PointModel;
            const obj: PdfAnnotationBaseModel = (this.drawingObject);
            pt = obj.vertexPoints[obj.vertexPoints.length - 1];
            pt = { x: pt.x, y: pt.y };
            const lastPoint: PointModel = this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length - 1];
            if (!(lastPoint.x === pt.x && lastPoint.x === pt.y)) {
                this.drawingObject.vertexPoints.push(pt);
            }
            this.commandHandler.nodePropertyChange(obj, { vertexPoints: obj.vertexPoints, annotationSelectorSettings });
        }
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {boolean} - Returns true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            this.dragging = true;
            const obj: PdfAnnotationBaseModel = (this.drawingObject);
            const annotationSelectorSettings: AnnotationSelectorSettingsModel =
                cloneObject(this.commandHandler.annotationSelectorSettings);
            const shapeType: string = (args.source as PdfAnnotationBaseModel) &&
                (args.source as PdfAnnotationBaseModel).shapeAnnotationType;
            const subject: string = (args.source as PdfAnnotationBaseModel) &&
                (args.source as PdfAnnotationBaseModel).subject;
            this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType, null, subject);
            if (this.drawingObject && this.currentPosition) {
                const drawingOptions: AnnotationDrawingOptionsModel = this.pdfViewerBase.pdfViewer.annotationDrawingOptions;

                if (!isNullOrUndefined(drawingOptions) && (drawingOptions.enableLineAngleConstraints || args.info.shiftKey) &&
                    Number.isInteger(drawingOptions.restrictLineAngleTo) &&
                    drawingOptions.restrictLineAngleTo > 0 &&
                    drawingOptions.restrictLineAngleTo <= 360 && obj.vertexPoints.length >= 2) {
                    const fixedPoint: PointModel = obj.vertexPoints[obj.vertexPoints.length - 2];
                    const restrictAngle: number = drawingOptions.restrictLineAngleTo;
                    const currentX: number = this.currentPosition.x / this.pdfViewerBase.getZoomFactor();
                    const currentY: number = this.currentPosition.y / this.pdfViewerBase.getZoomFactor();
                    const previousX: number = this.prevPosition.x / this.pdfViewerBase.getZoomFactor();
                    const previousY: number = this.prevPosition.y / this.pdfViewerBase.getZoomFactor();
                    const previousPoint: PointModel  = (fixedPoint.x === previousX && fixedPoint.y === previousY)
                        ? { x: currentX, y: currentY }
                        : { x: previousX, y: previousY };
                    const result: PointModel = this.getSnappedPosition(currentX - fixedPoint.x, currentY - fixedPoint.y, fixedPoint,
                                                                       previousPoint, restrictAngle);
                    obj.vertexPoints[obj.vertexPoints.length - 1].x = result.x;
                    obj.vertexPoints[obj.vertexPoints.length - 1].y = result.y;
                }
                else {
                    obj.vertexPoints[obj.vertexPoints.length - 1].x = this.currentPosition.x / this.pdfViewerBase.getZoomFactor();
                    obj.vertexPoints[obj.vertexPoints.length - 1].y = this.currentPosition.y / this.pdfViewerBase.getZoomFactor();
                }
                this.commandHandler.nodePropertyChange(obj, { vertexPoints: obj.vertexPoints });
            }
            if (obj.measureType === 'Perimeter') {
                updatePerimeterLabel(obj, obj.vertexPoints, this.commandHandler.annotation.measureAnnotationModule);
            }
        }
        return true;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @param {boolean} isDoubleClineck - Specified the double click event or not.
     * @param {boolean} isMouseLeave - Specified the mouse leave event or not.
     * @returns {void}
     */
    public mouseUp(args: MouseEventArgs, isDoubleClineck?: boolean, isMouseLeave?: boolean): void {
        let needToDrawPolygon: boolean = false;
        super.mouseMove(args);
        const annotationSelectorSettings: AnnotationSelectorSettingsModel = cloneObject(this.commandHandler.annotationSelectorSettings);
        const shapeType: string = (args.source as PdfAnnotationBaseModel) && (args.source as PdfAnnotationBaseModel).shapeAnnotationType;
        const subject: string = (args.source as PdfAnnotationBaseModel) && (args.source as PdfAnnotationBaseModel).subject;
        this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType, null, subject);
        if (this.drawingObject && this.drawingObject.vertexPoints.length === 2 && isDoubleClineck && isMouseLeave) {
            this.commandHandler.remove(this.drawingObject);
            needToDrawPolygon = true;
            this.endAction();
        }
        if (this.drawingObject && !needToDrawPolygon) {
            const bounds: Rect = new Rect(this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length - 1].x - 20,
                                          this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length - 1].y - 20, 40, 40);
            const point: PointModel = { x: this.drawingObject.vertexPoints[0].x, y: this.drawingObject.vertexPoints[0].y };
            if ((bounds.containsPoint(point) || isDoubleClineck) && this.dragging) {
                if (this.inAction) {
                    this.inAction = false;
                    if (this.drawingObject) {
                        if (!isMouseLeave && isDoubleClineck) {
                            if (this.drawingObject.vertexPoints.length > 2 && !args.isTouchMode) {
                                this.drawingObject.vertexPoints.splice(this.drawingObject.vertexPoints.length - 1, 1);
                            }
                        }
                        if (this.action === 'Polygon') {
                            if (!isMouseLeave) {
                                this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length - 1] =
                                 this.drawingObject.vertexPoints[0];
                            } else {
                                this.drawingObject.vertexPoints[this.drawingObject.vertexPoints.length] =
                                 this.drawingObject.vertexPoints[0];
                            }
                            this.commandHandler.nodePropertyChange(this.drawingObject, { vertexPoints: this.drawingObject.vertexPoints,
                                annotationSelectorSettings });
                            const cobject: PdfAnnotationBase = cloneObject(this.drawingObject) as PdfAnnotationBase;
                            cobject.shapeAnnotationType = 'Polygon';
                            cobject.bounds.width = cobject.wrapper.actualSize.width;
                            cobject.bounds.height = cobject.wrapper.actualSize.height;
                            cobject.bounds.x = this.drawingObject.wrapper.bounds.x;
                            cobject.bounds.y = this.drawingObject.wrapper.bounds.y;
                            this.commandHandler.add(cobject);
                            this.commandHandler.remove(this.drawingObject);
                            this.commandHandler.select([cobject.id], annotationSelectorSettings);
                            const drawingObject: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
                            if (drawingObject) {
                                if (this.commandHandler.enableShapeAnnotation && (isNullOrUndefined(drawingObject.measureType) || drawingObject.measureType === '')) {
                                    this.commandHandler.annotation.shapeAnnotationModule.
                                        renderShapeAnnotations(drawingObject, drawingObject.pageIndex);
                                }
                                if (this.commandHandler.enableMeasureAnnotation && (drawingObject.measureType === 'Area' || drawingObject.measureType === 'Volume')) {
                                    if (drawingObject.measureType === 'Area') {
                                        drawingObject.notes = this.commandHandler.annotation.measureAnnotationModule.
                                            calculateArea(drawingObject.vertexPoints);
                                        this.commandHandler.annotation.stickyNotesAnnotationModule.
                                            addTextToComments(drawingObject.annotName, drawingObject.notes);
                                    } else if (drawingObject.measureType === 'Volume') {
                                        drawingObject.notes = this.commandHandler.annotation.measureAnnotationModule.
                                            calculateVolume(drawingObject.vertexPoints);
                                        this.commandHandler.annotation.stickyNotesAnnotationModule.
                                            addTextToComments(drawingObject.annotName, drawingObject.notes);
                                    }
                                    if (drawingObject.enableShapeLabel) {
                                        drawingObject.labelContent = drawingObject.notes;
                                        this.commandHandler.nodePropertyChange(drawingObject,
                                                                               { vertexPoints: drawingObject.vertexPoints,
                                                                                   notes: drawingObject.notes });
                                    }
                                    this.commandHandler.annotation.measureAnnotationModule.
                                        renderMeasureShapeAnnotations(drawingObject, drawingObject.pageIndex);
                                }
                            }
                        } else {
                            if (!isMouseLeave) {
                                if (isDoubleClineck) {
                                    this.drawingObject.vertexPoints.splice(this.drawingObject.vertexPoints.length - 1, 1);
                                }
                            }
                            this.commandHandler.nodePropertyChange(this.drawingObject, {
                                vertexPoints: this.drawingObject.vertexPoints,
                                sourceDecoraterShapes: this.commandHandler.drawingObject.sourceDecoraterShapes,
                                taregetDecoraterShapes: this.commandHandler.drawingObject.taregetDecoraterShapes
                            });
                            this.commandHandler.select([this.drawingObject.id], annotationSelectorSettings);
                            if (this.commandHandler.enableMeasureAnnotation && this.drawingObject.measureType === 'Perimeter') {
                                this.commandHandler.renderDrawing(null, this.drawingObject.pageIndex);
                                this.drawingObject.notes =
                                 this.commandHandler.annotation.measureAnnotationModule.calculatePerimeter(this.drawingObject);
                                if (this.drawingObject.enableShapeLabel) {
                                    this.drawingObject.labelContent = this.drawingObject.notes;
                                    this.commandHandler.nodePropertyChange(this.drawingObject,
                                                                           { vertexPoints: this.drawingObject.vertexPoints,
                                                                               notes: this.drawingObject.notes });
                                }
                                this.commandHandler.annotation.stickyNotesAnnotationModule.
                                    addTextToComments(this.drawingObject.annotName, this.drawingObject.notes);
                                this.commandHandler.annotation.measureAnnotationModule.
                                    renderMeasureShapeAnnotations(this.drawingObject, this.drawingObject.pageIndex);
                            }
                        }
                        const annotationObject: PdfAnnotationBaseModel = this.commandHandler.selectedItems.annotations[0];
                        this.commandHandler.annotation.addAction((this as any).pageIndex, null, annotationObject, 'Addition', '', annotationObject, annotationObject);
                        this.drawingObject = null;
                    }
                }
                this.endAction();
            } else if (this.inAction && !this.dragging) {
                this.commandHandler.remove(this.drawingObject);
            }
        }
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args, true, true);
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseWheel(args: MouseEventArgs): void {
        super.mouseWheel(args);
        this.mouseMove(args as MouseEventArgs);
    }

    /**
     * @private
     * @returns {void}
     */
    public endAction(): void {
        this.inAction = false;
        this.drawingObject = null;
        this.commandHandler.tool = '';
    }
}

/**
 * Helps to edit the selected connectors
 *
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

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
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
            const measureModule: MeasureAnnotation = this.commandHandler.annotation.measureAnnotationModule;
            const annotationSelectorSettings: AnnotationSelectorSettingsModel = cloneObject(this.commandHandler.annotationSelectorSettings);
            const shapeType: string = 'Distance';
            this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType);
            const annotationNode: PdfAnnotationBaseModel = {
                vertexPoints: [{ x: this.startPosition.x / this.pdfViewerBase.getZoomFactor(),
                    y: this.startPosition.y / this.pdfViewerBase.getZoomFactor() },
                { x: this.currentPosition.x / this.pdfViewerBase.getZoomFactor(),
                    y: this.currentPosition.y / this.pdfViewerBase.getZoomFactor() }],
                bounds: { x: this.currentPosition.x, y: this.currentPosition.y, width: 5, height: 5},
                sourceDecoraterShapes: this.commandHandler.drawingObject.sourceDecoraterShapes,
                taregetDecoraterShapes: this.commandHandler.drawingObject.taregetDecoraterShapes, measureType: 'Distance',
                fillColor: this.commandHandler.drawingObject.fillColor, notes: this.commandHandler.drawingObject.notes,
                strokeColor: this.commandHandler.drawingObject.strokeColor,
                opacity: this.commandHandler.drawingObject.opacity, thickness: this.commandHandler.drawingObject.thickness,
                borderDashArray: this.commandHandler.drawingObject.borderDashArray,
                shapeAnnotationType: 'Distance', pageIndex: this.pdfViewerBase.activeElements.activePageID,
                author: this.commandHandler.drawingObject.author, subject: this.commandHandler.drawingObject.subject,
                enableShapeLabel: this.commandHandler.enableShapeLabel, leaderHeight: measureModule.leaderLength,
                annotationSelectorSettings: annotationSelectorSettings,
                borderStyle: this.commandHandler.drawingObject.borderStyle
            };
            this.pdfViewerBase.updateFreeTextProperties(annotationNode);
            this.drawingObject = this.commandHandler.add(annotationNode as PdfAnnotationBase);
        } else if (!this.dragging) {
            const annotationSelectorSettings: AnnotationSelectorSettingsModel = cloneObject(this.commandHandler.annotationSelectorSettings);
            const shapeType: PdfAnnotationType = this.drawingObject.shapeAnnotationType;
            this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType);
            const nodeAnnot: PdfAnnotationBaseModel = {
                bounds: { x: this.currentPosition.x, y: this.currentPosition.y, width: 5, height: 5},
                vertexPoints: [{ x: this.startPosition.x / this.pdfViewerBase.getZoomFactor(),
                    y: this.startPosition.y / this.pdfViewerBase.getZoomFactor() },
                { x: this.currentPosition.x / this.pdfViewerBase.getZoomFactor(),
                    y: this.currentPosition.y / this.pdfViewerBase.getZoomFactor() }],
                shapeAnnotationType: this.drawingObject.shapeAnnotationType,
                sourceDecoraterShapes: this.drawingObject.sourceDecoraterShapes,
                taregetDecoraterShapes: this.drawingObject.taregetDecoraterShapes, fillColor: this.drawingObject.fillColor,
                strokeColor: this.drawingObject.strokeColor, pageIndex: this.pdfViewerBase.activeElements.activePageID,
                opacity: !isNullOrUndefined(this.drawingObject.opacity) ? this.drawingObject.opacity : 1,
                borderDashArray: this.drawingObject.borderDashArray,
                thickness: this.drawingObject.thickness,
                modifiedDate: this.drawingObject.modifiedDate, author: this.drawingObject.author, subject: this.drawingObject.subject,
                lineHeadEnd: this.drawingObject.lineHeadEnd, lineHeadStart: this.drawingObject.lineHeadStart,
                measureType: this.commandHandler.drawingObject.measureType, enableShapeLabel: this.commandHandler.enableShapeLabel,
                annotationSelectorSettings: annotationSelectorSettings,
                borderStyle: this.drawingObject.borderStyle
            };
            this.pdfViewerBase.updateFreeTextProperties(nodeAnnot);
            this.drawingObject = this.commandHandler.add(nodeAnnot as PdfAnnotationBase);
        }
    }

    private checkMinBounds(drawnAnnotation: PdfAnnotationBaseModel): PointModel[] | null {
        const modifiedVertexPoints: PointModel[] = [] as PointModel[];
        if (drawnAnnotation.shapeAnnotationType) {
            if ((drawnAnnotation.measureType === '' && (drawnAnnotation.shapeAnnotationType === 'Line'
                || drawnAnnotation.shapeAnnotationType === 'LineWidthArrowHead')) || drawnAnnotation.measureType === 'Distance') {
                const annotationSettings: AnnotationSettingsModel =
                    this.commandHandler.annotationModule.findAnnotationSettings(drawnAnnotation);
                const margin: number = 3;
                const minWidth: number = (annotationSettings.minWidth && annotationSettings.minWidth > 0) ? annotationSettings.minWidth : 0;
                const minHeight: number = (annotationSettings.minHeight && annotationSettings.minHeight > 0) ?
                    annotationSettings.minHeight : 0;
                const maxWidth: number = (annotationSettings.maxWidth && annotationSettings.maxWidth > 0) ? annotationSettings.maxWidth : 0;
                const maxHeight: number = (annotationSettings.maxHeight && annotationSettings.maxHeight > 0) ?
                    annotationSettings.maxHeight : 0;
                if (!(minHeight || minWidth || maxHeight || maxWidth)) {
                    return null;
                }
                const pageSize: ISize = this.pdfViewerBase.pageSize[drawnAnnotation.pageIndex];
                const firstVertex: PointModel = {
                    x: drawnAnnotation.vertexPoints[0].x,
                    y: drawnAnnotation.vertexPoints[0].y
                };
                const secondVertex: PointModel = {
                    x: drawnAnnotation.vertexPoints[1].x,
                    y: drawnAnnotation.vertexPoints[1].y
                };
                const adjustAxis: (firstPoint: number, secondPoint: number, min: number, max: number, limit: number)
                => { firstPoint: number; secondPoint: number; changed: boolean } =
                    (firstPoint: number, secondPoint: number, min: number, max: number, limit: number) => {
                        let changed: boolean = false;
                        const direction: number = (secondPoint >= firstPoint) ? 1 : -1;
                        const clamp: (val: number, low: number, high: number) => number
                            = (val: number, low: number, high: number) => Math.max(low, Math.min(high, val));
                        // calculate the desired length based on constraints
                        const current: number = Math.abs(secondPoint - firstPoint);
                        let desired: number = current;
                        if (min && min > 0 && desired < min) {
                            desired = min;
                        }
                        if (max && max > 0 && desired > max) {
                            desired = max;
                        }
                        if (desired !== current) {
                            secondPoint = firstPoint + direction * desired;
                            changed = true;
                        }
                        // Enforce page bounds for second point first.
                        // If clamp affects direction end, re-adjust first point to keep desired.
                        const low: number = margin;
                        const high: number = limit - margin;
                        if (secondPoint < low) {
                            secondPoint = low;
                            firstPoint = secondPoint - direction * desired;
                            changed = true;
                        } else if (secondPoint > high) {
                            secondPoint = high;
                            firstPoint = secondPoint - direction * desired;
                            changed = true;
                        }
                        // Ensure first point is also within bounds.
                        // if not, clamp and rebuild second point with same desired.
                        if (firstPoint < low) {
                            firstPoint = low;
                            secondPoint = firstPoint + direction * desired;
                            changed = true;
                        } else if (firstPoint > high) {
                            firstPoint = high;
                            secondPoint = firstPoint + direction * desired;
                            changed = true;
                        }
                        // Final safety clamp so both stay in range,
                        // possibly compromising desired if the page is too small
                        firstPoint = clamp(firstPoint, low, high);
                        secondPoint = clamp(secondPoint, low, high);
                        return { firstPoint: firstPoint, secondPoint: secondPoint, changed };
                    };
                let anyChange: boolean = false;
                // Adjust along X axis when min/max width specified
                if (minWidth || maxWidth) {
                    const resultX: { firstPoint: number, secondPoint: number, changed: boolean }
                         = adjustAxis(firstVertex.x, secondVertex.x, minWidth, maxWidth, pageSize.width);
                    firstVertex.x = resultX.firstPoint;
                    secondVertex.x = resultX.secondPoint;
                    anyChange = anyChange || resultX.changed;
                }
                // Adjust along Y axis when min/max height specified
                if (minHeight || maxHeight) {
                    const resultY: { firstPoint: number, secondPoint: number, changed: boolean }
                        = adjustAxis(firstVertex.y, secondVertex.y, minHeight, maxHeight, pageSize.height);
                    firstVertex.y = resultY.firstPoint;
                    secondVertex.y = resultY.secondPoint;
                    anyChange = anyChange || resultY.changed;
                }
                if (anyChange) {
                    modifiedVertexPoints[0] = firstVertex;
                    modifiedVertexPoints[1] = secondVertex;
                }
            }
            if (JSON.stringify(modifiedVertexPoints) !== '[]') {
                return modifiedVertexPoints;
            }
        }
        return null;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseUp(args: MouseEventArgs): void {
        if (this.dragging) {
            super.mouseMove(args);
            if (this.commandHandler) {
                const annotationSelectorSettings: AnnotationSelectorSettingsModel =
                    cloneObject(args.source && (args.source as PdfAnnotationBaseModel).annotationSelectorSettings);
                const shapeType: string = (args.source as PdfAnnotationBaseModel) &&
                    (args.source as PdfAnnotationBaseModel).shapeAnnotationType;
                this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType);
                const node: PdfAnnotationBaseModel = this.drawingObject;
                const modifiedVertexPoints: PointModel[] | null = this.checkMinBounds(node);
                if (!isNullOrUndefined(modifiedVertexPoints)) {
                    node.vertexPoints = modifiedVertexPoints;
                }
                this.commandHandler.nodePropertyChange(node, { vertexPoints: node.vertexPoints, leaderHeight: node.leaderHeight });
                this.commandHandler.clearSelection(this.pdfViewerBase.activeElements.activePageID);
                this.commandHandler.select([node.id], annotationSelectorSettings);
                this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, annotationSelectorSettings);
            }
            if (this.endPoint && this.endPoint.indexOf('ConnectorSegmentPoint') > -1 && this.dragging) {
                this.commandHandler.annotation.updateCalibrateValues(this.drawingObject);
                this.commandHandler.annotation.addAction((this as any).pageIndex, null, this.drawingObject, 'Addition', '', this.drawingObject, this.drawingObject);
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

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {boolean} - Returns true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            this.currentPosition = args.position;
            this.dragging = true;
            if (this.currentPosition && this.prevPosition) {
                let diffX: number = this.currentPosition.x - this.prevPosition.x;
                let diffY: number = this.currentPosition.y - this.prevPosition.y;
                const drawingOptions: AnnotationDrawingOptionsModel = this.pdfViewerBase.pdfViewer.annotationDrawingOptions;

                if (!isNullOrUndefined(drawingOptions) && (drawingOptions.enableLineAngleConstraints || args.info.shiftKey) &&
                    Number.isInteger(drawingOptions.restrictLineAngleTo) &&
                    drawingOptions.restrictLineAngleTo > 0 && drawingOptions.restrictLineAngleTo <= 360) {
                    const restrictAngle: number = drawingOptions.restrictLineAngleTo;
                    const deltaX: number = this.currentPosition.x - this.startPosition.x;
                    const deltaY: number = this.currentPosition.y - this.startPosition.y;
                    const previousPoint: PointModel  = (this.startPosition.x === this.prevPosition.x &&
                        this.startPosition.y === this.prevPosition.y)
                        ? this.currentPosition
                        : this.prevPosition;
                    const result: PointModel = this.getSnappedPosition(deltaX, deltaY, this.startPosition,
                                                                       previousPoint, restrictAngle);
                    this.currentPosition = {
                        x: result.x,
                        y: result.y
                    };
                }
                if ((this.drawingObject.measureType === '' && (this.drawingObject.shapeAnnotationType === 'Line'
                    || this.drawingObject.shapeAnnotationType === 'LineWidthArrowHead'))
                    || this.drawingObject.measureType === 'Distance') {
                    const zoom: number = this.commandHandler.viewerBase.getZoomFactor();
                    const annotationSettings: AnnotationSettingsModel = this.commandHandler.annotationModule ?
                        this.commandHandler.annotationModule.findAnnotationSettings(this.drawingObject) : {};
                    if (annotationSettings.maxWidth) {
                        const directionX: number = (this.currentPosition.x >= this.startPosition.x) ? 1 : -1;
                        if ((Math.abs(this.startPosition.x - this.currentPosition.x) / zoom) > annotationSettings.maxWidth) {
                            const dx: number = (Math.abs(this.startPosition.x - this.currentPosition.x) / zoom)
                                - annotationSettings.maxWidth;
                            diffX = 0;
                            this.currentPosition.x = this.currentPosition.x - (directionX * (dx * zoom));
                        }
                    }
                    if (annotationSettings.maxHeight) {
                        const directionY: number = (this.currentPosition.y >= this.startPosition.y) ? 1 : -1;
                        if ((Math.abs(this.startPosition.y - this.currentPosition.y) / zoom) > annotationSettings.maxHeight) {
                            const dy: number = (Math.abs(this.startPosition.y - this.currentPosition.y) / zoom)
                                - annotationSettings.maxHeight;
                            diffY = 0;
                            this.currentPosition.y = this.currentPosition.y - (directionY * (dy * zoom));
                        }
                    }
                }
                const annotationSelectorSettings: AnnotationSelectorSettingsModel =
                    cloneObject(this.commandHandler.annotationSelectorSettings);
                const shapeType: string = (args.source as PdfAnnotationBaseModel) &&
                    (args.source as PdfAnnotationBaseModel).shapeAnnotationType;
                this.pdfViewerBase.updateSelector(annotationSelectorSettings, shapeType);
                if (this.inAction && this.commandHandler && this.drawingObject &&
                     this.endPoint !== undefined && diffX !== 0 || diffY !== 0) {
                    this.blocked = !this.commandHandler.dragConnectorEnds(this.endPoint, this.drawingObject as IElement,
                                                                          this.currentPosition, this.selectedSegment,
                                                                          args.target, null, annotationSelectorSettings);
                    this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, annotationSelectorSettings);
                }
            }
            this.prevPosition = this.currentPosition;
        }
        return !this.blocked;

    }
    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    /**
     * @private
     * @returns {void}
     */
    public endAction(): void {
        super.endAction();
        this.prevPosition = null;
        this.endPoint = null;
    }
}

/**
 * Rotates the selected objects
 *
 * @hidden
 */
export class RotateTool extends ToolBase {
    constructor(commandHandler: PdfViewer, base: PdfViewerBase) {
        super(commandHandler, base, true);
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseDown(args: MouseEventArgs): void {
        const nodeMouseDown: PdfAnnotationBaseModel = cloneObject(args.source);
        this.undoElement = {
            bounds: {
                x: nodeMouseDown.wrapper.offsetX, y: nodeMouseDown.wrapper.offsetY,
                width: nodeMouseDown.wrapper.actualSize.width, height: nodeMouseDown.wrapper.actualSize.height
            }, rotateAngle: nodeMouseDown.rotateAngle

        } as SelectorModel;
        super.mouseDown(args);
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseUp(args: MouseEventArgs): void {
        const object: PdfAnnotationBaseModel | SelectorModel = args.source as PdfAnnotationBaseModel | Selector;
        let newShapeObject: SelectorModel;
        if (this.undoElement.rotateAngle !== object.wrapper.rotateAngle) {
            const currentSelector: AnnotationSelectorSettingsModel = (args.source as Selector).annotations[0].annotationSelectorSettings;
            this.commandHandler.renderSelector(this.pdfViewerBase.activeElements.activePageID, currentSelector);
            newShapeObject = {
                bounds: {
                    x: args.source.wrapper.offsetX, y: args.source.wrapper.offsetY,
                    width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                }, rotateAngle: args.source.wrapper.rotateAngle
            } as SelectorModel;
        }
        this.commandHandler.annotation.addAction((this as any).pageIndex, null, (args.source as Selector).annotations[0], 'Rotate', '', this.undoElement, newShapeObject);
        this.commandHandler.annotation.stampAnnotationModule.updateSessionStorage(args.source, null, 'Rotate');
        this.commandHandler.annotation.stickyNotesAnnotationModule.updateStickyNotes(args.source, null);
        super.mouseUp(args);
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {boolean} - Returns true or false.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        const object: PdfAnnotationBaseModel | SelectorModel = args.source as PdfAnnotationBaseModel | Selector;
        const currentSelector: AnnotationSelectorSettingsModel = (args.source as Selector).annotations[0].annotationSelectorSettings;
        this.currentPosition = args.position;
        if (object.wrapper) {
            const refPoint: PointModel = { x: object.wrapper.offsetX, y: object.wrapper.offsetY };
            let angle: number = Point.findAngle(refPoint, this.currentPosition) + 90;
            angle = (angle + 360) % 360;
            this.blocked = !(this.commandHandler.rotate(angle - object.wrapper.rotateAngle, currentSelector));
        }
        return !this.blocked;
    }

    private getTooltipContent(node: SelectorModel): string {
        return Math.round((node.rotateAngle % 360)).toString() + '\xB0';
    }

    /**
     * @private
     * @param {MouseEventArgs} args - Specified the mouse event arguments.
     * @returns {void}
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    /**
     * @private
     * @returns {void}
     */
    public endAction(): void {
        super.endAction();
    }
}

/**
 * Implements the 3-click progressive drawing flow for Callout annotations.
 *
 * Click 1: Starts a "Line" shape with two vertices (origin + cursor preview).
 * Click 2: Locks the second vertex as the knee-bend; adds a 3rd vertex (cursor).
 * Click 3: Finalises the leader line, computes the perimeter anchor on a default
 *           FreeText box, stores calloutLines on the annotation, then opens the
 *           FreeText input box so the user can type text. Auto-completes at click 3
 *           without needing a double-click (unlike PolygonDrawingTool).
 *
 * The visual line + arrowhead are re-rendered in
 * `Drawing.renderCalloutLeadersOnCanvas` on every canvas refresh (zoom/scroll).
 *
 * @hidden
 */
export class CalloutDrawingTool extends ToolBase {
    /** @private */
    public drawingObject: PdfAnnotationBaseModel;
    /** @private */
    public startPoint: PointModel;
    /** @private */
    public dragging: boolean;
    /** @private */
    private clickCount: number = 0;
    /** Canvas 2D context used for the preview rectangle during mousemove. */
    private previewCtx: CanvasRenderingContext2D = null;
    /** Textbox bounds (zoom-normalised) shown in the preview; reused verbatim on the third click. */
    private previewBounds: { x: number; y: number; width: number; height: number } = null;
    /** Anchor point (zoom-normalised) on the textbox boundary; reused verbatim on the third click. */
    private previewAnchor: PointModel = null;

    constructor(commandHandler: PdfViewer, base: PdfViewerBase) {
        super(commandHandler, base);
    }

    /**
     * Builds the initial Line drawing payload (used for the first click) but does NOT
     * add it to the model. Centralised so the deferred-create and the second-click
     * branches stay in sync.
     * @private
     * @returns {PdfAnnotationBaseModel} the un-initialised node element
     */
    private buildInitialNodeElement(): PdfAnnotationBaseModel {
        const annotationSelectorSettings: any = cloneObject(this.commandHandler.annotationSelectorSettings);
        return {
            bounds: { x: this.currentPosition.x, y: this.currentPosition.y, width: 5, height: 5 },
            vertexPoints: [
                { x: this.startPoint.x / this.pdfViewerBase.getZoomFactor(),
                    y: this.startPoint.y / this.pdfViewerBase.getZoomFactor() },
                { x: this.currentPosition.x / this.pdfViewerBase.getZoomFactor(),
                    y: this.currentPosition.y / this.pdfViewerBase.getZoomFactor() }
            ],
            shapeAnnotationType: 'Line',
            fillColor: this.commandHandler.drawingObject.fillColor,
            strokeColor: this.commandHandler.drawingObject.strokeColor,
            pageIndex: this.pdfViewerBase.activeElements.activePageID,
            notes: this.commandHandler.drawingObject.notes,
            thickness: this.commandHandler.drawingObject.thickness,
            author: this.commandHandler.drawingObject.author,
            subject: this.commandHandler.drawingObject.subject,
            borderDashArray: this.commandHandler.drawingObject.borderDashArray,
            modifiedDate: this.commandHandler.drawingObject.modifiedDate,
            opacity: this.commandHandler.drawingObject.opacity,
            annotationSelectorSettings: annotationSelectorSettings,
            sourceDecoraterShapes: (this.commandHandler.drawingObject as any).sourceDecoraterShapes || 'OpenArrow',
            taregetDecoraterShapes: 'None'
        };
    }

    /**
     * @private
     * @param {MouseEventArgs} args - mouse-down event arguments
     * @returns {void}
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        if (this.clickCount === 0) {
            this.startPoint = { x: this.startPosition.x, y: this.startPosition.y };
            this.drawingObject = null;
            this.clickCount = 1;
        } else if (this.clickCount === 1) {
            if (!this.drawingObject) {
                this.drawingObject = this.commandHandler.add(this.buildInitialNodeElement() as any);
            }
            // Second click: lock vertex[1] at the current cursor; add vertex[2].
            const obj: PdfAnnotationBaseModel = this.drawingObject;
            const annotationSelectorSettings: any = cloneObject(this.commandHandler.annotationSelectorSettings);
            const pt: PointModel = {
                x: this.currentPosition.x / this.pdfViewerBase.getZoomFactor(),
                y: this.currentPosition.y / this.pdfViewerBase.getZoomFactor()
            };
            obj.vertexPoints[1] = { x: pt.x, y: pt.y };
            obj.vertexPoints.push({ x: pt.x, y: pt.y });
            this.commandHandler.nodePropertyChange(obj, { vertexPoints: obj.vertexPoints, annotationSelectorSettings });
            this.clickCount = 2;
        } else if (this.clickCount === 2) {
            // Third click: finalise the callout using exactly the previewed bounds and anchor.
            this.clearPreview();
            const obj: PdfAnnotationBaseModel = this.drawingObject;
            const zoom: number = this.pdfViewerBase.getZoomFactor();
            if (!this.previewBounds || !this.previewAnchor) {
                const layout: { bounds: { x: number; y: number; width: number; height: number }; anchor: PointModel } =
                    this.computeCalloutLayout({ x: this.currentPosition.x / zoom, y: this.currentPosition.y / zoom },
                                              obj.vertexPoints[1]);
                this.previewBounds = layout.bounds;
                this.previewAnchor = layout.anchor;
            }
            const boxBounds: { x: number; y: number; width: number; height: number } = this.previewBounds;
            const anchor: PointModel = this.previewAnchor;
            const origin: PointModel = obj.vertexPoints[0];
            const knee: PointModel = obj.vertexPoints[1];
            const calloutLines: PointModel[] = [
                { x: origin.x, y: origin.y },
                { x: knee.x, y: knee.y },
                { x: anchor.x, y: anchor.y }
            ];
            const pageIndex: number = obj.pageIndex;
            this.commandHandler.remove(obj);
            this.drawingObject = null;
            this.previewBounds = null;
            this.previewAnchor = null;
            this.clickCount = 0;
            this.inAction = false;
            this.dragging = false;
            const annotData: CalloutSettings = {
                offset: { x: boxBounds.x, y: boxBounds.y },
                fontSize: 16,
                fontFamily: 'Helvetica',
                pageNumber: pageIndex + 1,
                width: boxBounds.width,
                height: boxBounds.height,
                borderColor: '#000000',
                borderWidth: 1,
                isLock: false,
                calloutLines: calloutLines,
                lineEndingStyle: 'Open',
                defaultText: 'Type Here'
            } as CalloutSettings;
            this.commandHandler.annotation.isAddedFromUI = true;
            this.commandHandler.annotation.addAnnotation('Callout', annotData);
            this.commandHandler.annotation.isAddedFromUI = false;
            const createdCallout: PdfAnnotationBaseModel =
                (this.commandHandler.selectedItems.annotations && this.commandHandler.selectedItems.annotations.length > 0)
                    ? this.commandHandler.selectedItems.annotations[0]
                    : (this.commandHandler.annotations.length > 0
                        ? this.commandHandler.annotations[this.commandHandler.annotations.length - 1]
                        : undefined);
            if (createdCallout) {
                this.commandHandler.annotation.addAction(
                    pageIndex, null, createdCallout, 'Addition', '',
                    createdCallout, createdCallout);
                this.commandHandler.clearSelection(pageIndex);
                this.commandHandler.select([createdCallout.id], createdCallout.annotationSelectorSettings);
                this.commandHandler.renderSelector(pageIndex, createdCallout.annotationSelectorSettings);
            }
            this.commandHandler.toolbarModule.annotationToolbarModule.primaryToolbar
                .deSelectItem(this.commandHandler.toolbarModule.annotationToolbarModule.calloutEditItem);
            this.endAction();
        }
    }

    /**
     * @private
     * @param {MouseEventArgs} args - mouse-move event arguments
     * @returns {boolean} - Returns true while the callout drawing remains active.
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            this.dragging = true;
            if (!this.drawingObject && this.clickCount === 1) {
                this.drawingObject = this.commandHandler.add(this.buildInitialNodeElement() as any);
            }
            if (this.drawingObject && this.clickCount === 2) {
                const obj: PdfAnnotationBaseModel = this.drawingObject;
                const mvZoom: number = this.pdfViewerBase.getZoomFactor();
                const layout: { bounds: { x: number; y: number; width: number; height: number }; anchor: PointModel } =
                    this.computeCalloutLayout({ x: this.currentPosition.x / mvZoom, y: this.currentPosition.y / mvZoom },
                                              obj.vertexPoints[1]);
                this.previewBounds = layout.bounds;
                this.previewAnchor = layout.anchor;
                obj.vertexPoints[2] = { x: layout.anchor.x, y: layout.anchor.y };
                this.commandHandler.nodePropertyChange(obj, { vertexPoints: obj.vertexPoints });
                this.drawPreviewBox(obj.pageIndex, layout.bounds);
            } else if (this.drawingObject) {
                const obj: PdfAnnotationBaseModel = this.drawingObject;
                const annotationSelectorSettings: AnnotationSelectorSettingsModel = cloneObject(
                    this.commandHandler.annotationSelectorSettings) as AnnotationSelectorSettingsModel;
                const zoom: number = this.pdfViewerBase.getZoomFactor();
                this.pdfViewerBase.updateSelector(annotationSelectorSettings, obj.shapeAnnotationType, null, obj.subject);
                const drawingOptions: AnnotationDrawingOptionsModel = this.pdfViewerBase.pdfViewer.annotationDrawingOptions;
                if (!isNullOrUndefined(drawingOptions) && (drawingOptions.enableLineAngleConstraints || args.info.shiftKey) &&
                    Number.isInteger(drawingOptions.restrictLineAngleTo) &&
                    drawingOptions.restrictLineAngleTo > 0 &&
                    drawingOptions.restrictLineAngleTo <= 360 && obj.vertexPoints.length >= 2) {
                    const fixedPoint: PointModel = obj.vertexPoints[obj.vertexPoints.length - 2];
                    const restrictAngle: number = drawingOptions.restrictLineAngleTo;
                    const currentX: number = this.currentPosition.x / zoom;
                    const currentY: number = this.currentPosition.y / zoom;
                    const previousX: number = this.prevPosition.x / zoom;
                    const previousY: number = this.prevPosition.y / zoom;
                    const previousPoint: PointModel = (fixedPoint.x === previousX && fixedPoint.y === previousY)
                        ? { x: currentX, y: currentY }
                        : { x: previousX, y: previousY };
                    const result: PointModel = this.getSnappedPosition(currentX - fixedPoint.x, currentY - fixedPoint.y, fixedPoint,
                                                                       previousPoint, restrictAngle);
                    obj.vertexPoints[obj.vertexPoints.length - 1].x = result.x;
                    obj.vertexPoints[obj.vertexPoints.length - 1].y = result.y;
                }
                else {
                    obj.vertexPoints[obj.vertexPoints.length - 1].x = this.currentPosition.x / this.pdfViewerBase.getZoomFactor();
                    obj.vertexPoints[obj.vertexPoints.length - 1].y = this.currentPosition.y / this.pdfViewerBase.getZoomFactor();
                }
                this.commandHandler.nodePropertyChange(obj, { vertexPoints: obj.vertexPoints });
            }
        }
        return true;
    }

    /**
     * @private
     * @param {MouseEventArgs} args - mouse-up event arguments
     * @returns {void}
     */
    public mouseUp(args: MouseEventArgs): void {
        super.mouseMove(args);
    }

    /**
     * @private
     * @param {MouseEventArgs} args - mouse-leave event arguments
     * @returns {void}
     */
    public mouseLeave(args: MouseEventArgs): void {
        if (this.drawingObject) {
            this.commandHandler.remove(this.drawingObject);
            this.drawingObject = null;
        }
        this.clearPreview();
        this.previewBounds = null;
        this.previewAnchor = null;
        this.clickCount = 0;
        this.inAction = false;
        this.dragging = false;
        this.endAction();
    }

    /**
     * Draws a dashed preview rectangle using the exact bounds that will be used for the
     * FreeText box created on the 3rd click.
     *
     * @private
     * @param {number} pageIndex - The page index whose annotation canvas should host the preview.
     * @param {object} bounds - Textbox bounds in zoom-normalised units.
     * @returns {void}
     */
    private drawPreviewBox(pageIndex: number, bounds: { x: number; y: number; width: number; height: number }): void {
        const canvas: HTMLCanvasElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex) as HTMLCanvasElement;
        if (!canvas || !canvas.getContext) {
            return;
        }
        const zoom: number = this.pdfViewerBase.getZoomFactor();
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        this.previewCtx = ctx;
        const rect: ClientRect = canvas.getBoundingClientRect();
        const cssWidth: number = rect.width;
        const cssHeight: number = rect.height;
        const scaleX: number = canvas.width / cssWidth;
        const scaleY: number = canvas.height / cssHeight;
        ctx.save();
        ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = (this.commandHandler.drawingObject.strokeColor as string) || '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(bounds.x * zoom, bounds.y * zoom, bounds.width * zoom, bounds.height * zoom);
        ctx.restore();
    }

    /**
     * Clears the dashed preview by re-triggering a draw of the page.
     * @private
     * @returns {void}
     */
    private clearPreview(): void {
        if (this.drawingObject) {
            const pageIndex: number = this.drawingObject.pageIndex;
            const canvas: HTMLCanvasElement = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageIndex) as HTMLCanvasElement;
            if (canvas) {
                this.commandHandler.renderDrawing(canvas, pageIndex);
            }
        }
        this.previewCtx = null;
    }

    /**
     * Computes the textbox bounds (centred on the cursor) and the connector anchor on the
     * textbox boundary (Left/Right/Top/Bottom centre) nearest to the knee point.
     * Shared by the mouse-move preview and the third click so both are identical.
     *
     * @private
     * @param {PointModel} cursor - Cursor position (zoom-normalised); the textbox centre.
     * @param {PointModel} knee - The knee point of the callout line.
     * @returns {object} The textbox bounds and the anchor point.
     */
    private computeCalloutLayout(cursor: PointModel, knee: PointModel):
    { bounds: { x: number; y: number; width: number; height: number }; anchor: PointModel } {
        const w: number = 200;
        const h: number = 40;
        const dx: number = cursor.x - knee.x;
        const dy: number = cursor.y - knee.y;
        let anchor: PointModel;
        if (Math.abs(dx) / (w / 2) >= Math.abs(dy) / (h / 2)) {
            anchor = dx > 0 ? { x: cursor.x - w / 2, y: cursor.y } : { x: cursor.x + w / 2, y: cursor.y };
        } else {
            anchor = dy > 0 ? { x: cursor.x, y: cursor.y - h / 2 } : { x: cursor.x, y: cursor.y + h / 2 };
        }
        return { bounds: { x: cursor.x - w / 2, y: cursor.y - h / 2, width: w, height: h }, anchor: anchor };
    }

    /**
     * @private
     * @returns {void}
     */
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
    isTouchMode?: boolean;
}

/**
 * @hidden
 */
export interface PositionChange {
    currentPosition: PointModel,
    prevPosition: PointModel;
}
