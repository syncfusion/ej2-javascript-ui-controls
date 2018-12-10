import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n } from '@syncfusion/ej2-base';
import { ModuleDeclaration, Property, Event, EmitType } from '@syncfusion/ej2-base';
import { PdfViewerModel } from './pdfviewer-model';
import { ToolbarSettingsModel } from './pdfviewer-model';
import { ServerActionSettingsModel } from './pdfviewer-model';
import { PdfViewerBase } from './index';
import { Navigation } from './index';
import { Magnification } from './index';
import { Toolbar } from './index';
import { ToolbarItem } from './index';
import { LinkTarget, InteractionMode } from './base/types';
import { LinkAnnotation } from './index';
import { ThumbnailView } from './index';
import { BookmarkView } from './index';
import { TextSelection } from './index';
import { TextSearch } from './index';
import { Print } from './index';
// tslint:disable-next-line:max-line-length
import { IUnloadEventArgs, ILoadEventArgs, ILoadFailedEventArgs, IAjaxRequestFailureEventArgs, IPageChangeEventArgs, IPageClickEventArgs, IZoomChangeEventArgs, IHyperlinkClickEventArgs } from './index';

/**
 * The `ToolbarSettings` module is used to provide the toolbar settings of PDF viewer.
 * @hidden
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /**
     * Enable or disables the toolbar of PdfViewer.
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    @Property()
    public toolbarItem: ToolbarItem[];
}

/**
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
 * @hidden
 */
export class ServerActionSettings extends ChildProperty<ServerActionSettings> {
    /**
     * specifies the load action of PdfViewer.
     */
    @Property('Load')
    public load: string;

    /**
     * specifies the unload action of PdfViewer.
     */
    @Property('Unload')
    public unload: string;

    /**
     * specifies the render action of PdfViewer.
     */
    @Property('RenderPdfPages')
    public renderPages: string;

    /**
     * specifies the print action of PdfViewer.
     */
    @Property('RenderPdfPages')
    public print: string;

    /**
     * specifies the download action of PdfViewer.
     */
    @Property('Download')
    public download: string;

    /**
     * specifies the download action of PdfViewer.
     */
    @Property('RenderThumbnailImages')
    public renderThumbnail: string;
}

/**
 * Represents the PDF viewer component.
 * ```html
 * <div id="pdfViewer"></div>
 * <script>
 *  var pdfViewerObj = new PdfViewer();
 *  pdfViewerObj.appendTo("#pdfViewer");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class PdfViewer extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines the service url of the PdfViewer control.
     */
    @Property()
    public serviceUrl: string;

    /**
     * Returns the page count of the document loaded in the PdfViewer control.
     */
    get pageCount(): number {
        return this.viewerBase.pageCount;
    }

    /**
     * Returns the current page number of the document displayed in the PdfViewer control.
     */
    get currentPageNumber(): number {
        return this.viewerBase.currentPageNumber;
    }

    /**
     * Sets the PDF document path for initial loading.
     */
    @Property()
    public documentPath: string;

    /**
     * Returns the current zoom percentage of the PdfViewer control.
     */
    get zoomPercentage(): number {
        return this.magnificationModule.zoomFactor * 100;
    }

    /**
     * Gets or sets the document name loaded in the PdfViewer control.
     */
    public fileName: string = null;

    /**
     * Defines the scrollable height of the PdfViewer control.
     * @default auto
     */
    @Property('auto')
    public height: string | number;

    /**
     * Defines the scrollable width of the PdfViewer control.
     * @default auto
     */
    @Property('auto')
    public width: string | number;

    /**
     * Enable or disables the toolbar of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableToolbar: boolean;

    /**
     * Enable or disables the download option of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableDownload: boolean;

    /**
     * Enable or disables the print option of PdfViewer.
     * @default true
     */
    @Property(true)
    public enablePrint: boolean;

    /**    
     * Enables or disables the thumbnail view in the PDF viewer
     * @default true
     */
    @Property(true)
    public enableThumbnail: boolean;

    /**
     * Enables or disables the bookmark view in the PDF viewer
     * @default true
     */
    @Property(true)
    public enableBookmark: boolean;

    /**
     * Enables or disables the hyperlinks in PDF document.
     * @default true
     */
    @Property(true)
    public enableHyperlink: boolean;

    /**
     * Specifies the open state of the hyperlink in the PDF document.
     * @default CurrentTab
     */
    @Property('CurrentTab')
    public hyperlinkOpenState: LinkTarget;

    /**
     * Enable or disables the Navigation module of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableNavigation: boolean;

    /**
     * Enable or disables the Magnification module of PdfViewer.
     * @default true
     */
    @Property(true)
    public enableMagnification: boolean;

    /**
     * Enable or disables the text selection in the PdfViewer.
     * @default true
     */
    @Property(true)
    public enableTextSelection: boolean;

    /**
     * Enable or disables the text search in the PdfViewer.
     * @default true
     */
    @Property(true)
    public enableTextSearch: boolean;

    /**
     * Sets the interaction mode of the PdfViewer
     * @default TextSelection
     */
    @Property('TextSelection')
    public interactionMode: InteractionMode;

    /**
     * Defines the settings of the PdfViewer toolbar.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ showTooltip: true, toolbarItem: ['OpenOption', 'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'CommentOption', 'TextMarkupAnnotationOption', 'FreeTextAnnotationOption', 'InkAnnotationOption', 'ShapeAnnotationOption', 'StampAnnotation', 'SignatureOption', 'SearchOption', 'PrintOption', 'DownloadOption'] })
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Defines the settings of the PdfViewer service.
     */
    // tslint:disable-next-line:max-line-length
    @Property({ load: 'Load', renderPages: 'RenderPdfPages', unload: 'Unload', download: 'Download', renderThumbnail: 'RenderThumbnailImages' })
    public serverActionSettings: ServerActionSettingsModel;

    private viewerBase: PdfViewerBase;
    /**
     * @private
     */
    public navigationModule: Navigation;
    /**
     * @private
     */
    public toolbarModule: Toolbar;
    /**
     * @private
     */
    public magnificationModule: Magnification;
    /**
     * @private
     */
    public linkAnnotationModule: LinkAnnotation;
    /** @hidden */
    public localeObj: L10n;
    /**
     * @private
     */
    public thumbnailViewModule: ThumbnailView;
    /**
     * @private
     */
    public bookmarkViewModule: BookmarkView;
    /**
     * @private
     */
    public textSelectionModule: TextSelection;
    /**
     * @private
     */
    public textSearchModule: TextSearch;
    /**
     * @private
     */
    public printModule: Print;

    /** 
     * Gets the bookmark view object of the pdf viewer.
     * @returns { BookmarkView }
     */
    get bookmark(): BookmarkView {
        return this.bookmarkViewModule;
    }

    /** 
     * Gets the print object of the pdf viewer.
     * @returns { Print }
     */
    get print(): Print {
        return this.printModule;
    }

    /** 
     * Gets the magnification object of the pdf viewer.
     * @returns { Magnification }
     */
    get magnification(): Magnification {
        return this.magnificationModule;
    }
    /** 
     * Gets the navigation object of the pdf viewer.
     * @returns { Navigation }
     */
    get navigation(): Navigation {
        return this.navigationModule;
    }

    /** 
     * Gets the text search object of the pdf viewer.
     * @returns { TextSearch }
     */
    get textSearch(): TextSearch {
        return this.textSearchModule;
    }

    /** 
     * Gets the toolbar object of the pdf viewer.
     * @returns { Toolbar }
     */
    get toolbar(): Toolbar {
        return this.toolbarModule;
    }

    /**
     * Triggers while loading document into PdfViewer.
     * @event
     */
    @Event()
    public documentLoad: EmitType<ILoadEventArgs>;

    /**
     * Triggers while close the document
     * @event
     */
    @Event()
    public documentUnload: EmitType<IUnloadEventArgs>;

    /**
     * Triggers while loading document got failed in PdfViewer.
     * @event
     */
    @Event()
    public documentLoadFailed: EmitType<ILoadFailedEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     * @event
     */
    @Event()
    public ajaxRequestFailed: EmitType<IAjaxRequestFailureEventArgs>;

    /**
     * Triggers when the mouse click is performed over the page of the PDF document.
     * @event
     */
    @Event()
    public pageClick: EmitType<IPageClickEventArgs>;

    /**
     * Triggers when there is change in current page number.
     * @event
     */
    @Event()
    public pageChange: EmitType<IPageChangeEventArgs>;

    /**
     * Triggers when hyperlink in the PDF Document is clicked
     * @event
     */
    @Event()
    public hyperlinkClick: EmitType<IHyperlinkClickEventArgs>;

    /**
     * Triggers when there is change in the magnification value.
     * @event
     */
    @Event()
    public zoomChange: EmitType<IZoomChangeEventArgs>;

    constructor(options?: PdfViewerModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.viewerBase = new PdfViewerBase(this);
    }

    protected preRender(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }

    protected render(): void {
        this.viewerBase.initializeComponent();
        if (this.enableTextSelection && this.textSelectionModule) {
            this.textSelectionModule.enableTextSelectionMode();
        } else {
            this.viewerBase.disableTextSelectionMode();
        }
    }

    public getModuleName(): string {
        return 'PdfViewer';
    }

    /**
     * @private
     */
    public getLocaleConstants(): Object {
        return this.defaultLocale;
    }

    public onPropertyChanged(newProp: PdfViewerModel, oldProp: PdfViewerModel): void {
        let requireRefresh: boolean = false;
        if (this.isDestroyed) { return; }
        let properties: string[] = Object.keys(newProp);
        for (let prop of properties) {
            switch (prop) {
                case 'enableToolbar':
                    this.notify('', { module: 'toolbar', enable: this.enableToolbar });
                    requireRefresh = true;
                    break;
            }
        }
    }

    public getPersistData(): string {
        return 'PdfViewer';
    }

    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.enableMagnification) {
            modules.push({
                member: 'Magnification', args: [this, this.viewerBase]
            });
        }
        if (this.enableNavigation) {
            modules.push({
                member: 'Navigation', args: [this, this.viewerBase]
            });
        }
        if (this.enableToolbar) {
            modules.push({
                member: 'Toolbar', args: [this, this.viewerBase]
            });
        }
        if (this.enableHyperlink) {
            modules.push({
                member: 'LinkAnnotation', args: [this, this.viewerBase]
            });
        }
        if (this.enableThumbnail) {
            modules.push({
                member: 'ThumbnailView', args: [this, this.viewerBase]
            });
        }
        if (this.enableBookmark) {
            modules.push({
                member: 'BookmarkView', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSelection) {
            modules.push({
                member: 'TextSelection', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSearch) {
            modules.push({
                member: 'TextSearch', args: [this, this.viewerBase]
            });
        }
        if (this.enablePrint) {
            modules.push({
                member: 'Print', args: [this, this.viewerBase]
            });
        }
        return modules;
    }
    /** @hidden */
    public defaultLocale: Object = {
        'PdfViewer': 'PDF Viewer',
        'Cancel' : 'Cancel',
        'Download' : 'Download file',
        'Enter Password' : 'This document is password protected. Please enter a password.',
        'File Corrupted' : 'File Corrupted',
        'File Corrupted Content' : 'The file is corrupted and cannot be opened.',
        'Fit Page' : 'Fit Page',
        'Fit Width' : 'Fit Width',
        'Automatic' : 'Automatic',
        'Go To First Page' : 'Show first page',
        'Invalid Password' : 'Incorrect Password. Please try again.',
        'Next Page' : 'Show next page',
        'OK': 'OK',
        'Open' : 'Open file',
        'Page Number' : 'Current page number',
        'Previous Page' : 'Show previous page',
        'Go To Last Page' : 'Show last page',
        'Zoom' : 'Zoom',
        'Zoom In' : 'Zoom in',
        'Zoom Out' : 'Zoom out',
        'Page Thumbnails': 'Page thumbnails',
        'Bookmarks': 'Bookmarks',
        'Print' : 'Print file',
        'Password Protected' : 'Password Required',
        'Copy': 'Copy',
        'Text Selection': 'Text selection tool',
        'Panning': 'Pan mode',
        'Text Search': 'Find text',
        'Find in document': 'Find in document',
        'Match case': 'Match case',
         // tslint:disable-next-line:max-line-length
        'No matches': 'Viewer has finished searching the document.No more matches were found',
        // tslint:disable-next-line:max-line-length
        'Server error': 'Web-service is not listening. PDF Viewer depends on web-service for all it\'s features. Please start the web service to continue.'
    };

    // /**
    //  * Shows /hides the toolbar in the PdfViewer
    //  * @param  {boolean} enableToolbar
    //  * @returns void
    //  */
    // public showToolbar(enableToolbar: boolean): void {
    //     this.toolbarModule.showToolbar(enableToolbar);
    // }

    // /**
    //  * Shows /hides the the toolbar items in the PdfViewer
    //  * @param  {string[]} items
    //  * @param  {boolean} isVisible
    //  * @returns void
    //  */
    // public showToolbarItem(items: ToolbarItem[], isVisible: boolean): void {
    //     if (this.toolbarModule) {
    //         this.toolbarModule.showToolbarItem(items, isVisible);
    //     }
    // }

    // /**
    //  * Enables /disables the the toolbar items in the PdfViewer
    //  * @param  {string[]} items
    //  * @param  {boolean} isEnable
    //  * @returns void
    //  */
    // public enableToolbarItem(items: ToolbarItem[], isEnable: boolean): void {
    //     if (this.toolbarModule) {
    //         this.toolbarModule.enableToolbarItem(items, isEnable);
    //     }
    // }

    // /**
    //  * Navigate to given Page number
    //  * Note : In case if we have provided incorrect page number as argument it will retain the existing page
    //  * @param  {number} pageNumber
    //  * @returns void
    //  */
    // public goToPage(pageNumber: number): void {
    //     this.navigationModule.goToPage(pageNumber);
    // }

    // /**
    //  * Navigate to First page of the PDF document
    //  * @returns void
    //  */
    // public goToFirstPage(): void {
    //     this.navigationModule.goToFirstPage();
    // }

    // /**
    //  * Navigate to Previous page of the PDF document
    //  * @returns void
    //  */
    // public goToPreviousPage(): void {
    //     this.navigationModule.goToPreviousPage();
    // }

    // /**
    //  * Navigate to Next page of the PDF document
    //  * @returns void
    //  */
    // public goToNextPage(): void {
    //     this.navigationModule.goToNextPage();
    // }

    // /**
    //  * Navigate to Last page of the PDF document
    //  * @returns void
    //  */
    // public goToLastPage(): void {
    //     this.navigationModule.goToLastPage();
    // }

    // /**
    //  * Zoom the PDF document to the given zoom value
    //  * @param  {number} zoomValue
    //  * @returns void
    //  */
    // public zoomTo(zoomValue: number): void {
    //     if (this.viewerBase.pageCount !== 0) {
    //         this.magnificationModule.zoomTo(zoomValue);
    //     }
    // }

    // /**
    //  * Magnifies the page to the next value in the zoom drop down list.
    //  * @returns void
    //  */
    // public zoomIn(): void {
    //     this.magnificationModule.zoomIn();
    // }

    // /**
    //  * Magnifies the page to the previous value in the zoom drop down list.
    //  * @returns void
    //  */
    // public zoomOut(): void {
    //     this.magnificationModule.zoomOut();
    // }

    // /**
    //  * Scales the page to fit the page in the container in the control.
    //  * @param  {number} zoomValue
    //  * @returns void
    //  */
    // public fitToPage(): void {
    //     this.magnificationModule.fitToPage();
    // }

    // /**
    //  * Scales the page to fit the page width to the width of the container in the control.
    //  * @returns void
    //  */
    // public fitToWidth(): void {
    //     this.magnificationModule.fitToWidth();
    // }

    /**
     * Loads the given PDF document in the PDF viewer control
     * @param  {string} document
     * @param  {string} password
     * @returns void
     */
    public load(document: string, password: string): void {
        if (this.viewerBase.pageCount !== 0) {
            this.viewerBase.clear(true);
        } else {
            this.viewerBase.clear(false);
        }
        this.viewerBase.pageCount = 0;
        this.viewerBase.currentPageNumber = 0;
        if (this.toolbarModule) {
            this.toolbarModule.resetToolbar();
        }
        this.viewerBase.initiatePageRender(document, password);
    }

    // /**
    //  * Display Bookmarks the PDF Document being loaded in the ejPdfViewer control
    //  * @returns any
    //  */
    // // tslint:disable-next-line
    // public getBookmarks(): any {
    //     if (this.enableBookmark) {
    //         // tslint:disable-next-line:max-line-length
    //         return { bookmarks: this.bookmarkViewModule.bookmarks , bookmarksDestination: this.bookmarkViewModule.bookmarksDestination };
    //     }
    // }

    // /**
    //  * Navigate To current Bookmark Location the PDF document being loaded in the ejPdfViewer control.
    //  * @returns void
    //  */
    // public navigateBookmark(pageIndex: number, Y: number): void {
    //     this.bookmarkViewModule.navigateTo(pageIndex, Y);
    // }

    /**
     * Downloads the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    public download(): void {
        if (this.enableDownload) {
            this.viewerBase.download();
        }
    }

    // /**
    //  * Print the PDF document being loaded in the ejPdfViewer control.
    //  * @returns void
    //  */
    // public print(): void {
    //     if (this.enablePrint) {
    //         this.printModule.print();
    //     }
    // }

    // /**
    //  * Searches the target text in the PDF document and highlights the occurrences in the pages
    //  * @param  {string} searchText
    //  * @param  {boolean} isMatchCase
    //  * @returns void
    //  */
    // public searchText(searchText: string, isMatchCase: boolean): void {
    //     if (this.textSearchModule) {
    //         this.textSearchModule.searchText(searchText, isMatchCase);
    //     }
    // }

    // /**
    //  * Searches the next occurrence of the searched text from the current occurrence of the PdfViewer. 
    //  * @returns void
    //  */
    // public searchNext(): void {
    //     if (this.textSearchModule) {
    //         this.textSearchModule.searchNext();
    //     }
    // }

    // /**
    //  * Searches the previous occurrence of the searched text from the current occurrence of the PdfViewer. 
    //  * @returns void
    //  */
    // public searchPrevious(): void {
    //     if (this.textSearchModule) {
    //         this.textSearchModule.searchPrevious();
    //     }
    // }

    // /**
    //  * Cancels the text search of the PdfViewer. 
    //  * @returns void
    //  */
    // public cancelTextSearch(): void {
    //     if (this.textSearchModule) {
    //         this.textSearchModule.cancelTextSearch();
    //     }
    // }

    /**
     * Unloads the PDF document being displayed in the PDF viewer.
     * @returns void
     */
    public unload(): void {
        this.viewerBase.clear(true);
        this.viewerBase.pageCount = 0;
        this.toolbarModule.resetToolbar();
        this.magnificationModule.zoomTo(100);
    }

    /**
     * Destroys all managed resources used by this object.
     */
    public destroy(): void {
        super.destroy();
        this.element.classList.remove('e-pdfviewer');
        if (this.toolbarModule) {
        this.toolbarModule.destroy();
        }
        while (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.lastChild);
        }
        this.viewerBase.destroy();
    }

    /**
     * @private
     */
    public fireDocumentLoad(): void {
        let eventArgs: ILoadEventArgs = { name: 'documentLoad', documentName: this.fileName };
        this.trigger('documentLoad', eventArgs);
    }

    /**
     * @private
     */
    public fireDocumentUnload(fileName: string): void {
        let eventArgs: ILoadEventArgs = { name: 'documentUnload', documentName: fileName };
        this.trigger('documentUnload', eventArgs);
    }

    /**
     * @private
     */
    public fireDocumentLoadFailed(isPasswordRequired: boolean, password: string): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: ILoadFailedEventArgs = { name: 'documentLoadFailed', documentName: this.fileName, isPasswordRequired: isPasswordRequired, password: password };
        this.trigger('documentLoadFailed', eventArgs);
    }

    /**
     * @private
     */
    public fireAjaxRequestFailed(errorStatusCode: number, errorMessage: string): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: IAjaxRequestFailureEventArgs = { name: 'ajaxRequestFailed', documentName: this.fileName, errorStatusCode: errorStatusCode, errorMessage: errorMessage };
        this.trigger('ajaxRequestFailed', eventArgs);
    }

    /**
     * @private
     */
    public firePageClick(x: number, y: number, pageNumber: number): void {
        let eventArgs: IPageClickEventArgs = { name: 'pageClick', documentName: this.fileName, x: x, y: y, pageNumber: pageNumber };
        this.trigger('pageClick', eventArgs);
    }

    /**
     * @private
     */
    public firePageChange(previousPageNumber: number): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: IPageChangeEventArgs = { name: 'pageChange', documentName: this.fileName, currentPageNumber: this.viewerBase.currentPageNumber, previousPageNumber: previousPageNumber };
        this.trigger('pageChange', eventArgs);
    }

    /**
     * @private
     */
    public fireZoomChange(): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: IZoomChangeEventArgs = { name: 'zoomChange', zoomValue: this.magnificationModule.zoomFactor * 100, previousZoomValue: this.magnificationModule.previousZoomFactor * 100 };
        this.trigger('zoomChange', eventArgs);
    }

    /**
     * @private
     */
    public fireHyperlinkClick(hyperlink: string): void {
        // tslint:disable-next-line:max-line-length
        let eventArgs: IHyperlinkClickEventArgs = { name: 'hyperlinkClick', hyperlink: hyperlink };
        this.trigger('hyperlinkClick', eventArgs);
    }
}
