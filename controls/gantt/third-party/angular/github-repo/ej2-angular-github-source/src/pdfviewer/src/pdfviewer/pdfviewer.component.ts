import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { PdfViewer } from '@syncfusion/ej2-pdfviewer';



export const inputs: string[] = ['DropdownFieldSettings','ajaxRequestSettings','annotationDrawingOptions','annotationSelectorSettings','annotationSettings','annotations','areaSettings','arrowSettings','checkBoxFieldSettings','circleSettings','commandManager','contextMenuOption','contextMenuSettings','currentPageNumber','customContextMenuItems','customFonts','customStamp','customStampSettings','customTextStamps','dateTimeFormat','designerMode','disableContextMenuItems','disableDefaultContextMenu','distanceSettings','documentLinkSettings','documentPath','downloadFileName','drawingObject','enableAccessibilityTags','enableAnnotation','enableAnnotationToolbar','enableAutoComplete','enableBookmark','enableBookmarkStyles','enableCollaborativeEditing','enableCommentPanel','enableDesktopMode','enableDownload','enableFormDesigner','enableFormDesignerToolbar','enableFormFields','enableFormFieldsValidation','enableFreeText','enableHandwrittenSignature','enableHtmlSanitizer','enableHyperlink','enableImportAnnotationMeasurement','enableInkAnnotation','enableInkEraser','enableLinkAnnotation','enableLocalStorage','enableMagnification','enableMeasureAnnotation','enableMultiLineOverlap','enableMultiPageAnnotation','enableNavigation','enableNavigationToolbar','enablePageOrganizer','enablePersistence','enablePinchZoom','enablePrint','enablePrintRotation','enableRedactionToolbar','enableRtl','enableShapeAnnotation','enableShapeLabel','enableStampAnnotations','enableStickyNotesAnnotation','enableTextMarkupAnnotation','enableTextMarkupResizer','enableTextSearch','enableTextSelection','enableThumbnail','enableToolbar','enableWebMcp','enableZoomOptimization','exportAnnotationFileName','extractTextOption','formFieldCollections','formFields','freeTextSettings','handWrittenSignatureSettings','height','hideEmptyDigitalSignatureFields','hideSaveSignature','highlightSettings','hyperlinkOpenState','initialDialogSettings','initialFieldSettings','initialRenderPages','inkAnnotationSettings','inkEraserSize','interactionMode','isAnnotationToolbarOpen','isAnnotationToolbarVisible','isBookmarkPanelOpen','isCommandPanelOpen','isDocumentEdited','isExtractText','isFormDesignerToolbarVisible','isFormFieldDocument','isInitialFieldToolbarSelection','isMaintainSelection','isPageOrganizerOpen','isRedactionToolbarVisible','isSignatureEditable','isThumbnailViewOpen','isValidFreeText','lineSettings','listBoxFieldSettings','locale','maxZoom','measurementSettings','minZoom','pageCount','pageOrganizerSettings','passwordFieldSettings','perimeterSettings','polygonSettings','printMode','printScaleFactor','radioButtonFieldSettings','radiusSettings','rectangleSettings','redactionSettings','resourceUrl','restrictZoomRequest','retryCount','retryStatusCodes','retryTimeout','scrollSettings','selectedItems','serverActionSettings','serviceUrl','shapeLabelSettings','showCustomContextMenuBottom','showDigitalSignatureAppearance','showNotificationDialog','signatureDialogSettings','signatureFieldSettings','signatureFitMode','squigglySettings','stampSettings','stickyNotesSettings','strikethroughSettings','textFieldSettings','textSearchColorSettings','tileRenderingSettings','toolbarSettings','underlineSettings','volumeSettings','webLinkSettings','width','zoomMode','zoomValue'];
export const outputs: string[] = ['addSignature','ajaxRequestFailed','ajaxRequestInitiate','ajaxRequestSuccess','annotationAdd','annotationChanged','annotationDoubleClick','annotationMouseLeave','annotationMouseover','annotationMove','annotationMoving','annotationPropertiesChange','annotationRemove','annotationResize','annotationSelect','annotationUnSelect','beforeAddFreeText','beforeWebMcpToolExecute','bookmarkClick','buttonFieldClick','commentAdd','commentDelete','commentEdit','commentSelect','commentStatusChanged','created','customContextMenuBeforeOpen','customContextMenuSelect','documentChanged','documentLoad','documentLoadFailed','documentUnload','downloadEnd','downloadStart','exportFailed','exportStart','exportSuccess','extractTextCompleted','formFieldAdd','formFieldChanged','formFieldClick','formFieldDoubleClick','formFieldFocusOut','formFieldMouseLeave','formFieldMouseover','formFieldMove','formFieldPropertiesChange','formFieldRemove','formFieldResize','formFieldSelect','formFieldUnselect','hyperlinkClick','hyperlinkMouseOver','importFailed','importStart','importSuccess','keyboardCustomCommands','moveSignature','pageChange','pageClick','pageMouseover','pageOrganizerSaveAs','pageOrganizerSaved','pageRenderComplete','pageRenderInitiate','printEnd','printStart','removeSignature','resizeSignature','resourcesLoaded','signaturePropertiesChange','signatureSelect','signatureUnselect','textSearchComplete','textSearchHighlight','textSearchStart','textSelectionEnd','textSelectionStart','thumbnailClick','toolbarClick','validateFormFields','zoomChange','pageOrganizerZoomChanged'];
export const twoWays: string[] = [];

/**
 * `ejs-pdfviewer` represents the Angular PdfViewer Component.
 * ```html
 * <ejs-pdfviewer></ejs-pdfviewer>
 * ```
 */
@Component({
    selector: 'ejs-pdfviewer',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
    }
})
@ComponentMixins([ComponentBase])
export class PdfViewerComponent extends PdfViewer implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare addSignature: any;
	declare ajaxRequestFailed: any;
	declare ajaxRequestInitiate: any;
	declare ajaxRequestSuccess: any;
	declare annotationAdd: any;
	declare annotationChanged: any;
	declare annotationDoubleClick: any;
	declare annotationMouseLeave: any;
	declare annotationMouseover: any;
	declare annotationMove: any;
	declare annotationMoving: any;
	declare annotationPropertiesChange: any;
	declare annotationRemove: any;
	declare annotationResize: any;
	declare annotationSelect: any;
	declare annotationUnSelect: any;
	declare beforeAddFreeText: any;
	declare beforeWebMcpToolExecute: any;
	declare bookmarkClick: any;
	declare buttonFieldClick: any;
	declare commentAdd: any;
	declare commentDelete: any;
	declare commentEdit: any;
	declare commentSelect: any;
	declare commentStatusChanged: any;
	declare created: any;
	declare customContextMenuBeforeOpen: any;
	declare customContextMenuSelect: any;
	declare documentChanged: any;
	declare documentLoad: any;
	declare documentLoadFailed: any;
	declare documentUnload: any;
	declare downloadEnd: any;
	declare downloadStart: any;
	declare exportFailed: any;
	declare exportStart: any;
	declare exportSuccess: any;
	declare extractTextCompleted: any;
	declare formFieldAdd: any;
	declare formFieldChanged: any;
	declare formFieldClick: any;
	declare formFieldDoubleClick: any;
	declare formFieldFocusOut: any;
	declare formFieldMouseLeave: any;
	declare formFieldMouseover: any;
	declare formFieldMove: any;
	declare formFieldPropertiesChange: any;
	declare formFieldRemove: any;
	declare formFieldResize: any;
	declare formFieldSelect: any;
	declare formFieldUnselect: any;
	declare hyperlinkClick: any;
	declare hyperlinkMouseOver: any;
	declare importFailed: any;
	declare importStart: any;
	declare importSuccess: any;
	declare keyboardCustomCommands: any;
	declare moveSignature: any;
	declare pageChange: any;
	declare pageClick: any;
	declare pageMouseover: any;
	declare pageOrganizerSaveAs: any;
	declare pageOrganizerSaved: any;
	declare pageRenderComplete: any;
	declare pageRenderInitiate: any;
	declare printEnd: any;
	declare printStart: any;
	declare removeSignature: any;
	declare resizeSignature: any;
	declare resourcesLoaded: any;
	declare signaturePropertiesChange: any;
	declare signatureSelect: any;
	declare signatureUnselect: any;
	declare textSearchComplete: any;
	declare textSearchHighlight: any;
	declare textSearchStart: any;
	declare textSelectionEnd: any;
	declare textSelectionStart: any;
	declare thumbnailClick: any;
	declare toolbarClick: any;
	declare validateFormFields: any;
	declare zoomChange: any;
	public declare pageOrganizerZoomChanged: any;



    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('PdfViewerLinkAnnotation');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerBookmarkView');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerMagnification');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerThumbnailView');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerToolbar');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerNavigation');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerPrint');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerTextSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerTextSearch');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerAnnotation');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerFormDesigner');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerFormFields');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('PdfViewerPageOrganizer');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}


