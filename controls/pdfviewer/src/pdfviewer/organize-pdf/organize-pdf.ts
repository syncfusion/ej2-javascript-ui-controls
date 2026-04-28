import { PdfViewer, PdfViewerBase, AjaxHandler, ISize, PageOrganizerSettingsModel } from '../index';
import { Browser, isNullOrUndefined, Draggable, DragEventArgs, Droppable, DropEventArgs } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Toolbar, ContextMenu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { ChangeEventArgs, Slider, TextBox } from '@syncfusion/ej2-inputs';
import { addSelectionRingStyle, applyElementStyles, clear, createOrganizeWindow, createOrganizeWindowForMobile, handleImageResizerVisibility, removeSelectionRingStyle, setPageOrganizerSettings, showOrganizeLoadingIndicator, switchPageOrganizer } from './organize-core/organize-initialization';
import { deletePageElement, isHoveredOnSelectedPages } from './organize-core/tile-interaction';
import { updateToolbarItemState } from './organize-core/organize-toolbar';
import { getImageZoomMax, getImageZoomMin, handleImageSizeBoundsChange, handlePageZoomChange, updateOrganizePageImageSize } from './organize-core/slider-zoomaction';
import { pageDragDrop } from './organize-core/organizepages-editor';
import { addOrganizeAction, redo, undo } from './organize-core/organize-undoredo';
import { getImageZoomValue, processRotation, rotateClockwise, rotateCounterclockwise, sorting } from './organize-core/organize-math-utils';
import { rotateAllPages } from './organize-core/organize-utils';
import { createRequestForPreview, getData, previewOnMessage, requestPreviewCreation, updatePreviewCollection } from './organize-core/organize-preview';
import { thumbnailMouseOver, tileImageRender } from './organize-core/organize-thumbnail';
import { autoScroll, handlePageMove } from './organize-core/organize-event-handler';
import { clonedCollection } from './organize-core/organize-undoredoutils';
import { importDocuments, loadImportDoc } from './organize-core/organize-importaction';
import { onSaveasClicked, onSaveClicked, updateOrganizePageActions } from './organize-core/organize-saveaction';
import { showHideExtractIcon, showRemoveExtractIcon } from './organize-core/organize-extract';

interface IActionOrganizeElements {
    action: string;
    UndoRedoTileActions: OrganizeDetails[];
    toolbarActions: OrganizeDetails[];
    selectedPagesIndexes: number[],
    dropIndex: number,
    isRightInsertion: boolean
}

/**
 * The `PageOrganizer` module is used to handle page organize operations of PDF viewer.
 *
 * @param {Event} event - The event triggering the page organization.
 * @param {Object} args - Additional arguments for the page organization.
 * @returns {void}
 */

export class PageOrganizer {
    /**
     * @private
     */
    public pdfViewer: PdfViewer;
    /**
     * @private
     */
    public pdfViewerBase: PdfViewerBase;
    private rotateRightButton: HTMLButtonElement;
    private rotateLeftButton: HTMLButtonElement;
    private insertRightButton: HTMLButtonElement;
    private insertLeftButton: HTMLButtonElement;
    private deleteButton: HTMLButtonElement;
    private copyButton: HTMLButtonElement;
    private pageZoomElement: HTMLElement;
    private pageZoomDropDown: DropDownButton;
    private pageZoomSlider: Slider;
    private pageZoomDecreaseButton: HTMLButtonElement;
    private pageZoomIncreaseButton: HTMLButtonElement;
    private pageZoomContainer: HTMLElement;
    private toolbar: Toolbar;
    /**
     * @private
     */
    public importDocInputElement: HTMLElement;
    /**
     * @private
     */
    public importedDocumentName: string;
    private previewLimit: number = 5;
    private lastRequestedPageIndex: number = 0;
    private pageZoomSliderStep: number = 0.25;
    private currentPageZoomSliderValue: number;
    private previouslyRequestedImageZoom: number;
    /**
     * @private
     */
    public importedDocumentData: string;
    /**
     * @private
     */
    public dataDetails: any[] = [];
    /**
     * @private
     */
    public dialogDivElement: HTMLElement
    /**
     * @private
     */
    public waitingPopup: HTMLElement
    private thumbnail: HTMLElement;
    private imageContainer: HTMLElement;
    /**
     * @private
     */
    public organizeDialog: Dialog;
    /**
     * @private
     */
    public tileAreaWrapper: HTMLElement;
    /**
     * @private
     */
    public tileAreaDiv: HTMLElement;
    private thumbnailImage: HTMLImageElement;
    private importImageWrapper: HTMLElement;
    private pageLink: HTMLElement;
    private previewRequestHandler: AjaxHandler;
    private contextMenuObj: ContextMenu;
    private mobileContextMenu: MenuItemModel[] = [];
    /**
     * @private
     */
    public organizePagesCollection: OrganizeDetails[] = [];
    /**
     * @private
     */
    public tempOrganizePagesCollection: OrganizeDetails[] = [];
    private isSkipRevert: boolean = false;
    private isAllImagesReceived: boolean = false;
    private selectAllCheckBox: CheckBox;
    /**
     * @private
     */
    public totalCheckedCount: number;
    /**
     * @private
     */
    public selectedPageIndexes: number[] = [];
    private dragEndIndex: number;
    /**
     * @private
     */
    public dragHoveredIndex: number;
    private dragObj: Draggable;
    private dropObj: Droppable;
    /**
     * @private
     */
    public virtualEle: HTMLElement;
    private previousClientY: number;
    /**
     * @private
     */
    public autoScrollInterval: number = null;
    private isRightInsertion: boolean;
    /**
     * @private
     */
    public gapBetweenDivs: number = 48;
    private previousImageZoom: number = 1;
    private currentImageZoom: number;
    /**
     * @private
     */
    public isDocumentModified: boolean = false;

    /**
     * @private
     */
    public undoOrganizeCollection: IActionOrganizeElements[] = [];
    /**
     * @private
     */
    public redoOrganizeCollection: IActionOrganizeElements[] = [];
    /**
     * @private
     */
    public toolbarUndoRedoCollection: OrganizeDetails[] = [];
    private startTile: HTMLElement;
    private ctrlKey: boolean;
    private shiftKey: boolean;
    private isClickedOnCheckBox: boolean;
    private isTouchEvent: boolean = false;
    private isPageZoomChanged: boolean = false;
    private isInitialLoading: boolean = true;
    private boundOnTileAreaMouseDown: (event: MouseEvent) => void;
    private boundOnTileAreaKeyDown: (event: KeyboardEvent) => void;
    private boundOnTileAreaKeyUp: (event: KeyboardEvent) => void;
    private boundPageOrganizerOnScroll: (event: WheelEvent) => void;
    private boundPageZoomDropDownOpen: () => void;
    private boundPageZoomDropDownClose: () => void;
    private boundPageZoomChange: (event: ChangeEventArgs) => void;
    private boundIncreasePageZoom: () => void;
    private boundDecreasePageZoom: () => void;
    private boundImportDocument: () => void;
    private boundExtractInputChange: () => void;
    private extractButtonClickHandler: () => void;

    /**
     * @private
     */
    public extractButtonElement: HTMLElement;

    /**
     * @private
     */
    public isOrganizeWindowOpen: boolean = false;
    /**
     * @private
     */
    public isPageZoomPopupOpen: boolean = false;
    /**
     * @private
     */
    public extractDialog: Dialog;
    /**
     * @private
     */
    public extractPagesInput: TextBox;
    /**
     * @private
     */
    public isExtractToolbarVisible: boolean = false;
    /**
     * @private
     */
    public deleteExtractValue: string = '';
    /**
     * @private
     */
    public extractSecondaryToolbar: Toolbar;

    /**
     * @param {PdfViewer} pdfViewer - It describes about the pdfviewer
     * @param {PdfViewerBase} pdfViewerBase - It describes about the pdfviewer base
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.setPageOrganizerSettings(this.pdfViewer.pageOrganizerSettings);
        this.currentImageZoom = this.pdfViewer.pageOrganizerSettings.imageZoom;
        this.currentPageZoomSliderValue = this.pdfViewer.pageOrganizerSettings.imageZoom;
        this.previouslyRequestedImageZoom = Math.round(this.pdfViewer.pageOrganizerSettings.imageZoom);
    }
    /**
     * @param {boolean} isReConstruct - It describes about the isReConstruct
     * @private
     * @returns {void}
     */
    public createOrganizeWindow(isReConstruct?: boolean): void {
        createOrganizeWindow.call(this, isReConstruct);
    }

    /**
     * @param {boolean} isReConstruct - Defines whether organizer window is reconstructed when closing
     * @private
     * @returns {void}
     */
    public createOrganizeWindowForMobile(isReConstruct?: boolean): void {
        createOrganizeWindowForMobile.call(this, isReConstruct);
    }

    /**
     * @private
     * @param {PageOrganizerSettingsModel} pageOrganizerSettings - new page organizer settings object
     * @param {oldpageOrganizerSettings} oldPageOrganizerSettings - old page organizer settings object
     * @returns {void}
     */
    public setPageOrganizerSettings(pageOrganizerSettings: PageOrganizerSettingsModel,
                                    oldPageOrganizerSettings?: PageOrganizerSettingsModel): void {
        setPageOrganizerSettings.call(this, pageOrganizerSettings, oldPageOrganizerSettings);
    }

    /**
     * @private
     * @param {string} property - new toolbar item in organize toolbar.
     * @returns {void}
     */
    public updateToolbarItemState(property?: string): void {
        updateToolbarItemState.call(this, property);
    }

    /**
     * @private
     * @returns {number} - number
     */
    public getImageZoomMin(): number {
        return getImageZoomMin.call(this);
    }

    /**
     * @private
     * @returns {number} - number
     */
    public getImageZoomMax(): number {
        return getImageZoomMax.call(this);
    }

    /**
     * @private
     * @returns {void}
     */
    public createRequestForPreview(): any {
        return createRequestForPreview.call(this);
    }

    /**
     * @private
     * @param {PageOrganizer} proxy It describes about the page organizer
     * @returns {void}
     */
    public requestPreviewCreation(proxy: PageOrganizer): void {
        requestPreviewCreation.call(this, proxy);
    }

    /**
     * @param {any} data - It describes about the data
     * @private
     * @returns {void}
     */
    public updatePreviewCollection(data: any): void {
        updatePreviewCollection.call(this, data);
    }

    /**
     * @param {any} event - It describes about the event
     * @private
     * @returns {void}
     */
    public previewOnMessage(event: any): void {
        previewOnMessage.call(this, event);
    }


    /**
     * @param {any} data - It describes about the data
     * @param {boolean} isClientRender - It describes about the isClientRender
     * @private
     * @returns {void}
     */
    public getData(data: any, isClientRender: boolean): void {
        return getData.call(this, data, isClientRender);
    }

    /**
     * @param {any} event - It describes about the event
     * @private
     * @returns {void}
     */
    public pageDragDrop(event: any): void {
        pageDragDrop.call(this, event);
    }

    /**
     * @private
     * @param {any} a - a value
     * @param {any} b - b value
     * @returns {number} - number
     */
    public sorting (a: any, b: any): number {
        return sorting.call(this, a, b);
    }

    /**
     * @param {number} pageIndex - It describes about the page index
     * @param {number} subIndex - It describes about the sub index
     * @param {number} pageOrder - It describes about the page order
     * @param {HTMLElement} targetElement - It describes about the target element
     * @param {boolean} isNewPage - It describes about the isNewPage
     * @param {boolean} isBefore - It describes about the isBefore
     * @param {boolean} isEmptyPage - It describes about the isEmptyPage
     * @param {boolean} isImportedPage - It describes about the isImportedPage
     * @param {string} documentName - It describes about the documentName
     * @private
     * @returns {void}
     */
    public tileImageRender(pageIndex: number, subIndex?: number, pageOrder?: number, targetElement?: HTMLElement,
                           isNewPage?: boolean, isBefore?: boolean, isEmptyPage?: boolean, isImportedPage?: boolean ,
                           documentName?: string): void {
        tileImageRender.call(this, pageIndex, subIndex, pageOrder, targetElement, isNewPage, isBefore,
                             isEmptyPage, isImportedPage, documentName);
    }

    /**
     * @param {DragEventArgs} e - It describes about the event
     * @private
     * @returns {void}
     */
    public autoScroll(e: DragEventArgs): void {
        autoScroll.call(this, e);
    }

    /**
     * @param {DragEventArgs} e - It describes about the event
     * @param {DOMRect} tileRect - It describes about rect
     * @param {number} gapBetweenDivs - It describes about div gap
     * @param {HTMLElement} outerBorder - It describes about border
     * @private
     * @returns {void}
     */
    public handlePageMove(e: DropEventArgs, tileRect: DOMRect, gapBetweenDivs: number,
                          outerBorder: HTMLElement): void {
        handlePageMove.call(this, e, tileRect, gapBetweenDivs, outerBorder);
    }

    /**
     * @private
     * @returns {void}
     */
    public addSelectionRingStyle(): void {
        addSelectionRingStyle.call(this);
    }

    /**
     * @private
     * @returns {void}
     */
    public removeSelectionRingStyle(): void {
        removeSelectionRingStyle.call(this);
    }

    /**
     * @param {number[]} selectedPageIndexes - It describes about the selected page index
     * @param {number} hoveredIndex - It describes about hovered index
     * @private
     * @returns {boolean} - Returns boolean value
     */
    public isHoveredOnSelectedPages(selectedPageIndexes: number[], hoveredIndex: number): boolean {
        return isHoveredOnSelectedPages.call(this, selectedPageIndexes, hoveredIndex);
    }

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public thumbnailMouseOver = (event: MouseEvent): void => {
        thumbnailMouseOver.call(this, event);
    };

    /**
     * @param {MouseEvent} event - It describes about the event
     * @private
     * @returns {void}
     */
    public thumbnailMouseLeave = (event: MouseEvent): void => {
        if (event.currentTarget instanceof HTMLElement) {
            // Convert HTMLCollection to an array
            const childrenArray: Element[] = Array.from(event.currentTarget.children);
            // Iterate over the array
            for (const subchild of childrenArray) {
                const childArray: Element[] = Array.from(subchild.children);
                for (const child of childArray) {
                    // Exclude the image by checking its type
                    if (!(child.classList.contains('e-pv-image-container'))) {
                        if (event.currentTarget.classList.contains('e-pv-organize-node-selection-ring')) {
                            if (child.classList.contains('e-checkbox-wrapper')) {
                                (child as HTMLElement).style.display = 'block';
                            }
                            else {
                                (child as HTMLElement).style.display = 'none';
                            }
                        } else {
                            // Set the display style property to "none" for other children
                            (child as HTMLElement).style.display = 'none';
                        }

                    }
                }
            }
        }
    };

    /**
     * @param {OrganizeDetails[]} UndoRedoTileActions - Specifies the details of the action occured page
     * @param {string} actionString - Specifies the Name of the action
     * @param {OrganizeDetails[]} toolbarActions - Collection to store multiple action as single action
     * @param {number[]} selectedPageIndexes - Collection to store selected page index
     * @param {number} dropIndex - Specifies where the page should be dropped
     * @param {boolean} isRightInsertion - Used to check whether the page should be dropped at right
     * @returns {void}
     * @private
     */
    public addOrganizeAction(
        UndoRedoTileActions: OrganizeDetails[], actionString: string,
        toolbarActions: OrganizeDetails[], selectedPageIndexes: number[], dropIndex: number, isRightInsertion: boolean): void {
        addOrganizeAction.call(this, UndoRedoTileActions, actionString, toolbarActions, selectedPageIndexes, dropIndex, isRightInsertion);
    }

    /**
     * @private
     * @returns {void}
     */
    public onSaveClicked(): void {
        onSaveClicked.call(this);
    }


    /**
     * @param {boolean} isShow - specifies the isShow boolean.
     * @returns {void}
     * @private
     */
    public showOrganizeLoadingIndicator(isShow: boolean): void {
        showOrganizeLoadingIndicator.call(this, isShow);
    }

    /**
     * @private
     * @returns {void}
     */
    public undo = (): void => {
        undo.call(this);
    }

    /**
     * @private
     * @returns {void}
     */
    public redo = (): void => {
        redo.call(this);
    }

    /**
     * @param {HTMLElement} mainTileElement - It describes about tile element
     * @private
     * @returns {void}
     */
    public deletePageElement(mainTileElement: HTMLElement): void {
        deletePageElement.call(this, mainTileElement);
    }

    private clonedCollection(tempCollecion: OrganizeDetails): OrganizeDetails{
        return clonedCollection.call(this, tempCollecion);
    }

    /**
     * @param {string} documentData - specifies the documentData.
     * @param {string} password - specifies the password.
     * @param {boolean} isPasswordCorrect - specifies the isPasswordCorrect.
     * @returns {void}
     * @private
     */
    public loadImportDoc(documentData: string, password: string, isPasswordCorrect: boolean): void{
        loadImportDoc.call(this, documentData, password, isPasswordCorrect);
    }

    /**
     * @param {string} password - specifies the password.
     * @param {string} documentName - specifies the documentName.
     * @param {string} documentData - specifies the documentData.
     * @returns {void}
     * @private
     */
    public importDocuments(password: string, documentName: string, documentData: string): void {
        importDocuments.call(this, password, documentName, documentData);
    }

    /**
     * @private
     * @returns {void}
     */
    public updateOrganizePageCollection(): void {
        this.organizePagesCollection = JSON.parse(JSON.stringify(this.tempOrganizePagesCollection));
    }

    /**
     *
     * @param {any} pageCanvas - It describes about the page canvas
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public applyElementStyles(pageCanvas: any, pageNumber: number): void {
        applyElementStyles.call(this, pageCanvas, pageNumber);
    }

    /**
     * @private
     * @returns {void}
     */
    public onSaveasClicked(): void {
        onSaveasClicked.call(this);
    }

    /**
     * @private
     * @returns {void}
     */
    public updateOrganizePageActions(): void {
        updateOrganizePageActions.call(this);
    }

    /**
     *
     * Rotates all pages in the PDF Viewer by the specified angle.
     *
     * @param {PdfPageRotateAngle} pageRotateAngle - The angle by which to rotate the pages (PdfPageRotateAngle).
     *                          The rotation can be 0, 90, 180, or 270 degrees.
     * @returns {void}
     * @private
     */
    public rotateAllPages(pageRotateAngle: PdfPageRotateAngle): void {
        rotateAllPages.call(this, pageRotateAngle);
    }

    /**
     * Rotates the specified pages in the PDF Viewer by the specified angle.
     *
     * @param {number} pageIndexes - The array of page indexes to rotate.
     * @param {PdfPageRotateAngle} pageRotateAngle - The angle by which to rotate the pages (PdfPageRotateAngle).
     *                          The rotation can be 0, 90, 180, or 270 degrees.
     * @returns {void}
     * @private
     */
    public rotatePages(pageIndexes: number[], pageRotateAngle: PdfPageRotateAngle): void;

    /**
     * @private
     * @returns {void}
     */
    public rotatePages(pageStartIndex: number, pageEndIndex: number, pageRotateAngle: PdfPageRotateAngle): void;

    /**
     * @private
     * @returns {void}
     */
    public rotatePages(pageRotations: PageRotation[]): void;

    /**
     * @param {number} arg1 - It describes about the arg1
     * @param {number} arg2 - It describes about the arg2
     * @private
     * @returns {void}
     */
    public rotatePages(arg1: number | number[] | PageRotation[], arg2?: number | PdfPageRotateAngle): void {
        if (this.pdfViewer.pageOrganizerSettings.canRotate) {
            if (Array.isArray(arg1)) {
                // Check if the second argument is provided and is of type PdfPageRotateAngle
                if (arg2 !== undefined && typeof arg2 === 'number') {
                    const pageIndexes: number[] = arg1 as number[];
                    const rotateAngle: PdfPageRotateAngle = arg2 as PdfPageRotateAngle;
                    processRotation(pageIndexes, rotateAngle);
                } else {
                    // Handle case: RotatePages(pageRotations: PageRotation[])
                    const pageRotations: PageRotation[] = arg1 as PageRotation[];
                    for (const pageRotation of pageRotations) {
                        processRotation([pageRotation.pageIndex], pageRotation.rotationAngle);
                    }
                }
            }
            else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
                // Handle case: RotatePages(pageStartIndex, pageEndIndex, PdfPageRotateAngle.RotateAngle90)
                const pageStartIndex: number = arg1 as number;
                const pageEndIndex: number = arg2 as number;
                // eslint-disable-next-line
                const rotateAngle: PdfPageRotateAngle = arguments[2] as PdfPageRotateAngle;
                processRotation(this.generateRange(pageStartIndex, pageEndIndex), rotateAngle);
            }
        }
    }

    private generateRange(start: number, end: number): number[] {
        return Array.from({ length: end - start + 1 }, (_: any, index: number) => start + index);
    }

    /**
     * @private
     * @param {number} newSize The size to which image zoom is to be updated
     * @param {number} oldSize The present value of image zoom
     * @returns {void}
     */
    public updateOrganizePageImageSize(newSize: number, oldSize?: number): void {
        updateOrganizePageImageSize.call(this, newSize, oldSize);
    }

    /**
     * Rotates the specified pages clockwise by 90 degrees.
     *
     * @param {number} pageNumbers - Array of page numbers to rotate.
     * @private
     * @returns {void}
     */
    public rotateClockwise(pageNumbers: number[]): void {
        rotateClockwise.call(this, pageNumbers);
    }

    /**
     * Rotates the specified pages counterclockwise by 90 degrees.
     *
     * @param {number} pageNumbers - Array of page numbers to rotate.
     * @private
     * @returns {void}
     */
    public rotateCounterclockwise(pageNumbers: number[]): void {
        rotateCounterclockwise.call(this, pageNumbers);
    }

    /**
     * Opens the page organizer dialog within the Pdf Viewer, allowing for management of PDF pages.
     *
     * ```html
     * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
     * ```
     * ```ts
     * let viewer: PdfViewer = new PdfViewer();
     * viewer.appendTo("#pdfViewer");
     * viewer.documentLoad = () => {
     *      viewer.pageOrganizer.openPageOrganizer();
     * }
     * ```
     *
     * @returns {void}
     */
    public openPageOrganizer(): void {
        if (!isNullOrUndefined(this.pdfViewer.pageOrganizer)) {
            if (this.isAllImagesReceived) {
                if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                    this.createOrganizeWindow();
                }
                else {
                    this.createOrganizeWindowForMobile();
                }
            }
        }
        else {
            this.pdfViewerBase.getModuleWarningMessage('PageOrganizer');
        }
    }

    /**
     * Closes the currently open page organizer dialog within the PDF Viewer, if present.
     *
     * ```html
     * <div id="pdfViewer" style="height: 100%;width: 100%;"></div>
     * ```
     * ```ts
     * let viewer: PdfViewer = new PdfViewer();
     * viewer.appendTo("#pdfViewer");
     * viewer.documentLoad = () => {
     *      viewer.pageOrganizer.closePageOrganizer();
     * }
     * ```
     *
     * @returns {void}
     */
    public closePageOrganizer(): void {
        if (!isNullOrUndefined(this.pdfViewer.pageOrganizer)) {
            if (!isNullOrUndefined(this.organizeDialog) && this.isOrganizeWindowOpen) {
                this.organizeDialog.hide();
            }
        }
        else {
            this.pdfViewerBase.getModuleWarningMessage('PageOrganizer');
        }
    }

    /**
     * @private
     * @param {PageOrganizerSettingsModel} newProp The new pageOrganizerSettings Property of PdfViewer from onPropertyChanged
     * @returns {void}
     */
    public handleImageSizeBoundsChange(newProp: PageOrganizerSettingsModel): void {
        handleImageSizeBoundsChange.call(this, newProp);
    }

    /**
     * @private
     * @param {boolean} showImageZoomingSlider The new showImageZoomingSlider property of PdfViewer.PageOrganizerSettings from onPropertyChanged
     * @returns {void}
     */
    public handleImageResizerVisibility(showImageZoomingSlider: boolean): void {
        handleImageResizerVisibility.call(this, showImageZoomingSlider);
    }

    /**
     * @private
     * @returns {void}
     */
    public switchPageOrganizer(): void {
        switchPageOrganizer.call(this);
    }

    /**
     * @private
     * @returns {void}
     */
    public getModuleName(): string {
        return 'PageOrganizer';
    }

    /**
     * @private
     * @param {boolean} isImageRequest defines if the function is called for image request
     * @param {number} size optional size can be sent to check valid page zoom value
     * @returns {number} imageZoom value
     */
    public getImageZoomValue(isImageRequest?: boolean, size?: number): number {
        return getImageZoomValue.call(this, isImageRequest, size);
    }

    /**
     * @private
     * @param {number} currentValue - It describes about current value.
     * @param {number} previousValue - It describes about previous value.
     * @returns {void}
     */
    public handlePageZoomChange(currentValue: number, previousValue: number): void {
        handlePageZoomChange.call(this, currentValue, previousValue);
    }

    /**
     * @private
     * @param {boolean} isShowRemove - It describes about show or remove the extract icon in organize window toolbar.
     * @returns {void}
     */
    public showRemoveExtractIcon(isShowRemove: boolean): void {
        showRemoveExtractIcon.call(this, isShowRemove);
    }

    /**
     * @private
     * @param {boolean} canExtractPages - It describes about show or hide the extract icon in organize window toolbar.
     * @returns {void}
     */
    public showHideExtractIcon(canExtractPages: boolean): void {
        showHideExtractIcon.call(this, canExtractPages);
    }

    /**
     * @private
     * @returns {void}
     */
    public clear(): void {
        clear.call(this);
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.clear();
    }

}

/**
 * Enum for PdfPageRotateAngle
 */
export enum PdfPageRotateAngle {
    RotateAngle0 = 1,
    RotateAngle90 = 2,
    RotateAngle180 = 3,
    RotateAngle270 = 4,
    RotateAngle360 = 1
}

export class PageRotation {
    // eslint-disable-next-line
    constructor(public pageIndex: number, public rotationAngle: PdfPageRotateAngle) {}
}

/**
 * Interface representing details about a page, including rotation angle and page index.
 *
 * @hidden
 */
export interface PageDetails {
    rotateAngle: number;
    pageIndex: number;
}

/**
 * Interface representing details about organizing pages, including page ID, current page index, rotate angle, and status of insertion and deletion.
 */
export class OrganizeDetails {
    currentPageIndex: number;
    pageIndex: number;
    copiedPageIndex: number;
    isInserted: boolean;
    isDeleted: boolean;
    isCopied: boolean;
    istargetCopied: boolean;
    hasEmptyPageAfter: boolean;
    hasEmptyPageBefore: boolean;
    rotateAngle: number;
    pageSize: ISize;
    isImportedDoc: boolean;
    documentName: string;
    password: string;
    documentData: string;
    constructor(currentPageIndex: number, pageIndex: number, copiedPageIndex: number, isInserted: boolean,
                isDeleted: boolean, isCopied: boolean, istargetCopied: boolean, hasEmptyPageAfter: boolean,
                hasEmptyPageBefore: boolean, rotateAngle: number, pageSize: ISize, isImportedDoc: boolean,
                documentName: string, password: string, documentData: string) {
        this.currentPageIndex = currentPageIndex;
        this.pageIndex = pageIndex;
        this.copiedPageIndex = copiedPageIndex;
        this.isInserted = isInserted;
        this.isDeleted = isDeleted;
        this.isCopied = isCopied;
        this.istargetCopied = istargetCopied;
        this.hasEmptyPageAfter = hasEmptyPageAfter;
        this.hasEmptyPageBefore = hasEmptyPageBefore;
        this.rotateAngle = rotateAngle;
        this.pageSize = pageSize;
        this.isImportedDoc = isImportedDoc;
        this.documentName = documentName;
        this.password = password;
        this.documentData = documentData;
    }
}
