import { AllowedInteraction, AnnotationSelectorSettingsModel, RedactionSettingsModel, AnnotationType, ICommentsCollection, IPageAnnotations, IPoint, IRectangle, IReviewCollection, PdfAnnotationBase, PdfAnnotationBaseModel, PdfBoundsModel, PdfViewer, PdfViewerBase, updateColorWithOpacity, ITextMarkupAnnotation, ISize, IAnnotation } from '../../index';
import { Browser, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfAnnotationType } from '../drawing/enum';
import { Container } from '@syncfusion/ej2-drawings';

/**
 * Interface for Redaction Annotation
 *
 * @hidden
 */
export interface IRedactionAnnotation extends IAnnotation {
    bounds: any;
    rotateAngle: string;
    isLocked: boolean;
    pageNumber: number;
    annotationId: string;
    customData: object;
    overlayText: string;
    isRepeat: boolean;
    fontColor: string;
    fontSize: number;
    fontFamily: string;
    textAlign: string;
    markerFillColor: string;
    markerBorderColor: string;
    markerOpacity: number;
    isPrint: boolean;
    id?: string;
    allowedInteractions?: any;
    isReadonly?: boolean;
    redactionContent?: string;
    annotationAddMode?: string;
}

/**
 * RedactionAnnotation class to handle redaction annotations
 *
 * @hidden
 */
export class Redaction {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;

    /**
     * @private
     */
    public redactionFillColor: string;
    /**
     * @private
     */
    public redactionPageNumbers: any = [];
    /**
     * @private
     */
    public redactionFontColor: string;

    /**
     * @private
     */
    public redactionFontSize: number;

    /**
     * @private
     */
    public redactionFontFamily: string;

    /**
     * @private
     */
    public textAlign: string;

    /**
     * @private
     */
    public redactionMarkerFillColor: string;

    /**
     * @private
     */
    public redactionBorderColor: string;

    /**
     * @private
     */
    public redactionOutlineOpacity: number;

    /**
     * @private
     */
    public redactionCount: number = 0;

    /**
     * @private
     */
    public isAddAnnotationProgramatically: boolean = false;

    /**
     * @private
     */
    public isRepeat: boolean = false;

    /**
     * @private
     */
    public overlayText: string = '';

    /**
     * @private
     */
    public isRedactionHovered: boolean = false;
    private previousTool: string = '';
    private isAnnotationHoverd: boolean = false;
    private orginalFillColor: string;
    private orginalBorderColor: string;
    private orginalOpacity: number;
    private hoveredRedactionAnnotName: string = '';

    /**
     * @private
     */
    public hoveredRedactionId: string = '';

    /**
     * Update annotation details for programmatic addition
     * @param {RedactionSettingsModel} options - The redaction settings
     * @param {IPoint} offset - The offset point
     * @returns {any} The redaction annotation object
     * @private
     */
    public updateAddAnnotationDetails(options: RedactionSettingsModel, offset: IPoint): any {
        if (!options) {
            offset = options.bound || { x: 10, y: 10 };
        } else {
            offset.x = options.bound && !isNullOrUndefined(options.bound.x) ? options.bound.x : 10;
            offset.y = options.bound && !isNullOrUndefined(options.bound.y) ? options.bound.y : 10;
        }
        // Initialize the annotation settings
        const annotationSelectorSettings: any = options.annotationSelectorSettings ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.annotationSelectorSettings) ||
            this.pdfViewer.annotationSelectorSettings;
        const annotationSettings: any = this.pdfViewer.annotationModule.updateSettings(this.pdfViewer.redactionSettings);
        const allowedInteractions: any = options.allowedInteractions ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.allowedInteractions) ||
            this.pdfViewer.annotationSettings.allowedInteractions;
        // Creating the CurrentDate and Annotation name
        const currentDateString: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        const annotationName: string = 'redaction_' + this.pdfViewer.annotation.createGUID();
        // Get properties from options or default values
        const pageNumber: number = options.pageNumber !== undefined ? options.pageNumber : 0;
        const author: string = options.author ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.author) ||
            this.pdfViewer.annotationSettings.author ||
            'Guest';
        const markerFillColor: string = this.pdfViewer.annotationModule.hexToRgba((options as any).markerFillColor ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.markerFillColor) ||
            'rgba(255, 255, 255, 1)');
        const fillColor: string = this.pdfViewer.annotationModule.hexToRgba(options.fillColor ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.fillColor) ||
            'rgba(0, 0, 0, 0)');
        const markerBorderColor: string = this.pdfViewer.annotationModule.
            hexToRgba((options as any).markerBorderColor ||
                (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.markerBorderColor) ||
                'rgba(255, 0, 0, 1)');
        const markerOpacity: number = (options as any).markerOpacity ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.markerOpacity) ||
            1;
        const isPrint: boolean = !isNullOrUndefined(options.isPrint) ?
            !!options.isPrint :
            (this.pdfViewer.redactionSettings && !isNullOrUndefined(this.pdfViewer.redactionSettings.isPrint)) ?
                !!this.pdfViewer.redactionSettings.isPrint :
                true;
        const isLock: boolean = !isNullOrUndefined(options.isLock) ?
            !!options.isLock :
            (this.pdfViewer.redactionSettings && !isNullOrUndefined(this.pdfViewer.redactionSettings.isLock)) ?
                !!this.pdfViewer.redactionSettings.isLock :
                false;
        const overlayText: string = (options as any).overlayText ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.overlayText) ||
            '';
        const fontColor: string = this.pdfViewer.annotationModule.hexToRgba(options.fontColor ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.fontColor) ||
            'rgba(255, 0, 0, 1)');
        const fontSize: number = !isNullOrUndefined(options.fontSize) ?
            options.fontSize || 10 :
            (this.pdfViewer.redactionSettings && !isNullOrUndefined(this.pdfViewer.redactionSettings.fontSize)) ?
                this.pdfViewer.redactionSettings.fontSize || 10 :
                10;
        const fontFamily: string = options.fontFamily ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.fontFamily) ||
            'Helvetica';
        const textAlign: string = options.textAlignment ||
            (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.textAlignment) ||
            'center';
        // Set width and height
        const width: number = options.bound ? options.bound.width : 100;
        const height: number = options.bound ? options.bound.height : 50;
        // Update annotation settings
        annotationSettings.isLock = isLock;
        annotationSettings.minHeight = options.minHeight || 0;
        annotationSettings.minWidth = options.minWidth || 0;
        annotationSettings.maxWidth = options.maxWidth || 0;
        annotationSettings.maxHeight = options.maxHeight || 0;
        // Creating Redaction Annotation object with its proper properties
        const redactionAnnotation: any = [];
        const redaction: any = {
            Id: ('redaction' + this.redactionCount++) || 'redaction_' + this.pdfViewer.annotation.createGUID(),
            AllowedInteractions: options.allowedInteractions || allowedInteractions,
            AnnotName: annotationName,
            AnnotType: 'redaction',
            AnnotationSelectorSettings: annotationSelectorSettings,
            AnnotationSettings: annotationSettings,
            Author: author,
            Bounds: {
                X: offset.x,
                Y: offset.y,
                Width: width,
                Height: height,
                Left: offset.x, Top: offset.y,
                Location: { X: offset.x, Y: offset.y },
                Size: { Height: height, IsEmpty: false, Width: width }
            },
            Comments: [],
            CustomData: options.customData || null,
            CreatedDate: currentDateString,
            ExistingCustomData: null,
            FillColor: fillColor,
            FontColor: fontColor,
            FontSize: fontSize,
            FontFamily: fontFamily,
            IsCommentLock: false,
            IsLocked: isLock,
            IsPrint: isPrint,
            MarkerFillColor: markerFillColor,
            MarkerBorderColor: markerBorderColor,
            MarkerOpacity: markerOpacity,
            ModifiedDate: currentDateString,
            Note: '',
            OverlayText: overlayText,
            IsRepeat: (options as any).isRepeat || false,
            RotateAngle: 'RotateAngle0',
            ShapeAnnotationType: 'Redaction',
            State: '',
            StateModel: 'Review',
            Subject: 'Redaction',
            TextAlign: textAlign
        };
        // Adding the annotation object to an array
        redactionAnnotation[0] = redaction;
        // Create the annotation collection for the page if it doesn't exist
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_redaction');
        let annotObject: IPageAnnotations[] = [];
        if (storeObject) {
            annotObject = JSON.parse(JSON.stringify(storeObject));
        }
        // Create annotation object for storage
        const annotationObject: IRedactionAnnotation = {
            shapeAnnotationType: 'Redaction',
            author: author,
            modifiedDate: currentDateString,
            subject: 'Redaction',
            note: '',
            bounds: {
                left: offset.x,
                top: offset.y,
                width: width,
                height: height,
                right: offset.x + width,
                bottom: offset.y + height
            },
            rotateAngle: '0',
            isLocked: isLock,
            annotName: annotationName,
            pageNumber: pageNumber,
            annotationId: annotationName,
            annotationSelectorSettings: annotationSelectorSettings,
            customData: options.customData || {},
            overlayText: overlayText,
            isRepeat: (options as any).isRepeat || false,
            fontColor: fontColor,
            fillColor: fillColor,
            fontSize: fontSize,
            fontFamily: fontFamily,
            textAlign: textAlign,
            markerFillColor: markerFillColor,
            markerBorderColor: markerBorderColor,
            markerOpacity: markerOpacity,
            isPrint: isPrint,
            id: redactionAnnotation[0].Id,
            comments: [],
            review: {} as IReviewCollection,
            isCommentLock: false,
            isReadonly: false,
            annotationSettings: annotationSettings,
            allowedInteractions: allowedInteractions
        };
        const index: number = this.pdfViewer.annotation.getPageCollection(annotObject, pageNumber);
        if (index === -1 || !annotObject[index as number]) {
            const pageAnnotations: IPageAnnotations = {
                pageIndex: pageNumber,
                annotations: [annotationObject]
            };
            annotObject.push(pageAnnotations);
        } else {
            annotObject[index as number].annotations.push(annotationObject);
        }
        redactionAnnotation[0].Id = annotationObject.id;
        // Return the annotation in the correct format for the pdfAnnotation object
        return { redactionAnnotation };
    }

    /**
     * Handle redaction annotation hover
     * @param {PdfAnnotationBaseModel} annotation - The annotation being hovered
     * @param {number} pageIndex - The page index
     * @param {any} currentAnnot - currentAnnot
     * @returns {void}
     * @private
     */
    public handleRedactionHover(annotation: PdfAnnotationBaseModel, pageIndex: number, currentAnnot?: any): void {
        const currentAnnotationId: string = (annotation.id as string) || '';
        this.previousTool = this.pdfViewer.tool;
        this.hoveredRedactionAnnotName = annotation.annotName;
        let selectedAnnotationIsRedaction: boolean = false;
        if (this.pdfViewer.selectedItems.annotations && this.pdfViewer.selectedItems.annotations.length > 0 && this.pdfViewer.selectedItems.annotations[0].id === 'diagram_helper') {
            selectedAnnotationIsRedaction = true;
        }
        if (currentAnnotationId !== 'diagram_helper' && this.hoveredRedactionId !== 'diagram_helper' && !selectedAnnotationIsRedaction) {
            // If hovering over a different annotation than before, reset the previous one
            if (this.isRedactionHovered && this.hoveredRedactionId !== currentAnnotationId) {
                this.resetRedactionHover();
            }
            // Apply hover effect to the current annotation
            if (!this.isRedactionHovered || this.hoveredRedactionId !== currentAnnotationId) {
                // Store the original fill color
                annotation.originalFillColor = annotation.markerFillColor || '';
                // Change the fill color to yellow on hover
                if (annotation.wrapper && annotation.wrapper.children && annotation.wrapper.children.length > 0 && annotation.fillColor) {
                    const fillColor: string = updateColorWithOpacity(annotation.fillColor, 1);
                    annotation.wrapper.children[0].style.fill = fillColor;
                    annotation.wrapper.children[0].style.strokeColor = fillColor;
                    annotation.wrapper.children[0].style.opacity = 1;
                }
                if (annotation.annotationAddMode === 'TextRedaction') {
                    this.orginalFillColor = annotation.markerFillColor;
                    this.orginalBorderColor = annotation.markerBorderColor;
                    this.orginalOpacity = annotation.markerOpacity;
                }
                // Render overlay text if it exists
                if (annotation.overlayText) {
                    this.pdfViewer.annotation.redactionOverlayTextModule.renderRedactionOverlayText(annotation, currentAnnot);
                }
                this.isAnnotationHoverd = true;
                // Re-render the annotation with the new color
                const canvasElement: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                if (canvasElement) {
                    this.pdfViewer.renderDrawing(canvasElement, pageIndex);
                }
                this.isAnnotationHoverd = false;
                // Set flag to prevent re-rendering on every mouse move
                this.isRedactionHovered = true;
                this.hoveredRedactionId = currentAnnotationId;
            }
        }
    }

    /**
     * Reset redaction annotation hover state
     * @returns {void}
     * @private
     */
    public resetRedactionHover(): void {
        if (this.isRedactionHovered) {
            this.pdfViewer.tool = this.previousTool;
            this.previousTool = '';
            this.isAnnotationHoverd = false;
            // Check in selectedItems.annotations
            if (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.annotations) {
                for (let i: number = 0; i < this.pdfViewer.selectedItems.annotations.length; i++) {
                    const annotation: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[i as number];
                    if (annotation && annotation.shapeAnnotationType === 'Redaction') {
                        // Remove overlay text
                        if (annotation.overlayText) {
                            this.pdfViewer.annotation.redactionOverlayTextModule.removeRedactionOverlayText(annotation);
                        }
                        // Reset fill color
                        if (annotation.originalFillColor) {
                            if (annotation.wrapper && annotation.wrapper.children && annotation.wrapper.children.length > 0) {
                                const opacity: number = annotation.markerOpacity > 1 ? annotation.markerOpacity / 100 :
                                    annotation.markerOpacity;
                                const fillColor: string = updateColorWithOpacity(
                                    annotation.originalFillColor, annotation.markerOpacity as number);
                                annotation.wrapper.children[0].style.fill = fillColor;
                                annotation.wrapper.children[0].style.strokeColor = annotation.markerBorderColor;
                                annotation.wrapper.children[0].style.opacity = opacity;
                            }
                            delete annotation.originalFillColor;
                        }
                        // Re-render the annotation with the original color
                        const canvasElement: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + annotation.pageIndex);
                        if (canvasElement) {
                            this.pdfViewer.renderDrawing(canvasElement, annotation.pageIndex);
                        }
                    }
                }
            }
            // Also check in nameTable
            if (this.pdfViewer.nameTable) {
                // If we have a specific hovered redaction ID, only reset that one
                if (this.hoveredRedactionId && (this.pdfViewer.nameTable as any)[this.hoveredRedactionId]) {
                    const annotation: any = (this.pdfViewer.nameTable as any)[this.hoveredRedactionId];
                    if (annotation && annotation.shapeAnnotationType === 'Redaction') {
                        // Remove overlay text
                        if (annotation.overlayText) {
                            this.pdfViewer.annotation.redactionOverlayTextModule.removeRedactionOverlayText(annotation);
                        }
                        // Reset fill color
                        if (annotation.originalFillColor) {
                            if (annotation.wrapper && annotation.wrapper.children && annotation.wrapper.children.length > 0) {
                                const opacity: number = annotation.markerOpacity > 1 ? annotation.markerOpacity / 100 :
                                    annotation.markerOpacity;
                                const fillColor: string = updateColorWithOpacity(annotation.originalFillColor, annotation.markerOpacity);
                                annotation.wrapper.children[0].style.fill = fillColor;
                                annotation.wrapper.children[0].style.strokeColor = annotation.markerBorderColor;
                                annotation.wrapper.children[0].style.opacity = opacity;
                            }
                            delete annotation.originalFillColor;
                        }
                        // Re-render the annotation with the original color
                        const canvasElement: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + annotation.pageIndex);
                        if (canvasElement) {
                            this.pdfViewer.renderDrawing(canvasElement, annotation.pageIndex);
                        }
                    }
                } else {
                    // Otherwise check all annotations in the nameTable
                    for (const key in this.pdfViewer.nameTable) {
                        if (Object.prototype.hasOwnProperty.call(this.pdfViewer.nameTable, key)) {
                            const annotation: any = (this.pdfViewer.nameTable as any)[key as string];
                            if (annotation && annotation.shapeAnnotationType === 'Redaction') {
                                // Remove overlay text
                                if (annotation.overlayText) {
                                    this.pdfViewer.annotation.redactionOverlayTextModule.removeRedactionOverlayText(annotation);
                                }
                                // Reset fill color
                                if (annotation.originalFillColor) {
                                    if (annotation.wrapper && annotation.wrapper.children && annotation.wrapper.children.length > 0) {
                                        const opacity: number = annotation.markerOpacity > 1 ? annotation.markerOpacity / 100 :
                                            annotation.markerOpacity;
                                        const fillColor: string = updateColorWithOpacity(
                                            annotation.originalFillColor, annotation.markerOpacity);
                                        annotation.wrapper.children[0].style.fill = fillColor;
                                        annotation.wrapper.children[0].style.strokeColor = annotation.markerBorderColor;
                                        annotation.wrapper.children[0].style.opacity = opacity;
                                    }
                                    delete annotation.originalFillColor;
                                }
                                // Re-render the annotation with the original color
                                const canvasElement: any = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + annotation.pageIndex);
                                if (canvasElement) {
                                    this.pdfViewer.renderDrawing(canvasElement, annotation.pageIndex);
                                }
                            }
                        }
                    }
                }
            }
            // Reset the hover state
            this.isRedactionHovered = false;
            this.hoveredRedactionId = '';
        }
    }

    /**
     * Constructor for RedactionAnnotation class
     * @param {PdfViewer} pdfviewer - The PDF Viewer instance
     * @param {PdfViewerBase} pdfViewerBase - The PDF Viewer Base instance
     */
    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
        this.initializeRedactionProperties();
    }

    /**
     * Initialize redaction properties with default values or from settings
     * @returns {void}
     * @private
     */
    private initializeRedactionProperties(): void {
        if (this.pdfViewer.redactionSettings) {
            this.redactionFillColor = this.pdfViewer.redactionSettings.markerFillColor || 'rgba(0, 0, 0, 1)';
            this.redactionMarkerFillColor = this.pdfViewer.redactionSettings.markerFillColor || 'rgba(255, 255, 255, 1)';
            this.redactionBorderColor = this.pdfViewer.redactionSettings.markerBorderColor || 'rgba(255, 0, 0, 1)';
            this.redactionOutlineOpacity = this.pdfViewer.redactionSettings.markerOpacity || 1;
        } else {
            this.redactionFillColor = 'rgba(0, 0, 0, 1)';
            this.redactionMarkerFillColor = 'rgba(255, 255, 255, 1)';
            this.redactionBorderColor = 'rgba(255, 0, 0, 1)';
            this.redactionOutlineOpacity = 1;
        }
        this.redactionPageNumbers = [];
    }

    /**
     * Render redaction annotations on the page
     * @param {any} redactionAnnotations - The redaction annotations to render
     * @param {number} pageNumber - The page number to render on
     * @param {boolean} isImportAction - Whether this is an import action
     * @param {any} isAnnotOrderAction - Whether this is an isAnnotOrderAction
     * @returns {void}
     * @private
     */
    public renderRedactionAnnotations(redactionAnnotations: any, pageNumber: number, isImportAction?: boolean,
                                      isAnnotOrderAction?: boolean): void {
        let isAdded: boolean = false;
        if (!isImportAction) {
            for (let p: number = 0; p < this.redactionPageNumbers.length; p++) {
                if (this.redactionPageNumbers[parseInt(p.toString(), 10)] === pageNumber) {
                    const pageAnnotations: any = this.getAnnotations(pageNumber, null);
                    // Check if annotation already exists
                    if (pageAnnotations !== null && redactionAnnotations) {
                        for (let k: number = 0; k < pageAnnotations.length; k++) {
                            for (let l: number = 0; l < pageAnnotations.length; l++) {
                                const redactAnnot: any = redactionAnnotations[l as number] ? redactionAnnotations[l as number] :
                                    redactionAnnotations;
                                const annotationName: string = redactAnnot.annotName ?
                                    redactAnnot.annotName : redactAnnot.AnnotName;
                                const pageAnnotationName: string = pageAnnotations[k as number].annotName ?
                                    pageAnnotations[k as number].annotName : pageAnnotations[k as number].AnnotName;
                                if (pageAnnotationName && annotationName && pageAnnotationName === annotationName) {
                                    isAdded = true;
                                    break;
                                }
                            }
                            if (isAdded) {
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
        if (redactionAnnotations && (!isAdded || isAnnotOrderAction)) {
            if (redactionAnnotations.length > 0) {
                this.redactionPageNumbers.push(pageNumber);
                for (let i: number = 0; i < redactionAnnotations.length; i++) {
                    const annotation: any = redactionAnnotations[i as number];
                    annotation.annotationAddMode =
                        this.pdfViewer.annotationModule.findAnnotationMode(annotation, pageNumber, annotation.AnnotType);

                    let annotationObject: IRedactionAnnotation = {} as IRedactionAnnotation;
                    const position: any = annotation.Bound ? annotation.Bound : annotation.Bounds;
                    const author: string = annotation.Author || '';

                    annotation.AnnotationSettings = annotation.AnnotationSettings ?
                        annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);

                    annotation.allowedInteractions = annotation.AllowedInteractions ?
                        annotation.AllowedInteractions :
                        this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);

                    let isPrint: boolean = true;
                    if (!isNullOrUndefined(annotation.IsPrint)) {
                        isPrint = annotation.IsPrint;
                    } else {
                        isPrint = !isNullOrUndefined(annotation.isPrint) ? annotation.isPrint : annotation.AnnotationSettings.isPrint;
                    }

                    if (annotation.IsLocked) {
                        annotation.AnnotationSettings.isLock = annotation.IsLocked;
                    }

                    // Create redaction annotation object
                    annotationObject = {
                        shapeAnnotationType: 'Redaction',
                        author: author,
                        modifiedDate: annotation.ModifiedDate || new Date().toLocaleString(),
                        subject: annotation.Subject || '',
                        note: annotation.Note || '',
                        bounds: {
                            left: position.X,
                            top: position.Y,
                            width: position.Width,
                            height: position.Height,
                            right: position.Right,
                            bottom: position.Bottom
                        },
                        rotateAngle: annotation.RotateAngle || '0',
                        isLocked: annotation.IsLocked || false,
                        annotName: annotation.AnnotName,
                        pageNumber: pageNumber,
                        annotationSelectorSettings: annotation.AnnotationSelectorSettings || this.pdfViewer.annotationSelectorSettings,
                        customData: this.pdfViewer.annotation.getCustomData(annotation),
                        overlayText: annotation.OverlayText || '',
                        isRepeat: annotation.IsRepeat,
                        fontColor: annotation.FontColor || 'rgba(255, 0, 0, 1)',
                        fillColor: annotation.FillColor || 'rgba(0, 0, 0, 1)',
                        fontSize: annotation.FontSize || 14,
                        fontFamily: annotation.FontFamily || 'Helvetica',
                        textAlign: annotation.TextAlign || 'center',
                        markerFillColor: annotation.MarkerFillColor || 'rgba(255, 255, 255, 1)',
                        markerBorderColor: annotation.MarkerBorderColor || 'rgba(255, 0, 0, 1)',
                        markerOpacity: annotation.MarkerOpacity || 1,
                        annotationSettings: annotation.AnnotationSettings,
                        allowedInteractions: annotation.allowedInteractions,
                        isPrint: isPrint,
                        annotationId: annotation.AnnotName || '',
                        id: (annotation.Id || ('redaction' + this.redactionCount++) || this.pdfViewer.annotationModule.createGUID() || 'redaction_id') as string,
                        comments: this.pdfViewer.annotationModule.getAnnotationComments(
                            annotation.Comments, annotation, annotation.Author),
                        review: {
                            state: annotation.State, stateModel: annotation.StateModel,
                            modifiedDate: annotation.ModifiedDate, author: annotation.Author
                        } as IReviewCollection,
                        isCommentLock: false,
                        isReadonly: annotation.IsReadonly || false,
                        originalName: annotation.OriginalName ? annotation.OriginalName : null
                    };

                    // Create PdfAnnotationBaseModel for redaction
                    const annot: any = {
                        author: author,
                        modifiedDate: annotationObject.modifiedDate,
                        annotName: annotationObject.annotName,
                        pageIndex: pageNumber,
                        bounds: {
                            x: position.X,
                            y: position.Y,
                            width: position.Width,
                            height: position.Height
                        },
                        strokeColor: annotationObject.markerBorderColor,
                        fillColor: annotationObject.fillColor,
                        thickness: 1,
                        comments: this.pdfViewer.annotationModule.getAnnotationComments(
                            annotation.Comments, annotation, annotation.Author),
                        id: annotationObject.id,
                        shapeAnnotationType: 'Redaction',
                        annotType: 'Redaction',
                        subject: annotationObject.subject,
                        notes: annotationObject.note,
                        annotationSelectorSettings: annotationObject.annotationSelectorSettings,
                        annotationSettings: annotationObject.annotationSettings,
                        annotationAddMode: annotation.annotationAddMode,
                        allowedInteractions: annotation.allowedInteractions,
                        isLocked: annotation.isLocked,
                        isPrint: isPrint,
                        overlayText: annotationObject.overlayText,
                        isRepeat: annotationObject.isRepeat,
                        markerFillColor: annotationObject.markerFillColor,
                        markerBorderColor: annotationObject.markerBorderColor || 'rgba(255, 0, 0, 1)',
                        markerOpacity: annotationObject.markerOpacity || 1,
                        fontColor: annotationObject.fontColor,
                        fontSize: annotationObject.fontSize,
                        fontFamily: annotationObject.fontFamily,
                        textAlign: annotationObject.textAlign
                    };

                    // Add the annotation to the viewer
                    this.pdfViewer.add(annot as PdfAnnotationBase);

                    // // Draw the redaction annotation
                    this.drawRedactionAnnotation(pageNumber, annot);

                    // Store in session storage
                    this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_redaction');

                    // Fire annotation add event if needed
                    if (this.isAddAnnotationProgramatically) {
                        const settings: any = {
                            shapeAnnotationType: annotationObject.shapeAnnotationType,
                            markerBorderColor: annot.strokeColor,
                            markerFillColor: annotationObject.markerFillColor,
                            opacity: annot.opacity,
                            overlayText: annotationObject.overlayText || '',
                            fontColor: annotationObject.fontColor,
                            fontSize: annotationObject.fontSize || 14,
                            fontFamily: annotationObject.fontFamily,
                            textAlign: annotationObject.textAlign,
                            author: author,
                            subject: annotationObject.subject,
                            modifiedDate: annotationObject.modifiedDate
                        };
                        this.pdfViewer.fireAnnotationAdd(annot.pageIndex || 0, annot.annotName || '', 'Redaction', annot.bounds, settings);
                    }
                }
                if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.redactionToolbarModule) {
                    this.pdfViewer.toolbarModule.redactionToolbarModule.showHideRedactIcon(true);
                }
            }
            else if (redactionAnnotations.shapeAnnotationType && redactionAnnotations.shapeAnnotationType === 'Redaction') {
                const annotation: IRedactionAnnotation = this.createAnnotationObject(redactionAnnotations);
                if (!isNullOrUndefined(redactionAnnotations.formFieldAnnotationType) &&
                redactionAnnotations.formFieldAnnotationType !== '') {
                    this.pdfViewer.annotationModule.isFormFieldShape = true;
                }
                else {
                    this.pdfViewer.annotationModule.isFormFieldShape = false;
                }
                if (annotation) {
                    this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotation, '_annotations_redaction');
                    this.pdfViewer.annotationModule.triggerAnnotationAdd(redactionAnnotations);
                }
            }
        }
    }
    private createAnnotationObject(annotation: any): IRedactionAnnotation {
        let bounds: IRectangle;
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        if (!annotation.formFieldAnnotationType) {
            const commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('redaction', (annotation.pageIndex + 1),
                                                                                                            annotation.shapeAnnotationType);
            if (commentsDivid) {
                document.getElementById(commentsDivid).id = annotationName;
            }
        }
        if (annotation.id) {
            const obj: any = (this.pdfViewer.nameTable as any)[annotation.id];
            this.updateRedactionProperties(obj);
        }
        annotation.annotName = annotationName;
        if (annotation.wrapper.bounds) {
            bounds = {
                left: annotation.wrapper.bounds.x,
                top: annotation.wrapper.bounds.y, height: annotation.wrapper.bounds.height, width: annotation.wrapper.bounds.width,
                right: annotation.wrapper.bounds.right, bottom: annotation.wrapper.bounds.bottom
            };
        } else {
            bounds = {
                left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0
            };
        }
        const annotationObject: IRedactionAnnotation = {
            shapeAnnotationType: 'Redaction',
            author: annotation.author,
            modifiedDate: annotation.modifiedDate || new Date().toLocaleString(),
            subject: annotation.subject || '',
            note: annotation.note || '',
            bounds: bounds,
            rotateAngle: annotation.rotateAngle || '0',
            isLocked: annotation.isLocked || false,
            annotName: annotation.annotName,
            pageNumber: annotation.pageIndex,
            annotationSelectorSettings: annotation.annotationSelectorSettings || this.pdfViewer.annotationSelectorSettings,
            customData: this.pdfViewer.redactionSettings.customData || {},
            overlayText: annotation.overlayText || '',
            isRepeat: annotation.isRepeat,
            fontColor: annotation.fontColor || 'rgba(255, 0, 0, 1)',
            fillColor: annotation.fillColor || 'rgba(0, 0, 0, 1)',
            fontSize: annotation.fontSize || 14,
            fontFamily: annotation.fontFamily || 'Helvetica',
            textAlign: annotation.textAlign || 'center',
            markerFillColor: annotation.markerFillColor || 'rgba(255, 255, 255, 1)',
            markerBorderColor: annotation.markerBorderColor || 'rgba(255, 0, 0, 1)',
            markerOpacity: annotation.markerOpacity || 1,
            annotationSettings: annotation.annotationSettings,
            allowedInteractions: this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation),
            isPrint: annotation.isPrint,
            annotationId: annotation.annotName || '',
            id: annotation.id || '',
            comments: annotation.comments,
            isCommentLock: annotation.isCommentLock,
            isReadonly: annotation.isReadonly || false,
            review: {
                state: '',
                stateModel: '' ,
                modifiedDate: this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime(),
                author: annotation.author
            } as IReviewCollection
        };
        this.updateRedactionProperties(annotationObject);
        return annotationObject;
    }

    private updateRedactionProperties(annotation: any): void {
        if (!this.pdfViewer.redactionSettings) {
            return;
        }
        const rs: RedactionSettingsModel = this.pdfViewer.redactionSettings;
        annotation.fillColor = !isNullOrUndefined(rs.fillColor) ? rs.fillColor : !isNullOrUndefined(annotation.fillColor) ? annotation.fillColor : 'rgba(0, 0, 0, 1)';
        annotation.fontColor = !isNullOrUndefined(rs.fontColor) ? rs.fontColor : !isNullOrUndefined(annotation.fontColor) ? annotation.fontColor : 'rgba(255, 0, 0, 1)';
        annotation.isRepeat = !isNullOrUndefined(rs.isRepeat) ? rs.isRepeat :
            !isNullOrUndefined(annotation.isRepeat) ? annotation.isRepeat : false;
        annotation.overlayText = !isNullOrUndefined(rs.overlayText) ? rs.overlayText : !isNullOrUndefined(annotation.overlayText) ? annotation.overlayText : '';
        annotation.fontSize = !isNullOrUndefined(rs.fontSize) ? rs.fontSize :
            !isNullOrUndefined(annotation.fontSize) ? annotation.fontSize : 14;
        annotation.fontFamily = !isNullOrUndefined(rs.fontFamily) ? rs.fontFamily : !isNullOrUndefined(annotation.fontFamily) ? annotation.fontFamily : 'Helvetica';
        annotation.textAlign = !isNullOrUndefined(rs.textAlignment) ? rs.textAlignment : !isNullOrUndefined(annotation.textAlign) ? annotation.textAlign : 'center';
        annotation.markerFillColor = !isNullOrUndefined(rs.markerFillColor) ? rs.markerFillColor : !isNullOrUndefined(annotation.markerFillColor) ? annotation.markerFillColor : 'rgba(255, 255, 255, 1)';
        annotation.markerBorderColor = !isNullOrUndefined(rs.markerBorderColor) ? rs.markerBorderColor : !isNullOrUndefined(annotation.markerBorderColor) ? annotation.markerBorderColor : 'rgba(255, 0, 0, 1)';
        annotation.markerOpacity = !isNullOrUndefined(rs.markerOpacity) ? rs.markerOpacity :
            !isNullOrUndefined(annotation.markerOpacity) ? annotation.markerOpacity : 1;
    }
    private drawRedactionAnnotation(pageNumber: number, annotation: any, canvas?: any): void {
        const bounds: any = annotation.bounds;
        if (canvas) {
            this.pdfViewer.renderDrawing(canvas, pageNumber);
        } else {
            const canvasElement: any = this.pdfViewerBase.getAnnotationCanvas('_annotationCanvas_', pageNumber);
            if (canvasElement) {
                this.pdfViewer.renderDrawing(canvasElement, pageNumber);
            }
        }
    }

    /**
     * Get annotation settings specific to redaction
     * @param {any} annotation - The annotation to get settings for
     * @returns {any} The annotation settings
     * @private
     */
    public getSettings(annotation: any): any {
        const settings: any = {};
        settings.pageNumber = annotation.pageNumber;
        settings.bounds = annotation.bounds;
        settings.annotationSelectorSettings = this.getSelector('Redaction', annotation.subject);
        settings.markerFillColor = annotation.markerFillColor || this.redactionFillColor;
        settings.markerBorderColor = annotation.markerBorderColor || this.redactionBorderColor;
        settings.markerOpacity = annotation.markerOpacity || this.redactionOutlineOpacity;
        // settings.opacity = annotation.opacity || this.redactionOpacity;
        settings.overlayText = annotation.overlayText || '';
        settings.fontColor = annotation.fontColor || 'rgba(255, 0, 0, 1)';
        settings.fontSize = annotation.fontSize || 14;
        settings.fontFamily = annotation.fontFamily || 'Helvetica';
        settings.textAlign = annotation.textAlign || 'center';
        return settings;
    }

    /**
     * Set annotation type to Redaction
     * @param {AnnotationType} type - The annotation type
     * @returns {void}
     * @private
     */
    public setAnnotationType(type: AnnotationType): void {
        if (type === 'Redaction') {
            this.initializeRedactionProperties();
            // this.pdfViewerBase.disableTextSelectionMode();

            const modifiedDate: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
            const author: string = (this.pdfViewer.annotationSettings.author !== 'Guest') ?
                this.pdfViewer.annotationSettings.author :
                (this.pdfViewer.redactionSettings && this.pdfViewer.redactionSettings.author) ?
                    this.pdfViewer.redactionSettings.author : 'Guest';
            const opacity: number = this.pdfViewer.redactionSettings.markerOpacity ? (this.pdfViewer.redactionSettings.markerOpacity > 1 ?
                (this.pdfViewer.redactionSettings.markerOpacity / 100) : this.pdfViewer.redactionSettings.markerOpacity) : 1;
            this.pdfViewer.drawingObject = {
                shapeAnnotationType: 'Redaction',
                // type: 'Redaction',
                strokeColor: this.redactionBorderColor,
                fillColor: this.pdfViewer.redactionSettings.fillColor || 'rgba(0, 0, 0, 1)',
                fontColor: this.pdfViewer.redactionSettings.fontColor || 'rgba(255, 0, 0, 1)',
                opacity: opacity,
                notes: '',
                thickness: 1,
                fontSize: 14,
                fontFamily: 'Helvetica',
                borderDashArray: '0',
                textAlign: 'center',
                modifiedDate: modifiedDate,
                author: author,
                subject: 'Redaction',
                overlayText: this.pdfViewer.redactionSettings.overlayText || '',
                markerFillColor: this.redactionMarkerFillColor,
                markerBorderColor: this.redactionBorderColor,
                markerOpacity: this.redactionOutlineOpacity,
                isCommentLock: false
            };
            this.pdfViewer.tool = 'DrawTool';
        }
    }

    /**
     * Update redaction annotation collections
     * @param {any} annotation - The annotation to update
     * @param {number} pageNumber - The page number
     * @returns {IRedactionAnnotation | null} The updated annotation object
     * @private
     */
    public updateRedactionAnnotationCollections(annotation: any, pageNumber: number): IRedactionAnnotation | null {
        let currentAnnotObject: IRedactionAnnotation | null = null;
        if (annotation) {
            let isLock: boolean = false;
            if (annotation.IsLocked) {
                isLock = annotation.IsLocked;
            }
            const author: any = annotation.Author || '';
            const allowedInteractions: any = annotation.AllowedInteractions ||
                this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
            if (annotation.Bound) {
                const annotationObject: IRedactionAnnotation = {
                    id: 'redaction' + this.redactionCount++,
                    shapeAnnotationType: 'Redaction',
                    author: author,
                    modifiedDate: annotation.ModifiedDate || new Date().toLocaleString(),
                    subject: annotation.Subject || '',
                    note: annotation.Note || '',
                    overlayText: annotation.OverlayText || '',
                    fontColor: annotation.FontColor || 'rgba(255, 0, 0, 1)',
                    fontSize: annotation.FontSize || 14,
                    fontFamily: annotation.FontFamily || 'Helvetica',
                    textAlign: annotation.TextAlign || 'center',
                    markerFillColor: annotation.MarkerFillColor || 'rgba(255, 255, 255, 1)',
                    markerBorderColor: annotation.MarkerBorderColor || 'rgba(255, 0, 0, 1)',
                    markerOpacity: annotation.MarkerOpacity || 1,
                    fillColor: annotation.fillColor || 'rgba(0, 0, 0, 1)',
                    isRepeat: annotation.IsRepeat || false,
                    bounds: {
                        left: annotation.Bound.X,
                        top: annotation.Bound.Y,
                        width: annotation.Bound.Width,
                        height: annotation.Bound.Height,
                        right: annotation.Bound.Right,
                        bottom: annotation.Bound.Bottom
                    },
                    rotateAngle: annotation.RotateAngle || '0',
                    isLocked: isLock,
                    annotationId: annotation.AnnotName,
                    pageNumber: pageNumber,
                    customData: this.pdfViewer.annotation.getCustomData(annotation),
                    allowedInteractions: allowedInteractions,
                    annotName: annotation.AnnotName,
                    annotationSelectorSettings: this.getSelector('Redaction', annotation.Subject),
                    annotationSettings: annotation.AnnotationSettings ||
                        this.pdfViewer.annotationModule.updateAnnotationSettings(annotation),
                    isPrint: annotation.IsPrint !== undefined ? annotation.IsPrint : true,
                    comments: annotation.Comments ? this.pdfViewer.annotationModule.getAnnotationComments(
                        annotation.Comments, annotation, annotation.Author) : [],
                    review: {
                        state: annotation.State,
                        stateModel: annotation.StateModel,
                        modifiedDate: annotation.ModifiedDate,
                        author: annotation.Author
                    },
                    isCommentLock: annotation.IsCommentLock,
                    // Add the missing properties:
                    isReadonly: annotation.IsReadonly || false
                };
                if (annotationObject.isLocked) {
                    annotationObject.annotationSettings.isLock = annotationObject.isLocked;
                }
                currentAnnotObject = annotationObject;
            }
        }
        return currentAnnotObject;
    }

    /**
     * Modify redaction annotation in collection
     * @param {string} property - The property to modify
     * @param {number} pageNumber - The page number
     * @param {any} annotationBase - The annotation to modify
     * @returns {IRedactionAnnotation | null} The modified annotation
     * @private
     */
    public modifyInCollection(property: string, pageNumber: number, annotationBase: any): IRedactionAnnotation | null {
        if (!isNullOrUndefined(annotationBase.formFieldAnnotationType) &&
        annotationBase.formFieldAnnotationType !== '') {
            this.pdfViewer.annotationModule.isFormFieldShape = true;
        } else {
            this.pdfViewer.annotationModule.isFormFieldShape = false;
        }
        this.pdfViewerBase.updateDocumentEditedProperty(true);
        let currentAnnotObject: IRedactionAnnotation | null = null;

        if (annotationBase) {
            if (property === 'bounds') {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase, true);
            }
        }
        const pageAnnotations: any[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (let i: number = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i as number].id ||
                    annotationBase.annotName === pageAnnotations[i as number].annotName) {
                    if (property === 'bounds') {
                        pageAnnotations[i as number].bounds = {
                            // x: annotationBase.bounds.x,
                            // y: annotationBase.bounds.y,
                            left: annotationBase.bounds.x,
                            top: annotationBase.bounds.y,
                            height: annotationBase.bounds.height,
                            width: annotationBase.bounds.width,
                            right: annotationBase.bounds.right ? annotationBase.bounds.right : annotationBase.wrapper.bounds.right,
                            bottom: annotationBase.bounds.bottom ? annotationBase.bounds.bottom : annotationBase.wrapper.bounds.bottom
                        };
                    } else if (property === 'fillColor') {
                        pageAnnotations[i as number].fillColor = annotationBase.fillColor;
                    } else if (property === 'useOverlayText') {
                        pageAnnotations[i as number].useOverlayText = annotationBase.useOverlayText;
                    } else if (property === 'isRepeat') {
                        pageAnnotations[i as number].isRepeat = annotationBase.isRepeat;
                    } else if (property === 'fill') {
                        pageAnnotations[i as number].markerFillColor = annotationBase.wrapper.children[0].style.fill;
                    } else if (property === 'stroke') {
                        pageAnnotations[i as number].markerBorderColor = annotationBase.wrapper.children[0].style.strokeColor;
                    } else if (property === 'opacity') {
                        pageAnnotations[i as number].markerOpacity = annotationBase.markerOpacity;
                    } else if (property === 'overlayText') {
                        pageAnnotations[i as number].overlayText = annotationBase.overlayText;
                    } else if (property === 'fontColor') {
                        pageAnnotations[i as number].fontColor = annotationBase.fontColor;
                    } else if (property === 'fontSize') {
                        pageAnnotations[i as number].fontSize = annotationBase.fontSize;
                    } else if (property === 'fontFamily') {
                        pageAnnotations[i as number].fontFamily = annotationBase.fontFamily;
                    } else if (property === 'textAlign') {
                        pageAnnotations[i as number].textAlign = annotationBase.textAlign;
                    } else if (property === 'notes') {
                        pageAnnotations[i as number].note = annotationBase.notes;
                    } else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    } else if (property === 'isLock') {
                        if (pageAnnotations[i as number].annotationSettings) {
                            pageAnnotations[i as number].annotationSettings.isLock = annotationBase.isLock;
                        }
                        pageAnnotations[i as number].isLock = annotationBase.isLock;
                    } else if (property === 'allowedInteractions') {
                        pageAnnotations[i as number].allowedInteractions = annotationBase.allowedInteractions;
                    } else if (property === 'isPrint') {
                        if (pageAnnotations[i as number].annotationSettings) {
                            pageAnnotations[i as number].annotationSettings.isPrint = annotationBase.isPrint;
                        }
                        pageAnnotations[i as number].isPrint = annotationBase.isPrint;
                    }
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i as number], pageNumber);
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    }

    /**
     * Add redaction annotation to collection
     * @param {number} pageNumber - The page number
     * @param {IRedactionAnnotation} annotationBase - The annotation to add
     * @returns {void} - void
     * @private
     */
    public addInCollection(pageNumber: number, annotationBase: IRedactionAnnotation): void {
        const pageAnnotations: IRedactionAnnotation[] = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
    }

    /**
     * Manage annotations in storage
     * @param {IRedactionAnnotation[]} pageAnnotations - The annotations for the page
     * @param {number} pageNumber - The page number
     * @returns {void} - void
     * @private
     */
    private manageAnnotations(pageAnnotations: IRedactionAnnotation[], pageNumber: number): void {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_redaction');
        if (storeObject) {
            this.pdfViewer.annotationsCollection.delete(this.pdfViewerBase.documentId + '_annotations_redaction');
            const index: number = this.pdfViewer.annotationModule.getPageCollection(storeObject, pageNumber);
            if (index != null && storeObject[parseInt(index.toString(), 10)]) {
                storeObject[parseInt(index.toString(), 10)].annotations = pageAnnotations;
            }
            this.pdfViewer.annotationsCollection.set(this.pdfViewerBase.documentId + '_annotations_redaction', storeObject);
        }
    }

    /**
     * Save imported redaction annotations
     * @param {any} annotation - The annotation to save
     * @param {number} pageIndex - The page index
     * @returns {void} - void
     * @private
     */
    public saveImportedRedactionAnnotations(annotation: any, pageIndex: number): void {
        if (annotation) {
            const annotationObject: IRedactionAnnotation = {
                shapeAnnotationType: 'Redaction',
                author: annotation.Author || '',
                modifiedDate: annotation.ModifiedDate || new Date().toLocaleString(),
                subject: annotation.Subject || '',
                note: annotation.Note || '',
                bounds: {
                    // x: annotation.Bounds.X,
                    // y: annotation.Bounds.Y,
                    left: annotation.Bounds.X,
                    top: annotation.Bounds.Y,
                    width: annotation.Bounds.Width,
                    height: annotation.Bounds.Height,
                    right: annotation.Bounds.X + annotation.Bounds.Width,
                    bottom: annotation.Bounds.Y + annotation.Bounds.Height
                },
                rotateAngle: annotation.RotateAngle || '0',
                isLocked: annotation.IsLocked || false,
                annotName: annotation.AnnotName,
                pageNumber: pageIndex,
                annotationId: annotation.AnnotName,
                annotationSelectorSettings: annotation.AnnotationSelectorSettings || this.pdfViewer.annotationSelectorSettings,
                customData: this.pdfViewer.annotation.getCustomData(annotation),
                overlayText: annotation.OverlayText || '',
                isRepeat: annotation.IsRepeat || false,
                fontColor: annotation.FontColor || 'rgba(255, 0, 0, 1)',
                fillColor: annotation.FillColor || 'rgba(0, 0, 0, 1)',
                fontSize: annotation.FontSize || 14,
                fontFamily: annotation.FontFamily || 'Helvetica',
                textAlign: annotation.TextAlign || 'center',
                markerFillColor: annotation.MarkerFillColor || 'rgba(255, 255, 255, 1)',
                markerBorderColor: annotation.MarkerBorderColor || 'rgba(255, 0, 0, 1)',
                markerOpacity: annotation.MarkerOpacity || 1,
                isPrint: annotation.IsPrint !== undefined ? annotation.IsPrint : true,
                id: (annotation.Id || this.pdfViewer.annotationModule.createGUID() || 'redaction_id') as string,
                comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author),
                review: {
                    state: annotation.State,
                    stateModel: annotation.StateModel,
                    modifiedDate: annotation.ModifiedDate,
                    author: annotation.Author
                },
                isCommentLock: annotation.IsCommentLock || false,
                isReadonly: annotation.IsReadonly || false,
                annotationSettings: annotation.AnnotationSettings || this.pdfViewer.annotationModule.updateAnnotationSettings(annotation),
                allowedInteractions: annotation.AllowedInteractions ||
                    this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation)
            };

            // Create PdfAnnotationBaseModel for redaction
            const annot: any = {
                author: annotationObject.author,
                modifiedDate: annotationObject.modifiedDate,
                annotName: annotationObject.annotName,
                pageIndex: pageIndex,
                bounds: {
                    left: annotationObject.bounds.left,
                    top: annotationObject.bounds.top,
                    width: annotationObject.bounds.width,
                    height: annotationObject.bounds.height
                },
                strokeColor: annotationObject.markerBorderColor,
                fillColor: annotationObject.fillColor,
                opacity: annotationObject.markerOpacity,
                thickness: 1,
                id: annotationObject.annotName,
                shapeAnnotationType: 'Redaction',
                annotType: 'Redaction',
                subject: annotationObject.subject,
                notes: annotationObject.note,
                annotationSelectorSettings: annotationObject.annotationSelectorSettings,
                annotationSettings: annotationObject.annotationSettings,
                annotationAddMode: 'Imported Annotation',
                isLocked: annotationObject.isLocked,
                isPrint: annotationObject.isPrint,
                overlayText: annotationObject.overlayText,
                isRepeat: annotationObject.isRepeat,
                markerFillColor: annotationObject.markerFillColor,
                markerBorderColor: annotationObject.markerBorderColor,
                markerOpacity: annotationObject.markerOpacity,
                fontColor: annotationObject.fontColor,
                fontSize: annotationObject.fontSize,
                fontFamily: annotationObject.fontFamily,
                textAlign: annotationObject.textAlign
            };

            // Add the annotation to the viewer
            this.pdfViewer.add(annot as PdfAnnotationBase);

            // Store in session storage
            this.pdfViewer.annotationModule.storeAnnotations(pageIndex, annotationObject, '_annotations_redaction');
        }
    }

    /**
     * Get selector settings for redaction annotation
     * @param {string} type - The annotation type
     * @param {string} subject - The annotation subject
     * @returns {AnnotationSelectorSettingsModel} The selector settings
     * @private
     */
    private getSelector(type: string, subject: string): AnnotationSelectorSettingsModel {
        return {
            resizerShape: 'Square',
            resizerSize: 8,
            resizerFillColor: '#FF4081',
            resizerBorderColor: '#FF4081',
            selectionBorderColor: '#FF4081'
        };
    }

    /**
     * Save redaction annotations to JSON format for export
     * @returns {string} JSON string of redaction annotations
     * @private
     */
    public saveRedactionAnnotations(): string {
        const storeObject: IPageAnnotations[] = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_redaction');
        const annotations: Array<any> = [];
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j as number] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            const annotationCollection: IPageAnnotations[] = JSON.parse(JSON.stringify(storeObject)) as IPageAnnotations[];
            for (let i: number = 0; i < annotationCollection.length; i++) {
                let newArray: IRedactionAnnotation[] = [];
                const pageAnnotationObject: IPageAnnotations = annotationCollection[i as number];
                if (pageAnnotationObject) {
                    for (let z: number = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[z as number]);
                        let bounds: PdfBoundsModel = pageAnnotationObject.annotations[z as number].bounds;
                        if (pageAnnotationObject.annotations[z as number].bounds.length > 1) {
                            bounds = this.combineBounds(pageAnnotationObject.annotations[z as number], true);
                        }
                        // Convert properties to the expected format
                        pageAnnotationObject.annotations[z as number].bounds = JSON.stringify(this.pdfViewer.annotation
                            .getBounds(bounds, pageAnnotationObject.pageIndex));
                        const markerFillColorString: string = pageAnnotationObject.annotations[z as number].markerFillColor || '';
                        pageAnnotationObject.annotations[z as number].markerFillColor =
                            JSON.stringify(this.getRgbCode(markerFillColorString));

                        const markerBorderColorString: string = pageAnnotationObject.annotations[z as number].markerBorderColor || '';
                        pageAnnotationObject.annotations[z as number].markerBorderColor =
                            JSON.stringify(this.getRgbCode(markerBorderColorString));

                        const fillColorString: string = pageAnnotationObject.annotations[z as number].fillColor || '';
                        pageAnnotationObject.annotations[z as number].fillColor = JSON.stringify(this.getRgbCode(fillColorString));

                        const opacity: number = pageAnnotationObject.annotations[z as number].markerOpacity > 1 ?
                            pageAnnotationObject.annotations[z as number].markerOpacity / 100 :
                            pageAnnotationObject.annotations[z as number].markerOpacity;
                        pageAnnotationObject.annotations[z as number].markerOpacity = opacity;

                        if (pageAnnotationObject.annotations[z as number].fontColor) {
                            const fontColorString: string = pageAnnotationObject.annotations[z as number].fontColor || '';
                            pageAnnotationObject.annotations[z as number].fontColor = JSON.stringify(this.getRgbCode(fontColorString));
                        }
                    }
                    pageAnnotationObject.annotations = pageAnnotationObject.annotations.filter((item: any) => item);
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    }


    /**
     * Save redaction annotations to JSON format for export
     * @param {any} newAnnotation - new annotation
     * @param {boolean} canSaved - can saved
     * @private
     * @returns {any} - JSON string of redaction annotations
     */
    public combineBounds(newAnnotation: any, canSaved?: boolean): any {
        const combineBounds: any = [];
        let newBounds: any = [];
        let x: number = 0;
        let y: number = 0;
        let width: number = 0;
        let height: number = 0;
        let currentTop: number = 0;
        let nextTop: number = 0;
        let currentLeft: number = 0;
        let nextLeft: number = 0;
        let currentRotation: number = 0;
        let isEqual: boolean = false;
        for (let i: number = 0; i < newAnnotation.bounds.length; i++) {
            const newAnnotationBounds: any = newAnnotation.bounds[parseInt(i.toString(), 10)];
            currentTop = newAnnotationBounds.top ?
                newAnnotationBounds.top : newAnnotationBounds.Top;
            nextTop = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ? newAnnotation.bounds[i + 1].top ?
                newAnnotation.bounds[i + 1].top : newAnnotation.bounds[i + 1].Top : 0;
            currentLeft = newAnnotationBounds.left ?
                newAnnotationBounds.left : newAnnotationBounds.Left;
            nextLeft = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ? newAnnotation.bounds[i + 1].left ?
                newAnnotation.bounds[i + 1].left : newAnnotation.bounds[i + 1].Left : 0;
            const pageRotate: number = this.pdfViewerBase.pageSize[newAnnotation.pageNumber].rotation;
            currentRotation = !isNullOrUndefined(newAnnotationBounds.rotation) ? newAnnotationBounds.rotation : pageRotate ? pageRotate : 0;
            const rotation180Exists: boolean = (currentRotation === 0) || (currentRotation === 2) || (currentRotation === 180);
            if (rotation180Exists) {
                const currentRight: number = newAnnotationBounds.right ?
                    newAnnotationBounds.right : newAnnotationBounds.Right;
                const nextRight: number = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ?
                    newAnnotation.bounds[i + 1].right ? newAnnotation.bounds[i + 1].right : newAnnotation.bounds[i + 1].Right : 0;
                isEqual = ((nextRight === 0 || Math.abs(currentLeft - nextRight) < 0.5) ||
                    (nextLeft === 0 || Math.abs(currentRight - nextLeft) < 0.5));
            }
            else {
                const currentBottom: number = newAnnotationBounds.bottom ? newAnnotationBounds.bottom : newAnnotationBounds.Bottom;
                const nextBottom: number = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ? newAnnotation.bounds[i + 1].bottom ?
                    newAnnotation.bounds[i + 1].bottom : newAnnotation.bounds[i + 1].Bottom : 0;
                isEqual = (nextBottom === 0 || (Math.abs(nextBottom - currentTop) < 0.5) || Math.abs(nextTop - currentBottom) < 0.5);
            }
            if (newAnnotation.bounds.length > 1 && i < newAnnotation.bounds.length - 1 && (currentTop === nextTop ||
                currentLeft === nextLeft) && isEqual) {
                newBounds.push(newAnnotationBounds);
            } else {
                if (i === newAnnotation.bounds.length - 1 || newAnnotation.bounds.length >= 1) {
                    newBounds.push(newAnnotationBounds);
                }
                if (newBounds.length >= 1) {
                    x = newBounds.reduce((min: number, rect: any) => (rect.left ? rect.left : rect.Left || 0) < min ?
                        (rect.left ? rect.left : rect.Left || 0) : min, Infinity);
                    y = newBounds.reduce((min: number, rect: any) => (rect.top ? rect.top : rect.Top || 0) < min ?
                        (rect.top ? rect.top : rect.Top || 0) : min, Infinity);
                    if (!this.pdfViewerBase.clientSideRendering || rotation180Exists) {
                        if (!rotation180Exists) {
                            width = newBounds[0].width ? newBounds[0].width : newBounds[0].Width;
                        }
                        else {
                            height = newBounds[0].height ? newBounds[0].height : newBounds[0].Height;
                        }
                        for (let j: number = 0; j < newBounds.length; j++) {
                            if (!rotation180Exists) {
                                height += newBounds[parseInt(j.toString(), 10)].height ?
                                    newBounds[parseInt(j.toString(), 10)].height : newBounds[parseInt(j.toString(), 10)].Height;
                            }
                            else if ((!isNaN(newBounds[parseInt(j.toString(), 10)].width) &&
                                newBounds[parseInt(j.toString(), 10)].width > 0) || (!isNaN(newBounds[parseInt(j.toString(), 10)].Width) &&
                                newBounds[parseInt(j.toString(), 10)].Width > 0)) {
                                width += newBounds[parseInt(j.toString(), 10)].width ?
                                    newBounds[parseInt(j.toString(), 10)].width : newBounds[parseInt(j.toString(), 10)].Width;
                            }
                        }
                    }
                    else {
                        width += newBounds[0].width ? newBounds[0].width : newBounds[0].Width;
                        height = newBounds.reduce((sum: number, rect: any) => sum + (rect.height ? rect.height : rect.Height || 0), 0);
                    }
                    if (width !== 0 && height !== 0) {
                        const zoomFactor: any = this.pdfViewerBase.getZoomFactor();
                        const factor: any = canSaved ? 1 : zoomFactor;
                        const bounds: any = {
                            x: this.getMagnifiedValue(x - 0.5, factor),
                            y: this.getMagnifiedValue(y - 0.5, factor),
                            width: this.getMagnifiedValue(width + 0.5, factor),
                            height: this.getMagnifiedValue(height + 0.5, factor),
                            left: this.getMagnifiedValue(x - 0.5, factor),
                            top: this.getMagnifiedValue(y - 0.5, factor)
                        };
                        combineBounds.push(bounds);
                    }
                    newBounds = [];
                    width = 0;
                    height = 0;
                }
            }
        }
        return combineBounds;
    }

    /**
     * @private
     * @returns {void}
     */
    public deleteTextRedactAnnotation(): void {
        const textMarkUpModule: any = this.pdfViewer.annotationModule.textMarkupAnnotationModule;
        if (textMarkUpModule.currentTextMarkupAnnotation) {
            let isLock: boolean = false;
            if (textMarkUpModule.currentTextMarkupAnnotation.annotationSettings) {
                isLock = textMarkUpModule.currentTextMarkupAnnotation.annotationSettings.isLock;
                if (this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', textMarkUpModule.currentTextMarkupAnnotation)) {
                    isLock = false;
                }
            }
            if (!isLock) {
                let deletedAnnotation: IRedactionAnnotation = null;
                textMarkUpModule.showHideDropletDiv(true);
                const annotation: any = textMarkUpModule.currentTextMarkupAnnotation;
                const pageAnnotations: IRedactionAnnotation[] = this.getAnnotations(textMarkUpModule.selectTextMarkupCurrentPage, null);
                if (pageAnnotations) {
                    for (let i: number = 0; i < pageAnnotations.length; i++) {
                        if (textMarkUpModule.currentTextMarkupAnnotation.annotName ===
                            pageAnnotations[parseInt(i.toString(), 10)].annotName) {
                            deletedAnnotation = pageAnnotations.splice(i, 1)[0];
                            this.pdfViewer.annotationModule.addAction(textMarkUpModule.selectTextMarkupCurrentPage, i, deletedAnnotation, 'Text Markup Deleted', null);
                            textMarkUpModule.currentAnnotationIndex = i;
                            this.pdfViewer.annotation.stickyNotesAnnotationModule.findPosition(deletedAnnotation, 'textMarkup');
                            const removeDiv: HTMLElement = document.getElementById(deletedAnnotation.annotName);
                            if (removeDiv) {
                                if (removeDiv.parentElement.childElementCount === 1) {
                                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAccordionContainer(removeDiv);
                                } else {
                                    removeDiv.remove();
                                }
                            }
                        }
                    }
                    this.pdfViewer.annotationModule.updateAnnotationCollection(textMarkUpModule.currentTextMarkupAnnotation);
                    this.manageAnnotations(pageAnnotations, textMarkUpModule.selectTextMarkupCurrentPage);
                    this.pdfViewer.annotationModule.updateImportAnnotationCollection(textMarkUpModule.currentTextMarkupAnnotation, textMarkUpModule.currentTextMarkupAnnotation.pageNumber, 'Redaction');
                    const annotationId: string = textMarkUpModule.currentTextMarkupAnnotation.annotName;
                    const annotationBounds: any = textMarkUpModule.currentTextMarkupAnnotation.bounds;
                    textMarkUpModule.currentTextMarkupAnnotation = null;
                    this.pdfViewer.annotationModule.renderAnnotations(textMarkUpModule.selectTextMarkupCurrentPage, null, null, null);
                    this.pdfViewerBase.updateDocumentEditedProperty(true);
                    textMarkUpModule.currentAnnotationIndex = null;
                    textMarkUpModule.selectTextMarkupCurrentPage = null;
                    if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                        this.pdfViewer.toolbarModule.annotationToolbarModule.hideMobileAnnotationToolbar();
                        this.pdfViewer.toolbarModule.showToolbar(true);
                    }
                }
            }
        }
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public onTextRedactMouseMove(event: MouseEvent): void {
        const eventTarget: HTMLElement = event.target as HTMLElement;
        let pageIndex: number = parseInt(eventTarget.id.split('_text_')[1], 10) || parseInt(eventTarget.id.split('_textLayer_')[1], 10) || parseInt(eventTarget.id.split('_annotationCanvas_')[1], 10);
        if (event.target && (eventTarget.id.indexOf('_text') > -1 || eventTarget.id.indexOf('_annotationCanvas') > -1 || eventTarget.classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
            pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
            const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageIndex);
            const currentAnnot: IRedactionAnnotation = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageIndex, canvas);
            if (currentAnnot) {
                let annotObject: any;
                const annotationKeys: string[] = Object.keys(this.pdfViewer.nameTable);
                for (let i: number = 0; i < annotationKeys.length; i++) {
                    annotObject = (this.pdfViewer.nameTable as any)[annotationKeys[parseInt(i.toString(), 10)]];
                    if (!isNullOrUndefined(annotObject) && currentAnnot.annotationId === annotObject.annotName){
                        annotObject = (this.pdfViewer.nameTable as any)[annotationKeys[parseInt(i.toString(), 10)]];
                        break;
                    }
                }
                this.handleRedactionHover(annotObject, annotObject.pageNumber, currentAnnot);
                this.pdfViewerBase.isRedactionMousedOver = true;
            }
            else {
                this.resetRedactionHover();
                this.pdfViewerBase.isRedactionMousedOver = false;
            }
        }
    }

    /**
     * @param {TouchEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public onTextRedactAnnotationTouchEnd(event: TouchEvent): void {
        const pageNumber: number = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(pageNumber);
            const touchCanvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            this.clearCurrentSelectedAnnotation();
            const currentAnnot: IRedactionAnnotation = this.getCurrentMarkupAnnotation(event.touches[0].clientX,
                                                                                       event.touches[0].clientY, pageNumber,
                                                                                       touchCanvas);
            if (currentAnnot) {
                this.onTextRedactTouchEnd(currentAnnot, touchCanvas, event, pageNumber);
            }
        } else if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.clearAnnotationSelection(pageNumber);
        } else {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotation();
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(pageNumber);
        }
    }

    private onTextRedactTouchEnd(currentAnnot: IRedactionAnnotation, touchCanvas: HTMLElement, event: TouchEvent,
                                 pageNumber: number): void {
        let isLock: boolean = false;
        if (currentAnnot.annotationSettings && currentAnnot.annotationSettings.isLock) {
            isLock = currentAnnot.annotationSettings.isLock;
        }
        if (!isLock) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectAnnotation(currentAnnot, touchCanvas, pageNumber, event);
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = pageNumber;
            const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (pageNumber + 1));
            if (accordionExpand) {
                accordionExpand.ej2_instances[0].expandItem(true);
            }
            const comments: any = document.getElementById(currentAnnot.annotName);
            if (comments) {
                if (!Browser.isDevice) {
                    comments.firstChild.click();
                }
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clearCurrentSelectedAnnotation(): void {
        this.clearAnnotationSelection(this.pdfViewer.currentPageNumber - 1);
    }

    /**
     * @param {number} pageNumber - It describes about the pageNumber
     * @private
     * @returns {void}
     */
    public clearAnnotationSelection(pageNumber: number): void {
        // Styles need to be applied to both canvases. The 'blendAnnotationsIntoCanvas' is used for highlight annotations.
        const canvasIds: string[] = [
            '_annotationCanvas_' + pageNumber,
            '_blendAnnotationsIntoCanvas_' + pageNumber
        ];
        canvasIds.forEach((id: string) => {
            const canvas: HTMLElement = this.pdfViewerBase.getElement(id);
            if (canvas) {
                const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
                context.setLineDash([]);
                this.pdfViewer.annotationModule.renderAnnotations(pageNumber, null, null, null);
            }
        });
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public onTextRedactAnnotationMouseUp(event: MouseEvent): void {
        const pageNumber: number = this.pdfViewer.annotationModule.getEventPageNumber(event);
        if (!isNullOrUndefined(pageNumber) && !isNaN(pageNumber)) {
            const canvas: HTMLElement = this.pdfViewerBase.getElement('_annotationCanvas_' + pageNumber);
            this.clearCurrentSelectedAnnotation();
            const currentAnnot: IRedactionAnnotation = this.getCurrentMarkupAnnotation(event.clientX, event.clientY, pageNumber, canvas);
            if (currentAnnot && !window.getSelection().toString()) {
                this.onTextRedactMouseUp(currentAnnot, event, canvas, pageNumber);
            }
        }
    }


    private getCurrentMarkupAnnotation(clientX: number, clientY: number, pageNumber: number, canvas: HTMLElement): IRedactionAnnotation {
        const currentTextRedactAnnotations: IRedactionAnnotation[] = [];
        if (canvas) {
            let canvasParentPosition: DOMRect = canvas.parentElement.getBoundingClientRect() as DOMRect;
            if (canvas.clientWidth !== canvas.parentElement.clientWidth) {
                canvasParentPosition = canvas.getBoundingClientRect() as DOMRect;
            }
            const leftClickPosition: number = clientX - canvasParentPosition.left;
            const topClickPosition: number = clientY - canvasParentPosition.top;
            const annotationList: IRedactionAnnotation[] = this.getAnnotations(pageNumber, null);
            let isAnnotationGot: boolean = false;
            if (annotationList) {
                for (let i: number = 0; i < annotationList.length; i++) {
                    const annotation: IRedactionAnnotation = annotationList[parseInt(i.toString(), 10)];
                    for (let j: number = 0; j < annotation.bounds.length; j++) {
                        const bound: any = annotation.bounds[parseInt(j.toString(), 10)];
                        const left: number = bound.left ? bound.left : bound.Left;
                        const top: number = bound.top ? bound.top : bound.Top;
                        const width: number = bound.width ? bound.width : bound.Width;
                        const height: number = bound.height ? bound.height : bound.Height;
                        if (leftClickPosition >= this.getMagnifiedValue(left, this.pdfViewerBase.getZoomFactor()) &&
                            leftClickPosition <= this.getMagnifiedValue(left + width, this.pdfViewerBase.getZoomFactor()) &&
                            topClickPosition >= this.getMagnifiedValue(top, this.pdfViewerBase.getZoomFactor()) &&
                            topClickPosition <= this.getMagnifiedValue(top + height, this.pdfViewerBase.getZoomFactor())) {
                            currentTextRedactAnnotations.push(annotation);
                            isAnnotationGot = true;
                        } else {
                            if (isAnnotationGot) {
                                isAnnotationGot = false;
                                break;
                            }
                        }
                    }
                }
            }
            let currentAnnot: IRedactionAnnotation = null;
            if (currentTextRedactAnnotations.length > 1) {
                currentAnnot = this.compareCurrentAnnotations(currentTextRedactAnnotations);
            } else if (currentTextRedactAnnotations.length === 1) {
                currentAnnot = currentTextRedactAnnotations[0];
            }
            return currentAnnot;
        } else {
            return null;
        }
    }

    private compareCurrentAnnotations(annotations: IRedactionAnnotation[]): IRedactionAnnotation {
        let previousX: number;
        let currentAnnotation: IRedactionAnnotation = null;
        for (let i: number = 0; i < annotations.length; i++) {
            if (i === annotations.length - 1) {
                break;
            }
            const firstAnnotBounds: any = annotations[parseInt(i.toString(), 10)].bounds;
            const firstXposition: number = firstAnnotBounds[0].left ? firstAnnotBounds[0].left : firstAnnotBounds[0].Left;
            const firstYposition: number = firstAnnotBounds[0].top ? firstAnnotBounds[0].top : firstAnnotBounds[0].Top;
            const secondAnnotBounds: any = annotations[i + 1].bounds;
            const secondXposition: number = secondAnnotBounds[0].left ? secondAnnotBounds[0].left : secondAnnotBounds[0].Left;
            const secondYposition: number = secondAnnotBounds[0].top ? secondAnnotBounds[0].top : secondAnnotBounds[0].Top;
            if ((firstXposition < secondXposition) || (firstYposition < secondYposition)) {
                previousX = secondXposition;
                currentAnnotation = annotations[i + 1];
            } else {
                previousX = firstXposition;
                currentAnnotation = annotations[parseInt(i.toString(), 10)];
            }
            if (previousX && (i === (annotations.length - 2))) {
                if ((previousX === firstXposition) && (previousX === secondXposition)) {
                    previousX = secondXposition;
                    currentAnnotation = annotations[i + 1];
                }
            }
        }
        return currentAnnotation;
    }

    private onTextRedactMouseUp(currentAnnot: IRedactionAnnotation, event: MouseEvent, canvas: HTMLElement,
                                pageNumber: number): void {
        let isLock: boolean = false;
        let isSelection: boolean = false;
        if (currentAnnot.annotationSettings && currentAnnot.annotationSettings.isLock) {
            isLock = currentAnnot.annotationSettings.isLock;
            if (isLock && this.pdfViewer.annotationModule.checkAllowedInteractions('Select', currentAnnot)) {
                isLock = false;
                if (this.pdfViewer.annotationModule.checkAllowedInteractions('PropertyChange', currentAnnot)) {
                    isSelection = false;
                } else {
                    isSelection = true;
                }
            }
        }
        if (!isLock) {
            const canvasParentPosition: DOMRect = canvas.parentElement.getBoundingClientRect() as DOMRect;
            const leftClickPosition: number = event.clientX - canvasParentPosition.left;
            const topClickPosition: number = event.clientY - canvasParentPosition.top;
            this.pdfViewer.annotation.textMarkupAnnotationModule.annotationClickPosition = { x: leftClickPosition, y: topClickPosition };
            this.pdfViewer.annotation.textMarkupAnnotationModule.selectAnnotation(currentAnnot, canvas, pageNumber, event);
            this.pdfViewer.toolbarModule.redactionToolbarModule.showHideDeleteIcon(true);
            const commentPanelDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (commentPanelDiv && commentPanelDiv.style.display === 'block') {
                const accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (pageNumber + 1));
                if (accordionExpand) {
                    accordionExpand.ej2_instances[0].expandItem(true);
                }
                const comments: any = document.getElementById(currentAnnot.annotName);
                if (comments) {
                    comments.firstChild.click();
                }
            }
            if (!isBlazor()) {
                if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.redactionToolbarModule) {
                    this.pdfViewer.toolbarModule.redactionToolbarModule.isToolbarHidden = true;
                    this.pdfViewer.toolbarModule.redactionToolbarModule.
                        showRedactionToolbar(this.pdfViewer.toolbarModule.redactionItem);
                }
                if (currentAnnot) {
                    let annotObject: any;
                    const annotationKeys: string[] = Object.keys(this.pdfViewer.nameTable);
                    for (let i: number = 0; i < annotationKeys.length; i++) {
                        annotObject = (this.pdfViewer.nameTable as any)[annotationKeys[parseInt(i.toString(), 10)]];
                        if (!isNullOrUndefined(annotObject) && currentAnnot.annotationId === annotObject.annotName){
                            annotObject = (this.pdfViewer.nameTable as any)[annotationKeys[parseInt(i.toString(), 10)]];
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {any} textRedactAnnotations - It describes about the text markup annotations
     * @param {number} pageNumber - It describes about the page number
     * @param {boolean} isImportTextMarkup - It describes about the isImportTextMarkup
     * @param {boolean} isAnnotOrderAction - It describes about the isAnnotOrderAction
     * @private
     * @returns {void}
     */
    public renderTextRedactAnnotationsInPage(textRedactAnnotations: any, pageNumber: number, isImportTextMarkup?: boolean,
                                             isAnnotOrderAction?: boolean): void {
        const canvasId: string = '_annotationCanvas_';
        const canvas: HTMLElement = this.pdfViewerBase.getAnnotationCanvas(canvasId, pageNumber);
        if (isImportTextMarkup) {
            this.renderTextRedactAnnotations(null, pageNumber, canvas, this.pdfViewerBase.getZoomFactor());
            this.renderTextRedactAnnotations(textRedactAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor(), true);
            if (textRedactAnnotations && this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.redactionToolbarModule) {
                this.pdfViewer.toolbarModule.redactionToolbarModule.showHideRedactIcon(true);
            }
        } else {
            this.renderTextRedactAnnotations(textRedactAnnotations, pageNumber, canvas, this.pdfViewerBase.getZoomFactor(),
                                             null, isAnnotOrderAction);
        }
    }

    // eslint-disable-next-line jsdoc/require-returns-check
    /**
     * @param {any} textRedactAnnotations - It describes about the text markup annotations
     * @param {number} pageNumber - It describes about the page number
     * @param {HTMLElement} canvas - It describe the canvas.
     * @param {number} factor - It describe the zoom factor.
     * @param {boolean} isImportAction - It describes about the isImportTextMarkup
     * @param {boolean} isAnnotOrderAction - It describes about the isAnnotOrderAction
     * @private
     * @returns {any} - redaction annotation
     */
    public renderTextRedactAnnotations(textRedactAnnotations: any, pageNumber: number, canvas: HTMLElement, factor: number,
                                       isImportAction?: boolean, isAnnotOrderAction?: boolean): any {
        if (canvas) {
            const context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.setLineDash([]);
            let annotations: any[];
            if (!isImportAction && !isAnnotOrderAction) {
                annotations = this.getAnnotations(pageNumber, textRedactAnnotations);
            } else {
                annotations = textRedactAnnotations;
            }
            if (textRedactAnnotations) {
                textRedactAnnotations.forEach(function (textMarkupAnnotation: { AnnotName: any; }): void {
                    const exists: boolean = annotations.some(function (existingAnnotation: { annotName: any; }): boolean {
                        return existingAnnotation.annotName === textMarkupAnnotation.AnnotName;
                    });
                    if (!exists) {
                        annotations.push(textMarkupAnnotation);
                    }
                });
            }
            if (annotations) {
                const distinctAnnotations: any = [];
                for (let i: number = 0; i < annotations.length; i++) {
                    let duplicateFound: boolean = false;
                    for (let j: number = 0; j < distinctAnnotations.length; j++) {
                        if (
                            annotations[parseInt(i.toString(), 10)].AnnotName ===
                                distinctAnnotations[parseInt(j.toString(), 10)].AnnotName &&
                            annotations[parseInt(i.toString(), 10)].annotName === distinctAnnotations[parseInt(j.toString(), 10)].annotName
                        ) {
                            duplicateFound = true;
                            break;
                        }
                    }
                    if (!duplicateFound) {
                        distinctAnnotations.push(annotations[parseInt(i.toString(), 10)]);
                    }
                }
                annotations = distinctAnnotations;
            }
            if (annotations) {
                for (let i: number = 0; i < annotations.length; i++) {
                    const annotation: any = annotations[parseInt(i.toString(), 10)];
                    if (annotation.annotName === this.hoveredRedactionAnnotName) {
                        if (!this.isRedactionHovered && this.isAnnotationHoverd) {
                            const fillColor: string = updateColorWithOpacity(annotation.fillColor, 1);
                            annotation.markerFillColor = fillColor;
                            annotation.markerBorderColor = fillColor;
                            annotation.markerOpacity = 1;
                            this.isAnnotationHoverd = false;
                        } else {
                            if (this.orginalFillColor) {
                                const fillColor: string = updateColorWithOpacity(this.orginalFillColor, annotation.markerOpacity as number);
                                annotation.markerFillColor = fillColor;
                                annotation.markerBorderColor = this.orginalBorderColor;
                                annotation.markerOpacity = this.orginalOpacity;
                                // Remove overlay text
                                if (annotation.overlayText) {
                                    this.pdfViewer.annotation.redactionOverlayTextModule.removeRedactionOverlayText(annotation);
                                }
                            }
                        }
                    }
                    let annotationObject: any = null;
                    let isAnnotationRotated: boolean;
                    if (annotation.RedactionType === 'textRedact' || annotation.TextMarkupAnnotationType) {
                        if (isImportAction) {
                            if (this.pdfViewerBase.isJsonImported) {
                                const newArray: any[] = [];
                                for (let i: number = 0; i < annotation.Bounds.length; i++) {
                                    annotation.Bounds[parseInt(i.toString(), 10)] =  this.pdfViewerBase.
                                        importJsonForRotatedDocuments(annotation.Rotate, pageNumber,
                                                                      annotation.Bounds[parseInt(i.toString(), 10)],
                                                                      annotation.AnnotationRotation);
                                    annotation.Bounds[parseInt(i.toString(), 10)].left = annotation.Bounds[parseInt(i.toString(), 10)].X;
                                    annotation.Bounds[parseInt(i.toString(), 10)].top = annotation.Bounds[parseInt(i.toString(), 10)].Y;
                                    newArray.push(annotation.Bounds[parseInt(i.toString(), 10)]);
                                }
                                annotation.Bounds = newArray;
                                isAnnotationRotated = this.pdfViewerBase.isPageRotated;
                            }
                        }
                        annotation.annotationAddMode = this.pdfViewer.annotationModule.
                            findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                        annotation.allowedInteractions = annotation.AllowedInteractions ? annotation.AllowedInteractions :
                            this.pdfViewer.annotationModule.updateAnnotationAllowedInteractions(annotation);
                        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings :
                            this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
                        if (annotation.IsLocked) {
                            annotation.AnnotationSettings.isLock = annotation.IsLocked;
                        }
                        annotationObject = {
                            shapeAnnotationType: 'Redaction', annotType: 'TextRedaction', fillColor: annotation.FillColor,
                            allowedInteractions: annotation.allowedInteractions, markerOpacity: annotation.MarkerOpacity,
                            bounds: annotation.Bounds, author: annotation.Author, subject: annotation.Subject,
                            modifiedDate: annotation.ModifiedDate, note: annotation.Note, annotationId: annotation.AnnotName,
                            annotName: annotation.AnnotName, id: annotation.AnnotName, comments:
                            this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author),
                            review: { state: annotation.State, stateModel: annotation.StateModel,
                                modifiedDate: annotation.ModifiedDate, author: annotation.Author }, pageNumber: pageNumber,
                            pageIndex: pageNumber, redactionContent: annotation.TextMarkupContent,
                            annotationSelectorSettings: this.getSettings(annotation),
                            customData: this.pdfViewer.annotation.getCustomData(annotation), annotationAddMode:
                                annotation.annotationAddMode, annotationSettings: annotation.AnnotationSettings,
                            isLocked: annotation.IsLocked, isPrint: annotation.IsPrint, isCommentLock: annotation.IsCommentLock,
                            rotateAngle: annotation.AnnotationRotation,
                            markerBorderColor: annotation.MarkerBorderColor,
                            markerFillColor: annotation.MarkerFillColor,
                            fontFamily: annotation.FontFamily,
                            fontSize: annotation.FontSize,
                            textAlign: annotation.TextAlignment,
                            fontColor: annotation.FontColor,
                            isRepeat: annotation.IsRepeat,
                            overlayText: annotation.OverlayText
                        };
                        if (isNullOrUndefined(annotation.TextMarkupContent) && isNullOrUndefined(annotation.textMarkupContent)) {
                            const markedBounds: any = annotation.Bounds;
                            const storedData: any = this.pdfViewerBase.getStoredData(pageNumber, true);
                            if (isNullOrUndefined(storedData)) {
                                this.pdfViewerBase.requestForTextExtraction(pageNumber, annotationObject);
                            }
                            else {
                                const pageCharText: any = storedData.pageText.split('');
                                const characterBounds: any = this.pdfViewerBase.textLayer.
                                    characterBound[parseInt(pageNumber.toString(), 10)];
                                const textMarkupContent: string = this.pdfViewerBase.
                                    textMarkUpContent(markedBounds, pageCharText, characterBounds);
                                annotationObject.redactionContent = textMarkupContent;
                            }
                        }
                        if (annotation.annotName !== this.hoveredRedactionAnnotName) {
                            this.pdfViewer.add(annotationObject as PdfAnnotationBase);
                            this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_redaction');
                        }
                        if (this.isAddAnnotationProgramatically) {
                            const settings: any = {
                                shapeAnnotationType: annotation.shapeAnnotationType,
                                markerBorderColor: annotation.markerBorderColor,
                                markerFillColor: annotation.markerFillColor,
                                opacity: annotation.markerOpacity,
                                overlayText: annotation.overlayText || '',
                                fontColor: annotation.fontColor,
                                fontSize: annotation.fontSize || 14,
                                fontFamily: annotation.fontFamily,
                                textAlign: annotation.textAlign,
                                author: annotation.author,
                                subject: annotation.subject,
                                modifiedDate: annotation.modifiedDate
                            };
                            this.pdfViewer.fireAnnotationAdd(annotationObject.pageNumber, annotationObject.annotName,
                                                             'Redaction', annotationObject.bounds, settings);
                        }
                    }
                    if (annotation.RedactionType !== 'redaction') {
                        annotationObject = annotationObject ? annotationObject : annotation;
                    }
                    this.drawTextRedactAnnotation(annotationObject, factor, pageNumber, context);
                }
            }
        }
    }


    private getAddedAnnotation(type: string, color: string, opacity: number, bounds: any, author: string, subject: string,
                               predefinedDate: string, note: string, isCommentLock: boolean, rect: any, pageNumber: number,
                               textContent: string,
                               startIndex: number, endIndex: number, isMultiSelect?: boolean, allowedInteractions?: any,
                               annotationRotate?: number): IRedactionAnnotation {
        const modifiedDate: string = predefinedDate ? predefinedDate : this.pdfViewer.annotation.
            stickyNotesAnnotationModule.getDateAndTime();
        const annotationName: string = this.pdfViewer.annotation.createGUID();
        const commentsDivid: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('textMarkup', pageNumber + 1, type);
        if (commentsDivid) {
            document.getElementById(commentsDivid).id = annotationName;
        }
        const annotationSettings: object =   this.pdfViewer.annotationSettings;
        const isPrint: boolean = true;
        const annotation: any = {
            shapeAnnotationType: type, fillColor: this.pdfViewer.redactionSettings.fillColor, markerOpacity: opacity,
            bounds: bounds, author: author, annotType: 'TextRedaction',
            allowedInteractions: allowedInteractions, subject: subject, modifiedDate: modifiedDate, note: note,
            annotName: annotationName, id: annotationName, comments: [], review: { state: '', stateModel: '', author: author, modifiedDate: modifiedDate },
            pageNumber: pageNumber, pageIndex: pageNumber, redactionContent: textContent,  annotationId: annotationName,
            annotationSelectorSettings: this.pdfViewer.redactionSettings.annotationSelectorSettings,
            customData: this.pdfViewer.annotation.getTextMarkupData(subject), annotationAddMode: 'TextRedaction',
            annotationSettings: annotationSettings, isPrint: isPrint, isCommentLock: isCommentLock,
            rotateAngle: annotationRotate.toString(), markerBorderColor: this.pdfViewer.redactionSettings.markerBorderColor,
            markerFillColor: color, fontFamily: this.pdfViewer.redactionSettings.fontFamily,
            fontSize: this.pdfViewer.redactionSettings.fontSize,
            textAlign: this.pdfViewer.redactionSettings.textAlignment,
            fontColor: this.pdfViewer.redactionSettings.fontColor,
            isRepeat: this.pdfViewer.redactionSettings.isRepeat,
            overlayText: this.pdfViewer.redactionSettings.overlayText,
            isLocked: false
        };
        annotation.annotationSettings = this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        const isSkip: boolean = false;
        // Add the annotation to the viewer
        this.pdfViewer.add(annotation as PdfAnnotationBase);
        const storedIndex: number = this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotation, '_annotations_redaction');
        this.pdfViewer.annotationModule.addAction(pageNumber, storedIndex, annotation, 'Addition', null);
        return annotation;
    }

    private getPageContext(pageNumber: number, canvasId: string): CanvasRenderingContext2D {
        let canvas: HTMLElement;
        if (canvasId === '_annotationCanvas_') {
            canvas = this.pdfViewerBase.getAnnotationCanvas(canvasId, pageNumber);
        } else {
            canvas = this.pdfViewerBase.getElement(canvasId + pageNumber);
        }
        let context: CanvasRenderingContext2D = null;
        if (canvas) {
            context = (canvas as HTMLCanvasElement).getContext('2d');
        }
        return context;
    }

    private getMagnifiedValue(value: number, factor: number): number {
        return value * factor;
    }

    private drawTextRedactAnnotation(newAnnotation: any, zoomFactor: number, pageNumber: number, newcanvas?: any): void {
        if (newAnnotation && newAnnotation.bounds && !isNullOrUndefined(newAnnotation.bounds.length)) {
            let newBounds: any = [];
            let x: number = 0;
            let y: number = 0;
            let width: number = 0;
            let height: number = 0;
            let currentTop: number = 0;
            let nextTop: number = 0;
            let currentLeft: number = 0;
            let nextLeft: number = 0;
            let currentRotation: number = 0;
            let isEqual: boolean = false;
            for (let i: number = 0; i < newAnnotation.bounds.length; i++) {
                const newAnnotationBounds: any = newAnnotation.bounds[parseInt(i.toString(), 10)];
                currentTop = newAnnotationBounds.top ?
                    newAnnotationBounds.top : newAnnotationBounds.Top;
                nextTop = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ? newAnnotation.bounds[i + 1].top ?
                    newAnnotation.bounds[i + 1].top : newAnnotation.bounds[i + 1].Top : 0;
                currentLeft = newAnnotationBounds.left ?
                    newAnnotationBounds.left : newAnnotationBounds.Left;
                nextLeft = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ? newAnnotation.bounds[i + 1].left ?
                    newAnnotation.bounds[i + 1].left : newAnnotation.bounds[i + 1].Left : 0;
                const pageRotate: number = this.pdfViewerBase.pageSize[newAnnotation.pageNumber].rotation;
                currentRotation = !isNullOrUndefined(newAnnotationBounds.rotation) ?
                    newAnnotationBounds.rotation : pageRotate ? pageRotate : 0;
                const rotation180Exists: boolean = (currentRotation === 0) || (currentRotation === 2) || (currentRotation === 180);
                if (rotation180Exists) {
                    const currentRight: number = newAnnotationBounds.right ?
                        newAnnotationBounds.right : newAnnotationBounds.Right;
                    const nextRight: number = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ?
                        newAnnotation.bounds[i + 1].right ? newAnnotation.bounds[i + 1].right : newAnnotation.bounds[i + 1].Right : 0;
                    isEqual = ((nextRight === 0 || Math.abs(currentLeft - nextRight) < 0.5) ||
                        (nextLeft === 0 || Math.abs(currentRight - nextLeft) < 0.5));
                }
                else {
                    const currentBottom: number = newAnnotationBounds.bottom ? newAnnotationBounds.bottom : newAnnotationBounds.Bottom;
                    const nextBottom: number = !isNullOrUndefined(newAnnotation.bounds[i + 1]) ? newAnnotation.bounds[i + 1].bottom ?
                        newAnnotation.bounds[i + 1].bottom : newAnnotation.bounds[i + 1].Bottom : 0;
                    isEqual = (nextBottom === 0 || (Math.abs(nextBottom - currentTop) < 0.5) || Math.abs(nextTop - currentBottom) < 0.5);
                }
                if (newAnnotation.bounds.length > 1 && i < newAnnotation.bounds.length - 1 && (currentTop === nextTop ||
                    currentLeft === nextLeft) && isEqual) {
                    newBounds.push(newAnnotationBounds);
                } else {
                    if (i === newAnnotation.bounds.length - 1 || newAnnotation.bounds.length >= 1) {
                        newBounds.push(newAnnotationBounds);
                    }
                    if (newBounds.length >= 1) {
                        x = newBounds.reduce((min: number, rect: any) => (rect.left ? rect.left : rect.Left || 0) < min ?
                            (rect.left ? rect.left : rect.Left || 0) : min, Infinity);
                        y = newBounds.reduce((min: number, rect: any) => (rect.top ? rect.top : rect.Top || 0) < min ?
                            (rect.top ? rect.top : rect.Top || 0) : min, Infinity);
                        if (!this.pdfViewerBase.clientSideRendering || rotation180Exists) {
                            if (!rotation180Exists) {
                                width = newBounds[0].width ? newBounds[0].width : newBounds[0].Width;
                            }
                            else {
                                height = newBounds[0].height ? newBounds[0].height : newBounds[0].Height;
                            }
                            for (let j: number = 0; j < newBounds.length; j++) {
                                if (!rotation180Exists) {
                                    height += newBounds[parseInt(j.toString(), 10)].height ?
                                        newBounds[parseInt(j.toString(), 10)].height : newBounds[parseInt(j.toString(), 10)].Height;
                                }
                                else if ((!isNaN(newBounds[parseInt(j.toString(), 10)].width) &&
                                    newBounds[parseInt(j.toString(), 10)].width > 0) ||
                                    (!isNaN(newBounds[parseInt(j.toString(), 10)].Width) &&
                                    newBounds[parseInt(j.toString(), 10)].Width > 0)) {
                                    width += newBounds[parseInt(j.toString(), 10)].width ?
                                        newBounds[parseInt(j.toString(), 10)].width : newBounds[parseInt(j.toString(), 10)].Width;
                                }
                            }
                        }
                        else {
                            width += newBounds[0].width ? newBounds[0].width : newBounds[0].Width;
                            height = newBounds.reduce((sum: number, rect: any) => sum + (rect.height ? rect.height : rect.Height || 0), 0);
                        }
                        if (width !== 0 && height !== 0) {
                            this.renderTextRedactAnnotation(newcanvas, this.getMagnifiedValue(x - 0.5, zoomFactor),
                                                            this.getMagnifiedValue(y - 0.5, zoomFactor),
                                                            this.getMagnifiedValue(width + 0.5, zoomFactor),
                                                            this.getMagnifiedValue(height + 0.5, zoomFactor),
                                                            newAnnotation.markerOpacity, newAnnotation.markerFillColor,
                                                            newAnnotation.markerBorderColor, zoomFactor, pageNumber);
                        }
                        newBounds = [];
                        width = 0;
                        height = 0;
                    }
                }
            }
        }
    }

    private renderTextRedactAnnotation(context: any, x: number, y: number, width: number, height: number, opacity: number,
                                       color: string, borderColor: string, zoomFactor: number, pageIndex: number): void {
        let ratio : number;
        if (context.canvas.id === this.pdfViewer.element.id + '_print_annotation_layer_' + pageIndex) {
            ratio = this.pdfViewerBase.getZoomRatio(zoomFactor);
        } else {
            ratio = this.pdfViewerBase.getZoomRatio();
        }
        if (context) {
            context.beginPath();
            context.rect(x * ratio, y * ratio, width * ratio, height * ratio);
            context.closePath();
            context.globalAlpha = opacity;
            context.fillStyle = color;
            context.strokeStyle = borderColor;
            context.lineWidth = 1;
            context.msFillRule = 'nonzero';
            context.fill();
            context.stroke();
            context.save();
        }
    }

    /**
     * Draws a text redaction annotation on the specified page.
     * This method handles the visual representation of text redactions, typically used to obscure sensitive information.
     * It processes the annotation bounds, calculates positioning based on zoom factors, and manages rendering logic.
     *
     * @param {string} type - The annotation type (e.g., 'Redaction')
     * @param {IRectangle[]} bounds - The bounding rectangles defining the redaction area(s) on the page
     * @param {number} pageNumber - The page number where the redaction should be applied
     * @param {any} rect - Deprecated/unused parameter retained for backward compatibility
     * @param {number} factor - The current zoom factor for magnifying annotation dimensions
     * @param {string} textContent - The sensitive text content being redacted
     * @param {number} startIndex - The starting character index of the redacted text in the document
     * @param {number} endIndex - The ending character index of the redacted text in the document
     * @param {boolean} [isMultiSelect] - Indicates whether multiple text selections are being redacted
     * @param {HTMLElement} [targetElement] - The DOM element associated with the redaction (e.g., text layer)
     * @private
     *
     * @returns {void}
     */
    public drawTextRedact(type: string, bounds: IRectangle[], pageNumber: number, rect: any, factor: number,
                          textContent: string, startIndex: number, endIndex: number, isMultiSelect?: boolean, targetElement?: any): void {
        let annotation: IRedactionAnnotation = null;
        let author: string = 'Guest';
        let subject: string;
        let context: CanvasRenderingContext2D =  this.getPageContext(pageNumber, '_annotationCanvas_');
        const modifiedDate: string = this.pdfViewer.annotation.stickyNotesAnnotationModule.getDateAndTime();
        let allowedInteractions: any[];
        const pageDetails: ISize = this.pdfViewerBase.pageSize[parseInt(pageNumber.toString(), 10)];
        const annotationRotate: number = 0;
        const pageRotation: number = this.pdfViewerBase.getAngle(pageDetails.rotation);
        if (isNullOrUndefined(context)) {
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageNumber);
            if (pageDiv && pageDetails && pageDetails.width && pageDetails.height) {
                // If the 'blendAnnotationsIntoCanvas' is not implemented, it should be created to highlight annotations.
                const canvas: HTMLElement = this.pdfViewer.annotationModule.createBlendAnnotationsIntoCanvas(pageDiv, pageDetails.width,
                                                                                                             pageDetails.height,
                                                                                                             pageNumber);
                context = (canvas as HTMLCanvasElement).getContext('2d');
            }
        }
        if (context) {
            context.setLineDash([]);
            subject = (this.pdfViewer.highlightSettings.subject !== '' && this.pdfViewer.highlightSettings.subject) ? this.pdfViewer.highlightSettings.subject : this.pdfViewer.annotationSettings.subject ? this.pdfViewer.annotationSettings.subject : 'Highlight';
            author = (this.pdfViewer.highlightSettings.author !== 'Guest' && this.pdfViewer.highlightSettings.author) ? this.pdfViewer.highlightSettings.author : this.pdfViewer.annotationSettings.author ? this.pdfViewer.annotationSettings.author : 'Guest';
            allowedInteractions = this.pdfViewer.highlightSettings.allowedInteractions ? this.pdfViewer.highlightSettings.allowedInteractions : ['None'];
            const opacity: number = this.pdfViewer.redactionSettings.markerOpacity ? (this.pdfViewer.redactionSettings.markerOpacity > 1 ?
                (this.pdfViewer.redactionSettings.markerOpacity / 100) : this.pdfViewer.redactionSettings.markerOpacity) : 1;
            annotation = this.getAddedAnnotation(type, this.pdfViewer.redactionSettings.markerFillColor, opacity, bounds, author, subject, modifiedDate, '', false, rect, pageNumber, textContent, startIndex, endIndex, isMultiSelect, allowedInteractions, annotationRotate);
            if (annotation) {
                this.drawTextRedactAnnotation(annotation, factor, pageNumber, context);
            }
            if (annotation) {
                this.pdfViewerBase.updateDocumentEditedProperty(true);
                const settings: any = {
                    shapeAnnotationType: annotation.shapeAnnotationType,
                    markerBorderColor: annotation.markerBorderColor,
                    markerFillColor: annotation.markerFillColor,
                    opacity: annotation.markerOpacity,
                    overlayText: annotation.overlayText || '',
                    fontColor: annotation.fontColor,
                    fontSize: annotation.fontSize || 14,
                    fontFamily: annotation.fontFamily,
                    textAlign: annotation.textAlign,
                    author: annotation.author,
                    subject: annotation.subject,
                    modifiedDate: annotation.modifiedDate
                };
                this.pdfViewer.fireAnnotationAdd(pageNumber, annotation.annotName, 'Redaction',
                                                 annotation.bounds, settings, textContent, startIndex, endIndex);
            }
        }
    }

    private getRgbCode(colorString: string): any {
        // eslint-disable-next-line
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        let stringArray: string[] = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            colorString = this.pdfViewer.annotationModule.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        const r: number = parseInt(stringArray[0].split('(')[1], 10);
        const g: number = parseInt(stringArray[1], 10);
        const b: number = parseInt(stringArray[2], 10);
        const a: number = parseFloat(stringArray[3]);
        return { r: r, g: g, b: b, a: a };
    }

    /**
     * Retrieves the collection of redaction annotations for a given page.
     * If stored annotations exist for the page, they are returned; otherwise,
     * the provided redactionAnnotations array is used. This handles both stored
     * annotations (from session/local storage) and programmatically provided ones.
     *
     * @param {number} pageIndex - The page index to retrieve annotations for
     * @param {any[] | null} redactionAnnotations - Optional default annotations to use if no stored annotations exist
     * @private
     *
     * @returns {any[]} The array of redaction annotations for the specified page
     */
    public getAnnotations(pageIndex: number, redactionAnnotations: any[] | null): any[] {
        let annotationCollection: any[] = [];
        const storeObject: any = this.pdfViewer.annotationsCollection.get(this.pdfViewerBase.documentId + '_annotations_redaction');
        if (storeObject) {
            const annotObject: IPageAnnotations[] = JSON.parse(JSON.stringify(storeObject)) as IPageAnnotations[];
            const index: number = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
            if (index != null && annotObject[parseInt(index.toString(), 10)]) {
                annotationCollection = annotObject[parseInt(index.toString(), 10)].annotations;
            } else {
                annotationCollection = redactionAnnotations;
            }
        } else {
            annotationCollection = redactionAnnotations;
        }
        return annotationCollection;
    }
}
