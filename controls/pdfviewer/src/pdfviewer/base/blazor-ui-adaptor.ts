import { PdfViewer, PdfViewerBase } from '../index';

/**
 * The `BlazorUIAdaptor` module is used to handle the UI update of native components.
 *
 * @hidden
 */
export class BlazorUiAdaptor {
    private pdfViewer: PdfViewer = null;
    private pdfViewerBase: PdfViewerBase = null;
    /**
     * @private
     */
    public totalPageElement: HTMLElement = null;
    private currentPageBoxElementContainer: HTMLElement = null;
    private currentPageBoxElement: HTMLInputElement = null;
    private firstPageElement: HTMLElement = null;
    private previousPageElement: HTMLElement = null;
    private nextPageElement: HTMLElement = null;
    private lastPageElement: HTMLElement = null;
    private zommOutElement: HTMLElement = null;
    private zoomInElement: HTMLElement = null;
    private zoomDropDownElement: HTMLElement = null;
    private selectToolElement: HTMLElement = null;
    private handToolElement: HTMLElement = null;
    private undoElement: HTMLElement = null;
    private redoElement: HTMLElement = null;
    private commentElement: HTMLElement = null;
    private submitFormButton: HTMLElement = null;
    private searchElement: HTMLElement = null;
    private annotationElement: HTMLElement = null;
    private printElement: HTMLElement = null;
    private downloadElement: HTMLElement = null;
    private highlightElement: HTMLElement = null;
    private underlineElement: HTMLElement = null;
    private strikeThroughElement: HTMLElement = null;
    private shapeElement: HTMLElement = null;
    private calibrateElement: HTMLElement = null;
    private stampElement: HTMLElement = null;
    private freeTextElement: HTMLElement = null;
    private signatureElement: HTMLElement = null;
    private inkElement: HTMLElement = null;
    private annotationFontSizeInputElement: HTMLInputElement = null;
    private annotationFontFamilyInputElement: HTMLInputElement = null;
    private annotationColorElement: HTMLElement = null;
    private annotationStrokeColorElement: HTMLElement = null;
    private annotationThicknessElement: HTMLElement = null;
    private annotationOpacityElement: HTMLElement = null;
    private annotationFontColorElement: HTMLElement = null;
    private annotationFontFamilyElement: HTMLElement = null;
    private annotationFontSizeElement: HTMLElement = null;
    private annotationTextAlignElement: HTMLElement = null;
    private annotationTextColorElement: HTMLElement = null;
    private annotationTextPropertiesElement: HTMLElement = null;
    private annotationDeleteElement: HTMLElement = null;
    private annotationCloseElement: HTMLElement = null;
    private annotationCommentPanelElement: HTMLElement = null;
    private mobileToolbarContainerElement: HTMLElement = null;
    private mobileSearchPreviousOccurenceElement: HTMLElement = null;
    private mobileSearchNextOccurenceElement: HTMLElement = null;
    private cssClass: string = 'e-overlay';
    private disableClass: string = ' e-overlay';
    private editAnnotationButtonElement: HTMLElement = null;
    /**
     * Initialize the constructor of blazorUIadapater.
     *
     * @param { PdfViewer } pdfviewer - Specified PdfViewer class.
     * @param { PdfViewerBase } pdfViewerBase - The pdfViewerBase.
     */
    constructor(pdfviewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
        this.findToolbarElements();
    }

    private findToolbarElements() : void {
        this.totalPageElement = this.pdfViewerBase.getElement('_totalPage').children[0] as HTMLElement;
        this.currentPageBoxElementContainer = this.pdfViewerBase.getElement('_currentPageInput') as HTMLElement;
        this.currentPageBoxElement = this.pdfViewerBase.getElement('_currentPageInput').children[0].children[0] as HTMLInputElement;
        this.firstPageElement = this.pdfViewerBase.getElement('_firstPage') as HTMLElement;
        this.previousPageElement = this.pdfViewerBase.getElement('_previousPage') as HTMLElement;
        this.nextPageElement = this.pdfViewerBase.getElement('_nextPage') as HTMLElement;
        this.lastPageElement = this.pdfViewerBase.getElement('_lastPage') as HTMLElement;
        this.zommOutElement = this.pdfViewerBase.getElement('_zoomOut') as HTMLElement;
        this.zoomInElement = this.pdfViewerBase.getElement('_zoomIn') as HTMLElement;
        this.zoomDropDownElement = this.pdfViewerBase.getElement('_zoomDropDown') as HTMLElement;
        this.selectToolElement = this.pdfViewerBase.getElement('_selectTool') as HTMLElement;
        this.handToolElement = this.pdfViewerBase.getElement('_handTool') as HTMLElement;
        this.undoElement = this.pdfViewerBase.getElement('_undo') as HTMLElement;
        this.redoElement = this.pdfViewerBase.getElement('_redo') as HTMLElement;
        this.commentElement = this.pdfViewerBase.getElement('_comment') as HTMLElement;
        this.submitFormButton = this.pdfViewerBase.getElement('_submitFormButton') as HTMLElement;
        this.searchElement = this.pdfViewerBase.getElement('_search') as HTMLElement;
        this.annotationElement = this.pdfViewerBase.getElement('_annotation') as HTMLElement;
        this.editAnnotationButtonElement = this.annotationElement.children[0] as HTMLElement;
        this.editAnnotationButtonElement.classList.add('e-pv-tbar-btn');
        this.printElement = this.pdfViewerBase.getElement('_print') as HTMLElement;
        this.downloadElement = this.pdfViewerBase.getElement('_download') as HTMLElement;
        this.highlightElement = this.pdfViewerBase.getElement('_highLight') as HTMLElement;
        this.underlineElement = this.pdfViewerBase.getElement('_underline') as HTMLElement;
        this.strikeThroughElement = this.pdfViewerBase.getElement('_strikethrough') as HTMLElement;
        this.shapeElement = this.pdfViewerBase.getElement('_annotation_shapes') as HTMLElement;
        this.calibrateElement = this.pdfViewerBase.getElement('_annotation_calibrate') as HTMLElement;
        this.stampElement = this.pdfViewerBase.getElement('_annotation_stamp') as HTMLElement;
        this.freeTextElement = this.pdfViewerBase.getElement('_annotation_freeTextEdit') as HTMLElement;
        this.signatureElement = this.pdfViewerBase.getElement('_annotation_signature') as HTMLElement;
        this.inkElement = this.pdfViewerBase.getElement('_annotation_ink') as HTMLElement;
        this.annotationFontSizeInputElement = this.pdfViewerBase.getElement('_annotation_fontsize').children[0].children[0] as HTMLInputElement;
        this.annotationFontFamilyInputElement = this.pdfViewerBase.getElement('_annotation_fontname').children[0].children[0] as HTMLInputElement;
        this.annotationColorElement = this.pdfViewerBase.getElement('_annotation_color') as HTMLElement;
        this.annotationStrokeColorElement = this.pdfViewerBase.getElement('_annotation_stroke') as HTMLElement;
        this.annotationThicknessElement = this.pdfViewerBase.getElement('_annotation_thickness') as HTMLElement;
        this.annotationOpacityElement = this.pdfViewerBase.getElement('_annotation_opacity') as HTMLElement;
        this.annotationFontColorElement = this.pdfViewerBase.getElement('_annotation_textcolor') as HTMLElement;
        this.annotationFontFamilyElement = this.pdfViewerBase.getElement('_annotation_fontname') as HTMLElement;
        this.annotationFontSizeElement = this.pdfViewerBase.getElement('_annotation_fontsize') as HTMLElement;
        this.annotationTextAlignElement = this.pdfViewerBase.getElement('_annotation_textalign') as HTMLElement;
        this.annotationTextColorElement = this.pdfViewerBase.getElement('_annotation_textcolor') as HTMLElement;
        this.annotationTextPropertiesElement = this.pdfViewerBase.getElement('_annotation_textproperties') as HTMLElement;
        this.annotationDeleteElement = this.pdfViewerBase.getElement('_annotation_delete') as HTMLElement;
        this.annotationCommentPanelElement = this.pdfViewerBase.getElement('_annotation_commentPanel') as HTMLElement;
        this.annotationCloseElement = this.pdfViewerBase.getElement('_annotation_close') as HTMLElement;
        this.mobileToolbarContainerElement = this.pdfViewerBase.getElement('_mobileToolbarContainer') as HTMLElement;
        this.mobileSearchPreviousOccurenceElement = this.pdfViewerBase.getElement('_prev_occurrence') as HTMLElement;
        this.mobileSearchNextOccurenceElement = this.pdfViewerBase.getElement('_next_occurrence') as HTMLElement;
    }
    /**
     * Update the total page.
     *
     * @returns {void}
     */
    public updateTotalPage() : void {
        this.totalPageElement.textContent = this.pdfViewer.localeObj.getConstant('of') + this.pdfViewerBase.pageCount.toString();
    }
    /**
     * Update current page.
     *
     * @param {number} pageNumber - The pageNumber.
     * @returns {void}
     */
    public updateCurrentPage(pageNumber: number) : void {
        this.currentPageBoxElement.value = pageNumber.toString();
    }
    /**
     * Load the PDF document.
     *
     * @returns {void}
     */
    public loadDocument(): void {
        if (this.pdfViewer.enableNavigation) {
            this.currentPageBoxElementContainer.classList.remove(this.cssClass);
            this.currentPageBoxElement.value = '1';
            this.totalPageElement.textContent = this.pdfViewer.localeObj.getConstant('of') + this.pdfViewerBase.pageCount.toString();
            if (!this.isEnabled(this.firstPageElement)) {
                this.firstPageElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.previousPageElement)) {
                this.previousPageElement.className += this.disableClass;
            }
            this.nextPageElement.classList.remove(this.cssClass);
            this.lastPageElement.classList.remove(this.cssClass);
            if (this.pdfViewerBase.pageCount === 1) {
                if (!this.nextPageElement.classList.contains(this.cssClass)) {
                    this.nextPageElement.className += this.disableClass;
                }
                if (!this.lastPageElement.classList.contains(this.cssClass)) {
                    this.lastPageElement.className += this.disableClass;
                }
            }
        }
        if (this.pdfViewer.enableMagnification) {
            this.zoomInElement.classList.remove(this.cssClass);
            this.zommOutElement.classList.remove(this.cssClass);
            this.zoomDropDownElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableTextSelection) {
            this.selectToolElement.classList.remove(this.cssClass);
            this.selectItem(this.pdfViewer.toolbar.SelectToolElement);
        }
        this.handToolElement.classList.remove(this.cssClass);
        if (this.pdfViewer.enableStickyNotesAnnotation) {
            this.commentElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableTextSearch) {
            this.searchElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.isFormFieldDocument) {
            this.submitFormButton.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableAnnotation && this.pdfViewer.enableAnnotationToolbar) {
            this.annotationElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enablePrint) {
            this.printElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableDownload) {
            this.downloadElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableAnnotation && this.pdfViewer.enableTextMarkupAnnotation) {
            this.highlightElement.classList.remove(this.cssClass);
            this.underlineElement.classList.remove(this.cssClass);
            this.strikeThroughElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableAnnotation && this.pdfViewer.enableShapeAnnotation) {
            this.shapeElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableAnnotation && this.pdfViewer.enableMeasureAnnotation) {
            this.calibrateElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableAnnotation && this.pdfViewer.enableStampAnnotations) {
            this.stampElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableFreeText) {
            this.freeTextElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableHandwrittenSignature) {
            this.signatureElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableInkAnnotation) {
            this.inkElement.classList.remove(this.cssClass);
        }
        if (this.pdfViewer.enableCommentPanel) {
            this.annotationCommentPanelElement.classList.remove(this.cssClass);
        }
    }


    public selectItem(element: HTMLElement): void {
        if (element) {
            element.classList.add('e-pv-select');
        }
    }

    public deselectItem(element: HTMLElement): void {
        if (element) {
            element.classList.remove('e-pv-select');
        }
    }

    public showAnnotationToolbar(isToolbarVisible: any): void {
        this.pdfViewer.toolbar.annotationToolbarModule.adjustViewer(isToolbarVisible[0]);
        if (isToolbarVisible[0]){
            this.pdfViewer.toolbar.selectItem(this.editAnnotationButtonElement);
        } else {
            this.pdfViewer.toolbar.deSelectItem(this.editAnnotationButtonElement);
            this.pdfViewerBase.focusViewerContainer();
        }
    }

    public closeAnnotationToolbar(): void {
        this.pdfViewer.toolbar.annotationToolbarModule.adjustViewer(false);
        this.pdfViewer.toolbar.deSelectItem(this.editAnnotationButtonElement);
        this.pdfViewerBase.navigationPane.closeCommentPanelContainer();
    }

    /**
     * Reset the toolbar.
     *
     * @returns {void}
     */
    public resetToolbar(): void {
        if (this.pdfViewer.enableToolbar) {
            this.currentPageBoxElement.value = '0';
            this.totalPageElement.textContent = this.pdfViewer.localeObj.getConstant('of') + '0';
            if (!this.isEnabled(this.currentPageBoxElementContainer)) {
                this.currentPageBoxElementContainer.className += this.disableClass;
            }
            if (!this.isEnabled(this.firstPageElement)) {
                this.firstPageElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.previousPageElement)) {
                this.previousPageElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.nextPageElement)) {
                this.nextPageElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.lastPageElement)) {
                this.lastPageElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.zoomInElement)) {
                this.zoomInElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.zommOutElement)) {
                this.zommOutElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.zoomDropDownElement)) {
                this.zoomDropDownElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.selectToolElement)) {
                this.selectToolElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.handToolElement)) {
                this.handToolElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.undoElement)) {
                this.undoElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.redoElement)) {
                this.redoElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.commentElement)) {
                this.commentElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.searchElement)) {
                this.searchElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.submitFormButton)) {
                this.submitFormButton.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationElement)) {
                this.annotationElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.printElement)) {
                this.printElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.downloadElement)) {
                this.downloadElement.className += this.disableClass;
            }
        }
        if (this.pdfViewer.enableAnnotationToolbar) {
            if (!this.isEnabled(this.highlightElement)) {
                this.highlightElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.underlineElement)) {
                this.underlineElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.strikeThroughElement)) {
                this.strikeThroughElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.shapeElement)) {
                this.shapeElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.calibrateElement)) {
                this.calibrateElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.stampElement)) {
                this.stampElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.freeTextElement)) {
                this.freeTextElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.signatureElement)) {
                this.signatureElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.inkElement)) {
                this.inkElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationFontFamilyElement)) {
                this.annotationFontFamilyElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationFontSizeElement)) {
                this.annotationFontSizeElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationTextColorElement)) {
                this.annotationTextColorElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationTextAlignElement)) {
                this.annotationTextAlignElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationTextPropertiesElement)) {
                this.annotationTextPropertiesElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationColorElement)) {
                this.annotationColorElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationStrokeColorElement)) {
                this.annotationStrokeColorElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationThicknessElement)) {
                this.annotationThicknessElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationOpacityElement)) {
                this.annotationOpacityElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationDeleteElement)) {
                this.annotationDeleteElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationCommentPanelElement)) {
                this.annotationCommentPanelElement.className += this.disableClass;
            }
        }
    }

    /**
     * When annotation selection changed.
     *
     * @param {boolean} isEnable - isEnable
     * @returns {void}
     */
    public EnableDeleteOption(isEnable: boolean): void {
        if (this.annotationDeleteElement !== null) {
            if (isEnable) {
                this.annotationDeleteElement.classList.remove(this.cssClass);
            } else {
                if (!this.isEnabled(this.annotationDeleteElement)) {
                    this.annotationDeleteElement.className += this.disableClass;
                }
            }
        }
    }

    /**
     * when the page changes.
     *
     * @param {number} currentPageNumber - The current page number.
     * @returns {void}
     */
    public pageChanged(currentPageNumber: number): void {
        if (this.pdfViewer.enableNavigation) {
            this.currentPageBoxElement.value = currentPageNumber.toString();
        }
        if (currentPageNumber === this.pdfViewer.pageCount) {
            if (!this.isEnabled(this.nextPageElement)) {
                this.nextPageElement.className += this.disableClass;
            }
            this.previousPageElement.classList.remove(this.cssClass);
            if (!this.isEnabled(this.lastPageElement)) {
                this.lastPageElement.className += this.disableClass;
            }
            this.firstPageElement.classList.remove(this.cssClass);
        }
        if (currentPageNumber < this.pdfViewer.pageCount && currentPageNumber !== 1) {
            this.firstPageElement.classList.remove(this.cssClass);
            this.previousPageElement.classList.remove(this.cssClass);
            this.nextPageElement.classList.remove(this.cssClass);
            this.lastPageElement.classList.remove(this.cssClass);
        }
        if (currentPageNumber === 1 ) {
            this.nextPageElement.classList.remove(this.cssClass);
            this.lastPageElement.classList.remove(this.cssClass);
            if (!this.isEnabled(this.firstPageElement)) {
                this.firstPageElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.previousPageElement)) {
                this.previousPageElement.className += this.disableClass;
            }
        }
    }
    /**
     * @param {string} item - The current item.
     * @param {boolean} enable - To enable the item or not.
     * @returns {void}
     */
    public updateUndoRedoButton(item: string, enable: boolean): void {
        if (item === 'undo') {
            if (enable) {
                this.undoElement.classList.remove(this.cssClass);
            } else {
                if (!this.isEnabled(this.undoElement)) {
                    this.undoElement.className += this.disableClass;
                }
            }
        }
        if (item === 'redo') {
            if (enable) {
                this.redoElement.classList.remove(this.cssClass);
            } else {
                if (!this.isEnabled(this.redoElement)) {
                    this.redoElement.className += this.disableClass;
                }
            }
        }
    }
    /**
     * @returns {void}
     */
    public  disableUndoRedoButton(): void {
        if (!this.isEnabled(this.undoElement)) {
            this.undoElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.redoElement)) {
            this.redoElement.className += this.disableClass;
        }
    }
    /**
     * @param {boolean} isEnable - isEnable
     * @returns {void}
     */
    public enableTextMarkupAnnotationPropertiesTools(isEnable: boolean): void {
        if (isEnable) {
            this.annotationColorElement.classList.remove(this.cssClass);
            this.annotationOpacityElement.classList.remove(this.cssClass);
        } else {
            if (!this.isEnabled(this.annotationOpacityElement)) {
                this.annotationOpacityElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationColorElement)) {
                this.annotationColorElement.className += this.disableClass;
            }
        }
        if (!this.isEnabled(this.annotationFontColorElement)) {
            this.annotationFontColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontFamilyElement)) {
            this.annotationFontFamilyElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontSizeElement)) {
            this.annotationFontSizeElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextAlignElement)) {
            this.annotationTextAlignElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextPropertiesElement)) {
            this.annotationTextPropertiesElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationStrokeColorElement)) {
            this.annotationStrokeColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationThicknessElement)) {
            this.annotationThicknessElement.className += this.disableClass;
        }
    }
    /**
     * @param {boolean} isEnable - To enable the item or not.
     * @param {boolean} isProperitiesChange - To enable the item or not.
     * @returns {void}
     */
    public enableAnnotationPropertiesTool(isEnable: boolean, isProperitiesChange: boolean): void {
        if (isProperitiesChange) {
            if (isEnable) {
                this.annotationColorElement.classList.remove(this.cssClass);
                this.annotationStrokeColorElement.classList.remove(this.cssClass);
                this.annotationThicknessElement.classList.remove(this.cssClass);
                this.annotationOpacityElement.classList.remove(this.cssClass);
                if (this.pdfViewer.enableShapeLabel) {
                    this.annotationFontColorElement.classList.remove(this.cssClass);
                    this.annotationFontFamilyElement.classList.remove(this.cssClass);
                    this.annotationFontSizeElement.classList.remove(this.cssClass);
                }
                if (!this.isEnabled(this.annotationTextAlignElement)) {
                    this.annotationTextAlignElement.className += this.disableClass;
                }
                if (!this.isEnabled(this.annotationTextPropertiesElement)) {
                    this.annotationTextPropertiesElement.className += this.disableClass;
                }
            } else {
                if (!this.isEnabled(this.annotationColorElement)) {
                    this.annotationColorElement.className += this.disableClass;
                }
                if (!this.isEnabled(this.annotationStrokeColorElement)) {
                    this.annotationStrokeColorElement.className += this.disableClass;
                }
                if (!this.isEnabled(this.annotationThicknessElement)) {
                    this.annotationThicknessElement.className += this.disableClass;
                }
                if (!this.isEnabled(this.annotationOpacityElement)) {
                    this.annotationOpacityElement.className += this.disableClass;
                }
                if (!this.isEnabled(this.annotationDeleteElement)) {
                    this.annotationDeleteElement.className += this.disableClass;
                }
            }
        }
    }
    /**
     * @param {boolean} isEnable - To enable the item or not.
     * @param {boolean} isProperitiesChange - To enable the item or not.
     * @returns {void}
     */
    public enableFreeTextAnnotationPropertiesTools(isEnable: boolean, isProperitiesChange: boolean): void {
        if (isProperitiesChange && isEnable) {
            this.annotationColorElement.classList.remove(this.cssClass);
            this.annotationStrokeColorElement.classList.remove(this.cssClass);
            this.annotationThicknessElement.classList.remove(this.cssClass);
            this.annotationOpacityElement.classList.remove(this.cssClass);
            this.annotationFontColorElement.classList.remove(this.cssClass);
            this.annotationFontFamilyElement.classList.remove(this.cssClass);
            this.annotationFontSizeElement.classList.remove(this.cssClass);
            this.annotationTextAlignElement.classList.remove(this.cssClass);
            this.annotationTextPropertiesElement.classList.remove(this.cssClass);
            this.annotationDeleteElement.classList.remove(this.cssClass);
            this.annotationCommentPanelElement.classList.remove(this.cssClass);
        }
    }
    /**
     * @param {boolean} isEnable - To enable the item or not.
     * @param {boolean} isPropertiesChange - To enable the item or not.
     * @returns {void}
     */
    public enableStampAnnotationPropertiesTools(isEnable: boolean, isPropertiesChange: boolean): void {
        if (isEnable) {
            this.annotationOpacityElement.classList.remove(this.cssClass);
            this.annotationDeleteElement.classList.remove(this.cssClass);
            this.annotationCommentPanelElement.classList.remove(this.cssClass);
        } else {
            if (!this.isEnabled(this.annotationOpacityElement)) {
                this.annotationOpacityElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationDeleteElement)) {
                this.annotationDeleteElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationCommentPanelElement)) {
                this.annotationCommentPanelElement.className += this.disableClass;
            }
        }
        if (!this.isEnabled(this.annotationColorElement)) {
            this.annotationColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationStrokeColorElement)) {
            this.annotationStrokeColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationThicknessElement)) {
            this.annotationThicknessElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationOpacityElement)) {
            this.annotationOpacityElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontColorElement)) {
            this.annotationFontColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontFamilyElement)) {
            this.annotationFontFamilyElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontSizeElement)) {
            this.annotationFontSizeElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextAlignElement)) {
            this.annotationTextAlignElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextPropertiesElement)) {
            this.annotationTextPropertiesElement.className += this.disableClass;
        }
    }
    /**
     * @param {boolean} isEnable - To enable the item or not.
     * @param {boolean} isProperitiesChange - To enable the item or not.
     * @returns {void}
     */
    public enableSignaturePropertiesTools(isEnable: boolean, isProperitiesChange: boolean): void {
        if (isEnable) {
            this.annotationStrokeColorElement.classList.remove(this.cssClass);
            this.annotationThicknessElement.classList.remove(this.cssClass);
            this.annotationOpacityElement.classList.remove(this.cssClass);
            this.annotationDeleteElement.classList.remove(this.cssClass);
            this.annotationCommentPanelElement.classList.remove(this.cssClass);
        } else {
            if (!this.isEnabled(this.annotationStrokeColorElement)) {
                this.annotationStrokeColorElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationThicknessElement)) {
                this.annotationThicknessElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationOpacityElement)) {
                this.annotationOpacityElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationDeleteElement)) {
                this.annotationDeleteElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationCommentPanelElement)) {
                this.annotationCommentPanelElement.className += this.disableClass;
            }
        }
        if (!this.isEnabled(this.annotationColorElement)) {
            this.annotationColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontColorElement)) {
            this.annotationFontColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontFamilyElement)) {
            this.annotationFontFamilyElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontSizeElement)) {
            this.annotationFontSizeElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextAlignElement)) {
            this.annotationTextAlignElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextPropertiesElement)) {
            this.annotationTextPropertiesElement.className += this.disableClass;
        }
    }
    /**
     * @returns {void}
     */
    public annotationAdd(): void {
        if (!this.isEnabled(this.annotationColorElement)) {
            this.annotationColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationStrokeColorElement)) {
            this.annotationStrokeColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationThicknessElement)) {
            this.annotationThicknessElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationOpacityElement)) {
            this.annotationOpacityElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontColorElement)) {
            this.annotationFontColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontFamilyElement)) {
            this.annotationFontFamilyElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontSizeElement)) {
            this.annotationFontSizeElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextAlignElement)) {
            this.annotationTextAlignElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextPropertiesElement)) {
            this.annotationTextPropertiesElement.className += this.disableClass;
        }
    }
    /**
     * @returns {void}
     */
    public annotationUnSelect(): void {
        if (!this.isEnabled(this.annotationColorElement)) {
            this.annotationColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationStrokeColorElement)) {
            this.annotationStrokeColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationThicknessElement)) {
            this.annotationThicknessElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationOpacityElement)) {
            this.annotationOpacityElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontColorElement)) {
            this.annotationFontColorElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontFamilyElement)) {
            this.annotationFontFamilyElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationFontSizeElement)) {
            this.annotationFontSizeElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextAlignElement)) {
            this.annotationTextAlignElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationTextPropertiesElement)) {
            this.annotationTextPropertiesElement.className += this.disableClass;
        }
        if (!this.isEnabled(this.annotationDeleteElement)) {
            this.annotationDeleteElement.className += this.disableClass;
        }
    }
    /**
     * @param {string} annotationType - The annotationType.
     * @returns {void}
     */
    public annotationSelect(annotationType: string): void {
        if (annotationType === 'FreeText') {
            this.annotationColorElement.classList.remove(this.cssClass);
            this.annotationStrokeColorElement.classList.remove(this.cssClass);
            this.annotationThicknessElement.classList.remove(this.cssClass);
            this.annotationOpacityElement.classList.remove(this.cssClass);
            this.annotationFontColorElement.classList.remove(this.cssClass);
            this.annotationFontFamilyElement.classList.remove(this.cssClass);
            this.annotationFontSizeElement.classList.remove(this.cssClass);
            this.annotationTextAlignElement.classList.remove(this.cssClass);
            this.annotationTextPropertiesElement.classList.remove(this.cssClass);
        }
        if (annotationType === 'Shape' || annotationType === 'Measure') {
            this.annotationColorElement.classList.remove(this.cssClass);
            this.annotationStrokeColorElement.classList.remove(this.cssClass);
            this.annotationThicknessElement.classList.remove(this.cssClass);
            this.annotationOpacityElement.classList.remove(this.cssClass);
            if (!this.isEnabled(this.annotationFontColorElement)) {
                this.annotationFontColorElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationFontFamilyElement)) {
                this.annotationFontFamilyElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationFontSizeElement)) {
                this.annotationFontSizeElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationTextAlignElement)) {
                this.annotationTextAlignElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationTextPropertiesElement)) {
                this.annotationTextPropertiesElement.className += this.disableClass;
            }
        }
        if (annotationType === 'TextMarkup') {
            this.annotationColorElement.classList.remove(this.cssClass);
            if (!this.isEnabled(this.annotationStrokeColorElement)) {
                this.annotationStrokeColorElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationThicknessElement)) {
                this.annotationThicknessElement.className += this.disableClass;
            }
            this.annotationOpacityElement.classList.remove(this.cssClass);
            if (!this.isEnabled(this.annotationFontColorElement)) {
                this.annotationFontColorElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationFontFamilyElement)) {
                this.annotationFontFamilyElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationFontSizeElement)) {
                this.annotationFontSizeElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationTextAlignElement)) {
                this.annotationTextAlignElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.annotationTextPropertiesElement)) {
                this.annotationTextPropertiesElement.className += this.disableClass;
            }
        }
        this.annotationDeleteElement.classList.remove(this.cssClass);
        this.annotationCommentPanelElement.classList.remove(this.cssClass);
    }
    /**
     * @param {string} fontFamily - The fontFamily.
     * @returns {void}
     */
    public updateFontFamilyInIcon(fontFamily: string): void {
        this.annotationFontFamilyInputElement.value = fontFamily;
    }
    /**
     * @param {number} fontSize - The fontSize.
     * @returns {void}
     */
    public updateFontSizeInIcon(fontSize: number): void {
        const fontValue: string = fontSize.toString() + 'px';
        this.annotationFontSizeInputElement.value = fontValue;
    }
    /**
     * @param {boolean} isEnable - To enable or disable.
     * @returns {void}
     */
    public enableSearchItems(isEnable: boolean): void {
        if (isEnable) {
            this.mobileSearchPreviousOccurenceElement.classList.remove(this.cssClass);
            this.mobileSearchNextOccurenceElement.classList.remove(this.cssClass);
        } else {
            if (!this.isEnabled(this.mobileSearchPreviousOccurenceElement)) {
                this.mobileSearchPreviousOccurenceElement.className += this.disableClass;
            }
            if (!this.isEnabled(this.mobileSearchNextOccurenceElement)) {
                this.mobileSearchNextOccurenceElement.className += this.disableClass;
            }
        }
    }
    /**
     * @param {boolean} isTapHidden - To enable or disable.
     * @returns {void}
     */
    public tapOnMobileDevice(isTapHidden: boolean): void {
        if (this.mobileToolbarContainerElement != null) {
            if (isTapHidden) {
                this.mobileToolbarContainerElement.style.display = 'none';
            } else {
                this.mobileToolbarContainerElement.style.display = 'block';
            }
        }
    }
    /**
     * @param {HTMLElement} element - The HTMLElement.
     * @returns {boolean} - Returns trur or false.
     */
    public isEnabled(element: HTMLElement): boolean {
        return element.classList.contains(this.cssClass);
    }
}
